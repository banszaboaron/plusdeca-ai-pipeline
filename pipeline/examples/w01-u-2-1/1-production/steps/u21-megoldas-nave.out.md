# NavE – az U21 Megoldás fázisának ellenőrzése

**Szerep és megbízás:** NavE (követelmény és szerkezet). Független ellenőrzés, első kör a Megoldás fázisban.

**Bemenet:**
- a GR elfogadott terve (2. javított változat);
- a befagyasztott javított kézirat (1. javítási kör);
- a megoldásíró anyaga, a TANULOI_NEZET résszel együtt;
- a PRESIDENT folytatása (2026-11-01).

**Hatókör:**
- Van-e minden item-ID-hoz teljes megoldási adat: kulcs, elfogadott és elutasított válaszok, opciók, feedback, rubrika, újrapróbálás.
- Egyezik-e a mérési cél a tervvel és a régi itemmel.

## Röviden

Minden item-ID-hoz van megoldási adat, és a mért alakok mind a tizenkét helyen egyeznek a tervvel. A megoldás mégsem mehet tovább:

- **Egy MAJOR nyitott.** Az i07 három helyén olyan válaszokat utasít el, amelyek a jelenlegi instrukció mellett helyesek. A megoldásíró ezt maga is jelezte (MO-F01 / E-01), és igaza van. A javítás a kéziratban történik.
- **Négy MINOR:**
  - az i08 rubrikájának szintjei között rés van;
  - az i07-ben nincs feedback a helyes válaszra;
  - a JSON-leképezés egy új oldalt vezet be, a JSON-t pedig nem kaptam meg;
  - a 0.3 forráskapu még nyitott.

---

## 1. Van-e minden item-ID-hoz teljes megoldási adat?

| Item-ID | Kulcs | Elfogadott | Elutasított, feedbackkel | Feedback helyes válaszra | Újrapróbálás | Állapot |
|---|---|---|---|---|---|---|
| i01-s001 | ✓ | ✓ (két minta) | ✓ (E01–E03) | ✓ (OK) | ✓ (p02) | teljes |
| i02 | ✓ (A) | – (zárt) | ✓ (B, C, D) | ✓ (A) | általános szabály | teljes |
| i03 | ✓ | ✓ | ✓ (5 eset) | ✓ | általános, pár: s003/s004 | teljes (vö. N-05) |
| i04 | ✓ | ✓ | ✓ (4 eset) | ✓ | általános, pár: s005 | teljes |
| i05-s001 (4 mező) | ✓ | ✓ mezőnként | ✓ (E01–E15, N01) | ✓ | ✓ (csak a hibás mező nyílik újra) | teljes |
| i06 | ✓ | ✓ | ✓ (E01–E08) | ✓ | általános | teljes |
| i07-s001 | ✓ *du* | – | ✓ | **nincs** | általános | hiányos: N-03; mérés: N-01 |
| i07-s002 | ✓ *du* | – | ✓ | **nincs** | általános, pár: i02 | hiányos: N-03 |
| i07-s003 | ✓ *d'* | – | ✓ | **nincs** | általános | hiányos: N-03; mérés: N-01 |
| i07-s004 | ✓ *des* | – | ✓ | **nincs** | általános | hiányos: N-03; mérés: N-01 |
| i07-s005 | ✓ *de* | – | ✓ | **nincs** | általános | hiányos: N-03 |
| i07-s006 | ✓ | ✓ | ✓ | **nincs** | általános | hiányos: N-03 |
| i08-s001 | rubrika (A–D, 4 szint) | 3 minta (A, B, C) | 2 elutasított minta, E01–E05 | – (formatív) | ✓ (egy átdolgozás) | rés a szintekben: N-02 |

## 2. Egyezik-e a mérési cél a tervvel és a régi itemmel?

A régi `week-01.json` itemjeit nem kaptam meg. A régi kulcsokat a terv 2. pontjában rögzített, megtartott célalakokon keresztül vetettem össze; a PRESIDENT folytatása szerint az U21-re a kanonikus és a régi változat azonos.

