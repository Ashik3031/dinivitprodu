import { PageTemplate, InvitationPage } from '../types';

export const PREBUILT_PAGE_TEMPLATES: PageTemplate[] = [];

export function createBlankPage(orderIndex: number, themeBgColor?: string): InvitationPage {
  return {
    id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: `Section ${orderIndex + 1}`,
    order: orderIndex,
    heightMode: 'viewport',
    height: 844,
    isFullHeight: true,
    background: {
      type: 'color',
      color: themeBgColor || '#f8fafc'
    },
    elements: []
  };
}

export function createPageFromTemplate(template?: PageTemplate | null, orderIndex: number = 0): InvitationPage {
  if (!template || !template.page) {
    return createBlankPage(orderIndex);
  }
  const newId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const pageCopy: InvitationPage = JSON.parse(JSON.stringify(template.page));

  // Assign new unique IDs for elements
  const idMap = new Map<string, string>();
  const elementsWithNewIds = pageCopy.elements.map((el) => {
    const freshElId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    idMap.set(el.id, freshElId);
    return {
      ...el,
      id: freshElId
    };
  });

  // Remap parentContainerIds if any
  const finalElements = elementsWithNewIds.map((el) => {
    if (el.parentContainerId && idMap.has(el.parentContainerId)) {
      return {
        ...el,
        parentContainerId: idMap.get(el.parentContainerId)
      };
    }
    return el;
  });

  return {
    ...pageCopy,
    id: newId,
    order: orderIndex,
    elements: finalElements
  };
}
