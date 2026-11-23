# PE-recheck: U21 (w01-u-2-1), Megoldás, 2. változat

## 1. Hatókör és bemenet

**Szerep:** szakmai ellenőr (PE), recheck. Az anyag a megoldásíró 2. változata (DRAFT_FOR_REVIEW), mellette a befagyasztott kézirat (1. javítási kör) és a GR 2. terve.

**Megvizsgáltam:**
- a két korábbi futás findingjait (PE-M01…M04, PE-m05, PE-m06, PE-S01…S05);
- a megváltozott részeket: az elfogadási kategóriákat, a feedbacket, az i08 rubrikáját és C mintáját, a TANULOI_NEZET-et;
- azt, hogy a változások hatnak-e az i05, i06 és i07 itemekre.

**Nem vizsgáltam:**
- a BLOKK_JSON-t (MO-F04, CEO-szkript);
- a tipográfiát (HE);
- a kézirat befagyasztott szövegét; azt csak ott néztem, ahol a feedback ráépül;
- az E-01–E-05 kéziratjavaslatok végleges szövegét. Ezek a kéziratszerzőhöz mennek.

**Saját javaslat (szerepszabály):** a C minta első két mondatában a *Camille en a pris quatre, elle est fan* az én PE-M04-es javaslatom. Ezt a félmondatot másik ellenőr (NyE) nézze meg. A C minta többi részét, és azt, hogy a keretellentmondás megszűnt-e, én ellenőriztem.

## 2. Valóságpróba (csak a változások)

A keret nem változott. Az új C mintában Léo a piacon a zöldségestől paradicsomot és bazsalikomot hoz. Ez illik a Croix-Rousse vasárnapi piacához. A korábbi ellentmondás („nem kell pékség”, aztán pékségi kérés) megszűnt: a petits pains most csak ajánlás a következő alkalomra.

**NOTE:** a *tomates anciennes* és az *il a toujours de belles tomates anciennes* nyári termék. Ha a hét évszaka nincs rögzítve, ez rendben van. Ha a kurzus őszi vagy téli keretben fut, cseréld évszakfüggetlen tételre (pl. *des clémentines*, *du fromage frais*).

## 3. Mondatonkénti tábla (csak az új vagy gyanús mondatok)

| ID | Jelenlegi szöveg | Megjegyzés | Javaslat | Súly |
|---|---|---|---|---|
| i08, C minta | *Il y a beaucoup de stands de légumes, mais beaucoup des habitués du marché ne vont que chez lui, parce qu'il cueille tout la veille.* | Természetes, és a helyzetből jön. | – | rendben |
| i08, C minta | *Si tu vois du basilic, prends-en un bouquet.* | Természetes, az *en* előzménye egyértelmű. | – | rendben |
| i08, C minta | *Pas besoin de pain, mais note pour la prochaine fois : la boulangerie du marché fait des petits pains aux graines vraiment bons.* | Az ellentmondás megszűnt, ajánlásként működik. | – | rendben |
| i07-s001 (helyes, nem célzott) | lista: *beaucoup de*, *un peu de* | Hiányzik a köznyelvben nagyon gyakori *plein de* (*Il adore le sucré : je mets plein de miel*), a *pas mal de* és az *encore du*. Ezek most az általános hibafeedbacket kapják. | Bővítsd a listát, vagy a fallbackről lásd: PE-R01. | MINOR (PE-M01) |
| i07-s004 (helyes, nem célzott) | lista: *nos*, számnevek | A boulangère élőszavában a *plein de petits pains aux noix* és a *quelques petits pains* is helyes, és nincs kezelve. | mint fent | MINOR (PE-M01) |
| i06 (helyes, nem célzott) | N01–N03 | Hiányzik az *On n'en veut pas.*, az *On n'en prendra pas.* és a *J'en veux deux.* Ezek mind helyesek egy foglalási üzenetben. | lásd PE-R01 | MINOR (PE-R01) |

A feedback új francia betétei helyesek és természetesek. Ellenőriztem:
- az *en* a *de flan*-t veszi át, a *trois parts* a mennyiség;
- *Nous vous en avons acheté trois*;
- *Nous en avions acheté trois*: reklamációban kifejezetten természetes;
- *de + le = du*;
- a participe az *en* mellett nem egyezik.

## 4. Szint (változás)

A szintet a recheck nem érinti. A „helyes, de nem célzott” kategória kifejezetten javít a helyzeten, mert az idiomatikusabb tanulói változatokat már nem bünteti.

## 5. Műfajpróba (változás)

- **i08 C sáv:** most a tanuló saját üzenetéhez méri az ellentmondást, és a *des petits pains* ajánlásként is állhat. A műfajnak megfelel.
- **i06:** az N01–N05 jól elválasztja a jelentéstartó átfogalmazást a kért javítástól. Az N05 indoklása pontos.

## 6. A korábbi findingok állapota

| ID | Eredeti súly | Állapot | Indok |
|---|---|---|---|
| **PE-M01** | MAJOR | **PARTIALLY FIXED → MINOR** | A felsorolt eseteket (*beaucoup de*, *un peu de*, *nos*, számnév) már nem bünteti. A lista azonban zárt: a *plein de*, a *pas mal de* és a *quelques* az s001-ben és az s004-ben hibának minősül. A végleges megoldás az E-01 (ESCALATED). Addig bővítsd a listát. |
| PE-S01 | MAJOR | PARTIALLY FIXED, összevonva a PE-M01-gyel | Ugyanaz a hely és ugyanaz a hiba. Csak a PE-M01 alatt követem. |
| PE-M02 | MAJOR | **FIXED** | A nevesített esetek (*Nous n'en voulons pas*, *J'en prendrai deux*, *acheter de chouquettes*, *On ne veut pas…*, *…vingt*) kezelve vannak, büntetés nélkül. A maradék általános rés az új PE-R01. |
| **PE-M03** | MAJOR | **PARTIALLY FIXED → MINOR** | A feedback (i03-E03, s004-E01) már nem állít jelentéskülönbséget. A 0.3 kapura feltételes szabály született. Nyitva maradt: (1) a feltételes szabály nem terjed ki az i08 „Nem elegendő: *de petits pains* a termék jelentésében” sorára; (2) a p04 tanulói kontrasztja még mindig „kis méretű kenyereket” állít (E-03, kézirat). A két szöveg ugyanannál a tanulónál ellentmond egymásnak, amíg az E-03 be nem kerül. |
| PE-S02 | MINOR | FIXED | Normaalapú megfogalmazás. |
| PE-M04 | MAJOR | FIXED (a saját félmondatomat a NyE ellenőrizze) | Az *en* előzménye (*des cannelés* → *Camille en a pris quatre*) egyértelmű, és egyezik a p06-tal. A *pas besoin de boulangerie* csonkasága és a záró ellentmondás megszűnt. |
| PE-S04 | MINOR | FIXED | Lásd PE-M04. |
| PE-m05 | MINOR | FIXED | A sorrendi, maradékos szintrendszer minden esetet lefed. Az A = 6 és B ≤ 3 eset „Részleges”, a C ≥ 2 a „Teljesített” feltétele. Az R1 (A = 4, C = 0) helyesen „Nem teljesített”. |
| PE-S05 | MINOR | FIXED | (1) A szintek lefedése rendben. (2) A C sáv és az E05 a tanuló saját üzenetéhez mér. |
| PE-m06 | MINOR | FIXED | Az i04-E02 bővítve, a kulcs marad. |
| PE-S03 | MINOR | FIXED | Az alak a következő szóval együtt is elfogadott; bekerült a *Volontiers,* és az *Oui, volontiers,*. |

## 7. Új finding

| ID | Súly | Próba | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|---|
| **PE-R01** | MINOR | tétel (4.) | i05, i06, i07-s006 (teljes mondatos mezők); i07-s001/s004 | A „helyes, de nem célzott” kategória felsorolással működik. A fel nem sorolt helyes mondat a 1. rész szerint az *általános* feedbacket kapja, és ez hibának minősül. Példák: *On n'en veut pas.*, *On n'en prendra pas.*, *J'en veux deux.* (i06); *plein de miel* (s001). | 1. rész, Újrapróbálás 1.: „ha nincs illeszkedő, az általános”. A nyitott szerkezetű mezőkben a lista elvben sem lehet teljes. | Az illeszkedés nélküli válasz általános feedbackje ezekben a mezőkben ne ítéljen. Javasolt szöveg: „Ezt a választ nem ismerem fel. Vesd össze a kulccsal: ha a mondatod más szerkezettel helyes, az nem hiba, de a feladat [X]-et kéri.” A legvalószínűbb *on*- és *plein de*-változatokat is vedd fel. | 1. rész, i06, s001, s004 |

## 8. NOTE-ok (nem findingok)

- **s002, *de métro*:** a kérdés a tanári kérdéslistán van, ez elég.
- **C minta, paradicsom:** évszakfüggés (lásd a 2. részt).
- **Webes keresés az OQLF-lapról:** a keresőmotor összegzése szerint a lap a *des petits pains*-t megtartott *des*-ként hozza. Ez a motor szintézise, a kivonatokban csak a *grands-pères*, a *petits pois* és a *beaux-parents* példa látszik. A lapot NEM NYITOTTAM MEG, ezért ez nem bizonyíték; a 0.3 kapu nyitva marad (segitseg-1).

## 9. Rendben lévő elemek

- A háromkategóriás rendszer jó tervezői döntés: nem büntet, és célzottan visszavezet a feladathoz.
- Az i05-N04 és az s006-N01 (*…trois parts*) helyesen fordította meg a korábbi téves elutasítást.
- Minden i07 subitem kapott OK-feedbacket, ami a második hiba utáni indoklást is szolgálja.
- A kulcsok nem változtak, és mind helyesek.

## 10. Kérdések a tanárnak (változatlanok, összevonva)

1. *« le Pain Perché propose ___ petits pains aux céréales » : « de » vous paraît-il acceptable ?*
2. *« à la sortie ___ métro Croix-Rousse » : « de métro » acceptable ?*
3. *« Nous ne voulons pas en acheter » dans un message de réservation : naturel, ou plutôt « on n'en prendra pas, merci » ?*

## 11. Forrásnapló

- **WebSearch:** `"des petits pains" adjectif antéposé des de règle vitrine linguistique`. Találat: [OQLF – Des devant un adjectif antéposé](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose). NEM MEGNYITOTT; a kivonat nem döntő (lásd a 8. részt).
- **WebSearch:** `"je mets plein de miel"`. Egy fórumtalálat a [forum.hardware.fr](https://forum.hardware.fr/hfr/Discussions/Cuisine/miel-sujet_86913_1.htm) oldalon, NEM MEGNYITOTT. A *plein de miel* köznyelvi természetességét saját tudásom alapján állítom, nem a keresés alapján.

## 12. Verdikt

**REVIEW_PASS** a megnevezett hatókörre: nincs nyitott BLOCKER vagy MAJOR. Három MINOR nyitott: PE-M01, PE-M03 és PE-R01.

**Feltételek:**
- Az i03 2. helyének kulcsa a 0.3 kaputól (OQLF) függ. Ha a forrás nem igazolja, a feltételes szabályt az i08-ra is alkalmazni kell (PE-M03).
- A C minta általam javasolt félmondatát (*Camille en a pris quatre, elle est fan*) a NyE ellenőrizze.

---

**Változáslista:**
- FIXED: PE-M02, PE-M04, PE-S02, PE-S03, PE-S04, PE-S05, PE-m05, PE-m06.
- PARTIALLY FIXED, MAJOR → MINOR: PE-M01 (a PE-S01 ebbe összevonva), PE-M03.
- Új: PE-R01 (MINOR).

**Recheck-hatókör:** a s001 és s004 elfogadási listája, az 1. rész fallback-szabálya, az i06 *on*-változatai, és az i08 „Nem elegendő” sora a 0.3 kapu után.

**Következő címzett:** CEO.

**Tanulság:** ha egy nyitott mezőben a nem célzott helyes válaszok felsorolással kerülnek a nem büntető kategóriába → a fel nem ismert válasz általános feedbackje ne ítéljen, hanem vezesse a tanulót a kulccsal való összevetésre → a lista sosem teljes, és a kimaradt helyes válasz különben hibának minősül → minden teljes mondatos és nyitott determinánshelyes zárt item.

PE_FINDINGEK
PE-M01 | MINOR | tetel | w01-u-2-1-i07-s001, -s004 | PARTIALLY FIXED: a nem célzott helyes kitöltések zárt listájából hiányzik a plein de / pas mal de / quelques, így ezeket a megoldás az E-01 bevezetéséig hibának minősíti.
PE-M03 | MINOR | kollokacio | w01-u-2-1-i08 „Nem elegendő” sor; p04 kontraszt (E-03) | PARTIALLY FIXED: a 0.3-ra vonatkozó feltételes szabály nem terjed ki az i08-ra, és amíg az E-03 nincs bevezetve, a p04 „kis méretű kenyér” állítása ellentmond az átírt feedbacknek.
PE-R01 | MINOR | tetel | i05, i06, i07-s006, s001, s004; 1. rész fallback | A fel nem sorolt, helyes, de más szerkezetű válasz (On n'en veut pas, J'en veux deux, plein de miel) az általános, hibát jelző feedbacket kapja; nem ítélő fallback-szöveg kell.
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 3
GEPI_OSSZEGZES_VEGE