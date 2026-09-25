import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  Target,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { UnifiedBusinessDataLayer, UnifiedBusinessAnalysisReport } from '../../types/bi';

interface ProductShowcaseTabsProps {
  dataLayer: UnifiedBusinessDataLayer;
  analysis: UnifiedBusinessAnalysisReport;
  onNavigate: (section: string) => void;
}

export const ProductShowcaseTabs: React.FC<ProductShowcaseTabsProps> = ({
  dataLayer,
  analysis,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'insights' | 'recommendations' | 'decision'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'analyze' },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb, section: 'insights' },
    { id: 'recommendations', label: 'Recommendations', icon: Target, section: 'recommendations' },
    { id: 'decision', label: 'Decision Hub', icon: ShieldCheck, section: 'decision' },
  ] as const;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 font-bold">
            PRODUCT PREVIEW
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Explore the Live Intelligence Suite
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          A unified deterministic engine running real data through a 5-step operational pipeline.
        </p>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive SaaS Window Frame */}
      <div className="bg-[#091124] rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-sans">
        {/* Mock Window Top Bar */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500/80" />
            </div>
            <span className="text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-3">
              thegreatshift.app / live-preview / {activeTab}
            </span>
          </div>

          <button
            onClick={() => onNavigate(activeTab === 'analytics' ? 'analyze' : activeTab)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-teal-600/80 hover:bg-teal-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <span>Open in App</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Tab 1: Dashboard Preview */}
        {activeTab === 'dashboard' && (
          <div className="p-6 bg-slate-900/60 text-white space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-400">Total Recorded Revenue</span>
                <div className="text-xl sm:text-2xl font-extrabold text-teal-400 mt-1">
                  {analysis?.keyMetrics?.revenue?.formatted || '$14,850.00'}
                </div>
                <span className="text-[10px] text-slate-500">From verified sales entries</span>
              </div>
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-400">Operating Expenses</span>
                <div className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1">
                  {analysis?.keyMetrics?.totalExpenses?.formatted || '$6,420.00'}
                </div>
                <span className="text-[10px] text-slate-500">Tracked across supply & overhead</span>
              </div>
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-400">Active Catalog SKUs</span>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-1">
                  {dataLayer?.products?.length || '18 SKUs'}
                </div>
                <span className="text-[10px] text-slate-500">Physical stock monitored</span>
              </div>
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-400">Data Completeness</span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">
                  94.2%
                </div>
                <span className="text-[10px] text-slate-500">Audit-ready validation</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lead SKU Performance Highlight</h4>
                  <p className="text-xs text-slate-400">
                    Handmade Cotton Kurti generates 34.2% of total recorded revenue with positive margin.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-teal-950 border border-teal-500/40 text-teal-400 text-xs font-mono font-semibold">
                STABLE TREND
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Analytics Preview */}
        {activeTab === 'analytics' && (
          <div className="p-6 bg-slate-900/60 text-white space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold uppercase">
                  <BarChart3 className="w-4 h-4" />
                  <span>Deterministic Audit Engine</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                  100% EVIDENCE-BACKED
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Multi-source reconciler joins direct transactions with uploaded CSV/XLSX files. Checks required price, cost, date, and category columns before computing diagnostic ratios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Revenue Concentration</span>
                <p className="text-slate-200 font-medium">Top 2 SKUs contribute 58% of turnover (Pareto Risk: Moderate).</p>
              </div>
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Inventory Depletion Velocity</span>
                <p className="text-slate-200 font-medium">Cotton Dupatta stock will hit safety buffer within 9 days.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Insights Preview */}
        {activeTab === 'insights' && (
          <div className="p-6 bg-slate-900/60 text-white space-y-4">
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>EXECUTIVE FINDING · INVENTORY IMBALANCE</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Reorder Buffer Required for Lead SKU
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Observed Evidence:</strong> 42 units sold in the last 14 days, with 6 units currently remaining in stock. Reorder lead time is logged at 5 business days.
              </p>
              <div className="text-[11px] text-amber-300/90 bg-amber-950/50 border border-amber-800/60 p-2.5 rounded-lg font-mono">
                AI Interpretation: Running at current sales pace without replenishing will likely cause a stockout within 48-72 hours.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Recommendations Preview */}
        {activeTab === 'recommendations' && (
          <div className="p-6 bg-slate-900/60 text-white space-y-4">
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded font-bold uppercase">
                  Time-Series Demand Forecasting
                </span>
                <span className="text-xs text-slate-400 font-mono">Confidence: High (90+ entries)</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Dynamic Safety Stock Adjustment Archetype
              </h4>
              <p className="text-xs text-slate-300">
                Calculates rolling 14-day standard deviation to set dynamic minimum reorder thresholds rather than static guess counts.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Suitable For:</span>
                <span className="text-teal-300 font-mono">Fast-moving apparel &amp; packaged goods</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Decision Hub Preview */}
        {activeTab === 'decision' && (
          <div className="p-6 bg-slate-900/60 text-white space-y-4">
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Human Decision Protocol</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Audit Log Ready</span>
              </div>
              <p className="text-xs text-slate-300">
                Every AI recommendation requires explicit human sign-off before adoption. AI advises with empirical evidence; you make the business decision.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded bg-teal-900/80 text-teal-200 border border-teal-700 text-xs font-semibold">
                  Accept Recommendation
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-900/80 text-amber-200 border border-amber-700 text-xs font-semibold">
                  Modify Parameters
                </span>
                <span className="px-2.5 py-1 rounded bg-rose-900/80 text-rose-200 border border-rose-700 text-xs font-semibold">
                  Reject with Reason
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
