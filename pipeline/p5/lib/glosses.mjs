// CL-23: koppintásos jelentés (S23, T16; PRESIDENT 2026-11-15). A `glosses` tömb a francia szöveget hordozó tartalmi
// elemen (text, list, table, model) és az itemen áll; elemenként { surface, lemma, meaning, note? }.
//   - a surface betű szerint (NFC) szerepeljen az elem saját szövegében → különben hiba;
//   - ugyanaz a surface kétszer ugyanazon az elemen → figyelmeztetés;
//   - francia tartalmi elem glossza nélkül → blokkonként egy összesítő figyelmeztetés (a kitöltés egységenként halad).
// A jelentés és a megjegyzés tanulói szöveg: a hűségkapu (CL-01) a review-zott kéziratban keresi, mint minden mást.

const finding = (severity, location, message, extra = {}) => ({ cl: 'CL-23', severity, location, message, ...extra });
const nfc = value => String(value ?? '').normalize('NFC');
const cellText = cell => (typeof cell === 'string' ? cell : cell?.text ?? '');

function stimulusTexts(stimulus) {
  if (stimulus.type === 'text' || stimulus.type === 'model') return [stimulus.text, stimulus.title];
  if (stimulus.type === 'list') return [...(stimulus.entries ?? []), stimulus.title];
  if (stimulus.type === 'table') return [...(stimulus.columns ?? []), ...(stimulus.rows ?? []).flat(), stimulus.title].map(cellText);
  return [];
}

function itemTexts(item) {
  const r = item.response ?? {};
  return [
    item.prompt, item.instruction, item.audio?.transcript,
    ...(r.options ?? []).map(o => o.label), ...(r.fields ?? []).map(f => f.label), ...(r.bank ?? []).map(o => o.label),
    ...(r.left ?? []).map(o => o?.label ?? o), ...(r.right ?? []).map(o => o?.label ?? o), ...(r.tokens ?? []).map(t => t?.label ?? ''), r.text,
  ].filter(text => typeof text === 'string');
}

function checkGlosses(location, glosses, texts) {
  const out = [];
  const haystack = texts.map(nfc).join('\n');
  const seen = new Set();
  for (const gloss of glosses ?? []) {
    const surface = nfc(gloss.surface);
    if (!haystack.includes(surface)) out.push(finding('error', location, `A glossza felszíni alakja nincs meg betű szerint az elem szövegében: „${gloss.surface}”.`, { text: gloss.surface }));
    if (seen.has(surface)) out.push(finding('warning', location, `Ismétlődő glossza ugyanazon az elemen: „${gloss.surface}”.`));
    seen.add(surface);
  }
  return out;
}

export function contextGlossesBlock(block) {
  const out = [];
  let frenchTexts = 0, glossed = 0;
  for (const page of block.pages ?? []) {
    (page.content ?? []).forEach((stimulus, index) => {
      const where = `${block.id} › ${page.id} › ${stimulus.type}#${index}`;
      if (stimulus.glosses) out.push(...checkGlosses(where, stimulus.glosses, stimulusTexts(stimulus)));
      if (stimulus.language === 'fr' && ['text', 'list', 'table', 'model'].includes(stimulus.type)) {
        frenchTexts += 1;
        if (stimulus.glosses?.length) glossed += 1;
      }
    });
    for (const item of page.items ?? []) {
      for (const variant of [item, ...(item.retry?.items ?? [])]) {
        if (variant.glosses) out.push(...checkGlosses(`${block.id} › ${page.id} › ${variant.id}`, variant.glosses, itemTexts(variant)));
      }
    }
  }
  if (frenchTexts > glossed) out.push(finding('warning', block.id, `${frenchTexts - glossed}/${frenchTexts} francia tartalmi elemnek nincs koppintásos jelentése (glosses, S23).`));
  return out;
}
