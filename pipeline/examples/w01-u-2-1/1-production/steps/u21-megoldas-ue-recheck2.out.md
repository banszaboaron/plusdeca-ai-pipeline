# UE-recheck: U21 (w01-u-2-1), Megoldás fázis, 3. változat

**Szerep:** UE, tanulói végigjárás, recheck
**Bemenet:**
- a megoldásíró 3. változata (kulcs, kategóriaszabály, semleges `incorrect`, feedback, TANULOI_NEZET, E-01–E-08);
- a befagyasztott kézirat (1. javítási kör);
- a GR terve (2. javított változat);
- a saját előző jelentésem (UE-01–UE-06 és NOTE-ok);
- a PRESIDENT folytatása (2026-11-01).

**Hatókör:** három kérdést néztem:
- megoldható-e tanulóként az i01–i08;
- egyértelmű, de nem triviális-e a választás;
- segít-e a feedback az újrapróbálásban.

Ezen belül csak a 3. változatban módosult részeket ellenőriztem, és amit ezek érintenek: i03, i04-E02, i05, i06, i07-s001/s003/s004/s006, valamint az i08 feltételes sora.

**Nem vizsgáltam:**
- a nyelvhelyességet (NyE) és a tipográfiát (HE);
- a sémát és a P5-leképezést (MO-F04, MO-F06);
- az OQLF-forrást (0.3, segitseg-1, már kérve);
- a PE-03 PRESIDENT-döntést;
- az időkeret metaadatát.

**Függetlenség:** a 3. változat több ponton az én korábbi javaslatomat vette át:
- az UE-01 kategóriaszabályát és a semleges, nem „incorrect” jelzést;
- az UE-06 i03-N01-ét;
- az i04-E02 új mondatát;
- az E-04 stimulusát.

Ezeket a szabály szerint nem én zárom le. A CEO adja őket másik ellenőrnek:
- a kategóriaszabályt és az i03-N01-et a független megoldónak és a NavE-nek;
- az i04-E02-t a NyE-nek;
- az E-04-et a független megoldónak és a NyE-nek.

Ezeknél csak azt mondom meg, hogy tanulói szemmel megszűnt-e az eredeti probléma.

---

## Végigjárás (a változott itemek)

Mindegyiket előbb kulcs nélkül oldottam meg, utána néztem meg a kulcsot és a feedbacket.

| Item | Saját megoldásom és kipróbált változatok | Mit kap a tanuló | Értékelés |
|---|---|---|---|
| i03 | *d'* ; *des*. Kipróbálva: *ses … ses*, *quelques … quelques*, *du* (1. hely) | *ses*/*quelques* → N01: „helyes mondat, itt a de/d'/des döntést gyakorlod”. A *du* a semleges `incorrect` szöveget kapja. | Jó, a tanuló nem kap hibaüzenetet helyes válaszra. |
| i04 | *beaucoup de* ; *beaucoup des*. Kipróbálva: a 2. helyre *beaucoup de* | E02 (átírva): „…élőszóban is « beaucoup des » a helyes” | Már nem mond ellent annak, hogy a stimulus élőbeszéd. Az állítás igazságát a NyE nézze meg. |
| i05 | kulcsmondatok. Kipróbálva: *Oui, j'en veux bien.* · *Non merci, je n'en prends pas.* · *Nous en avons pris trois.* · *J'en prends deux.* · *Je vais en prendre deux, merci.* | N05, N06, illetve a záró elemre vonatkozó szabály szerint elfogadva | Jó. Az N05 egyértelműen megmondja, mit kell másképp csinálni („tartsd meg a kiinduló mondat igéjét”). |
| i06 | kulcs. Kipróbálva: *On n'en veut pas.* · *Nous ne voulons pas en prendre.* · *Je vais en réserver deux.* | N01, illetve N06 | Jó. A helyes válasz nem kap büntetést, és a feedback megmutatja a szerkezet megtartását. |
| s001 | *du*. Kipróbálva: *plein de*, *pas mal de*, *énormément de*, *je mets du miel* | Az első kettő N01-et kap. Az *énormément de* a semleges `incorrect` szöveget kapja, ez rendben van. **A *je mets du miel* a semleges `incorrect` szöveget kapja: „Ha mennyiségszót írtál…”** | A teljes mondatos válasz nincs kezelve, lásd **UE-07**. |
| s003 | *d'*. Kipróbálva: *quelques*, *plusieurs*, *trente* | N01, illetve a semleges szöveg | Jó. |
| s004 | *des*. Kipróbálva: *quelques*, *six*, *vingt-quatre*, *du* | N01. A *vingt-quatre* és a *du* a semleges szöveget kapja. | Jó. A stimulus még mindig élőbeszéd, lásd UE-03. |
| s006 | kulcs. Kipróbálva: *Oui, je vais en prendre trois.* | elfogadva (bevezető szabály) | Jó. |
| i08 | csak a feltételes „Nem elegendő” sort néztem | – | A tanuló nem látja. A tanulói ellenőrzőlista nem változott, lásd UE-04. |

