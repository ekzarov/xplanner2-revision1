import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { DEPTH_STEP, depthAt, overviewPosition, overviewRoute } from './overview-geometry.js';
import { createSearchIndex, searchFeatures, searchExcerpt } from './search.js';

const $=id=>document.getElementById(id);
const words={
 en:{noDependents:'No dependent slices recorded on this axis.',workOrder:"Work order",orderAxis:"Order by",designOrder:"Design contracts",completionOrder:"Completion",iteration:"Iteration",draft:"Draft order",bounded:"Recorded order",orderUnknown:"Order unknown",orderSummary:"Dependency iterations",orderWarning:"Dependency groups, not scheduled sprints or permission to start. Actual provider availability, required reviews and owner authorization are checked separately.",contractOrderMeaning:"Agree the provider contracts before dependent design. These iterations do not require all provider implementation to finish.",completionOrderMeaning:"Satisfy the provider obligations before completing dependent features. Design and implementation may overlap.",parallelMeaning:"Within an iteration, this relation records no ordering constraint. Capacity and priority are decided separately.",firstMeaning:"No earlier prerequisite recorded on this axis.",before:"First required",after:"Then supports",hiddenBefore:"Hidden candidate prerequisites",coverageUnknown:"No assessed dependency coverage for this order.",hiddenCandidates:"Candidate prerequisites are hidden, not resolved.",cycleContract:"Cyclic contracts: clarify and agree the joint scope.",cycleCompletion:"Cyclic completion obligations: correct the dependency scope.",unresolvedPrerequisite:"A prerequisite has no resolved order.",orderNone:"No iterations can be established from this scope.",iterationUnit:"Iterations",draftUnit:"Draft slices",unknownUnit:"Order unknown",close:'Close details',legend:"Dependency legend",bothMeaning:": both dependencies together. The same pair of features can have both.",contractMeaning:"Agree what data and behavior the provider supplies before designing the dependent slice. Its implementation need not be finished.",contractExample:"Example: agree the time-entry API fields, format and access rules to design a report.",completionMeaning:"Completion checks include the provider: its required scope must work and have verification evidence. An agreed API alone is not enough. Some slices only reconcile evidence; their arrows do not mean new runtime features.",completionExample:"Example: completing the report requires working time tracking and verified retrieval of its data.",directionMeaning:"Provider → consumer: from the prerequisite to the dependent feature.",lineMeaning:"Solid: explicit in source. Dashed: inference to review. Neither means ready.",title:'Feature dependencies',search:'Find a slice',slices:'Slices',edges:'links',unassessed:'Unassessed',reviewed:'Review bound',neighbors:'Selected neighborhood',providers:'Providers',consumers:'Consumers',focus:'Slice links',overview:'Whole graph',viewMode:'View mode',both:'Both relation types',contract:'Contract for design',completion:'Required for completion',candidates:'Candidates',direction:'Provider → consumer',source:'Source JSON',process:'Process',reset:'Fit visible scope',zoomIn:'Zoom in',zoomOut:'Zoom out',flat:'Plan view',historical:'Historical reconstruction. Coverage has not been independently reviewed; no new review or release approval.',illustrative:'Illustrative Starter example. These slices and links are not project evidence.',governed:'Dependency evidence. A review binding is not implementation or release approval.',confirmed:'Explicit in source',candidate:'Inference to review',rows:'Parity-map rows',unknown:'Open questions',basis:'Source basis',incoming:'Incoming prerequisites',outgoing:'Dependent slices',closure:'Confirmed completion scope',noLinks:'No links recorded in this view. This does not establish independence.',scope:'Scope digest',view:'visible',none:'No matching slices',node:'Select a slice',transitive:'Transitive scope, not proof of delivery',updated:'Recorded',link:'SDD',empty:'No rows: target-only scope',error:'The dependency view could not be loaded.',unreviewed:'Dependency coverage has not been independently reviewed.',details:'Condition and evidence'},
};
Object.assign(words.en,{depth:'Level spacing',locate:'Focus selected slice',rotate:'Rotate camera (off: drag to pan)',fullscreen:'Full screen',minimap:'Graph overview. Click to move the camera; arrow keys to pan.'});
Object.assign(words.en,{search:'Feature, parity row or text',results:'Results',row:'Parity row',titleMatch:'Feature',groupMatch:'Group',dependencyMatch:'Dependency',questionMatch:'Open question',basisMatch:'Source text'});
const pageUrl=new URL(location.href);
Object.assign(words.en,{aboutFeature:'About this feature',descriptionMatch:'Feature description',descriptionMissing:'No feature summary recorded. See the SDD and source basis for the documented scope.'});
if(pageUrl.searchParams.has('lang')){
 pageUrl.searchParams.set('lang','en');history.replaceState(null,'',pageUrl);
}
let view=['all','order'].includes(new URLSearchParams(location.search).get('view'))?new URLSearchParams(location.search).get('view'):'focus';
let orderAxis=new URLSearchParams(location.search).get('order')==='contract'?'contract':'completion';
let data,selected,lastSelected,renderer,scene,camera,controls,group,flat=false,visible=[],hits=[];
let depthStep=DEPTH_STEP,rotating=false,mapTransform=null;
let searchIndex=[],searchResults=[],activeResult=-1;
const t=key=>words.en[key]||key;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ids=()=>new Map(data.nodes.map(n=>[n.id,n]));
const sourceUrl=p=>{
 if(!p||p.split('/').some(x=>x==='..'||x==='')||/[:\\]/.test(p))return null;
 return new URL(data.sourceBase+p,location.href).href;
};
const anchor=(p,label)=>{const href=sourceUrl(p);return href?'<a class="source" href="'+esc(href)+'" target="_blank" rel="noopener">'+esc(label||p)+'</a>':'';};
function strings(){
 document.documentElement.lang='en';
 $('title').textContent=data.title+' · '+t('title');document.title=$('title').textContent;
 $('search-label').textContent=t('slices');$('search').placeholder=t('search');$('search').setAttribute('aria-label',t('search'));
 $('search-results').setAttribute('aria-label',t('results'));
 $('stats').textContent=data.nodes.length+' '+t('slices')+' · '+data.edges.length+' '+t('edges')+' · '+data.nodes.filter(n=>!n.metadata.review).length+' '+t('unassessed').toLowerCase();
 $('notice').textContent=t(data.mode==='illustrative'?'illustrative':data.mode==='historical-reconstruction'?'historical':'governed')+' '+t('updated')+': '+data.recordedAt;
 $('source-link').textContent='Graph JSON';$('source-link').title=t('source');$('source-link').href=sourceUrl(data.source);$('source-link').target='_blank';$('source-link').rel='noopener';
 $('process-link').textContent=t('process');$('process-link').href=(data.processUrl||'../migration_methodology.html')+'?lang=en';
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
 for(const [id,key]of Object.entries({reset:'reset','zoom-in':'zoomIn','zoom-out':'zoomOut',flat:'flat','close-details':'close',locate:'locate',rotate:'rotate',fullscreen:'fullscreen',minimap:'minimap'})){$(id).title=t(key);$(id).setAttribute('aria-label',t(key));}
 $('depth').setAttribute('aria-label',t('depth'));
 $('scope').setAttribute('aria-label',t('neighbors'));$('relation').setAttribute('aria-label',t('both'));
 $('list').setAttribute('aria-label',t('slices'));$('details').setAttribute('aria-label',t('node'));
 $('view-mode').setAttribute('aria-label',t('viewMode'));$('order-board').setAttribute('aria-label',t('workOrder'));
 document.querySelector('.legend').setAttribute('aria-label',t('legend'));
 renderer?.domElement.setAttribute('aria-label',t('title'));
 window.lucide.createIcons();
}
function list(){
 const nodes=searchFeatures(searchIndex,$('search').value).map(result=>result.node);
 $('list').innerHTML=nodes.map(n=>'<button class="slice" data-id="'+esc(n.id)+'" aria-current="'+(n.id===selected)+'"><strong>'+esc(n.id.slice(0,3)+' · '+n.label)+'</strong><small>'+esc(n.metadata.group)+' · '+esc(t(n.metadata.review?'reviewed':'unassessed'))+'</small></button>').join('')||'<p class="empty">'+esc(t('none'))+'</p>';
 $('list').querySelectorAll('button').forEach(b=>b.onclick=()=>choose(b.dataset.id));
}
function closeSearch(){
 $('search-popup').hidden=true;$('search').setAttribute('aria-expanded','false');$('search').removeAttribute('aria-activedescendant');activeResult=-1;
}
function updateActiveResult(){
 $('search-results').querySelectorAll('[role=option]').forEach((option,index)=>option.setAttribute('aria-selected',String(index===activeResult)));
 const option=$('search-results').children[activeResult];
 if(option){$('search').setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});}
 else $('search').removeAttribute('aria-activedescendant');
}
function showSearch(){
 const query=$('search').value.trim();
 if(!query){closeSearch();return;}
 searchResults=searchFeatures(searchIndex,query);activeResult=searchResults.length?0:-1;
 $('search-count').textContent=t('results')+': '+searchResults.length;
 $('search-results').innerHTML=searchResults.map(({node,match},index)=>{
  const context=match.kind==='row'?t('row')+' '+match.row:t(match.kind+'Match');
  return '<div id="search-result-'+index+'" role="option" aria-selected="false" data-id="'+esc(node.id)+'"><strong>'+esc(node.id.slice(0,3)+' · '+node.label)+'</strong><span class="search-match">'+esc(context)+'</span><span class="search-excerpt">'+esc(searchExcerpt(match.text,query))+'</span></div>';
 }).join('')||'<p class="empty">'+esc(t('none'))+'</p>';
 $('search-popup').hidden=false;$('search').setAttribute('aria-expanded','true');
 updateActiveResult();
}
function chooseSearch(id){
 closeSearch();$('search').blur();choose(id);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(view==='order'){
   const card=$('order-board').querySelector('[data-id="'+CSS.escape(id)+'"]');
   card?.scrollIntoView({block:'nearest',inline:'center'});card?.focus({preventScroll:true});
  }else fit(true);
 }));
}
function initSearch(){
 $('search').oninput=()=>{list();showSearch();};
 $('search').onfocus=showSearch;
 $('search').onkeydown=event=>{
  if(event.isComposing)return;
  if(event.key==='Tab'){closeSearch();return;}
  if(event.key==='Escape'&&!$('search-popup').hidden){event.preventDefault();event.stopPropagation();closeSearch();return;}
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();
   if($('search-popup').hidden){showSearch();return;}
   if(searchResults.length){activeResult=(activeResult+(event.key==='ArrowDown'?1:-1)+searchResults.length)%searchResults.length;updateActiveResult();}
  }
  if(event.key==='Enter'&&!$('search-popup').hidden&&activeResult>=0){event.preventDefault();chooseSearch(searchResults[activeResult].node.id);}
 };
 $('search-popup').onmousedown=event=>event.preventDefault();
 $('search-results').onclick=event=>{const option=event.target.closest('[data-id]');if(option)chooseSearch(option.dataset.id);};
 $('search').onblur=()=>requestAnimationFrame(()=>{if(!document.querySelector('.search-box').contains(document.activeElement))closeSearch();});
 document.addEventListener('pointerdown',event=>{if(!document.querySelector('.search-box').contains(event.target))closeSearch();});
}
function availableEdges(){const relation=view==='order'?orderAxis:$('relation').value;return data.edges.filter(e=>(relation==='all'||e.relation===relation)&&($('candidates').checked||e.metadata.assessment==='confirmed'));}

