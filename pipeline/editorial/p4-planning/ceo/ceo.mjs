#!/usr/bin/env node
// CEO-vezérlő — pilotváltozat.
//
//   node ceo.mjs doctor [--probe] [--probe-agents]  ellenőrzi a Codex / Claude CLI-t; a --probe egy apró
//                                                  próbahívást tesz, a --probe-agents az agenthívási módokat méri
//   node ceo.mjs run <lánc> [--roles package|agent] [--dry-run] [--solver claude] [--pe codex|claude|claude-web] [--ref merce|teljes] [--p5 [--p5-week N]] [--run-dir <mappa>]
//   --p5: a megoldásíró blokk-JSON-t is ad, a CEO a P5 kapuival azonnal ellenőrzi (javítási körökkel).
//   node ceo.mjs run p5-het [--plan p5/weeks/week-01.plan.json] [--out p5/out] [--no-crawl] — P5 heti építés, értesítéssel.
//   node ceo.mjs agents                            kilistázza a generált agenteket
//   node ceo.mjs status                            hol tart a CEO (runs/status.json)
//   node ceo.mjs report <futásmappa>               újraírja a jelentést a mentett állapotból
//
// Láncok: replay-pe02, replay-gi1-4, replay-javitas, full, het, p5-het. Részletek: README.md.
//
// PORTFOLIO NOTE: the private version also mirrors run state to a private GitHub relay and a dashboard,
// sends e-mail notifications, and has bug-tracker and detached-run commands. Those integrations are removed
// here; notifications are printed to the console instead (see README.md, "Removed from the public copy").

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { buildAgents } from './lib/agent-defs.mjs';
import { PROBE_QUESTION, prepareAgentCall, probeAgent } from './lib/agents.mjs';
import { AuthError, Engine, LimitError, StepError, buildStatus, loadState } from './lib/engine.mjs';
import { PIPELINES, paths } from './lib/pipelines.mjs';
import { runProcess, resolveExecutable } from './lib/process.mjs';
import { invokeProvider } from './lib/providers.mjs';
import { writeReport } from './lib/report.mjs';
import { explainProblem } from './lib/problems.mjs';

/** Public copy: notifications go to the console (the private version e-mails them and archives them in a relay). */
async function notifyOutcome(_config, { outcome, checks, resumeCommand, note }) {
  console.log(`[értesítés] ${outcome}${checks?.step ? ` — ${checks.step}` : ''}${note ? `\n  ${note}` : ''}${resumeCommand ? `\n  Folytatás: ${resumeCommand}` : ''}`);
  return { sent: false };
}

export function mergeConfig(base, local) {
  if (!local) return base;
  const out = structuredClone(base);
  for (const [key, value] of Object.entries(local)) {
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? mergeConfig(out[key] ?? {}, value)
      : value;
  }
  return out;
}

export async function loadConfig(dir = paths.ceo) {
  const base = JSON.parse(await readFile(join(dir, 'config.default.json'), 'utf8'));
  const localPath = join(dir, 'config.local.json');
  const local = existsSync(localPath) ? JSON.parse(await readFile(localPath, 'utf8')) : null;
  return mergeConfig(base, local);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { _: [] };
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i];
    if (a === '--dry-run') options.dryRun = true;
    else if (a === '--probe') options.probe = true;
    else if (a === '--probe-agents') options.probeAgents = true;
    else if (a === '--roles') options.roles = rest[++i];
    else if (a === '--solver') options.solver = rest[++i];
    else if (a === '--pe') options.pe = rest[++i];
    else if (a === '--ref') options.ref = rest[++i];
    else if (a === '--run-dir') options.runDir = rest[++i];
    else if (a === '--p5') options.p5 = true;
    else if (a === '--plan') options.plan = rest[++i];
    else if (a === '--out') options.out = rest[++i];
    else if (a === '--no-crawl') options.crawl = false;
    else if (a === '--p5-week') options.p5Week = Number(rest[++i]);
    else if (a === '--brief') options.brief = rest[++i];
    else if (a === '--het') options.week = Number(rest[++i]);
    else if (a === '--blocks') options.blocks = rest[++i].split(',');
    else if (a === '--egyseg') options.egyseg = rest[++i];
    else if (a === '--ujrafuttat') (options.rerun ??= []).push(rest[++i]);
    else if (a === '--out') options.out = rest[++i];
    else if (a === '--no-p5') options.p5 = false;
    else if (a === '--t27') options.t27 = true;
    else options._.push(a);
  }
  return { command, options };
}

