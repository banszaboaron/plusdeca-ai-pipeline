// A pilotláncok. Mindhárom a meglévő szerepcsomagokból és pilotfájlokból dolgozik.
//
//  replay-pe02  — a PE ugyanazt a kézi GI1-3 első választ kapja, mint a kézi PE-02 próbában
//                 → közvetlenül összevethető a kézi PE-02 eredményével.
//  replay-gi1-4 — a GI1-4 ugyanazt a befagyasztott SOLUTIONS-INPUT-v1 bemenetet kapja
//                 → a hat várt kulcs gépileg ellenőrizhető; opcionálisan független megoldó is fut.
//  full         — friss lánc: GI1-3 ír → PE ellenőriz → legfeljebb N javítási kör → GI1-4 megoldás
//                 → opcionálisan független megoldó.

import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { paths } from './paths.mjs';
import { registerHelpRequest } from './help.mjs';
import {
  AUTHOR_FOOTER, LEARNER_VIEW_RULE, REVIEW_FOOTER, attachment, extractHelpRequest, extractLearnerView, extractPages,
  extractQuestion, insertBeforeFooter, replaceAssignment, stripAuthorNotes,
} from './packets.mjs';
import { isAbsolute } from 'node:path';
import { checkExpectedKeys, isPass, knownIssueHints, parseSolverSummary } from './verdict.mjs';
import { blocks } from '../../starter-kits/roles.mjs';
import { buildAgents } from './agent-defs.mjs';
import { BLOCK_JSON_RULE, p5BlockId, p5Gate, stripBlockJson } from './p5.mjs';

export { paths };

const read = p => readFile(p, 'utf8');

/** A hat item várt kulcsa a SOLUTIONS-INPUT-v1 bemeneten (a pilot értékelőlapja szerint). */
export const EXPECTED_KEYS = [
  { item: 'GI1-P04-I01', answer: 'avons pris' },
  { item: 'GI1-P04-I02', answer: 'a vu' },
  { item: 'GI1-P04-I03', answer: 'ont fait' },
  { item: 'GI1-P05-I01', answer: 'avons pris' },
  { item: 'GI1-P05-I02', answer: 'ai vu' },
  { item: 'GI1-P05-I03', answer: 'ont fait' },
];

/** A kézi PE-02 első kör által talált hibák (pe02-round1/ERTEKELES.md), kulcsszavas jelzéshez. */
export const PE02_KNOWN_ISSUES = [
  { id: 'PE02-F01', description: 'P02/P04/P05 túlzott helyzet- és mondatismétlése', keywords: ['ismétl', 'változatos', 'demi-tour', 'visite guidée', 'szó szerint'] },
  { id: 'PE02-F02', description: 'voir-specifikus ismétlés', keywords: ['voir', ' vu '] },
  { id: 'PE02-F03', description: 'nézőpontváltás (vous → nous) / imparfait az instrukcióban', keywords: ['nézőpont', 'imparfait', 'vous', 'nous'] },
];

/** A kézi GI1-4 próba koordinátori findingjai (gi1-4-round1/ERTEKELES.md). */
export const GI14_KNOWN_ISSUES = [
  { id: 'SOL-F01', description: 'P04-I03: a mérési cél (kollokáció) és az opciók eltérnek', keywords: ['kollokáció', 'randonnée', 'mérési cél'] },
  { id: 'SOL-F02', description: 'P04-I02: kevéssé hihető jelentéses distractor', keywords: ['dauphin', 'distractor', 'hihető'] },
];

/** A kézi 2. kör (gi1-3-round2 → pe02-round2) fennmaradt és új hibái, kulcsszavas jelzéshez. */
export const ROUND2_KNOWN_ISSUES = [
  { id: 'PE02-F01-rest', description: 'a P02 „visite guidée” példája előre modellezi a P04-I03 alakját (ismétlés részben maradt)', keywords: ['visite guidée', 'kollokáció', 'előre modellez'] },
  { id: 'PE02-F04', description: 'a javított P04-I03 kérdése kimondja a keresett alakot (ont fait) — válaszszivárgás', keywords: ['szivárg', 'elárul', 'ont fait'] },
];

/** A pilotlánc szerepei agent-módban (--roles agent). */
export const PILOT_AGENTS = {
  'GI1-3': 'plusdeca-g-iro',
  PE: 'plusdeca-pe',
  'GI1-4': 'plusdeca-megoldasiro',
  SOLVER: 'plusdeca-solver',
};

