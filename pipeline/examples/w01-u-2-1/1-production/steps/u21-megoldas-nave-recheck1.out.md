# NavE: az U21 Megoldás fázisa, 2. változat (recheck)

**Szerep és megbízás:** NavE, a követelményeket és a szerkezetet ellenőrzöm. Ez a Megoldás fázis első ismételt ellenőrzése.

**Bemenet:**
- a GR terve, 2. javított változat;
- a befagyasztott kézirat az 1. javítási körből;
- a megoldásíró 2. változata, benne a TANULOI_NEZET;
- az előző NavE-jelentésem (N-01 – N-05);
- a PRESIDENT folytatása (2026-11-01).

**Hatókör:**
- Minden item-ID-hoz van-e teljes megoldási adat.
- A mérési cél egyezik-e a tervvel és a régi itemmel.

Kiemelten néztem a változott részeket: az új válaszkategóriákat, az i08 szintjeit, a helyes válaszra adott feedbacket és az E-01 – E-05 javaslatokat. A szerző ezeket kifejezetten NavE-ellenőrzésre küldte.

## Röviden

A kulcsok változatlanok, és mind egyeznek a tervvel. Az N-02 és az N-03 javítva. A megoldás mégsem mehet tovább:

- **N-01 (MAJOR) csak részben javítva.** Az i07-ben a felsorolt helyes kitöltéseket már nem bünteti, de a lista zárt. Egy természetes helyes válasz, például az s001-ben a *plein de miel*, ma is elutasított.
  - A tényleges javítás az E-01: a kéziratban az i07 instrukciója zárt alakkészletet adjon meg.
  - Az E-01 az én javaslatomra épül, ezért nem én ellenőrzöm.
- **Nyitott még:**
  - N-04: a BLOKK_JSON nincs a bemenetemben;
  - N-05: a 0.3 kapu, vagyis az OQLF-forrás még nincs meg.
- **Új:** N-06 (MINOR): hézagok az új kategóriarendszerben.

---

## 1. A korábbi findingok állapota

