import React, { useState } from 'react';
import {
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import {
  Clock,
  DollarSign,
  Package,
  Boxes,
  Users,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Tag,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface SpecializedDiagnosticsPanelProps {
  analysis: UnifiedBusinessAnalysisReport;
  onNavigateToAffairs?: () => void;
}

export const SpecializedDiagnosticsPanel: React.FC<SpecializedDiagnosticsPanelProps> = ({
  analysis,
  onNavigateToAffairs,
}) => {
  const [activeModule, setActiveModule] = useState<'sales' | 'product' | 'inventory' | 'customer' | 'expense' | 'time'>('sales');

  const {
    timeAnalysis,
    salesAnalysis,
    productAnalysis,
    inventoryAnalysis,
    customerAnalysis,
    expenseAnalysis,
  } = analysis;

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Module Selector Header */}
      <div className="border-b border-slate-200/80 bg-slate-50/70 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveModule('sales')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeModule === 'sales'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Sales Analysis</span>
          </button>

          <button
            onClick={() => setActiveModule('product')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeModule === 'product'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Analysis</span>
          </button>

          <button
            onClick={() => setActiveModule('inventory')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeModule === 'inventory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Inventory Analysis</span>
          </button>

          <button
            onClick={() => setActiveModule('customer')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeModule === 'customer'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Analysis</span>
          </button>

          <button
            onClick={() => setActiveModule('expense')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeModule === 'expense'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Expense Analysis</span>
          </button>

          <button
            onClick={() => setActiveModule('time')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeModule === 'time'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time Analysis</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-slate-500 uppercase px-2 py-0.5 bg-white border border-slate-200 rounded">
          Specialized Diagnostic Module
        </span>
      </div>

      <div className="p-5">
        {/* ========================================================================= */}
        {/* 1. SALES ANALYSIS */}
        {/* ========================================================================= */}
        {activeModule === 'sales' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Commercial Sales & Revenue Analysis</h3>
                <p className="text-xs text-slate-500">
                  Transaction volume, product revenue contribution, and geographic/segment distribution.
                </p>
              </div>
              {salesAnalysis.isAvailable && (
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {salesAnalysis.totalSales !== null ? `$${salesAnalysis.totalSales.toLocaleString()}` : 'Data Active'}
                </span>
              )}
            </div>

            {salesAnalysis.patterns.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Detected Commercial Patterns
                </div>
                {salesAnalysis.patterns.map((p, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
                      <span>{p.title}</span>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px]">{p.evidence}</div>
                    <div className="text-slate-500 italic text-[11px]">{p.interpretation}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Regional Breakdown */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Sales by Region</span>
                </div>
                {salesAnalysis.byRegion && salesAnalysis.byRegion.length > 0 ? (
                  <div className="space-y-1.5 text-xs">
                    {salesAnalysis.byRegion.map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                        <span className="font-semibold text-slate-800">{r.region}</span>
                        <div className="text-right font-mono">
                          <span className="text-slate-900 font-bold">${r.revenue.toLocaleString()}</span>
                          <span className="text-slate-400 text-[10px] ml-1.5">({r.sharePct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-2">
                    Region information is not recorded in the active ledger.
                  </div>
                )}
              </div>

              {/* Customer Type Breakdown */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-700" />
                  <span>Sales by Customer Type</span>
                </div>
                {salesAnalysis.byCustomerType && salesAnalysis.byCustomerType.length > 0 ? (
                  <div className="space-y-1.5 text-xs">
                    {salesAnalysis.byCustomerType.map((ct, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                        <span className="font-semibold text-slate-800">{ct.customerType}</span>
                        <div className="text-right font-mono">
                          <span className="text-slate-900 font-bold">${ct.revenue.toLocaleString()}</span>
                          <span className="text-slate-400 text-[10px] ml-1.5">({ct.sharePct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-2">
                    Customer type classification not detected in dataset.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. PRODUCT ANALYSIS */}
        {/* ========================================================================= */}
        {activeModule === 'product' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Product Portfolio Diagnostics</h3>
                <p className="text-xs text-slate-500">
                  Neutral evaluation of revenue share, unit sales volume, and catalog concentration.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {productAnalysis.totalProductsAnalyzed} SKUs Analyzed
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div><strong>Observation:</strong> {productAnalysis.observation}</div>
              <div className="text-slate-500"><strong>Interpretation:</strong> {productAnalysis.interpretation}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Revenue Contributors */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Highest Revenue Contribution</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Top 5</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {productAnalysis.topByRevenue.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <div>
                        <div className="font-semibold text-slate-800">{p.product}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.category} · {p.unitsSold} units</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-slate-900">${p.revenue.toLocaleString()}</div>
                        <div className="text-[10px] text-teal-700">{p.revenueSharePct}% share</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lowest Recorded Volume */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Lowest Recorded Sales Volume</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Baseline</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {productAnalysis.lowestRecordedSales.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <div>
                        <div className="font-semibold text-slate-800">{p.product}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.category} · {p.unitsSold} units</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-slate-700">${p.revenue.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{p.revenueSharePct}% share</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. INVENTORY ANALYSIS */}
        {/* ========================================================================= */}
        {activeModule === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Inventory Health & Buffer Analysis</h3>
                <p className="text-xs text-slate-500">
                  Stock on-hand, safety thresholds, and cross-comparison with actual sales velocity.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                {inventoryAnalysis.totalStockUnits} Total Stock Units
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div><strong>Observation:</strong> {inventoryAnalysis.observation}</div>
              <div className="text-slate-500"><strong>Interpretation:</strong> {inventoryAnalysis.interpretation}</div>
            </div>

            {/* Imbalances Alerts */}
            {inventoryAnalysis.imbalances.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-amber-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Potential Inventory Imbalances</span>
                </div>
                {inventoryAnalysis.imbalances.map((imb, i) => (
                  <div key={i} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-amber-950">{imb.observation}</div>
                    <div className="text-amber-800 font-mono text-[11px]">
                      Current Stock: <strong>{imb.currentStock}</strong> | Sales Volume: <strong>{imb.salesVolume}</strong>
                    </div>
                    <div className="text-slate-600 text-[11px] italic">{imb.interpretation}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Low Stock Items List */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Items At or Below Safety Buffer</span>
                <span className="text-[10px] font-mono text-rose-700 font-bold">
                  {inventoryAnalysis.lowStockItems.length} SKUs Alerted
                </span>
              </div>
              {inventoryAnalysis.lowStockItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {inventoryAnalysis.lowStockItems.map((item, i) => (
                    <div key={i} className="p-2 bg-white rounded border border-rose-200 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">{item.product}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Safety Buffer: {item.buffer} units
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-rose-700">{item.currentStock}</span>
                        <span className="text-[10px] text-slate-400 ml-1">in stock</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic py-2">
                  All catalog items meet or exceed safety threshold specifications.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. CUSTOMER ANALYSIS */}
        {/* ========================================================================= */}
        {activeModule === 'customer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Customer Base & Account Analysis</h3>
                <p className="text-xs text-slate-500">
                  Aggregated client distribution, customer concentration, and purchasing volume.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                {customerAnalysis.customerCount} Verified Accounts
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div><strong>Observation:</strong> {customerAnalysis.observation}</div>
              <div className="text-slate-500"><strong>Interpretation:</strong> {customerAnalysis.interpretation}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Customers */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900">Highest Revenue Accounts</div>
                {customerAnalysis.topCustomersByRevenue.length > 0 ? (
                  <div className="space-y-1.5 text-xs">
                    {customerAnalysis.topCustomersByRevenue.map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                        <div>
                          <div className="font-semibold text-slate-800">{c.customer}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.transactionCount} transactions</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="font-bold text-slate-900">${c.revenue.toLocaleString()}</div>
                          <div className="text-[10px] text-teal-700">{c.revenueSharePct}% of total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-2">
                    Customer ledger entries are not currently logged.
                  </div>
                )}
              </div>

              {/* Type Distribution */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900">Customer Segment Breakdown</div>
                {customerAnalysis.typeDistribution.length > 0 ? (
                  <div className="space-y-1.5 text-xs">
                    {customerAnalysis.typeDistribution.map((t, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                        <span className="font-semibold text-slate-800">{t.type}</span>
                        <span className="font-mono text-slate-600 text-[11px]">
                          {t.count} accounts ({t.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-2">
                    Customer segmentation classifications not detected.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. EXPENSE ANALYSIS */}
        {/* ========================================================================= */}
        {activeModule === 'expense' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Operating Expenses & Cost Ledger</h3>
                <p className="text-xs text-slate-500">
                  Tracked overhead, procurement, rent, and difference against recorded revenues.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                {expenseAnalysis.totalExpenses !== null ? `$${expenseAnalysis.totalExpenses.toLocaleString()}` : 'Awaiting Data'}
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div><strong>Observation:</strong> {expenseAnalysis.observation}</div>
              <div className="text-slate-500"><strong>Interpretation:</strong> {expenseAnalysis.interpretation}</div>
            </div>

            {/* Revenue vs Expense Comparison */}
            {expenseAnalysis.revenueExpenseComparison.hasBoth && (
              <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2 font-mono">
                <div className="text-[10px] uppercase text-teal-400 font-bold tracking-wider">
                  COMMERCIAL REVENUE & OPERATING EXPENSES COMPARISON
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">RECORDED REVENUE</div>
                    <div className="text-lg font-bold text-emerald-400">
                      ${expenseAnalysis.revenueExpenseComparison.revenue?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">RECORDED EXPENSES</div>
                    <div className="text-lg font-bold text-rose-400">
                      ${expenseAnalysis.revenueExpenseComparison.expenses?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">NET RECORDED DIFFERENCE</div>
                    <div className="text-lg font-bold text-white">
                      {expenseAnalysis.revenueExpenseComparison.differenceFormatted}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-300/90 pt-2 border-t border-slate-800 leading-relaxed font-sans">
                  <strong>Notice:</strong> {expenseAnalysis.revenueExpenseComparison.note}
                </div>
              </div>
            )}

            {/* Expense Categories List */}
            {expenseAnalysis.byCategory.length > 0 && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-slate-900">Recorded Expense Categories</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {expenseAnalysis.byCategory.map((cat, i) => (
                    <div key={i} className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{cat.category}</span>
                      <div className="text-right font-mono">
                        <span className="font-bold text-rose-700">${cat.amount.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({cat.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. TIME ANALYSIS */}
        {/* ========================================================================= */}
        {activeModule === 'time' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Temporal Sequence & Grouping Diagnostics</h3>
                <p className="text-xs text-slate-500">
                  Dynamic period grouping based on chronological date breadth.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                {timeAnalysis.grouping} Cadence
              </span>
            </div>

            {timeAnalysis.isAvailable ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Date Range</div>
                    <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                      {timeAnalysis.startDate} → {timeAnalysis.endDate}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Number of Periods</div>
                    <div className="text-base font-mono font-bold text-slate-800 mt-0.5">
                      {timeAnalysis.periodCount} {timeAnalysis.grouping.toLowerCase()} intervals
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Trend Direction</div>
                    <div className="text-base font-mono font-bold text-teal-700 mt-0.5 capitalize">
                      {timeAnalysis.trendDirection.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                  <div><strong>Observation:</strong> {timeAnalysis.observation}</div>
                  <div className="text-slate-500"><strong>Interpretation:</strong> {timeAnalysis.interpretation}</div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded">
                {timeAnalysis.reasonIfNotAvailable}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
