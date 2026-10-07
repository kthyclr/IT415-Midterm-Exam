import React from 'react';
import { DiningOption, OrderItem } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { ArrowLeft, ArrowRight, ClipboardCheck, Utensils, ShoppingBag, Check } from 'lucide-react';

interface OrderSummaryScreenProps {
  cartItems: OrderItem[];
  totalAmountCentavos: number;
  totalItemCount: number;
  diningOption: DiningOption;
  onChangeDiningOption: (option: DiningOption) => void;
  onBackToSelection: () => void;
  onContinueToPayment: () => void;
}

export const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({
  cartItems,
  totalAmountCentavos,
  totalItemCount,
  diningOption,
  onChangeDiningOption,
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

        {/* Dine-In vs. Take-Out Selection */}
        <div className="my-6 p-5 bg-[#fffcf2] rounded-2xl border-2 border-[#252422]">
          <span className="kiosk-label block mb-1">Dining Option</span>
          <h3 className="handwritten text-2xl font-bold text-[#252422] mb-3">
            How would you like your order?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChangeDiningOption('Dine-In')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                diningOption === 'Dine-In'
                  ? 'bg-[#252422] text-white border-[#252422] shadow-[3px_3px_0_#eb5e28]'
                  : 'bg-white text-[#252422] border-[#252422] hover:bg-[#fff0eb]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${
                    diningOption === 'Dine-In'
                      ? 'bg-[#eb5e28] text-white border-white'
                      : 'bg-[#fff0eb] text-[#eb5e28] border-[#252422]'
                  }`}
                >
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <span className="handwritten text-2xl font-bold block leading-none">
                    Eat In / Dine-In
                  </span>
                  <span
                    className={`text-xs font-mono block mt-0.5 ${
                      diningOption === 'Dine-In' ? 'text-white/80' : 'text-[#403d39]'
                    }`}
                  >
                    Enjoy at the store tray
                  </span>
                </div>
              </div>
              {diningOption === 'Dine-In' && (
                <div className="w-6 h-6 rounded-full bg-[#eb5e28] flex items-center justify-center text-white shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => onChangeDiningOption('Take-Out')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                diningOption === 'Take-Out'
                  ? 'bg-[#252422] text-white border-[#252422] shadow-[3px_3px_0_#eb5e28]'
                  : 'bg-white text-[#252422] border-[#252422] hover:bg-[#fff0eb]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${
                    diningOption === 'Take-Out'
                      ? 'bg-[#eb5e28] text-white border-white'
                      : 'bg-[#fff0eb] text-[#eb5e28] border-[#252422]'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="handwritten text-2xl font-bold block leading-none">
                    Takeout / To-Go
                  </span>
                  <span
                    className={`text-xs font-mono block mt-0.5 ${
                      diningOption === 'Take-Out' ? 'text-white/80' : 'text-[#403d39]'
                    }`}
                  >
                    Packed for takeout
                  </span>
                </div>
              </div>
              {diningOption === 'Take-Out' && (
                <div className="w-6 h-6 rounded-full bg-[#eb5e28] flex items-center justify-center text-white shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
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
