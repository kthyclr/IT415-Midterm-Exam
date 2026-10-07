import React from 'react';
import { OrderItem } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Order &amp; Payment Summary
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Please verify your selected items and quantities before choosing a payment method.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-medium text-slate-500 block">
              Total Quantity
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 tabular-nums">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 pl-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td className="py-4 pr-4 font-bold text-slate-900 text-base">
                    {item.productName}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-slate-600 tabular-nums">
                    {formatCurrency(item.unitPriceCentavos)}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="py-4 pl-4 text-right font-mono font-bold text-slate-900 text-base tabular-nums">
                    {formatCurrency(item.subtotalCentavos)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Summary Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-slate-700 block">
              Total Amount Due
            </span>
            <span className="text-xs text-slate-500">
              All prices are inclusive of applicable campus outlet taxes.
            </span>
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-800 tabular-nums">
            {formatCurrency(totalAmountCentavos)}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToSelection}
            className="min-h-[56px] px-6 py-3.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.99] text-base font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back / Modify Order</span>
          </button>

          <button
            type="button"
            onClick={onContinueToPayment}
            className="min-h-[56px] px-8 py-3.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.99] text-base font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>Continue to Payment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
