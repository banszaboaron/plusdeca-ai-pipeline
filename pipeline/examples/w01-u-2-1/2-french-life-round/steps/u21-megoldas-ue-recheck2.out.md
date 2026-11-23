# UE-recheck: U21 (w01-u-2-1, GI2), a megoldás 8. változata, T27 nyelvi kör

**Szerep és megbízás:** független tanulói nézőpontú ellenőr (UE) vagyok, ez újraellenőrzés. A korábbi finding-ID-ket megtartottam.

**Bemeneti változat:**
- a megoldás 8. változata (a 2. javítás a T27 körben);
- a TANULOI_NEZET és a BLOKK_JSON tanulói szövegei, helyjelöléssel;
- háttérként a befagyasztott T27-kézirat és a GR-terv 2. változata.

**Hatókör:**
- **Vizsgáltam:**
  - az U-01, U-02 és U-04 sorsát;
  - minden változott részt: az i05-s001–s004 bővített bevezetőit és elfogadási listáit, az i05 és az s006 semleges `incorrect` szövegét, valamint a tanulói nézetből törölt szerzői megjegyzést;
  - a változásokkal érintett kapcsolatokat: a kategóriák és a célzott feedback viszonyát, és a retry folyamatot.
- **Nem minősítettem (hatókörön kívül):**
  - az új bevezetők nyelvi természetességét (NyE);
  - a tipográfiát (HE);
  - a darabszámok gépi egyezését (NavE, szkript).
- **Változatlan, nem vizsgáltam újra:** i01–i04, i06, i07-s001–s005, i08. Ezekre a korábbi UE-végigjárásomat használtam.

**Módszer:**
- A változott mezőket előbb kulcs nélkül oldottam meg, a helyzet beszédaktusából kiindulva (*Tu acceptes*, *Et avec ceci ?*, *Tu refuses*, *poliment*, *Combien de parts ?*). Szándékosan valószínű udvariassági toldásokkal is próbálkoztam.
- Utána tételesen összevetettem a válaszaimat a JSON `alternatives` és `rejected` listáival, majd végigkövettem, milyen feedbacket kapok.
- Ez tanulószimuláció, nem emberi teszt.

---

## Végigjárás (változott és érintett részek)

| Item | Az én válaszom → mit kapok | Mit vettem észre |
|---|---|---|
| i05-1 | *Oui, merci, j’en prends.* → elfogadott (alt. [11]). *Merci, j’en veux bien.* → elfogadott (alt. [40]). *Bonjour, oui, j’en prends.* → `incorrect` + az új záró mondat → elhagyom a toldást → *Oui, j’en prends.* → elfogadott. | Kézzel leszámoltam a szorzatot: 13 + 14 + 14 + 6 = 47, egyezik. *Merci*-kettőzés nincs a listában. |
| i05-2 | *Merci, je vais en prendre deux.* → elfogadott (alt. [12]). *Oui, merci, je vais vous en prendre deux.* → elfogadott (alt. [25]). | 2 × 14 − 1 = 27, egyezik. |
| i05-3 | *Merci, je n’en veux pas.* → elfogadott (alt. [7]). *Non merci, je n’en veux pas, merci.* → `incorrect`, az új záró mondat a toldás elhagyására kér → *Non merci, je n’en veux pas.* → elfogadott. | 8 + 9 + 6 = 23, egyezik. A korábbi MO-T27-07 eset most nem vezet félre. |
| i05-4 | *Excusez-moi, nous en avons acheté trois.* → elfogadott (alt. [10]). *Bonjour, excusez-moi, on en a acheté trois.* → elfogadott (alt. [46]). *Bonjour madame, nous en avons acheté trois.* → `incorrect` + záró mondat → elhagyom → kulcs. *Excusez-moi, mais nous en avons acheté trois.* → `incorrect` + záró mondat → az „Excusez-moi”-t elhagyom, de a „mais” bennmarad → *Mais nous en avons acheté trois.* → újra `incorrect` → 2. kísérlet után a kulcs jelenik meg. | 10 + 4 × 11 = 54, egyezik. A *poliment* által kért nyitás most elfogadott. A *Bonjour madame* és a reklamációs *mais* a hálóra marad (lásd lent, NOTE). |
| i05, hibás szerkezet + toldás | *Je prends en, merci.* → nincs pontos `rejected` egyezés, ezért `incorrect` jön. Ennek 1. mondata az „en” helyére, utolsó mondata a toldás elhagyására hívja fel a figyelmet → *Je prends en.* → célzott E01 → *J’en prends.* | A háló abban is segít, hogy a célzott feedbackhez eljussak. |
| s006 | *Je vais en prendre trois, merci.* → elfogadott. *Alors, je vais en prendre trois.* → `incorrect` + záró mondat → elhagyom → kulcs. | 11 alternatíva, változatlan. Az utasítás most kimondja a műveletet: *Pour la phrase 6, remplacez … par « en »*. Ehhez azonban a tanulónak tudnia kell, hogy ez a 6. mondat (U-02). |
| i07, tanulói nézet | – | A szerzői megjegyzés kikerült. A „1.”–„6.” számozás a nézetben továbbra is csak a feltételezett megjelenítést mutatja; a JSON-promptban nincs sorszám. |
| p08 *Rappel* | – | A list#1 bájtra a régi, az elemek pontosan az s001–s006 sorrendjét követik (U-01). |

