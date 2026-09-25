import React from 'react';
import { EDITORIAL_ASSETS } from '../../assets/editorialImages';
import { TryAshaDemoButton } from '../common/TryAshaDemoButton';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PremiumCtaSectionProps {
  onNavigate: (section: string) => void;
  onStartAshaDemo?: () => void;
}

export const PremiumCtaSection: React.FC<PremiumCtaSectionProps> = ({
  onNavigate,
  onStartAshaDemo,
}) => {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-[#091124] text-white border border-slate-800 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Copy & CTA */}
        <div className="p-8 sm:p-12 lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>START YOUR AUDIT IN SECONDS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            READY TO ANALYZE YOUR BUSINESS?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Upload your data and turn business information into clearer decisions. Grounded in mathematical evidence—decided by you.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer hover:shadow-teal-900/30 whitespace-nowrap"
            >
              <span>ANALYZE MY BUSINESS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <TryAshaDemoButton
              onStartDemo={onStartAshaDemo || (() => onNavigate('analyze'))}
              size="large"
            />
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-amber-300/90 font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI analyzes. Humans decide. Zero exposure protocol.</span>
          </div>
        </div>

        {/* Right Visual Image */}
        <div className="relative h-64 sm:h-80 lg:h-full lg:col-span-5 overflow-hidden">
          <img
            src={EDITORIAL_ASSETS.businessDataAnalytics}
            alt="Business Data Analysis"
            className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#091124] via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};
