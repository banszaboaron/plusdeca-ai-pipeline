# NavE: az U21 Megoldás fázisa, 5. változat (4. recheck)

**Szerep és megbízás:** NavE, a követelmények és a szerkezet ellenőrzése. Ez a Megoldás fázis negyedik ismételt ellenőrzése.

**Bemenet:**
- a GR terve, 2. javított változat;
- a befagyasztott kézirat, benne az E-01–E-08 javításokkal;
- a megoldásíró 5. változata, benne a TANULOI_NEZET;
- az előző NavE-jelentésem (N-01–N-07 és a NOTE-ok);
- a PRESIDENT folytatása (2026-11-01).

**Hatókör:**
- Van-e minden item-ID-hoz teljes megoldási adat?
- Egyezik-e a mérési cél a tervvel és a régi itemmel?

Teljesen újranéztem a megváltozott részeket:
- az 1. rész kategóriadefinícióit és a mezőnkénti mért szerkezetet;
- az i04 `incorrect` sorát;
- az i05 2. mezőjét és az F01-et;
- az i06 F02 és A01 sorát;
- az i07-s006-ot.

A többi itemnél csak azt néztem meg, hogy a kulcs és az adatkészlet változatlan maradt-e, illetve a nyitott findingok sorait.

**Nem kaptam meg:**
- a BLOKK_JSON-t;
- a sémát;
- a szkript futási kimenetét.

Az 5. változat azt írja, hogy a JSON „ebben a válaszban is szerepel”. A kapott anyag azonban a TANULOI_NEZET-tel véget ér, JSON nincs benne.

## Röviden

**Az N-07 (MAJOR) javítása szerkezetileg megtörtént.**
- A *J'en prends/veux deux* (i05-2) és a *J'en prends/veux trois* (s006) átkerült a „nem a kért művelet” kategóriába. Ezek a válaszok így nem fogadhatók el.
- A 3. kategória („helyes, de nem célzott”) most csak az ép mért szerkezetű válaszokat engedi be. A mért szerkezet mezőnként definiálva van, és az általános szabály most egyezik az itemszintű sorokkal.
- A kulcsok nem változtak, és egyeznek a terv 2. pontjával.

