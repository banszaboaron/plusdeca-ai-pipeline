// Hamis agent a tesztekhez: a Codex/Claude CLI helyett fut. Hálózatot és keretet nem használ.
//
// Környezeti változók:
//   FAKE_STATE_DIR  ide írja a hívásnaplót és a számlálókat (kötelező)
//   FAKE_REVIEWS    review-verdiktek sorrendje vesszővel, pl. "REVISION_REQUIRED,REVIEW_PASS"
//   FAKE_AUTHOR     "decide": a szerző döntést kér, amíg a promptban nincs „# A PRESIDENT döntése”;
//                   "nosummary": a szerző gépi összegzés nélkül válaszol
//   FAKE_DECIDE_IF  ha meg van adva, a "decide" csak akkor kérdez, ha a prompt tartalmazza ezt a szöveget
//   FAKE_MANUSCRIPT "same": a döntés utáni kéziratjavításban KEZIRAT_VALTOZATLAN-t ad
//   FAKE_HELP       "ask": a szerző és a review is segítséget kér, amíg a promptban nincs „# A PRESIDENT válasza a segítségkérésedre”
//   FAKE_P5         "bad": a blokk-JSON első változata kitalált szöveget tartalmaz (a P5-javítás után jó);
//                   "never": mindig hibás
//   FAKE_SOLVER_PROBLEMS  a megoldó problémaszámai hívásonként vesszővel, pl. "2,0" (alap: 0)
//   FAKE_MINOR      a review minor-számai hívásonként vesszővel, pl. "2,0" (alap: 0)
//   FAKE_STREAM     "json": a kimenet a claude -p stream-json alakja (rate_limit_event-tel); FAKE_RATELIMIT,
//                   FAKE_RATELIMIT_RESET, FAKE_UTILIZATION: keretkimerülés és kihasználtság szimulálása
//   FAKE_MODE       "normal" (alap) | "sleep" | "fail" | "empty" | "nosummary" | "noagent"
//                   (noagent: a munkamappából betöltött agentet figyelmen kívül hagyja, mint egy CLI, amely nem ismeri)
//
// Használat: node fake-agent.mjs --out <fájl>   (a prompt a stdin-en érkezik)

