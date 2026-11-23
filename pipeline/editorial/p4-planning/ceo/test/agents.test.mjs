import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse as parseToml } from 'smol-toml';
import { roles, blocks } from '../../starter-kits/roles.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import {
  AUTOMATED_ORG, ITEM_CHECKLIST, NOT_GENERATED, buildAgents, commonCore, renderAgentFiles, renderClaudeAgent, renderCodexToml, tomlMultiline,
} from '../lib/agent-defs.mjs';
import { prepareAgentCall, probeAgent } from '../lib/agents.mjs';
import { buildCommand } from '../lib/providers.mjs';
import { syncAgents } from '../build-agents.mjs';
import { probeAgentModes } from '../ceo.mjs';
import { Engine, StepError } from '../lib/engine.mjs';
import { invokeProvider } from '../lib/providers.mjs';
import { fakeConfig, tempDirs, callLog, silent } from './helpers.mjs';

const agents = buildAgents();
const byName = name => agents.find(a => a.name === name);

test('16 Codex-agent és 1 Claude-agent, egyedi, szabályos nevekkel', () => {
  assert.equal(agents.filter(a => a.platform === 'codex').length, 16);
  assert.deepEqual(agents.filter(a => a.platform === 'claude').map(a => a.name), ['plusdeca-solver']);
  const names = agents.map(a => a.name);
  assert.equal(new Set(names).size, names.length);
  for (const n of names) assert.match(n, /^plusdeca-[a-z]+(-[a-z]+)*$/);
});

test('minden régi szerep vagy véglegesített agentforrást kapott, vagy indokoltan maradt ki', () => {
  const srcDir = new URL('../agents-src/', import.meta.url);
  const files = new Set(readdirSync(srcDir));
  const ROLE_FILE = { FR: 'FR.md', GR: 'GR.md', RR: 'RR.md', VR: 'VR.md', XR: 'XR.md', F: 'F.md', PE: 'PE.md', NavE: 'NavE.md', NyE: 'NyE.md', HE: 'HE.md', UE: 'UE.md' };
  for (const r of roles) {
    if (NOT_GENERATED[r.id] || (/-5$/.test(r.id) && NOT_GENERATED['*-5'])) continue;
    const file = ROLE_FILE[r.id] ?? (/-[123]$/.test(r.id) ? 'BLOKKIRO.md' : /-4$/.test(r.id) ? 'MEGOLDASIRO.md' : null);
    assert.ok(file && files.has(file), `${r.id}: nincs agentforrás`);
  }
  // Minden forrásfájlt használ legalább egy agent (nincs árva szöveg).
  const used = new Set(agents.flatMap(a => a.sourceRoles).filter(x => x.startsWith('agents-src/')).map(x => x.slice('agents-src/'.length)));
  for (const f of files) if (!['KOZOS.md', 'ELLENORZOLISTA.md'].includes(f)) assert.ok(used.has(f), `${f}: egyik agent sem használja`);
});

