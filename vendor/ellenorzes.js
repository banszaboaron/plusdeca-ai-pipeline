// Aszinkron ellenőrzés (T24 d, APP_IGENY_ASZINKRON_ELLENORZES_2026-11-15): a nyílt, nem objektíven ellenőrizhető
// válaszokat Áron gépén futó helyi ellenőrző nézi meg (Claude + Codex, előfizetésből), nem fizetős API.
// Közös, tiszta mag a kliensnek (progress.js, render.js), a Workernek (server/ellenorzes.mjs) és a helyi ellenőrzőnek
// (tools/ellenorzo.mjs):
//   - melyik item ellenőrizhető (isCheckable);
//   - a gépi szűrő (T24 a): azonnal, az appban; ami nem megy át, nem küldhető be;
//   - az ellenőrző kötött JSON-kimenetének sémája és ellenőrzése, két eredmény összevonása (a szigorúbb nyer);
//   - az aláhúzandó szakaszok (spans) a tanuló szövegében az idézetekből.

export const CHECK_MODES = Object.freeze(['semantic', 'reference', 'dual-gate']);
export const DUAL_GATE = 'writing-dual-gate';
/** A „u32-trusted-review” irányelvű írás önellenőrzéssel zárul (külön szabály), nem megy ellenőrzésre. */
export const TRUSTED_REVIEW = 'u32-trusted-review';
// Elfogadási küszöb (Áron, 11-16: „a 3/5-öt sem fogadnám el, csak 4/5 vagy 5/5”): legalább 4/5. A csomag minimumScore-ja
// (a P5 ma 3-at ír) ennél lejjebb nem viheti, csak följebb.
export const MINIMUM_SCORE = 4;
/** Egy beadás legfeljebb ennyi karakter. */
export const MAX_CHARS = 6000;
export const VERDICTS = Object.freeze(['pass', 'revise']);
export const CATEGORIES = Object.freeze(['nyelvtan', 'szókincs', 'tartalom', 'feladat-teljesítés', 'helyesírás']);
export const CHECKERS = Object.freeze(['claude', 'codex']);

/**
 * Ellenőrzésre megy-e az item: semantic / reference / dual-gate mód, nem kulcsos (exact), nem kulcs nélküli beküldés,
 * nem beszéd, nem újrapróba-változat (a régi önellenőrzéses lánc változatai maradnak, ahogy voltak).
 */
export function isCheckable(item) {
  const mode = item?.evaluation?.mode;
  if (!CHECK_MODES.includes(mode) || item.retryOf || item.evaluation.policyId === TRUSTED_REVIEW) return false;
  if (['exact', 'submission'].includes(item.solution?.type)) return false;
  return !['speech'].includes(item.response?.type);
}
export const isDualGate = item => item?.evaluation?.policyId === DUAL_GATE;
export const minimumScoreOf = item => Math.max(MINIMUM_SCORE, Number.isInteger(item?.evaluation?.minimumScore) ? item.evaluation.minimumScore : 0);

/** Szószám: a betűt vagy számjegyet tartalmazó, szóközzel elválasztott egységek (a francia „ : ” / „ ? ” nem szó). */
export function wordCount(text) {
  return String(text ?? '').trim().split(/\s+/u).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
}

/** Összevetéshez: kisbetű, egységes aposztróf, írásjel nélkül, egy szóköz. */
export const plain = text => String(text ?? '').normalize('NFC').toLocaleLowerCase('fr').replace(/[‘’ʼ`´]/gu, "'")
  .replace(/[^\p{L}\p{N}']+/gu, ' ').trim();
const tokens = text => plain(text).split(' ').flatMap(w => w.split("'")).filter(Boolean);

// Nem francia szöveg: magyar betű (á í ó ö ú ő ű — a franciában nincs ilyen), illetve magyar vagy angol funkciószavak
// túlsúlya a franciákhoz képest. Csak egyértelmű, a franciában önálló szóként nem élő szavak (pl. nincs „de”, „van”, „a”).
const HU_LETTERS = /[áíóöúőű]/u;
const HU_WORDS = new Set(['az', 'és', 'hogy', 'nem', 'egy', 'is', 'meg', 'mert', 'vagy', 'ez', 'azt', 'nagyon', 'vagyok', 'voltam', 'kell', 'lesz', 'már', 'még', 'csak', 'szeretnék', 'szeretem', 'én', 'ő', 'mi', 'ti', 'ők', 'itt', 'ott', 'igen', 'köszönöm', 'kérek', 'ezt', 'nincs']);
const EN_WORDS = new Set(['the', 'is', 'are', 'and', 'you', 'i', 'my', 'of', 'to', 'have', 'this', 'it', 'with', 'what', 'was', 'be', 'we', 'your', 'do', 'am', 'would', 'like', 'please', 'thank', 'yes']);
const FR_WORDS = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'est', 'je', 'j', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'on', 'que', 'qui', 'ne', 'pas', 'en', 'au', 'aux', 'à', 'ce', 'c', 'l', 'd', 'qu', 'n', 's', 'm', 't', 'pour', 'dans', 'sur', 'avec', 'mon', 'ma', 'mes', 'ton', 'ta', 'son', 'sa', 'ses', 'y', 'suis', 'es', 'sont', 'ai', 'as', 'avons', 'avez', 'ont', 'va', 'vais', 'mais', 'ou', 'très', 'bien', 'oui', 'non', 'merci', 'bonjour', 'voudrais', 'peux', 'veux', 'cette', 'ces', 'votre', 'notre', 'leur', 'par', 'plus', 'tout']);

export function nonFrench(text) {
  const words = tokens(text);
  if (!words.length) return false;
  const fr = words.filter(w => FR_WORDS.has(w)).length;
  const hu = words.filter(w => HU_WORDS.has(w) || HU_LETTERS.test(w)).length;
  const en = words.filter(w => EN_WORDS.has(w)).length;
  if (words.length <= 2) return hu === words.length || en === words.length && words.length === 2;
  const foreign = Math.max(hu, en);
  return foreign >= 2 && foreign > fr;
}

// Billentyűzetzaj: billentyűsor-futás (legalább 4 betű, pl. „asdf”, „qsdf”, „azer”), háromszor ismételt betű („xxx”),
// vagy magánhangzó nélküli, legalább 4 betűs szó. Zaj, ha a szavak legalább fele ilyen.
const ROWS = ['azertyuiop', 'qsdfghjklm', 'wxcvbn', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'yxcvbnm', 'qwertzuiop'];
const noiseWord = word => {
  const w = word.toLocaleLowerCase('fr');
  if (/(\p{L})\1\1/u.test(w)) return true;
  if (/^\p{L}{4,}$/u.test(w) && !/[aeiouyàâäéèêëîïôöûùüÿœæ]/u.test(w)) return true;
  for (let i = 0; i + 4 <= w.length; i++) if (ROWS.some(row => row.includes(w.slice(i, i + 4)))) return true;
  return false;
};
export function keyboardNoise(text) {
  const words = String(text ?? '').split(/[^\p{L}]+/u).filter(Boolean);
  if (!words.length) return false;
  return words.filter(noiseWord).length * 2 >= words.length;
}

/** A feladat szövegének másolata: a válasz a feladatban szó szerint benne van — kivéve, ha a minta maga is benne van. */
export function promptCopy(item, text) {
  const answer = plain(text), prompt = plain(item?.prompt);
  if (!answer || !prompt) return false;
  if (answer === prompt) return true;
  if (wordCount(answer) < 3 || !` ${prompt} `.includes(` ${answer} `)) return false;
  const s = item.solution ?? {};
  const samples = [s.text, ...(s.accepted ?? [])].filter(Boolean).map(plain);
  return !samples.some(sample => sample && ` ${prompt} `.includes(` ${sample} `));
}

// Kulcsszó a mintából: csak jelzés, nem tiltás. A csomag felsorolása (requiredContent), ha van; különben az a tartalmi
// szó, amely a minta MINDEN elfogadott alakjában szerepel.
const SHORT = 3;
export function missingKeywords(item, text) {
  const s = item?.solution ?? {};
  const listed = [...(s.requiredContent ?? []), ...(item?.response?.requiredContent ?? [])].filter(x => typeof x === 'string' && x.trim());
  const answer = ` ${plain(text)} `;
  if (listed.length) return listed.filter(word => !answer.includes(` ${plain(word)} `)).slice(0, 3);
  if (s.type !== 'reference' || !s.text) return [];
  const variants = [s.text, ...(s.accepted ?? [])].map(v => new Set(tokens(v)));
  const shared = [...variants[0]].filter(w => w.length > SHORT && !FR_WORDS.has(w) && variants.every(v => v.has(w)));
  const mine = new Set(tokens(text));
  return shared.filter(w => !mine.has(w)).slice(0, 2);
}

/** A csomag mintái az itemhez: referencia + elfogadott alakok, illetve a rubrika mintamegoldásai. */
export function samplesOf(item, pres = {}) {
  const s = item?.solution ?? {};
  return [...(s.type === 'reference' ? [s.text, ...(s.accepted ?? [])] : []), ...(pres?.rubricSamples ?? [])].filter(x => typeof x === 'string' && x.trim());
}
/** Francia választ vár-e a feladat: minta nélkül igen; mintával akkor, ha egyik minta sem idegen nyelvű. */
export const expectsFrench = samples => !samples.some(sample => nonFrench(sample) || HU_LETTERS.test(plain(sample)));

/**
 * Gépi szűrő (T24 a). Visszaad: { pass, wordCount, problems: [{ code, min?, max? }], warnings: [{ code: 'kulcsszo', words }] }.
 * Tiltó okok: 'ures' (üres vagy 1–2 betű), 'masolat' (a feladat másolata), 'zaj' (billentyűzetzaj), 'nem-francia',
 * 'keves' / 'sok' (a csomagban megadott szótartományon kívül; a származtatott tartomány csak felső korlát), 'hosszu'.
 */
export function machineFilter(item, text, pres = {}) {
  const value = typeof text === 'string' ? text : '';
  const count = wordCount(value), letters = (value.match(/\p{L}/gu) ?? []).length, problems = [];
  const range = item?.response?.wordRange, derived = Boolean(pres?.wordRangeDerived);
  const samples = samplesOf(item, pres), known = Boolean(value.trim()) && samples.some(sample => plain(sample) === plain(value));
  // A mintával / elfogadott alakkal egyező válasz sosem szűrődik (van egybetűs helyes válasz is, pl. „à”).
  if (known) { /* a csomag egyik helyes alakja */ }
  else if (letters <= 2 && !/\p{N}/u.test(value)) problems.push({ code: 'ures' });
  else if (promptCopy(item, value)) problems.push({ code: 'masolat' });
  else if (keyboardNoise(value)) problems.push({ code: 'zaj' });
  // Nem francia: csak francia választ váró feladatnál (van magyar nyelvű szövegértési válasz is).
  else if (expectsFrench(samples) && nonFrench(value)) problems.push({ code: 'nem-francia' });
  else {
    if (!derived && Number.isInteger(range?.min) && count < range.min) problems.push({ code: 'keves', min: range.min, max: range.max ?? null });
    if (Number.isInteger(range?.max) && count > range.max) problems.push({ code: 'sok', min: derived ? null : range.min ?? null, max: range.max });
  }
  if (value.length > MAX_CHARS) problems.push({ code: 'hosszu', max: MAX_CHARS });
  const missing = problems.length ? [] : missingKeywords(item, value);
  return { pass: problems.length === 0, wordCount: count, problems, warnings: missing.length ? [{ code: 'kulcsszo', words: missing }] : [] };
}

/** Az ellenőrző (Claude, Codex) kötött kimenetének JSON-sémája. */
export const CHECK_SCHEMA = Object.freeze({
  type: 'object',
  properties: {
    score: { type: 'integer', enum: [0, 1, 2, 3, 4, 5], description: 'Pontszám 0–5 a skála szerint.' },
    errors: {
      type: 'array',
      description: 'A hibák. Az elfogadható, csak kevésbé szerencsés megoldás nem hiba.',
      items: {
        type: 'object',
        properties: {
          quote: { type: 'string', description: 'A tanuló szövegéből betű szerint idézett, a lehető legrövidebb hibás szakasz.' },
          problem: { type: 'string', description: 'Rövid magyar magyarázat; a francia elemek „…” között.' },
          fix: { type: 'string', description: 'A javított francia alak.' },
          category: { type: 'string', enum: [...CATEGORIES] },
        },
        required: ['quote', 'problem', 'fix', 'category'],
        additionalProperties: false,
      },
    },
    summary: { type: 'string', description: 'Egy-két mondat magyarul: mi jó, és mi a következő lépés.' },
  },
  required: ['score', 'errors', 'summary'],
  additionalProperties: false,
});

const MAX_ERRORS = 30, MAX_FIELD = 1200;
const str = (value, max = MAX_FIELD) => (typeof value === 'string' && value.length <= max ? value : null);

/** Egy ellenőrző kimenetének ellenőrzése (a szolgáltató kimenete sem megbízható bemenet). { ok, result } | { ok: false, reason }. */
export function validateCheck(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, reason: 'nem objektum' };
  if (!Number.isInteger(raw.score) || raw.score < 0 || raw.score > 5) return { ok: false, reason: 'score nem 0–5 közötti egész' };
  if (!Array.isArray(raw.errors) || raw.errors.length > MAX_ERRORS) return { ok: false, reason: 'errors nem lista' };
  const errors = [];
  for (const e of raw.errors) {
    const quote = str(e?.quote), problem = str(e?.problem), fix = str(e?.fix ?? '');
    if (quote === null || problem === null || fix === null || !problem.trim() || !CATEGORIES.includes(e?.category)) return { ok: false, reason: 'errors: hibás elem' };
    errors.push({ quote, problem, fix, category: e.category });
  }
  const summary = str(raw.summary);
  if (summary === null) return { ok: false, reason: 'summary hibás' };
  return { ok: true, result: { score: raw.score, errors, summary } };
}

/**
 * Két (vagy egy) ellenőrzés összevonása. checks: { claude?: result, codex?: result } (validateCheck után).
 * A szigorúbb nyer (az alacsonyabb pont), a hibalisták egyesülnek, a betű szerint azonos idézet csak egyszer szerepel.
 * Egyik sem: null (marad függőben). Csak egy: érvényes, „egy ellenőrző” jelöléssel (single).
 */
export function mergeChecks(checks, { minimumScore = MINIMUM_SCORE } = {}) {
  const ran = CHECKERS.filter(name => checks?.[name]);
  if (!ran.length) return null;
  const results = ran.map(name => checks[name]);
  const strictest = results.reduce((a, b) => (b.score < a.score ? b : a));
  // Egy hiba egyszer (Áron, 11-16: két megjegyzés ugyanarról szólt): az azonos idézet, illetve az azonos kategóriájú,
  // egymást tartalmazó idézet (pl. „Non” és „Non, je n'en prends pas deux.”) ugyanaz a hiba; a szigorúbbé marad meg.
  const errors = [];
  const sameError = (a, b) => a.quote === b.quote || (a.category === b.category && plain(a.quote) && plain(b.quote)
    && (` ${plain(a.quote)} `.includes(` ${plain(b.quote)} `) || ` ${plain(b.quote)} `.includes(` ${plain(a.quote)} `)));
  for (const result of [strictest, ...results.filter(r => r !== strictest)]) for (const e of result.errors) {
    if (errors.some(kept => sameError(kept, e))) continue;
    errors.push(e);
  }
  const score = strictest.score;
  return { verdict: score >= minimumScore ? 'pass' : 'revise', score, minimumScore, errors, summary: strictest.summary, checkers: ran, single: ran.length === 1 };
}

/** Egy tárolt (összevont) eredmény ellenőrzése: a kliens és a Worker is ezzel fogadja el. null, ha sérült. */
export function validateResult(raw) {
  if (!raw || typeof raw !== 'object' || !VERDICTS.includes(raw.verdict)) return null;
  const checked = validateCheck({ score: raw.score, errors: raw.errors, summary: raw.summary });
  if (!checked.ok || !Number.isInteger(raw.minimumScore)) return null;
  const checkers = Array.isArray(raw.checkers) ? CHECKERS.filter(c => raw.checkers.includes(c)) : [];
  if (!checkers.length) return null;
  const verdict = checked.result.score >= raw.minimumScore ? 'pass' : 'revise';
  if (verdict !== raw.verdict) return null;
  return { verdict, ...checked.result, minimumScore: raw.minimumScore, checkers, single: checkers.length === 1 };
}

/** Aláhúzandó szakaszok: minden idézet első, még nem használt előfordulása (karakterpozíció); a nem található idézet csak a listában. */
export function spansFor(text, errors = []) {
  const used = [], spans = [];
  const overlaps = (s, e) => used.some(([a, b]) => s < b && e > a);
  errors.forEach((error, index) => {
    const quote = error.quote.trim();
    if (!quote) return;
    let from = 0, at;
    while ((at = text.indexOf(quote, from)) >= 0 && overlaps(at, at + quote.length)) from = at + 1;
    if (at < 0) return;
    used.push([at, at + quote.length]);
    spans.push({ start: at, end: at + quote.length, index });
  });
  return spans.sort((a, b) => a.start - b.start);
}

/** A beadás azonosítója a sorban és az eredménytárban: item + szöveg (NFC) → ugyanaz a szöveg nem megy újra ellenőrzésre. */
export async function submissionId(itemId, text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${itemId}\n${String(text).normalize('NFC')}`));
  return [...new Uint8Array(digest)].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** A heti végső teszt (VT1): a hét szókincstesztje. */
export const isFinalTest = block => block?.kind === 'assessment' && block.assessmentKind === 'vocabulary';
