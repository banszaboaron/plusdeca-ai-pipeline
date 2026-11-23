# U21 (w01-u-2-1, GI2): *Du, des, de : forme ou sens ?* — Megoldás, 5. változat, a P5-kapu javítása

**Szerep:** megoldásíró. A feladat a BLOKK_JSON sémahibáinak javítása, ezt a P5-kapu findingjai alapján végeztem.

**Bemenet:**
- a megoldásom 5. változata;
- a P5-kapu két SCHEMA-findingja;
- a `p5/schema/block.schema.json`, amelyet megnyitottam: ebben a `solution` `rubric` ágát;
- a `p5/examples/block.w01-u-3-2.json`, amelyet szintén megnyitottam: ebben az i11 és az i12 rubrikás itemet.

**Hatókör:** csak a BLOKK_JSON leképezése változott, ezen belül csak a `w01-u-2-1-i08` `solution` objektuma. A kézirat és a megoldás szövege nem változott. A megoldás 5. változata (kulcsok, alternatívák, feedbackek, rubrika, a C minta, az R1 és R2 elutasított minta) betűre azonos marad, a tanulói nézet is változatlan.

**Hang és videó:** az egységhez nem tartozik felvétel, és új hangra nincs szükség.

---

## Mi a hiba, és mit javítottam

A séma `rubric` ágában `additionalProperties: false` áll, és csak három mezőt enged: `type`, `criteria`, `notSufficient`. A `samples` és a `rejected` mezőt nem engedi. Az U32-minta is csak `criteria` + `notSufficient` szerkezetet használ.

**Javítás:** a `w01-u-2-1-i08` `solution` objektumából kivettem a `samples` és a `rejected` tömböt. A `criteria` és a `notSufficient` szó szerint változatlan.

**Amit a séma nem tud ábrázolni:**
- **A C minta.** Szerepét tekintve értékelői referencia. Tanulói modellként nem tehettem a p09b-re, mert a megoldás szerint a beadás után csak az A és a B modell látszik. Ha mégis felkerülne, az új tanulói tartalom lenne.
- **Az R1 és az R2 elutasított minta.** Tartalmukat részben fedi a `notSufficient` („a hat szerkezet puszta felsorolása”), és az U21-I08-E04 és -E01 feedback benne marad a `feedback.targeted` tömbben. Magát a két mintaszöveget azonban a JSON már nem hordozza.

Mindhárom szöveg megmarad a megoldási dokumentumban (`w01-u-2-1.megoldas.md`, i08), de a P5-be nem jutnak el. Ezt az MO-F07 finding jelzi.

---

## Findingok (saját)

| ID | Súly | Hely | Leírás | Recheck |
|---|---|---|---|---|
| MO-F07 (új) | MINOR | BLOKK_JSON, `w01-u-2-1-i08` `solution` | A séma `rubric` ágában nincs hely mintamegoldásnak és elutasított mintának. A C minta, valamint az R1 és az R2 ezért csak a megoldási dokumentumban él, a P5-ben nem. Az értékelő vagy az AI-tanácsadó így nem kapja meg őket gépi adatként. **Javaslat a CEO-nak:** vagy a séma `rubric` ága kapjon opcionális `samples` és `rejected` mezőt (a `samples` ág mintájára), vagy maradjon így, és a minták a megoldási dokumentumból kerüljenek az értékelőhöz. | CEO (séma), NavE |
| MO-F03 | NOTE | i03, s004, i08, p04 | Változatlan: a 0.3 kapu nyitott, a segitseg-1 folyamatban van. | NyE |
| MO-F04 | NOTE | BLOKK_JSON | Változatlan leképezési pontok (i07 subitemjei, p09b `visibleAfter`, lapos `alternatives`, dőlt jelölés). | CEO-szkript, UE |
| MO-F05 | NOTE | minden szöveg | A nem törő szóközöket a HE rakja be. | HE |
| MO-F06 | NOTE | séma | Itemszinten nincs „bizonytalan” kimenet. | CEO |

## Dispositionök

| Finding | Disposition | Indok |
|---|---|---|
| [SCHEMA] `pages/8/items/0/solution/samples` | FIXED | A mező kikerült. A tartalom a megoldási dokumentumban marad (MO-F07). |
| [SCHEMA] `pages/8/items/0/solution/rejected` | FIXED | A mező kikerült. A lefedés a `notSufficient` és a `feedback.targeted` révén részben megmaradt (MO-F07). |
| A korábbi N-04 (a), N-04 (c), N-06 (a), E-06 maradéka, időkeret | ESCALATED, változatlanul | Ez a kör nem érinti őket. |

## Változáslista
- **BLOKK_JSON, `w01-u-2-1-i08` `solution`:** a `samples` és a `rejected` kikerült. A változás típusa leképezés. Kulcs, tanulói szöveg, feedback, rubrika és sorrend nem változott.

## Visszautalt hibák (ESCALATED)
Új kéziratmódosítást nem kérek. A feltételes E-09 (0.3 kapu) változatlanul nyitott.

**Bizonyíték:**
- **Új:** megnyitottam a `block.schema.json` `solution` → `rubric` ágát (`additionalProperties: false`, mezők: `type`, `criteria`, `notSufficient`) és az U32 i11/i12 mintáját.
- **Webes forrást** nem nyitottam meg.

**Újraellenőrzést igényel:**
- a CEO sémaellenőrző szkriptje a javított JSON-on;
- a NavE az MO-F07-et.

**Következő címzett:** CEO.

**Tanulság:** a nyílt produkció mintái és elutasított mintái → mielőtt a JSON-ba kerülnek, ellenőrizd, hogy a séma adott `solution`-ágában van-e rájuk mező → a `rubric` ág szűkebb, mint a `samples` ág → minden `CAP-writing` item leképezésére érvényes.

---

