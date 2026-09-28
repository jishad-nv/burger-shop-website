import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShoppingBag, Eye, Flame, Clock, Star, Check } from 'lucide-react';
import { FoodProduct, ProductSizeOption } from '../types/food';
import { TransparentFoodImage } from './TransparentFoodImage';
import {
  RealisticTomatoSliceSvg,
  RealisticCheddarSliceSvg,
  RealisticOnionRingsSvg,
  RealisticPickleCoinsSvg,
  RealisticLettuceLeafSvg,
  RealisticPepperoniSliceSvg,
  RealisticGrilledChickenStripsSvg,
} from './FloatingIngredients';

interface ProductCardProps {
  product: FoodProduct;
  index: number;
  accentColor?: string;
  onAddToCart: (product: FoodProduct, selectedSize?: ProductSizeOption) => void;
  onViewDetails: (product: FoodProduct, initialSize?: ProductSizeOption) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  index,
  accentColor = '#E58619',
  onAddToCart,
  onViewDetails,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const defaultSize =
    product.sizes && product.sizes.length > 0
      ? product.sizes.find((s) => s.priceDelta === 0) || product.sizes[0]
      : undefined;

  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(defaultSize);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const currentPrice = product.price + (selectedSize ? selectedSize.priceDelta : 0);
  const currentOriginalPrice = product.originalPrice
    ? product.originalPrice + (selectedSize ? selectedSize.priceDelta : 0)
    : undefined;

