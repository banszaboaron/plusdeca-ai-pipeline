// A webapp-bejárás időkorlátja (app-igény 11-14): a hét méretéhez igazodik, és időtúllépésnél érthető hibát ad.
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { CRAWL_GRACE_MS, CRAWL_MIN_MS, crawlFailureWithoutReport, crawlTimeoutMessage, crawlTimeoutMs } from '../lib/app-crawl.mjs';
import { timeoutMessage } from '../../webapp/tools/crawl-progress.mjs';

const minutes = ms => ms / 60000;

test('az időkorlát a hét oldalszámával nő; kicsi hétnél legalább 15 perc', () => {
  assert.equal(crawlTimeoutMs(0), CRAWL_MIN_MS);
  assert.equal(crawlTimeoutMs(10), CRAWL_MIN_MS);
  assert.equal(crawlTimeoutMs(undefined), CRAWL_MIN_MS);
  assert.equal(crawlTimeoutMs(207), 5 * 60000 + 207 * 8000, 'az 1. hét (207 oldal) ~32,6 perc, nem 15');
  assert.ok(crawlTimeoutMs(260) > crawlTimeoutMs(207));
  assert.ok(crawlTimeoutMs(207) > 2 * 14 * 60000, 'a mért ~14 perc (sorban futó szélességekkel) több mint kétszerese');
});

test('kemény időtúllépés jelentés nélkül: érthető hiba az utolsó oldallal a haladásnaplóból', t => {
  const dir = mkdtempSync(join(tmpdir(), 'plusdeca-crawl-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'crawl-progress.json'), JSON.stringify({ last: { 390: 'u-5-4 p3 @390', 1280: 'u-5-3 p7 @1280' } }));
  const hardLimitMs = crawlTimeoutMs(207) + CRAWL_GRACE_MS;
  const timedOut = { error: Object.assign(Error('spawnSync node ETIMEDOUT'), { code: 'ETIMEDOUT' }), status: null, signal: 'SIGTERM', stdout: '', stderr: '' };
  const result = crawlFailureWithoutReport(timedOut, { reportDir: dir, hardLimitMs });
  assert.equal(result.status, 'FAIL');
  assert.equal(result.reason, 'webapp-crawl-timeout');
  assert.equal(result.findings[0].message, `A bejárás ${Math.round(minutes(hardLimitMs))} perc után időtúllépéssel leállt (utolsó oldal: u-5-4 p3 @390, u-5-3 p7 @1280).`);
  rmSync(join(dir, 'crawl-progress.json'));
  assert.match(crawlFailureWithoutReport(timedOut, { reportDir: dir, hardLimitMs }).findings[0].message, /időtúllépéssel leállt \(utolsó oldal: még egy sem\)/);
});

test('más hiba (nem időtúllépés) jelentés nélkül: a folyamat kimenete, mint eddig', () => {
  const result = crawlFailureWithoutReport({ status: 1, signal: null, stdout: '', stderr: 'TypeError: x\n  at answerItem' }, { reportDir: tmpdir(), hardLimitMs: 1 });
  assert.equal(result.reason, 'webapp-crawl');
  assert.equal(result.findings[0].message, 'TypeError: x\n  at answerItem');
  assert.equal(crawlFailureWithoutReport({ status: 1, signal: null }, { reportDir: tmpdir(), hardLimitMs: 1 }).findings[0].message, 'nincs jelentés');
});

test('a P5 és a bejáró ugyanúgy fogalmazza az időtúllépést', () => {
  for (const [ms, last] of [[32 * 60000, { 390: 'a p1 @390' }], [90000, {}], [5 * 60000, { 390: 'a p2 @390', 1280: 'b p1 @1280', offline: 'offline c p3' }]]) {
    assert.equal(crawlTimeoutMessage(ms, last), timeoutMessage(ms, last));
  }
});
