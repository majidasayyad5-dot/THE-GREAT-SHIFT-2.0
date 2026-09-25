import React from 'react';
import { Database, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

interface WhyThisProductProps {
  onNavigate: (section: string) => void;
}

export const WhyThisProduct: React.FC<WhyThisProductProps> = ({ onNavigate }) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 font-bold">
            WHY THIS PLATFORM
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Built for Real Small Business Realities
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          Traditional enterprise BI is too complex; raw spreadsheets lack intelligence. We bridge the gap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Point 1: ACCESS */}
        <div
          onClick={() => onNavigate('manage_affairs')}
          className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-teal-500/80 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-teal-800 font-bold mb-1">
              PILLAR 1 · ACCESS
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
              Get business data organized.
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Consolidate paper receipts, spreadsheets, or simple daily logs into unified sales and inventory ledgers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-800 gap-1.5">
            <span>Manage Ledgers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Point 2: INTELLIGENCE */}
        <div
          onClick={() => onNavigate('analyze')}
          className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-teal-500/80 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold mb-1">
              PILLAR 2 · INTELLIGENCE
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
              Turn data into useful insights.
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Deterministic calculations surface revenue concentration, stockout risks, and margin leaks without hallucinations.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700 group-hover:text-amber-800 gap-1.5">
            <span>Run Business Analysis</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Point 3: SCALE */}
        <div
          onClick={() => onNavigate('recommendations')}
          className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-teal-500/80 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-800 font-bold mb-1">
              PILLAR 3 · SCALE
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
              Use better information to support growth.
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Algorithmic forecasting and customer clustering give you corporate-grade tools with human decision governance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-700 group-hover:text-indigo-800 gap-1.5">
            <span>View Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
