import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { TransparentFoodImage, preloadTransparentFoodImages } from './TransparentFoodImage';
import lettuceImgUrl from '../assets/images/floating_lettuce_leaf_1790595028642.jpg';

// Preload the studio lettuce cutout immediately on module load
preloadTransparentFoodImages([lettuceImgUrl]);

export type SlideId = 'burger' | 'roll' | 'pizza';

interface FloatingIngredientsProps {
  activeSlide: SlideId;
  direction?: number;
  mouseOffset: { x: number; y: number };
}

/* ============================================================================
 * PHOTOREALISTIC 3D-SHADED FOOD INGREDIENT ASSETS
 * Strictly authentic, culinary-accurate ingredients for Burgers, Pizzas & Wraps
 * ========================================================================== */

/** 1. Realistic Heirloom Tomato Slice with glossy seed chambers & wet specular highlights */
export const RealisticTomatoSliceSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 140 120"
    className={`${className} overflow-visible drop-shadow-[0_14px_20px_rgba(0,0,0,0.28)]`}
  >
    <defs>
      <radialGradient id="realTomFlesh" cx="45%" cy="42%" r="56%">
        <stop offset="0%" stopColor="#FF7B7B" />
        <stop offset="52%" stopColor="#EF3E36" />
        <stop offset="86%" stopColor="#C92A2A" />
        <stop offset="100%" stopColor="#961616" />
      </radialGradient>
      <linearGradient id="realTomRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C92A2A" />
        <stop offset="100%" stopColor="#7A1010" />
      </linearGradient>
    </defs>
    <g transform="translate(8, 10) rotate(-12)">
      {/* 3D Outer Skin Rim */}
      <ellipse cx="60" cy="52" rx="52" ry="35" fill="url(#realTomRim)" />
      {/* Juicy Cut Top Face */}
      <ellipse cx="60" cy="46" rx="51" ry="33" fill="url(#realTomFlesh)" />
      {/* Translucent Pith Ring */}
      <ellipse
        cx="60"
        cy="46"
        rx="42"
        ry="26"
        fill="none"
        stroke="#FFA8A8"
        strokeWidth="2"
        opacity="0.45"
      />
      {/* 4 Realistic Seed Locule Chambers */}
      <path d="M26 42 Q40 24 54 39 Q38 45 26 42 Z" fill="#8A1111" opacity="0.72" />
      <path d="M66 39 Q80 24 94 42 Q82 45 66 39 Z" fill="#8A1111" opacity="0.72" />
      <path d="M28 52 Q42 68 55 53 Q40 49 28 52 Z" fill="#8A1111" opacity="0.72" />
      <path d="M65 53 Q78 68 92 52 Q80 49 65 53 Z" fill="#8A1111" opacity="0.72" />
      {/* Golden Tomato Seeds suspended in gel */}
      {[
        [38, 35, -18],
        [45, 37, -8],
        [75, 36, 15],
        [82, 38, 24],
        [40, 56, 14],
        [47, 57, 6],
        [73, 57, -12],
        [80, 55, -20],
      ].map(([cx, cy, rot], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="2.8"
          ry="1.3"
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill="#FFE066"
        />
      ))}
      {/* Wet Glossy Specular Reflections */}
      <ellipse
        cx="48"
        cy="29"
        rx="20"
        ry="5.5"
        transform="rotate(-8 48 29)"
        fill="#FFFFFF"
        opacity="0.32"
      />
      <ellipse cx="74" cy="54" rx="10" ry="3" fill="#FFFFFF" opacity="0.22" />
    </g>
  </svg>
);

/** 2. Realistic Melted Aged Cheddar Cheese Slice with warm golden sheen */
export const RealisticCheddarSliceSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 130 110"
    className={`${className} overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.26)]`}
  >
    <defs>
      <linearGradient id="realCheddarSurface" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE66D" />
        <stop offset="50%" stopColor="#FCC419" />
        <stop offset="100%" stopColor="#E67700" />
      </linearGradient>
      <linearGradient id="realCheddarEdge" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D96500" />
        <stop offset="50%" stopColor="#F08C00" />
        <stop offset="100%" stopColor="#B84A00" />
      </linearGradient>
    </defs>
    {/* 3D Thickness Edge of Melted Cheese Slice */}
    <path
      d="M14 54 L68 20 L116 50 L108 66 Q98 78 88 68 L62 88 Q52 96 44 82 L14 62 Z"
      fill="url(#realCheddarEdge)"
    />
    {/* Top Glossy Melted Cheddar Slice */}
    <path
      d="M14 48 L68 16 L116 44 L106 60 Q98 72 88 62 L62 82 Q52 90 44 76 L14 54 Z"
      fill="url(#realCheddarSurface)"
    />
    {/* Warm Specular Highlight */}
    <path
      d="M34 46 L68 24 L98 42 Q68 48 34 46 Z"
      fill="#FFF9DB"
      opacity="0.42"
    />
  </svg>
);

