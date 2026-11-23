# NavE-jelentés: U21 (w01-u-2-1, GI2), új kézirat

**Szerep és megbízás:** NavE, független ellenőrzés. A kézirat első ellenőrzése, nem recheck.

**Bemenet:**
- a blokkíró kézirata (DRAFT_FOR_REVIEW, 2026-11);
- a GR elfogadott terve (2. javított változat);
- a javítási brief;
- a `week-01.json` → `units[w01-u-2-1]`;
- a tanári kifogások és a mércék.

**Hatókör:**
- megvan-e a terv minden eleme, és minden item-ID-hez tényleges tanulói szöveg tartozik-e;
- megmaradt-e a mérési cél és a célalakok;
- tartalmaz-e a VÁLTOZÁSNAPLÓ bejegyzést minden tanári kifogásra.

A nyelvi természetességet, a szakmai minőséget és a kulcsot nem minősítem. Ahol ilyet láttam, NOTE-ként jelzem.

---

## 1. Teljesség: oldalak és item-ID-k

| ID | Tényleges tanulói szöveg | Mérési szándék és válaszmód | Állapot |
|---|---|---|---|
| p01 | van (keret, szerepjáték jelezve, négy cél) | item nélküli | ✔ |
| p02 / i01, i01-s001 | jelenet, magyarázat, 4 példa, kontraszt, 2 stimulus | van | ✔ |
| p03 / i02 | magyarázat, példák, kontraszt, stimulus, 4 opció | van | ✔ |
| p04 / i03 | ardoise, magyarázat, példák, kultúra, stimulus | van | ✔ |
| p05 / i04 | magyarázat, példák, kontraszt, stimulus | van | ✔ |
| p06 / i05, i05-s001 | pultjelenet, 4 szabály, ellenpéldák, 4 mező | van | ✔ |
| p07 / i06 | emlékeztető, 3 példapár, Léo üzenete és a piszkozat | van | ✔ |
| p08 / i07, s001–s006 | mind a hat subitemnek van stimulusa | van (s001–s005 egy elem, s006 mondat) | ✔ |
| p09 / i08, i08-s001 | helyzet, címzett, regiszter, 6 tartalmi elem, 6 ellenőrzőkérdés, A és B modell | van | ✔ |

Minden oldal-, item- és subitem-ID megvan, és nincs „ide jön” jellegű hiány. Kulcs, feedback és végleges rubrika a megbízás szerint nincs a kéziratban.

## 2. A mérési cél és a célalakok

A régi kézirattal (`week-01.json`) és a terv 2. pontjával vetettem össze.

| Item | Mért alak (terv) | A kéziratban | Állapot |
|---|---|---|---|
| i01 | *du* két értéke | partitív (*acheter du pain de seigle*) ↔ *de + le* (*à côté du parc*) | ✔ |
| i02 | *du* | *revenir de* + kávézó; a bővítményben nincs *du* (N12) | ✔ |
| i03 | *d'excellent-* + *des petits pains* | *d'excellents croissants au beurre*, *des petits pains aux céréales* | ✔ |
| i04 | *beaucoup de ; beaucoup des* | mindkét alak az instrukcióban (B3); a csoportot a *de la vitrine* nevezi meg | ✔ |
| i05 | négy kulcsmondat | a kiinduló mondatokból mind a négy kulcsmondat előáll; csak a főnevek cserélődtek | ✔ |
| i06 | *Je vais en prendre deux. / Nous ne voulons pas en acheter.* | ugyanez | ✔ |
| i07 | *du / du / d' / des / de / Je vais en prendre trois.* | ugyanez; a *trois parts de flan* maradt | ✔ |
| i08 | 6 nyelvi `allCriteria` | változatlan; mindkét modell lefedi mind a hatot (táblázattal ellenőrizve) | ✔ |

A p09 modelljeiben a mondatszám a terv szerinti: A 7, B 8. Mindkét modellben van partitív *du* anyagnévvel (N13). Az *en* minden előfordulása előtt kimondott előzmény áll.

