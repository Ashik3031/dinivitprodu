import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  CheckCheck,
  Filter,
  Sparkles,
  Layers,
  HardDrive,
  Clock,
  Loader2,
  FolderOpen,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowLeft,
  X,
  AlertCircle,
  Tag,
  Palette
} from 'lucide-react';
import { MediaAsset, CanvasElement, ElementType, BackgroundCollection } from '../../types';
import { api } from '../../services/api';
import { uploadMediaAsset } from '../../services/mediaUploadService';
import {
  formatBytes,
  formatDuration
} from '../../utils/mediaOptimizer';
import { MediaPreviewModal } from './MediaPreviewModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface MediaLibraryViewProps {
  currentInvitationId?: string;
  businessId?: string;
  onAddElement: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  selectedElement?: CanvasElement | null;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onSetAsBackground?: (url: string, type: 'image' | 'video') => void;
  onApplyBackgroundToAllPages?: (url: string, type: 'image' | 'video') => void;
  onSetAsMusic?: (audioUrl: string, title: string) => void;
  isModalView?: boolean;
  onSelectMedia?: (asset: MediaAsset) => void;
  initialScope?: 'public' | 'uploads' | 'all';
  initialCategory?: string;
  currentMusicUrl?: string;
  filterType?: 'image-only' | 'video-only' | 'audio-only' | 'all';
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  currentInvitationId,
  businessId = 'usr-biz-royal',
  onAddElement,
  selectedElement,
  onUpdateElement,
  onSetAsBackground,
  onApplyBackgroundToAllPages,
  onSetAsMusic,
  isModalView = false,
  onSelectMedia,
  initialScope = 'public',
  initialCategory = 'all',
  currentMusicUrl,
  filterType = 'all'
}) => {
  // Navigation & Scope
  const [scope, setScope] = useState<'public' | 'uploads' | 'all'>(initialScope);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'gif' | 'audio'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'name'>('newest');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Search state with debouncing
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Media data
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Collections state
  const [collections, setCollections] = useState<BackgroundCollection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [activeCollection, setActiveCollection] = useState<(BackgroundCollection & { backgroundAssets?: MediaAsset[] }) | null>(null);
  const [isLoadingCollectionDetails, setIsLoadingCollectionDetails] = useState(false);
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Applied feedback
  const [addedAssetId, setAddedAssetId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Confirmation dialog for "Apply to All Pages"
  const [confirmAllPagesAsset, setConfirmAllPagesAsset] = useState<MediaAsset | null>(null);
  const [isApplyingAllPages, setIsApplyingAllPages] = useState(false);

  // Preview Modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Collections when viewing Asset Library & Backgrounds/Collections
  const fetchCollections = async () => {
    try {
      setIsLoadingCollections(true);
      const res = await api.getBackgroundCollections({ all: false });
      if (res.success && res.collections) {
        setCollections(res.collections);
      }
    } catch (err) {
      console.error('Failed to load background collections:', err);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  useEffect(() => {
    if (scope !== 'uploads' && (selectedCategory === 'all' || selectedCategory === 'backgrounds' || selectedCategory === 'collections')) {
      fetchCollections();
    }
  }, [scope, selectedCategory]);

  // Fetch Media Assets
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const isCollectionsView = selectedCategory === 'collections';
      const categoryParam = isCollectionsView
        ? 'backgrounds'
        : selectedCategory === 'all'
          ? undefined
          : selectedCategory;

      const res = await api.getMedia({
        businessId: scope === 'public' ? undefined : businessId,
        invitationId: scope === 'uploads' ? currentInvitationId : undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        search: debouncedSearch || undefined,
        scope: scope,
        category: categoryParam
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
  }, [businessId, currentInvitationId, selectedType, scope, selectedCategory, debouncedSearch]);

  // Load specific collection details when selected
  const handleSelectCollection = async (collection: BackgroundCollection) => {
    try {
      setIsLoadingCollectionDetails(true);
      setActiveCollection(collection);
      const res = await api.getBackgroundCollectionById(collection.id);
      if (res.success && res.collection) {
        setActiveCollection(res.collection);
      }
    } catch (err) {
      console.error('Failed to load collection details:', err);
    } finally {
      setIsLoadingCollectionDetails(false);
    }
  };

  // Handle Multi-file Upload using Direct Cloudinary Upload Service
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadPercentage(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(`Uploading ${i + 1}/${files.length}: ${file.name}`);

        await uploadMediaAsset(file, {
          businessId,
          invitationId: currentInvitationId,
          invitationIds: currentInvitationId ? [currentInvitationId] : [],
          isPublic: false,
          onProgress: (p) => {
            setUploadPercentage(p.percentage);
            setUploadProgressText(`Uploading ${i + 1}/${files.length}: ${file.name} (${p.percentage}%)`);
          }
        });
      }

      // Switch to My Uploads tab so user immediately sees their uploaded files
      setScope('uploads');
      setActiveCollection(null);
      await fetchMedia();
      showFeedback('Files uploaded successfully!');
    } catch (err: any) {
      console.error('Failed to process/upload media:', err);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      setUploadPercentage(0);
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
      showFeedback('Asset deleted');
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  // Insert as regular canvas element
  const handleInsertAsElement = (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setAddedAssetId(asset.id);
    setTimeout(() => setAddedAssetId(null), 1500);

    if (onSelectMedia) {
      onSelectMedia(asset);
      return;
    }

    if (asset.type === 'image' || asset.type === 'pattern' || asset.type === 'texture' || asset.type === 'gif' || asset.type === 'frame' || asset.type === 'sticker' || asset.type === 'decoration' || asset.type === 'background') {
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
      showFeedback(`Added "${asset.title}" to canvas`);
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
      showFeedback(`Added video to canvas`);
    } else if (asset.type === 'audio') {
      if (onSetAsMusic) {
        onSetAsMusic(asset.url, asset.title);
        showFeedback(`Set background music: ${asset.title}`);
      }
    }
  };

  // Set Background on Active Page
  const handleSetBackgroundClick = (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSetAsBackground) {
      onSetAsBackground(asset.url, asset.type === 'video' ? 'video' : 'image');
      setAddedAssetId(asset.id);
      setTimeout(() => setAddedAssetId(null), 1500);
      showFeedback('Applied to this page!');
    }
  };

  // Open Confirmation for "Apply to All Pages"
  const handleOpenApplyAllPagesConfirm = (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setConfirmAllPagesAsset(asset);
  };

  // Execute Apply to All Pages
  const handleConfirmApplyAllPages = () => {
    if (!confirmAllPagesAsset || !onApplyBackgroundToAllPages) return;
    setIsApplyingAllPages(true);

    try {
      onApplyBackgroundToAllPages(
        confirmAllPagesAsset.url,
        confirmAllPagesAsset.type === 'video' ? 'video' : 'image'
      );
      setAddedAssetId(confirmAllPagesAsset.id);
      setTimeout(() => setAddedAssetId(null), 1500);
      showFeedback('Applied background to all pages!');
    } catch (err) {
      console.error('Failed to apply background to all pages:', err);
    } finally {
      setIsApplyingAllPages(false);
      setConfirmAllPagesAsset(null);
    }
  };

  // Set Background Music
  const handleSetMusicClick = (asset: MediaAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSetAsMusic) {
      onSetAsMusic(asset.url, asset.title);
      setAddedAssetId(asset.id);
      setTimeout(() => setAddedAssetId(null), 1500);
      showFeedback(`Music set to "${asset.title}"`);
    }
  };

  // Apply to Selected Element
  const handleApplyToSelected = (asset: MediaAsset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedElement || !onUpdateElement) return;

    setAddedAssetId(asset.id);
    setTimeout(() => setAddedAssetId(null), 1500);

    if (selectedElement.type === 'image' && (asset.type === 'image' || asset.type === 'pattern' || asset.type === 'frame' || asset.type === 'sticker' || asset.type === 'gif')) {
      onUpdateElement(selectedElement.id, {
        content: { ...selectedElement.content, src: asset.url }
      });
      showFeedback('Element image updated');
    } else if (selectedElement.type === 'video' && asset.type === 'video') {
      onUpdateElement(selectedElement.id, {
        content: { ...selectedElement.content, videoUrl: asset.url, videoPoster: asset.thumbnailUrl }
      });
      showFeedback('Element video updated');
    } else if (selectedElement.type === 'audio' && asset.type === 'audio') {
      onUpdateElement(selectedElement.id, {
        content: { ...selectedElement.content, audioUrl: asset.url, audioTitle: asset.title }
      });
      showFeedback('Element audio updated');
    }
  };

  // Filtered & Sorted Media items
  const sortedList = useMemo(() => {
    return [...mediaList]
      .filter((asset) => {
        if (filterType === 'image-only') {
          return asset.type !== 'audio' && asset.type !== 'video';
        }
        if (filterType === 'video-only') {
          return asset.type === 'video';
        }
        if (filterType === 'audio-only') {
          return asset.type === 'audio';
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [mediaList, filterType, sortBy]);

  // Categories definition
  const categories = [
    { id: 'all', label: 'All Assets', icon: Sparkles },
    { id: 'backgrounds', label: 'Backgrounds', icon: Layers },
    { id: 'collections', label: 'Collections', icon: FolderOpen },
    { id: 'frames', label: 'Frames & Borders', icon: Palette },
    { id: 'photos', label: 'Photos & Graphics', icon: ImageIcon },
    { id: 'stickers', label: 'Stickers & Seals', icon: Tag },
    { id: 'gif', label: 'Animated GIFs', icon: Sparkles },
    { id: 'video', label: 'Stock Videos', icon: Video },
    { id: 'audio', label: 'Audio & Music', icon: Music }
  ].filter((cat) => {
    if (filterType === 'image-only') return cat.id !== 'video' && cat.id !== 'audio';
    if (filterType === 'video-only') return cat.id === 'all' || cat.id === 'video';
    if (filterType === 'audio-only') return cat.id === 'all' || cat.id === 'audio';
    return true;
  });

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];

  const getDisplayBadge = (asset: MediaAsset) => {
    if (asset.type === 'frame' || (asset.category || '').toLowerCase().includes('frame')) return 'FRAME';
    if (asset.type === 'gif' || asset.format === 'gif') return 'GIF';
    if (asset.type === 'video') return 'VIDEO';
    if (asset.type === 'sticker' || (asset.category || '').toLowerCase().includes('sticker') || (asset.category || '').toLowerCase().includes('seal')) return 'STICKER';
    if (asset.type === 'audio') return 'AUDIO';
    if ((asset.category || '').toLowerCase().includes('background') || asset.type === 'pattern' || asset.type === 'texture' || asset.type === 'background') return 'BG IMAGE';
    return 'PHOTO';
  };

  // Assets inside the current drill-down collection
  const collectionAssets = useMemo(() => {
    if (!activeCollection) return [];
    let list: MediaAsset[] = activeCollection.backgroundAssets || [];

    // Fallback: match from mediaList if backgroundAssets was not populated
    if (list.length === 0 && activeCollection.backgroundAssetIds && activeCollection.backgroundAssetIds.length > 0) {
      const idSet = new Set(activeCollection.backgroundAssetIds);
      list = mediaList.filter((m) => idSet.has(m.id));
    }

    if (collectionSearchQuery.trim()) {
      const q = collectionSearchQuery.trim().toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || (m.tags || []).some(t => t.toLowerCase().includes(q)));
    }

    return list;
  }, [activeCollection, mediaList, collectionSearchQuery]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDrop={handleDrop}
      className="relative flex flex-col h-full space-y-3 select-none text-slate-800"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.mp3,.wav"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-40 bg-slate-900/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white border-2 border-dashed border-indigo-400 p-6 text-center animate-in fade-in duration-150">
          <Upload className="w-10 h-10 mb-2 text-indigo-400 animate-bounce" />
          <p className="text-sm font-bold">Drop files to upload</p>
          <p className="text-xs text-slate-300 mt-1">Images, GIFs, Videos, or Audio will be saved to My Uploads</p>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* SECTION 1: MAIN NAVIGATION TABS (Canva-inspired Segmented Control) */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/80 shrink-0">
        <button
          type="button"
          onClick={() => {
            setScope('public');
            setActiveCollection(null);
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${scope === 'public'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Asset Library</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setScope('uploads');
            setActiveCollection(null);
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${scope === 'uploads'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Upload className="w-3.5 h-3.5 text-indigo-500" />
          <span>My Uploads</span>
        </button>
      </div>

      {/* SECTION 2: PROMINENT UPLOAD CTA BUTTON */}
      <div className="shrink-0 space-y-1.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-4 h-4 text-indigo-300" />
          <span>+ Upload Media</span>
        </button>

        {/* Upload Progress Bar (when active) */}
        {isUploading && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="truncate pr-2">{uploadProgressText || 'Uploading...'}</span>
              <span className="text-indigo-600 font-mono">{uploadPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-200 rounded-full"
                style={{ width: `${uploadPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: SEARCH BAR WITH CLEAR BUTTON */}
      <div className="shrink-0 relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search backgrounds, frames, stickers, photos..."
          className="w-full pl-8.5 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SECTION 4: CATEGORY SELECTOR (Structured - NO horizontal scrollbars!) */}
      {!activeCollection && (
        <div className="shrink-0 space-y-1.5">
          {/* Active Category Display Bar with Chevron to Expand Grid */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex-1 flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <activeCategoryObj.icon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{activeCategoryObj.label}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({sortedList.length})
                </span>
              </div>
              {isCategoryMenuOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-[11px] bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              title="Sort assets"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
          </div>

          {/* Expandable Category Drawer / Clean 2-column or 3-column Grid (No scrollbar) */}
          {isCategoryMenuOpen && (
            <div className="p-2 bg-slate-50/90 border border-slate-200 rounded-xl grid grid-cols-2 gap-1.5 animate-in fade-in duration-150">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsCategoryMenuOpen(false);
                      setActiveCollection(null);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${isSelected
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Wrapping Category Chips (Compact, No Overflow) */}
          {!isCategoryMenuOpen && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {categories.slice(0, 5).map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveCollection(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
              {categories.length > 5 && (
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(true)}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                >
                  +{categories.length - 5} More
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: DRILL-DOWN COLLECTION VIEW HEADER */}
      {activeCollection && (
        <div className="shrink-0 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveCollection(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Collections</span>
            </button>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {collectionAssets.length} backgrounds
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900">{activeCollection.name}</h4>
            {activeCollection.description && (
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{activeCollection.description}</p>
            )}
          </div>

          {/* Collection Filter Input */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={collectionSearchQuery}
              onChange={(e) => setCollectionSearchQuery(e.target.value)}
              placeholder="Search in this collection..."
              className="w-full pl-7 pr-3 py-1 text-[11px] bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>
      )}

      {/* SECTION 6: CONTENT GRID */}
      <div className="flex-1 overflow-y-auto pr-0.5 min-h-[220px]">
        {/* If Active Collection is selected: Render Collection's Backgrounds */}
        {activeCollection ? (
          isLoadingCollectionDetails ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              <span className="text-xs">Loading collection backgrounds...</span>
            </div>
          ) : collectionAssets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-xs font-semibold text-slate-700">No backgrounds in this collection</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Admin can add backgrounds to this collection in the Admin Asset Manager.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 pb-4">
              {collectionAssets.map((asset) => renderAssetCard(asset, true))}
            </div>
          )
        ) : (
          /* Normal Media View */
          <>
            {/* FEATURED COLLECTIONS SECTION (When in Asset Library and on Backgrounds/Collections/All) */}
            {scope !== 'uploads' &&
              (selectedCategory === 'collections' || (selectedCategory === 'backgrounds' && !debouncedSearch)) &&
              collections.length > 0 && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Curated Collections ({collections.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {collections.map((col) => (
                      <div
                        key={col.id}
                        onClick={() => handleSelectCollection(col)}
                        className="group relative rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-slate-800 hover:shadow-md transition-all cursor-pointer text-left flex flex-col"
                      >
                        <div className="relative h-24 overflow-hidden bg-slate-100">
                          <img
                            src={col.coverAssetUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'}
                            alt={col.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-1.5 left-2 right-2">
                            <p className="text-xs font-bold text-white drop-shadow-sm truncate">{col.name}</p>
                            <p className="text-[10px] text-slate-200 font-medium">
                              {col.backgroundAssetIds?.length || 0} backgrounds
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedCategory === 'collections' && <div className="border-b border-slate-200 my-2" />}
                </div>
              )}

            {/* When viewing 'collections' category specifically, do not render ordinary assets below */}
            {selectedCategory === 'collections' ? (
              collections.length === 0 && !isLoadingCollections ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-700">No background collections found</p>
                </div>
              ) : null
            ) : isLoading ? (
              /* Skeleton Loading State */
              <div className="grid grid-cols-2 gap-2.5 pb-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl bg-slate-100 border border-slate-200 animate-pulse flex flex-col justify-end p-2 space-y-1.5"
                  >
                    <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedList.length === 0 ? (
              /* Empty State */
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-700">No assets found</div>
                <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  {debouncedSearch
                    ? `No assets match "${debouncedSearch}". Try a different keyword.`
                    : scope === 'uploads'
                      ? 'Upload custom photos, videos, or music for this invitation.'
                      : 'Try switching to another category.'}
                </div>
              </div>
            ) : (
              /* Asset Cards Grid */
              <div className="grid grid-cols-2 gap-2.5 pb-4">
                {sortedList.map((asset) => renderAssetCard(asset, false))}
              </div>
            )}
          </>
        )}
      </div>

      {/* SECTION 7: CONFIRMATION DIALOG FOR "APPLY TO ALL PAGES" */}
      <ConfirmDialog
        isOpen={Boolean(confirmAllPagesAsset)}
        title="Apply Background to All Pages?"
        message={
          <div className="space-y-3">
            {confirmAllPagesAsset && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <img
                  src={confirmAllPagesAsset.thumbnailUrl || confirmAllPagesAsset.url}
                  alt={confirmAllPagesAsset.title}
                  className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {confirmAllPagesAsset.title}
                  </p>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {confirmAllPagesAsset.category || 'Page Background'}
                  </p>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will set this background across <strong>every page</strong> in your invitation.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All existing elements, text, photos, and layouts on each page will remain completely intact.
            </p>
          </div>
        }
        confirmText="Apply to All Pages"
        cancelText="Cancel"
        variant="primary"
        isLoading={isApplyingAllPages}
        onConfirm={handleConfirmApplyAllPages}
        onCancel={() => setConfirmAllPagesAsset(null)}
      />

      {/* SECTION 8: LIGHTBOX / PREVIEW MODAL */}
      <MediaPreviewModal
        asset={previewAsset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDelete={(id) => handleDelete(id)}
        onInsertAsElement={onAddElement}
        onApplyToSelected={handleApplyToSelected}
        onSetAsBackground={onSetAsBackground}
        onApplyBackgroundToAllPages={onApplyBackgroundToAllPages}
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

  // Helper to render Canva-style Asset Card
  function renderAssetCard(asset: MediaAsset, isInsideCollection: boolean) {
    const isFramish = asset.type === 'frame' || (asset.category || '').toLowerCase().includes('frame');
    const isSticker = asset.type === 'sticker' || (asset.category || '').toLowerCase().includes('sticker') || (asset.category || '').toLowerCase().includes('seal');
    const isAdded = addedAssetId === asset.id;
    const isActiveMusic = asset.type === 'audio' && asset.url === currentMusicUrl;

    const isBackground =
      isInsideCollection ||
      selectedCategory === 'backgrounds' ||
      asset.type === 'background' ||
      (asset.category || '').toLowerCase().includes('background');

    const handleCardClick = (e: React.MouseEvent) => {
      if (onSelectMedia) {
        e.stopPropagation();
        onSelectMedia(asset);
      } else if (isBackground && onSetAsBackground) {
        handleSetBackgroundClick(asset, e);
      } else {
        handleInsertAsElement(asset, e);
      }
    };

    return (
      <div
        key={asset.id}
        onClick={handleCardClick}
        title={
          onSelectMedia
            ? `Click to select "${asset.title}"`
            : isBackground
              ? `Click to set "${asset.title}" as page background`
              : isActiveMusic
                ? 'Currently selected music'
                : `Click to add "${asset.title}" to canvas`
        }
        className={`group relative rounded-xl border ${isActiveMusic
            ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50'
            : 'border-slate-200 bg-white hover:border-slate-900 hover:shadow-md'
          } overflow-hidden transition-all duration-200 flex flex-col cursor-pointer text-left`}
      >
        {/* Visual Active Music Overlay */}
        {isActiveMusic && !isAdded && (
          <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] tracking-wider z-20 flex items-center gap-1 shadow-xs">
            <Music className="w-3 h-3" />
            <span>PLAYING</span>
          </div>
        )}

        {/* Visual Added Confirmation Toast Overlay */}
        {isAdded && (
          <div className="absolute inset-0 bg-emerald-600/90 text-white font-bold flex flex-col items-center justify-center gap-1 z-30 animate-in fade-in duration-150">
            <Check className="w-5 h-5 stroke-[3]" />
            <span className="text-xs">Applied!</span>
          </div>
        )}

        {/* Thumbnail Container */}
        <div
          className={`relative h-28 overflow-hidden flex items-center justify-center ${isFramish || isSticker
              ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] bg-slate-100/90'
              : 'bg-slate-100'
            }`}
        >
          {/* Visual Media (Image, Frame, Sticker, GIF, Background) */}
          {asset.type !== 'video' && asset.type !== 'audio' && (
            <img
              src={asset.thumbnailUrl || asset.url}
              alt={asset.title}
              loading="lazy"
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
                loading="lazy"
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

          {/* Type Badge */}
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white tracking-wider">
            {getDisplayBadge(asset)}
          </div>

          {/* Canva-style Hover Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-10">
            {onSelectMedia ? (
              /* Modal Asset Picker Mode */
              <button
                type="button"
                title="Select Asset"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMedia(asset);
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Select</span>
              </button>
            ) : isBackground ? (
              /* Background Asset Quick Actions: "This Page", "All Pages", "+ Add", "Preview" */
              <div className="w-full flex flex-col gap-1.5">
                <div className="flex gap-1 w-full">
                  {onSetAsBackground && (
                    <button
                      type="button"
                      title="Apply to Current Page"
                      onClick={(e) => handleSetBackgroundClick(asset, e)}
                      className="flex-1 py-1 px-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-[10px] shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Layers className="w-3 h-3" />
                      <span>This Page</span>
                    </button>
                  )}

                  {onApplyBackgroundToAllPages && (
                    <button
                      type="button"
                      title="Apply to All Pages"
                      onClick={(e) => handleOpenApplyAllPagesConfirm(asset, e)}
                      className="flex-1 py-1 px-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-[10px] shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3 text-indigo-600" />
                      <span>All Pages</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    title="Add to Canvas as element"
                    onClick={(e) => handleInsertAsElement(asset, e)}
                    className="p-1 rounded-md bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Preview & Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewAsset(asset);
                      setIsPreviewOpen(true);
                    }}
                    className="p-1 rounded-md bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {!asset.isSuperAdmin && !asset.isPublic && (
                    <button
                      type="button"
                      title="Delete File"
                      onClick={(e) => handleDelete(asset.id, e)}
                      className="p-1 rounded-md bg-rose-600/90 text-white hover:bg-rose-600 text-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Graphic / Photo / Sticker / GIF Actions */
              <div className="flex flex-col gap-1.5 w-full">
                <button
                  type="button"
                  title="Add to Canvas"
                  onClick={(e) => handleInsertAsElement(asset, e)}
                  className="w-full py-1 px-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Canvas</span>
                </button>

                <div className="flex items-center justify-center gap-1.5">
                  {(asset.type === 'image' || asset.type === 'video' || asset.type === 'pattern') && onSetAsBackground && (
                    <button
                      type="button"
                      title="Set as Background"
                      onClick={(e) => handleSetBackgroundClick(asset, e)}
                      className="p-1 rounded-md bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {selectedElement && !onSelectMedia && (
                    <button
                      type="button"
                      title="Replace in Selected Element"
                      onClick={(e) => handleApplyToSelected(asset, e)}
                      className="p-1 rounded-md bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {asset.type === 'audio' && onSetAsMusic && (
                    <button
                      type="button"
                      title="Set as Music"
                      onClick={(e) => handleSetMusicClick(asset, e)}
                      className="p-1 rounded-md bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Music className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    title="Preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewAsset(asset);
                      setIsPreviewOpen(true);
                    }}
                    className="p-1 rounded-md bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {!asset.isSuperAdmin && !asset.isPublic && (
                    <button
                      type="button"
                      title="Delete File"
                      onClick={(e) => handleDelete(asset.id, e)}
                      className="p-1 rounded-md bg-rose-600/90 text-white hover:bg-rose-600 text-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Title & Specs Footer */}
        <div className="p-2 flex flex-col justify-between flex-1 bg-white">
          <div className="text-[11px] font-semibold text-slate-900 truncate leading-tight">
            {asset.title}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span className="capitalize truncate max-w-[80px]">{asset.category || asset.type}</span>
            {asset.dimensions && (
              <span className="shrink-0">{asset.dimensions.width}×{asset.dimensions.height}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
};
