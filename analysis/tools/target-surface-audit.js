#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  AuditResult,
  parseArgs,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  resolveInside,
  validateSchema,
  walkFiles,
} = require('./lib');

const nonEmpty = { type: 'string', minLength: 1, pattern: '\\S' };

const TARGET_INVENTORY_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['schema_version', 'adapters', 'surfaces'],
  properties: {
    schema_version: { const: 1 },
    adapters: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'type'],
        properties: {
          id: nonEmpty,
          type: { const: 'json' },
          file: nonEmpty,
          collection: nonEmpty,
          mapping: {
            type: 'object',
            properties: {
              surface_id: nonEmpty,
              kind: nonEmpty,
              destination: nonEmpty,
              roles: nonEmpty,
              visible: nonEmpty,
            },
            additionalProperties: false,
          },
          defaults: { type: 'object' },
        },
        allOf: [
          {
            if: { properties: { type: { const: 'json' } }, required: ['type'] },
            then: { required: ['file', 'mapping'] },
          },
        ],
        additionalProperties: false,
      },
    },
    marker_scans: {
      type: 'array',
      items: {
        type: 'object',
        required: ['root', 'extensions', 'markers'],
        properties: {
          root: nonEmpty,
          extensions: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
          markers: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
        },
        additionalProperties: false,
      },
    },
    surfaces: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'kind', 'destination', 'roles', 'visibility', 'status', 'actions'],
        properties: {
          id: nonEmpty,
          kind: nonEmpty,
          destination: nonEmpty,
          roles: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
          visibility: { enum: ['visible', 'hidden'] },
          status: { enum: ['implemented', 'gap', 'deferred'] },
          target_only: { type: 'boolean' },
          target_requirement: nonEmpty,
          adapter_required: { type: 'boolean' },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'description', 'roles', 'sdd', 'code', 'tests'],
              properties: {
                id: nonEmpty,
                description: nonEmpty,
                roles: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
                sdd: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
                code: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
                tests: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['reference', 'roles'],
                    properties: {
                      reference: nonEmpty,
                      roles: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
          },
        },
        if: {
          properties: { target_only: { const: true } },
          required: ['target_only'],
        },
        then: { required: ['target_requirement'] },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};

function getAtPath(value, dottedPath) {
  if (!dottedPath) return value;
  return dottedPath.split('.').reduce((current, part) => {
    if (current == null) return undefined;
    return current[part];
  }, value);
}

function normalizeObservation(raw, adapter) {
  const mapping = adapter.mapping || {};
  const defaults = adapter.defaults || {};
  const read = (field) => {
    const mapped = mapping[field];
    return mapped ? getAtPath(raw, mapped) : defaults[field];
  };
  const roles = read('roles');
  return {
    adapter: adapter.id,
    surface_id: read('surface_id') || null,
    kind: read('kind') || null,
    destination: read('destination') || null,
    roles: Array.isArray(roles) ? roles : roles ? [roles] : [],
    visible: read('visible') === undefined ? true : Boolean(read('visible')),
  };
}

async function collectAdapter(root, adapter) {
  if (adapter.type === 'json') {
    const file = resolveInside(root, adapter.file, `adapter ${adapter.id} file`);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) {
      throw new Error(`adapter ${adapter.id} file must be a regular local file`);
    }
    const document = readJsonFile(file);
    const items = adapter.collection ? getAtPath(document, adapter.collection) : document;
    if (!Array.isArray(items)) {
      throw new Error(`adapter ${adapter.id} collection must resolve to an array`);
    }
    return items.map((item) => normalizeObservation(item, adapter));
  }

}

function splitReference(reference, requireAnchor, label, result) {
  const hashIndex = reference.indexOf('#');
  const relative = hashIndex === -1 ? reference : reference.slice(0, hashIndex);
  const anchor = hashIndex === -1 ? null : decodeURIComponent(reference.slice(hashIndex + 1));
  if (requireAnchor && !anchor) {
    result.fail(`${label} must identify concrete evidence after #: ${reference}`);
    return null;
  }
  return { relative, anchor };
}