async function doctor(config, { probe, probeAgents }) {
  let ok = true;
  const used = new Set([...Object.values(config.assign), 'claude']);
  for (const name of used) {
    const provider = config.providers[name];
    if (!provider) continue;
    const exe = resolveExecutable(provider.command);
    if (exe.missing) {
      console.log(`✗ ${name}: a "${provider.command}" parancs nem található. ${name === 'claude' ? '(Csak a --solver claude opcióhoz kell.)' : ''}`);
      if (name !== 'claude') ok = false;
      continue;
    }
    const version = await runProcess(provider.command, ['--version'], { timeoutMs: 30_000 });
    console.log(`${version.code === 0 ? '✓' : '✗'} ${name}: ${(version.stdout || version.stderr || version.spawnError || '').trim().split('\n')[0]}`);
    if (version.code !== 0) {
      if (name !== 'claude') ok = false;
      continue;
    }
    if (provider.loginCheckArgs) {
      const login = await runProcess(provider.command, provider.loginCheckArgs, { timeoutMs: 30_000 });
      const text = `${login.stdout}${login.stderr}`.trim().split('\n')[0];
      console.log(`  ${login.code === 0 ? '✓' : '✗'} bejelentkezés: ${text || 'ismeretlen'}`);
      if (login.code !== 0) ok = false;
    }
    const help = await runProcess(provider.command, provider.helpArgs, { timeoutMs: 30_000 });
    const helpText = `${help.stdout}\n${help.stderr}`;
    const modeFlags = provider.agentMode === 'claude-agent' ? ['--agent'] : [];
    const missing = [...provider.requiredFlags, ...modeFlags].filter(f => !helpText.includes(f));
    if (missing.length) {
      console.log(`  ✗ hiányzó kapcsolók a súgóban: ${missing.join(', ')} — igazítsd a config.local.json-ban`);
      if (name !== 'claude') ok = false;
    } else {
      console.log('  ✓ a szükséges kapcsolók megvannak');
    }
    if (probe && !missing.length) {
      const dir = join(paths.ceo, 'runs', '_probe', name);
      await mkdir(dir, { recursive: true });
      const r = await invokeProvider(provider, {
        prompt: 'Ez egy kapcsolatpróba. Válaszolj pontosan ezzel az egy szóval, semmi mással: OK',
        workdir: dir, outFile: join(dir, 'out.txt'), timeoutMs: 180_000,
      });
      const good = r.code === 0 && /\bOK\b/.test(r.text);
      console.log(`  ${good ? '✓' : '✗'} próbahívás: ${Math.round(r.ms / 1000)} s, kimenet: ${JSON.stringify(r.text.trim().slice(0, 80))}${r.tokens != null ? `, tokenek: ${r.tokens}` : ''}`);
      if (!good) { ok = false; console.log(`  stderr: ${(r.stderr || r.spawnError || '').trim().slice(0, 400)}`); }
    }
  }
  if (probeAgents && ok) ok = (await probeAgentModes(config)).ok && ok;
  console.log(ok ? '\nRendben: a láncok futtathatók.' : '\nJavítandó, mielőtt futtatnál.');
  return ok;
}

/** Melyik szolgáltatónál mely agentmódokat próbáljuk ki. */
export const PROBE_MODES = { codex: ['inline', 'agents-md', 'codex-spawn'], claude: ['inline', 'claude-agent'] };

/**
 * Agenthívási próba: minden módban egy próbaagent kap egy véletlen jelszót a szerepleírásában,
 * a megbízás pedig csak rákérdez. Ha a válaszban ott a jelszó, a szerepleírás eljutott a modellhez.
 */
