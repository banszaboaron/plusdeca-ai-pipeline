# CEO-vezérlő — pilot

A P4 szerepeket automatikusan futtatja, fej nélküli munkamenetekben. Minden szerep külön, tiszta munkamenetet kap (`codex exec`, a független megoldó opcionálisan `claude -p`). Nincs kézi chat-továbbítás, és nem vezérli a ChatGPT webes felületét.

A szerep kétféleképpen kaphatja meg a szerepleírását (`--roles`):

- `package` (alap): a régi teljes szerepcsomag (`../starter-kits/packages/`), ahogy a kézi próbákban;
- `agent`: a generált agent (`.codex/agents/`, `.claude/agents/` a repó gyökerében) — az új szervezet szerint, és jóval kisebb kontextussal (a PE-nél 246 KB helyett kb. 44 KB).

Ez **pilot**: csak a már kézzel lefuttatott minőségi próbalánc (GI1-3 → PE → GI1-4) automatikus változata, hogy összevethető legyen a kézi ChatGPT-s eredményekkel. Tananyagot, kódot nem módosít, nem pushol, és fizetős API-t sem használ.

## Láncok

| Lánc | Mit csinál | Mivel vetjük össze |
|---|---|---|
| `replay-pe02` | A PE ugyanazt a kézi GI1-3 első választ kapja, mint a kézi PE-02 próbában (`PE-02-TESZT.md`). 1 hívás. | `pilot/quality/results/pe02-round1/response.txt` |
| `replay-gi1-4` | A GI1-4 ugyanazt a befagyasztott bemenetet kapja (`GI1-4-TESZT.md`). A hat várt kulcsot gépileg ellenőrzi. `--solver claude`-dal a független megoldó is fut, a szerzői megjegyzések nélkül. 1–2 hívás. | `pilot/quality/results/gi1-4-round1/response.txt` |
| `replay-javitas` | A javulás mérése: az író a kézi első válaszát (`gi1-3-round1`) és a kézi PE-02 jelentést kapja → javít → a PE célzottan újraellenőriz. 2 hívás. | `results/gi1-3-round2`, `results/pe02-round2` |
| `full` | Friss lánc: GI1-3 ír → PE ellenőriz → legfeljebb 2 javítási kör (javítás + célzott recheck; PASS mellett a minor findingok is visszamennek egy körre) → GI1-4 megoldás → opcionálisan független megoldó, **visszacsatolással**: ha a megoldó problémát jelez, a szerző javít (vagy `KEZIRAT_VALTOZATLAN` + indoklás), a PE újraellenőriz, a megoldásíró a megoldó jelentésével újra megold, a megoldó újra fut. COMPLETED csak üres problémalistánál; különben `BLOCKED_SOLVER_FINDINGS`. 3–12 hívás. | A kézi lánc teljes menete (`results/`) |

Mindhárom lánc futtatható `--roles agent`-tel is. Agent-módban a megbízás és a mellékletek ugyanazok, csak a szerepcsomag helyett az agent szerepleírása megy. Így a `replay-pe02` csomag- és agent-módú futása közvetlenül összevethető: ugyanazt a hibát megtalálja-e a kisebb kontextussal, és mennyi idő/keret alatt.

A két `replay` lánc ugyanazt a bemenetet kapja, mint a kézi próba, ezért a review-k minősége közvetlenül összevethető. A `full` lánc új szöveget ír, ezért ott az idő, a körök száma és a teljes eredmény minősége a mérendő.

## Előfeltétel

- Node 22 vagy újabb (a gépeden 24.21 van).
- Codex CLI telepítve és bejelentkezve (`codex --version`, `codex login status`).
- Csak a `--solver claude` opcióhoz: Claude Code telepítve és bejelentkezve (`claude --version`).

## Lépések

PowerShellben, ebben a mappában (`editorial/p4-planning/ceo`):

