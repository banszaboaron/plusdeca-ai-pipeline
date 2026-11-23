// Szöveg-normalizálás a hűségkapuhoz és a kulcsellenőrzéshez.
// Szóköz- és idézőjel-normalizálás: a kézirat és a csomag tipográfiai
// változatai (NBSP, « », ’) nem okoznak hamis eltérést, a szavak igen.
import { createHash } from 'node:crypto';

const SPACES = /[\s     ⁠]+/gu;
const APOSTROPHES = /[’‘ʼ´`]/gu;
const QUOTES = /[«»“”„"‹›]/gu;

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFC')
    .replace(APOSTROPHES, "'")
    .replace(QUOTES, ' ')
    .replace(SPACES, ' ')
    .replace(/ ([:;?!.,)])/gu, '$1')
    .replace(/\( /gu, '(')
    .trim();
}

// Markdown-jelölők eltávolítása a kéziratból (kiemelés, kód, idézet, lista),
// a sorok egy folyamatos szöveggé fűzése. A táblázat-elválasztó megmarad.
export function stripMarkdown(markdown) {
  return String(markdown ?? '')
    .split(/\r?\n/u)
    .map(line => line
      .replace(/^\s{0,3}>\s?/u, '')
      .replace(/^\s{0,3}>\s?/u, '')
      .replace(/^\s*#{1,6}\s+/u, '')
      .replace(/^\s*(?:[-*+]|\d+[.)])\s+/u, '')
      .replace(/\*\*|__/gu, '')
      // A záró * után bármi állhat, ami nem betű, szám vagy csillag: a magyar kéziratban kötőjeles toldalék
      // (*en*-t, *de*-ben) vagy három pont (*près de*…) is (U21, 11-01). Szó belsejében álló csillag nem bomlik.
      .replace(/(^|[\s(])\*(\S[^*]*?)\*(?=[^\p{L}\p{N}*]|$)/gu, '$1$2')
      .replace(/`/gu, ''))
    .join(' \n ');
}

export function normalizeManuscript(markdown) {
  return normalizeText(stripMarkdown(markdown).replace(/\n/gu, ' '));
}

// Tanulói szöveg bekezdésekre bontva; minden bekezdésnek külön meg kell lennie
// a kéziratban (a sorrend és a tördelés nem számít).
export function learnerSegments(value) {
  return String(value ?? '')
    .split(/\n+/u)
    .map(part => normalizeText(stripMarkdown(part).replace(/\n/gu, ' ')))
    .filter(Boolean);
}

export function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

export function canonicalHash(value) {
  return sha256(JSON.stringify(canonical(value)));
}

// Szószámlálás a heti writing-eljárás szerint: önálló írásjel nem szó,
// az aposztrófos alak (j'en, l'eau) egy szó, a sor eleji beszélőcímke
// („Serveuse :”, „Client :”) nem számít, és a szögletes zárójeles színpadi utasítás (*[Elle corrige.]*) sem
// (a kézirat szabálya, U14, 11-01).
const SPEAKER_LABEL = /^\s*\p{Lu}[\p{L}-]*\s*:\s/gmu;
const STAGE_DIRECTION = /\*?\[[^\]\n]*\]\*?/gu;
export function countWords(text) {
  return normalizeText(String(text ?? '').replace(SPEAKER_LABEL, '').replace(STAGE_DIRECTION, ' '))
    .split(' ')
    .filter(token => /[\p{L}\p{N}]/u.test(token)).length;
}
