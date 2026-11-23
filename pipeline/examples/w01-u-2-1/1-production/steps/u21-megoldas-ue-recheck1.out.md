# UE-recheck: U21 (w01-u-2-1), Megoldás fázis, 2. változat

**Szerep:** UE, a tanulói végigjárás ellenőre, recheck.

**Bemenet:**
- a megoldásíró 2. változata (kulcs, kategóriák, feedback, rubrika, TANULOI_NEZET, E-01–E-05);
- a befagyasztott kézirat (1. javítási kör);
- a GR terve (2. javított változat);
- a saját előző jelentésem (UE-01–UE-05).

**Hatókör:**
- az i01–i08 itemek megoldhatósága tanulóként;
- egyértelmű, de nem triviális-e a választás;
- segít-e a feedback az újrapróbálásban;
- az UE-01–UE-05 státusza és az érintett kapcsolatok.

**Nem vizsgáltam:**
- az általános nyelvhelyességet (NyE);
- a tipográfiát és a nem törő szóközöket (HE);
- a P5-leképezést és a sémát (MO-F04);
- az OQLF-forrást (0.3, segitseg-1, kérve);
- a PE-03 PRESIDENT-döntést;
- az időkeret metaadatát (ESCALATED a CEO-nak).

**Függetlenség:** több átvett javítás az én korábbi javaslatomból származik. Ezek:
- az E-01 instrukciószövege;
- az E-02 instrukciószövege;
- az E-04 stimulusa;
- az i08 rubrikájának szintrendszere;
- a „nem teljes értékű, de nem hibás” kategória elve.

Ezeket a szabály szerint nem én ellenőrzöm. A CEO adja őket másik ellenőrnek: az E-01-et és az E-02-t a NavE-nek és a független megoldónak, az E-04-et a független megoldónak és a NyE-nek, a rubrikát a PE-nek. Lent csak azt minősítem, hogy a tanuló számára megszűnt-e az eredeti probléma.

---

## Végigjárás: csak a változott itemek

Mindegyik itemet újra megoldottam kulcs nélkül, utána néztem meg a kulcsot.

| Item | Saját megoldásom és kipróbált változataim | Eredmény |
|---|---|---|
| i01 | *1 = valamennyi kenyér; 2 = hely* | E04: „írd mellé a szerkezetet”. Jól segít, nem büntet. |
| i03 | *d'* ; *des*. Alternatívaként: *ses excellents croissants… ses petits pains…* | A *ses* helyes francia (a Pain Perché kínálja a saját termékeit), de a megoldás nem kezeli → **UE-06** |
| i04 | *beaucoup de* ; *beaucoup des*. Próba: csak *de* / *des* | E05 pontos. Az E02 új mondata zavaró → NOTE |
| i05 | a kulcsmondatok. Próba: *Non, c'est bon, je n'en veux pas.* ; *Nous en avons acheté trois parts.* | Elfogadva, illetve N04. Jó. |
| i06 | Próba: *Nous n'en voulons pas.* ; *J'en prendrai deux.* | N01 és N02: nem büntet, és megmutatja a célt. Jó. |
| i07-s001 | Próba: *beaucoup de* (N01) és *plein de* | A *plein de miel* a *Il adore le sucré* után nagyon természetes, mégis a lista végén kiesik, és hibának minősül → **UE-01 maradék** |
| i07-s003 | Próba: *nos* (N01) és *quelques* | A *quelques immenses tourtes* nincs a listán, ezért hibának minősül → **UE-01 maradék** |
| i07-s004 | Próba: *vingt* (N01), *quelques* és *douze* | A *quelques* nincs a listán. A számnév zárt felsorolás: a *six* vagy a *cinquante* hibának minősül → **UE-01 maradék** |
| i07-s006 | Próba: *J'en prends trois.* | N02. Jó. |
| i08 | 7 mondatos vázlat a TANULOI_NEZET ellenőrzőkérdései alapján | A *Van-e en ragozott ige előtt?* telefonon „én”-nek olvasható → **UE-04 maradék** |

---

## A korábbi findingok státusza

