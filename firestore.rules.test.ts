/**
 * Firestore Security Rules Specification Test Suite
 * Verifies that all "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: {
    uid: string;
    email: string;
    email_verified: boolean;
  } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Self-Assigned Admin Escalation',
    collection: 'admins',
    docId: 'attacker_uid',
    operation: 'create',
    auth: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'attacker_uid',
      email: 'attacker@example.com',
      name: 'Attacker',
      role: 'super_admin',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Admin Email Spoof',
    collection: 'products',
    docId: 'burger-classic-chicken',
    operation: 'delete',
    auth: { uid: 'spoof_uid', email: 'jishadnv7@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Order Create',
    collection: 'orders',
    docId: 'order_shadow_1',
    operation: 'create',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      orderNumber: 'ZB-100001',
      customerId: 'cust_1',
      isPaid: true, // Ghost field not in hasOnly
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Identity Spoofing on Order Create',
    collection: 'orders',
    docId: 'order_spoof_1',
    operation: 'create',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      orderNumber: 'ZB-100002',
      customerId: 'cust_2', // Mismatched UID
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'PII Cross-Customer Order Read',
    collection: 'orders',
    docId: 'order_belonging_to_cust_2',
    operation: 'get',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Order Status Shortcutting by Customer',
    collection: 'orders',
    docId: 'order_cust_1',
    operation: 'update',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      status: 'Delivered',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Terminal State Mutation by Customer',
    collection: 'orders',
    docId: 'order_already_delivered',
    operation: 'update',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      status: 'Cancelled',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Timestamp Forgery on Order Create',
    collection: 'orders',
    docId: 'order_forged_time',
    operation: 'create',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      createdAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Unauthorized Product Price Tampering',
    collection: 'products',
    docId: 'burger-classic-chicken',
    operation: 'update',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      price: 1,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Negative or Inflated Stock Poisoning',
    collection: 'products',
    docId: 'burger-classic-chicken',
    operation: 'update',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      stockQuantity: 9999,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Empty or Malformed Order Items Array',
    collection: 'orders',
    docId: 'order_empty_items',
    operation: 'create',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {
      items: [],
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'ID Poisoning Attack',
    collection: 'orders',
    docId: 'invalid$id!with*spaces',
    operation: 'create',
    auth: { uid: 'cust_1', email: 'cust1@example.com', email_verified: true },
    payload: {},
    expectedResult: 'PERMISSION_DENIED',
  },
];
