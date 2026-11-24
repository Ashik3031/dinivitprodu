import React, { useState, useEffect, useMemo } from 'react';
import { BackgroundCollection, MediaAsset } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { getAssetThumbnailUrl } from '../../utils/cloudinaryUtils';
import {
  FolderOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Globe,
  Lock,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

interface AdminBackgroundCollectionsManagerProps {
  availableBackgroundAssets: MediaAsset[];
}

export const AdminBackgroundCollectionsManager: React.FC<AdminBackgroundCollectionsManagerProps> = ({
  availableBackgroundAssets
}) => {
  const toast = useToast();

  const [collections, setCollections] = useState<BackgroundCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit / Create Collection Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<BackgroundCollection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    coverAssetUrl: '',
    coverAssetId: '',
    displayOrder: 1,
    isPublished: true
  });
  const [isSaving, setIsSaving] = useState(false);

  // Manage Assets / Reorder Modal
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<BackgroundCollection | null>(null);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isSavingAssets, setIsSavingAssets] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState<BackgroundCollection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const res = await api.getBackgroundCollections({ all: true });
      setCollections(res.collections || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load background collections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Filter collections by search query
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const q = searchQuery.toLowerCase().trim();
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [collections, searchQuery]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      coverAssetUrl: '',
      coverAssetId: '',
      displayOrder: collections.length + 1,
      isPublished: true
    });
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (col: BackgroundCollection) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || '',
      coverAssetUrl: col.coverAssetUrl || '',
      coverAssetId: col.coverAssetId || '',
      displayOrder: col.displayOrder ?? 1,
      isPublished: col.isPublished
    });
    setIsEditorOpen(true);
  };

  // Save Collection Details
  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    try {
      setIsSaving(true);
      if (editingCollection) {
        const res = await api.updateBackgroundCollection(editingCollection.id, {
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
          description: formData.description.trim(),
          coverAssetUrl: formData.coverAssetUrl.trim() || undefined,
          coverAssetId: formData.coverAssetId || undefined,
          displayOrder: Number(formData.displayOrder) || 1,
          isPublished: formData.isPublished,
          backgroundAssetIds: editingCollection.backgroundAssetIds || []
        });
        setCollections((prev) =>
          prev.map((c) =>
            c.id === editingCollection.id
              ? {
                  ...c,
                  ...res.collection,
                  backgroundAssetIds: editingCollection.backgroundAssetIds || res.collection.backgroundAssetIds || [],
                  assetsCount: (editingCollection.backgroundAssetIds || res.collection.backgroundAssetIds || []).length
                }
              : c
          )
        );
        toast.success(`Collection "${res.collection.name}" updated!`);
      } else {
        const res = await api.createBackgroundCollection({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
          description: formData.description.trim(),
          coverAssetUrl: formData.coverAssetUrl.trim() || undefined,
          coverAssetId: formData.coverAssetId || undefined,
          displayOrder: Number(formData.displayOrder) || collections.length + 1,
          isPublished: formData.isPublished,
          backgroundAssetIds: []
        });
        setCollections((prev) => [...prev, res.collection]);
        toast.success(`Collection "${res.collection.name}" created!`);
      }
      setIsEditorOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save collection');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle publish state
  const handleTogglePublish = async (col: BackgroundCollection) => {
    try {
      const updatedStatus = !col.isPublished;
      const res = await api.updateBackgroundCollection(col.id, {
        isPublished: updatedStatus,
        backgroundAssetIds: col.backgroundAssetIds || []
      });
      setCollections((prev) =>
        prev.map((c) =>
          c.id === col.id
            ? {
                ...c,
                ...res.collection,
                isPublished: updatedStatus,
                backgroundAssetIds: col.backgroundAssetIds || res.collection.backgroundAssetIds || [],
                assetsCount: (col.backgroundAssetIds || res.collection.backgroundAssetIds || []).length
              }
            : c
        )
      );
      toast.success(
        `Collection "${col.name}" is now ${updatedStatus ? 'published for users' : 'hidden as draft'}.`
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update publish state');
    }
  };

  // Delete Collection
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteBackgroundCollection(deleteTarget.id);
      setCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success(`Collection "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete collection');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Asset Picker / Reorder
  const handleOpenAssetPicker = (col: BackgroundCollection) => {
    setActiveCollection(col);
    setSelectedAssetIds([...(col.backgroundAssetIds || [])]);
    setAssetSearchQuery('');
    setIsAssetPickerOpen(true);
  };

  // Toggle asset in collection
  const handleToggleAsset = (assetId: string) => {
    if (selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds((prev) => prev.filter((id) => id !== assetId));
    } else {
      setSelectedAssetIds((prev) => [...prev, assetId]);
    }
  };

  // Move asset up in order
  const handleMoveAssetUp = (index: number) => {
    if (index <= 0) return;
    setSelectedAssetIds((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move asset down in order
  const handleMoveAssetDown = (index: number) => {
    if (index >= selectedAssetIds.length - 1) return;
    setSelectedAssetIds((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Save selected assets & order
  const handleSaveAssets = async () => {
    if (!activeCollection) return;
    try {
      setIsSavingAssets(true);
      // Determine cover image if none set
      let coverAssetUrl = activeCollection.coverAssetUrl;
      let coverAssetId = activeCollection.coverAssetId;
      if (!coverAssetUrl && selectedAssetIds.length > 0) {
        const first = availableBackgroundAssets.find((a) => a.id === selectedAssetIds[0]);
        if (first) {
          coverAssetUrl = first.url;
          coverAssetId = first.id;
        }
      }

      const res = await api.updateBackgroundCollection(activeCollection.id, {
        backgroundAssetIds: selectedAssetIds,
        coverAssetUrl,
        coverAssetId,
        isPublished: activeCollection.isPublished
      });

      setCollections((prev) =>
        prev.map((c) =>
          c.id === activeCollection.id
            ? {
                ...c,
                ...res.collection,
                backgroundAssetIds: selectedAssetIds,
                coverAssetUrl,
                coverAssetId,
                isPublished: activeCollection.isPublished,
                assetsCount: selectedAssetIds.length
              }
            : c
        )
      );

      toast.success(`Assigned ${selectedAssetIds.length} backgrounds to "${activeCollection.name}".`);
      setIsAssetPickerOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update collection backgrounds');
    } finally {
      setIsSavingAssets(false);
    }
  };

  // Filter available background assets for picker
  const filteredAvailableAssets = useMemo(() => {
    if (!assetSearchQuery.trim()) return availableBackgroundAssets;
    const q = assetSearchQuery.toLowerCase().trim();
    return availableBackgroundAssets.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
        (a.category && a.category.toLowerCase().includes(q))
    );
  }, [availableBackgroundAssets, assetSearchQuery]);

  // Map selected IDs to asset objects for the ordered list
  const selectedAssetObjects = useMemo(() => {
    const map = new Map(availableBackgroundAssets.map((a) => [a.id, a]));
    return selectedAssetIds
      .map((id) => map.get(id))
      .filter((a): a is MediaAsset => Boolean(a));
  }, [selectedAssetIds, availableBackgroundAssets]);

  const totalPublished = collections.filter((c) => c.isPublished).length;
  const totalAssignedBackgrounds = collections.reduce(
    (acc, c) => acc + (c.backgroundAssetIds?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FolderOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Background Collections Manager
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Organize multiple background images into themed, curated collections (e.g. Royal Wedding, Floral Elegance, Pastel Romance) for easy user browsing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Collection
          </button>
        </div>

        {/* KPI Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Total Collections</span>
            <span className="text-2xl font-bold text-white mt-1 block">{collections.length}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-emerald-400 block font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Published (Live)
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">{totalPublished}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-amber-400 block font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Drafts (Hidden)
            </span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">
              {collections.length - totalPublished}
            </span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
            <span className="text-xs text-sky-400 block font-medium flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Assigned Backgrounds
            </span>
            <span className="text-2xl font-bold text-sky-300 mt-1 block">{totalAssignedBackgrounds}</span>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections by name or description..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
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

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredCollections.length}</strong> collections</span>
        </div>
      </div>

      {/* Collections Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-sm">Loading background collections...</span>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Background Collections Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {searchQuery
              ? `No collections match "${searchQuery}". Clear search to view all.`
              : 'Create your first background collection to organize invitation backdrops into themes.'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> Create First Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCollections.map((col) => {
            const count = col.backgroundAssetIds?.length || 0;
            const coverImage = col.coverAssetUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={col.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all flex flex-col group shadow-lg shadow-black/20"
              >
                {/* Collection Cover Image */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={getAssetThumbnailUrl(coverImage, 400)}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 ${
                        col.isPublished
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {col.isPublished ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                      {col.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Order Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                      Order: #{col.displayOrder}
                    </span>
                  </div>

                  {/* Background Count Pill */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md flex items-center gap-1.5 shadow">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {count} {count === 1 ? 'Background' : 'Backgrounds'}
                    </span>
                  </div>
                </div>

                {/* Info & Description */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {col.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 block truncate mt-0.5">
                      /{col.slug}
                    </span>
                    {col.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {col.description}
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAssetPicker(col)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Manage Backgrounds & Order"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>Manage ({count})</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(col)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          col.isPublished
                            ? 'text-emerald-400 hover:bg-emerald-950/50'
                            : 'text-amber-400 hover:bg-amber-950/50'
                        }`}
                        title={col.isPublished ? 'Unpublish (hide from users)' : 'Publish (make visible)'}
                      >
                        {col.isPublished ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(col)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(col)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT / CREATE COLLECTION MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingCollection ? 'Edit Background Collection' : 'Create New Collection'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure collection name, slug and status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding, Floral Elegance, Pastel Romance"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: editingCollection ? prev.slug : autoSlug
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. royal-wedding"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of the theme, mood and aesthetic of these backgrounds..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Image URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://... (defaults to first assigned background)"
                  value={formData.coverAssetUrl}
                  onChange={(e) => setFormData({ ...formData, coverAssetUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Published Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-700 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Publish immediately (visible to all users in the invitation editor)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : editingCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE BACKGROUND ASSETS & REORDER MODAL */}
      {isAssetPickerOpen && activeCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[88vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Manage Backgrounds: {activeCollection.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select existing background assets to include and set their display order
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssetPickerOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Screen Body */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Left Column: Available Backgrounds Picker (7 cols) */}
              <div className="md:col-span-7 flex flex-col h-full overflow-hidden p-4">
                <div className="mb-3 flex items-center justify-between gap-2 shrink-0">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      placeholder="Search available backgrounds..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {filteredAvailableAssets.length} available
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredAvailableAssets.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No background images match your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {filteredAvailableAssets.map((asset) => {
                        const isSelected = selectedAssetIds.includes(asset.id);
                        return (
                          <div
                            key={asset.id}
                            onClick={() => handleToggleAsset(asset.id)}
                            className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all aspect-square flex flex-col ${
                              isSelected
                                ? 'border-purple-500 ring-2 ring-purple-500/50 bg-purple-950/20'
                                : 'border-slate-800 bg-slate-950 hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={getAssetThumbnailUrl(asset.thumbnailUrl || asset.url, 280)}
                              alt={asset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2">
                              <div className="flex justify-end">
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isSelected
                                      ? 'bg-purple-500 text-white shadow-md'
                                      : 'bg-black/60 text-slate-300 border border-white/20'
                                  }`}
                                >
                                  {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : '+'}
                                </span>
                              </div>
                              <span className="text-[10px] font-medium text-white truncate drop-shadow-sm">
                                {asset.title}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Selected & Ordered Backgrounds (5 cols) */}
              <div className="md:col-span-5 flex flex-col h-full overflow-hidden p-4 bg-slate-950/40">
                <div className="mb-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Collection Order</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                      {selectedAssetIds.length} items
                    </span>
                  </div>
                  {selectedAssetIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedAssetIds([])}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {selectedAssetObjects.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 text-xs px-4">
                      <FolderOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="font-semibold text-slate-400">No backgrounds selected</p>
                      <p className="text-[11px] mt-1 text-slate-500">
                        Click on backgrounds from the left to include them in this collection.
                      </p>
                    </div>
                  ) : (
                    selectedAssetObjects.map((asset, index) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 group transition-all"
                      >
                        <span className="w-5 text-center text-xs font-mono font-bold text-slate-500 shrink-0">
                          #{index + 1}
                        </span>

                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                          <img
                            src={getAssetThumbnailUrl(asset.thumbnailUrl || asset.url, 120)}
                            alt={asset.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-white block truncate">
                            {asset.title}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {asset.category || 'Background'}
                          </span>
                        </div>

                        {/* Order Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveAssetUp(index)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === selectedAssetObjects.length - 1}
                            onClick={() => handleMoveAssetDown(index)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAsset(asset.id)}
                            className="p-1 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                            title="Remove from collection"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                {selectedAssetIds.length} backgrounds assigned to collection.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssetPickerOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssets}
                  disabled={isSavingAssets}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSavingAssets ? 'Saving...' : 'Save Collection Backgrounds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Background Collection?"
          message={`Are you sure you want to delete the collection "${deleteTarget.name}"? The individual background image assets will NOT be deleted from the asset library.`}
          confirmLabel="Delete Collection"
          cancelLabel="Cancel"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
