import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Tag,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  FOOD_CATEGORIES,
  SIGNATURE_BURGERS,
  PIZZA_COLLECTION,
  ROLLS_AND_WRAPS,
  DRINKS_COLLECTION,
  VALID_PROMO_CODES,
} from '../data/menuData';
import {
  CategoryCardItem,
  FoodCategoryId,
  FoodProduct,
  ProductSizeOption,
  PromoCodeDefinition,
} from '../types/food';
import { TransparentFoodImage } from './TransparentFoodImage';
import { ProductCard } from './ProductCard';
import { BrandMascotLogo } from './Navbar';
import { useBackend } from '../context/BackendContext';

/* ============================================================================
 * 1. HOMEPAGE FOOD CATEGORIES SECTION (Click-to-Expand Category System)
 *    1. Burgers
 *    2. Pizza
 *    3. Rolls & Wraps
 *    4. Drinks
 *    - Hidden products by default on initial homepage load.
 *    - Clicking a category expands and displays its 6 products right below
 *      the category cards on the SAME PAGE with a smooth, fast transition.
 * ========================================================================== */
interface CategoriesSectionProps {
  selectedCategory: FoodCategoryId | null;
  onSelectCategory: (categoryId: FoodCategoryId) => void;
  onCloseCategory?: () => void;
  onAddToCart: (product: FoodProduct, size?: ProductSizeOption) => void;
  onViewDetails: (product: FoodProduct, size?: ProductSizeOption) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onCloseCategory,
  onAddToCart,
  onViewDetails,
}) => {
  const { categories, products } = useBackend();

  // Resolve the 6 products for the currently selected category from the backend
  const selectedCategoryMeta = selectedCategory
    ? CATEGORY_PAGE_METADATA[selectedCategory]
    : null;
  const selectedCategoryCard = selectedCategory
    ? categories.find((c) => c.id === selectedCategory) ||
      FOOD_CATEGORIES.find((c) => c.id === selectedCategory) ||
      null
    : null;

  const selectedCategoryProducts: FoodProduct[] = React.useMemo(() => {
    if (!selectedCategory) return [];
    const backendMatches = products.filter((p) => p.category === selectedCategory);
    if (backendMatches.length >= 6) {
      return backendMatches.slice(0, 6);
    }
    // Ensure 6 items if fewer exist in backend collection by supplementing from category catalog
    const fallbackPool = CATEGORY_PAGE_METADATA[selectedCategory]?.products || [];
    const existingIds = new Set(backendMatches.map((p) => p.id));
    const combined = [
      ...backendMatches,
      ...fallbackPool.filter((p) => !existingIds.has(p.id)),
    ];
    return combined.slice(0, 6);
  }, [selectedCategory, products]);

  return (
    <section
      id="section-categories"
      aria-label="Food Categories"
      className="relative w-full py-20 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-20 bg-[#FFFDF9]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block text-xs sm:text-[13px] font-semibold tracking-wide text-[#D8740A] mb-1.5">
              Explore Our Menu
            </span>
            <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#141414] tracking-tight leading-[1.2]">
              Choose a Category
            </h2>
          </div>
          <p className="text-sm sm:text-[15px] text-black/70 max-w-md leading-[1.6]">
            Select any category below to view its freshly prepared menu items right here and add your favorites to the cart.
          </p>
        </motion.div>

        {/* Responsive 4-Card Grid: 2 columns on mobile, 4 columns in a row on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-7">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const isAnotherSelected =
              selectedCategory !== null && selectedCategory !== cat.id;

            return (
              <motion.button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                data-category-section={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.34,
                  delay: idx * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative rounded-[2rem] p-5 sm:p-7 text-left overflow-hidden flex flex-col justify-between min-h-[270px] sm:min-h-[340px] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isSelected
                    ? 'ring-4 ring-[#141414] ring-offset-4 ring-offset-[#FFFDF9] shadow-[0_24px_52px_rgba(0,0,0,0.22)] -translate-y-1.5'
                    : isAnotherSelected
                    ? 'opacity-80 hover:opacity-100 shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.16)]'
                    : 'shadow-[0_14px_34px_rgba(0,0,0,0.09)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.18)]'
                }`}
                style={{ background: cat.accentGradient }}
              >
                {/* Soft Ambient Stage Glow */}
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/35 blur-2xl transition-transform duration-200 group-hover:scale-120" />

                {/* Top Row: Item Count & Clickable Arrow Indicator */}
                <div className="relative z-20 flex items-center justify-between w-full gap-2">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-normal text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)] whitespace-nowrap">
                    {cat.itemCount}
                  </span>
                  <span
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md shrink-0 ${
                      isSelected
                        ? 'bg-[#141414] text-white rotate-135 scale-110'
                        : 'bg-white text-[#141414] group-hover:rotate-45 group-hover:scale-110'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </span>
                </div>

                {/* Center High-Quality Realistic Food Cutout Image */}
                <div className="relative z-10 my-2 sm:my-4 h-32 sm:h-44 w-full flex flex-col items-center justify-center">
                  <div
                    className={`w-32 h-32 sm:w-44 sm:h-44 transition-transform duration-200 ease-out flex items-center justify-center ${
                      isSelected
                        ? 'scale-110 -translate-y-1.5 -rotate-3'
                        : 'group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:-rotate-3'
                    }`}
                  >
                    <TransparentFoodImage
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-24 sm:w-32 h-3.5 rounded-full bg-black/30 blur-md -mt-2 transition-all duration-200 group-hover:w-20 group-hover:opacity-50" />
                </div>

                {/* Bottom Category Name, Tagline & Clear Clickable Action */}
                <div className="relative z-20 pt-2.5 border-t border-white/20 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.22)] leading-[1.2]">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-white/95 line-clamp-2 mt-1 leading-[1.45]">
                      {cat.tagline}
                    </p>
                  </div>
                  <span
                    className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold tracking-normal px-3 py-1.5 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#141414] text-white shadow-sm'
                        : 'text-white bg-black/25 backdrop-blur-xs group-hover:bg-black/45'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Selected</span>
                      </>
                    ) : (
                      'View Menu'
                    )}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ====================================================================
         * CLICK-TO-EXPAND PRODUCT DISPLAY AREA (Below Category Selection)
         * - Hidden by default when homepage first loads (selectedCategory === null).
         * - Displays ONLY the currently selected category's 6 products.
         * - Smooth, fast transition when switching between categories.
         * ================================================================== */}
        <div id="homepage-category-products" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {selectedCategory && selectedCategoryMeta && selectedCategoryCard && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-black/10"
              >
                {/* Selected Category Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold tracking-wide mb-1.5">
                      <span style={{ color: selectedCategoryMeta.accentColor }}>
                        {selectedCategoryCard.name} Collection
                      </span>
                      <span aria-hidden="true" className="text-black/35">
                        ·
                      </span>
                      <span className="text-black/65 tabular-nums">
                        Showing {selectedCategoryProducts.length} items in {selectedCategoryCard.name}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#141414] tracking-tight leading-[1.2]">
                      {selectedCategoryMeta.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-black/65 mt-1.5 max-w-2xl leading-[1.6]">
                      {selectedCategoryMeta.subtitle}
                    </p>
                  </div>

                  {onCloseCategory && (
                    <button
                      type="button"
                      onClick={onCloseCategory}
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/15 hover:border-black text-xs sm:text-[13px] font-semibold text-[#141414] hover:bg-black/[0.04] transition-colors duration-150 cursor-pointer whitespace-nowrap"
                    >
                      <span>Hide Menu</span>
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 6-Product Grid for the Selected Category */}
                <div
                  aria-label={`${selectedCategoryMeta.title} Products`}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  {selectedCategoryProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      accentColor={selectedCategoryMeta.accentColor}
                      onAddToCart={onAddToCart}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
 * 2. OPTIONAL PROMO CODE SECTION (Clean & Interactive)
 *    Supports WELCOME10 (10% OFF), SAVE20 (20% OFF), FLAT50 (₹50 OFF)
 * ========================================================================== */
interface PromoBannerSectionProps {
  appliedPromo: PromoCodeDefinition | null;
  onApplyPromo: (promo: PromoCodeDefinition) => void;
}

export const PromoBannerSection: React.FC<PromoBannerSectionProps> = ({
  appliedPromo,
  onApplyPromo,
}) => {
  const { activePromoCodesMap } = useBackend();
  const promoList = Object.values(activePromoCodesMap);

  return (
    <section
      id="section-promos"
      aria-label="Promo Codes and Discounts"
      className="relative w-full py-14 sm:py-16 px-6 sm:px-10 md:px-14 lg:px-20 bg-[#141414] text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-wide text-[#FCC419] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Cart Savings
            </span>
            <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-white tracking-tight leading-[1.2]">
              Use a Promo Code at Checkout
            </h2>
            <p className="text-sm sm:text-[15px] text-white/75 mt-2.5 leading-[1.6]">
              Click any promo code below to automatically apply the discount to your shopping cart, or type it directly inside the cart drawer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            {promoList.map((promo) => {
              const isApplied = appliedPromo?.code === promo.code;
              return (
                <button
                  key={promo.code}
                  type="button"
                  onClick={() => onApplyPromo(promo)}
                  className={`group relative rounded-2xl p-5 text-left border transition-all duration-180 cursor-pointer flex flex-col justify-between min-h-[128px] ${
                    isApplied
                      ? 'bg-[#82C91E]/15 border-[#82C91E] shadow-[0_10px_28px_rgba(130,201,30,0.2)]'
                      : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/15 hover:border-[#FCC419]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FCC419] text-black text-xs font-bold tracking-wide">
                      <Tag className="w-3 h-3 stroke-[2.5]" />
                      {promo.code}
                    </span>
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        isApplied ? 'text-[#82C91E]' : 'text-white/70 group-hover:text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          Applied
                        </>
                      ) : (
                        'Tap to Apply'
                      )}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-base sm:text-lg font-bold text-white leading-snug">
                      {promo.type === 'percent'
                        ? `Flat ${promo.value}% Off`
                        : `Flat ₹${promo.value} Off`}
                    </p>
                    <p className="text-xs sm:text-[13px] text-white/70 mt-1 leading-normal">{promo.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
 * 3. DEDICATED CATEGORY-SPECIFIC PRODUCT LISTING PAGE
 *    Routes: /burgers, /pizza, /rolls, /drinks
 * ========================================================================== */
interface CategoryProductPageProps {
  categoryId: FoodCategoryId;
  cartCount: number;
  onNavigateHome: () => void;
  onSelectCategoryId: (id: FoodCategoryId) => void;
  onOpenCart: () => void;
  onAddToCart: (product: FoodProduct, size?: ProductSizeOption) => void;
  onViewDetails: (product: FoodProduct, size?: ProductSizeOption) => void;
}

const CATEGORY_PAGE_METADATA: Record<
  FoodCategoryId,
  {
    title: string;
    routeLabel: string;
    subtitle: string;
    description: string;
    accentColor: string;
    bgTint: string;
    bannerGradient: string;
    products: FoodProduct[];
  }
> = {
  burgers: {
    title: 'Burger Menu',
    routeLabel: '/burgers',
    subtitle: 'Flame-Seared Chicken, Crispy Zinger & Royal Paneer Burgers',
    description:
      'Every burger is stacked fresh to order inside a butter-toasted sesame brioche bun with crisp farm lettuce, vine tomatoes, and signature house sauces.',
    accentColor: '#E58619',
    bgTint: '#FFF9F0',
    bannerGradient:
      'linear-gradient(125deg, #E58619 0%, #D9480F 55%, #A61E1E 100%)',
    products: SIGNATURE_BURGERS,
  },
  pizza: {
    title: 'Pizza Menu',
    routeLabel: '/pizza',
    subtitle: 'Stone-Baked Hand-Stretched Crust & 100% Real Mozzarella',
    description:
      'Baked at 900°F in our stone deck oven with rich San Marzano herb tomato sauce, stretchy mozzarella cheese, and bold toppings in Regular, Medium, and Large sizes.',
    accentColor: '#E03131',
    bgTint: '#FFF8F6',
    bannerGradient:
      'linear-gradient(125deg, #E03131 0%, #D9480F 55%, #F59F00 100%)',
    products: PIZZA_COLLECTION,
  },
  rolls: {
    title: 'Rolls & Wraps Menu',
    routeLabel: '/rolls',
    subtitle: 'Spit-Roasted Shawarma, Flaky Kathi Rolls & Crispy Zinger Wraps',
    description:
      'Warm char-grilled flatbreads and flaky golden lachha parathas loaded with smoky fillings, whipped garlic toum, and zesty mint-coriander chutney.',
    accentColor: '#5C940D',
    bgTint: '#F6FCEB',
    bannerGradient:
      'linear-gradient(125deg, #5C940D 0%, #71C208 55%, #E58619 100%)',
    products: ROLLS_AND_WRAPS,
  },
  drinks: {
    title: 'Drinks Menu',
    routeLabel: '/drinks',
    subtitle: 'Sparkling Mojitos, Cold-Pressed Juices & Thick Gelato Shakes',
    description:
      'Chilled craft beverages, freshly muddled mint coolers, frothy Arabica cold coffee, and rich Belgian chocolate & berry milkshakes.',
    accentColor: '#0CA678',
    bgTint: '#F2FBF8',
    bannerGradient:
      'linear-gradient(125deg, #0CA678 0%, #099268 55%, #1098AD 100%)',
    products: DRINKS_COLLECTION,
  },
};

export const CategoryProductPage: React.FC<CategoryProductPageProps> = ({
  categoryId,
  onAddToCart,
  onViewDetails,
}) => {
  const { products, allCategoriesForAdmin } = useBackend();
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  useEffect(() => {
    setDietFilter('all');
  }, [categoryId]);

  const meta = CATEGORY_PAGE_METADATA[categoryId];
  const categoryCard =
    allCategoriesForAdmin.find((c) => c.id === categoryId) ||
    FOOD_CATEGORIES.find((c) => c.id === categoryId) ||
    FOOD_CATEGORIES[0];

  const categoryProducts = products.filter((p) => p.category === categoryId);

  const filteredProducts = categoryProducts.filter((item) => {
    if (dietFilter === 'veg') return item.isVeg === true;
    if (dietFilter === 'non-veg') return item.isVeg === false;
    return true;
  });

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: meta.bgTint }}
    >
      {/* Reserved top space for the main sticky Navigation Bar so content is never overlapped */}
      <div className="h-[96px] md:h-[76px] shrink-0" aria-hidden="true" />

      {/* Category Hero Banner */}
      <section className="px-6 sm:px-10 md:px-14 lg:px-20 pt-8 sm:pt-12 pb-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[2rem] p-6 sm:p-10 md:p-12 text-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.14)] flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: meta.bannerGradient }}
            >
              <div className="max-w-xl z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold tracking-wide text-white/90 mb-2">
                  <span>ZaidBites Menu</span>
                  <span aria-hidden="true">·</span>
                  <span>{categoryProducts.length} Items Available</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.15]">
                  {categoryCard.name} Menu
                </h1>
                <p className="text-base sm:text-lg font-semibold text-white/95 mt-2.5 leading-snug">
                  {meta.subtitle}
                </p>
                <p className="text-sm sm:text-[15px] text-white/90 mt-2 leading-[1.6]">
                  {meta.description}
                </p>
              </div>

              <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/25 blur-2xl" />
                <TransparentFoodImage
                  src={categoryCard.image}
                  alt={meta.title}
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Filter Bar: Showing item count + All / Veg / Non-Veg Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm sm:text-[15px] font-medium text-black/70">
              Showing <span className="font-semibold text-[#141414] tabular-nums">{filteredProducts.length}</span> items in{' '}
              <span className="font-semibold text-[#141414]">{categoryCard.name}</span>
            </p>

            {categoryId !== 'drinks' && (
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.06] self-start sm:self-auto">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'veg', label: 'Pure Veg' },
                  { id: 'non-veg', label: 'Non-Veg' },
                ].map((tab) => {
                  const active = dietFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDietFilter(tab.id as 'all' | 'veg' | 'non-veg')}
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#141414] text-white shadow-xs'
                          : 'text-black/65 hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Cards Grid (6 items per category) */}
      <section
        aria-label={`${meta.title} Products`}
        className="px-6 sm:px-10 md:px-14 lg:px-20 pt-2 pb-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                accentColor={meta.accentColor}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
 * 4. CLEAN MODERN FOOTER
 * ========================================================================== */
interface FooterProps {
  onNavigateHome: () => void;
  onSelectCategoryId: (id: FoodCategoryId) => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onSelectCategoryId,
  onNavigateAdmin,
}) => {
  const { categories } = useBackend();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="section-footer"
      className="relative w-full bg-[#0E0E0E] text-white pt-16 sm:pt-20 pb-10 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-3 text-left cursor-pointer"
            >
              <BrandMascotLogo className="w-11 h-11 text-white" accentColor="#F59F00" />
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-white block leading-tight">
                  ZaidBites
                </span>
                <span className="text-xs font-semibold tracking-wide text-[#FCC419] block mt-0.5">
                  Burgers · Pizza · Rolls · Drinks
                </span>
              </div>
            </button>
            <p className="text-sm text-white/70 max-w-sm leading-[1.6]">
              Freshly prepared flame-seared burgers, stone-baked pizzas, chargrilled shawarma &amp; kathi rolls, and chilled craft beverages delivered hot to your doorstep.
            </p>
          </div>

          {/* Column 2: 4 Main Food Categories Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold tracking-normal text-[#FCC419]">
              Food Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="hover:text-[#FCC419] transition-colors duration-150 cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategoryId(cat.id)}
                    className="hover:text-[#FCC419] transition-colors duration-150 cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Kitchen Hours */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold tracking-normal text-[#FCC419]">
              Kitchen Hours
            </h4>
            <div className="space-y-2.5 text-sm text-white/75">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F59F00] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Mon – Thu</p>
                  <p className="text-white/65">11:00 AM – 11:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#89D716] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Fri – Sun</p>
                  <p className="text-white/65">11:00 AM – 2:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold tracking-normal text-[#FCC419]">
              Contact &amp; Flagship Kitchen
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EF3E36] shrink-0 mt-0.5" />
                <span>742 Culinary Avenue, Gourmet District</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F59F00] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#89D716] shrink-0" />
                <span>orders@zaidbites.kitchen</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-[13px] text-white/55">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} ZaidBites Kitchen. All rights reserved.</p>
            {onNavigateAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/65 hover:text-[#FCC419] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59F00]" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-[13px] font-semibold transition-colors duration-150 cursor-pointer"
          >
            <span>Back to Top</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
