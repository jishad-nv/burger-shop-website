import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Play, Layers, Compass, Sparkles, Flame, ShoppingBag } from 'lucide-react';
import { FoodProduct } from '../types/food';
import {
  RealisticTomatoSliceSvg,
  RealisticCheddarSliceSvg,
  RealisticOnionRingsSvg,
  RealisticPickleCoinsSvg,
  RealisticLettuceLeafSvg,
  RealisticSearedPattySvg,
  RealisticSesameBunSvg,
} from './FloatingIngredients';
import { TransparentFoodImage } from './TransparentFoodImage';
import lettuceImgUrl from '../assets/images/floating_lettuce_leaf_1790595028642.jpg';

interface CinematicBurgerAnimationProps {
  featuredBurger: FoodProduct;
  onAddToCart: (product: FoodProduct) => void;
  onViewDetails: (product: FoodProduct) => void;
}

type AnimationMode = 'exploded-vertical' | 'creative-flyin' | 'xray-inspect';

interface IngredientLayerMeta {
  id: string;
  name: string;
  tag: string;
  assembledY: number;
  explodedY: number;
  zIndex: number;
}

const BURGER_LAYERS: IngredientLayerMeta[] = [
  { id: 'top-bun', name: 'Golden Sesame Brioche Crown', tag: 'Toasted & Glazed', assembledY: -86, explodedY: -190, zIndex: 80 },
  { id: 'pickles', name: 'House Brined Dill Pickle Coins', tag: 'Tangy Crunch', assembledY: -52, explodedY: -130, zIndex: 70 },
  { id: 'onions', name: 'Sweet Purple Onion Rings', tag: 'Crisp & Zesty', assembledY: -36, explodedY: -78, zIndex: 60 },
  { id: 'tomatoes', name: 'Vine-Ripened Heirloom Tomatoes', tag: 'Juicy Slice', assembledY: -16, explodedY: -22, zIndex: 50 },
  { id: 'lettuce', name: 'Hydroponic Frilly Romaine', tag: 'Farm Fresh', assembledY: 4, explodedY: 32, zIndex: 40 },
  { id: 'cheese', name: 'Double Melted Aged Cheddar', tag: 'Molten Gold', assembledY: 22, explodedY: 84, zIndex: 35 },
  { id: 'patty', name: 'Flame-Seared Burger Patty', tag: 'Cast-Iron Charred', assembledY: 40, explodedY: 136, zIndex: 30 },
  { id: 'bottom-bun', name: 'Butter-Toasted Sesame Base', tag: 'Signature Sauce', assembledY: 74, explodedY: 190, zIndex: 20 },
];

/**
 * Realistic floating burger ingredients that fly into the scene and orbit around
 * the burger AT THE EXACT SAME TIME (t = 0) as the burger layers assemble.
 */
