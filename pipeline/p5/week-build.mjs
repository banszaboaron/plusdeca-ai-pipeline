#!/usr/bin/env node
// P5 heti építés egy paranccsal (P5-terv 3. pont, első változat):
//   node p5/week-build.mjs <week.plan.json> [--out <mappa>] [--no-crawl] [--preview-crawl]
//   node p5/week-build.mjs --rollback <hét> [--out <mappa>]
// Lépések: 1. átvétel (séma, review-kötés, kapuk) → 2–3. fordítás v2-re és a
// v2 szerződés ellenőrzése → 4. migráció-ellenőrzés az előző kiadáshoz →
// 5. előnézet és böngészős bejárás (alapból a valódi webappon, webapp/tools/crawl.mjs; ha az nincs
// telepítve, vagy --preview-crawl: a statikus előnézeten) → 7. mentés hash-nevű mappába → 9. ledger,
// mutató, RELEASE_STATUS.md. A nyilvános közzététel (8.) nincs bekötve.
// Kilépési kód: 0 = RELEASED, 1 = bármely más állapot, 2 = használati hiba.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runBlockGates, summarize } from './lib/gates.mjs';
import { compileWeek } from './lib/compile.mjs';
import { writePreview } from './lib/preview.mjs';
import { crawlPreview } from './lib/crawl.mjs';
import { crawlWebapp, webappCrawlAvailable } from './lib/app-crawl.mjs';
import { appendLedger, readManifest, rollback, setPointer, writeStatus } from './lib/release.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const pad = number => String(number).padStart(2, '0');

// Item-azonosítók, amelyek az előző kiadásban megvoltak, de most hiányoznak:
// ezekhez migrációs térkép kell (plan.migrations: { régiV2Id: újV2Id | null }).
export function migrationProblems(previousPresentation, presentation, migrations = {}) {
  if (!previousPresentation) return [];
  const now = new Set(Object.keys(presentation.items));
  return Object.keys(previousPresentation.items)
    .filter(id => !now.has(id) && !(id in migrations))
    .map(id => ({ cl: 'MIGRATION', severity: 'error', location: id, message: 'Az item az előző kiadásban megvolt, most hiányzik, és nincs migrációs térkép (a tanulói haladás elveszne).' }));
}

// Migrációs javaslat a hiányzó itemekhez (2026-11-15; DONTESEK 11-02: ahol egyértelmű pár van, a haladás átkerül,
// ahol nincs, elvész). Pár: az előző kiadásban még nem létező új item ugyanabban a blokkban, amelynek az utolsó
// azonosítórésze a régiével egyezik, vagy a régi rész -sNNN/-rN/-retry utótag nélküli alakja (más oldalon is).
// Csak javaslat: a plan.migrations-be a PRESIDENT (vagy az ő szabálya szerint a tartalmi sáv) írja be.
export function proposeMigrations(previousPresentation, presentation, migrations = {}) {
  if (!previousPresentation) return {};
  const before = new Set(Object.keys(previousPresentation.items));
  const now = Object.keys(presentation.items);
  const fresh = now.filter(id => !before.has(id));
  const blockOf = id => id.split(':').slice(0, -2).join(':');
  const tail = id => id.split(':').at(-1);
  const stem = s => s.replace(/(-(s\d+|r\d+|retry(-v\d+)?))+$/, '');
  const out = {};
  for (const id of [...before].filter(x => !now.includes(x) && !(x in migrations))) {
    const same = fresh.filter(n => blockOf(n) === blockOf(id));
    let hits = same.filter(n => tail(n) === tail(id));
    if (hits.length !== 1) hits = same.filter(n => stem(tail(n)) === stem(tail(id)));
    out[id] = hits.length === 1 ? { to: hits[0], reason: 'egyértelmű pár' } : { to: null, reason: hits.length ? `${hits.length} lehetséges pár, nem egyértelmű` : 'nincs pár' };
  }
  return out;
}