/** 3. Realistic Ridged Dill Pickle Coins */
export const RealisticPickleCoinsSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 125 105"
    className={`${className} overflow-visible drop-shadow-[0_12px_16px_rgba(0,0,0,0.26)]`}
  >
    <defs>
      <radialGradient id="realPickleCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E9FAC8" />
        <stop offset="62%" stopColor="#94D82D" />
        <stop offset="86%" stopColor="#5C940D" />
        <stop offset="100%" stopColor="#2B580C" />
      </radialGradient>
    </defs>
    {/* Bottom Crinkle Pickle Coin */}
    <g transform="translate(42, 36) rotate(16)">
      <ellipse cx="34" cy="26" rx="32" ry="22" fill="#234909" />
      <ellipse cx="34" cy="23" rx="30" ry="20" fill="url(#realPickleCenter)" />
      {/* Subtle crinkle ridges */}
      <path
        d="M12 20 L56 20 M10 25 L58 25 M14 30 L54 30"
        stroke="#D8F5A2"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <ellipse cx="26" cy="19" rx="3" ry="1.4" transform="rotate(-22 26 19)" fill="#F4FCE3" opacity="0.88" />
      <ellipse cx="41" cy="19" rx="3" ry="1.4" transform="rotate(22 41 19)" fill="#F4FCE3" opacity="0.88" />
      <ellipse cx="34" cy="28" rx="3" ry="1.4" fill="#F4FCE3" opacity="0.88" />
    </g>
    {/* Top Crinkle Pickle Coin */}
    <g transform="translate(8, 12) rotate(-14)">
      <ellipse cx="32" cy="24" rx="29" ry="20" fill="#234909" />
      <ellipse cx="32" cy="21" rx="27" ry="18" fill="url(#realPickleCenter)" />
      <path
        d="M12 18 L52 18 M10 23 L54 23"
        stroke="#D8F5A2"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <ellipse cx="24" cy="17" rx="2.8" ry="1.3" transform="rotate(-18 24 17)" fill="#F4FCE3" opacity="0.88" />
      <ellipse cx="38" cy="17" rx="2.8" ry="1.3" transform="rotate(18 38 17)" fill="#F4FCE3" opacity="0.88" />
      <ellipse cx="31" cy="25" rx="2.8" ry="1.3" fill="#F4FCE3" opacity="0.88" />
    </g>
  </svg>
);

/** 4. Realistic Crisp Purple/Red Onion Rings */
export const RealisticOnionRingsSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 135 110"
    className={`${className} overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.26)]`}
  >
    {/* Outer Red Onion Ring */}
    <g transform="translate(14, 18) rotate(-14)">
      <ellipse cx="48" cy="34" rx="42" ry="25" fill="none" stroke="#671D7A" strokeWidth="7.5" />
      <ellipse cx="48" cy="32" rx="40" ry="23" fill="none" stroke="#9C36B5" strokeWidth="5.5" />
      <ellipse cx="48" cy="32" rx="36" ry="20" fill="none" stroke="#F3D9FA" strokeWidth="2.8" />
      {/* Gloss highlight on ring */}
      <path
        d="M20 20 Q48 8 76 20"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
    {/* Interlocking Second Onion Ring */}
    <g transform="translate(46, 38) rotate(18)">
      <ellipse cx="38" cy="26" rx="33" ry="19" fill="none" stroke="#792391" strokeWidth="6.5" />
      <ellipse cx="38" cy="24" rx="30" ry="17" fill="none" stroke="#AE3EC9" strokeWidth="4.5" />
      <ellipse cx="38" cy="24" rx="27" ry="14" fill="none" stroke="#F8F0FC" strokeWidth="2.4" />
    </g>
  </svg>
);

