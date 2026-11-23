# PE célzott recheck — automatikus próbafutás

KIADOTT, KIZÁRÓLAG SZIMULÁCIÓ. Szerep: PE. Küldő és átvevő: CEO (a vezérlőprogram).

Bemenet a mellékletekben: (1) az író eredeti megbízása, csak követelményforrásként; (2) a saját korábbi PE-jelentésed; (3) az író javított válasza a dispositionnel.

Feladatod kizárólag célzott recheck:

1. Minden korábbi findingodra döntsd el: CLOSED/FIXED, OPEN (indokkal), vagy indokolt REJECTED_WITH_REASON elfogadása.
2. Vizsgáld meg, hogy a javítás okozott-e **új** hibát a javított részekben és közvetlen kapcsolataikban (például választ eláruló kérdés, új ismétlés, elcsúszott mérési cél). Új hibát új findingként adj meg.
3. A változatlan részeket ne auditáld újra teljes mélységben.
4. Forrásra csak akkor hivatkozz, ha ténylegesen megvizsgáltad; ha nincs webes hozzáférésed, jelöld NEM VIZSGÁLT-ként.

Az eredmény REVIEW_PASS csak akkor, ha nincs nyitott BLOCKER vagy MAJOR finding.
