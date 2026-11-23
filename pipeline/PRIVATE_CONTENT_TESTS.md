# Tests that need the private course content

The private repository runs 253 CEO tests and 156 P5 tests. The tests listed here read course files that are not
in this public copy: the week-1 manuscripts and briefs (`editorial/week-01/…`), the pilot quality-run inputs
(`starter-kits/pilot/…`), the frozen week-1 handoffs and baseline used by `p5/test/gates.test.mjs`, the app
(`webapp/`), or the private relay, e-mail and dashboard modules that were removed. `npm test` in `pipeline/`
skips them by name and reports the skips; nothing else is skipped.

## Whole test files not copied or not run

- `ceo/test/kozvetlen.test.mjs`, `pe-keret.test.mjs`, `tobbfutas.test.mjs`: import the removed relay, e-mail and dashboard modules.
- `ceo/test/glossza-teljes.test.mjs` and `ceo/tools/glossza-teljes.mjs`: need the app renderer (`webapp/`).
- `ceo/test/relay|notify|iranyitopult|felmeres|hibak-cli|eszkoz-jelentes|hang|hatter.test.mjs`: test removed modules.
- `p5/test/gates.test.mjs`, `blocks.test.mjs`, `glosses.test.mjs`, `field-alternatives.test.mjs`: read the week-1 blocks and handoffs.
  `pipeline/test/example.test.mjs` runs the gates on the public U21 example and the synthetic mini week instead.
- `p5/test/build.test.mjs`, `app-crawl.test.mjs`: need the app and Playwright.

## CEO tests skipped by name

- BLOKK_JSON-lépés: a P5-séma, -minta és -katalógus a munkamappába kerül; --ujrafuttat elveti és újrafuttatja a lépést
- GT1 (nyelvtani záróteszt): 24 item a kulccsal és az újrapróba-változattal, a javított egységek itemjei; zaj nélkül
- P5-kapu: a szerződéshiba a CL-01-hibákkal egy körben jön (11-15; az 1. héten külön kört vitt el)
- R11 régi kézirata olvashatóan renderelve: öt bekezdés, mind a 20 item, a meglévő kulcsokkal
- U53, U12, U34: a régi kézirat olvashatóan, zaj nélkül; a tanári szakasz és a hatókör megvan
- VT1 (szókincs-záróteszt, statikus): rögzített 50/50 irány adagonként fele-fele, legfeljebb 4-es futam, ismételhető; a válaszszabályok csatolva
- a valódi szerepcsomagokban megvan a megbízási blokk
- eszkaláció utáni megoldáskör: különbözeti leadásnál teljes újraleadás, és az kerül a kimenetbe (U31)
- eszkaláció: a körkeret után elakadt kéziratjavítás fázisdöntéssel folytatható (kezirat-e<n>-dontes.md, ELFOGADVA)
- eszkaláció: ha a PE miatt van javítási kör, a megoldás NyE-je akkor is újranéz (a PE javaslatából átvett szöveg)
- extractPages a valódi írói válaszból csak az oldalakat adja
- full --p5: a megoldásíró blokk-JSON-ja a P5 kapuin átmegy, a CEO kitölti a review-kötést
- full --p5: kitalált mondat → P5-javítási kör → PASS; ha marad, BLOCKED_P5_GATE
- full --ref teljes: az író, a PE és a megoldásíró is megkapja a referenciát
- full --solver: a megoldó problémái visszamennek → szerző javít → PE-recheck → megoldásíró → megoldó újra
- full --solver: gépi összegzés nélküli megoldói válasznál megáll
- full --solver: ha a probléma a javítás után is marad, a lánc nem COMPLETED, hanem megáll
- full --solver: ha a szerző szerint a kézirat jó (KEZIRAT_VALTOZATLAN), nincs PE-recheck, csak a kulcs bővül
- full --solver: üres problémalista → COMPLETED, nincs visszacsatolási kör
- full agent-módban: író → PE → javítás → recheck → megoldásíró, mindenhol a megfelelő agent
- full segítségkéréssel, válasz nélkül: a lánc várakozás és újrahívás nélkül végigmegy, egy értesítéssel
- full: PASS minor findinggal → egy javítási kör a minorokra, utána tovább
- full: REVISION → javítás → recheck PASS, a javító megkapja a korábbi választ és a jelentést
- full: a hívási korlát a lánc közepén is megállít
- full: első PE-kör PASS → nincs javítási kör, a GI1-4 csak az oldalakat kapja
- full: gépi összegzés nélküli szerzői válasz nem megy tovább a PE-hez
- full: ha a döntés után a kézirat változatlan, nincs PE-recheck, a megoldásíró a döntéssel folytat
- full: ha a szerző döntést kér, a lánc megáll, a kérdés a jelentésbe kerül; a döntés után ugyanott folytatja
- full: két sikertelen kör után megáll emberi döntésre, nem pörög tovább
- full: makacs minor nem pörget: egy minor-kör után a megmaradt minor a jelentésbe kerül
- full: értelmezhetetlen review-nál megáll
- fázisdöntés ELFOGADVA sorral: a megnevezett ellenőr nyitott jelzése elfogadva, új kör nélkül; a review-pass jelzi
- fázisdöntés „elfogadom” válasszal (11-15): minden nyitott jelzés elfogadva, új kör nélkül
- fázisdöntés: a körkeret után elakadt terv a PRESIDENT döntésével egy további körben folytatódik
- fázisdöntés: ha a döntéses kör is elakad, újabb döntés (<fázis>-d1-dontes.md) egy további kört ad
- javítás eszkalációval: a szerző célzottan javít, PE + az érintettek recheckje (NyE csak a megoldásban), majd a megoldásíró folytat
- javítás mód: a megoldásfázis javító köre javításlistás, a kimenet megoldas.md-je az összefésült megoldásból készül
- javítás: a kéziratfázisban hat a PE-szabály — két foltozás után újraírás, és csak a végén kerül ki a kimenet
- javítás: ismeretlen egység → érthető hiba; elakadásnál nincs kimenet a repóban
- javítás: terv → új kézirat → megoldás → kimenet; kettős PE mindkét ellenőrzési fázisban, a megoldó Claude-dal
- p5-het: a P5 heti építés a CEO-ból fut, a hét állapota a kimenet
- próbafutás: nem hív modellt, de minden lépés promptját elkészíti
- referenciakészlet: a „merce” a pilotpéldák nélkül, a „teljes” velük; a replay-pe02 nem kaphat pilotpéldát
- replay-gi1-4 agent-módban, Claude-agent megoldóval: a megoldó csak a feladatlapot kapja, --agent kapcsolóval
- replay-gi1-4 megoldóval: a megoldó nem látja a szerzői megjegyzést, a várt kulcsok ellenőrizve
- replay-javitas agent-módban is fut, és a pilotpéldák nem mehetnek ki
- replay-javitas: az író a kézi első válaszát és a kézi PE-02 jelentést kapja, utána célzott recheck
- replay-pe02 agent-módban: ugyanaz a megbízás és melléklet, de a 235 KB-os szerepcsomag helyett az agent
- replay-pe02: a valódi PE-02 csomagot küldi el, gépi összegzéssel, és összeveti a kézi eredménnyel
- stripAuthorNotes a valódi SOLUTIONS-INPUT-ból minden szerzői megjegyzést kivesz, a feladatot meghagyja
- t27Unit: a review-zott kézirat és megoldás a bemenet, a CL-27 jelzések a kifogás, az S8 is benne
- t27Unit: az élő review-pass Felváltja-sora öröklődik (U32), overlay nélkül üres (U22); a review-pass rögzíti
- t27Unit: egység S-tétel nélkül is működik (U22), a T27-tábla akkor is benne
- utódöntés: kész egységre adott PRESIDENT-döntés visszautalt tétel nélkül is lefuttat egy célzott kört
- v2-szerződés: a még el nem készült helyi hang a láncban HIANYZIK-figyelmeztetés, az átvételnél hiba
- v2-szerződés: a még hiányzó ABX-hangok helyőrzői nem esnek egy címre (nincs hamis ABX_ASSET_IDENTITY)
- végső teljességi próba: körönként apránként fogyó megoldás sem lehet a végső megoldas.md (BLOCKED_INCOMPLETE_SOLUTION)
