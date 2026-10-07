import React from 'react';
import { CompletedTransaction } from '../../types/pos';
import { formatCurrency, formatDateTime } from '../../utils/currency';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { BrandLogo } from '../ui/BrandLogo';
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
      <div className="mb-5 no-print">
        <ProgressIndicator currentStage="RECEIPT" variant="inline" />
      </div>

      {/* Digital Receipt Card */}
      <div className="ink-card p-6 sm:p-8 print-only-receipt">
        {/* Store Header */}
        <div className="text-center pb-5 border-b-2 border-dashed border-[#252422] flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#252422] flex items-center justify-center mb-2.5 shadow-[2px_2px_0_#252422]">
            <BrandLogo className="w-10 h-10" />
          </div>
          <h1 className="handwritten text-4xl font-bold text-[#252422] leading-none">
            ATE &amp; SERVED POS
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-[#403d39] mt-1">
            Self-Service Kiosk · Official Digital Receipt
          </p>
        </div>

        {/* Transaction Metadata */}
        <div className="py-4 border-b-2 border-dashed border-[#252422] text-xs font-mono text-[#252422] space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#403d39]">Transaction No.:</span>
            <span className="font-bold text-[#252422]">{transaction.transactionId}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#403d39]">Order Type:</span>
            <span className="font-bold text-[#eb5e28]">
              {transaction.diningOption === 'Take-Out' ? 'TAKEOUT / TO-GO' : 'EAT IN / DINE-IN'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#403d39]">Date:</span>
            <span className="text-[#252422]">{formatDateTime(transaction.createdAtIso)}</span>
          </div>
        </div>

        {/* Purchased Line Items */}
        <div className="py-4 border-b-2 border-dashed border-[#252422] space-y-3">
          <div className="kiosk-label flex justify-between">
            <span>ITEM / QTY × UNIT PRICE</span>
            <span>SUBTOTAL</span>
          </div>

          {transaction.items.map((item) => (
            <div key={item.productId} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <div className="handwritten text-2xl font-bold text-[#252422] leading-none">
                  {item.productName}
                </div>
                <div className="text-xs font-mono text-[#403d39] tabular-nums mt-1">
                  {item.quantity} × {formatCurrency(item.unitPriceCentavos)}
                </div>
              </div>
              <div className="font-mono font-bold text-[#252422] tabular-nums">
                {formatCurrency(item.subtotalCentavos)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals & Payment Breakdown */}
        <div className="py-4 border-b-2 border-dashed border-[#252422] space-y-2">
          <div className="flex items-center justify-between">
            <span className="handwritten text-3xl font-bold text-[#252422]">TOTAL:</span>
            <span className="font-mono text-2xl font-bold text-[#eb5e28] tabular-nums">
              {formatCurrency(transaction.totalAmountCentavos)}
            </span>
          </div>

          <div className="pt-2 space-y-1.5 text-sm font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#403d39]">Payment method:</span>
              <span className="font-bold text-[#252422]">{transaction.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#403d39]">Amount paid:</span>
              <span className="font-bold text-[#252422] tabular-nums">
                {formatCurrency(transaction.amountPaidCentavos)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#403d39]">Change:</span>
              <span className="font-bold text-[#252422] tabular-nums">
                {formatCurrency(transaction.changeCentavos)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#403d39]">Status:</span>
              <span className="font-bold text-[#eb5e28] inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {transaction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-5 text-center space-y-1">
          <p className="handwritten text-2xl font-bold text-[#252422]">
            Thank you for shopping at Ate &amp; Served!
          </p>
          <p className="text-xs font-mono text-[#403d39]">
            Please present this receipt when claiming your order.
          </p>
        </div>
      </div>

      {/* Kiosk Controls (Hidden when printing) */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Printer className="w-5 h-5" />
          <span>Print Receipt</span>
        </button>

        <button
          type="button"
          onClick={onStartNewTransaction}
          className="flex-1 min-h-[58px] px-8 py-3.5 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-6 h-6" />
          <span>New Transaction</span>
        </button>
      </div>
    </div>
  );
};
