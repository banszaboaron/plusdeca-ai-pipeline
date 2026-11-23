# PE-jelentés (recheck): U21 (w01-u-2-1), a Megoldás 9. változata, T27 nyelvi kör

## 1. Hatókör és bemenet

**Szerep:** szakmai ellenőr (PE), recheck.

**Bemenet:**
- a Megoldás 9. változata, a hozzá tartozó TANULOI_NEZET és a BLOKK_JSON tanulói szövegei;
- a befagyasztott kézirat az eszkaláció után (E-01–E-36);
- a PRESIDENT M- és V-döntése;
- összevetési alapként az 5. változat és az élesben futó P5-blokk.

**Mit vizsgáltam:** a kész itemek szakmai érvényességét (a szöveg, a kérdés és a végleges opciók, illetve kritériumok együtt), azt, hogy minden itemnek egy jó válasza van, és hogy a kulcsokban, az alternatívákban, a feedbackben idézett francia elemekben és a francia rubrikában mai, természetes francia áll-e.

**Lefedett ID-k:**
- i01, i02, i03, i04;
- i05-s001…s004, i06;
- i07-s001…s006;
- i08: a *Grille*, a *Niveaux*, a *Ne suffit pas* lista, a C minta, az R1 és az R2;
- a változott francia címkék (p04 2. sor, p05 2–3. sor), a p08 *Rappel* (csak a kimásolhatóság szempontjából) és a p09 két listája (a kritériumokkal való egyezés miatt).

**Nem vizsgáltam:**
- a magyar feedback nyelvhelyességét (NyE) és tipográfiáját (HE); egy észrevételt NOTE-ként továbbítok;
- a sémát és a leképezést (MO-T27-10, MO-T27-11: CEO és NavE);
- a változatlan A és B modellszöveget.

## 2. A korábbi findingok státusza

| ID (futás) | Korábbi probléma | Státusz | Bizonyíték |
|---|---|---|---|
| PE-T27-01 (1. futás) | *quantité ouverte*: tükörfordítás | **FIXED** | A p05 2. címkéje, a p09 list#2[3] és list#3[3] eleme, valamint a rubrika A(4) és B(4) sora egységesen *quantité indéterminée*. A list#2[1] és a B(2) *sans quantité précise* fordulata ezzel összhangban van. |
| PE-T27-02 (1. futás) | *Partiel* szintnév; a „premier niveau atteint” kétértelmű | **PARTIALLY FIXED → a maradék NOTE** | A kétértelmű mondat helyén ez áll: *on retient le premier dont les conditions sont remplies*. Ez volt a finding lényege, és rendben van. A *Partiel* szintnév megmaradt; ízléskérdés, NOTE-1-ként kezelem, nyitott findingként nem tartom fenn. |
| PE-T27-03 (1. futás) | A p04 2. címkéje nem jelzi, hogy a *de petits pains* kerülendő | **FIXED (a PRESIDENT V-döntésével tárgytalan)** | Az új címke (*✓ correct ; « des petits pains » aussi (nom de produit)*) olvasható, és egyezik a V-döntéssel, a hozzá tartozó note-tal és a p04 szabályával. |
| PE-T27-01 (2. futás) | „le premier niveau atteint décide” | **FIXED** | lásd fent |
| PE-T27-02 (2. futás) | *(allCriteria)* kódtoken a tanulói rubrikában | **FIXED** | A címke most: *A. Critères de langue (1 point par critère : …)*. Az A terület `requirements` listája 6 elemű, így a korábbi N1 (7 elem) is megoldódott. |

## 3. Valóságpróba

**A valós helyzet:** Lyonban vasárnap reggel sor áll a népszerű pékség előtt. A viennoiseries-t előző este üzenetben foglalják le. A pultnál ez hangzik el: *Je vais vous prendre…* / *Et avec ceci ?*. A flant szeletre (*à la part*), a rozskenyeret vágva (*à la coupe*) adják. Délelőtt a Croix-Rousse boulevard-i piacán tömeg van, és a barátok SMS-ben egyeztetik, ki mit hoz a brunchra.

**Összevetés:** a magázó keretre váltás (*Vous acceptez*, *Vous expliquez poliment*, „Vous :”) a helyzetet nem változtatja meg. A tanuló a pékkel, a pultnál és a reklamációnál amúgy is magázódna, Léóval és Camille-lal tegeződik. **Nincs eltérés.**

## 4. Mondatonkénti tábla (csak a gyanús helyek)

