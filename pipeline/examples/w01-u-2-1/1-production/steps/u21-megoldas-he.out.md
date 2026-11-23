# HE-ellenőrzés: U21 (w01-u-2-1), a Megoldás fázis anyaga

**Szerep és megbízás:** HE, független ellenőrzés. Ez az első kör, nem recheck.

**Bemenet:** a megoldásíró anyaga a javítási körből: a 0–1. pont, az i01–i08, az E-01, a findingok és a TANULOI_NEZET. Háttérként olvastam az elfogadott tervet (2. javított változat), a befagyasztott kéziratot és a PRESIDENT 2026-11-01-i folytatását.

**Amit vizsgáltam (francia és magyar helyesírás, tipográfia, házistílus):**
- az i01–i06 és az i08 kulcsát, elfogadott alternatíváit, opcióit és feedbackjét;
- az i07-s001–s006 elemeit ugyanígy;
- az i08 rubrikáját, a C mintát, valamint az R1 és R2 elutasított mintát;
- az E-01 javasolt instrukcióját;
- a TANULOI_NEZET teljes francia és magyar szövegét;
- az 1. pont normalizálási szabályait;
- a p09b-be kerülő A és B modellt a kéziratból. Ezeket elolvastam, helyesírási hibát nem találtam bennük.

**Nem vizsgáltam:**
- a BLOKK_JSON-t, mert nem kaptam meg. A nem törő szóköz és az aposztróf tényleges kódolása ezért nem ellenőrizhető.
- a nyelvhelyességet, a szakmai helyességet és a szerkezetet. Ezek a NyE, a PE és a NavE hatókörébe tartoznak.

---

## Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| HE-01 | MINOR | Minden tanulói francia szöveg; MO-F05 | A nem törő szóközt a szerző szándékosan nem tette be, és a HE-re vagy az összeállításra hagyta. A HE nem javít. A gépi beszúrásnak két kockázata van. (1) Kimarad, ha senki sem felel érte. (2) Ha az összes szövegre lefut, a magyar feedbackbe is nem törő szóköz kerül a kettőspont elé, holott ott nem kell szóköz. | MO-F05; magyar feedback, például „Igen: revenir de…”, „Fordítva: az excellents…”, „Magánhangzó előtt je → j': j'en prends.” | A BLOKK_JSON-ban csak a francia mezők kapjanak nem törő szóközt (title, instruction, stimulus, opciók, minták), a következő helyeken: a : ; ? ! előtt, a « » belsejében, és lehetőleg a számjegy és a *h* között (8 h 45). A magyar feedbackben és a vegyes mezőkben a magyar szabály érvényes, a beidézett francia szakaszban nincs kettőspont. Ezt a CEO szkriptje ellenőrizze. |
| HE-02 | MINOR | TANULOI_NEZET; minden feedback (MO-F04: „a markdown-jelölés le van hántva”) | A dőlt és a kódjelölés eltűnt, így a metanyelvi elem nem különül el a szövegtől. A franciában: „Explique brièvement la valeur de du…”, „Deux valeurs de du”, „Complète avec beaucoup de ou beaucoup des.” Az i05 forrásmondatai összefolynak az instrukcióval („Tu acceptes : Je prends du pain de seigle.”). A magyar feedbackben a francia szó magyarként olvasható: „Az en már…”, „A le egy meghatározott…”, „a de la nőnemű…”. | A kéziratban ezek dőltek vagy kódjelöltek voltak; a megoldási anyagban nem. | Ha a P5-séma ismer kiemelést, a metanyelvi francia elem dőlt legyen, a forrásmondat pedig kódjelölt vagy dőlt. Ha nem ismer, a francia metanyelvi elem kerüljön « » közé (franciául: *la valeur de « du »*), vagy magyar szövegben „” közé („az „en” már…”). A választás legyen egységes az egész blokkban. |
| HE-03 | MINOR | U21-I05-E03, U21-I05-E10 | Az utolsó, néma betű után kötőjellel kapcsolt toldalék kiejtés szerint nem illeszkedik: „a du pain de seigle-t”, „a de sucre-t”. Kiejtve [szegl]+t és [szükr]+t, ez nem ejthető. | AkH. 217. (néma végű idegen szavak toldalékolása) | Kerüld el a toldalékolást: „Az en már helyettesíti ezt: du pain de seigle; ne ismételd meg.” és „Az en már helyettesíti ezt: de sucre; ne ismételd meg.” A *chouquettes-et*, a *chocolat-t*, a *nous-t* és a *tourte-okra* helyes. |
| HE-04 | MINOR | U21-I08-E05 (tanulói feedback) | „a brunch-ra”: a *brunch* végén kiejtett hang áll ([cs]), ezért nem kell kötőjel. | AkH. 216–217. (kiejtett végű idegen szó: a toldalék kötőjel nélkül jár) | „Kérj valami mást a brunchra.” |
| HE-05 | MINOR | 1. pont, Normalizálás; i05 4. mező (U21-I05-E14) | Nincs szabály a hiányzó vagy hibás ékezetre a teljes mondatos mezőkben. Mobilon gyakori az „achete” és az „achetè”. Ma nem dönthető el, hogy a rendszer elfogadja a választ, elutasítja, vagy célzott jelzést ad. | Az i05-4 kulcsa *acheté*; az E14 *achetées*. A normalizálás csak a kis- és nagybetűt, az aposztrófot, a szóközt és a záró írásjelet kezeli. | Új sor: ha az ékezet hiányzik vagy hibás, de a mért szerkezet helyes, a válasz ne legyen teljesen helyes. Célzott feedback: „Ékezet: acheté.” Egy újrapróbálás járjon hozzá, pontlevonás ne. Az ékezet maga ne legyen normalizálva. |
| HE-06 | MINOR | i05 1–3. mező, i05 2. mező, s006: alternatívák *…, s'il vous plaît* | A reformált helyesírás (1990) szerinti *s'il vous plait* helyes, de a listában nem szerepel. Ha a tanuló így írja, egy helyes válasz elutasítást kap. | *Rectifications de l'orthographe* 1990: az *î* és az *û* elhagyható, ha nem különböztet meg alakokat (*plait*). | Mindkét írásmód legyen elfogadott, vagy a normalizálás kezelje a *plaît/plait* párt. |
| HE-07 | NOTE | i04, Elfogadott: „a 2. helyen nagybetűvel kezdve is (*Beaucoup des*)” | A kettőspont utáni második hiány a franciában kisbetűvel folytatódik (*regarde : beaucoup des…*). A kitétel azt sugallja, hogy a nagybetű is helyes. A kis- és nagybetű egyébként is közömbös. | 1. pont, Normalizálás | A sort érdemes törölni. |

