# UE-recheck: U21 (w01-u-2-1, GI2), a megoldás 7. változata, T27 nyelvi kör

**Szerep és megbízás:** UE vagyok, független ellenőr. Ez újraellenőrzés: a korábbi finding-ID-ket megtartottam.

**Bemeneti változat:** a megoldás 7. változata a tanulói nézettel (TANULOI_NEZET), a BLOKK_JSON tanulói szövegei, háttérként a befagyasztott T27-kézirat és a GR-terv 2. változata.

**Hatókör:**
- **Vizsgáltam:** tanulóként megoldható-e, egyértelmű, de nem triviális-e a választás, és segít-e a feedback. Ezen belül:
  - a korábbi U-01–U-03 sorsát;
  - minden változott részt: az i05 és az s006 kibővített elfogadási listáját, az i01 2. mintáját, a p02–p06 sorszámozott kontrasztlistáit, az i08 rubrikáját tanulói szemmel, a tanulói nézetet.
- **Nem minősítettem (hatókörön kívül):**
  - a nyelvhelyességet és a regiszterszót (NyE);
  - a tipográfiát (HE);
  - a rubrika és a lista 1:1 egyezését, valamint a darabszámok gépi egyezését (NavE, CEO-szkript).

**Módszer:**
- A változott itemeket előbb kulcs nélkül oldottam meg. Közben szándékosan olyan udvariassági és bevezető fordulatokkal is próbálkoztam, amilyeneket egy tanuló valószínűleg ír.
- Utána tételesen összevetettem a válaszaimat a JSON `alternatives` és `rejected` listájával, és a kapott feedbacket is megnéztem.
- Ez tanulószimuláció, nem emberi teszt.

---

## Végigjárás (csak a változott és az érintett részek)

| Item | A megoldásom | Mit vettem észre |
|---|---|---|
| p02–p06, kontrasztlisták | – | A francia sorok most „1. … — ✗ incorrect”, a magyar `note` ugyanígy „1. …”. A párosítás sorszám alapján megy, görgetés után is (U-03). |
| i01 | változatlan | A 2. minta „…” idézése olvashatóbb, félreérthetetlen. |
| i05-1 | *Oui, j’en prends, merci.* → elfogadott. *Volontiers, j’en veux bien.* → elfogadott, N05-tel. **Kívül esik:** *Oui, merci, j’en prends.* és *Merci, j’en prends.* | A szorzat (bevezető × mag × záró) 39 eleme hiánytalanul a listában van, kézzel számoltam. Ami a szorzaton kívül esik, az viszont a semleges `incorrect` szöveget kapja (U-04). |
| i05-2 | *Oui, je vais en prendre deux, s’il vous plaît.* → elfogadott. **Kívül esik:** *Oui, merci, je vais en prendre deux.* | 23 alternatíva, hiánytalan. A hiányzó változatnál ugyanaz a gond (U-04). |
| i05-3 | *Non merci, je n’en veux pas.* → elfogadott. **Kívül esik:** *Merci, je n’en veux pas.* és *Non merci, je n’en veux pas, merci.* (MO-T27-07) | 20 alternatíva, hiánytalan. A kettőzés ritka, a „Merci, …” bevezető nem. |
| i05-4 | *Nous en avons acheté trois.* → kulcs. **Kívül esik:** *Excusez-moi, nous en avons acheté trois.* és *Bonjour, nous en avons acheté trois.* | A helyzetmondat kifejezetten ezt kéri: *tu expliques **poliment** à la boulangère*. Ez szinte felkínálja az *Excusez-moi,* / *Pardon,* bevezetőt, a megoldás 1. része mégis kizárja a bevezetőt („nincs”) (U-04). |
| i06 | változatlan | Rendben. |
| i07 s001–s005 | *du, du, d’, des, de* | A p08 *Rappel* listája szóról szóra változatlan, a hat célalakot továbbra is az itemek sorrendjében hozza. Az s003–s005 most is a listából olvasható le (U-01). |
| i07 s006 | *Je vais en prendre trois, merci.* → elfogadott | Az elfogadási lista jó. A JSON-promptban viszont továbbra sincs sorszám. A TANULOI_NEZET 1–6. számozása csak feltételezi, hogy a megjelenítő számoz (U-02). |
| i08 | üzenetet írtam | A tanulói szöveg nem változott. A rubrika B(2) eleme és a *Remarque* sor megszünteti az ellentmondást a pontos és a nem pontosított mennyiség között. A tanuló ezt azonban előre nem látja: az E-14 nyitott, ezért ide nem írok új findingot. |

---

## A korábbi findingok sorsa

