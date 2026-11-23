# PE-recheck: U21 (w01-u-2-1), Megoldás, 4. változat

A mostani változat mindhárom korábbi nyitott findingomat lezárja. Új BLOCKER, MAJOR vagy MINOR nincs, ezért a verdikt **REVIEW_PASS**. Két új NOTE van, ezek nem kötelező javítások.

## 1. Hatókör és bemenet

**Szerep:** szakmai ellenőr (PE), recheck.

**Bemenet:**
- a Megoldás 4. változata (DRAFT_FOR_REVIEW);
- a befagyasztott kézirat, amelybe a szerző átvezette az E-01–E-08 javításokat;
- a GR terve (2. javított változat);
- a két korábbi futásom: PE-M01, PE-M03, PE-R01 és a már lezárt tételek.

**Megvizsgáltam:** azt, hogy egy-egy item a szöveggel, a kérdéssel és a végleges opciókkal vagy kritériumokkal együtt érvényes-e, egyetlen jó választ ad-e, és természetes-e a francia.
- Itemek: i01–i08.
- Hangsúlyosan a módosult részek: i03, i05-4, i06, i07 (s001–s005 instrukciója, az s004 új stimulusa), i08 (ellenőrzőlista).
- Az új „nem a kért alak / művelet” (F) kategória feedbackjei.
- Az 1. rész általános szabályai, a feltételes szabály és a TANULOI_NEZET.

**Nem vizsgáltam:**
- a BLOKK_JSON-t (ez a CEO szkriptjéé, MO-F04);
- a tipográfiát (HE);
- a C minta általam javasolt részeit (*Camille en a pris quatre, elle est fan* és a záró mondat iránya), valamint az i06-F05 szövegét. Ezeket a szerepszabály szerint másik ellenőr nézze meg (NyE vagy PE-2).

## 2. Valóságpróba (a változásokra szűkítve)

**Saját leírás, az anyag előtt:**
- Reklamáció: vasárnap reggel valaki visszamegy a pékségbe a dobozzal, megmutatja, hogy két szelet van benne, és udvariasan szól.
- Krétatábla: a valódi ardoise tömör. Ilyesmi áll rajta: *Nouveau : petits pains aux noix !*, vagy egy rövid, személyes mondat, például *Ce matin, on a fait…*

**Összevetés:**
- **i05-4:** a *tu montres la boîte de flan* gesztus valósághű, a reklamáció most nem hirtelen. Rendben van.
- **s004:** a *la boulangère a ajouté à la craie : « Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds ! »* létező helyzet. A teljes, *nous*-os mondat egy krétatáblán kissé gondozottabb a megszokottnál. A tábla a pékség nevében szól, így a *nous* megáll. Ez nem hiba, lásd NOTE-1.

## 3. Korábbi findingok állapota

| ID | Előző súly | Állapot | Indoklás |
|---|---|---|---|
| **PE-M01** | MINOR | **FIXED** | Az E-01 után az s001–s005 válaszkészlete zárt és látható: *du, de la, de, d', des*. A *plein de*, a *pas mal de*, a *quelques*, a *plusieurs*, a *nos* és a számnév F01-et kap. Ez nem büntetés, hanem a kért alakra való visszavezetés („Ez franciául helyes lehet, de…”). Az instrukció egyértelműen kimondja a műveletet, így az elfogadási adat és az instrukció már nem mond ellent egymásnak. |
| **PE-M03** | MINOR | **FIXED** | A feltételes szabály mostantól egyszerre vonatkozik az i03 2. helyére, az s004-re, az i08 „Nem elegendő” sorára és a p04 kontrasztsorára. Utóbbi visszamegy a GR-hez és a kéziratszerzőhöz. A p04 új kontrasztsora (E-03) már nem állít forrás nélküli jelentéskülönbséget („kis méretű kenyerek”), így a tanuló nem lát egymásnak ellentmondó szöveget és feedbacket. Az A(3) rubrikapont a feltételes ESCALATED-ágon keresztül le van fedve. A 0.3 kapu (OQLF) maga nyitott, de ez forráskérdés, nem az én findingom (segitseg-1). |
| **PE-R01** | MINOR | **FIXED** | Mezőnként: <br>– **i05-1:** a *J'en veux bien* és az *Oui, j'en veux bien* bekerült (N05). <br>– **i06:** az *On n'en veut pas* és a *Nous ne voulons pas en prendre* F01-et kap („helyes francia mondat, de…”). A listán nem szereplő *On n'en prendra pas* és *J'en veux deux* a semleges `incorrect` szöveget kapja, amely nem minősít hibásnak, hanem az instrukcióra utal. <br>– **i05, s006:** az `incorrect` szöveg kifejezetten kimondja: „Ha más igével írtál helyes mondatot, az nem hiba.” <br>– **s001, s003, s004:** F01. <br>Ez a korábban kért, nem ítélő fallback. |

