import {
  UnifiedBusinessAnalysisReport,
  UnifiedBusinessDataLayer,
  GeminiAiInsightsResponse,
  RecommendedAnalysisMethod,
  GenerateInsightsPayload,
  ProductRankingItem,
} from '../types/analysis';
import { BusinessProfile } from '../types/bi';

/**
 * Evaluates candidate AI/ML methods based strictly on data presence and patterns
 * identified by the deterministic engine.
 * IMPORTANT: These are METHOD RECOMMENDATIONS only — no models are trained or deployed.
 */
export function evaluateRecommendedMethods(
  report: UnifiedBusinessAnalysisReport,
  dataLayer: UnifiedBusinessDataLayer
): RecommendedAnalysisMethod[] {
  const methods: RecommendedAnalysisMethod[] = [];

  // 1. Time-Series Forecasting / Regression
  const hasTimePeriods =
    report.timeAnalysis.isAvailable &&
    report.timeAnalysis.dataPoints &&
    report.timeAnalysis.dataPoints.length >= 2;

  methods.push({
    id: 'method-time-series',
    methodName: 'Time-Series Forecasting / Regression',
    triggerCondition: hasTimePeriods
      ? `Detected ${report.timeAnalysis.dataPoints.length} periodic intervals (${report.timeAnalysis.grouping || 'chronological'}).`
      : 'Requires at least 2 distinct periodic date stamps in sales records.',
    potentialBenefit:
      'Can project baseline reorder cycles, expected seasonal peaks, and working capital cash needs without manual guesswork.',
    applicableData: `${dataLayer.transactions.length} chronological sales records`,
    isTriggered: hasTimePeriods,
    statusBadge: hasTimePeriods ? 'Trigger Condition Met' : 'Additional Dates Needed',
    complexity: 'Medium',
  });

  // 2. K-Means Clustering
  const hasCustomerSpread =
    report.customerAnalysis.isAvailable &&
    report.customerAnalysis.customerCount >= 3;

  methods.push({
    id: 'method-clustering',
    methodName: 'K-Means Clustering',
    triggerCondition: hasCustomerSpread
      ? `Detected ${report.customerAnalysis.customerCount} registered customer accounts with purchasing variance.`
      : 'Requires 3 or more customer accounts with order history.',
    potentialBenefit:
      'Groups accounts by transaction frequency, order size, and margin tier to offer tailored credit terms or bulk incentives.',
    applicableData: `${dataLayer.customers.length} customer records & ${dataLayer.orders.length} order entries`,
    isTriggered: hasCustomerSpread,
    statusBadge: hasCustomerSpread ? 'Trigger Condition Met' : 'More Customer Records Needed',
    complexity: 'Medium',
  });

  // 3. Collaborative Filtering / Ranking
  const hasMultiProduct =
    report.productAnalysis.isAvailable &&
    report.productAnalysis.totalProductsAnalyzed >= 3;

  methods.push({
    id: 'method-collaborative-filtering',
    methodName: 'Collaborative Filtering / Ranking',
    triggerCondition: hasMultiProduct
      ? `Catalog contains ${report.productAnalysis.totalProductsAnalyzed} distinct SKUs across multiple transactions.`
      : 'Requires a catalog of at least 3 distinct products with sales history.',
    potentialBenefit:
      'Identifies affinity pairings (products frequently purchased together) for bundled promotions and counter displays.',
    applicableData: `${dataLayer.products.length} catalog items across ${dataLayer.transactions.length} transactions`,
    isTriggered: hasMultiProduct,
    statusBadge: hasMultiProduct ? 'Trigger Condition Met' : 'Broader Catalog Needed',
    complexity: 'Advanced',
  });

  // 4. Natural Language Processing (NLP / LLM)
  const hasTextualData =
    dataLayer.customers.some((c) => Boolean(c.name || c.contactInfo)) ||
    dataLayer.products.some((p) => Boolean(p.category || p.name));

  methods.push({
    id: 'method-nlp',
    methodName: 'Natural Language Processing (NLP / LLM)',
    triggerCondition: hasTextualData
      ? 'Product descriptions and customer communication notes detected in ledger.'
      : 'Requires textual feedback, customer notes, or catalog specifications.',
    potentialBenefit:
      'Drafts localized follow-up reminders, summarizes supplier inquiries, and standardizes multi-language inquiries.',
    applicableData: 'Ledger notes, customer directory profiles, and product taxonomies',
    isTriggered: hasTextualData,
    statusBadge: hasTextualData ? 'Trigger Condition Met' : 'Textual Fields Optional',
    complexity: 'Low',
  });

  // 5. Anomaly Detection
  const hasAnomaliesOrSpread =
    (report.areasToReview && report.areasToReview.length > 0) ||
    dataLayer.transactions.length >= 5;

  methods.push({
    id: 'method-anomaly-detection',
    methodName: 'Anomaly Detection',
    triggerCondition: hasAnomaliesOrSpread
      ? `Transaction dataset contains ${dataLayer.transactions.length} entries with ${report.areasToReview.length} operational attention signals.`
      : 'Requires at least 5 transactions to establish baseline statistical bounds.',
    potentialBenefit:
      'Flags sudden expense spikes, unexpected unit price deviations, or accidental duplicate entries for human auditing.',
    applicableData: `${dataLayer.transactions.length} sales & ${dataLayer.expenses.length} expense line items`,
    isTriggered: hasAnomaliesOrSpread,
    statusBadge: hasAnomaliesOrSpread ? 'Trigger Condition Met' : 'Baseline Scale Needed',
    complexity: 'Medium',
  });

  return methods;
}