| ID | Súly | Státusz | Indok |
|---|---|---|---|
| U-01 | MAJOR | **OPEN** | A megoldásíró a javítást E-12-ként a blokkírónak utalta vissza. A BLOKK_JSON p08 list#1 eleme bájtra a régi: partitív „du” → „de + le” → „d’ …” → „des petits pains” → „beaucoup de” → „en” infinitif előtt, vagyis pontosan az s001–s006 sorrendje. Az i07 diszkriminációja (*Les six phrases ne testent pas toutes la même règle*) így továbbra is megkerülhető. A javaslatom nem változott: a lista döntéspárokat nevezzen meg, az itemektől eltérő sorrendben. **Recheck:** UE, PE. |
| U-02 | MINOR | **OPEN** | Az ügy E-13-ként a CEO-hoz került. Az s006 promptja most is így kezdődik: *Dimanche, 8 h 45. La boulangère : …*, sorszám nélkül. A tanulói nézet zárójeles megjegyzése szerint a számozás „feltételezett”, tehát nincs igazolva. |
| U-03 | MINOR | **FIXED** | A p02–p06 minden *À comparer* és *Contre-exemples* sora sorszámot kapott, és ez egyezik a magyar `note` sorszámával (például p06 list#4: „1. Elle va commander en six. — ✗ incorrect” ↔ text#5: „1. Az „en” az infinitif elé kerül.”). A párosítás most görgetés után is egyértelmű. |
| (megjegyzés a NavE-nek: a rubrika A területe 7 elemű) | – | rendben | A `criteria[0].requirements` most pontosan hat elemű, a bevezető mondat átkerült a címkébe. |

---

## Új finding

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| U-04 | MINOR | i05-s001–s004 (`alternatives`, `feedback.incorrect`); s006 | **1. A lista nem fed le minden valószínű helyes választ.** A szorzat pontosan kiírt, de a bevezetők köre szűkebb annál, amit egy tanuló ír. Kimaradt a *Oui, merci,* / *Merci,* (i05-1, i05-2, i05-3), és az i05-4-ben minden bevezető. Pedig ott a helyzetmondat maga kér udvariasságot: *tu expliques poliment*, ami *Excusez-moi,* / *Pardon,* / *Bonjour,* kezdést hív elő. **2. A feedback félrevezet.** Ép mért szerkezetű válaszra a semleges `incorrect` szöveg jelenik meg. Ez szerkezeti hibát sugall („jó helyen áll-e az „en”, … megmaradt-e a szám?”), és a tanuló jó *en*-helyet kezd „javítani”. A második próbálkozás után ráadásul a kulcs jelenik meg, mintha hibázott volna. | *Excusez-moi, nous en avons acheté trois.* → nincs az s004 listájában → `incorrect`. *Oui, merci, j’en prends.* → nincs az s001 39 eleme között → `incorrect`. Ugyanígy: *Merci, je n’en veux pas.* (s003), és a kettőzött *Non merci, …, merci* (MO-T27-07). | **(a)** Bővítsd a bevezetőket: i05-1 és i05-2: *Oui, merci,* · *Merci,*; i05-3: *Merci,*; i05-4: *Excusez-moi,* · *Pardon,* · *Bonjour,* · *Bonjour, excusez-moi,*. A NyE erősítse meg őket, az alternatívák pedig a szorzat szerint, tételesen kerüljenek be. **(b)** A biztonsági háló legyen egy mondat az i05 és az s006 `incorrect` szövegének végén, például: „Ha a mondat elejére vagy végére udvariassági fordulatot (pl. „Excusez-moi”, „merci”) tettél, hagyd el, és próbáld újra a puszta átalakítással.” Így a lista szűkebb maradhat, a feedback mégsem téves. **Recheck:** UE, NyE (természetesség), NavE (darabszám). |

**A hatókörön kívül, súly nélkül:**
- A rubrika terminusai (*quantité indéterminée*, *groupe précis*) és C-regisztere eltér attól, amit a tanuló a p09-ben lát (*quantité ouverte*, *groupe nommé*, *courant et informel*). Ha a rubrika a beadás után megjelenik a tanulónak, az E-10/E-11 lezárásáig ez zavaró. NavE/NyE ügy, a megoldásíró jelölte (MO-T27-06).
- Az i08-ban az E-14-et tanulói szemmel támogatom: a *vérifiez* önellenőrzésnek olvasható, nem kötelező feltételnek.

**Becsült idő (csak becslés):** 35–45 perc, nem változott, belefér a 34–45 perces keretbe.

---

## Összegzés

- **Változáslista:** nincs. Ellenőrként nem módosítottam az anyagot.
- **Findingok:**
  - U-01 (MAJOR): OPEN, kéziratoldali, E-12;
  - U-02 (MINOR): OPEN, E-13, CEO;
  - U-03 (MINOR): FIXED;
  - U-04 (MINOR): új, a megoldásíróé.
- **Hiányok:**
  - Nem tudom, számozza-e a megjelenítő a subitemeket (U-02).
  - Képernyőn nem teszteltem.
  - A motor normalizálását (például a záró írásjel elhagyását) a megoldás 1. része szerint vettem.
- **Bizonyíték:**
  - **Új:** kulcs nélküli megoldás a változott itemeken; az i05 és az s006 alternatíváinak tételes, kézi leszámolása (39/23/20/10/11, egyezik); valószínű tanulói válaszváltozatok próbája a listán; a p08 *Rappel* bájtra történő összevetése a korábbi állapottal; a kontrasztlisták és a `note` szövegek sorszámainak párosítása.
  - **Újrahasznosított:** a korábbi UE-végigjárás a változatlan itemekre (i02, i03, i04, i06).
  - Webes forrást nem használtam.
- **Verdikt a hatókörömre:** REVISION_REQUIRED, mert az U-01 MAJOR nyitott. A javítás a blokkíróé, az E-12 szerint. Az U-04 a megoldásíróé.
- **Következő címzett:** CEO.

**Tanulság:** ha a stimulus maga kér beszédaktust (*poliment*, *Tu refuses*, *Tu acceptes*), akkor a teljes mondatos item elfogadott bevezetőit ehhez a beszédaktushoz kell igazítani, és az `incorrect` szövegnek az udvariassági toldást is kezelnie kell. Különben az ép szerkezetű válasz szerkezeti hibaként visszhangzik. Javasolt hatókör: minden kötött transzformációs item, amelynek helyzetkerete van.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 2
GEPI_OSSZEGZES_VEGE