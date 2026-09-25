import React, { useState } from 'react';
import { BusinessLevelId, NavSection } from '../../types/bi';
import { BUSINESS_LEVELS } from '../../data/frameworkData';
import { SectionHeader } from '../common/SectionHeader';
import { EmptyDataPlaceholder } from '../common/EmptyDataPlaceholder';
import {
  LineChart as LineChartIcon,
  BarChart3,
  ScatterChart,
  PieChart,
  Calendar,
  Layers,
  Settings2,
  Database,
  SlidersHorizontal
} from 'lucide-react';

interface ChartsViewProps {
  selectedLevel: BusinessLevelId;
  onNavigate: (section: NavSection) => void;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ selectedLevel, onNavigate }) => {
  const currentLevel = BUSINESS_LEVELS.find((l) => l.id === selectedLevel) || BUSINESS_LEVELS[0];

  const [selectedChartType, setSelectedChartType] = useState<string>('time_series');
  const [xAxisDimension, setXAxisDimension] = useState<string>('timestamp');
  const [yAxisDimension, setYAxisDimension] = useState<string>('gross_revenue');
  const [aggregationType, setAggregationType] = useState<string>('sum');
  const [timeGrouping, setTimeGrouping] = useState<string>('monthly');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Business Charts"
        subtitle="Visual charts for revenue trends, product category mix, and expense breakdown."
        frameworkStage="CHARTS"
        badgeText={currentLevel.shortName}
        actions={
          <button
            onClick={() => onNavigate('data')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Connect Data</span>
          </button>
        }
      />

      {/* Chart Configuration Bar */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'time_series', label: 'Time-Series Velocity', icon: LineChartIcon },
              { id: 'margin_distribution', label: 'Margin Distribution', icon: BarChart3 },
              { id: 'price_elasticity', label: 'Price Elasticity', icon: ScatterChart },
              { id: 'channel_mix', label: 'Channel Breakdown', icon: PieChart },
            ].map((type) => {
              const Icon = type.icon;
              const isActive = selectedChartType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedChartType(type.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dimension Mapping Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              <span className="text-slate-500 font-mono text-[10px]">X-AXIS:</span>
              <select
                value={xAxisDimension}
                onChange={(e) => setXAxisDimension(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="timestamp">timestamp (Date / Time)</option>
                <option value="customer_segment">customer_segment</option>
                <option value="sku_category">sku_category</option>
                <option value="channel">sales_channel</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              <span className="text-slate-500 font-mono text-[10px]">Y-AXIS:</span>
              <select
                value={yAxisDimension}
                onChange={(e) => setYAxisDimension(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="gross_revenue">gross_revenue (GMV)</option>
                <option value="contribution_margin">contribution_margin</option>
                <option value="units_sold">units_sold</option>
                <option value="working_capital_days">working_capital_days</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              <span className="text-slate-500 font-mono text-[10px]">AGG:</span>
              <select
                value={aggregationType}
                onChange={(e) => setAggregationType(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="sum">SUM</option>
                <option value="mean">MEAN / AVG</option>
                <option value="median">MEDIAN</option>
                <option value="count">COUNT</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[460px] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Active Analytical View
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {selectedChartType === 'time_series' && 'Revenue Velocity & Transactional Volume Trajectory'}
              {selectedChartType === 'margin_distribution' && 'Contribution Margin Distribution by Product Category'}
              {selectedChartType === 'price_elasticity' && 'Price Point Elasticity vs Unit Sales Curve'}
              {selectedChartType === 'channel_mix' && 'Multi-Channel GMV & Take-Rate Proportions'}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <span>Group: {timeGrouping}</span>
            <span className="text-slate-300">|</span>
            <span>Scale: Linear</span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-700 font-semibold">Ready for Parser</span>
          </div>
        </div>

        {/* Real Chart Viewport with Grid Structure & Professional Empty State */}
        <div className="relative flex-1 bg-slate-50/70 border border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center my-2">
          {/* Subtle Grid Lines to anchor the chart architecture */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-30 pointer-events-none p-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-r border-b border-slate-300" />
            ))}
          </div>

          {/* Clean BI Empty State - Strictly zero fake charts */}
          <div className="relative z-10 text-center max-w-md">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 mx-auto mb-3">
              <LineChartIcon className="w-6 h-6 text-teal-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Visualization Engine Awaiting Ingested Coordinates
            </h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Charts render dynamically with full zooming, brush filtering, and outlier highlighting once a business dataset is supplied.
            </p>
            <div className="bg-white border border-slate-200 rounded px-3 py-2 text-[11px] text-slate-600 font-mono text-left mb-4">
              <div className="text-slate-400 text-[9px] uppercase font-semibold">Configured Dimensional Bindings:</div>
              <div>• Domain (X): {xAxisDimension}</div>
              <div>• Range (Y): {yAxisDimension} ({aggregationType.toUpperCase()})</div>
              <div>• Business Level: {currentLevel.shortName}</div>
            </div>
            <button
              onClick={() => onNavigate('data')}
              className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Upload Data to Render Chart
            </button>
          </div>
        </div>

        {/* Summary Telemetry Ribbon (Tabular Figures) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Sample Count (N)</span>
            <span className="font-mono tabular-nums font-semibold text-slate-400">— records</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Range Minimum</span>
            <span className="font-mono tabular-nums font-semibold text-slate-400">—</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Range Maximum</span>
            <span className="font-mono tabular-nums font-semibold text-slate-400">—</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Std Deviation (σ)</span>
            <span className="font-mono tabular-nums font-semibold text-slate-400">—</span>
          </div>
        </div>
      </div>
    </div>
  );
};
