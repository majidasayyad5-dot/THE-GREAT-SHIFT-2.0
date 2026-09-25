import React, { useState, useMemo } from 'react';
import { ProductRecord } from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import { Plus, Search, Edit2, Trash2, Package, Filter, X, Info } from 'lucide-react';

interface ProductsViewProps {
  products: ProductRecord[];
  onAddProduct: (product: ProductRecord) => void;
  onEditProduct: (product: ProductRecord) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General Goods');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStockLevel, setMinStockLevel] = useState<number>(5);
  const [supplier, setSupplier] = useState('');
  const [status, setStatus] = useState<'Active' | 'Discontinued' | 'Out of Stock'>('Active');

  // Automatic Calculation: Potential Unit Margin = Selling Price - Cost Price
  const potentialUnitMargin = useMemo(() => {
    return (Number(sellingPrice) || 0) - (Number(costPrice) || 0);
  }, [sellingPrice, costPrice]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory('General Goods');
    setSellingPrice(0);
    setCostPrice(0);
    setCurrentStock(0);
    setMinStockLevel(5);
    setSupplier('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductRecord) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setSellingPrice(p.sellingPrice);
    setCostPrice(p.costPrice);
    setCurrentStock(p.currentStock);
    setMinStockLevel(p.minStockLevel);
    setSupplier(p.supplier || '');
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const existing = products.find((p) => p.id === editingId);
      if (existing) {
        onEditProduct({
          ...existing,
          name: name.trim(),
          category: category.trim(),
          sellingPrice: Number(sellingPrice) || 0,
          costPrice: Number(costPrice) || 0,
          unitMargin: potentialUnitMargin,
          currentStock: Number(currentStock) || 0,
          minStockLevel: Number(minStockLevel) || 0,
          supplier: supplier.trim() || undefined,
          status,
        });
      }
    } else {
      const newProd: ProductRecord = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        category: category.trim(),
        sellingPrice: Number(sellingPrice) || 0,
        costPrice: Number(costPrice) || 0,
        unitMargin: potentialUnitMargin,
        currentStock: Number(currentStock) || 0,
        minStockLevel: Number(minStockLevel) || 0,
        supplier: supplier.trim() || undefined,
        status,
        createdAt: new Date().toISOString(),
      };
      onAddProduct(newProd);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.supplier && p.supplier.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Header & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.products}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.products_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {products.length > 0 && (
            <div className="text-right px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono">
              <span className="text-slate-500 block text-[10px] uppercase">Registered SKUs</span>
              <span className="font-bold text-slate-900">{products.length} Items</span>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.affairs.add_product}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.common.search || 'Search products...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table / List */}
      {products.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <Package className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your product catalog, establish selling and cost price benchmarks, and monitor unit margins.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            {t.affairs.add_product}
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No products match your filter.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Product Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5 text-right">Selling Price</th>
                <th className="p-2.5 text-right">Cost Price</th>
                <th className="p-2.5 text-right font-bold text-teal-900">Unit Margin</th>
                <th className="p-2.5 text-right">Stock</th>
                <th className="p-2.5 text-right">Min Level</th>
                <th className="p-2.5">Supplier</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-semibold text-slate-900">{prod.name}</td>
                  <td className="p-2.5 text-slate-600">{prod.category}</td>
                  <td className="p-2.5 text-right font-mono font-medium">${prod.sellingPrice.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono text-slate-500">${prod.costPrice.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-teal-800">
                    ${prod.unitMargin.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono">{prod.currentStock}</td>
                  <td className="p-2.5 text-right font-mono text-slate-400">{prod.minStockLevel}</td>
                  <td className="p-2.5 text-slate-600">{prod.supplier || '—'}</td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        prod.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : prod.status === 'Out of Stock'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Product"
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

      {/* Margin Governance Disclaimer */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-center gap-2">
        <Info className="w-4 h-4 text-teal-700 shrink-0" />
        <span>{t.affairs.margin_disclaimer}</span>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? t.affairs.edit_product : t.affairs.add_product}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard Cotton Weave"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Textiles, Hardware, Provisions"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cost Price ($) *</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Automatically calculated Potential Unit Margin */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-teal-800 uppercase block font-semibold">
                    Potential Unit Margin:
                  </span>
                  <span className="text-[10px] text-teal-700">
                    Formula: Selling Price − Cost Price
                  </span>
                </div>
                <span className="text-base font-bold font-mono text-teal-900">
                  ${potentialUnitMargin.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Safety Stock Level</label>
                  <input
                    type="number"
                    min="0"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier / Producer</label>
                  <input
                    type="text"
                    placeholder="Vendor Name"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Discontinued">Discontinued</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
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
                  {editingId ? 'Update Product' : 'Register Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
