# NavE-ellenőrzés: U21 (w01-u-2-1, GI2), T27 nyelvi kör, GR javítási terv

**Szerep és megbízás:** NavE, a követelmény és a szerkezet ellenőre. Független ellenőrzés a CEO megbízásából.

**Bemeneti változat:**
- a GR javítási terve (T27, DRAFT_FOR_REVIEW);
- a T27 brief;
- az élesben futó kézirat (1. javítási kör) és megoldás (5. változat);
- a CL-27 39 jelzése;
- a szint- és típusmérce, valamint a példagyűjtemény.

**Hatókör:**
- lefedi-e a terv a briefet és mind a 39 tanári/CL-27 kifogást;
- megmarad-e a mérési cél, a feladattípus, az item-ID-k és a terjedelem;
- jó feladat készül-e, jó időben, jó módon.

Első ellenőrzés, korábbi NavE-findingom erre a tervre nincs.

**NEM VIZSGÁLT:**
- a blokk-JSON és a CL-27 szkript (`p5/lib/t27.mjs`) tényleges kimenete;
- a HE-05 szabály teljes szövege;
- a „nyelvtani és olvasás-záróteszt” utasításstílusa, amelyre a brief hivatkozik;
- a p09b oldal saját címe és szerkezete.

Ezek nincsenek a bemenetemben.

---

## 1. A brief tételes megfeleltetése

| Brief-követelmény | Hol teljesül a tervben | Állapot |
|---|---|---|
| Blokk- és oldalcímek franciául | 3.2 (p01 cím, belső címek) | teljesül |
| Utasítások franciául, *vous*-formában | D1; 3.2; 3.4 | **részben**: az s006 beágyazott utasítása kimarad (N-03); az i08-ban a *vous* kétértelmű (N-04) |
| Helyzetleírás franciául, francia életből, tartalom változatlan | 3.1 (p01-vázlat, tiltott új tények) | teljesül |
| Példa, brief, eszköz- és ellenőrzőlista, rubrika franciául | D2; 3.2; 4. rész | **részben**: a p03 2. kontrasztsora kimarad (N-02) |
| Példamondatok a francia életből, ne semleges tankönyvi mondatok | nincs döntés a p09 lista mikropéldáiról | **hiányzik** (N-05) |
| Nevek (T08) | 1. rész: nincs magyar név | teljesül (ellenőriztem: Camille, Léo, Paul, *la boulangère*) |
| Magyar marad: lesson, note, kiejtés, magyar párhuzam, a feedback magyarázó része | 2. rész | teljesül |
| A magyar szövegben idézett francia elem „…” között (HE-05) | nincs benne; a feedback „változatlan szöveggel” marad, azaz « » jelöléssel | **hiányzik / ellentmond** (N-01) |
| ID-k, típusok, pontozás, kulcsok, alternatívák, sorrendkulcsok nem változnak | 2. rész; 3.4 | teljesül |
| Hang és videó | nincs felvétel | teljesül |
| Cél, szint, terjedelem | 2. rész; GR-T27-03 | teljesül |
| Tipográfia (’, NBSP, csillag nincs a címben) | 3.2, utolsó előtti sor | teljesül |
| A CL-27 jelzések megszüntetése | 4. rész (1–39) + D2 CEO-leképezés | teljesül; a 39 jelzésből 39 megfeleltetve, darabra egyezik |
| Leadás: változásnapló, BLOKK_JAVITAS | „A szerzők bemeneti követelményei” rész | teljesül |

## 2. A változatlanság ellenőrzése (mérés)

| Elem | Terv szerint | Állapot |
|---|---|---|
| 9 célkód | változatlan | teljesül |
| p01–p09, p09b; i01–i08 és a subitemek | változatlan | teljesül |
| Zárt alakkészletek (i03, i04, i07) | betűre egyeznek a megoldás F01- és `incorrect` szövegével (5.1. kockázat) | teljesül |
| Az i06 szerkezetmegtartó feltétele (E-02) | a két elem franciául is kifejezett | teljesül |
| A rubrika küszöbei és szintsorrendje | 1:1, a NavE tételesen veti össze | teljesül (recheck a megoldásíró leadásán) |
| Az i01 válaszmódjának láthatóvá tétele | tanulói tájékoztatás, a megoldás eddig is mindkét nyelvet elfogadta | elfogadható, a mérés nem változik |
| Az i08 stimulus vége (*Réponds-lui.*) átkerül az utasításba | deklarált eltérés | elfogadható; lásd NOTE-2 |

