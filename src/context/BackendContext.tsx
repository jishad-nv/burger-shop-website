import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  BOOTSTRAPPED_ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
} from '../firebase';
import {
  ALL_PRODUCTS,
  FOOD_CATEGORIES,
  VALID_PROMO_CODES,
  COMMON_BURGER_ADDONS,
  COMMON_PIZZA_SIZES,
  COMMON_PIZZA_ADDONS,
  COMMON_WRAP_ADDONS,
  COMMON_DRINK_SIZES,
  COMMON_DRINK_ADDONS,
} from '../data/menuData';
import {
  AdminAccountRecord,
  CartItem,
  CategoryCardItem,
  CustomerOrderRecord,
  FoodCategoryId,
  FoodProduct,
  OrderLineItem,
  OrderStatus,
  PaymentMethod,
  PromoCodeDefinition,
} from '../types/food';
import { resolveFoodImageUrl } from '../utils/imageResolver';

import burgerImgUrl from '../assets/images/hero_double_burger_1790594987171.jpg';
import rollImgUrl from '../assets/images/hero_chicken_roll_1790595003281.jpg';
import pizzaImgUrl from '../assets/images/hero_pizza_slice_1790595016981.jpg';
import zingerBurgerImgUrl from '../assets/images/menu_zinger_burger_1790597405110.jpg';
import paneerBurgerImgUrl from '../assets/images/menu_paneer_burger_1790597428962.jpg';
import tikkaPizzaImgUrl from '../assets/images/menu_tikka_pizza_1790597441614.jpg';
import shawarmaRollImgUrl from '../assets/images/menu_shawarma_roll_1790597456326.jpg';
import mojitoDrinkImgUrl from '../assets/images/menu_mojito_drink_1790599015098.jpg';
import chocoShakeImgUrl from '../assets/images/menu_chocolate_shake_1790599027284.jpg';
import orangeJuiceImgUrl from '../assets/images/menu_orange_juice_1790599038865.jpg';
import strawberryShakeImgUrl from '../assets/images/menu_strawberry_shake_1790599054960.jpg';

export interface StudioFoodImagePreset {
  id: string;
  label: string;
  category: FoodCategoryId;
  url: string;
}

export const STUDIO_IMAGE_PRESETS: StudioFoodImagePreset[] = [
  { id: 'burger-double', label: 'Classic Double Burger', category: 'burgers', url: burgerImgUrl },
  { id: 'burger-zinger', label: 'Crispy Zinger Burger', category: 'burgers', url: zingerBurgerImgUrl },
  { id: 'burger-paneer', label: 'Royal Paneer Burger', category: 'burgers', url: paneerBurgerImgUrl },
  { id: 'pizza-margherita', label: 'Margherita / Pepperoni Pizza', category: 'pizza', url: pizzaImgUrl },
  { id: 'pizza-tikka', label: 'Chicken / Paneer Tikka Pizza', category: 'pizza', url: tikkaPizzaImgUrl },
  { id: 'roll-shawarma', label: 'Chicken Shawarma Roll', category: 'rolls', url: shawarmaRollImgUrl },
  { id: 'roll-kathi', label: 'Classic Kathi Roll / Wrap', category: 'rolls', url: rollImgUrl },
  { id: 'drink-mojito', label: 'Mojito / Lime Soda', category: 'drinks', url: mojitoDrinkImgUrl },
  { id: 'drink-choco', label: 'Chocolate Shake / Cold Coffee', category: 'drinks', url: chocoShakeImgUrl },
  { id: 'drink-strawberry', label: 'Strawberry Milkshake', category: 'drinks', url: strawberryShakeImgUrl },
  { id: 'drink-orange', label: 'Fresh Orange Juice', category: 'drinks', url: orangeJuiceImgUrl },
];

function parseTimestampMs(val: unknown): number {
  if (!val) return Date.now();
  if (val instanceof Timestamp) return val.toMillis();
  if (typeof val === 'object' && val !== null && 'seconds' in val) {
    return Number((val as { seconds: number }).seconds) * 1000;
  }
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }
  return Date.now();
}

export function playKitchenOrderAlertChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playTone = (freq: number, startOffset: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + startOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    };

    // Pleasant two-note service bell (D5 -> A5)
    playTone(587.33, 0, 0.28);
    playTone(880.0, 0.16, 0.45);
  } catch {
    // Ignore audio context autoplay restrictions
  }
}