---

## A korábbi findingok sorsa

| ID | Súly | Státusz | Indok |
|---|---|---|---|
| U-01 | MAJOR | **OPEN** | A p08 list#1 hat eleme változatlan: partitív „du” → „de + le” → „d’” elöl álló melléknév előtt → „des petits pains” → „beaucoup de” → „en” infinitif előtt. Ez pontosan az s001–s006 sorrendje, így a tanuló a listáról olvassa le a választ, nem a jelentés alapján dönt. Az i07 diszkriminációja (*Les six phrases ne testent pas toutes la même règle*) így megkerülhető. A javítás kéziratoldali (E-12, blokkíró), a megoldásíró ebben a körben joggal nem nyúlt hozzá. A javaslatom nem változott: a lista döntéspárokat nevezzen meg, az itemekétől eltérő sorrendben. **Recheck:** UE, PE. |
| U-02 | MINOR | **OPEN** | Az s006 JSON-promptja most is így kezdődik: *Dimanche, 8 h 45. La boulangère : …*, sorszám nélkül. Az i07 utasítása minden subitemen ugyanaz, és „phrase 6”-ra hivatkozik. Ha a megjelenítő nem számoz, a tanuló csak a ___ hiányából következtetheti ki, hogy itt a teljes mondatos átalakítás a feladat. Az ügy E-13-ként a CEO-nál van, nincs igazolva. |
| U-03 | MINOR | **FIXED** (az előző körben lezárva) | Nem változott. |
| U-04 | MINOR | **FIXED** | **(a)** A bevezetők köre a beszédaktushoz igazodik. Az i05-4-ben a *poliment* által kért *Excusez-moi* / *Pardon* / *Bonjour* nyitás elfogadott. A szorzat tételesen és hiánytalanul a JSON-ban áll (47/27/23/54), kettőzés nélkül. **(b)** A semleges `incorrect` szöveg záró mondata már nem sugall szerkezeti hibát ép szerkezetű, de listán kívüli toldásra. A szimulációban a toldás elhagyása után minden esetben elfogadott választ kaptam (*Bonjour madame*, *Alors*, kettőzött *merci*). Egyetlen kivétel a *mais*-es reklamáció (lásd NOTE-1), de ez nem vezet félre. |

## Új finding

Kötelező javítást igénylő új hibát nem találtam.

**Megjegyzések és javaslatok (nem kötelezők, a verdiktbe nem számítanak):**

