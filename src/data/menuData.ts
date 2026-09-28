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
import {
  CategoryCardItem,
  FoodProduct,
  ProductAddonOption,
  ProductSizeOption,
  PromoCodeDefinition,
} from '../types/food';
import { preloadTransparentFoodImages } from '../components/TransparentFoodImage';

// Preload all studio cutout images so category and product transitions are instantaneous
preloadTransparentFoodImages([
  burgerImgUrl,
  rollImgUrl,
  pizzaImgUrl,
  zingerBurgerImgUrl,
  paneerBurgerImgUrl,
  tikkaPizzaImgUrl,
  shawarmaRollImgUrl,
  mojitoDrinkImgUrl,
  chocoShakeImgUrl,
  orangeJuiceImgUrl,
  strawberryShakeImgUrl,
]);

export const VALID_PROMO_CODES: Record<string, PromoCodeDefinition> = {
  WELCOME10: {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    description: '10% off on your order',
  },
  SAVE20: {
    code: 'SAVE20',
    type: 'percent',
    value: 20,
    description: '20% off special savings',
  },
  FLAT50: {
    code: 'FLAT50',
    type: 'flat',
    value: 50,
    description: '₹50 flat discount on your order',
  },
};

export const COMMON_BURGER_ADDONS: ProductAddonOption[] = [
  { id: 'extra-cheese', label: 'Extra Cheddar Cheese Slice', price: 30 },
  { id: 'extra-patty', label: 'Double Crispy Patty Upgrade', price: 60 },
  { id: 'peri-mayo', label: 'Fiery Peri-Peri Dip', price: 25 },
  { id: 'jalapenos', label: 'Pickled Jalapeños & Olives', price: 30 },
];

export const COMMON_PIZZA_SIZES: ProductSizeOption[] = [
  { id: 'regular', label: 'Regular', diameter: '8"', priceDelta: 0 },
  { id: 'medium', label: 'Medium', diameter: '10"', priceDelta: 90 },
  { id: 'large', label: 'Large', diameter: '12"', priceDelta: 170 },
];

export const COMMON_PIZZA_ADDONS: ProductAddonOption[] = [
  { id: 'cheese-burst', label: 'Liquid Cheese Burst Crust', price: 79 },
  { id: 'extra-mozzarella', label: 'Extra 100% Mozzarella', price: 59 },
  { id: 'black-olives-jalapeno', label: 'Black Olives & Red Paprika', price: 45 },
];

export const COMMON_WRAP_ADDONS: ProductAddonOption[] = [
  { id: 'extra-garlic-toum', label: 'Extra Whipped Garlic Mayo', price: 25 },
  { id: 'cheese-melt', label: 'Melted Liquid Cheese Inside', price: 35 },
  { id: 'mint-chutney', label: 'Fresh Pudina & Green Chili Dip', price: 20 },
];

export const COMMON_DRINK_SIZES: ProductSizeOption[] = [
  { id: 'regular', label: 'Regular', diameter: '350ml', priceDelta: 0 },
  { id: 'large', label: 'Tall Glass', diameter: '500ml', priceDelta: 30 },
];

export const COMMON_DRINK_ADDONS: ProductAddonOption[] = [
  { id: 'extra-whipped-cream', label: 'Extra Whipped Cream Crown', price: 25 },
  { id: 'ice-cream-scoop', label: 'Vanilla Bean Ice Cream Float', price: 40 },
];

/* ============================================================================
 * FOUR MAIN HOMEPAGE FOOD CATEGORIES
 * 1. BURGERS (/burgers)
 * 2. PIZZA (/pizza)
 * 3. ROLLS & WRAPS (/rolls)
 * 4. DRINKS (/drinks)
 * ========================================================================== */
export const FOOD_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'burgers',
    path: '/burgers',
    name: 'Burgers',
    tagline: 'Flame-seared chicken, crispy zinger & paneer',
    itemCount: '6 Items · From ₹99',
    image: burgerImgUrl,
    isCutout: true,
    accentGradient:
      'radial-gradient(circle at 50% 44%, #FFE699 0%, #F5A623 55%, #D8740A 100%)',
    accentColor: '#E58619',
    heroSlideId: 'burger',
  },
  {
    id: 'pizza',
    path: '/pizza',
    name: 'Pizza',
    tagline: 'Stone-baked Margherita, tikka & pepperoni',
    itemCount: '6 Items · From ₹199',
    image: tikkaPizzaImgUrl,
    isCutout: true,
    accentGradient:
      'radial-gradient(circle at 50% 44%, #FFE3C8 0%, #F78848 55%, #C92A2A 100%)',
    accentColor: '#E03131',
    heroSlideId: 'pizza',
  },
  {
    id: 'rolls',
    path: '/rolls',
    name: 'Rolls & Wraps',
    tagline: 'Spit-roasted shawarma, kathi rolls & wraps',
    itemCount: '6 Items · From ₹99',
    image: shawarmaRollImgUrl,
    isCutout: true,
    accentGradient:
      'radial-gradient(circle at 50% 44%, #ECFF9E 0%, #94D82D 55%, #5C940D 100%)',
    accentColor: '#5C940D',
    heroSlideId: 'roll',
  },
  {
    id: 'drinks',
    path: '/drinks',
    name: 'Drinks',
    tagline: 'Sparkling mojitos, cold coffee & thick shakes',
    itemCount: '6 Items · From ₹79',
    image: mojitoDrinkImgUrl,
    isCutout: true,
    accentGradient:
      'radial-gradient(circle at 50% 44%, #D3F9D8 0%, #38D9A9 52%, #0CA678 100%)',
    accentColor: '#0CA678',
  },
];

