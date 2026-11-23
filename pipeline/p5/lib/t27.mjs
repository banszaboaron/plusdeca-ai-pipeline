// CL-27: francia nyelv és francia élet (PRESIDENT, 2026-11-15, T27; docs/DONTESEK.md).
// Négy gépi ellenőrzés a tanulói szövegen:
//   1. szerepenként a magyar szöveg: cím, utasítás, helyzetleírás → hiba; a lesson/note (nyelvtani
//      magyarázat, kiejtés, magyar párhuzam) kivétel; a többi szerep (példa, brief, eszközlista,
//      ellenőrzőlista, rubrika, szerep nélküli szöveg) → figyelmeztetés; magyar keresztnév → figyelmeztetés;
//   2. egyenes aposztróf két betű között → hiba (francia szövegben ’ a helyes; T15);
//   3. lista, amelynek minden bejegyzése azonos → hiba (T29);
//   4. munkacím / belső név a tanulói címben (pl. „VT1 –”, „statikus változat”) → hiba.
// Átmenet: a heti terv `t27Pending` listáján álló blokknál (a nyelvi kör még hátravan) az 1., 3. és 4.
// ellenőrzés hibái figyelmeztetésként jelennek meg; a lista egységenként fogy. Az aposztróf (2.) mindig hiba.

const finding = (severity, location, message, extra = {}) => ({ cl: 'CL-27', severity, location, message, ...extra });
const excerpt = text => { const flat = String(text).replace(/\s+/gu, ' ').trim(); return flat.length > 140 ? `${flat.slice(0, 137)}…` : flat; };

// Magyar és francia jelölők. Az á, í, ó, ú, ő, ű, ö a franciában nem fordul elő; az é, ü mindkettőben igen.
const HU_LETTERS = /[áíóúőűöÁÍÓÚŐŰÖ]/u;
// Magyar betűkapcsolat (sz, zs, cs, gy, ny) és a k + é együtt (péntek, kétféle): a franciában szinte sosem.
const HU_DIGRAPH = /sz|zs|cs|gy|ny/u;
const HU_KE = /é.*k|k.*é/u;
const FR_LETTERS = /[àâçèêëîïôûùœæÀÂÇÈÊËÎÏÔÛÙŒÆ]/u;
const HU_WORDS = new Set(('az és egy egyet hogy nem van is meg ha mert vagy ez azt ezt ezek azok mit mi ki be el fel hol már csak még kell lesz volt után előtt alatt között szerint mint minden melyik amelyik ahol amit aki írd válaszd olvasd hallgasd nézd mondd húzd rakd egészítsd fordítsd figyelj döntsd válassz kattints koppints jelöld pótold keresd sorold rendezd kösd töltsd ' +
  'sorrend felvétel reggeli ismétlés zárás bevezetés összefoglalás gyakorlás hallgatás olvasás írás kiejtés próba minta terv cél lépés jelentés jelentéselemzés probléma téves hit menete beszélgetés üzenet műhely csapat vonat vonatra lista ért értsd jelenet jelenetet ' +
  'helyes helyzet mondatmondatot mondatok szöveg szöveget szót szavak feladat válasz választ párbeszéd kérdés kérdésre magyar franciául francia oldal elem elemeket alak alakot igen ige igét névelő névelőt főnév rész része hiányzó után alapján pontosan teljes rövid hosszú kész').split(' '));
const FR_WORDS = new Set(('le la les l un une des du de d au aux et ou est sont être avoir ai as ont je j tu il elle on nous vous ils elles ce c ça cela qui que qu quoi dont où pour par avec sans dans sur sous chez en y ne n pas plus très bien mais donc car si se s me m te t lui leur leurs mon ma mes ton ta tes son sa ses notre nos votre vos ' +
  'bonjour merci voici voilà écoutez lisez écrivez choisissez complétez répondez associez cochez remettez classez reliez indiquez trouvez dites utilisez relisez vérifiez notez phrase phrases texte réponse question dialogue exemple page').split(' '));

