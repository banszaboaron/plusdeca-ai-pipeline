// Elakadások és leállások érthető magyarázata (Áron kérése, 2026-10-28): ugyanaz a szöveg megy e-mailben és
// jelenik meg az irányítópulton. Minden magyarázat: mi történt, miért állt meg, mi a teendőd, hogyan folytatódik,
// és a részletek (melyik lépés, mit írt az ellenőr). A válasz helye (answerStep) az a döntési fájl, amelyet a CEO a
// folytatáskor ténylegesen elolvas.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const REVIEWER_HU = {
  PE: 'a szakmai ellenőr (PE)', NavE: 'a követelmény-ellenőr (NavE)', NyE: 'a nyelvhelyesség-ellenőr (NyE)', HE: 'a helyesírás-ellenőr (HE)',
  UE: 'a tanulói végigjárás (UE)', SOLVER: 'a független megoldó', MEGOLDASIRO: 'a megoldásíró',
};
const reviewerHu = name => REVIEWER_HU[name] ?? name;

async function readStep(runDir, step) {
  if (!runDir || !step) return null;
  for (const ext of ['egyesitett.md', 'out.md']) {
    try { return await readFile(join(runDir, 'steps', `${step}.${ext}`), 'utf8'); } catch { /* nincs */ }
  }
  return null;
}