| ID | Jelenlegi szöveg | Megjegyzés | Javasolt francia | Forrás | Súly |
|---|---|---|---|---|---|
| i08 rubrika, C, 3. sor | *La mention des petits pains (« des » ou « de petits pains ») peut apparaître…* | A zárójel félig csonkolt alakot ad: « des » ou « de petits pains ». Így nehezen olvasható. | *Les petits pains (« des petits pains » ou « de petits pains ») peuvent apparaître comme recommandation ou comme demande justifiée.* | saját ítélet | JAVASLAT |
| i05-s002, bevezetők | *Volontiers, je vais en prendre deux.* · *Merci, je vais en prendre deux.* | Az *Et avec ceci ?* rendelési kérdés, nem kínálás, ezért a *Volontiers* és a mondatnyitó *Merci* itt kissé szokatlan. Nem hibás francia, és az elfogadásuk nem tanít rosszat. | – (maradhat) | saját ítélet | NOTE |
| i05-s001…s004, s006: az új bevezető és záró elemek | *Oui, merci, j’en prends.* · *Non, c’est bon, je n’en veux pas, merci.* · *Bonjour, excusez-moi, on en a acheté trois.* · *Je vais en prendre trois, s’il vous plaît.* | természetes | – | – | rendben |

## 5. Szint három tengelyen

- **Helyzet:** hétköznapi vásárlás és szervezés, A2–B1. A francia rítus (foglalás, *ardoise*, reklamáció) ezt megemeli.
- **Nyelv:** a mért mag B1+-on ismétlés. Ez a FICHE-01 régi szintkifogása (GR-T27-03), amely nem ebben a körben dől el, ezért nem nyitom újra.
- **Művelet:** jelentés szerinti megkülönböztetés, szerkezetmegtartó javítás, integrált írás; B1+/B2.
- **Új szintkockázat:** a V-döntés után az i07-s004 elveszíti a megkülönböztető erejét (lásd PE-T27-04).

## 6. Műfajpróba

- **i08: válasz-SMS egy barátnak.** A brief regisztere (*informel et amical, sans argot (SMS, tutoiement)*) most pontos, ezzel a korábbi NOTE-2 megoldódott. A rubrika C területe egyezik vele.
- **A kötelező szerkezetek:** a *des / de petits pains* ajánlásként vagy indokolt kérésként is beilleszthető, mesterkélt mondatot nem kényszerít ki. A C minta, valamint az A és a B modell műfajhű.
- **Az értékelőlap mint műfaj:** a francia *grille* (*Domaine*, *Exigences*, *Niveaux : Non atteint / Atteint / Excellent / Partiel*, *Ne suffit pas*) érthető és idiomatikus.

## 7. Tételes ellenőrzés (az itemeket előbb kulcs nélkül oldottam meg)

| Item | Saját megoldás | Ítélet |
|---|---|---|
| i01 | 1 = partitív, 2 = *de + le* | Egy jó válasz van. Az elutasított minták helyesek. |
| i02 | A | Egy jó válasz. A B, C és D opció hihető tévedésre épül. |
| i03 | *d’* / *des* (a V-döntés szerint *de* is) | Az 1. mezőben egy jó válasz van. A 2. mezőben két, rögzítetten elfogadott alak áll. Az N01 tartalmilag helyes, és nem mond ellent a p04 szabályának. Az E05 és az E06 kiegészítése („gondozott írásban „de” is”) következetes. |
| i04 | *beaucoup de* / *beaucoup des* | Egy jó válasz. A tanári kérdés továbbra is nyitott. |
| i05 | *J’en prends* · *Je vais en prendre deux* · *Je n’en veux pas* · *Nous en avons acheté trois* | A magázó helyzetmondatok egyértelműek (2. pont rendben). A bevezetőkkel és záró elemekkel bővített listák minden tagjában ép a mért szerkezet, a kategóriák nem csúsztak el. |
| i06 | *Je vais en prendre deux* / *Nous ne voulons pas en acheter* | A „Vous :” és a *Le brouillon* címke rendben van, a két szerkezetmegtartó feltétel szó szerint megvan. |
| i07-s001…s003, s005 | *du, du, d’, de* | Egy jó válasz mindegyiknél. A sorszám és az utasítás egyértelműen összerendelhető (7. és 11. pont). |
| i07-s004 | *des* (*de*) | Lásd PE-T27-04. |
| i07-s006 | *Je vais en prendre trois* | Egy jó válasz. A szám megtartását a *Combien de parts ?* kérdés kikényszeríti. |
| p08 *Rappel* | – | A négy döntéspár nem árulja el mondatonként az alakot. Az 5. pont rendben van. |
| i08 | – | A pontok, a küszöbök és a szintsorrend 1:1 egyezik a korábbival. A tanulói lista és a rubrika terminusai egyeznek. Az R1 és az R2 besorolása helyes. |

**A feedbackben idézett francia:** a *que tu m’as conseillé*, a *on n’a plus d’œufs : tu peux en prendre six ?* és a *beaucoup des habitués du quartier* helyes, természetes francia. A szereplők közti tegezés indokoltan maradt meg.

## 8. Findingok

