import React, { useState, useMemo } from 'react';
import { PageTemplate, TemplateCategory } from '../../types';
import { ALL_PAGE_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import {
  X,
  Plus,
  Layers,
  Sparkles,
  Search,
  FileText,
  Heart,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  HeartHandshake,
  CheckCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface PageTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PageTemplate) => void;
  onAddBlankPage: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  all: Sparkles,
  opening: Sparkles,
  wedding: Heart,
  event: Calendar,
  media: ImageIcon,
  interaction: MessageSquare,
  final: HeartHandshake
};

export const PageTemplatesModal: React.FC<PageTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onAddBlankPage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return ALL_PAGE_TEMPLATES.filter((tmpl) => {
      const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        tmpl.name.toLowerCase().includes(q) ||
        (tmpl.subcategory && tmpl.subcategory.toLowerCase().includes(q)) ||
        (tmpl.description && tmpl.description.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/90">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Invitation Page Templates
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {ALL_PAGE_TEMPLATES.length} Prebuilt Layouts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select a pre-designed layout as an editable starting point. All containers, typography, and assets remain 100% customizable.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onAddBlankPage();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Add Blank Page</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Category Tabs & Search */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat.id] || Sparkles;
              const count = cat.id === 'all'
                ? ALL_PAGE_TEMPLATES.length
                : ALL_PAGE_TEMPLATES.filter((t) => t.category === cat.id).length;

              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/60">
          {/* Blank Page Card (Always visible first if on 'all') */}
          {selectedCategory === 'all' && !searchQuery && (
            <div
              onClick={() => {
                onAddBlankPage();
                onClose();
              }}
              className="group border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white hover:bg-slate-50 min-h-[260px] shadow-2xs"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-600 group-hover:text-slate-900 mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Blank Canvas</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                Start with an empty page and add custom containers, shapes, and media elements.
              </p>
              <span className="mt-4 inline-flex items-center text-xs font-semibold text-slate-800 group-hover:underline">
                Create Blank Page →
              </span>
            </div>
          )}

          {/* Prebuilt Templates Cards */}
          {filteredTemplates.map((template) => {
            const elementCount = template.page.elements.length;
            const containerCount = template.page.elements.filter((e) => e.type === 'container').length;

            return (
              <div
                key={template.id}
                className="group border border-slate-200 hover:border-slate-800 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-40 bg-slate-950 overflow-hidden">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-950 to-slate-900 text-amber-400 font-serif text-lg">
                      {template.name}
                    </div>
                  )}

                  {/* Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-400/20">
                      {template.category}
                    </span>
                    {template.subcategory && (
                      <span className="bg-white/20 backdrop-blur-xs text-[10px] font-medium text-white px-2 py-0.5 rounded-md">
                        {template.subcategory}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono text-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>{elementCount} elements</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <div className="text-xs font-bold text-white tracking-wide truncate drop-shadow-sm">
                      {template.name}
                    </div>
                  </div>
                </div>

                {/* Info & Action */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                    
                    {containerCount > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <span>Includes {containerCount} architectural container{containerCount > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {template.page.heightMode === 'viewport' ? 'Full Viewport' : 'Custom Height'}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTemplate(template);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 mb-1" />
              <div className="text-sm font-semibold text-slate-700">No matching templates found</div>
              <p className="text-xs max-w-sm text-slate-500">
                Try selecting a different category or clearing your search keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs text-slate-900 font-semibold underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Templates are starting points — every container, text, image, and style is fully editable.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
