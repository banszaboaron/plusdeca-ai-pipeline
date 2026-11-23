// „Javítás” mód (2026-10-28): egy meglévő, tanári bírálatot kapott egység javítása a CEO-láncon.
//
//  1. Terv      az oszlop rendezője javítási tervet ír (mi marad, mi változik, miért); review: NavE + UE
//  2. Kézirat   az oszlop szerzője megírja az új kéziratot + VÁLTOZÁSNAPLÓ; review: PE ×2 + NavE
//               (itt hat a PE-szabály: legfeljebb 4 kör, a 2. kör után újraírás új helyzetből)
//  3. Megoldás  megoldásíró (+ BLOKK_JSON, tanulói nézet); review: PE ×2 + NavE + NyE + HE + UE + független megoldó
//  4. Egyesítés review-pass.md + P5-kapu (lib/p5.mjs) a blokkra; kimenet: editorial/week-01/javitas-2026-10/<ID>/
//
// A meglévő kéziratokat nem írja felül; minden új fájl az egység kimeneti mappájába kerül, és csak COMPLETED-nél.

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { paths } from './paths.mjs';
import { AUTHOR_FOOTER, attachment } from './packets.mjs';
import { blockJsonRule, blockLearnerTexts, droppedLearnerTexts, p5Gate, stripBlockJson } from './p5.mjs';
import { PATCH_RULE, formatBlock, mergePatchedSolution, needsPatchMode } from './csak-valtozas.mjs';
import { COLUMNS, WEEK_LEARNER_VIEW_RULE, agent, extractSection, providerFor, reviewRecord, reviewedStep, reviewer } from './week.mjs';

const read = p => readFile(p, 'utf8');
const repoPath = p => (isAbsolute(p) ? p : join(paths.repo, p));
const assignment = name => read(join(paths.assignments, 'javitas', name));

export const DEFAULT_BRIEF = 'editorial/week-01/javitas-2026-10/BRIEF.md';
export const OUT_ROOT = 'editorial/week-01/javitas-2026-10';
export const REFERENCES = ['MERCE-SZINT.md', 'MERCE-FELADATTIPUSOK.md', 'PELDAK-PILOT.md'];

// T27 nyelvi kör (PRESIDENT, 2026-11-15; CEO-parancs S13–S21): a már review-zott, élesben futó változatból indul
// (OUT_ROOT/<egység>/<P5-ID>.kezirat.md + .megoldas.md), a brief a T27-BRIEF.md, a „tanári kifogások” a T27-szabály, a
// P5-kapu CL-27 mostani jelzései erre az egységre és az egységre szóló S-tételek. A kimenet új almappába kerül
// (OUT_ROOT/<egység>/t27/), a régi kéziratokat nem írja felül; átvétel: tools/p5-atvetel.mjs <egység> --t27 --frissit.
export const T27_BRIEF = 'editorial/week-01/javitas-2026-10/T27-BRIEF.md';
export const T27_SUBDIR = 't27';
const T27_EXTRA = {
  U11: 'S8 (a független megoldó jelzése, Áron elfogadta, ebben a körben átvezetendő): a p11 utasítása „thé, pain” helyett „thé, (petit) pain” legyen; a p28-s002 vegyes formájánál az utasítás mondja ki egyértelműen a teljesítés feltételét.',
  U24: 'S21 (T30): a p07 beszélő-címkéje „P” helyett „La vendeuse”; az utasítás „mindegyiket a saját mezőjébe” csak akkor maradhat, ha replikánként külön mező van (`fields`); ha egy mező van, az utasítás ehhez igazodjon.',
  U41: 'Megszólítás (Áron, 11-15: „vagy tegezzünk vagy magázzunk, de ne keverjük”): a héten végig magázunk; a tanuló replikái előtt a „Toi :” helyett „Vous :” áll, a tanulóhoz szóló szövegben sehol nincs tegezés.',
  U42: 'S20 (T29): a p04 „Próba” listája nyolc egyforma „(A pultos válaszol.)” sor, a tanuló fordulói kimaradtak. Legyen a p02 8 lépésének francia vázlata (a tanulónál kulcsszavak, a pultosnál jelzés), vagy vond össze a p03 tervezővel. Az ID-k maradnak.',
  U44: 'S19 (T09): az 1–3. oldal túl könnyű (A2 alatti); a 4. oldal szintje jó, ahhoz igazodjon (valódi u/ou megkülönböztetési nehézség). Hang nem készülhet újra; ha a nehezebb tételhez új felvétel kellene, a tervben döntési pontként jelezd.',
};

export async function t27Unit(id, unit) {
  const pid = unit.p5Id;
  const dir = `${OUT_ROOT}/${id}`;
  const kezirat = `${dir}/${pid}.kezirat.md`;
  const megoldas = `${dir}/${pid}.megoldas.md`;
  const blockFile = join(paths.repo, 'p5', 'blocks', 'w01', `block.${pid}.json`);
  return {
    ...unit,
    manuscript: async () => `# A review-zott, élesben futó kézirat (${kezirat})\n\n${await read(repoPath(kezirat))}\n\n# A review-zott, élesben futó megoldás (${megoldas})\n\n${await read(repoPath(megoldas))}\n`,
    manuscriptSource: `${kezirat} + ${megoldas} (élesben futó változat, T27 nyelvi kör)`,
    // Az élő review-pass `Felváltja:` sorai öröklődnek (U32, 11-16): a T27-kör az élő változatból indul, amely a
    // felváltott tulajdonosi overlay-ek döntéseit már tartalmazza. Új (még fel nem váltott) overlay-t ez nem érint.
    supersedes: async () => {
      const live = join(paths.repo, 'editorial', 'week-01', 'handoffs', `${pid}.review-pass.md`);
      return existsSync(live) ? (await read(live)).match(/^\W*Felváltja:.*$/gmu)?.map(line => line.trim()) ?? [] : [];
    },
    // A megoldásírónak és a megoldás ellenőreinek (11-15, U22 BLOCKED_DECISION): az élő megoldás és az élő P5-blokk,
    // hogy az ID-k, kulcsok, halmazok és feedbackek betűre megmaradjanak, és ne kelljen őket emlékezetből újraírni.
    liveSolution: async () => `# A review-zott, élesben futó megoldás (${megoldas})\n\n${await read(repoPath(megoldas))}\n\n# Az élesben futó P5-blokk (p5/blocks/w01/block.${pid}.json; ez a BLOKK_JSON alapja)\n\nBLOKK_JSON\n${formatBlock(JSON.parse(await read(blockFile)))}\nBLOKK_JSON_VEGE\n`,
    teacher: async () => {
      const { frenchLifeBlock } = await import(pathToFileURL(join(paths.repo, 'p5', 'lib', 't27.mjs')).href);
      const { blockStrings } = await import(pathToFileURL(join(paths.repo, 'p5', 'lib', 'extract.mjs')).href);
      const block = JSON.parse(await read(blockFile));
      const findings = frenchLifeBlock(block, { strings: blockStrings(block) });
      const rows = findings.map(f => `| ${f.severity === 'error' ? 'HIBA' : 'figy.'} | ${f.location} | ${f.message} | ${(f.text ?? '').replace(/\|/gu, '/')} |`);
      return [
        'Áron (PRESIDENT) 2026-11-15-i app-tesztje: a tanulói felület túl sok helyen magyar (T07, T27), magyar nevek szerepelnek (T08). A szabály a briefben szó szerint áll.',
        `## A P5-kapu CL-27 mostani jelzései erre az egységre (${findings.length} db)\n\n| Súly | Hely | Mi a gond | Szöveg |\n|---|---|---|---|\n${rows.join('\n') || '| – | – | nincs | – |'}`,
        ...(T27_EXTRA[id] ? [`## Az egységre szóló további tétel\n\n${T27_EXTRA[id]}`] : []),
      ].join('\n\n');
    },
    scope: 'T27 nyelvi kör: a cím, az utasítások, a helyzetleírás, a példák, a brief, az eszköz- és ellenőrzőlisták és a rubrika franciára; a magyar nevek a brief táblája szerint franciára. Magyar marad a nyelvtani magyarázat, a megjegyzés, a kiejtés indoklása, a magyar párhuzam, a feedback magyarázó része és a szókincs-előhívás magyar ingere. Az oldal- és item-ID-k, a feladattípusok, a kulcsok, az alternatívák, a mért alakok, a hang és a terjedelem nem változnak; ahol csak cím, utasítás vagy helyzet cserélődik, a feladatot ne írd újra.',
  };
}

