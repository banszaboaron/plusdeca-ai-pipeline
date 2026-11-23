# U21 (w01-u-2-1, GI2): javítási terv a T27 nyelvi körhöz, 2. változat a NavE szerint javítva

**Szerep és megbízás:** a nyelvtan oszlop rendezője (GR) vagyok. Ebben a körben a meglévő, tanári bírálatot kapott egység javítási tervét javítom a NavE jelentése alapján.

**Bemenet:**
- a saját előző tervem (1. változat, DRAFT_FOR_REVIEW);
- a NavE jelentése: N-01–N-05 és NOTE-1–NOTE-4;
- a T27 brief;
- az élesben futó kézirat (1. javítási kör) és megoldás (5. változat);
- a CL-27 39 jelzése;
- a szint- és a típusmérce.

**Hatókör:** a tanulói felület nyelve és a magyar szövegben idézett francia elemek jelölése. Kész tanulói szöveget, kulcsot és distractort nem írok. A tervet teljes terjedelmében adom vissza. A változott részeket a fejezetek elején **[ÚJ/JAVÍTVA]** jelöli.

**Hang:** az egységhez nem tartozik felvétel, ezért hangdöntési pont nincs.

**Forrás:** webes forrást ebben a körben sem nyitottam meg (NEM VIZSGÁLT), mert nem volt rá szükség. A 0.3 kapu (OQLF-lap a *petits pains* lexikalizációjáról) továbbra is nyitott, ez a kör nem érinti.

---

## 0. Négy alapdöntés a megbízáson belül (jelölve)

### D1 – A tanári utasítás *vous*-formájú, a szerepjáték tegező marad [JAVÍTVA: N-03, N-04]

- Az oldal- és az itemutasítás egységesen *vous*-formájú: *Choisissez…*, *Complétez…*, *Remplacez…*, *Écrivez…*, *Corrigez…*
- A szerepjáték helyzetszövege tegező marad: *Tu acceptes :*, *Léo t’écrit*, *Camille et toi, vous faites la queue*.
- **Indok:**
  - több itemmondat maga is tegező, és a hiányt tartalmazza (s002: *Tu l’attends à la sortie ___ métro*). Ezek a feladat részei, nem írhatók át.
  - A történetben a *vous* jelentése rögzített: a tanuló és Camille együtt, vagy a pék magázása. Ha az utasítás is magázná a tanulót, a *vous* háromféle jelentése összecsúszna.