// A francia betétek (dőlt *…*, kód `…`, idézet «…» „…” "…") és a zárójeles pontosítás nem számít bele
// a szöveg nyelvébe: „Írd le: *Je voudrais…*” magyar, „Complétez la phrase (névelővel).” francia.
function stripInserts(text) {
  return String(text ?? '')
    .replace(/\*\*([^*]+)\*\*/gu, '$1')
    .replace(/(^|[^*\p{L}])\*[^*\n]+\*/gu, '$1 ')
    .replace(/`[^`]*`/gu, ' ')
    .replace(/«[^»]*»/gu, ' ')
    .replace(/„[^”"]*[”"]/gu, ' ')
    .replace(/"[^"]*"/gu, ' ')
    .replace(/\([^()]*\)/gu, ' ')
    .replace(/\[[^\]]*\]/gu, ' ');
}

const wordsOf = text => stripInserts(text).toLowerCase().match(/[\p{L}]+/gu) ?? [];

// A blokk saját szókincse is segít: ami csak a magyarnak jelölt (language: hu) tartalomban fordul elő,
// a franciának jelöltben nem, az magyar szó (pl. „Sorrend”, „Felvétel” betűjelölő nélkül).
export function blockVocabulary(block) {
  const vocab = { hu: new Set(), fr: new Set() };
  for (const page of block?.pages ?? []) for (const stimulus of page.content ?? []) {
    const bag = stimulus.language === 'hu' ? vocab.hu : stimulus.language === 'fr' ? vocab.fr : null;
    if (bag) for (const text of stimulusTexts(stimulus)) for (const word of wordsOf(text)) bag.add(word);
  }
  return vocab;
}

export function languageScore(text, vocab = null) {
  const words = wordsOf(text);
  let hu = 0, fr = 0;
  for (const word of words) {
    if (HU_LETTERS.test(word) || HU_WORDS.has(word) || ((HU_DIGRAPH.test(word) || HU_KE.test(word)) && !FR_LETTERS.test(word))
      || (vocab && word.length > 2 && vocab.hu.has(word) && !vocab.fr.has(word))) hu += 1;
    else if (FR_LETTERS.test(word) || FR_WORDS.has(word)) fr += 1;
  }
  return { hu, fr, words: words.length };
}

// Magyar-e a szöveg (a francia betétek nélkül). Egy-két szavas címnél egy magyar jelölő is elég.
export function isHungarian(text, vocab = null) {
  const { hu, fr, words } = languageScore(text, vocab);
  if (!hu) return false;
  if (words <= 3) return hu > fr;
  return hu >= 2 && hu > fr;
}

// Magyar keresztnevek (a kéziratokban előfordulók és a gyakoriak). Francia helyzetben francia név kell.
const HU_NAMES = /(?<![\p{L}])(?:Réka|Bence|Dóra|Eszter|Zsófi|Zsófia|Kata|Katalin|Bálint|Gergő|Dániel|Ádám|Péter|Gábor|Zoltán|Tamás|Balázs|Levente|Márton|Csaba|Ildikó|Judit|Orsolya|Orsi|Nóra|Boglárka|Kinga|Erzsébet|Ágnes|Krisztina|Viktória|Noémi|Zsuzsa|Áron)(?![\p{L}])/u;

const STRAIGHT = /\p{L}'\p{L}/u;
const WORKING_TITLE = [
  { label: 'egységkód a cím elején', pattern: /^\s*(?:[A-Z]{1,3}\d{1,2}[a-z]?|\(\d,\s*\d\))\s*[–—:-]/u },
  { label: 'belső változatnév', pattern: /\b(?:statikus|munkacím|draft|placeholder|TODO)\b|teszt-?változat/iu },
  { label: 'belső angol munkacím', pattern: /^\s*(?:Reading|UoF|Use of French|Writing|Listening|Speaking|Grammar|Vocabulary)\b|\b(?:writing|reading)\s*$/iu },
  { label: 'belső azonosító', pattern: /\bw\d{2}-|\bp\d{2}\b/u }
];

const CONTENT_TYPES = new Set(['text', 'list', 'table', 'model']);
// Sor eleji egyetlen nagybetű + (nem törő) szóköz + kettőspont: „P : …”, „V : …” (T30).
const SINGLE_LETTER_SPEAKER = /(?:^|\n)\s*(?:\*\*)?\p{Lu}(?:\*\*)?[   ]?:(?:\*\*)?\s/u;
const ERROR_ROLES = new Set(['situation']);
const EXEMPT_ROLES = new Set(['lesson', 'note']);

// Szöveg darabjai egy tartalmi elemből (text, list, table, model); a gloss a szókártya, ott a magyar a jelentés.
function stimulusTexts(stimulus) {
  if (stimulus.type === 'text' || stimulus.type === 'model') return [stimulus.text];
  if (stimulus.type === 'list') return stimulus.entries ?? [];
  if (stimulus.type === 'table') return [...(stimulus.columns ?? []), ...(stimulus.rows ?? []).flat()].map(cell => (typeof cell === 'string' ? cell : cell?.text ?? ''));
  return [];
}

function flatLabel(entry) { return typeof entry === 'string' ? entry : entry?.text ?? entry?.label ?? JSON.stringify(entry); }

export function frenchLifeBlock(block, { pending = false, strings = [] } = {}) {
  const out = [];
  const vocab = blockVocabulary(block);
  const t27 =(location, message, extra) => out.push(finding(pending ? 'warning' : 'error', location, pending ? `${message} (T27-átmenet: a nyelvi kör még hátravan)` : message, extra));
  // T30 (S25): egybetűs beszélő-címke („P : Bonjour…”) → figyelmeztetés; teljes név vagy szerep kell (La vendeuse).
  const speakerCheck = (location, text) => {
    if (typeof text === 'string' && SINGLE_LETTER_SPEAKER.test(text)) out.push(finding('warning', location, 'Egybetűs beszélő-címke: a beszélő teljes névvel vagy szereppel álljon (pl. „La vendeuse”), ne betűvel (T30).', { text: excerpt(text) }));
  };
  const titles = [{ at: block.id, text: block.title }, ...(block.pages ?? []).map(page => ({ at: `${block.id} › ${page.id}`, text: page.title }))];
  for (const { at, text } of titles) {
    if (!text) continue;
    if (isHungarian(text, vocab)) t27(`${at} › title`, 'Magyar cím: a blokk- és oldalcím francia legyen.', { text: excerpt(text) });
    for (const { label, pattern } of WORKING_TITLE) if (pattern.test(text)) t27(`${at} › title`, `Munkacím vagy belső név a tanulói címben (${label}).`, { text: excerpt(text) });
  }
  const visitText = (location, text, role) => {
    if (typeof text !== 'string' || !text.trim()) return;
    if (role === undefined || !isHungarian(text, vocab)) return;
    if (role === 'instruction' || ERROR_ROLES.has(role)) t27(location, role === 'instruction' ? 'Magyar feladat-utasítás: az utasítás francia legyen (rövid magyar zárójeles pontosítás megengedett).' : 'Magyar helyzetleírás: a helyzet francia legyen.', { text: excerpt(text) });
    else if (!EXEMPT_ROLES.has(role)) out.push(finding('warning', location, `Magyar szöveg „${role}” szerepben: a T27 szerint francia legyen.`, { text: excerpt(text) }));
  };
  for (const page of block.pages ?? []) {
    const at = `${block.id} › ${page.id}`;
    visitText(`${at} › instruction`, page.instruction, 'instruction');
    (page.content ?? []).forEach((stimulus, index) => {
      const where = `${at} › ${stimulus.type}#${index}`;
      const role = stimulus.type === 'gloss' ? undefined : (stimulus.role ?? 'text');
      if (stimulus.title) visitText(`${where} › title`, stimulus.title, role === undefined ? undefined : role === 'lesson' || role === 'note' ? role : 'title-inner');
      for (const text of stimulus.type === 'gloss' ? [stimulus.surface, stimulus.example] : stimulusTexts(stimulus)) visitText(where, text, role);
      // T34 (S25): francia tartalmi rész nyelvjelölés nélkül → figyelmeztetés (az app a jelölés szerint választ betűt és kiejtést).
      if (CONTENT_TYPES.has(stimulus.type) && stimulus.language !== 'fr' && stimulus.role !== 'lesson' && stimulus.role !== 'note') {
        const score = languageScore(stimulusTexts(stimulus).map(flatLabel).join(' '), vocab);
        if (score.fr >= 2 && score.fr > 2 * score.hu) out.push(finding('warning', where, `Francia tartalom ${stimulus.language ? `„${stimulus.language}” jelöléssel` : 'nyelvjelölés nélkül'}: \`language: "fr"\` kell (vegyes listánál soronként) (T34).`));
      }
      for (const text of stimulusTexts(stimulus).map(flatLabel)) speakerCheck(where, text);
      if (stimulus.type === 'list') {
        const entries = (stimulus.entries ?? []).map(flatLabel).map(entry => entry.trim());
        if (entries.length >= 2 && entries.every(entry => entry === entries[0])) t27(where, `A lista minden bejegyzése azonos („${excerpt(entries[0])}”, ${entries.length}×) (T29).`);
      }
    });
    for (const item of page.items ?? []) {
      const where = `${at} › ${item.id}`;
      visitText(`${where} › instruction`, item.instruction, 'instruction');
      if (typeof item.prompt === 'string') speakerCheck(`${where} › prompt`, item.prompt);
      const options = (item.response?.options ?? []).map(flatLabel);
      if (options.length >= 2 && options.every(option => option === options[0])) t27(`${where} › options`, `Minden választási lehetőség azonos („${excerpt(options[0])}”) (T29).`);
    }
  }
  // Egyenes aposztróf minden tanulói (és kulcs-) szövegben; a szókártya magyar jelentésében sincs helye.
  for (const entry of strings) if (STRAIGHT.test(entry.text)) out.push(finding('error', [entry.unit, entry.page, entry.block, entry.item, entry.field].filter(Boolean).join(' › '), 'Egyenes aposztróf betűk között: francia szövegben ’ kell (T15).', { text: excerpt(entry.text) }));
  // Magyar keresztnév a tanulói szövegben (oldalanként egyszer): figyelmeztetés (T08).
  const names = new Map();
  for (const entry of strings) {
    const name = HU_NAMES.exec(entry.text)?.[0];
    const where = [entry.unit, entry.page].filter(Boolean).join(' › ');
    if (name && !names.has(`${name}\u0000${where}`)) names.set(`${name}\u0000${where}`, finding('warning', where, `Magyar név („${name}”): francia helyzetben francia név kell (T08), kivéve, ha a helyzet megköveteli.`));
  }
  out.push(...names.values());
  return out;
}
