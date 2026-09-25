import React, { useState, useEffect, useMemo } from 'react';
import {
  BusinessLevelId,
  NavSection,
  RecommendationDecisionStatus,
  BusinessAffairsData,
  IngestedDataset,
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import { BUSINESS_LEVELS, RECOMMENDED_AI_ML_ARCHETYPES } from '../../data/frameworkData';
import { SectionHeader } from '../common/SectionHeader';
import { getStoredDecisions, getRecommendationStatus } from '../../utils/decisionStorage';
import { buildUnifiedBusinessData } from '../../utils/unifiedDataLayer';
import { runUnifiedBusinessAnalysis } from '../../utils/unifiedAnalysisEngine';
import {
  Sliders,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Edit3,
  XCircle,
  Activity,
  Eye,
  Calendar,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface BusinessImpactViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  onSelectRecommendation?: (id: string) => void;
  businessAffairs?: BusinessAffairsData;
  activeDataset?: IngestedDataset | null;
  unifiedDataLayer?: UnifiedBusinessDataLayer;
  unifiedAnalysis?: UnifiedBusinessAnalysisReport;
}

export const BusinessImpactView: React.FC<BusinessImpactViewProps> = ({
  selectedLevel,
  onNavigate,
  onSelectRecommendation,
  businessAffairs,
  activeDataset,
  unifiedDataLayer: propDataLayer,
  unifiedAnalysis: propAnalysis,
}) => {
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[0];

  // Derive Unified Business Analysis deterministically
  const dataLayer = useMemo(() => {
    return propDataLayer || buildUnifiedBusinessData(businessAffairs, activeDataset);
  }, [propDataLayer, businessAffairs, activeDataset]);

  const analysis: UnifiedBusinessAnalysisReport = useMemo(() => {
    return propAnalysis || runUnifiedBusinessAnalysis(dataLayer);
  }, [propAnalysis, dataLayer]);

  // Real human decisions tracking
  const [decisions, setDecisions] = useState(() => getStoredDecisions());

  useEffect(() => {
    const handleUpdate = () => {
      setDecisions(getStoredDecisions());
    };
    window.addEventListener('human_decisions_updated', handleUpdate);
    return () => window.removeEventListener('human_decisions_updated', handleUpdate);
  }, []);

  // Sensitivity simulation parameters (clearly modeled scenario, not fake field claims)
  const [estimatedAnnualRevenue, setEstimatedAnnualRevenue] = useState<number>(
    selectedLevel === 'local_village' ? 50000 : selectedLevel === 'city_growing' ? 750000 : 15000000
  );
  const [marginGainPct, setMarginGainPct] = useState<number>(3.5);
  const [workingCapitalReductionDays, setWorkingCapitalReductionDays] = useState<number>(14);

  // Computed simulation figures
  const annualGrossMarginLift = estimatedAnnualRevenue * (marginGainPct / 100);
  const dailyRevenue = estimatedAnnualRevenue / 365;
  const liberatedCashFlow = dailyRevenue * workingCapitalReductionDays;

  // Actual Measurements Computations (Requirement 9: only actual or "Not measured")
  const hasData =
    dataLayer.transactions.length > 0 ||
    dataLayer.products.length > 0 ||
    dataLayer.expenses.length > 0 ||
    (activeDataset && activeDataset.rowCount > 0);

  // 1. Efficiency measurement
  const efficiencyValue = useMemo(() => {
    if (
      analysis.keyMetrics.revenue.isSupported &&
      analysis.keyMetrics.revenue.value !== null &&
      analysis.keyMetrics.salesTransactionCount.isSupported &&
      analysis.keyMetrics.salesTransactionCount.value &&
      analysis.keyMetrics.salesTransactionCount.value > 0
    ) {
      const avgBasket = analysis.keyMetrics.revenue.value / analysis.keyMetrics.salesTransactionCount.value;
      return `$${avgBasket.toFixed(2)} avg transaction value across ${analysis.keyMetrics.salesTransactionCount.value} recorded sales`;
    }
    return null;
  }, [analysis]);

  // 2. Decision Support measurement
  const decisionSupportValue = useMemo(() => {
    if (decisions.length > 0) {
      const accepted = decisions.filter((d) => d.decision === 'Accepted').length;
      const modified = decisions.filter((d) => d.decision === 'Modified').length;
      const rejected = decisions.filter((d) => d.decision === 'Rejected').length;
      const underReview = decisions.filter((d) => d.decision === 'Under Review').length;
      return `${decisions.length} human decisions logged (${accepted} accepted, ${modified} modified, ${rejected} rejected, ${underReview} in review)`;
    }
    return null;
  }, [decisions]);

  // 3. Visibility measurement
  const visibilityValue = useMemo(() => {
    if (activeDataset?.qualityReport?.dataCompletenessPct !== undefined) {
      return `${activeDataset.qualityReport.dataCompletenessPct}% data completeness across ${activeDataset.qualityReport.totalRecords} verified records`;
    }
    if (hasData) {
      const totalRecords =
        dataLayer.transactions.length + dataLayer.products.length + dataLayer.expenses.length;
      return `${totalRecords} operational records indexed in unified data layer`;
    }
    return null;
  }, [activeDataset, hasData, dataLayer]);

  // 4. Planning measurement
  const planningValue = useMemo(() => {
    if (
      analysis.keyMetrics.lowStockItemsCount.isSupported &&
      analysis.keyMetrics.lowStockItemsCount.value !== null
    ) {
      return `${analysis.keyMetrics.lowStockItemsCount.value} low-stock buffer alerts tracked across catalog`;
    }
    if (dataLayer.products.length > 0) {
      return `${dataLayer.products.length} catalog SKU reorder thresholds configured`;
    }
    return null;
  }, [analysis, dataLayer]);

  const handleReviewDecision = (recId: string) => {
    if (onSelectRecommendation) {
      onSelectRecommendation(recId);
    }
    onNavigate('decision');
  };

  const getStatusBadge = (status: RecommendationDecisionStatus) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Accepted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            Under Review
          </span>
        );
      case 'Modified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Edit3 className="w-3 h-3 text-sky-700" />
            Modified
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        title="Business Impact"
        subtitle="Empirical operational measurements and sensitivity simulation modeling."
        frameworkStage="IMPACT ESTIMATOR"
        badgeText={currentLevel.shortName}
        actions={
          <button
            onClick={() => onNavigate('decision')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Human Decision Center</span>
          </button>
        }
      />

      {/* Requirement 9: Four Compact Impact Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            MEASURED OPERATIONAL IMPACT (ACTUAL BUSINESS DATA)
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Zero fake percentages · Strictly authentic measurements
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Efficiency */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  <span>Efficiency</span>
                </span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${efficiencyValue ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {efficiencyValue ? 'MEASURED' : 'UNMEASURED'}
                </span>
              </div>
              <div className="pt-2">
                {efficiencyValue ? (
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed font-mono">
                    {efficiencyValue}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">Not measured</p>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 mt-2">
              Based on sales ledger throughput
            </div>
          </div>

          {/* Card 2: Decision Support */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Decision Support</span>
                </span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${decisionSupportValue ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {decisionSupportValue ? 'MEASURED' : 'UNMEASURED'}
                </span>
              </div>
              <div className="pt-2">
                {decisionSupportValue ? (
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed font-mono">
                    {decisionSupportValue}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">Not measured</p>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 mt-2">
              Human review audit log count
            </div>
          </div>

          {/* Card 3: Visibility */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-teal-700" />
                  <span>Visibility</span>
                </span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${visibilityValue ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {visibilityValue ? 'MEASURED' : 'UNMEASURED'}
                </span>
              </div>
              <div className="pt-2">
                {visibilityValue ? (
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed font-mono">
                    {visibilityValue}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">Not measured</p>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 mt-2">
              Completeness across operations
            </div>
          </div>

          {/* Card 4: Planning */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Planning</span>
                </span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${planningValue ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {planningValue ? 'MEASURED' : 'UNMEASURED'}
                </span>
              </div>
              <div className="pt-2">
                {planningValue ? (
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed font-mono">
                    {planningValue}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">Not measured</p>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 mt-2">
              Active buffer and safety flags
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sensitivity Modeling (Explicitly Modeled Potential) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              EXPLORATORY SCENARIO SIMULATION
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Sensitivity & Working Capital Projection Model
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Modeled scenario · Not an automatic guarantee
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-800">
                  Modeled Annual Sales:
                </label>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  ${estimatedAnnualRevenue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={selectedLevel === 'local_village' ? 10000 : selectedLevel === 'city_growing' ? 100000 : 2000000}
                max={selectedLevel === 'local_village' ? 200000 : selectedLevel === 'city_growing' ? 3000000 : 50000000}
                step={selectedLevel === 'local_village' ? 5000 : selectedLevel === 'city_growing' ? 25000 : 500000}
                value={estimatedAnnualRevenue}
                onChange={(e) => setEstimatedAnnualRevenue(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-800">
                  Target Margin Gain:
                </label>
                <span className="font-mono tabular-nums font-bold text-teal-800">
                  +{marginGainPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={marginGainPct}
                onChange={(e) => setMarginGainPct(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-800">
                  Turnover Reduction:
                </label>
                <span className="font-mono tabular-nums font-bold text-teal-800">
                  {workingCapitalReductionDays} days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={workingCapitalReductionDays}
                onChange={(e) => setWorkingCapitalReductionDays(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Projections Display */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-900 block">
                  Projected Annual Margin Lift
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-teal-950 mt-1">
                  +${Math.round(annualGrossMarginLift).toLocaleString()}
                </div>
                <p className="text-[11px] text-teal-800 mt-2 leading-relaxed">
                  Modeled gain from {marginGainPct.toFixed(1)}% pricing optimization and elimination of margin leakage.
                </p>
              </div>
              <div className="text-[10px] font-mono text-teal-700 pt-2 border-t border-teal-200/80 mt-3">
                Calculated: Revenue × Target Lift %
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Liberated Working Capital
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-1">
                  ${Math.round(liberatedCashFlow).toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  Cash flow released by reducing dead inventory holding duration by {workingCapitalReductionDays} days.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200 mt-3">
                Calculated: (Daily Revenue) × Days Saved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Summary Link */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            HUMAN DECISION GOVERNANCE
          </div>
          <p className="text-xs text-slate-700 mt-0.5">
            Decisions recorded in audit log: <strong>{decisions.length} actions</strong>.
            AI models provide potential; human operators confirm and execute.
          </p>
        </div>

        <button
          onClick={() => onNavigate('decision')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>Open Human Decision Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
