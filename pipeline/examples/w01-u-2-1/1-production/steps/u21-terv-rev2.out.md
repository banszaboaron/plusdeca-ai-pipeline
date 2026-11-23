# U21 (w01-u-2-1, GI2): *Du, des, de : forme ou sens ?*, javítási terv, 2. javított változat

**Szerep:** GR (nyelvtan-rendező). **Megbízás:** az U21 javítási terve (1. hét, 2026-10-es javítás), második javítási kör.

**Bemenet:**
- a saját 1. javított tervem (DRAFT_FOR_REVIEW);
- a NavE 2. körös jelentése: N1–N13;
- a javítási brief, a `week-01.json` → `units[w01-u-2-1]`, a tanári kifogások és a mércék.

**Hiányzó bemenetek, továbbra is:**
- a `kanonikus/apply-teacher-corrections.mjs` kimenete és naplója;
- a GR (2,1)-es kiosztása;
- a DONTESEK 10-28 teljes szövege.

**Hatókör:** a p01–p09 oldalak helyzetei, példái, stimulusai és modellszövegei. Kész tanulói szöveget, kulcsot és distractort nem írok. A „pl.” után álló fordulatok irányt jelölnek, nem kész mondatok.

**Hang és videó:** az egységhez nem tartozik felvétel, és a terv sem kér újat. Hangdöntési pont nincs.

---

## 0. Kötelező alap és előfeltételek

1. **A kanonikus változat a szerző alapja (N1).**
   - A Kézirat fázis a `kanonikus/apply-teacher-corrections.mjs` kimenetéből indul, nem a régi `week-01.json`-ból. Ahol a kettő eltér, a kanonikus változat az irányadó.
   - A kanonikus U21 mért alakjait a **CEO szkriptje** veti össze a 2. pont listájával. A NavE csak a futás bizonyítékát (kimenet és napló) kapja meg és ellenőrzi.
   - Ha a szkript eltérést talál, a kanonikus változat nyer, és a CEO a tervet visszaküldi a GR-nek.
   - **Kapu:** a kimenetet és a futási bizonyítékot a Kézirat fázis indítása előtt csatolni kell.
   - A FICHE-01 valószínűleg érintett tételei: **B3** → i04, i07-s005; **B6** → p06, i05, i07-s006 és a p09 modelljei. A B4 és a C1 itt csak tiltásként vagy fordulatmintaként jelenik meg (4. pont).
2. **Forrás a Kézirat előtt (N9).**
   - A szerző a kézirat előtt rögzíti a forráslistában (URL, dátum, felhasznált rész):
     - legalább egy valódi francia pékség *Petits pains* kategóriáját vagy terméknevét;
     - egy valódi *formule petit-déjeuner* felépítését és árszintjét.
   - Ha nincs ilyen forrás, ezt a kézirat előtt jelzi, és az i03 és a s004 indoka csak szemantikai lehet (K5).
3. **Nyelvtani referencia a *des petits pains*-hez (N9).**
   - A keresési kivonat szerint az OQLF *Des devant un adjectif antéposé* lapja megtartja a *des*-t, ha a melléknév a fogalom szerves része, és példája a *des petits pains*.
   - Az oldalt NEM nyitottam meg. A Kézirat fázis csak azután indulhat, hogy a NyE megnyitotta és igazolta.
   - Az Académie *Dire, ne pas dire* és a Grevisse: NEM VIZSGÁLT.

---

## 1. Diagnózis (változatlan)

**Valóságpróba.** Az egység mondatai nem egy helyen és nem egy emberrel történnek. Mindegyik a szabály kedvéért íródott: *Je parle du café de la gare*, *Je sors du café du marché*, *Elle cherche de vieux cafés parisiens pour son article*.

Több stimulus a megoldási feltételt metanyelven mondja ki a helyzet helyett:
- i07-s001: *sans préciser la quantité*;
- i07-s005: *dont personne ne connaît encore la clientèle*;
- i04: *dans la première phrase, on parle de clients non identifiés…*

Ez a mérce 7. rossz példája: a helyzet csak díszlet. Az i03-ban a pincér reklámszöveget mond, nem pultnál beszél.

**Érdekesség.** Nincs tét, nincs döntés, nincs nézőpont. A tanuló nem tud meg semmit a francia pékségről: mi a *formule petit-déjeuner*, mi a különbség a viennoiserie és a pain között, milyen a vasárnap reggeli sor. Hiányoznak a tanár D-pontjai is.

