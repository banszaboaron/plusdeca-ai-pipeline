# NavE: az U21 Megoldás fázisa, 3. változat (2. recheck)

**Szerep és megbízás:** NavE, a követelmények és a szerkezet ellenőrzése. Ez a Megoldás fázis második ismételt ellenőrzése.

**Bemenet:**
- a GR terve, 2. javított változat;
- a befagyasztott kézirat az 1. javítási körből;
- a megoldásíró 3. változata, benne a TANULOI_NEZET;
- az előző NavE-jelentésem (N-01 – N-06);
- a PRESIDENT folytatása (2026-11-01).

**Hatókör:**
- Minden item-ID-hoz van-e teljes megoldási adat.
- A mérési cél egyezik-e a tervvel és a régi itemmel.

A változott részeket néztem: a kategóriaszabályt, a semleges `incorrect` szövegeket, az i05 és i06 új N-sorait, a feltételes 0.3-as szabályt, valamint az E-04 és E-06 – E-08 javaslatokat. A munkakönyvtárban a szerepleíráson kívül más fájl nincs. A sémát és a BLOKK_JSON-t nem láttam.

## Röviden

A kulcsok nem változtak, és mind egyeznek a terv 2. pontjával. Minden itemhez megvan a megoldási adat. A megoldás mégsem mehet tovább, két MAJOR finding nyitott.

**N-01 (MAJOR):** továbbra is részben javított.
- A megoldásban lévő rész kész, és az én korábbi javaslatomat követi: szabály lett a zárt lista helyett, és bekerült a semleges `incorrect`. Ennek ellenőrzése ezért nem az enyém.
- Nyitva marad, hogy a mérés nem kizárólagos. Ezt csak az E-01 kéziratmódosítás oldja meg.
- **Ez a harmadik kör ugyanarra a hibára.** A közös szabály szerint a CEO vigye a PRESIDENT elé. A döntés tárgya: feloldják-e a kézirat befagyasztását az E-01 miatt.

**Új, N-07 (MAJOR):** a „helyes, de nem célzott” kategória most olyan válaszokat is levonás nélkül fogad el, amelyek kihagyják a mért szerkezetet. Az *en* + infinitif cél így mindhárom zárt mérőpontján (i05-2, i06-1, i07-s006) megkerülhető. A terv K3 pontja szerint az ilyen válasz „nem teljes értékű”.

**N-04 (c):** a szerző másodszor is azt írja, hogy a BLOKK_JSON „ebben a válaszban szerepel”. Az anyagban, amelyet kaptam, most sincs benne.

---

## 1. A korábbi findingok állapota

