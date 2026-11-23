// P5 fordító: blokkforrások (block.<ID>.json) → v2 heti csomag (course-contract 2.0.0).
// A v2 szerződésben nincs feedback- és utasításmező: az utasítás az oldal első
// tartalmi eleme lesz, a feedback és a régi azonosítók a kísérő presentation.json-ba
// kerülnek. Amit a fordító nem tud leképezni, az NEEDS_CAPABILITY (nem talál ki semmit).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { canonicalHash } from './normalize.mjs';
import { compileCourseContract, MASTERY_CONTRACT_VERSION, PATHS_CONTRACT_VERSION, PRICES_CONTRACT_VERSION, SUBMISSION_CONTRACT_VERSION } from '../vendor/course-contract/course-contract.js';

const COURSE_ID = 'plusdeca';
const ROOT = `course:${COURSE_ID}`;
const NORMALIZATION = { unicode: 'NFC', caseSensitive: false, accentsSensitive: true, apostropheEquivalent: true, trim: true, collapseWhitespace: true, hyphensSensitive: true };
// A blokk kérheti a francia szám- és árírás normalizálását (szerződés 2.0.2); csak a bekapcsolt jelző kerül át.
const normalizationOf = response => ({ ...NORMALIZATION, ...Object.fromEntries(Object.entries(response.normalization ?? {}).filter(([, on]) => on)) });
const FR_FLAGS = ['numbersFr', 'pricesFr'];
// Mondatszámmal megadott rövid írásos válasz → szóhatár (a v2 writing wordRange-et kér).
const WORDS_PER_SENTENCE = 30;
// Ha a kézirat nem ad időtartamot egy szóbeli válaszhoz, ez a technikai keret (a tanuló nem látja).
const DEFAULT_SPEECH_RANGE = { min: 1, max: 180 };

const pad = number => String(number).padStart(2, '0');
// Betűtudatos szóhatár (Áron, 11-16): a JS \b az „é”-t nem betűnek veszi, így a „cannelés” végén „és” szót látott.
export const looksHungarian = text => /[őűŐŰ]|(?<!\p{L})(?:és|az|egy|nem|hogy|vagy)(?!\p{L})/u.test(text);

export class CompileError extends Error {}

function localSlug(id, prefix) {
  if (!id.startsWith(`${prefix}-`)) throw new CompileError(`Az azonosító nem a(z) ${prefix} alá tartozik: ${id}`);
  return id.slice(prefix.length + 1);
}

function mapStimulus(stimulus, needs, where, mediaIds = {}) {
  const out = [];
  const title = text => out.push({ type: 'text', text, language: stimulus.language || (looksHungarian(text) ? 'hu' : 'fr') });
  switch (stimulus.type) {
    case 'text': if (stimulus.title) title(stimulus.title); out.push({ type: 'text', text: stimulus.text, language: stimulus.language }); break;
    case 'model': out.push({ type: 'text', text: stimulus.text, language: stimulus.language }); break;
    case 'list': if (stimulus.title) title(stimulus.title); out.push({ type: 'list', entries: stimulus.entries }); break;
    case 'table': if (stimulus.title) title(stimulus.title); out.push({ type: 'table', columns: stimulus.columns, rows: stimulus.rows }); break;
    case 'gloss':
      // v2 gloss + a kártyához tartozó példamondat (szöveg) és kiejtés (média) közvetlenül utána.
      out.push({ type: 'gloss', surface: stimulus.surface, lemma: stimulus.lemma, meaning: stimulus.meaning, language: stimulus.language });
      if (stimulus.example) out.push({ type: 'text', text: stimulus.example, language: 'fr' });
      if (stimulus.exampleTranslation) out.push({ type: 'text', text: stimulus.exampleTranslation, language: 'hu' });
      if (stimulus.mediaRef) {
        if (mediaIds[stimulus.mediaRef]) out.push({ type: 'media', mediaRef: mediaIds[stimulus.mediaRef] });
        else needs.push({ code: 'NEEDS_CAPABILITY', where, message: `Nem deklarált média: ${stimulus.mediaRef}.` });
      }
      break;
    case 'media':
      if (mediaIds[stimulus.mediaRef]) out.push({ type: 'media', mediaRef: mediaIds[stimulus.mediaRef] });
      else needs.push({ code: 'NEEDS_CAPABILITY', where, message: `Nem deklarált média: ${stimulus.mediaRef}.` });
      break;
    default: needs.push({ code: 'NEEDS_CAPABILITY', where, message: `A(z) ${stimulus.type} tartalomtípust a fordító még nem képezi le.` });
  }
  return out;
}

