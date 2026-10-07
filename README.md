# Ate & Served — Touchscreen Point-of-Sale (POS) Kiosk

A touchscreen self-service Point-of-Sale (POS) kiosk application built for **IT415 – Application Development and Emerging Technologies** (Midterm Practical Examination).

- **Group / Section**: GIVEROLA
- **Instructor**: Reban Cliff Fajardo
- **GitHub Repository**: `https://github.com/kthyclr/IT415-Midterm-Exam`
- **Members**:
  - **M1**: Laureto, Kathy Claire S.
  - **M2**: Tumando, Marvin Ken P.
  - **M3**: Giverola, Aires Jhoy J.

---

## 1. Requirements Analysis (Section A)

### Problem Statement
Campus food and merchandise outlets often experience long queues, manual calculation mistakes, and slow cash handling during peak hours. **Ate & Served** solves this by providing an intuitive, self-service touchscreen Point-of-Sale (POS) kiosk where customers can independently browse items, review their tray, complete payment, and obtain an official digital receipt.

### Target Users
1. **Primary Users (Campus Customers / Students / Faculty / Staff)**: Users standing in front of the touchscreen kiosk ordering drinks, meals, snacks, or university merchandise without needing to register an account or type product names.
2. **Secondary Users (Cashiers / Store Administrators)**: Authorized staff who sign in via Google Authentication to inspect persisted transaction history or manage the product catalog.

### System Inputs & Outputs
- **Inputs**:
  - Touch selection of product cards (`Coffee`, `Sandwich`, `Soft Drink`, `Cookies`, `Bottled Water`, `Chocolate`, `Campus Tumbler`, `University ID Lanyard`)
  - Quantity increments (`+`), decrements (`-`), and item removals (`Remove` / `Clear Tray`)
  - Category filter selections (`Show All`, `Cold & Hot Drinks`, `Snack Time`, `Hot Meals`, `University Merch`) and optional search filter
  - Payment method selection (`Cash`, `QR Payment`, or `Credit/Debit Card`)
  - Cash tendered amount via on-screen numeric keypad or quick-denomination buttons (`Exact`, `₱50`, `₱100`, `₱200`, `₱500`)
- **Outputs**:
  - Real-time item subtotals, total item count, and order total (`₱`)
  - Dedicated **Order & Payment Summary** table
  - Validated **Change Due** calculation or clear validation error messages (e.g., `"Insufficient payment. Please enter at least ₱140.00."`)
  - Simulated QR code payment screen and simulated contactless Card terminal processing state
  - **Payment Successful** screen with a unique transaction reference (`TXN-2026-NNNNN-XXXX`)
  - Printable **Official Digital Receipt** and persistent transaction record stored in **Cloud Firestore**

### Required Kiosk Functions
1. Display at least 6 products with name, category, description, photo, and price.
2. Tap product cards to add items and automatically increment existing items.
3. Adjust quantities (`+` / `-`) and remove items while preventing negative quantities.
4. Compute exact item subtotals and order totals using integer centavos.
5. Provide an Order Summary screen with `Back / Modify Order` preserving the entire cart state.
6. Support 3 payment methods: **Cash** (with strict validation and change computation), **QR Payment** (simulated), and **Credit/Debit Card** (simulated).
7. Generate a unique transaction reference per completed order, display a digital receipt, and completely reset state on **New Order / New Transaction**.

---

## 2. Technology Stack & Data-Storage Approach (Section A & E)

- **Frontend Framework**: React 19 + TypeScript (built with Vite 8)
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`), Warm Creative brutalist kiosk theme (`#fffcf2` cream canvas, `#252422` charcoal ink borders, `#eb5e28` flame orange accents), Google Fonts (`Gaegu`, `Space Mono`, `Inter`), Lucide React icons
- **State Management**: Authoritative React state (`src/App.tsx`) separating product catalog state from active transaction state, backed by integer-centavo monetary utilities (`src/utils/currency.ts`)
- **Data-Storage Approach (Firebase)**:
  - **Cloud Firestore**: Chosen for real-time cloud persistence across sessions so products (`/products/{productId}`) and completed transactions (`/transactions/{transactionId}`) are durably stored rather than existing only in volatile browser memory.
  - **Firebase Authentication**: Google Sign-In (`signInWithPopup`) protects the optional Cashier/Admin management view without forcing normal kiosk customers to log in.
  - **Firestore Security Rules (`firestore.rules`)**: Enforces zero-trust validation on every write, ensuring completed transactions have valid totals, payment methods, exact change math, and cannot be modified or deleted after creation.

---

## 3. Firebase Usage & Configuration Requirements

The application connects to Firebase via `firebase-applet-config.json` (initialized in `src/firebase/config.ts`).

