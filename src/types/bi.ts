export type NavSection =
  | 'dashboard'
  | 'my_business'
  | 'manage_affairs'
  | 'analyze'
  | 'data'
  | 'insights'
  | 'charts'
  | 'recommendations'
  | 'impact'
  | 'decision'
  | 'methodology'
  | 'settings';

export type SupportedLocale =
  | 'en'
  | 'hi'
  | 'mr'
  | 'gu'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'ur';

export interface LanguageOption {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction?: 'ltr' | 'rtl';
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessLevel: BusinessLevelId;
  location: string;
  primaryOfferings: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  authProvider: 'google' | 'session';
  email: string;
  name: string;
  photoUrl?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  product: string;
  customer: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
  totalAmount: number; // quantity * sellingPrice - discount
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  salesChannel: string;
  notes?: string;
  createdAt: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  unitMargin: number; // sellingPrice - costPrice
  currentStock: number;
  minStockLevel: number;
  supplier?: string;
  status: 'Active' | 'Discontinued' | 'Out of Stock';
  createdAt: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface CustomerRecord {
  id: string;
  name: string;
  type: 'Individual' | 'Business' | 'Other';
  location: string;
  contactInfo: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Inventory'
  | 'Rent'
  | 'Utilities'
  | 'Marketing'
  | 'Transport'
  | 'Salaries'
  | 'Technology'
  | 'Other';

export interface ExpenseRecord {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending';
  notes?: string;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
export type OrderPaymentStatus = 'Pending' | 'Paid' | 'Partially Paid';

export interface OrderRecord {
  id: string;
  orderId: string;
  date: string;
  customer: string;
  products: string;
  quantity: number;
  orderValue: number;
  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  category?: string;
  productsSupplied?: string;
  contactPerson?: string;
  location?: string;
  contactInfo: string;
  leadTime?: string;
  paymentTerms: string;
  notes?: string;
  createdAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TaskRecord {
  id: string;
  title?: string;
  task?: string;
  category?: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  notes?: string;
  createdAt: string;
}

export type DocumentType =
  | 'License'
  | 'Invoice'
  | 'Tax Document'
  | 'Contract'
  | 'Certificate'
  | 'Other';

export type DocumentCategory =
  | 'Invoices'
  | 'Receipts'
  | 'Reports'
  | 'Agreements'
  | 'Business Records'
  | 'Other';

export interface DocumentRecord {
  id: string;
  title?: string;
  name?: string;
  type?: DocumentType;
  category?: DocumentCategory | string;
  dateAdded?: string;
  issueDate?: string;
  expiryDate?: string;
  documentNumber?: string;
  status?: 'Active' | 'Archived' | 'Pending Review';
  notes?: string;
  fileSizeFormatted?: string;
  createdAt: string;
}

export interface BusinessAffairsData {
  sales: SaleRecord[];
  products: ProductRecord[];
  customers: CustomerRecord[];
  expenses: ExpenseRecord[];
  orders: OrderRecord[];
  suppliers: SupplierRecord[];
  tasks: TaskRecord[];
  documents: DocumentRecord[];
}

export interface AffairRecord {
  id: string;
  module: 'sales' | 'products' | 'inventory' | 'customers' | 'expenses' | 'orders' | 'suppliers' | 'employees' | 'tasks' | 'documents';
  title: string;
  subtitle?: string;
  amount?: number;
  quantity?: number;
  status?: string;
  date: string;
  tags?: string[];
  notes?: string;
}

export type BusinessLevelId = 'local_village' | 'city_growing' | 'international_global';

export interface BusinessLevel {
  id: BusinessLevelId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  businessExamples: string[];
  characteristics: string[];
  typicalConstraints: string[];
  accessFoci: string[];
  intelligenceFoci: string[];
  scaleFoci: string[];
}

export type FrameworkPillar = 'access' | 'intelligence' | 'scale';

export interface FrameworkStage {
  pillar: FrameworkPillar;
  title: string;
  description: string;
  coreObjective: string;
  commerceFocus: string;
  managementFocus: string;
}

export type FileFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

export interface DataIngestionSpec {
  format: FileFormat;
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  typicalSources: string;
  readinessStatus: 'ready_for_ingestion' | 'awaiting_file';
}

export interface MetricPlaceholder {
  id: string;
  label: string;
  pillar: FrameworkPillar;
  description: string;
  unit: string;
}

export interface AIRecommendationArchetype {
  id: string;
  category: FrameworkPillar;
  title: string;
  technique: string;
  businessProblem: string;
  solutionArchetype: string;
  applicableLevels: BusinessLevelId[];
}

export interface HumanDecisionLog {
  id: string;
  title: string;
  recommendationRef: string;
  aiRationale: string;
  status: 'pending_review' | 'approved' | 'modified' | 'rejected';
  humanSignOffNotes: string;
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  timestamp?: string;
}

export type RecommendationDecisionStatus = 'New' | 'Under Review' | 'Accepted' | 'Modified' | 'Rejected';
export type DecisionActionType = 'review' | 'accept' | 'modify' | 'reject';

export interface HumanDecisionRecord {
  id: string;
  recommendationId: string;
  recommendationTitle: string;
  businessIssue: string;
  evidence: string;
  possibleAction: string;
  decision: RecommendationDecisionStatus;
  decisionAction: DecisionActionType;
  date: string;
  timestamp: string;
  reviewNote?: string;
  nextReviewDate?: string;
  decisionNote?: string;
  originalRecommendation?: string;
  modifiedDecision?: string;
  modificationReason?: string;
  rejectionReason?: string;
}

export interface ColumnQualityReport {
  name: string;
  detectedType: 'Date' | 'Number' | 'Currency/Amount' | 'Text' | 'Category' | 'Boolean' | 'Unknown';
  nonEmptyCount: number;
  missingCount: number;
  missingPct: number;
  uniqueCount: number;
  status: 'Good' | 'Needs Review' | 'Problem';
  statusReason: string;
  sampleValues: any[];
}

export interface BusinessFieldDetection {
  key: string;
  label: string;
  matchedColumn?: string;
  isDetected: boolean;
}

export interface DataQualityReport {
  datasetId: string;
  analyzedAt: string;
  totalRecords: number;
  totalFields: number;
  totalCells: number;
  missingValuesCount: number;
  missingValuesPct: number;
  duplicateRecordsCount: number;
  duplicateRecordsPct: number;
  dateCoverage: {
    minDate: string;
    maxDate: string;
    rangeDays?: number;
    formatted: string;
  } | null;
  numericFieldsCount: number;
  dataCompletenessPct: number;
  overallStatus: 'Good' | 'Needs Review' | 'Problem';
  statusReason: string;
  columns: ColumnQualityReport[];
  businessFieldsDetected: BusinessFieldDetection[];
  readinessExplanation: string[];
  canContinueToAnalysis: boolean;
  missingRequirementsMessage?: string;
  warnings: string[];
}

export interface IngestedDataset {
  id: string;
  sourceType: 'upload' | 'demo';
  fileName: string;
  fileType: string;
  fileSizeFormatted: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  records: Record<string, any>[];
  uploadTimestamp: string;
  isFictionalDemo?: boolean;
  status: 'staged' | 'processed';
  pdfNotice?: string;
  qualityReport?: DataQualityReport;
}

export * from './analysis';
