import React from 'react';
import { CompletedTransaction } from '../../types/pos';
import { formatCurrency, formatDateTime } from '../../utils/currency';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { CheckCircle2, FileText, RotateCcw } from 'lucide-react';

interface PaymentSuccessfulScreenProps {
  transaction: CompletedTransaction;
  onViewReceipt: () => void;
  onStartNewTransaction: () => void;
}

export const PaymentSuccessfulScreen: React.FC<PaymentSuccessfulScreenProps> = ({
  transaction,
  onViewReceipt,
  onStartNewTransaction,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-5">
        <ProgressIndicator currentStage="PAYMENT_SUCCESSFUL" variant="inline" />
      </div>

      <div className="ink-card p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#fff0eb] border-[3px] border-[#252422] flex items-center justify-center text-[#eb5e28] mx-auto mb-4 shadow-[3px_3px_0_#252422]">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <h1 className="handwritten text-5xl sm:text-6xl font-bold text-[#252422] leading-none">
          Payment Successful
        </h1>
        <p className="text-sm text-[#403d39] mt-2">
          Your order has been confirmed and recorded in Firestore.
        </p>

        {/* Reference Number Highlight */}
        <div className="my-6 bg-[#fffcf2] rounded-2xl p-5 border-2 border-[#252422]">
          <span className="kiosk-label block">
            Transaction Reference Number
          </span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-[#252422] mt-1 block tracking-tight">
            {transaction.transactionId}
          </span>
          <span className="text-xs font-mono text-[#403d39] mt-1 block">
            {formatDateTime(transaction.createdAtIso)}
          </span>
        </div>

        {/* Authoritative Transaction Summary */}
        <div className="bg-white rounded-2xl border-2 border-[#252422] p-5 text-left divide-y-2 divide-dashed divide-[#252422]/20">
          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Dining Option</span>
            <span className="font-mono font-bold text-[#252422]">
              {transaction.diningOption === 'Take-Out' ? 'Takeout / To-Go' : 'Eat In / Dine-In'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Payment Method</span>
            <span className="font-mono font-bold text-[#252422]">{transaction.paymentMethod}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Subtotal</span>
            <span className="font-mono font-bold text-[#252422] tabular-nums">
              {formatCurrency(transaction.subtotalAmountCentavos)}
            </span>
          </div>

          {transaction.discountAmountCentavos > 0 && (
            <div className="py-2.5 flex items-center justify-between text-sm">
              <span className="kiosk-label text-[#eb5e28]">Discount (20%)</span>
              <span className="font-mono font-bold text-[#eb5e28] tabular-nums">
                -{formatCurrency(transaction.discountAmountCentavos)}
              </span>
            </div>
          )}

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Total Amount</span>
            <span className="font-mono font-bold text-[#eb5e28] tabular-nums text-lg">
              {formatCurrency(transaction.totalAmountCentavos)}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Amount Paid</span>
            <span className="font-mono font-bold text-[#252422] tabular-nums">
              {formatCurrency(transaction.amountPaidCentavos)}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Change</span>
            <span className="font-mono font-bold text-[#eb5e28] tabular-nums">
              {formatCurrency(transaction.changeCentavos)}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="kiosk-label">Status</span>
            <span className="font-mono font-bold text-[#eb5e28]">{transaction.status}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <button
            type="button"
            onClick={onViewReceipt}
            className="flex-1 min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-6 h-6" />
            <span>View Receipt</span>
          </button>

          <button
            type="button"
            onClick={onStartNewTransaction}
            className="flex-1 min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