export async function probeAgentModes(config, { invoke = invokeProvider, log = console.log, modes = PROBE_MODES, root, outDir: outDirOption } = {}) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = root ?? join(tmpdir(), 'plusdeca-ceo', `_probe-agents-${stamp}`);
  const results = [];
  log('\nAgenthívási próba (szolgáltatónként és módonként egy apró hívás; keretet használ):');
  for (const [name, list] of Object.entries(modes)) {
    const provider = config.providers[name];
    if (!provider || resolveExecutable(provider.command).missing) continue;
    for (const mode of list) {
      const canary = `PD-${randomBytes(3).toString('hex').toUpperCase()}`;
      const workdir = join(base, `${name}-${mode}`);
      await mkdir(workdir, { recursive: true });
      const agent = probeAgent(name === 'claude' ? 'claude' : 'codex', canary);
      const prepared = await prepareAgentCall(mode, agent, { workdir, prompt: PROBE_QUESTION });
      const extraArgs = mode === 'codex-spawn' && provider.jsonFlag ? [provider.jsonFlag] : [];
      let r;
      try {
        r = await invoke(provider, {
          prompt: prepared.prompt, workdir, outFile: join(workdir, 'out.txt'), timeoutMs: 300_000,
          effort: name === 'codex' ? 'low' : undefined, agentArgs: prepared.agentArgs, extraArgs,
        });
      } catch (error) {
        r = { code: null, text: '', stdout: '', stderr: '', ms: 0, spawnError: error.message };
      }
      const good = r.code === 0 && r.text.includes(canary);
      const spawnEvents = extraArgs.length ? (r.stdout.match(/spawn|collab|subagent/gi) ?? []).length : null;
      results.push({
        provider: name, mode, ok: good, seconds: Math.round((r.ms ?? 0) / 1000), tokens: r.tokens ?? null,
        exitCode: r.code, output: (r.text || '').trim().slice(0, 200), spawnEvents,
        error: good ? null : (r.spawnError || r.stderr || '').trim().slice(0, 600),
      });
      if (extraArgs.length) await writeFile(join(workdir, 'events.jsonl'), r.stdout || '', 'utf8');
      log(`  ${good ? '✓' : '✗'} ${name} / ${mode}: ${Math.round((r.ms ?? 0) / 1000)} s${r.tokens != null ? `, ${r.tokens} token` : ''}, kimenet: ${JSON.stringify((r.text || '').trim().slice(0, 60))}${spawnEvents != null ? `, spawn-esemény: ${spawnEvents}` : ''}`);
    }
  }
  const outDir = outDirOption ?? join(paths.ceo, 'runs', '_probe');
  await mkdir(outDir, { recursive: true }).catch(() => {});
  const file = join(outDir, `agents-${stamp}.json`);
  await writeFile(file, JSON.stringify({ createdAt: new Date().toISOString(), workRoot: base, results }, null, 2) + '\n', 'utf8').catch(() => {});
  for (const name of Object.keys(modes)) {
    const best = results.find(x => x.provider === name && x.ok && x.mode !== 'inline');
    const inline = results.find(x => x.provider === name && x.mode === 'inline');
    if (!inline) continue;
    log(best
      ? `  → ${name}: a(z) „${best.mode}” mód működik. Használatához a config.local.json-ba: {"providers":{"${name}":{"agentMode":"${best.mode}"}}}`
      : `  → ${name}: csak az „inline” mód ${inline.ok ? 'működik' : 'sem működik'}; az agent-módú futás ${inline.ok ? 'inline módban marad' : 'nem fog menni'}.`);
  }
  log(`  Részletek: ${file}`);
  return { ok: results.filter(x => x.mode === 'inline').every(x => x.ok), results };
}

