import React, { useState } from 'react';
import { IngestedDataset, DataQualityReport } from '../../types/bi';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Layers,
  FileSpreadsheet,
  Hash,
  Copy,
  Percent,
  Search,
  ArrowRight,
  ShieldCheck,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Database,
  Check,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface DataQualitySectionProps {
  dataset: IngestedDataset;
  qualityReport: DataQualityReport;
  onContinueToAnalysis: () => void;
}

export const DataQualitySection: React.FC<DataQualitySectionProps> = ({
  dataset,
  qualityReport,
  onContinueToAnalysis,
}) => {
  const [showProcessedTable, setShowProcessedTable] = useState<boolean>(false);
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [tableLimit, setTableLimit] = useState<number>(10);

  // Status renderer helper
  const renderStatusBadge = (status: 'Good' | 'Needs Review' | 'Problem') => {
    switch (status) {
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>✓ Good</span>
          </span>
        );
      case 'Needs Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>⚠ Needs Review</span>
          </span>
        );
      case 'Problem':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>✕ Problem</span>
          </span>
        );
    }
  };

  // Filter records for the Processed Data table
  const filteredRecords = React.useMemo(() => {
    if (!tableSearchQuery.trim()) return dataset.records;
    const query = tableSearchQuery.toLowerCase();
    return dataset.records.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '').toLowerCase().includes(query)
      )
    );
  }, [dataset.records, tableSearchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. OBSERVED DATA NOTICE BANNER (Strict Non-AI boundary) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-slate-100 rounded-lg p-4 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-teal-400 uppercase">
                DATA OBSERVED FROM UPLOADED DATA
              </span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded">
                Deterministic Audit
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              All metrics and quality statuses below are computed directly from the uploaded ledger. Zero generative AI or synthetic extrapolations are used in this diagnostic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <span className="text-xs font-mono text-slate-400">Overall Dataset Status:</span>
          {renderStatusBadge(qualityReport.overallStatus)}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DATA QUALITY DASHBOARD (7 Mandatory Metric Cards) */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              DIAGNOSTIC TELEMETRY
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Data Quality Dashboard
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Audited at {qualityReport.analyzedAt}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* 1. Total Records */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Total Records</span>
              <Hash className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">
              {qualityReport.totalRecords.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              Row count
            </div>
          </div>

          {/* 2. Total Fields */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Total Fields</span>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">
              {qualityReport.totalFields}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              Columns detected
            </div>
          </div>

          {/* 3. Missing Values */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Missing Values</span>
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className={`text-lg font-bold font-mono ${
              qualityReport.missingValuesCount > 0 ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {qualityReport.missingValuesCount}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              {qualityReport.totalCells > 0 ? `${qualityReport.missingValuesPct}% of cells` : 'Not available'}
            </div>
          </div>

          {/* 4. Duplicate Records */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Duplicate Records</span>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className={`text-lg font-bold font-mono ${
              qualityReport.duplicateRecordsCount > 0 ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {qualityReport.duplicateRecordsCount}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              {qualityReport.duplicateRecordsCount === 0 ? '0 duplicate rows' : `${qualityReport.duplicateRecordsPct}% duplicate rate`}
            </div>
          </div>

          {/* 5. Date Coverage */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Date Coverage</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-sm font-bold font-mono text-slate-900 truncate" title={qualityReport.dateCoverage ? qualityReport.dateCoverage.formatted : 'Not available'}>
              {qualityReport.dateCoverage ? `${qualityReport.dateCoverage.rangeDays} Days` : 'Not available'}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
              {qualityReport.dateCoverage ? `${qualityReport.dateCoverage.minDate} → ${qualityReport.dateCoverage.maxDate}` : 'No date field found'}
            </div>
          </div>

          {/* 6. Numeric Fields */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Numeric Fields</span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">
              {qualityReport.numericFieldsCount}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              Amount / Counts
            </div>
          </div>

          {/* 7. Data Completeness */}
          <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-medium">Data Completeness</span>
              <Percent className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className={`text-lg font-bold font-mono ${
              qualityReport.dataCompletenessPct >= 95 ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {qualityReport.totalCells > 0 ? `${qualityReport.dataCompletenessPct}%` : 'Not available'}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              Populated cells ratio
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DATA WARNINGS (If Any Problems Detected) */}
      {/* ========================================================================= */}
      {qualityReport.warnings.length > 0 ? (
        <section className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h4 className="text-xs font-bold font-mono tracking-tight uppercase">
              Data Quality Warnings ({qualityReport.warnings.length})
            </h4>
          </div>
          <ul className="space-y-1 pl-6 list-disc text-xs text-amber-800">
            {qualityReport.warnings.map((warn, i) => (
              <li key={i} className="leading-relaxed">
                {warn}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero Data Quality Warnings:</strong> All rows have complete column records and valid type representations.
          </span>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. BUSINESS ANALYSIS READINESS */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              STEP 3.2 — CAPABILITY MAPPING
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Business Analysis Readiness
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Matching Standard Commercial Fields
          </span>
        </div>

        {/* Business Field Detection Grid */}
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Commercial Fields Detected in Ledger:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {qualityReport.businessFieldsDetected.map((bf) => (
              <div
                key={bf.key}
                className={`p-2.5 rounded border text-xs flex flex-col justify-between ${
                  bf.isDetected
                    ? 'bg-teal-50/50 border-teal-200 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold truncate">{bf.label.split('/')[0].trim()}</span>
                  {bf.isDetected ? (
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" title="Detected" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" title="Not detected" />
                  )}
                </div>
                <div className="text-[10px] font-mono truncate">
                  {bf.isDetected ? (
                    <span className="text-teal-700 font-semibold">Column: {bf.matchedColumn}</span>
                  ) : (
                    <span className="text-slate-400 italic">Not detected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Business Readiness Explanations */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-800 mb-2">
            Deterministic Readiness Assessment:
          </div>
          <div className="space-y-2">
            {qualityReport.readinessExplanation.map((exp, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 flex items-start gap-2.5"
              >
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{exp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COLUMN ANALYSIS TABLE */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              STEP 3.3 — SCHEMA & INTEGRITY AUDIT
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Column Analysis & Field Breakdown
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-500">
            {qualityReport.columns.length} Fields Evaluated
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-mono text-slate-600">
                  <th className="py-2.5 px-3 border-r border-slate-200 font-semibold">Field Name</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 font-semibold">Detected Type</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 font-semibold text-right">Non-Empty</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 font-semibold text-right">Missing</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 font-semibold text-right">Unique Values</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 font-semibold">Sample Values</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {qualityReport.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50/70 font-mono text-[11px] text-slate-800">
                    {/* Field Name */}
                    <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-slate-900">
                      {col.name}
                    </td>

                    {/* Detected Type */}
                    <td className="py-2.5 px-3 border-r border-slate-100">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        col.detectedType === 'Date'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : col.detectedType === 'Currency/Amount'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : col.detectedType === 'Number'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : col.detectedType === 'Category'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : col.detectedType === 'Boolean'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {col.detectedType}
                      </span>
                    </td>

                    {/* Non-Empty */}
                    <td className="py-2.5 px-3 border-r border-slate-100 text-right tabular-nums text-slate-700">
                      {col.nonEmptyCount}
                    </td>

                    {/* Missing */}
                    <td className="py-2.5 px-3 border-r border-slate-100 text-right tabular-nums">
                      {col.missingCount > 0 ? (
                        <span className="text-amber-700 font-bold">{col.missingCount} ({col.missingPct}%)</span>
                      ) : (
                        <span className="text-slate-400">0 (0%)</span>
                      )}
                    </td>

                    {/* Unique Values */}
                    <td className="py-2.5 px-3 border-r border-slate-100 text-right tabular-nums text-slate-700">
                      {col.uniqueCount}
                    </td>

                    {/* Sample Values */}
                    <td className="py-2.5 px-3 border-r border-slate-100 font-sans text-xs text-slate-500 max-w-[220px] truncate">
                      {col.sampleValues.length > 0
                        ? col.sampleValues.map((s) => String(s)).join(', ')
                        : '—'}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col gap-0.5">
                        {renderStatusBadge(col.status)}
                        <span className="text-[10px] text-slate-400 font-sans truncate" title={col.statusReason}>
                          {col.statusReason}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CLEAN DATA PREVIEW ("View Processed Data" Collapsible / Modal) */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              STEP 3.4 — PROCESSED DATASET
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Processed Dataset Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified tabular data normalized for analytical procedures. The original source file remains immutable.
            </p>
          </div>

          <button
            onClick={() => setShowProcessedTable(!showProcessedTable)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Eye className="w-3.5 h-3.5 text-teal-700" />
            <span>{showProcessedTable ? 'Hide Processed Data' : 'View Processed Data'}</span>
            {showProcessedTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showProcessedTable && (
          <div className="space-y-3 pt-3 border-t border-slate-100 animate-fadeIn">
            {/* Search and Limit Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <span>Showing:</span>
                <select
                  value={tableLimit}
                  onChange={(e) => setTableLimit(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={500}>All records</option>
                </select>
                <span>of {filteredRecords.length} filtered records</span>
              </div>
            </div>

            {/* Scrollable Processed Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-mono text-slate-600 sticky top-0 z-10">
                      <th className="py-2.5 px-3 border-r border-slate-200 w-10 text-center text-slate-400 bg-slate-100">#</th>
                      {dataset.columns.map((col) => (
                        <th key={col} className="py-2.5 px-3 border-r border-slate-200 font-semibold whitespace-nowrap bg-slate-100">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-mono text-[11px]">
                    {filteredRecords.slice(0, tableLimit).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 text-slate-800">
                        <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400 tabular-nums">
                          {idx + 1}
                        </td>
                        {dataset.columns.map((col) => {
                          const val = row[col];
                          const isNumber = typeof val === 'number';
                          return (
                            <td
                              key={col}
                              className={`py-2 px-3 border-r border-slate-100 whitespace-nowrap ${
                                isNumber ? 'text-right tabular-nums' : ''
                              }`}
                            >
                              {val !== undefined && val !== null && String(val) !== '' ? (
                                String(val)
                              ) : (
                                <span className="text-slate-300 italic">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRecords.length > tableLimit && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-mono">
                  Showing first {tableLimit} rows. Use the dropdown above to expand.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 7. CONTINUE TO ANALYSIS ACTION */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
              STEP 3.5 — WORKFLOW TRANSITION
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Continue to Business Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              {qualityReport.canContinueToAnalysis
                ? 'Dataset satisfies quality and field readiness criteria. Proceed to diagnostic intelligence and analytical calculations.'
                : qualityReport.missingRequirementsMessage ||
                  'Dataset does not contain enough readable information to perform basic business analysis.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onContinueToAnalysis}
              disabled={!qualityReport.canContinueToAnalysis}
              className={`px-5 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                qualityReport.canContinueToAnalysis
                  ? 'bg-teal-700 hover:bg-teal-800 text-white active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>Continue to Business Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