---

## Szándékos hibák (R1, R2, elutasított alakok)

- **R2:** a hibás alakok (*beaucoup des croissants*, *de fromage*, *prendre en*, *de le*, *des bons*) mind a jelölt, tervezett hibák közé tartoznak. Véletlen elütést nem találtam.
- **R1:** nincs benne véletlen helyesírási hiba.
- **Elutasított alakok** (E01–E15, I06-E01–E08, i07): a hibás alakokban csak a célzott hiba van.

## Hatókörön kívüli NOTE-ok (más ellenőrnek, nem minősítem)

- **NyE:** az E-01 javasolt instrukciójában *écris un seul mot*, de a felsorolásban szerepel a *de la* is, ami két szó.
- **NyE:** a C mintában *la boulangerie du marché… ils ont* áll. Ez ugyanaz a referenciatípus, mint a korábban kifogásolt *Ils*.
- **NyE/PE:** az i06-ban 19:40-kor *Toi : Bonjour !*, a pékség válasza *Bonsoir !*.

---

## Összegzés

- **Változáslista:** nincs; az ellenőr nem ír át.
- **Nyitott tételek:** BLOCKER és MAJOR nincs. A 6 MINOR (HE-01–HE-06) a szerzőhöz megy, a HE-07 NOTE.
- **Hiány:** a BLOKK_JSON nélkül a nem törő szóköz és az aposztróf kódolása NEM VIZSGÁLT. A HE-01-et a CEO szkriptje zárja le.
- **Recheck:** csak a HE-01–HE-06 helyei, valamint a szkript kimenete a nem törő szóközről.
- **Bizonyíték:** új: AkH. 216–217., *Rectifications* 1990. Webes forrást nem nyitottam meg.
- **Következő címzett:** CEO.

**Tanulság:** a francia házistílus nem törő szóközét gépi összeállítás teszi be → a beszúrást mezőnyelv szerint kell szűrni (francia: igen, magyar feedback: nem) → különben a magyar kettőspont elé is szóköz kerül → minden P5-blokk-összeállítás.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 6
GEPI_OSSZEGZES_VEGE