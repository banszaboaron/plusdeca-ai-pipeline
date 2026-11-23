#!/usr/bin/env node
// A típuspróba-hét szintetikus hangjai: tiszta szinuszhangok (nem nyelvi tartalom), 8 kHz, 16 bit, mono.
// Alapból ideiglenes mappába ír (a gitben lévő fixtúrák érintetlenek maradnak); a fixtúrák tudatos
// újragenerálása: node p5/test/fixtures/types/media/generate.mjs --write
// (A Math.sin utolsó bitjei platformonként eltérhetnek, ezért a --write más gépen más bájtokat adhat.)
// A test-pattern.mp4 (2 mp, 160×90, tesztábra, hang nélkül) ffmpeg-gel készült:
//   ffmpeg -f lavfi -i testsrc=size=160x90:rate=10:duration=2 -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an test-pattern.mp4
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function wav(frequency, seconds, rate = 8000) {
  const n = Math.round(seconds * rate), buffer = Buffer.alloc(44 + n * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + n * 2, 4); buffer.write('WAVEfmt ', 8); buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22); buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const fade = Math.min(1, i / 400, (n - i) / 400);
    buffer.writeInt16LE(Math.round(Math.sin(2 * Math.PI * frequency * i / rate) * 0.4 * fade * 32767), 44 + i * 2);
  }
  return buffer;
}

export const TONES = { 'tone-440.wav': [440, 0.5], 'tone-440-long.wav': [440, 0.6], 'tone-523.wav': [523, 0.5], 'tone-660.wav': [660, 0.5], 'tone-330.wav': [330, 0.8] };

/** A hangok legenerálása az adott mappába (alapból egy új ideiglenes mappába). */
export function generate(dir = mkdtempSync(join(tmpdir(), 'plusdeca-tones-'))) {
  for (const [name, [frequency, seconds]] of Object.entries(TONES)) writeFileSync(join(dir, name), wav(frequency, seconds));
  return dir;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = generate(process.argv.includes('--write') ? dirname(fileURLToPath(import.meta.url)) : undefined);
  console.log(`${Object.keys(TONES).join(', ')} → ${dir}`);
}
