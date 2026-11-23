# NyE recheck: U21 (w01-u-2-1), Megoldás 5. változat

**Szerep és megbízás:** NyE, független ellenőr. Az U21 Megoldás fázisának 5. változatát néztem újra. Elsősorban a 4. változat óta változott részeket és a PE javaslatából átvett új szövegeket vizsgáltam.

**Bemenet:**
- a megoldásíró 5. változata a TANULOI_NEZET-tel;
- a befagyasztott kézirat (E-01–E-08);
- a GR terve (2. javított változat);
- a PRESIDENT 2026-11-01-i folytatása;
- a saját előző jelentésem (NyE-01–NyE-13).

**Hatókör:** francia nyelvhelyesség, jelentés, kollokáció és regiszter, valamint az elfogadott alternatívák teljessége. Az alábbi változásokat néztem:
- az 1. rész új kategóriadefinícióit és a mezőnkénti mért szerkezetet;
- az i04 új `incorrect` szövegét;
- az i05 2. mezőjét (új U21-I05-F01);
- az i06-ban az új A01-et és a bővített F02-t;
- az s006-ban az új F01-et és a megszűnt N02-t.

**Lefedett ID-k:**
- 1. rész: normalizálás, teljes mondatos mező, válaszkategóriák;
- i04: `incorrect`;
- i05: a mezőtábla, F01, N02, N05 és `incorrect`;
- i06: A01, F01–F06 és `incorrect`;
- i07-s006: teljes.

A változatlan itemeknél (i01–i03, s001–s005, i08) a korábbi PASS-om azonos tartalomra érvényes. Ezeket csak abból a szempontból néztem meg, érinti-e őket az 1. rész új szabálya.

**NEM VIZSGÁLT:**
- a BLOKK_JSON leképezése;
- a tipográfia és a nem törő szóközök (a HE-é);
- a magyar helyesírás;
- a kézirat A és B modellje.

## Saját próba (kulcs nélkül, a feedback előtt)

- **i05-2:** *Je vais prendre deux croissants.* → *Je vais en prendre deux.*
  - Helyes francia mondatok, amelyek elhagyják a mért szerkezetet: *J'en prends deux.*, *J'en veux deux.*, *J'en prendrai deux.*
  - Helyes kihelyezés, amely megtartja a mért szerkezetet: *Je vais en prendre deux, des croissants.*
- **s006:** a kulcs *Je vais en prendre trois.* Helyes francia mondatok, amelyek elhagyják a mért szerkezetet: *J'en prends trois.*, *J'en veux trois.*, *J'en prendrai trois.*
  - A *Trois, s'il vous plaît.* természetes válasz a pultnál, de nem átalakítás.
- **i06-1:** *Je vais vous en prendre deux.*
  - A *vous en* sorrend helyes: a részeshatározói névmás az *en* előtt áll.
  - Írott foglalási üzenetben is természetes; ezt a kereskedelmi fordulatot írásban is használják.
- **i05-4:** a *Nous vous en avons acheté trois.* helyes. Itt az *acheter qqch à qqn* részeshatározója a forrást jelöli.

## Az új szövegek nyelvi ellenőrzése

| Elem | Eredmény |
|---|---|
| 1. rész, 3. kategória (ép mért szerkezet + ige, alany, kihelyezés vagy pontosító mennyiség) | Nyelvileg pontos. Az N03, N04 és N05 sorai mind ép szerkezetűek, és helyes francia mondatok: *J'en prends un morceau*, *Nous en avons acheté trois parts*, *J'en veux bien*, *Je n'en prends pas*, *Nous en avons pris trois*. |
| U21-I05-F01 | Rendben. A *J'en prends deux* és a *J'en veux deux* helyes. A feedback ezt elismeri, megnevezi a kért szerkezetet, és nem árulja el a kulcsot. A *J'en veux deux* illik a helyzethez; a tanári B6 is jóváhagyta (*Oui, j'en veux deux*). |
| U21-I06-A01 | Rendben. Az állítás helytálló: a *vous* + *en* sorrend és a *vous en prendre* is az. A szó szerinti javítás pontos. |
| U21-I06-F02 (bővítve) | Rendben. Mindhárom alak helyes francia mondat, és mindhárom elhagyja a mért szerkezetet. |
| U21-I07-S006-F01 | Rendben, a *Combien de parts ?* kérdésre a *J'en veux trois* természetes válasz. |
| i04 `incorrect` | Rendben, a francia alakok pontosak. |

## A korábbi findingok állapota

| ID | Állapot | Indok |
|---|---|---|
| NyE-01 | FIXED (változatlan) | – |
| NyE-02 | FIXED (változatlan) | – |
| NyE-03 | FIXED (változatlan) | – |
| **NyE-04** | **OPEN** (MINOR) | i05: az N02 hatóköre továbbra is „1, 3”. A *Je vais en prendre deux, des croissants.* így a semleges `incorrect` szöveget kapja. Ez most az 1. rész új definíciójának is ellentmond, mert az a kihelyezett elemet ép mért szerkezet mellett kifejezetten a 3. kategóriába sorolja. i06: az `incorrect` szöveg nem változott (*„nem maradt-e meg mellette a főnév vagy a determináns”*). A *Nous ne voulons pas en acheter, des chouquettes.* így továbbra is hibának látszik, pedig helyes, csak nem a kért művelet. |
| NyE-05 | FIXED (változatlan) | – |
| NyE-06 | FIXED (változatlan) | – |
| NyE-07 | lezárva (NOTE) | – |
| **NyE-08** | **OPEN** (NOTE) | A 0.3 kapu nem teljesült; részletek alább. |
| **NyE-09** | **OPEN** (MINOR) | Az általános bevezetőlista változatlan: *Oui, · Non, · Non merci, · Volontiers, · Non, c'est bon,* minden teljes mondatos mezőre. Az új mezőnkénti szerkezettábla sem korlátozza. Így elfogadható marad például a *Non, j'en prends.* (i05-1), a *Volontiers, je n'en veux pas.* (i05-3) és a *Non merci, je vais en prendre trois.* (s006). |
| NyE-10 | FIXED (változatlan) | – |
| NyE-11 | FIXED (változatlan) | – |
| NyE-12 | FIXED (változatlan) | – |
| NyE-13 | FIXED (változatlan) | – |

**NyE-08 részletei:**
- Ebben a körben egy újabb webes keresést futtattam, a vitrinelinguistique.oqlf.gouv.qc.ca oldalra szűkítve.
- A találati összefoglaló ugyanazt adja, mint eddig: az alapszabály a *de* + előretett melléknév. Kivétel, ha a melléknév és a főnév összetett főnevet alkot; a felsorolt példák: *des grands-pères*, *des petits pois*, *des beaux-parents*.
- A *des petits pains* példát a kivonat nem idézi, és a lapot nem nyitottam meg.
- A 0.3 kapu ezért **nem teljesült**, és a feltételes szabály (E-09) marad. A segitseg-1 kérés folyamatban van, újra nem kérem.

## Új finding

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-14 | MINOR | i05, 2. mező; i07-s006 | Hiányos a 4. kategória („nem a kért művelet”) felsorolása. A *J'en prendrai deux* / *J'en prendrai trois* helyes francia mondat, és ugyanúgy elhagyja a mért szerkezetet, mint az F01 alakjai. Mivel nincs felsorolva, a semleges `incorrect` szöveget kapja. Az a tanulót az *en* helyének és a számnak az ellenőrzésére küldi (ezek jók), és „más igét” emleget (az ige ugyanaz). Így nem tudja meg, mit kell változtatnia. Az i06-F02 ugyanezt az alakot már kezeli, a két item tehát következetlen. | Saját próba (fent). Az i06-F02 sorában a *J'en prendrai deux* szerepel. | Az i05-F01 és az s006-F01 kiváltója egészüljön ki a *J'en prendrai deux.* és a *J'en prendrai trois.* alakkal. A feedback szövege változatlan maradhat. |

## Javítási irány a nyitott findingokhoz

- **NyE-04:**
  - i05: az N02 hatóköre legyen „1, 2, 3”, a 2. mezőben a rövid alak *je vais en prendre deux*. Ez az 1. rész új definíciójából egyébként is következik.
  - i06: kapjon új F-sort a *Nous ne voulons pas en acheter, des chouquettes.* alak. A feedback: „A vesszős kihelyezés helyes, de az instrukció szerint csak a hibát javítod: törölni kell a « des »-t → « nous ne voulons pas en acheter »”.
- **NyE-09:** az általános bevezetőlista törlődjön, helyette kerüljön be ez a szabály: „bevezető csak a mezőtáblában felsorolt alakkal fogadható el”. Az s006-ban bevezető legfeljebb *Oui,* lehet.

## NOTE-ok más ellenőröknek

- **PE / NavE:** a korábbi NOTE-om (az i06-F05 „új szót tettél bele” indoka) most élesebb. Az új A01 kifejezetten elfogad egy betoldást (*vous*), az F05 viszont részben a betoldással indokol. Nyelvileg mindkettő védhető. Javaslat: az F05 indoka csak a jelentésváltozás legyen („így csak a húszat utasítod el”).
- **CEO:** a 0.3 kapu nyitott, és a segitseg-1 válasza zárja le.

## Változáslista

- Ellenőrizve, hibátlan: az 1. rész kategóriadefiníciói, i04 `incorrect`, i05-F01, i06-A01, i06-F02, s006-F01.
- OPEN (MINOR): NyE-04 és NyE-09.
- OPEN (NOTE): NyE-08.
- Új: NyE-14 (MINOR).
- BLOCKER és MAJOR nincs. A hatókörben nincs olyan nyitott nyelvi hiba, amely a mérést érvénytelenítené vagy helyes választ büntetne. A MINOR findingok a semleges vagy félrevezető feedbackhez és egy következetlen elfogadási listához kötődnek.

**Bizonyíték:**
- **Új:**
  - kulcs nélküli próba a változott mezőkön (i05-2, i05-4, i06-1, s006);
  - egy webes keresés: [DES : emploi devant un adjectif antéposé – Vitrine linguistique](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose). Csak keresési kivonat, a lapot NEM NYITOTTAM MEG.
- **Újrahasznosított:** a korábbi körök saját próbái a változatlan itemekre. Grevisse: NEM VIZSGÁLT.

**Recheck-hatókör:**
- NyE-04: az i05 N02 hatóköre és az i06 új F-sora;
- NyE-09: az 1. rész bevezető-szabálya;
- NyE-14: az i05-F01 és az s006-F01 kiváltói;
- NyE-08: a segitseg-1 válasza után a 0.3 kapu.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 3
GEPI_OSSZEGZES_VEGE