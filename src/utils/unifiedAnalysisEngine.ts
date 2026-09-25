import {
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
  UnifiedKeyMetrics,
  DataSufficiencyReport,
  TimeAnalysisResult,
  ProductAnalysisResult,
  InventoryAnalysisResult,
  CustomerAnalysisResult,
  ExpenseAnalysisResult,
  ObservedFindingItem,
  DataBasedInterpretationItem,
  AreaToReviewItem,
  BusinessAnalysisSummary,
  ProductRankingItem,
  TimeTrendDataPoint,
} from '../types/bi';
import { formatCurrencyAmount } from './currency';

/**
 * Currency and number formatting helpers
 */
function formatCurrency(val: number | null): string {
  return formatCurrencyAmount(val);
}

function formatInteger(val: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return 'Insufficient data';
  return val.toLocaleString();
}

function formatPct(val: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return 'Insufficient data';
  return `${val.toFixed(1)}%`;
}

/**
 * Unified Business Analysis Engine
 * Purely deterministic, mathematically grounded, with zero fabrication or AI hallucinations.
 */
export function runUnifiedBusinessAnalysis(
  dataLayer: UnifiedBusinessDataLayer
): UnifiedBusinessAnalysisReport {
  const { transactions, products, expenses, customers, orders, availableDateRange, dataSourceSummary } =
    dataLayer;

  // =========================================================================
  // 1. DATA SUFFICIENCY ASSESSMENT
  // =========================================================================
  const reasons: string[] = [];
  const supportedAnalyses: string[] = [];
  const unsupportedAnalyses: { name: string; missingRequirement: string }[] = [];

  const hasTransactions = transactions.length > 0;
  const hasProducts = products.length > 0;
  const hasExpenses = expenses.length > 0;
  const hasCustomers = customers.length > 0 || transactions.some((t) => !!t.customer);
  const hasOrders = orders.length > 0;

  // Revenue sufficiency
  const transactionsWithRevenue = transactions.filter((t) => t.revenue !== null && t.revenue > 0);
  const hasRevenueData = transactionsWithRevenue.length > 0;

  // Cost sufficiency
  const transactionsWithCost = transactions.filter((t) => t.cost !== null && t.cost >= 0);
  const hasCostData = transactionsWithCost.length > 0;

  // Date sufficiency
  const transactionsWithDate = transactions.filter((t) => !!t.date && !isNaN(Date.parse(t.date)));
  const hasDateData = transactionsWithDate.length >= 2;

  // Inventory sufficiency
  const productsWithStock = products.filter((p) => p.currentStock !== null && p.currentStock >= 0);
  const hasStockData = productsWithStock.length > 0;

  if (hasRevenueData) {
    supportedAnalyses.push('Revenue & Sales Volume Diagnostics');
    reasons.push(`Detected ${transactionsWithRevenue.length} transactions with verified revenue values.`);
  } else {
    unsupportedAnalyses.push({
      name: 'Sales & Revenue Analysis',
      missingRequirement: 'Requires transaction records with recorded selling amounts or units sold & price.',
    });
  }

  if (hasDateData) {
    supportedAnalyses.push('Time-Series Trend Grouping');
    reasons.push(
      `Detected valid timestamp coverage across ${availableDateRange.totalDays} recorded day(s) (${availableDateRange.startDate} to ${availableDateRange.endDate}).`
    );
  } else {
    unsupportedAnalyses.push({
      name: 'Time-Series Trend Analysis',
      missingRequirement: 'Requires transaction dates across multiple time points to calculate period groupings.',
    });
  }

  if (hasCostData) {
    supportedAnalyses.push('Potential Gross Margin Assessment');
    reasons.push(`Detected verifiable cost of goods data on ${transactionsWithCost.length} transaction entries.`);
  } else {
    unsupportedAnalyses.push({
      name: 'Gross Margin Analysis',
      missingRequirement: 'Requires product cost price (COGS) to calculate margin without inventing estimates.',
    });
  }

  if (hasExpenses) {
    supportedAnalyses.push('Operating Expense Breakdown');
    reasons.push(`Detected ${expenses.length} operating expense record(s) across distinct commercial categories.`);
  } else {
    unsupportedAnalyses.push({
      name: 'Operating Expense Analysis',
      missingRequirement: 'Requires recorded operational expenses (utilities, rent, salaries, transport, etc.).',
    });
  }

  if (hasStockData) {
    supportedAnalyses.push('Inventory Buffer & Stock Health');
    reasons.push(`Detected inventory stock levels on ${productsWithStock.length} catalog items.`);
  } else {
    unsupportedAnalyses.push({
      name: 'Inventory Health Analysis',
      missingRequirement: 'Requires on-hand stock counts and safety buffer thresholds.',
    });
  }

  if (hasStockData && hasRevenueData) {
    supportedAnalyses.push('Cross-Inventory & Sales Imbalance Detection');
    reasons.push('Both sales turnover and stock counts are available for supply-demand imbalance checks.');
  }

  // Determine overall sufficiency state
  let sufficiencyState: 'Ready' | 'Partially Ready' | 'Insufficient Data' = 'Insufficient Data';
  let sufficiencySummary = 'No usable commercial data detected.';

  if (supportedAnalyses.length >= 4) {
    sufficiencyState = 'Ready';
    sufficiencySummary = 'Robust commercial data detected. Multi-dimensional diagnostic modules fully supported.';
  } else if (supportedAnalyses.length >= 1) {
    sufficiencyState = 'Partially Ready';
    sufficiencySummary =
      'Basic metrics available, but key fields (such as cost or date) are absent. Analysis is constrained to supported fields.';
  } else {
    sufficiencyState = 'Insufficient Data';
    sufficiencySummary =
      'Insufficient records to construct meaningful commercial analytics. Add manual records or ingest a dataset.';
  }

  const sufficiency: DataSufficiencyReport = {
    state: sufficiencyState,
    summary: sufficiencySummary,
    reasons,
    supportedAnalyses,
    unsupportedAnalyses,
  };

  // =========================================================================
  // 2. KEY METRICS CALCULATION
  // =========================================================================
  const totalRev = hasRevenueData
    ? Number(transactionsWithRevenue.reduce((acc, t) => acc + (t.revenue || 0), 0).toFixed(2))
    : null;

  const totalSalesTx = hasTransactions ? transactions.length : null;

  const unitsSoldList = transactions.filter((t) => t.unitsSold !== null && t.unitsSold > 0);
  const totalUnits =
    unitsSoldList.length > 0
      ? unitsSoldList.reduce((acc, t) => acc + (t.unitsSold || 0), 0)
      : null;

  const avgOrderVal =
    totalRev !== null && totalSalesTx !== null && totalSalesTx > 0
      ? Number((totalRev / totalSalesTx).toFixed(2))
      : null;

  const avgSellingPrice =
    totalRev !== null && totalUnits !== null && totalUnits > 0
      ? Number((totalRev / totalUnits).toFixed(2))
      : null;

  const totalCosts = hasCostData
    ? Number(transactionsWithCost.reduce((acc, t) => acc + (t.cost || 0), 0).toFixed(2))
    : null;

  const totalExp = hasExpenses
    ? Number(expenses.reduce((acc, e) => acc + (e.amount || 0), 0).toFixed(2))
    : null;

  // Potential Gross Margin (NEVER call profit without full cost verification)
  let potentialGrossMarginVal: number | null = null;
  let potentialGrossMarginPct: number | null = null;
  if (totalRev !== null && totalCosts !== null && totalRev > 0) {
    potentialGrossMarginVal = Number((totalRev - totalCosts).toFixed(2));
    potentialGrossMarginPct = Number(((potentialGrossMarginVal / totalRev) * 100).toFixed(1));
  }

  // Revenue vs Expense Difference
  let revExpDiff: number | null = null;
  if (totalRev !== null && totalExp !== null) {
    revExpDiff = Number((totalRev - totalExp).toFixed(2));
  }

  // Inventory Metrics
  const totalStockUnits = hasStockData
    ? productsWithStock.reduce((acc, p) => acc + (p.currentStock || 0), 0)
    : null;

  const lowStockItems = products.filter(
    (p) =>
      p.currentStock !== null &&
      p.minStockLevel !== null &&
      p.currentStock > 0 &&
      p.currentStock <= p.minStockLevel
  );
  const lowStockCount = hasStockData ? lowStockItems.length : null;

  const outOfStockItems = products.filter(
    (p) => p.currentStock !== null && p.currentStock <= 0
  );
  const outOfStockCount = hasStockData ? outOfStockItems.length : null;

  // Customer Count
  const distinctCustSet = new Set<string>();
  customers.forEach((c) => distinctCustSet.add(c.name.toLowerCase().trim()));
  transactions.forEach((t) => {
    if (t.customer) distinctCustSet.add(t.customer.toLowerCase().trim());
  });
  const customerCount = distinctCustSet.size > 0 ? distinctCustSet.size : null;

  // Order Count
  const orderCount = hasOrders ? orders.length : null;

  // Product Count
  const productCount = hasProducts ? products.length : null;

  const keyMetrics: UnifiedKeyMetrics = {
    revenue: {
      value: totalRev,
      formatted: formatCurrency(totalRev),
      isSupported: totalRev !== null,
      insufficientReason: totalRev === null ? 'Insufficient data: No revenue figures detected' : undefined,
      evidence: totalRev !== null ? `Calculated from ${transactionsWithRevenue.length} records.` : undefined,
    },
    salesTransactionCount: {
      value: totalSalesTx,
      formatted: formatInteger(totalSalesTx),
      isSupported: totalSalesTx !== null,
      insufficientReason: totalSalesTx === null ? 'Insufficient data: No transaction entries' : undefined,
    },
    unitsSold: {
      value: totalUnits,
      formatted: formatInteger(totalUnits),
      isSupported: totalUnits !== null,
      insufficientReason: totalUnits === null ? 'Insufficient data: Units sold field missing' : undefined,
    },
    averageOrderValue: {
      value: avgOrderVal,
      formatted: formatCurrency(avgOrderVal),
      isSupported: avgOrderVal !== null,
      insufficientReason: avgOrderVal === null ? 'Insufficient data: Needs both revenue and order count' : undefined,
    },
    averageSellingPrice: {
      value: avgSellingPrice,
      formatted: formatCurrency(avgSellingPrice),
      isSupported: avgSellingPrice !== null,
      insufficientReason: avgSellingPrice === null ? 'Insufficient data: Needs revenue and units sold' : undefined,
    },
    totalCosts: {
      value: totalCosts,
      formatted: formatCurrency(totalCosts),
      isSupported: totalCosts !== null,
      insufficientReason: totalCosts === null ? 'Insufficient data: Cost/COGS data not available' : undefined,
      evidence: totalCosts !== null ? `Total recorded COGS across ${transactionsWithCost.length} sales.` : undefined,
    },
    totalExpenses: {
      value: totalExp,
      formatted: formatCurrency(totalExp),
      isSupported: totalExp !== null,
      insufficientReason: totalExp === null ? 'Insufficient data: Operating expenses not recorded' : undefined,
      evidence: totalExp !== null ? `Sum of ${expenses.length} operating expense entries.` : undefined,
    },
    potentialGrossMargin: {
      value: potentialGrossMarginVal,
      marginPct: potentialGrossMarginPct,
      formatted:
        potentialGrossMarginVal !== null
          ? `${formatCurrency(potentialGrossMarginVal)} (${potentialGrossMarginPct}%)`
          : 'Insufficient data',
      isSupported: potentialGrossMarginVal !== null,
      insufficientReason:
        potentialGrossMarginVal === null
          ? 'Insufficient data: Cost of goods sold (COGS) required to calculate margin without estimation'
          : undefined,
      evidence:
        potentialGrossMarginVal !== null
          ? `Calculated as Revenue (${formatCurrency(totalRev)}) minus Cost of Goods (${formatCurrency(totalCosts)}). Not labeled as net profit.`
          : undefined,
    },
    revenueExpenseDifference: {
      value: revExpDiff,
      formatted: formatCurrency(revExpDiff),
      isSupported: revExpDiff !== null,
      insufficientReason:
        revExpDiff === null
          ? 'Insufficient data: Requires both recorded revenue and operational expense figures'
          : undefined,
      note: 'Difference between recorded revenue and recorded expenses. Not labeled as net profit because unrecorded overhead, taxation, or COGS may exist.',
      evidence:
        revExpDiff !== null
          ? `Recorded Revenue (${formatCurrency(totalRev)}) minus Recorded Expenses (${formatCurrency(totalExp)}).`
          : undefined,
    },
    inventoryLevels: {
      value: totalStockUnits,
      formatted: formatInteger(totalStockUnits),
      isSupported: totalStockUnits !== null,
      insufficientReason: totalStockUnits === null ? 'Insufficient data: On-hand stock not tracked' : undefined,
    },
    lowStockItemsCount: {
      value: lowStockCount,
      formatted: formatInteger(lowStockCount),
      isSupported: lowStockCount !== null,
      insufficientReason: lowStockCount === null ? 'Insufficient data: Buffer thresholds missing' : undefined,
    },
    outOfStockItemsCount: {
      value: outOfStockCount,
      formatted: formatInteger(outOfStockCount),
      isSupported: outOfStockCount !== null,
      insufficientReason: outOfStockCount === null ? 'Insufficient data: Stock count missing' : undefined,
    },
    customerCount: {
      value: customerCount,
      formatted: formatInteger(customerCount),
      isSupported: customerCount !== null,
      insufficientReason: customerCount === null ? 'Insufficient data: No client/customer records' : undefined,
    },
    orderCount: {
      value: orderCount,
      formatted: formatInteger(orderCount),
      isSupported: orderCount !== null,
      insufficientReason: orderCount === null ? 'Insufficient data: No order management records' : undefined,
    },
    productCount: {
      value: productCount,
      formatted: formatInteger(productCount),
      isSupported: productCount !== null,
      insufficientReason: productCount === null ? 'Insufficient data: Product catalog empty' : undefined,
    },
  };

  // =========================================================================
  // 3. TIME ANALYSIS
  // =========================================================================
  let timeAnalysis: TimeAnalysisResult = {
    isAvailable: false,
    reasonIfNotAvailable: 'Insufficient date information to establish temporal sequence.',
    startDate: null,
    endDate: null,
    periodCount: 0,
    grouping: 'Daily',
    trendDirection: 'stable',
    dataPoints: [],
    observation: 'No temporal data available.',
    interpretation: 'A temporal sequence cannot be determined without valid date fields.',
    evidence: '0 dated records identified.',
  };

  if (hasDateData) {
    const daysRange = availableDateRange.totalDays;
    let grouping: 'Daily' | 'Weekly' | 'Monthly' = 'Daily';
    if (daysRange > 90) {
      grouping = 'Monthly';
    } else if (daysRange > 14) {
      grouping = 'Weekly';
    }

    // Bucket by grouping
    const bucketsMap = new Map<string, { revenue: number; units: number; count: number }>();

    transactionsWithDate.forEach((t) => {
      const d = new Date(t.date!);
      let key = t.date!;
      if (grouping === 'Monthly') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else if (grouping === 'Weekly') {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `W${weekNum} ${d.getFullYear()}`;
      }

      const existing = bucketsMap.get(key) || { revenue: 0, units: 0, count: 0 };
      existing.revenue += t.revenue || 0;
      existing.units += t.unitsSold || 0;
      existing.count += 1;
      bucketsMap.set(key, existing);
    });

    const dataPoints: TimeTrendDataPoint[] = Array.from(bucketsMap.entries()).map(([period, b]) => ({
      period,
      revenue: Number(b.revenue.toFixed(2)),
      units: b.units,
      transactionCount: b.count,
    }));

    // Sort chronologically if possible
    dataPoints.sort((a, b) => a.period.localeCompare(b.period));

    // Direction calculation
    let trendDirection: 'increasing' | 'decreasing' | 'stable' | 'high_variation' = 'stable';
    if (dataPoints.length >= 3) {
      const half = Math.floor(dataPoints.length / 2);
      const firstHalfRev = dataPoints.slice(0, half).reduce((acc, p) => acc + p.revenue, 0) / half;
      const secondHalfRev =
        dataPoints.slice(half).reduce((acc, p) => acc + p.revenue, 0) / (dataPoints.length - half);

      const varianceRatio = Math.abs(secondHalfRev - firstHalfRev) / Math.max(1, firstHalfRev);
      if (varianceRatio > 0.35) {
        trendDirection = 'high_variation';
      } else if (secondHalfRev > firstHalfRev * 1.1) {
        trendDirection = 'increasing';
      } else if (secondHalfRev < firstHalfRev * 0.9) {
        trendDirection = 'decreasing';
      } else {
        trendDirection = 'stable';
      }
    }

    const directionLabels = {
      increasing: 'Consistent upward trajectory in recorded revenue periods.',
      decreasing: 'Noticeable contraction in subsequent recorded periods.',
      stable: 'Relatively stable revenue distribution across periods.',
      high_variation: 'Pronounced volatility between recorded operational periods.',
    };

    timeAnalysis = {
      isAvailable: true,
      startDate: availableDateRange.startDate,
      endDate: availableDateRange.endDate,
      periodCount: dataPoints.length,
      grouping,
      trendDirection,
      dataPoints,
      observation: `Spans ${availableDateRange.startDate} through ${availableDateRange.endDate} across ${dataPoints.length} ${grouping.toLowerCase()} periods.`,
      interpretation: directionLabels[trendDirection],
      evidence: `Earliest date: ${availableDateRange.startDate}, latest date: ${availableDateRange.endDate}. Grouping: ${grouping}.`,
    };
  }

  // =========================================================================
  // 4. SALES ANALYSIS
  // =========================================================================
  const salesPatterns: { title: string; evidence: string; interpretation: string }[] = [];

  // Regional breakdown
  const regionalMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.region && t.revenue) {
      regionalMap.set(t.region, (regionalMap.get(t.region) || 0) + t.revenue);
    }
  });

  const byRegion =
    regionalMap.size > 0 && totalRev
      ? Array.from(regionalMap.entries())
          .map(([region, rev]) => ({
            region,
            revenue: Number(rev.toFixed(2)),
            sharePct: Number(((rev / totalRev) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.revenue - a.revenue)
      : null;

  // Customer Type breakdown
  const custTypeMap = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.customerType && t.revenue) {
      custTypeMap.set(t.customerType, (custTypeMap.get(t.customerType) || 0) + t.revenue);
    }
  });

  const byCustomerType =
    custTypeMap.size > 0 && totalRev
      ? Array.from(custTypeMap.entries())
          .map(([customerType, rev]) => ({
            customerType,
            revenue: Number(rev.toFixed(2)),
            sharePct: Number(((rev / totalRev) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.revenue - a.revenue)
      : null;

  // Patterns detection
  if (timeAnalysis.isAvailable) {
    if (timeAnalysis.trendDirection === 'increasing') {
      salesPatterns.push({
        title: 'Increasing sales momentum observed',
        evidence: `Later periods outpaced initial periods by over 10% across ${timeAnalysis.periodCount} recorded ${timeAnalysis.grouping.toLowerCase()} periods.`,
        interpretation: 'Demand is expanding across the recorded observation window.',
      });
    } else if (timeAnalysis.trendDirection === 'decreasing') {
      salesPatterns.push({
        title: 'Decreasing revenue trend detected',
        evidence: `Later periods trailed initial periods by over 10% within the recorded ledger.`,
        interpretation: 'Sales intake slowed in later periods; review channel conditions.',
      });
    } else if (timeAnalysis.trendDirection === 'high_variation') {
      salesPatterns.push({
        title: 'High revenue variation between periods',
        evidence: `Variance ratio exceeds 35% between initial and terminal intervals.`,
        interpretation: 'Lumpy or cyclical order cadence indicates seasonal or intermittent commercial events.',
      });
    }
  }

  // =========================================================================
  // 5. PRODUCT ANALYSIS (Neutral terminology)
  // =========================================================================
  const productAggregateMap = new Map<
    string,
    { category: string; revenue: number; units: number; avgPrice: number }
  >();

  transactions.forEach((t) => {
    const pName = t.product;
    const existing = productAggregateMap.get(pName) || {
      category: t.category || 'General',
      revenue: 0,
      units: 0,
      avgPrice: t.unitPrice || 0,
    };
    existing.revenue += t.revenue || 0;
    existing.units += t.unitsSold || 0;
    if (t.category && existing.category === 'General') {
      existing.category = t.category;
    }
    productAggregateMap.set(pName, existing);
  });

  const productRankingList: ProductRankingItem[] = Array.from(productAggregateMap.entries()).map(
    ([pName, meta]) => {
      const rev = Number(meta.revenue.toFixed(2));
      const share = totalRev && totalRev > 0 ? Number(((rev / totalRev) * 100).toFixed(1)) : 0;
      const unitShare = totalUnits && totalUnits > 0 ? Number(((meta.units / totalUnits) * 100).toFixed(1)) : 0;
      const avgPrice = meta.units > 0 ? Number((rev / meta.units).toFixed(2)) : meta.avgPrice;
      return {
        product: pName,
        category: meta.category,
        revenue: rev,
        unitsSold: meta.units,
        revenueSharePct: share,
        unitSharePct: unitShare,
        averagePrice: avgPrice,
      };
    }
  );

  const topByRevenue = [...productRankingList].sort((a, b) => b.revenue - a.revenue);
  const topByUnits = [...productRankingList].sort((a, b) => b.unitsSold - a.unitsSold);
  const lowestRecordedSales = [...productRankingList]
    .filter((p) => p.revenue > 0 || p.unitsSold > 0)
    .sort((a, b) => a.revenue - b.revenue);

  // Category breakdown
  const categoryAggregateMap = new Map<string, { revenue: number; units: number }>();
  productRankingList.forEach((p) => {
    const existing = categoryAggregateMap.get(p.category) || { revenue: 0, units: 0 };
    existing.revenue += p.revenue;
    existing.units += p.unitsSold;
    categoryAggregateMap.set(p.category, existing);
  });

  const categoryBreakdown = Array.from(categoryAggregateMap.entries())
    .map(([cat, meta]) => ({
      category: cat,
      revenue: Number(meta.revenue.toFixed(2)),
      units: meta.units,
      sharePct: totalRev && totalRev > 0 ? Number(((meta.revenue / totalRev) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const topProductShare = topByRevenue.length > 0 ? topByRevenue[0].revenueSharePct : 0;
  if (topProductShare > 40 && topByRevenue.length > 1) {
    salesPatterns.push({
      title: 'High product revenue concentration',
      evidence: `Highest revenue contributor "${topByRevenue[0].product}" generates ${topProductShare}% of total recorded sales (${formatCurrency(topByRevenue[0].revenue)} of ${formatCurrency(totalRev)}).`,
      interpretation: 'Commercial revenue relies heavily on a single product line.',
    });
  }

  const productAnalysis: ProductAnalysisResult = {
    isAvailable: productRankingList.length > 0,
    reasonIfNotAvailable:
      productRankingList.length === 0 ? 'No product-specific transactions recorded.' : undefined,
    totalProductsAnalyzed: productRankingList.length,
    topByRevenue: topByRevenue.slice(0, 5),
    topByUnits: topByUnits.slice(0, 5),
    lowestRecordedSales: lowestRecordedSales.slice(0, 5),
    revenueConcentrationPct: topProductShare,
    categoryBreakdown,
    observation:
      topByRevenue.length > 0
        ? `Highest revenue contribution: "${topByRevenue[0].product}" (${formatCurrency(topByRevenue[0].revenue)}, ${topByRevenue[0].revenueSharePct}%). Lowest recorded volume: "${lowestRecordedSales[0]?.product || 'N/A'}".`
        : 'No products recorded.',
    interpretation:
      topProductShare > 40
        ? 'High concentration indicates revenue vulnerability if key product faces supply or demand disruption.'
        : 'Product catalog displays balanced revenue distribution across multiple offerings.',
  };

  // =========================================================================
  // 6. INVENTORY ANALYSIS
  // =========================================================================
  const inventoryImbalances: {
    product: string;
    currentStock: number;
    salesVolume: number;
    type: 'high_inventory_low_sales' | 'low_inventory_high_sales' | 'potential_imbalance';
    observation: string;
    interpretation: string;
  }[] = [];

  // Compare inventory with sales activity
  products.forEach((p) => {
    if (p.currentStock === null) return;
    const matchingRanking = productRankingList.find(
      (r) => r.product.toLowerCase() === p.name.toLowerCase()
    );
    const salesVolume = matchingRanking ? matchingRanking.unitsSold : 0;

    // Potential inventory imbalance: High inventory with relatively low sales
    if (p.currentStock >= 40 && salesVolume <= 5) {
      inventoryImbalances.push({
        product: p.name,
        currentStock: p.currentStock,
        salesVolume,
        type: 'high_inventory_low_sales',
        observation: `Potential inventory imbalance: Current stock is ${p.currentStock} units while recorded sales volume is ${salesVolume} units.`,
        interpretation: 'Capital is tied up in stock with slow relative commercial movement.',
      });
    }
    // Low inventory with relatively high sales
    else if (p.currentStock > 0 && p.currentStock <= (p.minStockLevel || 10) && salesVolume >= 20) {
      inventoryImbalances.push({
        product: p.name,
        currentStock: p.currentStock,
        salesVolume,
        type: 'low_inventory_high_sales',
        observation: `Potential inventory imbalance: Rapid sales pace (${salesVolume} units) against constrained remaining stock (${p.currentStock} units).`,
        interpretation: 'Risk of stockout if procurement lead time exceeds remaining sales velocity.',
      });
    }
  });

  const inventoryAnalysis: InventoryAnalysisResult = {
    isAvailable: hasStockData,
    reasonIfNotAvailable: hasStockData ? undefined : 'No inventory stock count records available.',
    totalCatalogItems: products.length,
    totalStockUnits: totalStockUnits || 0,
    lowStockItems: lowStockItems.map((p) => ({
      product: p.name,
      currentStock: p.currentStock || 0,
      buffer: p.minStockLevel || 0,
      salesUnits: productRankingList.find((r) => r.product.toLowerCase() === p.name.toLowerCase())
        ?.unitsSold,
    })),
    outOfStockItems: outOfStockItems.map((p) => ({
      product: p.name,
      buffer: p.minStockLevel || 0,
    })),
    imbalances: inventoryImbalances,
    observation: hasStockData
      ? `${totalStockUnits || 0} total stock units across ${products.length} products. ${lowStockItems.length} items at or below safety buffer, ${outOfStockItems.length} out of stock.`
      : 'Stock counts not tracked.',
    interpretation:
      lowStockItems.length > 0 || outOfStockItems.length > 0 || inventoryImbalances.length > 0
        ? 'Inventory allocation exhibits potential imbalances between stock levels and commercial turnover.'
        : 'Stock levels align with safety buffer specifications.',
  };

  // =========================================================================
  // 7. CUSTOMER ANALYSIS (Aggregated, neutral)
  // =========================================================================
  const custRevMap = new Map<string, { revenue: number; txCount: number }>();
  transactions.forEach((t) => {
    if (t.customer && t.revenue) {
      const c = t.customer;
      const existing = custRevMap.get(c) || { revenue: 0, txCount: 0 };
      existing.revenue += t.revenue;
      existing.txCount += 1;
      custRevMap.set(c, existing);
    }
  });

  const topCustomersByRev = Array.from(custRevMap.entries())
    .map(([cust, meta]) => ({
      customer: cust,
      revenue: Number(meta.revenue.toFixed(2)),
      transactionCount: meta.txCount,
      revenueSharePct: totalRev && totalRev > 0 ? Number(((meta.revenue / totalRev) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Customer type distribution
  const typeMap = new Map<string, number>();
  customers.forEach((c) => {
    const t = c.type || 'Standard';
    typeMap.set(t, (typeMap.get(t) || 0) + 1);
  });
  if (typeMap.size === 0 && byCustomerType) {
    byCustomerType.forEach((ct) => {
      typeMap.set(ct.customerType, ct.revenue);
    });
  }

  const totalTypesCount = Array.from(typeMap.values()).reduce((a, b) => a + b, 0);
  const typeDistribution = Array.from(typeMap.entries()).map(([type, count]) => ({
    type,
    count,
    percentage: totalTypesCount > 0 ? Number(((count / totalTypesCount) * 100).toFixed(1)) : 0,
  }));

  const customerAnalysis: CustomerAnalysisResult = {
    isAvailable: customerCount !== null && customerCount > 0,
    reasonIfNotAvailable: customerCount === null ? 'No customer ledger records detected.' : undefined,
    customerCount: customerCount || 0,
    typeDistribution,
    topCustomersByRevenue: topCustomersByRev.slice(0, 5),
    observation:
      customerCount !== null
        ? `${customerCount} verified customer accounts. Top customer accounts for ${topCustomersByRev[0]?.revenueSharePct || 0}% of recorded sales.`
        : 'Customer information not recorded.',
    interpretation:
      topCustomersByRev.length > 0 && topCustomersByRev[0].revenueSharePct > 30
        ? 'Customer concentration is high; single largest client generates substantial revenue proportion.'
        : 'Customer base exhibits distributed purchasing across accounts.',
  };

  // =========================================================================
  // 8. EXPENSE ANALYSIS
  // =========================================================================
  const expenseCatMap = new Map<string, number>();
  expenses.forEach((e) => {
    const c = e.category || 'Other';
    expenseCatMap.set(c, (expenseCatMap.get(c) || 0) + (e.amount || 0));
  });

  const expenseCategories = Array.from(expenseCatMap.entries())
    .map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
      percentage: totalExp && totalExp > 0 ? Number(((amount / totalExp) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const largestCat = expenseCategories.length > 0 ? expenseCategories[0] : null;

  const expenseAnalysis: ExpenseAnalysisResult = {
    isAvailable: hasExpenses,
    reasonIfNotAvailable: hasExpenses ? undefined : 'No operating expenses logged.',
    totalExpenses: totalExp,
    byCategory: expenseCategories,
    largestCategory: largestCat,
    revenueExpenseComparison: {
      revenue: totalRev,
      expenses: totalExp,
      difference: revExpDiff,
      differenceFormatted: formatCurrency(revExpDiff),
      hasBoth: totalRev !== null && totalExp !== null,
      note: 'Difference between recorded revenue and recorded expenses. Not labeled as net profit because unrecorded overhead/COGS may exist.',
    },
    observation: hasExpenses
      ? `Total recorded expenses: ${formatCurrency(totalExp)} across ${expenseCategories.length} categories. Largest category: "${largestCat?.category || 'N/A'}" (${formatCurrency(largestCat?.amount || 0)}, ${largestCat?.percentage || 0}%).`
      : 'Expenses not recorded.',
    interpretation:
      hasExpenses && totalRev !== null
        ? `Recorded revenue exceeds recorded operating expenses by ${formatCurrency(revExpDiff)}. Ongoing cost monitoring advised.`
        : 'Record operational expenditures to track gross burn rate.',
  };

  // =========================================================================
  // 9. OBSERVED FINDINGS (Strict Facts directly calculated from data)
  // =========================================================================
  const observedFindings: ObservedFindingItem[] = [];

  if (totalRev !== null) {
    observedFindings.push({
      id: 'obs_rev_total',
      topic: 'Total Commercial Revenue',
      fact: `Total recorded revenue is ${formatCurrency(totalRev)}.`,
      evidence: `Aggregated sum of ${transactionsWithRevenue.length} sales entries.`,
      category: 'sales',
    });
  }

  if (topByRevenue.length > 0) {
    observedFindings.push({
      id: 'obs_top_product',
      topic: 'Primary Revenue Generator',
      fact: `"${topByRevenue[0].product}" generates ${topByRevenue[0].revenueSharePct}% of total recorded revenue (${formatCurrency(topByRevenue[0].revenue)}).`,
      evidence: `Product revenue ranking based on ${productRankingList.length} distinct items.`,
      category: 'products',
    });
  }

  if (timeAnalysis.isAvailable) {
    observedFindings.push({
      id: 'obs_time_trend',
      topic: 'Temporal Revenue Trajectory',
      fact: `Ledger covers ${timeAnalysis.periodCount} ${timeAnalysis.grouping.toLowerCase()} periods between ${timeAnalysis.startDate} and ${timeAnalysis.endDate}.`,
      evidence: `Trend direction identified as ${timeAnalysis.trendDirection}.`,
      category: 'time',
    });
  }

  if (hasStockData) {
    observedFindings.push({
      id: 'obs_stock_levels',
      topic: 'On-Hand Stock Count',
      fact: `${totalStockUnits} total stock units on hand. ${lowStockItems.length} SKU(s) at or below safety buffer.`,
      evidence: `Inventory audit across ${products.length} catalog items.`,
      category: 'inventory',
    });
  }

  if (hasExpenses && totalExp !== null) {
    observedFindings.push({
      id: 'obs_expenses_total',
      topic: 'Operating Costs',
      fact: `Total recorded operational expenses amount to ${formatCurrency(totalExp)} across ${expenseCategories.length} categories.`,
      evidence: `Largest category: "${largestCat?.category || 'N/A'}" (${largestCat?.percentage || 0}%).`,
      category: 'expenses',
    });
  }

  // =========================================================================
  // 10. DATA-BASED INTERPRETATION (Reasonable interpretations grounded in facts)
  // =========================================================================
  const dataBasedInterpretations: DataBasedInterpretationItem[] = [];

  if (topProductShare > 40 && topByRevenue.length > 1) {
    dataBasedInterpretations.push({
      id: 'interp_prod_concentration',
      topic: 'Portfolio Diversification Risk',
      interpretation:
        'A single offering contributes a commanding share of commercial intake. While this product is a cornerstone, commercial stability would benefit from strengthening secondary product volumes.',
      groundedInObservationId: 'obs_top_product',
      evidenceRef: `Top product "${topByRevenue[0].product}" represents ${topProductShare}% of all sales.`,
      reviewUrgency: 'monitor',
    });
  }

  if (lowStockItems.length > 0) {
    dataBasedInterpretations.push({
      id: 'interp_low_stock',
      topic: 'Supply Chain Replenishment',
      interpretation:
        'Products currently below safety buffer thresholds are susceptible to fulfillment bottlenecks if customer demand continues at current velocity.',
      groundedInObservationId: 'obs_stock_levels',
      evidenceRef: `${lowStockItems.length} products breached safety buffer thresholds (${lowStockItems.map((p) => p.name).join(', ')}).`,
      reviewUrgency: 'action_needed',
    });
  }

  if (inventoryImbalances.length > 0) {
    const firstImbalance = inventoryImbalances[0];
    dataBasedInterpretations.push({
      id: 'interp_stock_imbalance',
      topic: 'Inventory Capital Allocation',
      interpretation:
        'Disparity observed between stocking quantities and commercial turnover indicates potential capital lockup in slow-moving stock.',
      groundedInObservationId: 'obs_stock_levels',
      evidenceRef: firstImbalance.observation,
      reviewUrgency: 'routine',
    });
  }

  if (totalRev !== null && totalExp !== null) {
    dataBasedInterpretations.push({
      id: 'interp_burn_coverage',
      topic: 'Commercial Operating Coverage',
      interpretation:
        revExpDiff !== null && revExpDiff > 0
          ? `Recorded revenues exceed recorded operational expenses by ${formatCurrency(revExpDiff)}. However, unrecorded overhead or taxes must be factored before assessing ultimate profitability.`
          : `Recorded expenses meet or exceed revenue figures. Reviewing fixed operating cost items is recommended.`,
      groundedInObservationId: 'obs_expenses_total',
      evidenceRef: `Revenue: ${formatCurrency(totalRev)} vs Expenses: ${formatCurrency(totalExp)}.`,
      reviewUrgency: revExpDiff !== null && revExpDiff > 0 ? 'routine' : 'action_needed',
    });
  }

  // =========================================================================
  // 11. AREAS TO REVIEW
  // =========================================================================
  const areasToReview: AreaToReviewItem[] = [];

  if (lowStockItems.length > 0) {
    areasToReview.push({
      id: 'review_low_stock',
      title: 'Safety Buffer Replenishment',
      evidence: `${lowStockItems.length} item(s) below minimum safety buffer: ${lowStockItems.map((p) => `${p.name} (Stock: ${p.currentStock}/${p.minStockLevel})`).join(', ')}.`,
      riskSeverity: 'high',
      reviewAction: 'Review lead times with primary suppliers and initiate reorder for depleted SKUs.',
    });
  }

  if (inventoryImbalances.length > 0) {
    areasToReview.push({
      id: 'review_inventory_imbalance',
      title: 'Potential Inventory Imbalance',
      evidence: inventoryImbalances.map((i) => i.observation).join('; '),
      riskSeverity: 'medium',
      reviewAction: 'Audit stock turn rates and adjust ordering quantities to match actual sales velocity.',
    });
  }

  if (topProductShare > 45) {
    areasToReview.push({
      id: 'review_product_concentration',
      title: 'Product Revenue Concentration',
      evidence: `Top SKU "${topByRevenue[0].product}" accounts for ${topProductShare}% of gross sales volume.`,
      riskSeverity: 'medium',
      reviewAction: 'Evaluate bundling or cross-promoting secondary products to reduce dependency on top item.',
    });
  }

  if (!hasCostData) {
    areasToReview.push({
      id: 'review_missing_cogs',
      title: 'Missing Cost of Goods (COGS) Ledger',
      evidence: 'Product cost prices are not logged on transaction records, preventing exact gross margin calculation.',
      riskSeverity: 'low',
      reviewAction: 'Add product procurement/cost prices in Products catalog or transaction ledger.',
    });
  }

  // =========================================================================
  // 12. BUSINESS ANALYSIS SUMMARY
  // =========================================================================
  const dataAvailable: string[] = [];
  if (hasRevenueData) dataAvailable.push(`Sales Ledger (${transactionsWithRevenue.length} revenue records)`);
  if (hasStockData) dataAvailable.push(`Product Catalog & Stock (${productsWithStock.length} inventory items)`);
  if (hasExpenses) dataAvailable.push(`Operating Expenses (${expenses.length} records)`);
  if (customerCount) dataAvailable.push(`Customer Accounts (${customerCount} accounts)`);
  if (hasDateData) dataAvailable.push(`Temporal Sequence (${timeAnalysis.periodCount} ${timeAnalysis.grouping.toLowerCase()} periods)`);

  const keyMetricsSummary = [
    { label: 'Revenue', value: formatCurrency(totalRev), isSupported: totalRev !== null },
    { label: 'Sales Transactions', value: formatInteger(totalSalesTx), isSupported: totalSalesTx !== null },
    { label: 'Units Sold', value: formatInteger(totalUnits), isSupported: totalUnits !== null },
    { label: 'Average Order Value', value: formatCurrency(avgOrderVal), isSupported: avgOrderVal !== null },
    {
      label: 'Potential Gross Margin',
      value: potentialGrossMarginVal !== null ? `${formatCurrency(potentialGrossMarginVal)} (${potentialGrossMarginPct}%)` : 'Insufficient data',
      isSupported: potentialGrossMarginVal !== null,
    },
    { label: 'Operating Expenses', value: formatCurrency(totalExp), isSupported: totalExp !== null },
    {
      label: 'Revenue - Expense Difference',
      value: formatCurrency(revExpDiff),
      isSupported: revExpDiff !== null,
    },
    { label: 'Inventory Units On-Hand', value: formatInteger(totalStockUnits), isSupported: totalStockUnits !== null },
    { label: 'Low Stock Items', value: formatInteger(lowStockCount), isSupported: lowStockCount !== null },
  ];

  const summary: BusinessAnalysisSummary = {
    dataAvailable,
    keyMetricsSummary,
    observedPatterns: salesPatterns.map((p) => ({ title: p.title, evidence: p.evidence })),
    areasToReview,
    unavailableAnalyses: unsupportedAnalyses.map((u) => ({
      title: u.name,
      missingRequirement: u.missingRequirement,
      impact: 'Metric withheld to maintain zero-fabrication protocol.',
    })),
  };

  return {
    dataSourceSummary,
    sufficiency,
    keyMetrics,
    timeAnalysis,
    salesAnalysis: {
      isAvailable: hasRevenueData,
      totalSales: totalRev,
      patterns: salesPatterns,
      byRegion,
      byCustomerType,
    },
    productAnalysis,
    inventoryAnalysis,
    customerAnalysis,
    expenseAnalysis,
    observedFindings,
    dataBasedInterpretations,
    areasToReview,
    summary,
    aiInterpretationPlaceholder: {
      status: 'scheduled_step_7',
      model: 'Gemini AI Diagnostic Agent (Scheduled for Step 7)',
      description:
        'Advanced heuristic reasoning, predictive foresight, and strategic synthesis powered by Gemini will be added in Step 7.',
    },
  };
}
