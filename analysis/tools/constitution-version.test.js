'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const YAML = require('yaml');
const { constitutionVersion } = require('./constitution-version');
const { validateConstitutionVersion, loadAndValidateStatus, run } = require('./status-validator');
const { temporaryDirectory, validStatus, writeStatus } = require('./helpers');

test('constitution version comes from document metadata, not examples or decision placeholders', () => {
  const source = '# Constitution\n\n> **Version:** `9.9.9`\n\n```md\n**Version:** `8.8.8`\n```\n\n- **Approved constitution version:** `pending`\n\n**Status:** TEMPLATE - NOT RATIFIED\n**Version:** `0.2.2-draft`\n**Ratified:** pending\n';
  assert.equal(constitutionVersion(source), '0.2.2-draft');
  assert.equal(constitutionVersion('`Version: 9.9.9`\n\n' + source), '0.2.2-draft');
  assert.equal(constitutionVersion('<!--\n**Version:** 9.9.9\n-->\n\n' + source), '0.2.2-draft');
  assert.equal(constitutionVersion('**Version:** 1.0.0\n`Version: 9.9.9`\n'), '1.0.0');
  for (const invalid of ['', source.replace('**Version:** `0.2.2-draft`', '**Version:** `pending`'),
    source + '\n**Version:** `0.2.2-draft`\n', source.replace('**Version:** `0.2.2-draft`', ''),
    '**Version:**\n`Version: 0.2.2-draft`\n', '<!--\n**Version:** 9.9.9\n-->\n',
    '**Version:** 1.0.0\n\n**Version:** pending owner decision\n']) {
    assert.throws(() => constitutionVersion(invalid), /exactly one/);
  }
});

test('fresh starter status template matches its unratified constitution', () => {
  const root = path.resolve(__dirname, '../..');
  if (fs.existsSync(path.join(root, '.migration-starter.json'))) return;
  const status = YAML.parse(fs.readFileSync(path.join(root, 'analysis/migration_status.template.yaml'), 'utf8'));
  const version = constitutionVersion(fs.readFileSync(path.join(root, '.specify/memory/constitution.md'), 'utf8'));
  assert.equal(status.constitution.version, version);
  assert.equal(status.constitution.status, 'unratified');
});

test('bootstrap status audit rejects version drift without modifying either record', t => {
  const root = temporaryDirectory(t, 'constitution-version-');
  const status = validStatus();
  const file = writeStatus(root, status);
  const constitution = path.join(root, '.specify/memory/constitution.md');
  assert.equal(run({ file }).ok, true);
  assert.doesNotThrow(() => loadAndValidateStatus(file));
  fs.writeFileSync(constitution, '# Constitution\n\n**Version:** `0.2.2-draft`\n');
  const before = [fs.readFileSync(file), fs.readFileSync(constitution)];
  assert.equal(run({ file }).ok, false);
  assert.throws(() => loadAndValidateStatus(file), /does not match/);
  assert.deepEqual([fs.readFileSync(file), fs.readFileSync(constitution)], before);
  assert.equal(status.constitution.status, 'unratified');
  fs.unlinkSync(constitution);
  assert.match(validateConstitutionVersion(status, root).join('\n'), /constitution is missing/);
});

test('project version is compared with its own constitution, not the current starter draft', t => {
  const root = temporaryDirectory(t, 'constitution-ratified-');
  const status = validStatus({ constitution: { version: '2.3.1', status: 'ratified' } });
  writeStatus(root, status);
  assert.deepEqual(validateConstitutionVersion(status, root), []);
  status.constitution.version = '2.3.0';
  assert.match(validateConstitutionVersion(status, root).join('\n'), /does not match/);
});
