import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, AdminStats } from '../types';
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
  AlertTriangle
} from 'lucide-react';

interface AdminPageProps {
  onBackToDashboard: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToDashboard }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create User Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newMaxInvitations, setNewMaxInvitations] = useState(50);
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Reset Password Modal
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminStats()
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newBusinessName.trim()) return;

    setCreateError('');
    setIsCreating(true);
    try {
      await api.createAdminUser({
        username: newUsername.trim(),
        password: newPassword.trim(),
        businessName: newBusinessName.trim(),
        role: 'business_owner',
        maxInvitations: Number(newMaxInvitations)
      });

      setIsCreateModalOpen(false);
      setNewUsername('');
      setNewPassword('');
      setNewBusinessName('');
      loadData();
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create business account');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await api.updateAdminUser(user.id, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !newResetPassword.trim()) return;

    setIsResetting(true);
    try {
      await api.resetAdminUserPassword(targetUser.id, newResetPassword.trim());
      setTargetUser(null);
      setNewResetPassword('');
      alert(`Password successfully updated for ${targetUser.username}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this business user account? All their invitations and data will be removed.')) return;
    try {
      await api.deleteAdminUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio</span>
          </button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-slate-900">Super Admin Center</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Business Account</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* Banner Alert about Strict Auth Rule */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200/90 flex items-start gap-3 text-slate-700 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 text-slate-800 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">Strict Authentication Policy Enforced: </span>
            Public self-signup is disabled by design. Only administrators can issue login accounts, set passwords, and grant software licenses to invitation card printing and design businesses.
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Business Clients</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{stats?.totalUsers || users.length}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-emerald-700">Active Accounts</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{stats?.activeUsers || 0}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-amber-700">Total Invitations Built</div>
            <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{stats?.totalInvitations || 0}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-indigo-700">Total RSVPs Logged</div>
            <div className="text-2xl font-bold font-mono text-indigo-700 mt-1">{stats?.totalRSVPs || 0}</div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Business Accounts & Licenses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage business owner credentials, activate/deactivate accounts, and adjust invitation limits.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Business Name</th>
                  <th className="p-3.5">Username</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Quota Limit</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{u.businessName}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">{u.username}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{u.isActive ? 'Active' : 'Deactivated'}</span>
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">{u.maxInvitations || 50}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setTargetUser(u)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                        title="Reset User Password"
                      >
                        <KeyRound className="w-3.5 h-3.5 inline text-slate-500" />
                        <span className="ml-1 text-[10px] font-semibold">Reset PWD</span>
                      </button>

                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE BUSINESS ACCOUNT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Admin Provisioning
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
                Create Business Account
              </h3>
            </div>

            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 mb-3">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Business / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Prints Studio"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Assigned Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. royalprints"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Assigned Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Max Invitations Limit</label>
                <input
                  type="number"
                  value={newMaxInvitations}
                  onChange={(e) => setNewMaxInvitations(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer mt-4"
              >
                {isCreating ? 'Provisioning Account...' : 'Provision & Save Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900">
            <button
              type="button"
              onClick={() => setTargetUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Credentials Update
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 tracking-tight">
                Reset Password for {targetUser.username}
              </h3>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-900 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer mt-3"
              >
                {isResetting ? 'Updating...' : 'Confirm Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