| ID | Súly | Állapot | Indoklás |
|---|---|---|---|
| N-01 | MAJOR | **PARTIALLY FIXED** | **Javítva:** az s001 *beaucoup de / un peu de*, az s003 *nos* és néhány számnév, valamint az s004 *nos* és néhány számnév már nem hiba. A „helyes, de nem célzott” N01-sorba kerülnek, pontlevonás nélkül.<br>**Nyitott (a):** a lista zárt, ezért más, a helyzetben helyes kitöltést továbbra is elutasít. Saját megoldásom szerint ilyen: s001 *plein de / pas mal de miel* (az *Il adore le sucré* kifejezetten hívja); s003 *quelques / plusieurs*, valamint a *huit*, a *vingt* és a többi fel nem sorolt szám; s004 *quelques*, valamint a *six*, a *cinquante* és a többi fel nem sorolt szám. Ezekre az általános hibás feedback jön.<br>**Nyitott (b):** amíg az N01-sor pontlevonás nélküli, a s001, az s003 és az s004 célja (*du*, *d'*, *des*) azokra a tanulókra nem mérődik, akik nem célzott választ írnak. A mérés tehát nem kizárólagos.<br>Mindkét maradékot az E-01 szünteti meg. A kéziratban még nincs benne. |
| N-02 | MINOR | **FIXED** (szerzői javítás; lezáráshoz másik ellenőr kell) | A szintek most sorrendben vizsgálandók, és a „Részleges = minden más eset” szabály miatt minden kombináció besorolódik. A D terület a Kiváló szint feltétele lett. Mivel ez részben az én javaslatomat követi, a lefedés független ellenőrzését a PE vagy az UE végezze. |
| N-03 | MINOR | **FIXED** | Az i07 mind a hat subitemjéhez van feedback a helyes válaszra (OK-sor). Ez szolgál a második hibás válasz utáni indoklásként is (1. rész, Újrapróbálás 2.). A feedback tartalma a PE és a NyE hatóköre. |
| N-04 | MINOR | **PARTIALLY FIXED** | **(a)** A szerző szerint a séma `visibleAfter` mezője csak oldal szintjén létezik, ezért kell a p09b oldal. Ez az én javaslatom szerinti ág, a CEO-nak jelölt eltérésként jóvá kell hagynia. A sémát nem láttam, ezért az állítást csak átvettem.<br>**(b)** FIXED.<br>**(c)** A megoldás szerint „a teljes BLOKK_JSON ebben a válaszban szerepel”, de az anyagban, amelyet megkaptam, csak a TANULOI_NEZET van, JSON nincs. A leképezés, a `targetManifest` (a subset-cél i04- és i08-kötése) és a „nem célzott” válaszok `alternatives` + `trigger` kezelése ezért NEM VIZSGÁLT. |
| N-05 | MINOR | **OPEN** | A 0.3 kapu nyitott; a segitseg-1 kérés már folyamatban van. Az i03-hoz bekerült egy feltételes szabály. **Hiány:** ugyanez nincs meg az s004-re, pedig annak a *de* elutasítása ugyanerre a nem igazolt állításra épül, és az i08 „Nem elegendő: *de petits pains*” sora is. Ha az OQLF nem igazolja, a feltételes szabály az i03 mérését éppen arra az s004-re szűkítené, amely ugyanúgy megdől. |

## 2. Van-e minden itemhez teljes megoldási adat? (frissítve)

| Item-ID | Kulcs | Elfogadott | Nem célzott | Elutasított + feedback | Feedback helyes válaszra | Újrapróbálás | Állapot |
|---|---|---|---|---|---|---|---|
| i01-s001 | ✓ | ✓ | – | E01–E04 | ✓ | ✓ | teljes |
| i02 | ✓ A | – | – | B, C, D | ✓ | ✓ | teljes |
| i03 | ✓ | ✓ | (feltételes) | E01–E05 | ✓ | ✓ | teljes; forrásfüggés: N-05 |
| i04 | ✓ | ✓ | – | E01–E05 | ✓ | ✓ | teljes |
| i05-s001 | ✓ ×4 | ✓ | N01–N04 | E01–E15 | ✓ | ✓ mezőnként | adat megvan; hézag: N-06 |
| i06 | ✓ | ✓ | N01–N05 | E01–E05 | ✓ | ✓ | adat megvan; hézag: N-06 |
| i07-s001 – s006 | ✓ | ✓ | N01 (s001, s003, s004, s006), N02 (s006) | ✓ | ✓ (új) | ✓ | adat megvan; mérés: N-01 |
| i08-s001 | rubrika, 4 szint | A, B, C minta | – | R1, R2, E01–E05 | – (formatív) | ✓ | teljes |

## 3. Egyezik-e a mérési cél?

- **Kulcsok:** egyik sem változott. Az i02, i03, i04, i05, i06, i07 és i08 kulcsa egyezik a terv 2. pontjában rögzített célalakokkal. Az előző körben adott „egyezik” minősítésem érvényes marad.
- **i08:** a hat `allCriteria` változatlan, és a négy szint megmaradt. Új feltétel a Teljesített szinten a C ≥ 2. Ez a szint pontosítása, a mért cél nem változik.
- **A C minta:** lefedi a hat nyelvi kritériumot és a hat tartalmi elemet. Ellentmondást nem találtam benne az idővonallal: a p06 négy cannelé-ja megfelel a *Camille en a pris quatre* mondatnak, kenyeret pedig nem kér. A nyelvi és szakmai minősítés a PE és a NyE hatóköre.

## Findingtábla (csak a nyitott tételek)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| N-01 | **MAJOR** (PARTIALLY FIXED) | `w01-u-2-1-i07`: instrukció; s001, s003, s004 | A nem célzott helyes kitöltések listája zárt. A fel nem sorolt helyes válaszokat továbbra is elutasítja, a felsoroltakkal pedig a cél nem mérődik. | s001: *Il adore le sucré : je mets plein de miel.* – helyes, de nincs a listában. s003: *nous cuisons quelques immenses tourtes*. s004: *on a fait six petits pains aux noix* – a megadott számok közt nincs ott. | Az E-01 kerüljön be a kéziratba (a kézirat szerzője). Ezután a megoldásban az N01-sorok „nem a kért alak” jelzéssé szűkülnek. Ha a CEO az E-01-et elveti, az N01 ne lista legyen, hanem szabály: a hely előtti ige és a hely utáni főnév közé írt minden más determináns vagy mennyiségjelző N01-et kap, és tanári felülvizsgálatra kerül. Recheck: az i07 instrukciója és a hat subitem. Az E-01-et ne a NavE nézze (saját javaslat), hanem az UE és a független megoldó. |
| N-04 | MINOR (PARTIALLY FIXED) | BLOKK_JSON, p09b | (a) A p09b eltérés jóváhagyásra vár. (c) A JSON nincs a bemenetemben. | A megoldás szerint a JSON „ebben a válaszban szerepel”, a kapott anyagban nincs. | A CEO csatolja a BLOKK_JSON-t és a szkriptes sémaellenőrzés futási kimenetét, és döntsön a p09b-ről. Recheck: a `targetManifest` kötései, az i07 subitem-ID-k és az N-kategóriák leképezése. |
| N-05 | MINOR (OPEN) | i03, 2. hely; i07-s004; i08 „Nem elegendő” | A 0.3 kapu nyitott, és a feltételes szabály csak az i03-ra szól. | „A lexikalizált *des* mérése az s004-re szűkül”, de az s004 E01 ugyanarra az igazolatlan forrásra épül. | A feltételes szabály terjedjen ki az s004-re és az i08 „Nem elegendő” sorára. Ha a forrás nem igazolja az állítást, a *des petits pains* mérését vissza kell adni a GR-nek. Recheck: amikor a segitseg-1 válasza megérkezik. |
| **N-06** (új) | MINOR | i05 és i06, „helyes, de nem célzott” kategória | Az új kategóriarendszer nem egységes, és a terv K3 szabályát nem hajtja végre. **(a)** A terv K3 szerint az eltérő igéjű helyes válasz „nem teljes értékű, de nem hibás”. A megoldásban erre nincs sor, és a „pontlevonás nincs” szabály ellentmond a „nem teljes értékű” minősítésnek. **(b)** A *J'en prends deux* az s006-ban és az i06-ban N02-t kap, az i05 2. mezőjében viszont semmilyen kategóriát, így ott hibás feedback jön rá. **(c)** Az i06-ban az E-02 bevezetéséig a felsorolt átírásokon kívüli helyes átírás elutasított. | (a) Az i05-ben a *Oui, j'en veux bien.* (1), a *Non merci, je n'en prends pas.* (3) és a *Nous en avons pris trois.* (4) helyes, a pultnál természetes, de nincs a listán. (b) i05-2 ↔ s006-N02 ↔ i06-N02. (c) i06: *Nous ne voulons pas en prendre.* | Az i05-be kerüljön egy eltérő igéjű sor a K3 szerint. A „nem teljes értékű” és a „pontlevonás nincs” közötti ellentmondást a GR vagy a CEO döntse el. Az i05-2-be kerüljön a *J'en prends deux* az s006-N02 megfelelőjeként. Az i06-ban zárja le az E-02. Recheck: csak ezek a sorok. |

**NOTE, a súlyozásba nem számít bele:**
- **Az E-04-ről:** a javasolt stimulus krétatábla-felirat (*Ce matin : ___ petits pains aux noix…*). Feliraton gyakori a névelő nélküli alak, így a tanuló üresen hagyhatja a helyet, vagy *nos*-t írhat. Ez az N-01 problémáját az s004-ben újranyitná. A kézirat szerzője ezt vegye figyelembe; a recheck az UE és a független megoldó feladata.
- **Az E-02, E-03 és E-05:** a mérési célt nem változtatják, és illenek a tervhez.
- **Az időkeret (UE: 43–54 perc):** a terv 42 perces küszöbe szerint CEO- vagy GR-döntés kell. Ez a hatókörömön kívül esik, csak jelzem.

## NEM VIZSGÁLT, illetve hiányzó bemenet

- **BLOKK_JSON és `targetManifest`:** nincs a bemenetemben (N-04).
- **A séma** (`block.schema.json`): nem láttam; a `visibleAfter`-re vonatkozó állítás a szerzőé.
- **Az OQLF-lap:** nincs megnyitva, a segitseg-1 válaszára várunk (N-05).
- **Az E-01 és az N-02 fix:** részben saját javaslatom, ezért másik ellenőr nézze (UE, független megoldó, PE).
- **Hatókörön kívül, nem minősítettem:** a feedbackek és a C minta nyelvi és szakmai minősége (PE, NyE), valamint a « » jelölés és a szóközök (HE).

## Változáslista, bizonyíték, következő címzett

- **Változáslista:**
  - N-02, N-03: FIXED;
  - N-01, N-04: PARTIALLY FIXED;
  - N-05: OPEN;
  - új: N-06 (MINOR).
- **Új bizonyíték:**
  - saját, kulcs nélküli megoldásom az i07 s001, s003 és s004 subitemjére (zárt lista ↔ helyes, de fel nem sorolt kitöltés);
  - a szintrendszer kombinációs bejárása;
  - a terv K3 kockázatának összevetése az i05 kategóriáival;
  - a JSON hiányának megállapítása.
- **Újrahasznosított bizonyíték:**
  - a kulcsok egyezése az előző körből: a kulcs nem változott;
  - a 0.1 kapu naplósora.
- **Következő címzett:** CEO.
  - N-01: a kézirat szerzőjéhez (E-01), a recheck az UE-é és a független megoldóé;
  - N-04: CEO (JSON, p09b);
  - N-05: NyE, a segitseg-1 válasza után;
  - N-06: a megoldásíróhoz, a K3 ellentmondás a GR-hez vagy a CEO-hoz;
  - N-02: lezáró recheck a PE-nek vagy az UE-nek.

**Tanulság:** ha egy ideiglenes „helyes, de nem célzott” kategória zárt listával dolgozik → a nyílt instrukció mellett mindig marad fel nem sorolt helyes válasz → ezért az ideiglenes kezelés vagy szabály legyen (pozíció és szófaj szerint), vagy a fázis ne zárulhasson le, amíg a kézirat instrukciója nem zárt → minden zárt item, amelynek a javítása az instrukción múlik.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 3
GEPI_OSSZEGZES_VEGE