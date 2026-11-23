// A CEO-vezérlő motorja: lépésenként elindítja a szerepet, menti az eredményt és az állapotot,
// betartja a korlátokat, és megszakítás után ugyanott folytatja, újrahívás nélkül.

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { prepareAgentCall } from './agents.mjs';
import { invokeProvider } from './providers.mjs';
import { parseSummary } from './verdict.mjs';
import { collectHelp, helpAttachment } from './help.mjs';
import { insertBeforeFooter } from './packets.mjs';
import { listeningSheetAttachment } from './lapok.mjs';
import { LATER_RULE_VARIANTS as P5_LATER_RULE_VARIANTS, stageP5References } from './p5.mjs';
import { PATCH_LATER_VARIANTS } from './csak-valtozas.mjs';

// Utólag felvett szabálysorok (régi alakjukkal): a P5-blokkszabály és a javításlistás szabály sorai.
const LATER_RULE_VARIANTS = [...P5_LATER_RULE_VARIANTS, ...PATCH_LATER_VARIANTS];
import { DEFAULT_USAGE_FILE, detectRateLimit, readUsage, usageGate, writeUsage } from './usage.mjs';

/**
 * Rövid, gépileg olvasható állapot a futásról (hol tart a CEO). Ezt olvassa a projektkövető:
 * ki dolgozik, ki végzett, ki vár sorra, ki kinek adta át a munkát (a CEO-n keresztül), és ha
 * valaki döntésre vár, mi a kérdés.
 */
export function buildStatus(state, runDir, { maxCalls = null } = {}) {
  const steps = state.order.map(id => ({ id, ...state.steps[id] }));
  const running = steps.find(s => s.status === 'RUNNING');
  const waitingStep = state.waiting?.question != null ? state.waiting.step : null;
  const stepState = s => (s.id === waitingStep ? 'WAITING_DECISION' : s.status);
  // A terv lépései, amelyekhez még nem tartozik tényleges lépés: ezek várnak sorra.
  const started = new Set(steps.map(s => s.id));
  const pending = (state.plan ?? []).filter(p => !started.has(p.id)).map(p => ({ ...p, status: 'PENDING' }));
  const handoffs = steps.flatMap(s => (s.inputs ?? []).map(from => ({ from, to: s.id, via: 'CEO' })));
  const planLabel = Object.fromEntries((state.plan ?? []).map(p => [p.id, p.label]));
  const labelOf = id => {
    if (planLabel[id]) return planLabel[id];
    if (/-segitseg$/.test(id)) return `${labelOf(id.replace(/-segitseg$/, ''))} — a segítséged után`;
    if (/-megoldas-dontes$/.test(id)) {
      return id.startsWith('pe') ? 'Célzott újraellenőrzés a megoldási döntés után' : 'Kéziratjavítás a megoldási döntés után';
    }
    const base = id.replace(/-dontes$/, '');
    if (base !== id) return `${labelOf(base)} — a döntésed után`;
    const rev = id.match(/-rev(\d+)$/);
    if (rev) return `Javítás, ${rev[1]}. kör`;
    const re = id.match(/recheck(\d+)$/);
    if (re) return `Célzott újraellenőrzés, ${re[1]}. kör`;
    return id;
  };
  return {
    schema: 'plusdeca-ceo-status/2',
    pipeline: state.pipeline,
    run: basename(runDir),
    runDir,
    // maxCalls: az érvényes hívási keret (a projektkövetőn a „hívás / keret” sávhoz).
    meta: state.meta || maxCalls != null ? { ...(state.meta ?? {}), ...(maxCalls != null ? { maxCalls } : {}) } : null,
    // Halasztott döntés mellett, amíg független lépés fut, a futás RUNNING (a kérdés a waiting-ben látszik).
    state: state.outcome ?? (state.waiting?.kind === 'rate-limit' ? 'WAITING_RATE_LIMIT' : state.waiting?.kind === 'auth' ? 'WAITING_AUTH' : waitingStep && !(state.waiting.deferred && running) ? 'WAITING_DECISION' : running ? 'RUNNING' : 'IDLE'),
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
    calls: state.calls,
    current: running ? { id: running.id, role: running.role, agent: running.agent ?? null, startedAt: running.startedAt } : null,
    waiting: state.waiting ?? null,
    steps: steps.map(s => ({
      id: s.id, label: labelOf(s.id), role: s.role, agent: s.agent ?? null, status: stepState(s), inputs: s.inputs ?? [],
      startedAt: s.startedAt ?? null, finishedAt: s.finishedAt ?? null,
      seconds: s.ms == null ? null : Math.round(s.ms / 1000), summary: s.summary ?? null, ...(s.error ? { error: s.error } : {}),
    })),
    pending,
    handoffs,
  };
}

export class LimitError extends Error {}
export class StepError extends Error {}
/** Lejárt Claude-bejelentkezés, és a várakozás alatt sem lépett be senki (→ BLOCKED_AUTH). */
export class AuthError extends StepError {}

// Bejelentkezési hiba a CLI kimenetében (U52 11-04, U43/U44 11-13: „OAuth session expired”, üres stderr, kód 1).
const AUTH_ERROR = /OAuth (?:session|token)[^\n]*(?:expired|invalid|revoked)|Failed to authenticate|authentication_error|not logged in|Please run \/login|Invalid API key|invalid x-api-key/i;
export const isAuthError = result => AUTH_ERROR.test(`${result?.stderr ?? ''}\n${result?.stdout ?? ''}\n${result?.stream?.text ?? ''}\n${result?.text ?? ''}`);

/** `claude auth status`: be van-e jelentkezve a CLI (true / false / null, ha nem állapítható meg). */
export async function claudeLoggedIn() {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync('claude', ['auth', 'status'], { encoding: 'utf8', timeout: 60_000, shell: process.platform === 'win32' });
  const m = /"loggedIn"\s*:\s*(true|false)/.exec(`${r.stdout ?? ''}${r.stderr ?? ''}`);
  return m ? m[1] === 'true' : null;
}

