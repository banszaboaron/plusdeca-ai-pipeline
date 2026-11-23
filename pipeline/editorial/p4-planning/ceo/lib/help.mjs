// Segítségkérés (SEGITSEGKERES) futásszinten: nem blokkol, forrásonként egyszer kér, a választ minden szerep megkapja.
//
// A szerep a tartaléktervével leadott válasszal azonnal továbbmegy. A CEO a kérést a futás közös nyilvántartásába
// veszi (state.help), és csak az első, új forrásra szóló kérésnél értesít. Ugyanarra a forrásra később érkező
// kérés (a „mi kell” sor szavainak átfedése vagy közös URL alapján) nem kap új értesítést, csak a nyilvántartásba
// kerül. A válasz a futásmappa decisions/segitseg-<n>.md fájljába jön (közös fájl a kérés minden lépésének);
// amint ott van, a CEO minden további hívás promptjába beteszi, így a következő kör már az anyaggal dolgozik.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join } from 'node:path';
import { paths } from './paths.mjs';

const STOP = new Set(['egy', 'vagy', 'és', 'ha', 'az', 'a', 'pl', 'lehetőleg', 'oldal', 'oldala', 'valódi', 'francia', 'továbbá', 'elérhető', 'illetve', 'például']);
/** Két kérés ugyanarra a forrásra szól, ha a „mi kell” szavainak átfedése (a rövidebbhez mérve) legalább ennyi. */
export const SAME_SOURCE_OVERLAP = 0.35;

function needLine(request) {
  return String(request).match(/^\s*mi kell:\s*(.*)$/mi)?.[1] ?? String(request);
}

function words(request) {
  // Az URL-ek szavai (https, a domain) nem számítanak: két különböző oldal ugyanarról a webhelyről nem ugyanaz a forrás.
  return new Set(needLine(request).replace(/https?:\/\/\S+/g, ' ').toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(w => w.length >= 4 && !STOP.has(w)));
}

function urls(request) {
  return new Set((String(request).match(/https?:\/\/[^\s)>\]»”]+/g) ?? []).map(u => u.replace(/[.,;]+$/, '').replace(/\/$/, '').toLowerCase()));
}

/** Ugyanarra a forrásra szól-e a két kérés (közös URL, vagy a „mi kell” szavainak átfedése). */
export function sameSource(a, b) {
  const ua = urls(a);
  for (const u of urls(b)) if (ua.has(u)) return true;
  const A = words(a); const B = words(b);
  if (!A.size || !B.size) return needLine(a).trim().toLowerCase() === needLine(b).trim().toLowerCase();
  let common = 0;
  for (const w of A) if (B.has(w)) common += 1;
  return common / Math.min(A.size, B.size) >= SAME_SOURCE_OVERLAP;
}

/**
 * A PRESIDENT válaszából a csatolandó anyag: a „FAJL: <útvonal>” sorokban megadott szöveges fájlok
 * tartalma (.md, .txt; a repó gyökeréhez vagy abszolút útvonalként), a többi szöveg változatlanul.
 */
export function resolveHelpAnswer(answer, repoRoot = paths.repo) {
  return answer.split(/\r?\n/).map(line => {
    const m = line.match(/^\s*FAJL:\s*(.+?)\s*$/i);
    if (!m) return line;
    const file = isAbsolute(m[1]) ? m[1] : join(repoRoot, m[1]);
    if (!/\.(md|txt)$/i.test(file)) return `${line}\n(A CEO csak .md vagy .txt fájlt tud csatolni; PDF-ből másold ki a szöveget egy .txt fájlba.)`;
    if (!existsSync(file)) return `${line}\n(A fájl nem található.)`;
    const text = readFileSync(file, 'utf8');
    return `--- ${m[1]} ---\n${text.length > 80_000 ? `${text.slice(0, 80_000)}\n[… levágva 80 000 karakternél]` : text}\n--- vége ---`;
  }).join('\n');
}

export const helpAnswerFile = (runDir, entry) => join(runDir, 'decisions', `${entry.id}.md`);

/** Zárt vagy nem letölthető forrás jelei (a problems.mjs PAYWALL-jával egyezik): ilyenkor a CEO nem próbálkozik. */
const CLOSED = /bejelentkez|belépés|login|regisztr|előfizet|fizetős|paywall|könyv|nyomtatott|kiadvány|hanganyag|felvétel|\bCD\b|tankönyv|nem nyilvános|zárt/i;
/** Ennél rövidebb letöltött szöveg nem forrás, hanem süti-fal, hibaoldal vagy átirányítás. */
export const MIN_FETCHED_CHARS = 800;

/** HTML → olvasható szöveg (szkript, stílus, navigáció nélkül). */
export function htmlToText(html) {
  return String(html)
    .replace(/<(script|style|noscript|svg|nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6]|tr|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/[ \t]+/g, ' ').replace(/ *\n[ \n]*/g, '\n').trim();
}

/**
 * Nyilvános forrás letöltése a kérés URL-jeiről (2026-11-15: az 1. héten a szerepek több nyilvános oldalt kértek
 * levélben, amit a CEO maga is le tud tölteni). Legfeljebb 3 URL, egyenként 20 mp; csak HTML és sima szöveg.
 * Eredmény: a mellékelhető szöveg, vagy null (zárt forrás, nincs URL, vagy egyik sem hozott használható szöveget).
 */
