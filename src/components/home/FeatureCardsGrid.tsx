import React from 'react';
import {
  Briefcase,
  BarChart3,
  LineChart,
  Lightbulb,
  Target,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface FeatureCardsGridProps {
  onNavigate: (section: string) => void;
}

export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'manage_affairs',
      title: 'Business Management',
      description: 'Track daily sales, physical inventory buffers, customer accounts, and operating costs in organized digital ledgers.',
      icon: Briefcase,
      category: 'Core Ledgers',
      color: 'teal',
    },
    {
      id: 'analyze',
      title: 'Data Analysis & Audit',
      description: 'Import CSV, XLSX, or JSON spreadsheets with automatic header mapping, completeness scoring, and multi-source reconciliation.',
      icon: BarChart3,
      category: 'Quality Engine',
      color: 'indigo',
    },
    {
      id: 'charts',
      title: 'Smart Charts',
      description: 'Interactive visual trends for revenue velocity, SKU contribution shares, and operational cost breakdowns without fake smoothing.',
      icon: LineChart,
      category: 'Visual Trends',
      color: 'cyan',
    },
    {
      id: 'insights',
      title: 'AI Commercial Insights',
      description: 'Evidence-first diagnostics that separate observed figures from AI interpretation, explicitly noting data limitations.',
      icon: Lightbulb,
      category: 'Diagnostic Engine',
      color: 'amber',
    },
    {
      id: 'recommendations',
      title: 'AI / ML Recommendations',
      description: 'Algorithmic archetypes (Time-Series, K-Means Clustering, Regression) matched to actual observed business gaps.',
      icon: Target,
      category: 'Machine Learning',
      color: 'purple',
    },
    {
      id: 'decision',
      title: 'Human Decision Hub',
      description: 'Formal sign-off workflow where you Accept, Modify, or Reject AI proposals with stored rationale and complete audit history.',
      icon: ShieldCheck,
      category: 'Governance Protocol',
      color: 'emerald',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 font-bold">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Everything Required to Decide with Confidence
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          Six tightly integrated modules designed specifically for small business owners and commercial operators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              onClick={() => onNavigate(feat.id)}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-700 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-800 font-semibold transition-colors">
                    {feat.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-700 group-hover:text-teal-800 gap-1.5">
                <span>Explore Module</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