export const sha256 = text => createHash('sha256').update(text).digest('hex');

/**
 * A kimenet csonka, ha egy X_VEGE zárósor előtt nincs X nyitósor, vagy egy gépi szakasz (BLOKK_JSON, BLOKK_JAVITAS,
 * TANULOI_NEZET, GEPI_OSSZEGZES) nyitósora után nincs zárósor (VT1 megoldas, 11-14: a válasz a BLOKK_JSON nyitósora után
 * end_turn-nel véget ért); a szakasz neve, egyébként null.
 */
export function truncatedSection(text) {
  const s = String(text ?? '');
  for (const m of s.matchAll(/^([A-Z][A-Z_]+)_VEGE\s*$/gm)) {
    if (!new RegExp(`^${m[1]}\s*$`, 'm').test(s.slice(0, m.index))) return m[1];
  }
  for (const m of s.matchAll(/^(BLOKK_JSON|BLOKK_JAVITAS|TANULOI_NEZET|GEPI_OSSZEGZES)\s*$/gm)) {
    if (!new RegExp(`^${m[1]}_VEGE\s*$`, 'm').test(s.slice(m.index + m[0].length))) return m[1];
  }
  return null;
}

let tmpCounter = 0;
const RETRYABLE = new Set(['EPERM', 'EBUSY', 'EACCES']);
async function writeAtomic(path, text) {
  // A számláló miatt a párhuzamos lépések (pl. egyszerre futó review-k) ideiglenes fájljai nem ütköznek.
  const tmp = `${path}.tmp-${process.pid}-${Date.now()}-${tmpCounter += 1}`;
  await writeFile(tmp, text, 'utf8');
  // Windows-on a célfájlt rövid ideig zárolhatja egy másik mentés, a víruskereső vagy a OneDrive: újrapróbálás.
  for (let attempt = 0; ; attempt += 1) {
    try { await rename(tmp, path); return; } catch (error) {
      if (!RETRYABLE.has(error.code) || attempt >= 20) throw error;
      await new Promise(r => setTimeout(r, 25 * (attempt + 1)));
    }
  }
}

export async function loadState(runDir) {
  const path = join(runDir, 'state.json');
  let raw;
  try { raw = await readFile(path, 'utf8'); } catch { return null; }
  try { return JSON.parse(raw); } catch {
    // Sérült állapotfájlt nem írunk felül csendben: a felhasználónak kell döntenie.
    throw new Error(`Sérült állapotfájl: ${path}. Nézd meg vagy nevezd át, mielőtt újra futtatod.`);
  }
}

/** A futás korábbi lépéseire adott PRESIDENT-döntések (decisions/<lépés>.md) mellékletként; az aktuális lépésé nem (azt a szerző már kapja). */
export async function answeredStepDecisions(runDir, steps, currentStep) {
  let names = [];
  try { names = await readdir(join(runDir, 'decisions')); } catch { return ''; }
  const known = new Set(steps);
  const parts = [];
  for (const name of names.sort()) {
    const step = name.replace(/\.md$/, '');
    if (!name.endsWith('.md') || step === currentStep || !known.has(step)) continue;
    const text = (await readFile(join(runDir, 'decisions', name), 'utf8')).trim();
    if (text) parts.push(`\n\n# A PRESIDENT döntése a(z) ${step} lépésre (decisions/${name})\n\n${text}\n`);
  }
  return parts.join('');
}

export class Engine {
  constructor({
    runDir, config, pipeline, invoke = invokeProvider, dryRun = false, log = console.log, statusFile = null,
    hooks = {}, sleep = ms => new Promise(r => setTimeout(r, ms)), now = Date.now, authCheck = claudeLoggedIn,
  }) {
    this.now = now;
    this.authCheck = authCheck;
    this.statusFile = statusFile;
    // hooks.onSave(status): állapotváltozás (pl. a relay felé); hooks.onWaiting(waiting): döntésre vár (pl. email);
    // hooks.decisionSources: [async (run, step) => szöveg | null] — honnan jöhet a döntés a helyi fájlon kívül.
    this.hooks = hooks;
    this.sleep = sleep;
    this.runDir = runDir;
    this.config = config;
    this.pipeline = pipeline;
    this.invoke = invoke;
    this.dryRun = dryRun;
    this.log = log;
    this.state = null;
  }

  async init() {
    await mkdir(join(this.runDir, 'steps'), { recursive: true });
    this.state = (await loadState(this.runDir)) ?? {
      pipeline: this.pipeline,
      createdAt: new Date().toISOString(),
      calls: 0,
      steps: {},
      order: [],
    };
    if (this.state.pipeline !== this.pipeline) {
      throw new Error(`Ez a futásmappa a(z) ${this.state.pipeline} lánchoz tartozik, nem ehhez: ${this.pipeline}.`);
    }
    // Folytatáskor a korábbi megállás már nem érvényes: újra fut.
    delete this.state.outcome;
    this.state.waiting = null;
    // A halasztott kérdések a blokk újrafutásakor újra felmerülnek (a megírt döntést a lépés a fájlból olvassa).
    delete this.state.deferred;
    await this.save();
  }

  /**
   * Kész lépések kifejezett újrafuttatása (--ujrafuttat <előtag>): a rekord a state.discarded alá kerül (időbélyeggel
   * és okkal), a lépésfájlok <lépés>.elvetett-<n>.* néven megmaradnak. Például egy bemenethiány miatt elbukott lépés.
   */
  async discardSteps(prefix, reason = 'kézi újrafuttatás (--ujrafuttat)') {
    const ids = Object.keys(this.state.steps).filter(id => id.startsWith(prefix));
    this.state.discarded ??= [];
    for (const id of ids) {
      const n = this.state.discarded.filter(d => d.id === id).length + 1;
      // osszefesult.md: a javításlistás leadás összefésült szövege (lib/csak-valtozas.mjs); az új leadás újraszámolja.
      for (const ext of ['prompt.md', 'out.md', 'agent.md', 'osszefesult.md']) {
        const f = join(this.runDir, 'steps', `${id}.${ext}`);
        try { await rename(f, join(this.runDir, 'steps', `${id}.elvetett-${n}.${ext}`)); } catch { /* nincs ilyen */ }
      }
      this.state.discarded.push({ id, at: new Date().toISOString(), reason, record: this.state.steps[id] });
      delete this.state.steps[id];
      this.state.order = this.state.order.filter(x => x !== id);
      this.log(`✗ ${id}: elvetve, újra fut (${reason}).`);
    }
    await this.save();
    return ids;
  }

  /** Mentés sorban: a párhuzamos lépések (review-k) mentései nem futnak egymásba. */
  save() {
    this.saveQueue = (this.saveQueue ?? Promise.resolve()).catch(() => {}).then(() => this.saveNow());
    return this.saveQueue;
  }

  async saveNow() {
    this.state.updatedAt = new Date().toISOString();
    await writeAtomic(join(this.runDir, 'state.json'), JSON.stringify(this.state, null, 2) + '\n');
    const status = buildStatus(this.state, this.runDir, { maxCalls: this.config.limits?.maxCalls ?? null });
    if (this.statusFile) {
      await mkdir(dirname(this.statusFile), { recursive: true });
      await writeAtomic(this.statusFile, JSON.stringify(status, null, 2) + '\n');
    }
    if (this.hooks.onSave) {
      try { await this.hooks.onSave(status); } catch (error) { this.log(`! állapot továbbítása sikertelen: ${error.message}`); }
    }
  }

  /** A lánc várható lépései (a ténylegesen elindultak mellett ezek látszanak „sorra vár” állapotban). */
  async plan(items, meta) {
    this.state.plan = items;
    if (meta !== undefined) this.state.meta = meta;
    await this.save();
  }

  /**
   * Döntésre vár: rögzíti a kérdést, értesít, majd a beállított ideig figyeli a helyi döntési fájlt és a
   * további forrásokat (pl. a projektkövetőn adott választ). A döntés szövegét adja, vagy null-t, ha
   * lejárt a várakozási idő (ilyenkor a lánc megáll, és később folytatható).
   */
  async waitForDecision({ step, question, kind = 'decision', waitMinutes }) {
    if (this.deferDecisions && kind === 'decision') return this.deferDecision({ step, question });
    const decisionFile = join(this.runDir, 'decisions', `${step}.md`);
    await mkdir(dirname(decisionFile), { recursive: true });
    const cfg = this.config.decisions ?? {};
    const minutes = waitMinutes ?? cfg.waitMinutes ?? 0;
    const waitMs = minutes * 60_000;
    const pollMs = (cfg.pollSeconds ?? 60) * 1000;
    this.state.waiting = { step, question, kind, decisionFile, since: new Date().toISOString(), waitUntil: new Date(Date.now() + waitMs).toISOString() };
    await this.save();
    this.log(`⏸ ${step}: ${kind === 'access' ? 'segítséget kér' : 'döntésre vár'}${waitMs ? ` (legfeljebb ${minutes} percig figyel)` : ''}.`);
    if (this.hooks.onWaiting) {
      try { await this.hooks.onWaiting(this.state.waiting); } catch (error) { this.log(`! értesítés sikertelen: ${error.message}`); }
    }
    const deadline = Date.now() + waitMs;
    for (;;) {
      const text = await this.pollDecision(step);
      if (text) {
        this.state.waiting = this.deferredWaiting();
        await this.save();
        this.log(`▶ ${step}: döntés megérkezett, folytatás.`);
        return text;
      }
      if (Date.now() >= deadline) {
        if (kind === 'access') { this.state.waiting = this.deferredWaiting(); await this.save(); this.log(`▶ ${step}: nem érkezett válasz, a szerep a tartaléktervével folytatja.`); }
        return null;
      }
      await this.sleep(Math.min(pollMs, Math.max(0, deadline - Date.now())));
    }
  }

  /** A döntés egyszeri megnézése: a helyi fájl, majd a további források; ha van, a fájlba is beírja. Szöveg vagy null. */
  async pollDecision(step) {
    const decisionFile = join(this.runDir, 'decisions', `${step}.md`);
    let text = null;
    try { text = await readFile(decisionFile, 'utf8'); } catch { /* még nincs */ }
    for (const source of this.hooks.decisionSources ?? []) {
      if (text?.trim()) break;
      try { text = await source(basename(this.runDir), step); } catch (error) { this.log(`! döntésforrás hiba: ${error.message}`); }
    }
    if (!text?.trim()) return null;
    await mkdir(dirname(decisionFile), { recursive: true });
    await writeAtomic(decisionFile, text);
    return text;
  }

  /**
   * Halasztott döntés (Áron, 2026-10-31): ha a lánc bekapcsolja (deferDecisions), a CEO a kérdésnél nem áll meg,
   * hanem feljegyzi (state.deferred), értesít, és a tőle független munkával megy tovább. A választ a lánc akkor
   * kéri be, amikor már nincs más teendő (waitForAnyDecision). Ha a válasz már megvan, azt adja; különben null.
   */
  async deferDecision({ step, question }) {
    const text = await this.pollDecision(step);
    if (text) { this.forgetDeferred(step); return text; }
    this.state.deferred ??= {};
    if (!this.state.deferred[step]) {
      const minutes = this.config.decisions?.waitMinutes ?? 0;
      this.state.deferred[step] = {
        step, question, kind: 'decision', deferred: true, decisionFile: join(this.runDir, 'decisions', `${step}.md`),
        since: new Date(this.now()).toISOString(), waitUntil: new Date(this.now() + minutes * 60_000).toISOString(),
      };
      this.log(`⏸ ${step}: döntésre vár; addig a tőle független munka megy tovább.`);
      if (this.hooks.onWaiting) {
        try { await this.hooks.onWaiting(this.state.deferred[step]); } catch (error) { this.log(`! értesítés sikertelen: ${error.message}`); }
      }
    }
    if (!['rate-limit', 'auth'].includes(this.state.waiting?.kind)) this.state.waiting = this.deferredWaiting();
    await this.save();
    return null;
  }