async function run(config, pipelineName, options) {
  const pipeline = PIPELINES[pipelineName];
  if (!pipeline) throw new Error(`Ismeretlen lánc: ${pipelineName}. Választható: ${Object.keys(PIPELINES).join(', ')}`);
  if (options.solver && !config.providers[options.solver]) throw new Error(`Ismeretlen megoldó-szolgáltató: ${options.solver}`);
  if (options.pe) {
    // Összehasonlító próbához: a PE (szakmai ellenőr) más szolgáltatóval fut, a szerepleírás ugyanaz.
    if (!config.providers[options.pe]) throw new Error(`Ismeretlen PE-szolgáltató: ${options.pe}`);
    config.assign = { ...config.assign, PE: options.pe };
  }
  options.roles ??= 'package';
  if (!['package', 'agent'].includes(options.roles)) throw new Error(`A --roles értéke package vagy agent lehet, nem ${options.roles}.`);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const suffix = `${options.roles === 'agent' ? '-agent' : ''}${options.pe ? `-pe-${options.pe}` : ''}${options.ref ? `-ref-${options.ref}` : ''}${options.dryRun ? '-dry' : ''}`;
  const runDir = resolve(options.runDir ?? join(paths.ceo, 'runs', `${pipelineName}-${stamp}${suffix}`));
  const resumeCommand = `node ceo.mjs run ${pipelineName}${options.roles === 'agent' ? ' --roles agent' : ''}${options.solver ? ` --solver ${options.solver}` : ''}${options.pe ? ` --pe ${options.pe}` : ''}${options.ref ? ` --ref ${options.ref}` : ''}${options.p5 ? ' --p5' : ''}${options.p5Week ? ` --p5-week ${options.p5Week}` : ''}${options.brief ? ` --brief "${options.brief}"` : ''}${options.week ? ` --het ${options.week}` : ''}${options.blocks ? ` --blocks ${options.blocks.join(',')}` : ''}${options.egyseg ? ` --egyseg ${options.egyseg}` : ''}${options.t27 ? ' --t27' : ''}${options.out ? ` --out "${options.out}"` : ''}${options.p5 === false ? ' --no-p5' : ''} --run-dir "${runDir}"`;
  // Döntésre várva a CEO alapból nem vár, hanem megáll (a privát változat egy távoli felületről is olvas döntést).
  config.decisions = { pollSeconds: 60, ...config.decisions, waitMinutes: config.decisions?.waitMinutes ?? 0 };
  const mail = {};
  const pipelineLabel = `${pipelineName}${options.roles === 'agent' ? ':agent' : ''}`;
  const engine = new Engine({
    runDir, config, pipeline: pipelineLabel, dryRun: options.dryRun,
    statusFile: options.dryRun ? null : STATUS_FILE,
    hooks: options.dryRun ? {} : {
      decisionSources: [],
      onWaiting: async waiting => {
        if (waiting.kind === 'rate-limit') {
          await notifyOutcome(config, { pipeline: pipelineLabel, outcome: 'WAITING_RATE_LIMIT', runDir, resumeCommand, checks: { step: waiting.step, message: waiting.message } }, mail);
          return;
        }
        if (waiting.kind === 'auth') {
          // Lejárt bejelentkezés: egy levél (Áronnak be kell lépnie); a CEO közben vár, és a belépés után folytatja.
          await notifyOutcome(config, { pipeline: pipelineLabel, outcome: 'BLOCKED_AUTH', runDir, resumeCommand, checks: { step: waiting.step } }, mail);
          return;
        }
        const access = waiting.kind === 'access';
        await notifyOutcome(config, {
          pipeline: pipelineLabel, outcome: access ? 'BLOCKED_ACCESS' : 'BLOCKED_DECISION', runDir, resumeCommand,
          checks: { step: waiting.step, question: waiting.question, decisionFile: waiting.decisionFile, kind: waiting.kind, fetchFailed: waiting.fetchFailed || undefined },
          note: access
            ? `Egy szerep segítséget kér egy forráshoz (a saját keresése nem hozott használható forrást). Írd a választ (a kért szöveget, vagy egy sorban: FAJL: <útvonal a repóban, .md/.txt>) a fenti fájlba. A CEO nem vár: a lánc a tartaléktervvel megy tovább, a válaszod a megérkezése utáni minden hívásba bekerül. Ugyanerre a forrásra ebben a futásban nem jön újabb levél.`
            : config.decisions.waitMinutes
            ? `A CEO ${new Date(waiting.waitUntil).toLocaleString('hu-HU')}-ig vár a válaszodra, utána megáll (később folytatható).`
            : null,
        }, mail);
      },
    },
  });
  await engine.init();
  console.log(`Futásmappa: ${runDir}`);
  for (const prefix of options.rerun ?? []) await engine.discardSteps(prefix);
  let result;
  try {
    result = await pipeline(engine, options);
  } catch (error) {
    // Minden hiba szabályos megállás: jelentés és értesítés készül, a kész lépések megmaradnak.
    const outcome = error instanceof LimitError ? 'STOPPED_LIMIT' : error instanceof AuthError ? 'BLOCKED_AUTH'
      : error instanceof StepError ? 'STOPPED_STEP_ERROR' : 'STOPPED_ERROR';
    result = { outcome, checks: { error: error.message } };
    console.log(`■ Megállt: ${error.message}`);
    console.log('  Ugyanezzel a --run-dir értékkel újraindítva a kész lépéseket nem hívja újra.');
  }
  // Elakadásnál a magyarázat (mi történt, miért, mi a teendőd) az állapotba is bekerül: az irányítópult ezt mutatja,
  // és ugyanez megy e-mailben.
  const explanation = /^(BLOCKED|STOPPED)/.test(result.outcome)
    ? await explainProblem({ outcome: result.outcome, pipeline: engine.pipeline, runDir, checks: result.checks, resumeCommand }).catch(() => null)
    : null;
  const waiting = result.outcome === 'COMPLETED' ? null : { ...result.checks, resumeCommand, ...(explanation ? { explanation } : {}) };
  await engine.finish(result.outcome, { waiting });
  const report = await writeReport(runDir, engine.state, result);
  console.log(`\nEredmény: ${report.outcome}. Jelentés: ${join(runDir, 'report.md')}`);
  if (result.outcome === 'BLOCKED_DECISION') {
    console.log(`\n■ Döntésre vár (${result.checks.step}). A kérdés a jelentésben van.`);
    console.log(`  Írd a döntést ide: ${result.checks.decisionFile}`);
    console.log(`  Majd: ${resumeCommand}`);
  }
  if (!options.dryRun) {
    await notifyOutcome(config, { pipeline: engine.pipeline, outcome: result.outcome, runDir, checks: result.checks, resumeCommand, ...(explanation ? { explanation } : {}) }, mail);
  }
  return report;
}