- **1. szabály – külön mező:** az utasítás külön mezőben áll, a helyzet külön. Egy mondaton belül nincs *tu*/*vous*-váltás.
- **2. szabály – a helyzetet záró utasítás kiköltözik.** Ez minden ilyen helyre érvényes, nem csak az i08-ra.
  - **i08:** a *Réponds-lui.* kikerül a helyzetből, az utasításmezőbe *vous*-os változat kerül. A helyzet Léo üzenetével zárul.
  - **i07-s006 (N-03):** a *→ Transforme avec en.* kikerül a stimulusból. A stimulus a *Tu réponds : Je vais prendre trois parts de flan.* mondattal zárul. A művelet az i07 utasításának 6. mondatra vonatkozó részébe kerül. Ott az i05 utasításával azonos műveletnév álljon: a mennyiségi bővítmény cseréje „en”-re, teljes mondatban.
  - A művelet tartalma nem változik, így az s006 F01 feedbackje („a kiinduló mondatban „je vais + infinitif” áll…”) továbbra is illeszkedik.
- **3. szabály – nincs kétértelmű *vous* az utasításban (N-04).** Ha az utasítás, a lista vagy a rubrika a tanulót és Camille-t együtt említi, ott nem állhat puszta *vous*. Két megoldás közül választhat a szerző:
  - kifejezett megnevezés (pl. *Camille et vous* mint alany);
  - személytelen megfogalmazás (pl. „ami már otthon van”).

  Érintett helyek: az i08 utasítása, a p09 tartalmi listájának 1. eleme és a rubrika B területe.

### D2 – A kontraszt- és ellenpélda-listák kettéválnak, a teljes kéziratban [JAVÍTVA: N-02 és a NavE tanulsága]

- **A szabály szerkezettípusra szól, nem a CL-27 jelzéseire.** Minden olyan lista vagy sor, amelyben francia példamondat mellett magyar ítélet, jelentés vagy indoklás áll, kettéválik:
  - francia mondat és rövid francia ítéletcímke (✗ / ✓, *incorrect*, *correct, autre sens*, *partitif*, *de + le*, *à l’oral ; à l’écrit soigné : …*);
  - a magyar indoklás vagy jelentés külön `note` szerepű elemben.
- **A 14 érintett sor:**

| Oldal | Sorok száma |
|---|---|
| p02 | 3 |
| p03 | 2; a 2. sort (*…le goût du jus d’orange en bouteille*) a CL-27 nem jelezte, ezért az előző tervből kimaradt |
| p04 | 2 |
| p05 | 3 |
| p06 | 4 |

- **p07 „Példák” lista:** a ✗ → ✓ párok már tisztán franciák, bontani nem kell. A lista „Magyar emlékeztető” címe a belső szakaszcímek szabálya alá esik (lásd 3.2).
- **CEO-leképezési pont:** a JSON-ban a magyar rész külön `note` elem legyen, különben a CL-27 továbbra is figyelmeztet.

### D3 – Idézés: a magyar szövegben „…”, a franciában « » [ÚJ: N-01]

- **Magyar szövegben** minden idézett francia elem „…” között áll. Ide tartozik:
  - a `lesson` és a `note`, beleértve a D2 új `note` elemeit;
  - a p06 *Je vais vous prendre* megjegyzése;
  - a kulturális háttér;
  - a feedback magyarázó és utasító része, valamint minden magyar `incorrect` szöveg.

  Ez a HE-05 szabály a brief szerint.
  - A kézirat magyar magyarázatainak dőlt jelölése, amelyet az app lehánt, „…”-re cserélődik. Ezzel megszűnik az E-06/MO-F04 (6) félreolvasása is: a p06-ban az *en* nem olvasható „én”-nek.
  - A megoldás 1. részének „Jelölés a feedbackben” szabálya (« » a magyar mondatban) ezzel érvényét veszti. Helyette a „…” szabály lép érvénybe.
- **Francia szövegben** az idézett vagy kiemelt francia alak « » között áll, belül NBSP-vel. Ide tartozik: a p09 két listája, a rubrika, a francia utasítások és a D2 francia címkéi.
- **A változás típusa:** a feedbacknél, az `incorrect` szövegeknél és a lessonnél csak tipográfia. A szöveg, a kiváltó (trigger), a kulcs és az elfogadási adat nem változik.
- **Zárt alakkészletek:** a „betűre egyezés” (i03, i04, i07) az alakokra vonatkozik (*de, d’, des*; *beaucoup de / beaucoup des*; *du, de la, de, d’, des*). Az idézőjel fajtájára nem: az utasításban « », a magyar feedbackben „…” áll.

### D4 – A p09 nyelvi listájának mikropéldái lecserélődnek [ÚJ: N-05]

- **Döntés:** csere. A brief állandó szabálya szerint a példák is a francia életből jöjjenek. A mostani példák semlegesek: *du sel*, *de jolies assiettes*, *voitures du parking*, *Paul en boit*.
- **A 3.5 védelme (a kimásolhatóság nem nőhet):**
  1. **Más helyzet:** a pékség, a piac, a brunch és a reggeli kávé nem lehet a példák témája. Ezt adja az i01–i08, a p02–p06 és a három modell (A, B, C). Lehetséges terület például egy apéro, egy piknik a Rhône partján, a lakóház élete vagy a TGV. A szerző választ.
  2. **Más főnév:** egyik sem szerepelhet az itemekben és a modellekben. Tiltott például: *pain, seigle, café, miel, métro, tourte, variété, croissant, sucre, flan, chouquette, œuf, fromage, chèvre, tomate, basilic, jus d’orange, figue, olive, monde, producteur, habitué, fromager, stand*.
  3. **Más ige:** a 6. kritérium (*en* + infinitif) példájában nem állhat *prendre*, *acheter* vagy *mettre*.
  4. **Más szám:** a 6. kritérium száma nem lehet 2, 3, 4, 6, 10 vagy 20.
  5. **Szerkezet:** kritériumonként egy rövid, természetes példa, ugyanabban a szerkezetben, mint most. A 3. kritérium (*des petits pains*) most is példa nélkül áll, ez így marad.
- **Recheck:** PE (3.5) és NyE (természetesség).

---

## 1. Diagnózis

- **Valóságpróba: rendben.** A helyzet már most a francia életből szól:
  - kitalált pékség a Croix-Rousse platóján;
  - valós helyek: Parc de la Cerisaie, a Croix-Rousse metróállomás, a boulevard-i piac;
  - vasárnapi sor, foglalás Instagramon, *ardoise*, *à la coupe*, *à la part*, *formule petit-déj*, brunch;
  - az idővonal a PE- és a NavE-körök után ellentmondásmentes.

  A kifogás nem a helyzetre vonatkozik, hanem arra, hogy a tanulói felület keretszövege magyar.
- **Mi magyar most a felületen:**
  - p01: a helyzetleírás (CL-27 HIBA);
  - p02–p06: a kontraszt- és ellenpélda-listák címe és ítéletei, 14 sor (D2);
  - p09: a brief, a két lista és a két modellcím;
  - a nem jelzett belső szakaszcímek;
  - i08: a rubrika.

  Emiatt a francia szerepjáték magyar keretben fut.
- **Az utasítások franciák, de tegezők** (*Lis…*, *Choisis…*). Ez eltér az egységes, *vous*-formájú tanári stílustól. Az s006 utasítása ráadásul a stimulusba van beágyazva.
- **A magyar szövegek idézési jelölése vegyes:** a kéziratban dőlt, a megoldásban « ». A brief „…”-t ír elő (HE-05), és a dőlt jelölés lehántásakor az *en* félreolvasható. Ezt a D3 kezeli.
- **Nevek:** nincs magyar név (Camille, Léo, Paul, *la boulangère*), a T08 itt üres.
- **Érdekesség és műfaj:** a műfajok hitelesek és változatosak: SMS, Instagram-ardoise, kalauzrovat, honlap, foglalási DM, pultjelenet, reklamáció, baráti válasz. Új helyzet nem kell, és a brief szerint nem is szabad. A p01 francia helyzetleírása legyen élő és konkrét, ne tankönyvi összefoglaló. A p09 mikropéldái is a francia életből jöjjenek (D4).
- **Szint:** a FICHE-01 szerint a partitív és az *en* B1+-on ismétlés. A brief szerint a cél és a szint ebben a körben nem változik. NOTE (GR-T27-03).
- **Új kockázat a francia felülettel:** a francia nyelvi ellenőrzőlista metanyelvi lesz. Ezért a magyar magyarázat terminusaihoz kell kötni (lásd 5. rész).

## 2. Mi marad (és miért) [JAVÍTVA: NOTE-2]

| Elem | Marad | Indok |
|---|---|---|
| Tanulási és mérési cél | mind a 9 célkód | brief |
| Oldal- és item-ID | p01–p09, p09b; i01–i08 a subitemekkel (i05-s001, i07-s001…s006, i08-s001) | a haladás az ID-khez kötődik |
| Feladattípusok | i01 metanyelvi válasz · i02 QCM · i03/i04 kétmezős kitöltés · i05 négy transzformáció · i06 hibajavítás · i07 5 kitöltés + 1 transzformáció · i08 írás 6–8 mondatban | változatlan mérés |
| Itemmondatok és stimulusok | szóról szóra; csak tipográfia (’) változik. **Kivételek (deklarált, a mért tartalmat nem érintik):** (a) i06: a *Ton brouillon* címke semleges alanyt kap; (b) i08: a *Réponds-lui.* átkerül az utasításba; (c) s006: a *→ Transforme avec en.* átkerül az i07 utasításába (D1) | a feladatot nem írjuk újra |
| Kulcsok, alternatívák, F/N/E/A kategóriák, normalizálás | változatlanok | az aposztróf normalizálva van, ezért a ’ nem érinti az egyezést |
| Zárt alakkészletek | i03: *de, d’, des*; i04: *beaucoup de / beaucoup des*; i07: *du, de la, de, d’, des* | E-01, E-08 |
| Az i06 szerkezetmegtartó feltétele | „csak a hibát” + „minden más szót tarts meg” | E-02, erre épül az F01–F06 |
| Magyar nyelvtani magyarázat, emlékeztető, kulturális párhuzam, a p06 megjegyzése | magyarul, a francia idézetek „…” jelöléssel (D3) | a brief „marad magyar” köre |
| Feedback (i01–i08) | magyarul, a szöveg változatlan; csak az idézőjel lesz « » helyett „…” (D3) | a magyarázó rész magyar |
| Modellszövegek (A, B, C) | a szöveg változatlan, csak tipográfia | nem érte kifogás |
| Idővonal, szereplők, helyszín | változatlanok | az itemek erre épülnek |
| Terjedelem, időkeret (34–45 perc) | változatlanok | brief |

## 3. Mi változik és miért

### 3.1 Helyzet

Új helyzet nincs. A meglévő keret (Lyon, Croix-Rousse, *Le Pain Perché*, vasárnapi brunch) a francia pékségi rítust, az előző esti foglalást, az *ardoise*-t és a piacot mutatja be. Az itemek erre épülnek. Csak a p01 magyar helyzetleírása lesz francia.

**A p01 francia helyzetleírásának vázlata** (tegező, D1):
1. Ki vagy és hol: Lyonban, a Croix-Rousse-on laksz Camille-lal, a lakótársaddal.
2. A tét: vasárnap 11-re brunchra jön Léo.
3. Az ív: szombat este pékséget választasz és foglalsz; vasárnap reggel sorba állsz, rendelsz a pultnál, közben üzensz Léónak.
4. Egy mondat, amely rögzíti, hogy a *nous* = te és Camille (erre épül az i05-4 és az i06).

**Tilos:** új tény, név, időpont, termék vagy példamondat, és itemkulcs sem szivároghat ki (3.5).

**A p01 többi része:**
- az „A determinánsokat… már ismered” bekezdés tanári hangon, *vous*-ban lesz francia;
- a négy célpont infinitivuszos francia alakja marad;
- a *Petit repère* tegezése semleges szerkezetre vált (*on*).

### 3.2 Elemenként

| Hely | Most | Lesz | Szerző | Megjegyzés |
|---|---|---|---|---|
| Blokk- és oldalcímek | franciák, a p01 címe tegező | a p01 címe tegezés nélküli, rövid; a többi marad | blokkíró | csak cím |
| p01 text#0 | magyar helyzet | francia helyzet (3.1) és francia, *vous*-os tájékoztató | blokkíró | CL-27 HIBA |
| Oldalutasítások p01–p09 | francia, *tu* | francia, *vous* | blokkíró | a tartalom azonos |
| Itemutasítások i01–i08 | francia, *tu* | francia, *vous*, a mérési elemek szó szerinti megtartásával (5. rész) | blokkíró | i06: a *Ton brouillon* helyett semleges alany |
| i07 utasítás + s006 stimulus (N-03) | a *Transforme avec en.* a stimulusban áll | a 6. mondat művelete az i07 utasításába kerül (*vous*, ugyanaz a műveletnév, mint az i05-ben); a stimulus a *Tu réponds : …* mondattal zárul | blokkíró | D1, 2. szabály; a kulcs és a feedback nem változik |
| i08 utasítás (N-04) | *Dis à Léo ce que vous avez déjà…* | *vous*-os utasítás, de a „mi van már meg” rész kétértelmű *vous* nélkül (D1, 3. szabály) | blokkíró | — |
| i08 stimulus vége | *Réponds-lui.* | a helyzet Léo üzenetével zárul, a *vous*-os válaszkérés az utasításba kerül | blokkíró | D1 |
| i01 válaszmód | rejtett szerzői adat | a tanuló lássa, hogy franciául vagy magyarul is válaszolhat | blokkíró | a megoldás eddig is mindkettőt elfogadta |
| Helyzetjelzők és stimulusok | francia, *tu* | változatlanok, csak tipográfia (’); kivétel: a 2. rész (a)–(c) pontja | – | D1 |
| Kontraszt- és ellenpélda-listák címe (p02–p06) | „Kontraszt”, „Ellenpéldák” | francia belső cím (pl. *À comparer*, *Contre-exemples*) | blokkíró | csak cím |
| Kontraszt- és ellenpélda-sorok, 14 sor (p02 ×3, p03 ×2, p04 ×2, p05 ×3, p06 ×4) | francia mondat + magyar ítélet | francia mondat + francia címke; a magyar indoklás külön `note`, „…” idézéssel (D2, D3) | blokkíró; leképezés: CEO | a címke a mostani ítéletet adja vissza; a p04 2. sora az E-03 és a 0.3 kapu miatt pontosan ugyanazt állítsa |
| Belső szakaszcímek a tanulói nézetben („Az üzenetváltás”, „Természetes példák”, „Példák”, „A pultnál”, „Magyar emlékeztető”, „Kulturális háttér”, „Magyar előkészítés” stb.) | magyar | francia cím (pl. *Exemples*, *Rappel*, *Au comptoir*, *Repère culturel*); a magyar törzs marad | blokkíró | szerkezettípus szerint a teljes kéziratban; a szkript a kör végén ellenőrzi |
| Magyar lesson és note (p02–p09) | a francia elemek dőlttel jelölve | francia elemek „…” között (D3) | blokkíró | csak tipográfia |
| p09 brief (4 sor) | magyar | francia: *Destinataire*, *Registre*, *Objectif*, *Longueur*; a tartalom 1:1 | blokkíró | regiszter: lásd NOTE-1 alább |
| p09 tartalmi lista (cím + 6 sor) | magyar | francia, *vous*-os tanári hangon; a 6 elem sorrendje és tartalma 1:1; az 1. elem kétértelmű *vous* nélkül (N-04) | blokkíró | a 2. elem példái (sajt, gyümölcslé) francia alakban |
| p09 nyelvi lista (cím + 6 sor) | magyar, semleges mikropéldákkal | francia; magyar terminuszárójel, ahol a p02–p06 magyar terminust tanított (*verbe conjugué (ragozott ige)*, *auxiliaire (segédige)*, *adjectif placé avant le nom (elöl álló melléknév)*, *une certaine quantité (valamennyi)*); a francia alakok « » között; új mikropéldák a D4 feltételeivel | blokkíró | 1:1 az `allCriteria` hat elemével |
| p09b modellcímek (A, B) | magyar | francia címke a jelleg megtartásával (lelkes ajánlás / óvatos „oui, mais…”) | blokkíró | — |
| i08 rubrika (megoldás) | magyar | francia: a 4 terület, a pontok, a 4 szint (pl. *non atteint / partiel / atteint / excellent*), az elégtelen esetek listája; a B terület 1. eleme kétértelmű *vous* nélkül (N-04) | megoldásíró | a küszöbök és a tartalom 1:1; magyar zárójel csak terminusnál |
| Feedback és `incorrect` szövegek (i01–i08) | magyar, « » idézéssel | magyar, „…” idézéssel (D3); a szöveg, a kiváltó és a kulcs változatlan | megoldásíró | változástípus: csak tipográfia |
| Az i08 R1, R2 és C mintája | francia szöveg, magyar kommentár | a minta marad, a kommentár szerzői adat | – | — |
| Tipográfia mindenütt | sok egyenes ' | ’, NBSP a ; : ! ? előtt és a « » belsejében | blokkíró, megoldásíró; ellenőrzés: HE | a kulcsegyezést nem érinti |
| Nevek | – | nincs csere | – | a T08 itt üres |

**NOTE-1 döntése:** a regiszter *familier* helyett *courant / informel, sans argot*, tegeződéssel, SMS-hangon. Ez jobban megfelel az eredeti „informális, de nem szleng” leírásnak és a rubrika C területének. A végső szóválasztást a NyE erősíti meg.

### 3.3 Szintemelés

Új szerkezet nem kerül be. A meglévő szintemelő elemek maradnak, nem mért elemként: *même si* (i03, p04), *tandis que* (p05), *ne pas payer de mine*, *ne jurer que par*, *à tomber*.

A francia utasításokba és listákba nem kerülhet B2 fölötti vagy újonnan mért szerkezet. Az utasítás legyen rövid és egyértelmű: a nehézség a feladatból jöjjön, ne az utasításból.

### 3.4 Az itemek igazítása

Egyik item sem kérdez mást, mint eddig.

| Item | Mit kérdez (változatlan) | Mi változik rajta |
|---|---|---|
| i01 | a két *du* értéke | *vous*-os utasítás; a válasz nyelve látható |
| i02 | *revenir du café* | *vous*-os utasítás |
| i03 | *d’excellents* / *des petits pains* | *vous*-os utasítás, a *de, d’, des* készlet szó szerint |
| i04 | *beaucoup de* / *beaucoup des* | *vous*-os utasítás, a két alak szó szerint |
| i05 | négy *en*-helyzet | *vous*-os utasítás; a stimulusok tegezők maradnak |
| i06 | két hibajavítás | *vous*-os utasítás, semleges alany; a „seulement l’erreur” és a „tous les autres mots” elem megmarad |
| i07 | 5 kitöltés + 1 transzformáció | *vous*-os utasítás, az öt alak szó szerint; a 6. mondat művelete átkerül a stimulusból az utasításba (N-03) |
| i08 | integrált írás | francia brief, listák és rubrika; *vous*-os utasítás kétértelmű *vous* nélkül (N-04) |

## 4. Kifogásonként

| # | Kifogás (hely) | Kezelés |
|---|---|---|
| T07, T27 | túl sok magyar a felületen | 3.2 tábla; magyar csak a brief „marad magyar” körében marad |
| T08 | magyar nevek | az U21-ben nincs magyar név, nincs teendő |
| 1 | p01 text#0, magyar helyzet (HIBA) | francia helyzet (3.1) és francia tájékoztató |
| 2 | p02 list#4 címe | francia belső cím |
| 3 | p02 *Je bois de café.* | ✗ címke, magyar indoklás `note`-ban (D2, D3) |
| 4 | p02 *On parle de café.* | ✓ + *autre sens* címke, `note` |
| 5 | p02 *On parle du café.* | francia címke, `note` |
| 6 | p03 list#2 címe | francia belső cím |
| 7 | p03 *Je voudrais du jus d’orange.* | *partitif* címke, `note` |
| 7a (nem jelzett, N-02) | p03 *Je n’aime pas le goût du jus d’orange en bouteille.* | *de + le* címke, a magyar jelentés `note`-ban |
| 8 | p04 list#4 címe | francia belső cím |
| 9 | p04 *Ils font des belles tartes.* | regisztercímke (*à l’oral ; à l’écrit soigné : …*), `note` |
| 10 | p04 *Ils vendent de petits pains.* | francia címke, `note`; a tartalom azonos az E-03-mal (0.3 kapu) |
| 11 | p05 list#3 címe | francia belső cím |
| 12–14 | p05, három sor | ✗ címke, illetve francia címke; a magyar jelentés `note`-ban |
| 15 | p06 list#4 címe | francia belső cím |
| 16–19 | p06, négy ellenpélda | ✗ címke, a magyar szabály `note`-ban |
| 20–23 | p09 brief: címzett, regiszter, cél, terjedelem | *Destinataire*, *Registre* (NOTE-1), *Objectif*, *Longueur*; a tartalom 1:1 |
| 24 | p09 list#2 címe | francia belső cím |
| 25–30 | p09 list#2, 1–6. elem | franciául, sorrend és tartalom 1:1; az 1. elem kétértelmű *vous* nélkül (N-04) |
| 31 | p09 list#3 címe | francia belső cím |
| 32–37 | p09 list#3, 1–6. kérdés | franciául, magyar terminuszárójellel, « » idézéssel, új mikropéldákkal (D4); 1:1 az `allCriteria`-val és a rubrika A területével |
| 38–39 | p09b model#0 és #1 címe | francia modellcímek |
| (CL-27 gépi) | egyenes aposztróf, azonos bejegyzésű lista, munkacím | ’ mindenütt; azonos listaelem és munkacím nincs; a szkript újraellenőrzi |
| (nem jelzett) | belső szakaszcímek, dőlt jelölés a magyar szövegben, « » a magyar feedbackben, az s006 beágyazott utasítása | 3.2 (D2–D3, N-03) |

## 5. Kockázatok és elkerülésük [JAVÍTVA: N-01, N-04, N-05]

1. **A fordítás elmossa a mérési feltételt.**
   - Az i06-ban az E-02 mindkét eleme maradjon kimondva franciául.
   - Az i03, i04 és i07 alakkészlete alakra egyezzen a megoldás F01 és `incorrect` szövegével; az idézőjel fajtája nem számít (D3).
   - Az s006 művelete az i07 utasításában ugyanazt kérje, mint eddig a *Transforme avec en*: a szerkezetet megtartó transzformációt, teljes mondatban.
   - **Recheck:** NavE.
2. **Kétértelmű *vous*.**
   - A *vous*-os utasítás nem kerülhet tegező helyzetmondatba.
   - Ahol a tanuló és Camille együtt szerepel, ott nem állhat puszta *vous*. Érintett helyek: az i05-4 (stimulus, marad), a p05 helyzetjelzője (marad), **az i08 utasítása, a p09 tartalmi listájának 1. eleme és a rubrika B területe** (D1, 3. szabály).
   - **Recheck:** UE.
3. **A francia ellenőrzőlista nehezebb, mint a mért szerkezet.**
   - Terminuszárójel a magyar magyarázat szavaival; rövid sorok, példával.
   - Az UE kulcs nélkül, csak a francia lista alapján próbálja meg az önellenőrzést.
4. **A rubrika fordítása elcsúsztatja a pontozást.** Csak a nyelv cserélődik; a küszöb, a kritériumszám és a szintsorrend nem. **Recheck:** NavE, tételes 1:1 összevetéssel.
5. **A kontrasztcímke mást állít, mint a magyar indoklás.** Különösen kényes a p04 2. sora (regiszter és lexikalizáció, a 0.3 kaputól függ). **Recheck:** PE, csak erre a 14 sorra.
6. **A CL-27 a bontás után is figyelmeztet**, ha a magyar `note` a JSON-ban az „example” elemben marad. CEO-leképezési pont (D2).
7. **A p01 francia helyzete kulcsot szivárogtat vagy új tényt hoz.** Tilos benne új termék, időpont és példamondat. **Recheck:** NavE.
8. **A feltételes 0.3 kapu.** Ha a NyE a *de petits pains* mellett dönt, a p04 francia címkéje is az E-09 helyei közé kerül.
9. **Az idézőjelcsere hibát visz a feedbackbe.** A megoldásíró csak a « » → „…” cserét végzi, a szöveget nem írja át. Ha egy feedback magyar mondata francia idézetet tartalmaz, és abban « » áll, a belső francia jelölés marad, a külső jelölés lesz „…”.
   - **Recheck:** HE minden magyar szövegre; NavE mintavétellel (a szöveg és a kiváltó változatlan-e).
10. **Az új mikropéldák kulcsot szivárogtatnak vagy mesterkéltek.** A D4 öt feltétele kötelező: más téma, más főnév, más ige, más szám, azonos szerkezet.
    - **Recheck:** PE (3.5), NyE (természetesség).
11. **Glosszák:** az új francia keretszövegekhez (p01, p09 brief és listák, rubrika) F készít glosszát, a végleges szöveg után.

## A szerzők bemeneti követelményei

- **Blokkíró (kézirat, csak a változás, `BLOKK_JAVITAS`):**
  - a 3.2 tábla összes „blokkíró” sora a D1–D4 szerint, ezen belül:
    - az s006 utasításának áthelyezése;
    - az i08 utasítása és a p09 1. listaeleme kétértelmű *vous* nélkül;
    - a 14 kontrasztsor bontása;
    - az összes belső szakaszcím;
    - a magyar lesson és note „…” idézéssel;
    - a D4 mikropéldái.
  - **A változásnaplóban tételesen:**
    - mi lett francia (cím, utasítás, helyzet, egyéb);
    - névcsere nincs;
    - mi maradt szándékosan magyar és miért: nyelvtani magyarázat, note, kulturális párhuzam, és a feedback magyar utasító része, pl. „Próbáld újra”, „Válassz a … közül” (NOTE-4: ez a megbízáson belüli döntés, mert a brief a feedbacket a magyar körbe sorolja).
- **Megoldásíró:**
  - az i08 rubrikája franciául, a B terület 1. eleme kétértelmű *vous* nélkül;
  - az összes magyar feedback és `incorrect` szöveg idézése „…”-re (D3), változástípus: csak tipográfia;
  - az 1. rész „Jelölés a feedbackben” szabályának átírása a D3 szerint;
  - kulcs, alternatíva, kiváltó és feedbackszöveg nem változik.
- **CEO (szkript):**
  - a D2 leképezése (`example` + `note`);
  - a CL-27 újrafuttatása;
  - a p09b `visibleAfter` (a korábbi N-04 (a) ügye, változatlan).
- **Ellenőrzés:**
  - **NavE:** a 39 jelzés és a nem jelzett tételek lefedése; az ID- és kulcsváltozatlanság; a rubrika és a lista 1:1 egyezése; az s006 művelet egyezése.
  - **NyE és HE:** minden új francia szöveg, a regiszterszó (NOTE-1), a „…” / « » jelölés.
  - **PE:** a 14 kontrasztcímke és a D4 mikropéldái.
  - **UE:** végigjárás csak a francia utasításokkal; különösen a p01 *tu*/*vous* váltása (NOTE-3), az i08 és az s006.

