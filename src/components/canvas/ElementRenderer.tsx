import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Heart,
  Music,
  Share2,
  ExternalLink,
  MessageCircle,
  QrCode,
  Sparkles,
  ChevronRight,
  Send,
  Check,
  User,
  Users,
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Navigation
} from 'lucide-react';
import { CanvasElement, AnimationConfig, ElementStyle, ViewportMode } from '../../types';
import { getElementMotionProps } from '../../utils/animationUtils';
import { resolveElementForViewport } from '../../utils/responsiveUtils';
import { ShapeMask } from './ShapeMask';
import { ShapeElement } from './elements/ShapeElement';
import { IconElement } from './elements/IconElement';
import { CalendarElement } from './elements/CalendarElement';
import { GalleryElement } from './elements/GalleryElement';
import { DividerElement } from './elements/DividerElement';
import { CountdownElement } from './elements/CountdownElement';
import { MapElement } from './elements/MapElement';
import { TimelineElement } from './elements/TimelineElement';
import { RSVPElement } from './elements/RSVPElement';
import { GuestbookElement } from './elements/GuestbookElement';
import QRCode from 'qrcode';

interface ElementRendererProps {
  element: CanvasElement;
  isEditor?: boolean;
  viewportMode?: ViewportMode;
  onActionClick?: (actionType: string, payload?: any) => void;
  onOpenRSVP?: () => void;
  onOpenGuestbook?: () => void;
  allElements?: CanvasElement[];
  onSelectElement?: (elementId: string) => void;
  selectedElementId?: string | null;
  previewKey?: number | string;
  forceAnimate?: boolean;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isEditor = false,
  viewportMode = 'mobile',
  onActionClick,
  onOpenRSVP,
  onOpenGuestbook,
  allElements = [],
  onSelectElement,
  selectedElementId,
  previewKey,
  forceAnimate = false
}) => {
  const { type, content, animation } = element;
  const { style, isHidden } = resolveElementForViewport(element, viewportMode);

  // If hidden on current device and not in editor mode, don't render
  if (isHidden && !isEditor) {
    return null;
  }

  // Countdown state
  const [countdownTime, setCountdownTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate Countdown
  useEffect(() => {
    if (type !== 'countdown' || !content.countdownTarget) return;

    const target = new Date(content.countdownTarget).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setCountdownTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCountdownTime({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [type, content.countdownTarget]);

  // Generate QR Code if needed
  useEffect(() => {
    if (type === 'qr-code') {
      const qrValue = content.qrCodeValue || window.location.href;
      QRCode.toDataURL(qrValue, {
        width: 300,
        margin: 1,
        color: {
          dark: content.qrFgColor || style.color || '#000000',
          light: content.qrBgColor || '#ffffff'
        }
      }).then(url => setQrCodeDataUrl(url)).catch(() => {});
    }
  }, [type, content.qrCodeValue, content.qrFgColor, content.qrBgColor, style.color]);

  // Audio helper
  const toggleAudioPlay = () => {
    if (!content.audioUrl) return;
    if (!audioElement) {
      const audio = new Audio(content.audioUrl);
      audio.loop = content.audioLoop !== false;
      audio.volume = content.audioVolume !== undefined ? content.audioVolume : 1;
      audio.play().catch(() => {});
      setAudioElement(audio);
      setIsPlayingAudio(true);
    } else {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play().catch(() => {});
        setIsPlayingAudio(true);
      }
    }
  };

  // Helper to compute CSS image filter string
  const getImageFilters = (s: ElementStyle): string | undefined => {
    if (s.filterPreset === 'vintage') return 'sepia(0.4) contrast(1.1) brightness(0.95)';
    if (s.filterPreset === 'warm') return 'sepia(0.2) saturate(1.3) brightness(1.05)';
    if (s.filterPreset === 'cool') return 'hue-rotate(180deg) saturate(0.9) contrast(1.05)';
    if (s.filterPreset === 'dramatic') return 'contrast(1.4) brightness(0.9) saturate(1.2)';
    if (s.filterPreset === 'bw') return 'grayscale(1) contrast(1.2)';
    if (s.filterPreset === 'faded') return 'contrast(0.85) brightness(1.1) opacity(0.9)';

    const filters: string[] = [];
    if (s.filterGrayscale !== undefined && s.filterGrayscale > 0) filters.push(`grayscale(${s.filterGrayscale}%)`);
    if (s.filterSepia !== undefined && s.filterSepia > 0) filters.push(`sepia(${s.filterSepia}%)`);
    if (s.filterBrightness !== undefined && s.filterBrightness !== 100) filters.push(`brightness(${s.filterBrightness}%)`);
    if (s.filterContrast !== undefined && s.filterContrast !== 100) filters.push(`contrast(${s.filterContrast}%)`);
    if (s.filterBlur !== undefined && s.filterBlur > 0) filters.push(`blur(${s.filterBlur}px)`);
    if (s.filterHueRotate !== undefined && s.filterHueRotate > 0) filters.push(`hue-rotate(${s.filterHueRotate}deg)`);

    return filters.length > 0 ? filters.join(' ') : undefined;
  };

  // Helper to compute text-shadow CSS
  const getTextShadow = (s: ElementStyle): string | undefined => {
    if (s.textShadow) return s.textShadow;
    if (s.shadowColor || s.shadowBlur) {
      const ox = s.shadowOffsetX || 0;
      const oy = s.shadowOffsetY || 2;
      const blur = s.shadowBlur || 4;
      const col = s.shadowColor || 'rgba(0,0,0,0.5)';
      return `${ox}px ${oy}px ${blur}px ${col}`;
    }
    return undefined;
  };

  // Generate motion animation props
  const animMotionProps = getElementMotionProps(animation, {
    isEditor,
    previewTrigger: typeof previewKey === 'number' ? previewKey : undefined,
    forceAnimate
  });

  const renderContent = () => {
    switch (type) {
      // 1. TEXT / HEADING / PARAGRAPH
      case 'heading':
      case 'text':
      case 'paragraph': {
        return (
          <div
            className="w-full h-full flex items-center"
            style={{
              fontFamily: style.fontFamily,
              fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
              fontWeight: style.fontWeight,
              color: style.color,
              textAlign: style.textAlign || 'left',
              lineHeight: style.lineHeight,
              letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
              textShadow: getTextShadow(style),
              textTransform: style.textTransform,
              fontStyle: style.fontStyle,
              textDecoration: style.textDecoration,
              justifyContent:
                style.textAlign === 'center'
                  ? 'center'
                  : style.textAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
              whiteSpace: 'pre-wrap'
            }}
          >
            {content.text || 'Sample Text'}
          </div>
        );
      }

      // 2. IMAGE
      case 'image': {
        const filterStr = getImageFilters(style);
        return (
          <img
            src={content.src || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
            alt={content.alt || content.caption || 'Invitation Image'}
            className="w-full h-full pointer-events-none select-none transition-all duration-300"
            style={{
              objectFit: style.objectFit || 'cover',
              borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
              filter: filterStr,
              opacity: style.opacity ?? 1
            }}
            referrerPolicy="no-referrer"
          />
        );
      }

      // 3. VIDEO
      case 'video': {
        const isBg = content.videoIsBackground;
        return (
          <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: style.borderRadius ? `${style.borderRadius}px` : '8px' }}>
            <video
              src={content.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-in-a-box-41589-large.mp4'}
              poster={content.videoPoster}
              autoPlay={content.videoAutoplay !== false}
              loop={content.videoLoop !== false}
              muted={content.videoMuted !== false}
              controls={!isEditor && content.videoControls}
              playsInline
              className="w-full h-full object-cover pointer-events-none"
              style={{
                borderRadius: style.borderRadius ? `${style.borderRadius}px` : '8px'
              }}
            />
            {isBg && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />
            )}
          </div>
        );
      }

      // 4. AUDIO
      case 'audio': {
        return (
          <div
            onClick={toggleAudioPlay}
            className="w-full h-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900/90 border border-amber-400/40 text-neutral-200 cursor-pointer shadow-lg hover:border-amber-400 transition-colors select-none"
            style={{
              borderRadius: style.borderRadius ? `${style.borderRadius}px` : '12px'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-neutral-100 truncate max-w-[140px]">
                  {content.audioTitle || 'Wedding Symphony'}
                </div>
                <div className="text-[10px] text-amber-400/80">
                  {isPlayingAudio ? 'Playing Melody' : 'Tap to Play'}
                </div>
              </div>
            </div>
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-amber-400 animate-pulse' : 'text-neutral-500'}`} />
          </div>
        );
      }

      // 5. BUTTON
      case 'button': {
        const handleClick = (e: React.MouseEvent) => {
          if (isEditor) return;
          e.stopPropagation();
          if (content.buttonAction === 'rsvp' && onOpenRSVP) {
            onOpenRSVP();
          } else if (content.buttonAction === 'guestbook' && onOpenGuestbook) {
            onOpenGuestbook();
          } else if (content.buttonAction === 'maps' && content.venueAddress) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.venueAddress)}`, '_blank');
          } else if (content.buttonAction === 'whatsapp' && content.whatsappPhone) {
            window.open(`https://wa.me/${content.whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content.whatsappMessage || '')}`, '_blank');
          } else if (content.buttonAction === 'link' && content.buttonLink) {
            window.open(content.buttonLink, '_blank');
          } else if (onActionClick) {
            onActionClick(content.buttonAction || 'click', content);
          }
        };

        const shapeRadius =
          content.buttonShape === 'pill'
            ? '9999px'
            : content.buttonShape === 'rounded'
            ? '12px'
            : content.buttonShape === 'square'
            ? '0px'
            : style.borderRadius ? `${style.borderRadius}px` : '8px';

        const bg = isHovered && style.hoverBackgroundColor ? style.hoverBackgroundColor : (style.backgroundColor || '#d4af37');
        const textColor = isHovered && style.hoverColor ? style.hoverColor : (style.color || '#ffffff');
        const transformScale = isHovered && style.hoverScale ? `scale(${style.hoverScale})` : undefined;
        const bShadow = isHovered && style.hoverBoxShadow ? style.hoverBoxShadow : style.boxShadow;

        return (
          <button
            type="button"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md font-medium text-center"
            style={{
              backgroundColor: bg,
              color: textColor,
              borderRadius: shapeRadius,
              fontFamily: style.fontFamily,
              fontSize: style.fontSize ? `${style.fontSize}px` : '14px',
              fontWeight: style.fontWeight || 600,
              letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
              borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
              borderColor: isHovered && style.hoverBorderColor ? style.hoverBorderColor : style.borderColor,
              borderStyle: style.borderStyle || 'solid',
              transform: transformScale,
              boxShadow: bShadow
            }}
          >
            <span>{content.buttonText || 'Confirm Attendance'}</span>
            <ChevronRight className="w-4 h-4 opacity-75" />
          </button>
        );
      }

      // 6. ICON
      case 'icon': {
        return <IconElement style={style} content={content} isEditor={isEditor} />;
      }

      // 7. DIVIDER
      case 'divider': {
        return <DividerElement style={style} content={content} isEditor={isEditor} />;
      }

      // 8. SHAPE
      case 'shape': {
        return <ShapeElement style={style} content={content} isEditor={isEditor} />;
      }

      // 9. EVENT DATE
      case 'event-date': {
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none"
            style={{
              fontFamily: style.fontFamily || "'Cinzel', serif",
              color: style.color || '#d4af37'
            }}
          >
            <div className="flex items-center gap-1.5 mb-1 opacity-80 font-sans text-[10px] uppercase tracking-widest text-slate-400">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{content.text || 'Celebration Date'}</span>
            </div>
            <div
              className="font-bold tracking-wide"
              style={{ fontSize: style.fontSize ? `${style.fontSize}px` : '20px' }}
            >
              {content.eventDate || 'Saturday, October 24, 2026'}
            </div>
          </div>
        );
      }

      // 10. EVENT TIME
      case 'event-time': {
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none"
            style={{
              fontFamily: style.fontFamily || "'Cinzel', serif",
              color: style.color || '#d4af37'
            }}
          >
            <div className="flex items-center gap-1.5 mb-1 opacity-80 font-sans text-[10px] uppercase tracking-widest text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{content.text || 'Reception Time'}</span>
            </div>
            <div
              className="font-bold tracking-wide"
              style={{ fontSize: style.fontSize ? `${style.fontSize}px` : '18px' }}
            >
              {content.eventTime || '04:00 PM – 10:00 PM'}
            </div>
          </div>
        );
      }

      // 11. COUNTDOWN
      case 'countdown': {
        return <CountdownElement style={style} content={content} isEditor={isEditor} />;
      }

      // 12. CALENDAR
      case 'calendar': {
        return <CalendarElement style={style} content={content} isEditor={isEditor} />;
      }

      // 13. VENUE
      case 'venue': {
        return <MapElement style={style} content={content} isEditor={isEditor} />;
      }

      // 14. MAP / GOOGLE MAPS
      case 'google-maps': {
        return <MapElement style={style} content={content} isEditor={isEditor} />;
      }

      // 15. TIMELINE
      case 'timeline': {
        return <TimelineElement style={style} content={content} isEditor={isEditor} />;
      }

      // 16. PHOTO GALLERY
      case 'photo-gallery': {
        return <GalleryElement style={style} content={content} isEditor={isEditor} />;
      }

      // 17. RSVP FORM
      case 'rsvp-form': {
        return (
          <RSVPElement
            style={style}
            content={content}
            isEditor={isEditor}
            onOpenModal={onOpenRSVP}
          />
        );
      }

      // 18. GUESTBOOK
      case 'guestbook': {
        return (
          <GuestbookElement
            style={style}
            content={content}
            isEditor={isEditor}
            onOpenModal={onOpenGuestbook}
          />
        );
      }

      // 19. WHATSAPP BUTTON
      case 'whatsapp-button': {
        const handleClick = (e: React.MouseEvent) => {
          if (isEditor) return;
          e.stopPropagation();
          const phone = (content.whatsappPhone || '1234567890').replace(/[^0-9]/g, '');
          const msg = encodeURIComponent(content.whatsappMessage || 'Hello! I received your invitation.');
          window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
        };

        return (
          <button
            type="button"
            onClick={handleClick}
            className="w-full h-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg transition-transform active:scale-95 cursor-pointer"
            style={{
              fontSize: style.fontSize ? `${style.fontSize}px` : '14px',
              borderRadius: style.borderRadius ? `${style.borderRadius}px` : '12px'
            }}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{content.buttonText || 'RSVP via WhatsApp'}</span>
          </button>
        );
      }

      // 20. QR CODE
      case 'qr-code': {
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-2 rounded-xl shadow-lg select-none"
            style={{
              backgroundColor: content.qrBgColor || '#ffffff',
              borderRadius: style.borderRadius ? `${style.borderRadius}px` : '12px'
            }}
          >
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-12 h-12 text-neutral-800" />
            )}
            {content.qrLabel && (
              <span className="text-[10px] font-sans font-semibold text-slate-700 mt-1">
                {content.qrLabel}
              </span>
            )}
          </div>
        );
      }

      // 21. COUPLE NAMES
      case 'couple-names': {
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center select-none"
            style={{
              fontFamily: style.fontFamily || "'Playfair Display', serif",
              color: style.color || 'inherit'
            }}
          >
            <div
              className="text-center font-bold tracking-wide"
              style={{ fontSize: style.fontSize ? `${style.fontSize}px` : '32px' }}
            >
              {content.coupleName1 || 'Alexander Sterling'}
            </div>
            <div
              className="my-1 text-sm tracking-widest uppercase opacity-75 font-sans"
              style={{ color: style.color }}
            >
              {content.andConnector || '&'}
            </div>
            <div
              className="text-center font-bold tracking-wide"
              style={{ fontSize: style.fontSize ? `${style.fontSize}px` : '32px' }}
            >
              {content.coupleName2 || 'Sophia Montgomery'}
            </div>
          </div>
        );
      }

      // 22. DRESS CODE
      case 'dress-code': {
        const colors = content.dressCodeColors || ['#000000', '#ffffff', '#d4af37'];
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center select-none">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
              Dress Code
            </div>
            <div className="text-sm font-bold text-neutral-100 mb-2">
              {content.dressCodeTitle || 'Black Tie Preferred'}
            </div>
            <div className="flex items-center justify-center gap-2 my-2">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            {content.dressCodeDescription && (
              <p className="text-xs text-neutral-400 max-w-xs mt-1 leading-relaxed">
                {content.dressCodeDescription}
              </p>
            )}
          </div>
        );
      }

      // 23. CONTAINER
      case 'container': {
        const childElements = allElements.filter(
          el => (el.parentContainerId === element.id || el.parentId === element.id) && !el.isHidden
        );

        return (
          <ShapeMask shape={style.shape || 'rectangle'} style={style} isEditor={isEditor}>
            <div className="relative w-full h-full">
              {isEditor && childElements.length === 0 && !style.background?.imageUrl && !style.background?.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
                  <div className="text-[11px] text-slate-400 font-medium px-2 py-1 rounded bg-black/10 backdrop-blur-xs">
                    {element.name || 'Container Block'}
                  </div>
                </div>
              )}

              {childElements.map(child => {
                const isChildSelected = selectedElementId === child.id;
                return (
                  <div
                    key={child.id}
                    className={`cursor-pointer transition-shadow ${
                      isEditor
                        ? isChildSelected
                          ? 'ring-2 ring-indigo-600 rounded-[2px] z-50'
                          : 'hover:ring-1 hover:ring-indigo-400/50'
                        : ''
                    }`}
                    style={{
                      position: 'absolute',
                      left: `${child.style.x}px`,
                      top: `${child.style.y}px`,
                      width: `${child.style.width}px`,
                      height: `${child.style.height}px`,
                      transform: child.style.rotation ? `rotate(${child.style.rotation}deg)` : undefined,
                      zIndex: isChildSelected ? 99 : child.style.zIndex || 1
                    }}
                    onClick={(e) => {
                      if (isEditor && onSelectElement) {
                        e.stopPropagation();
                        onSelectElement(child.id);
                      }
                    }}
                  >
                    <ElementRenderer
                      element={child}
                      isEditor={isEditor}
                      onActionClick={onActionClick}
                      onOpenRSVP={onOpenRSVP}
                      onOpenGuestbook={onOpenGuestbook}
                      allElements={allElements}
                      onSelectElement={onSelectElement}
                      selectedElementId={selectedElementId}
                    />
                  </div>
                );
              })}
            </div>
          </ShapeMask>
        );
      }

      default:
        return (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-neutral-600 text-xs text-neutral-400">
            {element.name || type}
          </div>
        );
    }
  };

  if (type === 'container') {
    return (
      <motion.div
        key={previewKey ? `${element.id}-${previewKey}` : undefined}
        className="w-full h-full"
        {...animMotionProps}
      >
        {renderContent()}
      </motion.div>
    );
  }

  return (
    <motion.div
      key={previewKey ? `${element.id}-${previewKey}` : undefined}
      className="w-full h-full overflow-hidden"
      {...animMotionProps}
    >
      {renderContent()}
    </motion.div>
  );
};