  /** Az irányítópulton látszó várakozás: a legrégebbi halasztott kérdés, a többi az others listában; null, ha nincs. */
  deferredWaiting() {
    const list = Object.values(this.state.deferred ?? {});
    if (!list.length) return null;
    return { ...list[0], ...(list.length > 1 ? { others: list.slice(1).map(w => ({ step: w.step, question: w.question })) } : {}) };
  }

  forgetDeferred(step) {
    if (!this.state.deferred?.[step]) return;
    delete this.state.deferred[step];
    if (!['rate-limit', 'auth'].includes(this.state.waiting?.kind)) this.state.waiting = this.deferredWaiting();
  }

  /**
   * Amikor már nincs független munka: vár, amíg a halasztott kérdések bármelyikére válasz jön (legfeljebb
   * decisions.waitMinutes percig). A megválaszolt lépés azonosítója, vagy null, ha lejárt az idő.
   */
  async waitForAnyDecision(steps) {
    const cfg = this.config.decisions ?? {};
    const minutes = cfg.waitMinutes ?? 0;
    const pollMs = (cfg.pollSeconds ?? 60) * 1000;
    const deadline = this.now() + minutes * 60_000;
    this.log(`⏸ nincs több független munka; döntésre vár (${steps.join(', ')})${minutes ? `, legfeljebb ${minutes} percig` : ''}.`);
    for (;;) {
      for (const step of steps) {
        if (!(await this.pollDecision(step))) continue;
        this.forgetDeferred(step);
        await this.save();
        this.log(`▶ ${step}: döntés megérkezett, folytatás.`);
        return step;
      }
      if (this.now() >= deadline) return null;
      await this.sleep(Math.min(pollMs, Math.max(0, deadline - this.now())));
    }
  }

  /**
   * Egy szereplépés. Ha ugyanaz a lépés ugyanazzal a bemenettel már kész, a mentett
   * eredményt adja vissza, és nem hív újra.
   */
  /**
   * Közös ellenőri munkamenet (2026-11-15, cache-mérés: A vs. B). Egy lektori kör ellenőrei ugyanazt az anyagot kapják;
   * a CLI csak az üzenet végén tesz cache-töréspontot, ezért külön munkamappával és szerepenkénti rendszerprompttal
   * mindegyik újraírta a közös részt (~1,25× bemeneti ár). Itt egy előmelegítő hívás csak a közös anyagot küldi a közös
   * ellenőri agenttel; az ellenőrök ezt a munkamenetet folytatják (--resume <id> --fork-session), így a közös részt
   * cache-ből olvassák (~0,1×), és csak a saját szerepüket és megbízásukat írják. Ugyanarra a közös anyagra egy
   * előmelegítés (a párhuzamos ellenőrök ugyanazt várják meg). Hiba esetén null: az ellenőrök a szokásos módon futnak.
   */
  sharedEligible(provider) {
    if (this.dryRun || this.config.sharedReviewSession === false) return false;
    if (!provider.args?.includes('{agentArgs}')) return false;
    return provider.sharedSession ?? provider.outputFrom === 'stream-json';
  }

  sharedSession({ providerName, provider, model, effort, agent, text }) {
    // A kulcs az, ami a CLI-hez valóban kimegy (a gondolkodási szint csak effortTemplate-tel).
    const effortArg = provider.effortTemplate ? effort ?? '' : '';
    const key = sha256([providerName, model ?? '', effortArg, agent.name, sha256(agent.instructions), text].join('\n'));
    this.sharedSessions ??= new Map();
    if (!this.sharedSessions.has(key)) {
      this.sharedSessions.set(key, this.warmShared(key, { provider, model, effort, agent, text }).catch(error => {
        this.log(`! közös ellenőri munkamenet: ${error.message}; az ellenőrök a szokásos módon futnak.`);
        return null;
      }));
    }
    return this.sharedSessions.get(key);
  }

  async warmShared(key, { provider, model, effort, agent, text }) {
    const id = `kozos-${key.slice(0, 12)}`;
    const workdir = this.workdirFor(id);
    await mkdir(workdir, { recursive: true });
    const prepared = await prepareAgentCall('claude-agent', agent, { workdir, prompt: text });
    await this.usagePause(id);
    if (this.state.calls >= this.config.limits.maxCalls) return null;
    this.state.calls += 1;
    this.log(`▶ ${id}: közös anyag előmelegítése (${agent.name}, ${Buffer.byteLength(text)} bájt)…`);
    const result = await this.invoke(provider, {
      prompt: text, workdir, outFile: join(workdir, 'elomelegites.out.md'), model, effort,
      timeoutMs: this.config.limits.stepTimeoutMs, agentArgs: prepared.agentArgs,
    });
    const sessionId = result.stream?.sessionId ?? null;
    const ok = Boolean(!result.timedOut && !result.spawnError && result.code === 0 && sessionId);
    this.state.sharedWarmups = [...(this.state.sharedWarmups ?? []), {
      id, at: new Date(this.now()).toISOString(), ok, sessionId,
      ...(result.stream?.usage ? { budget: { ...result.stream.usage, weekUsedAfter: result.stream.windows?.seven_day?.used_percentage ?? null } } : {}),
    }];
    await this.save();
    if (!ok) {
      this.log(`! ${id}: az előmelegítés nem sikerült (kód ${result.code}${sessionId ? '' : ', nincs munkamenet-azonosító'}); az ellenőrök a szokásos módon futnak.`);
      return null;
    }
    this.log(`⇶ ${id}: a közös anyag a cache-ben${result.stream?.usage ? ` (írás ${result.stream.usage.cacheWrite} token)` : ''}; az ellenőrök ebből a munkamenetből indulnak.`);
    return { id, sessionId, workdir, agentArgs: prepared.agentArgs };
  }

  /**
   * A szerep munkamappája. Alapból a rendszer ideiglenes mappájában, a repón kívül: így a CLI nem
   * találja meg és nem tölti be a repó AGENTS.md / CLAUDE.md fájljait, és nem dolgozik a repóban.
   */
  workdirFor(stepId) {
    const root = this.config.workRoot;
    if (root === 'runDir') return join(this.runDir, 'work', stepId);
    return join(root || join(tmpdir(), 'plusdeca-ceo'), basename(this.runDir), stepId);
  }

