// Kiadási nyilvántartás: release-ledger.json (az egyetlen igazságforrás),
// weeks-manifest.json (melyik hét melyik csomagverzión áll), és a belőlük
// generált RELEASE_STATUS.md. Visszaállítás = a mutató visszaírása, kód nélkül.
// Nyilvános közzététel nincs: az Áron engedélyéhez kötött (DONTESEK).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const readJson = (path, fallback) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback);
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

export const paths = out => ({ ledger: join(out, 'release-ledger.json'), manifest: join(out, 'weeks-manifest.json'), status: join(out, 'RELEASE_STATUS.md') });

export function readLedger(out) { return readJson(paths(out).ledger, { schemaVersion: 'p5-ledger-1', entries: [] }); }
export function readManifest(out) { return readJson(paths(out).manifest, { schemaVersion: 'p5-weeks-1', weeks: {} }); }

export function appendLedger(out, entry) {
  const ledger = readLedger(out);
  ledger.entries.push({ at: new Date().toISOString(), ...entry });
  writeJson(paths(out).ledger, ledger);
  return ledger;
}

export function setPointer(out, week, contentVersion) {
  const manifest = readManifest(out);
  const key = String(week);
  const current = manifest.weeks[key];
  const history = current ? [current.current, ...(current.history || [])].filter(Boolean) : [];
  manifest.weeks[key] = { current: contentVersion, history: history.filter(version => version !== contentVersion) };
  writeJson(paths(out).manifest, manifest);
  return manifest;
}

export function rollback(out, week) {
  const manifest = readManifest(out);
  const key = String(week);
  const entry = manifest.weeks[key];
  if (!entry?.history?.length) throw new Error(`A(z) ${week}. hétnek nincs korábbi kiadott változata.`);
  const [previous, ...rest] = entry.history;
  const from = entry.current;
  manifest.weeks[key] = { current: previous, history: rest, rolledBackFrom: [from, ...(entry.rolledBackFrom || [])] };
  writeJson(paths(out).manifest, manifest);
  appendLedger(out, { week, status: 'ROLLED_BACK', contentVersion: previous, from });
  writeStatus(out);
  return { from, to: previous };
}

const STATUS_TEXT = {
  RELEASED: 'kiadva (helyben; közzététel nincs)', GATE_FAIL: 'kapu piros', REJECTED_INPUT: 'bemenet elutasítva',
  NEEDS_CAPABILITY: 'hiányzó képesség', ROLLED_BACK: 'visszaállítva', BUILT_UNCRAWLED: 'lefordítva, bejárás nélkül'
};

export function writeStatus(out) {
  const ledger = readLedger(out);
  const manifest = readManifest(out);
  const lines = ['# RELEASE_STATUS', '', '> Generált fájl (`p5/lib/release.mjs`) a `release-ledger.json`-ból. Kézzel ne szerkeszd.', '', '## Hetek', '', '| Hét | Aktuális csomag | Korábbi |', '|---|---|---|'];
  for (const [week, entry] of Object.entries(manifest.weeks).sort(([a], [b]) => Number(a) - Number(b))) lines.push(`| ${week} | \`${entry.current}\` | ${(entry.history || []).map(version => `\`${version}\``).join(', ') || '—'} |`);
  lines.push('', '## Utolsó 20 esemény', '', '| Idő | Hét | Állapot | Csomag | Hibák |', '|---|---|---|---|---|');
  for (const entry of ledger.entries.slice(-20).reverse()) lines.push(`| ${entry.at} | ${entry.week} | ${STATUS_TEXT[entry.status] || entry.status} | \`${entry.contentVersion || '—'}\` | ${entry.errors ?? '—'} |`);
  writeFileSync(paths(out).status, `${lines.join('\n')}\n`);
  // Gépi változat a projektkövetőnek (P5-05): ugyanabból a ledgerből, kézzel nem írandó.
  const weeks = Object.fromEntries(Object.entries(manifest.weeks).map(([week, entry]) => {
    const last = [...ledger.entries].reverse().find(item => String(item.week) === week);
    return [week, { current: entry.current, history: entry.history || [], lastEvent: last ? { at: last.at, status: last.status, errors: last.errors ?? null } : null }];
  }));
  const lastByWeek = {};
  for (const item of ledger.entries) lastByWeek[item.week] = { at: item.at, status: item.status, contentVersion: item.contentVersion ?? null, errors: item.errors ?? null };
  writeFileSync(join(out, 'weeks-status.json'), `${JSON.stringify({ schemaVersion: 'p5-weeks-status-1', generatedFrom: 'release-ledger.json', released: weeks, lastAttempt: lastByWeek }, null, 2)}\n`);
}