function mapResponse(item, needs, where, mediaIds = {}) {
  const response = item.response;
  switch (response.type) {
    case 'abx': {
      const tokens = response.tokens.map(token => ({ role: token.role, mediaRef: mediaIds[token.mediaRef], speaker: token.speaker, category: token.category }));
      if (tokens.some(token => !token.mediaRef)) { needs.push({ code: 'NEEDS_CAPABILITY', where, message: 'Az ABX-token nem deklarált médiára mutat.' }); return null; }
      return { type: 'abx', tokens, window: response.window ?? { size: 1, required: 1 } };
    }
    case 'single': return { type: 'single', options: response.options };
    case 'multiple': return { type: 'multiple', options: response.options, selection: response.selection };
    case 'order': return { type: 'order', tokens: response.tokens };
    case 'pairs': return { type: 'pairs', left: response.left, right: response.right };
    case 'correction': return { type: 'correction', text: response.text, spans: response.spans };
    case 'writing': return { type: 'writing', wordRange: response.wordRange };
    case 'speech': return { type: 'speech', durationRange: response.durationRange ?? DEFAULT_SPEECH_RANGE, ...(response.transcriptAllowed !== undefined ? { transcriptAllowed: response.transcriptAllowed } : {}) };
    case 'fields': return { type: 'fields', fields: response.fields.map(field => ({ id: field.id, label: field.label, required: true, normalization: normalizationOf(response) })), ...(response.bank ? { bank: response.bank } : {}) };
    case 'text':
      if (item.capability === 'CAP-writing') {
        // A v2-ben írásos képességhez csak writing válasz tartozhat.
        const sentences = response.sentences?.max ?? 2;
        return { type: 'writing', wordRange: { min: 1, max: sentences * WORDS_PER_SENTENCE } };
      }
      return { type: 'text', normalization: normalizationOf(response) };
    default:
      needs.push({ code: 'NEEDS_CAPABILITY', where, message: `Ismeretlen válaszforma: ${response.type}.` });
      return null;
  }
}

/** Nem pontozott item (formative / formative-required / not-scored). */
const isFormative = item => item.evaluation.mode === 'formative' || item.evaluation.scoring === 'formative-required' || item.evaluation.scoring === 'not-scored';

