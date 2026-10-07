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
    <div className="py-3.5 border-b-2 border-dashed border-[#252422]/30 last:border-b-0 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="handwritten text-2xl font-bold text-[#252422] leading-none">
            {item.productName}
          </h4>
          <p className="text-xs font-mono text-[#403d39] mt-1 tabular-nums">
            {formatCurrency(item.unitPriceCentavos)} each
          </p>
        </div>

        <div className="text-right">
          <span className="text-base font-mono font-bold text-[#252422] bg-[#fff0eb] px-2.5 py-0.5 rounded-lg border border-[#252422] tabular-nums inline-block">
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
          className="min-h-[44px] px-3 rounded-xl border-2 border-[#252422] bg-white text-xs font-mono font-bold text-[#eb5e28] hover:bg-[#fff0eb] active:translate-x-[1px] active:translate-y-[1px] transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
};
