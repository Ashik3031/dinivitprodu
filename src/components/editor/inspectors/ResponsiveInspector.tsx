import React, { useState } from 'react';
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
  Move
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

  const handleUpdateOverride = (field: keyof ResponsiveStyleOverride, value: any) => {
    if (isMobile) {
      // In mobile mode, update the base style
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

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Sliders className="w-3 h-3 text-slate-700" />
          Responsive Breakpoints
        </span>
        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
          Mobile-First
        </span>
      </div>

      {/* Breakpoint Selector */}
      <div>
        <label className="text-[10px] text-slate-500 block mb-1">Target Breakpoint</label>
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
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dev.label}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-normal">{dev.res}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Breakpoint Status & Actions */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <div className="text-xs font-semibold text-slate-900">
            {CANVAS_BREAKPOINTS[selectedDevice].name}
          </div>
          <div className="text-[10px] text-slate-500">
            {isMobile
              ? 'Base mobile-first values apply to all devices by default.'
              : hasOverride
              ? 'Custom override active for this device.'
              : 'Inheriting base mobile layout.'}
          </div>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleAutoScale}
              title="Auto-scale layout proportionally for this device"
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Auto-Fit</span>
            </button>
            {hasOverride && (
              <button
                type="button"
                onClick={handleResetOverride}
                title="Reset to mobile base styles"
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 1. Responsive Font Size */}
      {['heading', 'text', 'paragraph', 'couple-names', 'event-date', 'event-time', 'button'].includes(element.type) && (
        <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-600" />
              Font Size ({selectedDevice})
            </label>
            <span className="font-mono text-xs font-bold text-slate-900">
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
              className="w-14 bg-white border border-slate-200 rounded p-1 text-xs text-center font-mono font-semibold text-slate-900"
            />
          </div>
        </div>
      )}

      {/* 2. Responsive Element Size (Width & Height) */}
      <div className="space-y-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
        <label className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
          Element Dimensions ({selectedDevice})
        </label>
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
        <label className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-slate-600" />
          Coordinates & Position ({selectedDevice})
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">X Position</label>
            <input
              type="number"
              value={currentResolvedStyle.x}
              onChange={(e) => handleUpdateOverride('x', Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Y Position</label>
            <input
              type="number"
              value={currentResolvedStyle.y}
              onChange={(e) => handleUpdateOverride('y', Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-900 font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Responsive Device Visibility Matrix */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <label className="text-[11px] font-semibold text-slate-800 block">
          Device Visibility Rules
        </label>
        <div className="space-y-1.5">
          {[
            { key: 'hideOnDesktop' as const, label: 'Hide on Desktop', icon: Monitor, hint: '≥960px' },
            { key: 'hideOnTablet' as const, label: 'Hide on Tablet', icon: Tablet, hint: '768px - 959px' },
            { key: 'hideOnMobile' as const, label: 'Hide on Mobile', icon: Smartphone, hint: '≤767px' }
          ].map((item) => {
            const Icon = item.icon;
            const isHiddenOnDevice = !!visibility[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-xs font-medium text-slate-800">{item.label}</span>
                  <span className="text-[9px] font-mono text-slate-400">({item.hint})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = setResponsiveVisibility(element, {
                      [item.key]: !isHiddenOnDevice
                    });
                    onUpdateElement(element.id, updated);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    isHiddenOnDevice
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isHiddenOnDevice ? (
                    <>
                      <EyeOff className="w-3 h-3 text-rose-600" />
                      <span>Hidden</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-emerald-600" />
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
