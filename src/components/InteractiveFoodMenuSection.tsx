import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Flame, Sparkles, UtensilsCrossed, Pizza, Sandwich } from 'lucide-react';
import {
  SIGNATURE_BURGERS,
  PIZZA_COLLECTION,
  ROLLS_AND_WRAPS,
  ALL_PRODUCTS,
} from '../data/menuData';
import { FoodProduct, ProductSizeOption } from '../types/food';
import { ProductCard } from './ProductCard';
import {
  TransparentFoodImage,
  preloadTransparentFoodImages,
} from './TransparentFoodImage';
import {
  RealisticTomatoSliceSvg,
  RealisticCheddarSliceSvg,
  RealisticOnionRingsSvg,
  RealisticPickleCoinsSvg,
  RealisticLettuceLeafSvg,
  RealisticPepperoniSliceSvg,
  RealisticGrilledChickenStripsSvg,
} from './FloatingIngredients';

// Preload all menu product cutout images immediately for instant, zero-lag category switching
preloadTransparentFoodImages(ALL_PRODUCTS.map((p) => p.image));

export type MainMenuCategory = 'burgers' | 'pizzas' | 'wraps';

interface InteractiveFoodMenuSectionProps {
  activeCategory: MainMenuCategory;
  onCategoryChange: (category: MainMenuCategory) => void;
  onAddToCart: (product: FoodProduct, selectedSize?: ProductSizeOption) => void;
  onViewDetails: (product: FoodProduct, initialSize?: ProductSizeOption) => void;
}

interface CategoryThemeConfig {
  id: MainMenuCategory;
  label: string;
  subtitle: string;
  description: string;
  priceRange: string;
  sectionBg: string;
  sectionGradient: string;
  headerGradient: string;
  primaryAccent: string;
  secondaryAccent: string;
  highlightYellow: string;
  activeTabGradient: string;
  glowColor: string;
  products: FoodProduct[];
  floatingPreviewImage: string;
}

const CATEGORY_THEMES: Record<MainMenuCategory, CategoryThemeConfig> = {
  burgers: {
    id: 'burgers',
    label: 'BURGERS',
    subtitle: 'Warm Orange · Golden Yellow · Flame Red Accents',
    description:
      'Juicy flame-seared chicken, crispy zinger fillets, and royal tandoori paneer burgers stacked inside toasted sesame brioche buns.',
    priceRange: 'From ₹99',
    sectionBg: '#FFF7EB',
    sectionGradient:
      'radial-gradient(circle at 50% 0%, #FFE6A3 0%, #FFF6E6 48%, #FFFDF9 100%)',
    headerGradient:
      'linear-gradient(135deg, #E58619 0%, #F59F00 52%, #EF3E36 100%)',
    primaryAccent: '#E58619',
    secondaryAccent: '#EF3E36',
    highlightYellow: '#FCC419',
    activeTabGradient: 'linear-gradient(135deg, #E58619 0%, #EF3E36 100%)',
    glowColor: 'rgba(229, 134, 25, 0.24)',
    products: SIGNATURE_BURGERS,
    floatingPreviewImage: SIGNATURE_BURGERS[2].image,
  },
  pizzas: {
    id: 'pizzas',
    label: 'PIZZAS',
    subtitle: 'Tomato Red · Golden Yellow · Warm Cream',
    description:
      'Hand-stretched artisan dough baked at 900°F with crushed San Marzano tomatoes, 100% real stretchy mozzarella, and bold Indian & Italian toppings.',
    priceRange: 'From ₹199',
    sectionBg: '#FFF5F0',
    sectionGradient:
      'radial-gradient(circle at 50% 0%, #FFD8C2 0%, #FFF3EA 48%, #FFFDF9 100%)',
    headerGradient:
      'linear-gradient(135deg, #D92B2B 0%, #EC6A1F 52%, #F59F00 100%)',
    primaryAccent: '#E03131',
    secondaryAccent: '#F59F00',
    highlightYellow: '#FCC419',
    activeTabGradient: 'linear-gradient(135deg, #E03131 0%, #F59F00 100%)',
    glowColor: 'rgba(224, 49, 49, 0.22)',
    products: PIZZA_COLLECTION,
    floatingPreviewImage: PIZZA_COLLECTION[2].image,
  },
  wraps: {
    id: 'wraps',
    label: 'ROLLS & WRAPS',
    subtitle: 'Fresh Green · Warm Orange · Rich Cream',
    description:
      'Char-grilled flatbreads and flaky Kolkata parathas rolled tight with spit-roasted shawarma, crispy chicken tenders, paneer tikka, and signature chutneys.',
    priceRange: 'From ₹109',
    sectionBg: '#F4FCE3',
    sectionGradient:
      'radial-gradient(circle at 50% 0%, #E4F8B2 0%, #F4FCE3 48%, #FFFDF9 100%)',
    headerGradient:
      'linear-gradient(135deg, #5C940D 0%, #74B816 52%, #F59F00 100%)',
    primaryAccent: '#5C940D',
    secondaryAccent: '#F76707',
    highlightYellow: '#B8F238',
    activeTabGradient: 'linear-gradient(135deg, #5C940D 0%, #F59F00 100%)',
    glowColor: 'rgba(113, 194, 8, 0.24)',
    products: ROLLS_AND_WRAPS,
    floatingPreviewImage: ROLLS_AND_WRAPS[0].image,
  },
};

