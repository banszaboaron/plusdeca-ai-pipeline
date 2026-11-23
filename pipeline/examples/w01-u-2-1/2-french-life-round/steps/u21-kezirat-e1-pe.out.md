# PE célzott ellenőrzés: U21 (w01-u-2-1, GI2), az eszkalált kéziratmódosítások

**Összefoglaló:** nincs nyitott BLOCKER vagy MAJOR, ezért a hatókörre REVIEW_PASS. A korábbi PE-findingok közül 6 FIXED, 1 PARTIALLY FIXED és 4 OPEN. Ehhez jön egy új MINOR, így 6 MINOR maradt nyitva.

## 1. Hatókör és bemenet

- **Szerep:** szakmai ellenőr (PE), célzott recheck.
- **Bemenet:**
  - a célzottan javított T27-kézirat (DRAFT_FOR_REVIEW);
  - a tétellista (eszkalációs tábla, E-01–E-36);
  - a PRESIDENT megszólítási döntése (M, 2026-11-15T22:38:49Z);
  - a PRESIDENT változatdöntése (V, 2026-11-15T22:37:09Z).
- **Amit vizsgáltam:**
  - a megszólítás szerinti átírások: E-01, E-03–E-07, E-10, E-11, E-13–E-18, E-21–E-24, E-26;
  - a „petits pains” változatdöntés átvezetése: E-02, E-08, E-09, E-32;
  - a terminuscsere: E-12, E-30, E-33;
  - a p08 Rappel új szövege: E-19;
  - a sorszámozás: E-20;
  - a p09 Consigne és a listák: E-25, E-27–E-29, E-31, E-34;
  - a korábbi PE-findingok állapota.
- **Amit nem vizsgáltam újra (már elfogadott, változatlan):**
  - a mért stimulusmondatok;
  - a kulcsok;
  - az ardoise;
  - a p02–p06 egyéb La règle szövegei;
  - a p03 egésze;
  - az A és B modell szövege;
  - a rubrika és a feedback (IR-ESC-01, megoldásíró).
- **Hang:** nincs.
- **Web:** ebben a körben nem kerestem. A V-döntés lezárta a „petits pains” kérdést, a többi változás szövegszintű.

**ID-ütközés:** a két korábbi futás ugyanazokat az ID-kat más tartalommal használta. Ezért az alábbi tábla mindkét futás ID-ját megadja, a nyitott tételek pedig egyedi ID-t kapnak.

## 2. Valóságpróba (célzott)

**Hogyan zajlik a helyzet valójában:**
- szombat este DM-foglalás;
- vasárnap sor és pult;
- SMS-ek Léóval reggel és délelőtt;
- piac, brunch.

**Összevetés az anyaggal:** a magázó átírás új tényt nem hozott.

- A p01-ben a *tout au long de la matinée* már nem állít hamisat az idővonalról.
  - Kisebb pontatlanság: az első SMS 8:15-kor megy, még a sor előtt, de ez is „a délelőtt folyamán” van.
- A *votre ami* és a *chez vous* a magázó keretben természetesen olvasható: a tanuló barátja, a közös lakás.
- Az i05-2 *que vous avez réservés hier soir* nyelvileg is rendben van, az egyeztetés helyes.

A keret egységes, nem létező helyzet nincs.

## 3. Mondatonkénti tábla (csak a változott és gyanús elemek)

