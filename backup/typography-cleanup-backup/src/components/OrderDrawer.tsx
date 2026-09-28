import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
} from 'lucide-react';
import { CartItem, PromoCodeDefinition } from '../types/food';
import { VALID_PROMO_CODES } from '../data/menuData';
import { TransparentFoodImage } from './TransparentFoodImage';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedPromo: PromoCodeDefinition | null;
  onApplyPromo: (promo: PromoCodeDefinition | null) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 49;

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  appliedPromo,
  onApplyPromo,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [promoInput, setPromoInput] = useState(appliedPromo?.code || '');
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    if (appliedPromo) {
      setPromoInput(appliedPromo.code);
      setPromoError(null);
    }
  }, [appliedPromo]);

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Calculate Promo Discount
  const discountAmount = React.useMemo(() => {
    if (!appliedPromo || subtotal <= 0) return 0;
    if (appliedPromo.type === 'percent') {
      return Math.round((subtotal * appliedPromo.value) / 100);
    }
    return Math.min(subtotal, appliedPromo.value);
  }, [appliedPromo, subtotal]);

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const deliveryFee =
    subtotal > 0 ? (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE) : 0;
  const total = discountedSubtotal + deliveryFee;

  const handleApplyPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = promoInput.trim().toUpperCase();
    if (!normalized) {
      setPromoError('Please enter a promo code');
      return;
    }
    const matched = VALID_PROMO_CODES[normalized];
    if (matched) {
      onApplyPromo(matched);
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try WELCOME10, SAVE20, or FLAT50');
    }
  };

  const handleSelectQuickPromo = (codeKey: string) => {
    const matched = VALID_PROMO_CODES[codeKey];
    if (matched) {
      setPromoInput(matched.code);
      onApplyPromo(matched);
      setPromoError(null);
    }
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoInput('');
    setPromoError(null);
  };

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      onApplyPromo(null);
      setPromoInput('');
      setOrderPlaced(false);
      onClose();
    }, 2100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            aria-label="Shopping Cart and Checkout"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#111111] text-white shadow-2xl flex flex-col justify-between p-6 sm:p-7 border-l border-white/10"
          >
            <div className="flex flex-col flex-1 min-h-0">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EF3E36] flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight">Your Shopping Cart</h2>
                    <p className="text-[11px] text-white/55">
                      {cart.reduce((s, i) => s + i.quantity, 0)} items selected
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close shopping cart"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Delivery Progress Bar */}
              {subtotal > 0 && !orderPlaced && (
                <div className="mt-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/80 flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#FCC419]" />
                      {subtotal >= FREE_DELIVERY_THRESHOLD
                        ? 'You unlocked FREE Express Delivery!'
                        : `Add ₹${FREE_DELIVERY_THRESHOLD - subtotal} more for FREE Delivery`}
                    </span>
                    <span className="text-[11px] font-bold text-[#FCC419] tabular-nums">
                      {Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F59F00] to-[#82C91E] transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {orderPlaced ? (
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="my-auto py-16 text-center flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-[#82C91E]/20 flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-10 h-10 text-[#82C91E]" />
                  </div>
                  <h3 className="text-2xl font-extrabold">Order Confirmed!</h3>
                  <p className="text-sm text-white/70 max-w-xs leading-relaxed">
                    Our chefs are preparing your fresh meal right now. Your order will arrive hot in ~18 mins!
                  </p>
                </motion.div>
              ) : cart.length === 0 ? (
                <div className="my-auto py-16 text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-white/90">Your cart is empty</p>
                  <p className="text-xs text-white/55 max-w-[240px]">
                    Explore our Burgers, Pizza, Rolls &amp; Wraps, and Drinks to start your order.
                  </p>
                </div>
              ) : (
                <div className="mt-3.5 space-y-2.5 overflow-y-auto pr-1 flex-1">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.cartItemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                          <TransparentFoodImage
                            src={item.product.image}
                            alt={item.product.name}
                            enhance={false}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">
                            {item.product.name}
                          </h4>
                          {item.selectedSize && (
                            <p className="text-[11px] text-white/65 font-medium">
                              Size: {item.selectedSize.label}
                              {item.selectedSize.diameter ? ` (${item.selectedSize.diameter})` : ''}
                            </p>
                          )}
                          {item.selectedAddons.length > 0 && (
                            <p className="text-[10px] text-white/50 truncate max-w-[175px]">
                              + {item.selectedAddons.map((a) => a.label).join(', ')}
                            </p>
                          )}
                          <p className="text-xs font-extrabold text-[#FCC419] mt-1 tabular-nums">
                            ₹{item.unitPrice * item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          aria-label={`Decrease ${item.product.name} quantity`}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          aria-label={`Increase ${item.product.name} quantity`}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          aria-label={`Remove ${item.product.name} from cart`}
                          className="w-7 h-7 rounded-full text-white/45 hover:text-[#EF3E36] hover:bg-[#EF3E36]/15 flex items-center justify-center transition-colors duration-150 cursor-pointer ml-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && !orderPlaced && (
              <div className="pt-3.5 mt-3.5 border-t border-white/10 space-y-3">
                {/* Promo Code Input & Quick-Select Buttons */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/75 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#FCC419]" />
                      Promo Code
                    </span>
                    <div className="flex items-center gap-1">
                      {Object.values(VALID_PROMO_CODES).map((p) => {
                        const isCurrent = appliedPromo?.code === p.code;
                        return (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => handleSelectQuickPromo(p.code)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-colors duration-150 cursor-pointer ${
                              isCurrent
                                ? 'bg-[#82C91E] text-black'
                                : 'bg-white/10 hover:bg-white/20 text-white/80'
                            }`}
                          >
                            {p.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {appliedPromo ? (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#82C91E]/15 border border-[#82C91E]/40">
                      <div className="flex items-center gap-2 min-w-0">
                        <Check className="w-4 h-4 text-[#82C91E] shrink-0 stroke-[2.5]" />
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-[#82C91E] block">
                            {appliedPromo.code} Applied (-₹{discountAmount})
                          </span>
                          <span className="text-[10px] text-white/70 block truncate">
                            {appliedPromo.description}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[11px] font-bold text-white/70 hover:text-white underline cursor-pointer shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromoSubmit} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          if (promoError) setPromoError(null);
                        }}
                        placeholder="Enter WELCOME10, SAVE20, FLAT50"
                        className="flex-1 bg-black/50 border border-white/15 focus:border-[#FCC419] rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-white/40 uppercase focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#FCC419] hover:bg-[#F59F00] text-black font-extrabold text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {promoError && (
                    <p className="text-[11px] text-[#FF6B6B] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoError}</span>
                    </p>
                  )}
                </div>

                {/* Order Bill Summary */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-white/65">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-semibold text-white/90">
                      ₹{subtotal}
                    </span>
                  </div>

                  {discountAmount > 0 && appliedPromo && (
                    <div className="flex items-center justify-between text-[#82C91E]">
                      <span>Promo Discount ({appliedPromo.code})</span>
                      <span className="tabular-nums font-bold">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-white/65">
                    <span>Express Delivery</span>
                    <span className="tabular-nums font-semibold text-[#82C91E]">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                    <span className="font-bold text-white">Total Payable</span>
                    <span className="text-lg font-extrabold text-[#FCC419] tabular-nums">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Clear & Checkout Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs font-bold transition-colors duration-150 cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#F59F00] to-[#EF3E36] hover:brightness-110 text-white font-extrabold text-sm shadow-[0_8px_24px_rgba(239,62,54,0.4)] transition-all duration-150 active:scale-98 cursor-pointer whitespace-nowrap"
                  >
                    Checkout · ₹{total}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
