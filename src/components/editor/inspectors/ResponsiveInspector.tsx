import React, { useState, useEffect } from 'react';
import { CanvasElement, ViewportMode, ResponsiveStyleOverride } from '../../../types';
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  Sliders,
  Type,
  Maximize2,
  Move,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ShieldCheck
} from 'lucide-react';
import {
  CANVAS_BREAKPOINTS,
  resolveElementForViewport,
  setElementResponsiveOverride,
  setResponsiveVisibility,
  autoScaleElementForViewport
} from '../../../utils/responsiveUtils';

interface ResponsiveInspectorProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  activeViewportMode?: ViewportMode;
  onChangeActiveViewport?: (mode: ViewportMode) => void;
}

export const ResponsiveInspector: React.FC<ResponsiveInspectorProps> = ({
  element,
  onUpdateElement,
  activeViewportMode = 'mobile',
  onChangeActiveViewport
}) => {
  const [selectedDevice, setSelectedDevice] = useState<ViewportMode>(activeViewportMode);

  // Sync selected device with active viewport mode if parent changes it
  useEffect(() => {
    if (activeViewportMode) {
      setSelectedDevice(activeViewportMode);
    }
  }, [activeViewportMode]);

  const handleDeviceChange = (mode: ViewportMode) => {
    setSelectedDevice(mode);
    if (onChangeActiveViewport) {
      onChangeActiveViewport(mode);
    }
  };

  const { style: currentResolvedStyle, isHidden: isResolvedHidden } = resolveElementForViewport(
    element,
    selectedDevice
  );

  const override = element.responsive?.[selectedDevice] || {};
  const visibility = element.responsiveVisibility || {};

  const isMobile = selectedDevice === 'mobile';
  const hasOverride = !isMobile && (
    override.fontSize !== undefined ||
    override.width !== undefined ||
    override.height !== undefined ||
    override.x !== undefined ||
    override.y !== undefined ||
    override.isHidden !== undefined
  );

  const targetCanvasWidth = CANVAS_BREAKPOINTS[selectedDevice].width;

  const handleUpdateOverride = (field: keyof ResponsiveStyleOverride, value: any) => {
    if (isMobile) {
      // In mobile mode, update the base style (Mobile-First Foundation)
      const baseStyleUpdates: any = {};
      if (field === 'fontSize') baseStyleUpdates.fontSize = value;
      if (field === 'width') baseStyleUpdates.width = value;
      if (field === 'height') baseStyleUpdates.height = value;
      if (field === 'x') baseStyleUpdates.x = value;
      if (field === 'y') baseStyleUpdates.y = value;
      if (field === 'padding') baseStyleUpdates.padding = value;

      onUpdateElement(element.id, {
        style: {
          ...element.style,
          ...baseStyleUpdates
        }
      });
    } else {
      const updated = setElementResponsiveOverride(element, selectedDevice, {
        [field]: value
      });
      onUpdateElement(element.id, updated);
    }
  };

  const handleResetOverride = () => {
    if (isMobile) return;
    const nextResponsive = { ...(element.responsive || {}) };
    delete nextResponsive[selectedDevice];
    onUpdateElement(element.id, { responsive: nextResponsive });
  };

  const handleAutoScale = () => {
    if (isMobile) return;
    const suggested = autoScaleElementForViewport(element, selectedDevice, 'mobile');
    const updated = setElementResponsiveOverride(element, selectedDevice, suggested);
    onUpdateElement(element.id, updated);
  };

  // Center horizontally in current breakpoint
  const handleCenterHorizontally = () => {
    const elWidth = currentResolvedStyle.width;
    const newX = Math.max(0, Math.round((targetCanvasWidth - elWidth) / 2));
    handleUpdateOverride('x', newX);
  };

  // Align left in current breakpoint
  const handleAlignLeft = () => {
    handleUpdateOverride('x', 16);
  };

  // Align right in current breakpoint
  const handleAlignRight = () => {
    const elWidth = currentResolvedStyle.width;
    const newX = Math.max(0, targetCanvasWidth - elWidth - 16);
    handleUpdateOverride('x', newX);
  };

  // Full width helper in current breakpoint
  const handleFullWidth = () => {
    const newWidth = targetCanvasWidth - 32;
    handleUpdateOverride('width', newWidth);
    handleUpdateOverride('x', 16);
  };

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-slate-700" />
          Responsive Breakpoints
        </span>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-amber-700" />
          Mobile-First
        </span>
      </div>

      {/* Breakpoint Selector Controls: [ Desktop ] [ Tablet ] [ Mobile ] */}
      <div>
        <label className="text-[10px] font-medium text-slate-500 block mb-1.5">
          Select Viewport Preview & Override Target:
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'desktop' as ViewportMode, label: 'Desktop', icon: Monitor, res: '960px' },
            { id: 'tablet' as ViewportMode, label: 'Tablet', icon: Tablet, res: '768px' },
            { id: 'mobile' as ViewportMode, label: 'Mobile', icon: Smartphone, res: '390px' }
          ].map((dev) => {
            const Icon = dev.icon;
            const isSelected = selectedDevice === dev.id;
            return (
              <button
                key={dev.id}
                type="button"
                onClick={() => handleDeviceChange(dev.id)}
                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300/80 font-bold scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dev.label}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-normal mt-0.5">
                  {dev.res}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Breakpoint Status & Actions */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900">
            {CANVAS_BREAKPOINTS[selectedDevice].name}
          </div>
          {!isMobile && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAutoScale}
                title="Auto-scale layout and typography proportionally for this device"
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-[10px] font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Auto-Fit</span>
              </button>
              {hasOverride && (
                <button
                  type="button"
                  onClick={handleResetOverride}
                  title="Reset to mobile base styles"
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-[10px] text-slate-500 leading-relaxed">
          {isMobile
            ? 'Mobile values act as the baseline styles. Tablet and Desktop inherit these unless overridden.'
            : hasOverride
            ? 'Active custom override for this viewport mode.'
            : 'Inheriting base mobile values. Modifying settings below creates a responsive override.'}
        </div>
      </div>

      {/* 1. Responsive Font Size */}
      {['heading', 'text', 'paragraph', 'couple-names', 'event-date', 'event-time', 'button', 'countdown', 'calendar', 'dress-code'].includes(element.type) && (
        <div className="space-y-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-600" />
              Font Size ({CANVAS_BREAKPOINTS[selectedDevice].label})
            </label>
            <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {currentResolvedStyle.fontSize || 16}px
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="96"
              step="1"
              value={currentResolvedStyle.fontSize || 16}
              onChange={(e) => handleUpdateOverride('fontSize', Number(e.target.value))}
              className="flex-1 accent-slate-900 cursor-pointer"
            />
            <input
              type="number"
              value={currentResolvedStyle.fontSize || 16}
              onChange={(e) => handleUpdateOverride('fontSize', Number(e.target.value))}
              className="w-14 bg-white border border-slate-200 rounded p-1 text-xs text-center font-mono font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Quick Font Size Presets */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {[
              { label: 'Sm (14px)', val: 14 },
              { label: 'Md (18px)', val: 18 },
              { label: 'Lg (26px)', val: 26 },
              { label: 'Xl (38px)', val: 38 }
            ].map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleUpdateOverride('fontSize', preset.val)}
                className={`py-1 text-[10px] font-medium rounded border transition-colors cursor-pointer text-center ${
                  currentResolvedStyle.fontSize === preset.val
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Responsive Element Size (Width & Height) */}
      <div className="space-y-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
            Element Dimensions ({CANVAS_BREAKPOINTS[selectedDevice].label})
          </label>
          <button
            type="button"
            onClick={handleFullWidth}
            className="text-[10px] text-slate-600 hover:text-slate-900 font-medium bg-white px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            Fit Width
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Width (px)</label>
            <input
              type="number"
              value={currentResolvedStyle.width}
              onChange={(e) => handleUpdateOverride('width', Math.max(10, Number(e.target.value)))}
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Height (px)</label>
            <input
              type="number"
              value={currentResolvedStyle.height}
              onChange={(e) => handleUpdateOverride('height', Math.max(10, Number(e.target.value)))}
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Responsive Position (X & Y) */}
      <div className="space-y-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-slate-600" />
            Coordinates & Position ({CANVAS_BREAKPOINTS[selectedDevice].label})
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">X Position (px)</label>
            <input
              type="number"
              value={currentResolvedStyle.x}
              onChange={(e) => handleUpdateOverride('x', Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Y Position (px)</label>
            <input
              type="number"
              value={currentResolvedStyle.y}
              onChange={(e) => handleUpdateOverride('y', Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Horizontal Alignments */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          <button
            type="button"
            onClick={handleAlignLeft}
            className="flex items-center justify-center gap-1 py-1 px-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <AlignLeft className="w-3 h-3" />
            <span>Align Left</span>
          </button>
          <button
            type="button"
            onClick={handleCenterHorizontally}
            className="flex items-center justify-center gap-1 py-1 px-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <AlignCenter className="w-3 h-3" />
            <span>Center</span>
          </button>
          <button
            type="button"
            onClick={handleAlignRight}
            className="flex items-center justify-center gap-1 py-1 px-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <AlignRight className="w-3 h-3" />
            <span>Align Right</span>
          </button>
        </div>
      </div>

      {/* 4. Responsive Device Visibility Matrix */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-800 block">
            Device Visibility Matrix
          </label>
          <span className="text-[10px] text-slate-500">Hide/Show per screen</span>
        </div>

        <div className="space-y-1.5">
          {[
            { key: 'hideOnDesktop' as const, label: 'Desktop Visibility', icon: Monitor, hint: '≥960px' },
            { key: 'hideOnTablet' as const, label: 'Tablet Visibility', icon: Tablet, hint: '768px - 959px' },
            { key: 'hideOnMobile' as const, label: 'Mobile Visibility', icon: Smartphone, hint: '≤767px (WhatsApp)' }
          ].map((item) => {
            const Icon = item.icon;
            const isHiddenOnDevice = !!visibility[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isHiddenOnDevice ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{item.label}</div>
                    <div className="text-[9px] font-mono text-slate-400">{item.hint}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = setResponsiveVisibility(element, {
                      [item.key]: !isHiddenOnDevice
                    });
                    onUpdateElement(element.id, updated);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                    isHiddenOnDevice
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {isHiddenOnDevice ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hidden</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Visible</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
