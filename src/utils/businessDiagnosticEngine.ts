import { IngestedDataset } from '../types/bi';

export interface TrendDataPoint {
  period: string;
  revenue: number;
  units: number;
  transactionCount: number;
}

export interface ProductPerformanceData {
  product: string;
  revenue: number;
  unitsSold: number;
  averagePrice: number;
  revenueSharePct: number;
  inventory?: number;
}

export interface CategoryData {
  category: string;
  revenue: number;
  unitsSold: number;
  transactionCount: number;
  revenueSharePct: number;
}

export interface RegionalData {
  region: string;
  revenue: number;
  unitsSold: number;
  transactionCount: number;
  revenueSharePct: number;
}

export interface InventoryImbalanceAlert {
  product: string;
  inventory: number;
  unitsSold: number;
  type: 'high_inventory_low_sales' | 'low_inventory_high_sales' | 'disproportionate_stock';
  observation: string;
  interpretation: string;
}

export interface BusinessAlert {
  id: string;
  type: 'warning' | 'positive' | 'neutral';
  title: string;
  evidence: string;
  interpretation: string;
}

export interface DiagnosticFinding {
  id: string;
  topic: string;
  observedData: string;
  possibleInterpretation: string;
  requiresAttention: boolean;
  metricValue?: string | number;
}

export interface BusinessDiagnosticResult {
  hasProcessedData: boolean;
  recordsAnalyzed: number;
  fieldsAnalyzed: number;

  // Key findings count for top summary
  keyObservationsCount: number;
  areasToReviewCount: number;

  // Trend Diagnostic
  trendAnalysis: {
    isAvailable: boolean;
    reasonIfNotAvailable?: string;
    groupingType: 'Daily' | 'Weekly' | 'Monthly';
    dataPoints: TrendDataPoint[];
    totalRevenue: number;
    totalUnits: number;
    avgRevenuePerPeriod: number;
    highestPeriod: { period: string; revenue: number } | null;
    lowestPeriod: { period: string; revenue: number } | null;
    trendDirection: 'increasing' | 'decreasing' | 'mixed' | 'stable';
    trendObservation: string;
    trendInterpretation: string;
  };

  // Product Diagnostic
  productAnalysis: {
    isAvailable: boolean;
    reasonIfNotAvailable?: string;
    products: ProductPerformanceData[];
    topPerformingByRevenue: ProductPerformanceData[];
    lowestPerformingByRevenue: ProductPerformanceData[];
    topPerformingByUnits: ProductPerformanceData[];
    revenueConcentrationPct: number; // Top product share
    topProductName: string;
    observation: string;
    interpretation: string;
  };

  // Category Diagnostic
  categoryAnalysis: {
    isAvailable: boolean;
    reasonIfNotAvailable?: string;
    categories: CategoryData[];
    topCategory: CategoryData | null;
    observation: string;
    interpretation: string;
  };

  // Regional Diagnostic
  regionalAnalysis: {
    isAvailable: boolean;
    reasonIfNotAvailable?: string;
    regions: RegionalData[];
    topRegion: RegionalData | null;
    observation: string;
    interpretation: string;
  };

  // Inventory Diagnostic
  inventoryAnalysis: {
    isAvailable: boolean;
    reasonIfNotAvailable?: string;
    imbalances: InventoryImbalanceAlert[];
    totalInventoryOnHand: number;
    observation: string;
    interpretation: string;
  };

  // Cost & Margin Diagnostic
  marginAnalysis: {
    isAvailable: boolean;
    reasonIfNotAvailable?: string;
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    overallGrossMarginPct: number;
    observation: string;
    interpretation: string;
  };

  // Section A: All Observed Findings
  observedFindings: DiagnosticFinding[];

  // Section B: Areas Requiring Attention
  attentionAreas: DiagnosticFinding[];

  // Alerts with explicit data-grounded evidence
  alerts: BusinessAlert[];
}

/**
 * Safely parse numbers from dataset cells (handles $, commas, strings)
 */
