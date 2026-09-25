import React, { useState, useEffect } from 'react';
import { NavSection, BusinessLevelId, BusinessProfile, UserSession, SupportedLocale } from '../../types/bi';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { useI18n } from '../../context/I18nContext';
import {
  getSelectedCurrency,
  setSelectedCurrency,
  SUPPORTED_CURRENCIES,
  CurrencyConfig,
} from '../../utils/currency';
import {
  Layers,
  Globe,
  Building2,
  Search,
  Sparkles,
  Coins,
  ChevronDown,
} from 'lucide-react';

interface TopNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  selectedLevel: BusinessLevelId;
  onSelectLevel: (levelId: BusinessLevelId) => void;
  profile?: BusinessProfile | null;
  session?: UserSession | null;
  onOpenSearch?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onNavigate,
  selectedLevel,
  onSelectLevel,
  profile,
  session,
  onOpenSearch,
}) => {
  const { locale, setLocale, t, locales } = useI18n();
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyConfig>(() => getSelectedCurrency());

  useEffect(() => {
    const handleCurrencyChanged = (e: any) => {
      if (e.detail) {
        setCurrentCurrency(e.detail);
      }
    };
    window.addEventListener('app_currency_changed', handleCurrencyChanged);
    return () => window.removeEventListener('app_currency_changed', handleCurrencyChanged);
  }, []);

  const handleCurrencySelect = (code: string) => {
    const updated = setSelectedCurrency(code);
    setCurrentCurrency(updated);
  };

  return (
    <header className="h-16 bg-[#091124] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shrink-0 z-30 select-none">
      {/* Zone 1: Logo & Brand Identity (Spacious, elegant) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-white font-sans leading-tight">
              THE GREAT SHIFT 2.0
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Business Intelligence &amp; Growth
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Global Search Quick Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={() => {
            if (onOpenSearch) {
              onOpenSearch();
            } else {
              onNavigate('dashboard');
            }
          }}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#0E1A38] border border-slate-700/80 hover:border-teal-500/50 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-teal-400" />
            <span>Search anything…</span>
          </div>
          <kbd className="text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 px-1.5 py-0.5 rounded font-semibold">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Currency, Language, Level & Profile (Spacious & Clean) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Currency Selector (Support all currencies) */}
        <div className="flex items-center gap-1.5 bg-[#0E1A38] border border-slate-700/80 hover:border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white transition-colors">
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <select
            value={currentCurrency.code}
            onChange={(e) => handleCurrencySelect(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs pr-1"
            title="Select Operating Currency"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code} className="bg-slate-900 text-slate-100">
                {curr.code} ({curr.symbol.trim()})
              </option>
            ))}
          </select>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-[#0E1A38] border border-slate-700/80 hover:border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white transition-colors">
          <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as SupportedLocale)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs pr-1"
            title="Switch Language"
          >
            {locales.map((loc) => (
              <option key={loc.code} value={loc.code} className="bg-slate-900 text-slate-100">
                {loc.nativeName} ({loc.name})
              </option>
            ))}
          </select>
        </div>

        {/* Business Level Selector */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0E1A38] border border-slate-700/80 hover:border-slate-600 rounded-lg px-2.5 py-1 text-xs transition-colors">
          <Layers className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="text-slate-400">{t.common.level}:</span>
          <select
            value={selectedLevel}
            onChange={(e) => onSelectLevel(e.target.value as BusinessLevelId)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
          >
            {BUSINESS_LEVELS.map((lvl) => (
              <option key={lvl.id} value={lvl.id} className="bg-slate-900 text-slate-100">
                {lvl.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Business Profile Quick Link */}
        {profile && (
          <button
            onClick={() => onNavigate('my_business')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 transition-colors cursor-pointer"
            title={profile.businessName}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-medium truncate max-w-[90px] sm:max-w-[120px]">
              {profile.businessName}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
