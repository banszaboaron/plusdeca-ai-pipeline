# U21 (w01-u-2-1, GI2): *Du, des, de : forme ou sens ?* — javítási terv

**Szerep:** GR (nyelvtan-rendező). **Megbízás:** a meglévő egység javítási terve, 1. hét, 2026-10-es javítás.
**Bemenet:** `week-01.json` → `units[w01-u-2-1]` (státusz: REVISION_REQUIRED), javítási brief (2026-10), tanári kifogások (FICHE-01 és a 10-20-i bírálat), szintmérce, feladattípus-mérce, jó és rossz példák.
**Hatókör:** a p01–p09 oldalak helyzetei, példái, stimulusai és modellszövegei. Nem írok kész tanulói szöveget, kulcsot vagy distractort.
**Hang és videó:** az egységhez nem tartozik felvétel, és a terv sem kér újat. Hangdöntési pont nincs.

---

## 1. Diagnózis

**Valóságpróba.** Az egység mondatai nem egy helyen és nem egy emberrel történnek. Mindegyik a szabály kedvéért íródott: *Je parle du café de la gare*, *Je sors du café du marché*, *Elle cherche de vieux cafés parisiens pour son article*. Több stimulus a megoldási feltételt metanyelven mondja ki, a helyzet helyett:
- i07-s001: *sans préciser la quantité*;
- i07-s005: *dont personne ne connaît encore la clientèle*;
- i04: *dans la première phrase, on parle de clients non identifiés…*

Ez pontosan a mérce 7. rossz példája: a helyzet csak díszlet. A francia ember így nem beszél. A pincér sem mondja a pultnál, hogy *Nous servons d'excellents croissants et des petits pains aux céréales*: ez reklámszöveg, nem pultnál folyó beszéd.

**Érdekesség.** Nincs tét, nincs döntés és nincs nézőpont. A tanuló nem tud meg semmit a francia pékségről: mi a *formule petit-déjeuner*, mi a viennoiserie és a pain közti különbség, mikor van sor a pultnál. A tanár D-pontjai (tipikus rendelési fordulatok, péksütemény-szókincs kulturális háttérrel, magyar összevetés) teljesen hiányoznak.

**Szint.** A nyelvtani mag a tanár szerint B1+-on ismétlés. Ez a blokk ezt jórészt jól kezeli: nem az alapszabályt tanítja újra, hanem pontosít: a *du* két értéke, *d'excellents* ↔ *des petits pains*, *beaucoup de* ↔ *beaucoup des*, az *en* helye. A **feldolgozás** viszont A2-es: elszigetelt mondatok, mechanikus átalakítás. A szintet itt a helyzet és a művelet emelheti: helyesbítés, indokolt választás, értékelő műfaj. A nyelvtani tartalom maradhat.

**Műfaj.** Az egység nem él műfajjal: tankönyvi minimondatokból áll. A p09 írásfeladata (6–8 mondat, hat kötelező szerkezettel) a modellszövegekben ellenőrzőlista-ízű. Az A modell nem is koherens: *Beaucoup des pâtisseries… étaient déjà réservées. J'en ai acheté deux* (miből, ha le voltak foglalva?); *je vais en prendre encore une avant de partir* (már elment). A modellszöveg ugyanazon mérce alá esik, mint az olvasmány, és ez nem üti meg.

**Belső ellentmondás, amelyet a CEO-nak jelzek.**
- A futtatási `objectives` mező tagadást, az *être* utáni kivételt és a *sans + főnév* alakot ígér. Ezeket az egység nem tanítja.
- Az `approvedObjectives` (6 pont) és a `targetManifest` a ténylegesen tanított anyagot írja le.
- Az i04 `targetIds` mezőjében álló `w01-g-de-quantity-subset` nem szerepel a `targetManifest`-ben.

Ez metaadat-hiba, nem célváltozás. Szkripttel kell egyeztetni (lásd az 5. pontot).

---

## 2. Mi marad, és miért

