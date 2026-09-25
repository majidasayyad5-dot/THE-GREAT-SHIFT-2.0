import React, { useMemo, useState, useEffect } from 'react';
import {
  BusinessLevelId,
  NavSection,
  IngestedDataset,
  BusinessProfile,
  BusinessAffairsData,
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
  HumanDecisionRecord,
  GeminiKeyInsight,
} from '../../types/bi';
import { AffairTab } from './ManageAffairsView';
import { BUSINESS_LEVELS, RECOMMENDED_AI_ML_ARCHETYPES } from '../../data/frameworkData';
import { buildUnifiedBusinessData } from '../../utils/unifiedDataLayer';
import { runUnifiedBusinessAnalysis } from '../../utils/unifiedAnalysisEngine';
import { generateDeterministicFallbackInsights } from '../../utils/geminiInsightsClient';
import { getStoredDecisions, getRecommendationStatus } from '../../utils/decisionStorage';
import { useI18n } from '../../context/I18nContext';
import { TryAshaDemoButton } from '../common/TryAshaDemoButton';
import { GlobalSearchBar } from '../search/GlobalSearchBar';
import { HeroSlider } from '../home/HeroSlider';
import { WhyThisProduct } from '../home/WhyThisProduct';
import { BusinessLevelCards } from '../home/BusinessLevelCards';
import { ProductShowcaseTabs } from '../home/ProductShowcaseTabs';
import { FeatureCardsGrid } from '../home/FeatureCardsGrid';
import { WorkflowSlider } from '../home/WorkflowSlider';
import { PremiumCtaSection } from '../home/PremiumCtaSection';
import { CreatorAttribution } from '../home/CreatorAttribution';
import { SiteFooter } from '../layout/SiteFooter';
import {
  Sparkles,
  ArrowRight,
  Database,
  DollarSign,
  Package,
  Receipt,
  Boxes,
  UploadCloud,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection, affairTab?: AffairTab) => void;
  onSelectLevel: (levelId: BusinessLevelId) => void;
  activeDataset?: IngestedDataset | null;
  profile?: BusinessProfile | null;
  businessAffairs?: BusinessAffairsData;
  unifiedDataLayer?: UnifiedBusinessDataLayer;
  unifiedAnalysis?: UnifiedBusinessAnalysisReport;
  onStartAshaDemo?: () => void;
  isDemoMode?: boolean;
  onOpenAssistant?: (query?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  selectedLevel,
  onNavigate,
  onSelectLevel,
  activeDataset,
  profile,
  businessAffairs,
  unifiedDataLayer: propDataLayer,
  unifiedAnalysis: propAnalysis,
  onStartAshaDemo,
  isDemoMode = false,
  onOpenAssistant,
}) => {
  const { t } = useI18n();
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[0];

  const handleNav = (section: any, tab?: any) => onNavigate(section as NavSection, tab);

  // Derive Unified Business Analysis deterministically
  const dataLayer = useMemo(() => {
    return propDataLayer || buildUnifiedBusinessData(businessAffairs, activeDataset);
  }, [propDataLayer, businessAffairs, activeDataset]);

  const analysis: UnifiedBusinessAnalysisReport = useMemo(() => {
    return propAnalysis || runUnifiedBusinessAnalysis(dataLayer);
  }, [propAnalysis, dataLayer]);

  // Derive fallback/real insights from data
  const calculatedInsights = useMemo(() => {
    return generateDeterministicFallbackInsights(analysis, dataLayer);
  }, [analysis, dataLayer]);

  // Track recorded decisions
  const [decisions, setDecisions] = useState<HumanDecisionRecord[]>(() => getStoredDecisions());

  useEffect(() => {
    const handleUpdate = () => {
      setDecisions(getStoredDecisions());
    };
    window.addEventListener('human_decisions_updated', handleUpdate);
    return () => window.removeEventListener('human_decisions_updated', handleUpdate);
  }, []);

  // Filter recommendations pending review
  const pendingRecommendations = useMemo(() => {
    return RECOMMENDED_AI_ML_ARCHETYPES.map((arch) => ({
      ...arch,
      status: getRecommendationStatus(arch.id, decisions),
    })).filter((arch) => arch.status === 'New' || arch.status === 'Under Review');
  }, [decisions]);

  const hasAnyData =
    dataLayer.transactions.length > 0 ||
    dataLayer.products.length > 0 ||
    dataLayer.expenses.length > 0 ||
    (activeDataset && activeDataset.rowCount > 0);

  return (
    <div className="space-y-12">
      {/* 1. Modern SaaS Homepage Hero */}
      <section className="bg-[#091124] text-white border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand & Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{isDemoMode ? 'DEMO MODE · FICTIONAL DATA LOADED' : 'AI BUSINESS INTELLIGENCE & GROWTH'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                THE GREAT SHIFT 2.0
              </h1>
              <p className="text-xl sm:text-2xl font-serif italic text-teal-300">
                “Turn business data into clearer decisions.”
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-sans">
                Transform raw sales, inventory, and expense records into actionable intelligence with mathematical precision. Grounded in verified evidence—governed by human decisions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('analyze')}
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-900/40 cursor-pointer whitespace-nowrap"
              >
                <span>ANALYZE MY BUSINESS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <TryAshaDemoButton
                onStartDemo={onStartAshaDemo || (() => onNavigate('analyze'))}
                size="large"
              />
            </div>

            {/* Governance Assurance Tagline */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-amber-300/90 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold tracking-wider">AI analyzes. Humans decide. Zero exposure protocol.</span>
            </div>
          </div>

          {/* Right Column: Hero Image Slider */}
          <div className="lg:col-span-6 w-full">
            <HeroSlider onNavigate={handleNav} onStartAshaDemo={onStartAshaDemo} />
          </div>
        </div>
      </section>

      {/* 2. Global Search Bar (Prominent & Elegant) */}
      <div className="w-full">
        <GlobalSearchBar
          onNavigate={onNavigate}
          onStartAshaDemo={onStartAshaDemo}
          onOpenAssistant={onOpenAssistant}
          businessAffairs={businessAffairs}
          activeDataset={activeDataset}
        />
      </div>

      {/* 3. Quick Actions Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            QUICK ACTIONS
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Jump directly to any workflow
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => onNavigate('manage_affairs', 'sales')}
            className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/90 hover:border-teal-500 rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 group-hover:text-teal-800 font-bold text-xs">
              <DollarSign className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Add Sale</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Record customer order</p>
          </button>

          <button
            onClick={() => onNavigate('manage_affairs', 'products')}
            className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/90 hover:border-teal-500 rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 group-hover:text-teal-800 font-bold text-xs">
              <Package className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Add Product</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Catalog SKU & pricing</p>
          </button>

          <button
            onClick={() => onNavigate('manage_affairs', 'expenses')}
            className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/90 hover:border-teal-500 rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 group-hover:text-teal-800 font-bold text-xs">
              <Receipt className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Add Expense</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Track procurement costs</p>
          </button>

          <button
            onClick={() => onNavigate('manage_affairs', 'inventory')}
            className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/90 hover:border-teal-500 rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 group-hover:text-teal-800 font-bold text-xs">
              <Boxes className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Update Inventory</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Adjust stock buffers</p>
          </button>

          <button
            onClick={() => onNavigate('data')}
            className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/90 hover:border-teal-500 rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 group-hover:text-teal-800 font-bold text-xs">
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Upload Data</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Import CSV or Excel</p>
          </button>

          <button
            onClick={() => onNavigate('analyze')}
            className="p-2.5 bg-teal-50/70 hover:bg-teal-100/80 border border-teal-300 rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-teal-950 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>Analyze Business</span>
            </div>
            <p className="text-[10px] text-teal-700 mt-0.5">Run full diagnostic</p>
          </button>
        </div>
      </div>

      {/* 4. Why This Platform (Access · Intelligence · Scale) */}
      <WhyThisProduct onNavigate={handleNav} />

      {/* 5. Business Level Cards with Authentic Imagery */}
      <BusinessLevelCards
        selectedLevel={selectedLevel}
        onSelectLevel={onSelectLevel}
        onNavigate={handleNav}
      />

      {/* 6. Product Preview Showcase (Interactive SaaS Tabs) */}
      <ProductShowcaseTabs
        dataLayer={dataLayer}
        analysis={analysis}
        onNavigate={handleNav}
      />

      {/* 7. Platform Capabilities Grid (6 Core Modules) */}
      <FeatureCardsGrid onNavigate={handleNav} />

      {/* 8. Operational Protocol (5-Step Horizontal Workflow Slider) */}
      <WorkflowSlider onNavigate={handleNav} />

      {/* 9. Live Operational Snapshot & Governance Queue */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 font-bold">
              WORKSPACE OPERATIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Live Business Ledgers &amp; Diagnostics
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Active: {currentLevel.shortName}
          </span>
        </div>
      </div>

      {/* 10. Operational Grid: BUSINESS OVERVIEW & DATA STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BUSINESS OVERVIEW */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  OPERATING CONTEXT
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Business Overview
                </h2>
              </div>
              <button
                onClick={() => onNavigate('my_business')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Edit Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-mono uppercase block">Business Name</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                  {profile?.businessName || 'My Enterprise'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-mono uppercase block">Business Type</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                  {profile?.businessType || 'Retail & Trade'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-mono uppercase block">Business Level</span>
                <span className="font-bold text-teal-800 text-sm mt-0.5 block truncate">
                  {currentLevel.name}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 flex items-center justify-between p-2.5 bg-slate-50/60 rounded-md border border-slate-100">
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase mr-2">Location:</span>
                <span className="font-semibold text-slate-800">{profile?.location || 'Regional Market'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase mr-2">Offerings:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px] inline-block align-bottom">
                  {profile?.primaryOfferings || 'General Goods'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Switch Operating Tier:</span>
            <div className="flex items-center gap-1.5">
              {BUSINESS_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    lvl.id === selectedLevel
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DATA STATUS */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  TELEMETRY READINESS
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Data Status
                </h2>
              </div>
              {hasAnyData ? (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>DATA AVAILABLE</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>NO DATA CONNECTED</span>
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs mb-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Connected Transactions:</span>
                <span className="font-mono font-bold text-slate-900">
                  {dataLayer.transactions.length} Rows
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Catalog SKUs:</span>
                <span className="font-mono font-bold text-slate-900">
                  {dataLayer.products.length} Items
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Logged Expenses:</span>
                <span className="font-mono font-bold text-slate-900">
                  {dataLayer.expenses.length} Entries
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Active Dataset File:</span>
                <span className="font-mono text-slate-700 truncate max-w-[140px]">
                  {activeDataset ? activeDataset.fileName : 'None staged'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => onNavigate('data')}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span>Data Manager</span>
            </button>
            <button
              onClick={() => onNavigate('analyze')}
              className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-300" />
              <span>Run Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. KEY METRICS (Only show metrics supported by actual business data) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              VERIFIED BUSINESS METRICS
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Key Metrics
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {hasAnyData ? 'Calculated from active operational records' : 'No calculations available'}
          </span>
        </div>

        {hasAnyData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Metric 1: Total Revenue */}
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Total Revenue</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {analysis.keyMetrics.revenue.isSupported && analysis.keyMetrics.revenue.value !== null
                    ? analysis.keyMetrics.revenue.formatted
                    : '—'}
                </div>
              </div>
              <span className="text-[10px] text-teal-800 font-mono mt-2 block">
                {analysis.keyMetrics.revenue.evidence || 'Authentic sales telemetry'}
              </span>
            </div>

            {/* Metric 2: Gross Profit Margin */}
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Gross Profit Margin</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {analysis.keyMetrics.potentialGrossMargin.isSupported && analysis.keyMetrics.potentialGrossMargin.value !== null
                    ? analysis.keyMetrics.potentialGrossMargin.formatted
                    : '—'}
                </div>
              </div>
              <span className="text-[10px] text-teal-800 font-mono mt-2 block">
                {analysis.keyMetrics.potentialGrossMargin.evidence || 'Unit cost vs selling price'}
              </span>
            </div>

            {/* Metric 3: Logged Operating Expenses */}
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Logged Expenses</span>
                <div className="text-xl font-bold font-mono text-rose-800 mt-1">
                  {analysis.keyMetrics.totalExpenses.isSupported && analysis.keyMetrics.totalExpenses.value !== null
                    ? analysis.keyMetrics.totalExpenses.formatted
                    : '—'}
                </div>
              </div>
              <span className="text-[10px] text-rose-600 font-mono mt-2 block">
                {analysis.keyMetrics.totalExpenses.evidence || 'Operating and stock procurement'}
              </span>
            </div>

            {/* Metric 4: Active SKUs & Stockout Flags */}
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Catalog SKUs</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {analysis.keyMetrics.productCount.isSupported && analysis.keyMetrics.productCount.value !== null
                    ? `${analysis.keyMetrics.productCount.value} SKUs`
                    : `${dataLayer.products.length} SKUs`}
                </div>
              </div>
              <span className="text-[10px] text-slate-600 font-mono mt-2 block">
                {analysis.keyMetrics.lowStockItemsCount.isSupported && analysis.keyMetrics.lowStockItemsCount.value !== null
                  ? `${analysis.keyMetrics.lowStockItemsCount.value} low-stock alerts`
                  : 'Tracked inventory items'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              No business data yet.
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              Add sales and inventory in Manage Affairs or try Asha's demo to inspect calculated metrics.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => onNavigate('manage_affairs', 'sales')}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add Business Data
              </button>
              <TryAshaDemoButton onStartDemo={onStartAshaDemo || (() => onNavigate('analyze'))} />
            </div>
          </div>
        )}
      </div>

      {/* 5. RECENT INSIGHTS & PENDING DECISIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT INSIGHTS */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  DIAGNOSTIC FINDINGS
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Recent Insights
                </h2>
              </div>
              <button
                onClick={() => onNavigate('insights')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>All Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {hasAnyData && calculatedInsights.key_insights.length > 0 ? (
              <div className="space-y-3">
                {calculatedInsights.key_insights.slice(0, 2).map((ins: GeminiKeyInsight, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-lg text-xs space-y-2"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 font-bold block">
                        INSIGHT: {ins.title}
                      </span>
                      <p className="text-slate-800 font-medium mt-0.5">{ins.evidence}</p>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200/80">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                        AI INTERPRETATION
                      </span>
                      <p className="text-slate-600 italic text-[11px] mt-0.5">
                        {ins.interpretation}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-600 font-medium">Action: Review margin & replenishment</span>
                      <button
                        onClick={() => onNavigate('recommendations')}
                        className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Review Recommendation</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
                No insights generated yet. Ingest business records or run Asha's demo to view insights.
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[10px]">
              ENGINE: DETERMINISTIC + GEMINI AI
            </span>
            <button
              onClick={() => onNavigate('charts')}
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              Inspect Charts →
            </button>
          </div>
        </div>

        {/* PENDING DECISIONS */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  GOVERNANCE QUEUE
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Pending Decisions
                </h2>
              </div>
              <span className="text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-bold">
                {pendingRecommendations.length} Awaiting Sign-off
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingRecommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate block">
                        {rec.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold shrink-0">
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate mt-0.5">
                      {rec.businessProblem}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate('decision')}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Recorded in ledger: <strong>{decisions.length} decisions</strong>
            </span>
            <button
              onClick={() => onNavigate('decision')}
              className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Open Decision Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 11. Final High-Impact Visual CTA Section */}
      <PremiumCtaSection onNavigate={handleNav} onStartAshaDemo={onStartAshaDemo} />

      {/* 12. Creator Attribution Signature */}
      <CreatorAttribution />

      {/* 13. Modern Commercial Site Footer */}
      <SiteFooter onNavigate={handleNav} />
    </div>
  );
};
