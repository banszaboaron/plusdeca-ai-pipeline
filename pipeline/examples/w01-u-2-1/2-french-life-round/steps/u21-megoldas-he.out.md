# HE-jelentés: U21 (w01-u-2-1), Megoldás 6. változat, T27 nyelvi kör

**Szerep és megbízás:** a helyesírást és a tipográfiát ellenőrzöm (HE). A megbízás az U21 itemjeinek és megoldásának független ellenőrzése.

**Bemeneti változat:** a megoldás 6. változata (markdown), a hozzá tartozó TANULOI_NEZET, és a BLOKK_JSON-ból vett tanulói szövegek („bájtra a JSON-ból”).

**Hatókör:** a francia és a magyar helyesírás, a tipográfia és a házistílus (idézőjel, aposztróf, szóköz, kis- és nagybetű, írásjel). A tartalmat, a kulcsok helyességét és a nyelvi természetességet nem minősítem.

## Amit átnéztem

**Oldalak:** p01–p09 és p09b. Ide tartozik minden cím, utasítás, helyzetleírás, lesson és note, a 14 kontrasztsor, a p09 briefje és két listája, valamint a modellcímek.

**Itemek:** i01, i02, i03, i04, i05-s001…s004, i06, i07-s001…s006 és i08. Mindegyiknél a következőket néztem át:
- az utasítást és a promptot;
- a feedbacket (`correct`, `incorrect`, `targeted`);
- a mintákat;
- a tanulónak látható kulcsot, mert a második sikertelen próbálkozás után megjelenik.

**Az i08-ban külön:**
- a francia rubrikát (*Grille d'évaluation*, *Niveaux*, *Insuffisant*);
- az R1, R2 és C mintát;
- az E01–E05 feedbacket.

**A megoldás markdownja:**
- az 1. rész (normalizálás, jelölés, feltételes szabály);
- az itemtáblák.

**Nem vizsgáltam:**
- **A nem törő szóköz (U+00A0) tényleges jelenlétét.** A kapott kivonatban a NBSP és a sima szóköz nem különböztethető meg, gépi eredményt pedig nem kaptam. A szerzői állítás (`\u00a0` a JSON-ban) ellenőrizetlen; a gépi CL-ellenőrzés tudja igazolni.
- **A `reason` és a `trigger` mezők nyelvét és stílusát.** Szerkesztői adatok, nem tanulói szöveg.

## Findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| HE-01 | MINOR | `i03 › solution.key.f1`; `i07-s003 › solution.key`; a markdown i03 „Kulcs” sora (`d'`); a rejected szövegek: i03 `d' (2)`, i04 `1 = beaucoup d'`, s004 `d'`, s005 `d'` | Ugyanazon az itemen belül vegyes az aposztróf. A kulcsban egyenes ' áll, az alternatívákban és a feedbackben ’. A kulcs a második sikertelen próba után megjelenik a tanulónak. A megoldás saját D3-szabálya szerint „a francia alakokban ’ áll”. | `"key":{"f1":"d'"…}` és mellette `"alternatives":["d’excellents",…]`; s003: `key: d'`, `alternatives: d’immenses`. A markdown s003 sora viszont már *d’*. | Minden kulcsban és rejected szövegben legyen `d’`. A normalizálás miatt az egyezést ez nem érinti. |
| HE-02 | MINOR | i03-E03 és s004-E01: „(Petits pains rovat)”; I04-E01: „sok viennoiserie maradt”; s003-E03: „tourte-okra”; p04 *Repère culturel*: „például croissant és pain au chocolat”, „és egy viennoiserie” | Magyar szövegben idézőjel nélkül álló francia elemek. Ez sérti a D3 / HE-05 szabályt: a magyar szövegben minden idézett francia elem „…” között áll. | A felsorolt helyeken a francia szó jelölés nélkül áll, a környező francia elemek viszont „…” között. | „(„Petits pains” rovat)”; „sok „viennoiserie” maradt” vagy magyar körülírás; „ismert „tourte”-okra”; „például „croissant” és „pain au chocolat””; „és egy „viennoiserie””. A nyelvtani metaterminusok (*infinitif*, *passé composé*, *participe passé*) jelölés nélkül maradhatnak, ezek szakszavak. |
| HE-03 | MINOR | `i01 › solution.samples[1]` (a beadás után a tanuló látja) | Magyar mondat francia elemekkel, „…” jelölés nélkül. A pontosvessző előtt francia szóköz áll („ ;”), ami magyar szövegben nem helyes. | `1 = partitív (valamennyi kenyér, az acheter tárgya) ; 2 = de + le (à côté de le parc → du)` | `1 = partitív (valamennyi kenyér, az „acheter” tárgya); 2 = „de + le” („à côté de” + „le parc” → „du”)`. A szándékosan össze nem vont alakot jelölni kell, hogy ne tűnjön elütésnek. |
| HE-04 | MINOR | `i08 › solution.criteria[0].label` és a markdown-rubrika A sora | A tanulónak látható francia rubrikacímben gépi metatoken áll. | `A. Critères de langue (allCriteria)` | `A. Critères de langue`. Az `allCriteria` kötése szerzői adat, a megoldás jegyzetébe kerüljön. |
| HE-05 | MINOR | Megoldás markdown, 1. rész, „Feltételes szabály”, 2. pont | Magyar mondatban « » áll „…” helyett, ráadásul kettős szóközzel a nyitójel után. Szerzői szöveg, de ellentmond a saját D3-szabályának. | `lekerül a «  de petits pains » sor` | `lekerül a „de petits pains” sor` |

**NOTE-ok (javítást nem kérnek):**
- **NOTE-1 (a toldalék illeszkedése).** Az „en”-nel / „en”-re alakok az írásképhez illeszkednek. A kiejtés szerint (/ɑ̃/, mély hang) „en”-nal / „en”-ra járna. Mindkét gyakorlat előfordul a szakirodalomban. Ha a ház a kiejtés szerinti illeszkedést követi, egységesen kell cserélni. A ház egyik változatot sem írja elő, ezért nem finding.
- **NOTE-2 (passé composé-ban).** Mivel a „composé” végén ejtett é áll, az AkH szerint a „passé composéban” is helyes, kötőjel nélkül. A mostani alak a teljes egységben következetes, ezért ne változzon egyedileg.
- **NOTE-3 (gondolatjel).** A kontrasztsorokban szóközös nagykötőjel (—) áll, a modellcímekben (*Modèle A – …*) szóközös nagykötőjel helyett (–) félkvirtmínusz. A házistílus döntsön egy alakról; egyelőre egyik sem hibás.
- **NOTE-4 (NBSP).** A NBSP-t nem vizsgáltam (lásd fent); a gépi ellenőrzéssel kell lezárni. Az U+00A0 a házi szabálynak megfelel, keskeny NBSP-t a szabály nem ír elő (IR-T27-04 / MO-T27-02).
- **NOTE-5 (rendben).** Az R2 és a kontrasztsorok szándékos hibái (*de le fromager*, *des bons chèvres*, *Je bois de café.* stb.) a tervezett hibák, véletlen elütést nem találtam bennük.

**Ellenőrzött és rendben:**
- A francia rubrika, a brief, a két p09-lista, az utasítások és a helyzetleírás helyesírása és írásjelei (a NBSP-n kívül).
- Az idézett francia elemek után kötőjellel kapcsolt magyar toldalékok („de”-t, „croissants”-t, „chouquettes”-et).
- A D3 szerinti „…”-csere a feedbackben (HE-02 kivételével); a belső francia « » sehol nem csúszott át.

## Összegzés

- **Változás:** nincs, ellenőrzés volt.
- **Findingok:** 5 MINOR (HE-01–HE-05) és 5 NOTE. BLOCKER és MAJOR nincs.
- **Hiány:** a NBSP gépi eredménye (BLOCKED_EVIDENCE-t nem indokol, mert gépileg ellenőrizhető).
- **Bizonyíték:** az összes új bizonyíték a mellékelt JSON-kivonat és a markdown soronkénti átnézése; korábbi HE-eredményt nem használtam fel.
- **Verdikt:** REVIEW_PASS a HE hatókörében. A MINOR-ok javítását a megoldásíróhoz (HE-01, HE-03, HE-04, HE-05), illetve a kéziratból öröklött szövegeknél a blokkíróhoz is (HE-02: p04 *Repère culturel*) kérem.
- **Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 5
GEPI_OSSZEGZES_VEGE