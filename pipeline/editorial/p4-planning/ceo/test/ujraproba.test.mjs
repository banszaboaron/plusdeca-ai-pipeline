// A CEO maga kezeli, amit eddig levélben kért (2026-11-15): átmeneti CLI-hiba, hiányzó gépi összegzés,
// időtúllépés és lejárt bejelentkezés.
import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthError, Engine, StepError, isAuthError } from '../lib/engine.mjs';
import { fakeConfig, tempDirs, silent } from './helpers.mjs';

const SUMMARY = 'Kész.\n\nGEPI_OSSZEGZES\nstatus: DRAFT_FOR_REVIEW\nGEPI_OSSZEGZES_VEGE\n';
const ok = text => ({ code: 0, text, stdout: '', stderr: '', ms: 5 });

async function engineWith(dirs, answers, extra = {}) {
  const calls = [];
  const sleeps = [];
  const engine = new Engine({
    runDir: dirs.runDir, config: fakeConfig(), pipeline: 't', log: silent,
    invoke: async (provider, opts) => { calls.push(opts); const a = answers[Math.min(calls.length - 1, answers.length - 1)]; return typeof a === 'function' ? a(opts) : a; },
    sleep: async ms => { sleeps.push(ms); },
    ...extra,
  });
  await engine.init();
  return { engine, calls, sleeps };
}

test('átmeneti CLI-hiba (kód 1, üres kimenet): 1 perc múlva egy újrapróba, utána siker', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { engine, calls, sleeps } = await engineWith(dirs, [{ code: 1, text: '', stdout: '', stderr: '', ms: 1 }, ok(SUMMARY)]);
  const r = await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'Írj.\nGEPI_OSSZEGZES\n' });
  assert.equal(r.summary.status, 'DRAFT_FOR_REVIEW');
  assert.equal(calls.length, 2);
  assert.deepEqual(sleeps, [60_000]);
});

test('kétszeri hiba után a lépés hibával áll meg', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { engine, calls } = await engineWith(dirs, [{ code: 1, text: '', stdout: '', stderr: 'x', ms: 1 }]);
  await assert.rejects(engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'Írj.' }), StepError);
  assert.equal(calls.length, 2);
});

test('hiányzó gépi összegzés: egy újrapróba, ha a megbízás kéri; ha nem kéri, nincs újrapróba', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { engine, calls } = await engineWith(dirs, [ok('Kész, de összegzés nélkül.'), ok(SUMMARY)]);
  const r = await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'Írj.\nGEPI_OSSZEGZES\nstatus: …\nGEPI_OSSZEGZES_VEGE\n' });
  assert.equal(r.summary.status, 'DRAFT_FOR_REVIEW');
  assert.equal(calls.length, 2);
  const other = await engineWith(await tempDirs(), [ok('Szabad szöveg.')]);
  await other.engine.step('s2', { role: 'GI1-3', provider: 'codex', prompt: 'Írj szabadon.' });
  assert.equal(other.calls.length, 1);
});

test('időtúllépés: egy újrapróba másfélszeres idővel; nagy promptnál nagyobb korlát', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const { engine, calls } = await engineWith(dirs, [{ timedOut: true, code: null, text: '', ms: 1 }, ok('rendben')]);
  await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'x'.repeat(400_000) });
  assert.equal(calls.length, 2);
  const base = engine.config.limits.stepTimeoutMs;
  assert.equal(calls[0].timeoutMs, Math.round(base * 1.6));
  assert.equal(calls[1].timeoutMs, Math.round(Math.round(base * 1.6) * 1.5));
});

test('lejárt bejelentkezés: értesítés, várakozás a belépésig, majd ugyanaz a lépés folytatódik', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  const waits = [];
  let checks = 0;
  const authFail = { code: 1, text: '', stdout: '{"type":"result","is_error":true,"result":"Failed to authenticate: OAuth session expired and could not be refreshed"}', stderr: '', ms: 1 };
  const { engine, calls } = await engineWith(dirs, [authFail, ok('rendben')], {
    hooks: { onWaiting: async w => { waits.push(w); } },
    authCheck: async () => (checks += 1) >= 2,
  });
  const r = await engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'Írj.' });
  assert.equal(r.text, 'rendben');
  assert.equal(calls.length, 2);
  assert.equal(waits.length, 1);
  assert.equal(waits[0].kind, 'auth');
  assert.equal(checks, 2);
  assert.equal(engine.state.calls, 1, 'a bejelentkezési hiba nem számít hívásnak');
  assert.equal(engine.state.waiting ?? null, null);
});

test('lejárt bejelentkezés, és a várakozási idő alatt nincs belépés: AuthError (BLOCKED_AUTH)', async t => {
  const dirs = await tempDirs(); t.after(dirs.cleanup);
  let clock = 0;
  const authFail = { code: 1, text: '', stdout: '', stderr: 'Error: Failed to authenticate', ms: 1 };
  const { engine } = await engineWith(dirs, [authFail], {
    authCheck: async () => false,
    now: () => clock,
    sleep: async ms => { clock += ms; },
  });
  await assert.rejects(engine.step('s1', { role: 'GI1-3', provider: 'codex', prompt: 'Írj.' }), AuthError);
});

test('isAuthError: a CLI bejelentkezési hibái igen, a tartalmi hiba nem', () => {
  assert.ok(isAuthError({ stderr: 'OAuth session expired and could not be refreshed' }));
  assert.ok(isAuthError({ stdout: 'Please run /login' }));
  assert.ok(!isAuthError({ stderr: 'TypeError: x is not a function', text: 'A szerző a bejelentkezés szót használta.' }));
});
