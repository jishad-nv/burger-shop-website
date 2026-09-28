import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Play, Sparkles, Utensils, ShoppingBag } from 'lucide-react';
import { FoodProduct } from '../types/food';

interface CinematicWrapAnimationProps {
  featuredWrap: FoodProduct;
  onAddToCart: (product: FoodProduct) => void;
  onViewDetails: (product: FoodProduct) => void;
}

const WRAP_STAGES = [
  { step: 1, label: 'Toasted Tortilla Base' },
  { step: 2, label: 'Greens & Chicken Drop' },
  { step: 3, label: 'Signature Sauce Drizzle' },
  { step: 4, label: 'Side Flaps Fold Inward' },
  { step: 5, label: 'Tight Chargrilled Roll' },
  { step: 6, label: 'Diagonal Chef Cut' },
];

export const CinematicWrapAnimation: React.FC<CinematicWrapAnimationProps> = ({
  featuredWrap,
  onAddToCart,
  onViewDetails,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const [playKey, setPlayKey] = useState<number>(0);
  const [stage, setStage] = useState<number>(1);

  useEffect(() => {
    if (!isInView) return;

    setStage(1);
    const timers = [
      setTimeout(() => setStage(2), 240),
      setTimeout(() => setStage(3), 520),
      setTimeout(() => setStage(4), 820),
      setTimeout(() => setStage(5), 1140),
      setTimeout(() => setStage(6), 1520),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView, playKey]);

  const handleReplay = () => {
    setPlayKey((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#121F06] via-[#1B2F08] to-[#0E1804] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-4 sm:p-10 lg:p-12 my-8 sm:my-10"
    >
      {/* Lime-Green Ambient Studio Glow matching the Hero Roll Slide */}
      <div
        className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, #B8F238 0%, #89D716 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
        {/* Left Column: Stage Choreography & Controls */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-white">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#89D716]/20 border border-[#89D716]/45 text-[#B8F238] text-[11px] sm:text-xs font-extrabold uppercase tracking-widest">
            <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Hand-Rolled To Order</span>
          </div>

          <div>
            <h3 className="font-display-hero text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight sm:leading-[0.92]">
              THE ART OF THE PERFECT ROLL
            </h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-white/75 leading-relaxed">
              From a warm blistered flatbread loaded with brazier-roasted chicken tenders and crisp greens, drizzled with garlic-mint crema, folded inward, rolled tight, and sliced diagonally.
            </p>
          </div>

          {/* 6-Step Choreography Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WRAP_STAGES.map((item) => {
              const isDone = stage >= item.step;
              const isCurrent = stage === item.step;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setStage(item.step)}
                  className={`px-3 py-2 rounded-xl border text-left transition-all duration-180 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#89D716] border-[#ECFF9E] text-black shadow-md scale-[1.02]'
                      : isDone
                      ? 'bg-white/10 border-white/20 text-white/90 hover:bg-white/15'
                      : 'bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                    Step 0{item.step}
                  </span>
                  <span className="text-xs font-bold leading-tight block truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Replay Control */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all duration-150 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#B8F238]" />
              <span>Replay Wrap Prep &amp; Cut (2.5s)</span>
            </button>

            <span className="text-xs text-white/55">
              Click any step above to inspect that stage
            </span>
          </div>

          {/* Order CTA */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onAddToCart(featuredWrap)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#89D716] hover:bg-[#9BE825] text-black font-extrabold text-xs sm:text-sm shadow-[0_10px_25px_rgba(137,215,22,0.35)] transition-all duration-180 hover:scale-103 active:scale-97 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order {featuredWrap.name} — ₹{featuredWrap.price}</span>
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(featuredWrap)}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all duration-180 cursor-pointer"
            >
              View Wrap Details
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Tortilla Folding, Rolling & Diagonal Cut Stage */}
        <div className="lg:col-span-7 relative h-[360px] sm:h-[460px] flex items-center justify-center select-none overflow-hidden sm:overflow-visible">
          <div
            key={playKey}
            className="relative w-[290px] xs:w-[340px] sm:w-[420px] h-[290px] xs:h-[340px] sm:h-[400px] flex items-center justify-center"
          >
            <svg
              viewBox="0 0 420 380"
              className="w-full h-full overflow-visible drop-shadow-[0_24px_38px_rgba(0,0,0,0.5)]"
            >
              <defs>
                <radialGradient id="tortillaFlat" cx="48%" cy="45%" r="52%">
                  <stop offset="0%" stopColor="#FFF3BF" />
                  <stop offset="65%" stopColor="#F3CA7A" />
                  <stop offset="92%" stopColor="#D99B43" />
                  <stop offset="100%" stopColor="#B87624" />
                </radialGradient>

                <linearGradient id="tortillaFoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D99B43" />
                  <stop offset="50%" stopColor="#FFE8A3" />
                  <stop offset="100%" stopColor="#C8842E" />
                </linearGradient>

                <linearGradient id="tortillaRolled" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFEAA7" />
                  <stop offset="55%" stopColor="#E5AB55" />
                  <stop offset="100%" stopColor="#A66315" />
                </linearGradient>
              </defs>

              {/* ================= STAGES 1 TO 4: OPEN / FOLDING TORTILLA ================= */}
              {stage < 5 && (
                <g>
                  {/* Step 1: Flat Char-Marked Tortilla landing on prep surface */}
                  <motion.g
                    initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 19 }}
                    style={{ originX: '210px', originY: '190px' }}
                  >
                    <circle cx="210" cy="190" r="145" fill="url(#tortillaFlat)" />
                    {/* Toasted Tortilla Blister Spots */}
                    <ellipse cx="145" cy="115" rx="14" ry="7" transform="rotate(-18 145 115)" fill="#8A4B0F" opacity="0.35" />
                    <ellipse cx="265" cy="125" rx="12" ry="6" transform="rotate(22 265 125)" fill="#8A4B0F" opacity="0.35" />
                    <ellipse cx="135" cy="255" rx="15" ry="7" transform="rotate(14 135 255)" fill="#8A4B0F" opacity="0.35" />
                    <ellipse cx="275" cy="245" rx="13" ry="6" transform="rotate(-20 275 245)" fill="#8A4B0F" opacity="0.35" />
                  </motion.g>

                  {/* Step 2: Fresh Romaine Lettuce, Veggies & Chargrilled Chicken Dropping onto Tortilla */}
                  {stage >= 2 && (
                    <motion.g
                      initial={{ y: -85, scale: 1.25, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 230, damping: 18 }}
                    >
                      {/* Bed of Crisp Romaine Lettuce down the center */}
                      <path
                        d="M150 95 Q180 75, 215 92 T270 98 Q290 140, 275 190 T270 280 Q230 300, 190 285 T145 275 Q130 220, 148 175 Z"
                        fill="#40C057"
                      />
                      <path
                        d="M162 110 Q200 95, 245 112 T258 265 Q215 280, 165 262 Z"
                        fill="#69DB7C"
                        opacity="0.75"
                      />

                      {/* Julienned Red Tomatoes, Pickled Radish & Carrots */}
                      <circle cx="178" cy="135" r="13" fill="#FA5252" />
                      <circle cx="242" cy="165" r="14" fill="#FA5252" />
                      <circle cx="182" cy="235" r="13" fill="#FA5252" />
                      <ellipse cx="235" cy="128" rx="12" ry="9" fill="#E64980" />
                      <ellipse cx="172" cy="188" rx="12" ry="9" fill="#E64980" />
                      <ellipse cx="238" cy="238" rx="12" ry="9" fill="#E64980" />

                      {/* Golden Brazier-Roasted Chicken Strips */}
                      {[
                        [185, 118, -8],
                        [212, 148, 6],
                        [190, 182, -5],
                        [216, 212, 9],
                        [192, 246, -6],
                      ].map(([x, y, rot], i) => (
                        <g key={i} transform={`translate(${x}, ${y}) rotate(${rot})`}>
                          <rect x="-26" y="-12" width="56" height="24" rx="11" fill="#D97706" />
                          <rect x="-22" y="-8" width="48" height="15" rx="7" fill="#F59F00" />
                          <line x1="-12" y1="-8" x2="-6" y2="8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                          <line x1="6" y1="-8" x2="12" y2="8" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                        </g>
                      ))}
                    </motion.g>
                  )}

                  {/* Step 3: Smooth Sinusoidal Sauce Drizzle Motion */}
                  {stage >= 3 && (
                    <g>
                      {/* Garlic-Herb Crema Drizzle */}
                      <motion.path
                        d="M165 115 Q245 130, 170 155 T250 195 T170 235 T245 268"
                        fill="none"
                        stroke="#FFF9DB"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="420"
                        initial={{ strokeDashoffset: 420 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.38, ease: 'easeInOut' }}
                      />
                      {/* Zesty Chipotle/Mint Swirl */}
                      <motion.path
                        d="M245 118 Q165 140, 245 168 T168 212 T245 255"
                        fill="none"
                        stroke="#FF6B35"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="400"
                        initial={{ strokeDashoffset: 400 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 0.38, delay: 0.06, ease: 'easeInOut' }}
                      />
                    </g>
                  )}

                  {/* Step 4: Left and Right Sides of the Wrap Folding Inward */}
                  {stage >= 4 && (
                    <g>
                      {/* Left Tortilla Flap Folding Inward */}
                      <motion.path
                        d="M65 190 C65 110, 125 60, 195 60 C180 130, 180 250, 195 320 C125 320, 65 270, 65 190 Z"
                        fill="url(#tortillaFoldGrad)"
                        initial={{ x: -95, scaleX: 0.3, opacity: 0 }}
                        animate={{ x: 0, scaleX: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        style={{ filter: 'drop-shadow(8px 0 12px rgba(0,0,0,0.32))' }}
                      />
                      {/* Right Tortilla Flap Folding Inward */}
                      <motion.path
                        d="M355 190 C355 110, 295 60, 225 60 C240 130, 240 250, 225 320 C295 320, 355 270, 355 190 Z"
                        fill="url(#tortillaFoldGrad)"
                        initial={{ x: 95, scaleX: 0.3, opacity: 0 }}
                        animate={{ x: 0, scaleX: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.06 }}
                        style={{ filter: 'drop-shadow(-8px 0 12px rgba(0,0,0,0.32))' }}
                      />
                    </g>
                  )}
                </g>
              )}

              {/* ================= STAGE 5: TIGHTLY ROLLED CYLINDER WRAP ================= */}
              {stage === 5 && (
                <motion.g
                  initial={{ scaleY: 0.45, y: 60, opacity: 0, rotate: 0 }}
                  animate={{ scaleY: 1, y: 0, opacity: 1, rotate: -22 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 19 }}
                  style={{ originX: '210px', originY: '190px' }}
                >
                  {/* Rolled Burrito/Wrap Cylinder */}
                  <rect
                    x="135"
                    y="55"
                    width="150"
                    height="270"
                    rx="65"
                    fill="url(#tortillaRolled)"
                  />
                  {/* Panini / Brazier Grill Marks on Rolled Wrap */}
                  <line x1="155" y1="105" x2="265" y2="125" stroke="#78350F" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
                  <line x1="150" y1="155" x2="270" y2="175" stroke="#78350F" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
                  <line x1="150" y1="205" x2="270" y2="225" stroke="#78350F" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
                  <line x1="155" y1="255" x2="265" y2="275" stroke="#78350F" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
                </motion.g>
              )}

              {/* ================= STAGE 6: DIAGONAL CUT REVEALING LAYERED FILLING ================= */}
              {stage >= 6 && (
                <g>
                  {/* Chef Knife Slash Flash Line */}
                  <motion.line
                    x1="95"
                    y1="285"
                    x2="325"
                    y2="95"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    initial={{ opacity: 1, pathLength: 0 }}
                    animate={{ opacity: 0, pathLength: 1 }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* LEFT HALF OF CUT WRAP (Tilts outward to reveal colorful inside filling) */}
                  <motion.g
                    initial={{ x: 0, y: 0, rotate: -20 }}
                    animate={{ x: -52, y: 18, rotate: -28 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    style={{ originX: '180px', originY: '210px' }}
                  >
                    {/* Tortilla Body */}
                    <path
                      d="M125 140 L235 110 L235 275 C235 315, 125 315, 125 275 Z"
                      fill="url(#tortillaRolled)"
                    />
                    {/* Grill Marks */}
                    <line x1="140" y1="195" x2="220" y2="210" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" opacity="0.45" />
                    <line x1="140" y1="240" x2="220" y2="255" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" opacity="0.45" />

                    {/* Diagonal Cross-Section Cut Face Revealing Fillings! */}
                    <ellipse
                      cx="180"
                      cy="125"
                      rx="57"
                      ry="26"
                      transform="rotate(-15 180 125)"
                      fill="#FFF3BF"
                      stroke="#D99B43"
                      strokeWidth="5"
                    />
                    {/* Inside Filling Layers: Lettuce, Crispy Chicken, Tomato, Radish, Crema */}
                    <ellipse
                      cx="180"
                      cy="125"
                      rx="48"
                      ry="20"
                      transform="rotate(-15 180 125)"
                      fill="#40C057"
                    />
                    <ellipse cx="165" cy="126" rx="18" ry="10" transform="rotate(-15 165 126)" fill="#E67700" />
                    <ellipse cx="195" cy="120" rx="16" ry="9" transform="rotate(-15 195 120)" fill="#F59F00" />
                    <circle cx="178" cy="132" r="7" fill="#FA5252" />
                    <circle cx="192" cy="128" r="6" fill="#E64980" />
                    <path d="M158 124 Q180 116, 202 124" stroke="#FFF9DB" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </motion.g>

                  {/* RIGHT HALF OF CUT WRAP (Tilts outward to reveal colorful inside filling) */}
                  <motion.g
                    initial={{ x: 0, y: 0, rotate: -20 }}
                    animate={{ x: 54, y: -16, rotate: -12 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    style={{ originX: '240px', originY: '180px' }}
                  >
                    {/* Tortilla Body */}
                    <path
                      d="M175 155 L285 125 L285 285 C285 325, 175 325, 175 285 Z"
                      fill="url(#tortillaRolled)"
                    />
                    {/* Grill Marks */}
                    <line x1="190" y1="210" x2="270" y2="225" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" opacity="0.45" />
                    <line x1="190" y1="255" x2="270" y2="270" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" opacity="0.45" />

                    {/* Diagonal Cross-Section Cut Face Revealing Fillings! */}
                    <ellipse
                      cx="230"
                      cy="140"
                      rx="57"
                      ry="26"
                      transform="rotate(-15 230 140)"
                      fill="#FFF3BF"
                      stroke="#D99B43"
                      strokeWidth="5"
                    />
                    <ellipse
                      cx="230"
                      cy="140"
                      rx="48"
                      ry="20"
                      transform="rotate(-15 230 140)"
                      fill="#40C057"
                    />
                    <ellipse cx="215" cy="142" rx="18" ry="10" transform="rotate(-15 215 142)" fill="#E67700" />
                    <ellipse cx="245" cy="135" rx="16" ry="9" transform="rotate(-15 245 135)" fill="#F59F00" />
                    <circle cx="228" cy="147" r="7" fill="#FA5252" />
                    <circle cx="242" cy="142" r="6" fill="#E64980" />
                    <path d="M208 139 Q230 131, 252 139" stroke="#FFF9DB" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </motion.g>
                </g>
              )}
            </svg>

            {stage >= 6 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute bottom-2 right-2 px-3.5 py-1.5 rounded-full bg-[#89D716] text-black text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagonal Cut &amp; Ready!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
