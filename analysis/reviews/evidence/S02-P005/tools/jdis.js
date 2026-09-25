// Minimal read-only Java class-file disassembler (reviewer-authored, S02-P005).
// Usage: node jdis.js <file.class> [...]  -> javap-like listing with resolved constants.
'use strict';
const fs = require('fs');

const OPS = {};
const names = ('nop aconst_null iconst_m1 iconst_0 iconst_1 iconst_2 iconst_3 iconst_4 iconst_5 lconst_0 lconst_1 fconst_0 fconst_1 fconst_2 dconst_0 dconst_1 bipush sipush ldc ldc_w ldc2_w iload lload fload dload aload iload_0 iload_1 iload_2 iload_3 lload_0 lload_1 lload_2 lload_3 fload_0 fload_1 fload_2 fload_3 dload_0 dload_1 dload_2 dload_3 aload_0 aload_1 aload_2 aload_3 iaload laload faload daload aaload baload caload saload istore lstore fstore dstore astore istore_0 istore_1 istore_2 istore_3 lstore_0 lstore_1 lstore_2 lstore_3 fstore_0 fstore_1 fstore_2 fstore_3 dstore_0 dstore_1 dstore_2 dstore_3 astore_0 astore_1 astore_2 astore_3 iastore lastore fastore dastore aastore bastore castore sastore pop pop2 dup dup_x1 dup_x2 dup2 dup2_x1 dup2_x2 swap iadd ladd fadd dadd isub lsub fsub dsub imul lmul fmul dmul idiv ldiv fdiv ddiv irem lrem frem drem ineg lneg fneg dneg ishl lshl ishr lshr iushr lushr iand land ior lor ixor lxor iinc i2l i2f i2d l2i l2f l2d f2i f2l f2d d2i d2l d2f i2b i2c i2s lcmp fcmpl fcmpg dcmpl dcmpg ifeq ifne iflt ifge ifgt ifle if_icmpeq if_icmpne if_icmplt if_icmpge if_icmpgt if_icmple if_acmpeq if_acmpne goto jsr ret tableswitch lookupswitch ireturn lreturn freturn dreturn areturn return getstatic putstatic getfield putfield invokevirtual invokespecial invokestatic invokeinterface invokedynamic new newarray anewarray arraylength athrow checkcast instanceof monitorenter monitorexit wide multianewarray ifnull ifnonnull goto_w jsr_w').split(' ');
names.forEach((n, i) => { OPS[i] = n; });
const LEN = {};
// operand byte lengths (excluding opcode); switches/wide handled specially
['bipush','ldc','iload','lload','fload','dload','aload','istore','lstore','fstore','dstore','astore','ret','newarray'].forEach(n => LEN[n] = 1);
['sipush','ldc_w','ldc2_w','iinc','ifeq','ifne','iflt','ifge','ifgt','ifle','if_icmpeq','if_icmpne','if_icmplt','if_icmpge','if_icmpgt','if_icmple','if_acmpeq','if_acmpne','goto','jsr','getstatic','putstatic','getfield','putfield','invokevirtual','invokespecial','invokestatic','new','anewarray','checkcast','instanceof','ifnull','ifnonnull'].forEach(n => LEN[n] = 2);
['multianewarray'].forEach(n => LEN[n] = 3);
['invokeinterface','invokedynamic','goto_w','jsr_w'].forEach(n => LEN[n] = 4);
const CPREF = new Set(['ldc','ldc_w','ldc2_w','getstatic','putstatic','getfield','putfield','invokevirtual','invokespecial','invokestatic','invokeinterface','invokedynamic','new','anewarray','checkcast','instanceof','multianewarray']);
const BRANCH = new Set(['ifeq','ifne','iflt','ifge','ifgt','ifle','if_icmpeq','if_icmpne','if_icmplt','if_icmpge','if_icmpgt','if_icmple','if_acmpeq','if_acmpne','goto','jsr','ifnull','ifnonnull']);