let agentCache = null;
export function agentFor(role, options = {}) {
  if (options.roles !== 'agent') return undefined;
  agentCache ??= new Map(buildAgents().map(a => [a.name, a]));
  const agent = agentCache.get(PILOT_AGENTS[role]);
  if (!agent) throw new Error(`Nincs agent a(z) ${role} szerephez.`);
  return agent;
}

/** A szöveg a jelölőtől a végéig; ha nincs jelölő, megáll (a pilotfájl szerkezete megváltozott). */
export function tailFrom(text, marker) {
  const i = text.indexOf(marker);
  if (i < 0) throw new Error(`Nem található a jelölő: ${marker}`);
  return text.slice(i);
}

/** Blokk- és fázisfejléc az agent-módú megbízások elejére. */
export function blockHeader(blockId, phaseName) {
  const block = blocks.find(([id]) => id === blockId);
  if (!block) throw new Error(`Ismeretlen blokk: ${blockId}`);
  const [, position, title, , notes] = block;
  return `# Megbízás — ${blockId} (${position}, ${title}), ${phaseName} fázis\n\nBlokksajátosság: ${notes}\n\nEbben a hívásban kizárólag a(z) ${blockId} blokk ${phaseName} fázisán dolgozol, az alábbi megbízás és mellékletek szerint.\n\n`;
}

/**
 * A megoldónak szánt tanulói nézet: a megoldásíró TANULOI_NEZET blokkja (opciókkal, kulcs nélkül),
 * ennek hiányában a kézirat szerzői megjegyzések nélkül (ekkor a választós itemek opciói hiányoznak).
 */
export function solverSheet(solutionText, fallbackText) {
  const view = solutionText ? extractLearnerView(solutionText) : null;
  return view
    ? { sheet: view, source: 'a megoldásíró tanulói nézete (opciókkal)' }
    : { sheet: stripAuthorNotes(fallbackText), source: 'a kézirat szerzői megjegyzések nélkül — OPCIÓK NÉLKÜL (a megoldásíró nem adott tanulói nézetet)' };
}

/** A független megoldó lépése: agent-módban csak a feladatlap megy, a szerepleírás az agentből jön. */
async function solverStep(options, learnerView) {
  const agent = agentFor('SOLVER', options);
  const sheet = attachment('A tanuló által látott feladatlap', learnerView);
  return {
    role: 'SOLVER', provider: options.solver, kind: 'solver', agent,
    prompt: agent ? sheet.trimStart() : (await read(join(paths.assignments, 'SOLVER-AUTO.md'))) + sheet,
  };
}

/**
 * A PE referenciakészlete (../references). „merce”: szintmérce, feladattípus-mérce, forráskatalógus;
 * „teljes”: ezek és a pilot jó/rossz példái. A replay-pe02 próbában csak a mérce mehet (a példák a mért hibák).
 */
export const REFERENCE_SETS = {
  merce: ['MERCE-SZINT.md', 'MERCE-FELADATTIPUSOK.md', 'FORRASKATALOGUS.md'],
  teljes: ['MERCE-SZINT.md', 'MERCE-FELADATTIPUSOK.md', 'PELDAK-PILOT.md', 'FORRASKATALOGUS.md'],
};

export async function referenceAttachment(set) {
  if (!set) return '';
  const files = REFERENCE_SETS[set];
  if (!files) throw new Error(`Ismeretlen referenciakészlet: ${set}. Választható: ${Object.keys(REFERENCE_SETS).join(', ')}`);
  let text = '';
  for (const f of files) text += `\n\n${(await read(join(paths.references, f))).trim()}\n`;
  return attachment('Referenciaanyag (a Plusdeça mércéje; ehhez hasonlíts, és nevezd meg, melyik részéhez)', text);
}

export { resolveHelpAnswer } from './help.mjs';

/**
 * Egy lépés segítségkéréssel: ha a szerep SEGITSEGKERES blokkot ad (a saját keresése nem hozott forrást), a CEO
 * nyilvántartja és — ha erre a forrásra még nem kértek — értesíti a PRESIDENT-et, de NEM vár: a szerep
 * tartaléktervvel leadott válasza érvényes, a lánc megy tovább. A később érkező válasz (decisions/segitseg-<n>.md)
 * minden további hívás promptjába bekerül (lásd lib/help.mjs), így a következő kör már az anyaggal dolgozik.
 */
