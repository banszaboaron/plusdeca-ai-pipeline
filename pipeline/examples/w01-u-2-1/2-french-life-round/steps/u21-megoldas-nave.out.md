# NavE-jelentés: U21 (w01-u-2-1), az itemek megoldási adatai, T27 nyelvi kör

**Szerep és megbízás:** NavE. Azt nézem, hogy minden item-ID-hoz megvan-e a teljes megoldási adat, és hogy a mérési cél egyezik-e a tervvel és a régi itemmel.

**Bemeneti változat:**
- Megoldás 6. változat, T27 kör;
- BLOKK_JSON, de csak a tanulói szövegek helyjelölt kivonata;
- összevetési alap:
  - az élesben futó megoldás 5. változata;
  - a régi P5-blokk;
  - az elfogadott GR-terv 2. változata, D1–D4;
  - a befagyasztott új T27-kézirat.

**Hatókör:** i01–i08, ezen belül az i05-s001–s004 és az i07-s001–s006 subitemek, összesen 16 `requiredRefs`. A rubrika magyar–francia nyelvi helyessége nem az én hatásköröm (NyE). Ugyanígy nem az enyém az idézőjelek és a nem törő szóköz tipográfiája (HE), és a szakmai minőség sem (PE). Ezekről csak NOTE-ot adok. Korábbi NavE-findingom erre a változatra nincs, ezért ez nem recheck.

---

## 1. A megoldási adatok teljessége item-ID-nként

| Item-ID | Kulcs | Altern. / rejected | Feedback (correct / incorrect / targeted) | Eltérés az 5. változathoz képest | Állapot |
|---|---|---|---|---|---|
| i01 | minta ×2 és keyDescription | – (szemantikus) | OK + E01–E04 | csak idézőjel; az elutasított minták csak a markdownban szerepelnek (szerzői adat) | ✓ |
| i02 | A | opciók a–d | OK + B, C, D | csak idézőjel | ✓ |
| i03 | d' / des | 3 / 7 | OK, incorrect, E01–E06, F01 | csak idézőjel | ✓ |
| i04 | beaucoup de / des | 3 / 4 | OK, incorrect, E01–E05 | csak idézőjel | ✓ |
| i05-s001 | J’en prends. | 12 / 4 | incorrect, E01–E04, N02, N03, N05 | csak idézőjel | ✓ (lásd NOTE-3) |
| i05-s002 | Je vais en prendre deux. | 4 / 6 | incorrect, E05–E08, F01 | csak idézőjel | ✓ |
| i05-s003 | Je n’en veux pas. | 9 / 4 | incorrect, E09–E11, N02, N05 | csak idézőjel | ✓ |
| i05-s004 | Nous en avons acheté trois. | 10 / 4 | incorrect, E12–E15, N01, N04, N05 | csak idézőjel | ✓ |
| i06 | 2 mező | 1 / 18 | OK, incorrect, A01, E01–E05, F01–F06 | címke: *Le brouillon* (deklarált kivétel, a) | ✓ |
| i07-s001 | du | 1 / 10 | OK, incorrect, E01–E05, F01 | új, *vous*-os közös utasítás | ✓ |
| i07-s002 | du | 1 / 3 | OK, incorrect, E01–E03 | ua. | ✓ |
| i07-s003 | d' | 2 / 9 | OK, incorrect, E01–E04, F01 | ua. | ✓ |
| i07-s004 | des | 1 / 10 | OK, incorrect, E01–E04, F01 | ua. | ✓ |
| i07-s005 | de | 1 / 4 | OK, incorrect, E01–E03 | ua. | ✓ |
| i07-s006 | Je vais en prendre trois. | 5 / 6 | OK, incorrect, E01–E04, N01, F01 | a *→ Transforme avec en.* átkerült az utasításba (deklarált kivétel, c) | ✓ |
| i08 | rubrika A–D, Niveaux, notSufficient ×5 | – | E01–E05 | francia rubrika; a *Réponds-lui.* átkerült (deklarált kivétel, b) | ✓, két MINOR-ral (V-01, V-02) |

A kulcsok, az alternatívák, az elutasított alakok, a kiváltók és a feedback-ID-k tételesen egyeznek az 5. változattal. A feedbackszövegek tartalma is egyezik, csak a « » helyén áll „…”, és az aposztróf lett ’. Szúrópróbát minden itemből vettem, az i05-ből és az i06-ból teljes összevetést végeztem.

## 2. A mérési cél: terv → régi item → új utasítás → megoldás

| Item | Kiosztott / régi mért cél | Az új utasítás ugyanazt kéri? | A megoldás kategóriái illeszkednek? | Állapot |
|---|---|---|---|---|
| i01 | partitív *du* ↔ *de + le* | igen; a válasz nyelve látható lett (GR-T27-01), a mérés nem változik | igen | ✓ |
| i02 | *revenir du* | igen | igen | ✓ |
| i03 | *d’* + elöl álló melléknév; lexikalizált *des* | igen; a zárt készlet « » között áll, betűre egyezik | F01 és incorrect: „de”, „d’”, „des” | ✓ |
| i04 | *beaucoup de* / *beaucoup des* | igen | igen | ✓ |
| i05 | az *en* helye, a szám megmarad | igen; *Remplacez le complément de quantité par « en »*, a művelet azonos | a mezőnkénti mért szerkezet változatlan | ✓ |
| i06 | hibajavítás szerkezetmegtartással | igen; a *corrigez seulement l’erreur* és a *gardez tous les autres mots* szó szerint megvan (E-02) | F01–F06 erre épül | ✓ |
| s006 | *je vais* + *en* + infinitif + szám | igen; ugyanaz a műveletnév, mint az i05-ben, és teljes mondatot kér (N-03) | F01 („je vais + infinitif”) illeszkedik | ✓ |
| i08 | integrált írás, 6 nyelvi és 6 tartalmi kritérium | igen; *Camille et vous* (N-04) | a rubrika A, C, D és Niveaux része 1:1; B2 eltér (V-02); a szerkezet eltér (V-01) | részben |

