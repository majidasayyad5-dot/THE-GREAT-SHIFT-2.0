import React, { useState } from 'react';
import {
  ObservedFindingItem,
  DataBasedInterpretationItem,
  AreaToReviewItem,
  BusinessAnalysisSummary,
} from '../../types/bi';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
  AlertCircle,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface ObservedVsInterpretationPanelProps {
  observedFindings: ObservedFindingItem[];
  interpretations: DataBasedInterpretationItem[];
  areasToReview: AreaToReviewItem[];
  summary: BusinessAnalysisSummary;
  onNavigateToStep7?: () => void;
}

export const ObservedVsInterpretationPanel: React.FC<ObservedVsInterpretationPanelProps> = ({
  observedFindings,
  interpretations,
  areasToReview,
  summary,
  onNavigateToStep7,
}) => {
  const [activeConceptTab, setActiveConceptTab] = useState<'all' | 'observed' | 'interpretation' | 'ai' | 'summary'>('all');

  return (
    <div className="space-y-6">
      {/* Concept Distinction Navigation Bar */}
      <div className="bg-[#0B152F] text-white p-4 rounded-lg border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider font-semibold">
              EPISTEMIC GOVERNANCE PROTOCOL
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Three-Layer Business Intelligence Architecture
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Strictly distinguishing mathematical fact from commercial interpretation and synthetic AI reasoning.
            </p>
          </div>

          {/* Layer Selector Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setActiveConceptTab('all')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeConceptTab === 'all'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveConceptTab('observed')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeConceptTab === 'observed'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>1. Observed</span>
            </button>
            <button
              onClick={() => setActiveConceptTab('interpretation')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeConceptTab === 'interpretation'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>2. Interpretation</span>
            </button>
            <button
              onClick={() => setActiveConceptTab('ai')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                activeConceptTab === 'ai'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-300" />
              <span>3. AI (Step 7)</span>
            </button>
            <button
              onClick={() => setActiveConceptTab('summary')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeConceptTab === 'summary'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unified Summary
            </button>
          </div>
        </div>

        {/* Layer Explanations Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              LAYER 1: OBSERVED FROM DATA
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Mathematical facts directly calculated from the dataset. No projections, no assumptions.
            </p>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              LAYER 2: DATA-BASED INTERPRETATION
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Reasonable commercial deductions strictly tethered to the underlying quantitative evidence.
            </p>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <div className="font-bold text-purple-400 flex items-center gap-1.5 mb-1 font-mono text-[11px]">
              <Sparkles className="w-3 h-3 text-purple-400" />
              LAYER 3: AI INTERPRETATION
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Synthesis via Gemini models. Scheduled for Step 7. Basic calculations run locally.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 1: OBSERVED FROM DATA */}
      {/* ========================================================================= */}
      {(activeConceptTab === 'all' || activeConceptTab === 'observed') && (
        <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Observed From Data (Mathematical Evidence)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              {observedFindings.length} Verified Facts
            </span>
          </div>

          {observedFindings.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded">
              No observed data records available to audit. Add commercial records to generate facts.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {observedFindings.map((obs) => (
                <div
                  key={obs.id}
                  className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{obs.topic}</span>
                    <span className="text-[10px] font-mono uppercase bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      {obs.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 font-semibold">{obs.fact}</div>
                  <div className="text-[11px] text-slate-500 font-mono bg-white border border-slate-200/80 rounded p-1.5">
                    <strong>Evidence:</strong> {obs.evidence}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* LAYER 2: DATA-BASED INTERPRETATION */}
      {/* ========================================================================= */}
      {(activeConceptTab === 'all' || activeConceptTab === 'interpretation') && (
        <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Data-Based Interpretation (Reasonable Commercial Deduction)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
              {interpretations.length} Deductions
            </span>
          </div>

          {interpretations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded">
              Insufficient data to draw commercial interpretations without speculation.
            </div>
          ) : (
            <div className="space-y-3">
              {interpretations.map((interp) => (
                <div
                  key={interp.id}
                  className="p-4 bg-amber-50/30 border border-amber-200/70 rounded-lg space-y-2 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>{interp.topic}</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                        interp.reviewUrgency === 'action_needed'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : interp.reviewUrgency === 'monitor'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {interp.reviewUrgency.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">{interp.interpretation}</div>
                  <div className="text-[11px] text-slate-500 font-mono bg-white border border-slate-200/80 rounded p-2">
                    <strong>Grounded In Observation:</strong> {interp.evidenceRef}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* LAYER 3: AI INTERPRETATION (Placeholder for Step 7) */}
      {/* ========================================================================= */}
      {(activeConceptTab === 'all' || activeConceptTab === 'ai') && (
        <section className="bg-gradient-to-r from-purple-50/60 to-indigo-50/40 border border-purple-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-200/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 text-purple-700 rounded border border-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-purple-950 tracking-tight">
                  Layer 3: AI Diagnostic Interpretation
                </h3>
                <span className="text-[11px] text-purple-700 font-mono">
                  Advanced Gemini Model Slot — Scheduled for Implementation in Step 7
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded font-bold shrink-0">
              Reserved for Step 7
            </span>
          </div>

          <div className="bg-white/90 border border-purple-200/80 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Epistemic Isolation Enforced: Zero Premature Generation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Per system specifications, all foundational business metrics (Revenue, Units, COGS, Stock Buffers, Time Sequences) are calculated deterministically on the client device. The application does not send raw transactions to an LLM to compute simple mathematical totals.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In <strong>Step 7</strong>, the verified observations and data-based interpretations above will be packaged into a structured prompt context for Gemini to produce multi-variable strategic counterfactuals and risk modeling.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-purple-800 font-mono text-[11px]">
                Target Model: <strong className="text-purple-950">Gemini 2.5 Flash / Pro (Interactions API)</strong>
              </span>
              {onNavigateToStep7 && (
                <button
                  onClick={onNavigateToStep7}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-center"
                >
                  <span>Continue to AI Insights Preparation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* UNIFIED BUSINESS ANALYSIS SUMMARY (Requirement 11) */}
      {/* ========================================================================= */}
      {(activeConceptTab === 'all' || activeConceptTab === 'summary') && (
        <section className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                EXECUTIVE SYNTHESIS
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Business Analysis Summary
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Deterministic Output
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. DATA AVAILABLE */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase font-mono">
                <FileCheck2 className="w-4 h-4 text-teal-700" />
                <span>Data Available</span>
              </div>
              {summary.dataAvailable.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {summary.dataAvailable.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-slate-400 italic">No verified commercial data sets detected.</div>
              )}
            </div>

            {/* 2. KEY METRICS SNAPSHOT */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase font-mono">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>Key Metrics Snapshot</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {summary.keyMetricsSummary.slice(0, 6).map((m, i) => (
                  <div key={i} className="p-1.5 bg-white border border-slate-200 rounded">
                    <div className="text-[10px] text-slate-500">{m.label}</div>
                    <div className={`font-mono font-bold ${m.isSupported ? 'text-slate-900' : 'text-slate-400 italic text-[11px]'}`}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. OBSERVED PATTERNS */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase font-mono">
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
                <span>Observed Patterns</span>
              </div>
              {summary.observedPatterns.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {summary.observedPatterns.map((p, i) => (
                    <div key={i} className="p-2 bg-white border border-slate-200 rounded space-y-0.5">
                      <div className="font-bold text-slate-800">{p.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.evidence}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No patterns detected from available inputs.</div>
              )}
            </div>

            {/* 4. AREAS TO REVIEW */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Areas to Review</span>
              </div>
              {summary.areasToReview.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {summary.areasToReview.map((r) => (
                    <div key={r.id} className="p-2 bg-white border border-slate-200 rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{r.title}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            r.riskSeverity === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : r.riskSeverity === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r.riskSeverity} risk
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">{r.reviewAction}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No critical risk areas identified.</div>
              )}
            </div>
          </div>

          {/* 5. UNAVAILABLE ANALYSES */}
          {summary.unavailableAnalyses.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase font-mono">
                <Info className="w-4 h-4 text-slate-400" />
                <span>Unavailable Analyses (Zero-Fabrication Protection)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {summary.unavailableAnalyses.map((u, i) => (
                  <div key={i} className="p-2 bg-white border border-slate-200 rounded space-y-0.5">
                    <div className="font-semibold text-slate-800">{u.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{u.missingRequirement}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
