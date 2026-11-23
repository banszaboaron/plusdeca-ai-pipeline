# NyE-ellenőrzés: U21 (w01-u-2-1), Megoldás fázis

**Szerep:** NyE, független ellenőr.
**Bemenet:** a megoldásíró anyaga (i01–i08, a TANULOI_NEZET, az E-01 javaslat), a befagyasztott kézirat (1. javítási kör), a GR terve (2. javított változat), a PRESIDENT 2026-11-01-i folytatása.
**Hatókör:** a francia nyelvhelyesség, jelentés, kollokáció és regiszter a kulcsokban, az elfogadott és elutasított alakokban, a feedbackben, a rubrika mintáiban és az E-01 javasolt instrukciójában; az elfogadott alternatívák teljessége.
**Lefedett ID-k:** i01, i02, i03, i04, i05 (1–4. mező), i06, i07-s001–s006, i08 (rubrika, A/B/C minta, R1/R2), E-01.
**NEM VIZSGÁLT:** a BLOKK_JSON leképezése (MO-F04), a tipográfia (MO-F05, ez a HE-é), a magyar helyesírás. A befagyasztott kéziratot csak annyiban néztem, amennyiben a kulcs vagy a feedback rá épül.

## Saját megoldás (a kulcs előtt)

| Item | Megoldásom | Egyezik-e a kulccsal |
|---|---|---|
| i01 | partitív / *de + le* | egyezik |
| i02 | A | egyezik |
| i03 | *d'* / *des* | egyezik |
| i04 | *beaucoup de* / *beaucoup des* | egyezik |
| i05 | *J'en prends.* / *Je vais en prendre deux.* / *Je n'en veux pas.* / *Nous en avons acheté trois.* | egyezik |
| i06 | *Je vais en prendre deux.* / *Nous ne voulons pas en acheter.* | egyezik |
| s001–s006 | *du* / *du* / *d'* / *des* / *de* / *Je vais en prendre trois.* | egyezik |

Amit a megoldásíró nem vett észre: az s003 és az s004 helyére szám is beírható, és az i05 4. mezőjében a *vous* is beférhet. Lásd a NyE-01 és a NyE-05 findingot.

## Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-01 | MAJOR | i07-s001, s003, s004; az E-01 javasolt instrukciója | Egyetértek az MO-F01-gyel: a jelenlegi instrukció mellett helyes, de nem célzott kitöltés is lehetséges, és a megoldás ezt elutasítja. A megoldásíró listájából kimaradt: az s003-ban szám (*trois immenses tourtes*), az s004-ben szám (*vingt petits pains aux noix*). Mindkettő hibátlan francia. **Az E-01 szövege önellentmondó:** *écris un seul mot* áll benne, de a felsorolt alakok között ott a kétszavas *de la*. Ráadásul a hat elem nem *question*, hanem kiegészítendő mondat. | Saját nyelvi próba: *nous cuisons trois immenses tourtes*, *on a fait vingt petits pains aux noix* nyelvtanilag és jelentésben helyes. | Az i07 instrukciója legyen: *Complète ou transforme les six phrases. Pour les phrases 1 à 5, écris seulement la forme qui manque : du, de la, de, d' ou des.* Így a *beaucoup de*, a *nos* és a szám mind kizárt, és nem kell helyes választ elutasítani. A „Ez helyes…, de itt…” feedbackek maradhatnak tartaléknak. Recheck: NavE (instrukció) és a független megoldó. |
| NyE-02 | MINOR | i03, 2. hely, *de* feedback; s004, *de* feedback | A feedback túl erősen állítja, hogy a *de petits pains* „kis méretű kenyereket jelentene”. Írott franciában a *de petits pains (au lait…)* termékjelentésben is előfordul, és ezt a normatív források egy része nem tiltja kifejezetten. Ez valójában vitatott alak, nem jelentésváltás. | Az Académie 9. kiadása a *petit pain*-t lexikai egységként adja (*se vendre comme des petits pains*). Ez csak keresési kivonat, NEM MEGNYITOTT. Az OQLF-kivonat a *des petits pois* példát mutatja, a *petits pains* nem látszik benne (szintén NEM MEGNYITOTT). | A célalak miatt a *de* elutasítása maradhat, a feedback legyen: „A petits pains itt a tábla egyik termékfajtájának a neve. Az ilyen összeforrt kifejezések előtt a des marad: des petits pains.” A „kis méretű kenyér” állítás kerüljön ki. NOTE a kéziratszerzőnek: a p04 kontrasztja ugyanezt állítja; azt is enyhítse a következő kéziratkörben. |
| NyE-03 | MINOR | i08, C minta | **(a) Ellentmondás:** a minta kimondja, hogy *pas besoin de boulangerie*, az utolsó mondat mégis pékséget és *petits pains*-t ajánl. Ez éppen a rubrika C területének keretkoherencia-szempontját sérti, pedig a minta „elfogadott”. **(b)** Az *on a déjà pris du pain et des cannelés : on en a même pris quatre* mondatban az *en* két lehetséges előzmény után áll, és a *même* („sőt négyet is”) logikailag nem vezet a *donc pas besoin de boulangerie*-hez. | Saját olvasat a mintán. | Az 1–2. mondat legyen: *Au Pain Perché, on a déjà pris du pain, et Camille a pris des cannelés : elle en a pris quatre, donc pas besoin de boulangerie.* Az utolsó mondat legyen: *Et note pour la prochaine fois : la boulangerie du marché fait des petits pains aux graines vraiment bons.* Mindkét javítás után megmarad az *en* a segédige előtt és a *des petits pains*. Recheck: PE és NyE. |
| NyE-04 | MINOR | i05, E03 és E10 (és az i06-ban az ehhez hasonló esetek) | A vesszővel kihelyezett *J'en prends, du pain de seigle.* és *Je n'en veux pas, de sucre.* helyes beszélt francia (jobbra kihelyezés). A jelenlegi feedback („ne ismételd meg”) hibának mutatja. Vessző nélkül az alak valóban hibás. | Ismert, standard jobbra kihelyezési szerkezet a beszélt nyelvben. | A vesszős változat kapjon külön feedbacket: „Vesszővel ez helyes, beszélt nyelvi kihelyezés, de a feladat a helyettesítést kéri: j'en prends.” Nem teljes értékű, de nem hibás (vö. K3). A vessző nélküli alak elutasítása marad. |
| NyE-05 | MINOR | i05, 4. mező, elfogadott alakok | Az i05 2. mezőjében és az s006-ban elfogadott a *vous* + *en*, a 4. mezőből viszont hiányzik a *Nous vous en avons acheté trois.* és az *On vous en a acheté trois.* Mindkettő helyes, reklamációban kifejezetten természetes, és a mért szerkezet (az *en* a segédige előtt, a szám megmarad) érintetlen. | Az anyag 1. pontja maga mondja ki a *vous* + *en* sorrend elfogadását. | Mindkét alakot fel kell venni az elfogadottak közé. |
| NyE-06 | NOTE | i05, E14 | Az *en* melletti participe-egyeztetés: a mai norma szerint a participe nem egyezik, de egyes nyelvtanok az egyeztetést megtűrik. A feedback a mércét helyesen adja meg. | – | Lehetséges pontosítás: „Az en után a participe passé rendszerint nem egyezik: acheté.” |
| NyE-07 | NOTE | i06, 2. kulcsmondat | A *Nous ne voulons pas en acheter* egy üzletnek írva kissé nyers; a *nous n'allons pas en prendre* udvariasabb lenne. A kulcs befagyasztott és mért alak, ezért nem kérek változtatást. | – | – |
| NyE-08 | NOTE | a 0.3 kapu, MO-F03 | Az OQLF-lapot nem tudtam megnyitni: a munkamenetben csak keresés áll rendelkezésemre, oldalletöltés nem. A kivonat a *des petits pois* példát mutatja, a *petits pains* nem látszik benne. Nyelvi ítéletem: a *des petits pains* a termékjelentésben helyes, és gondozott szövegben is a mérce. Ezt a forrásállítást viszont NEM IGAZOLTAM. | Két webes keresés, lásd lent. | Lásd a SEGITSEGKERES blokkot. A kulcsot ez nem blokkolja, a 0.3 kaput viszont nem jelentem teljesültnek. |