test('a szerepleírások teljesek, helyőrzőmentesek és nem duzzadtak', () => {
  for (const a of agents) {
    assert.doesNotMatch(a.instructions, /\{\{|ASSIGNMENT START|ASSIGNMENT END/, a.name);
    // 30 000 (S25, 11-15): a T27 állandó szabálya szó szerint a közös alapba került (PRESIDENT-parancs), ez minden agentben ~1,8 KB.
    assert.ok(Buffer.byteLength(a.instructions) < 30_000, `${a.name}: ${Buffer.byteLength(a.instructions)} B`);
    if (a.platform === 'codex') {
      assert.ok(a.instructions.includes(AUTOMATED_ORG), a.name);
      assert.ok(a.instructions.includes('GEPI_OSSZEGZES'), a.name);
      assert.doesNotMatch(a.instructions, /## Szervezet és határok/, `${a.name}: a régi szervezetleírás bent maradt`);
    }
  }
});

test('a blokkírók a saját oszlopuk blokkjait kapják; a forrásszövegek változatlanul kerülnek be', () => {
  const src = f => readFileSync(new URL(`../agents-src/${f}`, import.meta.url), 'utf8').trim();
  for (const [col, lead] of [['g', 'GI'], ['r', 'RI'], ['v', 'VI'], ['x', 'XI']]) {
    const writer = byName(`plusdeca-${col}-iro`);
    const table = writer.instructions.slice(writer.instructions.indexOf('## Az oszlop blokkjai'), writer.instructions.indexOf('# Közös alap'));
    const own = blocks.filter(b => b[3] === lead).map(b => b[0]);
    const other = blocks.filter(b => b[3] !== lead).map(b => b[0]);
    for (const id of own) assert.ok(table.includes(`| ${id} |`), `${writer.name}: ${id}`);
    for (const id of other) assert.ok(!table.includes(`| ${id} |`), `${writer.name}: idegen blokk ${id}`);
    assert.ok(writer.instructions.includes(src('BLOKKIRO.md')));
    assert.ok(!writer.instructions.includes(src('MEGOLDASIRO.md')), `${writer.name}: a megoldás nem a blokkíróé`);
  }
  for (const [file, name] of [['FR.md', 'fr'], ['GR.md', 'gr'], ['RR.md', 'rr'], ['VR.md', 'vr'], ['XR.md', 'xr'], ['MEGOLDASIRO.md', 'megoldasiro'], ['F.md', 'f'], ['PE.md', 'pe'], ['NavE.md', 'nave'], ['NyE.md', 'nye'], ['HE.md', 'he'], ['UE.md', 'ue']]) {
    const a = byName(`plusdeca-${name}`);
    assert.ok(a.instructions.includes(src(file)), file);
    if (a.platform === 'codex') assert.ok(a.instructions.includes(commonCore()), `${a.name}: közös alap`);
  }
  for (const n of ['pe', 'nave', 'nye', 'he', 'ue']) assert.ok(byName(`plusdeca-${n}`).instructions.includes(src('ELLENOR-KOZOS.md')), n);
  for (const n of ['fr', 'gr', 'g-iro', 'megoldasiro', 'f']) assert.ok(!byName(`plusdeca-${n}`).instructions.includes(src('ELLENOR-KOZOS.md')), n);
});

test('tomlMultiline: idézőjel, hármas idézőjel, visszaper, vezérlőkarakter és CRLF oda-vissza', () => {
  const nasty = 'a "b" """c""" \\d \\n e\r\nf\tg\u0001h „magyar” ’apostrof’ $x';
  const parsed = parseToml(`v = ${tomlMultiline(nasty)}\n`);
  assert.equal(parsed.v, nasty.replace(/\r\n/g, '\n'));
});

test('a generált Codex-TOML érvényes, és pontosan a szerepleírást adja vissza', () => {
  for (const a of agents.filter(x => x.platform === 'codex')) {
    const t = parseToml(renderCodexToml(a));
    assert.equal(t.name, a.name);
    assert.equal(t.description, a.description);
    assert.equal(t.developer_instructions, a.instructions, a.name);
    assert.equal(t.sandbox_mode, 'read-only');
    assert.equal(t.model_reasoning_effort, 'high');
  }
});

test('a Claude-agent fejléce érvényes, a megoldó nem lát eszközt kérő utasítást', () => {
  const md = renderClaudeAgent(byName('plusdeca-solver'));
  const [, front, body] = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.match(front, /^name: plusdeca-solver$/m);
  assert.equal(JSON.parse(front.match(/^description: (.*)$/m)[1]), byName('plusdeca-solver').description);
  assert.match(body, /Független megoldó/);
  assert.match(body, /csak a kapott szövegből dolgozz/);
});

test('a repóban lévő agentfájlok szinkronban vannak a szerepkártyákkal (különben: node build-agents.mjs)', async () => {
  const r = await syncAgents({ check: true, log: silent });
  assert.deepEqual({ changed: r.changed, stale: r.stale }, { changed: [], stale: [] });
});

test('syncAgents ír, majd az elavult generált fájlt törli, a kézzel írtat nem', async () => {
  const root = await mkdtemp(join(tmpdir(), 'plusdeca-agents-'));
  try {
    await mkdir(join(root, '.codex', 'agents'), { recursive: true });
    const sample = Object.values(renderAgentFiles())[0];
    await writeFile(join(root, '.codex', 'agents', 'regi.toml'), sample);
    await writeFile(join(root, '.codex', 'agents', 'sajat.toml'), 'name = "sajat"\n');
    const first = await syncAgents({ root, log: silent });
    assert.equal(first.changed.length, 17);
    assert.deepEqual(first.stale, ['.codex/agents/regi.toml']);
    assert.ok(!existsSync(join(root, '.codex', 'agents', 'regi.toml')));
    assert.ok(existsSync(join(root, '.codex', 'agents', 'sajat.toml')));
    assert.ok((await syncAgents({ root, check: true, log: silent })).ok);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('prepareAgentCall: a négy mód a megfelelő helyre teszi a szerepleírást', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'plusdeca-mode-'));
  try {
    const pe = byName('plusdeca-pe');
    const solver = byName('plusdeca-solver');
    const plain = await prepareAgentCall(null, null, { workdir: dir, prompt: 'P' });
    assert.deepEqual(plain, { prompt: 'P', agentArgs: [], mode: 'package' });

    const inline = await prepareAgentCall('inline', pe, { workdir: dir, prompt: 'MEGBÍZÁS' });
    assert.ok(inline.prompt.includes(pe.instructions) && inline.prompt.endsWith('MEGBÍZÁS'));

    const md = await prepareAgentCall('agents-md', pe, { workdir: join(dir, 'a'), prompt: 'MEGBÍZÁS' }).catch(e => e);
    assert.ok(md instanceof Error, 'nem létező munkamappába nem ír csendben');
    await mkdir(join(dir, 'a'));
    const md2 = await prepareAgentCall('agents-md', pe, { workdir: join(dir, 'a'), prompt: 'MEGBÍZÁS' });
    assert.equal(md2.prompt, 'MEGBÍZÁS');
    assert.equal(await readFile(join(dir, 'a', 'AGENTS.md'), 'utf8'), pe.instructions);

    const spawn = await prepareAgentCall('codex-spawn', pe, { workdir: join(dir, 's'), prompt: 'MEGBÍZÁS' });
    assert.match(spawn.prompt, /plusdeca-pe[\s\S]*<<<MEGBIZAS\nMEGBÍZÁS\nMEGBIZAS>>>/);
    assert.equal(parseToml(await readFile(join(dir, 's', '.codex', 'agents', 'plusdeca-pe.toml'), 'utf8')).developer_instructions, pe.instructions);

    const claude = await prepareAgentCall('claude-agent', solver, { workdir: join(dir, 'c'), prompt: 'LAP' });
    assert.deepEqual(claude.agentArgs, ['--agent', 'plusdeca-solver']);
    assert.ok(existsSync(join(dir, 'c', '.claude', 'agents', 'plusdeca-solver.md')));

    await assert.rejects(prepareAgentCall('codex-spawn', solver, { workdir: dir, prompt: 'x' }), /csak Codex/);
    await assert.rejects(prepareAgentCall('valami', pe, { workdir: dir, prompt: 'x' }), /Ismeretlen agentmód/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('buildCommand: az {agentArgs} és az extraArgs a helyére kerül; sablon nélkül agentarg nem vész el csendben', () => {
  const p = { command: 'claude', args: ['-p', '{modelArgs}', '{agentArgs}'], modelFlag: '--model' };
  assert.deepEqual(buildCommand(p, { model: 'm', agentArgs: ['--agent', 'x'], extraArgs: ['--json'] }).args, ['-p', '--model', 'm', '--json', '--agent', 'x']);
  assert.deepEqual(buildCommand(p, {}).args, ['-p']);
  assert.throws(() => buildCommand({ command: 'c', args: ['-p'] }, { agentArgs: ['--agent', 'x'] }), /agentArgs/);
});

test('a valódi alapkonfiguráció: Codex parancsfuttatás nélkül, mindkét sablonban van {agentArgs}', async () => {
  const config = JSON.parse(await readFile(new URL('../config.default.json', import.meta.url), 'utf8'));
  const codex = buildCommand(config.providers.codex, { workdir: 'W', outFile: 'O', agentArgs: [] }).args;
  assert.deepEqual(codex.filter((a, i) => codex[i - 1] === '--disable'), ['shell_tool', 'unified_exec']);
  assert.ok(config.providers.codex.args.includes('{agentArgs}') && config.providers.claude.args.includes('{agentArgs}'));
  assert.equal(config.providers.codex.agentMode, 'inline');
  assert.equal(config.workRoot, null);
});

for (const mode of ['inline', 'agents-md', 'codex-spawn']) {
  test(`Engine agenttel (${mode}): a hamis CLI megkapja a szerepleírást, az állapot rögzíti az agentet`, async () => {
    const dirs = await tempDirs();
    try {
      const pe = byName('plusdeca-pe');
      const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({}, { codex: mode }), pipeline: 't', log: silent });
      await engine.init();
      const r = await engine.step('pe', { role: 'PE', provider: 'codex', kind: 'review', agent: pe, prompt: 'A megbízás.\nverdict: REVIEW_PASS | REVISION_REQUIRED' });
      assert.equal(r.summary.verdict, 'REVIEW_PASS');
      const [line] = await callLog(dirs.stateDir);
      const [, , files, contextBytes] = line.split('\t');
      assert.equal(files, { inline: '', 'agents-md': 'AGENTS.md', 'codex-spawn': '.codex/agents' }[mode]);
      assert.ok(Number(contextBytes) > Buffer.byteLength(pe.instructions));
      const s = engine.state.steps.pe;
      assert.equal(s.agent, 'plusdeca-pe');
      assert.equal(s.agentMode, mode);
      assert.ok(s.contextBytes >= Buffer.byteLength(pe.instructions));
      assert.ok(existsSync(join(dirs.runDir, 'steps', 'pe.agent.md')));
    } finally {
      await dirs.cleanup();
    }
  });
}

test('Engine: ha az agentmód megváltozik, a kész lépést nem használja újra csendben (11-15 óta újrafut)', async () => {
  const dirs = await tempDirs();
  try {
    const pe = byName('plusdeca-pe');
    const step = { role: 'PE', provider: 'codex', kind: 'review', agent: pe, prompt: 'verdict: REVIEW_PASS | REVISION_REQUIRED' };
    const first = new Engine({ runDir: dirs.runDir, config: fakeConfig({}, { codex: 'inline' }), pipeline: 't', log: silent });
    await first.init();
    await first.step('pe', step);
    const second = new Engine({ runDir: dirs.runDir, config: fakeConfig({}, { codex: 'agents-md' }), pipeline: 't', log: silent });
    await second.init();
    await assert.rejects(second.tryCached(() => second.step('pe', step)), StepError);
    const again = await second.step('pe', step);
    assert.ok(!again.cached, 'a lépés újrafut, nem a régi eredmény jön');
  } finally {
    await dirs.cleanup();
  }
});

test('Engine claude-agent módban a megoldót --agent kapcsolóval hívja, és a hamis CLI megoldóként ismeri fel', async () => {
  const dirs = await tempDirs();
  try {
    const engine = new Engine({ runDir: dirs.runDir, config: fakeConfig({}, { claude: 'claude-agent' }), pipeline: 't', log: silent });
    await engine.init();
    const r = await engine.step('solver', { role: 'SOLVER', provider: 'claude', kind: 'solver', agent: byName('plusdeca-solver'), prompt: '# feladatlap' });
    assert.match(r.text, /avons pris/);
    const [line] = await callLog(dirs.stateDir);
    assert.match(line, /^solver\t.*--agent plusdeca-solver/);
  } finally {
    await dirs.cleanup();
  }
});

test('probeAgentModes: működő CLI-nél minden mód átmegy, és ajánlást ad', async () => {
  const dirs = await tempDirs();
  const logs = [];
  try {
    const { results } = await probeAgentModes(fakeConfig(), { log: m => logs.push(m), root: join(dirs.root, 'probe'), outDir: join(dirs.root, 'probe-out') });
    assert.deepEqual(results.map(r => `${r.provider}/${r.mode}:${r.ok}`), [
      'codex/inline:true', 'codex/agents-md:true', 'codex/codex-spawn:true', 'claude/inline:true', 'claude/claude-agent:true',
    ]);
    assert.ok(logs.some(l => /codex: a\(z\) „agents-md” mód működik/.test(l)));
    assert.ok(existsSync(join(dirs.root, 'probe', 'codex-codex-spawn', 'events.jsonl')));
    // A próba a jelszót csak a szerepleírásban adja át, a kérdésben nem.
    assert.ok((await callLog(dirs.stateDir)).every(l => l.startsWith('probe\t')));
  } finally {
    await dirs.cleanup();
  }
});

test('probeAgentModes: ha a CLI nem tölti be az agentet, csak az inline megy át, és ezt meg is mondja', async () => {
  const dirs = await tempDirs();
  const logs = [];
  process.env.FAKE_MODE = 'noagent';
  try {
    const { results } = await probeAgentModes(fakeConfig(), { log: m => logs.push(m), root: join(dirs.root, 'probe'), outDir: join(dirs.root, 'probe-out') });
    assert.deepEqual(results.filter(r => r.ok).map(r => `${r.provider}/${r.mode}`), ['codex/inline', 'claude/inline']);
    assert.ok(logs.some(l => /codex: csak az „inline” mód működik/.test(l)));
  } finally {
    delete process.env.FAKE_MODE;
    await dirs.cleanup();
  }
});

test('a próbaagent jelszava nincs a kérdésben (különben a próba semmit nem bizonyítana)', async () => {
  const { PROBE_QUESTION } = await import('../lib/agents.mjs');
  const agent = probeAgent('codex', 'PD-ABC123');
  assert.ok(agent.instructions.includes('PD-ABC123'));
  assert.ok(!PROBE_QUESTION.includes('PD-'));
  assert.ok(typeof invokeProvider === 'function');
});

test('a régi szervezet kifejezései nem maradnak a szerepleírásokban (a magyarázó bekezdésen kívül)', () => {
  for (const a of agents) {
    const text = a.instructions.replace(AUTOMATED_ORG, '');
    assert.doesNotMatch(text, /főíró|öt fázis|FR→rendező→főíró/, a.name);
    assert.doesNotMatch(text, /(?<![\/\w])(GI|RI|VI|XI)(?![\w\/])/, `${a.name}: megszűnt szerep-ID`);
    assert.doesNotMatch(text, /PE-ként/, a.name);
  }
});

test('ellenőrzőlista a blokkíróknál, a megoldásírónál és a PE-nél; NavE-fókusz; F-formátum; Kézirat-szabály', () => {
  for (const n of ['g-iro', 'r-iro', 'v-iro', 'x-iro', 'megoldasiro', 'pe']) assert.ok(byName(`plusdeca-${n}`).instructions.includes(ITEM_CHECKLIST), n);
  for (const n of ['g-iro', 'r-iro', 'v-iro', 'x-iro']) assert.match(byName(`plusdeca-${n}`).instructions, /A Kézirat végén minden oldal kész\./);
  assert.match(byName('plusdeca-nave').instructions, /a jó feladat készül-e, a jó időben, a jó módon/);
  assert.match(byName('plusdeca-f').instructions, /REJTETT FELADAT KÖZBEN/);
  assert.match(byName('plusdeca-solver').instructions, /Nyílt \(írás- vagy beszéd-\) feladatnál/);
  assert.match(AUTOMATED_ORG, /Webes keresést és oldalmegnyitást használhatsz/);
});
