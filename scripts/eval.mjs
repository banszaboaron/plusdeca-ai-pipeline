#!/usr/bin/env node
// Evaluation run over data/eval-set.v1.jsonl.
//   node scripts/eval.mjs                                  REPLAY (default): recorded outputs, no model call, no login
//   node scripts/eval.mjs --run results/<dir>              replay a specific recorded run
//   node scripts/eval.mjs --live --out results/<dir>       LIVE: two independent `claude -p` calls per submission
//        [--model <id>] [--concurrency 2] [--only T1-01,T3-05]
// Both modes write <dir>/metrics.json and <dir>/report.md from the same code path (live = record, then replay).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { callFile, liveClaude, replay } from '../lib/checkers.mjs';
import { computeMetrics } from '../lib/metrics.mjs';
import { checkSubmission, loadEvalSet, loadTasks, ROOT, singleVerdict } from '../lib/pipeline.mjs';

export const DEFAULT_RUN = 'results/2026-11-22-claude';
const root = fileURLToPath(ROOT);

async function pool(items, size, fn) {
  const out = new Array(items.length); let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); } }));
  return out;
}

/** Live checker that records every call (including failures) for later replay. */
function recording(checker, runDir) {
  return async (prompt, ctx) => {
    const file = callFile(runDir, ctx.entryId, ctx.slot);
    try {
      const res = await checker(prompt, ctx);
      writeFileSync(file, `${JSON.stringify({ entryId: ctx.entryId, slot: ctx.slot, promptSha: ctx.promptSha, recordedAt: new Date().toISOString(), output: res.output, meta: res.meta }, null, 2)}\n`);
      return res;
    } catch (error) {
      writeFileSync(file, `${JSON.stringify({ entryId: ctx.entryId, slot: ctx.slot, promptSha: ctx.promptSha, recordedAt: new Date().toISOString(), error: String(error?.code ?? error?.message ?? error) }, null, 2)}\n`);
      throw error;
    }
  };
}

export async function evaluate({ runDir, live = false, model = null, concurrency = 2, only = null, log = () => {} }) {
  const { tasks } = loadTasks();
  const entries = loadEvalSet().filter(e => !only || only.includes(e.id));
  const checkers = live ? [0, 1].map(() => recording(liveClaude({ model }), runDir)) : [0, 1].map(() => replay(runDir));
  const rows = await pool(entries, live ? concurrency : 8, async entry => {
    const task = tasks.get(entry.task);
    const outcome = await checkSubmission({ task, text: entry.text, checkers, entryId: entry.id });
    log(`${entry.id.padEnd(6)} ${outcome.stage === 'checked' ? `${outcome.result.verdict} ${outcome.calls.map(c => c.ok ? c.result.score : 'x').join('/')}` : outcome.stage}`);
    return { entry, task, outcome };
  });
  return { rows, metrics: computeMetrics(rows) };
}

const pc = r => (r?.rate === null || r?.rate === undefined ? 'n/a' : `${(r.rate * 100).toFixed(1)}% (${r.n}/${r.of})`);

