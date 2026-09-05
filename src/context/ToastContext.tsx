import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastItem, ToastType } from '../types';

interface ToastContextType {
  showToast: (options: { message: string; type?: ToastType; title?: string; duration?: number }) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((options: { message: string; type?: ToastType; title?: string; duration?: number }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const duration = options.duration ?? 4000;
    const newToast: ToastItem = {
      id,
      message: options.message,
      type: options.type || 'info',
      title: options.title,
      duration
    };

    setToasts(prev => [...prev.slice(-4), newToast]); // Keep maximum 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const success = useCallback((message: string, title?: string) => {
    return showToast({ message, title, type: 'success' });
  }, [showToast]);

  const error = useCallback((message: string, title?: string) => {
    return showToast({ message, title: title || 'Error', type: 'error', duration: 5500 });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string) => {
    return showToast({ message, title, type: 'warning', duration: 4500 });
  }, [showToast]);

  const info = useCallback((message: string, title?: string) => {
    return showToast({ message, title, type: 'info' });
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
          bar: 'bg-emerald-500'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
          bg: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
          bar: 'bg-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          bg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
          bar: 'bg-amber-500'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
          bg: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
          bar: 'bg-blue-500'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, dismissToast }}>
      {children}
      {/* Toast Render Portal / Container */}
      <div
        id="toast-notifications-portal"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map(toast => {
            const style = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`pointer-events-auto rounded-xl border shadow-lg p-3.5 flex items-start gap-3 backdrop-blur-md overflow-hidden relative ${style.bg}`}
              >
                {style.icon}
                <div className="flex-1 min-w-0 pr-2">
                  {toast.title && (
                    <div className="font-semibold text-sm leading-tight mb-0.5">{toast.title}</div>
                  )}
                  <p className="text-xs sm:text-sm leading-snug break-words font-medium opacity-90">
                    {toast.message}
                  </p>
                </div>
                <button
                  id={`btn-dismiss-${toast.id}`}
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors shrink-0"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
