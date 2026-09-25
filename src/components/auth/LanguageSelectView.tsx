import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { SupportedLocale } from '../../types/bi';
import { Globe, Search, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface LanguageSelectViewProps {
  onContinue: () => void;
}

export const LanguageSelectView: React.FC<LanguageSelectViewProps> = ({ onContinue }) => {
  const { locale, setLocale, t, locales } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocales = locales.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.nativeName.toLowerCase().includes(q) ||
      loc.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen w-screen bg-[#070D1E] text-slate-100 flex flex-col justify-between p-6 antialiased select-none font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900/40 to-[#070D1E] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-sm">
            GS
          </div>
          <div>
            <div className="font-bold tracking-tight text-white text-sm">THE GREAT SHIFT 2.0</div>
            <div className="text-[10px] font-mono text-slate-400">Step 1 of 2: Localization Preferences</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded">
          <Globe className="w-3.5 h-3.5" />
          <span>10 Regional Languages</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="relative z-10 max-w-2xl mx-auto w-full my-auto py-6">
        <div className="bg-[#0B152F] border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400" />

          {/* Heading */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.language.choose_language}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {t.language.choose_language_desc}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.language.search_language}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-sans transition-all"
            />
          </div>

          {/* Language Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredLocales.map((loc) => {
              const isSelected = loc.code === locale;
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => setLocale(loc.code as SupportedLocale)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-950/80 border-teal-500/80 text-white shadow-sm ring-1 ring-teal-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      {loc.name}
                      {loc.code === 'en' && (
                        <span className="text-[10px] font-mono font-normal text-slate-400">(Default)</span>
                      )}
                    </span>
                    <span className="text-xs text-teal-300 font-medium">
                      {loc.nativeName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                      {loc.code.toUpperCase()}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredLocales.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              No language found matching "{searchQuery}".
            </div>
          )}

          {/* Action Row */}
          <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Selected:</span>
              <strong className="text-teal-300 font-semibold">
                {locales.find((l) => l.code === locale)?.name} ({locales.find((l) => l.code === locale)?.nativeName})
              </strong>
            </div>

            <button
              onClick={onContinue}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-teal-500/20 active:scale-[0.98] cursor-pointer"
            >
              <span>{t.language.select_and_continue}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center py-2 text-xs text-slate-400">
        All language settings apply to the business management UI and labels without modifying raw financial rows.
      </footer>
    </div>
  );
};