| ID | Jelenlegi szöveg | Mi a gond | Valószínű francia / helyes változat | Forrás | Súly |
|---|---|---|---|---|---|
| p04 La règle, 2. bekezdés (E-08) | „…Ilyenkor a „des” rendszerint megmarad: „des petits pois”, „des grands-parents”. A pékségben a „petits pains” ilyen terméknév… gondozott írásban a „de petits pains” is helyes…” | A szöveg előbb a „petits pois” és a „grands-parents” mellé sorolja, ahol a „de” hibás volna, aztán mégis megengedi a „de”-t. A tanuló nem érti, miért. | „…A „petits pains” félúton van: terméknév, ezért a „des petits pains” a gyakoribb, de nem olyan szoros kifejezés, mint a „petits pois”, így gondozott írásban a „de petits pains” is helyes.” | V-döntés | MINOR (PE-ESC-01) |
| p08 Rappel, 4. pár (E-19) | „„de/d’” elöl álló melléknév előtt ↔ „des” terméknévben („des petits pains”; a „de petits pains” is helyes)” | A bevezető szerint a pár egyik tagja illik a jelentéshez. Ennél a párnál viszont mindkét tag elfogadott, így a „döntéspár” nem igaz. | Választás helyett megjegyzés: „„de/d’” elöl álló melléknév előtt (a „petits pains” terméknévnél „des” és „de” is jó)”. | V-döntés | MINOR (PE-ESC-01) |
| p01 Vos objectifs, 2. pont (E-02) | *et reconnaître « des petits pains » ou « de petits pains » quand l’expression est un nom de produit* | A „reconnaître X ou Y” nem mondja meg, mit csinál a tanuló. | *…et savoir qu’avec le nom de produit « petits pains », « des » et « de » sont tous les deux possibles* | – | MINOR (PE-ESC-01) |
| p02 Exemples, 3. (E-05) | *Camille se souvient du serveur : il connaît tout le quartier.* | Helyes, de a kettőspont ok-okozati kapcsolata laposabb, mint az eredeti beszélt kérdésé. | *Léo, tu te souviens du serveur ? Il connaît tout le quartier.* (ugyanaz a technika, mint az E-17-ben) | – | JAVASLAT |
| p09 nyelvi lista címe (E-31) | *Avant d’envoyer, vérifiez (les six critères de langue sont obligatoires ; une phrase peut en remplir plusieurs)* | Helyes francia (a *remplir un critère* élő kapcsolat), de a zárójeles rész túl hosszú egy címhez. | Cím: *Avant d’envoyer, vérifiez* + külön sor: *Les six critères sont obligatoires ; une même phrase peut en remplir plusieurs.* | – | JAVASLAT |
| p09 Contenu, 4. (változatlan) | *une quantité indéterminée ou une foule (au marché, dans la queue, dans le choix proposé)* | A terminus javult, de a *foule… dans le choix proposé* értelmetlen párosítás maradt. | *une quantité indéterminée : du monde au marché ou dans la queue, beaucoup de choix…* | – | MINOR (PE-T27-06) |

**Rendben van (a 2. próbán átment):**
- a magázó helyzetmondatok:
  - *Léo vous écrit*;
  - *Vous venez de passer… que Léo vous a conseillé. Vous lui écrivez un SMS*;
  - *On vous répond. Vous préparez votre réponse et vous la relisez…*;
  - az i05 négy helyzete;
  - *Elle vous écrit… Vous l’attendez*;
- a „Vous :” címke: FLE-szerepjátékban bevett, a tegező replika mellett sem zavaró;
- *Léo, tu vas en goûter un ?*;
- *✓ quantité indéterminée*, *✓ partie d’un groupe précis*;
- *Registre : informel et amical, sans argot (SMS, tutoiement)*;
- *pourquoi à cet endroit*;
- *ce que Léo doit apporter et en quelle quantité ; au moins un produit sans quantité précise*;
- *(et en quelle quantité)*;
- *On va en emprunter cinq*;
- a p04 2. sorának címkéje: *✓ correct ; « des petits pains » aussi (nom de produit)*;
- a magyar személytelen szöveg (*kell felsorolni… kell írni*; *A „vous” névmás…*).

## 4. Szint három tengelyen (célzott)

- **a) Téma:** változatlan, B1–B1+.
- **b) Nyelv:** a magázó keret nem nehezít és nem könnyít.
- **c) Művelet:** a V-döntés miatt az i03 2. mezője és az s004 már nem különböztet. A felkínált készletből a „d’” a mássalhangzó miatt, a „du” és a „de la” a többes szám miatt kiesik, a „de” és a „des” is helyes. Így itt a feladat gyakorlatilag csak a többes számot kéri, ami T09-szerű könnyítés.

