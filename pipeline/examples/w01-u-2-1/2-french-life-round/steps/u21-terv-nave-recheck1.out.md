# NavE újraellenőrzés: U21 (w01-u-2-1, GI2), T27 nyelvi kör, a GR javítási terve (2. változat)

**Szerep és megbízás:** NavE, a követelmény és a szerkezet ellenőre. A CEO megbízásából újraellenőrzöm, hogyan kezeli a terv a korábbi findingjaimat (N-01–N-05, NOTE-1–NOTE-4).

**Bemeneti változat:**
- a GR javítási terve, 2. változat (DRAFT_FOR_REVIEW);
- a T27 brief;
- az élesben futó kézirat (1. javítási kör) és megoldás (5. változat);
- a CL-27 39 jelzése;
- a korábbi NavE-jelentésem.

**Hatókör:** a terv N-01–N-05 által érintett részei: D1–D4, a 2. rész, a 3.2, a 3.4, a 4. rész, az 5. rész és a szerzői követelmények. Ezen felül azt nézem, hogy a módosítások nem rontottak-e el semmit abban, amit korábban PASS-nak minősítettem: ID, kulcs, mérés, terjedelem, a 39 jelzés lefedése.

**NEM VIZSGÁLT (változatlanul):**
- a blokk-JSON és a CL-27 szkript tényleges kimenete;
- a HE-05 szabály teljes szövege;
- a záróteszt utasításstílusa.

Ezek nincsenek a bemenetemben.

---

## 1. A korábbi findingok állapota

| ID | Korábbi súly | Állapot | Bizonyíték a tervben |
|---|---|---|---|
| N-01 | MAJOR | **FIXED** | Új D3. A magyar szövegben „…” áll: lesson, note, a D2 új `note` elemei, a p06 megjegyzése, a kulturális háttér, a feedback és minden `incorrect` szöveg. A francia szövegben « » áll. Ez bekerült a blokkíró és a megoldásíró követelményei közé „csak tipográfia” változástípussal. A megoldás 1. részének „Jelölés a feedbackben” szabályát kifejezetten felülírja. A dőlt jelölés megszűnik, ezzel a p06-ban az *en* „én”-ként való félreolvasása is. A zárt készletek egyezését az alakra szűkíti, az idézőjel fajtája nem számít. Az 5.9 kockázat kimondja: a szöveg és a kiváltó változatlan. |
| N-02 | MINOR | **FIXED** | A D2 szerkezettípus szerint a teljes kéziratra szól. Darabra ellenőriztem a kéziratban: p02 3 + p03 2 + p04 2 + p05 3 + p06 4 = 14 sor, egyezik. A p07 „Példák” listája tisztán francia, helyesen maradt ki. A 4. részbe bekerült a 7a sor, a PE-recheck 14 sorra szól. |
| N-03 | MINOR | **FIXED** | A D1 2. szabálya általános: a helyzetet záró utasítás kiköltözik. Az s006 műveleti utasítása az i07 utasításának 6. mondatra vonatkozó részébe kerül, az i05-tel azonos műveletnévvel. A stimulus a *Tu réponds : …* mondattal zárul. A 2. rész kivételei között a (c) pont, az 5.1 kockázat pedig ugyanazt a műveletet köti ki. Az s006 F01 feedbackje továbbra is illeszkedik. A kéziratban ellenőriztem: a stimulusok közül csak az i08 és az s006 zárul utasítással. Az i05 *Tu acceptes : / Tu réponds : / Tu refuses :* elemei a helyzethez tartoznak. |
| N-04 | MINOR | **PARTIALLY FIXED** | A D1 3. szabálya általános: ahol az utasítás, a lista vagy a rubrika a tanulót és Camille-t együtt említi, ott nem állhat puszta *vous*. Az i08 utasítását, a p09 1. listaelemét és a rubrika B területét az 5.2 kockázat és a szerzői követelmények néven nevezik. **Kimaradt viszont a rubrika C területe:** „amit az üzenet szerint már **megvettetek**, azt ne kérd újra indok nélkül”. Ez ugyanaz a többes számú, tanuló + Camille szerkezet. Francia rubrikában a természetes fordítás a *ce que vous avez déjà acheté*, vagyis éppen az a kétértelmű *vous*, amelyet a szabály tilt. A megoldásírónak szóló követelmény csak „a B terület 1. eleme” formában szól, így a C terület a felsorolás miatt kimaradhat. Ugyanez a hiba, mint amiről a korábbi tanulságom szólt. |
| N-05 | MINOR | **FIXED** | A D4 kifejezetten a csere mellett dönt. Öt kötelező feltétellel védi a 3.5-öt: más helyzet, más főnév, más ige, más szám, azonos szerkezet. A számtilalmat összevetettem a kulccsal és a modellekkel: deux, trois, quatre, six, dix és vingt szerepel bennük, a tiltólista mindet lefedi. Az igetilalom lefedi a *prendre*, az *acheter* és a *mettre* igét. A PE és a NyE recheckje ki van jelölve. |
| NOTE-1 | NOTE | FIXED | *courant / informel, sans argot*. A NyE erősíti meg. |
| NOTE-2 | NOTE | FIXED | A 2. rész kivételjelölést kapott: (a), (b), (c). |
| NOTE-3 | NOTE | elfogadva | A D1-ből következik, az UE-recheck kifejezett pontja. |
| NOTE-4 | NOTE | FIXED | A magyar utasító feedbackrész szándékosan magyar marad, ezt a változásnaplóban jelölni kell. |

