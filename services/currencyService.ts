/**
 * Currency Conversion Service
 * EduNexus - Indian College ERP & Portal
 * 
 * Features:
 * - Live exchange rates (simulated with realistic values)
 * - Multi-currency support
 * - Auto-conversion for international payments
 * - Historical rate tracking
 */

// Supported currencies with their symbols and names
export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  country: string;
  flag: string;
  decimalPlaces: number;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India', flag: '🇮🇳', decimalPlaces: 2 },
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', flag: '🇺🇸', decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union', flag: '🇪🇺', decimalPlaces: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', flag: '🇬🇧', decimalPlaces: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia', flag: '🇦🇺', decimalPlaces: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada', flag: '🇨🇦', decimalPlaces: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore', flag: '🇸🇬', decimalPlaces: 2 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', country: 'United Arab Emirates', flag: '🇦🇪', decimalPlaces: 2 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', country: 'Saudi Arabia', flag: '🇸🇦', decimalPlaces: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan', flag: '🇯🇵', decimalPlaces: 0 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China', flag: '🇨🇳', decimalPlaces: 2 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia', flag: '🇲🇾', decimalPlaces: 2 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', country: 'Thailand', flag: '🇹🇭', decimalPlaces: 2 },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', country: 'Kuwait', flag: '🇰🇼', decimalPlaces: 3 },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', country: 'Qatar', flag: '🇶🇦', decimalPlaces: 2 },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', country: 'Bangladesh', flag: '🇧🇩', decimalPlaces: 2 },
  { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee', country: 'Nepal', flag: '🇳🇵', decimalPlaces: 2 },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', country: 'Sri Lanka', flag: '🇱🇰', decimalPlaces: 2 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', country: 'Switzerland', flag: '🇨🇭', decimalPlaces: 2 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', country: 'New Zealand', flag: '🇳🇿', decimalPlaces: 2 }
];

// Exchange rates to INR (1 unit of currency = X INR)
// These simulate live market rates as of January 2026
const BASE_EXCHANGE_RATES: Record<string, number> = {
  INR: 1,
  USD: 83.45,      // 1 USD = 83.45 INR
  EUR: 90.25,      // 1 EUR = 90.25 INR
  GBP: 105.60,     // 1 GBP = 105.60 INR
  AUD: 54.30,      // 1 AUD = 54.30 INR
  CAD: 61.75,      // 1 CAD = 61.75 INR
  SGD: 62.15,      // 1 SGD = 62.15 INR
  AED: 22.72,      // 1 AED = 22.72 INR
  SAR: 22.25,      // 1 SAR = 22.25 INR
  JPY: 0.56,       // 1 JPY = 0.56 INR
  CNY: 11.55,      // 1 CNY = 11.55 INR
  MYR: 17.80,      // 1 MYR = 17.80 INR
  THB: 2.42,       // 1 THB = 2.42 INR
  KWD: 271.50,     // 1 KWD = 271.50 INR
  QAR: 22.92,      // 1 QAR = 22.92 INR
  BDT: 0.76,       // 1 BDT = 0.76 INR
  NPR: 0.52,       // 1 NPR = 0.52 INR
  LKR: 0.26,       // 1 LKR = 0.26 INR
  CHF: 94.80,      // 1 CHF = 94.80 INR
  NZD: 50.25       // 1 NZD = 50.25 INR
};

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
  source: string;
}

export interface ConvertedAmount {
  originalAmount: number;
  originalCurrency: string;
  amount: number;
  currency: string;
  amountInINR: number;
  exchangeRate: number;
  formattedAmount: string;
  formattedINR: string;
  timestamp: string;
}

export interface ConversionBreakdown {
  originalAmount: number;
  originalCurrency: string;
  exchangeRate: number;
  convertedAmount: number;
  targetCurrency: string;
  serviceFee: number;
  serviceFeePercent: number;
  totalAmount: number;
  effectiveRate: number;
  timestamp: string;
  rateSource: string;
}

