# NyE-jelentés: U21 (w01-u-2-1), Megoldás, 6. változat (T27 nyelvi kör)

**Szerep és megbízás:** nyelvhelyességi ellenőr (NyE), független ellenőrzés. A francia nyelvhelyességet, a jelentést, a kollokációkat és a regisztert vizsgáltam a szövegben és az itemekben, valamint azt, hogy teljes-e az elfogadott alternatívák köre.

**Bemeneti változat:** a megoldás 6. változata, benne a tanulói nézet és a BLOKK_JSON tanulói szövegei, bájtra a JSON-ból. Összevetési alapként a T27 kéziratot és az élesben futó 5. változatot használtam.

**Hatókör és lefedés:**
- **Az új francia szövegek:**
  - p01: *Le décor* és *Vos objectifs*;
  - az oldal- és itemutasítások: p01–p09, i01–i08, i07 s001–s006;
  - a D2 francia címkéi: p02 ×3, p03 ×2, p04 ×2, p05 ×3, p06 ×4;
  - p09: *Consigne*, *Contenu du message*, *Avant d'envoyer, vérifiez*, a D4 mikropéldái;
  - i08: a francia rubrika (A–D, *Niveaux*, *Insuffisant*);
  - a modellcímek.
- **A magyar szövegek:**
  - a magyar `note` elemek;
  - minden feedback és `incorrect` szöveg, ezeknél a „…”-es idézéssel együtt járó toldalékolás (pl. „de”-t, „en”-nel, „chouquettes”-et, „croissants”-t), és az, hogy a jelentés hű maradt-e;
  - az i01 új elutasított mintái.
- **Elfogadott alternatívák:** i03, i04, i05-s001…s004, i06, i07-s001…s006, a francia rubrika szerint is.
- **Nem vizsgáltam (NEM VIZSGÁLT), mert nem az én hatásköröm:** tipográfia és NBSP (HE), a rubrika és a lista egyezése 1:1-ben (NavE), a változatlan stimulusok és modellszövegek (korábbi PASS, a szövegük nem változott).

**Források:** webes forrást nem nyitottam meg. Az alábbi nyelvi állítások a francia nyelvi szintek bevett felosztására (*soutenu / courant / familier*) és a saját nyelvi ítéletemre épülnek. A NyE-04 korpuszgyakorisági állítását nem ellenőriztem, ezért ott ítéletként jelölöm, nem igazolt tényként.

---

## A tanuló szemével (kulcs nélkül)

Minden itemet megoldottam a tanulói nézetből. A kulcsok egyeznek az én megoldásommal. Az új utasítások egyik itemnél sem engednek meg második helyes választ, és nem változtatják meg a műveletet. Az s006 utasítása (*remplacez le complément de quantité par « en » et écrivez la phrase complète*) ugyanazt a műveletet kéri, mint eddig. Az *…en prendre trois parts* (N01) és a kulcs is lefedi.

## Findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-01 | MAJOR (feltételes) | 1. rész „Teljes mondatos mező” ↔ JSON `alternatives`: i05-s002, i05-s003, valamint az N-sorok kombinációi | Az 1. rész általános szabálya szerint elfogadott bevezető (*Oui, / Non, / Non merci, …*) és záró elem (*, merci / , s'il vous plaît*). A JSON viszont tételesen sorolja fel a változatokat, és több természetes, helyes kombináció hiányzik belőlük. A tanuló a helyes mondatra a semleges `incorrect` szöveget kapja („nem egyezik a várt átalakítással”). Ez félrevezeti. | A s001-ben a kombináció fel van véve (*Oui, j'en prends, merci.*). Hiányzik viszont: **s003:** *Non, je n'en veux pas, merci.* · *Non merci, je n'en veux pas, merci* nem kell, de a *Je n'en prends pas, merci.* (N05) igen; **s002:** *Oui, je vais en prendre deux, s'il vous plaît.* · *Oui, je vais vous en prendre deux.* · *Je vais en prendre deux, merci.* | A szabályt mezőnként, kombinációként kell kibontani az `alternatives` listába: a bevezető × a kulcs vagy elfogadott mag × a záró elem. Ha a CEO-szkript igazolja, hogy a motor maga képezi a kombinációkat, a finding NOTE-ra csökken. Recheck: NavE a lista teljességére, a CEO a motor viselkedésére. |
| NyE-02 | MINOR | p09 *Consigne* (*Registre*); rubrika C | A *courant et informel* két rendszert kever. A francia szintfelosztásban (*soutenu / courant / familier*) a *courant* a semleges szint, így ellentmond az *informel*-nek. A modellek (*tu es un amour*, *à tomber*, *tu vas craquer*) és a stimulus (*t'inquiète*, *Top !*) szándékoltan baráti, familiáris hangot mutatnak. A tanuló a *courant*-ból semlegesebb hangra következtethet. | A NOTE-1 a NyE megerősítését kérte. A *familier* nem azonos az *argot*-val, a kettő külön szint, illetve külön kategória. | A brief eredeti magyar szándékát („informális, de nem szleng”) visszaadó két változat közül az egyiket javaslom. **Registre : familier, sans argot (SMS entre amis, tutoiement).** Ha a GR kerülni akarja a *familier*-t: **Registre : informel et amical, sans argot (SMS, tutoiement).** A rubrika C területén ugyanaz a szó álljon. |
| NyE-03 | MINOR | rubrika, *Niveaux*, 1. mondat | A *le premier niveau atteint décide* szójáték-ütközést okoz: az *atteint* itt azt jelenti, hogy „teljesülő”, de egyben az egyik szint neve is (*Atteint*, *Non atteint*). Így úgy is olvasható, hogy a sorrendben először álló *Non atteint* „nem atteint”, vagy hogy az *Atteint* szint dönt. | A szöveg belső ellentmondása. | **Les niveaux s'examinent dans l'ordre : on retient le premier dont les conditions sont remplies.** |
| NyE-04 | MINOR | p05 *À comparer*, 2–3. címke; p09 *Contenu*, 4–5. elem; *Avant d'envoyer*, 4. kérdés; rubrika A(4), B(4–5) | A *quantité ouverte* és a *groupe nommé* a magyar „nyitott mennyiség” és „megnevezett csoport” tükörfordítása. A francia grammatikai szóhasználatban nem bevett (ítélet, korpuszon nem ellenőriztem). A francia tanulói szövegben a tanuló nem bevett terminust tanul meg francia metanyelvként. | A francia nyelvtanok szóhasználata *quantité indéterminée / non précisée* és *groupe déterminé / précis*. A *Contenu*, 2. elem maga is a *quantité non précisée* kifejezést használja, vagyis a szöveg ugyanarra két terminust alkalmaz. | *une quantité indéterminée (nyitott mennyiség)*; *une partie d'un groupe précis (megnevezett csoport)*. A címkékben pl. *✓ quantité indéterminée*, *✓ partie d'un groupe précis*. A magyar zárójel marad. Recheck: PE, hogy a terminus egyezik-e a p05 magyar magyarázatával. |

**Ami rendben van (megerősítem):**
- **Utasítások:** az összes *vous*-os utasítás nyelvtanilag helyes és természetes. Az egyeztetés a *Camille et vous avez* szerkezetben helyes.
- **p01, *Le décor*:** helyes. A *bruncher* élő, köznyelvi ige, regiszterben illik a szerepjáték keretéhez.
- **D2-címkék:** a 14 címke helyes, és ugyanazt állítja, mint a magyar `note`. A p02 3. sorában a *du* valóban csak *de + le* lehet, mert a *parler de* + partitív *du* alakja *de café*.
- **D4-mikropéldák:** mind helyesek és természetesek (*du rosé au bord du Rhône*, *de gros saucissons*, *beaucoup des voyageurs du TGV de 18 h*, *Paul en apporte*, *il en a déjà apporté*, *on va en emprunter cinq aux voisins*). Az *en* előzménye minden példában kimondott.
- **Francia rubrika:** a *du contracté*, az *antécédent exprimé* és a *non atteint / partiel / atteint / excellent* nyelvileg megfelelő (MO-T27-05). Ez alól kivétel a NyE-03.
- **Magyar feedback:** a „…”-re cserélt idézéssel minden toldalék helyes (pl. „de”-t, „en”-nel, „du pain de seigle”-t, „chouquettes”-et, „pains au chocolat”-t, „nous”-t). A szöveg jelentése nem változott. Az *elöl álló* írásmódja helyes.

## NOTE-ok (nem kötelező, illetve más ellenőrnek)

- **NOTE-a (NyE, stílus):**
  - p09 *Objectif*, *…où l'acheter et pourquoi là*: természetesebb a ***et pourquoi à cet endroit***.
  - p01, *…et, entre deux, tu échanges…*: helyes, de köznyelvi. Semlegesebb a ***et, en même temps,***.
  - *Contenu*, 2. elem: a *…avec la quantité, dont au moins un produit…* esetében a *dont* vonatkozása laza. Javaslat: ***…et en quelle quantité ; au moins un produit sans quantité précise (par exemple : fromage, jus de fruits)***.
- **NOTE-b (NyE, stílus):**
  - A rubrikában az *Insuffisant* lista címeként jobb a ***Ne suffit pas :***.
  - A D terület címe helyett jobb a ***Correction de la langue (hors structures ciblées)***, mert a *hors cibles* zsargon.
  - Az *Exigences* oszlop rendben van.
- **NOTE-c (HE):** a D4-példákban a kérdőjel után nagybetű kell, mert új mondat kezdődik: *« Des glaçons ? Paul en apporte »*, *« Des chaises pliantes ? On va en emprunter… »*. A mikropélda mondatkezdő kisbetűje is tisztázandó. Az i01 2. mintájában a magyar szövegen belül az *acheter* és az *à côté de le parc* nincs „…” közé téve (D3).
- **NOTE-d (NavE/UE):**
  - A rubrika A területének címkéjében a tanuló számára is látható az `allCriteria` token.
  - A TANULOI_NEZET p01-ből kimaradt a *Vos objectifs* rész, a JSON-ban viszont szerepel.
- **NOTE-e (0.3 kapu, nyitott):** a francia rubrika *Insuffisant* listáján a *« de petits pains » quand il s'agit du nom du produit* sor továbbra is a lexikalizációs forrástól függ. A p04 2. címkéje (*…à l'écrit soigné aussi, des petits pains*) ugyanezt állítja. Ebben a körben nem döntök róla: a kapu nyitott, a megbízás szerint nem blokkol.

## Összegzés

- **Verdikt:** REVISION_REQUIRED, a NyE-01 miatt. Ha a CEO-szkript igazolja, hogy a motor maga képezi a kombinációkat, a NyE-01 NOTE-ra csökken, és a hatókör REVIEW_PASS-ra módosítható.
- **Recheck hatóköre:**
  - NyE-01: az i05 alternatívalistái;
  - NyE-02 és NyE-04: a *Consigne*, a p05 címkéi, a p09 listái és a rubrika érintett sorai;
  - NyE-03: a rubrika *Niveaux* mondata.
- **Bizonyíték:**
  - **Új:** kulcs nélküli megoldás a tanulói nézetből; az összes új francia szöveg és a magyar toldalékolás soronkénti átnézése; az 1. rész szabályának összevetése a JSON `alternatives` listáival.
  - **Webes forrás:** nem nyitottam meg (NEM VIZSGÁLT).
- **Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 3
GEPI_OSSZEGZES_VEGE