#!/usr/bin/env node
// Review-kötés kitöltése:
//   node p5/bind.mjs <block.json|week.json> --handoffs <mappa> [--write]
// Kiszámolja a review-zott kéziratlánc fájl-hash-eit és a tartalom-hash-t
// (kanonikus JSON a kötés mezője nélkül). P5 blokknál a `review`, v1.1 heti
// csomagnál egységenként a `reviewBinding` mezőt tölti ki. --write nélkül csak kiírja.
// Csak akkor használd, ha a tartalom valóban a review-zott kéziratból készült:
// a kötés nem ellenőriz, csak rögzít (az ellenőrzés a gates.mjs dolga).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadReviewChain } from './lib/manuscripts.mjs';
import { canonicalHash } from './lib/normalize.mjs';

export function bindBlock(block, handoffsDir, { chain: givenChain } = {}) {
  const chain = givenChain ?? loadReviewChain(handoffsDir, block.id);
  if (!chain.found) throw new Error(`Nincs REVIEW_PASS kézirat: ${chain.reviewPass}`);
  if (chain.status !== 'REVIEW_PASS') throw new Error(`A ${chain.reviewPass} nem rögzít REVIEW_PASS-t`);
  const { review, ...content } = block;
  return {
    ...block,
    review: {
      status: 'REVIEW_PASS',
      reviewPass: chain.reviewPass,
      manuscripts: chain.files.map(file => ({ file: file.file, sha256: file.sha256, role: file.role })),
      contentSha256: canonicalHash(content)
    }
  };
}

export function bindWeek(week, handoffsDir) {
  const cache = new Map();
  const bindEntity = entity => {
    const chain = loadReviewChain(handoffsDir, entity.id, cache);
    if (!chain.found || chain.status !== 'REVIEW_PASS') return entity;
    const { reviewBinding, ...content } = entity;
    return {
      ...content,
      reviewBinding: {
        reviewPass: chain.reviewPass,
        manuscripts: chain.files.map(file => ({ file: file.file, sha256: file.sha256 })),
        contentSha256: canonicalHash(content)
      }
    };
  };
  return { ...week, units: (week.units || []).map(bindEntity), tests: (week.tests || []).map(bindEntity) };
}

function main(argv) {
  const args = argv.slice(2);
  const index = args.indexOf('--handoffs');
  const handoffs = index >= 0 ? args.splice(index, 2)[1] : undefined;
  const write = args.includes('--write');
  const [input] = args.filter(arg => arg !== '--write');
  if (!input || !handoffs) { process.stderr.write('Használat: node p5/bind.mjs <block.json> --handoffs <mappa> [--write]\n'); return 2; }
  const data = JSON.parse(readFileSync(input, 'utf8'));
  const isBlock = typeof data.schemaVersion === 'string' && data.schemaVersion.startsWith('p5-block');
  const bound = isBlock ? bindBlock(data, resolve(handoffs)) : bindWeek(data, resolve(handoffs));
  if (write) writeFileSync(input, `${JSON.stringify(bound, null, 2)}\n`);
  else process.stdout.write(`${JSON.stringify(isBlock ? bound.review : [...bound.units, ...bound.tests].map(entity => ({ id: entity.id, reviewBinding: entity.reviewBinding ?? null })), null, 2)}\n`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv);
