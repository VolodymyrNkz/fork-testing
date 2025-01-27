import { ProductSearchFlag } from '@/app/api/types';

export const getProductCancellationPolicy = (flags: ProductSearchFlag[]) =>
  flags?.includes('FREE_CANCELLATION') ? 'common.freeCancellation' : '';

export const getProductDuration = (t: any, duration?: number) => {
  if (!duration) return t('fallbacks.unknownDuration');

  const totalHours = duration / 60;
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  if (days >= 1) {
    return t('common.time.daysAndHours', {
      days,
      hours: remainingHours > 0 ? Math.floor(remainingHours) : undefined,
    });
  }

  if (totalHours >= 1) {
    return t('common.time.hoursOnly', {
      hours: Math.floor(totalHours),
    });
  }

  return t('common.time.minutesOnly', {
    minutes: duration,
  });
};