// Több mezős kulcs további elfogadott válaszai (11-16; Áron engedélyével, app-igény
// docs/app/MEZONKENTI_ALTERNATIVAK_2026-11-16.md). Az U21 A-döntés: „de petits pains” is jó. A kéziratban az
// `alternatives` szöveglista; mezőhöz így köthető: `f2: érték` vagy `f2=érték` (mezőazonosító), `érték (2)` (a mező
// sorszáma), `a | b` (minden mező sorrendben: egy teljes válasz), egymezős itemnél bármely szöveg. A mezőnkénti
// alternatívák szorzata kerül az answers-be (az app egy teljes válaszobjektummal egyezést vár). A mezőhöz nem
// köthető szöveg (pl. a teljes kifejezés ismétlése) kimarad, figyelmeztetéssel.
const ANSWER_LIMIT = 256;
export function slotAlternatives(key, alternatives = [], slots = Object.keys(key), { warnings, where } = {}) {
  const per = Object.fromEntries(slots.map(id => [id, [key[id]]]));
  const tuples = [], unmapped = [];
  const add = (id, value) => { const v = value.trim(); if (v && !per[id].includes(v)) per[id].push(v); };
  for (const alt of alternatives) {
    const text = String(alt).trim();
    const named = text.match(/^([\w-]+)\s*[:=]\s*(.+)$/u);
    const numbered = text.match(/^(.+?)\s*\((\d+)\)$/u);
    const parts = text.split('|').map(part => part.trim());
    if (named && slots.includes(named[1])) add(named[1], named[2]);
    else if (numbered && slots[Number(numbered[2]) - 1]) add(slots[Number(numbered[2]) - 1], numbered[1]);
    else if (parts.length === slots.length && parts.length > 1 && parts.every(Boolean)) tuples.push(Object.fromEntries(slots.map((id, i) => [id, parts[i]])));
    else if (slots.length === 1) add(slots[0], text);
    else unmapped.push(text);
  }
  if (unmapped.length) warnings?.push({ code: 'FIELD_ALTERNATIVE_UNMAPPED', where, message: `Mezőhöz nem köthető alternatíva, kimarad (jelölés: „f2: érték”, „érték (2)” vagy „a | b”): ${unmapped.join('; ')}.` });
  let answers = [{}];
  for (const id of slots) answers = answers.flatMap(partial => per[id].map(value => ({ ...partial, [id]: value })));
  if (answers.length > ANSWER_LIMIT) {
    warnings?.push({ code: 'FIELD_ALTERNATIVE_LIMIT', where, message: `Túl sok mezőnkénti kombináció (${answers.length}); az első ${ANSWER_LIMIT} marad.` });
    answers = answers.slice(0, ANSWER_LIMIT);
  }
  const same = (a, b) => slots.every(id => a[id] === b[id]);
  for (const tuple of tuples) if (!answers.some(answer => same(answer, tuple))) answers.push(tuple);
  return answers.map(answer => ({ ...key, ...answer }));
}

function mapSolution(item, response, needs, where, warnings) {
  const solution = item.solution;
  // Nem pontozott többválasztós: kulcs nélküli, csak beküldéses megoldás (Áron, 10-29; szerződés 2.0.1). A blokk
  // kulcsa itt az elfogadható opciók köre, nem helyes válasz; kész a beküldés a selection min/max-on belül.
  if (response?.type === 'multiple' && isFormative(item)) return { type: 'submission' };
  // Önellenőrző tábla (U44, 11-14): formatív fields + rubric. Helyes válasza nincs, ezért kulcs nélküli beküldés;
  // a rubrika szempontjai a megjelenítési rétegben (rubricCriteria), beküldés után látszanak.
  if (response?.type === 'fields' && isFormative(item) && solution.type === 'rubric') return { type: 'submission' };
  // Kulcs nélküli, nem pontozott szöveges válasz (U54 t02, 11-14): a kéziratban submission_unscored, szempont nélkül
  // (solution: none). Rubrikát nem képzünk (kitalált tartalom lenne), hanem kulcs nélküli beküldést.
  if (['text', 'writing'].includes(response?.type) && isFormative(item) && solution.type === 'none') return { type: 'submission' };
  switch (solution.type) {
    case 'exact': {
      if (typeof solution.key === 'string') return { type: 'exact', answers: [solution.key, ...solution.alternatives] };
      // Szóbankos hiányos szöveg: a v2 a bank-elem azonosítóját várja a kulcsban, a kézirat a címkét adja.
      if (response?.type === 'fields' && response.bank?.length) {
        const byLabel = new Map(response.bank.map(option => [option.label.normalize('NFC').replace(/[‘’]/gu, "'").trim(), option.id]));
        const key = {};
        for (const [field, value] of Object.entries(solution.key)) {
          const id = response.bank.some(option => option.id === value) ? value : byLabel.get(String(value).normalize('NFC').replace(/[‘’]/gu, "'").trim());
          if (!id) { needs.push({ code: 'NEEDS_CAPABILITY', where, message: `A szóbankos kulcs nem található a bankban: ${value}.` }); return null; }
          key[field] = id;
        }
        return { type: 'exact', answers: [key] };
      }
      if (solution.alternatives?.length && solution.key && typeof solution.key === 'object') {
        const slots = response?.type === 'fields' ? response.fields.map(f => f.id)
          : response?.type === 'correction' ? response.spans.map(s => s.id) : Object.keys(solution.key);
        return { type: 'exact', answers: slotAlternatives(solution.key, solution.alternatives, slots.filter(id => id in solution.key), { warnings, where }) };
      }
      return { type: 'exact', answers: [solution.key] };
    }
    case 'choice':
      // Sorrendezősnél a további elfogadott sorrendek a kulcs után (a v2 order-nél több answers is érvényes).
      if (response?.type === 'order') return { type: 'exact', answers: [solution.keyOptionIds, ...(solution.alternativeOrders ?? [])] };
      return { type: 'exact', answers: response?.type === 'multiple' ? [solution.keyOptionIds] : [solution.keyOptionIds[0]] };
    case 'pairs':
      return { type: 'exact', answers: [Object.fromEntries(solution.keyPairs.map(pair => [pair.left, pair.right]))] };
    case 'abx':
      return { type: 'exact', answers: [solution.key] };
    case 'samples':
      return { type: 'reference', text: solution.samples[0], accepted: [...solution.samples.slice(1), ...(solution.alternatives || [])] };
    case 'rubric':
      return { type: 'rubric', criteria: solution.criteria.map((criterion, index) => ({ id: `c${index + 1}`, description: criterion.label, required: true })) };
    default:
      needs.push({ code: 'NEEDS_CAPABILITY', where, message: `A(z) ${solution.type} kulcstípus nem képezhető le a v2-re.` });
      return null;
  }
}