## 2. Változatlansági próba a módosított részekre

| Elem | Állapot |
|---|---|
| ID-k, célkódok, kulcsok, alternatívák, F/N/E/A kategóriák, kiváltók | változatlanok; a D3 csak tipográfia, a D1 csak az utasítás helyét mozgatja |
| Az s006 mért művelete (*je vais* + *en* + infinitif + szám) | változatlan; a műveletnév azonos az i05-ével |
| A zárt alakkészletek (i03, i04, i07) | az alakok szó szerint egyeznek (D3, 5.1) |
| A p09 lista és az `allCriteria`; a rubrika küszöbei | 1:1, NavE-recheck a leadáson kijelölve |
| A 39 CL-27 jelzés és a nem jelzett tételek | 39/39 + 7a, a nem jelzett szerkezettípusok sora megvan |
| Terjedelem, időkeret, hang | változatlanok |

## 3. Findingtábla (nyitott tételek)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| N-04 (maradék) | MINOR | D1, 3. szabály, „Érintett helyek”; 5.2 kockázat; a szerzői követelmények (megoldásíró); megoldás, i08 rubrika C | A rubrika C területe a tanulót és Camille-t együtt említi, de nincs az érintett helyek között. A megoldásíró követelménye csak a B területet nevezi meg. | megoldás, i08 rubrika C: „amit az üzenet szerint már megvettetek, azt ne kérd újra indok nélkül” | Vegye fel a rubrika C területét a D1 3. szabályának érintett helyei közé, az 5.2 kockázatba és a megoldásíró követelményei közé („a B terület 1. eleme és a C terület”). Lehetséges megoldás: *ce qui est déjà à la maison* vagy *ce que Camille et vous avez déjà acheté*. | a rubrika C szövege a megoldásíró leadásán (NavE, UE) |

**NOTE-ok (nem kötelezők):**
- **NOTE-5:** Az 5.9 kockázat beágyazott idézetre vonatkozó mondata nehezen követhető: „a belső francia jelölés marad, a külső lesz „…””. Jelenleg nincs olyan feedback, amely francia idézeten belül « »-t tartalmazna. A magyar beágyazott idézés (»…«) a HE hatásköre, a NavE nem minősíti.
- **NOTE-6:** A D4 tiltott főneveinek listája „például” jellegű. A PE a 3.5-ös ellenőrzésnél a teljes item- és modellszókinccsel vesse össze az új mikropéldákat, ne csak a felsorolt listával. Ebből a listából hiányzik például a *viennoiserie*, a *tarte*, a *cannelé*, a *tartine*, a *part*, a *boîte* és a *sortie*. A D4 általános feltétele („egyik sem szerepelhet”) ezt már előírja.

## 4. Értékelés a három kérdésre

- **Jó feladat:** igen. A terv nem változtat mérést. A D1–D4 a briefet a teljes kéziratra érvényes szerkezeti szabályként alkalmazza.
- **Jó időben:** igen. A változások a T27 kör keretén belül maradnak. A szint ügyét a GR-T27-03 helyesen halasztja.
- **Jó módon:** a MAJOR (N-01) lezárult. Egy MINOR maradt, az N-04 hiányos felsorolása. Ez nem érinti a mérést, és a szerző a végrehajtáskor javíthatja.

---

**Változáslista:** újraellenőrző NavE-jelentés a GR T27 tervének 2. változatáról.

**Findingok és állapotuk:**
- FIXED: N-01, N-02, N-03, N-05, NOTE-1, NOTE-2, NOTE-4;
- PARTIALLY FIXED: N-04 (MINOR, a rubrika C területe);
- elfogadva: NOTE-3;
- új: NOTE-5, NOTE-6.

**Hiányok:** a JSON, a CL-27 kimenete és a HE-05 szövege NEM VIZSGÁLT.

**Döntési kérdés:** nincs.

**Bizonyíték:**
- **Új:** a 14 kontrasztsor újraszámolása a kéziratban; az utasítással záruló stimulusok átnézése; a *vous* / „-tok/-tek” előfordulásainak átnézése a p09 listáiban és a rubrika A–D területén (ebből jött az N-04 maradéka); a D4 szám- és igetilalmának összevetése a kulcsokkal és az A, B, C modellel.
- **Újrahasznosított:** a 39/39-es egyeztetés és a változatlan részek PASS-a az előző jelentésemből.
- **Webes forrás:** nem volt szükséges.

**Recheck-hatókör:** a megoldásíró leadásán a rubrika C (N-04); a terv többi része PASS.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 1
GEPI_OSSZEGZES_VEGE