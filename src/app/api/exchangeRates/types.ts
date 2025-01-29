interface ExchangeRate {
  sourceCurrency?: string;
  targetCurrency?: string;
  rate?: number;
  lastUpdated?: string;
  expiry?: string;
}

export interface ExchangeRatesBody {
  sourceCurrencies: string[];
  targetCurrencies: string[];
}

export interface ExchangeRatesResponse {
  rates: ExchangeRate[];
}
