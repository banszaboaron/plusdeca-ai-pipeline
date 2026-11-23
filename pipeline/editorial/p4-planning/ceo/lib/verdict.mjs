// Kimenetek gépi értelmezése: verdikt, ismert kulcsok és ismert hibák jelei.
// A tartalmi ítéletet nem ez hozza meg; csak a lánc vezérléséhez és a jelentéshez ad adatot.

const VERDICTS = ['REVIEW_PASS', 'REVISION_REQUIRED', 'BLOCKED_EVIDENCE'];

/** A GEPI_OSSZEGZES blokk értelmezése. Hiányzó vagy hibás blokk esetén null. */
export function parseSummary(text) {
  const blocks = [...text.matchAll(/GEPI_OSSZEGZES\s*\n([\s\S]*?)GEPI_OSSZEGZES_VEGE/g)];
  if (!blocks.length) return null;
  const body = blocks[blocks.length - 1][1]; // az utolsó blokk számít
  const fields = {};
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^\s*([a-z_]+)\s*:\s*(.+?)\s*$/i);
    if (m) fields[m[1].toLowerCase()] = m[2];
  }
  const summary = {};
  if (fields.verdict) {
    const v = fields.verdict.toUpperCase().replace(/[^A-Z_]/g, '');
    if (!VERDICTS.includes(v)) return null; // pl. a sablon változatlan "A | B | C" sora
    summary.verdict = v;
    for (const key of ['blocker', 'major', 'minor']) {
      const n = Number.parseInt(fields[key], 10);
      summary[key] = Number.isFinite(n) && n >= 0 ? n : null;
    }
  }
  if (fields.status) {
    const s = fields.status.toUpperCase().replace(/[^A-Z_]/g, '');
    if (!['DRAFT_FOR_REVIEW', 'BLOCKED_DECISION'].includes(s)) return null;
    summary.status = s;
  }
  return Object.keys(summary).length ? summary : null;
}

/** A független megoldó MEGOLDO_OSSZEGZES blokkja: { problems }. Hiányzó vagy hibás blokknál null. */
export function parseSolverSummary(text) {
  const blocks = [...String(text ?? '').matchAll(/MEGOLDO_OSSZEGZES\s*\n([\s\S]*?)MEGOLDO_OSSZEGZES_VEGE/g)];
  if (!blocks.length) return null;
  const m = blocks[blocks.length - 1][1].match(/^\s*problemak\s*:\s*(\d+)\s*$/mi);
  return m ? { problems: Number(m[1]) } : null;
}

/** Igaz, ha a review szerint nincs nyitott blocker/major, és a verdikt PASS. */
export function isPass(summary) {
  return Boolean(summary && summary.verdict === 'REVIEW_PASS' && !summary.blocker && !summary.major);
}

/** A PE hat próbája (agents-src/PE.md) és a tételes ellenőrzőlista: a PE_FINDINGEK „proba” mezőjének értékei. */
export const PE_PROBES = ['valosag', 'mondat', 'kollokacio', 'szint', 'mufaj', 'erdekesseg', 'tetel'];
const SEVERITIES = ['BLOCKER', 'MAJOR', 'MINOR'];

const fold = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/**
 * A PE gépileg olvasható findinglistája (PE_FINDINGEK … PE_FINDINGEK_VEGE), soronként
 * „ID | súly | próba | hely | leírás”. Hiányzó blokknál null; ismeretlen próba → „egyeb”.
 */
export function parsePeFindings(text) {
  const blocks = [...String(text ?? '').matchAll(/PE_FINDINGEK\s*\n([\s\S]*?)PE_FINDINGEK_VEGE/g)];
  if (!blocks.length) return null;
  const out = [];
  for (const line of blocks[blocks.length - 1][1].split(/\r?\n/)) {
    const cells = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
    if (cells.length < 4) continue;
    const severity = cells[1].toUpperCase().replace(/[^A-Z]/g, '');
    if (!SEVERITIES.includes(severity)) continue;
    const probe = fold(cells[2]).replace(/[^a-z]/g, '').replace(/proba$/, '');
    out.push({ id: cells[0], severity, probe: PE_PROBES.includes(probe) ? probe : 'egyeb', location: cells[3], text: cells.slice(4).join(' | ') });
  }
  return out;
}

/** A findingok uniója: a duplikátum azonos hely + próba (a súlyosabb marad, a forrásfutások összegyűlnek). */
export function mergePeFindings(lists) {
  const merged = new Map();
  lists.forEach((list, run) => {
    for (const f of list ?? []) {
      const key = `${fold(f.location).replace(/\s+/g, ' ')}\u0000${f.probe}`;
      const prev = merged.get(key);
      if (!prev) { merged.set(key, { ...f, runs: [run + 1] }); continue; }
      if (SEVERITIES.indexOf(f.severity) < SEVERITIES.indexOf(prev.severity)) Object.assign(prev, { severity: f.severity, text: f.text });
      if (!prev.runs.includes(run + 1)) prev.runs.push(run + 1);
    }
  });
  return [...merged.values()];
}

/** Van-e nyitott BLOCKER/MAJOR a valóság- vagy a mondatpróbából (az újraírási szabályhoz). */
export function needsRewrite(findings) {
  return (findings ?? []).some(f => ['BLOCKER', 'MAJOR'].includes(f.severity) && ['valosag', 'mondat'].includes(f.probe));
}

const normalize = s => s.normalize('NFC').replace(/[’ʼ`´]/g, "'").replace(/\s+/g, ' ').toLowerCase();

/**
 * Ellenőrzi, hogy a várt kulcsalakok szerepelnek-e a kimenetben.
 * Csak jelzés: azt nem bizonyítja, hogy a kimenet a megfelelő itemhez rendelte őket.
 */
export function checkExpectedKeys(text, expected) {
  const haystack = normalize(text);
  return expected.map(item => ({ ...item, found: haystack.includes(normalize(item.answer)) }));
}

/**
 * Ismert hibák kulcsszavas jelei. Találat = "érdemes megnézni", nem bizonyított felismerés;
 * a végső pontozást ember (vagy független értékelő) végzi a jelentés alapján.
 */
export function knownIssueHints(text, issues) {
  const haystack = normalize(text);
  return issues.map(issue => ({
    id: issue.id,
    description: issue.description,
    hits: issue.keywords.filter(k => haystack.includes(normalize(k))),
  }));
}
