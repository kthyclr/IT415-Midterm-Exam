export type ProductCategory = 'Drinks' | 'Food' | 'Snacks' | 'Merch';

export type FilterCategory = 'All' | ProductCategory;

export type DiscountType = 'NONE' | 'SENIOR_PWD';

export interface Product {
  id: string;
  name: string;
  priceCentavos: number;
  category: ProductCategory;
  description: string;
  imageUrl?: string;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPriceCentavos: number;
  quantity: number;
  subtotalCentavos: number;
}

export type PaymentMethod = 'Cash' | 'QR Payment' | 'Credit/Debit Card';

export type DiningOption = 'Dine-In' | 'Take-Out';

export type KioskStage =
  | 'ITEM_SELECTION'
  | 'ORDER_SUMMARY'
  | 'PAYMENT_METHOD'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_SUCCESSFUL'
  | 'RECEIPT';

export interface CompletedTransaction {
  transactionId: string;
  createdAtIso: string;
  itemCount: number;
  items: OrderItem[];
  subtotalAmountCentavos: number;
  discountType: DiscountType;
  discountAmountCentavos: number;
  totalAmountCentavos: number;
  paymentMethod: PaymentMethod;
  diningOption: DiningOption;
  amountPaidCentavos: number;
  changeCentavos: number;
  status: 'Payment Successful';
  persistedToFirestore: boolean;
}

export interface StatusToast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}