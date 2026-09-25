import React from 'react';
import { NavSection } from '../../types/bi';
import {
  Sparkles,
  RotateCcw,
  XCircle,
  LayoutDashboard,
  Database,
  LineChart,
  Lightbulb,
  Cpu,
  TrendingUp,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

interface DemoModeHeaderProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onExitDemo: () => void;
}

export const DemoModeHeader: React.FC<DemoModeHeaderProps> = ({
  activeSection,
  onNavigate,
  onExitDemo,
}) => {
  const demoNavItems: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'charts', label: 'Charts', icon: LineChart },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'recommendations', label: 'Recommendations', icon: Cpu },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'decision', label: 'Decision', icon: UserCheck },
  ];

  return (
    <div className="space-y-3 mb-6 animate-fadeIn">
      {/* 1. DEMO MODE INDICATOR BANNER */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm text-xs font-medium">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-extrabold uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[10px]">
            DEMO MODE
          </span>
          <span className="font-bold text-slate-950">Asha's Handmade Clothing</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-800 text-[11px] font-mono">Fictional Dataset (Not real survey or client data)</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExitDemo}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <XCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Exit Demo</span>
          </button>
        </div>
      </div>

      {/* 2. JUDGE-FRIENDLY SUMMARY BAR */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs divide-x-0 sm:divide-x divide-slate-100">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              BUSINESS
            </span>
            <span className="font-bold text-slate-900 truncate block">
              Asha's Handmade Clothing
            </span>
          </div>

          <div className="sm:pl-4 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              LEVEL
            </span>
            <span className="font-bold text-teal-800 truncate block">
              Local / Village
            </span>
          </div>

          <div className="sm:pl-4 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              DATA
            </span>
            <span className="font-semibold text-slate-800 truncate block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Fictional Demo Dataset
            </span>
          </div>

          <div className="sm:pl-4 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              STATUS
            </span>
            <span className="font-bold text-emerald-700 truncate block flex items-center gap-1">
              ✓ Analysis Ready
            </span>
          </div>
        </div>
      </div>

      {/* 3. COMPACT DEMO NAVIGATION BAR */}
      <div className="bg-[#091124] border border-slate-800 p-1.5 rounded-xl shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 shrink-0">
            DEMO WALKTHROUGH:
          </span>
          {demoNavItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onExitDemo}
          title="Clear demo and return to normal application"
          className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