  async step(stepId, { role, provider: providerName, prompt: assignmentPrompt, kind = 'author', model, effort, agent, inputs = [], shared = null }) {
    const provider = this.config.providers[providerName];
    if (!provider) throw new Error(`Ismeretlen szolgáltató: ${providerName}`);
    const roleCfg = this.config.roles?.[role] ?? {};
    model = model ?? roleCfg.model ?? provider.defaultModel;
    effort = effort ?? roleCfg.effort ?? provider.defaultEffort;
    const agentMode = agent ? (provider.agentMode ?? 'inline') : null;
    const agentKey = agent ? `${agent.name}\n${agentMode}\n${sha256(agent.instructions)}` : '';
    const inputHash = sha256(`${providerName}\n${model ?? ''}\n${effort ?? ''}\n${agentKey}\n${assignmentPrompt}`);
    const promptFile = join(this.runDir, 'steps', `${stepId}.prompt.md`);
    const outFile = join(this.runDir, 'steps', `${stepId}.out.md`);
    const previous = this.state.steps[stepId];

    if (previous?.status === 'DONE' && previous.inputHash === inputHash) {
      this.log(`↺ ${stepId}: kész (mentett eredmény, nincs újrahívás)`);
      return { text: await readFile(outFile, 'utf8'), summary: previous.summary, cached: true };
    }
    // Csak a szerepleírás változott (pl. egy agents-src frissítés egy futó lánc közben), a megbízás azonos:
    // a kész eredmény marad. Az összevetés a lépéskor elmentett szerepleírással (steps/<lépés>.agent.md) történik.
    if (previous?.status === 'DONE' && previous.inputHash !== inputHash && agent) {
      let saved = null;
      try { saved = await readFile(join(this.runDir, 'steps', `${stepId}.agent.md`), 'utf8'); } catch { /* nincs */ }
      const savedKey = saved == null ? null : `${agent.name}
${agentMode}
${sha256(saved)}`;
      if (savedKey && previous.inputHash === sha256(`${providerName}
${model ?? ''}
${effort ?? ''}
${savedKey}
${assignmentPrompt}`)) {
        this.log(`↺ ${stepId}: kész (mentett eredmény; azóta csak a szerepleírás változott, nincs újrahívás)`);
        return { text: await readFile(outFile, 'utf8'), summary: previous.summary, cached: true };
      }
    }
    // Csak később hozzáadott szabálysorok (LATER_RULE_LINES) különböztetik meg a megbízást: a kész eredmény marad.
    if (previous?.status === 'DONE' && previous.inputHash !== inputHash) {
      // Minden jelen lévő sor maradhat, kimaradhat, vagy egy korábbi alakjára cserélődhet (LATER_RULE_VARIANTS).
      let candidates = [assignmentPrompt];
      for (const [line, olders] of LATER_RULE_VARIANTS.filter(([line]) => assignmentPrompt.includes(`\n${line}`))) {
        candidates = candidates.flatMap(p => [p, ...olders.map(o => p.replace(`\n${line}`, o ? `\n${o}` : ''))]);
      }
      for (const older of candidates.slice(1)) {
        if (previous.inputHash === sha256(`${providerName}\n${model ?? ''}\n${effort ?? ''}\n${agentKey}\n${older}`)) {
          this.log(`↺ ${stepId}: kész (mentett eredmény; azóta csak szabálysor került a megbízásba, nincs újrahívás)`);
          return { text: await readFile(outFile, 'utf8'), summary: previous.summary, cached: true };
        }
      }
    }
    // A bemenet egy kész lépés óta érdemben megváltozott (pl. a CEO-sáv futás közben javított a megbízáson): eddig a lánc
    // megállt és levelet küldött (U14, U21, U43, U44 — 5×). 2026-11-15 óta a lépés egyszerűen újrafut; a tőle függő
    // lépések bemenete ettől szintén változik, így azok is újrafutnak, amikor sorra kerülnek.
    if (previous?.status === 'DONE' && previous.inputHash !== inputHash && this.probing > 0) {
      // Próba (tryCached): egy régi megbízással kész lépés érvényes-e még; ha nem, a hívó az új megbízással próbálja.
      throw new StepError(`${stepId}: a bemenet megváltozott egy már kész lépés óta.`);
    }
    if (previous?.status === 'DONE' && previous.inputHash !== inputHash) {
      this.log(`! ${stepId}: a bemenet megváltozott a kész lépés óta; a lépés újrafut.`);
      this.state.reruns = [...(this.state.reruns ?? []), { step: stepId, at: new Date(this.now()).toISOString(), reason: 'bemenet megváltozott' }];
    }
    const limits = this.config.limits;
    if (!this.dryRun && this.state.calls >= limits.maxCalls) {
      throw new LimitError(`Elérted a futásonkénti hívási korlátot (${limits.maxCalls}).`);
    }

    // A futás segítségkéréseire érkezett anyag és a nyitott kérések listája minden új hívás promptjába bekerül
    // (a gyorsítótár kulcsa a megbízás marad: egy később jött válasz nem érvényteleníti a kész lépéseket).
    const help = await collectHelp(this);
    // A PRESIDENT folytatási döntése (decisions/folytatas.md, pl. egy BLOCKED_EVIDENCE utáni szabály) ugyanígy minden új hívásba.
    let carry = null;
    try { carry = (await readFile(join(this.runDir, 'decisions', 'folytatas.md'), 'utf8')).trim(); } catch { /* nincs */ }
    // Egy lépésre adott PRESIDENT-döntés (decisions/<lépés>.md) a lépés szerzőjéhez megy; az ellenőrök is lássák, különben a
    // szerző hivatkozását nem tudják igazolni (U24, 11-01: NavE BLOCKED_EVIDENCE). A szerzők útja változatlan.
    const stepDecisions = kind === 'review' ? await answeredStepDecisions(this.runDir, Object.keys(this.state.steps ?? {}), stepId) : '';
    const base = [helpAttachment(help), carry ? `\n\n# A PRESIDENT döntése (folytatás, decisions/folytatas.md)\n\n${carry}\n` : '', stepDecisions].filter(Boolean).join('');
    // A megbízásban vagy a mellékletekben „HALLGATÁSI LAP: <ID>” sorral hivatkozott lapokat a vezérlő csatolja (lib/lapok.mjs).
    const sheets = await listeningSheetAttachment(assignmentPrompt + base);
    const extra = (base + (sheets ?? '')) || null;
    const workdir = this.workdirFor(stepId);
    await mkdir(workdir, { recursive: true });
    const prepared = await prepareAgentCall(agentMode, agent, { workdir, prompt: extra ? insertBeforeFooter(assignmentPrompt, extra) : assignmentPrompt });
    // A BLOKK_JSON-t író lépés olvasni tudja a szabályban megnevezett P5-sémát, -mintát és -katalógust.
    const workFiles = /^BLOKK_JSON$/m.test(assignmentPrompt) ? await stageP5References(workdir) : [];
    // Közös ellenőri munkamenet (sharedSession): a közös anyag már a munkamenetben van, ez a hívás csak a saját részt
    // küldi (szerepleírás + megbízás, a fenti mellékletekkel a gépi összegzés előtt). A lépés kulcsa (inputHash) a logikai
    // megbízás marad, így a régi elrendezéssel kész lépések nem futnak újra.
    let session = shared && agent && this.sharedEligible(provider)
      ? await this.sharedSession({ providerName, provider, model, effort, agent: shared.agent, text: shared.text })
      : null;
    const ownPrompt = shared ? (extra ? insertBeforeFooter(shared.own, extra) : shared.own) : null;
    let prompt = session ? ownPrompt : prepared.prompt;
    const promptText = () => (session
      ? `${shared.text}\n\n<!-- CEO: eddig a közös anyag (${session.id}, előmelegített munkamenet ${session.sessionId}); innen a lépés saját üzenete -->\n\n${ownPrompt}`
      : prepared.prompt);
    await writeAtomic(promptFile, promptText());
    if (agent) await writeAtomic(join(this.runDir, 'steps', `${stepId}.agent.md`), agent.instructions);
    const record = {
      role, provider: providerName, model: model ?? null, effort: effort ?? null, kind,
      agent: agent?.name ?? null, agentMode, inputs,
      inputHash, promptBytes: Buffer.byteLength(promptText()),
      ...(workFiles.length ? { workFiles } : {}),
      ...(help.answered.length || help.open.length ? { help: { answered: help.answered.map(a => a.entry.id), open: help.open.map(e => e.id) } } : {}),
      // A modell által kapott teljes szöveg: inline módban a szerepleírás a promptban van, máskor fájlból jön.
      contextBytes: Buffer.byteLength(promptText()) + (session ? Buffer.byteLength(shared.agent.instructions) : agent && agentMode !== 'inline' ? Buffer.byteLength(agent.instructions) : 0),
      ...(session ? { sharedSession: { id: session.id, sessionId: session.sessionId, agent: shared.agent.name } } : {}),
      status: 'RUNNING', startedAt: new Date().toISOString(),
    };
    this.state.steps[stepId] = record;
    if (!this.state.order.includes(stepId)) this.state.order.push(stepId);
    await this.save();

    if (this.dryRun) {
      const { buildCommand } = await import('./providers.mjs');
      const cmd = buildCommand(provider, { workdir, outFile, model, effort, agentArgs: prepared.agentArgs });
      this.log(`[próbafutás] ${stepId} (${role}, ${providerName}): ${cmd.command} ${cmd.args.join(' ')}  < ${promptFile} (${record.promptBytes} bájt)`);
      const fake = kind === 'review'
        ? 'PRÓBAFUTÁS\nGEPI_OSSZEGZES\nverdict: REVIEW_PASS\nblocker: 0\nmajor: 0\nminor: 0\nGEPI_OSSZEGZES_VEGE\n'
        : 'PRÓBAFUTÁS\nGEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n';
      Object.assign(record, { status: 'DRY_RUN', finishedAt: new Date().toISOString() });
      await this.save();
      return { text: fake, summary: parseSummary(fake), dryRun: true };
    }

    // Keretfigyelés: 95% fölött nem indul új hívás; keretkimerülési hibánál várakozás és ugyanennek a lépésnek az újrapróbálása.
    let result;
    let truncRetries = 0;
    // 2026-11-15: a CEO maga kezeli, amit eddig levélben kért Árontól (újrapróba egyszer):
    //  - hiányzó gépi összegzés (GEPI_OSSZEGZES), ha a megbízás kéri (VT1, U43: BLOCKED_UNPARSEABLE_AUTHOR);
    //  - átmeneti CLI-hiba (kód ≠ 0 vagy üres kimenet, nem keret- és nem bejelentkezési hiba): 1 perc múlva újra;
    //  - időtúllépés: másfélszeres idővel újra.
    // Az időkorlát a prompt méretével nő (250 KB fölött arányosan, legfeljebb kétszeresére).
    let summaryRetries = 0, transientRetries = 0, timeoutRetries = 0;
    const wantsSummary = /^GEPI_OSSZEGZES\s*$/m.test(assignmentPrompt) && (kind === 'author' || kind === 'review' || kind == null);
    let timeoutMs = Math.round(limits.stepTimeoutMs * Math.min(2, Math.max(1, Buffer.byteLength(promptText()) / 250_000)));
    for (let waits = 0; ; waits += 1) {
      await this.usagePause(stepId);
      this.state.calls += 1;
      this.log(`▶ ${stepId}: ${role}${agent ? ` → ${agent.name} [${session ? `közös munkamenet ${session.id}` : agentMode}]` : ''} (${providerName}${model ? `, ${model}` : ''}) indul…`);
      result = await this.invoke(provider, session
        ? { prompt, workdir: session.workdir, outFile, model, effort, timeoutMs, agentArgs: session.agentArgs, extraArgs: ['--resume', session.sessionId, '--fork-session'] }
        : { prompt, workdir, outFile, model, effort, timeoutMs, agentArgs: prepared.agentArgs });
      if (result.stream?.windows && this.usageConfig()) {
        try { await writeUsage(this.usageConfig().file, result.stream.windows, { now: this.now() }); } catch (error) { this.log(`! keretfájl írása sikertelen: ${error.message}`); }
      }
      const callFailed = !result.timedOut && (result.spawnError || result.code !== 0 || !String(result.text ?? '').trim());
      const limit = callFailed ? detectRateLimit({ stdout: result.stdout, stderr: result.stderr, stream: result.stream, now: this.now() }) : { limited: false };
      const maxWaits = this.config.usage?.maxWaits ?? 100;
      const cut = !callFailed && !result.timedOut ? truncatedSection(result.text) : null;
      if (cut) {
        // A nyers kimenet a diagnózishoz (hol tört a válasz): steps/<lépés>.csonka-<n>.stdout.txt
        await writeAtomic(join(this.runDir, 'steps', `${stepId}.csonka-${truncRetries + 1}.stdout.txt`), String(result.stdout ?? ''));
        if (truncRetries >= 1) { result = { ...result, code: 1, spawnError: `csonka kimenet: a(z) ${cut} szakasz nyitó- vagy zárósora hiányzik` }; break; }
        truncRetries += 1;
        this.log(`! ${stepId}: csonka kimenet (${cut}: hiányzó nyitó- vagy zárósor), a lépés újraindul.`);
        continue;
      }
      if (result.timedOut && timeoutRetries < 1) {
        timeoutRetries += 1;
        timeoutMs = Math.round(timeoutMs * 1.5);
        this.log(`! ${stepId}: időtúllépés; újraindul ${Math.round(timeoutMs / 60000)} perces korláttal.`);
        continue;
      }
      if (callFailed && !limit.limited && isAuthError(result)) {
        this.state.calls -= 1;
        await this.authWait(stepId);
        continue;
      }
      if (session && callFailed && !limit.limited && !isAuthError(result)) {
        // A munkamenet folytatása nem sikerült (pl. lejárt vagy hiányzó munkamenet): a lépés a szokásos módon újraindul.
        this.log(`! ${stepId}: a közös munkamenet (${session.id}) folytatása nem sikerült (kód ${result.code}); a lépés a szokásos módon újraindul.`);
        session = null;
        prompt = prepared.prompt;
        delete record.sharedSession;
        Object.assign(record, { sharedFallback: true, promptBytes: Buffer.byteLength(prompt), contextBytes: Buffer.byteLength(prompt) + (agentMode !== 'inline' ? Buffer.byteLength(agent.instructions) : 0) });
        await writeAtomic(promptFile, promptText());
        continue;
      }
      if (callFailed && !limit.limited && transientRetries < 1) {
        transientRetries += 1;
        this.log(`! ${stepId}: a hívás hibával tért vissza (kód ${result.code}${String(result.text ?? '').trim() ? '' : ', üres kimenet'}); 1 perc múlva újrapróba.`);
        await this.sleep(60_000);
        continue;
      }
      if (wantsSummary && !callFailed && !result.timedOut && !parseSummary(result.text) && summaryRetries < 1) {
        summaryRetries += 1;
        if (result.stdout) await writeAtomic(join(this.runDir, 'steps', `${stepId}.osszegzes-nelkul-${summaryRetries}.stdout.txt`), String(result.stdout));
        this.log(`! ${stepId}: a válaszból hiányzik a gépi összegzés; a lépés újraindul.`);
        continue;
      }
      if (!limit.limited || waits >= maxWaits) break;
      // A keret miatt elutasított hívás nem számít a hívási korlátba.
      this.state.calls -= 1;
      const fallback = (this.config.usage?.noResetWaitMinutes ?? 30) * 60_000;
      await this.rateLimitWait(stepId, {
        until: limit.resetAt && limit.resetAt > this.now() ? limit.resetAt : this.now() + fallback,
        reason: `keretkimerülés (${limit.resetAt ? 'visszaállás a CLI szerint' : 'a CLI nem adott időpontot, 30 perc múlva újrapróba'})`,
      });
    }
    Object.assign(record, {
      finishedAt: new Date().toISOString(),
      ms: result.ms,
      exitCode: result.code,
      tokens: result.tokens ?? null,
      // Keretnapló (11-15): token-bontás, súlyozott költség, becsült heti %, és a heti kihasználtság a lépés után.
      ...(result.stream?.usage ? { budget: { ...result.stream.usage, weekUsedAfter: result.stream.windows?.seven_day?.used_percentage ?? null } } : {}),
      outputBytes: Buffer.byteLength(result.text || ''),
    });
    // Hibánál a normál kimenet is a naplóba kerül: a CLI-k (pl. claude -p) a hibaüzenetet gyakran oda írják.
    const failed = result.timedOut || result.spawnError || result.code !== 0 || !String(result.text ?? '').trim();
    await writeAtomic(join(this.runDir, 'steps', `${stepId}.stderr.txt`),
      (result.stderr || result.spawnError || '') + (failed && result.text ? `\n--- normál kimenet ---\n${String(result.text).slice(-4000)}` : ''));

    if (result.timedOut) {
      record.status = 'TIMEOUT';
      await this.save();
      throw new StepError(`${stepId}: időtúllépés (${Math.round(timeoutMs / 60000)} perc, egy újrapróba után).`);
    }
    if (result.spawnError || result.code !== 0 || !result.text.trim()) {
      record.status = 'FAILED';
      record.error = result.spawnError || `kilépési kód ${result.code}${result.text.trim() ? '' : ', üres kimenet'}`;
      await this.save();
      throw new StepError(`${stepId}: sikertelen (${record.error}). Részletek: steps/${stepId}.stderr.txt`);
    }
    await writeAtomic(outFile, result.text);
    record.summary = parseSummary(result.text);
    // Gépi összegzés nélküli válasznál a nyers kimenet a diagnózishoz (U33, 11-09: hol tört a válasz, volt-e tömörítés).
    if (!record.summary && result.stdout && result.stream) {
      await writeAtomic(join(this.runDir, 'steps', `${stepId}.osszegzes-nelkul.stdout.txt`), String(result.stdout));
    }
    record.status = 'DONE';
    await this.save();
    this.log(`✓ ${stepId}: ${Math.round(result.ms / 1000)} s${record.summary ? `, ${JSON.stringify(record.summary)}` : ', gépi összegzés nélkül'}`);
    return { text: result.text, summary: record.summary };
  }