function parse(buf) {
  let p = 0;
  const u1 = () => buf[p++];
  const u2 = () => { const v = buf.readUInt16BE(p); p += 2; return v; };
  const u4 = () => { const v = buf.readUInt32BE(p); p += 4; return v; };
  if (u4() !== 0xCAFEBABE) throw new Error('not a class');
  const minor = u2(), major = u2();
  const n = u2();
  const cp = [null];
  for (let i = 1; i < n; i++) {
    const tag = u1();
    switch (tag) {
      case 1: { const l = u2(); cp[i] = { tag, v: decodeMUTF8(buf.slice(p, p + l)) }; p += l; break; }
      case 3: cp[i] = { tag, v: buf.readInt32BE(p) }; p += 4; break;
      case 4: cp[i] = { tag, v: buf.readFloatBE(p) }; p += 4; break;
      case 5: cp[i] = { tag, v: buf.readBigInt64BE(p) + 'L' }; p += 8; cp[++i] = null; break;
      case 6: cp[i] = { tag, v: buf.readDoubleBE(p) }; p += 8; cp[++i] = null; break;
      case 7: case 8: case 16: case 19: case 20: cp[i] = { tag, a: u2() }; break;
      case 9: case 10: case 11: case 12: case 18: case 17: cp[i] = { tag, a: u2(), b: u2() }; break;
      case 15: cp[i] = { tag, a: u1(), b: u2() }; break;
      default: throw new Error('bad cp tag ' + tag + ' at ' + i);
    }
  }
  const S = i => cp[i] && cp[i].v;
  function res(i) {
    const e = cp[i]; if (!e) return '#' + i;
    switch (e.tag) {
      case 1: return e.v;
      case 3: case 4: case 5: case 6: return String(e.v);
      case 7: return S(e.a).replace(/\//g, '.');
      case 8: return JSON.stringify(S(e.a));
      case 9: case 10: case 11: return res(e.a) + '.' + S(cp[e.b].a) + ':' + S(cp[e.b].b);
      case 12: return S(e.a) + ':' + S(e.b);
      case 18: return 'indy#' + e.a + ':' + res(e.b);
      default: return 'cp' + e.tag + '#' + i;
    }
  }
  const access = u2(); const thisC = res(u2()); const superI = u2(); const superC = superI ? res(superI) : null;
  const ni = u2(); const ifaces = []; for (let i = 0; i < ni; i++) ifaces.push(res(u2()));
  function attrs() {
    const c = u2(); const out = [];
    for (let i = 0; i < c; i++) { const name = S(u2()); const l = u4(); out.push({ name, data: buf.slice(p, p + l) }); p += l; }
    return out;
  }
  const fields = []; const nf = u2();
  for (let i = 0; i < nf; i++) { const acc = u2(); const name = S(u2()); const desc = S(u2()); const at = attrs(); fields.push({ acc, name, desc, at }); }
  const methods = []; const nm = u2();
  for (let i = 0; i < nm; i++) { const acc = u2(); const name = S(u2()); const desc = S(u2()); const at = attrs(); methods.push({ acc, name, desc, at }); }
  const cattrs = attrs();
  return { major, minor, access, thisC, superC, ifaces, fields, methods, cattrs, cp, res, S };
}

function decodeMUTF8(b) {
  let s = '', i = 0;
  while (i < b.length) {
    const x = b[i++];
    if (x < 0x80) s += String.fromCharCode(x);
    else if ((x & 0xE0) === 0xC0) { const y = b[i++]; s += String.fromCharCode(((x & 0x1F) << 6) | (y & 0x3F)); }
    else { const y = b[i++], z = b[i++]; s += String.fromCharCode(((x & 0x0F) << 12) | ((y & 0x3F) << 6) | (z & 0x3F)); }
  }
  return s;
}

function code(c, data) {
  const maxStack = data.readUInt16BE(0), maxLocals = data.readUInt16BE(2), len = data.readUInt32BE(4);
  const bc = data.slice(8, 8 + len);
  const out = [];
  let p = 0;
  while (p < bc.length) {
    const start = p; const op = OPS[bc[p++]] || ('op' + bc[start]);
    let arg = '';
    if (op === 'tableswitch' || op === 'lookupswitch') {
      while (p % 4) p++;
      const def = bc.readInt32BE(p); p += 4;
      if (op === 'tableswitch') {
        const lo = bc.readInt32BE(p), hi = bc.readInt32BE(p + 4); p += 8;
        const t = []; for (let k = lo; k <= hi; k++) { t.push(k + ':' + (start + bc.readInt32BE(p))); p += 4; }
        arg = '{' + t.join(',') + ',default:' + (start + def) + '}';
      } else {
        const np = bc.readInt32BE(p); p += 4; const t = [];
        for (let k = 0; k < np; k++) { t.push(bc.readInt32BE(p) + ':' + (start + bc.readInt32BE(p + 4))); p += 8; }
        arg = '{' + t.join(',') + ',default:' + (start + def) + '}';
      }
    } else if (op === 'wide') {
      const op2 = OPS[bc[p++]]; if (op2 === 'iinc') { arg = op2 + ' ' + bc.readUInt16BE(p) + ' ' + bc.readInt16BE(p + 2); p += 4; } else { arg = op2 + ' ' + bc.readUInt16BE(p); p += 2; }
    } else {
      const l = LEN[op] || 0;
      if (CPREF.has(op)) { const idx = op === 'ldc' ? bc[p] : bc.readUInt16BE(p); arg = c.res(idx); if (op === 'multianewarray') arg += ' dim ' + bc[p + 2]; }
      else if (BRANCH.has(op)) arg = '-> ' + (start + bc.readInt16BE(p));
      else if (op === 'goto_w' || op === 'jsr_w') arg = '-> ' + (start + bc.readInt32BE(p));
      else if (op === 'bipush') arg = String(bc.readInt8(p));
      else if (op === 'sipush') arg = String(bc.readInt16BE(p));
      else if (op === 'iinc') arg = bc[p] + ' ' + bc.readInt8(p + 1);
      else if (l === 1) arg = String(bc[p]);
      p += l;
    }
    out.push('      ' + start + ': ' + op + (arg ? ' ' + arg : ''));
  }
  // exception table
  let q = 8 + len; const ne = data.readUInt16BE(q); q += 2;
  for (let k = 0; k < ne; k++) {
    const s = data.readUInt16BE(q), e = data.readUInt16BE(q + 2), h = data.readUInt16BE(q + 4), t = data.readUInt16BE(q + 6); q += 8;
    out.push('      catch ' + (t ? c.res(t) : 'any') + ' [' + s + ',' + e + ') -> ' + h);
  }
  return out;
}

function accStr(a) {
  const r = []; if (a & 1) r.push('public'); if (a & 2) r.push('private'); if (a & 4) r.push('protected'); if (a & 8) r.push('static'); if (a & 0x10) r.push('final'); if (a & 0x400) r.push('abstract');
  return r.join(' ');
}

function annot(c, at) {
  const o = [];
  for (const a of at) {
    if (a.name === 'RuntimeVisibleAnnotations' || a.name === 'Signature' || a.name === 'ConstantValue' || a.name === 'Exceptions' || a.name === 'SourceFile') {
      if (a.name === 'Signature' || a.name === 'SourceFile') o.push('    // ' + a.name + ' ' + c.S(a.data.readUInt16BE(0)));
      else if (a.name === 'ConstantValue') o.push('    // const ' + c.res(a.data.readUInt16BE(0)));
      else if (a.name === 'Exceptions') { const n = a.data.readUInt16BE(0); const t = []; for (let i = 0; i < n; i++) t.push(c.res(a.data.readUInt16BE(2 + 2 * i))); o.push('    // throws ' + t.join(', ')); }
      else o.push('    // @annotations ' + rawAnn(c, a.data));
    }
  }
  return o;
}
function rawAnn(c, d) {
  // decode annotation list shallowly
  let p = 0; const n = d.readUInt16BE(p); p += 2; const out = [];
  function ev() {
    const tag = String.fromCharCode(d[p++]);
    if ('BCDFIJSZs'.includes(tag)) { const v = c.res(d.readUInt16BE(p)); p += 2; return v; }
    if (tag === 'e') { const t = c.S(d.readUInt16BE(p)); const v = c.S(d.readUInt16BE(p + 2)); p += 4; return t + '.' + v; }
    if (tag === 'c') { const v = c.S(d.readUInt16BE(p)); p += 2; return v; }
    if (tag === '@') return ann();
    if (tag === '[') { const k = d.readUInt16BE(p); p += 2; const a = []; for (let i = 0; i < k; i++) a.push(ev()); return '[' + a.join(',') + ']'; }
    return '?';
  }
  function ann() {
    const t = c.S(d.readUInt16BE(p)); p += 2; const k = d.readUInt16BE(p); p += 2; const kv = [];
    for (let i = 0; i < k; i++) { const nm = c.S(d.readUInt16BE(p)); p += 2; kv.push(nm + '=' + ev()); }
    return '@' + t + '(' + kv.join(',') + ')';
  }
  for (let i = 0; i < n; i++) out.push(ann());
  return out.join(' ');
}

for (const f of process.argv.slice(2)) {
  const c = parse(fs.readFileSync(f));
  const lines = [];
  lines.push('class ' + c.thisC + (c.superC ? ' extends ' + c.superC : '') + (c.ifaces.length ? ' implements ' + c.ifaces.join(', ') : '') + '  // ' + accStr(c.access) + ' v' + c.major);
  lines.push(...annot(c, c.cattrs));
  for (const fl of c.fields) { lines.push('  field ' + accStr(fl.acc) + ' ' + fl.name + ' ' + fl.desc); lines.push(...annot(c, fl.at)); }
  for (const m of c.methods) {
    lines.push('  method ' + accStr(m.acc) + ' ' + m.name + m.desc);
    lines.push(...annot(c, m.at));
    for (const a of m.at) if (a.name === 'Code') lines.push(...code(c, a.data));
  }
  process.stdout.write('=== ' + f + '\n' + lines.join('\n') + '\n');
}
