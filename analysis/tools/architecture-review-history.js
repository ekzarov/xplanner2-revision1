'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const YAML = require('yaml');
const MarkdownIt = require('markdown-it');
const { patterns } = require('./architecture-review-records');

function checkHistory(root, base = 'HEAD') {
  if (!/^(HEAD(?:\^)?|[a-f0-9]{40})$/.test(base)) throw Error('Review history base must be HEAD, HEAD^ or a full commit SHA');
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
  const initial = /^0{40}$/.test(base);
  const commits = git(['rev-list','--parents','--reverse',initial ? 'HEAD' : base + '..HEAD']).trim().split(/\r?\n/).filter(Boolean);
  const cache = new Map(), errors = [];
  function snapshot(revision) {
    if (cache.has(revision)) return cache.get(revision);
    const list = (revision ? git(['ls-tree','-r','--name-only',revision]) : git(['ls-files','--cached','--others','--exclude-standard'])).trim().split(/\r?\n/);
    const read = file => {
      if (revision) return git(['show',revision + ':' + file]);
      const target=path.join(root,file);
      return fs.existsSync(target) && !fs.lstatSync(target).isSymbolicLink() ? fs.readFileSync(target,'utf8') : null;
    };
    const records=new Map();
    for(const file of list.filter(f=>patterns.owner.test(f)||patterns.closure.test(f))) {
      const body=read(file); if(body===null)continue;
      const binding=new MarkdownIt().parse(body,{}).find(t=>t.type==='fence'&&t.info.trim()==='yaml');
      records.set(file,{body:body.replace(/\r\n/g,'\n'),complete:binding&&YAML.parse(binding.content)?.record_status==='complete'});
    }
    const statusFile='analysis/migration_status.yaml';
    const status=list.includes(statusFile) ? YAML.parse(read(statusFile)) : null;
    const result={records,status};cache.set(revision,result);return result;
  }
  function edge(parent,child) {
    const a=snapshot(parent),b=snapshot(child);
    for(const [file,record] of a.records) if(record.complete && b.records.get(file)?.body!==record.body) errors.push('Completed architecture record is immutable: '+file+' at '+(child||'working tree'));
    const before=a.status?.architecture_review,after=b.status?.architecture_review;
    if(before?.adopted_at && before.adopted_at!==after?.adopted_at)errors.push('Architecture review adoption cannot be removed or changed');
    if(before?.records?.length && JSON.stringify(after?.records?.slice(0,before.records.length))!==JSON.stringify(before.records))errors.push('Completed architecture attempt register is append-only');
  }
  for(const line of commits) {
    const [child,...parents]=line.split(' ');
    for(const parent of parents)edge(parent,child);
  }
  edge('HEAD',null);
  return errors;
}
if (require.main === module) {
  try {
    const index = process.argv.indexOf('--base');
    const errors = checkHistory(path.resolve(__dirname, '../..'), index < 0 ? 'HEAD' : process.argv[index + 1]);
    if (errors.length) throw Error(errors.join('\n'));
    console.log('Completed architecture review records preserved');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { checkHistory };
