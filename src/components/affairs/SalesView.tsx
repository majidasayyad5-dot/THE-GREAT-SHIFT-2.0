import React, { useState, useMemo } from 'react';
import { SaleRecord } from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import { Plus, Search, Edit2, Trash2, DollarSign, Filter, X, Check } from 'lucide-react';

interface SalesViewProps {
  sales: SaleRecord[];
  onAddSale: (sale: SaleRecord) => void;
  onEditSale: (sale: SaleRecord) => void;
  onDeleteSale: (id: string) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  onAddSale,
  onEditSale,
  onDeleteSale,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [product, setProduct] = useState('');
  const [customer, setCustomer] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending' | 'Partially Paid'>('Paid');
  const [salesChannel, setSalesChannel] = useState('Direct / Retail');
  const [notes, setNotes] = useState('');

  // Auto-calculated total sale amount
  const calculatedTotal = useMemo(() => {
    const gross = (Number(quantity) || 0) * (Number(sellingPrice) || 0);
    return Math.max(0, gross - (Number(discount) || 0));
  }, [quantity, sellingPrice, discount]);

  const openAddModal = () => {
    setEditingId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setProduct('');
    setCustomer('');
    setQuantity(1);
    setSellingPrice(0);
    setDiscount(0);
    setPaymentStatus('Paid');
    setSalesChannel('Direct / Retail');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (sale: SaleRecord) => {
    setEditingId(sale.id);
    setDate(sale.date);
    setProduct(sale.product);
    setCustomer(sale.customer);
    setQuantity(sale.quantity);
    setSellingPrice(sale.sellingPrice);
    setDiscount(sale.discount);
    setPaymentStatus(sale.paymentStatus);
    setSalesChannel(sale.salesChannel);
    setNotes(sale.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim() || !customer.trim()) return;

    if (editingId) {
      const existing = sales.find((s) => s.id === editingId);
      if (existing) {
        onEditSale({
          ...existing,
          date,
          product: product.trim(),
          customer: customer.trim(),
          quantity: Number(quantity) || 1,
          sellingPrice: Number(sellingPrice) || 0,
          discount: Number(discount) || 0,
          totalAmount: calculatedTotal,
          paymentStatus,
          salesChannel,
          notes: notes.trim() || undefined,
        });
      }
    } else {
      const newSale: SaleRecord = {
        id: `sale_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date,
        product: product.trim(),
        customer: customer.trim(),
        quantity: Number(quantity) || 1,
        sellingPrice: Number(sellingPrice) || 0,
        discount: Number(discount) || 0,
        totalAmount: calculatedTotal,
        paymentStatus,
        salesChannel,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onAddSale(newSale);
    }
    setIsModalOpen(false);
  };

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.product.toLowerCase().includes(search.toLowerCase()) ||
        s.customer.toLowerCase().includes(search.toLowerCase()) ||
        s.salesChannel.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return sales.reduce((acc, s) => acc + s.totalAmount, 0);
  }, [sales]);

  return (
    <div className="space-y-4">
      {/* Header & Metric Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.sales}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.sales_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sales.length > 0 && (
            <div className="text-right px-3 py-1 bg-teal-50 border border-teal-200 rounded text-xs font-mono">
              <span className="text-slate-500 block text-[10px] uppercase">Recorded Revenue</span>
              <span className="font-bold text-teal-800 text-sm">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.affairs.add_sale}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.common.search || 'Search sales...'}
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
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {sales.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <DollarSign className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Log your customer sales transactions to monitor gross turnover, tickets, and payment realizations.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            {t.affairs.add_sale}
          </button>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No sales match your search or filter criteria.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Product</th>
                <th className="p-2.5">Customer</th>
                <th className="p-2.5 text-right">Qty</th>
                <th className="p-2.5 text-right">Price</th>
                <th className="p-2.5 text-right">Discount</th>
                <th className="p-2.5 text-right font-bold text-slate-900">Total Sale</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5">Channel</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-mono text-slate-500">{sale.date}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{sale.product}</td>
                  <td className="p-2.5 text-slate-700">{sale.customer}</td>
                  <td className="p-2.5 text-right font-mono">{sale.quantity}</td>
                  <td className="p-2.5 text-right font-mono">${sale.sellingPrice.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono text-amber-700">
                    {sale.discount > 0 ? `-$${sale.discount.toFixed(2)}` : '$0.00'}
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                    ${sale.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        sale.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : sale.paymentStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600">{sale.salesChannel}</td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(sale)}
                      className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                      title="Edit Sale"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSale(sale.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Sale"
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

      {/* Add / Edit Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? t.affairs.edit_sale : t.affairs.add_sale}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Channel</label>
                  <select
                    value={salesChannel}
                    onChange={(e) => setSalesChannel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Direct / Retail">Direct / Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Online / E-Commerce">Online / E-Commerce</option>
                    <option value="Phone / Direct Order">Phone / Direct Order</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cotton Shirt, Rice Bag"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer *</label>
                  <input
                    type="text"
                    required
                    placeholder="Customer Name or Organization"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount ($)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Automatic Calculation Display */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-teal-800 uppercase block font-semibold">
                    Calculated Total Sale Amount:
                  </span>
                  <span className="text-[10px] text-teal-700">
                    Formula: (Quantity × Selling Price) − Discount
                  </span>
                </div>
                <span className="text-base font-bold font-mono text-teal-900">
                  ${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                  <input
                    type="text"
                    placeholder="Invoice #, remarks"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
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
                  {editingId ? 'Update Sale' : 'Record Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