**Szint.** A nyelvtani mag B1+-on ismétlés. Ez a blokk pontosít:
- a *du* két értéke;
- *d'excellents* ↔ *des petits pains*;
- *beaucoup de* ↔ *beaucoup des*;
- az *en* helye.

A feldolgozás viszont A2-es: elszigetelt mondatok, mechanikus átalakítás. A szintet a helyzet és a művelet emeli (helyesbítés, indokolt választás, értékelő műfaj). A nyelvtani tartalom maradhat.

**Műfaj.** Tankönyvi minimondatok. A p09 modelljei ellenőrzőlista-ízűek, az A modell inkoherens:
- *réservées… J'en ai acheté deux*: ha le voltak foglalva, miből vett?
- *avant de partir*: a beszélő már eljött a pékségből.

A magyarázat példái gyakran szó szerint a későbbi item stimulusai vagy kulcsai (p02↔i01, p04↔i03, p06↔i05, p07↔i06; N11).

**Metaadat.**
- Az `objectives` mező tagadást, az *être* utáni kivételt és a *sans* + főnév alakot ígér, de a kilenc oldal ezt nem tanítja. Ez nyitott döntés (2.1). A terv sem nem tanítja, sem nem törli a két célt.
- A *beaucoup des* részhalmaz-cél hiányzik a `targetManifest`-ből. Megoldás: 2.1, N10.

---

## 2. Mi marad, és miért

| Elem | Marad | Indok |
|---|---|---|
| Tanulási és mérési cél (`approvedObjectives` 1–6, a manifest 8 célja) | igen | A brief rögzíti. A DONTESEK 10-28 szerint a mag pontosító ismétlésként marad. |
| Oldal-, item- és subitem-ID-k | igen | Stabil azonosítók. |
| Feladattípusok: jelentéselemzés (i01), QCM (i02), kétmezős kitöltés (i03, i04), négymezős átalakítás (i05), hibajavítás (i06), hat vegyes subitem (i07), nyitott írás rubrikával (i08) | igen | A brief rögzíti, és mind a célhoz illő művelet. |
| Mért célalakok (a 0.1 feltétellel) | igen | Lásd az alábbi listát. |
| A kiinduló mondatok főnevei és bővítményei | változhatnak | A *kért alak* és a felsorolt kulcsmondat marad. A kiinduló mondat a helyzethez igazodhat. |
| A p09 hat nyelvi `allCriteria` kritériuma és a négyszintű rubrika | igen | Mérési cél. |
| A p09 hat tartalmi eleme | az új helyzethez igazítva | 3.2 (N8, N13) |
| A magyarázatok szabályszerkezete | igen, **új, a kulcstól eltérő** példákkal | 3.5 (N11) |
| Terjedelem: 9 oldal, 8 item, p09 6–8 mondat | igen | |
| Időkeret | **jelölt eltérés:** 32–42 → 34–45 perc (becslés) | Ha az UE-végigjárás 42 percen belül marad, a régi érték marad. |

**Mért célalakok itemenként:**

| Item | Mért alak |
|---|---|
| i02 | *du* |
| i03 | *d'excellents* + többes főnév, valamint *des petits pains* |
| i04 | *beaucoup de ; beaucoup des* |
| i05 | *J'en prends. / Je vais en prendre deux. / Je n'en veux pas. / Nous en avons acheté trois.* |
| i06 | *Je vais en prendre deux. / Nous ne voulons pas en acheter.* |
| i07 | *du / du / d' / des / de / Je vais en prendre trois.* |

Az i03 régi főnevei (*croissants*, *aux céréales*) a helyzethez igazodhatnak; a mért alak a *d'* + *excellent-* és a *des petits pains*.

### 2.1 A nyitott döntések sorsa

