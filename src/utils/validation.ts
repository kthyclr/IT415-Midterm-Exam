import { OrderItem, PaymentMethod } from '../types/pos';
import { formatCurrency } from './currency';

export interface CashValidationResult {
  valid: boolean;
  amountPaidCentavos: number;
  changeCentavos: number;
  errorMessage: string | null;
}

export function validateOrderNotEmpty(items: OrderItem[]): { valid: boolean; errorMessage: string | null } {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, errorMessage: 'Your cart is empty. Please tap a product to add it to your order.' };
  }
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { valid: false, errorMessage: 'Quantity cannot be negative or zero.' };
    }
    if (!Number.isInteger(item.unitPriceCentavos) || item.unitPriceCentavos <= 0) {
      return { valid: false, errorMessage: `Invalid price data for ${item.productName}.` };
    }
  }
  return { valid: true, errorMessage: null };
}

export function validateQuantityChange(newQuantity: number): { valid: boolean; errorMessage: string | null } {
  if (!Number.isFinite(newQuantity) || newQuantity < 0) {
    return { valid: false, errorMessage: 'Quantity cannot be negative.' };
  }
  if (newQuantity > 99) {
    return { valid: false, errorMessage: 'Maximum quantity per item is 99.' };
  }
  return { valid: true, errorMessage: null };
}

export function validatePaymentMethod(method: PaymentMethod | null): { valid: boolean; errorMessage: string | null } {
  if (!method || !['Cash', 'QR Payment', 'Credit/Debit Card'].includes(method)) {
    return { valid: false, errorMessage: 'Please select a valid payment method (Cash, QR Payment, or Credit/Debit Card).' };
  }
  return { valid: true, errorMessage: null };
}

export function validateCashPayment(rawInput: string, totalAmountCentavos: number): CashValidationResult {
  const trimmed = rawInput.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      amountPaidCentavos: 0,
      changeCentavos: 0,
      errorMessage: 'Please enter the cash amount tendered.',
    };
  }

  // Reject non-numeric characters (allow digits and optional single decimal point with up to 2 decimal places)
  if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
    return {
      valid: false,
      amountPaidCentavos: 0,
      changeCentavos: 0,
      errorMessage: 'Please enter a valid numeric cash amount.',
    };
  }

  const parsedPesos = Number(trimmed);
  if (!Number.isFinite(parsedPesos)) {
    return {
      valid: false,
      amountPaidCentavos: 0,
      changeCentavos: 0,
      errorMessage: 'Please enter a valid amount.',
    };
  }

  if (parsedPesos < 0) {
    return {
      valid: false,
      amountPaidCentavos: 0,
      changeCentavos: 0,
      errorMessage: 'Cash amount cannot be negative.',
    };
  }

  const amountPaidCentavos = Math.round(parsedPesos * 100);

  if (amountPaidCentavos === 0) {
    return {
      valid: false,
      amountPaidCentavos: 0,
      changeCentavos: 0,
      errorMessage: `Insufficient payment. Please enter at least ${formatCurrency(totalAmountCentavos)}.`,
    };
  }

  if (amountPaidCentavos < totalAmountCentavos) {
    return {
      valid: false,
      amountPaidCentavos,
      changeCentavos: 0,
      errorMessage: `Insufficient payment. Please enter at least ${formatCurrency(totalAmountCentavos)}.`,
    };
  }

  const changeCentavos = amountPaidCentavos - totalAmountCentavos;

  return {
    valid: true,
    amountPaidCentavos,
    changeCentavos,
    errorMessage: null,
  };
}