**A 3.5 mátrix tiltó oszlopa:** tételesen összevetettem minden célt. Tiltott kombinációt egyetlen magyarázó példa sem tartalmaz:
- p02: nincs *acheter du pain*;
- p03: nincs kávézó + *revenir de* (a kontrasztpár *jus d'orange*-ra cserélődött);
- p04: nincs *excellent-*;
- p06: nincs *en prendre*;
- p07: nincs *vouloir* és *acheter* tagadva.

**Jelölt eltérés a tervtől:** az i05-3 (a cukor visszautasítása) 9:30-kor, otthon játszódik 8:45 helyett. Indokolt, a mérési célt nem érinti, és a mező saját helyzetsora jelzi az időpontot. Elfogadom; a GR tudomásul vétele elég.

## 3. Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| M1 | MINOR | i06 ↔ i05-2 ↔ p09 modellek | A keret mennyiségei nem követik egymást (a terv 3.1-es keretszabálya és a K10 kockázat szerint ez kötelező). | i06 (szombat): „Les pains au chocolat, oui ! Je vais prendre en deux.” – vasárnap 8:45-kor viszont a tanuló *deux croissants*-t vesz (i05-2), pain au chocolat nincs. Az i05-1 és a p06 szerint vettek *pain de seigle*-t és *une tradition*-t, a B modell mégis ezt írja: „Ce qui manque, c'est du pain”. Az A modell két *baguette tradition*-t kér, a már megvett traditiont nem említi. | Az i05-2 kiinduló mondata legyen *deux pains au chocolat* (a kulcs változatlan), vagy az i06 nevezzen croissant-t. A B modell egy félmondatban mondja ki, hogy a kenyér elfogyott vagy kevés. Az A modellben a tradition-kérés kapjon indokot. |
| M2 | MINOR | p03, p08, p09 (oldaltető) | A terv 3.4 pontja szerint minden oldal tetején egysoros helyzetjelző áll. Ez a három oldalon hiányzik, csak az itemek stimulusában van időpont. | A p03 a helyzetjelző helyett rögtön a magyarázattal kezdődik. A p08 és a p09 szintén helyzetjelző nélkül indul. A VÁLTOZÁSNAPLÓ ennek ellenére azt állítja: „Minden oldal tetején egysoros helyzetjelző áll.” | Pótolni kell a helyzetjelzőt. A p08-on lehet a „le week-end en six moments” típusú gyűjtősor is. Utána a naplót igazítani kell. |
| M3 | MINOR | p06 pultjelenet; VÁLTOZÁSNAPLÓ D1/D5 | A terv 3.1 pontja szerint csak tanári vagy forrással igazolt rendelési fordulat kerülhet be. A kézirat igazolás nélküli fordulatokat is tartalmaz. | *Qu'est-ce qu'il vous faut ?*, *Et avec ceci ?*, *une tradition pas trop cuite*. Ezek nem tanári fordulatok, és az [S1]–[S3] forrás sem támasztja alá őket (egyiket sem nyitották meg). A napló a D1 és a D5 alatt hozzáadott értékként tünteti fel őket. | Forrás URL-lel, vagy kifejezett NyE-igazolás. Ha egyik sincs, jelölt tervi eltérésként kell szerepelniük a naplóban, hogy a GR jóváhagyhassa. |
| M4 | MINOR | Források; a 0.2 kapu állapota | A forrásrekord félrevezető. | A 0.2 kapu állapota „részben megvan”, de az [S2] és az [S3] csak keresési kivonat, NEM MEGNYITOTT. Az [S1] mellett „Hozzáférés: 2026-11-01” áll, pedig az oldalt nem nyitották meg. Az [S2] és az [S3] mellől hiányzik a dátum. | A 0.2 állapota legyen „NEM TELJESÜLT – szemantikai tartalékterv (K5)”. A hozzáférési dátumot „keresési kivonat, dátum” formára kell javítani. |
| M5 | MINOR | VÁLTOZÁSNAPLÓ, tanári táblázat | Nem szerepel benne minden tanári kifogás: hiányzik az A rész sora. A brief szerint minden kifogásnál meg kell mondani, hogyan kezelték. | Az A rész kifogásai: mesterkélt fordulat (*de nouvelles manières de manger*, *même reporté*), „manuel/magazin: non”. A terv 4. pontjában ennek van sora („más egységről szól; az elv itt is érvényes”), a naplóban nincs. | Egy sort kell felvenni, ugyanazzal a diszpozícióval, mint a tervben. |

BLOCKER és MAJOR nincs.

**NOTE-ok** (nem kötelező javítások, és nem számítanak bele a findingok számába):
- **N-a:** a p04 ardoise-án ott áll a *céréales* és a *noix*, vagyis az i03 és a s004 bővítménye. Ez stimulus, nem magyarázó példa, és determinánst nem árul el, ezért a 3.5-öt nem sérti.
- **N-b:** a s004 kerete (*on a aussi ___ petits pains aux noix*) közel áll a p04 példájához (*ils ont aussi des petits pains au lait*). A mátrix ezt megengedi; a független megoldó a K12 szerint ellenőrizze.
- **N-c:** a p09 3. ellenőrzőkérdése mellett nincs mikropélda, pedig a terv mindegyik mellé kér. Mivel maga a célkifejezés lenne a példa, elfogadható; a GR döntsön.
- **N-d (PE-nek):** a p02-ben a tanuló úgy írja le Léónak a kávézót (*celui avec la terrasse*), mintha Léo nem ismerné, pedig az i02 szerint Léo ajánlotta.

## 4. NEM VIZSGÁLT elemek és hiányzó bemenetek

- **E1 – a terv 0.1 kapuja, a kanonikus kimenet** (`apply-teacher-corrections.mjs`, kimenet és napló): nincs a bemenetemben. A célalakokat csak a régi `week-01.json`-hoz tudtam mérni. A terv kifejezetten előírja, hogy a NavE a futás bizonyítékát kapja meg. Amíg ez nincs meg, ezt a pontot nem minősíthetem PASS-nak. **Ez az oka a BLOCKED_EVIDENCE verdiktnek.**
- **E2 – a 0.3 kapu (OQLF-lap):** nincs megnyitva, ez a NyE feladata. Erre épül a p04 kivételszabálya, valamint az i03 és a s004 indoka. A Megoldás fázis előtt le kell zárni.
- **E3 – a (2,1)-es kiosztás:** hiányzik. Az `objectives` ESCALATED; a kéziratot nem érinti.
- **NEM VIZSGÁLT:** a szószámok (szkript), az EU Academy, a nyelvi természetesség (NyE és PE), a kulcsok egyértelműsége (független megoldó: K1, K2, s002 *de métro*, i06 *les acheter* és *on*).

## Összegzés

- **A hatókörömben lefedve:** p01–p09; i01–i08 minden subitemmel; a 3.5 mátrix; az idővonal; a VÁLTOZÁSNAPLÓ.
- **Findingok:** 5 MINOR (M1–M5), BLOCKER és MAJOR nincs. A szerkezet, az ID-k és a célalakok rendben vannak a régi kézirathoz képest.
- **Új bizonyíték:** a fenti tételes megfeleltetés. Webes forrást nem nyitottam meg.
- **Recheck-hatókör:** az M1–M5 által érintett helyek, plusz az E1 csatolása után a célalakok összevetése a kanonikus változattal.
- **Következő címzett:** CEO. Csatolja az E1-et, a szerzőnek pedig küldje vissza az M1–M5-öt.

GEPI_OSSZEGZES
verdict: BLOCKED_EVIDENCE
blocker: 0
major: 0
minor: 5
GEPI_OSSZEGZES_VEGE