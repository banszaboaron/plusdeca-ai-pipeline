// Az agentdefiníciók a 2026-10-05-i véglegesített forrásszövegekből (agents-src/) készülnek:
//   KOZOS.md            közös alap (a Plusdeça, a négyfázisú automatizált rend, munkaszabályok, átadás)
//   ELLENORZOLISTA.md   itemszintű ellenőrzőlista (blokkírók, megoldásíró, PE)
//   ELLENOR-KOZOS.md    az öt ellenőr közös szabályai
//   <szerep>.md         szerepenkénti leírás (FR, GR, RR, VR, XR, BLOKKIRO, MEGOLDASIRO, F, PE, NavE, NyE, HE, UE)
// A blokkok listája és blokksajátosságai továbbra is a starter-kits/roles.mjs-ből jönnek (a régi
// ChatGPT-szerepcsomagokat ez a generátor nem érinti). A független megoldó: assignments/SOLVER-AUTO.md.
//
// Ebből készülnek a repó gyökerében a .codex/agents/*.toml és .claude/agents/*.md fájlok
// (build-agents.mjs), és ugyanezt használja a CEO-vezérlő agent-módban. Hálózatot nem használ.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { blocks } from '../../starter-kits/roles.mjs';
import { paths } from './paths.mjs';

const read = p => readFileSync(p, 'utf8');
const src = name => read(join(paths.agentsSrc, name)).trim();

const LEAD_TO_DIRECTOR = { GI: 'GR', RI: 'RR', VI: 'VR', XI: 'XR' };

/**
 * A régi szervezet kifejezéseit a mostani rendre cseréli (a roles.mjs blokksajátosságaiban még előfordulnak).
 */
export function modernize(text) {
  return String(text)
    .replace(/FR→rendező→főíró→blokk/g, 'FR→rendező→blokk')
    .replace(/oszlopfőíró/g, 'oszloprendező')
    .replace(/főíró/g, 'oszloprendező')
    .replace(/öt fázis/g, 'négy fázis')
    .replace(/(?<![\/\w])(GI|RI|VI|XI)(?![\w\/])/g, m => LEAD_TO_DIRECTOR[m]);
}

export const COLUMNS = {
  G: { lead: 'GI', director: 'GR', name: 'nyelvtan' },
  R: { lead: 'RI', director: 'RR', name: 'olvasás / UoF' },
  V: { lead: 'VI', director: 'VR', name: 'szókincs' },
  X: { lead: 'XI', director: 'XR', name: 'változó (X)' },
};

/** A közös alap: a forrásfájl változatlanul. */
export const commonCore = () => src('KOZOS.md');
export const ITEM_CHECKLIST = src('ELLENORZOLISTA.md');
/** Visszafelé kompatibilis név: a közös alap szervezeti része. */
export const AUTOMATED_ORG = commonCore().slice(commonCore().indexOf('## Szervezet és működés'), commonCore().indexOf('## Munkaszabályok')).trim();

const OUTPUT_RULE = `## Kimenet

A választ Markdownban add, a közös alap „Válasz és átadás” része szerint. A CEO-vezérlő a megbízás végén megadja a kötelező gépi összegzést (GEPI_OSSZEGZES … GEPI_OSSZEGZES_VEGE); azt pontosan a megadott formában, a válasz legvégére írd.`;

function columnBlocks(columnKey) {
  const { lead } = COLUMNS[columnKey];
  return blocks.filter(([, , , l]) => l === lead);
}

function blockTable(columnKey) {
  const rows = columnBlocks(columnKey).map(([id, pos, title, , notes]) => `| ${id} | ${pos} | ${title} | ${modernize(notes).replace(/\|/g, '/')} |`);
  return ['## Az oszlop blokkjai', '', '| Blokk | Koordináta | Cím | Blokksajátosság |', '|---|---|---|---|', ...rows].join('\n');
}

const join2 = (...parts) => parts.filter(Boolean).map(p => p.trim()).join('\n\n');

function writerAgent(columnKey) {
  const col = COLUMNS[columnKey];
  const ids = columnBlocks(columnKey).map(([id]) => id);
  return {
    name: `plusdeca-${columnKey.toLowerCase()}-iro`,
    platform: 'codex',
    description: `Plusdeça ${col.name}-oszlop blokkírója (${ids.join(', ')}): Terv és Kézirat fázis egy megnevezett blokkra.`,
    sourceRoles: ['agents-src/BLOKKIRO.md', ...ids.map(id => `roles.mjs:${id}`)],
    effort: 'high',
    body: join2(`# Blokkíró — ${col.name} oszlop (oszloprendező: ${col.director})`, src('BLOKKIRO.md'), ITEM_CHECKLIST, blockTable(columnKey)),
  };
}