| ID | Súly | Próba | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|---|
| PE-T27-04 (új) | MINOR | tetel (12., szint) | i07-s004 (és részben az i03 2. mezője) | A V-döntés után a *des* és a *de* is helyes. A megmaradt hibás alakok (*d’* mássalhangzó előtt, *du* vagy *de la* többes szám előtt, *les*) egy B1+-os tanulónak kézenfekvően rosszak, így az item nem mér valódi megkülönböztetést, a *petits pains* terméknév felismerését pedig már egyáltalán nem méri. Az i03 2. mezőjét ugyanez érinti, de ott az 1. mező még mér. | A V-döntés, az MO-T27-13 (a szerző maga is jelzi), az s004 elutasított alakjai és a 0. rész („csak a *les*/*du*/*d’* hibát szűri”). | A PRESIDENT döntését nem bírálom felül, és ebben a körben nincs teendő. A GR egy későbbi körben cserélje az s004-et olyan mondatra, amely a döntéspárok egyikén (pl. *de* elöl álló melléknév előtt ↔ *des* melléknév nélkül, vagy *beaucoup de* ↔ *beaucoup des*) valódi választást kér, a cél szűkítése nélkül. Címzett: CEO, GR. |

**NOTE-ok és JAVASLATOK**
- **NOTE-1 (a PE-T27-02 maradéka):** a francia iskolai skálán a *Partiel* helyett a *Partiellement atteint* a bevett szintnév. Ízléskérdés, a pontozást nem érinti.
- **NOTE-2 (NyE-nek, a hatókörömön kívül):** az i08-E05 („Az üzenete szerint ezt már megvették.”) magázó többes számú alakja alany nélkül harmadik személynek („ők vették meg”) is olvasható. Az i06-F05 „egyáltalán nem kértek” fordulata hasonló. Esetleg: „ezt Camille-lal már megvették”.
- **NOTE-3 (CEO/NavE, MO-T27-10 és MO-T27-11):** a mérés érvényességét érinti, ha a `de (2)` alternatíva nem kötődik a 2. mezőhöz, vagy ha a `requiredLanguage` csak a *des petits pains* alakot ismeri, és az írásértékelés kapuja a *de petits pains* alakot hiányként kezeli. Ezt szakmailag nem minősítem, de a leképezésnél ellenőrizni kell.
- **JAVASLAT:** a rubrika C területének 3. sora (lásd a 4. részt).

## 9. Rendben lévő elemek

- **Kulcsok:** egyik item kulcsa sem változott, és mindegyiket önállóan ugyanígy oldottam meg.
- **V-döntés:** az i03-ban, az s004-ben, a rubrika A(3) és C területén, valamint a *Ne suffit pas* listában ellentmondás nélkül van átvezetve.
- **Az N01-szövegek** tartalmilag egyeznek a p04 szabályával és a 2. kontrasztsorral.
- **Megszólítás:** a tanulóhoz szóló francia szövegben nincs tegezés. A szereplők közti tegezés indokoltan maradt meg.
- **A francia rubrika** idiomatikus, és 1:1 egyezik a tanulói listákkal.
- **Az i05 és az s006 bővített alternatívái** mind természetes, ép szerkezetű mondatok.

## 10. Kérdések a tanárnak

1. *« Ce matin, nous avons fait ___ petits pains aux noix »* : « des » et « de » étant acceptés, cet item vous paraît-il encore utile, ou faut-il le remplacer ?
2. *« Beaucoup des tartes de la vitrine sont déjà réservées »* : naturel, ou plutôt *la plupart des tartes* ? Ez a kérdés korábbról nyitott, változatlanul továbbítom.

## 11. Forrásnapló

Ebben a körben webes keresést nem végeztem. A változások rubrika- és feedbackszövegek, valamint a PRESIDENT döntésével rögzített elfogadások; új kollokáció nem került be. A korábbi körök keresései (a *quantité indéterminée* terminus és az NA/PA/A/D skála) változatlanul érvényesek. A 4. rész ítéletei saját becslésen alapulnak.

## 12. Verdikt

**REVIEW_PASS** a megnevezett hatókörre: nincs nyitott BLOCKER vagy MAJOR.
- Az öt korábbi finding közül négy FIXED. A PE-T27-02 (1. futás) PARTIALLY FIXED: a lényegi része javítva, a maradékot NOTE-ra soroltam.
- Egy új MINOR finding van (PE-T27-04). A PRESIDENT döntéséből következik, ezért a GR-hez kerül egy későbbi körre.

**Következő címzett:** CEO.

**Tanulság:** ha a döntés két alakot is elfogad egy zárt itemben, az itemet nem elég átírni: azt is meg kell nézni, hogy mér-e még bármit. Ha nem, a döntés mellé az item cseréjét is a GR-hez kell utalni. Javasolt hatókör: minden olyan zárt item, amelyben a változatelfogadás miatt két helyes alak lett.

PE_FINDINGEK
PE-T27-04 | MINOR | tetel | i07-s004 (részben i03 2. mező) | A V-döntés után a „des” és a „de” is helyes, a megmaradt hibás alakok kézenfekvően rosszak, így az item nem mér valódi megkülönböztetést és a terméknév felismerését sem.
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 1
GEPI_OSSZEGZES_VEGE