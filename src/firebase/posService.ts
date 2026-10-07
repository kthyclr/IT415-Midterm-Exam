import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { CompletedTransaction, Product } from '../types/pos';
import { INITIAL_CAMPUS_PRODUCTS, resolveProductImage } from '../data/initialProducts';

const PRODUCTS_COLLECTION = 'products';
const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Ensures the initial 8 campus store products exist in Firestore.
 * Uses getDoc and setDoc with serverTimestamp() so rules validate creation cleanly.
 */
export async function ensureInitialProductsSeeded(): Promise<void> {
  for (const product of INITIAL_CAMPUS_PRODUCTS) {
    const productRef = doc(db, PRODUCTS_COLLECTION, product.id);
    try {
      const snap = await getDoc(productRef);
      if (!snap.exists()) {
        await setDoc(productRef, {
          id: product.id,
          name: product.name.slice(0, 100),
          priceCentavos: Math.round(product.priceCentavos),
          category: product.category,
          description: product.description.slice(0, 300),
          active: product.active,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      // If a single seed check fails due to permissions or network, surface via handler
      handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
    }
  }
}

/**
 * Loads active products for the Kiosk Item Selection screen.
 * Queries active == true to satisfy security rules for public kiosk access.
 */
export async function fetchActiveProductsFromFirestore(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), where('active', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await ensureInitialProductsSeeded();
      const retrySnap = await getDocs(q);
      return sortProducts(
        retrySnap.docs.map((d) => parseProductDoc(d.id, d.data()))
      );
    }

    return sortProducts(
      snapshot.docs.map((d) => parseProductDoc(d.id, d.data()))
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

/**
 * Loads all products (active + inactive) for authenticated Admin management.
 */
export async function fetchAllProductsForAdmin(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return sortProducts(snapshot.docs.map((d) => parseProductDoc(d.id, d.data())));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

function parseProductDoc(docId: string, data: Record<string, unknown>): Product {
  const id = typeof data.id === 'string' ? data.id : docId;
  const name = typeof data.name === 'string' ? data.name : 'Unnamed Product';
  const category =
    data.category === 'Drinks' ||
    data.category === 'Food' ||
    data.category === 'Snacks' ||
    data.category === 'Merch'
      ? data.category
      : 'Food';
  const rawImageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : undefined;

  return {
    id,
    name,
    priceCentavos: typeof data.priceCentavos === 'number' ? Math.round(data.priceCentavos) : 0,
    category,
    description: typeof data.description === 'string' ? data.description : '',
    imageUrl: resolveProductImage({ id, name, category, imageUrl: rawImageUrl }),
    active: Boolean(data.active),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function sortProducts(products: Product[]): Product[] {
  const orderMap = new Map<string, number>(
    INITIAL_CAMPUS_PRODUCTS.map((p, index) => [p.id, index])
  );
  return [...products].sort((a, b) => {
    const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
    const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
    if (idxA !== idxB) return idxA - idxB;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Saves a completed kiosk transaction to Firestore.
 * Strictly adheres to the Transaction entity in firebase-blueprint.json and firestore.rules.
 */
export async function saveCompletedTransactionToFirestore(
  tx: Omit<CompletedTransaction, 'persistedToFirestore'>
): Promise<void> {
  const path = `${TRANSACTIONS_COLLECTION}/${tx.transactionId}`;
  try {
    const txRef = doc(db, TRANSACTIONS_COLLECTION, tx.transactionId);
    const sanitizedItems = tx.items.slice(0, 50).map((item) => ({
      productId: item.productId.slice(0, 128),
      productName: item.productName.slice(0, 100),
      unitPriceCentavos: Math.round(item.unitPriceCentavos),
      quantity: Math.round(item.quantity),
      subtotalCentavos: Math.round(item.subtotalCentavos),
    }));

    await setDoc(txRef, {
      transactionId: tx.transactionId.slice(0, 64),
      createdAt: serverTimestamp(),
      createdAtIso: tx.createdAtIso.slice(0, 40),
      itemCount: Math.round(tx.itemCount),
      items: sanitizedItems,
      subtotalAmountCentavos: Math.round(tx.subtotalAmountCentavos),
      discountType: tx.discountType,
      discountAmountCentavos: Math.round(tx.discountAmountCentavos),
      totalAmountCentavos: Math.round(tx.totalAmountCentavos),
      paymentMethod: tx.paymentMethod,
      diningOption: tx.diningOption || 'Dine-In',
      amountPaidCentavos: Math.round(tx.amountPaidCentavos),
      changeCentavos: Math.round(tx.changeCentavos),
      status: 'Payment Successful',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Fetches completed transactions for Admin Transaction History view.
 */
export async function fetchTransactionsForAdmin(): Promise<CompletedTransaction[]> {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('status', '==', 'Payment Successful')
    );
    const snapshot = await getDocs(q);
    const list: CompletedTransaction[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        transactionId: String(data.transactionId || d.id),
        createdAtIso: String(data.createdAtIso || new Date().toISOString()),
        itemCount: Number(data.itemCount || 0),
        items: Array.isArray(data.items) ? data.items : [],
        totalAmountCentavos: Number(data.totalAmountCentavos || 0),
        paymentMethod:
          data.paymentMethod === 'Cash' ||
          data.paymentMethod === 'QR Payment' ||
          data.paymentMethod === 'Credit/Debit Card'
            ? data.paymentMethod
            : 'Cash',
        diningOption: data.diningOption === 'Take-Out' ? 'Take-Out' : 'Dine-In',
        amountPaidCentavos: Number(data.amountPaidCentavos || 0),
        changeCentavos: Number(data.changeCentavos || 0),
        status: 'Payment Successful',
        persistedToFirestore: true,
      };
    });
    return list.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, TRANSACTIONS_COLLECTION);
  }
}

/**
 * Admin: Create a new product in Firestore.
 */
export async function createProductInFirestore(product: Omit<Product, 'createdAt' | 'updatedAt'>): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), {
      id: product.id.slice(0, 128),
      name: product.name.trim().slice(0, 100),
      priceCentavos: Math.round(product.priceCentavos),
      category: product.category,
      description: product.description.trim().slice(0, 300),
      active: Boolean(product.active),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Admin: Toggle product active status in Firestore.
 */
export async function toggleProductActiveInFirestore(productId: string, active: boolean): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
      active: Boolean(active),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Admin: Update product details in Firestore.
 */
export async function updateProductInFirestore(
  productId: string,
  updates: Pick<Product, 'name' | 'priceCentavos' | 'category' | 'description' | 'active'>
): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
      name: updates.name.trim().slice(0, 100),
      priceCentavos: Math.round(updates.priceCentavos),
      category: updates.category,
      description: updates.description.trim().slice(0, 300),
      active: Boolean(updates.active),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Admin: Delete product in Firestore.
 */
export async function deleteProductInFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
