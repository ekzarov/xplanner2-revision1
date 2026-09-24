// Reviewer-owned read-only class-file parser (BA-002-04 / S02-P004).
// Reads extracted WAR classes from reviewer-scratch/war and writes per-class text dumps
// plus classes.json into reviewer-scratch/classdump. No network, no writes outside scratch.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'war', 'WEB-INF', 'classes');
const out = path.join(__dirname, 'classdump');
fs.mkdirSync(out, { recursive: true });

function walk(d, acc) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc); else if (f.endsWith('.class')) acc.push(p);
  }
  return acc;
}

// opcode operand lengths (excluding opcode byte); -1 = special
const OPLEN = new Array(256).fill(0);
[0x10,0x12,0x15,0x16,0x17,0x18,0x19,0x36,0x37,0x38,0x39,0x3a,0xa9,0xbc].forEach(o=>OPLEN[o]=1);
[0x11,0x13,0x14,0x84,0x99,0x9a,0x9b,0x9c,0x9d,0x9e,0x9f,0xa0,0xa1,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,0xa8,
 0xb2,0xb3,0xb4,0xb5,0xb6,0xb7,0xb8,0xbb,0xbd,0xc0,0xc1,0xc6,0xc7].forEach(o=>OPLEN[o]=2);
OPLEN[0xc5]=3; OPLEN[0xb9]=4; OPLEN[0xba]=4; OPLEN[0xc8]=4; OPLEN[0xc9]=4;
OPLEN[0xaa]=-1; OPLEN[0xab]=-1; OPLEN[0xc4]=-1;

