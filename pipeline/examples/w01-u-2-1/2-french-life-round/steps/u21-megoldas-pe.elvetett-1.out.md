# PE-ellenőrzés: U21 (w01-u-2-1, GI2), itemek és megoldás, T27 nyelvi kör

A megoldásban nincs BLOCKER és nincs MAJOR. Két MINOR hibát találtam, ezért REVIEW_PASS, a két MINOR javítására várva.

## 1. Hatókör és bemenet

**Bemenet:** a megoldás T27-es változata (megoldásíró), a BLOKK_JSON tanulói szövegei, a befagyasztott T27-kézirat és a GR-terv 2. változata (D1–D4).

**Vizsgáltam:** i01-s001, i02, i03, i04, i05-s001…s004, i06, i07-s001…s006 és i08-s001. Mindegyiknél a kulcsot, az elfogadott és elutasított alakokat, a célzott, a correct és az incorrect feedbacket. Az i08-nál a francia rubrikát, a szinteket, az „Insuffisant” listát, az R1, R2, X1 és X2 mintát, valamint a p09 két ellenőrzőlistáját a D4 mikropéldáival, mert ezek az i08 kritériumai.

**Nem vizsgáltam, mert kívül esik a hatókörön:**
- a p02–p06 lesson- és note-szövegét;
- a p01-et;
- a p09b két modelljét (A és B), amelyek szövege nem változott;
- a JSON-leképezést (MO-T27-05, -06, -07);
- a magyar helyesírást.

**Az MO-T27-01-ről:** a v5 hiánya és a feedback újraírása folyamatkérdés (CEO/NavE), ezért nem minősítem. A feedbacket ebben a körben teljes, új szövegként vizsgáltam.

## 2. Valóságpróba

**Hogyan zajlik ez a valóságban.** Vasárnap reggel egy lyoni pékségnél sor áll. A pultnál ez a sorrend: *Bonjour*, rendelés (*je vais vous prendre…*, *une tradition pas trop cuite*), majd a pék kérdése: *Et avec ceci ?* A rozskenyeret vágva árulják, ilyenkor a pék megkérdezi, mennyit vág: *Je vous en coupe combien ?* A flant szeletre adják. Előrendelni Instagramon is lehet. A brunch előtt a barát a piacon át jön, és megkérdezi SMS-ben, mit hozzon. A válasz rövid, tegező, sorolja, ami hiányzik, és megmondja, melyik standnál vegye meg.

**Összevetés.** Az itemek és a mintaszövegek ezt a menetet követik. Nincs bennük nem létező szolgáltatás, és a keret egyértelmű.