function directorAgent(columnKey) {
  const col = COLUMNS[columnKey];
  return {
    name: `plusdeca-${col.director.toLowerCase()}`,
    platform: 'codex',
    description: `Plusdeça ${col.name}-oszlop rendezője (${col.director}): oszlopterv, blokkonkénti kiosztás, tesztblueprint és megfelelési jelentés.`,
    sourceRoles: [`agents-src/${col.director}.md`],
    effort: 'high',
    body: join2(src(`${col.director}.md`), blockTable(columnKey)),
  };
}

function simpleAgent(name, file, description, extra = []) {
  return { name, platform: 'codex', description, sourceRoles: [`agents-src/${file}`], effort: 'high', body: join2(src(file), ...extra) };
}

function reviewerAgent(id, description, { checklist = false } = {}) {
  const name = `plusdeca-${id.toLowerCase()}`;
  return { name, platform: 'codex', description, sourceRoles: [`agents-src/${id}.md`, 'agents-src/ELLENOR-KOZOS.md'], effort: 'high',
    body: join2(src(`${id}.md`), checklist ? ITEM_CHECKLIST : '', src('ELLENOR-KOZOS.md')),
    // A szerepre jellemző rész (a közös ellenőri munkamenetben az üzenet végére kerül; lib/engine.mjs sharedSession).
    reviewerRole: id, roleBody: join2(src(`${id}.md`), checklist ? ITEM_CHECKLIST : '') };
}

/**
 * Közös ellenőri agent (2026-11-15, cache-mérés): egy lektori kör minden ellenőre ugyanezt a rendszerpromptot kapja, és
 * ugyanabból az előmelegített munkamenetből indul (a közös anyag már a cache-ben van); a szerepleírás (roleBody) és a
 * szerep megbízása az üzenet végére kerül (reviewerRoleText). Tartalma az ellenőri agentek közös része: ELLENOR-KOZOS.md,
 * a közös alap és a kimeneti szabály; a szerepenkénti agentfájlok (build-agents.mjs) változatlanok.
 */
export const SHARED_REVIEWER_NAME = 'plusdeca-ellenor';
export function sharedReviewerAgent() {
  const instructions = `# ${SHARED_REVIEWER_NAME}

Te a Plusdeça egyik független ellenőre vagy. A konkrét szerepedet (PE, NavE, NyE, HE vagy UE), a szerepleírásodat és a megbízásodat az utolsó üzenet adja meg; az a szerepleírás a te állandó utasításod ebben a munkamenetben. Ha az üzenet csak a vizsgálandó anyagot tartalmazza, szerepleírás és megbízás nélkül, az a CEO-vezérlő előkészítő hívása: ne vizsgáld, ne használj eszközt, csak ennyit válaszolj: OK

${src('ELLENOR-KOZOS.md')}

---

${commonCore()}

${OUTPUT_RULE}
`;
  return {
    name: SHARED_REVIEWER_NAME, platform: 'claude', sourceRoles: ['agents-src/ELLENOR-KOZOS.md', 'agents-src/KOZOS.md'],
    description: 'Plusdeça független ellenőr (közös): a konkrét szerepet a megbízás vége adja meg. Csak akkor használd, ha a CEO-vezérlő kéri.',
    instructions,
  };
}

/** A szerepleírás a közös ellenőri munkamenet üzenetének elejére (az agent-mód szerepleírásának megfelelője). */
export function reviewerRoleText(agent) {
  return `# Szerepleírásod — ${agent.reviewerRole} (${agent.name})

Az alábbi szerepleírás a te állandó utasításod ebben a munkamenetben; a fent kapott anyagot ennek és az alábbi megbízásnak megfelelően vizsgáld.

${agent.roleBody.trim()}

---

`;
}

function solverAgent() {
  const text = read(join(paths.assignments, 'SOLVER-AUTO.md'))
    .replace('csak az alábbi szövegből dolgozz', 'csak a kapott szövegből dolgozz');
  return {
    name: 'plusdeca-solver',
    platform: 'claude',
    description: 'Plusdeça független megoldó: a tanulói feladatlapot kulcs nélkül megoldja, minden helyes választ felsorol, jelzi a kétértelmű vagy választ eláruló feladatot. Csak akkor használd, ha a CEO-vezérlő tanulói feladatlapot ad át.',
    sourceRoles: ['assignments/SOLVER-AUTO.md'],
    body: text.trim(),
  };
}