---

## Dispositionök

| Finding | Disposition | Indok és hely |
|---|---|---|
| N-01 (MAJOR) | FIXED | Új D3: a magyar szövegben (lesson, note, a D2 `note` elemei, feedback, `incorrect`) „…”, a francia szövegben « ». Felvéve a blokkíró és a megoldásíró követelményei közé, „csak tipográfia” változástípussal. A dőlt jelölés megszűnik, ezzel a p06 *en* félreolvasása is. Új kockázat: 5.9. |
| N-02 (MINOR) | FIXED | A D2 szerkezettípusra szól; a p03 2. sora felvéve (4. rész, 7a). A PE-recheck 14 sorra szól. |
| N-03 (MINOR) | FIXED | D1, 2. szabály: a helyzetet záró utasítás minden helyen kiköltözik. Az s006 műveleti utasítása az i07 utasításába kerül, a stimulus a *Tu réponds : …* mondattal zárul. A 2. rész kivételei közé felvéve. |
| N-04 (MINOR) | FIXED | D1, 3. szabály: ahol a tanuló és Camille együtt szerepel, nincs puszta *vous*. Érintett: az i08 utasítása, a p09 tartalmi listájának 1. eleme és a rubrika B területe; felvéve az 5.2 kockázatba. |
| N-05 (MINOR) | FIXED | D4: a mikropéldák lecserélődnek francia életből vett, témán kívüli példákra, öt kötelező feltétellel (téma, főnév, ige, szám, szerkezet), hogy a kimásolhatóság ne nőjön. |
| NOTE-1 | FIXED (NyE erősíti meg) | *courant / informel, sans argot* a *familier* helyett. |
| NOTE-2 | FIXED | A 2. rész stimulus-sora kivételjelölést kapott: (a) i06, (b) i08, (c) s006. |
| NOTE-3 | elfogadva, nincs változás | A D1-ből következik; az UE-recheck kifejezett pontja. |
| NOTE-4 | FIXED | A feedback magyar utasító része szándékosan magyar marad; a blokkíró és a megoldásíró változásnaplójában jelölendő. |

