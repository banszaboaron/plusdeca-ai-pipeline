# NyE-recheck: U21 (w01-u-2-1), Megoldás 9. változat

## Szerep, bemenet, hatókör

**Szerep:** nyelvhelyességi ellenőr (NyE), recheck.

**Bemenet:** a Megoldás 9. változata, benne a TANULOI_NEZET és a BLOKK_JSON tanulói szövegei bájtra. Összevetési alap: a 7. változatról szóló saját jelentésem, az eszkaláció utáni befagyasztott kézirat és a PRESIDENT V- és M-döntése.

**Hatókör:** a francia szöveg és a magyar magyarázó szöveg nyelvhelyessége, jelentése, kollokációja és regisztere, valamint az elfogadott alternatívák teljessége.

**Amit tételesen vizsgáltam:**
- p01, *Le décor* és *Vos objectifs*;
- p02, *Exemples*, 3. sor;
- p04, a szabály és az *À comparer* sorai;
- p05, *À comparer*;
- p07, helyzetleírás;
- p08, *Rappel*;
- p09, *Consigne*, *Contenu du message*, *Avant d’envoyer* és a hat mikropélda;
- i01–i08, az összes utasítás és helyzetmondat;
- az i03 és az s004 V-döntés szerinti kulcsa és N01-je;
- az i05-s001–s004 és az s006 teljes alternatívalistája (47/27/23/54/11);
- az i08 francia rubrikája (A–D, *Remarque*, *Niveaux*, *Ne suffit pas*);
- a teljes magyar feedback a magázó átírás után.

**Nem vizsgáltam, mert más hatáskör:**
- NBSP és tipográfia: HE;
- az alternatívák mezőhöz kötése (`de (2)`, MO-T27-10) és az 1:1 egyezés: NavE és CEO;
- az E-12 és E-13 didaktikai kérdése: UE és PE.

**Források:** webes forrást nem nyitottam meg (NEM VIZSGÁLT). Az ítéletek a bevett francia normára épülnek (Grevisse-féle *de* + elöl álló melléknév szabály, lexikalizált összetételek kivétele). A *de* / *des petits pains* kérdést a PRESIDENT V-döntése zárja le, erről nem döntök.

## Kulcs nélküli próba

A változott itemeket a tanulói nézetből oldottam meg: i03, s004, i05 1–4, s006 és i08. A kulcsaim egyeznek a megoldáséval.
- Az i03 2. mezőjében és az s004-ben a *des* és a *de* is helyes. A V-döntés szerint mindkettő elfogadott, így nem marad helyes válasz elutasítva.
- Tipikus udvarias tanulói válaszok, mind elfogadottak:
  - *Oui, merci, j’en prends.*
  - *Merci, je n’en veux pas.*
  - *Bonjour, excusez-moi, nous en avons acheté trois.*
  - *Je vais en prendre trois, merci.*
- Nem elfogadott, pedig természetes: *Avec plaisir, je vais en prendre deux.* és *On vous en a pris trois.* Lásd: NyE-05.

## Korábbi findingok

| ID | Súly | Státusz | Indoklás |
|---|---|---|---|
| NyE-01 | MAJOR (feltételes) | **FIXED** (marad) | A bevezető × mag × záró szorzat továbbra is tételesen ki van írva. A darabszámok egyeznek a felsorolással: 47, 27, 23, 54 és 11. Nyelvileg hibás alakot nem találtam az új sorokban. A *merci*-kettőzés kizárása következetes. |
| NyE-02 | MINOR | **FIXED** | A tanulói *Consigne* és a rubrika C területe ugyanazt mondja: *informel et amical, sans argot (SMS, tutoiement)*. Helyes és természetes. |
| NyE-04 | MINOR | **FIXED** | A *quantité indéterminée* és a *groupe précis* egységes a p05 *À comparer* soraiban, a p09 *Contenu* 4–5. elemében, az *Avant d’envoyer* 4. kérdésében, a rubrika A(4), B(4) és B(5) sorában, és a *Ne suffit pas* 3. sorában is (*« beaucoup des » sans groupe précis*). |
| NyE-05 | MINOR | **PARTIALLY FIXED** | **(a) Bevezető:** az *Oui, merci,* és a *Merci,* bekerült az s001 és az s002 készletébe, a *merci*-kettőzés szabályával együtt. Ez a rész kész. Az *Avec plaisir,* továbbra is hiányzik. Az *Avec plaisir, j’en prends.* és az *Avec plaisir, je vais en prendre deux.* bevett elfogadó formula a pultnál, és a mért szerkezet ép. **(b) Az i05-4 magkészlete változatlanul hiányos.** Bent van a *Nous vous en avons pris trois*, de hiányzik az *On vous en a pris trois*. Bent van a *Nous en avons acheté trois parts*, de hiányzik a *Nous vous en avons acheté trois parts*, a *Nous en avons pris trois parts*, a *Nous en avions pris trois* és a *Nous vous en avions acheté trois*. Mivel az új bevezetők (*Excusez-moi*, *Pardon*, *Bonjour*, *Bonjour, excusez-moi*) a 11 magot szorozzák, minden hiányzó mag ötszörösen hiányzik. **Javaslat:** az i05-4 magjait egyetlen szabályból kell képezni: alany (*nous*/*on*) × ±*vous* × igeidő (*passé composé*/*plus-que-parfait*) × ige (*acheter*/*prendre*) × szám (*trois*/*trois parts*), a meglévő N01/N04/N05 kategóriákkal. Az s001 és az s002 bevezetőkészletébe kerüljön be az *Avec plaisir,*. Ez nem MAJOR, mert a semleges `incorrect` szöveg utolsó mondata kezeli az udvariassági toldást, de az *On vous en a pris trois* ép, mért szerkezetű mondat, és indokolatlanul nem egyezik. |

