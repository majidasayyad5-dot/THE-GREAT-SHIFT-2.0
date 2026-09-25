import localCommerceArtisan from './images/local_commerce_artisan_1790329499957.jpg';
import businessDataAnalytics from './images/business_data_analytics_1790329524019.jpg';
import cityGrowingBusiness from './images/city_growing_business_1790329537127.jpg';
import globalCommerceTrade from './images/global_commerce_trade_1790329550500.jpg';

export interface EditorialSlide {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  metricHighlight: string;
  levelBadge: string;
}

export const HERO_EDITORIAL_SLIDES: EditorialSlide[] = [
  {
    id: 'local',
    image: localCommerceArtisan,
    tag: 'LOCAL COMMERCE · LEVEL 1',
    title: 'Organize Daily Shop Ledgers',
    subtitle: 'Track physical stock, supplier receipts, and customer sales without complex software.',
    metricHighlight: 'Inventory & Cashflow Visibility',
    levelBadge: 'Access Focus',
  },
  {
    id: 'analytics',
    image: businessDataAnalytics,
    tag: 'DATA INTELLIGENCE · VERIFIED',
    title: 'Turn Records into Clear Evidence',
    subtitle: 'Deterministic calculation eliminates guesswork: sales velocity, profit margins, and SKU Pareto.',
    metricHighlight: 'Deterministic Quality Engine',
    levelBadge: 'No Hallucinations',
  },
  {
    id: 'city',
    image: cityGrowingBusiness,
    tag: 'GROWING BUSINESS · LEVEL 2',
    title: 'Scale Urban Retail & Commerce',
    subtitle: 'Cluster repeat customers, forecast seasonal demand buffers, and eliminate stockouts.',
    metricHighlight: 'Time-Series & K-Means ML',
    levelBadge: 'Intelligence Focus',
  },
  {
    id: 'global',
    image: globalCommerceTrade,
    tag: 'GLOBAL TRADE · LEVEL 3',
    title: 'Multi-Market Trade & Operations',
    subtitle: 'Coordinate suppliers, currency exchanges, and cross-regional distribution with human oversight.',
    metricHighlight: 'Multi-Currency & Governance',
    levelBadge: 'Scale Focus',
  },
];

export const EDITORIAL_ASSETS = {
  localCommerceArtisan,
  businessDataAnalytics,
  cityGrowingBusiness,
  globalCommerceTrade,
};
