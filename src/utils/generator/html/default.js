import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML } from '../../codeGenerator';

export function defaultGenerator(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  return `<!-- Unknown element: ${type} -->`
    }
}