| Nyitott kérdés | Állapot |
|---|---|
| Az `objectives` mező (tagadás, *être* utáni kivétel, *sans* + főnév) | **ESCALATED a CEO-nak.** A lezáráshoz a (2,1)-es kiosztás kell. Ha a célok máshova kerültek, csak metaadat-igazítás. Ha a (2,1)-hez, akkor tantervi döntés, a PRESIDENT hatásköre. Ezt a tervet nem blokkolja. |
| **A `w01-g-de-quantity-subset` hiányzik a manifestből (N10)** | **Döntés (GR, rutin, jelölve):** a cél **bekerül** a `targetManifest`-be: `taught: true`, `assessed: true`, `pageIds: [p05]`, `itemIds: [i04, i08]`, `subitemIds: [i08-s001]`. **Indok:** az `approvedObjectives` 4. pontja és az `approvedTargetAlignment` már kimondja és méri (i04, `quantity_subset`), tehát ez nem célbővítés, hanem a manifest hozzáigazítása a jóváhagyott célhoz. A `g-beaucoup-de-vs-des` alias nem kap külön ID-t. A `g-de-adjective-vs-des-lexicalized` sem: a s004 révén a manifest `w01-g-de-adjective-standard` kötése lefedi. A CEO szkriptje csak ezt hajtja végre. **Törölni nem szabad.** Ha a CEO mégis célbővítésnek tekinti, az `objectives`-kérdéssel együtt eszkalálja. |
| A személyre vagy dologra visszautaló *en* a (4,1)-ben | Nyitott, nem érintett. |
| A *des petits pains* természetessége | NyE, a megnyitott forrással (0.3). |
| A *beaucoup des clients habituels du café* formalitása | A terv kiváltja (3.5). |
| Az i05 négy transzformációja egy subitem alatt | Nyitott implementációs döntés. |
| Az `allCriteria` szigora; a p09 automatikus értékelhetősége | Nyitott, nem érintett. |
| Független francia nyelvi review | NyE és HE a kéziraton. |

---

## 3. Mi változik, és miért

### 3.1 A közös keret

**Hol.** Egy boulangerie-pâtisserie Lyonban, a Croix-Rousse negyedben. A pékség kitalált, a nevét a szerző adja.
- Pultja van, mellette két asztal, ahol kávét is adnak.
- A krétatáblán (*ardoise*) kategóriák állnak: *Viennoiseries*, *Petits pains*, *Pâtisseries*, és van egy *formule petit-déjeuner*.
- Az árat a szerző a 0.2 forrás alapján egyszer rögzíti, és minden oldalon tartja. Minden szám (ár, darab) egyértelműen valamire vonatkozik, és a mennyiségek három emberhez illenek.

**Szereplők.** Rögzített lista; más szereplő nem kerül be.

| Szereplő | Ki ő | Hol jelenik meg |
|---|---|---|
| **én** (a tanuló, *je*) | Magyar, Lyonban él. A p01 félmondatban jelzi, hogy ez szerepjáték. | mindenhol |
| **Camille** | Francia lakótárs. A **„nous” mindig = én + Camille.** | p05, p06, p07, p08 |
| **az eladó** (*la boulangère*) | Csak a pultnál, magázva. | p06, i05 |
| **Léo** | Francia barát, a brunch vendége. Csak üzenetben jelenik meg. | p02, p03/i02, p07, p09 |

**Idővonal.** Kötelező; minden időhatározó ehhez igazodik.

| Időpont | Mozzanat | Oldal |
|---|---|---|
| szombat este | Pékséget választok: elolvasom a pékség bemutatkozó szövegét és egy városi ajánló rovat bejegyzését. | p04/i03, i07-s003, i07-s005 |
| szombat este | Léo SMS-ben megkérdezi, **mit akarunk Camille-lal holnap venni**, hogy ne vegye meg ugyanazt. A válaszomat elküldés előtt kijavítom. | p07/i06 |
| vasárnap 8:00 | Egyedül megiszom egy kávét a kávézóban, amelyet Léo ajánlott; 8:15-kor írok neki. | p03/i02 |
| vasárnap 8:25 | A metró kijáratánál találkozom Camille-lal. | i07-s002 |
| vasárnap 8:30 | Sorban állunk a pékség előtt; a kirakatot is látjuk. | p05/i04 |
| vasárnap 8:45 | Rendelés a pultnál, a tábla előtt. | p06/i05 1–3, i07-s004, i07-s006 |
| vasárnap 9:30 | Otthon készítjük elő a reggelit. | i07-s001 |
| vasárnap 10:00 | Léo üzenete; a *café* félreértése. | p02 (magyarázat), i01 |
| vasárnap 10:15 | Léo úton van, és megkérdezi, hozzon-e még valamit, és honnan. | p09/i08, i05-4 |
| vasárnap 11:00 | Brunch; csak a keret végpontja. | – |

**Tét.** A brunch 11-kor van, Léo jön. El kell dönteni, mit, mennyit és honnan vegyünk, és a saját üzenetemet elküldés előtt ki kell javítanom.

