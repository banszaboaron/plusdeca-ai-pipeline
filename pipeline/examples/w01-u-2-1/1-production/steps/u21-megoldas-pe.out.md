# PE-jelentés: U21 (w01-u-2-1), Megoldás fázis

## 1. Hatókör és bemenet

**Szerep:** szakmai ellenőr (PE). Az U21 Megoldását nézem (javítási kör, DRAFT_FOR_REVIEW), a befagyasztott 1. javított kézirattal és a GR 2. tervével együtt.

**Ebben a körben megvizsgáltam:**
- az i01–i08 itemeket, az i07 s001–s006 subitemjeivel;
- a kulcsokat, az elfogadott és az elutasított válaszokat;
- a feedback francia részeit;
- az i08 rubrikáját és a C mintaszöveget;
- az E-01 javaslatot.

**Nem vizsgáltam:**
- a P5-leképezést (MO-F04), mert ezt a CEO szkriptje nézi;
- a tipográfiát (MO-F05), mert ez a HE dolga;
- a kézirat már elfogadott A és B modelljét. Ezeket csak mintaként néztem meg.

Ez az első PE-kör ezen a megoldáson, ezért nincs korábbi finding-ID, amit meg kellene tartani.

## 2. Valóságpróba (a megoldás szemszögéből)

**Így zajlik a valóságban.** Vasárnap reggel egy lyoni pékségben sor áll. A pultnál „Et avec ceci ?” után rendelnek, a flanért szeletenként fizetnek. Előző este egy foglalási üzenet megy a pékségnek. Délelőtt SMS-ek mennek egy barátnak, aki a Croix-Rousse piacán keresztül jön a brunchra.

**Az eltérés a megoldásban:**
- A kézirat kerete megáll. A metróállomás valódi: *sortie du métro Croix-Rousse*, a C vonalon.
- A megoldás saját C mintájában van keretellentmondás. Ezt a PE-M04 tárgyalja.

## 3. „Ki mondaná így?”: a gyanús helyek

