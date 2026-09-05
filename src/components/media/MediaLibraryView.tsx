import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Search,
  Image as ImageIcon,
  Video,
  Music,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Filter,
  Grid,
  List,
  Sparkles,
  Layers,
  HardDrive,
  Clock,
  Loader2,
  FolderOpen,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { MediaAsset, CanvasElement, ElementType } from '../../types';
import { api } from '../../services/api';
import {
  optimizeImage,
  processVideo,
  processAudio,
  formatBytes,
  formatDuration
} from '../../utils/mediaOptimizer';
import { MediaPreviewModal } from './MediaPreviewModal';
import { STOCK_ASSETS } from '../../data/stockAssets';

interface MediaLibraryViewProps {
  currentInvitationId?: string;
  businessId?: string;
  onAddElement: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  selectedElement?: CanvasElement | null;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onSetAsBackground?: (url: string, type: 'image' | 'video') => void;
  onSetAsMusic?: (audioUrl: string, title: string) => void;
  isModalView?: boolean;
  onSelectMedia?: (asset: MediaAsset) => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  currentInvitationId,
  businessId = 'usr-biz-royal',
  onAddElement,
  selectedElement,
  onUpdateElement,
  onSetAsBackground,
  onSetAsMusic,
  isModalView = false,
  onSelectMedia
}) => {
  // State
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [scope, setScope] = useState<'current' | 'all' | 'public' | 'stock'>('current');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<any>(null);

  // Preview Modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Drag & drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media Assets
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const res = await api.getMedia({
        businessId: scope === 'public' ? undefined : businessId,
        invitationId: scope === 'current' ? currentInvitationId : undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        search: searchQuery,
        scope: scope === 'public' ? 'public' : undefined,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      });
      setMediaList(res.media || []);

      const statsRes = await api.getMediaStats(businessId);
      setStats(statsRes.stats);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [businessId, currentInvitationId, selectedType, scope, selectedCategory, searchQuery]);

  // Handle Multi-file Upload with Client-Side Optimization
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const mime = file.type.toLowerCase();
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        setUploadProgressText(`Processing ${i + 1}/${files.length}: ${file.name}...`);

        if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
          setUploadProgressText(`Optimizing image & generating thumbnail (${file.name})...`);
          const opt = await optimizeImage(file, 1600, 0.85);

          await api.uploadMedia({
            businessId,
            invitationId: currentInvitationId,
            invitationIds: currentInvitationId ? [currentInvitationId] : [],
            title: file.name.replace(/\.[^/.]+$/, ''),
            name: file.name,
            url: opt.url,
            thumbnailUrl: opt.thumbnailUrl,
            type: 'image',
            format: opt.format,
            size: opt.size,
            dimensions: opt.dimensions,
            category: 'user-upload',
            tags: ['user', 'photo', ext]
          });
        } else if (mime.startsWith('video/') || ['mp4', 'webm'].includes(ext)) {
          setUploadProgressText(`Extracting video poster thumbnail (${file.name})...`);
          const proc = await processVideo(file);

          await api.uploadMedia({
            businessId,
            invitationId: currentInvitationId,
            invitationIds: currentInvitationId ? [currentInvitationId] : [],
            title: file.name.replace(/\.[^/.]+$/, ''),
            name: file.name,
            url: proc.url,
            thumbnailUrl: proc.thumbnailUrl,
            type: 'video',
            format: proc.format,
            size: proc.size,
            dimensions: proc.dimensions,
            duration: proc.duration,
            category: 'user-upload',
            tags: ['user', 'video', ext]
          });
        } else if (mime.startsWith('audio/') || ['mp3', 'wav', 'aac'].includes(ext)) {
          setUploadProgressText(`Reading audio metadata (${file.name})...`);
          const proc = await processAudio(file);

          await api.uploadMedia({
            businessId,
            invitationId: currentInvitationId,
            invitationIds: currentInvitationId ? [currentInvitationId] : [],
            title: file.name.replace(/\.[^/.]+$/, ''),
            name: file.name,
            url: proc.url,
            type: 'audio',
            format: proc.format,
            size: proc.size,
            duration: proc.duration,
            category: 'music',
            tags: ['user', 'music', 'audio', ext]
          });
        }
      }

      await fetchMedia();
    } catch (err: any) {
      console.error('Failed to process/upload media:', err);
      alert('Upload failed: ' + (err.message || 'Please check the file format.'));
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      if (stats) {
        setStats({ ...stats, totalCount: Math.max(0, stats.totalCount - 1) });
      }
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const handleInsertAsElement = (asset: MediaAsset) => {
    if (onSelectMedia) {
      onSelectMedia(asset);
      return;
    }

    if (asset.type === 'image' || asset.type === 'pattern' || asset.type === 'texture') {
      const width = 300;
      const aspect = asset.dimensions ? asset.dimensions.height / asset.dimensions.width : 1.2;
      const height = Math.round(width * Math.min(Math.max(aspect, 0.5), 2.0));

      onAddElement('image', {
        name: asset.title,
        content: { src: asset.url, alt: asset.title },
        style: { x: 45, y: 150, width, height, borderRadius: 16 }
      });
    } else if (asset.type === 'video') {
      onAddElement('video', {
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
      onAddElement('audio', {
        name: asset.title,
        content: {
          audioUrl: asset.url,
          audioTitle: asset.title,
          audioArtist: 'Uploaded Music',
          audioLoop: true
        },
        style: { x: 45, y: 300, width: 300, height: 52 }
      });
    }
  };

  const handleApplyToSelected = (asset: MediaAsset) => {
    if (!selectedElement || !onUpdateElement) return;

    if (selectedElement.type === 'image' && (asset.type === 'image' || asset.type === 'pattern')) {
      onUpdateElement(selectedElement.id, {
        content: { ...selectedElement.content, src: asset.url }
      });
    } else if (selectedElement.type === 'video' && asset.type === 'video') {
      onUpdateElement(selectedElement.id, {
        content: { ...selectedElement.content, videoUrl: asset.url, videoPoster: asset.thumbnailUrl }
      });
    } else if (selectedElement.type === 'audio' && asset.type === 'audio') {
      onUpdateElement(selectedElement.id, {
        content: { ...selectedElement.content, audioUrl: asset.url, audioTitle: asset.title }
      });
    } else if (selectedElement.type === 'container') {
      onUpdateElement(selectedElement.id, {
        style: {
          ...selectedElement.style,
          background: {
            type: asset.type === 'video' ? 'video' : 'image',
            [asset.type === 'video' ? 'videoUrl' : 'imageUrl']: asset.url,
            size: 'cover'
          }
        }
      });
    }
  };

  // Filtered & Sorted Media items
  const sortedList = [...mediaList].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Upload Zone & Drag Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative p-4 rounded-xl border-2 border-dashed transition-all text-center ${
          isDragOver
            ? 'border-slate-900 bg-slate-100 scale-[0.99]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mp3,.wav"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="py-2 flex flex-col items-center justify-center gap-2 text-slate-800">
            <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
            <div className="text-xs font-bold">{uploadProgressText || 'Uploading media...'}</div>
            <div className="text-[10px] text-slate-500">Auto-optimizing resolution and generating thumbnails</div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="w-9 h-9 mx-auto rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
              >
                Click to upload
              </button>
              <span className="text-xs text-slate-500"> or drag and drop</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              JPG, PNG, WEBP, MP4, MP3 • Auto-optimized
            </div>
          </div>
        )}
      </div>

      {/* Scope Selector: [Current Invitation] vs [All Workspace Media] vs [Public Frames & Assets] vs [Stock Library] */}
      <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => { setScope('current'); setSelectedCategory('all'); }}
          className={`flex-1 py-1 px-2 rounded-md transition-all whitespace-nowrap cursor-pointer ${
            scope === 'current'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          This Card
        </button>
        <button
          type="button"
          onClick={() => { setScope('all'); setSelectedCategory('all'); }}
          className={`flex-1 py-1 px-2 rounded-md transition-all whitespace-nowrap cursor-pointer ${
            scope === 'all'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Workspace
        </button>
        <button
          type="button"
          onClick={() => { setScope('public'); setSelectedCategory('all'); }}
          className={`flex-1 py-1 px-2 rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1 ${
            scope === 'public'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
              : 'text-amber-700 hover:text-amber-900'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Frames & Assets</span>
        </button>
        <button
          type="button"
          onClick={() => { setScope('stock'); setSelectedCategory('all'); }}
          className={`flex-1 py-1 px-2 rounded-md transition-all whitespace-nowrap cursor-pointer ${
            scope === 'stock'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Stock Library
        </button>
      </div>

      {/* Public Assets Categories */}
      {scope === 'public' && (
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px]">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'frames', label: 'Frames' },
            { id: 'borders', label: 'Borders' },
            { id: 'floral', label: 'Floral' },
            { id: 'monograms', label: 'Monograms' },
            { id: 'badges', label: 'Badges & Seals' },
            { id: 'stickers', label: 'Stickers' },
            { id: 'backgrounds', label: 'Backgrounds' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Search & Media Type Filter Bar */}
      {scope !== 'stock' ? (
        <div className="space-y-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Type Filter Pills & Sort/View toggles */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'all', label: 'All', icon: null },
                { id: 'image', label: 'Images', icon: ImageIcon },
                { id: 'video', label: 'Videos', icon: Video },
                { id: 'audio', label: 'Audio', icon: Music }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id as any)}
                  className={`px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedType === t.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.icon && <t.icon className="w-3 h-3" />}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Sort selection */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="size">Size</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      ) : null}

      {/* Media Grid / List Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 min-h-[220px]">
        {scope === 'stock' ? (
          /* Stock assets view */
          <div className="grid grid-cols-2 gap-2">
            {STOCK_ASSETS.map((asset) => (
              <div
                key={asset.id}
                onClick={() => {
                  if (asset.type === 'audio') {
                    onAddElement('audio', {
                      content: { audioUrl: asset.url, audioTitle: asset.name },
                      style: { x: 45, y: 300, width: 300, height: 50 }
                    });
                  } else {
                    onAddElement('image', {
                      content: { src: asset.url, alt: asset.name },
                      style: { x: 45, y: 150, width: 300, height: 320, borderRadius: 16 }
                    });
                  }
                }}
                className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-900 transition-all cursor-pointer shadow-xs"
              >
                {asset.type === 'audio' ? (
                  <div className="h-24 bg-slate-50 flex flex-col items-center justify-center p-2 text-slate-700">
                    <Music className="w-6 h-6 mb-1 text-slate-500" />
                    <span className="text-[10px] text-center truncate w-full text-slate-700 font-medium">
                      {asset.name}
                    </span>
                  </div>
                ) : (
                  <div className="relative h-24 bg-slate-100">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-white">
                      Insert
                    </div>
                  </div>
                )}
                <div className="p-1.5 text-[10px] font-medium text-slate-700 truncate">{asset.name}</div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            <span className="text-xs">Loading media assets...</span>
          </div>
        ) : sortedList.length === 0 ? (
          <div className="py-10 text-center text-slate-400 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-slate-600">No media assets found</div>
            <div className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {scope === 'current'
                ? 'Upload photos, videos, or music for this invitation, or switch to All Workspace.'
                : 'Upload images, background videos, and audio tracks.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {sortedList.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-900 transition-all shadow-xs flex flex-col"
              >
                {/* Thumbnail Header Area */}
                <div className="relative h-24 bg-slate-100 overflow-hidden flex items-center justify-center">
                  {asset.type === 'image' && (
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {asset.type === 'video' && (
                    <div className="w-full h-full relative">
                      <img
                        src={asset.thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-900">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {asset.type === 'audio' && (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-2 text-amber-400">
                      <Music className="w-6 h-6 mb-1" />
                      <span className="text-[10px] text-slate-300 font-mono">
                        {asset.duration ? formatDuration(asset.duration) : 'Audio'}
                      </span>
                    </div>
                  )}

                  {/* Format & Size Badge */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                    {asset.format || asset.type}
                  </div>

                  {/* Hover Overlay with Action Buttons */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    {/* Insert Button */}
                    <button
                      type="button"
                      title="Insert onto Canvas"
                      onClick={() => handleInsertAsElement(asset)}
                      className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    {/* Preview Button */}
                    <button
                      type="button"
                      title="Preview & Specs"
                      onClick={() => {
                        setPreviewAsset(asset);
                        setIsPreviewOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      title="Delete Asset"
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Title & Specs Footer */}
                <div className="p-2 flex flex-col justify-between flex-1 bg-white">
                  <div className="text-[11px] font-semibold text-slate-900 truncate leading-tight">
                    {asset.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{formatBytes(asset.size || 0)}</span>
                    {asset.dimensions && (
                      <span>{asset.dimensions.width}×{asset.dimensions.height}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal */}
      <MediaPreviewModal
        asset={previewAsset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDelete={handleDelete}
        onInsertAsElement={onAddElement}
        onApplyToSelected={handleApplyToSelected}
        onSetAsBackground={onSetAsBackground}
        onSetAsMusic={onSetAsMusic}
        selectedElement={selectedElement}
        currentInvitationId={currentInvitationId}
        onUpdateMetadata={async (id, updates) => {
          try {
            await api.updateMedia(id, updates);
            setMediaList((prev) =>
              prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
            );
          } catch (err) {
            console.error('Failed to update metadata:', err);
          }
        }}
      />
    </div>
  );
};
