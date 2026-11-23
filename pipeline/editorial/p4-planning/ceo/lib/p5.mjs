// P4 → P5 határ a CEO-ban: a blokk utolsó szerzője (megoldásíró) a megoldás mellé
// strukturált blokkforrást ad (BLOKK_JSON … BLOKK_JSON_VEGE, p5/schema/block.schema.json).
// A CEO azonnal ellenőrzi: kitölti a review-kötést a futás saját review-zott szövegeiből
// (PE-jelentés, kézirat, megoldás — a JSON nélkül), majd lefuttatja a P5 kapuit
// (séma, hűség, játszhatóság, válasz-épség, brief, meta-tokenek). Hiba = javítási kör.
import { existsSync } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { paths } from './paths.mjs';

const p5 = rel => pathToFileURL(join(paths.repo, 'p5', rel)).href;

/** A BLOKK_JSON-szabály által megnevezett P5-referenciák (a repó p5/ mappájához képest). */
export const P5_REFERENCE_FILES = ['schema/block.schema.json', 'playable-types.json', 'examples/block.w01-u-2-1.json', 'examples/order-page.w01-u-1-1-p23.json'];

/**
 * A szerep munkamappája a repón kívül van, így a szabályban megnevezett p5/… fájlokat nem éri el (R11, 10-28: a
 * P5-javítás emiatt két körben elakadt). Ezért a BLOKK_JSON-t író lépés munkamappájába ugyanazon a relatív úton
 * (p5/…) bemásoljuk őket. A megbízás szövege nem változik; a lépésrekord rögzíti, mi került be.
 */
export async function stageP5References(workdir) {
  for (const rel of P5_REFERENCE_FILES) {
    const target = join(workdir, 'p5', rel);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(join(paths.repo, 'p5', rel), target);
  }
  return P5_REFERENCE_FILES.map(rel => `p5/${rel}`);
}
const BLOCK_RE = /^BLOKK_JSON\s*\n([\s\S]*?)^BLOKK_JSON_VEGE\s*$/m;

export function extractBlockJson(text) {
  const m = String(text ?? '').match(BLOCK_RE);
  if (!m) return { block: null, error: 'Nincs BLOKK_JSON … BLOKK_JSON_VEGE blokk a válaszban.' };
  const body = m[1].trim().replace(/^```(?:json)?\s*\n/u, '').replace(/\n```\s*$/u, '');
  try { return { block: JSON.parse(body), error: null }; } catch (error) { return { block: null, error: `A BLOKK_JSON nem érvényes JSON: ${error.message}` }; }
}

export function stripBlockJson(text) {
  return String(text ?? '').replace(BLOCK_RE, '').replace(/\n{3,}/g, '\n\n');
}

/**
 * A BLOKK_JSON tanulói szövegei helyjelöléssel, az ellenőröknek (11-02, U42 HE): a megoldásíró a feedbackszövegeket
 * és a rubrikacímkéket csak a JSON-ba írja, az ellenőrök viszont a JSON nélküli szöveget kapják. A lista ugyanaz,
 * amit a P5 hűségkapuja tanulói szövegnek tekint (p5/lib/extract.mjs, blockStrings); a szövegek bájtra változatlanok.
 * Nincs érvényes BLOKK_JSON vagy nincs benne szöveg → null.
 */
export async function blockLearnerTexts(text) {
  const { block } = extractBlockJson(text);
  if (!block) return null;
  const { blockStrings, formatLocation } = await import(p5('lib/extract.mjs'));
  const lines = blockStrings(block).map(entry =>
    `- ${formatLocation(entry)}${entry.editorial ? ' [a kapu szerint szerkesztői mező]' : ''}: ${entry.text.replace(/\n/g, '\n  ')}`);
  return lines.length ? `${lines.join('\n')}\n` : null;
}

