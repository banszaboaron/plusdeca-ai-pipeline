# U21 (w01-u-2-1, GI2): *Du, des, de : forme ou sens ?* — javítási terv, 1. javított változat

**Szerep:** GR (nyelvtan-rendező). **Megbízás:** a meglévő egység javítási terve, 1. hét, 2026-10-es javítás, első javítási kör.
**Bemenet:**
- a saját korábbi tervem (DRAFT_FOR_REVIEW);
- a NavE jelentése (N1–N9) és az UE jelentése (U1–U8, két NOTE, a J1 javaslat);
- a javítási brief, a `week-01.json` → `units[w01-u-2-1]`, a tanári kifogások, a mércék.

**Hiányzó bemenetek:**
- a `kanonikus/apply-teacher-corrections.mjs` kimenete és naplója;
- a GR (2,1)-es oszlopterve és kiosztása;
- a DONTESEK 10-28 teljes szövege.

**Hatókör:** a p01–p09 oldalak helyzetei, példái, stimulusai és modellszövegei. Kész tanulói szöveget, kulcsot és distractort nem írok.
**Hang és videó:** az egységhez nem tartozik felvétel, és a terv sem kér újat. Hangdöntési pont nincs.

---

## 0. Kötelező alap és előfeltételek (új, N1, N9)

1. **A szerző alapja a kanonikus változat.** A Kézirat fázis a `kanonikus/apply-teacher-corrections.mjs` kimenetéből indul, nem a régi `week-01.json`-ból. Ahol a kettő eltér, a kanonikus változat az irányadó, a 2. pont „Mi marad” táblája pedig ahhoz igazodik.
   - A nálam lévő `week-01.json`-ban a FICHE-01 négy javított mondata (B3, B4, B6, C1) szó szerint nem szerepel.
   - Tartalmilag két javítás érintheti az U21-et:
     - **B3:** a kitöltendő hely nem kényszeríti ki a mennyiségjelzőt. Érintett: i04, i07-s005.
     - **B6:** *Oui, j'en veux deux*, szám után felesleges melléknév nélkül. Érintett: p06, i05, i07-s006, a p09 modelljei.
   - A B4 (*pas de thé*) és a C1 (*va me caler*) valószínűleg az U41-et vagy az U43-at érinti. Az U21-ben csak tiltásként vagy mintaként jelennek meg (lásd a 4. pontot).
   - **Ellenőrzés:** a NavE a Kézirat fázisban szkripttel hasonlítsa össze, hogy a kanonikus U21 mért alakjai egyeznek-e a 2. pont listájával. Eltérés esetén a kanonikus változat nyer, és a CEO a GR-hez küldi vissza.
2. **Forrás a Kézirat előtt.** A szerző a kézirat megkezdése előtt igazolja, és rögzítse a forráslistában (URL, dátum, felhasznált rész):
   - legalább egy valódi francia pékség kínálati oldalán, krétatábláján vagy fotóján a *Petits pains* kategóriát vagy terméknevet;
   - egy valódi *formule petit-déjeuner* felépítését és árszintjét.

   Ha nincs ilyen forrás, ezt a kézirat előtt jelezze. Ilyenkor az i03 és a s004 kulcsindoka nem épülhet a táblára, csak a szemantikai indokra (lásd 3.3 és K5).
3. **Nyelvtani referencia a *des petits pains*-hez.** A keresési találat kivonata szerint az OQLF *Des devant un adjectif antéposé* lapja megtartja a *des*-t, ha a melléknév „a kifejezett fogalom szerves része”, és példaként a *des petits pains*-t hozza. Az oldalt magát NEM nyitottam meg, ezt a kivonat alapján állítom. A NyE nyissa meg és igazolja. Az Académie *Dire, ne pas dire* és a Grevisse: NEM VIZSGÁLT.

---

## 1. Diagnózis

**Valóságpróba.** Az egység mondatai nem egy helyen és nem egy emberrel történnek. Mindegyik a szabály kedvéért íródott: *Je parle du café de la gare*, *Je sors du café du marché*, *Elle cherche de vieux cafés parisiens pour son article*.

Több stimulus a megoldási feltételt metanyelven mondja ki a helyzet helyett:
- i07-s001: *sans préciser la quantité*;
- i07-s005: *dont personne ne connaît encore la clientèle*;
- i04: *dans la première phrase, on parle de clients non identifiés…*

Ez a mérce 7. rossz példája: a helyzet csak díszlet. A pincér szájába adott *Nous servons d'excellents croissants et des petits pains aux céréales* reklámszöveg, nem pultnál folyó beszéd.