/* ============================================================================
 * 1. BURGER MENU PAGE (/burgers) — 6 ITEMS
 * ========================================================================== */
export const SIGNATURE_BURGERS: FoodProduct[] = [
  {
    id: 'burger-classic-chicken',
    name: 'Classic Chicken Burger',
    category: 'burgers',
    shortDescription:
      'Juicy flame-seared chicken patty, melted cheddar slice, crisp iceberg lettuce, onion rings & signature creamy burger sauce.',
    fullDescription:
      'Our all-time favorite Classic Chicken Burger crafted with a tender herb-seasoned chicken patty seared golden on the grill, topped with warm melted cheddar cheese, crunchy iceberg lettuce, sweet red onions, and creamy house mayo in a toasted sesame bun.',
    price: 149,
    originalPrice: 179,
    image: burgerImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF0C2 0%, #F5B041 55%, #D8740A 100%)',
    dishRotation: -2,
    garnishType: 'classic',
    isVeg: false,
    badge: 'Bestseller',
    calories: '520 kcal',
    prepTime: '10 min',
    rating: 4.8,
    isSpicy: false,
    sizes: [
      { id: 'single', label: 'Single Patty', priceDelta: 0 },
      { id: 'double', label: 'Double Patty', priceDelta: 60 },
    ],
    addons: COMMON_BURGER_ADDONS,
    ingredients: [
      'Toasted Golden Sesame Bun',
      'Herb-Seasoned Grilled Chicken Patty',
      'Melted American Cheddar Slice',
      'Crisp Iceberg Lettuce & Vine Tomato',
      'Creamy Classic Burger Mayo',
    ],
  },
  {
    id: 'burger-crispy-chicken',
    name: 'Crispy Chicken Burger',
    category: 'burgers',
    shortDescription:
      'Golden double-breaded crunchy chicken fillet, tangy dill pickles, shredded lettuce & roasted garlic aioli on a soft brioche bun.',
    fullDescription:
      'Coated in our signature spiced cornflake-and-herb batter for an irresistible golden crunch. Layered with shredded farm-fresh lettuce, tangy gherkin pickles, cheddar cheese, and velvety roasted garlic mayo inside a butter-toasted brioche bun.',
    price: 179,
    originalPrice: 209,
    image: zingerBurgerImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFE8B5 0%, #F79F24 55%, #C85A08 100%)',
    dishRotation: 2,
    garnishType: 'crispy',
    isVeg: false,
    badge: 'Extra Crispy',
    calories: '590 kcal',
    prepTime: '12 min',
    rating: 4.9,
    isSpicy: false,
    sizes: [
      { id: 'single', label: 'Regular Crunch', priceDelta: 0 },
      { id: 'double', label: 'Double Crunch', priceDelta: 70 },
    ],
    addons: COMMON_BURGER_ADDONS,
    ingredients: [
      'Butter-Toasted Sesame Brioche',
      'Double-Breaded Crispy Chicken Fillet',
      'Aged Cheddar Cheese',
      'Tangy Dill Pickle Coins',
      'Roasted Garlic Herb Aioli',
    ],
  },
  {
    id: 'burger-chicken-zinger',
    name: 'Chicken Zinger Burger',
    category: 'burgers',
    shortDescription:
      'Towering whole-muscle spicy zinger breast fillet, double cheddar, crunchy slaw & fiery Southwest zinger sauce.',
    fullDescription:
      'Our crown jewel Chicken Zinger Burger! Features a thick 24-hour buttermilk-marinated whole chicken breast fried to shattering crispness, crowned with melted cheddar, crisp romaine lettuce, and bold smoky zinger glaze.',
    price: 199,
    originalPrice: 239,
    image: zingerBurgerImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFD8A8 0%, #F76707 58%, #B42B18 100%)',
    dishRotation: -3,
    dishFilter: 'saturate(1.12) contrast(1.04)',
    garnishType: 'zinger',
    isVeg: false,
    badge: 'Chef Signature',
    calories: '680 kcal',
    prepTime: '12 min',
    rating: 4.9,
    isSpicy: true,
    sizes: [
      { id: 'single', label: 'Classic Zinger', priceDelta: 0 },
      { id: 'double', label: 'Monster Double Zinger', priceDelta: 80 },
    ],
    addons: COMMON_BURGER_ADDONS,
    ingredients: [
      'Artisan Glazed Sesame Crown Bun',
      'Whole-Muscle Crispy Zinger Breast',
      'Double Melted Sharp Cheddar',
      'Crunchy Romaine & Red Onion Rings',
      'Signature Fiery Zinger Sauce',
    ],
  },
  {
    id: 'burger-spicy-chicken',
    name: 'Spicy Chicken Burger',
    category: 'burgers',
    shortDescription:
      'Ghost-chili & peri-peri glazed chicken patty, pickled jalapeños, red paprika, pepper jack cheese & chipotle lava mayo.',
    fullDescription:
      'Crafted for true spice lovers! A juicy chicken patty basted in fiery peri-peri chili oil, stacked with spicy pickled jalapeños, crunchy red onions, melted cheese, and smoky chipotle lava sauce inside a warm toasted bun.',
    price: 189,
    originalPrice: 219,
    image: burgerImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFC9C9 0%, #F03E3E 55%, #A61E1E 100%)',
    dishRotation: 3,
    dishFilter: 'saturate(1.18) contrast(1.05)',
    garnishType: 'spicy',
    isVeg: false,
    badge: 'Fiery Hot',
    calories: '610 kcal',
    prepTime: '11 min',
    rating: 4.8,
    isSpicy: true,
    sizes: [
      { id: 'single', label: 'Single Stack', priceDelta: 0 },
      { id: 'double', label: 'Double Stack', priceDelta: 65 },
    ],
    addons: COMMON_BURGER_ADDONS,
    ingredients: [
      'Peri-Peri Basted Chicken Patty',
      'Pickled Green Jalapeño Slices',
      'Smoky Chipotle Lava Mayo',
      'Melted Pepper Cheddar',
      'Crisp Lettuce & Red Onion',
    ],
  },
  {
    id: 'burger-classic-veg',
    name: 'Classic Veg Burger',
    category: 'burgers',
    shortDescription:
      'Golden-crusted garden vegetable & herb potato patty, fresh tomato slices, crunchy lettuce & tangy Thousand Island dressing.',
    fullDescription:
      'Crispy on the outside, bursting with sweet corn, green peas, carrots, and aromatic Indian herbs on the inside. Topped with vine-ripened tomatoes, crisp lettuce, and creamy herb mayo in a soft toasted sesame bun.',
    price: 99,
    originalPrice: 129,
    image: paneerBurgerImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #EBFBEE 0%, #69DB7C 52%, #2B8A3E 100%)',
    dishRotation: -2,
    garnishType: 'veg',
    isVeg: true,
    badge: 'Value Favourite',
    calories: '430 kcal',
    prepTime: '9 min',
    rating: 4.7,
    isSpicy: false,
    sizes: [
      { id: 'single', label: 'Single Patty', priceDelta: 0 },
      { id: 'double', label: 'Double Veg', priceDelta: 45 },
    ],
    addons: COMMON_BURGER_ADDONS,
    ingredients: [
      'Crispy Garden Veggie & Herb Patty',
      'Fresh Vine-Ripened Tomato & Onion',
      'Crunchy Iceberg Lettuce',
      'Tangy Thousand Island Herb Sauce',
      'Soft Toasted Sesame Bun',
    ],
  },
  {
    id: 'burger-paneer',
    name: 'Paneer Burger',
    category: 'burgers',
    shortDescription:
      'Thick slab of tandoori-spiced crispy cottage cheese, mint-coriander mayo, melted cheddar, red onion & crunchy lettuce.',
    fullDescription:
      'Rich, royal, and indulgent! A thick slab of fresh malai paneer marinated in tandoori spices and seared golden crisp, layered with melted cheese, spiced onion rings, crisp romaine, and zesty pudina-tandoori mayo.',
    price: 159,
    originalPrice: 189,
    image: paneerBurgerImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF3BF 0%, #FCC419 52%, #E67700 100%)',
    dishRotation: 2,
    garnishType: 'paneer',
    isVeg: true,
    badge: 'Royal Paneer',
    calories: '580 kcal',
    prepTime: '11 min',
    rating: 4.9,
    isSpicy: true,
    sizes: [
      { id: 'single', label: 'Single Paneer Slab', priceDelta: 0 },
      { id: 'double', label: 'Double Paneer Royale', priceDelta: 65 },
    ],
    addons: COMMON_BURGER_ADDONS,
    ingredients: [
      'Thick Crispy Spiced Malai Paneer Slab',
      'Tandoori Mint-Coriander Aioli',
      'Melted Cheddar Cheese Slice',
      'Spiced Red Onion Rings & Tomato',
      'Butter-Toasted Brioche Bun',
    ],
  },
];

