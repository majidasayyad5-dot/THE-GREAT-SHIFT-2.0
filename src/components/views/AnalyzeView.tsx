import React, { useState, useRef, ChangeEvent, DragEvent, useMemo } from 'react';
import {
  BusinessLevelId,
  NavSection,
  IngestedDataset,
  BusinessAffairsData,
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { DEMO_CLOTHING_DATA, DEMO_DATASET_COLUMNS, createAshaDemoDataset } from '../../data/demoDataset';
import { TryAshaDemoButton } from '../common/TryAshaDemoButton';
import { parseUploadedFile } from '../../utils/dataParser';
import { analyzeDataQuality } from '../../utils/dataQualityAnalyzer';
import { buildUnifiedBusinessData } from '../../utils/unifiedDataLayer';
import { runUnifiedBusinessAnalysis } from '../../utils/unifiedAnalysisEngine';
import { SectionHeader } from '../common/SectionHeader';
import { DataQualitySection } from './DataQualitySection';
import { DataSourceIndicator } from '../analysis/DataSourceIndicator';
import { KeyMetricsGrid } from '../analysis/KeyMetricsGrid';
import { SpecializedDiagnosticsPanel } from '../analysis/SpecializedDiagnosticsPanel';
import { DiagnosticChartsPanel } from '../analysis/DiagnosticChartsPanel';
import { ObservedVsInterpretationPanel } from '../analysis/ObservedVsInterpretationPanel';
import {
  Store,
  Building2,
  Globe2,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  FileCode,
  FileCheck2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Database,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Table,
  Info,
  Check,
  Layers,
  Sparkles,
  BarChart3,
  Boxes,
  Users,
  Receipt,
  DollarSign,
} from 'lucide-react';

interface AnalyzeViewProps {
  selectedLevel: BusinessLevelId;
  onSelectLevel: (levelId: BusinessLevelId) => void;
  onNavigate: (section: NavSection) => void;
  activeDataset?: IngestedDataset | null;
  onDatasetLoaded?: (dataset: IngestedDataset | null) => void;
  onProcessData?: (dataset: IngestedDataset) => void;
  businessAffairs?: BusinessAffairsData;
  unifiedDataLayer?: UnifiedBusinessDataLayer;
  unifiedAnalysis?: UnifiedBusinessAnalysisReport;
  enabledSources?: { manual: boolean; upload: boolean; demo: boolean };
  onToggleSource?: (source: 'manual' | 'upload' | 'demo') => void;
  onStartAshaDemo?: () => void;
  isDemoMode?: boolean;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  selectedLevel,
  onSelectLevel,
  onNavigate,
  activeDataset,
  onDatasetLoaded,
  onProcessData,
  businessAffairs,
  unifiedDataLayer: propDataLayer,
  unifiedAnalysis: propAnalysis,
  enabledSources: propEnabledSources,
  onToggleSource,
  onStartAshaDemo,
  isDemoMode = false,
}) => {
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[1];

  // Local state for dataset
  const [dataset, setDataset] = useState<IngestedDataset | null>(activeDataset || null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<'idle' | 'reading' | 'validating' | 'checking'>('idle');
  const [previewRowCount, setPreviewRowCount] = useState<number>(6);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'all' | 'data_sources' | 'metrics' | 'diagnostics' | 'charts' | 'interpretations'>('all');

  // Local source toggle states if not passed from parent
  const [localSources, setLocalSources] = useState<{ manual: boolean; upload: boolean; demo: boolean }>({
    manual: true,
    upload: true,
    demo: true,
  });

  const activeEnabledSources = propEnabledSources || localSources;

  const handleToggle = (src: 'manual' | 'upload' | 'demo') => {
    if (onToggleSource) {
      onToggleSource(src);
    } else {
      setLocalSources((prev) => ({ ...prev, [src]: !prev[src] }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync dataset if activeDataset changes from parent
  React.useEffect(() => {
    if (activeDataset !== undefined) {
      setDataset(activeDataset);
    }
  }, [activeDataset]);

  // Compute unified analysis if not passed from props
  const localDataLayer = useMemo(() => {
    return buildUnifiedBusinessData(businessAffairs, dataset, {
      includeManual: activeEnabledSources.manual,
      includeUpload: activeEnabledSources.upload,
      includeDemo: activeEnabledSources.demo,
    });
  }, [businessAffairs, dataset, activeEnabledSources]);

  const analysis: UnifiedBusinessAnalysisReport = useMemo(() => {
    if (propAnalysis && !activeDataset) return propAnalysis;
    return runUnifiedBusinessAnalysis(localDataLayer);
  }, [propAnalysis, localDataLayer, activeDataset]);

  // Update internal and parent dataset state
  const handleSetDataset = (newDataset: IngestedDataset | null) => {
    setDataset(newDataset);
    setValidationError(null);
    if (onDatasetLoaded) {
      onDatasetLoaded(newDataset);
    }
  };

  // 1. Handle File Upload
  const processIncomingFile = async (file: File) => {
    setValidationError(null);
    try {
      const result = await parseUploadedFile(file);
      if (!result.success || !result.dataset) {
        setValidationError(result.errorMessage || 'An error occurred while reading the file.');
        return;
      }
      handleSetDataset(result.dataset);
    } catch (err: any) {
      setValidationError(err.message || 'Unexpected parsing failure.');
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processIncomingFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFile(e.dataTransfer.files[0]);
    }
  };

  // 2. Load Demo Dataset
  const handleLoadDemoDataset = () => {
    if (onStartAshaDemo) {
      onStartAshaDemo();
      return;
    }
    setValidationError(null);
    const demoData = createAshaDemoDataset();
    handleSetDataset(demoData);
  };

  // Remove File
  const handleRemoveFile = () => {
    handleSetDataset(null);
    setValidationError(null);
    setProcessingStep('idle');
  };

  // 3. Process Data Button
  const handleProcessData = () => {
    if (!dataset || !selectedLevel) return;
    setIsProcessing(true);
    setProcessingStep('reading');

    setTimeout(() => {
      setProcessingStep('validating');
      setTimeout(() => {
        setProcessingStep('checking');
        setTimeout(() => {
          setIsProcessing(false);
          setProcessingStep('idle');

          const qualityReport = analyzeDataQuality(dataset);
          const processedDataset: IngestedDataset = {
            ...dataset,
            status: 'processed',
            qualityReport,
          };
          handleSetDataset(processedDataset);

          if (onProcessData) {
            onProcessData(processedDataset);
          }
        }, 300);
      }, 280);
    }, 260);
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    const lower = (fileName + ' ' + fileType).toLowerCase();
    if (lower.includes('csv')) return <FileText className="w-5 h-5 text-teal-600" />;
    if (lower.includes('xls') || lower.includes('sheet')) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (lower.includes('json')) return <FileCode className="w-5 h-5 text-amber-600" />;
    if (lower.includes('pdf')) return <FileText className="w-5 h-5 text-rose-600" />;
    return <FileCheck2 className="w-5 h-5 text-slate-600" />;
  };

  const hasValidDataset = !!dataset && (dataset.rowCount > 0 || !!dataset.pdfNotice);
  const isProcessButtonEnabled = !!selectedLevel && hasValidDataset && !isProcessing;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <SectionHeader
        title="Analyze Business"
        subtitle="Upload a spreadsheet or inspect combined records from your business to run diagnostic checks."
        frameworkStage="DIAGNOSTIC ENGINE"
        badgeText={currentLevel.shortName}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {!isDemoMode && (
              <TryAshaDemoButton
                onStartDemo={onStartAshaDemo || handleLoadDemoDataset}
              />
            )}
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('manage_affairs')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Manage Affairs</span>
            </button>
          </div>
        }
      />

      {/* 8-Step Sequential Progress Flow (Requirement 5) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 px-1 flex items-center justify-between">
          <span>ANALYSIS EXECUTION PIPELINE</span>
          <span className="text-teal-700 font-semibold font-mono text-[10px]">CLICK ANY STEP TO NAVIGATE</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'data', num: '01', name: 'DATA', status: hasValidDataset || (businessAffairs && businessAffairs.sales.length > 0) ? 'Ready' : 'Pending', onClick: () => setActiveWorkspaceTab('data_sources') },
            { id: 'quality', num: '02', name: 'QUALITY', status: dataset?.qualityReport ? 'Verified' : 'Pending', onClick: () => setActiveWorkspaceTab('data_sources') },
            { id: 'diagnostic', num: '03', name: 'DIAGNOSTIC', status: 'Computed', onClick: () => setActiveWorkspaceTab('diagnostics') },
            { id: 'charts', num: '04', name: 'CHARTS', status: 'Available', onClick: () => onNavigate('charts') },
            { id: 'insights', num: '05', name: 'AI INSIGHTS', status: 'Available', onClick: () => onNavigate('insights') },
            { id: 'recommendations', num: '06', name: 'RECOMMENDATIONS', status: 'Ready', onClick: () => onNavigate('recommendations') },
            { id: 'impact', num: '07', name: 'IMPACT', status: 'Modeled', onClick: () => onNavigate('impact') },
            { id: 'decision', num: '08', name: 'DECISION', status: 'Review Console', onClick: () => onNavigate('decision') },
          ].map((step, idx, arr) => (
            <React.Fragment key={step.id}>
              <button
                onClick={step.onClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/50 transition-all cursor-pointer shrink-0 text-left group"
              >
                <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                  {step.num}
                </span>
                <span className="font-bold text-slate-800 text-[11px] group-hover:text-teal-900">
                  {step.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                  {step.status}
                </span>
              </button>
              {idx < arr.length - 1 && (
                <span className="text-slate-300 font-bold shrink-0">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Bar for Command Center */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-lg p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveWorkspaceTab('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeWorkspaceTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('data_sources')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeWorkspaceTab === 'data_sources'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Sources
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('metrics')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeWorkspaceTab === 'metrics'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Key Metrics
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('diagnostics')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeWorkspaceTab === 'diagnostics'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('charts')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeWorkspaceTab === 'charts'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('interpretations')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeWorkspaceTab === 'interpretations'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Findings
          </button>
        </div>

        <button
          onClick={() => onNavigate('insights')}
          className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <span>Continue to AI Insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DATA SOURCE INDICATOR & SUFFICIENCY (Requirement 9 & 10) */}
      {/* ========================================================================= */}
      <DataSourceIndicator
        summary={analysis.dataSourceSummary}
        sufficiency={analysis.sufficiency}
        onNavigateToAnalyze={() => setActiveWorkspaceTab('data_sources')}
      />

      {/* ========================================================================= */}
      {/* 2. SELECTED BUSINESS LEVEL (Requirement 13.1) */}
      {/* ========================================================================= */}
      {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'data_sources') && (
        <section className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                STEP 2.1 — OPERATING SCALE CALIBRATION
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Business Level Selection
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Active Tier: <span className="font-bold text-teal-700">{currentLevel.shortName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BUSINESS_LEVELS.map((level) => {
              const isSelected = level.id === selectedLevel;
              return (
                <div
                  key={level.id}
                  onClick={() => onSelectLevel(level.id)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-md ${
                            isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {level.id === 'local_village' && <Store className="w-4 h-4" />}
                          {level.id === 'city_growing' && <Building2 className="w-4 h-4" />}
                          {level.id === 'international_global' && <Globe2 className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-mono font-bold uppercase text-slate-500">
                          {level.shortName}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{level.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{level.description}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                    <span>Operating Scale: </span>
                    <strong className="text-slate-900">{level.tagline}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. DATA SOURCES & INGESTION (Requirement 1 & 13.2) */}
      {/* ========================================================================= */}
      {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'data_sources') && (
        <section className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                STEP 2.2 — UNIFIED COMMERCIAL DATA LAYER
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Active Data Sources & Ingestion
              </h2>
            </div>
            {/* Active Sources Toggle Switcher */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Include:</span>
              <button
                onClick={() => handleToggle('manual')}
                className={`px-2 py-1 rounded border text-[11px] font-semibold cursor-pointer ${
                  activeEnabledSources.manual
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                ● Business Affairs
              </button>
              <button
                onClick={() => handleToggle('upload')}
                className={`px-2 py-1 rounded border text-[11px] font-semibold cursor-pointer ${
                  activeEnabledSources.upload
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                ● Uploaded File
              </button>
              <button
                onClick={() => handleToggle('demo')}
                className={`px-2 py-1 rounded border text-[11px] font-semibold cursor-pointer ${
                  activeEnabledSources.demo
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                ● Demo Dataset
              </button>
            </div>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">File Parsing Notice: </span>
                {validationError}
              </div>
            </div>
          )}

          {/* Upload Drop Zone & Demo Loader */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-teal-600 bg-teal-50/60 scale-[1.005]'
                  : 'border-slate-300 hover:border-teal-700 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls, .json, .pdf, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/json, application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-2.5">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-900">
                Click to browse or drag and drop transaction ledger
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                Supported formats: <strong>CSV, XLSX, XLS, JSON, PDF</strong>. Local browser ingestion only.
              </p>
            </div>

            {/* Demo Dataset Trigger Box */}
            <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-amber-50/40 to-slate-50 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-amber-800 font-bold mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  FICTIONAL DEMO DATASET
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Asha's Handmade Clothing
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Prepared fictional clothing business dataset with 28 structured transactions across 9 products, price variances, stockout risks, and margin patterns.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60">
                <TryAshaDemoButton
                  onStartDemo={onStartAshaDemo || handleLoadDemoDataset}
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>

          {/* Staged File Status Card */}
          {dataset && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                    {getFileIcon(dataset.fileType, dataset.fileName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {dataset.fileName}
                      </span>
                      {dataset.isFictionalDemo ? (
                        <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                          DEMO DATASET — FICTIONAL
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                          User Ingested
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          dataset.status === 'processed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        Status: {dataset.status === 'processed' ? 'Ingestion Verified' : 'Staged for Processing'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1 font-mono">
                      <span>Type: {dataset.fileType}</span>
                      <span>·</span>
                      <span>Size: {dataset.fileSizeFormatted}</span>
                      <span>·</span>
                      <span>Logged at {dataset.uploadTimestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleProcessData}
                    disabled={!isProcessButtonEnabled}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isProcessButtonEnabled
                        ? 'bg-teal-700 hover:bg-teal-800 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    }`}
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>{dataset.status === 'processed' ? 'Re-verify Data' : 'Process File'}</span>
                  </button>

                  <button
                    onClick={handleRemoveFile}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Remove staged file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Staged Data Preview Table */}
          {dataset && dataset.records.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden space-y-2">
              <div className="p-3 bg-slate-50 flex items-center justify-between text-xs border-b border-slate-200">
                <span className="font-bold text-slate-800 font-mono">
                  Data Structure Preview ({dataset.rowCount} rows, {dataset.columnCount} columns)
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <span>Show rows:</span>
                  <select
                    value={previewRowCount}
                    onChange={(e) => setPreviewRowCount(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none"
                  >
                    <option value={4}>4 rows</option>
                    <option value={6}>6 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-mono text-slate-600">
                      <th className="py-2 px-3 border-r border-slate-200 w-10 text-center text-slate-400">#</th>
                      {dataset.columns.map((col) => (
                        <th key={col} className="py-2 px-3 border-r border-slate-200 font-semibold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {dataset.records.slice(0, previewRowCount).map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50 font-mono text-[11px] text-slate-800">
                        <td className="py-1.5 px-3 border-r border-slate-100 text-center text-slate-400">
                          {rowIdx + 1}
                        </td>
                        {dataset.columns.map((col) => (
                          <td key={col} className="py-1.5 px-3 border-r border-slate-100 whitespace-nowrap">
                            {row[col] !== undefined && row[col] !== null ? String(row[col]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. DATA QUALITY AUDIT (Requirement 13.3) */}
      {/* ========================================================================= */}
      {dataset?.qualityReport && !isProcessing && (
        <DataQualitySection
          dataset={dataset}
          qualityReport={dataset.qualityReport}
          onContinueToAnalysis={() => setActiveWorkspaceTab('metrics')}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. KEY METRICS (Requirement 2 & 13.4) */}
      {/* ========================================================================= */}
      {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'metrics') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                OPERATIONAL VITAL SIGNS
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Verified Key Metrics
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Zero-Fabrication Protection Active
            </span>
          </div>

          <KeyMetricsGrid
            metrics={analysis.keyMetrics}
            onNavigateToAffairs={() => onNavigate('manage_affairs')}
          />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. BUSINESS DIAGNOSTIC (Requirement 4-8 & 13.5) */}
      {/* ========================================================================= */}
      {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'diagnostics') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                MULTIDIMENSIONAL AUDIT
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Specialized Diagnostic Modules
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Sales · Products · Inventory · Customers · Expenses · Time
            </span>
          </div>

          <SpecializedDiagnosticsPanel
            analysis={analysis}
            onNavigateToAffairs={() => onNavigate('manage_affairs')}
          />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. CHARTS (Requirement 13.6) */}
      {/* ========================================================================= */}
      {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'charts') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-semibold">
                VISUAL TELEMETRY
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Deterministic Diagnostic Charts
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Interactive Recharts
            </span>
          </div>

          <DiagnosticChartsPanel analysis={analysis} />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. THREE CONCEPT LAYERS & UNIFIED SUMMARY (Requirement 11, 13.7, 13.8, 14) */}
      {/* ========================================================================= */}
      {(activeWorkspaceTab === 'all' || activeWorkspaceTab === 'interpretations') && (
        <ObservedVsInterpretationPanel
          observedFindings={analysis.observedFindings}
          interpretations={analysis.dataBasedInterpretations}
          areasToReview={analysis.areasToReview}
          summary={analysis.summary}
          onNavigateToStep7={() => onNavigate('insights')}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. CONTINUE TO AI INSIGHTS (Requirement 13.9) */}
      {/* ========================================================================= */}
      <div className="bg-[#0B152F] text-white border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-semibold">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>STEP 6 COMPLETE → READY FOR STEP 7</span>
          </div>
          <h3 className="text-base font-bold tracking-tight text-white">
            Unified Analysis Engine Fully Calibrated
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            All operational records, uploaded datasets, and test ledgers have been normalized into deterministic metrics and observed patterns. Next, proceed to AI Insights where Gemini will perform strategic synthesis.
          </p>
        </div>

        <button
          onClick={() => onNavigate('insights')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-start sm:self-center"
        >
          <span>Continue to AI Insights</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
