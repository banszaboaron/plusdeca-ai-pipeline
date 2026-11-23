// A típuspróba-hét (40. hét, szintetikus, nem végleges tartalom): minden új válaszforma blokkja átmegy
// a kapukon, és a hét érvényes v2 csomagra fordul. A webapp-bejárás ugyanezt a hetet járja végig.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runBlockGates } from '../lib/gates.mjs';
import { compileWeek } from '../lib/compile.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = join(here, '..');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const planDir = join(here, 'fixtures', 'types');
const plan = readJson(join(planDir, 'week.plan.json'));
const handoffsDir = resolve(planDir, plan.handoffs);
const rules = readJson(join(p5, 'playable-types.json'));
const schema = readJson(join(p5, 'schema', 'block.schema.json'));
const allBlocks = plan.blocks.map(ref => readJson(resolve(planDir, ref)));
// A mesterszintű tesztblokk (w40-test-maitrise) a csomagot 2.0.3-ra, a választható utas lecke (w40-u-5-1) 2.0.4-re emeli;
// a verzióválasztás próbái nélkülük futnak (mastery.test.mjs, paths.test.mjs).
const blocks = allBlocks.filter(block => !['mastery', 'resolved'].includes(block.completion.mode));

for (const block of allBlocks) {
  test(`típuspróba ${block.id}: minden kapu zöld`, () => {
    const errors = runBlockGates(block, { handoffsDir, rules, schema }).filter(entry => entry.severity === 'error');
    assert.deepEqual(errors, []);
  });
}

test('többválasztós: pontozott itemnél a kulcs hosszabb a selection.max-nál = CL-02 hiba; nem pontozottnál rendben (submission)', () => {
  const original = blocks.find(block => block.id === 'w40-u-1-3');
  const variant = (evaluation, max) => {
    const block = structuredClone(original);
    const item = block.pages[0].items[0]; // kulcs: a, c (4 opcióból)
    Object.assign(item, { evaluation, response: { ...item.response, selection: { min: 1, max } } });
    if (evaluation.mode === 'formative') item.solution.keyOptionIds = item.response.options.map(option => option.id);
    return runBlockGates(block, { handoffsDir, rules, schema });
  };
  const tooLong = entry => entry.cl === 'CL-02' && /pontozott többválasztós item kulcsa \d+ opció, de a választáskorlát legfeljebb 1/u.test(entry.message);
  const scored = variant({ mode: 'exact' }, 1);
  assert.deepEqual(scored.filter(entry => entry.cl === 'SCHEMA'), []);
  assert.ok(scored.some(tooLong));
  const notScored = variant({ mode: 'formative', scoring: 'not-scored' }, 1);
  assert.deepEqual(notScored.filter(entry => entry.cl === 'SCHEMA'), []);
  assert.ok(!notScored.some(entry => entry.cl === 'CL-02' && /választáskorlát/u.test(entry.message)), 'nem pontozott: a kulcs az elfogadható opciók köre');
  assert.ok(!variant({ mode: 'exact' }, 2).some(tooLong));
});