/** 5. Realistic Ruffled Hydroponic Lettuce Leaf */
export const RealisticLettuceLeafSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 130 115"
    className={`${className} overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.25)]`}
  >
    <defs>
      <radialGradient id="realLettuceGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#D3F9D8" />
        <stop offset="42%" stopColor="#69DB7C" />
        <stop offset="82%" stopColor="#37B24D" />
        <stop offset="100%" stopColor="#2B8A3E" />
      </radialGradient>
    </defs>
    <path
      d="M22 78 C10 56, 18 34, 34 28 C44 14, 68 12, 82 24 C102 20, 118 38, 110 58 C118 76, 100 94, 80 88 C62 98, 34 94, 22 78 Z"
      fill="url(#realLettuceGrad)"
    />
    {/* Crisp leaf midrib & branching veins */}
    <path
      d="M26 76 Q62 54 96 36"
      stroke="#EBFBEE"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.8"
    />
    <path
      d="M52 62 Q48 42 40 32 M68 52 Q66 34 62 24 M64 56 Q82 62 94 68"
      stroke="#EBFBEE"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.65"
    />
    {/* Fresh water droplets */}
    <circle cx="54" cy="42" r="2.5" fill="#FFFFFF" opacity="0.75" />
    <circle cx="78" cy="58" r="2" fill="#FFFFFF" opacity="0.7" />
  </svg>
);

/** 6. Realistic Flame-Seared Burger Patty Medallion */
export const RealisticSearedPattySvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 130 95"
    className={`${className} overflow-visible drop-shadow-[0_16px_20px_rgba(0,0,0,0.34)]`}
  >
    <defs>
      <linearGradient id="realPattyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8D4925" />
        <stop offset="48%" stopColor="#5C2B12" />
        <stop offset="88%" stopColor="#3B1908" />
        <stop offset="100%" stopColor="#240D03" />
      </linearGradient>
    </defs>
    <g transform="translate(10, 14) rotate(-8)">
      <rect x="6" y="14" width="98" height="44" rx="22" fill="url(#realPattyGrad)" />
      <ellipse cx="55" cy="22" rx="44" ry="10" fill="#A35830" opacity="0.55" />
      {/* Cast-iron char grill marks */}
      <line x1="28" y1="16" x2="40" y2="52" stroke="#1A0902" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      <line x1="50" y1="15" x2="62" y2="53" stroke="#1A0902" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      <line x1="72" y1="16" x2="84" y2="52" stroke="#1A0902" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      {/* Melted cheese corner on patty */}
      <path d="M24 14 L62 10 L82 22 L48 30 Z" fill="#FCC419" opacity="0.92" />
    </g>
  </svg>
);

/** 7. Realistic Toasted Sesame Seed Bun Crown Accent */
export const RealisticSesameBunSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 130 95"
    className={`${className} overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.28)]`}
  >
    <defs>
      <radialGradient id="realBunCrown" cx="45%" cy="32%" r="62%">
        <stop offset="0%" stopColor="#FFE094" />
        <stop offset="48%" stopColor="#E89225" />
        <stop offset="88%" stopColor="#B85A0C" />
        <stop offset="100%" stopColor="#8C3E05" />
      </radialGradient>
    </defs>
    <g transform="translate(8, 12) rotate(10)">
      <ellipse cx="56" cy="54" rx="46" ry="11" fill="#F3C677" />
      <path d="M10 53 C10 14, 102 14, 102 53 C86 60, 26 60, 10 53 Z" fill="url(#realBunCrown)" />
      <path d="M26 32 C44 18, 72 18, 86 30 C70 23, 42 23, 26 32 Z" fill="#FFF9DB" opacity="0.38" />
      {[
        [36, 32, -14],
        [54, 26, 10],
        [72, 32, 18],
        [44, 42, 6],
        [64, 41, -12],
        [80, 43, 14],
      ].map(([cx, cy, rot], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="3.8"
          ry="1.8"
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill="#FFF3BF"
        />
      ))}
    </g>
  </svg>
);

