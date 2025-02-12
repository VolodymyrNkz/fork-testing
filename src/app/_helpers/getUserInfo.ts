import { getCookie } from '@/app/_helpers/getCookie';
import { DEFAULT_DESTINATION_COUNTRY } from '@/app/const';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/app/_constants/common';

export type Currency = keyof typeof CURRENCIES;

export const getUserInfo = () => {
  const currency = getCookie('currency');
  const country = getCookie('country');

  return {
    currency: (currency?.toUpperCase() as Currency) || DEFAULT_CURRENCY,
    country: country || DEFAULT_DESTINATION_COUNTRY,
  };
};
