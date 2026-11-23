import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

test('vendored production files are unchanged (hashes in vendor/PROVENANCE.md)', () => {
  const doc = readFileSync(new URL('../vendor/PROVENANCE.md', import.meta.url), 'utf8');
  for (const name of ['ellenorzes.js', 'ellenorzes-prompt.mjs']) {
    const row = doc.split('\n').find(l => l.startsWith(`| \`${name}\``));
    const want = /`([0-9a-f]{64})`/.exec(row ?? '')?.[1];
    const got = createHash('sha256').update(readFileSync(new URL(`../vendor/${name}`, import.meta.url))).digest('hex');
    assert.equal(got, want, name);
  }
});
