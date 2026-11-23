# NavE-ellenőrzés: U21 (w01-u-2-1, GI2) megoldása, T27 nyelvi kör

**Szerep és megbízás:** a NavE független ellenőrzése, első kör ezen az anyagon (nem recheck).

**Bemeneti változatok:**
- az elfogadott GR-terv (2. változat, D1–D4);
- a befagyasztott T27-kézirat;
- a megoldás T27-es változata, a BLOKK_JSON tanulói szövegeivel.

**Hatókör:**
1. Van-e minden item-ID-hoz teljes megoldási adat: kulcs vagy jelentésalapú leírás, elfogadási szabály, elutasított alakok, `correct`, `incorrect` és célzott feedback; nyílt itemnél rubrika és minták.
2. A mérési cél egyezik-e a tervvel és a régi itemmel.

**Hatókörön kívül, nem minősítem:**
- a nyelvhelyességet (NyE);
- a tipográfiát és az NBSP-t (HE);
- a kontrasztcímkék szakmai helyességét (PE);
- a p01 tu/vous váltását (UE).

## 1. Tételes lefedés

| Item-ID | Kulcs / leírás | Elfogadás | Elutasított + célzott fb | correct / incorrect | Mérési cél (kézirat → megoldás) | Állapot |
|---|---|---|---|---|---|---|
| i01-s001 | jelentésalapú (keyDescription) + 2 minta | FR/HU, szakszó vagy körülírás | 3 + 3 | ✓ / ✓ | partitive-mass + semantic-contrast → egyezik | rendben |
| i02 | a szövegben A; **a JSON-kivonatban nincs kulcsmező** | — | B/C/D + 3 | ✓ / ✓ | semantic-contrast → egyezik | kulcs: NEM VIZSGÁLT (lásd 4. rész) |
| i03 | d’ / des | teljes mondat (szövegben) | 5 + 5 | ✓ / ✓ | de-adjective + lexikalizált des → egyezik; 0.3 kapu feltételes | rendben |
| i04 | beaucoup de / beaucoup des | teljes mondat | 3 + 3 | ✓ / ✓ | de-quantity + subset → egyezik | rendben |
| i05-s001 | J’en prends. | 4 alternatíva | 4 + 4 | ✓ / ✓ | egyezik | adat rendben; ID-struktúra: N-02 |
| i05-s002 *(új ID)* | Je vais en prendre deux. | 4 (N01 a kézirat szerint) | 4 + 5 | ✓ / ✓ | egyezik | N-02 |
| i05-s003 *(új ID)* | Je n’en veux pas. | 3 (a „Non, je n’en veux pas” is, a kézirat szerint) | 4 + 4 | ✓ / ✓ | egyezik | N-02 |
| i05-s004 *(új ID)* | Nous en avons acheté trois. | 3 („On en a…” N01 a kézirat szerint; **„… trois parts” új N02**) | 4 + 6 | ✓ / ✓ | quantity-retention: N-04 | N-02, N-04 |
| i06 | e1 / e2 | csak a kulcs | 7 + 8 | ✓ / ✓ | position + partitive-reference, hibajavítás → egyezik; **a válaszmód eltér**: N-05 | N-05 |
| i07-s001 | du | zárt készlet | 3 + 3 (a d’ ágát az `incorrect` fedi) | ✓ / ✓ | egyezik | rendben |
| i07-s002 | du (a „de” elutasítva; NyE erősíti meg) | zárt | 3 + 3 | ✓ / ✓ | egyezik | rendben |
| i07-s003 | d’ | zárt | 3 + 3 | ✓ / ✓ | egyezik | rendben |
| i07-s004 | des (0.3 kapu) | zárt | 3 + 3 | ✓ / ✓ | egyezik | rendben |
| i07-s005 | de | zárt | 3 + 3 | ✓ / ✓ | egyezik | rendben |
| i07-s006 | Je vais en prendre trois. | 4 (N01 a kézirat szerint; **„trois parts” új N02**); a „J’en prends trois” F01 a kézirat szerint | 5 + 7 | ✓ / ✓ | N-04 | N-04 |
| i08-s001 | 4 terület, 24 pont, 4 szint, 2 minta, 2 elutasított, 9 feedback | — | — | — | az A1–A6 és a B1–B6 1:1 egyezik a p09 két listájával ✓; **az 1:1 egyezés a régi rubrikával nem igazolható** | N-01, N-06, N-07 |