**Egy kapcsolódó gyengeség:** az i05-s001-ben a „à la coupe” helyzet magától mennyiség megadására hív (*j'en prends un morceau*). A megoldás ezt nem kezeli, lásd PE-U21S-02.

## 3. Mondatonként: opciók, minták, feedback

Csak a gyanús vagy döntést igénylő helyeket sorolom fel.

| ID | Jelenlegi szöveg | Megítélés | Valószínű francia változat | Forrás | Súly |
|---|---|---|---|---|---|
| i05-s001 | csak „J'en prends” és változatai elfogadottak | Vágott kenyérnél a természetes válasz gyakran mennyiséggel jár: „Oui, j'en prends un morceau.” Ez helyes, és az utasítás nem tiltja a bővítést. Most a generikus incorrect üzenetet kapná („Hová kerül ragozott ige mellett?”), ami félrevezető. | N-alternatíva: „J'en prends un morceau / un quart”, rövid megjegyzéssel | saját ítélet | MINOR (02) |
| i05-s002 | nincs trigger erre: „J'en prends deux.” | Helyes francia, de elhagyja a „je vais + infinitif” szerkezetet. Az s006-ban erre van F01 („Helyes mondat, de…”), itt nincs, így a tanuló a generikus incorrect üzenetet kapja. A két item egyenetlenül bánik ugyanazzal az esettel. | Az s006 F01-ének megfelelője az s002-ben | – | MINOR (02) |
| i05-s004 N02, i07-s006 N02 | „… en … trois parts” | Helyes. Az „en” itt a „de flan”-t helyettesíti, a „parts” mennyiségnévként kapja a bővítményt („Du gâteau ? J'en ai mangé deux parts.”). Az elfogadás és a „rövidebb, ha…” megjegyzés jó. Az MO-T27-03-at ezzel lezárom. | – | keresés: nem döntő, nyelvtani ítélet | rendben |
| i07-s002 | du, „de” elutasítva | „À la sortie du métro Croix-Rousse” élő lyoni helymegjelölés, a találatok eseményhelyszín-leírásokban hozzák. A kulcs jó. | – | forrásnapló, 1. sor | rendben |
| i06 | „Je vais vous en prendre deux” elutasítva | A pultnál természetes, de az utasítás („gardez tous les autres mots”) kizárja. A feedback (F03) ezt korrekten kimondja. | – | – | rendben |
| R2 (szerzői minta) | „Camille a pris des petits pains au lait et moi, une grosse brioche” | Nyelvileg természetes, de ellentmond a keretnek: a pultnál tradition, seigle, croissant, cannelés és flan volt. A minta szerzői adat, a rubrika nem kér összhangot, ezért nem hiba. | „On a déjà fait la boulangerie : une tradition, du seigle et des cannelés.” | – | NOTE |
| D4 mikropéldák | „on boit du rosé au bord du Rhône”, „de gros saucissons”, „beaucoup des voyageurs du TGV de 18 h”, „des glaçons ? Paul en apporte”, „on va en emprunter cinq aux voisins” | Mind természetes, mai, lyoni apéróhoz illő. Nincs átfedés a mért itemekkel. | – | – | rendben |

## 4. Szint három tengelyen

- **Helyzet:** A2–B1.
- **Nyelvi anyag:** B1.
- **Művelet:** B1, az i08 integrált írása B1+.

Ez a FICHE-01 ismert szintkifogása (GR-T27-03). Ebben a körben nem változhat, ezért új findingot nem nyitok.

## 5. Műfajpróba (i08)

**Műfaj:** SMS-válasz egy barátnak, aki a piacon át jön. Konvenciói:
- rövid, tegező;
- köszönéssel nyit (*merci / super*);
- tételesen sorolja, mi van és mi hiányzik;
- konkrét standot és helyet ad meg (*le stand du…, en face de…*);
- egy rövid ajánlást indokkal;
- elköszön (*À tout'*, *À tout de suite*).

Az R1 és az R2 ezt teljesíti. A kötelező elemek közül a „des petits pains” erőltetett, de az R1-ben természetesen jelenik meg („on a déjà acheté… des petits pains aux céréales”), tehát szólistaként működik. A rubrika C területe (*tutoiement, sans argot*) illik a műfajhoz.

## 6. Findingok

| ID | Súly | Próba | Hely | Probléma | Bizonyíték | Javaslat | Recheck |
|---|---|---|---|---|---|---|---|
| PE-U21S-01 | MINOR | tétel (4.) | i08-s001, Niveaux és C terület | A szintleírás belül ellentmondásos. 1) Az *excellent* (22–24) nem ír elő A- és B-minimumot, így 22 pont 4 pontos B-vel is *excellent*, holott az *atteint* B≥5-öt kér. 2) A *partiel* „17 points et plus sans les conditions” ága átfed az *excellent* sávval. 3) A C terület 4 pontjának bontása nincs megadva. A pontozás így nem egyértelmű. | Ellenpélda: A=12, B=4, C=4, D=2 → 22 → *excellent*, pedig két tartalmi elem hiányzik. | A szinteket sorrendben, kizárólagosan add meg. Az *excellent* feltétele: 22–24 pont, A≥10 és B≥5. A *partiel* felső határa legyen 21, ha nem teljesülnek az *atteint* feltételei. A C területhez: „1 point par élément”. | NavE (1:1 a régi küszöbökkel), PE |
| PE-U21S-02 | MINOR | tétel (4.) | i05-s001, i05-s002 | Helyes, a helyzetből valószínű tanulói válaszokat a megoldás nem fogad el, és célzott feedback sincs rájuk. Az s001-ben „J'en prends un morceau” (a „à la coupe” helyzet ezt hívja elő), az s002-ben „J'en prends deux” (az s006-ban van rá F01, itt nincs). A generikus incorrect üzenet helyelhelyezési hibát sugall. | Lásd a 3. táblát. | s001: N-alternatíva „J'en prends un morceau / un (petit) quart”, megjegyzéssel. s002: célzott F, az s006 F01 mintájára („Helyes mondat, de a kiinduló mondatban „je vais + infinitif” áll…”). | NavE, PE |

**NOTE-ok:**
- **NOTE-1, i03 2. hiány és i07-s004 („de petits pains”):** az egyetlen helyes válasz továbbra is a 0.3 kaputól függ. Gondozott írásban a „de petits pains” is gyakori. A kapu lezárásáig a „gondozott írásban is megmarad a „des”” állítás (i03 F03, s004 F01) feltételes. Ismert ügy (MO-T27-08), új findingot nem nyitok.
- **NOTE-2, R2:** keretellentmondás, lásd a 3. táblát.
- **NOTE-3, i05 szétválasztva:** mind a négy itemen „Écrivez quatre réponses complètes” áll, miközben egy mező van. Ez UE/NavE-ügy.
- **NOTE-4, i06 F07:** „a piszkozat szerint egyáltalán nem kértek chouquette-et”. A személy pontatlan: a tanuló írja a piszkozatot. Javaslat: „nem akartok venni”. Ez NyE-ügy.
- **NOTE-5, a hatókörön kívül, nem minősítem:** a p02 3. kontrasztsorának note-ja szerint az „On parle du café” csak konkrét, ismert kávéra vagy kávézóra utal. Generikus olvasatban is gyakori („parler du café” = a kávéról általában). A CEO döntse el, hogy a 14 címke PE-rechecke ebben a körben esedékes-e.

