# ZaidBites Security Specification (Phase 0: Payload-First Security TDD)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Any path not explicitly matched under `/databases/{database}/documents` is unconditionally denied (`allow read, write: if false;`).
2. **Zero-Trust Admin Verification (`isAdmin`)**: Admin privileges are never trusted from client payload fields. A user is an admin if and only if `request.auth != null && request.auth.token.email_verified == true` and either their verified email matches the bootstrapped owner (`jishadnv7@gmail.com`) or a document exists at `/admins/$(request.auth.uid)`.
3. **Path Variable Hardening (`isValidId`)**: Every single-document operation (`get`, `create`, `update`, `delete`) validates the path ID using `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`).
4. **Catalog Public Visibility (`categories`, `products`, `promoCodes`)**: Storefront read/list access requires `resource.data.visibility == 'public'` (or `isAdmin()`), preventing unfiltered collection scraping. All catalog writes (`create`, `delete`, and full `update`) are strictly restricted to `isAdmin()`.
5. **Controlled Inventory Deduction**: Non-admin verified customers may only update a product document during checkout if `affectedKeys().hasOnly(['stockQuantity', 'isAvailable', 'updatedAt'])`, `incoming().stockQuantity < existing().stockQuantity`, `incoming().stockQuantity >= 0`, and `incoming().isAvailable == (incoming().stockQuantity > 0 ? existing().isAvailable : false)`.
6. **Order Identity & PII Isolation (`/orders/{orderId}`)**:
   - Customer PII (`customerName`, `customerPhone`, `deliveryAddress`, `customerEmail`) is strictly isolated: `get` and `list` are only permitted if `isAdmin()` or `resource.data.customerId == request.auth.uid`.
   - On `create`, `incoming().customerId == request.auth.uid`, `request.auth.token.email_verified == true`, `incoming().status == 'New Order'`, and `incoming().createdAt == request.time`.
   - On `update`, `customerId`, `orderNumber`, and `createdAt` are immutable. Non-admin customers cannot update orders once in terminal states (`Delivered` or `Cancelled`) and can only transition their own `'New Order'` to `'Cancelled'`. Admins (`isAdmin()`) can transition `status` and `updatedAt`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Self-Assigned Admin Escalation)**: Non-admin user attempts to create `/admins/attacker_uid` with `role: "super_admin"`. -> `PERMISSION_DENIED`
2. **Payload 2 (Unverified Admin Email Spoof)**: User with `email: "jishadnv7@gmail.com"` but `email_verified: false` attempts to create or update a product. -> `PERMISSION_DENIED`
3. **Payload 3 (Shadow Field Injection on Order Create)**: Verified customer submits valid order payload plus extra key `"isPaid": true`. -> `PERMISSION_DENIED`
4. **Payload 4 (Identity Spoofing on Order Create)**: Authenticated user `uid_A` creates an order with `customerId: "uid_B"`. -> `PERMISSION_DENIED`
5. **Payload 5 (PII Blanket Read / Cross-Customer Order Read)**: Authenticated user `uid_A` attempts `get` or `list` on `/orders/order_of_uid_B`. -> `PERMISSION_DENIED`
6. **Payload 6 (Order Status Shortcutting by Customer)**: Customer attempts to update their own order status from `"New Order"` to `"Delivered"`. -> `PERMISSION_DENIED`
7. **Payload 7 (Terminal State Mutation by Customer)**: Customer attempts to update an order whose existing status is already `"Delivered"` or `"Cancelled"`. -> `PERMISSION_DENIED`
8. **Payload 8 (Timestamp Forgery)**: Customer creates an order with a backdated client timestamp (`createdAt != request.time`). -> `PERMISSION_DENIED`
9. **Payload 9 (Unauthorized Product Price Tampering)**: Non-admin customer attempts to update `price: 1` on `/products/burger-classic-chicken`. -> `PERMISSION_DENIED`
10. **Payload 10 (Negative or Inflated Stock Poisoning)**: Non-admin user attempts to increase `stockQuantity` or set `stockQuantity: -5` on `/products/burger-classic-chicken`. -> `PERMISSION_DENIED`
11. **Payload 11 (Unbounded / Malformed Order Items Array)**: Customer creates an order with `items: []` (empty) or 25 items (`size() > 20`) or non-map first element. -> `PERMISSION_DENIED`
12. **Payload 12 (ID Poisoning Attack)**: User attempts to create `/orders/invalid$id!with*spaces` that violates `^[a-zA-Z0-9_\-]+$`. -> `PERMISSION_DENIED`
