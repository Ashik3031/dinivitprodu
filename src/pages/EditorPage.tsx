import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Invitation,
  InvitationPage,
  CanvasElement,
  ElementType,
  InvitationTemplate
} from '../types';
import { api } from '../services/api';
import { LeftSidebar } from '../components/editor/LeftSidebar';
import { RightSidebar } from '../components/editor/RightSidebar';
import { VisualCanvas } from '../components/canvas/VisualCanvas';
import { EditorTopNav } from '../components/editor/EditorTopNav';
import { ShareModal } from '../components/published/ShareModal';
import { SettingsModal } from '../components/published/SettingsModal';
import { PageTemplatesModal } from '../components/editor/PageTemplatesModal';
import { PublishedInvitationView } from '../components/published/PublishedInvitationView';
import { createBlankPage } from '../data/pageTemplates';
import { instantiateTemplatePage, instantiatePrebuiltBlock } from '../utils/templateUtils';
import { PageTemplate, PrebuiltBlock } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface EditorPageProps {
  invitationId: string;
  onBackToDashboard: () => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  invitationId,
  onBackToDashboard
}) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Animation preview states
  const [previewAnimationElementId, setPreviewAnimationElementId] = useState<string | null>(null);
  const [previewAnimationKey, setPreviewAnimationKey] = useState<number>(0);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPageTemplatesModalOpen, setIsPageTemplatesModalOpen] = useState(false);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<Invitation[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load invitation & templates
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [invData, tmplData] = await Promise.all([
          api.getInvitation(invitationId),
          api.getTemplates()
        ]);
        setInvitation(invData);
        setTemplates(tmplData.templates || []);
        setHistory([invData]);
        setHistoryIndex(0);
      } catch (err) {
        console.error('Failed to load invitation:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [invitationId]);

  // Push new state to history stack
  const updateInvitationState = useCallback((newInv: Invitation) => {
    setInvitation(newInv);
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, newInv];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      setInvitation(targetState);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      setInvitation(targetState);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Animation preview triggers
  const handlePreviewAnimation = useCallback((elementId: string) => {
    setPreviewAnimationElementId(elementId);
    setPreviewAnimationKey(Date.now());
  }, []);

  const handlePreviewPageAnimations = useCallback(() => {
    setPreviewAnimationElementId('ALL');
    setPreviewAnimationKey(Date.now());
  }, []);

  // Save changes to backend
  const handleSave = async () => {
    if (!invitation) return;
    setIsSaving(true);
    try {
      await api.updateInvitation(invitation.id, invitation);
    } catch (err) {
      console.error('Failed to save invitation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const activePage: InvitationPage = invitation?.pages?.[selectedPageIndex] || invitation?.pages?.[0] || {
    id: 'temp-page',
    pageNumber: 1,
    elements: []
  };
  const selectedElements = activePage?.elements?.filter(el => selectedElementIds.includes(el.id)) || [];
  const selectedElement = selectedElements[0] || null;

  // Single or Multi Selection Handler
  const handleSelectElement = useCallback((id: string | null, isMulti = false) => {
    if (!id) {
      setSelectedElementIds([]);
      return;
    }
    if (isMulti) {
      setSelectedElementIds(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    } else {
      setSelectedElementIds([id]);
    }
  }, []);

  const handleSelectMultipleElements = useCallback((ids: string[]) => {
    setSelectedElementIds(ids);
  }, []);

  // PAGE OPERATIONS
  const handleSelectPage = (index: number) => {
    setSelectedPageIndex(index);
    setSelectedElementIds([]);
  };

  const handleAddBlankPage = () => {
    if (!invitation) return;
    const newPage = createBlankPage(
      invitation.pages.length,
      invitation.theme?.backgroundColor || '#071912'
    );
    const newPages = [...invitation.pages, newPage];
    updateInvitationState({ ...invitation, pages: newPages });
    setSelectedPageIndex(newPages.length - 1);
    setSelectedElementIds([]);
  };

  const handleSelectPageTemplate = (template: PageTemplate) => {
    if (!invitation) return;
    const newPage = instantiateTemplatePage(template, invitation.pages.length);
    const newPages = [...invitation.pages, newPage];
    updateInvitationState({ ...invitation, pages: newPages });
    setSelectedPageIndex(newPages.length - 1);
    setSelectedElementIds([]);
  };

  const handleInsertBlock = (block: PrebuiltBlock) => {
    if (!invitation) return;
    const newElements = instantiatePrebuiltBlock(block);
    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: [...p.elements, ...newElements]
      };
    });
    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds(newElements.map(el => el.id));
  };

  const handleAddPage = (fromTemplate = false) => {
    if (fromTemplate) {
      setIsPageTemplatesModalOpen(true);
    } else {
      handleAddBlankPage();
    }
  };

  const handleRenamePage = (index: number, newName: string) => {
    if (!invitation) return;
    const newPages = invitation.pages.map((p, i) =>
      i === index ? { ...p, name: newName } : p
    );
    updateInvitationState({ ...invitation, pages: newPages });
  };

  const handleDuplicatePage = (index: number) => {
    if (!invitation) return;
    const target = invitation.pages[index];
    if (!target) return;
    const duplicatedPage: InvitationPage = {
      ...JSON.parse(JSON.stringify(target)),
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${target.name} (Copy)`,
      order: invitation.pages.length
    };

    const newPages = [...invitation.pages];
    newPages.splice(index + 1, 0, duplicatedPage);
    updateInvitationState({ ...invitation, pages: newPages });
    setSelectedPageIndex(index + 1);
    setSelectedElementIds([]);
  };

  const handleDeletePage = (index: number) => {
    if (!invitation || invitation.pages.length <= 1) return;
    const newPages = invitation.pages.filter((_, i) => i !== index);
    updateInvitationState({ ...invitation, pages: newPages });
    setSelectedPageIndex(Math.max(0, Math.min(selectedPageIndex, newPages.length - 1)));
    setSelectedElementIds([]);
  };

  const handleReorderPages = (fromIndex: number, toIndex: number) => {
    if (!invitation) return;
    const newPages = [...invitation.pages];
    const [moved] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, moved);
    const reindexedPages = newPages.map((p, idx) => ({ ...p, order: idx }));
    updateInvitationState({ ...invitation, pages: reindexedPages });
    setSelectedPageIndex(toIndex);
  };

  const handleUpdatePage = (updates: Partial<InvitationPage>) => {
    if (!invitation) return;
    const newPages = invitation.pages.map((p, i) =>
      i === selectedPageIndex ? { ...p, ...updates } : p
    );
    updateInvitationState({ ...invitation, pages: newPages });
  };

  // ELEMENT OPERATIONS
  const handleAddElement = (
    type: ElementType,
    customProps: Partial<CanvasElement> = {},
    targetParentId?: string | null
  ) => {
    if (!invitation) return;
    const newId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const effectiveParentId = targetParentId !== undefined 
      ? targetParentId 
      : (customProps.parentContainerId || customProps.parentId || null);

    const isChild = Boolean(effectiveParentId);

    const newElement: CanvasElement = {
      id: newId,
      type,
      name: customProps.name || type,
      parentContainerId: effectiveParentId,
      parentId: effectiveParentId,
      style: {
        x: isChild ? 20 : 30,
        y: isChild ? 20 : 100,
        width: isChild ? 240 : 330,
        height: isChild ? 60 : 80,
        zIndex: (activePage.elements.length || 0) + 1,
        ...customProps.style
      },
      content: customProps.content || {},
      animation: customProps.animation || { type: 'fadeIn', duration: 0.8, delay: 0.2 },
      ...customProps
    };

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;

      let elementsList = [...p.elements, newElement];

      if (effectiveParentId) {
        elementsList = elementsList.map(el => {
          if (el.id === effectiveParentId) {
            const currentChildren = el.children || [];
            if (!currentChildren.includes(newId)) {
              return { ...el, children: [...currentChildren, newId] };
            }
          }
          return el;
        });
      }

      return {
        ...p,
        elements: elementsList
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds([newElement.id]);
  };

  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    if (!invitation) return;
    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements.map(el => el.id === id ? { ...el, ...updates } : el)
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  // Bulk update multiple elements
  const handleUpdateMultipleElements = (updatesMap: Record<string, Partial<CanvasElement>>) => {
    if (!invitation) return;
    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements.map(el => updatesMap[el.id] ? { ...el, ...updatesMap[el.id] } : el)
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  // Recursively find all descendant element IDs for a container
  const getAllDescendantIds = (rootId: string, elements: CanvasElement[]): string[] => {
    const directChildren = elements.filter(
      el => el.parentContainerId === rootId || el.parentId === rootId
    );
    let allIds: string[] = [];
    for (const child of directChildren) {
      allIds.push(child.id);
      allIds = allIds.concat(getAllDescendantIds(child.id, elements));
    }
    return allIds;
  };

  // Delete Element(s)
  const handleDeleteElement = (idOrIds: string | string[]) => {
    const targetIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (targetIds.length === 0) return;

    let allIdsToDelete = new Set<string>();
    targetIds.forEach(id => {
      allIdsToDelete.add(id);
      const descendantIds = getAllDescendantIds(id, activePage.elements);
      descendantIds.forEach(dId => allIdsToDelete.add(dId));
    });

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements
          .filter(el => !allIdsToDelete.has(el.id))
          .map(el => {
            if (el.children && el.children.some(cId => allIdsToDelete.has(cId))) {
              return {
                ...el,
                children: el.children.filter(cId => !allIdsToDelete.has(cId))
              };
            }
            return el;
          })
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds([]);
  };

  // Duplicate Element(s)
  const handleDuplicateElement = (idOrIds: string | string[]) => {
    const targetIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (targetIds.length === 0) return;

    const newRoots: CanvasElement[] = [];
    const newDescendants: CanvasElement[] = [];
    const createdRootIds: string[] = [];

    targetIds.forEach(targetId => {
      const target = activePage.elements.find(el => el.id === targetId);
      if (!target) return;

      const descendantIds = getAllDescendantIds(targetId, activePage.elements);
      const descendants = activePage.elements.filter(el => descendantIds.includes(el.id));

      const idMap: Record<string, string> = {
        [target.id]: `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      };
      descendants.forEach(d => {
        idMap[d.id] = `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      });

      const duplicatedRoot: CanvasElement = {
        ...JSON.parse(JSON.stringify(target)),
        id: idMap[target.id],
        name: `${target.name} (Copy)`,
        style: {
          ...target.style,
          x: target.style.x + 20,
          y: target.style.y + 20,
          zIndex: (activePage.elements.length || 0) + 2
        },
        children: target.children ? target.children.map(cId => idMap[cId] || cId) : []
      };
      createdRootIds.push(duplicatedRoot.id);
      newRoots.push(duplicatedRoot);

      descendants.forEach(d => {
        const cloned: CanvasElement = JSON.parse(JSON.stringify(d));
        const oldParentId = d.parentContainerId || d.parentId;
        const newParentId = oldParentId && idMap[oldParentId] ? idMap[oldParentId] : oldParentId;
        newDescendants.push({
          ...cloned,
          id: idMap[d.id],
          parentContainerId: newParentId,
          parentId: newParentId,
          children: cloned.children ? cloned.children.map(cId => idMap[cId] || cId) : []
        });
      });
    });

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: [...p.elements, ...newRoots, ...newDescendants]
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds(createdRootIds);
  };

  // Lock / Unlock Element(s)
  const handleToggleLockElement = (idOrIds: string | string[], forceLock?: boolean) => {
    const targetIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (targetIds.length === 0) return;

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements.map(el => {
          if (targetIds.includes(el.id)) {
            const nextLock = forceLock !== undefined ? forceLock : !el.isLocked;
            return { ...el, isLocked: nextLock };
          }
          return el;
        })
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  // Hide / Unhide Element(s)
  const handleToggleHideElement = (idOrIds: string | string[], forceHide?: boolean) => {
    const targetIds = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (targetIds.length === 0) return;

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements.map(el => {
          if (targetIds.includes(el.id)) {
            const nextHide = forceHide !== undefined ? forceHide : !el.isHidden;
            return { ...el, isHidden: nextHide };
          }
          return el;
        })
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  // Detach child from parent container
  const handleDetachFromContainer = (id: string) => {
    const target = activePage.elements.find(el => el.id === id);
    if (!target || (!target.parentContainerId && !target.parentId)) return;

    const parentId = target.parentContainerId || target.parentId;
    const parent = activePage.elements.find(el => el.id === parentId);

    const absoluteX = (parent?.style.x || 0) + target.style.x;
    const absoluteY = (parent?.style.y || 0) + target.style.y;

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements.map(el => {
          if (el.id === id) {
            return {
              ...el,
              parentContainerId: null,
              parentId: null,
              style: {
                ...el.style,
                x: absoluteX,
                y: absoluteY
              }
            };
          }
          if (el.id === parentId && el.children) {
            return {
              ...el,
              children: el.children.filter(cId => cId !== id)
            };
          }
          return el;
        })
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  // LAYER ORDERING
  const handleBringForward = (idOrIds?: string | string[]) => {
    const targetIds = idOrIds ? (Array.isArray(idOrIds) ? idOrIds : [idOrIds]) : selectedElementIds;
    if (targetIds.length === 0) return;
    const elements = [...activePage.elements];
    for (let i = elements.length - 2; i >= 0; i--) {
      if (targetIds.includes(elements[i].id) && !targetIds.includes(elements[i + 1].id)) {
        const temp = elements[i];
        elements[i] = elements[i + 1];
        elements[i + 1] = temp;
      }
    }
    elements.forEach((el, idx) => {
      el.style = { ...el.style, zIndex: idx + 1 };
    });
    const updatedPages = invitation.pages.map((p, i) => i === selectedPageIndex ? { ...p, elements } : p);
    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  const handleSendBackward = (idOrIds?: string | string[]) => {
    const targetIds = idOrIds ? (Array.isArray(idOrIds) ? idOrIds : [idOrIds]) : selectedElementIds;
    if (targetIds.length === 0) return;
    const elements = [...activePage.elements];
    for (let i = 1; i < elements.length; i++) {
      if (targetIds.includes(elements[i].id) && !targetIds.includes(elements[i - 1].id)) {
        const temp = elements[i];
        elements[i] = elements[i - 1];
        elements[i - 1] = temp;
      }
    }
    elements.forEach((el, idx) => {
      el.style = { ...el.style, zIndex: idx + 1 };
    });
    const updatedPages = invitation.pages.map((p, i) => i === selectedPageIndex ? { ...p, elements } : p);
    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  const handleBringToFront = (idOrIds?: string | string[]) => {
    const targetIds = idOrIds ? (Array.isArray(idOrIds) ? idOrIds : [idOrIds]) : selectedElementIds;
    if (targetIds.length === 0) return;
    const nonSelected = activePage.elements.filter(el => !targetIds.includes(el.id));
    const selected = activePage.elements.filter(el => targetIds.includes(el.id));
    const elements = [...nonSelected, ...selected];
    elements.forEach((el, idx) => {
      el.style = { ...el.style, zIndex: idx + 1 };
    });
    const updatedPages = invitation.pages.map((p, i) => i === selectedPageIndex ? { ...p, elements } : p);
    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  const handleSendToBack = (idOrIds?: string | string[]) => {
    const targetIds = idOrIds ? (Array.isArray(idOrIds) ? idOrIds : [idOrIds]) : selectedElementIds;
    if (targetIds.length === 0) return;
    const nonSelected = activePage.elements.filter(el => !targetIds.includes(el.id));
    const selected = activePage.elements.filter(el => targetIds.includes(el.id));
    const elements = [...selected, ...nonSelected];
    elements.forEach((el, idx) => {
      el.style = { ...el.style, zIndex: idx + 1 };
    });
    const updatedPages = invitation.pages.map((p, i) => i === selectedPageIndex ? { ...p, elements } : p);
    updateInvitationState({ ...invitation, pages: updatedPages });
  };

  // GROUPING
  const handleGroup = (idsToGroup?: string[]) => {
    const targetIds = idsToGroup || selectedElementIds;
    if (targetIds.length < 2) return;
    const items = activePage.elements.filter(el => targetIds.includes(el.id));
    if (items.length < 2) return;

    const minX = Math.min(...items.map(el => el.style.x));
    const minY = Math.min(...items.map(el => el.style.y));
    const maxX = Math.max(...items.map(el => el.style.x + el.style.width));
    const maxY = Math.max(...items.map(el => el.style.y + el.style.height));

    const padding = 16;
    const containerX = Math.max(0, minX - padding);
    const containerY = Math.max(0, minY - padding);
    const containerW = (maxX - minX) + (padding * 2);
    const containerH = (maxY - minY) + (padding * 2);

    const containerId = `container-${Date.now()}`;
    const containerElement: CanvasElement = {
      id: containerId,
      type: 'container',
      name: 'Group Container',
      style: {
        x: containerX,
        y: containerY,
        width: containerW,
        height: containerH,
        zIndex: (activePage.elements.length || 0) + 1,
        shape: 'rounded-rectangle',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: padding
      },
      content: {},
      children: targetIds
    };

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      const elements = p.elements.map(el => {
        if (targetIds.includes(el.id)) {
          return {
            ...el,
            parentContainerId: containerId,
            parentId: containerId,
            style: {
              ...el.style,
              x: el.style.x - containerX,
              y: el.style.y - containerY
            }
          };
        }
        return el;
      });
      return {
        ...p,
        elements: [...elements, containerElement]
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds([containerId]);
  };

  const handleUngroup = (containerId?: string) => {
    const targetId = containerId || (selectedElementIds.length === 1 ? selectedElementIds[0] : null);
    if (!targetId) return;
    const container = activePage.elements.find(el => el.id === targetId && el.type === 'container');
    if (!container) return;

    const children = activePage.elements.filter(
      el => el.parentContainerId === container.id || el.parentId === container.id
    );

    const childIds = children.map(c => c.id);

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: p.elements
          .filter(el => el.id !== container.id)
          .map(el => {
            if (childIds.includes(el.id)) {
              return {
                ...el,
                parentContainerId: null,
                parentId: null,
                style: {
                  ...el.style,
                  x: (container.style.x || 0) + el.style.x,
                  y: (container.style.y || 0) + el.style.y
                }
              };
            }
            return el;
          })
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds(childIds);
  };

  // CLIPBOARD (COPY / PASTE)
  const handleCopy = () => {
    if (selectedElementIds.length === 0) return;
    const toCopy: CanvasElement[] = [];
    selectedElementIds.forEach(id => {
      const el = activePage.elements.find(e => e.id === id);
      if (el) {
        toCopy.push(JSON.parse(JSON.stringify(el)));
        const descendants = getAllDescendantIds(id, activePage.elements);
        descendants.forEach(dId => {
          const desc = activePage.elements.find(e => e.id === dId);
          if (desc) toCopy.push(JSON.parse(JSON.stringify(desc)));
        });
      }
    });
    setClipboard(toCopy);
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return;
    const idMap: Record<string, string> = {};
    clipboard.forEach(el => {
      idMap[el.id] = `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    });

    const pasted: CanvasElement[] = clipboard.map(el => {
      const isRoot = !el.parentContainerId && !el.parentId;
      const oldParentId = el.parentContainerId || el.parentId;
      const newParentId = oldParentId && idMap[oldParentId] ? idMap[oldParentId] : null;

      return {
        ...el,
        id: idMap[el.id],
        name: `${el.name} (Copy)`,
        parentContainerId: newParentId,
        parentId: newParentId,
        style: {
          ...el.style,
          x: isRoot ? el.style.x + 24 : el.style.x,
          y: isRoot ? el.style.y + 24 : el.style.y,
          zIndex: (activePage.elements.length || 0) + 2
        },
        children: el.children ? el.children.map(cId => idMap[cId] || cId) : []
      };
    });

    const rootIds = clipboard
      .filter(el => !el.parentContainerId && !el.parentId)
      .map(el => idMap[el.id]);

    const updatedPages = invitation.pages.map((p, i) => {
      if (i !== selectedPageIndex) return p;
      return {
        ...p,
        elements: [...p.elements, ...pasted]
      };
    });

    updateInvitationState({ ...invitation, pages: updatedPages });
    setSelectedElementIds(rootIds);
  };

  // ALIGNMENT
  const handleAlignElements = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElementIds.length < 2) return;
    const items = activePage.elements.filter(el => selectedElementIds.includes(el.id));
    if (items.length < 2) return;

    const minX = Math.min(...items.map(el => el.style.x));
    const maxX = Math.max(...items.map(el => el.style.x + el.style.width));
    const minY = Math.min(...items.map(el => el.style.y));
    const maxY = Math.max(...items.map(el => el.style.y + el.style.height));
    const centerX = minX + (maxX - minX) / 2;
    const centerY = minY + (maxY - minY) / 2;

    const updates: Record<string, Partial<CanvasElement>> = {};
    items.forEach(el => {
      let newX = el.style.x;
      let newY = el.style.y;

      switch (type) {
        case 'left':
          newX = minX;
          break;
        case 'center':
          newX = Math.round(centerX - el.style.width / 2);
          break;
        case 'right':
          newX = maxX - el.style.width;
          break;
        case 'top':
          newY = minY;
          break;
        case 'middle':
          newY = Math.round(centerY - el.style.height / 2);
          break;
        case 'bottom':
          newY = maxY - el.style.height;
          break;
      }

      updates[el.id] = {
        style: { ...el.style, x: newX, y: newY }
      };
    });

    handleUpdateMultipleElements(updates);
  };

  // DISTRIBUTE
  const handleDistributeElements = (axis: 'horizontal' | 'vertical') => {
    if (selectedElementIds.length < 3) return;
    const items = activePage.elements.filter(el => selectedElementIds.includes(el.id));
    if (items.length < 3) return;

    const updates: Record<string, Partial<CanvasElement>> = {};

    if (axis === 'horizontal') {
      const sorted = [...items].sort((a, b) => a.style.x - b.style.x);
      const minX = sorted[0].style.x;
      const lastItem = sorted[sorted.length - 1];
      const maxX = lastItem.style.x + lastItem.style.width;
      const totalItemsWidth = sorted.reduce((sum, el) => sum + el.style.width, 0);
      const totalGap = (maxX - minX) - totalItemsWidth;
      const gap = totalGap / (sorted.length - 1);

      let currentX = minX;
      sorted.forEach((el, idx) => {
        if (idx > 0 && idx < sorted.length - 1) {
          updates[el.id] = {
            style: { ...el.style, x: Math.round(currentX) }
          };
        }
        currentX += el.style.width + gap;
      });
    } else {
      const sorted = [...items].sort((a, b) => a.style.y - b.style.y);
      const minY = sorted[0].style.y;
      const lastItem = sorted[sorted.length - 1];
      const maxY = lastItem.style.y + lastItem.style.height;
      const totalItemsHeight = sorted.reduce((sum, el) => sum + el.style.height, 0);
      const totalGap = (maxY - minY) - totalItemsHeight;
      const gap = totalGap / (sorted.length - 1);

      let currentY = minY;
      sorted.forEach((el, idx) => {
        if (idx > 0 && idx < sorted.length - 1) {
          updates[el.id] = {
            style: { ...el.style, y: Math.round(currentY) }
          };
        }
        currentY += el.style.height + gap;
      });
    }

    handleUpdateMultipleElements(updates);
  };

  // GLOBAL KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd+Z (without Shift)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y
      if ((isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Copy: Cmd+C
      if (isCmdOrCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
        return;
      }

      // Paste: Cmd+V
      if (isCmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
        return;
      }

      // Duplicate: Cmd+D
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedElementIds.length > 0) {
          handleDuplicateElement(selectedElementIds);
        }
        return;
      }

      // Select All: Cmd+A
      if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const topLevelIds = activePage.elements
          .filter(el => !el.parentContainerId && !el.parentId)
          .map(el => el.id);
        setSelectedElementIds(topLevelIds);
        return;
      }

      // Group: Cmd+G (without Shift)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        e.preventDefault();
        handleGroup();
        return;
      }

      // Ungroup: Cmd+Shift+G
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleUngroup();
        return;
      }

      // Bring to Front: Cmd+Shift+]
      if (isCmdOrCtrl && e.shiftKey && e.key === ']') {
        e.preventDefault();
        handleBringToFront();
        return;
      }

      // Send to Back: Cmd+Shift+[
      if (isCmdOrCtrl && e.shiftKey && e.key === '[') {
        e.preventDefault();
        handleSendToBack();
        return;
      }

      // Bring Forward: Cmd+]
      if (isCmdOrCtrl && !e.shiftKey && e.key === ']') {
        e.preventDefault();
        handleBringForward();
        return;
      }

      // Send Backward: Cmd+[
      if (isCmdOrCtrl && !e.shiftKey && e.key === '[') {
        e.preventDefault();
        handleSendBackward();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          handleDeleteElement(selectedElementIds);
        }
        return;
      }

      // Escape: Deselect all
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedElementIds([]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activePage.elements,
    selectedElementIds,
    clipboard,
    historyIndex,
    history.length
  ]);

  // APPLY FULL TEMPLATE
  const handleApplyTemplate = (template: InvitationTemplate) => {
    if (!invitation) return;
    const updated: Invitation = {
      ...invitation,
      theme: template.theme,
      openingScreen: template.openingScreen,
      music: template.music,
      pages: template.pages.map((p, idx) => ({
        ...p,
        id: `page-${Date.now()}-${idx}`
      }))
    };
    updateInvitationState(updated);
    setSelectedPageIndex(0);
    setSelectedElementIds([]);
  };

  // Loading state rendered after all hooks have been declared
  if (isLoading || !invitation) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading Studio Canvas...</span>
      </div>
    );
  }

  // If live preview is active, render full published view with top bar toggle
  if (isPreview) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col">
        <EditorTopNav
          invitation={invitation}
          onUpdateTitle={(title) => updateInvitationState({ ...invitation, title })}
          onUpdateStatus={(status) => updateInvitationState({ ...invitation, status })}
          viewportMode={viewportMode}
          onChangeViewport={setViewportMode}
          zoomLevel={zoomLevel}
          onChangeZoom={setZoomLevel}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          isSaving={isSaving}
          isPreview={isPreview}
          onTogglePreview={() => setIsPreview(false)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onBackToDashboard={onBackToDashboard}
        />
        <div className="flex-1 overflow-y-auto">
          <PublishedInvitationView
            invitation={invitation}
            isLiveViewer={false}
            forcedViewportMode={viewportMode}
            showPreviewControls={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Navigation */}
      <EditorTopNav
        invitation={invitation}
        onUpdateTitle={(title) => updateInvitationState({ ...invitation, title })}
        onUpdateStatus={(status) => updateInvitationState({ ...invitation, status })}
        viewportMode={viewportMode}
        onChangeViewport={setViewportMode}
        zoomLevel={zoomLevel}
        onChangeZoom={setZoomLevel}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        isSaving={isSaving}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Main Studio Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Elements & Pages Sidebar */}
        <LeftSidebar
          pages={invitation.pages}
          activePageIndex={selectedPageIndex}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onAddBlankPage={handleAddBlankPage}
          onOpenTemplatesModal={() => setIsPageTemplatesModalOpen(true)}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onRenamePage={handleRenamePage}
          onReorderPages={handleReorderPages}
          onAddElement={handleAddElement}
          onInsertBlock={handleInsertBlock}
          templates={templates}
          onApplyTemplate={handleApplyTemplate}
          onInsertTemplatePage={(page) => {
            const newPages = [...invitation.pages, page];
            updateInvitationState({ ...invitation, pages: newPages });
            setSelectedPageIndex(newPages.length - 1);
          }}
          selectedElement={selectedElement}
          currentInvitationId={invitation.id}
          businessId={invitation.businessId}
          onUpdateElement={handleUpdateElement}
          onSetAsBackground={(url, type) => handleUpdatePage({
            background: {
              type: type === 'video' ? 'video' : 'image',
              [type === 'video' ? 'videoUrl' : 'imageUrl']: url,
              size: 'cover'
            }
          })}
          onSetAsMusic={(audioUrl, title) => updateInvitationState({
            ...invitation,
            music: {
              ...(invitation.music || { autoplay: true, loop: true, volume: 0.8 }),
              enabled: true,
              audioUrl,
              title
            }
          })}
        />

        {/* Center Free Visual Canvas */}
        <div className="flex-1 bg-slate-100/60 relative overflow-auto flex flex-col justify-start">
          <VisualCanvas
            page={activePage}
            selectedElementIds={selectedElementIds}
            onSelectElement={handleSelectElement}
            onSelectMultipleElements={handleSelectMultipleElements}
            onUpdateElement={handleUpdateElement}
            onUpdateMultipleElements={handleUpdateMultipleElements}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onToggleLockElement={handleToggleLockElement}
            onToggleHideElement={handleToggleHideElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onAlign={handleAlignElements}
            onDistribute={handleDistributeElements}
            viewportMode={viewportMode}
            zoomLevel={zoomLevel}
            showGrid={showGrid}
            previewAnimationElementId={previewAnimationElementId}
            previewAnimationKey={previewAnimationKey}
            onPreviewAnimation={handlePreviewAnimation}
          />
        </div>

        {/* Right Properties Inspector */}
        <RightSidebar
          selectedElements={selectedElements}
          selectedElement={selectedElement}
          page={activePage}
          onUpdateElement={handleUpdateElement}
          onUpdateMultipleElements={handleUpdateMultipleElements}
          onUpdatePage={handleUpdatePage}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onToggleLockElement={handleToggleLockElement}
          onToggleHideElement={handleToggleHideElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onGroup={handleGroup}
          onUngroup={handleUngroup}
          onAlign={handleAlignElements}
          onDistribute={handleDistributeElements}
          onAddElement={handleAddElement}
          onDetachFromContainer={handleDetachFromContainer}
          onSelectElement={(id) => handleSelectElement(id, false)}
          theme={invitation.theme}
          onUpdateTheme={(themeUpdates) => updateInvitationState({
            ...invitation,
            theme: { ...invitation.theme, ...themeUpdates }
          })}
          currentInvitationId={invitation.id}
          businessId={invitation.businessId}
          onPreviewAnimation={handlePreviewAnimation}
          onPreviewPageAnimations={handlePreviewPageAnimations}
          viewportMode={viewportMode}
          onChangeViewport={setViewportMode}
        />
      </div>

      {/* Share / Publish Modal */}
      <ShareModal
        invitation={invitation}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onUpdateSlug={(slug) => updateInvitationState({ ...invitation, slug })}
        onUpdateStatus={(status) => updateInvitationState({ ...invitation, status })}
      />

      {/* Opening Screen & Music Settings Modal */}
      <SettingsModal
        invitation={invitation}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onUpdate={(updates) => updateInvitationState({ ...invitation, ...updates })}
      />

      {/* Page Templates Picker Modal */}
      <PageTemplatesModal
        isOpen={isPageTemplatesModalOpen}
        onClose={() => setIsPageTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectPageTemplate}
        onAddBlankPage={handleAddBlankPage}
      />
    </div>
  );
};
