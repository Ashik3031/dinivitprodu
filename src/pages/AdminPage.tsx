import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { User, AdminStats } from '../types';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  ShieldAlert,
  UserPlus,
  KeyRound,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowLeft,
  Search,
  Building,
  Lock,
  Layers,
  Users,
  X,
  Sparkles,
  AlertTriangle,
  Edit2,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Globe,
  Palette,
  Copy,
  Check,
  Filter,
  BarChart3,
  HardDrive,
  MessageSquare,
  UserCheck,
  UserX,
  Send,
  Loader2,
  Crop
} from 'lucide-react';
import { AdminTemplateManager } from '../components/admin/AdminTemplateManager';
import { AdminAssetManager } from '../components/admin/AdminAssetManager';

interface AdminPageProps {
  onBackToDashboard: () => void;
  onEditTemplate?: (templateId: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToDashboard, onEditTemplate }) => {
  const toast = useToast();

  const [adminTab, setAdminTab] = useState<'templates' | 'assets' | 'users'>('templates');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'business' | 'admin'>('all');

  // Create User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    role: 'business' as 'business' | 'admin',
    maxInvitations: 50,
    brandColor: '#d4af37',
    customDomain: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    role: 'business' as 'business' | 'admin',
    maxInvitations: 50,
    brandColor: '#d4af37',
    customDomain: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Reset Password Modal State
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Confirmation Dialog States
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusToggleUser, setStatusToggleUser] = useState<User | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminStats()
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load administrator data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.businessName?.toLowerCase().includes(q) ||
        u.ownerName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.isActive) ||
        (statusFilter === 'inactive' && !u.isActive);

      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' && u.role === 'admin') ||
        (roleFilter === 'business' && u.role !== 'admin');

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Generate a random secure password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.username.trim() || !createForm.password.trim() || !createForm.businessName.trim() || !createForm.email.trim()) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await api.createAdminUser({
        username: createForm.username.trim(),
        password: createForm.password.trim(),
        businessName: createForm.businessName.trim(),
        ownerName: createForm.ownerName.trim() || createForm.businessName.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim(),
        role: createForm.role,
        maxInvitations: Number(createForm.maxInvitations),
        brandColor: createForm.brandColor,
        customDomain: createForm.customDomain.trim()
      });

      toast.success(res.message || `Account created for "${createForm.businessName}"`);
      setIsCreateModalOpen(false);
      setCreateForm({
        username: '',
        password: '',
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        role: 'business',
        maxInvitations: 50,
        brandColor: '#d4af37',
        customDomain: ''
      });
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create business account');
    } finally {
      setIsCreating(false);
    }
  };

  // Open Edit User Modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      businessName: user.businessName || '',
      ownerName: user.ownerName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role === 'admin' ? 'admin' : 'business',
      maxInvitations: user.maxInvitations || 50,
      brandColor: user.brandColor || '#d4af37',
      customDomain: user.customDomain || ''
    });
  };

  // Save Edit User
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editForm.businessName.trim() || !editForm.ownerName.trim() || !editForm.email.trim()) {
      toast.error('Business name, owner name, and email are required.');
      return;
    }

    setIsEditing(true);
    try {
      const res = await api.updateAdminUser(editingUser.id, {
        businessName: editForm.businessName.trim(),
        ownerName: editForm.ownerName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        role: editForm.role,
        maxInvitations: Number(editForm.maxInvitations),
        brandColor: editForm.brandColor,
        customDomain: editForm.customDomain.trim()
      });

      toast.success(res.message || 'User account updated successfully');
      setEditingUser(null);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update user');
    } finally {
      setIsEditing(false);
    }
  };

  // Toggle Account Active / Deactive
  const confirmToggleStatus = async () => {
    if (!statusToggleUser) return;
    setIsTogglingStatus(true);
    try {
      const newStatus = !statusToggleUser.isActive;
      const res = await api.toggleUserStatus(statusToggleUser.id, newStatus);
      toast.success(res.message || `Account ${newStatus ? 'activated' : 'deactivated'}`);
      setUsers(prev => prev.map(u => u.id === statusToggleUser.id ? { ...u, isActive: newStatus } : u));
      setStatusToggleUser(null);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to change account status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Reset Password Action
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !newResetPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }

    setIsResetting(true);
    try {
      const res = await api.resetAdminUserPassword(resetTargetUser.id, newResetPassword.trim());
      toast.success(res.message || `Password reset for ${resetTargetUser.username}`);
      setResetTargetUser(null);
      setNewResetPassword('');
      setCopiedPassword(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  // Delete User Action
  const confirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    try {
      await api.deleteAdminUser(deleteConfirmUser.id);
      toast.success(`Account for "${deleteConfirmUser.businessName}" deleted`);
      setUsers(prev => prev.filter(u => u.id !== deleteConfirmUser.id));
      setDeleteConfirmUser(null);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy password helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPassword(true);
    toast.info('Password copied to clipboard');
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              id="btn-admin-back-dashboard"
              onClick={onBackToDashboard}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Studio</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Super Administrator Center
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  Multi-Tenant Studio Licensing & Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-admin-refresh"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="btn-admin-create-user"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision Client Account</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800">
            <button
              id="btn-admin-tab-templates"
              type="button"
              onClick={() => setAdminTab('templates')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                adminTab === 'templates'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Template Library</span>
            </button>

            <button
              id="btn-admin-tab-assets"
              type="button"
              onClick={() => setAdminTab('assets')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                adminTab === 'assets'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Crop className="w-4 h-4" />
              <span>Frames & Assets</span>
            </button>

            <button
              id="btn-admin-tab-users"
              type="button"
              onClick={() => setAdminTab('users')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                adminTab === 'users'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Studios & Accounts ({users.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Template Library Management */}
        {adminTab === 'templates' && <AdminTemplateManager onEditTemplate={onEditTemplate} />}

        {/* Tab 2: Public Assets & Frames Management */}
        {adminTab === 'assets' && <AdminAssetManager />}

        {/* Tab 3: System Overview & Studios Management */}
        {adminTab === 'users' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Platform Live Metrics
              </h2>
              <span className="text-xs text-slate-400">
                Live Database Synchronization
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Card 1: Total Businesses */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>Studios</span>
                  <Building className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.totalBusinesses ?? '--'}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    {stats?.activeBusinesses ?? 0} active licensed
                  </div>
                </div>
              </div>

              {/* Card 2: Total Invitations */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>Total Cards</span>
                  <Layers className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.totalInvitations ?? '--'}
                  </div>
                  <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
                    {stats?.publishedInvitations ?? 0} published live
                  </div>
                </div>
              </div>

              {/* Card 3: Guest Views */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>Guest Views</span>
                  <Eye className="w-4 h-4 text-amber-500" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.totalViews?.toLocaleString() ?? '--'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Global impressions
                  </div>
                </div>
              </div>

              {/* Card 4: RSVPs Logged */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>RSVP Responses</span>
                  <Send className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.totalRSVPs ?? '--'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Recorded submissions
                  </div>
                </div>
              </div>

              {/* Card 5: Guestbook Messages */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>Guestbook</span>
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.totalGuestbookMessages ?? '--'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Wishes & blessings
                  </div>
                </div>
              </div>

              {/* Card 6: Media Storage */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                  <span>Media Assets</span>
                  <HardDrive className="w-4 h-4 text-rose-500" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats?.totalMedia ?? '--'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {stats?.storageUsedBytes ? `${(stats.storageUsedBytes / (1024 * 1024)).toFixed(1)} MB` : 'Cloud assets'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Client Management Table Section */}
        {adminTab === 'users' && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Header & Controls */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Licensed Business Accounts ({filteredUsers.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage accounts, quota limits, domain slugs, and credentials
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-admin-search-users"
                  type="text"
                  placeholder="Search studio, user, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                id="select-admin-filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Accounts</option>
                <option value="inactive">Deactivated</option>
              </select>

              <select
                id="select-admin-filter-role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="business">Business Owners</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
                <p className="text-sm font-medium">Loading studio accounts...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Building className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No accounts match criteria</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try adjusting your search terms or filters above
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Studio & Owner</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Cards / Quota</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal">
                  {filteredUsers.map((u) => {
                    const isSuperAdmin = u.role === 'admin';
                    const publishedCount = u.publishedCount ?? 0;
                    const totalCount = u.invitationCount ?? 0;

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Studio & Owner */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              style={{ backgroundColor: u.brandColor || '#4f46e5' }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                            >
                              {u.businessName?.charAt(0) || u.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <span>{u.businessName}</span>
                                {u.customDomain && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    {u.customDomain}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span>{u.ownerName}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="font-mono text-indigo-600 dark:text-indigo-400">@{u.username}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a href={`mailto:${u.email}`} className="hover:underline">{u.email}</a>
                            </div>
                            {u.phone && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{u.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Cards / Quota */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {totalCount} <span className="text-xs text-slate-400 font-normal">/ {u.maxInvitations || 50}</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            {publishedCount} live published
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-4">
                          <button
                            id={`btn-toggle-status-${u.id}`}
                            disabled={isSuperAdmin}
                            onClick={() => setStatusToggleUser(u)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              u.isActive
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-300'
                            } ${isSuperAdmin ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                          >
                            {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </button>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize ${
                              isSuperAdmin
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}
                          >
                            {isSuperAdmin ? 'Master Admin' : 'Studio Client'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`btn-edit-user-${u.id}`}
                              onClick={() => openEditModal(u)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Client Information"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              id={`btn-reset-pass-${u.id}`}
                              onClick={() => {
                                setResetTargetUser(u);
                                setNewResetPassword(generateRandomPassword());
                              }}
                              className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Reset Password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {!isSuperAdmin && (
                              <button
                                id={`btn-delete-user-${u.id}`}
                                onClick={() => setDeleteConfirmUser(u)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Delete Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
        )}
      </main>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  Provision New Studio Account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Issue software license & credentials for a printing/design business
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Business / Studio Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Vows Invitations"
                    value={createForm.businessName}
                    onChange={(e) => setCreateForm({ ...createForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arthur Pendelton"
                    value={createForm.ownerName}
                    onChange={(e) => setCreateForm({ ...createForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Login Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. royal_prints"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Temporary Password *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. pass123"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, password: generateRandomPassword() })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 text-xs font-semibold"
                      title="Generate Random Password"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@business.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invitation Quota (Max)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={createForm.maxInvitations}
                    onChange={(e) => setCreateForm({ ...createForm, maxInvitations: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Role
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="business">Business Studio Client</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-indigo-600" />
                  Edit Studio Account ({editingUser.username})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update client details and account parameters
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.ownerName}
                    onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Invitation Quota
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={editForm.maxInvitations}
                    onChange={(e) => setEditForm({ ...editForm, maxInvitations: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editForm.brandColor}
                      onChange={(e) => setEditForm({ ...editForm, brandColor: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editForm.brandColor}
                      onChange={(e) => setEditForm({ ...editForm, brandColor: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Domain CNAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. cards.mystudio.com"
                  value={editForm.customDomain}
                  onChange={(e) => setEditForm({ ...editForm, customDomain: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isEditing}
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  Reset Client Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target Account: <span className="font-semibold text-slate-800 dark:text-slate-200">{resetTargetUser.businessName}</span> (@{resetTargetUser.username})
                </p>
              </div>
              <button
                onClick={() => setResetTargetUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Salted Password *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    className="w-full pl-3 pr-20 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNewResetPassword(generateRandomPassword())}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Generate new password"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newResetPassword)}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                      title="Copy to clipboard"
                    >
                      {copiedPassword ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                Remember to securely deliver these temporary credentials to the business owner.
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Apply New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS TOGGLE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!statusToggleUser}
        title={statusToggleUser?.isActive ? 'Deactivate Client Account?' : 'Reactivate Client Account?'}
        message={
          statusToggleUser?.isActive
            ? `Deactivating "${statusToggleUser.businessName}" will immediately block their team from logging in or creating new digital invitations. Existing published links will remain intact.`
            : `Reactivating "${statusToggleUser?.businessName}" will restore full access to their Studio dashboard.`
        }
        confirmText={statusToggleUser?.isActive ? 'Deactivate Account' : 'Activate Account'}
        confirmVariant={statusToggleUser?.isActive ? 'warning' : 'primary'}
        isLoading={isTogglingStatus}
        onConfirm={confirmToggleStatus}
        onCancel={() => setStatusToggleUser(null)}
      />

      {/* DELETE USER CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteConfirmUser}
        title={`Delete Account "${deleteConfirmUser?.businessName}"?`}
        message={
          <div>
            <p className="mb-2">
              Are you sure you want to permanently delete the account for <strong className="text-slate-900 dark:text-white">{deleteConfirmUser?.businessName}</strong>?
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-medium">
              This action cannot be undone. All invitations, guest RSVPs, and uploaded media associated with this business will be removed.
            </p>
          </div>
        }
        confirmText="Permanently Delete Account"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteConfirmUser(null)}
      />
    </div>
  );
};