function enrichProductWithCategoryDefaults(
  raw: Record<string, unknown>,
  staticMatch?: FoodProduct
): FoodProduct {
  const category = (raw.category as FoodCategoryId) || staticMatch?.category || 'burgers';
  const defaultSizes =
    staticMatch?.sizes ||
    (category === 'pizza'
      ? COMMON_PIZZA_SIZES
      : category === 'drinks'
      ? COMMON_DRINK_SIZES
      : [
          { id: 'regular', label: 'Regular', priceDelta: 0 },
          { id: 'large', label: 'Large / Double', priceDelta: 60 },
        ]);

  const defaultAddons =
    staticMatch?.addons ||
    (category === 'pizza'
      ? COMMON_PIZZA_ADDONS
      : category === 'rolls'
      ? COMMON_WRAP_ADDONS
      : category === 'drinks'
      ? COMMON_DRINK_ADDONS
      : COMMON_BURGER_ADDONS);

  const defaultStageGradient =
    staticMatch?.stageGradient ||
    (category === 'pizza'
      ? 'radial-gradient(circle at 50% 48%, #FFE3E3 0%, #FA5252 55%, #C92A2A 100%)'
      : category === 'rolls'
      ? 'radial-gradient(circle at 50% 48%, #ECFF9E 0%, #A9E34B 55%, #5C940D 100%)'
      : category === 'drinks'
      ? 'radial-gradient(circle at 50% 48%, #D3F9D8 0%, #38D9A9 52%, #099268 100%)'
      : 'radial-gradient(circle at 50% 48%, #FFF0C2 0%, #F5B041 55%, #D8740A 100%)');

  const stockQuantity =
    typeof raw.stockQuantity === 'number' ? Math.max(0, Math.round(raw.stockQuantity)) : 25;
  const lowStockThreshold =
    typeof raw.lowStockThreshold === 'number'
      ? Math.max(1, Math.round(raw.lowStockThreshold))
      : 5;
  const isAvailable =
    stockQuantity <= 0
      ? false
      : typeof raw.isAvailable === 'boolean'
      ? raw.isAvailable
      : true;

  return {
    id: String(raw.id || staticMatch?.id || ''),
    name: String(raw.name || staticMatch?.name || 'Untitled Item'),
    category,
    shortDescription: String(raw.shortDescription || staticMatch?.shortDescription || ''),
    fullDescription: String(
      raw.fullDescription || raw.shortDescription || staticMatch?.fullDescription || ''
    ),
    price: Number(raw.price ?? staticMatch?.price ?? 149),
    originalPrice:
      Number(raw.originalPrice ?? staticMatch?.originalPrice ?? 0) > 0
        ? Number(raw.originalPrice ?? staticMatch?.originalPrice)
        : undefined,
    image: resolveFoodImageUrl(raw.image as string, staticMatch?.image || burgerImgUrl),
    isCutout: true,
    stageGradient: defaultStageGradient,
    dishRotation: staticMatch?.dishRotation ?? -2,
    dishFilter: staticMatch?.dishFilter,
    garnishType:
      staticMatch?.garnishType ||
      (category === 'pizza'
        ? 'tikka'
        : category === 'rolls'
        ? 'shawarma'
        : category === 'drinks'
        ? 'drink-mint'
        : 'classic'),
    isVeg: typeof raw.isVeg === 'boolean' ? raw.isVeg : Boolean(staticMatch?.isVeg),
    isSpicy: typeof raw.isSpicy === 'boolean' ? raw.isSpicy : Boolean(staticMatch?.isSpicy),
    badge: String(raw.badge ?? staticMatch?.badge ?? '').trim() || undefined,
    isFeatured:
      typeof raw.isFeatured === 'boolean'
        ? raw.isFeatured
        : Boolean(raw.badge || staticMatch?.badge),
    isAvailable,
    stockQuantity,
    lowStockThreshold,
    prepTime: String(raw.prepTime || staticMatch?.prepTime || '12 min'),
    calories: String(raw.calories || staticMatch?.calories || '520 kcal'),
    rating: Number(raw.rating ?? staticMatch?.rating ?? 4.8),
    sizes: defaultSizes,
    addons: defaultAddons,
    ingredients:
      staticMatch?.ingredients || [
        'Freshly Prepared in ZaidBites Kitchen',
        'Signature House Spices & Herbs',
        'Farm-Fresh Crisp Vegetables',
      ],
    visibility: 'public',
  };
}

export interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  promoCode: string;
  deliveryFee: number;
  finalTotal: number;
}

export interface SaveProductInput {
  id: string;
  name: string;
  category: FoodCategoryId;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice: number;
  image: string;
  isVeg: boolean;
  isSpicy: boolean;
  badge: string;
  isFeatured: boolean;
  isAvailable: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  prepTime: string;
  calories: string;
  rating: number;
}

export interface SavePromoInput {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface UpdateCategoryInput {
  id: FoodCategoryId;
  name: string;
  tagline: string;
  itemCount: string;
  image: string;
  displayOrder: number;
  isEnabled: boolean;
}

interface BackendContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminChecking: boolean;
  categories: CategoryCardItem[];
  allCategoriesForAdmin: CategoryCardItem[];
  products: FoodProduct[];
  promoCodes: PromoCodeDefinition[];
  activePromoCodesMap: Record<string, PromoCodeDefinition>;
  orders: CustomerOrderRecord[];
  customerOrders: CustomerOrderRecord[];
  adminsList: AdminAccountRecord[];
  newOrderAlerts: CustomerOrderRecord[];
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  dismissOrderAlert: (orderId: string) => void;
  clearAllOrderAlerts: () => void;
  signInWithGoogle: () => Promise<User | null>;
  logoutUser: () => Promise<void>;
  placeCustomerOrder: (input: PlaceOrderInput) => Promise<CustomerOrderRecord>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  saveProduct: (input: SaveProductInput, isNew: boolean) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductStock: (
    productId: string,
    newStock: number,
    newThreshold?: number,
    isAvailableOverride?: boolean
  ) => Promise<void>;
  updateCategory: (input: UpdateCategoryInput) => Promise<void>;
  savePromoCode: (input: SavePromoInput, isNew: boolean) => Promise<void>;
  deletePromoCode: (code: string) => Promise<void>;
  addAdminAccount: (
    uid: string,
    email: string,
    name: string,
    role: 'super_admin' | 'admin' | 'manager'
  ) => Promise<void>;
  removeAdminAccount: (uid: string) => Promise<void>;
  seedInitialCatalogToFirestore: () => Promise<void>;
  isSeedingCatalog: boolean;
  catalogSyncedFromCloud: boolean;
}

const BackendContext = createContext<BackendContextValue | undefined>(undefined);

const DEFAULT_CATEGORIES_WITH_META: CategoryCardItem[] = FOOD_CATEGORIES.map((c, idx) => ({
  ...c,
  displayOrder: idx + 1,
  isEnabled: true,
  visibility: 'public',
}));

const DEFAULT_PRODUCTS_WITH_STOCK: FoodProduct[] = ALL_PRODUCTS.map((p) => ({
  ...p,
  isFeatured: Boolean(p.badge),
  isAvailable: true,
  stockQuantity: 25,
  lowStockThreshold: 5,
  visibility: 'public',
}));

const DEFAULT_PROMOS_LIST: PromoCodeDefinition[] = Object.values(VALID_PROMO_CODES).map((p) => ({
  ...p,
  minOrderAmount: p.code === 'FLAT50' ? 299 : 149,
  expiryDate: '2027-12-31',
  isActive: true,
  visibility: 'public',
}));

