# UE-recheck: U21 (w01-u-2-1, GI2), a megoldás 9. változata, T27 nyelvi kör

**Szerep és megbízás:** független tanulói nézőpontú ellenőr (UE) vagyok, ez újraellenőrzés. A korábbi finding-ID-ket megtartottam.

**Bemeneti változat:**
- a megoldás 9. változata;
- a TANULOI_NEZET és a BLOKK_JSON tanulói szövegei, helyjelöléssel;
- háttérként az eszkaláció utáni befagyasztott kézirat és a PRESIDENT M- és V-döntése.

**Hatókör:** megoldhatóság tanulóként, egyértelmű, de nem triviális választás, és a feedback haszna.
- **Teljesen végigjártam:** a p08 *Rappel*-t az i07-tel együtt (U-01); az i07 sorszámait (U-02); a V-döntés miatt változott részeket (i03, s004, i08 A(3)); a magázóvá írt feedbacket minden itemen; az i05 és az s006 listáit szúrópróbaszerűen (U-04).
- **Nem minősítettem:** a magyar és a francia nyelvhelyességet (NyE), a tipográfiát (HE), a darabszámok gépi egyezését (NavE, szkript), és azt, hogyan működik a motor.

---

## Végigjárás

| Item | Az én válaszom → mit kapok | Mit vettem észre |
|---|---|---|
| p08 *Rappel* + i07 | A lista négy döntéspárt ad, ebben a sorrendben: en → beaucoup → du → de/des. Ez nem követi az s001–s006 sorrendjét, a lista alapján egyik mondatnál sem tudom, melyik alakot kell beírni. s001: „miel”, valamennyi → *du*. s002: *la sortie de* + *le métro* → *du*. s003: *immenses*, magánhangzó → *d’*. s004: *petits pains* → *des*. s005: nincs megnevezett csoport → *de*. s006: *Je vais en prendre trois.* | A választáshoz most valóban a jelentés alapján kell dönteni. |
| i07, sorszám | A promptok „1.”–„6.” sorszámmal indulnak, így a „Pour la phrase 6, remplacez…” utasításból egyértelmű, hogy az s006-ban a teljes mondatot kell átalakítani. | Ha a megjelenítő is számoz, kettős számozás („1. 1.”) lehet. Ez az E-13 alá tartozik, a CEO ellenőrzi. |
| i03 | 1. mező: *d’*. 2. mező: először *des* → OK; aztán *de* → N01. *d’* a 2. mezőbe → E06, amely szerint *des* vagy *de* kell. | Az N01 megerősíti a választ, és nem ütközik a p04 szabályával. Lásd az U-05-öt (mezőhöz kötés). |
| s004 | *de* → N01. *du* → E03: „többes számú: des”. *d’* → E04: „des vagy de”. | Az E03 csak a *des*-t nevezi meg, a *de*-t nem. Félre nem vezet, mert a „des” is helyes. |
| i05 1–4, s006 | *Oui, merci, j’en prends.* · *Bonjour, excusez-moi, on en a acheté trois.* · *Je vais en prendre trois, merci.* → mindhárom elfogadott. *Non merci, je n’en veux pas, merci.* → `incorrect` + záró mondat → *Non merci, je n’en veux pas.* → elfogadott. | Változatlan, a magázó helyzetmondatok ugyanazt a beszédaktust kérik. |
| i01 | *1 = partitív, valamennyi kenyér ; 2 = à côté de + le parc* | Az utasítás most kimondja, hogy magyarul is lehet válaszolni. |
| i08 | Az ellenőrzőlista 3. pontja és a rubrika A(3) területe mindkét alakot elfogadja. A *Contenu* és a rubrika terminusai egyeznek (*quantité indéterminée*, *groupe précis*). | Az E05 feedback mondata kétértelmű, lásd az U-06-ot. |
| Feedback, megszólítás | Tegező magyar alakot nem találtam. A „tu” csak szereplői idézetben áll („que tu m’as conseillé”, „tu peux en prendre six ?”). | Az M-döntés a feedbackben is teljesül. |

## A korábbi findingok sorsa

| ID | Súly | Státusz | Indok |
|---|---|---|---|
| U-01 | MAJOR | **FIXED** | A p08 list#1 most négy döntéspár, az itemekétől eltérő sorrendben, és egyik elem sem adja meg mondatonként az alakot. Az i07 választása csak jelentés alapján oldható meg. **PE-recheck** a tartalomra a CEO kiosztása szerint. |
| U-02 | MINOR | **FIXED** | A JSON-promptok „1.”–„6.” sorszámmal indulnak, és az utasítás „phrase 6”-ra mutató hivatkozása így feloldható. Maradék: a kettős számozás kockázata, ez az E-13 alatt a CEO-nál van. |
| U-03 | MINOR | **FIXED** | Korábban lezárva, nem változott. |
| U-04 | MINOR | **FIXED** | A listák és a semleges záró mondat változatlanok, a szúrópróba is rendben volt. |