BLOKK_JSON
{
  "schemaVersion": "p5-block-1.0.0",
  "contractVersion": "2.0.0",
  "id": "w01-u-2-1",
  "week": 1,
  "kind": "lesson",
  "title": "Du, des, de : forme ou sens ?",
  "position": {"row": 2, "column": 1},
  "prerequisites": [],
  "estimatedMinutes": {"min": 34, "max": 45},
  "taughtTargetRefs": [
    "w01-g-det-partitive-mass",
    "w01-g-det-semantic-contrast",
    "w01-g-de-adjective-standard",
    "w01-g-de-quantity",
    "w01-g-de-quantity-subset",
    "w01-g-en-partitive-reference",
    "w01-g-en-position-finite-infinitive",
    "w01-g-en-quantity-retention",
    "w01-g-integrated-writing"
  ],
  "brief": {
    "register": "tu",
    "requiredContent": [
      "mit vettetek már Camille-lal;",
      "mit hozzon Léo, mennyiséggel, és legalább egy tételt meghatározatlan mennyiségben (pl. sajtot, gyümölcslét);",
      "honnan: egy du-val megnevezhető helyről (bolt, stand vagy pékség, pl. le stand du…, la boulangerie du…);",
      "egy nyitott mennyiség vagy tömeg (a piac, a sor, a kínálat);",
      "egy megnevezett csoport egy része;",
      "miért azt a helyet ajánlod."
    ],
    "requiredLanguage": [
      {"text": "du"},
      {"text": "des petits pains"},
      {"text": "beaucoup de"},
      {"text": "beaucoup des"}
    ],
    "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i08"}
  },
  "pages": [
    {
      "id": "w01-u-2-1-p01",
      "template": "PAGE-intro",
      "variant": "PV-intro-brief",
      "title": "Ce que tu vas préciser",
      "instruction": "Lis les objectifs, puis passe à la première activité.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p01 – *Ce que tu vas préciser*"},
      "content": [
        {"type": "text", "role": "situation", "language": "hu", "text": "Hol vagyunk? Ebben a blokkban szerepet játszol: Lyonban laksz a lakótársaddal, Camille-lal, a Croix-Rousse negyedben. Vasárnap 11-re brunchra jön a barátotok, Léo. Szombat este pékséget választasz és foglalsz. Vasárnap reggel sorba állsz a Pain Perché előtt, rendelsz a pultnál, és közben üzeneteket váltasz Léóval.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Tanulói tartalom"}},
        {"type": "text", "role": "lesson", "language": "hu", "text": "A determinánsokat és az en-t már ismered. Most négy olyan döntést pontosítasz, amelyben a forma a jelentésen múlik:", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Tanulói tartalom"}},
        {"type": "list", "role": "lesson", "language": "fr", "entries": [
          "reconnaître si du veut dire « une quantité de… » ou « de + le » ;",
          "écrire de belles tartes, mais des petits pains, quand l'expression est un nom de produit ;",
          "distinguer beaucoup de gens et beaucoup des habitués du quartier ;",
          "placer en au bon endroit : avant le verbe conjugué, avant l'infinitif, avant l'auxiliaire."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Tanulói tartalom"}},
        {"type": "text", "role": "note", "language": "fr", "text": "Petit repère : la bonne forme dépend de ce que tu veux dire, pas seulement du mot qui suit.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Tanulói tartalom"}}
      ],
      "items": []
    },
    {
      "id": "w01-u-2-1-p02",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "Deux valeurs de du",
      "instruction": "Lis l'échange et l'explication, puis explique la différence avec tes propres mots.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p02 – *Deux valeurs de du*"},
      "content": [
        {"type": "text", "role": "situation", "language": "fr", "text": "Dimanche, 10 h 00, à la maison. Léo t'écrit.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p02 – *Deux valeurs de du*"}},
        {"type": "text", "role": "example", "language": "fr", "text": "Léo : Petite question pour tout à l'heure : je ramène du café ou vous en avez ?\nToi : On a du café, t'inquiète ! Et merci encore pour l'adresse.\nLéo : Alors, verdict ?\nToi : Top ! J'ai parlé du café de la place à Camille, elle veut y aller la semaine prochaine.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Az üzenetváltás"}},
        {"type": "text", "role": "lesson", "language": "hu", "text": "Az üzenetváltásban a café szó kétszer áll du után, de a két du mást jelent:\nOn a du café – valamennyi kávé van itthon. Ez partitív du.\nJ'ai parlé du café de la place – a parler de után a le café (a téren lévő kávézó) összevonódik: de + le = du.\nA du alak tehát két szerkezetből jöhet:\n1. Partitív du: valamennyi, nem pontosan megadott mennyiség valamiből. Jellemzően az avoir, a boire, a commander, a manger és hasonló igék tárgyaként áll.\n2. Összevont de + le = du: egy de-t kívánó szerkezet (parler de, se souvenir de, près de…) után határozott, hímnemű főnév áll.\nA döntést a mondat szerkezete hozza meg: van-e előtte de-t kívánó ige vagy elöljáró. A főnév szótári jelentése nem dönt.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar magyarázat"}},
        {"type": "list", "role": "example", "language": "fr", "entries": [
          "Le dimanche, je bois du café au comptoir, debout.",
          "Camille commande toujours du thé vert.",
          "Tu te souviens du serveur ? Il connaît tout le quartier."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Természetes példák"}},
        {"type": "list", "role": "example", "title": "Kontraszt", "language": "hu", "entries": [
          "Je bois de café. – Hibás: állító mondatban nincs olyan elem (tagadás vagy mennyiségszó), amely a de-t indokolná.",
          "On parle de café. – Helyes, de mást jelent: általában a kávéról mint témáról beszélünk.",
          "On parle du café. – Egy konkrét kávéról vagy kávézóról beszélünk, amelyet mindketten ismerünk."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Kontraszt"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i01",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-short",
          "instruction": "Explique brièvement la valeur de du dans les deux phrases.",
          "prompt": "1. Le dimanche, Camille et moi, on achète du pain de seigle : il se garde plusieurs jours.\n2. Le Pain Perché est juste à côté du parc de la Cerisaie.",
          "response": {"type": "text", "lines": "multi"},
          "solution": {
            "type": "samples",
            "samples": [
              "1 = partitif : une certaine quantité de pain ; 2 = de + le : à côté de + le parc.",
              "1 = partitív (valamennyi kenyér, az acheter tárgya) ; 2 = de + le (à côté de le parc → du)"
            ],
            "keyDescription": "Az 1. mondathoz partitív értéket (az acheter tárgya, valamennyi rozskenyér), a 2. mondathoz de + le összevonást (à côté de + le parc) rendel, magyarul vagy franciául, bármilyen megfogalmazásban; szakszó nem kötelező; az indoklás nem kötelező, de ha szerepel, ne legyen hibás.",
            "rejected": [
              {"text": "1 = partitív ; 2 = partitív", "reason": "a 2. mondatban hely áll, nem mennyiség", "feedbackRef": "U21-I01-E01"},
              {"text": "1 = de + le ; 2 = de + le", "reason": "az acheter után nincs de-t kívánó elem", "feedbackRef": "U21-I01-E02"},
              {"text": "1 = de + le ; 2 = partitív", "reason": "felcserélés", "feedbackRef": "U21-I01-E03"},
              {"text": "2 = hely (szerkezet nélkül)", "reason": "a jelentés jó, a szerkezet hiányzik", "feedbackRef": "U21-I01-E04"}
            ]
          },
          "feedback": {
            "correct": "Pontosan: az 1. mondatban az « acheter » után valamennyi rozskenyér áll (partitív « du »); a 2. mondatban az « à côté de » után a « le parc » áll, így « de + le = du ».",
            "targeted": [
              {"id": "U21-I01-E01", "trigger": "a 2. mondat partitív", "text": "A 2. mondatban nem mennyiségről van szó: az « à côté de » után határozott hely áll (« le parc de la Cerisaie »). Ez « de + le = du »."},
              {"id": "U21-I01-E02", "trigger": "az 1. mondat de + le", "text": "Az 1. mondatban az « acheter » közvetlenül kapja a tárgyát, előtte nincs « de »-t kívánó elem. A « du » itt valamennyi rozskenyeret jelent: partitív."},
              {"id": "U21-I01-E03", "trigger": "felcserélés", "text": "Fordítva: az 1. mondat partitív (« acheter » + valamennyi kenyér), a 2. mondat összevont (« à côté de » + « le parc »)."},
              {"id": "U21-I01-E04", "trigger": "a 2. mondatnál csak hely áll, szerkezet nélkül", "text": "A jelentést jól látod. Írd mellé a szerkezetet is: mi áll a « du » előtt? (« à côté de » + « le parc » → « du »)"}
            ]
          },
          "evaluation": {"mode": "semantic", "aiAdvisoryOnly": true, "scoring": "formative-required"},
          "targetRefs": ["w01-g-det-partitive-mass", "w01-g-det-semantic-contrast"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i01"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p03",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "Choisir entre du, de, de la et des",
      "instruction": "Choisis la forme qui correspond au contexte.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p03 – *Choisir entre du, de, de la et des*"},
      "content": [
        {"type": "text", "role": "lesson", "language": "hu", "text": "Ha egy de-t kívánó ige (revenir de, sortir de) vagy szerkezet (le prix de, le goût de) után hímnemű, határozott főnév áll, a de le összevonódik: du. Nőnemű főnév előtt de la áll, többes számban des (de + les).", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p03 – *Choisir entre du, de, de la et des*"}},
        {"type": "list", "role": "example", "language": "fr", "entries": [
          "Camille revient du marché avec un sac de pommes.",
          "Le dimanche, Léo sort du lit vers dix heures.",
          "Le prix du croissant a encore augmenté cette année."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p03 – *Choisir entre du, de, de la et des*"}},
        {"type": "list", "role": "example", "title": "Kontraszt", "language": "hu", "entries": [
          "Je voudrais du jus d'orange. – partitív: valamennyi narancslét kérek.",
          "Je n'aime pas le goût du jus d'orange en bouteille. – de + le: a palackozott narancslé íze."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p03 – *Choisir entre du, de, de la et des*"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i02",
          "capability": "CAP-choice-single",
          "variant": "PV-choice-one",
          "instruction": "Choisis la bonne réponse.",
          "prompt": "Dimanche, 8 h 15. Tu viens de passer vingt minutes dans le café que Léo t'a conseillé. Tu lui écris un SMS :\nJe reviens ___ café que tu m'as conseillé. Le serveur est adorable, merci !",
          "response": {"type": "single", "options": [
            {"id": "a", "label": "du"},
            {"id": "b", "label": "de"},
            {"id": "c", "label": "de la"},
            {"id": "d", "label": "des"}
          ]},
          "solution": {"type": "choice", "keyOptionIds": ["a"]},
          "feedback": {
            "correct": "Igen: « revenir de » + « le café » (a hímnemű, azonosított kávézó) → « du ».",
            "targeted": [
              {"id": "U21-I02-B", "trigger": "b", "text": "A « revenir de » után itt egy azonosított kávézó áll: « le café que tu m'as conseillé ». A « de + le » összevonódik: « du »."},
              {"id": "U21-I02-C", "trigger": "c", "text": "A « café » hímnemű: « le café ». A « de la » nőnemű főnév elé kell."},
              {"id": "U21-I02-D", "trigger": "d", "text": "Egy kávézóról van szó, egyes számban: « de + le = du ». A « des » = « de + les », többes számhoz."}
            ]
          },
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-det-semantic-contrast"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i02"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p04",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "De belles tartes, des petits pains",
      "instruction": "Lis la règle et l'ardoise, puis complète la phrase.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p04 – *De belles tartes, des petits pains*"},
      "content": [
        {"type": "text", "role": "situation", "language": "fr", "text": "Samedi soir. Tu cherches une boulangerie pour demain matin. Sur Instagram, le Pain Perché publie la photo de son ardoise de demain.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p04 – *De belles tartes, des petits pains*"}},
        {"type": "text", "role": "example", "title": "L'ardoise", "language": "fr", "text": "LE PAIN PERCHÉ — demain dimanche\nPAINS           tradition · campagne · seigle (à la coupe)\nPETITS PAINS    céréales · lait\nVIENNOISERIES   croissant au beurre · pain au chocolat · chausson aux pommes · mini-viennoiseries (le sachet)\nPÂTISSERIES     flan (à la part) · cannelés · tarte du jour\nFORMULE PETIT-DÉJ   boisson chaude + jus d'orange + viennoiserie", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Az ardoise (fotó az Instagram-posztban)"}},
        {"type": "text", "role": "lesson", "language": "hu", "text": "Gondozott írott franciában a többes számú des rendszerint de/d' alakra rövidül, ha a főnév előtt melléknév áll:\ndes tartes → de belles tartes\ndes miches → de grosses miches\nKivétel, ha a melléknév és a főnév együtt egy fogalmat nevez meg, összeforrt kifejezésként. Ilyenkor a des megmarad: des petits pois, des grands-parents, a pékségben pedig des petits pains. A petits pains nem „kicsi kenyereket” jelent, hanem egy termékfajtát. Ezért van saját rovata a táblán.\nBeszélt nyelvben gyakori a des belles tartes is, de gondozott írott szövegben (ajánló, bemutatkozó szöveg) a de belles tartes a mérce. A gyakori, rövid melléknevekkel (de bons…, de beaux…) a de a hétköznapi beszédben is természetes.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar magyarázat"}},
        {"type": "list", "role": "example", "language": "fr", "entries": [
          "Le Pain Perché fait de belles tartes aux fruits de saison.",
          "Même si la boutique est minuscule, on y trouve de grosses miches de campagne.",
          "Le dimanche, ils ont aussi des petits pains au lait."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Példák"}},
        {"type": "list", "role": "example", "title": "Kontraszt", "language": "hu", "entries": [
          "Ils font des belles tartes. – Beszédben előfordul; gondozott írásban: de belles tartes.",
          "Ils vendent de petits pains. – Ha a termék nevéről van szó, gondozott írásban is a des petits pains a mérce, mert a petits pains összeforrt kifejezés."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Kontraszt"}},
        {"type": "text", "role": "note", "title": "Kulturális háttér", "language": "hu", "text": "A francia tábla külön rovatban tartja a következő termékeket:\npains: kenyerek;\npetits pains: egyszemélyes kis kenyerek, nagyjából a zsemle szerepében;\nviennoiseries: vajas, leveles vagy kelt tészta, például croissant és pain au chocolat; a mini-viennoiseries zacskóban kapható;\npâtisseries: sütemények.\nA magyar „péksütemény” a kiflitől a kakaós csigáig mindezt egybefogja. A formule petit-déjeuner fix áras csomag: meleg ital, gyümölcslé és egy viennoiserie.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Kulturális háttér"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i03",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-two-fields",
          "instruction": "Complète avec de, d' ou des.",
          "prompt": "Samedi soir, tu compares deux boulangeries. Dans la rubrique « Nos adresses du dimanche » d'un guide de la Croix-Rousse, tu lis :\nMême si sa devanture ne paie pas de mine, le Pain Perché propose ___ excellents croissants au beurre et, dès 7 heures, ___ petits pains aux céréales encore tièdes.",
          "response": {"type": "fields", "fields": [{"id": "f1", "label": "1"}, {"id": "f2", "label": "2"}]},
          "solution": {
            "type": "exact",
            "key": {"f1": "d'", "f2": "des"},
            "alternatives": [
              "d'excellents",
              "d'excellents croissants",
              "des petits pains",
              "Même si sa devanture ne paie pas de mine, le Pain Perché propose d'excellents croissants au beurre et, dès 7 heures, des petits pains aux céréales encore tièdes."
            ],
            "rejected": [
              {"text": "des (1)", "reason": "beszélt nyelvi forma gondozott ajánlóban", "feedbackRef": "U21-I03-E01"},
              {"text": "de (1)", "reason": "elízió hiánya", "feedbackRef": "U21-I03-E02"},
              {"text": "de (2)", "reason": "a lexikalizált petits pains nincs felismerve; feltételes: a 0.3 kaputól függ (i03, s004, i08, p04 együtt)", "feedbackRef": "U21-I03-E03"},
              {"text": "les", "reason": "határozott névelő kínálat bemutatásakor", "feedbackRef": "U21-I03-E04"},
              {"text": "des (1) + d'/de (2)", "reason": "felcserélés", "feedbackRef": "U21-I03-E05"},
              {"text": "d' (2)", "reason": "elízió mássalhangzó előtt", "feedbackRef": "U21-I03-E06"},
              {"text": "ses", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I03-F01"},
              {"text": "ses excellents croissants", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I03-F01"},
              {"text": "ses petits pains", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I03-F01"},
              {"text": "quelques", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I03-F01"},
              {"text": "quelques excellents croissants", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I03-F01"},
              {"text": "quelques petits pains", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I03-F01"}
            ]
          },
          "feedback": {
            "correct": "Jó: gondozott ajánlószövegben elöl álló melléknév előtt « d' » áll (« d'excellents croissants »), a « petits pains » viszont termékfajta neve, ezért « des petits pains ».",
            "incorrect": "Ez nem a várt alak. Válassz a « de », « d' » és « des » közül: mi áll gondozott ajánlószövegben az elöl álló melléknév, illetve a « petits pains » termék neve előtt? Nézd meg újra a szabályt és a táblát, és próbáld újra.",
            "targeted": [
              {"id": "U21-I03-E01", "text": "Beszédben gyakori, de ez gondozott ajánló rovat: elöl álló melléknév előtt itt « d' » kell (« d'excellents »)."},
              {"id": "U21-I03-E02", "text": "Magánhangzó előtt a « de » elízióval áll: « d'excellents »."},
              {"id": "U21-I03-E03", "text": "A « petits pains » itt a tábla egyik termékfajtájának a neve (Petits pains rovat). Az ilyen összeforrt kifejezések előtt a « des » marad: « des petits pains »."},
              {"id": "U21-I03-E04", "text": "Az ajánló a kínálatot mutatja be, nem korábban említett termékeket: itt nem határozott névelő kell."},
              {"id": "U21-I03-E05", "text": "Fordítva: az « excellents » valódi melléknév → « d' »; a « petits pains » egy termék neve → « des »."},
              {"id": "U21-I03-E06", "text": "A « petits » mássalhangzóval kezdődik, itt nincs elízió. A termék neve előtt « des » áll: « des petits pains »."},
              {"id": "U21-I03-F01", "trigger": "ses | ses excellents croissants | ses petits pains | quelques | quelques excellents croissants | quelques petits pains", "text": "Ez a mondat franciául helyes lehet, de az instrukció a « de », « d' » és « des » közül kér egyet. Mi áll mennyiségjelző és birtokos nélkül a melléknév, illetve a « petits pains » előtt?"}
            ]
          },
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-de-adjective-standard"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i03"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p05",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "Beaucoup de ou beaucoup des ?",
      "instruction": "Complète les deux phrases en respectant le sens.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p05 – *Beaucoup de ou beaucoup des ?*"},
      "content": [
        {"type": "text", "role": "situation", "language": "fr", "text": "Dimanche, 8 h 30. Camille et toi, vous faites la queue devant le Pain Perché.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p05 – *Beaucoup de ou beaucoup des ?*"}},
        {"type": "text", "role": "lesson", "language": "hu", "text": "A beaucoup de nyitott mennyiséget jelöl: sok valamiből, előre meg nem határozott csoportból.\nA beaucoup des a beaucoup de + les összevont alakja: sok egy megnevezett, határozott csoport tagjai közül. A csoportot rendszerint egy bővítmény azonosítja (du dimanche, du quartier, de la vitrine…).\nNem a többes szám dönt, hanem az, hogy a csoport meg van-e nevezve.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar magyarázat"}},
        {"type": "list", "role": "example", "language": "fr", "entries": [
          "Le dimanche matin, il y a beaucoup de monde devant les boulangeries.",
          "Beaucoup de gens attendent dehors, même sous la pluie.",
          "Beaucoup des habitués du dimanche ont réservé la veille, tandis que les autres font la queue."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Példák"}},
        {"type": "list", "role": "example", "title": "Kontraszt", "language": "hu", "entries": [
          "Beaucoup des gens attendent dehors. – Hibás: nincs megnevezett csoport.",
          "Beaucoup d'habitués viennent tôt. – Sok törzsvendég jön korán (nyitott mennyiség).",
          "Beaucoup des habitués du dimanche viennent tôt. – A vasárnapi törzsvendégek közül sokan korán jönnek."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Kontraszt"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i04",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-two-fields",
          "instruction": "Complète avec beaucoup de ou beaucoup des.",
          "prompt": "Dans la file, Camille regarde la vitrine :\n« Bonne nouvelle : il reste encore ___ viennoiseries. Par contre, regarde : ___ tartes de la vitrine sont déjà réservées. »",
          "response": {"type": "fields", "fields": [{"id": "f1", "label": "1"}, {"id": "f2", "label": "2"}]},
          "solution": {
            "type": "exact",
            "key": {"f1": "beaucoup de", "f2": "beaucoup des"},
            "alternatives": [
              "beaucoup de viennoiseries",
              "beaucoup des tartes",
              "beaucoup des tartes de la vitrine",
              "Bonne nouvelle : il reste encore beaucoup de viennoiseries. Par contre, regarde : beaucoup des tartes de la vitrine sont déjà réservées."
            ],
            "rejected": [
              {"text": "beaucoup des (1)", "reason": "nincs megnevezett csoport", "feedbackRef": "U21-I04-E01"},
              {"text": "beaucoup de (2)", "reason": "a de la vitrine csoportot nevez meg", "feedbackRef": "U21-I04-E02"},
              {"text": "beaucoup des (1) + beaucoup de (2)", "reason": "felcserélés", "feedbackRef": "U21-I04-E03"},
              {"text": "beaucoup d' (1)", "reason": "elízió rossz helyen", "feedbackRef": "U21-I04-E04"},
              {"text": "de (1) / des (2)", "reason": "helyes választás, hiányos kifejezés", "feedbackRef": "U21-I04-E05"}
            ]
          },
          "feedback": {
            "correct": "Igen: a « viennoiseries » nyitott mennyiség (« beaucoup de »), a « tartes de la vitrine » egy megnevezett csoport, abból sok (« beaucoup des »).",
            "incorrect": "Ez nem a várt alak. Mindkét helyre a « beaucoup de » vagy a « beaucoup des » kerül: nézd meg, hogy a mondat egy megnevezett csoportról beszél-e, és próbáld újra.",
            "targeted": [
              {"id": "U21-I04-E01", "text": "Az első mondatban nincs megnevezett csoport, csak annyi, hogy sok viennoiserie maradt: « beaucoup de »."},
              {"id": "U21-I04-E02", "text": "A « de la vitrine » megnevezi a csoportot: a kirakatban lévő torták közül sok. Egy megnevezett csoport részére élőszóban is « beaucoup des » (= « de + les ») a helyes."},
              {"id": "U21-I04-E03", "text": "Fordítva: a nyitott mennyiség « beaucoup de », a megnevezett csoport (« de la vitrine ») része « beaucoup des »."},
              {"id": "U21-I04-E04", "text": "A « viennoiseries » mássalhangzóval kezdődik: « beaucoup de viennoiseries »."},
              {"id": "U21-I04-E05", "text": "Jól választottál, de a helyre a teljes kifejezés kell: « beaucoup de » vagy « beaucoup des »."}
            ]
          },
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-de-quantity", "w01-g-de-quantity-subset"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i04"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p06",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "Où placer en ?",
      "instruction": "Lis la scène et la règle, puis transforme les phrases avec en.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p06 – *Où placer en ?*"},
      "content": [
        {"type": "text", "role": "situation", "language": "fr", "text": "Dimanche, 8 h 45. C'est enfin votre tour au comptoir du Pain Perché.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p06 – *Où placer en ?*"}},
        {"type": "text", "role": "example", "language": "fr", "text": "La boulangère : Bonjour ! Qu'est-ce qu'il vous faut ?\nToi : Bonjour ! Je vais vous prendre une tradition pas trop cuite, s'il vous plaît.\nCamille : Et quatre cannelés pour moi !\nLa boulangère : Très bien. Et avec ceci ?", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### A pultnál"}},
        {"type": "text", "role": "note", "language": "hu", "text": "Je vais vous prendre…: a pultnál teljesen természetes rendelési fordulat. Figyeld meg: a vous névmás az infinitif elé kerül. Az en ugyanígy viselkedik.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### A pultnál"}},
        {"type": "text", "role": "lesson", "language": "hu", "text": "Az en egy korábban említett mennyiségre utal vissza (du…, de la…, des…, de…, számnév + főnév).\n1. Ragozott ige mellett az en a ragozott ige elé kerül.\nCamille mange de la confiture tous les matins. → Camille en mange tous les matins.\n2. Infinitif mellett ahhoz az infinitifhez kerül, amelynek a tárgyát helyettesíti. A szám megmarad.\nLa boulangère va commander six sacs de farine. → Elle va en commander six.\n3. Tagadásban a ne… pas a ragozott igét fogja közre, az en közvetlenül az ige előtt áll.\nCamille ne boit pas de café. → Camille n'en boit pas.\n4. Passé composé-ban az en a segédige elé kerül. A szám megmarad, a főnév nem.\nAu comptoir, Camille a pris quatre cannelés. → Camille en a pris quatre.\nA szám után nem kell melléknév: elég az en és a szám.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar magyarázat"}},
        {"type": "list", "role": "example", "title": "Ellenpéldák", "language": "hu", "entries": [
          "Elle va commander en six. – Hibás: az en az infinitif elé kerül.",
          "Camille a en pris quatre. – Hibás: passé composé-ban az en a segédige elé kerül.",
          "Camille en a pris quatre cannelés. – Hibás: az en már helyettesíti a főnevet.",
          "Camille ne boit pas en. – Hibás: az en a ragozott ige előtt áll."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Ellenpéldák"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i05",
          "capability": "CAP-transformation",
          "variant": "PV-transform-sentence",
          "prompt": "Remplace le complément de quantité par en. Écris quatre réponses complètes.",
          "response": {"type": "fields", "fields": [
            {"id": "f1", "label": "8 h 45. La boulangère : « Il me reste du pain de seigle, à la coupe. Ça vous tente ? » Tu acceptes : Je prends du pain de seigle."},
            {"id": "f2", "label": "8 h 45. La boulangère te donne les deux pains au chocolat que tu as réservés hier soir : « Et avec ceci ? Les croissants sortent du four. » Tu réponds : Je vais prendre deux croissants."},
            {"id": "f3", "label": "9 h 05, à la maison. Camille te prépare un café et te tend le sucre. Tu refuses : Je ne veux pas de sucre."},
            {"id": "f4", "label": "9 h 15. À la maison, vous avez ouvert la boîte de flan : il n'y a que deux parts. Tu retournes au Pain Perché, tu montres la boîte de flan et tu expliques poliment à la boulangère : Nous avons acheté trois parts de flan."}
          ], "normalization": {"numbersFr": true}},
          "solution": {
            "type": "exact",
            "key": {"f1": "J'en prends.", "f2": "Je vais en prendre deux.", "f3": "Je n'en veux pas.", "f4": "Nous en avons acheté trois."},
            "alternatives": [
              "Oui, j'en prends.", "J'en prends, merci.", "Oui, j'en prends, merci.", "J'en prends, s'il vous plaît.", "Volontiers, j'en prends.", "Oui, volontiers, j'en prends.",
              "J'en prends, du pain de seigle.", "J'en prends un morceau.", "Oui, j'en prends un morceau.",
              "J'en veux bien.", "Oui, j'en veux bien.", "Volontiers, j'en veux bien.",
              "Je vais vous en prendre deux.", "Je vais en prendre deux, s'il vous plaît.", "Je vais vous en prendre deux, s'il vous plaît.", "Oui, je vais en prendre deux.",
              "Non, je n'en veux pas.", "Non merci, je n'en veux pas.", "Non, merci, je n'en veux pas.", "Je n'en veux pas, merci.", "Non, c'est bon, je n'en veux pas.",
              "Je n'en veux pas, de sucre.",
              "Je n'en prends pas.", "Non, je n'en prends pas.", "Non merci, je n'en prends pas.",
              "Nous vous en avons acheté trois.", "Nous en avions acheté trois.",
              "On en a acheté trois.", "On vous en a acheté trois.", "On en avait acheté trois.",
              "Nous en avons acheté trois parts.", "On en a acheté trois parts.",
              "Nous en avons pris trois.", "On en a pris trois.", "Nous vous en avons pris trois."
            ],
            "rejected": [
              {"text": "Je prends en.", "feedbackRef": "U21-I05-E01"},
              {"text": "Je en prends.", "feedbackRef": "U21-I05-E02"},
              {"text": "J'en prends du pain de seigle.", "feedbackRef": "U21-I05-E03"},
              {"text": "Je le prends.", "feedbackRef": "U21-I05-E04"},
              {"text": "J'en vais prendre deux.", "feedbackRef": "U21-I05-E05"},
              {"text": "Je vais prendre en deux.", "feedbackRef": "U21-I05-E06"},
              {"text": "Je vais en prendre deux croissants.", "feedbackRef": "U21-I05-E07"},
              {"text": "Je vais en prendre.", "feedbackRef": "U21-I05-E08"},
              {"text": "Je ne veux pas en.", "feedbackRef": "U21-I05-E09"},
              {"text": "Je ne veux en pas.", "feedbackRef": "U21-I05-E09"},
              {"text": "Je n'en veux pas de sucre.", "feedbackRef": "U21-I05-E10"},
              {"text": "Je ne le veux pas.", "feedbackRef": "U21-I05-E11"},
              {"text": "Nous avons en acheté trois.", "feedbackRef": "U21-I05-E12"},
              {"text": "Nous en avons acheté trois parts de flan.", "feedbackRef": "U21-I05-E13"},
              {"text": "Nous en avons achetées trois.", "feedbackRef": "U21-I05-E14"},
              {"text": "Nous en avons acheté.", "feedbackRef": "U21-I05-E15"},
              {"text": "J'en prends deux.", "reason": "nem a kért művelet: a mért szerkezet (je vais + en + infinitif) hiányzik", "feedbackRef": "U21-I05-F01"},
              {"text": "J'en veux deux.", "reason": "nem a kért művelet: a mért szerkezet (je vais + en + infinitif) hiányzik", "feedbackRef": "U21-I05-F01"}
            ]
          },
          "feedback": {
            "correct": "Mind a négy helyes: az « en » a ragozott ige elé, az infinitif elé, a « ne… pas » közé, illetve a segédige elé került, és a szám megmaradt.",
            "incorrect": "Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: « en »-nel helyettesítetted-e a mennyiségi bővítményt, jó helyen áll-e az « en », és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.",
            "targeted": [
              {"id": "U21-I05-E01", "text": "Ragozott ige mellett az « en » az ige elé kerül: « j'en prends »."},
              {"id": "U21-I05-E02", "text": "Magánhangzó előtt « je » → « j' »: « j'en prends »."},
              {"id": "U21-I05-E03", "text": "Az « en » már helyettesíti a « du pain de seigle »-t; ne ismételd meg."},
              {"id": "U21-I05-E04", "text": "A « le » egy meghatározott dologra utal. Itt valamennyi rozskenyérről van szó (« du… »), ezt az « en » veszi át."},
              {"id": "U21-I05-E05", "text": "Az « en » ahhoz az infinitifhez kerül, amelynek a tárgyát helyettesíti: « je vais en prendre deux »."},
              {"id": "U21-I05-E06", "text": "Az « en » nem a szám elé, hanem az infinitif elé kerül: « en prendre deux »."},
              {"id": "U21-I05-E07", "text": "Az « en » már helyettesíti a « croissants »-t: a szám megmarad, a főnév nem: « en prendre deux »."},
              {"id": "U21-I05-E08", "text": "A szám megmarad: « je vais en prendre deux »."},
              {"id": "U21-I05-E09", "text": "Tagadásban az « en » közvetlenül a ragozott ige előtt áll, a « ne… pas » fogja közre: « je n'en veux pas »."},
              {"id": "U21-I05-E10", "text": "Az « en » már helyettesíti a « de sucre »-t; ne ismételd meg."},
              {"id": "U21-I05-E11", "text": "A « de sucre » mennyiséget jelöl, nem egy meghatározott dolgot: ezt az « en » veszi át."},
              {"id": "U21-I05-E12", "text": "Passé composé-ban az « en » a segédige elé kerül: « nous en avons acheté trois »."},
              {"id": "U21-I05-E13", "text": "Az « en » már helyettesíti a « de flan »-t; ne ismételd meg: « nous en avons acheté trois »."},
              {"id": "U21-I05-E14", "text": "Az « en » után a participe passé rendszerint nem egyezik: « acheté »."},
              {"id": "U21-I05-E15", "text": "A szám megmarad: « trois ». Éppen ez a reklamáció lényege."},
              {"id": "U21-I05-N01", "trigger": "On en a acheté trois. | On vous en a acheté trois. | On en avait acheté trois.", "text": "Helyes. A feladat a « nous »-t adta; az « on » itt is természetes."},
              {"id": "U21-I05-N02", "trigger": "J'en prends, du pain de seigle. | Je n'en veux pas, de sucre.", "text": "Vesszővel ez helyes, beszélt nyelvi kihelyezés. A feladat a helyettesítést kéri, ezért a rövid alak a cél: « j'en prends » / « je n'en veux pas »."},
              {"id": "U21-I05-N03", "trigger": "J'en prends un morceau. | Oui, j'en prends un morceau.", "text": "Helyes mondat, de a kiinduló mondatban nincs mennyiség. A cél a puszta helyettesítés: « j'en prends »."},
              {"id": "U21-I05-N04", "trigger": "Nous en avons acheté trois parts. | On en a acheté trois parts.", "text": "Helyes: itt az « en » a « de flan »-t veszi át, a « trois parts » a mennyiség. A rövidebb, gyakoribb forma: « nous en avons acheté trois »."},
              {"id": "U21-I05-N05", "trigger": "J'en veux bien. | Oui, j'en veux bien. | Volontiers, j'en veux bien. | Je n'en prends pas. | Non, je n'en prends pas. | Non merci, je n'en prends pas. | Nous en avons pris trois. | On en a pris trois. | Nous vous en avons pris trois.", "text": "Helyes, természetes mondat, és az « en » jó helyen áll, de más igével írtad. Itt a kiinduló mondat igéjét tartsd meg, és csak a bővítményt cseréld « en »-re."},
              {"id": "U21-I05-F01", "trigger": "J'en prends deux. | J'en veux deux.", "text": "Ez helyes francia mondat, de nem a kért átalakítás: a kiinduló mondatban « je vais + infinitif » áll. Tartsd meg ezt a szerkezetet, és csak a bővítményt cseréld « en »-re. Hova kerül ilyenkor az « en »? Próbáld újra."}
            ]
          },
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-en-partitive-reference", "w01-g-en-position-finite-infinitive", "w01-g-en-quantity-retention"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i05"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p07",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "Clinique d'erreurs",
      "instruction": "Corrige les deux phrases fausses sans changer le sens.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p07 – *Clinique d'erreurs*"},
      "content": [
        {"type": "text", "role": "situation", "language": "fr", "text": "Samedi, 19 h 40. Sur Instagram, tu as demandé au Pain Perché si on peut réserver pour demain. On te répond. Tu prépares ta réponse et tu la relis avant de l'envoyer.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p07 – *Clinique d'erreurs*"}},
        {"type": "text", "role": "lesson", "language": "hu", "text": "Két tipikus hiba:\n1. infinitif mellett az en az infinitif után vagy a szám elé csúszik;\n2. az en mellett megismétlődik a helyettesített főnévi csoport vagy annak determinánsa.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar emlékeztető"}},
        {"type": "list", "role": "example", "language": "fr", "entries": [
          "✗ Tu vas goûter en un ? → ✓ Tu vas en goûter un ?",
          "✗ Les cookies, il ne faut pas en garder des pour le lendemain : ils sèchent. → ✓ Les cookies, il ne faut pas en garder pour le lendemain : ils sèchent.",
          "✗ Il reste des cookies ? Oui, j'en ai gardé un cookie pour toi. → ✓ Oui, j'en ai gardé un pour toi."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Példák"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i06",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-two-fields",
          "instruction": "Ton brouillon contient deux phrases fausses. Dans chacune, corrige seulement l'erreur et garde tous les autres mots. Écris les deux phrases corrigées.",
          "prompt": "Toi : Bonjour ! Est-ce que vous prenez des réservations pour demain matin ?\nLe Pain Perché : Bonsoir ! Oui : le dimanche, on réserve les pains au chocolat, et les chouquettes par sachet de vingt. Combien pour vous ?\n\nTon brouillon : Bonsoir et merci ! Pour les pains au chocolat, c'est parfait. Je vais prendre en deux. Les chouquettes, vingt, c'est beaucoup pour trois personnes. Nous ne voulons pas en acheter des. Nous passerons vers 8 h 45. Bonne soirée !",
          "response": {"type": "fields", "fields": [{"id": "f1", "label": "1"}, {"id": "f2", "label": "2"}], "normalization": {"numbersFr": true}},
          "solution": {
            "type": "exact",
            "key": {"f1": "Je vais en prendre deux.", "f2": "Nous ne voulons pas en acheter."},
            "alternatives": [
              "Je vais vous en prendre deux."
            ],
            "rejected": [
              {"text": "J'en vais prendre deux.", "feedbackRef": "U21-I06-E01"},
              {"text": "Je vais en prendre deux pains au chocolat.", "feedbackRef": "U21-I06-E02"},
              {"text": "Je vais prendre deux.", "feedbackRef": "U21-I06-E03"},
              {"text": "Nous ne voulons pas en acheter des.", "feedbackRef": "U21-I06-E04"},
              {"text": "Nous ne voulons pas en acheter des chouquettes.", "feedbackRef": "U21-I06-E04"},
              {"text": "Nous ne voulons pas en acheter de.", "feedbackRef": "U21-I06-E05"},
              {"text": "Nous n'en voulons pas.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F01"},
              {"text": "Nous n'allons pas en prendre.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F01"},
              {"text": "Nous n'en prendrons pas.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F01"},
              {"text": "Nous ne voulons pas en prendre.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F01"},
              {"text": "On n'en veut pas.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F01"},
              {"text": "J'en prendrai deux.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F02"},
              {"text": "J'en prends deux.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F02"},
              {"text": "J'en veux deux.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F02"},
              {"text": "On ne veut pas en acheter.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F03"},
              {"text": "Nous ne voulons pas acheter de chouquettes.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F04"},
              {"text": "Nous ne voulons pas en acheter vingt.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F05"},
              {"text": "Je vais en réserver deux.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F06"},
              {"text": "Je vais vous en réserver deux.", "reason": "nem a kért művelet", "feedbackRef": "U21-I06-F06"}
            ]
          },
          "feedback": {
            "correct": "Pontosan: az « en » az infinitif elé került (« en prendre », « en acheter »), és mellette nem maradt meg a helyettesített főnévi csoport.",
            "incorrect": "Ez nem egyezik a várt javítással. Ellenőrizd az « en » helyét, és hogy nem maradt-e meg mellette a főnév vagy a determináns. Az instrukció szerint csak a hibát javítod, a többi szót megtartod.",
            "targeted": [
              {"id": "U21-I06-A01", "trigger": "Je vais vous en prendre deux.", "text": "Elfogadva: a « vous » a pultnál és foglaláskor természetes, és az « en » jó helyen áll (« vous en prendre »). Az instrukció csak a hiba javítását kérte, ezért a piszkozat szavaival a pontos javítás: « je vais en prendre deux »."},
              {"id": "U21-I06-E01", "text": "Az « en » az infinitif elé kerül, amelynek a tárgyát helyettesíti: « je vais en prendre deux »."},
              {"id": "U21-I06-E02", "text": "Az « en » már helyettesíti a « pains au chocolat »-t: « je vais en prendre deux »."},
              {"id": "U21-I06-E03", "text": "Szám mellett az « en » kötelező: « je vais en prendre deux »."},
              {"id": "U21-I06-E04", "text": "Az « en » már helyettesíti a « chouquettes »-et; a « des » fölösleges."},
              {"id": "U21-I06-E05", "text": "Tagadásban sem kell utána determináns: az « en » már átvette a főnévi csoportot."},
              {"id": "U21-I06-F01", "trigger": "Nous n'en voulons pas. | Nous n'allons pas en prendre. | Nous n'en prendrons pas. | Nous ne voulons pas en prendre. | On n'en veut pas.", "text": "Ez helyes francia mondat, de az instrukció szerint csak a hibát javítod, a többi szót megtartod. Így a « vouloir + acheter » szerkezet megmarad: « nous ne voulons pas en acheter »."},
              {"id": "U21-I06-F02", "trigger": "J'en prendrai deux. | J'en prends deux. | J'en veux deux.", "text": "Helyes mondat, de a piszkozatban « je vais + infinitif » áll, és a többi szót meg kell tartanod: « je vais en prendre deux »."},
              {"id": "U21-I06-F03", "trigger": "On ne veut pas en acheter.", "text": "Helyes, de a piszkozat a « nous »-t használja, és a többi szót meg kell tartanod: « nous ne voulons pas en acheter »."},
              {"id": "U21-I06-F04", "trigger": "Nous ne voulons pas acheter de chouquettes.", "text": "Helyes mondat, de a piszkozatban az « en » helyettesíti a « chouquettes »-et. Csak a fölösleges « des »-t kell törölni: « nous ne voulons pas en acheter »."},
              {"id": "U21-I06-F05", "trigger": "Nous ne voulons pas en acheter vingt.", "text": "Helyes mondat, de így csak a húszas zacskót utasítod el, és új szót tettél bele. A piszkozat szerint egyáltalán nem kértek: « nous ne voulons pas en acheter »."},
              {"id": "U21-I06-F06", "trigger": "Je vais en réserver deux. | Je vais vous en réserver deux.", "text": "Helyes, foglalásnál természetes is. Az instrukció szerint azonban a többi szó marad, így a « prendre » ige is: « je vais en prendre deux »."}
            ]
          },
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-en-position-finite-infinitive", "w01-g-en-partitive-reference"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i06"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p08",
      "template": "PAGE-closed",
      "variant": "PV-closed-mixed",
      "title": "Six rappels mélangés",
      "instruction": "Complète ou transforme chaque phrase. Les six phrases ne testent pas toutes la même règle.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p08 – *Six rappels mélangés*"},
      "content": [
        {"type": "list", "role": "lesson", "title": "Vegyes előhívás a hétvége hat pillanatából:", "language": "hu", "entries": [
          "partitív du;", "összevont de + le;", "d' elöl álló melléknév előtt;", "des petits pains;", "beaucoup de;", "en infinitif előtt, a számmal."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar emlékeztető"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i07-s001",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-short",
          "instruction": "Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.",
          "prompt": "Dimanche, 10 h 40. Vous préparez des tartines pour le brunch. Camille : « Et sur celles de Léo, tu mets quoi ? » Toi : « Il adore le sucré : je mets ___ miel. »",
          "response": {"type": "text", "lines": "single"},
          "solution": {"type": "exact", "key": "du", "alternatives": ["du miel"], "rejected": [
            {"text": "de", "feedbackRef": "U21-I07-S001-E01"},
            {"text": "le", "feedbackRef": "U21-I07-S001-E02"},
            {"text": "de la", "feedbackRef": "U21-I07-S001-E03"},
            {"text": "un", "feedbackRef": "U21-I07-S001-E04"},
            {"text": "des", "feedbackRef": "U21-I07-S001-E05"},
            {"text": "beaucoup de", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S001-F01"},
            {"text": "un peu de", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S001-F01"},
            {"text": "plein de", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S001-F01"},
            {"text": "pas mal de", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S001-F01"},
            {"text": "trop de", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S001-F01"}
          ]},
          "feedback": {"correct": "Igen: valamennyi mézet teszel rá → partitív « du ».",
            "incorrect": "Ez nem a várt alak. Válassz a « du », « de la », « de », « d' », « des » közül: mi áll a « miel » előtt, ha valamennyit teszel rá?",
            "targeted": [
            {"id": "U21-I07-S001-E01", "text": "Állító mondatban, mennyiségszó nélkül a « de » nem elég: valamennyi méz → « du miel »."},
            {"id": "U21-I07-S001-E02", "text": "Nem egy meghatározott mézről beszélsz, hanem arról, hogy valamennyit teszel rá: « du »."},
            {"id": "U21-I07-S001-E03", "text": "A « miel » hímnemű: « du miel »."},
            {"id": "U21-I07-S001-E04", "text": "A méz anyagnév, nem darab: valamennyit teszel rá → « du »."},
            {"id": "U21-I07-S001-E05", "text": "A « miel » egyes számú anyagnév: valamennyi méz → « du miel »."},
            {"id": "U21-I07-S001-F01", "trigger": "beaucoup de | un peu de | plein de | pas mal de | trop de | beaucoup de miel | un peu de miel | plein de miel | pas mal de miel | trop de miel", "text": "Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: « du », « de la », « de », « d' » vagy « des »."}
          ]},
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-det-partitive-mass"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i07-s001"}
        },
        {
          "id": "w01-u-2-1-i07-s002",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-short",
          "instruction": "Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.",
          "prompt": "Dimanche, 8 h 25. Camille a dormi chez ses parents. Elle t'écrit : « J'arrive en métro ! » Tu l'attends à la sortie ___ métro Croix-Rousse.",
          "response": {"type": "text", "lines": "single"},
          "solution": {"type": "exact", "key": "du", "alternatives": ["du métro"], "rejected": [
            {"text": "de", "feedbackRef": "U21-I07-S002-E01"},
            {"text": "de la", "feedbackRef": "U21-I07-S002-E02"},
            {"text": "des", "feedbackRef": "U21-I07-S002-E03"}
          ]},
          "feedback": {"correct": "Igen: « la sortie de » + « le métro » → « du ».",
            "incorrect": "Ez nem a várt alak. Válassz a « du », « de la », « de », « d' », « des » közül: « la sortie de » + « le métro » → ?",
            "targeted": [
            {"id": "U21-I07-S002-E01", "text": "Itt egy konkrét állomás kijáratáról van szó (« le métro Croix-Rousse »): « la sortie de » + « le métro » → « du »."},
            {"id": "U21-I07-S002-E02", "text": "A « métro » hímnemű: « du métro »."},
            {"id": "U21-I07-S002-E03", "text": "Egy állomásról van szó: « de + le = du »."}
          ]},
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-det-semantic-contrast"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i07-s002"}
        },
        {
          "id": "w01-u-2-1-i07-s003",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-short",
          "instruction": "Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.",
          "prompt": "Samedi soir, sur le site du Pain Perché, rubrique « Notre maison » : « Chaque samedi, nous cuisons ___ immenses tourtes de seigle, vendues à la coupe. »",
          "response": {"type": "text", "lines": "single"},
          "solution": {"type": "exact", "key": "d'", "alternatives": ["d'immenses", "d'immenses tourtes"], "rejected": [
            {"text": "des", "feedbackRef": "U21-I07-S003-E01"},
            {"text": "de", "feedbackRef": "U21-I07-S003-E02"},
            {"text": "les", "feedbackRef": "U21-I07-S003-E03"},
            {"text": "du", "feedbackRef": "U21-I07-S003-E04"},
            {"text": "de la", "feedbackRef": "U21-I07-S003-E04"},
            {"text": "nos", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S003-F01"},
            {"text": "ces", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S003-F01"},
            {"text": "quelques", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S003-F01"},
            {"text": "plusieurs", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S003-F01"}
          ]},
          "feedback": {"correct": "Igen: gondozott szövegben elöl álló, magánhangzós melléknév előtt « d' » áll: « d'immenses tourtes ».",
            "incorrect": "Ez nem a várt alak. Válassz a « du », « de la », « de », « d' », « des » közül: mi áll gondozott szövegben az elöl álló, magánhangzós melléknév előtt?",
            "targeted": [
            {"id": "U21-I07-S003-E01", "text": "Gondozott bemutatkozó szövegben elöl álló melléknév előtt « d' » áll: « d'immenses tourtes »."},
            {"id": "U21-I07-S003-E02", "text": "Magánhangzó előtt elízió: « d'immenses »."},
            {"id": "U21-I07-S003-E03", "text": "A szöveg a kínálatot mutatja be, nem ismert tourte-okra utal: « d' »."},
            {"id": "U21-I07-S003-E04", "text": "A « tourtes » többes számú: egyes számú « du » vagy « de la » nem állhat előtte. Elöl álló melléknév előtt: « d' »."},
            {"id": "U21-I07-S003-F01", "trigger": "nos | ces | quelques | plusieurs | deux | trois | quatre | cinq | six | sept | huit | neuf | dix | onze | douze | quinze | vingt", "text": "Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: « du », « de la », « de », « d' » vagy « des »."}
          ]},
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-de-adjective-standard"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i07-s003"}
        },
        {
          "id": "w01-u-2-1-i07-s004",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-short",
          "instruction": "Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.",
          "prompt": "Dimanche, 8 h 45. Sous la rubrique « Petits pains » de l'ardoise, la boulangère a ajouté à la craie : « Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds ! »",
          "response": {"type": "text", "lines": "single"},
          "solution": {"type": "exact", "key": "des", "alternatives": ["des petits pains"], "rejected": [
            {"text": "de", "reason": "feltételes: a 0.3 kaputól függ (i03, s004, i08, p04 együtt)", "feedbackRef": "U21-I07-S004-E01"},
            {"text": "les", "feedbackRef": "U21-I07-S004-E02"},
            {"text": "du", "feedbackRef": "U21-I07-S004-E03"},
            {"text": "de la", "feedbackRef": "U21-I07-S004-E03"},
            {"text": "d'", "feedbackRef": "U21-I07-S004-E04"},
            {"text": "nos", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S004-F01"},
            {"text": "ces", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S004-F01"},
            {"text": "quelques", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S004-F01"},
            {"text": "plusieurs", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S004-F01"},
            {"text": "beaucoup de", "reason": "nem a kért alak (zárt készlet)", "feedbackRef": "U21-I07-S004-F01"}
          ]},
          "feedback": {"correct": "Igen: a « petits pains » termékfajta neve, ezért a táblára írt mondatban is « des » marad: « des petits pains aux noix ».",
            "incorrect": "Ez nem a várt alak. Válassz a « du », « de la », « de », « d' », « des » közül: mi áll a « petits pains » termék neve előtt?",
            "targeted": [
            {"id": "U21-I07-S004-E01", "text": "A « petits pains » itt a tábla egyik termékfajtájának a neve (Petits pains rovat). Az ilyen összeforrt kifejezések előtt a « des » marad: « des petits pains »."},
            {"id": "U21-I07-S004-E02", "text": "Új termék bejelentése, nem ismert csoport: nem határozott névelő."},
            {"id": "U21-I07-S004-E03", "text": "A « petits pains » többes számú: « des »."},
            {"id": "U21-I07-S004-E04", "text": "A « petits » mássalhangzóval kezdődik, itt nincs elízió. A termék neve előtt « des » áll."},
            {"id": "U21-I07-S004-F01", "trigger": "nos | ces | quelques | plusieurs | plein de | pas mal de | beaucoup de | deux | trois | quatre | cinq | six | sept | huit | neuf | dix | onze | douze | quinze | vingt | trente | quarante | cinquante | soixante | cent", "text": "Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: « du », « de la », « de », « d' » vagy « des »."}
          ]},
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-de-adjective-standard"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i07-s004"}
        },
        {
          "id": "w01-u-2-1-i07-s005",
          "capability": "CAP-typed-short",
          "variant": "PV-typed-short",
          "instruction": "Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.",
          "prompt": "Samedi soir, même rubrique « Notre maison » : « Notre boutique est minuscule, mais nous proposons chaque jour beaucoup ___ variétés de pain. »",
          "response": {"type": "text", "lines": "single"},
          "solution": {"type": "exact", "key": "de", "alternatives": ["de variétés"], "rejected": [
            {"text": "des", "feedbackRef": "U21-I07-S005-E01"},
            {"text": "d'", "feedbackRef": "U21-I07-S005-E02"},
            {"text": "du", "feedbackRef": "U21-I07-S005-E03"},
            {"text": "de la", "feedbackRef": "U21-I07-S005-E03"}
          ]},
          "feedback": {"correct": "Igen: nyitott mennyiség, megnevezett csoport nélkül → « beaucoup de ».",
            "incorrect": "Ez nem a várt alak. Válassz a « du », « de la », « de », « d' », « des » közül: mi áll a « beaucoup » után, ha nincs megnevezett csoport?",
            "targeted": [
            {"id": "U21-I07-S005-E01", "text": "A « variétés de pain » nem egy megnevezett, határozott csoport: nyitott mennyiség → « beaucoup de »."},
            {"id": "U21-I07-S005-E02", "text": "A « variétés » mássalhangzóval kezdődik: « de »."},
            {"id": "U21-I07-S005-E03", "text": "A « beaucoup » után mennyiségjelzőként « de » áll, nem névelő: « beaucoup de variétés »."}
          ]},
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-de-quantity"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i07-s005"}
        },
        {
          "id": "w01-u-2-1-i07-s006",
          "capability": "CAP-transformation",
          "variant": "PV-transform-sentence",
          "instruction": "Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.",
          "prompt": "Dimanche, 8 h 45. La boulangère : « Le flan, c'est à la part. Combien de parts ? » Tu réponds : Je vais prendre trois parts de flan. → Transforme avec en.",
          "response": {"type": "text", "lines": "single", "normalization": {"numbersFr": true}},
          "solution": {"type": "exact", "key": "Je vais en prendre trois.", "alternatives": [
            "Je vais vous en prendre trois.", "Je vais en prendre trois, s'il vous plaît.", "Je vais vous en prendre trois, s'il vous plaît.",
            "Je vais en prendre trois parts.", "Je vais vous en prendre trois parts."
          ], "rejected": [
            {"text": "J'en vais prendre trois.", "feedbackRef": "U21-I07-S006-E01"},
            {"text": "Je vais prendre en trois.", "feedbackRef": "U21-I07-S006-E02"},
            {"text": "Je vais en prendre trois parts de flan.", "feedbackRef": "U21-I07-S006-E03"},
            {"text": "Je vais en prendre.", "feedbackRef": "U21-I07-S006-E04"},
            {"text": "J'en prends trois.", "reason": "nem a kért művelet: a mért szerkezet (je vais + en + infinitif) hiányzik", "feedbackRef": "U21-I07-S006-F01"},
            {"text": "J'en veux trois.", "reason": "nem a kért művelet: a mért szerkezet (je vais + en + infinitif) hiányzik", "feedbackRef": "U21-I07-S006-F01"}
          ]},
          "feedback": {"correct": "Igen: az « en » az infinitif elé került, a szám megmaradt: « je vais en prendre trois ».",
            "incorrect": "Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: az infinitif elé került-e az « en », és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.",
            "targeted": [
            {"id": "U21-I07-S006-E01", "text": "Az « en » az infinitif elé kerül: « je vais en prendre trois »."},
            {"id": "U21-I07-S006-E02", "text": "Az « en » nem a szám elé, hanem az infinitif elé kerül."},
            {"id": "U21-I07-S006-E03", "text": "Az « en » már helyettesíti a « de flan »-t; ne ismételd meg: « je vais en prendre trois »."},
            {"id": "U21-I07-S006-E04", "text": "A szám megmarad: « trois »."},
            {"id": "U21-I07-S006-N01", "trigger": "Je vais en prendre trois parts. | Je vais vous en prendre trois parts.", "text": "Helyes: itt az « en » a « de flan »-t veszi át, a « trois parts » a mennyiség. A rövidebb, gyakoribb forma: « je vais en prendre trois »."},
            {"id": "U21-I07-S006-F01", "trigger": "J'en prends trois. | J'en veux trois.", "text": "Ez helyes francia mondat, de nem a kért átalakítás: a kiinduló mondatban « je vais + infinitif » áll. Tartsd meg ezt a szerkezetet, és csak a bővítményt cseréld « en »-re. Hova kerül ilyenkor az « en »? Próbáld újra."}
          ]},
          "evaluation": {"mode": "exact", "scoring": "formative-required"},
          "targetRefs": ["w01-g-en-position-finite-infinitive", "w01-g-en-quantity-retention"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i07-s006"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p09",
      "template": "PAGE-writing",
      "variant": "PV-writing-short",
      "title": "Production guidée : la réponse à Léo",
      "instruction": "Écris un court message cohérent de 6 à 8 phrases.",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p09 – *Production guidée : la réponse à Léo*"},
      "content": [
        {"type": "text", "role": "lesson", "language": "hu", "text": "Ez a záróprodukció. Nem kulcsszavakat kell felsorolnod, hanem egy valódi üzenetet kell írnod, amelyben a blokk kontrasztjai jelentés szerint, a helyükön állnak. Barátnak írt üzenetben is természetes a de bons…, de beaux…, de grosses…: a gyakori, rövid melléknevekkel a de a hétköznapi nyelvben is megmarad.", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Magyar előkészítés"}},
        {"type": "list", "role": "brief", "language": "hu", "entries": [
          "Címzett: Léo, francia barát.",
          "Regiszter: informális, de nem szleng (SMS, tegeződés).",
          "Cél: megírni, mi van már meg, mit hozzon Léo és mennyit, honnan, és miért onnan.",
          "Terjedelem: 6–8 összefüggő mondat."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i08"}},
        {"type": "list", "role": "checklist", "title": "Mit tartalmazzon az üzenet (tartalmi elemek):", "language": "hu", "entries": [
          "mit vettetek már Camille-lal;",
          "mit hozzon Léo, mennyiséggel, és legalább egy tételt meghatározatlan mennyiségben (pl. sajtot, gyümölcslét);",
          "honnan: egy du-val megnevezhető helyről (bolt, stand vagy pékség, pl. le stand du…, la boulangerie du…);",
          "egy nyitott mennyiség vagy tömeg (a piac, a sor, a kínálat);",
          "egy megnevezett csoport egy része;",
          "miért azt a helyet ajánlod."
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i08"}},
        {"type": "list", "role": "checklist", "title": "Ellenőrizd beadás előtt (nyelvi kritériumok):", "language": "hu", "entries": [
          "Van-e egy « du », amely „valamennyit” jelent, és egy másik, amely « de + le »? (pl. « du sel » ↔ « le prix du sel »)",
          "Van-e « de/d' » + elöl álló melléknév + többes számú főnév? (pl. « de jolies assiettes »)",
          "Van-e « des petits pains »?",
          "Van-e « beaucoup de » nyitott mennyiségre, és « beaucoup des » egy megnevezett csoport részére? (pl. « beaucoup de voitures » ↔ « beaucoup des voitures du parking »)",
          "Van-e « en » ragozott ige vagy segédige előtt? (pl. « Paul en boit » ; « il en a bu deux »)",
          "Van-e « en » infinitif előtt, a számmal együtt? (pl. « elle va en couper deux »)"
        ], "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i08"}}
      ],
      "items": [
        {
          "id": "w01-u-2-1-i08",
          "capability": "CAP-writing",
          "variant": "PV-writing-short",
          "instruction": "Écris 6 à 8 phrases. Dis à Léo ce que vous avez déjà, ce qu'il doit apporter (et combien), où l'acheter et pourquoi.",
          "prompt": "Dimanche, 10 h 15. Léo t'écrit : « Je pars de chez moi ! Je passe par le marché de la Croix-Rousse : il vous manque quelque chose pour le brunch ? » Réponds-lui.",
          "response": {"type": "text", "lines": "multi", "sentences": {"min": 6, "max": 8}},
          "solution": {
            "type": "rubric",
            "criteria": [
              {"label": "A. Nyelvi kritériumok (allCriteria)", "points": 6, "requirements": [
                "egy partitív és egy összevont du",
                "de/d' + elöl álló melléknév + többes számú főnév",
                "des petits pains",
                "beaucoup de nyitott mennyiségre és beaucoup des egy megnevezett csoport részére",
                "en ragozott ige (vagy segédige) előtt, kimondott előzménnyel",
                "en infinitif előtt, a számmal"
              ]},
              {"label": "B. Tartalom", "points": 6, "requirements": [
                "mit vettetek már",
                "mit hozzon és mennyit, legalább egy anyagnévvel meghatározatlan mennyiségben",
                "honnan (du-val megnevezhető hely)",
                "nyitott mennyiség vagy tömeg (a beaucoup de monde is elég)",
                "egy megnevezett csoport része",
                "miért az a hely"
              ]},
              {"label": "C. Üzenet és regiszter", "points": 4, "requirements": [
                "valódi, összefüggő válasz Léónak; tegeződés; informális, de nem szleng; 6–8 mondat",
                "nincs ellentmondás a saját üzeneteddel és a hétvége eseményeivel: amit az üzenet szerint már megvettetek, azt ne kérd újra indok nélkül; a des petits pains ajánlásként vagy indokolt kérésként is állhat"
              ]},
              {"label": "D. Nyelvi pontosság a célon kívül", "points": 4, "requirements": [
                "érthető, kevés nem célzott hiba; francia tipográfia"
              ]},
              {"label": "Szintek (sorrendben, az első teljesülő dönt)", "requirements": [
                "Nem teljesített: A ≤ 3, vagy C = 0.",
                "Kiváló: A = 6, B ≥ 5, C ≥ 3, D ≥ 3.",
                "Teljesített: A = 6, B ≥ 4, C ≥ 2.",
                "Részleges: minden más eset."
              ]}
            ],
            "notSufficient": [
              "a hat szerkezet puszta felsorolása",
              "en kimondott előzmény nélkül",
              "beaucoup des megnevezett csoport nélkül",
              "de petits pains a termék jelentésében (feltételes: a 0.3 kaputól függ)",
              "a kötelező alak megvan, de rossz funkcióban"
            ]
          },
          "feedback": {"targeted": [
            {"id": "U21-I08-E01", "text": "Egy kötelező szerkezet hiányzik, vagy nem a jelentésének megfelelő helyen áll. Nézd meg újra a hat ellenőrzőkérdést."},
            {"id": "U21-I08-E02", "text": "Az « en » előtt nevezd meg, mire utal (pl. « on n'a plus d'œufs : tu peux en prendre six ? »)."},
            {"id": "U21-I08-E03", "text": "A « beaucoup des » után nevezd meg a csoportot (pl. « beaucoup des habitués du quartier »)."},
            {"id": "U21-I08-E04", "text": "Ez még nem üzenet Léónak. Kösd össze a mondatokat: mi van meg, mit hozzon, honnan és miért."},
            {"id": "U21-I08-E05", "text": "Az üzeneted szerint ezt már megvettétek. Kérj valami mást, vagy írd meg, miért kell még."}
          ]},
          "evaluation": {"mode": "dual-gate", "aiAdvisoryOnly": true, "scoring": "formative-required"},
          "targetRefs": ["w01-g-integrated-writing", "w01-g-de-quantity-subset"],
          "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "### w01-u-2-1-i08"}
        }
      ]
    },
    {
      "id": "w01-u-2-1-p09b",
      "template": "PAGE-writing",
      "variant": "PV-writing-short",
      "title": "Production guidée : la réponse à Léo",
      "visibleAfter": "w01-u-2-1-i08",
      "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "## p09 – *Production guidée : la réponse à Léo*"},
      "content": [
        {"type": "model", "id": "w01-u-2-1-model-a", "title": "Modellszöveg A – lelkes ajánlás", "language": "fr", "declaredWords": 121, "text": "Oui, merci, tu es un amour ! Côté boulangerie, on a tout : au Pain Perché, on a pris une tradition, du seigle et des viennoiseries, il y en a largement pour trois. Par contre, on n'a plus d'œufs pour les œufs brouillés : tu peux en prendre six au marché ? Va chez la productrice à côté du kiosque, celle qui vend aussi de beaux fromages de chèvre : ses œufs sont extra. Il y a toujours beaucoup de monde le dimanche, mais beaucoup des producteurs du boulevard prennent la carte maintenant : pas besoin de passer au distributeur. Si tu vois du jus d'orange pressé, prends-en une bouteille. Et si tu as encore faim, la boulangerie du boulevard fait des petits pains aux figues incroyables !", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Modellszöveg A – lelkes ajánlás (a beadás után látható)"}},
        {"type": "model", "id": "w01-u-2-1-model-b", "title": "Modellszöveg B – óvatos „igen, de…”", "language": "fr", "declaredWords": 100, "text": "Oui, mais pas de pain ni de viennoiseries : avec Camille, on en a acheté pour dix ! Ce qui nous manque, c'est du fromage. Va au stand du fromager, tout au bout du marché, même s'il y a la queue : il a de bons chèvres frais et il te fait goûter. Tu peux en prendre deux ? Il y a beaucoup de fromagers sur le boulevard, mais beaucoup des habitués du quartier ne jurent que par lui. Et évite la boulangerie du coin de la rue : elle fait des petits pains aux olives à tomber, tu vas craquer. À tout de suite !", "manuscriptRef": {"file": "w01-u-2-1.kezirat.md", "anchor": "#### Modellszöveg B – óvatos „igen, de…” (a beadás után látható)"}}
      ],
      "items": []
    }
  ],
  "completion": {
    "mode": "all-items",
    "requiredRefs": [
      "w01-u-2-1-i01", "w01-u-2-1-i02", "w01-u-2-1-i03", "w01-u-2-1-i04", "w01-u-2-1-i05", "w01-u-2-1-i06",
      "w01-u-2-1-i07-s001", "w01-u-2-1-i07-s002", "w01-u-2-1-i07-s003", "w01-u-2-1-i07-s004", "w01-u-2-1-i07-s005", "w01-u-2-1-i07-s006",
      "w01-u-2-1-i08"
    ]
  }
}
BLOKK_JSON_VEGE

TANULOI_NEZET
U21 — Du, des, de : forme ou sens ?

[w01-u-2-1-i01] (p02 — Deux valeurs de du)
Explique brièvement la valeur de du dans les deux phrases.
1. Le dimanche, Camille et moi, on achète du pain de seigle : il se garde plusieurs jours.
2. Le Pain Perché est juste à côté du parc de la Cerisaie.
Réponse : 1 = … ; 2 = …  [mező: rövid szöveg]

[w01-u-2-1-i02] (p03 — Choisir entre du, de, de la et des)
Choisis la bonne réponse.
Dimanche, 8 h 15. Tu viens de passer vingt minutes dans le café que Léo t'a conseillé. Tu lui écris un SMS :
Je reviens ___ café que tu m'as conseillé. Le serveur est adorable, merci !
A. du   B. de   C. de la   D. des

[w01-u-2-1-i03] (p04 — De belles tartes, des petits pains; az oldal tetején látható az ardoise)
Complète avec de, d' ou des.
Samedi soir, tu compares deux boulangeries. Dans la rubrique « Nos adresses du dimanche » d'un guide de la Croix-Rousse, tu lis :
Même si sa devanture ne paie pas de mine, le Pain Perché propose ___ excellents croissants au beurre et, dès 7 heures, ___ petits pains aux céréales encore tièdes.
[mező 1]  [mező 2]

[w01-u-2-1-i04] (p05 — Beaucoup de ou beaucoup des ?)
Complète avec beaucoup de ou beaucoup des.
Dans la file, Camille regarde la vitrine :
« Bonne nouvelle : il reste encore ___ viennoiseries. Par contre, regarde : ___ tartes de la vitrine sont déjà réservées. »
[mező 1]  [mező 2]

[w01-u-2-1-i05] (p06 — Où placer en ?)
Remplace le complément de quantité par en. Écris quatre réponses complètes.
1. 8 h 45. La boulangère : « Il me reste du pain de seigle, à la coupe. Ça vous tente ? » Tu acceptes : Je prends du pain de seigle.  [mező]
2. 8 h 45. La boulangère te donne les deux pains au chocolat que tu as réservés hier soir : « Et avec ceci ? Les croissants sortent du four. » Tu réponds : Je vais prendre deux croissants.  [mező]
3. 9 h 05, à la maison. Camille te prépare un café et te tend le sucre. Tu refuses : Je ne veux pas de sucre.  [mező]
4. 9 h 15. À la maison, vous avez ouvert la boîte de flan : il n'y a que deux parts. Tu retournes au Pain Perché, tu montres la boîte de flan et tu expliques poliment à la boulangère : Nous avons acheté trois parts de flan.  [mező]

[w01-u-2-1-i06] (p07 — Clinique d'erreurs)
Ton brouillon contient deux phrases fausses. Dans chacune, corrige seulement l'erreur et garde tous les autres mots. Écris les deux phrases corrigées.
Toi : Bonjour ! Est-ce que vous prenez des réservations pour demain matin ?
Le Pain Perché : Bonsoir ! Oui : le dimanche, on réserve les pains au chocolat, et les chouquettes par sachet de vingt. Combien pour vous ?
Ton brouillon : Bonsoir et merci ! Pour les pains au chocolat, c'est parfait. Je vais prendre en deux. Les chouquettes, vingt, c'est beaucoup pour trois personnes. Nous ne voulons pas en acheter des. Nous passerons vers 8 h 45. Bonne soirée !
[mező 1]  [mező 2]

[w01-u-2-1-i07] (p08 — Six rappels mélangés)
Complète ou transforme chaque phrase. Les six phrases ne testent pas toutes la même règle.
Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des. Pour la phrase 6, écris la phrase complète.
1. Dimanche, 10 h 40. Vous préparez des tartines pour le brunch. Camille : « Et sur celles de Léo, tu mets quoi ? » Toi : « Il adore le sucré : je mets ___ miel. »  [mező]
2. Dimanche, 8 h 25. Camille a dormi chez ses parents. Elle t'écrit : « J'arrive en métro ! » Tu l'attends à la sortie ___ métro Croix-Rousse.  [mező]
3. Samedi soir, sur le site du Pain Perché, rubrique « Notre maison » : « Chaque samedi, nous cuisons ___ immenses tourtes de seigle, vendues à la coupe. »  [mező]
4. Dimanche, 8 h 45. Sous la rubrique « Petits pains » de l'ardoise, la boulangère a ajouté à la craie : « Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds ! »  [mező]
5. Samedi soir, même rubrique « Notre maison » : « Notre boutique est minuscule, mais nous proposons chaque jour beaucoup ___ variétés de pain. »  [mező]
6. Dimanche, 8 h 45. La boulangère : « Le flan, c'est à la part. Combien de parts ? » Tu réponds : Je vais prendre trois parts de flan. → Transforme avec en.  [mező: teljes mondat]

[w01-u-2-1-i08] (p09 — Production guidée : la réponse à Léo)
Écris 6 à 8 phrases. Dis à Léo ce que vous avez déjà, ce qu'il doit apporter (et combien), où l'acheter et pourquoi.
Dimanche, 10 h 15. Léo t'écrit : « Je pars de chez moi ! Je passe par le marché de la Croix-Rousse : il vous manque quelque chose pour le brunch ? » Réponds-lui.
Címzett: Léo, francia barát.
Regiszter: informális, de nem szleng (SMS, tegeződés).
Cél: megírni, mi van már meg, mit hozzon Léo és mennyit, honnan, és miért onnan.
Terjedelem: 6–8 összefüggő mondat.
Mit tartalmazzon az üzenet (tartalmi elemek):
1. mit vettetek már Camille-lal;
2. mit hozzon Léo, mennyiséggel, és legalább egy tételt meghatározatlan mennyiségben (pl. sajtot, gyümölcslét);
3. honnan: egy du-val megnevezhető helyről (bolt, stand vagy pékség, pl. le stand du…, la boulangerie du…);
4. egy nyitott mennyiség vagy tömeg (a piac, a sor, a kínálat);
5. egy megnevezett csoport egy része;
6. miért azt a helyet ajánlod.
Ellenőrizd beadás előtt (nyelvi kritériumok):
1. Van-e egy « du », amely „valamennyit” jelent, és egy másik, amely « de + le »? (pl. « du sel » ↔ « le prix du sel »)
2. Van-e « de/d' » + elöl álló melléknév + többes számú főnév? (pl. « de jolies assiettes »)
3. Van-e « des petits pains »?
4. Van-e « beaucoup de » nyitott mennyiségre, és « beaucoup des » egy megnevezett csoport részére? (pl. « beaucoup de voitures » ↔ « beaucoup des voitures du parking »)
5. Van-e « en » ragozott ige vagy segédige előtt? (pl. « Paul en boit » ; « il en a bu deux »)
6. Van-e « en » infinitif előtt, a számmal együtt? (pl. « elle va en couper deux »)
[nagy szövegmező]
(A beadás után: Modellszöveg A és B.)
TANULOI_NEZET_VEGE

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE