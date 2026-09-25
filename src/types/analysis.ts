export type AnalysisSourceType = 'manual' | 'upload' | 'demo';

export interface DataSourceIndicatorInfo {
  type: AnalysisSourceType;
  label: string;
  recordCount: number;
  isActive: boolean;
  details: string;
}

export interface UnifiedDataSourceSummary {
  sources: DataSourceIndicatorInfo[];
  activeSourceCount: number;
  summaryText: string;
  primarySourceName: string;
  hasManual: boolean;
  hasUpload: boolean;
  hasDemo: boolean;
}

export interface NormalizedTransaction {
  id: string;
  date: string | null;
  product: string;
  category: string | null;
  unitsSold: number | null;
  unitPrice: number | null;
  revenue: number | null;
  cost: number | null;
  margin: number | null;
  customer: string | null;
  customerType: string | null;
  channel: string | null;
  region: string | null;
  paymentStatus: string | null;
  source: AnalysisSourceType;
}

export interface NormalizedProduct {
  id: string;
  name: string;
  category: string | null;
  costPrice: number | null;
  sellingPrice: number | null;
  unitMargin: number | null;
  currentStock: number | null;
  minStockLevel: number | null;
  supplier: string | null;
  status: string | null;
  source: AnalysisSourceType;
}

export interface NormalizedExpense {
  id: string;
  date: string | null;
  category: string;
  description: string;
  amount: number;
  paymentStatus: string | null;
  source: AnalysisSourceType;
}

export interface NormalizedCustomer {
  id: string;
  name: string;
  type: string | null;
  location: string | null;
  contactInfo: string | null;
  source: AnalysisSourceType;
}

export interface NormalizedOrder {
  id: string;
  orderId: string;
  date: string | null;
  customer: string;
  quantity: number | null;
  orderValue: number | null;
  orderStatus: string | null;
  paymentStatus: string | null;
  source: AnalysisSourceType;
}

export interface UnifiedBusinessDataLayer {
  dataSourceSummary: UnifiedDataSourceSummary;
  transactions: NormalizedTransaction[];
  products: NormalizedProduct[];
  expenses: NormalizedExpense[];
  customers: NormalizedCustomer[];
  orders: NormalizedOrder[];
  availableDateRange: {
    startDate: string | null;
    endDate: string | null;
    totalDays: number;
  };
}

export type SufficiencyState = 'Ready' | 'Partially Ready' | 'Insufficient Data';

export interface DataSufficiencyReport {
  state: SufficiencyState;
  summary: string;
  reasons: string[];
  supportedAnalyses: string[];
  unsupportedAnalyses: {
    name: string;
    missingRequirement: string;
  }[];
}

export interface SupportedMetricValue<T = number> {
  value: T | null;
  formatted: string;
  isSupported: boolean;
  insufficientReason?: string;
  evidence?: string;
}

export interface UnifiedKeyMetrics {
  revenue: SupportedMetricValue<number>;
  salesTransactionCount: SupportedMetricValue<number>;
  unitsSold: SupportedMetricValue<number>;
  averageOrderValue: SupportedMetricValue<number>;
  averageSellingPrice: SupportedMetricValue<number>;
  totalCosts: SupportedMetricValue<number>;
  totalExpenses: SupportedMetricValue<number>;
  potentialGrossMargin: SupportedMetricValue<number> & { marginPct: number | null };
  revenueExpenseDifference: SupportedMetricValue<number> & { note: string };
  inventoryLevels: SupportedMetricValue<number>;
  lowStockItemsCount: SupportedMetricValue<number>;
  outOfStockItemsCount: SupportedMetricValue<number>;
  customerCount: SupportedMetricValue<number>;
  orderCount: SupportedMetricValue<number>;
  productCount: SupportedMetricValue<number>;
}

export interface TimeTrendDataPoint {
  period: string;
  revenue: number;
  units: number;
  transactionCount: number;
}

export interface TimeAnalysisResult {
  isAvailable: boolean;
  reasonIfNotAvailable?: string;
  startDate: string | null;
  endDate: string | null;
  periodCount: number;
  grouping: 'Daily' | 'Weekly' | 'Monthly';
  trendDirection: 'increasing' | 'decreasing' | 'stable' | 'high_variation';
  dataPoints: TimeTrendDataPoint[];
  observation: string;
  interpretation: string;
  evidence: string;
}

