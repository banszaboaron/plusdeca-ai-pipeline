# UE: U21 (w01-u-2-1, GI2), tanulói végigjárás, megoldási fázis, T27 nyelvi kör

**Szerep és megbízás:** UE, független ellenőrzés. A CEO által kiadott megbízás alapján vizsgálom, hogy az itemek tanulóként megoldhatók-e, a választás egyértelmű, de nem triviális-e, és a feedback segít-e.

**Bemeneti változat:**
- a megoldás T27-es változata (MO-T27);
- a BLOKK_JSON tanulói szövegei;
- a befagyasztott T27-es kézirat (kontextusként);
- a GR-terv 2. változata (kontextusként).

**Hatókör:** i01, i02, i03, i04, i05-s001…s004, i06, i07-s001…s006 és i08-s001: kulcs, elfogadott alakok, feedback és rubrika, valamint a tanulói nézetben látható utasítás és válaszmód. A p01 *tu*/*vous* váltását az MO-T27 újraellenőrzési listája miatt röviden szintén megnéztem.

**NEM VIZSGÁLT:**
- a francia és a magyar helyesírás, tipográfia és természetesség (NyE/HE);
- a 14 kontrasztcímke szakmai helyessége (PE);
- az MO-T27-01 döntése a v5-ről (NavE/CEO);
- a tényleges app-renderelés és a CAP-correction mód működése (nincs hozzáférésem, csak a JSON-szöveget láttam).

**Újraellenőrzés:** ez az első UE-kör erre a megoldásra, ezért nincs korábbi findingom, amelyet FIXED/OPEN szerint kellene minősítenem.

---

## Végigjárás itemenként

Minden itemet előbb kulcs nélkül oldottam meg, csak utána néztem meg a kulcsot. Az elakadást telefonon tanuló, lassabban olvasó, gyakran hibázó tanuló szemével nézem.

| Item | A saját megoldásom | Hol akadtam el vagy mit próbáltam |
|---|---|---|
| i01 | 1 = partitív (az *acheter* tárgya); 2 = *de + le* (*à côté de* + *le parc*) | Egyezik a kulccsal. Az F01–F03 jól célzott. |
| i02 | A (*du*) | Egyértelmű. A *que tu m’as conseillé* azonosít, a distractorok hihetők, a feedback jó. |
| i03 | *d’* / *des* | Egyezik. Az F01 lépcsőzetesen vezet („Magánhangzó előtt milyen alakban?”), ami jó. |
| i04 | *beaucoup de* / *beaucoup des* | Egyezik. A *de la vitrine* jól látható jelzés. |
| i05-s001 | *J’en prends.* | Ezután szándékosan udvariassági kerettel is megpróbáltam: *Oui, j’en prends, s’il vous plaît.* A megoldás ezt nem fogadja el, a tanuló pedig a generikus feedbacket kapja: „Hová kerül [az en] ragozott ige mellett?” (UE-01) |
| i05-s002 | *Je vais en prendre deux.* | Az *Oui, je vais en prendre deux, s’il vous plaît.* nincs elfogadva, pedig a két összetevője külön-külön el van fogadva (UE-01). |
| i05-s003 | *Je n’en veux pas.* | A *Merci, je n’en veux pas.* és a *Non, je n’en veux pas, merci.* nincs elfogadva (UE-01). |
| i05-s004 | *Nous en avons acheté trois.* | A helyzet szó szerint udvarias magyarázatot kér, ezért *Excusez-moi, nous en avons acheté trois.* lett a válaszom. Ez nincs elfogadva, csak a *Bonjour, …* (UE-01). Az *On en a acheté trois* N01-feedbackje zavaros (UE-04). |
| i06 | *Je vais en prendre deux.* / *Nous ne voulons pas en acheter.* | A megoldás egyértelmű, a feedback (F02, F04, F07) kifejezetten jó. A válaszmód ellentmondásos: az utasítás „Écrivez…”, a JSON viszont `mode: find` (UE-06). |
| i07-s001 | *du* | Rendben. |
| i07-s002 | *du* | Megpróbáltam a *de*-t is (*sortie de métro* kollokációként). Az F01 jól magyarázza a megnevezett állomást. |
| i07-s003 | *d’* | Rendben. |
| i07-s004 | *des* | Rendben. Az „incorrect” („Melyik rovat alá írta…?”) jó tipp. |
| i07-s005 | *de* | A p05 szabálya szerint („a csoportot egy bővítmény azonosítja”) a *de pain* bővítménynek látszik, ezért kipróbáltam a *beaucoup des* választ. A feedback nem mondja meg, miért nem csoportot megnevező bővítmény a *de pain* (UE-03). |
| i07-s006 | *Je vais en prendre trois.* | Az *Oui, je vais en prendre trois.* nincs elfogadva, pedig az s002-ben ugyanez a keret elfogadott (UE-01). Önálló itemként a „Pour la phrase 6” csak akkor érthető, ha az app számozza a mondatokat (UE-02). |
| i08 | Saját 7 mondatos üzenetem lefedte a hat kritériumot és a tartalmi listát. | Nehézség: a 6 tartalmi és 6 nyelvi elem 6–8 mondatban sűrű, de a modellek mutatják, hogy megoldható. A rubrika D területén a beadás után derül ki, hogy a francia tipográfiát is pontozzák (UE-05). |
| p01 | – | A *Le décor* (tegező) és a *Vos objectifs* (*vous*) külön címmel áll; a „Quand tu dis « nous », c’est Camille et toi” rögzíti a *nous* jelentését. A váltás nem zavaró. Nincs finding (NOTE-3: rendben). |

## Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Újraellenőrzés |
|---|---|---|---|---|---|---|
| UE-01 | MAJOR | i05-s001…s004, i07-s006 (`solution.alternatives`) | Helyes válaszokat elutasít a rendszer, mert az elfogadás felsorolásos, nem szabályalapú. A tanuló ezekre félrevezető, az *en* helyét firtató generikus feedbacket kap. | A normalizálás csak a kis- és nagybetűt, a mondatvégi írásjelet és a szóközt kezeli. Nincs elfogadva például: *Oui, je vais en prendre deux, s’il vous plaît.* (s002; az „Oui,” és a „, s’il vous plaît” külön elfogadott); *Oui, je vais en prendre trois.* (s006; az s002-ben elfogadott); *Merci, je n’en veux pas.*, *Non, je n’en veux pas, merci.* (s003); *Excusez-moi, nous en avons acheté trois.*, *Bonjour, on en a acheté trois.* (s004, ahol a helyzet kifejezetten udvarias magyarázatot kér); *Oui, j’en prends, s’il vous plaît.* (s001). | Elfogadási szabály: a magmondat egyezzen a kulccsal vagy egy N-alternatívával; elöl és hátul megengedett az udvariassági vagy válaszkeret (*oui / non / merci / non merci / bonjour / excusez-moi / pardon / s’il vous plaît*), vesszővel vagy ponttal elválasztva. Az s002 és az s006 kerete legyen azonos. | NavE (a kulcs nem változik), és UE-recheck az öt subitemen |
| UE-02 | MINOR | i05-s001…s004 és i07-s001…s006 `instruction` + `prompt` | A szétbontás után minden i05-subitemen az „Écrivez quatre réponses complètes.” áll, egyetlen mezővel. Az i07-promptokban nincs mondatszám, így önálló itemként a „Pour les phrases 1 à 5 / Pour la phrase 6” nem köthető az aktuális mondathoz. | A JSON-ban az i05-s00x és az i07-s00x `instruction` mezője szó szerint ismétlődik, a `prompt` szám nélkül kezdődik. A TANULOI_NEZET számozott, a JSON nem. | Az i05-ben „Écrivez une réponse complète.” álljon subitemenként, vagy a közös utasítás egyszer, csoportszinten jelenjen meg. Az i07-ben a prompt elejére kerüljön a sorszám („1.” … „6.”), vagy a subitem kapjon saját utasítást („Écrivez la forme qui manque.” / „Remplacez … par « en » …”). Feltételes: ha az app csoportosan és számozva renderel, NOTE. | CEO (leképezés), NavE |
| UE-03 | MINOR | i07-s005 `feedback.targeted[0]` (*des*) és `feedback.incorrect` | A tanuló a p05 szabályát gépiesen alkalmazza („a csoportot egy bővítmény azonosítja”), és a *de pain*-t ilyen bővítménynek veszi. Sem az F01, sem az „incorrect” nem mondja meg a különbséget, sőt az „incorrect” kérdésére („Megnevez-e bővítmény egy meghatározott csoportot?”) a tanuló jóhiszeműen igennel felel. | A p05 példáiban a csoportot azonosító bővítmény mindig névelős (*du dimanche*, *du quartier*, *de la vitrine*); a *de pain* névelőtlen, csak fajtát jelöl. Ezt sehol nem mondja ki semmi. | Az F01 legyen például: „A „de pain” csak azt mondja meg, milyen fajtáról van szó; nem jelöl ki egy ismert csoportot. Hasonlítsd össze: „les tartes de la vitrine” → névelős, konkrét csoport.” Az „incorrect” legyen: „A „de pain” csak fajtát jelöl, vagy egy konkrét, névelővel megnevezett csoportot?” | PE (a szabály helyessége), UE |
| UE-04 | MINOR | i05-s004 `feedback.targeted[0]` (N01, *On en a acheté trois.*) | A feedback logikája megfordul: a tanuló „on”-t írt, a szöveg viszont a „nous” gondozottságával zár: „ezért az is maradhat”. Nem világos, mire vonatkozik az „az”, és a tanuló nem tudja meg, érdemes-e átírnia a választ. | „A kiinduló mondat „nous”-t használt, és udvarias reklamációban a „nous” egy kicsit gondozottabb, ezért az is maradhat.” | Javaslat: „Helyes, és beszédben természetes. A kiinduló mondatban „nous” állt; udvarias reklamációban ez kicsit gondozottabb, ezért érdemes megtartani.” | UE |
| UE-05 | MINOR | i08 rubrika, D terület, 2. elem | A tanuló a beadás előtt nem tudja, hogy a francia tipográfiát (szóköz a ? ! előtt stb.) pontozzák. A brief, a *Contenu* és az *Avant d’envoyer* lista sem említi. Telefonon, SMS-regiszterben a tanuló nem számít rá, ezért a pontvesztés meglepetés, és nem tanulási cél. | A Consigne csak a Destinataire, Registre, Objectif és Longueur sorokat tartalmazza; a rubrika a beadás után látszik, és benne áll: „typographie française : apostrophes, espaces, ponctuation (1 point)”. | (a) Kerüljön egy sor az *Avant d’envoyer, vérifiez* listába (pl. „Avez-vous mis une espace avant « ? » et « ! » ?”), vagy (b) a D2 pont helyén álljon egy, a tanuló által előre látott kritérium. Döntés: megoldásíró/GR; a pontszám nem változik. | NavE (a rubrika 1:1), UE |
| UE-06 | MINOR (feltételes) | i06 válaszmód (MO-T27-05) | Az utasítás („Écrivez les deux phrases corrigées.”) és a kézirat válaszmódja („két javított teljes mondat”) írást kér, a JSON viszont CAP-correction `mode: find`, karakterpozíciós kijelöléssel. Ha a felület kijelölést kér, a tanuló nem tudja, mit csináljon. Ha pedig a kulcs a kijelölt szakasz azonosítója, a beírt mondatra adott F-feedback nem tud lefutni. | MO-T27-05 (a megoldásíró maga jelzi a bizonytalanságot); a JSON-ban `prompt: Le brouillon`, a szöveg pedig a `response.text` mezőben áll. | A CEO döntse el a válaszmódot. Ha a felület kijelöl és ír, az utasítás nevezze meg mindkét lépést (pl. „Touchez les deux phrases fausses, puis écrivez-les corrigées.”). Ha csak ír, a mód ne `find` legyen. Ha a játszhatóság igazolt, és a felület írást kér, a finding NOTE-ra csökken. | CEO (séma), NavE, UE |

**NOTE-ok (nem kötelezők):**
- **NOTE-A (i08, szintek):** egy 22 pontos megoldás, amelyben B = 4 (A 12, C 4, D 2), egyszerre lehet *excellent* (22–24) és *partiel* („17 points et plus sans les conditions de « atteint »”). Ezt a NavE nézze meg; a tanulóra csak akkor hat, ha a pontozás után kapott szintcímke ellentmondásos.
- **NOTE-B (p01, NOTE-3):** a *tu*/*vous* váltás a végigjárásban nem okozott félreértést, teendő nincs.
- **NOTE-C (becsült idő, BECSLÉS):**
  - p01: 2 perc; p02 + i01: 5; p03 + i02: 3; p04 + i03: 5; p05 + i04: 3; p06 + i05: 7; p07 + i06: 5; p08 + i07: 6; p09 + i08 + a modellek: 12–15.
  - Összesen kb. 48–51 perc lassabb, telefonon tanuló felhasználónak, ami a megadott 34–45 perc felső határa fölött van. Nem mérés.

**Ami jól működik:**
- az i02, i03 és i04 distractorai hihető tanulói tévedésre épülnek;
- az i03-F01 és az i07-s004 „incorrect” lépcsőzetesen vezeti a tanulót;
- az i06 F02, F04 és F07 pontosan megmondja, mi a hiba, és nem árulja el a kulcsot;
- a *Je vais vous en prendre* elfogadása (i05) és elutasítása (i06) a tanuló számára következetesen meg van indokolva.

---

## Átadás

**Változáslista:** nem módosítottam semmit; ez csak ellenőrzés.

**Findingok:** 1 MAJOR (UE-01), 5 MINOR (UE-02 – UE-06), 3 NOTE. A javítás a megoldásíróé (UE-01, 03, 04, 05) és a CEO-é (UE-02, 06).

**Hiányok:**
- a tényleges app-renderelés (a subitemek számozása, a CAP-correction mód) NEM ELÉRHETŐ, ezért az UE-02 és az UE-06 feltételes;
- a v5 nincs meg, ezért a „csak tipográfia” állítás ellenőrzése nem az én hatásköröm.

**Döntési kérdés:** nincs.

**Bizonyíték:** új, saját megoldás kulcs nélkül, valamint célzott próbák elfogadott és nem elfogadott változatokkal. Webes forrást nem használtam, és nem volt rá szükség.

**Következő címzett:** CEO.

**Tanulság:** a felsorolásos elfogadási lista a keretszavak kombinációit (*oui*, *merci*, *s’il vous plaît*) kihagyja → a magmondatot kell egyeztetni, a megengedett keretet szabályként leírni → így nem lesz elutasítva helyes válasz → minden transzformációs (teljes mondatos) itemre.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 5
GEPI_OSSZEGZES_VEGE