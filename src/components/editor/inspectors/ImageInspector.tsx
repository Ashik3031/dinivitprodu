import React, { useRef, useState } from 'react';
import { CanvasElement } from '../../../types';
import { Upload, RefreshCw, Image as ImageIcon, Sparkles, FolderOpen } from 'lucide-react';
import { STOCK_ASSETS } from '../../../data/stockAssets';
import { optimizeImage } from '../../../utils/mediaOptimizer';
import { MediaManagerModal } from '../../media/MediaManagerModal';

interface ImageInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  currentInvitationId?: string;
  businessId?: string;
}

export const ImageInspector: React.FC<ImageInspectorProps> = ({
  element,
  onUpdateElement,
  currentInvitationId,
  businessId
}) => {
  const { style, content } = element;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizing(true);
      const opt = await optimizeImage(file);
      onUpdateElement(element.id, {
        content: { ...content, src: opt.url }
      });
    } catch (err) {
      console.error('Failed to optimize image:', err);
    } finally {
      setIsOptimizing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filterPresets = [
    { id: 'normal', label: 'Normal' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'warm', label: 'Warm Glow' },
    { id: 'cool', label: 'Cool Dusk' },
    { id: 'dramatic', label: 'Dramatic' },
    { id: 'bw', label: 'Black & White' },
    { id: 'faded', label: 'Faded Film' }
  ];

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 block">
        Image Source & Filters
      </span>

      {/* Image Preview & Upload / Replace */}
      <div className="space-y-2">
        <div className="w-full h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
          <img
            src={content.src || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-white text-slate-900 rounded-md text-[11px] font-semibold flex items-center gap-1 shadow hover:bg-slate-50 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Browse Media Library</span>
          </button>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isOptimizing}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isOptimizing ? 'Optimizing...' : 'Upload File'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const photoAssets = STOCK_ASSETS.filter(a => a.type === 'image');
                const randomStock = photoAssets[Math.floor(Math.random() * photoAssets.length)];
                if (randomStock) {
                  onUpdateElement(element.id, {
                    content: { ...content, src: randomStock.url }
                  });
                }
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
              title="Random Stock Photo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Media Manager Modal */}
      <MediaManagerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title="Select Image from Library"
        currentInvitationId={currentInvitationId}
        businessId={businessId}
        selectedElement={element}
        onAddElement={() => {}}
        onUpdateElement={onUpdateElement}
        onSelectMedia={(asset) => {
          onUpdateElement(element.id, {
            content: { ...content, src: asset.url }
          });
        }}
      />

      {/* Image URL */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Image URL</label>
        <input
          type="text"
          value={content.src || ''}
          onChange={(e) =>
            onUpdateElement(element.id, {
              content: { ...content, src: e.target.value }
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          placeholder="https://..."
        />
      </div>

      {/* Object Fit & Border Radius */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-500 block">Object Fit</label>
          <select
            value={style.objectFit || 'cover'}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, objectFit: e.target.value as any }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          >
            <option value="cover">Cover (Fill & Crop)</option>
            <option value="contain">Contain (Full Aspect)</option>
            <option value="fill">Fill (Stretch)</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block">Corner Radius (px)</label>
          <input
            type="number"
            min="0"
            max="200"
            value={typeof style.borderRadius === 'number' ? style.borderRadius : 0}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, borderRadius: Number(e.target.value) }
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Filter Presets */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
            Filter Preset
          </label>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {filterPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                onUpdateElement(element.id, {
                  style: { ...style, filterPreset: p.id as any }
                })
              }
              className={`py-1.5 px-2 rounded border text-[11px] font-medium text-left transition-colors cursor-pointer ${
                (style.filterPreset || 'normal') === p.id
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="space-y-2 pt-2">
        <label className="text-[10px] text-slate-500 block font-semibold">Fine-Tuning Controls</label>
        
        {/* Brightness */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
            <span>Brightness</span>
            <span className="font-mono">{style.filterBrightness ?? 100}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="180"
            value={style.filterBrightness ?? 100}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, filterBrightness: Number(e.target.value), filterPreset: undefined }
              })
            }
            className="w-full accent-slate-900"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
            <span>Contrast</span>
            <span className="font-mono">{style.filterContrast ?? 100}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={style.filterContrast ?? 100}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, filterContrast: Number(e.target.value), filterPreset: undefined }
              })
            }
            className="w-full accent-slate-900"
          />
        </div>

        {/* Grayscale */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
            <span>Grayscale</span>
            <span className="font-mono">{style.filterGrayscale ?? 0}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={style.filterGrayscale ?? 0}
            onChange={(e) =>
              onUpdateElement(element.id, {
                style: { ...style, filterGrayscale: Number(e.target.value), filterPreset: undefined }
              })
            }
            className="w-full accent-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
