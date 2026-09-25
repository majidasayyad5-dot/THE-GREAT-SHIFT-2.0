import {
  BusinessAffairsData,
  ProductRecord,
  StockStatus,
  IngestedDataset,
} from '../types/bi';
import { analyzeDataQuality } from './dataQualityAnalyzer';

export interface AffairsDashboardMetrics {
  totalSales: number | null;
  totalExpenses: number | null;
  productCount: number | null;
  lowStockCount: number | null;
  outOfStockCount: number | null;
  pendingOrdersCount: number | null;
  customerCount: number | null;
}

/**
 * Calculates dashboard metrics strictly from authentic user records.
 * Returns null for any metric where no corresponding records exist.
 */
export function calculateAffairsDashboardMetrics(
  affairs: BusinessAffairsData
): AffairsDashboardMetrics {
  const totalSales =
    affairs.sales.length > 0
      ? affairs.sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0)
      : null;

  const totalExpenses =
    affairs.expenses.length > 0
      ? affairs.expenses.reduce((acc, e) => acc + (e.amount || 0), 0)
      : null;

  const productCount = affairs.products.length > 0 ? affairs.products.length : null;

  const lowStockCount =
    affairs.products.length > 0
      ? affairs.products.filter(
          (p) => p.currentStock > 0 && p.currentStock <= p.minStockLevel
        ).length
      : null;

  const outOfStockCount =
    affairs.products.length > 0
      ? affairs.products.filter((p) => p.currentStock <= 0).length
      : null;

  const pendingOrdersCount =
    affairs.orders.length > 0
      ? affairs.orders.filter((o) => o.orderStatus === 'Pending').length
      : null;

  const customerCount =
    affairs.customers.length > 0 ? affairs.customers.length : null;

  return {
    totalSales,
    totalExpenses,
    productCount,
    lowStockCount,
    outOfStockCount,
    pendingOrdersCount,
    customerCount,
  };
}

/**
 * Derives stock status dynamically based on currentStock and minStockLevel.
 */
export function getStockStatus(product: ProductRecord): StockStatus {
  if (product.currentStock <= 0) {
    return 'Out of Stock';
  }
  if (product.currentStock <= product.minStockLevel) {
    return 'Low Stock';
  }
  return 'In Stock';
}

/**
 * Converts authentic user affairs records into an IngestedDataset for the
 * diagnostic engine (Data, Insights, Charts, Recommendations).
 */
export function convertAffairsToIngestedDataset(
  affairs: BusinessAffairsData,
  businessName: string
): IngestedDataset | null {
  if (affairs.sales.length === 0 && affairs.expenses.length === 0 && affairs.products.length === 0) {
    return null;
  }

  // If sales records exist, build a sales ledger dataset enriched with product category & margin
  if (affairs.sales.length > 0) {
    const rawRows = affairs.sales.map((sale) => {
      const matchedProd = affairs.products.find(
        (p) => p.name.toLowerCase() === sale.product.toLowerCase()
      );
      const category = matchedProd?.category || 'Commercial Trade';
      const costPrice = matchedProd?.costPrice || Math.max(0, sale.sellingPrice * 0.7);
      const margin = (sale.sellingPrice - costPrice) * sale.quantity;

      return {
        id: sale.id,
        Date: sale.date,
        Product: sale.product,
        Category: category,
        Customer: sale.customer,
        Quantity: sale.quantity,
        UnitPrice: sale.sellingPrice,
        Discount: sale.discount,
        Revenue: sale.totalAmount,
        EstimatedCost: Number((costPrice * sale.quantity).toFixed(2)),
        PotentialMargin: Number(margin.toFixed(2)),
        PaymentStatus: sale.paymentStatus,
        Channel: sale.salesChannel,
      };
    });

    const columns = [
      'Date',
      'Product',
      'Category',
      'Customer',
      'Quantity',
      'UnitPrice',
      'Discount',
      'Revenue',
      'EstimatedCost',
      'PotentialMargin',
      'PaymentStatus',
      'Channel',
    ];

    const jsonStr = JSON.stringify(rawRows);
    const sizeFormatted = `${(jsonStr.length / 1024).toFixed(1)} KB`;

    const dataset: IngestedDataset = {
      id: `affairs_ledger_${Date.now()}`,
      sourceType: 'upload',
      fileName: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_operational_ledger.json`,
      fileType: 'application/json',
      fileSizeFormatted: sizeFormatted,
      rowCount: rawRows.length,
      columnCount: columns.length,
      columns,
      records: rawRows,
      uploadTimestamp: new Date().toISOString(),
      status: 'processed',
    };

    dataset.qualityReport = analyzeDataQuality(dataset);
    return dataset;
  }

  // Fallback if only products exist
  if (affairs.products.length > 0) {
    const rawRows = affairs.products.map((p) => ({
      id: p.id,
      Product: p.name,
      Category: p.category,
      CostPrice: p.costPrice,
      SellingPrice: p.sellingPrice,
      UnitMargin: Number((p.sellingPrice - p.costPrice).toFixed(2)),
      Stock: p.currentStock,
      Buffer: p.minStockLevel,
      Status: getStockStatus(p),
      Supplier: p.supplier || 'Internal',
    }));

    const columns = [
      'Product',
      'Category',
      'CostPrice',
      'SellingPrice',
      'UnitMargin',
      'Stock',
      'Buffer',
      'Status',
      'Supplier',
    ];

    const jsonStr = JSON.stringify(rawRows);
    const sizeFormatted = `${(jsonStr.length / 1024).toFixed(1)} KB`;

    const dataset: IngestedDataset = {
      id: `affairs_catalog_${Date.now()}`,
      sourceType: 'upload',
      fileName: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_product_catalog.json`,
      fileType: 'application/json',
      fileSizeFormatted: sizeFormatted,
      rowCount: rawRows.length,
      columnCount: columns.length,
      columns,
      records: rawRows,
      uploadTimestamp: new Date().toISOString(),
      status: 'processed',
    };

    dataset.qualityReport = analyzeDataQuality(dataset);
    return dataset;
  }

  return null;
}
