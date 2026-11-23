# NavE-ellenőrzés: U21 (w01-u-2-1, GI2), új kézirat

**Megbízás:** NavE, független ellenőrzés a Kézirat fázisban. Ez újraellenőrzés: a korábbi BLOCKED_EVIDENCE (E1) a PRESIDENT folytatásával feloldódott.

**Bemeneti változat:**
- az U21 új kézirata (2026-11, DRAFT_FOR_REVIEW);
- a GR 2. javított terve;
- a javítási brief;
- a régi `week-01.json → units[w01-u-2-1]`;
- a tanári kifogások;
- a `decisions/folytatas.md` (2026-11-01).

**Hatókör:**
- A terv minden eleme és minden item- és subitem-ID tényleges szöveggel elkészült-e.
- Megmaradtak-e a mérési célok és a célalakok.
- Van-e VÁLTOZÁSNAPLÓ tanári kifogásonként.

A nyelvhelyesség, a szakmai minőség, a kulcs és a rubrika nem tartozik a hatókörbe. Ahol ilyet láttam, NOTE-ként adom tovább.

**Korábbi findingok:** a korábbi NavE-jelentésből csak az E1 ID-ja szerepel a bemenetemben (a folytatás hivatkozik rá). A többi korábbi findinget („NavE MINOR”) nem kaptam meg, ezért azok ID-jét nem tudom megtartani. Az új findingok K-előtagot kapnak, hogy ne ütközzenek velük.

---

## 1. Korábbi finding

| ID | Állapot | Bizonyíték |
|---|---|---|
| E1 (a 0.1 kapu: kanonikus kimenet) | **FIXED** | A folytatás szó szerint idézi a `kanonikus/valtozasok.json` B3-sorát: `"changed": []`, és a CL-alapban már a javított i04-instrukció áll. Az U21-re a kanonikus változat azonos a régi `week-01.json`-nal, így a célalakokat helyesen mérte a CL-alaphoz. A kézirat i04-instrukciója („Complète avec « beaucoup de » ou « beaucoup des »”) ezzel egyezik. |

## 2. Lefedés: terv → kézirat (ID-nként)

| Elem | Hol teljesül | Célalak vagy előírás | Állapot |
|---|---|---|---|
| p01 | keret 3 mondatban, szerepjáték jelezve, 4 cél | a régi kulcspéldák kikerültek (3.5) | ✔ |
| p02 + i01-s001 | 10:00-s SMS-jelenet, magyarázat, 4 példa, kontraszt (*Je bois de café* marad); i01: *acheter* + kenyér, *à côté du parc* | partitív ↔ *de + le*; a 3.5 tiltásai betartva | ✔ |
| p03 + i02 | magyarázat (*revenir du marché*, *sortir du lit*, *prix du*); i02: 8:15, *revenir de* + kávézó, a bővítményben nincs *du* | **du**; az A–D opciók megvannak | ✔ (helyzetjelző: K1) |
| p04 + i03 | ardoise, szabály, *des petits pois / grands-parents / petits pains*, kulturális sorok, *même si*; i03: ajánló rovat | **d'excellents** + **des petits pains** | ✔ (K2, K5) |
| p05 + i04 | emberek: *beaucoup de gens* ↔ *habitués du dimanche*, *tandis que*; i04: a kirakat termékei, a két alak az instrukcióban | **beaucoup de ; beaucoup des** | ✔ |
| p06 + i05-s001 | pultjelenet, négy szabály más igékkel; i05 négy mezője helyzettel | **J'en prends. / Je vais en prendre deux. / Je n'en veux pas. / Nous en avons acheté trois.** | ✔ (a 3. mező áthelyezése jelölt eltérés, elfogadható: 9:30, egyezik az s001-gyel) |
| p07 + i06 | szombat 20:12, Léo kérdése, saját piszkozat; a két kulcsmondat funkciója kimondva (N7) | **Je vais en prendre deux. / Nous ne voulons pas en acheter.** | ✔ |
| p08 + i07-s001…s006 | hat mikrohelyzet az idővonalon, metanyelvi keret nélkül | **du / du / d' / des / de / Je vais en prendre trois.** | ✔ mind a hat |
| p09 + i08-s001 | 10:15, válasz Léónak; a hat új tartalmi elem; hat ellenőrzőkérdés nem kimásolható mikropéldával; két eltérő hangú modell, partitív anyagnévvel (N13) | a hat `allCriteria` változatlan; mindkét modell lefedi (saját ellenőrzés), minden *en*-nek van előzménye | ✔ (K3) |
| 3.5 mátrix (tiltó oszlop) | soronként összevetettem a p01–p08 példáival | nincs kimásolható kulcs; az i05-2 és az i06 közös kulcsa a terv szerint megengedett | ✔ |
| 3.4 terhelés | helyzetjelzők, kontextushossz, időbecslés (34–45 perc, jelölve) | – | részben (K1) |
| Kanonikus B3 / B4 / B6 / C1 / C4 | i04, i05-3, s006, p06 | – | ✔ |
| VÁLTOZÁSNAPLÓ | megvan, kifogásonkénti táblával | – | részben (K4) |
| Forrásláncok (0.2) | S2 és S3 csak keresési kivonat | – | K5 |

