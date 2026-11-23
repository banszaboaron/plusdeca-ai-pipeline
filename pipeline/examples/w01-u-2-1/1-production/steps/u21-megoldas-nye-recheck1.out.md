# NyE recheck: U21 (w01-u-2-1), Megoldás 2. változat

**Szerep és megbízás:** NyE, független ellenőr. Ez az U21 Megoldás fázisának javított változatára vonatkozó recheck.

**Bemenet:**
- a megoldásíró 2. változata (a BLOKK_JSON-t csak a megoldás szövegében leírt tartalom szerint néztem);
- a befagyasztott kézirat (1. javítási kör);
- a GR terve (2. javított változat);
- a PRESIDENT 2026-11-01-i folytatása;
- a saját korábbi jelentésem: NyE-01–NyE-08.

**Hatókör:** francia nyelvhelyesség, jelentés, kollokáció és regiszter. Ezt néztem a kulcsokban, az elfogadott, a „helyes, de nem célzott” és az elutasított alakokban, a feedbackben, az i08 rubrikájában, a C mintában és az R1/R2-ben. Ide tartoznak az E-01–E-05 javasolt francia szövegei és az elfogadott alternatívák teljessége is.

**Lefedett ID-k:**
- i01–i06;
- i07-s001–s006;
- i08 (rubrika, C minta, R1, R2, E01–E05);
- E-01–E-05;
- az 1. rész általános elfogadási szabályai.

**NEM VIZSGÁLT:**
- a BLOKK_JSON technikai leképezése (MO-F04);
- a tipográfia és a « » jelölés (HE);
- a magyar helyesírás;
- a kézirat A és B modellje: a kézirat befagyasztott, az előző körben nem volt rájuk finding.

## Saját próba a változott részeken (a feedback előtt)

- **i05-4 és s006, *…trois parts*:** helyes. Az *en* a *de flan*-t veszi át, a *trois parts* a mennyiség. Az N04 és az N01 helyesen kezeli.
- **i06 átfogalmazásai:** mind helyes francia. Ez a *Nous n'en voulons pas*, a *J'en prendrai deux*, a *Nous ne voulons pas acheter de chouquettes* és a *…en acheter vingt*. Az N01–N05 indoklása nyelvileg pontos.
- **Hiányzó helyes kitöltések az s003-ban és az s004-ben** (jelenlegi instrukció mellett): *quelques immenses tourtes*, *plusieurs immenses tourtes*, *quelques petits pains aux noix*, *plusieurs petits pains aux noix*. Ezek nincsenek a felsorolásban (lásd NyE-01).
- **Jobbra kihelyezés, amelyet a megoldás nem kezel:** *Je vais en prendre deux, des croissants.* (i05-2) és *Nous ne voulons pas en acheter, des chouquettes.* (i06). Mindkettő helyes beszélt nyelvi alak (lásd NyE-04).

## A korábbi findingok állapota