function orderProjection(){return data.workOrder[orderAxis][$('candidates').checked?'proposed':'explicit'];}
function orderReason(row){
 const key={'coverage-unknown':'coverageUnknown','hidden-candidates':'hiddenCandidates',
  'unresolved-prerequisite':'unresolvedPrerequisite',cycle:orderAxis==='contract'?'cycleContract':'cycleCompletion'}[row.reason];
 return key?t(key):t(row.draft?'draft':'bounded');
}
function orderLinks(nodeIds){
 const byId=ids();return nodeIds.map(id=>'<button type="button" data-id="'+esc(id)+'">'+esc(id.slice(0,3)+' · '+byId.get(id).label)+'</button>').join('');
}
function orderInfo(row){
 return '<div class="order-status">'+esc(row.iteration?t('iteration')+' '+row.iteration+' · '+orderReason(row):t('orderUnknown'))+'</div>'+
 (row.reason?'<p>'+esc(orderReason(row))+'</p>':'')+
 '<h3>'+esc(t('before'))+'</h3>'+
 (row.prerequisites.length?'<div class="order-links">'+orderLinks(row.prerequisites)+'</div>':'<p>'+esc(row.iteration?t('firstMeaning'):t('orderUnknown'))+'</p>')+
 (row.hiddenPrerequisites.length?'<h3>'+esc(t('hiddenBefore'))+'</h3><div class="order-links">'+orderLinks(row.hiddenPrerequisites)+'</div>':'')+
 '<h3>'+esc(t('after'))+'</h3>'+(row.dependents.length?'<div class="order-links">'+orderLinks(row.dependents)+'</div>':'<p>'+esc(t('noDependents'))+'</p>');
}
function renderOrder(){
 if(view!=='order')return;
 const focused=document.activeElement?.closest('#order-board button[data-id]')?.dataset.id;
 const scrolls=[...$('order-iterations').querySelectorAll('.order-iteration-cards')].map(el=>el.scrollTop);
 const projection=orderProjection(),byId=ids();
 const edges=availableEdges(),related=new Set([selected,...edges.filter(e=>e.source===selected||e.target===selected).flatMap(e=>[e.source,e.target])]);
 const card=row=>{
  const node=byId.get(row.id),dimmed=selected&&!related.has(row.id);
  return '<button type="button" class="order-card'+(dimmed?' is-dimmed':'')+'" data-id="'+esc(row.id)+'" aria-current="'+(row.id===selected)+'">'+
   '<span class="order-card-id">'+esc(row.id.slice(0,3))+'</span><strong>'+esc(node.label)+'</strong>'+
   '<span class="order-card-status">'+esc(orderReason(row))+'</span>'+
   (row.prerequisites.length?'<span class="order-card-before">'+esc(t('before')+': '+row.prerequisites.map(id=>id.slice(0,3)).join(', '))+'</span>':'')+'</button>';
 };
 const iterations=Array.from({length:projection.iterationCount},(_,i)=>{
  const rows=projection.rows.filter(r=>r.iteration===i+1);
  return '<section class="order-iteration" aria-labelledby="iteration-'+(i+1)+'"><h3 id="iteration-'+(i+1)+'"><span>'+esc(t('iteration')+' '+(i+1))+'</span><small>'+rows.length+'</small></h3><div class="order-iteration-cards">'+rows.map(card).join('')+'</div></section>';
 }).join('');
 const unknown=projection.rows.filter(r=>!r.iteration),unknownOpen=$('order-unknown')?.open||unknown.some(r=>r.id===selected);
 $('order-summary').textContent=t('iterationUnit')+': '+projection.iterationCount+' · '+t('draftUnit')+': '+projection.rows.filter(r=>r.iteration&&r.draft).length+' · '+t('unknownUnit')+': '+unknown.length;
 $('order-meaning').textContent=t(orderAxis==='contract'?'contractOrderMeaning':'completionOrderMeaning');
 $('order-iterations').innerHTML=iterations||'<p class="empty">'+esc(t('orderNone'))+'</p>';
 $('order-unassigned').innerHTML=unknown.length?'<details id="order-unknown"'+(unknownOpen?' open':'')+'><summary>'+esc(t('orderUnknown'))+' <span>'+unknown.length+'</span></summary><div class="order-unknown-grid">'+unknown.map(card).join('')+'</div></details>':'';
 $('order-board').querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>choose(b.dataset.id));
 $('order-iterations').querySelectorAll('.order-iteration-cards').forEach((el,i)=>el.scrollTop=scrolls[i]||0);
 if(focused)$('order-board').querySelector('button[data-id="'+CSS.escape(focused)+'"]')?.focus({preventScroll:true});
 $('visible-count').textContent=data.nodes.length+'/'+data.nodes.length+' '+t('slices')+' · '+edges.length+' '+t('edges');
}