/**
 * Builds payload for the server-side Gemini endpoint.
 * Minimizes data: never sends raw PII, passwords, or individual customer names.
 */
/**
 * Sanitize text to remove sensitive personal data (emails, phone numbers, auth tokens)
 */
export function sanitizeAiInputText(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[contact-redacted]')
    .replace(/\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone-redacted]')
    .replace(/\b(bearer\s+[a-zA-Z0-9_\-.]+)|(password\s*[:=]\s*\S+)|(api[_-]?key\s*[:=]\s*\S+)/gi, '[redacted]')
    .trim();
}

/**
 * Strips HTML tags and potential script injection from AI output
 */
function cleanAiString(str: any): string {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validates and sanitizes Gemini AI JSON output to guarantee safety & schema adherence
 */
export function validateAndSanitizeAiResponse(raw: any): GeminiAiInsightsResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.summary || typeof raw.summary !== 'string') return null;
  if (!Array.isArray(raw.key_insights) || raw.key_insights.length === 0) return null;
  if (!Array.isArray(raw.areas_to_review)) return null;
  if (!Array.isArray(raw.opportunities)) return null;

  try {
    const sanitizedSummary = cleanAiString(raw.summary);

    const sanitizedKeyInsights = raw.key_insights.map((item: any) => ({
      category: cleanAiString(item.category || 'Operations'),
      title: cleanAiString(item.title || 'Operational Finding'),
      evidence: cleanAiString(item.evidence || 'Derived from transaction records.'),
      interpretation: cleanAiString(item.interpretation || 'Review business workflow.'),
      importance: ['high', 'medium', 'low'].includes(item.importance) ? item.importance : 'medium',
    }));

    const sanitizedAreasToReview = raw.areas_to_review.map((item: any) => ({
      category: cleanAiString(item.category || 'Finance'),
      issue: cleanAiString(item.issue || 'Variance Detected'),
      evidence: cleanAiString(item.evidence || 'Derived from transaction records.'),
      possible_reason: cleanAiString(item.possible_reason || 'Operational difference.'),
    }));

    const sanitizedOpportunities = raw.opportunities.map((item: any) => ({
      category: cleanAiString(item.category || 'Sales'),
      opportunity: cleanAiString(item.opportunity || 'Operational Review'),
      evidence: cleanAiString(item.evidence || 'Derived from business records.'),
      possible_action: cleanAiString(item.possible_action || 'Review inventory and sales data.'),
    }));

    const sanitizedLimitations = Array.isArray(raw.data_limitations)
      ? raw.data_limitations.map((lim: any) => cleanAiString(lim))
      : [];

    return {
      summary: sanitizedSummary,
      key_insights: sanitizedKeyInsights,
      areas_to_review: sanitizedAreasToReview,
      opportunities: sanitizedOpportunities,
      data_limitations: sanitizedLimitations,
    };
  } catch {
    return null;
  }
}

