// Agenthívás előkészítése. Egy szerep agentként négyféleképpen kaphatja meg a szerepleírását;
// hogy melyik működik a felhasználó gépén, azt a `doctor --probe-agents` méri meg.
//
//   inline       a szerepleírás a prompt elejére kerül (mindig működik; ez az alapértelmezés)
//   agents-md    a szerepleírás a munkamappa AGENTS.md fájljába kerül; a Codex magától betölti
//   codex-spawn  a munkamappa .codex/agents/ alá kerül az agent, és a fő munkamenet ezt indítja el
//                (kísérleti: két modellréteg, több keret)
//   claude-agent a munkamappa .claude/agents/ alá kerül az agent, és `claude -p --agent <név>` indul

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderClaudeAgent, renderCodexToml } from './agent-defs.mjs';

export const AGENT_MODES = ['inline', 'agents-md', 'codex-spawn', 'claude-agent'];

export function inlinePrompt(agent, prompt) {
  return `# Szerepleírás — ${agent.name}\n\nAz alábbi szerepleírás a te állandó utasításod ebben a munkamenetben.\n\n${agent.instructions}\n\n---\n\n# Megbízás\n\n${prompt}`;
}

export function spawnPrompt(agent, prompt) {
  return [
    `Indítsd el a projekt „${agent.name}” nevű egyedi agentjét (a munkamappa .codex/agents/${agent.name}.toml fájlja), és add át neki szó szerint az alábbi megbízást.`,
    'Te magad ne dolgozz a feladaton. Ha elkészült, a válaszod pontosan az agent végső válasza legyen, változtatás és saját megjegyzés nélkül.',
    'Ha az agentet nem tudod elindítani, csak ennyit írj: AGENT_NEM_INDULT',
    '',
    '<<<MEGBIZAS',
    prompt,
    'MEGBIZAS>>>',
  ].join('\n');
}

/**
 * Előkészíti a munkamappát és a promptot a választott módhoz.
 * Visszaadja a tényleges promptot és a parancssorba illesztendő extra argumentumokat.
 */
export async function prepareAgentCall(mode, agent, { workdir, prompt }) {
  if (!agent) return { prompt, agentArgs: [], mode: 'package' };
  if (!AGENT_MODES.includes(mode)) throw new Error(`Ismeretlen agentmód: ${mode}. Választható: ${AGENT_MODES.join(', ')}`);
  if (mode === 'inline') return { prompt: inlinePrompt(agent, prompt), agentArgs: [], mode };
  if (mode === 'agents-md') {
    await writeFile(join(workdir, 'AGENTS.md'), agent.instructions, 'utf8');
    return { prompt, agentArgs: [], mode };
  }
  if (mode === 'codex-spawn') {
    if (agent.platform !== 'codex') throw new Error(`${agent.name}: a codex-spawn mód csak Codex-agenthez használható.`);
    await mkdir(join(workdir, '.codex', 'agents'), { recursive: true });
    await writeFile(join(workdir, '.codex', 'agents', `${agent.name}.toml`), renderCodexToml(agent), 'utf8');
    return { prompt: spawnPrompt(agent, prompt), agentArgs: [], mode };
  }
  // claude-agent
  await mkdir(join(workdir, '.claude', 'agents'), { recursive: true });
  await writeFile(join(workdir, '.claude', 'agents', `${agent.name}.md`), renderClaudeAgent(agent), 'utf8');
  return { prompt, agentArgs: ['--agent', agent.name], mode };
}

/** Kis próbaagent a hívás ellenőrzéséhez: csak akkor tudja a jelszót a modell, ha a szerepleírás eljutott hozzá. */
export function probeAgent(platform, canary) {
  const instructions = `# plusdeca-probe\n\nTe a Plusdeça próbaagentje vagy. A titkos jelszó: ${canary}. Ha a jelszót kérdezik, pontosan ezt az egy szót írd vissza, semmi mást. Ne használj eszközt.\n`;
  return {
    name: 'plusdeca-probe', platform, effort: 'low', sourceRoles: ['próba'],
    description: 'Plusdeça próbaagent: a hívási mód ellenőrzésére. Csak akkor használd, ha kifejezetten a plusdeca-probe agentet kérik.',
    instructions,
  };
}

export const PROBE_QUESTION = 'Mi a titkos jelszó? Csak a jelszót írd ki. Ha nem tudod, írd: NINCS';
