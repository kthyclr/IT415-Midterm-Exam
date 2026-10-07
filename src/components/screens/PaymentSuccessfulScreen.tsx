import React from 'react';
import { CompletedTransaction } from '../../types/pos';
import { formatCurrency, formatDateTime } from '../../utils/currency';
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Payment Successful
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your order has been confirmed and recorded.
        </p>

        {/* Reference Number Highlight */}
        <div className="my-6 bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">
            Transaction Reference Number
          </span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1 block tracking-tight">
            {transaction.transactionId}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {formatDateTime(transaction.createdAtIso)}
          </span>
        </div>

        {/* Authoritative Transaction Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left divide-y divide-slate-100">
          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Payment Method</span>
            <span className="font-bold text-slate-900">{transaction.paymentMethod}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Transaction Amount</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {formatCurrency(transaction.totalAmountCentavos)}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Amount Paid</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {formatCurrency(transaction.amountPaidCentavos)}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Change</span>
            <span className="font-mono font-bold text-emerald-700 tabular-nums">
              {formatCurrency(transaction.changeCentavos)}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Status</span>
            <span className="font-bold text-emerald-700">{transaction.status}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <button
            type="button"
            onClick={onViewReceipt}
            className="flex-1 min-h-[56px] px-6 py-3.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.99] text-base font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-5 h-5" />
            <span>View Receipt</span>
          </button>

          <button
            type="button"
            onClick={onStartNewTransaction}
            className="flex-1 min-h-[56px] px-6 py-3.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.99] text-base font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
