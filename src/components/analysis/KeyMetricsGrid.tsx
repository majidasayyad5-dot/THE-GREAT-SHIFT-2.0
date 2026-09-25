import React from 'react';
import { UnifiedKeyMetrics } from '../../types/bi';
import {
  DollarSign,
  Receipt,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  Layers,
  Percent,
  HelpCircle,
  Tag,
  Boxes,
  Activity,
  FileCheck2,
} from 'lucide-react';

interface KeyMetricsGridProps {
  metrics: UnifiedKeyMetrics;
  onNavigateToAffairs?: () => void;
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({
  metrics,
  onNavigateToAffairs,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Revenue */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-700" />
              <span>Total Revenue</span>
            </span>
            {metrics.revenue.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.revenue.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-lg'}`}>
              {metrics.revenue.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              {metrics.revenue.evidence || metrics.revenue.insufficientReason || 'Gross recognized commercial sales'}
            </div>
          </div>
        </div>

        {/* 2. Sales Transactions */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-700" />
              <span>Sales Transactions</span>
            </span>
            {metrics.salesTransactionCount.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.salesTransactionCount.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-lg'}`}>
              {metrics.salesTransactionCount.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Completed transaction events
            </div>
          </div>
        </div>

        {/* 3. Units Sold */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-teal-700" />
              <span>Units Sold</span>
            </span>
            {metrics.unitsSold.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.unitsSold.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-lg'}`}>
              {metrics.unitsSold.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Cumulative product volume
            </div>
          </div>
        </div>

        {/* 4. Average Order Value */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-teal-700" />
              <span>Average Order Value</span>
            </span>
            {metrics.averageOrderValue.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.averageOrderValue.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-lg'}`}>
              {metrics.averageOrderValue.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Revenue per transaction
            </div>
          </div>
        </div>

        {/* 5. Potential Gross Margin (NEVER call profit without full cost verification) */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-700" />
              <span>Potential Gross Margin</span>
            </span>
            {metrics.potentialGrossMargin.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient data
              </span>
            )}
          </div>
          <div>
            <div className={`text-xl font-bold font-mono ${metrics.potentialGrossMargin.isSupported ? 'text-emerald-700' : 'text-slate-400 italic text-sm'}`}>
              {metrics.potentialGrossMargin.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              {metrics.potentialGrossMargin.evidence || 'Requires COGS cost price per SKU'}
            </div>
          </div>
        </div>

        {/* 6. Operating Expenses */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-rose-700" />
              <span>Operating Expenses</span>
            </span>
            {metrics.totalExpenses.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient data
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.totalExpenses.isSupported ? 'text-rose-700' : 'text-slate-400 italic text-sm'}`}>
              {metrics.totalExpenses.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              {metrics.totalExpenses.evidence || 'Logged rent, utilities, overheads'}
            </div>
          </div>
        </div>

        {/* 7. Revenue vs Expense Difference */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <span>Revenue - Expense Diff</span>
            </span>
            {metrics.revenueExpenseDifference.isSupported ? (
              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded font-bold">
                Calculated
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient data
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.revenueExpenseDifference.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-sm'}`}>
              {metrics.revenueExpenseDifference.formatted}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1 leading-snug">
              {metrics.revenueExpenseDifference.note}
            </div>
          </div>
        </div>

        {/* 8. Inventory & Stock Buffer */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-600" />
              <span>Inventory & Low Stock</span>
            </span>
            {metrics.inventoryLevels.isSupported ? (
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                Supported
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                Insufficient
              </span>
            )}
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono ${metrics.inventoryLevels.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-sm'}`}>
              {metrics.inventoryLevels.formatted} <span className="text-xs font-normal text-slate-500">units</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              {metrics.lowStockItemsCount.isSupported && metrics.lowStockItemsCount.value! > 0 ? (
                <span className="text-amber-700 font-bold">
                  {metrics.lowStockItemsCount.value} item(s) below safety buffer
                </span>
              ) : (
                'Buffer thresholds monitored'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
