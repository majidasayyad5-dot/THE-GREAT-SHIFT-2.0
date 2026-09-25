import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavSection, BusinessLevelId, BusinessAffairsData, IngestedDataset } from '../../types/bi';
import { AffairTab } from '../views/ManageAffairsView';
import {
  Search,
  LayoutDashboard,
  Building2,
  Briefcase,
  BarChart3,
  Database,
  Lightbulb,
  LineChart,
  Target,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Settings,
  Sparkles,
  ArrowRight,
  Package,
  ShoppingCart,
  Users,
  Receipt,
  Truck,
  CheckSquare,
  FileText,
  UploadCloud,
  X,
  MessageSquare,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'PAGES' | 'DATA' | 'INSIGHTS' | 'ACTIONS' | 'HELP';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  action: () => void;
  keywords?: string[];
}

interface GlobalSearchBarProps {
  onNavigate: (section: NavSection, affairTab?: AffairTab) => void;
  onStartAshaDemo?: () => void;
  onOpenAssistant?: (initialQuery?: string) => void;
  businessAffairs?: BusinessAffairsData;
  activeDataset?: IngestedDataset | null;
  placeholder?: string;
  className?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onNavigate,
  onStartAshaDemo,
  onOpenAssistant,
  businessAffairs,
  activeDataset,
  placeholder = 'Search anything… (e.g. inventory, sales, Asha demo, upload data)',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Build indexed items across Pages, Data, Insights, Actions, and Help
  const searchIndex: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [
      // PAGES
      {
        id: 'page_dashboard',
        title: 'Dashboard',
        category: 'PAGES',
        icon: LayoutDashboard,
        description: 'Command center overview with verified metrics & health status',
        action: () => onNavigate('dashboard'),
        keywords: ['home', 'main', 'overview', 'summary', 'metrics', 'kpi'],
      },
      {
        id: 'page_my_business',
        title: 'My Business Profile',
        category: 'PAGES',
        icon: Building2,
        description: 'Edit business profile, scale tier, primary offerings & metadata',
        action: () => onNavigate('my_business'),
        keywords: ['profile', 'company', 'organization', 'tier', 'scale', 'industry'],
      },
      {
        id: 'page_manage_affairs',
        title: 'Manage Affairs',
        category: 'PAGES',
        icon: Briefcase,
        description: 'Unified records across Sales, Inventory, Customers, Expenses & Orders',
        action: () => onNavigate('manage_affairs'),
        keywords: ['operations', 'records', 'crud', 'manage', 'affairs', 'ledgers'],
      },
      {
        id: 'page_analyze',
        title: 'Analyze Business',
        category: 'PAGES',
        icon: BarChart3,
        description: 'Data ingestion studio & deterministic multi-source diagnostic engine',
        action: () => onNavigate('analyze'),
        keywords: ['analyze', 'upload', 'run', 'diagnostic', 'inspect', 'process'],
      },
      {
        id: 'page_data',
        title: 'Business Data & Quality',
        category: 'PAGES',
        icon: Database,
        description: 'Inspect uploaded datasets, column mapping, schema & completeness score',
        action: () => onNavigate('data'),
        keywords: ['dataset', 'tables', 'rows', 'columns', 'csv', 'xlsx', 'quality', 'missing'],
      },
      {
        id: 'page_insights',
        title: 'AI Insights & Findings',
        category: 'PAGES',
        icon: Lightbulb,
        description: 'Evidence-backed commercial findings separated from AI interpretation',
        action: () => onNavigate('insights'),
        keywords: ['insights', 'findings', 'patterns', 'revenue concentration', 'trends', 'gemini'],
      },
      {
        id: 'page_charts',
        title: 'Visual Charts & Trends',
        category: 'PAGES',
        icon: LineChart,
        description: 'Interactive analytics charts for revenue, SKU share & expense patterns',
        action: () => onNavigate('charts'),
        keywords: ['charts', 'graphs', 'visuals', 'plots', 'time series', 'breakdown'],
      },
      {
        id: 'page_recommendations',
        title: 'AI Recommendations',
        category: 'PAGES',
        icon: Target,
        description: 'Algorithmic ML archetypes matched strictly to verified data patterns',
        action: () => onNavigate('recommendations'),
        keywords: ['recommendations', 'machine learning', 'forecasting', 'clustering', 'k-means', 'nlp'],
      },
      {
        id: 'page_impact',
        title: 'Business Impact',
        category: 'PAGES',
        icon: TrendingUp,
        description: 'Operational efficiency & decision support assessment without fake ROI',
        action: () => onNavigate('impact'),
        keywords: ['impact', 'efficiency', 'roi', 'visibility', 'planning', 'outcomes'],
      },
      {
        id: 'page_decision',
        title: 'Human Decision Hub',
        category: 'PAGES',
        icon: ShieldCheck,
        description: 'Review, Accept, Modify, or Reject AI proposals with formal governance audit trail',
        action: () => onNavigate('decision'),
        keywords: ['decision', 'human review', 'accept', 'reject', 'audit', 'governance', 'signoff'],
      },
      {
        id: 'page_methodology',
        title: 'How It Works / Methodology',
        category: 'PAGES',
        icon: HelpCircle,
        description: 'The 5-step protocol: Business Data → Analysis → AI Insight → Recommendation → Human Decision',
        action: () => onNavigate('methodology'),
        keywords: ['how it works', 'methodology', 'framework', 'protocol', 'explain'],
      },
      {
        id: 'page_settings',
        title: 'Settings & Currencies',
        category: 'PAGES',
        icon: Settings,
        description: 'Configure global currency, language, account session & data resets',
        action: () => onNavigate('settings'),
        keywords: ['settings', 'preferences', 'currency', 'language', 'reset', 'logout'],
      },

      // DATA MODULES (Direct deep-links into Manage Affairs tabs)
      {
        id: 'data_sales',
        title: 'Sales Ledger',
        category: 'DATA',
        icon: DollarSign,
        description: 'Recorded sales transactions, product volumes, customer receipts',
        action: () => onNavigate('manage_affairs', 'sales'),
        keywords: ['sales', 'revenue', 'selling', 'turnover', 'income', 'transactions'],
      },
      {
        id: 'data_products',
        title: 'Product Catalog',
        category: 'DATA',
        icon: Package,
        description: 'Product SKUs, unit costs, selling prices, category breakdown',
        action: () => onNavigate('manage_affairs', 'products'),
        keywords: ['products', 'catalog', 'items', 'skus', 'goods', 'pricing'],
      },
      {
        id: 'data_inventory',
        title: 'Inventory & Stock Buffer',
        category: 'DATA',
        icon: Package,
        description: 'Stock on hand, safety stock thresholds, reorder warnings',
        action: () => onNavigate('manage_affairs', 'inventory'),
        keywords: ['inventory', 'stock', 'warehouse', 'stockout', 'safety buffer', 'reorder'],
      },
      {
        id: 'data_customers',
        title: 'Customer Directory',
        category: 'DATA',
        icon: Users,
        description: 'Client contacts, repeat purchase history, account classification',
        action: () => onNavigate('manage_affairs', 'customers'),
        keywords: ['customers', 'clients', 'buyers', 'directory', 'accounts', 'crm'],
      },
      {
        id: 'data_expenses',
        title: 'Operating Expenses',
        category: 'DATA',
        icon: Receipt,
        description: 'Track operational costs, rent, raw materials, logistics & utility expenses',
        action: () => onNavigate('manage_affairs', 'expenses'),
        keywords: ['expenses', 'costs', 'bills', 'utilities', 'overhead', 'spending', 'rent'],
      },
      {
        id: 'data_orders',
        title: 'Customer Orders',
        category: 'DATA',
        icon: ShoppingCart,
        description: 'Fulfillment queue, delivery status, order dates & amounts',
        action: () => onNavigate('manage_affairs', 'orders'),
        keywords: ['orders', 'fulfillment', 'shipments', 'deliveries', 'dispatch'],
      },
      {
        id: 'data_suppliers',
        title: 'Supplier Network',
        category: 'DATA',
        icon: Truck,
        description: 'Vendor contacts, lead times, materials supplied & reliability',
        action: () => onNavigate('manage_affairs', 'suppliers'),
        keywords: ['suppliers', 'vendors', 'distributors', 'procurement', 'sourcing'],
      },
      {
        id: 'data_tasks',
        title: 'Operational Tasks',
        category: 'DATA',
        icon: CheckSquare,
        description: 'Action items, business priority checklist, deadlines',
        action: () => onNavigate('manage_affairs', 'tasks'),
        keywords: ['tasks', 'todo', 'checklist', 'actions', 'reminders'],
      },
      {
        id: 'data_documents',
        title: 'Business Documents',
        category: 'DATA',
        icon: FileText,
        description: 'Attached invoices, certificates, contracts & compliance records',
        action: () => onNavigate('manage_affairs', 'documents'),
        keywords: ['documents', 'files', 'contracts', 'invoices', 'receipts', 'pdf'],
      },

      // ACTIONS
      {
        id: 'action_asha_demo',
        title: "Try Asha's Fictional Demo",
        category: 'ACTIONS',
        icon: Sparkles,
        description: 'Load fictional handmade apparel dataset to test full end-to-end intelligence',
        action: () => {
          if (onStartAshaDemo) {
            onStartAshaDemo();
          } else {
            onNavigate('analyze');
          }
        },
        keywords: ['asha', 'demo', 'fictional', 'sample', 'try', 'test', 'village', 'local'],
      },
      {
        id: 'action_analyze_now',
        title: 'Analyze My Business Data',
        category: 'ACTIONS',
        icon: BarChart3,
        description: 'Execute deterministic multi-source audit across records & uploaded files',
        action: () => onNavigate('analyze'),
        keywords: ['analyze', 'run', 'audit', 'diagnostic', 'compute'],
      },
      {
        id: 'action_upload_data',
        title: 'Upload Business Files (CSV, XLSX, JSON, PDF)',
        category: 'ACTIONS',
        icon: UploadCloud,
        description: 'Import sales or inventory spreadsheets with automatic column mapping',
        action: () => onNavigate('analyze'),
        keywords: ['upload', 'import', 'csv', 'xlsx', 'excel', 'json', 'pdf'],
      },
      {
        id: 'action_record_sale',
        title: 'Record a New Sale Transaction',
        category: 'ACTIONS',
        icon: DollarSign,
        description: 'Log new customer transaction into the deterministic sales ledger',
        action: () => onNavigate('manage_affairs', 'sales'),
        keywords: ['new sale', 'add sale', 'record transaction', 'sell'],
      },
      {
        id: 'action_log_expense',
        title: 'Log an Operating Expense',
        category: 'ACTIONS',
        icon: Receipt,
        description: 'Add overhead, utility, or supply chain expense with category tag',
        action: () => onNavigate('manage_affairs', 'expenses'),
        keywords: ['add expense', 'log cost', 'new bill', 'record spend'],
      },

      // INSIGHTS & DIAGNOSTICS
      {
        id: 'insight_revenue_concentration',
        title: 'Revenue Concentration Pattern',
        category: 'INSIGHTS',
        icon: Target,
        description: 'Evaluates if business revenue relies heavily on a single top SKU',
        action: () => onNavigate('insights'),
        keywords: ['revenue concentration', 'pareto', 'top product', 'sku risk', 'dependency'],
      },
      {
        id: 'insight_inventory_buffer',
        title: 'Inventory Imbalance & Buffer Diagnostic',
        category: 'INSIGHTS',
        icon: Package,
        description: 'Identifies fast-moving SKUs with stock depletion risk vs dormant items',
        action: () => onNavigate('insights'),
        keywords: ['inventory diagnostic', 'stockout', 'imbalance', 'dead stock'],
      },
      {
        id: 'insight_operating_margin',
        title: 'Revenue vs Operating Costs Balance',
        category: 'INSIGHTS',
        icon: TrendingUp,
        description: 'Compares recorded turnover against recorded overhead and supplies',
        action: () => onNavigate('insights'),
        keywords: ['margin', 'cost balance', 'burn rate', 'operating difference'],
      },

      // HELP TOPICS
      {
        id: 'help_how_to_upload',
        title: 'How to upload data properly?',
        category: 'HELP',
        icon: HelpCircle,
        description: 'Guidelines on acceptable CSV, XLSX, and JSON headers with sample templates',
        action: () => {
          if (onOpenAssistant) {
            onOpenAssistant('How do I upload data properly into the system?');
          } else {
            onNavigate('analyze');
          }
        },
        keywords: ['how to upload', 'format', 'columns', 'csv guide', 'template'],
      },
      {
        id: 'help_completeness',
        title: 'What does data completeness mean?',
        category: 'HELP',
        icon: HelpCircle,
        description: 'Deterministic quality score measuring missing cells, nulls, and schema validity',
        action: () => {
          if (onOpenAssistant) {
            onOpenAssistant('What does data completeness mean in THE GREAT SHIFT?');
          } else {
            onNavigate('data');
          }
        },
        keywords: ['completeness', 'missing values', 'quality score', 'validation'],
      },
      {
        id: 'help_methods',
        title: 'Understanding AI/ML Methods (Forecasting, Clustering, NLP)',
        category: 'HELP',
        icon: HelpCircle,
        description: 'Plain-English explanation of mathematical models recommended for your data',
        action: () => {
          if (onOpenAssistant) {
            onOpenAssistant('Explain the recommended AI and ML methods in simple terms.');
          } else {
            onNavigate('recommendations');
          }
        },
        keywords: ['methods', 'ai models', 'ml archetypes', 'time-series', 'clustering', 'k-means'],
      },
      {
        id: 'help_human_decision',
        title: 'The Human Decision Protocol',
        category: 'HELP',
        icon: ShieldCheck,
        description: 'Why AI never makes the final decision: AI analyzes, humans decide',
        action: () => {
          if (onOpenAssistant) {
            onOpenAssistant('Explain the Human Decision Protocol and why AI does not automate decisions.');
          } else {
            onNavigate('decision');
          }
        },
        keywords: ['human decision', 'governance', 'protocol', 'ai ethics', 'auditability'],
      },
    ];

