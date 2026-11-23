// P5-előnézet: statikus HTML a lefordított v2 csomagból (első változat).
// Nem az app: a bejárás ezen ellenőrzi, hogy minden oldal kirajzolható, nem üres,
// és minden itemnek van kitölthető válaszhelye. A valódi app-bejárás akkor jön,
// amikor az app v2 csomagot tölt be (P1/egységesítés).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/gu, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const slug = id => id.split(':').slice(2).join('-');
const paragraphs = (text, lang) => String(text).split(/\n+/u).filter(Boolean).map(part => `<p lang="${lang}">${escapeHtml(part)}</p>`).join('');

const STYLE = `
:root{--ink:#1f1d1a;--paper:#fbf8f2;--line:#d9d2c4;--accent:#7a3b2e}
@media (prefers-color-scheme:dark){:root{--ink:#ece6da;--paper:#1c1a17;--line:#3d3830;--accent:#e0a48f}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.5 Georgia,serif}
main{max-width:720px;margin:0 auto;padding:16px}h1{font-size:1.4rem}h2{font-size:1.1rem;margin-top:1.5rem}
.stimulus{border-left:3px solid var(--line);padding-left:12px;margin:12px 0}
.item{border:1px solid var(--line);border-radius:8px;padding:12px;margin:16px 0}
label{display:block;margin:6px 0}textarea,input[type=text]{width:100%;font:inherit;padding:8px;border:1px solid var(--line);background:transparent;color:inherit}
textarea{min-height:8rem}table{border-collapse:collapse;width:100%}td,th{border:1px solid var(--line);padding:4px 6px;text-align:left}
nav a{color:var(--accent);margin-right:12px}ul.stimulus{padding-left:2rem}`;

function renderStimulus(stimulus) {
  if (stimulus.type === 'text') return `<div class="stimulus" data-stimulus="text">${paragraphs(stimulus.text, stimulus.language)}</div>`;
  if (stimulus.type === 'list') return `<ul class="stimulus" data-stimulus="list">${stimulus.entries.map(entry => `<li>${escapeHtml(entry)}</li>`).join('')}</ul>`;
  if (stimulus.type === 'table') return `<table class="stimulus" data-stimulus="table"><tr>${stimulus.columns.map(column => `<th>${escapeHtml(column)}</th>`).join('')}</tr>${stimulus.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</table>`;
  return `<div class="stimulus unsupported" data-unsupported="${escapeHtml(stimulus.type)}">Nem megjeleníthető tartalom: ${escapeHtml(stimulus.type)}</div>`;
}

function renderResponse(item, meta = {}) {
  const name = escapeHtml(item.id);
  const response = item.response;
  switch (response.type) {
    case 'single': return response.options.map(option => `<label><input type="radio" name="${name}" value="${escapeHtml(option.id)}" data-response> ${escapeHtml(option.label)}</label>`).join('');
    case 'multiple': return response.options.map(option => `<label><input type="checkbox" name="${name}" value="${escapeHtml(option.id)}" data-response> ${escapeHtml(option.label)}</label>`).join('');
    case 'text': return `<input type="text" name="${name}" data-response autocomplete="off">`;
    case 'fields': return response.fields.map(field => `<label>${escapeHtml(field.label)} <input type="text" name="${name}:${escapeHtml(field.id)}" data-response></label>`).join('');
    case 'writing': return `<textarea name="${name}" data-response data-words="${response.wordRange.min}-${response.wordRange.max}"></textarea>${meta.wordRangeDerived ? '' : `<p class="hint">${response.wordRange.min}–${response.wordRange.max} mots</p>`}`;
    case 'order': return `<ol data-response>${response.tokens.map(token => `<li>${escapeHtml(token.label)}</li>`).join('')}</ol>`;
    case 'speech': return `<button type="button" data-response>Enregistrer</button>`;
    default: return `<div class="unsupported" data-unsupported="${escapeHtml(response.type)}">Nem kitölthető válaszforma: ${escapeHtml(response.type)}</div>`;
  }
}

function pageHtml(week, block, page, index, presentation) {
  const prev = index > 0 ? `<a href="${slug(block.pages[index - 1].id)}.html">← Précédent</a>` : '';
  const next = index < block.pages.length - 1 ? `<a href="${slug(block.pages[index + 1].id)}.html">Suivant →</a>` : '';
  const items = page.items.map(item => `<form class="item" data-item="${escapeHtml(item.id)}">${paragraphs(item.prompt, 'fr')}${renderResponse(item, presentation?.items?.[item.id])}</form>`).join('');
  const after = presentation?.pages?.[page.id]?.visibleAfterSourceId;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(page.title)}</title><style>${STYLE}</style></head>
<body><main data-page="${escapeHtml(page.id)}"><nav><a href="index.html">Semaine ${week.number}</a>${prev}${next}</nav>
<p class="eyebrow">${escapeHtml(block.title)} · ${index + 1}/${block.pages.length}</p><h1>${escapeHtml(page.title)}</h1>
${after ? `<p class="hint" data-visible-after>Visible après la première version.</p>` : ''}
${page.content.map(renderStimulus).join('')}${items}</main></body></html>`;
}

export function writePreview(pkg, presentation, dir) {
  mkdirSync(dir, { recursive: true });
  const pages = [];
  for (const week of pkg.weeks) {
    const links = [];
    for (const block of week.blocks) {
      links.push(`<h2>${escapeHtml(block.title)}</h2><ul>${block.pages.map(page => `<li><a href="${slug(page.id)}.html">${escapeHtml(page.title)}</a></li>`).join('')}</ul>`);
      block.pages.forEach((page, index) => {
        const file = `${slug(page.id)}.html`;
        writeFileSync(join(dir, file), pageHtml(week, block, page, index, presentation));
        pages.push({ file, pageId: page.id, blockId: block.id, items: page.items.length });
      });
    }
    writeFileSync(join(dir, 'index.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Semaine ${week.number}</title><style>${STYLE}</style></head><body><main><h1>${escapeHtml(week.title)}</h1>${links.join('')}</main></body></html>`);
  }
  writeFileSync(join(dir, 'pages.json'), `${JSON.stringify(pages, null, 2)}\n`);
  return pages;
}
