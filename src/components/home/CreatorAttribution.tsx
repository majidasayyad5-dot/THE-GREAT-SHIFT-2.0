import React from 'react';

export const CreatorAttribution: React.FC = () => {
  return (
    <div className="py-12 border-t border-slate-200/80 text-center select-none font-sans">
      <div className="max-w-md mx-auto space-y-2.5">
        <div className="flex items-center justify-center gap-3 text-slate-300">
          <div className="w-8 h-[1px] bg-slate-300" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-slate-400 font-semibold">
            CREATED BY
          </span>
          <div className="w-8 h-[1px] bg-slate-300" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Majida Sayyad
          </h3>
          <p className="text-xs text-slate-500 font-medium tracking-normal">
            B.Com IT • First Year
          </p>
        </div>

        <div className="pt-0.5">
          <span className="inline-block text-[11px] font-mono text-teal-700 font-semibold tracking-wider">
            THE GREAT SHIFT 2.0
          </span>
        </div>
      </div>
    </div>
  );
};
