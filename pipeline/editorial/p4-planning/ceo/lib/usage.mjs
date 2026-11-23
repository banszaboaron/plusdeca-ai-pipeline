// Keretfigyelés (Áron kérése, 2026-10-28): a CEO 95%-os kerethasználatnál ne indítson új hívást, hanem
// várja meg a keret visszaállását; keretkimerülési hibánál se bukjon el, hanem várjon és ugyanattól a lépéstől folytassa.
//
// Két adatforrás, ugyanabba a fájlba (alap: %USERPROFILE%\.claude\plusdeca-usage.json):
//  - a Claude Code statusline-szkriptje (tools/statusline/plusdeca-usage.mjs): rate_limits.five_hour / seven_day;
//  - a CEO saját `claude -p --output-format stream-json` hívásai: rate_limit_event → unifiedWindows.
// A fájl formátuma (plusdeca-usage/1):
//   { schema, updatedAt, source, five_hour: { used_percentage, resets_at }, seven_day: { … } }
// ahol used_percentage 0–100, resets_at Unix-idő másodpercben.

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export const USAGE_SCHEMA = 'plusdeca-usage/1';

/**
 * Egy hívás keretköltsége (2026-11-15, az 1. hét mérése alapján): súlyozott token = bemenet ×1 + cache-írás ×1,25
 * + cache-olvasás ×0,1 + kimenet ×5; a heti keret 1%-a ≈ 3,4 M súlyozott token (WEEK_PCT_TOKENS). Becslés, nem a
 * szolgáltató elszámolása; a lépésrekordba kerül, hogy a heti beosztás lépésenkénti adatból dolgozzon.
 */
export const WEEK_PCT_TOKENS = 3_400_000;
export function budgetOf(u) {
  const input = u.input_tokens ?? 0; const output = u.output_tokens ?? 0;
  const cacheWrite = u.cache_creation_input_tokens ?? 0; const cacheRead = u.cache_read_input_tokens ?? 0;
  const weighted = Math.round(input + cacheWrite * 1.25 + cacheRead * 0.1 + output * 5);
  return { input, output, cacheWrite, cacheRead, weighted, weekPct: Math.round((weighted / WEEK_PCT_TOKENS) * 1000) / 1000 };
}
export const DEFAULT_USAGE_FILE = join(homedir(), '.claude', 'plusdeca-usage.json');
export const WINDOWS = ['five_hour', 'seven_day'];

/**
 * A `claude -p --output-format stream-json --verbose` kimenetének értelmezése.
 * text: a végső válasz (a result sor), isError: a CLI hibát jelzett, rateLimit: az utolsó rate_limit_event,
 * windows: a kihasználtság ablakonként (0–100), tokens: be- és kimeneti tokenek összege, ha van.
 * Ha a kimenet nem stream-json (nincs egyetlen JSON-sor sem), null.
 */
const RESUME_PROMPT = /^Output token limit hit\b/;
const OUTPUT_LIMIT_ERROR = /CLAUDE_CODE_MAX_OUTPUT_TOKENS/;
function isResumePrompt(e) {
  if (e.type !== 'user') return false;
  const content = e.message?.content;
  if (typeof content === 'string') return RESUME_PROMPT.test(content.trim());
  return Array.isArray(content) && content.length > 0 && content.every(c => c.type === 'text' && RESUME_PROMPT.test(String(c.text).trim()));
}

export function parseStreamJson(stdout) {
  const events = [];
  for (const line of String(stdout ?? '').split(/\r?\n/)) {
    const s = line.trim();
    if (!s.startsWith('{')) continue;
    try { events.push(JSON.parse(s)); } catch { /* nem JSON-sor */ }
  }
  if (!events.length) return null;
  const result = [...events].reverse().find(e => e.type === 'result');
  const rateEvents = events.filter(e => e.type === 'rate_limit_event' && e.rate_limit_info);
  const info = rateEvents.at(-1)?.rate_limit_info ?? null;
  let text = result?.result;
  // Az utolsó eszközhívás utáni assistant-szövegek együtt: ha a válasz a kimeneti korlát miatt több üzenetre tört,
  // a result sor csak az utolsó darabot adja (U34 megoldas-e1-rev2, 10-29: a BLOKK_JSON eleje elveszett).
  // A CLI a korlátnál „Output token limit hit. Resume directly…” felhasználói üzenetet szúr be (legfeljebb 3-at);
  // ez nem eszközhívás-határ, a darabok összetartoznak (U33 megoldas, 11-09: kétszer csak a középső darab maradt).
  const lastUser = events.findLastIndex(e => e.type === 'user' && !isResumePrompt(e));
  const after = events.slice(lastUser + 1);
  const resumes = after.filter(isResumePrompt).length;
  const tail = after.filter(e => e.type === 'assistant')
    .map(e => (e.message?.content ?? []).filter(c => c.type === 'text').map(c => c.text).join('')).filter(Boolean);
  let joined = tail.join('');
  // A korlát kimerülése után a CLI saját hibaszövege zárja a sort; ez nem a szerep válasza.
  const outputLimit = Boolean(result?.is_error) && typeof result?.result === 'string' && OUTPUT_LIMIT_ERROR.test(result.result);
  if (outputLimit && joined.endsWith(result.result)) { joined = joined.slice(0, -result.result.length); text = joined; }
  if (typeof text !== 'string') {
    // Ha nincs result sor (pl. megszakadt), az utolsó assistant-üzenetek szövege.
    text = joined;
  } else if (text && joined.length > text.length && joined.endsWith(text)) {
    text = joined;
  }
  const usage = result?.usage;
  const tokens = usage ? (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) : null;
  return {
    text: text ?? '',
    resumes,
    outputLimit,
    isError: Boolean(result?.is_error) || (result?.subtype != null && result.subtype !== 'success'),
    rateLimit: info ? { status: info.status ?? null, resetsAt: info.resetsAt ?? null, type: info.rateLimitType ?? null } : null,
    windows: info ? windowsFromEvent(info) : null,
    tokens,
    usage: usage ? budgetOf(usage) : null,
    // A munkamenet azonosítója (a közös ellenőri munkamenet folytatásához: --resume <id> --fork-session).
    sessionId: result?.session_id ?? events.find(e => e.session_id)?.session_id ?? null,
  };
}

const pct = utilization => (typeof utilization === 'number' ? Math.round(utilization * 1000) / 10 : null);

/** rate_limit_info → { five_hour: { used_percentage, resets_at }, seven_day: … } (ami van belőle). */
export function windowsFromEvent(info) {
  const out = {};
  for (const w of WINDOWS) {
    const src = info.unifiedWindows?.[w];
    if (src) out[w] = { used_percentage: pct(src.utilization), resets_at: src.resetsAt ?? null };
  }
  // Régebbi alak: csak az aktuális ablak utilization mezője.
  if (!Object.keys(out).length && info.rateLimitType && typeof info.utilization === 'number') {
    out[info.rateLimitType] = { used_percentage: pct(info.utilization), resets_at: info.resetsAt ?? null };
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Keretkimerülés felismerése egy sikertelen hívás kimenetéből. Eredmény: { limited, resetAt (ms) | null }.
 * Jelek: rate_limit_event "rejected" állapottal; „usage limit” / „rate limit” / 429 a hibaszövegben;
 * a CLI régi alakja: „Claude AI usage limit reached|<unix-idő>”.
 */
export function detectRateLimit({ stdout = '', stderr = '', stream = null, now = Date.now() } = {}) {
  const status = stream?.rateLimit?.status;
  const rejected = status === 'rejected';
  const text = `${stream?.isError ? stream.text : ''}\n${stderr}\n${stream ? '' : stdout}`;
  const byText = /usage limit|rate[ _-]?limit|limit reached|too many requests|\b429\b|overloaded_error|out of (extra )?usage/i.test(text);
  if (!rejected && !(byText && (stream?.isError || !stream))) return { limited: false, resetAt: null };
  let resetAt = null;
  const epoch = text.match(/limit reached\|(\d{9,13})/i)?.[1];
  if (epoch) resetAt = epoch.length > 10 ? Number(epoch) : Number(epoch) * 1000;
  if (resetAt == null && rejected && stream.rateLimit.resetsAt) resetAt = Number(stream.rateLimit.resetsAt) * 1000;
  if (resetAt == null) resetAt = parseResetClock(text, now);
  return { limited: true, resetAt };
}

/** „resets 3pm” / „resets at 15:00” → a következő ilyen időpont (helyi idő), ms; ha nincs, null. */
export function parseResetClock(text, now = Date.now()) {
  const m = String(text).match(/resets?\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2] ?? 0);
  if (m[3]) { hour %= 12; if (/pm/i.test(m[3])) hour += 12; }
  if (hour > 23 || minute > 59) return null;
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  if (d.getTime() <= now) d.setDate(d.getDate() + 1);
  return d.getTime();
}

export async function readUsage(file = DEFAULT_USAGE_FILE) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return null; }
}

/** A keretfájl frissítése (atomikusan); a meglévő ablakadatot csak a kapott ablakokra írja felül. */
export async function writeUsage(file, windows, { source = 'ceo-stream', now = Date.now() } = {}) {
  if (!windows) return null;
  const previous = (await readUsage(file)) ?? {};
  const next = { ...previous, schema: USAGE_SCHEMA, updatedAt: new Date(now).toISOString(), source };
  for (const w of WINDOWS) if (windows[w]) next[w] = windows[w];
  await mkdir(dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}-${now}`;
  await writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  await rename(tmp, file);
  return next;
}

/**
 * A 95%-os kapu: { wait, percent, window, until (ms), stale }. Hiányzó fájlnál nem vár (a tartalék: a hívás
 * hibájának figyelése). Ha a visszaállás ideje már elmúlt, az az ablak nem számít. Elavult (staleMinutes-nál
 * régebbi) adatnál csak az ismert visszaállási idejű ablak számít: az ablakon belül a kihasználtság nem csökken,
 * így egy régi ≥ küszöb érték most is igaz (2026-10-31; addig az elavult fájl a kaput kikapcsolta).
 */
export function usageGate(usage, { threshold = 95, staleMinutes = 30, now = Date.now() } = {}) {
  if (!usage?.updatedAt) return { wait: false, stale: true };
  const age = now - Date.parse(usage.updatedAt);
  const stale = !(age >= 0 && age <= staleMinutes * 60_000);
  let worst = null;
  for (const w of WINDOWS) {
    const win = usage[w];
    if (!win || typeof win.used_percentage !== 'number') continue;
    const until = win.resets_at ? Number(win.resets_at) * 1000 : null;
    if (until != null && until <= now) continue;
    if (stale && until == null) continue;
    if (win.used_percentage >= threshold && (!worst || (until ?? Infinity) > (worst.until ?? Infinity))) {
      worst = { window: w, percent: win.used_percentage, until };
    }
  }
  return worst ? { wait: true, stale, ...worst } : { wait: false, stale };
}
