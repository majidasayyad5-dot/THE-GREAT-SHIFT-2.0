import React, { useState, useMemo } from 'react';
import { SupplierRecord } from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import { Plus, Search, Edit2, Trash2, Truck, X, Clock, CreditCard } from 'lucide-react';

interface SuppliersViewProps {
  suppliers: SupplierRecord[];
  onAddSupplier: (supplier: SupplierRecord) => void;
  onEditSupplier: (supplier: SupplierRecord) => void;
  onDeleteSupplier: (id: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [contactPerson, setContactPerson] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [leadTime, setLeadTime] = useState('3-5 days');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory('Raw Materials');
    setContactPerson('');
    setContactInfo('');
    setLeadTime('3-5 days');
    setPaymentTerms('Net 30');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: SupplierRecord) => {
    setEditingId(s.id);
    setName(s.name);
    setCategory(s.category || s.productsSupplied || 'Raw Materials');
    setContactPerson(s.contactPerson || '');
    setContactInfo(s.contactInfo);
    setLeadTime(s.leadTime || '3-5 days');
    setPaymentTerms(s.paymentTerms);
    setNotes(s.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const existing = suppliers.find((s) => s.id === editingId);
      if (existing) {
        onEditSupplier({
          ...existing,
          name: name.trim(),
          category: category.trim(),
          productsSupplied: category.trim(),
          contactPerson: contactPerson.trim(),
          contactInfo: contactInfo.trim(),
          leadTime: leadTime.trim(),
          paymentTerms: paymentTerms.trim(),
          notes: notes.trim() || undefined,
        });
      }
    } else {
      const newSupplier: SupplierRecord = {
        id: `sup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        category: category.trim(),
        productsSupplied: category.trim(),
        contactPerson: contactPerson.trim(),
        contactInfo: contactInfo.trim(),
        leadTime: leadTime.trim(),
        paymentTerms: paymentTerms.trim(),
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onAddSupplier(newSupplier);
    }
    setIsModalOpen(false);
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const supCategory = s.category || s.productsSupplied || '';
      const supPerson = s.contactPerson || '';
      return (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        supCategory.toLowerCase().includes(search.toLowerCase()) ||
        supPerson.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [suppliers, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.suppliers}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.suppliers_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {suppliers.length > 0 && (
            <div className="text-right px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono">
              <span className="font-bold text-slate-900">{suppliers.length} Registered Vendors</span>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.affairs.add_supplier}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={t.common.search || 'Search supplier directory...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
        />
      </div>

      {/* Table / List */}
      {suppliers.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <Truck className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Maintain your vendor contacts, lead times, credit cycles, and procurement terms in one central directory.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            {t.affairs.add_supplier}
          </button>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No suppliers match your search query.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Supplier Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Contact Person</th>
                <th className="p-2.5">Contact Info</th>
                <th className="p-2.5">Lead Time</th>
                <th className="p-2.5">Payment Terms</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-semibold text-slate-900">{sup.name}</td>
                  <td className="p-2.5 text-slate-600">{sup.category}</td>
                  <td className="p-2.5 text-slate-800">{sup.contactPerson || '—'}</td>
                  <td className="p-2.5 font-mono text-slate-700">{sup.contactInfo || '—'}</td>
                  <td className="p-2.5 text-slate-700 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{sup.leadTime}</span>
                  </td>
                  <td className="p-2.5 text-slate-700 font-mono">{sup.paymentTerms}</td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(sup)}
                      className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                      title="Edit Supplier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSupplier(sup.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Supplier"
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

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? t.affairs.edit_supplier : t.affairs.add_supplier}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Company / Firm *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Polymers, Gujarat Mills"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Supply Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Raw Yarn, Packaging, Tools"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Manager Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Information</label>
                <input
                  type="text"
                  placeholder="Phone, email, or depot address"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Typical Lead Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 days, 2 weeks"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    placeholder="e.g. Net 30, Cash on Delivery, Advance"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Minimum order size, discount thresholds"
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
                  {editingId ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
