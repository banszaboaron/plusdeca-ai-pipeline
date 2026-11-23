#!/usr/bin/env node
// Static, self-contained HTML of the demo walkthrough (replay data) -> docs/demo.html. Used for the README screenshots.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spansFor } from '../lib/pipeline.mjs';
import { runDemo } from './demo.mjs';
import { loadTasks, ROOT } from '../lib/pipeline.mjs';

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
const marked = (text, errors) => {
  let out = '', at = 0;
  for (const s of spansFor(text, errors)) { out += esc(text.slice(at, s.start)) + `<mark>${esc(text.slice(s.start, s.end))}<sup>${s.index + 1}</sup></mark>`; at = s.end; }
  return out + esc(text.slice(at));
};
const FILTER = { keves: 'Too few words', 'nem-francia': 'Not French', zaj: 'Keyboard noise', masolat: 'Copies the task', ures: 'Empty' };

const outcomes = await runDemo({ print: () => {} });
const task = loadTasks().tasks.get('T3');
const cards = outcomes.map(({ entry, outcome }, i) => {
  if (outcome.stage === 'filtered') {
    const p = outcome.filter.problems[0];
    return `<section class="card"><h2>Attempt ${i + 1}</h2><p class="answer">${esc(entry.text)}</p>
<div class="verdict filtered">Stopped by the deterministic filter — ${FILTER[p.code] ?? p.code} (${outcome.filter.wordCount} words, needs ${p.min}–${p.max}). <b>No model call.</b></div></section>`;
  }
  const r = outcome.result;
  const scores = outcome.calls.map((c, k) => `<span class="chip">Checker ${'AB'[k]}: ${c.ok ? `${c.result.score}/5` : 'invalid'}</span>`).join('');
  const errs = r.errors.map((e, k) => `<li><b>${k + 1}.</b> <s>${esc(e.quote)}</s> → <ins>${esc(e.fix)}</ins> <span class="cat">${esc(e.category)}</span><br><span class="why">${esc(e.problem)}</span></li>`).join('');
  return `<section class="card"><h2>Attempt ${i + 1}</h2><p class="answer">${marked(entry.text, r.errors)}</p>
<div class="scores">${scores}<span class="chip strong">Merged (stricter wins): ${r.score}/5, threshold ${r.minimumScore}</span></div>
<div class="verdict ${r.verdict}">${r.verdict === 'pass' ? 'Accepted' : 'Revise and resubmit'}</div>
${errs ? `<ol class="errors">${errs}</ol>` : ''}<p class="summary">${esc(r.summary)}</p></section>`;
}).join('\n');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Feedback demo</title><style>
:root{--bg:#f6f4ef;--card:#fff;--ink:#1d1d1f;--muted:#6b6b70;--line:#e3dfd6;--red:#b3261e;--redbg:#fde7e4;--green:#1e7a3c;--greenbg:#e3f4e8;--amber:#8a5a00;--amberbg:#fff1d6;--accent:#2c4a8c}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17181b;--card:#222327;--ink:#ececee;--muted:#a1a1a8;--line:#34353a;--red:#ff8a80;--redbg:#3a2321;--green:#7ad69a;--greenbg:#1f3326;--amber:#ffc66b;--amberbg:#3a2f1a;--accent:#9db6ff}}
:root[data-theme="dark"]{--bg:#17181b;--card:#222327;--ink:#ececee;--muted:#a1a1a8;--line:#34353a;--red:#ff8a80;--redbg:#3a2321;--green:#7ad69a;--greenbg:#1f3326;--amber:#ffc66b;--amberbg:#3a2f1a;--accent:#9db6ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 48px}header p{color:var(--muted);margin:.25rem 0}
.task{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:16px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:14px 0}
h1{font-size:1.4rem;margin:0}h2{font-size:1rem;margin:0 0 8px;color:var(--muted);font-weight:600}
.answer{font-size:1.05rem;margin:0 0 12px}mark{background:var(--redbg);color:var(--red);text-decoration:underline wavy;text-underline-offset:3px;border-radius:3px;padding:0 1px}
sup{font-size:.65em;margin-left:1px}.scores{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.chip{font-size:.8rem;border:1px solid var(--line);border-radius:999px;padding:2px 10px;color:var(--muted)}.chip.strong{color:var(--accent);border-color:var(--accent)}
.verdict{font-weight:600;border-radius:8px;padding:8px 12px;margin:8px 0}.verdict.pass{background:var(--greenbg);color:var(--green)}
.verdict.revise{background:var(--redbg);color:var(--red)}.verdict.filtered{background:var(--amberbg);color:var(--amber);font-weight:500}
.errors{padding-left:0;list-style:none;margin:10px 0}.errors li{padding:8px 0;border-top:1px solid var(--line)}
s{color:var(--red)}ins{color:var(--green);text-decoration:none;font-weight:600}.cat{font-size:.75rem;color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:0 5px;margin-left:4px}
.why,.summary{color:var(--muted);font-size:.92rem}.note{font-size:.85rem;color:var(--muted)}
</style></head><body><main>
<header><h1>Writing feedback: three attempts</h1>
<p>Replay of recorded checker outputs (two independent Claude calls per checked attempt). Feedback is written in the learner's first language (Hungarian), French forms in quotes.</p></header>
<div class="task"><b>Task (T3):</b> ${esc(task.item.prompt)}</div>
${cards}
<p class="note">Generated by <code>node scripts/render-html.mjs</code> from <code>results/2026-11-22-claude</code>. Labels and scores are not teacher-validated.</p>
</main></body></html>
`;
writeFileSync(fileURLToPath(new URL('docs/demo.html', ROOT)), html);
console.log('docs/demo.html written');