function sources(refs){
 return refs.map(ref=>{const s=data.sources[ref];if(!s)return '';return anchor(s.path,s.path)+(s.quote?'<blockquote>'+esc(s.quote)+'</blockquote>':'');}).join('');
}
function edgeHtml(e){
 const other=e.source===selected?e.target:e.source;
 return '<div class="edge"><button data-id="'+esc(other)+'">'+esc(e.source.slice(0,3)+' → '+e.target.slice(0,3)+' · '+ids().get(other).label)+'</button><div class="meta">'+esc(e.metadata.id+' · '+t(e.relation)+' · '+t(e.metadata.assessment))+'</div><p>'+esc(e.metadata.condition)+'</p><details><summary>'+esc(t('basis'))+'</summary>'+sources(e.metadata.basis)+'</details></div>';
}
function details(){
 const n=ids().get(selected);
 $('details').hidden=!n;document.querySelector('.workspace').dataset.details=n?'open':'closed';
 if(!n){$('details-heading').textContent='';$('details-content').textContent='';return;}
 const edges=availableEdges(),incoming=edges.filter(e=>e.target===selected),outgoing=edges.filter(e=>e.source===selected);
 $('details-heading').innerHTML='<div class="label-muted">'+esc(n.id)+'</div><h2>'+esc(n.label)+'</h2>';
 $('details-content').innerHTML='<section class="feature-description" aria-labelledby="feature-description-heading"><h3 id="feature-description-heading">'+esc(t('aboutFeature'))+'</h3><p>'+esc(n.metadata.description||t('descriptionMissing'))+'</p></section>'+
 '<span class="pill">'+esc(t(n.metadata.review?'reviewed':'unassessed'))+'</span>'+
 (!n.metadata.review?'<p>'+esc(t('unreviewed'))+'</p>':'')+
 (view==='order'?'<section class="order-detail">'+orderInfo(orderProjection().rows.find(r=>r.id===selected))+'</section>':'')+
 '<h3>'+esc(t('rows'))+'</h3><p>'+esc(n.metadata.rows.join(', ')||t('empty'))+'</p>'+anchor(n.metadata.sdd,t('link')+' · '+n.id)+
 '<h3>'+esc(t('incoming'))+' ('+incoming.length+')</h3>'+incoming.map(edgeHtml).join('')+
 '<h3>'+esc(t('outgoing'))+' ('+outgoing.length+')</h3>'+outgoing.map(edgeHtml).join('')+
 (!incoming.length&&!outgoing.length?'<p>'+esc(t('noLinks'))+'</p>':'')+
 '<h3>'+esc(t('unknown'))+'</h3><ul>'+n.metadata.unresolved.map(q=>'<li>'+esc(q)+'</li>').join('')+'</ul>'+
 '<h3>'+esc(t('closure'))+'</h3><p class="label-muted">'+esc(t('transitive'))+'</p><ul>'+n.completionScope.map(id=>'<li>'+esc(id)+'</li>').join('')+'</ul>'+
 '<h3>'+esc(t('basis'))+'</h3>'+sources(n.metadata.basis)+
 (n.scopeDigest?'<h3>'+esc(t('scope'))+'</h3><code>'+esc(n.scopeDigest)+'</code>':'');
 $('details').querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>choose(b.dataset.id));
}
function label(n,box=null){
 const canvas=document.createElement('canvas');canvas.width=640;canvas.height=210;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle=n.id===selected?'#254c47':'#20292b';ctx.fillRect(0,0,640,210);
 ctx.strokeStyle=n.id===selected?'#9ff6e7':'#60716c';ctx.lineWidth=3;ctx.strokeRect(2,2,636,206);
 ctx.font='bold 40px system-ui';ctx.fillStyle='#e6efec';ctx.fillText(n.id.slice(0,3),18,45);
 ctx.font='43px system-ui';
 const parts=n.label.split(' ');let line='',y=102;
 for(const word of parts){const next=line?line+' '+word:word;if(ctx.measureText(next).width>603&&line){ctx.fillText(line,18,y);y+=48;line=word;}else line=next;if(y>198){line=line.slice(0,20)+'...';break;}}
 ctx.fillText(line,18,Math.min(y,195));
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const sprite=box?new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1})):new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false}));
 sprite.scale.set(box?.width||170,box?.height||55.78,1);sprite.userData={id:n.id,kind:'node'};return sprite;
}
function dispose(){
 group.traverse(o=>{o.geometry?.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){m?.map?.dispose();m?.dispose();}});
 scene.remove(group);
}
function viewState(){
 $('view-focus').setAttribute('aria-pressed',String(view==='focus'));
 $('view-all').setAttribute('aria-pressed',String(view==='all'));
 $('view-order').setAttribute('aria-pressed',String(view==='order'));
 $('scope').disabled=view!=='focus';
 for(const id of ['scope','relation'])$(id).hidden=view==='order';
 document.querySelector('.tools').hidden=view==='order';
 $('order-axis-control').hidden=view!=='order';$('order-axis').value=orderAxis;
 $('scene').hidden=view==='order';$('order-board').hidden=view!=='order';
 $('scene').dataset.view=view;
 $('depth-control').hidden=view!=='all'||flat;
 $('minimap').hidden=view!=='all';
 $('locate').disabled=!selected;
 $('rotate').disabled=flat;
}
function selectionUrl(){
 const u=new URL(location.href);u.searchParams.set('view',view);
 if(view==='order')u.searchParams.set('order',orderAxis);else u.searchParams.delete('order');
 if(!$('candidates').checked)u.searchParams.set('candidates','0');else u.searchParams.delete('candidates');
 if(selected)u.searchParams.set('slice',selected);else u.searchParams.delete('slice');
 history.replaceState(null,'',u);
}
function clearSelection(){
 if(!selected)return;
 const refit=view==='focus';selected=null;if(view==='focus')view='all';
 selectionUrl();viewState();list();details();draw(refit);
 (view==='order'?$('view-order'):renderer?.domElement)?.focus({preventScroll:true});
}
function emphasis(object,opacity){
 object.material.opacity=opacity;
 object.material.transparent=opacity<1||object.material.transparent;
 if(opacity<1)object.material.depthWrite=false;
 object.userData.dimmed=opacity<1;
}
function changeView(next){
 if(view===next)return;
 view=next;
 if(view==='focus'&&!selected)selected=lastSelected;
 selectionUrl();viewState();list();details();draw();
 if(view!=='order')requestAnimationFrame(fit);
}
function draw(refit=true){
 if(view==='order'){renderOrder();return;}
 if(!renderer)return;
 dispose();group=new THREE.Group();scene.add(group);hits=[];
 const edges=availableEdges(),scope=view==='all'?'all':$('scope').value;
 const incoming=new Set(edges.filter(e=>e.target===selected).map(e=>e.source));
 const outgoing=new Set(edges.filter(e=>e.source===selected).map(e=>e.target));
 const emphasized=new Set([selected,...incoming,...outgoing]);
 const included=new Set([selected]);
 if(scope==='all')data.nodes.forEach(n=>included.add(n.id));
 if(scope==='neighbors'||scope==='providers')incoming.forEach(id=>included.add(id));
 if(scope==='neighbors'||scope==='consumers')outgoing.forEach(id=>included.add(id));
 visible=data.nodes.filter(n=>included.has(n.id));
 const positions=new Map();
 if(scope==='all'){
  for(const node of data.overview.nodes){
   const p=overviewPosition(node,data.overview.bands,flat,depthStep);positions.set(node.id,new THREE.Vector3(p.x,p.y,p.z));
  }
  if(!flat)overviewPlanes(emphasized);
 }else{
  const left=visible.filter(n=>n.id!==selected&&incoming.has(n.id)),right=visible.filter(n=>n.id!==selected&&!incoming.has(n.id));
  positions.set(selected,new THREE.Vector3(0,0,0));
  for(const [index,n]of left.entries())positions.set(n.id,new THREE.Vector3(-240,(index-(left.length-1)/2)*75,flat?0:-30));
  for(const [index,n]of right.entries())positions.set(n.id,new THREE.Vector3(240,(index-(right.length-1)/2)*75,flat?0:30));
 }
 for(const n of visible){
  const pos=positions.get(n.id),box=scope==='all'?data.overview.nodes.find(box=>box.id===n.id):null;
  const dimmed=Boolean(selected)&&!emphasized.has(n.id);
  const sprite=label(n,box);sprite.position.copy(pos);emphasis(sprite,dimmed?0.14:1);group.add(sprite);hits.push(sprite);
  if(box){
   const body=new THREE.Mesh(new THREE.BoxGeometry(box.width,box.height,12),new THREE.MeshStandardMaterial({color:n.id===selected?'#386e60':'#344a44',roughness:0.8}));
   body.position.copy(pos).add(new THREE.Vector3(0,0,-9));body.userData={id:n.id};emphasis(body,dimmed?0.04:1);group.add(body);hits.push(body);
  }else{
   const sphere=new THREE.Mesh(new THREE.SphereGeometry(7,16,12),new THREE.MeshStandardMaterial({color:n.id===selected?'#79ebcc':'#a5b9b1',roughness:0.35}));
   sphere.position.copy(pos).add(new THREE.Vector3(0,-37,0));sphere.userData={id:n.id};emphasis(sphere,dimmed?0.14:1);group.add(sphere);hits.push(sphere);
  }
 }
 const shown=edges.filter(e=>included.has(e.source)&&included.has(e.target));
 for(const e of shown){
  let points;
  if(scope==='all'){
   const route=data.overview.edges.find(route=>route.id===e.metadata.id);
   points=overviewRoute(route,data.overview.bands,flat,depthStep).map(p=>new THREE.Vector3(p.x,p.y,p.z+0.5));
  }else{
   const start=positions.get(e.source).clone().add(new THREE.Vector3(85,0,0));
   const end=positions.get(e.target).clone().add(new THREE.Vector3(-85,0,0));
   const offset=e.relation==='contract'?8:-8;start.y+=offset;end.y+=offset;
   const middle=start.clone().lerp(end,0.5);middle.z+=flat?0:22;
   points=new THREE.QuadraticBezierCurve3(start,middle,end).getPoints(32);
  }
  const color=e.relation==='contract'?0x6ad2df:0xebbc62;
  const material=e.metadata.assessment==='candidate'?new THREE.LineDashedMaterial({color,dashSize:8,gapSize:5}):new THREE.LineBasicMaterial({color});
  const opacity=selected?(e.source===selected||e.target===selected?1:0.025):scope==='all'?0.42:1;
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);line.computeLineDistances();line.userData={edge:e};emphasis(line,opacity);group.add(line);hits.push(line);
  const end=points.at(-1),tangent=end.clone().sub(points.at(-2)).normalize();
  const cone=new THREE.Mesh(new THREE.ConeGeometry(4,14,8),new THREE.MeshBasicMaterial({color}));
  cone.position.copy(end).addScaledVector(tangent,-7);cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tangent);cone.userData={edge:e};emphasis(cone,opacity);group.add(cone);hits.push(cone);
 }
 $('visible-count').textContent=visible.length+'/'+data.nodes.length+' '+t('slices')+' · '+shown.length+' '+t('edges')+' '+t('view');
 if(refit)fit();
 drawMinimap();
}
function overviewPlanes(emphasized){
 for(const band of data.overview.bands){
  const nodes=data.overview.nodes.filter(n=>n.x>=band.left&&n.x+n.width<=band.right+0.001);
  if(!nodes.length)continue;
  const fade=selected&&!nodes.some(n=>emphasized.has(n.id))?0.1:1;
  const top=Math.min(...nodes.map(n=>n.y))-18,bottom=Math.max(...nodes.map(n=>n.y+n.height))+18;
  const left=band.left-18,right=band.right+18,z=depthAt(band.left,data.overview.bands,depthStep)-14;
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(right-left,bottom-top),new THREE.MeshBasicMaterial({color:0x628478,transparent:true,opacity:0.14*fade,side:THREE.DoubleSide,depthWrite:false}));
  plane.position.set((left+right)/2,-(top+bottom)/2,z);group.add(plane);
  const outline=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([
   new THREE.Vector3(left,-top,z),new THREE.Vector3(right,-top,z),new THREE.Vector3(right,-bottom,z),new THREE.Vector3(left,-bottom,z),
  ]),new THREE.LineBasicMaterial({color:0x628478,transparent:true,opacity:0.3*fade,depthWrite:false}));
  group.add(outline);
 }
}
function fit(selectionOnly=false){
 if(!visible.length||!renderer)return;
 const objects=selectionOnly&&selected?group.children.filter(o=>o.userData.id===selected):group.children;
 const box=new THREE.Box3();for(const object of objects)box.expandByObject(object);
 if(box.isEmpty())return;
 const center=box.getCenter(new THREE.Vector3());
 const direction=(flat?new THREE.Vector3(0,0,1):view==='all'?new THREE.Vector3(0.65,0.22,1):new THREE.Vector3(0.13,0.12,1.08)).normalize();
 controls.target.copy(center);camera.position.copy(center).add(direction);camera.lookAt(center);
 const inverse=camera.quaternion.clone().invert(),tanY=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanX=tanY*camera.aspect;
 let distance=80;
 group.updateMatrixWorld(true);
 const include=point=>{point.sub(center).applyQuaternion(inverse);distance=Math.max(distance,point.z+(Math.abs(point.x)+45)/tanX,point.z+(Math.abs(point.y)+45)/tanY);};
 for(const object of objects){
  if(!object.geometry)continue;
  if(object.isLine){
   const positions=object.geometry.attributes.position;
   for(let i=0;i<positions.count;i++)include(new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(object.matrixWorld));
   continue;
  }
  object.geometry.computeBoundingBox();const bounds=object.geometry.boundingBox;
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
   include(new THREE.Vector3(x,y,z).applyMatrix4(object.matrixWorld));
  }
 }
 if(selectionOnly&&selected)distance=Math.max(distance,800);
 const sceneSize=new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3()).length();
 distance*=1.08;controls.maxDistance=Math.max(6000,distance*5,sceneSize*5);
 camera.position.copy(center).addScaledVector(direction,distance);
 camera.near=Math.max(0.5,distance/1000);camera.far=Math.max(10000,distance+sceneSize*6);camera.updateProjectionMatrix();controls.update();
}
function choose(id){if(!ids().has(id))return;selected=id;lastSelected=id;selectionUrl();viewState();list();details();$('details').scrollTop=0;draw(view==='focus');}

