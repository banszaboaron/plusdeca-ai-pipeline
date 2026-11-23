// A review-zott kéziratlánc betöltése egy blokkhoz.
// Kiindulás: <blokk-ID>.review-pass.md. Ebből (és tranzitívan a hivatkozott
// fájlokból) azok a szerzői kéziratok tartoznak a lánchoz, amelyek neve
// ugyanazzal a blokk-ID-vel kezdődik. A reviewerek saját jelentései nem
// kéziratok (idézhetnek hibás szöveget), ezért kimaradnak.
// Az új, teljesen átírt kézirat review-passa kimondhatja, hogy korábbi tulajdonosi
// overlay-ek helyére lép: `Felváltja: <ID>.owner-….md, …`. Ezek a fájlok megmaradnak
// előzménynek, de nem részei a láncnak (és a csak rajtuk át elért fájlok sem).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normalizeManuscript, sha256 } from './normalize.mjs';

const REVIEWER_OUTPUT = /\.(?:independent-review|targeted-recheck(?:-v\d+)?|final-review)\.md$/u;
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

export function reviewPassFile(blockId) {
  return `${blockId}.review-pass.md`;
}

function roleOf(file) {
  if (file.endsWith('.review-pass.md')) return 'review-pass';
  if (/overlay/u.test(file)) return 'overlay';
  if (/revision/u.test(file)) return 'revision';
  return 'manuscript';
}

// A review-pass `Felváltja:` soraiban felsorolt fájlnevek (több sor is lehet).
function supersededBy(text, refPattern) {
  const lines = text.match(/^\W*Felváltja:.*$/gmu) ?? [];
  return [...new Set(lines.flatMap(line => line.match(refPattern) ?? []))];
}

export function loadReviewChain(handoffsDir, blockId, cache = new Map()) {
  const key = `${handoffsDir}\u0000${blockId}`;
  if (cache.has(key)) return cache.get(key);
  const start = reviewPassFile(blockId);
  const startPath = join(handoffsDir, start);
  if (!existsSync(startPath)) {
    const result = { blockId, found: false, reviewPass: start, files: [], corpus: '', status: null, missingRefs: [], superseded: [], badSupersedes: [] };
    cache.set(key, result);
    return result;
  }
  const refPattern = new RegExp(`${escape(blockId)}\\.[A-Za-z0-9._-]+\\.md`, 'gu');
  // Áron (PRESIDENT) tulajdonosi döntései (<ID>.owner-*.md) a lánc részei, kivéve a review-pass által felváltottakat.
  const ownerPattern = new RegExp(`^${escape(blockId)}\\.owner-[A-Za-z0-9._-]+\\.md$`, 'u');
  const owners = readdirSync(handoffsDir).filter(name => ownerPattern.test(name)).sort();
  const listed = supersededBy(readFileSync(startPath, 'utf8'), refPattern);
  // Csak létező tulajdonosi overlay váltható fel: az elírás vagy egy kézirat kiejtése hiba, nem csendes kimaradás.
  const superseded = listed.filter(file => owners.includes(file));
  const badSupersedes = listed.filter(file => !owners.includes(file));
  const queue = [start, ...owners];
  const seen = new Set(superseded);
  const files = [];
  const missingRefs = [];
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    const path = join(handoffsDir, file);
    if (!existsSync(path)) { missingRefs.push(file); continue; }
    // A hash a sorvége-normalizált (LF) szövegre készül, hogy Windows-on (CRLF) is egyezzen.
    const text = readFileSync(path, 'utf8').replace(/\r\n?/gu, '\n');
    files.push({ file, sha256: sha256(text), role: roleOf(file), text });
    for (const match of text.matchAll(refPattern)) {
      const ref = match[0];
      if (!REVIEWER_OUTPUT.test(ref) && !seen.has(ref)) queue.push(ref);
    }
  }
  const status = /\bREVIEW_PASS\b/u.test(files[0].text) ? 'REVIEW_PASS' : null;
  const corpus = files.map(entry => normalizeManuscript(entry.text)).join(' ¶ ');
  const result = { blockId, found: true, reviewPass: start, files, corpus, status, missingRefs, superseded, badSupersedes };
  cache.set(key, result);
  return result;
}

// Memóriabeli lánc (pl. a CEO futásából): a fájlok sorrendje számít, az első a review-pass.
export function chainFromTexts(blockId, files) {
  const normalized = files.map(entry => {
    const text = String(entry.text).replace(/\r\n?/gu, '\n');
    return { file: entry.file, sha256: sha256(text), role: entry.role ?? roleOf(entry.file), text };
  });
  return {
    blockId,
    found: normalized.length > 0,
    reviewPass: normalized[0]?.file ?? reviewPassFile(blockId),
    files: normalized,
    corpus: normalized.map(entry => normalizeManuscript(entry.text)).join(' \u00b6 '),
    status: normalized[0] && /\bREVIEW_PASS\b/u.test(normalized[0].text) ? 'REVIEW_PASS' : null,
    missingRefs: [],
    superseded: [],
    badSupersedes: []
  };
}