Az MO-F02-vel egyetértek. A *beaucoup de tartes de la vitrine* határeset, de a határozott bővítménnyel megnevezett csoport mellett a norma a *beaucoup des* alakot kéri. A kulcs és az elutasítás helyes.

**Hibátlannak találtam (nincs finding):**
- i01: a kulcs, a minták és a feedback;
- i02: az opciók és a feedback;
- i03: az 1. hely összes ága;
- i04: az összes ág;
- i05: az 1–3. mező elfogadott alakjai;
- i06: E01–E08 (a NyE-04 kivételével);
- s001: a *de*, *le*, *de la*, *un* elutasítása;
- s002, s005, s006: teljes egészében;
- A és B modell;
- R1 és R2: a hibák azonosítása helyes.

## NOTE-ok más ellenőröknek

- **HE:** az MO-F05 (nem törő szóközök); a *brunch-ra* írásmódja (az i08 E05 feedbackjében).
- **NavE / UE:** a NyE-01 javasolt instrukciója zárt alakkészletet ad meg. Nézzék meg, hogy ez nem teszi-e túl könnyűvé a vegyes ismétlő sort.
- **Kéziratszerző (következő kör):** a p04 kontrasztja (NyE-02).

## Bizonyíték

Csak keresési kivonatok, egyik oldalt sem nyitottam meg:
- [OQLF – Des devant un adjectif antéposé](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose): kivonat, NEM MEGNYITOTT;
- [Académie, 9e éd., A9P1804](https://dictionnaire-academie.fr/article/A9P1804): kivonat (*se vendre comme des petits pains*), NEM MEGNYITOTT.

Grevisse: NEM VIZSGÁLT.

**Változáslista:** új ellenőrzés, nincs korábbi NyE-finding. **Következő címzett:** CEO. Recheck: a NyE-01 a NavE-vel, a NyE-03 a PE-vel.

SEGITSEGKERES
mi kell: OQLF Vitrine linguistique, „Des devant un adjectif antéposé” – https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose
mit kerestem: „OQLF des devant un adjectif antéposé petits pains”; „des petits pains ou de petits pains règle adjectif nom composé”. Csak keresési kivonatot kaptam (a példa: des petits pois), a lapot ebben a munkamenetben nem tudom megnyitni.
mit kérsz: másold be a lap teljes szövegét, vagy legalább a kivételről (összeforrt melléknév + főnév) szóló bekezdést a példáival
miért: a 0.3 kapu (a des petits pains indoka) csak a megnyitott forrással zárható le, és ez dönti el a NyE-02 feedback végleges szövegét
tartalékterv: a nyelvi ítélet (a des petits pains helyes, a kulcs marad) és a NyE-02 enyhített feedbackje forrás nélkül szerepel; a 0.3 kaput nem jelentem teljesültnek
SEGITSEGKERES_VEGE

GEPI_OSSZEGZES
verdict: REVISION_REQUIRED
blocker: 0
major: 1
minor: 4
GEPI_OSSZEGZES_VEGE