## Változáslista (az 1. változathoz képest)

- **D1:** új 2. szabály, amely kiterjed az s006-ra (N-03), és új 3. szabály a kétértelmű *vous* ellen (N-04).
- **D2:** a bontás szerkezettípus szerint a teljes kéziratra érvényes; 14 sor a 13 helyett (N-02).
- **Új D3:** idézési szabály, „…” a magyar szövegben, « » a franciában (N-01).
- **Új D4:** a p09 mikropéldáinak cseréje feltételekkel (N-05).
- **2. rész:** kivételjelölés a stimulus-sorban (NOTE-2); a feedback idézőjel-változása.
- **3.2:** új sorok:
  - i07/s006;
  - i08 utasítás;
  - magyar lesson/note idézés;
  - feedback idézés;
  - bővített belső szakaszcímek;
  - regiszterdöntés (NOTE-1).
- **3.4:** i07 és i08 kiegészítve.
- **4. rész:** új 7a sor és egy sor a nem jelzett tételekről.
- **5. rész:** a 2. kockázat bővült, új a 9. és a 10. kockázat.
- **A szerzők követelményei:** bővítve (megoldásíró: idézés és az 1. rész szabálya; NOTE-4 a változásnaplóban).
- **Nem változott:** cél, ID, kulcs, itemtartalom, terjedelem, hang, és a terv 1., 3.1 és 3.3 része.

