import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { BusinessProfile, BusinessLevelId } from '../../types/bi';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { Building, MapPin, Package, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BusinessSetupViewProps {
  initialProfile?: Partial<BusinessProfile>;
  onComplete: (profile: BusinessProfile) => void;
  onSkip?: () => void;
}

export const BusinessSetupView: React.FC<BusinessSetupViewProps> = ({
  initialProfile,
  onComplete,
  onSkip,
}) => {
  const { t } = useI18n();

  const [businessName, setBusinessName] = useState(initialProfile?.businessName || '');
  const [businessType, setBusinessType] = useState(initialProfile?.businessType || 'Retail & Commercial Trade');
  const [businessLevel, setBusinessLevel] = useState<BusinessLevelId>(initialProfile?.businessLevel || 'city_growing');
  const [location, setLocation] = useState(initialProfile?.location || '');
  const [primaryOfferings, setPrimaryOfferings] = useState(initialProfile?.primaryOfferings || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: BusinessProfile = {
      businessName: businessName.trim() || 'My Commercial Enterprise',
      businessType: businessType || 'General Commerce',
      businessLevel,
      location: location.trim() || 'Regional Market',
      primaryOfferings: primaryOfferings.trim() || 'Commercial Goods & Services',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onComplete(finalProfile);
  };

  const handleSkip = () => {
    const defaultProfile: BusinessProfile = {
      businessName: 'My Commercial Enterprise',
      businessType: 'Retail & Commercial Trade',
      businessLevel: 'city_growing',
      location: 'Regional Commercial Hub',
      primaryOfferings: 'Commercial Products & Inventory',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onComplete(defaultProfile);
  };

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
            <div className="text-[10px] font-mono text-slate-400">Step 2 of 2: Enterprise Architecture Setup</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Credential Requirement</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="relative z-10 max-w-2xl mx-auto w-full my-auto py-6">
        <div className="bg-[#0B152F] border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400" />

          {/* Heading */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.setup.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {t.setup.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-400" />
                {t.setup.business_name} <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={t.setup.business_name_placeholder}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-sans transition-all"
              />
            </div>

            {/* Field: Business Type & Level in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-teal-400" />
                  {t.setup.business_type}
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400 cursor-pointer"
                >
                  <option value="Retail & Commercial Trade">Retail & Commercial Trade</option>
                  <option value="Handloom, Apparel & Textiles">Handloom, Apparel & Textiles</option>
                  <option value="Manufacturing & Fabrication">Manufacturing & Fabrication</option>
                  <option value="Grocery, Food & Provisions">Grocery, Food & Provisions</option>
                  <option value="Services, Maintenance & Repair">Services, Maintenance & Repair</option>
                  <option value="Wholesale & Bulk Distribution">Wholesale & Bulk Distribution</option>
                  <option value="Agriculture & Agritech">Agriculture & Agritech</option>
                  <option value="Technology & Digital Commerce">Technology & Digital Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  {t.setup.business_level} <span className="text-teal-400">*</span>
                </label>
                <select
                  value={businessLevel}
                  onChange={(e) => setBusinessLevel(e.target.value as BusinessLevelId)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="local_village">Tier 1: LOCAL / VILLAGE</option>
                  <option value="city_growing">Tier 2: CITY / GROWING</option>
                  <option value="international_global">Tier 3: INTERNATIONAL / GLOBAL</option>
                </select>
              </div>
            </div>

            {/* Level Explanation Box */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Selected Level Characteristics:</span>
                <span className="text-teal-400 font-semibold">
                  {BUSINESS_LEVELS.find((l) => l.id === businessLevel)?.shortName}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {businessLevel === 'local_village' &&
                  'Focus: Basic business records, sales receipts, cash flow, stock ledger, customer relations, and foundational digital access.'}
                {businessLevel === 'city_growing' &&
                  'Focus: Sales trends, multi-product velocity, customer segmentation, inventory reorder alerts, and operational efficiency.'}
                {businessLevel === 'international_global' &&
                  'Focus: Multi-market performance, regional distributions, currency-aware tracking, and global supply chain indicators.'}
              </p>
            </div>

            {/* Field: Location / Market */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {t.setup.location}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.setup.location_placeholder}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-sans transition-all"
              />
            </div>

            {/* Field: Primary Products or Services */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-teal-400" />
                {t.setup.primary_offerings}
              </label>
              <input
                type="text"
                value={primaryOfferings}
                onChange={(e) => setPrimaryOfferings(e.target.value)}
                placeholder={t.setup.primary_offerings_placeholder}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-sans transition-all"
              />
            </div>

            {/* Explicit Privacy Notice - No banking info */}
            <div className="p-3 bg-teal-950/30 border border-teal-800/40 rounded-lg text-xs text-teal-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-teal-300">
                {t.setup.privacy_promise}
              </p>
            </div>

            {/* Submit & Skip Actions */}
            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1"
              >
                {t.setup.skip_optional}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-teal-500/20 active:scale-[0.98] cursor-pointer"
              >
                <span>{t.setup.continue_to_dashboard}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full text-center py-2 text-xs text-slate-400">
        You can update your business profile, operating level, and market jurisdiction at any time from "My Business".
      </footer>
    </div>
  );
};