function cleanNumeric(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[$€£¥₹,\s]/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalizes string keys and looks for matching column names
 */
function findColumn(columns: string[], pattern: RegExp): string | undefined {
  return columns.find((c) => pattern.test(c.toLowerCase().trim()));
}

/**
 * Executes complete, purely local and deterministic business diagnostic on dataset
 */
export function runBusinessDiagnostic(dataset: IngestedDataset | null | undefined): BusinessDiagnosticResult {
  if (!dataset || !dataset.records || dataset.records.length === 0) {
    return {
      hasProcessedData: false,
      recordsAnalyzed: 0,
      fieldsAnalyzed: 0,
      keyObservationsCount: 0,
      areasToReviewCount: 0,
      trendAnalysis: {
        isAvailable: false,
        reasonIfNotAvailable: 'Insufficient data for this analysis. No records found.',
        groupingType: 'Daily',
        dataPoints: [],
        totalRevenue: 0,
        totalUnits: 0,
        avgRevenuePerPeriod: 0,
        highestPeriod: null,
        lowestPeriod: null,
        trendDirection: 'stable',
        trendObservation: 'No data',
        trendInterpretation: 'No data',
      },
      productAnalysis: {
        isAvailable: false,
        reasonIfNotAvailable: 'Insufficient data for this analysis.',
        products: [],
        topPerformingByRevenue: [],
        lowestPerformingByRevenue: [],
        topPerformingByUnits: [],
        revenueConcentrationPct: 0,
        topProductName: '',
        observation: '',
        interpretation: '',
      },
      categoryAnalysis: {
        isAvailable: false,
        reasonIfNotAvailable: 'Insufficient data for this analysis.',
        categories: [],
        topCategory: null,
        observation: '',
        interpretation: '',
      },
      regionalAnalysis: {
        isAvailable: false,
        reasonIfNotAvailable: 'Regional analysis unavailable because no region/location field was detected.',
        regions: [],
        topRegion: null,
        observation: '',
        interpretation: '',
      },
      inventoryAnalysis: {
        isAvailable: false,
        reasonIfNotAvailable: 'Insufficient data for this analysis.',
        imbalances: [],
        totalInventoryOnHand: 0,
        observation: '',
        interpretation: '',
      },
      marginAnalysis: {
        isAvailable: false,
        reasonIfNotAvailable: 'Insufficient data for this analysis.',
        totalRevenue: 0,
        totalCost: 0,
        grossProfit: 0,
        overallGrossMarginPct: 0,
        observation: '',
        interpretation: '',
      },
      observedFindings: [],
      attentionAreas: [],
      alerts: [],
    };
  }

  const records = dataset.records;
  const columns = dataset.columns || Object.keys(records[0] || {});
  const recordsAnalyzed = records.length;
  const fieldsAnalyzed = columns.length;

  const observedFindings: DiagnosticFinding[] = [];
  const attentionAreas: DiagnosticFinding[] = [];
  const alerts: BusinessAlert[] = [];

  // Match columns
  const dateCol = findColumn(columns, /date|time|period|day|month/i);
  const productCol = findColumn(columns, /product|sku|item|article|style|merchandise/i);
  const categoryCol = findColumn(columns, /category|dept|department|segment|class|group|type/i);
  const unitsCol = findColumn(columns, /units?[_\s]?sold|qty|quantity|units?|volume|orders/i);
  const revenueCol = findColumn(columns, /revenue|turnover|sales|gmv|income|total[_\s]?amount|amount/i);
  const priceCol = findColumn(columns, /selling[_\s]?price|retail[_\s]?price|unit[_\s]?price|price/i);
  const costCol = findColumn(columns, /cost|cogs|expense|procurement|buying[_\s]?price/i);
  const regionCol = findColumn(columns, /region|location|city|country|territory|zone|market|state/i);
  const customerCol = findColumn(columns, /customer|client|buyer|account/i);
  const inventoryCol = findColumn(columns, /inventory|stock|warehouse|balance|on[_\s]?hand/i);

  // -------------------------------------------------------------
  // 1. REVENUE / SALES TREND ANALYSIS
  // -------------------------------------------------------------
  let trendAnalysisResult: BusinessDiagnosticResult['trendAnalysis'];

  if (dateCol && (revenueCol || unitsCol)) {
    // Group by date
    const dateMap = new Map<string, { revenue: number; units: number; count: number; rawDate: Date | null }>();

    records.forEach((row) => {
      const rawDateStr = String(row[dateCol] || '').trim();
      if (!rawDateStr) return;

      const rev = revenueCol ? cleanNumeric(row[revenueCol]) : 0;
      const unt = unitsCol ? cleanNumeric(row[unitsCol]) : 0;

      const parsed = new Date(rawDateStr);
      const isValidDate = !isNaN(parsed.getTime());

      // Use raw string or ISO date slice for stable grouping
      const dateKey = isValidDate ? parsed.toISOString().split('T')[0] : rawDateStr;

      const existing = dateMap.get(dateKey) || { revenue: 0, units: 0, count: 0, rawDate: isValidDate ? parsed : null };
      dateMap.set(dateKey, {
        revenue: existing.revenue + rev,
        units: existing.units + unt,
        count: existing.count + 1,
        rawDate: existing.rawDate,
      });
    });

    const sortedPeriods = Array.from(dateMap.entries()).sort((a, b) => {
      if (a[1].rawDate && b[1].rawDate) {
        return a[1].rawDate.getTime() - b[1].rawDate.getTime();
      }
      return a[0].localeCompare(b[0]);
    });

    const dataPoints: TrendDataPoint[] = sortedPeriods.map(([period, data]) => ({
      period,
      revenue: Math.round(data.revenue * 100) / 100,
      units: data.units,
      transactionCount: data.count,
    }));

    const totalRevenue = dataPoints.reduce((acc, p) => acc + p.revenue, 0);
    const totalUnits = dataPoints.reduce((acc, p) => acc + p.units, 0);
    const avgRevenuePerPeriod = dataPoints.length > 0 ? Math.round((totalRevenue / dataPoints.length) * 100) / 100 : 0;

    let highestPeriod: { period: string; revenue: number } | null = null;
    let lowestPeriod: { period: string; revenue: number } | null = null;

    if (dataPoints.length > 0) {
      const sortedByRev = [...dataPoints].sort((a, b) => b.revenue - a.revenue);
      highestPeriod = { period: sortedByRev[0].period, revenue: sortedByRev[0].revenue };
      lowestPeriod = { period: sortedByRev[sortedByRev.length - 1].period, revenue: sortedByRev[sortedByRev.length - 1].revenue };
    }

    // Determine grouping type
    let groupingType: 'Daily' | 'Weekly' | 'Monthly' = 'Daily';
    if (dataPoints.length > 45) groupingType = 'Weekly';
    if (dataPoints.length > 180) groupingType = 'Monthly';

    // Trend direction
    let trendDirection: 'increasing' | 'decreasing' | 'mixed' | 'stable' = 'stable';
    if (dataPoints.length >= 3) {
      const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
      const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));
      const firstAvg = firstHalf.reduce((s, d) => s + d.revenue, 0) / (firstHalf.length || 1);
      const secondAvg = secondHalf.reduce((s, d) => s + d.revenue, 0) / (secondHalf.length || 1);

      if (secondAvg > firstAvg * 1.1) trendDirection = 'increasing';
      else if (secondAvg < firstAvg * 0.9) trendDirection = 'decreasing';
      else trendDirection = 'mixed';
    }

    const obsText = `Across ${dataPoints.length} chronological periods (${dateCol}), total recorded revenue is $${totalRevenue.toLocaleString()} across ${totalUnits} units. Peak revenue occurred in ${highestPeriod?.period} ($${highestPeriod?.revenue.toLocaleString()}), and lowest period was ${lowestPeriod?.period} ($${lowestPeriod?.revenue.toLocaleString()}).`;
    const interpText = trendDirection === 'increasing'
      ? 'Revenue trend shows positive velocity in recent periods, which may reflect growing transaction volume or higher ticket sizes.'
      : trendDirection === 'decreasing'
      ? 'Revenue trajectory shows deceleration in subsequent periods, which may indicate seasonal slowdown, product stockouts, or shifting customer purchasing frequency.'
      : 'Revenue fluctuates across recorded intervals, indicating variance in periodic order pacing rather than a uniform monotonic trajectory.';

    trendAnalysisResult = {
      isAvailable: true,
      groupingType,
      dataPoints,
      totalRevenue,
      totalUnits,
      avgRevenuePerPeriod,
      highestPeriod,
      lowestPeriod,
      trendDirection,
      trendObservation: obsText,
      trendInterpretation: interpText,
    };

    observedFindings.push({
      id: 'obs_trend',
      topic: 'Revenue & Sales Velocity',
      observedData: obsText,
      possibleInterpretation: interpText,
      requiresAttention: trendDirection === 'decreasing',
      metricValue: `$${totalRevenue.toLocaleString()}`,
    });

    if (trendDirection === 'decreasing') {
      attentionAreas.push({
        id: 'att_trend_decline',
        topic: 'Revenue Deceleration',
        observedData: `Average periodic revenue decreased from the first half of recorded observations to the second half.`,
        possibleInterpretation: 'May indicate order attrition, seasonal channel shifts, or stockout bottlenecks.',
        requiresAttention: true,
        metricValue: '-10%+',
      });

      alerts.push({
        id: 'alert_trend_decline',
        type: 'warning',
        title: '⚠ Revenue declining across recent periods',
        evidence: `Revenue in the latter half of the chronological log averaged lower than early periods across ${dataPoints.length} observed periods.`,
        interpretation: 'Periodic revenue drop may indicate customer reorder cadence friction or supply-side fulfillment gaps.',
      });
    } else if (trendDirection === 'increasing') {
      alerts.push({
        id: 'alert_trend_growth',
        type: 'positive',
        title: '✓ Upward revenue trajectory observed',
        evidence: `Average periodic revenue trend expanded in recent dates, reaching peak of $${highestPeriod?.revenue.toLocaleString()} in ${highestPeriod?.period}.`,
        interpretation: 'Commercial velocity is accelerating across the observed timeframe.',
      });
    }
  } else {
    trendAnalysisResult = {
      isAvailable: false,
      reasonIfNotAvailable: 'Insufficient data for this analysis. Requires a valid date column and revenue/sales column.',
      groupingType: 'Daily',
      dataPoints: [],
      totalRevenue: 0,
      totalUnits: 0,
      avgRevenuePerPeriod: 0,
      highestPeriod: null,
      lowestPeriod: null,
      trendDirection: 'stable',
      trendObservation: 'Date or revenue fields missing.',
      trendInterpretation: 'Cannot compute time-series trajectory.',
    };
  }

  // -------------------------------------------------------------
  // 2. PRODUCT PERFORMANCE ANALYSIS
  // -------------------------------------------------------------
  let productAnalysisResult: BusinessDiagnosticResult['productAnalysis'];

  if (productCol && (revenueCol || unitsCol)) {
    const productMap = new Map<string, { revenue: number; units: number; prices: number[]; inv: number }>();

    records.forEach((row) => {
      const prodName = String(row[productCol] || 'Unlabeled Product').trim();
      const rev = revenueCol ? cleanNumeric(row[revenueCol]) : 0;
      const unt = unitsCol ? cleanNumeric(row[unitsCol]) : 0;
      const prc = priceCol ? cleanNumeric(row[priceCol]) : rev / (unt || 1);
      const inv = inventoryCol ? cleanNumeric(row[inventoryCol]) : 0;

      const cur = productMap.get(prodName) || { revenue: 0, units: 0, prices: [], inv: 0 };
      cur.revenue += rev;
      cur.units += unt;
      if (prc > 0) cur.prices.push(prc);
      cur.inv = Math.max(cur.inv, inv); // snapshot max inventory recorded
      productMap.set(prodName, cur);
    });

    const totalAllRevenue = Array.from(productMap.values()).reduce((sum, p) => sum + p.revenue, 0);

    const productList: ProductPerformanceData[] = Array.from(productMap.entries()).map(([product, data]) => {
      const avgPrice = data.prices.length > 0
        ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length
        : data.units > 0
        ? data.revenue / data.units
        : 0;

      const revenueSharePct = totalAllRevenue > 0 ? (data.revenue / totalAllRevenue) * 100 : 0;

      return {
        product,
        revenue: Math.round(data.revenue * 100) / 100,
        unitsSold: data.units,
        averagePrice: Math.round(avgPrice * 100) / 100,
        revenueSharePct: Math.round(revenueSharePct * 10) / 10,
        inventory: data.inv,
      };
    });

    // Sort by revenue
    const sortedByRevenue = [...productList].sort((a, b) => b.revenue - a.revenue);
    const sortedByUnits = [...productList].sort((a, b) => b.unitsSold - a.unitsSold);

    const topByRev = sortedByRevenue.slice(0, 3);
    const lowestByRev = [...sortedByRevenue].reverse().slice(0, 3);
    const topProductName = topByRev[0]?.product || 'Unknown';
    const topProductShare = topByRev[0]?.revenueSharePct || 0;

    const prodObs = `Identified ${productList.length} discrete products. The top-performing product by revenue is "${topProductName}" ($${topByRev[0]?.revenue.toLocaleString()}, ${topProductShare}% of total revenue). Lowest revenue contributor is "${lowestByRev[0]?.product}" ($${lowestByRev[0]?.revenue.toLocaleString()}).`;
    const prodInterp = topProductShare >= 30
      ? `A single product ("${topProductName}") accounts for ${topProductShare}% of recorded revenue. This concentration indicates high consumer affinity for this offering, but presents potential portfolio dependence.`
      : `Revenue is distributed across multiple product lines with "${topProductName}" leading at ${topProductShare}%.`;

    productAnalysisResult = {
      isAvailable: true,
      products: productList,
      topPerformingByRevenue: topByRev,
      lowestPerformingByRevenue: lowestByRev,
      topPerformingByUnits: sortedByUnits.slice(0, 3),
      revenueConcentrationPct: topProductShare,
      topProductName,
      observation: prodObs,
      interpretation: prodInterp,
    };

    observedFindings.push({
      id: 'obs_product_performance',
      topic: 'Product Portfolio Performance',
      observedData: prodObs,
      possibleInterpretation: prodInterp,
      requiresAttention: topProductShare >= 35,
      metricValue: `${topProductShare}% top SKU share`,
    });

    if (topProductShare >= 35) {
      attentionAreas.push({
        id: 'att_product_concentration',
        topic: 'Product Revenue Concentration',
        observedData: `Product "${topProductName}" delivers ${topProductShare}% of aggregate revenue.`,
        possibleInterpretation: 'May create vulnerability if raw materials for this style become constrained or consumer trends shift.',
        requiresAttention: true,
        metricValue: `${topProductShare}%`,
      });

      alerts.push({
        id: 'alert_product_concentration',
        type: 'warning',
        title: '⚠ Product concentration detected',
        evidence: `"${topProductName}" accounts for ${topProductShare}% of total revenue across all ${productList.length} products.`,
        interpretation: 'High SKU concentration may leave the business vulnerable to single-product supply disruptions or demand shifts.',
      });
    }
  } else {
    productAnalysisResult = {
      isAvailable: false,
      reasonIfNotAvailable: 'Insufficient data for this analysis. Requires a product identifier field and sales/revenue metrics.',
      products: [],
      topPerformingByRevenue: [],
      lowestPerformingByRevenue: [],
      topPerformingByUnits: [],
      revenueConcentrationPct: 0,
      topProductName: '',
      observation: '',
      interpretation: '',
    };
  }

  // -------------------------------------------------------------
  // 3. CATEGORY ANALYSIS
  // -------------------------------------------------------------
  let categoryAnalysisResult: BusinessDiagnosticResult['categoryAnalysis'];

  if (categoryCol && (revenueCol || unitsCol)) {
    const catMap = new Map<string, { revenue: number; units: number; count: number }>();

    records.forEach((row) => {
      const catName = String(row[categoryCol] || 'Uncategorized').trim();
      const rev = revenueCol ? cleanNumeric(row[revenueCol]) : 0;
      const unt = unitsCol ? cleanNumeric(row[unitsCol]) : 0;

      const cur = catMap.get(catName) || { revenue: 0, units: 0, count: 0 };
      cur.revenue += rev;
      cur.units += unt;
      cur.count += 1;
      catMap.set(catName, cur);
    });

    const totalCatRevenue = Array.from(catMap.values()).reduce((sum, c) => sum + c.revenue, 0);

    const categories: CategoryData[] = Array.from(catMap.entries()).map(([category, data]) => {
      const share = totalCatRevenue > 0 ? (data.revenue / totalCatRevenue) * 100 : 0;
      return {
        category,
        revenue: Math.round(data.revenue * 100) / 100,
        unitsSold: data.units,
        transactionCount: data.count,
        revenueSharePct: Math.round(share * 10) / 10,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const topCat = categories[0] || null;
    const catObs = `Categorized records into ${categories.length} segments. "${topCat?.category}" generates the highest revenue at $${topCat?.revenue.toLocaleString()} (${topCat?.revenueSharePct}% share) across ${topCat?.unitsSold} units.`;
    const catInterp = `Category distribution reveals that "${topCat?.category}" is the primary commercial pillar, followed by secondary segments.`;

    categoryAnalysisResult = {
      isAvailable: true,
      categories,
      topCategory: topCat,
      observation: catObs,
      interpretation: catInterp,
    };

    observedFindings.push({
      id: 'obs_category',
      topic: 'Category Commercial Weight',
      observedData: catObs,
      possibleInterpretation: catInterp,
      requiresAttention: false,
      metricValue: `${topCat?.revenueSharePct}% top category`,
    });
  } else {
    categoryAnalysisResult = {
      isAvailable: false,
      reasonIfNotAvailable: 'Insufficient data for this analysis. No category field was detected.',
      categories: [],
      topCategory: null,
      observation: '',
      interpretation: '',
    };
  }

  // -------------------------------------------------------------
  // 4. REGIONAL ANALYSIS
  // -------------------------------------------------------------
  let regionalAnalysisResult: BusinessDiagnosticResult['regionalAnalysis'];

  if (regionCol && (revenueCol || unitsCol)) {
    const regMap = new Map<string, { revenue: number; units: number; count: number }>();

    records.forEach((row) => {
      const regName = String(row[regionCol] || 'Unassigned Region').trim();
      const rev = revenueCol ? cleanNumeric(row[revenueCol]) : 0;
      const unt = unitsCol ? cleanNumeric(row[unitsCol]) : 0;

      const cur = regMap.get(regName) || { revenue: 0, units: 0, count: 0 };
      cur.revenue += rev;
      cur.units += unt;
      cur.count += 1;
      regMap.set(regName, cur);
    });

    const totalRegRevenue = Array.from(regMap.values()).reduce((sum, r) => sum + r.revenue, 0);

    const regions: RegionalData[] = Array.from(regMap.entries()).map(([region, data]) => {
      const share = totalRegRevenue > 0 ? (data.revenue / totalRegRevenue) * 100 : 0;
      return {
        region,
        revenue: Math.round(data.revenue * 100) / 100,
        unitsSold: data.units,
        transactionCount: data.count,
        revenueSharePct: Math.round(share * 10) / 10,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const topReg = regions[0] || null;
    const regObs = `Regional breakdown spans ${regions.length} distinct territories. "${topReg?.region}" generated $${topReg?.revenue.toLocaleString()} (${topReg?.revenueSharePct}% of regional volume).`;
    const regInterp = `Market demand demonstrates geographic concentration in "${topReg?.region}", which may correlate with local retail visibility or distribution efficiency.`;

    regionalAnalysisResult = {
      isAvailable: true,
      regions,
      topRegion: topReg,
      observation: regObs,
      interpretation: regInterp,
    };

    observedFindings.push({
      id: 'obs_regional',
      topic: 'Geographic Distribution',
      observedData: regObs,
      possibleInterpretation: regInterp,
      requiresAttention: false,
      metricValue: `${topReg?.region} (${topReg?.revenueSharePct}%)`,
    });
  } else {
    regionalAnalysisResult = {
      isAvailable: false,
      reasonIfNotAvailable: 'Regional analysis unavailable because no region/location field was detected.',
      regions: [],
      topRegion: null,
      observation: 'No region/location field detected.',
      interpretation: 'Geographic segmentation cannot be performed without location headers.',
    };
  }

  // -------------------------------------------------------------
  // 5. INVENTORY ANALYSIS
  // -------------------------------------------------------------
  let inventoryAnalysisResult: BusinessDiagnosticResult['inventoryAnalysis'];

  if (inventoryCol && (productCol || unitsCol)) {
    const productStats = new Map<string, { inv: number; units: number }>();

    records.forEach((row) => {
      const prod = String(row[productCol || ''] || 'General Stock').trim();
      const inv = cleanNumeric(row[inventoryCol]);
      const unt = unitsCol ? cleanNumeric(row[unitsCol]) : 0;

      const cur = productStats.get(prod) || { inv: 0, units: 0 };
      // Latest or highest inventory recorded
      cur.inv = Math.max(cur.inv, inv);
      cur.units += unt;
      productStats.set(prod, cur);
    });

    const entries = Array.from(productStats.entries());
    const totalInventoryOnHand = entries.reduce((s, [, d]) => s + d.inv, 0);
    const avgInventory = entries.length > 0 ? totalInventoryOnHand / entries.length : 0;
    const totalUnitsSold = entries.reduce((s, [, d]) => s + d.units, 0);
    const avgUnitsSold = entries.length > 0 ? totalUnitsSold / entries.length : 0;

    const imbalances: InventoryImbalanceAlert[] = [];

    entries.forEach(([prod, data]) => {
      // High inventory with low sales
      if (data.inv > avgInventory * 1.3 && data.units < avgUnitsSold * 0.6) {
        imbalances.push({
          product: prod,
          inventory: data.inv,
          unitsSold: data.units,
          type: 'high_inventory_low_sales',
          observation: `"${prod}" holds ${data.inv} units in stock while generating only ${data.units} units in sales.`,
          interpretation: 'Potential inventory imbalance detected: elevated holding stock against lower recorded sales velocity.',
        });
      }
      // Low inventory with high sales (potential stockout risk)
      else if (data.inv < avgInventory * 0.7 && data.units > avgUnitsSold * 1.4) {
        imbalances.push({
          product: prod,
          inventory: data.inv,
          unitsSold: data.units,
          type: 'low_inventory_high_sales',
          observation: `"${prod}" has only ${data.inv} units remaining in inventory despite high sales volume (${data.units} units sold).`,
          interpretation: 'Potential inventory imbalance detected: high sales velocity with thin stock buffer creates stockout vulnerability.',
        });
      }
    });

    const invObs = `Across ${entries.length} tracked items, total recorded stock on hand is ${totalInventoryOnHand} units. Detected ${imbalances.length} potential stock balance anomalies.`;
    const invInterp = imbalances.length > 0
      ? `Inventory allocation varies noticeably from observed sales velocity across ${imbalances.length} items.`
      : 'Stock quantities generally mirror recorded transaction pacing across tracked products.';

    inventoryAnalysisResult = {
      isAvailable: true,
      imbalances,
      totalInventoryOnHand,
      observation: invObs,
      interpretation: invInterp,
    };

    observedFindings.push({
      id: 'obs_inventory',
      topic: 'Inventory & Stock Buffer Alignment',
      observedData: invObs,
      possibleInterpretation: invInterp,
      requiresAttention: imbalances.length > 0,
      metricValue: `${totalInventoryOnHand} units in stock`,
    });

    if (imbalances.length > 0) {
      imbalances.forEach((imb, idx) => {
        attentionAreas.push({
          id: `att_inventory_${idx}`,
          topic: `Inventory Imbalance: ${imb.product}`,
          observedData: imb.observation,
          possibleInterpretation: imb.interpretation,
          requiresAttention: true,
          metricValue: `${imb.inventory} stock vs ${imb.unitsSold} sold`,
        });
      });

      alerts.push({
        id: 'alert_inventory_imbalance',
        type: 'warning',
        title: '⚠ Potential inventory imbalance detected',
        evidence: `${imbalances.length} product(s) demonstrate substantial variance between stock levels and sales volume (e.g., "${imbalances[0]?.product}").`,
        interpretation: 'Mismatched inventory allocations may tie up working capital in slow movers while risking stockouts on popular lines.',
      });
    }
  } else {
    inventoryAnalysisResult = {
      isAvailable: false,
      reasonIfNotAvailable: 'Insufficient data for this analysis. No inventory column was detected in the dataset.',
      imbalances: [],
      totalInventoryOnHand: 0,
      observation: '',
      interpretation: '',
    };
  }

  // -------------------------------------------------------------
  // 6. COST & MARGIN PATTERNS
  // -------------------------------------------------------------
  let marginAnalysisResult: BusinessDiagnosticResult['marginAnalysis'];

  if (revenueCol && costCol) {
    let sumRev = 0;
    let sumCost = 0;

    records.forEach((row) => {
      sumRev += cleanNumeric(row[revenueCol]);
      sumCost += cleanNumeric(row[costCol]);
    });

    const grossProfit = sumRev - sumCost;
    const marginPct = sumRev > 0 ? (grossProfit / sumRev) * 100 : 0;

    const marginObs = `Total calculated revenue is $${Math.round(sumRev).toLocaleString()} against recorded direct costs of $${Math.round(sumCost).toLocaleString()}, yielding gross profit of $${Math.round(grossProfit).toLocaleString()} (${marginPct.toFixed(1)}% gross margin).`;
    const marginInterp = marginPct >= 40
      ? `Gross margin of ${marginPct.toFixed(1)}% reflects healthy contribution margin above direct production/procurement expenses.`
      : `Gross margin of ${marginPct.toFixed(1)}% indicates tight direct cost absorption; operational overhead must be managed carefully.`;

    marginAnalysisResult = {
      isAvailable: true,
      totalRevenue: Math.round(sumRev * 100) / 100,
      totalCost: Math.round(sumCost * 100) / 100,
      grossProfit: Math.round(grossProfit * 100) / 100,
      overallGrossMarginPct: Math.round(marginPct * 10) / 10,
      observation: marginObs,
      interpretation: marginInterp,
    };

    observedFindings.push({
      id: 'obs_margin',
      topic: 'Gross Contribution Margin',
      observedData: marginObs,
      possibleInterpretation: marginInterp,
      requiresAttention: marginPct < 30,
      metricValue: `${marginPct.toFixed(1)}% GM`,
    });

    if (marginPct < 25) {
      attentionAreas.push({
        id: 'att_margin_compression',
        topic: 'Gross Margin Compression',
        observedData: `Gross profit realization is ${marginPct.toFixed(1)}% ($${Math.round(grossProfit).toLocaleString()} on $${Math.round(sumRev).toLocaleString()}).`,
        possibleInterpretation: 'Direct costs absorb the majority of top-line revenue, leaving limited buffer for marketing, fulfillment, and fixed costs.',
        requiresAttention: true,
        metricValue: `${marginPct.toFixed(1)}%`,
      });

      alerts.push({
        id: 'alert_low_margin',
        type: 'warning',
        title: '⚠ Narrow gross contribution margin',
        evidence: `Direct costs account for ${(100 - marginPct).toFixed(1)}% of total revenue ($${Math.round(sumCost).toLocaleString()} vs $${Math.round(sumRev).toLocaleString()}).`,
        interpretation: 'Tight cost coverage leaves the business sensitive to slight increases in wholesale prices or shipping fees.',
      });
    }
  } else {
    marginAnalysisResult = {
      isAvailable: false,
      reasonIfNotAvailable: 'Insufficient data for this analysis. Requires both revenue and cost columns to calculate margin.',
      totalRevenue: 0,
      totalCost: 0,
      grossProfit: 0,
      overallGrossMarginPct: 0,
      observation: '',
      interpretation: '',
    };
  }

  // -------------------------------------------------------------
  // 7. DEMAND VARIATION & STABLE CHECKS
  // -------------------------------------------------------------
  if (unitsCol) {
    const unitValues = records.map((r) => cleanNumeric(r[unitsCol])).filter((n) => n > 0);
    if (unitValues.length >= 4) {
      const minUnits = Math.min(...unitValues);
      const maxUnits = Math.max(...unitValues);
      const avgUnits = unitValues.reduce((a, b) => a + b, 0) / unitValues.length;

      if (maxUnits > avgUnits * 2.5 && maxUnits - minUnits > 15) {
        alerts.push({
          id: 'alert_demand_variation',
          type: 'neutral',
          title: '⚠ Large variation in demand per transaction',
          evidence: `Individual order volumes range from ${minUnits} to ${maxUnits} units (mean: ${avgUnits.toFixed(1)} units).`,
          interpretation: 'Significant order size dispersion suggests a mix of small retail buyers and larger batch/wholesale purchasers.',
        });
      }
    }
  }

  // Fallback alert if everything is stable
  if (alerts.length === 0 && observedFindings.length > 0) {
    alerts.push({
      id: 'alert_stable_performance',
      type: 'positive',
      title: '✓ Stable performance detected',
      evidence: `Calculated metrics across ${recordsAnalyzed} records demonstrate consistent transaction sizing and balanced product distribution.`,
      interpretation: 'No critical single-product dependencies or acute inventory imbalances observed in this dataset.',
    });
  }

  const keyObservationsCount = observedFindings.length;
  const areasToReviewCount = attentionAreas.length;

  return {
    hasProcessedData: true,
    recordsAnalyzed,
    fieldsAnalyzed,
    keyObservationsCount,
    areasToReviewCount,
    trendAnalysis: trendAnalysisResult,
    productAnalysis: productAnalysisResult,
    categoryAnalysis: categoryAnalysisResult,
    regionalAnalysis: regionalAnalysisResult,
    inventoryAnalysis: inventoryAnalysisResult,
    marginAnalysis: marginAnalysisResult,
    observedFindings,
    attentionAreas,
    alerts,
  };
}