import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outIndex = process.argv.indexOf('--out');
const outFile = outIndex > 0 ? process.argv[outIndex + 1] : null;
const stateDir = process.env.FAKE_STATE_DIR;
const mode = process.env.FAKE_MODE || 'normal';

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const prompt = Buffer.concat(chunks).toString('utf8');
  // Amit egy valódi CLI a munkamappából betöltene: AGENTS.md, .codex/agents, .claude/agents (--agent).
  const agentIndex = process.argv.indexOf('--agent');
  const agentName = agentIndex > 0 ? process.argv[agentIndex + 1] : null;
  const loaded = [];
  if (existsSync('AGENTS.md')) loaded.push(readFileSync('AGENTS.md', 'utf8'));
  if (existsSync('.codex/agents')) for (const f of readdirSync('.codex/agents')) loaded.push(readFileSync(join('.codex/agents', f), 'utf8'));
  if (agentName && existsSync(join('.claude/agents', `${agentName}.md`))) loaded.push(readFileSync(join('.claude/agents', `${agentName}.md`), 'utf8'));
  const context = [...loaded, prompt].join('\n');
  const isProbe = prompt.includes('Mi a titkos jelszó?');
  const isReview = prompt.includes('verdict: REVIEW_PASS | REVISION_REQUIRED');
  const isSolver = context.includes('Független megoldó');
  const kind = isProbe ? 'probe' : isReview ? 'review' : isSolver ? 'solver' : 'author';
  const files = [existsSync('AGENTS.md') && 'AGENTS.md', existsSync('.codex/agents') && '.codex/agents', existsSync('.claude/agents') && '.claude/agents'].filter(Boolean);
  appendFileSync(join(stateDir, 'calls.log'), `${kind}\t${process.argv.slice(2).join(' ')}\t${files.join(',')}\t${Buffer.byteLength(context)}\n`);

  if (mode === 'sleep') { setTimeout(() => {}, 60_000); return; }
  if (mode === 'fail') { process.stderr.write('szimulált hiba\n'); process.exit(3); }

  let text;
  if (isProbe) {
    const m = (mode === 'noagent' ? prompt : context).match(/A titkos jelszó: (PD-[0-9A-F]+)/);
    text = m ? m[1] : 'NINCS';
  } else if (mode === 'empty') {
    text = '';
  } else if (isReview) {
    const counterFile = join(stateDir, 'review-counter');
    const n = existsSync(counterFile) ? Number(readFileSync(counterFile, 'utf8')) : 0;
    writeFileSync(counterFile, String(n + 1));
    const sequence = (process.env.FAKE_REVIEWS || 'REVIEW_PASS').split(',');
    const verdict = sequence[Math.min(n, sequence.length - 1)];
    const major = verdict === 'REVIEW_PASS' ? 0 : 1;
    text = `# PE-jelentés ${n + 1}\n\nPE-F01 MAJOR: ismétlődő helyzet.\n`;
    if (mode !== 'nosummary') {
      const minors = (process.env.FAKE_MINOR || '0').split(',');
      const minor = minors[Math.min(n, minors.length - 1)];
      text += `\nGEPI_OSSZEGZES\nverdict: ${verdict}\nblocker: 0\nmajor: ${major}\nminor: ${minor}\nGEPI_OSSZEGZES_VEGE\n`;
    }
  } else if (isSolver) {
    const counterFile = join(stateDir, 'solver-counter');
    const n = existsSync(counterFile) ? Number(readFileSync(counterFile, 'utf8')) : 0;
    writeFileSync(counterFile, String(n + 1));
    const sequence = (process.env.FAKE_SOLVER_PROBLEMS || '0').split(',');
    const problems = sequence[Math.min(n, sequence.length - 1)];
    text = '| item | válasz |\n|---|---|\n| GI1-P04-I01 | avons pris |\n| GI1-P04-I02 | a vu |\n| GI1-P04-I03 | ont fait |\n| GI1-P05-I01 | avons pris |\n| GI1-P05-I02 | ai vu |\n| GI1-P05-I03 | ont fait |\n';
    if (problems !== 'none') text += `\nMEGOLDO_OSSZEGZES\nproblemak: ${problems}\nMEGOLDO_OSSZEGZES_VEGE\n`;
  } else if (process.env.FAKE_AUTHOR === 'decide' && !prompt.includes('# A PRESIDENT döntése') && (!process.env.FAKE_DECIDE_IF || prompt.includes(process.env.FAKE_DECIDE_IF))) {
    text = '# GI1-3 — részleges válasz\n\n# DÖNTÉSI KÉRDÉS\n\nA megbízás 4 példát kér, a terv 5-öt. Melyik legyen?\n\nGEPI_OSSZEGZES\nstatus: BLOCKED_DECISION\nGEPI_OSSZEGZES_VEGE\n';
  } else if (process.env.FAKE_MANUSCRIPT === 'same' && prompt.includes('KEZIRAT_VALTOZATLAN')) {
    text = 'KEZIRAT_VALTOZATLAN\n\n# GI1-P02 — Explication\nTanulói tartalom.\n\nGEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n';
  } else if (process.env.FAKE_AUTHOR === 'nosummary') {
    text = '# GI1-3 — válasz összegzés nélkül\n';
  } else {
    text = [
      '# GI1-3 — válasz',
      '',
      '# GI1-P02 — Explication',
      'Tanulói tartalom.',
      '',
      '# GI1-P04 — Exercice',
      '### GI1-P04-I01',
      'Nous ___ le train.',
      '#### Szerzői megjegyzés',
      'Várt jelentés/alak: avons pris',
      '',
      '# GI1-P05 — Beírás',
      'Kulcsok: avons pris, a vu, ont fait, avons pris, ai vu, ont fait',
      '',
      '# Átadás a CEO-nak',
      'Kész.',
      '',
      'GEPI_OSSZEGZES',
      'status: DRAFT_FOR_REVIEW',
      'GEPI_OSSZEGZES_VEGE',
      '',
    ].join('\n');
  }
  // P5: ha a megbízás blokk-JSON-t kér, a szerző a saját szövegéből épít egyet.
  if (!isProbe && !isSolver && !isReview && prompt.includes('BLOKK_JSON_VEGE') && text) {
    const fixed = prompt.includes('# P5-kapu findingok');
    const bad = process.env.FAKE_P5 === 'never' || (process.env.FAKE_P5 === 'bad' && !fixed);
    // A heti lánc a blokk saját P5-azonosítóját és kéziratfájlját adja meg a szabályban; a pilot a rögzítettet.
    const pid = prompt.match(/A blokk P5-azonosítója: (w\d\d-[a-z0-9-]+)/)?.[1] ?? 'w07-u-1-1';
    const file = prompt.match(/`manuscriptRef\.file`: `([^`]+)`/)?.[1] ?? 'kezirat.md';
    const ref = { file, anchor: 'GI1-P04 — Exercice' };
    const block = {
      schemaVersion: 'p5-block-1.0.0', contractVersion: '2.0.0', id: pid, week: Number(pid.slice(1, 3)), kind: 'lesson', title: 'Explication', prerequisites: [],
      pages: [{ id: `${pid}-p04`, template: 'PAGE-closed', variant: 'PV-typed-short', title: 'Exercice', content: [], manuscriptRef: ref,
        items: [{ id: `${pid}-i01`, capability: 'CAP-typed-short', variant: 'PV-typed-short', prompt: bad ? 'Nous ___ le bus.' : 'Nous ___ le train.',
          response: { type: 'text', lines: 'single' }, solution: { type: 'exact', key: 'avons pris', alternatives: [] }, evaluation: { mode: 'exact' }, manuscriptRef: ref }] }],
      completion: { mode: 'all-items', requiredRefs: [`${pid}-i01`] },
    };
    text = text.replace(/\nGEPI_OSSZEGZES\n/, `\nBLOKK_JSON\n${JSON.stringify(block, null, 2)}\nBLOKK_JSON_VEGE\n\nGEPI_OSSZEGZES\n`);
  }
  // Kívánságlista: az FR az elsőt a GR-hez rendeli, a többit későbbre; a rendező mindent a GI1-be épít.
  if (!isProbe && !isReview && prompt.includes('KIVANSAGOK_VEGE') && text) {
    const ids = [...prompt.matchAll(/^- `([^`]+)` \[/gm)].map(m => m[1]);
    const fr = prompt.includes('# Heti koncepció és rendezői briefek — FR');
    const rows = ids.map((id, i) => (fr ? `${id} | ${i === 0 ? 'GR' : 'kesobb'} | - | ${i === 0 ? 'illik a heti nyelvtanhoz' : 'nem ehhez a témához'}` : `${id} | beepul | GI1 | a modellszövegben és egy itemben`));
    text = text.replace(/\nGEPI_OSSZEGZES\n/, `\nKIVANSAGOK\n${rows.join('\n')}\nKIVANSAGOK_VEGE\n\nGEPI_OSSZEGZES\n`);
  }
  if (process.env.FAKE_HELP === 'ask' && !isProbe && !isSolver && !prompt.includes('# A PRESIDENT válasza egy segítségkérésre') && text) {
    text = text.replace(/\nGEPI_OSSZEGZES\n/, '\nSEGITSEGKERES\nmi kell: FEI DELF B2 minta\nmit kérsz: töltsd le\nmiért: mérce\ntartalékterv: belső értékelés\nSEGITSEGKERES_VEGE\n\nGEPI_OSSZEGZES\n');
  }
  if (process.env.FAKE_STREAM === 'json') {
    // claude -p --output-format stream-json --verbose utánzata: assistant, rate_limit_event, result.
    // FAKE_RATELIMIT=n: az első n hívást a keret miatt elutasítja (FAKE_RATELIMIT_RESET: unix-idő, alap: nincs időpont).
    const counterFile = join(stateDir, 'stream-counter');
    const n = existsSync(counterFile) ? Number(readFileSync(counterFile, 'utf8')) : 0;
    writeFileSync(counterFile, String(n + 1));
    const limited = n < Number(process.env.FAKE_RATELIMIT || 0);
    const reset = process.env.FAKE_RATELIMIT_RESET;
    const util = Number(process.env.FAKE_UTILIZATION || 0.42);
    const lines = [
      { type: 'system', subtype: 'init' },
      ...(limited ? [] : [{ type: 'assistant', message: { content: [{ type: 'text', text }] } }]),
      { type: 'rate_limit_event', rate_limit_info: { status: limited ? 'rejected' : 'allowed', resetsAt: reset ? Number(reset) : null, rateLimitType: 'five_hour', unifiedWindows: { five_hour: { utilization: limited ? 1 : util, resetsAt: 1793160000 }, seven_day: { utilization: 0.07, resetsAt: 1793523600 } } } },
      limited
        ? { type: 'result', subtype: 'success', is_error: true, result: reset ? `Claude AI usage limit reached|${reset}` : "You've hit your usage limit" }
        : { type: 'result', subtype: 'success', is_error: false, result: text, usage: { input_tokens: 1000, output_tokens: 234 } },
    ];
    process.stdout.write(lines.map(l => JSON.stringify(l)).join('\n') + '\n');
    if (limited) process.exitCode = 1;
    return;
  }
  if (outFile) writeFileSync(outFile, text); else process.stdout.write(text);
  process.stdout.write('tokens used: 1,234\n');
});