- **Collections**:
  - `/products/{productId}`: Stores active and inactive kiosk catalog items (`id`, `name`, `priceCentavos`, `category`, `description`, `active`, `createdAt`, `updatedAt`).
  - `/transactions/{transactionId}`: Stores immutable snapshots of completed transactions (`transactionId`, `createdAt`, `createdAtIso`, `itemCount`, `items`, `totalAmountCentavos`, `paymentMethod`, `amountPaidCentavos`, `changeCentavos`, `status`).
  - `/admins/{adminId}`: Stores optional authorized admin UIDs.
- **Security Rules**:
  - Public kiosk users can read active products and create validated completed transactions.
  - Completed transactions are strictly immutable (`allow update, delete: if false;`).
  - Product management and full transaction history listing require verified Admin authentication.

---

## 4. Local Setup, Dependencies & Run Steps (Section E)

### Prerequisites
- **Node.js** v18+ and **npm**

### Step-by-Step Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/kthyclr/IT415-Midterm-Exam.git
   cd IT415-Midterm-Exam
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
5. **Build for production**:
   ```bash
   npm run build
   ```
6. **Run security rule lint & unit tests**:
   ```bash
   npx eslint firestore.rules
   npx tsx --test firestore.rules.test.ts
   ```

---

## 5. Project Structure (Section D)

```text
├── AI_DEVELOPMENT_LOG.md            # Complete AI prompts, debugging, refactoring & evaluation log
├── README.md                        # Project overview, requirements analysis & member register
├── firebase-applet-config.json      # Firebase Web SDK client configuration
├── firebase-blueprint.json          # Entity & Firestore path schema blueprint
├── firestore.rules                  # Production Cloud Firestore security rules
├── firestore.rules.test.ts          # Automated test suite for Dirty Dozen security payloads
├── security_spec.md                 # Security invariants and payload documentation
├── src/
│   ├── App.tsx                      # Authoritative kiosk state & stage router
│   ├── index.css                    # Tailwind imports, Warm Creative theme & print styles
│   ├── assets/images/               # Bundled studio product photography
│   ├── types/
│   │   └── pos.ts                   # Product, OrderItem, PaymentMethod & Transaction types
│   ├── data/
│   │   └── initialProducts.ts       # Default Ate & Served catalog items & image resolver
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
│       │   ├── BrandLogo.tsx        # Ate & Served vector hand-gesture logo
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

## 6. Member Contribution Register (Section C & E)

| Member ID | Full Name | GitHub Account | Assigned Feature Branches | Implemented Tasks & Files | Pull Requests & Review Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | **Laureto, Kathy Claire S.** | `@kthyclr` | `feature/kiosk-ui`<br>`feature/cart-logic`<br>`feature/documentation` | • Touchscreen Kiosk UI, Warm Creative theme (`src/index.css`)<br>• Brand Logo (`BrandLogo.tsx`) & Product Cards (`ProductCard.tsx`) with bundled product photos (`initialProducts.ts`)<br>• Cart state, quantity controls (`QuantityControl.tsx`, `CartOrderRow.tsx`), and integer centavo math (`currency.ts`) | Created PRs for `feature/kiosk-ui` & `feature/cart-logic`; reviewed M2 & M3 PRs prior to merge into `main`. |
| **M2** | **Tumando, Marvin Ken P.** | `@marvinkentumando` | `feature/order-summary`<br>`feature/payment-flow`<br>`feature/payment-simulations` | • Order Summary screen (`OrderSummaryScreen.tsx`) & Back navigation state preservation<br>• Payment Method selection (`PaymentMethodScreen.tsx`, `PaymentMethodCard.tsx`)<br>• Cash validation (`validation.ts`), on-screen numeric keypad, and QR/Card simulations (`PaymentProcessingScreen.tsx`) | Created PRs for `feature/order-summary` & `feature/payment-flow`; reviewed M1 & M3 PRs prior to merge into `main`. |
| **M3** | **Giverola, Aires Jhoy J.** | 'giverolaires'| `feature/project-setup`<br>`feature/firebase`<br>`feature/receipt` | • Project setup & Firebase SDK initialization (`src/firebase/config.ts`)<br>• Firestore persistence (`posService.ts`), security rules (`firestore.rules`), and security test suite (`firestore.rules.test.ts`)<br>• Unique transaction ID generator (`transactionId.ts`), `PaymentSuccessfulScreen.tsx`, and `ReceiptScreen.tsx` | Created PRs for `feature/project-setup`, `feature/firebase`, & `feature/receipt`; reviewed M1 & M2 PRs prior to merge into `main`. |

> **AI Development Evidence**: See [`AI_DEVELOPMENT_LOG.md`](./AI_DEVELOPMENT_LOG.md) for the complete record of generation prompts, AI-assisted debugging, AI-assisted refactoring, critical evaluations, and manual adaptations mapped to M1, M2, and M3.
