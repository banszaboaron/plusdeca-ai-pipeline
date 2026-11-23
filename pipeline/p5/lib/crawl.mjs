// Böngészős bejárás az előnézeten: minden oldal betöltése 390 és 1280 px-en,
// képernyőkép, és ellenőrzés: nincs üres oldal, nincs „nem megjeleníthető” elem,
// minden itemnek van válaszhelye, nincs JS-hiba, nincs vízszintes görgetés.
// A Playwright opcionális: ha nem érhető el, a bejárás SKIPPED állapotot ad.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const VIEWPORTS = [{ name: '390', width: 390, height: 844 }, { name: '1280', width: 1280, height: 800 }];

export async function loadPlaywright() {
  try { return await import('playwright'); } catch { /* globális telepítés keresése */ }
  const root = spawnSync('npm', ['root', '-g'], { encoding: 'utf8', shell: process.platform === 'win32' }).stdout?.trim();
  if (!root) return null;
  try { return createRequire(join(root, 'noop.js'))('playwright'); } catch { return null; }
}

export async function crawlPreview(previewDir, pages, { screenshotsDir } = {}) {
  const playwright = await loadPlaywright();
  if (!playwright) return { status: 'SKIPPED', reason: 'A Playwright nem érhető el (npm i -g playwright).', findings: [], screenshots: [] };
  const browser = await playwright.chromium.launch();
  const findings = [];
  const screenshots = [];
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const entry of pages) {
        errors.length = 0;
        await page.goto(pathToFileURL(join(previewDir, entry.file)).href);
        const state = await page.evaluate(() => ({
          text: document.querySelector('main')?.innerText.trim().length ?? 0,
          stimuli: document.querySelectorAll('[data-stimulus]').length,
          items: document.querySelectorAll('[data-item]').length,
          responses: [...document.querySelectorAll('[data-item]')].filter(form => form.querySelector('[data-response]')).length,
          unsupported: [...document.querySelectorAll('[data-unsupported]')].map(node => node.dataset.unsupported),
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1
        }));
        const where = `${entry.pageId} @${viewport.name}px`;
        if (state.stimuli === 0 && state.items === 0) findings.push({ cl: 'CL-02', severity: 'error', location: where, message: 'Üres oldal a bejáráson.' });
        if (state.responses < state.items) findings.push({ cl: 'CL-02', severity: 'error', location: where, message: `${state.items - state.responses} itemnek nincs válaszhelye.` });
        for (const kind of state.unsupported) findings.push({ cl: 'CL-02', severity: 'error', location: where, message: `Nem megjeleníthető elem: ${kind}.` });
        if (state.overflow) findings.push({ cl: 'CRAWL', severity: 'error', location: where, message: 'Vízszintes görgetés (a tartalom szélesebb a képernyőnél).' });
        for (const message of errors) findings.push({ cl: 'CRAWL', severity: 'error', location: where, message: `JS-hiba: ${message}` });
        if (screenshotsDir) {
          mkdirSync(screenshotsDir, { recursive: true });
          const file = join(screenshotsDir, `${entry.file.replace(/\.html$/u, '')}@${viewport.name}.png`);
          await page.screenshot({ path: file, fullPage: true });
          screenshots.push(file);
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return { status: findings.some(entry => entry.severity === 'error') ? 'FAIL' : 'PASS', findings, screenshots, pages: pages.length };
}
