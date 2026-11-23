# NavE: az U21 Megoldás fázisa, 4. változat (3. recheck)

**Szerep és megbízás:** NavE, a követelmények és a szerkezet ellenőrzése. Ez a Megoldás fázis harmadik ismételt ellenőrzése.

**Bemenet:**
- a GR terve, 2. javított változat;
- a befagyasztott kézirat, benne az E-01–E-08 javításokkal;
- a megoldásíró 4. változata, benne a TANULOI_NEZET;
- az előző NavE-jelentésem (N-01–N-07);
- a PRESIDENT folytatása (2026-11-01).

**Hatókör:**
- Van-e minden item-ID-hoz teljes megoldási adat?
- Egyezik-e a mérési cél a tervvel és a régi itemmel?

A változott részeket néztem: az i03, az i05-4, az i06, az i07 s001–s006, az i08 ellenőrzőlistája és a p04 kontrasztsora. Ezeken kívül csak a nyitott findingok sorait néztem.

**Nem kaptam meg:** a BLOKK_JSON-t, a sémát és a szkript futási kimenetét. A munkakönyvtárban csak a szerepleírás van.

## Röviden

A kulcsok nem változtak, és egyeznek a terv 2. pontjával. Minden itemhez megvan a teljes megoldási adat. Az E-01, az E-02 és az E-08 most már benne van a kéziratban, ezért a determinánscélok mérése kizárólagos lett. Az **N-01 FIXED**, és a PRESIDENT-hez szánt eszkalációra sincs már szükség.

**Egy MAJOR maradt nyitva, az N-07.** Az i06-ban az *en* + infinitif cél már nem kerülhető meg. Az i05 2. mezőjében és az s006-ban viszont a *J'en prends deux/trois* továbbra is levonás nélkül teljesít. Az s006-nak éppen ez a szerkezet a mérési célja, így ott a mérés érvénytelen. A megoldás saját általános szabálya is ellentmond ennek.

## 1. A korábbi findingok állapota