const FLOATING_ORBIT_INGREDIENTS = [
  {
    id: 'orbit-lettuce-cutout',
    label: 'Fresh Lettuce Leaf',
    positionClass: 'top-4 left-2 sm:left-6 w-20 sm:w-24',
    initial: { opacity: 0, x: -110, y: -70, scale: 0.4, rotate: -48 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: -18 },
    floatAnim: { y: [0, -7, 0], rotate: [-18, -13, -18] },
  },
  {
    id: 'orbit-tomato-slice',
    label: 'Heirloom Tomato Slice',
    positionClass: 'top-6 right-2 sm:right-6 w-20 sm:w-24',
    initial: { opacity: 0, x: 115, y: -65, scale: 0.4, rotate: 45 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 14 },
    floatAnim: { y: [0, -6, 0], rotate: [14, 20, 14] },
  },
  {
    id: 'orbit-cheddar-slice',
    label: 'Aged Cheddar Slice',
    positionClass: 'top-[42%] left-0 sm:left-2 w-18 sm:w-22',
    initial: { opacity: 0, x: -125, y: 20, scale: 0.4, rotate: -35 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: -10 },
    floatAnim: { y: [0, 6, 0], rotate: [-10, -4, -10] },
  },
  {
    id: 'orbit-onion-rings',
    label: 'Purple Onion Rings',
    positionClass: 'top-[38%] right-0 sm:right-2 w-18 sm:w-22',
    initial: { opacity: 0, x: 125, y: 15, scale: 0.4, rotate: 38 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 12 },
    floatAnim: { y: [0, -6, 0], rotate: [12, 6, 12] },
  },
  {
    id: 'orbit-pickle-coins',
    label: 'Dill Pickle Coins',
    positionClass: 'bottom-14 left-4 sm:left-8 w-16 sm:w-20',
    initial: { opacity: 0, x: -105, y: 75, scale: 0.4, rotate: 32 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 8 },
    floatAnim: { y: [0, -5, 0], rotate: [8, 14, 8] },
  },
  {
    id: 'orbit-patty-medallion',
    label: 'Seared Burger Patty',
    positionClass: 'bottom-12 right-4 sm:right-8 w-18 sm:w-22',
    initial: { opacity: 0, x: 105, y: 75, scale: 0.4, rotate: -28 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, rotate: -8 },
    floatAnim: { y: [0, 6, 0], rotate: [-8, -2, -8] },
  },
  {
    id: 'orbit-sesame-bun',
    label: 'Sesame Seed Bun',
    positionClass: 'top-1 left-1/2 -translate-x-1/2 w-16 sm:w-20',
    initial: { opacity: 0, x: 0, y: -95, scale: 0.4, rotate: 18 },
    animate: { opacity: 0.9, x: 0, y: 0, scale: 0.88, rotate: -4 },
    floatAnim: { y: [0, -5, 0], rotate: [-4, 2, -4] },
  },
];

