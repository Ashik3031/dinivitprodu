import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MediaAsset, MediaAssetType } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Search,
  Plus,
  Filter,
  Trash2,
  Copy,
  Check,
  Eye,
  Tag,
  FolderOpen,
  Music,
  Maximize2,
  X,
  RefreshCw,
  Layers,
  Crop,
  CheckCircle2,
  FileCheck,
  Film,
  Video,
  Play,
  Pencil
} from 'lucide-react';

const ASSET_TYPE_FILTERS = [
  { id: 'all', label: 'All Assets', icon: Layers },
  { id: 'image', label: 'Photos & Graphics', icon: ImageIcon },
  { id: 'background', label: 'Background Images', icon: ImageIcon },
  { id: 'frame', label: 'Frames & Borders', icon: Crop },
  { id: 'gif', label: 'Animated GIFs', icon: Film },
  { id: 'video', label: 'Stock Videos', icon: Video },
  { id: 'sticker', label: 'Stickers & Wax Seals', icon: Sparkles },
  { id: 'decoration', label: 'Dividers & Flourishes', icon: Tag },
  { id: 'texture', label: 'Textures & Foil', icon: Layers },
  { id: 'audio', label: 'Audio & Music', icon: Music }
];

const STOCK_CATEGORY_SUGGESTIONS = [
  'Photos & Graphics',
  'Vector Graphics',
  'Background Images',
  'Luxury Backgrounds',
  'Frames & Arches',
  'Gold & Foil Borders',
  'Animated GIFs & Sparkles',
  'Stock Videos & Ambient Loops',
  'Celebration & Confetti',
  'Floral & Botanical',
  'Wax Seals & Stamps',
  'Stickers & Wax Seals',
  'Dividers & Flourishes',
  'Art Deco & Geometric',
  'Vintage & Ornate',
  'Audio & Music',
  'Wedding Melodies'
];

export function getDefaultCategoryForType(type: MediaAssetType): string {
  switch (type) {
    case 'frame':
      return 'Frames & Arches';
    case 'background':
      return 'Background Images';
    case 'gif':
      return 'Animated GIFs & Sparkles';
    case 'video':
      return 'Stock Videos & Ambient Loops';
    case 'sticker':
      return 'Stickers & Wax Seals';
    case 'decoration':
      return 'Dividers & Flourishes';
    case 'texture':
      return 'Luxury Backgrounds';
    case 'audio':
      return 'Audio & Music';
    case 'image':
    default:
      return 'Photos & Graphics';
  }
}

export function getDefaultTagsForType(type: MediaAssetType): string {
  switch (type) {
    case 'frame':
      return 'frame, border, luxury';
    case 'background':
      return 'background, wallpaper';
    case 'gif':
      return 'animated, gif, sparkles';
    case 'video':
      return 'video, cinematic, ambient';
    case 'sticker':
      return 'sticker, badge, wax-seal';
    case 'decoration':
      return 'divider, flourish, ornament';
    case 'texture':
      return 'texture, pattern, foil';
    case 'audio':
      return 'music, audio, soundtrack';
    case 'image':
    default:
      return 'photo, graphic';
  }
}

export function stripUrlQueryAndFragment(rawUrl: string): string {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl, 'https://dummy.base');
    return parsed.pathname;
  } catch {
    return rawUrl.split('?')[0].split('#')[0];
  }
}