Ez a PRESIDENT döntésének következménye („a cél nem szűkül”). Nem nyitom újra, a 6. részben NOTE-ként adom tovább a CEO-nak.

## 5. Műfajpróba (célzott)

- **Consigne (DELF-szerű):**
  - a *Registre* sor már nem keveri a két regisztertengelyt, és nem mond ellent a modellek *familier* hangjának;
  - az *informel et amical* FLE-ben használatos;
  - az *Objectif* és a *Longueur* rendben van.
- **Ellenőrzőlista:** továbbra is eldöntendő kérdésekből áll; a 3. kérdés a V-döntést követi.
- **Modellek:** nem változtak, a tegezésük a PRESIDENT döntése szerint szereplők közti beszéd.

## 6. Korábbi findingok állapota

| ID (futás) | Tárgy | Állapot | Indok |
|---|---|---|---|
| PE-T27-01 (1.) | p01: *entre deux*, *votre ami*, *préciser quatre choix* | PARTIALLY FIXED | Az *entre deux* helyére *tout au long de la matinée* került, a *votre ami* a magázó keretben már egyértelmű. A *préciser quatre choix* változatlan, ezt a 2. futás PE-T27-01-e követi tovább. |
| PE-T27-01 (2.) | p01 *préciser quatre choix* | OPEN | Változatlan; ebben a körben nem volt átvezetendő. |
| PE-T27-02 (2.) | p01 *entre deux* | FIXED | E-01 |
| PE-T27-02 (1.) / PE-T27-03 (2.) | *quantité ouverte* / *groupe nommé* | FIXED | E-12, E-30, E-33: mind az öt helyen egységesen javítva. |
| PE-T27-03 (1.) | p09 Contenu, 2. és 4. elem | PARTIALLY FIXED | A 2. elem javult (E-29). A 4. elem *foule… dans le choix proposé* része maradt, ezt PE-T27-06 néven követem. |
| PE-T27-06 (2.) | p09 Contenu, 4. elem | OPEN | lásd fent |
| PE-T27-04 (1.) | *phrases fausses*; *Le brouillon :* címke | OPEN | Nem került az eszkalációba, a szöveg változatlan. |
| PE-T27-04 (2.) | *Registre* | FIXED | E-27 |
| PE-T27-05 (2.) | p04 2. címke | FIXED | A V-döntés miatt már nincs mit jelölni, az új címke világos. |
| PE-T27-07 (2.) | p02 *Alors, verdict ?* | OPEN | változatlan |
| PE-T27-08 (2.) | Modèle A, *si tu as encore faim* | OPEN | változatlan, a modell szövege érintetlen |

## 7. Új findingok

| ID | Súly | Próba | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|---|
| PE-ESC-01 | MINOR | mondat | p04 La règle, 2. bekezdés; p08 Rappel, 4. pár; p01 Vos objectifs, 2. pont | A „petits pains” átvezetése nem következetes. A szabály a „petits pois” mellé sorolja, mégis megengedi a „de”-t. A Rappel döntéspárt ígér ott, ahol mindkét tag helyes. A célpont „reconnaître X ou Y” megfogalmazása homályos. | V-döntés; a 3. rész táblája | Tegyük félúti esetté („a „des” a gyakoribb, a „de” is helyes”). A p08-ban a 4. tétel megjegyzés legyen, ne pár. A p01 szövege: *savoir que… « des » et « de » sont tous les deux possibles*. A kulcs nem változik. | PE vagy NyE, UE (p08) |

**NOTE-ok:**
- **NOTE-ESC-A (CEO):** a V-döntés után az i03 2. mezője és az s004 nem különbözteti meg a terméknevet. A *de* és a *des* is jó, a többi alak alaktani okból esik ki. Érdemes rögzíteni, hogy a „lexikalizált des” cél ezeken az itemeken már nem mérhető. Ezt nem eszkalálom újra, mert a PRESIDENT döntött.
- **NOTE-ESC-B (önjavaslat-szabály):** két korábbi PE-javaslatomat átvették: *tout au long de la matinée* (E-01) és *pourquoi à cet endroit* (E-28). A *quantité indéterminée* részben az enyém. Ezek ellenőrzését más ellenőr végezze; a NyE recheck-hatókörében (E-01, E-27–E-31) mind benne van.
- **NOTE (régi):** a p04 1. kontrasztsora továbbra sem kapott ✓/✗ jelet.

