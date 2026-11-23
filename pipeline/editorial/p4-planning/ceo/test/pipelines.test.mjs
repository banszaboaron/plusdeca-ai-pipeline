import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { PIPELINES } from '../lib/pipelines.mjs';
import { REVIEW_FOOTER } from '../lib/packets.mjs';
import { fakeConfig, tempDirs, callLog, silent } from './helpers.mjs';

async function runPipeline(name, { reviews = 'REVIEW_PASS', mode = 'normal', limits = {}, options = {}, agentModes = {}, solverProblems = '0', minor = '0' } = {}) {
  const dirs = await tempDirs();
  process.env.FAKE_REVIEWS = reviews;
  process.env.FAKE_MODE = mode;
  process.env.FAKE_SOLVER_PROBLEMS = solverProblems;
  process.env.FAKE_MINOR = minor;
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(limits, agentModes), pipeline: name, log: silent });
  await engine.init();
  const result = await PIPELINES[name](engine, options);
  return { dirs, engine, result, calls: await callLog(dirs.stateDir) };
}

test('replay-pe02: a valódi PE-02 csomagot küldi el, gépi összegzéssel, és összeveti a kézi eredménnyel', async t => {
  const { dirs, engine, result, calls } = await runPipeline('replay-pe02');
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(calls.length, 1);
  const prompt = await readFile(join(dirs.runDir, 'steps', 'pe02.prompt.md'), 'utf8');
  assert.match(prompt, /^# PE-02: elkülönített szakmai és forrásvizsgálati próba/);
  assert.match(prompt, /GEPI_OSSZEGZES_VEGE\s*$/);
  // A kézi PE-02 eredménye megtalálta az ismétlési hibát: a kulcsszavas jelzés ezt mutatja.
  assert.ok(result.checks.manualKnownIssues.find(i => i.id === 'PE02-F01').hits.length > 0);
  assert.equal(engine.state.steps.pe02.kind, 'review');
});

test('replay-gi1-4 megoldóval: a megoldó nem látja a szerzői megjegyzést, a várt kulcsok ellenőrizve', async t => {
  const { dirs, result, calls } = await runPipeline('replay-gi1-4', { options: { solver: 'claude' } });
  t.after(dirs.cleanup);
  assert.deepEqual(calls.map(c => c.split('\t')[0]), ['author', 'solver']);
  const solverPrompt = await readFile(join(dirs.runDir, 'steps', 'solver.prompt.md'), 'utf8');
  assert.doesNotMatch(solverPrompt, /Szerzői megjegyzés|Várt jelentés|Mérési cél/);
  assert.match(solverPrompt, /Clara ___ un dauphin/);
  assert.ok(result.checks.solverKeys.every(k => k.found));
  assert.ok(result.checks.expectedKeys.every(k => k.found));
});

test('full: első PE-kör PASS → nincs javítási kör, a GI1-4 csak az oldalakat kapja', async t => {
  const { dirs, engine, result } = await runPipeline('full');
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(result.checks.rounds, 0);
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4']);
  const gi14 = await readFile(join(dirs.runDir, 'steps', 'gi1-4.prompt.md'), 'utf8');
  assert.match(gi14, /# GI1-P02 — Explication/);
  assert.doesNotMatch(gi14, /# Átadás a CEO-nak\nKész/);
  assert.doesNotMatch(gi14, /<!-- ASSIGNMENT/);
});

test('full: REVISION → javítás → recheck PASS, a javító megkapja a korábbi választ és a jelentést', async t => {
  const { dirs, engine, result } = await runPipeline('full', { reviews: 'REVISION_REQUIRED,REVIEW_PASS' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(result.checks.rounds, 1);
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-3-rev1', 'pe-recheck1', 'gi1-4']);
  const rev = await readFile(join(dirs.runDir, 'steps', 'gi1-3-rev1.prompt.md'), 'utf8');
  assert.match(rev, /# A saját korábbi válaszod/);
  assert.match(rev, /# A PE jelentése[\s\S]*PE-F01 MAJOR/);
  const recheck = await readFile(join(dirs.runDir, 'steps', 'pe-recheck1.prompt.md'), 'utf8');
  assert.match(recheck, /PE célzott recheck/);
  assert.match(recheck, /# Melléklet 2 — A korábbi PE-jelentésed/);
});

test('full: két sikertelen kör után megáll emberi döntésre, nem pörög tovább', async t => {
  const { dirs, result, calls } = await runPipeline('full', { reviews: 'REVISION_REQUIRED' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'BLOCKED_DECISION_MAX_ROUNDS');
  assert.equal(result.checks.round, 2);
  assert.equal(calls.length, 6); // író + 3 PE + 2 javítás, GI1-4 nem indul
});

test('full: értelmezhetetlen review-nál megáll', async t => {
  const { dirs, result, calls } = await runPipeline('full', { mode: 'nosummary' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'BLOCKED_UNPARSEABLE_REVIEW');
  assert.equal(calls.length, 3, 'a gépi összegzés nélküli review egyszer újrafut (11-15)');
});

test('full: a hívási korlát a lánc közepén is megállít', async t => {
  const dirs = await tempDirs();
  t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVISION_REQUIRED';
  process.env.FAKE_MODE = 'normal';
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({ maxCalls: 3 }), pipeline: 'full', log: silent });
  await engine.init();
  await assert.rejects(PIPELINES.full(engine, {}), /hívási korlát/);
  assert.equal((await callLog(dirs.stateDir)).length, 3);
});

// ---------- Agent-mód (--roles agent) ----------

const read = (dirs, step) => readFile(join(dirs.runDir, 'steps', `${step}.prompt.md`), 'utf8');

test('replay-pe02 agent-módban: ugyanaz a megbízás és melléklet, de a 235 KB-os szerepcsomag helyett az agent', async t => {
  const { dirs, engine, result } = await runPipeline('replay-pe02', { options: { roles: 'agent' }, agentModes: { codex: 'agents-md' } });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  const prompt = await read(dirs, 'pe02');
  assert.doesNotMatch(prompt, /^# PE — Prof Ellenőr/m, 'a régi szerepcsomag nem mehet át');
  assert.match(prompt, /# Melléklet 1 — Az író eredeti megbízása/);
  assert.match(prompt, /# Melléklet 2 — A vizsgálandó írói válasz, változatlanul/);
  const s = engine.state.steps.pe02;
  assert.equal(s.agent, 'plusdeca-pe');
  assert.ok(s.contextBytes < 100_000, `kontextus: ${s.contextBytes} B`);
});

test('replay-gi1-4 agent-módban, Claude-agent megoldóval: a megoldó csak a feladatlapot kapja, --agent kapcsolóval', async t => {
  const { dirs, result, calls, engine } = await runPipeline('replay-gi1-4', { options: { roles: 'agent', solver: 'claude' }, agentModes: { claude: 'claude-agent' } });
  t.after(dirs.cleanup);
  assert.deepEqual(calls.map(c => c.split('\t')[0]), ['author', 'solver']);
  assert.match(calls[1], /--agent plusdeca-solver/);
  const gi = await read(dirs, 'gi1-4');
  assert.match(gi, /# Megbízás — GI1 \(\(1,1\), Nyelvtan 1\), Megoldás fázis/);
  assert.match(gi, /# SOLUTIONS-INPUT-v1/);
  assert.match(gi, /plusdeca-megoldasiro/, 'inline módban a szerepleírás a prompt elején');
  const solver = await read(dirs, 'solver');
  assert.doesNotMatch(solver, /Szerzői megjegyzés|Várt jelentés|Független megoldó/);
  assert.match(solver, /Clara ___ un dauphin/);
  assert.ok(result.checks.solverKeys.every(k => k.found));
  assert.equal(engine.state.steps.solver.agent, 'plusdeca-solver');
});

test('full agent-módban: író → PE → javítás → recheck → megoldásíró, mindenhol a megfelelő agent', async t => {
  const { dirs, engine, result } = await runPipeline('full', { reviews: 'REVISION_REQUIRED,REVIEW_PASS', options: { roles: 'agent' } });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  const agentsByStep = Object.fromEntries(engine.state.order.map(id => [id, engine.state.steps[id].agent]));
  assert.deepEqual(agentsByStep, {
    'gi1-3': 'plusdeca-g-iro', 'pe-r1': 'plusdeca-pe', 'gi1-3-rev1': 'plusdeca-g-iro',
    'pe-recheck1': 'plusdeca-pe', 'gi1-4': 'plusdeca-megoldasiro',
  });
  const writer = await read(dirs, 'gi1-3');
  assert.match(writer, /Kézirat fázis/);
  assert.match(writer, /# Írói minőségpróba — konkrét megbízás/);
  assert.doesNotMatch(writer, /<!-- ASSIGNMENT/);
  const rev = await read(dirs, 'gi1-3-rev1');
  assert.match(rev, /# A PE jelentése/);
});

test('ismeretlen --roles érték: a vezérlő nem indul el', async () => {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [join(import.meta.dirname, '..', 'ceo.mjs'), 'run', 'replay-pe02', '--roles', 'valami', '--dry-run'], { encoding: 'utf8' });
  assert.match(r.stderr, /package vagy agent/);
});

// ---------- Elakadás: döntést kérő vagy értelmezhetetlen szerzői válasz ----------

test('full: ha a szerző döntést kér, a lánc megáll, a kérdés a jelentésbe kerül; a döntés után ugyanott folytatja', async t => {
  const { writeFile } = await import('node:fs/promises');
  const { writeReport } = await import('../lib/report.mjs');
  process.env.FAKE_AUTHOR = 'decide';
  t.after(() => { delete process.env.FAKE_AUTHOR; });
  const first = await runPipeline('full');
  t.after(first.dirs.cleanup);
  assert.equal(first.result.outcome, 'BLOCKED_DECISION');
  assert.equal(first.result.checks.step, 'gi1-3');
  assert.match(first.result.checks.question, /4 példát kér, a terv 5-öt/);
  assert.equal(first.calls.length, 1, 'döntésre várva nem hív tovább');
  const report = await writeReport(first.dirs.runDir, first.engine.state, first.result);
  const md = await readFile(join(first.dirs.runDir, 'report.md'), 'utf8');
  assert.equal(report.outcome, 'BLOCKED_DECISION');
  assert.match(md, /## Döntésre vár[\s\S]*> A megbízás 4 példát kér[\s\S]*decisions/);

  // A döntés megírása után újraindítás ugyanabban a futásmappában.
  await writeFile(first.result.checks.decisionFile, 'Legyen 4 példa, a terv a hibás.');
  const resume = async () => {
    const engine = new Engine({ runDir: first.dirs.runDir, config: fakeConfig(), pipeline: 'full', log: silent });
    await engine.init();
    return { engine, result: await PIPELINES.full(engine, {}) };
  };
  const second = await resume();
  // A gi1-3 nem fut újra; a döntéssel folytatott lépés megkapja a döntést, aztán PE; a GI1-4 is döntést kér (a hamis agent így működik).
  assert.equal(second.result.outcome, 'BLOCKED_DECISION');
  assert.equal(second.result.checks.step, 'gi1-4');
  const cont = await readFile(join(first.dirs.runDir, 'steps', 'gi1-3-dontes.prompt.md'), 'utf8');
  assert.match(cont, /# A PRESIDENT döntése\n\nLegyen 4 példa/);
  assert.match(cont, /# A korábbi válaszod \(döntésre várt\)/);
  assert.equal(cont.match(/# Gépi összegzés \(kötelező\)/g).length, 1, 'a lábléc csak egyszer szerepel');
  const pe = await readFile(join(first.dirs.runDir, 'steps', 'pe-r1.prompt.md'), 'utf8');
  assert.doesNotMatch(pe, /DÖNTÉSI KÉRDÉS/, 'a PE a döntés utáni változatot kapja');

  await writeFile(join(first.dirs.runDir, 'decisions', 'gi1-4.md'), 'Rendben, folytasd.');
  const third = await resume();
  assert.equal(third.result.outcome, 'COMPLETED');
  // A megoldásíró kérdésére adott döntés előbb a kézirat szerzőjéhez megy, aztán célzott PE, aztán megoldás.
  assert.deepEqual(third.engine.state.order, ['gi1-3', 'gi1-3-dontes', 'pe-r1', 'gi1-4', 'gi1-3-megoldas-dontes', 'pe-megoldas-dontes', 'gi1-4-dontes']);
  assert.equal(third.engine.state.calls, 7, 'egyetlen kész lépést sem hívott újra');
  const fix = await readFile(join(first.dirs.runDir, 'steps', 'gi1-3-megoldas-dontes.prompt.md'), 'utf8');
  assert.match(fix, /# A megoldásíró döntési kérdése[\s\S]*# A PRESIDENT döntése\n\nRendben, folytasd\./);
  const sol = await readFile(join(first.dirs.runDir, 'steps', 'gi1-4-dontes.prompt.md'), 'utf8');
  assert.match(sol, /# A PRESIDENT döntése/);
  assert.match(sol, /TANULOI_NEZET/);
});

test('full: gépi összegzés nélküli szerzői válasz nem megy tovább a PE-hez', async t => {
  process.env.FAKE_AUTHOR = 'nosummary';
  t.after(() => { delete process.env.FAKE_AUTHOR; });
  const { dirs, result, calls } = await runPipeline('full');
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'BLOCKED_UNPARSEABLE_AUTHOR');
  assert.equal(calls.length, 2, 'a gépi összegzés nélküli szerzői válasz egyszer újrafut (11-15)');
});

test('extractQuestion: a DÖNTÉSI KÉRDÉS részt adja, anélkül a válasz végét', async () => {
  const { extractQuestion } = await import('../lib/packets.mjs');
  assert.equal(extractQuestion('# A\nszöveg\n# DÖNTÉSI KÉRDÉS\nMelyik?\n- a\n- b\n# Átadás\nx\nGEPI_OSSZEGZES\nstatus: BLOCKED_DECISION\nGEPI_OSSZEGZES_VEGE'), 'Melyik?\n- a\n- b');
  assert.equal(extractQuestion('Nem tudom eldönteni.\nGEPI_OSSZEGZES\nstatus: BLOCKED_DECISION\nGEPI_OSSZEGZES_VEGE'), 'Nem tudom eldönteni.');
});

test('full: ha a döntés után a kézirat változatlan, nincs PE-recheck, a megoldásíró a döntéssel folytat', async t => {
  const { writeFile, mkdir } = await import('node:fs/promises');
  process.env.FAKE_AUTHOR = 'decide';
  process.env.FAKE_MANUSCRIPT = 'same';
  t.after(() => { delete process.env.FAKE_AUTHOR; delete process.env.FAKE_MANUSCRIPT; });
  const first = await runPipeline('full');
  t.after(first.dirs.cleanup);
  await mkdir(join(first.dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(first.dirs.runDir, 'decisions', 'gi1-3.md'), 'Legyen 4 példa.');
  await writeFile(join(first.dirs.runDir, 'decisions', 'gi1-4.md'), 'Maradjon a kézirat, válassz alaktani opciókat.');
  const engine = new Engine({ runDir: first.dirs.runDir, config: fakeConfig(), pipeline: 'full', log: silent });
  await engine.init();
  const result = await PIPELINES.full(engine, {});
  assert.equal(result.outcome, 'COMPLETED');
  assert.deepEqual(engine.state.order, ['gi1-3', 'gi1-3-dontes', 'pe-r1', 'gi1-4', 'gi1-3-megoldas-dontes', 'gi1-4-dontes']);
});

test('a megoldó a megoldásíró tanulói nézetét kapja (opciókkal, kulcs nélkül), ha van; különben jelzi, hogy opciók nélkül', async () => {
  const { solverSheet } = await import('../lib/pipelines.mjs');
  const withView = solverSheet('Kulcs: B\n\nTANULOI_NEZET\n### GI1-P04-I01\nA: ont pris\nB: avons pris\nC: avons prendu\nTANULOI_NEZET_VEGE\n\nGEPI_OSSZEGZES', '# x');
  assert.match(withView.sheet, /C: avons prendu/);
  assert.doesNotMatch(withView.sheet, /Kulcs/);
  assert.match(withView.source, /opciókkal/);
  const without = solverSheet('nincs blokk', '### GI1-P04-I01\nNous ___\n#### Szerzői megjegyzés\nVárt alak: avons pris\n');
  assert.doesNotMatch(without.sheet, /avons pris/);
  assert.match(without.source, /OPCIÓK NÉLKÜL/);
});

test('extractQuestion: alacsonyabb szintű DÖNTÉSI KÉRDÉS-nél a következő azonos szintű fejlécnél megáll', async () => {
  const { extractQuestion } = await import('../lib/packets.mjs');
  assert.equal(extractQuestion('## 4. Opciók\n### DÖNTÉSI KÉRDÉS\nMelyik?\n| 1 | a |\n## 5. Javítás\nzaj\nGEPI_OSSZEGZES\nstatus: BLOCKED_DECISION\nGEPI_OSSZEGZES_VEGE'), 'Melyik?\n| 1 | a |');
});

test('extractPages: második szintű oldalfejléceket is felismer, az átadást levágja', async () => {
  const { extractPages } = await import('../lib/packets.mjs');
  const out = extractPages('**Szerep**\n\n## GI1-P02 — A\nx\n### Szerzői megjegyzések\ny\n## GI1-P04 — B\nz\n## Átadás a CEO-nak\nw\nGEPI_OSSZEGZES\n');
  assert.match(out, /^## GI1-P02[\s\S]*## GI1-P04 — B\nz\n$/);
  assert.doesNotMatch(out, /Átadás|Szerep/);
});

test('referenciakészlet: a „merce” a pilotpéldák nélkül, a „teljes” velük; a replay-pe02 nem kaphat pilotpéldát', async t => {
  const { referenceAttachment } = await import('../lib/pipelines.mjs');
  const merce = await referenceAttachment('merce');
  const teljes = await referenceAttachment('teljes');
  assert.match(merce, /# Referenciaanyag/);
  assert.match(merce, /Mérce feladattípusonként/);
  assert.doesNotMatch(merce, /Jó és rossz példák a Plusdeça próbáiból/);
  assert.match(teljes, /Jó és rossz példák a Plusdeça próbáiból/);
  assert.equal(await referenceAttachment(undefined), '');
  await assert.rejects(referenceAttachment('valami'));
  await assert.rejects(runPipeline('replay-pe02', { options: { ref: 'teljes' } }).then(r => { t.after(r.dirs.cleanup); }), /pilotpéldák/);
  const withRef = await runPipeline('replay-pe02', { options: { ref: 'merce' } });
  t.after(withRef.dirs.cleanup);
  const prompt = await readFile(join(withRef.dirs.runDir, 'steps', 'pe02.prompt.md'), 'utf8');
  assert.match(prompt, /# Referenciaanyag[\s\S]*GEPI_OSSZEGZES/);
});

test('full --ref teljes: az író, a PE és a megoldásíró is megkapja a referenciát', async t => {
  const { dirs } = await runPipeline('full', { options: { ref: 'teljes' } });
  t.after(dirs.cleanup);
  for (const step of ['gi1-3', 'pe-r1', 'gi1-4']) {
    const prompt = await readFile(join(dirs.runDir, 'steps', `${step}.prompt.md`), 'utf8');
    assert.match(prompt, /Jó és rossz példák a Plusdeça próbáiból/, step);
  }
});

test('segítségkérés: nem blokkol — a szerep tartaléktervvel megy tovább, a később jött választ a következő hívás kapja', async t => {
  const { writeFile, mkdir, mkdtemp } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { helpedStep, resolveHelpAnswer } = await import('../lib/pipelines.mjs');
  process.env.FAKE_HELP = 'ask';
  t.after(() => { delete process.env.FAKE_HELP; });
  const dirs = await tempDirs();
  t.after(dirs.cleanup);
  const notified = [];
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent, hooks: { onWaiting: w => { notified.push(w); } } });
  await engine.init();
  const args = { role: 'PE', provider: 'codex', kind: 'review', prompt: 'Megbízás.' + REVIEW_FOOTER };
  const r = await helpedStep(engine, 'pe', args);
  assert.equal(r.id, 'pe');
  assert.equal(r.helpRequest.id, 'segitseg-1');
  assert.equal(r.helpRequest.answered, false);
  assert.equal(r.helpRequest.duplicate, false);
  assert.equal((await callLog(dirs.stateDir)).length, 1, 'nincs újrahívás');
  assert.equal(engine.state.waiting, null, 'nem várakozik');
  assert.equal(notified.length, 1);
  assert.equal(notified[0].decisionFile, join(dirs.runDir, 'decisions', 'segitseg-1.md'));

  // A válasz a közös fájlba jön; a következő hívás (bármely szerepé) megkapja, és már nem kér.
  const repo = await mkdtemp(join(tmpdir(), 'help-'));
  await writeFile(join(repo, 'minta.txt'), 'A DELF B2 minta szövege.');
  await mkdir(join(dirs.runDir, 'decisions'), { recursive: true });
  await writeFile(join(dirs.runDir, 'decisions', 'segitseg-1.md'), `Itt van:\nFAJL: ${join(repo, 'minta.txt')}\n`);
  const next = await helpedStep(engine, 'pe-recheck1', { ...args, prompt: 'Újraellenőrzés.' + REVIEW_FOOTER });
  assert.equal(next.helpRequest, undefined);
  const prompt = await readFile(join(dirs.runDir, 'steps', 'pe-recheck1.prompt.md'), 'utf8');
  assert.match(prompt, /# A PRESIDENT válasza egy segítségkérésre \(segitseg-1\)[\s\S]*A DELF B2 minta szövege\.[\s\S]*# Gépi összegzés \(kötelező\)/);
  assert.equal(engine.state.help[0].answered, true);
  assert.deepEqual(engine.state.steps['pe-recheck1'].help, { answered: ['segitseg-1'], open: [] });
  assert.equal(notified.length, 1);
  assert.match(resolveHelpAnswer('FAJL: nincs.pdf', repo), /csak \.md vagy \.txt/);
});

test('segítségkérés: ugyanarra a forrásra futásonként egyszer — a többi kérés csak nyilvántartásba kerül, a nyitott lista minden promptban', async t => {
  const { helpedStep } = await import('../lib/pipelines.mjs');
  const { registerHelpRequest } = await import('../lib/help.mjs');
  process.env.FAKE_HELP = 'ask';
  t.after(() => { delete process.env.FAKE_HELP; });
  const dirs = await tempDirs();
  t.after(dirs.cleanup);
  const notified = [];
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent, hooks: { onWaiting: w => { notified.push(w); } } });
  await engine.init();
  const args = { role: 'PE', provider: 'codex', kind: 'review', prompt: 'Megbízás.' + REVIEW_FOOTER };
  await helpedStep(engine, 'pe', args);
  const second = await helpedStep(engine, 'nave', { ...args, role: 'NavE', prompt: 'Másik megbízás.' + REVIEW_FOOTER });
  assert.deepEqual({ id: second.helpRequest.id, duplicate: second.helpRequest.duplicate }, { id: 'segitseg-1', duplicate: true });
  assert.equal(notified.length, 1, 'egy forrás → egy értesítés');
  assert.deepEqual(engine.state.help[0].steps, ['pe', 'nave']);
  assert.match(await readFile(join(dirs.runDir, 'steps', 'nave.prompt.md'), 'utf8'), /# Már kért, még megválaszolatlan források[\s\S]*segitseg-1: FEI DELF B2 minta/);
  const other = await registerHelpRequest(engine, 'ue', 'mi kell: RFI Journal en français facile, 2026-10-12, átirat\nmit kérsz: másold be');
  assert.deepEqual({ id: other.id, duplicate: other.duplicate }, { id: 'segitseg-2', duplicate: false });
  assert.equal(notified.length, 2);
});

test('sameSource: az R11-futás eltérően fogalmazott pékségi kérései egy forrásnak számítanak, más forrás nem', async () => {
  const { sameSource } = await import('../lib/help.mjs');
  const terv = 'mi kell: 1–2 valódi francia pékség vagy pékséglánc oldala (pl. egy kézműves pékség „commande traiteur / plateaux” oldala), ahol a mini-viennoiserie-tálca előrendelése, a *formule petit-déjeuner* tartalma és ára, valamint a frissen facsart narancslé felára látszik.';
  const pe = 'mi kell: 1–2 valódi francia (lehetőleg lyoni) pékség oldala: egy előrendelhető mini-viennoiserie-tálca (darabszám, ár, csomagolás) és egy „formule petit-déjeuner” ajánlat (tartalom, ár); továbbá megerősítés, hogy pultnál leadott előrendelésnél adnak-e számozott bon de commande-ot.';
  assert.ok(sameSource(terv, pe));
  assert.ok(!sameSource(terv, 'mi kell: FEI DELF B2 minta'));
  assert.ok(sameSource('mi kell: ez https://example.org/a/', 'mi kell: valami egészen más, de https://example.org/a'));
});

test('full segítségkéréssel, válasz nélkül: a lánc várakozás és újrahívás nélkül végigmegy, egy értesítéssel', async t => {
  process.env.FAKE_HELP = 'ask';
  t.after(() => { delete process.env.FAKE_HELP; });
  const dirs = await tempDirs();
  t.after(dirs.cleanup);
  process.env.FAKE_REVIEWS = 'REVIEW_PASS';
  process.env.FAKE_MODE = 'normal';
  let notified = 0;
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 'full', log: silent, hooks: { onWaiting: () => { notified += 1; } } });
  await engine.init();
  const result = await PIPELINES.full(engine, {});
  assert.equal(result.outcome, 'COMPLETED');
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4']);
  assert.equal(notified, 1);
  assert.deepEqual(engine.state.help.map(e => e.steps), [['gi1-3', 'pe-r1', 'gi1-4']]);
});

test('full --p5: a megoldásíró blokk-JSON-ja a P5 kapuin átmegy, a CEO kitölti a review-kötést', async t => {
  delete process.env.FAKE_P5;
  const { dirs, engine, result } = await runPipeline('full', { options: { p5: true } });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED', JSON.stringify(result.checks));
  assert.equal(result.checks.p5.outcome, 'P5_PASS');
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4']);
  const prompt = await readFile(join(dirs.runDir, 'steps', 'gi1-4.prompt.md'), 'utf8');
  assert.match(prompt, /BLOKK_JSON_VEGE/);
  const block = JSON.parse(await readFile(join(dirs.runDir, 'block.w07-u-1-1.json'), 'utf8'));
  assert.equal(block.review.status, 'REVIEW_PASS');
  assert.deepEqual(block.review.manuscripts.map(m => m.file), ['review-pass.md', 'kezirat.md', 'megoldas.md']);
});

test('full --p5: kitalált mondat → P5-javítási kör → PASS; ha marad, BLOCKED_P5_GATE', async t => {
  process.env.FAKE_P5 = 'bad';
  const fixed = await runPipeline('full', { options: { p5: true } });
  t.after(fixed.dirs.cleanup);
  assert.equal(fixed.result.outcome, 'COMPLETED', JSON.stringify(fixed.result.checks));
  assert.equal(fixed.result.checks.p5.rounds, 1);
  assert.deepEqual(fixed.engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4', 'gi1-4-p5-javitas1']);
  const repairPrompt = await readFile(join(fixed.dirs.runDir, 'steps', 'gi1-4-p5-javitas1.prompt.md'), 'utf8');
  assert.match(repairPrompt, /\[CL-01\][^\n]*le bus/);

  process.env.FAKE_P5 = 'never';
  const blocked = await runPipeline('full', { options: { p5: true } });
  t.after(blocked.dirs.cleanup);
  delete process.env.FAKE_P5;
  assert.equal(blocked.result.outcome, 'BLOCKED_P5_GATE');
  assert.equal(blocked.result.checks.p5.rounds, 2);
});

test('p5-het: a P5 heti építés a CEO-ból fut, a hét állapota a kimenet', async t => {
  const { mkdtemp, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const out = await mkdtemp(join(tmpdir(), 'p5-het-'));
  const { dirs, result } = await runPipeline('p5-het', { options: { crawl: false, out } });
  t.after(async () => { await dirs.cleanup(); await rm(out, { recursive: true, force: true }); });
  assert.equal(result.outcome, 'P5_BUILT_UNCRAWLED', JSON.stringify(result.checks));
  assert.equal(result.checks.errors, 0);
  assert.match(result.checks.contentVersion, /^w01-[0-9a-f]{16}$/);
  const report = JSON.parse(await readFile(join(dirs.runDir, 'p5-week-report.json'), 'utf8'));
  assert.equal(report.steps.compile.status, 'COMPILED');
});

test('full --solver: üres problémalista → COMPLETED, nincs visszacsatolási kör', async t => {
  const { dirs, engine, result } = await runPipeline('full', { options: { solver: 'claude' } });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(result.checks.solverProblems, 0);
  assert.equal(result.checks.solverRounds, 0);
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4', 'solver']);
});

test('full --solver: a megoldó problémái visszamennek → szerző javít → PE-recheck → megoldásíró → megoldó újra', async t => {
  const { dirs, engine, result } = await runPipeline('full', { options: { solver: 'claude' }, solverProblems: '2,0' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(result.checks.solverRounds, 1);
  assert.equal(result.checks.solverProblems, 0);
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4', 'solver', 'gi1-3-megoldo1', 'pe-megoldo1', 'gi1-4-megoldo1', 'solver2']);
  const fix = await readFile(join(dirs.runDir, 'steps', 'gi1-3-megoldo1.prompt.md'), 'utf8');
  assert.match(fix, /Kéziratjavítás a független megoldó jelentése alapján/);
  assert.match(fix, /A független megoldó jelentése/);
  assert.match(fix, /A megoldásíró kulcsa és megoldása/);
  const resolve = await readFile(join(dirs.runDir, 'steps', 'gi1-4-megoldo1.prompt.md'), 'utf8');
  assert.match(resolve, /A független megoldó jelentése/);
  assert.match(resolve, /elfogadott alternatívaként/);
  const recheck = await readFile(join(dirs.runDir, 'steps', 'pe-megoldo1.prompt.md'), 'utf8');
  assert.match(recheck, /ezért javított a szerző/);
});

test('full --solver: ha a probléma a javítás után is marad, a lánc nem COMPLETED, hanem megáll', async t => {
  const { dirs, result } = await runPipeline('full', { options: { solver: 'claude' }, solverProblems: '2' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'BLOCKED_SOLVER_FINDINGS');
  assert.equal(result.checks.solverRounds, 1);
  assert.equal(result.checks.solverProblems, 2);
});

test('full --solver: ha a szerző szerint a kézirat jó (KEZIRAT_VALTOZATLAN), nincs PE-recheck, csak a kulcs bővül', async t => {
  process.env.FAKE_MANUSCRIPT = 'same';
  t.after(() => { delete process.env.FAKE_MANUSCRIPT; });
  const { dirs, engine, result } = await runPipeline('full', { options: { solver: 'claude' }, solverProblems: '1,0' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-4', 'solver', 'gi1-3-megoldo1', 'gi1-4-megoldo1', 'solver2']);
});

test('full --solver: gépi összegzés nélküli megoldói válasznál megáll', async t => {
  const { dirs, result } = await runPipeline('full', { options: { solver: 'claude' }, solverProblems: 'none' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'BLOCKED_UNPARSEABLE_SOLVER');
});

test('full: PASS minor findinggal → egy javítási kör a minorokra, utána tovább', async t => {
  const { dirs, engine, result } = await runPipeline('full', { minor: '2,0' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(result.checks.minorRounds, 1);
  assert.equal(result.checks.openMinor, 0);
  assert.deepEqual(engine.state.order, ['gi1-3', 'pe-r1', 'gi1-3-rev1', 'pe-recheck1', 'gi1-4']);
});

test('full: makacs minor nem pörget: egy minor-kör után a megmaradt minor a jelentésbe kerül', async t => {
  const { dirs, result } = await runPipeline('full', { minor: '2' });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.equal(result.checks.minorRounds, 1);
  assert.equal(result.checks.openMinor, 2);
});

test('replay-javitas: az író a kézi első válaszát és a kézi PE-02 jelentést kapja, utána célzott recheck', async t => {
  const { dirs, engine, result, calls } = await runPipeline('replay-javitas');
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  assert.deepEqual(calls.map(c => c.split('\t')[0]), ['author', 'review']);
  assert.deepEqual(engine.state.order, ['gi1-3-rev1', 'pe-recheck1']);
  const fix = await readFile(join(dirs.runDir, 'steps', 'gi1-3-rev1.prompt.md'), 'utf8');
  assert.match(fix, /# A saját korábbi válaszod/);
  assert.match(fix, /# A PE jelentése/);
  assert.match(fix, /PE02-F01/);
  const recheck = await readFile(join(dirs.runDir, 'steps', 'pe-recheck1.prompt.md'), 'utf8');
  assert.match(recheck, /Melléklet 3 — Az író javított válasza/);
  assert.ok(result.checks.manualKnownIssues.find(i => i.id === 'PE02-F04').hits.length > 0);
  assert.equal(result.compare.length, 2);
});

test('replay-javitas agent-módban is fut, és a pilotpéldák nem mehetnek ki', async t => {
  const { dirs, result } = await runPipeline('replay-javitas', { options: { roles: 'agent' } });
  t.after(dirs.cleanup);
  assert.equal(result.outcome, 'COMPLETED');
  await assert.rejects(runPipeline('replay-javitas', { options: { ref: 'teljes' } }), /pilotpéldák/);
});

test('folytatás új kóddal: csak a szerepleírás változott → a kész lépés marad; a régi <lépés>-segitseg eredménye számít', async t => {
  const { writeFile } = await import('node:fs/promises');
  const { helpedStep } = await import('../lib/pipelines.mjs');
  const dirs = await tempDirs();
  t.after(dirs.cleanup);
  const args = agentText => ({ role: 'PE', provider: 'codex', kind: 'review', agent: { name: 'plusdeca-pe', instructions: agentText }, prompt: 'Megbízás.' + REVIEW_FOOTER });
  const first = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent });
  await first.init();
  await first.step('pe', args('régi szerepleírás'));
  // A régi kód a válasz után pe-segitseg néven újrafuttatta a lépést.
  first.state.steps['pe-segitseg'] = { status: 'DONE', summary: { verdict: 'REVIEW_PASS' } };
  await first.save();
  await writeFile(join(dirs.runDir, 'steps', 'pe-segitseg.out.md'), 'a régi segítség utáni válasz');

  const resumed = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent });
  await resumed.init();
  const r = await helpedStep(resumed, 'pe', args('új szerepleírás'));
  assert.equal(r.id, 'pe-segitseg');
  assert.equal(r.text, 'a régi segítség utáni válasz');
  assert.equal((await callLog(dirs.stateDir)).length, 1, 'nincs újrahívás');
  await assert.rejects(resumed.tryCached(() => resumed.step('pe', { ...args('új szerepleírás'), prompt: 'Más megbízás.' + REVIEW_FOOTER })), /a bemenet megváltozott/);
});

test('BLOKK_JSON-lépés: a P5-séma, -minta és -katalógus a munkamappába kerül; --ujrafuttat elveti és újrafuttatja a lépést', async t => {
  const { existsSync } = await import('node:fs');
  const dirs = await tempDirs();
  t.after(dirs.cleanup);
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent });
  await engine.init();
  const args = { role: 'GI1-4', provider: 'codex', prompt: 'Megbízás.\n\nBLOKK_JSON\n{ … }\nBLOKK_JSON_VEGE\n' };
  await engine.step('gi1-4-p5-javitas1', args);
  for (const f of ['p5/schema/block.schema.json', 'p5/playable-types.json', 'p5/examples/block.w01-u-2-1.json', 'p5/examples/order-page.w01-u-1-1-p23.json']) {
    assert.ok(existsSync(join(engine.workdirFor('gi1-4-p5-javitas1'), f)), f);
  }
  assert.equal(engine.state.steps['gi1-4-p5-javitas1'].workFiles.length, 5);
  await engine.step('masik', { role: 'PE', provider: 'codex', prompt: 'Nincs blokk.' });
  assert.equal(engine.state.steps.masik.workFiles, undefined);

  assert.deepEqual(await engine.discardSteps('gi1-4-p5'), ['gi1-4-p5-javitas1']);
  assert.ok(existsSync(join(dirs.runDir, 'steps', 'gi1-4-p5-javitas1.elvetett-1.out.md')));
  assert.equal(engine.state.discarded[0].id, 'gi1-4-p5-javitas1');
  const again = await engine.step('gi1-4-p5-javitas1', args);
  assert.ok(!again.cached, 'újra fut');
  assert.equal((await callLog(dirs.stateDir)).length, 3);
});

test('v2-szerződés: a még el nem készült helyi hang a láncban HIANYZIK-figyelmeztetés, az átvételnél hiba', async () => {
  const { contractFindings } = await import('../lib/p5.mjs');
  const { readFile } = await import('node:fs/promises');
  const { paths } = await import('../lib/paths.mjs');
  const block = JSON.parse(await readFile(join(paths.repo, 'p5', 'blocks', 'w01', 'block.w01-u-5-3.json'), 'utf8'));
  block.media = [{ id: 'audio-1', kind: 'audio', access: 'local', file: 'w01-u-5-3-nincs-ilyen.wav', alternative: 'Átirat.' }];
  const pending = await contractFindings(block, { mediaPending: true });
  assert.ok(pending.some(f => f.severity === 'warning' && /HIANYZIK: w01-u-5-3-nincs-ilyen\.wav/.test(f.message)));
  assert.ok(!pending.some(f => f.severity === 'error'), JSON.stringify(pending));
  const strict = await contractFindings(block);
  assert.ok(strict.some(f => f.severity === 'error' && /MEDIA_FILE_MISSING/.test(f.message)));
});

test('v2-szerződés: a még hiányzó ABX-hangok helyőrzői nem esnek egy címre (nincs hamis ABX_ASSET_IDENTITY)', async () => {
  const { contractFindings } = await import('../lib/p5.mjs');
  const { readFile } = await import('node:fs/promises');
  const { paths } = await import('../lib/paths.mjs');
  const block = JSON.parse(await readFile(join(paths.repo, 'p5', 'blocks', 'w01', 'block.w01-u-5-3.json'), 'utf8'));
  const ids = ['abx-a', 'abx-b', 'abx-x'];
  block.media = ids.map(id => ({ id, kind: 'audio', access: 'local', file: `w01-u-5-3-${id}-nincs.wav`, alternative: 'Egy francia szó.' }));
  block.pages.find(p => p.items?.length).items.push({
    id: `${block.id}-abx-proba`, capability: 'CAP-abx', variant: 'PV-phonetics-abx', prompt: 'Az X az A-val vagy a B-vel egyezik?',
    response: { type: 'abx', tokens: [{ role: 'A', mediaRef: 'abx-a', speaker: 's', category: 'y' }, { role: 'B', mediaRef: 'abx-b', speaker: 's', category: 'u' }, { role: 'X', mediaRef: 'abx-x', speaker: 's', category: 'y' }] },
    solution: { type: 'abx', key: 'A' }, evaluation: { mode: 'exact', scoring: 'scored' }, mediaRefs: ids,
  });
  const found = await contractFindings(block, { mediaPending: true });
  assert.equal(found.filter(f => /HIANYZIK/.test(f.message)).length, 3);
  assert.ok(!found.some(f => /ABX_ASSET_IDENTITY/.test(f.message)), JSON.stringify(found));
});

test('P5-kapu: a szerződéshiba a CL-01-hibákkal egy körben jön (11-15; az 1. héten külön kört vitt el)', async () => {
  const { checkBlockOutput } = await import('../lib/p5.mjs');
  const { readFile } = await import('node:fs/promises');
  const { paths } = await import('../lib/paths.mjs');
  const block = JSON.parse(await readFile(join(paths.repo, 'p5', 'blocks', 'w01', 'block.w01-u-5-3.json'), 'utf8'));
  delete block.review;
  block.pages.flatMap(p => p.items ?? [])[0].solution = { type: 'choice', keyOptionIds: ['nincs'] };
  const pe = 'GEPI_OSSZEGZES\nverdict: REVIEW_PASS\nblocker: 0\nmajor: 0\nminor: 0\nGEPI_OSSZEGZES_VEGE\n';
  const r = await checkBlockOutput(`BLOKK_JSON\n${JSON.stringify(block)}\nBLOKK_JSON_VEGE\n`, {
    blockId: block.id, files: [{ file: 'pe.md', text: pe }, { file: 'kezirat.md', text: '# Kézirat\nmás szöveg' }],
  });
  assert.equal(r.ok, false);
  assert.ok(r.findings.some(f => f.cl === 'CL-01' && f.severity === 'error'));
  assert.ok(r.findings.some(f => f.cl === 'CONTRACT' && /KEY_SHAPE/.test(f.message)), 'a szerződéshiba is ugyanebben a körben');
});

test('P5-javítás: a használhatatlan (változatlan vagy formai hibás) leadás egyszer ingyen újrakérve, a kör nem számít', async t => {
  const { p5Gate } = await import('../lib/p5.mjs');
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const calls = [];
  const engine = { dryRun: false, runDir: dirs.runDir, log: () => {} };
  const gate = await p5Gate(engine, {
    blockId: 'w01-u-9-9', files: [], text: 'nincs blokk', maxRounds: 2, outDir: dirs.runDir,
    repair: async (findings, n) => { calls.push({ n, findings }); return 'nincs blokk'; },
  });
  assert.equal(gate.outcome, 'BLOCKED_P5_GATE');
  assert.equal(gate.rounds, 2);
  assert.deepEqual(calls.map(c => c.n), [1, '1u', 2], 'kapunként egy ingyen újrakérés');
  assert.match(calls[1].findings, /nem volt használható/);
});

test('nyilvános forrás: a CEO maga tölti le, nincs értesítés; ha nem sikerül, az értesítés Áronnak szól (fetchFailed)', async t => {
  const { registerHelpRequest, fetchPublicSource, collectHelp } = await import('../lib/help.mjs');
  const { headOf } = await import('../lib/problems.mjs');
  const page = `<html><head><style>x{}</style></head><body><nav>menü</nav><p>${'Le texte public de la page. '.repeat(60)}</p></body></html>`;
  const fetchOk = async () => ({ ok: true, headers: { get: () => 'text/html; charset=utf-8' }, text: async () => page });
  assert.match(await fetchPublicSource('mi kell: a cikk https://example.org/cikk', { fetchImpl: fetchOk }), /--- https:\/\/example\.org\/cikk ---\nLe texte public/);
  assert.equal(await fetchPublicSource('mi kell: a tankönyv hanganyaga https://example.org/cd', { fetchImpl: fetchOk }), null, 'zárt forrásra nem próbálkozik');
  assert.equal(await fetchPublicSource('mi kell: https://example.org/x', { fetchImpl: async () => ({ ok: true, headers: { get: () => 'text/html' }, text: async () => '<p>Elfogadja a sütiket?</p>' }) }), null, 'süti-fal nem forrás');

  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const notified = [];
  const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent, hooks: {
    onWaiting: w => { notified.push(w); },
    fetchSource: async req => (/jo/.test(req) ? 'A LETÖLTÖTT SZÖVEG' : null),
  } });
  await engine.init();
  await registerHelpRequest(engine, 'pe', 'mi kell: a jo oldal https://example.org/jo\ntartalékterv: belső');
  assert.equal(notified.length, 0);
  const { answered } = await collectHelp(engine);
  assert.match(answered[0].text, /A CEO maga töltötte le[\s\S]*A LETÖLTÖTT SZÖVEG/);
  await registerHelpRequest(engine, 'nave', 'mi kell: egy másik rossz oldal https://example.org/rossz\ntartalékterv: belső');
  assert.equal(notified.length, 1);
  assert.equal(notified[0].fetchFailed, true);
  assert.equal(headOf('BLOCKED_ACCESS', {}, { checks: { question: notified[0].question, fetchFailed: true } }).owner, true);
  assert.notEqual(headOf('BLOCKED_ACCESS', {}, { checks: { question: notified[0].question } }).owner, true);
});
