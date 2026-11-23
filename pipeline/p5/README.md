# P5 — blokkformátum és gépi kapuk

A P5 első változata (P5-terv 2–3. pont): a blokk utolsó P4-agentjének kimeneti formátuma (`block.<ID>.json`), a determinisztikus kapuk, a v2 fordító, a heti építés (átvétel → fordítás → migráció → előnézet + bejárás → ledger) és a visszaállítás. Nyilvános közzététel nincs bekötve (Áron engedélye kell). Függőség nélkül fut, Node 20+; a bejáráshoz Playwright kell (ha nincs, a hét `BUILT_UNCRAWLED`).

```
node p5/gates.mjs <week.json | block.<ID>.json> --handoffs <kéziratmappa> [--json <fájl>|-] [--all]
node p5/bind.mjs  <week.json | block.<ID>.json> --handoffs <kéziratmappa> [--write]
node p5/week-build.mjs p5/weeks/week-01.plan.json [--out p5/out] [--no-crawl]
node p5/week-build.mjs --rollback 1 [--out p5/out]
cd p5 && npm test
```

Kilépési kód: 0 = `GATE_PASS`, 1 = `GATE_FAIL`, 2 = használati hiba. A szöveges jelentés egységenként csoportosít, a `--json` minden findingot tartalmaz (`cl`, `severity`, `location`, `message`, `text`).

## Fájlok

| Fájl | Mi |
|---|---|
| `schema/block.schema.json` | A blokkforrás sémája, a v2 szerződés (`course-contract/schema.js` 2.0.0) block/page/item részéhez igazítva; plusz kulcs, alternatívák, feedback, kézirat-hivatkozás (`manuscriptRef`), brief és review-kötés tartalom-hash-sel. |
| `examples/block.w01-u-3-2.json` | Kézzel kitöltött minta a (3,2) review-zott kéziratláncából (alapkézirat + overlay + v2). |
| `playable-types.json` | A játszható típusok **egyetlen** forrása: a v1.1 szabályok az app `render.js`/`answers.js`-éből (codex-ág, 6167dfc), a v2 rész a P1-katalógusból. A P1 lezárásakor csak ezt kell frissíteni. |
| `gates.mjs`, `lib/` | A kapuk és a parancssor. |
| `bind.mjs` | Review-kötés kitöltése (fájl-hash-ek + tartalom-hash). Nem ellenőriz, csak rögzít. |
| `lib/compile.mjs` | Fordító: blokkok → v2 heti csomag (`course.json`) + kísérő `presentation.json` (feedback, utasítás, régi→új ID-térkép; a v2-ben ezeknek nincs helye). Amit nem tud leképezni: `NEEDS_CAPABILITY`. |
| `vendor/course-contract/` | A v2 szerződés rögzített másolata (codex 6167dfc) ajv helyett saját sémaellenőrzővel; a codex DEMO-csomagját érvényesnek fogadja el. |
| `week-build.mjs`, `lib/preview.mjs`, `lib/crawl.mjs`, `lib/release.mjs` | Heti építés: előnézet (statikus HTML), bejárás alapból a **valódi webappon** (`lib/app-crawl.mjs` → `webapp/tools/crawl.mjs`: kulcsvezérelt végigjátszás 390/1280 px-en, offline és mentés is; ha a webapp függőségei nincsenek telepítve, vagy `--preview-crawl`: az előnézeten, képernyőképekkel), `release-ledger.json` → `RELEASE_STATUS.md` és `weeks-status.json` (generált, a projektkövetőnek), `weeks-manifest.json` mutató, visszaállítás. Közzététel: `docs/P5_KOZZETETEL.md`. Állapotok: `RELEASED`, `GATE_FAIL`, `REJECTED_INPUT`, `NEEDS_CAPABILITY`, `BUILT_UNCRAWLED`, `ROLLED_BACK`. |
| `weeks/week-01.plan.json` | Az 1. hét terve (blokklista, brief-ID, kéziratmappa, migrációs térkép). |
| `blocks/w01/` | A P3-előkészítés blokkforrásai a meglévő REVIEW_PASS kéziratokból: (1,4), (2,1), (2,4), (4,1), (4,2), (5,1), (5,2); a (3,2) a `examples/`-ban. Mind GATE_PASS (`test/blocks.test.mjs`). |
| `tools/app-crawl.mjs` | Bejárás a **valódi P1-könyvtárban** (codex-ág appja, DEMO névtérbe tükrözve), csak eldobható munkapéldányon. 2026-10-06: a 8 blokkos 1. hét mind a 71 oldala megjelent, JS-hiba nélkül; a codex-ág kanonikus validátora (`app/scripts/validate-course-contract.mjs`) is érvényesnek fogadta el a csomagot. |
| CEO | `node ceo.mjs run full --p5` (megoldásíró blokk-JSON + P5-kapu javítási körökkel), `node ceo.mjs run p5-het` (heti építés, értesítéssel). |
| `test/fixtures/week-01.cl-2026-10-03.json` | A CL-lista alapjául szolgáló week-01.json változatlan másolata (codex-ág, sha256 `0971794f…`); viszonyítási alap, nem a P3. |
| `test/fixtures/mini/` | Kis, javított, szintetikus tesztcsomag saját kézirattal; minden kapun átmegy. |

