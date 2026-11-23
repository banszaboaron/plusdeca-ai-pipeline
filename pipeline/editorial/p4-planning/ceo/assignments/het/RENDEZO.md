# Oszloprendezői anyag és blokkkiosztás — {{ROLE}}

Állapot: KIADOTT. Küldő és átvevő: CEO (a vezérlőprogram).

Készítsd el az oszlop rendezői anyagát a szerepleírásod szerint, és — mivel a főírói kör megszűnt — végezd el a kiosztást is: osszd a heti anyagot az oszlop blokkjaira, készíts lefedési mátrixot, és ahol az oszlopnak van zárótesztje, tesztblueprintet. A mellékletben megkapod a jóváhagyott heti koncepciót, a neked szóló FR-briefet, a korábbi rendezők elfogadott anyagát és az oszlop blokkjainak listáját.

A kimeneted szerkezete kötelező, mert a CEO ebből vágja ki a blokkírók megbízását:

- `## RENDEZŐI ANYAG` — célazonosítós jegyzék, források, tartalmazza/nem tartalmazza, hiányok.
- `## LEFEDÉSI MÁTRIX` — cél → blokk → mélység → teszt.
- Blokkonként egy szakasz pontosan ezzel a fejléccel: `## BLOKK <blokk-ID>` (pl. `## BLOKK GI1`). Tartalma: célok, tartalmi határ, mélység, tervezett hossz/időkeret, a négy fázis (Terv, Kézirat, Megoldás, Egyesítés) bemeneti követelményei, és a blokkhoz tartozó források. A blokkíró csak ezt a szakaszt és a heti koncepciót kapja meg, ezért legyen önállóan érthető.

Ne írj kész tanulói szöveget vagy kulcsot.