/**
 * Különbözeti („csak a változás”) leadás jele (U31, 11-04: 419 CL-01): a BLOKK_JSON-ban megmaradt tanulói szövegek
 * közül azok, amelyeket a korábbi leadás Markdownja még szó szerint tartalmazott, az újé már nem. A JSON-ból is
 * kikerült (átírt, törölt) szöveg nem számít. Nincs mindkét oldalon érvényes BLOKK_JSON → null.
 * Mérés a 11-04-ig lefutott javítási láncokon: teljes leadásnál legfeljebb 9%, különbözetinél 15–63% tűnt el.
 */
export const DIFF_DELIVERY = { minTexts: 10, ratio: 0.15 };
export async function droppedLearnerTexts(previous, next) {
  const before = extractBlockJson(previous).block;
  const after = extractBlockJson(next).block;
  if (!before?.pages || !after?.pages) return null;
  const { blockStrings } = await import(p5('lib/extract.mjs'));
  const norm = s => String(s).replace(/\s+/g, ' ').trim();
  const texts = block => new Set(blockStrings(block).filter(e => !e.editorial).map(e => norm(e.text)).filter(s => s.length >= 12));
  const beforeMd = norm(stripBlockJson(previous));
  const afterMd = norm(stripBlockJson(next));
  const covered = [...texts(before)].filter(s => beforeMd.includes(s));
  const kept = texts(after);
  const dropped = covered.filter(s => kept.has(s) && !afterMd.includes(s));
  return { covered: covered.length, dropped, diff: dropped.length >= DIFF_DELIVERY.minTexts && dropped.length >= DIFF_DELIVERY.ratio * covered.length };
}

/** P4-blokk (pl. GI1, (1,1)) → P5 blokk-ID (pl. w07-u-1-1). */
export function p5BlockId(position, week) {
  const m = String(position).match(/\((\d),\s*(\d)\)/);
  if (!m) throw new Error(`Nem értelmezhető blokkpozíció: ${position}`);
  return `w${String(week).padStart(2, '0')}-u-${m[1]}-${m[2]}`;
}

/**
 * A P5-szabály egy adott blokkra (heti lánc): a P5-azonosító és a kéziratlánc fájlnevei a blokké.
 * A pilot (full --p5) a rögzített BLOCK_JSON_RULE-t használja (kezirat.md / megoldas.md).
 */
export function blockJsonRule({ blockId, manuscriptFile = 'kezirat.md', solutionFile = 'megoldas.md' } = {}) {
  let rule = BLOCK_JSON_RULE
    .replace('`manuscriptRef.file`: `kezirat.md` (a befagyasztott kézirat) vagy `megoldas.md` (a te megoldásod)',
      `\`manuscriptRef.file\`: \`${manuscriptFile}\` (a befagyasztott kézirat) vagy \`${solutionFile}\` (a te megoldásod)`);
  if (blockId) rule += `- A blokk P5-azonosítója: ${blockId} (az \`id\` mező; az oldal- és item-ID-k ezzel kezdődjenek, pl. \`${blockId}-p01\`, \`${blockId}-i01\`).\n`;
  return rule;
}

export const BLOCK_JSON_RULE = `

# Strukturált blokkforrás a P5-nek (kötelező)

A gépi összegzés előtt add meg a blokk teljes tanulói tartalmát strukturáltan, a \`p5/schema/block.schema.json\` szerint (minta: \`p5/examples/block.w01-u-2-1.json\`), két jelölősor között:

BLOKK_JSON
{ … a blokk JSON-ja … }
BLOKK_JSON_VEGE

Szabályok:
- Minden tanulói szöveg, kulcs, alternatíva, feedback és rubrikaszöveg **szó szerint** a fenti kéziratból vagy a saját megoldásodból való; semmit ne fogalmazz át, ne egészíts ki és ne találj ki. A CEO gépileg ellenőrzi; eltérés = javítási kör.
- A \`review\` mezőt hagyd el: a CEO tölti ki a review-kötéssel.
- \`manuscriptRef.file\`: \`kezirat.md\` (a befagyasztott kézirat) vagy \`megoldas.md\` (a te megoldásod); \`anchor\`: egy ott szereplő címsor szövege.
- Képességek és változatok csak a P1-katalógusból (\`p5/playable-types.json\`, v2 rész). Ha valamit nem lehet leképezni, ne kerülgesd: írd a findingok közé.
- Sorrendezős itemnél (\`response.type: "order"\`) a kulcs a tokenek teljes sorrendje: \`"solution": {"type": "choice", "keyOptionIds": ["t3", "t4", "t2", "t1"], "alternativeOrders": [["t4", "t3", "t2", "t1"]]}\`. Az \`alternativeOrders\` a további helyes sorrendek (elhagyható); mindegyik a tokenek teljes permutációja. Nem \`exact\` + \`key\` objektum (U11 p23, 11-01). Minta: \`p5/examples/order-page.w01-u-1-1-p23.json\`.
- Átalakító itemnél (\`CAP-transformation\`) az app szerződése csak \`response.type: "text"\` választ fogad el. Több átalakítandó mondatnál mondatonként külön item kell (\`…-i05-s001\`, \`…-s002\` …), mindegyik a saját kulcsával, alternatíváival és elutasított alakjaival; ne egy \`fields\` item közös alternatívalistával, mert úgy egy mező a másik mondat válaszát is elfogadná (U21 i05, 11-01). Minta: \`p5/blocks/w01/block.w01-u-5-1.json\` (i02–i04).
`;

