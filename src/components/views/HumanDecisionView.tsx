import React, { useState, useEffect } from 'react';
import { BusinessLevelId, NavSection, RecommendationDecisionStatus, DecisionActionType, HumanDecisionRecord } from '../../types/bi';
import { BUSINESS_LEVELS, RECOMMENDED_AI_ML_ARCHETYPES } from '../../data/frameworkData';
import { SectionHeader } from '../common/SectionHeader';
import { useI18n } from '../../context/I18nContext';
import { getDecisionTranslations } from '../../locales/decisionTranslations';
import {
  getStoredDecisions,
  saveDecision,
  getRecommendationStatus,
  clearAllDecisions,
} from '../../utils/decisionStorage';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  Edit3,
  XCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface HumanDecisionViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  selectedRecommendationId?: string | null;
  onSelectRecommendation?: (id: string) => void;
}

export const HumanDecisionView: React.FC<HumanDecisionViewProps> = ({
  selectedLevel,
  onNavigate,
  selectedRecommendationId,
  onSelectRecommendation,
}) => {
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[0];
  const { locale } = useI18n();
  const dt = getDecisionTranslations(locale);

  // Recommendations pool
  const recommendations = RECOMMENDED_AI_ML_ARCHETYPES;

  // Active selected recommendation
  const [activeRecId, setActiveRecId] = useState<string>(() => {
    if (selectedRecommendationId && recommendations.some((r) => r.id === selectedRecommendationId)) {
      return selectedRecommendationId;
    }
    return recommendations[0]?.id || 'arch_demand_forecasting';
  });

  // Sync if prop changes externally
  useEffect(() => {
    if (selectedRecommendationId && recommendations.some((r) => r.id === selectedRecommendationId)) {
      setActiveRecId(selectedRecommendationId);
    }
  }, [selectedRecommendationId, recommendations]);

  const activeRec = recommendations.find((r) => r.id === activeRecId) || recommendations[0];

  // Decisions list from storage
  const [decisions, setDecisions] = useState<HumanDecisionRecord[]>(() => getStoredDecisions());

  // Listen to decision updates across windows/components
  useEffect(() => {
    const handleUpdate = () => {
      setDecisions(getStoredDecisions());
    };
    window.addEventListener('human_decisions_updated', handleUpdate);
    return () => window.removeEventListener('human_decisions_updated', handleUpdate);
  }, []);

  // Active action mode for currently selected recommendation (none by default)
  const [activeAction, setActiveAction] = useState<DecisionActionType | null>(null);

  // Form input states
  const [reviewNote, setReviewNote] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  const [modifiedDecision, setModifiedDecision] = useState('');
  const [modificationReason, setModificationReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Reset form when changing active recommendation or action
  const handleSelectRec = (id: string) => {
    setActiveRecId(id);
    setActiveAction(null);
    setFeedbackMessage(null);
    if (onSelectRecommendation) {
      onSelectRecommendation(id);
    }
  };

  const handleStartAction = (action: DecisionActionType) => {
    setActiveAction(action);
    setFeedbackMessage(null);
    if (action === 'modify') {
      // Pre-populate with suggestion
      setModifiedDecision(`Adjusted: ${activeRec.possibleAction}`);
      setModificationReason('');
    } else if (action === 'review') {
      setReviewNote('');
      setNextReviewDate('');
    } else if (action === 'accept') {
      setDecisionNote('');
    } else if (action === 'reject') {
      setRejectionReason('');
    }
  };

  const handleCancelAction = () => {
    setActiveAction(null);
  };

  const handleSaveDecision = () => {
    if (!activeAction || !activeRec) return;

    let finalStatus: RecommendationDecisionStatus = 'Under Review';
    if (activeAction === 'accept') finalStatus = 'Accepted';
    if (activeAction === 'modify') finalStatus = 'Modified';
    if (activeAction === 'reject') finalStatus = 'Rejected';

    saveDecision({
      recommendationId: activeRec.id,
      recommendationTitle: activeRec.name,
      businessIssue: activeRec.businessProblem,
      evidence: activeRec.evidence || activeRec.businessProblem,
      possibleAction: activeRec.possibleAction || activeRec.commerceImpact,
      decision: finalStatus,
      decisionAction: activeAction,
      reviewNote: activeAction === 'review' ? reviewNote.trim() : undefined,
      nextReviewDate: activeAction === 'review' && nextReviewDate ? nextReviewDate : undefined,
      decisionNote: activeAction === 'accept' ? decisionNote.trim() : undefined,
      originalRecommendation: activeAction === 'modify' ? activeRec.possibleAction : undefined,
      modifiedDecision: activeAction === 'modify' ? modifiedDecision.trim() : undefined,
      modificationReason: activeAction === 'modify' ? modificationReason.trim() : undefined,
      rejectionReason: activeAction === 'reject' ? rejectionReason.trim() : undefined,
    });

    // Confirmation banner
    let msg = dt.reviewMarkedMessage;
    if (activeAction === 'accept') msg = dt.acceptedMessage;
    if (activeAction === 'modify') msg = 'Modified decision saved.';
    if (activeAction === 'reject') msg = dt.rejectedMessage;

    setFeedbackMessage(msg);
    setActiveAction(null);

    // Refresh decisions
    setDecisions(getStoredDecisions());
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all recorded decision history? This cannot be undone.')) {
      clearAllDecisions();
      setDecisions([]);
      setFeedbackMessage(null);
    }
  };

  // Status mapping helper
  const getStatusBadge = (status: RecommendationDecisionStatus) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {dt.statusAccepted}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            {dt.statusUnderReview}
          </span>
        );
      case 'Modified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-300">
            <Edit3 className="w-3.5 h-3.5 text-sky-700" />
            {dt.statusModified}
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {dt.statusRejected}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            {dt.statusNew}
          </span>
        );
    }
  };

  const activeRecStatus = getRecommendationStatus(activeRec.id, decisions);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header with direct context */}
      <SectionHeader
        title={dt.pageTitle}
        subtitle={dt.pageSubtitle}
        frameworkStage="DECISION CENTER"
        badgeText={currentLevel.shortName}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('recommendations')}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View AI Recommendations</span>
            </button>
            <button
              onClick={() => onNavigate('impact')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Business Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* 2. Core Principle Banner: AI ANALYZES. HUMANS DECIDE. */}
      <div className="bg-[#091124] text-white border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-mono uppercase tracking-wider text-teal-300 font-bold">
                  {dt.corePrinciple}
                </span>
                <span className="text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-700/60 px-2 py-0.5 rounded font-semibold">
                  Rule 11 Enforced
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                {dt.corePrincipleDesc}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-lg text-xs font-mono text-teal-300 flex items-center gap-2 shrink-0 self-start md:self-auto">
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>Human Authority Required</span>
          </div>
        </div>
      </div>

      {/* 3. Recommendation Selector Cards / Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500">
            SELECT RECOMMENDATION TO EVALUATE ({recommendations.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Tier: <strong className="text-slate-800">{currentLevel.shortName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendations.map((rec) => {
            const isSelected = rec.id === activeRec.id;
            const status = getRecommendationStatus(rec.id, decisions);
            return (
              <button
                key={rec.id}
                onClick={() => handleSelectRec(rec.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-700">
                      {rec.pillar}
                    </span>
                    {getStatusBadge(status)}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                    {rec.name}
                  </h3>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="truncate max-w-[140px]">{rec.technique.split('/')[0]}</span>
                  <span className={`font-semibold ${isSelected ? 'text-teal-700' : 'text-slate-400'}`}>
                    {isSelected ? 'Active →' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-4 bg-teal-50 border border-teal-300 rounded-xl flex items-center justify-between gap-3 text-sm text-teal-950 animate-fadeIn">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-mono text-teal-700 hover:text-teal-900 cursor-pointer underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. MAIN DECISION CARD: Vertical Product-First Hierarchy */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7">
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
              DECISION SUBJECT #{recommendations.findIndex((r) => r.id === activeRec.id) + 1} OF {recommendations.length}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeRec.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Current Status:</span>
            {getStatusBadge(activeRecStatus)}
          </div>
        </div>

        {/* Vertical Hierarchy:
            AI RECOMMENDATION -> EVIDENCE -> POSSIBLE ACTION -> YOUR DECISION */}
        <div className="space-y-6">
          {/* A. AI RECOMMENDATION */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-teal-700 uppercase">
                {dt.aiRecommendation}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">{activeRec.technique}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {activeRec.businessProblem}
            </div>
          </div>

          {/* B. EVIDENCE */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-700 uppercase">
                {dt.evidence}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Data-Backed Observation</span>
            </div>
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{activeRec.evidence}</span>
              </div>
            </div>
          </div>

          {/* C. POSSIBLE ACTION */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-700 uppercase">
                {dt.possibleAction}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Suggested Operational Step</span>
            </div>
            <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-xl text-xs sm:text-sm text-slate-900 leading-relaxed font-semibold">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{activeRec.possibleAction}</span>
              </div>
            </div>
          </div>

          {/* D. YOUR DECISION: 4 Clear Action Buttons */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-900">
                  {dt.yourDecision}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select one of the four actions below to register your business decision. No option is pre-selected.
                </p>
              </div>

              {activeAction && (
                <button
                  onClick={handleCancelAction}
                  className="text-xs font-mono text-slate-500 hover:text-slate-800 cursor-pointer underline"
                >
                  {dt.cancel}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Option 1: REVIEW */}
              <button
                onClick={() => handleStartAction('review')}
                className={`py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  activeAction === 'review'
                    ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400/40'
                    : 'bg-amber-50/60 hover:bg-amber-100/80 text-amber-900 border-amber-300 hover:border-amber-400'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>{dt.review}</span>
              </button>

              {/* Option 2: ACCEPT */}
              <button
                onClick={() => handleStartAction('accept')}
                className={`py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  activeAction === 'accept'
                    ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-400/40'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:border-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{dt.accept}</span>
              </button>

              {/* Option 3: MODIFY */}
              <button
                onClick={() => handleStartAction('modify')}
                className={`py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  activeAction === 'modify'
                    ? 'bg-sky-700 text-white border-sky-800 ring-2 ring-sky-400/40'
                    : 'bg-sky-50 hover:bg-sky-100/80 text-sky-900 border-sky-300 hover:border-sky-400'
                }`}
              >
                <Edit3 className="w-4 h-4 shrink-0" />
                <span>{dt.modify}</span>
              </button>

              {/* Option 4: REJECT */}
              <button
                onClick={() => handleStartAction('reject')}
                className={`py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  activeAction === 'reject'
                    ? 'bg-rose-700 text-white border-rose-800 ring-2 ring-rose-400/40'
                    : 'bg-rose-50 hover:bg-rose-100/80 text-rose-900 border-rose-300 hover:border-rose-400'
                }`}
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{dt.reject}</span>
              </button>
            </div>
          </div>

          {/* E. EXPANDED ACTION FORM (When an action is selected) */}
          {activeAction === 'review' && (
            <div className="p-5 sm:p-6 bg-amber-50/70 border-2 border-amber-300 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{dt.reviewMarkedMessage}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Add an optional review note or specify a follow-up date for yourself or your team.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-semibold text-slate-800 block">
                    {dt.reviewNote}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Discuss with procurement manager at weekly inventory review..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 block">
                    {dt.nextReviewDate}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={nextReviewDate}
                      onChange={(e) => setNextReviewDate(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Calendar reminder for re-evaluating this item.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {dt.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDecision}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Save Review Decision
                </button>
              </div>
            </div>
          )}

          {activeAction === 'accept' && (
            <div className="p-5 sm:p-6 bg-emerald-50/70 border-2 border-emerald-300 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{dt.acceptedMessage}</span>
              </div>
              <div className="p-3 bg-white/90 border border-emerald-200 rounded-lg text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{dt.acceptNotice}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-800 block">
                  {dt.decisionNote} (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Accepted for next month's catalog reorder. Reorder points to be adjusted manually by owner."
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {dt.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDecision}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Save Acceptance
                </button>
              </div>
            </div>
          )}

          {activeAction === 'modify' && (
            <div className="p-5 sm:p-6 bg-sky-50/70 border-2 border-sky-300 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
                <Edit3 className="w-4 h-4 text-sky-700" />
                <span>Modify AI Recommendation</span>
              </div>
              <p className="text-xs text-sky-900 leading-relaxed">
                Tailor the suggested action to fit your specific operational constraints or supplier agreements.
              </p>

              {/* Original Recommendation */}
              <div className="p-3 bg-white/80 border border-sky-200 rounded-lg text-xs text-slate-700">
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  {dt.originalRecommendation}
                </span>
                <span className="font-semibold text-slate-900">{activeRec.possibleAction}</span>
              </div>

              {/* Modified Decision */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-800 block">
                  {dt.modifiedDecision}
                </label>
                <textarea
                  rows={3}
                  value={modifiedDecision}
                  onChange={(e) => setModifiedDecision(e.target.value)}
                  placeholder="e.g., Review Product A and Product B together instead of Product A alone."
                  className="w-full bg-white border border-sky-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              {/* Reason for Modification */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-800 block">
                  {dt.reasonForModification}
                </label>
                <textarea
                  rows={2}
                  value={modificationReason}
                  onChange={(e) => setModificationReason(e.target.value)}
                  placeholder="e.g., Both products share the same supplier batch and shipping container."
                  className="w-full bg-white border border-sky-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {dt.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDecision}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Save Modified Decision
                </button>
              </div>
            </div>
          )}

          {activeAction === 'reject' && (
            <div className="p-5 sm:p-6 bg-rose-50/70 border-2 border-rose-300 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-700" />
                <span>{dt.rejectedMessage}</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                Decline this recommendation for your business. {dt.sensitiveInfoNote}
              </p>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-800 block">
                  {dt.reasonForRejection}
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Not applicable to our current regional distributor contract..."
                  className="w-full bg-white border border-rose-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {dt.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDecision}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Save Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. DECISION HISTORY TABLE (Actual real decisions only, no fake data) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              AUDITED LOG
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {dt.decisionHistory} ({decisions.length})
            </h2>
          </div>

          {decisions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset History</span>
              </button>
            </div>
          )}
        </div>

        {decisions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {dt.noDecisionsYet}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Select an AI recommendation above and choose an action (Review, Accept, Modify, Reject) to record your business decision.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase bg-slate-50/60">
                  <th className="py-2.5 px-3 font-semibold">{dt.colDate}</th>
                  <th className="py-2.5 px-3 font-semibold">{dt.colBusinessIssue}</th>
                  <th className="py-2.5 px-3 font-semibold">{dt.colRecommendation}</th>
                  <th className="py-2.5 px-3 font-semibold">{dt.colDecision}</th>
                  <th className="py-2.5 px-3 font-semibold">{dt.colUserNote}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {decisions.map((item) => {
                  let userNoteText = '—';
                  if (item.decisionAction === 'review') {
                    userNoteText = item.reviewNote || '(Marked for review)';
                    if (item.nextReviewDate) {
                      userNoteText += ` [Next: ${item.nextReviewDate}]`;
                    }
                  } else if (item.decisionAction === 'accept') {
                    userNoteText = item.decisionNote || '(Accepted for consideration)';
                  } else if (item.decisionAction === 'modify') {
                    userNoteText = `${item.modifiedDecision || ''} ${
                      item.modificationReason ? `(Reason: ${item.modificationReason})` : ''
                    }`.trim();
                  } else if (item.decisionAction === 'reject') {
                    userNoteText = item.rejectionReason || '(Rejected without note)';
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap align-top">
                        {item.date}
                      </td>
                      <td className="py-3 px-3 text-slate-800 max-w-xs align-top">
                        <span className="line-clamp-2">{item.businessIssue}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-900 font-semibold whitespace-nowrap align-top">
                        {item.recommendationTitle}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap align-top">
                        {getStatusBadge(item.decision)}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-sm align-top leading-relaxed">
                        {userNoteText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
