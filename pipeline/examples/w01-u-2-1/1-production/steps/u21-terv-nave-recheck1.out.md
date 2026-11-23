# NavE recheck: U21 (w01-u-2-1, GI2) javítási terve, 1. javított változat

**Szerep:** NavE, követelmény- és szerkezeti ellenőrzés. Ez a 2. kör, az N1–N9 recheckje.

**Bemenet:**
- a GR javítási terve (1. javított változat, DRAFT_FOR_REVIEW);
- a javítási brief (2026-10);
- `week-01.json` → `units[w01-u-2-1]`;
- a tanári kifogások kivonata;
- a mércék;
- a saját első jelentésem (N1–N9).

**Hatókör:** az N1–N9 sorsa, valamint a változott részek és ami tőlük függ:
- 0. pont, 2. és 2.1 pont, 3.1–3.4 pont;
- p02/i01, p03/i02, p04/i03, p06/i05, p07/i06, p08/i07, p09/i08;
- az időkeret.

A francia fordulatok természetességét és a hivatkozott források tartalmát nem minősítem. Ezek a PE, a NyE és a HE feladatai.

---

## 1. A korábbi findingok recheckje

| ID | Eredeti súly | Állapot | Indoklás | Maradék |
|---|---|---|---|---|
| **N1** | MAJOR | **PARTIALLY FIXED** → maradék MINOR | **Ami rendben van:** a 0.1 pont a kanonikus kimenetet kötelező alapnak nevezi. Eltérésnél a kanonikus változat nyer, és az anyag visszamegy a GR-hez. Fel van sorolva, mely itemeket érinti valószínűleg a FICHE-01 (B3 → i04 és i07-s005; B6 → p06, i05, s006, p09). Ez a kapu elég ahhoz, hogy egy elfogadott tanári javítás ne vesszen el. **Ami nyitott:** a kimenetet sem a GR, sem én nem láttam. Az egyeztetést a 0.1 pont rám bízza („a NavE … szkripttel hasonlítsa össze”). A NavE nem futtat szkriptet, a gépi összevetés a CEO szkriptjének feladata. | A 0.1 pontban a felelős legyen a CEO-szkript, a NavE csak a futási bizonyítékot kapja meg. A kimenetet a Kézirat fázis előtt csatolni kell. |
| **N2** | MAJOR | **FIXED** | A „nem célváltozás” állítást a GR visszavonta (1. pont, K8). A régi nyitott döntések tételesen szerepelnek a 2.1 pontban, és az `objectives`-kérdés eszkalálva van. Ezt helyesnek tartom: a terv a `targetManifest`-et és az `approvedObjectives`-t érintetlenül hagyja, és az *être* / *sans* célokat sem törli, sem nem tanítja. Ez a terv tehát nem szűkíti a célt. Az eltérés régebbi, mint ez a javítás. | Nincs. (A K8 egyik részletéről lásd N10.) |
| **N3** | MAJOR | **FIXED** | Az i01 két mondata igével és bővítménnyel egyértelmű, a félreértés csak a p02 magyarázatában van. Erre szolgál a K9 és a kontextus nélküli megoldói ellenőrzés. Ez magát a kétértelműséget megszünteti. | A kimásolhatóságot lásd N11 alatt. |
| N4 | MINOR | **FIXED** | Négy névvel rögzített szereplő van, a *nous* = én + Camille. A p07 a tanuló saját piszkozata, a szereplő- és időtábla kötelező (K10). | – |
| N5 | MINOR | **FIXED** | Az i02 hímnemű, azonosított helyet kap (*le petit café en face du marché*), így a *de la*-distractor érvényes. | Az új mintahelyről lásd N12. |
| N6 | MINOR | **FIXED** | A műfaj gondozott ajánló rovat lett, nem informális *avis*, és a táblakategória az i03 fölött látszik. | – |
| N7 | MINOR | **PARTIALLY FIXED** → MINOR | **Ami rendben van:** Léo üzenete látható előzményt ad az *en*-hez, a tagadás udvarias visszautasítás. **Ami nyitott:** a visszautasítás mintaindoka („ezt már megvettük”) ellentmond a terv saját idővonalának. A p07 szombat este játszódik, a vásárlás vasárnap 8:45-kor. A rögzített kulcsmondatok funkciója sincs kimondva. Léo azt ajánlja fel, hogy *hoz* valamit, a kulcs viszont *Je vais en prendre deux* és *Nous ne voulons pas en acheter*, vagyis a mi vásárlásunkról szól. | Az „ezt már megvettük” indok kerüljön ki; maradhat a „Camille nem szereti” vagy hasonló. A terv mondja ki, hogyan illik a két kulcsmondat Léo ajánlatára adott válaszba (pl. „holnap reggel úgyis megyek, majd én veszek belőle kettőt; a másikból nem kérünk”). |
| N8 | MINOR | **FIXED** | A p09 tartalmi elemei az új helyzethez igazodnak, a nyelvi `allCriteria` változatlan. | Egy kapcsolódó résről lásd N13. |
| N9 | MINOR | **PARTIALLY FIXED** → MINOR | A forrás a Kézirat fázis előfeltétele lett, és van tartalékterv: ha nincs tábla-forrás, csak a szemantikai indok marad. A nyelvtani referencia ellenőrzése a NyE-hez került. Továbbra sincs megnyitott forrás. Az OQLF-állítás csak keresési kivonaton alapul, és ezt a terv korrektül jelöli. Tervszinten így elfogadható. | A Kézirat fázis csak a 0.2 forráslista és a NyE által megnyitott OQLF-lap után indulhat. |

