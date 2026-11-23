// Glossza-kör (Áron, 2026-11-16: „igen indíthatod”): koppintásos jelentés (S23, CL-23) a már élesben futó, glossza
// nélküli 1. heti blokkokra. A tanulói szöveg NEM változik; csak a `glosses` tömbök kerülnek a francia elemekre.
//
//   node tools/glossza-kor.mjs U11 [U12 …] [--atvetel]
//
// Egységenként:
//  1. szerző (claude -p): az élő blokk francia elemeihez glossza-javaslat (surface, lemma, meaning, note?);
//  2. gépi szűrés: a surface betű szerint szerepeljen az elem szövegében (CL-23), elemenként egyszer;
//  3. független ellenőr (claude -p): a jelentések helyessége, szintje, a felesleges glosszák (javít / töröl);
//  4. kimenet az OUT_ROOT/<egység>/glossza/ mappába (új fájlok): a blokk glosszákkal, a megoldás kiegészítve a
//     glosszák listájával (a hűségkapu a review-zott láncban keresi a tanulói szöveget), a review-pass a kör sorával,
//     a review-kötés hashei újraszámolva; ellenőrzés, hogy a glosszákon és a kötésen kívül semmi nem változott;
//  5. --atvetel: tools/p5-atvetel.mjs <egység> --glossza --frissit (P5-kapuval).
// Keretkapu: hívás előtt a keretfájl (a CEO-lánc írja) 95%-nál megállít; a claude -p keretadatát ez is visszaírja.

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { paths } from '../lib/paths.mjs';
import { OUT_ROOT } from '../lib/javitas.mjs';
import { invokeProvider } from '../lib/providers.mjs';
import { DEFAULT_USAGE_FILE, readUsage, usageGate, writeUsage } from '../lib/usage.mjs';

export const GLOSSZA_SUBDIR = 'glossza';
const args = process.argv.slice(2);
const units = args.filter(a => /^U\d\d$/u.test(a));
const adopt = args.includes('--atvetel');
const repo = paths.repo;
const config = JSON.parse(await readFile(join(paths.ceo, 'config.default.json'), 'utf8'));
const provider = config.providers['claude-web'];
const nfc = v => String(v ?? '').normalize('NFC');
const lf = t => String(t).replace(/\r\n/g, '\n');
const sha = text => createHash('sha256').update(lf(text)).digest('hex');
const stamp = () => new Date().toISOString().replace(/\.\d+Z$/u, 'Z');

const { canonicalHash } = await import(pathToFileURL(join(repo, 'p5', 'lib', 'normalize.mjs')).href);
const { blockStrings } = await import(pathToFileURL(join(repo, 'p5', 'lib', 'extract.mjs')).href);
const { contextGlossesBlock } = await import(pathToFileURL(join(repo, 'p5', 'lib', 'glosses.mjs')).href);

const cellText = cell => (typeof cell === 'string' ? cell : cell?.text ?? '');
const stimulusTexts = s => (s.type === 'text' || s.type === 'model' ? [s.text, s.title]
  : s.type === 'list' ? [...(s.entries ?? []), s.title]
  : s.type === 'table' ? [...(s.columns ?? []), ...(s.rows ?? []).flat(), s.title].map(cellText) : []).filter(t => typeof t === 'string');
const itemTexts = item => {
  const r = item.response ?? {};
  return [item.prompt, item.instruction, item.audio?.transcript, ...(r.options ?? []).map(o => o.label), ...(r.fields ?? []).map(f => f.label),
    ...(r.bank ?? []).map(o => o.label), ...(r.left ?? []).map(o => o?.label ?? o), ...(r.right ?? []).map(o => o?.label ?? o),
    ...(r.tokens ?? []).map(t => t?.label ?? ''), r.text].filter(t => typeof t === 'string' && t.trim());
};
const HU = /[őűŐŰ]|(?<!\p{L})(?:és|az|egy|nem|hogy|vagy|ezt|kérek)(?!\p{L})/u;

/** A glosszálható elemek: tartalmi szöveg/lista/táblázat/minta és item (a retry-változatokkal), célnyelvi szöveggel. */
export function targetsOf(block) {
  const out = [];
  (block.pages ?? []).forEach((page, pi) => {
    (page.content ?? []).forEach((s, ci) => {
      if (!['text', 'list', 'table', 'model'].includes(s.type) || (s.language && s.language !== 'fr')) return;
      const text = stimulusTexts(s).join('\n');
      if (text.trim() && !(s.language !== 'fr' && HU.test(text))) out.push({ key: `p${pi}/c${ci}`, where: `${page.id} › ${s.type}#${ci}`, text, node: s });
    });
    for (const item of page.items ?? []) for (const v of [item, ...(item.retry?.items ?? [])]) {
      const text = itemTexts(v).join('\n');
      if (text.trim()) out.push({ key: `p${pi}/i:${v.id}`, where: `${page.id} › ${v.id}`, text, node: v });
    }
  });
  return out;
}

