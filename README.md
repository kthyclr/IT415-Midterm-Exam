# Campus Store POS Kiosk

A touchscreen self-service Point-of-Sale (POS) kiosk application built for **IT415 – Application Development and Emerging Technologies**.

---

## 1. Project Purpose

This application provides a touchscreen-first self-service POS kiosk for a campus food and merchandise outlet. Customers can tap products to build an order, adjust item quantities, review their complete order summary, select a payment method (**Cash**, **QR Payment**, or **Credit/Debit Card**), complete the payment flow, receive a unique transaction reference number, view/print a digital receipt, and start a fresh transaction.

---

## 2. Technology Stack

- **Frontend Framework**: React 19 + TypeScript (Vite)
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React icons, Google Fonts (`Syne`, `Plus Jakarta Sans`, `JetBrains Mono`)
- **State Management**: Authoritative React state with integer-centavo monetary computation (`src/utils/currency.ts`)
- **Backend / Persistence**:
  - **Cloud Firestore**: Persistent storage for `/products` and completed `/transactions`
  - **Firebase Authentication**: Google Sign-In foundation for the optional Cashier/Admin portal
  - **Firestore Security Rules**: Zero-trust schema, type, size, and payment math validation (`firestore.rules`)

---

## 3. Firebase Usage & Configuration Requirements

The application connects to Firebase via `firebase-applet-config.json` (initialized in `src/firebase/config.ts`).

- **Collections**:
  - `/products/{productId}`: Stores active and inactive kiosk catalog items (`id`, `name`, `priceCentavos`, `category`, `description`, `active`, `createdAt`, `updatedAt`).
  - `/transactions/{transactionId}`: Stores immutable snapshots of completed transactions (`transactionId`, `createdAt`, `createdAtIso`, `itemCount`, `items`, `totalAmountCentavos`, `paymentMethod`, `diningOption`, `amountPaidCentavos`, `changeCentavos`, `status`).
  - `/admins/{adminId}`: Stores optional authorized admin UIDs.
- **Security Rules**:
  - Public kiosk users can read active products and create validated completed transactions.
  - Completed transactions cannot be modified or deleted (`allow update, delete: if false;`).
  - Product creation (beyond initial catalog seeding), product updates, and full transaction history listing require verified Admin authentication.

---

## 4. Local Setup & Run Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <repository-folder>
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Verify Firebase configuration**:
   Ensure `firebase-applet-config.json` is present in the project root with your Firebase Web App client configuration (`projectId`, `appId`, `apiKey`, `authDomain`, `firestoreDatabaseId`). Never place private Admin SDK or service-account keys in frontend files.
4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
5. **Run security rule lint & unit tests**:
   ```bash
   npx eslint firestore.rules
   npx tsx --test firestore.rules.test.ts
   ```

---

## 5. Project Structure

```text
├── firebase-applet-config.json      # Firebase Web SDK client configuration
├── firebase-blueprint.json          # Entity & Firestore path schema blueprint
├── firestore.rules                  # Production Cloud Firestore security rules
├── firestore.rules.test.ts          # Unit test suite for Dirty Dozen security payloads
├── security_spec.md                 # Security invariants and payload documentation
├── src/
│   ├── App.tsx                      # Authoritative kiosk state & stage router
│   ├── index.css                    # Tailwind imports, typography & print styles
│   ├── types/
│   │   └── pos.ts                   # Product, OrderItem, PaymentMethod & Transaction types
│   ├── data/
│   │   └── initialProducts.ts       # Default campus store products (Coffee, Sandwich, etc.)
│   ├── utils/
│   │   ├── currency.ts              # Integer centavo arithmetic & ₱ formatting
│   │   ├── validation.ts            # Cart, quantity, and cash payment validation
│   │   └── transactionId.ts         # Unique transaction reference generator (TXN-YYYY-...)
│   ├── firebase/
│   │   ├── config.ts                # Firebase App, Firestore & Auth initialization
│   │   ├── errorHandler.ts          # Structured Firestore error reporting
│   │   └── posService.ts            # Firestore CRUD & seeding operations
│   └── components/
│       ├── ui/
│       │   ├── ProgressIndicator.tsx
│       │   ├── ProductCard.tsx
│       │   ├── QuantityControl.tsx
│       │   ├── CartOrderRow.tsx
│       │   ├── PaymentMethodCard.tsx
│       │   └── StatusBanner.tsx
│       └── screens/
│           ├── ItemSelectionScreen.tsx
│           ├── OrderSummaryScreen.tsx
│           ├── PaymentMethodScreen.tsx
│           ├── PaymentProcessingScreen.tsx
│           ├── PaymentSuccessfulScreen.tsx
│           ├── ReceiptScreen.tsx
│           └── AdminPortalModal.tsx
```

---

## 6. Main Features & Payment Simulation Explanation

- **Touchscreen Item Selection**: Large tappable product cards, category filtering (`All`, `Drinks`, `Food`, `Snacks`, `Merch`), search bar, and live cart panel.
- **Exact Monetary Math**: All prices, item subtotals, order totals, cash tendered, and change amounts are computed in integer centavos to prevent floating-point errors.
- **Order Summary & Dining Option**: Dedicated review screen with **Eat In / Dine-In** vs. **Takeout / To-Go** selection and `Back / Modify Order` preserving all selected items and quantities.
- **Cash Payment Validation**: Includes touchscreen numeric keypad, quick bill buttons (`Exact`, `₱50`, `₱100`, `₱200`, `₱500`, `₱1000`), and strict rejection of blank, non-numeric, negative, or insufficient cash inputs.
- **Simulated QR Payment**: Generates a deterministic SVG QR code for the current order total. Pressing `Confirm Payment` simulates payment verification with `amountPaid = total` and `change = ₱0.00`.
- **Simulated Credit/Debit Card Payment**: Displays contactless terminal instructions (`Please tap, insert, or swipe your card.`) and a brief `Processing payment...` state before completing the transaction with `amountPaid = total` and `change = ₱0.00`. No real card numbers, CVV, or PINs are collected.
- **Digital Receipt & Printing**: Displays item snapshots, quantities, subtotals, total, payment method, amount paid, change, status, and unique reference (`TXN-2026-...`), plus print-friendly stylesheet support.

---

## 7. Known Limitations

- QR Payment and Credit/Debit Card flows are intentionally simulated per the IT415 practical examination specification; no external banking or payment gateway API is charged.
- Browser fullscreen mode (`requestFullscreen`) requires user interaction and browser/iframe container permission.

---

## 8. Group Contribution Section (Placeholder)

| Member Name | Role / Assigned Module | Feature Branch | Key Commits / PRs |
| :--- | :--- | :--- | :--- |
| Giverola, Aires Jhoy J.| Project Setup & Firebase Integration | `feature/project-setup`, `feature/firebase` | Initial setup, Firestore rules & persistence |
| Laureto, Kathy Claire S.| Touchscreen Kiosk UI & Cart Logic | `feature/kiosk-ui`, `feature/cart-logic` | Product cards, quantity controls, subtotals |
| Tumando, Marvin Ken P. | Order Summary & Payment Flows | `feature/order-summary`, `feature/payment-flow` | Summary screen, Cash validation, QR/Card simulation |
| All| Receipt, Testing & Documentation | `feature/receipt`, `feature/documentation` | Digital receipt, acceptance tests, README & AI log |
