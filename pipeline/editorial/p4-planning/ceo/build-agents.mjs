#!/usr/bin/env node
// Legenerálja a repó gyökerében a Codex- és Claude-agentfájlokat a szerepkártyákból.
//
//   node build-agents.mjs           megírja/frissíti a fájlokat, és törli az elavult generált fájlokat
//   node build-agents.mjs --check   csak ellenőriz: 1-es kóddal kilép, ha valami nincs szinkronban
//
// Forrás: ../starter-kits/roles.mjs + ../starter-kits/core/ + assignments/SOLVER-AUTO.md (lib/agent-defs.mjs).

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { GENERATED_NOTE, renderAgentFiles } from './lib/agent-defs.mjs';
import { paths } from './lib/paths.mjs';

const AGENT_DIRS = ['.codex/agents', '.claude/agents'];

/** A generált (a megjegyzés alapján felismerhető) fájlok, amelyeket a generátor már nem állít elő. */
async function staleGenerated(root, expected) {
  const stale = [];
  for (const dir of AGENT_DIRS) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    for (const name of await readdir(abs)) {
      const rel = `${dir}/${name}`;
      if (expected[rel] !== undefined) continue;
      const text = await readFile(join(abs, name), 'utf8').catch(() => '');
      if (text.includes(GENERATED_NOTE)) stale.push(rel);
    }
  }
  return stale;
}

export async function syncAgents({ root = paths.repo, check = false, log = console.log } = {}) {
  const files = renderAgentFiles();
  const changed = [];
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    // Windowson a git CRLF-re alakíthatja a sorvégeket; az nem tartalmi eltérés.
    const current = existsSync(abs) ? (await readFile(abs, 'utf8')).replace(/\r\n/g, '\n') : null;
    if (current === content) continue;
    changed.push(rel);
    if (!check) {
      await mkdir(dirname(abs), { recursive: true });
      await writeFile(abs, content, 'utf8');
    }
  }
  const stale = await staleGenerated(root, files);
  if (!check) for (const rel of stale) await rm(join(root, rel));
  if (check) {
    if (changed.length || stale.length) {
      log(`✗ Az agentfájlok nincsenek szinkronban a szerepkártyákkal. Eltérő: ${changed.join(', ') || '—'}; elavult: ${stale.join(', ') || '—'}`);
      log('  Futtasd: node build-agents.mjs');
    } else {
      log(`✓ ${Object.keys(files).length} agentfájl szinkronban.`);
    }
  } else {
    log(`${Object.keys(files).length} agentfájl; frissítve: ${changed.length}, törölve (elavult): ${stale.length}.`);
  }
  return { files, changed, stale, ok: !changed.length && !stale.length };
}

if (process.argv[1]?.endsWith('build-agents.mjs')) {
  const check = process.argv.includes('--check');
  syncAgents({ check }).then(r => { process.exitCode = check && !r.ok ? 1 : 0; }, e => {
    console.error(`Hiba: ${e.message}`);
    process.exitCode = 1;
  });
}