| Elem | Marad | Indok |
|---|---|---|
| Tanulási és mérési cél (`approvedObjectives` 1–6, `targetManifest` 8 célja) | igen | A brief rögzíti. A DONTESEK 10-28 szerint a mag pontosító ismétlésként marad, és ez a blokk pont pontosít. |
| Oldal-ID-k p01–p09, item-ID-k i01–i08, subitem-ID-k (i01-s001, i05-s001, i07-s001…s006, i08-s001) | igen | Stabil azonosítók. |
| Feladattípusok: rövid jelentéselemzés (i01), QCM (i02), kétmezős kitöltés (i03, i04), négymezős átalakítás (i05), hibajavítás (i06), hat vegyes subitem (i07), nyitott írás rubrikával (i08) | igen | A brief rögzíti, és mindegyik a célhoz illő művelet. |
| Mért célalakok | igen | Lásd az alábbi listát. |
| Terjedelem: 9 oldal, 8 item, 32–42 perc, p09: 6–8 mondat | igen | A p04-be kerülő 2–3 soros kulturális és magyar megjegyzés nem növeli érdemben az időt (lásd a 3. pontot). |
| A magyarázatok szabályszerkezete (p02 két *du*, p04 a *de* + előretett melléknév és a lexikalizált *des*, p05 részhalmaz, p06 az *en* négy helye) | igen, új példákkal | A szabálymagyarázat szakmailag rendben van. A tanár a szövegek és helyzetek hitelességét kifogásolta, a szabályt nem. |
| A p09 hat `allCriteria` kritériuma és a négyszintű rubrika | igen | Mérési cél, ezért nem az én döntésem. A szigorúság kérdése a régi nyitott döntések között már szerepel. |

A mért célalakok:
- i02: *du* (de + le);
- i03: *d'excellents… / des petits pains*;
- i04: *beaucoup de ; beaucoup des*;
- i05: *J'en prends. / Je vais en prendre deux. / Je n'en veux pas. / Nous en avons acheté trois.*;
- i06: *Je vais en prendre deux. / Nous ne voulons pas en acheter.*;
- i07: *du / du / d' / des / de / Je vais en prendre trois.*

A tanár ennél az egységnél nem jelölt semmit rendben lévőnek. A hasonló ellenőrző itemek (B1, B2, B5, B7, B8, C2, C3, C5–C8) „oui” minősítést kaptak, ezért a feladatszerkezetek bevált formáját nem bontom meg.

---

## 3. Mi változik, és miért

### 3.1 Az új helyzet (közös keret az egész egységre)

