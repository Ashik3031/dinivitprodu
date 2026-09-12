import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, Layers, RotateCw } from 'lucide-react';
import { ElementStyle, ElementContent } from '../../../types';

interface GalleryElementProps {
  style: ElementStyle;
  content: ElementContent;
  isEditor?: boolean;
}

export const GalleryElement: React.FC<GalleryElementProps> = ({
  style,
  content,
  isEditor
}) => {
  const images = content.galleryImages && content.galleryImages.length > 0
    ? content.galleryImages
    : [
        {
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          caption: 'Our First Encounter'
        },
        {
          url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
          caption: 'The Engagement Proposal'
        },
        {
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
          caption: 'Forever & Always Together'
        },
        {
          url: 'https://images.unsplash.com/photo-1519225429780-e37d8001712a?auto=format&fit=crop&w=800&q=80',
          caption: 'Celebration of Love'
        },
        {
          url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
          caption: 'Sacred Vows & Joy'
        }
      ];

  const layout = content.galleryLayout || 'coverflow';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Drag / swipe state
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (layout === 'stack') {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setIsFlipping(false);
      }, 260);
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartXRef.current = clientX;
    touchEndXRef.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartXRef.current === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchEndXRef.current = clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      if (diff > 35) {
        handleNext();
      } else if (diff < -35) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const openLightbox = (index: number, e: React.MouseEvent) => {
    if (isEditor) return;
    e.stopPropagation();
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  const lightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
    setIsZoomed(false);
  };

  const lightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
    setIsZoomed(false);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  return (
    <div
      className="w-full h-full select-none relative overflow-hidden flex flex-col justify-center"
      style={{
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {/* 1. 3D COVERFLOW LAYOUT (Requested exact layout with 3D perspective, flanking depth cards, and pill dots) */}
      {layout === 'coverflow' && (
        <div
          className="w-full h-full relative flex flex-col items-center justify-between py-2 overflow-hidden select-none"
          style={{ perspective: '1100px' }}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D Cards Stage */}
          <div
            className="relative w-full flex-1 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {images.map((img, i) => {
              const total = images.length;
              let dist = (i - currentIndex) % total;
              if (dist > total / 2) dist -= total;
              if (dist < -total / 2) dist += total;

              const isCenter = dist === 0;
              const absDist = Math.abs(dist);

              // Calculate 3D styling based on distance
              let transformStyle = '';
              let zIndex = 10;
              let opacity = 1;
              let brightness = 1;

              if (isCenter) {
                transformStyle = 'translateX(-50%) translateY(-50%) translateZ(0px) rotateY(0deg) scale(1)';
                zIndex = 35;
                opacity = 1;
                brightness = 1;
              } else if (dist > 0) {
                // Right side cards
                const xOffset = 50 + dist * 38;
                const zOffset = -dist * 65;
                const yRotation = -38 - (dist - 1) * 6;
                const scale = Math.max(0.48, 1 - dist * 0.16);
                transformStyle = `translateX(calc(-50% + ${xOffset}%)) translateY(-50%) translateZ(${zOffset}px) rotateY(${yRotation}deg) scale(${scale})`;
                zIndex = 30 - dist;
                opacity = Math.max(0, 0.92 - (dist - 1) * 0.28);
                brightness = Math.max(0.4, 0.88 - (dist - 1) * 0.18);
              } else {
                // Left side cards
                const xOffset = -50 + dist * 38;
                const zOffset = dist * 65;
                const yRotation = 38 + (-dist - 1) * 6;
                const scale = Math.max(0.48, 1 - (-dist) * 0.16);
                transformStyle = `translateX(calc(-50% + ${xOffset}%)) translateY(-50%) translateZ(${zOffset}px) rotateY(${yRotation}deg) scale(${scale})`;
                zIndex = 30 - (-dist);
                opacity = Math.max(0, 0.92 - (-dist - 1) * 0.28);
                brightness = Math.max(0.4, 0.88 - (-dist - 1) * 0.18);
              }

              if (absDist > 3) {
                opacity = 0;
              }

              return (
                <div
                  key={i}
                  onClick={(e) => {
                    if (isCenter) {
                      openLightbox(i, e);
                    } else {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }
                  }}
                  className="absolute left-1/2 top-1/2 w-[54%] max-w-[320px] h-[92%] max-h-[440px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out cursor-pointer group bg-slate-900 border border-white/20"
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity: absDist > 3 ? 0 : opacity,
                    pointerEvents: absDist > 3 ? 'none' : 'auto',
                    filter: `brightness(${brightness})`
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Gallery photo ${i + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Active Card Extras */}
                  {isCenter && (
                    <>
                      {/* Enlarge button */}
                      <button
                        type="button"
                        onClick={(e) => openLightbox(i, e)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 backdrop-blur-md shadow-md transition-transform hover:scale-110 cursor-pointer z-10"
                        title="View photo fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Caption Overlay */}
                      {img.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 text-white text-center pointer-events-none">
                          <span className="text-xs font-serif italic tracking-wide truncate block px-2">
                            {img.caption}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md shadow-xl border border-white/20 transition-all active:scale-90 hover:scale-105 cursor-pointer z-40"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md shadow-xl border border-white/20 transition-all active:scale-90 hover:scale-105 cursor-pointer z-40"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}

          {/* Pagination Pill & Dots (Matches screenshot with elongated active pill) */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2 pb-1 z-30">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 transition-all duration-300 cursor-pointer rounded-full ${
                    currentIndex === i
                      ? 'w-5 bg-neutral-800 dark:bg-stone-200'
                      : 'w-1.5 bg-neutral-400/60 dark:bg-stone-500/60 hover:bg-neutral-600'
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. 3D STACK DECK LAYOUT (Swipeable layered cards with depth and physics) */}
      {layout === 'stack' && (
        <div
          className="w-full h-full relative flex flex-col items-center justify-between p-3 select-none overflow-hidden"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Deck Container */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            {images.map((img, i) => {
              const total = images.length;
              const k = (i - currentIndex + total) % total;
              if (k > 3) return null;

              const isTop = k === 0;

              // Depth styling for stacked cards
              let transform = '';
              let zIndex = 30 - k;
              let opacity = 1;

              if (isTop) {
                transform = isFlipping
                  ? 'translateX(110%) translateY(-20px) rotate(16deg) scale(0.9)'
                  : 'translateX(0) translateY(0) rotate(0deg) scale(1)';
                opacity = isFlipping ? 0 : 1;
              } else if (k === 1) {
                transform = 'translateY(-12px) rotate(3deg) scale(0.94)';
                opacity = 0.9;
              } else if (k === 2) {
                transform = 'translateY(-24px) rotate(-2.5deg) scale(0.88)';
                opacity = 0.75;
              } else if (k === 3) {
                transform = 'translateY(-34px) rotate(1.5deg) scale(0.82)';
                opacity = 0.5;
              }

              return (
                <div
                  key={i}
                  onClick={(e) => {
                    if (isTop) openLightbox(i, e);
                  }}
                  className={`absolute w-[68%] max-w-[310px] h-[88%] max-h-[420px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out cursor-pointer bg-slate-900 border border-white/20 ${
                    isTop ? 'hover:scale-[1.02]' : 'pointer-events-none'
                  }`}
                  style={{
                    transform,
                    zIndex,
                    opacity
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Photo ${i + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {isTop && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => openLightbox(i, e)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 backdrop-blur-md shadow-md transition-transform hover:scale-110 cursor-pointer z-10"
                        title="View photo fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {img.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 text-white text-center pointer-events-none">
                          <span className="text-xs font-serif italic tracking-wide truncate block px-2">
                            {img.caption}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stack Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-[280px] px-2 py-1 z-30">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-transform active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Counter Chip */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-medium text-white/90 border border-white/10 shadow-sm">
              <Layers className="w-3 h-3 text-amber-300" />
              <span>{currentIndex + 1} / {images.length}</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-transform active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. 3D ROTARY REEL LAYOUT (Continuous 3D cylinder carousel) */}
      {layout === 'cylinder' && (
        <div
          className="w-full h-full relative flex flex-col items-center justify-between py-2 select-none overflow-hidden"
          style={{ perspective: '1200px' }}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full flex-1 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {images.map((img, i) => {
              const total = images.length;
              let diff = (i - currentIndex) % total;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const angle = diff * (360 / Math.max(total, 5));
              const radius = Math.min(220, 35 * total);
              const isCenter = diff === 0;

              return (
                <div
                  key={i}
                  onClick={(e) => {
                    if (isCenter) {
                      openLightbox(i, e);
                    } else {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }
                  }}
                  className={`absolute left-1/2 top-1/2 w-[52%] max-w-[260px] h-[88%] max-h-[380px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out cursor-pointer bg-slate-900 border border-white/20 ${
                    isCenter ? 'z-30' : 'z-10'
                  }`}
                  style={{
                    transform: `translateX(-50%) translateY(-50%) rotateY(${angle}deg) translateZ(${radius}px) scale(${isCenter ? 1 : 0.85})`,
                    opacity: Math.abs(diff) > 2 ? 0 : isCenter ? 1 : 0.75,
                    pointerEvents: Math.abs(diff) > 2 ? 'none' : 'auto',
                    filter: `brightness(${isCenter ? 1 : 0.75})`
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Photo ${i + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {isCenter && (
                    <button
                      type="button"
                      onClick={(e) => openLightbox(i, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 backdrop-blur-md shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Enlarge"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/15 transition-transform active:scale-90 cursor-pointer z-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/15 transition-transform active:scale-90 cursor-pointer z-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1 z-30">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`h-1.5 transition-all duration-300 cursor-pointer rounded-full ${
                  currentIndex === i
                    ? 'w-5 bg-neutral-800 dark:bg-stone-200'
                    : 'w-1.5 bg-neutral-400/60 dark:bg-stone-500/60 hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. CAROUSEL / SLIDER LAYOUT */}
      {layout === 'carousel' && (
        <div className="w-full h-full relative group bg-slate-900">
          <img
            src={images[currentIndex]?.url}
            alt={images[currentIndex]?.caption || 'Gallery Image'}
            className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
            onClick={(e) => openLightbox(currentIndex, e)}
            referrerPolicy="no-referrer"
          />

          {/* Caption Overlay */}
          {images[currentIndex]?.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white text-center pointer-events-none">
              <span className="text-xs font-serif italic tracking-wide">
                {images[currentIndex].caption}
              </span>
            </div>
          )}

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90 cursor-pointer z-10 shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90 cursor-pointer z-10 shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === i ? 'bg-amber-400 w-5' : 'bg-white/50 w-2 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 5. GRID LAYOUT */}
      {layout === 'grid' && (
        <div className={`w-full h-full grid gap-2 p-1.5 ${images.length <= 2 ? 'grid-cols-2' : images.length === 4 ? 'grid-cols-2' : 'grid-cols-3'} overflow-y-auto`}>
          {images.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl group cursor-pointer aspect-square bg-slate-800 shadow-md"
              onClick={(e) => openLightbox(i, e)}
            >
              <img
                src={img.url}
                alt={img.caption || `Photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                <Maximize2 className="w-4 h-4 mb-1" />
                {img.caption && <span className="text-[9px] text-center font-serif truncate w-full px-1">{img.caption}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. MASONRY LAYOUT */}
      {layout === 'masonry' && (
        <div className="w-full h-full overflow-y-auto grid grid-cols-2 gap-2 p-1.5">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl relative cursor-pointer group bg-slate-800 shadow-md mb-1"
              onClick={(e) => openLightbox(idx, e)}
            >
              <img
                src={img.url}
                alt={img.caption || `Masonry photo ${idx + 1}`}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {img.caption && (
                <div className="p-1.5 text-[10px] bg-slate-950/80 text-slate-200 text-center font-serif truncate">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7. POLAROID STACK LAYOUT */}
      {layout === 'polaroid' && (
        <div className="w-full h-full flex items-center justify-center p-3">
          <div
            className="bg-white p-2.5 pb-6 rounded-lg shadow-2xl max-w-[90%] transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer text-slate-800 border border-slate-200"
            onClick={(e) => openLightbox(0, e)}
          >
            <img
              src={images[0]?.url}
              alt="Polaroid Memory"
              className="w-full h-44 object-cover rounded-xs"
              referrerPolicy="no-referrer"
            />
            <div className="text-center font-serif text-xs mt-3 font-semibold italic text-slate-700 truncate">
              {images[0]?.caption || 'Moments to Remember'}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between text-white py-2 z-10">
            <span className="text-xs font-mono font-medium text-slate-300">
              {lightboxIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Toggle Zoom"
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image View */}
          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center p-2">
            {images.length > 1 && (
              <button
                type="button"
                onClick={lightboxPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer z-10 shadow-lg border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.caption || 'Enlarged photo'}
              className={`max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl transition-all duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              referrerPolicy="no-referrer"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={lightboxNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer z-10 shadow-lg border border-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption */}
          {images[lightboxIndex]?.caption && (
            <div className="text-center py-2 text-slate-200 font-serif italic text-sm max-w-lg z-10">
              {images[lightboxIndex].caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
