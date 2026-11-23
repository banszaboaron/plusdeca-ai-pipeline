// Választható út (block.paths) és támogatott zárás (completion.mode: resolved), szerződés 2.0.4 — U54 app-igény (11-13).
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runBlockGates } from '../lib/gates.mjs';
import { compileWeek } from '../lib/compile.mjs';
import { bindBlock } from '../bind.mjs';
import { compileCourseContract } from '../vendor/course-contract/course-contract.js';

const here = dirname(fileURLToPath(import.meta.url));
const p5 = resolve(here, '..');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const planDir = join(here, 'fixtures', 'types');
const plan = readJson(join(planDir, 'week.plan.json'));
const handoffsDir = resolve(planDir, plan.handoffs);
const rules = readJson(join(p5, 'playable-types.json'));
const schema = readJson(join(p5, 'schema', 'block.schema.json'));
const blocks = plan.blocks.map(ref => readJson(resolve(planDir, ref)));
const lesson = blocks.find(block => block.id === 'w40-u-5-1');
const gates = block => runBlockGates(block, { handoffsDir, rules, schema });
const errors = block => gates(block).filter(entry => entry.severity === 'error');
const has = (block, pattern) => errors(block).some(entry => pattern.test(entry.message));
const validate = compileCourseContract();
const codes = pkg => validate(pkg).errors.map(e => e.code);
const compiled = () => compileWeek(plan, blocks, { planDir });
const v2Block = pkg => pkg.weeks[0].blocks.find(block => block.id.endsWith(':u-5-1'));
const p = n => `w40-u-5-1-p0${n}`;
const base = (block, id) => block.pages.flatMap(page => page.items).find(item => item.id === `w40-u-5-1-${id}`);

test('választható utas lecke: a kapuk zöldek (út-feliratok, zárószövegek, retry.page a hűségkapun)', () => {
  assert.deepEqual(errors(lesson), []);
  // Az S23 (2026-11-15) óta a glossza nélküli francia szöveg összesítő CL-23-figyelmeztetést ad; más figyelmeztetés nincs.
  assert.deepEqual(gates(lesson).filter(entry => entry.severity === 'warning' && entry.cl !== 'CL-23'), []);
});

