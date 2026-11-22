// Metrics over one evaluation run. Everything here is computed against the CONSTRUCTION LABELS of eval-set.v1
// (the expected verdict follows the pipeline's own written policy). These are not teacher judgements: they measure
// whether the checker applies its own rubric consistently, not whether the feedback helps a learner.
import { singleVerdict } from './pipeline.mjs';

const median = xs => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pct = (xs, p) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)]; };
const round = (x, d = 3) => (x === null || Number.isNaN(x) ? null : Math.round(x * 10 ** d) / 10 ** d);
const rate = (n, d) => ({ n, of: d, rate: d ? round(n / d) : null });

/** Character ranges of `quote` in `text` (all occurrences). */
const ranges = (text, quote) => { const out = []; if (!quote) return out; let at = text.indexOf(quote); while (at >= 0) { out.push([at, at + quote.length]); at = text.indexOf(quote, at + 1); } return out; };
const overlaps = (a, b) => a.some(([s1, e1]) => b.some(([s2, e2]) => s1 < e2 && s2 < e1));
export const isMissingContent = inj => /^required content missing/.test(inj.note ?? '');

/** Is the injected (language) error reported by some returned error whose quote overlaps it in the learner text? */
export function detected(text, injected, errors) {
  const target = ranges(text, injected.quote);
  return errors.some(e => overlaps(target, ranges(text, e.quote.trim())));
}

function confusion(rows, pick) {
  const c = { tp: 0, tn: 0, falseAccept: 0, falseReject: 0, noVerdict: 0 };
  for (const r of rows) {
    const v = pick(r);
    if (!v) { c.noVerdict++; continue; }
    if (r.entry.expected === 'pass') v === 'pass' ? c.tp++ : c.falseReject++;
    else v === 'revise' ? c.tn++ : c.falseAccept++;
  }
  const expRevise = rows.filter(r => r.entry.expected === 'revise').length, expPass = rows.filter(r => r.entry.expected === 'pass').length;
  return { ...c, falseAcceptRate: rate(c.falseAccept, expRevise), falseRejectRate: rate(c.falseReject, expPass), accuracy: rate(c.tp + c.tn, rows.length) };
}

/** rows: [{ entry, task, outcome }] where outcome comes from checkSubmission. */
export function computeMetrics(rows) {
  const filterRows = rows.map(r => ({ id: r.entry.id, expected: r.entry.expected === 'filtered', actual: r.outcome.stage === 'filtered', code: r.outcome.filter?.problems?.[0]?.code ?? null, expectedCode: r.entry.expectedFilter ?? null }));
  const filter = {
    correctlyFiltered: filterRows.filter(f => f.expected && f.actual && f.code === f.expectedCode).length,
    expectedFiltered: filterRows.filter(f => f.expected).length,
    wronglyFiltered: filterRows.filter(f => !f.expected && f.actual).map(f => f.id),
    missedByFilter: filterRows.filter(f => f.expected && !f.actual).map(f => f.id),
  };

  const checked = rows.filter(r => r.outcome.stage === 'checked' && r.entry.expected !== 'filtered');
  const primary = checked.filter(r => !r.entry.contested);
  const verdictOf = slot => r => singleVerdict(r.task, r.outcome.calls[slot])?.verdict ?? null;
  const merged = r => r.outcome.result.verdict;
  const configs = { 'checker A alone': verdictOf(0), 'checker B alone': verdictOf(1), 'A+B merged (stricter wins)': merged };
  const verdicts = Object.fromEntries(Object.entries(configs).map(([name, pick]) => [name, { primary: confusion(primary, pick), all: confusion(checked, pick) }]));

  const calls = checked.flatMap(r => r.outcome.calls.map(c => ({ ...c, entry: r.entry })));
  const okCalls = calls.filter(c => c.ok);
  const quotes = okCalls.flatMap(c => c.result.errors.map(e => ({ grounded: c.entry.text.includes(e.quote), quote: e.quote, id: c.entry.id })));

  const detection = { perSlot: [0, 1].map(slot => { let n = 0, d = 0; for (const r of checked) { const call = r.outcome.calls[slot]; if (!call?.ok) continue; for (const inj of r.entry.injected.filter(i => !isMissingContent(i))) { d++; if (detected(r.entry.text, inj, call.result.errors)) n++; } } return rate(n, d); }) };
  { let n = 0, d = 0; const missed = []; for (const r of checked) for (const inj of r.entry.injected.filter(i => !isMissingContent(i))) { d++; if (detected(r.entry.text, inj, r.outcome.result.errors)) n++; else missed.push(`${r.entry.id}: “${inj.quote}”`); } detection.merged = { ...rate(n, d), missed }; }

  const both = checked.filter(r => r.outcome.calls.every(c => c.ok));
  const s = r => r.outcome.calls.map(c => c.result.score);
  const agreement = {
    verdict: rate(both.filter(r => verdictOf(0)(r) === verdictOf(1)(r)).length, both.length),
    scoreExact: rate(both.filter(r => s(r)[0] === s(r)[1]).length, both.length),
    scoreWithin1: rate(both.filter(r => Math.abs(s(r)[0] - s(r)[1]) <= 1).length, both.length),
  };

  const byId = new Map(rows.map(r => [r.entry.id, r]));
  const chains = rows.filter(r => r.entry.revisionOf).map(r => {
    const first = byId.get(r.entry.revisionOf), v1 = first?.outcome.result?.verdict ?? null, v2 = r.outcome.result?.verdict ?? null;
    return { original: r.entry.revisionOf, revision: r.entry.id, firstVerdict: v1, secondVerdict: v2, roundsToPass: v1 === 'pass' ? 1 : v2 === 'pass' ? 2 : null };
  });

  const dur = okCalls.map(c => c.meta.durationMs).filter(Number.isFinite);
  const perSubmission = checked.map(r => Math.max(...r.outcome.calls.map(c => c.meta.durationMs ?? 0)));
  const cost = calls.map(c => c.meta.costUsd).filter(Number.isFinite);
  const sum = key => calls.reduce((a, c) => a + (Number.isFinite(c.meta[key]) ? c.meta[key] : 0), 0);

  return {
    counts: { entries: rows.length, filtered: rows.filter(r => r.outcome.stage === 'filtered').length, modelChecked: checked.length, contested: checked.filter(r => r.entry.contested).length, pending: rows.filter(r => r.outcome.stage === 'pending').map(r => r.entry.id), calls: calls.length },
    filter,
    verdicts,
    schemaValidity: rate(okCalls.length, calls.length),
    invalidCalls: calls.filter(c => !c.ok).map(c => `${c.entry.id} slot ${c.slot}: ${c.reason}`),
    quoteGrounding: { ...rate(quotes.filter(q => q.grounded).length, quotes.length), ungrounded: quotes.filter(q => !q.grounded).map(q => `${q.id}: “${q.quote}”`) },
    detection,
    agreement,
    revisionChains: chains,
    latencyMs: { perCallMedian: median(dur), perCallP90: pct(dur, 0.9), perCallMax: dur.length ? Math.max(...dur) : null, perSubmissionMedian: median(perSubmission) },
    cost: { notionalUsdTotal: round(cost.reduce((a, b) => a + b, 0), 4), notionalUsdPerCheckedSubmission: checked.length ? round(cost.reduce((a, b) => a + b, 0) / checked.length, 4) : null, callsWithCost: cost.length },
    tokens: { input: sum('inputTokens'), cacheRead: sum('cacheReadTokens'), cacheWrite: sum('cacheWriteTokens'), output: sum('outputTokens') },
  };
}
