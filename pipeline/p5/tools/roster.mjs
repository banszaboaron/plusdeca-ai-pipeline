#!/usr/bin/env node
// A hét teljes egységlistája (roster) a heti tervbe, hogy a webapp a még nem kiadott egységeket is mutassa
// („Pas encore disponible”). Gépi átvétel a hét adatcsomagjából (azonosító, cím, tábla-pozíció), szöveget nem ír.
//   node p5/tools/roster.mjs <week.json> <week.plan.json> [--write]
import { readFileSync, writeFileSync } from 'node:fs';

const [weekPath, planPath] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!weekPath || !planPath) { console.error('Használat: node p5/tools/roster.mjs <week.json> <week.plan.json> [--write]'); process.exit(2); }
const week = JSON.parse(readFileSync(weekPath, 'utf8'));
const plan = JSON.parse(readFileSync(planPath, 'utf8'));

export function rosterFrom(weekData) {
  const units = (weekData.units ?? []).map(u => {
    const m = /-u-(\d)-(\d)$/.exec(u.id);
    return { id: u.id, title: u.title, kind: 'lesson', ...(m ? { position: { row: Number(m[1]), column: Number(m[2]) } } : {}) };
  });
  const tests = (weekData.tests ?? []).map(t => ({ id: t.id, kind: 'assessment', assessmentKind: t.type === 'reading-uof' ? 'reading' : t.type }));
  return [...units, ...tests];
}

const roster = rosterFrom(week);
if (process.argv.includes('--write')) {
  writeFileSync(planPath, `${JSON.stringify({ ...plan, roster }, null, 2)}\n`);
  console.log(`${roster.length} egység írva: ${planPath}`);
} else console.log(JSON.stringify(roster, null, 2));