**Műfajok.**
1. Pultnál folyó rövid párbeszéd.
2. SMS-váltás Léóval.
3. Gondozott írott ajánlás: a pékség bemutatkozó szövege és a városi ajánló rovat. Nem informális *avis*.
4. A krétatábla felirata.

**Rendelési fordulatok.** Csak tanári vagy forrással igazolt fordulat kerül be: *Je vais vous prendre…* (C4), *Oui, j'en veux deux* (B6), *ça va me caler* (C1).

**EU Academy:** NEM VIZSGÁLT; a szerző nézze meg.

### 3.2 Oldalankénti vázlat

| Oldal | Új tartalom (vázlat) | Szintemelés |
|---|---|---|
| p01 | A keret 2–3 mondatban, a szerepjáték jelzésével. A négy cél ugyanaz; a példák a keretből jönnek, de nem itemkulcsok (3.5). | – |
| p02 | A *du* két értéke. A magyarázó jelenet a 10:00-s SMS: Léo a *café*-t italként vagy helyként érti, a következő üzenet tisztázza. A félreértés csak itt van. 3–5 példa, igék a 3.5 mátrixa szerint. A *Je bois de café* kontraszt marad. | helyesbítés |
| p02 / i01 | Két egyértelmű mondat. Az 1. mondatban fogyasztást jelentő ige és meghatározatlan mennyiség áll; a 2. mondatban egy *de*-t igénylő szerkezet és egy azonosított hímnemű főnév. Az igéje és a helye **más, mint a p02 példáié** (3.5). Kontextus nélkül sem lehet kétértelmű. | – |
| p03 | *de + le* példák a keret mozgásából, a 3.5 szerint. Kontraszt: *Je voudrais du café* ↔ *Je reviens du café*. | – |
| p03 / i02 | 8:15, SMS Léónak a kávézóból. Ige: *revenir de*. A hely hímnemű, azonosított főnév, és a bővítménye **nem tartalmaz *du*-t** (pl. vonatkozó mellékmondat: *… que tu m'as conseillé*; N12). Mért alak: *du*. A *de*, *de la*, *des* distractorok érvényesek. | – |
| p04 | Melléknévi *de* ↔ lexikalizált *des*, gondozott ajánlás műfajában. A tábla *Petits pains* kategóriája látszik. Az indok szemantikai (0.3); a tábla csak alátámasztja. Kulturális és magyar összevetés legfeljebb 3 sorban: viennoiserie / pain / mini-viennoiserie, *formule petit-déjeuner*, és a magyar „péksütemény” tágabb kategóriája. A példák melléknevei és főnevei eltérnek az i03 és a s003 kulcsától (3.5). | *même si* egy értékelő mondatban, ha természetes |
| p04 / i03 | Az ajánló rovat két mondata, fölötte a tábla. Mért alak: *d'excellents…* és *des petits pains…*. | értékelő műfaj |
| p05 | Részhalmaz-kontraszt a 8:30-as sorban, **emberekről**: meghatározatlan tömeg ↔ a megnevezett *habitués du dimanche*, akik közül sokan előre rendeltek. | *tandis que*, ha természetes |
| p05 / i04 | Ugyanaz a 8:30-as mozzanat, de **más főnévcsoport**: a kirakat termékei, nem az emberek (3.5). Az instrukció megadja a két alakot (B3). A részhalmaz csoportja határozott bővítménnyel megnevezett. Metanyelvi „Contexte” nincs. | – |
| p06 | Az *en* helye a 8:45-ös pultjelenetben. Az eladó kérdez, Camille cukrot kínál. A négy szabály marad. A példák igéje, alanya, főneve és száma eltér az i05, az i06 és a s006 kulcsától (3.5). A passé composé-példa **nem** a 10:15-ös üzenetből jön (N11). | – |
| p06 / i05 | 1–2: a pult, az eladó kérdése látszik. 3: Camille cukrot kínál, visszautasítom. 4: a 10:15-ös üzenet Léónak arról, mit vettünk Camille-lal (*nous*). Kötött transzformáció, a kiinduló mondat látható. | – |
| p07 / i06 | Szombat este, a tanuló **saját piszkozata** válaszul Léo kérdésére („mit vesztek holnap?”). Léo üzenete két megszámlálható viennoiserie-fajtát nevez meg. **A két kulcsmondat funkciója (N7):** az egyikből holnap reggel veszek kettőt (*Je vais en prendre deux*). A másikból Camille-lal nem akarunk venni, valódi okkal (pl. Camille nem szereti, vagy túl édes a brunch-hoz), és ezzel Léo is tudja, hogy azt se hozza (*Nous ne voulons pas en acheter*). A „már megvettük” indok kizárva, mert ellentmond az idővonalnak. A tanuló elküldés előtt javít; a két hibás mondat és a kulcs marad. | helyesbítés, valódi céllal |
| p08 / i07 | Hat mikrohelyzet az idővonal pontjain (3.3), metanyelvi keret nélkül. | – |
| p09 / i08 | 10:15, válasz Léónak. A tanuló elmondja: mit vettünk már (*en*, passé composé), mit hozzon még Léo és mennyit (*en* + infinitif), melyik pékségből, és miért. Címzett: Léo; regiszter: informális, nem szleng; 6–8 mondat. | indokolt választás; *même si* / *tandis que* a modellekben, opcionálisan |

**A p09 tartalmi elemei.** A nyelvi `allCriteria` változatlan.

| Régi elem | Új elem |
|---|---|
| 1. ital vagy étel rendelése | 1. mit vettetek már Camille-lal |
| 2. legalább egy pékségi termék | 2. mit hozzon még Léo, mennyiséggel, **és legalább egy anyagnévi tétel meghatározatlan mennyiségben** (pl. kenyér vagy frissen facsart narancslé; N13) |
| 3. konkrét kávézó vagy pékség (*de + le*) | 3. melyik pékségből, *du*-val megnevezhető hellyel (pl. a piaci pékség) |
| 4. nem azonosított csoport vagy mennyiség | 4. a sor vagy a kínálat: nem azonosított tömeg vagy mennyiség |
| 5. azonosított csoport részhalmaza | 5. egy megnevezett csoport részhalmaza (pl. a kirakat vagy a törzsvendégek) |
| 6. legalább két *en* | 6. indoklás: miért az a pékség |

- A tanuló a kritériumokat hat egyszerű magyar ellenőrzőkérdésként látja, mindegyik mellett egy nem kimásolható mikropéldával. Az ID-k csak a szerkesztői kulcsban maradnak.
- **Modellek:** két új, eltérő hangú modell kell: egy lelkes ajánlás és egy óvatos „igen, de…”. Mindkettőben:
  - van partitív *du* az anyagnévi tételre (N13);
  - minden *en* előtt kimondott, megszámolható előzmény áll.

  A régi A modell kikerül.

### 3.3 Az i07 subitemjei

| Subitem | Helyzet | Előírás a szerzőnek |
|---|---|---|
| s001 (partitív *du*) | 9:30, otthon | Hímnemű anyagnév (pl. vaj vagy méz). Az ige nem lehet *boire*, *commander*, *acheter* (ezek a p02-ben és az i01-ben vannak), és nem lehet *rester* sem. Az *un* ne legyen természetes. |
| s002 (*du* = de + le) | **8:25, a metró kijáratánál** (N12) | Más hely és más szerkezet, mint az i02-ben (pl. *la sortie de* + *le métro*), nem a kávézó. A kitöltendő hely előtt és után ne álljon másik *du*. |
| s003 (*d'* + előretett melléknév) | szombat este, a pékség bemutatkozó szövege | Gondozott regiszter, magánhangzóval kezdődő melléknév. A főnév és a melléknév más, mint az i03-ban és a p04 példáiban. A *les* ne lehessen helyes. |
| s004 (*des petits pains*) | 8:45, a tábla előtt | A *Petits pains* kategória látszik. Méretre utaló kontextus nincs. A bővítmény más, mint az i03-ban és a p04-ben. |
| s005 (*beaucoup de*) | szombat este, a bemutatkozó szöveg a kínálatról | Nem a sor. Más főnév, mint a p05-ben és az i04-ben (megszámlálható többes szám). A *beaucoup* a stimulusban áll; mögötte nincs meghatározó bővítmény. |
| s006 (*en* infinitif előtt, a mennyiség megmarad) | 8:45, a pult | A *trois parts de flan* marad. Szám után nincs melléknév (B6). A p06 nem használhat *en prendre trois*-t. |

### 3.4 Terhelési korlát

- Minden oldal tetején egysoros helyzetjelző áll: ki, hol, mikor.
- Itemstimulusonként legfeljebb 2–3 sor kontextus.
- A p04 kulturális megjegyzése legfeljebb 3 sor.
- Az új szókincs (*formule*, *viennoiserie*, *ardoise*, *habitués*) nem mért elem; F-glosszát kap. A CEO egyeztesse a VR heti listájával.
- Becslés: 34–45 perc.

### 3.5 Kötelező szerzői előírás: a magyarázat nem árulja el a kulcsot (új, N11)

**Szabály.** Egy magyarázó oldal példái és ellenpéldái nem tartalmazhatják:
- a hozzá tartozó vagy bármely későbbi item **stimulusát vagy kulcsmondatát**;
- **ugyanazt az ige + főnév + szám (vagy hely)** kombinációt.

A szabályt más igével, alannyal, főnévvel, számmal és mozzanattal kell illusztrálni.

**Megengedett:** a célkifejezés (*des petits pains*, *beaucoup des*, *en* + szám) fogalomként szerepelhet a magyarázatban, de nem az item keretében és bővítményével.

**Itemek közötti ismétlés.** Gyakorló itemek között az ismétlés megengedett előhívásként: az i05-2 és az i06 kulcsa egyaránt *Je vais en prendre deux*, ez a megtartott célalakokból adódik. A magyarázatból viszont semmilyen kulcs nem másolható ki.

**Elosztási mátrix.** Ez irány, nem kész mondat; a szerző a kategórián belül szabadon választ.

| Cél | Magyarázat (példák) | Item(ek) | Tilos a magyarázatban |
|---|---|---|---|
| partitív *du* | p02: *boire*, *commander* + ital | i01-1: *acheter* + kenyér; s001: *mettre / étaler* + vaj vagy méz (otthon) | *acheter du pain*, a s001 főneve |
| *de + le* | p02: *parler de*, *se souvenir de*; p03: *sortir de*, *revenir de* + **piac**, *le prix de* | i01-2: helyhatározói szerkezet (*à côté de / près de*) + más hímnemű hely (pl. park); i02: *revenir de* + a kávézó; s002: *la sortie de* + metró | a kávézó + *revenir de* kombináció, a metró, az i01-2 helye |
| *d'* + előretett melléknév | p04: más melléknév és termék (pl. *de belles*, *de grosses* + tarte, miche) | i03: *d'excellents* + i03-főnév; s003: *d'* + más magánhangzós melléknév + más főnév | az *excellent-* melléknév, az i03 és a s003 főneve |
| *des petits pains* | p04: fogalomként, más bővítménnyel (pl. *au lait*) vagy bővítmény nélkül | i03 és s004: két különböző bővítmény | az i03 és a s004 bővítménye |
| *beaucoup de / des* | p05: **emberek** (tömeg ↔ *habitués du dimanche*) | i04: a **kirakat termékei**; s005: a **kínálat** (más megszámlálható főnév) | az i04 és a s005 főneve |
| *en* ragozott ige előtt | p06: más ige (pl. *manger*, *garder*) | i05-1: *J'en prends.* | *en prendre / J'en prends* |
| *en* infinitif előtt | p06: más ige, más szám (pl. *en commander six*) | i05-2, i06: *en prendre deux*; s006: *en prendre trois* | *en prendre* + bármilyen szám |
| *en* tagadásban | p06: más ige és alany (pl. Camille, *boire*) | i05-3: *Je n'en veux pas.*; i06: *ne voulons pas en acheter* | *vouloir* és *acheter* tagadva |
| *en* + passé composé | p06: más alany, más ige, más szám, **más mozzanat** (pl. Camille, *prendre*, négy, a pultnál) | i05-4: *Nous en avons acheté trois.* (a 10:15-ös üzenet) | *nous* + *acheter* + három; a 10:15-ös üzenet |
| hibajavítás | p07: a két hibatípus **más igével és más számmal** illusztrálva | i06 | az i06 stimulusa és kulcsa szó szerint |

A független megoldó a kéziraton ellenőrizze, hogy egyetlen item sem oldható meg a magyarázat egy példájának kimásolásával (K12).

---

## 4. Tanári kifogásonként

| Kifogás | Hogyan kezeli a terv |
|---|---|
| „pas bien structuré, ni très intéressant, ça ne sonne pas français” | Egy rögzített keret: Lyon, vasárnapi brunch, négy szereplő, idővonal, négy hiteles műfaj. |
| „trop facile”; a mag B1+-on ismétlés (D4) | A mag pontosításként marad. A műveleteket emeljük: helyesbítés (p02, p07), értékelő műfaj (p04), indokolt választás (p09), *même si* / *tandis que* ott, ahol a helyzet hozza. |
| Mesterkélt, magazinba nem illő fordulat (A) | Más egységről szól; az elv itt is érvényes. PE és NyE. |
| B3: a kitöltendő hely nem kényszeríti ki a mennyiségjelzőt | i04: két megadott alak; s005: a *beaucoup* a stimulusban áll; a részhalmaz csoportja megnevezett. A kanonikus változattal egyeztetni kell (0.1). |
| B4: *pas du thé* → *pas de thé* | Ilyen item nincs. Az i05-3 az alapesetet követi. A kontrasztív *pas du…, mais du…* tilos. |
| B6: *J'en veux deux frais* → *deux* | Az *en* + szám után nincs melléknév. A vasárnap reggeli croissant amúgy is friss. |
| C1: *caler* → *va me caler* | Csak *ça va me caler* formában szerepelhet. |
| C4: *Je vais vous prendre…* rendben | A pultnál használható, jelölés nélkül. |
| D1–D3, D5 | D1: a pultjelenet (p06/i05). D2 és D3: p04. D5: p04 és p09, forrásból, nem mért. |
| EU Academy | NEM VIZSGÁLT; a szerző nézze meg. |

---

## 5. Kockázatok és elkerülésük

| ID | Súly | Kockázat | Elkerülés |
|---|---|---|---|
| K1 | MAJOR | Az i07-s001-nél az *un* is helyes lesz. | Otthoni helyzet, hímnemű anyagnév; a független megoldó ellenőrzi. |
| K2 | MAJOR | A *beaucoup des* helyén a *la plupart des* vagy a *beaucoup d'…* is helyes lehet. | Két megadott alak, megnevezett csoport, a feedback csak a két alakot értékeli. |
| K3 | MAJOR | Az i05 párbeszédében a természetes válasz más igével jönne. | Kötött transzformáció, látható kiinduló mondat; az eltérő igéjű helyes válasz „nem teljes értékű, de nem hibás”. |
| K4 | MAJOR | A p09 modelljei ellenőrzőlistának hatnak, vagy bizonytalan az *en* előzménye. | Két eltérő hangú modell, kimondott előzményekkel, partitív anyagnévvel (N13). NyE és PE. |
| K5 | MINOR | A *des petits pains* indoka vitatható. | Szemantikai indok, a 0.3 referencia és a látható tábla; méretkontextus nincs. |
| K6 | MINOR | Az új szókincs terheli a hetet. | F-glossza, nem mért, egyeztetés a VR-rel. |
| K7 | MINOR | A keret túl szoros, minden ugyanaz. | A 3.5 mátrixa célonként más igét, főnevet és mozzanatot ír elő. |
| K8 | NOTE | Metaadat: `objectives` és subset-cél. | Az `objectives` ESCALATED. A subset-cél bekerül a manifestbe (2.1), törlés tilos. |
| K9 | MAJOR | Az i01-ben két helyes elemzés lehetséges. | A félreértés csak a p02-ben van; a megoldó kontextus nélkül is elemez. |
| K10 | MAJOR | Sérül az idővonal vagy a *nous*. | Kötelező táblák; a NavE oldalanként ellenőrzi. |
| K11 | MINOR | A kanonikus változat eltér a mért alakoktól. | 0.1: CEO-szkript; eltérésnél visszamegy a GR-hez. |
| **K12** | MAJOR | (új, N11) A magyarázat példájából kimásolható a kulcs. | 3.5 szabály és mátrix; a független megoldó item-ként ellenőrzi; a NavE a 3.5 tiltó oszlopát veti össze a kézirattal. |
| **K13** | MINOR | (új, N12) Szivárgó *du* a stimulusban, vagy ugyanaz a hely több mérésben. | Az i02 bővítménye *du* nélküli; a s002 más hely és más mozzanat; az i01-2 harmadik hely. |
| **K14** | MINOR | (új, N7) A p07-ben az *en* előzménye nem megszámlálható, vagy a mennyiség nem illik három emberhez. | Léo üzenete két megszámlálható fajtát nevez meg; a szerző a 3.1 mennyiségi szabályát követi. |

---

## Dispositionök (2. kör)

| Finding | Disposition | Indok és hely |
|---|---|---|
| N1 (maradék) | FIXED | 0.1: az összevetés a CEO szkriptjéé, a NavE a futás bizonyítékát kapja. A kimenet csatolása a Kézirat fázis kapuja. |
| N7 (maradék) | FIXED | 3.1 és p07: Léo azt kérdezi, mit veszünk mi. A két kulcsmondat funkciója kimondva. A „már megvettük” indok kizárva. K14. |
| N9 (maradék) | FIXED (kapuként) | 0.2 és 0.3: a Kézirat fázis csak a forráslista és a NyE által megnyitott OQLF-lap után indulhat. Forrást most sem nyitottam meg. |
| N10 | FIXED | 2.1: irány megadva (felvétel a manifestbe i04- és i08-kötéssel, törlés tilos). Indok: már jóváhagyott, mért cél. Ha a CEO bővítésnek látja, eszkalálja. |
| N11 | FIXED | Új 3.5 szabály és elosztási mátrix; p02, p04, p06, p07 sorai igazítva; a p06 passé composé-példája más mozzanatból jön; K12. |
| N12 | FIXED | i02: *du* nélküli bővítmény. s002: metró, 8:25. i01-2: harmadik hely. K13. |
| N13 | FIXED | p09 2. elem: anyagnévi tétel; mindkét modellben partitív *du*. A nyelvi kritérium nem változott. |
| N2–N6, N8, U1–U8, a NOTE-ok, J1 | változatlan (az 1. körben FIXED, illetve REJECTED_WITH_REASON) | A NavE recheck ezeket lezárta vagy nem érintette. |

## Változáslista (az 1. javított változathoz képest)

- **0.1:** a szkriptes összevetés felelőse a CEO; a kanonikus kimenet a Kézirat fázis kapuja.
- **0.2 és 0.3:** kifejezett kapu a Kézirat fázis előtt.
- **2.1:** a subset-cél manifestbe vétele, iránnyal.
- **2. pont:** az i03 mért alakjainak pontosítása.
- **3.1, idővonal:**
  - Léo szombati kérdése: „mit vesztek holnap?”;
  - a kávézó neve *du* nélküli;
  - új 8:25-ös mozzanat (s002);
  - a s003 és a s005 helye rögzítve;
  - a mennyiségek három emberhez illenek.
- **3.2:** a p02/i01, p03/i02, p04, p05/i04 (a kirakat termékei), p06 (más mozzanatból vett passé composé-példa), p07 (a kulcsmondatok funkciója) és p09 (anyagnévi tétel, partitív *du* a modellekben) sorai.
- **3.3:** s001 (tiltott igék), s002 (új hely és mozzanat), s003, s004, s005, s006 (a p06-ra vonatkozó tiltás).
- **Új 3.5:** a kimásolhatósági szabály és az elosztási mátrix.
- **Új kockázatok:** K12–K14; a K8 frissítve.
- **Változatlan:** a cél, az ID-k, a feladattípusok, a mért célmondatok, a nyelvi `allCriteria`, az időkeret-becslés.

## Findingok a régi kéziratról (változatlan)

- **F1 (MAJOR):** a p09 A modellje inkoherens.
- **F2 (MAJOR):** metanyelvi stimulusok (i04, i07-s001, i07-s005).
- **F3 (MINOR):** reklámnyelv a pincér szájában (i03).
- **F4 (MAJOR, új a régi kéziraton, N11):** a régi magyarázatok példái szó szerint az itemek stimulusai vagy kulcsai (p02↔i01, p04↔i03, p06↔i05, p07↔i06).

## Hiányok, döntési kérdések, bizonyíték

- **Hiányzik:** a kanonikus kimenet és napló (0.1 kapu); a (2,1)-es kiosztás (az `objectives` ESCALATED). A CEO csatolja mindkettőt.
- **Új bizonyíték:** a 3.5 mátrixa a régi p02/p04/p06/p07 ↔ i01/i03/i05/i06 átfedés alapján (a NavE tételes összevetésére építve). Webes forrást ebben a körben nem nyitottam meg.
- **Újrahasznosított bizonyíték:** az OQLF-, Observatoire- és Lawless-keresési kivonatok az 1. körből, változatlanul nem megnyitott státuszban.
- **Ellenőrzés:** NavE recheck szűken: N1, N7, N9, N10, N11, N12, N13 sorai (0., 2.1, 3.1, 3.2, 3.3, 3.5, K12–K14). PE; a kéziraton NyE és HE.
- **Következő címzett:** CEO.

**Tanulság:** ha egy javítás megtartja a kulcsmondatokat, de újraírja a magyarázatot → a tervben célonkénti elosztási mátrix kell (ige, főnév, szám, hely; magyarázat ↔ item ↔ tiltott kombináció) → különben a régi átfedés vagy a szivárgó alak észrevétlenül visszakerül → minden „a mért célmondat marad” elvű javítási terv.

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE