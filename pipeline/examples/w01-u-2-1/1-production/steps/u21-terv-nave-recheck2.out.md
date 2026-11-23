# NavE recheck (3. kör): az U21 (w01-u-2-1, GI2) javítási terve, 2. javított változat

**Szerep és feladat:** NavE, követelmény- és szerkezeti ellenőrzés. Ebben a körben az N1, N7 és N9 maradékát, valamint az N10–N13 findingot ellenőriztem újra.

**Mit kaptam:**
- a GR 2. javított terve (DRAFT_FOR_REVIEW);
- a javítási brief;
- a `week-01.json` → `units[w01-u-2-1]`;
- a tanári kifogások;
- a mércék;
- a 2. körös jelentésem (N1–N13).

**Mit néztem meg:** csak a változott részeket és azt, ami tőlük függ:
- a terv részei: 0.1–0.3, 2. tábla, 2.1, 3.1 idővonal, 3.2 (p02/i01, p03/i02, p04, p05/i04, p06/i05, p07/i06, p09/i08), 3.3, az új 3.5, valamint a K12–K14;
- a lezárt findingok (N2–N6, N8) érintett kapcsolatai.

A francia fordulatok természetességét nem minősítem. Az a PE és a NyE dolga.

---

## 1. A korábbi findingok

