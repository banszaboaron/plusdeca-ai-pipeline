# UE-jelentés: U21 (w01-u-2-1, GI2), megoldás 6. változata, T27 nyelvi kör

**Szerep és megbízás:** a tanulói nézőpontú ellenőr (UE) vagyok, független ellenőrzést végzek.

**Bemeneti változat:**
- a megoldás 6. változata, a tanulói nézettel (TANULOI_NEZET);
- a BLOKK_JSON tanulói szövegei;
- háttérként: a befagyasztott T27-kézirat és az elfogadott GR-terv (2. változat).

**Hatókör:**
- Vizsgálom: megoldható-e tanulóként, egyértelmű-e, de nem triviális-e a választás, és a feedback tényleg segít-e. Az i01–i08 itemeket nézem, a hozzájuk tartozó magyarázó és kontrasztblokkokkal és a p08 *Rappel* szakaszával együtt.
- **Nem vizsgáltam:**
  - a nyelvhelyességet és a tipográfiát (NyE, HE);
  - a rubrika és a lista 1:1 egyezését és az ID-ket (NavE);
  - a sémát (CEO-szkript).

**Módszer:** minden itemet előbb kulcs nélkül oldottam meg, csak a francia utasításból és a látott szövegből. Utána vetettem össze a kulccsal és a feedbackkel. Ez tanulószimuláció, nem emberi teszt.

---

## Végigjárás itemenként

| Item | Megoldásom (kulcs nélkül) | Hol akadtam el, mit vettem észre |
|---|---|---|
| i01 | 1 = partitív (az *acheter* tárgya); 2 = *de + le* (*à côté de + le parc*). Magyarul írtam, az utasítás ezt engedi. | Egyértelmű. Az „1 = … ; 2 = …” válaszminta a JSON-ban nem jelenik meg (MO-T27-03), de a szemantikus értékelés miatt ez nem akadály. Az E01–E04 a valódi tévedésekre felel. |
| i02 | A (*du*). | Rendben. A B, C és D feedbackje a konkrét tévedést nevezi meg. |
| i03 | *d’* / *des*. | A francia utasítás « » között adja meg a zárt készletet. A *des petits pains* a tábla *Petits pains* rovatából és a *La règle* szakaszból kikövetkeztethető, tehát nem triviális. Az E03 és az E06 jól magyaráz. |
| i04 | *beaucoup de* / *beaucoup des*. | A *de la vitrine* egyértelmű jel. A feedback rendben. |
| i05 | *J’en prends.* / *Je vais en prendre deux.* / *Je n’en veux pas.* / *Nous en avons acheté trois.* | A *vous*-os utasítás mellett a 4. mező tegező helyzetmondatában a *vous avez ouvert* egyértelműen a tanulót és Camille-t jelenti, nem zavart meg. A F01 a kihagyott *je vais*-t nevezi meg, és újrapróbálásra hív. |
| i06 | *Je vais en prendre deux.* / *Nous ne voulons pas en acheter.* | A *Le brouillon* semleges, a két feltétel (*seulement l’erreur*, *tous les autres mots*) világos. Az A01 és az F01–F06 a látott utasításra hivatkozik, és ez meg is áll. |
| i07 s001–s005 | *du*, *du*, *d’*, *des*, *de* | **Elakadás nélkül, de rövidítéssel:** a p08 *Rappel* listája pontosan az s001–s006 sorrendjében sorolja fel a hat célalakot. Az s003–s005-öt a listából olvastam le, nem a mondatból (U-01). |
| i07 s006 | *Je vais en prendre trois.* | A művelet most csak az utasításban áll, amely a „phrase 6”-ra hivatkozik. A JSON-promptban nincs sorszám (U-02). A hiányzó ___ alapján kikövetkeztettem, mit kell tenni. |
| i08 | Üzenetet írtam (*on a déjà pris…*, *tu peux en prendre…*, *le stand du…*). | Az utasítás *Camille et vous* alanya egyértelmű. A francia *Consigne*, a *Contenu du message* és a hat *Y a-t-il…?* kérdés önellenőrzésre használható, a terminuszárójelek segítenek. A D4-es mikropéldákból nem tudtam kész mondatot átemelni Léónak. Az E01 a „hat ellenőrzőkérdésre” utal; ez a francia listán is megtalálható, mert hat kérdés áll ott. |

A magyar feedback új „…” idézése a feedbacket olvashatóbbá teszi. A p06-ban az „en” már nem olvasható „én”-nek. Ezen a ponton a feedback jobban segít, mint az 5. változatban.

---

## Findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| U-01 | MAJOR | p08 *Rappel* (text#0 + list#1) → i07 s001–s006 | A lista az itemek sorrendjében adja meg mind a hat célalakot, így a kiegészítés jelentésértés nélkül, sorrendi párosítással megoldható. Ez érvényteleníti az i07 diszkriminációját, pedig az utasítás ezt mondja: *Les six phrases ne testent pas toutes la même règle*. Az s005-nél a lista csak a „beaucoup de” alakot hozza, a „beaucoup des”-t nem, így a *de*/*des* választás elveszíti a tétjét. A hiba nem a T27-körben keletkezett, a mostani anyagban is így áll. | A *Rappel* listája: partitív „du” → s001 *du miel*; „de + le” → s002 *du métro*; „d’ elöl álló melléknév előtt” → s003 *d’immenses*; „des petits pains” → s004; „beaucoup de” → s005; „en infinitif előtt” → s006. | Kéziratjavítás a blokkírónál, a CEO-n keresztül; a kulcs és a megoldás nem változik. Két lehetőség: (a) a lista csak a négy döntéspárt nevezze meg, az itemekétől eltérő sorrendben: „du” partitív ↔ „de + le”; „de/d’” ↔ „des petits pains”; „beaucoup de” ↔ „beaucoup des”; „en” helye; (b) a listaelemek sorrendjét keverjük meg, és a 4. sorba kerüljön a pár is. **Recheck:** UE, és a PE a kimásolhatóság miatt. |
| U-02 | MINOR | i07-s006, utasítás + prompt | Az N-03 után az s006 műveletét csak a *Pour la phrase 6…* mondat adja meg. A JSON-ban a subitemek külön itemek, és promptjukban nincs sorszám (MO-F04 (1)). Ha a megjelenítő nem számozza őket, a tanuló az s006-nál nem látja, hogy ez a „6. mondat”. A hiányzó ___ alapján ki lehet következtetni, de ez mellékes jelzésből való következtetés. | Az s006 promptja: *Dimanche, 8 h 45. La boulangère : … Tu réponds : Je vais prendre trois parts de flan.* Szám és műveletjelölés nélkül áll. | A promptok elejére kerüljön sorszám („1.”–„6.”), vagy a CEO igazolja, hogy a megjelenítő számozza a subitemeket. A műveletet ne tegyük vissza a stimulusba, mert az ellentmondana a terv D1 2. szabályának. **Recheck:** UE, CEO. |
| U-03 | MINOR | p02–p06 *À comparer* / *Contre-exemples* és az utánuk álló magyar `note` | A D2 szerinti bontás miatt a magyar indoklás külön, sorszámozott szövegben áll, a francia lista pedig sorszám nélküli. Telefonon a tanulónak görgetve, darabszám alapján kell párosítania. A p06-ban négy ✗ incorrect sor és négy indoklás áll egymás alatt, itt a legnehezebb követni. | Például a p06 list#4 bejegyzései sorszám nélküliek, a text#5 pedig „1. … 4.” sorszámozású (MO-T27-01). | A lista is legyen sorszámozott (például „1. Elle va commander en six. — ✗ incorrect”), vagy minden sor kapjon saját `note`-ot. A szöveg nem változik. **Recheck:** UE, CEO-leképezés. |

**A hatókörön kívül, súly nélkül, a NavE-nek:** a JSON-ban a rubrika A területének `requirements` tömbje most hét elemből áll. A 0. elem a „1 point par critère…” bevezető mondat, utána következik a hat kritérium. A régi változatban a hat kritérium állt hat elemben. Ha a pontozás vagy a tanácsadó AI elemszám szerint dolgozik, ez elcsúsztathatja az értékelést.

**Becsült idő (csak becslés):** 35–45 perc. Ez illeszkedik a 34–45 perces kerethez. A francia keretszövegek nagyjából 2–3 perccel növelik az olvasási időt a lassabban olvasó tanulónál.

---

## Összegzés

- **Változáslista:** nincs; ellenőrként nem módosítottam az anyagon.
- **Findingok:** 1 MAJOR (U-01, kéziratoldali, a T27 előtt keletkezett), 2 MINOR (U-02, U-03).
- **Hiányok:** nem tudom, hogy a megjelenítő számozza-e a subitemeket (U-02). Képernyőn nem teszteltem, a telefonos megjelenést csak a szöveg alapján becsültem.
- **Bizonyíték:** új. Kulcs nélküli megoldás az i01–i08 itemeken az új francia utasításokkal, majd összevetés a kulccsal, a feedbackkel és a JSON tanulói szövegeivel. Webes forrást nem használtam, nem volt rá szükség.
- **Verdikt a hatókörömre:** REVISION_REQUIRED (U-01). A megoldásírónak nincs kötelező javítása; az U-01 javítása a blokkíróé a CEO-n keresztül, az U-02 és az U-03 a CEO leképezésén múlik.
- **Következő címzett:** CEO.

**Tanulság:** egy „vegyes előhívás” blokk előtt álló emlékeztető lista ne kövesse az itemek sorrendjét, és csak döntéspárokat nevezzen meg, ne a kulcsalakot. Különben a lista kulcsként olvasható. Javasolt hatókör: minden vegyes ismétlő (*rappels mélangés*) oldal.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 2
GEPI_OSSZEGZES_VEGE