export async function helpedStep(engine, id, args) {
  const r = { ...(await engine.step(id, args)), id };
  // A 10-28 előtti kód a válasz után <lépés>-segitseg néven újrafuttatta a lépést; folytatáskor az az eredmény
  // számít (a későbbi lépések megbízásai arra épültek).
  const legacy = engine.state.steps[`${id}-segitseg`];
  if (r.cached && legacy?.status === 'DONE') {
    return { text: await read(join(engine.runDir, 'steps', `${id}-segitseg.out.md`)), summary: legacy.summary, cached: true, id: `${id}-segitseg` };
  }
  const request = extractHelpRequest(r.text);
  if (!request || engine.dryRun || r.cached) return r;
  return { ...r, helpRequest: { request, ...(await registerHelpRequest(engine, id, request)) } };
}

const DECISION_NOTE = '\n\n# Folytatás a döntés után\n\nA fenti megbízást végezd el a PRESIDENT döntése szerint. Ha a döntés után is marad olyan kérdés, amelyet csak ő dönthet el, ismét BLOCKED_DECISION státusszal jelezd.\n';

/**
 * Szerzői lépés döntési kapuval. Ha a szerző BLOCKED_DECISION-t jelez, a lánc megáll, és a kérdést
 * a jelentésbe teszi. A felhasználó a döntést a futásmappa decisions/<lépés>.md fájljába írja; ugyanazzal
 * a --run-dir értékkel újraindítva a kész lépések nem futnak újra, a szerző pedig a döntéssel folytatja.
 */
export async function authorStep(engine, id, args, { onDecision } = {}) {
  const r = await helpedStep(engine, id, args);
  if (!r.summary) return { ...r, blocked: { outcome: 'BLOCKED_UNPARSEABLE_AUTHOR', checks: { step: id } } };
  if (r.summary.status !== 'BLOCKED_DECISION' || engine.dryRun) return r;
  const decisionFile = join(engine.runDir, 'decisions', `${id}.md`);
  const question = extractQuestion(r.text);
  // A döntés jöhet a helyi fájlból vagy (ha be van állítva) a projektkövetőről; a CEO a beállított ideig vár rá.
  const decision = existsSync(decisionFile)
    ? await read(decisionFile)
    : await engine.waitForDecision({ step: id, question });
  if (!decision?.trim()) {
    return { ...r, blocked: { outcome: 'BLOCKED_DECISION', checks: { step: id, question, decisionFile } } };
  }
  if (onDecision) return onDecision({ decision, question, previous: r });
  const base = args.prompt.endsWith(AUTHOR_FOOTER) ? args.prompt.slice(0, -AUTHOR_FOOTER.length) : args.prompt;
  const next = await authorStep(engine, `${id}-dontes`, {
    ...args,
    inputs: [id, 'PRESIDENT'],
    prompt: base
      + attachment('A korábbi válaszod (döntésre várt)', r.text)
      + attachment('A PRESIDENT döntése', decision)
      + DECISION_NOTE + AUTHOR_FOOTER,
  });
  // A meghozott döntés a hívóhoz is eljut: a lépés későbbi körei (pl. a teljes újraleadás) is megkapják (U41, 11-04).
  return { ...next, decisions: [{ step: id, text: decision }, ...(next.decisions ?? [])] };
}

async function rolePacket(roleId, assignment) {
  return replaceAssignment(await read(join(paths.packages, `${roleId}.md`)), assignment);
}

/**
 * P5 heti építés a lánc végén (P5-07): a terv blokkjai → kapuk → v2 csomag → előnézet + bejárás → ledger.
 * Zöldnél COMPLETED (a ledger RELEASED-et ír; közzététel nincs bekötve), egyébként P5_<állapot>, értesítéssel.
 */
