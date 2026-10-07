import React, { useMemo, useState } from 'react';
import { PaymentMethod } from '../../types/pos';
import { centavosToPesos, formatCurrency } from '../../utils/currency';
import { validateCashPayment } from '../../utils/validation';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import {
  ArrowLeft,
  Banknote,
  QrCode,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Delete,
  Wifi,
} from 'lucide-react';

interface PaymentProcessingScreenProps {
  paymentMethod: PaymentMethod;
  totalAmountCentavos: number;
  cashInput: string;
  onChangeCashInput: (value: string) => void;
  onBackToMethods: () => void;
  onCompletePayment: (amountPaidCentavos: number, changeCentavos: number) => Promise<void>;
}

function buildSimulatedQrMatrix(seedText: string): boolean[][] {
  const size = 17;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
        const isCenter = r === 2 && c === 2;
        grid[r0 + r][c0 + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 5);
  drawFinder(size - 5, 0);

  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 6 && c < 6;
      const inTopRight = r < 6 && c >= size - 6;
      const inBottomLeft = r >= size - 6 && c < 6;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (Math.abs(hash) % 10) < 5;
    }
  }

  return grid;
}

export const PaymentProcessingScreen: React.FC<PaymentProcessingScreenProps> = ({
  paymentMethod,
  totalAmountCentavos,
  cashInput,
  onChangeCashInput,
  onBackToMethods,
  onCompletePayment,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const liveCashPreview = useMemo(() => {
    if (cashInput.trim().length === 0) {
      return { valid: false, changeCentavos: 0, shortfallCentavos: totalAmountCentavos };
    }
    const result = validateCashPayment(cashInput, totalAmountCentavos);
    const shortfall =
      result.amountPaidCentavos < totalAmountCentavos
        ? totalAmountCentavos - result.amountPaidCentavos
        : 0;
    return {
      valid: result.valid,
      changeCentavos: result.changeCentavos,
      shortfallCentavos: shortfall,
    };
  }, [cashInput, totalAmountCentavos]);

  const qrMatrix = useMemo(
    () => buildSimulatedQrMatrix(`CAMPUS-POS-${totalAmountCentavos}`),
    [totalAmountCentavos]
  );

  const handleKeypadPress = (key: string) => {
    setValidationError(null);
    if (key === 'CLEAR') {
      onChangeCashInput('');
      return;
    }
    if (key === 'BACKSPACE') {
      onChangeCashInput(cashInput.slice(0, -1));
      return;
    }
    if (key === '.') {
      if (cashInput.includes('.')) return;
      onChangeCashInput(cashInput.length === 0 ? '0.' : `${cashInput}.`);
      return;
    }
    const parts = cashInput.split('.');
    if (parts.length === 2 && parts[1].length >= 2) return;
    if (cashInput.replace('.', '').length >= 7) return;

    const nextVal = cashInput === '0' ? key : `${cashInput}${key}`;
    onChangeCashInput(nextVal);
  };

  const handleQuickDenomination = (pesosAmount: number) => {
    setValidationError(null);
    onChangeCashInput(pesosAmount.toFixed(2).replace(/\.00$/, ''));
  };

  const handleCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateCashPayment(cashInput, totalAmountCentavos);
    if (!check.valid) {
      setValidationError(check.errorMessage);
      return;
    }

    setValidationError(null);
    setIsProcessing(true);
    try {
      await onCompletePayment(check.amountPaidCentavos, check.changeCentavos);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Unable to complete transaction. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  const handleSimulatedQrConfirm = async () => {
    setValidationError(null);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      await onCompletePayment(totalAmountCentavos, 0);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Unable to complete QR payment. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  const handleSimulatedCardProcess = async () => {
    setValidationError(null);
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await onCompletePayment(totalAmountCentavos, 0);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Unable to process card payment. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  const exactPesos = centavosToPesos(totalAmountCentavos);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <ProgressIndicator currentStage="PAYMENT_PROCESSING" variant="inline" />
      </div>

      <div className="ink-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-[#252422]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#fffcf2] border-2 border-[#252422] flex items-center justify-center text-[#eb5e28] shadow-[3px_3px_0_#252422]">
              {paymentMethod === 'Cash' && <Banknote className="w-7 h-7" />}
              {paymentMethod === 'QR Payment' && <QrCode className="w-7 h-7" />}
              {paymentMethod === 'Credit/Debit Card' && <CreditCard className="w-7 h-7" />}
            </div>
            <div>
              <h1 className="handwritten text-4xl sm:text-5xl font-bold text-[#252422] leading-none">
                {paymentMethod}
              </h1>
              <p className="text-sm text-[#403d39] mt-1">
                {paymentMethod === 'Cash'
                  ? 'Enter or tap the cash amount tendered by the customer.'
                  : paymentMethod === 'QR Payment'
                    ? 'Simulated QR Payment — scan and confirm below.'
                    : 'Simulated Credit/Debit Card Terminal — tap, insert, or swipe.'}
              </p>
            </div>
          </div>

          <div className="bg-[#fffcf2] px-5 py-3 rounded-2xl border-2 border-[#252422] text-left sm:text-right">
            <span className="kiosk-label block">Total Amount Due</span>
            <span className="text-2xl font-mono font-bold text-[#eb5e28] tabular-nums">
              {formatCurrency(totalAmountCentavos)}
            </span>
          </div>
        </div>

        {/* CASH PAYMENT FLOW */}
        {paymentMethod === 'Cash' && (
          <form onSubmit={handleCashSubmit} className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="cash-amount-input"
                  className="block kiosk-label mb-2"
                >
                  Amount Paid (₱)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono font-bold text-[#403d39]">
                    ₱
                  </span>
                  <input
                    id="cash-amount-input"
                    type="text"
                    inputMode="decimal"
                    value={cashInput}
                    onChange={(e) => {
                      setValidationError(null);
                      onChangeCashInput(e.target.value);
                    }}
                    placeholder="0.00"
                    disabled={isProcessing}
                    className="w-full min-h-[60px] pl-10 pr-4 py-3 text-2xl font-mono font-bold text-[#252422] bg-[#fffcf2] border-[3px] border-[#252422] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#eb5e28] tabular-nums"
                  />
                </div>
              </div>

              {/* Quick Denomination Touch Buttons */}
              <div>
                <span className="kiosk-label block mb-2">
                  Quick Cash Amounts
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleQuickDenomination(exactPesos)}
                    className="col-span-3 sm:col-span-2 min-h-[48px] px-3 py-2 rounded-xl bg-[#fff0eb] border-2 border-[#252422] text-[#252422] font-mono text-xs font-bold hover:bg-[#eb5e28] hover:text-white active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Exact ({formatCurrency(totalAmountCentavos)})
                  </button>
                  {[50, 100, 200, 500].map((bill) => (
                    <button
                      key={bill}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleQuickDenomination(bill)}
                      className="min-h-[48px] px-3 py-2 rounded-xl bg-white border-2 border-[#252422] text-[#252422] font-mono text-sm font-bold hover:bg-[#fffcf2] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      ₱{bill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Error Box */}
              {validationError && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-[#fff0eb] border-2 border-[#252422] flex items-start gap-3 text-[#252422]"
                >
                  <AlertCircle className="w-5 h-5 text-[#eb5e28] shrink-0 mt-0.5" />
                  <div className="text-sm font-mono font-bold">{validationError}</div>
                </div>
              )}

              {/* Live Change Calculation Box */}
              <div className="bg-[#fffcf2] rounded-2xl p-5 border-2 border-[#252422] flex flex-col gap-3 mt-auto">
                <div className="flex items-center justify-between text-sm">
                  <span className="kiosk-label">Total Amount Due</span>
                  <span className="font-mono font-bold text-[#252422] tabular-nums">
                    {formatCurrency(totalAmountCentavos)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="kiosk-label">Cash Tendered</span>
                  <span className="font-mono font-bold text-[#252422] tabular-nums">
                    {cashInput.trim() && !Number.isNaN(Number(cashInput)) && Number(cashInput) >= 0
                      ? formatCurrency(Math.round(Number(cashInput) * 100))
                      : '₱0.00'}
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-dashed border-[#252422]/30 flex items-center justify-between">
                  <span className="handwritten text-2xl font-bold text-[#252422]">
                    Change Due
                  </span>
                  <span
                    className={`text-2xl font-mono font-bold tabular-nums ${
                      liveCashPreview.valid ? 'text-[#eb5e28]' : 'text-[#403d39]/40'
                    }`}
                  >
                    {formatCurrency(liveCashPreview.changeCentavos)}
                  </span>
                </div>
              </div>
            </div>

            {/* Touchscreen Numeric Keypad */}
            <div className="lg:col-span-5 bg-[#fffcf2] p-4 rounded-2xl border-2 border-[#252422] flex flex-col justify-between">
              <span className="kiosk-label mb-2 block text-center">
                Touchscreen Keypad
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleKeypadPress(digit)}
                    className="min-h-[56px] rounded-xl bg-white border-2 border-[#252422] text-xl font-mono font-bold text-[#252422] hover:bg-[#fff0eb] active:translate-y-0.5 transition-all shadow-[2px_2px_0_#252422] cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleKeypadPress('BACKSPACE')}
                  aria-label="Backspace"
                  className="min-h-[56px] rounded-xl bg-white border-2 border-[#252422] text-[#252422] hover:bg-[#fff0eb] active:translate-y-0.5 transition-all flex items-center justify-center shadow-[2px_2px_0_#252422] cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleKeypadPress('CLEAR')}
                className="mt-2.5 w-full min-h-[48px] rounded-xl bg-[#252422] text-white font-mono text-xs font-bold uppercase hover:bg-[#403d39] transition-all cursor-pointer"
              >
                Clear Amount
              </button>
            </div>

            {/* Bottom Submit Controls */}
            <div className="lg:col-span-12 pt-4 border-t-2 border-dashed border-[#252422] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                disabled={isProcessing}
                onClick={onBackToMethods}
                className="min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Change Payment Method</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="min-h-[58px] px-10 py-3.5 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recording Transaction...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Pay Now ({formatCurrency(totalAmountCentavos)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* QR PAYMENT SIMULATION FLOW */}
        {paymentMethod === 'QR Payment' && (
          <div className="my-6 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="bg-[#fffcf2] p-6 rounded-2xl border-2 border-[#252422] w-full flex flex-col items-center">
              <span className="kiosk-label mb-3">
                SIMULATED CAMPUS QR PH TERMINAL
              </span>

              <div
                className="bg-white p-4 rounded-2xl border-[3px] border-[#252422] shadow-[4px_4px_0_#252422] inline-block"
                aria-label="Simulated Payment QR Code"
              >
                <svg
                  width="187"
                  height="187"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-44 h-44"
                >
                  {qrMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx}
                          y={rIdx}
                          width={1}
                          height={1}
                          fill="#252422"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <div className="mt-4">
                <span className="kiosk-label block">Exact Amount to Pay</span>
                <span className="text-3xl font-mono font-bold text-[#eb5e28] tabular-nums">
                  {formatCurrency(totalAmountCentavos)}
                </span>
              </div>

              <p className="text-sm text-[#403d39] mt-3 max-w-md leading-relaxed">
                Scan this QR code using any supported e-wallet or mobile banking application, then tap{' '}
                <strong className="text-[#252422]">Confirm Payment</strong> below to complete your order.
              </p>
            </div>

            {validationError && (
              <div
                role="alert"
                className="mt-4 w-full p-4 rounded-2xl bg-[#fff0eb] border-2 border-[#252422] flex items-center gap-3 text-[#252422] text-left"
              >
                <AlertCircle className="w-5 h-5 text-[#eb5e28] shrink-0" />
                <span className="text-sm font-mono font-bold">{validationError}</span>
              </div>
            )}

            <div className="w-full pt-6 mt-6 border-t-2 border-dashed border-[#252422] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                disabled={isProcessing}
                onClick={onBackToMethods}
                className="min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatedQrConfirm}
                className="min-h-[58px] px-8 py-3.5 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying QR Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* CREDIT / DEBIT CARD SIMULATION FLOW */}
        {paymentMethod === 'Credit/Debit Card' && (
          <div className="my-6 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="bg-[#fffcf2] p-8 rounded-2xl border-2 border-[#252422] w-full flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white border-[3px] border-[#252422] flex items-center justify-center text-[#eb5e28] shadow-[4px_4px_0_#252422] mb-4">
                {isProcessing ? (
                  <div className="w-9 h-9 border-3 border-[#eb5e28] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Wifi className="w-10 h-10 rotate-90" />
                )}
              </div>

              <h2 className="handwritten text-4xl font-bold text-[#252422]">
                {isProcessing
                  ? 'Processing payment...'
                  : 'Please tap, insert, or swipe your card.'}
              </h2>

              <p className="text-sm text-[#403d39] mt-2 max-w-md leading-relaxed">
                {isProcessing
                  ? 'Communicating with simulated campus card terminal. Please do not remove your card.'
                  : 'Present your contactless credit or debit card to the kiosk reader below. No card numbers or PINs are collected.'}
              </p>

              <div className="mt-5 pt-4 border-t-2 border-dashed border-[#252422]/30 w-full flex items-center justify-between text-sm max-w-xs">
                <span className="kiosk-label">Amount to Charge:</span>
                <span className="text-xl font-mono font-bold text-[#eb5e28] tabular-nums">
                  {formatCurrency(totalAmountCentavos)}
                </span>
              </div>
            </div>

            {validationError && (
              <div
                role="alert"
                className="mt-4 w-full p-4 rounded-2xl bg-[#fff0eb] border-2 border-[#252422] flex items-center gap-3 text-[#252422] text-left"
              >
                <AlertCircle className="w-5 h-5 text-[#eb5e28] shrink-0" />
                <span className="text-sm font-mono font-bold">{validationError}</span>
              </div>
            )}

            <div className="w-full pt-6 mt-6 border-t-2 border-dashed border-[#252422] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                disabled={isProcessing}
                onClick={onBackToMethods}
                className="min-h-[58px] px-6 py-3.5 rounded-2xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatedCardProcess}
                className="min-h-[58px] px-8 py-3.5 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>Process Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