test('a típuspróba-hét érvényes v2 csomagra fordul', () => {
  const result = compileWeek(plan, blocks, { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify([...result.needs, ...result.contract.errors].slice(0, 5)));
});

test('párosítás: a kulcspárok v2 pairs-kulccsá fordulnak', () => {
  const item = compileWeek(plan, blocks, { planDir }).package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.response.type === 'pairs');
  assert.deepEqual(item.solution, { type: 'exact', answers: [{ l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' }] });
});

test('javítás: a hibahelyek és a kulcs v2 correction-re fordul; kulcs nélküli hibahely = CL-02 hiba', () => {
  const item = compileWeek(plan, blocks, { planDir }).package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.response.type === 'correction');
  assert.equal(item.response.text.slice(item.response.spans[1].start, item.response.spans[1].end), 'du');
  assert.deepEqual(item.solution.answers, [{ s1: 'croissants', s2: 'de' }]);
  const block = structuredClone(blocks.find(b => b.id === 'w40-u-1-2'));
  delete block.pages[0].items[0].solution.key.s2;
  assert.ok(runBlockGates(block, { handoffsDir, rules, schema }).some(entry => entry.cl === 'CL-02' && /hibahelyhez/.test(entry.message)));
});

test('hang: helyi média tartalom-hash nevű URI-val, offline; az item mediaRefs a v2 média-ID-re mutat', () => {
  const result = compileWeek(plan, blocks, { planDir });
  const media = result.package.media.filter(m => m.id.includes('w40-u-2-1'));
  assert.equal(media.length, 3);
  for (const m of media) { assert.match(m.uri, /^media\/[0-9a-f]{16}\.wav$/); assert.equal(m.offline, true); assert.equal(m.kind, 'audio'); }
  assert.equal(media.find(m => m.id.endsWith('dictee')).transcriptPolicy, 'after-attempt');
  const dictation = result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.capability === 'CAP-dictation');
  assert.deepEqual(dictation.mediaRefs, ['course:plusdeca:media-w40-u-2-1-dictee']);
  assert.equal(result.mediaFiles.length, result.package.media.filter(m => m.access === 'local').length);
});

test('szókártya: v2 gloss, utána példa (fr), fordítás (hu) és kiejtés (média)', () => {
  const page = compileWeek(plan, blocks, { planDir }).package.weeks[0].blocks.find(b => b.id.endsWith('u-2-2')).pages[0];
  assert.deepEqual(page.content.slice(1, 5).map(c => c.type), ['gloss', 'text', 'text', 'media']);
  assert.deepEqual(page.content[1], { type: 'gloss', surface: 'une tasse', lemma: 'tasse', meaning: 'csésze', language: 'fr' });
});

test('tesztblokk: kind assessment + assessmentKind, tábla-pozíció nélkül', () => {
  const block = compileWeek(plan, blocks, { planDir }).package.weeks[0].blocks.find(b => b.kind === 'assessment');
  assert.equal(block.assessmentKind, 'grammar');
  assert.equal(block.position, undefined);
  assert.equal(block.completion.requiredRefs.length, 3);
});

test('ABX: három hangtoken, változtathatatlan első ablak; X kategóriájával ellentétes kulcs = CL-02 hiba', () => {
  const item = compileWeek(plan, blocks, { planDir }).package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.capability === 'CAP-abx');
  assert.deepEqual(item.response.tokens.map(t => t.role), ['A', 'B', 'X']);
  assert.deepEqual(item.solution.answers, ['A']);
  assert.equal(item.repetition.immutableFirstAttempt, true);
  assert.equal(item.repetition.recovery, 'new-full-window');
  const block = structuredClone(blocks.find(b => b.id === 'w40-u-3-2'));
  block.pages[0].items[0].solution.key = 'B';
  assert.ok(runBlockGates(block, { handoffsDir, rules, schema }).some(entry => entry.cl === 'CL-02' && /ABX-kulcs/.test(entry.message)));
});

test('videó: helyi fájl offline, külső HTTPS-cím csak hálózattal; a médiamegfigyelés itemnek van médiája', () => {
  const result = compileWeek(plan, blocks, { planDir });
  const local = result.package.media.find(m => m.id.endsWith('u-4-1-mire')), external = result.package.media.find(m => m.id.endsWith('u-4-1-clip'));
  assert.equal(local.kind, 'video'); assert.match(local.uri, /^media\/[0-9a-f]{16}\.mp4$/); assert.equal(local.offline, true);
  assert.equal(external.access, 'link'); assert.equal(external.offline, false); assert.equal(external.uri, 'https://example.com/plusdeca-video-test');
  const items = result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).filter(i => i.capability === 'CAP-media-observation');
  assert.equal(items.length, 2);
  assert.ok(items.every(i => i.mediaRefs.length === 1));
});

test('javítás, nehezebb szint: a „find” mód a presentation-be kerül (a v2-ben nincs helye)', () => {
  const result = compileWeek(plan, blocks, { planDir });
  const ids = result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).filter(i => i.response.type === 'correction').map(i => i.id);
  assert.deepEqual(ids.map(id => result.presentation.items[id].correctionMode ?? 'marked'), ['marked', 'find']);
});

test('tesztblokk assessmentKind nélkül: a fordító az azonosítóból vezeti le', () => {
  const block = structuredClone(blocks.find(b => b.kind === 'assessment'));
  delete block.assessmentKind;
  const result = compileWeek(plan, [block], { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract.errors.slice(0, 3)));
  assert.equal(result.package.weeks[0].blocks[0].assessmentKind, 'grammar');
});

test('szóbankos hiányos szöveg: a címkés kulcs bank-azonosítóra fordul; ismeretlen címke = NEEDS_CAPABILITY', () => {
  const block = structuredClone(blocks.find(b => b.id === 'w40-u-1-1'));
  const item = block.pages[0].items[0];
  block.pages[0].variant = 'PV-gap-bank';
  Object.assign(item, { capability: 'CAP-gap-bank', variant: 'PV-gap-bank',
    response: { type: 'fields', fields: [{ id: 'g1', label: '1' }, { id: 'g2', label: '2' }], bank: [{ id: 'b1', label: 'une tasse' }, { id: 'b2', label: 'un plateau' }] },
    solution: { type: 'exact', key: { g1: 'un plateau', g2: 'une tasse' }, alternatives: [] } });
  const ok = compileWeek(plan, [block], { planDir });
  assert.equal(ok.status, 'COMPILED', JSON.stringify(ok.contract.errors.slice(0, 3)));
  assert.deepEqual(ok.package.weeks[0].blocks[0].pages[0].items[0].solution.answers, [{ g1: 'b2', g2: 'b1' }]);
  item.solution.key.g2 = 'un bol';
  assert.equal(compileWeek(plan, [block], { planDir }).status, 'NEEDS_CAPABILITY');
});

test('a hanggenerátor alapból ideiglenes mappába ír, a gitben lévő fixtúrák érintetlenek', async () => {
  const { createHash } = await import('node:crypto');
  const { readdirSync, statSync } = await import('node:fs');
  const media = join(planDir, 'media');
  const snapshot = () => Object.fromEntries(readdirSync(media).filter(f => f.endsWith('.wav')).map(f => [f, `${statSync(join(media, f)).mtimeMs}:${createHash('sha256').update(readFileSync(join(media, f))).digest('hex')}`]));
  const before = snapshot();
  const { generate, TONES } = await import('./fixtures/types/media/generate.mjs');
  const dir = generate();
  assert.notEqual(resolve(dir), resolve(media));
  assert.deepEqual(readdirSync(dir).sort(), Object.keys(TONES).sort());
  assert.deepEqual(snapshot(), before);
});

test('párosítás: hiányzó kulcspár = CL-02 hiba', () => {
  const block = structuredClone(blocks.find(b => b.id === 'w40-u-1-1'));
  block.pages[0].items[0].solution.keyPairs.pop();
  const errors = runBlockGates(block, { handoffsDir, rules, schema }).filter(entry => entry.cl === 'CL-02');
  assert.ok(errors.some(entry => /minden bal oldali elemhez/.test(entry.message)));
});

// ---------- Nem pontozott többválasztós: kulcs nélküli megoldás (szerződés 2.0.1) + visszautalás (recallFrom) ----------

/** A w40-u-1-3 blokk p01-je nem pontozott, „legfeljebb 1” választással; egy második oldal visszautal rá. */
function reflectionVariant({ recallFrom = 'w40-u-1-3-i01', evaluation = { mode: 'formative', scoring: 'not-scored' } } = {}) {
  const block = structuredClone(blocks.find(entry => entry.id === 'w40-u-1-3'));
  const item = block.pages[0].items[0];
  Object.assign(item, { evaluation, response: { ...item.response, selection: { min: 1, max: 1 } } });
  item.solution.keyOptionIds = item.response.options.map(option => option.id);
  const later = structuredClone(block.pages[0]);
  later.id = 'w40-u-1-3-p02';
  later.items[0].id = 'w40-u-1-3-i02';
  later.items[0].recallFrom = recallFrom;
  later.items[0].evaluation = { mode: 'formative', scoring: 'not-scored' };
  block.pages.push(later);
  return block;
}
const withBlock = block => blocks.map(entry => (entry.id === block.id ? block : entry));

test('nem pontozott többválasztós (kulcs 4 opció, max 1): submission-megoldással lefordul, a csomag 2.0.1', () => {
  const result = compileWeek(plan, withBlock(reflectionVariant()), { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify([...result.needs, ...result.contract.errors].slice(0, 5)));
  assert.equal(result.package.schemaVersion, '2.0.1');
  const items = result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items));
  const reflection = items.find(i => result.presentation.items[i.id].sourceId === 'w40-u-1-3-i01');
  assert.deepEqual(reflection.solution, { type: 'submission' });
  assert.equal(reflection.evaluation.policyId, 'formative-only');
  assert.deepEqual(reflection.response.selection, { min: 1, max: 1 }, 'a választáskorlát marad');
});

test('pontozott itemnél minden marad: exact kulcs, és kulcs nélküli hétnél a csomag 2.0.0', () => {
  const result = compileWeek(plan, blocks, { planDir });
  assert.equal(result.package.schemaVersion, '2.0.0');
  assert.ok(result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).every(i => i.solution.type !== 'submission'));
});

test('recallFrom: a presentation a forrásitem v2-azonosítójára mutat; a kapu csak korábbi, megmutatható itemet enged', () => {
  const result = compileWeek(plan, withBlock(reflectionVariant()), { planDir });
  const pres = result.presentation.items;
  const recalling = Object.entries(pres).find(([, entry]) => entry.sourceId === 'w40-u-1-3-i02');
  assert.equal(recalling[1].recallFrom, result.presentation.idMap['w40-u-1-3-i01']);
  const recallFindings = block => runBlockGates(block, { handoffsDir, rules, schema }).filter(entry => entry.cl === 'SCHEMA' || /recallFrom/u.test(entry.message));
  assert.deepEqual(recallFindings(reflectionVariant()), []);
  assert.match(recallFindings(reflectionVariant({ recallFrom: 'w40-u-1-3-i99' }))[0].message, /nem létező itemre/u);
  assert.match(recallFindings(reflectionVariant({ recallFrom: 'w40-u-1-3-i02' }))[0].message, /csak korábbi oldal/u);
});

// Több helyes szórend (Áron, 11-01, U11 p23): a kulcs mellett alternativeOrders; a kapu teljes, ismétlés nélküli
// permutációt kér, a fordító a kulcs után a v2 answers-be teszi.
const orderVariant = (alternativeOrders, { type = 'order' } = {}) => {
  const block = structuredClone(blocks.find(entry => entry.id === 'w40-u-1-3'));
  const page = block.pages[0];
  const tokens = [['a', 'elle'], ['b', 'va'], ['c', 'en'], ['d', 'acheter'], ['e', 'demain']].map(([id, label]) => ({ id, label }));
  if (type === 'order') {
    Object.assign(page, { template: 'PAGE-structured', variant: 'PV-order-tokens' });
    Object.assign(page.items[0], { capability: 'CAP-ordering', variant: 'PV-order-tokens', prompt: 'Remets les mots dans l’ordre.', response: { type: 'order', tokens } });
    page.items[0].solution = { type: 'choice', keyOptionIds: ['a', 'b', 'c', 'd', 'e'] };
  }
  if (alternativeOrders) page.items[0].solution.alternativeOrders = alternativeOrders;
  return block;
};
const orderFindings = block => runBlockGates(block, { handoffsDir, rules, schema }).filter(entry => entry.cl === 'SCHEMA' || entry.cl === 'CL-02');

test('sorrendezős, több helyes sorrend: érvényes alternatíva átmegy, és a v2 answers a kulcs + alternatívák', () => {
  const block = orderVariant([['e', 'a', 'b', 'c', 'd']]);
  assert.deepEqual(orderFindings(block), []);
  assert.deepEqual(orderFindings(orderVariant()), [], 'alternatíva nélkül is érvényes, mint eddig');
  const result = compileWeek(plan, withBlock(block), { planDir });
  assert.equal(result.status, 'COMPILED', JSON.stringify([...result.needs, ...result.contract.errors].slice(0, 5)));
  assert.equal(result.package.schemaVersion, '2.0.0', 'a v2-szerződés order-nél eddig is több answers-t engedett');
  const item = result.package.weeks[0].blocks.flatMap(b => b.pages.flatMap(p => p.items)).find(i => i.response.type === 'order');
  assert.deepEqual(item.solution, { type: 'exact', answers: [['a', 'b', 'c', 'd', 'e'], ['e', 'a', 'b', 'c', 'd']] });
});

test('sorrendezős, több helyes sorrend: hiányos permutáció, ismétlődő token, kulccsal egyező vagy ismétlődő alternatíva = CL-02 hiba', () => {
  const messages = alternatives => orderFindings(orderVariant(alternatives)).map(entry => entry.message);
  assert.match(messages([['e', 'a', 'b', 'c']])[0], /1\. alternatív sorrend .* nem a tokenek teljes permutációja/u);
  assert.match(messages([['e', 'a', 'b', 'c', 'c']])[0], /nem a tokenek teljes permutációja/u);
  assert.match(messages([['e', 'a', 'b', 'c', 'x']])[0], /nem a tokenek teljes permutációja/u);
  assert.match(messages([['a', 'b', 'c', 'd', 'e']])[0], /1\. alternatív sorrend .* ismétlés/u);
  const repeated = messages([['e', 'a', 'b', 'c', 'd'], ['e', 'a', 'b', 'c', 'd']]);
  assert.equal(repeated.length, 1);
  assert.match(repeated[0], /2\. alternatív sorrend .* ismétlés/u);
});

test('sorrendezős kulcs: ismétlődő token a kulcsban is hiba; alternativeOrders nem sorrendezős itemnél = CL-02 hiba', () => {
  const block = orderVariant();
  block.pages[0].items[0].solution.keyOptionIds = ['a', 'b', 'c', 'd', 'd'];
  assert.ok(orderFindings(block).some(entry => /összes token sorrendje kell kulcsként/u.test(entry.message)));
  assert.match(orderFindings(orderVariant([['c', 'a']], { type: 'multiple' }))[0].message, /csak sorrendezős \(order\) itemnél.*multiple/u);
  assert.ok(runBlockGates(orderVariant([[]]), { handoffsDir, rules, schema }).some(entry => entry.cl === 'SCHEMA'), 'üres alternatíva = sémahiba');
});