function validateReference(root, reference, options, result) {
  const parsed = splitReference(reference, options.requireAnchor, options.label, result);
  if (!parsed) return;
  let absolute;
  try {
    absolute = resolveInside(root, parsed.relative, options.label);
  } catch (error) {
    result.fail(error.message);
    return;
  }
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    result.fail(`${options.label} references missing file ${parsed.relative}`);
    return;
  }
  if (fs.lstatSync(absolute).isSymbolicLink()) {
    result.fail(`${options.label} must not reference a symbolic link: ${parsed.relative}`);
    return;
  }
  if (!parsed.anchor) return;
  const body = fs.readFileSync(absolute, 'utf8');
  const matchingLines = body.split(/\r?\n/).filter((line) => line.includes(parsed.anchor));
  if (!matchingLines.length) {
    result.fail(`${options.label} references missing "${parsed.anchor}" in ${parsed.relative}`);
    return;
  }
  if (options.surfaceId && !matchingLines.some((line) => line.includes(`@surface:${options.surfaceId}`))) {
    result.fail(`${options.label} lacks @surface:${options.surfaceId} on the referenced evidence line`);
  }
  for (const role of options.roles || []) {
    if (!matchingLines.some((line) =>
      line.includes(`@surface:${options.surfaceId}`) && line.includes(`@role:${role}`))) {
      result.fail(`${options.label} lacks @role:${role} on the referenced evidence line`);
    }
  }
}