## 4. Mondatonkénti tábla (csak az új vagy gyanús mondatok)

| ID | Jelenlegi szöveg | Megjegyzés | Valószínű francia / javaslat | Súly |
|---|---|---|---|---|
| s004 stimulus | *la boulangère a ajouté à la craie : « Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds ! »* | Krétatáblán a teljes, *nous*-os, segédigés mondat kissé formális. Gyakoribb a *Ce matin, on a fait…* vagy egy rövid felirat. A rövid felirat (*Nouveau : petits pains aux noix*) a mérés miatt nem jó, mert névelő nélküli. A *nous* az üzlet hangjaként elfogadható. | Lehetséges csiszolás: *Ce matin, on a fait ___ petits pains aux noix : encore tout chauds !* A kulcs (*des*) változatlan marad. | NOTE-1 |
| s005-E03 | *A « beaucoup » után mennyiségjelzőként « de » áll, nem névelő* | A *beaucoup* maga a mennyiségjelző, a *de* utána álló elöljáró. A megfogalmazás pontatlan, de nem félrevezető. | *A « beaucoup » mennyiségszó után « de » áll, nem névelő: « beaucoup de variétés ».* | NOTE-2 |
| i06-F05 | *Nous ne voulons pas en acheter vingt.* | Ez az én korábbi javaslatomból jön, ezért nem én ellenőrzöm. | másik ellenőr | – |

A többi új francia betétet helyesnek és természetesnek tartom:
- az F01–F06 kiváltó mondatai: *Nous n'allons pas en prendre*, *Nous n'en prendrons pas*, *Je vais vous en réserver deux*;
- az i03-E06 és az s004-E04 elízióról szóló szabálya;
- az i05-4 új mezőfelirata.

## 5. Szint három tengelyen (változás)

- **a) Téma:** változatlan, A2–B1 közötti hétköznapi helyzet. A reklamáció és a foglalás B1-es.
- **b) Nyelvi anyag:** változatlan, B1+ pontosító ismétlés.
- **c) Művelet:** a zárt készlet az i07-ben csökkenti a szabad előhívást. Ez a mérés egyértelműsége érdekében tudatos csere, a terv és az E-01 eszkaláció jóváhagyta. Az i06-ban a „csak a hibát javítsd” megfogalmazás nem csökkenti a szintet: a hibás mondatokat továbbra is a tanulónak kell megtalálnia.

A szint a célszinthez képest nem változott, és nem csúszott a célszint alá.

## 6. Műfajpróba (változás)