A mérési célok mind megvannak. Mind a 8 manifest-cél és a `w01-g-de-quantity-subset` „Mit mér” sorral szerepel az itemeknél. Minden item és subitem tényleges tanulói szöveget, mérési szándékot és válaszmódot kapott, hiányzó vagy „ide jön” jellegű rész nincs.

## 3. Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| K1 | MINOR | p03 (oldalszint); a VÁLTOZÁSNAPLÓ „Helyzet” sora | A terv 3.4 pontja szerint minden oldal tetején helyzetjelző áll. A p03-on nincs ilyen, és a p08 és a p09 oldal sem kap oldalszintű jelzőt. A napló ennek ellenére azt állítja: „Minden oldal tetején egysoros helyzetjelző áll.” | A p03 helyzetjelzője csak az i02-nél van. A p08-on csak a subitemeknél, a p09-en csak az i08 stimulusában. | Adjon egysoros jelzőt a p03-nak (pl. *Dimanche matin, entre le marché et le café*). A p08-on egy összefoglaló jelző is elég (*Ton week-end en six moments*). Ha a p09-en elég a stimulus első sora, a napló ezt mondja ki pontosan. | p03 fejléc, napló |
| K2 | MINOR | p04 ardoise (`LE PAIN PERCHÉ — ce dimanche`, „a bejáratnál”) és az oldal helyzetjelzője („Samedi soir… pour demain matin”) | A tanuló szombat este, otthonról, egy ajánló alapján választ. A vasárnapi táblát a bejáratnál nem láthatja. Ez az idővonal sérülése (a terv K10-e szerint a NavE ezt oldalanként ellenőrzi). | A p04 és az i03 helyzetjelzője szombat este; a tábla fejléce „ce dimanche”. | A tábla legyen az ajánló vagy a pékség oldalán látható fotó (pl. *l'ardoise du dimanche, en photo sur le site*), vagy kerüljön ki a „bejáratnál” és a „ce dimanche”. Az s004 (8:45, a tábla előtt) maradhat. | p04 fejléc, s004 összhang |
| K3 | MINOR | p09, B modell („Ce qui manque, c'est du pain pour les œufs brouillés”), részben az A modell | A modellek kenyérkészlete nem egyezik a kerettel. 8:45-kor vettek egy *tradition*-t (p06) és *pain de seigle*-t (i05-1). A B modell szerint 10:15-kor hiányzik a kenyér; az A modell a *tradition*-t nem említi, és két *baguette tradition*-t kér. A szerzői megjegyzés „keret-konzisztenciát” állít. | p06: *une tradition pas trop cuite*; i05-1: *Je prends du pain de seigle*; az A modell csak a seigle-t említi. | Egy félmondat a modellben (pl. *la tradition, on l'a déjà finie avec les œufs*), vagy olyan anyagnévi tétel, amely nem ütközik a vásárlással. Az `allCriteria` lefedése ne sérüljön (a partitív *du pain* maradhat). | p09 modellek |
| K4 | MINOR | VÁLTOZÁSNAPLÓ, „Tanári kifogásonként” tábla | A tanár A-blokkjának két tétele hiányzik: „természetes-e: presque” és „manuel/magazin: non”, illetve a mesterkélt fordulatok. A terv 4. pontjában ez külön sor („Más egységről szól; az elv itt is érvényes”). A hatókör kifogásonkénti naplót kér. | A tábla sorai: általános, trop facile, B3, B4, B6, C1, C4, D1–D3, D5, EU Academy; A-sor nincs. | Egy sor: a kifogás más egység szövegére vonatkozik; az elvet itt a hiteles műfajok (SMS, pult, ajánló) és a reklámnyelv kiváltása (F3) alkalmazzák. | csak a napló |
| K5 | MINOR | p04 ardoise és „Kulturális háttér” (*formule petit-déjeuner* = fix áras csomag: meleg ital + gyümölcslé + viennoiserie); Források S2, S3 | A tartalom FORRÁSALAPÚ SAJÁT SZÖVEG jelölést kapott, de mindkét forrás NEM MEGNYITOTT keresési kivonat. A terv 0.2 kapuja egy valódi *formule* felépítését forrással kérte. Az alapszabály szerint olvasottnak csak a megnyitott forrás számít. A mérést nem érinti, mert a formule nem mért elem. | Források rész: „[S2] … NEM MEGNYITOTT”, „[S3] … NEM MEGNYITOTT”. | Vagy nyissa meg és rögzítse az S2/S3 felhasznált részét (vagy egy valódi pékség kínálatát), vagy jelölje a sorokat SAJÁT SZÖVEG (általános ismeret) címkével, és a 0.2 hiánya maradjon nyitott tételként. | Források, p04 jelölés |

BLOCKER és MAJOR nincs.

## 4. NOTE-ok más ellenőröknek és a CEO-nak

- **A 0.3 kapu nyitott (NyE).** Az OQLF-lapot a terv szerint a NyE nyitja meg. Az i03 és az s004 kulcsindoka (*des petits pains*) ezen múlik, ezért a Megoldás fázis előtt le kell zárni. Ez nem a kézirat hibája.
- **CEO.** Az `objectives` metaadat továbbra is ESCALATED. A `w01-g-de-quantity-subset` manifestbe vételét a terv 2.1 pontja szerint a CEO szkriptje végzi (törölni nem szabad).
- **PE.**
  - p07: a *J'en garde cinq croissants pour Léo* mennyisége Léónak egyedül sok (terv K14).
  - s002: Camille lakótárs, mégis metróval érkezik a saját negyedébe. Ezt a terv adta, de a hihetőségét érdemes megnézni.
  - p02: a félreértés a főnév jelentéséről szól, nem a *du*-ról; ezt a kézirat is kimondja. A pedagógiai hatást a PE ítélje meg.
- **Független megoldó.** A szerző által jelölt pontok: K1 (s001, *le/mon miel*), K2 (i04), az s002-ben a *de métro*, és az i06-ban a *les acheter* és az *on*.

## 5. NEM VIZSGÁLT, hiányzó bemenetek

- A korábbi NavE-jelentés E1-en kívüli findingjai nem voltak a bemenetemben, ezért a státuszukat nem tudom megadni.
- A (2,1)-es GR-kiosztás nem volt a bemenetemben; az `objectives` kérdése ezen múlik.
- Az OQLF-, S2- és S3-forrásokat nem nyitottam meg.
- Szószámot és ID-sémát nem számoltam újra kézzel (szkript feladata).

**Változáslista:** nincs; ellenőrzés volt. **Új bizonyíték:** a 2. pont tételes megfeleltetése és a 3.5 tiltó oszlop soronkénti összevetése a kézirattal. **Újrahasznosított bizonyíték:** a folytatásban idézett kanonikus napló (B3). **Következő címzett:** CEO. A K1–K5 a szerzőhöz megy a szokásos javítási körben, a 0.3 kapu a NyE-hez.

**Verdikt (a megnevezett hatókörre):** REVIEW_PASS. Nyitott BLOCKER és MAJOR nincs; az 5 MINOR a javítási körben kezelhető.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 5
GEPI_OSSZEGZES_VEGE