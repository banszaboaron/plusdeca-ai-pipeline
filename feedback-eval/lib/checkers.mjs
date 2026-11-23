// Checkers: async (prompt, ctx) -> { output, meta }.
//   live:   `claude -p` with the same flags as the production checker (no tools, no customisation, no session saved,
//           structured output bound to CHECK_SCHEMA). Uses the local Claude Code login; no API key is read or stored.
//   replay: recorded outputs from a previous live run (results/<run>/calls/*.json). Refuses to answer if the prompt
//           changed since the recording (prompt SHA-256 mismatch), so a replay can never silently mix versions.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CHECK_SCHEMA } from './pipeline.mjs';

export const TIMEOUT_MS = 5 * 60 * 1000;

function runProcess(command, args, { input, cwd, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, windowsHide: true });
    let stdout = '', stderr = '';
    const timer = setTimeout(() => { child.kill(); reject(Object.assign(Error('timeout'), { code: 'timeout' })); }, timeoutMs);
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    child.on('error', e => { clearTimeout(timer); reject(e); });
    child.on('close', code => { clearTimeout(timer); resolve({ code, stdout, stderr }); });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

export function liveClaude({ model = null, timeoutMs = TIMEOUT_MS } = {}) {
  return async prompt => {
    const cwd = mkdtempSync(join(tmpdir(), 'pd-check-'));
    try {
      const args = ['-p', '--output-format', 'json', '--json-schema', JSON.stringify(CHECK_SCHEMA), '--tools', '', '--safe-mode', '--no-session-persistence', ...(model ? ['--model', model] : [])];
      const started = Date.now();
      const { code, stdout } = await runProcess('claude', args, { input: prompt, cwd, timeoutMs });
      if (code !== 0) throw Object.assign(Error(`exit code ${code}`), { code: 'exit' });
      const out = JSON.parse(stdout);
      if (out.is_error) throw Object.assign(Error('claude reported an error'), { code: out.subtype ?? 'error' });
      const output = out.structured_output ?? JSON.parse(out.result);
      return {
        output,
        meta: {
          durationMs: out.duration_ms ?? Date.now() - started,
          costUsd: out.total_cost_usd ?? null,
          models: Object.keys(out.modelUsage ?? {}),
          inputTokens: out.usage?.input_tokens ?? null,
          cacheReadTokens: out.usage?.cache_read_input_tokens ?? null,
          cacheWriteTokens: out.usage?.cache_creation_input_tokens ?? null,
          outputTokens: out.usage?.output_tokens ?? null,
        },
      };
    } finally { rmSync(cwd, { recursive: true, force: true }); }
  };
}

export const callFile = (runDir, entryId, slot) => join(runDir, 'calls', `${entryId}.slot${slot}.json`);

export function replay(runDir) {
  return async (prompt, { entryId, slot, promptSha }) => {
    const file = callFile(runDir, entryId, slot);
    if (!existsSync(file)) throw Object.assign(Error(`no recording for ${entryId} slot ${slot}`), { code: 'no-recording' });
    const rec = JSON.parse(readFileSync(file, 'utf8'));
    if (rec.promptSha !== promptSha) throw Object.assign(Error(`stale recording for ${entryId} (prompt changed)`), { code: 'stale-recording' });
    if (rec.error) throw Object.assign(Error(rec.error), { code: 'recorded-error' });
    return { output: rec.output, meta: { ...rec.meta, replayed: true } };
  };
}
