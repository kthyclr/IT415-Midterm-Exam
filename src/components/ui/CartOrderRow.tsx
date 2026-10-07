import React from 'react';
import { OrderItem } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import { QuantityControl } from './QuantityControl';
import { Trash2 } from 'lucide-react';

interface CartOrderRowProps {
  item: OrderItem;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export const CartOrderRow: React.FC<CartOrderRowProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="py-3.5 border-b border-slate-200/80 last:border-b-0 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-base font-bold text-slate-900 leading-tight">
            {item.productName}
          </h4>
          <p className="text-xs font-mono text-slate-500 mt-0.5 tabular-nums">
            {formatCurrency(item.unitPriceCentavos)} each
          </p>
        </div>

        <div className="text-right">
          <span className="text-base font-mono font-bold text-slate-900 tabular-nums block">
            {formatCurrency(item.subtotalCentavos)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <QuantityControl
          quantity={item.quantity}
          productName={item.productName}
          onIncrease={() => onIncrease(item.productId)}
          onDecrease={() => onDecrease(item.productId)}
        />

        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          aria-label={`Remove ${item.productName} from order`}
          className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
};
