import React, { useState, useEffect, useMemo } from 'react';
import { InvitationTemplate, Invitation } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import {
  Sparkles,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Tag,
  Palette,
  Layers,
  FileText,
  Clock,
  Check,
  Globe,
  Lock,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Templates' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'birthday', label: 'Birthday & Milestones' },
  { id: 'save-the-date', label: 'Save the Date' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'party', label: 'Party & Celebration' },
  { id: 'gala', label: 'Gala & Soirée' },
  { id: 'corporate', label: 'Corporate & Conference' },
  { id: 'baby-shower', label: 'Baby Shower' },
  { id: 'other', label: 'Custom & Other' }
];

const PRESET_THEMES = [
  {
    name: 'Royal Emerald & Gold',
    primary: '#d4af37',
    secondary: '#1a3628',
    bg: '#071912',
    fontHeading: "'Cinzel', serif",
    fontBody: "'Montserrat', sans-serif"
  },
  {
    name: 'Blush Rose & Sage',
    primary: '#4a6741',
    secondary: '#d48d8d',
    bg: '#faf8f5',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Plus Jakarta Sans', sans-serif"
  },
  {
    name: 'Midnight Glamour',
    primary: '#f59e0b',
    secondary: '#18181b',
    bg: '#09090b',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Montserrat', sans-serif"
  },
  {
    name: 'Minimalist Ivory',
    primary: '#1c1917',
    secondary: '#78716c',
    bg: '#fbfbfa',
    fontHeading: "'Cinzel', serif",
    fontBody: "'Plus Jakarta Sans', sans-serif"
  }
];

interface AdminTemplateManagerProps {
  onEditTemplate?: (templateId: string) => void;
}

