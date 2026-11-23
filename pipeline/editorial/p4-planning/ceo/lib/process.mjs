// Külső parancs futtatása időkorláttal, stdin-bemenettel; Windowson is működik.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/** Windows cmd.exe számára biztonságos idézés (csak shell:true esetén használjuk). */
export function quoteWindowsArg(arg) {
  const s = String(arg);
  if (s === '') return '""';
  if (!/[\s"&|<>^()%!]/.test(s)) return s;
  return `"${s.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/, '$1$1')}"`;
}

/** Az npm egy kiterjesztés nélküli (bash-) szkriptet is telepít; Windowson az .exe/.cmd kell. */
export function pickWindowsCandidate(lines) {
  const candidates = lines.map(s => s.trim()).filter(Boolean);
  return candidates.find(c => /\.(exe|cmd|bat)$/i.test(c)) ?? candidates[0] ?? null;
}

/**
 * Megkeresi a parancs tényleges útvonalát. Windowson az npm-mel telepített eszközök .cmd
 * fájlok, amelyeket csak shell-en keresztül lehet indítani.
 */
export function resolveExecutable(command, platform = process.platform, exists = existsSync) {
  if (platform !== 'win32') return { path: command, shell: false };
  // Teljes útvonalat (pl. C:\Program Files\nodejs\node.exe) a `where` nem old fel: közvetlenül ellenőrizzük.
  if (/[\\/]/.test(String(command))) {
    if (!exists(command)) return { path: command, shell: false, missing: true };
    return { path: command, shell: /\.(cmd|bat)$/i.test(command) };
  }
  const found = spawnSync('where', [command], { encoding: 'utf8', windowsHide: true });
  const first = pickWindowsCandidate((found.stdout || '').split(/\r?\n/));
  if (!first) return { path: command, shell: false, missing: true };
  return { path: first, shell: /\.(cmd|bat)$/i.test(first) };
}

function killTree(child) {
  if (!child.pid) return;
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true });
    } else {
      process.kill(-child.pid, 'SIGKILL');
    }
  } catch {
    try { child.kill('SIGKILL'); } catch { /* már leállt */ }
  }
}

/**
 * Lefuttat egy parancsot. Soha nem dob a folyamat hibájára: az eredményben jelzi
 * (code, timedOut, spawnError), hogy a vezérlő eldönthesse a következő lépést.
 */
export function runProcess(command, args, { input = '', cwd, timeoutMs = 20 * 60_000, env } = {}) {
  const resolved = resolveExecutable(command);
  const started = Date.now();
  return new Promise(resolve => {
    let child;
    try {
      child = resolved.shell
        ? spawn([quoteWindowsArg(resolved.path), ...args.map(quoteWindowsArg)].join(' '), {
            cwd, env, shell: true, windowsHide: true,
          })
        : spawn(resolved.path, args, {
            cwd, env, windowsHide: true, detached: process.platform !== 'win32',
          });
    } catch (error) {
      resolve({ code: null, stdout: '', stderr: '', ms: 0, timedOut: false, spawnError: error.message });
      return;
    }
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(() => { timedOut = true; killTree(child); }, timeoutMs);
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ...result, ms: Date.now() - started, timedOut });
    };
    child.stdout.on('data', d => stdout.push(d));
    child.stderr.on('data', d => stderr.push(d));
    child.on('error', error => finish({ code: null, stdout: '', stderr: '', spawnError: error.message }));
    child.on('close', code => finish({
      code,
      stdout: Buffer.concat(stdout).toString('utf8'),
      stderr: Buffer.concat(stderr).toString('utf8'),
    }));
    child.stdin.on('error', () => { /* a folyamat korán kiléphet; ezt a close kezeli */ });
    child.stdin.end(input, 'utf8');
  });
}