function scanMarkers(root, scans, result) {
  for (const scan of scans || []) {
    let directory;
    try {
      directory = resolveInside(root, scan.root, 'marker scan root');
    } catch (error) {
      result.fail(error.message);
      continue;
    }
    if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
      result.fail(`marker scan root does not exist: ${scan.root}`);
      continue;
    }
    const extensions = new Set(scan.extensions.map((extension) =>
      extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`));
    for (const file of walkFiles(directory)) {
      if (!extensions.has(path.extname(file).toLowerCase())) continue;
      const body = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const marker of scan.markers) {
        if (body.includes(marker.toLowerCase())) {
          result.fail(`${path.relative(root, file)} contains forbidden visible marker "${marker}"`);
        }
      }
    }
  }
}

function validateInventory(root, inventory, observations, result, checkReferences = true) {
  result.merge(validateSchema(TARGET_INVENTORY_SCHEMA, inventory), 'target inventory ');
  if (!result.ok) return;

  const surfacesById = new Map();
  const surfacesByKey = new Map();
  for (const surface of inventory.surfaces) {
    const key = `${surface.kind}\0${surface.destination}`;
    if (surfacesById.has(surface.id)) result.fail(`duplicate surface id "${surface.id}"`);
    if (surfacesByKey.has(key)) result.fail(`duplicate surface destination ${surface.kind}:${surface.destination}`);
    surfacesById.set(surface.id, surface);
    surfacesByKey.set(key, surface);

    if (surface.status === 'implemented' && !surface.actions.length) {
      result.fail(`${surface.id} is implemented but has no useful action or observable contract`);
    }
    if (surface.status !== 'implemented' && surface.visibility !== 'hidden') {
      result.fail(`${surface.id} is ${surface.status} but remains visible`);
    }

    const coveredRoles = new Set();
    for (const action of surface.actions) {
      for (const role of action.roles) {
        if (!surface.roles.includes(role)) {
          result.fail(`${surface.id} action ${action.id} uses undeclared role ${role}`);
        }
        coveredRoles.add(role);
      }
      const testedRoles = new Set(action.tests.flatMap((test) => test.roles));
      for (const role of action.roles) {
        if (!testedRoles.has(role)) result.fail(`${surface.id} action ${action.id} has no test for role ${role}`);
      }
      for (const test of action.tests) {
        for (const role of test.roles) {
          if (!action.roles.includes(role)) {
            result.fail(`${surface.id} action ${action.id} test uses undeclared action role ${role}`);
          }
        }
      }
      if (checkReferences) {
        for (const reference of action.sdd) {
          validateReference(root, reference, {
            label: `${surface.id} action ${action.id} SDD`,
            requireAnchor: true,
          }, result);
        }
        for (const reference of action.code) {
          validateReference(root, reference, {
            label: `${surface.id} action ${action.id} code`,
            requireAnchor: false,
          }, result);
        }
        for (const test of action.tests) {
          validateReference(root, test.reference, {
            label: `${surface.id} action ${action.id} test`,
            requireAnchor: true,
            surfaceId: surface.id,
            roles: test.roles,
          }, result);
        }
      }
    }
    if (surface.status === 'implemented') {
      for (const role of surface.roles) {
        if (!coveredRoles.has(role)) result.fail(`${surface.id} has no useful action for role ${role}`);
      }
    }
    if (surface.target_only && checkReferences) {
      validateReference(root, surface.target_requirement, {
        label: `${surface.id} target requirement`,
        requireAnchor: true,
      }, result);
    }
  }

  const observedSurfaceIds = new Set();
  for (const observation of observations) {
    if (!observation.kind || !observation.destination) {
      result.fail(`adapter ${observation.adapter} returned an observation without kind and destination`);
      continue;
    }
    const surface = observation.surface_id
      ? surfacesById.get(observation.surface_id)
      : surfacesByKey.get(`${observation.kind}\0${observation.destination}`);
    if (!surface) {
      result.fail(`adapter ${observation.adapter} exposed ungoverned ${observation.kind}:${observation.destination}`);
      continue;
    }
    if (surface.kind !== observation.kind || surface.destination !== observation.destination) {
      result.fail(`adapter ${observation.adapter} observation for ${surface.id} disagrees with inventory kind/destination`);
    }
    observedSurfaceIds.add(surface.id);
    if (observation.visible && (surface.visibility === 'hidden' || surface.status !== 'implemented')) {
      result.fail(`adapter ${observation.adapter} exposes ${surface.id}, which is ${surface.status}/${surface.visibility}`);
    }
    for (const role of observation.roles) {
      if (!surface.roles.includes(role)) {
        result.fail(`adapter ${observation.adapter} exposes undeclared role ${role} on ${surface.id}`);
      }
    }
  }
  for (const surface of inventory.surfaces) {
    const required = surface.adapter_required !== false &&
      surface.status === 'implemented' &&
      surface.visibility === 'visible';
    if (required && !observedSurfaceIds.has(surface.id)) {
      result.fail(`implemented visible surface ${surface.id} was not found by any adapter`);
    }
  }
}

async function auditTargetSurface(input = {}) {
  const root = path.resolve(input.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const inventoryFile = path.resolve(
    input.inventoryFile ||
    process.env.TARGET_SURFACE_INVENTORY ||
    path.join(root, 'analysis', 'inventories', 'target-surface-inventory.json')
  );
  const result = new AuditResult('TARGET SURFACE AUDIT');
  let inventory;
  try {
    inventory = readJsonFile(inventoryFile);
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  const schemaErrors = validateSchema(TARGET_INVENTORY_SCHEMA, inventory);
  if (schemaErrors.length) {
    result.merge(schemaErrors, 'target inventory ');
    return result;
  }

  const observations = [];
  const adapterIds = new Set();
  for (const adapter of inventory.adapters) {
    if (adapterIds.has(adapter.id)) {
      result.fail(`duplicate adapter id "${adapter.id}"`);
      continue;
    }
    adapterIds.add(adapter.id);
    try {
      observations.push(...await collectAdapter(root, adapter));
    } catch (error) {
      result.fail(error.message);
    }
  }
  validateInventory(root, inventory, observations, result, input.checkReferences !== false);
  scanMarkers(root, inventory.marker_scans, result);
  result.summary = `${inventory.surfaces.length} surfaces; ${observations.length} adapter observations; ${inventory.adapters.length} adapters`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root', 'inventory'], [
    'AUDIT_ROOT',
    'TARGET_SURFACE_INVENTORY',
  ]);
  auditTargetSurface({ root: args.root, inventoryFile: args.inventory })
    .then((result) => {
      process.exitCode = printResult(result);
    })
    .catch((error) => {
      console.error(`FAIL: ${error.stack || error.message}`);
      process.exitCode = 1;
    });
}

module.exports = {
  TARGET_INVENTORY_SCHEMA,
  auditTargetSurface,
  collectAdapter,
  getAtPath,
  normalizeObservation,
  scanMarkers,
  validateInventory,
  validateReference,
};
