'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { bindingErrors, completionProviders } = require('./feature-dependencies');

// Scope comes from reviewed SDD, not a caller-supplied list of convenient slices.
function completionScope(root, features, activeSlice, dependencyAudit = null, governed = () => false) {
  const selected = new Set();
  const errors = [];
  function visit(feature) {
    if (!features.includes(feature)) {
      errors.push(`SDD completion scope references unknown slice: ${feature || '(missing active_slice)'}`);
      return;
    }
    if (selected.has(feature)) return;
    selected.add(feature);
    const file = path.join(root, feature, 'spec.md');
    const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '') : '';
    const section = body.match(/^## Change Impact and Verification Scope\s*$([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1] || '';
    const declarations = [...section.matchAll(/^- Completion dependencies:\s*([^\r\n]+)$/gm)];
    if (declarations.length !== 1) {
      errors.push(`${feature}/spec.md must declare exactly one Completion dependencies field in Change Impact and Verification Scope`);
      return;
    }
    const value = declarations[0][1].trim();
    if (value === 'graph' || governed(feature)) {
      const problems = bindingErrors(dependencyAudit, feature, body, true);
      errors.push(...problems);
      if (!problems.length) completionProviders(dependencyAudit.document, feature).forEach(visit);
      return;
    }
    if (value === 'none') return;
    const dependencies = value.split(',').map(item => item.trim());
    if (dependencies.some(item => !/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(item)) || new Set(dependencies).size !== dependencies.length || dependencies.includes(feature)) {
      errors.push(`${feature}/spec.md Completion dependencies must be none or unique comma-separated other slice IDs`);
      return;
    }
    dependencies.forEach(visit);
  }
  visit(activeSlice);
  return { selected, errors };
}

module.exports = { completionScope };
