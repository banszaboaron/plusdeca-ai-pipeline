# Teacher rating packet (prepared, not yet rated)

**Status:** not filled in. No teacher rating exists for this eval set yet. Every number in `results/` is
measured against construction labels, not against a teacher.

**Purpose:** to turn the construction labels into a human reference, and to check the quality of the feedback
itself (not only the pass/revise verdict).

## For the rater (magyarul)

Két táblázat van, ebben a sorrendben töltsd ki:

1. **`A-blind-rating.csv`** (vak értékelés, kb. 30–40 perc): 28 tanulói válasz, a gép véleménye nélkül.
   Válaszonként add meg:
   - elfogadnád-e (`pass`), vagy javíttatnád (`revise`);
   - egy 0–5 pontszámot (5 = hibátlan, 4 = apró hiba, 3 = lényegében jó, de javítandó, 2 vagy kevesebb = nem fogadható el);
   - a hibákat, amelyeket bejelölnél (`idézet -> javítás`, pontosvesszővel elválasztva).

   A válaszok egy B1-es, magyar anyanyelvű tanulótól származnak (illetve úgy készültek). Az elfogadás mércéje:
   „ezt a szöveget így elfogadnám ettől a tanulótól ezen a szinten”.
2. **`B-feedback-review.csv`** (kb. 30 perc, csak az A rész után nyisd meg): a rendszer visszajelzései
   tételesen. Soronként: valódi hiba-e (`y`/`n`), helyes-e a javítás, érthető-e a magyar magyarázat.
   Ha egy hibát a rendszer kihagyott, az A részben már jelölted, itt nem kell újra.

Bármelyik cellába írhatsz megjegyzést. A kitöltött fájlokat `teacher-packet/ratings/<monogram>-<dátum>/` alá kell tenni.

## What will be computed from it

- Agreement between the teacher and the construction labels (verdict, and score within ±1).
- False accept and false reject rates of the pipeline, with the teacher as the reference.
- The precision of the reported errors (phase B, `is_real_error`), and the share of correct fixes.
- Errors the teacher marks in phase A that the pipeline did not report (recall against the teacher).

One rater is a reference point, not ground truth: with one rater, inter-rater agreement cannot be measured.

Regenerate the sheets: `node scripts/teacher-packet.mjs` (from the recorded run, no model call).