```powershell
npm install                    # egyszer: a tesztekhez kell egy kis TOML-olvasó (smol-toml)
npm test                       # 128 teszt, hamis agenttel; nem hív modellt, nem fogyaszt keretet
node ceo.mjs doctor            # megvan-e a codex/claude, és ismeri-e a használt kapcsolókat
node ceo.mjs doctor --probe    # egy apró próbahívás szerepenként ("válaszolj: OK") — ez már keretet használ
node ceo.mjs doctor --probe-agents   # az agenthívási módok mérése (5 apró hívás, lásd lent)
node ceo.mjs run replay-pe02 --dry-run   # megmutatja a parancsokat, nem hív modellt
node ceo.mjs run replay-pe02                  # régi szerepcsomaggal
node ceo.mjs run replay-pe02 --roles agent    # ugyanez az új agenttel → összevetés
node ceo.mjs run replay-gi1-4 --roles agent --solver claude
node ceo.mjs run replay-javitas --roles agent   # javulásmérés: összevetés a kézi 2. körrel
node ceo.mjs run full --roles agent
node ceo.mjs status                       # hol tart / mire vár
node ceo.mjs notify-test                  # próba-email
```

**Mielőtt elindítod, és utána is:** nézd meg a Codex (és a Claude) felhasználási keretét a saját felületén, és írd be a jelentés „Kézi kiegészítés” részébe. A CLI-ből a keret nem olvasható ki megbízhatóan; a tokenszámot csak akkor rögzíti a vezérlő, ha a CLI kiírja.

## Agentek

Az agentek a véglegesített forrásszövegekből készülnek (2026-10-05): `agents-src/` (közös alap, ellenőrzőlista, szerepenkénti leírás), a blokkok listája és blokksajátosságai a `../starter-kits/roles.mjs`-ből, a megoldó az `assignments/SOLVER-AUTO.md`-ből (`lib/agent-defs.mjs`). A régi ChatGPT-szerepcsomagokat (`../starter-kits/packages/`) ez nem érinti. Kézzel ne szerkeszd a generált fájlokat: módosítsd az `agents-src/` szövegét, és futtasd a `node build-agents.mjs` parancsot. A `node build-agents.mjs --check` (és a tesztek) jelzik, ha a fájlok elavultak.

| Agent | Platform | Mit csinál | Forrásszerep |
|---|---|---|---|
| `plusdeca-fr` | Codex | heti koncepció, négy rendezői brief | FR |
| `plusdeca-gr`, `-rr`, `-vr`, `-xr` | Codex | oszlopterv + a megszűnt főírói feladat (kiosztás, blueprint, megfelelés) | GR+GI, RR+RI, VR+VI, XR+XI |
| `plusdeca-g-iro`, `-r-iro`, `-v-iro`, `-x-iro` | Codex | egy blokk Terv és Kézirat fázisa; a saját oszlop blokkjegyzeteivel | a régi 1–3. fázis |
| `plusdeca-megoldasiro` | Codex | egy blokk Megoldás fázisa, külön szerzőként | a régi 4. fázis |
| `plusdeca-f` | Codex | glosszák | F |
| `plusdeca-pe`, `-nave`, `-nye`, `-he`, `-ue` | Codex | a négy ellenőrzési lencse + tanulói végigjárás | PE, NavE, NyE, HE, UE |
| `plusdeca-solver` | Claude | független megoldó, kulcs nélkül | SOLVER-AUTO.md |

**A független megoldó recheckje (2026-10-31):** az első körben csak a tanulói feladatlapot kapja. Ismételt körben mellé kapja a saját korábbi jelentését és a megoldásíró válaszát a jelzéseire (a megoldás „### Független megoldó” dispositiontábláját: FIXED / REJECTED_WITH_REASON / ESCALATED, kulcs nélkül), és a számolási szabályt (`SOLVER_RECHECK_NOTE`, `lib/week.mjs`): a megoldott vagy indokoltan elutasított jelzés nem számít újra problémának, a puszta megfogalmazási javaslat megjegyzés. Előtte a megoldó minden körben újra jelezte, amit a kulcs már elfogad, és a lánc körkeretnél megállt (U11, U34). A 10-31 előtt kész recheck-lépések egy régi futás folytatásakor a korábbi prompttal maradnak érvényesek.

Szándékosan nincs agent: PRESIDENT (te), CEO (ez a program), GI/RI/VI/XI (megszűnt), Egyesítés (gép + UE), MEDIA (eszközt igényel; külön döntés).

Az agentek a Codexben interaktívan is használhatók, ha a repóban dolgozol („indítsd a plusdeca-pe agentet…”).

### Hogyan jut el a szerepleírás a modellhez? (`agentMode`)

A `codex exec`-nek nincs „ezt az agentet futtasd” kapcsolója, ezért négy módot támogat a vezérlő; a `doctor --probe-agents` mindegyiket kipróbálja egy próbaagenttel, amelynek a szerepleírásában egy véletlen jelszó van, a kérdésben nincs. Ha a válaszban ott a jelszó, a mód működik.

| Mód | Mit csinál | Megjegyzés |
|---|---|---|
| `inline` (alap) | a szerepleírás a prompt elejére kerül | mindig működik |
| `agents-md` | a szerepleírás a munkamappa `AGENTS.md`-jébe kerül | Codex; ha működik, ez a javasolt |
| `codex-spawn` | a munkamappa `.codex/agents/` alá kerül az agent, a fő munkamenet elindítja | kísérleti; két modellréteg, több keret — csak mérésre |
| `claude-agent` | `claude -p --agent plusdeca-solver` | Claude |

A próba végén a vezérlő megmondja, mit írj a `config.local.json`-ba, például: `{"providers":{"codex":{"agentMode":"agents-md"},"claude":{"agentMode":"claude-agent"}}}`.

### Közös ellenőri munkamenet (prompt-cache, 2026-11-15)

Ha egy lektori körben legalább két ellenőri hívás kapja ugyanazt az anyagot ugyanazzal a `claude -p` szolgáltatóval (a kettős PE két hívásnak számít), a vezérlő előbb egy rövid **előmelegítő hívással** csak a közös anyagot küldi (követelmény, vizsgálandó anyag, a BLOKK_JSON tanulói szövegei) a közös `plusdeca-ellenor` agenttel (`ELLENOR-KOZOS.md` + közös alap; a modell csak „OK”-t felel). Az ellenőrök ezt a munkamenetet folytatják: `--resume <id> --fork-session --agent plusdeca-ellenor`, ugyanabban a munkamappában (`kozos-<kulcs>`), és csak a saját részüket küldik: a szerepleírásukat (`<szerep>.md`, PE-nél az ellenőrzőlistával), a megbízásukat, recheckben a korábbi jelentésüket és a gépi összegzés szabályát. A közös rész így cache-ből jön (~0,1× bemeneti ár) a hívásonkénti újraírás (~1,25×) helyett.

- Miért kell előmelegítés: a CLI csak az üzenet végén tesz cache-töréspontot, ezért a puszta átrendezés (közös anyag elöl) nem elég — mérve (B1: közös rendszerprompttal és mappával is csak a rendszerprompt jött cache-ből); az eredmény a `docs/DONTESEK.md` 11-15-i sorában.
- A lépés kulcsa (`inputHash`) a logikai megbízás marad, a régi sorrendben: a kész lépések nem futnak újra. A `steps/<lépés>.prompt.md` a modell által látott teljes szöveget mutatja, a rekord `sharedSession` mezője a munkamenetet; az előmelegítések keretnaplója: `state.sharedWarmups`.
- Hibánál nincs megállás: sikertelen előmelegítés után az ellenőrök a szokásos módon futnak; ha egy folytatás hibát ad, az a lépés a szokásos módon újraindul (`sharedFallback`).
- Kikapcsolás: `config.local.json` → `"sharedReviewSession": false`. Szolgáltatónként: `providers.<név>.sharedSession` (alap: `stream-json` kimenetű szolgáltatónál be).

## Értesítés és állapot

> **Public copy:** the private version e-mails blocked/failed runs, mirrors run state to a private GitHub relay and a dashboard, and runs a weekly status survey. Those integrations and their configuration are removed here; the CEO prints notifications to the console and writes `runs/status.json` and `report.md` locally.

## Mit kapsz?

Minden futás egy saját mappát kap a `runs/` alatt (ez nincs verziókezelve):

- `steps/<lépés>.prompt.md` — pontosan ezt kapta a szerep promptként;
- `steps/<lépés>.agent.md` — agent-módban a szerepleírás (az `inline` módban ez a prompt elején is ott van);
- `steps/<lépés>.out.md` — a szerep válasza;
- `steps/<lépés>.stderr.txt` — a CLI hibakimenete;
- `state.json` — állapot, idők, gépi összegzések;
- `report.md` / `report.json` — összesítő: lépésenkénti idő, bemenet- és kimenetméret, verdiktek, várt kulcsok, ismert hibák kulcsszavas jelei, és a kézzel kitöltendő rész.

A kulcsszavas jelzés csak tájékoztat. Hogy egy review tényleg felismerte-e az ismert hibát, azt a kimenet elolvasásával kell eldönteni, ugyanúgy, mint a kézi próbánál (`pilot/quality/results/*/ERTEKELES.md`).

## Korlátok és biztonság

- **Csak olvasás, parancsfuttatás nélkül:** a Codex `--sandbox read-only` módban fut, és a parancsfuttató eszközei ki vannak kapcsolva (`--disable shell_tool --disable unified_exec`), így fájlt sem olvasgat, csak a kapott szövegből dolgozik. A Claude-megoldó eszközök nélkül fut (`--disallowedTools Bash,Edit,Write,…,WebFetch,WebSearch`).
- **Munkamappa a repón kívül:** minden szerep egy üres mappában fut a rendszer ideiglenes mappája alatt (`plusdeca-ceo/<futás>/<lépés>`). Így a CLI nem tölti be a repó `AGENTS.md`-jét, és nem lát bele a repóba. (Korábban a munkamappa a futásmappán belül, azaz a repóban volt; a Codex ilyenkor a repó `AGENTS.md`-jét is betöltheti. Régi viselkedés: `"workRoot": "runDir"`.)
- **Hívási korlát:** futásonként legfeljebb 40 hívás (`limits.maxCalls`; a számítás a `config.default.json` `_limits` mezőjében), a heti láncban 450 (`limits.weekMaxCalls`).
- **Javítási korlát:** ellenőrönként legfeljebb 2 kör, a PE-nek 4 (`limits.peMaxRounds`, 10-28); utána `BLOCKED_DECISION_MAX_ROUNDS` állapotban megáll, és rád vár.
- **Időkorlát:** lépésenként 20 perc; utána a folyamatot leállítja.
- **Folytatás:** ha megszakad, ugyanazzal a `--run-dir` értékkel újraindítva a kész lépéseket nem hívja újra. Ha egy kész lépés bemenete közben megváltozott, megáll, és új mappát kér.
- **Webes forrásvizsgálat:** a PE-02 megbízás online forrásvizsgálatot kér. Csak olvasási módban ez valószínűleg nem elérhető, ezért a PE-nek NEM VIZSGÁLT-ként kell jelölnie. Ez eltérés a kézi próbától; az összevetésnél a szakmai részt érdemes nézni.

## Beállítás

Az alapértékek a `config.default.json`-ban vannak. Saját eltérést egy `config.local.json` fájlba írj (nincs verziókezelve), csak az eltérő mezőkkel. Például modell és gondolkodási szint:

```json
{
  "roles": { "PE": { "model": "<modellnév>", "effort": "high" } },
  "limits": { "maxCalls": 6 }
}
```

Ha a `doctor` hiányzó kapcsolót jelez (a CLI-k kapcsolói verziónként változhatnak), a `providers.codex.args` vagy a `providers.claude.args` tömböt itt lehet igazítani.

## Fájlok

- `ceo.mjs` — parancssor (doctor, run, agents, report)
- `build-agents.mjs` — az agentfájlok generálása / ellenőrzése
- `agents-src/` — az agentek véglegesített forrásszövegei
- `lib/agent-defs.mjs` — az agentek összeállítása az `agents-src/` szövegeiből; TOML/Markdown kiírás
- `lib/agents.mjs` — agenthívási módok és a próbaagent
- `lib/paths.mjs` — útvonalak
- `lib/notify.mjs` — email-értesítés
- `lib/relay.mjs` — élő kapcsolat a projektkövetővel (privát GitHub-tárolón át)
- `lib/iranyitopult.mjs` — jelzés az irányítópult szinkronjának, válaszok és kívánságok közvetlen olvasása
- `lib/engine.mjs` — lépésfuttatás, állapot, korlátok, folytatás
- `lib/pipelines.mjs` — a három lánc
- `lib/packets.mjs` — csomagösszeállítás, szerzői megjegyzések levágása
- `lib/verdict.mjs` — gépi összegzés értelmezése, várt kulcsok, ismert hibák jelei
- `lib/providers.mjs`, `lib/process.mjs` — CLI-hívás időkorláttal, Windows-támogatással
- `lib/report.mjs` — jelentés
- `assignments/` — az automatikus futáshoz írt megbízások (javítás, célzott recheck, általános GI1-4, független megoldó)
- `test/` — tesztek hamis agenttel (`test/fixtures/fake-agent.mjs`)


## Minden szerep Claude-on, kalibrált PE, keretfigyelés (2026-10-28)

**Szolgáltatók** (`config.default.json`, döntés: `docs/DONTESEK.md` 10-28): minden szerző, rendező, megoldásíró és ellenőr `claude-web` (`claude -p --agent <név> --allowedTools WebSearch,WebFetch`: webbel; az engedély nélkül a `claude -p` a webes keresést elutasítja), a független megoldó `claude` (web és eszköz nélkül; a heti láncban `--solver claude`). Szerepenként visszaállítható az `assign` / `assignWeek` mezőben. A Claude-hívások `--output-format stream-json --verbose` módban futnak: a válasz a `result` sorból jön, mellette a keretadat.

**PE a heti láncban** (`lib/week.mjs`, `reviewedStep`):
- minden PE-lépés **két független futás** ugyanazon a rögzített változaton (`limits.peRuns` = 2; lépésfájlok: `<id>-pe…` és `<id>-pe-2…`). PASS csak akkor, ha mindkettő PASS. A findingok uniója számít: a PE a jelentés végén gépileg olvasható listát ad (`PE_FINDINGEK`: ID | súly | **próba** | hely | leírás; próba = `valosag`, `mondat`, `kollokacio`, `szint`, `mufaj`, `erdekesseg` vagy `tetel`), a CEO hely + próba szerint vonja össze a duplikátumokat. Az egyesített nézet: `steps/<id>-pe.egyesitett.md`; a szerző mindkét nyers jelentést és az uniót kapja;
- legfeljebb **4 javítási kör** a PE-nek (`limits.peMaxRounds`), a többi ellenőrnek marad a 2 (`limits.maxRounds`, ellenőrönként számolva);
- **újraírási szabály:** ha a 2. kör (`limits.peRewriteAfter`) után is nyitott BLOCKER/MAJOR van a valóság- vagy a mondatpróbából, a következő szerzői megbízás nem javítás, hanem újraírás új, hihető helyzetből (`assignments/het/UJRAIRAS.md`; a tanulási cél, a kulcsok, az ID-k és a terjedelem marad). Lépés: `<id>-ujraN`; utána **minden** ellenőr teljes (nem célzott) vizsgálatot végez.

A pilotláncok (`replay-*`, `full`) szándékosan nem változtak: a kézi próbákkal való összevethetőség miatt egyszeri PE-vel és 2 körrel futnak.

**Keretfigyelés** (`lib/usage.mjs`, `usage` a konfigurációban):
- **Keretfájl:** `%USERPROFILE%\.claude\plusdeca-usage.json` (`plusdeca-usage/1`: `five_hour` / `seven_day` → `used_percentage`, `resets_at`). A CEO minden Claude-hívás `rate_limit_event`-jéből frissíti; a Claude Code statusline-szkriptje (`tools/statusline/plusdeca-usage.mjs`) is írhatja.
- **Hívás előtt:** ha a fájl 30 percnél frissebb, és bármelyik ablak ≥ 95%, a CEO nem indít hívást: e-mail („vár: keret X%, folytatás ekkor: …”), várakozás a `resets_at` + 1 percig, majd ugyanattól a lépéstől folytat. Elavult fájlban nem bízik.
- **Keretkimerülési hibánál** (`rejected` esemény, „usage limit”, 429 …) a lépés nem bukik el: a CLI által adott visszaállási időpontig (ha nincs: 30 percig) vár, e-mailt küld, és ugyanazt a lépést hívja újra. Az elutasított hívás nem számít a `maxCalls`-ba. A párhuzamos lépések egy közös várakozásra csatlakoznak (egy levél). Állapot közben: `WAITING_RATE_LIMIT`.
- A heti ablaknál a várakozás napokig is tarthat; ez elfogadott (brief, 10-28).

**Segítségkérés — nem blokkol** (`lib/help.mjs`, az R11-pilot után):
- A szerep csak akkor ad `SEGITSEGKERES` blokkot, ha a saját webes keresése (legalább 2–3 lekérdezés) nem hozott használható forrást; a blokkban leírja, mit keresett (`mit kerestem:`).
- A CEO **nem vár**: a tartaléktervvel leadott válasz érvényes, a lánc megy tovább. A kérés a futás nyilvántartásába kerül (`state.help`).
- **Forrásonként egyszer:** ha a kérés közös URL-t tartalmaz egy korábbival, vagy a „mi kell” sor szavai legalább 35%-ban egyeznek (a rövidebbhez mérve), ugyanannak a forrásnak számít: nincs új levél, csak a lépés kerül a tétel mellé.
- **Közös válaszfájl:** `decisions/segitseg-<n>.md` (a levél megadja az útvonalat; `FAJL: <útvonal>` sorral .md/.txt is csatolható). Amint ott van, a CEO **minden** további hívás promptjába beteszi (a gépi összegzés elé), a még nyitott kérések listájával együtt („ezekre ne kérj újra”). A gyorsítótár kulcsa a megbízás marad, így egy később jött válasz nem érvényteleníti a kész lépéseket; a lépés rekordja (`help`) rögzíti, mit kapott.

## Javítás mód (`run javitas`, 2026-10-28)

Egy meglévő, tanári bírálatot kapott egység javítása (`lib/javitas.mjs`, megbízások: `assignments/javitas/`):

1. **Terv** — az oszlop rendezője javítási tervet ír (diagnózis, mi marad, mi változik és miért, tanári kifogásonként a kezelés); review: NavE + UE.
2. **Új kézirat** — az oszlop szerzője megírja a teljes új kéziratot a meglévő item-ID-kkal, és egy `## VÁLTOZÁSNAPLÓ` szakaszt; review: **PE ×2** + NavE. Itt hat a PE-szabály (4 kör, a 2. után újraírás).
3. **Megoldás** — megoldásíró (kulcs, opciók, feedback, `BLOKK_JSON`, tanulói nézet); review: PE ×2 + NavE + NyE + HE + UE + független megoldó (`assign.SOLVER`, alap: `claude`).
3b. **Eszkaláció** (a 10-06-i `full`-javítás mintájára, `limits.javitasEscalations` = 1): ha a megoldásíró `## Visszautalt hibák (ESCALATED)` táblában (`| E-NN | hely | javaslat | miért: finding-ID-k | ha marad |`) kéziratmódosítást utal vissza, a szerző célzottan, csak az érintett itemeken javít (`assignments/javitas/ESZKALACIO.md`, lépés: `<id>-kezirat-eN`). Ellenőrzés: PE ×2 és a „miért” oszlopban megnevezett ellenőrök **recheck módban** (a saját korábbi jelentésükkel, csak a változást nézve), és mindig a **NyE**, mert a PE saját javaslatából átvett szöveget nem a PE ellenőrzi. Utána a megoldásíró a korábbi megoldásából folytat (`<id>-megoldas-eN`); recheck: PE ×2, NyE, megoldó, az elakasztó és az érintett ellenőrök. A PRESIDENT döntése az eszkalációkról, ha van: `decisions/<id>-eszkalacio<N>.md` (a szerző és az ellenőrök is megkapják, és elsőbbséget élvez).
4. **Egyesítés** — `review-pass.md` + P5-kapu (`lib/p5.mjs`, javítási körrel).

Bemenet: az egység (`--egyseg`, a `UNITS` táblában: meglévő kézirat, tanári kifogások, hatókör, P5-ID), a javítási brief (`editorial/week-01/javitas-2026-10/BRIEF.md`, felülírható: `--brief`) és a mérce (`MERCE-SZINT`, `MERCE-FELADATTIPUSOK`, `PELDAK-PILOT`). Kimenet: a futásmappa `kimenet/` mappája mindig; zöld P5-kapunál az egység mappája is (`editorial/week-01/javitas-2026-10/<ID>/`, felülírható: `--out`): új kézirat, megoldás, review-pass, `block.<P5-ID>.json`, `VALTOZASNAPLO.md`, `futas.json`. A régi kéziratokat nem írja felül.

Hívási keret: `limits.javitasMaxCalls` = 80; becslés egységenként (R11, 2 PE-futással, megoldóval): alapkör 15, jellemzően ~22, legrosszabb esetben ~58.

```powershell
node ceo.mjs run javitas --egyseg R11 --dry-run   # lépések és promptok, modellhívás nélkül
node ceo.mjs run javitas --egyseg R11             # valódi futás
```

Egységek ma: `R11` (Reading/UoF záróteszt: olvasmány + 20 item). Újat a `UNITS` táblába kell felvenni (oszlop, P5-ID, kézirat-betöltő, tanári szakasz, hatókör).

## P5-bekötés (2026-10-06, első változat)

`--p5`: a megoldásíró a megoldás mellé `BLOKK_JSON … BLOKK_JSON_VEGE` blokkforrást ad (`p5/schema/block.schema.json`). A CEO kitölti a review-kötést a futás saját szövegeiből (PE-jelentés, kézirat, megoldás a JSON nélkül), és lefuttatja a P5 kapuit (`p5/lib/gates.mjs`). Hiba esetén legfeljebb `limits.maxRounds` javítási kör (`gi1-4-p5-javitasN`), utána `BLOCKED_P5_GATE`. Kimenet: `runs/<futás>/block.<ID>.json`, `p5-report.json`. A pilotlánc a GI1-et a `w07-u-1-1` blokk-ID-re képezi (`--p5-week`). A heti lánc megírásakor ez alapértelmezett lesz.

## Heti lánc (`run het`, 2026-10-07, első változat)

A teljes hét a döntések szerinti rendben (`docs/archivum/P4_DONTESEK_2026-10-04.md`), mindig agent-módban (`lib/week.mjs`, megbízások: `assignments/het/`):

1. **FR** — heti koncepció + négy rendezői brief (`## HETI KONCEPCIÓ`, `## BRIEF GR|RR|VR|XR`); PE + NavE párhuzamosan; utána **a PRESIDENT jóváhagyja** (`decisions/fr-jovahagyas.md`: `OK`, vagy a kért módosítás → FR-átdolgozás review-val → újabb jóváhagyás).
2. **GR → RR → VR → XR** egymás után (csak az érintett oszlopoké): rendezői anyag + blokkkiosztás (`## BLOKK <ID>` szakaszok), a szerepkártya szerinti ellenőrökkel.
3. **Blokkonként** (oszloponként, a teszt az oszlop végén), a blokkíró csak a saját `## BLOKK <ID>` szakaszát és a heti koncepciót kapja:
   - Terv (oszlopíró) → NavE + UE;
   - Kézirat (oszlopíró) → NavE;
   - Megoldás (megoldásíró, `BLOKK_JSON` a blokk saját P5-azonosítójával) → PE + NavE + NyE + HE + UE párhuzamosan, `--solver claude` esetén a független megoldó is;
   - Egyesítés: review-nyilvántartás (`handoffs/<P5-ID>.review-pass.md`, ellenőri szöveg nélkül) + kéziratlánc + P5-kapuk javítási körrel, utána UE tanulói végigjárás.
4. **P5**: a kész blokkokból heti terv (`p5/week-NN.plan.json` a futásmappában) → `p5/week-build` (fordítás, előnézet, bejárás, ledger) a futásmappa `p5-out/` mappájába; a repó `p5/out`-ját nem írja.

Minden review-kör legfeljebb `maxRounds` javítással (recheck csak annál, aki nem adott PASS-t). Egy blokk elakadása (`BLOCKED_DECISION`, `BLOCKED_DECISION_MAX_ROUNDS`, `BLOCKED_P5_GATE`, `BLOCKED_WALKTHROUGH` …) nem állítja meg a többit; a hét csak akkor `COMPLETED`, ha minden blokk kész és a P5 zöld, különben `BLOCKED_BLOCKS` blokkonkénti okkal. Ugyanazzal a `--run-dir`-rel újraindítva csak a hiányzó lépések futnak.

```powershell
node ceo.mjs run het --het 2 --brief <indulócsomag.md> --dry-run            # parancsok, modellhívás nélkül
node ceo.mjs run het --het 2 --brief <indulócsomag.md> --blocks GI1 --no-p5   # próba egy blokkon
node ceo.mjs run het --het 2 --brief <indulócsomag.md> --solver claude        # a teljes hét
```

Beállítás: `limits.weekMaxCalls` (alap 450) a heti felső korlát; `assignWeek` szerepenként felülírja a szolgáltatót (`{"FR":"codex","reviewer":"claude-web","author":"codex"}`; alap: ellenőr = a PE-é, szerző = a GI1-3-é).

**Ismert korlátok (első változat):** a Megoldás fázisban talált kéziratbeli hibát a megoldásíró csak visszautalni tudja (ESCALATED / BLOCKED_DECISION), a kéziratíróhoz automatikusan nem megy vissza (a pilot `full` lánca ezt már tudja); az F (glosszák) és a MEDIA nincs bekötve; a blokkok sorosan futnak (oszloponként párhuzamosítható volna); valódi modellel még nem futott — az első éles próba egy blokkon javasolt.