export async function buildWeek(planPath, { out, crawl = true, crawler = 'preview' } = {}) {
  const plan = readJson(planPath);
  const planDir = dirname(planPath);
  const handoffsDir = resolve(planDir, plan.handoffs);
  const rules = readJson(join(here, 'playable-types.json'));
  const schema = readJson(join(here, 'schema', 'block.schema.json'));
  mkdirSync(out, { recursive: true });
  const report = { week: plan.week, briefId: plan.briefId ?? null, steps: {} };
  const finish = (status, extra = {}) => {
    const errors = Object.values(report.steps).flatMap(step => step.findings || []).filter(entry => entry.severity === 'error').length;
    appendLedger(out, { week: plan.week, status, contentVersion: report.contentVersion ?? null, errors, blocks: plan.blocks.length, ...extra });
    writeStatus(out);
    return { status, report };
  };

  // 1. Átvétel
  const blocks = [];
  const intake = [];
  for (const ref of plan.blocks) {
    const path = resolve(planDir, ref);
    if (!existsSync(path)) { intake.push({ cl: 'INTAKE', severity: 'error', location: ref, message: 'A blokkfájl hiányzik.' }); continue; }
    const block = readJson(path);
    if (block.week !== plan.week) intake.push({ cl: 'INTAKE', severity: 'error', location: ref, message: `A blokk a(z) ${block.week}. héthez tartozik.` });
    if (blocks.some(other => other.id === block.id)) intake.push({ cl: 'INTAKE', severity: 'error', location: ref, message: `Ismétlődő blokk: ${block.id}.` });
    intake.push(...runBlockGates(block, { handoffsDir, rules, schema, t27Pending: (plan.t27Pending ?? []).includes(block.id) }));
    blocks.push(block);
  }
  report.steps.intake = { ...summarize(intake), findings: intake };
  if (intake.some(entry => entry.severity === 'error' && ['INTAKE', 'SCHEMA', 'CL-01'].includes(entry.cl))) return finish('REJECTED_INPUT');
  if (intake.some(entry => entry.severity === 'error')) return finish('GATE_FAIL');

  // 2–3. Fordítás + v2 szerződés
  const compiled = compileWeek(plan, blocks, { planDir });
  report.contentVersion = compiled.package.contentVersion;
  const contractFindings = compiled.contract.errors.map(error => ({ cl: 'CONTRACT', severity: 'error', location: error.path, message: `${error.code}: ${error.message}` }));
  report.steps.compile = { status: compiled.status, needs: compiled.needs, warnings: compiled.warnings, findings: contractFindings };
  if (compiled.status === 'NEEDS_CAPABILITY') return finish('NEEDS_CAPABILITY');
  if (compiled.status !== 'COMPILED') return finish('GATE_FAIL');

  // 4. Migráció az előző kiadáshoz
  const weekDir = join(out, 'weeks', `w${pad(plan.week)}`);
  const previousVersion = readManifest(out).weeks[String(plan.week)]?.current;
  const previousPath = previousVersion && join(weekDir, previousVersion, 'presentation.json');
  const previous = previousPath && existsSync(previousPath) ? readJson(previousPath) : null;
  const migration = migrationProblems(previous, compiled.presentation, plan.migrations);
  const proposal = migration.length ? proposeMigrations(previous, compiled.presentation, plan.migrations) : null;
  report.steps.migration = { previous: previousVersion ?? null, findings: migration, ...(proposal ? { proposal } : {}) };

  // 5. Előnézet + bejárás; 7. mentés hash-nevű mappába
  const releaseDir = join(weekDir, compiled.package.contentVersion);
  mkdirSync(releaseDir, { recursive: true });
  writeFileSync(join(releaseDir, 'course.json'), `${JSON.stringify(compiled.package, null, 2)}\n`);
  for (const file of compiled.mediaFiles) { mkdirSync(dirname(join(releaseDir, file.uri)), { recursive: true }); copyFileSync(file.path, join(releaseDir, file.uri)); }
  writeFileSync(join(releaseDir, 'presentation.json'), `${JSON.stringify(compiled.presentation, null, 2)}\n`);
  const pages = writePreview(compiled.package, compiled.presentation, join(releaseDir, 'preview'));
  const useWebapp = crawl && crawler === 'webapp' && webappCrawlAvailable();
  const crawlResult = !crawl ? { status: 'SKIPPED', reason: '--no-crawl', findings: [] }
    : useWebapp ? await crawlWebapp(out, plan.week, compiled.package.contentVersion, { reportDir: join(releaseDir, 'webapp-crawl'), pages: pages.length })
    : await crawlPreview(join(releaseDir, 'preview'), pages, { screenshotsDir: join(releaseDir, 'screenshots') });
  report.steps.crawl = { status: crawlResult.status, crawler: useWebapp ? 'webapp' : 'preview', reason: crawlResult.reason, results: crawlResult.results, pages: pages.length, screenshots: (crawlResult.screenshots || []).length, findings: crawlResult.findings };
  writeFileSync(join(releaseDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

  if (migration.length || crawlResult.status === 'FAIL') return finish('GATE_FAIL');
  if (crawlResult.status === 'SKIPPED') return finish('BUILT_UNCRAWLED');

  // 9. Mutató + ledger (közzététel nélkül)
  setPointer(out, plan.week, compiled.package.contentVersion);
  return finish('RELEASED', { previous: previousVersion ?? null });
}

async function main(argv) {
  const args = argv.slice(2);
  const option = name => { const index = args.indexOf(name); return index >= 0 ? args.splice(index, 2)[1] : undefined; };
  const flag = name => { const index = args.indexOf(name); if (index >= 0) args.splice(index, 1); return index >= 0; };
  const out = resolve(option('--out') ?? join(here, 'out'));
  const rollbackWeek = option('--rollback');
  if (rollbackWeek) {
    const result = rollback(out, Number(rollbackWeek));
    process.stdout.write(`Visszaállítva: ${result.from} → ${result.to}\n`);
    return 0;
  }
  const noCrawl = flag('--no-crawl'), previewCrawl = flag('--preview-crawl');
  const [plan] = args;
  if (!plan) { process.stderr.write('Használat: node p5/week-build.mjs <week.plan.json> [--out <mappa>] [--no-crawl] [--preview-crawl] | --rollback <hét>\n'); return 2; }
  const { status, report } = await buildWeek(resolve(plan), { out, crawl: !noCrawl, crawler: previewCrawl ? 'preview' : 'webapp' });
  process.stdout.write(`${status} — hét ${report.week}, csomag ${report.contentVersion ?? '—'}\n`);
  for (const [name, step] of Object.entries(report.steps)) {
    const errors = (step.findings || []).filter(entry => entry.severity === 'error');
    process.stdout.write(`  ${name}: ${step.status ?? (errors.length ? 'FAIL' : 'PASS')}${errors.length ? ` (${errors.length} hiba)` : ''}${step.reason ? ` — ${step.reason}` : ''}\n`);
    for (const entry of errors.slice(0, 10)) process.stdout.write(`    [${entry.cl}] ${entry.location}: ${entry.message}\n`);
  }
  return status === 'RELEASED' ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main(process.argv);
