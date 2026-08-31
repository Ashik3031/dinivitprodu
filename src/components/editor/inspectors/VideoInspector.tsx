import React, { useRef, useState } from 'react';
import { CanvasElement } from '../../../types';
import { Upload, Video, Play, VolumeX, Repeat, Sliders, FolderOpen, Loader2 } from 'lucide-react';
import { STOCK_ASSETS } from '../../../data/stockAssets';
import { processVideo } from '../../../utils/mediaOptimizer';
import { MediaManagerModal } from '../../media/MediaManagerModal';

interface VideoInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  currentInvitationId?: string;
  businessId?: string;
}

export const VideoInspector: React.FC<VideoInspectorProps> = ({
  element,
  onUpdateElement,
  currentInvitationId,
  businessId
}) => {
  const { style, content } = element;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const res = await processVideo(file);
      onUpdateElement(element.id, {
        content: {
          ...content,
          videoUrl: res.url,
          videoPoster: res.thumbnailUrl
        }
      });
    } catch (err) {
      console.error('Failed to process video:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
        Video Settings
      </span>

      {/* Media Library Button & Upload */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Browse Media Library</span>
        </button>

        {/* Upload / Replace Buttons */}
        <div className="flex gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.mp4,.webm"
            className="hidden"
            onChange={handleVideoUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
          >
            {isProcessing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Upload MP4'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const stockVideos = STOCK_ASSETS.filter(a => a.type === 'video');
              const fallbackVideos = [
                { url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-in-a-box-41589-large.mp4' },
                { url: 'https://assets.mixkit.co/videos/preview/mixkit-glittering-golden-bokeh-lights-background-41221-large.mp4' }
              ];
              const pool = stockVideos.length > 0 ? stockVideos : fallbackVideos;
              const random = pool[Math.floor(Math.random() * pool.length)];
              onUpdateElement(element.id, {
                content: { ...content, videoUrl: random.url }
              });
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Stock Video</span>
          </button>
        </div>
      </div>

      {/* Video URL */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Video Source URL (MP4 / WebM)</label>
        <input
          type="text"
          value={content.videoUrl || ''}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, videoUrl: e.target.value }
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          placeholder="https://..."
        />
      </div>

      {/* Media Manager Modal */}
      <MediaManagerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title="Select Video from Library"
        currentInvitationId={currentInvitationId}
        businessId={businessId}
        selectedElement={element}
        onAddElement={() => {}}
        onUpdateElement={onUpdateElement}
        onSelectMedia={(asset) => {
          onUpdateElement(element.id, {
            content: {
              ...content,
              videoUrl: asset.url,
              videoPoster: asset.thumbnailUrl
            }
          });
        }}
      />

      {/* Video Poster URL */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Poster Thumbnail (Optional)</label>
        <input
          type="text"
          value={content.videoPoster || ''}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, videoPoster: e.target.value }
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          placeholder="https://...poster.jpg"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
          Playback Controls
        </label>

        {/* Autoplay */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-800">Autoplay</span>
          </div>
          <input
            type="checkbox"
            checked={content.videoAutoplay !== false}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, videoAutoplay: e.target.checked }
              })
            }
            className="w-4 h-4 accent-slate-900"
          />
        </label>

        {/* Muted */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <VolumeX className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-800">Muted (Required for Autoplay)</span>
          </div>
          <input
            type="checkbox"
            checked={content.videoMuted !== false}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, videoMuted: e.target.checked }
              })
            }
            className="w-4 h-4 accent-slate-900"
          />
        </label>

        {/* Loop */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-800">Loop Continuously</span>
          </div>
          <input
            type="checkbox"
            checked={content.videoLoop !== false}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, videoLoop: e.target.checked }
              })
            }
            className="w-4 h-4 accent-slate-900"
          />
        </label>

        {/* Background Mode */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-800">Background Video Overlay</span>
          </div>
          <input
            type="checkbox"
            checked={content.videoIsBackground === true}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, videoIsBackground: e.target.checked }
              })
            }
            className="w-4 h-4 accent-slate-900"
          />
        </label>
      </div>
    </div>
  );
};
