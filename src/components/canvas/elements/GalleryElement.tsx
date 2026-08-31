import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';
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
        }
      ];

  const layout = content.galleryLayout || 'carousel';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
      className="w-full h-full select-none relative overflow-hidden"
      style={{
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : '16px'
      }}
    >
      {/* 1. CAROUSEL / SLIDER LAYOUT */}
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

      {/* 2. GRID LAYOUT */}
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

      {/* 3. MASONRY LAYOUT */}
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

      {/* 4. POLAROID STACK LAYOUT */}
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
