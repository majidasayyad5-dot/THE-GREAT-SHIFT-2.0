import React, { useState } from 'react';
import { BusinessLevelId, NavSection, FileFormat, IngestedDataset } from '../../types/bi';
import { SUPPORTED_INGESTION_SPECS, QUALITY_VERIFICATION_RULES, BUSINESS_LEVELS } from '../../data/frameworkData';
import { SectionHeader } from '../common/SectionHeader';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileUp,
  Table,
  RefreshCw,
  Search,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

interface DataViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
  activeDataset?: IngestedDataset | null;
}

export const DataView: React.FC<DataViewProps> = ({ selectedLevel, onNavigate, activeDataset }) => {
  const [activeFormat, setActiveFormat] = useState<FileFormat>('csv');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [simulatedSelectedFileName, setSimulatedSelectedFileName] = useState<string | null>(null);

  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[0];
  const activeSpec = SUPPORTED_INGESTION_SPECS.find((s) => s.format === activeFormat) || SUPPORTED_INGESTION_SPECS[0];

  const handleSimulateFileSelect = (name: string) => {
    setSimulatedSelectedFileName(name);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Data Ingestion & Quality"
        subtitle="Upload spreadsheets or review supported CSV, Excel, and JSON formats for your business records."
        frameworkStage="DATA"
        badgeText={currentLevel.shortName}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('analyze')}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Analyze Business Pipeline</span>
            </button>
            <button
              onClick={() => onNavigate('insights')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              View Insights Engine
            </button>
          </div>
        }
      />

      {/* Active Ingested Dataset Banner if already staged in Analyze */}
      {activeDataset && (
        <div className="bg-white border border-teal-500/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold font-mono text-slate-900">{activeDataset.fileName}</span>
                  {activeDataset.isFictionalDemo ? (
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                      DEMO DATASET — FICTIONAL
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                      Ingested
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                    {activeDataset.status === 'processed' ? 'Status: Ingestion Verified' : 'Status: Staged'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {activeDataset.rowCount} rows · {activeDataset.columnCount} columns · {activeDataset.fileSizeFormatted}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('analyze')}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <span>Manage in Analyze Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-semibold">Columns:</span>
            {activeDataset.columns.map((c) => (
              <span key={c} className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ingestion Hub: Format Selectors & Upload Dropzone */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Multi-Format Connector
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Select Business Data Format
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Canonical parser ready for 4 commerce data conduits
          </span>
        </div>

        {/* Format Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {SUPPORTED_INGESTION_SPECS.map((spec) => {
            const isActive = activeFormat === spec.format;
            const Icon =
              spec.format === 'csv'
                ? FileSpreadsheet
                : spec.format === 'xlsx'
                ? Table
                : spec.format === 'pdf'
                ? FileText
                : FileCode;

            return (
              <button
                key={spec.format}
                onClick={() => setActiveFormat(spec.format)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-teal-600 bg-teal-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    {spec.extension}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {spec.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {spec.typicalSources}
                </div>
              </button>
            );
          })}
        </div>

        {/* Upload Dropzone Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleSimulateFileSelect(e.dataTransfer.files[0].name);
            }
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-teal-500 bg-teal-50/50'
              : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-teal-600 mx-auto mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Drag & Drop your {activeSpec.label} here
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
            {activeSpec.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer shadow-sm">
              <span>Browse Local Files ({activeSpec.extension})</span>
              <input
                type="file"
                className="hidden"
                accept={activeSpec.extension}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSimulateFileSelect(e.target.files[0].name);
                  }
                }}
              />
            </label>
          </div>

          {simulatedSelectedFileName ? (
            <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded max-w-md mx-auto text-left flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0" />
                <div>
                  <span className="font-semibold text-teal-900 block truncate">{simulatedSelectedFileName}</span>
                  <span className="text-[10px] text-teal-700 font-mono">File staged · Ingestion parser ready</span>
                </div>
              </div>
              <button
                onClick={() => setSimulatedSelectedFileName(null)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="mt-4 text-[11px] text-slate-400 font-mono">
              Ready for: Local Village POS logs · SME Accounting Ledgers · Global Customs Bills
            </div>
          )}
        </div>
      </div>

      {/* Data Quality & Integrity Validation Architecture */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Data Integrity Protocol
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Automated Data Quality & Schema Integrity Checker
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>5 Core Verification Dimensions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUALITY_VERIFICATION_RULES.map((rule, idx) => (
            <div key={rule.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    TEST 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    {rule.target}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  {rule.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {rule.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">Status</span>
                <span className="font-mono text-slate-400 italic">Awaiting Raw Stream</span>
              </div>
            </div>
          ))}

          {/* Canonical Schema Target Preview Box */}
          <div className="p-3.5 bg-slate-900 text-white rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-semibold text-teal-400">
                  SCHEMA SPEC
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  Canonical Commerce 2.0
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">
                Target Column Mapping Architecture
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                Automatic column matching maps heterogeneous header names to standardized business dimensions.
              </p>
              <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                <div>• timestamp / date (ISO 8601)</div>
                <div>• entity_id / customer_id / account</div>
                <div>• item_sku / product_category</div>
                <div>• quantity_units / volume</div>
                <div>• unit_price / gross_revenue</div>
                <div>• direct_cogs / variable_cost</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-teal-300 flex items-center justify-between">
              <span>Automatic column detection</span>
              <span className="font-mono">STANDBY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
