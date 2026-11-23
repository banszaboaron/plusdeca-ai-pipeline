// Szolgáltatók (Codex, Claude) parancssorának összeállítása a konfigurációból.
// A pontos kapcsolókat a `doctor` parancs ellenőrzi a felhasználó gépén, mielőtt bármi futna.

import { readFile } from 'node:fs/promises';
import { runProcess } from './process.mjs';
import { parseStreamJson } from './usage.mjs';

/**
 * A sablonban a {workdir} és {outFile} helyettesítődik; a {modelArgs} elem nulla vagy több
 * argumentummá bomlik (modell és gondolkodási szint, plusz az esetleges extraArgs), hogy a pozicionális
 * "-" a végén maradjon. Az {agentArgs} elem az agentmód argumentumaira bomlik (pl. --agent <név>).
 */
export function buildCommand(provider, { workdir, outFile, model, effort, agentArgs = [], extraArgs = [] }) {
  const modelArgs = [];
  if (model && provider.modelFlag) modelArgs.push(provider.modelFlag, model);
  if (effort && provider.effortTemplate) {
    modelArgs.push(...provider.effortTemplate.map(a => a.replace('{effort}', effort)));
  }
  if (agentArgs.length && !provider.args.includes('{agentArgs}')) {
    throw new Error(`A(z) ${provider.command} parancssablonjában nincs {agentArgs}; ebben az agentmódban nem hívható.`);
  }
  const args = [];
  for (const token of provider.args) {
    if (token === '{modelArgs}') { args.push(...modelArgs, ...extraArgs); continue; }
    if (token === '{agentArgs}') { args.push(...agentArgs); continue; }
    args.push(token.replace('{workdir}', workdir).replace('{outFile}', outFile));
  }
  return { command: provider.command, args };
}

/** claude -p válaszonkénti kimeneti korlátja (CLAUDE_CODE_MAX_OUTPUT_TOKENS). 64000: az Opus 5.5 elfogadja (11-09, próba);
 *  128000 (11-15): az Opus 5.5 felső határa; az U11 teljes T27-megoldása ~70 ezer tokennél a 64 ezres korláton csonkult. */
export const MAX_OUTPUT_TOKENS = 128000;

/** claude -p automatikus tömörítési ablaka (CLAUDE_CODE_AUTO_COMPACT_WINDOW). Az Opus 5.5 ablaka 1M, a CLI mégis ~365 ezer
 *  tokennél tömörített, és a hosszú javítási válasz eleje elveszett (U43 megoldas-rev1, 11-14). */
export const AUTO_COMPACT_WINDOW = 900000;

/** Lefuttatja a szerepet, és visszaadja a végső szöveget (fájlból vagy stdoutból). */
export async function invokeProvider(provider, { prompt, workdir, outFile, model, effort, timeoutMs, agentArgs, extraArgs }) {
  const { command, args } = buildCommand(provider, { workdir, outFile, model, effort, agentArgs, extraArgs });
  // claude -p: a válaszonkénti kimeneti korlát alapból kb. 32 ezer token; a hosszú megoldás (BLOKK_JSON) ennél több,
  // és a CLI legfeljebb háromszor folytatja (U33 megoldas, 11-09). A felhasználó saját beállítása elsőbbséget kap.
  const env = provider.outputFrom === 'stream-json'
    ? {
        ...process.env,
        CLAUDE_CODE_MAX_OUTPUT_TOKENS: process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS ?? String(provider.maxOutputTokens ?? MAX_OUTPUT_TOKENS),
        CLAUDE_CODE_AUTO_COMPACT_WINDOW: process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW ?? String(provider.autoCompactWindow ?? AUTO_COMPACT_WINDOW),
      }
    : undefined;
  const result = await runProcess(command, args, { input: prompt, cwd: workdir, timeoutMs, env });
  let text = '';
  let stream = null;
  if (provider.outputFrom === 'file') {
    try { text = await readFile(outFile, 'utf8'); } catch { text = ''; }
  } else if (provider.outputFrom === 'stream-json') {
    // claude -p --output-format stream-json --verbose: a válasz a result sorban, mellette a keretadat (rate_limit_event).
    stream = parseStreamJson(result.stdout);
    text = stream ? stream.text : result.stdout;
  } else {
    text = result.stdout;
  }
  const tokens = stream?.tokens ?? extractTokens(`${result.stderr}\n${result.stdout}`);
  // A CLI hibát jelzett (pl. keretkimerülés), de 0-val lépett ki: a vezérlő ezt is hibának lássa.
  const code = stream?.isError && result.code === 0 ? 1 : result.code;
  return { ...result, code, text, command, args, tokens, stream };
}

/**
 * Best-effort tokenszám a CLI saját kiírásából (pl. "tokens used: 12,345").
 * Ha a CLI nem ír ilyet, null: a jelentésben "NEM MÉRT" lesz.
 */
export function extractTokens(output) {
  const matches = [...output.matchAll(/tokens?\s+used[^\d]{0,10}([\d][\d,.\s]*)/gi)];
  if (!matches.length) return null;
  const n = Number.parseInt(matches[matches.length - 1][1].replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
}
