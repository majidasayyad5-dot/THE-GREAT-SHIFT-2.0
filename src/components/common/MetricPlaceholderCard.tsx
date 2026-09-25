import React from 'react';
import { FrameworkPillar } from '../../types/bi';

interface MetricPlaceholderCardProps {
  label: string;
  pillar: FrameworkPillar;
  category: string;
  description: string;
  expectedUnit: string;
  computationFormula: string;
  onInitiateUpload?: () => void;
}

export const MetricPlaceholderCard: React.FC<MetricPlaceholderCardProps> = ({
  label,
  pillar,
  category,
  description,
  expectedUnit,
  computationFormula,
  onInitiateUpload,
}) => {
  const pillarBorderColor =
    pillar === 'access'
      ? 'border-teal-600/30'
      : pillar === 'intelligence'
      ? 'border-cyan-600/30'
      : 'border-amber-600/30';

  const pillarTagColor =
    pillar === 'access'
      ? 'text-teal-700'
      : pillar === 'intelligence'
      ? 'text-cyan-700'
      : 'text-amber-700';

  return (
    <div className={`bg-white border ${pillarBorderColor} rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-400 transition-colors`}>
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            {category}
          </span>
          <span className={`text-[10px] font-mono font-medium ${pillarTagColor}`}>
            {pillar.toUpperCase()}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-slate-900 tracking-tight mb-1">
          {label}
        </h4>

        {/* Tabular Value Display adhering to Zero Fake Numbers Rule */}
        <div className="my-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-mono tabular-nums font-bold text-slate-300">
            —
          </span>
          <span className="text-xs font-mono text-slate-400">
            {expectedUnit}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-mono truncate max-w-[190px]" title={computationFormula}>
          fx: {computationFormula}
        </span>
        <button
          onClick={onInitiateUpload}
          className="text-teal-700 hover:text-teal-850 font-medium hover:underline cursor-pointer"
        >
          Ingest Data
        </button>
      </div>
    </div>
  );
};