## Új finding

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-06 | MINOR | i03 `feedback.correct` (U21-I03-OK); kisebb részben az s004-E03 | **(1) Az i03 OK-feedbackje pontatlan.** A szöveg: „A „petits pains” viszont terméknév: előtte a „des petits pains” gyakori…”. Így a mondat azt állítja, hogy a *petits pains* előtt a *des petits pains* áll. A determinánsról kell beszélnie, nem a teljes szerkezetről. **(2) Az s004-E03 kiváltója** a *du* / *de la*. A feedback („A „petits pains” többes számú: „des”.”) a V-döntés után egyetlen helyes alaknak mutatja a *des*-t, pedig a *de* is elfogadott. | **(1)** A párhuzamos s004 OK-feedback helyesen fogalmaz: „a „petits pains” terméknév, előtte a „des” gyakori”. **(2)** Az i03-E06 és az s004-E04 már „„des” vagy „de””-t mond, így az E03 ezekkel nem egyezik. | **(1)** „…A „petits pains” viszont terméknév: előtte a „des” gyakori („des petits pains”), de gondozott írásban a „de” is helyes („de petits pains”).” **(2)** „A „petits pains” többes számú: „des” (gondozott írásban „de” is).” Változástípus: csak feedbackszöveg. Recheck: NyE. |

## Nyelvileg rendben (megerősítem)

- **p01 *Le décor*:** *vient bruncher chez vous*, *tout au long de la matinée*, *Quand vous dites « nous », c’est Camille et vous.* Mind helyes és természetes. A *tout au long de la matinée* pontosabb, mint az elvetett *en même temps*.
- **p01 *Vos objectifs*:** a négy pont helyes. A 2. pontban az *et* előtti vessző nem hiba, csak stílus.
- **p02 *Exemples*, 3. sor:** *Camille se souvient du serveur : il connaît tout le quartier.* A *se souvenir de + le* szerkezet ép.
- **p04:**
  - a magyar szabály pontos, és összhangban van a V-döntéssel;
  - az *À comparer* 2. címkéje (*✓ correct ; « des petits pains » aussi (nom de produit)*) helyes, és ugyanazt állítja, mint a note.
- **i01–i08 utasításai:** mind helyesek.
  - Az i08-ban a *ce que Camille et vous avez déjà acheté* egyeztetése szabályos.
  - Az i07-ben az *écrivez seulement la forme qui manque (« du », … )* és a *remplacez le complément de quantité par « en »* helyes, és azonos az i05 műveletnevével.