function parse(buf) {
  let o = 0;
  const u1 = () => buf[o++];
  const u2 = () => { const v = buf.readUInt16BE(o); o += 2; return v; };
  const u4 = () => { const v = buf.readUInt32BE(o); o += 4; return v; };
  if (u4() !== 0xCAFEBABE) throw new Error('bad magic');
  const minor = u2(), major = u2();
  const n = u2();
  const cp = new Array(n);
  for (let i = 1; i < n; i++) {
    const tag = u1();
    switch (tag) {
      case 1: { const len = u2(); cp[i] = { tag, v: decodeMUTF8(buf.slice(o, o + len)) }; o += len; break; }
      case 3: cp[i] = { tag, v: buf.readInt32BE(o) }; o += 4; break;
      case 4: cp[i] = { tag, v: buf.readFloatBE(o) }; o += 4; break;
      case 5: cp[i] = { tag, v: buf.readBigInt64BE(o).toString() }; o += 8; i++; break;
      case 6: cp[i] = { tag, v: buf.readDoubleBE(o) }; o += 8; i++; break;
      case 7: cp[i] = { tag, name: u2() }; break;
      case 8: cp[i] = { tag, str: u2() }; break;
      case 9: case 10: case 11: cp[i] = { tag, cls: u2(), nt: u2() }; break;
      case 12: cp[i] = { tag, name: u2(), desc: u2() }; break;
      case 15: cp[i] = { tag, kind: u1(), ref: u2() }; break;
      case 16: cp[i] = { tag, desc: u2() }; break;
      case 18: cp[i] = { tag, bsm: u2(), nt: u2() }; break;
      default: throw new Error('bad cp tag ' + tag + ' at ' + i);
    }
  }
  const utf = i => (cp[i] && cp[i].v !== undefined ? cp[i].v : '');
  const cls = i => (i ? utf(cp[i].name) : null);
  const ref = i => { const e = cp[i]; if (!e) return '?'; const nt = cp[e.nt]; return cls(e.cls) + '.' + utf(nt.name) + utf(nt.desc); };
  const access = u2();
  const thisC = cls(u2());
  const superC = cls(u2());
  const ifs = []; const ni = u2(); for (let i = 0; i < ni; i++) ifs.push(cls(u2()));

  function elementValue() {
    const tag = String.fromCharCode(u1());
    switch (tag) {
      case 'B': case 'C': case 'D': case 'F': case 'I': case 'J': case 'S': case 'Z': { const c = cp[u2()]; return c ? c.v : null; }
      case 's': return utf(u2());
      case 'e': { const t = utf(u2()); const c = utf(u2()); return t + '.' + c; }
      case 'c': return utf(u2());
      case '@': return annotation();
      case '[': { const k = u2(); const a = []; for (let i = 0; i < k; i++) a.push(elementValue()); return a; }
      default: throw new Error('bad ev tag ' + tag);
    }
  }
  function annotation() {
    const type = utf(u2()); const k = u2(); const vals = {};
    for (let i = 0; i < k; i++) { const nm = utf(u2()); vals[nm] = elementValue(); }
    return { type, vals };
  }
  function attrs(owner) {
    const res = { annotations: [], code: null, paramAnnotations: [], signature: null, constant: null };
    const k = u2();
    for (let i = 0; i < k; i++) {
      const name = utf(u2()); const len = u4(); const end = o + len;
      if (name === 'RuntimeVisibleAnnotations' || name === 'RuntimeInvisibleAnnotations') {
        const na = u2(); for (let j = 0; j < na; j++) res.annotations.push(annotation());
      } else if (name === 'RuntimeVisibleParameterAnnotations') {
        const np = u1(); for (let p = 0; p < np; p++) { const na = u2(); const arr = []; for (let j = 0; j < na; j++) arr.push(annotation()); res.paramAnnotations.push(arr); }
      } else if (name === 'Signature') { res.signature = utf(u2()); }
      else if (name === 'ConstantValue') { const c = cp[u2()]; res.constant = c && c.tag === 8 ? utf(c.str) : (c ? c.v : null); }
      else if (name === 'Code') { res.code = code(end); }
      o = end;
    }
    return res;
  }
  function code(end) {
    u2(); u2(); const clen = u4(); const start = o; const cend = o + clen;
    const strings = [], calls = [], fields = [], news = [], ints = [];
    let pc = 0;
    while (o < cend) {
      pc = o - start;
      const op = u1();
      let l = OPLEN[op];
      if (op === 0x12) { const i = u1(); pushConst(i); continue; }
      if (op === 0x13 || op === 0x14) { const i = u2(); pushConst(i); continue; }
      if (op >= 0xb2 && op <= 0xb5) { fields.push(['getstatic','putstatic','getfield','putfield'][op-0xb2] + ' ' + ref(u2())); continue; }
      if (op >= 0xb6 && op <= 0xb9) { calls.push(ref(u2())); if (op === 0xb9) { u1(); u1(); } continue; }
      if (op === 0xbb || op === 0xc0 || op === 0xc1 || op === 0xbd) { const c = cls(u2()); if (op === 0xbb) news.push(c); continue; }
      if (op === 0x10) { ints.push(buf.readInt8(o)); o += 1; continue; }
      if (op === 0x11) { ints.push(buf.readInt16BE(o)); o += 2; continue; }
      if (l === -1) {
        if (op === 0xc4) { const op2 = u1(); o += (op2 === 0x84 ? 4 : 2); continue; }
        const pad = (4 - ((o - start) % 4)) % 4; o += pad;
        if (op === 0xaa) { o += 4; const lo = buf.readInt32BE(o); o += 4; const hi = buf.readInt32BE(o); o += 4; o += 4 * (hi - lo + 1); }
        else { o += 4; const np = buf.readInt32BE(o); o += 4; o += 8 * np; }
        continue;
      }
      o += l;
    }
    function pushConst(i) { const c = cp[i]; if (!c) return; if (c.tag === 8) strings.push(utf(c.str)); else if (c.tag === 7) strings.push('class:' + cls(i)); else if (c.tag === 3) ints.push(c.v); }
    o = cend;
    const nex = u2(); const ex = [];
    for (let i = 0; i < nex; i++) { u2(); u2(); u2(); const t = u2(); ex.push(t ? cls(t) : 'finally'); }
    // code attributes skipped
    const na = u2(); for (let i = 0; i < na; i++) { u2(); const len = u4(); o += len; }
    return { strings, calls, fields, news, ints, catches: ex };
  }
  const fields = []; const nf = u2();
  for (let i = 0; i < nf; i++) { const acc = u2(); const name = utf(u2()); const desc = utf(u2()); const a = attrs(); fields.push({ acc, name, desc, ann: a.annotations, sig: a.signature, constant: a.constant }); }
  const methods = []; const nm = u2();
  for (let i = 0; i < nm; i++) { const acc = u2(); const name = utf(u2()); const desc = utf(u2()); const a = attrs(); methods.push({ acc, name, desc, ann: a.annotations, pann: a.paramAnnotations, code: a.code, sig: a.signature }); }
  const ca = attrs();
  return { major, access, thisC, superC, ifs, fields, methods, ann: ca.annotations, sig: ca.signature };
}
function decodeMUTF8(b) {
  let s = ''; let i = 0;
  while (i < b.length) {
    const x = b[i++];
    if (x < 0x80) s += String.fromCharCode(x);
    else if ((x & 0xe0) === 0xc0) { const y = b[i++]; s += String.fromCharCode(((x & 0x1f) << 6) | (y & 0x3f)); }
    else { const y = b[i++], z = b[i++]; s += String.fromCharCode(((x & 0x0f) << 12) | ((y & 0x3f) << 6) | (z & 0x3f)); }
  }
  return s;
}
function annStr(a) { return '@' + a.type + (Object.keys(a.vals).length ? JSON.stringify(a.vals) : ''); }

const files = walk(root, []).sort();
const summary = [];
let errors = 0;
for (const f of files) {
  const rel = path.relative(root, f).split(path.sep).join('/');
  let c;
  try { c = parse(fs.readFileSync(f)); } catch (e) { errors++; summary.push({ file: rel, error: String(e) }); continue; }
  const lines = [];
  lines.push('CLASS ' + c.thisC + ' extends ' + c.superC + (c.ifs.length ? ' implements ' + c.ifs.join(', ') : '') + ' access=0x' + c.access.toString(16) + ' major=' + c.major);
  if (c.sig) lines.push('  SIG ' + c.sig);
  for (const a of c.ann) lines.push('  ANN ' + annStr(a));
  for (const fd of c.fields) {
    lines.push('  FIELD ' + fd.name + ' ' + fd.desc + ' acc=0x' + fd.acc.toString(16) + (fd.constant !== null && fd.constant !== undefined ? ' = ' + JSON.stringify(fd.constant) : ''));
    for (const a of fd.ann) lines.push('    ANN ' + annStr(a));
  }
  for (const m of c.methods) {
    lines.push('  METHOD ' + m.name + m.desc + ' acc=0x' + m.acc.toString(16));
    for (const a of m.ann) lines.push('    ANN ' + annStr(a));
    m.pann.forEach((arr, idx) => arr.forEach(a => lines.push('    PARAM' + idx + ' ANN ' + annStr(a))));
    if (m.code) {
      for (const s of m.code.strings) lines.push('    STR ' + JSON.stringify(s));
      for (const s of m.code.calls) lines.push('    CALL ' + s);
      for (const s of m.code.fields) lines.push('    FLD ' + s);
      for (const s of m.code.news) lines.push('    NEW ' + s);
      for (const s of m.code.catches) lines.push('    CATCH ' + s);
    }
  }
  const outFile = path.join(out, rel.replace(/\//g, '.').replace(/\.class$/, '.txt'));
  fs.writeFileSync(outFile, lines.join('\n') + '\n');
  summary.push({ file: rel, cls: c.thisC, sup: c.superC, ifs: c.ifs, ann: c.ann.map(a => a.type), methods: c.methods.length });
}
fs.writeFileSync(path.join(__dirname, 'classes.json'), JSON.stringify(summary, null, 1));
console.log('classes parsed', files.length, 'errors', errors);
