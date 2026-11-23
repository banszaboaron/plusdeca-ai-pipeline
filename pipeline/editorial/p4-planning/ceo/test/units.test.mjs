import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { replaceAssignment, stripAuthorNotes, extractPages, assertNoPlaceholders } from '../lib/packets.mjs';
import { parseSummary, isPass, checkExpectedKeys, knownIssueHints } from '../lib/verdict.mjs';
import { buildCommand, extractTokens } from '../lib/providers.mjs';
import { quoteWindowsArg, pickWindowsCandidate, resolveExecutable } from '../lib/process.mjs';
import { mergeConfig } from '../ceo.mjs';
import { paths, EXPECTED_KEYS } from '../lib/pipelines.mjs';

const pkg = 'fejléc\n<!-- ASSIGNMENT START -->\n{{SABLON}}\n<!-- ASSIGNMENT END -->\nszerep';

test('replaceAssignment kicseréli a megbízási blokkot', () => {
  const out = replaceAssignment(pkg, 'Konkrét megbízás');
  assert.match(out, /fejléc\nKonkrét megbízás\n\n\nszerep/);
  assert.doesNotMatch(out, /ASSIGNMENT|\{\{/);
});

test('replaceAssignment megáll, ha nincs blokk vagy kitöltetlen mező marad', () => {
  assert.throws(() => replaceAssignment('nincs blokk', 'x'), /ASSIGNMENT/);
  assert.throws(() => replaceAssignment(pkg, 'még {{HIÁNYZIK}}'), /Kitöltetlen/);
  assert.throws(() => assertNoPlaceholders('a {{b}} c'), /\{\{b\}\}/);
});

test('replaceAssignment a megbízásban lévő $-jeleket szó szerint hagyja', () => {
  assert.match(replaceAssignment(pkg, 'ár: 5 $& $1'), /ár: 5 \$& \$1/);
});

test('a valódi szerepcsomagokban megvan a megbízási blokk', async () => {
  for (const role of ['PE', 'GI1-3', 'GI1-4']) {
    const text = await readFile(join(paths.packages, `${role}.md`), 'utf8');
    assert.doesNotThrow(() => replaceAssignment(text, 'teszt'), role);
  }
});

test('stripAuthorNotes a valódi SOLUTIONS-INPUT-ból minden szerzői megjegyzést kivesz, a feladatot meghagyja', async () => {
  const input = await readFile(join(paths.quality, 'SOLUTIONS-INPUT-v1.md'), 'utf8');
  const view = stripAuthorNotes(input);
  assert.doesNotMatch(view, /Szerzői megjegyzés|Várt jelentés|Mérési cél|Szerzői státusz|Korlátozás|Változatosság/i);
  for (const stem of ['Nous ___ le train de 7 h 42', 'Clara ___ un dauphin', 'Paul et Inès ___ une randonnée', '(nous — prendre)', '(je — voir)', '(mes amis — faire)']) {
    assert.ok(view.includes(stem), stem);
  }
});

test('stripAuthorNotes a fejlécszintet tiszteletben tartja', () => {
  const text = '## Feladat\nA\n#### Szerzői megjegyzés\ntitok\n##### alcím\nmég titok\n### Következő\nB\n';
  const view = stripAuthorNotes(text);
  assert.doesNotMatch(view, /titok/);
  assert.match(view, /A[\s\S]*### Következő\nB/);
});

test('extractPages a valódi írói válaszból csak az oldalakat adja', async () => {
  const response = await readFile(join(paths.quality, 'results', 'gi1-3-round2', 'response.txt'), 'utf8');
  const pages = extractPages(response);
  assert.match(pages, /^# GI1-P02/);
  assert.match(pages, /# GI1-P05/);
  assert.doesNotMatch(pages, /# Disposition|# Átadás a CEO-nak|# Változáslista/);
  assert.equal(extractPages('nincs oldal'), 'nincs oldal\n');
});

test('parseSummary: verdikt, számok, utolsó blokk, sablonsor elutasítása', () => {
  const block = v => `GEPI_OSSZEGZES\nverdict: ${v}\nblocker: 0\nmajor: 2\nminor: 1\nGEPI_OSSZEGZES_VEGE`;
  assert.deepEqual(parseSummary(`szöveg\n${block('REVISION_REQUIRED')}`), { verdict: 'REVISION_REQUIRED', blocker: 0, major: 2, minor: 1 });
  assert.equal(parseSummary(`${block('REVIEW_PASS')}\n${block('REVISION_REQUIRED')}`).verdict, 'REVISION_REQUIRED');
  assert.equal(parseSummary(block('REVIEW_PASS | REVISION_REQUIRED | BLOCKED_EVIDENCE')), null);
  assert.equal(parseSummary('nincs blokk'), null);
  assert.deepEqual(parseSummary('GEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE'), { status: 'DRAFT_FOR_REVIEW' });
  assert.equal(parseSummary('GEPI_OSSZEGZES\nverdict: **review_pass**\nblocker: 0\nmajor: 0\nminor: 0\nGEPI_OSSZEGZES_VEGE').verdict, 'REVIEW_PASS');
});

test('isPass csak nyitott major/blocker nélküli PASS-ra igaz', () => {
  assert.equal(isPass({ verdict: 'REVIEW_PASS', blocker: 0, major: 0 }), true);
  assert.equal(isPass({ verdict: 'REVIEW_PASS', blocker: 0, major: 1 }), false);
  assert.equal(isPass({ verdict: 'REVISION_REQUIRED', blocker: 0, major: 0 }), false);
  assert.equal(isPass(null), false);
});

test('checkExpectedKeys aposztróf- és szóközfüggetlen; knownIssueHints jelez', () => {
  const r = checkExpectedKeys('Kulcs: J’ai  vu, nous AVONS PRIS', [{ item: 'a', answer: "ai vu" }, { item: 'b', answer: 'avons pris' }, { item: 'c', answer: 'ont fait' }]);
  assert.deepEqual(r.map(x => x.found), [true, true, false]);
  const h = knownIssueHints('Túl sok az ismétlés: visite guidée', [{ id: 'F1', description: 'd', keywords: ['ismétl', 'visite guidée', 'dauphin'] }]);
  assert.deepEqual(h[0].hits, ['ismétl', 'visite guidée']);
  assert.equal(EXPECTED_KEYS.length, 6);
});

test('buildCommand: helyettesítés, modell- és effort-argumentumok a pozicionális "-" előtt', () => {
  const provider = { command: 'codex', args: ['exec', '--cd', '{workdir}', '-o', '{outFile}', '{modelArgs}', '-'], modelFlag: '--model', effortTemplate: ['-c', 'model_reasoning_effort={effort}'] };
  assert.deepEqual(buildCommand(provider, { workdir: 'W', outFile: 'O', model: 'm1', effort: 'high' }).args,
    ['exec', '--cd', 'W', '-o', 'O', '--model', 'm1', '-c', 'model_reasoning_effort=high', '-']);
  assert.deepEqual(buildCommand(provider, { workdir: 'W', outFile: 'O' }).args, ['exec', '--cd', 'W', '-o', 'O', '-']);
});

test('a valódi alapkonfiguráció Codex-parancsa csak olvasási sandboxot kér, és stdin-ről olvas', async () => {
  const config = JSON.parse(await readFile(join(paths.ceo, 'config.default.json'), 'utf8'));
  const { args } = buildCommand(config.providers.codex, { workdir: 'W', outFile: 'O' });
  assert.equal(args[args.indexOf('--sandbox') + 1], 'read-only');
  assert.equal(args.at(-1), '-');
  assert.ok(!args.some(a => /danger|full-access|workspace-write|--search/.test(a)));
  const claude = buildCommand(config.providers.claude, { workdir: 'W', outFile: 'O' }).args;
  assert.match(claude[claude.indexOf('--disallowedTools') + 1], /Bash.*Edit.*Write.*WebFetch.*WebSearch/);
});

test('extractTokens a CLI kiírásából', () => {
  assert.equal(extractTokens('...\ntokens used: 12,345\n'), 12345);
  assert.equal(extractTokens('Tokens used 9 876'), 9876);
  assert.equal(extractTokens('semmi'), null);
});

test('quoteWindowsArg', () => {
  assert.equal(quoteWindowsArg('egyszeru'), 'egyszeru');
  assert.equal(quoteWindowsArg('C:\\Users\\a b\\x.md'), '"C:\\Users\\a b\\x.md"');
  assert.equal(quoteWindowsArg('Bash,Edit'), 'Bash,Edit');
  assert.equal(quoteWindowsArg('a"b c'), '"a\\"b c"');
  assert.equal(quoteWindowsArg(''), '""');
});

test('mergeConfig mélyen egyesít, a tömböt cseréli', () => {
  const merged = mergeConfig({ a: { b: 1, c: [1, 2] }, d: 1 }, { a: { c: [3] }, e: 2 });
  assert.deepEqual(merged, { a: { b: 1, c: [3] }, d: 1, e: 2 });
});

test('pickWindowsCandidate az .exe/.cmd találatot választja a kiterjesztés nélküli szkript helyett', () => {
  assert.equal(pickWindowsCandidate(['C:\\npm\\codex', 'C:\\npm\\codex.cmd', '']), 'C:\\npm\\codex.cmd');
  assert.equal(pickWindowsCandidate(['C:\\bin\\claude.exe']), 'C:\\bin\\claude.exe');
  assert.equal(pickWindowsCandidate(['', '  ']), null);
});

test('resolveExecutable Windowson a teljes útvonalat közvetlenül ellenőrzi, nem a `where`-rel', () => {
  const yes = () => true;
  const no = () => false;
  assert.deepEqual(resolveExecutable('C:\\Program Files\\nodejs\\node.exe', 'win32', yes), { path: 'C:\\Program Files\\nodejs\\node.exe', shell: false });
  assert.equal(resolveExecutable('C:\\npm\\codex.cmd', 'win32', yes).shell, true);
  assert.equal(resolveExecutable('C:\\nincs\\codex.exe', 'win32', no).missing, true);
  assert.deepEqual(resolveExecutable('/usr/bin/node', 'linux', no), { path: '/usr/bin/node', shell: false });
});

test('alapkonfiguráció: minden szerep Claude-on, a megoldó web nélkül (2026-10-28); PE 4 kör, kettős futás', async () => {
  const { readFile } = await import('node:fs/promises');
  const { providerFor } = await import('../lib/week.mjs');
  const cfg = JSON.parse(await readFile(new URL('../config.default.json', import.meta.url), 'utf8'));
  // claude -p a jóváhagyást kérő eszközt csendben elutasítja: a webet kifejezetten engedélyezni kell (R11-pilot, 10-28).
  const webArgs = cfg.providers['claude-web'].args;
  assert.ok(!webArgs[webArgs.indexOf('--disallowedTools') + 1].includes('WebSearch'), 'a web nincs letiltva');
  assert.equal(webArgs[webArgs.indexOf('--allowedTools') + 1], 'WebSearch,WebFetch', 'az ellenőr és a szerző kereshet a weben');
  assert.ok(cfg.providers.claude.args.join(' ').includes('WebSearch'), 'a megoldó nem');
  for (const role of ['GI1-3', 'PE', 'GI1-4']) assert.equal(cfg.assign[role], 'claude-web', role);
  assert.equal(cfg.assign.SOLVER, 'claude');
  for (const role of ['FR', 'GR', 'RR', 'VR', 'XR', 'iro', 'MEGOLDASIRO', 'PE', 'NavE', 'NyE', 'HE', 'UE']) assert.equal(providerFor(cfg, role), 'claude-web', role);
  for (const p of ['claude', 'claude-web']) assert.equal(cfg.providers[p].outputFrom, 'stream-json', `${p}: keretadat a stream-json-ból`);
  assert.equal(cfg.limits.maxRounds, 2);
  assert.equal(cfg.limits.peMaxRounds, 4);
  assert.equal(cfg.limits.peRuns, 2);
  assert.equal(cfg.limits.maxCalls, 40);
  assert.equal(cfg.usage.threshold, 95);
});