**JAVASLAT, nem kötelező:** i05-s003. A cukor visszautasításának legtermészetesebb alakja a „Non merci, je n'en prends pas”. Ez az utasítás szerint kiesik, mert igét cserél, de egy N-megjegyzéssel jelezni lehetne, hogy természetes, csak nem ez a feladat. Ezzel kevesebb lenne a jogos tanulói frusztráció.

## 7. Ami rendben van

- **Kulcsok:** az összes kulcsot előbb kulcs nélkül oldottam meg, és egyeztek.
- **i02:** a disztraktorok hihető tévedésekre épülnek.
- **i04:** a „de la vitrine” egyértelművé teszi a választ.
- **i06:** az F01–F08 jól kezeli a szerkezetmegtartást.
- **Elfogadott alternatívák:** az N01-ek („Je vais vous en prendre…”, „On en a acheté trois”) és az N02-k helyesek.
- **i07:** a zárt készletnél a feedback rövid és pontos.
- **i08:** a rubrika francia szövege természetes; az „Insuffisant” lista ésszerű; az X1 és az X2 jól mutatja a határt.

## 8. Kérdések a tanárnak

1. Au comptoir, pour du pain de seigle « à la coupe », « J'en prends » tout seul vous paraît naturel, ou on dirait plutôt « J'en prends un morceau » ?
2. Dans un texte soigné (guide, site d'une boulangerie), écririez-vous « de petits pains aux céréales » ou « des petits pains aux céréales » ?
3. « Du flan ? Je vais en prendre trois parts. » : acceptable à l'oral, ou redondant ?

## 9. Forrásnapló

1. Keresés: `"à la sortie du métro Croix-Rousse"`. A találati lista (gralon.net eseményhelyszín-oldalak, visiterlyon.com, evous.fr) a kifejezést helymegjelölésként mutatja. Oldalt nem nyitottam meg. A kulcsot támogatja, de nem döntő.
2. Keresés: `"j'en ai pris trois parts" OR "j'en ai mangé deux parts"`. Csak nyelvtani oktatóoldalak jöttek (kwiziq, sublearn), pontos egyezés nem. NEM DÖNTŐ, ezért az N02-re vonatkozó ítéletem saját nyelvtani ítélet. A 3. tanári kérdés ezt teszi fel.

Források (csak a találati listák, megnyitás nélkül):
- [evous.fr – Métro Croix-Rousse](https://www.evous.fr/Metro-Croix-Rousse,200263)
- [gralon.net – place de la Croix-Rousse](https://www.gralon.net/evenements/69/programme-place-de-la-croix-rousse-16186.htm)
- [kwiziq – Direct object vs en](https://french.kwiziq.com/questions/view/direct-object-vs-en)

## 10. Verdikt

**REVIEW_PASS** a megnevezett hatókörre, mert nincs nyitott BLOCKER vagy MAJOR. A két MINOR (PE-U21S-01, -02) javítását kérem a megoldásírótól. A recheck csak az i08 Niveaux és C részére, valamint az i05-s001 és -s002 alternatíváira és feedbackjére szól.

**Változáslista:** első PE-kör erre a megoldásváltozatra, korábbi findingom nincs.
**Bizonyíték:** új. Az itemek saját megoldása, két webes keresés és a rubrika pontaritmetikájának ellenőrzése.
**Következő címzett:** CEO.

**Tanulság:** a szintküszöbös rubrikában minden szintnek ugyanazokat a területminimumokat kell örökölnie felfelé, különben a felső szint lazább, mint az alatta lévő. Javasolt hatókör: minden i08-típusú rubrika.

PE_FINDINGEK
PE-U21S-01 | MINOR | tetel | i08-s001 (Niveaux, C terület) | A szintleírás átfedő és ellentmondásos: az excellent nem kér A/B-minimumot, a partiel ága átfed vele, a C terület pontbontása hiányzik.
PE-U21S-02 | MINOR | tetel | i05-s001, i05-s002 | Helyes, a helyzetből valószínű válaszokra („J'en prends un morceau”, „J'en prends deux”) nincs elfogadás vagy célzott feedback, a generikus incorrect üzenet félrevezet.
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 2
GEPI_OSSZEGZES_VEGE