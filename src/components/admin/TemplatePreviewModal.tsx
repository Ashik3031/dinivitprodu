import React, { useState } from 'react';
import { InvitationTemplate, ViewportMode } from '../../types';
import { ElementRenderer } from '../canvas/ElementRenderer';
import { OpeningEnvelopeScreen } from '../published/OpeningEnvelopeScreen';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Music,
  CheckCircle,
  Eye,
  Layers,
  Palette
} from 'lucide-react';

interface TemplatePreviewModalProps {
  template: InvitationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate?: (template: InvitationTemplate) => void;
  onEditTemplate?: (templateId: string) => void;
  onUseTemplate?: (template: InvitationTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onApplyTemplate,
  onEditTemplate,
  onUseTemplate
}) => {
  if (!isOpen || !template) return null;

  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isOpeningScreenOpen, setIsOpeningScreenOpen] = useState(
    template.openingScreen?.enabled || false
  );

  const pages = template.pages || [];
  const activePage = pages[currentPageIndex] || null;

  const getCanvasWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 390;
      case 'tablet':
        return 768;
      case 'desktop':
        return 960;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">{template.title}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  {template.category}
                </span>
                {template.isPremium && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Premium
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                  template.isPublic !== false 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-slate-700/50 text-slate-300 border-slate-600'
                }`}>
                  {template.isPublic !== false ? 'Published to Library' : 'Draft / Private'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl truncate">
                {template.description || 'Public invitation template for studio clients.'}
              </p>
            </div>
          </div>

          {/* Viewport switcher & Close */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${
                  viewportMode === 'mobile' ? 'bg-amber-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile Viewport (390px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('tablet')}
                className={`p-1.5 rounded-md transition-all ${
                  viewportMode === 'tablet' ? 'bg-amber-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet Viewport (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${
                  viewportMode === 'desktop' ? 'bg-amber-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop Viewport (960px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {onEditTemplate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditTemplate(template.id);
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Edit this template layout, pages, and elements in the visual canvas editor"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Edit in Canvas Editor</span>
              </button>
            )}

            {onUseTemplate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUseTemplate(template);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Create a new invitation using this template"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use This Template</span>
              </button>
            )}

            {onApplyTemplate && !onUseTemplate && (
              <button
                type="button"
                onClick={() => onApplyTemplate(template)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-lg text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Use Template
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-950/80 p-6 flex flex-col items-center justify-start relative">
          {/* Opening screen active notice */}
          {isOpeningScreenOpen && template.openingScreen?.enabled ? (
            <div className="w-full flex-1 flex flex-col items-center justify-center relative">
              <div
                style={{ width: getCanvasWidth(), maxWidth: '100%' }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 min-h-[600px] flex items-center justify-center"
              >
                <OpeningEnvelopeScreen
                  config={template.openingScreen}
                  openingScreen={template.openingScreen}
                  theme={template.theme}
                  defaultTitle={template.title}
                  onOpen={() => setIsOpeningScreenOpen(false)}
                  onOpenComplete={() => setIsOpeningScreenOpen(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsOpeningScreenOpen(false)}
                className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full border border-slate-600 transition-colors"
              >
                Skip Envelope & View Page Canvases
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Reset to Opening Screen button if enabled */}
              {template.openingScreen?.enabled && (
                <button
                  type="button"
                  onClick={() => setIsOpeningScreenOpen(true)}
                  className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Replay Envelope Opening Experience
                </button>
              )}

              {/* Active Page Canvas */}
              {activePage ? (
                <div
                  style={{
                    width: getCanvasWidth(),
                    maxWidth: '100%',
                    minHeight: activePage.height || 844,
                    backgroundColor: activePage.background?.color || '#ffffff'
                  }}
                  className="relative rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden transition-all duration-300"
                >
                  {/* Background Image / Texture if present */}
                  {activePage.background?.imageUrl && (
                    <div
                      className="absolute inset-0 pointer-events-none bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${activePage.background.imageUrl})`,
                        opacity: 1 - (activePage.background.overlayOpacity || 0)
                      }}
                    />
                  )}

                  {/* Canvas Elements */}
                  {activePage.elements.map((el) => (
                    <ElementRenderer
                      key={el.id}
                      element={el}
                      isEditor={false}
                      viewportMode={viewportMode}
                      allElements={activePage.elements}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-sm py-20">No pages found in this template.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation (for multi-page templates) */}
        {!isOpeningScreenOpen && pages.length > 1 && (
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>
                Page <strong className="text-white">{currentPageIndex + 1}</strong> of{' '}
                <strong className="text-white">{pages.length}</strong>: {activePage?.name || 'Page'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPageIndex === 0}
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous Page
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {pages.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentPageIndex === idx ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={p.name}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={currentPageIndex >= pages.length - 1}
                onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                Next Page <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