| ID | Súly | Állapot | Indoklás |
|---|---|---|---|
| N-01 | MAJOR | **PARTIALLY FIXED** | **(a) A megoldás oldala:** a zárt lista helyett kategóriaszabály áll, a számnévkészlet bővült, és a felismeretlen válaszok semleges `incorrect` szöveget kapnak (i03, s001, s003, s004). Ez a korábbi jelentésem tartalékjavaslatát valósítja meg, ezért a minőségét **NEM VIZSGÁLTAM**; az UE és a független megoldó nézze meg. Szerkezeti tény (MO-F06): a gép a felismeretlen helyes választ továbbra is „nem egyező”-nek könyveli, mert a séma itemszinten nem ismer bizonytalan állapotot. Ezt a sémát nem láttam.<br>**(b) Kizárólagos mérés:** **OPEN.** A befagyasztott kéziratban az i07 instrukciója nyitott (*Complète ou transforme chaque phrase*). Az N01-es válasz levonás nélkül teljesít, így az s001-ben a *du*, az s003-ban a *d'*, az s004-ben a *des* és az i03-ban a *d'/des* nem mérődik azoknál a tanulóknál, akik nem célzott alakot írnak. Az E-01 és az E-08 még nincs a kéziratban.<br>**Folyamat:** ez a hiba már harmadik körben szerepel (eredeti, 2. kör, 3. kör). A közös alap szerint legfeljebb két javítási kör jár rá, ezért ESCALATE a PRESIDENT-hez. |
| N-02 | MINOR | FIXED (az előző körből) | Változatlan. A lezáró recheck a PE vagy az UE feladata, mert a javítás részben az én javaslatom. |
| N-03 | MINOR | FIXED (az előző körből) | Változatlan. |
| N-04 | MINOR | **PARTIALLY FIXED** | **(a)** A p09b CEO-jóváhagyásra vár (ESCALATED). A `visibleAfter` oldalszintű voltát a szerző állítja. A sémát nem láttam, ezért ezt átveszem, de nem igazolom.<br>**(b)** FIXED.<br>**(c)** **OPEN.** A Dispositionök között „N-04 (c) FIXED – A teljes BLOKK_JSON ebben a válaszban szerepel” áll. A kapott anyagban csak a TANULOI_NEZET van. A munkakönyvtárban sincs JSON. A `targetManifest` (a subset-cél i04- és i08-kötése), az i07 subitemjeinek leképezése és az N-kategóriák `alternatives` + `trigger` leképezése ezért **NEM VIZSGÁLT**. Egy FIXED-állítás nem helyettesíti a bizonyítékot. |
| N-05 | MINOR | **PARTIALLY FIXED** | **Javítva (szerzői):** a feltételes szabály most egyszerre vonatkozik az i03 2. helyére, az s004-re és az i08 „Nem elegendő” sorára. Ha a forrás nem igazolja az állítást, a mérés visszakerül a GR-hez, szűkítés nincs. Ez szó szerint a javaslatom, ezért a lezárást más ellenőr adja.<br>**Nyitott:** maga a 0.3 kapu. Az OQLF-lap nincs megnyitva, a segitseg-1 válasza még nem jött meg. Amíg nincs meg, az i03-E03, az s004-E01, a p04 kontrasztja (E-03) és az i08 sora igazolatlan állításra épül. |
| N-06 | MINOR | **PARTIALLY FIXED** | **(a)** Az i05-be bekerült az N05 sor (más igével írt helyes válasz). A K3-értelmezés („beleszámít a teljesítésbe, de nem bizonyítja az elsajátítást”) a GR vagy a CEO megerősítésére vár, és nem oldja fel a „nem teljes értékű” ↔ „nincs levonás” ellentmondást. A következményét lásd az N-07-nél. **OPEN, döntésre vár.**<br>**(b)** FIXED: az i05-N06 bekerült. **Maradék hézag:** a *J'en veux deux* az i05-ben N06-ot kap, az i06-ban és az s006-ban (*J'en veux trois*) viszont nincs a listán, ott a semleges `incorrect` jön. Az új rendszer itt még nem egységes.<br>**(c)** Az i06-N01 bővült, és bekerült az N06 sor. A tényleges lezárás az E-02, amely még nincs a kéziratban. |

## 2. Van-e minden itemhez teljes megoldási adat?

| Item-ID | Kulcs | Elfogadott | Nem célzott | Elutasított + feedback | Feedback helyes válaszra | `incorrect` | Újrapróbálás | Állapot |
|---|---|---|---|---|---|---|---|---|
| i01-s001 | ✓ | ✓ | – | E01–E04 | ✓ | – (szemantikus) | ✓ | teljes |
| i02 | ✓ A | – | – | B, C, D | ✓ | – (QCM) | ✓ | teljes |
| i03 | ✓ | ✓ | N01 + szabály | E01–E05 | ✓ | ✓ új | ✓ | adat teljes; N-01(b), N-05 |
| i04 | ✓ | ✓ | – | E01–E05 | ✓ | **nincs** | ✓ | teljes (lásd a NOTE-ot) |
| i05-s001 | ✓ ×4 | ✓ | N01–N06 | E01–E15 | ✓ | ✓ új | ✓ mezőnként | adat teljes; N-07 |
| i06 | ✓ | ✓ | N01–N06 | E01–E05 | ✓ | ✓ új | ✓ | adat teljes; N-06(c), N-07 |
| i07-s001 | ✓ | ✓ | N01 + szabály | E01–E04 | ✓ | ✓ | ✓ | adat teljes; N-01(b) |
| i07-s002 | ✓ | ✓ | – | E01–E03 | ✓ | – | ✓ | teljes |
| i07-s003 | ✓ | ✓ | N01 + szabály | E01–E03 | ✓ | ✓ | ✓ | adat teljes; N-01(b) |
| i07-s004 | ✓ | ✓ | N01 + szabály | E01–E02 | ✓ | ✓ | ✓ | adat teljes; N-01(b), N-05 |
| i07-s005 | ✓ | ✓ | – | E01–E02 | ✓ | – | ✓ | teljes |
| i07-s006 | ✓ | ✓ | N01, N02 | E01–E04 | ✓ | ✓ új | ✓ | adat teljes; N-07 |
| i08-s001 | rubrika, 4 szint | A, B, C | – | R1, R2, E01–E05 | – (formatív) | – | ✓ | teljes; a „Nem elegendő” sor feltételes (N-05) |

