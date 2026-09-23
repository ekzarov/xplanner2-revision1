'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  TARGET_INVENTORY_SCHEMA,
  auditTargetSurface,
  validateInventory,
} = require('./target-surface-audit');
const { AuditResult, readJsonFile, validateSchema } = require('./lib');
const { temporaryDirectory } = require('./helpers');

function writeTargetFixture(directory, options = {}) {
  fs.mkdirSync(path.join(directory, 'specs', '001-reports'), { recursive: true });
  fs.mkdirSync(path.join(directory, 'src'), { recursive: true });
  fs.mkdirSync(path.join(directory, 'tests'), { recursive: true });
  fs.mkdirSync(path.join(directory, 'analysis', 'inventories'), { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'specs', '001-reports', 'spec.md'),
    '# Reports\n\n## REQ-001 Generate report\n'
  );
  fs.writeFileSync(
    path.join(directory, 'src', 'reports.service.txt'),
    'generateReport creates a report from the selected period.\n'
  );
  fs.writeFileSync(
    path.join(directory, 'tests', 'reports.test.txt'),
    'generates a report @surface:reports @role:analyst\n'
  );
  fs.writeFileSync(path.join(directory, 'observed-surfaces.json'), JSON.stringify({
    endpoints: options.observations || [{
      surface: 'reports',
      type: 'screen',
      target: '/reports',
      permittedRoles: ['analyst'],
      isVisible: true,
    }],
  }, null, 2));
  const inventory = {
    schema_version: 1,
    adapters: [{
      id: 'generated-surface-model',
      type: 'json',
      file: 'observed-surfaces.json',
      collection: 'endpoints',
      mapping: {
        surface_id: 'surface',
        kind: 'type',
        destination: 'target',
        roles: 'permittedRoles',
        visible: 'isVisible',
      },
    }],
    marker_scans: [{
      root: 'src',
      extensions: ['.txt'],
      markers: ['coming soon'],
    }],
    surfaces: [{
      id: 'reports',
      kind: 'screen',
      destination: '/reports',
      roles: ['analyst'],
      visibility: 'visible',
      status: 'implemented',
      actions: [{
        id: 'generate-report',
        description: 'Generate a report for a selected period.',
        roles: ['analyst'],
        sdd: ['specs/001-reports/spec.md#REQ-001 Generate report'],
        code: ['src/reports.service.txt#generateReport'],
        tests: [{
          reference: 'tests/reports.test.txt#generates a report',
          roles: ['analyst'],
        }],
      }],
    }],
  };
  const inventoryFile = path.join(directory, 'analysis', 'inventories', 'target-surface-inventory.json');
  fs.writeFileSync(inventoryFile, JSON.stringify(inventory, null, 2));
  return { inventory, inventoryFile };
}

test('audits a stack-neutral declarative inventory through a JSON adapter', async (t) => {
  const directory = temporaryDirectory(t, 'target-audit-');
  const fixture = writeTargetFixture(directory);
  const result = await auditTargetSurface({
    root: directory,
    inventoryFile: fixture.inventoryFile,
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert(result.summary.includes('1 adapters'));
});

test('fails on an adapter-observed surface absent from inventory', async (t) => {
  const directory = temporaryDirectory(t, 'target-audit-');
  const fixture = writeTargetFixture(directory, {
    observations: [{
      surface: 'admin',
      type: 'screen',
      target: '/admin',
      permittedRoles: ['administrator'],
      isVisible: true,
    }],
  });
  const result = await auditTargetSurface({
    root: directory,
    inventoryFile: fixture.inventoryFile,
  });
  assert(result.errors.some((error) => error.includes('ungoverned screen:/admin')));
  assert(result.errors.some((error) => error.includes('reports was not found')));
});

test('fails when evidence is not bound to the surface and role', async (t) => {
  const directory = temporaryDirectory(t, 'target-audit-');
  const fixture = writeTargetFixture(directory);
  fs.writeFileSync(path.join(directory, 'tests', 'reports.test.txt'), 'generates a report\n');
  const result = await auditTargetSurface({
    root: directory,
    inventoryFile: fixture.inventoryFile,
  });
  assert(result.errors.some((error) => error.includes('lacks @surface:reports')));
  assert(result.errors.some((error) => error.includes('lacks @role:analyst')));
});

test('fails on visible placeholders and visible deferred surfaces', async (t) => {
  const directory = temporaryDirectory(t, 'target-audit-');
  const fixture = writeTargetFixture(directory);
  fs.appendFileSync(path.join(directory, 'src', 'reports.service.txt'), '\ncoming soon\n');
  fixture.inventory.surfaces[0].status = 'deferred';
  fs.writeFileSync(fixture.inventoryFile, JSON.stringify(fixture.inventory, null, 2));
  const result = await auditTargetSurface({
    root: directory,
    inventoryFile: fixture.inventoryFile,
  });
  assert(result.errors.some((error) => error.includes('deferred but remains visible')));
  assert(result.errors.some((error) => error.includes('forbidden visible marker')));
});

test('rejects executable module adapters from the governed inventory', () => {
  const errors = validateSchema(TARGET_INVENTORY_SCHEMA, {
    schema_version: 1,
    adapters: [{
      id: 'untrusted-module',
      type: 'module',
      module: 'surface-adapter.cjs',
    }],
    surfaces: [],
  });
  assert(errors.some((error) => error.includes('must be equal to constant')));
});

test('requires a useful action for every implemented surface role', (t) => {
  const directory = temporaryDirectory(t, 'target-audit-');
  const fixture = writeTargetFixture(directory);
  fixture.inventory.surfaces[0].roles.push('auditor');
  const result = new AuditResult('TARGET SURFACE AUDIT');
  validateInventory(directory, fixture.inventory, [{
    adapter: 'generated-surface-model',
    surface_id: 'reports',
    kind: 'screen',
    destination: '/reports',
    roles: ['analyst', 'auditor'],
    visible: true,
  }], result, false);
  assert(result.errors.some((error) => error.includes('no useful action for role auditor')));
});

test('fails closed when the target inventory is absent', async (t) => {
  const directory = temporaryDirectory(t, 'target-audit-');
  const result = await auditTargetSurface({
    root: directory,
    inventoryFile: path.join(directory, 'missing.json'),
  });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not exist')));
});

test('shipped inventory example matches the audit schema', () => {
  const example = readJsonFile(
    path.join(__dirname, '..', 'inventories', 'target-surface-inventory.example.json')
  );
  assert.deepEqual(validateSchema(TARGET_INVENTORY_SCHEMA, example), []);
});
