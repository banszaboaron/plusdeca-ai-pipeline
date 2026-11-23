// „Csak a változás” (javításlistás) leadás a nagy megoldások javítási köreiben (PRESIDENT, 11-13).
//
// U33 (11-09, 240 item, 193 KB BLOKK_JSON): a javítási kör megbízása ~450 KB (terv + kézirat + az előző teljes
// megoldás + hat jelentés), a teljes újraleadás ~140k kimeneti token; együtt túllépik a modell kontextusát, a CLI
// válasz közben tömörít, és a válasz szétesik (BLOCKED_UNPARSEABLE_AUTHOR). Ezért a nagy megoldás javító leadásában
// a szerző a BLOKK_JSON helyett csak a megváltozott itemeket adja (BLOKK_JAVITAS); a lánc gépileg az előző teljes
// BLOKK_JSON-ba fésüli, és ellenőrzi, hogy semmi nem veszett el. Az ellenőrök, a teljességi próbák és a P5-kapu
// mindig a teljes, összefésült megoldást kapják.

import { extractBlockJson } from './p5.mjs';

/**
 * Mikor jár a javításlistás leadás: az előző teljes megoldás BLOKK_JSON-ja legalább ennyi item vagy bájt.
 * Mérés a 11-09-ig lefutott javítási láncokon: a legnagyobb, többször gond nélkül teljesen újraleadott megoldás a
 * U11 (80 item, 125 KB BLOKK_JSON, kilenc kör); a szokásos egységek 11–44 item és 35–90 KB. Szétesett: U33 (240 item,
 * 193 KB). A küszöb a U11 fölött, a U33 alatt van, így a bevált egységek leadása nem változik.
 */
export const PATCH_THRESHOLD = { minItems: 100, minBytes: 150_000 };

const BLOCK_BODY_RE = /^BLOKK_JSON\s*\n([\s\S]*?)^BLOKK_JSON_VEGE\s*$/m;
const PATCH_RE = /^BLOKK_JAVITAS\s*\n([\s\S]*?)^BLOKK_JAVITAS_VEGE\s*$/m;
const PATCH_MARK = /^BLOKK_JAVITAS\s*$/m;
const unfence = body => body.trim().replace(/^```(?:json)?\s*\n/u, '').replace(/\n```\s*$/u, '');

/** A BLOKK_JSON mérete: { items, bytes }; ha nincs érvényes BLOKK_JSON, null. */
export function blockSize(text) {
  const m = String(text ?? '').match(BLOCK_BODY_RE);
  if (!m) return null;
  const { block } = extractBlockJson(text);
  if (!block?.pages) return null;
  return { items: block.pages.reduce((n, p) => n + (Array.isArray(p.items) ? p.items.length : 0), 0), bytes: Buffer.byteLength(m[1]) };
}

/** Javításlistás leadás jár-e az előző teljes megoldás után (a küszöb: PATCH_THRESHOLD). */
export function needsPatchMode(previousText, threshold = PATCH_THRESHOLD) {
  const size = blockSize(previousText);
  return Boolean(size) && (size.items >= threshold.minItems || size.bytes >= threshold.minBytes);
}