---

## A korábbi findingok státusza

| ID | Eredeti súly | Státusz | Indok |
|---|---|---|---|
| UE-01 | MAJOR | **FIXED** tanulói szempontból. A formális lezárás másik ellenőré. | Az eredeti probléma az volt, hogy a tanuló hibaüzenetet kapott helyes válaszra. Ez megszűnt. A gyakori helyes, nem célzott alakok (*plein de*, *pas mal de*, *quelques*, *plusieurs*, *nos*, *ces*, a számnevek) most N01-et kapnak. A felsorolásból kimaradó alakokra a semleges `incorrect` szöveg jön, amely nem mondja hibásnak a választ, és célzott kérdéssel hív újrapróbálásra. Két maradék nem az én hatásköröm: a gép a felismeretlen választ nem egyezőnek könyveli (MO-F06, CEO), és a végleges megoldás az E-01. A kategóriaszabály az én javaslatom volt, ezért a lezárást a független megoldó vagy a NavE adja. |
| UE-02 | MINOR | **FIXED** (változatlan) | Az N01 bővült, az N06 új. Nincs visszalépés. |
| UE-03 | MINOR | **OPEN** (nem blokkol) | A kézirat nem változott. Az s004 továbbra is élőbeszéd (*La boulangère : « … on a fait ___ … »*), ezért a *des* a regiszterből is kijön. A javítás az E-04 (ESCALATED), amelyet az én javaslatom miatt másik ellenőr néz meg. |
| UE-04 | MINOR | **OPEN** (ESCALATED: E-06) | A TANULOI_NEZET-ben továbbra is ez áll: *„5. Van-e en ragozott ige előtt?”*. Telefonon ez „én”-nek olvasható. A megoldásíró helyesen továbbította: a kézirat jelölése vagy a CEO-leképezés feladata. |
| UE-05 | MINOR | **FIXED** (szerzői állítás) | Változatlan. A lezáráshoz a PE független rechecke kell. |
| UE-06 | MINOR | **FIXED** tanulói szempontból. A formális lezárás másik ellenőré. | A *ses* és a *quelques* N01-et kap, a többi a semleges `incorrect` szöveget. Az i03-N01 az én javaslatom volt, ezért a lezárás a független megoldóé. Az opcionális E-08 tovább szűkítené a választható alakokat. |

