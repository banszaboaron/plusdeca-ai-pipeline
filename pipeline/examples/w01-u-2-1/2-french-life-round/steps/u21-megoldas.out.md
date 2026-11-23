# U21 (w01-u-2-1, GI2): *Du, des, de : forme ou sens ?*, Megoldás, 6. változat (T27 nyelvi kör)

**Szerep és megbízás:** megoldásíró. Az U21 Megoldás fázisát javítom a T27 nyelvi kör szerint, a GR-terv 2. változata (D1–D4) alapján.

**Bemenet:**
- a befagyasztott új kézirat (T27 kör), PE és NavE után;
- az elfogadott GR-terv (2. változat, D1–D4);
- az élesben futó megoldás (5. változat) és a P5-blokk; ez a betűre átvett alap.

**Ebben a körben ez változik:**
- az i08 rubrikája franciául; a B terület 1. eleme a kétértelmű *vous* helyett kifejezett alanyt kap (*Camille et vous*);
- a magyar feedbackben és az `incorrect` szövegekben a francia idézetek « » helyett „…” közé kerülnek (D3); a francia alakokban ’ áll;
- az 1. rész „Jelölés a feedbackben” szabálya a D3 szerint új;
- a BLOKK_JSON és a tanulói nézet az új kézirathoz igazodik: francia, *vous*-os utasítások; francia helyzet; francia belső címek; a 14 kontrasztsor kettébontva; francia p09-lista és brief; a 3 deklarált stimulusváltozás.

**Nem változik:** a kulcsok, az alternatívák, az elutasított alakok, a kiváltók, a feedback-ID-k, a feedbackszövegek tartalma és a kategóriák.

**Hang:** az egységhez nincs felvétel. **Webes forrás:** nem nyitottam meg, mert nem volt rá szükség (NEM VIZSGÁLT).

---

## 0. Előbb a tanuló szemével (az új utasításokkal)

Minden itemet újra megoldottam kulcs nélkül, csak az új francia tanulói szövegből.

| Item | Eredmény az új utasítással | Következmény |
|---|---|---|
| i01 | Az *Expliquez… Vous pouvez répondre en français ou en hongrois* egyértelmű; a két mondat a jelenet nélkül is megoldható. | változatlan |
| i02 | *Choisissez la bonne réponse.* Egy helyes opció van (A). | változatlan |
| i03, i04 | A zárt készlet « » között, szó szerint áll az utasításban. Egy megoldás van. | változatlan |
| i05 | A *Remplacez le complément de quantité par « en »* ugyanazt a műveletet kéri, mint eddig. A 4. mező *vous avez ouvert* alakja a tegező helyzetmondatban egyértelműen a tanulót és Camille-t jelenti. | változatlan |
| i06 | A *Le brouillon* semleges. A *corrigez seulement l’erreur* és a *gardez tous les autres mots* szó szerint megmaradt, így az F01–F06 indoka továbbra is a látott utasításra épül. | változatlan |
| i07-s006 | A művelet most az i07 utasításában áll (*remplacez le complément de quantité par « en » et écrivez la phrase complète*). A stimulus a kiinduló mondattal zárul. A *J’en prends trois* kihagyja a *je vais* + infinitif szerkezetet, ez az utasításból kiolvasható. Az F01 („a kiinduló mondatban „je vais + infinitif” áll”) illeszkedik. | változatlan |
| i08 | Az utasítás (*ce que Camille et vous avez déjà acheté*) és a tartalmi lista 1. eleme egyértelmű. A D4-mikropéldák (apéro, TGV, szomszédok) nem adnak kimásolható mondatot a Léo-üzenethez. | változatlan; a rubrika francia |

**Opciók utáni újramegoldás:** nincs új opció vagy distractor; az i02 opciósora változatlan.

**Ellenőrzőlista (1–8):** végigvittem. Új hibát nem találtam, ezért visszautalt kéziratmódosítás sincs.

---

## 1. Általános elfogadási szabályok

