// Futási jelentés (report.json + report.md) a futásmappába.

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const seconds = ms => (ms == null ? '—' : `${Math.round(ms / 1000)} s`);

export function buildReport(state, result) {
  const steps = state.order.map(id => ({ id, ...state.steps[id] }));
  const totalMs = steps.reduce((sum, s) => sum + (s.ms ?? 0), 0);
  const tokenSteps = steps.filter(s => s.tokens != null);
  return {
    pipeline: state.pipeline,
    createdAt: state.createdAt,
    finishedAt: new Date().toISOString(),
    outcome: result.outcome,
    calls: state.calls,
    totalModelSeconds: Math.round(totalMs / 1000),
    tokens: tokenSteps.length === steps.length && steps.length
      ? tokenSteps.reduce((sum, s) => sum + s.tokens, 0)
      : null,
    steps: steps.map(s => ({
      id: s.id, role: s.role, provider: s.provider, model: s.model, effort: s.effort,
      status: s.status, seconds: s.ms == null ? null : Math.round(s.ms / 1000),
      agent: s.agent ?? null, agentMode: s.agentMode ?? null,
      promptBytes: s.promptBytes, contextBytes: s.contextBytes ?? s.promptBytes, outputBytes: s.outputBytes ?? null, tokens: s.tokens ?? null,
      summary: s.summary ?? null,
    })),
    checks: result.checks ?? {},
    compare: result.compare ?? [],
  };
}

export function renderMarkdown(report) {
  const lines = [];
  lines.push(`# CEO-próbafutás — ${report.pipeline}`, '');
  lines.push(`- Eredmény: **${report.outcome}**`);
  lines.push(`- Modellhívások: ${report.calls}; összes modellidő: ${report.totalModelSeconds} s`);
  lines.push(`- Tokenek: ${report.tokens ?? 'NEM MÉRT (a CLI nem írta ki minden lépésnél)'}`);
  lines.push(`- Kezdés: ${report.createdAt}; vége: ${report.finishedAt}`, '');
  lines.push('| Lépés | Szerep | Agent [mód] | Szolgáltató | Modell | Állapot | Idő | Bemenet (B) | Kimenet (B) | Gépi összegzés |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|');
  for (const s of report.steps) {
    const agentCell = s.agent ? `${s.agent} [${s.agentMode}]` : 'csomag';
    lines.push(`| ${s.id} | ${s.role} | ${agentCell} | ${s.provider} | ${s.model ?? 'alap'} | ${s.status} | ${seconds(s.seconds == null ? null : s.seconds * 1000)} | ${s.contextBytes ?? '—'} | ${s.outputBytes ?? '—'} | ${s.summary ? JSON.stringify(s.summary) : '—'} |`);
  }
  if (report.checks?.question != null) {
    lines.push('', '## Döntésre vár', '', `A(z) **${report.checks.step}** lépés szerzője a te döntésedet kéri:`, '', ...report.checks.question.split('\n').map(l => `> ${l}`), '',
      `Írd a döntésedet ebbe a fájlba: \`${report.checks.decisionFile}\``,
      'Utána indítsd újra ugyanazt a láncot ugyanazzal a `--run-dir` értékkel: a kész lépések nem futnak újra, a szerző a döntéseddel folytatja.');
  }
  const { checks } = report;
  for (const [title, key] of [['Várt kulcsok (a megoldóíró kimenetében)', 'expectedKeys'], ['Várt kulcsok (a független megoldó kimenetében)', 'solverKeys']]) {
    if (!checks[key]) continue;
    lines.push('', `## ${title}`, '', '| Item | Várt | Megtalálva |', '|---|---|---|');
    for (const k of checks[key]) lines.push(`| ${k.item} | ${k.answer} | ${k.found ? 'igen' : '**nem**'} |`);
    lines.push('', '_Csak szöveges előfordulás: a helyes itemhez rendelést a kimenet elolvasásával kell megerősíteni._');
  }
  for (const [title, key] of [['Ismert hibák jelei — automatikus futás', 'knownIssues'], ['Ismert hibák jelei — kézi (ChatGPT) futás ugyanazon a bemeneten', 'manualKnownIssues']]) {
    if (!checks[key]) continue;
    lines.push('', `## ${title}`, '', '| Finding | Leírás | Kulcsszó-találatok |', '|---|---|---|');
    for (const i of checks[key]) lines.push(`| ${i.id} | ${i.description} | ${i.hits.length ? i.hits.join(', ') : '—'} |`);
    lines.push('', '_A kulcsszó-találat csak jelzés. Hogy a review valóban felismerte-e a hibát, azt a kimenet elolvasásával kell eldönteni (lásd értékelőlap)._');
  }
  if (report.compare.length) {
    lines.push('', '## Összevetendő fájlok', '');
    for (const c of report.compare) lines.push(`- automatikus: \`${c.automatic}\` ↔ kézi: \`${c.manual}\``);
  }
  lines.push('', '## Kézi kiegészítés (töltsd ki)', '',
    '- Előfizetési keret a futás előtt / után (a Codex és a Claude saját kijelzője szerint): …',
    '- Megtalálta-e az ismert hibákat (igen / részben / nem, idézettel): …',
    '- Új, valódi hibák: …',
    '- Téves findingok: …',
    '- Emberi beavatkozás a futás közben: …');
  return lines.join('\n') + '\n';
}

export async function writeReport(runDir, state, result) {
  const report = buildReport(state, result);
  await writeFile(join(runDir, 'report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  await writeFile(join(runDir, 'report.md'), renderMarkdown(report), 'utf8');
  return report;
}