- **Helyzetmondatok:** a magázó változatok (*Vous acceptez*, *Vous répondez*, *Vous refusez*, *vous expliquez poliment*, *Elle vous écrit*, *Léo vous écrit*) nem változtatják a kért beszédaktust. A szereplők közti tegezés (*tu mets quoi ?*, *que tu m’as conseillé*, *t’inquiète*) természetes, és jó helyen maradt.
- **p09 mikropéldák:** természetesek és idiomatikusak. Az *on boit du rosé au bord du Rhône*, a *de gros saucissons*, a *beaucoup des voyageurs du TGV de 18 h*, a *des glaçons ? Paul en apporte*, az *il en a déjà apporté* és a *des chaises pliantes ? On va en emprunter cinq aux voisins* is megfelel ennek. Mindegyik a célzott szerkezetet mutatja.
- **i08 francia rubrika:** minden sor helyes, ide értve az A(3) sort (*« des petits pains » ou « de petits pains »*), a B(2) sort (*avec une quantité précise / sans quantité précise*) és a C területen a *petits pains* mondatát. A *Ne suffit pas* négy sora is rendben van; a *de petits pains* sor törlése a V-döntés szerint helyes.
- **N01-szövegek (i03, s004):** a tartalmuk pontos és egyezik a p04 szabályával. A „helyes” háromszori ismétlése stílus, nem hiba.
- **Magyar feedback, magázó átírás:**
  - az igealakok hibátlanok: „Ellenőrizze”, „Válasszon”, „Próbálja újra”, „Tartsa meg”, „cserélje”, „Jól választott”, „jól látja”, „írta”, „tett”;
  - a toldalékolás „…” idézéssel is hibátlan: „„de”-t”, „„en”-nel”, „„de flan”-t”, „„chouquettes”-et”;
  - jelentésváltozást nem találtam.

## NOTE-ok

- **NOTE-f (stílus, nem kötelező, nyitott):** a *Remarque* sorában a *remplir plusieurs éléments du contenu* kissé laza kollokáció. A *critères* mellett a *remplir* rendben van. Javaslat: *Une même phrase peut couvrir plusieurs éléments du contenu et satisfaire à plusieurs critères de langue.*
- **NOTE-i (stílus):** az i08-E05 „Az üzenete szerint ezt már megvették.” mondata magázó többes számban a „megvették” miatt harmadik személyként is olvasható („ők vették meg”). Egyértelműbb: „Az üzenete szerint ezt Camille-lal már megvették.” Ugyanez a kérdés a tanulói tartalmi listában nem merül fel, mert az francia.
- **NOTE-j (stílus, kézirat):** a p07 helyzetmondatában a *vous avez demandé … si on peut réserver* beszélt nyelvi időegyeztetés. Az irodalmi alak *si on pouvait réserver* lenne. A helyzetleírás regiszterében elfogadható, nem hiba.
- **NOTE-g (UE, változatlan):** a *Non merci, je n’en veux pas, merci* kettőzés. A semleges `incorrect` szöveg utolsó mondata most kezeli.
- **NOTE (NavE):** az MO-T27-10 (`de (2)` a lapos alternatívalistában) leképezési kérdés. Nyelvileg a 2. mezőben a puszta *de* helyes, az 1. mezőben hibás; ez helyesen tükröződik.

## Összegzés

**Verdikt a hatókörömre: REVIEW_PASS.** Nyitott BLOCKER és MAJOR nincs.

| Finding | Súly | Státusz |
|---|---|---|
| NyE-01 | MAJOR | FIXED |
| NyE-02 | MINOR | FIXED |
| NyE-04 | MINOR | FIXED |
| NyE-05 | MINOR | PARTIALLY FIXED: az *Avec plaisir,* bevezető és az i05-4 magkészlete hiányzik |
| NyE-06 | MINOR | új: az i03 OK-feedbackjének megfogalmazása és az s004-E03 igazítása a V-döntéshez |

**Recheck hatóköre:**
- NyE-05: az i05-s001, -s002 és -s004 alternatívalistája; a teljességet a NavE is nézze;
- NyE-06: csak az U21-I03-OK és az U21-I07-S004-E03 szövege.

**Bizonyíték:**
- **Új:**
  - kulcs nélküli próba az i03-on, az s004-en, az i05-ön, az s006-on és az i08-on;
  - az öt alternatívalista soronkénti nyelvi átnézése;
  - a francia rubrika, az új kéziratszövegek és a teljes magázó feedback átnézése.
- **Újrahasznosított:** a 7. változatról szóló jelentésem a változatlan stimulusokra, kulcsokra és modellekre.
- **Webes forrás:** NEM VIZSGÁLT.

**Következő címzett:** CEO.

**Tanulság:** ha egy döntés két alakot tesz helyessé, akkor minden olyan feedbackmondatot is át kell nézni, amely egyetlen alakot nevez meg helyesnek, a hibás alakokhoz írt feedbacket is (itt az s004-E03), nem csak az érintett kulcsot és az OK-szöveget. Javasolt hatókör: minden kulcsváltozás a megoldás fázisában.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 2
GEPI_OSSZEGZES_VEGE