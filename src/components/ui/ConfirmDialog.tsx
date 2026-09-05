import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle, Info, HelpCircle, X, Loader2 } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
          iconBg: 'bg-rose-100 dark:bg-rose-950/60',
          btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
          iconBg: 'bg-amber-100 dark:bg-amber-950/60',
          btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm focus:ring-amber-500'
        };
      case 'primary':
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
          iconBg: 'bg-indigo-100 dark:bg-indigo-950/60',
          btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <AnimatePresence>
      <div
        id="confirm-dialog-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) onCancel();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            id="btn-dialog-close"
            disabled={isLoading}
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${style.iconBg}`}>
              {style.icon}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {message}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              id="btn-dialog-cancel"
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              id="btn-dialog-confirm"
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-5 py-2 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${style.btnClass}`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