class CurrencyConversionService {
  private cachedRates: Map<string, { rate: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  private readonly SERVICE_FEE_PERCENT = 1.5; // 1.5% conversion fee

  /**
   * Get current exchange rate for a currency pair
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRate> {
    // Add small random variation to simulate live rates (±0.5%)
    const variation = 1 + (Math.random() - 0.5) * 0.01;
    
    const fromRate = BASE_EXCHANGE_RATES[fromCurrency] || 1;
    const toRate = BASE_EXCHANGE_RATES[toCurrency] || 1;
    const rate = (toRate / fromRate) * variation;

    return {
      from: fromCurrency,
      to: toCurrency,
      rate: Number(rate.toFixed(6)),
      timestamp: new Date().toISOString(),
      source: 'EduNexus Exchange Service'
    };
  }

  /**
   * Get all exchange rates relative to INR
   */
  async getAllRates(): Promise<ExchangeRate[]> {
    const rates: ExchangeRate[] = [];
    const timestamp = new Date().toISOString();

    for (const currency of Object.keys(BASE_EXCHANGE_RATES)) {
      if (currency === 'INR') continue;
      
      const variation = 1 + (Math.random() - 0.5) * 0.01;
      rates.push({
        from: currency,
        to: 'INR',
        rate: Number((BASE_EXCHANGE_RATES[currency] * variation).toFixed(4)),
        timestamp,
        source: 'EduNexus Exchange Service'
      });
    }

    return rates;
  }

  /**
   * Convert amount from any currency to INR
   */
  async convertToINR(amount: number, fromCurrency: string): Promise<ConvertedAmount> {
    if (fromCurrency === 'INR') {
      return this.createConversionResult(amount, 'INR', amount, 'INR', 1);
    }

    const rate = await this.getExchangeRate(fromCurrency, 'INR');
    const amountInINR = amount * rate.rate;

    return this.createConversionResult(amount, fromCurrency, amountInINR, 'INR', rate.rate);
  }

  /**
   * Convert amount from INR to any currency
   */
  async convertFromINR(amountINR: number, toCurrency: string): Promise<ConvertedAmount> {
    if (toCurrency === 'INR') {
      return this.createConversionResult(amountINR, 'INR', amountINR, 'INR', 1);
    }

    const rate = await this.getExchangeRate('INR', toCurrency);
    const amount = amountINR * rate.rate;

    return this.createConversionResult(amountINR, 'INR', amount, toCurrency, rate.rate);
  }

  /**
   * Convert between any two currencies
   */
  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<ConvertedAmount> {
    if (fromCurrency === toCurrency) {
      return this.createConversionResult(amount, fromCurrency, amount, toCurrency, 1);
    }

    // Convert via INR as intermediate
    const toINR = await this.convertToINR(amount, fromCurrency);
    const fromINR = await this.convertFromINR(toINR.amountInINR, toCurrency);

    const directRate = fromINR.amount / amount;

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      amount: fromINR.amount,
      currency: toCurrency,
      amountInINR: toINR.amountInINR,
      exchangeRate: directRate,
      formattedAmount: this.formatAmount(fromINR.amount, toCurrency),
      formattedINR: this.formatAmount(toINR.amountInINR, 'INR'),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get detailed conversion breakdown with fees
   */
  async getConversionBreakdown(
    amount: number,
    fromCurrency: string,
    toCurrency: string = 'INR',
    includeServiceFee: boolean = true
  ): Promise<ConversionBreakdown> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate.rate;
    
    const serviceFee = includeServiceFee ? convertedAmount * (this.SERVICE_FEE_PERCENT / 100) : 0;
    const totalAmount = convertedAmount + serviceFee;
    const effectiveRate = totalAmount / amount;

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      exchangeRate: rate.rate,
      convertedAmount: Number(convertedAmount.toFixed(2)),
      targetCurrency: toCurrency,
      serviceFee: Number(serviceFee.toFixed(2)),
      serviceFeePercent: includeServiceFee ? this.SERVICE_FEE_PERCENT : 0,
      totalAmount: Number(totalAmount.toFixed(2)),
      effectiveRate: Number(effectiveRate.toFixed(6)),
      timestamp: rate.timestamp,
      rateSource: rate.source
    };
  }