/** 8. Realistic Chargrilled Shawarma / Tikka Chicken Strips (For Rolls & Wraps) */
export const RealisticGrilledChickenStripsSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 135 110"
    className={`${className} overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.28)]`}
  >
    <defs>
      <linearGradient id="grilledStripGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD43B" />
        <stop offset="52%" stopColor="#E67700" />
        <stop offset="100%" stopColor="#9C3600" />
      </linearGradient>
    </defs>
    {/* Fresh coriander leaf behind */}
    <path d="M68 18 Q96 6 108 26 Q94 48 66 40 Z" fill="#40C057" />
    <path d="M72 28 Q88 22 102 24" stroke="#B2F2BB" strokeWidth="1.5" fill="none" />
    {/* First Roasted Chicken Strip */}
    <g transform="translate(14, 28) rotate(-14)">
      <rect x="0" y="0" width="76" height="28" rx="13" fill="url(#grilledStripGrad)" />
      <rect x="5" y="4" width="64" height="16" rx="8" fill="#FCC419" opacity="0.45" />
      <line x1="18" y1="3" x2="26" y2="25" stroke="#5C1D00" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <line x1="38" y1="3" x2="46" y2="25" stroke="#5C1D00" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <line x1="58" y1="3" x2="64" y2="25" stroke="#5C1D00" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
    </g>
    {/* Second Roasted Chicken Strip */}
    <g transform="translate(34, 54) rotate(12)">
      <rect x="0" y="0" width="72" height="26" rx="12" fill="url(#grilledStripGrad)" />
      <line x1="16" y1="3" x2="24" y2="23" stroke="#5C1D00" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <line x1="36" y1="3" x2="44" y2="23" stroke="#5C1D00" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <line x1="54" y1="3" x2="60" y2="23" stroke="#5C1D00" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
    </g>
  </svg>
);

/** 9. Realistic Cup-and-Char Pepperoni & Basil Cluster (For Pizzas) */
export const RealisticPepperoniSliceSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 125 110"
    className={`${className} overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.28)]`}
  >
    <defs>
      <radialGradient id="pepperoniCup" cx="42%" cy="38%" r="58%">
        <stop offset="0%" stopColor="#FA5252" />
        <stop offset="65%" stopColor="#C92A2A" />
        <stop offset="92%" stopColor="#861414" />
        <stop offset="100%" stopColor="#5C0B0B" />
      </radialGradient>
    </defs>
    {/* Sweet Basil Leaf tucked behind */}
    <g transform="translate(56, 12) rotate(18)">
      <path d="M4 30 Q20 2 52 10 Q42 40 12 38 Z" fill="#37B24D" />
      <path d="M8 29 Q26 18 46 12" stroke="#B2F2BB" strokeWidth="1.8" fill="none" opacity="0.75" />
    </g>
    {/* Cup-and-Char Pepperoni Coin */}
    <g transform="translate(12, 22) rotate(-12)">
      <ellipse cx="42" cy="36" rx="36" ry="27" fill="#4A0808" />
      <ellipse cx="42" cy="32" rx="34" ry="25" fill="url(#pepperoniCup)" />
      {/* Pepperoni marbling flecks */}
      <circle cx="28" cy="26" r="3" fill="#FFC9C9" opacity="0.65" />
      <circle cx="48" cy="22" r="2.5" fill="#FFC9C9" opacity="0.6" />
      <circle cx="54" cy="36" r="3.2" fill="#FFC9C9" opacity="0.65" />
      <circle cx="34" cy="40" r="2.4" fill="#FFC9C9" opacity="0.6" />
      <ellipse cx="34" cy="20" rx="14" ry="4" transform="rotate(-10 34 20)" fill="#FFFFFF" opacity="0.22" />
    </g>
  </svg>
);

/** 10. Realistic Sweet Basil, Black Olives, Cherry Tomato & Mozzarella Burst (For Pizza) */
export const RealisticBasilClusterSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 240 160"
    className={`${className} overflow-visible drop-shadow-[0_16px_20px_rgba(0,0,0,0.26)]`}
  >
    {/* Sliced Kalamata Black Olive Ring 1 */}
    <g transform="translate(42, 16) rotate(-22)">
      <circle cx="18" cy="18" r="15" fill="#212529" />
      <circle cx="18" cy="18" r="6" fill="#FCC419" />
      <ellipse cx="13" cy="12" rx="5" ry="2.5" transform="rotate(-20 13 12)" fill="#ADB5BD" opacity="0.55" />
    </g>
    {/* Sliced Kalamata Black Olive Ring 2 */}
    <g transform="translate(150, 42) rotate(18)">
      <circle cx="16" cy="16" r="14" fill="#212529" />
      <circle cx="16" cy="16" r="5.5" fill="#FCC419" />
    </g>
    {/* Fresh Genovese Basil Leaf 1 */}
    <g transform="translate(82, 32) rotate(-16)">
      <path d="M4 28 Q18 2 48 10 Q38 38 10 36 Z" fill="#37B24D" />
      <path d="M7 27 Q24 16 42 12" stroke="#B2F2BB" strokeWidth="1.8" fill="none" opacity="0.75" />
    </g>
    {/* Fresh Bell Pepper Strip */}
    <g transform="translate(18, 72) rotate(-32)">
      <path
        d="M6 22 Q24 4 48 16"
        fill="none"
        stroke="#2B8A3E"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M8 20 Q24 6 46 16"
        fill="none"
        stroke="#69DB7C"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
    {/* Fior di Latte Mozzarella Medallion */}
    <g transform="translate(115, 74) rotate(10)">
      <ellipse cx="22" cy="18" rx="20" ry="15" fill="#FFF9DB" />
      <ellipse cx="18" cy="14" rx="10" ry="6" fill="#FFFFFF" opacity="0.8" />
    </g>
    {/* Crisp Red Onion Ring */}
    <g transform="translate(175, 78) rotate(-14)">
      <ellipse cx="26" cy="18" rx="22" ry="13" fill="none" stroke="#9C36B5" strokeWidth="5" />
      <ellipse cx="26" cy="18" rx="19" ry="10.5" fill="none" stroke="#F3D9FA" strokeWidth="2" />
    </g>
  </svg>
);

