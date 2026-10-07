# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default Deny Catch-All**: Any path not explicitly matched (`/products/{productId}`, `/transactions/{transactionId}`, `/admins/{adminId}`) is strictly denied for all reads and writes.
2. **Product Catalog Integrity (`/products/{productId}`)**:
   - Document ID `productId` must match `^[a-zA-Z0-9_\-]+$` with length `<= 128`, and equal `incoming().id`.
   - `name` must be a string between `1` and `100` characters.
   - `priceCentavos` must be an integer `> 0` and `<= 10000000` (₱100,000.00 max).
   - `category` must be one of `['Drinks', 'Food', 'Snacks', 'Merch']`.
   - `description` must be a string `<= 300` characters.
   - `active` must be a boolean.
   - `createdAt` and `updatedAt` must match `request.time` on creation; on update, `createdAt` is immutable and `updatedAt == request.time`.
   - Initial default catalog items (`prod-coffee`, `prod-sandwich`, `prod-softdrink`, `prod-cookies`, `prod-water`, `prod-chocolate`, `prod-tumbler`, `prod-lanyard`) can be seeded once if they do not exist yet; subsequent creations, updates, or status toggles require `isAdmin()`.
3. **Completed Transaction Immutability & Validation (`/transactions/{transactionId}`)**:
   - Document ID `transactionId` must match `^TXN-[0-9]{4}-[0-9A-Z\-]+$` (`<= 64` chars) and equal `incoming().transactionId`.
   - Only completed transactions (`status == 'Payment Successful'`) can be created.
   - `totalAmountCentavos` must be an integer `> 0` and `<= 50000000`.
   - `paymentMethod` must be one of `['Cash', 'QR Payment', 'Credit/Debit Card']`.
   - `diningOption` must be one of `['Dine-In', 'Take-Out']`.
   - Payment arithmetic invariant:
     - If `paymentMethod == 'Cash'`, `amountPaidCentavos >= totalAmountCentavos` and `changeCentavos == amountPaidCentavos - totalAmountCentavos`.
     - If `paymentMethod == 'QR Payment'` or `'Credit/Debit Card'`, `amountPaidCentavos == totalAmountCentavos` and `changeCentavos == 0`.
   - `items` must be a non-empty list (`size() >= 1 && size() <= 50`), and `items[0]` must be a valid map containing `productId`, `productName`, `unitPriceCentavos`, `quantity`, and `subtotalCentavos`.
   - `createdAt` must equal `request.time`.
   - Completed transactions are **strictly immutable**: `allow update, delete: if false;`.
   - Reading/listing transaction history (`list`) is restricted to `isAdmin()`. Individual receipt lookup (`get`) is allowed by valid `transactionId`.
4. **Admin Role Isolation (`/admins/{adminId}`)**:
   - Verified bootstrapped admin (`lauretokathyclaire@gmail.com` with `email_verified == true`) or existing document in `/admins/$(request.auth.uid)` defines `isAdmin()`.
   - Normal users cannot self-assign admin documents.

---

## 2. The "Dirty Dozen" Payloads

1. **Shadow Field Injection on Product Creation**:
   `{ id: "prod-coffee", name: "Coffee", priceCentavos: 4500, category: "Drinks", description: "Hot brewed coffee", active: true, createdAt: SERVER_TIME, updatedAt: SERVER_TIME, isFree: true }` -> Rejected by `hasOnly`.
2. **Negative or Zero Price Product**:
   `{ id: "prod-coffee", name: "Coffee", priceCentavos: -500, category: "Drinks", description: "Coffee", active: true, createdAt: SERVER_TIME, updatedAt: SERVER_TIME }` -> Rejected by `priceCentavos > 0`.
3. **Unauthenticated Product Price Tampering (Update)**:
   Updating `/products/prod-coffee` with `{ priceCentavos: 100 }` without admin authentication -> Rejected by `isAdmin()`.
4. **Email Spoofing Admin Attack**:
   Authenticated token with `email: "lauretokathyclaire@gmail.com"` and `email_verified: false` attempting to update `/products/prod-coffee` -> Rejected by `request.auth.token.email_verified == true`.
5. **Insufficient Cash Transaction Write**:
   Creating `/transactions/TXN-2026-00001` with `paymentMethod: "Cash"`, `totalAmountCentavos: 17500`, `amountPaidCentavos: 10000`, `changeCentavos: 0` -> Rejected by `amountPaidCentavos >= totalAmountCentavos`.
6. **Manipulated Cash Change Calculation**:
   Creating `/transactions/TXN-2026-00002` with `paymentMethod: "Cash"`, `totalAmountCentavos: 17500`, `amountPaidCentavos: 20000`, `changeCentavos: 99900` -> Rejected by `changeCentavos == amountPaidCentavos - totalAmountCentavos`.
7. **Non-Zero Change on QR Payment**:
   Creating `/transactions/TXN-2026-00003` with `paymentMethod: "QR Payment"`, `totalAmountCentavos: 14000`, `amountPaidCentavos: 20000`, `changeCentavos: 6000` -> Rejected by `amountPaidCentavos == totalAmountCentavos && changeCentavos == 0`.
8. **Empty Items Array Transaction**:
   Creating `/transactions/TXN-2026-00004` with `items: []`, `totalAmountCentavos: 14000` -> Rejected by `data.items.size() >= 1`.
9. **Transaction Post-Creation Tampering (Update/Delete)**:
   Updating or deleting `/transactions/TXN-2026-00001` after creation -> Rejected by `allow update, delete: if false`.
10. **Unauthenticated Transaction List Scraping**:
    Listing `/transactions` without admin authentication -> Rejected by `allow list: if isAdmin()`.
11. **Path ID Poisoning**:
    Creating `/transactions/BAD_ID_WITH_SPACES_AND_SYMBOLS!@#` -> Rejected by `isValidTransactionId(transactionId)`.
12. **Self-Assigned Admin Escalation**:
    Non-admin user creating `/admins/attackerUid` with `{ uid: "attackerUid", role: "admin", createdAt: SERVER_TIME }` -> Rejected by `isAdmin()`.
