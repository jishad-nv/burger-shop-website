import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Flame, Play, Sparkles, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { FoodProduct } from '../types/food';

interface CinematicPizzaAnimationProps {
  featuredPizza: FoodProduct;
  onAddToCart: (product: FoodProduct) => void;
  onViewDetails: (product: FoodProduct) => void;
}

const PIZZA_STAGES = [
  { step: 1, label: 'Artisan Dough Spin' },
  { step: 2, label: 'San Marzano Sauce Spread' },
  { step: 3, label: 'Mozzarella Sprinkle' },
  { step: 4, label: 'Fresh Toppings Drop' },
  { step: 5, label: '900°F Wood-Fired Bake' },
  { step: 6, label: 'Rotary Slice & Cheese Pull' },
];

export const CinematicPizzaAnimation: React.FC<CinematicPizzaAnimationProps> = ({
  featuredPizza,
  onAddToCart,
  onViewDetails,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const [playKey, setPlayKey] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [slicePulled, setSlicePulled] = useState<boolean>(false);

  useEffect(() => {
    if (!isInView) return;

    setCurrentStage(1);
    setSlicePulled(false);

    const timers = [
      setTimeout(() => setCurrentStage(2), 240),
      setTimeout(() => setCurrentStage(3), 500),
      setTimeout(() => setCurrentStage(4), 760),
      setTimeout(() => setCurrentStage(5), 1060),
      setTimeout(() => setCurrentStage(6), 1360),
      setTimeout(() => setSlicePulled(true), 1650),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView, playKey]);

  const handleReplay = () => {
    setPlayKey((prev) => prev + 1);
  };

  // Coordinates of toppings across the main pizza body (excluding the top-right wedge 0° to -60° so the pulled wedge has its own toppings)
  const mainPieToppings = [
    { type: 'olive', cx: 145, cy: 135, delay: 1.18 },
    { type: 'olive', cx: 125, cy: 215, delay: 1.22 },
    { type: 'olive', cx: 215, cy: 255, delay: 1.26 },
    { type: 'olive', cx: 255, cy: 205, delay: 1.3 },
    { type: 'mushroom', cx: 165, cy: 175, delay: 1.2 },
    { type: 'mushroom', cx: 140, cy: 250, delay: 1.25 },
    { type: 'mushroom', cx: 230, cy: 220, delay: 1.29 },
    { type: 'pepper', cx: 118, cy: 175, delay: 1.23 },
    { type: 'pepper', cx: 185, cy: 265, delay: 1.27 },
    { type: 'pepper', cx: 180, cy: 120, delay: 1.31 },
    { type: 'onion', cx: 150, cy: 205, delay: 1.24 },
    { type: 'onion', cx: 210, cy: 195, delay: 1.28 },
    { type: 'basil', cx: 168, cy: 230, delay: 1.32 },
    { type: 'basil', cx: 135, cy: 155, delay: 1.35 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#231006] via-[#311608] to-[#190B04] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-6 sm:p-10 lg:p-12 my-10"
    >
      {/* Dynamic Wood-Fired Oven Ambient Glow */}
      <motion.div
        animate={{
          opacity: currentStage >= 5 ? [0.45, 0.7, 0.5] : 0.25,
          scale: currentStage >= 5 ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background:
            currentStage >= 5
              ? 'radial-gradient(circle, #FF6B35 0%, #EC7A24 45%, transparent 75%)'
              : 'radial-gradient(circle, #F7A361 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Stage Progress & Controls */}
        <div className="lg:col-span-5 space-y-6 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EC7A24]/25 border border-[#EC7A24]/45 text-[#FFA94D] text-xs font-extrabold uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5" />
            <span>900°F Wood-Fired Craft</span>
          </div>

          <div>
            <h3 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-[0.92]">
              FROM DOUGH TO CHEESE PULL
            </h3>
            <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
              Watch our 48-hour fermented dough spin out, swirl with crushed San Marzano tomatoes, rain down fresh mozzarella and toppings, blister in the brick oven, and slice with a molten cheese pull.
            </p>
          </div>

          {/* 6-Step Live Choreography Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PIZZA_STAGES.map((item) => {
              const isDone = currentStage >= item.step;
              const isCurrent = currentStage === item.step;
              return (
                <div
                  key={item.step}
                  className={`px-3 py-2 rounded-xl border text-left transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#EC7A24] border-[#FFA94D] text-white shadow-md scale-[1.02]'
                      : isDone
                      ? 'bg-white/10 border-white/20 text-white/90'
                      : 'bg-white/[0.03] border-white/5 text-white/40'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                    Step 0{item.step}
                  </span>
                  <span className="text-xs font-bold leading-tight block truncate">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Replay & Slice Pull Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all duration-150 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#FFA94D]" />
              <span>Replay Oven &amp; Slice (2.6s)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStage(6);
                setSlicePulled((prev) => !prev);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EC7A24]/25 hover:bg-[#EC7A24]/40 text-[#FFD8A8] text-xs font-bold border border-[#EC7A24]/40 transition-all duration-150 cursor-pointer"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{slicePulled ? 'Return Slice' : 'Pull Hot Slice'}</span>
            </button>
          </div>

          {/* Order CTA */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onAddToCart(featuredPizza)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EC7A24] to-[#EF3E36] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-[0_10px_25px_rgba(236,122,36,0.4)] transition-all duration-180 hover:scale-103 active:scale-97 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order {featuredPizza.name} — ₹{featuredPizza.price}</span>
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(featuredPizza)}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all duration-180 cursor-pointer"
            >
              Select Pizza Size
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Pizza Making, Slicing & Cheese-Pull Stage */}
        <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] flex items-center justify-center select-none">
          <div
            key={playKey}
            className="relative w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] flex items-center justify-center"
          >
            {/* Oven Flame Ring Flash during Stage 5 */}
            <AnimatePresence>
              {currentStage === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1.08 }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.38 }}
                  className="pointer-events-none absolute inset-0 rounded-full border-4 border-[#FF6B35] shadow-[0_0_60px_#FF6B35] z-30"
                />
              )}
            </AnimatePresence>

            {/* Subtle Rising Steam Wisps once baked (Stage >= 5) */}
            {currentStage >= 5 && (
              <div className="pointer-events-none absolute -top-6 inset-x-0 flex justify-center gap-10 z-40">
                {[0, 1, 2].map((i) => (
                  <motion.svg
                    key={i}
                    viewBox="0 0 40 90"
                    className="w-8 h-20 text-white/35 overflow-visible"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: [0, 0.55, 0],
                      y: [10, -28, -55],
                      x: [0, i % 2 === 0 ? 6 : -6, 0],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeInOut',
                    }}
                  >
                    <path
                      d="M20 80 Q8 55, 22 38 T18 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                ))}
              </div>
            )}

            {/* Main SVG Pizza Canvas */}
            <svg
              viewBox="0 0 380 380"
              className="w-full h-full overflow-visible drop-shadow-[0_24px_38px_rgba(0,0,0,0.55)]"
            >
              <defs>
                <radialGradient id="doughCrust" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE8B5" />
                  <stop offset="78%" stopColor="#F3B861" />
                  <stop offset="92%" stopColor={currentStage >= 5 ? '#C96A1B' : '#E59F42'} />
                  <stop offset="100%" stopColor={currentStage >= 5 ? '#8A3E06' : '#C87D28'} />
                </radialGradient>

                <radialGradient id="tomatoSauce" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F03E3E" />
                  <stop offset="75%" stopColor="#C92A2A" />
                  <stop offset="100%" stopColor="#961616" />
                </radialGradient>

                <radialGradient id="meltedMozz" cx="45%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#FFF9DB" />
                  <stop offset="65%" stopColor="#FFE066" />
                  <stop offset="100%" stopColor="#F59F00" />
                </radialGradient>

                {/* Clip path for the 7/8 remaining pizza body (excluding top-right slice from -60° to 0°) */}
                <clipPath id="mainPieClip">
                  <path d="M190 190 L265 40 L20 20 L20 360 L360 360 L360 190 Z" />
                </clipPath>

                {/* Clip path for the single lifted hero slice (top-right wedge from -60° to 0°) */}
                <clipPath id="heroSliceClip">
                  <path d="M190 190 L265 40 L360 40 L360 190 Z" />
                </clipPath>
              </defs>

              {/* ================= 7/8 MAIN PIZZA BODY ================= */}
              <g clipPath={currentStage >= 6 ? 'url(#mainPieClip)' : undefined}>
                {/* Step 1: Stretched Artisan Dough Base */}
                <motion.g
                  initial={{ scale: 0, rotate: -140, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 210, damping: 19 }}
                  style={{ originX: '190px', originY: '190px' }}
                >
                  <circle cx="190" cy="190" r="142" fill="url(#doughCrust)" />
                  {/* Oven blister spots on crust */}
                  {currentStage >= 5 && (
                    <g opacity="0.55">
                      <circle cx="190" cy="56" r="5" fill="#4A1D03" />
                      <circle cx="88" cy="102" r="6" fill="#4A1D03" />
                      <circle cx="58" cy="195" r="4.5" fill="#4A1D03" />
                      <circle cx="105" cy="292" r="6" fill="#4A1D03" />
                      <circle cx="205" cy="322" r="5" fill="#4A1D03" />
                      <circle cx="295" cy="275" r="5.5" fill="#4A1D03" />
                    </g>
                  )}
                </motion.g>

                {/* Step 2: San Marzano Tomato Sauce Swirl */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    currentStage >= 2
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ originX: '190px', originY: '190px' }}
                >
                  <circle cx="190" cy="190" r="120" fill="url(#tomatoSauce)" />
                  <path
                    d="M190 190 m-85 0 a85 85 0 1 0 170 0 a65 65 0 1 0 -130 0"
                    fill="none"
                    stroke="#A61E1E"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                </motion.g>

                {/* Step 3: Sprinkled & Melted Mozzarella Cheese */}
                <motion.g
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={
                    currentStage >= 3
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.4, opacity: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 210, damping: 18 }}
                  style={{ originX: '190px', originY: '190px' }}
                >
                  <circle cx="190" cy="190" r="112" fill="url(#meltedMozz)" />
                  {/* Fior di Latte melted pools */}
                  <circle cx="145" cy="150" r="22" fill="#FFF9DB" opacity="0.7" />
                  <circle cx="220" cy="230" r="24" fill="#FFF9DB" opacity="0.7" />
                  <circle cx="145" cy="235" r="20" fill="#FFF9DB" opacity="0.7" />
                </motion.g>

                {/* Step 4: Toppings Falling into Place */}
                {currentStage >= 4 &&
                  mainPieToppings.map((t, idx) => (
                    <motion.g
                      key={idx}
                      initial={{ y: -90, scale: 1.5, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 18,
                        delay: Math.max(0, t.delay - 1.15),
                      }}
                    >
                      {renderPizzaToppingSvg(t.type, t.cx, t.cy)}
                    </motion.g>
                  ))}
              </g>

              {/* ================= ELASTIC MELTED CHEESE-PULL STRINGS ================= */}
              {currentStage >= 6 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: slicePulled ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Stretchy golden mozzarella strands bridging the pulled wedge and main pie */}
                  <motion.path
                    d={
                      slicePulled
                        ? 'M208 165 Q235 140, 260 124 L254 134 Q230 148, 202 172 Z'
                        : 'M195 180 L205 170 Z'
                    }
                    fill="#FFE066"
                  />
                  <motion.path
                    d={
                      slicePulled
                        ? 'M228 130 Q255 112, 282 90 L278 102 Q252 120, 222 138 Z'
                        : 'M220 140 L230 130 Z'
                    }
                    fill="#FFF3BF"
                  />
                  <motion.path
                    d={
                      slicePulled
                        ? 'M225 190 Q258 175, 294 162 L290 172 Q255 184, 220 194 Z'
                        : 'M220 190 L230 190 Z'
                    }
                    fill="#FCC419"
                  />
                  <motion.path
                    d={
                      slicePulled
                        ? 'M255 190 Q285 178, 318 164 L314 171 Q282 184, 250 192 Z'
                        : 'M250 190 L260 190 Z'
                    }
                    fill="#FFF9DB"
                  />
                </motion.g>
              )}

              {/* ================= LIFTED HERO PIZZA SLICE (WITH CHEESE PULL) ================= */}
              {currentStage >= 6 && (
                <motion.g
                  clipPath="url(#heroSliceClip)"
                  initial={{ x: 0, y: 0, rotate: 0 }}
                  animate={
                    slicePulled
                      ? { x: 34, y: -26, rotate: -4 }
                      : { x: 0, y: 0, rotate: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 180, damping: 17 }}
                  style={{ originX: '190px', originY: '190px' }}
                >
                  <circle cx="190" cy="190" r="142" fill="url(#doughCrust)" />
                  <circle cx="190" cy="190" r="120" fill="url(#tomatoSauce)" />
                  <circle cx="190" cy="190" r="112" fill="url(#meltedMozz)" />
                  <circle cx="242" cy="142" r="20" fill="#FFF9DB" opacity="0.75" />
                  {/* Toppings on the pulled slice */}
                  {renderPizzaToppingSvg('olive', 235, 132)}
                  {renderPizzaToppingSvg('mushroom', 262, 155)}
                  {renderPizzaToppingSvg('pepper', 222, 162)}
                  {renderPizzaToppingSvg('basil', 252, 122)}
                  {renderPizzaToppingSvg('onion', 275, 138)}
                </motion.g>
              )}

              {/* ================= STEP 6: SLICE CUT LINES & ROTARY PIZZA CUTTER WHEEL ================= */}
              {currentStage >= 6 && (
                <g>
                  {/* 8-slice cut lines */}
                  {[0, 45, 90, 135].map((angle, i) => (
                    <motion.line
                      key={angle}
                      x1="190"
                      y1="50"
                      x2="190"
                      y2="330"
                      stroke="#5C1D00"
                      strokeWidth="2.5"
                      strokeDasharray="280"
                      initial={{ strokeDashoffset: 280, opacity: 0 }}
                      animate={{ strokeDashoffset: 0, opacity: 0.55 }}
                      transition={{ duration: 0.28, delay: i * 0.06 }}
                      transform={`rotate(${angle} 190 190)`}
                    />
                  ))}

                  {/* Animated Stainless Rotary Pizza Cutter gliding across the pie */}
                  <motion.g
                    initial={{ x: -150, y: 150, opacity: 1 }}
                    animate={{ x: 160, y: -160, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                  >
                    <circle
                      cx="190"
                      cy="190"
                      r="22"
                      fill="#E9ECEF"
                      stroke="#868E96"
                      strokeWidth="4"
                    />
                    <circle cx="190" cy="190" r="7" fill="#495057" />
                    <rect
                      x="184"
                      y="190"
                      width="12"
                      height="52"
                      rx="6"
                      transform="rotate(45 190 190)"
                      fill="#EF3E36"
                    />
                  </motion.g>
                </g>
              )}
            </svg>

            {/* Badge overlay when slice is lifted */}
            {slicePulled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-2 right-2 px-3.5 py-1.5 rounded-full bg-[#EC7A24] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hot Mozzarella Pull!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderPizzaToppingSvg(type: string, cx: number, cy: number): React.ReactNode {
  switch (type) {
    case 'olive':
      return (
        <g transform={`translate(${cx}, ${cy})`}>
          <circle cx="0" cy="0" r="9" fill="#212529" />
          <circle cx="0" cy="0" r="3.5" fill="#F59F00" />
        </g>
      );
    case 'mushroom':
      return (
        <g transform={`translate(${cx}, ${cy}) rotate(-15)`}>
          <path
            d="M-11 2 C-11 -10, 11 -10, 11 2 L5 2 L5 10 L-5 10 L-5 2 Z"
            fill="#E9ECEF"
            stroke="#ADB5BD"
            strokeWidth="1.5"
          />
        </g>
      );
    case 'pepper':
      return (
        <path
          d={`M${cx - 10} ${cy - 4} Q${cx} ${cy - 14}, ${cx + 12} ${cy - 2}`}
          fill="none"
          stroke="#2F9E44"
          strokeWidth="5"
          strokeLinecap="round"
        />
      );
    case 'onion':
      return (
        <ellipse
          cx={cx}
          cy={cy}
          rx="12"
          ry="7"
          fill="none"
          stroke="#9C36B5"
          strokeWidth="3"
        />
      );
    case 'basil':
    default:
      return (
        <g transform={`translate(${cx}, ${cy}) rotate(-25)`}>
          <path d="M-10 4 Q0 -10, 12 -2 Q4 12, -10 4 Z" fill="#37B24D" />
          <path d="M-8 3 Q2 -2, 10 -1" stroke="#B2F2BB" strokeWidth="1.2" fill="none" />
        </g>
      );
  }
}