const RULE = `Koppintásos jelentés (S23, T16; a BLOKKIRO szabálya): minden francia szöveghez szövegkörnyezet szerinti magyar jelentés.
- surface: a szövegben BETŰ SZERINT álló, ragozott alak (aposztróf: ’), több szavas kifejezés egyben (pl. „pas trop cuite”, „je vous mets”);
- lemma: a szótári alak; meaning: az ADOTT mondatbeli jelentés magyarul, röviden; note: elhagyható rövid megjegyzés (pl. regiszter).
- Ne glosszáld a névelőt/determinánst (un, une, du, de la, des, de, en…) — ezek a gyakorolt alakok, a jelentésük elárulná a megoldást —, a tulajdonnevet, és a B1 szinten biztosan ismert alapszót (je, être, avoir, bonjour, merci, café…).
- A hézag ([g01], ___) helyére NE írj semmit, és ne glosszálj olyan szót, amely a feladat megoldását elárulja (pl. a választható opciók közül a helyeset).
- Magyar szöveget (utasítás, magyarázat) ne glosszálj. Elemenként 0–8 glossza; ahol nincs mit, üres lista.`;

function authorPrompt(id, targets) {
  return `Feladat: az 1. heti ${id} blokk élesben futó francia szövegeihez koppintásos jelentést (glosszát) írsz. A szöveg NEM változik.\n\n${RULE}\n\n` +
    `Elemek (kulcs → az elem teljes szövege):\n\n${targets.map(t => `### ${t.key} (${t.where})\n${t.text}`).join('\n\n')}\n\n` +
    `Válasz: CSAK az alábbi blokk, érvényes JSON, kulcsonként a glosszák listája (a kihagyott kulcs = nincs glossza):\nGLOSSZAK\n{"p0/c1": [{"surface": "…", "lemma": "…", "meaning": "…"}]}\nGLOSSZAK_VEGE`;
}

function reviewPrompt(id, targets, glosses) {
  const rows = targets.filter(t => glosses[t.key]?.length).map(t => `### ${t.key}\nSzöveg: ${t.text}\nGlosszák: ${JSON.stringify(glosses[t.key])}`);
  return `Független nyelvi ellenőr vagy (NyE). Az 1. heti ${id} blokk francia szövegeihez készült koppintásos jelentéseket nézed át.\n\n${RULE}\n\n` +
    `Ellenőrizd elemenként: (1) a meaning az adott mondatbeli jelentés-e, helyes és természetes magyar-e; (2) a lemma helyes-e; (3) a glossza nem árulja-e el a feladat megoldását, nem determináns/névelő/tulajdonnév/triviális alapszó-e (ezeket töröld); (4) a surface pontosan a szövegből való-e.\n\n${rows.join('\n\n')}\n\n` +
    `Válasz: CSAK ez a blokk, érvényes JSON. corrections: csak a javítandók; remove: true = törlés; különben a javított mezők.\nELLENORZES\n{"verdict": "REVIEW_PASS", "corrections": [{"key": "p0/c1", "surface": "…", "meaning": "…", "lemma": "…", "remove": false, "reason": "…"}]}\nELLENORZES_VEGE\n` +
    `A verdict REVISION_REQUIRED csak akkor, ha a hibák javítással sem menthetők (pl. a glosszák nagy része rossz).`;
}

const between = (text, open, close) => {
  const m = String(text).match(new RegExp(`^${open}\\s*\\n([\\s\\S]*?)^${close}\\s*$`, 'mu'));
  if (!m) throw new Error(`Nincs ${open} … ${close} blokk a válaszban.`);
  return JSON.parse(m[1].trim().replace(/^```(?:json)?\s*\n/u, '').replace(/\n```\s*$/u, ''));
};