## Kapuk

| CL | Kapu | Mit néz |
|---|---|---|
| SCHEMA | séma | csak P5 blokknál; hibás szerkezetnél a többi kapu nem fut |
| CL-01 | review-kötés + hűség | van-e `<ID>.review-pass.md` REVIEW_PASS-szal; a kötés fájl-hash-ei és tartalom-hash-e egyezik-e; minden tanulói szöveg, kulcs és alternatíva megvan-e (szóköz-, aposztróf- és idézőjel-normalizálva) a review-zott kéziratláncban; a kézirat címsoraiban szereplő oldal/item/modell-azonosító megvan-e a csomagban |
| CL-02 | statikus játszhatóság | nem játszható itemtípus, megjeleníthetetlen blokk, üres oldal, oldal nélküli teszt (v1.1); sablon, képesség, válaszforma és kulcs összhangja (v2) |
| CL-04 | válasz-épség | töredékes elfogadott válasz („e gamme”) = hiba; ismétlődő alternatíva és névelő nélküli szókincsválasz = figyelmeztetés |
| CL-06 | egyetlen elfogadott válasz | begépelős, legalább 3 szavas válasz egyetlen elfogadott alakkal = figyelmeztetés |
| CL-07 | rejtett adat a kulcsban | a kulcs olyan számot vár, ami a feladat szövegében (prompt, utasítás, az egység olvasott szövegei, tokenek; magyar számnév is) nincs |
| CL-08 | brief-megfelelés | a modellekben megvan-e minden kötelező nyelvi elem és writingeszköz, a szószám a tartományban van-e, nincs-e tegezés vous-briefnél |
| CL-18 | meta-tokenek | `approved`, `chunk`, `w01-`, `_subitem`, `MODE TEST` tanulói szövegben (és nem játszható itemnél a kiírt típusnév) |

## A kéziratlánc

A `<ID>.review-pass.md`-ből indul, mindig hozzáveszi Áron tulajdonosi döntéseit (`<ID>.owner-*.md`, pl. a „chunk” → „expression” csere), és tranzitívan hozzáveszi az ugyanazzal a blokk-ID-vel kezdődő, hivatkozott szerzői fájlokat (revision, overlay, draft). A reviewerek saját jelentései (`independent-review`, `targeted-recheck`, `final-review`) nem kéziratok, mert hibás szöveget is idézhetnek. A fájl-hash sorvége-normalizált (LF) szövegre készül, így Windows-on is egyezik.

Ha egy új, teljesen átírt kézirat a régi overlay-ek helyére lép, a review-pass ezt egy sorban mondja ki: `Felváltja: <ID>.owner-….md, <ID>.owner-….md`. A felsorolt fájlok (és a csak rajtuk át elért fájlok, pl. a régi `revision-for-recheck`) nem részei a láncnak, de a mappában megmaradnak előzménynek. Csak létező `<ID>.owner-*.md` nevezhető meg, más név CL-01 hiba; a kapu minden futáskor figyelmeztetésben listázza a felváltott fájlokat. A sor a review-pass része, ezért felvétele után újra kell kötni a blokkot (`node p5/bind.mjs`). Hogy a felváltott overlay tulajdonosi döntései érvényben maradnak-e, azt Áron dönti el.

## Ismert korlátok

- A hűségkapu a szöveg *jelenlétét* nézi; azt, hogy a csomag a kézirat *minden* tanulói szövegét átvette-e, csak az azonosítók szintjén ellenőrzi (címsorbeli ID-k).
- A CL-02 statikus: a renderelő szabályait utánozza, nem futtatja az appot (a böngészős bejárás a P5 későbbi lépése).
- A CL-07 csak számokat keres; ha az egység külső hangátiratra épül, csak figyelmeztet.
- A `MODE TEST` felirat és a „prérequis : w01-…” az app kódjából jön, nem az adatból; ezeket az adatkapu nem látja.
- A fordító technikai kerete: ha a kézirat mondatszámmal ad terjedelmet, a v2 `wordRange` 30 szó/mondat; ha szóbeli válaszhoz nincs időtartam, 1–180 mp. Mindkettő `…Derived` jelöléssel a `presentation.json`-ban, a tanuló nem látja.
- A v2 szerződésben nincs feedback- és utasításmező; ezek a `presentation.json`-ba kerülnek (szerződéshiány, a P1-gazdának jelezni).
