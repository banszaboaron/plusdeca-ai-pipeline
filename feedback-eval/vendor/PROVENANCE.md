# Vendored production code

These two files are copied **byte-for-byte** from the private Plusdeça repository (learner web app), commit
`6727e39` (2026-11-22). They are the code that runs in production, and this portfolio does not modify them.
Hungarian comments and identifiers are kept as they are, because Hungarian is the project's working language.

| File | Original path | SHA-256 |
|---|---|---|
| `ellenorzes.js` | `webapp/src/ellenorzes.js` | `d8c55d2a7f8bfe7210fa637868166a4da1b44838bcc99d955dbb2160e2e2fda3` |
| `ellenorzes-prompt.mjs` | `webapp/server/ellenorzes-prompt.mjs` | `3377577700ac7d8ab0a16d6e31007c03a4ac23583aa991dd780648193da1cbd2` |

`test/vendor.test.mjs` checks these hashes.

A short glossary (Hungarian → English) for reading the code:

| Hungarian | English |
|---|---|
| ellenőrzés / ellenőrző | check / checker |
| gépi szűrő | machine (deterministic) filter |
| `zaj`, `nem-francia`, `masolat`, `keves`, `sok`, `ures`, `hosszu` | noise, not French, copy of the task, too few words, too many words, empty, too long |
| `kulcsszo` (warning) | a keyword from the reference answer is missing |
| javítandó / elfogadva | revise / accepted |
| nyelvtan, szókincs, tartalom, feladat-teljesítés, helyesírás | grammar, vocabulary, content, task fulfilment, spelling |
| a szigorúbb nyer | the stricter result wins |
| tanulói válasz | learner answer |
