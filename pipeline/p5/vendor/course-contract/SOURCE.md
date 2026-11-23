# Rögzített másolat — v2 tartalmi szerződés

- Forrás: `origin/codex/p1-01-common-base` @ `6167dfc`
- Fájlok: `app/src/data/course-contract.js`, `app/src/data/course-contract/schema.js`, `app/src/data/course-contract/catalog.js` (változatlanul).
- `week-schema.js`: P5 shim (az ajv helyett a `p5/lib/schema-validate.mjs`).
- Frissítés: ha a P1 lezárul vagy a szerződés változik, ezt a három fájlt kell újra bemásolni. Kézzel ne szerkeszd.

## P5-bővítés: `submission` (2026-10-29, Áron döntése)

A rögzített másolat **egy jóváhagyott eltéréssel** tér el a forrástól (`docs/DONTESEK.md` 10-29, `docs/app/V2_SZERZODES_IGENY_2026-10-29.md`):
- új megoldástípus: `{ "type": "submission" }`, kulcs nélkül, kizárólag `formative` / `formative-only` itemhez (`SUBMISSION_FORMATIVE_ONLY`);
- kivétel az `EXACT_SOLUTION_REQUIRED` alól;
- csak a `2.0.1` sémaverziójú csomagban érvényes (`SUBMISSION_CONTRACT_VERSION`). A `2.0.0` változatlan.

Miért `2.0.1`, és nem `2.1.0`: a P1 jelenlegi szerződésében (`app/src/data/course-contract.js`) a `2.1.0` már foglalt, mást jelent (engines, workflowVersion). Ezt a változást a P1-be még **nem** vittük át. Újbóli bemásoláskor ezt a bővítést meg kell tartani, vagy a P1-nek át kell vennie.

## P5-bővítés: francia ár- és számírás (2026-10-29, Áron NYE-U34M-02 döntésének végrehajtása)

Második jóváhagyott eltérés (`docs/DONTESEK.md` 10-29, `docs/app/V2_SZERZODES_ARIRAS_2026-10-29.md`):
- a `normalization` objektum két új, opcionális logikai mezője: `numbersFr`, `pricesFr`;
- csak a `2.0.2` sémaverziójú csomagban érvényes (`PRICES_CONTRACT_VERSION`; máshol `NORMALIZATION_FLAG_VERSION`);
- a `2.0.2` a `2.0.1` bővítését (`submission`) is tartalmazza. A `2.0.0` és a `2.0.1` változatlan.

Ezt sem vittük át a P1-be (`app/src/data/course-contract.js`); újbóli bemásoláskor meg kell tartani.

## P5-bővítés: mesterszintű teszt (2026-11-09, a GT1 app-igénye, Áron C döntése)

Harmadik jóváhagyott eltérés (`docs/DONTESEK.md` 11-09, `docs/app/V2_SZERZODES_MESTERSZINT_2026-11-09.md`):
- új teljesítési mód: `completion.mode: "mastery"`. Csak a `2.0.3` sémaverziójú csomagban érvényes (`MASTERY_CONTRACT_VERSION`; máshol `COMPLETION_MODE_VERSION`);
- a kötelező itemek az alapitemek; a változatot a meglévő `repetition.retryItemRefs` köti hozzájuk;
- új szabályok: `MASTERY_SCOPE`, `INCOMPLETE_COMPLETION` (mesterszintnél), `MASTERY_RETRY_REQUIRED`, `RETRY_SCOPE`, `MASTERY_FIRST_ATTEMPT`;
- a `schema.js` sémaverzió- és completion-enumja bővült;
- a `2.0.3` a `2.0.1` (`submission`) és a `2.0.2` (`numbersFr` / `pricesFr`) bővítését is tartalmazza. A korábbi verziók változatlanok.

Ezt sem vittük át a P1-be (`app/src/data/course-contract.js`); újbóli bemásoláskor meg kell tartani.

## P5-bővítés: választható út és támogatott zárás (2026-11-13, az U54 app-igénye, Áron döntése)

Negyedik jóváhagyott eltérés (`docs/DONTESEK.md` 11-13, `docs/app/V2_SZERZODES_UTVALASZTAS_2026-11-13.md`):
- új blokkmező: `paths` (`choicePageRef`, `options[{ id, label, pageRefs, recommended? }]`);
- új teljesítési mód: `completion.mode: "resolved"`;
- új ismétlésmező: `repetition.supportedClosure`;
- mindhárom csak a `2.0.4` sémaverziójú csomagban érvényes (`PATHS_CONTRACT_VERSION`; máshol `PATHS_VERSION`, `COMPLETION_MODE_VERSION`, `SUPPORTED_CLOSURE_VERSION`);
- új szabályok: `RESOLVED_NEEDS_CLOSURE`, `SUPPORTED_CLOSURE_SCOPE`, `PATH_SCOPE`, `PATH_ORDER`, `PATH_OVERLAP`, `PATH_EMPTY_COMPLETION`, `PATH_RETRY_SCOPE`;
- a `mastery` szabályai (kötelező alapitem, nem kötelező változat) a `resolved` módra is érvényesek, a `MASTERY_FIRST_ATTEMPT` kivételével;
- a `PV-feedback-retry` oldalon bármely képességű újrapróba-változat állhat (`CAPABILITY_VARIANT` kivétel, csak 2.0.4-ben);
- a `schema.js` sémaverzió-, completion- és repetition-része bővült, és új `paths` definíciót kapott;
- a `2.0.4` a `2.0.1`–`2.0.3` bővítéseit is tartalmazza, a korábbi verziók változatlanok.

Ezt sem vittük át a P1-be (`app/src/data/course-contract.js`); újbóli bemásoláskor meg kell tartani.

## P5-bővítés: kulcs nélküli, nem pontozott írás (2026-11-14, az U54 t02 app-igénye)

Ötödik eltérés (`editorial/week-01/javitas-2026-10/U54/APP_IGENY_KULCS_NELKULI_SZOVEG.md` a `claude/ceo-javitas` ágon):
- a `RUBRIC_REQUIRED` szabály alól kivétel a `writing` válasz `submission` megoldással. A `submission` továbbra is csak `formative` / `formative-only` itemen érvényes (`SUBMISSION_FORMATIVE_ONLY`), és csak a `2.0.1`+ csomagban (`UNKNOWN_SOLUTION`), ezért nincs új sémaverzió;
- a nyílt írás többi szabálya változatlan (`WRITING_POLICY`, `REVISION_BINDING`, `FULL_REVISION`); beszédre (`speech`) a kivétel nem vonatkozik.

Miért: a kézirat `submission_unscored` írásos iteméhez nincs értékelési szempont, rubrikát adni kitalált tartalom lenne; a `CAP-writing` képességhez csak `writing` válasz tartozhat.

Ezt sem vittük át a P1-be (`app/src/data/course-contract.js`); újbóli bemásoláskor meg kell tartani.
