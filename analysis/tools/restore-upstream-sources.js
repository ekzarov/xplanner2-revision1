#!/usr/bin/env node
'use strict';

// Project tool (xplanner2-revision1, constitution A4): restore the allowlisted
// upstream XPlanner+ SVN r426 files into sources/xplanner-plus-r426 so that
// audit:project can verify source_intake where the raw source is not in Git
// (CI). Only allowlisted files are fetched, only from the pinned origin, and
// every file must match its SHA-256. Nothing downloaded is executed. Withheld
// files are never fetched. A missing file, a hash mismatch or an unavailable
// origin fails. Output is counts only; no file content is printed.

const crypto = require('node:crypto');
const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const ALLOWLIST = 'sources/provenance/xplanner-plus-r426-allowlist.json';

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

function httpsFetch(url, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: timeoutMs }, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    });
    request.on('timeout', () => request.destroy(new Error('timeout')));
    request.on('error', reject);
  });
}

function safeTarget(sourceRoot, relative) {
  const target = path.resolve(sourceRoot, relative);
  if (!target.startsWith(sourceRoot + path.sep)) throw new Error(`path escapes the source root: ${relative}`);
  return target;
}

async function restore({ root = ROOT, fetch = httpsFetch, concurrency = 8, retries = 3, log = console.log } = {}) {
  const allowlist = JSON.parse(fs.readFileSync(path.join(root, ALLOWLIST), 'utf8'));
  const origin = allowlist.origin;
  if (typeof origin !== 'string' || !/^https:\/\/svn\.code\.sf\.net\/p\/xplanner-plus\/code\/!svn\/bc\/426\//.test(origin)) {
    throw new Error('allowlist origin is not the pinned official SVN revision 426');
  }
  const sourceRoot = path.resolve(root, allowlist.source_root);
  const withheld = new Set((allowlist.withheld_files || []).map((file) => file.path));
  const counts = { present: 0, restored: 0, failed: 0 };
  const failures = [];
  const queue = [...allowlist.files];

  async function one(file) {
    if (withheld.has(file.path)) throw new Error(`withheld file listed as allowed: ${file.path}`);
    if (file.url !== origin + file.path) throw new Error(`file URL is not under the pinned origin: ${file.path}`);
    const target = safeTarget(sourceRoot, file.path);
    if (fs.existsSync(target)) {
      if (sha256(fs.readFileSync(target)) !== file.sha256) throw new Error(`local file hash mismatch: ${file.path}`);
      counts.present += 1;
      return;
    }
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt += 1) {
      try {
        const body = await fetch(file.url);
        if (sha256(body) !== file.sha256) throw new Error('downloaded hash mismatch');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, body);
        counts.restored += 1;
        return;
      } catch (error) {
        lastError = error;
        if (error.message === 'downloaded hash mismatch') break;
      }
    }
    throw new Error(`${file.path}: ${lastError.message}`);
  }

  async function worker() {
    while (queue.length) {
      const file = queue.shift();
      try { await one(file); } catch (error) { counts.failed += 1; failures.push(error.message); }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  log(`upstream sources: ${allowlist.files.length} allowlisted, ${counts.present} present, ${counts.restored} restored, ${counts.failed} failed, ${withheld.size} withheld (not fetched)`);
  for (const message of failures.slice(0, 10)) log(`FAIL: ${message}`);
  return { ...counts, failures };
}

if (require.main === module) {
  restore().then((result) => { process.exitCode = result.failed ? 1 : 0; })
    .catch((error) => { console.error(`FAIL: ${error.message}`); process.exitCode = 1; });
}

module.exports = { restore };
