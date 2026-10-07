import React from 'react';
import { DiningOption, OrderItem, PaymentMethod } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import {
  CheckCircle2,
  X,
  Utensils,
  ShoppingBag,
  Banknote,
  QrCode,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  cartItems: OrderItem[];
  diningOption: DiningOption;
  paymentMethod: PaymentMethod;
  subtotalAmountCentavos: number;
  discountAmountCentavos: number;
  totalAmountCentavos: number;
  amountPaidCentavos: number;
  changeCentavos: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  isOpen,
  cartItems,
  diningOption,
  paymentMethod,
  subtotalAmountCentavos,
  discountAmountCentavos,
  totalAmountCentavos,
  amountPaidCentavos,
  changeCentavos,
  isSubmitting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-payment-title"
    >
      <div className="ink-card w-full max-w-lg p-6 sm:p-8 max-h-[90vh] flex flex-col justify-between bg-white animate-in fade-in zoom-in-95 duration-150">
        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-dashed border-[#252422]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fff0eb] border-2 border-[#252422] flex items-center justify-center text-[#eb5e28] shadow-[3px_3px_0_#252422] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="kiosk-label block">Final Verification</span>
              <h2
                id="confirm-payment-title"
                className="handwritten text-4xl font-bold text-[#252422] leading-none"
              >
                Confirm Payment
              </h2>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="w-10 h-10 rounded-xl border-2 border-[#252422] bg-[#fffcf2] text-[#252422] hover:bg-[#fff0eb] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Order & Input Details */}
        <div className="my-5 overflow-y-auto pr-1 space-y-4">
          {/* Dining Option & Payment Method Pills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#fffcf2] border-2 border-[#252422]">
              <span className="kiosk-label block">Dining Option</span>
              <div className="mt-1 flex items-center gap-2 font-mono text-xs font-bold text-[#252422]">
                {diningOption === 'Take-Out' ? (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#eb5e28]" />
                    <span>Takeout / To-Go</span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-[#eb5e28]" />
                    <span>Eat In / Dine-In</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#fffcf2] border-2 border-[#252422]">
              <span className="kiosk-label block">Payment Method</span>
              <div className="mt-1 flex items-center gap-2 font-mono text-xs font-bold text-[#252422]">
                {paymentMethod === 'Cash' && <Banknote className="w-4 h-4 text-[#eb5e28]" />}
                {paymentMethod === 'QR Payment' && <QrCode className="w-4 h-4 text-[#eb5e28]" />}
                {paymentMethod === 'Credit/Debit Card' && (
                  <CreditCard className="w-4 h-4 text-[#eb5e28]" />
                )}
                <span>{paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Itemized List */}
          <div className="rounded-2xl border-2 border-[#252422] bg-white p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-dashed border-[#252422]/20">
              <span className="kiosk-label">Selected Items ({totalItems})</span>
              <span className="kiosk-label">Subtotal</span>
            </div>

            <div className="divide-y divide-dashed divide-[#252422]/15 max-h-40 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="py-2 flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <span className="handwritten text-2xl font-bold text-[#252422] leading-none block">
                      {item.productName}
                    </span>
                    <span className="font-mono text-xs text-[#403d39] tabular-nums">
                      {item.quantity} × {formatCurrency(item.unitPriceCentavos)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#252422] tabular-nums">
                    {formatCurrency(item.subtotalCentavos)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monetary Summary Breakdown */}
          <div className="rounded-2xl border-2 border-[#252422] bg-[#fffcf2] p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="kiosk-label">Subtotal</span>
              <span className="font-mono font-bold text-[#252422] tabular-nums">
                {formatCurrency(subtotalAmountCentavos)}
              </span>
            </div>

            {discountAmountCentavos > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="kiosk-label text-[#eb5e28]">Discount (20%)</span>
                <span className="font-mono font-bold text-[#eb5e28] tabular-nums">
                  -{formatCurrency(discountAmountCentavos)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm pt-2 border-t-2 border-dashed border-[#252422]/10">
              <span className="kiosk-label">Total Amount Due</span>
              <span className="font-mono font-bold text-[#252422] tabular-nums">
                {formatCurrency(totalAmountCentavos)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="kiosk-label">Amount Paid / Tendered</span>
              <span className="font-mono font-bold text-[#252422] tabular-nums">
                {formatCurrency(amountPaidCentavos)}
              </span>
            </div>

            <div className="pt-2 border-t-2 border-dashed border-[#252422]/30 flex items-center justify-between">
              <span className="handwritten text-2xl font-bold text-[#252422]">
                Change Due
              </span>
              <span className="font-mono text-xl font-bold text-[#eb5e28] tabular-nums">
                {formatCurrency(changeCentavos)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 mt-auto border-t-2 border-dashed border-[#252422] flex flex-col sm:flex-row gap-3.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="flex-1 min-h-[58px] px-4 py-3 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center cursor-pointer disabled:opacity-50 transition-all active:translate-y-0.5"
          >
            Edit / Go Back
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="flex-[1.5] min-h-[58px] px-5 py-3 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 transition-all active:translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>Confirm & Pay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
