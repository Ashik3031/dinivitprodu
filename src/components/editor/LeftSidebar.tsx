import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Box,
  LayoutTemplate,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
  Type,
  Heading,
  Clock,
  Calendar,
  Heart,
  MapPin,
  Music,
  Share2,
  QrCode,
  Sliders,
  Send,
  MessageCircle,
  Shapes,
  Upload,
  Check,
  Wand2,
  MailOpen,
  Shirt,
  Gift,
  Plane,
  Search,
  X,
  Video
} from 'lucide-react';
import {
  InvitationPage,
  CanvasElement,
  ElementType,
  ContainerShape,
  InvitationTemplate,
  PrebuiltBlock,
  TemplateCategory,
  InvitationTheme,
  OpeningScreenConfig,
  OuterDropEffectType
} from '../../types';
import { STOCK_ASSETS } from '../../data/stockAssets';
import { TEMPLATE_CATEGORIES } from '../../data/templates';
import { api } from '../../services/api';

import { PagesTab } from './PagesTab';
import { MediaLibraryView } from '../media/MediaLibraryView';

interface LeftSidebarProps {
  pages: InvitationPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: (fromTemplate?: boolean) => void;
  onAddBlankPage: () => void;
  onOpenTemplatesModal: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onRenamePage: (index: number, newName: string) => void;
  onReorderPages: (fromIndex: number, toIndex: number) => void;
  onAddElement: (type: ElementType, customProps?: Partial<CanvasElement>, parentId?: string | null) => void;
  onInsertBlock?: (block: PrebuiltBlock) => void;
  blocks?: PrebuiltBlock[];
  templates: InvitationTemplate[];
  onApplyTemplate: (template: InvitationTemplate) => void;
  onInsertTemplatePage: (templatePage: InvitationPage) => void;
  selectedElement?: CanvasElement | null;
  currentInvitationId?: string;
  businessId?: string;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onSetAsBackground?: (url: string, type: 'image' | 'video') => void;
  onSetAsMusic?: (audioUrl: string, title: string) => void;
  openingScreen?: any;
  onSelectOpeningScreen?: () => void;
  onToggleOpeningScreen?: (enabled: boolean) => void;
  currentMusicUrl?: string;
  theme?: InvitationTheme;
  onUpdateTheme?: (updates: Partial<InvitationTheme>) => void;
  openingScreenConfig?: OpeningScreenConfig;
  onUpdateOpeningScreen?: (updates: Partial<OpeningScreenConfig>) => void;
  onSelectCanvasDecorations?: () => void;
  isCanvasDecorationsActive?: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onAddBlankPage,
  onOpenTemplatesModal,
  onDuplicatePage,
  onDeletePage,
  onRenamePage,
  onReorderPages,
  onAddElement,
  onInsertBlock,
  blocks = [],
  templates,
  onApplyTemplate,
  onInsertTemplatePage,
  selectedElement,
  currentInvitationId,
  businessId,
  onUpdateElement,
  onSetAsBackground,
  onSetAsMusic,
  openingScreen,
  onSelectOpeningScreen,
  onToggleOpeningScreen,
  currentMusicUrl,
  theme,
  onUpdateTheme,
  openingScreenConfig,
  onUpdateOpeningScreen,
  onSelectCanvasDecorations,
  isCanvasDecorationsActive
}) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'elements' | 'blocks' | 'templates' | 'media' | 'ai'>('pages');
  const [elementSearchQuery, setElementSearchQuery] = useState('');
  const [targetContainerOnly, setTargetContainerOnly] = useState(false);
  const [selectedBlockCategory, setSelectedBlockCategory] = useState<TemplateCategory | 'all'>('all');

  const isContainerSelected = selectedElement?.type === 'container';
  const effectiveParentId = (isContainerSelected && targetContainerOnly) ? selectedElement.id : null;

  const handleAdd = (type: ElementType, customProps?: Partial<CanvasElement>) => {
    onAddElement(type, customProps, effectiveParentId);
  };

  // AI assistant state
  const [aiPromptType, setAiPromptType] = useState('invitation_intro');
  const [aiCoupleNames, setAiCoupleNames] = useState('');
  const [aiEventType, setAiEventType] = useState('Wedding');
  const [aiTone, setAiTone] = useState('Romantic and Luxury');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Filter media
  const [mediaCategory, setMediaCategory] = useState<string>('all');

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const text = await api.generateAICopy({
        promptType: aiPromptType,
        coupleNames: aiCoupleNames,
        eventType: aiEventType,
        tone: aiTone
      });
      setAiGeneratedText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleInsertAIText = () => {
    if (!aiGeneratedText) return;
    handleAdd('text', {
      content: { text: aiGeneratedText },
      style: {
        x: 30,
        y: 200,
        width: 330,
        height: 120,
        fontSize: 16,
        color: '#f9f6ee',
        textAlign: 'center',
        lineHeight: 1.6
      }
    });
  };

  const standardShapes: Array<{ name: string; shape: ContainerShape; desc: string; icon: string; defaultRadius?: number }> = [
    { name: 'Rectangle', shape: 'rectangle', desc: 'Standard box container', icon: '⏹' },
    { name: 'Rounded Rect', shape: 'rounded-rectangle', desc: 'Soft curved corners', icon: '🔲', defaultRadius: 24 },
    { name: 'Square', shape: 'square', desc: 'Equal 1:1 aspect block', icon: '⬛' },
    { name: 'Circle', shape: 'circle', desc: '100% circular silhouette', icon: '⭕' },
    { name: 'Oval', shape: 'oval', desc: 'Smooth elliptical frame', icon: '🥚' }
  ];

  const specialtyShapes: Array<{ name: string; shape: ContainerShape; desc: string; icon: string }> = [
    { name: 'Arch Window', shape: 'arch', desc: 'Cathedral arched frame', icon: '🏛' },
    { name: 'VIP Ticket', shape: 'ticket', desc: 'Ticket cutout notches', icon: '🎟' },
    { name: 'Diamond Crest', shape: 'diamond', desc: 'Faceted luxury crest', icon: '💎' },
    { name: 'Hexagon Badge', shape: 'hexagon', desc: 'Geometric honeycomb', icon: '⬡' },
    { name: 'Heart Frame', shape: 'heart', desc: 'Romantic heart silhouette', icon: '❤️' },
    { name: 'Scalloped Border', shape: 'scallop', desc: 'Vintage petal frame', icon: '🌸' }
  ];

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none z-30 text-slate-800">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50/80 p-1 text-center">
        {[
          { id: 'pages', label: 'Pages', icon: FileText },
          { id: 'elements', label: 'Elements', icon: Layers },
          { id: 'blocks', label: 'Blocks', icon: Box },
          { id: 'templates', label: 'Templates', icon: LayoutTemplate },
          { id: 'media', label: 'Media', icon: ImageIcon },
          { id: 'ai', label: 'AI Writer', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${isActive
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="truncate w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PAGES TAB */}
        {activeTab === 'pages' && (
          <PagesTab
            pages={pages}
            activePageIndex={activePageIndex}
            onSelectPage={onSelectPage}
            onAddBlankPage={onAddBlankPage}
            onOpenTemplatesModal={onOpenTemplatesModal}
            onDuplicatePage={onDuplicatePage}
            onDeletePage={onDeletePage}
            onRenamePage={onRenamePage}
            onReorderPages={onReorderPages}
            openingScreen={openingScreen}
            onSelectOpeningScreen={onSelectOpeningScreen}
            onToggleOpeningScreen={onToggleOpeningScreen}
          />
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (() => {
          const basicElementsList = [
            {
              id: 'text',
              label: 'Text / Heading',
              icon: <Type className="w-4 h-4 text-slate-600" />,
              onClick: () => onAddElement('text', {
                content: { text: 'Together with their families, we invite you to celebrate our union' },
                style: { x: 30, y: 180, width: 330, height: 60, fontSize: 15, color: '#334155', textAlign: 'center', lineHeight: 1.6 }
              })
            },
            {
              id: 'image',
              label: 'Photo / Image',
              icon: <ImageIcon className="w-4 h-4 text-slate-600" />,
              onClick: () => onAddElement('image', {
                content: { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', alt: 'Wedding Couple' },
                style: { x: 45, y: 180, width: 300, height: 280, borderRadius: 16 }
              })
            },
            {
              id: 'video',
              label: 'Video Clip',
              icon: <Video className="w-4 h-4 text-purple-600" />,
              onClick: () => onAddElement('video', {
                content: {
                  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-in-a-box-41589-large.mp4',
                  videoAutoplay: true,
                  videoLoop: true,
                  videoMuted: true
                },
                style: { x: 40, y: 160, width: 310, height: 220, borderRadius: 16 }
              })
            },
            {
              id: 'music',
              label: 'Background Music',
              icon: <Music className="w-4 h-4 text-amber-600" />,
              onClick: () => {
                setActiveTab('media');
                setMediaCategory('audio');
              }
            },
            {
              id: 'button',
              label: 'CTA Button',
              icon: <Send className="w-4 h-4 text-slate-600" />,
              onClick: () => onAddElement('button', {
                content: { buttonText: 'Confirm Attendance', buttonAction: 'rsvp', buttonShape: 'pill' },
                style: { x: 75, y: 350, width: 240, height: 48, backgroundColor: '#0f172a', color: '#ffffff', borderRadius: 24 }
              })
            },
            {
              id: 'icon',
              label: 'Vector Icon',
              icon: <Heart className="w-4 h-4 text-rose-500" />,
              onClick: () => onAddElement('icon', {
                content: { iconName: 'Heart', iconSize: 36, iconColor: '#e11d48' },
                style: { x: 165, y: 120, width: 60, height: 60 }
              })
            },
            {
              id: 'divider',
              label: 'Divider',
              icon: <Sliders className="w-4 h-4 text-slate-600" />,
              onClick: () => onAddElement('divider', {
                style: { x: 45, y: 250, width: 300, height: 20, dividerStyle: 'ornamental', borderColor: '#d4af37' }
              })
            },
            {
              id: 'shape',
              label: 'Vector Shape',
              icon: <Shapes className="w-4 h-4 text-amber-500" />,
              onClick: () => onAddElement('shape', {
                style: { x: 145, y: 200, width: 100, height: 100, shapeType: 'star', fillColor: '#d4af37' }
              })
            }
          ];

          const invitationElementsList = [
            {
              id: 'event-date',
              label: 'Event Date',
              icon: <Calendar className="w-4 h-4 text-amber-600" />,
              onClick: () => onAddElement('event-date', {
                content: { eventDate: 'Saturday, October 24, 2026', text: 'Celebration Date' },
                style: { x: 20, y: 160, width: 350, height: 80, fontSize: 20, color: '#0f172a' }
              })
            },
            {
              id: 'event-time',
              label: 'Event Time',
              icon: <Clock className="w-4 h-4 text-amber-600" />,
              onClick: () => onAddElement('event-time', {
                content: { eventTime: '04:00 PM – 10:00 PM', text: 'Reception Time' },
                style: { x: 20, y: 240, width: 350, height: 80, fontSize: 18, color: '#0f172a' }
              })
            },
            {
              id: 'countdown',
              label: 'Countdown',
              icon: <Clock className="w-4 h-4 text-slate-600" />,
              onClick: () => onAddElement('countdown', {
                content: { countdownTarget: '2026-10-24T16:00:00', countdownStyle: 'boxes' },
                style: { x: 25, y: 280, width: 340, height: 84 }
              })
            },
            {
              id: 'calendar',
              label: 'Calendar Sync',
              icon: <Calendar className="w-4 h-4 text-indigo-600" />,
              onClick: () => onAddElement('calendar', {
                content: {
                  eventDate: '2026-10-24',
                  calendarMonth: 'October',
                  calendarYear: 2026,
                  calendarDay: 24,
                  calendarShowAddToCal: true,
                  calendarEventTitle: 'Alexander & Sophia Wedding'
                },
                style: { x: 30, y: 150, width: 330, height: 260, backgroundColor: '#0f172a', borderRadius: 16 }
              })
            },
            {
              id: 'venue',
              label: 'Venue Info',
              icon: <MapPin className="w-4 h-4 text-amber-500" />,
              onClick: () => onAddElement('venue', {
                content: { venueName: 'The Grand Biltmore Ballroom', venueAddress: '1 Lodge St, Asheville, NC 28803' },
                style: { x: 25, y: 180, width: 340, height: 110 }
              })
            },
            {
              id: 'google-maps',
              label: 'Map Embed',
              icon: <MapPin className="w-4 h-4 text-emerald-600" />,
              onClick: () => onAddElement('google-maps', {
                content: { venueName: 'The Biltmore Estate', venueAddress: '1 Lodge St, Asheville, NC 28803', mapQuery: 'Biltmore+Estate', mapZoom: 14 },
                style: { x: 25, y: 200, width: 340, height: 190, borderRadius: 12 }
              })
            },
            {
              id: 'timeline',
              label: 'Timeline',
              icon: <Calendar className="w-4 h-4 text-slate-600" />,
              onClick: () => onAddElement('timeline', {
                content: {
                  timelineEvents: [
                    { time: '4:00 PM', title: 'Solemn Ceremony', description: 'Exchange of vows at garden' },
                    { time: '5:30 PM', title: 'Cocktail Hour', description: 'Canapés and fine wine' },
                    { time: '7:00 PM', title: 'Grand Banquet', description: 'Dinner, toasts and dancing' }
                  ]
                },
                style: { x: 25, y: 120, width: 340, height: 350, backgroundColor: '#0f172a', borderRadius: 16 }
              })
            },
            {
              id: 'photo-gallery',
              label: 'Photo Gallery',
              icon: <ImageIcon className="w-4 h-4 text-pink-500" />,
              onClick: () => onAddElement('photo-gallery', {
                content: {
                  galleryLayout: 'coverflow',
                  galleryImages: [
                    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: 'The Proposal' },
                    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', caption: 'Engagement Memories' },
                    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', caption: 'Forever & Always' },
                    { url: 'https://images.unsplash.com/photo-1519225429780-e37d8001712a?auto=format&fit=crop&w=800&q=80', caption: 'Celebration of Love' },
                    { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80', caption: 'Sacred Vows' }
                  ]
                },
                style: { x: 25, y: 140, width: 340, height: 290, borderRadius: 16 }
              })
            },
            {
              id: 'rsvp-form',
              label: 'RSVP Form',
              icon: <Check className="w-4 h-4 text-emerald-600" />,
              onClick: () => onAddElement('rsvp-form', {
                style: { x: 20, y: 150, width: 350, height: 250, borderRadius: 16 }
              })
            },
            {
              id: 'guestbook',
              label: 'Guestbook',
              icon: <MessageCircle className="w-4 h-4 text-indigo-500" />,
              onClick: () => onAddElement('guestbook', {
                style: { x: 20, y: 150, width: 350, height: 250, borderRadius: 16 }
              })
            },
            {
              id: 'whatsapp-button',
              label: 'WhatsApp RSVP',
              icon: <MessageCircle className="w-4 h-4 text-emerald-600" />,
              onClick: () => onAddElement('whatsapp-button', {
                content: { buttonText: 'RSVP via WhatsApp', whatsappPhone: '+1234567890', whatsappMessage: 'Hi! I am delighted to accept your wedding invitation!' },
                style: { x: 45, y: 250, width: 300, height: 46, borderRadius: 12 }
              })
            },
            {
              id: 'qr-code',
              label: 'QR Code',
              icon: <QrCode className="w-4 h-4 text-slate-700" />,
              onClick: () => onAddElement('qr-code', {
                content: { qrCodeValue: 'https://example.com', qrLabel: 'Scan for Details' },
                style: { x: 120, y: 220, width: 150, height: 165, borderRadius: 12 }
              })
            },
            {
              id: 'dress-code',
              label: 'Dress Code',
              icon: <Shirt className="w-4 h-4 text-purple-600" />,
              onClick: () => onAddElement('dress-code', {
                content: {
                  dressCodeTitle: 'Dress Code',
                  dressCodeType: 'Black Tie',
                  dressCodeDescription: 'Formal evening wear requested. Tuxedos and evening gowns.',
                  dressCodeColors: ['#000000', '#d4af37', '#ffffff']
                },
                style: { x: 25, y: 180, width: 340, height: 160, borderRadius: 16 }
              })
            },
            {
              id: 'gift-registry',
              label: 'Gift Registry',
              icon: <Gift className="w-4 h-4 text-amber-600" />,
              onClick: () => onAddElement('gift-registry', {
                content: {
                  giftRegistryTitle: 'Gift Registry',
                  giftRegistryDescription: 'Your presence is our greatest gift. Should you wish to honor us with a gift, our registries are linked below.',
                  giftRegistries: [
                    { name: 'Amazon Registry', url: 'https://amazon.com' },
                    { name: 'Honeyfund', url: 'https://honeyfund.com' }
                  ]
                },
                style: { x: 25, y: 180, width: 340, height: 180, borderRadius: 16 }
              })
            },
            {
              id: 'travel-accommodation',
              label: 'Travel & Accommodation',
              icon: <Plane className="w-4 h-4 text-sky-600" />,
              onClick: () => onAddElement('travel-accommodation', {
                content: {
                  travelTitle: 'Travel & Accommodations',
                  travelDescription: 'Room blocks have been reserved for our guests:',
                  accommodations: [
                    {
                      name: 'The Grand Luxury Hotel',
                      address: '100 Luxury Blvd, Asheville, NC',
                      bookingUrl: 'https://hotel.example.com',
                      rateCode: 'WEDDING2026'
                    }
                  ]
                },
                style: { x: 25, y: 160, width: 340, height: 210, borderRadius: 16 }
              })
            },
            {
              id: 'open-invitation-button',
              label: 'Open Button',
              icon: <MailOpen className="w-4 h-4 text-amber-600" />,
              onClick: () => onAddElement('button', {
                id: 'open-elem-button',
                name: 'Open Invitation Button',
                content: {
                  buttonText: openingScreen?.openButtonText || 'Open Invitation',
                  buttonAction: 'open-invitation',
                  buttonShape: 'pill'
                },
                style: {
                  x: 45,
                  y: 580,
                  width: 300,
                  height: 52,
                  backgroundColor: openingScreen?.sealColor || '#d4af37',
                  color: '#07120d',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 9999,
                  boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.4)',
                  letterSpacing: 1.5,
                  zIndex: 20
                },
                animation: {
                  type: 'bounce',
                  duration: 1.5,
                  delay: 0.6,
                  repeat: 'infinite'
                }
              })
            },
            {
              id: 'canvas-decorations',
              label: 'Canvas Decorations',
              icon: <Sparkles className="w-4 h-4 text-rose-500" />,
              isActive: isCanvasDecorationsActive,
              onClick: () => onSelectCanvasDecorations?.()
            }
          ];

          const normalizedQuery = elementSearchQuery.trim().toLowerCase();

          const filteredBasic = normalizedQuery
            ? basicElementsList.filter(el => el.label.toLowerCase().includes(normalizedQuery))
            : basicElementsList;

          const filteredInvitation = normalizedQuery
            ? invitationElementsList.filter(el => el.label.toLowerCase().includes(normalizedQuery))
            : invitationElementsList;

          const hasMatches = filteredBasic.length > 0 || filteredInvitation.length > 0;

          return (
            <div className="space-y-4">
              {/* Compact Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={elementSearchQuery}
                  onChange={(e) => setElementSearchQuery(e.target.value)}
                  placeholder="Search elements..."
                  className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
                {elementSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setElementSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {!hasMatches ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No elements found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No results matching "{elementSearchQuery}"</p>
                  <button
                    type="button"
                    onClick={() => setElementSearchQuery('')}
                    className="mt-3 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <>
                  {/* A. BASIC ELEMENTS */}
                  {filteredBasic.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Basic Elements</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {normalizedQuery ? `${filteredBasic.length} found` : '8 Core Types'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredBasic.map((el) => (
                          <button
                            key={el.id}
                            type="button"
                            onClick={el.onClick}
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200 text-slate-800 text-xs font-medium transition-all cursor-pointer text-left h-[42px] overflow-hidden group shadow-2xs"
                          >
                            <div className="shrink-0 group-hover:scale-110 transition-transform">{el.icon}</div>
                            <span className="truncate">{el.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* B. INVITATION ELEMENTS */}
                  {filteredInvitation.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Invitation Elements</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {normalizedQuery ? `${filteredInvitation.length} found` : '17 Event Modules'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredInvitation.map((el) => (
                          <button
                            key={el.id}
                            type="button"
                            onClick={el.onClick}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-all cursor-pointer text-left h-[42px] overflow-hidden group shadow-2xs ${el.isActive
                              ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold ring-1 ring-rose-400/50'
                              : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200 text-slate-800 font-medium'
                              }`}
                          >
                            <div className="shrink-0 group-hover:scale-110 transition-transform">{el.icon}</div>
                            <span className="truncate">{el.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* BLOCKS / CONTAINERS TAB */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            {/* Target Container Banner */}
            {isContainerSelected && (
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-950 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <Layers className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span className="truncate">Active: {selectedElement?.name || 'Selected Container'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTargetContainerOnly(!targetContainerOnly)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${targetContainerOnly
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-100'
                      }`}
                  >
                    {targetContainerOnly ? 'Nesting Inside' : 'Insert to Page'}
                  </button>
                </div>
                <div className="text-[10px] text-indigo-700">
                  {targetContainerOnly
                    ? 'New elements will be attached directly inside this container.'
                    : 'New blocks will be placed as top-level elements on the page canvas.'}
                </div>
              </div>
            )}

            {/* PREBUILT EDITABLE BLOCKS SECTION */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                <span>Prebuilt Section Blocks</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {blocks.filter((b) => selectedBlockCategory === 'all' || b.category === selectedBlockCategory).length} Blocks
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2.5">
                Insert styled, editable section blocks created by Admin into your active page canvas.
              </p>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
                {TEMPLATE_CATEGORIES.map((cat) => {
                  const isSelected = selectedBlockCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedBlockCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${isSelected
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Blocks Grid or Empty State */}
              {(() => {
                const currentFilteredBlocks = blocks.filter(
                  (b) => selectedBlockCategory === 'all' || b.category === selectedBlockCategory
                );

                if (currentFilteredBlocks.length === 0) {
                  return (
                    <div className="p-5 text-center rounded-xl bg-slate-50 border border-slate-200 my-2">
                      <Box className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-700">No Section Blocks Available</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                        Section blocks created by Admin will appear here for you to insert into your pages.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 mt-1">
                    {currentFilteredBlocks.map((block) => {
                      const isAdmin = block.isSuperAdmin || block.authorRole === 'admin' || block.authorRole === 'superadmin';
                      return (
                        <div
                          key={block.id}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all flex flex-col gap-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{block.name}</span>
                                {isAdmin ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                    👑 Admin
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                    {block.subcategory || block.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {block.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {block.elements?.length || 0} elements
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (onInsertBlock) {
                                  onInsertBlock(block);
                                }
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold cursor-pointer shadow-2xs transition-colors"
                            >
                              <Plus className="w-3 h-3 text-amber-400" />
                              <span>Insert Block</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Standard Container Shapes */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                <span>Core Container Shapes</span>
                <span className="text-[10px] text-slate-400 font-normal">Parent Blocks</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2.5">
                Add a shape container. Background media and child elements remain clipped inside.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {standardShapes.map((preset) => (
                  <div
                    key={preset.shape}
                    onClick={() => handleAdd('container', {
                      name: preset.name,
                      style: {
                        x: 35,
                        y: 150,
                        width: preset.shape === 'square' || preset.shape === 'circle' ? 280 : 320,
                        height: preset.shape === 'square' || preset.shape === 'circle' ? 280 : 300,
                        shape: preset.shape,
                        borderRadius: preset.defaultRadius || 0,
                        backgroundColor: '#f8fafc',
                        borderWidth: 1.5,
                        borderColor: '#cbd5e1',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        clipMask: true
                      }
                    })}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform text-slate-800 text-xl shadow-2xs">
                      {preset.icon}
                    </div>
                    <div className="text-xs font-semibold text-slate-900">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{preset.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialty Architectural Shapes */}
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Luxury Architectural Silhouettes
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {specialtyShapes.map((preset) => (
                  <button
                    key={preset.shape}
                    type="button"
                    onClick={() => handleAdd('container', {
                      name: preset.name,
                      style: {
                        x: 40,
                        y: 140,
                        width: 300,
                        height: 320,
                        shape: preset.shape,
                        backgroundColor: '#f8fafc',
                        borderWidth: 1.5,
                        borderColor: '#cbd5e1',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        clipMask: true
                      }
                    })}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center transition-all cursor-pointer flex flex-col items-center group"
                  >
                    <span className="text-lg leading-none mb-1 group-hover:scale-110 transition-transform">{preset.icon}</span>
                    <span className="text-[10px] font-medium text-slate-800 truncate w-full">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Invitation Templates ({templates.length})
            </div>
            {templates.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 my-2">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Templates Available</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                  Templates created by Admin or verified public shop templates will appear here.
                </p>
              </div>
            ) : (
              templates.map((tmpl) => {
                const isAdmin = tmpl.isSuperAdmin || tmpl.authorRole === 'admin' || tmpl.authorRole === 'superadmin';
                const isOwn = Boolean(businessId && tmpl.createdBy === businessId);
                return (
                  <div
                    key={tmpl.id}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-400 transition-colors shadow-xs"
                  >
                    <div className="relative">
                      <img
                        src={tmpl.thumbnail}
                        alt={tmpl.title}
                        className="w-full h-32 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        {isAdmin ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 shadow">
                            👑 Admin Template
                          </span>
                        ) : isOwn ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600 text-white shadow">
                            My Template
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow">
                            Verified Public
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{tmpl.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">{tmpl.pages?.length || 1} pgs</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        By {isAdmin ? 'System Admin' : tmpl.authorName || 'Shop'}
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => onApplyTemplate(tmpl)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Apply All ({tmpl.pages?.length || 1} Pages)
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="h-full flex flex-col">
            <MediaLibraryView
              key={mediaCategory}
              currentInvitationId={currentInvitationId}
              businessId={businessId}
              onAddElement={handleAdd}
              selectedElement={selectedElement}
              onUpdateElement={onUpdateElement}
              onSetAsBackground={onSetAsBackground}
              onSetAsMusic={onSetAsMusic}
              initialCategory={mediaCategory}
              currentMusicUrl={currentMusicUrl}
            />
          </div>
        )}

        {/* AI WRITER TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Copywriter Assistant</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Generate poetry, couple vows, formal invitations, dress code wording, and itineraries.
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-700 font-medium block mb-1">Content Type</label>
                <select
                  value={aiPromptType}
                  onChange={(e) => setAiPromptType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900"
                >
                  <option value="invitation_intro">Formal Invitation Announcement</option>
                  <option value="story">Our Love Story / Vows</option>
                  <option value="dress_code">Dress Code Description</option>
                  <option value="itinerary">Event Itinerary Schedule</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-700 font-medium block mb-1">Names / Celebrants</label>
                <input
                  type="text"
                  placeholder="e.g. Alexander & Sophia"
                  value={aiCoupleNames}
                  onChange={(e) => setAiCoupleNames(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-700 font-medium block mb-1">Tone & Atmosphere</label>
                <input
                  type="text"
                  placeholder="e.g. Romantic, Poetic, Luxury Royal"
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isGeneratingAI ? 'Crafting with AI...' : 'Generate Copy'}</span>
              </button>

              {aiGeneratedText && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                  <div className="text-xs text-slate-800 italic leading-relaxed whitespace-pre-wrap">
                    "{aiGeneratedText}"
                  </div>
                  <button
                    type="button"
                    onClick={handleInsertAIText}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Text onto Canvas</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
