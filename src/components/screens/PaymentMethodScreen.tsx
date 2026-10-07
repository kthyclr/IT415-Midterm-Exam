import React from 'react';
import { PaymentMethod } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import { PaymentMethodCard } from '../ui/PaymentMethodCard';
import { ArrowLeft, Wallet } from 'lucide-react';

interface PaymentMethodScreenProps {
  totalAmountCentavos: number;
  selectedMethod: PaymentMethod | null;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onBackToSummary: () => void;
}

export const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({
  totalAmountCentavos,
  selectedMethod,
  onSelectPaymentMethod,
  onBackToSummary,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Choose Payment Method
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Tap your preferred payment option below to complete your order.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 text-left sm:text-right">
            <span className="text-xs font-medium text-slate-500 block">
              Amount Due
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-800 tabular-nums">
              {formatCurrency(totalAmountCentavos)}
            </span>
          </div>
        </div>

        {/* Three Large Touchscreen Payment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
          <PaymentMethodCard
            method="Cash"
            title="Cash"
            subtitle="Bills & Coins"
            description="Pay with Philippine Peso bills or coins. Enter the cash amount tendered and receive exact change computation."
            selected={selectedMethod === 'Cash'}
            onSelect={onSelectPaymentMethod}
          />

          <PaymentMethodCard
            method="QR Payment"
            title="QR Payment"
            subtitle="Instant Scan"
            description="Scan the generated kiosk QR code using your mobile wallet or banking app for exact-amount digital payment."
            selected={selectedMethod === 'QR Payment'}
            onSelect={onSelectPaymentMethod}
          />

          <PaymentMethodCard
            method="Credit/Debit Card"
            title="Credit/Debit Card"
            subtitle="Tap / Insert / Swipe"
            description="Pay with your contactless credit or debit card on the kiosk terminal reader with instant verification."
            selected={selectedMethod === 'Credit/Debit Card'}
            onSelect={onSelectPaymentMethod}
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToSummary}
            className="min-h-[54px] px-6 py-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.99] text-base font-bold inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Order Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