Új, ki nem osztott cél nem került be, és jóváhagyás nélküli célszűkülést sem találtam.

## 3. Findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| NavE-T27-V-01 | MINOR | i08 › `solution.criteria[0].requirements` | A rubrika A területén 7 elem áll 6 helyett. A `requirements[0]` egy bevezető mondat („1 point par critère si…”), nem kritérium. Ezzel sérül a terv 5.4 pontja, amely szerint a kritériumszám 1:1 marad. Ha a dual-gate értékelő vagy a CEO-szkript elemet számol, 6 pont mellé 7 követelményt lát. | 5. változat: 6 requirement. 6. változat: requirements[0]–[6]. | A bevezető mondat kerüljön a `label`-be vagy külön mezőbe, a `requirements` maradjon 6 elem, sorrendben (1)–(6). | NavE (a szerkezet), CEO-szkript |
| NavE-T27-V-02 | MINOR | i08 › rubrika B, 2. elem | A követelmény tartalma szűkült vagy lazult, nem 1:1. A régi „legalább egy **anyagnévvel** meghatározatlan mennyiségben” helyén most „au moins un produit en quantité non précisée” áll, vagyis kimaradt az anyagnév (nom massif) feltétele. Így egy *des tomates* is teljesíti a B2-t, holott a régi követelmény a partitív *du*-hoz kötött anyagnevet kérte. | Az 5. változat rubrikájának B sora, összevetve a 6. változat B sorával és a JSON criteria[1].requirements[1] mezőjével. | Az anyagnév-feltétel kerüljön vissza franciául, például: « avec au moins un nom de matière (non comptable) en quantité non précisée ». A pontos szóválasztás a NyE dolga. | NavE, NyE |

## 4. NOTE-ok (nem kötelező javítás, más ellenőrnek)

- **NOTE-1 (NyE, UE):** a Niveaux bevezetőjében a „le premier niveau **atteint** décide” egybeesik az *Atteint* szintnévvel, ezért félreolvasható. Lehetséges csere: « le premier niveau dont les conditions sont remplies ».
- **NOTE-2 (HE):** a megoldás 1. részében, a feltételes szabály 2. pontjában dupla szóköz áll: «  de petits pains ». A kulcsok és a rejected-alakok (`d'`, `1 = beaucoup d'`, `d' (2)`) egyenes aposztróffal maradtak, miközben a szöveg azt állítja, hogy „a francia alakokban ’ áll”. A normalizálás miatt ez nem érinti a kulcsegyezést.
- **NOTE-3 (CEO, a T27 előtti állapot):** az i05-s001–s004 subitemekhez a JSON-ban nincs `feedback.correct`. A markdown „Helyes válaszra” szövege nem került át. Ez az 5. változatban is így volt, a T27 nem okozta, ezért nem nyitom újra. A „második nem egyező válasz után látszik a kulcs, a helyes válaszra adott feedback mondatával” szabály ezeknél a mezőknél így nem teljesül.
- **NOTE-4 (CEO):** az A terület `label` mezőjében a „(allCriteria)” belső token szerepel tanulói szövegként. Ez már korábban is így volt.

## 5. NEM VIZSGÁLT, illetve hiányzó bemenetek

- **A BLOKK_JSON nem szöveges mezői:** `targetRefs`, `evaluation`, `normalization`, `completion`, `capability` és `variant`. A kivonat csak a tanulói szövegeket tartalmazza, ezért ezek változatlanságát nem tudtam ellenőrizni. A szerző azt állítja, hogy nem változtak, de ez nem bizonyíték. Kérem a teljes JSON-t vagy egy CEO-diffet.
- **Séma- és CL-27-futás:** futási bizonyíték nincs a bemenetben.
- **A FR-megbízás és a GR oszlopterve:** nem volt a bemenetben. A célkiosztást a GR-terv 2. részéből és a régi blokk `taughtTargetRefs` mezőjéből vettem.

## 6. Összegzés

Mind a 16 item-ID-hoz megvan a megoldási adat. A kulcsok, az elfogadási kategóriák és a feedback-ID-k változatlanok, és a három deklarált stimulusváltozás nem érinti a mért szerkezetet. Az i08 francia rubrikájában két MINOR eltérés van: a kritériumszám (V-01) és a B2 tartalma (V-02). BLOCKER és MAJOR nincs, ezért a verdikt REVIEW_PASS; a két MINOR a megoldásíróhoz megy javításra.

**Bizonyíték:**
- tételes összevetés a megoldás 5. változatával és a régi P5-blokkal;
- a megoldás 6. változatának és a JSON-kivonatnak a soronkénti összevetése a GR-terv D1–D3 pontjával és a T27-kézirat utasításaival.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 2
GEPI_OSSZEGZES_VEGE