export const InteractiveFoodMenuSection: React.FC<InteractiveFoodMenuSectionProps> = ({
  activeCategory,
  onCategoryChange,
  onAddToCart,
  onViewDetails,
}) => {
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'spicy'>('all');
  const shouldReduceMotion = useReducedMotion();

  const currentTheme = CATEGORY_THEMES[activeCategory];

  const handleSelectCategory = (cat: MainMenuCategory) => {
    if (cat === activeCategory && dietFilter === 'all') return;
    setDietFilter('all');
    onCategoryChange(cat);
  };

  const displayedProducts = currentTheme.products.filter((item) => {
    if (dietFilter === 'veg') return item.isVeg === true;
    if (dietFilter === 'non-veg') return item.isVeg === false;
    if (dietFilter === 'spicy') return item.isSpicy === true;
    return true;
  });

  return (
    <section
      id="section-interactive-menu"
      aria-label="Interactive Food Menu"
      className="relative w-full py-12 sm:py-24 px-3.5 sm:px-10 md:px-14 lg:px-20 transition-colors duration-350 overflow-hidden"
      style={{ backgroundColor: currentTheme.sectionBg }}
    >
      {/* Smooth Crossfading Category Background Gradient (340ms cubic-bezier color transition) */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${activeCategory}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: currentTheme.sectionGradient }}
        />
      </AnimatePresence>

      {/* Dynamic Ambient Category Glow Orbs in Background */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full blur-3xl transition-colors duration-350 z-0"
        style={{ background: currentTheme.glowColor }}
      />
      <div
        className="pointer-events-none absolute bottom-12 right-10 w-[440px] h-[440px] rounded-full blur-3xl transition-colors duration-350 z-0"
        style={{ background: currentTheme.glowColor }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ====================================================================
         * TOP HEADER & INTERACTIVE 3-CATEGORY NAVIGATION BAR
         * ================================================================== */}
        <div className="flex flex-col items-center text-center mb-12">
          <motion.span
            key={`kicker-${activeCategory}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="text-xs font-extrabold uppercase tracking-[0.22em] mb-2 transition-colors duration-300"
            style={{ color: currentTheme.primaryAccent }}
          >
            Interactive Signature Menu · Freshly Prepared To Order
          </motion.span>

          <h2 className="font-display-hero text-4xl sm:text-6xl md:text-7xl text-[#141414] tracking-wide leading-[0.95]">
            EXPLORE OUR MENU
          </h2>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-black/65 max-w-xl leading-relaxed">
            Switch between our three signature kitchens below. Every dish is crafted fresh with bold flavors and priced in Indian Rupees (₹).
          </p>

          {/* THREE INTERACTIVE CATEGORY BUTTONS: BURGERS | PIZZAS | ROLLS & WRAPS */}
          <div
            role="tablist"
            aria-label="Food Menu Categories"
            className="mt-6 sm:mt-8 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-black/10 shadow-[0_18px_45px_rgba(0,0,0,0.08)] flex items-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-3 w-full max-w-2xl justify-start sm:justify-center"
          >
            {(
              [
                { id: 'burgers', icon: Sandwich, label: 'BURGERS', sub: '6 Items · ₹99–₹199' },
                { id: 'pizzas', icon: Pizza, label: 'PIZZAS', sub: '6 Items · ₹199–₹399' },
                { id: 'wraps', icon: UtensilsCrossed, label: 'ROLLS & WRAPS', sub: '6 Items · ₹109–₹169' },
              ] as const
            ).map((tab) => {
              const isActive = activeCategory === tab.id;
              const TabIcon = tab.icon;
              const tabTheme = CATEGORY_THEMES[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectCategory(tab.id)}
                  className={`relative shrink-0 flex-1 min-w-[125px] sm:min-w-[145px] py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-xl sm:rounded-2xl text-left transition-all duration-180 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    isActive
                      ? 'text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] scale-[1.02]'
                      : 'text-[#141414] hover:bg-black/[0.04]'
                  }`}
                >
                  {/* Animated Active Category Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryButtonBg"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 z-0 rounded-xl sm:rounded-2xl"
                      style={{ background: tabTheme.activeTabGradient }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-black/[0.05] text-[#141414]'
                        }`}
                      >
                        <TabIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.3]" />
                      </span>
                      <div className="min-w-0">
                        <span className="font-display-hero text-lg sm:text-2xl tracking-wider block leading-none whitespace-nowrap">
                          {tab.label}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold block mt-0.5 sm:mt-1 whitespace-nowrap ${
                            isActive ? 'text-white/90' : 'text-black/50'
                          }`}
                        >
                          {tab.sub}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
         * DYNAMIC CATEGORY SHOWCASE BANNER WITH SIMULTANEOUS FOOD & INGREDIENT ANIMATION
         * ================================================================== */}
        <div className="relative rounded-2xl sm:rounded-[2rem] mb-8 sm:mb-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
          {/* Smoothly Crossfading Banner Gradient */}
          <AnimatePresence initial={false}>
            <motion.div
              key={`banner-bg-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
              style={{ background: currentTheme.headerGradient }}
            />
          </AnimatePresence>

          <div className="relative z-10 p-4 sm:p-8 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            {/* Left Copy */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`banner-copy-${activeCategory}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl space-y-1.5 sm:space-y-2"
              >
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-white/90">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{currentTheme.subtitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentTheme.priceRange}</span>
                </div>
                <h3 className="font-display-hero text-2xl sm:text-4xl lg:text-5xl tracking-wide leading-tight sm:leading-none">
                  {currentTheme.label} COLLECTION (6 ITEMS)
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                  {currentTheme.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Right Quick Dietary Filters + Simultaneous Category Food & Floating Ingredients Stage */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 self-stretch lg:self-center justify-between lg:justify-end w-full lg:w-auto">
              <div className="flex items-center overflow-x-auto no-scrollbar gap-1 bg-black/25 backdrop-blur-md p-1 rounded-xl sm:rounded-2xl border border-white/15 w-full sm:w-auto">
                {(
                  [
                    { id: 'all', label: 'All (6)' },
                    { id: 'veg', label: 'Veg' },
                    { id: 'non-veg', label: 'Non-Veg' },
                    { id: 'spicy', label: 'Spicy' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDietFilter(f.id)}
                    className={`shrink-0 flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold transition-all duration-150 cursor-pointer whitespace-nowrap text-center ${
                      dietFilter === f.id
                        ? 'bg-white text-[#141414] shadow-xs'
                        : 'text-white/85 hover:bg-white/15'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Simultaneous Category Dish + Orbiting Ingredients Preview */}
              <div className="hidden sm:flex relative w-28 h-24 items-center justify-center shrink-0">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`preview-${activeCategory}`}
                    initial={{ opacity: 0, scale: 0.68, rotate: -10, x: 24 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.68, rotate: 10, x: -24 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {/* Simultaneous Floating Mini Ingredients around the Category Dish */}
                    <CategoryBannerOrbitIngredients category={activeCategory} />

                    {/* Center Category Dish */}
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : { y: [0, -5, 0], rotate: [0, 2, 0] }
                      }
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10 w-20 h-20 flex items-center justify-center"
                    >
                      <TransparentFoodImage
                        src={currentTheme.floatingPreviewImage}
                        alt={currentTheme.label}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
         * SMOOTH ANIMATED PRODUCT GRID (6 ITEMS PER CATEGORY, ZERO-WAIT TRANSITION)
         * ================================================================== */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${activeCategory}-${dietFilter}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {displayedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                accentColor={currentTheme.primaryAccent}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Category Switcher Bar for Quick Jumping */}
        <div className="mt-12 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-black/65">
            <Flame
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: currentTheme.primaryAccent }}
            />
            <span>
              Showing {displayedProducts.length} of 6 freshly prepared {currentTheme.label.toLowerCase()} items
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(['burgers', 'pizzas', 'wraps'] as const).map((catId) => {
              const isCurrent = activeCategory === catId;
              const catTheme = CATEGORY_THEMES[catId];
              return (
                <button
                  key={catId}
                  type="button"
                  onClick={() => handleSelectCategory(catId)}
                  style={
                    isCurrent
                      ? { background: catTheme.activeTabGradient }
                      : undefined
                  }
                  className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-180 cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'text-white shadow-sm scale-103'
                      : 'bg-white text-black/70 hover:bg-black/5 border border-black/10'
                  }`}
                >
                  {catTheme.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Simultaneous realistic floating ingredients around the category showcase dish
 * so switching categories animates the dish and its relevant ingredients together at t=0.
 */
const CategoryBannerOrbitIngredients: React.FC<{
  category: MainMenuCategory;
}> = ({ category }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {/* Top-Left Orbiting Ingredient */}
      <motion.div
        initial={{ opacity: 0, x: 18, y: 14, scale: 0.4, rotate: -25 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: -12 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-1 -left-2 w-9 h-9"
      >
        {category === 'burgers' ? (
          <RealisticLettuceLeafSvg />
        ) : category === 'pizzas' ? (
          <RealisticPepperoniSliceSvg />
        ) : (
          <RealisticGrilledChickenStripsSvg />
        )}
      </motion.div>

      {/* Top-Right Orbiting Ingredient */}
      <motion.div
        initial={{ opacity: 0, x: -18, y: 14, scale: 0.4, rotate: 25 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 14 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-1 -right-2 w-9 h-9"
      >
        <RealisticTomatoSliceSvg />
      </motion.div>

      {/* Bottom-Left Orbiting Ingredient */}
      <motion.div
        initial={{ opacity: 0, x: 18, y: -12, scale: 0.4, rotate: 20 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 8 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-1 -left-1 w-8 h-8"
      >
        {category === 'burgers' ? (
          <RealisticPickleCoinsSvg />
        ) : category === 'pizzas' ? (
          <RealisticCheddarSliceSvg />
        ) : (
          <RealisticOnionRingsSvg />
        )}
      </motion.div>

      {/* Bottom-Right Orbiting Ingredient */}
      <motion.div
        initial={{ opacity: 0, x: -18, y: -12, scale: 0.4, rotate: -20 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: -10 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-1 -right-1 w-8 h-8"
      >
        {category === 'burgers' ? (
          <RealisticCheddarSliceSvg />
        ) : (
          <RealisticOnionRingsSvg />
        )}
      </motion.div>
    </div>
  );
};
