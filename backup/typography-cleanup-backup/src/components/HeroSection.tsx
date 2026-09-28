import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HERO_SLIDES, HeroSlide } from '../data/heroSlides';
import { Navbar } from './Navbar';
import {
  FloatingIngredients,
  SlideId,
  RealisticTomatoSliceSvg,
  RealisticCheddarSliceSvg,
  RealisticOnionRingsSvg,
  RealisticPickleCoinsSvg,
  RealisticLettuceLeafSvg,
  RealisticSearedPattySvg,
  RealisticSesameBunSvg,
} from './FloatingIngredients';
import { TransparentFoodImage } from './TransparentFoodImage';

interface HeroSectionProps {
  cartCount: number;
  onOpenCart: () => void;
  onOrderSlide: (slideId: SlideId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cartCount,
  onOpenCart,
  onOrderSlide,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [activeNavTab, setActiveNavTab] = useState<string>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const currentSlide: HeroSlide = HERO_SLIDES[activeIndex];

  const goToSlide = useCallback(
    (nextIndex: number, customDirection?: number) => {
      const normalized = (nextIndex + HERO_SLIDES.length) % HERO_SLIDES.length;
      if (normalized === activeIndex) return;
      const dir =
        customDirection !== undefined
          ? customDirection
          : normalized > activeIndex
          ? 1
          : -1;
      setDirection(dir);
      setActiveIndex(normalized);
    },
    [activeIndex]
  );

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1, 1);
  }, [activeIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1, -1);
  }, [activeIndex, goToSlide]);

  const handleSelectNav = (navKey: string, targetSlide?: SlideId) => {
    setActiveNavTab(navKey);
    if (targetSlide) {
      const idx = HERO_SLIDES.findIndex((s) => s.id === targetSlide);
      if (idx !== -1) {
        goToSlide(idx);
      }
    } else if (navKey === 'all') {
      goToSlide(0, -1);
    }
  };

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePrev]);

  // Smooth auto-showcase transition (Burger -> Roll -> Pizza)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleOrderNow = () => {
    onOrderSlide(currentSlide.id);
    setAddedToast(`Added ${currentSlide.title} to your order!`);
    setTimeout(() => setAddedToast(null), 1500);
  };

  return (
    <section
      id="section-hero"
      onMouseMove={handleMouseMove}
      aria-label="Featured Menu Hero"
      className="relative w-full h-screen min-h-[640px] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Smooth Crossfading Radial Gradient Background (340ms coordinated color transition) */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
          style={{ background: currentSlide.bgGradient }}
        />
      </AnimatePresence>

      {/* Subtle Soft Center Illumination Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full blur-3xl z-1 transition-colors duration-350"
        style={{ background: currentSlide.glowColor }}
      />

      {/* Top Navigation Bar */}
      <Navbar
        activeSlide={currentSlide.id}
        activeNavTab={activeNavTab}
        onSelectNav={handleSelectNav}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
      />

      {/* Center Hero Stage: Giant Bold Display Headline + Simultaneous Floating Ingredients + Main Food Cutout */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center px-4">
        {/* Floating Food Garnishes arranged around the main image — shares exact same t=0 timeline */}
        <FloatingIngredients
          activeSlide={currentSlide.id}
          direction={direction}
          mouseOffset={mouseOffset}
        />

        {/* Giant Bold White Center Headline (BURGER / ROLL / PIZZA) */}
        <div className="relative z-10 flex items-center justify-center w-full pointer-events-none">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.h1
              key={currentSlide.title}
              custom={direction}
              initial={{
                opacity: 0,
                y: direction > 0 ? 42 : -42,
                scale: 0.92,
                filter: 'blur(3px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                x: mouseOffset.x * -8,
              }}
              exit={{
                opacity: 0,
                y: direction > 0 ? -42 : 42,
                scale: 0.94,
                filter: 'blur(3px)',
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`font-display-hero text-white text-center whitespace-nowrap text-[5.4rem] sm:text-[9.8rem] md:text-[14rem] lg:text-[18.5rem] xl:text-[21.5rem] drop-shadow-[0_10px_28px_rgba(0,0,0,0.08)] will-change-transform ${currentSlide.titleTracking}`}
            >
              {currentSlide.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Centerpiece Food Image + Simultaneous Burger Assembly Layers */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              initial={{
                opacity: 0,
                scale: 0.74,
                x: direction > 0 ? 90 : -90,
                y: 20,
                rotate: direction > 0 ? 7 : -7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 14,
                y: mouseOffset.y * 10,
                rotate: currentSlide.dishRotation,
              }}
              exit={{
                opacity: 0,
                scale: 0.76,
                x: direction > 0 ? -90 : 90,
                y: -18,
                rotate: direction > 0 ? -7 : 7,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex flex-col items-center justify-center ${currentSlide.dishScale} aspect-square will-change-transform`}
            >
              {/* SIMULTANEOUS BURGER ASSEMBLY CONVERGENCE LAYER (Active on Burger slide at t=0) */}
              {currentSlide.id === 'burger' && !shouldReduceMotion && (
                <SimultaneousHeroBurgerAssembly />
              )}

              {/* Continuous Levitation Animation (Fast, responsive 2.2s cycle) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -8, 0],
                        rotate: [0, 1.2, 0],
                      }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-20 w-full h-full flex items-center justify-center"
              >
                <TransparentFoodImage
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Realistic Soft Dark Contact Shadow underneath the centerpiece dish */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scaleX: [1, 0.9, 1],
                        opacity: [0.42, 0.3, 0.42],
                      }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-[58%] h-6 sm:h-8 rounded-full bg-black/50 blur-xl -mt-3 sm:-mt-5 pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom 3-Zone Hero Footer: Description Left | Order Now CTA Center | Prev/Next Arrows Right */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative z-30 w-full px-6 sm:px-10 md:px-14 lg:px-20 pb-6 sm:pb-9 pt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-5"
      >
        {/* Bottom-Left: Dish Description Text */}
        <div className="order-2 md:order-1 flex flex-col justify-end min-h-[64px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlide.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="max-w-[280px] sm:max-w-[310px] text-[11px] sm:text-xs md:text-[13px] leading-[1.55] text-white/95 font-normal tracking-normal text-center md:text-left mx-auto md:mx-0"
            >
              {currentSlide.description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom-Center: Prominent Black Pill "Order Now" CTA Button */}
        <div className="order-1 md:order-2 flex flex-col items-center justify-center relative">
          <AnimatePresence>
            {addedToast && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.92 }}
                transition={{ duration: 0.16 }}
                className="absolute -top-10 whitespace-nowrap bg-white text-black text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg"
              >
                {addedToast}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={handleOrderNow}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.16 }}
            className="bg-[#0F0F0F] hover:bg-black text-white font-semibold text-xs sm:text-sm tracking-wide px-8 sm:px-10 py-3 sm:py-3.5 rounded-full shadow-[0_12px_26px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.4)] transition-shadow duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Order Now
          </motion.button>
        </div>

        {/* Bottom-Right: Circular Outlined Prev / Next Navigation Buttons */}
        <div className="order-3 flex items-center justify-center md:justify-end gap-3">
          <motion.button
            type="button"
            onClick={handlePrev}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            aria-label="Previous dish"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/75 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.2]" />
          </motion.button>

          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
            aria-label="Next dish"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/75 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.2]" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

/**
 * Simultaneous Burger Assembly Effect rendered on the exact same timeline (t = 0)
 * as the Hero Burger and its outer Floating Ingredients.
 * All burger components (top sesame bun, patty, melted cheddar, lettuce, tomato,
 * onion rings, and pickles) dynamically converge into the burger as it appears.
 */
const SimultaneousHeroBurgerAssembly: React.FC = () => {
  const assemblyItems = [
    {
      id: 'crown-bun',
      Component: RealisticSesameBunSvg,
      initial: { y: -115, x: 0, scale: 1.08, rotate: 6, opacity: 0.92 },
      animate: { y: -42, x: 0, scale: 0.72, rotate: 0, opacity: 0 },
      size: 'w-44 sm:w-56',
    },
    {
      id: 'patty',
      Component: RealisticSearedPattySvg,
      initial: { y: 105, x: -20, scale: 1.05, rotate: -8, opacity: 0.92 },
      animate: { y: 24, x: 0, scale: 0.72, rotate: 0, opacity: 0 },
      size: 'w-44 sm:w-56',
    },
    {
      id: 'cheddar',
      Component: RealisticCheddarSliceSvg,
      initial: { y: -55, x: -115, scale: 0.95, rotate: -22, opacity: 0.95 },
      animate: { y: 4, x: -18, scale: 0.65, rotate: 0, opacity: 0 },
      size: 'w-28 sm:w-36',
    },
    {
      id: 'tomato',
      Component: RealisticTomatoSliceSvg,
      initial: { y: -65, x: 115, scale: 0.95, rotate: 24, opacity: 0.95 },
      animate: { y: -8, x: 16, scale: 0.65, rotate: 0, opacity: 0 },
      size: 'w-28 sm:w-36',
    },
    {
      id: 'lettuce',
      Component: RealisticLettuceLeafSvg,
      initial: { y: 65, x: 110, scale: 0.95, rotate: 18, opacity: 0.95 },
      animate: { y: 12, x: 14, scale: 0.65, rotate: 0, opacity: 0 },
      size: 'w-28 sm:w-36',
    },
    {
      id: 'onion',
      Component: RealisticOnionRingsSvg,
      initial: { y: -85, x: -85, scale: 0.9, rotate: -18, opacity: 0.92 },
      animate: { y: -16, x: -12, scale: 0.6, rotate: 0, opacity: 0 },
      size: 'w-24 sm:w-32',
    },
    {
      id: 'pickles',
      Component: RealisticPickleCoinsSvg,
      initial: { y: 75, x: -100, scale: 0.9, rotate: 20, opacity: 0.92 },
      animate: { y: -12, x: 10, scale: 0.6, rotate: 0, opacity: 0 },
      size: 'w-24 sm:w-28',
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {assemblyItems.map((item) => {
        const Comp = item.Component;
        return (
          <motion.div
            key={item.id}
            initial={item.initial}
            animate={item.animate}
            transition={{
              duration: 0.72,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`absolute ${item.size} aspect-square flex items-center justify-center will-change-transform`}
          >
            <Comp />
          </motion.div>
        );
      })}
    </div>
  );
};