/* ============================================================================
 * 2. PIZZA MENU PAGE (/pizza) — 6 ITEMS
 * ========================================================================== */
export const PIZZA_COLLECTION: FoodProduct[] = [
  {
    id: 'pizza-margherita',
    name: 'Margherita Pizza',
    category: 'pizza',
    shortDescription:
      'Classic Italian tomato sauce, 100% real stretchy mozzarella cheese, sweet basil leaves & cold-pressed olive oil on a stone-baked crust.',
    fullDescription:
      'Timeless wood-fired perfection. Hand-stretched sourdough crust brushed with rich San Marzano herb tomato sauce, generously blanketed in 100% real fior di latte mozzarella cheese, and finished with fresh sweet basil leaves.',
    price: 199,
    originalPrice: 249,
    image: pizzaImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF4E6 0%, #FF922B 55%, #D9480F 100%)',
    dishRotation: -2,
    garnishType: 'margherita',
    isVeg: true,
    badge: 'Classic Italian',
    calories: '540 kcal',
    prepTime: '12 min',
    rating: 4.8,
    isSpicy: false,
    sizes: COMMON_PIZZA_SIZES,
    addons: COMMON_PIZZA_ADDONS,
    ingredients: [
      'Stone-Baked Sourdough Crust',
      'Vine-Ripened Herb Tomato Sauce',
      '100% Real Stretchy Mozzarella Cheese',
      'Fresh Sweet Genovese Basil',
      'Extra-Virgin Olive Oil Drizzle',
    ],
  },
  {
    id: 'pizza-farmhouse',
    name: 'Farmhouse Pizza',
    category: 'pizza',
    shortDescription:
      'Loaded with crunchy green capsicum, juicy cherry tomatoes, button mushrooms, black olives, red onions & molten mozzarella.',
    fullDescription:
      'A garden feast baked at 900°F! Topped edge-to-edge with crisp green bell peppers, earthy button mushrooms, Kalamata black olives, sweet red onions, golden corn, and overflowing mozzarella cheese.',
    price: 299,
    originalPrice: 349,
    image: pizzaImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #EBFBEE 0%, #51CF66 52%, #2B8A3E 100%)',
    dishRotation: 4,
    garnishType: 'farmhouse',
    isVeg: true,
    badge: 'Veggie Overload',
    calories: '610 kcal',
    prepTime: '14 min',
    rating: 4.9,
    isSpicy: false,
    sizes: COMMON_PIZZA_SIZES,
    addons: COMMON_PIZZA_ADDONS,
    ingredients: [
      'Hand-Stretched Artisan Crust',
      'Crunchy Capsicum & Red Onion Rings',
      'Fresh Button Mushrooms & Black Olives',
      'Juicy Vine Tomatoes & Sweet Corn',
      '100% Real Mozzarella Cheese',
    ],
  },
  {
    id: 'pizza-chicken-tikka',
    name: 'Chicken Tikka Pizza',
    category: 'pizza',
    shortDescription:
      'Clay-oven roasted chicken tikka chunks, tandoori spice glaze, crunchy red onions, green capsicum, mozzarella & fresh coriander.',
    fullDescription:
      'Where traditional North Indian clay-oven flavors meet Italian wood-fired craft! Loaded with smoky chargrilled chicken tikka morsels, spiced red onions, crisp capsicum, melted mozzarella, and a zesty mint chutney drizzle.',
    price: 349,
    originalPrice: 399,
    image: tikkaPizzaImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFE3E3 0%, #FA5252 55%, #C92A2A 100%)',
    dishRotation: -3,
    garnishType: 'tikka',
    isVeg: false,
    badge: 'Desi Bestseller',
    calories: '690 kcal',
    prepTime: '15 min',
    rating: 4.9,
    isSpicy: true,
    sizes: COMMON_PIZZA_SIZES,
    addons: COMMON_PIZZA_ADDONS,
    ingredients: [
      'Tandoor-Roasted Chicken Tikka Chunks',
      'Smoky Makhani & Herb Tomato Base',
      'Crunchy Red Onions & Green Capsicum',
      'Whole-Milk Stretchy Mozzarella',
      'Fresh Coriander & Green Chili Flakes',
    ],
  },
  {
    id: 'pizza-bbq-chicken',
    name: 'BBQ Chicken Pizza',
    category: 'pizza',
    shortDescription:
      'Smoky hickory barbecue chicken strips, caramelized onions, red paprika, golden corn & double mozzarella with BBQ swirl.',
    fullDescription:
      'Sweet, smoky, and savory in every slice. Topped with flame-grilled chicken strips glazed in hickory barbecue sauce, slow-caramelized onions, sweet golden corn, mozzarella & smoked cheddar, and a signature BBQ swirl.',
    price: 329,
    originalPrice: 379,
    image: tikkaPizzaImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFE8CC 0%, #F76707 55%, #9C3605 100%)',
    dishRotation: 5,
    dishFilter: 'saturate(1.12) contrast(1.05)',
    garnishType: 'bbq',
    isVeg: false,
    badge: 'Smoky BBQ',
    calories: '670 kcal',
    prepTime: '15 min',
    rating: 4.8,
    isSpicy: false,
    sizes: COMMON_PIZZA_SIZES,
    addons: COMMON_PIZZA_ADDONS,
    ingredients: [
      'Hickory Smoked BBQ Chicken Strips',
      'Slow-Caramelized Sweet Onions',
      'Mozzarella & Smoked Cheddar Blend',
      'Red Paprika & Sweet Corn',
      'Tangy Molasses BBQ Sauce Swirl',
    ],
  },
  {
    id: 'pizza-paneer-tikka',
    name: 'Paneer Tikka Pizza',
    category: 'pizza',
    shortDescription:
      'Spiced tandoori malai paneer cubes, tri-color bell peppers, red paprika, pickled onions & molten mozzarella cheese.',
    fullDescription:
      'Soft malai paneer cubes marinated in spiced yogurt and roasted in a clay tandoor, arranged generously over our stone-baked pizza crust with crunchy bell peppers, red paprika, onions, and stretchy mozzarella.',
    price: 279,
    originalPrice: 329,
    image: tikkaPizzaImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF9DB 0%, #FCC419 52%, #E67700 100%)',
    dishRotation: -5,
    garnishType: 'paneer',
    isVeg: true,
    badge: 'Royal Veg',
    calories: '640 kcal',
    prepTime: '14 min',
    rating: 4.9,
    isSpicy: true,
    sizes: COMMON_PIZZA_SIZES,
    addons: COMMON_PIZZA_ADDONS,
    ingredients: [
      'Chargrilled Tandoori Paneer Cubes',
      'Red, Yellow & Green Bell Peppers',
      'Spicy Red Paprika & Onion Rings',
      '100% Real Mozzarella Cheese',
      'Tandoori Masala Herb Seasoning',
    ],
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pepperoni Pizza',
    category: 'pizza',
    shortDescription:
      'Crispy cup-and-char chicken pepperoni slices, double fior di latte mozzarella, crushed San Marzano tomatoes & Sicilian oregano.',
    fullDescription:
      'Our ultimate crowd-pleaser! Edge-to-edge gourmet smoked chicken pepperoni slices that crisp and cup in our brick oven, layered over extra melted mozzarella cheese, tangy tomato sauce, and aromatic oregano.',
    price: 399,
    originalPrice: 449,
    image: pizzaImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFD8A8 0%, #E03131 55%, #861414 100%)',
    dishRotation: 2,
    dishFilter: 'saturate(1.15) contrast(1.04)',
    garnishType: 'pepperoni',
    isVeg: false,
    badge: 'Chef Special',
    calories: '730 kcal',
    prepTime: '15 min',
    rating: 4.9,
    isSpicy: true,
    sizes: COMMON_PIZZA_SIZES,
    addons: COMMON_PIZZA_ADDONS,
    ingredients: [
      'Crispy Smoked Pepperoni Slices',
      'Double Layer Stretchy Mozzarella',
      'Crushed San Marzano Tomato Sauce',
      'Sicilian Oregano & Chili Flakes',
      'Blistered Wood-Fired Sourdough Crust',
    ],
  },
];

