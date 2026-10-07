import React, { useEffect, useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, BOOTSTRAPPED_ADMIN_EMAIL } from '../../firebase/config';
import {
  fetchAllProductsForAdmin,
  fetchTransactionsForAdmin,
  createProductInFirestore,
  toggleProductActiveInFirestore,
  deleteProductInFirestore,
} from '../../firebase/posService';
import { CompletedTransaction, Product, ProductCategory } from '../../types/pos';
import { formatCurrency, formatDateTime, pesosToCentavos } from '../../utils/currency';
import {
  ShieldCheck,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  ArrowLeft,
  Package,
  Receipt,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface AdminPortalModalProps {
  currentUser: User | null;
  onClose: () => void;
  onCatalogUpdated: () => void;
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  currentUser,
  onClose,
  onCatalogUpdated,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'products'>('transactions');
  const [transactions, setTransactions] = useState<CompletedTransaction[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const [newProdName, setNewProdName] = useState('');
  const [newProdPricePesos, setNewProdPricePesos] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Drinks');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const isAuthorizedAdmin =
    Boolean(currentUser) &&
    currentUser?.emailVerified === true &&
    currentUser?.email === BOOTSTRAPPED_ADMIN_EMAIL;

  const loadAdminData = async () => {
    if (!isAuthorizedAdmin) return;
    setLoadingData(true);
    setAdminError(null);
    try {
      const [txList, prodList] = await Promise.all([
        fetchTransactionsForAdmin(),
        fetchAllProductsForAdmin(),
      ]);
      setTransactions(txList);
      setAdminProducts(prodList);
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : 'Unable to load admin records from Firestore.'
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadAdminData();
    }
  }, [isAuthorizedAdmin]);

  const handleGoogleLogin = async () => {
    setAdminError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onNotify('success', 'Signed in with Google.');
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : 'Authentication cancelled or failed.'
      );
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onNotify('info', 'Signed out of Cashier/Admin session.');
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newProdName.trim();
    const parsedPrice = Number(newProdPricePesos);
    if (!trimmedName || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setAdminError('Please enter a valid product name and positive price.');
      return;
    }

    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const productId = `prod-${slug}-${Date.now().toString(36)}`;

    setSubmittingProduct(true);
    setAdminError(null);
    try {
      await createProductInFirestore({
        id: productId,
        name: trimmedName,
        priceCentavos: pesosToCentavos(parsedPrice),
        category: newProdCategory,
        description:
          newProdDescription.trim() || `${trimmedName} (${newProdCategory})`,
        active: true,
      });
      setNewProdName('');
      setNewProdPricePesos('');
      setNewProdDescription('');
      await loadAdminData();
      onCatalogUpdated();
      onNotify('success', `Added "${trimmedName}" to Firestore catalog.`);
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : 'Failed to create product in Firestore.'
      );
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleToggleProduct = async (product: Product) => {
    try {
      await toggleProductActiveInFirestore(product.id, !product.active);
      await loadAdminData();
      onCatalogUpdated();
      onNotify(
        'info',
        `${product.name} is now ${!product.active ? 'Active' : 'Inactive'}.`
      );
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : 'Failed to update product status.'
      );
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await deleteProductInFirestore(product.id);
      await loadAdminData();
      onCatalogUpdated();
      onNotify('info', `Removed ${product.name} from catalog.`);
    } catch (err) {
      setAdminError(
        err instanceof Error ? err.message : 'Failed to delete product.'
      );
    }
  };

  const totalSalesCentavos = transactions.reduce(
    (sum, t) => sum + t.totalAmountCentavos,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="ink-card p-6 sm:p-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-[#252422]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#252422] flex items-center justify-center text-[#fffcf2] shadow-[3px_3px_0_#eb5e28]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="kiosk-label block">Protected Management</span>
              <h1 className="handwritten text-4xl sm:text-5xl font-bold text-[#252422] leading-none">
                Cashier &amp; Admin Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[48px] px-4 py-2.5 rounded-xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#252422] text-white hover:bg-[#403d39] font-mono text-xs font-bold uppercase inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Kiosk</span>
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!currentUser ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <h2 className="handwritten text-4xl font-bold text-[#252422]">
              Admin Authentication Required
            </h2>
            <p className="text-sm text-[#403d39] mt-2 leading-relaxed">
              Normal kiosk customers do not need to sign in to place orders. Sign in with your authorized Google account to view Firestore transaction history or manage products.
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-6 min-h-[54px] px-8 py-3 rounded-2xl ink-btn-accent handwritten text-3xl font-bold inline-flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In with Google</span>
            </button>
          </div>
        ) : !isAuthorizedAdmin ? (
          <div className="py-10 text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-[#eb5e28] mx-auto mb-3" />
            <h2 className="handwritten text-3xl font-bold text-[#252422]">
              Signed in as {currentUser.email}
            </h2>
            <p className="text-sm font-mono text-[#403d39] mt-1">
              This account does not have Administrator privileges in Firestore rules (`{BOOTSTRAPPED_ADMIN_EMAIL}`).
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#fffcf2] p-4 rounded-2xl border-2 border-[#252422]">
                <span className="kiosk-label block">Completed Transactions</span>
                <span className="text-2xl font-mono font-bold text-[#252422] tabular-nums mt-1 block">
                  {transactions.length}
                </span>
              </div>
              <div className="bg-[#fffcf2] p-4 rounded-2xl border-2 border-[#252422]">
                <span className="kiosk-label block">Total Recorded Sales</span>
                <span className="text-2xl font-mono font-bold text-[#eb5e28] tabular-nums mt-1 block">
                  {formatCurrency(totalSalesCentavos)}
                </span>
              </div>
              <div className="bg-[#fffcf2] p-4 rounded-2xl border-2 border-[#252422]">
                <span className="kiosk-label block">Catalog Products</span>
                <span className="text-2xl font-mono font-bold text-[#252422] tabular-nums mt-1 block">
                  {adminProducts.filter((p) => p.active).length} active / {adminProducts.length} total
                </span>
              </div>
            </div>

            {/* Tabs & Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('transactions')}
                  className={`ink-pill text-sm inline-flex items-center gap-2 ${
                    activeTab === 'transactions' ? 'active' : ''
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  <span>Transaction History</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className={`ink-pill text-sm inline-flex items-center gap-2 ${
                    activeTab === 'products' ? 'active' : ''
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Product Catalog</span>
                </button>
              </div>

              <button
                type="button"
                onClick={loadAdminData}
                disabled={loadingData}
                className="min-h-[44px] px-4 py-2 rounded-xl ink-btn-secondary font-mono text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                <span>Refresh Firestore</span>
              </button>
            </div>

            {adminError && (
              <div className="mb-6 p-4 rounded-2xl bg-[#fff0eb] border-2 border-[#252422] text-sm font-mono font-bold text-[#252422] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#eb5e28] shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            {/* Tab 1: Transaction History */}
            {activeTab === 'transactions' && (
              <div className="overflow-x-auto border-2 border-[#252422] rounded-2xl">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center font-mono text-sm text-[#403d39]">
                    No completed transactions recorded in Firestore yet.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#fffcf2] border-b-2 border-[#252422] font-mono text-xs uppercase text-[#403d39]">
                        <th className="py-3 px-4">Transaction No.</th>
                        <th className="py-3 px-4">Date / Time</th>
                        <th className="py-3 px-4">Dining Option</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-right">Paid</th>
                        <th className="py-3 px-4 text-right">Change</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-dashed divide-[#252422]/20 font-mono text-xs">
                      {transactions.map((tx) => (
                        <tr key={tx.transactionId}>
                          <td className="py-3.5 px-4 font-bold text-[#252422]">
                            {tx.transactionId}
                          </td>
                          <td className="py-3.5 px-4 text-[#403d39]">
                            {formatDateTime(tx.createdAtIso)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#252422]">
                            {tx.diningOption === 'Take-Out' ? 'Takeout' : 'Dine-In'}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#252422]">
                            {tx.paymentMethod}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-[#252422] tabular-nums">
                            {formatCurrency(tx.totalAmountCentavos)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-[#403d39] tabular-nums">
                            {formatCurrency(tx.amountPaidCentavos)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-[#403d39] tabular-nums">
                            {formatCurrency(tx.changeCentavos)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#eb5e28]">
                            {tx.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Tab 2: Product Management */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form
                  onSubmit={handleCreateProduct}
                  className="lg:col-span-4 bg-[#fffcf2] p-5 rounded-2xl border-2 border-[#252422] flex flex-col gap-3.5 h-fit"
                >
                  <h3 className="handwritten text-3xl font-bold text-[#252422]">
                    Add New Product
                  </h3>

                  <div>
                    <label className="block kiosk-label mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Iced Matcha Latte"
                      className="w-full min-h-[44px] px-3 py-2 bg-white border-2 border-[#252422] rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block kiosk-label mb-1">
                        Price (₱)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={newProdPricePesos}
                        onChange={(e) => setNewProdPricePesos(e.target.value)}
                        placeholder="55.00"
                        className="w-full min-h-[44px] px-3 py-2 bg-white border-2 border-[#252422] rounded-xl text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block kiosk-label mb-1">
                        Category
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                        className="w-full min-h-[44px] px-3 py-2 bg-white border-2 border-[#252422] rounded-xl text-sm"
                      >
                        <option value="Drinks">Drinks</option>
                        <option value="Food">Food</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Merch">Merch</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block kiosk-label mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      maxLength={300}
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      placeholder="Short item description"
                      className="w-full min-h-[44px] px-3 py-2 bg-white border-2 border-[#252422] rounded-xl text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="mt-2 min-h-[48px] px-4 py-2.5 rounded-xl ink-btn-accent handwritten text-2xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{submittingProduct ? 'Saving...' : 'Add Product'}</span>
                  </button>
                </form>

                <div className="lg:col-span-8 overflow-x-auto border-2 border-[#252422] rounded-2xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#fffcf2] border-b-2 border-[#252422] font-mono text-xs uppercase text-[#403d39]">
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-dashed divide-[#252422]/20">
                      {adminProducts.map((prod) => (
                        <tr key={prod.id}>
                          <td className="py-3.5 px-4 handwritten text-2xl font-bold text-[#252422]">
                            {prod.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-[#403d39]">{prod.category}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#252422] tabular-nums">
                            {formatCurrency(prod.priceCentavos)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-xs font-mono font-bold ${
                                prod.active ? 'text-[#eb5e28]' : 'text-[#403d39]/50'
                              }`}
                            >
                              {prod.active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleProduct(prod)}
                              className="min-h-[38px] px-3 py-1.5 rounded-xl border-2 border-[#252422] bg-[#fffcf2] hover:bg-[#fff0eb] text-xs font-mono font-bold text-[#252422] cursor-pointer"
                            >
                              {prod.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod)}
                              aria-label={`Delete ${prod.name}`}
                              className="min-h-[38px] px-2.5 py-1.5 rounded-xl border-2 border-[#252422] text-[#eb5e28] hover:bg-[#fff0eb] text-xs font-mono font-bold inline-flex items-center cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
