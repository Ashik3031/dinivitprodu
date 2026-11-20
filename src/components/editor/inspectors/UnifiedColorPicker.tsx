import React, { useState, useRef, useEffect } from 'react';
import {
  LUXURY_PALETTE_SWATCHES,
  getRecentColors,
  saveRecentColor,
  getContrastRatio,
  isDarkColor
} from '../../../utils/colorUtils';
import { Palette, RotateCcw, AlertTriangle, Check, X } from 'lucide-react';

interface UnifiedColorPickerProps {
  label: string;
  value: string | undefined;
  onChange: (color: string) => void;
  defaultValue?: string;
  allowTransparent?: boolean;
  themeColors?: string[];
  contrastBackground?: string;
  compact?: boolean;
}

export const UnifiedColorPicker: React.FC<UnifiedColorPickerProps> = ({
  label,
  value = '#d4af37',
  onChange,
  defaultValue,
  allowTransparent = false,
  themeColors = [],
  contrastBackground,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      setRecentColors(getRecentColors());
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApplyColor = (color: string) => {
    setInputValue(color);
    onChange(color);
    saveRecentColor(color);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val) || val === 'transparent' || val.startsWith('rgba') || val.startsWith('rgb')) {
      onChange(val);
      saveRecentColor(val);
    }
  };

  const isTransparent = !value || value === 'transparent';
  const contrastRatio = contrastBackground ? getContrastRatio(value, contrastBackground) : null;
  const isPoorContrast = contrastRatio !== null && contrastRatio < 2.5 && !isTransparent;

  return (
    <div className="relative text-xs">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-slate-700 truncate max-w-[170px]" title={label}>
          {label}
        </label>
        {isPoorContrast && (
          <span
            className="flex items-center gap-0.5 text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"
            title={`Contrast ratio ${contrastRatio?.toFixed(1)}:1 (Text may be hard to read against background)`}
          >
            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
            <span>Low contrast</span>
          </span>
        )}
      </div>

      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 transition-all cursor-pointer shadow-2xs group ${
            compact ? 'w-auto' : 'w-full'
          }`}
        >
          {/* Swatch Pill */}
          <div
            className="w-5 h-5 rounded-md border border-slate-300 shadow-inner shrink-0 relative overflow-hidden"
            style={{
              backgroundColor: isTransparent ? 'transparent' : value,
              backgroundImage: isTransparent
                ? 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)'
                : undefined,
              backgroundSize: '4px 4px'
            }}
          />

          <span className="text-[11px] font-mono text-slate-700 font-medium truncate flex-1 text-left">
            {isTransparent ? 'Transparent' : value.toUpperCase()}
          </span>

          <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
        </button>

        {defaultValue && value !== defaultValue && (
          <button
            type="button"
            title="Reset to default"
            onClick={() => handleApplyColor(defaultValue)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 space-y-3 right-0 left-auto top-full animate-in fade-in duration-150 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-800">{label}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Wheel & Hex Input Row */}
          <div className="flex items-center gap-2">
            <label className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 shadow-xs cursor-pointer shrink-0 block">
              <input
                type="color"
                value={isTransparent ? '#d4af37' : value.startsWith('#') && value.length === 7 ? value : '#d4af37'}
                onChange={(e) => handleApplyColor(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: isTransparent ? 'transparent' : value,
                  backgroundImage: isTransparent
                    ? 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)'
                    : undefined,
                  backgroundSize: '4px 4px'
                }}
              />
            </label>

            <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 focus-within:bg-white focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
              <span className="pl-2 text-slate-400 text-[10px] font-mono">HEX</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#000000"
                className="w-full py-1 px-2 text-xs font-mono text-slate-800 bg-transparent focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* Transparent option if allowed */}
          {allowTransparent && (
            <button
              type="button"
              onClick={() => handleApplyColor('transparent')}
              className={`w-full py-1 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isTransparent
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>No Fill / Transparent</span>
              {isTransparent && <Check className="w-3 h-3" />}
            </button>
          )}

          {/* Theme Colors Palette (if provided) */}
          {themeColors && themeColors.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Theme Colors
              </span>
              <div className="flex flex-wrap gap-1.5">
                {themeColors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyColor(color)}
                    className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                      value?.toLowerCase() === color.toLowerCase()
                        ? 'ring-2 ring-slate-900 ring-offset-1 border-white scale-105'
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Theme color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Preset Swatches Palette */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Standard Palette
            </span>
            <div className="grid grid-cols-8 gap-1.5">
              {LUXURY_PALETTE_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleApplyColor(color)}
                  className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                    value?.toLowerCase() === color.toLowerCase()
                      ? 'ring-2 ring-slate-900 ring-offset-1 border-white scale-105'
                      : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Recently Used Colors */}
          {recentColors.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Recently Used
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentColors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyColor(color)}
                    className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                      value?.toLowerCase() === color.toLowerCase()
                        ? 'ring-2 ring-slate-900 ring-offset-1 border-white scale-105'
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
