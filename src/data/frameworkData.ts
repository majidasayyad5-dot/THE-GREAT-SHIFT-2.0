import { BusinessLevel, FrameworkStage, DataIngestionSpec } from '../types/bi';

export const BUSINESS_LEVELS: BusinessLevel[] = [
  {
    id: 'local_village',
    name: 'LOCAL / VILLAGE',
    shortName: 'Local / Village',
    tagline: 'Local markets, micro-enterprises & community commerce',
    description: 'Businesses operating mainly in a local market that may need better access to digital records, business information, inventory tracking, customer information and basic analysis.',
    businessExamples: [
      'Independent grocery stores & local merchant stalls',
      'Artisan clothing workshops & handloom producers',
      'Rural agricultural trade cooperatives & produce points',
      'Neighborhood bakeries, fabric tailors & repair shops'
    ],
    characteristics: [
      'Cash, ledger, or mobile wallet transactional data',
      'Hyperlocal customer relationships and seasonal demand peaks',
      'Constrained working capital and minimal digital footprint',
      'Direct-to-consumer or intermediary village merchant networks'
    ],
    typicalConstraints: [
      'Data fragmentation across paper or unstandardized notebooks',
      'Limited access to institutional trade credit',
      'Dependence on local distributor price volatility'
    ],
    accessFoci: [
      'Market price transparency & fair valuation',
      'Digital payment acceptance & micro-working capital',
      'Direct buyer linkage bypassing predatory middlemen'
    ],
    intelligenceFoci: [
      'Dynamic inventory turnover & spoilage forecasting',
      'Customer creditworthiness without formal bureau history',
      'Seasonal local demand pattern recognition'
    ],
    scaleFoci: [
      'Aggregation cooperatives & bulk purchasing leverage',
      'Regional hub distribution & transport sharing',
      'Digital cataloging for broader market discovery'
    ]
  },
  {
    id: 'city_growing',
    name: 'CITY / GROWING',
    shortName: 'City / Growing',
    tagline: 'SMEs, regional retailers & urban multi-channel commerce',
    description: 'Businesses operating at a larger scale that may need sales analysis, demand forecasting, inventory analysis, customer segmentation, product performance analysis and operational insights.',
    businessExamples: [
      'Multi-branch urban fashion boutiques & apparel labels',
      'Regional food & beverage retail chains',
      'Specialty hardware & lifestyle product distributors',
      'Fast-growing omnichannel e-commerce brands'
    ],
    characteristics: [
      'Multi-channel transactions (POS, e-commerce, B2B invoicing)',
      'Departmental structures (sales, operations, accounting, inventory)',
      'Substantial customer transaction volume across urban demographics',
      'Active competition within regional and digital marketplaces'
    ],
    typicalConstraints: [
      'Siloed software tools (POS separated from ERP or spreadsheets)',
      'Working capital lockup in slow-moving SKU inventory',
      'Rising customer acquisition costs and margin compression'
    ],
    accessFoci: [
      'Omnichannel integration & customer identity resolution',
      'Alternative asset-backed & invoice financing facilities',
      'Regional supplier direct bidding & dynamic pricing'
    ],
    intelligenceFoci: [
      'SKU-level elastic demand modeling & margin optimization',
      'Customer lifetime value (LTV) and churn early warning',
      'Operational capacity bottleneck diagnostics'
    ],
    scaleFoci: [
      'Automated replenishment triggers & warehouse zoning',
      'Targeted algorithmic marketing & personalization',
      'Franchise / branch performance benchmarking'
    ]
  },
  {
    id: 'international_global',
    name: 'INTERNATIONAL / GLOBAL',
    shortName: 'International / Global',
    tagline: 'Cross-border commerce, multinational supply networks & digital platforms',
    description: 'Businesses operating across larger markets that may need analysis across regions, countries, currencies, markets, customers and larger datasets.',
    businessExamples: [
      'Cross-border textile, garment & apparel export houses',
      'Multinational wholesale trade networks & logistics hubs',
      'Multi-currency global e-commerce and retail platforms',
      'International consumer goods manufacturing conglomerates'
    ],
    characteristics: [
      'Multi-currency, multi-tax jurisdiction financial ledger streams',
      'Complex multi-tiered global vendor & freight networks',
      'Strict regulatory compliance, ESG reporting, and data sovereignty',
      'Decentralized regional business units with executive oversight'
    ],
    typicalConstraints: [
      'Cross-border customs and freight transit volatility',
      'Currency exchange slippage and hedging complexities',
      'Organizational friction in executing executive decisions at scale'
    ],
    accessFoci: [
      'Global liquidity pools, trade credit & automated customs clearing',
      'Direct cross-border localized payment gateway rails',
      'Decentralized global supplier discovery & audit trail'
    ],
    intelligenceFoci: [
      'Predictive geopolitical & multimodal supply disruption models',
      'Dynamic global FX hedging & multi-market price elasticity',
      'Automated cross-border transfer pricing & tax optimization'
    ],
    scaleFoci: [
      'Autonomous global inventory redistribution routing',
      'Enterprise algorithmic governance & compliance automation',
      'Multi-market localized expansion playbooks'
    ]
  }
];