export function detectAssetMetadata(
  filenameOrUrl: string,
  mimeType?: string
): { type: MediaAssetType; category: string; format: string; tags: string } {
  const cleanPath = stripUrlQueryAndFragment(filenameOrUrl);
  const ext = cleanPath.split('.').pop()?.toLowerCase() || '';
  const mime = (mimeType || '').toLowerCase();

  // Audio: MP3, WAV, OGG, M4A, AAC
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext)) {
    return {
      type: 'audio',
      category: 'Audio & Music',
      format: ext || 'mp3',
      tags: 'music, audio'
    };
  }

  // Video: MP4, WebM, MOV
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(ext)) {
    return {
      type: 'video',
      category: 'Stock Videos & Ambient Loops',
      format: ext || 'mp4',
      tags: 'video, cinematic'
    };
  }

  // Animated GIF
  if (mime === 'image/gif' || ext === 'gif') {
    return {
      type: 'gif',
      category: 'Animated GIFs & Sparkles',
      format: 'gif',
      tags: 'animated, gif'
    };
  }

  // SVG: Vector graphics (do NOT classify as frame!)
  if (mime === 'image/svg+xml' || ext === 'svg') {
    return {
      type: 'image',
      category: 'Vector Graphics',
      format: 'svg',
      tags: 'vector, svg, graphic'
    };
  }

  // Standard Images (PNG, JPG, WebP)
  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'avif'].includes(ext)) {
    return {
      type: 'image',
      category: 'Photos & Graphics',
      format: ext === 'jpeg' ? 'jpg' : (ext || 'png'),
      tags: 'photo, graphic'
    };
  }

  // Fallback neutral
  return {
    type: 'image',
    category: 'Photos & Graphics',
    format: ext || 'jpg',
    tags: 'photo, graphic'
  };
}

const INITIAL_UPLOAD_FORM = {
  title: '',
  type: 'image' as MediaAssetType,
  category: 'Photos & Graphics',
  tags: '',
  url: '',
  isPublic: true,
  width: 800,
  height: 800,
  format: 'png'
};