  const isOutOfStock =
    product.isAvailable === false ||
    (product.stockQuantity !== undefined && product.stockQuantity <= 0);
  const isLowStock =
    !isOutOfStock &&
    product.stockQuantity !== undefined &&
    product.stockQuantity <= (product.lowStockThreshold ?? 5);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 950);
  };

  return (
    <motion.article
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.34,
        delay: shouldReduceMotion ? 0 : (index % 6) * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product, selectedSize)}
      style={{
        borderColor: isHovered ? `${accentColor}55` : 'rgba(0,0,0,0.07)',
      }}
      className="group relative bg-white rounded-[1.75rem] border shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.13)] hover:-translate-y-1 transition-all duration-180 ease-out flex flex-col justify-between overflow-hidden cursor-pointer will-change-transform"
    >
      {/* Top Image Stage with Smooth Radial Backdrop */}
      <div>
        <div
          className="relative h-56 sm:h-60 w-full flex items-center justify-center overflow-hidden p-5 transition-colors duration-300"
          style={{
            background:
              product.stageGradient ||
              `radial-gradient(circle at 50% 50%, ${accentColor}38 0%, ${accentColor}14 65%, #FFF9F0 100%)`,
          }}
        >
          {/* Soft Center Stage Glow (180ms hover response) */}
          <div className="pointer-events-none absolute w-44 h-44 rounded-full bg-white/45 blur-2xl transition-transform duration-180 ease-out group-hover:scale-115" />

          {/* Top-Left Single Status Tag + Spicy Indicator */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5">
            {product.badge && (
              <span
                className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-normal text-white shadow-xs whitespace-nowrap transition-colors duration-300"
                style={{ backgroundColor: accentColor }}
              >
                {product.badge}
              </span>
            )}
            {product.isSpicy && (
              <span className="px-2.5 py-1 rounded-full bg-[#E03131] text-white text-[11px] sm:text-xs font-semibold tracking-normal flex items-center gap-1 shadow-xs whitespace-nowrap">
                <Flame className="w-3 h-3 fill-current" />
                Spicy
              </span>
            )}
          </div>

          {/* Top-Right Rating & Veg/Non-Veg Indicator */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5">
            <span
              title={product.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
              className={`w-5 h-5 rounded-md bg-white/95 shadow-xs flex items-center justify-center border ${
                product.isVeg ? 'border-[#2B8A3E]' : 'border-[#C92A2A]'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.isVeg ? 'bg-[#2B8A3E]' : 'bg-[#C92A2A]'
                }`}
              />
            </span>

            <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 tabular-nums">
              <Star className="w-3 h-3 text-[#FCC419] fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Realistic Culinary Ingredients Floating Around the Main Food Item (Simultaneous 180ms Hover Coordination) */}
          <RealisticCardIngredients
            category={product.category}
            garnishType={product.garnishType}
          />

          {/* Studio Cutout Food Image with Smooth 180ms Hover Zoom & Subtle Elevation */}
          <div
            className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 flex flex-col items-center justify-center transition-transform duration-180 ease-out group-hover:scale-107 group-hover:-translate-y-1 will-change-transform"
            style={{
              transform: `rotate(${product.dishRotation || 0}deg)`,
              filter: product.dishFilter || 'none',
            }}
          >
            <TransparentFoodImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {/* Realistic Contact Shadow that responds to hover lift */}
            <div className="w-28 h-3.5 rounded-full bg-black/32 blur-md -mt-2 transition-all duration-180 ease-out group-hover:w-24 group-hover:opacity-55" />
          </div>

          {/* Bottom Metadata Text */}
          <div className="absolute bottom-2.5 left-4 right-4 z-20 flex items-center justify-between text-xs font-semibold text-black/80">
            <span className="flex items-center gap-1.5 bg-white/85 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
              <Clock
                className="w-3 h-3 transition-colors duration-300"
                style={{ color: accentColor }}
              />
              <span>{product.prepTime}</span>
              <span aria-hidden="true">·</span>
              <span>{product.calories}</span>
            </span>
            {isOutOfStock ? (
              <span className="px-2.5 py-0.5 rounded-md bg-[#E03131] text-white text-[11px] font-bold">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-0.5 rounded-md bg-[#F59F00] text-black text-[11px] font-bold tabular-nums">
                Only {product.stockQuantity} left
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Body Copy */}
        <div className="p-5 sm:p-6 pb-3">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-[18px] sm:text-[20px] font-bold text-[#141414] transition-colors duration-180 leading-[1.3] tracking-tight"
              style={{ color: isHovered ? accentColor : '#141414' }}
            >
              {product.name}
            </h3>
            <div className="text-right shrink-0">
              <span className="text-lg sm:text-[20px] font-extrabold text-[#141414] tabular-nums block leading-tight">
                ₹{currentPrice}
              </span>
              {currentOriginalPrice && (
                <span className="text-xs text-black/45 line-through tabular-nums block mt-0.5">
                  ₹{currentOriginalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-black/65 line-clamp-2 leading-[1.55] font-normal">
            {product.shortDescription}
          </p>

          {/* Interactive Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div
              className="mt-3.5 pt-3 border-t border-black/[0.06]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-1.5">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border whitespace-nowrap truncate ${
                        isSelected
                          ? 'bg-[#141414] text-white border-[#141414] shadow-xs'
                          : 'bg-black/[0.03] text-black/70 border-transparent hover:bg-black/[0.07]'
                      }`}
                    >
                      <span>{size.label}</span>
                      {size.diameter && (
                        <span className="ml-1 opacity-75">{size.diameter}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions: View Details + Add to Cart */}
      <div
        className="px-5 sm:px-6 pb-5 pt-2 flex items-center gap-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onViewDetails(product, selectedSize)}
          className="flex-1 py-2.5 px-3.5 rounded-full border border-black/15 hover:border-black text-[#141414] font-semibold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all duration-150 hover:bg-black/[0.04] active:scale-97 cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span>View Details</span>
        </button>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          style={
            !justAdded && !isOutOfStock
              ? { backgroundColor: isHovered ? accentColor : '#141414' }
              : undefined
          }
          className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all duration-180 shadow-xs whitespace-nowrap ${
            isOutOfStock
              ? 'bg-black/20 text-black/50 cursor-not-allowed'
              : justAdded
              ? 'bg-[#82C91E] text-black cursor-pointer active:scale-97'
              : 'text-white cursor-pointer active:scale-97'
          }`}
        >
          {isOutOfStock ? (
            <span>Out of Stock</span>
          ) : justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
});

/**
 * Renders 100% realistic floating food ingredients around the product card cutout
 * that belong strictly to the food category (Burgers, Pizzas, Rolls & Wraps) and
 * smoothly coordinate their movement (180ms) when hovering over the card.
 */
const RealisticCardIngredients: React.FC<{
  category: FoodProduct['category'];
  garnishType?: FoodProduct['garnishType'];
}> = React.memo(({ category, garnishType }) => {
  if (category === 'pizza') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-5">
        <div className="absolute top-10 left-4 w-11 h-11 opacity-90 transition-transform duration-180 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1 group-hover:-rotate-12">
          <RealisticPepperoniSliceSvg />
        </div>
        <div className="absolute bottom-8 right-4 w-12 h-12 opacity-90 transition-transform duration-180 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1 group-hover:rotate-12">
          {garnishType === 'margherita' || garnishType === 'farmhouse' ? (
            <RealisticTomatoSliceSvg />
          ) : (
            <RealisticOnionRingsSvg />
          )}
        </div>
      </div>
    );
  }

  if (category === 'rolls') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-5">
        <div className="absolute top-10 left-4 w-11 h-11 opacity-90 transition-transform duration-180 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1 group-hover:-rotate-10">
          {garnishType === 'veg' ? (
            <RealisticLettuceLeafSvg />
          ) : (
            <RealisticGrilledChickenStripsSvg />
          )}
        </div>
        <div className="absolute bottom-8 right-4 w-11 h-11 opacity-90 transition-transform duration-180 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1 group-hover:rotate-10">
          <RealisticOnionRingsSvg />
        </div>
      </div>
    );
  }

  if (category === 'drinks') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-5">
        <div className="absolute top-10 left-4 w-10 h-10 opacity-90 transition-transform duration-180 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1 group-hover:-rotate-12">
          <RealisticLettuceLeafSvg />
        </div>
        <div className="absolute bottom-8 right-4 w-10 h-10 opacity-90 transition-transform duration-180 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1 group-hover:rotate-12">
          {garnishType === 'drink-berry' ? (
            <RealisticTomatoSliceSvg />
          ) : (
            <RealisticCheddarSliceSvg />
          )}
        </div>
      </div>
    );
  }

  // Default: Burgers (Strictly realistic burger ingredients: lettuce, tomato, cheese, pickles, onion)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-5">
      <div className="absolute top-10 left-4 w-11 h-11 opacity-90 transition-transform duration-180 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1 group-hover:-rotate-12">
        {garnishType === 'spicy' || garnishType === 'zinger' ? (
          <RealisticTomatoSliceSvg />
        ) : (
          <RealisticLettuceLeafSvg />
        )}
      </div>
      <div className="absolute bottom-8 right-4 w-11 h-11 opacity-90 transition-transform duration-180 ease-out group-hover:translate-x-1.5 group-hover:translate-y-1 group-hover:rotate-12">
        {garnishType === 'paneer' || garnishType === 'classic' ? (
          <RealisticCheddarSliceSvg />
        ) : (
          <RealisticPickleCoinsSvg />
        )}
      </div>
    </div>
  );
});
