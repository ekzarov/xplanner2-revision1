'use strict';

// Only these historical architecture filenames have canonical replacements.
// Callers must still validate containment, regular files and the original hash.
const names = new Map([
  ['review-verdict.md', 'architecture-review-verdict.md'],
  ['nfr-owner-review.md', 'architecture-nfr-owner-review.md'],
  ['nfr-decision-register.xlsx', 'architecture-nfr-decision-register.xlsx'],
  ['nfr-manifest.json', 'architecture-nfr-manifest.json'],
  ['decision-backlog.md', 'architecture-decision-backlog.md'],
  ['file-recovery-protocol.md', 'architecture-file-recovery-protocol.md'],
]);

function architecturePath(value) {
  const normalized = value.replace(/\\/g, '/');
  return names.get(normalized) || normalized;
}

function architectureSourcePath(value) {
  const normalized = value.replace(/\\/g, '/');
  const prefix = 'analysis/architecture/';
  return normalized.startsWith(prefix)
    ? prefix + architecturePath(normalized.slice(prefix.length))
    : normalized;
}

module.exports = { architecturePath, architectureSourcePath };
