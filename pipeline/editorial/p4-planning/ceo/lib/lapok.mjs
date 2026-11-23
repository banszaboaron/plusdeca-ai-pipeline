// Hallgatási lapok csatolása a megbízáshoz (BRIEF_HALLGATASI_LAPOK_2026-10-30, 6. pont).
//
// A lapok (időkódos átirat és gépi mérések) a jogvédett anyag miatt gitben nincsenek, hanem a közös,
// worktree-n kívüli <media-folder>\lap\ mappában. Az olvasási módban futó agentek
// ezt nem látják (a Codex shell nélkül fut, a Claude csak a munkamappáját olvassa), ezért a vezérlő csatolja:
// ha a megbízásban vagy a mellékletében „HALLGATÁSI LAP: <ID>” sor szerepel, a lap teljes szövege mellékletként
// bekerül a promptba. Hiányzó lapnál rövid jelzés kerül be, hogy az agent ne találgasson.

import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { attachment } from './packets.mjs';

export const LAP_DIR = process.env.PLUSDECA_LAP_DIR ?? join(homedir(), 'projects', 'plusdeca-media', 'lap');
const REF = /HALLGAT[ÁA]SI LAP:\s*([A-Z0-9][A-Za-z0-9-]*[A-Za-z0-9])/g;

/** A szövegben hivatkozott lap-ID-k, első előfordulás szerinti sorrendben, ismétlés nélkül. */
export function listeningSheetIds(text) {
  return [...new Set([...String(text ?? '').matchAll(REF)].map(m => m[1]))];
}

/**
 * A hivatkozott lapok mellékletként, vagy null, ha nincs hivatkozás.
 * maxChars: a csatolt lapok együttes felső határa; ami fölötte van, azt csak megnevezzük.
 */
export async function listeningSheetAttachment(text, { dir = LAP_DIR, maxChars = 250_000 } = {}) {
  const ids = listeningSheetIds(text);
  if (!ids.length) return null;
  let out = '';
  let used = 0;
  for (const id of ids) {
    const title = `Hallgatási lap — ${id} (a vezérlő csatolta; átiraton és gépi méréseken alapul, nem emberi meghallgatás)`;
    let body;
    try { body = await readFile(join(dir, `${id}.md`), 'utf8'); } catch {
      out += attachment(title, `A lap nem található (${join(dir, `${id}.md`)}). Ne építs rá; jelezd a CEO-nak.`);
      continue;
    }
    if (used + body.length > maxChars) {
      out += attachment(title, `A lap nem fért a csatolási keretbe (${body.length} karakter). Kérj belőle kijelölt részletet.`);
      continue;
    }
    used += body.length;
    out += attachment(title, body);
  }
  return out;
}