export function buildInsightsPayload(
  report: UnifiedBusinessAnalysisReport,
  dataLayer: UnifiedBusinessDataLayer,
  profile?: BusinessProfile | null,
  locale = 'English',
  localeCode = 'en'
): GenerateInsightsPayload {
  const sourcesActive: string[] = [];
  if (dataLayer.dataSourceSummary?.hasManual) sourcesActive.push('Manual Business Affairs');
  if (dataLayer.dataSourceSummary?.hasUpload) sourcesActive.push('Uploaded Ledger Files');
  if (dataLayer.dataSourceSummary?.hasDemo) sourcesActive.push('Apparel Benchmark Demo');

  const totalRawRecords =
    dataLayer.transactions.length +
    dataLayer.products.length +
    dataLayer.expenses.length +
    dataLayer.customers.length;

  // Top products summary (sanitized)
  const topProducts =
    report.productAnalysis.topByRevenue?.slice(0, 3).map(
      (p: ProductRankingItem) => sanitizeAiInputText(`${p.product}: $${p.revenue.toLocaleString()} (${p.revenueSharePct}% share, ${p.unitsSold} units)`)
    ) || [];

  // Lowest products summary (sanitized)
  const lowestProducts =
    report.productAnalysis.lowestRecordedSales?.slice(0, 3).map(
      (p: ProductRankingItem) => sanitizeAiInputText(`${p.product}: $${p.revenue.toLocaleString()} (${p.revenueSharePct}% share, ${p.unitsSold} units)`)
    ) || [];

  // Top categories (sanitized)
  const topCategories =
    report.productAnalysis.categoryBreakdown?.slice(0, 4).map(
      (c) => sanitizeAiInputText(`${c.category}: $${c.revenue.toLocaleString()} (${c.sharePct}% share)`)
    ) || [];

  // Regional breakdown (sanitized)
  const regionalBreakdown =
    report.salesAnalysis?.byRegion?.map(
      (r) => sanitizeAiInputText(`${r.region}: $${r.revenue.toLocaleString()} (${r.sharePct}%)`)
    ) || [];

  // Inventory imbalances (sanitized)
  const inventoryImbalances =
    report.inventoryAnalysis.imbalances?.map(
      (imb) => sanitizeAiInputText(`${imb.product}: ${imb.observation} (${imb.interpretation})`)
    ) || [];

  // Expense breakdown (sanitized)
  const expenseBreakdown =
    report.expenseAnalysis.byCategory?.map(
      (e) => sanitizeAiInputText(`${e.category}: $${e.amount.toLocaleString()} (${e.percentage}%)`)
    ) || [];

  return {
    businessLevel: profile?.businessLevel || 'local_village',
    businessType: profile?.businessType || 'Commercial Products & Inventory',
    locale,
    localeCode,
    dataSources: {
      summary: report.dataSourceSummary.summaryText || report.dataSourceSummary.primarySourceName,
      totalRecords: totalRawRecords,
      sourcesActive,
      sufficiencyStatus: report.sufficiency.state,
      missingFields: report.sufficiency.reasons,
    },
    metrics: {
      revenue: report.keyMetrics.revenue.formatted,
      expenses: report.keyMetrics.totalExpenses.formatted,
      netDifference: report.expenseAnalysis.revenueExpenseComparison.differenceFormatted,
      orderCount: report.keyMetrics.orderCount.formatted,
      productCount: report.keyMetrics.productCount.formatted,
      customerCount: report.keyMetrics.customerCount.formatted,
      lowStockCount: report.keyMetrics.lowStockItemsCount.formatted,
      outOfStockCount: report.keyMetrics.outOfStockItemsCount.formatted,
    },
    patterns: {
      salesVelocity: report.timeAnalysis.isAvailable
        ? `${report.timeAnalysis.dataPoints.length} periods evaluated with ${report.timeAnalysis.trendDirection} velocity (${report.timeAnalysis.observation})`
        : 'Chronological dates not available in active ledger',
      topProducts,
      lowestProducts,
      topCategories,
      regionalBreakdown,
      inventoryImbalances,
      expenseBreakdown,
    },
    businessAlerts: report.areasToReview.map((a) => ({
      title: sanitizeAiInputText(a.title),
      evidence: sanitizeAiInputText(a.evidence),
      interpretation: sanitizeAiInputText(a.reviewAction),
      type: a.riskSeverity,
    })),
    dataQualityWarnings: report.sufficiency.reasons,
  };
}

