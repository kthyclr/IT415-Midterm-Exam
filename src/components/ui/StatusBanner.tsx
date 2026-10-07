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
      className="fixed top-24 right-4 sm:right-8 z-50 max-w-md w-[calc(100%-2rem)] sm:w-auto no-print pointer-events-auto"
    >
      <div
        className={`flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl border-[3px] border-[#252422] shadow-[4px_4px_0_#252422] transition-all duration-150 ${
          isError
            ? 'bg-[#fff0eb] text-[#252422]'
            : isSuccess
              ? 'bg-[#252422] text-[#fffcf2]'
              : 'bg-white text-[#252422]'
        }`}
      >
        <div className="flex items-center gap-3">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-[#eb5e28] shrink-0" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-[#eb5e28] shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#eb5e28] shrink-0" />
          )}
          <span className="text-sm font-mono font-bold leading-snug">{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-current/20 hover:bg-black/10 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
