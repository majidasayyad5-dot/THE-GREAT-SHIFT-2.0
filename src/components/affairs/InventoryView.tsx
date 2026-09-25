import React, { useState, useMemo } from 'react';
import { ProductRecord, StockStatus } from '../../types/bi';
import { getStockStatus } from '../../utils/affairsAnalyticsBridge';
import { useI18n } from '../../context/I18nContext';
import { Boxes, Search, Filter, AlertTriangle, CheckCircle2, XCircle, Plus, Minus, ArrowRight } from 'lucide-react';

interface InventoryViewProps {
  products: ProductRecord[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onNavigateToProducts: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onUpdateProductStock,
  onNavigateToProducts,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StockStatus>('All');

  // Derive inventory items directly from authentic products
  const inventoryItems = useMemo(() => {
    return products.map((p) => {
      const stockStatus = getStockStatus(p);
      return {
        ...p,
        stockStatus,
      };
    });
  }, [products]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.stockStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inventoryItems, search, statusFilter]);

  // Counts
  const outOfStockCount = inventoryItems.filter((i) => i.stockStatus === 'Out of Stock').length;
  const lowStockCount = inventoryItems.filter((i) => i.stockStatus === 'Low Stock').length;
  const inStockCount = inventoryItems.filter((i) => i.stockStatus === 'In Stock').length;

  return (
    <div className="space-y-4">
      {/* Header & Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.inventory}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.inventory_desc}
          </p>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs font-mono text-emerald-800">
              <span className="font-bold">{inStockCount}</span> In Stock
            </div>
            {lowStockCount > 0 && (
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-mono text-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold">{lowStockCount}</span> Low Stock
              </div>
            )}
            {outOfStockCount > 0 && (
              <div className="px-2.5 py-1 bg-rose-50 border border-rose-200 rounded text-xs font-mono text-rose-800 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-bold">{outOfStockCount}</span> Out of Stock
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.common.search || 'Search inventory...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock Only</option>
            <option value="Low Stock">Low Stock Only</option>
            <option value="Out of Stock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {products.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Inventory is populated automatically from your catalog items. Add products to begin tracking stock buffers.
          </p>
          <button
            onClick={onNavigateToProducts}
            className="mt-2 px-3.5 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <span>Go to Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No inventory items match your filter.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Product</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5 text-center">Current Stock</th>
                <th className="p-2.5 text-center">Safety Buffer</th>
                <th className="p-2.5 text-center">Stock Status</th>
                <th className="p-2.5 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-semibold text-slate-900">{item.name}</td>
                  <td className="p-2.5 text-slate-600">{item.category}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900 text-sm">
                    {item.currentStock}
                  </td>
                  <td className="p-2.5 text-center font-mono text-slate-500">
                    {item.minStockLevel}
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        item.stockStatus === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.stockStatus === 'In Stock' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {item.stockStatus === 'Low Stock' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {item.stockStatus === 'Out of Stock' && <XCircle className="w-3 h-3 text-rose-600" />}
                      <span>{item.stockStatus}</span>
                    </span>
                  </td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => onUpdateProductStock(item.id, Math.max(0, item.currentStock - 1))}
                      className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                      title="Decrement stock (-1)"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onUpdateProductStock(item.id, item.currentStock + 1)}
                      className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                      title="Increment stock (+1)"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
