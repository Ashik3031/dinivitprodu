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
  ExternalLink,
  ChevronDown,
  ChevronUp
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
  initialScope?: 'public' | 'uploads' | 'all';
  initialCategory?: string;
  currentMusicUrl?: string;
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
  onSelectMedia,
  initialScope = 'all',
  initialCategory = 'all',
  currentMusicUrl
}) => {
  // State
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'gif' | 'audio'>('all');
  const [scope, setScope] = useState<'public' | 'uploads' | 'all'>(initialScope);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'name'>('newest');
  const [addedAssetId, setAddedAssetId] = useState<string | null>(null);

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
        invitationId: scope === 'uploads' ? currentInvitationId : undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        search: searchQuery,
        scope: scope,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      });
      setMediaList(res.media || []);
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

        if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
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
            type: ext === 'gif' ? 'gif' : 'image',
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

      // If in public view, switch to uploads or all so user sees their newly uploaded file
      if (scope === 'public') {
        setScope('uploads');
      }
      await fetchMedia();
    } catch (err: any) {
      console.error('Failed to process/upload media:', err);
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

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const handleInsertAsElement = (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Trigger visual feedback
    setAddedAssetId(asset.id);
    setTimeout(() => setAddedAssetId(null), 1500);

    if (onSelectMedia) {
      onSelectMedia(asset);
      return;
    }

    if (asset.type === 'image' || asset.type === 'pattern' || asset.type === 'texture' || asset.type === 'gif' || asset.type === 'frame' || asset.type === 'sticker' || asset.type === 'decoration') {
      const isFramish = asset.type === 'frame' || (asset.category || '').toLowerCase().includes('frame');
      const isSticker = asset.type === 'sticker' || (asset.category || '').toLowerCase().includes('sticker') || (asset.category || '').toLowerCase().includes('seal');
      const width = isSticker ? 150 : isFramish ? 320 : 300;
      const aspect = asset.dimensions ? asset.dimensions.height / asset.dimensions.width : (isFramish ? 1.4 : 1.0);
      const height = Math.round(width * Math.min(Math.max(aspect, 0.4), 2.5));

      onAddElement('image', {
        name: asset.title,
        content: { src: asset.url, alt: asset.title },
        style: {
          x: isFramish ? 35 : (isSticker ? 120 : 45),
          y: isFramish ? 90 : (isSticker ? 200 : 150),
          width,
          height,
          borderRadius: (isFramish || isSticker || asset.type === 'gif') ? 0 : 16
        }
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
      if (onSetAsMusic) {
        onSetAsMusic(asset.url, asset.title);
      }
    }
  };

  const handleApplyToSelected = (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedElement || !onUpdateElement) return;

    setAddedAssetId(asset.id);
    setTimeout(() => setAddedAssetId(null), 1500);

    if (selectedElement.type === 'image' && (asset.type === 'image' || asset.type === 'pattern' || asset.type === 'frame' || asset.type === 'sticker' || asset.type === 'gif')) {
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

  const handleSetBackgroundClick = (asset: MediaAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSetAsBackground) {
      onSetAsBackground(asset.url, asset.type === 'video' ? 'video' : 'image');
      setAddedAssetId(asset.id);
      setTimeout(() => setAddedAssetId(null), 1500);
    }
  };

  const handleSetMusicClick = (asset: MediaAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSetAsMusic) {
      onSetAsMusic(asset.url, asset.title);
      setAddedAssetId(asset.id);
      setTimeout(() => setAddedAssetId(null), 1500);
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

  const getDisplayBadge = (asset: MediaAsset) => {
    if (asset.type === 'frame' || (asset.category || '').toLowerCase().includes('frame')) return 'FRAME';
    if (asset.type === 'gif' || asset.format === 'gif') return 'GIF';
    if (asset.type === 'video') return 'VIDEO';
    if (asset.type === 'sticker' || (asset.category || '').toLowerCase().includes('seal')) return 'STICKER';
    if (asset.type === 'audio') return 'AUDIO';
    return 'PHOTO';
  };

  return (
    <div className="flex flex-col h-full space-y-3 select-none">
      {/* Scope Selector: Asset Library vs My Uploads vs All */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => { setScope('public'); setSelectedCategory('all'); }}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            scope === 'public'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Asset Library</span>
        </button>

        <button
          type="button"
          onClick={() => { setScope('uploads'); setSelectedCategory('all'); }}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
            scope === 'uploads'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-blue-500" />
          <span>My Uploads</span>
        </button>

        <button
          type="button"
          onClick={() => { setScope('all'); setSelectedCategory('all'); }}
          className={`py-1.5 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
            scope === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All</span>
        </button>
      </div>

      {/* Upload Toggle & Dropzone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload Media Files</span>
            {showUploadZone ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {selectedElement && (
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-medium truncate max-w-[130px]">
              Target: {selectedElement.type}
            </span>
          )}
        </div>

        {showUploadZone && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative p-3.5 rounded-xl border-2 border-dashed transition-all text-center ${
              isDragOver
                ? 'border-slate-900 bg-slate-100 scale-[0.99]'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.mp3,.wav"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {isUploading ? (
              <div className="py-2 flex flex-col items-center justify-center gap-2 text-slate-800">
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                <div className="text-xs font-bold">{uploadProgressText || 'Uploading media...'}</div>
                <div className="text-[10px] text-slate-500">Auto-optimizing resolution and thumbnail</div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="w-8 h-8 mx-auto rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
                  >
                    Click to upload
                  </button>
                  <span className="text-xs text-slate-500"> or drag files here</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Photos, GIFs, Videos (MP4), and Music (MP3)
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Pills (Frames, Photos, GIFs, Videos, Stickers, Audio) */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 text-xs">
        {[
          { id: 'all', label: 'All Assets' },
          { id: 'frames', label: 'Frames & Borders' },
          { id: 'photos', label: 'Stock Photos' },
          { id: 'gif', label: 'Animated GIFs' },
          { id: 'video', label: 'Stock Videos' },
          { id: 'stickers', label: 'Stickers & Seals' },
          { id: 'floral', label: 'Floral & Botanical' },
          { id: 'audio', label: 'Audio & Music' }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Type Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frames, stickers, stock photos, GIFs..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center justify-between gap-1 text-[11px]">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All', icon: null },
              { id: 'image', label: 'Images', icon: ImageIcon },
              { id: 'gif', label: 'GIFs', icon: Sparkles },
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
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Media Grid Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 min-h-[240px]">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            <span className="text-xs">Loading media assets...</span>
          </div>
        ) : sortedList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-slate-700">No assets found in this view</div>
            <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
              {scope === 'uploads'
                ? 'Upload custom photos, videos, or music for this invitation.'
                : 'Try adjusting your search query or switching category filter.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pb-4">
            {sortedList.map((asset) => {
              const isFramish = asset.type === 'frame' || (asset.category || '').toLowerCase().includes('frame');
              const isSticker = asset.type === 'sticker' || (asset.category || '').toLowerCase().includes('sticker') || (asset.category || '').toLowerCase().includes('seal');
              const isAdded = addedAssetId === asset.id;
              const isActiveMusic = asset.type === 'audio' && asset.url === currentMusicUrl;

              return (
                <div
                  key={asset.id}
                  onClick={(e) => handleInsertAsElement(asset, e)}
                  title={isActiveMusic ? "Currently selected music" : "Click to use"}
                  className={`group relative rounded-xl border ${isActiveMusic ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-900'} overflow-hidden transition-all shadow-xs flex flex-col cursor-pointer text-left`}
                >
                  {/* Visual Active Music Overlay */}
                  {isActiveMusic && !isAdded && (
                    <div className="absolute top-1.5 right-1.5 px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[9px] tracking-wider z-20 flex items-center gap-1 shadow-sm">
                      <Music className="w-3 h-3" />
                      <span>SELECTED</span>
                    </div>
                  )}

                  {/* Visual Added Confirmation Toast Overlay */}
                  {isAdded && (
                    <div className="absolute inset-0 bg-emerald-600/90 text-white font-bold flex items-center justify-center gap-1 z-30 animate-in fade-in duration-150">
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Added!</span>
                    </div>
                  )}

                  {/* Thumbnail Container */}
                  <div
                    className={`relative h-28 overflow-hidden flex items-center justify-center ${
                      isFramish || isSticker
                        ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] bg-slate-100/90'
                        : 'bg-slate-100'
                    }`}
                  >
                    {/* Visual Media (Image, Frame, Sticker, GIF) */}
                    {asset.type !== 'video' && asset.type !== 'audio' && (
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.title}
                        className={
                          isFramish || isSticker
                            ? 'max-w-[85%] max-h-[85%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300'
                            : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        }
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Video Asset */}
                    {asset.type === 'video' && (
                      <div className="w-full h-full relative">
                        <img
                          src={asset.thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-900 shadow-sm">
                            <Video className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Audio Asset */}
                    {asset.type === 'audio' && (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-2 text-amber-400">
                        <Music className="w-7 h-7 mb-1" />
                        <span className="text-[10px] text-slate-300 font-mono">
                          {asset.duration ? formatDuration(asset.duration) : 'Audio'}
                        </span>
                      </div>
                    )}

                    {/* Type Badge (No super admin badge) */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white tracking-wider">
                      {getDisplayBadge(asset)}
                    </div>

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1.5 z-10">
                      {/* Primary Insert Button */}
                      <button
                        type="button"
                        title="Add to canvas"
                        onClick={(e) => handleInsertAsElement(asset, e)}
                        className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Apply to Selected Element */}
                      {selectedElement && (
                        <button
                          type="button"
                          title="Apply to Selected Element"
                          onClick={(e) => handleApplyToSelected(asset, e)}
                          className="p-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Set as Background (for images / videos) */}
                      {(asset.type === 'image' || asset.type === 'video' || asset.type === 'pattern') && onSetAsBackground && (
                        <button
                          type="button"
                          title="Set as Page Background"
                          onClick={(e) => handleSetBackgroundClick(asset, e)}
                          className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Set as Music (for audio) */}
                      {asset.type === 'audio' && onSetAsMusic && (
                        <button
                          type="button"
                          title="Set as Invitation Background Music"
                          onClick={(e) => handleSetMusicClick(asset, e)}
                          className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Music className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Preview Button */}
                      <button
                        type="button"
                        title="Preview & Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAsset(asset);
                          setIsPreviewOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button (Only for user uploads) */}
                      {!asset.isSuperAdmin && !asset.isPublic && (
                        <button
                          type="button"
                          title="Delete File"
                          onClick={(e) => handleDelete(asset.id, e)}
                          className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Title & Specs Footer */}
                  <div className="p-2 flex flex-col justify-between flex-1 bg-white">
                    <div className="text-[11px] font-semibold text-slate-900 truncate leading-tight">
                      {asset.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className="capitalize">{asset.category || asset.type}</span>
                      {asset.dimensions && (
                        <span>{asset.dimensions.width}×{asset.dimensions.height}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal */}
      <MediaPreviewModal
        asset={previewAsset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDelete={(id) => handleDelete(id)}
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
