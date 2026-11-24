import React, { useEffect } from 'react';
import { X, Image as ImageIcon, Video, Sparkles } from 'lucide-react';
import { MediaAsset, ElementType, CanvasElement } from '../../types';
import { MediaLibraryView } from './MediaLibraryView';

interface BackgroundAssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assetUrl: string, asset: MediaAsset) => void;
  onApplyToAllPages?: (assetUrl: string, asset: MediaAsset) => void;
  mode?: 'image' | 'video';
  currentInvitationId?: string;
  businessId?: string;
  onAddElement?: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
}

export const BackgroundAssetPickerModal: React.FC<BackgroundAssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onApplyToAllPages,
  mode = 'image',
  currentInvitationId,
  businessId = 'usr-biz-royal',
  onAddElement = () => {}
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isVideo = mode === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl h-[88vh] max-h-[820px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-900 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isVideo
                ? 'bg-purple-50 border border-purple-200 text-purple-600'
                : 'bg-amber-50 border border-amber-200 text-amber-600'
            }`}>
              {isVideo ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {isVideo ? 'Choose Page Background Video' : 'Choose Page Background Image'}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {isVideo ? 'Video Loops' : 'Asset Library'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isVideo
                  ? 'Select an ambient looping video or upload an MP4/WebM to cover the page background'
                  : 'Select a high-resolution background, stock photo, or upload your own image'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Embedded Reusable MediaLibraryView */}
        <div className="flex-1 overflow-hidden p-4 bg-white">
          <MediaLibraryView
            currentInvitationId={currentInvitationId}
            businessId={businessId}
            isModalView={true}
            filterType={isVideo ? 'video-only' : 'image-only'}
            initialCategory={isVideo ? 'video' : 'backgrounds'}
            initialScope="all"
            onSelectMedia={(asset) => {
              onSelect(asset.url, asset);
              onClose();
            }}
            onSetAsBackground={(url, type) => {
              onSelect(url, { url, type } as any);
              onClose();
            }}
            onApplyBackgroundToAllPages={onApplyToAllPages ? (url, type) => {
              onApplyToAllPages(url, { url, type } as any);
              onClose();
            } : undefined}
            onAddElement={onAddElement}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Click any image to immediately apply it as the page background.</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