// Futó láncok közben hozzáadott szabálysorok (U11 p23 és U21 i05, 11-01). A korábban kész lépés megbízása ezek
// nélkül készült; a motor ettől még elfogadja a mentett eredményt (új szabály csak az új lépésekre vonatkozik).
export const LATER_RULE_LINES = BLOCK_JSON_RULE.split('\n').filter(l => /^- (Sorrendezős itemnél|Átalakító itemnél)/.test(l));
// Egy szabálysor korábbi alakjai (a sor helyén ezek is állhattak egy kész lépés megbízásában); az üres = a sor hiánya.
export const LATER_RULE_VARIANTS = LATER_RULE_LINES.map(line => [line, ['', ...(line.endsWith(' Minta: `p5/examples/order-page.w01-u-1-1-p23.json`.')
  ? [line.replace(' Minta: `p5/examples/order-page.w01-u-1-1-p23.json`.', '')] : [])]]);

export function findingsText(findings) {
  return findings.map(f => `- [${f.cl}] ${f.location}: ${f.message}${f.text ? ` — „${f.text}”` : ''}`).join('\n');
}

/**
 * A P5-kapu egy körben. files: [{ file, text }], az első a review-pass (a PE-jelentés).
 * Visszaad: { ok, block, findings }.
 */
export async function checkBlockOutput(text, { blockId, files }) {
  const [{ runBlockGates }, { chainFromTexts }, { bindBlock }] = await Promise.all([
    import(p5('lib/gates.mjs')), import(p5('lib/manuscripts.mjs')), import(p5('bind.mjs')),
  ]);
  const { block, error } = extractBlockJson(text);
  if (!block) return { ok: false, block: null, findings: [{ cl: 'P5-FORMAT', severity: 'error', location: blockId, message: error }] };
  if (block.id !== blockId) return { ok: false, block, findings: [{ cl: 'P5-FORMAT', severity: 'error', location: String(block.id), message: `A blokk-ID ${blockId} kell.` }] };
  const chain = chainFromTexts(blockId, files);
  const rules = JSON.parse(await readFile(join(paths.repo, 'p5', 'playable-types.json'), 'utf8'));
  const schema = JSON.parse(await readFile(join(paths.repo, 'p5', 'schema', 'block.schema.json'), 'utf8'));
  let bound;
  try { bound = bindBlock({ ...block, review: undefined }, null, { chain }); } catch (e) {
    return { ok: false, block, findings: [{ cl: 'CL-01', severity: 'error', location: blockId, message: e.message }] };
  }
  const findings = runBlockGates(bound, { rules, schema, chain });
  // A heti build v2-szerződése is (p5/lib/compile.mjs): a blokkkapun átmenő blokk is elbukhat itt (R11, 10-28:
  // assessmentKind hiányzott, a gap-bank kulcsa feliratra, nem a választék elemének ID-jére mutatott).
  // 2026-11-15: a szerződést a kapuhibák mellett is megnézi, hogy a javító egy körben kapja meg mindkettőt (az 1. héten
  // a CONTRACT-hiba rendre csak a CL-01-javítás utáni körben jött elő, és ez külön P5-kört vitt el). Ha a blokk a
  // kapuhibák miatt le sem fordul, az csak figyelmeztetés: a kapuhibák javítása után a következő kör megmondja.
  const gateErrors = findings.some(f => f.severity === 'error');
  for (const f of await contractFindings(bound, { mediaPending: true })) {
    findings.push(gateErrors && /^A v2-fordítás nem sikerült/.test(f.message) ? { ...f, severity: 'warning' } : f);
  }
  return { ok: !findings.some(f => f.severity === 'error'), block: bound, findings };
}

