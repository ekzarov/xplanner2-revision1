// Diagnostic: show credential-context matches with the value masked (reviewer-authored).
'use strict';
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/credscan.js', 'utf8').replace(/const targets[\s\S]*$/, 'module.exports = vals;');
const m = { exports: {} };
new Function('require', 'module', '__dirname', 'process', src)(require, m, __dirname, { argv: [] });
const vals = [...m.exports];
const esc = v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const f = process.env.F; const s = fs.readFileSync(f, 'latin1');
vals.forEach((v, k) => {
  const r = new RegExp('(pass(word|wd)?|pwd|-p|adminPassword|secret)[^\\n]{0,40}' + esc(v), 'gi');
  let x;
  while ((x = r.exec(s))) console.log('V' + k + '(len ' + v.length + ', alpha=' + /^[a-z]+$/i.test(v) + '): ' + x[0].split(v).join('<V' + k + '>').slice(-90));
});
