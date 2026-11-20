import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface InspectorSectionProps {
  title: string;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

export const InspectorSection: React.FC<InspectorSectionProps> = ({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  badge,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs transition-all ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left bg-slate-50/60 hover:bg-slate-100/70 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-slate-500 shrink-0" />}
          <span className="text-xs font-bold text-slate-800 tracking-tight truncate">
            {title}
          </span>
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-3.5 pt-3 border-t border-slate-100 space-y-3.5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};
