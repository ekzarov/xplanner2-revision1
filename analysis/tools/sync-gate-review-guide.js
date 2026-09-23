#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const modes = {
  automatic: 'Automatic check', review: 'Agent review', decision: 'Owner decision',
  record: 'Result record', delegated: 'Configured command', related: 'Separate check',
};
const handoff = 'The Stage 15 agent creates sdd-record.md as a source-bound design handoff, not a machine gate receipt. The independent Stage 16 agent must read it and verify its source versions, coverage, assumptions and gaps against the actual SDD and approved inputs. audit:sdd checks the SDD package, but does not parse this report. Its green result is not approval of the report; the Stage 16 gate also requires applicable audits, a clean independent report and explicit owner decisions before implementation.';
const html = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cell = value => String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

function synchronize(root = ROOT, check = false, allowedFiles = null) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'analysis/process-canvas/data.json'), 'utf8'));
  const artifacts = new Map(data.artifacts.map(item => [item.id, item]));
  let changed = 0;
  const write = (relative, content) => {
    if (allowedFiles && !allowedFiles.has(relative)) return;
    const file = path.join(root, relative);
    if (relative.endsWith('.md')) content = require('./artifact-reference-links').linkedDocument(root, file, content);
    const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
    if (before === content) return;
    changed++;
    if (check) throw new Error(`${relative}: gate review guide is stale`);
    fs.writeFileSync(file, content);
  };
  const block = (relative, marker, content, insert) => {
    const original = fs.readFileSync(path.join(root, relative), 'utf8').replace(/\r\n/g, '\n');
    const start = `<!-- ${marker}_START -->`;
    const end = `<!-- ${marker}_END -->`;
    const value = `${start}\n${content}\n${end}`;
    const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
    const next = pattern.test(original) ? original.replace(pattern, () => value) : insert(original, value);
    if (next === original && !pattern.test(original)) throw new Error(`Cannot place ${marker} in ${relative}`);
    write(relative, next);
  };
  const entries = data.gates.map(gate => {
    if (!gate.reviewContract) throw new Error(`Missing contract for ${gate.id}`);
    const inputs = gate.reviewContract.inputs.map(input => {
      const artifact = artifacts.get(input.artifact);
      if (input.artifact && !artifact) throw new Error(`Unknown artifact ${input.artifact}`);
      const reference = input.reference || artifact.sourcePath;
      return {
        ...input, label: input.path || artifact.outputPath || artifact.label,
        url: `${data.repository}/blob/main/${reference.split('/').map(encodeURIComponent).join('/')}`,
      };
    });
    return { ...gate, inputs };
  });
  const md = entries.map(gate => [
    `<a id="${gate.id}"></a>`, `## ${gate.label}`, '', `**${gate.headline}**`, '', gate.desc, '',
    `**When:** ${gate.usage}`, '', `**Example:** ${gate.example}`, '',
    `**Boundary:** ${gate.reviewContract.boundary.en}`, '',
    '| Artifact or source | Who checks / role | What is checked or recorded |', '|---|---|---|',
    ...gate.inputs.map(input => `| [${cell(input.label)}](${input.url}) | ${modes[input.mode]} | ${cell(input.description.en)} |`), '',
    `**Implementation / procedure:** [${gate.sourcePath}](${data.repository}/blob/main/${gate.sourcePath}).`, '',
  ].join('\n')).join('\n');
  write('analysis/gate-review-guide.md', [
    '# Gate Inputs And Review Boundaries', '',
    '**Which problem does each gate catch, which files does it inspect, and who makes the decision?**', '',
    'Generated from the same gate contracts as the 3D canvas. Automatic checks, independent review and owner decisions are different obligations. A result record is not necessarily read by a script. Conditional inputs apply only to their declared scope; linked starter files are templates or implementations, not project evidence.', '',
    '## Contents', '', ...entries.map(gate => `- [${gate.label}](#${gate.id})`), '', md,
  ].join('\n'));

  const introMd = '**Read the question first, then check who does the verification.** Each gate names its files and distinguishes automatic checks, agent review, owner decisions and result records. See [all gate inputs and limits](gate-review-guide.md).\n\n**SDD handoff and its gate.** ' + handoff;
  block('analysis/migration_methodology.md', 'GATE_REVIEW_BOUNDARIES', introMd,
    (text, value) => text.replace('### How to read a gate', `### How to read a gate\n\n${value}`));
  const cards = entries.map(gate => `<details class="gate-contract"><summary><b>${html(gate.label)}</b>: ${html(gate.headline)}</summary><p>${html(gate.desc)}</p><p><b>When:</b> ${html(gate.usage)}</p><p><b>Example:</b> ${html(gate.example)}</p><p><b>Boundary:</b> ${html(gate.reviewContract.boundary.en)}</p><ul>${gate.inputs.map(input => `<li><b>${modes[input.mode]}:</b> <a href="${input.url}">${html(input.label)}</a>. ${html(input.description.en)}</li>`).join('')}</ul></details>`).join('\n');
  const presentation = `<section class="gate-review-reference" aria-label="Gate inputs and review boundaries"><h3>Gate inputs and review boundaries</h3><p><b>Which files does a gate check, and who makes the decision?</b> Expand a gate to see its exact responsibilities. Templates explain the format, not project evidence.</p><p><b>SDD handoff and its gate.</b> ${html(handoff)}</p>${cards}</section>`;
  block('analysis/migration_methodology.html', 'GATE_REVIEW_BOUNDARIES', presentation,
    (text, value) => text.replace(/(<p\b[^>]*><b>How to read a gate\.<\/b>[\s\S]*?<\/p>)/, `$1\n${value}`));
  block('analysis/migration_methodology.html', 'GATE_REVIEW_STYLE', '<style>\n.gate-review-reference { margin: 18px 0 28px; }\n.gate-contract { border-bottom: 1px solid var(--border, #344553); padding: 10px 0; }\n.gate-contract summary { cursor: pointer; line-height: 1.6; overflow-wrap: anywhere; }\n.gate-contract p, .gate-contract li { line-height: 1.65; }\n.gate-contract li { margin: 8px 0; overflow-wrap: anywhere; }\n.gate-contract ul { padding-left: 22px; }\n</style>',
    (text, value) => text.replace('</head>', `${value}\n</head>`));
  const rows = entries.map((gate, index) => {
    const value = `<b>${gate.label}</b><br><br><b>${gate.headline}</b><br><br>${gate.reviewContract.boundary.en}<br><br><a href="${data.repository}/blob/main/analysis/gate-review-guide.md#${gate.id}">Files, actors and limits</a>`;
    return `<mxCell id="gate-review-${gate.id}" parent="1" vertex="1" value="${html(value)}" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=16;fontSize=16;fillColor=#f5f7fa;strokeColor=#cbd5df;"><mxGeometry x="40" y="${80 + index * 270}" width="1120" height="240" as="geometry"/></mxCell>`;
  }).join('\n');
  block('analysis/migration_artifact_flow.drawio', 'GATE_REVIEW_BOUNDARIES', `<diagram id="gate-review-boundaries" name="Gate questions and review boundaries"><mxGraphModel grid="1" page="1" pageWidth="1200" pageHeight="${entries.length * 270 + 160}"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${rows}</root></mxGraphModel></diagram>`,
    (text, value) => text.replace('</mxfile>', `${value}\n</mxfile>`));
  return changed;
}

if (require.main === module) {
  const target = process.argv.find(arg => arg.startsWith('--target-root='));
  const root = target ? path.resolve(target.slice('--target-root='.length)) : ROOT;
  console.log(`Gate review guidance: ${synchronize(root, process.argv.includes('--check'))} changed files`);
}
module.exports = { synchronize, modes, handoff };