| ID | Állapot | Indok |
|---|---|---|
| NyE-01 | **PARTIALLY FIXED** | **Az E-01 szövege rendben:** *Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.* Az *un seul mot* és a *de la* ellentmondása megszűnt, a *questions* is eltűnt. A francia helyes és egyértelmű.<br>**Az N01 kategória jó megoldás.** Csakhogy az s003 és az s004 zárt számnévlistát ad (*deux… dix*, illetve *dix… trente*), és hiányzik belőle a *quelques* és a *plusieurs*. Így például a *quatre petits pains*, a *cent petits pains*, a *quelques immenses tourtes* és a *plusieurs petits pains aux noix* helyes válasz, mégis hibának minősül.<br>**Maradék súlya:** MINOR, amíg az E-01 bevezetése el van fogadva. Ha az E-01 nem kerül be, MAJOR, mert helyes választ büntet. |
| NyE-02 | **FIXED** | Az i03-E03 és az s004-E01 már nem állít jelentéskülönbséget. A szöveg pontos: a termékfajta neve összeforrt kifejezés, előtte a *des* marad. Az E-03 kéziratjavaslat a „kis méretű kenyér” állítást is elhagyja. A feltételes szabály a 0.3 kapura nyelvileg védhető. |
| NyE-03 | **FIXED** | Az új C mintában nincs nyelvi hiba. 7 mondat, és mindegyik *en* előzménye egyértelmű: *des cannelés* → *Camille en a pris quatre*; *des tomates* → *en prendre six*; *du basilic* → *prends-en un bouquet*. A kollokációk természetesek: *tomates anciennes*, *ne vont que chez lui*, *un bouquet de basilic*. A keretellentmondás megszűnt, a *des petits pains* ajánlásként áll. |
| NyE-04 | **PARTIALLY FIXED** | Az i05 1. és 3. mezőjét az N02 helyesen kezeli, az E03 és az E10 csak a vessző nélküli alakra szól. Kimaradt viszont két hasonló eset, amelyet az eredeti finding is kért:<br>– az i05 2. mezője: *Je vais en prendre deux, des croissants.* Most az E07 hibának mutatja.<br>– az i06 2. mondata: *Nous ne voulons pas en acheter, des chouquettes.* Most az E04 hibának mutatja.<br>Maradék: MINOR. |
| NyE-05 | **FIXED** | A *Nous vous en avons acheté trois* elfogadott, az *On vous en a acheté trois* N01-et kap. A *Nous en avions acheté trois* is helyes, és reklamációban természetes. |
| NyE-06 | **FIXED** | Az E14 helyesen szól: „rendszerint nem egyezik: « acheté »”. |
| NyE-07 | lezárva (NOTE) | A REJECTED_WITH_REASON elfogadható; változtatást nem kértem. |
| NyE-08 | **OPEN (NOTE)** | Az OQLF-lapot továbbra sem nyitottam meg. Már kérve van (segitseg-1), újra nem kérem. A nyelvi ítéletem nem változott: a *des petits pains* a termékjelentésben helyes, és gondozott szövegben ez a mérce. A forrásállítás nincs igazolva, a 0.3 kaput nem jelentem teljesültnek. |

## Új findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-09 | MINOR | 1. rész, „Teljes mondatos mező”, elfogadott bevezetők | A bevezetők listája általános szabályként áll, és nincs mezőhöz kötve. A „mért szerkezet érintetlen” feltétel csak a szerkezetet védi, a jelentést nem. Így jelentésben ellentmondó válaszok is elfogadottak lennének, például *Non, j'en prends.* (i05-1), *Volontiers, je n'en veux pas.* (i05-3), *Oui, volontiers, nous en avons acheté trois.* (i05-4) és *Non merci, je vais en prendre trois.* (s006). | Saját próba: az *Oui/Volontiers* elfogadást, a *Non/Non merci/Non, c'est bon* elutasítást jelent. A mezők táblája helyesen különbözteti meg őket, az általános szabály nem. | A bevezetők mezőhöz kötve:<br>– igenlő (*Oui, Volontiers, Oui, volontiers*): i05-1, i05-2, s006;<br>– tagadó (*Non, Non merci, Non, merci, Non, c'est bon*): i05-3;<br>– semmilyen bevezető: i05-4 és i06.<br>A záró *, merci* és *, s'il vous plaît* maradhat (az i05-4-ben a *s'il vous plaît* kerüljön ki). Az elfogadás csak a mezőtáblák listái szerint működjön. |
| NyE-10 | MINOR | E-04, javasolt s004-stimulus | A krétatábla-felirat (*Ce matin : ___ petits pains aux noix, encore tout chauds !*) távirati stílusú, és ez a műfaj jellemzően névelő nélkül áll: *Ce matin : petits pains aux noix encore tout chauds !*. A hiány így mesterséges: a legtermészetesebb „kitöltés” a semmi, és éppen a mért *des* lesz kevésbé természetes. | Saját nyelvi ítélet a francia kirakati és ardoise-feliratok megszokott névelőtlen szerkezetéről. Külső forrást nem nyitottam meg. | Írott, gondozott, mondatos szerkezet kell, ahol a determináns kötelező. Például: *Dimanche, 8 h 45. Sur l'ardoise, sous « Petits pains », une ligne ajoutée à la craie : « Nouveau ce matin : nous avons fait ___ petits pains aux noix, encore tout chauds ! »* Recheck: NyE és a független megoldó (a *quelques* és a számnév most is beférne, ezért az E-01-gyel együtt kell nézni). |
| NyE-11 | MINOR | E-02, javasolt i06-instrukció | A *Corrige seulement l'erreur dans chaque phrase* félrevezető: a piszkozatban hét mondat van, és csak kettő hibás. A „fausses” elhagyásával úgy olvasható, hogy minden mondatban van hiba. | Saját olvasat a TANULOI_NEZET i06-stimulusán. | *Dans les deux phrases fausses de ton brouillon, corrige seulement l'erreur et garde les autres mots. Écris les deux phrases corrigées.* |
| NyE-12 | NOTE | i08, R2, hibalista | A *des bons chèvres* informális üzenetben gyakori, nem valódi hiba; a p04 és a p09 előkészítője maga is mondja, hogy beszédben él. A *de bons* a 2. kritérium célalakja, de a *des bons* nem nyelvi hiba. | A kézirat p04-e és p09-e. | Az R2 indoklásában: „a *des bons* nem teljesíti a 2. kritériumot (gondozott alak: *de bons*)”, ne a hibák között álljon. |
| NyE-13 | NOTE | i05, 1. mező | A *Oui, j'en veux bien.* természetes válasz a *Ça vous tente ?* kérdésre, de igét cserél, tehát nem a kért transzformáció. A K3 szerint „nem teljes értékű, de nem hibás”. | Saját próba. | Felvehető a „helyes, de nem célzott” sorba (N03-hoz hasonló feedbackkel), ha a megoldásíró jónak látja. |

