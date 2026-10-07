import React from 'react';
import { OrderItem } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { ArrowLeft, ArrowRight, ClipboardCheck } from 'lucide-react';

interface OrderSummaryScreenProps {
  cartItems: OrderItem[];
  totalAmountCentavos: number;
  totalItemCount: number;
  onBackToSelection: () => void;
  onContinueToPayment: () => void;
}

export const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({
  cartItems,
  totalAmountCentavos,
  totalItemCount,
  onBackToSelection,
  onContinueToPayment,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <ProgressIndicator currentStage="ORDER_SUMMARY" variant="inline" />
        <h1 className="handwritten text-5xl sm:text-6xl font-bold text-[#252422] leading-[0.85] mt-2">
          Order &amp; Payment Summary
        </h1>
        <p className="text-sm font-medium text-[#403d39]/80 mt-2">
          Review your selected items and quantities before choosing a payment method.
        </p>
      </div>

      <div className="ink-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-dashed border-[#252422]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#fffcf2] border-2 border-[#252422] flex items-center justify-center text-[#eb5e28] shadow-[3px_3px_0_#252422]">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="kiosk-label block">Tray Overview</span>
              <h2 className="handwritten text-3xl font-bold text-[#252422] leading-none">
                Selected Goodies
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="kiosk-label block">Total Quantity</span>
            <span className="text-lg font-mono font-bold text-[#252422] tabular-nums">
              {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'}
            </span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#252422] font-mono text-xs uppercase tracking-wider text-[#403d39]">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 pl-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-[#252422]/20 text-sm">
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td className="py-4 pr-4 handwritten text-3xl font-bold text-[#252422]">
                    {item.productName}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-[#403d39] tabular-nums">
                    {formatCurrency(item.unitPriceCentavos)}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#252422] tabular-nums">
                    ×{item.quantity}
                  </td>
                  <td className="py-4 pl-4 text-right font-mono font-bold text-[#252422] text-base tabular-nums">
                    {formatCurrency(item.subtotalCentavos)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Summary Box */}
        <div className="bg-[#fffcf2] rounded-2xl p-5 border-2 border-[#252422] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="kiosk-label block">Total Amount Due</span>
            <span className="text-xs text-[#403d39]">
              All prices are inclusive of applicable campus outlet taxes.
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#eb5e28] tabular-nums">
            {formatCurrency(totalAmountCentavos)}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToSelection}
            className="min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back / Modify Order</span>
          </button>

          <button
            type="button"
            onClick={onContinueToPayment}
            className="min-h-[58px] px-8 py-3.5 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Continue to Payment</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