| ID | Súly | Hely | Megfigyelés | Javaslat |
|---|---|---|---|---|
| U-NOTE-1 | NOTE | i05-s004, `alternatives` (kapcsolódik: MO-T27-08) | Francia boltban a legtermészetesebb nyitás a *Bonjour madame,*. Reklamációban gyakori a *…, mais nous en avons acheté trois* is. Mindkettő a hálóra marad. A *mais* esetén a záró mondat csak az udvariassági fordulatot nevezi meg, a kötőszót nem, így a tanuló egy fölösleges kört futhat. | Ha a NyE megerősíti: a bevezetők közé *Bonjour madame,* és *Bonjour madame, excusez-moi,*. A *mais* kezelése a záró mondatban: „…udvariassági fordulatot vagy kötőszót…”. **Recheck:** NyE, NavE. |
| U-NOTE-2 | NOTE | i05-s001 és s003 `feedback.incorrect` (az érintett, most módosított szöveg) | A közös semleges szöveg a „megmaradt-e a szám?” kérdést az 1. és a 3. mezőben is felteszi, pedig ott nincs szám. Egy bizonytalan tanuló ettől számot tehet a válaszába (*J’en prends un.*). A szöveg ráadásul most négy mondat, ami telefonon hosszú. | Mezőnként rövidebb `incorrect`, amely csak az ott releváns ellenőrzéseket sorolja fel (az s001-ben és az s003-ban a „szám” nélkül). A toldásra vonatkozó mondat maradjon. |
| U-NOTE-3 | NOTE | i05-s001–s004, s006: `alternatives` ↔ N-feedback | A bevezetővel bővült nem célzott alakokhoz (pl. *Excusez-moi, on en a acheté trois.*) a JSON-ban nincs explicit hivatkozás az N01–N05 feedbackre, a kapcsolat csak a leíró `trigger` szövegen keresztül van. Ha a motor nem rendeli hozzá, a tanuló nem kapja meg a célzott megjegyzést. | A CEO-szkript igazolja a hozzárendelést, vagy az `alternatives` kapjon `feedbackRef`-et (MO-F04 (5) folytatása). **NEM VIZSGÁLT:** a motor viselkedését nem láttam. |

**Becsült idő (csak becslés):** 35–45 perc. A változás nem növelte, belefér a 34–45 perces keretbe.

---

## Összegzés

- **Változáslista:** nincs. Ellenőrként nem módosítottam az anyagot.
- **Findingok:**
  - U-01 (MAJOR): OPEN, kéziratoldali (E-12, blokkíró);
  - U-02 (MINOR): OPEN (E-13, előbb a CEO dönt);
  - U-03 (MINOR): FIXED (korábban lezárva);
  - U-04 (MINOR): FIXED;
  - új kötelező finding nincs, 3 NOTE van.
- **Hiányok:**
  - Nem láttam, hogyan párosítja a motor az alternatívákat a célzott N-feedbackkel, és számozza-e a megjelenítő a subitemeket.
  - Képernyőn nem teszteltem.
  - A normalizálást (záró írásjel, NBSP) a megoldás 1. része szerint vettem.
- **Bizonyíték:**
  - **Új:** kulcs nélküli megoldás az i05 mind a négy mezőjén és az s006-on, beszédaktus szerinti toldásokkal; a négy alternatívalista tételes kézi leszámolása (47/27/23/54, egyezik a szorzattal); a retry-folyamat végigkövetése hét listán kívüli válasszal; a p08 list#1 összevetése az előző állapottal (változatlan).
  - **Újrahasznosított:** a korábbi UE-végigjárás a változatlan itemekre (i01–i04, i06, i07-s001–s005, i08).
  - Webes forrást nem használtam.
- **Verdikt a hatókörömre:** REVISION_REQUIRED. Az egyetlen ok az U-01 nyitott MAJOR-ja, amely a blokkíróé (E-12). A megoldásíró ebben a körben hozzá rendelt minden findingot lezárt.
- **Következő címzett:** CEO. Az E-12 a blokkíróhoz, az E-13 a CEO-hoz megy, a NOTE-ok a megoldásírónak és a NyE-nek szólnak.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 1
GEPI_OSSZEGZES_VEGE