## 3. Egyezik-e a mérési cél?

- **Kulcsok:** nem változtak, és egyeznek a terv 2. pontjának célalakjaival. A korábbi „egyezik” minősítésem érvényes marad.
- **i08:** a rubrika és a szintek változatlanok; csak a „Nem elegendő” sor lett feltételes. A mért cél nem változott.
- **Az elfogadási kategóriák hatása a célra:** két helyen is eltér a tervtől.
  - **(1) Determinánscélok** (i03, s001, s003, s004): N-01(b).
  - **(2) *En* + infinitif cél** (i05-2, i06-1, s006): N-07, lásd a findingtáblát.

## Findingtábla (nyitott tételek)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| N-01 | **MAJOR** (PARTIALLY FIXED) | `w01-u-2-1-i07` instrukció; s001, s003, s004; i03 | Nyitott instrukció mellett a nem célzott helyes alak levonás nélkül teljesít, ezért a determinánscél nem mérődik kizárólagosan. A megoldás oldaláról ez tovább nem javítható. | A kézirat i07 instrukciója: *Complète ou transforme chaque phrase.* A megoldás 1. része szerint: „N01 … nem hiba, pontlevonás nincs”. Az E-01 és az E-08 ESCALATED, a kéziratban nincsenek benne. | A CEO vigye a PRESIDENT elé (3. kör): feloldják-e a kézirat befagyasztását az E-01 (és az opcionális E-08) miatt, vagy jelölt kivételként elfogadják a nem kizárólagos mérést. **Recheck:** az E-01 után az UE és a független megoldó (saját javaslatom, nem NavE). |
| **N-07** (új) | **MAJOR** | i05 2. mező (N06); i06 1. mondat (N02); i07-s006 (N02); i06 2. mondat (N01: *Nous n'en voulons pas*, *Nous n'en prendrons pas*) | A „helyes, de nem célzott” kategória levonás nélkül fogad el olyan választ is, amely **kihagyja a mért szerkezetet** (az infinitifet), nem csak az igét cseréli le. Az *en* + infinitif cél így mindhárom zárt mérőpontján megkerülhető. A terv K3 pontja csak az **eltérő igéjű** válaszra vonatkozik, és azt is „nem teljes értékű”-nek minősíti. | A kötött transzformáció kiinduló mondatai: *Je vais prendre deux croissants.* és *Je vais prendre trois parts de flan.*, az i06-ban pedig a javítandó *Je vais prendre en deux.* Ha a tanuló mindhárom helyre *J'en prends deux/trois* választ ír, nincs levonás (i05-N06, s006-N02, i06-N02), pedig egyszer sem helyezte az *en*-t infinitif elé. Az i06 2. mondatában a *Nous n'en voulons pas* ugyanígy elhagyja a *vouloir + en + infinitif* szerkezetet. | A kategórián belül két alkategória kell: **(i) eltérő ige, a mért szerkezet érintetlen** (pl. i05-N05: *Nous en avons pris trois*): a K3 szerint nem hiba, de nem teljes értékű; **(ii) a mért szerkezet hiányzik** (i05-N06, i06-N01 egy része és N02, s006-N02): nem a kért átalakítás, az újrapróbálás kötelező, és a válasz nem számít teljesítésnek; a feedback szövege maradhat barátságos. A K3 értelmezését (N-06a) a GR egyszerre döntse el erre is. Megjegyzés: az i05-N06 felvétele az én N-06(b) javaslatomra történt. Ott az egységesítést kértem, a mért szerkezet hiányát nem vettem figyelembe; ezt most helyesbítem. **Recheck:** a felsorolt N-sorok és a K3-döntés. Mivel az irány a javaslatom, a CEO jelöljön ki hozzá másik ellenőrt is (UE vagy független megoldó). |
| N-04 | MINOR (PARTIALLY FIXED) | BLOKK_JSON, p09b | (a) A p09b eltérés jóváhagyásra vár. (c) A JSON nincs a bemenetemben, a FIXED-állítás bizonyíték nélküli. | A Dispositionök szerint „N-04 (c) FIXED – A teljes BLOKK_JSON ebben a válaszban szerepel”, a kapott anyagban nincs benne. | A CEO csatolja a JSON-t és a sémaellenőrző szkript futási kimenetét, és döntsön a p09b-ről. **Recheck:** `targetManifest`, i07 subitem-ID-k, N-kategóriák → `alternatives` + `trigger`. |
| N-05 | MINOR (PARTIALLY FIXED) | i03 2. hely; s004; i08 „Nem elegendő”; p04 | A feltételes szabály teljes, a 0.3 kapu viszont nyitott. | Az OQLF-lap nincs megnyitva; a segitseg-1 folyamatban van. | A segitseg-1 válasza után a NyE igazolja vagy cáfolja az állítást. A szabály lezárását más ellenőr adja (saját javaslatom). |
| N-06 | MINOR (PARTIALLY FIXED) | i05, i06, s006 N-sorok | (a) A K3-értelmezés megerősítésre vár. (b) A *J'en veux deux/trois* csak az i05-ben kap kategóriát, az i06-ban és az s006-ban nem. (c) A lezárást az E-02 adja. | i05-N06 ↔ i06-N02 és s006-N02, ahol a *J'en veux…* nem szerepel. | A GR döntése (N-07-tel együtt); a *J'en veux…* egységes besorolása az N-07 (ii) alkategóriájába; az E-02 bevezetése. **Recheck:** csak ezek a sorok. |

