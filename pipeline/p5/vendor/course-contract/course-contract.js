import catalog from './course-contract/catalog.js';
import { compileWeekSchema } from './week-schema.js';
import { COURSE_SCHEMA } from './course-contract/schema.js';
export { COURSE_SCHEMA } from './course-contract/schema.js';

export const CONTRACT_VERSION = '2.0.0';
// P5-bővítés (Áron, 10-29; docs/app/V2_SZERZODES_IGENY_2026-10-29.md): kulcs nélküli, csak beküldéses megoldás
// ({ type: 'submission' }) kizárólag nem pontozott (formative-only) itemhez. Csak ebben a verzióban érvényes.
export const SUBMISSION_CONTRACT_VERSION = '2.0.1';
// P5-bővítés (Áron, 10-29, NYE-U34M-02; docs/app/V2_SZERZODES_ARIRAS_2026-10-29.md): a normalization két új,
// opcionális jelzője, numbersFr (betűvel/számjeggyel írt szám) és pricesFr (francia árírás, kötelező pénznemmel).
// Csak ebben a verzióban érvényesek; a 2.0.2 a 2.0.1-et is tartalmazza (submission).
export const PRICES_CONTRACT_VERSION = '2.0.2';
// P5-bővítés (Áron, 11-09, GT1; docs/app/V2_SZERZODES_MESTERSZINT_2026-11-09.md): completion.mode "mastery".
// A kötelező (alap)itemek mindegyike önállóan helyes legyen: első próbára, vagy a repetition.retryItemRefs
// újrapróba-változatával; a változat nem kötelező, de pontozott. A 2.0.3 a 2.0.1-et és a 2.0.2-t is tartalmazza.
export const MASTERY_CONTRACT_VERSION = '2.0.3';
// P5-bővítés (Áron, 11-13, U54; docs/app/V2_SZERZODES_UTVALASZTAS_2026-11-13.md): választható út (block.paths) és
// támogatott zárás (completion.mode "resolved", repetition.supportedClosure). A 2.0.4 a 2.0.1–2.0.3-at is tartalmazza.
export const PATHS_CONTRACT_VERSION = '2.0.4';
const SUBMISSION_VERSIONS = [SUBMISSION_CONTRACT_VERSION, PRICES_CONTRACT_VERSION, MASTERY_CONTRACT_VERSION, PATHS_CONTRACT_VERSION];
const PRICES_VERSIONS = [PRICES_CONTRACT_VERSION, MASTERY_CONTRACT_VERSION, PATHS_CONTRACT_VERSION];
const MASTERY_VERSIONS = [MASTERY_CONTRACT_VERSION, PATHS_CONTRACT_VERSION];
export const CATALOG_VERSION = catalog.version;
export const EVALUATION_POLICIES = Object.freeze(['closed-exact','reference-transcript','semantic-rubric','writing-dual-gate','u32-trusted-review','formative-only']);
export const RESPONSE_TYPES = Object.freeze(['single','multiple','text','fields','pairs','order','correction','writing','speech','abx','map','graph','sequence']);
export const CAPABILITY_RESPONSES = Object.freeze(Object.fromEntries([
  ['choice-single',['single']], ['choice-multiple',['multiple']], ['matching',['pairs']],
  ['typed-short',['text','fields']], ['gap-bank',['fields']], ['ordering',['order']],
  ['correction',['correction']], ['transformation',['text']], ['writing',['writing']],
  ['speech-reference',['speech']], ['speech-open',['speech']], ['audio-recognition',['single','text']],
  ['dictation',['text','fields']], ['abx',['abx']], ['recall-spoken',['speech']], ['recall-written',['writing','text']],
  ['structured-form',['fields']], ['media-observation',['single','multiple','text','writing','speech']],
  ['matching-stream',['pairs']], ['memory-pairs',['pairs']], ['letter-build',['order']],
  ['flash-round',['sequence']], ['map-placement',['map']], ['diagram-links',['graph']],
  ['drawn-production',['writing','speech']], ['review-mission',['sequence']],
].map(([id, types]) => ['CAP-'+id,Object.freeze(types)])));