/** A megbízás vége javításlistás módban. Felülírja a korábbi, teljes BLOKK_JSON-ra szóló kéréseket. */
export const PATCH_RULE = `

# Csak a változás: BLOKK_JAVITAS a BLOKK_JSON helyett (kötelező, ez az elsődleges)

A megoldás BLOKK_JSON-ja túl nagy ahhoz, hogy minden körben teljesen újraírd (a válasz nem férne el). Ezért ebben a leadásban a fenti „teljes anyag” / „teljes megoldás” kérés a BLOKK_JSON-ra **nem** vonatkozik:
- A Markdown-szakaszokat (## 1. … és a záró szakaszokat) és a TANULOI_NEZET blokkot a szokott módon, **teljesen** add le (a változatlan részeket is szó szerint).
- A BLOKK_JSON-t **ne** add le. Helyette csak a megváltozott itemeket add meg, egyetlen JSON-objektumban, két jelölősor között:

BLOKK_JAVITAS
{"replace":[<teljes item-objektum meglévő ID-vel>], "add":[{"pageId":"<oldal-ID>","afterId":"<item-ID vagy null>","item":{<teljes új item>}}], "remove":[{"id":"<item-ID>","reason":"<miért>"}], "order":{<elhagyható: "<oldal-ID>": [<az oldal összes item-ID-je, az új sorrendben>]>}, "block":{<elhagyható: a blokk felső szintű mezői, illetve "pages": {"<oldal-ID>": {<az oldal mezői>}}>}}
BLOKK_JAVITAS_VEGE

Szabályok:
- A változatlan itemeket **ne** írd ki újra; a CEO a korábbi teljes BLOKK_JSON-ból (a „saját korábbi válaszod” mellékletből) veszi őket.
- A \`replace\` minden eleme a **teljes** item (minden mezőjével, nem csak a megváltozott mezővel), a meglévő ID-vel; a CEO az egész itemet erre cseréli, a helyén.
- Az \`add\` új itemet szúr be a megadott oldalra, az \`afterId\` item után (\`null\`: az oldal elejére). Az új ID nem ütközhet meglévővel.
- A \`remove\` csak indokkal (\`reason\`) érvényes.
- Az \`order\` egy oldal itemjeit rendezi át: az oldal **összes** item-ID-je (a cserék, hozzáadások és törlések után), mindegyik pontosan egyszer, az új sorrendben. Csak akkor add meg, ha a sorrendnek változnia kell.
- A \`block\` csak mezőket ír felül; az oldalak és itemek listája (\`pages\` tömb, \`items\`) és az \`id\` ide nem kerülhet. Oldalmezőt a \`"pages": {"<oldal-ID>": {…}}\` alakkal írhatsz felül. Ha nincs ilyen változás, hagyd el.
- Ha a BLOKK_JSON-ban semmi nem változik: \`{"replace":[],"add":[],"remove":[]}\`.
- Az item-ID-k, a sorrend (ha nincs \`order\`) és a szerkezet egyébként marad; minden tanulói szöveg szó szerint a kéziratból vagy a megoldásodból való (mint eddig).
- A CEO gépileg összefésüli és ellenőrzi (érvényes JSON, létező ID-k, nincs ID-ütközés); hiba esetén egyszer újra kéred a javításlistát, utána a lánc megáll.
- A GEPI_OSSZEGZES blokk változatlanul kötelező, a válasz legvégén.
`;

// Az `order` (11-14) előtt kész lépések megbízásában ezek a sorok még a régi alakjukban álltak (vagy hiányoztak):
// az engine ezekkel az alakokkal is összeveti a mentett bemenetet, így a kész javítókörök nem futnak újra.
const ruleLine = start => PATCH_RULE.split('\n').find(line => line.startsWith(start));
const ORDER_TEMPLATE = ruleLine('{"replace":');
const ORDER_RULE = ruleLine('- Az `order` ');
const ORDER_KEEP = ruleLine('- Az item-ID-k, a sorrend');
export const PATCH_LATER_VARIANTS = [
  [ORDER_TEMPLATE, [ORDER_TEMPLATE.replace(' "order":{<elhagyható: "<oldal-ID>": [<az oldal összes item-ID-je, az új sorrendben>]>},', '')]],
  [ORDER_RULE, ['']],
  [ORDER_KEEP, [ORDER_KEEP.replace(' (ha nincs `order`)', '')]],
];

/** Ismételt kérés, ha a javításlista nem volt összefésülhető, vagy az összefésült megoldás hiányos. */
export const PATCH_RETRY_NOTE = missing => `\n\n# Az előző leadásod nem volt elfogadható\n\nA CEO ezt találta: ${missing.join('; ')}. Add le újra: a Markdown-szakaszokat és a TANULOI_NEZET-et teljesen (a változatlanokat is szó szerint), a BLOKK_JSON helyett a fenti szabály szerinti, **érvényes** BLOKK_JAVITAS-t (minden megváltozott item teljes objektumként), az elejétől a GEPI_OSSZEGZES_VEGE soráig.\n`;

const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
// A „teljes item” gépi próbája: ha a régi itemben megvolt, a csere sem hagyhatja el (egy részleges item ezek nélkül jönne).
const CORE_ITEM_KEYS = ['capability', 'variant', 'response', 'solution'];
const PATCH_KEYS = new Set(['replace', 'add', 'remove', 'order', 'block']);

/**
 * Javításlista alkalmazása egy teljes blokkra. A sorrend: replace (a helyén) → add (sorban; az afterId egy korábban
 * hozzáadott itemre is mutathat) → remove → order (oldalanként az itemek teljes új sorrendje; U43 p12, 11-14) →
 * mezők felülírása. Eredmény: { block, errors } — hibánál a block null.
 */
