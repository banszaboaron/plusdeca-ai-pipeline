# PE-recheck: U21 (w01-u-2-1), Megoldás, 2. változat

## 1. Hatókör és bemenet

**Szerep és megbízás:** szakmai ellenőr (PE), recheck. Azt néztem, hogy a kész itemek szakmailag érvényesek-e: a szöveg, a kérdés és a végleges opciók/kritériumok együtt adnak-e egyetlen jó választ, és mai, természetes-e a francia az opciókban és a feedbackben.

**Bemenet:** a Megoldás 2. változata (DRAFT_FOR_REVIEW), a befagyasztott kézirat (1. javítási kör), a GR 2. terve és a két korábbi PE-futásom (PE-M01…m06, PE-S01…S05).

**Megvizsgáltam:**
- i01–i06;
- i07-s001…s006;
- i08: a rubrika, a szintek, a C minta, az R1 és R2, az E01–E05;
- az általános elfogadási szabályokat;
- az ESCALATED táblát (E-01–E-05), csak abból a szempontból, hogy jogos-e a visszautalás;
- a TANULOI_NEZET-et.

**Nem vizsgáltam:**
- a BLOKK_JSON-t, mert nincs a bemenetemben, és a leképezés a CEO szkriptjéé;
- a tipográfiát (HE);
- a kézirat szövegét. Azt csak annyiban néztem, amennyiben a kulcs ráépül.

## 2. Valóságpróba (a változásokra szűkítve)

Előbb a saját tudásomból: vasárnap délelőtt egy barát a Croix-Rousse piacán keresztül jön brunchra, és azt kérdezi, kell-e még valami. A válasz egy rövid SMS: ezt már vettük, hozz ezt meg ezt, ennél a standnál vedd, mert ott jó.

Az új C minta ebbe a helyzetbe illik. A tavaszi-nyári *tomates anciennes* az évszaktól függ, de a hét dátuma nincs rögzítve, ezért ez csak NOTE.

A régi keretellentmondás („pas besoin de boulangerie”, utána pékségajánlás) megszűnt. A záró mondat most ajánlás a következő alkalomra, nem kérés.

## 3. Korábbi findingok állapota

