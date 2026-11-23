// P5 shim: a codex-ági week-schema.js az ajv-t használja. A P5 függőség nélkül
// fut, ezért itt a p5 saját JSON Schema-ellenőrzője áll az ajv helyén
// (a COURSE_SCHEMA által használt kulcsszavakat ismeri; a `format` kimarad).
// A kanonikus ellenőrzés továbbra is: node app/scripts/validate-course-contract.mjs (codex-ág).
import { validateSchema } from '../../lib/schema-validate.mjs';

export function compileWeekSchema(schema) {
  const validate = value => {
    const errors = validateSchema(schema, value);
    validate.errors = errors.map(error => ({ instancePath: error.path, keyword: 'schema', message: error.message, params: {} }));
    return errors.length === 0;
  };
  return validate;
}