## Findingok (saját)

| ID | Súly | Hely | Leírás | Recheck |
|---|---|---|---|---|
| GR-T27-01 | NOTE | i01 | A válasz nyelve bekerül a tanulói nézetbe. | NavE, UE |
| GR-T27-02 | NOTE | p02–p06 | A D2 bontás leképezési feladat. | CEO |
| GR-T27-03 | NOTE | egész egység | A FICHE-01 szintkifogása ebben a körben nem kezelhető; a későbbi tervezés tudja. | CEO |
| GR-T27-04 | NOTE | megoldás 1. rész | A D3 felülírja a megoldás saját jelölési szabályát; a többi T27-es egység megoldásában is ellenőrizni kell. | CEO, HE |

**Hiányok:**
- a 0.3 kapu nyitott, ezt a kört nem blokkolja;
- a HE-05 teljes szövegét és a záróteszt utasításstílusát nem láttam (NEM VIZSGÁLT). A D3 a brief idézett szabályára épül.

**Döntési kérdés:** nincs. A D1–D4 a megbízáson belül született, jelölve.

**Bizonyíték:**
- **Új:** a kézirat összes listájának szerkezettípus szerinti átnézése, ebből jött a D2 kiterjesztése és a belső címek bővítése; a stimulusok utasítászáró mondatainak átnézése (csak az i08 és az s006 ilyen); a *vous* előfordulásainak átnézése az utasítás-, lista- és rubrikaszövegekben.
- **Újrahasznosított:** a NavE jelentésének 39/39-es egyeztetése; a PE és a NavE korábbi PASS-ai a változatlan itemekre.
- **Webes forrás:** NEM VIZSGÁLT, nem volt szükséges.

**Következő címzett:** CEO.

**Tanulság:** ha egy szabály egy konkrét helyen jelenik meg (pl. „a helyzetet záró utasítás kiköltözik” az i08-ban), azt szerkezettípusként kell kimondani, és a teljes kéziratra le kell futtatni. Különben az azonos szerkezetű helyek kimaradnak (s006). Javasolt hatókör: minden T27-es terv.

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE