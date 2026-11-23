# NyE recheck: U21 (w01-u-2-1), Megoldás 4. változat

**Szerep és megbízás:** NyE, független ellenőr. Az U21 Megoldás fázisának 4. változatát néztem újra, a befagyasztott kézirat E-01–E-08 javításaival együtt.

**Bemenet:**
- a megoldásíró 4. változata, a TANULOI_NEZET-tel együtt;
- a befagyasztott kézirat (1. javítási kör, az E-01–E-08 átvezetésével);
- a GR terve (2. javított változat);
- a PRESIDENT 2026-11-01-i folytatása;
- a saját előző jelentésem: NyE-01–NyE-13.

**Hatókör:** francia nyelvhelyesség, jelentés, kollokáció és regiszter. Ezt néztem a kulcsokban, az elfogadott, a „helyes, de nem célzott” és a „nem a kért alak vagy művelet” (F) kategóriában, az elutasított alakokban, a feedbackben, és ide tartozik az elfogadott alternatívák teljessége is. A kéziratból az új francia szövegeket néztem: E-01, E-02, E-03, E-04, E-05, E-07 és E-08.

**Lefedett ID-k:**
- i01–i06;
- i07-s001–s006;
- i08 (az ellenőrzőlista, a rubrika, a C minta, R1, R2, E01–E05);
- a p04 2. kontrasztsora (E-03);
- az 1. rész általános elfogadási szabályai.

**NEM VIZSGÁLT:**
- a BLOKK_JSON technikai leképezése (MO-F04);
- a tipográfia, a « » jelölés és a nem törő szóközök (ez a HE-é);
- a magyar helyesírás;
- a kézirat A és B modellje (befagyasztott, nincs bennük változás).

## Saját próba a változott részeken (a feedback előtt)

- **i03 (*de, d' ou des*):** az 1. hely *d'excellents*, a 2. hely *des petits pains*. A zárt készletben más helyes kitöltés nincs. A *ses* és a *quelques* jogosan kerül az F01-be: helyes francia, de nem a kért alak.
- **i07 s001–s005 (*du, de la, de, d', des*):** a sorrend *du / du / d' / des / de*. A készleten belül minden helyre egyetlen alak illik; a *de* az s004-ben csak a 0.3 feltétel szerint jöhet szóba.
- **Az s004 új stimulusa:** *Ce matin, nous avons fait ___ petits pains aux noix. Ils sont encore tout chauds !*
  - Teljes, igés, írott mondat, ezért a determináns kötelező. A névelő nélküli felirat-olvasat megszűnt.
  - A *tout chauds* helyes: a *tout* határozószó, hímnem többes szám előtt nem egyezik.
  - Az *a ajouté à la craie* természetes kollokáció.
- **i06 az új instrukcióval:** az F01–F06 alakjai mind helyes francia mondatok. Ezek: *Nous n'allons pas en prendre*, *Nous n'en prendrons pas*, *Nous ne voulons pas acheter de chouquettes*, *…en acheter vingt*, *Je vais en réserver deux*.
  - Az F05 jelentésmegjegyzése pontos: a *…en acheter vingt* csak a húszat utasítja el.
- **i05-4 az E-05 után:** *Nous en avons acheté trois* és *Nous en avions acheté trois* – mindkettő helyes, reklamációban természetes.
- **Kihelyezés vesszővel:** *Je vais en prendre deux, des croissants.* (i05-2) és *Nous ne voulons pas en acheter, des chouquettes.* (i06). Ezt a 4. változat továbbra sem kezeli (lásd NyE-04).

## A korábbi findingok állapota

| ID | Állapot | Indok |
|---|---|---|
| NyE-01 | **FIXED** | Az E-01 bekerült a kéziratba, az s001–s005 válaszkészlete zárt. A mennyiségszavak, a birtokosok és a számnevek F01-et kapnak: az F01 nem minősíti hibának a válaszokat, csak megnevezi a kért alakot. Így nincs helyes, de büntetett válasz, és a zárt felsorolás hiánya sem probléma. Az új célzott sorok helyesek (s001-E05, s003-E04, s004-E03/E04, s005-E03). |
| NyE-02 | FIXED (változatlan) | Az E-03 p04-sora a szabályt mondja ki, jelentéskülönbséget nem állít. Nyelvileg pontos. |
| NyE-03 | FIXED (változatlan) | A C minta nem változott. |
| NyE-04 | **OPEN** (MINOR) | Nem változott. Az i05-2-ben a *Je vais en prendre deux, des croissants.* sem az N02-be, sem az N06-ba nem esik, ezért a semleges `incorrect` szöveget kapja. Ez a szám és az *en* ellenőrzésére utasít, holott a mondat helyes. Az i06-ban a *Nous ne voulons pas en acheter, des chouquettes.* az `incorrect` szöveget kapja: *„nem maradt-e meg mellette a főnév vagy a determináns”*. Ez a helyes beszélt nyelvi kihelyezést hibának mutatja. Az új i06-instrukció mellett ez valóban nem a kért művelet, ezért F-kategóriába kell tenni, nem hibának jelölni. |
| NyE-05 | FIXED (változatlan) | – |
| NyE-06 | FIXED (változatlan) | – |
| NyE-07 | lezárva (NOTE) | – |
| NyE-08 | **OPEN** (NOTE) | A 0.3 kaput továbbra sem tudom teljesültnek jelenteni (részletek alább). A segitseg-1 kérés folyamatban van, újra nem kérem. |
| NyE-09 | **OPEN** (MINOR) | Az 1. rész általános szabálya továbbra is minden teljes mondatos mezőre engedi az *Oui,* és a *Non,* bevezetőt. Így elfogadható lenne például a *Non, j'en prends.*, a *Volontiers, je n'en veux pas.* és a *Non merci, je vais en prendre trois.* (s006). A mezőtáblák már helyesen bontanak: az 1. és a 2. mező igenlő, a 3. tagadó, a 4. mezőnek és az s006-nak nincs bevezetője. Az általános szabály azonban ellentmond nekik. |
| NyE-10 | **FIXED** | Az E-04 írott, igés, teljes mondatot ad. A *des* így természetes és kötelező; a névelő nélküli feliratolvasat kizárt. |
| NyE-11 | **FIXED** | Az E-02 szövege egyértelmű: *Ton brouillon contient deux phrases fausses. Dans chacune, corrige seulement l'erreur et garde tous les autres mots.* Helyes francia, és nem sugallja, hogy minden mondatban hiba van. |
| NyE-12 | **FIXED** (NOTE) | Az R2 mellől eltűnt a tételes hibalista, így a *des bons chèvres* már nem áll nyelvi hibaként. |
| NyE-13 | **FIXED** | A *J'en veux bien* és változatai az N05-be kerültek. Az N05 a 3. és a 4. mezőben is nyelvileg rendben van: *Non merci, je n'en prends pas* (cukorra természetes), illetve *Nous en avons pris trois*. |

**NyE-08 részletei:**
- Ebben a körben egy webes keresést futtattam a Vitrine linguistique-re szűkítve. A találat a kért lapot adja: *DES : emploi devant un adjectif antéposé*.
- A keresési összefoglaló szerint az alapszabály a *de* + előretett melléknév. Kivétel, ha a melléknév és a főnév összetett főnevet alkot; a felsorolt példák: *des petits pois*, *des grands-pères*, *des beaux-parents*.
- A *des petits pains* példát a kivonat nem idézi szó szerint a lapról, és a lapot nem nyitottam meg. A szabály így megerősítést kap, a konkrét példa nem.
- A 0.3 kapu ezért **nem teljesült**, és a feltételes szabály (E-09) marad.
- Nyelvi ítéletem változatlan: a termékjelentésben a *des petits pains* helyes, és gondozott szövegben ez a mérce.

## Findingtábla (nyitott)

| ID | Súly | Hely | Probléma | Bizonyíték | Javaslat |
|---|---|---|---|---|---|
| NyE-04 | MINOR | i05, 2. mező; i06, 2. mondat | A vesszővel kihelyezett helyes alakot az `incorrect` feedback hibának mutatja. | Saját próba: *Je vais en prendre deux, des croissants.* és *Nous ne voulons pas en acheter, des chouquettes.* – mindkettő helyes beszélt nyelvi kihelyezés. | i05: az N02 hatóköre bővüljön ki a 2. mezőre is: „1, 2, 3”, a rövid alak itt *je vais en prendre deux*. i06: új F-sor, ilyen feedbackkel: „A vesszős kihelyezés helyes, de az instrukció szerint csak a hibát javítod: törölni kell a « des »-t → « nous ne voulons pas en acheter »”. |
| NyE-09 | MINOR | 1. rész, „Teljes mondatos mező”, elfogadott bevezetők | Az általános szabály jelentésben ellentmondó bevezetőt is elfogad. | Lásd a fenti státusztáblát. | Az általános listát törölni kell, vagy ki kell mondani: „bevezető csak a mezőtáblában felsorolt alakkal fogadható el”. Az s006-ban bevezető legfeljebb *Oui,* lehet. |

**Hibátlannak találtam (nincs finding):**
- i01 és i02 (változatlan);
- i03: OK, E01–E06, F01, `incorrect`;
- i04 (változatlan);
- i05: E01–E15, N01, N03–N06, valamint a kulcsok és az elfogadott alakok;
- i06: kulcs, elfogadott alak, F01–F06, E01–E05; kivétel a NyE-04 maradéka;
- s001–s005: minden OK-, E-, F- és `incorrect` sor;
- s006 (változatlan);
- i08: az ellenőrzőlista mind a hat francia példája (*du sel ↔ le prix du sel*, *de jolies assiettes*, *beaucoup des voitures du parking*, *il en a bu deux*, *elle va en couper deux*), a rubrika, E01–E05, R1 és R2;
- a kézirat új francia szövegei: E-01, E-02, E-04, E-05, E-08.

## NOTE-ok más ellenőröknek

- **NavE / PE:** az i06 F05 indoka szerint *„új szót tettél bele”*. Közben a *Je vais vous en prendre deux* elfogadott, pedig abba is új szó (*vous*) kerül. Nyelvileg mindkét döntés védhető, de a tanuló a kettőt következetlennek láthatja. Érdemes az F05-öt a jelentésváltozásra szűkíteni („így csak a húszat utasítod el”), és elhagyni az „új szó” indokot.
- **UE:** a p08 instrukciója (*Complète ou transforme…*) és az i07 instrukciója (E-01) egymás alatt áll. A francia mindkettőben helyes, de kétszer szerepel; nézzétek meg telefonon.
- **CEO:** a 0.3 kapu nyitott. A keresési kivonat a kivételszabályt alátámasztja, a *petits pains* példát nem. A segitseg-1 válasza zárja le.

## Változáslista

- FIXED: NyE-01, NyE-10, NyE-11, NyE-12 és NyE-13.
- OPEN (MINOR, változatlan): NyE-04 és NyE-09.
- OPEN (NOTE): NyE-08.
- Új finding nincs.

**Bizonyíték:**
- **Új:** saját, kulcs nélküli próba a változott itemeken, valamint egy webes keresés: [DES : emploi devant un adjectif antéposé – Vitrine linguistique](https://vitrinelinguistique.oqlf.gouv.qc.ca/23496/la-grammaire/les-determinants/determinants-indefinis/des-devant-un-adjectif-antepose). Ez csak keresési kivonat, a lapot NEM NYITOTTAM MEG.
- **Újrahasznosított:** a korábbi körök saját próbái a változatlan itemekre. Grevisse: NEM VIZSGÁLT.

**Recheck-hatókör:**
- NyE-04: az i05 N02 hatóköre és az i06 új F-sora;
- NyE-09: az 1. rész bevezető-szabálya;
- NyE-08: a segitseg-1 válasza után a 0.3 kapu.

**Következő címzett:** CEO.

GEPI_OSSZEGZES
verdict: REVIEW_PASS
blocker: 0
major: 0
minor: 2
GEPI_OSSZEGZES_VEGE