// An opt-in content contract. It neither imports v1 lesson data nor marks a renderer ready.
export function compileCourseContract() {
  const structural = compileWeekSchema(COURSE_SCHEMA);
  return function validate(value) {
    if (!structural(value)) return {valid:false,errors:(structural.errors||[]).map(e=>({path:(e.instancePath+(e.keyword==='required'?'/'+e.params.missingProperty:''))||'/',code:e.keyword.toUpperCase(),message:e.message}))};
    const errors = [], ids = new Map(), refs = [], edges = new Map();
    const fail=(path,code,message)=>errors.push({path:path||'/',code,message});
    try {
    const object=(v,p,required,optional=[])=>{
      if (!v || typeof v !== 'object' || Array.isArray(v)) { fail(p,'TYPE','Expected object'); return false; }
      for(const key of required) if(!Object.hasOwn(v,key)) fail(p+'/'+key,'REQUIRED','Missing required property');
      for(const key of Object.keys(v)) if(![...required,...optional].includes(key)) fail(p+'/'+key,'UNKNOWN_PROPERTY','Unknown property');
      return true;
    };
    const str=(v,p)=>{if(typeof v!=='string'||!v.trim())fail(p,'TYPE','Expected nonempty string');};
    const en=(v,p,allowed)=>{if(!allowed.includes(v))fail(p,'ENUM','Expected one of '+allowed.join(', '));};
    const bool=(v,p)=>{if(typeof v!=='boolean')fail(p,'TYPE','Expected boolean');};
    const num=(v,p,min=0,max=Number.MAX_SAFE_INTEGER)=>{if(!Number.isFinite(v)||v<min||v>max)fail(p,'RANGE',`Expected number in ${min}..${max}`);};
    const integer=(v,p,min=0,max=Number.MAX_SAFE_INTEGER)=>{num(v,p,min,max);if(!Number.isInteger(v))fail(p,'INTEGER','Expected integer');};
    const array=(v,p,fn,min=0)=>{if(!Array.isArray(v)){fail(p,'TYPE','Expected array');return;}if(v.length<min)fail(p,'MIN_ITEMS','Too few items');v.forEach((x,i)=>fn(x,p+'/'+i));};
    const strings=(v,p,min=0)=>array(v,p,str,min);
    const uniq=(v,p)=>{if(Array.isArray(v)&&new Set(v).size!==v.length)fail(p,'DUPLICATE','Duplicate value');};
    const root=value && typeof value==='object'?`${value.namespace}:${value.courseId}`:'';
    const id=(v,p,parent,kind)=>{str(v,p);if(typeof v!=='string')return;if(!v.startsWith(parent+':')||!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(v.slice(parent.length+1)))fail(p,'ID_NAMESPACE','ID must extend parent namespace by one slug: '+parent);if(ids.has(v))fail(p,'DUPLICATE_ID','Duplicate ID '+v);else ids.set(v,{path:p,kind});};
    const references=(v,p,kinds)=>{strings(v,p);uniq(v,p);if(Array.isArray(v))v.forEach((x,i)=>refs.push({value:x,path:p+'/'+i,kinds}));};
    const range=(v,p)=>{if(object(v,p,['min','max'])){num(v.min,p+'/min');num(v.max,p+'/max');if(v.min>v.max)fail(p,'RANGE_ORDER','min exceeds max');}};
    const options=(v,p)=>{array(v,p,(x,q)=>{if(object(x,q,['id','label'])){str(x.id,q+'/id');str(x.label,q+'/label');}},1);if(Array.isArray(v))uniq(v.map(x=>x?.id),p);};
    const normalization=(v,p)=>{if(object(v,p,['unicode','caseSensitive','accentsSensitive','apostropheEquivalent','trim','collapseWhitespace','hyphensSensitive'],['numbersFr','pricesFr'])){en(v.unicode,p+'/unicode',['NFC']);for(const key of ['caseSensitive','accentsSensitive','apostropheEquivalent','trim','collapseWhitespace','hyphensSensitive'])bool(v[key],p+'/'+key);for(const key of ['numbersFr','pricesFr'])if(v[key]!==undefined){bool(v[key],p+'/'+key);if(!PRICES_VERSIONS.includes(value.schemaVersion))fail(p+'/'+key,'NORMALIZATION_FLAG_VERSION','numbersFr/pricesFr require schemaVersion '+PRICES_VERSIONS.join(' or '));}}};
    const sourceRefs=(v,p)=>references(v,p,['source']);
    function content(v,p){
      const shapes={text:['text','language'],media:['mediaRef'],table:['columns','rows'],documents:['documents'],gloss:['surface','lemma','meaning','language'],list:['entries']};
      if(!v||!shapes[v.type]){fail(p+'/type','UNKNOWN_STIMULUS','Unknown stimulus type');return;}
      if(!object(v,p,['type',...shapes[v.type]],['sourceRefs']))return;
      if(v.type==='text'){str(v.text,p+'/text');en(v.language,p+'/language',['fr','hu']);}
      if(v.type==='media')references([v.mediaRef],p+'/mediaRef',['media']);
      if(v.type==='list')strings(v.entries,p+'/entries',1);
      if(v.type==='table'){strings(v.columns,p+'/columns',1);array(v.rows,p+'/rows',(row,q)=>{strings(row,q);if(Array.isArray(row)&&row.length!==v.columns?.length)fail(q,'TABLE_WIDTH','Row width differs from columns');},1);}
      if(v.type==='documents')array(v.documents,p+'/documents',(d,q)=>{if(object(d,q,['title','text','sourceRefs'])){str(d.title,q+'/title');str(d.text,q+'/text');sourceRefs(d.sourceRefs,q+'/sourceRefs');}},2);
      if(v.type==='gloss')for(const k of ['surface','lemma','meaning','language'])str(v[k],p+'/'+k);
      if(v.sourceRefs)sourceRefs(v.sourceRefs,p+'/sourceRefs');
    }
    function response(v,p){
      const configs={single:['options'],multiple:['options','selection'],text:['normalization'],fields:['fields'],pairs:['left','right'],order:['tokens'],correction:['text','spans'],writing:['wordRange'],speech:['durationRange'],abx:['tokens'],map:['locations','places'],graph:['nodes','relations'],sequence:['itemRefs']};
      if(!v||!configs[v.type]){fail(p+'/type','UNKNOWN_RESPONSE','Unknown response type');return;}
      const optional={fields:['bank','formPolicy'],writing:['parts'],speech:['transcriptAllowed'],pairs:['refill','memory'],order:['reuse'],abx:['window'],map:['keyboardAlternative'],graph:['directed'],sequence:['timedSeconds','sourceWeeks']};
      if(!object(v,p,['type',...configs[v.type]],optional[v.type]||[]))return;
      if(v.options)options(v.options,p+'/options');
      if(v.type==='multiple'){range(v.selection,p+'/selection');if(v.selection?.max>v.options?.length)fail(p+'/selection','SELECTION_RANGE','Selection exceeds options');}
      if(v.type==='text')normalization(v.normalization,p+'/normalization');
      if(v.type==='fields')array(v.fields,p+'/fields',(f,q)=>{if(object(f,q,['id','label','required','normalization'],['accepted','gender','articleRequired'])){str(f.id,q+'/id');str(f.label,q+'/label');bool(f.required,q+'/required');normalization(f.normalization,q+'/normalization');if(f.accepted)strings(f.accepted,q+'/accepted',1);if(f.gender)en(f.gender,q+'/gender',['masculine','feminine','none']);if(f.articleRequired!==undefined)bool(f.articleRequired,q+'/articleRequired');}},1);
      for(const k of ['bank','left','right','tokens','locations','places','nodes','relations'])if(v[k]&&v.type!=='abx')options(v[k],p+'/'+k);
      if(v.type==='correction'){str(v.text,p+'/text');array(v.spans,p+'/spans',(s,q)=>{if(object(s,q,['id','start','end'])){str(s.id,q+'/id');integer(s.start,q+'/start');integer(s.end,q+'/end');if(s.start>=s.end||s.end>v.text?.length)fail(q,'SPAN_RANGE','Invalid correction span');}},1);}
      if(v.type==='writing')range(v.wordRange,p+'/wordRange');
      if(v.type==='speech')range(v.durationRange,p+'/durationRange');
      if(v.parts)options(v.parts,p+'/parts');
      for(const k of ['transcriptAllowed','refill','memory','reuse','keyboardAlternative','directed'])if(v[k]!==undefined)bool(v[k],p+'/'+k);
      if(v.type==='abx'){array(v.tokens,p+'/tokens',(t,q)=>{if(object(t,q,['role','mediaRef','speaker','category'])){en(t.role,q+'/role',['A','B','X']);references([t.mediaRef],q+'/mediaRef',['media']);str(t.speaker,q+'/speaker');str(t.category,q+'/category');}},3);if(Array.isArray(v.tokens)){if(v.tokens.length!==3||new Set(v.tokens.map(t=>t.role)).size!==3)fail(p+'/tokens','ABX_ROLES','Exactly A B X required');if(new Set(v.tokens.map(t=>t.mediaRef)).size!==3)fail(p+'/tokens','ABX_TOKEN_IDENTITY','Three distinct tokens required');if(new Set(v.tokens.map(t=>t.speaker)).size!==1)fail(p+'/tokens','ABX_SPEAKER','One speaker required');const a=v.tokens.find(t=>t.role==='A'),b=v.tokens.find(t=>t.role==='B'),x=v.tokens.find(t=>t.role==='X');if(a?.category===b?.category||![a?.category,b?.category].includes(x?.category))fail(p+'/tokens','ABX_CATEGORY','A and B differ; X must match one');}if(v.window&&object(v.window,p+'/window',['size','required'])){integer(v.window.size,p+'/window/size',1);integer(v.window.required,p+'/window/required',1,v.window.size);}}
      if(v.type==='sequence'){references(v.itemRefs,p+'/itemRefs',['item']);if(v.sourceWeeks)array(v.sourceWeeks,p+'/sourceWeeks',(w,q)=>integer(w,q,1,40),2);if(v.timedSeconds!==undefined)num(v.timedSeconds,p+'/timedSeconds',1);}
      if(v.type==='fields'&&Array.isArray(v.fields))uniq(v.fields.map(f=>f.id),p+'/fields');
      if(v.formPolicy!==undefined){
        en(v.formPolicy,p+'/formPolicy',['free','typed-gender-bearing','typed-mf-pair','conditional-gender-recall']);
        if(v.formPolicy==='typed-mf-pair'&&(v.fields.length!==2||v.fields.some(f=>!f.required)||v.fields[0].gender!=='masculine'||v.fields[1].gender!=='feminine'))fail(p+'/fields','GENDER_PAIR','Two required ordered masculine/feminine typed fields required');
        if(v.formPolicy==='conditional-gender-recall'&&!(v.fields.length===1&&v.fields[0].required&&v.fields[0].gender==='masculine'||v.fields.length===2&&v.fields.every(f=>f.required)&&v.fields[0].gender==='masculine'&&v.fields[1].gender==='feminine'))fail(p+'/fields','GENDER_PAIR','Conditional recall explicitly selects base-only or ordered required m/f fields');
        if(v.formPolicy==='typed-gender-bearing'&&v.fields.some(f=>!f.articleRequired||!f.accepted?.length))fail(p+'/fields','ARTICLE_REQUIRED','Explicit accepted article-bearing forms required');
        if(v.formPolicy!=='free'&&v.fields.some(f=>!f.normalization.accentsSensitive||!f.normalization.hyphensSensitive))fail(p+'/fields','FRENCH_NORMALIZATION','French target diacritics and hyphens are strict');
      }
    }
    function solution(v,p,r){
      if(!v||!['exact','rubric','reference',...(SUBMISSION_VERSIONS.includes(value.schemaVersion)?['submission']:[])].includes(v.type)){fail(p+'/type','UNKNOWN_SOLUTION','Unknown solution type');return;}
      if(v.type==='submission'){object(v,p,['type']);return;}
      if(v.type==='exact'&&object(v,p,['type','answers'])){array(v.answers,p+'/answers',(a,q)=>{
        const known=(x,allowed,path)=>{if(!allowed.includes(x))fail(path,'UNKNOWN_ANSWER_KEY','Answer references unknown or omitted ID');};
        const scalar=['single','text','abx'].includes(r?.type);
        if(scalar){str(a,q);if(r.type==='abx')en(a,q,['A','B']);return;}
        if(r?.type==='graph'){array(a,q,(edge,z)=>{if(object(edge,z,['from','to','relation'])){known(edge.from,r.nodes.map(x=>x.id),z+'/from');known(edge.to,r.nodes.map(x=>x.id),z+'/to');known(edge.relation,r.relations.map(x=>x.id),z+'/relation');}},1);if(Array.isArray(a))uniq(a.map(edge=>JSON.stringify([edge.from,edge.to,edge.relation])),q);return;}
        if(['multiple','order','sequence'].includes(r?.type)){strings(a,q,1);uniq(a,q);const allowed=r.type==='multiple'?r.options.map(x=>x.id):r.type==='order'?r.tokens.map(x=>x.id):r.itemRefs;if(Array.isArray(a)){a.forEach((x,i)=>known(x,allowed,q+'/'+i));if(r.type==='order'&&a.length!==allowed.length)fail(q,'ANSWER_ARITY','Ordering must use every token');if(r.type==='multiple'&&(a.length<r.selection?.min||a.length>r.selection?.max))fail(q,'ANSWER_ARITY','Answer violates selection range');}return;}
        const slots=r?.type==='fields'?r.fields:r?.type==='pairs'?r.left:r?.type==='correction'?r.spans:r?.type==='map'?r.places:null;
        if(!slots){fail(q,'KEY_SHAPE','Exact keys unsupported for response type');return;}
        const required=slots.filter(s=>s.required!==false).map(s=>s.id),optional=slots.filter(s=>s.required===false).map(s=>s.id);
        if(object(a,q,required,optional))for(const [k,x] of Object.entries(a)){str(x,q+'/'+k);if(r.type==='pairs')known(x,r.right.map(y=>y.id),q+'/'+k);if(r.type==='map')known(x,r.locations.map(y=>y.id),q+'/'+k);if(r.type==='fields'){const field=r.fields.find(y=>y.id===k);if(field?.accepted&&!field.accepted.includes(x))fail(q+'/'+k,'FIELD_ACCEPTED','Key not in field accepted forms');}}
      },1);
        const opts=r?.options?.map(o=>o.id);if(opts&&Array.isArray(v.answers))for(const a of v.answers){const vals=Array.isArray(a)?a:[a];if(vals.some(x=>!opts.includes(x)))fail(p+'/answers','UNKNOWN_OPTION_KEY','Answer not in options');if(r.type==='single'&&Array.isArray(a))fail(p+'/answers','KEY_SHAPE','Single response needs scalar answer');}
      }
      if(v.type==='reference'&&object(v,p,['type','text','accepted'])){str(v.text,p+'/text');strings(v.accepted,p+'/accepted');}
      if(v.type==='rubric'&&object(v,p,['type','criteria'])){array(v.criteria,p+'/criteria',(c,q)=>{if(object(c,q,['id','description','required'],['targetRef','distinctEvidence'])){str(c.id,q+'/id');str(c.description,q+'/description');bool(c.required,q+'/required');if(c.targetRef)references([c.targetRef],q+'/targetRef',['target']);if(c.distinctEvidence!==undefined)bool(c.distinctEvidence,q+'/distinctEvidence');}},1);if(Array.isArray(v.criteria))uniq(v.criteria.map(c=>c.id),p+'/criteria');}
    }
    function item(v,p,parent){
      if(!object(v,p,['id','capability','prompt','response','solution','evaluation','repair','repetition','sourceRefs','targetRefs','mediaRefs'],['draw','routes','requires','evidence','anchorRefs','playback']))return;
      id(v.id,p+'/id',parent,'item');str(v.prompt,p+'/prompt');en(v.capability,p+'/capability',catalog.capabilities.map(c=>c.id));response(v.response,p+'/response');solution(v.solution,p+'/solution',v.response);
      if(!CAPABILITY_RESPONSES[v.capability]?.includes(v.response?.type))fail(p+'/response/type','CAPABILITY_RESPONSE','Response incompatible with capability');
      if(['single','multiple','pairs','fields','order','correction','abx','map','graph','sequence'].includes(v.response.type)&&v.solution.type!=='exact'&&v.solution.type!=='submission')fail(p+'/solution','EXACT_SOLUTION_REQUIRED','Closed structured response requires typed exact keys');
      if(v.solution?.type==='submission'&&(v.evaluation?.mode!=='formative'||v.evaluation?.policyId!=='formative-only'))fail(p+'/solution','SUBMISSION_FORMATIVE_ONLY','Submission-only solution requires formative-only evaluation');
      if(['single','multiple','abx'].includes(v.response.type)&&v.solution.type==='exact'&&v.solution.answers.length!==1)fail(p+'/solution/answers','AMBIGUOUS_CHOICE_KEY','Choice item requires one unambiguous correct answer or answer set');
      if(v.response.type==='sequence'&&v.solution.type==='exact')for(const answer of v.solution.answers)if(!Array.isArray(answer)||answer.length!==v.response.itemRefs.length)fail(p+'/solution/answers','SEQUENCE_COVERAGE','Sequence key must cover every referenced child');
      if(v.capability==='CAP-abx'){
        const x=v.response.tokens.find(t=>t.role==='X'),a=v.response.tokens.find(t=>t.role==='A');
        const expected=x.category===a.category?'A':'B';
        if(v.solution.type==='exact'&&v.solution.answers.some(answer=>answer!==expected))fail(p+'/solution/answers','ABX_KEY_CATEGORY','ABX key must agree with X category');
        const uris=v.response.tokens.map(t=>value.media.find(m=>m.id===t.mediaRef)?.uri);
        if(uris.every(Boolean)&&new Set(uris.map(uri=>decodeURIComponent(uri))).size!==3)fail(p+'/response/tokens','ABX_ASSET_IDENTITY','Distinct IDs cannot alias the same audio token URI');
      }
      sourceRefs(v.sourceRefs,p+'/sourceRefs');references(v.targetRefs,p+'/targetRefs',['target']);references(v.mediaRefs,p+'/mediaRefs',['media']);
      if(v.requires!==undefined)fail(p+'/requires','UNSUPPORTED_REQUIREMENT','Unregistered requires not permitted');
      const e=v.evaluation;
      if(object(e,p+'/evaluation',['mode','policyId','uncertainty','selfCheckCanPass'],['authorityRefs','scopeBlockRef','minimumScore','revisionBinding','status'])){en(e.mode,p+'/evaluation/mode',['exact','reference','semantic','dual-gate','human','formative']);str(e.policyId,p+'/evaluation/policyId');en(e.uncertainty,p+'/evaluation/uncertainty',['pending']);if(e.selfCheckCanPass!==false)fail(p+'/evaluation/selfCheckCanPass','UNSAFE_MASTERY','Self check cannot grant semantic mastery');if(e.authorityRefs)sourceRefs(e.authorityRefs,p+'/evaluation/authorityRefs');if(e.scopeBlockRef)references([e.scopeBlockRef],p+'/evaluation/scopeBlockRef',['block']);if(e.minimumScore!==undefined)num(e.minimumScore,p+'/evaluation/minimumScore',0,5);if(e.revisionBinding!==undefined)en(e.revisionBinding,p+'/evaluation/revisionBinding',['current-full-response']);if(e.status!==undefined)en(e.status,p+'/evaluation/status',['draft','validated']);}
      if(v.solution?.type==='rubric'&&!['semantic','dual-gate','human','formative'].includes(e?.mode))fail(p+'/evaluation','SEMANTIC_REQUIRED','Rubric cannot use exact-only evaluation');
      en(e?.policyId,p+'/evaluation/policyId',EVALUATION_POLICIES);
      const modes={'closed-exact':['exact'],'reference-transcript':['reference'],'semantic-rubric':['semantic','human'],'writing-dual-gate':['dual-gate'],'u32-trusted-review':['semantic','human'],'formative-only':['formative']};
      if(!modes[e?.policyId]?.includes(e?.mode))fail(p+'/evaluation/mode','POLICY_MODE','Mode inconsistent with policy');
      if(['semantic-rubric','writing-dual-gate','u32-trusted-review'].includes(e?.policyId)){
        if(!e.authorityRefs?.length)fail(p+'/evaluation/authorityRefs','AUTHORITY_REQUIRED','Semantic policy requires authority evidence');
        if(e.scopeBlockRef!==parent.substring(0,parent.lastIndexOf(':')))fail(p+'/evaluation/scopeBlockRef','POLICY_SCOPE','Policy must bind owning block');
      }
      if(e?.policyId==='u32-trusted-review'&&!value.sources.some(s=>e.authorityRefs?.includes(s.id)&&s.policyGrants?.some(grant=>grant.policyId===e.policyId&&grant.blockRefs.includes(e.scopeBlockRef))))fail(p+'/evaluation/authorityRefs','POLICY_GRANT','Scoped exception requires explicit source grant for owning block');
      if(v.response?.type==='writing'&&!['writing-dual-gate','u32-trusted-review','formative-only'].includes(e?.policyId))fail(p+'/evaluation/policyId','WRITING_POLICY','Writing requires dual gate or explicit approved block override');
      if(e?.policyId==='writing-dual-gate'&&e.minimumScore!==3)fail(p+'/evaluation/minimumScore','WRITING_THRESHOLD','Writing dual gate requires 3/5 minimum');
      const open=['writing','speech'].includes(v.response?.type)&&v.solution?.type!=='reference';
      if(v.capability==='CAP-speech-open'&&v.solution.type!=='rubric')fail(p+'/solution','OPEN_SPEECH_RUBRIC','Own-word speech needs a semantic rubric');
      if(v.capability==='CAP-drawn-production'&&v.solution.type!=='rubric')fail(p+'/solution','DRAWN_RUBRIC','Drawn production requires a task-bound rubric');
      // P5-bővítés (11-14, U54 t02): nem pontozott írásnál kulcs nélküli beküldés is lehet (a submission csak formative-only, 2.0.1+).
      if(open&&v.solution?.type!=='rubric'&&!(v.solution?.type==='submission'&&v.response?.type==='writing'))fail(p+'/solution','RUBRIC_REQUIRED','Open production requires rubric');
      if(open&&e?.revisionBinding!=='current-full-response')fail(p+'/evaluation/revisionBinding','REVISION_BINDING','Open evaluation must bind current full response');
      if(object(v.repair,p+'/repair',['mode','hideFeedback'])){en(v.repair.mode,p+'/repair/mode',['none','delayed-retry','full-revision','targeted-then-full']);bool(v.repair.hideFeedback,p+'/repair/hideFeedback');if(open&&!['full-revision','targeted-then-full'].includes(v.repair.mode))fail(p+'/repair','FULL_REVISION','Open repair requires new full version');}
      if(open&&!v.repair.hideFeedback)fail(p+'/repair/hideFeedback','FEEDBACK_LEAKAGE','Hide feedback during independent full revision');
      if(object(v.repetition,p+'/repetition',['mode','minIntervening','independentSuccess'],['retryItemRefs','immutableFirstAttempt','recovery','supportedClosure'])){en(v.repetition.mode,p+'/repetition/mode',['none','delayed','spaced']);integer(v.repetition.minIntervening,p+'/repetition/minIntervening');if(v.repetition.independentSuccess!==true)fail(p+'/repetition/independentSuccess','INDEPENDENCE','Independent success required');}
      if(['CAP-audio-recognition','CAP-dictation','CAP-media-observation'].includes(v.capability)&&!v.mediaRefs?.length)fail(p+'/mediaRefs','MEDIA_REQUIRED','Capability requires actual media');
      if(['CAP-audio-recognition','CAP-dictation'].includes(v.capability)&&v.mediaRefs.some(ref=>value.media.find(m=>m.id===ref)?.kind!=='audio'))fail(p+'/mediaRefs','AUDIO_REQUIRED','Audio capability must bind audio media');
      if(v.capability==='CAP-abx'&&v.response.tokens.some(t=>value.media.find(m=>m.id===t.mediaRef)?.kind!=='audio'))fail(p+'/response/tokens','AUDIO_REQUIRED','ABX tokens must be audio');
      if(v.capability==='CAP-gap-bank'&&!v.response?.bank?.length)fail(p+'/response/bank','BANK_REQUIRED','Word bank required');
      if(v.capability==='CAP-gap-bank'&&v.response.bank?.length&&v.solution.type==='exact')for(const answer of v.solution.answers)if(Object.values(answer).some(x=>!v.response.bank.some(t=>t.id===x)))fail(p+'/solution/answers','BANK_KEY','Gap answer must reference a bank token');
      if(v.capability==='CAP-matching-stream'&&v.response.refill!==true)fail(p+'/response/refill','REFILL_REQUIRED','Streaming matching requires refill');
      if(v.capability==='CAP-memory-pairs'&&v.response.memory!==true)fail(p+'/response/memory','MEMORY_REQUIRED','Memory pairs require conceal/reveal mode');
      if(v.capability==='CAP-review-mission'&&(!v.response.sourceWeeks||new Set(v.response.sourceWeeks).size<2))fail(p+'/response/sourceWeeks','REVIEW_WEEKS_REQUIRED','Mission requires at least two source weeks');
      if(v.response.type==='sequence')edges.set(v.id,v.response.itemRefs);
      if(v.evidence){
        if(object(v.evidence,p+'/evidence',['modality','assistance'],['canonicalText'])){
          en(v.evidence.modality,p+'/evidence/modality',['written','spoken','listening','phonetic','visual']);en(v.evidence.assistance,p+'/evidence/assistance',['uncued','cued','assisted']);
          if(v.evidence.canonicalText!==undefined)str(v.evidence.canonicalText,p+'/evidence/canonicalText');
          if(v.evidence.modality==='spoken'&&v.response.type!=='speech')fail(p+'/evidence/modality','MODALITY_MISMATCH','Typed response cannot grant spoken evidence');
          if(v.evidence.modality==='phonetic'&&e.policyId==='reference-transcript')fail(p+'/evidence/modality','PHONETIC_OVERCLAIM','Transcript comparison is not phonetic scoring');
        }
      }
      if(['CAP-recall-spoken','CAP-recall-written'].includes(v.capability)){
        if(!v.evidence?.canonicalText||v.evidence.assistance!=='uncued'||v.evidence.modality!==(v.capability==='CAP-recall-spoken'?'spoken':'written'))fail(p+'/evidence','RECALL_EVIDENCE','Recall requires separate uncued canonical evidence per modality');
      }
      if(v.playback&&object(v.playback,p+'/playback',['maxPlays','transcriptPolicy'])){integer(v.playback.maxPlays,p+'/playback/maxPlays',1);en(v.playback.transcriptPolicy,p+'/playback/transcriptPolicy',['always','after-attempt','after-completion','hidden']);}
      if(v.anchorRefs)array(v.anchorRefs,p+'/anchorRefs',(anchor,q)=>{if(object(anchor,q,['mediaRef','segmentId'])){references([anchor.mediaRef],q+'/mediaRef',['media']);str(anchor.segmentId,q+'/segmentId');const media=value.media.find(m=>m.id===anchor.mediaRef);if(!media?.segments?.some(s=>s.id===anchor.segmentId))fail(q,'UNKNOWN_ANCHOR','Unknown segment on referenced media');}});
      if(v.repetition.retryItemRefs)references(v.repetition.retryItemRefs,p+'/repetition/retryItemRefs',['item']);
      if(v.repetition.immutableFirstAttempt!==undefined)bool(v.repetition.immutableFirstAttempt,p+'/repetition/immutableFirstAttempt');if(v.repetition.supportedClosure!==undefined){bool(v.repetition.supportedClosure,p+'/repetition/supportedClosure');if(value.schemaVersion!==PATHS_CONTRACT_VERSION)fail(p+'/repetition/supportedClosure','SUPPORTED_CLOSURE_VERSION','supportedClosure requires schemaVersion '+PATHS_CONTRACT_VERSION);}
      if(v.repetition.recovery!==undefined)en(v.repetition.recovery,p+'/repetition/recovery',['none','repair-errors','new-full-window']);
      if(v.capability==='CAP-abx'&&(v.repetition.immutableFirstAttempt!==true||v.repetition.recovery!=='new-full-window'||!v.response.window))fail(p+'/repetition','ABX_RECOVERY','ABX needs immutable initial window and new full-window recovery');
      if(v.capability==='CAP-drawn-production'&&!v.draw)fail(p+'/draw','DRAW_REQUIRED','Draw configuration required');
      if(v.draw&&object(v.draw,p+'/draw',['cards','count'])){options(v.draw.cards,p+'/draw/cards');integer(v.draw.count,p+'/draw/count',1,v.draw.cards?.length||0);}
      if(v.routes)array(v.routes,p+'/routes',(r,q)=>{if(object(r,q,['id','itemRefs','gateRefs'])){str(r.id,q+'/id');references(r.itemRefs,q+'/itemRefs',['item']);sourceRefs(r.gateRefs,q+'/gateRefs');edges.set(v.id,[...(edges.get(v.id)||[]),...r.itemRefs]);}},1);
    }
    if(!object(value,'',['schemaVersion','catalogVersion','contentVersion','namespace','label','courseId','weeks','sources','media','targets'],['applicationPages']))return{valid:false,errors};
    en(value.schemaVersion,'/schemaVersion',[CONTRACT_VERSION,...SUBMISSION_VERSIONS]);en(value.catalogVersion,'/catalogVersion',[CATALOG_VERSION]);str(value.contentVersion,'/contentVersion');en(value.namespace,'/namespace',['demo','course']);str(value.label,'/label');str(value.courseId,'/courseId');if(typeof value.courseId==='string'&&!/^[a-z][a-z0-9-]*$/.test(value.courseId))fail('/courseId','ID_NAMESPACE','Use lowercase slug');if(value.namespace==='demo'&&!value.label?.includes('DEMO'))fail('/label','DEMO_LABEL','Demo must be visibly labelled DEMO');
    array(value.sources,'/sources',(s,p)=>{if(object(s,p,['id','title','locator','rights'],['policyGrants'])){id(s.id,p+'/id',root,'source');str(s.title,p+'/title');str(s.locator,p+'/locator');en(s.rights,p+'/rights',['original','licensed','link-only','pending']);if(s.policyGrants)array(s.policyGrants,p+'/policyGrants',(grant,q)=>{if(object(grant,q,['policyId','blockRefs'])){en(grant.policyId,q+'/policyId',['u32-trusted-review']);references(grant.blockRefs,q+'/blockRefs',['block']);if(!grant.blockRefs.length)fail(q+'/blockRefs','EMPTY_GRANT','Grant must identify authorized blocks');}});}});
    array(value.media,'/media',(m,p)=>{if(object(m,p,['id','kind','uri','sourceRef','access','offline','alternative'],['duration','transcript','transcriptPolicy','gateStatus','segments','checkedAt','backupRef','auditStatus'])){id(m.id,p+'/id',root,'media');en(m.kind,p+'/kind',['audio','video','image']);str(m.uri,p+'/uri');if(typeof m.uri==='string'&&(/^(?:javascript|data|file):/i.test(m.uri)||m.uri.includes('..')))fail(p+'/uri','UNSAFE_URI','Unsafe media URI');references([m.sourceRef],p+'/sourceRef',['source']);en(m.access,p+'/access',['local','link','embed']);bool(m.offline,p+'/offline');str(m.alternative,p+'/alternative');if(m.access!=='local'&&m.offline)fail(p+'/offline','OFFLINE_EXTERNAL','External media cannot claim offline');if(m.duration!==undefined)num(m.duration,p+'/duration',0.01);if(m.transcript!==undefined)str(m.transcript,p+'/transcript');if(m.transcriptPolicy!==undefined)en(m.transcriptPolicy,p+'/transcriptPolicy',['always','after-attempt','after-completion','hidden']);}});
    array(value.targets,'/targets',(t,p)=>{if(object(t,p,['id','description','taughtIn','sourceRefs'])){id(t.id,p+'/id',root,'target');str(t.description,p+'/description');references(t.taughtIn,p+'/taughtIn',['page']);sourceRefs(t.sourceRefs,p+'/sourceRefs');}});
    array(value.weeks,'/weeks',(w,p)=>{if(!object(w,p,['id','number','title','blocks']))return;id(w.id,p+'/id',root,'week');integer(w.number,p+'/number',1,40);str(w.title,p+'/title');array(w.blocks,p+'/blocks',(b,q)=>{if(!object(b,q,['id','kind','title','prerequisites','pages','completion'],['taughtTargetRefs','position','assessmentKind','estimatedMinutes','weight','paths']))return;id(b.id,q+'/id',w.id,'block');en(b.kind,q+'/kind',['lesson','assessment']);str(b.title,q+'/title');references(b.prerequisites,q+'/prerequisites',['block']);if(Array.isArray(b.prerequisites))edges.set(b.id,b.prerequisites);if(b.taughtTargetRefs)references(b.taughtTargetRefs,q+'/taughtTargetRefs',['target']);array(b.pages,q+'/pages',(g,t)=>{if(!object(g,t,['id','template','variant','title','content','items']))return;id(g.id,t+'/id',b.id,'page');str(g.title,t+'/title');const family=catalog.templates.find(f=>f.id===g.template);if(!family)fail(t+'/template','UNKNOWN_TEMPLATE','Unknown template');else en(g.variant,t+'/variant',family.variants);array(g.content,t+'/content',content);array(g.items,t+'/items',(i,z)=>item(i,z,g.id));},1);if(object(b.completion,q+'/completion',['mode','requiredRefs'])){en(b.completion.mode,q+'/completion/mode',['all-items','acknowledge','all-targets',...(MASTERY_VERSIONS.includes(value.schemaVersion)?['mastery']:[]),...(value.schemaVersion===PATHS_CONTRACT_VERSION?['resolved']:[])]);if(b.completion.mode==='mastery'&&!MASTERY_VERSIONS.includes(value.schemaVersion))fail(q+'/completion/mode','COMPLETION_MODE_VERSION','mastery requires schemaVersion '+MASTERY_VERSIONS.join(' or '));if(b.completion.mode==='resolved'&&value.schemaVersion!==PATHS_CONTRACT_VERSION)fail(q+'/completion/mode','COMPLETION_MODE_VERSION','resolved requires schemaVersion '+PATHS_CONTRACT_VERSION);if(b.paths!==undefined&&value.schemaVersion!==PATHS_CONTRACT_VERSION)fail(q+'/paths','PATHS_VERSION','paths require schemaVersion '+PATHS_CONTRACT_VERSION);references(b.completion.requiredRefs,q+'/completion/requiredRefs',b.completion.mode==='all-targets'?['target']:['mastery','resolved'].includes(b.completion.mode)?['item']:['item','page']);}},1);},1);
    if(value.applicationPages)array(value.applicationPages,'/applicationPages',(page,p)=>{
      id(page.id,p+'/id',root,'page');const family=catalog.templates.find(f=>f.id===page.template);
      if(!page.template.startsWith('APP-')||!family?.variants.includes(page.variant))fail(p+'/variant','APP_VARIANT','Invalid application template/variant');
      array(page.content,p+'/content',content);array(page.items,p+'/items',(i,q)=>item(i,q,page.id));
    });
    for(const [wi,w] of value.weeks.entries())for(const [bi,b] of w.blocks.entries()){
      const p=`/weeks/${wi}/blocks/${bi}`;
      if(b.position){if(object(b.position,p+'/position',['row','column'])){integer(b.position.row,p+'/position/row',1,5);integer(b.position.column,p+'/position/column',1,4);}}
      if(b.kind==='assessment')en(b.assessmentKind,p+'/assessmentKind',['grammar','reading','vocabulary']);
      if(b.kind==='lesson'&&b.assessmentKind!==undefined)fail(p+'/assessmentKind','BLOCK_KIND','Lesson cannot be an assessment');
      if(b.estimatedMinutes)range(b.estimatedMinutes,p+'/estimatedMinutes');
      if(b.weight!==undefined)num(b.weight,p+'/weight',0.001);
      const allItems=b.pages.flatMap(g=>g.items), ownRefs=new Set([...b.pages.map(g=>g.id),...allItems.map(i=>i.id)]);
      const targetIds=new Set(allItems.flatMap(i=>i.targetRefs));
      for(const ref of b.completion.requiredRefs)if(!(b.completion.mode==='all-targets'?targetIds:ownRefs).has(ref))fail(p+'/completion/requiredRefs','COMPLETION_SCOPE','Completion must refer to owning block evidence');
      const scored=allItems.filter(i=>i.evaluation.mode!=='formative');
      if(b.completion.mode==='acknowledge'&&scored.length)fail(p+'/completion','COMPLETION_BYPASS','Acknowledgement cannot complete scored items');
      if(b.completion.mode!=='acknowledge'&&!b.completion.requiredRefs.length)fail(p+'/completion/requiredRefs','EMPTY_COMPLETION','Explicit completion evidence required');
      if(b.completion.mode==='all-items'&&scored.some(i=>!b.completion.requiredRefs.includes(i.id)))fail(p+'/completion/requiredRefs','INCOMPLETE_COMPLETION','Every scored item must be required');
      if(['mastery','resolved'].includes(b.completion.mode)){
        const required=allItems.filter(i=>b.completion.requiredRefs.includes(i.id)),retryIds=new Set(required.flatMap(i=>i.repetition.retryItemRefs||[]));
        if(b.completion.requiredRefs.some(ref=>!allItems.some(i=>i.id===ref)))fail(p+'/completion/requiredRefs','MASTERY_SCOPE','Mastery requires item references');
        if(scored.some(i=>!b.completion.requiredRefs.includes(i.id)&&!retryIds.has(i.id)))fail(p+'/completion/requiredRefs','INCOMPLETE_COMPLETION','Every scored item must be required or a retry variant of a required item');
        for(const ref of retryIds){if(b.completion.requiredRefs.includes(ref))fail(p+'/completion/requiredRefs','MASTERY_RETRY_REQUIRED','A retry variant cannot itself be required');if(!allItems.some(i=>i.id===ref))fail(p+'/completion','RETRY_SCOPE','Retry variant must be in the same block');}
        if(b.completion.mode==='mastery')for(const i of required)if(i.repetition.retryItemRefs?.length&&i.repetition.immutableFirstAttempt!==true)fail(p+'/completion','MASTERY_FIRST_ATTEMPT','Mastery with retry variants needs an immutable first attempt');
        // Támogatott zárás: a változatlánc végén a tanuló a megoldás láttán még egyszer válaszol, és az item lezárul (nem pont).
        if(b.completion.mode==='resolved')for(const i of required)if(i.repetition.retryItemRefs?.length&&i.repetition.supportedClosure!==true)fail(p+'/completion','RESOLVED_NEEDS_CLOSURE','A retry chain in resolved mode must end in a supported closure');
      }
      for(const i of allItems)if(i.repetition.supportedClosure&&b.completion.mode!=='resolved')fail(p+'/completion','SUPPORTED_CLOSURE_SCOPE','Supported closure only in resolved completion');
      // Választható út: a választóoldal után az opciók saját oldalai; a többi oldal minden úton látszik.
      if(b.paths!==undefined&&object(b.paths,p+'/paths',['choicePageRef','options'])){
        const pageIds=b.pages.map(g=>g.id),choiceAt=pageIds.indexOf(b.paths.choicePageRef);
        if(choiceAt<0)fail(p+'/paths/choicePageRef','PATH_SCOPE','Choice page must be a page of the block');
        array(b.paths.options,p+'/paths/options',(o,t)=>{if(!object(o,t,['id','label','pageRefs'],['recommended']))return;str(o.id,t+'/id');str(o.label,t+'/label');if(o.recommended!==undefined)bool(o.recommended,t+'/recommended');
          array(o.pageRefs,t+'/pageRefs',(ref,r)=>{if(!pageIds.includes(ref))fail(r,'PATH_SCOPE','Path page must be a page of the block');else if(pageIds.indexOf(ref)<=choiceAt)fail(r,'PATH_ORDER','Path pages must follow the choice page');},1);},2);
        if(Array.isArray(b.paths.options)){
          uniq(b.paths.options.map(o=>o?.id),p+'/paths/options');
          const owned=b.paths.options.flatMap(o=>Array.isArray(o?.pageRefs)?o.pageRefs:[]);
          if(new Set(owned).size!==owned.length)fail(p+'/paths/options','PATH_OVERLAP','A page can belong to one path only');
          if(owned.includes(b.paths.choicePageRef))fail(p+'/paths/choicePageRef','PATH_SCOPE','The choice page is shared by every path');
          const pageOf=id=>b.pages.find(g=>g.items.some(i=>i.id===id))?.id,pathOf=id=>b.paths.options.find(o=>Array.isArray(o?.pageRefs)&&o.pageRefs.includes(pageOf(id)))?.id??null;
          for(const o of b.paths.options)if(Array.isArray(o?.pageRefs)&&!b.completion.requiredRefs.some(ref=>o.pageRefs.includes(pageOf(ref))))fail(p+'/paths','PATH_EMPTY_COMPLETION','Every path needs its own required evidence');
          for(const i of allItems)for(const ref of i.repetition.retryItemRefs||[]){const other=pathOf(ref);if(other!==null&&other!==pathOf(i.id))fail(p+'/paths','PATH_RETRY_SCOPE','A retry variant must stay on its base item path');}
        }
      }
      if(b.completion.mode==='all-targets'&&[...targetIds].some(t=>!b.completion.requiredRefs.includes(t)))fail(p+'/completion/requiredRefs','INCOMPLETE_COMPLETION','Every targeted objective must be required');
      if(b.completion.mode==='all-targets')for(const t of targetIds){const evidenceItems=scored.filter(i=>i.targetRefs.includes(t));if(!evidenceItems.length)fail(p+'/completion','FORMATIVE_MASTERY','No scored evidence for required target');const modalities=new Set(evidenceItems.map(i=>i.evidence?.modality||(i.response.type==='speech'?'spoken':'written')));if(modalities.size>1)fail(p+'/completion','MODALITY_COLLAPSE','Separate modality evidence cannot share one completion target; require all items');}
      for(const [pi,g]of b.pages.entries())for(const [ii,i]of g.items.entries()){
        const q=p+`/pages/${pi}/items/${ii}`;const cap=catalog.capabilities.find(c=>c.id===i.capability);
        if(!cap?.variants.includes(g.variant)&&!['PV-closed-mixed','PV-closed-sequence','PV-reading-source-question','PV-reading-two-source'].includes(g.variant)&&!(g.variant==='PV-feedback-retry'&&value.schemaVersion===PATHS_CONTRACT_VERSION&&allItems.some(x=>x.repetition.retryItemRefs?.includes(i.id))))fail(q+'/capability','CAPABILITY_VARIANT','Capability incompatible with page variant');
        if(i.evaluation.mode==='formative'&&b.completion.requiredRefs.includes(i.id))fail(q+'/evaluation','FORMATIVE_MASTERY','Formative-only result cannot grant required mastery');
        if(i.response.type==='sequence')for(const ref of i.response.itemRefs){const refWeek=value.weeks.find(sw=>sw.blocks.some(sb=>sb.pages.some(sp=>sp.items.some(si=>si.id===ref))));if(i.capability==='CAP-review-mission'&&!i.response.sourceWeeks.includes(refWeek?.number))fail(q+'/response/itemRefs','MISSION_WEEK_SCOPE','Referenced item outside configured source weeks');}
        if(i.capability==='CAP-review-mission'){const actualWeeks=new Set(i.response.itemRefs.map(ref=>value.weeks.find(sw=>sw.blocks.some(sb=>sb.pages.some(sp=>sp.items.some(si=>si.id===ref))))?.number));if(i.response.sourceWeeks.some(n=>!actualWeeks.has(n)))fail(q+'/response/sourceWeeks','MISSION_WEEK_COVERAGE','Every configured source week must contribute an item');}
        for(const targetRef of i.targetRefs){const target=value.targets.find(t=>t.id===targetRef);if(target&&!target.taughtIn.some(ref=>value.weeks.some(sw=>sw.number<=w.number&&sw.blocks.some(sb=>sb.pages.some(sp=>sp.id===ref&&(sb.id!==b.id||sb.pages.indexOf(sp)<=pi))))))fail(q+'/targetRefs','TEACHING_ORDER','Required target cannot be taught only in a future week/page');}
      }
    }
    for(const [wi,w]of value.weeks.entries()){const positions=w.blocks.filter(b=>b.position).map(b=>`${b.position.row},${b.position.column}`);uniq(positions,'/weeks/'+wi+'/blocks/position');}
    for(const [mi,m]of value.media.entries()){
      const p='/media/'+mi;let decoded=m.uri;try{decoded=decodeURIComponent(m.uri);}catch{fail(p+'/uri','UNSAFE_URI','Malformed URI encoding');}
      if(m.access==='local') {if(/^[a-z][a-z0-9+.-]*:|^\/|\\|(?:^|\/)\.\.(?:\/|$)/i.test(decoded)||decoded.includes('?')||decoded.includes('#'))fail(p+'/uri','UNSAFE_URI','Local media requires safe relative asset path');}
      else {try{const u=new URL(decoded);if(u.protocol!=='https:'||u.username||u.password)fail(p+'/uri','UNSAFE_URI','External media requires HTTPS without credentials');}catch{fail(p+'/uri','UNSAFE_URI','Invalid external HTTPS URL');}}
      const source=value.sources.find(s=>s.id===m.sourceRef);
      if(source?.rights==='link-only'&&m.access!=='link')fail(p+'/access','MEDIA_RIGHTS','Link-only source cannot be embedded or local');
      if(source?.rights==='pending'&&m.gateStatus!=='pending')fail(p+'/gateStatus','MEDIA_GATE','Pending rights must remain an explicit pending gate');
      if(m.segments){uniq(m.segments.map(s=>s.id),p+'/segments');for(const [si,s]of m.segments.entries()){str(s.id,p+'/segments/'+si+'/id');num(s.start,p+'/segments/'+si+'/start');num(s.end,p+'/segments/'+si+'/end');if(s.start>=s.end||m.duration===undefined||s.end>m.duration)fail(p+'/segments/'+si,'MEDIA_TIME_RANGE','Segment must fit known media duration');}}
      if(m.backupRef){references([m.backupRef],p+'/backupRef',['media']);if(m.backupRef===m.id)fail(p+'/backupRef','MEDIA_BACKUP_SELF','Backup cannot reference itself');}
      if(m.auditStatus!==undefined)en(m.auditStatus,p+'/auditStatus',['pending','approved']);
      if(m.auditStatus==='pending'&&m.gateStatus==='approved')fail(p+'/gateStatus','AUDIT_GATE','Pending audit cannot assert an approved gate');
    }
    for(const [ti,t]of value.targets.entries())if(!t.taughtIn.length)fail('/targets/'+ti+'/taughtIn','TEACHING_REQUIRED','Target needs an explicit teaching reference');
    const items=value.weeks.flatMap(w=>w.blocks.flatMap(b=>b.pages.flatMap(p=>p.items)));
    for(const i of items)for(const retryRef of i.repetition.retryItemRefs||[]){const retry=items.find(x=>x.id===retryRef);if(retry&&(retry.id===i.id||retry.capability!==i.capability||retry.response.type!==i.response.type||retry.targetRefs.length!==i.targetRefs.length||i.targetRefs.some(t=>!retry.targetRefs.includes(t))))fail(ids.get(i.id)?.path||'/weeks','RETRY_BINDING','Retry must be a distinct same-capability/modal target equivalent item');}
    if(Array.isArray(value.weeks))uniq(value.weeks.map(w=>w?.number),'/weeks');
    for(const r of refs){const target=ids.get(r.value);if(!target)fail(r.path,'UNKNOWN_REFERENCE','Unknown reference '+r.value);else if(!r.kinds.includes(target.kind))fail(r.path,'REFERENCE_KIND','Reference has wrong entity kind');}
    const done=new Set(),active=new Set();function visit(node){if(active.has(node)){fail(ids.get(node)?.path||'/weeks','PREREQUISITE_CYCLE','Prerequisite cycle');return;}if(done.has(node))return;active.add(node);for(const n of edges.get(node)||[])visit(n);active.delete(node);done.add(node);}for(const node of edges.keys())visit(node);
    return {valid:errors.length===0,errors};
    } catch (error) {
      fail('/','INVALID_STRUCTURE','Malformed nested data: '+error.message);
      return {valid:false,errors};
    }
  };
}
