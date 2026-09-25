import React, { useRef } from 'react';
import {
  Database,
  BarChart3,
  Lightbulb,
  Target,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface WorkflowSliderProps {
  onNavigate: (section: string) => void;
}

export const WorkflowSlider: React.FC<WorkflowSliderProps> = ({ onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      step: '01',
      title: 'Business Data',
      badge: 'Step 1 · Input',
      description: 'Collect daily transactions, customer orders, and supply costs through direct entries or uploaded files.',
      icon: Database,
      section: 'manage_affairs',
      actionLabel: 'View Data Ledgers',
      color: 'teal',
    },
    {
      step: '02',
      title: 'Data Analysis',
      badge: 'Step 2 · Audit',
      description: 'Reconcile figures, inspect missing fields, and calculate true revenue, operating margins, and inventory buffers.',
      icon: BarChart3,
      section: 'analyze',
      actionLabel: 'Run Diagnostic',
      color: 'indigo',
    },
    {
      step: '03',
      title: 'AI Insight',
      badge: 'Step 3 · Diagnostic',
      description: 'Extract actionable commercial findings separated from AI interpretation without hallucinatory statistics.',
      icon: Lightbulb,
      section: 'insights',
      actionLabel: 'Inspect Insights',
      color: 'amber',
    },
    {
      step: '04',
      title: 'Recommendation',
      badge: 'Step 4 · Archetype',
      description: 'Match observed data patterns to mathematical machine learning models (Time-Series, K-Means Clustering, etc.).',
      icon: Target,
      section: 'recommendations',
      actionLabel: 'Review Archetypes',
      color: 'purple',
    },
    {
      step: '05',
      title: 'Human Decision',
      badge: 'Step 5 · Governance',
      description: 'Accept, Modify, or Reject AI proposals with stored strategic reasoning. AI advises; the business owner decides.',
      icon: ShieldCheck,
      section: 'decision',
      actionLabel: 'Open Decision Hub',
      color: 'emerald',
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-800 font-bold">
            OPERATIONAL PROTOCOL
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            The 5-Step Intelligence Workflow
          </h2>
        </div>

        {/* Scroll Arrow Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              onClick={() => onNavigate(item.section)}
              className="w-[280px] sm:w-[310px] shrink-0 snap-start bg-white border border-slate-200/90 hover:border-teal-500/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    STAGE {item.step}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    {item.badge}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-700 flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