async function call(prompt, label, workdir) {
  const cfgUsage = config.usage ?? {};
  const file = cfgUsage.file ?? DEFAULT_USAGE_FILE;
  const gate = usageGate(await readUsage(file), { threshold: cfgUsage.threshold ?? 95, staleMinutes: cfgUsage.staleMinutes ?? 30 });
  if (gate.wait) throw new Error(`KERETKAPU: ${gate.window} ${gate.percent}% (küszöb ${cfgUsage.threshold ?? 95}%); folytatás a keret visszaállása után.`);
  console.log(`… ${label} (${Math.round(prompt.length / 1000)} kB)`);
  const t0 = Date.now();
  const result = await invokeProvider(provider, { prompt, workdir, outFile: join(workdir, `${label}.out.md`), timeoutMs: 60 * 60_000 });
  await writeFile(join(workdir, `${label}.valasz.md`), result.text ?? '');
  if (result.stream?.windows) await writeUsage(file, result.stream.windows).catch(() => {});
  if (result.code !== 0) throw new Error(`${label}: a claude -p hibával állt le (${result.code}): ${String(result.stderr || result.text).slice(0, 300)}`);
  console.log(`✓ ${label} (${Math.round((Date.now() - t0) / 1000)} s)`);
  return result.text;
}

function cleanGlosses(targets, raw) {
  const out = {}, dropped = [];
  for (const t of targets) {
    const seen = new Set(), text = nfc(t.text);
    for (const g of raw[t.key] ?? []) {
      const surface = nfc(g?.surface).trim(), meaning = String(g?.meaning ?? '').trim();
      if (!surface || !meaning) { dropped.push(`${t.key}: hiányos (${JSON.stringify(g)})`); continue; }
      if (!text.includes(surface)) { dropped.push(`${t.key}: „${surface}” nincs betű szerint a szövegben`); continue; }
      if (seen.has(surface)) continue;
      seen.add(surface);
      (out[t.key] ??= []).push({ surface, ...(g.lemma ? { lemma: String(g.lemma).trim() } : {}), meaning, ...(g.note ? { note: String(g.note).trim() } : {}) });
    }
  }
  return { glosses: out, dropped };
}

function applyCorrections(glosses, corrections = []) {
  const log = [];
  for (const c of corrections) {
    const list = glosses[c.key];
    const i = list?.findIndex(g => nfc(g.surface) === nfc(c.surface)) ?? -1;
    if (i < 0) { log.push(`kihagyva (nincs ilyen): ${c.key} „${c.surface}”`); continue; }
    if (c.remove) { list.splice(i, 1); log.push(`törölve: ${c.key} „${c.surface}” — ${c.reason ?? ''}`); continue; }
    for (const f of ['meaning', 'lemma', 'note']) if (typeof c[f] === 'string' && c[f].trim()) list[i][f] = c[f].trim();
    log.push(`javítva: ${c.key} „${c.surface}” — ${c.reason ?? ''}`);
  }
  for (const k of Object.keys(glosses)) if (!glosses[k].length) delete glosses[k];
  return log;
}

const strip = block => JSON.parse(JSON.stringify(block, (k, v) => (k === 'glosses' || k === 'review' ? undefined : v)));