export const AdminTemplateManager: React.FC<AdminTemplateManagerProps> = ({ onEditTemplate }) => {
  const toast = useToast();

  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [existingInvitations, setExistingInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');

  // Modals
  const [previewTemplate, setPreviewTemplate] = useState<InvitationTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'preset' | 'from-invitation'>('preset');

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: '',
    category: 'wedding',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    isPremium: false,
    isPublic: true,
    tags: 'wedding, luxury, formal',
    selectedPresetIdx: 0,
    openingStyle: 'envelope' as any,
    pageCount: 2,
    selectedInvitationId: ''
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Edit Modal State
  const [editingTemplate, setEditingTemplate] = useState<InvitationTemplate | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: 'wedding',
    description: '',
    thumbnail: '',
    isPremium: false,
    isPublic: true,
    tags: ''
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete Confirm
  const [deleteConfirmTemplate, setDeleteConfirmTemplate] = useState<InvitationTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all templates (with admin flag all=true)
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await api.getTemplates({ all: true });
      setTemplates(res.templates || []);

      // Also fetch invitations so admin can convert any invitation into a template
      try {
        const invRes = await api.getInvitations();
        setExistingInvitations(invRes.invitations || []);
      } catch (err) {
        // non-blocking
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if ((tmpl.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'published' && tmpl.isPublic === false) return false;
      if (statusFilter === 'draft' && tmpl.isPublic !== false) return false;

      // Tier filter
      if (tierFilter === 'premium' && !tmpl.isPremium) return false;
      if (tierFilter === 'free' && tmpl.isPremium) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = tmpl.title?.toLowerCase().includes(q);
        const matchDesc = tmpl.description?.toLowerCase().includes(q);
        const matchCat = tmpl.category?.toLowerCase().includes(q);
        const matchTags = tmpl.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
      }

      return true;
    });
  }, [templates, selectedCategory, statusFilter, tierFilter, searchQuery]);

  // Toggle publish status
  const handleTogglePublish = async (tmpl: InvitationTemplate) => {
    const nextStatus = tmpl.isPublic === false;
    try {
      await api.togglePublishTemplate(tmpl.id, nextStatus);
      setTemplates((prev) =>
        prev.map((t) => (t.id === tmpl.id ? { ...t, isPublic: nextStatus } : t))
      );
      toast.success(
        nextStatus
          ? `Template "${tmpl.title}" is now published to the public library!`
          : `Template "${tmpl.title}" is now unpublished (draft).`
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update template status');
    }
  };

  // Duplicate template
  const handleDuplicate = async (tmpl: InvitationTemplate) => {
    try {
      const res = await api.duplicateTemplate(tmpl.id);
      setTemplates((prev) => [res.template, ...prev]);
      toast.success(`Created duplicate copy "${res.template.title}" as draft.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to duplicate template');
    }
  };

  // Delete template
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmTemplate) return;
    try {
      setIsDeleting(true);
      await api.deleteTemplate(deleteConfirmTemplate.id);
      setTemplates((prev) => prev.filter((t) => t.id !== deleteConfirmTemplate.id));
      toast.success(`Template "${deleteConfirmTemplate.title}" deleted.`);
      setDeleteConfirmTemplate(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete template');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (tmpl: InvitationTemplate) => {
    setEditingTemplate(tmpl);
    setEditForm({
      title: tmpl.title || '',
      category: tmpl.category || 'wedding',
      description: tmpl.description || '',
      thumbnail: tmpl.thumbnail || '',
      isPremium: Boolean(tmpl.isPremium),
      isPublic: tmpl.isPublic !== false,
      tags: tmpl.tags ? tmpl.tags.join(', ') : ''
    });
  };

  // Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      setIsSubmittingEdit(true);
      const tagsArray = editForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.updateTemplate(editingTemplate.id, {
        title: editForm.title.trim(),
        category: editForm.category.trim(),
        description: editForm.description.trim(),
        thumbnail: editForm.thumbnail.trim(),
        isPremium: editForm.isPremium,
        isPublic: editForm.isPublic,
        tags: tagsArray
      });

      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? res.template : t))
      );
      toast.success('Template updated successfully!');
      setEditingTemplate(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update template');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Submit Create Template
  const handleCreateTemplate = async (e?: React.FormEvent, openInEditor = false) => {
    if (e) e.preventDefault();
    if (!createForm.title.trim()) {
      toast.error('Please enter a template title');
      return;
    }

    try {
      setIsSubmittingCreate(true);
      const tagsArray = createForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let createdId: string | null = null;

      if (createMode === 'from-invitation' && createForm.selectedInvitationId) {
        // Clone from invitation
        const inv = existingInvitations.find((i) => i.id === createForm.selectedInvitationId);
        if (!inv) throw new Error('Selected invitation not found');

        const newTmpl = await api.createTemplate({
          title: createForm.title.trim(),
          category: createForm.category,
          description: createForm.description.trim(),
          thumbnail: createForm.thumbnail || inv.thumbnail,
          isPremium: createForm.isPremium,
          isPublic: createForm.isPublic,
          tags: tagsArray,
          theme: inv.theme,
          openingScreen: inv.openingScreen,
          music: inv.music,
          pages: inv.pages
        });

        createdId = newTmpl.template.id;
        setTemplates((prev) => [newTmpl.template, ...prev]);
        toast.success(`Published template "${newTmpl.template.title}" from invitation!`);
      } else {
        // Create from preset
        const preset = PRESET_THEMES[createForm.selectedPresetIdx] || PRESET_THEMES[0];
        const newTmpl = await api.createTemplate({
          title: createForm.title.trim(),
          category: createForm.category,
          description: createForm.description.trim() || 'Luxury digital invitation template crafted for celebration.',
          thumbnail: createForm.thumbnail.trim(),
          isPremium: createForm.isPremium,
          isPublic: createForm.isPublic,
          tags: tagsArray,
          theme: {
            primaryColor: preset.primary,
            secondaryColor: preset.secondary,
            accentColor: preset.primary,
            fontHeading: preset.fontHeading,
            fontBody: preset.fontBody,
            fontScript: "'Parisienne', cursive",
            backgroundColor: preset.bg
          },
          openingScreen: {
            enabled: true,
            style: createForm.openingStyle,
            title: 'Formal Invitation',
            subtitle: 'You are cordially invited',
            coupleNames: createForm.title,
            openButtonText: 'Open Invitation',
            sealColor: preset.primary,
            envelopeColor: preset.secondary,
            musicAutoplayOnOpen: true
          },
          music: {
            enabled: true,
            audioUrl: 'https://cdn.freesound.org/previews/467/467269_4939433-lq.mp3',
            title: 'Romantic Prelude Strings',
            artist: 'Studio Symphony',
            autoPlay: true,
            loop: true,
            floatingBadge: true
          },
          pages: [
            {
              id: `p-${Date.now()}-1`,
              name: 'Cover & Invitation Header',
              order: 0,
              height: 844,
              isFullHeight: true,
              background: { type: 'color', color: preset.bg },
              elements: [
                {
                  id: `el-box-${Date.now()}`,
                  type: 'container',
                  name: 'Ornamental Card Frame',
                  style: {
                    x: 20,
                    y: 40,
                    width: 350,
                    height: 740,
                    shape: 'rounded-rectangle',
                    borderRadius: 16,
                    backgroundColor: preset.secondary,
                    borderWidth: 1,
                    borderColor: `${preset.primary}44`,
                    boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                    padding: 24
                  },
                  content: {},
                  animation: { type: 'zoomIn', duration: 0.8, delay: 0.2 }
                },
                {
                  id: `el-title-${Date.now()}`,
                  type: 'heading',
                  name: 'Template Title',
                  parentContainerId: `el-box-${Date.now()}`,
                  style: {
                    x: 35,
                    y: 160,
                    width: 320,
                    height: 60,
                    fontFamily: preset.fontHeading,
                    fontSize: 28,
                    fontWeight: 700,
                    color: preset.primary,
                    textAlign: 'center'
                  },
                  content: { text: createForm.title }
                },
                {
                  id: `el-desc-${Date.now()}`,
                  type: 'text',
                  name: 'Invitation Lead',
                  parentContainerId: `el-box-${Date.now()}`,
                  style: {
                    x: 40,
                    y: 240,
                    width: 310,
                    height: 48,
                    fontFamily: preset.fontBody,
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#ffffffdd',
                    textAlign: 'center'
                  },
                  content: { text: 'Request the honor of your presence at the celebration' }
                }
              ]
            }
          ]
        });

        createdId = newTmpl.template.id;
        setTemplates((prev) => [newTmpl.template, ...prev]);
        toast.success(`Template "${newTmpl.template.title}" created and published!`);
      }

      setIsCreateModalOpen(false);
      setCreateForm({
        title: '',
        category: 'wedding',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        isPremium: false,
        isPublic: true,
        tags: 'wedding, luxury, formal',
        selectedPresetIdx: 0,
        openingStyle: 'envelope',
        pageCount: 2,
        selectedInvitationId: ''
      });

      if (openInEditor && createdId && onEditTemplate) {
        onEditTemplate(createdId);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create template');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Stats calculation
  const totalCount = templates.length;
  const publishedCount = templates.filter((t) => t.isPublic !== false).length;
  const draftsCount = totalCount - publishedCount;
  const categoriesCount = new Set(templates.map((t) => t.category)).size;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Public Template Library & Catalog
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Create category-wise digital invitation templates, publish them to the client library, and manage public template access for all studios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Category Template
          </button>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Total Templates</span>
            <span className="text-2xl font-bold text-white mt-1 block">{totalCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
            <span className="text-xs text-emerald-400 block font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published to Library
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">{publishedCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Drafts / Private</span>
            <span className="text-2xl font-bold text-slate-300 mt-1 block">{draftsCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
            <span className="text-xs text-amber-400 block font-medium">Categories Active</span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{categoriesCount}</span>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-4">
        {/* Category horizontal scroll bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? templates.length
                : templates.filter((t) => (t.category || '').toLowerCase() === cat.id.toLowerCase()).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates, tags, titles..."
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

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60"
            >
              <option value="all">All Status</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

            {/* Tier filter */}
            <select
              value={tierFilter}
              onChange={(e: any) => setTierFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60"
            >
              <option value="all">All Tiers</option>
              <option value="free">Standard (Free)</option>
              <option value="premium">Premium Only</option>
            </select>

            <button
              type="button"
              onClick={fetchTemplates}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
              title="Refresh templates"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
          <p className="text-sm">Loading template catalog...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No templates found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
              ? 'Try changing your search keywords or category filters.'
              : 'Get started by creating and publishing your first digital invitation template!'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => {
            const isPublished = tmpl.isPublic !== false;
            const pageCount = tmpl.pages?.length || 1;

            return (
              <div
                key={tmpl.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all flex flex-col group shadow-lg shadow-black/30"
              >
                {/* Cover Image & Badges */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={tmpl.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                    alt={tmpl.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/90 text-amber-300 border border-amber-500/30 uppercase tracking-wider backdrop-blur-md">
                      {tmpl.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {tmpl.isPremium && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow">
                          <Sparkles className="w-3 h-3" /> Premium
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 backdrop-blur-md ${
                          isPublished
                            ? 'bg-emerald-500/90 text-slate-950'
                            : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Public Library
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" /> Draft / Hidden
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats inside image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-medium bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                    </span>

                    {tmpl.openingScreen?.enabled && (
                      <span className="text-[11px] text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Envelope Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tmpl.description || 'Custom crafted luxury invitation template.'}
                    </p>

                    {/* Tags */}
                    {tmpl.tags && tmpl.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tmpl.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Publish Switch */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {/* 1-click Publish Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(tmpl)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                        isPublished
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                      title={isPublished ? 'Click to unpublish' : 'Click to publish to template library'}
                    >
                      {isPublished ? (
                        <>
                          <Globe className="w-3.5 h-3.5" /> Published
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Set Public
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      {onEditTemplate && (
                        <button
                          type="button"
                          onClick={() => onEditTemplate(tmpl.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/15 rounded-lg transition-colors cursor-pointer"
                          title="Edit in Visual Canvas Editor"
                        >
                          <Palette className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(tmpl)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Interactive Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(tmpl)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Template Metadata"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(tmpl)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Duplicate Template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmTemplate(tmpl)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {onEditTemplate && (
                    <button
                      type="button"
                      onClick={() => onEditTemplate(tmpl.id)}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 hover:from-amber-500/25 hover:to-amber-500/15 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Template in Canvas Editor</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PREVIEW MODAL */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        onEditTemplate={onEditTemplate}
      />

      {/* CREATE TEMPLATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Category Template</h3>
                  <p className="text-xs text-slate-400">Publish a new invitation template to the library</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ×
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="p-6 pb-0">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateMode('preset')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    createMode === 'preset'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create from Category Preset
                </button>
                <button
                  type="button"
                  onClick={() => setCreateMode('from-invitation')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    createMode === 'from-invitation'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Publish from Existing Invitation
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              {createMode === 'from-invitation' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Studio Invitation to Convert:
                  </label>
                  <select
                    value={createForm.selectedInvitationId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const inv = existingInvitations.find((i) => i.id === id);
                      setCreateForm((prev) => ({
                        ...prev,
                        selectedInvitationId: id,
                        title: inv ? `${inv.title} Template` : prev.title,
                        category: inv?.category || prev.category
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- Choose an Invitation --</option>
                    {existingInvitations.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.title} ({inv.category} • {inv.pages?.length || 1} pages)
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="e.g., Royal Sapphire Wedding Suite"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Category *
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Describe the aesthetic and included sections (timeline, RSVP, dress code)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Preset Selection (if in preset mode) */}
              {createMode === 'preset' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    Aesthetic Palette & Typography Pairing:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_THEMES.map((thm, idx) => (
                      <button
                        key={thm.name}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, selectedPresetIdx: idx })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          createForm.selectedPresetIdx === idx
                            ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: thm.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: thm.secondary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: thm.bg }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-white block truncate">
                          {thm.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Opening Screen Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Opening Envelope Style
                      </label>
                      <select
                        value={createForm.openingStyle}
                        onChange={(e: any) => setCreateForm({ ...createForm, openingStyle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="envelope">Classic Folding Envelope with Wax Seal</option>
                        <option value="card-flip">3D Card Flip Experience</option>
                        <option value="curtain">Grand Theatre Silk Curtain</option>
                        <option value="monogram-glow">Monogram Glow Seal</option>
                        <option value="minimal-button">Minimalist Floating Button</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={createForm.tags}
                        onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                        placeholder="wedding, royal, floral, elegant"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Thumbnail URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={createForm.thumbnail}
                  onChange={(e) => setCreateForm({ ...createForm, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isPublic}
                    onChange={(e) => setCreateForm({ ...createForm, isPublic: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Publish Immediately to Public Library
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isPremium}
                    onChange={(e) => setCreateForm({ ...createForm, isPremium: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Mark as Premium Template
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  {onEditTemplate && (
                    <button
                      type="button"
                      onClick={() => handleCreateTemplate(undefined, true)}
                      disabled={isSubmittingCreate}
                      className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Create template and immediately launch the canvas editor to design pages & elements"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Create & Open Canvas</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmittingCreate}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingCreate ? 'Publishing...' : 'Publish to Library'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white">Edit Template Metadata</h3>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {CATEGORY_OPTIONS.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Thumbnail URL
                </label>
                <input
                  type="url"
                  value={editForm.thumbnail}
                  onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isPublic}
                    onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Published in Public Library
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isPremium}
                    onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    Premium Template
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                {onEditTemplate && editingTemplate && (
                  <button
                    type="button"
                    onClick={() => {
                      const id = editingTemplate.id;
                      setEditingTemplate(null);
                      onEditTemplate(id);
                    }}
                    className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Launch the visual canvas editor to customize pages and elements"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open in Visual Canvas</span>
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEdit}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
                  >
                    {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmTemplate)}
        onClose={() => setDeleteConfirmTemplate(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Template?"
        message={`Are you sure you want to permanently delete template "${deleteConfirmTemplate?.title}" from the library? This cannot be undone.`}
        confirmText="Delete Template"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