## Új findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| U-05 | MINOR | i03, `solution.alternatives[4]` = „de (2)” és `[3]` = „de petits pains” | A puszta *de* csak a 2. mezőben helyes, az 1. mezőben hiba (E02). Az alternatívalista lapos, közös a két mezőre, és a „(2)” jelölés csak szöveges megjegyzés. Ha a motor szó szerint egyeztet, a 2. mezőbe írt *de* nem egyezik semmivel. Ekkor a tanuló a semleges `incorrect` szöveget kapja: „Válasszon a „de”, „d’” és „des” közül…”, pedig éppen ezek közül választott helyesen. Ez ellentmond a p04 szabályának és a PRESIDENT döntésének. Ha a motor a jelölést lehántja, de nem köti mezőhöz, akkor az 1. mezőbe írt *de* (*de excellents*) lesz elfogadva. | A JSON-sorok fent; a megoldásíró maga is jelezte (MO-T27-10). A motor viselkedését nem láttam (NEM VIZSGÁLT). | Mezőnként tagolt alternatívák (pl. `f2: ["de", "de petits pains"]`), vagy a CEO-szkript igazolja, hogy a „(2)” jelölés a 2. mezőhöz köt. **Ha az igazolás negatív, a súly MAJOR**, mert helyes válasz kerül elutasításra. Recheck: CEO-szkript, NavE. |
| U-06 | MINOR | i08, U21-I08-E05 | „Az üzenete szerint ezt már megvették.” A tanuló ezt könnyen harmadik személyűnek olvassa („mások megvették”), nem magázó többesnek („Ön és Camille megvették”). Így nem érti, mi a hiba. | `feedback.targeted[4].text` | Személytelen, egyértelmű megfogalmazás, pl. „Az üzenete szerint ez már megvan (Camille-lal már megvették). Kérjen valami mást, vagy írja meg, miért kell még.” Recheck: NyE. |

**Megjegyzések (nem kötelezők, a verdiktbe nem számítanak):**
- **U-NOTE-1:** változatlanul nyitott (*Bonjour madame*, a *mais*-es reklamáció).
- **U-NOTE-2:** változatlanul nyitott. Az s001 és az s003 `incorrect` szövege a „megmaradt-e a szám?” kérdést is felteszi, pedig ott nincs szám; a szöveg négy mondat.
- **U-NOTE-3:** változatlanul nyitott (az N-feedback hozzárendelése, NEM VIZSGÁLT).
- **U-NOTE-4:** az s004 E03 kiegészíthető: „…többes számú: „des” (vagy „de”)”.
- **U-NOTE-5:** a V-döntés után az i03 2. mezője és az s004 csak a *les*/*du*/*d’* hibát szűri (MO-T27-13). Ez a PRESIDENT döntése, nem finding. Tanulóként ez a két hely most könnyebb.
- **U-NOTE-6:** az i01 formátumsora (*Réponse : 1 = … ; 2 = …*) a JSON-ban nem tanulói mező (MO-T27-03). A szemantikus értékelés miatt nem akadály, csak segítség hiányzik.

**Becsült idő (csak becslés):** 35–45 perc, a keret változatlan.

---

## Összegzés

- **Változáslista:** nincs, ellenőrként nem módosítottam az anyagot.
- **Findingok:**
  - U-01: FIXED;
  - U-02: FIXED;
  - U-03: FIXED;
  - U-04: FIXED;
  - új: U-05 (MINOR; MAJOR, ha a mezőhöz kötés nem igazolható) és U-06 (MINOR);
  - 6 NOTE.
- **Hiányok:** nem láttam, hogyan egyeztet a motor mezőnként, hogyan rendeli hozzá a feedbacket, és számoz-e a megjelenítő. Képernyőn nem teszteltem.
- **Bizonyíték:**
  - **Új:** kulcs nélküli megoldás az i07 mind a hat mondatán az új *Rappel* mellett; az i03 és az s004 végigjárása mindkét alakkal és a hibás alakokkal; a magyar feedback átnézése tegező alakra; az i08 listáinak összevetése a rubrikával.
  - **Újrahasznosított:** a 8. változat UE-rechecke az i05 és az s006 listáira.
  - Webes forrást nem használtam.
- **Verdikt a hatókörömre:** REVIEW_PASS, mert nincs nyitott BLOCKER vagy MAJOR. Feltétel: az U-05 mezőhöz kötését a CEO-szkript igazolja; ha nem, az U-05 MAJOR-rá válik.
- **Következő címzett:** CEO. Az U-05 a CEO-szkripthez és a NavE-hez megy, az U-06 a megoldásíróhoz és a NyE-hez.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 2
GEPI_OSSZEGZES_VEGE