import React, { useState, useMemo } from 'react';
import { OrderRecord, OrderStatus, OrderPaymentStatus } from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import { Plus, Search, Edit2, Trash2, ShoppingCart, Filter, X } from 'lucide-react';

interface OrdersViewProps {
  orders: OrderRecord[];
  onAddOrder: (order: OrderRecord) => void;
  onEditOrder: (order: OrderRecord) => void;
  onDeleteOrder: (id: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [orderId, setOrderId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customer, setCustomer] = useState('');
  const [products, setProducts] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderValue, setOrderValue] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Pending');
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatus>('Pending');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setOrderId(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    setDate(new Date().toISOString().split('T')[0]);
    setCustomer('');
    setProducts('');
    setQuantity(1);
    setOrderValue(0);
    setOrderStatus('Pending');
    setPaymentStatus('Pending');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (ord: OrderRecord) => {
    setEditingId(ord.id);
    setOrderId(ord.orderId);
    setDate(ord.date);
    setCustomer(ord.customer);
    setProducts(ord.products);
    setQuantity(ord.quantity);
    setOrderValue(ord.orderValue);
    setOrderStatus(ord.orderStatus);
    setPaymentStatus(ord.paymentStatus);
    setNotes(ord.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !products.trim() || orderValue <= 0) return;

    if (editingId) {
      const existing = orders.find((o) => o.id === editingId);
      if (existing) {
        onEditOrder({
          ...existing,
          orderId: orderId.trim(),
          date,
          customer: customer.trim(),
          products: products.trim(),
          quantity: Number(quantity) || 1,
          orderValue: Number(orderValue) || 0,
          orderStatus,
          paymentStatus,
          notes: notes.trim() || undefined,
        });
      }
    } else {
      const newOrder: OrderRecord = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        orderId: orderId.trim() || `ORD-${Date.now().toString().slice(-4)}`,
        date,
        customer: customer.trim(),
        products: products.trim(),
        quantity: Number(quantity) || 1,
        orderValue: Number(orderValue) || 0,
        orderStatus,
        paymentStatus,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onAddOrder(newOrder);
    }
    setIsModalOpen(false);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.products.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
      const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.orders}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.orders_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="text-right px-3 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-mono">
              <span className="text-amber-800 font-bold">{pendingCount} Pending Fulfillment</span>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.affairs.add_order}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.common.search || 'Search orders by ID, client, or items...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="All">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {orders.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Log your customer purchase orders to manage delivery pipelines, order quantities, and payment commitments.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            {t.affairs.add_order}
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No orders match your filter criteria.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Order ID</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Customer</th>
                <th className="p-2.5">Products</th>
                <th className="p-2.5 text-right">Qty</th>
                <th className="p-2.5 text-right font-bold text-slate-900">Value ($)</th>
                <th className="p-2.5 text-center">Order Status</th>
                <th className="p-2.5 text-center">Payment</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-teal-900">{ord.orderId}</td>
                  <td className="p-2.5 font-mono text-slate-500">{ord.date}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{ord.customer}</td>
                  <td className="p-2.5 text-slate-700">{ord.products}</td>
                  <td className="p-2.5 text-right font-mono">{ord.quantity}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                    ${ord.orderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        ord.orderStatus === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ord.orderStatus === 'Processing'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ord.paymentStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(ord)}
                      className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                      title="Edit Order"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(ord.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? t.affairs.edit_order : t.affairs.add_order}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order ID *</label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Client *</label>
                <input
                  type="text"
                  required
                  placeholder="Customer Name"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Products Ordered *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5x Premium Shirts, 2x Wool Fabrics"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order Value ($) *</label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={orderValue}
                    onChange={(e) => setOrderValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as OrderPaymentStatus)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Delivery terms, consignment details"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {editingId ? 'Update Order' : 'Save Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