**Érdekesség.** Nincs tét, nincs döntés és nincs nézőpont. A tanuló nem tud meg semmit a francia pékségről: mi a *formule petit-déjeuner*, mi a különbség a viennoiserie és a pain között, milyen a vasárnap reggeli sor. A tanár D-pontjai hiányoznak (tipikus rendelési fordulatok, péksütemény-szókincs kulturális háttérrel, magyar összevetés).

**Szint.** A nyelvtani mag a tanár szerint B1+-on ismétlés. Ez a blokk nem az alapszabályt tanítja újra, hanem pontosít: a *du* két értéke, *d'excellents* ↔ *des petits pains*, *beaucoup de* ↔ *beaucoup des*, az *en* helye. A feldolgozás viszont A2-es: elszigetelt mondatok, mechanikus átalakítás. A szintet a helyzet és a művelet emeli (helyesbítés, indokolt választás, értékelő műfaj). A nyelvtani tartalom maradhat.

**Műfaj.** Az egység tankönyvi minimondatokból áll. A p09 modelljei ellenőrzőlista-ízűek. Az A modell nem is koherens:
- *Beaucoup des pâtisseries… étaient déjà réservées. J'en ai acheté deux*: ha le voltak foglalva, miből vett?
- *je vais en prendre encore une avant de partir*: a beszélő már eljött a pékségből.

**Metaadat.** A futtatási `objectives` mező tagadást, az *être* utáni kivételt és a *sans* + főnév alakot ígér, de a kilenc oldal ezt nem tanítja. Az i04 `targetIds` mezőjében álló `w01-g-de-quantity-subset` nincs a `targetManifest`-ben.

Az előző változatban azt írtam, hogy ezt szkript igazíthatja, mert „nem célváltozás”. **Ezt visszavonom (N2).** A (2,1)-es kiosztásom nincs a bemenetemben, így nem tudom igazolni, hogy a két cél máshova került. Ez nyitott döntés marad (lásd 2.1). Ez a javítási terv nem érinti: sem nem tanítja, sem nem törli a két célt, és nem írja át a mezőt.

---

## 2. Mi marad, és miért

| Elem | Marad | Indok |
|---|---|---|
| Tanulási és mérési cél (`approvedObjectives` 1–6, a `targetManifest` 8 célja) | igen | A brief rögzíti. A DONTESEK 10-28 szerint a mag pontosító ismétlésként marad. |
| Oldal-ID-k p01–p09, item-ID-k i01–i08, subitem-ID-k (i01-s001, i05-s001, i07-s001…s006, i08-s001) | igen | Stabil azonosítók. |
| Feladattípusok: jelentéselemzés (i01), QCM (i02), kétmezős kitöltés (i03, i04), négymezős átalakítás (i05), hibajavítás (i06), hat vegyes subitem (i07), nyitott írás rubrikával (i08) | igen | A brief rögzíti, és mind a célhoz illő művelet. |
| Mért célalakok (a 0.1 feltétellel) | igen | i02: *du*; i03: *d'excellents… / des petits pains*; i04: *beaucoup de ; beaucoup des*; i05: *J'en prends. / Je vais en prendre deux. / Je n'en veux pas. / Nous en avons acheté trois.*; i06: *Je vais en prendre deux. / Nous ne voulons pas en acheter.*; i07: *du / du / d' / des / de / Je vais en prendre trois.* |
| A kiinduló mondatok főnevei | változhatnak | Ha a helyzet kívánja, a kiinduló mondat főneve más lehet (pl. *deux tartines* → *deux baguettes*, mert tartine-t nem a pékségben vesz az ember). A kért **célmondat** szó szerint marad. |
| A p09 hat **nyelvi** `allCriteria` kritériuma és a négyszintű rubrika | igen | Mérési cél. A szigorúság régi nyitott döntés. |
| A p09 hat **tartalmi** eleme | az új helyzethez igazítva | Lásd 3.2, p09 (N8). A nyelvi kritériumok nem változnak. |
| A magyarázatok szabályszerkezete (p02, p04, p05, p06) | igen, új példákkal | A tanár a hitelességet kifogásolta, a szabályt nem. |
| Terjedelem: 9 oldal, 8 item, p09: 6–8 mondat | igen | |
| Időkeret | **indokolt, jelölt eltérés:** 32–42 → 34–45 perc (becslés) | Az új minijeleneteket korlátozom (3.4), de az oldalankénti helyzetjelző és a p04 kulturális megjegyzése kb. 2–3 percet hozzátesz. Ez becslés, nem mérés. Ha az UE-végigjárás a kéziraton 42 percen belül marad, a régi érték maradhat (U6). |