**NOTE-ok az előző körből:**
- **i04-E02:** FIXED. Tanulóként már nem érzek ellentmondást. A mondat az én megfogalmazásomat követi, ezért a NyE erősítse meg.
- **i05 (K3):** FIXED. Az N05 lefedi.
- **i06 (*On n'en veut pas*, *réserver*):** FIXED. N01 és N06 lefedi.
- **i08, 5. kérdés:** ESCALATED (E-07). Rendben van.
- **Időbecslés:** változatlanul kb. 43–54 perc. Ez becslés, nem mérés. Az ESCALATED állapot marad.

---

## Új finding

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| UE-07 | MINOR | i07-s001–s005, elfogadási szabály (1. rész, „Hiánykitöltő mező”) | Ha a tanuló a kiegészített mondatrészt vagy a teljes mondatot írja be, a válasza nem egyezik, pedig a célalakot helyesen választotta. A semleges `incorrect` szöveg ilyenkor értelmetlen neki („Ha mennyiségszót írtál…”), és a második próba után kulcsként ugyanazt látja, amit beírt. Az i03 és az i04 elfogadja a teljes mondatot, az i07 nem, tehát a kezelés következetlen. | A tanuló ezt az instrukciót látja: *Complète ou transforme chaque phrase.* / *Réponds aux six questions.* A TANULOI_NEZET nem mondja meg, hogy csak a hiányzó alak kell; a válaszmód csak a szerzői részben szerepel. Kipróbálva: s001 *je mets du miel* ; s002 *à la sortie du métro* ; s005 *beaucoup de variétés de pain*. Az s001 elfogadott alakja csak a *du miel*, a szabály pedig csak a hiány utáni szavakat engedi. Az s002 elfogadott alakja csak a *du métro*. | Fogadja el a kiegészített stimulus bármely összefüggő szakaszát, amely a hiány helyén a kulcsot tartalmazza, a teljes idézett mondatig, ugyanazzal a normalizálással, mint az i03 és az i04. Ha a gép ezt nem tudja kezelni, a gyakori előtagokat sorolja fel (*je mets du miel*, *la sortie du métro*, *nous cuisons d'immenses…*, *on a fait des petits pains…*, *beaucoup de variétés…*). Az E-01 bevezetése ezt is megszünteti. | független megoldó |

---

## Összegzés

**Mi működik tanulói szemmel:**
- Helyes válaszra már egyik vizsgált itemben sem jön hibaüzenet. A „helyes, de nem célzott” jelzés (N01, N05, N06) mindig megnevezi a gyakorolt döntést.
- A semleges `incorrect` szövegek feltételesen fogalmaznak („ha … írtál”), és célzott kérdéssel hívnak újrapróbálásra. Valódi hibánál (pl. s003 *du*, s004 *du*) sem félrevezetők, mert a „Ez nem a várt alak” nyitás egyértelmű.
- Az i05-ben és az i06-ban a K3 szerinti eltérő igéjű válaszok kezelése érthető, és nem büntet.

**Nyitott, nem blokkoló:**
- **UE-03** az E-04-től függ.
- **UE-04** az E-06-tól (kézirat vagy CEO-leképezés).
- **UE-07** a megoldásíróé.

**Hova megy:**
- **Megoldásíró:** az UE-07.
- **CEO, kézirat-, illetve leképezési szinten:** az E-04 (UE-03), az E-06 (UE-04) és a MO-F06.
- **Másik ellenőr, mert az én javaslatomra épülnek:**
  - a kategóriaszabály és az i03-N01: független megoldó és NavE;
  - az i04-E02: NyE;
  - az E-04: független megoldó és NyE;
  - az UE-05: PE.

**Bizonyíték:** csak a csatolt anyag és a saját, kulcs nélküli tanulói megoldásaim. Webes forrást nem nyitottam meg, és segítséget nem kérek (a segitseg-1 már folyamatban van).

**Recheck-hatókör legközelebb:**
- az i07-s001–s005 elfogadási szabálya (UE-07);
- az E-04 után az s004;
- az E-06 után az i08 ellenőrzőlistája.

**Tanulság:** a hiánykitöltő itemeknél az elfogadás csak „alak + utána álló szavak” → a tanuló, aki a kiegészített mondatot írja be, nem egyező választ kap → az elfogadás a kiegészített stimulus bármely, a kulcsot tartalmazó szakaszára vonatkozzon → minden olyan hiánykitöltő item, amelynek a tanulói instrukciója nem mondja ki, hogy „csak a hiányzó alakot írd”.

**Verdikt:** a hatókörömben nincs nyitott BLOCKER vagy MAJOR. Ez a REVIEW_PASS csak az UE-hatókörre szól. Az UE-01, az UE-06 és az i04-E02 formális lezárásához kell a fent megnevezett másik ellenőrök rechecke.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 3
GEPI_OSSZEGZES_VEGE