async function runUnit(id) {
  const pid = `w01-u-${id[1]}-${id[2]}`;
  const handoffs = join(repo, 'editorial', 'week-01', 'handoffs');
  const liveBlock = JSON.parse(await readFile(join(repo, 'p5', 'blocks', 'w01', `block.${pid}.json`), 'utf8'));
  const outDir = join(repo, OUT_ROOT, id, GLOSSZA_SUBDIR);
  const work = join(outDir, 'munka');
  await mkdir(work, { recursive: true });
  const block = structuredClone(liveBlock);
  const targets = targetsOf(block);
  if (!targets.length) { console.log(`${id}: nincs glosszálható elem.`); return; }

  const authorText = existsSync(join(work, 'szerzo.valasz.md')) ? await readFile(join(work, 'szerzo.valasz.md'), 'utf8') : await call(authorPrompt(id, targets), 'szerzo', work);
  const { glosses, dropped } = cleanGlosses(targets, between(authorText, 'GLOSSZAK', 'GLOSSZAK_VEGE'));
  const reviewText = existsSync(join(work, 'ellenor.valasz.md')) ? await readFile(join(work, 'ellenor.valasz.md'), 'utf8') : await call(reviewPrompt(id, targets, glosses), 'ellenor', work);
  const review = between(reviewText, 'ELLENORZES', 'ELLENORZES_VEGE');
  if (review.verdict !== 'REVIEW_PASS') throw new Error(`${id}: az ellenőr verdiktje ${review.verdict}; a kör megáll (munka: ${work}).`);
  const corrections = applyCorrections(glosses, review.corrections);
  for (const t of targets) if (glosses[t.key]?.length) t.node.glosses = glosses[t.key];
  // A gépi utóellenőrzés: CL-23 hiba nincs, és a glosszákon kívül semmi nem változott.
  const cl23 = contextGlossesBlock(block).filter(f => f.severity === 'error');
  if (cl23.length) throw new Error(`${id}: CL-23 hiba a glosszák után: ${cl23.map(f => f.message).join(' | ')}`);
  if (canonicalHash(strip(block)) !== canonicalHash(strip(liveBlock))) throw new Error(`${id}: a glosszákon kívül is változott a blokk — megáll.`);

  // Lánc: a kézirat változatlan; a megoldás végére a glosszák listája (a hűségkapu a review-zott láncban keresi).
  const kezirat = await readFile(join(handoffs, `${pid}.kezirat.md`), 'utf8');
  const listing = blockStrings(block).filter(s => /glosses\[\d+\]\.(?:surface|lemma|meaning|note)$/u.test(s.field ?? ''));
  const lines = listing.map(s => `- ${[s.unit, s.page, s.block, s.field].filter(Boolean).join(' › ')}: ${s.text}`);
  const megoldas = `${lf(await readFile(join(handoffs, `${pid}.megoldas.md`), 'utf8')).trimEnd()}\n\n## Koppintásos jelentések (glossza-kör, ${stamp()})\n\nÁron (PRESIDENT) 2026-11-16: „igen indíthatod”. A tanulói szöveg nem változott; csak a glosszák kerültek a francia elemekre.\n\n${lines.join('\n')}\n`;
  const total = Object.values(glosses).reduce((n, l) => n + l.length, 0);
  const reviewPass = `${lf(await readFile(join(handoffs, `${pid}.review-pass.md`), 'utf8')).trimEnd()}\n\nGlossza-kör (${stamp()}): ${total} glossza ${Object.keys(glosses).length} elemen; szerző és független nyelvi ellenőr (NyE): REVIEW_PASS (${corrections.length} javítás/törlés); gépi ellenőrzés: CL-23 hiba 0, a tanulói szöveg változatlan.\n`;
  await writeFile(join(outDir, `${pid}.kezirat.md`), lf(kezirat));
  await writeFile(join(outDir, `${pid}.megoldas.md`), megoldas);
  await writeFile(join(outDir, `${pid}.review-pass.md`), reviewPass);
  const files = { [`${pid}.review-pass.md`]: reviewPass, [`${pid}.kezirat.md`]: lf(kezirat), [`${pid}.megoldas.md`]: megoldas };
  block.review = { ...liveBlock.review, manuscripts: liveBlock.review.manuscripts.map(m => (files[m.file] ? { ...m, sha256: sha(files[m.file]) } : m)) };
  const { review: _r, ...content } = block;
  block.review.contentSha256 = canonicalHash(content);
  await writeFile(join(outDir, `block.${pid}.json`), `${JSON.stringify(block, null, 2)}\n`);
  await writeFile(join(outDir, 'NAPLO.md'), `# ${id} glossza-kör (${stamp()})\n\n- elemek: ${targets.length}; glosszával: ${Object.keys(glosses).length}; glossza: ${total}\n- gépileg kiszűrve: ${dropped.length}\n${dropped.map(d => `  - ${d}`).join('\n')}\n- ellenőri javítás: ${corrections.length}\n${corrections.map(c => `  - ${c}`).join('\n')}\n`);
  console.log(`${id}: ${total} glossza ${Object.keys(glosses).length}/${targets.length} elemen; kiszűrve ${dropped.length}; ellenőri javítás ${corrections.length}.`);
  if (adopt) {
    const r = spawnSync(process.execPath, [join(repo, 'editorial', 'p4-planning', 'ceo', 'tools', 'p5-atvetel.mjs'), id, '--glossza', '--frissit'], { cwd: join(repo, 'editorial', 'p4-planning', 'ceo'), encoding: 'utf8' });
    console.log((r.stdout + r.stderr).split('\n').filter(l => !/^[=~!+] /u.test(l)).join('\n').trim());
    if (r.status !== 0) throw new Error(`${id}: az átvétel P5-kapuja nem zöld.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!units.length) { console.error('Használat: node tools/glossza-kor.mjs U11 [U12 …] [--atvetel]'); process.exit(2); }
  let failed = 0;
  for (const id of units) {
    try { await runUnit(id); } catch (error) {
      failed += 1; console.error(`✗ ${error.message}`);
      if (/^KERETKAPU/u.test(error.message)) break;
    }
  }
  console.log(failed ? `Eredmény: ${failed} egység nem lett kész.` : 'Eredmény: COMPLETED');
  process.exit(failed ? 1 : 0);
}
