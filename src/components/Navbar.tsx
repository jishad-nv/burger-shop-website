import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { FOOD_CATEGORIES } from '../data/menuData';
import { FoodCategoryId } from '../types/food';
import { useBackend } from '../context/BackendContext';

export interface NavbarProps {
  /** Active category page route ('burgers' | 'pizza' | 'rolls' | 'drinks' | null on homepage) */
  activeCategoryPage: FoodCategoryId | null;
  /** Category currently in view when scrolling on the homepage */
  scrollActiveCategory?: FoodCategoryId | null;
  /** Navigate directly to a category page/section */
  onSelectCategory: (categoryId: FoodCategoryId) => void;
  /** Navigate back to the homepage */
  onNavigateHome: () => void;
  /** Navigate to the Admin Dashboard */
  onNavigateAdmin?: () => void;
  /** Current number of items in the cart */
  cartCount: number;
  /** Open the shopping cart drawer */
  onOpenCart: () => void;
}

/**
 * Playful white cartoon chef/burger mascot emblem matching the top-left brand logo.
 */
export const BrandMascotLogo: React.FC<{ className?: string; accentColor?: string }> = ({
  className = 'w-9 h-9 sm:w-10 sm:h-10 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]',
  accentColor = '#E58619',
}) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Chef Hat / Bun Crown */}
    <path
      d="M16 26C11.5 24 10 18 14 14C17.5 10.5 23 12 25 13C27.5 9 36.5 9 39 13C41 12 46.5 10.5 50 14C54 18 52.5 24 48 26H16Z"
      fill="currentColor"
    />
    {/* Head / Burger Face Silhouette */}
    <path
      d="M14 30C14 27.7909 15.7909 26 18 26H46C48.2091 26 50 27.7909 50 30V38C50 47.9411 41.9411 55 32 55C22.0589 55 14 47.9411 14 38V30Z"
      fill="currentColor"
    />
    {/* Cute Winking Eyes */}
    <circle cx="25" cy="36" r="2.8" fill={accentColor} />
    <path
      d="M36 36C37.5 34 40.5 34 42 36"
      stroke={accentColor}
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    {/* Mustache & Smile */}
    <path
      d="M22 43C25 41 29.5 41.5 32 43.5C34.5 41.5 39 41 42 43"
      stroke={accentColor}
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M27 47.5C29.5 50 34.5 50 37 47.5"
      stroke={accentColor}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = React.memo(({
  activeCategoryPage,
  scrollActiveCategory = null,
  onSelectCategory,
  onNavigateHome,
  onNavigateAdmin,
  cartCount,
  onOpenCart,
}) => {
  const { categories, isAdmin } = useBackend();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const rafRef = useRef<number | null>(null);

  // Efficient passive scroll listener with hysteresis to prevent layout thrashing or flickering
  useEffect(() => {
    const updateScrollState = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 36) return true;
        if (prev && y < 16) return false;
        return prev;
      });
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Determine the highlighted category (explicit category page takes precedence, otherwise scroll-observed category)
  const highlightedCategoryId: FoodCategoryId | null =
    activeCategoryPage ?? scrollActiveCategory;

  const activeCategoryMeta = FOOD_CATEGORIES.find(
    (c) => c.id === highlightedCategoryId
  );
  const currentAccentColor = activeCategoryMeta?.accentColor || '#E58619';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes('roll') || q.includes('wrap') || q.includes('shawarma') || q.includes('kathi')) {
      onSelectCategory('rolls');
    } else if (q.includes('pizza') || q.includes('margherita') || q.includes('pepperoni') || q.includes('farmhouse')) {
      onSelectCategory('pizza');
    } else if (q.includes('drink') || q.includes('mojito') || q.includes('coffee') || q.includes('shake') || q.includes('juice') || q.includes('soda')) {
      onSelectCategory('drinks');
    } else if (q.includes('burger') || q.includes('zinger') || q.includes('paneer') || q.includes('cheese')) {
      onSelectCategory('burgers');
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  // On Homepage top (!isScrolled && activeCategoryPage === null): transparent full bar over Hero.
  // When scrolled or on a Category Page: dark frosted glass backdrop with smooth transition.
  const showSolidBackdrop = isScrolled || activeCategoryPage !== null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-[background-color,padding,box-shadow,border-color] duration-300 ease-out ${
        showSolidBackdrop
          ? 'bg-[#141414]/95 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      } ${
        isScrolled
          ? 'py-2 sm:py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
          : 'py-3.5 sm:py-5 shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Main Navigation Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Zone: Back to Home (when on category page) + Brand Mascot Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {activeCategoryPage !== null && (
              <button
                type="button"
                onClick={onNavigateHome}
                className={`flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isScrolled
                    ? 'px-3 py-1.5 text-xs'
                    : 'px-3.5 py-2 text-xs sm:text-sm'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Back to Home</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateHome}
              aria-label="ZaidBites Home"
              className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-full transition-transform duration-150 hover:scale-103 active:scale-97 cursor-pointer shrink-0"
            >
              <BrandMascotLogo
                className={`text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                  isScrolled ? 'w-8 h-8 sm:w-8 sm:h-8' : 'w-9 h-9 sm:w-10 sm:h-10'
                }`}
                accentColor={currentAccentColor}
              />
              <span
                className={`font-extrabold tracking-tight text-white transition-all duration-300 ${
                  activeCategoryPage !== null ? 'hidden sm:inline' : 'inline'
                } ${isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}
              >
                ZaidBites
              </span>
            </button>
          </div>

          {/* Center Zone (Desktop): 4 Food Categories (Burgers, Pizza, Rolls & Wraps, Drinks) */}
          <nav
            aria-label="Food Categories"
            className={`hidden md:flex items-center gap-1.5 rounded-full transition-all duration-300 ${
              showSolidBackdrop
                ? 'bg-white/[0.08] p-1 border border-white/10'
                : 'bg-black/15 backdrop-blur-xs p-1 border border-white/15'
            }`}
          >
            {categories.map((cat) => {
              const isActive = highlightedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  style={
                    isActive
                      ? { backgroundColor: cat.accentColor }
                      : undefined
                  }
                  className={`relative rounded-full font-semibold tracking-normal whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isScrolled
                      ? 'px-3.5 py-1.5 text-xs lg:text-sm'
                      : 'px-4 py-1.5 text-sm lg:text-[15px]'
                  } ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Search & Sticky Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 175, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleSearchSubmit}
                  className="overflow-hidden hidden sm:flex items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Burgers, Pizza, Rolls..."
                    autoFocus
                    className="w-full bg-white/15 backdrop-blur-md text-white placeholder-white/75 text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-white/35 focus:outline-none focus:border-white"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label={searchOpen ? 'Close search' : 'Search menu'}
              className={`rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isScrolled ? 'w-8 h-8' : 'w-9 h-9'
              }`}
            >
              {searchOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4 stroke-[2.4]" />
              )}
            </button>

            {onNavigateAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                aria-label="Open Admin Dashboard"
                title="Admin Dashboard"
                className={`rounded-full flex items-center gap-1.5 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isScrolled ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#FCC419] shrink-0" />
                <span className="hidden lg:inline font-semibold">
                  {isAdmin ? 'Admin' : 'Admin Login'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className={`flex items-center gap-2 rounded-full bg-[#EF3E36] hover:bg-[#DC2626] text-white font-semibold shadow-[0_6px_16px_rgba(239,62,54,0.4)] transition-all duration-200 hover:scale-104 active:scale-96 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isScrolled
                  ? 'px-3 sm:px-3.5 py-1.5 text-xs'
                  : 'px-3.5 sm:px-4 py-2 text-xs sm:text-sm'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0" />
              <span className="hidden xs:inline sm:inline">Cart</span>
              <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-white text-[#EF3E36] text-[11px] font-bold flex items-center justify-center shadow-xs tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Category Navigation Row (Compact, Zero Horizontal Overflow) */}
        <nav
          aria-label="Mobile Food Categories"
          className={`flex md:hidden items-center justify-between gap-1 w-full transition-all duration-300 ${
            isScrolled ? 'mt-1.5 pt-1.5' : 'mt-2.5 pt-2'
          } ${
            showSolidBackdrop
              ? 'border-t border-white/10'
              : 'border-t border-white/20'
          }`}
        >
          {categories.map((cat) => {
            const isActive = highlightedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                style={
                  isActive
                    ? { backgroundColor: cat.accentColor }
                    : undefined
                }
                className={`flex-1 py-1.5 px-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-center tracking-normal transition-all duration-200 cursor-pointer truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? 'text-white shadow-xs'
                    : showSolidBackdrop
                    ? 'bg-white/[0.08] text-white/85 hover:text-white'
                    : 'bg-black/20 text-white/95 hover:bg-black/30'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
});
