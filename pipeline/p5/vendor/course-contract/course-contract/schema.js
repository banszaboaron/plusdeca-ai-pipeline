import catalog from './catalog.js';

const text = { type: 'string', minLength: 1, pattern: '\\S' };
const bool = { type: 'boolean' };
const number = { type: 'number', minimum: 0 };
const integer = { type: 'integer', minimum: 0 };
const enumOf = values => ({ enum: values });
const literal = value => ({ const: value });
const ref = name => ({ $ref: '#/$defs/' + name });
const array = (items, minItems = 0) => ({ type: 'array', items, minItems });
const strings = (min = 0) => ({ ...array(text, min), uniqueItems: true });
const object = (properties, optional = []) => ({
  type: 'object', additionalProperties: false, properties,
  required: Object.keys(properties).filter(key => !optional.includes(key)),
});
const options = array(ref('option'), 1);
const shape = (type, props, optional = []) => object({ type: literal(type), ...props }, optional);

// Structural contract, paired with the referential/policy checks in course-contract.js.
// Pure data: no runtime imports, fetching, evaluation or learner-state writes.
export const COURSE_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://plusdeca.invalid/schema/course-package/2.0.0',
  title: 'Plusdeça course content contract 2.0.0',
  ...object({
    schemaVersion: enumOf(['2.0.0', '2.0.1', '2.0.2', '2.0.3', '2.0.4']), catalogVersion: literal('1.0.0'), contentVersion: text,
    namespace: enumOf(['demo', 'course']), label: text, courseId: { type: 'string', pattern: '^[a-z][a-z0-9-]*$' },
    weeks: array(ref('week'), 1), sources: array(ref('source')), media: array(ref('media')),
    targets: array(ref('target')), applicationPages: array(ref('applicationPage')),
  }, ['applicationPages']),
  $defs: {
    range: object({ min: number, max: number }),
    option: object({ id: text, label: text }),
    normalization: object({ unicode: literal('NFC'), caseSensitive: bool, accentsSensitive: bool,
      apostropheEquivalent: bool, trim: bool, collapseWhitespace: bool, hyphensSensitive: bool,
      numbersFr: bool, pricesFr: bool }, ['numbersFr', 'pricesFr']), // P5-bővítés 2.0.2 (PRICES_CONTRACT_VERSION)
    source: object({ id: text, title: text, locator: text,
      rights: enumOf(['original', 'licensed', 'link-only', 'pending']),
      policyGrants: array(object({ policyId: literal('u32-trusted-review'), blockRefs: strings(1) }), 1),
    }, ['policyGrants']),
    media: object({ id: text, kind: enumOf(['audio', 'video', 'image']), uri: text, sourceRef: text,
      access: enumOf(['local', 'link', 'embed']), offline: bool, alternative: text,
      duration: { type: 'number', exclusiveMinimum: 0 }, transcript: text,
      transcriptPolicy: enumOf(['always', 'after-attempt', 'after-completion', 'hidden']),
      gateStatus: enumOf(['pending', 'approved']),
      segments: array(object({ id: text, start: number, end: number }), 1),
      checkedAt: { type: 'string', format: 'date' }, backupRef: text, auditStatus: enumOf(['pending', 'approved']),
    }, ['duration', 'transcript', 'transcriptPolicy', 'gateStatus', 'segments', 'checkedAt', 'backupRef', 'auditStatus']),
    target: object({ id: text, description: text, taughtIn: strings(), sourceRefs: strings() }),
    stimulus: { oneOf: [
      shape('text', { text, language: enumOf(['fr', 'hu']), sourceRefs: strings() }, ['sourceRefs']),
      shape('media', { mediaRef: text, sourceRefs: strings() }, ['sourceRefs']),
      shape('table', { columns: array(text, 1), rows: array(array(text), 1), sourceRefs: strings() }, ['sourceRefs']),
      shape('documents', { documents: array(object({ title: text, text, sourceRefs: strings() }), 2), sourceRefs: strings() }, ['sourceRefs']),
      shape('gloss', { surface: text, lemma: text, meaning: text, language: text, sourceRefs: strings() }, ['sourceRefs']),
      shape('list', { entries: array(text, 1), sourceRefs: strings() }, ['sourceRefs']),
    ] },
    field: object({ id: text, label: text, required: bool, normalization: ref('normalization'),
      accepted: array(text, 1), gender: enumOf(['masculine', 'feminine', 'none']), articleRequired: bool,
    }, ['accepted', 'gender', 'articleRequired']),
    span: object({ id: text, start: integer, end: integer }),
    abxToken: object({ role: enumOf(['A', 'B', 'X']), mediaRef: text, speaker: text, category: text }),
    response: { oneOf: [
      shape('single', { options }),
      shape('multiple', { options, selection: ref('range') }),
      shape('text', { normalization: ref('normalization') }),
      shape('fields', { fields: array(ref('field'), 1), bank: options,
        formPolicy: enumOf(['free', 'typed-gender-bearing', 'typed-mf-pair', 'conditional-gender-recall']),
      }, ['bank', 'formPolicy']),
      shape('pairs', { left: options, right: options, refill: bool, memory: bool }, ['refill', 'memory']),
      shape('order', { tokens: options, reuse: bool }, ['reuse']),
      shape('correction', { text, spans: array(ref('span'), 1) }),
      shape('writing', { wordRange: ref('range'), parts: options }, ['parts']),
      shape('speech', { durationRange: ref('range'), transcriptAllowed: bool }, ['transcriptAllowed']),
      shape('abx', { tokens: { ...array(ref('abxToken'), 3), maxItems: 3 },
        window: object({ size: { type: 'integer', minimum: 1 }, required: { type: 'integer', minimum: 1 } }),
      }, ['window']),
      shape('map', { locations: options, places: options, keyboardAlternative: bool }, ['keyboardAlternative']),
      shape('graph', { nodes: options, relations: options, directed: bool }, ['directed']),
      shape('sequence', { itemRefs: strings(1), timedSeconds: { type: 'number', exclusiveMinimum: 0 },
        sourceWeeks: { ...array({ type: 'integer', minimum: 1, maximum: 40 }, 2), uniqueItems: true },
      }, ['timedSeconds', 'sourceWeeks']),
    ] },
    // Exact key representation is selected by the response discriminator; membership,
    // coverage and cardinality are checked by the semantic validator.
    answer: { oneOf: [text, array(text, 1),
      { type: 'object', minProperties: 1, additionalProperties: text },
      array(object({ from: text, to: text, relation: text }), 1),
    ] },
    criterion: object({ id: text, description: text, required: bool, targetRef: text, distinctEvidence: bool }, ['targetRef', 'distinctEvidence']),
    solution: { oneOf: [
      shape('exact', { answers: array(ref('answer'), 1) }),
      shape('reference', { text, accepted: array(text) }),
      shape('rubric', { criteria: array(ref('criterion'), 1) }),
      shape('submission', {}), // P5-bővítés 2.0.1 (course-contract.js: SUBMISSION_CONTRACT_VERSION)
    ] },
    evaluation: object({ mode: enumOf(['exact', 'reference', 'semantic', 'dual-gate', 'human', 'formative']),
      policyId: enumOf(['closed-exact', 'reference-transcript', 'semantic-rubric', 'writing-dual-gate', 'u32-trusted-review', 'formative-only']),
      uncertainty: literal('pending'), selfCheckCanPass: literal(false), authorityRefs: strings(1), scopeBlockRef: text,
      minimumScore: { type: 'number', minimum: 0, maximum: 5 }, revisionBinding: literal('current-full-response'),
      status: enumOf(['draft', 'validated']),
    }, ['authorityRefs', 'scopeBlockRef', 'minimumScore', 'revisionBinding', 'status']),
    repair: object({ mode: enumOf(['none', 'delayed-retry', 'full-revision', 'targeted-then-full']), hideFeedback: bool }),
    repetition: object({ mode: enumOf(['none', 'delayed', 'spaced']), minIntervening: integer, independentSuccess: literal(true),
      retryItemRefs: strings(1), immutableFirstAttempt: bool, recovery: enumOf(['none', 'repair-errors', 'new-full-window']),
      supportedClosure: bool,
    }, ['retryItemRefs', 'immutableFirstAttempt', 'recovery', 'supportedClosure']),
    evidence: object({ modality: enumOf(['written', 'spoken', 'listening', 'phonetic', 'visual']),
      assistance: enumOf(['uncued', 'cued', 'assisted']), canonicalText: text,
    }, ['canonicalText']),
    playback: object({ maxPlays: { type: 'integer', minimum: 1 },
      transcriptPolicy: enumOf(['always', 'after-attempt', 'after-completion', 'hidden']),
    }),
    route: object({ id: text, itemRefs: strings(1), gateRefs: strings() }),
    draw: object({ cards: options, count: { type: 'integer', minimum: 1 } }),
    item: object({ id: text, capability: enumOf(catalog.capabilities.map(c => c.id)), prompt: text,
      response: ref('response'), solution: ref('solution'), evaluation: ref('evaluation'),
      repair: ref('repair'), repetition: ref('repetition'), sourceRefs: strings(), targetRefs: strings(), mediaRefs: strings(),
      draw: ref('draw'), routes: array(ref('route'), 1),
      evidence: ref('evidence'), anchorRefs: array(object({ mediaRef: text, segmentId: text }), 1), playback: ref('playback'),
    }, ['draw', 'routes', 'evidence', 'anchorRefs', 'playback']),
    page: object({ id: text, template: enumOf(catalog.templates.filter(f => f.id.startsWith('PAGE-')).map(f => f.id)),
      variant: enumOf(catalog.templates.filter(f => f.id.startsWith('PAGE-')).flatMap(f => f.variants)), title: text,
      content: array(ref('stimulus')), items: array(ref('item')) }),
    applicationPage: object({ id: text, template: enumOf(catalog.templates.filter(f => f.id.startsWith('APP-')).map(f => f.id)),
      variant: enumOf(catalog.templates.filter(f => f.id.startsWith('APP-')).flatMap(f => f.variants)), title: text,
      content: array(ref('stimulus')), items: array(ref('item')) }),
    completion: object({ mode: enumOf(['all-items', 'acknowledge', 'all-targets', 'mastery', 'resolved']), requiredRefs: strings() }),
    paths: object({ choicePageRef: text, options: array(object({ id: text, label: text, pageRefs: strings(1), recommended: bool }, ['recommended']), 2) }),
    position: object({ row: { type: 'integer', minimum: 1, maximum: 5 }, column: { type: 'integer', minimum: 1, maximum: 4 } }),
    block: object({ id: text, kind: enumOf(['lesson', 'assessment']), title: text, prerequisites: strings(), pages: array(ref('page'), 1),
      completion: ref('completion'), taughtTargetRefs: strings(), position: ref('position'),
      assessmentKind: enumOf(['grammar', 'reading', 'vocabulary']), estimatedMinutes: ref('range'),
      weight: { type: 'number', exclusiveMinimum: 0 }, paths: ref('paths'),
    }, ['taughtTargetRefs', 'position', 'assessmentKind', 'estimatedMinutes', 'weight', 'paths']),
    week: object({ id: text, number: { type: 'integer', minimum: 1, maximum: 40 }, title: text, blocks: array(ref('block'), 1) }),
  },
};