export const CinematicBurgerAnimation: React.FC<CinematicBurgerAnimationProps> = ({
  featuredBurger,
  onAddToCart,
  onViewDetails,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  const [mode, setMode] = useState<AnimationMode>('exploded-vertical');
  const [playKey, setPlayKey] = useState<number>(0);
  const [isAssembled, setIsAssembled] = useState<boolean>(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [activeStageText, setActiveStageText] = useState<string>(
    'Simultaneous assembly: Buns, seared patty & fresh ingredients converging...'
  );

  // Coordinated 1.65s simultaneous burger + ingredient timeline (within 1.5–2.0s window)
  useEffect(() => {
    if (!isInView) return;

    if (mode === 'xray-inspect') {
      setIsAssembled(false);
      setActiveStageText('Interactive X-Ray View — Hover any ingredient layer to inspect');
      return;
    }

    setIsAssembled(false);
    setActiveStageText(
      mode === 'exploded-vertical'
        ? 'Simultaneous Assembly: Buns, patty, cheese, lettuce, tomato, onion & pickles moving together...'
        : '360° Simultaneous Shot: Burger & realistic floating ingredients flying in together...'
    );

    const t1 = setTimeout(() => {
      setActiveStageText(
        'Top sesame bun locking in as floating ingredients orbit into position...'
      );
    }, 850);

    const t2 = setTimeout(() => {
      setIsAssembled(true);
      setActiveStageText('Assembled in 1.6s! Burger & fresh ingredients levitating in sync.');
    }, 1620);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isInView, mode, playKey]);

  const handleReplay = (selectedMode?: AnimationMode) => {
    if (selectedMode) {
      setMode(selectedMode);
    }
    setPlayKey((prev) => prev + 1);
  };

  /**
   * Computes simultaneous, tightly coordinated motion props (1.5–1.65s total)
   * so the bottom bun, patty, cheese, lettuce, tomato, onion, pickles, and top bun
   * all move dynamically AT THE SAME TIME rather than waiting sequentially.
   */
  const getLayerMotionProps = (layerId: string, assembledY: number, explodedY: number) => {
    if (shouldReduceMotion) {
      return {
        initial: { y: mode === 'xray-inspect' ? explodedY : assembledY, x: 0, rotate: 0, scale: 1, opacity: 1 },
        animate: { y: mode === 'xray-inspect' ? explodedY : assembledY, x: 0, rotate: 0, scale: 1, opacity: 1 },
        transition: { duration: 0.01 },
      };
    }

    if (mode === 'xray-inspect') {
      return {
        initial: { y: assembledY, x: 0, rotate: 0, scale: 1, opacity: 1 },
        animate: {
          y: explodedY,
          x: hoveredLayer === layerId ? 12 : 0,
          rotate: hoveredLayer === layerId ? -1.5 : 0,
          scale: hoveredLayer === layerId ? 1.06 : 1,
          opacity: 1,
        },
        transition: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      };
    }

    // Shared smooth commercial cubic-bezier curve
    const smoothBezier: [number, number, number, number] = [0.22, 1, 0.36, 1];

    if (mode === 'exploded-vertical') {
      // ALL layers launch simultaneously between 0.00s and 0.16s and settle smoothly within 1.55s!
      switch (layerId) {
        case 'bottom-bun':
          return {
            initial: { y: 195, x: 0, scale: 0.82, rotate: -4, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.15, delay: 0.0, ease: smoothBezier },
          };
        case 'patty':
          return {
            initial: { y: 165, x: -18, scale: 0.84, rotate: 6, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.22, delay: 0.03, ease: smoothBezier },
          };
        case 'cheese':
          return {
            initial: { y: -110, x: 45, scale: 1.1, rotate: -10, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.28, delay: 0.05, ease: smoothBezier },
          };
        case 'lettuce':
          return {
            initial: { y: -95, x: -95, scale: 0.85, rotate: -14, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.32, delay: 0.06, ease: smoothBezier },
          };
        case 'tomatoes':
          return {
            initial: { y: -125, x: 100, scale: 0.86, rotate: 16, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.36, delay: 0.07, ease: smoothBezier },
          };
        case 'onions':
          return {
            initial: { y: -145, x: -85, scale: 0.84, rotate: 18, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.40, delay: 0.08, ease: smoothBezier },
          };
        case 'pickles':
          return {
            initial: { y: -165, x: 75, scale: 0.82, rotate: -18, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.44, delay: 0.09, ease: smoothBezier },
          };
        case 'top-bun':
        default:
          return {
            initial: { y: -235, x: 0, scale: 1.14, rotate: 5, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.52, delay: 0.12, ease: smoothBezier },
          };
      }
    } else {
      // 360° Simultaneous Fly-In Shot (all layers + floating ingredients converge simultaneously in 1.55s)
      switch (layerId) {
        case 'bottom-bun':
          return {
            initial: { y: 185, x: 0, scale: 0.72, rotate: 0, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.15, delay: 0.0, ease: smoothBezier },
          };
        case 'patty':
          return {
            initial: { y: 55, x: -240, scale: 0.8, rotate: -22, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.24, delay: 0.02, ease: smoothBezier },
          };
        case 'cheese':
          return {
            initial: { y: -45, x: 240, scale: 0.84, rotate: 24, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.28, delay: 0.04, ease: smoothBezier },
          };
        case 'lettuce':
          return {
            initial: { y: 90, x: 220, scale: 0.82, rotate: -26, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.32, delay: 0.05, ease: smoothBezier },
          };
        case 'tomatoes':
          return {
            initial: { y: -95, x: -220, scale: 0.82, rotate: 26, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.36, delay: 0.06, ease: smoothBezier },
          };
        case 'onions':
          return {
            initial: { y: -115, x: 200, scale: 0.8, rotate: -28, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.40, delay: 0.07, ease: smoothBezier },
          };
        case 'pickles':
          return {
            initial: { y: -85, x: -195, scale: 0.78, rotate: 30, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.44, delay: 0.08, ease: smoothBezier },
          };
        case 'top-bun':
        default:
          return {
            initial: { y: -245, x: 0, scale: 1.18, rotate: -6, opacity: 0 },
            animate: { y: assembledY, x: 0, scale: 1, rotate: 0, opacity: 1 },
            transition: { duration: 1.52, delay: 0.10, ease: smoothBezier },
          };
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1B120C] via-[#28160B] to-[#140C07] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-6 sm:p-10 lg:p-12 my-10"
    >
      {/* Warm Commercial Studio Spotlight Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-38"
        style={{
          background: 'radial-gradient(circle, #F59F00 0%, #E58619 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Commercial Controls, Story & Layer Callouts */}
        <div className="lg:col-span-5 space-y-6 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F59F00]/20 border border-[#F59F00]/40 text-[#FCC419] text-xs font-extrabold uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5" />
            <span>Simultaneous Burger &amp; Ingredient Craft</span>
          </div>

          <div>
            <h3 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-[0.92]">
              ANATOMY OF PERFECTION
            </h3>
            <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
              Watch the sesame brioche buns, flame-seared patty, melted cheddar, crisp lettuce, heirloom tomatoes, purple onion rings, and dill pickles assemble simultaneously while fresh burger ingredients orbit the scene.
            </p>
          </div>

          {/* 3 Interactive Animation Mode Switchers */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 block">
              Select Commercial Camera &amp; Assembly Mode
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleReplay('exploded-vertical')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  mode === 'exploded-vertical'
                    ? 'bg-[#F59F00] text-black shadow-[0_8px_20px_rgba(245,159,0,0.35)]'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>1. Simultaneous Stack</span>
              </button>

              <button
                type="button"
                onClick={() => handleReplay('creative-flyin')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  mode === 'creative-flyin'
                    ? 'bg-[#F59F00] text-black shadow-[0_8px_20px_rgba(245,159,0,0.35)]'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>2. 360° Simultaneous Fly-In</span>
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'xray-inspect' ? 'exploded-vertical' : 'xray-inspect')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  mode === 'xray-inspect'
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{mode === 'xray-inspect' ? 'Assemble Burger' : 'Explode Layers'}</span>
              </button>
            </div>
          </div>

          {/* Live Stage Status Pill */}
          <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#82C91E] animate-pulse shrink-0" />
              <p className="text-xs font-semibold text-white/90 truncate">{activeStageText}</p>
            </div>
            <button
              type="button"
              onClick={() => handleReplay()}
              className="text-[11px] font-extrabold uppercase tracking-wider text-[#FCC419] hover:text-white transition-colors duration-150 shrink-0 cursor-pointer"
            >
              Replay (1.6s)
            </button>
          </div>

          {/* Action CTA for Featured Burger */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onAddToCart(featuredBurger)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#F59F00] to-[#EF3E36] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-[0_10px_25px_rgba(239,62,54,0.35)] transition-all duration-150 hover:scale-103 active:scale-97 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order {featuredBurger.name} — ₹{featuredBurger.price}</span>
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(featuredBurger)}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all duration-150 cursor-pointer"
            >
              Customize Ingredients
            </button>
          </div>
        </div>

        {/* Right Column: 3D Physical Burger Assembly + Simultaneous Orbiting Burger Ingredients */}
        <div className="lg:col-span-7 relative h-[470px] sm:h-[520px] flex items-center justify-center select-none">
          {/* SIMULTANEOUS ORBITING REALISTIC BURGER INGREDIENTS (Shares exact playKey & t=0 timeline) */}
          <div
            key={`orbit-${mode}-${playKey}`}
            className="pointer-events-none absolute inset-0 z-15 overflow-visible"
          >
            {FLOATING_ORBIT_INGREDIENTS.map((ing) => (
              <motion.div
                key={ing.id}
                initial={shouldReduceMotion ? ing.animate : ing.initial}
                animate={ing.animate}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 1.45,
                  delay: 0, // Zero delay: starts at the exact same frame as the burger assembly
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`absolute ${ing.positionClass} aspect-square will-change-transform`}
              >
                <motion.div
                  animate={shouldReduceMotion ? undefined : ing.floatAnim}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-full h-full"
                >
                  {renderOrbitBurgerIngredient(ing.id)}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Center Camera Perspective Motion Container */}
          <motion.div
            key={`${mode}-${playKey}`}
            initial={
              shouldReduceMotion
                ? { scale: 1, rotate: 0, y: 0 }
                : mode === 'creative-flyin'
                ? { scale: 0.88, rotate: -3, y: 12 }
                : { scale: 0.94, rotate: 0, y: 0 }
            }
            animate={
              isAssembled && mode !== 'xray-inspect' && !shouldReduceMotion
                ? {
                    scale: [1, 1.02, 1],
                    y: [0, -8, 0],
                    rotate: [0, 0.8, 0],
                  }
                : { scale: 1, rotate: 0, y: 0 }
            }
            transition={
              isAssembled && mode !== 'xray-inspect'
                ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 1.45, ease: [0.22, 1, 0.36, 1] }
            }
            className="relative w-full max-w-[460px] h-full flex items-center justify-center will-change-transform"
          >
            {/* Ground Contact Shadow that intensifies as the burger assembles */}
            <motion.div
              initial={{ scale: 0.45, opacity: 0.2 }}
              animate={{
                scale: mode === 'xray-inspect' ? 0.8 : isAssembled ? [1.04, 0.92, 1.04] : 1,
                opacity: mode === 'xray-inspect' ? 0.3 : isAssembled ? [0.65, 0.45, 0.65] : 0.6,
              }}
              transition={{ duration: 2.2, repeat: isAssembled ? Infinity : 0, ease: 'easeInOut' }}
              className="absolute bottom-[52px] w-64 sm:w-72 h-10 rounded-full bg-black/80 blur-xl pointer-events-none z-10"
            />

            {/* Assembled Status Badge */}
            {isAssembled && mode !== 'xray-inspect' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center z-90"
              >
                <div className="absolute -top-2 right-10 px-3 py-1 rounded-full bg-[#82C91E] text-black text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Simultaneously Assembled</span>
                </div>
              </motion.div>
            )}

            {/* Render each physical burger ingredient layer on the shared timeline */}
            {BURGER_LAYERS.map((layer) => {
              const motionProps = getLayerMotionProps(layer.id, layer.assembledY, layer.explodedY);
              const showCallout = mode === 'xray-inspect' || hoveredLayer === layer.id;

              return (
                <motion.div
                  key={layer.id}
                  initial={motionProps.initial}
                  animate={motionProps.animate}
                  transition={motionProps.transition}
                  onMouseEnter={() => setHoveredLayer(layer.id)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  style={{ zIndex: layer.zIndex }}
                  className="absolute flex items-center justify-center cursor-pointer group will-change-transform"
                >
                  {/* Ingredient SVG Graphic */}
                  <div className="w-[245px] sm:w-[305px] flex items-center justify-center transition-transform duration-150">
                    {renderBurgerLayerSvg(layer.id)}
                  </div>

                  {/* Callout Label Line in X-Ray mode or on hover */}
                  <div
                    className={`hidden sm:flex items-center gap-2 absolute left-[92%] ml-2 pointer-events-none transition-all duration-150 ${
                      showCallout ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    <span className="w-6 h-[1.5px] bg-[#FCC419]/70" />
                    <div className="px-2.5 py-1 rounded-lg bg-black/85 border border-white/15 whitespace-nowrap shadow-md">
                      <p className="text-[11px] font-bold text-white leading-tight">{layer.name}</p>
                      <p className="text-[9px] font-semibold text-[#FCC419] uppercase tracking-wider">
                        {layer.tag}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

function renderOrbitBurgerIngredient(orbitId: string): React.ReactNode {
  switch (orbitId) {
    case 'orbit-lettuce-cutout':
      return (
        <TransparentFoodImage
          src={lettuceImgUrl}
          alt="Fresh romaine lettuce leaf"
          className="w-full h-full object-contain"
        />
      );
    case 'orbit-tomato-slice':
      return <RealisticTomatoSliceSvg />;
    case 'orbit-cheddar-slice':
      return <RealisticCheddarSliceSvg />;
    case 'orbit-onion-rings':
      return <RealisticOnionRingsSvg />;
    case 'orbit-pickle-coins':
      return <RealisticPickleCoinsSvg />;
    case 'orbit-patty-medallion':
      return <RealisticSearedPattySvg />;
    case 'orbit-sesame-bun':
    default:
      return <RealisticSesameBunSvg />;
  }
}

/**
 * Renders 3D-shaded, high-detail commercial SVG artwork for each of the 8 burger layers.
 */
function renderBurgerLayerSvg(layerId: string): React.ReactNode {
  switch (layerId) {
    case 'top-bun':
      return (
        <svg viewBox="0 0 320 120" className="w-full h-auto overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.45)]">
          <defs>
            <radialGradient id="topBunGrad" cx="45%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFD885" />
              <stop offset="45%" stopColor="#E89225" />
              <stop offset="85%" stopColor="#B85A0C" />
              <stop offset="100%" stopColor="#8C3E05" />
            </radialGradient>
            <linearGradient id="bunInnerRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F3C677" />
              <stop offset="50%" stopColor="#FFE8B5" />
              <stop offset="100%" stopColor="#D99B43" />
            </linearGradient>
          </defs>
          {/* Toasted underside of crown bun */}
          <ellipse cx="160" cy="96" rx="134" ry="18" fill="url(#bunInnerRim)" />
          {/* Dome of Sesame Brioche Crown */}
          <path
            d="M26 95 C24 22, 296 22, 294 95 C255 106, 65 106, 26 95 Z"
            fill="url(#topBunGrad)"
          />
          {/* Glossy Brioche Specular Highlight */}
          <path
            d="M68 52 C110 26, 200 26, 240 48 C205 36, 115 36, 68 52 Z"
            fill="#FFF9DB"
            opacity="0.38"
          />
          {/* Realistic Sesame Seeds */}
          {[
            [95, 52, -18],
            [130, 42, 12],
            [165, 38, -5],
            [202, 45, 22],
            [232, 58, -15],
            [112, 68, 8],
            [148, 62, -14],
            [184, 65, 16],
            [218, 74, -8],
            [78, 72, 20],
            [162, 78, 4],
          ].map(([cx, cy, rot], idx) => (
            <ellipse
              key={idx}
              cx={cx}
              cy={cy}
              rx="5.5"
              ry="2.6"
              transform={`rotate(${rot} ${cx} ${cy})`}
              fill="#FFF3BF"
            />
          ))}
        </svg>
      );

    case 'pickles':
      return (
        <svg viewBox="0 0 320 65" className="w-full h-auto overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.4)]">
          <defs>
            <radialGradient id="pickleChip" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D8F5A2" />
              <stop offset="70%" stopColor="#74B816" />
              <stop offset="100%" stopColor="#2B580C" />
            </radialGradient>
          </defs>
          <g transform="translate(46, 14) rotate(-6)">
            <ellipse cx="45" cy="20" rx="44" ry="15" fill="#1E3F08" />
            <ellipse cx="45" cy="17" rx="42" ry="13" fill="url(#pickleChip)" />
          </g>
          <g transform="translate(172, 16) rotate(7)">
            <ellipse cx="46" cy="20" rx="45" ry="15" fill="#1E3F08" />
            <ellipse cx="46" cy="17" rx="43" ry="13" fill="url(#pickleChip)" />
          </g>
          <g transform="translate(108, 20) rotate(-2)">
            <ellipse cx="48" cy="20" rx="46" ry="15" fill="#1E3F08" />
            <ellipse cx="48" cy="17" rx="44" ry="13" fill="url(#pickleChip)" />
          </g>
        </svg>
      );

    case 'onions':
      return (
        <svg viewBox="0 0 320 65" className="w-full h-auto overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.38)]">
          <g transform="translate(36, 12) rotate(-5)">
            <ellipse cx="64" cy="22" rx="58" ry="16" fill="none" stroke="#862E9C" strokeWidth="7" />
            <ellipse cx="64" cy="22" rx="54" ry="13" fill="none" stroke="#F3D9FA" strokeWidth="3" />
          </g>
          <g transform="translate(142, 14) rotate(6)">
            <ellipse cx="68" cy="22" rx="60" ry="16" fill="none" stroke="#9C36B5" strokeWidth="7" />
            <ellipse cx="68" cy="22" rx="56" ry="13" fill="none" stroke="#F8F0FC" strokeWidth="3" />
          </g>
        </svg>
      );

    case 'tomatoes':
      return (
        <svg viewBox="0 0 320 75" className="w-full h-auto overflow-visible drop-shadow-[0_12px_16px_rgba(0,0,0,0.45)]">
          <defs>
            <radialGradient id="heirloomTom" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FF8787" />
              <stop offset="55%" stopColor="#F03E3E" />
              <stop offset="90%" stopColor="#C92A2A" />
              <stop offset="100%" stopColor="#961616" />
            </radialGradient>
          </defs>
          <g transform="translate(26, 12) rotate(-3)">
            <ellipse cx="75" cy="28" rx="68" ry="19" fill="#A61E1E" />
            <ellipse cx="75" cy="22" rx="68" ry="18" fill="url(#heirloomTom)" />
            <ellipse cx="55" cy="20" rx="16" ry="5" fill="#961616" opacity="0.55" />
            <ellipse cx="95" cy="20" rx="16" ry="5" fill="#961616" opacity="0.55" />
            <circle cx="54" cy="20" r="2.2" fill="#FFD43B" />
            <circle cx="94" cy="20" r="2.2" fill="#FFD43B" />
          </g>
          <g transform="translate(136, 16) rotate(4)">
            <ellipse cx="78" cy="28" rx="70" ry="19" fill="#A61E1E" />
            <ellipse cx="78" cy="22" rx="70" ry="18" fill="url(#heirloomTom)" />
            <ellipse cx="58" cy="20" rx="16" ry="5" fill="#961616" opacity="0.55" />
            <ellipse cx="98" cy="20" rx="16" ry="5" fill="#961616" opacity="0.55" />
            <circle cx="58" cy="20" r="2.2" fill="#FFD43B" />
            <circle cx="98" cy="20" r="2.2" fill="#FFD43B" />
          </g>
        </svg>
      );

    case 'lettuce':
      return (
        <svg viewBox="0 0 340 80" className="w-full h-auto overflow-visible drop-shadow-[0_14px_16px_rgba(0,0,0,0.42)]">
          <defs>
            <linearGradient id="romaineLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B2F2BB" />
              <stop offset="40%" stopColor="#51CF66" />
              <stop offset="85%" stopColor="#2B8A3E" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>
          <path
            d="M16 40 Q32 14, 58 30 T102 26 T148 34 T196 24 T244 32 T292 24 Q318 18, 324 42 Q314 66, 284 54 T236 62 T184 54 T132 64 T80 52 T34 60 Q12 56, 16 40 Z"
            fill="url(#romaineLeaf)"
          />
          <path
            d="M36 42 Q95 34, 165 44 T295 38"
            stroke="#EBFBEE"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
        </svg>
      );

    case 'cheese':
      return (
        <svg viewBox="0 0 320 75" className="w-full h-auto overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)]">
          <defs>
            <linearGradient id="meltedCheddar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="55%" stopColor="#FCC419" />
              <stop offset="100%" stopColor="#E67700" />
            </linearGradient>
          </defs>
          <path
            d="M28 24 L160 12 L292 24 L276 52 Q266 68, 256 50 L210 44 Q194 68, 182 46 L112 52 Q96 72, 84 48 L28 24 Z"
            fill="url(#meltedCheddar)"
          />
        </svg>
      );

    case 'patty':
      return (
        <svg viewBox="0 0 320 90" className="w-full h-auto overflow-visible drop-shadow-[0_16px_22px_rgba(0,0,0,0.55)]">
          <defs>
            <linearGradient id="searedPatty" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3F1D" />
              <stop offset="45%" stopColor="#4A210B" />
              <stop offset="85%" stopColor="#2E1305" />
              <stop offset="100%" stopColor="#1F0B02" />
            </linearGradient>
          </defs>
          <rect x="26" y="18" width="268" height="52" rx="26" fill="url(#searedPatty)" />
          <ellipse cx="160" cy="24" rx="124" ry="12" fill="#8D4925" opacity="0.65" />
          <line x1="78" y1="22" x2="98" y2="62" stroke="#180801" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <line x1="125" y1="20" x2="145" y2="64" stroke="#180801" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <line x1="172" y1="20" x2="192" y2="64" stroke="#180801" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <line x1="218" y1="22" x2="238" y2="62" stroke="#180801" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    case 'bottom-bun':
    default:
      return (
        <svg viewBox="0 0 320 85" className="w-full h-auto overflow-visible drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]">
          <defs>
            <linearGradient id="bottomBunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5B851" />
              <stop offset="55%" stopColor="#D97F1B" />
              <stop offset="100%" stopColor="#9C4D08" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="24" rx="132" ry="15" fill="#FFE8B5" />
          <path
            d="M55 24 Q105 16, 160 26 T265 22"
            stroke="#FF6B35"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M28 24 C28 66, 62 74, 160 74 C258 74, 292 66, 292 24 C250 35, 70 35, 28 24 Z"
            fill="url(#bottomBunGrad)"
          />
        </svg>
      );
  }
}