### 2.1 A régi nyitott döntések sorsa (N2)

| Régi nyitott döntés | Állapot ebben a körben |
|---|---|
| A futtatási `objectives` mező (tagadás, *être* utáni kivétel, *sans* + főnév) | **Nyitott, továbbviszem (ESCALATED a CEO-nak).** Ebben a körben nem érintett. Lezárásához kell a GR (2,1)-es kiosztása: ha a két célt máshova osztották, csak a metaadatot kell igazítani; ha a (2,1)-hez, akkor tantervi döntés, és a PRESIDENT-é. A javítási terv egyik esetben sem függ tőle. |
| A személyre vagy dologra visszautaló *en* a (4,1)-ben | Nyitott, nem érintett. |
| A *des petits pains* természetessége | Részben alátámasztva (OQLF-kivonat, 0.3). A lezárás a NyE dolga, a megnyitott forrással. |
| A *beaucoup des clients habituels du café* formalitása | A terv lezárja: az új csoport a jelenetből jön (3.2, p05). A NyE ellenőrizze. |
| Az i05 négy transzformációja egy subitem alatt | Nyitott implementációs döntés, nem érintett. |
| Az `allCriteria` szigorúsága | Nyitott, nem érintett. |
| A p09 automatikus értékelhetősége | Nyitott termékdöntés, nem érintett. |
| Független francia nyelvi review | Érvényes; NyE és HE a kéziraton. |
| Az i04 `targetIds` manifesten kívüli ID-je | Metaadat-javítás, a CEO szkriptje kezelje (a cél nem változik). |

---

## 3. Mi változik, és miért

### 3.1 A közös keret

**Hol.** Egy boulangerie-pâtisserie Lyonban, a Croix-Rousse negyedben (a pékség kitalált, a szerző nevezi el). Pultja van, mellette két asztal, ahol kávét is adnak. A krétatáblán (*ardoise*) kategóriák állnak: *Viennoiseries*, *Petits pains*, *Pâtisseries*, és van egy *formule petit-déjeuner*. A pontos árat a szerző a 0.2 forrás alapján egyszer rögzíti, és minden oldalon tartja. Minden szám (ár, darab) egyértelműen valamire vonatkozik.

**Szereplők.** Rögzített lista; más szereplő nem kerül be (U2, N4).

| Szereplő | Ki ő | Hol jelenik meg |
|---|---|---|
| **én** (a tanuló, *je*) | Magyar, Lyonban él. A p01 egy félmondatban jelzi, hogy ez szerepjáték (UE, NOTE N1). | mindenhol |
| **Camille** | Francia lakótárs. Velem jön a pékségbe, ezért a **„nous” mindig = én + Camille**. | p05, p06, p08 |
| **az eladó** (*la boulangère*) | Csak a pultnál, magázva. | p06, i05 |
| **Léo** | Francia barát, a vasárnapi brunch vendége. Csak üzenetben jelenik meg. | p02, p03/i02, p07, p09 |

**Idővonal.** Kötelező; minden időhatározó ehhez igazodik (U1).

| Időpont | Mozzanat | Oldal |
|---|---|---|
| szombat este | Választok pékséget: elolvasom a pékség bemutatkozó szövegét és egy városi ajánló rovat bejegyzését. Léo SMS-ben felajánlja, hogy hoz valamit; a válaszomat elküldés előtt kijavítom. | p04/i03, p07/i06 |
| vasárnap 8:00 | Egyedül megiszom egy kávét abban a kávézóban, amelyet Léo ajánlott (*le petit café en face du marché*). | p03/i02 |
| vasárnap 8:30 | Camille-lal sorban állunk a pékség előtt. | p05/i04 |
| vasárnap 8:45 | Rendelés a pultnál. | p06/i05 1–3 |
| vasárnap 9:30 | Otthon, a reggeli előkészítése. | i07-s001 |
| vasárnap 10:00 | Léo üzenete; a *du café* félreértés. | p02/i01 |
| vasárnap 10:15 | Léo úton van, és megkérdezi, mit hozzon még és honnan. | p09/i08, i05-4 |
| vasárnap 11:00 | Brunch. Csak a keret végpontja, item nem tartozik hozzá. | – |