// ---------- Beszéd: a felvétel felső határa külön a beszédidőtől (U42, 11-09) ----------
function speechVariant(response) {
  const block = structuredClone(blocks.find(b => b.id === 'w40-u-1-1'));
  const page = block.pages[0];
  Object.assign(page, { template: 'PAGE-speaking', variant: 'PV-speech-open' });
  page.items = [{ ...page.items[0], capability: 'CAP-speech-open', variant: 'PV-speech-open', response,
    solution: { type: 'rubric', criteria: [{ label: 'A' }] }, evaluation: { mode: 'formative', scoring: 'formative-required' } }];
  return block;
}

test('recordingMaxSeconds: a presentation-be kerül, a durationRange a tipp marad; a durationRange.max-nál rövidebb hiba', () => {
  const block = speechVariant({ type: 'speech', durationRange: { min: 60, max: 75 }, recordingMaxSeconds: 150 });
  assert.ok(!runBlockGates(block, { handoffsDir, rules, schema }).some(entry => /recordingMaxSeconds/.test(entry.message)));
  const result = compileWeek(plan, [block], { planDir });
  const item = result.package.weeks[0].blocks[0].pages[0].items[0];
  assert.deepEqual(item.response.durationRange, { min: 60, max: 75 });
  assert.equal(result.presentation.items[item.id].recordingMaxSeconds, 150);
  const short = speechVariant({ type: 'speech', durationRange: { min: 60, max: 75 }, recordingMaxSeconds: 70 });
  assert.ok(runBlockGates(short, { handoffsDir, rules, schema }).some(entry => entry.cl === 'CL-02' && entry.severity === 'error' && /recordingMaxSeconds/.test(entry.message)));
  const none = compileWeek(plan, [speechVariant({ type: 'speech', durationRange: { min: 60, max: 75 } })], { planDir });
  assert.equal(none.presentation.items[none.package.weeks[0].blocks[0].pages[0].items[0].id].recordingMaxSeconds, undefined);
});

test('rubrikás minta: a solution.samples a presentation rubricSamples-ébe kerül, a v2 rubric változatlan', () => {
  const block = speechVariant({ type: 'speech', durationRange: { min: 60, max: 75 } });
  block.pages[0].items[0].solution.samples = ['Bonjour, je voudrais un café.'];
  const result = compileWeek(plan, [block], { planDir });
  const item = result.package.weeks[0].blocks[0].pages[0].items[0];
  assert.deepEqual(Object.keys(item.solution).sort(), ['criteria', 'type']);
  assert.deepEqual(result.presentation.items[item.id].rubricSamples, ['Bonjour, je voudrais un café.']);
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract?.errors?.slice(0, 3)));
  assert.ok(runBlockGates(block, { handoffsDir, rules, schema }).some(entry => entry.cl === 'CL-01' && /Bonjour, je voudrais un café/.test(entry.message + JSON.stringify(entry))), 'a minta tanulói szöveg: a hűségkapu nézi');
});

test('reveal: a "tap" jelölésű tartalmi elemek lépésenként a presentation-be kerülnek (a cím a lépéssel együtt)', () => {
  const block = speechVariant({ type: 'speech', durationRange: { min: 60, max: 75 } });
  const page = block.pages[0], base = { ...page.content[0] };
  delete base.reveal;
  page.content = [base,
    { ...base, title: 'K1', text: 'Bonjour, je vous écoute.', reveal: 'tap' },
    { ...base, text: 'Il n’y a plus de jus d’orange.', reveal: 'tap' }];
  delete page.content[2].title;
  const result = compileWeek(plan, [block], { planDir });
  const v2 = result.package.weeks[0].blocks[0].pages[0];
  const reveal = result.presentation.pages[v2.id].reveal;
  assert.equal(reveal.length, 2);
  assert.deepEqual(reveal[0].map(i => v2.content[i].text), ['K1', 'Bonjour, je vous écoute.']);
  assert.deepEqual(reveal[1].map(i => v2.content[i].text), ['Il n’y a plus de jus d’orange.']);
  assert.ok(v2.content.every(entry => !('reveal' in entry)), 'a v2-tartalom változatlan');
  assert.ok(!runBlockGates(block, { handoffsDir, rules, schema }).some(entry => entry.cl === 'SCHEMA' || /\btap\b/.test(entry.message)));
});