export const BackendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminChecking, setAdminChecking] = useState<boolean>(true);

  const [cloudCategories, setCloudCategories] = useState<CategoryCardItem[] | null>(null);
  const [cloudProducts, setCloudProducts] = useState<FoodProduct[] | null>(null);
  const [cloudPromos, setCloudPromos] = useState<PromoCodeDefinition[] | null>(null);
  const [cloudProductIds, setCloudProductIds] = useState<Set<string>>(new Set());
  const [cloudCategoryIds, setCloudCategoryIds] = useState<Set<string>>(new Set());
  const [cloudPromoIds, setCloudPromoIds] = useState<Set<string>>(new Set());

  const [orders, setOrders] = useState<CustomerOrderRecord[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrderRecord[]>([]);
  const [adminsList, setAdminsList] = useState<AdminAccountRecord[]>([]);
  const [newOrderAlerts, setNewOrderAlerts] = useState<CustomerOrderRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSeedingCatalog, setIsSeedingCatalog] = useState<boolean>(false);

  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const initialOrdersLoadedRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const autoSeedTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // 1. Listen to Firebase Authentication State & Check Admin Role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (!currentUser) {
        setIsAdmin(false);
        setAdminChecking(false);
        return;
      }

      setAdminChecking(true);
      try {
        const isBootstrappedOwner =
          Boolean(currentUser.emailVerified) &&
          currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

        if (isBootstrappedOwner) {
          setIsAdmin(true);
          setAdminChecking(false);
          // Ensure bootstrapped admin document exists in /admins/{uid}
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const snap = await getDoc(adminDocRef);
          if (!snap.exists()) {
            await setDoc(adminDocRef, {
              uid: currentUser.uid,
              email: (currentUser.email || BOOTSTRAPPED_ADMIN_EMAIL).slice(0, 120),
              name: (currentUser.displayName || 'ZaidBites Super Admin').slice(0, 80),
              role: 'super_admin',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
          return;
        }

        // Otherwise check if /admins/{uid} document exists
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        const adminSnap = await getDoc(adminDocRef);
        setIsAdmin(adminSnap.exists() && Boolean(currentUser.emailVerified));
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminChecking(false);
      }
    });

    return () => unsub();
  }, []);

  // 2. Real-Time Public Catalog Listeners (Categories, Products, Promo Codes)
  useEffect(() => {
    const catQuery = query(collection(db, 'categories'), where('visibility', '==', 'public'));
    const unsubCategories = onSnapshot(
      catQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setCloudCategories(null);
          setCloudCategoryIds(new Set());
          return;
        }
        const ids = new Set<string>();
        const list: CategoryCardItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          ids.add(docSnap.id);
          const staticCat =
            FOOD_CATEGORIES.find((c) => c.id === data.id) || FOOD_CATEGORIES[0];
          return {
            ...staticCat,
            id: (data.id as FoodCategoryId) || staticCat.id,
            name: String(data.name || staticCat.name),
            path: String(data.path || staticCat.path),
            tagline: String(data.tagline || staticCat.tagline),
            itemCount: String(data.itemCount || staticCat.itemCount),
            image: resolveFoodImageUrl(data.image as string, staticCat.image),
            accentColor: String(data.accentColor || staticCat.accentColor),
            accentGradient: String(data.accentGradient || staticCat.accentGradient),
            displayOrder:
              typeof data.displayOrder === 'number' ? data.displayOrder : 1,
            isEnabled: typeof data.isEnabled === 'boolean' ? data.isEnabled : true,
            visibility: 'public',
          };
        });
        list.sort((a, b) => (a.displayOrder ?? 1) - (b.displayOrder ?? 1));
        setCloudCategoryIds(ids);
        setCloudCategories(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'categories');
      }
    );

    const prodQuery = query(collection(db, 'products'), where('visibility', '==', 'public'));
    const unsubProducts = onSnapshot(
      prodQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setCloudProducts(null);
          setCloudProductIds(new Set());
          return;
        }
        const ids = new Set<string>();
        const items: FoodProduct[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          ids.add(docSnap.id);
          const staticMatch = ALL_PRODUCTS.find((p) => p.id === docSnap.id);
          return enrichProductWithCategoryDefaults(
            { ...data, id: docSnap.id },
            staticMatch
          );
        });
        setCloudProductIds(ids);
        setCloudProducts(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    const promoQuery = query(collection(db, 'promoCodes'), where('visibility', '==', 'public'));
    const unsubPromos = onSnapshot(
      promoQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setCloudPromos(null);
          setCloudPromoIds(new Set());
          return;
        }
        const ids = new Set<string>();
        const promos: PromoCodeDefinition[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          ids.add(docSnap.id);
          return {
            code: String(data.code || docSnap.id),
            type: data.type === 'flat' ? 'flat' : 'percent',
            value: Number(data.value || 10),
            description: String(data.description || ''),
            minOrderAmount: Number(data.minOrderAmount ?? 0),
            expiryDate: String(data.expiryDate || '2027-12-31'),
            isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
            visibility: 'public',
          };
        });
        setCloudPromoIds(ids);
        setCloudPromos(promos);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'promoCodes');
      }
    );

    return () => {
      unsubCategories();
      unsubProducts();
      unsubPromos();
    };
  }, []);

  // 3. Seed Initial Catalog into Firestore automatically when Admin first logs in if empty
  const seedInitialCatalogToFirestore = useCallback(async () => {
    if (!isAdmin) return;
    setIsSeedingCatalog(true);
    try {
      // Seed Categories
      for (let i = 0; i < FOOD_CATEGORIES.length; i++) {
        const cat = FOOD_CATEGORIES[i];
        const catRef = doc(db, 'categories', cat.id);
        const existing = await getDoc(catRef);
        if (!existing.exists()) {
          await setDoc(catRef, {
            id: cat.id,
            name: cat.name.slice(0, 60),
            path: cat.path.slice(0, 40),
            tagline: cat.tagline.slice(0, 160),
            itemCount: cat.itemCount.slice(0, 60),
            image: cat.image.slice(0, 600000),
            accentColor: cat.accentColor.slice(0, 30),
            accentGradient: cat.accentGradient.slice(0, 240),
            displayOrder: i + 1,
            isEnabled: true,
            visibility: 'public',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Seed All 24 Products across Burgers, Pizza, Rolls & Wraps, and Drinks
      for (const prod of ALL_PRODUCTS) {
        const prodRef = doc(db, 'products', prod.id);
        const existing = await getDoc(prodRef);
        if (!existing.exists()) {
          await setDoc(prodRef, {
            id: prod.id.slice(0, 128),
            name: prod.name.slice(0, 100),
            category: prod.category,
            shortDescription: prod.shortDescription.slice(0, 300),
            fullDescription: prod.fullDescription.slice(0, 800),
            price: Number(prod.price),
            originalPrice: Number(prod.originalPrice ?? prod.price + 30),
            image: prod.image.slice(0, 600000),
            isVeg: Boolean(prod.isVeg),
            isSpicy: Boolean(prod.isSpicy),
            badge: (prod.badge || '').slice(0, 40),
            isFeatured: Boolean(prod.badge),
            isAvailable: true,
            stockQuantity: 25,
            lowStockThreshold: 5,
            prepTime: (prod.prepTime || '12 min').slice(0, 30),
            calories: (prod.calories || '520 kcal').slice(0, 30),
            rating: Number(prod.rating || 4.8),
            visibility: 'public',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }

      // Seed Promo Codes
      for (const promo of DEFAULT_PROMOS_LIST) {
        const promoRef = doc(db, 'promoCodes', promo.code);
        const existing = await getDoc(promoRef);
        if (!existing.exists()) {
          await setDoc(promoRef, {
            code: promo.code.slice(0, 30),
            type: promo.type,
            value: Number(promo.value),
            description: promo.description.slice(0, 200),
            minOrderAmount: Number(promo.minOrderAmount ?? 149),
            expiryDate: (promo.expiryDate || '2027-12-31').slice(0, 40),
            isActive: true,
            visibility: 'public',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'catalog-seed');
    } finally {
      setIsSeedingCatalog(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (
      authReady &&
      isAdmin &&
      cloudProducts === null &&
      !autoSeedTriggeredRef.current
    ) {
      autoSeedTriggeredRef.current = true;
      seedInitialCatalogToFirestore().catch(() => {});
    }
  }, [authReady, isAdmin, cloudProducts, seedInitialCatalogToFirestore]);

  // 4. Real-Time Orders & Admins Listeners for Authorized Admins
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setOrders([]);
      setAdminsList([]);
      initialOrdersLoadedRef.current = false;
      knownOrderIdsRef.current.clear();
      return;
    }

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const parsedOrders: CustomerOrderRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            orderNumber: String(d.orderNumber || docSnap.id),
            customerId: String(d.customerId || ''),
            customerEmail: String(d.customerEmail || ''),
            customerName: String(d.customerName || 'Guest'),
            customerPhone: String(d.customerPhone || ''),
            deliveryAddress: String(d.deliveryAddress || ''),
            items: Array.isArray(d.items) ? (d.items as OrderLineItem[]) : [],
            itemsSummary: String(d.itemsSummary || ''),
            totalItemsCount: Number(d.totalItemsCount || 1),
            subtotal: Number(d.subtotal || 0),
            discount: Number(d.discount || 0),
            promoCode: String(d.promoCode || ''),
            deliveryFee: Number(d.deliveryFee || 0),
            finalTotal: Number(d.finalTotal || 0),
            paymentMethod: (d.paymentMethod as PaymentMethod) || 'Cash on Delivery',
            status: (d.status as OrderStatus) || 'New Order',
            createdAtMs: parseTimestampMs(d.createdAt),
            updatedAtMs: parseTimestampMs(d.updatedAt),
          };
        });

        parsedOrders.sort((a, b) => b.createdAtMs - a.createdAtMs);

        // Detect newly arrived orders after initial snapshot load
        if (initialOrdersLoadedRef.current) {
          const newlyAdded: CustomerOrderRecord[] = [];
          for (const ord of parsedOrders) {
            if (!knownOrderIdsRef.current.has(ord.id)) {
              knownOrderIdsRef.current.add(ord.id);
              newlyAdded.push(ord);
            }
          }
          if (newlyAdded.length > 0) {
            setNewOrderAlerts((prev) => [...newlyAdded, ...prev]);
            if (soundEnabledRef.current) {
              playKitchenOrderAlertChime();
            }
          }
        } else {
          parsedOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
          initialOrdersLoadedRef.current = true;
        }

        setOrders(parsedOrders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    const adminsQuery = query(
      collection(db, 'admins'),
      where('role', 'in', ['super_admin', 'admin', 'manager'])
    );
    const unsubAdmins = onSnapshot(
      adminsQuery,
      (snapshot) => {
        const list: AdminAccountRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            uid: String(d.uid || docSnap.id),
            email: String(d.email || ''),
            name: String(d.name || ''),
            role: (d.role as AdminAccountRecord['role']) || 'admin',
            createdAtMs: parseTimestampMs(d.createdAt),
          };
        });
        setAdminsList(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'admins');
      }
    );

    return () => {
      unsubOrders();
      unsubAdmins();
    };
  }, [authReady, user, isAdmin]);

  // 5. Real-Time Customer Orders Listener (for Customer Order Tracking)
  useEffect(() => {
    if (!authReady || !user) {
      setCustomerOrders([]);
      return;
    }

    const q = query(collection(db, 'orders'), where('customerId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: CustomerOrderRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            orderNumber: String(d.orderNumber || docSnap.id),
            customerId: String(d.customerId || ''),
            customerEmail: String(d.customerEmail || ''),
            customerName: String(d.customerName || ''),
            customerPhone: String(d.customerPhone || ''),
            deliveryAddress: String(d.deliveryAddress || ''),
            items: Array.isArray(d.items) ? (d.items as OrderLineItem[]) : [],
            itemsSummary: String(d.itemsSummary || ''),
            totalItemsCount: Number(d.totalItemsCount || 1),
            subtotal: Number(d.subtotal || 0),
            discount: Number(d.discount || 0),
            promoCode: String(d.promoCode || ''),
            deliveryFee: Number(d.deliveryFee || 0),
            finalTotal: Number(d.finalTotal || 0),
            paymentMethod: (d.paymentMethod as PaymentMethod) || 'Cash on Delivery',
            status: (d.status as OrderStatus) || 'New Order',
            createdAtMs: parseTimestampMs(d.createdAt),
            updatedAtMs: parseTimestampMs(d.updatedAt),
          };
        });
        list.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setCustomerOrders(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    return () => unsub();
  }, [authReady, user]);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  }, []);

  const logoutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const dismissOrderAlert = useCallback((orderId: string) => {
    setNewOrderAlerts((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const clearAllOrderAlerts = useCallback(() => {
    setNewOrderAlerts([]);
  }, []);

  // Effective categories, products, and promo codes
  const allCategoriesForAdmin = cloudCategories ?? DEFAULT_CATEGORIES_WITH_META;
  const categories = allCategoriesForAdmin.filter((c) => c.isEnabled !== false);
  const products = cloudProducts ?? DEFAULT_PRODUCTS_WITH_STOCK;
  const promoCodes = cloudPromos ?? DEFAULT_PROMOS_LIST;

  const activePromoCodesMap = React.useMemo(() => {
    const map: Record<string, PromoCodeDefinition> = {};
    const todayIso = new Date().toISOString().slice(0, 10);
    for (const p of promoCodes) {
      const notExpired = !p.expiryDate || p.expiryDate >= todayIso;
      if (p.isActive !== false && notExpired) {
        map[p.code.toUpperCase()] = p;
      }
    }
    return map;
  }, [promoCodes]);

  // 6. Place Customer Order + Deduct Product Stock in Real Time
  const placeCustomerOrder = useCallback(
    async (input: PlaceOrderInput): Promise<CustomerOrderRecord> => {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        currentUser = await signInWithGoogle();
      }
      if (!currentUser) {
        throw new Error('Authentication is required to place an order.');
      }

      const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const orderNumber = `ZB-${Math.floor(100000 + Math.random() * 900000)}`;

      const lineItems: OrderLineItem[] = input.cart.slice(0, 20).map((item) => {
        const sizeLabel = item.selectedSize
          ? `${item.selectedSize.label}${item.selectedSize.diameter ? ` (${item.selectedSize.diameter})` : ''}`
          : 'Standard';
        const addonsLabel =
          item.selectedAddons.length > 0
            ? item.selectedAddons.map((a) => a.label).join(', ')
            : 'None';
        const qty = Math.max(1, Math.min(99, Math.round(item.quantity)));
        const unitPrice = Math.max(1, Math.round(item.unitPrice));
        return {
          productId: item.product.id.slice(0, 128),
          name: item.product.name.slice(0, 120),
          category: item.product.category,
          sizeLabel: sizeLabel.slice(0, 60),
          addonsLabel: addonsLabel.slice(0, 200),
          quantity: qty,
          unitPrice,
          lineTotal: Math.max(1, unitPrice * qty),
          image: item.product.image.slice(0, 600000),
        };
      });

      const itemsSummary = lineItems
        .map(
          (li) =>
            `${li.quantity}x ${li.name}${li.sizeLabel !== 'Standard' ? ` (${li.sizeLabel})` : ''}`
        )
        .join(' · ')
        .slice(0, 2000);

      const totalItemsCount = Math.max(
        1,
        Math.min(
          200,
          lineItems.reduce((sum, li) => sum + li.quantity, 0)
        )
      );

      const cleanPayload = {
        orderNumber: orderNumber.slice(0, 40),
        customerId: currentUser.uid,
        customerEmail: (currentUser.email || 'customer@zaidbites.kitchen').slice(0, 120),
        customerName: input.customerName.trim().slice(0, 100),
        customerPhone: input.customerPhone.trim().slice(0, 30),
        deliveryAddress: input.deliveryAddress.trim().slice(0, 400),
        items: lineItems,
        itemsSummary: itemsSummary || '1x ZaidBites Meal',
        totalItemsCount,
        subtotal: Math.max(1, Math.round(input.subtotal)),
        discount: Math.max(0, Math.round(input.discount)),
        promoCode: (input.promoCode || '').trim().toUpperCase().slice(0, 30),
        deliveryFee: Math.max(0, Math.round(input.deliveryFee)),
        finalTotal: Math.max(1, Math.round(input.finalTotal)),
        paymentMethod: input.paymentMethod,
        status: 'New Order' as OrderStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(doc(db, 'orders', orderId), cleanPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
      }

      // Automatically reduce product stock in Firestore for each ordered product
      const qtyByProductId: Record<string, number> = {};
      for (const li of lineItems) {
        qtyByProductId[li.productId] = (qtyByProductId[li.productId] || 0) + li.quantity;
      }

      for (const [productId, orderedQty] of Object.entries(qtyByProductId)) {
        if (!cloudProductIds.has(productId)) continue;
        const currentProd = products.find((p) => p.id === productId);
        if (!currentProd) continue;
        const currentStock = currentProd.stockQuantity ?? 25;
        const newStock = Math.max(0, Math.round(currentStock - orderedQty));
        if (newStock < currentStock) {
          const newAvailable = newStock > 0 ? Boolean(currentProd.isAvailable ?? true) : false;
          try {
            await updateDoc(doc(db, 'products', productId), {
              stockQuantity: newStock,
              isAvailable: newAvailable,
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
          }
        }
      }

      const now = Date.now();
      return {
        id: orderId,
        ...cleanPayload,
        createdAtMs: now,
        updatedAtMs: now,
      };
    },
    [signInWithGoogle, cloudProductIds, products]
  );

  // 7. Admin: Update Order Status
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  }, []);

  // 8. Admin: Add or Edit Product
  const saveProduct = useCallback(
    async (input: SaveProductInput, isNew: boolean) => {
      const cleanId = input.id
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 128);
      const stockQuantity = Math.max(0, Math.min(10000, Math.round(Number(input.stockQuantity))));
      const lowStockThreshold = Math.max(
        1,
        Math.min(500, Math.round(Number(input.lowStockThreshold || 5)))
      );
      const isAvailable = stockQuantity <= 0 ? false : Boolean(input.isAvailable);

      const baseFields = {
        name: input.name.trim().slice(0, 100),
        category: input.category,
        shortDescription: input.shortDescription.trim().slice(0, 300),
        fullDescription: (input.fullDescription.trim() || input.shortDescription.trim()).slice(
          0,
          800
        ),
        price: Math.max(1, Math.min(100000, Math.round(Number(input.price)))),
        originalPrice: Math.max(0, Math.min(100000, Math.round(Number(input.originalPrice || 0)))),
        image: input.image.trim().slice(0, 600000),
        isVeg: Boolean(input.isVeg),
        isSpicy: Boolean(input.isSpicy),
        badge: (input.badge || '').trim().slice(0, 40),
        isFeatured: Boolean(input.isFeatured),
        isAvailable,
        stockQuantity,
        lowStockThreshold,
        prepTime: (input.prepTime || '12 min').trim().slice(0, 30),
        calories: (input.calories || '520 kcal').trim().slice(0, 30),
        rating: Math.max(1, Math.min(5, Number(Number(input.rating || 4.8).toFixed(1)))),
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, 'products', cleanId);
      try {
        if (isNew || !cloudProductIds.has(cleanId)) {
          await setDoc(docRef, {
            id: cleanId,
            ...baseFields,
            visibility: 'public',
            createdAt: serverTimestamp(),
          });
        } else {
          await updateDoc(docRef, baseFields);
        }
      } catch (error) {
        handleFirestoreError(
          error,
          isNew ? OperationType.CREATE : OperationType.UPDATE,
          `products/${cleanId}`
        );
      }
    },
    [cloudProductIds]
  );

  // 9. Admin: Delete Product
  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  }, []);

  // 10. Admin: Quick Stock & Availability Update
  const updateProductStock = useCallback(
    async (
      productId: string,
      newStock: number,
      newThreshold?: number,
      isAvailableOverride?: boolean
    ) => {
      const existingProd = products.find((p) => p.id === productId);
      if (!existingProd) return;

      const stockQuantity = Math.max(0, Math.min(10000, Math.round(newStock)));
      const lowStockThreshold =
        newThreshold !== undefined
          ? Math.max(1, Math.min(500, Math.round(newThreshold)))
          : existingProd.lowStockThreshold ?? 5;
      const isAvailable =
        stockQuantity <= 0
          ? false
          : isAvailableOverride !== undefined
          ? isAvailableOverride
          : true;

      await saveProduct(
        {
          id: existingProd.id,
          name: existingProd.name,
          category: existingProd.category,
          shortDescription: existingProd.shortDescription,
          fullDescription: existingProd.fullDescription,
          price: existingProd.price,
          originalPrice: existingProd.originalPrice ?? 0,
          image: existingProd.image,
          isVeg: Boolean(existingProd.isVeg),
          isSpicy: Boolean(existingProd.isSpicy),
          badge: existingProd.badge || '',
          isFeatured: Boolean(existingProd.isFeatured),
          isAvailable,
          stockQuantity,
          lowStockThreshold,
          prepTime: existingProd.prepTime,
          calories: existingProd.calories,
          rating: existingProd.rating,
        },
        !cloudProductIds.has(productId)
      );
    },
    [products, cloudProductIds, saveProduct]
  );

  // 11. Admin: Update Category
  const updateCategory = useCallback(
    async (input: UpdateCategoryInput) => {
      const staticCat = FOOD_CATEGORIES.find((c) => c.id === input.id) || FOOD_CATEGORIES[0];
      const docRef = doc(db, 'categories', input.id);
      const updateFields = {
        name: input.name.trim().slice(0, 60),
        path: staticCat.path.slice(0, 40),
        tagline: input.tagline.trim().slice(0, 160),
        itemCount: input.itemCount.trim().slice(0, 60),
        image: input.image.trim().slice(0, 600000),
        accentColor: staticCat.accentColor.slice(0, 30),
        accentGradient: staticCat.accentGradient.slice(0, 240),
        displayOrder: Math.max(0, Math.min(100, Math.round(Number(input.displayOrder)))),
        isEnabled: Boolean(input.isEnabled),
        updatedAt: serverTimestamp(),
      };

      try {
        if (!cloudCategoryIds.has(input.id)) {
          await setDoc(docRef, {
            id: input.id,
            ...updateFields,
            visibility: 'public',
            createdAt: serverTimestamp(),
          });
        } else {
          await updateDoc(docRef, updateFields);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `categories/${input.id}`);
      }
    },
    [cloudCategoryIds]
  );

  // 12. Admin: Add or Edit Promo Code
  const savePromoCode = useCallback(
    async (input: SavePromoInput, isNew: boolean) => {
      const cleanCode = input.code
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9_-]/g, '')
        .slice(0, 30);
      const docRef = doc(db, 'promoCodes', cleanCode);
      const updateFields = {
        type: input.type,
        value: Math.max(1, Math.min(10000, Math.round(Number(input.value)))),
        description: input.description.trim().slice(0, 200),
        minOrderAmount: Math.max(0, Math.min(100000, Math.round(Number(input.minOrderAmount)))),
        expiryDate: (input.expiryDate || '2027-12-31').trim().slice(0, 40),
        isActive: Boolean(input.isActive),
        updatedAt: serverTimestamp(),
      };

      try {
        if (isNew || !cloudPromoIds.has(cleanCode)) {
          await setDoc(docRef, {
            code: cleanCode,
            ...updateFields,
            visibility: 'public',
            createdAt: serverTimestamp(),
          });
        } else {
          await updateDoc(docRef, updateFields);
        }
      } catch (error) {
        handleFirestoreError(
          error,
          isNew ? OperationType.CREATE : OperationType.UPDATE,
          `promoCodes/${cleanCode}`
        );
      }
    },
    [cloudPromoIds]
  );

  // 13. Admin: Delete Promo Code
  const deletePromoCode = useCallback(async (code: string) => {
    try {
      await deleteDoc(doc(db, 'promoCodes', code));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `promoCodes/${code}`);
    }
  }, []);

  // 14. Admin: Add / Remove Additional Administrator Accounts
  const addAdminAccount = useCallback(
    async (
      uid: string,
      email: string,
      name: string,
      role: 'super_admin' | 'admin' | 'manager'
    ) => {
      const cleanUid = uid.trim().slice(0, 128);
      try {
        await setDoc(doc(db, 'admins', cleanUid), {
          uid: cleanUid,
          email: email.trim().slice(0, 120),
          name: name.trim().slice(0, 80),
          role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `admins/${cleanUid}`);
      }
    },
    []
  );

  const removeAdminAccount = useCallback(async (uid: string) => {
    try {
      await deleteDoc(doc(db, 'admins', uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `admins/${uid}`);
    }
  }, []);

  return (
    <BackendContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        adminChecking,
        categories,
        allCategoriesForAdmin,
        products,
        promoCodes,
        activePromoCodesMap,
        orders,
        customerOrders,
        adminsList,
        newOrderAlerts,
        soundEnabled,
        setSoundEnabled,
        dismissOrderAlert,
        clearAllOrderAlerts,
        signInWithGoogle,
        logoutUser,
        placeCustomerOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        updateProductStock,
        updateCategory,
        savePromoCode,
        deletePromoCode,
        addAdminAccount,
        removeAdminAccount,
        seedInitialCatalogToFirestore,
        isSeedingCatalog,
        catalogSyncedFromCloud: cloudProducts !== null,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};

export function useBackend(): BackendContextValue {
  const ctx = useContext(BackendContext);
  if (!ctx) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return ctx;
}
