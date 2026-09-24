// Reviewer-owned minimal bytecode lister (BA-002-04, Phase B). usage: node disasm.js <class/path/Name> [methodName]
// Reads a class from the scratch WAR copy and prints the instruction sequence with resolved constants and the exception table.
'use strict';
const fs = require('fs'); const path = require('path');
const [, , clsArg, mArg] = process.argv;
const buf = fs.readFileSync(path.join(__dirname, 'war', 'WEB-INF', 'classes', clsArg.replace(/\./g, '/') + '.class'));
const N = ['nop','aconst_null','iconst_m1','iconst_0','iconst_1','iconst_2','iconst_3','iconst_4','iconst_5','lconst_0','lconst_1','fconst_0','fconst_1','fconst_2','dconst_0','dconst_1','bipush','sipush','ldc','ldc_w','ldc2_w','iload','lload','fload','dload','aload','iload_0','iload_1','iload_2','iload_3','lload_0','lload_1','lload_2','lload_3','fload_0','fload_1','fload_2','fload_3','dload_0','dload_1','dload_2','dload_3','aload_0','aload_1','aload_2','aload_3','iaload','laload','faload','daload','aaload','baload','caload','saload','istore','lstore','fstore','dstore','astore','istore_0','istore_1','istore_2','istore_3','lstore_0','lstore_1','lstore_2','lstore_3','fstore_0','fstore_1','fstore_2','fstore_3','dstore_0','dstore_1','dstore_2','dstore_3','astore_0','astore_1','astore_2','astore_3','iastore','lastore','fastore','dastore','aastore','bastore','castore','sastore','pop','pop2','dup','dup_x1','dup_x2','dup2','dup2_x1','dup2_x2','swap','iadd','ladd','fadd','dadd','isub','lsub','fsub','dsub','imul','lmul','fmul','dmul','idiv','ldiv','fdiv','ddiv','irem','lrem','frem','drem','ineg','lneg','fneg','dneg','ishl','lshl','ishr','lshr','iushr','lushr','iand','land','ior','lor','ixor','lxor','iinc','i2l','i2f','i2d','l2i','l2f','l2d','f2i','f2l','f2d','d2i','d2l','d2f','i2b','i2c','i2s','lcmp','fcmpl','fcmpg','dcmpl','dcmpg','ifeq','ifne','iflt','ifge','ifgt','ifle','if_icmpeq','if_icmpne','if_icmplt','if_icmpge','if_icmpgt','if_icmple','if_acmpeq','if_acmpne','goto','jsr','ret','tableswitch','lookupswitch','ireturn','lreturn','freturn','dreturn','areturn','return','getstatic','putstatic','getfield','putfield','invokevirtual','invokespecial','invokestatic','invokeinterface','invokedynamic','new','newarray','anewarray','arraylength','athrow','checkcast','instanceof','monitorenter','monitorexit','wide','multianewarray','ifnull','ifnonnull','goto_w','jsr_w'];
const L = new Array(256).fill(0);
[0x10,0x12,0x15,0x16,0x17,0x18,0x19,0x36,0x37,0x38,0x39,0x3a,0xa9,0xbc].forEach(o=>L[o]=1);
[0x11,0x13,0x14,0x84,0x99,0x9a,0x9b,0x9c,0x9d,0x9e,0x9f,0xa0,0xa1,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,0xa8,0xb2,0xb3,0xb4,0xb5,0xb6,0xb7,0xb8,0xbb,0xbd,0xc0,0xc1,0xc6,0xc7].forEach(o=>L[o]=2);
L[0xc5]=3; L[0xb9]=4; L[0xba]=4; L[0xc8]=4; L[0xc9]=4;
let o = 0; const u1=()=>buf[o++], u2=()=>{const v=buf.readUInt16BE(o);o+=2;return v;}, u4=()=>{const v=buf.readUInt32BE(o);o+=4;return v;};
o = 8; const n = u2(); const cp = [];
for (let i = 1; i < n; i++) { const t = u1(); if (t===1){const l=u2();cp[i]={t,v:buf.slice(o,o+l).toString('utf8')};o+=l;} else if(t===3||t===4){cp[i]={t,v:t===3?buf.readInt32BE(o):buf.readFloatBE(o)};o+=4;} else if(t===5||t===6){cp[i]={t,v:t===5?buf.readBigInt64BE(o).toString():buf.readDoubleBE(o)};o+=8;i++;} else if(t===7||t===8||t===16){cp[i]={t,a:u2()};} else if(t===15){cp[i]={t,k:u1(),a:u2()};} else {cp[i]={t,a:u2(),b:u2()};} }
const U=i=>cp[i]&&cp[i].v; const C=i=>U(cp[i].a);
const R=i=>{const e=cp[i]; if(!e) return '#'+i; if(e.t===7) return C(i); if(e.t===8) return JSON.stringify(U(e.a)); if(e.t===3||e.t===4||e.t===5||e.t===6) return String(e.v); if(e.t===9||e.t===10||e.t===11){const nt=cp[e.b]; return C(e.a)+'.'+U(nt.a)+U(nt.b);} return '#'+i;};
o += 6; const ni = u2(); o += 2*ni;
const skipAttrs=()=>{const k=u2();for(let i=0;i<k;i++){u2();const l=u4();o+=l;}};
const nf=u2(); for(let i=0;i<nf;i++){o+=6;skipAttrs();}
const nm=u2();
for (let i=0;i<nm;i++){ o+=2; const name=U(u2()), desc=U(u2()); const ka=u2();
  for(let j=0;j<ka;j++){ const an=U(u2()); const len=u4(); const end=o+len;
    if(an==='Code' && (!mArg || name===mArg)){
      u2(); u2(); const cl=u4(); const st=o; console.log('== '+name+desc);
      while(o<st+cl){ const pc=o-st; const op=u1(); let s=pc+': '+N[op];
        if(op===0x12){s+=' '+R(u1());} else if(op===0x13||op===0x14){s+=' '+R(u2());}
        else if(op>=0xb2&&op<=0xb8||op===0xbb||op===0xbd||op===0xc0||op===0xc1){s+=' '+R(u2());}
        else if(op===0xb9){s+=' '+R(u2());o+=2;}
        else if(op===0x10){s+=' '+buf.readInt8(o);o++;} else if(op===0x11){s+=' '+buf.readInt16BE(o);o+=2;}
        else if((op>=0x99&&op<=0xa8)||op===0xc6||op===0xc7){s+=' -> '+(pc+buf.readInt16BE(o));o+=2;}
        else if(op===0xaa||op===0xab){o+=(4-((o-st)%4))%4; if(op===0xaa){const d=buf.readInt32BE(o);o+=4;const lo=buf.readInt32BE(o);o+=4;const hi=buf.readInt32BE(o);o+=4;s+=' default->'+(pc+d);for(let k=lo;k<=hi;k++){s+=' '+k+'->'+(pc+buf.readInt32BE(o));o+=4;}} else {const d=buf.readInt32BE(o);o+=4;const np=buf.readInt32BE(o);o+=4;s+=' default->'+(pc+d);for(let k=0;k<np;k++){s+=' '+buf.readInt32BE(o)+'->'+(pc+buf.readInt32BE(o+4));o+=8;}}}
        else if(op===0xc4){const op2=u1();s+=' '+N[op2]+' '+u2(); if(op2===0x84)o+=2;}
        else { if(L[op]===1) s+=' '+buf[o]; o+=L[op]; }
        console.log('  '+s); }
      const ne=u2(); for(let k=0;k<ne;k++){const a=u2(),b=u2(),h=u2(),t=u2(); console.log('  [exc '+a+'-'+b+' -> '+h+' '+(t?C(t):'any')+']');}
    }
    o=end; }
}
