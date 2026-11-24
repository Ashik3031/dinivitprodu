import React, { useState, useEffect, useMemo } from 'react';
import { InvitationTemplate, Invitation, PrebuiltBlock, CanvasElement } from '../../types';
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
  ChevronDown,
  Box,
  ShieldCheck,
  AlertCircle,
  Store,
  UserCheck
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
    bg: '#f8fafc',
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

  const [adminSection, setAdminSection] = useState<'templates' | 'pending' | 'blocks'>('templates');
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [blocks, setBlocks] = useState<PrebuiltBlock[]>([]);
  const [existingInvitations, setExistingInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [authorFilter, setAuthorFilter] = useState<'all' | 'admin' | 'shop'>('all');

  // Modals
  const [previewTemplate, setPreviewTemplate] = useState<InvitationTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'preset' | 'from-invitation'>('preset');

  // Create template form state
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

  // Edit Template Modal State
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

  // Delete Template Confirm
  const [deleteConfirmTemplate, setDeleteConfirmTemplate] = useState<InvitationTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Block creation modal
  const [isCreateBlockModalOpen, setIsCreateBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    name: '',
    category: 'event' as any,
    subcategory: 'details',
    description: '',
    presetType: 'event-details',
    suggestedHeight: 320
  });
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [deleteConfirmBlock, setDeleteConfirmBlock] = useState<PrebuiltBlock | null>(null);

  // Fetch all templates and blocks
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [tmplRes, blockRes] = await Promise.all([
        api.getTemplates({ all: true }),
        api.getBlocks({ all: true })
      ]);
      setTemplates(tmplRes.templates || []);
      setBlocks(blockRes.blocks || []);

      try {
        const invRes = await api.getInvitations();
        setExistingInvitations(invRes.invitations || []);
      } catch (err) {
        // non-blocking
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Pending Templates count
  const pendingTemplates = useMemo(() => {
    return templates.filter((t) => t.verificationStatus === 'pending');
  }, [templates]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      // If on Pending tab, show only pending
      if (adminSection === 'pending') {
        if (tmpl.verificationStatus !== 'pending') return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if ((tmpl.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (adminSection !== 'pending') {
        if (statusFilter === 'published' && tmpl.isPublic === false) return false;
        if (statusFilter === 'draft' && tmpl.isPublic !== false) return false;
      }

      // Tier filter
      if (tierFilter === 'premium' && !tmpl.isPremium) return false;
      if (tierFilter === 'free' && tmpl.isPremium) return false;

      // Author filter
      if (authorFilter === 'admin' && !tmpl.isSuperAdmin && tmpl.authorRole !== 'admin' && tmpl.authorRole !== 'superadmin') {
        return false;
      }
      if (authorFilter === 'shop' && (tmpl.isSuperAdmin || tmpl.authorRole === 'admin' || tmpl.authorRole === 'superadmin')) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = tmpl.title?.toLowerCase().includes(q);
        const matchDesc = tmpl.description?.toLowerCase().includes(q);
        const matchCat = tmpl.category?.toLowerCase().includes(q);
        const matchTags = tmpl.tags?.some((t) => t.toLowerCase().includes(q));
        const matchAuthor = tmpl.authorName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat && !matchTags && !matchAuthor) return false;
      }

      return true;
    });
  }, [templates, adminSection, selectedCategory, statusFilter, tierFilter, authorFilter, searchQuery]);

  // Filtered Blocks
  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.subcategory.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [blocks, selectedCategory, searchQuery]);

  // Admin Verification (Approve / Reject)
  const handleVerifyTemplate = async (tmpl: InvitationTemplate, isApproved: boolean) => {
    try {
      const res = await api.verifyTemplate(tmpl.id, isApproved);
      setTemplates((prev) =>
        prev.map((t) => (t.id === tmpl.id ? res.template : t))
      );
      if (isApproved) {
        toast.success(`Template "${tmpl.title}" verified and published to the public library! All users can now use it.`);
      } else {
        toast.info(`Template "${tmpl.title}" has been rejected.`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Verification update failed');
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (tmpl: InvitationTemplate) => {
    const nextStatus = tmpl.isPublic === false;
    try {
      await api.togglePublishTemplate(tmpl.id, nextStatus);
      setTemplates((prev) =>
        prev.map((t) => (t.id === tmpl.id ? { ...t, isPublic: nextStatus, verificationStatus: nextStatus ? 'approved' : t.verificationStatus } : t))
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
        const inv = existingInvitations.find((i) => i.id === createForm.selectedInvitationId);
        if (!inv) throw new Error('Selected invitation not found');

        const newTmpl = await api.createTemplate({
          title: createForm.title.trim(),
          category: createForm.category,
          description: createForm.description.trim(),
          thumbnail: createForm.thumbnail || inv.thumbnail,
          isPremium: createForm.isPremium,
          isPublic: createForm.isPublic,
          verificationStatus: 'approved',
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
        const preset = PRESET_THEMES[createForm.selectedPresetIdx] || PRESET_THEMES[0];
        const newTmpl = await api.createTemplate({
          title: createForm.title.trim(),
          category: createForm.category,
          description: createForm.description.trim() || 'Luxury digital invitation template crafted for celebration.',
          thumbnail: createForm.thumbnail.trim(),
          isPremium: createForm.isPremium,
          isPublic: createForm.isPublic,
          verificationStatus: 'approved',
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
              name: 'Section 1',
              order: 0,
              height: 844,
              isFullHeight: true,
              background: { type: 'color', color: '#f8fafc' },
              elements: []
            }
          ]
        });

        createdId = newTmpl.template.id;
        setTemplates((prev) => [newTmpl.template, ...prev]);
        toast.success(`Admin template "${newTmpl.template.title}" created and published!`);
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

  // Submit Create Block
  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockForm.name.trim()) {
      toast.error('Please enter a section block name');
      return;
    }

    try {
      setIsSubmittingBlock(true);

      // Generate elements based on preset type
      let elements: CanvasElement[] = [];
      const timestamp = Date.now();

      if (blockForm.presetType === 'event-details') {
        elements = [
          {
            id: `el-box-${timestamp}`,
            type: 'container',
            name: 'Event Details Card',
            style: { x: 20, y: 30, width: 350, height: 260, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
            content: { containerShape: 'rectangle' } as any
          },
          {
            id: `el-title-${timestamp}`,
            type: 'heading',
            name: 'Section Title',
            style: { x: 35, y: 55, width: 320, height: 40, fontSize: 20, fontWeight: 700, color: '#1e293b', textAlign: 'center' },
            content: { text: 'Wedding Ceremony' }
          },
          {
            id: `el-date-${timestamp}`,
            type: 'event-date',
            name: 'Ceremony Date',
            style: { x: 45, y: 110, width: 300, height: 45 },
            content: { date: 'Saturday, December 12, 2026', title: 'The Date' } as any
          },
          {
            id: `el-venue-${timestamp}`,
            type: 'venue',
            name: 'Venue Info',
            style: { x: 45, y: 170, width: 300, height: 50 },
            content: { venueName: 'The Grand St. Regis Palace', address: '123 Grand Ballroom Ave, New York' } as any
          }
        ];
      } else if (blockForm.presetType === 'rsvp') {
        elements = [
          {
            id: `el-box-${timestamp}`,
            type: 'container',
            name: 'RSVP Card',
            style: { x: 20, y: 30, width: 350, height: 220, backgroundColor: '#0f172a', borderRadius: 16 },
            content: { containerShape: 'rectangle' } as any
          },
          {
            id: `el-hdr-${timestamp}`,
            type: 'heading',
            name: 'RSVP Header',
            style: { x: 35, y: 55, width: 320, height: 40, fontSize: 22, fontWeight: 700, color: '#d4af37', textAlign: 'center' },
            content: { text: 'Kindly Respond' }
          },
          {
            id: `el-rsvp-${timestamp}`,
            type: 'form' as any,
            name: 'RSVP Form',
            style: { x: 45, y: 110, width: 300, height: 80 },
            content: { title: 'RSVP Form', buttonText: 'Confirm Attendance' } as any
          }
        ];
      } else if (blockForm.presetType === 'dress-code') {
        elements = [
          {
            id: `el-dc-${timestamp}`,
            type: 'dress-code',
            name: 'Dress Code Block',
            style: { x: 25, y: 30, width: 340, height: 200 },
            content: {
              title: 'Attire & Dress Code',
              dressCodeType: 'Formal',
              description: 'We kindly request formal evening attire. Tuxedos and dark suits, floor-length gowns and elegant cocktail dresses are welcomed.'
            } as any
          }
        ];
      } else {
        // Blank container block
        elements = [
          {
            id: `el-cont-${timestamp}`,
            type: 'container',
            name: blockForm.name,
            style: { x: 20, y: 30, width: 350, height: blockForm.suggestedHeight, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#cbd5e1' },
            content: { containerShape: 'rectangle' } as any
          }
        ];
      }

      const res = await api.createBlock({
        name: blockForm.name.trim(),
        category: blockForm.category,
        subcategory: blockForm.subcategory.trim(),
        description: blockForm.description.trim() || 'Custom prebuilt section block created by Admin.',
        suggestedHeight: blockForm.suggestedHeight,
        elements,
        isPublic: true
      });

      setBlocks((prev) => [res.block, ...prev]);
      toast.success(`Admin section block "${res.block.name}" created! Users can now insert it in their editor canvas.`);
      setIsCreateBlockModalOpen(false);
      setBlockForm({
        name: '',
        category: 'event',
        subcategory: 'details',
        description: '',
        presetType: 'event-details',
        suggestedHeight: 320
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create block');
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // Delete Block
  const handleDeleteBlock = async () => {
    if (!deleteConfirmBlock) return;
    try {
      await api.deleteBlock(deleteConfirmBlock.id);
      setBlocks((prev) => prev.filter((b) => b.id !== deleteConfirmBlock.id));
      toast.success(`Section block "${deleteConfirmBlock.name}" deleted.`);
      setDeleteConfirmBlock(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete block');
    }
  };

  // Stats calculation
  const totalCount = templates.length;
  const publishedCount = templates.filter((t) => t.isPublic !== false && (t.isSuperAdmin || t.verificationStatus === 'approved')).length;
  const draftsCount = totalCount - publishedCount;
  const pendingCount = pendingTemplates.length;

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
                Admin Templates & Blocks Catalog
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Create and manage templates & section blocks. Review shop-submitted templates, verify them, and publish them so all users can discover them in their editor canvas.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {adminSection === 'blocks' ? (
              <button
                type="button"
                onClick={() => setIsCreateBlockModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Section Block
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Admin Template
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Total Templates</span>
            <span className="text-2xl font-bold text-white mt-1 block">{totalCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
            <span className="text-xs text-emerald-400 block font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Public & Verified
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">{publishedCount}</span>
          </div>
          <div
            onClick={() => setAdminSection('pending')}
            className={`p-3.5 rounded-xl cursor-pointer transition-all border ${pendingCount > 0
              ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-slate-950/40 border-slate-800/60'
              }`}
          >
            <span className="text-xs text-amber-400 block font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Pending Verification
            </span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{pendingCount}</span>
          </div>
          <div
            onClick={() => setAdminSection('blocks')}
            className="bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors"
          >
            <span className="text-xs text-indigo-400 block font-medium flex items-center gap-1">
              <Box className="w-3.5 h-3.5" /> Section Blocks
            </span>
            <span className="text-2xl font-bold text-indigo-300 mt-1 block">{blocks.length}</span>
          </div>
        </div>
      </div>

      {/* Sub-section Switcher Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setAdminSection('templates')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${adminSection === 'templates'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>All Templates ({templates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSection('pending')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${adminSection === 'pending'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Pending Verification</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setAdminSection('blocks')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${adminSection === 'blocks'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <Box className="w-4 h-4" />
          <span>Section Blocks ({blocks.length})</span>
        </button>
      </div>

      {/* SECTION 1 & 2: TEMPLATES & PENDING VERIFICATION */}
      {adminSection !== 'blocks' && (
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                >
                  <span>{cat.label}</span>
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

          {/* Search & Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, shop, tag..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {adminSection !== 'pending' && (
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="all">All Status</option>
                  <option value="published">Verified & Public</option>
                  <option value="draft">Drafts Only</option>
                </select>
              )}

              <select
                value={authorFilter}
                onChange={(e: any) => setAuthorFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60"
              >
                <option value="all">All Authors</option>
                <option value="admin">👑 Admin Created</option>
                <option value="shop">🏪 Shop Submitted</option>
              </select>

              <button
                type="button"
                onClick={fetchAllData}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                title="Refresh catalog"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
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
              <h3 className="text-lg font-semibold text-slate-300">
                {adminSection === 'pending' ? 'No templates pending verification' : 'No templates found'}
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {adminSection === 'pending'
                  ? 'When shop owners submit templates to make them public, they will appear here for your review and approval.'
                  : 'No templates match the selected filter. Create a new Admin template or wait for shops to submit designs.'}
              </p>
              {adminSection !== 'pending' && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create First Template
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((tmpl) => {
                const isAdmin = tmpl.isSuperAdmin || tmpl.authorRole === 'admin' || tmpl.authorRole === 'superadmin';
                const isPending = tmpl.verificationStatus === 'pending';
                const isPublic = tmpl.isPublic !== false && (isAdmin || tmpl.verificationStatus === 'approved');
                const pageCount = tmpl.pages?.length || 1;

                return (
                  <div
                    key={tmpl.id}
                    className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all flex flex-col group shadow-lg ${isPending
                      ? 'border-amber-500/60 shadow-amber-500/10'
                      : 'border-slate-800 hover:border-slate-700/80'
                      }`}
                  >
                    {/* Cover Image & Badges */}
                    <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                      <img
                        src={tmpl.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                        alt={tmpl.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/90 text-amber-300 border border-amber-500/30 uppercase tracking-wider backdrop-blur-md">
                          {tmpl.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isPending ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow animate-pulse">
                              <AlertCircle className="w-3 h-3" /> Pending Review
                            </span>
                          ) : isPublic ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-slate-950 flex items-center gap-1 backdrop-blur-md">
                              <CheckCircle2 className="w-3 h-3" /> Public Library
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700 flex items-center gap-1 backdrop-blur-md">
                              <Lock className="w-3 h-3" /> Draft
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Author badge bottom left */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        {isAdmin ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                            👑 Admin Template
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                            <Store className="w-3 h-3" /> Shop: {tmpl.authorName || 'Shop Owner'}
                          </span>
                        )}
                      </div>

                      {/* Page count bottom right */}
                      <div className="absolute bottom-3 right-3 text-xs text-slate-300">
                        <span className="flex items-center gap-1 font-medium bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                        </span>
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
                      </div>

                      {/* Verification banner if pending */}
                      {isPending && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                            <span>Shop Submitted for Public Access</span>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleVerifyTemplate(tmpl, true)}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve & Make Public
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerifyTemplate(tmpl, false)}
                              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions & Publish Switch */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {/* 1-click Publish Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(tmpl)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${isPublic
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          title={isPublic ? 'Click to unpublish' : 'Click to publish to template library'}
                        >
                          {isPublic ? (
                            <>
                              <Globe className="w-3.5 h-3.5" /> Public Library
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
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Interactive Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(tmpl)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Template Metadata"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(tmpl)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate Template"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmTemplate(tmpl)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
        </div>
      )}

      {/* SECTION 3: SECTION BLOCKS MANAGEMENT */}
      {adminSection === 'blocks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search section blocks..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsCreateBlockModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Section Block
            </button>
          </div>

          {filteredBlocks.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
              <Box className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-300">No Section Blocks Created Yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Create reusable section blocks (like Event Details, Ceremony Timelines, RSVPs, Dress Codes) that will be displayed in the editor canvas Blocks sidebar for all shop owners.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateBlockModalOpen(true)}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Create First Section Block
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlocks.map((block) => (
                <div
                  key={block.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {block.category} • {block.subcategory}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {block.elements?.length || 0} Elements
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2.5">{block.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {block.description || 'Prebuilt section block created by Admin.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Public in Editor
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmBlock(block)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Admin Template</h3>
                  <p className="text-xs text-slate-400">Create and publish an official template to the public library</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => handleCreateTemplate(e, false)} className="p-6 space-y-4">
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCreateMode('preset')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${createMode === 'preset' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Start Fresh with Palette
                </button>
                <button
                  type="button"
                  onClick={() => setCreateMode('from-invitation')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${createMode === 'from-invitation'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Convert Existing Invitation
                </button>
              </div>

              {createMode === 'from-invitation' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Invitation to Clone
                  </label>
                  <select
                    value={createForm.selectedInvitationId}
                    onChange={(e) => {
                      const invId = e.target.value;
                      const inv = existingInvitations.find((i) => i.id === invId);
                      setCreateForm({
                        ...createForm,
                        selectedInvitationId: invId,
                        title: inv ? `${inv.title} Template` : createForm.title,
                        category: inv?.category || createForm.category
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- Choose an invitation project --</option>
                    {existingInvitations.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.title} ({inv.pages.length} Pages • {inv.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imperial Royale Gold & Emerald"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Opening Screen Style
                  </label>
                  <select
                    value={createForm.openingStyle}
                    onChange={(e: any) => setCreateForm({ ...createForm, openingStyle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="envelope">Wax Seal Envelope</option>
                    <option value="gatefold">Ornate Gatefold Doors</option>
                    <option value="monogram">Center Monogram Medallion</option>
                    <option value="curtain">Theatre Velvet Curtain</option>
                    <option value="gift-box">Luxe Ribbon Gift Box</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Bespoke luxury template featuring gilded serif typography and floral accents..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Thumbnail URL</label>
                <input
                  type="url"
                  value={createForm.thumbnail}
                  onChange={(e) => setCreateForm({ ...createForm, thumbnail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingCreate ? 'Publishing...' : 'Publish Template to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SECTION BLOCK MODAL */}
      {isCreateBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Section Block</h3>
                  <p className="text-xs text-slate-400">Publish a reusable canvas section for shop editors</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateBlockModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Block Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ceremony Details Card"
                  value={blockForm.name}
                  onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={blockForm.category}
                    onChange={(e: any) => setBlockForm({ ...blockForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="event">Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="interaction">Interaction (RSVP)</option>
                    <option value="media">Media / Gallery</option>
                    <option value="opening">Opening Cover</option>
                    <option value="final">Final / Closing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preset Architecture</label>
                  <select
                    value={blockForm.presetType}
                    onChange={(e) => setBlockForm({ ...blockForm, presetType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="event-details">Date & Venue Lockup</option>
                    <option value="rsvp">Dark Luxury RSVP Card</option>
                    <option value="dress-code">Dress Code Badge & Notes</option>
                    <option value="blank-card">Clean Blank Container</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Insert styled ceremony details with date, time, and venue lockup..."
                  value={blockForm.description}
                  onChange={(e) => setBlockForm({ ...blockForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateBlockModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBlock}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingBlock ? 'Saving...' : 'Create Section Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white">Edit Template Metadata</h3>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Thumbnail URL</label>
                <input
                  type="url"
                  value={editForm.thumbnail}
                  onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE TEMPLATE CONFIRM DIALOG */}
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

      {/* DELETE BLOCK CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmBlock)}
        onClose={() => setDeleteConfirmBlock(null)}
        onConfirm={handleDeleteBlock}
        title="Delete Section Block?"
        message={`Are you sure you want to permanently delete section block "${deleteConfirmBlock?.name}"?`}
        confirmText="Delete Block"
        type="danger"
      />
    </div>
  );
};
