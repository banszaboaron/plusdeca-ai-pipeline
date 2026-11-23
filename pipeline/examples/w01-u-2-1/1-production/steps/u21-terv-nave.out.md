# NavE-ellenőrzés: U21 (w01-u-2-1, GI2) javítási terve

**Szerep:** NavE (követelmény- és szerkezeti ellenőr). Független ellenőrzés, első kör, ezért nincs korábbi finding, amelyet újra kellene nézni.
**Bemeneti változat:**
- a GR javítási terve (DRAFT_FOR_REVIEW);
- a javítási brief (2026-10);
- `week-01.json` → `units[w01-u-2-1]`, REVISION_REQUIRED státusszal;
- a tanári kifogások kivonata (FICHE-01 és a 10-20-i bírálat);
- a szintmérce, a feladattípus-mérce és a jó/rossz példák.

**Hatókör:**
- lefedi-e a terv a briefet és minden tanári kifogást;
- megmarad-e a mérési cél, a feladattípus, az item-ID-k és a terjedelem;
- jó feladat készül-e, jó időben és jó módon.

A tervben szereplő francia fordulatok természetességét nem minősítem; az a PE és a NyE feladata.

---

## 1. A lánc tételes megfeleltetése

### 1.1 Brief → terv

| Brief-követelmény | Hol teljesül a tervben | Állapot |
|---|---|---|
| A mag (determinánsok, *de*, *en*) pontosító ismétlésként marad | 1. Diagnózis „Szint”, 2. táblázat | ✔ |
| Mértékkel B2 felé: *même si*, *tandis que*, helyesbítés, indokolt választás, ahol természetes | 3.2: p02, p04, p05, p07, p09; 4. táblázat | ✔ (nem mért, opcionális: ez helyes) |
| Funkciópróba-hét: nem nő aránytalanul a terhelés | 2. táblázat „Terjedelem”, K6 | ✔ |
| Téma: pékség, reggeli, kávézó; rendelési fordulatok; viennoiserie / formule; magyar összevetés; érdekesebb kifejezések | 3.1, p04, p06; 4. táblázat D1–D5 | ✔ |
| Valódi francia helyzet: konkrét hely, ember és tét; minden szám egyértelmű | 3.1 (a város és az ár a szerzőre marad) | ✔ tervszinten |
| Hiteles műfaj; a modellszöveg is ugyanazon mérce alá esik | 3.1 (négy műfaj), F1, K4 | ✔ |
| Nem a feladathoz gyártott cselekmény | 3.1 „Tét”, 3.3 | ✔ |
| Egészében javít, nem mondatonként foltoz | 3.1 közös keret | ✔ |
| A cél, a feladattípus, az ID-k és a terjedelem változatlan | 2. táblázat | ✔ a céloknál részben, lásd N2 |
| Az U21 javításának alapja a `kanonikus/apply-teacher-corrections.mjs` kimenete | **sehol** | ✘ N1 |
| Forrásból induló tervezés | 3.1 „Forrásigény a szerzőnek” | részleges, N9 |
| Kimenet: VALTOZASNAPLO (melyik kifogás hogyan lett kezelve) | 4. táblázat, változáslista | ✔ tervszinten |

### 1.2 Tanári kifogás → terv