function mapEvaluation(item, response, solution, { sourceId, blockId }) {
  const base = { uncertainty: 'pending', selfCheckCanPass: false };
  const semanticScope = { authorityRefs: [sourceId], scopeBlockRef: blockId };
  const formative = isFormative(item);
  const openResponse = ['writing', 'speech'].includes(response.type) && solution.type !== 'reference';
  if (formative) return { mode: 'formative', policyId: 'formative-only', ...base, ...(openResponse ? { revisionBinding: 'current-full-response' } : {}) };
  if (item.evaluation.mode === 'exact') return { mode: 'exact', policyId: 'closed-exact', ...base };
  if (item.evaluation.mode === 'reference') return { mode: 'reference', policyId: 'reference-transcript', ...base };
  if (response.type === 'writing') return { mode: 'dual-gate', policyId: 'writing-dual-gate', ...base, ...semanticScope, minimumScore: 3, revisionBinding: 'current-full-response' };
  const open = response.type === 'speech' && solution.type !== 'reference';
  return { mode: item.evaluation.mode === 'human' ? 'human' : 'semantic', policyId: 'semantic-rubric', ...base, ...semanticScope, ...(open ? { revisionBinding: 'current-full-response' } : {}) };
}

function mapItem(item, ctx) {
  const where = `${ctx.blockSourceId} › ${item.id}`;
  const id = `${ctx.pageId}:${localSlug(item.id, ctx.blockSourceId).replace(/^p\d{2}-(?=new)/u, match => match)}`;
  const response = mapResponse(item, ctx.needs, where, ctx.mediaIds);
  const solution = mapSolution(item, response, ctx.needs, where, ctx.warnings);
  if (!response || !solution) return null;
  const evaluation = mapEvaluation(item, response, solution, ctx);
  const open = ['writing', 'speech'].includes(response.type) && solution.type !== 'reference';
  const exact = evaluation.mode === 'exact';
  ctx.idMap[item.id] = id;
  ctx.presentation.items[id] = {
    sourceId: item.id,
    // Koppintásos jelentés (S23; a v2-ben nincs helye): a feladat francia szövegének glosszái.
    ...(item.glosses?.length ? { glosses: item.glosses } : {}),
    ...(item.instruction ? { instruction: item.instruction } : {}),
    ...(item.response.type === 'text' && response.type === 'writing' ? { wordRangeDerived: true } : {}),
    ...(item.response.type === 'speech' && !item.response.durationRange ? { durationRangeDerived: true } : {}),
    // A felvétel felső határa, ha hosszabb a beszédidőnél (a v2-ben nincs helye; a durationRange a tipp marad).
    ...(item.response.type === 'speech' && item.response.recordingMaxSeconds !== undefined ? { recordingMaxSeconds: item.response.recordingMaxSeconds } : {}),
    // Hangüzenet vagy írott üzenet (egyenértékű): a jegyzetmező teljes írott válasz (a v2-ben nincs helye).
    ...(item.response.type === 'speech' && item.response.writtenAlternative ? { writtenAlternative: true } : {}),
    ...(item.feedback ? { feedback: item.feedback } : {}),
    ...(item.solution.type === 'rubric' ? { rubricPoints: item.solution.criteria.map(criterion => criterion.points ?? null) } : {}),
    // Kulcs nélküli önellenőrző tábla (fields + rubric → submission): a szempontok beküldés után.
    ...(item.solution.type === 'rubric' && solution.type === 'submission' ? { rubricCriteria: item.solution.criteria.map(c => c.requirements?.length ? `${c.label}: ${c.requirements.join(' ')}` : c.label) } : {}),
    // A rubrikás megoldás mintái (a v2 rubric csak type + criteria): beadás után a kritériumok mellett.
    ...(item.solution.type === 'rubric' && item.solution.samples ? { rubricSamples: item.solution.samples } : {}),
    // A v2-ben nincs helye: a nehezebb javítási szint (a tanuló keresi meg a hibát) a megjelenítéshez.
    ...(item.response.type === 'correction' && item.response.mode === 'find' ? { correctionMode: 'find' } : {}),
    ...(item.solution.rejected ? { rejected: item.solution.rejected } : {}),
    // Visszautalás egy korábbi itemre (a v2-ben nincs helye): az app megmutatja a tanuló ottani válaszát.
    ...(item.recallFrom ? { recallFrom: ctx.idMap[item.recallFrom] ?? null } : {})
  };
  return {
    id,
    capability: item.capability,
    prompt: item.instruction ? `${item.instruction}\n\n${item.prompt}` : item.prompt,
    response,
    solution,
    evaluation,
    repair: open ? { mode: 'targeted-then-full', hideFeedback: true } : exact ? { mode: 'delayed-retry', hideFeedback: false } : { mode: 'none', hideFeedback: false },
    // ABX (v2 ABX_RECOVERY): az első ablak megváltoztathatatlan, hibánál új teljes ablak — nem pontozott (gyakorló) ABX-nél is (U44, 11-14).
    repetition: { ...(exact ? { mode: 'delayed', minIntervening: 3, independentSuccess: true } : { mode: 'none', minIntervening: 0, independentSuccess: true }),
      ...(response.type === 'abx' ? { immutableFirstAttempt: true, recovery: 'new-full-window' } : {}) },
    sourceRefs: [ctx.sourceId],
    targetRefs: [],
    mediaRefs: (item.mediaRefs ?? []).map(ref => ctx.mediaIds[ref] ?? (ctx.needs.push({ code: 'NEEDS_CAPABILITY', where, message: `Nem deklarált média: ${ref}.` }), ref)),
    ...(item.evidence ? { evidence: item.evidence } : {})
  };
}

