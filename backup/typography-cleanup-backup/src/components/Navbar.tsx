import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, X } from 'lucide-react';
import { SlideId } from './FloatingIngredients';

interface NavbarProps {
  activeSlide: SlideId;
  activeNavTab: string;
  onSelectNav: (navKey: string, targetSlide?: SlideId) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: { key: string; label: string; slide?: SlideId }[] = [
  { key: 'all', label: 'ALL ITEMS' },
  { key: 'roll', label: 'ROLL', slide: 'roll' },
  { key: 'burger', label: 'BURGER', slide: 'burger' },
  { key: 'new', label: 'NEW ARRIVALS', slide: 'pizza' },
];

/**
 * Playful white cartoon chef/burger mascot emblem matching the top-left logo in the reference video.
 */
export const BrandMascotLogo: React.FC<{ className?: string; accentColor?: string }> = ({
  className = 'w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]',
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

export const Navbar: React.FC<NavbarProps> = ({
  activeNavTab,
  onSelectNav,
  cartCount,
  onOpenCart,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (q.includes('roll') || q.includes('wrap') || q.includes('chicken')) {
      onSelectNav('roll', 'roll');
    } else if (q.includes('pizza') || q.includes('new') || q.includes('slice')) {
      onSelectNav('new', 'pizza');
    } else if (q.includes('burger') || q.includes('cheese') || q.includes('vegan')) {
      onSelectNav('burger', 'burger');
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-40 w-full px-6 sm:px-10 md:px-14 lg:px-20 pt-5 sm:pt-7 pb-2 flex items-center justify-between"
    >
      {/* Zone 1: Brand Mascot Logo on the Left */}
      <button
        type="button"
        onClick={() => onSelectNav('all', 'burger')}
        aria-label="ZaidBites Home"
        className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-full transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <BrandMascotLogo />
      </button>

      {/* Zone 2: Centered Navigation Links */}
      <nav
        aria-label="Primary Categories"
        className="flex items-center gap-4 sm:gap-8 md:gap-11 lg:gap-14"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeNavTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectNav(item.key, item.slide)}
              className={`relative py-1.5 text-[10px] sm:text-xs md:text-[13px] font-bold tracking-[0.12em] uppercase whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded ${
                isActive ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {item.label}
              {isActive && (
                <motion.span
                  layoutId="activeNavUnderline"
                  transition={{ type: 'spring', stiffness: 460, damping: 32 }}
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Search & Red Notification/Cart Badge on the Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 170, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSearchSubmit}
              className="overflow-hidden hidden sm:flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Burger, Roll, Pizza..."
                autoFocus
                className="w-full bg-white/20 backdrop-blur-md text-white placeholder-white/75 text-xs px-3 py-1.5 rounded-full border border-white/40 focus:outline-none focus:border-white"
              />
            </motion.form>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label={searchOpen ? 'Close search' : 'Search menu'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.4]" />}
        </button>

        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`View order bag with ${cartCount} items`}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EF3E36] hover:bg-[#DC2626] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(239,62,54,0.45)] transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-white text-[#EF3E36] text-[10px] font-extrabold flex items-center justify-center shadow-sm tabular-nums">
            {cartCount}
          </span>
        </button>
      </div>
    </motion.header>
  );
};
