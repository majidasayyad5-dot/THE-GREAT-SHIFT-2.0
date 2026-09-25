/**
 * Supported global currencies and formatting utility
 * Allows small businesses worldwide to operate in their native currency.
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', position: 'prefix' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', position: 'prefix' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', position: 'prefix' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', position: 'prefix' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', position: 'prefix' },
  { code: 'SAR', symbol: 'SAR ', name: 'Saudi Riyal (SAR)', position: 'prefix' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', position: 'prefix' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', position: 'prefix' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', position: 'prefix' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', position: 'prefix' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)', position: 'prefix' },
  { code: 'PKR', symbol: '₨ ', name: 'Pakistani Rupee (PKR)', position: 'prefix' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)', position: 'prefix' },
  { code: 'BRL', symbol: 'R$ ', name: 'Brazilian Real (BRL)', position: 'prefix' },
  { code: 'ZAR', symbol: 'R ', name: 'South African Rand (ZAR)', position: 'prefix' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso (PHP)', position: 'prefix' },
  { code: 'IDR', symbol: 'Rp ', name: 'Indonesian Rupiah (IDR)', position: 'prefix' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (CNY)', position: 'prefix' },
];

const STORAGE_KEY = 'the_great_shift_selected_currency';

export function getSelectedCurrency(): CurrencyConfig {
  if (typeof window === 'undefined') {
    return SUPPORTED_CURRENCIES[1]; // Default to INR or USD
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = SUPPORTED_CURRENCIES.find((c) => c.code === saved);
      if (found) return found;
    }
  } catch (e) {
    // ignore
  }
  return SUPPORTED_CURRENCIES[1]; // Default INR for Asha's local business, easily changed
}

export function setSelectedCurrency(code: string): CurrencyConfig {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, found.code);
      window.dispatchEvent(new CustomEvent('app_currency_changed', { detail: found }));
    } catch (e) {
      // ignore
    }
  }
  return found;
}

export function formatCurrencyAmount(
  amount: number | null | undefined,
  currencyCode?: string
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Insufficient data';
  }

  const curr = currencyCode
    ? SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || getSelectedCurrency()
    : getSelectedCurrency();

  const formattedNum = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return curr.position === 'prefix'
    ? `${curr.symbol}${formattedNum}`
    : `${formattedNum} ${curr.symbol}`;
}