// A blokk médiája → v2 media-bejegyzések. Helyi fájl: tartalom-hash a nevében (media/<sha16>.<kit>),
// a week-build a kiadási mappába másolja (ctx.mediaFiles). Külső cím: csak hálózattal, offline nem.
function compileMedia(block, sourceId, ctx) {
  const ids = {};
  for (const m of block.media ?? []) {
    const id = `${ROOT}:media-${block.id}-${m.id}`, where = `${block.id} › media › ${m.id}`;
    let uri;
    if (m.access === 'local') {
      const path = m.file && ctx.mediaDir ? resolve(ctx.mediaDir, m.file) : null;
      if (!path || !existsSync(path)) { ctx.needs.push({ code: 'MEDIA_FILE_MISSING', where, message: `A helyi médiafájl nem található: ${m.file ?? '(nincs megadva)'}.` }); continue; }
      const sha = createHash('sha256').update(readFileSync(path)).digest('hex');
      uri = `media/${sha.slice(0, 16)}${extname(m.file).toLowerCase()}`;
      ctx.mediaFiles.push({ uri, path });
    } else if (m.uri) uri = m.uri;
    else { ctx.needs.push({ code: 'NEEDS_CAPABILITY', where, message: 'Külső médiához HTTPS-cím kell.' }); continue; }
    ids[m.id] = id;
    ctx.media.push({ id, kind: m.kind, uri, sourceRef: sourceId, access: m.access, offline: m.access === 'local', alternative: m.alternative,
      ...(m.duration ? { duration: m.duration } : {}), ...(m.transcript ? { transcript: m.transcript, transcriptPolicy: 'after-attempt' } : {}) });
    ctx.presentation.media[id] = { sourceId: m.id, ...(m.title ? { title: m.title } : {}) };
  }
  return ids;
}

