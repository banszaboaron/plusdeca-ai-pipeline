import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const FAKE_AGENT = join(here, 'fixtures', 'fake-agent.mjs');

/** Konfiguráció, amelyben minden szolgáltató a hamis agent. */
export function fakeConfig(limits = {}, agentModes = {}) {
  const fake = {
    command: process.execPath,
    args: [FAKE_AGENT, '--out', '{outFile}', '{modelArgs}', '{agentArgs}'],
    modelFlag: '--model',
    effortTemplate: ['--effort', '{effort}'],
    outputFrom: 'file',
    jsonFlag: '--json',
  };
  return {
    providers: { codex: { ...fake, agentMode: agentModes.codex ?? 'inline' }, claude: { ...fake, agentMode: agentModes.claude ?? 'inline', outputFrom: 'stdout', args: [FAKE_AGENT, '{modelArgs}', '{agentArgs}'] } },
    workRoot: 'runDir',
    assign: { 'GI1-3': 'codex', PE: 'codex', 'GI1-4': 'codex' },
    roles: { PE: { effort: 'high' } },
    limits: { maxCalls: 10, maxRounds: 2, stepTimeoutMs: 20_000, ...limits },
  };
}

export async function tempDirs() {
  const root = await mkdtemp(join(tmpdir(), 'plusdeca-ceo-test-'));
  const stateDir = join(root, 'fake');
  const runDir = join(root, 'run');
  await import('node:fs/promises').then(fs => fs.mkdir(stateDir, { recursive: true }));
  process.env.FAKE_STATE_DIR = stateDir;
  return { root, stateDir, runDir, cleanup: () => rm(root, { recursive: true, force: true }) };
}

export async function callLog(stateDir) {
  try {
    return (await readFile(join(stateDir, 'calls.log'), 'utf8')).trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

export const silent = () => {};
