'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const parser = new MarkdownIt();

function tables(source) {
  const tokens = parser.parse(source, {});
  const result = new Map();
  let heading = '', rows, row;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open' && token.tag === 'h2') heading = tokens[i + 1].content;
    if (token.type === 'table_open') {
      if (result.has(heading)) throw new Error('Duplicate contract table: ' + heading);
      rows = []; result.set(heading, rows);
    }
    if (token.type === 'tr_open') row = [];
    if (token.type === 'td_open' || token.type === 'th_open') row.push(tokens[i + 1].content.replace(/`/g, ''));
    if (token.type === 'tr_close') rows.push(row);
    if (token.type === 'table_close') rows = null;
  }
  return result;
}

function readContract(root) {
  const parsed = tables(fs.readFileSync(path.join(root, 'analysis/process-contract.md'), 'utf8'));
  function records(name, columns) {
    const rows = parsed.get(name);
    if (!rows || JSON.stringify(rows[0]) !== JSON.stringify(columns)) throw new Error('Invalid contract table: ' + name);
    const seen = new Set();
    return rows.slice(1).map(cells => {
      if (cells.length !== columns.length || seen.has(cells[0])) throw new Error('Invalid or duplicate row: ' + name);
      seen.add(cells[0]);
      return Object.fromEntries(columns.map((col, i) => [col, cells[i]]));
    });
  }
  const list = text => text === 'none' ? [] : text.split('; ').map(s => s.trim());
  const flow = records('Stage Flow', ['Stage', 'Check role', 'Owner decision', 'Inputs', 'Outputs', 'Phase B only', 'Returns', 'Gates']).map(r => {
    if (!['yes','no'].includes(r['Owner decision'])) throw new Error('Invalid owner role: '+r.Stage);
    return {id:r.Stage, checkRole:r['Check role'],ownerGate:r['Owner decision']==='yes', inputs:list(r.Inputs), outputs:list(r.Outputs), delayedInputs:list(r['Phase B only']), returnTo:list(r.Returns), gates:list(r.Gates)};
  });
  if (flow.length !== 20 || flow.some((r,i)=>r.id !== 'stage-' + String(i).padStart(2,'0'))) throw new Error('Contract must cover Bootstrap and Stages 1-19 in order');
  for (const row of flow) {
    if (!['none','primary','independent','peer'].includes(row.checkRole)) throw new Error('Invalid check role: ' + row.id);
    for (const key of ['inputs','outputs','delayedInputs','returnTo','gates']) if (new Set(row[key]).size !== row[key].length) throw new Error('Duplicate ' + key + ': ' + row.id);
    if (row.delayedInputs.some(id=>!row.inputs.includes(id))) throw new Error('Delayed input is not an input: ' + row.id);
  }
  const gates = records('Closing Evidence', ['Stage','Label','Checks','Requirement']).map(r=>({id:r.Stage,label:r.Label,checks:list(r.Checks),requirement:r.Requirement}));
  if (gates.length !== 21 || gates.some((r,i)=>r.id !== (i===20?'complete':'stage-'+String(i).padStart(2,'0')))) throw new Error('Closing evidence must cover all stages and complete');
  const authors = records('Artifact Responsibilities', ['Artifact','Creator','Maintainer','Instructions']).map(r=>({id:r.Artifact,en:{creator:r.Creator,maintainer:r.Maintainer,instructions:r.Instructions}}));
  const artifactIds = new Set(authors.map(r=>r.id)), stageIds = new Set(flow.map(r=>r.id));
  for (const row of flow) {
    if ([...row.inputs,...row.outputs].some(id=>!artifactIds.has(id))) throw new Error('Unknown artifact in '+row.id);
    if (row.returnTo.some(id=>!stageIds.has(id))) throw new Error('Unknown return stage in '+row.id);
  }
  return {flow,gates,authors};
}

function projectedFiles(root) {
  const contract = readContract(root), result = new Map();
  const gateFile = 'analysis/stage-gates.json';
  const gates = JSON.parse(fs.readFileSync(path.join(root,gateFile),'utf8'));
  gates.description = 'Derived from process-contract.md. English Markdown defines the rules; Russian fields are 3D presentation translations.';
  gates.stages = contract.gates.map(row=>({...gates.stages.find(r=>r.id===row.id),id:row.id,label:row.label,checks:row.checks,requirements:{...gates.stages.find(r=>r.id===row.id)?.requirements,en:row.requirement}}));
  result.set(gateFile, JSON.stringify(gates,null,2)+'\n');
  const registryFile = 'analysis/artifact-responsibilities.json';
  const registry = JSON.parse(fs.readFileSync(path.join(root,registryFile),'utf8'));
  const newAuthors = contract.authors.filter(row => !registry.artifacts.some(item => item.id === row.id));
  if (newAuthors.length) {
    const companion = JSON.parse(fs.readFileSync(path.join(root, 'analysis/process-canvas/artifact-responsibilities.json'), 'utf8'));
    for (const author of newAuthors) {
      if (!companion[author.id]?.ru) throw new Error('Missing translated responsibility: ' + author.id);
      registry.artifacts.push({ id: author.id, label: author.id, responsibility: { en: author.en, ru: companion[author.id].ru } });
    }
  }
  if (registry.artifacts.length !== contract.authors.length) throw new Error('Artifact registry coverage differs from MD');
  for (const artifact of registry.artifacts) {
    const author = contract.authors.find(row=>row.id===artifact.id);
    if (!author) throw new Error('Unknown artifact in registry: '+artifact.id);
    artifact.responsibility.en = author.en;
  }
  result.set(registryFile, JSON.stringify(registry,null,2)+'\n');
  const file = 'analysis/process-canvas/artifact-responsibilities.json';
  if (fs.existsSync(path.join(root,file))) {
    const authors = JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
    if (contract.authors.length !== Object.keys(authors).length) throw new Error('Artifact responsibility coverage differs');
    for (const row of contract.authors) {if (!authors[row.id]) throw new Error('Unknown artifact: '+row.id); authors[row.id].en=row.en;}
    result.set(file, JSON.stringify(authors,null,2)+'\n');
  }
  return result;
}

function synchronize(root, check = true) {
  for (const [file, expected] of projectedFiles(root)) {
    const actual = fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
    if (actual === expected) continue;
    if (check) throw new Error(file + ' differs from process-contract.md; run process-contract.js --write');
    fs.writeFileSync(path.join(root,file),expected);
  }
}

if (require.main === module) {
  try { synchronize(path.resolve(__dirname,'../..'), !process.argv.includes('--write')); console.log('Markdown process contract and projections agree'); }
  catch (error) { console.error(error.message); process.exitCode=1; }
}
module.exports = {tables,readContract,projectedFiles,synchronize};
