// Kívánságlista a heti láncban (Áron döntése, 2026-10-28): a 2. héttől az FR és az illetékes oszloprendező
// megkapja a projektkövető nyitott kívánságait, és beépíti őket — de csak ha a heti témához, a szinthez és a
// terheléshez természetesen illeszkednek. Ami nem illik, nyitva marad egy későbbi hétre.
//
//   relay → CEO:  wishes.json  { schema: 'plusdeca-wishes/1', exportedAt, wishes: [{ id, text, kind, status, note }] }
//                 (a projektkövető szinkronja írja; kind: szo | nyelvtan | tema | egyeb; status: open | plan | in | out)
//   CEO → relay:  wishes-feedback/<futás>.json  { schema: 'plusdeca-wish-feedback/1', run, week, updatedAt, items }
//                 items: [{ id, status: plan | in | open, by, placement: { week, unit, evidence } | null, note }]
//                 (a szinkron ebből frissíti a kívánság állapotát; „open” = most nem illett, nyitva marad)
//
// Az FR és a rendezők a döntésüket egy gépi blokkban adják vissza:
//   KIVANSAGOK
//   <id> | <döntés> | <hova> | <indok / hogyan>
//   KIVANSAGOK_VEGE
// FR-nél a döntés: GR | RR | VR | XR (melyik oszlophoz rendeli) vagy kesobb; rendezőnél: beepul (hova = blokk-ID) vagy kesobb.

export const WISH_FROM_WEEK = 2;
export const WISH_FILE = 'wishes.json';
const OPEN = new Set(['open', 'plan']);
const WISH_ID = /^[A-Za-z0-9._~:@+-]{1,120}$/;
const MAX_WISHES = 80;

/** Fajta → a természetes oszloprendező (az FR ettől eltérhet). */
export const KIND_DIRECTOR = { nyelvtan: 'GR', szo: 'VR', tema: 'RR', egyeb: null };
export const KIND_LABEL = { szo: 'szó / kifejezés', nyelvtan: 'nyelvtan', tema: 'téma', egyeb: 'egyéb' };

/** A wishes.json nyitott (még be nem épült, nem elvetett) kívánságai; hibás vagy hiányzó fájlnál üres lista. */
export function openWishes(text) {
  let doc;
  try { doc = typeof text === 'string' ? JSON.parse(text) : text; } catch { return []; }
  return (Array.isArray(doc?.wishes) ? doc.wishes : [])
    .filter(w => WISH_ID.test(String(w?.id ?? '')) && String(w?.text ?? '').trim() && OPEN.has(w.status ?? 'open'))
    .slice(0, MAX_WISHES)
    .map(w => ({ id: String(w.id), text: String(w.text).trim().slice(0, 500), kind: KIND_LABEL[w.kind] ? w.kind : 'egyeb', note: String(w.note ?? '').slice(0, 300) }));
}

const line = w => `- \`${w.id}\` [${KIND_LABEL[w.kind]}] ${w.text}${w.note ? ` — korábbi megjegyzés: ${w.note}` : ''}`;

const FIT_RULE = `Csak azt építsd be, ami a heti témához, a szinthez és a heti terheléshez **természetesen illeszkedik**. Egy kívánság kedvéért ne változtasd meg a heti célokat, ne terheld túl a hetet, és ne erőltess szinten felüli anyagot. Ami most nem illik, az nem hiba: jelöld „kesobb”-nek egy rövid indokkal (pl. melyik hét témájához illene), és nyitva marad.`;

/** Az FR-nek: az összes nyitott kívánság, oszlophoz rendelési feladattal. */
export function frWishAttachment(wishes, week) {
  if (!wishes.length) return '';
  return `

# A projektkövető nyitott kívánságai (${week}. hét)

Áron (PRESIDENT) kívánságai: szavak, kifejezések, témák, nyelvtani kérések. ${FIT_RULE}

Ami illik, azt rendeld oszlophoz (GR, RR, VR, XR), és a „## HETI KONCEPCIÓ” kívánság-hozzárendelésében, valamint a címzett rendező briefjében nevezd meg az azonosítóval. A rendező dönti el a blokkot.

${wishes.map(line).join('\n')}

A válaszod végén, a gépi összegzés előtt, add meg minden fenti kívánságra a döntésedet ebben a blokkban (egy sor egy kívánság):

KIVANSAGOK
<azonosító> | GR / RR / VR / XR / kesobb | - | <egy mondat: miért illik ide, vagy miért nem most>
KIVANSAGOK_VEGE
`;
}

