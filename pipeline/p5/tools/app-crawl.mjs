#!/usr/bin/env node
// Bejárás a VALÓDI P1-könyvtárban (codex-ág appja), első változat.
//   node p5/tools/app-crawl.mjs <eldobható app-munkapéldány>/app <course.json> [--out <mappa>] [--port 4791]
// A csomagot DEMO névtérbe tükrözi (a mintatár csak DEMO-t fogad), felveszi a
// content/library-manifest.json elejére, elindítja az app szerverét, és minden oldalt
// megnyit 390 px-en (#page=<id>): JS-hiba, üres oldal, válaszhely nélküli item = hiba.
// FIGYELEM: futás közben a munkapéldány content/ mappáját módosítja; a végén mindent visszaállít.
// Csak eldobható példányon (pl. git worktree add --detach <mappa> origin/codex/p1-01-common-base;
// cd <mappa>/app && npm ci) futtasd, ne a Codex munkafáján.
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadPlaywright } from '../lib/crawl.mjs';

const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : fallback; };
const out = resolve(option('--out', 'p5-app-crawl'));
const port = Number(option('--port', '4791'));
const [appDir, coursePath] = args.map(arg => resolve(arg));
if (!appDir || !coursePath || !existsSync(join(appDir, 'server.mjs'))) {
  console.error('Használat: node p5/tools/app-crawl.mjs <app-mappa> <course.json> [--out <mappa>] [--port 4791]');
  process.exit(2);
}
const playwright = await loadPlaywright();
if (!playwright) { console.error('A Playwright nem érhető el.'); process.exit(2); }

const course = JSON.parse(readFileSync(coursePath, 'utf8'));
const demo = JSON.parse(JSON.stringify(course).replaceAll(`${course.namespace}:${course.courseId}`, `demo:${course.courseId}`));
demo.namespace = 'demo';
demo.label = `DEMO — P5 ${course.contentVersion}`;
const manifestPath = join(appDir, 'content', 'library-manifest.json');
const backup = `${manifestPath}.p5-backup`;
copyFileSync(manifestPath, backup);
writeFileSync(join(appDir, 'content', 'p5-crawl.json'), JSON.stringify(demo));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.packages = [{ id: 'p5-crawl', label: demo.label, url: '/content/p5-crawl.json' }, ...manifest.packages.filter(p => p.id !== 'p5-crawl')];
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const server = spawn(process.execPath, ['server.mjs'], { cwd: appDir, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
const findings = [];
const pages = demo.weeks.flatMap(week => week.blocks.flatMap(block => block.pages));
try {
  await new Promise(r => setTimeout(r, 1500));
  const validation = await (await fetch(`http://127.0.0.1:${port}/api/library/validate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(demo) })).json();
  if (!validation.valid) findings.push({ cl: 'APP', severity: 'error', location: 'package', message: `Az app validátora elutasítja: ${JSON.stringify(validation.errors.slice(0, 5))}` });
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => { try { localStorage.setItem('plusdeca:demo-library:selected-package', 'p5-crawl'); } catch {} });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${port}/library/`);
  await page.waitForTimeout(800);
  mkdirSync(out, { recursive: true });
  for (const entry of pages) {
    errors.length = 0;
    await page.goto(`http://127.0.0.1:${port}/library/#page=${encodeURIComponent(entry.id)}`);
    await page.waitForTimeout(250);
    const state = await page.evaluate(() => { const main = document.querySelector('main'); return { length: (main?.innerText || '').length, inputs: main ? main.querySelectorAll('input,textarea,select').length : 0, buttons: main ? main.querySelectorAll('button').length : 0 }; });
    const where = entry.id;
    if (state.length < 50) findings.push({ cl: 'CL-02', severity: 'error', location: where, message: 'Üres oldal a valódi appban.' });
    if (entry.items.length && state.inputs + state.buttons <= 1) findings.push({ cl: 'CL-02', severity: 'error', location: where, message: 'Az itemeknek nincs válaszhelye a valódi appban.' });
    for (const message of errors) findings.push({ cl: 'APP', severity: 'error', location: where, message: `JS-hiba: ${message}` });
    await page.screenshot({ path: join(out, `${entry.id.split(':').slice(3).join('_')}@390.png`), fullPage: true });
  }
  await browser.close();
} finally {
  server.kill();
  copyFileSync(backup, manifestPath);
  unlinkSync(backup);
  unlinkSync(join(appDir, 'content', 'p5-crawl.json'));
}
const report = { app: appDir, course: coursePath, pages: pages.length, status: findings.length ? 'FAIL' : 'PASS', findings };
writeFileSync(join(out, 'app-crawl.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`${report.status} — ${pages.length} oldal a valódi P1-könyvtárban; hibák: ${findings.length}. Képek: ${out}`);
process.exitCode = findings.length ? 1 : 0;
