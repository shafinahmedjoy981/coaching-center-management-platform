import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[#00272B] text-white rounded-2xl shadow-xl border border-[#E0FF4F]/30 max-w-[90vw] md:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <CheckCircle2 className="w-5 h-5 text-[#E0FF4F] shrink-0" />
      <span className="text-xs md:text-sm font-medium leading-snug truncate">
        {toast.message}
      </span>

      {toast.onAction && toast.actionText && (
        <button
          onClick={() => {
            toast.onAction?.();
            clearToast();
          }}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#E0FF4F] text-[#00272B] rounded-lg hover:bg-white transition-colors shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{toast.actionText}</span>
        </button>
      )}

      <button
        onClick={clearToast}
        aria-label="Dismiss notification"
        className="p-1 text-white/60 hover:text-white transition-colors rounded-lg ml-auto shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