**Hibátlannak találtam (nincs finding):**
- i01 E01–E04 és a minták;
- i02 teljes egészében;
- i03 OK és E01–E05;
- i04 OK és E01–E05, az alternatívákkal együtt;
- i05 E01–E15 (a NyE-04 maradéka kivételével), N01, N03, N04;
- i06 N01–N05 és E01–E05 (a NyE-04 maradéka kivételével);
- s001 a *beaucoup de* és *un peu de* N01-gyel;
- s002 E01–E03;
- s005;
- s006 OK, E01–E04, N01, N02;
- i08 rubrika (A–D) és E01–E05;
- R1;
- E-03 és E-05 francia szövege.

## NOTE-ok más ellenőröknek

- **NavE / UE:** az E-01 zárt alaklistája (*du, de la, de, d', des*) kiveszi a *le*, a *les* és az *un* alakot. Így az s001-E02/E04 és az s003/s004 *les* distractor-feedbackje elérhetetlen vagy fölösleges lesz. Döntsék el, maradjon-e tartaléknak.
- **HE:** « » jelölés a feedbackben; nem törő szóközök (MO-F05).
- **CEO:** a NyE-01 maradéka az E-01 sorsától függ; ha az E-01-et elutasítják, a NyE-01 újra MAJOR.

## Változáslista

- A NyE-02, NyE-03, NyE-05 és NyE-06 FIXED.
- A NyE-01 és a NyE-04 PARTIALLY FIXED, MINOR maradékkal.
- A NyE-08 OPEN (NOTE).
- Új findingok: a NyE-09–NyE-11 MINOR, a NyE-12–NyE-13 NOTE.

**Bizonyíték:** csak saját nyelvi próba. Új webes forrást nem nyitottam meg. Az OQLF-kérés (segitseg-1) folyamatban van, újra nem kértem. Grevisse: NEM VIZSGÁLT.

**Recheck-hatókör:**
- NyE-01: az s003/s004 számnév- és kvantorkezelése, vagy az E-01 elfogadása;
- NyE-04: az i05-2 és az i06 vesszős alakja;
- NyE-09: a bevezetők mezőhöz kötése;
- NyE-10 és NyE-11: az E-04 és az E-02 szövege (a kéziratszerzőhöz).

**Következő címzett:** CEO.

**Tanulság:** ha egy nyílt hiány helyes, de nem célzott kitöltéseit felsorolással kezeljük, mindig marad hiány (más szám, *quelques*, *plusieurs*) → helyette osztályszabály kell (bármely számnév vagy mennyiségjelző), vagy a zárt instrukció → minden determinánshiányos zárt item.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 5
GEPI_OSSZEGZES_VEGE