| Item | Mért alak a terv szerint | A megoldás kulcsa | Állapot |
|---|---|---|---|
| i02 | *du* | A = *du* | egyezik |
| i03 | *d'excellents* + *des petits pains* | *d'* ; *des* | egyezik (a forrás megerősítése a 0.3 kapun függ: N-05) |
| i04 | *beaucoup de ; beaucoup des* | ugyanaz | egyezik |
| i05 | a négy mondat | ugyanaz; az *On en a acheté trois* elfogadva, jelölve | egyezik. A mért elem, az *en* helye és a szám megmaradása érintetlen; a kézirat ezt a döntést a megoldásíróra bízta. |
| i06 | *Je vais en prendre deux. / Nous ne voulons pas en acheter.* | ugyanaz | egyezik |
| i07 | *du / du / d' / des / de / Je vais en prendre trois.* | ugyanaz | a kulcs egyezik, de a mérés nem kizárólagos: N-01 |
| i08 | hat `allCriteria`, négyszintű rubrika | hat nyelvi kritérium, „Teljesített” = A = 6 | egyezik. Az 5. kritérium „vagy segédige” kiegészítése megfelel a kézirat lefedési táblájának. |
| i01 | jelentéselemzés: partitív ↔ *de + le* | ugyanaz | egyezik |

**A célmanifeszt (terv 2.1):** a `quantity_subset` célt az i04 és az i08 rubrikájának (4) kritériuma méri. Ez megfelel a tervnek. Magát a manifestet nem láttam (lásd N-04).

---

## Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| N-01 | **MAJOR** | `w01-u-2-1-i07`, az instrukció és az s001, s003, s004 | A jelenlegi instrukció mellett (*Réponds aux six questions.*) a nyitott helyekre olyan kitöltés is írható, amely helyes, és illik a helyzethez. A megoldás ezeket elutasítja. Ez sérti a „kontextusban helyes alternatívát ne minősíts hibásnak” szabályt, és a mérés így nem kizárólagos. | Saját megoldásom: s001 *je mets beaucoup de / un peu de miel* (az *Il adore le sucré* kifejezetten hívja); s003 *nous cuisons nos immenses tourtes*; s004 *nos* (gyenge, de lehetséges). A megoldás ezeket „Ez helyes…, de…” feedbackkel elutasítja. | Az E-01 iránya helyes, és nem érinti a mért alakokat. A kéziratban az i07 instrukciója legyen zárt alakkészletű: *De 1 à 5, écris un seul mot : du, de la, de, d' ou des.* A kézirat szerzője javít, ezután NavE-recheck (az instrukció és a hat subitem), UE és a független megoldó. Ha a javítás bekerül, a megoldásban az s001 *beaucoup de / un peu de*, az s003 és az s004 *nos* sora feleslegessé válik, vagy „nem a kért formátum” jelzésre szűkül. **Megjegyzés:** a zárt alakkészlet a nyílt felidézést részben felismeréssé teszi. Az i04-ben (B3) ugyanezt a megoldást alkalmazták, és a célt nem szűkíti. |
| N-02 | MINOR | i08, „Négy szint (összesítés)” | A négy szint nem fedi le az összes pontkombinációt. Ha A = 6 és B ≤ 3 (vagy C = 0 pipálás nélkül), egyik szintre sem esik a válasz. A D terület egyik szintben sem szerepel, így nem világos, mire szolgál. | „Teljesített: A = 6, B ≥ 4”; „Részleges: A = 4–5, vagy pipáló…”. Az A = 6, B = 3 eset nincs besorolva. | Egészítsd ki a Részleges szintet: „A = 4–5, **vagy A = 6 és B ≤ 3**, vagy pipáló szöveg”. Írd le, hogy a D formatív visszajelzés, és nem szintfeltétel; vagy építsd be a Kiváló szintbe (pl. D ≥ 3). Recheck: csak az i08 rubrikája. |
| N-03 | MINOR | i07-s001 … s006 | A subitemekhez nincs feedback a helyes válaszra. A többi zárt itemnél van („Helyes válaszra”, OK-sor), és a Megoldás fázis itemenként feedbacket kér. A második hibás válasz utáni „egymondatos indoklás” sincs megírva; csak a hibás válaszok feedbackje létezik. | Az i07 táblájában csak „Kulcs / Elfogadott / Elutasított → feedback” oszlop van. | Subitemenként egy mondat: helyes válaszra adott megerősítés, amely egyben a kulcs indoklása is (pl. s001: „Igen: valamennyi mézet teszel rá → du miel, partitív.”). Recheck: csak ezek a sorok. |
| N-04 | MINOR | MO-F04, BLOKK_JSON | (a) A modellek egy új oldalra kerülnek (`w01-u-2-1-p09b`), holott a terv kilenc oldalt és stabil oldal-ID-kat rögzít. (b) Az i07 subitemjei külön itemként jelennek meg, ami eltér a kézirat ID-szerkezetétől. (c) A BLOKK_JSON nincs a bemenetemben, ezért a leképezést és a manifestet nem tudtam ellenőrizni. | A megoldásíró szerint: „a modellek egy új oldalra kerültek (`w01-u-2-1-p09b`, `visibleAfter: i08`)”, és „az i07 subitemjei külön itemek”. | (a) Lehetőleg a p09-en belül, `visibleAfter: i08` tartalomblokként jelenjen meg; ha a séma nem engedi, a CEO jelölje kifejezett, jóváhagyott eltérésként. (b) A külön itemek ID-je maradjon szó szerint `w01-u-2-1-i07-s00x`, és a manifest `subitemIds` mezője ehhez igazodjon. (c) A CEO csatolja a JSON-t és a szkriptes séma-ellenőrzés kimenetét. Recheck: a leképezés és a manifest kötései. |
| N-05 | MINOR | i03, 2. hely; i07-s004 (a *de* elutasítása) | A terv 0.3 kapuja (a NyE nyissa meg és igazolja az OQLF-lapot a *des petits pains*-ről) a Kézirat előtt kötelező volt, de még mindig nyitott. A kulcs és a *de petits pains* elutasítása erre a még nem igazolt referenciára épül. Ha a forrás nem igazolja, két helyes válasz lehetséges. | A kézirat szerint „0.3 – nem teljesült”. A megoldásíró saját keresési kivonata (MO-F03) szerint a *petits pains* példa nem látszott. | A NyE nyissa meg az OQLF-lapot, és rögzítse az eredményt. Ha igazolja, a kulcs marad. Ha nem, az i03-2 és az s004 *de* válaszát el kell fogadni (vagy a stimulust át kell írni), és ez visszamegy a GR-hez. Recheck: az i03 és az s004 elfogadási szabálya. |

