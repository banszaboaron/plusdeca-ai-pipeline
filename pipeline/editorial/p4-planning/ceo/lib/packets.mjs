// Bemeneti csomagok összeállítása a meglévő szerepcsomagokból.
// Nem ír fájlt, csak szöveget ad vissza; minden hiba kivételt dob, hogy félkész csomag ne induljon el.

const ASSIGNMENT_BLOCK = /<!-- ASSIGNMENT START -->[\s\S]*?<!-- ASSIGNMENT END -->/;

/** A szerepcsomag megbízási blokkját kicseréli a konkrét megbízásra. */
export function replaceAssignment(rolePackage, assignment) {
  if (!ASSIGNMENT_BLOCK.test(rolePackage)) {
    throw new Error('A szerepcsomagban nincs <!-- ASSIGNMENT START/END --> blokk.');
  }
  const result = rolePackage.replace(ASSIGNMENT_BLOCK, () => `${assignment.trim()}\n\n`);
  assertNoPlaceholders(result, 'szerepcsomag');
  return result;
}

/** Kitöltetlen sablonmező ({{…}}) esetén megáll. */
export function assertNoPlaceholders(text, label = 'csomag') {
  const match = text.match(/\{\{[^}]*\}\}/);
  if (match) throw new Error(`Kitöltetlen sablonmező a(z) ${label} szövegében: ${match[0]}`);
}

/** Melléklet hozzáfűzése egyértelmű fejléccel. */
export function attachment(title, body) {
  return `\n\n# ${title}\n\n${body.trim()}\n`;
}

/**
 * A szerzői megjegyzéseket (kulcs, várt alak, mérési cél) eltávolítja, hogy a független megoldó
 * csak azt lássa, amit a tanuló. Az eltávolítás a "Szerzői megjegyzés" fejléctől a következő
 * azonos vagy magasabb szintű fejlécig vagy a következő '---' elválasztóig tart.
 */