export interface ProductRankingItem {
  product: string;
  category: string;
  revenue: number;
  unitsSold: number;
  revenueSharePct: number;
  unitSharePct: number;
  averagePrice: number;
}

export interface ProductAnalysisResult {
  isAvailable: boolean;
  reasonIfNotAvailable?: string;
  totalProductsAnalyzed: number;
  topByRevenue: ProductRankingItem[];
  topByUnits: ProductRankingItem[];
  lowestRecordedSales: ProductRankingItem[];
  revenueConcentrationPct: number; // Top 1 product share
  categoryBreakdown: {
    category: string;
    revenue: number;
    units: number;
    sharePct: number;
  }[];
  observation: string;
  interpretation: string;
}

export interface InventoryAnalysisResult {
  isAvailable: boolean;
  reasonIfNotAvailable?: string;
  totalCatalogItems: number;
  totalStockUnits: number;
  lowStockItems: {
    product: string;
    currentStock: number;
    buffer: number;
    salesUnits?: number;
  }[];
  outOfStockItems: {
    product: string;
    buffer: number;
  }[];
  imbalances: {
    product: string;
    currentStock: number;
    salesVolume: number;
    type: 'high_inventory_low_sales' | 'low_inventory_high_sales' | 'potential_imbalance';
    observation: string;
    interpretation: string;
  }[];
  observation: string;
  interpretation: string;
}

export interface CustomerAnalysisResult {
  isAvailable: boolean;
  reasonIfNotAvailable?: string;
  customerCount: number;
  typeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  topCustomersByRevenue: {
    customer: string;
    revenue: number;
    transactionCount: number;
    revenueSharePct: number;
  }[];
  observation: string;
  interpretation: string;
}

export interface ExpenseAnalysisResult {
  isAvailable: boolean;
  reasonIfNotAvailable?: string;
  totalExpenses: number | null;
  byCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  largestCategory: {
    category: string;
    amount: number;
    percentage: number;
  } | null;
  revenueExpenseComparison: {
    revenue: number | null;
    expenses: number | null;
    difference: number | null;
    differenceFormatted: string;
    hasBoth: boolean;
    note: string;
  };
  observation: string;
  interpretation: string;
}

export interface ObservedFindingItem {
  id: string;
  topic: string;
  fact: string;
  evidence: string;
  category: 'sales' | 'products' | 'inventory' | 'expenses' | 'customers' | 'time';
}

export interface DataBasedInterpretationItem {
  id: string;
  topic: string;
  interpretation: string;
  groundedInObservationId: string;
  evidenceRef: string;
  reviewUrgency: 'routine' | 'monitor' | 'action_needed';
}

export interface AreaToReviewItem {
  id: string;
  title: string;
  evidence: string;
  riskSeverity: 'low' | 'medium' | 'high';
  reviewAction: string;
}

export interface BusinessAnalysisSummary {
  dataAvailable: string[];
  keyMetricsSummary: {
    label: string;
    value: string;
    isSupported: boolean;
  }[];
  observedPatterns: {
    title: string;
    evidence: string;
  }[];
  areasToReview: AreaToReviewItem[];
  unavailableAnalyses: {
    title: string;
    missingRequirement: string;
    impact: string;
  }[];
}

export interface UnifiedBusinessAnalysisReport {
  dataSourceSummary: UnifiedDataSourceSummary;
  sufficiency: DataSufficiencyReport;
  keyMetrics: UnifiedKeyMetrics;
  timeAnalysis: TimeAnalysisResult;
  salesAnalysis: {
    isAvailable: boolean;
    totalSales: number | null;
    patterns: {
      title: string;
      evidence: string;
      interpretation: string;
    }[];
    byRegion: { region: string; revenue: number; sharePct: number }[] | null;
    byCustomerType: { customerType: string; revenue: number; sharePct: number }[] | null;
  };
  productAnalysis: ProductAnalysisResult;
  inventoryAnalysis: InventoryAnalysisResult;
  customerAnalysis: CustomerAnalysisResult;
  expenseAnalysis: ExpenseAnalysisResult;
  observedFindings: ObservedFindingItem[];
  dataBasedInterpretations: DataBasedInterpretationItem[];
  areasToReview: AreaToReviewItem[];
  summary: BusinessAnalysisSummary;
  aiInterpretationPlaceholder: {
    status: 'scheduled_step_7' | 'active_step_7';
    model: string;
    description: string;
  };
}