function compileBlock(block, weekId, ctx) {
  const blockSlug = block.id.replace(/^w\d{2}-/u, '');
  const blockId = `${weekId}:${blockSlug}`;
  const sourceId = `${ROOT}:src-${block.id}`;
  ctx.sources.push({ id: sourceId, title: `Review-zott kézirat: ${block.id}`, locator: `editorial/week-${pad(block.week)}/handoffs/${block.review.reviewPass}`, rights: 'original' });
  ctx.idMap[block.id] = blockId;
  const mediaIds = compileMedia(block, sourceId, ctx);
  const local = { ...ctx, blockId, sourceId, blockSourceId: block.id, mediaIds };
  const pageIdOf = sourcePageId => `${blockId}:${localSlug(sourcePageId, block.id)}`;
  const chainMode = ['mastery', 'resolved'].includes(block.completion.mode);
  // retry.page: a változatok a megadott (későbbi) oldalra kerülnek, az alapitemek sorrendjében.
  const deferred = new Map();
  const pages = block.pages.map(page => {
    const pageId = `${blockId}:${localSlug(page.id, block.id)}`;
    ctx.idMap[page.id] = pageId;
    const content = [];
    if (page.instruction) content.push({ type: 'text', text: page.instruction, language: looksHungarian(page.instruction) ? 'hu' : 'fr' });
    // Lépésenkénti felfedés (a v2-ben nincs helye): lépésenként a v2-tartalom indexei (a cím is a lépéshez tartozik).
    const reveal = [];
    // Koppintásos jelentés (S23; a v2-ben nincs helye): a v2-tartalom indexei → glosszák.
    const glosses = [];
    for (const [index, stimulus] of page.content.entries()) {
      const start = content.length;
      content.push(...mapStimulus(stimulus, ctx.needs, `${page.id} › content#${index}`, mediaIds));
      if (stimulus.reveal === 'tap' && content.length > start) reveal.push(Array.from({ length: content.length - start }, (_, k) => start + k));
      if (stimulus.glosses?.length && content.length > start) glosses.push({ content: Array.from({ length: content.length - start }, (_, k) => start + k), glosses: stimulus.glosses });
    }
    // Újrapróba-változatok (retry): az alapitem után ugyanazon az oldalon, a v2 repetition.retryItemRefs köti őket
    // az alapitemhez. Az app csak hibás első próba után, afterItems item múlva mutatja őket.
    // Támogatott zárás (closure: supported): a lánc végén a megoldás, majd a tanuló még egyszer válaszol (v2 supportedClosure).
    const items = page.items.flatMap(item => {
      const mapped = mapItem(item, { ...local, pageId });
      if (!mapped || !item.retry) return mapped ? [mapped] : [];
      const after = item.retry.afterItems ?? 3;
      const target = item.retry.page && item.retry.page !== page.id ? item.retry.page : null;
      const variants = item.retry.items.map(variant => mapItem(variant, { ...local, pageId: target ? pageIdOf(target) : pageId })).filter(Boolean);
      mapped.repetition = { mode: 'delayed', minIntervening: after, independentSuccess: true,
        ...(variants.length ? { retryItemRefs: variants.map(v => v.id) } : {}),
        ...(block.completion.mode === 'mastery' ? { immutableFirstAttempt: true } : {}),
        ...(item.retry.closure === 'supported' ? { supportedClosure: true } : {}) };
      for (const v of variants) {
        v.repetition = { mode: 'delayed', minIntervening: after, independentSuccess: true };
        ctx.presentation.items[v.id].retryOf = mapped.id;
      }
      if (target) { deferred.set(target, [...(deferred.get(target) ?? []), ...variants]); return [mapped]; }
      return [mapped, ...variants];
    });
    items.push(...(deferred.get(page.id) ?? []));
    ctx.presentation.pages[pageId] = { sourceId: page.id, ...(page.visibleAfter ? { visibleAfterSourceId: page.visibleAfter } : {}), ...(reveal.length ? { reveal } : {}), ...(glosses.length ? { glosses } : {}) };
    return { id: pageId, template: page.template, variant: page.variant, title: page.title, content, items };
  });
  const allItems = pages.flatMap(page => page.items);
  const variantIds = new Set(allItems.flatMap(item => item.repetition.retryItemRefs ?? []));
  // Mesterszintnél és resolved-nál a változat pontozott, de nem kötelező: a teljesítést az alapitem (vagy a lánca) adja.
  const scored = new Set(allItems.filter(item => item.evaluation.mode !== 'formative' && !(chainMode && variantIds.has(item.id))).map(item => item.id));
  const required = block.completion.requiredRefs.map(ref => ctx.idMap[ref]).filter(id => scored.has(id));
  for (const id of scored) if (!required.includes(id)) required.push(id);
  const dropped = block.completion.requiredRefs.filter(ref => !scored.has(ctx.idMap[ref]));
  if (dropped.length) ctx.warnings.push({ code: 'FORMATIVE_NOT_REQUIRED', where: block.id, message: `Formatív itemek nem lehetnek kötelező teljesítési bizonyítékok a v2-ben: ${dropped.join(', ')}.` });
  return {
    id: blockId,
    kind: block.kind,
    // A v2-ben tesztblokkhoz kötelező; ha a blokk nem adja meg, az azonosítóból (w01-test-<fajta>).
    ...(block.kind === 'assessment' ? { assessmentKind: block.assessmentKind ?? (/-test-(grammar|reading|vocabulary)/u.exec(block.id)?.[1]) } : {}),
    title: block.title,
    prerequisites: block.prerequisites,
    pages,
    completion: required.length ? { mode: chainMode ? block.completion.mode : 'all-items', requiredRefs: required } : { mode: 'acknowledge', requiredRefs: [] },
    // Választható út (v2 2.0.4).
    ...(block.paths ? { paths: { choicePageRef: ctx.idMap[block.paths.choicePage], options: block.paths.options.map(option => ({ id: option.id, label: option.label, pageRefs: option.pages.map(ref => ctx.idMap[ref]), ...(option.recommended !== undefined ? { recommended: option.recommended } : {}) })) } } : {}),
    ...(block.position ? { position: block.position } : {}),
    ...(block.estimatedMinutes ? { estimatedMinutes: block.estimatedMinutes } : {})
  };
}

