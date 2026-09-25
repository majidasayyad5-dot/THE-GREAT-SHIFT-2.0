import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { BusinessProfile, UserSession, SupportedLocale, NavSection } from '../../types/bi';
import {
  getSelectedCurrency,
  setSelectedCurrency,
  SUPPORTED_CURRENCIES,
  CurrencyConfig,
} from '../../utils/currency';
import {
  Globe,
  Settings,
  ShieldCheck,
  Building,
  User,
  LogOut,
  RefreshCw,
  Database,
  Lock,
  ArrowRight,
  Coins,
} from 'lucide-react';

interface SettingsViewProps {
  profile: BusinessProfile;
  session: UserSession | null;
  onNavigate: (section: NavSection) => void;
  onResetSession: () => void;
  onRestartOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  session,
  onNavigate,
  onResetSession,
  onRestartOnboarding,
}) => {
  const { locale, setLocale, t, locales } = useI18n();
  const [activeCurrency, setActiveCurrency] = useState<CurrencyConfig>(() => getSelectedCurrency());

  useEffect(() => {
    const handleCurrencyChanged = (e: any) => {
      if (e.detail) {
        setActiveCurrency(e.detail);
      }
    };
    window.addEventListener('app_currency_changed', handleCurrencyChanged);
    return () => window.removeEventListener('app_currency_changed', handleCurrencyChanged);
  }, []);

  const handleSelectCurrency = (code: string) => {
    const updated = setSelectedCurrency(code);
    setActiveCurrency(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-800 tracking-wider">
          <Settings className="w-3.5 h-3.5 text-teal-700" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
          {t.settings.title}
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency & Financial Formatting Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Operating Currency
              </h2>
            </div>
            <span className="text-[11px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
              Active: {activeCurrency.code} ({activeCurrency.symbol.trim()})
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Select your preferred operating currency. All revenue calculations, unit economics, price logs, and expense reports will format with this symbol.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {SUPPORTED_CURRENCIES.map((curr) => {
              const isSelected = curr.code === activeCurrency.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => handleSelectCurrency(curr.code)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-600 text-amber-900 font-semibold ring-1 ring-amber-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{curr.code}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[90px]">{curr.name}</span>
                  </div>
                  <span className="text-sm font-bold text-amber-700">
                    {curr.symbol.trim()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language & Localization Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">
                {t.settings.active_language}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
              10 Regional Languages
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {t.language.choose_language_desc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {locales.map((loc) => {
              const isSelected = loc.code === locale;
              return (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as SupportedLocale)}
                  className={`p-2 rounded border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs">{loc.name}</span>
                    <span className="text-[10px] text-teal-800">{loc.nativeName}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    {loc.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Identity & Authentication Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">
                {t.settings.auth_status}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Verified Session
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="font-semibold text-slate-900">
                  {session?.authProvider === 'google' ? 'Google Identity Protocol' : 'Verified Session'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Identity:</span>
                <span className="font-semibold text-slate-900">{session?.email || 'Active Operator'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Workspace:</span>
                <span className="font-semibold text-slate-900">{profile.businessName}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Exposure Protocol</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Passwords, bank account numbers, and personal cards are never requested or stored.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={onRestartOnboarding}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Revisit Onboarding Flow</span>
            </button>

            <button
              onClick={onResetSession}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.settings.switch_account}</span>
            </button>
          </div>
        </div>

        {/* Business Profile Quick Link */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">
                {t.settings.active_profile}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('my_business')}
              className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Manage in Profile</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Name:</span>
              <strong className="text-slate-900">{profile.businessName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="text-slate-900">{profile.businessType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Level:</span>
              <span className="font-mono text-teal-800 font-bold uppercase">
                {profile.businessLevel.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Market:</span>
              <span className="text-slate-900">{profile.location || 'Local / Regional'}</span>
            </div>
          </div>
        </div>

        {/* Reset Session & Storage */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Workspace Governance
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            All loaded ledger rows, business diagnostic evaluations, and user affair logs are held locally in your browser memory and private local storage.
          </p>

          <div className="pt-2">
            <button
              onClick={onResetSession}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer transition-colors"
            >
              Clear Session & Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