export async function p5Week(engine, options = {}) {
  const { buildWeek } = await import(pathToFileURL(join(paths.repo, 'p5', 'week-build.mjs')).href);
  const plan = options.plan ? (isAbsolute(options.plan) ? options.plan : join(paths.repo, options.plan)) : join(paths.repo, 'p5', 'weeks', 'week-01.plan.json');
  const out = options.out ? (isAbsolute(options.out) ? options.out : join(paths.repo, options.out)) : join(paths.repo, 'p5', 'out');
  await engine.plan([{ id: 'p5-het', role: 'P5', agent: null, label: 'P5 heti építés (kapuk, fordítás, bejárás, ledger)' }], { label: 'P5 heti építés', week: null, blocks: {} });
  if (engine.dryRun) return { outcome: 'COMPLETED', checks: { plan, out, dryRun: true } };
  const { status, report } = await buildWeek(plan, { out, crawl: options.crawl !== false });
  const errors = Object.values(report.steps).flatMap(step => step.findings || []).filter(f => f.severity === 'error');
  const checks = { plan, out, status, week: report.week, contentVersion: report.contentVersion ?? null, errors: errors.length, firstErrors: errors.slice(0, 20) };
  await writeFile(join(engine.runDir, 'p5-week-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  return { outcome: status === 'RELEASED' ? 'COMPLETED' : `P5_${status}`, checks };
}

export const PIPELINES = {
  'p5-het': p5Week,
  // A heti lánc (FR → rendezők → blokkonként 4 fázis → P5): lib/week.mjs.
  het: async (engine, options) => (await import('./week.mjs')).weekPipeline(engine, options),
  // Meglévő egység javítása (terv → új kézirat → megoldás → review-pass + P5): lib/javitas.mjs.
  javitas: async (engine, options) => (await import('./javitas.mjs')).javitasPipeline(engine, options),

  async 'replay-pe02'(engine, options = {}) {
    const packet = await read(join(paths.quality, 'PE-02-TESZT.md'));
    const agent = agentFor('PE', options);
    // Agent-módban a szerepcsomag helyett az agent szerepleírása megy; a megbízás és a mellékletek azonosak.
    const prompt = agent
      ? `${await read(join(paths.quality, 'PE-02-MEGBIZAS.md'))}\n\n${tailFrom(packet, '# Melléklet 1 — Az író eredeti megbízása')}`
      : packet;
    if (options.ref === 'teljes') throw new Error('A replay-pe02 próbában a pilotpéldák nem mehetnek a PE-nek (pont a mért hibákat tartalmazzák). Használd: --ref merce');
    const pe = await helpedStep(engine, 'pe02', { role: 'PE', provider: engine.config.assign.PE, kind: 'review', agent, prompt: prompt + await referenceAttachment(options.ref) + REVIEW_FOOTER });
    const manual = await read(join(paths.quality, 'results', 'pe02-round1', 'response.txt'));
    return {
      outcome: 'COMPLETED',
      checks: {
        knownIssues: knownIssueHints(pe.text, PE02_KNOWN_ISSUES),
        manualKnownIssues: knownIssueHints(manual, PE02_KNOWN_ISSUES),
        summary: pe.summary,
      },
      compare: [{ automatic: 'steps/pe02.out.md', manual: 'starter-kits/pilot/quality/results/pe02-round1/response.txt' }],
    };
  },

  async 'replay-gi1-4'(engine, options) {
    const packet = await read(join(paths.quality, 'GI1-4-TESZT.md'));
    const agent = agentFor('GI1-4', options);
    const prompt = agent
      ? blockHeader('GI1', 'Megoldás') + `${await read(join(paths.quality, 'GI1-4-MEGBIZAS.md'))}\n\n${tailFrom(packet, '# SOLUTIONS-INPUT-v1')}`
      : packet;
    const gi = await engine.step('gi1-4', { role: 'GI1-4', provider: engine.config.assign['GI1-4'], agent, prompt: prompt + LEARNER_VIEW_RULE + AUTHOR_FOOTER });
    const checks = {
      expectedKeys: checkExpectedKeys(gi.text, EXPECTED_KEYS),
      knownIssues: knownIssueHints(gi.text, GI14_KNOWN_ISSUES),
    };
    if (options.solver) {
      const { sheet, source } = solverSheet(gi.text, await read(join(paths.quality, 'SOLUTIONS-INPUT-v1.md')));
      const solver = await engine.step('solver', await solverStep(options, sheet));
      checks.solverKeys = checkExpectedKeys(solver.text, EXPECTED_KEYS);
      checks.solverInput = source;
    }
    return {
      outcome: 'COMPLETED', checks,
      compare: [{ automatic: 'steps/gi1-4.out.md', manual: 'starter-kits/pilot/quality/results/gi1-4-round1/response.txt' }],
    };
  },

  /**
   * replay-javitas: a javulás mérése a kézi körrel azonos bemeneten. Az író a saját kézi első válaszát
   * (gi1-3-round1) és a kézi PE-02 jelentést (pe02-round1) kapja → javít → a PE célzottan újraellenőriz.
   * Összevetendő a kézi gi1-3-round2 / pe02-round2 körrel. 2 hívás.
   */
  async 'replay-javitas'(engine, options = {}) {
    if (options.ref === 'teljes') throw new Error('A replay-javitas próbában a pilotpéldák nem mehetnek ki (a mért hibákat tartalmazzák). Használd: --ref merce');
    const brief = await read(join(paths.quality, 'GI1-3-BEMENET.md'));
    const firstDraft = await read(join(paths.quality, 'results', 'gi1-3-round1', 'response.txt'));
    const peReport = await read(join(paths.quality, 'results', 'pe02-round1', 'response.txt'));
    const writerAgent = agentFor('GI1-3', options);
    const peAgent = agentFor('PE', options);
    const writerPacket = writerAgent ? blockHeader('GI1', 'Kézirat') + brief : await read(join(paths.quality, 'GI1-3-TESZT.md'));
    await engine.plan([
      { id: 'gi1-3-rev1', role: 'GI1-3', agent: writerAgent?.name ?? null, label: 'Javítás a kézi PE-02 jelentés alapján' },
      { id: 'pe-recheck1', role: 'PE', agent: peAgent?.name ?? null, label: 'Célzott recheck' },
    ], { test: true, label: 'Javítási próba (TESZT-W07, GI1) — összevetés a kézi 2. körrel', week: null, blocks: {} });
    const refs = await referenceAttachment(options.ref);
    const revision = await authorStep(engine, 'gi1-3-rev1', {
      role: 'GI1-3', provider: engine.config.assign['GI1-3'], agent: writerAgent, inputs: ['gi1-3-round1', 'pe02-round1'],
      prompt: writerPacket
        + attachment('Javítási megbízás', await read(join(paths.assignments, 'GI1-3-JAVITAS-AUTO.md')))
        + attachment('A saját korábbi válaszod', firstDraft)
        + attachment('A PE jelentése', peReport)
        + refs + AUTHOR_FOOTER,
    });
    if (revision.blocked) return revision.blocked;
    let recheckPrompt = peAgent ? await read(join(paths.assignments, 'PE-RECHECK-AUTO.md')) : await rolePacket('PE', await read(join(paths.assignments, 'PE-RECHECK-AUTO.md')));
    for (const [title, body] of [
      ['Melléklet 1 — Az író eredeti megbízása (csak követelményforrás)', brief],
      ['Melléklet 2 — A korábbi PE-jelentésed', peReport],
      ['Melléklet 3 — Az író javított válasza', revision.text],
    ]) recheckPrompt += attachment(title, body);
    const recheck = await helpedStep(engine, 'pe-recheck1', {
      role: 'PE', provider: engine.config.assign.PE, kind: 'review', agent: peAgent, inputs: ['gi1-3-rev1', 'pe02-round1'],
      prompt: recheckPrompt + refs + REVIEW_FOOTER,
    });
    const manualRecheck = await read(join(paths.quality, 'results', 'pe02-round2', 'response.txt'));
    return {
      outcome: 'COMPLETED',
      checks: {
        recheck: recheck.summary,
        // A javítás után a PE megtalálja-e a kézi 2. körben talált fennmaradt/új hibákat (ha a szerző újra elköveti őket).
        knownIssues: knownIssueHints(recheck.text, ROUND2_KNOWN_ISSUES),
        manualKnownIssues: knownIssueHints(manualRecheck, ROUND2_KNOWN_ISSUES),
        // A javított kéziratban marad-e a kézi 1. kör ismétlése (demi-tour) — jelzés, nem ítélet.
        revisionRepeats: knownIssueHints(revision.text, [{ id: 'demi-tour', description: 'a kézi 1. kör szó szerinti ismétlése', keywords: ['demi-tour'] }]),
      },
      compare: [
        { automatic: 'steps/gi1-3-rev1.out.md', manual: 'starter-kits/pilot/quality/results/gi1-3-round2/response.txt' },
        { automatic: 'steps/pe-recheck1.out.md', manual: 'starter-kits/pilot/quality/results/pe02-round2/response.txt' },
      ],
    };
  },

  async full(engine, options) {
    const { maxRounds } = engine.config.limits;
    const brief = await read(join(paths.quality, 'GI1-3-BEMENET.md'));
    const writerAgent = agentFor('GI1-3', options);
    const peAgent = agentFor('PE', options);
    const solutionAgent = agentFor('GI1-4', options);
    // Csomag-módban a teljes szerepcsomag + megbízás; agent-módban blokkfejléc + ugyanaz a megbízás.
    const writerPacket = writerAgent
      ? blockHeader('GI1', 'Kézirat') + brief
      : await read(join(paths.quality, 'GI1-3-TESZT.md'));
    const plan = [
      { id: 'gi1-3', role: 'GI1-3', agent: writerAgent?.name ?? null, label: 'Kézirat (író)' },
      { id: 'pe-r1', role: 'PE', agent: peAgent?.name ?? null, label: 'Szakmai ellenőrzés' },
      { id: 'gi1-4', role: 'GI1-4', agent: solutionAgent?.name ?? null, label: 'Megoldás (megoldásíró)' },
      ...(options.solver ? [{ id: 'solver', role: 'SOLVER', agent: agentFor('SOLVER', options)?.name ?? null, label: 'Független megoldó' }] : []),
    ];
    await engine.plan(plan, { test: true, label: 'Minőségpróba (TESZT-W07, GI1 részlet) — nem valódi heti tartalom', week: null, blocks: {} });
    const writer = await authorStep(engine, 'gi1-3', { role: 'GI1-3', provider: engine.config.assign['GI1-3'], agent: writerAgent, inputs: ['megbízás'], prompt: writerPacket + await referenceAttachment(options.ref) + AUTHOR_FOOTER });

    const refs = await referenceAttachment(options.ref);
    const pePacket = async (assignmentPath, parts) => {
      let prompt = peAgent ? await read(assignmentPath) : await rolePacket('PE', await read(assignmentPath));
      for (const [title, body] of parts) prompt += attachment(title, body);
      return prompt + refs + REVIEW_FOOTER;
    };

    if (writer.blocked) return writer.blocked;
    let draft = writer.text;
    let draftId = writer.id;
    let review = await helpedStep(engine, 'pe-r1', {
      role: 'PE', provider: engine.config.assign.PE, kind: 'review', agent: peAgent, inputs: [draftId],
      prompt: await pePacket(join(paths.quality, 'PE-02-MEGBIZAS.md'), [
        ['Melléklet 1 — Az író eredeti megbízása (csak követelményforrás)', brief],
        ['Melléklet 2 — A vizsgálandó írói válasz, változatlanul', draft],
      ]),
    });

    let reviewId = 'pe-r1';
    let round = 0;
    let minorRounds = 0;
    // PASS mellett a minor findingok is visszamennek a szerzőhöz (legfeljebb limits.minorRounds körben, alap 1,
    // a maxRounds kereten belül); ami utána marad, az a jelentésbe kerül (openMinor).
    const minorBudget = engine.config.limits.minorRounds ?? 1;
    const wantsMinorRound = summary => isPass(summary) && summary.minor > 0 && minorRounds < minorBudget && round < maxRounds;
    while (!isPass(review.summary) || wantsMinorRound(review.summary)) {
      if (!review.summary) return { outcome: 'BLOCKED_UNPARSEABLE_REVIEW', checks: { round } };
      if (review.summary.verdict === 'BLOCKED_EVIDENCE') return { outcome: 'BLOCKED_EVIDENCE', checks: { round } };
      if (round >= maxRounds) return { outcome: 'BLOCKED_DECISION_MAX_ROUNDS', checks: { round, lastReview: review.summary } };
      if (isPass(review.summary)) minorRounds += 1;
      round += 1;
      const revision = await authorStep(engine, `gi1-3-rev${round}`, {
        role: 'GI1-3', provider: engine.config.assign['GI1-3'], agent: writerAgent, inputs: [reviewId, draftId],
        prompt: writerPacket
          + attachment('Javítási megbízás', await read(join(paths.assignments, 'GI1-3-JAVITAS-AUTO.md')))
          + attachment('A saját korábbi válaszod', draft)
          + attachment('A PE jelentése', review.text)
          + AUTHOR_FOOTER,
      });
      if (revision.blocked) return { ...revision.blocked, checks: { ...revision.blocked.checks, round } };
      draft = revision.text;
      const previousReviewId = reviewId;
      draftId = revision.id;
      reviewId = `pe-recheck${round}`;
      review = await helpedStep(engine, reviewId, {
        role: 'PE', provider: engine.config.assign.PE, kind: 'review', agent: peAgent, inputs: [draftId, previousReviewId],
        prompt: await pePacket(join(paths.assignments, 'PE-RECHECK-AUTO.md'), [
          ['Melléklet 1 — Az író eredeti megbízása (csak követelményforrás)', brief],
          ['Melléklet 2 — A korábbi PE-jelentésed', review.text],
          ['Melléklet 3 — Az író javított válasza', draft],
        ]),
      });
    }

    const solutionsPrompt = async (pagesText, extra = '') => (solutionAgent
      ? blockHeader('GI1', 'Megoldás') + await read(join(paths.assignments, 'GI1-4-MEGBIZAS-AUTO.md'))
      : await rolePacket('GI1-4', await read(join(paths.assignments, 'GI1-4-MEGBIZAS-AUTO.md'))))
      + attachment('Befagyasztott tanulói és szerzői bemenet (a PE által elfogadott írói változat)', pagesText)
      + extra
      + await referenceAttachment(options.ref)
      + '\n\n# Most végrehajtandó feladat\n\nVégezd el a megoldáskidolgozást a fenti megbízás szerint.\n'
      + (options.p5 ? BLOCK_JSON_RULE : '')
      + LEARNER_VIEW_RULE + AUTHOR_FOOTER;

    let pages = extractPages(draft);
    // Ha a megoldásíró döntést kér, a döntés először a kézirat szerzőjéhez megy: ha a kéziratot módosítani
    // kell, ő módosít, a PE célzottan újraellenőriz, és a megoldásíró az új kéziraton, a döntés ismeretében
    // dolgozik tovább. Ha a kézirat változatlan, a megoldásíró a régi kéziraton, a döntéssel folytatja.
    const onSolutionsDecision = async ({ decision, question }) => {
      const decisionParts = attachment('A megoldásíró döntési kérdése', question) + attachment('A PRESIDENT döntése', decision);
      const fix = await authorStep(engine, 'gi1-3-megoldas-dontes', {
        role: 'GI1-3', provider: engine.config.assign['GI1-3'], agent: writerAgent, inputs: ['gi1-4', 'PRESIDENT', draftId],
        prompt: writerPacket
          + attachment('Javítási megbízás', await read(join(paths.assignments, 'GI1-3-DONTES-AUTO.md')))
          + attachment('A saját kéziratod (befagyasztott változat)', pages)
          + decisionParts
          + AUTHOR_FOOTER,
      });
      if (fix.blocked) return fix;
      if (!/^\s*KEZIRAT_VALTOZATLAN/m.test(fix.text)) {
        draft = fix.text;
        draftId = fix.id;
        const recheck = await helpedStep(engine, 'pe-megoldas-dontes', {
          role: 'PE', provider: engine.config.assign.PE, kind: 'review', agent: peAgent, inputs: [draftId, reviewId],
          prompt: await pePacket(join(paths.assignments, 'PE-RECHECK-AUTO.md'), [
            ['Melléklet 1 — Az író eredeti megbízása (csak követelményforrás)', brief],
            ['Melléklet 2 — A korábbi PE-jelentésed', review.text],
            ['Melléklet 3 — A megoldásíró kérdése és a PRESIDENT döntése', `${question}\n\nDöntés:\n${decision}`],
            ['Melléklet 4 — Az író döntés utáni javított kézirata', draft],
          ]),
        });
        if (!isPass(recheck.summary)) {
          return { blocked: { outcome: 'BLOCKED_DECISION_REVIEW', checks: { step: 'pe-megoldas-dontes', review: recheck.summary } } };
        }
        pages = extractPages(draft);
      }
      return authorStep(engine, 'gi1-4-dontes', {
        role: 'GI1-4', provider: engine.config.assign['GI1-4'], agent: solutionAgent, inputs: [draftId, 'PRESIDENT'],
        prompt: await solutionsPrompt(pages, decisionParts + DECISION_NOTE),
      });
    };
    let solutions = await authorStep(engine, 'gi1-4', {
      role: 'GI1-4', provider: engine.config.assign['GI1-4'], agent: solutionAgent, inputs: [draftId],
      prompt: await solutionsPrompt(pages),
    }, { onDecision: onSolutionsDecision });
    if (solutions.blocked) return { ...solutions.blocked, checks: { ...solutions.blocked.checks, rounds: round } };
    const checks = { rounds: round, minorRounds, openMinor: review.summary?.minor ?? 0 };

    if (options.solver) {
      // A független megoldó problémái visszamennek: szerző (kézirat) → PE-recheck, ha a kézirat változott →
      // megoldásíró (a megoldó jelentésével) → megoldó újra. COMPLETED csak üres problémalistánál;
      // limits.solverRounds (alap 1) kör után megáll emberi döntésre.
      const solverBudget = engine.config.limits.solverRounds ?? 1;
      let solverRound = 0;
      const runSolver = async id => {
        const { sheet, source } = solverSheet(solutions.text, pages);
        const result = await engine.step(id, { ...(await solverStep(options, sheet)), inputs: [solutions.id ?? 'gi1-4'] });
        checks.solverInput = source;
        return { ...result, id, solverSummary: parseSolverSummary(result.text) };
      };
      let solver = await runSolver('solver');
      while (true) {
        if (engine.dryRun) break;
        if (!solver.solverSummary) return { outcome: 'BLOCKED_UNPARSEABLE_SOLVER', checks: { ...checks, step: solver.id } };
        checks.solverProblems = solver.solverSummary.problems;
        if (solver.solverSummary.problems === 0) break;
        if (solverRound >= solverBudget) {
          return { outcome: 'BLOCKED_SOLVER_FINDINGS', checks: { ...checks, solverRounds: solverRound, step: solver.id } };
        }
        solverRound += 1;
        const solverReport = attachment('A független megoldó jelentése (tanulói nézetből, kulcs nélkül)', solver.text);
        const fix = await authorStep(engine, `gi1-3-megoldo${solverRound}`, {
          role: 'GI1-3', provider: engine.config.assign['GI1-3'], agent: writerAgent, inputs: [solver.id, solutions.id ?? 'gi1-4', draftId],
          prompt: writerPacket
            + attachment('Javítási megbízás', await read(join(paths.assignments, 'GI1-3-MEGOLDO-AUTO.md')))
            + attachment('A saját kéziratod (befagyasztott változat)', pages)
            + attachment('A megoldásíró kulcsa és megoldása', stripBlockJson(solutions.text))
            + solverReport
            + AUTHOR_FOOTER,
        });
        if (fix.blocked) return { ...fix.blocked, checks: { ...checks, ...fix.blocked.checks, solverRounds: solverRound } };
        if (!/^\s*KEZIRAT_VALTOZATLAN/m.test(fix.text)) {
          const previousReview = review;
          draft = fix.text;
          draftId = fix.id;
          const recheckId = `pe-megoldo${solverRound}`;
          review = await helpedStep(engine, recheckId, {
            role: 'PE', provider: engine.config.assign.PE, kind: 'review', agent: peAgent, inputs: [draftId, reviewId],
            prompt: await pePacket(join(paths.assignments, 'PE-RECHECK-AUTO.md'), [
              ['Melléklet 1 — Az író eredeti megbízása (csak követelményforrás)', brief],
              ['Melléklet 2 — A korábbi PE-jelentésed', previousReview.text],
              ['Melléklet 3 — A független megoldó jelentése (ezért javított a szerző)', solver.text],
              ['Melléklet 4 — Az író javított kézirata', draft],
            ]),
          });
          reviewId = recheckId;
          if (!isPass(review.summary)) {
            return { outcome: 'BLOCKED_SOLVER_REVIEW', checks: { ...checks, solverRounds: solverRound, step: recheckId, review: review.summary } };
          }
          pages = extractPages(draft);
        }
        solutions = await authorStep(engine, `gi1-4-megoldo${solverRound}`, {
          role: 'GI1-4', provider: engine.config.assign['GI1-4'], agent: solutionAgent, inputs: [draftId, solver.id],
          prompt: await solutionsPrompt(pages, solverReport
            + attachment('A kézirat szerzőjének dispositionje a megoldó jelentésére', fix.text)
            + '\n\nA független megoldó által talált minden helyes választ vedd fel elfogadott alternatívaként, vagy indokold, miért nem helyes; a kétértelmű itemeket a (javított) kézirat szerint oldd fel.\n'),
        });
        if (solutions.blocked) return { ...solutions.blocked, checks: { ...checks, ...solutions.blocked.checks, solverRounds: solverRound } };
        solver = await runSolver(`solver${solverRound + 1}`);
      }
      checks.solverRounds = solverRound;
    }

    if (options.p5) {
      // P4 → P5 határ: a (végleges) megoldásíró blokk-JSON-ja azonnal a P5 kapuin megy át (séma + hűség + …).
      const [, position] = blocks.find(([id]) => id === 'GI1');
      const blockId = p5BlockId(position, options.p5Week ?? 7);
      const files = [
        { file: 'review-pass.md', text: review.text },
        { file: 'kezirat.md', text: pages },
        { file: 'megoldas.md', text: stripBlockJson(solutions.text) },
      ];
      const gate = await p5Gate(engine, {
        blockId, files, text: solutions.text, maxRounds,
        repair: async (findings, n) => (await engine.step(`gi1-4-p5-javitas${n}`, {
          role: 'GI1-4', provider: engine.config.assign['GI1-4'], agent: solutionAgent, inputs: [solutions.id ?? 'gi1-4', 'P5'],
          prompt: await solutionsPrompt(pages,
            attachment('A korábbi válaszod', solutions.text)
            + attachment('P5-kapu findingok (javítsd a BLOKK_JSON-t; a kézirat és a megoldás szövege nem változhat)', findings)),
        })).text,
      });
      checks.p5 = { outcome: gate.outcome, rounds: gate.rounds, file: gate.file, errors: gate.findings.filter(f => f.severity === 'error').length };
      if (gate.outcome !== 'P5_PASS') return { outcome: 'BLOCKED_P5_GATE', checks: { ...checks, findings: gate.findings.slice(0, 50) } };
    }
    checks.solutionsSummary = solutions.summary;
    return { outcome: 'COMPLETED', checks };
  },
};
