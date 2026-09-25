import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BusinessLevelId,
  NavSection,
  IngestedDataset,
  BusinessProfile,
  BusinessAffairsData,
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import {
  GeminiAiInsightsResponse,
  AiInsightCategory,
  RecommendedAnalysisMethod,
} from '../../types/analysis';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { SectionHeader } from '../common/SectionHeader';
import { buildUnifiedBusinessData } from '../../utils/unifiedDataLayer';
import { runUnifiedBusinessAnalysis } from '../../utils/unifiedAnalysisEngine';
import {
  fetchGeminiInsights,
  evaluateRecommendedMethods,
  generateDeterministicFallbackInsights,
} from '../../utils/geminiInsightsClient';
import { useI18n } from '../../context/I18nContext';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  Compass,
  Cpu,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react';

interface InsightsViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  activeDataset?: IngestedDataset | null;
  profile?: BusinessProfile | null;
  businessAffairs?: BusinessAffairsData;
  unifiedDataLayer?: UnifiedBusinessDataLayer;
  unifiedAnalysis?: UnifiedBusinessAnalysisReport;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  selectedLevel,
  onNavigate,
  activeDataset,
  profile,
  businessAffairs,
  unifiedDataLayer: propDataLayer,
  unifiedAnalysis: propAnalysis,
}) => {
  const { locale, currentMeta } = useI18n();
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[1];

  // Derive deterministic data layer and analysis report
  const dataLayer = useMemo(() => {
    return propDataLayer || buildUnifiedBusinessData(businessAffairs, activeDataset);
  }, [propDataLayer, businessAffairs, activeDataset]);

  const report: UnifiedBusinessAnalysisReport = useMemo(() => {
    return propAnalysis || runUnifiedBusinessAnalysis(dataLayer);
  }, [propAnalysis, dataLayer]);

  // Evaluated deterministic AI/ML method recommendations
  const recommendedMethods: RecommendedAnalysisMethod[] = useMemo(() => {
    return evaluateRecommendedMethods(report, dataLayer);
  }, [report, dataLayer]);

  // State for AI insights
  const [insights, setInsights] = useState<GeminiAiInsightsResponse>(() =>
    generateDeterministicFallbackInsights(report, dataLayer)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<'gemini_api' | 'deterministic_fallback'>(
    'deterministic_fallback'
  );
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Trigger Gemini AI generation
  const handleLoadInsights = useCallback(async () => {
    setIsLoading(true);
    setWarningMessage(null);

    const result = await fetchGeminiInsights(
      report,
      dataLayer,
      profile,
      currentMeta.name,
      locale
    );

    setInsights(result.insights);
    setSourceType(result.source);
    if (result.errorWarning) {
      setWarningMessage(result.errorWarning);
    }
    setLastRefreshedAt(new Date());
    setIsLoading(false);
  }, [report, dataLayer, profile, currentMeta.name, locale]);

  // Initial load when mounted or locale changed
  useEffect(() => {
    handleLoadInsights();
  }, [handleLoadInsights]);

  // Calculate available categories that actually have items
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    insights.key_insights.forEach((ki) => cats.add(ki.category));
    insights.areas_to_review.forEach((ar) => cats.add(ar.category));
    insights.opportunities.forEach((op) => cats.add(op.category));
    return ['All', ...Array.from(cats)];
  }, [insights]);

  // Filtered lists based on category selection
  const filteredKeyInsights = useMemo(() => {
    if (activeCategoryFilter === 'All') return insights.key_insights;
    return insights.key_insights.filter((ki) => ki.category === activeCategoryFilter);
  }, [insights.key_insights, activeCategoryFilter]);

  const filteredAreasToReview = useMemo(() => {
    if (activeCategoryFilter === 'All') return insights.areas_to_review;
    return insights.areas_to_review.filter((ar) => ar.category === activeCategoryFilter);
  }, [insights.areas_to_review, activeCategoryFilter]);

  const filteredOpportunities = useMemo(() => {
    if (activeCategoryFilter === 'All') return insights.opportunities;
    return insights.opportunities.filter((op) => op.category === activeCategoryFilter);
  }, [insights.opportunities, activeCategoryFilter]);

  const getCategoryBadgeColor = (cat: AiInsightCategory | string) => {
    switch (cat) {
      case 'Sales':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Products':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Customers':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Inventory':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Expenses':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Operations':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Growth':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="Business Insights"
        subtitle="Key observations, areas to review, and suggested opportunities based on your data."
        frameworkStage="INSIGHTS"
        badgeText={currentLevel.shortName}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('analyze')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Inspect Raw Analysis</span>
            </button>
            <button
              onClick={handleLoadInsights}
              disabled={isLoading}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] ${
                isLoading
                  ? 'bg-teal-800 text-teal-200 cursor-not-allowed opacity-80'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Updating...' : 'Refresh Insights'}</span>
            </button>
          </div>
        }
      />

      {/* 2. DATA SOURCE DISPLAY & CALIBRATION BAR */}
      <div className="bg-[#091124] text-slate-100 rounded-lg p-4 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="text-teal-400 uppercase font-semibold">Source:</span>
              <span className="bg-teal-950 text-teal-200 border border-teal-700/60 px-2 py-0.5 rounded font-bold">
                {report.dataSourceSummary.summaryText || report.dataSourceSummary.primarySourceName}
              </span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded">
                {dataLayer.transactions.length + dataLayer.products.length + dataLayer.expenses.length} Records
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Calculated from recorded transactions, inventory levels, and operational expenses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
          <span className="text-slate-400">Language: <strong className="text-teal-300">{currentMeta.name}</strong></span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* 3. HOW INSIGHTS WORK */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-lg p-3.5 flex items-center gap-3 text-xs text-amber-950">
        <Info className="w-4 h-4 text-amber-800 shrink-0" />
        <p className="text-slate-800 leading-relaxed">
          <strong>Note:</strong> Numbers and patterns are calculated from your real entries. The system highlights trends and potential issues so you can take action.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 4. TEMPORARY UNAVAILABILITY NOTICE (If Gemini API throws error) */}
      {/* ========================================================================= */}
      {warningMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 shadow-2xs flex items-start gap-3 text-xs text-rose-950">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-900 block">
              AI interpretation is temporarily unavailable.
            </span>
            <p className="text-slate-700 leading-relaxed">
              {warningMessage}
            </p>
            <p className="text-[11px] text-slate-500 font-mono pt-1">
              All deterministic calculations, empirical trends, and catalog metrics remain 100% active and verified below.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VERIFIED METRICS TELEMETRY (Deterministic Baseline from actual data) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
            RECORDED REVENUE
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {report.keyMetrics.revenue.formatted}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
            {report.keyMetrics.orderCount.formatted} orders logged
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
            RECORDED EXPENSES
          </div>
          <div className="text-xl font-bold font-mono text-rose-800">
            {report.keyMetrics.totalExpenses.formatted}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
            {report.expenseAnalysis.isAvailable ? `${report.expenseAnalysis.byCategory?.length || 0} categories` : 'Not recorded'}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
            CATALOG SKUS
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {report.keyMetrics.productCount.formatted}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
            Active merchandise items
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
            BUFFER ATTENTION
          </div>
          <div className={`text-xl font-bold font-mono ${Number(report.keyMetrics.lowStockItemsCount.value || 0) > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {report.keyMetrics.lowStockItemsCount.formatted}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
            Items at or below buffer
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. AI EXECUTIVE SUMMARY CARD */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                SYNTHESIS & OVERVIEW
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Executive Synthesis
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
              Model: {sourceType === 'gemini_api' ? 'Gemini 3.8 Flash (Server-Side)' : 'Deterministic Pattern Synthesizer'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Evidence Grounded</span>
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-sans">
          {isLoading ? (
            <div className="py-4 flex items-center justify-center gap-3 text-xs font-mono text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-700" />
              <span>Analyzing data patterns in {currentMeta.name}...</span>
            </div>
          ) : (
            insights.summary
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CATEGORY TABS FILTER (Requirement 9: Sales, Products, Customers, Inventory, Expenses, Operations, Growth) */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-mono text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
          </span>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeCategoryFilter === cat
                  ? 'bg-teal-800 text-white font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredKeyInsights.length} Insight(s) • {filteredAreasToReview.length} Review Area(s) • {filteredOpportunities.length} Opportunity(ies)
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 8. SECTION A: KEY AI INSIGHTS (Requirement 7: TITLE, EVIDENCE, INTERPRETATION, WHY IT MATTERS, DATA LIMITATION) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              EMPIRICAL OBSERVATIONS & IMPLICATIONS
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Key Business Insights
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {filteredKeyInsights.length} Evidence-Backed Insight(s)
          </span>
        </div>

        {filteredKeyInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKeyInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg text-xs space-y-3 hover:border-slate-300 transition-colors"
              >
                {/* Title & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {insight.title}
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold shrink-0 ${getCategoryBadgeColor(
                      insight.category
                    )}`}
                  >
                    {insight.category}
                  </span>
                </div>

                {/* 1. INSIGHT */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 block">
                    INSIGHT (What the data shows):
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200/80">
                    {insight.evidence}
                  </p>
                </div>

                {/* 2. AI INTERPRETATION */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                    AI INTERPRETATION (What it may mean):
                  </span>
                  <p className="text-slate-700 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200/80">
                    {insight.interpretation}
                  </p>
                </div>

                {/* 3. ACTION */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 block">
                    ACTION (What could be reviewed):
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    {insight.importance}
                  </p>
                </div>

                {/* 4. Action Button */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                    {insight.data_limitation ? `Limitation: ${insight.data_limitation}` : 'Empirical metric'}
                  </span>
                  <button
                    onClick={() => onNavigate('recommendations')}
                    className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <span>Review Recommendation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded text-xs text-slate-500 text-center font-mono">
            No key insights match the selected category filter.
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION B: SUGGESTED AREAS TO REVIEW (Requirement 5 & 15: Human Control) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              OPERATIONAL RISK & ATTENTION SIGNALS
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Suggested Areas to Review
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {filteredAreasToReview.length} Area(s) Flagged
          </span>
        </div>

        {filteredAreasToReview.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAreasToReview.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{item.issue}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold shrink-0 ${getCategoryBadgeColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                    Calculated Evidence:
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-white p-2 rounded border border-amber-200/70">
                    {item.evidence}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                    Possible Commercial Reason:
                  </span>
                  <p className="text-slate-700 leading-relaxed italic">
                    {item.possible_reason}
                  </p>
                </div>

                {item.consider_reviewing && (
                  <div className="pt-2 border-t border-amber-200/60 space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 block">
                      Consider Reviewing:
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {item.consider_reviewing}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero critical operational attention areas flagged for the selected filter.</span>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 10. SECTION C: POTENTIAL OPPORTUNITIES (Requirement 5 & 15: Non-Commanding) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              POSITIVE SIGNALS & LEVERAGE POINTS
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Potential Opportunities
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {filteredOpportunities.length} Potential Opportunity(ies)
          </span>
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map((op, idx) => (
              <div
                key={idx}
                className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-lg text-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-sm">
                    <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{op.opportunity}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold shrink-0 ${getCategoryBadgeColor(
                      op.category
                    )}`}
                  >
                    {op.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 block">
                    Supporting Data Evidence:
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-white p-2 rounded border border-emerald-200/70">
                    {op.evidence}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                    Possible Action:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {op.possible_action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center font-mono">
            No specific commercial opportunities detected in current filter.
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 11. SECTION D: DATA LIMITATIONS & MISSING DATA */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Data Limitations & Additional Information Needed
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The following unmeasured attributes or missing data points prevent higher-precision commercial conclusions. Supplying these records in Step 2 or via Manage Business Affairs will expand analytical certainty.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {insights.data_limitations.map((lim, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>{lim}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. SECTION E: RECOMMENDED ANALYSIS METHODS (Requirement 12) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-700" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                STEP 5 PREVIEW • ADVANCED ENGINE CANDIDATES
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recommended Analysis Methods
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
            {recommendedMethods.filter((m) => m.isTriggered).length} / {recommendedMethods.length} Methods Evaluated as Relevant
          </span>
        </div>

        {/* Mandatory Explicit Disclaimer */}
        <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg text-xs space-y-1 border border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-mono font-bold uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Architectural Clarification</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Important: At this stage these are <strong className="text-white">METHOD RECOMMENDATIONS only</strong>. No machine learning models have been trained or deployed on your business data. These candidates reflect mathematical techniques that match your recorded patterns.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendedMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-lg border text-xs space-y-3 transition-colors ${
                method.isTriggered
                  ? 'bg-teal-50/40 border-teal-200/90'
                  : 'bg-slate-50/50 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {method.methodName}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold shrink-0 ${
                    method.isTriggered
                      ? 'bg-teal-100 text-teal-900 border-teal-300'
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {method.statusBadge}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Identified Trigger Condition:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">
                  {method.triggerCondition}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Potential Business Benefit:
                </span>
                <p className="text-slate-700 leading-relaxed font-sans">
                  {method.potentialBenefit}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Applicable Data:</span>
                <span className="text-slate-800 font-semibold truncate max-w-[150px]" title={method.applicableData}>
                  {method.applicableData}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. WORKFLOW ADVANCEMENT BANNER (Transition to Recommendations / Decision) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
              STEP 5 COMPLETE • READY FOR EXECUTIVE ACTION
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Continue to Actionable Recommendations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              Review calibrated commercial actions and policy interventions tailored to your operating tier.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('recommendations')}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <span>View Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
