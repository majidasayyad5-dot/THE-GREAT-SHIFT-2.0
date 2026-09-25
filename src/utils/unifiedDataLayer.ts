import {
  BusinessAffairsData,
  IngestedDataset,
  UnifiedBusinessDataLayer,
  NormalizedTransaction,
  NormalizedProduct,
  NormalizedExpense,
  NormalizedCustomer,
  NormalizedOrder,
  UnifiedDataSourceSummary,
  DataSourceIndicatorInfo,
} from '../types/bi';

/**
 * Safely parses any number, stripping currency symbols, commas, whitespace.
 */
export function cleanNumeric(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[$€£¥₹,\s]/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Matches a column name using case-insensitive regex patterns.
 */
export function findMatchingColumn(columns: string[], pattern: RegExp): string | undefined {
  return columns.find((c) => pattern.test(c.toLowerCase().trim()));
}

export interface DataLayerBuildOptions {
  includeManual?: boolean;
  includeUpload?: boolean;
  includeDemo?: boolean;
}

/**
 * Normalizes manual records, uploaded dataset records, and demo dataset records
 * into a single unified business data layer without unnecessary duplication.
 */
export function buildUnifiedBusinessData(
  businessAffairs?: BusinessAffairsData | null,
  activeDataset?: IngestedDataset | null,
  options: DataLayerBuildOptions = { includeManual: true, includeUpload: true, includeDemo: true }
): UnifiedBusinessDataLayer {
  const includeManual = options.includeManual ?? true;
  const includeUpload = options.includeUpload ?? true;
  const includeDemo = options.includeDemo ?? true;

  const transactions: NormalizedTransaction[] = [];
  const products: NormalizedProduct[] = [];
  const expenses: NormalizedExpense[] = [];
  const customers: NormalizedCustomer[] = [];
  const orders: NormalizedOrder[] = [];

  const sourceIndicators: DataSourceIndicatorInfo[] = [];

  // =========================================================================
  // 1. MANUAL BUSINESS RECORDS (Module inputs)
  // =========================================================================
  const manualSalesCount = businessAffairs?.sales?.length || 0;
  const manualProductsCount = businessAffairs?.products?.length || 0;
  const manualExpensesCount = businessAffairs?.expenses?.length || 0;
  const manualCustomersCount = businessAffairs?.customers?.length || 0;
  const manualOrdersCount = businessAffairs?.orders?.length || 0;
  const totalManualRecords =
    manualSalesCount + manualProductsCount + manualExpensesCount + manualCustomersCount + manualOrdersCount;

  if (businessAffairs && totalManualRecords > 0 && includeManual) {
    sourceIndicators.push({
      type: 'manual',
      label: 'Business Records',
      recordCount: totalManualRecords,
      isActive: true,
      details: `${manualSalesCount} sales, ${manualProductsCount} products, ${manualExpensesCount} expenses, ${manualOrdersCount} orders, ${manualCustomersCount} customers`,
    });

    // 1A. Manual Sales
    businessAffairs.sales.forEach((s) => {
      const matchedProd = businessAffairs.products.find(
        (p) => p.name.toLowerCase() === s.product.toLowerCase()
      );
      const category = matchedProd?.category || null;
      const costPerUnit = matchedProd?.costPrice ?? null;
      const totalCost = costPerUnit !== null ? Number((costPerUnit * s.quantity).toFixed(2)) : null;
      const totalMargin = totalCost !== null ? Number((s.totalAmount - totalCost).toFixed(2)) : null;

      transactions.push({
        id: `manual_sale_${s.id}`,
        date: s.date || null,
        product: s.product || 'Unspecified Product',
        category,
        unitsSold: s.quantity || 1,
        unitPrice: s.sellingPrice || 0,
        revenue: s.totalAmount || 0,
        cost: totalCost,
        margin: totalMargin,
        customer: s.customer || null,
        customerType: null,
        channel: s.salesChannel || null,
        region: null,
        paymentStatus: s.paymentStatus || null,
        source: 'manual',
      });
    });

    // 1B. Manual Products
    businessAffairs.products.forEach((p) => {
      products.push({
        id: `manual_prod_${p.id}`,
        name: p.name,
        category: p.category || null,
        costPrice: p.costPrice !== undefined ? p.costPrice : null,
        sellingPrice: p.sellingPrice !== undefined ? p.sellingPrice : null,
        unitMargin: p.unitMargin !== undefined ? p.unitMargin : null,
        currentStock: p.currentStock !== undefined ? p.currentStock : null,
        minStockLevel: p.minStockLevel !== undefined ? p.minStockLevel : null,
        supplier: p.supplier || null,
        status: p.status || 'Active',
        source: 'manual',
      });
    });

    // 1C. Manual Expenses
    businessAffairs.expenses.forEach((e) => {
      expenses.push({
        id: `manual_exp_${e.id}`,
        date: e.date || null,
        category: e.category || 'Other',
        description: e.description || '',
        amount: e.amount || 0,
        paymentStatus: e.paymentStatus || null,
        source: 'manual',
      });
    });

    // 1D. Manual Customers
    businessAffairs.customers.forEach((c) => {
      customers.push({
        id: `manual_cust_${c.id}`,
        name: c.name,
        type: c.type || null,
        location: c.location || null,
        contactInfo: c.contactInfo || null,
        source: 'manual',
      });
    });

    // 1E. Manual Orders
    businessAffairs.orders.forEach((o) => {
      orders.push({
        id: `manual_order_${o.id}`,
        orderId: o.orderId || o.id,
        date: o.date || null,
        customer: o.customer || '',
        quantity: o.quantity !== undefined ? o.quantity : null,
        orderValue: o.orderValue !== undefined ? o.orderValue : null,
        orderStatus: o.orderStatus || null,
        paymentStatus: o.paymentStatus || null,
        source: 'manual',
      });
    });
  }

  // =========================================================================
  // 2. UPLOADED DATASET & DEMO DATASET
  // =========================================================================
  if (activeDataset && activeDataset.records && activeDataset.records.length > 0) {
    const isDemo = !!activeDataset.isFictionalDemo || activeDataset.sourceType === 'demo';
    const shouldInclude = isDemo ? includeDemo : includeUpload;

    if (shouldInclude) {
      const sourceType = isDemo ? 'demo' : 'upload';
      sourceIndicators.push({
        type: sourceType,
        label: isDemo ? 'Demo Dataset' : 'Uploaded Dataset',
        recordCount: activeDataset.records.length,
        isActive: true,
        details: isDemo
          ? 'Fictional Handmade Clothing Ledger (Synthetic)'
          : `${activeDataset.fileName} (${activeDataset.fileType})`,
      });

      const cols = activeDataset.columns || [];

      // Detect relevant column names
      const dateCol = findMatchingColumn(cols, /^(date|transaction_date|order_date|timestamp|day|period)$/i);
      const productCol = findMatchingColumn(cols, /^(product|product_name|item|item_name|sku|description)$/i);
      const categoryCol = findMatchingColumn(cols, /^(category|product_category|type|segment)$/i);
      const unitsCol = findMatchingColumn(cols, /^(units|units_sold|quantity|qty|volume|items_sold)$/i);
      const priceCol = findMatchingColumn(cols, /^(selling_price|unit_price|price|rate)$/i);
      const revenueCol = findMatchingColumn(cols, /^(revenue|sales|total_amount|total_sales|total_price|amount)$/i);
      const costCol = findMatchingColumn(cols, /^(cost|cogs|unit_cost|cost_price|total_cost)$/i);
      const customerCol = findMatchingColumn(cols, /^(customer|client|buyer|customer_name|account)$/i);
      const custTypeCol = findMatchingColumn(cols, /^(customer_type|segment|client_type|buyer_type)$/i);
      const regionCol = findMatchingColumn(cols, /^(region|territory|market|location|city|country|state)$/i);
      const channelCol = findMatchingColumn(cols, /^(channel|sales_channel|store|storefront|platform)$/i);
      const inventoryCol = findMatchingColumn(cols, /^(inventory|stock|stock_level|on_hand|available_stock)$/i);

      // Track distinct products found in dataset for product catalog synthesis
      const datasetProductsMap = new Map<string, {
        category: string | null;
        price: number | null;
        cost: number | null;
        inventory: number | null;
      }>();

      activeDataset.records.forEach((row, idx) => {
        const prodName = productCol && row[productCol] ? String(row[productCol]).trim() : `Item ${idx + 1}`;
        const catName = categoryCol && row[categoryCol] ? String(row[categoryCol]).trim() : null;
        const units = unitsCol ? cleanNumeric(row[unitsCol]) : null;
        const unitPrice = priceCol ? cleanNumeric(row[priceCol]) : null;

        let rev = revenueCol ? cleanNumeric(row[revenueCol]) : null;
        if (rev === null || rev === 0) {
          if (units !== null && unitPrice !== null && units > 0) {
            rev = Number((units * unitPrice).toFixed(2));
          }
        }

        const cost = costCol ? cleanNumeric(row[costCol]) : null;
        const margin = rev !== null && cost !== null ? Number((rev - cost).toFixed(2)) : null;

        const cust = customerCol && row[customerCol] ? String(row[customerCol]).trim() : null;
        const custType = custTypeCol && row[custTypeCol] ? String(row[custTypeCol]).trim() : null;
        const region = regionCol && row[regionCol] ? String(row[regionCol]).trim() : null;
        const channel = channelCol && row[channelCol] ? String(row[channelCol]).trim() : null;
        const dateVal = dateCol && row[dateCol] ? String(row[dateCol]).trim() : null;

        transactions.push({
          id: `${sourceType}_rec_${idx}_${Date.now()}`,
          date: dateVal,
          product: prodName,
          category: catName,
          unitsSold: units,
          unitPrice,
          revenue: rev,
          cost,
          margin,
          customer: cust,
          customerType: custType,
          channel,
          region,
          paymentStatus: 'Paid',
          source: sourceType,
        });

        // Store unique product attributes
        if (!datasetProductsMap.has(prodName)) {
          datasetProductsMap.set(prodName, {
            category: catName,
            price: unitPrice,
            cost: cost !== null && units ? Number((cost / units).toFixed(2)) : null,
            inventory: inventoryCol ? cleanNumeric(row[inventoryCol]) : null,
          });
        }
      });

      // If we don't have manual products, or we want to augment products catalog
      datasetProductsMap.forEach((meta, prodName) => {
        const alreadyExists = products.some((p) => p.name.toLowerCase() === prodName.toLowerCase());
        if (!alreadyExists) {
          products.push({
            id: `${sourceType}_prod_${prodName.replace(/\s+/g, '_').toLowerCase()}`,
            name: prodName,
            category: meta.category,
            costPrice: meta.cost,
            sellingPrice: meta.price,
            unitMargin:
              meta.price !== null && meta.cost !== null ? Number((meta.price - meta.cost).toFixed(2)) : null,
            currentStock: meta.inventory,
            minStockLevel: meta.inventory !== null ? Math.round(meta.inventory * 0.25) : null,
            supplier: null,
            status: 'Active',
            source: sourceType,
          });
        }
      });
    }
  }

  // =========================================================================
  // Determine available date range across all normalized records
  // =========================================================================
  const validDates = transactions
    .map((t) => t.date)
    .filter((d): d is string => !!d && !isNaN(Date.parse(d)))
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);

  let startDate: string | null = null;
  let endDate: string | null = null;
  let totalDays = 0;

  if (validDates.length > 0) {
    const minTimestamp = validDates[0];
    const maxTimestamp = validDates[validDates.length - 1];
    startDate = new Date(minTimestamp).toISOString().split('T')[0];
    endDate = new Date(maxTimestamp).toISOString().split('T')[0];
    totalDays = Math.max(1, Math.round((maxTimestamp - minTimestamp) / (1000 * 60 * 60 * 24)));
  }

  // =========================================================================
  // Data Source Summary Construction
  // =========================================================================
  const activeSourcesCount = sourceIndicators.length;
  const hasManual = sourceIndicators.some((s) => s.type === 'manual');
  const hasUpload = sourceIndicators.some((s) => s.type === 'upload');
  const hasDemo = sourceIndicators.some((s) => s.type === 'demo');

  let summaryText = 'No data sources currently active';
  if (activeSourcesCount === 1) {
    summaryText = `Analysis based on 1 data source: ${sourceIndicators[0].label}`;
  } else if (activeSourcesCount > 1) {
    const names = sourceIndicators.map((s) => s.label).join(' & ');
    summaryText = `Analysis based on ${activeSourcesCount} data sources: ${names}`;
  }

  const primarySourceName =
    sourceIndicators.length > 0 ? sourceIndicators[0].label : 'No Active Source';

  const dataSourceSummary: UnifiedDataSourceSummary = {
    sources: sourceIndicators,
    activeSourceCount: activeSourcesCount,
    summaryText,
    primarySourceName,
    hasManual,
    hasUpload,
    hasDemo,
  };

  return {
    dataSourceSummary,
    transactions,
    products,
    expenses,
    customers,
    orders,
    availableDateRange: {
      startDate,
      endDate,
      totalDays,
    },
  };
}
