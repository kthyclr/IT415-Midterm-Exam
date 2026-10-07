import React, { useMemo, useState } from 'react';
import { FilterCategory, OrderItem, Product } from '../../types/pos';
import { ProductCard } from '../ui/ProductCard';
import { CartOrderRow } from '../ui/CartOrderRow';
import { formatCurrency } from '../../utils/currency';
import {
  ShoppingBag,
  ArrowRight,
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

const CATEGORIES: FilterCategory[] = ['All', 'Drinks', 'Food', 'Snacks', 'Merch'];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Product Catalog */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Select Items
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Tap any product card below to add it to your current order.
            </p>
          </div>

          {/* Optional Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter items..."
              aria-label="Filter products by name"
              className="w-full min-h-[44px] pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear filter"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Segmented Filter Controls */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Product Categories"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[48px] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product Grid States: Loading, Error, Empty, or Cards */}
        {loadingProducts ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-10 h-10 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-900">
              Loading Campus Store Catalog...
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Connecting to Cloud Firestore product database.
            </p>
          </div>
        ) : productsError ? (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-950">
              Unable to load products. Please try again.
            </h2>
            <p className="text-sm text-red-800 mt-1 max-w-md mx-auto">
              {productsError}
            </p>
            <button
              type="button"
              onClick={onRetryLoadProducts}
              className="mt-5 min-h-[48px] px-6 py-2.5 rounded-xl bg-red-700 text-white text-sm font-semibold hover:bg-red-800 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Database Connection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-base font-semibold text-slate-700">
              No products match the current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

      {/* Right Column: Current Order / Cart Summary Panel */}
      <aside className="lg:col-span-4 lg:sticky lg:top-6 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Current Order
              </h2>
              <p className="text-xs font-mono text-slate-500 tabular-nums">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="min-h-[40px] px-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Cart Items List or Empty State */}
        {cartItems.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-slate-800">
              Your cart is empty
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px] leading-relaxed">
              Tap any product card on the left to add items to your order.
            </p>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 pr-1 my-1">
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

        {/* Order Totals & Proceed Action */}
        <div className="pt-4 mt-2 border-t border-slate-200 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Items in Order</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {totalItemCount}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-slate-900">
              Total Amount
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-800 tabular-nums">
              {formatCurrency(totalAmountCentavos)}
            </span>
          </div>

          <button
            type="button"
            onClick={onProceedToSummary}
            disabled={cartItems.length === 0}
            className={`w-full min-h-[56px] px-6 py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              cartItems.length === 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.99] shadow-sm cursor-pointer'
            }`}
          >
            <span>Review Order</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </div>
  );
};
