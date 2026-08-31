import { CanvasElement, InvitationPage, PageTemplate, PrebuiltBlock } from '../types';

/**
 * Generates a collision-resistant unique ID for cloned/instantiated elements.
 */
export const generateElementId = (prefix = 'el'): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};

/**
 * Deep clones elements while generating new unique IDs and updating parentContainerId references
 * so container hierarchies remain fully intact and immediately editable.
 */
export const cloneElementsWithNewIds = (
  elements: CanvasElement[],
  offsetY = 0,
  offsetX = 0
): CanvasElement[] => {
  const idMap = new Map<string, string>();

  // Pass 1: Generate new IDs for every element
  elements.forEach((el) => {
    const newId = generateElementId(el.type);
    idMap.set(el.id, newId);
  });

  // Pass 2: Clone and remap parentContainerId / children
  return elements.map((el) => {
    const newId = idMap.get(el.id) || generateElementId(el.type);
    const newParentId = el.parentContainerId ? idMap.get(el.parentContainerId) || el.parentContainerId : null;

    const cloned: CanvasElement = {
      ...el,
      id: newId,
      parentContainerId: newParentId,
      parentId: newParentId,
      style: {
        ...el.style,
        x: (el.style.x ?? 0) + (newParentId ? 0 : offsetX),
        y: (el.style.y ?? 0) + (newParentId ? 0 : offsetY)
      },
      content: { ...el.content },
      animation: el.animation ? { ...el.animation } : undefined,
      children: el.children
        ? el.children.map((childId) => idMap.get(childId) || childId)
        : undefined
    };

    return cloned;
  });
};

/**
 * Converts a PrebuiltBlock into canvas elements ready to be inserted into an existing active page.
 */
export const instantiatePrebuiltBlock = (
  block: PrebuiltBlock,
  targetY?: number
): CanvasElement[] => {
  let minY = Infinity;
  block.elements.forEach((el) => {
    if (!el.parentContainerId && el.style.y !== undefined) {
      minY = Math.min(minY, el.style.y);
    }
  });
  if (minY === Infinity) minY = 0;

  const offsetY = targetY !== undefined ? targetY - minY : 0;
  return cloneElementsWithNewIds(block.elements, offsetY);
};

/**
 * Converts a PageTemplate into a fully independent, editable InvitationPage with its own IDs.
 */
export const instantiateTemplatePage = (
  template: PageTemplate,
  order = 0
): InvitationPage => {
  const newPageId = `page-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const clonedElements = cloneElementsWithNewIds(template.page.elements, 0, 0);

  return {
    ...template.page,
    id: newPageId,
    order,
    name: template.name,
    background: JSON.parse(JSON.stringify(template.page.background)),
    elements: clonedElements,
    animation: template.page.animation ? { ...template.page.animation } : undefined
  };
};
