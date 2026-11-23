# PE-recheck: U21 (w01-u-2-1), Megoldás, 4. változat

## 1. Hatókör és bemenet

**Szerep:** szakmai ellenőr (PE), recheck. A korábbi findingok ID-je megmaradt.

**Bemenet:**
- a Megoldás 4. változata (DRAFT_FOR_REVIEW);
- a befagyasztott kézirat, benne az E-01–E-08 javításokkal;
- a GR 2. javított terve;
- a két korábbi PE-futás jelentése és az egyesített nyitott lista;
- a PRESIDENT 2026-11-01-i folytatása (0.1 kapu).

**Megvizsgáltam:**
- i01–i06, i07-s001…s006, i08 (rubrika, szintek, „Nem elegendő”, C minta, R1, R2, E01–E05);
- az 1. részt: az elfogadási szabályokat, a négy válaszkategóriát, a feltételes szabályt és az újrapróbálást;
- az új F-kategória feedbackjeit;
- a TANULOI_NEZET-et.

**Nem vizsgáltam:**
- a BLOKK_JSON-t, mert nincs a bemenetemben (MO-F04, CEO-szkript);
- a tipográfiát, a nem törő szóközöket (HE);
- a kézirat befagyasztott szövegét. Azt csak ott néztem, ahol a kulcs vagy a feedback ráépül.

**Saját javaslatok:** a C minta *Camille en a pris quatre, elle est fan* félmondata és az i06 *…en acheter vingt* sora (most F05) egy korábbi PE-javaslatból származik. Nem tudom megállapítani, hogy ez a futás javasolta-e őket. Ezért a természetességükről nem mondok záró ítéletet, ezt a NyE vagy egy másik ellenőr nézze meg, ahogy a korábbi jelentések kérték.

## 2. Valóságpróba (a változásokra szűkítve)

A saját leírásom a helyzetről:
- **i06:** szombat este Instagram-üzenetben foglalás egy lyoni pékségnél. A vásárló megmondja, mennyit kér, a kínálat többi részét pedig udvariasan elhárítja.
- **s004:** a tábla mellé krétával írt rövid bejelentés a napi újdonságról.
- **i05-4:** reklamáció a pultnál, a dobozzal a kézben.

A kéziratban mindhárom helyzet valós és hiteles. Az új F-kategória egyik item helyzetét sem változtatja meg, csak az elfogadási adatot.

## 3. Korábbi findingok állapota

