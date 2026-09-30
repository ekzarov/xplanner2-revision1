'use strict';

// Project tool test (xplanner2-revision1, constitution A4). No network: fetch is injected.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { restore } = require('./restore-upstream-sources');
const { temporaryDirectory } = require('./helpers');

const ORIGIN = 'https://svn.code.sf.net/p/xplanner-plus/code/!svn/bc/426/trunk/xplanner-plus/';
const sha = (text) => crypto.createHash('sha256').update(Buffer.from(text)).digest('hex');

function fixture(t, files, withheld = [], origin = ORIGIN) {
  const root = temporaryDirectory(t, 'restore-upstream-');
  fs.mkdirSync(path.join(root, 'sources', 'provenance'), { recursive: true });
  const allowlist = {
    origin, revision: 426, source_root: 'sources/xplanner-plus-r426',
    files: files.map(([p, body]) => ({ path: p, bytes: body.length, sha256: sha(body), url: origin + p })),
    withheld_files: withheld.map((p) => ({ path: p, sha256: sha('secret') })),
  };
  fs.writeFileSync(path.join(root, 'sources/provenance/xplanner-plus-r426-allowlist.json'), JSON.stringify(allowlist));
  return { root, allowlist };
}

const quiet = () => {};

test('restores allowlisted files with matching hashes', async (t) => {
  const { root } = fixture(t, [['src/A.java', 'class A {}'], ['conf/x.xml', '<x/>']], ['src/secret.properties']);
  const fetched = [];
  const bodies = { 'src/A.java': 'class A {}', 'conf/x.xml': '<x/>' };
  const result = await restore({ root, verifyPin: false, log: quiet, fetch: async (url) => { fetched.push(url); return Buffer.from(bodies[url.slice(ORIGIN.length)]); } });
  assert.equal(result.restored, 2);
  assert.equal(result.failed, 0);
  assert.ok(!fetched.some((u) => u.includes('secret')));
  assert.equal(fs.readFileSync(path.join(root, 'sources/xplanner-plus-r426/src/A.java'), 'utf8'), 'class A {}');
});

test('fails on a downloaded hash mismatch and writes nothing', async (t) => {
  const { root } = fixture(t, [['src/A.java', 'class A {}']]);
  const result = await restore({ root, verifyPin: false, log: quiet, fetch: async () => Buffer.from('tampered') });
  assert.equal(result.failed, 1);
  assert.ok(!fs.existsSync(path.join(root, 'sources/xplanner-plus-r426/src/A.java')));
});

test('fails when the origin is unavailable after retries', async (t) => {
  const { root } = fixture(t, [['src/A.java', 'class A {}']]);
  let calls = 0;
  const result = await restore({ root, verifyPin: false, log: quiet, retries: 2, fetch: async () => { calls += 1; throw new Error('HTTP 503'); } });
  assert.equal(result.failed, 1);
  assert.equal(calls, 2);
});

test('rejects a local file whose hash does not match instead of overwriting it', async (t) => {
  const { root } = fixture(t, [['src/A.java', 'class A {}']]);
  fs.mkdirSync(path.join(root, 'sources/xplanner-plus-r426/src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'sources/xplanner-plus-r426/src/A.java'), 'changed');
  const result = await restore({ root, verifyPin: false, log: quiet, fetch: async () => Buffer.from('class A {}') });
  assert.equal(result.failed, 1);
  assert.equal(fs.readFileSync(path.join(root, 'sources/xplanner-plus-r426/src/A.java'), 'utf8'), 'changed');
});

test('refuses an allowlist that is not pinned to the official revision 426', async (t) => {
  const { root } = fixture(t, [['src/A.java', 'class A {}']], [], 'https://example.invalid/trunk/');
  await assert.rejects(restore({ root, verifyPin: false, log: quiet, fetch: async () => Buffer.from('class A {}') }), /pinned official SVN revision 426/);
});

test('refuses a path that escapes the source root', async (t) => {
  const { root } = fixture(t, [['../../escape.txt', 'x']]);
  const result = await restore({ root, verifyPin: false, log: quiet, fetch: async () => Buffer.from('x') });
  assert.equal(result.failed, 1);
  assert.ok(!fs.existsSync(path.join(root, 'escape.txt')));
});

test('refuses a withheld path that is also listed as allowed', async (t) => {
  const { root } = fixture(t, [['src/secret.properties', 'x']], ['src/secret.properties']);
  let fetched = 0;
  const result = await restore({ root, verifyPin: false, log: quiet, fetch: async () => { fetched += 1; return Buffer.from('x'); } });
  assert.equal(result.failed, 1);
  assert.equal(fetched, 0);
});

test('refuses a file URL that is not exactly the pinned origin plus its path', async (t) => {
  const { root, allowlist } = fixture(t, [['src/A.java', 'class A {}']]);
  allowlist.files[0].url = 'https://example.invalid/src/A.java';
  fs.writeFileSync(path.join(root, 'sources/provenance/xplanner-plus-r426-allowlist.json'), JSON.stringify(allowlist));
  let fetched = 0;
  const result = await restore({ root, verifyPin: false, log: quiet, fetch: async () => { fetched += 1; return Buffer.from('class A {}'); } });
  assert.equal(result.failed, 1);
  assert.equal(fetched, 0);
});

test('refuses an allowlist that does not match its source_intake pin before fetching', async (t) => {
  const { root } = fixture(t, [['src/A.java', 'class A {}']]);
  fs.mkdirSync(path.join(root, 'config'), { recursive: true });
  const pinned = (hash, sourceRoot = 'sources/xplanner-plus-r426') => fs.writeFileSync(path.join(root, 'config/project.yaml'),
    `source_intake:
  source_roots:
    - '${sourceRoot}'
  inputs:
    - path: 'sources/provenance/xplanner-plus-r426-allowlist.json'
      sha256: '${hash}'
`);
  let fetched = 0;
  const fetch = async () => { fetched += 1; return Buffer.from('class A {}'); };
  pinned('0'.repeat(64));
  await assert.rejects(restore({ root, log: quiet, fetch }), /does not match its source_intake pin/);
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'sources/provenance/xplanner-plus-r426-allowlist.json'))).digest('hex');
  pinned(actual, 'elsewhere');
  await assert.rejects(restore({ root, log: quiet, fetch }), /source_root is not a pinned/);
  assert.equal(fetched, 0);
  pinned(actual);
  const result = await restore({ root, log: quiet, fetch });
  assert.equal(result.restored, 1);
});