/**
 * Egyetlen blokk lefordítása a v2-csomagra és a szerződés ellenőrzése (mint a week-build 2–3. lépése).
 * A helyi médiafájlokat a terv media/ mappájában keresi (alap: p5/weeks/media). mediaPending: a még el nem
 * készült médiafájl (pl. a U34 hangja, amely csak a szöveg PASS-a után készül) nem hiba, hanem HIANYZIK
 * figyelmeztetés; a szerkezetet egy ideiglenes helyőrzővel ellenőrzi. A P5-átvételnél a hiány már hiba.
 */
export async function contractFindings(block, { mediaDir = join(paths.repo, 'p5', 'weeks', 'media'), mediaPending = false } = {}) {
  const { compileWeek } = await import(p5('lib/compile.mjs'));
  const pending = [];
  let dir = mediaDir;
  if (mediaPending) {
    const missing = (block.media ?? []).filter(m => m.access === 'local' && m.file && !existsSync(join(mediaDir, m.file)));
    if (missing.length) {
      dir = await mkdtemp(join(tmpdir(), 'p5-media-'));
      for (const m of block.media ?? []) {
        if (m.access !== 'local' || !m.file) continue;
        const real = join(mediaDir, m.file);
        if (existsSync(real)) await copyFile(real, join(dir, m.file));
        // Egyedi tartalom: a fordító tartalom-hash-sel nevez (media/<sha16>), az üres helyőrzők ugyanarra a címre esnének,
        // és az ABX hamis ABX_ASSET_IDENTITY-hibát adna (U44, 11-14).
        else { await writeFile(join(dir, m.file), `HIANYZIK:${m.id}:${m.file}`); pending.push({ cl: 'MEDIA', severity: 'warning', location: `${block.id} › media › ${m.id}`, message: `HIANYZIK: ${m.file} (a hang/média később készül; a P5-átvételhez kell)` }); }
      }
    }
  }
  try {
    const compiled = compileWeek({ week: block.week, title: 'CEO-ellenőrzés', blocks: [], media: dir }, [block], { planDir: paths.repo });
    return [
      ...pending,
      ...compiled.contract.errors.map(e => ({ cl: 'CONTRACT', severity: 'error', location: e.path, message: `${e.code}: ${e.message}` })),
      ...compiled.needs.map(n => ({ cl: 'CONTRACT', severity: 'error', location: n.where ?? block.id, message: `${n.code ?? 'NEEDS_CAPABILITY'}: ${n.message ?? JSON.stringify(n)}` })),
    ];
  } catch (e) {
    return [...pending, { cl: 'CONTRACT', severity: 'error', location: block.id, message: `A v2-fordítás nem sikerült: ${e.message}` }];
  } finally {
    if (dir !== mediaDir) await rm(dir, { recursive: true, force: true });
  }
}

/**
 * A teljes P5-lépés javítási körökkel. repair(findingsText, round) → a szerző új válasza (szöveg).
 * Eredmény: { outcome: 'P5_PASS' | 'BLOCKED_P5_GATE', rounds, findings, file }.
 */