## 3. Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|
| N-01 | MAJOR | 2. rész (feedback-sor); 3.2 (D2 `note`, tipográfia); a megoldásíró bemeneti követelménye | A brief szerint a magyar szövegben (lesson, note, feedback) idézett francia elem „…” idézőjelben áll (HE-05). A terv erről nem rendelkezik. A feedbacket „változatlan szöveggel” hagyja, ahol a megoldás « » jelöléssel idéz („A magyar mondatban álló francia alakok « » között állnak”). A kéziratban a magyar magyarázatok dőlt jelöléssel idéznek, ezt az app lehántja. A nyitott MO-F04 (6) / E-06 szerint így a p06-ban az *en* „én”-nek olvasható. A blokkíró és a megoldásíró így két különböző jelölést követne, és a félreolvasás megmarad. | brief „Mi marad magyar”, 1. pont, és „Tipográfia”; megoldás 1. rész, „Jelölés a feedbackben”; MO-F04 (6) | A terv mondja ki egységesen: magyar szövegben (lesson, note, a D2 új `note` elemei, feedback, magyar `incorrect`) minden francia elem „…” között álljon, a francia szövegben (lista, rubrika) « ». Írja be ezt a blokkíró és a megoldásíró bemeneti követelményei közé, a feedbacknél a „csak tipográfia” változás típusával. HE ellenőrzi. | a feedback és a lesson/note jelölése, a HE- és NavE-recheck |
| N-02 | MINOR | 3.2 „Kontrasztsorok (… p03 ×1 …)”; 4. rész, #7 | A p03 kontrasztlistája két soros. A második sor (*Je n’aime pas le goût du jus d’orange en bouteille. – de + le: a palackozott narancslé íze.*) is francia mondat + magyar ítélet és jelentés. A CL-27 csak az elsőt jelezte, a terv is csak azt bontja. A D2 után a lista fele bontott, fele vegyes lenne. | kézirat p03, „Kontraszt”, 2. sor | A D2 bontás terjedjen ki a p03 2. sorára is (címke: *de + le*; a magyar jelentés `note`). A PE-recheck 14 sorra szóljon. | p03 lista, PE |
| N-03 | MINOR | D1; 3.2 „Helyzetjelzők és stimulusok … változatlanok”; i07-s006 | Az s006 stimulusa tegező utasítással zárul: *→ Transforme avec en.* A D1 saját szabálya szerint a helyzetet záró utasítás az utasításmezőbe kerül (ezt csak az i08-ra alkalmazza). A terv itt változatlannak hagyja, így ez az egyetlen tegező utasítás maradna. | kézirat i07-s006; terv D1, „Gyakorlati szabály” | Az s006-ban a *Transforme avec en* kerüljön ki a stimulusból egy *vous*-os subitem-utasításba (pl. *Transformez avec « en ».*), vagy olvadjon be az i07 utasításába (*Pour la phrase 6, …*). A stimulus a *Tu réponds : Je vais prendre trois parts de flan.* mondattal záruljon. | s006 utasítás, UE |
| N-04 | MINOR | D1; 5.2. kockázat; i08 utasítás; p09 tartalmi lista 1. elem; rubrika B | A D1 a *vous* hármas jelentését csak a helyzetmondatoknál kezeli. Az i08 utasítása *vous*-ra váltva maga ütközik: *Dites à Léo ce que vous avez déjà…* Itt a *vous* egyszerre lehet a magázott tanuló és a tanuló + Camille. Ugyanez érinti a tartalmi lista 1. elemét („mit vettetek már Camille-lal”) és a rubrika B területét. A 5.2. kockázat csak az i05-4-et és a p05-öt nevezi meg. | kézirat i08 utasítás; terv 3.4 (i08) és 5.2 | A terv írja elő, hogy ahol az utasítás a tanulót és Camille-t együtt említi, ott a *vous* helyett egyértelmű megnevezés álljon (*ce que Camille et vous avez déjà acheté* / *ce qu’il y a déjà à la maison*). Vegye fel az i08-at, a p09 listát és a rubrikát az 5.2. kockázat helyei közé. | i08 utasítás, p09 lista, rubrika, UE |
| N-05 | MINOR | 3.2 „p09 nyelvi lista”; 1. rész, „Valóságpróba” | A brief állandó szabálya: a példamondatok a francia életből jöjjenek, ne semleges tankönyvi mondatok legyenek. A p09 nyelvi listájának mikropéldái semlegesek: *du sel ↔ le prix du sel*, *de jolies assiettes*, *beaucoup des voitures du parking*, *Paul en boit*, *il en a bu deux*, *elle va en couper deux*. A kézirat szándékosan témán kívüliek, hogy ne szivárogjon kulcs (3.5). A terv „rövid, példával” formulája nem dönt: maradnak-e, vagy cserélődnek. | brief, DONTESEK idézet („Az apróságok is…”); kézirat p09 „Mikropéldák” | Döntsön a terv kifejezetten: vagy jelölt indokkal maradnak (3.5), vagy témán kívüli, de francia életből vett példákra cserélődnek. Ekkor rögzítse a feltételt: más főnév, ige és szám, mint az i01–i08-ban és a modellekben, így a kimásolhatóság nem nő. | p09 lista, PE (3.5) |

