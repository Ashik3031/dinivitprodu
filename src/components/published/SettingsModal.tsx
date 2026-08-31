import React, { useState } from 'react';
import { Invitation } from '../../types';
import { STOCK_AUDIO } from '../../data/stockAssets';
import {
  X,
  Settings,
  Mail,
  Music,
  Sparkles,
  Sliders,
  Volume2,
  Check,
  Clock,
  Calendar,
  MapPin,
  ListOrdered,
  Image as ImageIcon,
  MessageSquare,
  HeartHandshake
} from 'lucide-react';

interface SettingsModalProps {
  invitation: Invitation;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Invitation>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  invitation,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'features' | 'opening' | 'music'>('features');

  if (!isOpen) return null;

  const openingScreen = invitation.openingScreen || {
    enabled: true,
    style: 'envelope-wax-seal',
    title: 'You are invited',
    subtitle: 'To celebrate the wedding of',
    coupleNames: 'Alexander & Sophia',
    envelopeColor: '#0e261d',
    sealColor: '#d4af37',
    openButtonText: 'Tap to Open'
  };

  const music = invitation.music || {
    enabled: true,
    audioUrl: STOCK_AUDIO[0].url,
    title: STOCK_AUDIO[0].name,
    autoPlay: true,
    loop: true
  };

  const settings = invitation.settings || {};

  const handleToggleFeature = (key: string, value: boolean) => {
    const updatedSettings = {
      ...settings,
      [key]: value
    };
    // Keep allowRSVP / allowGuestComments in sync
    if (key === 'enableRSVP') {
      updatedSettings.allowRSVP = value;
    }
    if (key === 'enableGuestbook') {
      updatedSettings.allowGuestComments = value;
    }
    onUpdate({ settings: updatedSettings });
  };

  const featuresList = [
    {
      id: 'enableCountdown',
      title: 'Countdown Timer',
      description: 'Days, hours, minutes, and seconds countdown to the event start',
      icon: Clock,
      checked: settings.enableCountdown !== false,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'enableCalendar',
      title: 'Interactive Calendar',
      description: 'Automatically highlights celebration date and provides Google Calendar / iCal export',
      icon: Calendar,
      checked: settings.enableCalendar !== false,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'enableMap',
      title: 'Map & Turn-by-Turn Directions',
      description: 'Displays venue location map with one-tap directions navigation',
      icon: MapPin,
      checked: settings.enableMap !== false,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'enableTimeline',
      title: 'Timeline & Order of Events',
      description: 'Milestone timeline with customizable icons, time, and descriptions',
      icon: ListOrdered,
      checked: settings.enableTimeline !== false,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'enableGallery',
      title: 'Photo Gallery & Lightbox',
      description: 'Grid, masonry, and slider carousel views with full-screen zoom lightbox',
      icon: ImageIcon,
      checked: settings.enableGallery !== false,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'enableGuestbook',
      title: 'Guestbook & Wishes Board',
      description: 'Allows invited guests to leave heartfelt blessings and messages',
      icon: MessageSquare,
      checked: (settings.enableGuestbook !== false) && (settings.allowGuestComments !== false),
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'enableRSVP',
      title: 'RSVP Confirmation System',
      description: 'Collects attendance, guest headcounts, and celebratory notes from invitees',
      icon: HeartHandshake,
      checked: (settings.enableRSVP !== false) && (settings.allowRSVP !== false),
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Invitation Control Center
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            Features & Experience Settings
          </h3>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'features' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Interactive Features</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('opening')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'opening' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Opening Screen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('music')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'music' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Audio & Music</span>
          </button>
        </div>

        {/* Tab 1: Interactive Features */}
        {activeTab === 'features' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 mb-2">
              Enable or disable interactive invitation modules. Disabled features will be gracefully hidden from invited guests.
            </div>

            <div className="space-y-2.5">
              {featuresList.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.id}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
                      feat.checked
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-3">
                      <div className={`p-2 rounded-xl border ${feat.color} flex-shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              feat.checked
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {feat.checked ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={feat.checked}
                        onChange={(e) => handleToggleFeature(feat.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Opening Screen */}
        {activeTab === 'opening' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Enable Opening Screen</div>
                <div className="text-[11px] text-slate-500">
                  Shows the wax seal envelope animation before revealing the invitation
                </div>
              </div>
              <input
                type="checkbox"
                checked={openingScreen.enabled}
                onChange={(e) => onUpdate({
                  openingScreen: { ...openingScreen, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-slate-900 cursor-pointer"
              />
            </div>

            {openingScreen.enabled && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Top Heading</label>
                  <input
                    type="text"
                    value={openingScreen.title}
                    onChange={(e) => onUpdate({
                      openingScreen: { ...openingScreen, title: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={openingScreen.subtitle || ''}
                    onChange={(e) => onUpdate({
                      openingScreen: { ...openingScreen, subtitle: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Couple Names / Monogram</label>
                  <input
                    type="text"
                    value={openingScreen.coupleNames}
                    onChange={(e) => onUpdate({
                      openingScreen: { ...openingScreen, coupleNames: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-700 font-medium block mb-1">Card Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={openingScreen.envelopeColor || '#0e261d'}
                        onChange={(e) => onUpdate({
                          openingScreen: { ...openingScreen, envelopeColor: e.target.value }
                        })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-600">{openingScreen.envelopeColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 font-medium block mb-1">Wax Seal Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={openingScreen.sealColor || '#d4af37'}
                        onChange={(e) => onUpdate({
                          openingScreen: { ...openingScreen, sealColor: e.target.value }
                        })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-600">{openingScreen.sealColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={openingScreen.openButtonText}
                    onChange={(e) => onUpdate({
                      openingScreen: { ...openingScreen, openButtonText: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Background Music */}
        {activeTab === 'music' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Enable Background Audio</div>
                <div className="text-[11px] text-slate-500">
                  Plays background music with a floating control badge
                </div>
              </div>
              <input
                type="checkbox"
                checked={music.enabled}
                onChange={(e) => onUpdate({
                  music: { ...music, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-slate-900 cursor-pointer"
              />
            </div>

            {music.enabled && (
              <div className="space-y-3">
                <label className="text-xs text-slate-700 font-medium block">
                  Select Music Preset or Custom MP3 URL
                </label>

                <div className="space-y-2">
                  {STOCK_AUDIO.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => onUpdate({
                        music: { ...music, audioUrl: track.url, title: track.name }
                      })}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        music.audioUrl === track.url
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-xs">{track.name}</span>
                      </div>
                      {music.audioUrl === track.url && <Check className="w-4 h-4 text-white" />}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-600 block mb-1">Or Custom Audio URL (.mp3)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/song.mp3"
                    value={music.audioUrl || ''}
                    onChange={(e) => onUpdate({
                      music: { ...music, audioUrl: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
