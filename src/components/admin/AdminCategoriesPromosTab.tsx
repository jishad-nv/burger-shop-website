import React, { useState } from 'react';
import {
  Edit3,
  Plus,
  Trash2,
  Tag,
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Upload,
  X,
} from 'lucide-react';
import { CategoryCardItem, PromoCodeDefinition } from '../../types/food';
import {
  useBackend,
  STUDIO_IMAGE_PRESETS,
  SavePromoInput,
  UpdateCategoryInput,
} from '../../context/BackendContext';
import { TransparentFoodImage } from '../TransparentFoodImage';
import { compressUploadedImageFile } from './AdminProductsInventoryTab';
import { BOOTSTRAPPED_ADMIN_EMAIL } from '../../firebase';

export const AdminCategoriesPromosTab: React.FC<{
  mode: 'categories' | 'promos' | 'admins';
}> = ({ mode }) => {
  const {
    allCategoriesForAdmin,
    updateCategory,
    promoCodes,
    savePromoCode,
    deletePromoCode,
    adminsList,
    addAdminAccount,
    removeAdminAccount,
  } = useBackend();

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState<UpdateCategoryInput | null>(null);
  const [savingCat, setSavingCat] = useState<boolean>(false);

  // Promo Code Modal State
  const [promoModalOpen, setPromoModalOpen] = useState<boolean>(false);
  const [isNewPromo, setIsNewPromo] = useState<boolean>(true);
  const [savingPromo, setSavingPromo] = useState<boolean>(false);
  const [promoForm, setPromoForm] = useState<SavePromoInput>({
    code: '',
    type: 'percent',
    value: 15,
    description: '15% off on your order',
    minOrderAmount: 199,
    expiryDate: '2027-12-31',
    isActive: true,
  });

  // New Admin Form State
  const [newAdminUid, setNewAdminUid] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminName, setNewAdminName] = useState<string>('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'admin' | 'manager'>(
    'admin'
  );
  const [addingAdmin, setAddingAdmin] = useState<boolean>(false);

  const openCategoryEditor = (cat: CategoryCardItem) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      tagline: cat.tagline,
      itemCount: cat.itemCount,
      image: cat.image,
      displayOrder: cat.displayOrder ?? 1,
      isEnabled: cat.isEnabled !== false,
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSavingCat(true);
    try {
      await updateCategory(editingCategory);
      setEditingCategory(null);
    } finally {
      setSavingCat(false);
    }
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;
    try {
      const dataUrl = await compressUploadedImageFile(file);
      setEditingCategory({ ...editingCategory, image: dataUrl });
    } catch {
      // Ignore error
    }
  };

  const openAddPromo = () => {
    setIsNewPromo(true);
    setPromoForm({
      code: '',
      type: 'percent',
      value: 15,
      description: '15% off on your order',
      minOrderAmount: 199,
      expiryDate: '2027-12-31',
      isActive: true,
    });
    setPromoModalOpen(true);
  };

  const openEditPromo = (promo: PromoCodeDefinition) => {
    setIsNewPromo(false);
    setPromoForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      description: promo.description,
      minOrderAmount: promo.minOrderAmount ?? 149,
      expiryDate: promo.expiryDate || '2027-12-31',
      isActive: promo.isActive !== false,
    });
    setPromoModalOpen(true);
  };

  const handleSavePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;
    setSavingPromo(true);
    try {
      await savePromoCode(promoForm, isNewPromo);
      setPromoModalOpen(false);
    } finally {
      setSavingPromo(false);
    }
  };

  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUid.trim() || !newAdminEmail.trim() || !newAdminName.trim()) return;
    setAddingAdmin(true);
    try {
      await addAdminAccount(newAdminUid, newAdminEmail, newAdminName, newAdminRole);
      setNewAdminUid('');
      setNewAdminEmail('');
      setNewAdminName('');
    } finally {
      setAddingAdmin(false);
    }
  };

  /* ==========================================================================
   * VIEW 1: CATEGORY MANAGEMENT
   * ======================================================================== */
  if (mode === 'categories') {
    return (
      <div className="space-y-6">
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F59F00]" />
              <span>Main Food Categories ({allCategoriesForAdmin.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit category titles, taglines, images, display order, or enable/disable categories on the website.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {allCategoriesForAdmin.map((cat) => {
            const enabled = cat.isEnabled !== false;
            return (
              <div
                key={cat.id}
                className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-16 h-16 rounded-2xl p-2 flex items-center justify-center shrink-0"
                    style={{ background: cat.accentGradient }}
                  >
                    <TransparentFoodImage
                      src={cat.image}
                      alt={cat.name}
                      enhance={false}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        #{cat.displayOrder ?? 1}
                      </span>
                      <h4 className="text-base font-bold text-white truncate">
                        {cat.name}
                      </h4>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          enabled
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/15 text-red-300 border-red-500/40'
                        }`}
                      >
                        {enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 truncate mt-1">{cat.tagline}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Route: <code className="text-[#FCC419]">{cat.path}</code> · {cat.itemCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      updateCategory({
                        id: cat.id,
                        name: cat.name,
                        tagline: cat.tagline,
                        itemCount: cat.itemCount,
                        image: cat.image,
                        displayOrder: cat.displayOrder ?? 1,
                        isEnabled: !enabled,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    {enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openCategoryEditor(cat)}
                    className="p-2 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold">Edit Category: {editingCategory.name}</h3>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 mt-4 text-xs sm:text-sm">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category Title *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={editingCategory.displayOrder}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          displayOrder: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category Tagline *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={editingCategory.tagline}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, tagline: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subtitle / Item Count Label
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={editingCategory.itemCount}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, itemCount: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>

                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Category Image</span>
                    <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-xs text-[#FCC419] cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {STUDIO_IMAGE_PRESETS.slice(0, 8).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setEditingCategory({ ...editingCategory, image: preset.url })
                        }
                        className={`p-1.5 rounded-lg border cursor-pointer ${
                          editingCategory.image === preset.url
                            ? 'bg-amber-500/20 border-[#F59F00]'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="w-10 h-10 mx-auto">
                          <TransparentFoodImage
                            src={preset.url}
                            alt={preset.label}
                            enhance={false}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isEnabled}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        isEnabled: e.target.checked,
                      })
                    }
                    className="rounded accent-[#F59F00]"
                  />
                  <span>Category Enabled on Website</span>
                </label>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCat}
                    className="px-5 py-2 rounded-lg bg-[#F59F00] text-black font-bold cursor-pointer"
                  >
                    {savingCat ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ==========================================================================
   * VIEW 2: PROMO CODE MANAGEMENT
   * ======================================================================== */
  if (mode === 'promos') {
    return (
      <div className="space-y-6">
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#F59F00]" />
              <span>Promo Codes &amp; Checkout Discounts ({promoCodes.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create and manage discount codes. Active codes work immediately inside the customer shopping cart.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddPromo}
            className="px-4 py-2 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Promo Code</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoCodes.map((promo) => {
            const active = promo.isActive !== false;
            return (
              <div
                key={promo.code}
                className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[#FCC419] text-black font-mono font-bold text-xs">
                      {promo.code}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        savePromoCode(
                          {
                            code: promo.code,
                            type: promo.type,
                            value: promo.value,
                            description: promo.description,
                            minOrderAmount: promo.minOrderAmount ?? 0,
                            expiryDate: promo.expiryDate || '2027-12-31',
                            isActive: !active,
                          },
                          false
                        )
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer ${
                        active
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/15 text-red-300 border-red-500/40'
                      }`}
                    >
                      {active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-lg font-bold text-white mt-3 font-mono tabular-nums">
                    {promo.type === 'percent'
                      ? `${promo.value}% OFF`
                      : `₹${promo.value} FLAT OFF`}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">{promo.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                    <span>Min Order: ₹{promo.minOrderAmount ?? 0}</span>
                    <span>Expires: {promo.expiryDate || '2027-12-31'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => openEditPromo(promo)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePromoCode(promo.code)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer"
                    title="Delete Promo Code"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create / Edit Promo Modal */}
        {promoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold">
                  {isNewPromo ? 'Create Promo Code' : `Edit ${promoForm.code}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePromoSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Promo Code Name (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isNewPromo}
                    maxLength={30}
                    value={promoForm.code}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''),
                      })
                    }
                    placeholder="e.g. ZAID25"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-[#F59F00] focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={promoForm.type}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          type: e.target.value as 'percent' | 'flat',
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={promoForm.type === 'percent' ? 90 : 5000}
                      value={promoForm.value}
                      onChange={(e) =>
                        setPromoForm({ ...promoForm, value: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Minimum Order (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100000}
                      value={promoForm.minOrderAmount}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          minOrderAmount: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:border-[#F59F00] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={promoForm.expiryDate}
                      onChange={(e) =>
                        setPromoForm({ ...promoForm, expiryDate: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-[#F59F00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={promoForm.description}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, description: e.target.value })
                    }
                    placeholder="e.g. 15% off on orders above ₹199"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-[#F59F00] focus:outline-none"
                  />
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoForm.isActive}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, isActive: e.target.checked })
                    }
                    className="rounded accent-[#F59F00]"
                  />
                  <span>Promo Code Active</span>
                </label>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPromoModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPromo}
                    className="px-5 py-2 rounded-lg bg-[#F59F00] text-black font-bold cursor-pointer"
                  >
                    {savingPromo ? 'Saving...' : 'Save Promo Code'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ==========================================================================
   * VIEW 3: ADMIN ACCOUNTS & RBAC MANAGEMENT
   * ======================================================================== */
  return (
    <div className="space-y-6">
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 space-y-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F59F00]" />
          <span>Authorized Administrators &amp; Access Control</span>
        </h3>
        <p className="text-xs text-slate-400">
          Primary Owner (<span className="text-white font-mono">{BOOTSTRAPPED_ADMIN_EMAIL}</span>) is automatically authorized. You can authorize additional administrators by adding their Firebase Auth UID below.
        </p>
      </div>

      {/* Add New Admin Form */}
      <form
        onSubmit={handleAddAdminSubmit}
        className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Firebase User UID *
          </label>
          <input
            type="text"
            required
            value={newAdminUid}
            onChange={(e) => setNewAdminUid(e.target.value)}
            placeholder="Paste Firebase UID..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#F59F00] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Admin Email *
          </label>
          <input
            type="email"
            required
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="chef@zaidbites.kitchen"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#F59F00] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Display Name &amp; Role *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              placeholder="Name"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#F59F00] focus:outline-none"
            />
            <select
              value={newAdminRole}
              onChange={(e) =>
                setNewAdminRole(e.target.value as 'super_admin' | 'admin' | 'manager')
              }
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={addingAdmin}
          className="py-2 px-4 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black font-bold text-xs sm:text-sm cursor-pointer"
        >
          {addingAdmin ? 'Adding...' : 'Authorize Admin'}
        </button>
      </form>

      {/* Current Admins List */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 bg-slate-900/50">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Firebase UID</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {adminsList.map((adm) => (
              <tr key={adm.uid}>
                <td className="py-3 px-4 font-semibold text-white">{adm.name}</td>
                <td className="py-3 px-4 text-slate-300">{adm.email}</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-400">{adm.uid}</td>
                <td className="py-3 px-4 uppercase text-xs font-semibold text-[#FCC419]">
                  {adm.role}
                </td>
                <td className="py-3 px-4 text-right">
                  {adm.email.toLowerCase() !== BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() && (
                    <button
                      type="button"
                      onClick={() => removeAdminAccount(adm.uid)}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
