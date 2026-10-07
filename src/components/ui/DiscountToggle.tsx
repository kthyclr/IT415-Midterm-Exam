import React from 'react';
import { Tag } from 'lucide-react';

interface DiscountToggleProps {
  isSeniorPwd: boolean;
  onToggle: (enabled: boolean) => void;
  discountAmountCentavos?: number;
  formattedDiscount?: string;
}

export const DiscountToggle: React.FC<DiscountToggleProps> = ({
  isSeniorPwd,
  onToggle,
  formattedDiscount,
}) => {
  return (
    <div className="ink-card p-4 my-3 flex items-center justify-between bg-white rounded-2xl border-2 border-[#252422]">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border-2 border-[#252422] ${isSeniorPwd ? 'bg-[#eb5e28] text-white' : 'bg-gray-100 text-gray-700'}`}>
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#252422]">Senior Citizen / PWD (20%)</h4>
          <p className="text-xs text-gray-500">
            {isSeniorPwd && formattedDiscount ? `Saved ${formattedDiscount}` : 'Apply statutory 20% discount'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggle(!isSeniorPwd)}
        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
          isSeniorPwd
            ? 'ink-btn-accent'
            : 'ink-btn-secondary'
        }`}
      >
        {isSeniorPwd ? 'APPLIED (20% OFF)' : 'APPLY DISCOUNT'}
      </button>
    </div>
  );
};