  /** A keretfigyelés beállítása; null, ha ki van kapcsolva (a tesztek hamis konfigurációjában nincs). */
  usageConfig() {
    const cfg = this.config.usage;
    if (!cfg || cfg.enabled === false) return null;
    return { threshold: 95, staleMinutes: 30, ...cfg, file: cfg.file || DEFAULT_USAGE_FILE };
  }

  /** Hívás előtt: ha a keretfájl friss, és valamelyik ablak ≥ küszöb, várakozás a visszaállásig. */
  async usagePause(stepId) {
    const cfg = this.usageConfig();
    if (!cfg || this.dryRun) return;
    const gate = usageGate(await readUsage(cfg.file), { threshold: cfg.threshold, staleMinutes: cfg.staleMinutes, now: this.now() });
    if (!gate.wait) return;
    const fallback = (this.config.usage?.noResetWaitMinutes ?? 30) * 60_000;
    await this.rateLimitWait(stepId, {
      until: gate.until ?? this.now() + fallback,
      reason: `keret ${gate.percent}% (${gate.window === 'seven_day' ? 'heti' : '5 órás'} ablak, küszöb ${cfg.threshold}%)`,
    });
  }

  /**
   * Várakozás a keret visszaállásáig: állapot (WAITING_RATE_LIMIT), egy értesítés, majd alvás (legfeljebb
   * 15 perces szeletekben, hogy a gép alvása után is pontosan ébredjen). A párhuzamos lépések ugyanarra a
   * várakozásra csatlakoznak, így egy kerethiány egy levél.
   */
  rateLimitWait(stepId, { until, reason }) {
    if (this.rateWait) return this.rateWait;
    const margin = (this.config.usage?.marginSeconds ?? 60) * 1000;
    const wakeAt = until + margin;
    this.rateWait = (async () => {
      const resume = new Date(wakeAt).toLocaleString('hu-HU');
      this.state.waiting = {
        step: stepId, kind: 'rate-limit', question: null, reason,
        since: new Date(this.now()).toISOString(), waitUntil: new Date(wakeAt).toISOString(),
        message: `vár: ${reason}, folytatás ekkor: ${resume}`,
      };
      await this.save();
      this.log(`⏸ ${stepId}: ${this.state.waiting.message}`);
      if (this.hooks.onWaiting) {
        try { await this.hooks.onWaiting(this.state.waiting); } catch (error) { this.log(`! értesítés sikertelen: ${error.message}`); }
      }
      for (let left = wakeAt - this.now(); left > 0; left = wakeAt - this.now()) {
        await this.sleep(Math.min(left, 15 * 60_000));
      }
      this.state.waiting = this.deferredWaiting();
      await this.save();
      this.log(`▶ ${stepId}: a keret visszaállt, folytatás.`);
    })().finally(() => { this.rateWait = null; });
    return this.rateWait;
  }

