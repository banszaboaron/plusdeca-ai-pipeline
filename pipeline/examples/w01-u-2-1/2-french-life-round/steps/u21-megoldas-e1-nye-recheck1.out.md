# NyE-recheck: U21 (w01-u-2-1), Megoldás 10. változat

## Szerep, bemenet, hatókör

**Szerep:** nyelvhelyességi ellenőr (NyE), recheck. A korábbi finding-ID-ket megtartom.

**Bemenet:**
- a Megoldás 10. változata, benne a TANULOI_NEZET és a BLOKK_JSON tanulói szövegei;
- összevetési alap: a 9. változatról írt saját jelentésem (REVIEW_PASS, NyE-05 és NyE-06 nyitva), a befagyasztott kézirat, valamint a PRESIDENT V- és M-döntése.

**Hatókör:** francia és magyar nyelvhelyesség, jelentés, kollokáció és regiszter, valamint az elfogadott alternatívák teljessége.

**Mi változott:** a szerző deklarációja szerint csak az i05-s001 négy új alternatívája, a független megoldó jelzése nyomán: *J’en prends volontiers.* · *Oui, j’en prends volontiers.* · *Oui, merci, j’en prends volontiers.* · *Merci, j’en prends volontiers.*

A megbízás szerint a PE-től átvett új szövegeket is nekem kell ellenőriznem. A 10. változatban ilyet nem találtam. A szövegeket tételesen összevetettem a 9. változattal: az i03-OK, az s004-OK, az s004-E03, az i08-E05 és a rubrika *Remarque* sora betűre azonos a korábbival. Ha a CEO-nál van PE-eredetű szövegváltozás, az ebben a bemenetben nem szerepel: **NEM VIZSGÁLT**.

**Nem vizsgáltam, mert más hatáskör:**
- az NBSP és a tipográfia: HE;
- a darabszám (51) és az MO-T27-10 mezőkötése: NavE és CEO.

**Webes forrás:** nem nyitottam meg (**NEM VIZSGÁLT**). Az ítéletek a bevett normára épülnek.

## Kulcs nélküli próba (i05-1)

A *« Il me reste du pain de seigle… Ça vous tente ? »* kérdésre adott természetes tanulói válaszok és az, hogy elfogadja-e őket a lista:
- *J’en prends volontiers.*: elfogadott (új).
- *Merci, j’en prends volontiers.*: elfogadott (új).
- *J’en prends volontiers, merci.*: **nem elfogadott**.
- *J’en prendrais volontiers.* / *Oui, j’en prendrais bien.*: **nem elfogadott**, pedig ez a pultnál talán a leggyakoribb udvarias elfogadás.
- *Avec plaisir, j’en prends.*: **nem elfogadott** (ez NyE-05, változatlan).

## A négy új alak nyelvi ítélete

Mind a négy helyes és természetes.
- A *volontiers* hátravetett határozószóként a *prendre* után idiomatikus.
- A *Merci, j’en prends volontiers* is bevett.
- A *volontiers* kettőzése elleni szabály helyes: a *Volontiers, j’en prends volontiers* kerülendő.
- Hibás alakot nem vettek fel. A szerző jól zárta ki a *J’en veux bien volontiers* alakot: az redundáns, nem természetes.

## Korábbi findingok

| ID | Súly | Státusz | Indoklás |
|---|---|---|---|
| NyE-01 | MAJOR (feltételes) | **FIXED** (marad) | A szorzat továbbra is tételesen ki van írva. A 4 új alak nem sért szabályt. |
| NyE-02 | MINOR | **FIXED** (marad) | Változatlan. |
| NyE-04 | MINOR | **FIXED** (marad) | Változatlan. |
| NyE-05 | MINOR | **PARTIALLY FIXED** (változatlan) | **(a)** Az *Avec plaisir,* bevezető továbbra sincs az s001 és az s002 készletében. **(b)** Az i05-4 magkészlete változatlanul hiányos: hiányzik az *On vous en a pris trois*, a *Nous vous en avons acheté trois parts*, a *Nous en avons pris trois parts*, a *Nous en avions pris trois* és a *Nous vous en avions acheté trois*. Mivel öt bevezetővel szorzódnak, mindegyik ötszörösen hiányzik. **Javaslat (változatlan):** az i05-4 magjait egy szabályból kell képezni: alany × ±*vous* × igeidő × ige × szám; az s001 és az s002 bevezetőkészletébe bekerül az *Avec plaisir,*. **Recheck:** NyE, a teljességet a NavE nézze. |
| NyE-06 | MINOR | **OPEN** | **(1)** Az U21-I03-OK szövege betűre változatlan: „A „petits pains” viszont terméknév: előtte a „des petits pains” gyakori…”. A mondat így azt állítja, hogy a *petits pains* előtt a *des petits pains* áll. **(2)** Az U21-I07-S004-E03 is változatlan: „A „petits pains” többes számú: „des”.” A V-döntés után ez egyetlen helyes alaknak mutatja a *des*-t. Ugyanebben az itemben az E04 már helyesen mondja: „„des” vagy „de””. **Javaslat (változatlan):** (1) „…A „petits pains” viszont terméknév: előtte a „des” gyakori („des petits pains”), de gondozott írásban a „de” is helyes („de petits pains”).” (2) „A „petits pains” többes számú: „des” (gondozott írásban „de” is).” A változás csak a feedback szövegét érinti. A 10. változat dispositiontáblája erről a findingről nem szól. |

