import React, { useState, useRef } from 'react';
import { InvitationPage, PageTemplate } from '../../types';
import {
  GripVertical,
  Plus,
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
  Edit2,
  Check,
  X,
  FileText,
  Sparkles,
  Layers,
  Palette,
  Image as ImageIcon,
  Video as VideoIcon,
  Maximize2,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

interface PagesTabProps {
  pages: InvitationPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddBlankPage: () => void;
  onOpenTemplatesModal: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onRenamePage: (index: number, newName: string) => void;
  onReorderPages: (fromIndex: number, toIndex: number) => void;
}

export const PagesTab: React.FC<PagesTabProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  onAddBlankPage,
  onOpenTemplatesModal,
  onDuplicatePage,
  onDeletePage,
  onRenamePage,
  onReorderPages
}) => {
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // Inline rename state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Add Page dropdown menu state
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);

  const startRenaming = (index: number, currentName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingIndex(index);
    setEditingName(currentName);
    setTimeout(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }, 50);
  };

  const saveRenaming = (index: number) => {
    if (editingName.trim()) {
      onRenamePage(index, editingName.trim());
    }
    setEditingIndex(null);
  };

  const cancelRenaming = () => {
    setEditingIndex(null);
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Optionally reset if leaving the list
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorderPages(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Get visual badge for page background
  const getBackgroundIcon = (bg: InvitationPage['background']) => {
    if (!bg) return <Palette className="w-3 h-3 text-slate-400" />;
    switch (bg.type) {
      case 'video':
        return <VideoIcon className="w-3 h-3 text-purple-600" title="Video Background" />;
      case 'image':
      case 'pattern':
      case 'texture':
        return <ImageIcon className="w-3 h-3 text-blue-600" title="Image Background" />;
      case 'gradient':
        return (
          <div
            className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
            style={{
              background: `linear-gradient(135deg, ${bg.gradient?.colors?.[0] || '#d4af37'}, ${bg.gradient?.colors?.[1] || '#071912'})`
            }}
            title="Gradient Background"
          />
        );
      case 'color':
      default:
        return (
          <div
            className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
            style={{ backgroundColor: bg.color || '#ffffff' }}
            title={`Color: ${bg.color || '#ffffff'}`}
          />
        );
    }
  };

  const getHeightModeLabel = (page: InvitationPage) => {
    if (page.heightMode === 'viewport' || page.isFullHeight) return 'Viewport';
    if (page.heightMode === 'auto') return 'Auto';
    return `${page.height || 844}px`;
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Page Count */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Pages
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200">
            {pages.length}
          </span>
        </div>

        {/* Quick Add Split Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Page</span>
          </button>

          {/* Add Page Dropdown Menu */}
          {showAddMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAddMenu(false)}
              />
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(false);
                    onAddBlankPage();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Blank Page</div>
                    <div className="text-[10px] text-slate-400">Empty canvas layout</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(false);
                    onOpenTemplatesModal();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                >
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">From Template...</div>
                    <div className="text-[10px] text-slate-400">Opening, Details, RSVP, Gallery</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pages Reorderable List */}
      <div className="space-y-2">
        {pages.map((page, index) => {
          const isActive = activePageIndex === index;
          const isDraggingThis = draggedIndex === index;
          const isDropTarget = dropTargetIndex === index;
          const isEditing = editingIndex === index;

          return (
            <div
              key={page.id}
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelectPage(index)}
              className={`relative rounded-xl border transition-all cursor-pointer group ${
                isDraggingThis ? 'opacity-40 scale-95 border-dashed border-slate-400' : ''
              } ${
                isDropTarget && !isDraggingThis
                  ? 'border-t-2 border-t-amber-500 bg-amber-50/50'
                  : ''
              } ${
                isActive
                  ? 'bg-slate-100/90 border-slate-900 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50/80 text-slate-700 hover:border-slate-300'
              }`}
            >
              {/* Item Row Content */}
              <div className="p-2.5 flex items-center justify-between gap-2">
                {/* Left Grip Handle & Index */}
                <div className="flex items-center gap-2">
                  <div
                    title="Drag to reorder page"
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {index + 1}
                  </span>

                  {/* Page Name or Inline Renaming Form */}
                  {isEditing ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRenaming(index);
                          if (e.key === 'Escape') cancelRenaming();
                        }}
                        className="text-xs bg-white border border-slate-900 rounded px-2 py-0.5 font-medium text-slate-900 w-32 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveRenaming(index)}
                        className="p-1 rounded bg-slate-900 text-white hover:bg-slate-800"
                        title="Save name"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelRenaming}
                        className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={(e) => startRenaming(index, page.name, e)}
                      className="max-w-[130px] select-none"
                      title="Double click to rename"
                    >
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {page.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          {getBackgroundIcon(page.background)}
                        </span>
                        <span>•</span>
                        <span>{page.elements?.length || 0} items</span>
                        <span>•</span>
                        <span className="font-mono text-[9px] uppercase">{getHeightModeLabel(page)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Inline Rename button */}
                  {!isEditing && (
                    <button
                      type="button"
                      title="Rename Page"
                      onClick={(e) => startRenaming(index, page.name, e)}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Move Up */}
                  {index > 0 && (
                    <button
                      type="button"
                      title="Move Up"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderPages(index, index - 1);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded cursor-pointer"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Move Down */}
                  {index < pages.length - 1 && (
                    <button
                      type="button"
                      title="Move Down"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderPages(index, index + 1);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded cursor-pointer"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Duplicate Page */}
                  <button
                    type="button"
                    title="Duplicate Page"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(index);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Page */}
                  {pages.length > 1 && (
                    <button
                      type="button"
                      title="Delete Page"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete page "${page.name}"?`)) {
                          onDeletePage(index);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Quick Action Banner */}
      <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenTemplatesModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Browse Page Templates</span>
        </button>

        <button
          type="button"
          onClick={onAddBlankPage}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Blank Page</span>
        </button>
      </div>
    </div>
  );
};