Miért vasárnap: a vasárnap reggeli sor a pékség előtt valódi francia jelenség, és a croissant azon a reggelen friss (tanári B6: „qui voudrait un croissant pas frais ?”).

**Tét.** A brunch 11-kor van, Léo érkezik. El kell dönteni, mit, mennyit és melyik pékségből vegyünk, és közben ki kell javítani a saját üzenetemet, mielőtt elküldöm. A J1-et részben átveszem: egy vendég jön (valódi ok az ajánlásra és az indoklásra). A magyar látogatót nem veszem át, mert új szereplőt és HU–FR közvetítést hozna, ami túlmegy a GI2 hatókörén és a heti terhelésen.

**Műfajok.**
1. Pultnál folyó rövid párbeszéd.
2. SMS-váltás Léóval.
3. **Gondozott** írott ajánlás: a pékség saját bemutatkozó szövege és egy városi ajánló rovat bejegyzése. Ez nem informális online értékelés (N6), mert az informális *avis*-ban a *des excellents* is természetes lenne, és a kulcs vitatható lenne.
4. A krétatábla felirata.

**Rendelési fordulatok.** Csak a tanár által jóváhagyott vagy forrással igazolt fordulat kerül be: *Je vais vous prendre…* (C4), *Oui, j'en veux deux* (B6), *ça va me caler* (C1).

**EU Academy:** NEM VIZSGÁLT. A szerző nézze meg forrásként (a tanár ajánlotta).

### 3.2 Oldalankénti vázlat

| Oldal | Új tartalom (vázlat, kész mondatok nélkül) | Szintemelés |
|---|---|---|
| p01 | A keret 2–3 mondatban: szereplők, vasárnap, brunch, és a szerepjáték jelzése. A négy cél ugyanaz, a példák a keretből jönnek. | – |
| p02 | A *du* két értéke. A magyarázó jelenet a 10:00-s SMS: Léo a *café* szót kétféleképpen érti (ital vagy a kávézó mint hely), és a félreértést a következő üzenet tisztázza. **A félreértés csak itt, a magyarázatban van.** 3–5 példa, ezekkel az igékkel: *boire*, *commander*, *sortir de*, *parler de* (a *rester* kimarad, mert az i07-s001-hez kell, U5). A *Je bois de café* kontraszt marad. | helyesbítés |
| p02 / i01 | **Két egyértelmű mondat**, a félreértés már tisztázott változatában (N3, U3). Az 1. mondatban fogyasztást jelentő ige és meghatározatlan mennyiség áll, határozó bővítmény nélkül. A 2. mondatban *de*-t igénylő ige vagy elöljáró áll, plusz egy bővítménnyel azonosított hímnemű hely (pl. *… du café en face du marché*). Egyik mondat sem lehet kontextus nélkül is kétértelmű. A tanuló művelete ugyanaz: rövid jelentéselemzés. | – |
| p03 | *de + le* példák a keret mozgásából (*je sors du…*, *je reviens du marché*, *le prix du…*). Kontraszt: *Je voudrais du café* ↔ *Je reviens du café*. | – |
| p03 / i02 | Léo ajánlott egy kávézót, és ott voltam 8-kor. A helyet a stimulus **hímnemű, azonosított** főnévvel nevezi meg (*le petit café en face du marché*), nem a nőnemű *boulangerie*-vel (N5). Mért alak: *du*. A distractorok (*de*, *de la*, *des*) így érvényesek maradnak. | – |
| p04 | Melléknévi *de* ↔ lexikalizált *des*, a gondozott ajánlás műfajában. A krétatábla *Petits pains* kategóriája képként vagy feliratként látszik. A szabály indoka szemantikai: a *petits pains* terméknévként, egységként működik (0.3). A tábla csak ezt támasztja alá, nem pótolja (UE, NOTE N2). Kulturális és magyar összevetés 2–3 sorban: viennoiserie / pain / mini-viennoiserie, *formule petit-déjeuner*, és ehhez mérve a magyar „péksütemény” tágabb kategóriája. A *vieux cafés parisiens* példa kikerül. | *même si* egy értékelő mondatban, ha természetes |
| p04 / i03 | A stimulus a városi ajánló rovat két mondata (gondozott regiszter), és fölötte látszik a tábla *Petits pains* kategóriája (U8, N6). Mért alak: *d'excellents… et des petits pains…*. Nem a pincér beszél. | értékelő műfaj |
| p05 | Részhalmaz-kontraszt a 8:30-as sorban. Sok ember vár (meghatározatlan tömeg); a negyed törzsvendégei (*les habitués du dimanche*), akiket a szöveg előbb megnevez, közül sokan előre rendeltek. A csoport bevezetése a helyzet része, nem metamegjegyzés. | *tandis que* a két csoport szembeállítására, ha természetes |
| p05 / i04 | Az instrukció megadja a két alakot (*beaucoup de / beaucoup des*), így a mennyiségjelző kötelező (B3). A metanyelvi „Contexte : dans la première phrase…” kikerül. A két mondat más főnévvel is élhet, mint a p05 példái. | – |
| p06 | Az *en* helye a 8:45-ös pultjelenetben: az eladó kérdez, én válaszolok; Camille a kávéhoz cukrot kínál. A passé composé-példa a 10:15-ös üzenetből jön, Léónak (U2). A négy szabály marad. A *ça va me caler* csak ebben a szerkezetben szerepelhet (C1). | – |
| p06 / i05 | 1–2: a pult (az eladó kérdése látszik). 3: Camille cukrot kínál, én visszautasítom. 4: az üzenet Léónak arról, mit vettünk Camille-lal (*nous*). A kiinduló mondatok láthatók, a kérdés csak kontextus (K3). | – |
| p07 / i06 | **A tanuló saját piszkozata**, szombat este, válaszul Léo SMS-ére. Új szereplő nincs (N4, U2, U4). Léo üzenete a képernyőn megnevezi mindkét előzményt (pl. két viennoiserie-fajtát), így látszik, mire utal az *en*. A tagadó mondat funkciója: udvariasan visszautasítom az egyiket, valódi okkal (pl. ezt már megvettük, vagy Camille nem szereti). A tanuló elküldés előtt javít. A két hibás mondat és a kulcs marad. | helyesbítés, valódi céllal |
| p08 / i07 | Hat mikrohelyzet, mindegyik az idővonal megnevezett pontjához kötve (3.3). Metanyelvi keret nincs. | – |
| p09 / i08 | 10:15, Léo üzenete: úton van, és megkérdezi, hozzon-e még valamit, és ha igen, honnan. A tanuló Léónak válaszol. Elmondja, mit vettek már Camille-lal (*en*, passé composé), mit hozzon még Léo és mennyit (*en* + infinitif), és melyik pékségből, indoklással (U7a). A választás így a **még hiányzó** tételre vonatkozik, ezért nem okafogyott. Címzett: Léo; regiszter: informális, nem szleng; 6–8 mondat. | indokolt választás; *même si* és/vagy *tandis que* a modellekben, opcionálisan |

