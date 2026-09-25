import React, { useState, useEffect } from 'react';
import {
  BusinessLevelId,
  NavSection,
  FrameworkPillar,
  RecommendationDecisionStatus,
} from '../../types/bi';
import { BUSINESS_LEVELS, RECOMMENDED_AI_ML_ARCHETYPES } from '../../data/frameworkData';
import { SectionHeader } from '../common/SectionHeader';
import {
  getStoredDecisions,
  getRecommendationStatus,
  saveDecision,
} from '../../utils/decisionStorage';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Edit3,
  XCircle,
  Sparkles,
  Filter,
  Check,
} from 'lucide-react';

interface RecommendationsViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  onSelectRecommendation?: (id: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  selectedLevel,
  onNavigate,
  onSelectRecommendation,
}) => {
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[0];
  const [selectedPillar, setSelectedPillar] = useState<'all' | FrameworkPillar>('all');
  const [decisions, setDecisions] = useState(() => getStoredDecisions());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setDecisions(getStoredDecisions());
    };
    window.addEventListener('human_decisions_updated', handleUpdate);
    return () => window.removeEventListener('human_decisions_updated', handleUpdate);
  }, []);

  const filteredArchetypes =
    selectedPillar === 'all'
      ? RECOMMENDED_AI_ML_ARCHETYPES
      : RECOMMENDED_AI_ML_ARCHETYPES.filter((a) => a.pillar === selectedPillar);

  const handleReviewDecision = (recId: string) => {
    if (onSelectRecommendation) {
      onSelectRecommendation(recId);
    }
    onNavigate('decision');
  };

  const handleQuickDecision = (
    recId: string,
    action: 'accept' | 'reject'
  ) => {
    const arch = RECOMMENDED_AI_ML_ARCHETYPES.find((r) => r.id === recId);
    if (!arch) return;

    const status: RecommendationDecisionStatus = action === 'accept' ? 'Accepted' : 'Rejected';
    saveDecision({
      recommendationId: arch.id,
      recommendationTitle: arch.name,
      businessIssue: arch.businessProblem,
      evidence: arch.evidence,
      possibleAction: arch.possibleAction || arch.commerceImpact,
      decision: status,
      decisionAction: action,
      decisionNote: `Decision marked directly from AI Recommendations card.`,
    });

    setFeedbackMessage(
      action === 'accept'
        ? `"${arch.name}" marked as ACCEPTED by human decision.`
        : `"${arch.name}" marked as REJECTED by human decision.`
    );
    setDecisions(getStoredDecisions());

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
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
        title="AI Recommendations"
        subtitle="Practical interventions to optimize inventory, protect profit margins, and streamline operations."
        frameworkStage="RECOMMENDATIONS"
        badgeText={currentLevel.shortName}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('decision')}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Human Decision Center</span>
            </button>
            <button
              onClick={() => onNavigate('impact')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Business Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Principle Notice */}
      <div className="bg-[#091124] text-white border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold">
              AI ANALYZES. HUMANS DECIDE.
            </div>
            <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
              AI provides analytical solutions. You approve, modify, or reject every action before adoption.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('decision')}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer transition-colors"
        >
          Decision Console →
        </button>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div className="p-3 bg-teal-50 border border-teal-300 rounded-lg text-xs font-medium text-teal-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-700" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-[11px] underline text-teal-800 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Count Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-500 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Pillar:</span>
          </span>
          {[
            { id: 'all', label: 'All Recommendations' },
            { id: 'access', label: 'Access (Data)' },
            { id: 'intelligence', label: 'Intelligence (Analytics)' },
            { id: 'scale', label: 'Scale (Growth)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPillar(tab.id as any)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedPillar === tab.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredArchetypes.length} Recommendation Card(s)
        </span>
      </div>

      {/* Recommendation Cards: Requirement 8 Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArchetypes.map((arch) => {
          const status = getRecommendationStatus(arch.id, decisions);
          const whyItFits =
            arch.pillar === 'access'
              ? 'Organizes fragmented paper and ledger records into standardized structured digital tables.'
              : arch.pillar === 'intelligence'
              ? 'Applies deterministic mathematical screening to uncover hidden margin leaks and stockout exposure.'
              : 'Empowers operational teams to expand market coverage without incurring proportional administrative overhead.';

          return (
            <div
              key={arch.id}
              className="p-5 bg-white border border-slate-200/90 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs space-y-3.5"
            >
              <div className="space-y-3">
                {/* Header: Title & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider block">
                      PILLAR: {arch.pillar.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mt-0.5">
                      {arch.name}
                    </h3>
                  </div>
                  {getStatusBadge(status)}
                </div>

                {/* 1. PROBLEM */}
                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
                  <span className="font-bold text-slate-700 text-[10px] font-mono uppercase block mb-0.5">
                    PROBLEM:
                  </span>
                  <p className="text-slate-800">{arch.businessProblem}</p>
                </div>

                {/* 2. EVIDENCE */}
                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
                  <span className="font-bold text-indigo-900 text-[10px] font-mono uppercase block mb-0.5">
                    EVIDENCE:
                  </span>
                  <p className="text-slate-800">{arch.evidence}</p>
                </div>

                {/* 3. RECOMMENDED METHOD */}
                <div className="text-xs flex items-center justify-between py-1 px-2 bg-slate-50/60 rounded border border-slate-100">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                    RECOMMENDED METHOD:
                  </span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {arch.technique}
                  </span>
                </div>

                {/* 4. WHY IT FITS */}
                <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
                  <span className="font-bold text-teal-900 text-[10px] font-mono uppercase block mb-0.5">
                    WHY IT FITS:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{whyItFits}</p>
                </div>

                {/* 5. POSSIBLE ACTION */}
                <div className="p-2.5 bg-teal-50/40 border border-teal-200/60 rounded-lg text-xs">
                  <span className="font-bold text-teal-950 text-[10px] font-mono uppercase block mb-0.5">
                    POSSIBLE ACTION:
                  </span>
                  <p className="text-teal-950 font-medium">
                    {arch.possibleAction || arch.commerceImpact}
                  </p>
                </div>
              </div>

              {/* Four Required Controls: [ Review ] [ Accept ] [ Modify ] [ Reject ] */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                <button
                  onClick={() => handleReviewDecision(arch.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                >
                  Review
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickDecision(arch.id, 'accept')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReviewDecision(arch.id)}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleQuickDecision(arch.id, 'reject')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
