import { SlideId } from '../components/FloatingIngredients';

export type FoodCategoryId = 'burgers' | 'pizza' | 'rolls' | 'drinks';

export interface ProductSizeOption {
  id: string;
  label: string;
  diameter?: string;
  priceDelta: number;
}

export interface ProductAddonOption {
  id: string;
  label: string;
  price: number;
}

export interface FoodProduct {
  id: string;
  name: string;
  category: FoodCategoryId;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  /** Whether the image has a studio white backdrop that should be processed via TransparentFoodImage */
  isCutout?: boolean;
  /** Custom radial gradient stage backdrop for the product card */
  stageGradient?: string;
  /** Subtle rotation angle in degrees to differentiate product presentation */
  dishRotation?: number;
  /** Optional CSS filter to accentuate tones */
  dishFilter?: string;
  /** Garnish visual accent key rendered around the cutout */
  garnishType?:
    | 'classic'
    | 'crispy'
    | 'zinger'
    | 'spicy'
    | 'veg'
    | 'paneer'
    | 'margherita'
    | 'farmhouse'
    | 'tikka'
    | 'bbq'
    | 'pepperoni'
    | 'shawarma'
    | 'drink-citrus'
    | 'drink-mint'
    | 'drink-coffee'
    | 'drink-choco'
    | 'drink-berry';
  /** Whether the item is Vegetarian */
  isVeg?: boolean;
  badge?: string;
  calories: string;
  prepTime: string;
  rating: number;
  isSpicy?: boolean;
  sizes?: ProductSizeOption[];
  addons?: ProductAddonOption[];
  ingredients: string[];
  /** Backend Inventory & Featured Fields */
  isFeatured?: boolean;
  isAvailable?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  visibility?: 'public';
}

export interface CategoryCardItem {
  id: FoodCategoryId;
  path: string;
  name: string;
  tagline: string;
  itemCount: string;
  image: string;
  isCutout?: boolean;
  accentGradient: string;
  accentColor: string;
  heroSlideId?: SlideId;
  /** Backend Category Management Fields */
  displayOrder?: number;
  isEnabled?: boolean;
  visibility?: 'public';
}

export interface PromoCodeDefinition {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
  /** Backend Promo Management Fields */
  minOrderAmount?: number;
  expiryDate?: string;
  isActive?: boolean;
  visibility?: 'public';
}

export interface CartItem {
  cartItemId: string;
  product: FoodProduct;
  quantity: number;
  selectedSize?: ProductSizeOption;
  selectedAddons: ProductAddonOption[];
  unitPrice: number;
}

export type OrderStatus =
  | 'New Order'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'UPI / QR Pay'
  | 'Card on Delivery';

export interface OrderLineItem {
  productId: string;
  name: string;
  category: FoodCategoryId;
  sizeLabel: string;
  addonsLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
}

export interface CustomerOrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderLineItem[];
  itemsSummary: string;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  promoCode: string;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface AdminAccountRecord {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
  createdAtMs: number;
}
