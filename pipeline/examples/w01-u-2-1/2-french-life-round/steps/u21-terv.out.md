# U21 (w01-u-2-1, GI2) – javítási terv, T27 nyelvi kör

**Szerep:** a nyelvtan oszlop rendezője (GR). A feladat a meglévő, tanári bírálatot kapott egység javítási terve.
**Bemenet:**
- a T27 javítási brief (a PRESIDENT 2026-11-15-i parancsa, S13–S21);
- az élesben futó kézirat (`w01-u-2-1.kezirat.md`, 1. javítási kör);
- az élesben futó megoldás (`w01-u-2-1.megoldas.md`, 5. változat);
- a CL-27 39 jelzése;
- a T07, T08 és T27 bejelentés;
- a szintmérce és a típusmérce.

**Hatókör:** a tanulói felület nyelve. Ez a cím, az utasítás, a helyzetleírás, a példák körüli címkék, a brief, a két ellenőrzőlista, a modellcímek és a rubrika. Kész tanulói szöveget, kulcsot és distractort nem írok.
**Hang:** az egységhez nincs felvétel, hangdöntési pont nincs.
**Forrás:** ebben a körben webes forrást nem nyitottam meg (NEM VIZSGÁLT), mert a feladat tisztán nyelvi és szerkezeti. A 0.3 kapu (OQLF, *petits pains*) változatlanul nyitott, és ez a kör nem érinti.

---

## 0. Két alapdöntés a megbízáson belül (jelölve)

**D1 – A tanári utasítás *vous*, a szerepjáték *tu*.**
- Az oldal- és itemutasítás a brief szerint egységesen *vous*-formájú: *Choisissez…*, *Complétez…*, *Remplacez…*, *Écrivez…*, *Corrigez…*.
- A szerepjáték elbeszélő helyzetszövege tegező marad (*Tu acceptes :*, *Léo t’écrit*, *Camille et toi, vous faites la queue*).
- **Indok:**
  - több itemmondat maga is tegező, és a hiányt tartalmazza (s002: *Tu l’attends à la sortie ___ métro*). Ezek a feladat részei, nem írhatók át;
  - a történetben a *vous* jelentése rögzített: a tanuló és Camille (i05-4: *vous avez ouvert la boîte*), illetve a pék magázása. Ha az elbeszélés is magázná a tanulót, a *vous* háromféle jelentése összecsúszna.
