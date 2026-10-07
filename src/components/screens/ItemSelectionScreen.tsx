import React, { useMemo, useState } from 'react';
import { FilterCategory, OrderItem, Product } from '../../types/pos';
import { ProductCard } from '../ui/ProductCard';
import { CartOrderRow } from '../ui/CartOrderRow';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { formatCurrency } from '../../utils/currency';
import {
  ShoppingBag,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Search,
  X,
} from 'lucide-react';

interface ItemSelectionScreenProps {
  products: Product[];
  loadingProducts: boolean;
  productsError: string | null;
  onRetryLoadProducts: () => void;
  cartItems: OrderItem[];
  totalAmountCentavos: number;
  totalItemCount: number;
  onAddProduct: (product: Product) => void;
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToSummary: () => void;
}

const CATEGORY_TABS: { value: FilterCategory; label: string }[] = [
  { value: 'All', label: 'Show All' },
  { value: 'Drinks', label: 'Cold & Hot Drinks' },
  { value: 'Snacks', label: 'Snack Time' },
  { value: 'Food', label: 'Hot Meals' },
  { value: 'Merch', label: 'University Merch' },
];

export const ItemSelectionScreen: React.FC<ItemSelectionScreenProps> = ({
  products,
  loadingProducts,
  productsError,
  onRetryLoadProducts,
  cartItems,
  totalAmountCentavos,
  totalItemCount,
  onAddProduct,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToSummary,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const quantityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cartItems) {
      map.set(item.productId, item.quantity);
    }
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_430px] lg:overflow-hidden min-h-[calc(100vh-88px)]">
      {/* Left Scrollable Catalog Area */}
      <div className="p-6 sm:p-10 lg:p-12 lg:overflow-y-auto">
        {/* Hero Block */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <ProgressIndicator currentStage="ITEM_SELECTION" variant="inline" />
            <h1 className="handwritten text-6xl sm:text-7xl font-bold text-[#252422] leading-[0.85] mt-2 mb-3">
              Select Items
            </h1>
            <p className="text-base font-medium text-[#403d39]/80">
              Tap the cards to add them to your tray.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#403d39] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              aria-label="Filter products by name"
              className="w-full min-h-[46px] pl-11 pr-9 py-2 bg-white border-2 border-[#252422] rounded-2xl text-sm font-medium text-[#252422] placeholder:text-[#403d39]/50 focus:outline-none focus:ring-2 focus:ring-[#eb5e28]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-[#403d39] hover:text-[#252422]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div
          className="flex items-center gap-3 my-7 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Product Categories"
        >
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(tab.value)}
                className={`ink-pill min-h-[46px] text-sm ${active ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid States: Loading, Error, Empty, or Cards */}
        {loadingProducts ? (
          <div className="ink-card p-12 text-center">
            <div className="w-10 h-10 border-3 border-[#eb5e28] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="handwritten text-3xl font-bold text-[#252422]">
              Loading Ate &amp; Served Catalog...
            </h2>
            <p className="text-sm font-mono text-[#403d39] mt-1">
              Connecting to Cloud Firestore product database.
            </p>
          </div>
        ) : productsError ? (
          <div className="ink-card bg-[#fff0eb] p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-[#eb5e28] mx-auto mb-3" />
            <h2 className="handwritten text-3xl font-bold text-[#252422]">
              Unable to load products. Please try again.
            </h2>
            <p className="text-sm font-mono text-[#403d39] mt-1 max-w-md mx-auto">
              {productsError}
            </p>
            <button
              type="button"
              onClick={onRetryLoadProducts}
              className="mt-5 min-h-[48px] px-6 py-2.5 rounded-2xl ink-btn-accent font-mono text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Database Connection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="ink-card p-12 text-center">
            <p className="handwritten text-3xl font-bold text-[#252422]">
              No products match the current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="mt-4 min-h-[46px] px-6 py-2 rounded-2xl bg-[#252422] text-white font-mono text-xs font-bold uppercase cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={quantityMap.get(product.id) || 0}
                onSelectProduct={onAddProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar: Your Order */}
      <aside className="bg-white border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-[#252422] p-6 sm:p-8 flex flex-col justify-between lg:h-full lg:overflow-hidden">
        {/* Cart Header */}
        <div className="text-center pb-5 border-b-2 border-[#252422]/15 relative">
          <div className="w-16 h-16 bg-[#fffcf2] rounded-full border-2 border-[#252422] flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0_#252422]">
            <ShoppingBag className="w-8 h-8 text-[#252422]" />
          </div>
          <h2 className="handwritten text-4xl font-bold text-[#252422] leading-none">
            Your Order
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-[#403d39]/70 mt-1 tabular-nums">
            {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'} SELECTED
          </p>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="mt-3 min-h-[38px] px-3 py-1 rounded-xl border-2 border-[#252422] bg-[#fffcf2] text-xs font-mono font-bold text-[#252422] hover:bg-[#fff0eb] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Tray
            </button>
          )}
        </div>

        {/* Cart Items List or Empty State */}
        {cartItems.length === 0 ? (
          <div className="flex-1 py-12 px-4 flex flex-col items-center justify-center text-center opacity-50">
            <p className="handwritten text-3xl font-bold text-[#252422]">
              Cart is feeling light!
            </p>
            <p className="text-sm text-[#403d39] mt-1">
              Pick some goodies from the left.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto my-4 pr-1 divide-y divide-transparent">
            {cartItems.map((item) => (
              <CartOrderRow
                key={item.productId}
                item={item}
                onIncrease={onIncreaseQuantity}
                onDecrease={onDecreaseQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        )}

        {/* Order Summary Footer */}
        <div className="pt-6 border-t-2 border-dashed border-[#252422]">
          <div className="flex items-center justify-between mb-2">
            <span className="kiosk-label">Subtotal</span>
            <span className="font-mono font-bold text-sm text-[#252422] tabular-nums">
              {formatCurrency(totalAmountCentavos)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="kiosk-label">Items</span>
            <span className="font-mono font-bold text-sm text-[#252422] tabular-nums">
              {totalItemCount}
            </span>
          </div>

          <div className="font-mono text-4xl font-bold text-[#eb5e28] text-right my-4 tabular-nums">
            {formatCurrency(totalAmountCentavos)}
          </div>

          <button
            type="button"
            onClick={onProceedToSummary}
            disabled={cartItems.length === 0}
            className={`w-full py-4 px-6 rounded-[20px] handwritten text-3xl font-bold border-[3px] border-[#252422] shadow-[4px_4px_0_#252422] transition-all ${
              cartItems.length === 0
                ? 'bg-[#eb5e28] text-white opacity-60 cursor-not-allowed'
                : 'ink-btn-accent cursor-pointer'
            }`}
          >
            Review Tray
          </button>
        </div>
      </aside>
    </div>
  );
};