/* ============================================================================
 * 3. ROLLS & WRAPS MENU PAGE (/rolls) — 6 ITEMS
 * Exact names & prices from prompt:
 * 1. Chicken Shawarma Roll — ₹149
 * 2. Classic Chicken Kathi Roll — ₹159
 * 3. Chicken Tikka Roll — ₹179
 * 4. Chicken Zinger Wrap — ₹169
 * 5. Paneer Tikka Roll — ₹139
 * 6. Veggie Wrap — ₹99
 * ========================================================================== */
export const ROLLS_AND_WRAPS: FoodProduct[] = [
  {
    id: 'wrap-chicken-shawarma',
    name: 'Chicken Shawarma Roll',
    category: 'rolls',
    shortDescription:
      'Rotisserie-roasted Middle Eastern spiced chicken strips, whipped garlic toum, pickled turnips & crisp lettuce in warm flatbread.',
    fullDescription:
      'Authentic, juicy, and irresistibly aromatic! Slow-roasted shawarma chicken carved thin from the vertical spit, wrapped tightly in warm toasted flatbread with fluffy garlic toum, tangy pickled veggies, and crisp romaine.',
    price: 149,
    originalPrice: 179,
    image: shawarmaRollImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #ECFF9E 0%, #A9E34B 55%, #5C940D 100%)',
    dishRotation: -2,
    garnishType: 'shawarma',
    isVeg: false,
    badge: 'Most Ordered',
    calories: '510 kcal',
    prepTime: '9 min',
    rating: 4.9,
    isSpicy: false,
    sizes: [
      { id: 'regular', label: 'Regular Roll', priceDelta: 0 },
      { id: 'jumbo', label: 'Jumbo Shawarma', priceDelta: 50 },
    ],
    addons: COMMON_WRAP_ADDONS,
    ingredients: [
      'Warm Char-Grilled Khubz Flatbread',
      'Spit-Roasted Shawarma Chicken Strips',
      'Signature Whipped Garlic Toum',
      'Pickled Turnips, Gherkins & Lettuce',
      'Smoky Sumac Spice Dust',
    ],
  },
  {
    id: 'wrap-classic-kathi',
    name: 'Classic Chicken Kathi Roll',
    category: 'rolls',
    shortDescription:
      'Flaky golden lachha paratha griddled with spiced bhuna chicken chunks, lime-pickled red onions, green chilies & pudina chutney.',
    fullDescription:
      'Inspired by Kolkata’s legendary kathi roll stalls! A flaky, golden-griddled layered paratha wrapped around tender spiced chicken morsels, crunchy lime-pickled onions, tangy chaat masala, and fresh mint-coriander chutney.',
    price: 159,
    originalPrice: 189,
    image: rollImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF3BF 0%, #FFA94D 52%, #D9480F 100%)',
    dishRotation: 2,
    garnishType: 'classic',
    isVeg: false,
    badge: 'Street Legend',
    calories: '540 kcal',
    prepTime: '10 min',
    rating: 4.9,
    isSpicy: true,
    sizes: [
      { id: 'regular', label: 'Single Roll', priceDelta: 0 },
      { id: 'jumbo', label: 'Double Chicken Roll', priceDelta: 55 },
    ],
    addons: COMMON_WRAP_ADDONS,
    ingredients: [
      'Flaky Golden Lachha Paratha',
      'Spiced Bhuna Chicken Chunks',
      'Lime-Pickled Red Onion Rings',
      'Fresh Mint-Coriander Chutney',
      'House Chaat Masala & Fresh Lime',
    ],
  },
  {
    id: 'wrap-chicken-tikka-roll',
    name: 'Chicken Tikka Roll',
    category: 'rolls',
    shortDescription:
      'Clay-oven smoky chicken tikka morsels, tandoori mayo, crunchy bell peppers, red onions & fresh coriander in a toasted rumali wrap.',
    fullDescription:
      'Juicy boneless chicken marinated in spiced hung curd and chargrilled in a traditional clay tandoor, rolled hot with smoky tandoori mayonnaise, crisp onion rings, and green chutney.',
    price: 179,
    originalPrice: 209,
    image: shawarmaRollImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFD8A8 0%, #F76707 52%, #C92A2A 100%)',
    dishRotation: -3,
    dishFilter: 'saturate(1.12) contrast(1.04)',
    garnishType: 'tikka',
    isVeg: false,
    badge: 'Tandoori Special',
    calories: '570 kcal',
    prepTime: '11 min',
    rating: 4.9,
    isSpicy: true,
    sizes: [
      { id: 'regular', label: 'Regular Roll', priceDelta: 0 },
      { id: 'jumbo', label: 'Jumbo Tikka Roll', priceDelta: 60 },
    ],
    addons: COMMON_WRAP_ADDONS,
    ingredients: [
      'Char-Grilled Paratha / Tortilla Wrap',
      'Tandoor-Roasted Chicken Tikka',
      'Smoky Tandoori Mint Mayo',
      'Crisp Red Onions & Green Capsicum',
      'Roasted Cumin & Chaat Spice',
    ],
  },
  {
    id: 'wrap-chicken-zinger',
    name: 'Chicken Zinger Wrap',
    category: 'rolls',
    shortDescription:
      'Shatteringly crispy fried zinger chicken tenders, melted cheddar, crisp iceberg lettuce, tomatoes & fiery Southwest zinger sauce.',
    fullDescription:
      'Our iconic crunchy wrap! Packed with golden buttermilk-fried zinger chicken strips, crunchy hydroponic lettuce, ripe diced tomatoes, shredded cheddar cheese, and spicy Southwest zinger dressing in a warm grilled tortilla.',
    price: 169,
    originalPrice: 199,
    image: rollImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF3BF 0%, #B8F238 52%, #71C208 100%)',
    dishRotation: 3,
    garnishType: 'zinger',
    isVeg: false,
    badge: 'Extra Crispy',
    calories: '580 kcal',
    prepTime: '10 min',
    rating: 4.9,
    isSpicy: true,
    sizes: [
      { id: 'regular', label: 'Regular Wrap', priceDelta: 0 },
      { id: 'jumbo', label: 'Jumbo Double Zinger', priceDelta: 60 },
    ],
    addons: COMMON_WRAP_ADDONS,
    ingredients: [
      'Toasted Golden Flour Tortilla',
      'Crispy Buttermilk Zinger Tenders',
      'Shredded Sharp Cheddar Cheese',
      'Fresh Romaine & Vine Tomatoes',
      'Fiery Southwest Zinger Sauce',
    ],
  },
  {
    id: 'wrap-paneer-tikka-roll',
    name: 'Paneer Tikka Roll',
    category: 'rolls',
    shortDescription:
      'Charcoal-smoked malai paneer tikka, crunchy spiced onions, bell peppers, chaat masala & fresh mint-coriander chutney.',
    fullDescription:
      'Soft cubes of fresh malai paneer marinated in spiced hung curd and roasted over glowing embers, rolled inside a flaky golden paratha wrap with lime-pickled onions, crunchy capsicum, and zesty pudina chutney.',
    price: 139,
    originalPrice: 169,
    image: shawarmaRollImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF9DB 0%, #FCC419 52%, #E67700 100%)',
    dishRotation: -4,
    garnishType: 'paneer',
    isVeg: true,
    badge: 'Royal Veg Roll',
    calories: '520 kcal',
    prepTime: '10 min',
    rating: 4.8,
    isSpicy: true,
    sizes: [
      { id: 'regular', label: 'Single Roll', priceDelta: 0 },
      { id: 'jumbo', label: 'Double Paneer Roll', priceDelta: 55 },
    ],
    addons: COMMON_WRAP_ADDONS,
    ingredients: [
      'Flaky Golden Griddled Paratha Wrap',
      'Tandoor-Charred Malai Paneer Tikka',
      'Lime-Pickled Onion Rings & Capsicum',
      'Fresh Mint-Coriander Chutney',
      'Tangy House Chaat Masala',
    ],
  },
  {
    id: 'wrap-veggie',
    name: 'Veggie Wrap',
    category: 'rolls',
    shortDescription:
      'Crispy garden herb veggie strips, fresh lettuce, sweet corn, bell peppers, olives & creamy roasted garlic herb dressing.',
    fullDescription:
      'Wholesome, colorful, and packed with crunch! Filled with golden herb-crusted garden veggie fingers, crisp iceberg lettuce, roasted bell peppers, sweet corn, black olives, and our signature cheesy garlic-herb dressing.',
    price: 99,
    originalPrice: 129,
    image: rollImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #D3F9D8 0%, #51CF66 52%, #2B8A3E 100%)',
    dishRotation: 3,
    garnishType: 'veg',
    isVeg: true,
    badge: '100% Garden Fresh',
    calories: '420 kcal',
    prepTime: '8 min',
    rating: 4.7,
    isSpicy: false,
    sizes: [
      { id: 'regular', label: 'Regular Wrap', priceDelta: 0 },
      { id: 'jumbo', label: 'Jumbo Veggie Wrap', priceDelta: 45 },
    ],
    addons: COMMON_WRAP_ADDONS,
    ingredients: [
      'Crispy Garden Veggie & Herb Strips',
      'Hydroponic Lettuce, Corn & Bell Peppers',
      'Sliced Black Olives & Vine Tomatoes',
      'Cheesy Roasted Garlic Herb Dressing',
      'Warm Toasted Tortilla Wrap',
    ],
  },
];

