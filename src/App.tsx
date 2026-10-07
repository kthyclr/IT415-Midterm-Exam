/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/config';
import {
  fetchActiveProductsFromFirestore,
  saveCompletedTransactionToFirestore,
} from './firebase/posService';
import {
  CompletedTransaction,
  DiningOption,
  KioskStage,
  OrderItem,
  PaymentMethod,
  Product,
  StatusToast,
} from './types/pos';
import {
  calculateItemSubtotal,
  calculateOrderTotal,
  calculateTotalQuantity,
  formatCurrency,
} from './utils/currency';
import {
  validateOrderNotEmpty,
  validatePaymentMethod,
  validateQuantityChange,
} from './utils/validation';
import { generateTransactionReference } from './utils/transactionId';
import { StatusBanner } from './components/ui/StatusBanner';
import { ItemSelectionScreen } from './components/screens/ItemSelectionScreen';
import { OrderSummaryScreen } from './components/screens/OrderSummaryScreen';
import { PaymentMethodScreen } from './components/screens/PaymentMethodScreen';
import { PaymentProcessingScreen } from './components/screens/PaymentProcessingScreen';
import { PaymentSuccessfulScreen } from './components/screens/PaymentSuccessfulScreen';
import { ReceiptScreen } from './components/screens/ReceiptScreen';
import { AdminPortalModal } from './components/screens/AdminPortalModal';
import { BrandLogo } from './components/ui/BrandLogo';
import { Maximize2, Minimize2, RotateCcw, Shield } from 'lucide-react';