/** Egy ellenőri kimenet lényege: a findingok vagy a hiányt leíró rész, legfeljebb `max` karakter. */
export function excerpt(text, max = 1200) {
  const body = String(text ?? '').split(/^GEPI_OSSZEGZES\s*$/m)[0];
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex(l => /^#{1,4}\s.*(finding|nem vizsgált|hiány|bizonyíték|probléma|blokkol|összegzés)/i.test(l));
  let out = (start >= 0 ? lines.slice(start) : lines).join('\n').trim();
  if (out.length > max) out = `${out.slice(0, max).trimEnd()} …`;
  return out;
}

const lowerUnit = checks => String(checks.unit ?? '').toLowerCase();

/**
 * A magyarázat. info: { outcome, pipeline, runDir, checks, resumeCommand }.
 * Eredmény: { title, summary, what, why, todo: [..], continueHow, answerStep, details: [{ label, text }] }.
 */
export async function explainProblem({ outcome, pipeline, runDir, checks = {}, resumeCommand }) {
  const step = checks.step ?? null;
  const where = [checks.unit ? `${checks.unit} egység` : null, checks.phase ? `${checks.phase} fázis` : null, step ? `${step} lépés` : null].filter(Boolean).join(', ');
  const details = [];
  const restart = resumeCommand
    ? `A CEO leállt. A folytatáshoz a gépen, a plusdeca-ceo munkafa editorial/p4-planning/ceo mappájában ezt kell futtatni (vagy szólj a tartalmi sávnak, hogy futtassa): ${resumeCommand}. A kész lépéseket nem futtatja újra.`
    : 'A CEO leállt; a folytatáshoz újra kell indítani ugyanazzal a futásmappával.';
  let e;
  switch (true) {
    case outcome === 'BLOCKED_DECISION': {
      e = {
        title: 'Döntésedre vár',
        summary: `A(z) ${step ?? 'egyik'} lépés szerzője olyan kérdésbe ütközött, amelyet csak te dönthetsz el.`,
        what: `A szerző nem találgatott, hanem megállt, és leírta a kérdést, a lehetőségeket és a következményeiket.`,
        why: 'A megbízás ellentmondásos, hiányzik egy bemenet, vagy egy tantervi célt kellene módosítani. Ezt a szerepek nem dönthetik el helyetted.',
        todo: ['Olvasd el a kérdést (lent).', 'Írd meg a döntésedet a válaszmezőbe vagy a döntési fájlba: elég röviden, pl. „B változat, mert…”.'],
        continueHow: `Ha a CEO még vár, a válaszod után magától folytatja. Ha már leállt (lejárt a várakozás), ${restart}`,
        answerStep: step,
      };
      if (checks.question) details.push({ label: 'A kérdés', text: String(checks.question) });
      break;
    }
    case outcome === 'BLOCKED_ACCESS': {
      e = {
        title: 'Egy szerep forráshoz kér segítséget',
        summary: `A(z) ${step ?? 'egyik'} lépés egy forrást nem ért el (fizetős, bejelentkezést kér, könyv vagy hanganyag), és a saját keresése nem hozott használhatót.`,
        what: 'A lánc nem áll meg: a szerep a tartaléktervével dolgozik tovább, de a válaszod a megérkezése utáni minden hívásba bekerül.',
        why: 'A szerepek csak nyilvános, gépileg elérhető forrásokat tudnak olvasni.',
        todo: ['Ha meg tudod szerezni, írd be a válaszmezőbe a kért szöveget, vagy egy sorban: FAJL: <útvonal a repóban, .md/.txt>.', 'Ha nem fontos, írd: „használd a tartaléktervet”.'],
        continueHow: 'Nem kell újraindítani semmit.',
        answerStep: step,
      };
      if (checks.question) details.push({ label: 'A kérés', text: String(checks.question) });
      break;
    }
    case outcome === 'BLOCKED_EVIDENCE': {
      const text = await readStep(runDir, step);
      e = {
        title: 'Egy ellenőr nem tudta elvégezni az ellenőrzést',
        summary: `A(z) ${step ?? 'egyik'} ellenőrzés BLOCKED_EVIDENCE eredményt adott: hiányzik valami, ami nélkül nem tud felelősen ítélni.`,
        what: `${where ? `Hol: ${where}. ` : ''}Az ellenőr nem azt mondta, hogy rossz az anyag, hanem hogy egy bemenet (pl. forrás, korábbi döntés, referencia, a tanulói nézet egy része) hiányzik vagy ellentmondásos.`,
        why: 'Bizonyíték nélküli jóváhagyás nem mehet tovább, ezért a CEO megállította a láncot.',
        todo: ['Olvasd el lent, mit hiányol az ellenőr.', 'Írd meg a válaszmezőbe: pótlod-e (és honnan), vagy az ellenőr nélküle döntsön, vagy a hiányzó részt hagyjuk ki.'],
        continueHow: `${restart} A válaszodat a folytatás előtt a tartalmi sávnak (vagy a CEO-t indítónak) kell a megfelelő helyre tennie; magától ezt a választ a lánc nem olvassa be.`,
        answerStep: 'folytatas',
      };
      if (text) details.push({ label: `Mit írt az ellenőr (${step})`, text: excerpt(text) });
      break;
    }
    case outcome === 'BLOCKED_DECISION_MAX_ROUNDS': {
      const open = checks.open ?? [];
      const javitas = /^javitas/.test(String(pipeline)) && checks.unit;
      const n = (checks.escalations?.length ?? 0) + 1;
      // Fázisdöntés (lib/javitas.mjs, decided): a terv/kézirat/megoldás fázis a decisions/<egység>-<fázis>-dontes.md
      // fájlból folytatódik; ott az „ELFOGADVA: <ellenőr>” sor a nyitott jelzést új kör nélkül lezárja.
      const phaseFile = javitas && String(checks.decisionFile ?? '').match(/([^\\/]+-dontes)\.md$/)?.[1];
      const names = open.map(o => o.reviewer).filter(Boolean);
      const acceptLine = `ELFOGADVA: ${names.length ? names.join(', ') : '<ellenőr>'}`;
      e = {
        title: 'Elfogytak a javítási körök',
        summary: `${where ? `${where}: ` : ''}a szerző a megengedett javítási körök után sem tudta minden ellenőr kifogását rendezni${open.length ? ` (nyitva: ${open.map(o => o.reviewer).join(', ')})` : ''}.`,
        what: 'A szerző és az ellenőrök körbe jártak: ugyanarra a hibára legfeljebb két (a PE-nél négy) javítási kör jár, utána a döntés a tiéd.',
        why: 'A végtelen javítgatás helyett a CEO megáll, mert vagy a kifogás vitatható, vagy a feladatot másképp kell megfogni.',
        todo: phaseFile ? [
          'Nézd meg lent a nyitott kifogásokat.',
          `Ha a mostani változat így jó, és a kifogás maradhat nyitva (pl. egy tanár által jóváhagyott, változatlanul maradó utasításra szól): írd a válaszba külön sorba: „${acceptLine}” (csak azokat az ellenőröket, akiknek a jelzését elfogadod).`,
          'Ha változtatni kell: írd le konkrétan, mit változtasson a szerző (melyik item, mi legyen), vagy hogy írja újra más helyzetből.',
          'A kettő együtt is mehet: egyes ellenőrök jelzését elfogadod, a többire utasítást adsz.',
        ] : [
          'Nézd meg lent a nyitott kifogásokat.',
          'Dönts: (a) a mostani változat elfogadható, a kifogás maradhat nyitva; (b) konkrétan mit változtasson a szerző; vagy (c) írja újra más helyzetből.',
          'Írd a döntést a válaszmezőbe, minél konkrétabban (melyik item, mi legyen).',
        ],
        continueHow: phaseFile
          ? `A válaszod ebbe a döntési fájlba kerül: ${phaseFile}.md. Ha benne az „ELFOGADVA:” sor minden nyitott ellenőrt megnevez, a fázis új kör nélkül lezárul, és a lánc a következő fázissal megy tovább. Különben a szerző egy további kört kap a döntéseddel és a nyitott jelentésekkel (ez az elsődleges utasítás), az ellenőrök pedig ezt újranézik. ${restart}`
          : javitas
          ? `A válaszod ebbe a döntési fájlba kerül: ${lowerUnit(checks)}-eszkalacio${n}.md. A javítás mód a folytatáskor ezt elsődleges utasításként adja a szerzőnek és az ellenőröknek. ${restart}`
          : `${restart} A döntést a folytatás előtt a futásmappa döntési fájljába kell tenni.`,
        answerStep: phaseFile || (javitas ? `${lowerUnit(checks)}-eszkalacio${n}` : 'folytatas'),
      };
      for (const o of open.slice(0, 5)) {
        const counts = o.summary ? Object.entries(o.summary).filter(([k]) => k !== 'verdict').map(([k, v]) => `${k}: ${v}`).join(', ') : '';
        const list = (o.findings ?? []).slice(0, 4).map(f => `- [${f.severity ?? ''}${f.probe ? `, ${f.probe}` : ''}] ${f.location ? `${f.location}: ` : ''}${f.text ?? f.id}`).join('\n');
        const text = list || excerpt(await readStep(runDir, o.step), 900);
        details.push({ label: `${reviewerHu(o.reviewer)} — ${o.summary?.verdict ?? 'nyitott'}${counts ? ` (${counts})` : ''}`, text: text || '(a kimenete nem érhető el; lásd a futásmappa steps/ fájljait)' });
      }
      if (checks.note) details.push({ label: 'Megjegyzés', text: String(checks.note) });
      break;
    }
    case /^BLOCKED_UNPARSEABLE/.test(outcome): {
      const who = outcome.endsWith('SOLVER') ? 'a független megoldó' : outcome.endsWith('AUTHOR') ? 'a szerző' : 'egy ellenőr';
      e = {
        title: 'Egy válasz nem értelmezhető gépileg',
        summary: `${who[0].toUpperCase()}${who.slice(1)} válaszából hiányzik a kötelező gépi összegzés, ezért a CEO nem tudja, átment-e.`,
        what: `${where ? `Hol: ${where}. ` : ''}Ez technikai hiba (a modell levágta vagy elhagyta a végét), nem tartalmi döntés.`,
        why: 'A CEO csak a gépi összegzésből dönt a továbblépésről; találgatni nem fog.',
        todo: ['Teendőd általában nincs: szólj a tartalmi sávnak, hogy a lépést futtassa újra (--ujrafuttat <lépés>).'],
        continueHow: restart,
        answerStep: 'folytatas',
      };
      const text = await readStep(runDir, step);
      if (text) details.push({ label: `A válasz vége (${step})`, text: String(text).slice(-800) });
      break;
    }
    case outcome === 'BLOCKED_INCOMPLETE_AUTHOR':
    case outcome === 'BLOCKED_INCOMPLETE_SOLUTION': {
      e = {
        title: 'A szerző nem adta le a teljes anyagot',
        summary: `${where ? `${where}: ` : ''}a leadásból részek hiányoznak, vagy csak a változást tartalmazza (különbözeti leadás), és a teljes újraleadás sem pótolta.`,
        what: 'Hiányos megoldásból a P5 hűségkapuja nem tud blokkot építeni (U31, 11-04: 419 CL-01), ezért a lánc nem engedi tovább.',
        why: 'A végső megoldas.md csak teljes, review-zott leadás lehet.',
        todo: ['Teendőd általában nincs: a tartalmi sáv a lépést újrafuttatja (--ujrafuttat <lépés>), vagy kézzel jelzi a szerzőnek a hiányt.'],
        continueHow: restart,
        answerStep: 'folytatas',
      };
      const missing = checks.missing ?? (checks.examples ? checks.examples.map(t => `„${t}”`) : []);
      if (missing.length) details.push({ label: checks.dropped ? `Kimaradt tanulói szövegek (${checks.dropped} db, pl.)` : 'Ami hiányzik', text: missing.slice(0, 5).map(m => `- ${m}`).join('\n') });
      break;
    }
    case outcome === 'BLOCKED_P5_GATE': {
      const errs = (checks.errors ?? checks.findings ?? []).slice(0, 8);
      e = {
        title: 'A kész blokk nem ment át az app gépi kapuján (P5)',
        summary: `${where ? `${where}: ` : ''}a tartalom elkészült és átment az ellenőrökön, de az appba építés gépi ellenőrzése hibát talált.`,
        what: 'Ez szerkezeti hiba (pl. hiányzó mező, rossz azonosító, nem egyező kulcs), a javítókörök után is maradt.',
        why: 'Hibás blokk nem kerülhet az appba.',
        todo: ['Teendőd általában nincs: szólj a tartalmi vagy az app sávnak a lenti hibákkal.'],
        continueHow: restart,
        answerStep: 'folytatas',
      };
      if (errs.length) details.push({ label: 'A kapu hibái', text: errs.map(f => `- ${f.code ?? f.rule ?? ''} ${f.message ?? f.text ?? JSON.stringify(f)}`).join('\n') });
      break;
    }
    case outcome === 'BLOCKED_WALKTHROUGH':
    case outcome === 'BLOCKED_SOLVER_FINDINGS':
    case outcome === 'BLOCKED_SOLVER_REVIEW':
    case outcome === 'BLOCKED_DECISION_REVIEW': {
      const text = await readStep(runDir, step);
      e = {
        title: outcome === 'BLOCKED_WALKTHROUGH' ? 'A tanulói végigjárás hibát talált' : 'A független megoldó problémái megmaradtak',
        summary: `${where ? `${where}: ` : ''}a javítás után is maradt olyan probléma, amelyet a tanuló szemszögéből ellenőrző szerep nem fogad el.`,
        what: 'Tipikusan: egy feladat nem egyértelmű, több helyes válasz is lehet, vagy a kulcs nem egyezik a szöveggel.',
        why: 'Ilyen hibával a feladat a tanulónak félrevezető lenne.',
        todo: ['Olvasd el lent a problémát.', 'Döntsd el: javítsa a szerző (mit), vagy fogadd el így (miért).'],
        continueHow: `${restart} A döntést a folytatás előtt a futásmappa döntési fájljába kell tenni.`,
        answerStep: 'folytatas',
      };
      if (text) details.push({ label: `Mit írt (${step})`, text: excerpt(text) });
      break;
    }
    case outcome === 'BLOCKED_AUDIO_BUDGET':
    case outcome === 'STOPPED_BUDGET': {
      e = {
        title: 'A havi hangkeret elfogyna',
        summary: 'A hanggyártás megállt, mert a következő hívással túllépné a havi keretet.',
        what: String(checks.error ?? ''),
        why: 'A keret kemény korlát (DONTESEK 10-28), a program nem lépi túl.',
        todo: ['Döntsd el: várunk a következő hónapig, vagy megemeled a keretet (a keret a konfigurációban van).'],
        continueHow: 'A hanggyártást újra kell indítani; a már elkészült fordulókat nem gyártja újra.',
        answerStep: 'folytatas',
      };
      break;
    }
    case outcome === 'BLOCKED_AUTH': {
      e = {
        title: 'Lejárt a Claude-bejelentkezés',
        summary: 'A Claude parancssori bejelentkezése lejárt, ezért egyik szerep sem tud dolgozni.',
        what: 'A hívás bejelentkezési hibával tért vissza. Ez nem tartalmi hiba.',
        why: 'Belépés nélkül minden további hívás ugyanígy elbukna.',
        todo: ['Nyiss egy terminált, írd be: claude auth login, és a böngészőben kapott kódot illeszd vissza.'],
        continueHow: 'A belépés után a CEO ugyanattól a lépéstől folytatja; a kész lépéseket nem futtatja újra.',
        answerStep: 'folytatas',
      };
      break;
    }
    case outcome === 'STOPPED_LIMIT': {
      e = {
        title: 'Elfogyott a futás hívási kerete',
        summary: `A futás elérte a beállított legnagyobb hívásszámot${checks.error ? ` (${checks.error})` : ''}.`,
        what: 'Ez védelem a költség és a végtelen körök ellen. A kész lépések megmaradnak.',
        why: 'Szokatlanul sok javítási kör vagy újrafuttatás volt.',
        todo: ['Döntsd el, folytatódjon-e. Ha igen, a keretet a config.local.json limits.maxCalls (heti láncnál weekMaxCalls) mezőjében kell emelni.'],
        continueHow: restart,
        answerStep: 'folytatas',
      };
      break;
    }
    default: {
      // STOPPED_STEP_ERROR, STOPPED_ERROR és minden más
      const err = String(checks.error ?? checks.message ?? '');
      const timeout = /időtúllépés/i.test(err);
      const rate = /limit|keret|429|overloaded/i.test(err);
      e = {
        title: outcome === 'STOPPED_STEP_ERROR' ? 'Egy lépés hibával leállt' : 'A CEO váratlan hiba miatt leállt',
        summary: err || `A lánc ${outcome} állapottal megállt.`,
        what: timeout
          ? 'A szerep nem végzett a lépésre szánt időn belül (alapból 20 perc). Ez legtöbbször túl nagy feladat vagy lassú webes keresés.'
          : rate ? 'A Claude/Codex szolgáltatás keret- vagy terhelési hibát adott.'
          : 'A parancssori agent hibával lépett ki vagy üres választ adott; a részletek a lépés hibanaplójában vannak (steps/<lépés>.stderr.txt).',
        why: 'Hibás vagy hiányzó eredménnyel a lánc nem mehet tovább.',
        todo: [timeout || rate ? 'Teendőd nincs: egyszerű újraindítás általában elég.' : 'Szólj a tartalmi sávnak, hogy nézze meg a hibanaplót, és indítsa újra.'],
        continueHow: restart,
        answerStep: 'folytatas',
      };
    }
  }
  return { ...e, outcome, details, ...headOf(outcome, e, { checks, phaseFile: /-dontes$/.test(String(e.answerStep ?? '')) }) };
}

// ——— A levél és az irányítópult eleje (Áron, 2026-11-15) ———
// Áron csak akkor kap levelet, ha tényleg ő kell (owner): nem nyilvános forrás, tantervi vagy mérési döntés,
// lejárt bejelentkezés, pénz. Minden mást a CEO kezel; az irányítópulton „a CEO kezeli” jelöléssel látszik.
// A levél és a kártya eleje négy rövid sor: mi kell, mi a gond, mi a teendőd, mi a kérdés. Belső fájlnév, lépéskód
// és parancs nincs benne (plain()).

const PAYWALL = /bejelentkez|belépés|login|regisztr|előfizet|fizetős|paywall|könyv|nyomtatott|kiadvány|hanganyag|felvétel|\bCD\b|tankönyv|nem nyilvános|zárt/i;

/** Kell-e Áron egy forráskéréshez: fizetős/zárt forrás, vagy nincs nyilvános címe (könyv, hanganyag). */
export function accessNeedsOwner(question) {
  const q = String(question ?? '');
  return PAYWALL.test(q) || !/https?:\/\//.test(q);
}

/** Belső útvonalak, fájlnevek és parancsok kivétele egy Áronnak szóló szövegből. */
export function plain(text) {
  return String(text ?? '')
    .replace(/[A-Za-z]:[\\/][^\s"'`)\]]+/g, '…')
    .replace(/(^|[\s(„"'`])(?:\.{1,2}\/)?(?:runs|steps|decisions|editorial|p5|tools|lib|webapp|docs|assignments)\/[^\s"'`)\]]*/g, '$1…')
    .replace(/\b[\w.-]+\.(?:md|json|mjs|js|txt|log|toml)\b/g, '…')
    .replace(/\bnode ceo\.mjs[^\n]*/g, '')
    .replace(/--ujrafuttat\s+\S+/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

const whereOf = checks => [checks.unit, checks.phase ? `${checks.phase} fázis` : null].filter(Boolean).join(', ');
const clip = (s, n) => { const t = plain(s); return t.length > n ? `${t.slice(0, n).trimEnd()} …` : t; };

/** { owner, need, problem, action, question } egy elakadáshoz. */
export function headOf(outcome, e, { checks = {}, phaseFile = false } = {}) {
  const where = whereOf(checks);
  const at = where ? `${where}: ` : '';
  const ceo = {
    owner: false, need: 'Nincs teendőd: a CEO kezeli',
    problem: `${at}${clip(e.summary, 300)}`,
    action: 'Nincs teendőd. Az irányítópulton látod, ha a CEO megoldotta, vagy ha mégis te kellesz.',
    question: null,
  };
  switch (true) {
    case outcome === 'BLOCKED_DECISION':
      return {
        owner: true, need: 'Döntés kell tőled',
        problem: `${at}a szerző olyan kérdésbe ütközött, amelyet csak te dönthetsz el.`,
        action: 'Válaszolj a kérdésre, elég röviden (pl. „B változat”). Addig ez az egység vár.',
        question: checks.question ? clip(checks.question, 900) : null,
      };
    case outcome === 'BLOCKED_ACCESS':
      if (!checks.fetchFailed && !accessNeedsOwner(checks.question)) return { ...ceo, need: 'Nincs teendőd: a CEO maga szerzi be a forrást' };
      return {
        owner: true, need: 'Egy forráshoz kell a segítséged',
        problem: checks.fetchFailed
          ? `${at}egy szerep egy nyilvános oldalt kért, de a CEO sem tudta letölteni (hibaoldal, süti-fal vagy nem szöveges tartalom).`
          : `${at}egy szerep nem éri el ezt a forrást (fizetős, bejelentkezést kér, vagy nincs nyilvános változata).`,
        action: 'Ha meg tudod szerezni, másold be a szöveget a válaszba. Ha nem fontos, írd: „használd a tartaléktervet”. A munka közben megy tovább.',
        question: checks.question ? clip(checks.question, 900) : null,
      };
    case outcome === 'BLOCKED_DECISION_MAX_ROUNDS': {
      const names = (checks.open ?? []).map(o => o.reviewer).filter(Boolean);
      return {
        owner: true, need: 'Döntés kell: így elfogadod, vagy mit javítson',
        problem: `${at}a javítási körök után is maradt kifogás${names.length ? ` (${names.join(', ')})` : ''}. A részleteket lent látod.`,
        action: phaseFile
          ? 'Ha a mostani változat jó, írd: „elfogadom”. Ha nem, írd le konkrétan, mit javítson (melyik feladat, mi legyen).'
          : 'Írd le, mit tegyen: maradjon így (és miért), vagy mit javítson (melyik feladat, mi legyen).',
        question: 'Elfogadod így, vagy mit javítson?',
      };
    }
    case outcome === 'BLOCKED_AUTH':
      return {
        owner: true, need: 'Be kell jelentkezned a Claude-ba ezen a gépen',
        problem: 'A Claude bejelentkezése lejárt, ezért a CEO most nem tud dolgozni.',
        action: 'Nyiss egy terminált, írd be: claude auth login, és a böngészőben kapott kódot illeszd vissza. A belépés után a CEO folytatja.',
        question: null,
      };
    case outcome === 'BLOCKED_AUDIO_BUDGET':
    case outcome === 'STOPPED_BUDGET':
      return {
        owner: true, need: 'Pénzügyi döntés kell: elfogyna a havi hangkeret',
        problem: 'A hanggyártás megállt, mert a következő hívással túllépné a havi keretet.',
        action: 'Döntsd el: várjunk a következő hónapig, vagy emeljük a keretet.',
        question: 'Várjunk a következő hónapig, vagy emeljük a keretet?',
      };
    default:
      return ceo;
  }
}

/** A magyarázat sima szövegként (e-mailhez): elöl a négy sor, alatta a részletek, belső nevek nélkül. */
export function problemText(e) {
  const head = e.need ? e : { ...e, ...headOf(e.outcome, e) };
  const lines = [`Mi kell: ${head.need}`, `Mi a gond: ${head.problem}`, `Mi a teendőd: ${head.action}`];
  if (head.question) lines.push(`Kérdés: ${head.question}`);
  lines.push('', '— Részletek —', plain(e.what), plain(e.why));
  for (const d of e.details ?? []) lines.push('', `${plain(d.label)}:`, plain(d.text));
  return lines.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');
}