**A p09 kötelező tartalmi elemei az új helyzethez igazítva (N8).** A nyelvi `allCriteria` változatlan.

| Régi tartalmi elem | Új tartalmi elem |
|---|---|
| 1. ital vagy étel rendelése | 1. mit vettetek már Camille-lal |
| 2. legalább egy pékségi termék | 2. mit hozzon még Léo, mennyiséggel |
| 3. konkrét kávézó vagy pékség (*de + le*) | 3. melyik pékségből, egy *du*-val megnevezhető hellyel (pl. a piacnál vagy egy hímnemű helynél) |
| 4. nem azonosított csoport vagy mennyiség | 4. a sor vagy a kínálat: nem azonosított tömeg vagy mennyiség |
| 5. azonosított csoport részhalmaza | 5. egy megnevezett csoport részhalmaza (pl. a kirakat vagy a törzsvendégek) |
| 6. legalább két *en* | 6. indoklás: miért az a pékség |

Az elemeket a tanuló **nem a régi technikai listaként látja** (U7b). A felületen hat egyszerű magyar ellenőrzőkérdés jelenik meg, mindegyik mellett egy nem kimásolható mikropélda. Példa: „Van egy mondatod arról, hogy sokan álltak sorban? Ügyelj rá, hogy a csoport nem előre megnevezett.” A `partitive_vs_contracted` típusú ID-k csak a szerkesztői kulcsban maradnak.

**Modellek:** két új, egymástól eltérő hangú modell kell: egy lelkes ajánlás és egy óvatos „igen, de…” választás. Mindkettőben minden *en* előtt kimondott, megszámolható előzmény áll (K4). A régi A modell kikerül (F1).

### 3.3 Az i07 subitemjei (a mért képesség és a célalak marad)

