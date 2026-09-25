import React from 'react';
import {
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { BarChart3, TrendingUp, Package, Layers, Receipt, Info } from 'lucide-react';

interface DiagnosticChartsPanelProps {
  analysis: UnifiedBusinessAnalysisReport;
}

const TEAL_PALETTE = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];
const AMBER_PALETTE = ['#d97706', '#f59e0b', '#fbbf24', '#fde68a', '#fef3c7'];
const NAVY_PALETTE = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];

export const DiagnosticChartsPanel: React.FC<DiagnosticChartsPanelProps> = ({ analysis }) => {
  const { timeAnalysis, productAnalysis, expenseAnalysis } = analysis;

  const hasCharts =
    timeAnalysis.isAvailable ||
    productAnalysis.isAvailable ||
    (expenseAnalysis.isAvailable && expenseAnalysis.byCategory.length > 0);

  if (!hasCharts) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700">Charts Awaiting Data</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Visualizations require transactions, product revenue, or expense categories. Add records in Manage Business Affairs or upload a dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Time Series Revenue Trend */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-50 text-teal-700 rounded border border-teal-200">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Revenue Trajectory ({timeAnalysis.grouping})
                </h3>
                <span className="text-[11px] text-slate-500">
                  {timeAnalysis.isAvailable
                    ? `${timeAnalysis.startDate} to ${timeAnalysis.endDate}`
                    : 'Insufficient temporal data'}
                </span>
              </div>
            </div>
            {timeAnalysis.isAvailable && (
              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                {timeAnalysis.trendDirection}
              </span>
            )}
          </div>

          {timeAnalysis.isAvailable && timeAnalysis.dataPoints.length > 0 ? (
            <div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeAnalysis.dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white text-xs p-2.5 rounded shadow-lg font-mono">
                              <div className="font-bold text-teal-400 mb-1">{label}</div>
                              <div>Revenue: ${data.revenue.toLocaleString()}</div>
                              <div>Units Sold: {data.units}</div>
                              <div>Transactions: {data.transactionCount}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0f766e"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#0f766e', strokeWidth: 1.5, stroke: '#ffffff' }}
                      activeDot={{ r: 5, fill: '#14b8a6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Observation: {timeAnalysis.interpretation}</span>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded text-slate-400 text-xs p-4 text-center">
              <Info className="w-5 h-5 mb-1.5 text-slate-400" />
              <span>Time trend requires dated transactions across multiple intervals.</span>
            </div>
          )}
        </div>

        {/* 2. Top Products by Revenue */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-50 text-teal-700 rounded border border-teal-200">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Product Revenue Contribution
                </h3>
                <span className="text-[11px] text-slate-500">
                  {productAnalysis.isAvailable
                    ? `Highest contribution: ${productAnalysis.topByRevenue[0]?.product || 'N/A'}`
                    : 'Awaiting product revenue data'}
                </span>
              </div>
            </div>
            {productAnalysis.isAvailable && (
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold">
                {productAnalysis.topByRevenue.length} Products
              </span>
            )}
          </div>

          {productAnalysis.isAvailable && productAnalysis.topByRevenue.length > 0 ? (
            <div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productAnalysis.topByRevenue.slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <YAxis
                      dataKey="product"
                      type="category"
                      tick={{ fill: '#334155', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white text-xs p-2.5 rounded shadow-lg font-mono">
                              <div className="font-bold text-teal-400 mb-1">{item.product}</div>
                              <div>Revenue: ${item.revenue.toLocaleString()}</div>
                              <div>Share: {item.revenueSharePct}%</div>
                              <div>Units Sold: {item.unitsSold}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="revenue" fill="#0f766e" radius={[0, 4, 4, 0]}>
                      {productAnalysis.topByRevenue.slice(0, 5).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={TEAL_PALETTE[index % TEAL_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Top product share: {productAnalysis.revenueConcentrationPct}% of total revenue</span>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded text-slate-400 text-xs p-4 text-center">
              <Info className="w-5 h-5 mb-1.5 text-slate-400" />
              <span>Record sales items to visualize product revenue distribution.</span>
            </div>
          )}
        </div>

        {/* 3. Category Breakdown */}
        {productAnalysis.categoryBreakdown.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Category Revenue Distribution
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {productAnalysis.categoryBreakdown.length} active commercial categories
                  </span>
                </div>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productAnalysis.categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded shadow-lg font-mono">
                            <div className="font-bold text-amber-400 mb-1">{d.category}</div>
                            <div>Revenue: ${d.revenue.toLocaleString()}</div>
                            <div>Units Sold: {d.units}</div>
                            <div>Share: {d.sharePct}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]}>
                    {productAnalysis.categoryBreakdown.map((_, i) => (
                      <Cell key={`cat-${i}`} fill={AMBER_PALETTE[i % AMBER_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 font-mono border-t border-slate-100 pt-2">
              Largest category: {productAnalysis.categoryBreakdown[0]?.category} ({productAnalysis.categoryBreakdown[0]?.sharePct}%)
            </div>
          </div>
        )}

        {/* 4. Operating Expenses Breakdown */}
        {expenseAnalysis.isAvailable && expenseAnalysis.byCategory.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Operating Expense Allocation
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {expenseAnalysis.byCategory.length} expense categories tracked
                  </span>
                </div>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseAnalysis.byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded shadow-lg font-mono">
                            <div className="font-bold text-rose-400 mb-1">{d.category}</div>
                            <div>Amount: ${d.amount.toLocaleString()}</div>
                            <div>Share: {d.percentage}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="amount" fill="#be123c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 font-mono border-t border-slate-100 pt-2">
              Largest cost center: {expenseAnalysis.largestCategory?.category} (${expenseAnalysis.largestCategory?.amount.toLocaleString()}, {expenseAnalysis.largestCategory?.percentage}%)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
