# AI-Assisted Development Log (`AI_DEVELOPMENT_LOG.md`)

**Course**: IT415 – Application Development and Emerging Technologies  
**Project**: Ate & Served — Touchscreen Point-of-Sale (POS) Kiosk System  
**Group / Section**: GIVEROLA  
**Date**: October 7, 2026  
**Instructor**: Reban Cliff Fajardo  
**Repository**: `https://github.com/kthyclr/IT415-Midterm-Exam`  

**Group Members**:
- **M1**: Laureto, Kathy Claire S. (`@kthyclr`)
- **M2**: Tumando, Marvin Ken P.
- **M3**: Giverola, Aires Jhoy J.

---

## 1. Initial Generation Prompt & Context (Checklist B.1 & B.4)

### Responsible Members: M1 (Laureto), M2 (Tumando), M3 (Giverola)

### Prompt Used
> **Context**: Build a functional touchscreen self-service Point-of-Sale (POS) kiosk web application in React + TypeScript with Firebase (Cloud Firestore + Firebase Authentication) for a campus food and merchandise outlet.  
> **Required Transaction Flow**:  
> 1. Item Selection (at least 6 products: Coffee ₱45, Sandwich ₱50, Soft Drink ₱35, Cookies ₱25, Bottled Water ₱20, Chocolate ₱25)  
> 2. Order / Payment Summary (itemized review with Back navigation preserving cart state)  
> 3. Payment Method (Cash, QR Payment, Credit/Debit Card)  
> 4. Payment Processing (Cash validation rejecting blank/negative/insufficient input and calculating exact change; simulated QR Payment and Credit/Debit Card payment with `amountPaid = total` and `change = ₱0.00`)  
> 5. Payment Successful (unique transaction reference `TXN-2026-...` and summary)  
> 6. Digital Receipt (complete transaction snapshot and print layout)  
> 7. New Transaction (complete reset of cart, payment, and receipt state)  
> **Constraints**: Use integer centavos for all money calculations to prevent floating-point errors. Persist products and completed transactions in Cloud Firestore with appropriate security rules. Do not collect real card credentials.

### Summary of AI Response
The AI generated a modular React + TypeScript architecture separating:
- Data types (`src/types/pos.ts`) and initial product seed data (`src/data/initialProducts.ts`)
- Integer-centavo monetary helpers (`src/utils/currency.ts`), input/payment validators (`src/utils/validation.ts`), and transaction reference generator (`src/utils/transactionId.ts`)
- Firebase initialization (`src/firebase/config.ts`), structured error handling (`src/firebase/errorHandler.ts`), and Firestore persistence (`src/firebase/posService.ts`)
- Hardened Firestore security rules (`firestore.rules`) and unit tests (`firestore.rules.test.ts`)
- Reusable touchscreen UI components (`src/components/ui/*`) and screen views (`src/components/screens/*`)

---

## 2. AI-Assisted Debugging Log (Checklist B.2)

### Debug Entry 1: Product Photos Missing in Deployed Production Build
- **Responsible Member**: **M1 (Laureto, Kathy Claire S.)**
- **Observed Error / Issue**:
  After generating the 8 studio product photos (`product_coffee_cup_...jpg`, etc.) and deploying the application, the product images appeared broken/missing in the deployed production environment even though the files existed in `/src/assets/images/`.
- **Root Cause Analysis**:
  In `src/data/initialProducts.ts`, the image paths were originally hardcoded as raw string literals (`'/src/assets/images/product_coffee_cup_1791355690264.jpg'`). During `npm run build` (`vite build`), Vite only copies static assets referenced via ES `import` statements (or placed in `public/`) into the production `dist/assets/` bundle. Furthermore, existing product documents in Firestore did not have the bundled asset URLs.
- **Prompt Used**:
  > *"the product photos weren't deployed"*
- **Applied Fix (`src/data/initialProducts.ts`)**:
  Replaced raw `/src/assets/images/...` string literals with static ES module imports so Vite hashes and bundles every image into `dist/assets/`:
  ```typescript
  import coffeeImg from '../assets/images/product_coffee_cup_1791355690264.jpg';
  import sandwichImg from '../assets/images/product_club_sandwich_1791355702044.jpg';
  // ...
  export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
    'prod-coffee': coffeeImg,
    'prod-sandwich': sandwichImg,
    // ...
  };
  ```
  Additionally updated `resolveProductImage()` to ignore unbundled `/src/assets/` strings and resolve directly to the Vite-bundled module URL.
- **Verification**:
  Ran `compile_applet` (`vite build`) and verified that all 8 `.jpg` assets were emitted into the production build output and rendered properly on every `ProductCard`.

---

### Debug Entry 2: Firestore Security Rules & Unauthenticated Kiosk Seeding / Transaction Writes
- **Responsible Member**: **M3 (Giverola, Aires Jhoy J.)**
- **Observed Error / Issue**:
  Normal kiosk customers do not sign in with an account, so default blanket `isSignedIn()` rules would block initial catalog seeding and customer transaction creation with `Missing or insufficient permissions`.
- **Applied Fix (`firestore.rules` & `src/firebase/posService.ts`)**:
  1. Configured `/products/{productId}` to allow public `get`/`list` where `existing().active == true`, and allowed one-time initial creation of the 8 default product IDs (`isDefaultSeedProductId(productId) && !exists(...)`) while restricting all edits/deletes to `isAdmin()`.
  2. Configured `/transactions/{transactionId}` to allow `create` only when `isValidTransaction(incoming(), transactionId)` passes strict server-side checks (`amountPaidCentavos >= totalAmountCentavos` for Cash, `amountPaidCentavos == totalAmountCentavos && changeCentavos == 0` for QR/Card, `createdAt == request.time`, and `!exists(...)`).