export function applyBlockPatch(base, patch) {
  const errors = [];
  if (!isObject(patch)) return { block: null, errors: ['a BLOKK_JAVITAS nem JSON-objektum'] };
  for (const key of Object.keys(patch)) if (!PATCH_KEYS.has(key)) errors.push(`ismeretlen kulcs a BLOKK_JAVITAS-ban: ${key} (csak replace, add, remove, order, block)`);
  for (const key of ['replace', 'add', 'remove']) if (patch[key] !== undefined && !Array.isArray(patch[key])) errors.push(`a(z) ${key} nem lista`);
  if (patch.block !== undefined && !isObject(patch.block)) errors.push('a block nem objektum');
  if (patch.order !== undefined && !isObject(patch.order)) errors.push('az order nem objektum (oldal-ID → item-ID-lista)');
  if (errors.length) return { block: null, errors };

  const block = structuredClone(base);
  const pages = block.pages ?? [];
  const find = id => {
    for (const page of pages) {
      const i = (page.items ?? []).findIndex(it => it?.id === id);
      if (i >= 0) return { page, i };
    }
    return null;
  };
  const replaced = new Set();
  for (const item of patch.replace ?? []) {
    if (!isObject(item) || typeof item.id !== 'string') { errors.push('replace: item ID nélkül'); continue; }
    if (replaced.has(item.id)) { errors.push(`replace: kétszer szerepel: ${item.id}`); continue; }
    replaced.add(item.id);
    const at = find(item.id);
    if (!at) { errors.push(`replace: nincs ilyen item: ${item.id}`); continue; }
    const lost = CORE_ITEM_KEYS.filter(k => at.page.items[at.i][k] !== undefined && item[k] === undefined);
    if (lost.length) { errors.push(`replace: ${item.id} nem teljes item (hiányzik: ${lost.join(', ')})`); continue; }
    at.page.items[at.i] = item;
  }
  for (const entry of patch.add ?? []) {
    const item = entry?.item;
    if (!isObject(entry) || !isObject(item) || typeof item.id !== 'string') { errors.push('add: item ID nélkül (alak: {"pageId","afterId","item"})'); continue; }
    const page = pages.find(p => p.id === entry.pageId);
    if (!page) { errors.push(`add: nincs ilyen oldal: ${entry.pageId} (${item.id})`); continue; }
    if (find(item.id)) { errors.push(`add: már van ilyen item: ${item.id}`); continue; }
    page.items ??= [];
    if (entry.afterId == null) { page.items.unshift(item); continue; }
    const i = page.items.findIndex(it => it?.id === entry.afterId);
    if (i < 0) { errors.push(`add: az afterId nincs a(z) ${entry.pageId} oldalon: ${entry.afterId} (${item.id})`); continue; }
    page.items.splice(i + 1, 0, item);
  }
  for (const entry of patch.remove ?? []) {
    if (!isObject(entry) || typeof entry.id !== 'string') { errors.push('remove: ID nélkül (alak: {"id","reason"})'); continue; }
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) { errors.push(`remove: indok nélkül: ${entry.id}`); continue; }
    if (replaced.has(entry.id)) { errors.push(`remove: ugyanaz az item cserélve és törölve: ${entry.id}`); continue; }
    const at = find(entry.id);
    if (!at) { errors.push(`remove: nincs ilyen item: ${entry.id}`); continue; }
    at.page.items.splice(at.i, 1);
  }
  for (const [pageId, ids] of Object.entries(patch.order ?? {})) {
    const page = pages.find(p => p.id === pageId);
    if (!page) { errors.push(`order: nincs ilyen oldal: ${pageId}`); continue; }
    if (!Array.isArray(ids)) { errors.push(`order: ${pageId} értéke nem lista`); continue; }
    const current = (page.items ?? []).map(it => it?.id);
    const missing = current.filter(id => !ids.includes(id));
    const unknown = ids.filter(id => !current.includes(id));
    const twice = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (missing.length || unknown.length || twice.length) {
      const few = list => list.slice(0, 3).join(', ') || '–';
      errors.push(`order: ${pageId} nem az oldal itemjeinek teljes sorrendje (hiányzik: ${few(missing)}; ismeretlen: ${few(unknown)}; kétszer: ${few(twice)})`);
      continue;
    }
    const byId = new Map(page.items.map(it => [it.id, it]));
    page.items = ids.map(id => byId.get(id));
  }
  const { pages: pageFields, ...fields } = patch.block ?? {};
  for (const key of Object.keys(fields)) {
    if (key === 'id' || key === 'items') { errors.push(`block: a(z) ${key} nem írható felül`); continue; }
    block[key] = fields[key];
  }
  if (pageFields !== undefined) {
    if (!isObject(pageFields)) errors.push('block.pages: oldal-ID → mezők objektum kell (az oldalak listája nem írható felül)');
    else {
      for (const [pageId, over] of Object.entries(pageFields)) {
        const page = pages.find(p => p.id === pageId);
        if (!page) { errors.push(`block.pages: nincs ilyen oldal: ${pageId}`); continue; }
        if (!isObject(over)) { errors.push(`block.pages: ${pageId} mezői nem objektumban`); continue; }
        for (const key of Object.keys(over)) {
          if (key === 'id' || key === 'items') { errors.push(`block.pages: ${pageId} ${key} mezője nem írható felül`); continue; }
          page[key] = over[key];
        }
      }
    }
  }
  // Összefésülés után minden oldal- és item-ID egyedi.
  const seen = new Set();
  for (const id of [...pages.map(p => p.id), ...pages.flatMap(p => (p.items ?? []).map(it => it?.id))]) {
    if (seen.has(id)) errors.push(`ID-ütközés az összefésülés után: ${id}`);
    seen.add(id);
  }
  return errors.length ? { block: null, errors } : { block, errors };
}