- **i06:** foglalási üzenet a pékségnek. Az F-feedbackek elismerik a műfajban természetes változatokat (*réserver*, *on n'en veut pas*), miközben a kért műveletre vezetnek vissza. Ez jó.
- **s004:** krétatábla, írott regiszter, a *des petits pains* mérése érvényes (NOTE-1).
- **i08:** az ellenőrzőlista az 5. pontban a segédigét is említi, ez egyezik a rubrika A5 pontjával. A « » jelölés miatt az *en* telefonon nem olvasható „én”-nek. Rendben van.

## 7. Findingtábla

| ID | Súly | Próba | Hely | Probléma | Javaslat |
|---|---|---|---|---|---|
| – | – | – | – | Nincs nyitott BLOCKER, MAJOR vagy MINOR. | – |

**NOTE-ok:**
- **NOTE-1** (mondat, s004): a krétatáblára írt mondat kissé formális; csiszolási javaslat a 4. pontban.
- **NOTE-2** (mondat, s005-E03): pontatlan metanyelvi megfogalmazás; javaslat a 4. pontban.
- **NOTE-3** (valóság, i08 C minta): a *tomates anciennes* évszakfüggő, ezért a korábbi JAVASLAT változatlanul áll.

## 8. Rendben lévő elemek

- **Kulcsok:** egyik sem változott, és a tanulói szövegből kulcs nélkül megoldva mind egyetlen jó választ ad. Saját megoldásom: i03 *d'* / *des*; s001–s005 *du / du / d' / des / de*; i06 *Je vais en prendre deux.* / *Nous ne voulons pas en acheter.*
- **A négykategóriás elfogadási rendszer:** az F-kategória a zárt instrukciójú itemekben nem bünteti a helyes nyelvet, a „helyes, de nem célzott” kategória pedig csak ott maradt, ahol az instrukció nem zárja ki az eltérő igét (i05, s006).
- **Új célzott sorok:** a készleten belüli hibás alakokra hihető tanulói tévedések épülnek (s001-E05, s003-E04, s004-E03/E04, s005-E03, i03-E06).
- **i06, *Je vais vous en prendre deux*:** jogos az elfogadása, mert a p06 tanítja.
- **Feltételes szabály:** most teljes körű.

## 9. Kérdések a tanárnak

1. *Sur une ardoise : « Ce matin, nous avons fait des petits pains aux noix » — naturel, ou plutôt « on a fait… » ?*
2. *« le Pain Perché propose ___ petits pains aux céréales » : « de » vous paraît-il acceptable ?* (változatlan)
3. *« Nous ne voulons pas en acheter » dans un message de réservation : naturel ?* (változatlan)

## 10. Forrásnapló

- Ebben a körben nem végeztem webes keresést, és oldalt sem nyitottam meg. A NOTE-1 a saját nyelvérzékemen alapul, ezért bizonytalan; ezért került a tanárnak feltett kérdések közé.
- Az OQLF-lapot (segitseg-1) korábban sem nyitottam meg, és most sem kérem újra.

## 11. Verdikt

**REVIEW_PASS** a megnevezett hatókörre: nincs nyitott BLOCKER, MAJOR vagy MINOR.

**Feltételek:**
- A *des petits pains* kulcs a 0.3 kaputól (OQLF) függ; ha a forrás nem igazolja, a feltételes szabály lép életbe.
- A C minta általam javasolt részeit és az i06-F05-öt másik ellenőr nézze meg.

---

**Változáslista:** a PE-M01, a PE-M03 és a PE-R01 FIXED. Új: NOTE-1 és NOTE-2 (nem findingok).

**Recheck-hatókör:** nincs kötelező PE-recheck. Ha a NOTE-1 alapján az s004 stimulusa változik, csak az s004-et kell újranézni.

**Következő címzett:** CEO.

**Tanulság:** ha egy zárt instrukció egy korábban nyitott helyet zár le, a nem célzott helyes válaszok a „nem a kért alak/művelet” kategóriába kerüljenek, nem ítélő feedbackkel, amely a kért műveletre vezet vissza. Így az elfogadási lista nem lehet hiányos, és a helyes nyelv sem minősül hibának. Ez minden eszkalációval lezárt, zárt válaszkészletű itemre vonatkozik.

PE_FINDINGEK
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 0
GEPI_OSSZEGZES_VEGE