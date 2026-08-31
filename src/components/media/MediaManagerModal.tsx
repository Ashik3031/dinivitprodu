import React from 'react';
import { X, FolderOpen, Sparkles } from 'lucide-react';
import { MediaAsset, CanvasElement, ElementType } from '../../types';
import { MediaLibraryView } from './MediaLibraryView';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  currentInvitationId?: string;
  businessId?: string;
  selectedElement?: CanvasElement | null;
  onAddElement: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onSetAsBackground?: (url: string, type: 'image' | 'video') => void;
  onSetAsMusic?: (audioUrl: string, title: string) => void;
  onSelectMedia?: (asset: MediaAsset) => void;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  title = 'Media Library & Assets',
  currentInvitationId,
  businessId,
  selectedElement,
  onAddElement,
  onUpdateElement,
  onSetAsBackground,
  onSetAsMusic,
  onSelectMedia
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] max-h-[750px] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{title}</h2>
              <p className="text-[11px] text-slate-500">
                Upload, optimize, and reuse photos, videos, and music across invitations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body containing MediaLibraryView */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <MediaLibraryView
            currentInvitationId={currentInvitationId}
            businessId={businessId}
            onAddElement={(type, customProps, parentId) => {
              onAddElement(type, customProps, parentId);
              onClose();
            }}
            selectedElement={selectedElement}
            onUpdateElement={onUpdateElement}
            onSetAsBackground={onSetAsBackground}
            onSetAsMusic={onSetAsMusic}
            isModalView={true}
            onSelectMedia={(asset) => {
              if (onSelectMedia) {
                onSelectMedia(asset);
              }
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