| ID | Jelenlegi szöveg | Miért nem így mondaná egy francia | Valószínű francia változat | Súly |
|---|---|---|---|---|
| i08, C minta, 1. mondat | *on a déjà pris du pain et des cannelés : on en a même pris quatre, donc pas besoin de boulangerie* | Az *en* előzménye kétértelmű: négy kenyér vagy négy cannelé? A *même* semmit nem hangsúlyoz. A *pas besoin de boulangerie* csonka. | *on a déjà pris une tradition et des cannelés (Camille en a pris quatre, elle est fan), donc pas besoin de repasser à la boulangerie.* | MAJOR (PE-M04) |
| i08, C minta, utolsó mondat | *Et si tu passes devant la boulangerie du marché, ils ont des petits pains aux graines vraiment bons.* | Két mondattal korábban még „nem kell pékség”. Ez itt burkolt kérés, ami ellentmond a rubrika C pontjának. | *La boulangerie du marché fait des petits pains aux graines vraiment bons, mais résiste : on en a assez pour dix !* | MAJOR (PE-M04) |
| i06, elutasítva | *Nous n'en voulons pas.* · *J'en prendrai deux.* | Ezek helyes, sőt egy foglalási üzenetben természetesebb mondatok, mint a kulcs. | Elfogadni, vagy az instrukcióban megkötni a szerkezetet. | MAJOR (PE-M02) |
| i05 E03 és E10 | *J'en prends du pain de seigle.* · *Je n'en veux pas de sucre.* | Vesszővel (*Je n'en veux pas, de sucre.*) ez élő jobbra kihelyezés. Vessző nélkül hiba, tehát a feedback jó. | – | NOTE |
| i04, 2. hely | *beaucoup des tartes de la vitrine* | Élőszóban inkább *la plupart des tartes* hangzana el. Az alakot azonban a feladat megadja, így a mérés érvényes. | – | MINOR (PE-m06, = MO-F02) |

A feedback francia részletei (*de + le = du*, *j'en prends*, *en prendre deux*, *d'immenses tourtes*) helyesek.

## 4. Szint három tengelyen

- **Téma:** B1+. Pékség, foglalás, reklamáció.
- **Nyelvi anyag:** B1+/B2. Határesetek: *beaucoup des*, *des petits pains*, az *en* négy helye.
- **Művelet:** hibajavítás és indokolt választás. Ez B2-közeli.

A szint nem marad el a célszinttől. Az elutasított helyes válaszok (PE-M01, PE-M02) viszont éppen a B2-esebb, idiomatikusabb tanulói változatokat büntetik.

## 5. Műfajpróba

Az i06 foglalási üzenet egy pékségnek. A műfaj konvenciói:
- rövid;
- udvarias;
- futur vagy *je vais*;
- *on* és *nous* is előfordul;
- a visszautasítás udvarias: *on n'en prendra pas, merci*.

A kulcs (*Nous ne voulons pas en acheter*) a műfajban nehézkes. A helyesebb tanulói javításokat (*J'en prendrai deux*, *Nous n'en voulons pas*) a megoldás elutasítja: ez PE-M02.

Az i08 baráti SMS. A rubrika C pontja (tegeződés, nem szleng, koherencia) jó. A C minta saját rubrikáján bukik el (PE-M04).

## 6. Findingtábla

| ID | Súly | Próba | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|---|
| **PE-M01** | MAJOR | tétel (4.) | i07-s001, s003, s004 | Amíg az E-01 nincs bevezetve, a megoldás helyes kitöltéseket utasít el: *beaucoup de / un peu de miel*, *nos immenses tourtes*, *nos petits pains*. Ezt maga a megoldás is MAJOR-nak minősíti (MO-F01). | A saját megoldásom: az s001-ben a *Il adore le sucré* kifejezetten a *beaucoup de*-t hívja elő. | Az E-01-et támogatom (*De 1 à 5, écris un seul mot : du, de la, de, d' ou des.*). A zárt készlet minden kulcsot és minden hihető tévedést lefed. Recheck: NavE, UE, független megoldó. |
| **PE-M02** | MAJOR | tétel (4.) | i06, E06 és E08; hiányzó sor | A tanulói instrukció (*Corrige les deux phrases fausses…*) nem köti meg a szerkezetet, a megoldás mégis elutasít helyes, jelentéstartó javításokat: *Nous n'en voulons pas.*, *J'en prendrai deux.* A *Nous ne voulons pas acheter de chouquettes.* (*en* nélkül, helyesen) pedig egyáltalán nincs kezelve. Ez ugyanaz a hibatípus, amelyet az E-01 az i07-ben javít. | Az i06 instrukciója a TANULOI_NEZET-ben. Az E06 feedback maga írja: „Ez helyes francia mondat”. | Instrukció-módosítás, ESCALATED a kéziratszerzőhöz: *Corrige seulement l'erreur : garde la structure de la phrase et le pronom en.* Ha ez nem kerül be, a három változat legyen „helyes, de nem a kért javítás” (újrapróbálás, nem hiba). Recheck: NavE, UE. |
| **PE-M03** | MAJOR | kollokáció | i03, 2. hely: a *de* feedbackje; s004: a *de* feedbackje | A feedback azt állítja, hogy a *de petits pains* „kis méretű kenyereket jelentene”. Ez nem bizonyított, és félrevezető: gondozott írott szövegben (ilyen az i03 ajánló rovata) a *de petits pains* a szabályos alak. A *des* megtartása csak lexikalizált egységnél kötelező, és hogy a *petits pains* ilyen-e, azt az OQLF-kivonatban nem látni. A kulcs így egy meg nem nyitott forráson áll (a 0.3 kapu nyitott), és az i03-ban valószínűleg két helyes válasz van. | Saját keresés (kivonat, NEM MEGNYITOTT): a kivonat a *des petits pois* és a *des beaux-parents* példát hozza, a *petits pains*-t nem. Ugyanezt jelzi az MO-F03. | 1) Feedback, azonnal: „a táblán a *Petits pains* termékfajta; a termék neveként itt a *des petits pains*-t kérjük” (jelentésváltozást ne állítson). 2) A NyE nyissa meg az OQLF-lapot. Ha az nem igazolja a *petits pains*-t, az i03-ban a *de* is legyen elfogadott, és a lexikalizált *des* mérése csak az s004-ben maradjon: ott a boulangère élőszava miatt a *des* természetes. Recheck: NyE, PE. |
| **PE-M04** | MAJOR | mondat | i08, C minta | A mintaszöveget a tanuló utánozza, de ebben a mintában az *en* előzménye kétértelmű (*on en a même pris quatre* egy *du pain et des cannelés* felsorolás után), a *pas besoin de boulangerie* csonka, és az utolsó mondat egy pékségi petits pains-t ajánl. Ez ellentmond a rubrika C pontjának és az E05 feedbacknek. | A rubrika A5 pontja kimondott előzményt kér, a C pont ellentmondásmentességet. | Javasolt változat: *Au Pain Perché, on a déjà pris une tradition et des cannelés (Camille en a pris quatre, elle est fan), donc pas besoin de repasser à la boulangerie.* Záró mondat: *La boulangerie du marché fait des petits pains aux graines vraiment bons, mais résiste : on a ce qu'il faut !* A lefedési listát ehhez igazítani (partitív *du*: *du basilic*; ha kell, egy második, például *du pain*). |
| **PE-m05** | MINOR | tétel | i08 rubrika, négy szint | A szintek nem fedik le az összes esetet. Ha A = 6 és B ≤ 3, az eset egyik szinthez sem tartozik. A C és a D pont csak a „Kiváló” szintnél számít. | A rubrika négyszintes táblája. | Javaslat: A = 6 és B ≤ 3 → „Részleges”. A „Teljesített” szinthez is C ≥ 2. |
| **PE-m06** | MINOR | kollokáció | i04, 2. hely | A *beaucoup de tartes de la vitrine* határeset; élőszóban a *la plupart des* lenne a természetes. Az alakokat a feladat megadja, tehát a mérés érvényes. Egyetértek az MO-F02-vel. | – | A kulcs marad. A „2 = beaucoup de” feedback mellett legyen egy félmondat: „élőszóban hallani, de itt a megnevezett csoport a *des*-t kéri”. |