export async function fetchPublicSource(request, { fetchImpl = globalThis.fetch, timeoutMs = 20_000 } = {}) {
  if (CLOSED.test(String(request)) || !fetchImpl) return null;
  const parts = [];
  for (const url of [...urls(request)].slice(0, 3)) {
    try {
      const res = await fetchImpl(url, { redirect: 'follow', signal: AbortSignal.timeout(timeoutMs), headers: { 'user-agent': 'Mozilla/5.0 (compatible; plusdeca-ceo)' } });
      const type = res.headers?.get?.('content-type') ?? '';
      if (!res.ok || !/text\/(html|plain)|application\/xhtml/i.test(type)) continue;
      const body = await res.text();
      const text = /html/i.test(type) ? htmlToText(body) : body.trim();
      if (text.length >= MIN_FETCHED_CHARS) parts.push(`--- ${url} ---\n${text.length > 80_000 ? `${text.slice(0, 80_000)}\n[… levágva 80 000 karakternél]` : text}\n--- vége ---`);
    } catch { /* nem elérhető: a következő URL */ }
  }
  return parts.length ? parts.join('\n\n') : null;
}

/**
 * Egy lépés kérésének nyilvántartása. Új forrásnál új tétel és értesítés (hooks.onWaiting, kind: access),
 * ismertnél csak a lépés kerül a tétel mellé. A tételt adja: { id, steps, answered, duplicate }.
 */
export async function registerHelpRequest(engine, step, request) {
  const help = (engine.state.help ??= []);
  let entry = help.find(e => e.requests.some(r => sameSource(r, request)));
  const duplicate = Boolean(entry);
  if (entry) {
    if (!entry.steps.includes(step)) entry.steps.push(step);
    entry.requests.push(request);
    engine.log(`↺ ${step}: ugyanerre a forrásra már van kérés (${entry.id}${entry.answered ? ', megválaszolva' : ''}); nem kér újra.`);
  } else {
    entry = { id: `segitseg-${help.length + 1}`, firstStep: step, steps: [step], requests: [request], askedAt: new Date().toISOString(), answered: false };
    help.push(entry);
    engine.log(`✋ ${step}: segítséget kér (${entry.id}); a szerep a tartaléktervével folytatja, a válasz a következő körbe kerül.`);
  }
  // Nyilvános URL: a CEO előbb maga tölti le; ha sikerül, a letöltött szöveg a válasz, és nincs értesítés.
  let fetchFailed = false;
  if (!duplicate && urls(request).size && !engine.dryRun) {
    const fetched = await (engine.hooks.fetchSource ?? fetchPublicSource)(request);
    if (fetched) {
      const file = helpAnswerFile(engine.runDir, entry);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, `A CEO maga töltötte le a kért nyilvános forrást (nincs PRESIDENT-válasz; ha nem ez kell, dolgozz a tartaléktervvel):\n\n${fetched}\n`);
      entry.autoFetched = true;
      engine.log(`⇣ ${entry.id}: a CEO letöltötte a kért nyilvános forrást; a következő hívások megkapják, értesítés nem megy.`);
      await engine.save();
      return { id: entry.id, steps: entry.steps, answered: entry.answered, duplicate };
    }
    fetchFailed = !CLOSED.test(request);
  }
  await engine.save();
  if (!duplicate && engine.hooks.onWaiting) {
    try {
      await engine.hooks.onWaiting({ step, question: request, kind: 'access', decisionFile: helpAnswerFile(engine.runDir, entry), nonBlocking: true, fetchFailed });
    } catch (error) { engine.log(`! értesítés sikertelen: ${error.message}`); }
  }
  return { id: entry.id, steps: entry.steps, answered: entry.answered, duplicate };
}

/**
 * A futás segítségkéréseinek állapota egy új hívás előtt: a megválaszoltak anyaga (a helyi fájlból, vagy ha
 * van, a további döntésforrásokból) és a még nyitottak. A megérkezett választ a CEO a közös fájlba menti.
 */
export async function collectHelp(engine) {
  const help = engine.state?.help ?? [];
  const answered = []; const open = [];
  for (const entry of help) {
    const file = helpAnswerFile(engine.runDir, entry);
    let text = null;
    try { text = await readFile(file, 'utf8'); } catch { /* még nincs */ }
    if (!text?.trim() && !entry.answered) {
      for (const source of engine.hooks.decisionSources ?? []) {
        try { text = await source(engine.runDir.split(/[\\/]/).pop(), entry.id); } catch (error) { engine.log(`! döntésforrás hiba: ${error.message}`); }
        if (text?.trim()) { await mkdir(dirname(file), { recursive: true }); await writeFile(file, text); break; }
      }
    }
    if (text?.trim()) {
      if (!entry.answered) {
        Object.assign(entry, { answered: true, answeredAt: new Date().toISOString() });
        engine.log(`▶ ${entry.id}: megjött a válasz; innentől minden szerep megkapja.`);
        await engine.save();
      }
      answered.push({ entry, text: resolveHelpAnswer(text) });
    } else {
      open.push(entry);
    }
  }
  return { answered, open };
}

/** A promptba (a gépi összegzés elé) kerülő rész: a megérkezett anyagok és a nyitott kérések listája. */
export function helpAttachment({ answered, open }) {
  let out = '';
  for (const { entry, text } of answered) {
    out += `\n\n# A PRESIDENT válasza egy segítségkérésre (${entry.id})\n\nA kérés:\n\n${entry.requests[0]}\n\nA válasz:\n\n${text}\n\nEzt az anyagot használd, ahol a munkádhoz tartozik; ha egy korábbi körben tartaléktervvel dolgoztál, most javítsd. Erre a forrásra ne kérj újra segítséget.\n`;
  }
  if (open.length) {
    out += `\n\n# Már kért, még megválaszolatlan források ebben a futásban\n\n${open.map(e => `- ${e.id}: ${needLine(e.requests[0]).trim()}`).join('\n')}\n\nEzekre ne kérj újra segítséget: a válasz, ha megjön, a következő körben a megbízásod mellé kerül. Addig dolgozz a tartaléktervvel.\n`;
  }
  return out;
}