test('lefedettség: az út szakaszcímsora (…-<út-ID>) lefedett, ha az út azonosítója ugyanez', () => {
  const dir = mkdtempSync(join(tmpdir(), 'p5-ut-cimsor-'));
  try {
    for (const file of readdirSync(handoffsDir)) if (file.startsWith('w40-u-5-1')) writeFileSync(join(dir, file), readFileSync(join(handoffsDir, file), 'utf8') + (file.endsWith('review-pass.md') ? '\n## `w40-u-5-1-texte` — szöveges út\n' : ''));
    const coverage = block => runBlockGates(bindBlock(block, dir), { handoffsDir: dir, rules, schema }).filter(entry => entry.gate === 'coverage');
    assert.deepEqual(coverage(lesson), []);
    const renamed = structuredClone(lesson); renamed.paths.options[1].id = 'szoveg';
    assert.ok(coverage(renamed).some(entry => entry.severity === 'error' && entry.location.endsWith('w40-u-5-1-texte')));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('fordítás: 2.0.4, paths, resolved, a változatok a pótlóoldalon az alapitemek sorrendjében, supportedClosure', () => {
  const result = compiled();
  assert.equal(result.status, 'COMPILED', JSON.stringify(result.contract.errors.slice(0, 3)));
  assert.equal(result.package.schemaVersion, '2.0.4');
  const block = v2Block(result.package), [, p2, p3, p4, , p6, p7] = block.pages;
  assert.deepEqual(block.paths, { choicePageRef: block.pages[0].id, options: [
    { id: 'video', label: 'Vidéo (recommandé)', pageRefs: [p2.id], recommended: true },
    { id: 'texte', label: 'Chemin texte', pageRefs: [p3.id] }] });
  assert.deepEqual(block.completion, { mode: 'resolved', requiredRefs: [p2.items[0].id, p3.items[0].id, p4.items[0].id] });
  assert.deepEqual(p6.items.map(i => i.id.split(':').slice(-2).join(':')), ['p06:i01-r1', 'p06:i01-r2', 'p06:alt-i01-r1']);
  assert.deepEqual(p2.items[0].repetition, { mode: 'delayed', minIntervening: 1, independentSuccess: true, retryItemRefs: [p6.items[0].id, p6.items[1].id], supportedClosure: true });
  assert.deepEqual(p4.items[0].repetition, { mode: 'delayed', minIntervening: 3, independentSuccess: true, supportedClosure: true }, 'változat nélküli lánc: rossz válasz után rögtön a zárás');
  assert.equal(result.presentation.items[p6.items[1].id].retryOf, p2.items[0].id);
  assert.match(result.presentation.items[p6.items[1].id].feedback.closure, /^Nézzük meg együtt\./u);
  assert.equal(result.presentation.pages[p7.id].visibleAfterSourceId, p(6));
  assert.equal(result.presentation.idMap[p(6)], p6.id, 'az oldal-ID-s visibleAfter az idMap-en át oldódik fel');
  assert.equal(result.presentation.items[block.pages[4].items[0].id].writtenAlternative, true);
});

test('kapu: támogatott zárás csak resolved leckében; resolved lánc zárás nélkül; maxVariants; zárószöveg a lánc végén', () => {
  const allItems = structuredClone(lesson);
  allItems.completion.mode = 'all-items';
  assert.ok(has(allItems, /csak resolved teljesítésű leckében/u));
  const noClosure = structuredClone(lesson);
  delete base(noClosure, 'i01').retry.closure; delete base(noClosure, 'i01').retry.maxVariants;
  assert.ok(has(noClosure, /ne ragadjon be/u));
  const tooMany = structuredClone(lesson);
  base(tooMany, 'alt-i01').retry.items.push({ ...structuredClone(base(tooMany, 'alt-i01').retry.items[0]), id: 'w40-u-5-1-alt-i01-r2' });
  assert.ok(has(tooMany, /Legfeljebb 1 változat/u));
  const lastWithout = structuredClone(lesson);
  delete base(lastWithout, 'i01').retry.items[1].feedback;
  assert.ok(errors(lastWithout).some(e => /feedback\.closure/u.test(e.message) && e.location.endsWith('i01-r2')));
  const stray = structuredClone(lesson);
  stray.pages[1].items[0].feedback.closure = 'Nézzük meg együtt.';
  delete base(stray, 'i01').retry;
  assert.ok(has(stray, /csak támogatott zárású/u));
  const empty = structuredClone(lesson);
  delete base(empty, 'i02').retry.closure;
  assert.ok(has(empty, /Változat nélküli retry/u));
  const early = structuredClone(lesson);
  base(early, 'i01').retry.page = p(1);
  assert.ok(has(early, /az alapitem oldala után/u));
  const test = structuredClone(lesson);
  test.kind = 'assessment'; test.assessmentKind = 'grammar';
  assert.ok(has(test, /csak leckeblokkban/u));
});

test('kapu: út-szabályok — diszjunkt oldalak a választás után, saját kötelező item, változat és visszautalás a saját úton', () => {
  const overlap = structuredClone(lesson);
  overlap.paths.options[1].pages.push(p(2));
  assert.ok(has(overlap, /csak egy úthoz/u));
  const before = structuredClone(lesson);
  before.paths.options[0].pages.push(p(1));
  assert.ok(has(before, /a választóoldal után/u));
  const noEvidence = structuredClone(lesson);
  noEvidence.completion.requiredRefs = noEvidence.completion.requiredRefs.filter(ref => !ref.includes('alt-'));
  assert.ok(has(noEvidence, /nincs saját kötelező iteme/u));
  const uneven = structuredClone(lesson);
  uneven.paths.options[0].pages.push(p(4));
  assert.ok(gates(uneven).some(e => e.severity === 'warning' && /kötelező itemszáma eltér/u.test(e.message)));
  const crossRetry = structuredClone(lesson);
  base(crossRetry, 'i01').retry.page = p(3);
  assert.ok(has(crossRetry, /az alapitem útján vagy közös oldalon/u));
  const crossRecall = structuredClone(lesson);
  base(crossRecall, 'alt-i01').recallFrom = 'w40-u-5-1-i01';
  assert.ok(has(crossRecall, /másik út itemjére/u));
  const ghost = structuredClone(lesson);
  ghost.pages[6].visibleAfter = 'w40-u-5-1-p99';
  assert.ok(has(ghost, /visibleAfter nem létező/u));
});

test('szerződés: a 2.0.4-es elemek csak 2.0.4-ben; resolved lánc zárással; út-átfedés és másik útra mutató változat hiba', () => {
  const pkg = compiled().package;
  assert.deepEqual(codes(pkg), []);
  const older = structuredClone(pkg); older.schemaVersion = '2.0.3';
  assert.ok(['COMPLETION_MODE_VERSION', 'PATHS_VERSION', 'SUPPORTED_CLOSURE_VERSION', 'CAPABILITY_VARIANT'].every(code => codes(older).includes(code)));
  const block = pkg2 => v2Block(pkg2);
  const unclosed = structuredClone(pkg); delete block(unclosed).pages[1].items[0].repetition.supportedClosure;
  assert.ok(codes(unclosed).includes('RESOLVED_NEEDS_CLOSURE'));
  const scope = structuredClone(pkg); block(scope).completion.mode = 'all-items';
  block(scope).completion.requiredRefs.push(...block(scope).pages[5].items.map(i => i.id));
  assert.ok(codes(scope).includes('SUPPORTED_CLOSURE_SCOPE'));
  const overlap = structuredClone(pkg); block(overlap).paths.options[1].pageRefs.push(block(overlap).pages[1].id);
  assert.ok(codes(overlap).includes('PATH_OVERLAP'));
  const cross = structuredClone(pkg), b = block(cross);
  b.paths.options[0].pageRefs.push(b.pages[5].id);
  assert.ok(codes(cross).includes('PATH_RETRY_SCOPE'), 'az alt-i01 változata a videós út oldalára került');
  const empty = structuredClone(pkg); block(empty).completion.requiredRefs = block(empty).completion.requiredRefs.filter(ref => !ref.includes(':p03:'));
  assert.ok(codes(empty).includes('PATH_EMPTY_COMPLETION'));
});
