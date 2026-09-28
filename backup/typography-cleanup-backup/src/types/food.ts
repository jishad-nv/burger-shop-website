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
}

export interface PromoCodeDefinition {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
}

export interface CartItem {
  cartItemId: string;
  product: FoodProduct;
  quantity: number;
  selectedSize?: ProductSizeOption;
  selectedAddons: ProductAddonOption[];
  unitPrice: number;
}
