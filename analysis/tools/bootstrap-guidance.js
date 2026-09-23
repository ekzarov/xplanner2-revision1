#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { rewrite } = require('./artifact-reference-links');

function createdFiles(root, manifest) {
  const entries = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  if (!Array.isArray(entries) || !entries.length) throw new Error('Expected newly created payload paths');
  const allowed = new Set();
  for (const entry of entries) {
    if (typeof entry !== 'string' || !entry || /[\\:\0]/.test(entry) ||
        path.posix.isAbsolute(entry) || /^[A-Za-z]:/.test(entry) ||
        entry.split('/').some(part => !part || part === '.' || part === '..')) {
      throw new Error('Invalid bootstrap payload path');
    }
    let current = root;
    for (const part of entry.split('/')) {
      current = path.join(current, part);
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Linked bootstrap payload path');
    }
    if (!fs.statSync(current).isFile()) throw new Error('Bootstrap payload entry must be a file');
    if (/\.(?:md|html|drawio)$/.test(entry) || entry === 'analysis/artifact-responsibilities.json') allowed.add(entry);
  }
  return allowed;
}

function synchronize(root, manifest) {
  const allowed = createdFiles(root, manifest);
  const result = spawnSync(process.execPath, [
    path.join(root, 'analysis/process-canvas/sync-practical-guidance.js'),
    `--bootstrap-created=${path.resolve(manifest)}`,
  ], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Bootstrap guidance generation failed');
  const links = rewrite(root, allowed);
  return { files: allowed.size, ...links };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '../..');
  const manifest = process.argv[2];
  if (!manifest) throw new Error('A newly created payload manifest is required');
  console.log('Bootstrap guidance prepared:', synchronize(root, manifest));
}

module.exports = { createdFiles, synchronize };
