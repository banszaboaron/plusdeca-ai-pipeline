// Útvonalak egy helyen (a körkörös importok elkerülésére külön modul).
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const paths = {
  ceo: join(here, '..'),
  kits: join(here, '..', '..', 'starter-kits'),
  repo: join(here, '..', '..', '..', '..'),
  get packages() { return join(this.kits, 'packages'); },
  get quality() { return join(this.kits, 'pilot', 'quality'); },
  get assignments() { return join(this.ceo, 'assignments'); },
  get agentsSrc() { return join(this.ceo, 'agents-src'); },
  get references() { return join(this.ceo, '..', 'references'); },
};