- **Hol:** egy boulangerie-pâtisserie egy francia városi negyedben, néhány asztallal és pulttal. Szombat reggel van, a sor kiér az ajtóig. A krétatáblán (*ardoise*) kategóriák állnak: *Viennoiseries*, *Petits pains*, *Pâtisseries*. Van *formule petit-déjeuner* is (meleg ital, viennoiserie, gyümölcslé, fix ár). A konkrét várost és árat a szerző rögzítse, és mindenhol tartsa: minden szám (ár, darab) egyértelműen vonatkozzon valamire.
- **Ki:** a tanuló, aki magyarként Franciaországban él (keret: *te*, *je*), egy francia barát vagy lakótárs, akivel üzenetet vált, és a pékségben az eladó. Csak ez a három szereplő legyen, ne vándoroljon a nézőpont (mérce, 3. és 6. pont).
- **Tét:** vasárnap reggelire vagy brunchra kell bevásárolni ketten-hármunknak. Melyik pékség, mit, mennyit, és mi fogy el addig. Ebből természetesen adódik a mennyiség (*en*, *beaucoup de*), a minősítés (*d'excellents*), a hely (*je sors du…*, *le pain du coin*) és a választás indoklása.
- **Műfajok:** az egység négy hiteles műfajból építkezik.
  1. Pultnál folyó rövid párbeszéd: kérdés és válasz, *en*-nel.
  2. SMS- vagy üzenetváltás két barát között: *du* mint hely és mint mennyiség, félreértés tisztázása.
  3. Rövid helyértékelés (*avis* egy térképes vagy ajánló alkalmazásban): *d'excellents…*, *des petits pains…*, *beaucoup de monde*, *même si*, *tandis que*. A helyértékelés pont az a műfaj, ahol a *On y trouve d'excellents croissants* természetes; a pincér szájában nem az.
  4. Krétatábla vagy kínálat-felirat a pékségben: a *Petits pains* kategória vizuális rögzítése.
- **Miért hihető:** a szombati sor, a krétatábla, a reggeli formula és az értékelés a pékségről mind valóban létező francia gyakorlat. Rendelési fordulatokból csak azok kerülnek be, amelyeket a tanár jóváhagyott vagy a forrás igazol: *Je vais vous prendre…* (C4: oui), *Oui, j'en veux deux* (B6), *va me caler* (C1).
- **Forrásigény a szerzőnek:** legalább egy valódi pékség krétatábla- vagy kínálatfotója, illetve honlapja a kategóriákhoz és a formula valós felépítéséhez és árszintjéhez, valamint 2–3 valódi pékségértékelés a műfaj fordulataihoz. Eredetjelölés: FORRÁSALAPÚ SAJÁT SZÖVEG. A tanár által ajánlott EU Academy anyagot ebben a hívásban NEM VIZSGÁLTam. A szerző nézze meg, van-e benne a pékségi rendeléshez használható fordulatkészlet.

### 3.2 Oldalankénti vázlat (oldalanként egy sor, kész mondatok nélkül)

| Oldal | Új tartalom (vázlat) | Szintemelés helye |
|---|---|---|
| p01 | A keret 2–3 mondatban bemutatja a szombati pékséget és a vasárnapi bevásárlást. A négy cél ugyanaz, de a példák már a keretből jönnek, nem a *café de la gare*-ból. | – |
| p02 | A *du* két értéke egy üzenetváltásban. A barát a *café* szót kétféleképpen használja (ital, illetve a sarki kávézó mint hely), ebből egy kis félreértés lesz, amelyet az üzenetváltás tisztáz. 3–5 példa ugyanebből a jelenetből, különböző igékkel: *boire*, *rester*, *sortir de*, *parler de*. A *Je bois de café* kontraszt marad. | Helyesbítés: valaki kijavít egy félreértést. |
| p02 / i01 | A stimulus két mondata ugyanabból az üzenetváltásból való, és jelentésre nézve tényleg kétértelmű helyzetet old fel: az egyik *du* ital, a másik hely. A tanuló művelete ugyanaz, mint eddig: rövid jelentéselemzés. | Helyesbítés. |
| p03 | A *de + le* példák a keret mozgásából jönnek: *je sors du…*, *je reviens du marché*, *le prix du…*. Kontraszt: *Je voudrais du café* ↔ *Je reviens du café*. | – |
| p03 / i02 | Az SMS-helyzet megmarad (a barát ajánlott egy helyet, te ma reggel ott voltál). A „hier, ton ami t'a recommandé…” jellegű keret hihető, csak a közös keretbe kell illeszteni. Mért alak: *du*. | – |
| p04 | A melléknévi *de* ↔ lexikalizált *des* kontrasztja a helyértékelés műfajában. A krétatábla *Petits pains* kategóriája vizuálisan rögzíti a terméknevet. Ide kerül egy 2–3 soros magyar–francia összevetés a viennoiserie, a pain és a mini-viennoiserie közti különbségről, a magyar „péksütemény” lazább kategóriájához mérve. A „vieux cafés parisiens pour son article” példa kikerül. | *même si* egy értékelő mondatban, ha természetes (pl. jó, de drága). |
| p04 / i03 | A stimulus egy értékelés két mondata, nem a pincér szövege. Mért alak: *d'excellents… et des petits pains…* | Értékelő műfaj. |
| p05 | Részhalmaz-kontraszt a szombati sorban: sok ember vár (meghatározatlan), és a negyed törzsvendégei (*les habitués du samedi*, előre megnevezett csoport) közül sokan már előre rendeltek. A csoportot a szöveg a kitöltendő mondat előtt vezesse be, ne metamegjegyzés. | *tandis que* a két csoport szembeállításához, ha természetes. |
| p05 / i04 | Az instrukció továbbra is megadja a két lehetséges alakot (*beaucoup de / beaucoup des*), így a mennyiségjelző kötelező (tanári B3 tanulsága). A metanyelvi „Contexte : dans la première phrase…” kikerül; a helyzetet a jelenet adja. | – |
| p06 | Az *en* helye pultnál folyó párbeszédben: az eladó kérdez, a vevő válaszol, utána otthon beszámol a lakótársának (ez a passé composé). A négy szabály (ragozott ige, infinitif, tagadás, passé composé) marad, a példák a jelenetből jönnek. | – |
| p06 / i05 | A négy átalakítandó mondat a párbeszéd négy pontja (két válasz a pultnál, egy cukor-visszautasítás a kávéhoz, egy beszámoló este). A célmondat marad (pl. *Je n'en veux pas*), csak a kérdés, amelyre válaszol, legyen előtte látható. | – |
| p07 / i06 | „Clinique d'erreurs” helyett hihető helyesbítés: egy francia nyelvet tanuló barát (vagy a tanuló saját korábbi üzenete) rendelési üzenetet készít a pékségnek, például előrendelést vasárnapra, és benne van a két hiba. A tanuló kijavítja, mielőtt elküldik. A két hibás mondat és a kulcs marad. | Helyesbítés, valódi céllal. |
| p08 / i07 | Hat mikrohelyzet ugyanabból a szombat reggelből. A jelentést a helyzet döntse el, ne metamegjegyzés; az s001 és s005 mostani metanyelvi kerete kikerül. | – |
| p09 / i08 | Új helyzet, valódi döntéssel. A barát üzenetet küld: „vasárnap reggelire melyik pékségből hozzunk, és mit?” A tanuló válaszol, ajánl és megindokol, és megmondja, mit vett már és mit vesz még. Címzett, regiszter (informális, nem szleng), 6–8 mondat és a hat kritérium marad. Két új, egymástól eltérő modell kell (pl. az egyik lelkes ajánlás, a másik óvatos „igen, de…” típusú választás). Mindkettő koherens legyen, az *en* mindig egyértelmű előzményre utaljon. | Indokolt választás; *même si* és/vagy *tandis que* a modellekben, opcionálisan. Kötelező kritérium nem lesz belőle, mert a mérési cél nem változik. |

### 3.3 Az i07 subitemjei (a mért képesség és a célalak marad)

| Subitem | Mit kérdez az új helyzetből | Mire figyeljen a szerző |
|---|---|---|
| s001 (*du*, partitív) | Egy anyagnév meghatározatlan mennyiségét otthon, a reggeli előkészítésénél (pl. maradt-e valami a kancsóban vagy a kenyeres zacskóban). | Olyan keret kell, ahol az *un* (egy adag) nem természetes. A pultnál az *un café* a normális rendelés, ezért a s001 ne a pultnál játszódjon. |
| s002 (*du* = de + le) | Mozgás egy megnevezett helyről (*sortir de / revenir de* + hímnemű, azonosított hely). | Ne legyen benne második *du* (mint eddig a *du marché*), mert az a kitöltés előtt megmutatja az alakot. |
| s003 (*d'* + előretett melléknév) | Értékelésből vagy a kínálat leírásából; magánhangzóval kezdődő melléknév. | A *les* ne lehessen helyes: ne legyen előre azonosított csoport. |
| s004 (lexikalizált *des petits pains*) | A krétatábla kategóriájára utaló mondat. | A *Petits pains* kategória legyen látható a stimulusban; ez a kulcs indoka. |
| s005 (*beaucoup de*) | A szombati sor, meghatározatlan tömeg; a *beaucoup* adott. | Mögötte ne álljon meghatározó bővítmény (*du quartier*, *du samedi*), mert az a *des*-t is lehetővé teszi. |
| s006 (az *en* infinitif előtt, a mennyiség megmarad) | A *trois parts de flan* a pultnál marad: valódi francia pékségtermék, jó. | – |

---

## 4. Tanári kifogásonként

| Kifogás | Hogyan kezeli a terv |
|---|---|
| „pas bien structuré, ni très intéressant, ça ne sonne pas français” | Közös keret (szombati pékség, vasárnapi reggeli), három szereplő és négy hiteles műfaj (pult, SMS, értékelés, krétatábla) a különálló minimondatok helyett. |
| A szint „trop facile”; a mag B1+-on ismétlés (D4) | A nyelvtani mag pontosításként marad (DONTESEK 10-28). A műveleteket emeljük: helyesbítés (p02, p07), értékelő műfaj (p04), indokolt választás (p09), *même si* / *tandis que* a modellekben, ahol a helyzet hozza. |
| A mesterkélt, magazinba nem illő fordulat (FICHE-01 A) | Más egységre vonatkozik. Itt ugyanez az elv: az értékelés és az üzenet hangja a műfajé, nem a tankönyvé. A NyE és a PE ezt külön nézze. |
| B3: *beaucoup de / des*, a kitöltendő hely nem kényszeríti ki | i04: az instrukció megadja a két alakot. i07-s005: a *beaucoup* a stimulusban áll. A részhalmazhoz a csoportot a szöveg előbb megnevezi. |
| B4: *pas du thé* → *pas de thé* | Ebben az egységben nincs ilyen item. Az i05 harmadik mondata (*Je ne veux pas de sucre*) már a helyes alapesetet követi. Kontrasztív *pas du…, mais du…* ne kerüljön be. |
| B6: *J'en veux deux frais* → *deux* | Az *en* + szám után ne álljon felesleges melléknév. A p06 és p09 példái a *Oui, j'en veux deux* mintát követik. |
| C1: *caler* → *va me caler* | Ha a p09 modellje vagy a p06 párbeszéde laktatásról szól, csak a *ça va me caler* szerkezet szerepeljen. |
| C4: *Je vais vous prendre…* rendben | Használható a pultnál, regiszterjelölés nélkül. |
| D1: tipikus rendelési fordulatok | p06 és i05: pultnál folyó párbeszéd valós fordulatokkal. |
| D2: péksütemény-szókincs kulturális háttérrel | p04: krétatábla-kategóriák, viennoiserie / pain / mini-viennoiserie, *formule petit-déjeuner* a keretben. |
| D3: magyar összevetés | p04: 2–3 soros megjegyzés. Nem nő tőle a terhelés. |
| D5: érdekesebb kifejezések a szokásokra | p04 és p09 (értékelés és ajánlás): a szerző a forrásból vegyen 1–2 ilyen fordulatot. A megértéshez nem lehetnek szükségesek, és nem mérjük őket. |
| A tanár által ajánlott EU Academy | NEM VIZSGÁLT. A szerző nézze meg forrásként (lásd 3.1). |

---

## 5. Kockázatok és elkerülésük

| ID | Súly | Kockázat | Elkerülés |
|---|---|---|---|
| K1 | MAJOR | A valósághű pultjelenetben az i07-s001-nél az *un café* is helyes lesz, és két jó válasz lesz. | A s001 otthoni, anyagnévi helyzetben játszódjon (3.3). A megoldásíró és a független megoldó ezt külön ellenőrizze. |
| K2 | MAJOR | A *beaucoup des* részhalmaz-kontextusában a *beaucoup d'habitués* (nem részhalmaz) vagy a *la plupart des* is helyes lehet. | Az i04 két alakot ad meg választásra. A csoport legyen határozott bővítménnyel megnevezve (*les habitués du samedi*), és a feedback csak a két megadott alakot értékelje. |
| K3 | MAJOR | Az i05 párbeszédes keretében a válasz természetesebben más igével jönne (*Non merci, je n'en prends pas*), és a tanuló jogosan írná azt. | A transzformáció kötött marad: a kiinduló mondat látható, és a tanuló azt alakítja át. A kérdés csak kontextus. A természetes, de eltérő igéjű választ a kulcs jelölje „nem teljes értékű, de nem hibás” változatként, ahogy most az *On en a acheté trois*-t. |
| K4 | MAJOR | A p09 modelljei a hat kritérium miatt megint ellenőrzőlistának hatnak, vagy az *en* előzménye nem egyértelmű (mint a mostani A modellben). | Két eltérő hangú modell kell. Mindegyik *en* előtt legyen kimondott, megszámolható előzmény. A modellekre is NyE és PE kell. A szigorú `allCriteria` kérdése továbbra is nyitott régi döntés, ezért itt nem változtatok rajta. |
| K5 | MINOR | A *des petits pains* indoklása (lexikalizált terméknév) vitatható, ha a mondat a méretet hangsúlyozza. | A krétatábla kategóriája mindenhol látszódjon. Méretre utaló kontextus (*tout petits*, *minuscules*) ne legyen. A nyelvtani referenciát (Académie „Dire, ne pas dire”, Grevisse a *de/des* + melléknév kérdéséről) ebben a hívásban NEM VIZSGÁLTam, a NyE ellenőrizze. |
| K6 | MINOR | Új szókincs (*formule*, *viennoiserie*, *ardoise*, *habitués*) terheli a funkciópróba-hetet. | Csak a megértést szolgálja, nem mért elem. F-glossza kell hozzá. A VR heti listájával a CEO egyeztesse, ne legyen ütközés. |
| K7 | MINOR | A közös keret túl szoros: minden mondat ugyanaz a pékség és ugyanaz a croissant (mérce, 4. pont). | Igénként és célonként más termék, ige és mozzanat (sor, pult, otthon, üzenet). |
| K8 | NOTE | Metaadat: az `objectives` mező nem a tanított célokat írja; az i04 `targetIds` mezőjében manifesten kívüli ID áll. | A CEO szkriptje igazítsa az `objectives` mezőt az `approvedObjectives`-hez. Ez nem célváltozás, mert az elfogadott célok így is ezek. |

---

## Változáslista (a tervhez képest)

- Új közös keret: szombati pékség és vasárnapi reggeli, három szereplő, négy műfaj.
- Minden oldal példái és stimulusai új helyzetből jönnek. A metanyelvi kontextusmondatok kikerülnek (i04, i07-s001, i07-s005).
- A p04-be magyar–francia kulturális megjegyzés kerül. A p07 valódi helyesbítési feladat lesz. A p09 helyzete indokolt választás, két új modellel.
- Nem változik: a cél, az ID-k, a feladattípusok, a mért alakok és a terjedelem.

## Findingok a régi kéziratról

- **F1 (MAJOR):** a p09 A modellje nem koherens (*réservées* → *j'en ai acheté*; *encore une avant de partir*). A modellszöveg-mérce sérül. Javítás: új modellek.
- **F2 (MAJOR):** a stimulusok metanyelvi kontextusa (i04, i07-s001, i07-s005) díszlethelyzet (mérce, 7. pont).
- **F3 (MINOR):** az i03-ban a pincér szájába adott reklámnyelv műfajilag nem hiteles.
- **F4 (NOTE):** az `objectives` és a `targetIds` metaadata nem egyezik a manifesttel.

## Hiányok

- Ebben a hívásban külső forrást nem nyitottam meg. A pékségkínálat-, az értékelés- és a nyelvtani referenciák NEM VIZSGÁLTak; a szerző és a NyE feladata.
- Döntési kérdés nincs: a terv a megbízás keretén belül marad.

**Ellenőrzés:** PE, NavE; a francia szövegre NyE és HE; UE.
**Következő címzett:** CEO.

**Tanulság:** a stimulus metanyelven mondja ki a megoldási feltételt („sans préciser la quantité”) → a feltételt a helyzet adja (otthoni kancsó, megnevezett csoport) → így a helyzet nem díszlet, és nem lesz két jó válasz → minden nyelvtani kitöltős itemre.

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE