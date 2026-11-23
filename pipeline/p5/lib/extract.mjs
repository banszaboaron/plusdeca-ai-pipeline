// Tanulói szövegek kinyerése helyjelöléssel, a v1.1 heti csomagból és a P5
// blokkforrásból. A hűségkapu, a meta-token kapu és a review-kötés ugyanezt a
// listát használja, így a három kapu ugyanazt tekinti „tanulói szövegnek”.

// v1.1: ezek a mezők nem tanulói szövegek (azonosítók, technikai adatok,
// szerkesztői megjegyzések, hibás minták), ezért kimaradnak.
const V1_SKIP_KEYS = new Set([
  'id', 'type', 'kind', 'checksum', 'targetIds', 'targets', 'masteryScope', 'status', 'entryId', 'sourceNumber',
  'runtimeEnabled', 'direction', 'responseLanguage', 'normalization', 'sourceRef', 'sourceItemRef', 'activity',
  'recognitionTargetId', 'sourceIds', 'requiresAudio', 'responseMode', 'evaluationKind', 'privacy', 'optionsLanguage',
  'openResponseContract', 'sourceTrace', 'editorialContractMarkdown', 'editorialClarification', 'evidence',
  'primaryOptionId', 'acceptedOptionIds', 'choiceEvaluatorId', 'gender', 'stimulusMode', 'answerSnapshot', 'rejected',
  'pageNumber', 'paragraphNumbers', 'count', 'seconds', 'words', 'wordCount', 'maxSelections', 'required',
  'requiredTyped', 'requiredListening', 'requiredSpoken', 'requiredOverall', 'countedTowardWeeklyWriting',
  'independentWordCountRequired', 'routes', 'mode', 'requiredSubitemIds', 'delayMin', 'delayMax', 'trigger',
  'src', 'uri', 'url', 'mediaRef', 'audioId', 'file', 'path', 'mime', 'durationSeconds', 'value_id', 'optionId',
  'conditionalAlternatives', 'erroneousSpans', 'expectedSelections', 'requiredSelections', 'useEachExactlyOnce',
  'useEachAtMostOnce', 'typoAccepted', 'retry', 'code', 'provenance', 'partOfSpeech', 'misconceptionBasis', 'rule',
  'lexicalBurden', 'target', 'rubric'
]);
// Azonosító- és hivatkozásmezők (…Id, …Ref, …Version, …Code): nem tanulói szöveg.
const V1_SKIP_SUFFIX = /(?:Id|Ids|Ref|Refs|Version|Code)$/u;

// A kulcsban álló puszta opció-azonosító (pl. w01-test-…-opt-x) hivatkozás, nem szöveg.
const ID_VALUE = /^[a-z0-9]+(?:-[a-z0-9]+)+$/u;

function collect(value, path, out, skip, suffix = null) {
  if (typeof value === 'string') {
    if (value.trim() && !(/(?:^|\.)answer\./u.test(path) && ID_VALUE.test(value) && /\d/u.test(value))) out.push({ path, text: value });
    return;
  }
  if (Array.isArray(value)) { value.forEach((entry, index) => collect(entry, `${path}[${index}]`, out, skip, suffix)); return; }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      const next = path ? `${path}.${key}` : key;
      // A hangobjektumból csak az átirat tanulói szöveg.
      if (key === 'audio' && entry && typeof entry === 'object') { if (typeof entry.transcript === 'string') out.push({ path: `${next}.transcript`, text: entry.transcript }); continue; }
      if (!skip.has(key) && !(suffix && suffix.test(key))) collect(entry, next, out, skip, suffix);
    }
  }
}

function itemStrings(item, out, base) {
  const local = [];
  collect(item, '', local, V1_SKIP_KEYS, V1_SKIP_SUFFIX);
  // A retry.prompt a tanulónak megjelenik (késleltetett újrapróba).
  if (typeof item.retry?.prompt === 'string') local.push({ path: 'retry.prompt', text: item.retry.prompt });
  for (const entry of local) out.push({ ...base, item: item.id, field: entry.path, text: entry.text });
}

export function v1EntityStrings(entity) {
  const out = [];
  const unit = entity.id;
  if (entity.title) out.push({ unit, field: 'title', text: entity.title });
  for (const page of entity.pages || []) {
    const base = { unit, page: page.id };
    if (page.title) out.push({ ...base, field: 'title', text: page.title });
    if (page.instruction) out.push({ ...base, field: 'instruction', text: page.instruction });
    (page.blocks || []).forEach((block, index) => {
      const local = [];
      collect(block, '', local, V1_SKIP_KEYS, V1_SKIP_SUFFIX);
      for (const entry of local) out.push({ ...base, block: `${block.kind || 'block'}#${index}`, field: entry.path, text: entry.text });
    });
    for (const item of page.items || []) {
      itemStrings(item, out, base);
    }
  }
  // Tesztek: oldal nélküli tételek és forrásszöveg.
  if (!entity.pages) {
    if (typeof entity.sourceText === 'string') out.push({ unit, field: 'sourceText', text: entity.sourceText });
    else if (entity.sourceText) {
      const local = []; collect(entity.sourceText, 'sourceText', local, V1_SKIP_KEYS, V1_SKIP_SUFFIX);
      for (const entry of local) out.push({ unit, field: entry.path, text: entry.text });
    }
    for (const item of entity.items || []) itemStrings(item, out, { unit });
  }
  return out;
}

export function v1VocabularyStrings(vocabulary) {
  const out = [];
  for (const entry of vocabulary || []) {
    const local = [];
    collect({ fr: entry.fr, hu: entry.hu, acceptedTranslations: entry.acceptedTranslations, example: entry.example }, '', local, V1_SKIP_KEYS, V1_SKIP_SUFFIX);
    for (const string of local) out.push({ unit: 'vocabulary', item: entry.id, field: string.path, text: string.text });
  }
  return out;
}

// P5 blokk: minden szöveges mező, kivéve az azonosítókat, enumokat és hash-eket.
const BLOCK_SKIP_KEYS = new Set([
  'schemaVersion', 'contractVersion', 'id', 'kind', 'type', 'review', 'manuscriptRef', 'template', 'variant',
  'capability', 'language', 'role', 'register', 'lines', 'mode', 'scoring', 'targetRefs', 'sourceRefs',
  'taughtTargetRefs', 'prerequisites', 'requiredRefs', 'keyOptionIds', 'alternativeOrders', 'keyPairs', 'feedbackRef', 'visibleAfter', 'recallFrom',
  'readOnlyPreviousRef', 'reveal', 'mediaRef', 'mediaRefs', 'speaker', 'category', 'window', 'position', 'week', 'modality', 'assistance', 'file', 'uri', 'access', 'duration'
]);

// Szerkesztői (nem tanulói) mezők a blokkban: hűségkapu igen, meta-token kapu nem.
const BLOCK_EDITORIAL = /(?:^|\.)(?:keyDescription|requiredContent|notSufficient)(?:\[|$)|rejected\[\d+\]\.reason$/u;

export function blockStrings(block) {
  const out = [];
  const add = (base, value, field) => {
    const local = [];
    collect(value, field, local, BLOCK_SKIP_KEYS);
    for (const entry of local) out.push({ ...base, field: entry.path, text: entry.text, editorial: BLOCK_EDITORIAL.test(entry.path) });
  };
  const unit = block.id;
  add({ unit }, block.title, 'title');
  if (block.brief) add({ unit }, block.brief, 'brief');
  // Választható út: a gombfeliratok tanulói szövegek.
  for (const option of block.paths?.options ?? []) add({ unit, block: `paths › ${option.id}` }, option.label, 'label');
  for (const page of block.pages || []) {
    const base = { unit, page: page.id };
    add(base, page.title, 'title');
    if (page.instruction) add(base, page.instruction, 'instruction');
    (page.content || []).forEach((stimulus, index) => add({ ...base, block: `${stimulus.type}#${index}` }, stimulus, ''));
    for (const item of page.items || []) {
      // A retry.page (oldal-ID) és a retry.closure ("supported") nem szöveg; a feedback.closure igen.
      const { id, ...rest } = item.retry ? { ...item, retry: { ...item.retry, page: undefined, closure: undefined } } : item;
      add({ ...base, item: id }, rest, '');
    }
  }
  return out;
}

export function formatLocation(entry) {
  return [entry.unit, entry.page, entry.block, entry.item, entry.field].filter(Boolean).join(' › ');
}