| ID | Állapot | Indoklás |
|---|---|---|
| **PE-M01** (MAJOR) | **FIXED** (a megoldás hatókörében) | Az s001, s003 és s004 nem célzott, de helyes kitöltései (*beaucoup de / un peu de miel*, *nos*, számnév) N01 kategóriát kapnak: nem hiba, nincs pontlevonás. Az E-01 jogosan került a kéziratszerzőhöz. Az új megfogalmazás (*écris seulement la forme qui manque : du, de la, de, d' ou des*) jó, és megszünteti az *un seul mot* ↔ *de la* ellentmondást. A felsorolásból kimaradt változatokat a PE-R01 kezeli. |
| **PE-S01** (MAJOR) | **FIXED** | Ugyanaz, mint a PE-M01. |
| **PE-M02** (MAJOR) | **FIXED** | Az i06 N01–N05 sorai a helyes átfogalmazásokat nem büntetik, a *…acheter de chouquettes* is kezelve van. Az E-02 jogosan került a kéziratszerzőhöz. A maradékot a PE-R01 kezeli. |
| **PE-M03** (MAJOR) | **PARTIALLY FIXED**, a maradék MINOR | Javítva: az I03-E03 és az s004-E01 már nem állít jelentéskülönbséget, és van feltételes szabály a 0.3 kapura. Új bizonyíték (keresési kivonat, NEM MEGNYITOTT): az OQLF szabálya szerint a *des* megmarad, ha a melléknév és a főnév *nom composé*-t alkot (*des grands-pères, des petits pois, des beaux-parents*). A *petit pain* szótári egység, és az állandósult *se vendre comme des petits pains* is a *des*-t mutatja. A kulcs így valószínűleg megáll, a két jó válasz kockázata csökkent. **Nyitott:** a feltételes szabály csak az i03-ra és az s004-re vonatkozik, az i08 „Nem elegendő” sorára (*de petits pains a termék jelentésében*) és a rubrika A(3) pontjára nem. |
| **PE-M04** (MAJOR) | **FIXED**, a recheck másik ellenőrre tartozik | Az új C mintában egyértelmű az *en* előzménye (*des cannelés → Camille en a pris quatre*; *des tomates → en prendre six*; *du basilic → prends-en*). Nincs benne kenyérkérés, a lefedés teljes, 7 mondat. A *Camille en a pris quatre, elle est fan* és a záró mondat iránya az én javaslatomból jön, ezért azok természetességét **másik ellenőr** (NyE vagy PE-2) nézze meg. A többi mondatot (*Va au stand du maraîcher bio…*, *beaucoup des habitués du marché ne vont que chez lui, parce qu'il cueille tout la veille*) természetesnek tartom. |
| **PE-S04** (MINOR) | **FIXED** | Ugyanaz, mint a PE-M04, ugyanazzal a recheck-kikötéssel. |
| **PE-m05** (MINOR) | **FIXED** | A szintek sorrendben, teljes lefedéssel működnek: a „Részleges” szint mint maradéksor minden esetet besorol. Az R1 újraszámolva: A = 4, C = 0, tehát „Nem teljesített”. Egyetértek. |
| **PE-S05** (MINOR) | **FIXED** | (1) A szintek közötti rés megszűnt, ld. PE-m05. (2) A C sáv és az E05 most a tanuló saját üzenetéhez méri az ellentmondást, a *des petits pains* ajánlásként vagy indokolt kérésként is állhat. |
| **PE-m06** (MINOR) | **FIXED** | Az I04-E02 bővítése jó. A kulcs marad, ez helyes. |
| **PE-S02** (MINOR) | **FIXED** | A feedback normára hivatkozik („összeforrt kifejezés → *des*”), nem állít jelentéskülönbséget. |
| **PE-S03** (MINOR) | **FIXED** | Elfogadott a következő szóval együtt beírt alak, és bekerült a *Volontiers,* és a *Oui, volontiers,*. |

## 4. Mondatonkénti tábla (új vagy maradék gyanú)

| ID | Jelenlegi kezelés | Probléma | Valószínű francia / javaslat | Súly |
|---|---|---|---|---|
| i05-1 | *Oui, j'en veux bien.* nincs a listában | A *Ça vous tente ?* kérdésre ez az egyik legtermészetesebb igenlés. Az igét lecseréli, ezért most általános hibát kap. | Legyen „helyes, de nem célzott”: „Helyes; a feladat a *prendre*-t adta: « j'en prends »”. | MINOR (PE-R01) |
| i06 | *On n'en veut pas.* · *On n'en prendra pas.* · *Nous ne voulons pas en prendre.* nincs a listában | Foglalási üzenetben ezek a természetes visszautasítások. Most általános hibát kapnak. | Kerüljenek az N01, illetve az N03 alá. | MINOR (PE-R01) |
| s003, s004 | *quelques / plusieurs* nincs a listában | *nous cuisons quelques immenses tourtes*, *on a fait quelques petits pains aux noix*: helyes, gyakori mondatok. | N01 | MINOR (PE-R01) |
| s001 | *plein de miel* nincs a listában | Élőszóban, Camille-nak válaszolva természetes. | N01 | MINOR (PE-R01) |
| i06-N05 | *…en acheter vingt* | A szöveg az én korábbi javaslatom, ezért nem én ellenőrzöm. | Másik ellenőr nézze. | NOTE |
| i05-E04 | *Je le prends.* | A „maradék” rozskenyérre vonatkoztatva határesetként védhető (az egész darabot viszi). A feedback mégis elfogadható, mert a feladat a mennyiséget kéri helyettesíteni. | – | NOTE |

A feedback új francia betétei helyesek és természetesek: *de + le = du*, *en prendre deux*, *nous en avions acheté trois*, *nous vous en avons acheté trois*, *je n'en veux pas, de sucre* vesszővel.

## 5. Szint és műfaj (a változásokra)

- **Szint:** nem változott, B1+ a mag, B2-közeli a művelet. A „helyes, de nem célzott” kategória már nem bünteti az idiomatikusabb tanulói változatokat, ez a szintet védi.
- **Műfaj:** az i06 N-sorai illenek a foglalási üzenet műfajához. Az i08 C mintája valódi baráti SMS, nem pipáló lista.

## 6. Findingtábla (nyitott)

| ID | Súly | Próba | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|---|
| **PE-M03** (maradék) | MINOR | kollokáció | i08 rubrika: A(3) és „Nem elegendő”; p04 E-03 | A 0.3 kapura szóló feltételes szabály csak az i03-at és az s004-et említi. Ha az OQLF-lap nem igazolja a *petits pains*-t, az i08 rubrikája továbbra is büntetné a *de petits pains*-t. | A Megoldás i03 „Feltételes szabály” része és az i08 „Nem elegendő” listája | A feltételes szabályt terjeszteni ki az i08 A(3) pontjára és a „Nem elegendő” sorra (és a p04 E-03-ra). | NyE, a 0.3 válasza után |
| **PE-R01** (új) | MINOR | tétel (4.) | i05-1; i06; i07-s001, s003, s004 | A „helyes, de nem célzott” kategória felsorolásos. Több gyakori, helyes változat kimaradt (*Oui, j'en veux bien*; *On n'en veut pas*; *On n'en prendra pas*; *Nous ne voulons pas en prendre*; *quelques/plusieurs*; *plein de miel*), ezek most általános hibát kapnak. | A 4. pont táblája | Fel kell venni őket, és kell egy maradékszabály: ha egy válasz a listán nem szerepel, de a független ellenőrzés szerint helyes és jelentéstartó, akkor N kategória, ne általános hiba. Az E-01 és az E-02 bevezetése után a lista szűkülhet. | NavE, független megoldó |

**JAVASLAT:** az i08 C mintájában a *tomates anciennes* helyett évszakfüggetlen tétel is állhatna (pl. *de beaux avocats* vagy *de belles clémentines*), ha a hét dátuma őszre vagy télre esik. Ez a mostani minta érvényességét nem érinti.

## 7. Ami rendben van

- **Kulcsok:** egyik sem változott, mind helyes.
- **i05:** a *…trois parts* most helyesen nem hiba (N04), az E13 pontos.
- **i02, i04 (E05), s002, s005, s006:** egyetlen jó válasz, pontos feedback.
- **Szintrendszer:** teljes lefedés, az R1 pontszáma javítva.
- **ESCALATED tábla:** az E-01–E-05 mind jogosan kéziratszintű. Az E-01 új megfogalmazása jobb.

## 8. Kérdések a tanárnak

1. *Dans un guide : « propose ___ petits pains aux céréales » — « de » vous paraît-il acceptable, ou seulement « des » ?*
2. *« Ça vous tente ? » — « Oui, j'en veux bien » ou « J'en prends » : lequel est le plus naturel au comptoir ?*

## 9. Forrásnapló

- **WebSearch:** `"des petits pains" adjectif antéposé nom composé "des petits pois" grammaire`. Az [OQLF – Des devant un adjectif antéposé](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose) kivonata: a *nom composé* előtt a *des* megmarad (*des grands-pères, des petits pois, des beaux-parents*). Csak a kivonatot láttam, NEM MEGNYITOTT.
- **WebSearch:** `vitrinelinguistique "Des devant un adjectif antéposé" petits pains`. Az OQLF kivonata megerősíti a *de* általános szabályát az írásban és a gondozott beszédben. A [lalanguefrancaise – petit pain](https://www.lalanguefrancaise.com/dictionnaire/definition/petit-pain) címszóként, az [expressio – se vendre comme des petits pains](https://www.expressio.fr/expressions/se-vendre-comme-des-petits-pains) állandósult *des*-sel jelenik meg a találatok között. NEM MEGNYITOTT.
- **OQLF-lap:** a segitseg-1 folyamatban van, újra nem kérem.

## 10. Verdikt

**REVIEW_PASS** a megnevezett hatókörre. Nincs nyitott BLOCKER vagy MAJOR, két MINOR maradt (PE-M03 maradéka, PE-R01). A PASS feltételei:
- a C minta azon részeit, amelyek az én javaslatomból jönnek, **másik ellenőr** nézze meg (NyE vagy PE-2), ahogy az i06-N05-öt is;
- a 0.3 kapu (OQLF) nyitott, de a feltételes szabály kezeli. A PE-M03 maradéka annak kiterjesztése.

**Változáslista:** recheck. 9 finding FIXED, a PE-M03 PARTIALLY FIXED (MAJOR → MINOR maradék), 1 új MINOR (PE-R01).

**Következő címzett:** CEO.

**Tanulság:** a nem büntető kategória felsorolással kiválthatja egy nyitott instrukció hibáját. Ehhez kell egy maradékszabály (független ellenőrzéssel igazolt helyes válasz → nem hiba), mert különben a listából kimaradt helyes változat továbbra is hibát kap. Ez minden ideiglenes, kéziratjavításra váró zárt itemre érvényes.

PE_FINDINGEK
PE-M03 | MINOR | kollokacio | w01-u-2-1-i08 rubrika A(3) és „Nem elegendő”; p04 E-03 | A 0.3 kapura szóló feltételes szabály nem terjed ki az i08 rubrikájára, így OQLF-cáfolat esetén a de petits pains továbbra is büntetett.
PE-R01 | MINOR | tetel | w01-u-2-1-i05 1. mező; w01-u-2-1-i06; w01-u-2-1-i07-s001, s003, s004 | A „helyes, de nem célzott” lista felsorolásos, és gyakori helyes változatok kimaradtak (Oui, j'en veux bien; On n'en veut pas; On n'en prendra pas; Nous ne voulons pas en prendre; quelques/plusieurs; plein de miel); maradékszabály kell.
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 2
GEPI_OSSZEGZES_VEGE