**NOTE, a súlyozásba nem számít bele:**
- **E-04:** a teljes, igés táblafelirat (*nous avons fait ___ petits pains*) a mondatszerkezettel kizárja a névelő nélküli választ, és ezzel kezeli a korábbi NOTE-omat. Mivel az én NOTE-omra épül, a recheck az UE és a független megoldó feladata.
- **E-07:** a tanulói 5. ellenőrzőkérdés („ragozott ige előtt”) szigorúbb, mint a rubrika A(5) pontja („vagy segédige”). A javasolt egyeztetés illik a tervhez; kéziratszintű döntés.
- **i04:** nincs `incorrect` szövege. A két megadott alak miatt ez valószínűleg nem okoz hézagot; csak a teljesség kedvéért jelzem.
- **Időkeret (34–45 ↔ 43–54 perc):** változatlanul CEO- vagy GR-döntés; hatókörön kívül.

## NEM VIZSGÁLT, illetve hiányzó bemenet

- **BLOKK_JSON, `targetManifest`, a sémaellenőrzés futási kimenete:** nincs a bemenetemben (N-04).
- **`block.schema.json`, `playable-types.json`:** nem láttam; a szerző állításait (`visibleAfter`, `feedback.incorrect`, `PV-feedback-uncertain`) nem igazoltam.
- **Az OQLF-lap:** a segitseg-1 folyamatban van, ezért nem kérem újra.
- **Más ellenőr nézze, mert saját javaslatra épül:** a kategóriaszabály és a semleges `incorrect` (N-01a), az N-05 szabály, az E-01, az E-04, az N-02.
- **Hatókörön kívül, nem minősítettem:** a feedbackek nyelvi és szakmai minősége, köztük az i04-E02 új állítása (PE, NyE), valamint a tipográfia (HE).

## Változáslista, bizonyíték, következő címzett

- **Változáslista:**
  - N-01: PARTIALLY FIXED, eszkaláció a PRESIDENT-hez (3. kör);
  - N-04: PARTIALLY FIXED, a (c) nyitva;
  - N-05: PARTIALLY FIXED;
  - N-06: PARTIALLY FIXED;
  - új: N-07 (MAJOR);
  - N-02, N-03: változatlanul FIXED.
- **Új bizonyíték:**
  - a kategóriák összevetése a terv K3 pontjával;
  - az *en* + infinitif cél mérőpontjainak bejárása (i05-2, i06-1, s006, i08);
  - a munkakönyvtár listázása: JSON nincs.
- **Újrahasznosított bizonyíték:**
  - a kulcsok egyezése: a kulcs nem változott;
  - a 0.1 kapu naplósora (PRESIDENT-folytatás).
- **Következő címzett:** CEO.
  - N-01: a PRESIDENT döntése az E-01-ről;
  - N-07 és N-06(a): a GR (a K3 értelmezése), majd a megoldásíró;
  - N-04: a CEO (JSON, p09b);
  - N-05: a NyE, a segitseg-1 válasza után.

**Tanulság:** ha a „helyes, de nem célzott” kategória levonás nélküli → az a válasz is ide kerülhet, amely a mért szerkezetet kihagyja → ezért külön kell választani az „eltérő szó, ép szerkezet” és a „hiányzó mért szerkezet” esetét → minden kötött transzformációs és hibajavító item.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 2
minor: 3
GEPI_OSSZEGZES_VEGE