/**
 * High-fidelity deterministic fallback synthesizer in case the Gemini endpoint
 * is unreachable, offline, or temporarily unconfigured.
 */
export function generateDeterministicFallbackInsights(
  report: UnifiedBusinessAnalysisReport,
  dataLayer: UnifiedBusinessDataLayer
): GeminiAiInsightsResponse {
  const key_insights: GeminiAiInsightsResponse['key_insights'] = [];
  const areas_to_review: GeminiAiInsightsResponse['areas_to_review'] = [];
  const opportunities: GeminiAiInsightsResponse['opportunities'] = [];
  const data_limitations: string[] = [];

  const totalRawRecords =
    dataLayer.transactions.length +
    dataLayer.products.length +
    dataLayer.expenses.length +
    dataLayer.customers.length;

  // 1. Sales Insight
  if (report.keyMetrics.revenue.isSupported && report.keyMetrics.revenue.value !== null) {
    key_insights.push({
      category: 'Sales',
      title: 'Gross Revenue Performance & Velocity',
      evidence: `Recorded gross revenue stands at ${report.keyMetrics.revenue.formatted} across ${report.keyMetrics.orderCount.formatted} logged orders.`,
      interpretation:
        report.timeAnalysis.isAvailable
          ? `Observed revenue velocity indicates a ${report.timeAnalysis.trendDirection} pattern across ${report.timeAnalysis.dataPoints.length} recorded periods.`
          : 'Transactions reflect aggregated commercial volume across recorded customer channels.',
      importance:
        'Understanding baseline revenue volume allows the business to calibrate operational expense limits and supplier commitments.',
      data_limitation: report.timeAnalysis.isAvailable
        ? 'External macroeconomic shifts and local customer footfall are not captured in the ledger.'
        : 'Exact periodic seasonality cannot be confirmed without chronological date stamps on every sale.',
    });
  }

  // 2. Product Concentration
  if (report.productAnalysis.isAvailable && report.productAnalysis.topByRevenue?.length > 0) {
    const topItem = report.productAnalysis.topByRevenue[0];
    key_insights.push({
      category: 'Products',
      title: 'Catalog Revenue Concentration',
      evidence: `${topItem.product} represents ${topItem.revenueSharePct}% of total catalog sales ($${topItem.revenue.toLocaleString()}).`,
      interpretation:
        'The business possesses a clear flagship offering that drives the substantial majority of commercial cash flow.',
      importance:
        'While a strong hero SKU delivers predictable cash, over-reliance poses a concentration risk if supply chains or customer tastes shift.',
      data_limitation:
        'Customer satisfaction and repeat reorder rates per SKU are not tracked in basic receipt lines.',
    });

    opportunities.push({
      category: 'Products',
      opportunity: 'Hero SKU Bundling & Merchandising',
      evidence: `${topItem.product} generates ${topItem.revenueSharePct}% of sales with high customer demand.`,
      possible_action:
        'Consider pairing lower-velocity items as bundled offerings with this flagship item to lift average basket size.',
    });
  }

  // 3. Inventory Attention
  if (report.inventoryAnalysis.isAvailable) {
    const lowCount = Number(report.keyMetrics.lowStockItemsCount.value || 0);
    const outCount = Number(report.keyMetrics.outOfStockItemsCount.value || 0);

    if (lowCount > 0 || outCount > 0) {
      areas_to_review.push({
        category: 'Inventory',
        issue: 'Safety Buffer Depletion Across High-Demand SKUs',
        evidence: `${lowCount} item(s) are at or below safety stock threshold; ${outCount} item(s) are completely out of stock.`,
        possible_reason:
          'Rapid stock turnover outpaced supplier lead times or purchase orders were delayed.',
        consider_reviewing:
          'Consider reviewing minimum reorder thresholds with primary distributors to prevent lost sales.',
      });
    }

    if (report.inventoryAnalysis.imbalances?.length > 0) {
      const firstImb = report.inventoryAnalysis.imbalances[0];
      areas_to_review.push({
        category: 'Inventory',
        issue: 'Potential Inventory Imbalance in Catalog',
        evidence: `${firstImb.product}: ${firstImb.observation}`,
        possible_reason: firstImb.interpretation,
        consider_reviewing:
          'Consider reviewing procurement volumes to balance working capital tied up in slow-moving stock.',
      });
    }
  }

  // 4. Operating Expenses
  if (report.expenseAnalysis.isAvailable && report.keyMetrics.totalExpenses.value !== null) {
    key_insights.push({
      category: 'Expenses',
      title: 'Operating Cost Spread & Cash Allocation',
      evidence: `Recorded expenses total ${report.keyMetrics.totalExpenses.formatted}. Largest cost driver is ${report.expenseAnalysis.largestCategory?.category || 'General Operations'} (${report.expenseAnalysis.largestCategory?.percentage || 0}% share).`,
      interpretation:
        'Fixed and recurring overheads directly consume operating cash generated from merchandise sales.',
      importance:
        'Monitoring category expense proportions ensures overhead growth does not outpace gross sales margins.',
      data_limitation:
        'Unit cost of goods sold (COGS) is partially unlinked from catalog receipts, preventing exact net margin calculation.',
    });
  }

  // 5. Customer Directory
  if (report.customerAnalysis.isAvailable && report.customerAnalysis.customerCount > 0) {
    key_insights.push({
      category: 'Customers',
      title: 'Customer Directory & Account Engagement',
      evidence: `${report.customerAnalysis.customerCount} customer account(s) recorded in active directory.`,
      interpretation:
        'Client records indicate an emerging account relationship base for recurring commerce.',
      importance:
        'Repeat customer accounts generally cost less to service than new customer acquisition.',
      data_limitation:
        'Customer satisfaction scores and churn intervals are not recorded in transactional records.',
    });
  }

  // Data Limitations
  if (report.sufficiency.unsupportedAnalyses && report.sufficiency.unsupportedAnalyses.length > 0) {
    report.sufficiency.unsupportedAnalyses.forEach((req) => {
      data_limitations.push(`Missing field: ${req.missingRequirement} limits ${req.name}.`);
    });
  } else {
    data_limitations.push('Competitor pricing and external market trends are not available in the internal ledger.');
  }

  return {
    summary:
      report.keyMetrics.revenue.isSupported && report.keyMetrics.revenue.value !== null
        ? `Analysis of ${totalRawRecords} records indicates ${report.keyMetrics.revenue.formatted} in commercial activity across ${report.keyMetrics.productCount.formatted} catalog SKUs. Core opportunities center on stock buffer protection and catalog merchandising.`
        : 'Ledger analysis complete. Input records provide baseline commercial visibility with recommended areas to review.',
    key_insights,
    areas_to_review,
    opportunities,
    data_limitations,
  };
}

