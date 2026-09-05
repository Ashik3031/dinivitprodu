import React from 'react';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Undo2,
  Redo2,
  Eye,
  Save,
  Share2,
  Grid,
  Globe,
  Settings,
  EyeOff,
  Check
} from 'lucide-react';
import { Invitation } from '../../types';

interface EditorTopNavProps {
  invitation: Invitation;
  onUpdateTitle: (title: string) => void;
  onUpdateStatus: (status: 'draft' | 'published') => void;
  viewportMode: 'mobile' | 'tablet' | 'desktop';
  onChangeViewport: (mode: 'mobile' | 'tablet' | 'desktop') => void;
  zoomLevel: number;
  onChangeZoom: (zoom: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  lastSavedAt?: Date | null;
  isPreview: boolean;
  onTogglePreview: () => void;
  onOpenShareModal: () => void;
  onOpenSettingsModal: () => void;
  onBackToDashboard: () => void;
  isTemplateMode?: boolean;
  onBackToAdmin?: () => void;
}

export const EditorTopNav: React.FC<EditorTopNavProps> = ({
  invitation,
  onUpdateTitle,
  onUpdateStatus,
  viewportMode,
  onChangeViewport,
  zoomLevel,
  onChangeZoom,
  showGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  isSaving,
  hasUnsavedChanges = false,
  lastSavedAt = null,
  isPreview,
  onTogglePreview,
  onOpenShareModal,
  onOpenSettingsModal,
  onBackToDashboard,
  isTemplateMode = false,
  onBackToAdmin
}) => {
  const isPublished = invitation.status === 'published';

  const handleTogglePublish = () => {
    onUpdateStatus(isPublished ? 'draft' : 'published');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between select-none z-40 text-slate-800 gap-2">
      {/* Left: Back & Invitation Title & Status */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={isTemplateMode && onBackToAdmin ? onBackToAdmin : onBackToDashboard}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{isTemplateMode ? 'Admin Templates' : 'Dashboard'}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={invitation.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-xs sm:text-sm font-semibold bg-transparent hover:bg-slate-100 focus:bg-slate-50 border border-transparent focus:border-slate-300 rounded-lg px-2 py-1 text-slate-900 focus:outline-none transition-colors max-w-[130px] sm:max-w-[200px] truncate"
          />
          {isTemplateMode ? (
            <span className="text-[9px] sm:text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <span>🎨 Template</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onOpenShareModal}
              title={isPublished ? 'Live Invitation - Click to manage distribution' : 'Draft - Click to publish'}
              className={`text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all ${
                isPublished
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
              }`}
            >
              {isPublished ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Draft</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Center: Viewport & Canvas Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-0.5 border-r border-slate-200 pr-1 mr-0.5">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-600 disabled:hover:bg-transparent cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-600 disabled:hover:bg-transparent cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport controls: [ Desktop ] [ Tablet ] [ Mobile ] */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            title="Desktop Mode (960px)"
            onClick={() => onChangeViewport('desktop')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-white shadow-xs text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            title="Tablet Mode (768px)"
            onClick={() => onChangeViewport('tablet')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-white shadow-xs text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            type="button"
            title="Mobile Mode (390px - Mobile First)"
            onClick={() => onChangeViewport('mobile')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-white shadow-xs text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Zoom selector */}
        <div className="hidden lg:block border-l border-slate-200 pl-1.5 ml-1">
          <select
            value={zoomLevel}
            onChange={(e) => onChangeZoom(Number(e.target.value))}
            className="text-xs bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 cursor-pointer"
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={110}>110%</option>
            <option value={125}>125%</option>
          </select>
        </div>

        {/* Grid toggle */}
        <button
          type="button"
          title="Toggle Grid Guidelines"
          onClick={onToggleGrid}
          className={`hidden sm:block p-1.5 rounded-lg transition-colors cursor-pointer ${
            showGrid ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions (Settings, Preview, Save Draft, Publish, Share) */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenSettingsModal}
          title="Opening Screen & Music Settings"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
            isPreview
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isPreview ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Save Draft / Auto-save Status */}
        <button
          id="btn-editor-save-draft"
          type="button"
          onClick={onSave}
          disabled={isSaving}
          title={
            isSaving
              ? 'Saving changes...'
              : hasUnsavedChanges
              ? 'You have unsaved changes (Click to Save immediately)'
              : lastSavedAt
              ? `Saved at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'All changes saved'
          }
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-50 cursor-pointer ${
            hasUnsavedChanges
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <Save className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">{isTemplateMode ? 'Save Template' : 'Save Draft'}</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Saved</span>
            </>
          )}
        </button>

        {/* Publish / Unpublish Toggle */}
        <button
          type="button"
          onClick={handleTogglePublish}
          title={
            isTemplateMode
              ? isPublished
                ? 'Public Library: Visible to all users creating invitations'
                : 'Draft: Hidden from users until published'
              : isPublished
              ? 'Live invitation'
              : 'Draft invitation'
          }
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            isPublished
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-xs'
          }`}
        >
          {isPublished ? (
            <>
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{isTemplateMode ? 'Public Library' : 'Published'}</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isTemplateMode ? 'Publish to Library' : 'Publish'}</span>
            </>
          )}
        </button>

        {/* Share Modal */}
        <button
          type="button"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Share</span>
        </button>
      </div>
    </header>
  );
};