**NOTE, a súlyozásba nem számít bele:**
- Az i07-ben a megoldásíró a második hibás válasz utáni „egymondatos indoklást” a közös újrapróbálási szabályra hagyja. A kulcsot alátámasztó szöveg azonban csak az elutasító feedbackekben van. Ez N-03 javításával egyszerre megoldódik.
- Az i05-4 *On en a acheté trois* elfogadása a megoldásíró jelölt döntése, és a kézirat ezt rá bízta. Mérési célt nem érint, ezért nem finding.

## NEM VIZSGÁLT, illetve hiányzó bemenet

- **BLOKK_JSON** (P5-blokkforrás), és benne a `targetManifest`: nincs a bemenetemben (N-04).
- **A régi `week-01.json` U21-itemjei:** közvetlenül nem láttam őket. Az összevetés a terv 2. pontján és a PRESIDENT folytatásán alapul.
- **Az OQLF-lap:** nem nyitottam meg; ez a NyE feladata (N-05).
- **Hatókörön kívül, nem minősítettem:** a feedbackek és a C minta nyelvi és szakmai helyessége (PE, NyE), a tipográfia (MO-F05 → HE), a K1 és K2 beprópálása (független megoldó).

## Változáslista, bizonyíték, következő címzett

- **Változáslista:** első NavE-kör a Megoldás fázisban; korábbi finding nincs, recheck-állapot nincs.
- **Új bizonyíték:**
  - a saját, kulcs nélküli megoldásom az i07 hat subitemjére (N-01);
  - a rubrika szintfeltételeinek kombinációs vizsgálata (N-02).
- **Újrahasznosított bizonyíték:** a PRESIDENT folytatásában a B3 naplósora (`changed: []`), a 0.1 kapuhoz.
- **Következő címzett:** CEO.
  - N-01: a kézirat szerzőjéhez az i07 instrukciója miatt.
  - N-02 és N-03: a megoldásíróhoz.
  - N-04: a CEO-hoz, a JSON és a szkript kimenete miatt.
  - N-05: a NyE-hez.

**Tanulság:** a terv egy fázis előtti kaput írt elő (0.3), a lánc mégis továbbment, és a nyitott kapu most a kulcs érvényességét terheli → a CEO-vezérlő minden fázisváltásnál ellenőrizze a terv kapuit, és a nyitott kaput vigye tovább a következő fázis findingjei közé → különben a kulcs utólag dőlhet el → minden „a fázis csak X után indulhat” típusú tervfeltétel.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 4
GEPI_OSSZEGZES_VEGE