- **Verification**:
  Validated with `npx eslint firestore.rules` (0 errors) and executed the 8 Dirty Dozen security invariant unit tests via `npx tsx --test firestore.rules.test.ts` (8/8 passing).

---

## 3. AI-Assisted Refactoring Log (Checklist B.3)

### Refactor Entry 1: Applying the "Warm Creative" Design System & Custom Branding ("Ate & Served")
- **Responsible Member**: **M1 (Laureto, Kathy Claire S.)** & **M2 (Tumando, Marvin Ken P.)**
- **Original Code / State**:
  The initial implementation used a standard slate/emerald card layout (`#F8FAFC` background, `#0F172A` text, `Plus Jakarta Sans` font, and generic icon placeholders on product cards) titled `"Campus Store POS Kiosk"`.
- **Prompts Used**:
  1. *"Apply the design variation to the app project. [Design name: Variation 3 - Warm Creative]"*
  2. *"Change the name Campus Store to 'Ate & Served'"*
  3. *"Use this as a logo and add pictures for the products."*
- **Refactored Improvement**:
  - Updated `index.html` and `src/index.css` to introduce CSS custom properties (`--bg: #fffcf2`, `--ink: #252422`, `--accent: #eb5e28`, `--secondary: #403d39`) and typography (`Gaegu` cursive display, `Space Mono` labels/prices, `Inter` body).
  - Created reusable tactile brutalist utility classes (`.ink-card`, `.ink-card-interactive`, `.ink-btn-accent`, `.ink-pill`) with `3px solid #252422` borders and `6px 6px 0 #252422` offset shadows that depress on touch (`active:translate-x-[4px] active:translate-y-[4px]`).
  - Extracted the uploaded hand-gesture emblem into a dedicated vector component (`src/components/ui/BrandLogo.tsx`) rendered in the top header and digital receipt.
- **Behavior Verification**:
  Verified that all 6 transaction stages (`ITEM_SELECTION`, `ORDER_SUMMARY`, `PAYMENT_METHOD`, `PAYMENT_PROCESSING`, `PAYMENT_SUCCESSFUL`, `RECEIPT`) maintained identical state and calculation behavior after the visual refactoring.

---

### Refactor Entry 2: Centralizing Integer-Centavo Monetary Math
- **Responsible Member**: **M2 (Tumando, Marvin Ken P.)**
- **Original Risk**:
  Using floating-point peso values (`45.00 * 3`) across multiple components can lead to IEEE 754 precision discrepancies and inconsistent totals between the Cart, Order Summary, Payment screen, and Receipt.
- **Refactored Solution (`src/utils/currency.ts`)**:
  All product prices, item subtotals, order totals, cash tendered, and change amounts are stored and calculated strictly as integer centavos (`4500` = `₱45.00`) and formatted only at render time via `formatCurrency(centavos)`.
- **Verification**:
  Verified across Acceptance Tests 2–14 that `Item Selection total == Order Summary total == Payment amount due == Payment Successful amount == Receipt total`.

---

## 4. Critical Evaluation & Adaptation of AI Output (Checklist B.5 & B.6)

| Component / Feature | AI Output Evaluation (Correctness, Suitability, Limitations) | How Our Group Adapted & Verified It | Responsible Member |
| :--- | :--- | :--- | :--- |
| **Brand Identity & UI Theme** | Initial AI output used a generic corporate emerald/slate palette and `"Campus Store"` placeholder branding. | Replaced with our custom **Warm Creative** aesthetic (`#fffcf2`, `#eb5e28`, `#252422`), rebranded to **Ate & Served**, and integrated our custom hand-gesture logo (`BrandLogo.tsx`). | **M1 (Laureto)** |
| **Product Images in Vite Build** | AI initially referenced generated images via `/src/assets/images/...` string paths, which failed to bundle in production builds. | Evaluated the broken image fallback in production, diagnosed the Vite asset bundling behavior, and adapted `initialProducts.ts` to use static ES module imports. | **M1 (Laureto)** |
| **Cash Validation & Touchscreen Keypad** | Typing on a physical keyboard is inconvenient on a standing kiosk. | Evaluated touch usability and ensured an on-screen numeric keypad (`0–9`, `.`, `Backspace`, `Clear`) plus quick bill buttons (`Exact`, `₱50`, `₱100`, `₱200`, `₱500`) work alongside strict validation in `validation.ts`. | **M2 (Tumando)** |
| **QR & Card Payment Simulations** | Real payment gateways require merchant credentials and are prohibited by the exam rules. | Verified that QR Payment generates a deterministic SVG QR matrix and Card Payment uses a `1.1s` simulated terminal processing delay while enforcing `amountPaid == total` and `change == ₱0.00`. | **M2 (Tumando)** |
| **Firestore Security & Persistence** | Client-side validation alone can be bypassed if Firestore rules are left open (`allow read, write: if true`). | Implemented `firestore.rules` with strict schema/math checks and verified them using ESLint (`@firebase/eslint-plugin-security-rules`) and `firestore.rules.test.ts`. | **M3 (Giverola)** |