| ID | Súly | Állapot | Indoklás |
|---|---|---|---|
| N-01 | MAJOR | **FIXED** | **Kézirat:** az i07 item-instrukciója zárt készletet ad (*du, de la, de, d' ou des*). Az i03 instrukciója szintén zárt (*de, d' ou des*). A TANULOI_NEZET ugyanezt mutatja.<br>**Megoldás:** a mennyiségszavak, a birtokosok és a számnevek kikerültek az elfogadottak közül, és F01-et kapnak. Az i03-ban az N01 helyére F01 lépett.<br>**Saját kulcs nélküli próbám:** az öt helyre (s001–s005) a készletből egyetlen alak illik, és ez a kulcs (*du / du / d' / des / de*). Az i03-ban is a kulcs a helyes (*d'*, *des*).<br>A p08 oldalinstrukciója (*Complète ou transforme…*) megmaradt. Nem mond ellent az item-instrukciónak, mert a *transforme* az s006-ra vonatkozik.<br>Az E-01 az én javaslatomra épül, ezért a F-feedbackek minőségét és hangnemét az UE és a független megoldó zárja le. A szerkezeti tényt, vagyis hogy a változtatás bekerült és a mérés kizárólagos lett, én igazolom. |
| N-02 | MINOR | FIXED (korábbról) | Változatlan. |
| N-03 | MINOR | FIXED (korábbról) | Változatlan. |
| N-04 | MINOR | **PARTIALLY FIXED** | **(a)** A p09b `visibleAfter` kérdése továbbra is ESCALATED a CEO-hoz.<br>**(b)** FIXED.<br>**(c)** **OPEN.** A 4. változat azt írja, hogy a JSON „veszi át” az új szövegeket, és tőlem a „JSON hűségének” ellenőrzését kéri. A BLOKK_JSON azonban most sincs az anyagban. Ezért NEM VIZSGÁLT a `targetManifest` (a subset-cél i04- és i08-kötése), az i07 subitemjeinek leképezése, az `alternatives` / `rejected` + `trigger` leképezés és a dőlt jelölés lehántása (MO-F04/6). |
| N-05 | MINOR | **PARTIALLY FIXED** | A feltételes szabály kiegészült a p04 kontrasztsorával (E-09), és belsőleg következetes. Az i03 és az s004 készlete tartalmazza a *de*-t, így a feltételes átsorolás végrehajtható. A 0.3 kapu viszont nyitott: a segitseg-1 még nem jött vissza. A lezárást más ellenőr adja, mert a szabály az én javaslatom. |
| N-06 | MINOR | **PARTIALLY FIXED** | **(a)** **OPEN.** A K3-értelmezés továbbra is ESCALATED a GR-hez vagy a CEO-hoz. A hatóköre szűkült: már csak az i05-re és az s006-ra vonatkozik.<br>**(b)** **OPEN.** A *J'en veux deux* az i05-ben N06-ot kap. Az i06-ban sem F02-t, sem más célzott sort nem kap, csak `incorrect`-et. Az s006-ban a *J'en veux trois* sincs a listán. Ez az N-07 javításával együtt rendezhető.<br>**(c)** **FIXED.** Az E-02 bekerült a kéziratba, és az N01–N06 helyére F01–F06 lépett. |
| N-07 | MAJOR | **PARTIALLY FIXED** | **Javítva:** az i06-ban (E-02 + F01/F02) a mért szerkezetet kihagyó válasz már nem fogadható el.<br>**Nyitott:** az i05-N06 (*J'en prends deux.* / *J'en veux deux.*) és az s006-N02 (*J'en prends trois.*) továbbra is a „helyes, de nem célzott” kategóriában van, amely a megoldás szerint „beleszámít a formatív teljesítésbe”. Lásd a findingtáblát. |

## 2. Van-e minden itemhez teljes megoldási adat?

| Item-ID | Kulcs | Elfogadott | Nem célzott / nem a kért | Elutasított + feedback | Feedback helyes válaszra | `incorrect` | Újrapróbálás | Állapot |
|---|---|---|---|---|---|---|---|---|
| i01-s001 | ✓ | ✓ | – | E01–E04 | ✓ | – (szemantikus) | ✓ | teljes |
| i02 | ✓ A | – | – | B, C, D | ✓ | – (QCM) | ✓ | teljes |
| i03 | ✓ | ✓ | F01 | E01–E06 | ✓ | ✓ | ✓ | teljes; N-05 |
| i04 | ✓ | ✓ | – | E01–E05 | ✓ | nincs | ✓ | teljes (a korábbi NOTE változatlan) |
| i05-s001 | ✓ ×4 | ✓ | N01–N06 | E01–E15 | ✓ | ✓ | ✓ mezőnként | adat teljes; N-07 |
| i06 | ✓ | ✓ | F01–F06 | E01–E05 | ✓ | ✓ | ✓ | teljes; N-06(b) |
| i07-s001 | ✓ | ✓ | F01 | E01–E05 | ✓ | ✓ | ✓ | teljes |
| i07-s002 | ✓ | ✓ | – | E01–E03 | ✓ | ✓ (új) | ✓ | teljes |
| i07-s003 | ✓ | ✓ | F01 | E01–E04 | ✓ | ✓ | ✓ | teljes |
| i07-s004 | ✓ | ✓ | F01 | E01–E04 | ✓ (az új stimulushoz igazítva) | ✓ | ✓ | teljes; N-05 |
| i07-s005 | ✓ | ✓ | – | E01–E03 | ✓ | ✓ (új) | ✓ | teljes |
| i07-s006 | ✓ | ✓ | N01, N02 | E01–E04 | ✓ | ✓ | ✓ | adat teljes; N-07 |
| i08-s001 | rubrika, 4 szint | A, B, C | – | R1, R2, E01–E05 | – (formatív) | – | ✓ | teljes; az ellenőrzőlista 5. pontja most egyezik a rubrika A(5) pontjával (E-07) |

A TANULOI_NEZET szövege megegyezik a kézirattal az E-01, E-02, E-04, E-05, E-06, E-07 és E-08 tételeknél.

## 3. Egyezik-e a mérési cél?

- **Kulcsok:** nem változtak, és egyeznek a terv 2. pontjával.
- **Determinánscélok** (i03, s001, s003, s004, s005): a zárt készlettel a mérés most kizárólagos (N-01 FIXED).
- **Az *en* + infinitif cél** (`w01-g-en-position-finite-infinitive`):
  - az i06-ban és az i08 6. kritériumában a mérés érvényes;
  - az i05-2-ben és az s006-ban megkerülhető (N-07).
- **i08:** a rubrika nem változott; a tanulói ellenőrzőlista most a rubrikához igazodik.

## Findingtábla (nyitott tételek)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| N-07 | **MAJOR** (PARTIALLY FIXED) | i05 2. mező (N06); i07-s006 (N02) | A mért szerkezetet (*aller* + *en* + infinitif) kihagyó válasz levonás nélkül teljesít. Az s006-nak éppen ez a mérési célja (a mennyiség megtartásával együtt), ezért az s006 mérése érvénytelen annál a tanulónál, aki *J'en prends trois*-t ír. | **(1) Belső ellentmondás a megoldásban.** Az 1. rész szerint a teljes mondatos mező (i05, s006) „csak akkor fogadható el, ha a mért szerkezet érintetlen”. Ugyanez a dokumentum az i05-N06-ot és az s006-N02-t „helyes, de nem célzott” válasznak tekinti, amely „beleszámít a formatív teljesítésbe”.<br>**(2) A K3 nem fedi le.** A K3 az eltérő igéjű helyes válaszra vonatkozik. A *J'en prends deux* igéje ugyanaz (*prendre*), csak a *je vais* + infinitif marad el. Ez nem igecsere, hanem a mért szerkezet elhagyása.<br>**(3) Az instrukció sem engedi.** A *Remplace le complément de quantité par en* és a *Transforme avec en* a bővítmény cseréjét kéri, nem az igeidő átírását. Ugyanez a logika vezetett az i06-F02-höz („nem a kért művelet”). | Az i05-N06 és az s006-N02 kerüljön át a 4. kategóriába („nem a kért művelet”): ne legyen elfogadva, a feedback ne mondja hibának, és hívjon újrapróbálásra, az i06-F02 mintájára. Ugyanide kerüljön a *J'en veux trois* is az s006-ban (ez rendezi az N-06(b)-t). Pontosítani kell a 3. kategória definícióját is: „csak eltérő ige, ép mért szerkezet”. Ehhez nem kell megvárni a K3-döntést: a K3 erre az esetre nem vonatkozik, és a megoldás saját szabálya is ezt írja elő.<br>**Recheck:** csak a felsorolt sorok és a kategóriadefiníció. Mivel ez a javaslatom, a lezárást az UE vagy a független megoldó adja. |
| N-06 | MINOR (PARTIALLY FIXED) | i05 N05, s006; i06 | (a) A K3-értelmezés megerősítésre vár, most már csak az eltérő igéjű válaszokra (i05-N05). (b) A *J'en veux deux/trois* besorolása nem egységes. | A 4. változat Dispositionjei: „N-06 (a) ESCALATED (GR/CEO)”. Az i06 F02-ben és az s006 listáján nincs *J'en veux…*. | (a) A GR vagy a CEO döntsön. (b) Az N-07 javításával együtt rendezhető. |
| N-04 | MINOR (PARTIALLY FIXED) | BLOKK_JSON, p09b | A JSON nincs a bemenetemben. A „JSON hűsége” recheck ezért nem végezhető el. A p09b döntésre vár. | A 4. változat a JSON-ra hivatkozik, és tőlem kéri a hűség ellenőrzését, a JSON azonban nincs csatolva. | A CEO csatolja a JSON-t és a sémaellenőrző szkript futási kimenetét, és döntsön a p09b-ről. **Recheck:** `targetManifest`, az i07 subitem-ID-k, N/F-kategóriák → `alternatives` / `rejected` + `trigger`. |
| N-05 | MINOR (PARTIALLY FIXED) | i03 2. hely; s004; i08 „Nem elegendő”; p04 2. kontrasztsor | A feltételes szabály teljes; a 0.3 kapu nyitott. | Az OQLF-lap nincs megnyitva, a segitseg-1 folyamatban van. | A NyE a segitseg-1 válasza után dönt. A lezárást más ellenőr adja. |

**NOTE (nem számít bele a súlyozásba):**
- **i06, *Je vais vous en prendre deux*:**
  - A mért szerkezet ép, a mérést nem érinti.
  - Az instrukció viszont azt kéri: *corrige seulement l'erreur et garde tous les autres mots*. A *vous* betoldása szó szerint nem javítás, míg az F06 a *réserver* cseréjét éppen az instrukcióra hivatkozva utasítja el.
  - Az elfogadás pedagógiailag védhető, mert a p06 tanítja ezt a sorrendet. Ha marad, a feedback mondja ki, hogy betoldás, de elfogadott. Ez PE- vagy szerzői döntés.
- **i04:** továbbra sincs `incorrect` szövege. A két megadott alak miatt kicsi a kockázat.
- **E-06 maradéka (MO-F04/6):** a p06-ban a dőlt jelölés lehántása után az *en* „én”-nek olvasható. Ez a CEO leképezési feladata és UE-téma, a hatókörömön kívül esik.
- **Időkeret** (34–45 ↔ 43–54 perc): változatlanul CEO- vagy GR-döntés.

## NEM VIZSGÁLT, illetve hiányzó bemenet

- A BLOKK_JSON, a `targetManifest`, a `block.schema.json`, a `playable-types.json` és a sémaellenőrzés futási kimenete: nincs a bemenetemben (N-04).
- Az OQLF-lap: a segitseg-1 folyamatban van, ezért nem kérem újra.
- Más ellenőr nézze, mert az én javaslatomra épül: az F-kategória feedbackjei és az E-01 (N-01 minőségi lezárás), az E-04, az N-05 szabálya, az N-07 iránya.
- Hatókörön kívül, nem minősítettem: a feedbackek nyelvi és szakmai minősége (PE, NyE), a tipográfia (HE), a „nem a kért” feedbackek hangneme (UE), és a tanárnak szóló kérdések.

## Változáslista, bizonyíték, következő címzett

**Változáslista:**
- N-01: FIXED (a PRESIDENT-eszkaláció tárgytalan);
- N-06(c): FIXED;
- N-07: PARTIALLY FIXED, továbbra is MAJOR;
- N-04, N-05 és N-06: PARTIALLY FIXED;
- N-02, N-03: változatlanul FIXED.

**Új bizonyíték:**
- a TANULOI_NEZET és a kézirat összevetése az E-01–E-08 tételeken;
- kulcs nélküli próba a zárt készlettel (s001–s005, i03);
- az 1. rész teljes mondatos szabályának összevetése az i05-N06 és az s006-N02 sorral.

**Újrahasznosított bizonyíték:**
- a kulcsok egyezése a terv 2. pontjával (a kulcs nem változott);
- a 0.1 kapu naplósora (PRESIDENT-folytatás).

**Következő címzett:** CEO.
- N-07 és N-06(b): a megoldásíró, majd az UE vagy a független megoldó recheckje;
- N-06(a): a GR vagy a CEO;
- N-04: a CEO (a JSON és a p09b);
- N-05: a NyE, a segitseg-1 válasza után.

**Tanulság:** ha egy megoldás általános szabálya („csak ép mért szerkezet fogadható el”) és az itemszintű kategóriák külön készülnek, az ellentmondás észrevétlenül megmarad. Ezért minden „helyes, de nem célzott” sort ugyanannak a szabálynak kell megfelelnie, mert különben a szabály csak papíron létezik. Hatókör: minden kötött transzformációs item.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 3
GEPI_OSSZEGZES_VEGE