    return items;
  }, [onNavigate, onStartAshaDemo, onOpenAssistant]);

  // Filtered Results with smart Natural Language intent matching
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    // Natural Language phrase intent matching
    if (trimmed.includes('show inventory') || trimmed === 'inventory') {
      return searchIndex.filter((item) => item.id === 'data_inventory' || item.id === 'insight_inventory_buffer');
    }
    if (trimmed.includes('analyze my sales') || trimmed.includes('analyze sales')) {
      return searchIndex.filter((item) => item.id === 'action_analyze_now' || item.id === 'data_sales');
    }
    if (trimmed.includes('upload data') || trimmed.includes('upload file') || trimmed.includes('import')) {
      return searchIndex.filter((item) => item.id === 'action_upload_data' || item.id === 'help_how_to_upload');
    }
    if (trimmed.includes('try asha') || trimmed.includes('asha demo') || trimmed === 'asha') {
      return searchIndex.filter((item) => item.id === 'action_asha_demo');
    }
    if (trimmed.includes('show recommendations') || trimmed.includes('recommendations')) {
      return searchIndex.filter((item) => item.id === 'page_recommendations');
    }
    if (trimmed.includes('how does this work') || trimmed.includes('how it works')) {
      return searchIndex.filter((item) => item.id === 'page_methodology' || item.id === 'help_human_decision');
    }

    // Token-based matching
    const queryTokens = trimmed.split(/\s+/).filter(Boolean);

    return searchIndex.filter((item) => {
      const fullText = `${item.title} ${item.description} ${(item.keywords || []).join(' ')} ${item.category}`.toLowerCase();
      return queryTokens.every((token) => fullText.includes(token));
    });
  }, [query, searchIndex]);

  // Group by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResultItem[]> = {
      PAGES: [],
      DATA: [],
      INSIGHTS: [],
      ACTIONS: [],
      HELP: [],
    };

    filteredResults.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });

    return groups;
  }, [filteredResults]);

  const handleSelect = (item: SearchResultItem) => {
    item.action();
    setIsOpen(false);
    setQuery('');
  };

  const handleAskAssistant = () => {
    if (onOpenAssistant) {
      onOpenAssistant(query);
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 sm:left-4 pointer-events-none text-slate-400">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-3.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl shadow-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all font-sans"
        />
        <div className="absolute right-3 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded font-semibold">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Instant Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-[460px] flex flex-col font-sans">
          {query.trim().length === 0 ? (
            // Default quick jump pills when input is empty
            <div className="p-4 bg-slate-50/70 border-b border-slate-100">
              <div className="text-[11px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2.5">
                POPULAR QUICK JUMPS
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (onStartAshaDemo) onStartAshaDemo();
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Try Asha's Demo
                </button>
                <button
                  onClick={() => {
                    onNavigate('analyze');
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  Upload Data
                </button>
                <button
                  onClick={() => {
                    onNavigate('manage_affairs', 'inventory');
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  Inventory
                </button>
                <button
                  onClick={() => {
                    onNavigate('recommendations');
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-slate-500" />
                  AI Recommendations
                </button>
                <button
                  onClick={() => {
                    onNavigate('decision');
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  Human Decision Hub
                </button>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="overflow-y-auto divide-y divide-slate-100 flex-1 p-2">
              {(['PAGES', 'DATA', 'INSIGHTS', 'ACTIONS', 'HELP'] as const).map((cat) => {
                const items = groupedResults[cat];
                if (!items || items.length === 0) return null;
                return (
                  <div key={cat} className="py-2 first:pt-0 last:pb-0">
                    <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      {cat}
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-teal-50/70 group flex items-start justify-between gap-3 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="p-1.5 rounded-md bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-700 shrink-0 mt-0.5 transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-teal-900 truncate">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-slate-100 group-hover:bg-teal-200/60 text-slate-500 group-hover:text-teal-800 rounded font-semibold shrink-0 mt-1">
                              {item.category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // No direct matches - prompt asking Assistant
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                No matching functions or pages found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Need guidance or want to analyze something specific?
              </p>
              {onOpenAssistant && (
                <button
                  onClick={handleAskAssistant}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#091124] text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                  Ask Assistant: &ldquo;{query}&rdquo;
                </button>
              )}
            </div>
          )}

          {/* Search + Chat Connection Footer */}
          {query.trim().length > 0 && onOpenAssistant && (
            <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Looking for analytical guidance on this?
              </span>
              <button
                onClick={handleAskAssistant}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Assistant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
