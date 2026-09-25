'use strict';
const fs=require('fs');const src=fs.readFileSync(__dirname+'/credscan.js','utf8').replace(/const targets[\s\S]*$/,'module.exports = vals;');
const m={exports:{}};new Function('require','module','__dirname','process',src)(require,m,__dirname,{argv:[]});
const vals=[...m.exports];const files=process.argv.slice(2);
vals.forEach((v,k)=>{let n=0;for(const f of files){const s=fs.readFileSync(f,'latin1');let i=-1;while((i=s.indexOf(v,i+1))!==-1)n++;}console.log('V'+k+' len'+v.length+' alpha='+/^[a-z]+$/i.test(v)+' dictionaryWordInSources='+(/^(xplanner|admin|root|password)$/i.test(v))+' rawHits='+n);});
