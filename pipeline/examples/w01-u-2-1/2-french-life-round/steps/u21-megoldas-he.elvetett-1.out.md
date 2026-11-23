# HE-ellenőrzés: U21 (w01-u-2-1, GI2), megoldás, T27 nyelvi kör

**Szerep és megbízás:** a helyesírást és a tipográfiát ellenőrzöm (HE), független ellenőrzésben. Ez első kör, korábbi HE-findingom nincs, ezért recheck-állapotot sem adok.

**Bemeneti változat:**
- a megoldás (T27, DRAFT_FOR_REVIEW);
- a BLOKK_JSON tanulói szövegei, helyjelöléssel;
- viszonyítási alap: az elfogadott GR-terv (2. változat) és a befagyasztott kézirat.

**Hatókör:** a francia és a magyar helyesírás, a tipográfia és a házistílus, ezen belül a D3 szabály: magyar szövegben „…”, francia szövegben « ».

**Lefedés:**
- i01-s001, i02, i03, i04 és i05-s001–s004: kulcs, alternatívák, `rejected`, a teljes feedback (`correct`, `incorrect`, `targeted`), a minták;
- i06, i07-s001–s006: ugyanez;
- i08-s001: a francia rubrika (A–D terület, *Niveaux*, *Insuffisant*), az R1 és R2 minta, az X1 és X2 példa, a kritériumonkénti feedback;
- a megoldás 1. része (jelölési szabály);
- a BLOKK_JSON tanulói szövegei p01–p09b között. A kézirattól átvett szövegeket csak az írásmód szempontjából néztem.

**NEM VIZSGÁLT:**
- Bájtszintű szóköz- és aposztróftípus: U+00A0 vagy U+202F, ’ vagy '. A megkapott szövegből ez nem dönthető el, a gépi tipográfiai ellenőrzés dolga. A *8 h 45*, *10 h 15* stb. belsejében is nem törő szóköz ajánlott; ezt is a szkript ellenőrizze.
- Jelentés, mérés, pontozási logika: más ellenőrök hatásköre.

---

## A D3 betartása

- **Magyar feedback, `incorrect` és `correct`:** minden idézett francia elem „…” között áll. Nem maradt « » jelölés vagy dőlt kiemelés, és mindenhol egységesen „…” áll. A toldalékolás szabályos: idézőjel után kötőjellel (pl. „de”-t, „en”-be, „du pain de seigle”-t). Néma végű szónál is helyes: *chouquette-et*.
- **Francia rubrika és listák:** a francia alakok « » között állnak, rendben.
- **A francia minták (R1, R2, X1, X2):** nincs bennük helyesírási hiba. A sajtnevek (*comté*, *tommes*) helyesen kisbetűsek, az *au Pain Perché* összevonás helyes.

## Findingtábla

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| HE-01 | MINOR | i01-s001 `feedback.targeted[0].text` és `feedback.correct`; a megoldás i07-s002 indoklása (szerzői szöveg) | Magánhangzóval kezdődő idézett szó előtt „a” névelő áll, „az” helyett. | „A 2. mondatban **a „à côté de”** maga kéri…”; „…(**a „à côté de”** után a „le parc” áll)”; „a köznyelvben **a „à la sortie du métro…”**”. A névelő a kiejtett kezdőhanghoz igazodik ([a]), ahogy a blokk másik két helyén helyesen áll: „az „acheter””, „az „en””. | Mindhárom helyen „az „à côté de””, illetve „az „à la sortie…””. A változás típusa: csak helyesírás. |
| HE-02 | NOTE | p02–p06 kontrasztsorai és a rubrika (`A — Langue`, `B — Contenu…`) a p09b modellcímeivel szemben (`Modèle A – …`, `Modèle B – …`) | Egy blokkon belül kétféle elválasztó gondolatjel áll: kvirtmínusz (—) és nagykötőjel (–). | JSON: „Je bois de café. **—** ✗ incorrect”; „A **—** Langue”; „Modèle A **–** recommandation enthousiaste”. | Egységesítés egy jelre. Javaslat: a címkeelválasztó maradjon —, a modellcímekben is ez álljon. A döntés a házistílusé. |
| HE-03 | NOTE | Az i08 Markdown-rubrikája (*Niveaux*, A terület) | Elízió idézett, magánhangzóval kezdődő elem előtt. | „sans les conditions **de « atteint »**”; „les six critères **de « Avant d’envoyer, vérifiez »**”. Önmagában idézett (autonim) alak előtt az elízió elmaradása elfogadott, de a gondozott francia tipográfia gyakran elidál: *d’« atteint »*. | Vagy egységesen *d’« … »*, vagy átfogalmazás: *les conditions du niveau « atteint »*, *les six critères de la liste « Avant d’envoyer, vérifiez »*. Az átfogalmazás a biztosabb. |
| HE-04 | NOTE | Szerkesztői mezők: a `rejected[].reason` (pl. i04: „a de la vitrine csoportot nevez meg”; i07-s006: „a je vais + infinitif szerkezet elveszett”; i06: „…sérti a gardez tous les autres mots feltételt”), az i08 `keyDescription`-je (*non atteint*, *partiel*…), a `targeted[].trigger` | A magyar mondatban jelöletlen francia elemek állnak. Mivel nem tanulói szöveg, a D3 szerint nem kötelező javítani, de így nehezen olvasható: a „de la vitrine” névelős magyar szerkezetnek látszik. | lásd a hely oszlopot | Ha ezek a mezők valaha a felületre kerülnek, „…” közé kell tenni őket. Most elég jelezni. |
| HE-05 | NOTE | A megoldás Markdown-szövege, i01 *Minták*, 2. pont (nincs a JSON-ban) | Egymásba ágyazott magyar idézőjel. | „„1 = partitív…; 2 = **„de + le”**, mert **„à côté de”** + **„le parc”**”” | A magyar szabály szerint a belső idézet »…«, vagy a külső idézőjel elhagyható, ahogy a JSON-ban. Tanulót nem érint. |

## Nem finding, rögzítem

- A *crèmerie* (R2) az 1990-es helyesírási reform szerinti alak, a *crémerie* a hagyományos. Mindkettő elfogadott, ezért nem kell változtatni.
- A *passé composé-ban* írásmódot a kézirattal azonos módon használja a feedback, egységes. Nem nyitom újra.
- A francia rubrikában a *0 point*, *1 point*, *2 points* egyeztetése helyes.
- **Hatókörön kívül eső megfigyelés, nem minősítem:** az i08 `keyDescription` szerint „17 pont **fölött**”, a francia rubrika szerint „17 points **et plus**”. A határ eltér (17 benne van, illetve nincs). NavE-ügy, a CEO-nak jelzem.

## Összegzés

- **Változáslista:** nincs, ellenőrként nem írok át semmit.
- **Findingok:**
  - **MINOR:** HE-01;
  - **NOTE:** HE-02 – HE-05.
- **Recheck:** a HE-01 javítása után csak az i01-s001 két feedbackmezőjét és az i07-s002 indoklását nézem meg újra. A HE-02 és a HE-03 csak akkor kér recheck-et, ha a szerző változtat.
- **Hiány:** a bájtszintű NBSP- és aposztrófellenőrzés a gépi kapura vár, NEM VIZSGÁLT.
- **Bizonyíték:**
  - új: a megoldás és a JSON tanulói szövegeinek teljes, kézi átolvasása;
  - újrahasznosított: semmi;
  - webes forrás: nem nyitottam meg, nem volt rá szükség.
- **Verdikt:** a hatókörömben nincs nyitott BLOCKER vagy MAJOR, ezért REVIEW_PASS. A HE-01 javítása kötelező, és önálló újraellenőrzés kell hozzá.
- **Következő címzett:** CEO (a HE-01 a megoldásíróhoz megy).

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 1
GEPI_OSSZEGZES_VEGE