/** Az összes agent, determinisztikus sorrendben. */
export function buildAgents() {
  const core = commonCore();
  const agents = [
    simpleAgent('plusdeca-fr', 'FR.md', 'Plusdeça főrendező (FR): heti koncepció és a négy oszloprendezői megbízás.'),
    ...Object.keys(COLUMNS).map(directorAgent),
    ...Object.keys(COLUMNS).map(writerAgent),
    simpleAgent('plusdeca-megoldasiro', 'MEGOLDASIRO.md', 'Plusdeça megoldásíró: egy blokk Megoldás fázisa (kulcs, opciók, variánsok, feedback, rubrika), előbb saját megoldással.', [ITEM_CHECKLIST]),
    simpleAgent('plusdeca-f', 'F.md', 'Plusdeça fordító / glosszaszerző (F): a lezárt blokk tanulói francia szövegeinek kontextuális magyar glosszái.'),
    reviewerAgent('PE', 'Plusdeça szakmai ellenőr (PE): szakmai és szerkesztői minőség, életszerűség, mérési érvényesség, források.', { checklist: true }),
    reviewerAgent('NavE', 'Plusdeça követelmény- és szerkezeti ellenőr (NavE): a jó feladat, a jó időben, a jó módon — a lánc tételes egyezése.'),
    reviewerAgent('NyE', 'Plusdeça nyelvhelyességi ellenőr (NyE): francia nyelvtan, jelentés, kollokáció, regiszter, elfogadott alternatívák.'),
    reviewerAgent('HE', 'Plusdeça helyesírási és tipográfiai ellenőr (HE): francia és magyar írásmód, házistílus.'),
    reviewerAgent('UE', 'Plusdeça tanulói nézőpontú ellenőr (UE): végigjárás tanulóként, érthetőség, megoldhatóság, terhelés.'),
  ];
  for (const a of agents) {
    a.instructions = `# ${a.name}\n\n${a.body}\n\n---\n\n${core}\n\n${OUTPUT_RULE}\n`;
  }
  const solver = solverAgent();
  solver.instructions = `${solver.body}\n`;
  agents.push(solver);
  return agents;
}

/** Szerepek, amelyekhez szándékosan nincs agent, indoklással (a jelentés és a tesztek használják). */
export const NOT_GENERATED = {
  PRESIDENT: 'A felhasználó maga.',
  CEO: 'Program (CEO-vezérlő), nem modellszerep.',
  GI: 'Megszűnt; a feladat a GR-é.', RI: 'Megszűnt; a feladat az RR-é.', VI: 'Megszűnt; a feladat a VR-é.', XI: 'Megszűnt; a feladat az XR-é.',
  MEDIA: 'Eszközt (letöltés, átirat, hang) igényel; csak olvasási, eszköz nélküli munkamenetben nem végezhető. Külön döntés kell.',
  '*-5': 'Az Egyesítés gépi összeállítás + UE; nincs író agent.',
};

// ---------- Megjelenítés ----------

/** TOML többsoros alapkarakterlánc; minden " és \ escape-elve, vezérlőkarakter \\uXXXX. */
export function tomlMultiline(text) {
  const body = text
    .replace(/\r\n?/g, '\n')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
  return `"""\n${body}"""`;
}

export const tomlString = text => JSON.stringify(String(text));

export const GENERATED_NOTE = 'GENERÁLT FÁJL — ne szerkeszd kézzel. Forrás: editorial/p4-planning/starter-kits/roles.mjs + core/ (megoldó: ceo/assignments/SOLVER-AUTO.md), generátor: editorial/p4-planning/ceo/build-agents.mjs';

export function renderCodexToml(agent, { sandbox = 'read-only' } = {}) {
  const lines = [
    `# ${GENERATED_NOTE}`,
    `# Forrásszerepek: ${agent.sourceRoles.join(', ')}`,
    `name = ${tomlString(agent.name)}`,
    `description = ${tomlString(agent.description)}`,
  ];
  if (agent.effort) lines.push(`model_reasoning_effort = ${tomlString(agent.effort)}`);
  if (sandbox) lines.push(`sandbox_mode = ${tomlString(sandbox)}`);
  lines.push(`developer_instructions = ${tomlMultiline(agent.instructions)}`);
  return `${lines.join('\n')}\n`;
}

export function renderClaudeAgent(agent) {
  const desc = agent.description.replace(/\n/g, ' ');
  return `---\nname: ${agent.name}\ndescription: ${JSON.stringify(desc)}\n---\n\n<!-- ${GENERATED_NOTE} -->\n\n${agent.instructions}`;
}

/** Relatív útvonal → tartalom, a repó gyökeréhez képest. */
export function renderAgentFiles(agents = buildAgents()) {
  const files = {};
  for (const a of agents) {
    if (a.platform === 'codex') files[`.codex/agents/${a.name}.toml`] = renderCodexToml(a);
    else files[`.claude/agents/${a.name}.md`] = renderClaudeAgent(a);
  }
  return files;
}
