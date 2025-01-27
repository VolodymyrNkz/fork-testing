import { API_ROUTE_PREFIX, getDefaultHeaders } from '@/app/_constants/api';
import { getUserInfo } from '@/app/_helpers/getUserInfo';

const cacheStorage: any = {};

export async function getCurrencyRate(source: string) {
  const { currency } = getUserInfo();

  if (cacheStorage[`${currency}-${source}`]) {
    return cacheStorage[`${currency}-${source}`];
  }

  const response = await fetch(`${API_ROUTE_PREFIX}exchangeRates`, {
    method: 'POST',
    body: JSON.stringify({
      sourceCurrencies: [source],
      targetCurrencies: [currency],
    }),
    headers: getDefaultHeaders(),
  });

  const data = await response.json();

  const currencyRate = data.rates[0].rate || 1;
  cacheStorage[`${currency}-${source}`] = currencyRate;

  return currencyRate;
}
