#!/usr/bin/env node
// P5 gépi kapuk.
//   node p5/gates.mjs <week.json | block.<ID>.json> --handoffs <mappa> [--json <fájl>|-] [--all]
// Kilépési kód: 0 = GATE_PASS, 1 = GATE_FAIL, 2 = használati/beolvasási hiba.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runBlockGates, runWeekGates, summarize } from './lib/gates.mjs';
import { sha256 } from './lib/normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));

export const CL_TITLES = {
  SCHEMA: 'Blokkséma',
  'CL-01': 'Review-kötés és hűség',
  'CL-02': 'Statikus játszhatóság',
  'CL-04': 'Válasz-épség (töredék, névelő, duplikátum)',
  'CL-06': 'Egyetlen elfogadott válasz (figyelmeztetés)',
  'CL-07': 'A kulcs a promptban nem szereplő adatot vár',
  'CL-08': 'Brief-megfelelés',
  'CL-18': 'Tiltott meta-tokenek',
  'CL-23': 'Koppintásos jelentés (S23)',
  'CL-27': 'Francia nyelv és francia élet (T27)'
};

export function runGates(inputPath, handoffsDir) {
  const raw = readFileSync(inputPath);
  const data = JSON.parse(raw.toString('utf8'));
  const rules = readJson(join(here, 'playable-types.json'));
  const isBlock = typeof data.schemaVersion === 'string' && data.schemaVersion.startsWith('p5-block');
  const findings = isBlock
    ? runBlockGates(data, { handoffsDir, rules, schema: readJson(join(here, 'schema', 'block.schema.json')) })
    : runWeekGates(data, { handoffsDir, rules });
  return {
    tool: 'p5/gates.mjs',
    input: { path: inputPath, kind: isBlock ? 'p5-block' : `week-v${data.schemaVersion ?? '?'}`, sha256: sha256(raw) },
    handoffs: handoffsDir,
    ...summarize(findings),
    findings
  };
}

export function textReport(report, { all = false, perGroup = 5 } = {}) {
  const lines = [];
  lines.push(`P5 kapuk — ${report.verdict}`);
  lines.push(`Bemenet: ${report.input.path} (${report.input.kind}, sha256 ${report.input.sha256.slice(0, 12)}…)`);
  lines.push(`Kéziratok: ${report.handoffs}`);
  lines.push(`Hibák: ${report.errors} · figyelmeztetések: ${report.warnings}`);
  lines.push('');
  for (const cl of Object.keys(CL_TITLES)) {
    const counts = report.byCl[cl];
    if (!counts) continue;
    lines.push(`${cl} ${CL_TITLES[cl]}: ${counts.errors} hiba, ${counts.warnings} figyelmeztetés`);
    const entries = report.findings.filter(entry => entry.cl === cl);
    const groups = new Map();
    for (const entry of entries) {
      const unit = entry.location.split(' › ')[0];
      if (!groups.has(unit)) groups.set(unit, []);
      groups.get(unit).push(entry);
    }
    for (const [unit, group] of groups) {
      lines.push(`  ${unit} (${group.length})`);
      for (const entry of all ? group : group.slice(0, perGroup)) {
        const mark = entry.severity === 'error' ? 'HIBA' : 'figy.';
        lines.push(`    [${mark}] ${entry.location}: ${entry.message}${entry.text && !entry.message.includes(entry.text) ? ` — „${entry.text}”` : ''}`);
      }
      if (!all && group.length > perGroup) lines.push(`    … még ${group.length - perGroup} (teljes lista: --all vagy --json)`);
    }
    lines.push('');
  }
  lines.push(report.verdict);
  return lines.join('\n');
}

function main(argv) {
  const args = argv.slice(2);
  const option = name => { const index = args.indexOf(name); return index >= 0 ? args.splice(index, 2)[1] : undefined; };
  const flag = name => { const index = args.indexOf(name); if (index >= 0) args.splice(index, 1); return index >= 0; };
  const handoffs = option('--handoffs');
  const jsonOut = option('--json');
  const all = flag('--all');
  const [input] = args;
  if (!input || !handoffs) {
    process.stderr.write('Használat: node p5/gates.mjs <week.json|block.json> --handoffs <mappa> [--json <fájl>|-] [--all]\n');
    return 2;
  }
  let report;
  try {
    report = runGates(resolve(input), resolve(handoffs));
  } catch (error) {
    process.stderr.write(`Beolvasási hiba: ${error.message}\n`);
    return 2;
  }
  if (jsonOut === '-') process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else {
    if (jsonOut) writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);
    process.stdout.write(`${textReport(report, { all })}\n`);
  }
  return report.verdict === 'GATE_PASS' ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv);
