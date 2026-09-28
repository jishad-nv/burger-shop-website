/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { BrandMascotLogo } from './components/Navbar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderDrawer } from './components/OrderDrawer';
import {
  CategoriesSection,
  PromoBannerSection,
  CategoryProductPage,
  Footer,
} from './components/PageSections';
import {
  FOOD_CATEGORIES,
  SIGNATURE_BURGERS,
  PIZZA_COLLECTION,
  ROLLS_AND_WRAPS,
  VALID_PROMO_CODES,
} from './data/menuData';
import {
  CartItem,
  CategoryCardItem,
  FoodCategoryId,
  FoodProduct,
  ProductAddonOption,
  ProductSizeOption,
  PromoCodeDefinition,
} from './types/food';
import { SlideId } from './components/FloatingIngredients';

function parseCategoryFromPathname(pathname: string): FoodCategoryId | null {
  const clean = pathname.toLowerCase().replace(/\/+$/, '');
  if (clean === '/burgers') return 'burgers';
  if (clean === '/pizza' || clean === '/pizzas') return 'pizza';
  if (clean === '/rolls' || clean === '/wraps') return 'rolls';
  if (clean === '/drinks') return 'drinks';
  return null;
}

export default function App() {
  // Active route state: null = Homepage ('/'), or one of 'burgers' | 'pizza' | 'rolls' | 'drinks'
  const [activeCategoryPage, setActiveCategoryPage] = useState<FoodCategoryId | null>(() =>
    typeof window !== 'undefined' ? parseCategoryFromPathname(window.location.pathname) : null
  );

  // Initial cart seeded with signature items
  const [cart, setCart] = useState<CartItem[]>(() => [
    {
      cartItemId: `${SIGNATURE_BURGERS[2].id}-single-`,
      product: SIGNATURE_BURGERS[2], // Chicken Zinger Burger — ₹199
      quantity: 1,
      selectedSize: SIGNATURE_BURGERS[2].sizes?.[0],
      selectedAddons: [],
      unitPrice: SIGNATURE_BURGERS[2].price,
    },
    {
      cartItemId: `${ROLLS_AND_WRAPS[0].id}-regular-`,
      product: ROLLS_AND_WRAPS[0], // Chicken Shawarma Roll — ₹149
      quantity: 1,
      selectedSize: ROLLS_AND_WRAPS[0].sizes?.[0],
      selectedAddons: [],
      unitPrice: ROLLS_AND_WRAPS[0].price,
    },
  ]);

  const [appliedPromo, setAppliedPromo] = useState<PromoCodeDefinition | null>(
    VALID_PROMO_CODES.WELCOME10
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    product: FoodProduct | null;
    initialSize?: ProductSizeOption;
  }>({ product: null });
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setActiveCategoryPage(parseCategoryFromPathname(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Show floating sticky navigation/cart bar on homepage once user scrolls past 75% of hero
  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 1900);
  }, []);

  const navigateToCategoryPage = useCallback((categoryId: FoodCategoryId) => {
    const catObj = FOOD_CATEGORIES.find((c) => c.id === categoryId);
    const targetPath = catObj ? catObj.path : `/${categoryId}`;
    try {
      window.history.pushState({}, '', targetPath);
    } catch {
      // Ignore history errors in restricted iframe contexts
    }
    setActiveCategoryPage(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToHome = useCallback(() => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // Ignore history errors in restricted iframe contexts
    }
    setActiveCategoryPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectCategoryCard = useCallback(
    (cat: CategoryCardItem) => {
      navigateToCategoryPage(cat.id);
    },
    [navigateToCategoryPage]
  );

  const handleAddToCartWithOptions = useCallback(
    (
      product: FoodProduct,
      quantity: number = 1,
      selectedSize?: ProductSizeOption,
      selectedAddons: ProductAddonOption[] = []
    ) => {
      const resolvedSize =
        selectedSize ||
        (product.sizes && product.sizes.length > 0
          ? product.sizes.find((s) => s.priceDelta === 0) || product.sizes[0]
          : undefined);

      const addonKey = selectedAddons
        .map((a) => a.id)
        .sort()
        .join('+');
      const cartItemId = `${product.id}-${resolvedSize?.id || 'std'}-${addonKey}`;

      const sizeDelta = resolvedSize ? resolvedSize.priceDelta : 0;
      const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = product.price + sizeDelta + addonsTotal;

      setCart((prev) => {
        const existing = prev.find((item) => item.cartItemId === cartItemId);
        if (existing) {
          return prev.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            cartItemId,
            product,
            quantity,
            selectedSize: resolvedSize,
            selectedAddons,
            unitPrice,
          },
        ];
      });

      triggerToast(`Added ${quantity}x ${product.name} (₹${unitPrice * quantity}) to cart`);
    },
    [triggerToast]
  );

  const handleQuickAddToCart = useCallback(
    (product: FoodProduct, selectedSize?: ProductSizeOption) => {
      handleAddToCartWithOptions(product, 1, selectedSize, []);
    },
    [handleAddToCartWithOptions]
  );

  const handleOrderHeroSlide = useCallback(
    (slideId: SlideId) => {
      const targetProduct =
        slideId === 'burger'
          ? SIGNATURE_BURGERS[2] // Chicken Zinger Burger
          : slideId === 'roll'
          ? ROLLS_AND_WRAPS[0] // Chicken Shawarma Roll
          : PIZZA_COLLECTION[2]; // Chicken Tikka Pizza
      handleAddToCartWithOptions(targetProduct, 1);
      setDrawerOpen(true);
    },
    [handleAddToCartWithOptions]
  );

  const handleApplyPromoBanner = useCallback(
    (promo: PromoCodeDefinition) => {
      setAppliedPromo(promo);
      triggerToast(`Promo code ${promo.code} (${promo.description}) applied!`);
      setDrawerOpen(true);
    },
    [triggerToast]
  );

  const handleUpdateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#FFFDF9] text-[#141414]">
      {/* Floating Sticky Navigation & Cart Bar on Homepage when scrolled past Hero */}
      <AnimatePresence>
        {activeCategoryPage === null && showStickyBar && (
          <motion.div
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-3 inset-x-0 z-40 px-4 sm:px-8 pointer-events-none flex justify-center"
          >
            <div className="pointer-events-auto bg-[#141414]/92 backdrop-blur-md text-white px-4 sm:px-6 py-2.5 rounded-full shadow-[0_14px_38px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={navigateToHome}
                className="flex items-center gap-2 cursor-pointer"
              >
                <BrandMascotLogo className="w-7 h-7 text-white" accentColor="#F59F00" />
                <span className="font-display-hero text-lg tracking-wider hidden sm:inline">
                  ZAIDBITES
                </span>
              </button>

              <nav className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => navigateToCategoryPage(cat.id)}
                    className="text-white/80 hover:text-[#FCC419] transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={`Open shopping cart with ${totalCartCount} items`}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EF3E36] hover:bg-[#DC2626] text-white text-xs font-extrabold transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="tabular-nums">{totalCartCount}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#141414] text-white text-xs font-bold shadow-xl border border-white/15 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#82C91E]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCategoryPage === null ? (
        /* ==================================================================
         * HOMEPAGE VIEW ('/')
         * Contains ONLY:
         * 1. Existing Hero Section (unchanged with simultaneous animations)
         * 2. Four Food Category Cards (BURGERS, PIZZA, ROLLS & WRAPS, DRINKS)
         * 3. Optional Promo Code Section
         * 4. Footer
         * ================================================================ */
        <>
          <HeroSection
            cartCount={totalCartCount}
            onOpenCart={() => setDrawerOpen(true)}
            onOrderSlide={handleOrderHeroSlide}
          />

          <CategoriesSection onSelectCategory={handleSelectCategoryCard} />

          <PromoBannerSection
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromoBanner}
          />

          <Footer
            onNavigateHome={navigateToHome}
            onSelectCategoryId={navigateToCategoryPage}
          />
        </>
      ) : (
        /* ==================================================================
         * CATEGORY-SPECIFIC PRODUCT LISTING PAGE
         * ('/burgers', '/pizza', '/rolls', '/drinks')
         * ================================================================ */
        <>
          <CategoryProductPage
            categoryId={activeCategoryPage}
            cartCount={totalCartCount}
            onNavigateHome={navigateToHome}
            onSelectCategoryId={navigateToCategoryPage}
            onOpenCart={() => setDrawerOpen(true)}
            onAddToCart={handleQuickAddToCart}
            onViewDetails={(product, size) =>
              setModalState({ product, initialSize: size })
            }
          />

          <PromoBannerSection
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromoBanner}
          />

          <Footer
            onNavigateHome={navigateToHome}
            onSelectCategoryId={navigateToCategoryPage}
          />
        </>
      )}

      {/* ====================================================================
       * PRODUCT DETAILS MODAL
       * ================================================================== */}
      <ProductDetailModal
        product={modalState.product}
        initialSize={modalState.initialSize}
        onClose={() => setModalState({ product: null })}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* ====================================================================
       * SHOPPING CART & CHECKOUT DRAWER (with Promo Code Discount System)
       * ================================================================== */}
      <OrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        appliedPromo={appliedPromo}
        onApplyPromo={setAppliedPromo}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
