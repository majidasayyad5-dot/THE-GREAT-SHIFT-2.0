import { IngestedDataset, DataQualityReport, ColumnQualityReport, BusinessFieldDetection } from '../types/bi';

/**
 * Checks if a value is empty or represents missing/null data
 */
export function isValueEmpty(val: any): boolean {
  if (val === null || val === undefined) return true;
  const str = String(val).trim();
  if (str === '') return true;
  const lower = str.toLowerCase();
  return lower === 'null' || lower === 'undefined' || lower === 'nan' || lower === 'n/a' || lower === 'none' || lower === '-';
}

/**
 * Validates if a string is a recognizable date format and parses valid year/month/day
 */
function parseDateCandidate(val: any): Date | null {
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  if (typeof val === 'number') {
    // Avoid treating normal numbers like 42 or 1000 as dates
    if (val < 600000000000 || val > 2500000000000) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (trimmed.length < 6) return null;

  // Pattern checks: YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY, etc.
  const isDatePattern = /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/.test(trimmed) ||
    /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}/.test(trimmed) ||
    /^[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}/.test(trimmed);

  if (!isDatePattern) return null;

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return null;

  const year = parsed.getFullYear();
  if (year < 1980 || year > 2045) return null;

  return parsed;
}

/**
 * Detect column data type based on sample values and name heuristics
 */
export function detectColumnType(
  colName: string,
  values: any[]
): 'Date' | 'Number' | 'Currency/Amount' | 'Text' | 'Category' | 'Boolean' | 'Unknown' {
  const nonEmpties = values.filter((v) => !isValueEmpty(v));

  if (nonEmpties.length === 0) {
    return 'Unknown';
  }

  const colLower = colName.toLowerCase();

  // 1. Boolean check
  const booleanCount = nonEmpties.filter((v) => {
    if (typeof v === 'boolean') return true;
    const s = String(v).trim().toLowerCase();
    return s === 'true' || s === 'false' || s === 'yes' || s === 'no';
  }).length;
  if (booleanCount / nonEmpties.length >= 0.9) {
    return 'Boolean';
  }

  // 2. Date check
  const dateCandidates = nonEmpties.map(parseDateCandidate);
  const validDatesCount = dateCandidates.filter((d) => d !== null).length;
  if (validDatesCount / nonEmpties.length >= 0.8) {
    return 'Date';
  }

  // 3. Currency / Monetary check
  const currencySigns = /[$€£¥₹]/;
  const hasCurrencySymbols = nonEmpties.some((v) => typeof v === 'string' && currencySigns.test(v));
  const isMonetaryName = /revenue|cost|price|gmv|margin|amount|spend|total|val|turnover|subtotal|tax/.test(colLower);

  // Check numeric compatibility
  const numericValues = nonEmpties.map((v) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const stripped = v.replace(/[$€£¥₹,\s]/g, '');
      return stripped !== '' && !isNaN(Number(stripped)) ? Number(stripped) : NaN;
    }
    return NaN;
  });
  const validNumbersCount = numericValues.filter((n) => !isNaN(n)).length;

  if (validNumbersCount / nonEmpties.length >= 0.8) {
    if (hasCurrencySymbols || isMonetaryName) {
      return 'Currency/Amount';
    }
    return 'Number';
  }

  // 4. Category check (categorical strings with low cardinality)
  const uniqueSet = new Set(nonEmpties.map((v) => String(v).trim().toLowerCase()));
  const isCategoricalName = /category|segment|type|channel|status|group|tier|region|division|class/.test(colLower);

  if (
    (uniqueSet.size <= 25 && uniqueSet.size < nonEmpties.length * 0.4) ||
    (isCategoricalName && uniqueSet.size <= 50)
  ) {
    return 'Category';
  }

  // 5. General Text
  const isAllStrings = nonEmpties.every((v) => typeof v === 'string' || typeof v === 'number');
  if (isAllStrings) {
    return 'Text';
  }

  return 'Unknown';
}

/**
 * Analyzes data quality, column integrity, duplicates, business field matches, and readiness
 */