export default function App() {
  // 1. Product Catalog State (separate from transaction state)
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // 2. Authoritative Transaction / Cart State
  const [stage, setStage] = useState<KioskStage>('ITEM_SELECTION');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [diningOption, setDiningOption] = useState<DiningOption>('Dine-In');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [cashInput, setCashInput] = useState<string>('');
  const [completedTransaction, setCompletedTransaction] =
    useState<CompletedTransaction | null>(null);

  // 3. Optional Admin / Cashier Authentication & View State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);

  // 4. UI Feedback & Fullscreen State
  const [toast, setToast] = useState<StatusToast | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const toastTimerRef = useRef<number | null>(null);

  const showNotification = useCallback(
    (type: 'success' | 'error' | 'info', message: string) => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      setToast({
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
      });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 3200);
    },
    []
  );

  // Listen to Firebase Auth state for optional Cashier/Admin Portal
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load products from Cloud Firestore
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const activeList = await fetchActiveProductsFromFirestore();
      setProducts(activeList);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Unable to load products from Cloud Firestore.';
      setProductsError(msg);
      showNotification('error', 'Unable to load products. Please try again.');
    } finally {
      setLoadingProducts(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Track Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleKioskFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showNotification(
        'info',
        'Fullscreen mode is restricted by the current browser container.'
      );
    }
  };

  // Authoritative Computed Totals
  const totalAmountCentavos = useMemo(
    () => calculateOrderTotal(cartItems),
    [cartItems]
  );

  const totalItemCount = useMemo(
    () => calculateTotalQuantity(cartItems),
    [cartItems]
  );

  // Cart Handlers
  const handleAddProduct = useCallback(
    (product: Product) => {
      setCartItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === product.id);
        if (existingIndex === -1) {
          const newItem: OrderItem = {
            productId: product.id,
            productName: product.name,
            unitPriceCentavos: product.priceCentavos,
            quantity: 1,
            subtotalCentavos: calculateItemSubtotal(product.priceCentavos, 1),
          };
          return [...prev, newItem];
        }

        const existing = prev[existingIndex];
        const nextQty = existing.quantity + 1;
        const check = validateQuantityChange(nextQty);
        if (!check.valid) return prev;

        const updated: OrderItem = {
          ...existing,
          quantity: nextQty,
          subtotalCentavos: calculateItemSubtotal(
            existing.unitPriceCentavos,
            nextQty
          ),
        };
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      });

      showNotification(
        'success',
        `Product added: ${product.name} (${formatCurrency(product.priceCentavos)})`
      );
    },
    [showNotification]
  );

  const handleIncreaseQuantity = useCallback(
    (productId: string) => {
      let targetName = 'Item';
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.productId !== productId) return item;
          targetName = item.productName;
          const nextQty = item.quantity + 1;
          const check = validateQuantityChange(nextQty);
          if (!check.valid) return item;
          return {
            ...item,
            quantity: nextQty,
            subtotalCentavos: calculateItemSubtotal(
              item.unitPriceCentavos,
              nextQty
            ),
          };
        })
      );
      showNotification('info', `Quantity increased for ${targetName}.`);
    },
    [showNotification]
  );

  const handleDecreaseQuantity = useCallback(
    (productId: string) => {
      let removedItemName: string | null = null;
      let updatedItemName: string | null = null;

      setCartItems((prev) => {
        const target = prev.find((i) => i.productId === productId);
        if (!target) return prev;

        const nextQty = target.quantity - 1;
        // Quantity must never become negative; if it reaches 0, remove item cleanly
        if (nextQty <= 0) {
          removedItemName = target.productName;
          return prev.filter((i) => i.productId !== productId);
        }

        updatedItemName = target.productName;
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: nextQty,
                subtotalCentavos: calculateItemSubtotal(
                  item.unitPriceCentavos,
                  nextQty
                ),
              }
            : item
        );
      });

      if (removedItemName) {
        showNotification('info', `Removed ${removedItemName} from order.`);
      } else if (updatedItemName) {
        showNotification('info', `Quantity decreased for ${updatedItemName}.`);
      }
    },
    [showNotification]
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      const target = cartItems.find((i) => i.productId === productId);
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
      if (target) {
        showNotification('info', `Item removed: ${target.productName}.`);
      }
    },
    [cartItems, showNotification]
  );

  // Complete Transaction Reset (New Transaction)
  const handleStartNewTransaction = useCallback(() => {
    setCartItems([]);
    setDiningOption('Dine-In');
    setSelectedPaymentMethod(null);
    setCashInput('');
    setCompletedTransaction(null);
    setStage('ITEM_SELECTION');
    showNotification('info', 'Ready for a new transaction.');
  }, [showNotification]);

  // Stage Transitions
  const handleProceedToSummary = () => {
    const check = validateOrderNotEmpty(cartItems);
    if (!check.valid) {
      showNotification('error', check.errorMessage || 'Your cart is empty.');
      return;
    }
    setStage('ORDER_SUMMARY');
  };

  const handleBackToSelection = () => {
    setStage('ITEM_SELECTION');
  };

  const handleContinueToPaymentMethod = () => {
    const check = validateOrderNotEmpty(cartItems);
    if (!check.valid) {
      showNotification('error', check.errorMessage || 'Your cart is empty.');
      setStage('ITEM_SELECTION');
      return;
    }
    setStage('PAYMENT_METHOD');
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    const check = validatePaymentMethod(method);
    if (!check.valid) {
      showNotification(
        'error',
        check.errorMessage || 'Please select a payment method.'
      );
      return;
    }
    setSelectedPaymentMethod(method);
    setCashInput('');
    setStage('PAYMENT_PROCESSING');
  };

  // Finalize Payment & Persist Completed Transaction to Firestore
  const handleCompletePayment = async (
    amountPaidCentavos: number,
    changeCentavos: number
  ) => {
    const cartCheck = validateOrderNotEmpty(cartItems);
    if (!cartCheck.valid) {
      throw new Error(cartCheck.errorMessage || 'Your cart is empty.');
    }

    const methodCheck = validatePaymentMethod(selectedPaymentMethod);
    if (!methodCheck.valid || !selectedPaymentMethod) {
      throw new Error(
        methodCheck.errorMessage || 'Please select a valid payment method.'
      );
    }

    const transactionId = generateTransactionReference();
    const createdAtIso = new Date().toISOString();
    const snapshotItems: OrderItem[] = cartItems.map((item) => ({ ...item }));

    const txRecord: Omit<CompletedTransaction, 'persistedToFirestore'> = {
      transactionId,
      createdAtIso,
      itemCount: totalItemCount,
      items: snapshotItems,
      totalAmountCentavos,
      paymentMethod: selectedPaymentMethod,
      diningOption,
      amountPaidCentavos,
      changeCentavos,
      status: 'Payment Successful',
    };

    // Persist to Cloud Firestore
    await saveCompletedTransactionToFirestore(txRecord);

    const authoritativeCompleted: CompletedTransaction = {
      ...txRecord,
      persistedToFirestore: true,
    };

    setCompletedTransaction(authoritativeCompleted);
    setStage('PAYMENT_SUCCESSFUL');
    showNotification('success', 'Payment completed successfully.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffcf2] text-[#252422]">
      {/* Header matching Variation 3 */}
      <header className="bg-[#fffcf2] border-b-[3px] border-[#252422] px-6 sm:px-12 py-5 flex items-center justify-between gap-4 no-print">
        {/* Brand Logo */}
        <a
          href="#kiosk-top"
          onClick={(e) => {
            e.preventDefault();
            setShowAdminPortal(false);
          }}
          className="inline-flex items-center gap-3 group whitespace-nowrap"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#252422] flex items-center justify-center shadow-[3px_3px_0_#252422] group-active:translate-x-[1px] group-active:translate-y-[1px] transition-transform">
            <BrandLogo className="w-9 h-9" />
          </div>
          <span className="handwritten text-4xl sm:text-[2.5rem] font-bold leading-none text-[#252422]">
            Ate &amp; Served
          </span>
        </a>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAdminPortal((prev) => !prev)}
            title="Cashier / Admin Management"
            aria-label="Cashier / Admin Management"
            className={`h-11 px-3.5 border-2 border-[#252422] rounded-xl flex items-center justify-center gap-1.5 font-mono text-xs uppercase font-bold transition-colors cursor-pointer ${
              showAdminPortal
                ? 'bg-[#eb5e28] text-white'
                : 'bg-white text-[#252422] hover:bg-[#fff0eb]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showAdminPortal ? 'Kiosk' : 'Admin'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleKioskFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen Kiosk Mode"
            className="w-11 h-11 border-2 border-[#252422] rounded-xl flex items-center justify-center bg-white text-[#252422] hover:bg-[#fff0eb] transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAdminPortal(false);
              handleStartNewTransaction();
            }}
            className="h-11 px-5 rounded-xl bg-[#252422] text-white hover:bg-[#403d39] active:translate-y-0.5 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {showAdminPortal ? (
          <AdminPortalModal
            currentUser={currentUser}
            onClose={() => setShowAdminPortal(false)}
            onCatalogUpdated={loadProducts}
            onNotify={showNotification}
          />
        ) : (
          <>
            {stage === 'ITEM_SELECTION' && (
              <ItemSelectionScreen
                products={products}
                loadingProducts={loadingProducts}
                productsError={productsError}
                onRetryLoadProducts={loadProducts}
                cartItems={cartItems}
                totalAmountCentavos={totalAmountCentavos}
                totalItemCount={totalItemCount}
                onAddProduct={handleAddProduct}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleStartNewTransaction}
                onProceedToSummary={handleProceedToSummary}
              />
            )}

            {stage === 'ORDER_SUMMARY' && (
              <OrderSummaryScreen
                cartItems={cartItems}
                totalAmountCentavos={totalAmountCentavos}
                totalItemCount={totalItemCount}
                diningOption={diningOption}
                onChangeDiningOption={setDiningOption}
                onBackToSelection={handleBackToSelection}
                onContinueToPayment={handleContinueToPaymentMethod}
              />
            )}

            {stage === 'PAYMENT_METHOD' && (
              <PaymentMethodScreen
                totalAmountCentavos={totalAmountCentavos}
                selectedMethod={selectedPaymentMethod}
                onSelectPaymentMethod={handleSelectPaymentMethod}
                onBackToSummary={() => setStage('ORDER_SUMMARY')}
              />
            )}

            {stage === 'PAYMENT_PROCESSING' && selectedPaymentMethod && (
              <PaymentProcessingScreen
                paymentMethod={selectedPaymentMethod}
                totalAmountCentavos={totalAmountCentavos}
                cashInput={cashInput}
                onChangeCashInput={setCashInput}
                onBackToMethods={() => setStage('PAYMENT_METHOD')}
                onCompletePayment={handleCompletePayment}
              />
            )}

            {stage === 'PAYMENT_SUCCESSFUL' && completedTransaction && (
              <PaymentSuccessfulScreen
                transaction={completedTransaction}
                onViewReceipt={() => setStage('RECEIPT')}
                onStartNewTransaction={handleStartNewTransaction}
              />
            )}

            {stage === 'RECEIPT' && completedTransaction && (
              <ReceiptScreen
                transaction={completedTransaction}
                onStartNewTransaction={handleStartNewTransaction}
              />
            )}
          </>
        )}
      </main>

      {/* Non-blocking Status Banner */}
      <StatusBanner toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

