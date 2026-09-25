import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { BusinessProfile, BusinessLevelId, NavSection } from '../../types/bi';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import {
  Building2,
  MapPin,
  Package,
  Layers,
  Edit3,
  Check,
  X,
  ShieldCheck,
  Briefcase,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  FileText
} from 'lucide-react';

interface MyBusinessViewProps {
  profile: BusinessProfile;
  onUpdateProfile: (updated: BusinessProfile) => void;
  onNavigate: (section: NavSection) => void;
}

export const MyBusinessView: React.FC<MyBusinessViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
}) => {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(profile.businessName);
  const [editType, setEditType] = useState(profile.businessType);
  const [editLevel, setEditLevel] = useState<BusinessLevelId>(profile.businessLevel);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editOfferings, setEditOfferings] = useState(profile.primaryOfferings);

  const currentLevelObj = BUSINESS_LEVELS.find((l) => l.id === profile.businessLevel) || BUSINESS_LEVELS[1];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      businessName: editName.trim() || profile.businessName,
      businessType: editType || profile.businessType,
      businessLevel: editLevel,
      location: editLocation.trim() || profile.location,
      primaryOfferings: editOfferings.trim() || profile.primaryOfferings,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(profile.businessName);
    setEditType(profile.businessType);
    setEditLevel(profile.businessLevel);
    setEditLocation(profile.location);
    setEditOfferings(profile.primaryOfferings);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-teal-800 tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-teal-700" />
            <span>Profile Settings</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {t.my_business.title}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.my_business.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.my_business.edit_profile}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.common.cancel}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Profile Cards & Level Connection */}
      {isEditing ? (
        /* Edit Form */
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-teal-700" />
            <span>{t.my_business.edit_profile}</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.setup.business_name}
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-teal-700 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.setup.business_type}
                </label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-teal-700 focus:bg-white"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.setup.business_level}
                </label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value as BusinessLevelId)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-teal-700 focus:bg-white"
                >
                  <option value="local_village">Tier 1: LOCAL / VILLAGE</option>
                  <option value="city_growing">Tier 2: CITY / GROWING</option>
                  <option value="international_global">Tier 3: INTERNATIONAL / GLOBAL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.setup.location}
              </label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-teal-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.setup.primary_offerings}
              </label>
              <input
                type="text"
                value={editOfferings}
                onChange={(e) => setEditOfferings(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-teal-700 focus:bg-white"
              />
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.my_business.save_changes}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-all cursor-pointer"
              >
                {t.common.cancel}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Read-only profile overview */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-lg">
                    {profile.businessName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{profile.businessName}</h2>
                    <p className="text-xs text-slate-500 font-mono">{profile.businessType}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                    Tier {profile.businessLevel === 'local_village' ? '1' : profile.businessLevel === 'city_growing' ? '2' : '3'}
                  </span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" />
                    Business Name
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{profile.businessName}</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-teal-700" />
                    Commercial Industry
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{profile.businessType}</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    Market / Jurisdiction
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{profile.location || 'Not Specified'}</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-teal-700" />
                    Primary Products / Services
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{profile.primaryOfferings || 'Not Specified'}</p>
                </div>
              </div>

              {/* Action Buttons to Manage Affairs or Analyze */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onNavigate('manage_affairs')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-300" />
                  <span>Go to Manage Business Affairs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('analyze')}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Analyze Dataset</span>
                </button>
              </div>
            </div>

            {/* Privacy & Governance Notice */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Data Privacy & Security</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Your business details and commercial data are stored strictly within your secure session workspace.
                No bank credentials, financial passwords, or private transaction records are shared externally.
              </p>
            </div>
          </div>

          {/* Operating Level Connection & Focus Panel */}
          <div className="space-y-4">
            <div className="bg-[#091124] text-white border border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm tracking-tight text-white">OPERATING TIER</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 font-bold">
                  {currentLevelObj.shortName}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-teal-300">{currentLevelObj.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentLevelObj.description}
                </p>
              </div>

              {/* Dynamic Level Specific Priorities */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Tailored Analytical Focus:
                </span>

                {profile.businessLevel === 'local_village' && (
                  <ul className="text-xs text-slate-300 space-y-1.5 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Basic business records & cash realizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Stock counting & inventory buffer check</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Customer repeat purchase & credit tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Direct expenses & utility overhead</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Foundational digital access & simple insights</span>
                    </li>
                  </ul>
                )}

                {profile.businessLevel === 'city_growing' && (
                  <ul className="text-xs text-slate-300 space-y-1.5 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Sales trends & periodic revenue velocity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Inventory turnover & stockout risk prevention</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Customer segmentation & ticket size analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Product performance & SKU Pareto distribution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Demand forecasting & operational efficiency</span>
                    </li>
                  </ul>
                )}

                {profile.businessLevel === 'international_global' && (
                  <ul className="text-xs text-slate-300 space-y-1.5 font-sans">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Regional analysis & cross-market comparisons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Currency-aware reporting & FX sensitivity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Multi-country customer demographics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Cross-border supply chain & freight logistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>Large datasets & international business analysis</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
