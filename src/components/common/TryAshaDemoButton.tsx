import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TryAshaDemoButtonProps {
  onStartDemo: () => void;
  className?: string;
  size?: 'normal' | 'large';
}

export const TryAshaDemoButton: React.FC<TryAshaDemoButtonProps> = ({
  onStartDemo,
  className = '',
  size = 'normal',
}) => {
  return (
    <button
      onClick={onStartDemo}
      type="button"
      className={`group relative bg-teal-800 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-3 cursor-pointer border border-teal-600/50 ${
        size === 'large' ? 'px-5 py-3 text-sm' : 'px-4 py-2 text-xs'
      } ${className}`}
    >
      <div className="w-7 h-7 rounded-lg bg-teal-700/80 border border-teal-500/40 flex items-center justify-center text-teal-200 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-teal-200" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-1.5 leading-tight tracking-wide font-extrabold text-white">
          <span>TRY ASHA'S DEMO</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-teal-300" />
        </div>
        <span className="text-[10px] text-teal-200 font-mono font-normal block">
          Fictional demo business
        </span>
      </div>
    </button>
  );
};