export const STATUS_FILE = join(paths.ceo, 'runs', 'status.json');

async function main(argv) {
  const { command, options } = parseArgs(argv);
  const config = await loadConfig();
  if (command === 'doctor') return (await doctor(config, options)) ? 0 : 1;
  if (command === 'run') { await run(config, options._[0], options); return 0; }
  if (command === 'status') {
    if (!existsSync(STATUS_FILE)) { console.log('Még nem futott a CEO (nincs runs/status.json).'); return 0; }
    const st = JSON.parse(await readFile(STATUS_FILE, 'utf8'));
    console.log(`${st.pipeline}: ${st.state} (frissítve: ${st.updatedAt}), hívások: ${st.calls}`);
    if (st.current) console.log(`  Fut: ${st.current.id} (${st.current.agent ?? st.current.role}) ${st.current.startedAt} óta`);
    for (const s of st.steps) console.log(`  ${s.status.padEnd(8)} ${s.id.padEnd(16)} ${s.agent ?? s.role}${s.seconds != null ? `, ${s.seconds} s` : ''}`);
    if (st.waiting?.question) console.log(`  Döntésre vár: ${st.waiting.decisionFile}`);
    if (st.waiting?.resumeCommand) console.log(`  Folytatás: ${st.waiting.resumeCommand}`);
    return 0;
  }
  if (command === 'agents') {
    for (const a of buildAgents()) {
      const mode = config.providers[a.platform]?.agentMode ?? 'inline';
      console.log(`${a.name.padEnd(24)} ${a.platform.padEnd(7)} ${String(Buffer.byteLength(a.instructions)).padStart(6)} B  mód: ${mode.padEnd(12)} ${a.description}`);
    }
    return 0;
  }
  if (command === 'report') {
    const runDir = resolve(options._[0]);
    const state = await loadState(runDir);
    if (!state) throw new Error(`Nincs állapotfájl: ${runDir}`);
    await writeReport(runDir, state, { outcome: state.outcome ?? 'UNKNOWN' });
    return 0;
  }
  console.log('Használat: node ceo.mjs doctor [--probe] [--probe-agents] | run <replay-pe02|replay-gi1-4|replay-javitas|full|het|javitas|p5-het> [--het <hét> --brief <fájl> [--blocks GI1,GI2] [--no-p5]] [--egyseg R11 [--brief <fájl>] [--out <mappa>]] [--ujrafuttat <lépés-előtag>] [--roles package|agent] [--dry-run] [--solver claude] [--pe codex|claude|claude-web] [--ref merce|teljes] [--run-dir <mappa>] | agents | status | report <futásmappa>');
  return command ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('ceo.mjs')) {
  main(process.argv.slice(2)).then(code => { process.exitCode = code; }, error => {
    console.error(`Hiba: ${error.message}`);
    process.exitCode = 1;
  });
}
