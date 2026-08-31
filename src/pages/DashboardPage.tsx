import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Invitation, InvitationTemplate, RSVPResponse, GuestbookMessage, EventType } from '../types';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Share2,
  Users,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Layout,
  CheckCircle2,
  Clock,
  X,
  Download,
  Calendar,
  LogOut,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Globe,
  FileEdit,
  Layers,
  Cake,
  Heart,
  Briefcase,
  Gift,
  PartyPopper,
  CalendarDays,
  User as UserIcon,
  FolderPlus,
  Check,
  AlertCircle
} from 'lucide-react';

interface DashboardPageProps {
  onOpenEditor: (invitationId: string) => void;
  onOpenAdmin?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenEditor,
  onOpenAdmin
}) => {
  const { user, logout } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Multi-step Creation Wizard State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationStep, setCreationStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Type Selection
  const [selectedEventType, setSelectedEventType] = useState<EventType>('wedding');
  
  // Step 2: Creation Mode Selection
  const [creationMode, setCreationMode] = useState<'blank' | 'template' | 'duplicate'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedDuplicateId, setSelectedDuplicateId] = useState<string>('');
  
  // Step 3: Metadata Details
  const [newTitle, setNewTitle] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Quick Preview modal
  const [previewInv, setPreviewInv] = useState<Invitation | null>(null);

  // RSVP / Guestbook Details Modal
  const [activeDetailsInv, setActiveDetailsInv] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [guestbook, setGuestbook] = useState<GuestbookMessage[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load Invitations & Templates
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [invRes, tmplRes] = await Promise.all([
        api.getInvitations(),
        api.getTemplates()
      ]);
      setInvitations(invRes.invitations || []);
      setTemplates(tmplRes.templates || []);
      if (tmplRes.templates && tmplRes.templates.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(tmplRes.templates[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const openCreateWizard = () => {
    setCreationStep(1);
    setSelectedEventType('wedding');
    setCreationMode('template');
    if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }
    setSelectedDuplicateId(invitations.length > 0 ? invitations[0].id : '');
    setNewTitle('');
    setNewCustomerName('');
    setNewEventDate('');
    setCreateError('');
    setIsCreateModalOpen(true);
  };

  // Filtered invitations
  const filteredInvitations = invitations.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.title.toLowerCase().includes(q) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
      inv.slug.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || inv.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Recent invitations for summary list
  const recentInvitations = [...invitations].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  ).slice(0, 5);

  // Step 1 to Step 2 transition
  const handleNextFromStep1 = (type: EventType) => {
    setSelectedEventType(type);
    // Find a matching template if possible
    const match = templates.find(t => t.category.toLowerCase() === type.toLowerCase());
    if (match) {
      setSelectedTemplateId(match.id);
    } else if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }
    setCreationStep(2);
  };

  // Step 2 to Step 3 transition
  const handleNextFromStep2 = () => {
    // Generate an intelligent placeholder name based on step 1 & 2
    if (!newTitle) {
      const typeLabel = selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1).replace('-', ' ');
      setNewTitle(`${typeLabel} Invitation`);
    }
    setCreationStep(3);
  };

  // Handle Final Create Invitation
  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setCreateError('Please enter an invitation name');
      return;
    }

    setIsCreating(true);
    setCreateError('');
    try {
      const payload: any = {
        title: newTitle.trim(),
        customerName: newCustomerName.trim(),
        eventDate: newEventDate,
        eventType: selectedEventType,
        category: selectedEventType
      };

      if (creationMode === 'template') {
        payload.templateId = selectedTemplateId;
      } else if (creationMode === 'duplicate' && selectedDuplicateId) {
        payload.duplicateFromId = selectedDuplicateId;
      } else {
        payload.templateId = undefined; // blank
      }

      const res = await api.createInvitation(payload);

      if (res.invitation) {
        setIsCreateModalOpen(false);
        onOpenEditor(res.invitation.id);
      }
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create invitation');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Quick Status Toggle (Publish / Unpublish / Draft)
  const handleTogglePublish = async (inv: Invitation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus: 'published' | 'draft' = inv.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.updateInvitation(inv.id, { status: newStatus });
      setInvitations(prev => prev.map(i => i.id === inv.id ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Duplicate directly from card/table
  const handleDuplicate = async (inv: Invitation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.duplicateInvitation(inv.id);
      if (res.invitation) {
        setInvitations(prev => [res.invitation, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) return;
    try {
      await api.deleteInvitation(id);
      setInvitations(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Open RSVP & Guestbook Inspector
  const handleOpenDetails = async (inv: Invitation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveDetailsInv(inv);
    setIsLoadingDetails(true);
    try {
      const [rsvpData, gbData] = await Promise.all([
        api.getRSVPList(inv.id),
        api.getGuestbook(inv.id)
      ]);
      setRsvps(rsvpData.rsvps || []);
      setGuestbook(gbData.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Export RSVP CSV
  const handleExportCSV = () => {
    if (!rsvps.length || !activeDetailsInv) return;
    const headers = ['Guest Name', 'Attendance', 'Guest Count', 'Email', 'Phone', 'Dietary Restrictions', 'Message', 'Date'];
    const rows = rsvps.map(r => [
      `"${r.guestName}"`,
      `"${r.attendance}"`,
      r.guestCount,
      `"${r.guestEmail || ''}"`,
      `"${r.guestPhone || ''}"`,
      `"${r.dietaryPreferences || ''}"`,
      `"${r.message || ''}"`,
      `"${new Date(r.submittedAt).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rsvps-${activeDetailsInv.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const eventTypeOptions: Array<{ id: EventType; label: string; icon: any; desc: string }> = [
    { id: 'wedding', label: 'Wedding', icon: Heart, desc: 'Luxury nuptials, ceremony & reception' },
    { id: 'birthday', label: 'Birthday', icon: Cake, desc: 'Milestone celebrations & kids parties' },
    { id: 'engagement', label: 'Engagement', icon: Sparkles, desc: 'Rings exchange & bridal announcements' },
    { id: 'anniversary', label: 'Anniversary', icon: Gift, desc: 'Golden jubilees & relationship milestones' },
    { id: 'baby-shower', label: 'Baby Shower', icon: PartyPopper, desc: 'Gender reveals & welcoming newborn' },
    { id: 'business-event', label: 'Business Event', icon: Briefcase, desc: 'Corporate galas, summits & expos' },
    { id: 'other', label: 'Other Special Occasion', icon: CalendarDays, desc: 'Custom banquets & VIP dinners' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span>Digital Invitation Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                BUSINESS DASHBOARD
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>{user?.businessName || user?.username}</span>
              {user?.ownerName && <span>• {user.ownerName}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Management</span>
            </button>
          )}

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* User Dashboard Header & Metrics */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Phase 1 & 2 • Invitation Studio
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {user?.businessName || 'Business Owner'} Invitations
              </h1>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Design bespoke mobile-first multimedia invitations, organize customer events, monitor RSVPs, and publish shareable links with custom slugs.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateWizard}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Invitation</span>
            </button>
          </div>

          {/* User Dashboard Metrics Cards: Total, Draft, Published, Recent */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-[10px] uppercase font-bold text-slate-500">Total Invitations</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{invitations.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">All customer projects</div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-[10px] uppercase font-bold text-amber-700">Draft Invitations</div>
              <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
                {invitations.filter(i => i.status === 'draft').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Under editing & review</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-[10px] uppercase font-bold text-emerald-700">Published Invitations</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                {invitations.filter(i => i.status === 'published').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Active live links</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-[10px] uppercase font-bold text-indigo-700">Recent Activity</div>
              <div className="text-2xl font-bold text-indigo-700 font-mono mt-1">
                {recentInvitations.length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Updated recently</div>
            </div>
          </div>
        </div>

        {/* Search, Status Tabs, Category Filter & View Mode */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invitation title, customer, or URL slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {/* Status Filter */}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg capitalize font-medium text-xs transition-colors cursor-pointer ${
                    statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>

            {/* Event Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="engagement">Engagement</option>
              <option value="anniversary">Anniversary</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="business-event">Business Event</option>
              <option value="other">Other</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm">
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewLayout === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Layout className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('table')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewLayout === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Table Listing View"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Invitation Listing Page - Grid / Table */}
        {filteredInvitations.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-white shadow-sm">
            <Layout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No invitations found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try clearing your search query or filters to view all client invitations.'
                : 'Get started by creating your first client digital invitation using our 3-step wizard.'}
            </p>
            <button
              type="button"
              onClick={openCreateWizard}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Invitation</span>
            </button>
          </div>
        ) : viewLayout === 'table' ? (
          /* Table Listing View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Thumbnail & Title</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Event Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Last Edited</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvitations.map((inv) => {
                    const previewImg =
                      inv.thumbnail ||
                      inv.pages[0]?.background?.imageUrl ||
                      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={previewImg}
                              alt={inv.title}
                              className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0 cursor-pointer"
                              referrerPolicy="no-referrer"
                              onClick={() => onOpenEditor(inv.id)}
                            />
                            <div>
                              <div
                                onClick={() => onOpenEditor(inv.id)}
                                className="font-bold text-slate-900 hover:text-slate-700 cursor-pointer text-xs"
                              >
                                {inv.title}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">/{inv.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-700">
                          {inv.customerName ? (
                            <div className="font-medium text-slate-800">{inv.customerName}</div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                          {inv.eventDate && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{inv.eventDate}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {inv.eventType || inv.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={(e) => handleTogglePublish(inv, e)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              inv.status === 'published'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click to toggle publish status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'published' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span className="capitalize">{inv.status}</span>
                          </button>
                        </td>
                        <td className="p-4 text-slate-500 text-[11px]">
                          {new Date(inv.updatedAt || inv.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Preview */}
                            <button
                              type="button"
                              onClick={() => setPreviewInv(inv)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => onOpenEditor(inv.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                              title="Open in Editor"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={(e) => handleDuplicate(inv, e)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                              title="Duplicate Invitation"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => handleDelete(inv.id, e)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors"
                              title="Delete Invitation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvitations.map((inv) => {
              const previewImg =
                inv.thumbnail ||
                inv.pages[0]?.background?.imageUrl ||
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={inv.id}
                  className="rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col group shadow-sm"
                >
                  {/* Card Thumbnail / Preview Banner */}
                  <div
                    className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => onOpenEditor(inv.id)}
                  >
                    <img
                      src={previewImg}
                      alt={inv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

                    {/* Status Pill with Toggle */}
                    <div className="absolute top-3 left-3">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePublish(inv, e)}
                        className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                          inv.status === 'published'
                            ? 'bg-emerald-50/90 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-white/90 text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {inv.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </div>

                    {/* Event Type Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {inv.eventType || inv.category}
                      </span>
                    </div>

                    {/* Quick Preview Icon Overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewInv(inv);
                      }}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs transition-transform active:scale-95"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => onOpenEditor(inv.id)}
                          className="text-base font-bold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer truncate flex-1"
                        >
                          {inv.title}
                        </h3>
                      </div>

                      {/* Customer & Event Date Info */}
                      <div className="mt-1 space-y-1 text-xs">
                        {inv.customerName ? (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Customer: {inv.customerName}</span>
                          </div>
                        ) : null}

                        {inv.eventDate ? (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Date: {inv.eventDate}</span>
                          </div>
                        ) : null}

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                          <span>{inv.pages.length} Pages</span>
                          <span>•</span>
                          <span className="font-mono">/{inv.slug}</span>
                          <span>•</span>
                          <span>Edited {new Date(inv.updatedAt || inv.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {/* Left: Quick guest details button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenDetails(inv, e)}
                        title="View RSVPs and Wishes"
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>Guests & RSVP</span>
                      </button>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1">
                        {/* Publish / Unpublish Toggle */}
                        <button
                          type="button"
                          title={inv.status === 'published' ? 'Unpublish (set to Draft)' : 'Publish Invitation'}
                          onClick={(e) => handleTogglePublish(inv, e)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            inv.status === 'published'
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          title="Duplicate Invitation"
                          onClick={(e) => handleDuplicate(inv, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={(e) => handleDelete(inv.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditor(inv.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3-STEP INVITATION CREATION WIZARD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stepper Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between max-w-xs mx-auto mb-3">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${creationStep >= 1 ? 'text-slate-900' : 'text-slate-300'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${creationStep >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                  <span>Type</span>
                </div>
                <div className={`h-[2px] flex-1 mx-2 ${creationStep >= 2 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-1.5 text-xs font-bold ${creationStep >= 2 ? 'text-slate-900' : 'text-slate-300'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${creationStep >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                  <span>Template</span>
                </div>
                <div className={`h-[2px] flex-1 mx-2 ${creationStep >= 3 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-1.5 text-xs font-bold ${creationStep >= 3 ? 'text-slate-900' : 'text-slate-300'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${creationStep >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                  <span>Details</span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {creationStep === 1 && 'Step 1: Choose Invitation Type'}
                  {creationStep === 2 && 'Step 2: Choose Starting Canvas'}
                  {creationStep === 3 && 'Step 3: Enter Customer & Event Details'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {creationStep === 1 && 'Select the occasion category for the digital invitation card.'}
                  {creationStep === 2 && 'Start from blank, select a luxury template, or clone an existing invitation.'}
                  {creationStep === 3 && 'Specify the invitation title, customer name, and optional event date.'}
                </p>
              </div>
            </div>

            {createError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {/* STEP 1: CHOOSE INVITATION TYPE */}
            {creationStep === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eventTypeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedEventType === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleNextFromStep1(opt.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 group hover:scale-[1.01] ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>{opt.label}</span>
                            <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100 text-amber-300' : 'text-slate-400'}`} />
                          </div>
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE STARTING CANVAS */}
            {creationStep === 2 && (
              <div className="space-y-5">
                {/* 3 Starting Mode Tabs */}
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setCreationMode('template')}
                    className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                      creationMode === 'template'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <div className="text-xs font-bold">Start from Template</div>
                    <div className={`text-[10px] ${creationMode === 'template' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Pre-designed layout
                    </div>
                  </div>

                  <div
                    onClick={() => setCreationMode('blank')}
                    className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                      creationMode === 'blank'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Layout className="w-5 h-5" />
                    <div className="text-xs font-bold">Start from Blank</div>
                    <div className={`text-[10px] ${creationMode === 'blank' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Blank canvas
                    </div>
                  </div>

                  <div
                    onClick={() => setCreationMode('duplicate')}
                    className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                      creationMode === 'duplicate'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Copy className="w-5 h-5" />
                    <div className="text-xs font-bold">Duplicate Existing</div>
                    <div className={`text-[10px] ${creationMode === 'duplicate' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Clone prior client work
                    </div>
                  </div>
                </div>

                {/* Sub-options based on mode */}
                {creationMode === 'template' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      Choose Starting Template:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                      {templates.map((tmpl) => (
                        <div
                          key={tmpl.id}
                          onClick={() => setSelectedTemplateId(tmpl.id)}
                          className={`p-2 rounded-2xl border cursor-pointer transition-all overflow-hidden relative group ${
                            selectedTemplateId === tmpl.id
                              ? 'bg-slate-100 border-slate-900 ring-2 ring-slate-900 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                          }`}
                        >
                          <img
                            src={tmpl.thumbnail}
                            alt={tmpl.title}
                            className="w-full h-24 object-cover rounded-xl mb-2 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-xs font-bold truncate px-1 text-slate-900">{tmpl.title}</div>
                          <div className="text-[10px] text-slate-500 px-1">{tmpl.pages.length} Pages • {tmpl.category}</div>
                          {selectedTemplateId === tmpl.id && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {creationMode === 'duplicate' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      Select Existing Invitation to Clone:
                    </label>
                    {invitations.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                        No previous invitations found. You can start from blank or a template.
                      </div>
                    ) : (
                      <select
                        value={selectedDuplicateId}
                        onChange={(e) => setSelectedDuplicateId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl p-3 text-xs text-slate-900"
                      >
                        {invitations.map(inv => (
                          <option key={inv.id} value={inv.id}>
                            {inv.title} {inv.customerName ? `(${inv.customerName})` : ''} - {inv.category}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {creationMode === 'blank' && (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200">
                    <Layout className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-900">Clean Blank Canvas</div>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                      You will begin with an empty mobile-responsive artboard to add your custom background, text typography, envelope opening, and multimedia elements.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCreationStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextFromStep2}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    <span>Continue to Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ENTER INVITATION METADATA & CUSTOMER DETAILS */}
            {creationStep === 3 && (
              <form onSubmit={handleCreateInvitation} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    Invitation Name / Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander & Sophia Royal Wedding Invitation"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">
                      Customer / Client Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe / Smith Family"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">
                      Event Type
                    </label>
                    <select
                      value={selectedEventType}
                      onChange={(e) => setSelectedEventType(e.target.value as EventType)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl p-3 text-slate-900 capitalize"
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="engagement">Engagement</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="baby-shower">Baby Shower</option>
                      <option value="business-event">Business Event</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    Event Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-3 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>After creation: </strong>
                    The visual canvas editor will launch immediately with full multi-page support, typography controls, and interactive envelope openers.
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCreationStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isCreating ? 'Creating & Launching...' : 'Create & Open Editor'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl flex flex-col items-center max-h-[92vh]">
            <button
              type="button"
              onClick={() => setPreviewInv(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mobile Card Preview</span>
              <h4 className="text-sm font-bold text-slate-900 truncate max-w-[240px]">{previewInv.title}</h4>
            </div>

            {/* Mobile frame */}
            <div className="w-[320px] h-[560px] bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
              <iframe
                src={`/#/i/${previewInv.slug}`}
                className="w-full h-full border-0"
                title={previewInv.title}
              />
            </div>

            <div className="w-full mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <a
                href={`/#/i/${previewInv.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  const id = previewInv.id;
                  setPreviewInv(null);
                  onOpenEditor(id);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP & GUESTBOOK DETAILS MODAL */}
      {activeDetailsInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setActiveDetailsInv(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Guest Responses & RSVPs
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {activeDetailsInv.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* RSVP Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>RSVP Submissions ({rsvps.length})</span>
                </h4>

                {rsvps.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                    No RSVPs submitted for this invitation yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-3">Guest Name</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Count</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Dietary / Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {rsvps.map(r => (
                          <tr key={r.id}>
                            <td className="p-3 font-semibold text-slate-900">{r.guestName}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.attendance === 'attending'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {r.attendance}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-700">{r.guestCount || 0}</td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">
                              {r.guestPhone || r.guestEmail || '-'}
                            </td>
                            <td className="p-3 text-slate-600 text-[11px] max-w-xs truncate">
                              {r.dietaryPreferences || r.message || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Guestbook Messages */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Guestbook Wishes ({guestbook.length})</span>
                </h4>

                {guestbook.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                    No guestbook wishes recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {guestbook.map(msg => (
                      <div key={msg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{msg.senderName} ({msg.relationship})</span>
                          <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-600 italic font-normal">"{msg.message}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
