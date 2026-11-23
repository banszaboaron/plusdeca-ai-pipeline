// A P5 gépi kapui. Minden finding CL-azonosítót, súlyosságot és helyet kap.
//   CL-01  review-kötés + hűség (a tanulói szöveg a review-zott kéziratból való)
//   CL-02  statikus játszhatóság
//   CL-04  válasz-épség: töredék, elvesző névelő, duplikátum
//   CL-06  egyetlen elfogadott válasz (csak figyelmeztetés)
//   CL-07  a kulcs olyan adatot vár, ami nincs a feladatban
//   CL-08  brief-megfelelés (modellek, eszközök, regiszter, terjedelem)
//   CL-18  tiltott meta-tokenek a tanulói felületen
//   CL-23  koppintásos jelentés (S23): a glossza felszíni alakja az elem szövegében
//   CL-27  francia nyelv és francia élet (T27): magyar cím/utasítás/helyzet, egyenes aposztróf, azonos lista, munkacím
//   SCHEMA blokkséma (csak P5 blokkforrásnál)
import { canonicalHash, countWords, learnerSegments, normalizeText } from './normalize.mjs';
import { loadReviewChain } from './manuscripts.mjs';
import { blockStrings, formatLocation, v1EntityStrings, v1VocabularyStrings } from './extract.mjs';
import { validateSchema } from './schema-validate.mjs';
import { frenchLifeBlock } from './t27.mjs';
import { contextGlossesBlock } from './glosses.mjs';

export const META_TOKENS = [
  { token: 'approved', pattern: /\bapproved\b/iu },
  { token: 'chunk', pattern: /chunk/iu },
  { token: 'w01-', pattern: /\bw\d{2}-/u },
  { token: '_subitem', pattern: /_subitem/u },
  { token: 'MODE TEST', pattern: /MODE\s+TEST/iu }
];

// Számok a kulcsban és a feladatban: számjegy, francia és magyar számnév, érték szerint összevetve.
const FR_NUMBERS = { deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60, cent: 100, mille: 1000 };
const HU_NUMBERS = [['kett', 2], ['két', 2], ['hár', 3], ['négy', 4], ['öt', 5], ['hat', 6], ['hét', 7], ['nyolc', 8], ['kilenc', 9], ['tíz', 10], ['tiz', 10], ['húsz', 20], ['harminc', 30], ['negyven', 40], ['ötven', 50], ['száz', 100], ['ezer', 1000]];
const NUMBER_TOKEN = /\d+(?:[.,]\d+)?|[\p{L}]+(?:-[\p{L}]+)*/gu;

function numbersIn(text, { hungarian = false } = {}) {
  const values = new Set();
  for (const [token] of normalizeText(text).toLowerCase().matchAll(NUMBER_TOKEN)) {
    if (/^\d/u.test(token)) { values.add(token.replace(',', '.')); continue; }
    const parts = token.split('-');
    if (parts.some(part => part in FR_NUMBERS) && parts.every(part => part in FR_NUMBERS || part === 'et')) {
      // „trente-deux” → 32, „dix-huit” → 18
      const total = parts.filter(part => part !== 'et').reduce((sum, part) => (FR_NUMBERS[part] >= 100 ? (sum || 1) * FR_NUMBERS[part] : sum + FR_NUMBERS[part]), 0);
      values.add(String(total));
      continue;
    }
    if (hungarian) for (const [stem, value] of HU_NUMBERS) if (token.startsWith(stem)) { values.add(String(value)); break; }
  }
  return values;
}