/**
 * Client method to fetch Gemini AI Insights via server-side proxy route `/api/gemini/insights`.
 * Implements strict zero-hallucination validation and resilient error handling.
 */
export async function fetchGeminiInsights(
  report: UnifiedBusinessAnalysisReport,
  dataLayer: UnifiedBusinessDataLayer,
  profile?: BusinessProfile | null,
  locale = 'English',
  localeCode = 'en'
): Promise<{
  insights: GeminiAiInsightsResponse;
  source: 'gemini_api' | 'deterministic_fallback';
  errorWarning?: string;
}> {
  const payload = buildInsightsPayload(report, dataLayer, profile, locale, localeCode);

  try {
    const res = await fetch('/api/gemini/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      console.warn('Gemini proxy returned non-200:', res.status, errorJson);

      const fallback = generateDeterministicFallbackInsights(report, dataLayer);
      return {
        insights: fallback,
        source: 'deterministic_fallback',
        errorWarning:
          errorJson.error ||
          'AI interpretation is temporarily unavailable. Displaying data-driven pattern interpretation.',
      };
    }

    const rawData = await res.json();
    const validatedData = validateAndSanitizeAiResponse(rawData);

    if (!validatedData) {
      const fallback = generateDeterministicFallbackInsights(report, dataLayer);
      return {
        insights: fallback,
        source: 'deterministic_fallback',
        errorWarning: 'AI interpretation could not be generated. Your data analysis is still available.',
      };
    }

    return {
      insights: validatedData,
      source: 'gemini_api',
    };
  } catch (err: any) {
    const fallback = generateDeterministicFallbackInsights(report, dataLayer);
    return {
      insights: fallback,
      source: 'deterministic_fallback',
      errorWarning: 'AI insights are temporarily unavailable.',
    };
  }
}