  /**
   * Get currency info by code
   */
  getCurrencyInfo(code: string): CurrencyInfo | undefined {
    return SUPPORTED_CURRENCIES.find(c => c.code === code);
  }

  /**
   * Format amount with currency symbol
   */
  formatAmount(amount: number, currency: string): string {
    const info = this.getCurrencyInfo(currency);
    const decimals = info?.decimalPlaces ?? 2;
    
    if (currency === 'INR') {
      // Indian number formatting (lakhs, crores)
      return `₹${amount.toLocaleString('en-IN', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}`;
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(amount);
    } catch {
      const symbol = info?.symbol || currency;
      return `${symbol}${amount.toFixed(decimals)}`;
    }
  }

  /**
   * Format exchange rate display
   */
  formatRate(fromCurrency: string, toCurrency: string, rate: number): string {
    const fromInfo = this.getCurrencyInfo(fromCurrency);
    const toInfo = this.getCurrencyInfo(toCurrency);
    
    return `1 ${fromInfo?.symbol || fromCurrency} = ${rate.toFixed(4)} ${toInfo?.symbol || toCurrency}`;
  }

  /**
   * Detect user's currency based on locale
   */
  detectUserCurrency(): string {
    try {
      const locale = navigator.language || 'en-IN';
      const country = locale.split('-')[1]?.toUpperCase();
      
      const currencyMap: Record<string, string> = {
        'IN': 'INR',
        'US': 'USD',
        'GB': 'GBP',
        'AU': 'AUD',
        'CA': 'CAD',
        'SG': 'SGD',
        'AE': 'AED',
        'SA': 'SAR',
        'JP': 'JPY',
        'CN': 'CNY',
        'MY': 'MYR',
        'TH': 'THB',
        'KW': 'KWD',
        'QA': 'QAR',
        'BD': 'BDT',
        'NP': 'NPR',
        'LK': 'LKR',
        'CH': 'CHF',
        'NZ': 'NZD',
        'DE': 'EUR',
        'FR': 'EUR',
        'IT': 'EUR',
        'ES': 'EUR',
        'NL': 'EUR'
      };

      return currencyMap[country] || 'INR';
    } catch {
      return 'INR';
    }
  }

  /**
   * Get popular currencies for quick selection
   */
  getPopularCurrencies(): CurrencyInfo[] {
    const popularCodes = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED'];
    return SUPPORTED_CURRENCIES.filter(c => popularCodes.includes(c.code));
  }

  private createConversionResult(
    originalAmount: number,
    originalCurrency: string,
    amount: number,
    currency: string,
    exchangeRate: number
  ): ConvertedAmount {
    const amountInINR = currency === 'INR' ? amount : originalAmount * (BASE_EXCHANGE_RATES[originalCurrency] || 1);
    
    return {
      originalAmount,
      originalCurrency,
      amount: Number(amount.toFixed(2)),
      currency,
      amountInINR: Number(amountInINR.toFixed(2)),
      exchangeRate,
      formattedAmount: this.formatAmount(amount, currency),
      formattedINR: this.formatAmount(amountInINR, 'INR'),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const currencyService = new CurrencyConversionService();

// React hook helper for currency selection
export const useCurrencyOptions = () => {
  const popularCurrencies = currencyService.getPopularCurrencies();
  const allCurrencies = SUPPORTED_CURRENCIES;
  const detectedCurrency = currencyService.detectUserCurrency();

  return {
    popularCurrencies,
    allCurrencies,
    detectedCurrency,
    formatAmount: currencyService.formatAmount.bind(currencyService),
    getCurrencyInfo: currencyService.getCurrencyInfo.bind(currencyService)
  };
};
