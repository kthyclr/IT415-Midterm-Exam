import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  productName: string;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'md' | 'lg';
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  productName,
  onIncrease,
  onDecrease,
  size = 'md',
}) => {
  const btnDimensions = size === 'lg' ? 'min-w-[48px] min-h-[48px]' : 'min-w-[44px] min-h-[44px]';

  return (
    <div className="inline-flex items-center bg-[#fffcf2] rounded-2xl p-1 border-2 border-[#252422]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        aria-label={`Decrease quantity of ${productName}`}
        className={`${btnDimensions} flex items-center justify-center rounded-xl bg-white text-[#252422] border-2 border-[#252422] hover:bg-[#fff0eb] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer`}
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <span
        className="min-w-[40px] text-center font-mono font-bold text-base text-[#252422] tabular-nums px-2"
        aria-label={`Current quantity of ${productName}: ${quantity}`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        aria-label={`Increase quantity of ${productName}`}
        className={`${btnDimensions} flex items-center justify-center rounded-xl bg-[#eb5e28] text-white border-2 border-[#252422] hover:bg-[#d9511c] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer`}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};
