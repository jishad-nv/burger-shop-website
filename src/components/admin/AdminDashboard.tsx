import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  ShieldCheck,
  Bell,
  Volume2,
  VolumeX,
  LogOut,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  useBackend,
  playKitchenOrderAlertChime,
} from '../../context/BackendContext';
import { BrandMascotLogo } from '../Navbar';
import { AdminLoginPage } from './AdminLoginPage';
import {
  AdminOrdersTab,
  getStatusBadgeStyle,
  formatOrderDateTime,
} from './AdminOrdersTab';
import { AdminProductsInventoryTab } from './AdminProductsInventoryTab';
import { AdminCategoriesPromosTab } from './AdminCategoriesPromosTab';
import { OrderStatus } from '../../types/food';

type AdminTabId =
  | 'overview'
  | 'orders'
  | 'products'
  | 'categories'
  | 'promos'
  | 'admins';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateHome,
}) => {
  const {
    user,
    isAdmin,
    adminChecking,
    orders,
    products,
    newOrderAlerts,
    soundEnabled,
    setSoundEnabled,
    dismissOrderAlert,
    clearAllOrderAlerts,
    updateOrderStatus,
    logoutUser,
    seedInitialCatalogToFirestore,
    isSeedingCatalog,
  } = useBackend();

  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');

  // Business KPI Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const newOrders = orders.filter((o) => o.status === 'New Order').length;
    const inPreparation = orders.filter(
      (o) =>
        o.status === 'Confirmed' ||
        o.status === 'Preparing' ||
        o.status === 'Out for Delivery'
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.finalTotal, 0);

    const totalProducts = products.length;
    const lowStockProducts = products.filter(
      (p) => (p.stockQuantity ?? 25) <= (p.lowStockThreshold ?? 5)
    );

    return {
      totalOrders,
      newOrders,
      inPreparation,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockList: lowStockProducts,
    };
  }, [orders, products]);

  // Protect Admin Route: If not logged in as Admin, show Admin Login Page
  if (adminChecking || !user || !isAdmin) {
    return (
      <AdminLoginPage
        onNavigateHome={onNavigateHome}
        onLoginSuccess={() => setActiveTab('overview')}
      />
    );
  }

  const navItems: {
    id: AdminTabId;
    label: string;
    icon: React.FC<{ className?: string }>;
    badgeCount?: number;
  }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingBag,
      badgeCount: stats.newOrders > 0 ? stats.newOrders : undefined,
    },
    {
      id: 'products',
      label: 'Products & Inventory',
      icon: Package,
      badgeCount: stats.lowStockCount > 0 ? stats.lowStockCount : undefined,
    },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'promos', label: 'Promo Codes', icon: Tag },
    { id: 'admins', label: 'Team & Access', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-white flex flex-col lg:flex-row">
      {/* Real-Time Order Alert Popup Notification */}
      {newOrderAlerts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm space-y-2.5 px-4 sm:px-0">
          {newOrderAlerts.slice(0, 3).map((alertOrder) => (
            <div
              key={alertOrder.id}
              className="bg-[#1E293B] border-2 border-[#F59F00] rounded-2xl p-4 shadow-2xl text-white space-y-2.5 animate-bounce"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#F59F00] text-black flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 stroke-[2.5]" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#FCC419]">
                      NEW LIVE ORDER RECEIVED!
                    </p>
                    <p className="text-sm font-bold font-mono tabular-nums">
                      {alertOrder.orderNumber} · ₹{alertOrder.finalTotal}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dismissOrderAlert(alertOrder.id)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-200 line-clamp-2">
                <strong>{alertOrder.customerName}</strong> ({alertOrder.customerPhone}):{' '}
                {alertOrder.itemsSummary}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    await updateOrderStatus(alertOrder.id, 'Confirmed');
                    dismissOrderAlert(alertOrder.id);
                    setActiveTab('orders');
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black font-bold text-xs cursor-pointer"
                >
                  Accept &amp; Confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissOrderAlert(alertOrder.id);
                    setActiveTab('orders');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
          {newOrderAlerts.length > 1 && (
            <button
              type="button"
              onClick={clearAllOrderAlerts}
              className="w-full py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              Dismiss All ({newOrderAlerts.length}) Alerts
            </button>
          )}
        </div>
      )}

      {/* Left Sidebar Navigation (260px wide on Desktop) */}
      <aside className="w-full lg:w-[264px] shrink-0 bg-[#1E293B] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between p-4 sm:p-5">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center shrink-0">
                <BrandMascotLogo className="w-8 h-8 text-white" accentColor="#F59F00" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                  ZaidBites
                </span>
                <span className="text-[11px] font-semibold text-[#FCC419] block mt-1">
                  Admin Console
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="lg:hidden px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F59F00] text-black'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badgeCount !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold tabular-nums ${
                        active
                          ? 'bg-black text-[#FCC419]'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Admin Profile & Logout */}
        <div className="hidden lg:block pt-5 border-t border-slate-800 space-y-3">
          <div className="px-2">
            <p className="text-xs font-semibold text-white truncate">
              {user.displayName || 'Administrator'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <button
              type="button"
              onClick={logoutUser}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-red-500/20 text-xs font-semibold text-slate-300 hover:text-red-300 inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb on Left, Actions on Right */}
        <header className="bg-[#1E293B]/70 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-400">ZaidBites Admin</span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-white">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sound Alert Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playKitchenOrderAlertChime();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Order Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Chime Muted</span>
                </>
              )}
            </button>

            {/* Sync / Restore Default Catalog Button */}
            <button
              type="button"
              disabled={isSeedingCatalog}
              onClick={() => seedInitialCatalogToFirestore()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSeedingCatalog ? 'animate-spin' : ''}`}
              />
              <span>{isSeedingCatalog ? 'Syncing...' : 'Sync Default Catalog'}</span>
            </button>

            {/* Open Live Website */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-lg bg-[#F59F00] hover:bg-[#D97706] text-black text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 8 Core Business KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#FCC419] font-mono tabular-nums mt-1">
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Excludes cancelled orders
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400">Total Orders</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                    {stats.totalOrders}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    All-time customer orders
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-amber-500/40 rounded-xl p-5">
                  <p className="text-xs font-semibold text-amber-300">New Orders</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums mt-1">
                    {stats.newOrders}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Awaiting kitchen confirmation
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-orange-300">
                    Orders in Preparation
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono tabular-nums mt-1">
                    {stats.inPreparation}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Confirmed, Preparing &amp; Out for Delivery
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-emerald-300">
                    Completed Orders
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1">
                    {stats.completedOrders}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Successfully delivered
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-red-300">Cancelled Orders</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono tabular-nums mt-1">
                    {stats.cancelledOrders}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Cancelled orders</p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400">Total Products</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                    {stats.totalProducts}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Across 4 main categories
                  </p>
                </div>

                <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5">
                  <p className="text-xs font-semibold text-amber-300">
                    Low-Stock Products
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums mt-1">
                    {stats.lowStockCount}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    At or below threshold
                  </p>
                </div>
              </div>

              {/* Recent Orders & Low-Stock Inventory Overview */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Recent Live Orders (8 cols) */}
                <div className="xl:col-span-8 bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Recent Orders</h3>
                      <p className="text-xs text-slate-400">
                        Live incoming orders from the ZaidBites storefront
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#FCC419] hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-10 text-center text-xs sm:text-sm text-slate-400">
                      No orders placed yet. Place an order on the storefront to see it arrive here in real time.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 bg-slate-900/50">
                            <th className="py-2.5 px-4">Order ID</th>
                            <th className="py-2.5 px-4">Customer</th>
                            <th className="py-2.5 px-4">Items</th>
                            <th className="py-2.5 px-4 text-right">Total</th>
                            <th className="py-2.5 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {orders.slice(0, 6).map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-800/40">
                              <td className="py-3 px-4 font-mono font-bold text-white tabular-nums whitespace-nowrap">
                                {ord.orderNumber}
                                <span className="block text-[11px] font-normal text-slate-400">
                                  {formatOrderDateTime(ord.createdAtMs)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-white">
                                  {ord.customerName}
                                </p>
                                <p className="text-xs text-slate-400 font-mono tabular-nums">
                                  {ord.customerPhone}
                                </p>
                              </td>
                              <td className="py-3 px-4 max-w-[220px] truncate text-xs text-slate-300">
                                {ord.itemsSummary}
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-[#FCC419] tabular-nums whitespace-nowrap">
                                ₹{ord.finalTotal}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <select
                                  value={ord.status}
                                  onChange={(e) =>
                                    updateOrderStatus(
                                      ord.id,
                                      e.target.value as OrderStatus
                                    )
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${getStatusBadgeStyle(
                                    ord.status
                                  )}`}
                                >
                                  {[
                                    'New Order',
                                    'Confirmed',
                                    'Preparing',
                                    'Out for Delivery',
                                    'Delivered',
                                    'Cancelled',
                                  ].map((st) => (
                                    <option
                                      key={st}
                                      value={st}
                                      className="bg-slate-900 text-white"
                                    >
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Low-Stock Alerts & Inventory Health (4 cols) */}
                <div className="xl:col-span-4 bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">
                        Stock &amp; Inventory Health
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-semibold text-[#FCC419] hover:underline cursor-pointer"
                      >
                        Manage Stock →
                      </button>
                    </div>

                    {stats.lowStockList.length === 0 ? (
                      <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                        <p className="text-sm font-semibold text-emerald-300">
                          All {stats.totalProducts} Products Well Stocked
                        </p>
                        <p className="text-xs text-slate-300">
                          Zero items are currently below their low-stock threshold.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {stats.lowStockList.slice(0, 6).map((item) => {
                          const stock = item.stockQuantity ?? 0;
                          return (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5 font-mono tabular-nums">
                                  <AlertTriangle className="w-3 h-3 shrink-0" />
                                  <span>
                                    {stock <= 0
                                      ? 'Out of Stock (0)'
                                      : `Low Stock (${stock} left)`}
                                  </span>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab('products')}
                                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold shrink-0 cursor-pointer"
                              >
                                Restock
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
                    Stock automatically decrements when customers place orders and disables ordering at 0.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <AdminOrdersTab />}
          {activeTab === 'products' && <AdminProductsInventoryTab />}
          {activeTab === 'categories' && <AdminCategoriesPromosTab mode="categories" />}
          {activeTab === 'promos' && <AdminCategoriesPromosTab mode="promos" />}
          {activeTab === 'admins' && <AdminCategoriesPromosTab mode="admins" />}
        </main>
      </div>
    </div>
  );
};
