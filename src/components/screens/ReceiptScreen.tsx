import React from 'react';
import { CompletedTransaction } from '../../types/pos';
import { formatCurrency, formatDateTime } from '../../utils/currency';
import { Printer, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ReceiptScreenProps {
  transaction: CompletedTransaction;
  onStartNewTransaction: () => void;
}

export const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  transaction,
  onStartNewTransaction,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      {/* Digital Receipt Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs print-only-receipt">
        {/* Store Header */}
        <div className="text-center pb-5 border-b border-dashed border-slate-300">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            CAMPUS STORE POS
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Self-Service Kiosk · Official Digital Receipt
          </p>
        </div>

        {/* Transaction Metadata */}
        <div className="py-4 border-b border-dashed border-slate-300 text-xs font-mono text-slate-700 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Transaction No.:</span>
            <span className="font-bold text-slate-900">{transaction.transactionId}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">Date:</span>
            <span className="text-slate-900">{formatDateTime(transaction.createdAtIso)}</span>
          </div>
        </div>

        {/* Purchased Line Items */}
        <div className="py-4 border-b border-dashed border-slate-300 space-y-3">
          <div className="text-xs font-semibold text-slate-500 flex justify-between">
            <span>ITEM / QTY × UNIT PRICE</span>
            <span>SUBTOTAL</span>
          </div>

          {transaction.items.map((item) => (
            <div key={item.productId} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <div className="font-bold text-slate-900">{item.productName}</div>
                <div className="text-xs font-mono text-slate-600 tabular-nums mt-0.5">
                  {item.quantity} × {formatCurrency(item.unitPriceCentavos)}
                </div>
              </div>
              <div className="font-mono font-bold text-slate-900 tabular-nums">
                {formatCurrency(item.subtotalCentavos)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals & Payment Breakdown */}
        <div className="py-4 border-b border-dashed border-slate-300 space-y-2">
          <div className="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>TOTAL:</span>
            <span className="font-mono text-xl text-emerald-800 tabular-nums">
              {formatCurrency(transaction.totalAmountCentavos)}
            </span>
          </div>

          <div className="pt-2 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Payment method:</span>
              <span className="font-bold text-slate-900">{transaction.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Amount paid:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {formatCurrency(transaction.amountPaidCentavos)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Change:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {formatCurrency(transaction.changeCentavos)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600">Status:</span>
              <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {transaction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-5 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            Thank you for shopping at Campus Store!
          </p>
          <p>Please present this receipt when claiming your order.</p>
        </div>
      </div>

      {/* Kiosk Controls (Hidden when printing) */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="min-h-[56px] px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 active:scale-[0.99] text-base font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Printer className="w-5 h-5" />
          <span>Print Receipt</span>
        </button>

        <button
          type="button"
          onClick={onStartNewTransaction}
          className="flex-1 min-h-[56px] px-8 py-3.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.99] text-base font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Transaction</span>
        </button>
      </div>
    </div>
  );
};