**NOTE-ok (nem kötelező javítások):**
- **NOTE-1:** p09 brief, *Registre : familier, sans argot*. A francia regiszterskálán a *familier* a *courant* alatti szint. Az eredeti „informális, de nem szleng” és a rubrika C pontosabb megfelelője *courant / informel, sans argot*. NyE/PE döntse el.
- **NOTE-2:** a 2. rész „Itemmondatok és stimulusok: szóról szóra, csak tipográfia” sora ellentmond a 3.2 két deklarált változásának (az i06 alanya, az i08 stimulusvége). A tábla kapjon kivételjelölést.
- **NOTE-3:** a p01-en a francia helyzet tegező, a közvetlenül utána álló tájékoztató *vous*-os. Ez a D1-ből következik és elfogadható, de az UE figyelje a végigjárásban.
- **NOTE-4:** a feedback nem magyarázó, utasító része (*Próbáld újra*, *Válassz a … közül*) a terv szerint magyar marad. A brief „Mi lesz francia” listája a feedbacket nem említi, ezért ez a megbízáson belüli döntés, de a változásnaplóban jelölni kell.

## 4. Értékelés a három kérdésre

- **Jó feladat:** igen. A terv nem ír új itemet és nem változtat mérést. A D2 bontás és a francia lista terminuszárójellel a briefnek megfelel.
- **Jó időben:** igen. A szint- és céleltérés (FICHE-01) a GR-T27-03-ban jelölve van, a kört nem terheli.
- **Jó módon:** egy MAJOR és négy MINOR finding van. A MAJOR (N-01) egy kifejezett briefszabály hiánya, és ütközik a megoldás jelenlegi jelölésével.

---

**Változáslista:** új NavE-jelentés a GR T27 tervéről.

**Findingok:**
- MAJOR: N-01.
- MINOR: N-02, N-03, N-04, N-05.
- NOTE: NOTE-1 – NOTE-4.

**Hiányok:** a JSON, a CL-27 szkript kimenete és a HE-05 szabály szövege nem volt a bemenetben (NEM VIZSGÁLT).

**Döntési kérdés:** nincs.

**Bizonyíték:**
- **Új:** a 39 CL-27 jelzés darabra és helyre egyeztetve a terv 4. részével. A kézirat kontrasztlistái soronként összevetve a 3.2-vel, ebből jött az N-02. Az utasítás- és stimulusszövegek a D1 szabályával összevetve, ebből jött az N-03 és az N-04.
- **Újrahasznosított:** nincs.
- **Webes forrás:** nem nyitottam meg, nem volt szükséges.

**Recheck-hatókör:** a terv N-01 – N-05 által érintett sorai. A terv többi része változatlan PASS-hatókör.

**Következő címzett:** CEO.

**Tanulság:** ha egy nyelvi körben a tervező a CL-27 jelzéslistájából dolgozik, a nem jelzett, de azonos szerkezetű elemek kimaradnak (pl. a p03 2. sora). Ezért a bontást szerkezettípusonként a teljes kéziratra kell kimondani, nem jelzésenként. Javasolt hatókör: minden T27-es terv.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 4
GEPI_OSSZEGZES_VEGE