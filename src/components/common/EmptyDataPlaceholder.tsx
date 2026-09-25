import React from 'react';
import { UploadCloud, FileSpreadsheet, ArrowRight, ShieldAlert } from 'lucide-react';

interface EmptyDataPlaceholderProps {
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
  expectedDataDesc?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyDataPlaceholder: React.FC<EmptyDataPlaceholderProps> = ({
  title,
  subtitle,
  actionText = 'Upload Business Dataset',
  onAction,
  expectedDataDesc,
  icon: CustomIcon,
}) => {
  const Icon = CustomIcon || UploadCloud;

  return (
    <div className="bg-slate-50/70 border border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 mb-3">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-sm font-semibold text-slate-800 tracking-tight mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-500 max-w-md mb-4 leading-relaxed">
        {subtitle}
      </p>

      {expectedDataDesc && (
        <div className="bg-white border border-slate-200 rounded px-3 py-2 text-[11px] text-slate-600 font-mono mb-4 text-left max-w-md w-full">
          <span className="text-slate-400 font-semibold uppercase block text-[9px] mb-0.5">
            Awaiting Canonical Input Schema:
          </span>
          {expectedDataDesc}
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 transition-colors rounded shadow-sm cursor-pointer"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
