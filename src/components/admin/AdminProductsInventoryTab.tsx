import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { FoodCategoryId, FoodProduct } from '../../types/food';
import {
  useBackend,
  SaveProductInput,
  STUDIO_IMAGE_PRESETS,
} from '../../context/BackendContext';
import { TransparentFoodImage } from '../TransparentFoodImage';

const CATEGORY_OPTIONS: { id: FoodCategoryId; label: string }[] = [
  { id: 'burgers', label: 'Burgers' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'rolls', label: 'Rolls & Wraps' },
  { id: 'drinks', label: 'Drinks' },
];

export function compressUploadedImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 480;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = String(ev.target?.result || '');
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const AdminProductsInventoryTab: React.FC = () => {
  const {
    products,
    saveProduct,
    deleteProduct,
    updateProductStock,
  } = useBackend();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | FoodCategoryId>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingModalOpen, setEditingModalOpen] = useState<boolean>(false);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formState, setFormState] = useState<SaveProductInput>({
    id: '',
    name: '',
    category: 'burgers',
    shortDescription: '',
    fullDescription: '',
    price: 149,
    originalPrice: 179,
    image: STUDIO_IMAGE_PRESETS[0].url,
    isVeg: false,
    isSpicy: false,
    badge: 'Bestseller',
    isFeatured: true,
    isAvailable: true,
    stockQuantity: 25,
    lowStockThreshold: 5,
    prepTime: '12 min',
    calories: '540 kcal',
    rating: 4.8,
  });

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (p) => (p.stockQuantity ?? 25) <= (p.lowStockThreshold ?? 5)
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      const stock = p.stockQuantity ?? 25;
      const threshold = p.lowStockThreshold ?? 5;
      if (stockFilter === 'OUT' && stock > 0 && p.isAvailable !== false) return false;
      if (stockFilter === 'LOW' && (stock <= 0 || stock > threshold)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, stockFilter, searchQuery]);

  const openAddModal = () => {
    setIsNewProduct(true);
    setFormState({
      id: `item-${Date.now()}`,
      name: '',
      category: categoryFilter === 'ALL' ? 'burgers' : categoryFilter,
      shortDescription: '',
      fullDescription: '',
      price: 149,
      originalPrice: 179,
      image: STUDIO_IMAGE_PRESETS[0].url,
      isVeg: false,
      isSpicy: false,
      badge: 'New Arrival',
      isFeatured: false,
      isAvailable: true,
      stockQuantity: 25,
      lowStockThreshold: 5,
      prepTime: '12 min',
      calories: '520 kcal',
      rating: 4.8,
    });
    setEditingModalOpen(true);
  };

  const openEditModal = (prod: FoodProduct) => {
    setIsNewProduct(false);
    setFormState({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      price: prod.price,
      originalPrice: prod.originalPrice ?? prod.price + 30,
      image: prod.image,
      isVeg: Boolean(prod.isVeg),
      isSpicy: Boolean(prod.isSpicy),
      badge: prod.badge || '',
      isFeatured: Boolean(prod.isFeatured ?? prod.badge),
      isAvailable: Boolean(prod.isAvailable ?? true),
      stockQuantity: prod.stockQuantity ?? 25,
      lowStockThreshold: prod.lowStockThreshold ?? 5,
      prepTime: prod.prepTime || '12 min',
      calories: prod.calories || '520 kcal',
      rating: prod.rating || 4.8,
    });
    setEditingModalOpen(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;
    setSaving(true);
    try {
      await saveProduct(formState, isNewProduct);
      setEditingModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressUploadedImageFile(file);
      setFormState((prev) => ({ ...prev, image: dataUrl }));
    } catch {
      // Ignore upload error
    }
  };

  return (
    <div className="space-y-6">
      {/* Low-Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/35 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                Inventory Alert: {lowStockProducts.length} product(s) are Low Stock or Out of Stock
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {lowStockProducts
                  .slice(0, 5)
                  .map((p) => `${p.name} (${p.stockQuantity ?? 0} left)`)
                  .join(' · ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStockFilter(stockFilter === 'LOW' ? 'ALL' : 'LOW')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold whitespace-nowrap cursor-pointer self-start sm:self-auto"
          >
            {stockFilter === 'LOW' ? 'Show All Products' : 'Filter Low Stock'}
          </button>
        </div>
      )}

      {/* Top Filter & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-[#F59F00] text-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({products.length})
            </button>
            {CATEGORY_OPTIONS.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat.id
                      ? 'bg-[#F59F00] text-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Stock Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'ALL', label: 'All Stock' },
              { id: 'LOW', label: 'Low Stock' },
              { id: 'OUT', label: 'Out of Stock' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStockFilter(st.id as 'ALL' | 'LOW' | 'OUT')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  stockFilter === st.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Add Product CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-[#F59F00] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products & Inventory Data Grid */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 bg-slate-900/50">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4">Stock Quantity</th>
                <th className="py-3 px-4">Inventory Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {filteredProducts.map((prod) => {
                const stock = prod.stockQuantity ?? 25;
                const threshold = prod.lowStockThreshold ?? 5;
                const isOut = stock <= 0 || prod.isAvailable === false;
                const isLow = !isOut && stock <= threshold;

                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Product Image & Name */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 p-1.5 flex items-center justify-center shrink-0 border border-slate-800">
                          <TransparentFoodImage
                            src={prod.image}
                            alt={prod.name}
                            enhance={false}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 max-w-[240px]">
                          <p className="font-semibold text-white truncate">{prod.name}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {prod.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 align-middle whitespace-nowrap capitalize text-slate-300">
                      {prod.category === 'rolls' ? 'Rolls & Wraps' : prod.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 align-middle text-right whitespace-nowrap font-mono tabular-nums">
                      <span className="font-bold text-[#FCC419]">₹{prod.price}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-xs text-slate-500 line-through block">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </td>

                    {/* Live Stock Stepper & Manual Input */}
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700">
                        <button
                          type="button"
                          onClick={() =>
                            updateProductStock(prod.id, Math.max(0, stock - 1))
                          }
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={10000}
                          aria-label={`Stock quantity for ${prod.name}`}
                          value={stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!Number.isNaN(val)) {
                              updateProductStock(prod.id, val);
                            }
                          }}
                          className="w-14 text-center bg-transparent font-mono font-bold text-white text-xs focus:outline-none tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => updateProductStock(prod.id, stock + 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1 font-mono tabular-nums">
                        Low alert ≤ {threshold}
                      </span>
                    </td>

                    {/* Availability Status Toggle */}
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          updateProductStock(
                            prod.id,
                            isOut && stock === 0 ? 15 : stock,
                            threshold,
                            isOut
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                          isOut
                            ? 'bg-red-500/15 text-red-300 border-red-500/40'
                            : isLow
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {isOut ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Out of Stock</span>
                          </>
                        ) : isLow ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Low Stock ({stock})</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock ({stock})</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured / Bestseller Toggle */}
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          saveProduct(
                            {
                              id: prod.id,
                              name: prod.name,
                              category: prod.category,
                              shortDescription: prod.shortDescription,
                              fullDescription: prod.fullDescription,
                              price: prod.price,
                              originalPrice: prod.originalPrice ?? 0,
                              image: prod.image,
                              isVeg: Boolean(prod.isVeg),
                              isSpicy: Boolean(prod.isSpicy),
                              badge: !prod.isFeatured
                                ? prod.badge || 'Bestseller'
                                : prod.badge || '',
                              isFeatured: !prod.isFeatured,
                              isAvailable: prod.isAvailable ?? true,
                              stockQuantity: stock,
                              lowStockThreshold: threshold,
                              prepTime: prod.prepTime,
                              calories: prod.calories,
                              rating: prod.rating,
                            },
                            false
                          )
                        }
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                          prod.isFeatured
                            ? 'bg-amber-500/15 text-[#FCC419] border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            prod.isFeatured ? 'fill-current text-[#FCC419]' : ''
                          }`}
                        />
                        <span>{prod.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {confirmDeleteId === prod.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteProduct(prod.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(prod.id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {editingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg sm:text-xl font-bold">
                {isNewProduct ? 'Add New Food Product' : `Edit ${formState.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Double Peri-Peri Burger"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        category: e.target.value as FoodCategoryId,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100000}
                    value={formState.price}
                    onChange={(e) =>
                      setFormState({ ...formState, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={formState.originalPrice}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={10000}
                    value={formState.stockQuantity}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        stockQuantity: Number(e.target.value),
                        isAvailable: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Low-Stock Alert ≤
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={formState.lowStockThreshold}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        lowStockThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  maxLength={300}
                  value={formState.shortDescription}
                  onChange={(e) =>
                    setFormState({ ...formState, shortDescription: e.target.value })
                  }
                  placeholder="Concise appetizing summary shown on the product card..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={2}
                  maxLength={800}
                  value={formState.fullDescription}
                  onChange={(e) =>
                    setFormState({ ...formState, fullDescription: e.target.value })
                  }
                  placeholder="Detailed culinary description shown in the product modal..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                />
              </div>

              {/* Image Upload / Studio Presets */}
              <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Product Image (Studio Preset, Upload File, or URL)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-[#FCC419] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={formState.image}
                  onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                  placeholder="Image URL or select a preset below..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-[#F59F00] focus:outline-none"
                />

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                  {STUDIO_IMAGE_PRESETS.map((preset) => {
                    const selected = formState.image === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setFormState({ ...formState, image: preset.url })}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          selected
                            ? 'bg-amber-500/20 border-[#F59F00]'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="w-10 h-10 mx-auto flex items-center justify-center">
                          <TransparentFoodImage
                            src={preset.url}
                            alt={preset.label}
                            enhance={false}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-slate-300 block truncate mt-1">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Badges & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={formState.badge}
                    onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                    placeholder="e.g. Bestseller"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={formState.prepTime}
                    onChange={(e) =>
                      setFormState({ ...formState, prepTime: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Calories
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={formState.calories}
                    onChange={(e) =>
                      setFormState({ ...formState, calories: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isAvailable}
                    onChange={(e) =>
                      setFormState({ ...formState, isAvailable: e.target.checked })
                    }
                    className="rounded accent-[#F59F00]"
                  />
                  <span>Available for Ordering</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured}
                    onChange={(e) =>
                      setFormState({ ...formState, isFeatured: e.target.checked })
                    }
                    className="rounded accent-[#F59F00]"
                  />
                  <span>Featured / Bestseller</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isVeg}
                    onChange={(e) =>
                      setFormState({ ...formState, isVeg: e.target.checked })
                    }
                    className="rounded accent-emerald-500"
                  />
                  <span>Pure Veg</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isSpicy}
                    onChange={(e) =>
                      setFormState({ ...formState, isSpicy: e.target.checked })
                    }
                    className="rounded accent-red-500"
                  />
                  <span>Spicy</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : isNewProduct ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
