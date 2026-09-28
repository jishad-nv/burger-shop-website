import React, { useState, useMemo } from 'react';
import {
  Search,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Eye,
  X,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { CustomerOrderRecord, OrderStatus } from '../../types/food';
import { useBackend } from '../../context/BackendContext';

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'New Order',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const FILTER_TABS: { id: 'ALL' | OrderStatus; label: string }[] = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'New Order', label: 'New Orders' },
  { id: 'Preparing', label: 'Preparing' },
  { id: 'Out for Delivery', label: 'Out for Delivery' },
  { id: 'Delivered', label: 'Delivered' },
  { id: 'Cancelled', label: 'Cancelled' },
];

export function getStatusBadgeStyle(status: OrderStatus): string {
  switch (status) {
    case 'New Order':
      return 'text-amber-300 bg-amber-500/15 border-amber-500/40';
    case 'Confirmed':
      return 'text-sky-300 bg-sky-500/15 border-sky-500/40';
    case 'Preparing':
      return 'text-orange-300 bg-orange-500/15 border-orange-500/40';
    case 'Out for Delivery':
      return 'text-indigo-300 bg-indigo-500/15 border-indigo-500/40';
    case 'Delivered':
      return 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40';
    case 'Cancelled':
      return 'text-red-300 bg-red-500/15 border-red-500/40';
    default:
      return 'text-slate-300 bg-slate-700 border-slate-600';
  }
}

export function formatOrderDateTime(ms: number): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useBackend();
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrderRecord | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesId =
          order.orderNumber.toLowerCase().includes(q) ||
          order.id.toLowerCase().includes(q);
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesPhone = order.customerPhone.toLowerCase().includes(q);
        return matchesId || matchesName || matchesPhone;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-xl border border-slate-800">
        {/* Segmented Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {FILTER_TABS.map((tab) => {
            const active = statusFilter === tab.id;
            const count =
              tab.id === 'ALL'
                ? orders.length
                : orders.filter((o) => o.status === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#F59F00] text-black'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono tabular-nums text-[11px] ${
                    active ? 'text-black/80 font-bold' : 'text-slate-400'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input by Order ID, Customer Name, or Phone Number */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Name, or Phone..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-[#F59F00] rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-12 text-center space-y-2">
          <Package className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-base font-semibold text-white">No matching orders found</p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            New customer orders placed on the ZaidBites website appear here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 bg-slate-900/50">
                  <th className="py-3 px-4">Order ID &amp; Time</th>
                  <th className="py-3 px-4">Customer &amp; Contact</th>
                  <th className="py-3 px-4">Ordered Products</th>
                  <th className="py-3 px-4 text-right">Bill Breakdown</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {filteredOrders.map((order) => {
                  const isNewOrder = order.status === 'New Order';
                  return (
                    <tr
                      key={order.id}
                      className={`transition-colors ${
                        isNewOrder
                          ? 'bg-amber-500/[0.07] hover:bg-amber-500/[0.12]'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Order ID & Date/Time */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white tabular-nums">
                            {order.orderNumber}
                          </span>
                          {isNewOrder && (
                            <span className="text-[11px] font-bold text-amber-400">
                              · NEW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 tabular-nums">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{formatOrderDateTime(order.createdAtMs)}</span>
                        </div>
                      </td>

                      {/* Customer Name, Phone, Address */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        <p className="font-semibold text-white truncate">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-slate-300 font-mono tabular-nums mt-0.5">
                          {order.customerPhone}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {order.deliveryAddress}
                        </p>
                      </td>

                      {/* Ordered Items */}
                      <td className="py-3.5 px-4 align-top max-w-[260px]">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div
                              key={`${item.productId}-${idx}`}
                              className="text-xs text-slate-200 flex items-baseline justify-between gap-2"
                            >
                              <span className="truncate">
                                <strong className="font-mono tabular-nums text-[#F59F00]">
                                  {item.quantity}x
                                </strong>{' '}
                                {item.name}
                                {item.sizeLabel && item.sizeLabel !== 'Standard'
                                  ? ` (${item.sizeLabel})`
                                  : ''}
                              </span>
                              <span className="font-mono tabular-nums text-slate-400 shrink-0">
                                ₹{item.lineTotal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Subtotal, Discount, Delivery, Final Total */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap font-mono tabular-nums">
                        <p className="text-sm font-bold text-[#FCC419]">
                          ₹{order.finalTotal}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Sub: ₹{order.subtotal}
                          {order.discount > 0 ? ` · -₹${order.discount}` : ''}
                          {order.deliveryFee > 0 ? ` · Del: ₹${order.deliveryFee}` : ' · Free Del'}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="text-xs text-slate-300">{order.paymentMethod}</span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <select
                          aria-label={`Update status for order ${order.orderNumber}`}
                          disabled={updatingOrderId === order.id}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${getStatusBadgeStyle(
                            order.status
                          )}`}
                        >
                          {ORDER_STATUS_OPTIONS.map((st) => (
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

                      {/* View Full Modal */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-bold font-mono tabular-nums">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusBadgeStyle(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 tabular-nums">
                  Placed on {formatOrderDateTime(selectedOrder.createdAtMs)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <p className="text-slate-400 text-xs">Customer Details</p>
                <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                <p className="text-slate-300 flex items-center gap-1.5 font-mono tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#F59F00]" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
                <p className="text-slate-400 text-xs">{selectedOrder.customerEmail}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-slate-400 text-xs">Delivery &amp; Payment</p>
                <p className="text-slate-200 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EF3E36] shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress}</span>
                </p>
                <p className="text-slate-300 flex items-center gap-1.5 pt-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedOrder.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Ordered Items Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-400">
                Ordered Items ({selectedOrder.totalItemsCount})
              </h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={`${item.productId}-${i}`}
                    className="p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        <span className="font-mono text-[#F59F00] mr-1.5">
                          {item.quantity}x
                        </span>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Size: {item.sizeLabel || 'Standard'}
                        {item.addonsLabel && item.addonsLabel !== 'None'
                          ? ` · Add-ons: ${item.addonsLabel}`
                          : ''}
                      </p>
                    </div>
                    <div className="text-right font-mono tabular-nums shrink-0">
                      <p className="font-semibold text-white">₹{item.lineTotal}</p>
                      <p className="text-[11px] text-slate-400">₹{item.unitPrice} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs sm:text-sm font-mono tabular-nums">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>
                  Discount {selectedOrder.promoCode ? `(${selectedOrder.promoCode})` : ''}
                </span>
                <span>-₹{selectedOrder.discount}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Fee</span>
                <span>
                  {selectedOrder.deliveryFee === 0
                    ? 'Free (₹0)'
                    : `₹${selectedOrder.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#FCC419] pt-2 border-t border-slate-800">
                <span>Final Total</span>
                <span>₹{selectedOrder.finalTotal}</span>
              </div>
            </div>

            {/* Quick Status Update Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-400">
                Update Order Status
              </p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUS_OPTIONS.map((st) => {
                  const active = selectedOrder.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingOrderId === selectedOrder.id}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? 'bg-[#F59F00] text-black border-[#F59F00]'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