/* ============================================================================
 * 4. DRINKS MENU PAGE (/drinks) — 6 ITEMS
 * Exact names & prices from prompt:
 * 1. Fresh Lime Soda — ₹79
 * 2. Mojito — ₹99
 * 3. Cold Coffee — ₹129
 * 4. Chocolate Milkshake — ₹149
 * 5. Strawberry Milkshake — ₹149
 * 6. Fresh Orange Juice — ₹99
 * ========================================================================== */
export const DRINKS_COLLECTION: FoodProduct[] = [
  {
    id: 'drink-fresh-lime-soda',
    name: 'Fresh Lime Soda',
    category: 'drinks',
    shortDescription:
      'Freshly squeezed Kagzi lime juice, muddled garden mint, a hint of black salt & chilled sparkling club soda over crystal ice.',
    fullDescription:
      'Crisp, zesty, and ultra-refreshing! Prepared fresh to order with hand-pressed lime juice, chilled sparkling soda, crushed ice, fresh mint leaves, and your choice of sweet, salted, or mixed masala seasoning.',
    price: 79,
    originalPrice: 99,
    image: mojitoDrinkImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #EBFBEE 0%, #63E6BE 52%, #0CA678 100%)',
    dishRotation: -2,
    garnishType: 'drink-mint',
    isVeg: true,
    badge: 'Classic Refresher',
    calories: '95 kcal',
    prepTime: '3 min',
    rating: 4.8,
    isSpicy: false,
    sizes: COMMON_DRINK_SIZES,
    ingredients: [
      'Freshly Squeezed Lime Juice',
      'Chilled Sparkling Club Soda',
      'Fresh Garden Mint Leaves',
      'Crystal Ice Cubes & Rock Salt',
    ],
  },
  {
    id: 'drink-virgin-mojito',
    name: 'Mojito',
    category: 'drinks',
    shortDescription:
      'Muddled fresh spearmint leaves, lime wedges, organic cane sugar syrup & fizzy lemon-lime sparkler over crushed ice.',
    fullDescription:
      'Our bestselling craft cooler! Freshly muddled spearmint sprigs and lime wedges layered with crystal crushed ice and topped with sparkling citrus fizz for an instant burst of coolness.',
    price: 99,
    originalPrice: 129,
    image: mojitoDrinkImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #D3F9D8 0%, #38D9A9 52%, #099268 100%)',
    dishRotation: 2,
    garnishType: 'drink-mint',
    isVeg: true,
    badge: 'Bestseller Cooler',
    calories: '120 kcal',
    prepTime: '4 min',
    rating: 4.9,
    isSpicy: false,
    sizes: COMMON_DRINK_SIZES,
    ingredients: [
      'Muddled Fresh Spearmint Leaves',
      'Juicy Green Lime Wedges',
      'Sparkling Citrus Fizz',
      'Crushed Ice & Cane Syrup',
    ],
  },
  {
    id: 'drink-cold-coffee',
    name: 'Cold Coffee',
    category: 'drinks',
    shortDescription:
      'Cafe-style frothy Arabica espresso blended with chilled creamy milk, vanilla ice cream & dark cocoa dust.',
    fullDescription:
      'Rich, frothy, and deeply energizing! Brewed from 100% roasted Arabica coffee beans and blended hard with chilled full-cream milk, a scoop of vanilla bean ice cream, and ribbons of chocolate syrup.',
    price: 129,
    originalPrice: 159,
    image: chocoShakeImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF3BF 0%, #E59947 52%, #7C3F1D 100%)',
    dishRotation: -2,
    garnishType: 'drink-coffee',
    isVeg: true,
    badge: 'Cafe Favourite',
    calories: '290 kcal',
    prepTime: '4 min',
    rating: 4.9,
    isSpicy: false,
    sizes: COMMON_DRINK_SIZES,
    addons: COMMON_DRINK_ADDONS,
    ingredients: [
      '100% Roasted Arabica Espresso Shot',
      'Chilled Creamy Milk',
      'Vanilla Bean Ice Cream Blend',
      'Dark Cocoa & Chocolate Swirl',
    ],
  },
  {
    id: 'drink-chocolate-milkshake',
    name: 'Chocolate Milkshake',
    category: 'drinks',
    shortDescription:
      'Thick hand-spun Belgian dark chocolate gelato shake crowned with whipped chantilly cream, fudge drizzle & choco curls.',
    fullDescription:
      'Pure chocolate indulgence! Spun thick with velvety Belgian chocolate ice cream, 70% dark cocoa fudge ganache, and chilled milk, finished with a tall swirl of whipped cream and crunchy chocolate curls.',
    price: 149,
    originalPrice: 179,
    image: chocoShakeImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFE8CC 0%, #D97706 52%, #5C1D00 100%)',
    dishRotation: 2,
    garnishType: 'drink-choco',
    isVeg: true,
    badge: 'Thick & Rich',
    calories: '460 kcal',
    prepTime: '5 min',
    rating: 4.9,
    isSpicy: false,
    sizes: COMMON_DRINK_SIZES,
    addons: COMMON_DRINK_ADDONS,
    ingredients: [
      'Belgian Dark Chocolate Ice Cream',
      '70% Cocoa Fudge Ganache',
      'Whipped Chantilly Cream',
      'Dark Chocolate Curls',
    ],
  },
  {
    id: 'drink-strawberry-milkshake',
    name: 'Strawberry Milkshake',
    category: 'drinks',
    shortDescription:
      'Creamy Mahabaleshwar strawberry compote blended with strawberry gelato, chilled milk & topped with whipped cream.',
    fullDescription:
      'Sweet, fruity, and velvety smooth! Made with sun-ripened strawberry compote and rich strawberry ice cream spun to perfection, topped with fluffy whipped cream and a fresh strawberry garnish.',
    price: 149,
    originalPrice: 179,
    image: strawberryShakeImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFE3EC 0%, #F783AC 52%, #C2255C 100%)',
    dishRotation: -2,
    garnishType: 'drink-berry',
    isVeg: true,
    badge: 'Berry Bliss',
    calories: '430 kcal',
    prepTime: '5 min',
    rating: 4.8,
    isSpicy: false,
    sizes: COMMON_DRINK_SIZES,
    addons: COMMON_DRINK_ADDONS,
    ingredients: [
      'Ripe Mahabaleshwar Strawberries',
      'Creamy Strawberry Gelato',
      'Chilled Farm Milk',
      'Whipped Cream & Berry Swirl',
    ],
  },
  {
    id: 'drink-fresh-orange-juice',
    name: 'Fresh Orange Juice',
    category: 'drinks',
    shortDescription:
      '100% cold-pressed sweet Valencia oranges with natural juicy pulp, zero added sugar, served chilled with fresh mint.',
    fullDescription:
      'Pure sunshine in a glass! Cold-pressed to order from sweet, sun-ripened oranges with no artificial syrups or preservatives, served cold over ice with a fresh orange wheel and mint sprig.',
    price: 99,
    originalPrice: 129,
    image: orangeJuiceImgUrl,
    isCutout: true,
    stageGradient: 'radial-gradient(circle at 50% 48%, #FFF3BF 0%, #FFA94D 52%, #E8590C 100%)',
    dishRotation: 2,
    garnishType: 'drink-citrus',
    isVeg: true,
    badge: '100% Cold Pressed',
    calories: '110 kcal',
    prepTime: '3 min',
    rating: 4.9,
    isSpicy: false,
    sizes: COMMON_DRINK_SIZES,
    ingredients: [
      '100% Cold-Pressed Sweet Oranges',
      'Natural Citrus Pulp',
      'Fresh Orange Wheel Garnish',
      'Garden Mint Sprig',
    ],
  },
];

export const ALL_PRODUCTS: FoodProduct[] = [
  ...SIGNATURE_BURGERS,
  ...PIZZA_COLLECTION,
  ...ROLLS_AND_WRAPS,
  ...DRINKS_COLLECTION,
];