export const FRAMEWORK_STAGES: FrameworkStage[] = [
  {
    pillar: 'access',
    title: 'Pillar I: ACCESS',
    description: 'Democratizing foundational business infrastructure, capital pipelines, market connections, and structured data ingestion.',
    coreObjective: 'Establish uninterrupted, verifiable conduits to liquidity, raw materials, customers, and data assets.',
    commerceFocus: 'Bypassing asymmetric gatekeepers, lowering customer acquisition frictions, and unlocking direct market visibility.',
    managementFocus: 'Ingesting verified operational inputs, breaking department silos, and establishing clean data governance.'
  },
  {
    pillar: 'intelligence',
    title: 'Pillar II: INTELLIGENCE',
    description: 'Transforming raw operational transactional telemetry into rigorous diagnostic insights and predictive models.',
    coreObjective: 'Uncover hidden margin leakages, demand shifts, operational bottlenecks, and unit economic realities.',
    commerceFocus: 'Real-time price elasticity, predictive churn suppression, and customer lifetime value optimization.',
    managementFocus: 'Root-cause anomaly identification, working capital velocity diagnostics, and data-backed trade-off analysis.'
  },
  {
    pillar: 'scale',
    title: 'Pillar III: SCALE',
    description: 'Translating validated intelligence into systematic, repeatable operational leverage and market expansion.',
    coreObjective: 'Achieve non-linear commercial expansion where operational capacity multiplies without proportional cost growth.',
    commerceFocus: 'Multi-territory replication, algorithmic procurement advantage, and self-reinforcing network effects.',
    managementFocus: 'Autonomous orchestration pipelines, institutionalized playbook execution, and human executive oversight.'
  }
];

export const SUPPORTED_INGESTION_SPECS: DataIngestionSpec[] = [
  {
    format: 'csv',
    label: 'CSV Data Stream',
    extension: '.csv',
    mimeType: 'text/csv',
    description: 'Delimited transactional records, sales logs, general ledger exports, and tabular time-series.',
    typicalSources: 'POS systems, Square, Stripe, Shopify exports, bank statements',
    readinessStatus: 'ready_for_ingestion'
  },
  {
    format: 'xlsx',
    label: 'Excel Workbook (XLSX)',
    extension: '.xlsx, .xls',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    description: 'Multi-sheet operational workbooks, P&L statements, inventory balance sheets, and budget forecasts.',
    typicalSources: 'QuickBooks, Xero, ERP system dumps, enterprise financial models',
    readinessStatus: 'ready_for_ingestion'
  },
  {
    format: 'pdf',
    label: 'PDF Document / Statement',
    extension: '.pdf',
    mimeType: 'application/pdf',
    description: 'Commercial invoices, tax filings, trade credit bills, vendor contracts, and bank statement scans.',
    typicalSources: 'Scanned invoices, utility statements, customs bills, supplier quotes',
    readinessStatus: 'ready_for_ingestion'
  },
  {
    format: 'json',
    label: 'JSON Payload / API Dump',
    extension: '.json',
    mimeType: 'application/json',
    description: 'Hierarchical payload records, e-commerce cart events, webhook logs, and platform API dumps.',
    typicalSources: 'E-commerce API webhooks, modern SaaS databases, custom CRM feeds',
    readinessStatus: 'ready_for_ingestion'
  }
];