| ID | Előző állapot | Most | Indoklás |
|---|---|---|---|
| **N1** | PARTIALLY FIXED (MINOR) | **FIXED** | A 0.1 pont szerint az összevetést a CEO szkriptje végzi, a NavE csak a futás bizonyítékát kapja meg. A kimenet és a napló csatolása a Kézirat fázis indításának feltétele. Ha eltérés van, a kanonikus változat nyer, és a terv visszamegy a GR-hez. A kimenetet továbbra sem láttam, ezt lent NEM VIZSGÁLT-ként jelölöm. A kapu az ellenőrzést a Kézirat fázis elé teszi. |
| **N7** | PARTIALLY FIXED (MINOR) | **FIXED** | Léo szombat este azt kérdezi, mit veszünk mi holnap, így a két kulcsmondatnak van szerepe: <br>• *Je vais en prendre deux*: holnap reggel veszek kettőt; <br>• *Nous ne voulons pas en acheter*: valódi okkal nem kérünk belőle, és ebből Léo tudja, hogy ne hozza. <br>A „már megvettük” indok kikerült, ezért az idővonal nem mond ellent magának (szombat este → vasárnap 8:45). Az *en* előzménye két megszámlálható fajta Léo üzenetében (K14). |
| **N9** | PARTIALLY FIXED (MINOR) | **FIXED** (kapuként) | A 0.2 és a 0.3 kifejezett feltétel a Kézirat fázis előtt: kell a forráslista, és a NyE-nek meg kell nyitnia az OQLF-lapot. Van tartalékterv (K5), és a terv nem állítja, hogy a forrást megnyitotta. Tervszinten ez elég. |
| **N10** | MINOR | **FIXED** | A 2.1 kimondja az irányt: a cél bekerül a `targetManifest`-be, i04- és i08-kötéssel, és törölni nem szabad. Az indok helytálló, mert az `approvedObjectives` 4. pontja és az `approvedTargetAlignment` már kimondja és méri a célt. Ha a CEO mégis célbővítésnek tekinti, a terv ezt az `objectives`-kérdéssel együtt eszkalálja. Egy kapcsolódó metaadat-pontatlanságot lent N14 alatt jelzek. |
| **N11** | MAJOR | **PARTIALLY FIXED → maradék MINOR** | **Ami rendben van:** a 3.5 kötelező szabály és célonkénti tiltó mátrix lett, a megoldó ellenőrzi (K12). A p02, p04, p06 és p07 sorait a mátrixhoz igazították, a p06 passé composé-példája más mozzanatból jön. A mátrixot soronként összevetettem a 2. tábla mért alakjaival és a 3.3 előírásaival: a 3.2 p03-során kívül nincs ütközés. <br>**Ami nyitott:** a 3.2 **p03**-sora szó szerint ezt írja elő: „Kontraszt: *Je voudrais du café* ↔ ***Je reviens du café***”. A 3.5 mátrix *de + le* sora ugyanezt tiltja a magyarázatban („a kávézó + *revenir de* kombináció”). Az i02 kulcsa pedig *Je reviens du café que tu m'as conseillé*. A terv tehát két egymásnak ellentmondó utasítást ad a szerzőnek, és ha a szerző a 3.2-t követi, az i02 megoldása (*du*) kimásolható a közvetlenül előtte álló magyarázatból. <br>**Miért csak MINOR:** a 3.5 kötelező szabály, a K12 a független megoldóval ellenőrizteti, a NavE pedig a kéziraton veti össze a tiltó oszlopot. A hiba így nagy valószínűséggel nem jut el a tanulóig, és egy sorral javítható. |
| **N12** | MINOR | **FIXED** | A három mérés most három külön helyet használ: <br>• i02: a kávézó, a bővítménye *du* nélküli (*… que tu m'as conseillé*); <br>• s002: más hely és más mozzanat (8:25, a metró kijárata); <br>• i01-2: egy harmadik hely. <br>Egyetlen hely sem szerepel több mérésben. Kivétel a p03 kontrasztja, amely a kávézót hozza vissza, ezt az N11 maradéka kezeli. |
| **N13** | MINOR | **FIXED** | A p09 2. tartalmi eleme most anyagnévi tételt kér meghatározatlan mennyiségben, hímnemű példákkal (kenyér, narancslé), és mindkét modellben elő kell fordulnia a partitív *du*-nak. A `partitive_vs_contracted` kritériumnak így természetes helye van. A nyelvi `allCriteria` nem változott. |

## 2. Findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| **N11** (maradék) | MINOR | 3.2, p03-sor, „Kontraszt” | A p03 előírt kontrasztpéldája (*Je reviens du café*) az i02 kulcsának ige + hely kombinációja, és ezt a 3.5 tiltja. | 3.2 p03: „*Je voudrais du café* ↔ *Je reviens du café*”. 3.5, *de + le* sor, tiltó oszlop: „a kávézó + *revenir de* kombináció”. 2. tábla: az i02 mért alakja *du*. | A p03 kontrasztja a 3.5 szerinti helyet használja, pl. *Je voudrais du café* ↔ *Je reviens du marché*. A p03-sor kapjon hivatkozást: „példák a 3.5 szerint”. | csak a 3.2 p03-sora |
| **N14** | NOTE | 2.1, N10-sor; az i07 meglévő `targetIds` mezője | 1. A javasolt kötés `pageIds: [p05]`, holott a meglévő manifestben a `pageIds` az itemek oldalait sorolja fel (pl. `i07` → `p08`, `i08` → `p09`). Az i08 kötése miatt itt `[p05, p09]` lenne következetes. <br>2. Az i07 item szintű `targetIds` mezője tartalmazza a `w01-g-de-quantity-subset`-et, de egyik i07-subitem sem méri. Az s005 a *beaucoup de* alakot méri, célja `w01-g-de-quantity`. A manifest felvétele után ez fedettséget sugall ott, ahol nincs mérés. | `targetManifest` (`pageIds`-minta); i07 `targetIds`; s005 `targetIds`. | Ha a CEO-szkript végrehajtja az N10 döntését, egyúttal: <br>• a kötés legyen `pageIds: [p05, p09]`; <br>• az i07 `targetIds` mezőjében a subset-ID helyére a `w01-g-de-quantity` kerüljön. <br>Szkriptfeladat, tartalmi döntés nem kell. | szkriptkimenet |
| **N15** | NOTE (a PE-nek és a NyE-nek) | 3.3 s002; 3.5 *de + le* sor | A *sortie de métro* általános összetételként is él, így a *de* distractor esetleg nem egyértelműen hibás, és két helyes válasz lehet. Ez nyelvi kérdés, nem az én hatásköröm. | 3.3 s002: „*la sortie de* + *le métro*”. | A K13 mellett a független megoldó és a NyE kifejezetten nézze meg. Ha kétes, más hímnemű hely vagy más *de*-s szerkezet kell. | s002 a kéziraton |

## 3. A lánc megfeleltetése (csak a változott sorok)

| Elem | 2. kör | Most |
|---|---|---|
| Brief → kanonikus alap | csak kapu volt | felelős és kapu rendezve ✔ (a kimenet a Kézirat fázis előtt kell) |
| Brief → forrásból induló tervezés | előfeltétel | kifejezett kapu ✔ |
| Mért célalakok, ID-k, feladattípusok, terjedelem, időkeret | ✔ | ✔ változatlan; az i03 mért alakja pontosítva és összhangban ✔ |
| Manifest ↔ `approvedObjectives` (subset) | nyitott irány | ✔ irány megadva; metaadat-részletek: N14 |
| A magyarázat kimásolhatósága (p02↔i01, p04↔i03/s003/s004, p05↔i04/s005, p06↔i05/s006, p07↔i06) | ✘ | ✔ a 3.5 szerint; kivétel a p03↔i02 (N11 maradék) |
| Idővonal és szereplők (K10) | ✔, az N7 kivételével | ✔; a 8:25-ös mozzanat beillesztve, a „mit vesztek holnap?” kérdés összhangban van a 8:45-ös vásárlással |
| p09 tartalmi elemek ↔ `allCriteria` | partitív hely hiányzott | ✔ |
| Tanári kifogások (A, B3, B4, B6, C1, C4, D1–D5) | ✔ | ✔ változatlanul lefedve |

**Ellenőrizve, rendben:** a 3.5 mátrix sorai a 3.3 előírásaival egyeznek; az s001 tiltott igéi és az s006 p06-tilalma is összhangban van velük. A K12–K14 kockázatok kezelése rendben van. A dispositionöket egyenként ellenőriztem, a fenti státuszokkal.

## 4. NEM VIZSGÁLT, hiányzó bemenetek

- A `kanonikus/apply-teacher-corrections.mjs` kimenete és naplója: nincs a bemenetemben. Ez kapu a Kézirat fázis előtt (0.1).
- A GR (2,1)-es kiosztása: nincs a bemenetemben. Az `objectives`-kérdés ESCALATED, ezt a tervet nem blokkolja.
- Az OQLF-lap és a pékségi források: nem nyitottam meg. Ez a NyE és a szerző hatásköre, kapuként rögzítve.
- A francia fordulatok természetessége és az N15: a PE és a NyE dolga.

---

## Összefoglalás

- **Verdikt:** REVIEW_PASS a megnevezett hatókörre. Nem maradt nyitott BLOCKER vagy MAJOR.
- **A korábbi findingok:**
  - FIXED: N1, N7, N9, N10, N12, N13;
  - PARTIALLY FIXED, maradék MINOR: N11 (a p03 kontrasztsora).
- **Új:** N14 és N15, mindkettő NOTE.
- **Feltételek a Kézirat fázis indításához:**
  - a kanonikus kimenet és napló csatolva (0.1);
  - a forráslista elkészült (0.2);
  - a NyE megnyitotta és igazolta az OQLF-lapot (0.3);
  - az N11 maradékát érdemes a p03 sorában ezelőtt javítani.
- **A következő NavE-ellenőrzés:** a kéziraton, a 3.5 tiltó oszlopa és a K10 idővonal szerint, oldalanként.
- **Új bizonyíték:**
  - a 3.5 mátrix soronkénti összevetése a 2. táblával, a 3.2-vel és a 3.3-mal;
  - ebből találtam meg a p03↔i02 ütközést.
- **Újrahasznosított bizonyíték:** a 2. kör megfeleltetése a nem változott sorokra.
- **Tanulság:** ha egy terv kötelező tiltó mátrixot vezet be, a korábbi, oldalankénti előírásokat is össze kell vetni vele, mert a régi kontrasztsorok észrevétlenül ellentmondhatnak neki. Hatókör: minden olyan javítási terv, amely utólag vezet be egy oldalakon átnyúló szabályt.
- **Következő címzett:** CEO. A javítás a GR-é: az N11 maradéka egy sor. Az N14 a szkriptnek szól, az N15 a PE-nek és a NyE-nek.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 1
GEPI_OSSZEGZES_VEGE