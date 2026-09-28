/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderDrawer } from './components/OrderDrawer';
import {
  CategoriesSection,
  PromoBannerSection,
  Footer,
} from './components/PageSections';
import {
  SIGNATURE_BURGERS,
  PIZZA_COLLECTION,
  ROLLS_AND_WRAPS,
  VALID_PROMO_CODES,
} from './data/menuData';
import {
  CartItem,
  FoodCategoryId,
  FoodProduct,
  ProductAddonOption,
  ProductSizeOption,
  PromoCodeDefinition,
} from './types/food';
import { SlideId } from './components/FloatingIngredients';
import { BackendProvider, useBackend } from './context/BackendContext';
import { AdminDashboard } from './components/admin/AdminDashboard';

function isPathnameAdmin(pathname: string): boolean {
  const clean = pathname.toLowerCase().replace(/\/+$/, '');
  return clean === '/admin' || clean.startsWith('/admin/');
}

function ZaidBitesAppContent() {
  const { products } = useBackend();

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() =>
    typeof window !== 'undefined' ? isPathnameAdmin(window.location.pathname) : false
  );

  // Selected category on the homepage: null by default so all product lists stay hidden on initial load
  const [selectedCategory, setSelectedCategory] = useState<FoodCategoryId | null>(null);

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync browser back/forward navigation for Admin route vs Homepage
  useEffect(() => {
    const onPopState = () => {
      setIsAdminRoute(isPathnameAdmin(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 1900);
  }, []);

  // Select a category on the SAME homepage without changing the URL or navigating away
  const handleSelectCategory = useCallback((categoryId: FoodCategoryId) => {
    setIsAdminRoute(false);
    setSelectedCategory(categoryId);

    // Smoothly bring the expanded product list below the category section into view
    requestAnimationFrame(() => {
      setTimeout(() => {
        const productsContainer = document.getElementById('homepage-category-products');
        if (productsContainer) {
          productsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 60);
    });
  }, []);

  const handleCloseCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const navigateToHome = useCallback(() => {
    if (isAdminRoute) {
      try {
        window.history.pushState({}, '', '/');
      } catch {
        // Ignore history errors in restricted iframe contexts
      }
    }
    setIsAdminRoute(false);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAdminRoute]);

  const navigateToAdmin = useCallback(() => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // Ignore history errors in restricted iframe contexts
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCartWithOptions = useCallback(
    (
      product: FoodProduct,
      quantity: number = 1,
      selectedSize?: ProductSizeOption,
      selectedAddons: ProductAddonOption[] = []
    ) => {
      if (
        product.isAvailable === false ||
        (product.stockQuantity !== undefined && product.stockQuantity <= 0)
      ) {
        triggerToast(`${product.name} is currently out of stock`);
        return;
      }

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
      const fallbackProduct =
        slideId === 'burger'
          ? SIGNATURE_BURGERS[2] // Chicken Zinger Burger
          : slideId === 'roll'
          ? ROLLS_AND_WRAPS[0] // Chicken Shawarma Roll
          : PIZZA_COLLECTION[2]; // Chicken Tikka Pizza
      const liveProduct =
        products.find((p) => p.id === fallbackProduct.id) || fallbackProduct;
      handleAddToCartWithOptions(liveProduct, 1);
      setDrawerOpen(true);
    },
    [products, handleAddToCartWithOptions]
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

  // Render Protected Admin Dashboard if on /admin or /admin/login
  if (isAdminRoute) {
    return <AdminDashboard onNavigateHome={navigateToHome} />;
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#FFFDF9] text-[#141414]">
      {/* Unified Sticky Navigation Bar */}
      <Navbar
        activeCategoryPage={null}
        scrollActiveCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onNavigateHome={navigateToHome}
        onNavigateAdmin={navigateToAdmin}
        cartCount={totalCartCount}
        onOpenCart={() => setDrawerOpen(true)}
      />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#141414] text-white text-xs sm:text-sm font-semibold shadow-xl border border-white/15 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#82C91E]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
       * HOMEPAGE VIEW (Hero + Click-to-Expand Category System + Promos + Footer)
       * ================================================================== */}
      <HeroSection
        cartCount={totalCartCount}
        onOpenCart={() => setDrawerOpen(true)}
        onOrderSlide={handleOrderHeroSlide}
      />

      <CategoriesSection
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onCloseCategory={handleCloseCategory}
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
        onSelectCategoryId={handleSelectCategory}
        onNavigateAdmin={navigateToAdmin}
      />

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

export default function App() {
  return (
    <BackendProvider>
      <ZaidBitesAppContent />
    </BackendProvider>
  );
}
