import React, { useRef, useState } from 'react';
import { CanvasElement } from '../../../types';
import { Upload, Music, Play, Volume2, Repeat, Disc, Sparkles, FolderOpen, Loader2 } from 'lucide-react';
import { STOCK_ASSETS } from '../../../data/stockAssets';
import { processAudio } from '../../../utils/mediaOptimizer';
import { MediaManagerModal } from '../../media/MediaManagerModal';

interface AudioInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  currentInvitationId?: string;
  businessId?: string;
}

export const AudioInspector: React.FC<AudioInspectorProps> = ({
  element,
  onUpdateElement,
  currentInvitationId,
  businessId
}) => {
  const { style, content } = element;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const res = await processAudio(file);
      onUpdateElement(element.id, {
        content: {
          ...content,
          audioUrl: res.url,
          audioTitle: file.name.replace(/\.[^/.]+$/, ''),
          audioArtist: 'Uploaded Audio'
        }
      });
    } catch (err) {
      console.error('Failed to process audio:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const stockTracks = [
    { title: 'Romantic Wedding Symphony', url: 'https://cdn.freesound.org/previews/467/467269_4939433-lq.mp3', artist: 'Classic Strings' },
    { title: 'Acoustic Love Song', url: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3', artist: 'Acoustic Ensemble' },
    { title: 'Cinematic Piano Waltz', url: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3', artist: 'Grand Piano' }
  ];

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
        Audio Player Settings
      </span>

      {/* Media Library Button */}
      <button
        type="button"
        onClick={() => setIsMediaModalOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
      >
        <FolderOpen className="w-3.5 h-3.5" />
        <span>Browse Media Library</span>
      </button>

      {/* Track Title & Artist */}
      <div className="space-y-2">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Track Title</label>
          <input
            type="text"
            value={content.audioTitle || ''}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, audioTitle: e.target.value }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Mendelssohn Wedding March"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Artist / Ensemble (Optional)</label>
          <input
            type="text"
            value={content.audioArtist || ''}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, audioArtist: e.target.value }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            placeholder="e.g. Royal Philharmonic Orchestra"
          />
        </div>
      </div>

      {/* Audio Source URL */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Audio Source URL (MP3 / AAC / WAV)</label>
        <input
          type="text"
          value={content.audioUrl || ''}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, audioUrl: e.target.value }
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
        title="Select Audio Track from Library"
        currentInvitationId={currentInvitationId}
        businessId={businessId}
        selectedElement={element}
        onAddElement={() => {}}
        onUpdateElement={onUpdateElement}
        onSelectMedia={(asset) => {
          onUpdateElement(element.id, {
            content: {
              ...content,
              audioUrl: asset.url,
              audioTitle: asset.title,
              audioArtist: asset.category || 'Uploaded Track'
            }
          });
        }}
      />

      {/* Upload File & Stock Selector */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleAudioUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Audio File</span>
        </button>

        {/* Stock Melodies list */}
        <div className="pt-1">
          <label className="text-[10px] text-slate-500 block mb-1">Choose Royalty-Free Melody</label>
          <div className="space-y-1">
            {stockTracks.map((tr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onUpdateElement(element.id, {
                    content: {
                      ...content,
                      audioUrl: tr.url,
                      audioTitle: tr.title,
                      audioArtist: tr.artist
                    }
                  })
                }
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  content.audioUrl === tr.url
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Disc className={`w-3.5 h-3.5 shrink-0 ${content.audioUrl === tr.url ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div className="text-[11px] font-medium leading-tight truncate">{tr.title}</div>
                    <div className={`text-[10px] ${content.audioUrl === tr.url ? 'text-slate-300' : 'text-slate-500'}`}>{tr.artist}</div>
                  </div>
                </div>
                <Play className="w-3 h-3 shrink-0 opacity-70" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
          Playback Preferences
        </label>

        {/* Loop */}
        <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-800">Loop Continuously</span>
          </div>
          <input
            type="checkbox"
            checked={content.audioLoop !== false}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, audioLoop: e.target.checked }
              })
            }
            className="w-4 h-4 accent-slate-900"
          />
        </label>

        {/* Volume */}
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              <span>Default Volume</span>
            </span>
            <span className="font-mono">{Math.round((content.audioVolume ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={content.audioVolume ?? 1}
            onChange={(e) =>
              onUpdateElement(element.id, {
                content: { ...content, audioVolume: Number(e.target.value) }
              })
            }
            className="w-full accent-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