export const AdminAssetManager: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview Modal
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [uploadForm, setUploadForm] = useState(INITIAL_UPLOAD_FORM);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Flags to preserve user manual customizations
  const [isCategoryManuallyEdited, setIsCategoryManuallyEdited] = useState(false);
  const [isTagsManuallyEdited, setIsTagsManuallyEdited] = useState(false);
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);

  // Edit Asset Modal
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: 'image' as MediaAssetType,
    category: '',
    tags: '',
    isPublic: true
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      // Fetch public media assets (scope=public or all)
      const res = await api.getMedia({ scope: 'all' });
      setAssets(res.media || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load media assets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Type filter
      if (selectedType !== 'all') {
        if (selectedType === 'background') {
          const isBg = asset.type === 'background' || (asset.category || '').toLowerCase().includes('background') || (asset.tags || []).some((t) => t.toLowerCase().includes('background'));
          if (!isBg) return false;
        } else if (asset.type !== selectedType) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = asset.title?.toLowerCase().includes(q);
        const matchName = asset.name?.toLowerCase().includes(q);
        const matchCat = asset.category?.toLowerCase().includes(q);
        const matchType = asset.type?.toLowerCase().includes(q);
        const matchTags = asset.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchName && !matchCat && !matchType && !matchTags) return false;
      }

      return true;
    });
  }, [assets, selectedType, searchQuery]);

  // Clean form modal handlers
  const handleOpenUploadModal = () => {
    setUploadForm(INITIAL_UPLOAD_FORM);
    setFilePreview(null);
    setIsCategoryManuallyEdited(false);
    setIsTagsManuallyEdited(false);
    setIsTitleManuallyEdited(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadForm(INITIAL_UPLOAD_FORM);
    setIsCategoryManuallyEdited(false);
    setIsTagsManuallyEdited(false);
    setIsTitleManuallyEdited(false);
  };

  // Synchronize category and tags when type changes
  const handleTypeChange = (newType: MediaAssetType) => {
    setUploadForm((prev) => ({
      ...prev,
      type: newType,
      category: isCategoryManuallyEdited ? prev.category : getDefaultCategoryForType(newType),
      tags: isTagsManuallyEdited ? prev.tags : getDefaultTagsForType(newType)
    }));
  };

  // Handle File Selection & Auto Dimension Detection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setFilePreview(dataUri);

      const metadata = detectAssetMetadata(file.name, file.type);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      if (metadata.type === 'gif') {
        const img = new Image();
        img.onload = () => {
          setUploadForm((prev) => ({
            ...prev,
            title: isTitleManuallyEdited ? prev.title : cleanTitle,
            url: dataUri,
            format: 'gif',
            width: img.width || 480,
            height: img.height || 270,
            type: 'gif',
            category: isCategoryManuallyEdited ? prev.category : metadata.category,
            tags: isTagsManuallyEdited ? prev.tags : metadata.tags
          }));
        };
        img.src = dataUri;
      } else if (metadata.type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          setUploadForm((prev) => ({
            ...prev,
            title: isTitleManuallyEdited ? prev.title : cleanTitle,
            url: dataUri,
            format: metadata.format,
            width: video.videoWidth || 1920,
            height: video.videoHeight || 1080,
            type: 'video',
            category: isCategoryManuallyEdited ? prev.category : metadata.category,
            tags: isTagsManuallyEdited ? prev.tags : metadata.tags
          }));
        };
        video.src = dataUri;
      } else if (metadata.type === 'audio') {
        setUploadForm((prev) => ({
          ...prev,
          title: isTitleManuallyEdited ? prev.title : cleanTitle,
          url: dataUri,
          format: metadata.format,
          type: 'audio',
          category: isCategoryManuallyEdited ? prev.category : metadata.category,
          tags: isTagsManuallyEdited ? prev.tags : metadata.tags
        }));
      } else {
        // Standard Image or Vector SVG
        const img = new Image();
        img.onload = () => {
          setUploadForm((prev) => ({
            ...prev,
            title: isTitleManuallyEdited ? prev.title : cleanTitle,
            url: dataUri,
            format: metadata.format,
            width: img.width || 800,
            height: img.height || 800,
            type: metadata.type,
            category: isCategoryManuallyEdited ? prev.category : metadata.category,
            tags: isTagsManuallyEdited ? prev.tags : metadata.tags
          }));
        };
        img.onerror = () => {
          setUploadForm((prev) => ({
            ...prev,
            title: isTitleManuallyEdited ? prev.title : cleanTitle,
            url: dataUri,
            format: metadata.format,
            type: metadata.type,
            category: isCategoryManuallyEdited ? prev.category : metadata.category,
            tags: isTagsManuallyEdited ? prev.tags : metadata.tags
          }));
        };
        img.src = dataUri;
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle URL change with clean query and fragment stripping
  const handleUrlChange = (val: string) => {
    const cleanPath = stripUrlQueryAndFragment(val);
    const ext = cleanPath.split('.').pop()?.toLowerCase() || '';

    const KNOWN_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'mp4', 'webm', 'mp3', 'wav', 'ogg'];
    const hasRecognizedExt = KNOWN_EXTS.includes(ext);

    let updatedType = uploadForm.type;
    let updatedCategory = uploadForm.category;
    let updatedFormat = uploadForm.format;
    let updatedTags = uploadForm.tags;
    let updatedTitle = uploadForm.title;

    if (hasRecognizedExt) {
      const meta = detectAssetMetadata(cleanPath);
      updatedType = meta.type;
      updatedFormat = meta.format;
      if (!isCategoryManuallyEdited) {
        updatedCategory = meta.category;
      }
      if (!isTagsManuallyEdited) {
        updatedTags = meta.tags;
      }
      if (!isTitleManuallyEdited) {
        const filename = cleanPath.split('/').pop() || '';
        const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        if (cleanName.trim()) {
          updatedTitle = cleanName;
        }
      }
    }

    setUploadForm((prev) => ({
      ...prev,
      url: val,
      type: updatedType,
      category: updatedCategory,
      format: updatedFormat,
      tags: updatedTags,
      title: updatedTitle
    }));
  };

  // Submit Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = uploadTab === 'file' ? filePreview : uploadForm.url;

    if (!finalUrl) {
      toast.error('Please select a file or enter a valid asset URL');
      return;
    }
    if (!uploadForm.title.trim()) {
      toast.error('Please enter an asset title');
      return;
    }

    try {
      setIsUploading(true);
      const tagsArray = uploadForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.uploadMedia({
        businessId: 'admin',
        title: uploadForm.title.trim(),
        name: uploadForm.title.trim().toLowerCase().replace(/\s+/g, '-'),
        url: finalUrl,
        thumbnailUrl: finalUrl,
        type: uploadForm.type,
        format: uploadForm.format,
        dimensions: {
          width: Number(uploadForm.width) || 800,
          height: Number(uploadForm.height) || 800
        },
        category: uploadForm.category.trim() || getDefaultCategoryForType(uploadForm.type),
        tags: tagsArray,
        isPublic: true,
        isSuperAdmin: true
      });

      setAssets((prev) => [res.media, ...prev]);
      toast.success(`Asset "${uploadForm.title}" uploaded and published to public library!`);

      handleCloseUploadModal();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload asset');
    } finally {
      setIsUploading(false);
    }
  };

  // Copy Asset URL
  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    toast.success('Asset URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Edit Existing Asset
  const handleOpenEditModal = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditForm({
      title: asset.title || '',
      type: asset.type,
      category: asset.category || getDefaultCategoryForType(asset.type),
      tags: Array.isArray(asset.tags) ? asset.tags.join(', ') : '',
      isPublic: Boolean(asset.isPublic)
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    if (!editForm.title.trim()) {
      toast.error('Asset title is required');
      return;
    }

    try {
      setIsSavingEdit(true);
      const tagsArray = editForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.updateMedia(editingAsset.id, {
        title: editForm.title.trim(),
        type: editForm.type,
        category: editForm.category.trim(),
        tags: tagsArray,
        isPublic: editForm.isPublic
      });

      setAssets((prev) =>
        prev.map((a) => (a.id === editingAsset.id ? res.media : a))
      );
      toast.success(`Asset "${editForm.title}" updated successfully!`);
      setEditingAsset(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update asset');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Asset
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteMedia(deleteTarget.id);
      setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast.success(`Asset "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete asset');
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats computation
  const totalAssets = assets.length;
  const backgroundsCount = assets.filter((a) =>
    a.type === 'background' || (a.category || '').toLowerCase().includes('background') || (a.tags || []).some((t) => t.toLowerCase().includes('background'))
  ).length;
  const framesCount = assets.filter((a) => a.type === 'frame').length;
  const imagesCount = assets.filter((a) => a.type === 'image').length;
  const stickersCount = assets.filter((a) => a.type === 'sticker' || a.type === 'decoration').length;
  const audioCount = assets.filter((a) => a.type === 'audio').length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Public Assets & Elements Library
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Upload and manage public stock photos, vectors, decorative frames, stickers, video loops, and background audio for all studio users.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Public Asset
          </button>
        </div>

        {/* KPI Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Total Assets</span>
            <span className="text-2xl font-bold text-white mt-1 block">{totalAssets}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-blue-400 block font-medium flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Photos & Graphics
            </span>
            <span className="text-2xl font-bold text-blue-300 mt-1 block">{imagesCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-amber-400 block font-medium flex items-center gap-1">
              <Crop className="w-3.5 h-3.5" /> Frames & Borders
            </span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{framesCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-emerald-400 block font-medium flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Backgrounds
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">{backgroundsCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-purple-400 block font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Stickers & Seals
            </span>
            <span className="text-2xl font-bold text-purple-300 mt-1 block">{stickersCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-xs text-rose-400 block font-medium flex items-center gap-1">
              <Music className="w-3.5 h-3.5" /> Audio Tracks
            </span>
            <span className="text-2xl font-bold text-rose-300 mt-1 block">{audioCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-4">
        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {ASSET_TYPE_FILTERS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            const count =
              tab.id === 'all'
                ? assets.length
                : assets.filter((a) => a.type === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets, photos, vectors, frames, tags..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredAssets.length}</strong> public assets
            </span>
            <button
              type="button"
              onClick={fetchAssets}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors ml-2"
              title="Refresh Assets"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
          <p className="text-sm">Loading asset library...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No assets found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery || selectedType !== 'all'
              ? 'No assets matched the current search or type filter.'
              : 'Upload your first public stock photo, graphic, frame, or sticker asset for studio users.'}
          </p>
          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => {
            const isAudio = asset.type === 'audio';
            const isVideo = asset.type === 'video';
            const isGif = asset.type === 'gif';
            const isFrame = asset.type === 'frame';
            const isSticker = asset.type === 'sticker' || asset.type === 'decoration';

            return (
              <div
                key={asset.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all flex flex-col group shadow-md shadow-black/20"
              >
                {/* Visual Canvas Box */}
                <div
                  className={`relative aspect-square flex items-center justify-center p-3 overflow-hidden ${isFrame || isSticker
                    ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] bg-slate-950'
                    : 'bg-slate-950'
                    }`}
                >
                  {isAudio ? (
                    <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                        <Music className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 line-clamp-1">
                        {asset.title}
                      </span>
                    </div>
                  ) : isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded">
                      <img
                        src={asset.thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                        alt={asset.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      {asset.duration && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                          {Math.floor(asset.duration)}s
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.title}
                      className={`max-w-full max-h-full transition-transform duration-300 group-hover:scale-105 ${isFrame || isSticker ? 'object-contain' : 'object-cover w-full h-full'
                        }`}
                      loading="lazy"
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm ${isGif
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                      : isVideo
                        ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                        : isAudio
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : isFrame
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : asset.type === 'background'
                              ? 'bg-teal-950/80 text-teal-300 border border-teal-500/30'
                              : 'bg-slate-900/90 text-slate-300 border border-slate-700/60'
                      }`}>
                      {isGif ? 'GIF' : isVideo ? 'VIDEO' : isAudio ? 'AUDIO' : asset.type === 'background' ? 'BACKGROUND' : asset.type}
                    </span>
                  </div>

                  {/* Quick Action Overlay on hover */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewAsset(asset)}
                      className="p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg transition-colors shadow"
                      title="Preview Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(asset)}
                      className="p-2 bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-lg transition-colors shadow"
                      title="Edit Asset Classification"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      className="p-2 bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-white rounded-lg transition-colors shadow"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(asset)}
                      className="p-2 bg-slate-800/90 hover:bg-red-500 hover:text-white text-white rounded-lg transition-colors shadow"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-1 bg-slate-900/90">
                  <h4 className="text-xs font-semibold text-white truncate" title={asset.title}>
                    {asset.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[80px]">{asset.category || 'Public'}</span>
                    <span>
                      {asset.dimensions
                        ? `${asset.dimensions.width}×${asset.dimensions.height}`
                        : asset.format?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200 my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Public Asset</h3>
                  <p className="text-xs text-slate-400">Photos, vectors, frames, stickers, and audio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseUploadModal}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Method Switch */}
            <div className="p-6 pb-0">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadTab('file')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${uploadTab === 'file'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Upload File (PNG / JPG / SVG / MP3)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab('url')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${uploadTab === 'url'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Paste Direct Asset URL
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {/* File Drop Area */}
              {uploadTab === 'file' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,video/mp4,video/webm,audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/60"
                  >
                    {filePreview ? (
                      <div className="flex flex-col items-center">
                        <div className="w-28 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center p-2 mb-2">
                          {uploadForm.type === 'audio' ? (
                            <Music className="w-10 h-10 text-emerald-400" />
                          ) : uploadForm.type === 'video' ? (
                            <video
                              src={filePreview}
                              controls
                              muted
                              playsInline
                              className="max-w-full max-h-full object-contain rounded-lg"
                            />
                          ) : (
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="max-w-full max-h-full object-contain"
                            />
                          )}
                        </div>
                        <span className="text-xs text-amber-400 font-medium">Click to replace file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-slate-200">
                          Click to browse PNG, JPG, WebP, SVG, GIF, MP4, or MP3
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Photos, vectors, animated GIFs, stock videos, and audio supported (Max 15MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Asset Direct URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={uploadForm.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/assets/photo.jpg or .png, .svg, .gif, .mp4, .mp3"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct links with file extensions will be automatically detected. Query parameters are handled safely.
                  </p>
                </div>
              )}

              {/* Title & Asset Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Asset Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => {
                      setIsTitleManuallyEdited(true);
                      setUploadForm({ ...uploadForm, title: e.target.value });
                    }}
                    placeholder="e.g., Luxury Golden Border"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Asset Type *
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e: any) => handleTypeChange(e.target.value as MediaAssetType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="image">Stock Photo / Graphic</option>
                    <option value="background">Background Image</option>
                    <option value="frame">Frame & Border (Cutout)</option>
                    <option value="gif">Animated GIF</option>
                    <option value="video">Stock Video (Cinematic MP4)</option>
                    <option value="sticker">Sticker & Wax Seal</option>
                    <option value="decoration">Divider & Flourish</option>
                    <option value="texture">Texture & Foil Pattern</option>
                    <option value="audio">Music / Audio Track</option>
                  </select>
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    value={uploadForm.category}
                    onChange={(e) => {
                      setIsCategoryManuallyEdited(true);
                      setUploadForm({ ...uploadForm, category: e.target.value });
                    }}
                    placeholder="Photos & Graphics"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <datalist id="category-suggestions">
                    {STOCK_CATEGORY_SUGGESTIONS.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => {
                      setIsTagsManuallyEdited(true);
                      setUploadForm({ ...uploadForm, tags: e.target.value });
                    }}
                    placeholder="photo, graphic, luxury"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Dimensions (for images/frames) */}
              {uploadForm.type !== 'audio' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Canvas Width (px)
                    </label>
                    <input
                      type="number"
                      value={uploadForm.width}
                      onChange={(e) => setUploadForm({ ...uploadForm, width: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Canvas Height (px)
                    </label>
                    <input
                      type="number"
                      value={uploadForm.height}
                      onChange={(e) => setUploadForm({ ...uploadForm, height: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Public Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uploadForm.isPublic}
                    onChange={(e) => setUploadForm({ ...uploadForm, isPublic: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Make this asset public for all studio users in the editor
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseUploadModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? 'Uploading...' : 'Publish Public Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ASSET CLASSIFICATION MODAL */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Asset Classification</h3>
                  <p className="text-xs text-slate-400">Update type, category, title and tags</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Asset Snapshot */}
              <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {editingAsset.type === 'audio' ? (
                    <Music className="w-8 h-8 text-emerald-400" />
                  ) : editingAsset.type === 'video' ? (
                    <Film className="w-8 h-8 text-sky-400" />
                  ) : (
                    <img
                      src={editingAsset.url}
                      alt={editingAsset.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-mono text-amber-400 block truncate">
                    {editingAsset.id}
                  </span>
                  <span className="text-xs text-slate-400 block truncate">
                    Format: {editingAsset.format?.toUpperCase() || 'N/A'} • {editingAsset.isPublic ? 'Public Asset' : 'Private Asset'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Asset Type *
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e: any) => {
                      const newType = e.target.value as MediaAssetType;
                      setEditForm((prev) => ({
                        ...prev,
                        type: newType,
                        category: prev.category || getDefaultCategoryForType(newType)
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="image">Stock Photo / Graphic</option>
                    <option value="background">Background Image</option>
                    <option value="frame">Frame & Border (Cutout)</option>
                    <option value="gif">Animated GIF</option>
                    <option value="video">Stock Video (Cinematic MP4)</option>
                    <option value="sticker">Sticker & Wax Seal</option>
                    <option value="decoration">Divider & Flourish</option>
                    <option value="texture">Texture & Foil Pattern</option>
                    <option value="audio">Music / Audio Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    list="edit-category-suggestions"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <datalist id="edit-category-suggestions">
                    {STOCK_CATEGORY_SUGGESTIONS.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="e.g., photo, graphic, gold"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Public Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isPublic}
                    onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Public Asset (accessible to all studio users in the editor)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ASSET PREVIEW MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white">{previewAsset.title}</h3>
                <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">
                  {previewAsset.type} • {previewAsset.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 flex items-center justify-center bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 min-h-[320px]">
              {previewAsset.type === 'audio' ? (
                <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-6 rounded-2xl text-center">
                  <Music className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <audio controls className="w-full mt-2" src={previewAsset.url}>
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : previewAsset.type === 'video' ? (
                <div className="w-full flex flex-col items-center justify-center">
                  <video
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-w-full max-h-[460px] rounded-xl shadow-2xl border border-slate-800"
                    src={previewAsset.url}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewAsset.url}
                    alt={previewAsset.title}
                    className="max-w-full max-h-[460px] object-contain rounded-lg shadow-2xl"
                  />
                  {previewAsset.type === 'gif' && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-purple-950/90 text-purple-300 border border-purple-500/40">
                      ANIMATED GIF
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {previewAsset.dimensions && (
                  <span>
                    Size: {previewAsset.dimensions.width} × {previewAsset.dimensions.height} px
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewAsset)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" /> Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Public Asset?"
        message={`Are you sure you want to delete asset "${deleteTarget?.title}"? Users will no longer be able to insert it into new invitations.`}
        confirmText="Delete Asset"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