| Subitem | Helyzet az idővonalon | Kötelező előírás a szerzőnek |
|---|---|---|
| s001 (partitív *du*) | 9:30, otthon, reggeli-előkészítés. Hímnemű anyagnév, pl. vaj vagy lekvár. | Nem a pultnál játszódik (ott az *un café* a normál rendelés, K1). Az ige más, mint a p02 példáiban (*boire* és *commander* nem lehet), és a *rester* is kerülendő, ha a p02-be mégis bekerülne (U5). Az *un* ne legyen természetes. |
| s002 (*du* = de + le) | 8:00 után, kilépés a kávézóból. | Hímnemű, azonosított hely. A kitöltendő hely előtt és után ne álljon másik *du* (a régi *du marché* elárulta az alakot). Az i02-től más ige legyen (az i02-ben *revenir de*, itt pl. *sortir de* vagy *parler de*). |
| s003 (*d'* + előretett melléknév) | Szombat este, a pékség saját bemutatkozó szövege (nem az i03 ajánló rovata). | Gondozott regiszter, magánhangzóval kezdődő melléknév, más termék és melléknév, mint az i03-ban. A *les* ne lehessen helyes. |
| s004 (*des petits pains*) | 8:45, a krétatábla előtt. | A *Petits pains* kategória látszik a stimulusban. Méretre utaló kontextus ne legyen (*tout petits*, *minuscules*). |
| s005 (*beaucoup de*) | Szombat este, a pékség bemutatkozó szövegéből, a kínálatról (U5). | **Nem a sor**, és más főnév, mint a p05-ben és az i04-ben (pl. a kínálat sokfélesége, többes számú megszámlálható főnévvel). A *beaucoup* a stimulusban áll. Mögötte ne legyen meghatározó bővítmény. |
| s006 (az *en* infinitif előtt, a mennyiség megmarad) | 8:45, a pult. A *trois parts de flan* marad (valódi pékségtermék). | Szám után ne álljon melléknév (B6). |

### 3.4 Terhelési korlát (U6)

- Minden oldal tetején egysoros helyzetjelző áll: ki, hol, mikor (pl. „Vasárnap 8:45 · a pultnál · Camille-lal”).
- Itemstimulusonként legfeljebb 2–3 sor kontextus.
- A p04 kulturális megjegyzése legfeljebb 3 sor.
- Az új szókincs (*formule*, *viennoiserie*, *ardoise*, *habitués*) csak megértést szolgál, nem mért elem; F-glossza kell hozzá. A CEO egyeztesse a VR heti listájával.
- Becslés: 34–45 perc (2. pont).

---

## 4. Tanári kifogásonként

| Kifogás | Hogyan kezeli a terv |
|---|---|
| „pas bien structuré, ni très intéressant, ça ne sonne pas français” | Egy rögzített keret: Lyon, vasárnapi brunch, négy névvel rögzített szereplő, idővonal, négy hiteles műfaj. Különálló minimondatok nincsenek. |
| A szint „trop facile”; a mag B1+-on ismétlés (D4) | A mag pontosításként marad. A műveleteket emeljük: helyesbítés (p02, p07), értékelő műfaj (p04), indokolt választás (p09), *même si* / *tandis que* ott, ahol a helyzet hozza. |
| Mesterkélt, magazinba nem illő fordulat (FICHE-01 A) | Más egységről szól. Itt is érvényes az elv: a műfaj hangján írunk, nem a tankönyvén. PE és NyE. |
| B3: a kitöltendő hely nem kényszeríti ki a mennyiségjelzőt | i04: az instrukció megadja a két alakot. i07-s005: a *beaucoup* a stimulusban áll. A részhalmaz csoportját a szöveg előbb megnevezi. A kanonikus változattal egyeztetni kell (0.1). |
| B4: *pas du thé* → *pas de thé* | Ilyen item itt nincs. Az i05-3 a helyes alapesetet követi. A kontrasztív *pas du…, mais du…* nem kerülhet be. |
| B6: *J'en veux deux frais* → *deux* | Az *en* + szám után nincs melléknév (p06, i05, s006, p09). Az idővonal miatt friss croissant-ról beszélünk. |
| C1: *caler* → *va me caler* | Ha a p06-ban vagy a p09-ben szerepel, csak *ça va me caler* formában. |
| C4: *Je vais vous prendre…* rendben | Használható a pultnál, jelölés nélkül. |
| D1: tipikus rendelési fordulatok | p06 és i05: a pultjelenet. |
| D2: péksütemény-szókincs kulturális háttérrel | p04: a táblakategóriák és a formule. |
| D3: magyar összevetés | p04, 2–3 sor. |
| D5: érdekesebb kifejezések a szokásokra | p04 és p09: 1–2 fordulat forrásból. Nem mért, és a megértéshez nem szükséges. |
| EU Academy | NEM VIZSGÁLT; a szerző nézze meg. |

---

## 5. Kockázatok és elkerülésük

| ID | Súly | Kockázat | Elkerülés |
|---|---|---|---|
| K1 | MAJOR | Az i07-s001-nél az *un* is helyes lesz. | Otthoni helyzet, hímnemű anyagnév (3.3). A független megoldó külön ellenőrizze. |
| K2 | MAJOR | A *beaucoup des* helyén a *beaucoup d'habitués* vagy a *la plupart des* is helyes lehet. | Az i04 két alakot ad választásra, a csoport határozott bővítménnyel van megnevezve, és a feedback csak a két megadott alakot értékeli. |
| K3 | MAJOR | Az i05 párbeszédes keretében a természetes válasz más igével jönne. | Kötött transzformáció, a kiinduló mondat látható. Az eltérő igéjű helyes választ a kulcs „nem teljes értékű, de nem hibás” változatként jelölje. |
| K4 | MAJOR | A p09 modelljei ellenőrzőlistának hatnak, vagy az *en* előzménye bizonytalan. | Két eltérő hangú modell, minden *en* előtt kimondott előzménnyel. NyE és PE vizsgálja. |
| K5 | MINOR | A *des petits pains* indoka vitatható. | Szemantikai indok, a 0.3 referencia és a látható táblakategória együtt. Méretre utaló kontextus nincs. Ha a 0.2 forrás nem igazolja a kategóriát, csak a szemantikai indok marad. |
| K6 | MINOR | Az új szókincs terheli a funkciópróba-hetet. | F-glossza, nem mért, egyeztetés a VR-rel. |
| K7 | MINOR | A keret túl szoros, minden ugyanaz. | Célonként más termék, ige és mozzanat (3.3). |
| K8 | NOTE | Metaadat: az `objectives` mező és az i04 `targetIds`. | **Javítva:** a `targetIds` igazítása szkriptfeladat. Az `objectives` sorsa nyitott döntés (2.1); a terv nem állítja, hogy ez nem célváltozás. |
| **K9** | MAJOR | (új, N3/U3) Az i01-ben két helyes elemzés lehetséges, ha a félreértés átszivárog a mért mondatba. | A félreértés csak a p02 magyarázó jelenetében van. Az i01 két mondata igével és bővítménnyel egyértelműsített. A független megoldó a mondatokat kontextus nélkül is elemezze. |
| **K10** | MAJOR | (új, U1/U2) Az idővonal vagy a *nous* sérül, ha egy szerző eltér a kerettől. | A 3.1 szereplő- és időtáblája kötelező. Minden oldal helyzetjelzője a táblából jön. A NavE a Kézirat fázisban oldalanként ellenőrizze az időhatározókat és a *nous*-t. |
| **K11** | MINOR | (új, N1) A kanonikus változat eltér a 2. pont mért alakjaitól. | 0.1: szkriptes összevetés; eltérés esetén a kanonikus változat nyer, és a terv visszamegy a GR-hez. |

---

## Dispositionök

| Finding | Disposition | Indok és hely |
|---|---|---|
| N1 | FIXED (feltétellel) | 0.1: a kanonikus kimenet a kötelező alap, a valószínűleg érintett itemek felsorolva, szkriptes összevetés a Kézirat fázisban. A kimenetet nem láttam; a CEO csatolja. |
| N2 | FIXED + ESCALATED | A „nem célváltozás” állítást visszavontam (1. pont, K8). A régi nyitott döntések tételesen szerepelnek (2.1). Az `objectives`-kérdés a CEO-hoz megy, a (2,1)-es kiosztással; ezt a tervet nem blokkolja. |
| N3 | FIXED | p02/i01: egyértelmű mondatok, a félreértés a magyarázatban; K9. |
| N4 | FIXED | 3.1: négy névvel rögzített szereplő, a *nous* = én + Camille; a p07 a tanuló saját piszkozata. |
| N5 | FIXED | i02: hímnemű, azonosított hely. |
| N6 | FIXED | Gondozott ajánló rovat; a tábla az i03 fölött látszik. |
| N7 | FIXED | p07: Léo üzenete látható előzményt ad; a tagadás udvarias visszautasítás. |
| N8 | FIXED | p09: a tartalmi elemek átírva; a nyelvi kritériumok változatlanok. |
| N9 | FIXED (részben) | 0.2: forrás a Kézirat előfeltétele; 0.3: az OQLF-kivonat (nem megnyitott) a NyE-hez. |
| U1 | FIXED | 3.1: kötelező idővonal; vasárnapi vásárlás, aznapi brunch. |
| U2 | FIXED | Mint az N4-nél. |
| U3 | FIXED | Mint az N3-nál. |
| U4 | FIXED | Mint az N7-nél; egy író (a tanuló). |
| U5 | FIXED | 3.3: az s001 és az s005 új mozzanatból, más igével és főnévvel. |
| U6 | FIXED | 3.4: korlátok; az időkeret 34–45 percre módosul, jelölt eltérés, becslés. |
| U7 | FIXED | p09: a választás a még hiányzó tételre vonatkozik; a kritériumok magyar ellenőrzőkérdésként jelennek meg. |
| U8 | FIXED | Mint az N6-nál. |
| UE NOTE N1 (szerepjáték) | FIXED | p01 félmondata. |
| UE NOTE N2 (formai rövidítés) | FIXED | p04: a szemantikai indok elsődleges, a feedbackben is. |
| J1 | REJECTED_WITH_REASON (részben átvéve) | A vendég és a brunch tétje átvéve. A magyar látogató nem: új szereplőt és közvetítési feladatot hozna, ami túlmegy a GI2 hatókörén és a terhelésen. |

## Változáslista (az előző tervhez képest)

- Új 0. pont: kanonikus alap, forrásfeltétel, nyelvtani referencia.
- 3.1: konkrét város, négy rögzített szereplő, vasárnapi idővonal, a „nous” definíciója; gondozott ajánló rovat a szabad *avis* helyett.
- p02/i01 egyértelműsítve; i02 hímnemű hely; i03 tábla a stimulusban; p07 a tanuló piszkozata, látható előzménnyel; p09 új tartalmi elemek és tanulói ellenőrzőkérdések.
- i07: subitemenként rögzített mozzanat, s001 és s005 új helyzetből.
- Időkeret: 34–45 perc, becslés, jelölt eltérés.
- 1. pont: a metaadat-állítás visszavonva; 2.1: a régi nyitott döntések.
- Új kockázatok: K9–K11; K8 átírva.
- Változatlan: a cél, az ID-k, a feladattípusok, a mért célmondatok és a nyelvi `allCriteria`.

## Findingok a régi kéziratról (változatlan)

- **F1 (MAJOR):** a p09 A modellje inkoherens.
- **F2 (MAJOR):** metanyelvi stimulusok (i04, i07-s001, i07-s005).
- **F3 (MINOR):** az i03 reklámnyelve a pincér szájában.
- **F4 (NOTE):** metaadat; lásd K8 és 2.1.

## Hiányok és bizonyíték

- **Hiányzó bemenetek:**
  - a kanonikus kimenet és a napló (N1);
  - a (2,1)-es kiosztás (N2).

  Kérés a CEO-nak: mindkettőt csatolja a recheckhez.
- **Új bizonyíték:** két webes keresés. A találati kivonatok szerint az OQLF *Des devant un adjectif antéposé* lapja a *des petits pains*-t a megtartott *des* példájaként hozza, és a francia pékségkínálat-leírásokban a *petits pains* önálló termékcsoport. Az oldalakat NEM nyitottam meg; a kivonatok nem helyettesítik a 0.2 és a 0.3 ellenőrzést.
- **Újrahasznosított bizonyíték:** nincs.

**Ellenőrzés:** NavE és UE recheck (N1–N9, U1–U8; 0. pont, 3.1, p02/i01, p03/i02, p04/i03, p06/i05, p07/i06, p08/i07, p09/i08, időkeret). PE; a kéziraton NyE és HE.
**Következő címzett:** CEO.

**Tanulság:** ha egy javítási terv közös keretet vezet be, a terv maga rögzítse a szereplők nevét, a „nous” jelentését és az idővonalat táblázatban → különben a szerzők oldalanként mást választanak, és a megtartott célmondatok ellentmondásba kerülnek → minden közös keretű javítási tervre.

Források (keresési találatok, az oldalakat nem nyitottam meg):
- [OQLF – Des devant un adjectif antéposé](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose)
- [Observatoire de la franchise – Quels produits vendre en boulangerie ?](https://www.observatoiredelafranchise.fr/dossier-thematique/produits-vendre-boulangerie.htm)
- [Lawless French – Des devant adjectif](https://www.lawlessfrench.com/grammar/des-plus-adjective/)

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE