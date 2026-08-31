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
  Sparkles,
  Check,
  Globe,
  Settings,
  Music
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
  isPreview: boolean;
  onTogglePreview: () => void;
  onOpenShareModal: () => void;
  onOpenSettingsModal: () => void;
  onBackToDashboard: () => void;
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
  isPreview,
  onTogglePreview,
  onOpenShareModal,
  onOpenSettingsModal,
  onBackToDashboard
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between select-none z-40 text-slate-800">
      {/* Left: Back & Invitation Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={invitation.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-sm font-semibold bg-transparent hover:bg-slate-100 focus:bg-slate-50 border border-transparent focus:border-slate-300 rounded-lg px-2 py-1 text-slate-900 focus:outline-none transition-colors max-w-[200px] sm:max-w-xs truncate"
          />
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
            invitation.status === 'published'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {invitation.status}
          </span>
        </div>
      </div>

      {/* Center: Viewport & Canvas Controls */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1 mr-1">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-600 disabled:hover:bg-transparent"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-600 disabled:hover:bg-transparent"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport switch: Desktop / Tablet / Mobile */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            title="Desktop Mode (960px)"
            onClick={() => onChangeViewport('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-white shadow-xs text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Desktop</span>
          </button>
          <button
            type="button"
            title="Tablet Mode (768px)"
            onClick={() => onChangeViewport('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-white shadow-xs text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tablet</span>
          </button>
          <button
            type="button"
            title="Mobile Mode (390px - Mobile First)"
            onClick={() => onChangeViewport('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-white shadow-xs text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        {/* Zoom selector */}
        <div className="border-l border-slate-200 pl-1.5 ml-1">
          <select
            value={zoomLevel}
            onChange={(e) => onChangeZoom(Number(e.target.value))}
            className="text-xs bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700"
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
          className={`p-1.5 rounded-lg transition-colors ${
            showGrid ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions (Save, Preview, Publish / Share) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettingsModal}
          title="Opening Screen & Music Settings"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
            isPreview
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isPreview ? 'Back to Editor' : 'Preview'}</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 text-slate-600" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Publish & Share</span>
        </button>
      </div>
    </header>
  );
};