## Új finding

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-07 | MINOR | i05-s001 `alternatives` (az új „ volontiers” záró elem) | A „ volontiers” záró elem és a *, merci* záró elem kizárja egymást, és a feltételes mód sincs a listán. Így két természetes válasz, amelyben a mért szerkezet (*en* + ragozott ige, *prendre*) ép, nem egyezik: **(1)** *J’en prends volontiers, merci.* (és a *Oui, j’en prends volontiers, merci.*); **(2)** *J’en prendrais volontiers.* / *Oui, j’en prendrais volontiers.* Ez az udvarias elfogadás jellemző alakja egy ajánlatra (*Ça vous tente ?*). A semleges `incorrect` szöveg csak az igecserét és az udvariassági toldást kezeli, az igeidő-váltást nem, ezért a (2) esetben félrevezető. | Az i05-4-ben a szerző már elfogadja az igeidő-váltást (*Nous en avions acheté trois*), vagyis ott az idő nem része a mért szerkezetnek. Ugyanez az elv az i05-1-ben nem érvényesül. A *volontiers*-t tartalmazó bevezető kizárása indokolt, a *merci*-t tartalmazó záró elem kizárása nem: a *volontiers … , merci* nem kettőzés. | **(1)** A „ volontiers” záró elem után engedélyezett legyen a *, merci* is, ha a bevezető nem tartalmaz *merci*-t: *J’en prends volontiers, merci.* · *Oui, j’en prends volontiers, merci.* **(2)** A *J’en prendrais volontiers.* és a *Oui, j’en prendrais volontiers.* kerüljön a „helyes, de nem célzott” kategóriába, saját rövid megjegyzéssel. Minta: „Helyes, udvarias feltételes mód; a feladat a kiinduló mondat jelen idejét kéri: „j’en prends”.” Ha a szerző ezt nem akarja, legalább a semleges `incorrect` szöveg említse az igeidőt is. A változás típusa: elfogadási adat és egy feedback. **Recheck:** NyE, NavE. |

## Nyelvileg rendben (változatlan, megerősítve)

- A TANULOI_NEZET francia szövegei, a rubrika, a *Niveaux* és a *Ne suffit pas* sorai betűre egyeznek a 9. változattal; a korábbi PASS-om rájuk érvényes.
- A magázó magyar feedback rendben van: nincs új szöveg, a hibátlan alakok maradtak.
- Az s002, az s003, az i05-4 és az s006 listája (27, 23, 54 és 11 tétel) nem változott, a nyelvi ítéletem ugyanaz.

## NOTE-ok (nyitva, nem kötelező)

- **NOTE-f:** a *Remarque* sorában a *remplir plusieurs éléments du contenu* kissé laza kollokáció. Javaslat: *couvrir plusieurs éléments du contenu et satisfaire à plusieurs critères de langue*.
- **NOTE-i:** az i08-E05 „…ezt már megvették” mondata magázó többes számban harmadik személyként is olvasható. Javaslat: „…ezt Camille-lal már megvették.”
- **NOTE-j:** a p07 *si on peut réserver* beszélt nyelvi időegyeztetés, a helyzetleírásban elfogadható.
- **NOTE (CEO):** a 10. változat dispositiontáblája nem tartalmazza a NyE-05 és a NyE-06 sorát. Ha a szerző nem kapta meg a 9. változatról szóló jelentésemet, ugyanaz a folyamathiba áll fenn, amelyet a független megoldó esetében ő maga jelez (FM-megjegyzés 1).

## Összegzés

**Verdikt a hatókörömre: REVIEW_PASS.** Nyitott BLOCKER és MAJOR nincs. A három MINOR nem érvényteleníti a mérést: a semleges `incorrect` szöveg újrapróbálásra hív, a hibás feedback-mondatok pedig nem vezetik félre a tanulót a kulcsot illetően.

| Finding | Súly | Státusz |
|---|---|---|
| NyE-01 | MAJOR | FIXED |
| NyE-02 | MINOR | FIXED |
| NyE-04 | MINOR | FIXED |
| NyE-05 | MINOR | PARTIALLY FIXED |
| NyE-06 | MINOR | OPEN |
| NyE-07 | MINOR | új |

**Recheck hatóköre:**
- NyE-05 és NyE-07: az i05-s001, -s002 és -s004 alternatívalistája;
- NyE-06: csak az U21-I03-OK és az U21-I07-S004-E03 szövege.

**Bizonyíték:**
- **Új:**
  - kulcs nélküli próba az i05-1-en a beszédaktus szerint;
  - a 4 új alak nyelvi ítélete;
  - a 9. és a 10. változat szövegeinek tételes összevetése a nyitott findingok helyén.
- **Újrahasznosított:** a 9. változatról szóló jelentésem a változatlan szövegekre.
- **Webes forrás:** NEM VIZSGÁLT.

**Következő címzett:** CEO. Kérem, hogy a NyE-05, a NyE-06 és a NyE-07 jusson el a megoldásíróhoz.

**Tanulság:** ha egy új záró elem bekerül a szorzatba, akkor a többi záró elemmel való együttállását is szabályként kell rögzíteni, és meg kell nézni, hogy az igeidőre más mezőben alkalmazott elv ugyanúgy érvényes-e. Javasolt hatókör: minden kötött transzformációs item alternatívalistája.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 3
GEPI_OSSZEGZES_VEGE