**Gépi ellenőrzés nélkül, kézzel ellenőriztem az i06 karakterpozícióit:** a 62–86 a „Je vais prendre en deux.”, a 148–183 a „Nous ne voulons pas en acheter des.” mondatot fedi (a végpont kizárva, az NBSP a „merci” után egy karakter). A pozíciók egyeznek.

## 2. Findingok

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat / recheck |
|---|---|---|---|---|---|
| N-01 | **MAJOR** | az egész megoldás: feedback, F/N-azonosítók, i08-rubrika | A terv előírja, hogy a megoldásban csak az idézőjel cserélődik, és hogy „kulcs, alternatíva, kiváltó és feedbackszöveg nem változik”. A rubrikánál is: „a küszöbök és a tartalom 1:1”. A megoldás viszont új szöveg. A mérési cél egyezése a régi itemmel ezért a feedbacknél, az elfogadási halmaznál és a rubrikánál nem igazolható. | A megoldás saját MO-T27-01-e: a v5 hiányzott, „a feedback, az F/N-azonosítók és a rubrika pontjai és küszöbei új szövegek”. Új elfogadási döntés is van benne (N02, lásd N-04). | Az (a) utat támogatom: a CEO csatolja a v5-öt, a megoldásíró a v5 szövegén csak az idézőjelet cseréli, a NavE pedig tételesen összeveti a kettőt. A (b) út (v6) csak PRESIDENT/CEO-jóváhagyással járható, és akkor teljes PE + NavE + NyE + HE recheck kell a feedbackre és a rubrikára. |
| N-02 | **MAJOR** | i05: s002–s004 | Az i05 négy itemre bomlott, három új ID-val. A terv és a kézirat egyetlen subitemet rögzít (i05-s001, négy mezővel), és „a haladás az ID-khez kötődik”. A szétbontás jóváhagyás nélküli szerkezeti és ID-eltérés. A tervben deklarált három kivétel (a–c) között nem szerepel. | Terv, 2. rész („Oldal- és item-ID … i05-s001”); kézirat, i05: „Subitem: w01-u-2-1-i05-s001 … négy mező”; megoldás: „az i05 négy külön itembe vált szét … ahogy a P5-szabály előírja”. | Az i05 maradjon egy item négy mezővel, ha a P5-séma ezt engedi. Ha a séma tényleg kizárja, akkor ESCALATED a CEO-hoz: kell az ID-leképezés és a haladási adat kezelése, és a tervet módosítani kell. Recheck: NavE (ID), CEO-szkript. |
| N-03 | MINOR | i05-s001…s004 › instruction | Mind a négy egymezős item utasítása ez: „Écrivez quatre réponses complètes.” Egy mezőnél ez félrevezeti a tanulót. | A BLOKK_JSON négy azonos instruction mezője. | Az N-02 megoldásával együtt rendeződik. Ha a szétbontás marad, az utasítás egy választ kérjen, a „négy” pedig az oldalutasításba kerüljön. |
| N-04 | MINOR | i05-s004 alternatives[2], i07-s006 alternatives[3] + N02 feedback | Új elfogadott alak: „… trois parts”. A terv szerint az elfogadási adat nem változik. Az alak ráadásul ellentmond a tanított szabálynak és az item saját `correct` szövegének: „a szám megmarad, a főnév nem” (p06 szabály 4. pont; a p06 3. ellenpéldája ✗ „en a pris quatre cannelés”; a s004 `correct` szövege). A `w01-g-en-quantity-retention` cél így gyengül. | Megoldás, „Mi változott”: „… trois parts … ez új döntés”; az MO-T27-03 PE-re küldi. | Amíg a v5 alapján nincs döntés, a v5 kezelése érvényes. Ha az alak marad, a `correct` szövege és a p06 szabálya legyen összhangban („főnév vagy mértékegység”), és ezt a PE hagyja jóvá. |
| N-05 | MINOR | i06 › response (CAP-correction, `mode: find`, megjelölt mondatrészek) | A kézirat válaszmódja „két javított teljes mondat”, és „az utasítás nem árulja el, melyik két mondat hibás”. A JSON hibakereső (find) módot és előre megadott mondatrészeket használ. Ha az app ezeket a részeket a tanulónak kijelölhető egységként mutatja, a hibás mondat helye kiszivárog, és a mérés eltér a kézirattól. | Megoldás MO-T27-05; kézirat, i06 válaszmód és szerzői megjegyzés. | A CEO igazolja a játszhatóságot. Ha a mondatrészek látszanak, a válaszmód legyen szabad beírás két mezőbe, és ez MAJOR-ra emelkedik. Recheck: NavE, UE. |
| N-06 | MINOR | i08 › solution (JSON) | A terv francia rubrikát kér a négy szinttel és az elégtelen esetek listájával. A JSON-ban a szintek (non atteint … excellent) csak a magyar, szerkesztői `keyDescription` mezőben vannak, a `notSufficient` szerkesztői mezőként áll. A C terület négy követelményének pontértéke sincs megadva. A markdown rubrika és a JSON tehát nem egyezik. | A BLOKK_JSON criteria[0–3] és keyDescription mezői. | A szintek és a pontozás kerüljön tanulói, francia mezőbe; a C terület kapjon pontot követelményenként. |
| N-07 | MINOR | i08 › Niveaux | A szintküszöbök nem monoton rendezettek. Az „atteint” szinthez legalább 5 pont kell a B területen, az „excellent” szinthez nem. 22 pont elérhető 4 ponttal a B-ben (A 12 + B 4 + C 4 + D 2), így excellent lehet az, ami 21 ponttal partiel volna. | Megoldás, Grille: Niveaux. | Az excellent szint is kapja meg a feltételeket (A ≥ 8, B ≥ 5). A végső küszöb a v5 alapján dőljön el (N-01). |