export const FloatingIngredients: React.FC<FloatingIngredientsProps> = React.memo(({
  activeSlide,
  mouseOffset,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Top-left large studio romaine lettuce leaf coordinates smoothly with the centerpiece
  const lettuceTransformBySlide: Record<
    SlideId,
    { top: string; left: string; rotate: number; scale: number }
  > = {
    burger: { top: '8%', left: '15%', rotate: -22, scale: 1 },
    roll: { top: '12%', left: '17%', rotate: -10, scale: 0.96 },
    pizza: { top: '9%', left: '16%', rotate: -26, scale: 0.98 },
  };

  const currentLettuce = lettuceTransformBySlide[activeSlide];

  // Shared fast, smooth cubic-bezier transition so burger and ingredients move simultaneously (0ms delay)
  const simultaneousTransition = {
    duration: shouldReduceMotion ? 0.01 : 0.42,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Persistent Top-Left Signature Studio Romaine Lettuce Leaf (animates simultaneously at t=0) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.55, x: 70, y: 60, rotate: -45 }}
        animate={{
          opacity: 1,
          top: currentLettuce.top,
          left: currentLettuce.left,
          rotate: currentLettuce.rotate,
          scale: currentLettuce.scale,
          x: mouseOffset.x * -16,
          y: mouseOffset.y * -16,
        }}
        transition={simultaneousTransition}
        className="absolute z-15 w-28 sm:w-40 md:w-48 lg:w-52 aspect-square will-change-transform"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -7, 0],
                  rotate: [0, 2.2, 0],
                }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full"
        >
          <TransparentFoodImage
            src={lettuceImgUrl}
            alt="Fresh green romaine lettuce leaf"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Slide-Specific Realistic Ingredients — popLayout with 0ms delay so they animate SIMULTANEOUSLY with the main food */}
      <AnimatePresence mode="popLayout">
        {activeSlide === 'burger' && (
          <motion.div
            key="burger-garnishes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* 1. Ridged Dill Pickle Coins (Mid-Left) — launches simultaneously with burger */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: 110, y: -10, rotate: -30 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 14,
                y: mouseOffset.y * 14,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: 70, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[12%] sm:left-[19%] top-[52%] z-25 w-16 sm:w-22 md:w-26 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticPickleCoinsSvg />
              </motion.div>
            </motion.div>

            {/* 2. Melted Aged Cheddar Cheese Slice (Bottom-Left below 'B') — launches simultaneously */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: 120, y: -55, rotate: 24 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * -14,
                y: mouseOffset.y * -12,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: 75, y: -35, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[10%] sm:left-[16%] bottom-[20%] sm:bottom-[23%] z-25 w-20 sm:w-26 md:w-30 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 6, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticCheddarSliceSvg />
              </motion.div>
            </motion.div>

            {/* 3. Crisp Purple Onion Rings (Top-Right above 'G'/'E') — launches simultaneously */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: -95, y: 75, rotate: -28 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 16,
                y: mouseOffset.y * -14,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: -60, y: 45, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute right-[22%] sm:right-[27%] top-[14%] sm:top-[16%] z-25 w-18 sm:w-24 md:w-28 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticOnionRingsSvg />
              </motion.div>
            </motion.div>

            {/* 4. Realistic Juicy Heirloom Tomato Slice (Right over 'E'/'R') — launches simultaneously */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: -125, y: 15, rotate: 28 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * -20,
                y: mouseOffset.y * 16,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: -80, rotate: 20, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute right-[9%] sm:right-[16%] top-[41%] sm:top-[43%] z-25 w-24 sm:w-32 md:w-36 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticTomatoSliceSvg />
              </motion.div>
            </motion.div>

            {/* 5. Fresh Ruffled Romaine Leaf & Sesame Bun Accent (Bottom-Right near burger base) — launches simultaneously */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: -75, y: -65, rotate: -22 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 14,
                y: mouseOffset.y * 12,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, y: -40, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[56%] sm:left-[58%] bottom-[18%] sm:bottom-[20%] z-25 w-16 sm:w-20 md:w-24 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 5, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticLettuceLeafSvg />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {activeSlide === 'roll' && (
          <motion.div
            key="roll-garnishes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* 1. Crisp Purple Onion Rings (Mid-Left below lettuce) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: 95, y: 15, rotate: -20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 14,
                y: mouseOffset.y * 12,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: 60, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[15%] sm:left-[21%] top-[48%] z-25 w-16 sm:w-22 md:w-24 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticOnionRingsSvg />
              </motion.div>
            </motion.div>

            {/* 2. Chargrilled Shawarma / Tikka Chicken Strips (Bottom-Left of roll) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: 90, y: -50, rotate: 18 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * -16,
                y: mouseOffset.y * 14,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: 55, y: -30, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[20%] sm:left-[27%] bottom-[24%] sm:bottom-[26%] z-25 w-20 sm:w-26 md:w-28 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 6, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticGrilledChickenStripsSvg />
              </motion.div>
            </motion.div>

            {/* 3. Realistic Sliced Tomato (Right over 'L') */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: -105, y: 12, rotate: -22 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * -18,
                y: mouseOffset.y * -14,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: -65, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute right-[11%] sm:right-[19%] top-[44%] sm:top-[46%] z-25 w-20 sm:w-26 md:w-30 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticTomatoSliceSvg />
              </motion.div>
            </motion.div>

            {/* 4. Tangy Pickled Cucumber Coins & Fresh Greens (Bottom-Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: -75, y: -55, rotate: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 16,
                y: mouseOffset.y * 16,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: -45, y: -35, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[54%] sm:left-[57%] bottom-[19%] sm:bottom-[22%] z-25 w-18 sm:w-24 md:w-28 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 6, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticPickleCoinsSvg />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {activeSlide === 'pizza' && (
          <motion.div
            key="pizza-garnishes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* 1. Crispy Cup-and-Char Pepperoni & Basil Leaf (Upper-Left near 'P') */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: 85, y: 45, rotate: -24 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 15,
                y: mouseOffset.y * -14,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: 55, y: 30, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[19%] sm:left-[24%] top-[32%] sm:top-[34%] z-25 w-16 sm:w-22 md:w-26 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticPepperoniSliceSvg />
              </motion.div>
            </motion.div>

            {/* 2. Melted Cheese Slice & Herbs (Bottom-Left below 'P') */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: 95, y: -40, rotate: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * -14,
                y: mouseOffset.y * 16,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: 65, y: -30, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[14%] sm:left-[20%] bottom-[22%] sm:bottom-[24%] z-25 w-18 sm:w-24 md:w-28 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, 7, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticCheddarSliceSvg />
              </motion.div>
            </motion.div>

            {/* 3. Levitating Black Olives, Sweet Basil, Capsicum & Mozzarella Burst above Pizza */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 65 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * -18,
                y: mouseOffset.y * -18,
              }}
              exit={{ opacity: 0, scale: 0.5, y: 45, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute left-[44%] sm:left-[47%] top-[14%] sm:top-[16%] z-25 w-44 sm:w-56 md:w-64 will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 2.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticBasilClusterSvg />
              </motion.div>
            </motion.div>

            {/* 4. Realistic Juicy Tomato Slice (Right over 'A') */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45, x: -95, y: 15, rotate: 22 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mouseOffset.x * 18,
                y: mouseOffset.y * 14,
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 0.5, x: -60, transition: { duration: 0.25 } }}
              transition={simultaneousTransition}
              className="absolute right-[12%] sm:right-[19%] top-[46%] sm:top-[48%] z-25 w-20 sm:w-26 md:w-30 aspect-square will-change-transform"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RealisticTomatoSliceSvg />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