- **Gyakorlati szabály:** az utasítás külön mezőben vagy sorban áll, a helyzet külön. Egy mondaton belül nincs *tu*/*vous*-váltás. Ahol a helyzet utasítással zárul (i08: *Réponds-lui.*), ott az utasítás átkerül az utasításmezőbe (*Répondez à Léo.*), a helyzet pedig Léo üzenetével zárul.

**D2 – A kontrasztlisták kettéválnak.** A CL-27 a p02–p06 kontrasztsorait „example” szerepű magyar szövegnek jelzi. Egy sor jelenleg francia mondat + magyar ítélet és indoklás.
- **Új bontás:** a példa francia mondat + rövid francia ítéletcímke. A címke lehet ✗ / ✓, *incorrect*, *correct, autre sens*, *à l’oral ; à l’écrit soigné : …*.
- Az indoklás (miért) magyarul marad, a megjegyzés (`note`) szerepében. Ez nyelvtani magyarázat, a pontos megértés múlik rajta.
- **CEO-leképezési pont:** a JSON-ban a magyar rész külön `note` szerepű elem legyen, különben a CL-27 tovább figyelmeztet.

---

## 1. Diagnózis

- **Valóságpróba: rendben.** A helyzet már most francia élet:
  - kitalált pékség a Croix-Rousse platóján;
  - valós helyek: a Parc de la Cerisaie, a Croix-Rousse metróállomás és a boulevard-i piac;
  - vasárnapi sor a boulangerie előtt, foglalás Instagramon, *ardoise*, *à la coupe*, *à la part*, *formule petit-déj*, vasárnapi brunch;
  - az idővonal egységes, és az előző körök (PE, NavE) után ellentmondásmentes.

  A tanár és a PRESIDENT kifogása nem a helyzetre vonatkozik, hanem arra, hogy a tanulói felület keretszövege magyar.
- **A baj tehát a felület nyelve:**
  - **p01:** a helyzetleírás magyar (CL-27 HIBA);
  - **p02–p06:** a kontrasztlisták címe és ítéletei magyarok;
  - **p09:** a brief (címzett, regiszter, cél, terjedelem), a tartalmi és a nyelvi ellenőrzőlista, valamint a két modellcím magyar;
  - **i08:** a rubrika (a megoldásban) magyar.

  Emiatt a francia szerepjáték magyar nyelvű keretben fut. Ez épp a T27 által kifogásolt kettősség.
- **Az utasítások már franciák, de tegezők** (*Lis…*, *Choisis…*), ami eltér az egységes, *vous*-formájú tanári francia stílustól.
- **Nevek:** nincs magyar név (Camille, Léo, *la boulangère*, Paul). A T08 erre az egységre nem ad feladatot.
- **Érdekesség és műfaj:** a műfajok hitelesek és változatosak:
  - SMS-váltás;
  - Instagram-ardoise;
  - kalauzrovat;
  - pékségi honlap;
  - foglalási DM;
  - pultjelenet és reklamáció;
  - baráti válaszüzenet.

  Új helyzetre nincs szükség, és a brief szerint nem is szabad. A p01 francia helyzetleírása viszont legyen élő és konkrét (vasárnapi brunch-szokás, sor, foglalás előző este), ne tankönyvi összefoglaló.
- **Szint:** a FICHE-01 szerint a partitív és az *en* B1+-on ismétlés. Ez ismert, de ebben a körben a szint és a cél nem változhat (brief: „Mi NEM változik”). Az egység ezt már most a forma–jelentés kontraszttal, a regiszterrel és a lexikalizált *des*-sel ellensúlyozza. NOTE, nem e kör feladata.
- **Egy új kockázat a francia felülettel:** a nyelvi ellenőrzőlista franciául metanyelvi szöveg lesz (*verbe conjugué*, *auxiliaire*, *adjectif placé avant le nom*). Ez B1+-on érthető, de a magyar magyarázat terminusaihoz (*ragozott ige*, *segédige*, *elöl álló melléknév*) kötni kell (lásd 5. rész).

## 2. Mi marad (és miért)

| Elem | Marad | Indok |
|---|---|---|
| Tanulási és mérési cél | mind a 9 célkód (`w01-g-det-partitive-mass` … `w01-g-integrated-writing`) | brief: a cél és a szint nem változik |
| Oldal- és item-ID | p01–p09, p09b; i01–i08, a subitemekkel (i05-s001, i07-s001…s006, i08-s001) | a tanulói haladás az ID-khez kötődik |
| Feladattípusok | i01 rövid metanyelvi válasz · i02 QCM · i03/i04 kétmezős kitöltés · i05 négy transzformáció · i06 hibajavítás · i07 vegyes (5 kitöltés + 1 transzformáció) · i08 írás 6–8 mondatban | változatlan mérés |
| Itemmondatok és stimulusok | szóról szóra; a változás csak tipográfiai (’) | a feladatot nem írjuk újra |
| Kulcsok, alternatívák, F/N/E kategóriák, normalizálás | változatlanok | az aposztróf-normalizálás miatt a ’ csere nem érinti az egyezést |
| Zárt válaszkészletek | i03: *de, d’, des*; i04: *beaucoup de / beaucoup des*; i07: *du, de la, de, d’, des* | az E-01 és az E-08 mérési döntése |
| Szerkezetmegtartó utasítás (i06) | a „csak a hibát javítsd, a többi szót tartsd meg” tartalom | az E-02 döntése, erre épül az F01–F06 |
| Magyar nyelvtani magyarázat, emlékeztető, kulturális párhuzam (p04: „péksütemény”), a p06 *Je vais vous prendre* megjegyzése | magyarul | a brief „marad magyar” köre |
| Feedback (i01–i08) | magyarul, változatlan szöveggel | a magyarázó rész magyar; a „próbáld újra” fordulat önmagában nem indokol új kört (NOTE) |
| Modellszövegek (A, B, C) és tartalmuk | változatlanok, csak tipográfia | tanári kifogás nem érte őket |
| Idővonal, szereplők, helyszín | változatlanok | már francia élet, és az itemek erre épülnek |
| Terjedelem, időkeret (34–45 perc) | változatlan | brief |

## 3. Mi változik és miért

### 3.1 Helyzet

Új helyzet nincs. A meglévő keret (Lyon, Croix-Rousse, *Le Pain Perché*, vasárnapi brunch) a francia életet adja át: a vasárnapi pékségi rítust, az előző esti foglalást, az *ardoise*-t és a piacot. Ez Franciaországban hiteles, és az itemek erre épülnek. Csak a p01 magyar helyzetleírása lesz francia.

**A p01 francia helyzetleírásának vázlata** (tegező, lásd D1):
1. Ki vagy és hol: Lyonban, a Croix-Rousse-on laksz Camille-lal, a lakótársaddal.
2. A tét: vasárnap 11-re brunchra jön Léo.
3. Az ív: szombat este pékséget választasz és foglalsz; vasárnap reggel sorba állsz, rendelsz a pultnál, és közben üzensz Léónak.
4. Egy mondat a *nous* = te + Camille rögzítésére, mert az i05-4 és az i06 erre épül.

Új tény, név, időpont és termék nem kerülhet bele; a p01 nem árulhat el itemkulcsot (3.5).

**A p01 többi része:**
- Az „A determinánsokat… már ismered” bekezdés tanári hangon, *vous*-ban lesz francia.
- A négy célpont már francia, infinitívuszos alakja marad.
- A *Petit repère* tegezése semleges szerkezetre vált (*on*).

### 3.2 Elemenként

| Hely | Most | Lesz | Szerző | Megjegyzés |
|---|---|---|---|---|
| Blokk- és oldalcímek | franciák; a p01 tegező | a p01 cím tegezés nélküli, rövid és természetes; a többi marad | blokkíró | csak cím |
| p01 text#0 | magyar helyzet | francia helyzet (3.1) + francia, *vous*-os tájékoztató | blokkíró | CL-27 HIBA |
| Oldalutasítások p01–p09 | francia, *tu* | francia, *vous* | blokkíró | a tartalom azonos |
| Itemutasítások i01–i08 | francia, *tu* | francia, *vous*, a mérési elemek szó szerinti megtartásával (5. rész) | blokkíró | i06: a *Ton brouillon* helyett semleges alany (*Le brouillon…*), mert a többi utasítás *vous*-os |
| i01 válaszmód | rejtett szerzői adat | a tanuló lássa: *(en français ou en hongrois)* | blokkíró | a megoldás eddig is mindkettőt elfogadja; francia utasítás mellett e nélkül a tanuló azt hihetné, hogy franciául kell felelnie |
| Helyzetjelzők és stimulusok | francia, *tu* | változatlanok; csak tipográfia (’) | – | D1 |
| i08 stimulus vége | *Réponds-lui.* | a helyzet Léo üzenetével zárul, a *Répondez à Léo* az utasításba kerül | blokkíró | D1 |
| Kontrasztlisták címe (p02–p05) | „Kontraszt” | francia belső cím (pl. *Contraste* / *À comparer*) | blokkíró | csak cím |
| Ellenpéldák címe (p06) | „Ellenpéldák” | francia belső cím (pl. *Contre-exemples*) | blokkíró | csak cím |
| Kontrasztsorok (p02 ×3, p03 ×1, p04 ×2, p05 ×3, p06 ×4) | francia mondat + magyar ítélet | francia mondat + francia ítéletcímke; a magyar indoklás külön `note` elem (D2) | blokkíró; leképezés: CEO | a címke a mostani ítéletet adja vissza, nem újat; a p04 2. sora az E-03 és a 0.3 kapu miatt pontosan ugyanazt állítsa |
| Belső szakaszcímek a tanulói nézetben (pl. „Természetes példák”, „Magyar emlékeztető”, „Kulturális háttér”, „Magyar előkészítés”) | magyar | ha a tanuló látja: francia cím (*Exemples*, *Rappel*, *Repère culturel*…), a magyar törzs marad | blokkíró | a CL-27 nem jelezte; a kör végén szkript ellenőrzi |
| p09 brief (4 sor) | magyar | francia: *Destinataire*, *Registre*, *Objectif*, *Longueur*; tartalma 1:1 | blokkíró | — |
| p09 tartalmi lista (cím + 6 sor) | magyar | francia, *vous*-os tanári hangon; a 6 elem sorrendje és tartalma 1:1 | blokkíró | a 2. elem példái (sajt, gyümölcslé) francia alakban |
| p09 nyelvi lista (cím + 6 sor) | magyar | francia; a metanyelvi terminus mellé magyar zárójel, ahol a p02–p06 magyar terminust tanított (*verbe conjugué (ragozott ige)*, *auxiliaire (segédige)*, *adjectif placé avant le nom (elöl álló melléknév)*, *une certaine quantité (valamennyi)*) | blokkíró | a hat sor 1:1 az `allCriteria` hat elemével |
| p09b modellcímek (A, B) | magyar | francia címke (pl. *Modèle A – …*, *Modèle B – …*), a jelleg megtartásával (lelkes ajánlás / óvatos „oui, mais…”) | blokkíró | — |
| i08 rubrika (megoldás) | magyar | francia: a négy terület, a pontok, a négy szint (pl. *non atteint / partiel / atteint / excellent*), az „Insuffisant” lista | megoldásíró | a küszöbök (A ≤ 3; A = 6, B ≥ 5…) és a tartalom 1:1; magyar zárójel csak terminusnál |
| i08 elutasított minták (R1, R2) és C minta | francia szöveg, magyar kommentár | a mintaszöveg marad, a kommentár szerzői adat | – | — |
| Tipográfia mindenütt | sok egyenes ' a kéziratban, ' a p09 listában („de/d'”) | ’, NBSP a ; : ! ? előtt és a « » belsejében | blokkíró, megoldásíró; ellenőrzés: HE | a kulcsegyezést nem érinti (normalizálás) |
| Nevek | – | nincs csere | – | a T08 itt üres |

### 3.3 Szintemelés

Új szerkezet nem kerül be. A meglévő szintemelő elemek maradnak, nem mért elemként:
- *même si* (i03, p04);
- *tandis que* (p05);
- *ne pas payer de mine*;
- *ne jurer que par*;
- *à tomber*.

A francia utasításokba és listákba ne kerüljön B2 fölötti vagy újonnan mért szerkezet. Az utasítás legyen rövid és egyértelmű; a nehézség a feladatból jöjjön, ne az utasításból.

### 3.4 Az itemek igazítása

Egyik item sem kérdez mást, mint eddig.

| Item | Mit kérdez (változatlan) | Mi változik rajta |
|---|---|---|
| i01 | a két *du* értéke | *vous*-os utasítás; a válasz nyelve látható |
| i02 | *revenir du café* | *vous*-os utasítás |
| i03 | *d’excellents* / *des petits pains* | *vous*-os utasítás, a *de, d’ ou des* készlet szó szerint |
| i04 | *beaucoup de* / *beaucoup des* | *vous*-os utasítás, a két alak szó szerint |
| i05 | négy *en*-helyzet | *vous*-os utasítás; a stimulusok tegezők maradnak |
| i06 | két hibajavítás | *vous*-os utasítás, semleges alany; a „seulement l’erreur” és a „tous les autres mots” elem megmarad |
| i07 | 5 kitöltés + 1 transzformáció | *vous*-os utasítás, az öt alak szó szerint |
| i08 | integrált írás | francia brief, listák és rubrika; az utasítás *vous*-os |

## 4. Kifogásonként

| # | Kifogás (hely) | Kezelés |
|---|---|---|
| T07, T27 | túl sok magyar a felületen | a 3.2 táblája; a megmaradó magyar csak a brief „marad magyar” köre |
| T08 | magyar nevek | az U21-ben nincs magyar név; nincs teendő |
| 1 | p01 text#0, magyar helyzet (HIBA) | francia helyzet (3.1) és francia tájékoztató |
| 2 | p02 list#4 cím „Kontraszt” | francia belső cím |
| 3 | p02 *Je bois de café.* | francia mondat + ✗ címke; a magyar indoklás `note` (D2) |
| 4 | p02 *On parle de café.* | ✓ + *autre sens* címke; a magyar indoklás `note` |
| 5 | p02 *On parle du café.* | francia címke; a magyar indoklás `note` |
| 6 | p03 list#2 cím | francia belső cím |
| 7 | p03 *Je voudrais du jus d’orange.* | francia címke (*partitif*); a magyar indoklás `note` |
| 8 | p04 list#4 cím | francia belső cím |
| 9 | p04 *Ils font des belles tartes.* | francia regisztercímke (oral / écrit soigné); a magyar indoklás `note` |
| 10 | p04 *Ils vendent de petits pains.* | francia címke; a magyar indoklás `note`; a tartalma azonos az E-03-mal (0.3 kapu) |
| 11 | p05 list#3 cím | francia belső cím |
| 12 | p05 *Beaucoup des gens attendent…* | ✗ címke; a magyar indoklás `note` |
| 13 | p05 *Beaucoup d’habitués…* | francia címke; a magyar jelentés `note` |
| 14 | p05 *Beaucoup des habitués du dimanche…* | francia címke; a magyar jelentés `note` |
| 15 | p06 list#4 cím „Ellenpéldák” | francia belső cím |
| 16 | p06 *Elle va commander en six.* | ✗ címke; a magyar szabály `note` |
| 17 | p06 *Camille a en pris quatre.* | ✗ címke; a magyar szabály `note` |
| 18 | p06 *Camille en a pris quatre cannelés.* | ✗ címke; a magyar szabály `note` |
| 19 | p06 *Camille ne boit pas en.* | ✗ címke; a magyar szabály `note` |
| 20 | p09 brief, Címzett | *Destinataire*, franciául |
| 21 | p09 brief, Regiszter | *Registre*, franciául (familier, sans argot, SMS, tutoiement) |
| 22 | p09 brief, Cél | *Objectif*, franciául, 1:1 |
| 23 | p09 brief, Terjedelem | *Longueur*, franciául |
| 24 | p09 list#2 cím | francia belső cím |
| 25–30 | p09 list#2, 1–6. tartalmi elem | franciául, sorrend és tartalom 1:1 |
| 31 | p09 list#3 cím | francia belső cím |
| 32–37 | p09 list#3, 1–6. nyelvi kérdés | franciául, magyar terminuszárójellel; 1:1 az `allCriteria`-val és a rubrika A területével |
| 38 | p09b model#0 cím | francia modellcím |
| 39 | p09b model#1 cím | francia modellcím |
| (CL-27 gépi) | egyenes aposztróf, azonos bejegyzésű lista, munkacím | ’ mindenütt; azonos listaelem és munkacím nincs, a szkript újraellenőrzi |

## 5. Kockázatok és elkerülésük

1. **Az utasítás fordítása elmossa a mérési feltételt.**
   - Az i06-ban az E-02 két eleme („csak a hibát” és „minden más szót tarts meg”) franciául is kifejezett legyen, mert az F01–F06 feedback erre hivatkozik.
   - Az i03, i04 és i07 alakkészlete betűre egyezzen a megoldás F01 és `incorrect` szövegével.
   - **Recheck:** NavE.
2. **Két jelentésű *vous*.**
   - A *vous*-os utasítás nem kerülhet a tegező helyzetmondatba (D1).
   - Az i05-4 és a p05 *vous*-a (te + Camille) maradjon egyértelmű.
   - **Recheck:** UE.
3. **A francia ellenőrzőlista nehezebb, mint a mért szerkezet.**
   - Terminuszárójel a magyar magyarázat szavaival.
   - Minden sor maradjon rövid, példával.
   - Az UE kulcs nélkül, csak a francia lista alapján próbálja meg az önellenőrzést.
4. **A rubrika fordítása elcsúsztatja a pontozást.**
   - A megoldásíró csak nyelvet cserél; a küszöböket, a kritériumok számát és a szintsorrendet változatlanul hagyja.
   - **Recheck:** NavE, tételes 1:1 összevetéssel.
5. **A kontrasztcímke mást állít, mint a magyar indoklás.**
   - Különösen a p04 2. sorában (regiszter és lexikalizáció; feltételes a 0.3 kapun).
   - A címke csak ítélet, az indoklás magyar marad.
   - **Recheck:** PE (csak ez a 13 sor).
6. **A CL-27 a szétválasztás után is figyelmeztet**, ha a magyar `note` a JSON-ban a lista „example” elemében marad. Ez CEO-leképezési pont (D2).
7. **A francia p01-helyzet kulcsot szivárogtat** (3.5) vagy új tényt hoz, ami ellentmond az idővonalnak. Tilos az új termék, időpont és példamondat; a p01 csak keret. **Recheck:** NavE.
8. **A feltételes 0.3 kapu:** ha a NyE később a *de petits pains* mellett dönt, a p04 francia címkéje is a visszautalt elemek közé kerül (az E-09 kiegészül egy hellyel).
9. **Glosszák:** az új francia keretszövegekhez (p01, p09 brief és listák, rubrika) F glosszát készít, a végleges szöveg után.

## A szerzők bemeneti követelményei

- **Blokkíró (kézirat, csak a változás, `BLOKK_JAVITAS`):**
  - a 3.2 tábla összes „blokkíró” sora, a D1–D2 szerint;
  - a változásnaplóban tételesen: mi lett francia (cím, utasítás, helyzet, egyéb), névcsere nincs, és mi maradt szándékosan magyar és miért.
- **Megoldásíró:**
  - csak az i08 rubrikája (francia), és a feedbackben a francia idézett alakok tipográfiája;
  - kulcs, alternatíva és feedbackszöveg nem változik.
- **CEO (szkript):**
  - a D2 leképezése (example + note);
  - a CL-27 újrafuttatása;
  - a p09b `visibleAfter` (korábbi N-04 (a), változatlan).
- **Ellenőrzés:**
  - NavE: a 39 jelzés lefedése, az ID- és kulcsváltozatlanság, a rubrika és a lista 1:1 egyezése;
  - NyE és HE: minden új francia szöveg;
  - PE: a 13 kontrasztcímke;
  - UE: végigjárás csak a francia utasításokkal.

---

**Változáslista:** új javítási terv a T27 nyelvi körhöz. A cél, az ID, a kulcs, az item, a terjedelem és a hang nem változik.

**Findingok (saját):**

| ID | Súly | Hely | Leírás | Recheck |
|---|---|---|---|---|
| GR-T27-01 | NOTE | i01 | A francia utasítás mellett a válasz nyelve nem látható; a tanulói nézetbe kerül. | NavE, UE |
| GR-T27-02 | NOTE | p02–p06 | A D2 szétválasztás leképezési feladat. | CEO |
| GR-T27-03 | NOTE | egész egység | A FICHE-01 szintkifogása (a partitív és az *en* ismétlés) ebben a körben nem kezelhető (brief); a későbbi tervezés tudja. | CEO |

**Hiányok:** a 0.3 kapu (OQLF) nyitott, a kört nem blokkolja. Döntési kérdés nincs: a D1 és a D2 a megbízáson belül született, jelölve.

**Bizonyíték:**
- **Új:** a kézirat, a megoldás és a 39 CL-27 jelzés tételes összevetése.
- **Újrahasznosított:** a NavE és a PE korábbi PASS-ai a változatlan itemekre.
- **Webes forrás:** NEM VIZSGÁLT, nem volt szükséges.

**Következő címzett:** CEO.

**Tanulság:** ha a szerepjáték tegező, de a tanári utasítás magázó → az utasítás és a helyzet külön mezőben álljon, a helyzetmondat ne kapjon *vous*-t → különben a történeten belüli *vous* (többes szám vagy magázás) jelentése összecsúszik → minden szerepjátékos egység T27-es körében.

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE