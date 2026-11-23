// 2026-11-15: közös ellenőri munkamenet (cache-mérés, A vs. B). Egy lektori kör ellenőrei egy előmelegített munkamenetből
// indulnak (--resume <id> --fork-session), a közös anyag elöl, a szerep és a megbízás a végén; a lépés kulcsa nem változik.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Engine } from '../lib/engine.mjs';
import { SHARED_MATERIAL_INTRO, agent, reviewedStep } from '../lib/week.mjs';
import { SHARED_REVIEWER_NAME, renderAgentFiles, reviewerRoleText, sharedReviewerAgent } from '../lib/agent-defs.mjs';
import { parseStreamJson } from '../lib/usage.mjs';
import { fakeConfig, silent, tempDirs } from './helpers.mjs';

const MARK = 'ANYAG-JELOLO-4711';
const AUTHOR_TEXT = `# Kézirat\n\n${MARK}: a vizsgálandó szöveg.\n\nGEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n`;
const review = verdict => `jelentés\n\nGEPI_OSSZEGZES\nverdict: ${verdict}\nblocker: 0\nmajor: ${verdict === 'REVIEW_PASS' ? 0 : 1}\nminor: 0\nGEPI_OSSZEGZES_VEGE\n`;
const author = { role: 'BLOKKIRO', provider: 'codex', prompt: '# Megbízás\n' };
const rev = name => ({ name, provider: 'claude', agent: agent(name), scope: 'próba', focus: 'próba' });

/** Hamis CLI: rögzíti a hívásokat; az előmelegítés munkamenet-azonosítót ad, a többi hívás a fail(id, args) szerint. */
function fakeCli({ warmSession = 'S-warm', fail = () => false } = {}) {
  const calls = [];
  const invoke = async (_provider, { outFile, prompt, workdir, agentArgs = [], extraArgs = [] }) => {
    const id = basename(outFile).replace(/\.out\.md$/, '');
    calls.push({ id, prompt, workdir, agentArgs, extraArgs });
    if (id === 'elomelegites') return { code: 0, text: 'OK', stdout: '', stderr: '', ms: 1, stream: { sessionId: warmSession, usage: null } };
    if (fail(id, extraArgs)) return { code: 1, text: '', stdout: 'No conversation found', stderr: '', ms: 1 };
    const text = id.startsWith('x-') && id !== 'x' ? review('REVIEW_PASS') : AUTHOR_TEXT;
    return { code: 0, text, stdout: '', stderr: '', ms: 1, stream: { sessionId: `S-${id}`, usage: null } };
  };
  return { invoke, calls };
}

async function engineFor(dirs, invoke, { shared = true, peRuns = 2, effortTemplate = false } = {}) {
  const config = fakeConfig({ peRuns, maxCalls: 40 });
  config.providers.claude.sharedSession = true;
  // A valódi claude-szolgáltatónak nincs effortTemplate-je: a gondolkodási szint nem megy ki a CLI-nek.
  if (!effortTemplate) delete config.providers.claude.effortTemplate;
  if (!shared) config.sharedReviewSession = false;
  const engine = new Engine({ runDir: dirs.runDir, config, pipeline: 'test', log: silent, invoke });
  await engine.init();
  return engine;
}
const run = (engine, reviewers) => reviewedStep(engine, { id: 'x', author, reviewers, requirement: [['Követelmény', 'K-SZÖVEG']], maxRounds: 2 });

test('közös munkamenet: egy előmelegítés a közös anyaggal, az ellenőrök azt folytatják, a szerep a végén', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const cli = fakeCli();
  const engine = await engineFor(dirs, cli.invoke);
  const r = await run(engine, [rev('PE'), rev('NyE'), rev('UE')]);
  assert.ok(!r.blocked);
  const warm = cli.calls.filter(c => c.id === 'elomelegites');
  assert.equal(warm.length, 1, 'a párhuzamos ellenőrök egy előmelegítést várnak meg');
  assert.ok(warm[0].prompt.startsWith(SHARED_MATERIAL_INTRO));
  assert.match(warm[0].prompt, new RegExp(MARK));
  assert.match(warm[0].prompt, /K-SZÖVEG/);
  assert.doesNotMatch(warm[0].prompt, /Szerepleírásod|Független ellenőrzés/);
  assert.deepEqual(warm[0].agentArgs, ['--agent', SHARED_REVIEWER_NAME]);
  const reviewers = cli.calls.filter(c => /^x-(pe|pe-2|nye|ue)$/.test(c.id));
  assert.deepEqual(reviewers.map(c => c.id).sort(), ['x-nye', 'x-pe', 'x-pe-2', 'x-ue'], 'a kettős PE-futás is a közös munkamenetből');
  for (const c of reviewers) {
    assert.deepEqual(c.extraArgs, ['--resume', 'S-warm', '--fork-session']);
    assert.deepEqual(c.agentArgs, ['--agent', SHARED_REVIEWER_NAME]);
    assert.equal(c.workdir, warm[0].workdir, 'a folytatás ugyanabban a munkamappában (a CLI ott keresi a munkamenetet)');
    assert.doesNotMatch(c.prompt, new RegExp(MARK), 'a közös anyag nem megy ki újra');
    assert.match(c.prompt, /^# Szerepleírásod — /);
    assert.match(c.prompt, /GEPI_OSSZEGZES_VEGE\s*$/);
  }
  assert.match(reviewers.find(c => c.id === 'x-pe').prompt, /PE_FINDINGEK/);
  assert.match(reviewers.find(c => c.id === 'x-nye').prompt, /Szerepleírásod — NyE/);
  // A lépésfájl a modell által látott teljes szöveget mutatja, a rekord a munkamenetet.
  const saved = await readFile(join(dirs.runDir, 'steps', 'x-ue.prompt.md'), 'utf8');
  assert.match(saved, new RegExp(MARK));
  assert.match(saved, /Szerepleírásod — UE/);
  assert.equal(engine.state.steps['x-ue'].sharedSession.sessionId, 'S-warm');
  assert.equal(engine.state.sharedWarmups.length, 1);
  assert.equal(engine.state.sharedWarmups[0].ok, true);
});