/**
 * A rendezőnek: amit az FR neki rendelt (ezeket mérlegelje elsőként), és a fajtája szerint hozzá tartozó, az FR által
 * máshová nem rendelt nyitott kívánságok (választható). Üres, ha nincs mit mérlegelnie.
 */
export function directorWishes(wishes, frDecisions, dir) {
  const byId = new Map(frDecisions.map(d => [d.id, d]));
  const assigned = wishes.filter(w => byId.get(w.id)?.decision === dir);
  const optional = wishes.filter(w => !byId.has(w.id) && KIND_DIRECTOR[w.kind] === dir);
  return { assigned, optional };
}

export function directorWishAttachment({ assigned, optional }, dir, frDecisions = []) {
  if (!assigned.length && !optional.length) return '';
  const why = id => frDecisions.find(d => d.id === id)?.reason;
  return `

# Kívánságok, amelyeket mérlegelned kell (${dir})

${FIT_RULE} Ha beépíted, nevezd meg a blokkot, és a blokk „## BLOKK <ID>” szakaszában írd le az azonosítóval együtt, mit kell vele a blokkírónak kezdenie (pl. a szó a modellszövegben és egy itemben, a nyelvtani pont a kontrasztfeladatban).
${assigned.length ? `\n**Az FR neked rendelte:**\n${assigned.map(w => `${line(w)}${why(w.id) ? ` _(FR: ${why(w.id)})_` : ''}`).join('\n')}\n` : ''}${optional.length ? `\n**Választható (a fajtája szerint a te oszlopod; az FR nem rendelte máshová):**\n${optional.map(line).join('\n')}\n` : ''}
A válaszod végén, a gépi összegzés előtt, add meg minden fenti kívánságra a döntésedet:

KIVANSAGOK
<azonosító> | beepul / kesobb | <blokk-ID, pl. ${dir === 'GR' ? 'GI2' : dir === 'VR' ? 'VI1' : dir === 'RR' ? 'RI3' : 'XI1'}; kesobb esetén -> | <egy mondat: hogyan épül be, vagy miért nem most>
KIVANSAGOK_VEGE
`;
}

/** A KIVANSAGOK blokk sorai: [{ id, decision, target, reason }] (csak az ismert azonosítókra). */
export function parseWishDecisions(text, known) {
  const ids = new Set(known.map(w => w.id));
  const m = String(text ?? '').match(/^KIVANSAGOK\s*$([\s\S]*?)^KIVANSAGOK_VEGE\s*$/m);
  if (!m) return [];
  const out = [];
  for (const row of m[1].split(/\r?\n/)) {
    const cells = row.replace(/^\s*[-*]\s*/, '').split('|').map(c => c.trim().replace(/^`|`$/g, ''));
    if (cells.length < 2 || !ids.has(cells[0])) continue;
    const decision = cells[1].replace(/[^A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]/g, '');
    const norm = /^(GR|RR|VR|XR)$/i.test(decision) ? decision.toUpperCase() : /^be/i.test(decision) ? 'beepul' : 'kesobb';
    out.push({ id: cells[0], decision: norm, target: cells[2] && cells[2] !== '-' ? cells[2] : null, reason: cells.slice(3).join(' | ') || null });
  }
  return out;
}

/**
 * A visszajelzés a projektkövetőnek. Az FR oszlophoz rendelése „plan”, a rendező beépítése „in” (blokkal);
 * a „kesobb” nyitva marad (open), megjegyzéssel. A későbbi (rendezői) döntés felülírja a korábbit (FR).
 */
export function wishFeedback({ run, week, fr = [], directors = {} }) {
  const items = new Map();
  for (const d of fr) {
    items.set(d.id, d.decision === 'kesobb'
      ? { id: d.id, status: 'open', by: 'FR', placement: null, note: `${week}. hét (FR): most nem${d.reason ? ` — ${d.reason}` : ''}` }
      : { id: d.id, status: 'plan', by: 'FR', placement: { week, unit: d.decision, evidence: d.reason ?? '' }, note: `${week}. hét: az FR a(z) ${d.decision} oszlophoz rendelte` });
  }
  for (const [dir, list] of Object.entries(directors)) {
    for (const d of list) {
      items.set(d.id, d.decision === 'beepul'
        ? { id: d.id, status: 'in', by: dir, placement: { week, unit: d.target ?? dir, evidence: d.reason ?? '' }, note: `${week}. hét, ${d.target ?? dir} (${dir})` }
        : { id: d.id, status: 'open', by: dir, placement: null, note: `${week}. hét (${dir}): most nem${d.reason ? ` — ${d.reason}` : ''}` });
    }
  }
  return { schema: 'plusdeca-wish-feedback/1', run, week, updatedAt: new Date().toISOString(), items: [...items.values()] };
}
