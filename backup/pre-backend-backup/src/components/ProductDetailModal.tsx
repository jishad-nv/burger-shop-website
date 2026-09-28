import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Star,
  Clock,
  Flame,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  FoodProduct,
  ProductAddonOption,
  ProductSizeOption,
} from '../types/food';
import { TransparentFoodImage } from './TransparentFoodImage';

interface ProductDetailModalProps {
  product: FoodProduct | null;
  initialSize?: ProductSizeOption;
  onClose: () => void;
  onAddToCartWithOptions: (
    product: FoodProduct,
    quantity: number,
    selectedSize?: ProductSizeOption,
    selectedAddons?: ProductAddonOption[]
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialSize,
  onClose,
  onAddToCartWithOptions,
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddonOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!product) return;
    const defaultSize =
      initialSize ||
      (product.sizes && product.sizes.length > 0
        ? product.sizes.find((s) => s.priceDelta === 0) || product.sizes[0]
        : undefined);
    setSelectedSize(defaultSize);
    setSelectedAddons([]);
    setQuantity(1);
  }, [product, initialSize]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const toggleAddon = (addon: ProductAddonOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const sizeDelta = selectedSize ? selectedSize.priceDelta : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + sizeDelta + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const categoryDisplayName =
    product.category === 'rolls'
      ? 'Rolls & Wraps'
      : product.category === 'pizza'
      ? 'Pizza'
      : product.category === 'drinks'
      ? 'Drinks'
      : 'Burgers';

  const handleConfirmAdd = () => {
    onAddToCartWithOptions(product, quantity, selectedSize, selectedAddons);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 18 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
            className="relative z-10 w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_32px_90px_rgba(0,0,0,0.45)] overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-transform duration-150 hover:scale-105 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Large Showcase Image Stage */}
            <div
              className="md:col-span-5 relative min-h-[260px] sm:min-h-[340px] flex flex-col items-center justify-center p-6 overflow-hidden"
              style={{
                background:
                  product.stageGradient ||
                  (product.category === 'rolls'
                    ? 'radial-gradient(circle at 50% 45%, #ECFF9E 0%, #B8F238 45%, #71C208 100%)'
                    : product.category === 'pizza'
                    ? 'radial-gradient(circle at 50% 45%, #FFE0C2 0%, #F7A361 45%, #DF6310 100%)'
                    : product.category === 'drinks'
                    ? 'radial-gradient(circle at 50% 45%, #D3F9D8 0%, #38D9A9 45%, #0CA678 100%)'
                    : 'radial-gradient(circle at 50% 45%, #FCE39D 0%, #F4AE3E 45%, #D8740A 100%)'),
              }}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[11px] sm:text-xs font-semibold tracking-normal">
                    {product.badge}
                  </span>
                )}
                {product.isSpicy && (
                  <span className="px-2.5 py-1 rounded-full bg-[#EF3E36] text-white text-[11px] sm:text-xs font-semibold tracking-normal flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    Spicy
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 rounded-full bg-white/95 text-[11px] sm:text-xs font-semibold tracking-normal flex items-center gap-1.5 ${
                    product.isVeg ? 'text-[#2B8A3E]' : 'text-[#C92A2A]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.isVeg ? 'bg-[#2B8A3E]' : 'bg-[#C92A2A]'
                    }`}
                  />
                  {product.isVeg ? 'Pure Veg' : 'Non-Veg'}
                </span>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center z-10"
                style={{ filter: product.dishFilter || 'none' }}
              >
                <TransparentFoodImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Bottom Meta Strip */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-md text-white text-xs sm:text-[13px] font-medium">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FCC419] fill-current" />
                  {product.rating.toFixed(1)} Rating
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#F59F00]" />
                  {product.prepTime}
                </span>
                <span>{product.calories}</span>
              </div>
            </div>

            {/* Right Column: Full Product Details, Customizations & Quantity Selector */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[62vh] md:max-h-[90vh]">
              <div className="space-y-5">
                <div>
                  <span className="text-xs sm:text-[13px] font-semibold tracking-normal text-[#D8740A]">
                    ZaidBites Kitchen · {categoryDisplayName}
                  </span>
                  <div className="flex items-baseline justify-between gap-3 mt-1">
                    <h2
                      id="modal-product-title"
                      className="text-2xl sm:text-[28px] font-extrabold text-[#141414] tracking-tight leading-[1.2]"
                    >
                      {product.name}
                    </h2>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#D8740A] tabular-nums shrink-0">
                      ₹{unitPrice}
                    </span>
                  </div>
                  <p className="mt-3 text-sm sm:text-[15px] text-black/70 leading-[1.6] font-normal">
                    {product.fullDescription}
                  </p>
                </div>

                {/* Key Ingredients List */}
                <div>
                  <h4 className="text-[13px] sm:text-sm font-bold tracking-normal text-[#141414]/80 mb-2.5">
                    Key Ingredients Included
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-[#FFF8EB] border border-[#F4AE3E]/35 text-[#8C4600] text-xs font-medium flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#E58619] shrink-0" />
                        <span>{ing}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Size Options */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h4 className="text-[13px] sm:text-sm font-bold tracking-normal text-[#141414]/80 mb-2.5">
                      Select Size or Portion
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize?.id === size.id;
                        return (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? 'bg-[#141414] text-white border-[#141414] shadow-md'
                                : 'bg-black/[0.03] text-[#141414] border-black/10 hover:border-black/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-[13px] font-semibold">
                                {size.label}
                              </span>
                              {size.diameter && (
                                <span className="text-xs opacity-75 font-medium">
                                  {size.diameter}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium block mt-0.5 tabular-nums ${
                                isSelected ? 'text-[#FCC419]' : 'text-black/60'
                              }`}
                            >
                              {size.priceDelta === 0
                                ? `₹${product.price} (Standard)`
                                : size.priceDelta > 0
                                ? `+₹${size.priceDelta} (₹${product.price + size.priceDelta})`
                                : `-₹${Math.abs(size.priceDelta)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Extra Add-On Customizations */}
                {product.addons && product.addons.length > 0 && (
                  <div>
                    <h4 className="text-[13px] sm:text-sm font-bold tracking-normal text-[#141414]/80 mb-2.5">
                      Customize with Extra Add-Ons (Optional)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.addons.map((addon) => {
                        const isChecked = selectedAddons.some((a) => a.id === addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => toggleAddon(addon)}
                            className={`px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all duration-150 cursor-pointer ${
                              isChecked
                                ? 'bg-[#FFF4E0] border-[#E58619] text-[#141414]'
                                : 'bg-white border-black/10 text-black/80 hover:border-black/25'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                                  isChecked
                                    ? 'bg-[#E58619] border-[#E58619] text-white'
                                    : 'border-black/25'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </span>
                              <span className="text-xs sm:text-[13px] font-medium truncate">
                                {addon.label}
                              </span>
                            </div>
                            <span className="text-xs sm:text-[13px] font-semibold text-[#D8740A] shrink-0 tabular-nums">
                              +₹{addon.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Modal Footer: Quantity Selector + Add to Cart Button */}
              <div className="pt-5 mt-6 border-t border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between sm:justify-start gap-3 bg-black/[0.04] rounded-full px-4 py-2 border border-black/10">
                  <span className="text-xs sm:text-sm font-semibold text-black/65 sm:hidden">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-full bg-white hover:bg-black hover:text-white text-black flex items-center justify-center shadow-xs transition-colors duration-150 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-full bg-white hover:bg-black hover:text-white text-black flex items-center justify-center shadow-xs transition-colors duration-150 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#141414] hover:bg-[#E58619] text-white font-semibold text-sm sm:text-[15px] flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-all duration-180 active:scale-98 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Add to Cart — ₹{totalPrice}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