function panTo(point){
 const delta=point.clone().sub(controls.target);
 camera.position.add(delta);controls.target.copy(point);controls.update();drawMinimap();
}
function drawMinimap(){
 if(view!=='all'||!camera)return;
 const map=$('minimap'),ctx=map.getContext('2d'),nodes=data.overview.nodes;
 if(!nodes.length)return;
 const maxX=Math.max(...nodes.map(n=>n.x+n.width)),maxY=Math.max(...nodes.map(n=>n.y+n.height));
 const scale=Math.min((map.width-24)/maxX,(map.height-24)/maxY),ox=(map.width-maxX*scale)/2,oy=(map.height-maxY*scale)/2;
 mapTransform={scale,ox,oy,maxX,maxY};
 ctx.clearRect(0,0,map.width,map.height);ctx.fillStyle='#172020';ctx.fillRect(0,0,map.width,map.height);
 const related=new Set([selected,...availableEdges().filter(e=>e.source===selected||e.target===selected).flatMap(e=>[e.source,e.target])]);
 for(const n of nodes){ctx.fillStyle=n.id===selected?'#ffca70':selected&&!related.has(n.id)?'#3d504c':'#91cbb9';ctx.fillRect(ox+n.x*scale,oy+n.y*scale,Math.max(3,n.width*scale),Math.max(2,n.height*scale));}
 // The footprint is projected onto the camera target plane, not a dependency layer.
 const plane=new THREE.Plane(new THREE.Vector3(0,0,1),-controls.target.z),ray=new THREE.Raycaster();
 const footprint=[[-1,1],[1,1],[1,-1],[-1,-1]].map(([x,y])=>{ray.setFromCamera(new THREE.Vector2(x,y),camera);return ray.ray.intersectPlane(plane,new THREE.Vector3());});
 if(footprint.every(Boolean)){
  ctx.beginPath();footprint.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](ox+p.x*scale,oy-p.y*scale));ctx.closePath();ctx.fillStyle='#ffffff0c';ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();
 }
 ctx.beginPath();ctx.arc(ox+controls.target.x*scale,oy-controls.target.y*scale,4,0,Math.PI*2);ctx.fillStyle='#ffca70';ctx.fill();
}
function initNavigation(){
 const map=$('minimap');
 map.onclick=event=>{
  if(!mapTransform)return;
  const rect=map.getBoundingClientRect(),{scale,ox,oy,maxX,maxY}=mapTransform;
  const x=THREE.MathUtils.clamp(((event.clientX-rect.left)/rect.width*map.width-ox)/scale,0,maxX);
  const y=THREE.MathUtils.clamp(((event.clientY-rect.top)/rect.height*map.height-oy)/scale,0,maxY);
  panTo(new THREE.Vector3(x,-y,flat?0:depthAt(x,data.overview.bands,depthStep)));
 };
 map.onkeydown=event=>{
  const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]},direction=directions[event.key];
  if(!direction)return;event.preventDefault();
  const distance=camera.position.distanceTo(controls.target)*0.15;
  panTo(controls.target.clone().add(new THREE.Vector3(direction[0]*distance,direction[1]*distance,0)));
 };
 $('locate').onclick=()=>fit(true);
 $('depth').oninput=()=>{depthStep=Number($('depth').value);$('depth-value').value=(depthStep/220).toFixed(1).replace('.0','')+'×';draw();};
 $('rotate').onclick=()=>{rotating=!rotating;$('rotate').setAttribute('aria-pressed',String(rotating));controls.mouseButtons.LEFT=rotating?THREE.MOUSE.ROTATE:THREE.MOUSE.PAN;controls.touches.ONE=rotating?THREE.TOUCH.ROTATE:THREE.TOUCH.PAN;};
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.workspace').requestFullscreen();}catch(error){console.warn('Fullscreen unavailable:',error.message);}};
 document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-pressed',String(Boolean(document.fullscreenElement)));requestAnimationFrame(()=>fit());});
}
function initScene(){
 const host=$('scene');scene=new THREE.Scene();scene.background=new THREE.Color('#121718');
 camera=new THREE.PerspectiveCamera(45,1,0.1,10000);
 renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#121718');host.appendChild(renderer.domElement);
 renderer.domElement.tabIndex=0;
 renderer.domElement.setAttribute('aria-label',t('title'));renderer.domElement.setAttribute('role','img');
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=0.12;controls.minDistance=80;controls.maxDistance=6000;
 controls.mouseButtons.LEFT=THREE.MOUSE.PAN;controls.touches.ONE=THREE.TOUCH.PAN;controls.zoomToCursor=true;
 controls.addEventListener('change',drawMinimap);initNavigation();
 scene.add(new THREE.AmbientLight(0xffffff,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(300,400,700);scene.add(light);
 group=new THREE.Group();scene.add(group);
 const canvas=renderer.domElement;
 let down=null,pointer=null,hoverDirty=false;
 const pick=e=>{
  const rect=renderer.domElement.getBoundingClientRect(),ray=new THREE.Raycaster();ray.params.Line.threshold=4;
  ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);
  const intersections=ray.intersectObjects(hits,false);
  return (intersections.find(hit=>hit.object.userData.id)||intersections.find(hit=>{const edge=hit.object.userData.edge;return edge&&(!selected||edge.source===selected||edge.target===selected);} ))?.object;
 };
 canvas.addEventListener('pointermove',e=>{pointer={clientX:e.clientX,clientY:e.clientY};hoverDirty=true;});
 canvas.addEventListener('pointerleave',()=>{pointer=null;canvas.style.cursor=down?'grabbing':'grab';});
 canvas.addEventListener('pointercancel',()=>{down=null;pointer=null;canvas.style.cursor='grab';});
 controls.addEventListener('change',()=>{hoverDirty=true;});
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};canvas.style.cursor='grabbing';});
 canvas.addEventListener('pointerup',e=>{
  const moved=!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6;down=null;hoverDirty=true;
  canvas.style.cursor='grab';if(moved||e.button!==0)return;
  const object=pick(e);
  if(object?.userData.id)choose(object.userData.id);
  else if(object?.userData.edge){choose(object.userData.edge.target);const edge=object.userData.edge;$('details-content').insertAdjacentHTML('afterbegin','<section><h3>'+esc(t('details'))+'</h3><p>'+esc(edge.metadata.id+' · '+edge.metadata.condition)+'</p>'+sources(edge.metadata.basis)+'</section>');}
 });
 let viewport=null;
 const resize=()=>{
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
  // A details panel changes canvas size, but must not reset an orbit or zoom.
  if(!viewport||viewport.width!==innerWidth||viewport.height!==innerHeight)fit();
  viewport={width:innerWidth,height:innerHeight};
 };
 new ResizeObserver(resize).observe(host);resize();
 renderer.setAnimationLoop(()=>{if(view!=='order'){controls.update();renderer.render(scene,camera);if(hoverDirty){hoverDirty=false;if(pointer&&!down)canvas.style.cursor=pick(pointer)?'pointer':'grab';}}});
}
try{
 const response=await fetch('./data.json',{cache:'no-store'});if(!response.ok)throw Error('Data request failed');data=await response.json();searchIndex=createSearchIndex(data);
 selected=new URLSearchParams(location.search).get('slice');if(!data.nodes.some(n=>n.id===selected))selected=null;
 lastSelected=selected||data.nodes.find(n=>n.id.startsWith('029-'))?.id||data.nodes[0]?.id;
 if(view==='focus'&&!selected)selected=lastSelected;
 $('candidates').checked=new URLSearchParams(location.search).get('candidates')!=='0';
 strings();viewState();list();details();
 try{initScene();draw();}catch(error){$('scene-error').hidden=false;$('scene-error').textContent=t('error')+' '+error.message;}
 initSearch();
 $('close-details').onclick=clearSelection;
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected)clearSelection();});
 $('view-focus').onclick=()=>changeView('focus');
 $('view-all').onclick=()=>changeView('all');
 $('view-order').onclick=()=>changeView('order');
 $('order-axis').onchange=()=>{orderAxis=$('order-axis').value;selectionUrl();details();draw();};
 for(const id of ['scope','relation','candidates'])$(id).onchange=()=>{selectionUrl();details();draw();};
 $('reset').onclick=()=>fit();
 $('flat').onclick=()=>{flat=!flat;$('flat').setAttribute('aria-pressed',String(flat));controls.enableRotate=!flat;controls.mouseButtons.LEFT=rotating&&!flat?THREE.MOUSE.ROTATE:THREE.MOUSE.PAN;controls.touches.ONE=rotating&&!flat?THREE.TOUCH.ROTATE:THREE.TOUCH.PAN;viewState();draw();};
 $('zoom-in').onclick=()=>{camera.position.sub(controls.target).multiplyScalar(0.8).add(controls.target);controls.update();};
 $('zoom-out').onclick=()=>{camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target);controls.update();};
}catch(error){$('notice').textContent=t('error')+' '+error.message;$('notice').style.color='#ffb2b2';console.error(error);}