| Kifogás | Kezelés | Állapot |
|---|---|---|
| „pas bien structuré / pas intéressant / ne sonne pas français” | közös keret, három szereplő, négy műfaj | ✔ (de a szereplők rendje következetlen, lásd N4) |
| „trop facile” / D4 (a mag ismétlés) | a művelet emelkedik, a mag marad | ✔ |
| B3 (a mennyiségjelzőt nem kényszeríti ki a kitöltendő hely) | i04: két megadott alak; i07-s005: a *beaucoup* a stimulusban áll; K2 | ✔ |
| B4 (*pas de thé*) | az egységben nincs ilyen item; a kontrasztív forma tiltva | ✔ |
| B6 (*j'en veux deux*) | p06, p09 | ✔ |
| C1 (*va me caler*) | p06, p09 | ✔ |
| C4 (*Je vais vous prendre…*) | a pultnál használható | ✔ |
| D1, D2, D3, D5 | p04, p06, p09 | ✔ |
| EU Academy | NEM VIZSGÁLT, a szerzőre bízva | elfogadható, de lásd N9 |

### 1.3 Mért célalak és item → terv

| Item | Mért cél | A terv szerint | Állapot |
|---|---|---|---|
| i01-s001 | partitív *du* ↔ *de + le* | félreértést tisztázó üzenetváltás | **kockázat: két helyes értelmezés**, N3 |
| i02 | *du* (de + le) | SMS-helyzet, „egy hely” | a nem nincs rögzítve, N5 |
| i03 | *d'excellents / des petits pains* | helyértékelés | a kulcs indoka gyengülhet, N6 |
| i04 | *beaucoup de ; beaucoup des* | sor és törzsvendégek; a két alak megadva | ✔ |
| i05-s001 | az *en* négy helye | pultnál folyó párbeszéd és esti beszámoló | ✔ (a *nous* alany kérdéses, N4) |
| i06 | az *en* helye, a *des* elhagyása | előrendelési üzenet javítása | nincs előzmény és hihetőség, N7 |
| i07-s001…s006 | hat célkontraszt | 3.3 subitemenként, K1 | ✔ |
| i08-s001 | hat `allCriteria`, rubrika | új helyzet, két új modell | a tartalmi elemek sorsa nyitott, N8 |

---

## 2. Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck-hatókör |
|---|---|---|---|---|---|---|
| **N1** | MAJOR | A terv fejléce („Bemenet”), 2. táblázat | A brief szerint az U21 javításának alapja a tanári javításokat beíró szkript kimenete. A terv a régi `week-01.json`-ra épül, és ezt sehol nem egyezteti. Ha a szkript módosított egy U21-es itemet (B3/B6/C1 → i04, i05, p06), a „Mi marad” tábla mért alakjai és stimulusai a régi változatot rögzíthetik, és visszaléphet egy már elfogadott tanári javítás. | Brief: „Az érintett egységek (U21, U41, U43) javításakor ezt a változatot kell alapnak tekinteni.” A terv bemenete csak a `week-01.json`. | A GR nevezze meg a `kanonikus/` kimenetet és a naplót bemenetként. Itemszinten sorolja fel, mely FICHE-01-javítás érinti az U21-et, és erősítse meg, hogy a 2. pont mért alakjai ezzel egyeznek. | fejléc, 2. táblázat, i04, i05, p06 |
| **N2** | MAJOR | 1. Diagnózis „Belső ellentmondás”, K8, „Döntési kérdés nincs” | A terv a futtatási `objectives` mezőt (tagadás, *être* utáni kivétel, *sans* + főnév) szkripttel az `approvedObjectives`-hez igazítaná, és ezt „nem célváltozás”-nak nevezi. Nem látszik, hogy a GR oszlopterve ezt a két célt máshova osztotta volna. Ha a (2,1)-hez voltak kiosztva, ez jóváhagyás nélküli célszűkülés. A régi rekord nyitott döntései sincsenek továbbvíve: az `objectives` átírása, a személyre/dologra visszautaló *en* a (4,1)-ben, az i05 egyetlen subitemje, az `allCriteria` szigora és a p09 értékelhetősége. | Régi `openDecisionsMarkdown`: „Dönteni kell, hogy a runtime objectives mezőt átírjuk-e…”. A terv: „Döntési kérdés nincs.” | A GR igazolja az oszloptervből, hova kerül az *être* utáni kivétel és a *sans* + főnév. Ha a (2,1)-hez volt kiosztva, a célváltozást ESCALATED / DÖNTÉSI KÉRDÉS formában vigye tovább. A régi nyitott döntéseket egyenként sorolja fel: marad nyitott, lezárva (mivel), vagy ebben a körben nem érintett. | 1. pont, K8, a „Hiányok” rész |
| **N3** | MAJOR | 3.2 p02 / i01 | A terv szerint az i01 stimulusa „jelentésre nézve tényleg kétértelmű helyzetet old fel”, mert a barát a *café* szót kétféleképpen használja. Ha a félreértés a *du café* kétértelműségére épül (pl. *parler du café*), a stimulusmondat önmagában mindkét elemzést megengedheti: két helyes válasz lesz, és a mérés érvénytelen. A K-táblában ez a kockázat nem szerepel. | Mérce, 2. rossz példa (két helyes válasz). A régi p02 maga írja, hogy a *Je parle du café* mindkét olvasatban lehetséges. | A szerzőnek szóló előírás legyen ez: a két itemmondatban egy-egy egyértelműsítő elem kötelező (fogyasztásige vs. *de*-t igénylő ige + azonosított hely). A félreértés a magyarázó jelenetben lehet, a mért mondatban nem. Vegyék fel K-kockázatként, külön megoldói ellenőrzéssel. | p02, i01, K-tábla |
| N4 | MINOR | 3.1 „Ki”, 3.2 p06 / i05, p07 | A terv kimondja, hogy csak három szereplő legyen. A p07 viszont egy negyediket hoz be („francia nyelvet tanuló barát”), ami ráadásul ellentmond annak, hogy a barát francia. Az i05 negyedik mondata (*Nous… avons acheté trois*) csak akkor hihető, ha a keret szerint ketten vásároltak. A szereplő „barát vagy lakótárs”-ként sincs rögzítve. | Mérce, 3. és 6. pont (nézőpontváltás, ellentmondó keret). | Rögzítse a szereplőket egyértelműen. A p07 hibás üzenete legyen a tanuló saját piszkozata. A *nous* alanyhoz a keret mondja ki, ki vásárolt együtt. | 3.1, p06, p07 |
| N5 | MINOR | 3.2 p03 / i02 | A kulcs (*du*) és a C-distractor (*de la*) hímnemű, azonosított helyet feltételez. A terv csak annyit ír, hogy „egy helyet”, miközben a közös keret egy *boulangerie*, amellyel a kulcs *de la* lenne. | A régi i02 kulcsa és feedbackje: „Café est masculin”. | Az i02-re is írja elő, amit a s002-re már előír: hímnemű, azonosított hely legyen (*café, marché…*). | i02 |
| N6 | MINOR | 3.2 p04 / i03 | Az i03 stimulusa helyértékelés (*avis*) lesz. Az informális online értékelésben a *des excellents* gyakori, a kulcs és a feedback viszont a „gondozott standard”-ra hivatkozik. A *des petits pains* indoka (a krétatábla kategóriája) sem látszik magától egy értékelésben. | A régi i03 rejected-indoka: „Dans le registre standard visé…”; K5. | Az értékelés regisztere legyen gondozott (pl. ajánló rovat vagy szerkesztett értékelés), vagy a stimulus jelezze a regisztert. Az értékelés szövege nevezze meg a *Petits pains* kategóriát. A PE/NyE döntsön a hitelességről. | i03, p04 |
| N7 | MINOR | 3.2 p07 / i06 | Az új keret (előrendelési üzenet a pékségnek) mellett a kulcsmondat (*Nous ne voulons pas en acheter*) funkciója nem világos. Egy rendelési üzenetben ritkán írja valaki, mit nem akar venni, és az *en* előzménye sem látszik a stimulusban. | Közös alap 6. pont: a feedback csak a látott szövegre épülhet; az *en*-nek előzmény kell. | A terv írja elő, hogy a hibás üzenetben látható előzmény legyen az *en*-hez, és hogy a tagadó mondat hihető funkciót kapjon (pl. visszautasítás vagy módosítás). | i06 |
| N8 | MINOR | 3.2 p09 / i08 | A terv azt mondja, hogy marad a címzett, a regiszter, a 6–8 mondat és a hat kritérium. A hat **kötelező tartalmi elemről** nem mond semmit, pedig ezek a régi helyzethez kötődnek (pl. „ital vagy étel rendelése”, „konkrét kávézó, amelyhez de + le kapcsolható”), és az új ajánló helyzetben nem mind természetesek. | A régi `briefMarkdown` „Kötelező tartalmi elemek” 1–6. | Mondja ki, hogy a tartalmi elemeket az új helyzethez igazítják-e (melyiket hogyan). A nyelvi `allCriteria` maradjon változatlan. | i08 |
| N9 | MINOR | 3.1 „Forrásigény”, „Hiányok” | A terv egyetlen megvizsgált forrás nélkül rögzíti a keretet, a krétatábla kategóriáit és a formulát, holott a *Petits pains* mint krétatáblán szereplő kategória a s004 és az i03 kulcsának indoka. A közös alap szerint a forrás a tervezés bemenete. | Közös alap: „Forrásból induló tartalom”. A terv: „külső forrást nem nyitottam meg”. | A Kézirat fázis feltétele legyen, hogy a szerző legalább egy valódi kínálati vagy krétatábla-forrással igazolja a kategóriát. Ha nincs ilyen forrás, ezt jelezze, mielőtt a kulcsindoklás rá épülne. | 3.1, s004, i03 |

**Ellenőrizve, rendben:**
- az ID-k megőrzése;
- a feladattípusok;
- az i04 és az i07 s002–s006 előírásai;
- a K1, a K2, a K3 és a K7 kezelése;
- az időkeret.

---

## 3. NEM VIZSGÁLT elemek és hiányzó bemenetek

- A `kanonikus/apply-teacher-corrections.mjs` kimenete és naplója: nincs a bemenetemben (N1).
- A GR oszlopterve és a (2,1)-es kiosztás: nincs a bemenetemben, ezért N2 nem dönthető el (az *être* és a *sans* célok helye).
- A DONTESEK 10-28 teljes szövege és a `PONTOS_TANARI_JELOLESEK.md` teljes szövege: csak a briefben és a mellékletben idézett kivonatot láttam.
- Az FR heti megbízása: nincs a bemenetemben.
- A francia fordulatok természetessége és a nyelvtani referencia (*des petits pains*): PE / NyE hatókör.

Kérés a CEO-nak: az N1 és az N2 lezárásához a következő körben csatolja a szkript kimenetét és a GR (2,1)-es kiosztását.

---

## Összefoglalás

- **Verdikt:** REVISION_REQUIRED, három MAJOR miatt: N1 (nincs a kanonikus alap), N2 (lehetséges jóváhagyás nélküli célszűkülés és a régi nyitott döntések elhagyása), N3 (az i01-ben két helyes elemzés lehetséges).
- A terv egyébként lefedi a briefet és a tanári kifogásokat, és megőrzi az ID-ket, a feladattípusokat és a terjedelmet.
- Új bizonyíték: a fenti tételes megfeleltetés. Újrahasznosított bizonyíték: nincs.
- **Tanulság:** ha egy item a félreértés tisztázására épül, a félreértés a magyarázó jelenetbe kerüljön, a mért mondat legyen egyértelmű. Különben két helyes válasz lesz. Ez minden helyesbítő műveletre vonatkozik.
- **Következő címzett:** CEO (a javításra a GR, a recheck az N1–N9 és az érintett oldalak).

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 3
minor: 6
GEPI_OSSZEGZES_VEGE