export const QUALITY_VERIFICATION_RULES = [
  {
    id: 'schema_conformance',
    name: 'Schema Conformance & Typing',
    target: 'Columns & Primitive Types',
    description: 'Validates that date fields, currency values, SKU identifiers, and quantities follow strict canonical data types.'
  },
  {
    id: 'null_completeness',
    name: 'Null & Sparsity Detection',
    target: 'Required Transaction Attributes',
    description: 'Audits missing values across vital transactional dimensions (order value, timestamp, customer/product ID).'
  },
  {
    id: 'temporal_continuity',
    name: 'Chronological Integrity',
    target: 'Time Series Continuity',
    description: 'Identifies reporting gaps, skipped accounting cycles, future timestamps, and timezone discrepancies.'
  },
  {
    id: 'outlier_boundaries',
    name: 'Statistical Anomaly Screening',
    target: 'Values Beyond 3.5σ Bounds',
    description: 'Flags anomalous spikes, duplicate order IDs, negative price anomalies, and test transactions.'
  },
  {
    id: 'cardinality_integrity',
    name: 'Relational Entity Integrity',
    target: 'Foreign Key & Category Mapping',
    description: 'Verifies consistent categorization, resolves duplicate customer aliases, and checks SKU inventory references.'
  }
];

export const RECOMMENDED_AI_ML_ARCHETYPES = [
  {
    id: 'arch_demand_forecasting',
    pillar: 'intelligence' as const,
    name: 'Time-Series Demand Forecasting',
    technique: 'Prophet / LightGBM / Temporal Fusion Transformer',
    businessProblem: 'Inventory stockouts, dead capital in overstocked items, and unpredictable seasonal swings.',
    evidence: 'Weekly sales logs show fluctuating order volume with safety buffer depletion on fast-moving products.',
    possibleAction: 'Adjust reorder points and safety stock levels for the top 20% highest-velocity products.',
    commerceImpact: 'Optimizes order reorder points; reduces stockout frequency while decreasing holding storage expense.',
    readinessLevel: 'High (Requires standard dated sales series)'
  },
  {
    id: 'arch_price_elasticity',
    pillar: 'access' as const,
    name: 'Price Elasticity & Margin Protection',
    technique: 'Econometric Regression & Reinforcement Bandits',
    businessProblem: 'Static flat pricing leading to compressed gross margins during supplier price changes.',
    evidence: 'Margin variations across catalog categories show high-demand SKUs can absorb a modest 3-4% price revision.',
    possibleAction: 'Test targeted price adjustments on core high-demand SKUs while discounting slow-moving inventory.',
    commerceImpact: 'Identifies optimal price curves per product cluster to maximize gross margin without deterring volume.',
    readinessLevel: 'Medium (Requires price and unit volume variance)'
  },
  {
    id: 'arch_churn_prevention',
    pillar: 'intelligence' as const,
    name: 'Customer Retention & Account Early-Warning',
    technique: 'Survival Analysis & Gradient Boosted Decision Trees',
    businessProblem: 'Silent customer defections noticed only after accounts have been inactive for multiple quarters.',
    evidence: 'Recorded order histories show previously consistent customer accounts have missed their regular replenishment cycle.',
    possibleAction: 'Initiate direct customer contact with volume check-ins or customized reorder reminders.',
    commerceImpact: 'Surfaces pre-churn behavior shifts allowing human account managers to intervene proactively.',
    readinessLevel: 'High (Requires customer transaction histories)'
  },
  {
    id: 'arch_procurement_clustering',
    pillar: 'scale' as const,
    name: 'Supplier Disruption & Cost Optimization',
    technique: 'Graph Neural Networks & Multi-Factor Risk Clustering',
    businessProblem: 'Single-source vendor vulnerabilities, hidden price inflation across regional suppliers.',
    evidence: 'Over 80% of core supplies originate from a single distributor with rising delivery lead times.',
    possibleAction: 'Engage a secondary backup supplier and split 20% of replenishment orders to mitigate supply risk.',
    commerceImpact: 'Identifies co-purchasing synergies, multi-vendor hedging, and cost variance anomalies.',
    readinessLevel: 'Medium (Requires vendor line item invoices)'
  }
];