export type AiInsightCategory =
  | 'Sales'
  | 'Products'
  | 'Customers'
  | 'Inventory'
  | 'Expenses'
  | 'Operations'
  | 'Growth';

export interface GeminiKeyInsight {
  category: AiInsightCategory;
  title: string;
  evidence: string;
  interpretation: string;
  importance: string;
  data_limitation?: string;
}

export interface GeminiAreaToReview {
  category: AiInsightCategory;
  issue: string;
  evidence: string;
  possible_reason: string;
  consider_reviewing?: string;
}

export interface GeminiOpportunity {
  category: AiInsightCategory;
  opportunity: string;
  evidence: string;
  possible_action: string;
}

export interface RecommendedAnalysisMethod {
  id: string;
  methodName: string;
  triggerCondition: string;
  potentialBenefit: string;
  applicableData: string;
  isTriggered: boolean;
  statusBadge: string;
  complexity: 'Low' | 'Medium' | 'Advanced';
}

export interface GeminiAiInsightsResponse {
  summary: string;
  key_insights: GeminiKeyInsight[];
  areas_to_review: GeminiAreaToReview[];
  opportunities: GeminiOpportunity[];
  data_limitations: string[];
}

export interface GenerateInsightsPayload {
  businessLevel: string;
  businessType: string;
  locale: string;
  localeCode: string;
  dataSources: {
    summary: string;
    totalRecords: number;
    sourcesActive: string[];
    sufficiencyStatus: string;
    missingFields: string[];
  };
  metrics: {
    revenue: string;
    expenses: string;
    netDifference: string;
    orderCount: string;
    productCount: string;
    customerCount: string;
    lowStockCount: string;
    outOfStockCount: string;
  };
  patterns: {
    salesVelocity: string;
    topProducts: string[];
    lowestProducts: string[];
    topCategories: string[];
    regionalBreakdown: string[];
    inventoryImbalances: string[];
    expenseBreakdown: string[];
  };
  businessAlerts: {
    title: string;
    evidence: string;
    interpretation: string;
    type: string;
  }[];
  dataQualityWarnings: string[];
}

export type DataSufficiencyLevel = 'Sufficient' | 'Partially Sufficient' | 'Insufficient';

export type HumanDecisionStatus = 'pending' | 'reviewed' | 'accepted' | 'modified' | 'rejected';

export interface AimlRecommendationItem {
  id: string;
  domain: 'Demand Forecasting' | 'Customer Segmentation' | 'Product Recommendation' | 'Customer Communication' | 'Unusual Transactions' | 'Sales / Business Relationships';
  problemDetected: string;
  evidence: string;
  recommendedMethod: 'Time-Series Forecasting' | 'K-Means Clustering' | 'Collaborative Filtering / Ranking' | 'NLP / LLM' | 'Anomaly Detection' | 'Regression';
  alternativeMethod?: string;
  whyItFits: string;
  requiredData: string;
  expectedOutput: string;
  possibleBusinessUse: string;
  dataSufficiency: DataSufficiencyLevel;
  sufficiencyDetails: string;
  missingDataRequired?: string;
  limitations: string[];
  simpleExplanation: string;
  applicableLevel: ('local_village' | 'city_growing' | 'international_enterprise')[];
  complexity: 'Low' | 'Medium' | 'Advanced';
  humanDecisionRequired: string;
  decisionStatus: HumanDecisionStatus;
  decisionNotes?: string;
}

export interface HowAiCouldHelpItem {
  id: string;
  currentChallenge: string;
  recommendedMethod: string;
  couldAnalyze: string;
  expectedInsight: string;
  businessUse: string;
}