| ID | Előző súly | Állapot | Indoklás |
|---|---|---|---|
| **PE-M01** (s001, s004: *plein de / pas mal de / quelques*) | MINOR | **FIXED** | Az E-01 bekerült a kéziratba: az i07 instrukciója zárt, látható alakkészletet ad (*du, de la, de, d', des*). A mennyiségszavak az s001-ben, az s003-ban és az s004-ben F01-et kapnak. Ez a kategória nem minősíti hibásnak a választ („franciául helyes lehet”), és a kért műveletre irányít. Így nincs ellentmondás az instrukció és az elfogadási adat között. |
| **PE-M03** (a feltételes szabály nem terjed ki az i08-ra; a p04 kontrasztsora) | MINOR | **FIXED** | (1) A feltételes szabály most egyszerre érinti az i03 2. helyét, az s004-et, az i08 „Nem elegendő” sorát, és visszaküldi a GR-hez a p04 kontrasztsorát és a lexikalizált *des* mérését. Ezzel az A(3) rubrikapont is lefedett. (2) Az E-03 bekerült a kéziratba: a p04 kontrasztsora már nem állítja, hogy a *de petits pains* „kis méretű kenyereket” jelent. A feedback és a tanulói szöveg nem mond ellent egymásnak. A 0.3 kapu nyitott, de ez bizonyítékhiány, nem finding (MO-F03). |
| **PE-R01** (a fel nem sorolt helyes válasz ítélő feedbacket kap) | MINOR | **FIXED** | **i05 és s006:** a semleges `incorrect` szöveg kimondja: „Ha más igével írtál helyes mondatot, az nem hiba…”. A *J'en veux bien* bekerült az N05 alá. **i03, i06, s001–s005:** az instrukció mostantól zárt, ezért a fel nem sorolt átfogalmazás valóban nem a kért művelet. Az `incorrect` szövegek az instrukcióra hivatkoznak, nem a nyelvre. **i06:** az *On n'en veut pas* és a *Nous ne voulons pas en prendre* bekerült az F01 alá. A maradék csak pontosítás (JAVASLAT-1). |

## 4. Mondatonkénti tábla (új vagy gyanús feedback- és opciószövegek)

| ID | Jelenlegi szöveg | Megjegyzés | Javaslat | Súly |
|---|---|---|---|---|
| U21-I06-F05 | *…így csak a húszas zacskót utasítod el…* | A chouquette csak húszas zacskóban kapható, ezért a *…en acheter vingt* gyakorlatilag ugyanazt utasítja el, mint a kulcs. A feedback indoka („csak a húszas zacskót”) pontatlan. A valódi indok, hogy új szó került a mondatba, és ezt a feedback ki is mondja. | Az első tagmondat helyett: „Helyes mondat, de új szót tettél bele, az instrukció pedig a többi szó megtartását kéri: « nous ne voulons pas en acheter ».” | NOTE |
| U21-I06 `incorrect` | *Ellenőrizd az « en » helyét…* | A *J'en veux deux* vagy az *On n'en prendra pas* ezt kapja, pedig ezekben az *en* jó helyen áll. A záró mondat (a többi szó megtartása) helyre teszi, de a nyitó mondat félrevezet. | Az F01-be kerüljön az *On n'en prendra pas*, az F02-be a *J'en veux deux* (JAVASLAT-1). | NOTE |
| s001–s005 F01 | *Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet…* | Pontos, nem ítél, a műveletre visz. | – | rendben |
| U21-I03-F01 | *Mi áll mennyiségjelző és birtokos nélkül…* | Jó irányító kérdés. | – | rendben |
| U21-I06-F01…F04, F06 | – | A francia betétek helyesek. Az F06 („foglalásnál természetes is”) pontos pragmatikai megjegyzés. | – | rendben |
| s004 OK, E01–E04 | *…a táblára írt mondatban is « des » marad* | Illeszkedik az új, írott, igés stimulushoz. | – | rendben |
| s005 E03 | *A « beaucoup » után mennyiségjelzőként « de » áll, nem névelő* | Helyes. | – | rendben |

## 5. Egyetlen jó válasz (saját megoldás kulcs nélkül, a módosított itemeken)

| Item | Saját megoldásom | Kulcs | Egyetlen jó válasz? |
|---|---|---|---|
| i03 | *d'* · *des* | ugyanaz | Igen, a 0.3 feltétellel a 2. helyen. |
| i06 | *Je vais en prendre deux.* · *Nous ne voulons pas en acheter.* | ugyanaz | Igen. Az instrukció most kizárja az átfogalmazást. A *Je vais vous en prendre deux* indokolt alternatíva. |
| s001 | *du* | *du* | Igen. A készletből a *de*, a *de la* és a *des* hibás. |
| s002 | *du* | *du* | Igen. A *de métro* elutasítása a tanári kérdésen múlik. |
| s003 | *d'* | *d'* | Igen, gondozott regiszterben. |
| s004 | *des* | *des* | Igen, a 0.3 feltétellel. |
| s005 | *de* | *de* | Igen. |
| i05-4 | *Nous en avons acheté trois.* | ugyanaz | Igen. Az *avions* változat elfogadott, és természetes is. |

## 6. Szint és műfaj

- **Szint:** nem változott. A mag B1+, a műveletek (helyesbítés, reklamáció, indokolt választás) B2-közeliek. A zárt alakkészlet csökkenti a nyitottságot, de csak az i07 s001–s005-ben, ahol vegyes előhívásról van szó, és ez rendben van.
- **Műfaj:**
  - Az F-kategória hangneme illik a formatív gyakorláshoz: elismeri a helyes franciát, és az instrukcióra irányít.
  - A C minta nem változott. A *tomates anciennes* évszakfüggése továbbra is NOTE.

## 7. Findingtábla

Nincs nyitott finding: nincs BLOCKER, MAJOR vagy MINOR.

**JAVASLAT-1:** érintett elem: i06, F01, F02 és `incorrect`.
- **Jelenlegi gyengeség:** az *On n'en prendra pas* és a *J'en veux deux* a semleges `incorrect` szöveget kapja, amely elsőként az *en* helyét kéri ellenőrizni. Ezekben az *en* jó helyen áll.
- **Alternatíva:** az *On n'en prendra pas* kerüljön az F01, a *J'en veux deux* az F02 alá.
- **Miért jobb:** pontosabb, célzott visszajelzést ad.
- **Érintett további részek:** nincs.

**JAVASLAT-2:** az U21-I06-F05 indoklása, lásd a 4. pontot.

**NOTE-ok:**
- A C mintában a *tomates anciennes* évszakfüggő.
- Az i06 kulcsa (*Nous ne voulons pas en acheter*) foglalási üzenetben kissé nyers. Ez a befagyasztott kézirat kérdése, a tanári kérdések között szerepel.
- A saját javaslatból eredő szövegek (C minta, első két mondat; i06-F05) másik ellenőrhöz tartoznak.

## 8. Ami rendben van

- **Kulcsok:** mind változatlanok és helyesek.
- **Kategóriák:** a négy válaszkategória most következetes. A „helyes, de nem célzott” kategória csak az i05-ben és az s006-ban van, ahol az instrukció nem zárja ki az eltérő igét. A „nem a kért alak vagy művelet” kategória ott van, ahol az instrukció zárt.
- **Új célzott sorok:** a készleten belüli hibás alakokra (s001-E05, s003-E04, s004-E03/E04, s005-E03, i03-E06) pontosak és hihetőek.
- **Feltételes szabály:** a 0.3 kapura most teljes, három ponton hat.
- **i08:** az 5. ellenőrzőkérdés egyezik a rubrika A5 pontjával. A szintrendszer sorrendben, teljes lefedéssel működik.

## 9. Kérdések a tanárnak

1. *« Le Pain Perché propose ___ petits pains aux céréales » (guide) : « de » vous paraît-il acceptable, ou seulement « des » ?*
2. *Dans un message de réservation : « Nous ne voulons pas en acheter » est-il naturel, ou plutôt « on n'en prendra pas, merci » ?*
3. *« à la sortie ___ métro Croix-Rousse » : « de métro » est-il acceptable ?*

## 10. Forrásnapló

Ebben a körben nem végeztem webes keresést. A vizsgált változások feedback- és kategóriaszövegek voltak, ezekhez nem kellett külső kollokációs forrás. Az OQLF-lap (segitseg-1) folyamatban van, NEM MEGNYITOTT, újra nem kérem.

## 11. Verdikt

**REVIEW_PASS** a megnevezett hatókörre (U21 Megoldás, 4. változat: a kész itemek szakmai érvényessége, az egyetlen jó válasz, és a francia nyelv a feedbackben).

A PASS feltételei:
- A 0.3 kapu nyitott, ezt a feltételes szabály kezeli (MO-F03, NyE).
- A saját javaslatból eredő szövegeket másik ellenőr nézze meg.

---

**Változáslista:** PE-M01, PE-M03 és PE-R01: FIXED. Új finding nincs. Két JAVASLAT és három NOTE.

**Recheck-hatókör:** csak akkor kell recheck, ha átveszik a JAVASLAT-1 vagy a JAVASLAT-2 javaslatot (i06, F-sorok), vagy megjön a 0.3 válasza (i03, s004, i08, p04).

**Bizonyíték:**
- **Új:** a saját, kulcs nélküli megoldásom az i03, i05-4, i06 és s001–s005 itemekre.
- **Újrahasznosított:** a korábbi PE-futások keresési kivonatai (NEM MEGNYITOTT státuszban).

**Következő címzett:** CEO.

PE_FINDINGEK
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 0
GEPI_OSSZEGZES_VEGE