### Normalizálás
- A kis- és nagybetű közömbös.
- Az egyenes (') és a tipográfiai (’) aposztróf egyenértékű.
- A szóközök száma közömbös; a nem törő (U+00A0) és a sima szóköz egyenértékű.
- A záró írásjel elhagyható.
- `numbersFr` ott, ahol a válaszban szám áll (i05, i06, s006): a szám betűvel és számjeggyel is írható.

### Hiánykitöltő mező (i03, i04, i07-s001–s005)
A helyes alakot a stimulusban közvetlenül utána álló szóval vagy szavakkal együtt is elfogadom.

### Teljes mondatos mező (i05, i07-s006)
Válasz csak akkor fogadható el, ha a **mért szerkezet ép**:

| Mező | Mért szerkezet |
|---|---|
| i05-1 | *en* + ragozott ige |
| i05-2 | *je vais* + *en* + infinitif + szám |
| i05-3 | *ne* + *en* + ragozott ige + *pas* |
| i05-4 | *en* + segédige + participe + szám |
| s006 | *je vais* + *en* + infinitif + szám |

- **Elfogadott bevezető:** *Oui,* · *Non,* · *Non merci,* · *Non, merci,* · *Volontiers,* · *Oui, volontiers,* · *Non, c’est bon,*
- **Elfogadott záró elem:** *, merci* · *, s’il vous plaît*
- A *vous* + *en* sorrend is elfogadott.

### Válaszkategóriák
1. **Kulcs.**
2. **Elfogadott alternatíva.**
3. **Helyes, de nem célzott.** Csak az i05-ben és az s006-ban, és csak ép mért szerkezettel. Csak ezek térhetnek el: az ige (K3), az alany (*nous* → *on*), egy kihelyezett elem vagy egy pontosító mennyiségi bővítmény. A válasz beleszámít a formatív teljesítésbe; célzott megjegyzés jelenik meg.
4. **Nem a kért alak vagy művelet:**
   - az i03, az i06 és az i07 s001–s005 minden válasza, amely a zárt alakkészleten vagy a szerkezetmegtartáson kívül esik;
   - az i05-ben és az s006-ban minden válasz, amely a mért szerkezetet elhagyja.

   Ezek a válaszok nem egyeznek. A feedback elismeri, hogy a mondat franciául helyes lehet, megnevezi a kért műveletet, és újrapróbálásra hív.

### Újrapróbálás (zárt itemek)
1. Nem egyező válasz után a célzott feedback jelenik meg. Ha nincs illeszkedő sor, a semleges `incorrect` szöveg. A mező újra szerkeszthető.
2. A második nem egyező válasz után a kulcs látszik, a helyes válaszra adott feedback mondatával és utalással a magyarázó oldalra.
3. Párok: i01 ↔ s001/s002; i02 ↔ s002; i03 ↔ s003/s004; i04 ↔ s005; i05 ↔ i06 ↔ s006. Az i07 után az i08 alkalmazza ugyanezeket a szabályokat.

### Feltételes szabály (0.3 kapu, továbbra is nyitott)
Ha a NyE által megnyitott OQLF-lap nem igazolja, hogy a *petits pains* összeforrt kifejezés, akkor egyszerre:
1. az i03 2. helyén és az s004-ben a *de* elfogadott alternatíva lesz;
2. az i08 rubrikájának *Insuffisant* listájáról lekerül a «  de petits pains » sor;
3. a p04 *À comparer* blokkjának 2. sora és a lexikalizált *des* mérése visszamegy a GR-hez és a kéziratszerzőhöz (ESCALATED). A cél nem szűkül.

Amíg a forrás nincs meg, a kulcsok maradnak. **Változás:** a feltétel csak itt áll; a tanulónak is látható rubrikasorból kikerült a szerzői megjegyzés.

### Jelölés (D3, új szabály, a régi „« » a magyar mondatban” helyett)
- **Magyar szövegben** (feedback, `incorrect`, magyar `keyDescription`, magyar lesson és note) az idézett francia alak „…” között áll. Ez a HE-05 szabály. A ragozott alakban a toldalék kötőjellel kapcsolódik: „en”-nel, „de”-t.
- **Francia szövegben** (rubrika, utasítás, lista, stimulus) az idézett vagy kiemelt alak « » között áll, belül nem törő szóközzel.
- Ha egy magyar mondatban idézett francia szakasz maga is tartalmaz francia idézetet, a belső « » marad, és csak a külső jelölés lesz „…”.
- **A francia alakokban ’ áll** (pl. „d’”). Ez csak tipográfia: a normalizálás miatt a kulcsegyezést nem érinti.
- **A nem törő szóköz** a BLOKK_JSON-ban `\u00a0` escape-pel áll minden francia szövegben a : ; ? ! előtt és a « » belsejében. Ebben a markdownban nem látszik; a hordozója a JSON.
- **Zárt alakkészletek:** a „betűre egyezés” (i03, i04, i07) az alakokra vonatkozik, az idézőjel fajtájára nem.

---

## w01-u-2-1-i01

**Kulcs (jelentés):**
- 1 = partitív „du” (az „acheter” tárgya, valamennyi rozskenyér);
- 2 = „de + le” („à côté de” + „le parc”).

**Elfogadott:**
- magyarul vagy franciául, bármilyen megfogalmazásban, ha mindkét mondathoz a helyes értéket rendeli;
- szakszó nem kötelező;
- az indoklás nem kötelező, de ha szerepel, ne legyen hibás.

**Értékelés:** szemantikus; a gépi javaslat csak tanácsadó. Beadás után a tanuló önellenőrzésként látja a két mintát.

**Minták:**
- `1 = partitif : une certaine quantité de pain ; 2 = de + le : à côté de + le parc.`
- `1 = partitív (valamennyi kenyér, az acheter tárgya) ; 2 = de + le (à côté de le parc → du)`

**Elutasított minták:**
- `1 = de + le ; 2 = de + le`: az 1. mondat nem összevont (E02).
- `1 = partitív ; 2 = partitív (valamennyi park)`: a 2. mondat nem partitív (E01).

| ID | Kiváltó | Feedback |
|---|---|---|
| U21-I01-OK | helyes | Pontosan: az 1. mondatban az „acheter” után valamennyi rozskenyér áll (partitív „du”); a 2. mondatban az „à côté de” után a „le parc” áll, így „de + le = du”. |
| U21-I01-E01 | a 2. mondat partitív | A 2. mondatban nem mennyiségről van szó: az „à côté de” után határozott hely áll („le parc de la Cerisaie”). Ez „de + le = du”. |
| U21-I01-E02 | az 1. mondat *de + le* | Az 1. mondatban az „acheter” közvetlenül kapja a tárgyát, előtte nincs „de”-t kívánó elem. A „du” itt valamennyi rozskenyeret jelent: partitív. |
| U21-I01-E03 | felcserélés | Fordítva: az 1. mondat partitív („acheter” + valamennyi kenyér), a 2. mondat összevont („à côté de” + „le parc”). |
| U21-I01-E04 | a 2. mondatnál csak „hely” áll | A jelentést jól látod. Írd mellé a szerkezetet is: mi áll a „du” előtt? („à côté de” + „le parc” → „du”) |

## w01-u-2-1-i02

**Végleges opciósor:** A. `du` · B. `de` · C. `de la` · D. `des`. **Kulcs:** A.

**Indoklás:** csak a *du* helyes: a *revenir de* után azonosított, hímnemű, egyes számú kávézó áll.

| Opció | Tévedési alap | Feedback |
|---|---|---|
| A | – | Igen: „revenir de” + „le café” (a hímnemű, azonosított kávézó) → „du”. |
| B | a névelő kihagyása | A „revenir de” után itt egy azonosított kávézó áll: „le café que tu m’as conseillé”. A „de + le” összevonódik: „du”. |
| C | rossz nem | A „café” hímnemű: „le café”. A „de la” nőnemű főnév elé kell. |
| D | *de + les* | Egy kávézóról van szó, egyes számban: „de + le = du”. A „des” = „de + les”, többes számhoz. |

## w01-u-2-1-i03

**Kulcs:** 1 = `d'` ; 2 = `des`.

**Elfogadott:**
- *d’excellents* · *d’excellents croissants* (1. mező);
- *des petits pains* (2. mező);
- a teljes mondat.

**Nem a kért alak (F01):** *ses*, *quelques*, a következő szóval együtt is. Más, a készleten kívüli alak a semleges `incorrect` szöveget kapja.

**Feltételes szabály:** az 1. rész szerint (a 2. mező *de* alakja).

| ID | Válasz | Feedback |
|---|---|---|
| U21-I03-OK | helyes | Jó: gondozott ajánlószövegben elöl álló melléknév előtt „d’” áll („d’excellents croissants”), a „petits pains” viszont termékfajta neve, ezért „des petits pains”. |
| U21-I03-E01 | *des* (1) | Beszédben gyakori, de ez gondozott ajánló rovat: elöl álló melléknév előtt itt „d’” kell („d’excellents”). |
| U21-I03-E02 | *de* (1) | Magánhangzó előtt a „de” elízióval áll: „d’excellents”. |
| U21-I03-E03 | *de* (2) | A „petits pains” itt a tábla egyik termékfajtájának a neve (Petits pains rovat). Az ilyen összeforrt kifejezések előtt a „des” marad: „des petits pains”. |
| U21-I03-E04 | *les* | Az ajánló a kínálatot mutatja be, nem korábban említett termékeket: itt nem határozott névelő kell. |
| U21-I03-E05 | felcserélés | Fordítva: az „excellents” valódi melléknév → „d’”; a „petits pains” egy termék neve → „des”. |
| U21-I03-E06 | *d’* (2) | A „petits” mássalhangzóval kezdődik, itt nincs elízió. A termék neve előtt „des” áll: „des petits pains”. |
| U21-I03-F01 | *ses* / *quelques* | Ez a mondat franciául helyes lehet, de az instrukció a „de”, „d’” és „des” közül kér egyet. Mi áll mennyiségjelző és birtokos nélkül a melléknév, illetve a „petits pains” előtt? |
| incorrect | egyéb | Ez nem a várt alak. Válassz a „de”, „d’” és „des” közül: mi áll gondozott ajánlószövegben az elöl álló melléknév, illetve a „petits pains” termék neve előtt? Nézd meg újra a szabályt és a táblát, és próbáld újra. |

## w01-u-2-1-i04

**Kulcs:** 1 = `beaucoup de` ; 2 = `beaucoup des`.

**Elfogadott:**
- *beaucoup de viennoiseries* (1. mező);
- *beaucoup des tartes* · *beaucoup des tartes de la vitrine* (2. mező);
- a teljes mondat.

| ID | Válasz | Feedback |
|---|---|---|
| U21-I04-OK | helyes | Igen: a „viennoiseries” nyitott mennyiség („beaucoup de”), a „tartes de la vitrine” egy megnevezett csoport, abból sok („beaucoup des”). |
| U21-I04-E01 | 1 = *beaucoup des* | Az első mondatban nincs megnevezett csoport, csak annyi, hogy sok viennoiserie maradt: „beaucoup de”. |
| U21-I04-E02 | 2 = *beaucoup de* | A „de la vitrine” megnevezi a csoportot: a kirakatban lévő torták közül sok. Egy megnevezett csoport részére élőszóban is „beaucoup des” (= „de + les”) a helyes. |
| U21-I04-E03 | felcserélés | Fordítva: a nyitott mennyiség „beaucoup de”, a megnevezett csoport („de la vitrine”) része „beaucoup des”. |
| U21-I04-E04 | 1 = *beaucoup d’* | A „viennoiseries” mássalhangzóval kezdődik: „beaucoup de viennoiseries”. |
| U21-I04-E05 | csak *de* / *des* | Jól választottál, de a helyre a teljes kifejezés kell: „beaucoup de” vagy „beaucoup des”. |
| incorrect | egyéb | Ez nem a várt alak. Mindkét helyre a „beaucoup de” vagy a „beaucoup des” kerül: nézd meg, hogy a mondat egy megnevezett csoportról beszél-e, és próbáld újra. |

## w01-u-2-1-i05 (`-s001`, négy mező; a JSON-ban s001–s004)

| Mező | Kulcs | Elfogadott | Helyes, de nem célzott (ép mért szerkezet) | Nem a kért művelet |
|---|---|---|---|---|
| 1 | *J’en prends.* | *Oui, j’en prends.* · *J’en prends, merci.* · *Oui, j’en prends, merci.* · *J’en prends, s’il vous plaît.* · *Volontiers, j’en prends.* · *Oui, volontiers, j’en prends.* | *J’en prends, du pain de seigle.* (N02) · *J’en prends un morceau.* · *Oui, j’en prends un morceau.* (N03) · *J’en veux bien.* · *Oui, j’en veux bien.* · *Volontiers, j’en veux bien.* (N05) | – |
| 2 | *Je vais en prendre deux.* | *Je vais vous en prendre deux.* · *Je vais en prendre deux, s’il vous plaît.* · *Je vais vous en prendre deux, s’il vous plaît.* · *Oui, je vais en prendre deux.* | – | *J’en prends deux.* · *J’en veux deux.* (F01) |
| 3 | *Je n’en veux pas.* | *Non, je n’en veux pas.* · *Non merci, je n’en veux pas.* · *Non, merci, je n’en veux pas.* · *Je n’en veux pas, merci.* · *Non, c’est bon, je n’en veux pas.* | *Je n’en veux pas, de sucre.* (N02) · *Je n’en prends pas.* · *Non, je n’en prends pas.* · *Non merci, je n’en prends pas.* (N05) | – |
| 4 | *Nous en avons acheté trois.* | *Nous vous en avons acheté trois.* · *Nous en avions acheté trois.* | *On en a acheté trois.* · *On vous en a acheté trois.* · *On en avait acheté trois.* (N01) · *Nous en avons acheté trois parts.* · *On en a acheté trois parts.* (N04) · *Nous en avons pris trois.* · *On en a pris trois.* · *Nous vous en avons pris trois.* (N05) | – |

| ID | Mező | Kiváltó | Feedback |
|---|---|---|---|
| U21-I05-E01 | 1 | *Je prends en.* | Ragozott ige mellett az „en” az ige elé kerül: „j’en prends”. |
| U21-I05-E02 | 1 | *Je en prends.* | Magánhangzó előtt „je” → „j’”: „j’en prends”. |
| U21-I05-E03 | 1 | *J’en prends du pain de seigle.* | Az „en” már helyettesíti a „du pain de seigle”-t; ne ismételd meg. |
| U21-I05-E04 | 1 | *Je le prends.* | A „le” egy meghatározott dologra utal. Itt valamennyi rozskenyérről van szó („du…”), ezt az „en” veszi át. |
| U21-I05-E05 | 2 | *J’en vais prendre deux.* | Az „en” ahhoz az infinitifhez kerül, amelynek a tárgyát helyettesíti: „je vais en prendre deux”. |
| U21-I05-E06 | 2 | *Je vais prendre en deux.* | Az „en” nem a szám elé, hanem az infinitif elé kerül: „en prendre deux”. |
| U21-I05-E07 | 2 | *Je vais en prendre deux croissants.* | Az „en” már helyettesíti a „croissants”-t: a szám megmarad, a főnév nem: „en prendre deux”. |
| U21-I05-E08 | 2 | *Je vais en prendre.* | A szám megmarad: „je vais en prendre deux”. |
| U21-I05-E09 | 3 | *Je ne veux pas en.* / *Je ne veux en pas.* | Tagadásban az „en” közvetlenül a ragozott ige előtt áll, a „ne… pas” fogja közre: „je n’en veux pas”. |
| U21-I05-E10 | 3 | *Je n’en veux pas de sucre.* | Az „en” már helyettesíti a „de sucre”-t; ne ismételd meg. |
| U21-I05-E11 | 3 | *Je ne le veux pas.* | A „de sucre” mennyiséget jelöl, nem egy meghatározott dolgot: ezt az „en” veszi át. |
| U21-I05-E12 | 4 | *Nous avons en acheté trois.* | Passé composé-ban az „en” a segédige elé kerül: „nous en avons acheté trois”. |
| U21-I05-E13 | 4 | *Nous en avons acheté trois parts de flan.* | Az „en” már helyettesíti a „de flan”-t; ne ismételd meg: „nous en avons acheté trois”. |
| U21-I05-E14 | 4 | *Nous en avons achetées trois.* | Az „en” után a participe passé rendszerint nem egyezik: „acheté”. |
| U21-I05-E15 | 4 | *Nous en avons acheté.* | A szám megmarad: „trois”. Éppen ez a reklamáció lényege. |
| U21-I05-N01 | 4 | *on*-os változat | Helyes. A feladat a „nous”-t adta; az „on” itt is természetes. |
| U21-I05-N02 | 1, 3 | vesszős kihelyezés | Vesszővel ez helyes, beszélt nyelvi kihelyezés. A feladat a helyettesítést kéri, ezért a rövid alak a cél: „j’en prends” / „je n’en veux pas”. |
| U21-I05-N03 | 1 | *…un morceau* | Helyes mondat, de a kiinduló mondatban nincs mennyiség. A cél a puszta helyettesítés: „j’en prends”. |
| U21-I05-N04 | 4 | *…trois parts* | Helyes: itt az „en” a „de flan”-t veszi át, a „trois parts” a mennyiség. A rövidebb, gyakoribb forma: „nous en avons acheté trois”. |
| U21-I05-N05 | 1, 3, 4 | más igével (*vouloir bien*, *prendre*) | Helyes, természetes mondat, és az „en” jó helyen áll, de más igével írtad. Itt a kiinduló mondat igéjét tartsd meg, és csak a bővítményt cseréld „en”-re. |
| U21-I05-F01 | 2 | *J’en prends deux.* / *J’en veux deux.* | Ez helyes francia mondat, de nem a kért átalakítás: a kiinduló mondatban „je vais + infinitif” áll. Tartsd meg ezt a szerkezetet, és csak a bővítményt cseréld „en”-re. Hova kerül ilyenkor az „en”? Próbáld újra. |
| incorrect | bármely | egyéb | Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: „en”-nel helyettesítetted-e a mennyiségi bővítményt, jó helyen áll-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod. |

**Helyes válaszra:** Mind a négy helyes: az „en” a ragozott ige elé, az infinitif elé, a „ne… pas” közé, illetve a segédige elé került, és a szám megmaradt.

**Újrapróbálás:** csak a hibás mező nyílik újra, utalással a p06 megfelelő szabályára (1–4).

## w01-u-2-1-i06

**Kulcs:** 1 = *Je vais en prendre deux.* ; 2 = *Nous ne voulons pas en acheter.*

**Elfogadott:** *Je vais vous en prendre deux.* (számjeggyel is), saját feedbackkel (A01).

**Nem a kért művelet (F01–F06):** ezek az átfogalmazások franciául helyesek, de az utasítás kimondja: *corrigez seulement l’erreur* és *gardez tous les autres mots*.

| ID | Kiváltó | Feedback |
|---|---|---|
| U21-I06-A01 | *Je vais vous en prendre deux.* | Elfogadva: a „vous” a pultnál és foglaláskor természetes, és az „en” jó helyen áll („vous en prendre”). Az instrukció csak a hiba javítását kérte, ezért a piszkozat szavaival a pontos javítás: „je vais en prendre deux”. |
| U21-I06-F01 | *Nous n’en voulons pas.* · *Nous n’allons pas en prendre.* · *Nous n’en prendrons pas.* · *Nous ne voulons pas en prendre.* · *On n’en veut pas.* | Ez helyes francia mondat, de az instrukció szerint csak a hibát javítod, a többi szót megtartod. Így a „vouloir + acheter” szerkezet megmarad: „nous ne voulons pas en acheter”. |
| U21-I06-F02 | *J’en prendrai deux.* · *J’en prends deux.* · *J’en veux deux.* | Helyes mondat, de a piszkozatban „je vais + infinitif” áll, és a többi szót meg kell tartanod: „je vais en prendre deux”. |
| U21-I06-F03 | *On ne veut pas en acheter.* | Helyes, de a piszkozat a „nous”-t használja, és a többi szót meg kell tartanod: „nous ne voulons pas en acheter”. |
| U21-I06-F04 | *Nous ne voulons pas acheter de chouquettes.* | Helyes mondat, de a piszkozatban az „en” helyettesíti a „chouquettes”-et. Csak a fölösleges „des”-t kell törölni: „nous ne voulons pas en acheter”. |
| U21-I06-F05 | *Nous ne voulons pas en acheter vingt.* | Helyes mondat, de így csak a húszas zacskót utasítod el, és új szót tettél bele. A piszkozat szerint egyáltalán nem kértek: „nous ne voulons pas en acheter”. |
| U21-I06-F06 | *Je vais en réserver deux.* · *Je vais vous en réserver deux.* | Helyes, foglalásnál természetes is. Az instrukció szerint azonban a többi szó marad, így a „prendre” ige is: „je vais en prendre deux”. |
| U21-I06-E01 | *J’en vais prendre deux.* | Az „en” az infinitif elé kerül, amelynek a tárgyát helyettesíti: „je vais en prendre deux”. |
| U21-I06-E02 | *Je vais en prendre deux pains au chocolat.* | Az „en” már helyettesíti a „pains au chocolat”-t: „je vais en prendre deux”. |
| U21-I06-E03 | *Je vais prendre deux.* | Szám mellett az „en” kötelező: „je vais en prendre deux”. |
| U21-I06-E04 | *Nous ne voulons pas en acheter des.* / *… en acheter des chouquettes.* | Az „en” már helyettesíti a „chouquettes”-et; a „des” fölösleges. |
| U21-I06-E05 | *Nous ne voulons pas en acheter de.* | Tagadásban sem kell utána determináns: az „en” már átvette a főnévi csoportot. |
| incorrect | egyéb | Ez nem egyezik a várt javítással. Ellenőrizd az „en” helyét, és hogy nem maradt-e meg mellette a főnév vagy a determináns. Az instrukció szerint csak a hibát javítod, a többi szót megtartod. |

**Helyes válaszra:** Pontosan: az „en” az infinitif elé került („en prendre”, „en acheter”), és mellette nem maradt meg a helyettesített főnévi csoport.

## w01-u-2-1-i07-s001 … s006

Az s001–s005 válaszkészlete: *du, de la, de, d’, des*, betűre ugyanaz, mint az i07 utasításában. A készleten kívüli alakra F01-es vagy semleges `incorrect` feedback jár.

### s001
- **Kulcs:** *du*
- **Elfogadott:** *du miel*
- **Nem a kért alak (F01):** *beaucoup de, un peu de, plein de, pas mal de, trop de*

| ID | Kiváltó | Feedback |
|---|---|---|
| OK | *du* | Igen: valamennyi mézet teszel rá → partitív „du”. |
| E01 | *de* | Állító mondatban, mennyiségszó nélkül a „de” nem elég: valamennyi méz → „du miel”. |
| E02 | *le* | Nem egy meghatározott mézről beszélsz, hanem arról, hogy valamennyit teszel rá: „du”. |
| E03 | *de la* | A „miel” hímnemű: „du miel”. |
| E04 | *un* | A méz anyagnév, nem darab: valamennyit teszel rá → „du”. |
| E05 | *des* | A „miel” egyes számú anyagnév: valamennyi méz → „du miel”. |
| F01 | mennyiségszó | Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: „du”, „de la”, „de”, „d’” vagy „des”. |
| incorrect | egyéb | Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll a „miel” előtt, ha valamennyit teszel rá? |

### s002
- **Kulcs:** *du*
- **Elfogadott:** *du métro*

| ID | Kiváltó | Feedback |
|---|---|---|
| OK | *du* | Igen: „la sortie de” + „le métro” → „du”. |
| E01 | *de* | Itt egy konkrét állomás kijáratáról van szó („le métro Croix-Rousse”): „la sortie de” + „le métro” → „du”. |
| E02 | *de la* | A „métro” hímnemű: „du métro”. |
| E03 | *des* | Egy állomásról van szó: „de + le = du”. |
| incorrect | egyéb | Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: „la sortie de” + „le métro” → ? |

### s003
- **Kulcs:** *d’*
- **Elfogadott:** *d’immenses* · *d’immenses tourtes*
- **Nem a kért alak (F01):** *nos, ces, quelques, plusieurs*, számnév

| ID | Kiváltó | Feedback |
|---|---|---|
| OK | *d’* | Igen: gondozott szövegben elöl álló, magánhangzós melléknév előtt „d’” áll: „d’immenses tourtes”. |
| E01 | *des* | Gondozott bemutatkozó szövegben elöl álló melléknév előtt „d’” áll: „d’immenses tourtes”. |
| E02 | *de* | Magánhangzó előtt elízió: „d’immenses”. |
| E03 | *les* | A szöveg a kínálatot mutatja be, nem ismert tourte-okra utal: „d’”. |
| E04 | *du* / *de la* | A „tourtes” többes számú: egyes számú „du” vagy „de la” nem állhat előtte. Elöl álló melléknév előtt: „d’”. |
| F01 | determináns vagy számnév | Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: „du”, „de la”, „de”, „d’” vagy „des”. |
| incorrect | egyéb | Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll gondozott szövegben az elöl álló, magánhangzós melléknév előtt? |

### s004
- **Kulcs:** *des*
- **Elfogadott:** *des petits pains*
- **Nem a kért alak (F01):** *nos, ces, quelques, plusieurs, beaucoup de*, számnév
- **Feltételes szabály:** a *de* elutasítása a 0.3 kaputól függ (1. rész).

| ID | Kiváltó | Feedback |
|---|---|---|
| OK | *des* | Igen: a „petits pains” termékfajta neve, ezért a táblára írt mondatban is „des” marad: „des petits pains aux noix”. |
| E01 | *de* | A „petits pains” itt a tábla egyik termékfajtájának a neve (Petits pains rovat). Az ilyen összeforrt kifejezések előtt a „des” marad: „des petits pains”. |
| E02 | *les* | Új termék bejelentése, nem ismert csoport: nem határozott névelő. |
| E03 | *du* / *de la* | A „petits pains” többes számú: „des”. |
| E04 | *d’* | A „petits” mássalhangzóval kezdődik, itt nincs elízió. A termék neve előtt „des” áll. |
| F01 | determináns, számnév vagy mennyiségszó | Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: „du”, „de la”, „de”, „d’” vagy „des”. |
| incorrect | egyéb | Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll a „petits pains” termék neve előtt? |

### s005
- **Kulcs:** *de*
- **Elfogadott:** *de variétés*

| ID | Kiváltó | Feedback |
|---|---|---|
| OK | *de* | Igen: nyitott mennyiség, megnevezett csoport nélkül → „beaucoup de”. |
| E01 | *des* | A „variétés de pain” nem egy megnevezett, határozott csoport: nyitott mennyiség → „beaucoup de”. |
| E02 | *d’* | A „variétés” mássalhangzóval kezdődik: „de”. |
| E03 | *du* / *de la* | A „beaucoup” után mennyiségjelzőként „de” áll, nem névelő: „beaucoup de variétés”. |
| incorrect | egyéb | Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll a „beaucoup” után, ha nincs megnevezett csoport? |

### s006
- **Kulcs:** *Je vais en prendre trois.*
- **Elfogadott:** *Je vais vous en prendre trois.* · *Je vais en prendre trois, s’il vous plaît.* · *Je vais vous en prendre trois, s’il vous plaît.*
- **Helyes, de nem célzott:** *Je vais en prendre trois parts.* · *Je vais vous en prendre trois parts.* (N01)
- **Nem a kért művelet:** *J’en prends trois.* · *J’en veux trois.* (F01)
- **Megjegyzés:** a művelet most az i07 utasításában áll (N-03). Az F01 és az `incorrect` szövege változatlanul illeszkedik.

| ID | Kiváltó | Feedback |
|---|---|---|
| OK | kulcs | Igen: az „en” az infinitif elé került, a szám megmaradt: „je vais en prendre trois”. |
| E01 | *J’en vais prendre trois.* | Az „en” az infinitif elé kerül: „je vais en prendre trois”. |
| E02 | *Je vais prendre en trois.* | Az „en” nem a szám elé, hanem az infinitif elé kerül. |
| E03 | *Je vais en prendre trois parts de flan.* | Az „en” már helyettesíti a „de flan”-t; ne ismételd meg: „je vais en prendre trois”. |
| E04 | *Je vais en prendre.* | A szám megmarad: „trois”. |
| N01 | *…trois parts* | Helyes: itt az „en” a „de flan”-t veszi át, a „trois parts” a mennyiség. A rövidebb, gyakoribb forma: „je vais en prendre trois”. |
| F01 | *J’en prends trois.* / *J’en veux trois.* | Ez helyes francia mondat, de nem a kért átalakítás: a kiinduló mondatban „je vais + infinitif” áll. Tartsd meg ezt a szerkezetet, és csak a bővítményt cseréld „en”-re. Hova kerül ilyenkor az „en”? Próbáld újra. |
| incorrect | egyéb | Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: az infinitif elé került-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod. |

## w01-u-2-1-i08 (`-s001`)

### Grille d’évaluation (tanulói, FR; változás: csak a nyelv, a küszöbök és a tartalom 1:1)

| Domaine | Points | Exigences |
|---|---|---|
| A. Critères de langue (`allCriteria`) | 6 | 1 point par critère si la forme est employée selon son sens, à sa place et sans erreur : (1) un « du » partitif et un « du » contracté (de + le) ; (2) « de / d’ » + adjectif placé avant le nom (elöl álló melléknév) + nom au pluriel ; (3) « des petits pains » ; (4) « beaucoup de » pour une quantité ouverte (nyitott mennyiség) et « beaucoup des » pour une partie d’un groupe nommé (megnevezett csoport) ; (5) « en » devant un verbe conjugué (ragozott ige) ou devant l’auxiliaire (segédige), avec un antécédent exprimé ; (6) « en » devant un infinitif, avec le nombre. |
| B. Contenu | 6 | Les six éléments du contenu : ce que Camille et vous avez déjà acheté ; ce que Léo doit apporter et en quelle quantité, avec au moins un produit en quantité non précisée ; où l’acheter (un lieu qu’on peut nommer avec « du ») ; une quantité ouverte ou une foule (« beaucoup de monde » suffit) ; une partie d’un groupe nommé ; pourquoi cet endroit. |
| C. Message et registre | 4 | Une vraie réponse cohérente à Léo ; tutoiement ; registre courant et informel, sans argot ; 6 à 8 phrases. Pas de contradiction avec le reste du message ni avec les événements du week-end : un produit que le message présente comme déjà acheté n’est pas redemandé sans raison. « Des petits pains » peut apparaître comme recommandation ou comme demande justifiée. |
| D. Précision de la langue hors cibles | 4 | Message compréhensible, peu d’erreurs hors cibles ; typographie française. |

### Niveaux
Les niveaux s’examinent dans l’ordre : le premier niveau atteint décide.
1. **Non atteint :** A ≤ 3, ou C = 0.
2. **Excellent :** A = 6, B ≥ 5, C ≥ 3, D ≥ 3.
3. **Atteint :** A = 6, B ≥ 4, C ≥ 2.
4. **Partiel :** tous les autres cas.

### Insuffisant
- la simple énumération des six structures ;
- « en » sans antécédent exprimé ;
- « beaucoup des » sans groupe nommé ;
- « de petits pains » quand il s’agit du nom du produit ;
- la forme obligatoire est là, mais dans une mauvaise fonction.

*(Szerzői adat: a 4. sor a 0.3 kaputól függ, lásd az 1. részt.)*

**Nyelvi döntések (jelölve, a NyE erősíti meg):**
- „nem teljesített / részleges / teljesített / kiváló” → *non atteint / partiel / atteint / excellent*;
- „kimondott előzmény” → *antécédent exprimé*;
- a B terület 1. eleme a tartalmi lista 1. elemével azonos, kifejezett alannyal (*Camille et vous*);
- a C terület ellentmondás-mondata személytelen, így nincs benne kétértelmű *vous* (D1, 3. szabály).

### Elfogadott minták
A kézirat A és B modellje, valamint a saját C minta (SAJÁT SZÖVEG):

> C: `Merci, tu es adorable ! Au Pain Perché, on a déjà pris une tradition et des cannelés : Camille en a pris quatre, elle est fan. Par contre, il nous manque des tomates : tu peux en prendre six ? Va au stand du maraîcher bio, au milieu du boulevard : il a toujours de belles tomates anciennes. Il y a beaucoup de stands de légumes, mais beaucoup des habitués du marché ne vont que chez lui, parce qu’il cueille tout la veille. Si tu vois du basilic, prends-en un bouquet. Pas besoin de pain, mais note pour la prochaine fois : la boulangerie du marché fait des petits pains aux graines vraiment bons.`

### Elutasított minták
- **R1** (pipáló lista): `Bonjour Léo. Je bois du café. Je parle du marché. Il y a de belles pommes. Il y a des petits pains. Il y a beaucoup de gens. Beaucoup des gens du quartier sont là. J’en prends. Je vais en prendre deux.` → A = 4, C = 0 → *Non atteint*.
- **R2** (összefüggő, de a célalakok hibásak): `Oui ! On a acheté beaucoup des croissants au Pain Perché. Il nous manque de fromage : tu peux prendre en deux ? Va au stand de le fromager, il a des bons chèvres.` → *Non atteint*.

### Feedback (magyar, „…” idézéssel)

| ID | Kiváltó | Szöveg |
|---|---|---|
| U21-I08-E01 | hiányzik egy nyelvi kritérium | Egy kötelező szerkezet hiányzik, vagy nem a jelentésének megfelelő helyen áll. Nézd meg újra a hat ellenőrzőkérdést. |
| U21-I08-E02 | *en* előzmény nélkül | Az „en” előtt nevezd meg, mire utal (pl. „on n’a plus d’œufs : tu peux en prendre six ?”). |
| U21-I08-E03 | *beaucoup des* csoport nélkül | A „beaucoup des” után nevezd meg a csoportot (pl. „beaucoup des habitués du quartier”). |
| U21-I08-E04 | felsorolás | Ez még nem üzenet Léónak. Kösd össze a mondatokat: mi van meg, mit hozzon, honnan és miért. |
| U21-I08-E05 | már megvett tételt kér | Az üzeneted szerint ezt már megvettétek. Kérj valami mást, vagy írd meg, miért kell még. |

**Újrapróbálás:** a beadás után látszik a két modell és a hat ellenőrzőkérdés, és a tanuló egyszer átdolgozhatja a teljes üzenetet.

---

## Visszautalt hibák (ESCALATED)

Ebben a körben nincs új kéziratmódosítás. Egy tétel továbbra is feltételesen nyitott:

| ID | Hely | Javasolt kéziratmódosítás | Miért | Ha marad |
|---|---|---|---|---|
| E-09 (feltételes) | p04 *À comparer*, 2. sor (címke + note); i03 2. hely; s004 | Csak akkor kell, ha a 0.3 forrás nem igazolja a *petits pains* lexikalizációját. Ekkor a sor és a lexikalizált *des* mérése visszamegy a GR-hez és a kéziratszerzőhöz. | MO-F03, NyE 0.3 kapu | Amíg a forrás nincs meg, a kulcsok maradnak. |

---

## Változáslista (az 5. változathoz képest)

- **Rubrika (i08):** franciául (*Grille d’évaluation*, *Niveaux*, *Insuffisant*). A küszöbök, a pontok, a kritériumszám és a szintek sorrendje 1:1. A B terület 1. eleme: *Camille et vous*. A C terület ellentmondás-mondata személytelen. A 0.3-feltétel szerzői adatként kikerült a tanulói rubrikasorból; a szabály az 1. részben marad.
- **Feedback és `incorrect` (i01–i08):** « » → „…”, a francia alakokban ’. Csak tipográfia: a szöveg, a kiváltó, az ID és a kulcs nem változott.
- **1. rész:** a „Jelölés a feedbackben” szabályt a D3 szerinti „Jelölés” szabály váltja.
- **i01:** elutasított minták felvéve (szerzői adat, a megbízás kérte); a `keyDescription` idézése „…”.
- **BLOKK_JSON:**
  - az új kézirat szövegei: francia *vous*-os utasítások, p01 (*Au programme*, francia helyzet), francia belső címek;
  - a 14 kontrasztsor kettébontva (francia lista + magyar `note`);
  - a magyar lesson és note „…” idézéssel;
  - francia p09-brief és listák (D4-példák);
  - francia modellcímek, francia rubrika;
  - a három deklarált stimulusváltozás (i06 *Le brouillon*, i08 *Réponds-lui.* kiköltözve, s006 *→ Transforme avec en.* kiköltözve);
  - NBSP (`\u00a0`) a francia szövegekben.
- **Nem változott:** az ID-k, a kulcsok, az alternatívák, a rejected-listák, a kategóriák, a C minta, az R1 és az R2 szövege (csak ’), a pontszámok.

## Dispositionök (a T27-terv rám eső tételei)

| Tétel | Disposition | Hely |
|---|---|---|
| Megoldásíró 1: francia rubrika, B 1. elem *vous* nélkül (N-04) | FIXED | i08 rubrika |
| Megoldásíró 2: „…” idézés minden magyar feedbackben és `incorrect` szövegben (N-01/D3) | FIXED | i01–i08 |
| Megoldásíró 3: az 1. rész jelölési szabálya | FIXED | 1. rész, „Jelölés” |
| GR-T27-04 (a D3 felülírja a megoldás jelölési szabályát) | FIXED ebben az egységben | a többi T27-egység: CEO |
| MO-F04 (6): dőlt jelölés lehántva, az *en* „én”-nek olvasható | FIXED | a JSON lesson/note szövegei „…” idézéssel |
| Korábbi ESCALATED: p09b `visibleAfter`, időkeret, K3-értelmezés | változatlanul ESCALATED (CEO/GR) | – |

## Findingok (saját)

| ID | Súly | Hely | Leírás | Recheck |
|---|---|---|---|---|
| MO-T27-01 | NOTE | p02–p06 JSON | A D2 leképezése: oldalanként egy francia `list` (`role: example`), amelynek bejegyzése „mondat — címke”, és utána egy magyar `text` (`role: note`), amelyben a sorszám a listaelemhez köti az indoklást. Ha a CEO-szkript soronkénti `note`-ot kér, ez szerkezeti átrendezés, a szöveg ugyanaz. | CEO-szkript, CL-27 |
| MO-T27-02 | NOTE | BLOKK_JSON | A nem törő szóköz `\u00a0`-ként áll a francia szövegekben, a markdownban sima szóköz; a normalizálás egyenértékűnek veszi őket. A tanulói nézetben sima szóköz áll. | HE, CEO hűségellenőrzés |
| MO-T27-03 | NOTE | i01 | A kézirat *Réponse : 1 = … ; 2 = …* válaszmód-sorának nincs sémamezője; a promptba nem tettem be (mint eddig). | CEO, UE |
| MO-T27-04 | NOTE | i03, s004 `rejected.reason`; magyar triggerek | A `reason` és `trigger` szerzői adat, magyarul maradt (benne „0.3 kapu”). Ha a meta-token ellenőrzés ezt tanulói szövegnek veszi, a CEO-leképezés hagyja el. | CEO |
| MO-T27-05 | NOTE | rubrika | Szóválasztás: *non atteint / partiel / atteint / excellent*, *antécédent exprimé*, *Insuffisant*. | NyE |
| MO-F03 | NOTE | i03, s004, i08, p04 | A 0.3 kapu nyitott. | NyE |

**Hiányok:** a 0.3 kapu nyitott; a HE-05 teljes szövegét nem láttam (NEM VIZSGÁLT); a `block.schema.json` aktuális változatát nem nyitottam meg. A JSON az élesben átment szerkezetet követi; új elem a `title` mező a `text` elemen, amely a régi blokkban is szerepelt (Kulturális háttér).

**Döntési kérdés:** nincs.

**Bizonyíték:**
- **Új:**
  - kulcs nélküli újramegoldás az új francia utasításokkal (0. rész);
  - a rubrika 1:1 összevetése a régi magyarral (területek, pontok, küszöbök, sorrend);
  - a zárt készletek egyeztetése az új i03, i04 és i07 utasítással;
  - az idézőjelcsere soronkénti átvezetése úgy, hogy a szöveg nem változott.
- **Újrahasznosított:** a PE és a NavE PASS-ai a változatlan kulcsokra és feedbacktartalomra; az 5. változat sémaellenőrzött JSON-szerkezete.

**Újraellenőrzést igényel:**
- független megoldó: a tanulói nézet;
- NavE: a rubrika 1:1 egyezése, a változatlan ID- és kulcsadatok, az s006 utasítása;
- NyE és HE: a francia rubrika és a „…” / « » / NBSP jelölés;
- PE: a rubrika B és C területe;
- UE: a végigjárás.

**Következő címzett:** CEO.

---

TANULOI_NEZET
U21 — Du, des, de : forme ou sens ?

[p01 — Au programme]
Lisez la situation et les objectifs, puis passez à la première activité.
Le décor : Dans ce bloc, tu joues un rôle. Tu habites à Lyon, dans le quartier de la Croix-Rousse, avec Camille, ta colocataire. Dimanche, à 11 h, Léo, votre ami, vient bruncher chez vous. Samedi soir, tu choisis une boulangerie et tu réserves. Dimanche matin, tu fais la queue devant le Pain Perché, tu commandes au comptoir et, entre deux, tu échanges des messages avec Léo. Quand tu dis « nous », c’est Camille et toi.

[w01-u-2-1-i01] (p02 — Deux valeurs de du)
Expliquez brièvement la valeur de « du » dans les deux phrases. Vous pouvez répondre en français ou en hongrois.
1. Le dimanche, Camille et moi, on achète du pain de seigle : il se garde plusieurs jours.
2. Le Pain Perché est juste à côté du parc de la Cerisaie.
Réponse : 1 = … ; 2 = …  [mező: rövid szöveg]

[w01-u-2-1-i02] (p03 — Choisir entre du, de, de la et des)
Choisissez la bonne réponse.
Dimanche, 8 h 15. Tu viens de passer vingt minutes dans le café que Léo t’a conseillé. Tu lui écris un SMS :
Je reviens ___ café que tu m’as conseillé. Le serveur est adorable, merci !
A. du   B. de   C. de la   D. des

[w01-u-2-1-i03] (p04 — De belles tartes, des petits pains; az oldal tetején látható az ardoise)
Complétez avec « de », « d’ » ou « des ».
Samedi soir, tu compares deux boulangeries. Dans la rubrique « Nos adresses du dimanche » d’un guide de la Croix-Rousse, tu lis :
Même si sa devanture ne paie pas de mine, le Pain Perché propose ___ excellents croissants au beurre et, dès 7 heures, ___ petits pains aux céréales encore tièdes.
[mező 1]  [mező 2]

[w01-u-2-1-i04] (p05 — Beaucoup de ou beaucoup des ?)
Complétez avec « beaucoup de » ou « beaucoup des ».
Dans la file, Camille regarde la vitrine :
« Bonne nouvelle : il reste encore ___ viennoiseries. Par contre, regarde : ___ tartes de la vitrine sont déjà réservées. »
[mező 1]  [mező 2]

[w01-u-2-1-i05] (p06 — Où placer en ?)
Remplacez le complément de quantité par « en ». Écrivez quatre réponses complètes.
1. 8 h 45. La boulangère : « Il me reste du pain de seigle, à la coupe. Ça vous tente ? » Tu acceptes : Je prends du pain de seigle.  [mező]
2. 8 h 45. La boulangère te donne les deux pains au chocolat que tu as réservés hier soir : « Et avec ceci ? Les croissants sortent du four. » Tu réponds : Je vais prendre deux croissants.  [mező]
3. 9 h 05, à la maison. Camille te prépare un café et te tend le sucre. Tu refuses : Je ne veux pas de sucre.  [mező]
4. 9 h 15. À la maison, vous avez ouvert la boîte de flan : il n’y a que deux parts. Tu retournes au Pain Perché, tu montres la boîte de flan et tu expliques poliment à la boulangère : Nous avons acheté trois parts de flan.  [mező]

[w01-u-2-1-i06] (p07 — Clinique d’erreurs)
Le brouillon contient deux phrases fausses. Dans chacune, corrigez seulement l’erreur et gardez tous les autres mots. Écrivez les deux phrases corrigées.
Samedi, 19 h 40. Sur Instagram, tu as demandé au Pain Perché si on peut réserver pour demain. On te répond. Tu prépares ta réponse et tu la relis avant de l’envoyer.
Toi : Bonjour ! Est-ce que vous prenez des réservations pour demain matin ?
Le Pain Perché : Bonsoir ! Oui : le dimanche, on réserve les pains au chocolat, et les chouquettes par sachet de vingt. Combien pour vous ?
Le brouillon : Bonsoir et merci ! Pour les pains au chocolat, c’est parfait. Je vais prendre en deux. Les chouquettes, vingt, c’est beaucoup pour trois personnes. Nous ne voulons pas en acheter des. Nous passerons vers 8 h 45. Bonne soirée !
[mező 1]  [mező 2]

[w01-u-2-1-i07] (p08 — Six rappels mélangés)
Complétez ou transformez chaque phrase. Les six phrases ne testent pas toutes la même règle.
Pour les phrases 1 à 5, écrivez seulement la forme qui manque (« du », « de la », « de », « d’ » ou « des »). Pour la phrase 6, remplacez le complément de quantité par « en » et écrivez la phrase complète.
1. Dimanche, 10 h 40. Vous préparez des tartines pour le brunch. Camille : « Et sur celles de Léo, tu mets quoi ? » Toi : « Il adore le sucré : je mets ___ miel. »  [mező]
2. Dimanche, 8 h 25. Camille a dormi chez ses parents. Elle t’écrit : « J’arrive en métro ! » Tu l’attends à la sortie ___ métro Croix-Rousse.  [mező]
3. Samedi soir, sur le site du Pain Perché, rubrique « Notre maison » : « Chaque samedi, nous cuisons ___ immenses tourtes de seigle, vendues à la coupe. »  [mező]
4. Dimanche, 8 h 45. Sous la rubrique « Petits pains » de l’ardoise, la boulangère a ajouté à la craie : « Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds ! »  [mező]
5. Samedi soir, même rubrique « Notre maison » : « Notre boutique est minuscule, mais nous proposons chaque jour beaucoup ___ variétés de pain. »  [mező]
6. Dimanche, 8 h 45. La boulangère : « Le flan, c’est à la part. Combien de parts ? » Tu réponds : Je vais prendre trois parts de flan.  [mező: teljes mondat]

[w01-u-2-1-i08] (p09 — Production guidée : la réponse à Léo)
Écrivez un court message cohérent de 6 à 8 phrases.
Répondez à Léo en 6 à 8 phrases : dites-lui ce que Camille et vous avez déjà acheté, ce qu’il doit apporter (et combien), où l’acheter et pourquoi.
Dimanche, 10 h 15. Léo t’écrit : « Je pars de chez moi ! Je passe par le marché de la Croix-Rousse : il vous manque quelque chose pour le brunch ? »
Consigne :
- Destinataire : Léo, un ami français.
- Registre : courant et informel, sans argot (SMS, tutoiement).
- Objectif : dire ce qui est déjà acheté, ce que Léo doit apporter et en quelle quantité, où l’acheter et pourquoi là.
- Longueur : 6 à 8 phrases liées.
Contenu du message :
1. ce que Camille et vous avez déjà acheté ;
2. ce que Léo doit apporter, avec la quantité, dont au moins un produit en quantité non précisée (par exemple : fromage, jus de fruits) ;
3. où l’acheter : un lieu qu’on peut nommer avec « du » (une boutique, un stand ou une boulangerie, par exemple « le stand du… », « la boulangerie du… ») ;
4. une quantité ouverte ou une foule (au marché, dans la queue, dans le choix proposé) ;
5. une partie d’un groupe nommé ;
6. pourquoi vous recommandez cet endroit.
Avant d’envoyer, vérifiez (critères de langue) :
1. Y a-t-il un « du » qui veut dire « une certaine quantité » (valamennyi) et un autre qui vient de « de + le » ? (ex. : « on boit du rosé au bord du Rhône »)
2. Y a-t-il « de / d’ » + un adjectif placé avant le nom (elöl álló melléknév) + un nom au pluriel ? (ex. : « de gros saucissons »)
3. Y a-t-il « des petits pains » ?
4. Y a-t-il « beaucoup de » pour une quantité ouverte (nyitott mennyiség) et « beaucoup des » pour une partie d’un groupe nommé (megnevezett csoport) ? (ex. : « beaucoup de voyageurs » ↔ « beaucoup des voyageurs du TGV de 18 h »)
5. Y a-t-il « en » devant un verbe conjugué (ragozott ige) ou devant l’auxiliaire (segédige) ? (ex. : « des glaçons ? Paul en apporte » ; « il en a déjà apporté »)
6. Y a-t-il « en » devant un infinitif, avec le nombre ? (ex. : « des chaises pliantes ? on va en emprunter cinq aux voisins »)
[nagy szövegmező]
(A beadás után: Modèle A – recommandation enthousiaste; Modèle B – « oui, mais… » prudent.)
TANULOI_NEZET_VEGE

BLOKK_JSON
{
"schemaVersion":"p5-block-1.0.0",
"contractVersion":"2.0.0",
"id":"w01-u-2-1",
"week":1,
"kind":"lesson",
"title":"Du, des, de : forme ou sens ?",
"position":{"row":2,"column":1},
"prerequisites":[],
"estimatedMinutes":{"min":34,"max":45},
"taughtTargetRefs":[
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
"brief":{"register":"tu","requiredContent":["ce que Camille et vous avez déjà acheté\u00a0;","ce que Léo doit apporter, avec la quantité, dont au moins un produit en quantité non précisée (par exemple\u00a0: fromage, jus de fruits)\u00a0;","où l’acheter\u00a0: un lieu qu’on peut nommer avec «\u00a0du\u00a0» (une boutique, un stand ou une boulangerie, par exemple «\u00a0le stand du…\u00a0», «\u00a0la boulangerie du…\u00a0»)\u00a0;","une quantité ouverte ou une foule (au marché, dans la queue, dans le choix proposé)\u00a0;","une partie d’un groupe nommé\u00a0;","pourquoi vous recommandez cet endroit."],"requiredLanguage":[{"text":"du"},{"text":"des petits pains"},{"text":"beaucoup de"},{"text":"beaucoup des"}],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i08"}},
"pages":[
{"id":"w01-u-2-1-p01","template":"PAGE-intro","variant":"PV-intro-brief","title":"Au programme","instruction":"Lisez la situation et les objectifs, puis passez à la première activité.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p01 – Au programme"},"content":[{"type":"text","role":"situation","title":"Le décor","language":"fr","text":"Dans ce bloc, tu joues un rôle. Tu habites à Lyon, dans le quartier de la Croix-Rousse, avec Camille, ta colocataire. Dimanche, à 11 h, Léo, votre ami, vient bruncher chez vous. Samedi soir, tu choisis une boulangerie et tu réserves. Dimanche matin, tu fais la queue devant le Pain Perché, tu commandes au comptoir et, entre deux, tu échanges des messages avec Léo. Quand tu dis «\u00a0nous\u00a0», c’est Camille et toi.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p01 – Au programme"}},{"type":"text","role":"lesson","title":"Vos objectifs","language":"fr","text":"Vous connaissez déjà les déterminants et le pronom «\u00a0en\u00a0». Ici, vous allez préciser quatre choix où la forme dépend du sens\u00a0:","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p01 – Au programme"}},{"type":"list","role":"lesson","language":"fr","entries":["reconnaître si «\u00a0du\u00a0» veut dire «\u00a0une quantité de…\u00a0» ou «\u00a0de + le\u00a0»\u00a0;","écrire «\u00a0de belles tartes\u00a0», mais «\u00a0des petits pains\u00a0» quand l’expression est un nom de produit\u00a0;","distinguer «\u00a0beaucoup de gens\u00a0» et «\u00a0beaucoup des habitués du quartier\u00a0»\u00a0;","placer «\u00a0en\u00a0» au bon endroit\u00a0: avant le verbe conjugué, avant l’infinitif, avant l’auxiliaire."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p01 – Au programme"}},{"type":"text","role":"note","language":"fr","text":"Petit repère\u00a0: la bonne forme dépend de ce qu’on veut dire, pas seulement du mot qui suit.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p01 – Au programme"}}],"items":[]},
{"id":"w01-u-2-1-p02","template":"PAGE-closed","variant":"PV-closed-mixed","title":"Deux valeurs de du","instruction":"Lisez l’échange et l’explication, puis expliquez la différence avec vos propres mots.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"},"content":[{"type":"text","role":"situation","language":"fr","text":"Dimanche, 10 h 00, à la maison. Léo t’écrit.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"}},{"type":"text","role":"example","title":"L’échange","language":"fr","text":"Léo\u00a0: Petite question pour tout à l’heure\u00a0: je ramène du café ou vous en avez\u00a0?\nToi\u00a0: On a du café, t’inquiète\u00a0! Et merci encore pour l’adresse.\nLéo\u00a0: Alors, verdict\u00a0?\nToi\u00a0: Top\u00a0! J’ai parlé du café de la place à Camille, elle veut y aller la semaine prochaine.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"}},{"type":"text","role":"lesson","title":"La règle","language":"hu","text":"Az üzenetváltásban a „café” szó kétszer áll „du” után, de a két „du” mást jelent:\n„On a du café”: valamennyi kávé van itthon. Ez partitív „du”.\n„J’ai parlé du café de la place”: a „parler de” után a „le café” (a téren lévő kávézó) összevonódik: „de + le = du”.\nA „du” alak tehát két szerkezetből jöhet:\n1. Partitív „du”: valamennyi, nem pontosan megadott mennyiség valamiből. Jellemzően az „avoir”, a „boire”, a „commander”, a „manger” és hasonló igék tárgyaként áll.\n2. Összevont „de + le = du”: egy „de”-t kívánó szerkezet („parler de”, „se souvenir de”, „près de”…) után határozott, hímnemű főnév áll.\nA döntést a mondat szerkezete hozza meg: van-e előtte „de”-t kívánó ige vagy elöljáró. A főnév szótári jelentése nem dönt.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"}},{"type":"list","role":"example","title":"Exemples","language":"fr","entries":["Le dimanche, je bois du café au comptoir, debout.","Camille commande toujours du thé vert.","Tu te souviens du serveur\u00a0? Il connaît tout le quartier."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"}},{"type":"list","role":"example","title":"À comparer","language":"fr","entries":["Je bois de café. — ✗ incorrect","On parle de café. — ✓ correct, autre sens","On parle du café. — ✓ de + le"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"}},{"type":"text","role":"note","language":"hu","text":"1. Hibás: állító mondatban nincs olyan elem (tagadás vagy mennyiségszó), amely a „de”-t indokolná.\n2. Helyes, de mást jelent: általában a kávéról mint témáról beszélünk.\n3. Egy konkrét kávéról vagy kávézóról beszélünk, amelyet mindketten ismerünk.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p02 – Deux valeurs de du"}}],"items":[
{"id":"w01-u-2-1-i01","capability":"CAP-typed-short","variant":"PV-typed-short","instruction":"Expliquez brièvement la valeur de «\u00a0du\u00a0» dans les deux phrases. Vous pouvez répondre en français ou en hongrois.","prompt":"1. Le dimanche, Camille et moi, on achète du pain de seigle\u00a0: il se garde plusieurs jours.\n2. Le Pain Perché est juste à côté du parc de la Cerisaie.","response":{"type":"text","lines":"multi"},"solution":{"type":"samples","samples":["1 = partitif : une certaine quantité de pain ; 2 = de + le : à côté de + le parc.","1 = partitív (valamennyi kenyér, az acheter tárgya) ; 2 = de + le (à côté de le parc → du)"],"keyDescription":"1 = partitív „du” (az „acheter” tárgya, valamennyi rozskenyér);\n2 = „de + le” („à côté de” + „le parc”).\nmagyarul vagy franciául, bármilyen megfogalmazásban, ha mindkét mondathoz a helyes értéket rendeli;\nszakszó nem kötelező;\naz indoklás nem kötelező, de ha szerepel, ne legyen hibás."},"feedback":{"correct":"Pontosan: az 1. mondatban az „acheter” után valamennyi rozskenyér áll (partitív „du”); a 2. mondatban az „à côté de” után a „le parc” áll, így „de + le = du”.","targeted":[{"id":"U21-I01-E01","trigger":"a 2. mondat partitív","text":"A 2. mondatban nem mennyiségről van szó: az „à côté de” után határozott hely áll („le parc de la Cerisaie”). Ez „de + le = du”."},{"id":"U21-I01-E02","trigger":"az 1. mondat de + le","text":"Az 1. mondatban az „acheter” közvetlenül kapja a tárgyát, előtte nincs „de”-t kívánó elem. A „du” itt valamennyi rozskenyeret jelent: partitív."},{"id":"U21-I01-E03","trigger":"felcserélés","text":"Fordítva: az 1. mondat partitív („acheter” + valamennyi kenyér), a 2. mondat összevont („à côté de” + „le parc”)."},{"id":"U21-I01-E04","trigger":"a 2. mondatnál csak „hely” áll","text":"A jelentést jól látod. Írd mellé a szerkezetet is: mi áll a „du” előtt? („à côté de” + „le parc” → „du”)"}]},"evaluation":{"mode":"semantic","aiAdvisoryOnly":true,"scoring":"formative-required"},"targetRefs":["w01-g-det-partitive-mass","w01-g-det-semantic-contrast"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i01"}}
]},
{"id":"w01-u-2-1-p03","template":"PAGE-closed","variant":"PV-closed-mixed","title":"Choisir entre du, de, de la et des","instruction":"Choisissez la forme qui correspond au contexte.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p03 – Choisir entre du, de, de la et des"},"content":[{"type":"text","role":"lesson","title":"La règle","language":"hu","text":"Ha egy „de”-t kívánó ige („revenir de”, „sortir de”) vagy szerkezet („le prix de”, „le goût de”) után hímnemű, határozott főnév áll, a „de le” összevonódik: „du”. Nőnemű főnév előtt „de la” áll, többes számban „des” („de + les”).","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p03 – Choisir entre du, de, de la et des"}},{"type":"list","role":"example","title":"Exemples","language":"fr","entries":["Camille revient du marché avec un sac de pommes.","Le dimanche, Léo sort du lit vers dix heures.","Le prix du croissant a encore augmenté cette année."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p03 – Choisir entre du, de, de la et des"}},{"type":"list","role":"example","title":"À comparer","language":"fr","entries":["Je voudrais du jus d’orange. — partitif","Je n’aime pas le goût du jus d’orange en bouteille. — de + le"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p03 – Choisir entre du, de, de la et des"}},{"type":"text","role":"note","language":"hu","text":"1. Partitív: valamennyi narancslét kérek.\n2. „Le goût de” + „le jus d’orange”: a palackozott narancslé íze.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p03 – Choisir entre du, de, de la et des"}}],"items":[
{"id":"w01-u-2-1-i02","capability":"CAP-choice-single","variant":"PV-choice-one","instruction":"Choisissez la bonne réponse.","prompt":"Dimanche, 8 h 15. Tu viens de passer vingt minutes dans le café que Léo t’a conseillé. Tu lui écris un SMS\u00a0:\nJe reviens ___ café que tu m’as conseillé. Le serveur est adorable, merci\u00a0!","response":{"type":"single","options":[{"id":"a","label":"du"},{"id":"b","label":"de"},{"id":"c","label":"de la"},{"id":"d","label":"des"}]},"solution":{"type":"choice","keyOptionIds":["a"]},"feedback":{"correct":"Igen: „revenir de” + „le café” (a hímnemű, azonosított kávézó) → „du”.","targeted":[{"id":"U21-I02-B","trigger":"b","text":"A „revenir de” után itt egy azonosított kávézó áll: „le café que tu m’as conseillé”. A „de + le” összevonódik: „du”."},{"id":"U21-I02-C","trigger":"c","text":"A „café” hímnemű: „le café”. A „de la” nőnemű főnév elé kell."},{"id":"U21-I02-D","trigger":"d","text":"Egy kávézóról van szó, egyes számban: „de + le = du”. A „des” = „de + les”, többes számhoz."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-det-semantic-contrast"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i02"}}
]},
{"id":"w01-u-2-1-p04","template":"PAGE-closed","variant":"PV-closed-mixed","title":"De belles tartes, des petits pains","instruction":"Lisez la règle et l’ardoise, puis complétez la phrase.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"},"content":[{"type":"text","role":"situation","language":"fr","text":"Samedi soir. Tu cherches une boulangerie pour demain matin. Sur Instagram, le Pain Perché publie la photo de son ardoise de demain.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}},{"type":"text","role":"example","title":"L’ardoise (photo publiée sur Instagram)","language":"fr","text":"LE PAIN PERCHÉ — demain dimanche\nPAINS           tradition · campagne · seigle (à la coupe)\nPETITS PAINS    céréales · lait\nVIENNOISERIES   croissant au beurre · pain au chocolat · chausson aux pommes · mini-viennoiseries (le sachet)\nPÂTISSERIES     flan (à la part) · cannelés · tarte du jour\nFORMULE PETIT-DÉJ   boisson chaude + jus d’orange + viennoiserie","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}},{"type":"text","role":"lesson","title":"La règle","language":"hu","text":"Gondozott írott franciában a többes számú „des” rendszerint „de/d’” alakra rövidül, ha a főnév előtt melléknév áll:\n„des tartes” → „de belles tartes”;\n„des miches” → „de grosses miches”.\nKivétel, ha a melléknév és a főnév együtt egy fogalmat nevez meg, összeforrt kifejezésként. Ilyenkor a „des” megmarad: „des petits pois”, „des grands-parents”, a pékségben pedig „des petits pains”. A „petits pains” nem „kicsi kenyereket” jelent, hanem egy termékfajtát. Ezért van saját rovata a táblán.\nBeszélt nyelvben gyakori a „des belles tartes” is, de gondozott írott szövegben (ajánló, bemutatkozó szöveg) a „de belles tartes” a mérce. A gyakori, rövid melléknevekkel („de bons…”, „de beaux…”) a „de” a hétköznapi beszédben is természetes.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}},{"type":"list","role":"example","title":"Exemples","language":"fr","entries":["Le Pain Perché fait de belles tartes aux fruits de saison.","Même si la boutique est minuscule, on y trouve de grosses miches de campagne.","Le dimanche, ils ont aussi des petits pains au lait."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}},{"type":"list","role":"example","title":"À comparer","language":"fr","entries":["Ils font des belles tartes. — à l’oral, oui\u00a0; à l’écrit soigné\u00a0: de belles tartes","Ils vendent de petits pains. — nom de produit\u00a0: à l’écrit soigné aussi, des petits pains"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}},{"type":"text","role":"note","language":"hu","text":"1. Beszédben előfordul; gondozott írásban: „de belles tartes”.\n2. Ha a termék nevéről van szó, gondozott írásban is a „des petits pains” a mérce, mert a „petits pains” összeforrt kifejezés.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}},{"type":"text","role":"note","title":"Repère culturel","language":"hu","text":"A francia tábla külön rovatban tartja a következő termékeket:\n„pains”: kenyerek;\n„petits pains”: egyszemélyes kis kenyerek, nagyjából a zsemle szerepében;\n„viennoiseries”: vajas, leveles vagy kelt tészta, például croissant és pain au chocolat; a „mini-viennoiseries” zacskóban kapható;\n„pâtisseries”: sütemények.\nA magyar „péksütemény” a kiflitől a kakaós csigáig mindezt egybefogja. A „formule petit-déjeuner” fix áras csomag: meleg ital, gyümölcslé és egy viennoiserie.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p04 – De belles tartes, des petits pains"}}],"items":[
{"id":"w01-u-2-1-i03","capability":"CAP-typed-short","variant":"PV-typed-two-fields","instruction":"Complétez avec «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0».","prompt":"Samedi soir, tu compares deux boulangeries. Dans la rubrique «\u00a0Nos adresses du dimanche\u00a0» d’un guide de la Croix-Rousse, tu lis\u00a0:\nMême si sa devanture ne paie pas de mine, le Pain Perché propose ___ excellents croissants au beurre et, dès 7 heures, ___ petits pains aux céréales encore tièdes.","response":{"type":"fields","fields":[{"id":"f1","label":"1"},{"id":"f2","label":"2"}]},"solution":{"type":"exact","key":{"f1":"d'","f2":"des"},"alternatives":["d’excellents","d’excellents croissants","des petits pains"],"rejected":[{"text":"des (1)","feedbackRef":"U21-I03-E01"},{"text":"de (1)","feedbackRef":"U21-I03-E02"},{"text":"de (2)","reason":"Feltételes szabály: az 1. részben leírtak szerint (a 2. mező de alakja).","feedbackRef":"U21-I03-E03"},{"text":"les","feedbackRef":"U21-I03-E04"},{"text":"d' (2)","feedbackRef":"U21-I03-E06"},{"text":"ses","feedbackRef":"U21-I03-F01"},{"text":"quelques","feedbackRef":"U21-I03-F01"}]},"feedback":{"correct":"Jó: gondozott ajánlószövegben elöl álló melléknév előtt „d’” áll („d’excellents croissants”), a „petits pains” viszont termékfajta neve, ezért „des petits pains”.","incorrect":"Ez nem a várt alak. Válassz a „de”, „d’” és „des” közül: mi áll gondozott ajánlószövegben az elöl álló melléknév, illetve a „petits pains” termék neve előtt? Nézd meg újra a szabályt és a táblát, és próbáld újra.","targeted":[{"id":"U21-I03-E01","text":"Beszédben gyakori, de ez gondozott ajánló rovat: elöl álló melléknév előtt itt „d’” kell („d’excellents”)."},{"id":"U21-I03-E02","text":"Magánhangzó előtt a „de” elízióval áll: „d’excellents”."},{"id":"U21-I03-E03","text":"A „petits pains” itt a tábla egyik termékfajtájának a neve (Petits pains rovat). Az ilyen összeforrt kifejezések előtt a „des” marad: „des petits pains”."},{"id":"U21-I03-E04","text":"Az ajánló a kínálatot mutatja be, nem korábban említett termékeket: itt nem határozott névelő kell."},{"id":"U21-I03-E05","trigger":"felcserélés","text":"Fordítva: az „excellents” valódi melléknév → „d’”; a „petits pains” egy termék neve → „des”."},{"id":"U21-I03-E06","text":"A „petits” mássalhangzóval kezdődik, itt nincs elízió. A termék neve előtt „des” áll: „des petits pains”."},{"id":"U21-I03-F01","trigger":"ses / quelques","text":"Ez a mondat franciául helyes lehet, de az instrukció a „de”, „d’” és „des” közül kér egyet. Mi áll mennyiségjelző és birtokos nélkül a melléknév, illetve a „petits pains” előtt?"}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-de-adjective-standard"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i03"}}
]},
{"id":"w01-u-2-1-p05","template":"PAGE-closed","variant":"PV-closed-mixed","title":"Beaucoup de ou beaucoup des ?","instruction":"Complétez les deux phrases en respectant le sens.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p05 – Beaucoup de ou beaucoup des ?"},"content":[{"type":"text","role":"situation","language":"fr","text":"Dimanche, 8 h 30. Camille et toi, vous faites la queue devant le Pain Perché.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p05 – Beaucoup de ou beaucoup des ?"}},{"type":"text","role":"lesson","title":"La règle","language":"hu","text":"A „beaucoup de” nyitott mennyiséget jelöl: sok valamiből, előre meg nem határozott csoportból.\nA „beaucoup des” a „beaucoup de + les” összevont alakja: sok egy megnevezett, határozott csoport tagjai közül. A csoportot rendszerint egy bővítmény azonosítja („du dimanche”, „du quartier”, „de la vitrine”…).\nNem a többes szám dönt, hanem az, hogy a csoport meg van-e nevezve.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p05 – Beaucoup de ou beaucoup des ?"}},{"type":"list","role":"example","title":"Exemples","language":"fr","entries":["Le dimanche matin, il y a beaucoup de monde devant les boulangeries.","Beaucoup de gens attendent dehors, même sous la pluie.","Beaucoup des habitués du dimanche ont réservé la veille, tandis que les autres font la queue."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p05 – Beaucoup de ou beaucoup des ?"}},{"type":"list","role":"example","title":"À comparer","language":"fr","entries":["Beaucoup des gens attendent dehors. — ✗ incorrect","Beaucoup d’habitués viennent tôt. — ✓ quantité ouverte","Beaucoup des habitués du dimanche viennent tôt. — ✓ partie d’un groupe nommé"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p05 – Beaucoup de ou beaucoup des ?"}},{"type":"text","role":"note","language":"hu","text":"1. Hibás: nincs megnevezett csoport.\n2. Sok törzsvendég jön korán (nyitott mennyiség).\n3. A vasárnapi törzsvendégek közül sokan korán jönnek.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p05 – Beaucoup de ou beaucoup des ?"}}],"items":[
{"id":"w01-u-2-1-i04","capability":"CAP-typed-short","variant":"PV-typed-two-fields","instruction":"Complétez avec «\u00a0beaucoup de\u00a0» ou «\u00a0beaucoup des\u00a0».","prompt":"Dans la file, Camille regarde la vitrine\u00a0:\n«\u00a0Bonne nouvelle\u00a0: il reste encore ___ viennoiseries. Par contre, regarde\u00a0: ___ tartes de la vitrine sont déjà réservées.\u00a0»","response":{"type":"fields","fields":[{"id":"f1","label":"1"},{"id":"f2","label":"2"}]},"solution":{"type":"exact","key":{"f1":"beaucoup de","f2":"beaucoup des"},"alternatives":["beaucoup de viennoiseries","beaucoup des tartes","beaucoup des tartes de la vitrine"],"rejected":[{"text":"1 = beaucoup des","feedbackRef":"U21-I04-E01"},{"text":"2 = beaucoup de","feedbackRef":"U21-I04-E02"},{"text":"1 = beaucoup d'","feedbackRef":"U21-I04-E04"},{"text":"csak de / des","feedbackRef":"U21-I04-E05"}]},"feedback":{"correct":"Igen: a „viennoiseries” nyitott mennyiség („beaucoup de”), a „tartes de la vitrine” egy megnevezett csoport, abból sok („beaucoup des”).","incorrect":"Ez nem a várt alak. Mindkét helyre a „beaucoup de” vagy a „beaucoup des” kerül: nézd meg, hogy a mondat egy megnevezett csoportról beszél-e, és próbáld újra.","targeted":[{"id":"U21-I04-E01","text":"Az első mondatban nincs megnevezett csoport, csak annyi, hogy sok viennoiserie maradt: „beaucoup de”."},{"id":"U21-I04-E02","text":"A „de la vitrine” megnevezi a csoportot: a kirakatban lévő torták közül sok. Egy megnevezett csoport részére élőszóban is „beaucoup des” (= „de + les”) a helyes."},{"id":"U21-I04-E03","trigger":"felcserélés","text":"Fordítva: a nyitott mennyiség „beaucoup de”, a megnevezett csoport („de la vitrine”) része „beaucoup des”."},{"id":"U21-I04-E04","text":"A „viennoiseries” mássalhangzóval kezdődik: „beaucoup de viennoiseries”."},{"id":"U21-I04-E05","text":"Jól választottál, de a helyre a teljes kifejezés kell: „beaucoup de” vagy „beaucoup des”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-de-quantity","w01-g-de-quantity-subset"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i04"}}
]},
{"id":"w01-u-2-1-p06","template":"PAGE-closed","variant":"PV-closed-mixed","title":"Où placer en ?","instruction":"Lisez la scène et la règle, puis transformez les phrases avec «\u00a0en\u00a0».","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"},"content":[{"type":"text","role":"situation","language":"fr","text":"Dimanche, 8 h 45. C’est enfin votre tour au comptoir du Pain Perché.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"}},{"type":"text","role":"example","title":"Au comptoir","language":"fr","text":"La boulangère\u00a0: Bonjour\u00a0! Qu’est-ce qu’il vous faut\u00a0?\nToi\u00a0: Bonjour\u00a0! Je vais vous prendre une tradition pas trop cuite, s’il vous plaît.\nCamille\u00a0: Et quatre cannelés pour moi\u00a0!\nLa boulangère\u00a0: Très bien. Et avec ceci\u00a0?","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"}},{"type":"text","role":"note","language":"hu","text":"„Je vais vous prendre…”: a pultnál teljesen természetes rendelési fordulat. Figyeld meg: a „vous” névmás az infinitif elé kerül. Az „en” ugyanígy viselkedik.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"}},{"type":"text","role":"lesson","title":"La règle","language":"hu","text":"Az „en” egy korábban említett mennyiségre utal vissza („du…”, „de la…”, „des…”, „de…”, számnév + főnév).\n1. Ragozott ige mellett az „en” a ragozott ige elé kerül.\nCamille mange de la confiture tous les matins. → Camille en mange tous les matins.\n2. Infinitif mellett ahhoz az infinitifhez kerül, amelynek a tárgyát helyettesíti. A szám megmarad.\nLa boulangère va commander six sacs de farine. → Elle va en commander six.\n3. Tagadásban a „ne… pas” a ragozott igét fogja közre, az „en” közvetlenül az ige előtt áll.\nCamille ne boit pas de café. → Camille n’en boit pas.\n4. Passé composé-ban az „en” a segédige elé kerül. A szám megmarad, a főnév nem.\nAu comptoir, Camille a pris quatre cannelés. → Camille en a pris quatre.\nA szám után nem kell melléknév: elég az „en” és a szám.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"}},{"type":"list","role":"example","title":"Contre-exemples","language":"fr","entries":["Elle va commander en six. — ✗ incorrect","Camille a en pris quatre. — ✗ incorrect","Camille en a pris quatre cannelés. — ✗ incorrect","Camille ne boit pas en. — ✗ incorrect"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"}},{"type":"text","role":"note","language":"hu","text":"1. Az „en” az infinitif elé kerül.\n2. Passé composé-ban az „en” a segédige elé kerül.\n3. Az „en” már helyettesíti a főnevet.\n4. Az „en” a ragozott ige előtt áll.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p06 – Où placer en ?"}}],"items":[
{"id":"w01-u-2-1-i05-s001","capability":"CAP-transformation","variant":"PV-transform-sentence","instruction":"Remplacez le complément de quantité par «\u00a0en\u00a0». Écrivez quatre réponses complètes.","prompt":"8 h 45. La boulangère\u00a0: «\u00a0Il me reste du pain de seigle, à la coupe. Ça vous tente\u00a0?\u00a0» Tu acceptes\u00a0: Je prends du pain de seigle.","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"J’en prends.","alternatives":["Oui, j’en prends.","J’en prends, merci.","Oui, j’en prends, merci.","J’en prends, s’il vous plaît.","Volontiers, j’en prends.","Oui, volontiers, j’en prends.","J’en prends, du pain de seigle.","J’en prends un morceau.","Oui, j’en prends un morceau.","J’en veux bien.","Oui, j’en veux bien.","Volontiers, j’en veux bien."],"rejected":[{"text":"Je prends en.","feedbackRef":"U21-I05-E01"},{"text":"Je en prends.","feedbackRef":"U21-I05-E02"},{"text":"J’en prends du pain de seigle.","feedbackRef":"U21-I05-E03"},{"text":"Je le prends.","feedbackRef":"U21-I05-E04"}]},"feedback":{"incorrect":"Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: „en”-nel helyettesítetted-e a mennyiségi bővítményt, jó helyen áll-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.","targeted":[{"id":"U21-I05-E01","text":"Ragozott ige mellett az „en” az ige elé kerül: „j’en prends”."},{"id":"U21-I05-E02","text":"Magánhangzó előtt „je” → „j’”: „j’en prends”."},{"id":"U21-I05-E03","text":"Az „en” már helyettesíti a „du pain de seigle”-t; ne ismételd meg."},{"id":"U21-I05-E04","text":"A „le” egy meghatározott dologra utal. Itt valamennyi rozskenyérről van szó („du…”), ezt az „en” veszi át."},{"id":"U21-I05-N02","trigger":"vesszős kihelyezés","text":"Vesszővel ez helyes, beszélt nyelvi kihelyezés. A feladat a helyettesítést kéri, ezért a rövid alak a cél: „j’en prends” / „je n’en veux pas”."},{"id":"U21-I05-N03","trigger":"…un morceau","text":"Helyes mondat, de a kiinduló mondatban nincs mennyiség. A cél a puszta helyettesítés: „j’en prends”."},{"id":"U21-I05-N05","trigger":"más igével (vouloir bien, prendre)","text":"Helyes, természetes mondat, és az „en” jó helyen áll, de más igével írtad. Itt a kiinduló mondat igéjét tartsd meg, és csak a bővítményt cseréld „en”-re."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-en-partitive-reference","w01-g-en-position-finite-infinitive"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i05"}},
{"id":"w01-u-2-1-i05-s002","capability":"CAP-transformation","variant":"PV-transform-sentence","instruction":"Remplacez le complément de quantité par «\u00a0en\u00a0». Écrivez quatre réponses complètes.","prompt":"8 h 45. La boulangère te donne les deux pains au chocolat que tu as réservés hier soir\u00a0: «\u00a0Et avec ceci\u00a0? Les croissants sortent du four.\u00a0» Tu réponds\u00a0: Je vais prendre deux croissants.","response":{"type":"text","lines":"single","normalization":{"numbersFr":true}},"solution":{"type":"exact","key":"Je vais en prendre deux.","alternatives":["Je vais vous en prendre deux.","Je vais en prendre deux, s’il vous plaît.","Je vais vous en prendre deux, s’il vous plaît.","Oui, je vais en prendre deux."],"rejected":[{"text":"J’en vais prendre deux.","feedbackRef":"U21-I05-E05"},{"text":"Je vais prendre en deux.","feedbackRef":"U21-I05-E06"},{"text":"Je vais en prendre deux croissants.","feedbackRef":"U21-I05-E07"},{"text":"Je vais en prendre.","feedbackRef":"U21-I05-E08"},{"text":"J’en prends deux.","reason":"nem a kért művelet","feedbackRef":"U21-I05-F01"},{"text":"J’en veux deux.","reason":"nem a kért művelet","feedbackRef":"U21-I05-F01"}]},"feedback":{"incorrect":"Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: „en”-nel helyettesítetted-e a mennyiségi bővítményt, jó helyen áll-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.","targeted":[{"id":"U21-I05-E05","text":"Az „en” ahhoz az infinitifhez kerül, amelynek a tárgyát helyettesíti: „je vais en prendre deux”."},{"id":"U21-I05-E06","text":"Az „en” nem a szám elé, hanem az infinitif elé kerül: „en prendre deux”."},{"id":"U21-I05-E07","text":"Az „en” már helyettesíti a „croissants”-t: a szám megmarad, a főnév nem: „en prendre deux”."},{"id":"U21-I05-E08","text":"A szám megmarad: „je vais en prendre deux”."},{"id":"U21-I05-F01","trigger":"J’en prends deux. / J’en veux deux.","text":"Ez helyes francia mondat, de nem a kért átalakítás: a kiinduló mondatban „je vais + infinitif” áll. Tartsd meg ezt a szerkezetet, és csak a bővítményt cseréld „en”-re. Hova kerül ilyenkor az „en”? Próbáld újra."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-en-position-finite-infinitive","w01-g-en-quantity-retention"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i05"}},
{"id":"w01-u-2-1-i05-s003","capability":"CAP-transformation","variant":"PV-transform-sentence","instruction":"Remplacez le complément de quantité par «\u00a0en\u00a0». Écrivez quatre réponses complètes.","prompt":"9 h 05, à la maison. Camille te prépare un café et te tend le sucre. Tu refuses\u00a0: Je ne veux pas de sucre.","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"Je n’en veux pas.","alternatives":["Non, je n’en veux pas.","Non merci, je n’en veux pas.","Non, merci, je n’en veux pas.","Je n’en veux pas, merci.","Non, c’est bon, je n’en veux pas.","Je n’en veux pas, de sucre.","Je n’en prends pas.","Non, je n’en prends pas.","Non merci, je n’en prends pas."],"rejected":[{"text":"Je ne veux pas en.","feedbackRef":"U21-I05-E09"},{"text":"Je ne veux en pas.","feedbackRef":"U21-I05-E09"},{"text":"Je n’en veux pas de sucre.","feedbackRef":"U21-I05-E10"},{"text":"Je ne le veux pas.","feedbackRef":"U21-I05-E11"}]},"feedback":{"incorrect":"Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: „en”-nel helyettesítetted-e a mennyiségi bővítményt, jó helyen áll-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.","targeted":[{"id":"U21-I05-E09","text":"Tagadásban az „en” közvetlenül a ragozott ige előtt áll, a „ne… pas” fogja közre: „je n’en veux pas”."},{"id":"U21-I05-E10","text":"Az „en” már helyettesíti a „de sucre”-t; ne ismételd meg."},{"id":"U21-I05-E11","text":"A „de sucre” mennyiséget jelöl, nem egy meghatározott dolgot: ezt az „en” veszi át."},{"id":"U21-I05-N02","trigger":"vesszős kihelyezés","text":"Vesszővel ez helyes, beszélt nyelvi kihelyezés. A feladat a helyettesítést kéri, ezért a rövid alak a cél: „j’en prends” / „je n’en veux pas”."},{"id":"U21-I05-N05","trigger":"más igével (vouloir bien, prendre)","text":"Helyes, természetes mondat, és az „en” jó helyen áll, de más igével írtad. Itt a kiinduló mondat igéjét tartsd meg, és csak a bővítményt cseréld „en”-re."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-en-partitive-reference","w01-g-en-position-finite-infinitive"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i05"}},
{"id":"w01-u-2-1-i05-s004","capability":"CAP-transformation","variant":"PV-transform-sentence","instruction":"Remplacez le complément de quantité par «\u00a0en\u00a0». Écrivez quatre réponses complètes.","prompt":"9 h 15. À la maison, vous avez ouvert la boîte de flan\u00a0: il n’y a que deux parts. Tu retournes au Pain Perché, tu montres la boîte de flan et tu expliques poliment à la boulangère\u00a0: Nous avons acheté trois parts de flan.","response":{"type":"text","lines":"single","normalization":{"numbersFr":true}},"solution":{"type":"exact","key":"Nous en avons acheté trois.","alternatives":["Nous vous en avons acheté trois.","Nous en avions acheté trois.","On en a acheté trois.","On vous en a acheté trois.","On en avait acheté trois.","Nous en avons acheté trois parts.","On en a acheté trois parts.","Nous en avons pris trois.","On en a pris trois.","Nous vous en avons pris trois."],"rejected":[{"text":"Nous avons en acheté trois.","feedbackRef":"U21-I05-E12"},{"text":"Nous en avons acheté trois parts de flan.","feedbackRef":"U21-I05-E13"},{"text":"Nous en avons achetées trois.","feedbackRef":"U21-I05-E14"},{"text":"Nous en avons acheté.","feedbackRef":"U21-I05-E15"}]},"feedback":{"incorrect":"Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: „en”-nel helyettesítetted-e a mennyiségi bővítményt, jó helyen áll-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.","targeted":[{"id":"U21-I05-E12","text":"Passé composé-ban az „en” a segédige elé kerül: „nous en avons acheté trois”."},{"id":"U21-I05-E13","text":"Az „en” már helyettesíti a „de flan”-t; ne ismételd meg: „nous en avons acheté trois”."},{"id":"U21-I05-E14","text":"Az „en” után a participe passé rendszerint nem egyezik: „acheté”."},{"id":"U21-I05-E15","text":"A szám megmarad: „trois”. Éppen ez a reklamáció lényege."},{"id":"U21-I05-N01","trigger":"on-os változat","text":"Helyes. A feladat a „nous”-t adta; az „on” itt is természetes."},{"id":"U21-I05-N04","trigger":"…trois parts","text":"Helyes: itt az „en” a „de flan”-t veszi át, a „trois parts” a mennyiség. A rövidebb, gyakoribb forma: „nous en avons acheté trois”."},{"id":"U21-I05-N05","trigger":"más igével (vouloir bien, prendre)","text":"Helyes, természetes mondat, és az „en” jó helyen áll, de más igével írtad. Itt a kiinduló mondat igéjét tartsd meg, és csak a bővítményt cseréld „en”-re."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-en-position-finite-infinitive","w01-g-en-quantity-retention"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i05"}}
]},
{"id":"w01-u-2-1-p07","template":"PAGE-closed","variant":"PV-closed-mixed","title":"Clinique d’erreurs","instruction":"Corrigez les deux phrases fausses sans changer le sens.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p07 – Clinique d’erreurs"},"content":[{"type":"text","role":"situation","language":"fr","text":"Samedi, 19 h 40. Sur Instagram, tu as demandé au Pain Perché si on peut réserver pour demain. On te répond. Tu prépares ta réponse et tu la relis avant de l’envoyer.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p07 – Clinique d’erreurs"}},{"type":"text","role":"lesson","title":"Rappel","language":"hu","text":"Két tipikus hiba:\n1. infinitif mellett az „en” az infinitif után vagy a szám elé csúszik;\n2. az „en” mellett megismétlődik a helyettesített főnévi csoport vagy annak determinánsa.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p07 – Clinique d’erreurs"}},{"type":"list","role":"example","title":"Exemples","language":"fr","entries":["✗ Tu vas goûter en un\u00a0? → ✓ Tu vas en goûter un\u00a0?","✗ Les cookies, il ne faut pas en garder des pour le lendemain\u00a0: ils sèchent. → ✓ Les cookies, il ne faut pas en garder pour le lendemain\u00a0: ils sèchent.","✗ Il reste des cookies\u00a0? Oui, j’en ai gardé un cookie pour toi. → ✓ Oui, j’en ai gardé un pour toi."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p07 – Clinique d’erreurs"}}],"items":[
{"id":"w01-u-2-1-i06","capability":"CAP-typed-short","variant":"PV-typed-two-fields","instruction":"Le brouillon contient deux phrases fausses. Dans chacune, corrigez seulement l’erreur et gardez tous les autres mots. Écrivez les deux phrases corrigées.","prompt":"Toi\u00a0: Bonjour\u00a0! Est-ce que vous prenez des réservations pour demain matin\u00a0?\nLe Pain Perché\u00a0: Bonsoir\u00a0! Oui\u00a0: le dimanche, on réserve les pains au chocolat, et les chouquettes par sachet de vingt. Combien pour vous\u00a0?\n\nLe brouillon\u00a0: Bonsoir et merci\u00a0! Pour les pains au chocolat, c’est parfait. Je vais prendre en deux. Les chouquettes, vingt, c’est beaucoup pour trois personnes. Nous ne voulons pas en acheter des. Nous passerons vers 8 h 45. Bonne soirée\u00a0!","response":{"type":"fields","fields":[{"id":"f1","label":"1"},{"id":"f2","label":"2"}],"normalization":{"numbersFr":true}},"solution":{"type":"exact","key":{"f1":"Je vais en prendre deux.","f2":"Nous ne voulons pas en acheter."},"alternatives":["Je vais vous en prendre deux."],"rejected":[{"text":"J’en vais prendre deux.","feedbackRef":"U21-I06-E01"},{"text":"Je vais en prendre deux pains au chocolat.","feedbackRef":"U21-I06-E02"},{"text":"Je vais prendre deux.","feedbackRef":"U21-I06-E03"},{"text":"Nous ne voulons pas en acheter des.","feedbackRef":"U21-I06-E04"},{"text":"Nous ne voulons pas en acheter de.","feedbackRef":"U21-I06-E05"},{"text":"Nous n’en voulons pas.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F01"},{"text":"Nous n’allons pas en prendre.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F01"},{"text":"Nous n’en prendrons pas.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F01"},{"text":"Nous ne voulons pas en prendre.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F01"},{"text":"On n’en veut pas.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F01"},{"text":"J’en prendrai deux.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F02"},{"text":"J’en prends deux.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F02"},{"text":"J’en veux deux.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F02"},{"text":"On ne veut pas en acheter.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F03"},{"text":"Nous ne voulons pas acheter de chouquettes.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F04"},{"text":"Nous ne voulons pas en acheter vingt.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F05"},{"text":"Je vais en réserver deux.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F06"},{"text":"Je vais vous en réserver deux.","reason":"nem a kért művelet","feedbackRef":"U21-I06-F06"}]},"feedback":{"correct":"Pontosan: az „en” az infinitif elé került („en prendre”, „en acheter”), és mellette nem maradt meg a helyettesített főnévi csoport.","incorrect":"Ez nem egyezik a várt javítással. Ellenőrizd az „en” helyét, és hogy nem maradt-e meg mellette a főnév vagy a determináns. Az instrukció szerint csak a hibát javítod, a többi szót megtartod.","targeted":[{"id":"U21-I06-A01","trigger":"Je vais vous en prendre deux.","text":"Elfogadva: a „vous” a pultnál és foglaláskor természetes, és az „en” jó helyen áll („vous en prendre”). Az instrukció csak a hiba javítását kérte, ezért a piszkozat szavaival a pontos javítás: „je vais en prendre deux”."},{"id":"U21-I06-E01","text":"Az „en” az infinitif elé kerül, amelynek a tárgyát helyettesíti: „je vais en prendre deux”."},{"id":"U21-I06-E02","text":"Az „en” már helyettesíti a „pains au chocolat”-t: „je vais en prendre deux”."},{"id":"U21-I06-E03","text":"Szám mellett az „en” kötelező: „je vais en prendre deux”."},{"id":"U21-I06-E04","trigger":"Nous ne voulons pas en acheter des. / … en acheter des chouquettes.","text":"Az „en” már helyettesíti a „chouquettes”-et; a „des” fölösleges."},{"id":"U21-I06-E05","text":"Tagadásban sem kell utána determináns: az „en” már átvette a főnévi csoportot."},{"id":"U21-I06-F01","trigger":"Nous n’en voulons pas. · Nous n’allons pas en prendre. · Nous n’en prendrons pas. · Nous ne voulons pas en prendre. · On n’en veut pas.","text":"Ez helyes francia mondat, de az instrukció szerint csak a hibát javítod, a többi szót megtartod. Így a „vouloir + acheter” szerkezet megmarad: „nous ne voulons pas en acheter”."},{"id":"U21-I06-F02","trigger":"J’en prendrai deux. · J’en prends deux. · J’en veux deux.","text":"Helyes mondat, de a piszkozatban „je vais + infinitif” áll, és a többi szót meg kell tartanod: „je vais en prendre deux”."},{"id":"U21-I06-F03","trigger":"On ne veut pas en acheter.","text":"Helyes, de a piszkozat a „nous”-t használja, és a többi szót meg kell tartanod: „nous ne voulons pas en acheter”."},{"id":"U21-I06-F04","trigger":"Nous ne voulons pas acheter de chouquettes.","text":"Helyes mondat, de a piszkozatban az „en” helyettesíti a „chouquettes”-et. Csak a fölösleges „des”-t kell törölni: „nous ne voulons pas en acheter”."},{"id":"U21-I06-F05","trigger":"Nous ne voulons pas en acheter vingt.","text":"Helyes mondat, de így csak a húszas zacskót utasítod el, és új szót tettél bele. A piszkozat szerint egyáltalán nem kértek: „nous ne voulons pas en acheter”."},{"id":"U21-I06-F06","trigger":"Je vais en réserver deux. · Je vais vous en réserver deux.","text":"Helyes, foglalásnál természetes is. Az instrukció szerint azonban a többi szó marad, így a „prendre” ige is: „je vais en prendre deux”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-en-position-finite-infinitive","w01-g-en-partitive-reference"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i06"}}
]},
{"id":"w01-u-2-1-p08","template":"PAGE-closed","variant":"PV-closed-mixed","title":"Six rappels mélangés","instruction":"Complétez ou transformez chaque phrase. Les six phrases ne testent pas toutes la même règle.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p08 – Six rappels mélangés"},"content":[{"type":"text","role":"lesson","title":"Rappel","language":"hu","text":"Vegyes előhívás a hétvége hat pillanatából:","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p08 – Six rappels mélangés"}},{"type":"list","role":"lesson","language":"hu","entries":["partitív „du”;","összevont „de + le”;","„d’” elöl álló melléknév előtt;","„des petits pains”;","„beaucoup de”;","„en” infinitif előtt, a számmal."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p08 – Six rappels mélangés"}}],"items":[
{"id":"w01-u-2-1-i07-s001","capability":"CAP-typed-short","variant":"PV-typed-short","instruction":"Pour les phrases 1 à 5, écrivez seulement la forme qui manque («\u00a0du\u00a0», «\u00a0de la\u00a0», «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0»). Pour la phrase 6, remplacez le complément de quantité par «\u00a0en\u00a0» et écrivez la phrase complète.","prompt":"Dimanche, 10 h 40. Vous préparez des tartines pour le brunch. Camille\u00a0: «\u00a0Et sur celles de Léo, tu mets quoi\u00a0?\u00a0» Toi\u00a0: «\u00a0Il adore le sucré\u00a0: je mets ___ miel.\u00a0»","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"du","alternatives":["du miel"],"rejected":[{"text":"de","feedbackRef":"U21-I07-S001-E01"},{"text":"le","feedbackRef":"U21-I07-S001-E02"},{"text":"de la","feedbackRef":"U21-I07-S001-E03"},{"text":"un","feedbackRef":"U21-I07-S001-E04"},{"text":"des","feedbackRef":"U21-I07-S001-E05"},{"text":"beaucoup de","feedbackRef":"U21-I07-S001-F01"},{"text":"un peu de","feedbackRef":"U21-I07-S001-F01"},{"text":"plein de","feedbackRef":"U21-I07-S001-F01"},{"text":"pas mal de","feedbackRef":"U21-I07-S001-F01"},{"text":"trop de","feedbackRef":"U21-I07-S001-F01"}]},"feedback":{"correct":"Igen: valamennyi mézet teszel rá → partitív „du”.","incorrect":"Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll a „miel” előtt, ha valamennyit teszel rá?","targeted":[{"id":"U21-I07-S001-E01","text":"Állító mondatban, mennyiségszó nélkül a „de” nem elég: valamennyi méz → „du miel”."},{"id":"U21-I07-S001-E02","text":"Nem egy meghatározott mézről beszélsz, hanem arról, hogy valamennyit teszel rá: „du”."},{"id":"U21-I07-S001-E03","text":"A „miel” hímnemű: „du miel”."},{"id":"U21-I07-S001-E04","text":"A méz anyagnév, nem darab: valamennyit teszel rá → „du”."},{"id":"U21-I07-S001-E05","text":"A „miel” egyes számú anyagnév: valamennyi méz → „du miel”."},{"id":"U21-I07-S001-F01","trigger":"mennyiségszó","text":"Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: „du”, „de la”, „de”, „d’” vagy „des”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-det-partitive-mass"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i07-s001"}},
{"id":"w01-u-2-1-i07-s002","capability":"CAP-typed-short","variant":"PV-typed-short","instruction":"Pour les phrases 1 à 5, écrivez seulement la forme qui manque («\u00a0du\u00a0», «\u00a0de la\u00a0», «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0»). Pour la phrase 6, remplacez le complément de quantité par «\u00a0en\u00a0» et écrivez la phrase complète.","prompt":"Dimanche, 8 h 25. Camille a dormi chez ses parents. Elle t’écrit\u00a0: «\u00a0J’arrive en métro\u00a0!\u00a0» Tu l’attends à la sortie ___ métro Croix-Rousse.","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"du","alternatives":["du métro"],"rejected":[{"text":"de","feedbackRef":"U21-I07-S002-E01"},{"text":"de la","feedbackRef":"U21-I07-S002-E02"},{"text":"des","feedbackRef":"U21-I07-S002-E03"}]},"feedback":{"correct":"Igen: „la sortie de” + „le métro” → „du”.","incorrect":"Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: „la sortie de” + „le métro” → ?","targeted":[{"id":"U21-I07-S002-E01","text":"Itt egy konkrét állomás kijáratáról van szó („le métro Croix-Rousse”): „la sortie de” + „le métro” → „du”."},{"id":"U21-I07-S002-E02","text":"A „métro” hímnemű: „du métro”."},{"id":"U21-I07-S002-E03","text":"Egy állomásról van szó: „de + le = du”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-det-semantic-contrast"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i07-s002"}},
{"id":"w01-u-2-1-i07-s003","capability":"CAP-typed-short","variant":"PV-typed-short","instruction":"Pour les phrases 1 à 5, écrivez seulement la forme qui manque («\u00a0du\u00a0», «\u00a0de la\u00a0», «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0»). Pour la phrase 6, remplacez le complément de quantité par «\u00a0en\u00a0» et écrivez la phrase complète.","prompt":"Samedi soir, sur le site du Pain Perché, rubrique «\u00a0Notre maison\u00a0»\u00a0: «\u00a0Chaque samedi, nous cuisons ___ immenses tourtes de seigle, vendues à la coupe.\u00a0»","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"d'","alternatives":["d’immenses","d’immenses tourtes"],"rejected":[{"text":"des","feedbackRef":"U21-I07-S003-E01"},{"text":"de","feedbackRef":"U21-I07-S003-E02"},{"text":"les","feedbackRef":"U21-I07-S003-E03"},{"text":"du","feedbackRef":"U21-I07-S003-E04"},{"text":"de la","feedbackRef":"U21-I07-S003-E04"},{"text":"nos","feedbackRef":"U21-I07-S003-F01"},{"text":"ces","feedbackRef":"U21-I07-S003-F01"},{"text":"quelques","feedbackRef":"U21-I07-S003-F01"},{"text":"plusieurs","feedbackRef":"U21-I07-S003-F01"}]},"feedback":{"correct":"Igen: gondozott szövegben elöl álló, magánhangzós melléknév előtt „d’” áll: „d’immenses tourtes”.","incorrect":"Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll gondozott szövegben az elöl álló, magánhangzós melléknév előtt?","targeted":[{"id":"U21-I07-S003-E01","text":"Gondozott bemutatkozó szövegben elöl álló melléknév előtt „d’” áll: „d’immenses tourtes”."},{"id":"U21-I07-S003-E02","text":"Magánhangzó előtt elízió: „d’immenses”."},{"id":"U21-I07-S003-E03","text":"A szöveg a kínálatot mutatja be, nem ismert tourte-okra utal: „d’”."},{"id":"U21-I07-S003-E04","text":"A „tourtes” többes számú: egyes számú „du” vagy „de la” nem állhat előtte. Elöl álló melléknév előtt: „d’”."},{"id":"U21-I07-S003-F01","trigger":"determináns vagy számnév","text":"Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: „du”, „de la”, „de”, „d’” vagy „des”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-de-adjective-standard"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i07-s003"}},
{"id":"w01-u-2-1-i07-s004","capability":"CAP-typed-short","variant":"PV-typed-short","instruction":"Pour les phrases 1 à 5, écrivez seulement la forme qui manque («\u00a0du\u00a0», «\u00a0de la\u00a0», «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0»). Pour la phrase 6, remplacez le complément de quantité par «\u00a0en\u00a0» et écrivez la phrase complète.","prompt":"Dimanche, 8 h 45. Sous la rubrique «\u00a0Petits pains\u00a0» de l’ardoise, la boulangère a ajouté à la craie\u00a0: «\u00a0Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds\u00a0!\u00a0»","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"des","alternatives":["des petits pains"],"rejected":[{"text":"de","reason":"Feltételes szabály: a de elutasítása a 0.3 kaputól függ (lásd az 1. részt).","feedbackRef":"U21-I07-S004-E01"},{"text":"les","feedbackRef":"U21-I07-S004-E02"},{"text":"du","feedbackRef":"U21-I07-S004-E03"},{"text":"de la","feedbackRef":"U21-I07-S004-E03"},{"text":"d'","feedbackRef":"U21-I07-S004-E04"},{"text":"nos","feedbackRef":"U21-I07-S004-F01"},{"text":"ces","feedbackRef":"U21-I07-S004-F01"},{"text":"quelques","feedbackRef":"U21-I07-S004-F01"},{"text":"plusieurs","feedbackRef":"U21-I07-S004-F01"},{"text":"beaucoup de","feedbackRef":"U21-I07-S004-F01"}]},"feedback":{"correct":"Igen: a „petits pains” termékfajta neve, ezért a táblára írt mondatban is „des” marad: „des petits pains aux noix”.","incorrect":"Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll a „petits pains” termék neve előtt?","targeted":[{"id":"U21-I07-S004-E01","text":"A „petits pains” itt a tábla egyik termékfajtájának a neve (Petits pains rovat). Az ilyen összeforrt kifejezések előtt a „des” marad: „des petits pains”."},{"id":"U21-I07-S004-E02","text":"Új termék bejelentése, nem ismert csoport: nem határozott névelő."},{"id":"U21-I07-S004-E03","text":"A „petits pains” többes számú: „des”."},{"id":"U21-I07-S004-E04","text":"A „petits” mássalhangzóval kezdődik, itt nincs elízió. A termék neve előtt „des” áll."},{"id":"U21-I07-S004-F01","trigger":"determináns, számnév vagy mennyiségszó","text":"Ez franciául helyes lehet, de az 1–5. mondatban a megadott alakok közül írj egyet: „du”, „de la”, „de”, „d’” vagy „des”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-de-adjective-standard"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i07-s004"}},
{"id":"w01-u-2-1-i07-s005","capability":"CAP-typed-short","variant":"PV-typed-short","instruction":"Pour les phrases 1 à 5, écrivez seulement la forme qui manque («\u00a0du\u00a0», «\u00a0de la\u00a0», «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0»). Pour la phrase 6, remplacez le complément de quantité par «\u00a0en\u00a0» et écrivez la phrase complète.","prompt":"Samedi soir, même rubrique «\u00a0Notre maison\u00a0»\u00a0: «\u00a0Notre boutique est minuscule, mais nous proposons chaque jour beaucoup ___ variétés de pain.\u00a0»","response":{"type":"text","lines":"single"},"solution":{"type":"exact","key":"de","alternatives":["de variétés"],"rejected":[{"text":"des","feedbackRef":"U21-I07-S005-E01"},{"text":"d'","feedbackRef":"U21-I07-S005-E02"},{"text":"du","feedbackRef":"U21-I07-S005-E03"},{"text":"de la","feedbackRef":"U21-I07-S005-E03"}]},"feedback":{"correct":"Igen: nyitott mennyiség, megnevezett csoport nélkül → „beaucoup de”.","incorrect":"Ez nem a várt alak. Válassz a „du”, „de la”, „de”, „d’”, „des” közül: mi áll a „beaucoup” után, ha nincs megnevezett csoport?","targeted":[{"id":"U21-I07-S005-E01","text":"A „variétés de pain” nem egy megnevezett, határozott csoport: nyitott mennyiség → „beaucoup de”."},{"id":"U21-I07-S005-E02","text":"A „variétés” mássalhangzóval kezdődik: „de”."},{"id":"U21-I07-S005-E03","text":"A „beaucoup” után mennyiségjelzőként „de” áll, nem névelő: „beaucoup de variétés”."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-de-quantity"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i07-s005"}},
{"id":"w01-u-2-1-i07-s006","capability":"CAP-transformation","variant":"PV-transform-sentence","instruction":"Pour les phrases 1 à 5, écrivez seulement la forme qui manque («\u00a0du\u00a0», «\u00a0de la\u00a0», «\u00a0de\u00a0», «\u00a0d’\u00a0» ou «\u00a0des\u00a0»). Pour la phrase 6, remplacez le complément de quantité par «\u00a0en\u00a0» et écrivez la phrase complète.","prompt":"Dimanche, 8 h 45. La boulangère\u00a0: «\u00a0Le flan, c’est à la part. Combien de parts\u00a0?\u00a0» Tu réponds\u00a0: Je vais prendre trois parts de flan.","response":{"type":"text","lines":"single","normalization":{"numbersFr":true}},"solution":{"type":"exact","key":"Je vais en prendre trois.","alternatives":["Je vais vous en prendre trois.","Je vais en prendre trois, s’il vous plaît.","Je vais vous en prendre trois, s’il vous plaît.","Je vais en prendre trois parts.","Je vais vous en prendre trois parts."],"rejected":[{"text":"J’en vais prendre trois.","feedbackRef":"U21-I07-S006-E01"},{"text":"Je vais prendre en trois.","feedbackRef":"U21-I07-S006-E02"},{"text":"Je vais en prendre trois parts de flan.","feedbackRef":"U21-I07-S006-E03"},{"text":"Je vais en prendre.","feedbackRef":"U21-I07-S006-E04"},{"text":"J’en prends trois.","reason":"nem a kért művelet","feedbackRef":"U21-I07-S006-F01"},{"text":"J’en veux trois.","reason":"nem a kért művelet","feedbackRef":"U21-I07-S006-F01"}]},"feedback":{"correct":"Igen: az „en” az infinitif elé került, a szám megmaradt: „je vais en prendre trois”.","incorrect":"Ez a mondat nem egyezik a várt átalakítással. Ellenőrizd: az infinitif elé került-e az „en”, és megmaradt-e a szám? Ha más igével írtál helyes mondatot, az nem hiba, de itt a kiinduló mondat igéjével kell átalakítanod.","targeted":[{"id":"U21-I07-S006-E01","text":"Az „en” az infinitif elé kerül: „je vais en prendre trois”."},{"id":"U21-I07-S006-E02","text":"Az „en” nem a szám elé, hanem az infinitif elé kerül."},{"id":"U21-I07-S006-E03","text":"Az „en” már helyettesíti a „de flan”-t; ne ismételd meg: „je vais en prendre trois”."},{"id":"U21-I07-S006-E04","text":"A szám megmarad: „trois”."},{"id":"U21-I07-S006-N01","trigger":"…trois parts","text":"Helyes: itt az „en” a „de flan”-t veszi át, a „trois parts” a mennyiség. A rövidebb, gyakoribb forma: „je vais en prendre trois”."},{"id":"U21-I07-S006-F01","trigger":"J’en prends trois. / J’en veux trois.","text":"Ez helyes francia mondat, de nem a kért átalakítás: a kiinduló mondatban „je vais + infinitif” áll. Tartsd meg ezt a szerkezetet, és csak a bővítményt cseréld „en”-re. Hova kerül ilyenkor az „en”? Próbáld újra."}]},"evaluation":{"mode":"exact","scoring":"formative-required"},"targetRefs":["w01-g-en-position-finite-infinitive","w01-g-en-quantity-retention"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i07-s006"}}
]},
{"id":"w01-u-2-1-p09","template":"PAGE-writing","variant":"PV-writing-short","title":"Production guidée : la réponse à Léo","instruction":"Écrivez un court message cohérent de 6 à 8 phrases.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p09 – Production guidée : la réponse à Léo"},"content":[{"type":"text","role":"lesson","title":"Avant d’écrire","language":"hu","text":"Ez a záróprodukció. Nem kulcsszavakat kell felsorolnod, hanem egy valódi üzenetet kell írnod, amelyben a blokk kontrasztjai jelentés szerint, a helyükön állnak. Barátnak írt üzenetben is természetes a „de bons…”, „de beaux…”, „de grosses…”: a gyakori, rövid melléknevekkel a „de” a hétköznapi nyelvben is megmarad.","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p09 – Production guidée : la réponse à Léo"}},{"type":"list","role":"brief","title":"Consigne","language":"fr","entries":["Destinataire\u00a0: Léo, un ami français.","Registre\u00a0: courant et informel, sans argot (SMS, tutoiement).","Objectif\u00a0: dire ce qui est déjà acheté, ce que Léo doit apporter et en quelle quantité, où l’acheter et pourquoi là.","Longueur\u00a0: 6 à 8 phrases liées."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i08"}},{"type":"list","role":"checklist","title":"Contenu du message","language":"fr","entries":["ce que Camille et vous avez déjà acheté\u00a0;","ce que Léo doit apporter, avec la quantité, dont au moins un produit en quantité non précisée (par exemple\u00a0: fromage, jus de fruits)\u00a0;","où l’acheter\u00a0: un lieu qu’on peut nommer avec «\u00a0du\u00a0» (une boutique, un stand ou une boulangerie, par exemple «\u00a0le stand du…\u00a0», «\u00a0la boulangerie du…\u00a0»)\u00a0;","une quantité ouverte ou une foule (au marché, dans la queue, dans le choix proposé)\u00a0;","une partie d’un groupe nommé\u00a0;","pourquoi vous recommandez cet endroit."],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i08"}},{"type":"list","role":"checklist","title":"Avant d’envoyer, vérifiez (critères de langue)","language":"fr","entries":["Y a-t-il un «\u00a0du\u00a0» qui veut dire «\u00a0une certaine quantité\u00a0» (valamennyi) et un autre qui vient de «\u00a0de + le\u00a0»\u00a0? (ex.\u00a0: «\u00a0on boit du rosé au bord du Rhône\u00a0»)","Y a-t-il «\u00a0de / d’\u00a0» + un adjectif placé avant le nom (elöl álló melléknév) + un nom au pluriel\u00a0? (ex.\u00a0: «\u00a0de gros saucissons\u00a0»)","Y a-t-il «\u00a0des petits pains\u00a0»\u00a0?","Y a-t-il «\u00a0beaucoup de\u00a0» pour une quantité ouverte (nyitott mennyiség) et «\u00a0beaucoup des\u00a0» pour une partie d’un groupe nommé (megnevezett csoport)\u00a0? (ex.\u00a0: «\u00a0beaucoup de voyageurs\u00a0» ↔ «\u00a0beaucoup des voyageurs du TGV de 18 h\u00a0»)","Y a-t-il «\u00a0en\u00a0» devant un verbe conjugué (ragozott ige) ou devant l’auxiliaire (segédige)\u00a0? (ex.\u00a0: «\u00a0des glaçons\u00a0? Paul en apporte\u00a0»\u00a0; «\u00a0il en a déjà apporté\u00a0»)","Y a-t-il «\u00a0en\u00a0» devant un infinitif, avec le nombre\u00a0? (ex.\u00a0: «\u00a0des chaises pliantes\u00a0? on va en emprunter cinq aux voisins\u00a0»)"],"manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"### w01-u-2-1-i08"}}],"items":[
{"id":"w01-u-2-1-i08","capability":"CAP-writing","variant":"PV-writing-short","instruction":"Répondez à Léo en 6 à 8 phrases\u00a0: dites-lui ce que Camille et vous avez déjà acheté, ce qu’il doit apporter (et combien), où l’acheter et pourquoi.","prompt":"Dimanche, 10 h 15. Léo t’écrit\u00a0: «\u00a0Je pars de chez moi\u00a0! Je passe par le marché de la Croix-Rousse\u00a0: il vous manque quelque chose pour le brunch\u00a0?\u00a0»","response":{"type":"text","lines":"multi","sentences":{"min":6,"max":8}},"solution":{"type":"rubric","criteria":[{"label":"A. Critères de langue (allCriteria)","points":6,"requirements":["1 point par critère si la forme est employée selon son sens, à sa place et sans erreur\u00a0:","un «\u00a0du\u00a0» partitif et un «\u00a0du\u00a0» contracté (de + le)","«\u00a0de / d’\u00a0» + adjectif placé avant le nom (elöl álló melléknév) + nom au pluriel","«\u00a0des petits pains\u00a0»","«\u00a0beaucoup de\u00a0» pour une quantité ouverte (nyitott mennyiség) et «\u00a0beaucoup des\u00a0» pour une partie d’un groupe nommé (megnevezett csoport)","«\u00a0en\u00a0» devant un verbe conjugué (ragozott ige) ou devant l’auxiliaire (segédige), avec un antécédent exprimé","«\u00a0en\u00a0» devant un infinitif, avec le nombre"]},{"label":"B. Contenu","points":6,"requirements":["ce que Camille et vous avez déjà acheté","ce que Léo doit apporter et en quelle quantité, avec au moins un produit en quantité non précisée","où l’acheter (un lieu qu’on peut nommer avec «\u00a0du\u00a0»)","une quantité ouverte ou une foule («\u00a0beaucoup de monde\u00a0» suffit)","une partie d’un groupe nommé","pourquoi cet endroit"]},{"label":"C. Message et registre","points":4,"requirements":["Une vraie réponse cohérente à Léo\u00a0; tutoiement\u00a0; registre courant et informel, sans argot\u00a0; 6 à 8 phrases.","Pas de contradiction avec le reste du message ni avec les événements du week-end\u00a0: un produit que le message présente comme déjà acheté n’est pas redemandé sans raison.","«\u00a0Des petits pains\u00a0» peut apparaître comme recommandation ou comme demande justifiée."]},{"label":"D. Précision de la langue hors cibles","points":4,"requirements":["Message compréhensible, peu d’erreurs hors cibles\u00a0; typographie française."]},{"label":"Niveaux","requirements":["Les niveaux s’examinent dans l’ordre\u00a0: le premier niveau atteint décide.","Non atteint\u00a0: A ≤ 3, ou C = 0.","Excellent\u00a0: A = 6, B ≥ 5, C ≥ 3, D ≥ 3.","Atteint\u00a0: A = 6, B ≥ 4, C ≥ 2.","Partiel\u00a0: tous les autres cas."]}],"notSufficient":["la simple énumération des six structures","«\u00a0en\u00a0» sans antécédent exprimé","«\u00a0beaucoup des\u00a0» sans groupe nommé","«\u00a0de petits pains\u00a0» quand il s’agit du nom du produit","la forme obligatoire est là, mais dans une mauvaise fonction"]},"feedback":{"targeted":[{"id":"U21-I08-E01","text":"Egy kötelező szerkezet hiányzik, vagy nem a jelentésének megfelelő helyen áll. Nézd meg újra a hat ellenőrzőkérdést."},{"id":"U21-I08-E02","text":"Az „en” előtt nevezd meg, mire utal (pl. „on n’a plus d’œufs\u00a0: tu peux en prendre six\u00a0?”)."},{"id":"U21-I08-E03","text":"A „beaucoup des” után nevezd meg a csoportot (pl. „beaucoup des habitués du quartier”)."},{"id":"U21-I08-E04","text":"Ez még nem üzenet Léónak. Kösd össze a mondatokat: mi van meg, mit hozzon, honnan és miért."},{"id":"U21-I08-E05","text":"Az üzeneted szerint ezt már megvettétek. Kérj valami mást, vagy írd meg, miért kell még."}]},"evaluation":{"mode":"dual-gate","aiAdvisoryOnly":true,"scoring":"formative-required"},"targetRefs":["w01-g-integrated-writing","w01-g-de-quantity-subset"],"manuscriptRef":{"file":"w01-u-2-1.megoldas.md","anchor":"## w01-u-2-1-i08 (`-s001`)"}}
]},
{"id":"w01-u-2-1-p09b","template":"PAGE-writing","variant":"PV-writing-short","title":"Production guidée : la réponse à Léo","visibleAfter":"w01-u-2-1-i08","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"## p09 – Production guidée : la réponse à Léo"},"content":[{"type":"model","id":"w01-u-2-1-model-a","title":"Modèle A – recommandation enthousiaste","language":"fr","declaredWords":121,"text":"Oui, merci, tu es un amour\u00a0! Côté boulangerie, on a tout\u00a0: au Pain Perché, on a pris une tradition, du seigle et des viennoiseries, il y en a largement pour trois. Par contre, on n’a plus d’œufs pour les œufs brouillés\u00a0: tu peux en prendre six au marché\u00a0? Va chez la productrice à côté du kiosque, celle qui vend aussi de beaux fromages de chèvre\u00a0: ses œufs sont extra. Il y a toujours beaucoup de monde le dimanche, mais beaucoup des producteurs du boulevard prennent la carte maintenant\u00a0: pas besoin de passer au distributeur. Si tu vois du jus d’orange pressé, prends-en une bouteille. Et si tu as encore faim, la boulangerie du boulevard fait des petits pains aux figues incroyables\u00a0!","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"#### p09b – Modèle A – recommandation enthousiaste (a beadás után látható) [szöveg változatlan]"}},{"type":"model","id":"w01-u-2-1-model-b","title":"Modèle B – «\u00a0oui, mais…\u00a0» prudent","language":"fr","declaredWords":100,"text":"Oui, mais pas de pain ni de viennoiseries\u00a0: avec Camille, on en a acheté pour dix\u00a0! Ce qui nous manque, c’est du fromage. Va au stand du fromager, tout au bout du marché, même s’il y a la queue\u00a0: il a de bons chèvres frais et il te fait goûter. Tu peux en prendre deux\u00a0? Il y a beaucoup de fromagers sur le boulevard, mais beaucoup des habitués du quartier ne jurent que par lui. Et évite la boulangerie du coin de la rue\u00a0: elle fait des petits pains aux olives à tomber, tu vas craquer. À tout de suite\u00a0!","manuscriptRef":{"file":"w01-u-2-1.kezirat.md","anchor":"#### p09b – Modèle B – « oui, mais… » prudent (a beadás után látható) [szöveg változatlan]"}}],"items":[]}
],
"completion":{"mode":"all-items","requiredRefs":["w01-u-2-1-i01","w01-u-2-1-i02","w01-u-2-1-i03","w01-u-2-1-i04","w01-u-2-1-i05-s001","w01-u-2-1-i05-s002","w01-u-2-1-i05-s003","w01-u-2-1-i05-s004","w01-u-2-1-i06","w01-u-2-1-i07-s001","w01-u-2-1-i07-s002","w01-u-2-1-i07-s003","w01-u-2-1-i07-s004","w01-u-2-1-i07-s005","w01-u-2-1-i07-s006","w01-u-2-1-i08"]}
}
BLOKK_JSON_VEGE

GEPI_OSSZEGZES
status: DRAFT_FOR_REVIEW
GEPI_OSSZEGZES_VEGE