## 8. Rendben lévő elemek

- A megszólítás következetes. Tanulóhoz szóló tegezés nem maradt: a helyzetmondatok magázók, a magyar szöveg személytelen. A tegezés csak szereplők közti beszédben áll (Léo, Camille, az SMS-ek, a modellek), és ez az M-döntés szerint helyes.
- Az E-05 és az E-17 megoldja a tanulóhoz szóló tegező példát, a mért szerkezet sértetlen.
- A terminuscsere egységes, a magyar zárójelek maradtak.
- Az E-20 sorszámozása nem árul el műveletet.
- A kulcsok és a zárt készletek változatlanok.

## 9. Kérdések a tanárnak

1. *« Ils vendent de petits pains » / « des petits pains » : à l’écrit soigné, vous acceptez vraiment les deux ?*
2. *« Une quantité indéterminée ou une foule (… dans le choix proposé) » : c’est clair pour vous ?*

## 10. Forrásnapló

Ebben a körben nem kerestem a weben. Újrahasznosított bizonyítékként a két korábbi PE-futás forrásnaplóját használtam (OQLF, CCDMD, DELF-regiszterlapok); ezeket korábban is csak a találati listán láttam, megnyitva nem voltak.

**Új bizonyíték ebből a körből:**
- tételes összevetés: E-01–E-36 a régi és az új szöveggel;
- a megszólítás ellenőrzése a változott helyeken;
- a V-döntés következetességének vizsgálata: p01, p04, p08, p09, i03, s004.

## 11. Verdikt

**REVIEW_PASS** a célzott hatókörre: nincs nyitott BLOCKER vagy MAJOR.

- Az új PE-ESC-01 javítása ebben a körben javasolt.
- A régi OPEN tételek (01, 04, 06, 07, 08) a CEO döntése szerint kerülhetnek a következő körbe.

**Következő címzett:** CEO.

**Tanulság:** ha egy PRESIDENT-döntés két alakot is elfogadhatóvá tesz, minden helyet végig kell nézni, ahol eddig kontrasztként szerepeltek (szabály, Rappel, célpont), mert a „döntéspár” szerkezet magától nem igazodik. Ez minden alak-elfogadási döntés átvezetésére érvényes.

PE_FINDINGEK
PE-T27-01 | MINOR | mondat | p01 Vos objectifs | A „vous allez préciser quatre choix” a magyar „pontosítasz négy döntést” tükörfordítása.
PE-T27-04 | MINOR | mondat | p07 oldalutasítás; i06 utasítás és címke | A „phrases fausses” vrai/faux olvasatot sugall, és a „Le brouillon :” beszélőcímkeként furcsa.
PE-T27-06 | MINOR | mondat | p09 Contenu du message 4. | Az „une foule … dans le choix proposé” párosítás értelmetlen maradt, csak a terminus javult.
PE-T27-07 | MINOR | valosag | p02 L’échange | Léo „Alors, verdict ?” kérdése fölösleges, mert 8:15-kor már megkapta az ítéletet (i02).
PE-T27-08 | MINOR | mondat | p09b Modèle A | A „si tu as encore faim” a brunch előtt értelmetlen.
PE-ESC-01 | MINOR | mondat | p04 La règle 2. bek.; p08 Rappel 4. pár; p01 Vos objectifs 2. pont | A „petits pains” V-döntés átvezetése következetlen: a szabály a „petits pois” mellé sorolja, mégis megengedi a „de”-t, a Rappel döntéspárt ígér két helyes taggal, a célpont „reconnaître X ou Y” homályos.
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 6
GEPI_OSSZEGZES_VEGE