**Új MINOR (N-08):** az i05-2-ben és az s006-ban a futur simple-lel írt válasz (*J'en prendrai deux/trois*) nincs besorolva. Az i06-ban ugyanez a válasz F02-t kap.

**Nyitott MAJOR nincs.** Három MINOR maradt PARTIALLY FIXED állapotban (N-04, N-05, N-06), mert külső döntésre vagy bemenetre várnak.

## 1. A korábbi findingok állapota

| ID | Súly | Állapot | Indoklás |
|---|---|---|---|
| N-01 | MAJOR | FIXED (korábbról) | A kulcsok és a zárt készlet változatlanok. |
| N-02 | MINOR | FIXED (korábbról) | Változatlan. |
| N-03 | MINOR | FIXED (korábbról) | Változatlan. |
| N-04 | MINOR | **PARTIALLY FIXED** | **(a)** A p09b `visibleAfter`-kérdése továbbra is ESCALATED a CEO-hoz.<br>**(b)** FIXED.<br>**(c)** **OPEN.** A JSON most sincs a bemenetemben. Az 5. változat állítása („a teljes BLOKK_JSON ebben a válaszban is szerepel”) nem egyezik a kapott anyaggal. Ezért NEM VIZSGÁLT:<br>– az i07 subitemjeinek leképezése;<br>– az új F-sorok (i05-F01, s006-F01, i06-A01) leképezése az `alternatives` / `rejected` + `trigger` mezőkre;<br>– a dőlt jelölés lehántása.<br>A `targetManifest`-ről a szerző azt írja, hogy nem része a blokk-JSON-nak, és a 2.1 szerinti kötés a CEO-szkript feladata. Ezt elfogadom. A lezáráshoz ebben az esetben a CEO-szkript kimenete kell. |
| N-05 | MINOR | **PARTIALLY FIXED** | A feltételes szabály változatlan és teljes. A 0.3 kapu nyitott, mert a segitseg-1 még nem jött vissza. A szerző „FIXED (feltételes)” besorolását nem veszem át, amíg a forrás nincs meg. A lezárást a NyE adja. |
| N-06 | MINOR | **PARTIALLY FIXED** | **(a)** **OPEN, döntésre vár.** A K3-értelmezés továbbra is ESCALATED a GR-hez vagy a CEO-hoz. A hatóköre most az i05 N05-ös sorai és az eltérő igéjű, ép szerkezetű válaszok.<br>**(b)** **FIXED.** A *J'en veux deux* az i05-F01-be és az i06-F02-be, a *J'en veux trois* az s006-F01-be került. A besorolás most egységes.<br>**(c)** FIXED (korábbról). |
| N-07 | MAJOR | **FIXED** (szerkezeti tény; a tartalmi lezárás más ellenőré) | **Ellenőriztem:**<br>– Az i05-N06 → i05-F01 és az s006-N02 → s006-F01 átsorolás megtörtént; a két válasz nem szerepel az elfogadottak között.<br>– Az 1. rész 3. kategóriája „ép mért szerkezet” feltételre szűkült. Az 5 mezőre (i05-1…4 és s006) külön mért szerkezet van megadva.<br>– Mezőnként, egyenként összevetettem a megmaradt 3. kategóriás sorokat a mért szerkezettel:<br>  – i05-1: N02, N03, N05 (*en* + ragozott ige);<br>  – i05-3: N02, N05 (*ne en* … *pas*);<br>  – i05-4: N01, N04, N05 (*en* + segédige + participe + szám);<br>  – s006: N01 (*je vais en* + inf. + szám).<br>  Mindegyik ép, a szabály és a sorok ellentmondásmentesek.<br>– Az F01 feedbackje a 4. kategória definícióját követi: elismeri, hogy a mondat helyes, megnevezi a kért szerkezetet, újrapróbálásra hív, és nem árulja el a kulcsot.<br>– Az i05-2 és az s006 mérése így érvényes.<br>**Más ellenőrre tartozik:** a javítás iránya az én javaslatom volt. Ezért az F01-szövegek minőségét és a kategóriahatár pedagógiai helyességét az UE vagy a független megoldó zárja le. |

**NOTE-ok az előző körből:**
- **i06, *Je vais vous en prendre deux*:** FIXED. Az új A01 kimondja, hogy a *vous* betoldás, és megadja a szó szerinti javítást. Az elfogadásról a PE dönt.
- **i04 `incorrect`:** FIXED.
- **E-06 maradéka és az időkeret:** változatlanul CEO-hatáskör, nem minősítem.

## 2. Van-e minden itemhez teljes megoldási adat?

| Item-ID | Kulcs | Elfogadott | Nem célzott (3.) | Nem a kért (4.) | Elutasított + feedback | OK-feedback | `incorrect` | Újrapróbálás | Állapot |
|---|---|---|---|---|---|---|---|---|---|
| i01-s001 | ✓ | ✓ | – | – | E01–E04 | ✓ | – (szemantikus) | ✓ | teljes |
| i02 | ✓ A | – | – | – | B, C, D | ✓ | – (QCM) | ✓ | teljes |
| i03 | ✓ | ✓ | – | F01 | E01–E06 | ✓ | ✓ | ✓ | teljes; N-05 |
| i04 | ✓ | ✓ | – | – | E01–E05 | ✓ | ✓ (új) | ✓ | teljes |
| i05-s001 | ✓ ×4 | ✓ | N01–N05 | F01 (2. mező) | E01–E15 | ✓ | ✓ | ✓ mezőnként | teljes; N-08 |
| i06 | ✓ | ✓ + A01 | – | F01–F06 | E01–E05 | ✓ | ✓ | ✓ | teljes |
| i07-s001 | ✓ | ✓ | – | F01 | E01–E05 | ✓ | ✓ | ✓ | teljes |
| i07-s002 | ✓ | ✓ | – | – | E01–E03 | ✓ | ✓ | ✓ | teljes |
| i07-s003 | ✓ | ✓ | – | F01 | E01–E04 | ✓ | ✓ | ✓ | teljes |
| i07-s004 | ✓ | ✓ | – | F01 | E01–E04 | ✓ | ✓ | ✓ | teljes; N-05 |
| i07-s005 | ✓ | ✓ | – | – | E01–E03 | ✓ | ✓ | ✓ | teljes |
| i07-s006 | ✓ | ✓ | N01 | F01 | E01–E04 | ✓ | ✓ | ✓ | teljes; N-08 |
| i08-s001 | rubrika, 4 szint | A, B, C | – | – | R1, R2, E01–E05 | – (formatív) | – | ✓ | teljes, változatlan |

A TANULOI_NEZET szövege nem változott az előző körhöz képest. Az E-01–E-08 tételeknél továbbra is egyezik a kézirattal.

## 3. Egyezik-e a mérési cél?

- **Kulcsok:** nem változtak, és egyeznek a terv 2. pontjával.
- **A determinánscélok** (i03, s001, s003, s004, s005): a mérés kizárólagos.
- **Az *en* + infinitif cél** (`w01-g-en-position-finite-infinitive`): most az i05-2-ben, az i06-ban, az s006-ban és az i08 6. kritériumában is érvényes. A szerkezetet kihagyó válasz már egyik itemben sem teljesít.
- **A mennyiség megtartása** (`w01-g-en-quantity-retention`): az i05-2, az i05-4 és az s006 E-sorai (*Je vais en prendre.* / *Nous en avons acheté.*) elutasítják a szám nélküli választ. A mérés érvényes.
- **i08:** a rubrika és az ellenőrzőlista nem változott, és egyezik a tervvel.

## Findingtábla (nyitott tételek)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| **N-08** (új) | MINOR | i05 2. mező; i07-s006 | A futur simple-lel írt válasz nincs besorolva, pedig a mért szerkezetet ugyanúgy kihagyja, mint a *J'en prends deux*. Ilyen a *J'en prendrai deux* (i05-2) és a *J'en prendrai trois* (s006). Most a mező általános `incorrect` szövegét kapja. Ez a szöveg arra kéri a tanulót, hogy ellenőrizze: *en*-nel helyettesítette-e a bővítményt, jó helyen áll-e az *en*, és megmaradt-e a szám. Ez a válasz mindhárom kérdésre igent ad, így a feedback félrevezető. A mérést nem rontja, mert a válasz helyesen nem elfogadott. A 4. kategória definíciója szerint azonban F-feedback járna neki („minden válasz, amely a mért szerkezetet elhagyja”). | Az i06-F02 ugyanerre a válaszra (*J'en prendrai deux*) célzott sort ad, az i05-F01 és az s006-F01 nem. A kulcs nélküli próbámban ez a harmadik leggyakoribb, kézenfekvő átalakítás a *J'en prends* és a *J'en veux* után. | Az i05-F01 kiváltójához kerüljön hozzá a *J'en prendrai deux.*, az s006-F01-éhez a *J'en prendrai trois.* Az F01 szövege változatlanul jó rájuk.<br>**Recheck:** csak a két kiváltólista. |
| N-04 | MINOR (PARTIALLY FIXED) | BLOKK_JSON; p09b | A JSON és a szkriptkimenet hiányzik. A p09b döntésre vár. | Az 5. változat a JSON-t a válasz részének mondja, a kapott anyagban azonban nincs benne. | A CEO csatolja a BLOKK_JSON-t, a sémaellenőrzés futási kimenetét, és a `targetManifest` 2.1 szerinti kötését igazoló CEO-szkript kimenetét. Döntsön a p09b-ről is.<br>**Recheck:** az i07 subitem-ID-k; az N/F/A sorok → `alternatives` / `rejected` + `trigger`; a manifest i04- és i08-kötése. |
| N-05 | MINOR (PARTIALLY FIXED) | i03 2. hely; s004; i08 „Nem elegendő”; p04 2. kontrasztsor | A feltételes szabály teljes, de a 0.3 kapu nyitott. | A segitseg-1 folyamatban van. | A NyE a forrás alapján dönt. A lezárást más ellenőr adja. |
| N-06 | MINOR (PARTIALLY FIXED) | i05 N05-ös sorai | (a) A K3-értelmezés megerősítésre vár. A (b) pont FIXED. | Az 5. változat Dispositionjei szerint: „N-06 (a) ESCALATED (GR/CEO, változatlanul)”. | A GR vagy a CEO döntsön. Ez nem blokkol. |

## NEM VIZSGÁLT, illetve hiányzó bemenet

**Nincs a bemenetemben (N-04):**
- a BLOKK_JSON;
- a `block.schema.json` és a `playable-types.json`;
- a sémaellenőrzés futási kimenete;
- a `targetManifest` CEO-szkriptjének kimenete.

**Folyamatban, nem kérem újra:** az OQLF-lap (segitseg-1).

**Más ellenőr zárja le, mert az én javaslatomra épül:**
- az N-07 F01-feedbackjeinek minősége és a kategóriahatár (UE vagy független megoldó);
- az N-05 szabálya.

**Hatókörön kívül, nem minősítettem:**
- a feedbackek nyelvi és szakmai minősége, köztük az i06-A01 elfogadási döntése (PE, NyE);
- a tipográfia (HE);
- a hangnem (UE);
- a tanárnak szóló kérdések.

## Változáslista, bizonyíték, következő címzett

**Változáslista:**
- N-07: FIXED (szerkezetileg; a tartalmi lezárás az UE-é vagy a független megoldóé);
- N-06(b): FIXED;
- az i06-ra és az i04-re vonatkozó NOTE-ok: FIXED;
- N-04, N-05 és N-06: PARTIALLY FIXED;
- új: N-08 (MINOR).

**Új bizonyíték:**
- a mezőnkénti mért szerkezet egyenkénti összevetése az összes megmaradt 3. kategóriás sorral;
- kulcs nélküli próba az i05-2-re és az s006-ra az instrukció szövegével (ebből jött a futur simple-es eset);
- az i06-F02 és az i05-F01 / s006-F01 kiváltólistáinak összevetése.

**Újrahasznosított bizonyíték:**
- a kulcsok egyezése a terv 2. pontjával;
- a TANULOI_NEZET és a kézirat egyezése (E-01–E-08);
- a 0.1 kapu naplósora.

**Következő címzett:** CEO.
- N-08: a megoldásíró;
- N-07 tartalmi lezárása: az UE vagy a független megoldó;
- N-04: a CEO (JSON, szkriptkimenetek, p09b);
- N-06(a): a GR vagy a CEO;
- N-05: a NyE, a segitseg-1 válasza után.

**Tanulság:** ha egy hiányzó szerkezetet egy itemnél célzott sorral kezelsz → ugyanazt a kiváltólistát vidd át minden olyan itembe, amely ugyanazt a szerkezetet méri → különben ugyanarra a válaszra itemenként eltérő feedback jár → minden kötött transzformációs item, amely közös célt mér.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 4
GEPI_OSSZEGZES_VEGE