## 3. Nem vizsgált elemek és hiányok

- **A megoldás 5. változata:** nem állt rendelkezésre. A „mérési cél egyezése a régi itemmel” ezért csak a kéziratban rögzített „Megoldásírónak (változatlan)” pontokra igazolt. Ezek egyeznek: s002/s006 N01, s003 „Non, …”, s004 „On en a…”, s006 F01. A többire NEM VIZSGÁLT (N-01).
- **Az i02 kulcsa a JSON-ban:** a tanulói szövegkivonatban nincs kulcsmező, és az opcióazonosítót nem látom. NEM VIZSGÁLT; a CEO-szkript futási eredményét kérem.
- **A P5-séma:** nem láttam, ezért nem tudom megítélni, valóban kizárja-e a négymezős i05-öt.

## 4. Javítási irány és recheck-hatókör

1. **Megoldásíró:** a v5 megérkezése után idézőjelcsere a v5 szövegén (N-01). Ennek része az i05 visszaállítása vagy az eszkaláció (N-02, N-03), a „trois parts” kezelése (N-04) és a rubrika JSON-ja (N-06, N-07).
2. **CEO:** a v5 csatolása; az i06 játszhatósága (N-05); az i02 kulcsmezőjének gépi igazolása.
3. **NavE-recheck:** a v5 és a T27-megoldás tételes összevetése (feedback, F/N, elfogadási halmaz, rubrika 1:1); az i05 ID-struktúrája; az i06 válaszmódja.

**Bizonyíték:**
- **Új:**
  - a 16 item-ID tételes lefedése;
  - a kézirat „Megoldásírónak” pontjainak összevetése;
  - a p09 két listájának és a rubrika A/B területének 1:1 összevetése;
  - az i06 karakterpozícióinak kézi ellenőrzése;
  - a rubrika szintjeinek aritmetikai ellenőrzése.
- **Újrahasznosított:** nincs.

**Tanulság:** ha a terv „csak tipográfia” változást ír elő, de a szerző új szöveget ad, azt nem lehet FIXED-ként elfogadni. A CEO-nak a v(n−1)-et kötelezően csatolnia kell a megbízáshoz, különben a változatlanság nem ellenőrizhető. Javasolt hatókör: minden T27-es megoldásmegbízás.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 2
minor: 5
GEPI_OSSZEGZES_VEGE