export function stripAuthorNotes(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let skipLevel = 0;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (skipLevel) {
      const endsByHeading = heading && heading[1].length <= skipLevel;
      const endsBySeparator = /^---\s*$/.test(line);
      if (!endsByHeading && !endsBySeparator) continue;
      skipLevel = 0;
    }
    if (heading && /szerzői megjegyzés/i.test(heading[2])) {
      skipLevel = heading[1].length;
      continue;
    }
    // Egysoros szerzői mezők, amelyek a fejlécen kívül is előfordulhatnak.
    if (/^\s*\**\s*(Mérési cél|Várt jelentés\/alak|Várt alak|Kulcs)\s*:/i.test(line)) continue;
    // A verzió- és szerzőistátusz-sorok nem tanulói tartalom.
    if (/^\s*(Verzió|Szerzői státusz|Módosítási scope)\s*:/i.test(line)) continue;
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Az írói válaszból kivágja a tanulói oldalakat (GI1-P… fejlécek, bármely fejlécszinten), az átadási és
 * disposition részek nélkül. Az oldalak az első oldalfejléctől a következő, legfeljebb ugyanolyan szintű,
 * nem oldal-fejlécig tartanak. Ha nincs ilyen fejléc, a teljes választ adja vissza.
 */
export function extractPages(response, pagePrefix = 'GI1-P') {
  const lines = response.split(/\r?\n/);
  const headingOf = line => line.match(/^(#{1,6})\s+(.*)$/);
  const isPage = line => { const h = headingOf(line); return Boolean(h && h[2].startsWith(pagePrefix)); };
  const first = lines.findIndex(isPage);
  if (first < 0) return response.trim() + '\n';
  const level = headingOf(lines[first])[1].length;
  let end = lines.length;
  for (let i = first + 1; i < lines.length; i += 1) {
    const h = headingOf(lines[i]);
    if (h && h[1].length <= level && !isPage(lines[i])) { end = i; break; }
    if (/^GEPI_OSSZEGZES\s*$/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(first, end).join('\n').trim() + '\n';
}

/** Minden ellenőrzői kimenet végére kért, géppel olvasható összegzés. */
export const REVIEW_FOOTER = `

# Gépi összegzés (kötelező)

A válaszod legvégére, minden más után, írd ki pontosan ezt a blokkot, a számokat és a verdiktet kitöltve. A blokk után ne írj semmit.

GEPI_OSSZEGZES
verdict: REVIEW_PASS | REVISION_REQUIRED | BLOCKED_EVIDENCE
blocker: <szám>
major: <szám>
minor: <szám>
GEPI_OSSZEGZES_VEGE
`;

/** A szerzői kimenetek végére kért összegzés. */
export const AUTHOR_FOOTER = `

# Gépi összegzés (kötelező)

Ha a feladatot el tudod végezni, végezd el, és a státusz DRAFT_FOR_REVIEW. Ha csak a felhasználó (PRESIDENT) döntésével lehet továbbmenni — például a megbízás ellentmondásos, hiányzik egy kötelező bemenet, vagy tantervi/mérési célt kellene módosítani —, akkor ne találgass: írj egy „# DÖNTÉSI KÉRDÉS” részt (a kérdés, a lehetőségek és mindegyik következménye, a te javaslatod), és a státusz BLOCKED_DECISION. Apró, a megbízáson belül eldönthető kérdésben ne kérdezz, hanem dönts és jelöld.

A válaszod legvégére írd ki pontosan ezt a blokkot. A blokk után ne írj semmit.

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW | BLOCKED_DECISION
GEPI_OSSZEGZES_VEGE
`;

/**
 * A szerző döntési kérdése: a „DÖNTÉSI KÉRDÉS” fejlécű rész a következő, legfeljebb ugyanolyan szintű
 * fejlécig; ha nincs ilyen rész, a válasz vége a gépi összegzés előtt.
 */
export function extractQuestion(text) {
  const body = text.split('GEPI_OSSZEGZES')[0];
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex(l => /^#{1,6}\s*DÖNTÉSI KÉRDÉS/i.test(l));
  if (start < 0) return body.slice(-1500).trim();
  const level = lines[start].match(/^(#+)/)[1].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    const h = lines[i].match(/^(#{1,6})\s/);
    if (h && h[1].length <= level) { end = i; break; }
  }
  return lines.slice(start + 1, end).join('\n').trim();
}

/** A megoldásíró által adott tanulói nézet (opciókkal, kulcs nélkül), vagy null, ha nincs. */
export function extractLearnerView(text) {
  const m = text.match(/^TANULOI_NEZET\s*\n([\s\S]*?)^TANULOI_NEZET_VEGE\s*$/m);
  return m && m[1].trim() ? `${m[1].trim()}\n` : null;
}

/** A megoldásíró kimeneti kiegészítése: a független megoldó ezt a tanulói nézetet kapja. */
export const LEARNER_VIEW_RULE = `

# Tanulói nézet a független megoldónak (kötelező)

A gépi összegzés előtt, külön blokkban add meg a P04 és P05 itemeit pontosan úgy, ahogy a tanuló látja: instrukció, helyzet, mondat, mező és a P04-nél mindhárom opció (A, B, C). Ne legyen benne kulcs, helyes válasz jelölése, feedback, tévedési alap vagy szerzői megjegyzés. Ha egy itemhez nem tudtál kiadható opciósort adni, az itemet a jelenlegi tanulói szöveggel, opciók nélkül add meg, és írd mellé: „(opciók döntésre várnak)”.

TANULOI_NEZET
<a tanulói nézet>
TANULOI_NEZET_VEGE
`;

/** Segítségkérés (hozzáférés): a SEGITSEGKERES … SEGITSEGKERES_VEGE blokk szövege, vagy null. */
export function extractHelpRequest(text) {
  const m = String(text ?? '').match(/^SEGITSEGKERES\s*\n([\s\S]*?)^SEGITSEGKERES_VEGE\s*$/m);
  return m && m[1].trim() ? m[1].trim() : null;
}

/** A PRESIDENT válaszát a megbízás végére, a gépi összegzés elé illeszti. */
export function insertBeforeFooter(prompt, addition) {
  const marker = '\n\n# Gépi összegzés (kötelező)';
  const i = prompt.lastIndexOf(marker);
  return i < 0 ? prompt + addition : prompt.slice(0, i) + addition + prompt.slice(i);
}
