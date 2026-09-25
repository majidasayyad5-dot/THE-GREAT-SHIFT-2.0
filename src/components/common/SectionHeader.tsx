import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  frameworkStage?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  frameworkStage,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-200/80 gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          {frameworkStage && (
            <>
              <span className="font-mono text-teal-700 font-semibold tracking-wide">
                {frameworkStage}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
            </>
          )}
          {badgeText && (
            <>
              <span className="font-mono text-slate-500">
                {badgeText}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
            </>
          )}
          <span className="text-slate-400">THE GREAT SHIFT 2.0</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
