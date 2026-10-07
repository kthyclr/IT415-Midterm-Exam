import React from 'react';
import { StatusToast } from '../../types/pos';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface StatusBannerProps {
  toast: StatusToast | null;
  onDismiss: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] no-print pointer-events-auto"
    >
      <div
        className={`flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl shadow-lg border transition-all duration-150 ${
          isError
            ? 'bg-red-950 text-white border-red-800'
            : isSuccess
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-slate-800 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 shrink-0" />
          )}
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