/** Egy olvasás/UoF teszt JSON-ja → olvasható kézirat (szöveg + itemek a meglévő kulcsokkal), a gépi metaadatok nélkül. */
export function renderReadingTest(test) {
  const lines = [`# ${test.testId} — ${test.title} (${test.contentVersion})`, '', '## Olvasmány', ''];
  test.source.paragraphs.forEach((p, i) => lines.push(`P${i + 1} ${typeof p === 'string' ? p : p.text}`, ''));
  lines.push(`Szószám: ${test.source.computedWordCount ?? test.source.declaredWordCount}`, '', '## Itemek', '');
  for (const it of test.items) {
    lines.push(`### ${it.itemId}`, '', `Szakasz: ${it.section} · típus: ${it.type} · cél: ${it.primaryTargetId ?? '-'}`);
    for (const key of ['instruction', 'context', 'stem', 'prompt']) if (typeof it[key] === 'string') lines.push(`${key}: ${it[key]}`);
    for (const o of it.options ?? []) lines.push(`- ${o.id}) ${o.text ?? o.label}`);
    const a = it.answer ?? {};
    if (typeof a.primary === 'string') lines.push(`Kulcs: ${a.primary}${a.accepted?.length > 1 ? ` (elfogadott: ${a.accepted.join(' | ')})` : ''}`);
    else if (a.subitems) lines.push(`Kulcs: ${a.subitems.map(s => `P${s.paragraph} → ${s.key}`).join('; ')}`);
    else if (a.primary) lines.push(`Kulcs: ${JSON.stringify({ minimumProblems: a.primary.minimumProblems, acceptedProblems: a.primary.acceptedProblems, requiredResult: a.primary.requiredResult })}`);
    for (const ex of a.acceptedExamples ?? []) lines.push(`Elfogadott minta: ${ex}`);
    for (const r of a.rejected ?? []) lines.push(`Elutasított: ${r.value} — ${r.reason}`);
    if (typeof it.feedback === 'string') lines.push(`Feedback: ${it.feedback}`);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

/**
 * A nyelvtani záróteszt JSON-ja (test-grammar-v3.draft.json) → olvasható kézirat: itemenként a cél, a típus, az
 * utasítás, a stem, az opciók, a kulcs, az elutasított alakok és az újrapróba-változat. A gyártási metaadatok
 * (nehézségi összetevők, forráskötési indoklás, disztraktor-alapok) nélkül.
 */
export function renderGrammarTest(test) {
  const lines = [`# ${test.testId} — nyelvtani záróteszt (${test.contentVersion})`, '', `Pontozás: ${test.scoring?.points ?? test.items.length} pont; első próbálkozás küszöbe: ${test.scoring?.firstAttemptThreshold ?? '-'}; teljesítés: ${test.scoring?.completion ?? '-'}`, '', '## Itemek', ''];
  const show = v => (Array.isArray(v) ? v.join(' | ') : String(v));
  const body = (it, prefix = '') => {
    lines.push(`${prefix}Típus: ${it.type}${it.difficulty ? ` · nehézség: ${it.difficulty}` : ''}${it.family ? ` · család: ${it.family}` : ''} · cél: ${it.primaryTargetId ?? '-'}${it.secondaryTargetIds?.length ? ` (+ ${it.secondaryTargetIds.join(', ')})` : ''}`);
    if (it.sourceRefs?.length) lines.push(`${prefix}Forrás: ${it.sourceRefs.join(', ')}`);
    if (it.instruction) lines.push(`${prefix}instruction: ${it.instruction}`);
    if (it.prompt) lines.push(`${prefix}prompt: ${it.prompt}`);
    if (it.tokens) lines.push(`${prefix}tokenek: ${it.tokens.join(' / ')}`);
    for (const o of it.options ?? []) lines.push(`${prefix}- ${o.optionId}) ${o.text}${o.feedback ? ` — ${o.feedback}` : ''}`);
    const a = it.answer ?? {};
    const key = a.answerOptionIds ?? it.answerOptionIds ?? a.primary ?? it.answer;
    if (key !== undefined) lines.push(`${prefix}Kulcs: ${typeof key === 'object' && !Array.isArray(key) ? JSON.stringify(key) : show(key)}`);
    const accepted = a.accepted ?? it.accepted;
    if (accepted?.length) lines.push(`${prefix}Elfogadott: ${accepted.map(show).join(' ‖ ')}`);
    for (const r of it.rejected ?? []) lines.push(`${prefix}Elutasított: ${show(r.value)} — ${r.reason}`);
    for (const f of it.targetedFeedback ?? []) lines.push(`${prefix}Célzott feedback: ${typeof f === 'string' ? f : `${f.id ?? ''} ${f.text ?? JSON.stringify(f)}`.trim()}`);
    if (it.feedback) lines.push(`${prefix}Feedback: ${typeof it.feedback === 'string' ? it.feedback : JSON.stringify(it.feedback)}`);
  };
  for (const it of test.items) {
    lines.push(`### ${it.itemId}`, '');
    body(it);
    if (it.retry) {
      lines.push('', `Újrapróba-változat (${it.retry.variantId}; a hiba után ${it.retry.dueAfterInterveningItems ?? '?'} item múlva, ugyanarra a célra):`);
      body({ ...it.retry, answer: { primary: it.retry.answer, accepted: it.retry.accepted } }, '  ');
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

/**
 * A javított nyelvtani egységek itemjei tömören (a kiadott P5-blokkokból): az újdonsági próba alapja. Egy tesztmondat
 * nem ismételheti és nem alakíthatja át egy egység itemjét; a régi novelty-riport még a javítás előtti egységekre készült.
 */
export const GRAMMAR_UNIT_BLOCKS = ['w01-u-1-1', 'w01-u-2-1', 'w01-u-3-1', 'w01-u-4-1', 'w01-u-5-1'];
export async function grammarUnitsDigest(ids = GRAMMAR_UNIT_BLOCKS) {
  const one = s => String(s ?? '').replace(/\s+/g, ' ').trim();
  const parts = ['# A javított nyelvtani egységek itemjei (az újdonsági próba alapja; a kiadott P5-blokkokból)', ''];
  for (const id of ids) {
    const block = JSON.parse(await read(repoPath(`p5/blocks/w01/block.${id}.json`)));
    parts.push(`## ${id} — ${block.title}`, '');
    if (block.taughtTargetRefs?.length) parts.push(`Tanított célok: ${block.taughtTargetRefs.join(', ')}`, '');
    for (const page of block.pages ?? []) {
      for (const item of page.items ?? []) {
        const s = item.solution ?? {};
        const key = s.key ?? (s.keyOptionIds ? s.keyOptionIds.map(k => (item.response?.options ?? []).find(o => o.id === k)?.label ?? k) : null);
        const prompt = one(typeof item.prompt === 'string' ? item.prompt : JSON.stringify(item.prompt ?? ''));
        parts.push(`- ${item.id.replace(`${id}-`, '')}: ${prompt.length > 240 ? `${prompt.slice(0, 240)}…` : prompt}${key ? ` → ${one(typeof key === 'string' ? key : JSON.stringify(key))}` : ''}`);
      }
    }
    parts.push('');
  }
  return `${parts.join('\n')}\n`;
}

/** FNV-1a 32 bites hash (a szókincs-teszt rögzített, ismételhető irány- és sorrendkiosztásához). */
export function fnv1a32(text) {
  let h = 0x811c9dc5;
  for (const byte of Buffer.from(String(text), 'utf8')) h = Math.imul(h ^ byte, 0x01000193) >>> 0;
  return h >>> 0;
}
/** Keverő lépés (murmur3 fmix32) az FNV fölé: a csak az utolsó karakterben eltérő azonosítók is szétszóródnak. */
const mixedHash = text => {
  let h = fnv1a32(text);
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0; h ^= h >>> 16;
  return h >>> 0;
};

/**
 * A szókincs-záróteszt statikus változata (Áron, 11-09: „Statikus átmenetileg”): a generátor helyett rögzített irány
 * és sorrend, a generátor szabályai szerint: adagonként fele-fele irány (a heti listán 30/30/40 → 15/15, 15/15, 20/20,
 * összesen 50/50), kevert sorrend, legfeljebb 4 azonos irány egymás után. Ismételhető: a hash-kulcs rögzített.
 */
export const STATIC_VOCAB_VERSION = 'w01-vocab-static-v1';
export function staticVocabularyPlan(vocab, { version = STATIC_VOCAB_VERSION, maxRun = 4 } = {}) {
  const byDose = new Map();
  for (const v of vocab) byDose.set(v.dose, [...(byDose.get(v.dose) ?? []), v]);
  const direction = new Map();
  for (const [dose, list] of byDose) {
    const sorted = [...list].sort((a, b) => mixedHash(`${version}|dir|${a.id}`) - mixedHash(`${version}|dir|${b.id}`) || a.id.localeCompare(b.id));
    // Páratlan adagméretnél a többlet felváltva kerül az irányokra (az összesítés így is a lehető legközelebb 50/50).
    const half = Math.floor(sorted.length / 2) + (sorted.length % 2 && dose % 2 ? 1 : 0);
    sorted.forEach((v, i) => direction.set(v.id, i < half ? 'FR_TO_HU' : 'HU_TO_FR'));
  }
  // Kevert sorrend: a rögzített hash-sorrendből mindig az első még fel nem használt elem, amely nem hoz létre
  // maxRun feletti azonos irányú futamot (mohó, determinisztikus; elakadásnál hiba, nem csendes engedmény).
  const pool = [...vocab].sort((a, b) => mixedHash(`${version}|order|${a.id}`) - mixedHash(`${version}|order|${b.id}`) || a.id.localeCompare(b.id)).map(v => v.id);
  const order = [];
  const tailRun = dir => { let n = 0; for (let i = order.length - 1; i >= 0 && direction.get(order[i]) === dir; i -= 1) n += 1; return n; };
  // Előretekintés: a választás után a maradék még elrendezhető-e (a = a most választott iránnyal egyező, t = a futama,
  // b = az ellentétes): a ≤ maxRun·b + (maxRun − t) és b ≤ maxRun·(a + 1).
  const feasible = id => {
    const dir = direction.get(id);
    const t = tailRun(dir) + 1;
    if (t > maxRun) return false;
    const rest = pool.filter(x => x !== id);
    const a = rest.filter(x => direction.get(x) === dir).length;
    const b = rest.length - a;
    return a <= maxRun * b + (maxRun - t) && b <= maxRun * (a + 1);
  };
  while (pool.length) {
    const k = pool.findIndex(feasible);
    if (k < 0) throw new Error(`staticVocabularyPlan: a(z) ${order.length + 1}. helyre nincs ${maxRun} futamot nem sértő elem`);
    order.push(pool.splice(k, 1)[0]);
  }
  let longest = 0;
  for (let i = 0, n = 0; i < order.length; i += 1) { n = i && direction.get(order[i]) === direction.get(order[i - 1]) ? n + 1 : 1; longest = Math.max(longest, n); }
  const items = order.map((id, position) => ({ position: position + 1, id, dose: vocab.find(v => v.id === id).dose, direction: direction.get(id) }));
  return { version, items, maxRun: longest, counts: { FR_TO_HU: items.filter(x => x.direction === 'FR_TO_HU').length, HU_TO_FR: items.filter(x => x.direction === 'HU_TO_FR').length } };
}

/** A statikus szókincs-teszt olvasható kézirata: a rögzített sorrend és irány, a szó adatai (week-01.json vocabulary). */
export function renderVocabularyTest(vocab, plan) {
  const byId = new Map(vocab.map(v => [v.id, v]));
  const label = { FR_TO_HU: 'FR → HU', HU_TO_FR: 'HU → FR' };
  const lines = [`# w01-test-vocabulary — szókincs-záróteszt, statikus változat (${plan.version})`, '',
    `A generátor helyett rögzített irány és sorrend: ${plan.counts.FR_TO_HU} FR → HU, ${plan.counts.HU_TO_FR} HU → FR; adagonként fele-fele; legfeljebb ${plan.maxRun} azonos irány egymás után. Item-ID: w01-test-vocabulary-<szó-ID>.`, '', '## Itemek a teszt sorrendjében', ''];
  for (const p of plan.items) {
    const v = byId.get(p.id);
    lines.push(`### ${p.position}. w01-test-vocabulary-${v.id} — ${label[p.direction]} (${p.dose}. adag)`, '');
    lines.push(`- francia: ${v.fr} · szófaj: ${v.partOfSpeech}${v.forms ? ` · alakok: ${JSON.stringify(v.forms)}` : ''}${v.register ? ` · regiszter: ${v.register}` : ''}`);
    lines.push(`- magyar jelentések: ${(v.hu ?? []).join(' | ')} · a kért jelentés: ${v.contextSense ?? '-'}`);
    for (const ex of v.examples ?? []) lines.push(`- példa: ${ex.fr} — ${ex.hu}`);
    if (v.collocations?.length) lines.push(`- kollokációk: ${v.collocations.join('; ')}`);
    lines.push(`- elfogadott (FR → HU): ${(v.acceptedTranslations?.FR_TO_HU ?? []).join(' | ')}`);
    lines.push(`- elfogadott (HU → FR): ${(v.acceptedTranslations?.HU_TO_FR ?? []).join(' | ')}`);
    for (const r of v.rejectedTranslations ?? []) lines.push(`- elutasított: ${r.value} — ${r.reason}`);
    if (v.answerPolicy) lines.push(`- válaszszabály: ${JSON.stringify(v.answerPolicy)}`);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

/** A tanári kifogások egy részlege a PONTOS_TANARI_JELOLESEK.md-ből („## reading — …” a következő „## ”-ig). */
export function teacherSection(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex(l => l.toLowerCase().startsWith(`## ${heading.toLowerCase()}`));
  if (start < 0) throw new Error(`Nincs ilyen tanári szakasz: ${heading}`);
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start, end < 0 ? undefined : end).join('\n').trim();
}

/**
 * A javítható egységek. Új egység: azonosító, oszlop (a rendező és a szerző ebből jön), P5-azonosító,
 * a meglévő kézirat betöltése és a tanári kifogások. A sorrendről az irányító chat dönt.
 */
// A heti CL-alap (week-01.json) egy egységének olvasható változata a szerzőnek: a gyártási és motoradatok
// (provenance, mentés, glosszák, felismerő-minták, normalizálás, újrapróba) nélkül; az olvasmány szakaszainak
// szövege csak egyszer (a sourceText-ben) szerepel.
const UNIT_NOISE = new Set(['provenance', 'sourceLineage', 'persistence', 'selfApproved', 'acceptedSurfacePatterns', 'glosses', 'contextualGlosses',
  'normalization', 'retry', 'choiceEvaluatorId', 'sourceArtifactVersion', 'unlock', 'owner', 'reviewers']);
// omit: egységenként további elhagyható kulcsok (pl. a nagy egységeknél a sourceTrace), a többi egység bemenete nem változik.
export function renderUnit(unit, { omit = [] } = {}) {
  const pages = (unit.pages ?? []).map(page => ({
    ...page,
    blocks: (page.blocks ?? []).map(b => (b.kind === 'reading_segment' ? { kind: b.kind, paragraphNumbers: b.paragraphNumbers } : b)),
  }));
  const noise = new Set([...UNIT_NOISE, ...omit]);
  const json = JSON.stringify({ ...unit, pages }, (key, value) => (noise.has(key) ? undefined : value), 2);
  return `# ${unit.id} — ${unit.title} (${unit.coordinate})\n\nA heti CL-alap (week-01.json) egységadata, olvasható formában (motor- és gyártási adatok nélkül):\n\n\`\`\`json\n${json}\n\`\`\`\n`;
}
const WEEK01 = 'editorial/week-01/data/week-01.json';
const weekUnit = async id => {
  const unit = JSON.parse(await read(repoPath(WEEK01))).units.find(u => u.id === id);
  if (!unit) throw new Error(`Nincs ilyen egység a ${WEEK01} fájlban: ${id}`);
  return unit;
};
// A heti szókincslista (VR, 100 elem) tömören: a szóírási feladat célszavai csak ebből jöhetnek (a tanító adag szerint).
const DOSE_UNIT = { 1: 'w01-u-1-3', 2: 'w01-u-2-3', 3: 'w01-u-4-3' };
export async function weekVocabulary() {
  const vocab = JSON.parse(await read(repoPath(WEEK01))).vocabulary ?? [];
  const rows = vocab.map(v => `| ${v.id} | ${v.dose} (${DOSE_UNIT[v.dose] ?? '?'}) | ${v.fr} | ${(v.hu ?? [])[0] ?? ''} | ${v.register ?? ''} | ${(v.collocations ?? []).join('; ')} | ${(v.examples ?? [])[0]?.fr ?? ''} |`);
  return `# A heti szókincslista (VR, ${vocab.length} elem; ${WEEK01} → vocabulary)

A tanító adag: 1 = w01-u-1-3, 2 = w01-u-2-3, 3 = w01-u-4-3. Célszó csak ebből a listából lehet; a listából nem törlünk.

| ID | Adag (tanító egység) | Francia | Magyar | Regiszter | Kollokációk | Példa |
|---|---|---|---|---|---|---|
${rows.join('\n')}
`;
}
const TEACHER_FILE = 'docs/tanar/claude-atadas-2026-10-27/PONTOS_TANARI_JELOLESEK.md';
const FICHE01 = 'editorial/p4-planning/references/tanar/VALASZ-FICHE-01-2026-10-08.md';
const GRAMMAR_TEST = 'editorial/week-01/handoffs/test-grammar-v3.draft.json';
const VOCAB_REVIEW = 'editorial/week-01/handoffs/w01-test-vocabulary.independent-review.md';
const DECISIONS = 'docs/DONTESEK.md';

/** A szókincs-teszt jóváhagyott válaszszabályai: a független review 3–8. szakasza (VOC-R01…R06, modalitás) és a 09-21-i döntés. */
export async function vocabularyPolicies() {
  const review = (await read(repoPath(VOCAB_REVIEW))).split(/\r?\n/);
  const start = review.findIndex(l => /^## 3\. /.test(l));
  const end = review.findIndex(l => /^## 9\. /.test(l));
  if (start < 0 || end < 0) throw new Error(`A ${VOCAB_REVIEW} szakaszai (## 3. … ## 9.) nem találhatók.`);
  const decision = (await read(repoPath(DECISIONS))).split(/\r?\n/).find(l => l.startsWith('| 09-21 | **Szókincs-záróteszt, nem és névelő'));
  if (!decision) throw new Error('A 09-21-i szókincs-záróteszt döntés nem található a DONTESEK-ben.');
  return `# A jóváhagyott válaszszabályok (független review, REVIEW_PASS; ${VOCAB_REVIEW}, 3–8. szakasz)\n\n${review.slice(start, end).join('\n').trim()}\n\n# Áron döntése (DONTESEK 09-21)\n\n${decision}\n`;
}
const PROPOSALS = 'docs/tanar/2026-10-20-jelolt-visszajelzes/OSSZEFOGLALO_ES_JAVITASI_JAVASLAT.txt';
const proposalLine = async n => (await read(repoPath(PROPOSALS))).split(/\r?\n/).find(l => l.startsWith(`${n}. `)) ?? '';

async function reviewedTextsAppendix(text) {
  const list = await blockLearnerTexts(text);
  return list ? `

## Függelék: a BLOKK_JSON tanulói szövegei, ahogy az ellenőrök olvasták

${list}` : '';
}

export const UNITS = {
  R11: {
    title: 'Reading/UoF záróteszt — olvasmány és itemek',
    column: 'RI',
    p5Id: 'w01-test-reading-uof',
    kind: 'assessment',
    manuscript: async () => renderReadingTest(JSON.parse(await read(repoPath('editorial/week-01/handoffs/test-reading-uof-v2.2.draft.json')))),
    manuscriptSource: 'editorial/week-01/handoffs/test-reading-uof-v2.2.draft.json (contentVersion 2.4-draft; nincs REVIEW_PASS kézirata)',
    teacher: async () => [
      teacherSection(await read(repoPath('docs/tanar/claude-atadas-2026-10-27/PONTOS_TANARI_JELOLESEK.md')), 'reading'),
      'A tanár által látott utasítás (rendben találta): « Un collègue n’a pas lu le texte et vous demande ce qui a été corrigé ou résolu avant la répétition. En 2–3 phrases, citez deux problèmes distincts et indiquez le résultat final pour Lina. » A kritériumokat is rendben találta (két különböző probléma + a végeredmény).',
      'A P1, P3, P5 jelölés a bekezdésekre utal (P1 … P5 az olvasmányban).',
    ].join('\n\n'),
    scope: 'a teljes olvasmány és mind a 20 item (r01–r11 olvasás, u01–u09 nyelvhasználat). A nyelvhasználati itemek célalakjai maradnak, a stimulusuk az új történethez igazodik.',
  },
  U53: {
    title: 'Írásfeladat — helyértékelés (L’adresse vaut-elle vraiment le détour ?)',
    column: 'VI',
    p5Id: 'w01-u-5-3',
    kind: 'lesson',
    manuscript: async () => `${renderUnit(await weekUnit('w01-u-5-3'))}

${await weekVocabulary()}`,
    manuscriptSource: `${WEEK01} → units[w01-u-5-3] (writing v2)`,
    teacher: async () => [
      teacherSection(await read(repoPath(TEACHER_FILE)), 'writing'),
      'A tanár ezt a feladatot (a modellszöveget és a kikötött szavakat) látta 2026-10-20-án; a jelölések TF20-P3-H01…H07.',
      `A koordinátor javaslata (nem tanári utasítás): ${await proposalLine(2)}`,
    ].join('\n\n'),
    scope: 'a teljes írásfeladat: helyzet, feladat, követelmények, kötelező és választható célszavak, tartalmi kritériumok és a modellszöveg. A kikötött szavak a valódi helyértékelés műfajához illeszkedjenek, a modellel együtt igazítva; a heti szókincslistából nem törlünk automatikusan szót (ha egy célszó kikerül a feladatból, a heti listában marad). A terjedelem és a többi követelmény marad, hacsak a terv indokoltan mást nem javasol. Az oldal-ID-k (p01–p04) maradnak.',
  },
  U12: {
    title: 'Olvasmány — Le petit-déjeuner français existe-t-il vraiment ?',
    column: 'RI',
    p5Id: 'w01-u-1-2',
    kind: 'lesson',
    manuscript: async () => renderUnit(await weekUnit('w01-u-1-2')),
    manuscriptSource: `${WEEK01} → units[w01-u-1-2] (a FICHE-01-en bírált olvasmány)`,
    teacher: async () => [
      teacherSection(await read(repoPath(FICHE01)), 'Amit mondott'),
      'A tanár a FICHE-01-en (2026-10-08) ezt az olvasmányt (öt bekezdés) és a hozzá tartozó B/C-itemeket látta. A B3, B4, B6 és C1 tételjavítás már elfogadott (kanonikus, lásd a briefet); itt az olvasmány a feladat.',
    ].join('\n\n'),
    scope: 'a teljes olvasmány (öt bekezdés, új, érdekes, francia magazinhangú szöveg: helyzet → fordulat → következtetés, valódi emberekkel) és mind a 16 item (p05–p12). A mérési célok, a feladattípusok és az item-ID-k maradnak; az itemek az új szövegre épülnek.',
  },
  U34: {
    title: 'Hallás utáni értés — La commande de l’atelier (párbeszéd)',
    column: 'XI',
    p5Id: 'w01-u-3-4',
    kind: 'lesson',
    manuscript: async () => `${renderUnit(await weekUnit('w01-u-3-4'))}\n\n# A hallási szöveg régi forgatókönyve (w01-audio-3-4-transcript.json)\n\n${(JSON.parse(await read(repoPath('editorial/week-01/assets/audio/release/listening/w01-audio-3-4-transcript.json'))).turns ?? []).map(t => `${t.anchorId} ${t.speaker}: ${t.text}`).join('\n')}\n`,
    manuscriptSource: `${WEEK01} → units[w01-u-3-4] + editorial/week-01/assets/audio/release/listening/w01-audio-3-4-transcript.json`,
    teacher: async () => [
      teacherSection(await read(repoPath(TEACHER_FILE)), 'listening'),
      'A TF20-P2-H… jelölések a régi forgatókönyv fordulóira (A01–A12) utalnak. A tanár a hangot érthetőnek, a két bemutatott kérdés kulcsát helyesnek találta.',
      `A koordinátor javaslata (nem tanári utasítás): ${await proposalLine(1)}`,
    ].join('\n\n'),
    scope: 'a hallási szöveg forgatókönyve (két szereplő, a régi A01–A20 fordulók helyett természetes pultbeszéd, új hihető helyzet; a téma A2-es, a nyelv a hét szintjén, nem túlbonyolítva) és mind a 13 item (p08). A mérési célok, a feladattípusok és az item-ID-k maradnak. **Most csak a szöveg és a feladatok készülnek; a hang később, a forgatókönyv PASS-a után (a blokkban a hangeszköz HIANYZIK jelöléssel).**',
  },
  // Áron, 10-30, (a): nincs rá egységre szóló tanári jelölés; a FICHE-01 általános kifogásai alapján javul.
  U11: {
    title: 'Nyelvtan — Au comptoir : choisir le déterminant',
    column: 'GI',
    p5Id: 'w01-u-1-1',
    kind: 'lesson',
    // Áron, 10-31, (a): a 29 oldalas egység bemenete (409 KB) kétszer kifutott a 20 percből a NavE-nél.
    manuscript: async () => renderUnit(await weekUnit('w01-u-1-1'), { omit: ['sourceTrace'] }),
    stepTimeoutMs: 45 * 60_000,
    manuscriptSource: `${WEEK01} → units[w01-u-1-1]`,
    teacher: async () => [
      teacherSection(await read(repoPath(FICHE01)), 'Amit mondott'),
      'Erre az egységre a tanár nem adott külön jelölést. A FICHE-01 általános kifogásai érvényesek rá: a szövegek nem hangzanak franciául, a helyzetek nem léteznek így, a nyelvtani mag (partitív, *de* tagadás után, *en*) B1+-on már ismétlés.',
    ].join('\n\n'),
    scope: 'a teljes nyelvtani egység: a magyarázat példái, a helyzetek és az itemek stimulusai új, valódi, Franciaországban létező pultbeszédben (pékség, reggeli, kávézó), ismétlő-pontosító szinten. A tanulási cél (határozott, határozatlan és részelő névelő jelentés szerint), a feladattípusok, a stabil item-ID-k és nagyjából a terjedelem (29 oldal) maradnak; a mért alakok nem változnak. Hang nincs.',
  },
  // 11-09 (Áron: „csináld a teendőidet”; a hét befejezése, DONTESEK 11-01): a nyelvtani záróteszt. Egységre szóló tanári
  // jelölés nincs; a FICHE-01 általános kifogásai és a javított nyelvtani egységekhez mért újdonság a mérce.
  GT1: {
    title: 'Nyelvtani záróteszt — determinánsok, de, en',
    column: 'GI',
    p5Id: 'w01-test-grammar',
    kind: 'assessment',
    manuscript: async () => `${renderGrammarTest(JSON.parse(await read(repoPath(GRAMMAR_TEST))))}\n${await grammarUnitsDigest()}`,
    stepTimeoutMs: 45 * 60_000,
    manuscriptSource: `${GRAMMAR_TEST} (24 item + újrapróba-változatok; a javítás előtti egységekhez készült, RE_REVIEW_REQUIRED) + a javított nyelvtani egységek itemjei (p5/blocks/w01)`,
    teacher: async () => [
      teacherSection(await read(repoPath(FICHE01)), 'Amit mondott'),
      'A zárótesztre a tanár nem adott külön jelölést. A FICHE-01 általános kifogásai érvényesek rá: a mondatok nem hangzanak franciául, a helyzetek nem léteznek így, a nyelvtani mag (partitív, *de* tagadás után, *en*) B1+-on már ismétlés.',
      'A teszt még a javítás előtti nyelvtani egységekre épül (forrás- és újdonsági próba, novelty-riport): azóta az U11, U21, U31, U41 és U51 új kéziratot kapott, ezért a tesztet hozzájuk kell mérni.',
    ].join('\n\n'),
    scope: 'a teljes nyelvtani záróteszt: mind a 24 item (i001–i024) és az újrapróba-változatuk. A mérési célok (primaryTargetId), a feladattípusok, a nehézségi sorrend, az item-ID-k és a pontozás (24 pont, az első próbálkozás küszöbe a családonkénti alsó határokkal) maradnak. Két dolgot kell igazítani: (1) a tesztmondatok valódi, Franciaországban létező helyzetben szóljanak, a hét szintjén (FICHE-01); (2) **újdonság a javított egységekhez képest:** egy tesztmondat sem ismételheti vagy alakíthatja át egy javított nyelvtani egység (U11, U21, U31, U41, U51) itemjét — ezek a kézirat végén, „A javított nyelvtani egységek itemjei” alatt. Ha egy mérési célt a javított egységek már nem tanítanak, a tervben döntési pontként jelezd, ne mérd tanítatlanul. **Újrapróba:** a változatok a kéziratban és a megoldásban teljesen megmaradnak; a P5-blokkba a 24 alapitem kerül, mert az app ma nem tud újrapróba-sort (app-igény: `javitas-2026-10/GT1/APP_IGENY_UJRAPROBA.md`). A tartalmat ne igazítsd ehhez. Hang nincs.',
    // 11-13: az app újrapróba-sora elkészült (PR #52, szerződés 2.0.3). Csak a P5-javítási körbe kerül (a scope a kész
    // lépések bemenete, nem változhat); a P5-kapu lefedettségi hibája (24 × -r1) így a szerződés szerint javítható.
    p5Note: '**Ez felülírja a megbízás P5-re vonatkozó mondatát (Áron döntése C, 11-09; az app azóta tud újrapróba-sort: PR #52, v2 szerződés 2.0.3).** A P5-blokkba most a 24 alapitem mellé az újrapróba-változatok is bekerülnek, a 2.0.3 szerint: a blokk `completion.mode: "mastery"`; minden alapitem `retry: { afterItems, items: [...] }` mezőt kap, az `items` a megoldásban szereplő `-r1` változat(ok) teljes itemje (ugyanaz a képesség, választípus és mérési cél, saját kulcs, elfogadott és elutasított alakok, feedback; az ID marad `…-iNNN-r1`). Az `afterItems` a megoldás újrapróba-szabálya szerinti késleltetés. A változatok tartalma a review-zott megoldásból jön, szó szerint; új szöveget ne írj. Referencia: `docs/app/V2_SZERZODES_MESTERSZINT_2026-11-09.md` és a minta: `p5/test/fixtures/types/blocks/block.w40-test-maitrise.json`.',
  },
  // 11-09 (Áron: „Statikus átmenetileg”): a szókincs-záróteszt rögzített irány- és sorrendkiosztással (generátor és
  // szerveroldali kulcs nélkül, app-igény). A tartalom független review-n átment; a feladat a statikus megvalósítás.
  VT1: {
    title: 'Szókincs-záróteszt — 100 szó, írásos fordítás (statikus változat)',
    column: 'VI',
    p5Id: 'w01-test-vocabulary',
    kind: 'assessment',
    manuscript: async () => {
      const vocab = JSON.parse(await read(repoPath(WEEK01))).vocabulary;
      return `${renderVocabularyTest(vocab, staticVocabularyPlan(vocab))}\n${await vocabularyPolicies()}`;
    },
    stepTimeoutMs: 45 * 60_000,
    manuscriptSource: `${WEEK01} → vocabulary (100 szó) + ${STATIC_VOCAB_VERSION} rögzített irány és sorrend + a független review válaszszabályai (${VOCAB_REVIEW})`,
    teacher: async () => [
      teacherSection(await read(repoPath(FICHE01)), 'Amit mondott'),
      'A zárótesztre a tanár nem adott külön jelölést. A FICHE-01 általános kifogásai érvényesek rá: a mondatok nem hangzanak franciául, a helyzetek nem léteznek így.',
      'A teszt tartalma (a 100 célalak, a jelentéskészletek és a válaszszabályok) független review-n átment (REVIEW_PASS, nyitott tartalmi finding nincs). A mostani feladat nem újraírás, hanem a statikus megvalósítás a jóváhagyott szabályok szerint.',
    ].join('\n\n'),
    scope: 'a teljes szókincs-záróteszt statikus változata: mind a 100 item (w01-test-vocabulary-w01-v2-001…100), **a kéziratban rögzített sorrendben és irányban** (50 FR → HU, 50 HU → FR; ezt ne változtasd). Csak írásos fordítás, választásos elem, hang és beszéd nélkül. A heti szókincslistából (VR) nem törlünk és nem cserélünk szót; a célalakok és a magyar jelentéskészletek maradnak. **A kulcs a jóváhagyott válaszszabályok szerint** (a kézirat végén): HU → FR irányban főnévnél a teljes névelős alak kell (*une viennoiserie*, nem *viennoiserie*; a heti adatban 22 főnév kulcsa még névelő nélküli, ezt a szabály szerint javítsd), melléknévnél a nem triviális nőnem két külön mezőben (előbb hímnem, aztán nőnem); FR → HU irányban a kért jelentés szerinti elfogadott készlet. Ez csak kivonat: ütközésnél a kézirat végén csatolt szabályok az irányadók. Normalizálás: NFC, szóközök, kis- és nagybetű, aposztróf; az ékezet és a kötőjel számít. A kontextusmondat (a szó példamondata) csak akkor változzon, ha nem hangzik franciául vagy félrevezető (FICHE-01), és ezt a VÁLTOZÁSNAPLÓ tételesen rögzítse. **Átmeneti korlátok** (app-igény: `javitas-2026-10/VT1/APP_IGENY_SORSOLAS_SZERVERKULCS.md`): az irány nem sorsolódik, a kulcs a blokkban van, az újrapróba-sor nincs meg (`GT1/APP_IGENY_UJRAPROBA.md`). A tartalmat ne igazítsd ehhez.',
  },
  ...weekRest(),
};

// Áron, 11-01: „legyen meg az első hét” — a hét maradék egységei a U11 mintájára: egységre szóló tanári jelölés
// nélkül a FICHE-01 általános kifogásai alapján. Oszlop a koordinátából (1 GI, 2 RI, 3 VI, 4 XI); a U41 és a U43
// alapja a kanonikus (elfogadott tanári tételjavításokkal frissített) week-01.json.
function weekRest() {
  const COLUMN_OF = { 1: 'GI', 2: 'RI', 3: 'VI', 4: 'XI' };
  const KANONIKUS = 'editorial/week-01/javitas-2026-10/kanonikus/week-01.json';
  const rest = {
    U13: 'Szókincs, 1. adag — Première dose', U14: 'Beszéd — Au comptoir pour de vrai',
    U21: 'Nyelvtan — Du, des, de : forme ou sens ?', U22: 'Párbeszéd — Une commande qui se précise',
    U23: 'Szókincs, 2. adag — Deuxième dose', U24: 'Memoriter — La commande complète',
    U31: 'Nyelvtan — Déterminants en situation', U32: 'Írás — Écrire au responsable du petit déjeuner',
    U33: 'Aktív szókincs — Maîtrise active I', U41: 'Nyelvtan — Tagadás, zéró névelő és az en határai',
    U42: 'Beszéd — Commande pour quatre collègues', U43: 'Szókincs, 3. adag — Troisième dose',
    U44: 'Kiejtés — u / ou', U51: 'Nyelvtan — Informer d’une rupture et proposer',
    U52: 'Olvasmány — Le petit-déjeuner solidaire qui devait rester simple', U54: 'Videó — Karimouche, P’tit kawa',
  };
  return Object.fromEntries(Object.entries(rest).map(([id, title]) => {
    const p5Id = `w01-u-${id[1]}-${id[2]}`;
    const column = COLUMN_OF[id[2]];
    const source = ['U41', 'U43'].includes(id) ? KANONIKUS : WEEK01;
    return [id, {
      title, column, p5Id, kind: 'lesson',
      manuscript: async () => {
        const unit = JSON.parse(await read(repoPath(source))).units.find(u => u.id === p5Id);
        if (!unit) throw new Error(`Nincs ilyen egység a ${source} fájlban: ${p5Id}`);
        const text = renderUnit(unit, { omit: ['sourceTrace'] });
        return column === 'VI' ? `${text}\n${await weekVocabulary()}` : text;
      },
      stepTimeoutMs: 45 * 60_000,
      manuscriptSource: `${source} → units[${p5Id}]`,
      teacher: async () => [
        teacherSection(await read(repoPath(FICHE01)), 'Amit mondott'),
        'Erre az egységre a tanár nem adott külön jelölést. A FICHE-01 általános kifogásai érvényesek rá: a szövegek nem hangzanak franciául, a helyzetek nem léteznek így, vagy nem érdekesek, a szint több helyen a célszint alatt van, a nyelvtani mag (partitív, *de* tagadás után, *en*) B1+-on már ismétlés.',
      ].join('\n\n'),
      scope: `a teljes egység: a példák, a helyzetek, a modellszövegek és az itemek stimulusai valódi, Franciaországban létező helyzetben (pékség, reggeli, kávézó), a hét szintjén. A tanulási és mérési cél, a feladattípusok, a stabil oldal- és item-ID-k és nagyjából a terjedelem maradnak; a mért alakok nem változnak.${column === 'VI' ? ' A heti szókincslistából (VR) nem törlünk és nem cserélünk szót; a célszavak és a kártyák szókincse marad.' : ''} **Hang és videó:** ha az egységhez meglévő felvétel tartozik (hallott szöveg, szókártyahang, kiejtési klip, videó), a hallott szöveg és a hozzá kötött kulcs nem változik, és új hang nem készül (hangforrás-elsőbbség, DONTESEK 10-31). Ha a javítás új hangot kívánna, ezt a tervben döntési pontként jelezd, és ne írj olyan hallott szöveget, amelyhez nincs hang.`,
    }];
  }));
}

/** Becsült hívásszám egy egységre (a dry-run és a jelentés számára). */
export function estimateCalls(config, { solver = true } = {}) {
  const peRuns = config.limits?.peRuns ?? 1;
  const peMax = config.limits?.peMaxRounds ?? config.limits?.maxRounds ?? 2;
  const max = config.limits?.maxRounds ?? 2;
  const terv = 1 + 2;
  const kezirat = 1 + peRuns + 1;
  const megoldas = 1 + peRuns + 4 + (solver ? 1 : 0);
  const base = terv + kezirat + megoldas;
  // Jellemző: egy javítási kör a kéziratnál (szerző + PE ×2) és egy a megoldásnál (megoldásíró + PE ×2 + egy másik ellenőr).
  const typical = base + (1 + peRuns) + (1 + peRuns + 1);
  // Legrosszabb: a terv 2 köre, a kézirat 4 PE-köre (a 3.-ban újraírás: utána minden ellenőr), a megoldás 4 PE-köre
  // (az első kettőben minden ellenőr újra), plusz 2 P5-javítás.
  const worst = base + max * 3 + (peMax * (1 + peRuns) + 1) + (max * (1 + peRuns + 4 + (solver ? 1 : 0)) + (peMax - max) * (1 + peRuns)) + 2;
  return { alap: base, jellemzo: typical, legrosszabb: worst };
}

/** A javítás lánc. options: { egyseg, brief, out, solver (alap: config.assign.SOLVER), p5 (alap: igaz) } */
/**
 * A megoldásíró visszautalt (ESCALATED) kéziratmódosításai: a „Visszautalt hibák” / „ESCALATED” szakasz és benne
 * az `| E-NN | hely | javaslat | miért (finding-ID-k) | ha marad |` sorok. { section, items } vagy null.
 */
export function parseEscalations(text) {
  const lines = String(text ?? '').split(/\r?\n/);
  const start = lines.findIndex(l => /^#{2,3}\s.*(ESCALATED|Visszautalt)/i.test(l));
  if (start < 0) return null;
  let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  if (end < 0) end = lines.length;
  const section = lines.slice(start, end).join('\n').trim();
  const items = lines.slice(start, end)
    // Az ID után jelző is állhat ugyanabban a cellában („E-01 · MINOR”, „E-06 (**2. kör**)”; U24, U32 11-15).
    .map(l => l.match(/^\|\s*\**(E-\d+)\b[^|]*\|(.*)\|\s*$/))
    .filter(Boolean)
    .map(m => { const cells = m[2].split('|').map(c => c.trim()); return { id: m[1], location: cells[0] ?? '', proposal: cells[1] ?? '', reason: cells[2] ?? '' }; });
  return items.length ? { section, items } : null;
}

const REF_ROLES = [[/\bPE-/i, 'PE'], [/\bNAVE-/i, 'NavE'], [/\bNYE-/i, 'NyE'], [/\bUE-/i, 'UE'], [/\bHE-/i, 'HE'], [/megoldó|SOLVER/i, 'SOLVER']];

/** Mely ellenőrök findingjaiból jönnek az eszkalációk (a „miért” oszlop finding-ID-i alapján). */
export function escalationRoles(items) {
  const roles = new Set();
  for (const item of items) for (const [re, role] of REF_ROLES) if (re.test(`${item.reason} ${item.proposal}`)) roles.add(role);
  return roles;
}

const ESCALATION_FOCUS = 'CÉLZOTT RECHECK: csak az eszkalált módosításokat (a kézirat „Ebben a körben” változásnaplója) és a tőlük közvetlenül függő részeket vizsgáld; a többi rész már elfogadott, azt ne nyisd újra.';
const NYE_OWN_PROPOSAL = ' A PE saját javaslatából átvett szövegeket (pl. egy általa javasolt stem vagy mintaválasz) a szabály szerint nem a PE, hanem te ellenőrzöd: természetes, helyes francia-e, egyértelmű-e, és csak a célalak ad-e pontot.';
const PHASE_DECISION_NOTE = '\n\n# Folytatás a PRESIDENT döntése után\n\nA javítási körök elfogytak, a PRESIDENT döntött. Add le a teljes, javított változatot a döntés szerint, és a nyitott findingokra adj dispositiont (FIXED / REJECTED_WITH_REASON a döntésre hivatkozva).\n';
// A folytató megoldáskör a teljes megoldást adja le: a P5 hűségkapuja csak a leadott, review-zott megoldás szövegét fogadja el
// (R11, 10-28: a „változatlan” jelöléssel rövidített itemek ~95 feedbackszövege „kitaláltnak” látszott).
const FULL_SOLUTION_NOTE = '\n\n# A teljes megoldás kötelező\n\nA változatlan itemek megoldási adatát (kulcs, elfogadott alternatívák, a teljes feedback, az elutasított alakok és a feedbackjük, rubrika, minták) is **szó szerint, teljesen** írd ki; ne rövidíts „változatlan” jelöléssel vagy hivatkozással. A P5-blokk hűségkapuja csak azt a szöveget fogadja el, amely ebben a leadott megoldásban szerepel.\n';
const CONTINUE_NOTE = '\n\n# Folytatás az eszkaláció után\n\nA kézirat szerzője átvezette a visszautalt módosításokat. Csak az érintett itemek megoldási adatát igazítsd (élesítsd a feltételes kulcsokat, a feedbacket és a mintákat); a többi változatlan. Add le a teljes megoldást, és a „Visszautalt hibák” szakaszba csak azt írd, ami ezután is nyitott.\n';

export async function javitasPipeline(engine, options = {}) {
  const id = String(options.egyseg ?? '').toUpperCase();
  if (!UNITS[id]) throw new Error(`Ismeretlen egység: ${options.egyseg || '(nincs megadva)'}. Választható: ${Object.keys(UNITS).join(', ')} (--egyseg).`);
  const unit = options.t27 ? await t27Unit(id, UNITS[id]) : UNITS[id];
  const config = engine.config;
  const { maxRounds } = config.limits;
  engine.config.limits = { ...config.limits, maxCalls: config.limits.javitasMaxCalls ?? config.limits.maxCalls, stepTimeoutMs: unit.stepTimeoutMs ?? config.limits.stepTimeoutMs };
  // A PRESIDENT-döntéssel indított utólagos körök (fázisdöntés, utódöntés) saját keretet kapnak: a 80-as korlát az
  // automatikus láncra vonatkozik, egy kész egység későbbi javítása ne ütközzön bele.
  const decisionBudget = () => { engine.config.limits = { ...engine.config.limits, maxCalls: engine.config.limits.maxCalls + (config.limits.javitasDecisionCalls ?? 30) }; };
  const solverProvider = options.solver ?? config.assign?.SOLVER ?? null;
  const column = COLUMNS[unit.column];
  const pid = unit.p5Id;
  const lower = id.toLowerCase();
  const brief = await read(repoPath(options.brief ?? (options.t27 ? T27_BRIEF : DEFAULT_BRIEF)));
  const oldManuscript = await unit.manuscript();
  const teacher = await unit.teacher();
  let refs = '';
  for (const f of REFERENCES) refs += `\n\n${(await read(join(paths.references, f))).trim()}\n`;
  const estimate = estimateCalls(config, { solver: Boolean(solverProvider) });

  await engine.plan([
    { id: `${lower}-terv`, role: column.director, agent: agent(column.director).name, label: `${id} javítási terv (${column.director}) — NavE + UE` },
    { id: `${lower}-kezirat`, role: id, agent: agent(column.writer).name, label: `${id} új kézirat — PE ×${config.limits?.peRuns ?? 1} + NavE` },
    { id: `${lower}-megoldas`, role: 'MEGOLDASIRO', agent: agent('MEGOLDASIRO').name, label: `${id} megoldás — PE ×${config.limits?.peRuns ?? 1} + NavE + NyE + HE + UE${solverProvider ? ' + megoldó' : ''}` },
    { id: `${lower}-egyesites`, role: 'P5', agent: null, label: `${id} review-pass + P5-kapu` },
  ], { label: `Javítás — ${id} (${unit.title})`, week: 1, blocks: { [id]: 'PENDING' }, estimate });

  const header = phase => `# Megbízás — ${id} (${unit.title}), ${phase}, 1. hét — javítás\n\nHatókör: ${unit.scope}\n\nEbben a hívásban kizárólag a(z) ${id} egység ${phase} lépésén dolgozol.\n\n`;
  const base = [
    ['A javítási brief', brief],
    [`A meglévő kézirat (${unit.manuscriptSource})`, oldManuscript],
    ['A tanári kifogások erre az egységre', teacher],
    ['Referencia: mérce és példák (ehhez hasonlíts, és nevezd meg, melyik részéhez)', refs],
  ];
  const attach = list => list.map(([t, b]) => attachment(t, b)).join('');
  const result = (outcome, checks = {}) => ({ outcome, checks: { unit: id, estimate, ...checks } });

  // Fázisdöntés: ha egy fázis a körkeret miatt elakad (BLOCKED_DECISION_MAX_ROUNDS), és a PRESIDENT döntést írt a
  // decisions/<egység>-<fázis>-dontes.md fájlba, a szerző egy további kört kap a döntéssel és a nyitott jelentésekkel;
  // az ellenőrök recheck módban nézik (<fázis>-d1). Döntés nélkül a fázis elakad, és a jelentés megadja a fájl útját.
  // Ha a döntéses kör is elakad, újabb döntés írható: decisions/<egység>-<fázis>-d1-dontes.md → <fázis>-d1-d1 kör stb.
  const decided = async (phase, res, args) => {
    if (!res.blocked || res.blocked.outcome !== 'BLOCKED_DECISION_MAX_ROUNDS') return res;
    const file = join(engine.runDir, 'decisions', `${lower}-${phase}-dontes.md`);
    if (!existsSync(file)) return { ...res, blocked: { ...res.blocked, checks: { ...res.blocked.checks, decisionFile: file } } };
    const decision = await read(file);
    const open = (res.reviews ?? []).filter(r => !r.pass);
    // „ELFOGADVA: SOLVER, NavE” sor: a PRESIDENT a megnevezett ellenőrök nyitott jelzését elfogadja (pl. egy tanár által
    // jóváhagyott, változatlanul maradó utasításra tett megjegyzést); ha minden nyitott jelzés ilyen, nincs új kör.
    const accepted = (decision.match(/^\s*ELFOGADVA:\s*(.+)$/mi)?.[1] ?? '').split(/[,;\s]+/).filter(Boolean).map(x => x.toLowerCase());
    // 2026-11-15 (Áron): az irányítópulton vagy levélben elég annyi, hogy „elfogadom” (egyetlen szó az első sorban,
    // más utasítás nélkül): ez minden nyitott jelzést elfogad. Ha bármi más is van a válaszban, az utasításnak számít.
    const acceptAll = /^\s*elfogad(?:om|va)\s*[.!]?\s*$/i.test(decision.trim());
    if (open.length && (acceptAll || open.every(r => accepted.includes(r.name.toLowerCase())))) {
      engine.log(`▶ ${args.id}: a PRESIDENT elfogadta a nyitott jelzést (${open.map(r => r.name).join(', ')}); a fázis lezárva.`);
      return { text: res.text, id: res.id, rounds: res.rounds, rewrites: res.rewrites, accepted: open.map(r => r.name), decisionFile: file,
        reviews: res.reviews.map(r => (open.includes(r) ? { ...r, pass: true, acceptedByPresident: true } : r)) };
    }
    decisionBudget();
    const nextArgs = {
      ...args, id: `${args.id}-d1`, recheckFrom: res.reviews, baseline: res.text,
      requirement: [...args.requirement, ['A PRESIDENT döntése az elakadásról', decision]],
      author: {
        ...args.author, inputs: [res.id, 'PRESIDENT'],
        prompt: args.author.prompt + attachment('A korábbi válaszod (a javítási körök után elakadt)', res.text)
          + open.map(r => attachment(`${r.name} nyitott jelentése`, r.text)).join('')
          + attachment('A PRESIDENT döntése az elakadásról (ez az elsődleges)', decision) + PHASE_DECISION_NOTE,
        // A javítókörök alapmegbízása (ha van) is megkapja a döntést; a kiváltott előző válasz nélkül (lib/week.mjs).
        ...(args.author.revisionPrompt ? { revisionPrompt: args.author.revisionPrompt + attachment('A PRESIDENT döntése az elakadásról (ez az elsődleges)', decision) + PHASE_DECISION_NOTE } : {}),
      },
    };
    return decided(`${phase}-d1`, await reviewedStep(engine, nextArgs), { ...args, id: `${args.id}-d1` });
  };

  // 1. Javítási terv
  const planArgs = {
    id: `${lower}-terv`, maxRounds, requirement: base,
    author: { role: column.director, provider: providerFor(config, column.director), agent: agent(column.director), inputs: ['PRESIDENT'], prompt: header('javítási terv') + await assignment('TERV.md') + attach(base) },
    reviewers: [
      reviewer(engine, 'NavE', `${id} javítási terv`, 'a terv lefedi-e a briefet és minden tanári kifogást; megmarad-e a mérési cél, a feladattípus, az item-ID-k és a terjedelem; jó feladat készül-e, jó időben, jó módon.'),
      reviewer(engine, 'UE', `${id} javítási terv`, 'tanulói szemmel: érdekes, követhető, a terhelés arányos-e; egyértelmű lesz-e minden adat.'),
    ],
  };
  const plan = await decided('terv', await reviewedStep(engine, planArgs), planArgs);
  if (plan.blocked) return result(plan.blocked.outcome, { ...plan.blocked.checks, phase: 'terv' });

  // 2. Új kézirat (itt hat a PE négy köre és az újraírási szabály)
  const manuscriptReq = [...base, ['Az elfogadott javítási terv', plan.text]];
  const manuscriptArgs = {
    id: `${lower}-kezirat`, maxRounds, requirement: manuscriptReq,
    author: { role: id, provider: providerFor(config, 'iro'), agent: agent(column.writer), inputs: [plan.id], prompt: header('új kézirat') + await assignment('KEZIRAT.md') + attach(manuscriptReq) },
    reviewers: [
      reviewer(engine, 'PE', `${id} új kézirat`, 'mind a hat próba a teljes szövegre és az itemek stimulusára; a tanári kifogások valóban megszűntek-e, nem csak a jelölt mondatok cserélődtek; a célszint (B1+ → B2, mértékkel).'),
      reviewer(engine, 'NavE', `${id} új kézirat`, 'teljesség és megfelelés: a terv minden eleme és minden item-ID elkészült-e tényleges szöveggel; a mérési cél és a célalakok megmaradtak-e; van-e VÁLTOZÁSNAPLÓ tanári kifogásonként.'),
    ],
  };
  let manuscript = await decided('kezirat', await reviewedStep(engine, manuscriptArgs), manuscriptArgs);
  if (manuscript.blocked) return result(manuscript.blocked.outcome, { ...manuscript.blocked.checks, phase: 'kézirat' });

  // 3. Megoldás
  const files = { kezirat: `${pid}.kezirat.md`, megoldas: `${pid}.megoldas.md`, reviewPass: `${pid}.review-pass.md` };
  const liveSolution = unit.liveSolution ? await unit.liveSolution() : null;
  const solutionReqFor = text => [['Az elfogadott javítási terv', plan.text], ['A befagyasztott új kézirat', text],
    ...(liveSolution ? [['Az élesben futó megoldás és P5-blokk (T27-kör: ez az alap; az oldal- és item-ID-k, a kulcsok, az opciók, az elfogadott és elutasított alakok, a feedback-ID-k és minden, amit a T27 nem érint, betűre innen jön; csak a T27-szabály és a terv szerinti szövegek változnak)', liveSolution]] : [])];
  const solutionReq = solutionReqFor(manuscript.text);
  const megoldasAssignment = await assignment('MEGOLDAS.md');
  const solutionPromptFor = text => header('megoldás') + megoldasAssignment + attach(solutionReqFor(text))
    + (options.p5 === false ? '' : blockJsonRule({ blockId: pid, manuscriptFile: files.kezirat, solutionFile: files.megoldas })
      + `- A blokk típusa (\`kind\`): ${unit.kind}; hét: 1.\n`)
    + WEEK_LEARNER_VIEW_RULE;
  let solutionPrompt = solutionPromptFor(manuscript.text);
  const solutionAuthor = { role: 'MEGOLDASIRO', provider: providerFor(config, 'MEGOLDASIRO'), agent: agent('MEGOLDASIRO'), inputs: [manuscript.id], prompt: solutionPrompt };
  const solutionReviewers = [
    reviewer(engine, 'PE', `${id} itemek és megoldás`, 'a kész itemek szakmai érvényessége a szöveg, a kérdés és a végleges opciók/kritériumok együttesén; egyetlen jó válasz; mai, természetes francia az opciókban és a feedbackben.'),
    reviewer(engine, 'NavE', `${id} itemek és megoldás`, 'minden item-ID-hoz van-e teljes megoldási adat; a mérési cél egyezik-e a tervvel és a régi itemmel.'),
    reviewer(engine, 'NyE', `${id} itemek és megoldás`, 'francia nyelvhelyesség, jelentés, kollokáció, regiszter a szövegben és az itemekben; az elfogadott alternatívák teljessége.'),
    reviewer(engine, 'HE', `${id} itemek és megoldás`, 'francia és magyar helyesírás, tipográfia, házistílus.'),
    reviewer(engine, 'UE', `${id} itemek és megoldás`, 'megoldhatóság tanulóként, egyértelmű, de nem triviális választás; a feedback valóban segít.'),
    ...(solverProvider ? [{ name: 'SOLVER', solver: true, agent: agent('SOLVER'), provider: solverProvider }] : []),
  ];
  // patch: nagy megoldásnál (lib/csak-valtozas.mjs) a javító leadások csak a változást adják, a lánc összefésüli;
  // a fázisdöntés (-d1) és az eszkaláció utáni kör ezt az args-ból örökli.
  const solutionArgs = { id: `${lower}-megoldas`, maxRounds, requirement: solutionReq, author: solutionAuthor, reviewers: solutionReviewers, patch: true };
  let solution = await decided('megoldas', await reviewedStep(engine, solutionArgs), solutionArgs);
  const firstSolutionText = solution.text;

  // 3b. Eszkaláció (a 10-06-i full-javítás mintájára): ha a megoldásíró kéziratmódosítást utalt vissza (ESCALATED), a
  // szerző célzottan, csak az érintett itemeken javít; a PE (kettős futás) és az érintett ellenőrök csak a változást
  // nézik (recheck); a PE saját javaslatából átvett szöveget a NyE ellenőrzi; utána a megoldásíró folytat.
  // A PRESIDENT döntése (ha van): decisions/<egység>-eszkalacio<n>.md — a szerző és az ellenőrök is megkapják.
  const escScope = `${id} kézirat, eszkalált módosítások`;
  const manuscriptReviewers = {
    PE: reviewer(engine, 'PE', escScope, ESCALATION_FOCUS),
    NavE: reviewer(engine, 'NavE', escScope, `${ESCALATION_FOCUS} Az eszkaláció minden tétele (és a PRESIDENT döntése) átvezetve-e, és csak az?`),
    NyE: reviewer(engine, 'NyE', escScope, ESCALATION_FOCUS + NYE_OWN_PROPOSAL),
    UE: reviewer(engine, 'UE', escScope, `${ESCALATION_FOCUS} Tanulói szemmel: egyértelmű-e az új utasítás.`),
    HE: reviewer(engine, 'HE', escScope, ESCALATION_FOCUS),
  };
  const escalations = [];
  const firstSolutionRounds = solution.rounds;
  const maxEscalations = config.limits?.javitasEscalations ?? 1;
  // Utódöntés: a PRESIDENT egy kész egységre is adhat döntést (decisions/<egység>-eszkalacio<N>.md); ilyenkor a kör
  // visszautalt tétel nélkül, a keret (javitasEscalations) fölött is lefut.
  for (let n = 1; ; n += 1) {
    if (solution.blocked && solution.blocked.outcome !== 'BLOCKED_DECISION_MAX_ROUNDS') break;
    const decisionFile = join(engine.runDir, 'decisions', `${lower}-eszkalacio${n}.md`);
    const decision = existsSync(decisionFile) ? await read(decisionFile) : null;
    const parsed = parseEscalations(solution.text);
    if (!decision && (!parsed || n > maxEscalations)) break;
    if (decision) decisionBudget();
    const esc = parsed ?? { section: '(A megoldásíró nem utalt vissza tételt; a módosítás a PRESIDENT döntéséből jön, lásd alább.)', items: [] };
    const roles = escalationRoles(esc.items);
    const escReq = [
      ['A kézirat, amelyet célzottan módosítasz (az elfogadott változat)', manuscript.text],
      ['A megoldásíró visszautalt kéziratmódosításai (ESCALATED)', esc.section],
      ...(decision ? [['A PRESIDENT döntése az eszkalációkról (ez az elsődleges)', decision]] : []),
    ];
    // NyE a kéziratfázisban csak akkor, ha az eszkaláció az ő tételét hozza (11-15, 1. hét mérése: a megoldásfázis
    // NyE-je ugyanazt a szöveget úgyis újranézi, alwaysRecheck-kel).
    const kezRevs = ['PE', ...['NyE', 'NavE', 'UE', 'HE'].filter(r => roles.has(r) || manuscript.reviews?.some(x => x.name === r))].map(r => manuscriptReviewers[r]);
    const fixArgs = {
      id: `${lower}-kezirat-e${n}`, maxRounds, requirement: escReq, recheckFrom: manuscript.reviews, alwaysRecheck: roles.has('NyE') ? ['NyE'] : [],
      author: {
        role: id, provider: providerFor(config, 'iro'), agent: agent(column.writer), inputs: [manuscript.id, solution.id, ...(decision ? ['PRESIDENT'] : [])],
        prompt: header('célzott kéziratjavítás (eszkaláció)') + await assignment('ESZKALACIO.md') + attach(base.slice(0, 1)) + attach(escReq),
      },
      reviewers: kezRevs,
    };
    // A körkeret miatti elakadás itt is fázisdöntéssel folytatható: decisions/<egység>-kezirat-e<n>-dontes.md (11-02, U42).
    const fix = await decided(`kezirat-e${n}`, await reviewedStep(engine, fixArgs), fixArgs);
    const record = { n, items: esc.items.map(i => i.id), decision: decision ? decisionFile : null, kezirat: { id: fix.id ?? null, rounds: fix.rounds ?? null, reviewers: kezRevs.map(r => r.name) } };
    escalations.push(record);
    if (fix.blocked) return result(fix.blocked.outcome, { ...fix.blocked.checks, phase: `eszkaláció ${n}: kézirat`, escalations });
    manuscript = { ...manuscript, text: fix.text, id: fix.id, reviews: [...manuscript.reviews.filter(r => !fix.reviews.some(x => x.name === r.name)), ...fix.reviews] };

    // A megoldásíró folytat az új kézirattal, a korábbi megoldásából; recheck az érintettekkel (PE, NyE, megoldó és aki elakasztotta).
    const failingBefore = new Set((solution.reviews ?? []).filter(r => !r.pass).map(r => r.name));
    const solRevs = solutionReviewers.filter(r => ['PE', 'NyE', 'SOLVER'].includes(r.name) || failingBefore.has(r.name) || roles.has(r.name));
    solutionPrompt = solutionPromptFor(manuscript.text);
    const previous = solution;
    // Ha a P5-kapu ebben a futásban már átengedett egy blokkot, az új megoldáskör abból induljon (a szerkezete ne
    // romoljon el). Csak még le nem futott lépésnél: egy kész lépés megbízása nem változhat.
    // A csatolt blokk a lépés mellé mentődik (<lépés>.p5-alap.json): folytatáskor ugyanaz kerül a megbízásba.
    const passedBlock = join(engine.runDir, 'kimenet', `block.${pid}.json`);
    const baseFile = join(engine.runDir, 'steps', `${lower}-megoldas-e${n}.p5-alap.json`);
    if (!existsSync(baseFile) && !engine.state.steps[`${lower}-megoldas-e${n}`] && existsSync(passedBlock)) await writeFile(baseFile, await read(passedBlock));
    // A „teljes megoldás” megjegyzés csak új lépésbe kerül; a lépés mellé mentve, így a folytatás megbízása változatlan.
    const noteFile = join(engine.runDir, 'steps', `${lower}-megoldas-e${n}.teljes-megoldas.md`);
    if (!existsSync(noteFile) && !engine.state.steps[`${lower}-megoldas-e${n}`]) await writeFile(noteFile, FULL_SOLUTION_NOTE);
    const fullNote = existsSync(noteFile) ? await read(noteFile) : '';
    const fromPassed = existsSync(baseFile)
      ? attachment('A P5-kapun már átment BLOKK_JSON (ezt módosítsd; a szerkezetén, a mezőnevein és az ID-ken ne változtass)', await read(baseFile))
      : '';
    const escTail = attachment('A kézirat változásai az eszkaláció után', fix.text.split(/^## VÁLTOZÁSNAPLÓ/m)[1] ?? '(nincs változásnapló)')
      + (decision ? attachment('A PRESIDENT döntése az eszkalációkról', decision) : '')
      + fromPassed + CONTINUE_NOTE + fullNote;
    const solArgs = {
      // baseline: az új kör első leadása is teljességi próbát kap az előző, teljes megoldáshoz képest (U31, 11-04).
      id: `${lower}-megoldas-e${n}`, maxRounds, recheckFrom: previous.reviews, alwaysRecheck: ['NyE'], baseline: previous.text, patch: true,
      requirement: [...solutionReqFor(manuscript.text), ...(decision ? [['A PRESIDENT döntése az eszkalációkról', decision]] : [])],
      author: {
        ...solutionAuthor, inputs: [manuscript.id, previous.id],
        prompt: solutionPrompt + attachment('A korábbi megoldásod (ebből folytasd)', previous.text) + escTail,
        // A javítókörökben a korábbi megoldás helyett az aktuális változat a kiindulás (lib/week.mjs, U54 11-13).
        revisionPrompt: solutionPrompt + escTail,
      },
      reviewers: solRevs,
    };
    solution = await decided(`megoldas-e${n}`, await reviewedStep(engine, solArgs), solArgs);
    record.megoldas = { id: solution.id ?? null, rounds: solution.rounds ?? null, reviewers: solRevs.map(r => r.name) };
  }
  if (solution.blocked) return result(solution.blocked.outcome, { ...solution.blocked.checks, phase: escalations.length ? `eszkaláció ${escalations.length}: megoldás` : 'megoldás', escalations });

  // Végső teljességi próba: különbözeti („csak a változás”) kör nem lehet a végső megoldas.md (U31, 11-04: 419 CL-01).
  // Az összevetés az első, review-zott megoldással; ha a végsőből a még érvényes tanulói szövegek tömegesen kimaradtak,
  // a lánc megáll, mielőtt a P5-kapu vagy a kimenet elé kerülne. (A körönkénti próba ezt rendesen már korábban kiszűri.)
  const finalDrop = engine.dryRun ? null : await droppedLearnerTexts(firstSolutionText, solution.text);
  if (finalDrop?.diff) {
    return result('BLOCKED_INCOMPLETE_SOLUTION', {
      phase: 'egyesítés', step: solution.id, covered: finalDrop.covered, dropped: finalDrop.dropped.length, examples: finalDrop.dropped.slice(0, 5), escalations,
    });
  }

  // 4. Egyesítés: review-pass + P5-kapu
  // A megoldas.md függeléke: az utolsó review-zott változat BLOKK_JSON-beli tanulói szövegei, ahogy az ellenőrök 11-02
  // óta mellékletben olvassák (blockLearnerTexts). A nagy blokkoknál a szerző a szövegeket csak a JSON-ba írja, a
  // hűségkapu viszont a Markdownban keres (U33, 11-13: 1020 CL-01; Áron: „Lista a megoldásba”). A P5-javításban
  // átírt szöveg nincs a listában, az továbbra is fennakad.
  const record = reviewRecord(pid, { kezirat: files.kezirat, megoldas: files.megoldas, reviews: { Terv: plan.reviews, Kézirat: manuscript.reviews, Megoldás: solution.reviews }, supersedes: unit.supersedes ? await unit.supersedes() : [] });
  const manuscriptText = manuscript.text.split(/^## VÁLTOZÁSNAPLÓ/m)[0].trimEnd() + '\n';
  const chainFiles = [
    { file: files.reviewPass, text: record },
    { file: files.kezirat, text: manuscriptText },
    { file: files.megoldas, text: stripBlockJson(solution.text) + await reviewedTextsAppendix(solution.text) },
  ];
  const runOut = join(engine.runDir, 'kimenet');
  let gate = { outcome: 'P5_SKIPPED', rounds: 0, findings: [] };
  let finalSolution = solution.text;
  if (options.p5 !== false && !engine.dryRun) {
    gate = await p5Gate(engine, {
      blockId: pid, files: chainFiles, text: solution.text, maxRounds: config.limits.p5MaxRounds ?? maxRounds, outDir: runOut, reportFile: `p5-report.${pid}.json`,
      repair: async (findings, n) => {
        // A második eszkalációtól a P5-javítás saját lépésneveket kap (a korábbi körök kész lépései érvényesek maradnak).
        // Nagy megoldásnál (U33) a P5-javítás is csak a változást adja (lib/csak-valtozas.mjs), a lánc összefésüli.
        const patchP5 = needsPatchMode(finalSolution);
        const stepId = `${lower}${escalations.length > 1 ? `-e${escalations.length}` : ''}-p5-javitas${n}`;
        const r = await engine.step(stepId, {
          role: 'MEGOLDASIRO', provider: solutionAuthor.provider, agent: solutionAuthor.agent, inputs: [solution.id, 'P5'],
          prompt: solutionPrompt + (unit.p5Note ? attachment('A P5-leképezés frissítése (a megbízás fölött áll)', unit.p5Note) : '')
            + attachment('A korábbi válaszod', finalSolution)
            + attachment('P5-kapu findingok (javítsd a BLOKK_JSON-t; a kézirat és a megoldás szövege nem változhat)', findings)
            + attachment('A P5-referenciák', 'A munkamappádban megtalálod, olvasd el őket, és ezek szerint képezd le a blokkot (a tartalom nem változik):\n- `p5/schema/block.schema.json` (a séma);\n- `p5/examples/block.w01-u-2-1.json` (egy kész, kapun átment blokk mintája);\n- `p5/examples/order-page.w01-u-1-1-p23.json` (sorrendezős oldal mintája: a kulcs `choice` + `keyOptionIds`, a további helyes sorrendek `alternativeOrders`);\n- `p5/blocks/w01/block.w01-u-5-1.json` (átalakító itemek mintája: `CAP-transformation`, mondatonként külön item `text` válasszal);\n- `p5/playable-types.json` (a P1-katalógus: képességek és változatok, v2 rész).') + (patchP5 ? PATCH_RULE : '') + AUTHOR_FOOTER,
        });
        if (patchP5) {
          const file = join(engine.runDir, 'steps', `${stepId}.osszefesult.md`);
          if (r.cached && existsSync(file)) { finalSolution = await read(file); return finalSolution; }
          const merged = mergePatchedSolution(finalSolution, r.text);
          if (merged.errors.length) {
            // Nem fésülhető össze: a blokk marad, a következő kör ugyanazokat a findingokat kapja.
            engine.log(`! ${stepId}: a javításlista nem fésülhető össze (${merged.errors.join('; ')}), a blokk változatlan.`);
            return finalSolution;
          }
          if (merged.mode === 'patch') await writeFile(file, merged.text);
          finalSolution = merged.text;
          return finalSolution;
        }
        finalSolution = r.text;
        return r.text;
      },
    });
  }
  const changelog = extractSection(manuscript.text, 'VÁLTOZÁSNAPLÓ') ?? '(A szerző nem adott VÁLTOZÁSNAPLÓ szakaszt.)\n';
  const summary = {
    unit: id, p5Id: pid, runDir: engine.runDir, calls: engine.state.calls, estimate,
    rounds: { terv: plan.rounds, kezirat: manuscript.rounds, megoldas: firstSolutionRounds },
    rewrites: { kezirat: manuscript.rewrites, megoldas: solution.rewrites },
    escalations,
    p5: { outcome: gate.outcome, rounds: gate.rounds, errors: gate.findings.filter(f => f.severity === 'error').length },
  };
  if (engine.dryRun) return result('COMPLETED', { dryRun: true, ...summary });

  // Kimenet: a futásmappában mindig, a repó egységmappájában csak zöld P5-kapunál (vagy kikapcsolt P5-nél).
  await mkdir(runOut, { recursive: true });
  const outFiles = [...chainFiles, { file: 'VALTOZASNAPLO.md', text: `# ${id} — változásnapló\n\nRégi kézirat: ${unit.manuscriptSource}\nFutás: ${relative(paths.repo, engine.runDir).split('\\').join('/')}\n\n${changelog}` }, { file: 'futas.json', text: `${JSON.stringify(summary, null, 2)}\n` }];
  for (const f of outFiles) await writeFile(join(runOut, f.file), f.text);
  const ok = gate.outcome === 'P5_PASS' || gate.outcome === 'P5_SKIPPED';
  if (!ok) return result('BLOCKED_P5_GATE', { ...summary, errors: gate.findings.filter(f => f.severity === 'error').slice(0, 20), kimenet: runOut });
  const outDir = repoPath(options.out ?? (options.t27 ? join(OUT_ROOT, id, T27_SUBDIR) : join(OUT_ROOT, id)));
  await mkdir(outDir, { recursive: true });
  for (const f of outFiles) await writeFile(join(outDir, f.file), f.text);
  if (gate.file && existsSync(gate.file)) await writeFile(join(outDir, `block.${pid}.json`), await read(gate.file));
  return result('COMPLETED', { ...summary, kimenet: outDir });
}
