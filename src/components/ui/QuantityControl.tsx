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
    <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        aria-label={`Decrease quantity of ${productName}`}
        className={`${btnDimensions} flex items-center justify-center rounded-lg bg-white text-slate-800 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs border border-slate-200/80 cursor-pointer`}
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <span
        className="min-w-[40px] text-center font-mono font-bold text-base text-slate-900 tabular-nums px-2"
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
        className={`${btnDimensions} flex items-center justify-center rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all shadow-2xs cursor-pointer`}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};