export function reportMarkdown({ rows, metrics, run }) {
  const m = metrics, L = [];
  L.push(`# Evaluation report — ${run.name}`, '');
  L.push(`Eval set: \`eval-set.v1\` (${m.counts.entries} answers, 4 tasks). Mode of this report: **${run.mode}**. Recorded: ${run.recordedAt ?? 'n/a'}. Models: ${run.models?.join(', ') || 'n/a'}.`, '');
  L.push('Labels are **construction labels** (each answer was written to be correct, partially correct or wrong, with known injected errors), following the pipeline\'s own written scoring policy. They are not teacher ratings; see `teacher-packet/`.', '');
  L.push('## Verdicts (model-checked answers)', '');
  L.push(`Primary set excludes ${m.counts.contested} contested answers (pedagogically debatable labels). False accept = expected *revise*, judged *pass*. False reject = expected *pass*, judged *revise*.`, '');
  L.push('| Configuration | Accuracy | False accept | False reject | Accuracy incl. contested |', '|---|---|---|---|---|');
  for (const [name, v] of Object.entries(m.verdicts)) L.push(`| ${name} | ${pc(v.primary.accuracy)} | ${pc(v.primary.falseAcceptRate)} | ${pc(v.primary.falseRejectRate)} | ${pc(v.all.accuracy)} |`);
  L.push('', '## Other measurements', '');
  L.push('| Measure | Value |', '|---|---|');
  L.push(`| Deterministic filter: junk stopped before any model call (right reason) | ${m.filter.correctlyFiltered}/${m.filter.expectedFiltered}; valid answers wrongly filtered: ${m.filter.wronglyFiltered.length} |`);
  L.push(`| Schema-valid checker outputs | ${pc(m.schemaValidity)} |`);
  L.push(`| Error quotes found verbatim in the learner text | ${pc(m.quoteGrounding)} |`);
  L.push(`| Injected language errors reported (merged feedback) | ${pc(m.detection.merged)} |`);
  L.push(`| Injected language errors reported, checker A / B alone | ${pc(m.detection.perSlot[0])} / ${pc(m.detection.perSlot[1])} |`);
  L.push(`| A vs B: same verdict / same score / score within ±1 | ${pc(m.agreement.verdict)} / ${pc(m.agreement.scoreExact)} / ${pc(m.agreement.scoreWithin1)} |`);
  L.push(`| Latency per call: median / p90 / max | ${(m.latencyMs.perCallMedian / 1000).toFixed(1)} s / ${(m.latencyMs.perCallP90 / 1000).toFixed(1)} s / ${(m.latencyMs.perCallMax / 1000).toFixed(1)} s |`);
  L.push(`| Latency per submission (two calls in parallel), median | ${(m.latencyMs.perSubmissionMedian / 1000).toFixed(1)} s |`);
  L.push(`| Notional API-equivalent cost (reported by the CLI; paid from a subscription, not billed per call) | $${m.cost.notionalUsdTotal} total, $${m.cost.notionalUsdPerCheckedSubmission} per checked submission (${m.counts.calls} calls) |`);
  L.push(`| Tokens (input / cache read / cache write / output) | ${m.tokens.input} / ${m.tokens.cacheRead} / ${m.tokens.cacheWrite} / ${m.tokens.output} |`);
  L.push('', '## Revision rounds', '', '| Original | Revision | 1st verdict | 2nd verdict | Rounds to pass |', '|---|---|---|---|---|');
  for (const c of m.revisionChains) L.push(`| ${c.original} | ${c.revision} | ${c.firstVerdict ?? '—'} | ${c.secondVerdict ?? '—'} | ${c.roundsToPass ?? 'not passed'} |`);
  L.push('', '## Per answer', '', '| Id | Class | Expected | Filter | Score A | Score B | Merged | OK? | Errors reported |', '|---|---|---|---|---|---|---|---|---|');
  for (const { entry, task, outcome } of rows) {
    const checkedRow = outcome.stage === 'checked';
    const sc = i => (checkedRow && outcome.calls[i]?.ok ? outcome.calls[i].result.score : '—');
    const got = outcome.stage === 'filtered' ? 'filtered' : checkedRow ? outcome.result.verdict : outcome.stage;
    const ok = got === entry.expected ? '✓' : '✗';
    L.push(`| ${entry.id} | ${entry.class}${entry.contested ? ' (contested)' : ''} | ${entry.expected} | ${outcome.filter?.problems?.[0]?.code ?? 'pass'} | ${sc(0)} | ${sc(1)} | ${got} | ${ok} | ${checkedRow ? outcome.result.errors.length : '—'} |`);
    void task;
  }
  if (m.detection.merged.missed.length) L.push('', '**Injected errors not reported:** ' + m.detection.merged.missed.join('; '));
  if (m.quoteGrounding.ungrounded.length) L.push('', '**Quotes not found verbatim:** ' + m.quoteGrounding.ungrounded.join('; '));
  if (m.invalidCalls.length) L.push('', '**Invalid / failed calls:** ' + m.invalidCalls.join('; '));
  L.push('', '## What this does not show', '', '- Whether the feedback helps a learner improve (no learner study).', '- Agreement with a teacher (the teacher packet is prepared, not yet rated).', '- Generalisation: 33 answers, 4 tasks, one lesson, one learner profile (Hungarian L1, B1 French).', '- Production uses Claude + Codex as the two checkers; this run uses two independent Claude calls.', '');
  return L.join('\n');
}

async function main(argv) {
  const opt = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const live = argv.includes('--live');
  const runDir = join(root, live ? (opt('--out') ?? `results/live-${new Date().toISOString().slice(0, 10)}`) : (opt('--run') ?? DEFAULT_RUN));
  const only = opt('--only')?.split(',') ?? null;
  console.log(live ? `MODE: LIVE — calling \`claude -p\` (uses your Claude Code login). Recording to ${runDir}` : `MODE: REPLAY — recorded outputs from ${runDir}. No model is called.`);
  if (live) mkdirSync(join(runDir, 'calls'), { recursive: true });
  else if (!existsSync(join(runDir, 'calls'))) { console.error(`No recordings in ${runDir}.`); return 2; }
  const { rows, metrics } = await evaluate({ runDir, live, model: opt('--model') ?? null, concurrency: Number(opt('--concurrency') ?? 2), only, log: s => console.log(s) });
  const runFile = join(runDir, 'run.json');
  let run = existsSync(runFile) ? JSON.parse(readFileSync(runFile, 'utf8')) : {};
  if (live) {
    const models = [...new Set(rows.flatMap(r => r.outcome.calls ?? []).flatMap(c => c.meta.models ?? []))];
    let cli = null; try { cli = execFileSync('claude', ['--version'], { encoding: 'utf8' }).trim(); } catch { /* optional */ }
    run = { name: runDir.split(/[\\/]/).pop(), recordedAt: new Date().toISOString(), cli, models, evalSet: 'eval-set.v1', tasks: 'tasks.v1', checkers: 'two independent claude -p calls (production: claude + codex)' };
    writeFileSync(runFile, `${JSON.stringify(run, null, 2)}\n`);
  }
  writeFileSync(join(runDir, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
  writeFileSync(join(runDir, 'report.md'), reportMarkdown({ rows, metrics, run: { ...run, mode: live ? 'live (recorded)' : 'replay' } }));
  const v = metrics.verdicts['A+B merged (stricter wins)'].primary;
  console.log(`\nMerged verdict accuracy ${pc(v.accuracy)}, false accept ${pc(v.falseAcceptRate)}, false reject ${pc(v.falseRejectRate)}. Report: ${join(runDir, 'report.md')}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exitCode = await main(process.argv.slice(2));
export { singleVerdict };
