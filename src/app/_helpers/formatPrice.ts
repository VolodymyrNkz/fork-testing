import { createFormatter } from 'next-intl';
import { DEFAULT_CURRENCY } from '@/app/_constants/common';

interface FormatPrice {
  price: number | undefined;
  format: ReturnType<typeof createFormatter>;
  maximumFractionDigits?: number;
  currency?: string;
}

export function formatPrice({
  currency,
  price = 0,
  format,
  maximumFractionDigits = 2,
}: FormatPrice): string {
  if (currency === 'CHF') {
    return `₣ ${format.number(price, {
      style: 'decimal',
      maximumFractionDigits,
    })}`;
  }

  if (currency === 'SEK') {
    return `kr ${format.number(price, {
      style: 'decimal',
      maximumFractionDigits,
    })}`;
  }

  return format.number(price, {
    style: 'currency',
    currency: currency || DEFAULT_CURRENCY,
    maximumFractionDigits,
    currencyDisplay: 'narrowSymbol',
  });
}
