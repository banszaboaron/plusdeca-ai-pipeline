// Kis JSON Schema-ellenőrző függőség nélkül (Node 20+). A draft 2020-12
// azon részhalmazát tudja, amelyet a p5/schema/block.schema.json használ:
// type, properties, required, additionalProperties, items, minItems, maxItems,
// uniqueItems, enum, const, oneOf, anyOf, $ref (#/$defs/...), pattern,
// minLength, minimum, maximum, exclusiveMinimum.

const typeOf = value => Array.isArray(value) ? 'array' : value === null ? 'null'
  : Number.isInteger(value) ? 'integer' : typeof value;

function matchesType(value, type) {
  const actual = typeOf(value);
  if (type === 'number') return actual === 'number' || actual === 'integer';
  return actual === type;
}

export function validateSchema(schema, data) {
  const errors = [];
  const resolve = ref => {
    if (!ref.startsWith('#/$defs/')) throw new Error(`Nem támogatott $ref: ${ref}`);
    const def = schema.$defs?.[ref.slice(8)];
    if (!def) throw new Error(`Ismeretlen $ref: ${ref}`);
    return def;
  };

  function check(node, value, path, out) {
    if (node.$ref) return check(resolve(node.$ref), value, path, out);
    if (node.type) {
      const types = [].concat(node.type);
      if (!types.some(type => matchesType(value, type))) {
        out.push({ path, message: `típus: ${types.join('|')} kell, ${typeOf(value)} van` });
        return;
      }
    }
    if ('const' in node && JSON.stringify(node.const) !== JSON.stringify(value)) out.push({ path, message: `értéke csak ${JSON.stringify(node.const)} lehet` });
    if (node.enum && !node.enum.some(entry => JSON.stringify(entry) === JSON.stringify(value))) out.push({ path, message: `nem megengedett érték: ${JSON.stringify(value)}` });
    if (typeof value === 'string') {
      if (node.minLength != null && value.length < node.minLength) out.push({ path, message: 'üres szöveg' });
      if (node.pattern && !new RegExp(node.pattern, 'u').test(value)) out.push({ path, message: `nem illeszkedik: ${node.pattern}` });
    }
    if (typeof value === 'number') {
      if (node.minimum != null && value < node.minimum) out.push({ path, message: `kisebb, mint ${node.minimum}` });
      if (node.maximum != null && value > node.maximum) out.push({ path, message: `nagyobb, mint ${node.maximum}` });
      if (node.exclusiveMinimum != null && value <= node.exclusiveMinimum) out.push({ path, message: `nem nagyobb, mint ${node.exclusiveMinimum}` });
    }
    if (Array.isArray(value)) {
      if (node.minItems != null && value.length < node.minItems) out.push({ path, message: `legalább ${node.minItems} elem kell` });
      if (node.maxItems != null && value.length > node.maxItems) out.push({ path, message: `legfeljebb ${node.maxItems} elem lehet` });
      if (node.uniqueItems && new Set(value.map(entry => JSON.stringify(entry))).size !== value.length) out.push({ path, message: 'ismétlődő elem' });
      if (node.items) value.forEach((entry, index) => check(node.items, entry, `${path}/${index}`, out));
    }
    if (typeOf(value) === 'object') {
      for (const key of node.required || []) if (!(key in value)) out.push({ path, message: `hiányzó mező: ${key}` });
      for (const [key, entry] of Object.entries(value)) {
        if (node.properties && key in node.properties) check(node.properties[key], entry, `${path}/${key}`, out);
        else if (node.additionalProperties === false) out.push({ path: `${path}/${key}`, message: 'nem engedélyezett mező' });
        else if (node.additionalProperties && typeof node.additionalProperties === 'object') check(node.additionalProperties, entry, `${path}/${key}`, out);
      }
    }
    for (const keyword of ['oneOf', 'anyOf']) {
      if (!node[keyword]) continue;
      const results = node[keyword].map(option => { const sub = []; check(option, value, path, sub); return sub; });
      const passing = results.filter(sub => sub.length === 0).length;
      if (keyword === 'oneOf' ? passing !== 1 : passing === 0) {
        if (passing > 1) out.push({ path, message: 'több változatra is illeszkedik (oneOf)' });
        else {
          // A legközelebbi változat hibáit adjuk vissza, hogy a jelentés olvasható maradjon.
          const best = results.reduce((a, b) => (b.length < a.length ? b : a));
          out.push(...best);
        }
      }
    }
  }

  check(schema, data, '', errors);
  return errors;
}