test('közös munkamenet: a lépés kulcsa (inputHash) a régi elrendezésé, így a kész lépések nem futnak újra', async t => {
  const a = await tempDirs(); t.after(a.cleanup);
  const shared = await engineFor(a, fakeCli().invoke);
  await run(shared, [rev('NyE'), rev('UE')]);
  const b = await tempDirs(); t.after(b.cleanup);
  const plainCli = fakeCli();
  const plain = await engineFor(b, plainCli.invoke, { shared: false });
  await run(plain, [rev('NyE'), rev('UE')]);
  assert.ok(!plainCli.calls.some(c => c.id === 'elomelegites' || c.extraArgs.length));
  for (const id of ['x-nye', 'x-ue']) assert.equal(shared.state.steps[id].inputHash, plain.state.steps[id].inputHash);
  assert.match(plainCli.calls.find(c => c.id === 'x-nye').prompt, /^# Szerepleírás — plusdeca-nye/);
});

test('közös munkamenet: ha a gondolkodási szint kimegy a CLI-nek, eltérő szintnél külön előmelegítés', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const cli = fakeCli();
  const engine = await engineFor(dirs, cli.invoke, { effortTemplate: true });
  await run(engine, [rev('PE'), rev('NyE'), rev('UE')]);
  assert.equal(cli.calls.filter(c => c.id === 'elomelegites').length, 2, 'PE (high) és a többiek (alap) külön');
});

test('közös munkamenet: egyetlen ellenőrnél nincs előmelegítés (nem érné meg)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const cli = fakeCli();
  const engine = await engineFor(dirs, cli.invoke, { peRuns: 1 });
  await run(engine, [rev('NyE')]);
  assert.ok(!cli.calls.some(c => c.id === 'elomelegites'));
  assert.deepEqual(cli.calls.find(c => c.id === 'x-nye').extraArgs, []);
});

test('közös munkamenet: ha a folytatás hibát ad, a lépés a szokásos módon újraindul', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const cli = fakeCli({ fail: (id, extraArgs) => id === 'x-ue' && extraArgs.includes('--resume') });
  const engine = await engineFor(dirs, cli.invoke);
  const r = await run(engine, [rev('NyE'), rev('UE')]);
  assert.ok(!r.blocked);
  const ue = cli.calls.filter(c => c.id === 'x-ue');
  assert.equal(ue.length, 2);
  assert.deepEqual(ue[1].extraArgs, []);
  assert.deepEqual(ue[1].agentArgs, [], 'inline módban a szerepleírás a promptban');
  assert.match(ue[1].prompt, /^# Szerepleírás — plusdeca-ue/);
  assert.match(ue[1].prompt, new RegExp(MARK));
  assert.equal(engine.state.steps['x-ue'].sharedFallback, true);
  assert.equal(engine.state.steps['x-ue'].sharedSession, undefined);
  assert.equal(engine.state.steps['x-nye'].sharedSession.sessionId, 'S-warm');
});

test('közös munkamenet: sikertelen előmelegítés után minden ellenőr a szokásos módon fut', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const cli = fakeCli({ warmSession: null });
  const engine = await engineFor(dirs, cli.invoke);
  await run(engine, [rev('NyE'), rev('UE')]);
  assert.equal(cli.calls.filter(c => c.id === 'elomelegites').length, 1);
  for (const id of ['x-nye', 'x-ue']) assert.deepEqual(cli.calls.find(c => c.id === id).extraArgs, []);
  assert.equal(engine.state.sharedWarmups[0].ok, false);
});

test('közös ellenőri agent: a közös rész a rendszerpromptban, a szerepleírás külön; a repó agentfájljai változatlanok', () => {
  const common = sharedReviewerAgent();
  const pe = agent('PE');
  assert.equal(common.name, SHARED_REVIEWER_NAME);
  assert.match(common.instructions, /előkészítő hívás/);
  // A szerepenkénti agent szerepre jellemző része nincs a közösben, a közös (KOZOS + ELLENOR-KOZOS) igen.
  assert.ok(!common.instructions.includes(pe.roleBody.slice(0, 200)));
  assert.ok(pe.instructions.endsWith(common.instructions.slice(common.instructions.indexOf('---'))));
  const text = reviewerRoleText(pe);
  assert.match(text, /^# Szerepleírásod — PE \(plusdeca-pe\)/);
  assert.ok(text.includes(pe.roleBody));
  assert.ok(!Object.keys(renderAgentFiles()).some(f => f.includes(SHARED_REVIEWER_NAME)));
});

test('parseStreamJson: a munkamenet-azonosító a result sorból', () => {
  const out = [
    JSON.stringify({ type: 'system', subtype: 'init', session_id: 'abc' }),
    JSON.stringify({ type: 'result', subtype: 'success', result: 'OK', session_id: 'abc', usage: { input_tokens: 1, output_tokens: 1 } }),
  ].join('\n');
  assert.equal(parseStreamJson(out).sessionId, 'abc');
});
