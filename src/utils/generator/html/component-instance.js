import { generateElementHTML } from '../../codeGenerator';

const visited = new Set();

export const componentInstance = (el, idx, allPages) => {
  if (el.componentId && el.allComponents) {
    if (visited.has(el.componentId)) {
      return '<!-- Circular component loop detected -->';
    }
    
    visited.add(el.componentId);
    let res = '';
    
    const master = el.allComponents.find(c => c.id === el.componentId)
    if (master && master.elements) {
      res = master.elements.map((child, i) => {
        return generateElementHTML({ ...child, allComponents: el.allComponents }, i)
      }).join('\n')
    }
    
    visited.delete(el.componentId);
    return res;
  }
  return '';
};
