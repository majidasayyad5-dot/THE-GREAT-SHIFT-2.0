import React from 'react';
import { UnifiedDataSourceSummary, DataSufficiencyReport } from '../../types/bi';
import { Database, Sliders, FileSpreadsheet, ShieldCheck, AlertCircle, Info, Layers } from 'lucide-react';

interface DataSourceIndicatorProps {
  summary: UnifiedDataSourceSummary;
  sufficiency?: DataSufficiencyReport;
  onNavigateToAnalyze?: () => void;
  showSufficiencyDetails?: boolean;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  summary,
  sufficiency,
  onNavigateToAnalyze,
  showSufficiencyDetails = true,
}) => {
  const getSufficiencyColor = (state: string) => {
    switch (state) {
      case 'Ready':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Partially Ready':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-teal-600" />
            <span>DATA SOURCE</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-2 flex-wrap">
            <span>{summary.summaryText}</span>
          </div>
        </div>

        {sufficiency && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
              Data Sufficiency:
            </span>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 ${getSufficiencyColor(
                sufficiency.state
              )}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  sufficiency.state === 'Ready'
                    ? 'bg-emerald-500'
                    : sufficiency.state === 'Partially Ready'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span>{sufficiency.state}</span>
            </span>
          </div>
        )}
      </div>

      {/* Sources Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {summary.sources.length === 0 ? (
          <span className="text-xs text-slate-400 italic">
            No active commercial data sources connected.
          </span>
        ) : (
          summary.sources.map((s, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 ${
                s.type === 'manual'
                  ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                  : s.type === 'upload'
                  ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  s.type === 'manual'
                    ? 'bg-teal-600'
                    : s.type === 'upload'
                    ? 'bg-blue-600'
                    : 'bg-amber-600'
                }`}
              />
              <span className="font-bold">{s.label}</span>
              <span className="text-[10px] font-mono opacity-80">
                ({s.recordCount} records)
              </span>
              {s.type === 'demo' && (
                <span className="text-[9px] font-mono uppercase bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-extrabold tracking-wider border border-amber-300">
                  DEMO DATASET · FICTIONAL
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sufficiency explanation */}
      {showSufficiencyDetails && sufficiency && (
        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-slate-800">{sufficiency.summary}</div>
            {sufficiency.reasons.length > 0 && (
              <div className="text-[11px] text-slate-500 font-mono">
                {sufficiency.reasons.slice(0, 2).join(' ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
