import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  KeyRound,
  Building2,
  Sliders,
  Check,
  Upload,
  AlertCircle,
  Loader2,
  Shield,
  Palette,
  Type,
  Globe,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'security' | 'branding' | 'defaults';

const POPULAR_FONTS = [
  'Playfair Display',
  'Cinzel',
  'Great Vibes',
  'Montserrat',
  'Cormorant Garamond',
  'Prata',
  'Alex Brush',
  'Lora',
  'Italiana',
  'Bodoni Moda',
  'Inter',
  'Plus Jakarta Sans'
];

const PRESET_COLORS = [
  '#d4af37', // Gold
  '#b8860b', // Dark Gold
  '#991b1b', // Royal Maroon
  '#1e3a8a', // Deep Navy
  '#065f46', // Emerald
  '#701a75', // Royal Plum
  '#312e81', // Indigo
  '#1e293b', // Slate Charcoal
  '#be185d', // Rose Magenta
  '#0f172a'  // Midnight
];

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserLocal, refreshUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Branding Form State
  const [brandColor, setBrandColor] = useState('#d4af37');
  const [secondaryColor, setSecondaryColor] = useState('#1e293b');
  const [logoUrl, setLogoUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  // Defaults Form State
  const [defaultFontHeading, setDefaultFontHeading] = useState('Playfair Display');
  const [defaultFontBody, setDefaultFontBody] = useState('Montserrat');
  const [defaultFooterText, setDefaultFooterText] = useState('');
  const [defaultWatermark, setDefaultWatermark] = useState(false);

  // Initialize values when modal opens or user updates
  useEffect(() => {
    if (user) {
      setOwnerName(user.ownerName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBusinessName(user.businessName || '');
      setBrandColor(user.brandColor || '#d4af37');
      setSecondaryColor(user.secondaryColor || '#1e293b');
      setLogoUrl(user.logoUrl || '');
      setCustomDomain(user.customDomain || '');
      setDefaultFontHeading(user.defaultFontHeading || 'Playfair Display');
      setDefaultFontBody(user.defaultFontBody || 'Montserrat');
      setDefaultFooterText(user.defaultFooterText || `Crafted by ${user.businessName}`);
      setDefaultWatermark(user.defaultWatermark || false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Handle Logo Upload (Base64 file reader)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setLogoUrl(event.target.result);
        toast.success('Logo uploaded! Click "Save Branding" to apply changes.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !email.trim()) {
      toast.error('Owner name and email are mandatory.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await api.updateProfile({
        ownerName,
        email,
        phone,
        businessName
      });
      updateUserLocal({ ownerName, email, phone, businessName });
      toast.success(res.message || 'Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please provide your current password');
      return;
    }
    if (newPassword.length < 5) {
      toast.error('New password must be at least 5 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      toast.success(res.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Branding Changes
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateBranding({
        businessName,
        logoUrl,
        brandColor,
        secondaryColor,
        customDomain,
        defaultFontHeading,
        defaultFontBody,
        defaultFooterText,
        defaultWatermark
      });
      updateUserLocal({
        businessName,
        logoUrl,
        brandColor,
        secondaryColor,
        customDomain,
        defaultFontHeading,
        defaultFontBody,
        defaultFooterText,
        defaultWatermark
      });
      toast.success(res.message || 'Branding & preferences saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update branding');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="user-settings-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSaving) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Studio Settings & Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your credentials, business branding, and invitation defaults
              </p>
            </div>
            <button
              id="btn-close-settings"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto">
            <button
              id="tab-settings-profile"
              onClick={() => setActiveTab('profile')}
              className={`py-3.5 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>

            <button
              id="tab-settings-branding"
              onClick={() => setActiveTab('branding')}
              className={`py-3.5 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Business & Brand
            </button>

            <button
              id="tab-settings-defaults"
              onClick={() => setActiveTab('defaults')}
              className={`py-3.5 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'defaults'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Invitation Defaults
            </button>

            <button
              id="tab-settings-security"
              onClick={() => setActiveTab('security')}
              className={`py-3.5 px-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* TAB 1: Profile Details */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                      {user.ownerName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        @{user.username}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        Role: <span className="font-medium text-indigo-600 dark:text-indigo-400">{user.role === 'admin' ? 'Super Administrator' : 'Licensed Studio Owner'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Active Account
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Owner / Contact Full Name *
                    </label>
                    <input
                      id="input-profile-name"
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Business / Studio Name *
                    </label>
                    <input
                      id="input-profile-business"
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Official Email Address *
                    </label>
                    <input
                      id="input-profile-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Contact Phone / WhatsApp
                    </label>
                    <input
                      id="input-profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    id="btn-save-profile"
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Business & Brand */}
            {activeTab === 'branding' && (
              <form onSubmit={handleSaveBranding} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Studio Brand Logo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <label
                          id="btn-upload-logo-file"
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Logo File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        {logoUrl && (
                          <button
                            id="btn-remove-logo"
                            type="button"
                            onClick={() => setLogoUrl('')}
                            className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Supports PNG, JPG, SVG, WebP. Recommended transparent background (min 200x200px).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Brand Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      Primary Brand Color (Accent)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-10 h-10 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                      />
                    </div>
                    {/* Preset Swatches */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PRESET_COLORS.slice(0, 5).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBrandColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${brandColor === c ? 'ring-2 ring-indigo-500 scale-105' : ''}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      Secondary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
                      />
                    </div>
                    {/* Preset Swatches */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PRESET_COLORS.slice(5).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSecondaryColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${secondaryColor === c ? 'ring-2 ring-indigo-500 scale-105' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Custom Vanity Subdomain / Website URL
                  </label>
                  <div className="relative">
                    <input
                      id="input-custom-domain"
                      type="text"
                      placeholder="e.g. invites.royalvows.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Allows linking your studio CNAME to custom invitation domain paths.
                  </p>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    id="btn-save-branding"
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Branding Identity
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: Invitation Defaults */}
            {activeTab === 'defaults' && (
              <form onSubmit={handleSaveBranding} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-indigo-600" />
                      Default Heading Font
                    </label>
                    <select
                      id="select-default-heading-font"
                      value={defaultFontHeading}
                      onChange={(e) => setDefaultFontHeading(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {POPULAR_FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-indigo-600" />
                      Default Body Font
                    </label>
                    <select
                      id="select-default-body-font"
                      value={defaultFontBody}
                      onChange={(e) => setDefaultFontBody(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {POPULAR_FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Default Footer & Copyright Attribution
                  </label>
                  <input
                    id="input-default-footer"
                    type="text"
                    value={defaultFooterText}
                    onChange={(e) => setDefaultFooterText(e.target.value)}
                    placeholder="e.g. Crafted with elegance by Royal Vows Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Include Studio Watermark Badge
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Displays a subtle studio logo & link at the bottom of published guest invitation cards
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="toggle-default-watermark"
                      type="checkbox"
                      checked={defaultWatermark}
                      onChange={(e) => setDefaultWatermark(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    id="btn-save-defaults"
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Studio Defaults
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: Change Password */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    Changing your password will encrypt your new credentials using standard salted bcrypt hashes.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Password *
                  </label>
                  <input
                    id="input-current-password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password *
                  </label>
                  <input
                    id="input-new-password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 5 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    id="input-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    id="btn-submit-change-password"
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