// Egybetűs töredék a válasz elején („e gamme” az „une gamme”-ból). Az „à” és az „y” valódi szó.
const FRAGMENT = /^(?![àay]\s)[a-zàâçéèêëîïôûùüÿœ]\s/u;
const ARTICLE = /^(?:un|une|le|la|les|l'|du|de la|de l'|des|d')\s?/iu;
const GENDERED_ARTICLE = /^(?:un|une|le|la)\s/iu;
const TUTOIEMENT = /(?<![\p{L}'])(?:tu|te|toi|ton|ta|tes|t')(?![\p{L}])/iu;

const finding = (cl, severity, location, message, extra = {}) => ({ cl, severity, location, message, ...extra });
const excerpt = text => { const flat = String(text).replace(/\s+/gu, ' ').trim(); return flat.length > 140 ? `${flat.slice(0, 137)}…` : flat; };

// ---------- CL-01: review-kötés és hűség ----------

function checkFidelity(strings, chain) {
  const out = [];
  for (const entry of strings) {
    const missing = learnerSegments(entry.text).filter(segment => !chain.corpus.includes(segment));
    if (missing.length) out.push(finding('CL-01', 'error', formatLocation(entry), 'A szöveg nincs meg a review-zott kéziratban (kitalált vagy átírt).', { text: excerpt(missing[0]), gate: 'fidelity' }));
  }
  return out;
}

// A kézirat címsoraiban szereplő oldal/item/modell-azonosítók mind legyenek meg
// a csomagban (hiányzó tartalom).
function checkCoverage(entityId, presentIds, chain) {
  const out = [];
  // A kézirat-ID-ben aláhúzás is lehet (U33: …-001-written_fr_to_hu). A séma csak kötőjelet enged, ezért a blokk
  // ugyanezt kötőjellel írja; egyeztetés előtt az aláhúzás kötőjel lesz (11-13).
  const idPattern = new RegExp(`${entityId.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}-[a-z0-9_-]*[a-z0-9]`, 'gu');
  const headingIds = new Set(), conditional = new Set();
  // Feltételes elem (U54, Áron 11-14): a kézirat a címsorban maga jelöli, pl. „(FELTÉTELES)” vagy „(FÜGGŐ: HALLGATÁSI LAP)”.
  // Ha nincs a csomagban, csak figyelmeztetés; ha benne van, rendben.
  const conditionalMark = /\((?:FELTÉTELES|FÜGGŐ)[^)]*\)/iu;
  for (const file of chain.files) {
    for (const line of file.text.split(/\r?\n/u)) if (/^#{2,4}\s/u.test(line)) for (const match of line.matchAll(idPattern)) {
      const id = match[0].replace(/_/gu, '-');
      headingIds.add(id);
      if (conditionalMark.test(line)) conditional.add(id);
    }
  }
  const present = [...presentIds];
  for (const id of headingIds) {
    // Az item és a subitem (…-i01 / …-i01-s001) ugyanannak a feladatnak két szintje.
    const covered = present.some(candidate => candidate === id || new RegExp(`^${candidate}-s\\d+$`, 'u').test(id) || new RegExp(`^${id}-s\\d+$`, 'u').test(candidate));
    if (covered) continue;
    if (conditional.has(id)) out.push(finding('CL-01', 'warning', `${entityId} › ${id}`, 'Feltételes elem, nincs a csomagban (a kézirat címsora FELTÉTELES vagy FÜGGŐ jelölésű).', { gate: 'coverage' }));
    else out.push(finding('CL-01', 'error', `${entityId} › ${id}`, 'A review-zott kéziratban szereplő elem hiányzik a csomagból.', { gate: 'coverage' }));
  }
  return out;
}

function checkBinding(entityId, binding, chain, contentHash, label) {
  const out = [];
  if (!binding) {
    out.push(finding('CL-01', 'error', entityId, `Nincs review-kötés (${label}): a csomag nem rögzíti, melyik REVIEW_PASS kéziratra és tartalom-hashre épül.`, { gate: 'binding' }));
    return out;
  }
  if (binding.reviewPass !== chain.reviewPass) out.push(finding('CL-01', 'error', entityId, `A kötés más review-pass fájlra mutat: ${binding.reviewPass} (várt: ${chain.reviewPass}).`, { gate: 'binding' }));
  const byFile = new Map(chain.files.map(file => [file.file, file.sha256]));
  for (const entry of binding.manuscripts || []) {
    if (!byFile.has(entry.file)) out.push(finding('CL-01', 'error', `${entityId} › ${entry.file}`, 'A kötött kéziratfájl nem része a review-zott láncnak.', { gate: 'binding' }));
    else if (byFile.get(entry.file) !== entry.sha256) out.push(finding('CL-01', 'error', `${entityId} › ${entry.file}`, 'A kézirat a review-kötés óta megváltozott (hash eltér).', { gate: 'binding' }));
  }
  const listed = new Set((binding.manuscripts || []).map(entry => entry.file));
  for (const file of chain.files) if (!listed.has(file.file)) out.push(finding('CL-01', 'error', `${entityId} › ${file.file}`, 'A review-zott lánc része, de a kötés nem rögzíti (elavult kötés).', { gate: 'binding' }));
  if (binding.contentSha256 !== contentHash) out.push(finding('CL-01', 'error', entityId, 'A tartalom-hash nem egyezik: a csomag a review-kötés után megváltozott.', { gate: 'binding' }));
  return out;
}

function chainProblems(entityId, chain) {
  if (!chain.found) return [finding('CL-01', 'error', entityId, `Nincs REVIEW_PASS kézirat (${chain.reviewPass} hiányzik a kéziratmappából).`, { gate: 'binding' })];
  const out = [];
  if (chain.status !== 'REVIEW_PASS') out.push(finding('CL-01', 'error', `${entityId} › ${chain.reviewPass}`, 'A review-pass fájl nem rögzít REVIEW_PASS státuszt.', { gate: 'binding' }));
  for (const ref of chain.missingRefs) out.push(finding('CL-01', 'error', `${entityId} › ${ref}`, 'A review-pass által hivatkozott kézirat hiányzik.', { gate: 'binding' }));
  for (const ref of chain.badSupersedes) out.push(finding('CL-01', 'error', `${entityId} › ${ref}`, 'A review-pass Felváltja sora csak létező tulajdonosi overlay-t (<ID>.owner-*.md) nevezhet meg.', { gate: 'binding' }));
  // Figyelmeztetés, hogy minden kapufutás megmutassa: tulajdonosi fájl maradt ki a láncból.
  for (const ref of chain.superseded) out.push(finding('CL-01', 'warning', `${entityId} › ${ref}`, 'A review-pass felváltotta: a tulajdonosi overlay nem része a láncnak.', { gate: 'binding' }));
  return out;
}

// ---------- CL-02: statikus játszhatóság (v1.1) ----------

const getPath = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
const scalar = value => (typeof value === 'string' || typeof value === 'number') ? String(value) : null;

function acceptedValuesV1(answer = {}) {
  if (answer.primaryOptionId || answer.acceptedOptionIds?.length) return [answer.primaryOptionId, ...(answer.acceptedOptionIds || [])].map(scalar).filter(Boolean);
  return [answer.primary, ...(answer.accepted || [])].map(scalar).filter(value => value !== null);
}

function isClosedV1(item, v1) {
  if (item.responseLayout === 'sentence_fields' || v1.gapItemTypes.includes(item.type)) {
    return Array.isArray(item.gaps) && item.gaps.length > 0 && item.gaps.every(gap => acceptedValuesV1(gap.answer).length > 0);
  }
  return v1.closedItemTypes.includes(item.type) && acceptedValuesV1(item.answer).length > 0;
}

function usableChoiceLabels(item, v1) {
  if (!Array.isArray(item.options) || item.options.length < 2) return false;
  return item.options.every(option => {
    const value = option.value ?? option.optionId ?? option.id;
    const label = item.type === 'tfns' && v1.tfnsBuiltInLabels.includes(value) ? 'builtin' : (option.label || option.text || null);
    return typeof value === 'string' && value.trim() && typeof label === 'string' && label.trim() && !/^[A-D]$/iu.test(label.trim());
  });
}

function blockSupported(block, v1) {
  return v1.supportedBlockKinds.includes(block.kind) || typeof block.text === 'string' || Array.isArray(block.chunks)
    || v1.informationalBlockKinds.includes(block.kind) || v1.vocabularyBlockKinds.includes(block.kind);
}

function blockHasContent(block, v1) {
  // Az informatív blokkból csak a címe jelenik meg; cím nélkül a „Tájékozódási oldal” felirat.
  const titled = v1.informationalBlockKinds.includes(block.kind) && (block.title || block.label);
  return v1.contentBlockKinds.includes(block.kind) || typeof block.text === 'string' || Array.isArray(block.chunks) || Boolean(titled)
    || (block.kind === 'retry_queue' && typeof block.rule === 'string' && block.rule.trim() !== '');
}

export function playabilityV1(entity, rules) {
  const v1 = rules.v1;
  const out = [];
  const unplayableItems = [];
  const special = v1.specialUnits.find(entry => entry.unitId === entity.id && getPath(entity, entry.when.path) === entry.when.equals);
  if (special) return { findings: out, unplayableItems };
  if (!entity.pages) {
    if (entity.items?.length) out.push(finding('CL-02', 'error', entity.id, `A tesztnek nincsenek oldalai; az app ezt írja ki: „${v1.testsWithoutPages}”`));
    return { findings: out, unplayableItems };
  }
  const flow = v1.specialFunctionTypes.find(entry => entry.functionType === entity.functionType);
  for (const page of entity.pages) {
    const blocks = page.blocks || [];
    if (flow && (flow.pagesWithBlockKinds === null || blocks.some(block => flow.pagesWithBlockKinds.includes(block.kind)))) continue;
    const items = (page.items || []).flatMap(item => item.subitems?.length ? item.subitems : [item]);
    const location = `${entity.id} › ${page.id}`;
    const vocabularyItem = item => /^vocabulary_/u.test(item.type);
    const unsupported = items.filter(item => !isClosedV1(item, v1) && !vocabularyItem(item));
    const unresolved = items.filter(item => isClosedV1(item, v1) && v1.choiceItemTypes.includes(item.type) && item.type !== 'source_closed' && !usableChoiceLabels(item, v1));
    const badBlocks = blocks.filter(block => !blockSupported(block, v1));
    for (const item of unsupported) {
      unplayableItems.push(item);
      out.push(finding('CL-02', 'error', `${location} › ${item.id}`, `Nem játszható itemtípus: ${item.type || 'ismeretlen'} (az app: „Ce type d’exercice n’est pas encore disponible.”).`));
    }
    for (const item of unresolved) out.push(finding('CL-02', 'error', `${location} › ${item.id}`, 'A választós item opcióinak nincs megjeleníthető szövege.'));
    for (const block of badBlocks) out.push(finding('CL-02', 'error', `${location} › ${block.kind}`, `Nem megjeleníthető tartalmi blokk: ${block.kind || 'ismeretlen'}.`));
    if (!items.length && !blocks.some(block => blockHasContent(block, v1)) && !badBlocks.length) {
      out.push(finding('CL-02', 'error', location, `Üres oldal: nincs item, és a blokkokból (${blocks.map(block => block.kind).join(', ') || 'nincs'}) csak cím/„Tájékozódási oldal” jelenik meg.`));
    }
  }
  return { findings: out, unplayableItems };
}

// ---------- CL-04 / CL-06 / CL-07: válasz-épség ----------

function wordsOf(text) { return normalizeText(text).split(' ').filter(Boolean); }

function checkAcceptedStrings(location, values, { sentenceCheck, context, duplicateLists = [], externalSource = false }) {
  const out = [];
  const normalized = [...new Set(values.map(value => normalizeText(value)))];
  for (const value of normalized) {
    if (FRAGMENT.test(value)) out.push(finding('CL-04', 'error', location, `Töredékes elfogadott válasz: „${value}”.`, { text: value }));
  }
  for (const list of duplicateLists) {
    const seen = new Set();
    for (const value of list.map(normalizeText)) {
      if (seen.has(value)) out.push(finding('CL-04', 'warning', location, `Ismétlődő elfogadott válasz: „${value}”.`, { text: value }));
      seen.add(value);
    }
  }
  // Betűjeles sorrendkulcs („A · B · C”) nem mondat.
  if (sentenceCheck && normalized.length === 1 && wordsOf(normalized[0]).length >= 3 && !/^[A-Z](?:\s*[·,;-]\s*[A-Z])+$/u.test(normalized[0])) {
    out.push(finding('CL-06', 'warning', location, `Egyetlen elfogadott mondat („${excerpt(normalized[0])}”); más helyes megoldás hamisan elutasítható.`, { text: normalized[0] }));
  }
  if (context !== undefined && normalized.length) {
    const given = numbersIn(context, { hungarian: true });
    // A kulcs (első elfogadott alak) dönt: ha olyan számot vár, ami a feladatban nincs, a tanuló nem tudhatja.
    const needed = [...numbersIn(normalized[0])].filter(number => !given.has(number));
    if (needed.length) {
      // Ha az egység külső hangátiratra épül, a csomagból nem dönthető el: figyelmeztetés.
      out.push(externalSource
        ? finding('CL-07', 'warning', location, `A kulcs olyan adatot vár (${needed.join(', ')}), amely nincs a csomag szövegében; a külső hangátiratból ellenőrizendő.`, { text: normalized[0] })
        : finding('CL-07', 'error', location, `A kulcs olyan adatot vár (${needed.join(', ')}), amely nincs a feladat szövegében.`, { text: normalized[0] }));
    }
  }
  return out;
}

function v1ItemAccepted(item) {
  const values = [];
  const lists = [];
  const push = answer => {
    if (!answer || typeof answer !== 'object') return;
    values.push(...acceptedValuesV1(answer));
    if (Array.isArray(answer.accepted)) lists.push(answer.accepted.map(scalar).filter(value => value !== null));
  };
  if (!(item.answer?.primaryOptionId || item.answer?.acceptedOptionIds?.length)) push(item.answer);
  if (Array.isArray(item.accepted) || typeof item.primary === 'string') push({ primary: item.primary, accepted: item.accepted });
  if (item.speechReference) push(item.speechReference);
  return { values, lists };
}

const isChoice = item => (Array.isArray(item.options) && item.options.length > 0) || /select|tfns|source_closed/u.test(item.type || '');
const labelsOf = list => (Array.isArray(list) ? list : []).map(entry => (typeof entry === 'string' ? entry : entry?.label ?? entry?.text)).filter(value => typeof value === 'string');
const contextText = parts => parts.filter(part => typeof part === 'string').join(' \n ');

function blockContext(blocks) {
  // A kulcsot tartalmazó szerkesztői markdown nem számít a feladat szövegének.
  const strings = [];
  for (const block of blocks || []) {
    for (const [key, value] of Object.entries(block)) if (key !== 'markdown' && typeof value === 'string') strings.push(value);
    if (Array.isArray(block.chunks)) strings.push(...block.chunks.filter(chunk => typeof chunk === 'string'));
  }
  return strings;
}

// Az egység közös forrásai (olvasott/hallott szöveg, átirat), amelyekből a válasz kikövetkeztethető.
function unitContext(entity) {
  const strings = [];
  const add = value => { if (typeof value === 'string') strings.push(value); else if (value && typeof value === 'object') for (const entry of Object.values(value)) add(entry); };
  add(entity.sourceText);
  for (const media of Object.values(entity.media || {})) add(media?.transcript);
  for (const page of entity.pages || []) strings.push(...blockContext(page.blocks));
  return strings;
}

export function answerIntegrityV1(entity) {
  const out = [];
  const shared = unitContext(entity);
  const externalSource = /transcript/u.test(JSON.stringify(entity.media || {}));
  const visit = (item, parent, page) => {
    if (item.subitems?.length) { for (const sub of item.subitems) visit(sub, item, page); return; }
    const location = [entity.id, page?.id, item.id].filter(Boolean).join(' › ');
    if (Array.isArray(item.gaps)) {
      for (const gap of item.gaps) out.push(...checkAcceptedStrings(`${location} › ${gap.id || 'gap'}`, acceptedValuesV1(gap.answer), { sentenceCheck: false, duplicateLists: [gap.answer?.accepted || []] }));
    }
    const { values, lists } = v1ItemAccepted(item);
    if (!values.length) return;
    const typed = !isChoice(item) && !/^vocabulary_/u.test(item.type) && !/speech|speaking|record|sentence_builder|order/u.test(item.type || '');
    const context = typed ? contextText([item.prompt, item.instruction, parent?.prompt, parent?.instruction, page?.instruction, ...shared, ...(item.audio?.transcript ? [item.audio.transcript] : []), ...labelsOf(item.tokens), ...labelsOf(item.wordBank), ...(item.glosses || item.contextualGlosses || []).map(gloss => gloss?.surface)]) : undefined;
    out.push(...checkAcceptedStrings(location, values, { sentenceCheck: typed, context, duplicateLists: lists, externalSource }));
  };
  for (const page of entity.pages || []) for (const item of page.items || []) visit(item, null, page);
  for (const item of entity.items || []) visit(item, null, null);
  return out;
}

export function vocabularyIntegrity(vocabulary) {
  const out = [];
  for (const entry of vocabulary || []) {
    const accepted = entry.acceptedTranslations?.HU_TO_FR || [];
    out.push(...checkAcceptedStrings(`vocabulary › ${entry.id} › HU_TO_FR`, accepted, { sentenceCheck: true, duplicateLists: [accepted] }));
    const fr = normalizeText(entry.fr || '');
    if (ARTICLE.test(fr)) {
      for (const value of accepted.map(normalizeText)) {
        if (FRAGMENT.test(value) || ARTICLE.test(value)) continue;
        // Figyelmeztetés: az aktív szókincsfolyam a nemet külön kérdezi, a puszta főnév ott szándékos lehet.
        const gendered = GENDERED_ARTICLE.test(fr);
        out.push(finding('CL-04', 'warning', `vocabulary › ${entry.id} › HU_TO_FR`, `Elfogadott válasz névelő nélkül („${value}”, címszó: „${fr}”): ${gendered ? 'a nem elvész' : 'a determináns elvész'}.`, { text: value }));
      }
    }
  }
  return out;
}

// ---------- CL-08: brief-megfelelés ----------

function phraseVariants(raw) {
  // „cela/ça nous fera” → két változat; „je n’en prendrai pas mint rögzített chunk” → a magyar megjegyzés le.
  const cleaned = normalizeText(raw).replace(/\s+(?:mint|—|–|\().*$/u, '').trim();
  const slash = cleaned.match(/^(.*?)(\S+)\/(\S+)(.*)$/u);
  if (slash) return [`${slash[1]}${slash[2]}${slash[4]}`, `${slash[1]}${slash[3]}${slash[4]}`].map(value => value.trim());
  return [cleaned];
}

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
const containsPhrase = (text, variants) => {
  const haystack = normalizeText(text).toLowerCase();
  return variants.some(variant => {
    const clean = variant.toLowerCase().replace(/…|\.\.\.|\s*\?$/gu, '').trim();
    // „au lieu de” → „au lieu du / des / d'” is elfogadott (kötelező összevonás).
    const pattern = escapeRegex(clean).replace(/ de$/u, " (?:de |du |des |d')");
    return new RegExp(`(?<![\\p{L}])${pattern}`, 'u').test(haystack);
  });
};

function checkBrief(location, brief, models, tools) {
  const out = [];
  const formal = brief.register === 'vous' || /udvarias|vous|poli|formel|neutre/iu.test(brief.registerText || '');
  for (const model of models) {
    const where = `${location} › ${model.id}`;
    for (const phrase of brief.requiredLanguage) {
      const variants = phrase.variants;
      if (!containsPhrase(model.text, variants)) out.push(finding('CL-08', 'error', where, `A modellből hiányzik a brief kötelező eleme: „${phrase.label}”.`));
    }
    for (const tool of brief.writingTools || []) {
      if (!containsPhrase(model.text, tool.variants)) out.push(finding('CL-08', 'error', where, `A modellből hiányzik a kötelező writingeszköz: „${tool.label}”.`));
    }
    if (brief.wordRange) {
      const words = countWords(model.text);
      if (words < brief.wordRange.min || words > brief.wordRange.max) out.push(finding('CL-08', 'error', where, `A modell ${words} szó; a brief ${brief.wordRange.min}–${brief.wordRange.max} szót kér.`));
    }
    if (formal && TUTOIEMENT.test(normalizeText(model.text))) out.push(finding('CL-08', 'error', where, 'Tegező forma a semleges-udvarias (vous) briefhez írt modellben.'));
  }
  if (formal) {
    for (const tool of tools) {
      if (tool.optionalContrast) continue;
      if (TUTOIEMENT.test(normalizeText(tool.text))) out.push(finding('CL-08', 'error', `${location} › ${tool.where}`, `Tegező eszköz („${tool.text}”) a vous-briefhez kötelező/ajánlott eszközként.`));
    }
  }
  return out;
}

export function briefComplianceV1(entity) {
  const out = [];
  const blocks = (entity.pages || []).flatMap(page => (page.blocks || []).map(block => ({ page, block })));
  const briefEntry = blocks.find(({ block }) => block.kind === 'writing_brief');
  if (!briefEntry) return out;
  const raw = briefEntry.block;
  const brief = {
    registerText: raw.register,
    wordRange: Array.isArray(raw.words) ? { min: raw.words[0], max: raw.words[1] } : null,
    requiredLanguage: (raw.mandatoryLanguage || []).map(label => ({ label, variants: phraseVariants(label) })),
    writingTools: []
  };
  const models = blocks.filter(({ block }) => block.kind === 'models').flatMap(({ page, block }) => (block.values || []).map(model => ({ id: `${page.id} › ${model.id}`, text: model.text })));
  const tools = blocks.filter(({ block }) => block.kind === 'writing_tools').flatMap(({ page, block }) => (block.values || []).map(text => ({ text, where: `${page.id} › writing_tools` })));
  if (!models.length) out.push(finding('CL-08', 'warning', `${entity.id} › ${briefEntry.page.id}`, 'A briefhez nincs modellszöveg, a megfelelés nem ellenőrizhető.'));
  out.push(...checkBrief(entity.id, brief, models, tools));
  return out;
}

export function briefComplianceBlock(block) {
  if (!block.brief) return [];
  const brief = {
    register: block.brief.register,
    wordRange: block.brief.wordRange,
    requiredLanguage: (block.brief.requiredLanguage || []).map(phrase => ({ label: phrase.text, variants: [phrase.text, ...(phrase.alternatives || [])].map(normalizeText) })),
    writingTools: (block.brief.writingTools || []).map(phrase => ({ label: phrase.text, variants: [phrase.text, ...(phrase.alternatives || [])].map(normalizeText) }))
  };
  const models = []; const tools = [];
  for (const page of block.pages) for (const [index, stimulus] of (page.content || []).entries()) {
    if (stimulus.type === 'model') models.push({ id: `${page.id} › ${stimulus.id}`, text: stimulus.text });
    if (stimulus.role === 'tools') for (const text of stimulus.entries || [stimulus.text]) tools.push({ text, where: `${page.id} › content#${index}`, optionalContrast: /contraste|ne pas mélanger|registre/iu.test(stimulus.title || '') });
  }
  const out = [];
  if (!models.length) out.push(finding('CL-08', 'warning', block.id, 'A briefhez nincs modellszöveg, a megfelelés nem ellenőrizhető.'));
  out.push(...checkBrief(block.id, brief, models, tools));
  return out;
}

// ---------- CL-18: meta-tokenek ----------

export function metaTokens(strings, extra = []) {
  const out = [];
  // A szerkesztői mezők (kulcsleírás, elutasítás indoka) nem jelennek meg a tanulónak.
  for (const entry of [...strings, ...extra].filter(entry => !entry.editorial)) {
    for (const { token, pattern } of META_TOKENS) {
      if (pattern.test(entry.text)) out.push(finding('CL-18', 'error', formatLocation(entry), `Gyártási meta-szöveg a tanulói felületen: „${token}”.`, { text: excerpt(entry.text) }));
    }
  }
  return out;
}

// ---------- Futtatók ----------

export function runWeekGates(week, { handoffsDir, rules }) {
  const findings = [];
  const cache = new Map();
  const entities = [...(week.units || []), ...(week.tests || [])];
  for (const entity of entities) {
    const chain = loadReviewChain(handoffsDir, entity.id, cache);
    const strings = v1EntityStrings(entity);
    findings.push(...chainProblems(entity.id, chain));
    const { reviewBinding, ...content } = entity;
    if (chain.found) {
      findings.push(...checkBinding(entity.id, reviewBinding, chain, canonicalHash(content), 'reviewBinding'));
      findings.push(...checkFidelity(strings, chain));
      const ids = new Set([entity.id]);
      for (const page of entity.pages || []) { ids.add(page.id); for (const item of page.items || []) { ids.add(item.id); for (const sub of item.subitems || []) ids.add(sub.id); } for (const block of page.blocks || []) for (const model of block.values || []) if (model?.id) ids.add(model.id); }
      for (const item of entity.items || []) ids.add(item.id);
      findings.push(...checkCoverage(entity.id, ids, chain));
    } else if (!reviewBinding) {
      findings.push(finding('CL-01', 'error', entity.id, 'Nincs review-kötés (reviewBinding): a csomag nem rögzíti, melyik REVIEW_PASS kéziratra és tartalom-hashre épül.', { gate: 'binding' }));
    }
    const { findings: playFindings, unplayableItems } = playabilityV1(entity, rules);
    findings.push(...playFindings);
    findings.push(...answerIntegrityV1(entity));
    findings.push(...briefComplianceV1(entity));
    findings.push(...metaTokens(strings, unplayableItems.map(item => ({ unit: entity.id, item: item.id, field: 'type (az app kiírja)', text: item.type || '' }))));
  }
  if (Array.isArray(week.vocabulary) && week.vocabulary.length) {
    const vocabularyId = `w${String(week.week ?? 1).padStart(2, '0')}-vocabulary`;
    const chain = loadReviewChain(handoffsDir, vocabularyId, cache);
    findings.push(...chainProblems(`vocabulary (${vocabularyId})`, chain));
    if (chain.found) findings.push(...checkFidelity(v1VocabularyStrings(week.vocabulary), chain));
    findings.push(...vocabularyIntegrity(week.vocabulary));
  }
  return dedupe(findings);
}

function playabilityBlock(block, rules) {
  const out = [];
  const { capabilities, pageTemplates, responseByCapability } = rules.v2;
  const itemPages = new Map(block.pages.flatMap((page, index) => page.items.map(item => [item.id, { index, type: item.response?.type }])));
  for (const [pageIndex, page] of block.pages.entries()) {
    const location = `${block.id} › ${page.id}`;
    // Visszautalás (recallFrom): ugyanennek a blokknak egy korábbi oldalán lévő, megmutatható válaszú itemre mutasson.
    for (const item of page.items.filter(entry => entry.recallFrom)) {
      const source = itemPages.get(item.recallFrom);
      if (!source) out.push(finding('CL-02', 'error', `${location} › ${item.id}`, `A recallFrom nem létező itemre mutat ebben a blokkban: ${item.recallFrom}.`));
      else if (source.index >= pageIndex) out.push(finding('CL-02', 'error', `${location} › ${item.id}`, `A recallFrom csak korábbi oldal itemjére mutathat: ${item.recallFrom}.`));
      else if (!['single', 'multiple', 'text', 'writing'].includes(source.type)) out.push(finding('CL-02', 'error', `${location} › ${item.id}`, `A recallFrom ${source.type} válaszra mutat; csak single, multiple, text vagy writing válasz mutatható meg.`));
    }
    if (!pageTemplates[page.template]) out.push(finding('CL-02', 'error', location, `Ismeretlen oldalsablon: ${page.template}.`));
    else if (!pageTemplates[page.template].includes(page.variant)) out.push(finding('CL-02', 'error', location, `A(z) ${page.template} sablonnak nincs ${page.variant} változata.`));
    if (!page.items.length && !page.content.length) out.push(finding('CL-02', 'error', location, 'Üres oldal: nincs sem tartalom, sem item.'));
    for (const item of page.items) {
      const where = `${location} › ${item.id}`;
      if (!capabilities[item.capability]) { out.push(finding('CL-02', 'error', where, `Ismeretlen képesség: ${item.capability}.`)); continue; }
      if (!capabilities[item.capability].includes(item.variant)) out.push(finding('CL-02', 'error', where, `A(z) ${item.capability} képességnek nincs ${item.variant} változata.`));
      // A pótlóoldalon (PV-feedback-retry, v2 2.0.4) bármely képességű újrapróba-változat állhat.
      const retryVariant = page.variant === 'PV-feedback-retry' && block.pages.some(p => p.items.some(b => b.retry?.items?.some(v => v.id === item.id)));
      if (!capabilities[item.capability].includes(page.variant) && !(rules.v2.variantExceptions || []).includes(page.variant) && !retryVariant) out.push(finding('CL-02', 'error', where, `A(z) ${item.capability} képesség nem állhat ${page.variant} oldalon (v2 CAPABILITY_VARIANT).`));
      const allowed = responseByCapability[item.capability];
      if (allowed && !allowed.includes(item.response.type)) out.push(finding('CL-02', 'error', where, `A(z) ${item.capability} nem fogad ${item.response.type} válaszformát.`));
      const { solution, response, evaluation } = item;
      if (['single', 'multiple'].includes(response.type)) {
        if (solution.type !== 'choice') out.push(finding('CL-02', 'error', where, 'Választós itemhez opció-azonosítós kulcs (choice) kell.'));
        else {
          const ids = new Set(response.options.map(option => option.id));
          for (const id of solution.keyOptionIds) if (!ids.has(id)) out.push(finding('CL-02', 'error', where, `A kulcs nem létező opcióra mutat: ${id}.`));
          // A választáskorlát és a kulcs: pontozott itemnél a teljes kulcsot kell bejelölni, ezért a kulcs nem lehet
          // hosszabb a max-nál (a tanuló sosem érhetné el a helyes választ). Nem pontozott itemnél (formative /
          // not-scored) a kulcs az elfogadható opciók köre, abból elég max darab; de legalább min darab kell belőle.
          const { min = 1, max = Infinity } = response.type === 'multiple' ? response.selection ?? {} : {};
          const scored = !(evaluation.mode === 'formative' || ['formative-required', 'not-scored'].includes(evaluation.scoring));
          if (response.type === 'multiple' && scored && solution.keyOptionIds.length > max) out.push(finding('CL-02', 'error', where, `A pontozott többválasztós item kulcsa ${solution.keyOptionIds.length} opció, de a választáskorlát legfeljebb ${max}: a helyes válasz nem adható meg (tartalmi hiba).`));
          if (response.type === 'multiple' && scored && solution.keyOptionIds.length < min) out.push(finding('CL-02', 'error', where, `A többválasztós item kulcsa ${solution.keyOptionIds.length} opció, de legalább ${min} választás kell: a helyes válasz nem adható meg.`));
          // Nem pontozottnál a kulcs az elfogadható opciók köre, nem helyes válasz: a fordító kulcs nélküli (submission)
          // megoldást ad (szerződés 2.0.1, Áron 10-29), ezért ott a max-nál hosszabb kulcs rendben van.
        }
      }
      if (evaluation.mode === 'exact' && !['exact', 'choice', 'pairs', 'abx'].includes(solution.type)) out.push(finding('CL-02', 'error', where, 'Pontos (exact) értékeléshez pontos kulcs kell.'));
      if (response.type === 'order') {
        const ids = response.tokens.map(token => token.id);
        const isPermutation = order => order.length === ids.length && new Set(order).size === order.length && ids.every(id => order.includes(id));
        if (solution.type !== 'choice' || !isPermutation(solution.keyOptionIds)) out.push(finding('CL-02', 'error', where, 'Sorrendezős itemhez az összes token sorrendje kell kulcsként.'));
        // Több helyes szórend (Áron, 11-01, U11 p23): minden alternatíva a tokenek teljes permutációja, egyik sem
        // ismétlődik, és egyik sem azonos a kulccsal. A fordító a kulcs után a v2 answers-be teszi őket.
        else if (solution.alternativeOrders) {
          const seen = new Set([solution.keyOptionIds.join('\u0000')]);
          for (const [n, order] of solution.alternativeOrders.entries()) {
            const label = `${n + 1}. alternatív sorrend (${order.join(' ')})`;
            if (!isPermutation(order)) out.push(finding('CL-02', 'error', where, `A(z) ${label} nem a tokenek teljes permutációja: minden token pontosan egyszer kell.`));
            else if (seen.has(order.join('\u0000'))) out.push(finding('CL-02', 'error', where, `A(z) ${label} ismétlés: azonos a kulccsal vagy egy korábbi alternatívával.`));
            seen.add(order.join('\u0000'));
          }
        }
      } else if (solution.type === 'choice' && solution.alternativeOrders) out.push(finding('CL-02', 'error', where, `Alternatív sorrend (alternativeOrders) csak sorrendezős (order) itemnél adható meg, ez ${response.type}.`));
      if (response.type === 'pairs') {
        const left = response.left.map(option => option.id), right = new Set(response.right.map(option => option.id));
        const keyed = solution.type === 'pairs' ? solution.keyPairs.map(pair => pair.left) : [];
        if (solution.type !== 'pairs' || keyed.length !== left.length || left.some(id => !keyed.includes(id))) out.push(finding('CL-02', 'error', where, 'Párosításnál minden bal oldali elemhez pontosan egy kulcspár kell.'));
        else for (const pair of solution.keyPairs) if (!right.has(pair.right)) out.push(finding('CL-02', 'error', where, `A párosítás kulcsa nem létező jobb oldali elemre mutat: ${pair.right}.`));
      }
      if (response.type === 'abx') {
        const role = r => response.tokens.find(token => token.role === r);
        const [a, b, x] = ['A', 'B', 'X'].map(role);
        const declared = new Set((block.media ?? []).filter(m => m.kind === 'audio').map(m => m.id));
        if (!a || !b || !x || new Set(response.tokens.map(token => token.mediaRef)).size !== 3) out.push(finding('CL-02', 'error', where, 'ABX-hez A, B és X szerep kell, három külön hanggal.'));
        else {
          if (response.tokens.some(token => !declared.has(token.mediaRef))) out.push(finding('CL-02', 'error', where, 'Az ABX-token nem deklarált hangra mutat.'));
          if (new Set(response.tokens.map(token => token.speaker)).size !== 1) out.push(finding('CL-02', 'error', where, 'ABX-ben egy beszélő kell.'));
          if (a.category === b.category || ![a.category, b.category].includes(x.category)) out.push(finding('CL-02', 'error', where, 'ABX: A és B kategóriája különbözzön, X az egyikkel egyezzen.'));
          else if (solution.type !== 'abx' || solution.key !== (x.category === a.category ? 'A' : 'B')) out.push(finding('CL-02', 'error', where, 'Az ABX-kulcs nem egyezik X kategóriájával.'));
        }
      }
      if (response.type === 'correction') {
        for (const span of response.spans) if (span.start >= span.end || span.end > response.text.length) out.push(finding('CL-02', 'error', where, `Hibás javítási tartomány: ${span.id}.`));
        const keyed = solution.type === 'exact' && solution.key && typeof solution.key === 'object' ? Object.keys(solution.key) : [];
        if (response.spans.some(span => !keyed.includes(span.id)) || keyed.some(id => !response.spans.some(span => span.id === id))) out.push(finding('CL-02', 'error', where, 'Javításnál minden hibahelyhez (span) pontosan egy kulcs kell.'));
      }
      if (response.type === 'speech' && response.recordingMaxSeconds !== undefined && response.durationRange && response.recordingMaxSeconds < response.durationRange.max) out.push(finding('CL-02', 'error', where, `A felvételi határ (recordingMaxSeconds: ${response.recordingMaxSeconds}) rövidebb a beszédidő felső értékénél (durationRange.max: ${response.durationRange.max}).`));
      if (['writing', 'speech'].includes(response.type) && evaluation.mode === 'exact') out.push(finding('CL-02', 'error', where, 'Nyílt produkció nem értékelhető pontos egyezéssel.'));
    }
  }
  return out;
}

function answerIntegrityBlock(block) {
  const out = [];
  const transcripts = new Map((block.media ?? []).filter(media => media.transcript).map(media => [media.id, media.transcript]));
  for (const page of block.pages) for (const item of page.items) {
    const location = `${block.id} › ${page.id} › ${item.id}`;
    const { solution } = item;
    if (solution.type !== 'exact') continue;
    const keys = typeof solution.key === 'string' ? [solution.key] : Object.values(solution.key);
    const values = [...keys, ...solution.alternatives];
    // A hallott szöveg is adott: az item és az oldal hangjának átirata (diktálásnál a kulcs számai innen jönnek).
    const heard = [...(item.mediaRefs ?? []), ...page.content.map(stimulus => stimulus.mediaRef)].map(ref => transcripts.get(ref));
    const context = contextText([item.prompt, item.instruction, page.instruction, ...page.content.flatMap(stimulus => stimulus.type === 'model' ? [] : [stimulus.text, ...(stimulus.entries || [])]), ...heard]);
    out.push(...checkAcceptedStrings(location, values, { sentenceCheck: item.response.type === 'text', context, duplicateLists: [solution.alternatives] }));
  }
  return out;
}

// A változatok az alapitem után, vagy (retry.page) a megadott oldalon, az alapitemek blokkbeli sorrendjében.
export const withRetryVariants = block => {
  const moved = new Map();
  for (const page of block.pages) for (const item of page.items) if (item.retry?.page && item.retry.page !== page.id) moved.set(item.retry.page, [...(moved.get(item.retry.page) ?? []), ...item.retry.items]);
  const own = (item, page) => (item.retry?.page && item.retry.page !== page.id ? [] : item.retry?.items ?? []);
  return { ...block, pages: block.pages.map(page => ({ ...page, items: [...page.items.flatMap(item => [item, ...own(item, page)]), ...(moved.get(page.id) ?? [])] })) };
};

const sameSet = (a = [], b = []) => a.length === b.length && a.every(x => b.includes(x));
const CHAIN_MODES = ['mastery', 'resolved'];

// Újrapróba-lánc (retry) mesterszintű tesztben (mastery) vagy leckében támogatott zárással (resolved): CL-02.
function masteryBlock(block) {
  const out = [];
  const mode = block.completion?.mode, mastery = mode === 'mastery', resolved = mode === 'resolved';
  const base = block.pages.flatMap(page => page.items.map(item => ({ page, item })));
  const chains = base.filter(({ item }) => item.retry);
  const variants = chains.flatMap(({ page, item }) => item.retry.items.map(variant => ({ page, item, variant })));
  const pageIndex = new Map(block.pages.map((page, index) => [page.id, index]));
  if (mastery && block.kind !== 'assessment') out.push(finding('CL-02', 'error', block.id, 'A mesterszintű teljesítés (mastery) csak tesztblokkban lehet.'));
  if (resolved && block.kind !== 'lesson') out.push(finding('CL-02', 'error', block.id, 'A támogatott zárású teljesítés (resolved) csak leckeblokkban lehet.'));
  if (chains.length && !CHAIN_MODES.includes(mode)) out.push(finding('CL-02', 'error', block.id, 'Újrapróba-változat (retry) csak mesterszintű tesztben (completion.mode: mastery) vagy leckében támogatott zárással (completion.mode: resolved) lehet.'));
  const allIds = [...base.map(({ item }) => item.id), ...variants.map(({ variant }) => variant.id)];
  for (const id of new Set(allIds.filter((id, index) => allIds.indexOf(id) !== index))) out.push(finding('CL-02', 'error', `${block.id} › ${id}`, 'Az item- és változat-azonosítók legyenek egyediek.'));
  const closing = new Set();
  for (const { page, item } of chains) {
    const retry = item.retry, where = `${block.id} › ${page.id} › ${item.id} › retry`;
    const supported = retry.closure === 'supported';
    if (supported) for (const member of [item, ...retry.items]) closing.add(member.id);
    if (!retry.items.length && !supported) out.push(finding('CL-02', 'error', where, 'Változat nélküli retry csak támogatott zárással (closure: supported) lehet.'));
    if (supported && !resolved) out.push(finding('CL-02', 'error', where, 'Támogatott zárás (closure: supported) csak resolved teljesítésű leckében lehet.'));
    if (resolved && !supported) out.push(finding('CL-02', 'error', where, 'Resolved teljesítésnél minden újrapróba-lánc támogatott zárással végződjön (closure: supported), hogy a tanuló ne ragadjon be.'));
    if (retry.maxVariants !== undefined && !supported) out.push(finding('CL-02', 'error', where, 'A maxVariants csak támogatott zárásnál adható meg.'));
    if (supported && retry.items.length > (retry.maxVariants ?? 2)) out.push(finding('CL-02', 'error', where, `Legfeljebb ${retry.maxVariants ?? 2} változat lehet (maxVariants), itt ${retry.items.length} van.`));
    if (retry.page !== undefined) {
      if (!pageIndex.has(retry.page)) out.push(finding('CL-02', 'error', where, `A retry.page nem oldala ennek a blokknak: ${retry.page}.`));
      else if (pageIndex.get(retry.page) <= pageIndex.get(page.id)) out.push(finding('CL-02', 'error', where, `A retry.page az alapitem oldala után álljon: ${retry.page}.`));
    }
    const last = retry.items.at(-1) ?? item;
    if (supported && !last.feedback?.closure) out.push(finding('CL-02', 'error', `${where} › ${last.id}`, 'A lánc utolsó itemjén kötelező a feedback.closure (a támogatott zárás szövege).'));
  }
  for (const { page, item } of [...base, ...variants.map(({ page, variant }) => ({ page, item: variant }))]) {
    if (item.feedback?.closure && !closing.has(item.id)) out.push(finding('CL-02', 'error', `${block.id} › ${page.id} › ${item.id}`, 'feedback.closure csak támogatott zárású (closure: supported) újrapróba-láncban lehet.'));
  }
  for (const { page, item, variant } of variants) {
    const where = `${block.id} › ${page.id} › ${item.id} › retry › ${variant.id}`;
    if (variant.retry) out.push(finding('CL-02', 'error', where, 'Az újrapróba-változatnak nem lehet saját újrapróbája.'));
    if (variant.capability !== item.capability || variant.response?.type !== item.response?.type) out.push(finding('CL-02', 'error', where, 'A változat képessége és választípusa egyezzen az alapitemével.'));
    if (!sameSet(variant.targetRefs, item.targetRefs)) out.push(finding('CL-02', 'error', where, 'A változat ugyanarra a célra (targetRefs) mérjen, mint az alapitem.'));
    if (variant.evaluation?.mode === 'formative' || item.evaluation?.mode === 'formative') out.push(finding('CL-02', 'error', where, 'Újrapróba csak pontozott itemnél és pontozott változattal lehet.'));
    if (block.completion?.requiredRefs?.includes(variant.id)) out.push(finding('CL-02', 'error', where, 'Az újrapróba-változat nem lehet kötelező (requiredRefs).'));
  }
  if (CHAIN_MODES.includes(mode)) {
    const label = mastery ? 'Mesterszintnél' : 'Resolved teljesítésnél';
    const scored = base.filter(({ item }) => item.evaluation?.mode !== 'formative').map(({ item }) => item.id);
    for (const id of scored) if (!block.completion.requiredRefs.includes(id)) out.push(finding('CL-02', 'error', `${block.id} › ${id}`, `${label} minden pontozott alapitem kötelező (requiredRefs).`));
    for (const ref of block.completion.requiredRefs) if (!base.some(({ item }) => item.id === ref)) out.push(finding('CL-02', 'error', `${block.id} › ${ref}`, `${label} a requiredRefs csak alapitemre mutathat.`));
  }
  return out;
}

// Választható út (paths) és oldal-láthatóság (visibleAfter): CL-02.
function pathsBlock(block) {
  const out = [], paths = block.paths;
  const expanded = withRetryVariants(block);
  const pageIndex = new Map(block.pages.map((page, index) => [page.id, index]));
  const itemPage = new Map(expanded.pages.flatMap(page => page.items.map(item => [item.id, page.id])));
  // A visibleAfter egy item vagy (11-13 óta) egy oldal azonosítója ebben a blokkban; oldalnál az oldal láncai lezárultak.
  for (const page of block.pages) if (page.visibleAfter && !itemPage.has(page.visibleAfter) && !pageIndex.has(page.visibleAfter)) out.push(finding('CL-02', 'error', `${block.id} › ${page.id}`, `A visibleAfter nem létező itemre vagy oldalra mutat ebben a blokkban: ${page.visibleAfter}.`));
  if (!paths) return out;
  const where = `${block.id} › paths`;
  const choiceAt = pageIndex.get(paths.choicePage);
  if (choiceAt === undefined) out.push(finding('CL-02', 'error', where, `A choicePage nem oldala ennek a blokknak: ${paths.choicePage}.`));
  const ids = paths.options.map(option => option.id);
  if (new Set(ids).size !== ids.length) out.push(finding('CL-02', 'error', where, 'Az utak azonosítói legyenek egyediek.'));
  const owner = new Map();
  for (const option of paths.options) for (const ref of option.pages) {
    const at = `${where} › ${option.id}`;
    if (!pageIndex.has(ref)) out.push(finding('CL-02', 'error', at, `Az út oldala nem oldala ennek a blokknak: ${ref}.`));
    else if (choiceAt !== undefined && pageIndex.get(ref) <= choiceAt) out.push(finding('CL-02', 'error', at, `Az út oldalai a választóoldal után álljanak: ${ref}.`));
    if (owner.has(ref)) out.push(finding('CL-02', 'error', at, `Egy oldal csak egy úthoz tartozhat: ${ref}.`));
    owner.set(ref, option.id);
  }
  const pathOfPage = id => owner.get(id) ?? null;
  const pathOfItem = id => pathOfPage(itemPage.get(id));
  const required = block.completion?.requiredRefs ?? [];
  const counts = paths.options.map(option => required.filter(ref => pathOfItem(ref) === option.id).length);
  paths.options.forEach((option, k) => { if (!counts[k]) out.push(finding('CL-02', 'error', `${where} › ${option.id}`, 'Az útnak nincs saját kötelező iteme (requiredRefs): a teljesítés nem lenne egyenértékű.')); });
  if (new Set(counts).size > 1) out.push(finding('CL-02', 'warning', where, `Az utak kötelező itemszáma eltér (${paths.options.map((o, k) => `${o.id}: ${counts[k]}`).join(', ')}); ellenőrizd, hogy a teljesítés egyenértékű-e.`));
  // Kereszthivatkozás csak a saját útra vagy közös oldalra mutathat.
  const cross = (from, to) => { const target = to; return target !== null && target !== from; };
  for (const page of expanded.pages) for (const item of page.items) {
    const own = pathOfPage(page.id), at = `${block.id} › ${page.id} › ${item.id}`;
    for (const variant of item.retry?.items ?? []) if (cross(own, pathOfItem(variant.id))) out.push(finding('CL-02', 'error', `${at} › retry › ${variant.id}`, 'Az újrapróba-változat az alapitem útján vagy közös oldalon álljon.'));
    if (item.recallFrom && cross(own, pathOfItem(item.recallFrom))) out.push(finding('CL-02', 'error', at, `A recallFrom másik út itemjére mutat: ${item.recallFrom}.`));
  }
  for (const page of block.pages) if (page.visibleAfter && cross(pathOfPage(page.id), pageIndex.has(page.visibleAfter) ? pathOfPage(page.visibleAfter) : pathOfItem(page.visibleAfter))) out.push(finding('CL-02', 'error', `${block.id} › ${page.id}`, `A visibleAfter másik út oldalára vagy itemjére mutat: ${page.visibleAfter}.`));
  return out;
}

// t27Pending: a blokk a heti terv `t27Pending` listáján áll (a T27 nyelvi köre még hátravan); ilyenkor a CL-27
// magyar-szöveg és azonos-lista hibái figyelmeztetések. A CEO-lánc és a CLI szigorú (alapértelmezés: false).
export function runBlockGates(block, { handoffsDir, rules, schema, chain: givenChain, t27Pending = false }) {
  const schemaErrors = validateSchema(schema, block);
  if (schemaErrors.length) {
    return schemaErrors.map(error => finding('SCHEMA', 'error', `${block?.id || '?'}${error.path || ''}`, error.message));
  }
  const findings = [];
  const chain = givenChain ?? loadReviewChain(handoffsDir, block.id);
  findings.push(...chainProblems(block.id, chain));
  const strings = blockStrings(block);
  if (chain.found) {
    const { review, ...content } = block;
    findings.push(...checkBinding(block.id, review, chain, canonicalHash(content), 'review'));
    const chainFiles = new Set(chain.files.map(file => file.file));
    const refs = [];
    const walk = (value, path) => {
      if (Array.isArray(value)) value.forEach((entry, index) => walk(entry, `${path}[${index}]`));
      else if (value && typeof value === 'object') {
        if (value.manuscriptRef) refs.push({ path, ref: value.manuscriptRef });
        for (const [key, entry] of Object.entries(value)) if (key !== 'manuscriptRef') walk(entry, path ? `${path}.${key}` : key);
      }
    };
    walk(block, '');
    for (const { path, ref } of refs) {
      const file = chain.files.find(entry => entry.file === ref.file);
      if (!chainFiles.has(ref.file)) findings.push(finding('CL-01', 'error', `${block.id} › ${path}`, `A forrás-hivatkozás nem a review-zott láncra mutat: ${ref.file}.`, { gate: 'binding' }));
      else if (!normalizeText(file.text).includes(normalizeText(ref.anchor))) findings.push(finding('CL-01', 'error', `${block.id} › ${path}`, `A hivatkozott szakasz nincs meg a kéziratban: „${ref.anchor}”.`, { gate: 'binding' }));
    }
    findings.push(...checkFidelity(strings, chain));
    // A választható út szakaszcímsora (pl. „## w01-u-5-4-alt-v1”) lefedett, ha az út azonosítója ugyanez (paths.options[].id).
    const ids = new Set([block.id, ...(block.paths?.options ?? []).map(option => `${block.id}-${option.id}`)]);
    // Az újrapróba-változat (…-iNNN-r1) lefedett, ha az alapitem retry mezőjében szerepel.
    for (const page of block.pages) { ids.add(page.id); for (const item of page.items) { ids.add(item.id); for (const variant of item.retry?.items ?? []) ids.add(variant.id); } for (const stimulus of page.content) if (stimulus.id) ids.add(stimulus.id); }
    findings.push(...checkCoverage(block.id, ids, chain));
  }
  // Az újrapróba-változatok (retry) ugyanazokon a kapukon mennek át, mint az alapitem, ugyanazon az oldalon.
  const expanded = withRetryVariants(block);
  findings.push(...playabilityBlock(expanded, rules));
  findings.push(...answerIntegrityBlock(expanded));
  findings.push(...briefComplianceBlock(expanded));
  findings.push(...masteryBlock(block));
  findings.push(...pathsBlock(block));
  findings.push(...metaTokens(strings));
  findings.push(...frenchLifeBlock(block, { pending: t27Pending, strings }));
  findings.push(...contextGlossesBlock(block));
  return dedupe(findings);
}

export function dedupe(findings) {
  const seen = new Set();
  return findings.filter(entry => {
    const key = `${entry.cl}\u0000${entry.severity}\u0000${entry.location}\u0000${entry.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function summarize(findings) {
  const byCl = {};
  for (const entry of findings) {
    byCl[entry.cl] ??= { errors: 0, warnings: 0 };
    byCl[entry.cl][entry.severity === 'error' ? 'errors' : 'warnings'] += 1;
  }
  const errors = findings.filter(entry => entry.severity === 'error').length;
  return { verdict: errors ? 'GATE_FAIL' : 'GATE_PASS', errors, warnings: findings.length - errors, byCl };
}