  /**
   * Lejárt bejelentkezés: állapot (WAITING_AUTH), egy értesítés (BLOCKED_AUTH-levél: Áron lépjen be), majd
   * 5 percenként `claude auth status`. Ha belépett, ugyanettől a lépéstől folytatja; ha a várakozási idő
   * (config.auth.maxWaitHours, alap 24) lejár, AuthError → BLOCKED_AUTH.
   */
  async authWait(stepId) {
    if (this.authWaiting) return this.authWaiting;
    const maxMs = (this.config.auth?.maxWaitHours ?? 24) * 3600_000;
    const poll = (this.config.auth?.pollMinutes ?? 5) * 60_000;
    this.authWaiting = (async () => {
      const until = this.now() + maxMs;
      this.state.waiting = {
        step: stepId, kind: 'auth', question: null, reason: 'lejárt a Claude-bejelentkezés',
        since: new Date(this.now()).toISOString(), waitUntil: new Date(until).toISOString(),
        message: 'vár: lejárt a Claude-bejelentkezés (claude auth login); a belépés után magától folytatja',
      };
      await this.save();
      this.log(`⏸ ${stepId}: ${this.state.waiting.message}`);
      if (this.hooks.onWaiting) {
        try { await this.hooks.onWaiting(this.state.waiting); } catch (error) { this.log(`! értesítés sikertelen: ${error.message}`); }
      }
      for (;;) {
        await this.sleep(poll);
        if (await this.authCheck().catch(() => null)) break;
        if (this.now() >= until) throw new AuthError(`${stepId}: lejárt a Claude-bejelentkezés, és ${Math.round(maxMs / 3600_000)} óra alatt sem történt belépés.`);
      }
      this.state.waiting = this.deferredWaiting();
      await this.save();
      this.log(`▶ ${stepId}: a bejelentkezés rendben, folytatás.`);
    })().finally(() => { this.authWaiting = null; });
    return this.authWaiting;
  }

  /**
   * Próba: a fn-ben futó lépések csak mentésből jöhetnek; ha egy kész lépés bemenete eltér, „bemenet megváltozott”
   * hibát dob (a régi futások folytatásának régi-megbízás-próbái, lib/week.mjs). only: false esetén nincs próba.
   */
  async tryCached(fn, { only = true } = {}) {
    if (!only) return fn();
    this.probing = (this.probing ?? 0) + 1;
    try { return await fn(); } finally { this.probing -= 1; }
  }

  async finish(outcome, extra = {}) {
    this.state.outcome = outcome;
    Object.assign(this.state, extra);
    await this.save();
  }
}