export async function p5Gate(engine, { blockId, files, text, repair, maxRounds, outDir = engine.runDir, reportFile = 'p5-report.json' }) {
  let round = 0;
  let current = text;
  let result = await checkBlockOutput(current, { blockId, files });
  // Helyi próba a kör elszámolása előtt (2026-11-15): ha a javító leadása használhatatlan (nincs vagy hibás BLOKK_JSON,
  // rossz blokk-ID, vagy a lánc nem tudta beépíteni, így a blokk változatlan), a CEO kapunként egyszer ingyen
  // újrakéri, nem éget el rá P5-kört.
  let freeRetry = true;
  while (!result.ok && round < maxRounds && !engine.dryRun) {
    round += 1;
    const errors = findingsText(result.findings.filter(f => f.severity === 'error'));
    let next = await repair(errors, round);
    let checked = await checkBlockOutput(next, { blockId, files });
    const unusable = (text, r) => text === current || r.findings.some(f => f.cl === 'P5-FORMAT');
    if (freeRetry && unusable(next, checked)) {
      freeRetry = false;
      engine.log(`↻ ${blockId}: a ${round}. P5-javítás nem használható (${next === current ? 'a blokk nem változott' : 'formai hiba'}); a CEO egyszer újrakéri, a kör nem számít.`);
      next = await repair(`${errors}\n- [P5-FORMAT] ${blockId}: az előző javításod nem volt használható (${next === current ? 'a blokk nem változott, vagy a javításlista nem volt beépíthető' : checked.findings.find(f => f.cl === 'P5-FORMAT').message}); adj érvényes BLOKK_JSON-t.`, `${round}u`);
      checked = await checkBlockOutput(next, { blockId, files });
    }
    current = next;
    result = checked;
  }
  await mkdir(outDir, { recursive: true });
  const file = join(outDir, `block.${blockId}.json`);
  if (result.block) await writeFile(file, `${JSON.stringify(result.block, null, 2)}\n`);
  await writeFile(join(outDir, reportFile), `${JSON.stringify({ blockId, ok: result.ok, rounds: round, findings: result.findings }, null, 2)}\n`);
  return { outcome: result.ok ? 'P5_PASS' : 'BLOCKED_P5_GATE', rounds: round, findings: result.findings, file: result.block ? file : null };
}

/**
 * Gépi bizonyítékok egy ellenőrnek, aki BLOCKED_EVIDENCE-et adott (2026-11-15; az 1. héten több ilyen megállás
 * olyan tényen múlt, amit a CEO meg tud mérni): a tipográfiai szóközök száma (NBSP, keskeny NBSP) a Markdownban és a
 * BLOKK_JSON-ban, és a BLOKK_JSON médiafájljai (megvan-e, méret, SHA-256 eleje). Szöveg, mellékletnek.
 */
export async function machineEvidence(text, { mediaDir = join(paths.repo, 'p5', 'weeks', 'media') } = {}) {
  const { createHash } = await import('node:crypto');
  const md = stripBlockJson(text);
  const { block } = extractBlockJson(text);
  const json = block ? JSON.stringify(block) : '';
  const count = (s, ch) => s.split(ch).length - 1;
  const lines = [
    `- Nem törő szóköz (U+00A0): Markdown ${count(md, ' ')}, BLOKK_JSON ${count(json, ' ')}.`,
    `- Keskeny nem törő szóköz (U+202F): Markdown ${count(md, ' ')}, BLOKK_JSON ${count(json, ' ')}.`,
    `- BLOKK_JSON: ${block ? `érvényes (${block.pages?.length ?? 0} oldal, ${(block.pages ?? []).reduce((n, p) => n + (p.items?.length ?? 0), 0)} item)` : 'nincs vagy nem érvényes'}.`,
  ];
  for (const m of block?.media ?? []) {
    if (m.access !== 'local' || !m.file) { lines.push(`- Média ${m.id}: ${m.access ?? '?'}${m.url ? ` (${m.url})` : ''}.`); continue; }
    const file = join(mediaDir, m.file);
    if (!existsSync(file)) { lines.push(`- Média ${m.id}: ${m.file} — még nincs meg (a hang a szöveg jóváhagyása után készül).`); continue; }
    const bytes = await readFile(file);
    lines.push(`- Média ${m.id}: ${m.file} — megvan, ${bytes.length} bájt, SHA-256 ${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}….`);
  }
  return `${lines.join('\n')}\n`;
}
