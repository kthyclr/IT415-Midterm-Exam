import React from 'react';
import { PaymentMethod } from '../../types/pos';
import { formatCurrency } from '../../utils/currency';
import { PaymentMethodCard } from '../ui/PaymentMethodCard';
import { ProgressIndicator } from '../ui/ProgressIndicator';
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <ProgressIndicator currentStage="PAYMENT_METHOD" variant="inline" />
          <h1 className="handwritten text-5xl sm:text-6xl font-bold text-[#252422] leading-[0.85] mt-2">
            Choose Payment Method
          </h1>
          <p className="text-sm font-medium text-[#403d39]/80 mt-2">
            Tap your preferred payment option below to complete your order.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border-[3px] border-[#252422] shadow-[4px_4px_0_#252422] text-left sm:text-right">
          <span className="kiosk-label block">Amount Due</span>
          <span className="text-2xl font-mono font-bold text-[#eb5e28] tabular-nums">
            {formatCurrency(totalAmountCentavos)}
          </span>
        </div>
      </div>

      {/* Three Large Touchscreen Payment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
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

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToSummary}
          className="min-h-[54px] px-6 py-3 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Order Summary</span>
        </button>
      </div>
    </div>
  );
};