// plan: { week, title }, blocks: P5 blokkforrások.
// planDir: a heti terv mappája; a helyi média a <planDir>/<plan.media ?? 'media'> alatt van.
export function compileWeek(plan, blocks, { planDir } = {}) {
  const weekId = `${ROOT}:w${pad(plan.week)}`;
  const mediaDir = planDir ? resolve(planDir, plan.media ?? 'media') : null;
  const ctx = { sources: [], idMap: {}, presentation: { items: {}, pages: {}, media: {} }, needs: [], warnings: [], media: [], mediaFiles: [], mediaDir };
  const compiledBlocks = blocks.map(block => compileBlock(block, weekId, ctx));
  // Előfeltétel csak csomagon belüli blokkra mutathat; a hiányzó előfeltétel figyelmeztetés.
  const present = new Set(blocks.map(block => block.id));
  for (const [index, block] of blocks.entries()) {
    const kept = block.prerequisites.filter(ref => present.has(ref));
    const missing = block.prerequisites.filter(ref => !present.has(ref));
    if (missing.length) ctx.warnings.push({ code: 'PREREQUISITE_OUTSIDE_PACKAGE', where: block.id, message: `Az előfeltétel nincs a csomagban, kimarad: ${missing.join(', ')}.` });
    compiledBlocks[index].prerequisites = kept.map(ref => ctx.idMap[ref]);
  }
  const pkg = {
    schemaVersion: '2.0.0',
    catalogVersion: '1.0.0',
    contentVersion: '',
    namespace: 'course',
    label: 'Plusdeça',
    courseId: COURSE_ID,
    weeks: [{ id: weekId, number: plan.week, title: plan.title, blocks: compiledBlocks }],
    sources: ctx.sources,
    media: ctx.media,
    targets: []
  };
  // A submission-megoldás csak a 2.0.1-es csomagban érvényes; ahol nincs ilyen, a csomag marad 2.0.0 (változatlan bájtok).
  // A numbersFr / pricesFr jelző csak a 2.0.2-es csomagban érvényes (az a submissiont is tartalmazza).
  const items = compiledBlocks.flatMap(block => block.pages.flatMap(page => page.items));
  const rulesOf = item => [item.response?.normalization, ...(item.response?.fields ?? []).map(field => field.normalization)];
  if (items.some(item => item.solution?.type === 'submission')) pkg.schemaVersion = SUBMISSION_CONTRACT_VERSION;
  if (items.some(item => rulesOf(item).some(rules => FR_FLAGS.some(flag => rules?.[flag])))) pkg.schemaVersion = PRICES_CONTRACT_VERSION;
  // A mesterszintű teljesítés csak a 2.0.3-ban érvényes (az a 2.0.1-et és a 2.0.2-t is tartalmazza).
  if (pkg.weeks.some(week => week.blocks.some(block => block.completion.mode === 'mastery'))) pkg.schemaVersion = MASTERY_CONTRACT_VERSION;
  // Választható út és támogatott zárás csak a 2.0.4-ben (az a 2.0.1–2.0.3-at is tartalmazza).
  if (pkg.weeks.some(week => week.blocks.some(block => block.paths || block.completion.mode === 'resolved'))) pkg.schemaVersion = PATHS_CONTRACT_VERSION;
  pkg.contentVersion = `w${pad(plan.week)}-${canonicalHash({ ...pkg, contentVersion: undefined }).slice(0, 16)}`;
  const contract = compileCourseContract()(pkg);
  const status = ctx.needs.length ? 'NEEDS_CAPABILITY' : contract.valid ? 'COMPILED' : 'CONTRACT_FAIL';
  return {
    status,
    package: pkg,
    // roster: a hét összes egysége (a még nem kiadottak is) a webapp áttekintő nézetéhez; blockRef = v2-ID.
    presentation: { contentVersion: pkg.contentVersion, ...ctx.presentation, idMap: ctx.idMap,
      // hold (Áron, 11-15): a T27-javításra váró egység (plan.t27Pending) a csomagban marad, de az app „még nem elérhető”-ként mutatja.
      ...(plan.roster ? { roster: plan.roster.map(entry => ({ ...entry, blockRef: `${weekId}:${entry.id.replace(/^w\d{2}-/u, '')}`, ...((plan.t27Pending ?? []).includes(entry.id) ? { hold: true } : {}) })) } : {}) },
    needs: ctx.needs,
    warnings: ctx.warnings,
    mediaFiles: ctx.mediaFiles,
    contract
  };
}