export function analyzeDataQuality(dataset: IngestedDataset): DataQualityReport {
  const records = dataset.records || [];
  const columns = dataset.columns || [];
  const totalRecords = records.length;
  const totalFields = columns.length;
  const totalCells = totalRecords * totalFields;

  let totalMissingCells = 0;
  const columnReports: ColumnQualityReport[] = [];
  const warnings: string[] = [];

  // Special case: 0 records or PDF without parsed rows
  if (totalRecords === 0) {
    return {
      datasetId: dataset.id,
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalRecords: 0,
      totalFields,
      totalCells: 0,
      missingValuesCount: 0,
      missingValuesPct: 0,
      duplicateRecordsCount: 0,
      duplicateRecordsPct: 0,
      dateCoverage: null,
      numericFieldsCount: 0,
      dataCompletenessPct: 0,
      overallStatus: 'Problem',
      statusReason: dataset.pdfNotice
        ? 'Binary PDF file uploaded. Direct tabular extraction is not yet performed.'
        : 'The dataset contains zero records.',
      columns: [],
      businessFieldsDetected: [],
      readinessExplanation: ['No tabular records available to determine business analysis readiness.'],
      canContinueToAnalysis: false,
      missingRequirementsMessage: 'At least 1 valid data record and recognizable business fields are required.',
      warnings: ['Dataset contains 0 rows. Please provide a dataset with valid records.'],
    };
  }

  // 1. Column-by-Column Evaluation
  let primaryDateColumn: string | null = null;
  let numericFieldsCount = 0;

  columns.forEach((colName) => {
    const rawValues = records.map((r) => r[colName]);
    const nonEmptyValues = rawValues.filter((v) => !isValueEmpty(v));
    const missingCount = rawValues.length - nonEmptyValues.length;
    totalMissingCells += missingCount;

    const missingPct = totalRecords > 0 ? (missingCount / totalRecords) * 100 : 0;
    const uniqueValuesSet = new Set(nonEmptyValues.map((v) => String(v).trim()));
    const uniqueCount = uniqueValuesSet.size;

    const detectedType = detectColumnType(colName, rawValues);
    if (detectedType === 'Number' || detectedType === 'Currency/Amount') {
      numericFieldsCount++;
    }

    if (detectedType === 'Date' && !primaryDateColumn) {
      primaryDateColumn = colName;
    }

    // Determine column status
    let status: 'Good' | 'Needs Review' | 'Problem' = 'Good';
    let statusReason = 'Clean field with 100% complete records';

    if (missingCount === totalRecords) {
      status = 'Problem';
      statusReason = 'Field is 100% empty (contains no values in any row)';
      warnings.push(`Field '${colName}' is completely empty across all ${totalRecords} records.`);
    } else if (missingPct > 40) {
      status = 'Problem';
      statusReason = `Severe missing rate: ${missingPct.toFixed(1)}% missing values (${missingCount} rows)`;
      warnings.push(`Field '${colName}' has a severe missing rate of ${missingPct.toFixed(1)}% (${missingCount} missing).`);
    } else if (missingPct > 0) {
      status = 'Needs Review';
      statusReason = `${missingPct.toFixed(1)}% missing values (${missingCount} rows)`;
      warnings.push(`${missingCount} records contain missing '${colName}' values.`);
    } else if (detectedType === 'Unknown') {
      status = 'Needs Review';
      statusReason = 'Inconsistent data types detected across rows';
      warnings.push(`Field '${colName}' contains inconsistent or unrecognizable data formats.`);
    }

    // Check for invalid numeric entries in numeric columns
    if (detectedType === 'Number' || detectedType === 'Currency/Amount') {
      let invalidNumCount = 0;
      nonEmptyValues.forEach((v) => {
        const str = String(v).replace(/[$€£¥₹,\s]/g, '');
        if (isNaN(Number(str))) invalidNumCount++;
      });
      if (invalidNumCount > 0) {
        status = 'Needs Review';
        statusReason += ` (${invalidNumCount} invalid numeric formatting)`;
        warnings.push(`${invalidNumCount} invalid numeric formatting values found in '${colName}'.`);
      }
    }

    columnReports.push({
      name: colName,
      detectedType,
      nonEmptyCount: nonEmptyValues.length,
      missingCount,
      missingPct: Number(missingPct.toFixed(1)),
      uniqueCount,
      status,
      statusReason,
      sampleValues: Array.from(uniqueValuesSet).slice(0, 4),
    });
  });

  // 2. Duplicate Records Detection
  const rowHashTracker = new Map<string, number>();
  let duplicateCount = 0;

  records.forEach((row) => {
    // Generate a normalized hash of all row values
    const hash = columns.map((c) => String(row[c] ?? '').trim().toLowerCase()).join('||');
    const existing = rowHashTracker.get(hash) || 0;
    if (existing >= 1) {
      duplicateCount++;
    }
    rowHashTracker.set(hash, existing + 1);
  });

  const duplicatePct = totalRecords > 0 ? (duplicateCount / totalRecords) * 100 : 0;
  if (duplicateCount > 0) {
    warnings.push(`${duplicateCount} duplicate records detected with identical field values.`);
  }

  // 3. Date Coverage Detection
  let dateCoverage: DataQualityReport['dateCoverage'] = null;
  if (primaryDateColumn) {
    const validDates: Date[] = [];
    records.forEach((row) => {
      const d = parseDateCandidate(row[primaryDateColumn!]);
      if (d) validDates.push(d);
    });

    if (validDates.length > 0) {
      validDates.sort((a, b) => a.getTime() - b.getTime());
      const minDate = validDates[0];
      const maxDate = validDates[validDates.length - 1];
      const diffTime = Math.abs(maxDate.getTime() - minDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const formatIso = (d: Date) => d.toISOString().split('T')[0];

      dateCoverage = {
        minDate: formatIso(minDate),
        maxDate: formatIso(maxDate),
        rangeDays: diffDays,
        formatted: `${formatIso(minDate)} to ${formatIso(maxDate)} (${diffDays} days)`,
      };
    }
  }

  // 4. Data Completeness
  const missingValuesPct = totalCells > 0 ? (totalMissingCells / totalCells) * 100 : 0;
  const dataCompletenessPct = totalCells > 0 ? Math.max(0, 100 - missingValuesPct) : 0;

  // 5. Business Field Detection (Access, Intelligence, Scale relevant concepts)
  const businessConcepts = [
    { key: 'date', label: 'Date / Time Horizon', regex: /date|time|period|day|month|year|timestamp/i },
    { key: 'product', label: 'Product / SKU / Item', regex: /product|sku|item|article|style|merchandise/i },
    { key: 'category', label: 'Category / Department', regex: /category|dept|department|segment|class|group|type/i },
    { key: 'units', label: 'Sales Units / Volume', regex: /unit|qty|quantity|volume|orders|count|sold/i },
    { key: 'selling_price', label: 'Selling Price', regex: /selling[_\s]?price|retail[_\s]?price|unit[_\s]?price|price/i },
    { key: 'revenue', label: 'Revenue / Turnover / GMV', regex: /revenue|turnover|sales|gmv|income|total[_\s]?sales|amount/i },
    { key: 'cost', label: 'Cost of Goods / COGS', regex: /cost|cogs|expense|procurement|buying[_\s]?price|wholesale[_\s]?cost/i },
    { key: 'customer', label: 'Customer / Buyer Segment', regex: /customer|client|buyer|account|channel[_\s]?customer/i },
    { key: 'region', label: 'Region / Geography / Market', regex: /region|location|city|country|territory|zone|market|state/i },
    { key: 'inventory', label: 'Inventory / Stock on Hand', regex: /inventory|stock|warehouse|balance|on[_\s]?hand/i },
  ];

  const businessFieldsDetected: BusinessFieldDetection[] = businessConcepts.map((concept) => {
    // Find matching column
    const matched = columns.find((col) => concept.regex.test(col.toLowerCase()));
    return {
      key: concept.key,
      label: concept.label,
      matchedColumn: matched,
      isDetected: !!matched,
    };
  });

  // 6. Readiness Explanations based strictly on actual detected fields
  const readinessExplanation: string[] = [];

  const hasDate = businessFieldsDetected.find((b) => b.key === 'date')?.isDetected;
  const hasRevenue = businessFieldsDetected.find((b) => b.key === 'revenue')?.isDetected;
  const hasCost = businessFieldsDetected.find((b) => b.key === 'cost')?.isDetected;
  const hasUnits = businessFieldsDetected.find((b) => b.key === 'units')?.isDetected;
  const hasProduct = businessFieldsDetected.find((b) => b.key === 'product')?.isDetected;
  const hasCategory = businessFieldsDetected.find((b) => b.key === 'category')?.isDetected;
  const hasCustomer = businessFieldsDetected.find((b) => b.key === 'customer')?.isDetected;
  const hasRegion = businessFieldsDetected.find((b) => b.key === 'region')?.isDetected;
  const hasInventory = businessFieldsDetected.find((b) => b.key === 'inventory')?.isDetected;

  if (hasRevenue && hasDate) {
    readinessExplanation.push('Revenue and Date fields detected. Suitable for time-series revenue velocity and trend analysis.');
  }
  if (hasRevenue && hasCost) {
    readinessExplanation.push('Revenue and Cost fields detected. Suitable for gross contribution margin and profit realization modeling.');
  } else if (hasRevenue && !hasCost) {
    readinessExplanation.push('Revenue detected without Cost field. Gross margin calculations will require baseline margin assumption.');
  }
  if (hasProduct && (hasUnits || hasRevenue)) {
    readinessExplanation.push('Product and sales volume fields detected. Suitable for SKU distribution, Pareto 80/20, and product performance analysis.');
  }
  if (hasInventory && (hasUnits || hasDate)) {
    readinessExplanation.push('Inventory and volume fields detected. Suitable for stockout risk detection, turnover velocity, and working capital cycle estimation.');
  }
  if (hasCustomer || hasRegion) {
    readinessExplanation.push('Customer and regional dimensions detected. Suitable for multi-channel mix and market segmentation.');
  }
  if (hasCategory) {
    readinessExplanation.push('Product Category taxonomy detected. Supports category aggregation and portfolio balancing.');
  }

  // If very few fields were detected
  if (readinessExplanation.length === 0) {
    if (numericFieldsCount > 0) {
      readinessExplanation.push(`${numericFieldsCount} numeric fields detected. Suitable for baseline statistical aggregation and distribution analysis.`);
    } else {
      readinessExplanation.push('Generic tabular data detected without standard commerce naming identifiers.');
    }
  }

  // 7. Overall Readiness & Continue Qualification
  // Can continue if we have at least 1 record and at least 2 columns with non-empty data
  const canContinueToAnalysis = totalRecords > 0 && totalFields >= 2 && dataCompletenessPct >= 20;

  let missingRequirementsMessage: string | undefined;
  if (!canContinueToAnalysis) {
    if (totalRecords === 0) {
      missingRequirementsMessage = 'Dataset contains 0 rows. Please provide data with at least one record.';
    } else if (totalFields < 2) {
      missingRequirementsMessage = 'Dataset requires at least 2 structured columns to perform dimensional analysis.';
    } else {
      missingRequirementsMessage = 'Data completeness is below 20%. Please provide a more complete dataset.';
    }
  }

  // 8. Overall Status (Good / Needs Review / Problem)
  let overallStatus: 'Good' | 'Needs Review' | 'Problem' = 'Good';
  let statusReason = 'Clean, well-structured dataset with zero critical data quality anomalies.';

  const problemColumns = columnReports.filter((c) => c.status === 'Problem').length;
  const reviewColumns = columnReports.filter((c) => c.status === 'Needs Review').length;

  if (totalRecords === 0 || dataCompletenessPct < 60 || problemColumns >= 2) {
    overallStatus = 'Problem';
    statusReason = `Critical data anomalies detected (${problemColumns} problematic fields, ${dataCompletenessPct.toFixed(1)}% completeness).`;
  } else if (reviewColumns > 0 || duplicateCount > 0 || dataCompletenessPct < 98 || !hasRevenue) {
    overallStatus = 'Needs Review';
    if (!hasRevenue && !hasUnits) {
      statusReason = 'Key commercial revenue and volume fields were not detected; dataset needs manual column alignment.';
    } else if (duplicateCount > 0) {
      statusReason = `${duplicateCount} duplicate records identified and require review.`;
    } else {
      statusReason = `Data contains minor missing values or formatting variances (${dataCompletenessPct.toFixed(1)}% completeness).`;
    }
  }

  return {
    datasetId: dataset.id,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    totalRecords,
    totalFields,
    totalCells,
    missingValuesCount: totalMissingCells,
    missingValuesPct: Number(missingValuesPct.toFixed(1)),
    duplicateRecordsCount: duplicateCount,
    duplicateRecordsPct: Number(duplicatePct.toFixed(1)),
    dateCoverage,
    numericFieldsCount,
    dataCompletenessPct: Number(dataCompletenessPct.toFixed(1)),
    overallStatus,
    statusReason,
    columns: columnReports,
    businessFieldsDetected,
    readinessExplanation,
    canContinueToAnalysis,
    missingRequirementsMessage,
    warnings,
  };
}
