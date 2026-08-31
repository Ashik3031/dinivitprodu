import React, { useState } from 'react';
import {
  X,
  Trash2,
  Copy,
  Check,
  Download,
  Plus,
  RefreshCw,
  Image as ImageIcon,
  Video,
  Music,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  Clock,
  HardDrive
} from 'lucide-react';
import { MediaAsset, CanvasElement, ElementType } from '../../types';
import { formatBytes, formatDuration } from '../../utils/mediaOptimizer';

interface MediaPreviewModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onInsertAsElement?: (type: ElementType, customProps?: Partial<CanvasElement>) => void;
  onApplyToSelected?: (asset: MediaAsset) => void;
  onSetAsBackground?: (url: string, type: 'image' | 'video') => void;
  onSetAsMusic?: (audioUrl: string, title: string) => void;
  selectedElement?: CanvasElement | null;
  currentInvitationId?: string;
  onUpdateMetadata?: (id: string, updates: Partial<MediaAsset>) => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  asset,
  isOpen,
  onClose,
  onDelete,
  onInsertAsElement,
  onApplyToSelected,
  onSetAsBackground,
  onSetAsMusic,
  selectedElement,
  currentInvitationId,
  onUpdateMetadata
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !asset) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && onUpdateMetadata) {
      onUpdateMetadata(asset.id, { title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleInsert = () => {
    if (!onInsertAsElement) return;

    if (asset.type === 'image' || asset.type === 'pattern' || asset.type === 'texture') {
      const width = 300;
      const aspect = asset.dimensions ? asset.dimensions.height / asset.dimensions.width : 1.2;
      const height = Math.round(width * Math.min(Math.max(aspect, 0.5), 2.0));

      onInsertAsElement('image', {
        name: asset.title,
        content: { src: asset.url, alt: asset.title },
        style: { x: 45, y: 150, width, height, borderRadius: 16 }
      });
    } else if (asset.type === 'video') {
      onInsertAsElement('video', {
        name: asset.title,
        content: {
          videoUrl: asset.url,
          videoPoster: asset.thumbnailUrl,
          videoAutoplay: true,
          videoLoop: true,
          videoMuted: true
        },
        style: { x: 35, y: 140, width: 320, height: 200, borderRadius: 16 }
      });
    } else if (asset.type === 'audio') {
      onInsertAsElement('audio', {
        name: asset.title,
        content: {
          audioUrl: asset.url,
          audioTitle: asset.title,
          audioArtist: asset.category || 'Uploaded Track',
          audioLoop: true
        },
        style: { x: 45, y: 300, width: 300, height: 52 }
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Left / Top: Media Preview Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 relative min-h-[320px] md:min-h-[480px]">
          {/* Close button on top-left of media area */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
              {asset.type} • {asset.format?.toUpperCase() || 'FILE'}
            </span>
          </div>

          {/* Media Content */}
          {asset.type === 'image' && (
            <div className="w-full h-full flex items-center justify-center max-h-[420px]">
              <img
                src={asset.url}
                alt={asset.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {asset.type === 'video' && (
            <div className="w-full h-full flex items-center justify-center max-h-[420px]">
              <video
                src={asset.url}
                controls
                autoPlay
                loop
                playsInline
                className="max-w-full max-h-full rounded-lg shadow-lg"
                poster={asset.thumbnailUrl}
              />
            </div>
          )}

          {asset.type === 'audio' && (
            <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <Music className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white truncate">{asset.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{asset.name || 'Audio Track'}</p>
              </div>
              <audio src={asset.url} controls className="w-full mt-2" />
            </div>
          )}
        </div>

        {/* Right / Sidebar: Metadata & Actions */}
        <div className="w-full md:w-80 bg-white p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto">
          <div>
            {/* Header with Close */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex-1 pr-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-slate-900"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveTitle}
                      className="p-1 rounded bg-slate-900 text-white hover:bg-slate-800 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug break-words">
                      {asset.title}
                    </h3>
                  </div>
                )}
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{asset.name || asset.title}</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File Specifications Details */}
            <div className="py-4 space-y-2.5 border-b border-slate-100 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Asset Specifications
              </span>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  <span>File Size</span>
                </span>
                <span className="font-semibold text-slate-800 font-mono">
                  {formatBytes(asset.size || 0)}
                </span>
              </div>

              {asset.dimensions && (
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Resolution</span>
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {asset.dimensions.width} × {asset.dimensions.height} px
                  </span>
                </div>
              )}

              {asset.duration !== undefined && asset.duration > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration</span>
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatDuration(asset.duration)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Uploaded</span>
                </span>
                <span className="text-slate-700">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reused In</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-800 text-[10px]">
                  {(asset.invitationIds?.length || 1)} invitation(s)
                </span>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="py-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Quick Integration
              </span>

              {/* Insert as new Element */}
              <button
                type="button"
                onClick={handleInsert}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert as Canvas Element</span>
              </button>

              {/* Replace Selected Element */}
              {selectedElement && onApplyToSelected && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyToSelected(asset);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Apply to Selected {selectedElement.type}</span>
                </button>
              )}

              {/* Set as Page Background (Images/Videos) */}
              {(asset.type === 'image' || asset.type === 'video') && onSetAsBackground && (
                <button
                  type="button"
                  onClick={() => {
                    onSetAsBackground(asset.url, asset.type as 'image' | 'video');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Set as Page Background</span>
                </button>
              )}

              {/* Set as Background Music (Audio) */}
              {asset.type === 'audio' && onSetAsMusic && (
                <button
                  type="button"
                  onClick={() => {
                    onSetAsMusic(asset.url, asset.title);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <Music className="w-3.5 h-3.5 text-slate-500" />
                  <span>Set as Invitation Music</span>
                </button>
              )}

              {/* Copy URL */}
              <button
                type="button"
                onClick={handleCopyUrl}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'URL Copied!' : 'Copy Direct URL'}</span>
              </button>
            </div>
          </div>

          {/* Delete Action with Confirmation */}
          <div className="pt-3 border-t border-slate-100">
            {confirmDelete ? (
              <div className="space-y-1.5">
                <p className="text-[11px] text-rose-600 font-medium text-center">
                  Permanently delete this file from library?
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(asset.id);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete from Library</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