---

## 2. Új findingok (a változott részekből és a kapcsolataikból)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck-hatókör |
|---|---|---|---|---|---|---|
| **N11** | **MAJOR** | 2. tábla („Mért célalakok … szó szerint marad”, „magyarázatok … új példákkal”); 3.2: p02→i01, p04→i03, p06→i05, p07→i06 | A kulcsmondatok szó szerint maradnak, de a terv nem tiltja, hogy ugyanezek a mondatok a megelőző magyarázatban is szerepeljenek. A régi egységben ez rendszerszintű volt: <br>• a p06 négy példája azonos az i05 négy stimulusával és megoldásával; <br>• a p07 példái és ellenpéldái azonosak az i06 kulcsával és stimulusával; <br>• a p02 példái azonosak az i01 stimulusával; <br>• a p04 *Nous servons d'excellents croissants* és *La carte propose des petits pains aux céréales* mondata gyakorlatilag az i03 kulcsa. <br>Az új terv ezt több helyen kifejezetten valószínűsíti: <br>• a p06 passé composé-példája és az i05-4 ugyanabból a 10:15-ös üzenetből jön, ugyanarról a vásárlásról; <br>• az i01 a p02 jelenetének „tisztázott változata”. <br>Az i05-s001 a `targetManifest` szerint mérési kötés (`w01-g-en-partitive-reference`). Ha a tanuló a magyarázatból kimásolja a választ, a mérés érvénytelen. Ezt az első körben nem jeleztem. Most azért kerül elő, mert a p02, p06 és p07 kerete a javítás során megváltozott, és ezek érintett kapcsolatok. | Mérce, 1. rossz példa (kimásolható megoldás). Régi p06 „Példák”, régi i05 stimulus és kulcs; régi p07 „Példák” és „Ellenpéldák”, régi i06; régi p02, régi i01. | Kerüljön a tervbe egy szerzői előírás: egy magyarázó oldal példái nem tartalmazhatják a hozzá tartozó item stimulusát vagy kulcsmondatát, sem azonos ige + főnév + szám kombinációban. A szabályt más igével, főnévvel és mozzanattal illusztrálják. Konkrétan: <br>• p06: a pultjelenet és a 10:15-ös üzenet példái más főnévvel és számmal szerepeljenek, mint az i05; <br>• p07: a példák ne legyenek azonosak az i06 kulcsával; <br>• p02: az i01 két mondata más igét és más helyet használjon, mint a p02 jelenete. <br>Vegyék fel K-kockázatként, és a független megoldó ellenőrizze. | 2. tábla, 3.2 (p02, p04, p06, p07), K-tábla |
| N10 | MINOR | 2.1 utolsó sor, K8 | A K8 szerint a `targetIds` igazítása „szkriptfeladat”, de az irány nincs megadva. A *beaucoup des* részhalmaz-jelentését az `approvedObjectives` 4. pontja kimondja, az i04 és az i08 `quantity_subset` kritériuma méri, a `targetManifest`-ben viszont nincs. Ha a szkript egyszerűen törli az i04-ből a manifesten kívüli ID-t, a mért cél kötés nélkül marad. Ha felveszi a manifestbe, az a mért célok listájának bővítése. Ezt egy szkript nem dönti el. | `targetManifest` (8 cél, nincs köztük `…-quantity-subset`); az i04 `targetIds` mezője; `approvedTargetAlignment` (`w01-g-de-quantity-subset`, `g-beaucoup-de-vs-des`). | A terv mondja ki az irányt. Javaslat: az `approvedObjectives` 4. pontjához igazítva a cél kerüljön be a manifestbe, i04- és i08-kötéssel. A szkript csak ezt hajtsa végre. Ha a CEO ezt célbővítésnek tekinti, menjen a 2.1 eszkalációhoz. | K8, 2.1 |
| N12 | MINOR | 3.2 p03/i02; 3.3 s002 | Az s002-nél a terv kimondja, hogy a hely előtt és után ne álljon másik *du*, mert a régi *du marché* elárulta az alakot. Az i02-re javasolt *le petit café en face du marché* ugyanezt a szivárgást hozza be. Emellett az i02 („ott voltam 8-kor”, *revenir de*) és az s002 („8:00 után, kilépés a kávézóból”) ugyanaz a mozzanat ugyanazzal a hellyel. A p02/i01 is ezt a helyet használja mintaként. Így egyetlen hely három mérésben szerepel. | 3.3 s002 előírása; mérce, 4. rossz példa (ugyanaz a helyzet). | Az s002 szivárgási szabálya az i02-re is vonatkozzon (a hely bővítménye ne *du*-val álljon). Az s002 más hímnemű helyet vagy más mozzanatot kapjon az idővonalon (pl. *le marché* a 8:30 előtti útvonalon). | i02, s002, p02/i01 |
| N13 | MINOR | 3.2 p09, a tartalmi elemek táblája | A régi 1. tartalmi elem („ital vagy étel rendelése”) adott természetes helyet a partitív *du*-nak. Az új hat elem közül egyik sem kér meghatározatlan anyagmennyiséget. A `partitive_vs_contracted` kritérium viszont kötelező marad. Ez épp azt a checklist-jellegű beillesztést segíti elő, amelyet a régi nyitott döntés (az `allCriteria` szigora) és a K4 kockázatként jelölt. | Régi `briefMarkdown`, 1. tartalmi elem; új tartalmi tábla, 1–6. elem. | A 2. elem („mit hozzon még Léo”) kapjon egy anyagnévi lehetőséget is (pl. *du jus d'orange*, *du beurre*), és mindkét modellben ott jelenjen meg a partitív *du*. A nyelvi kritérium nem változik. | p09 tartalmi elemei, modellek |

---

## 3. A lánc megfeleltetése (csak a változott sorok)

| Elem | Állapot az 1. körben | Most |
|---|---|---|
| Brief → kanonikus alap | ✘ | kapu megvan, a kimenet még hiányzik (N1, PARTIALLY FIXED) |
| Brief → forrásból induló tervezés | részleges | Kézirat-előfeltétel (N9, PARTIALLY FIXED) |
| Cél, ID-k, feladattípus | ✔, részben | ✔; az `objectives` eszkalálva (N2, FIXED) |
| Terjedelem és idő | ✔ | 34–45 perc, jelölt eltérés becsléssel; a feltétel, hogy 42 percen belül a régi érték marad, a funkciópróba-hét követelményének megfelel ✔ |
| i01 | két helyes elemzés lehetséges | egyértelmű ✔, de kimásolható lehet (N11) |
| i02 | a nem nincs rögzítve | ✔ (N12) |
| i03 | regiszter | ✔ (a p04-gyel való átfedésről lásd N11) |
| i05 | a *nous* kérdéses | ✔ (kimásolhatóság: N11) |
| i06 | nincs előzmény | előzmény ✔; idővonal és funkció (N7) |
| i08 | a tartalmi elemek nyitottak | ✔ (N13) |
| Tanári kifogások (A, B3, B4, B6, C1, C4, D1–D5) | ✔ | ✔ változatlanul lefedve |

**Ellenőrizve, rendben:**
- 2.1: a régi nyitott döntések;
- 3.1: a szereplők és az idővonal (az N7-ben jelzett ellentmondás kivételével);
- 3.3: az s001, s003, s004, s005 és s006 előírásai;
- 3.4: a terhelési korlátok;
- K9–K11.

---

## 4. NEM VIZSGÁLT, hiányzó bemenetek

- A `kanonikus/apply-teacher-corrections.mjs` kimenete és naplója: továbbra sincs a bemenetemben (N1).
- A GR (2,1)-es kiosztása: hiányzik. Az N2 ettől függetlenül lezárható volt, mert a terv nem érinti a vitatott célokat.
- Az OQLF-lap és a pékségi források: nem nyitottam meg, a NyE és a szerző hatóköre (N9).
- A francia fordulatok természetessége: PE és NyE.

---

## Összefoglalás

- **Verdikt:** REVISION_REQUIRED. Egy MAJOR maradt nyitva: az új N11 (a magyarázatok példái és a kulcsmondatok átfedése).
- **A korábbi findingok:**
  - FIXED: N2, N3, N4, N5, N6, N8;
  - PARTIALLY FIXED, maradék MINOR: N1, N7, N9.
- **Új findingok:** N10, N12, N13 (MINOR) és N11 (MAJOR).
- **A következő recheck szűk:** N11 (a 2. tábla és a 3.2 egy előírással), valamint az N1, N7, N10, N12 és N13 érintett sorai.
- **Új bizonyíték:** a fenti megfeleltetés, valamint a régi p02/p04/p06/p07 ↔ i01/i03/i05/i06 tételes összevetése a `week-01.json`-ban.
- **Újrahasznosított bizonyíték:** az 1. kör megfeleltetése a nem változott sorokra.
- **Tanulság:** ha egy javítás szó szerint megtartja a kulcsmondatokat, de újraírja a magyarázatokat, a tervben előírásként kell szerepelnie, hogy a magyarázat példái nem ismételhetik a kulcsot. Különben a régi átfedés észrevétlenül átkerül. Hatókör: minden javítási terv, amely „a mért célmondat marad” elvvel dolgozik.
- **Következő címzett:** CEO. A javítás a GR-é, a recheck az N11-re és a fenti MINOR-okra vonatkozik.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 6
GEPI_OSSZEGZES_VEGE