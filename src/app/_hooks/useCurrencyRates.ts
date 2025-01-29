import { API_ROUTE_PREFIX, getDefaultHeaders } from '@/app/_constants/api';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { CURRENCIES } from '@/app/_constants/common';
import { ExchangeRatesBody, ExchangeRatesResponse } from '@/app/api/exchangeRates/types';

const cacheStorage: Record<string, Record<string, number>> = {};

export async function getCurrencyRates(source: string) {
  const { currency } = getUserInfo();

  if (cacheStorage[source] && cacheStorage[source][currency]) {
    return cacheStorage[source][currency];
  }

  const url =
    typeof window === 'undefined'
      ? `${process.env.VIATOR_API_URL}exchange-rates`
      : `${API_ROUTE_PREFIX}exchangeRates`;

  const body: ExchangeRatesBody = {
    sourceCurrencies: [source],
    targetCurrencies: Object.keys(CURRENCIES),
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: getDefaultHeaders(),
  });

  const data: ExchangeRatesResponse = await response.json();

  if (!cacheStorage[source]) {
    cacheStorage[source] = {};
  }

  data.rates.forEach((item) => {
    if (item.targetCurrency && item.rate) {
      cacheStorage[source][item.targetCurrency] = item.rate;
    }
  });

  return cacheStorage[source][currency] || 1;
}
