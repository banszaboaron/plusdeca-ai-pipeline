// Bejárás a valódi webappon (docs/DONTESEK.md 10-28, B út): a jelölt csomagból ideiglenes webapp-buildet
// készít, helyben kiszolgálja, és lefuttatja a webapp kulcsvezérelt bejáróját (390/1280 px + offline).
// Ha a webapp függőségei (playwright-core) nincsenek telepítve: SKIPPED, és a hívó az előnézetet járja be.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const webapp = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'webapp');
const PROGRESS_FILE = 'crawl-progress.json'; // webapp/tools/crawl-progress.mjs

// Időkorlát a hét méretéhez (app-igény 11-14): a fix 15 perc a 207 oldalas 1. héten már kevés volt (kézzel ~14 perc,
// sorban futó szélességekkel). Oldalanként 8 s (két szélesség + offline, terhelt gépen is), plusz 5 perc indulás és
// mentés-próba; legalább 15 perc. A bejáró ezt saját keretként kapja (--idokorlat), és lejártakor részjelentést ír;
// a hívó kemény korlátja ennél 3 perccel később lép csak közbe.
export const CRAWL_BASE_MS = 5 * 60 * 1000;
export const CRAWL_PER_PAGE_MS = 8 * 1000;
export const CRAWL_MIN_MS = 15 * 60 * 1000;
export const CRAWL_GRACE_MS = 3 * 60 * 1000;
export const crawlTimeoutMs = pages => Math.max(CRAWL_MIN_MS, CRAWL_BASE_MS + Math.max(0, Number(pages) || 0) * CRAWL_PER_PAGE_MS);

/** „A bejárás N perc után időtúllépéssel leállt (utolsó oldal: …).” — mint a webapp/tools/crawl-progress.mjs-ben. */
export function crawlTimeoutMessage(elapsedMs, last = {}) {
  const pages = Object.values(last ?? {}).filter(Boolean);
  return `A bejárás ${Math.max(1, Math.round(elapsedMs / 60000))} perc után időtúllépéssel leállt (utolsó oldal: ${pages.length ? pages.join(', ') : 'még egy sem'}).`;
}

/**
 * A bejáró-folyamat kimenetele jelentés nélkül: időtúllépésnél (a kemény korlát lőtte le) érthető hiba az utolsó
 * oldallal a haladásnaplóból; különben a folyamat kimenete.
 */
export function crawlFailureWithoutReport(spawnResult, { reportDir, hardLimitMs }) {
  const timedOut = spawnResult.error?.code === 'ETIMEDOUT' || (spawnResult.signal && spawnResult.status === null);
  if (timedOut) {
    let progress = null;
    try { progress = JSON.parse(readFileSync(join(reportDir, PROGRESS_FILE), 'utf8')); } catch { /* nincs napló */ }
    return { status: 'FAIL', reason: 'webapp-crawl-timeout', findings: [{ cl: 'APP', severity: 'error', location: 'webapp/crawl', message: crawlTimeoutMessage(hardLimitMs, progress?.last) }] };
  }
  return { status: 'FAIL', reason: 'webapp-crawl', findings: [{ cl: 'APP', severity: 'error', location: 'webapp/crawl', message: (spawnResult.stderr || spawnResult.stdout || spawnResult.error?.message || 'nincs jelentés').trim().slice(0, 2000) }] };
}

export const webappCrawlAvailable = () => existsSync(join(webapp, 'node_modules', 'playwright-core')) || existsSync(join(webapp, 'node_modules', 'playwright'));

export async function crawlWebapp(out, week, contentVersion, { reportDir, pages = 0 } = {}) {
  if (!webappCrawlAvailable()) return { status: 'SKIPPED', reason: 'A webapp bejárója nincs telepítve (cd webapp && npm ci).', findings: [] };
  const dist = mkdtempSync(join(tmpdir(), 'plusdeca-webapp-'));
  let server;
  try {
    const build = spawnSync(process.execPath, [join(webapp, 'build.mjs'), '--p5', out, '--out', dist, '--week', `${week}=${contentVersion}`], { encoding: 'utf8' });
    if (build.status !== 0) return { status: 'FAIL', reason: 'webapp-build', findings: [{ cl: 'APP', severity: 'error', location: 'webapp/build', message: build.stderr.trim() || build.stdout.trim() }] };
    server = spawn(process.execPath, [join(webapp, 'serve.mjs'), '--dir', dist, '--port', '0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const url = await new Promise((resolve, reject) => {
      let text = '';
      const timer = setTimeout(() => reject(Error('A webapp-szerver nem indult el.')), 15000);
      server.stdout.on('data', chunk => { text += chunk; const match = /http:\/\/localhost:\d+\//.exec(text); if (match) { clearTimeout(timer); resolve(match[0]); } });
      server.on('exit', () => { clearTimeout(timer); reject(Error('A webapp-szerver leállt.')); });
    });
    const crawlDir = reportDir ?? join(dist, 'crawl');
    const limitMs = crawlTimeoutMs(pages), hardLimitMs = limitMs + CRAWL_GRACE_MS;
    // Régi jelentés / napló ne keveredjen az újba.
    for (const name of ['crawl-report.json', PROGRESS_FILE]) rmSync(join(crawlDir, name), { force: true });
    const crawl = spawnSync(process.execPath, [join(webapp, 'tools', 'crawl.mjs'), url, '--out', crawlDir, '--idokorlat', String(limitMs / 60000)], { encoding: 'utf8', timeout: hardLimitMs, maxBuffer: 64 * 1024 * 1024 });
    const reportPath = join(crawlDir, 'crawl-report.json');
    if (!existsSync(reportPath)) return crawlFailureWithoutReport(crawl, { reportDir: crawlDir, hardLimitMs });
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    return {
      status: report.status === 'PASS' ? 'PASS' : 'FAIL', crawler: 'webapp', results: report.results,
      ...(report.timedOut ? { reason: 'webapp-crawl-timeout', partial: true } : {}), limitMs,
      findings: report.findings.map(f => ({ cl: 'APP', severity: 'error', location: f.where, message: f.message })),
    };
  } catch (error) {
    return { status: 'FAIL', reason: 'webapp-crawl', findings: [{ cl: 'APP', severity: 'error', location: 'webapp', message: error.message }] };
  } finally {
    server?.kill();
    rmSync(dist, { recursive: true, force: true });
  }
}