/**
 * A blokk szövegként, a megoldásíró szokott alakjában: felső szintű mezőnként, a listák (media, pages) és az oldalak
 * itemjei elemenként egy sorban. Determinisztikus (ugyanaz a blokk → ugyanaz a szöveg); JSON.parse-szal visszaolvasható.
 */
export function formatBlock(block) {
  const list = (items, one = x => JSON.stringify(x)) => (items.length ? `[\n${items.map(one).join(',\n')}\n]` : '[]');
  const object = (o, special = {}) => `{${Object.entries(o).filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${JSON.stringify(k)}:${special[k] && Array.isArray(v) ? special[k](v) : JSON.stringify(v)}`).join(',')}}`;
  const page = p => (isObject(p) ? object(p, { items: v => list(v) }) : JSON.stringify(p));
  const top = Object.entries(block).filter(([, v]) => v !== undefined).map(([k, v]) => {
    if (k === 'pages' && Array.isArray(v)) return `"pages":${list(v, page)}`;
    if (Array.isArray(v) && v.length > 3) return `${JSON.stringify(k)}:${list(v)}`;
    return `${JSON.stringify(k)}:${JSON.stringify(v)}`;
  });
  return `{\n${top.join(',\n')}\n}`;
}

/**
 * A szerző javításlistás leadása → teljes megoldásszöveg: a BLOKK_JAVITAS blokk helyére az előző teljes BLOKK_JSON és a
 * javításlista összefésülése kerül (BLOKK_JSON … BLOKK_JSON_VEGE), a szöveg többi része a szerzőé.
 * Ha a szerző javításlista helyett teljes BLOKK_JSON-t adott, az teljes leadásként érvényes (mode: 'full').
 * Eredmény: { text, mode: 'patch' | 'full', errors: [] } vagy { text: null, errors: [...] }.
 */
export function mergePatchedSolution(previousText, authorText) {
  const text = String(authorText ?? '');
  const hasPatch = PATCH_MARK.test(text);
  const hasFull = BLOCK_BODY_RE.test(text);
  if (hasPatch && hasFull) return { text: null, errors: ['a válaszban BLOKK_JAVITAS és BLOKK_JSON is van; csak a BLOKK_JAVITAS kell'] };
  if (!hasPatch) {
    if (!hasFull) return { text: null, errors: ['nincs BLOKK_JAVITAS … BLOKK_JAVITAS_VEGE blokk a válaszban'] };
    const { error } = extractBlockJson(text);
    return error ? { text: null, errors: [error] } : { text, mode: 'full', errors: [] };
  }
  const m = text.match(PATCH_RE);
  if (!m) return { text: null, errors: ['a BLOKK_JAVITAS blokk nincs lezárva (BLOKK_JAVITAS_VEGE)'] };
  let patch;
  try { patch = JSON.parse(unfence(m[1])); } catch (error) { return { text: null, errors: [`a BLOKK_JAVITAS nem érvényes JSON: ${error.message}`] }; }
  const { block: base, error } = extractBlockJson(previousText);
  if (!base) return { text: null, errors: [`az előző teljes megoldásban nincs érvényes BLOKK_JSON (${error})`] };
  const { block, errors } = applyBlockPatch(base, patch);
  if (!block) return { text: null, errors };
  // Függvénnyel cserél, hogy a JSON-ban álló $-jelek ne értelmeződjenek mintaként.
  const merged = text.replace(PATCH_RE, () => `BLOKK_JSON\n${formatBlock(block)}\nBLOKK_JSON_VEGE\n`);
  return { text: merged, mode: 'patch', errors: [] };
}