**NOTE (nem finding):**
- Az i04 válaszmódja nem mondja meg, hogy ha a tanuló csak *de* / *des* betűt ír, elfogadott-e. Ez az UE-re tartozik.
- Az i05 E03 és E10 sorában a vesszős jobbra kihelyezés (*Je n'en veux pas, de sucre.*) helyes francia. A feedback ezt ne nevezze hibának, ha vessző áll.

## 7. Ami rendben van

- **i01:** a kulcs, a minták és a feedback jók.
- **i02:** egyetlen jó válasz van, a distractorok hihető tévedésekre épülnek.
- **i05:** a négy kulcs jó. Az elfogadott *vous en prendre*, *Non merci,* és *On en a acheté trois* indokolt. Az E01–E15 pontos, a *Éppen ez a reklamáció lényege* kifejezetten jó.
- **s002, s005, s006:** egyetlen jó válasz, jó feedback.
- **Az i08 R1 és R2 elutasított mintája** jól szemlélteti a „pipáló” és a „hibás” szöveget.
- **Az újrapróbálási menet** (célzott feedback, aztán a kulcs, aztán a párosított item) jól illeszkedik az egységhez.

## 8. Kérdések a tanárnak

1. *Dans un guide (« Nos adresses du dimanche »), écririez-vous « propose de petits pains aux céréales » ou « des petits pains aux céréales » ? Les deux vous semblent-ils acceptables ?*
2. *Dans un message de réservation à une boulangerie, « Je vais en prendre deux » / « Nous ne voulons pas en acheter » vous paraissent-ils naturels, ou plutôt « J'en prendrai deux » / « On n'en prendra pas, merci » ?*
3. *« Beaucoup des tartes de la vitrine sont déjà réservées » : naturel à l'oral, ou plutôt « la plupart des tartes » ?*

## 9. Forrásnapló

- Keresés: `"de petits pains" "des petits pains" adjectif antéposé règle`. A találatok között ott volt az [OQLF – Des devant un adjectif antéposé](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose) lap. Csak a kivonatot láttam, NEM NYITOTTAM MEG. A kivonatban kivételként a *des petits pois* és a *des beaux-parents* szerepel, a *petits pains* nem.
- Keresés: `"à la sortie du métro Croix-Rousse"`. A [visiterlyon](https://en.visiterlyon.com/out-and-about/culture-and-leisure/culture-and-museums/tours-and-workshops/croix-rousse-walk) és a [ktransit](https://ktransit.com/transit/Europe/France/lyon/metro/lyon-metro-CroixRousse.htm) találati kivonata szerint az állomás valódi, a C vonalon. NEM NYITOTTAM MEG.

## 10. Verdikt

**REVISION_REQUIRED**, négy nyitott MAJOR miatt:
- PE-M01: E-01 bevezetése;
- PE-M02: az i06 instrukciója vagy elfogadási szabálya;
- PE-M03: a *petits pains* feedback és a 0.3 kapu;
- PE-M04: a C minta.

**Recheck-hatókör:** az i06, az i07 instrukciója és feedbackje, az i03 és az s004 *de*-sora, a C minta, az i08 rubrikájának szintjei.

**Tanulság:** ha egy javítási feladat instrukciója nem köti meg a szerkezetet, a helyes, de más szerkezetű javítást nem lehet elutasítani. Ezért az instrukció mondja ki, mit kell megtartani (*garde en*), különben a mérés két helyes választ büntet. Ez minden hibajavító itemre érvényes.

**Következő címzett:** CEO.

PE_FINDINGEK
PE-M01 | MAJOR | tetel | w01-u-2-1-i07-s001, s003, s004 | Az E-01 bevezetéséig a megoldás helyes, nem célzott kitöltéseket utasít el (beaucoup de / un peu de miel, nos immenses tourtes, nos petits pains).
PE-M02 | MAJOR | tetel | w01-u-2-1-i06 | A szerkezetet meg nem kötő instrukció mellett helyes, jelentéstartó javításokat utasít el (Nous n'en voulons pas, J'en prendrai deux), és a Nous ne voulons pas acheter de chouquettes nincs kezelve.
PE-M03 | MAJOR | kollokacio | w01-u-2-1-i03 2. hely; w01-u-2-1-i07-s004 | A „de petits pains = kis méretű kenyér” feedback nem bizonyított és félrevezető; gondozott írásban a de valószínűleg szintén helyes, a kulcs nem megnyitott forráson áll.
PE-M04 | MAJOR | mondat | w01-u-2-1-i08 C minta | Az en előzménye kétértelmű, a pas besoin de boulangerie csonka, a záró mondat pedig ellentmond a rubrika C pontjának (pékségi termék a „nem kell pékség” után).
PE-m05 | MINOR | tetel | w01-u-2-1-i08 rubrika | A négy szint nem fedi le az A = 6, B ≤ 3 esetet, a C és D pont csak a Kiváló szintnél számít.
PE-m06 | MINOR | kollokacio | w01-u-2-1-i04 2. hely | A beaucoup de tartes de la vitrine határeset, a beaucoup des élőszóban kevésbé természetes, mint a la plupart des.
PE_FINDINGEK_VEGE

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 4
minor: 2
GEPI_OSSZEGZES_VEGE