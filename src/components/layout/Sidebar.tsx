import React, { useState } from 'react';
import { NavSection, BusinessLevelId } from '../../types/bi';
import { AffairTab } from '../views/ManageAffairsView';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { useI18n } from '../../context/I18nContext';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Sparkles,
  Database,
  Lightbulb,
  LineChart,
  Cpu,
  TrendingUp,
  UserCheck,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Package,
  Boxes,
  Users,
  Receipt,
  ShoppingCart,
  Truck,
  CheckSquare,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection, affairTab?: AffairTab) => void;
  selectedLevel: BusinessLevelId;
  onSelectLevel: (levelId: BusinessLevelId) => void;
  activeAffairTab?: AffairTab;
  onCloseMobile?: () => void;
}

interface AffairsSubItem {
  tab: AffairTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AFFAIRS_SUB_ITEMS: AffairsSubItem[] = [
  { tab: 'sales', label: 'Sales', icon: DollarSign },
  { tab: 'products', label: 'Products', icon: Package },
  { tab: 'inventory', label: 'Inventory', icon: Boxes },
  { tab: 'customers', label: 'Customers', icon: Users },
  { tab: 'expenses', label: 'Expenses', icon: Receipt },
  { tab: 'orders', label: 'Orders', icon: ShoppingCart },
  { tab: 'suppliers', label: 'Suppliers', icon: Truck },
  { tab: 'tasks', label: 'Tasks', icon: CheckSquare },
  { tab: 'documents', label: 'Documents', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  selectedLevel,
  onSelectLevel,
  activeAffairTab = 'overview',
  onCloseMobile,
}) => {
  const { t } = useI18n();
  // Manage Affairs collapsible state (expanded when on manage_affairs by default)
  const [isAffairsOpen, setIsAffairsOpen] = useState<boolean>(true);

  const handleNavClick = (section: NavSection, tab?: AffairTab) => {
    onNavigate(section, tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 bg-[#091124] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none text-slate-300 h-full">
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        {/* Tier Selector Header */}
        <div className="p-3 border-b border-slate-800/80 bg-[#0B152F]/70">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{t.common.operating_tier}</span>
            <span className="text-teal-400 font-semibold font-mono text-[11px]">
              {selectedLevel === 'local_village' ? 'Tier 1' : selectedLevel === 'city_growing' ? 'Tier 2' : 'Tier 3'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {BUSINESS_LEVELS.map((level) => {
              const isSelected = level.id === selectedLevel;
              return (
                <button
                  key={level.id}
                  onClick={() => onSelectLevel(level.id)}
                  className={`text-center py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-900/90 text-teal-200 border border-teal-600/70 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={level.name}
                >
                  {level.shortName.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Navigation List */}
        <div className="py-2.5 px-2">
          <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Navigation
          </div>

          <nav className="space-y-0.5 text-xs">
            {/* 1. Dashboard */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeSection === 'dashboard' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Dashboard</span>
            </button>

            {/* 2. My Business */}
            <button
              onClick={() => handleNavClick('my_business')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'my_business'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${activeSection === 'my_business' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">My Business</span>
            </button>

            {/* 3. Manage Affairs (Collapsible with Submenu) */}
            <div>
              <div
                className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center justify-between cursor-pointer group ${
                  activeSection === 'manage_affairs'
                    ? 'bg-slate-800/80 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => {
                  handleNavClick('manage_affairs');
                  setIsAffairsOpen(true);
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Briefcase className={`w-4 h-4 shrink-0 ${activeSection === 'manage_affairs' ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="truncate">Manage Affairs</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAffairsOpen((prev) => !prev);
                  }}
                  className="p-0.5 text-slate-400 hover:text-white"
                  aria-label="Toggle Manage Affairs Submenu"
                >
                  {isAffairsOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Sub-items */}
              {isAffairsOpen && (
                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800/80 ml-4 my-1">
                  {AFFAIRS_SUB_ITEMS.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive =
                      activeSection === 'manage_affairs' && activeAffairTab === sub.tab;
                    return (
                      <button
                        key={sub.tab}
                        onClick={() => handleNavClick('manage_affairs', sub.tab)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center gap-2 transition-colors cursor-pointer ${
                          isSubActive
                            ? 'bg-teal-900/60 text-teal-200 font-bold border-l border-teal-400'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-teal-400' : 'text-slate-500'}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Analyze Business */}
            <button
              onClick={() => handleNavClick('analyze')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'analyze'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${activeSection === 'analyze' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Analyze Business</span>
            </button>

            {/* 5. Data */}
            <button
              onClick={() => handleNavClick('data')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'data'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Database className={`w-4 h-4 shrink-0 ${activeSection === 'data' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Data</span>
            </button>

            {/* 6. Insights */}
            <button
              onClick={() => handleNavClick('insights')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'insights'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Lightbulb className={`w-4 h-4 shrink-0 ${activeSection === 'insights' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Insights</span>
            </button>

            {/* 7. Charts */}
            <button
              onClick={() => handleNavClick('charts')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'charts'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LineChart className={`w-4 h-4 shrink-0 ${activeSection === 'charts' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Charts</span>
            </button>

            {/* 8. AI Recommendations */}
            <button
              onClick={() => handleNavClick('recommendations')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'recommendations'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className={`w-4 h-4 shrink-0 ${activeSection === 'recommendations' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">AI Recommendations</span>
            </button>

            {/* 9. Business Impact */}
            <button
              onClick={() => handleNavClick('impact')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'impact'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className={`w-4 h-4 shrink-0 ${activeSection === 'impact' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Business Impact</span>
            </button>

            {/* 10. Human Decision */}
            <button
              onClick={() => handleNavClick('decision')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'decision'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className={`w-4 h-4 shrink-0 ${activeSection === 'decision' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Human Decision</span>
            </button>

            {/* 11. How It Works */}
            <button
              onClick={() => handleNavClick('methodology')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'methodology'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className={`w-4 h-4 shrink-0 ${activeSection === 'methodology' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">How It Works</span>
            </button>

            {/* 12. Settings */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center gap-2.5 cursor-pointer ${
                activeSection === 'settings'
                  ? 'bg-teal-950/70 text-white font-semibold border-l-2 border-teal-400 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className={`w-4 h-4 shrink-0 ${activeSection === 'settings' ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="truncate">Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-2.5 border-t border-slate-800 text-[10px] text-slate-400 bg-[#060B18] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-slate-400">ONLINE</span>
        </div>
        <span className="font-mono text-slate-500">v2.0</span>
      </div>
    </aside>
  );
};