| ID | Súly | Státusz | Indok |
|---|---|---|---|
| UE-01 | MAJOR | **PARTIALLY FIXED, nyitott** | Az ideiglenes „helyes, de nem célzott” kategória működik, és az E-01 szövegéből eltűnt az ellentmondás. Az N01 viszont zárt felsorolás, ezért ugyanabba az osztályba tartozó helyes válaszok továbbra is hibának minősülnek: *plein de*, *trop de* (s001); *quelques*, *plusieurs*, *ces* (s003, s004); a listán kívüli számnév (*six*, *cinquante*; s004). A TANULOI_NEZET-ben továbbra is ez az instrukció áll: *Réponds aux six questions.* |
| UE-02 | MINOR | **FIXED** (ideiglenesen) | Az i06 N01–N05 nem büntet, és a feedback megmutatja, hogyan kell csak a hibás elemet javítani. A végleges megoldás az E-02, ezt másik ellenőr nézi. Maradék: NOTE (lent). |
| UE-03 | MINOR | **PARTIALLY FIXED, nyitott** | Az i03-ra adott REJECTED_WITH_REASON-t elfogadom. Az 1. hely valódi döntés, a lexikalizációt az s004 és az i08 alkalmazásban méri. Az s004 stimulusa viszont addig marad élőbeszéd (*La boulangère : « … on a fait ___ … »*), amíg az E-04 nem kerül be. Addig a *des* a szabály megértése nélkül, a regiszterből is kijön. Nem blokkol. |
| UE-04 | MINOR | **PARTIALLY FIXED, nyitott** | A feedbackben a francia alakok következetesen « » közé kerültek, ez rendben van. A tanuló által látott i08 ellenőrzőlistában viszont jelöletlenek. Bizonyíték a TANULOI_NEZET-ből: *„5. Van-e en ragozott ige előtt?”*, *„1. Van-e egy du, amely…”*. Az *en* itt „én”-ként olvasható, és ez a beadás előtti önellenőrzés kulcskérdése. A kézirat tanulói szövegének lehántott jelölése (MO-F04) ugyanide tartozik. |
| UE-05 | MINOR | **FIXED** (szerzői állítás, a PE erősítse meg) | Tanulói szemmel átnéztem: a sorrendi szintek minden pontkombinációt lefednek, a D a Kiváló szint feltétele, a C a Teljesítetté. Mivel a szint elve az én javaslatomra épül, a lezáráshoz a PE független rechecke kell. |

## Új findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| UE-01 (maradék) | MAJOR | i07-s001, s003, s004; az N01 kiváltó listái | Felsorolással nem lehet lezárni egy nyitott determinánshelyet. A listán kívüli, helyes mennyiségjelző vagy determináns hibának minősül, és a tanuló hibaüzenetet kap helyes válaszra. | s001: *Il adore le sucré : je mets plein de miel.* s003: *nous cuisons quelques immenses tourtes de seigle.* s004: *on a fait quelques / six petits pains aux noix.* Egyik sincs az `alternatives` listán. | Az N01 legyen kategóriaszabály: „minden nyelvtanilag és a helyzetben helyes, nem célzott determináns vagy mennyiségjelző (birtokos, mutató, *quelques*, *plusieurs*, bármely számnév `numbersFr` szerint, *beaucoup / un peu / plein / trop de*) → N01”. Ahol a gépi kiértékelés nem tud kategóriát kezelni, a felismeretlen válasz ne „incorrect” legyen, hanem semleges ellenőrzés: „Ez helyes lehet; a feladat a *du / de / d' / des* döntést gyakoroltatja…”. Az UE-01 az E-01 bevezetésével is lezárul. | másik ellenőr (független megoldó, NavE) |
| UE-06 | MINOR | i03, mindkét hely | Az i03-nak nincs „nem célzott” kategóriája, és az instrukció (*Complète avec la bonne forme.*) nem rögzíti a választható alakokat. Ez ugyanaz a hibaosztály, mint az UE-01, csak kisebb valószínűséggel. | *le Pain Perché propose ses excellents croissants au beurre et, dès 7 heures, ses petits pains aux céréales* helyes, de egyik ID sem kezeli, ezért általános hibát kap. | A *ses*, a mutató névmás és a számnév kerüljön N01-be ugyanazzal a szöveggel, mint az s003-ban. Vagy a kézirat instrukciója legyen: *Complète avec de, d' ou des.* (ehhez blokkíró kell, ESCALATED). | független megoldó |

**NOTE-ok (nem kötelező javítások):**
- **i04-E02:** Az új mondat (*Élőszóban néha « beaucoup de » is elhangzik…*) gyengíti a feedbacket, mert a stimulus maga is élőbeszéd (Camille mondja). A tanuló joggal kérdezheti, miért hiba, amit élőszóban mondanak. Javaslat: a mondat maradjon el, vagy hangozzon így: „élőszóban is: megnevezett csoport része → « beaucoup des »”. A NyE erősítse meg, hogy az állítás egyáltalán igaz-e.
- **i05:** A terv K3 pontja („az eltérő igéjű helyes válasz nem teljes értékű, de nem hibás”) nincs általános szabályként rögzítve. Ilyen válasz például a *Oui, j'en veux bien.* és a *Non, je n'en prends pas.*. Mivel az instrukció kiinduló mondatot ad, a kockázat alacsony.
- **i06:** Az *On n'en veut pas.* és a *Je vais en réserver deux.* (foglalási helyzetben természetes) nincs kezelve. Ezek az N01 és az N02 szövegével kezelhetők.
- **i08:** A rubrika az 5. kritériumhoz a segédigét is elfogadja, az ellenőrzőkérdés viszont csak ennyi: „ragozott ige előtt (pl. *Paul en boit*)”. Elég lenne a kérdés mellé egy második mikropélda: *… ou avant l'auxiliaire*.
- **Idő:** A becslésem (kb. 43–54 perc, becslés, nem mérés) nem változott. A CEO és a GR ESCALATED pontja helyes.

---

## Összegzés és átadás

**Mi működik:**
- A háromkategóriás rendszer (kulcs / elfogadott / helyes, de nem célzott) tanulói szempontból jó. Nem büntet, megmutatja a célt, és önkéntes újrapróbálást ad.
- Az i06 N01–N05, az i05 N02–N04, az s006 N01–N02 és az i01-E04 kifejezetten segít.
- A második hibás válasz utáni indoklás és az újrapróbálási párok érthetők.
- A C minta *en*-előzményei egyértelműek.

**Nyitott MAJOR:** UE-01 (maradék). A felsorolásos N01 nem zárja le a nyitott determinánshelyet. Egy kategóriaszabály vagy az E-01 bevezetése lezárja.

**Nyitott MINOR:**
- UE-03: az s004 az E-04-től függ, nem blokkol;
- UE-04: az i08 ellenőrzőlistájának jelölése, a CEO-szkript és a HE dolga;
- UE-06: az i03.

**Hova megy:**
- **Megoldásíró:** az UE-01 kategóriaszabálya, az UE-06 és a NOTE-ok.
- **Blokkíró a CEO-n keresztül:** az E-01, az E-02 és az E-04 (kéziratszint). Az UE-06 alternatívája az i03 instrukciója.
- **CEO, HE:** az UE-04 (MO-F04).
- **Másik ellenőr:** az E-01, az E-02, az E-04 és a rubrika szintjei, mert ezek az én javaslatomra épülnek.

**Bizonyíték:** csak a csatolt anyag és a saját tanulói megoldásaim. Webes forrást nem nyitottam meg, segítséget nem kérek.

**Recheck-hatókör:**
- az s001, az s003, az s004 és az i03 elfogadási szabálya;
- az i04-E02 szövege;
- az i08 ellenőrzőlistájának megjelenítése;
- az E-04 bevezetése után az s004.

**Tanulság:** a helyes, de nem célzott válaszokat felsorolással kezeltük → ez kiszivárog (*plein de*, *quelques*, listán kívüli számnév) → a nyitott helyeket kategóriaszabállyal kell lefedni, a felismeretlen választ pedig semleges, nem „incorrect” jelzéssel → minden nyitott kitöltésű item, amíg az instrukció nem zárja le a választható alakokat.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 3
GEPI_OSSZEGZES_VEGE