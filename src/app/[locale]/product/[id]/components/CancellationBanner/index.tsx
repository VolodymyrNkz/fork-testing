'use client';
import CheckMarkIcon from '@/app/_icons/CheckMarkIcon';
import { FC, useEffect } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/[locale]/product/[id]/components/CancellationBanner/styles';
import { InfoIcon } from '@/app/_icons/InfoIcon';
import {
  CancellationType,
  RefundEligibility,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { ONE_DAY } from '@/app/_constants/common';
import { formatDateToLongFormat, formatTimeToString } from '@/app/_helpers/formatDateRange';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { CancellationPolicyPopup } from '@/app/_components/CancellationPolicyPopup';
import { useBooking } from '@/app/_contexts/bookingContext';
import { useLocale, useTranslations } from 'next-intl';

interface CancellationBannerProps {
  cancellationType?: CancellationType;
  refundEligibility?: RefundEligibility[];
  cancelIfInsufficientTravelers?: boolean;
  cancelIfBadWeather?: boolean;
  travelDate?: Date | null;
  travelTime?: string;
}

export const CancellationBanner: FC<CancellationBannerProps> = ({
  cancellationType,
  refundEligibility = [],
  travelDate,
  travelTime,
  cancelIfInsufficientTravelers,
  cancelIfBadWeather,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { handleSetCancellationInfo } = useBooking();

  const isStandard = cancellationType === 'STANDARD';
  const isCustom = cancellationType === 'CUSTOM';
  const isSalesFinal = !isStandard && !isCustom;

  const isSpecial = travelDate || travelTime;
  const currentDate = new Date();

  const travelDateTime = travelDate
    ? new Date(`${travelDate.toISOString().split('T')[0]}T${travelTime || '00:00'}:00`)
    : null;

  const minDaysBeforeRefaund = refundEligibility.find(
    (item) => item.percentageRefundable === 100,
  )?.dayRangeMin;

  const partialRefund = refundEligibility.find(
    (item) => item.percentageRefundable !== 100 && item.percentageRefundable !== 0,
  );

  const noRefaund = refundEligibility.find((item) => item.percentageRefundable === 0)?.dayRangeMax;

  const minDateToFullRefund =
    minDaysBeforeRefaund && travelDateTime
      ? new Date(travelDateTime?.getTime() - (minDaysBeforeRefaund - 1) * ONE_DAY)
      : null;

  const minDateToPartialRefund =
    travelDateTime && partialRefund?.dayRangeMax
      ? new Date(travelDateTime?.getTime() - (partialRefund?.dayRangeMax - 1) * ONE_DAY)
      : null;

  const maxDateToPartialRefund =
    travelDateTime && partialRefund?.dayRangeMin
      ? new Date(travelDateTime?.getTime() - (partialRefund?.dayRangeMin - 1) * ONE_DAY)
      : null;

  const minDateToNoRefund =
    travelDateTime && noRefaund
      ? new Date(travelDateTime?.getTime() - (noRefaund - 1) * ONE_DAY)
      : null;

  const isFullRefund = minDateToFullRefund && currentDate < minDateToFullRefund;
  const isPartialRefund =
    minDateToPartialRefund &&
    maxDateToPartialRefund &&
    currentDate > minDateToPartialRefund &&
    currentDate < maxDateToPartialRefund;
  const isNoRefund = minDateToNoRefund && currentDate > minDateToNoRefund;

  const overallPolicyText = isStandard
    ? t('cancellationPolicy.upToDayHours')
    : isCustom
      ? t('cancellationPolicy.upToDaysInAdvance', { count: minDaysBeforeRefaund })
      : t('cancellationPolicy.noRefund');

  let dateSpecificText = t('cancellationPolicy.noRefund');

  if (isFullRefund && !isSalesFinal && minDateToFullRefund) {
    dateSpecificText = t('cancellationPolicy.fullRefundText', {
      time: formatTimeToString(minDateToFullRefund, locale),
      date: formatDateToLongFormat(locale, minDateToFullRefund, {
        year: undefined,
        month: 'short',
        weekday: undefined,
        day: 'numeric',
      }),
    });
  } else if (isPartialRefund) {
    dateSpecificText = t('cancellationPolicy.cancelUntil', {
      date: formatDateToLongFormat(locale, maxDateToPartialRefund, {
        year: undefined,
        month: 'short',
        weekday: undefined,
        day: 'numeric',
      }),
    });
  }

  const text = isSpecial ? dateSpecificText : overallPolicyText;
  const notAvailable = isNoRefund || isSalesFinal;
  const overallPolicyTitle = notAvailable
    ? t('common.nonRefundable')
    : t('common.freeCancellation');
  const title =
    isPartialRefund && !notAvailable
      ? t('cancellationPolicy.bookWithConfidence')
      : overallPolicyTitle;

  useEffect(() => {
    handleSetCancellationInfo({
      title: title,
      isAvailable: !notAvailable,
      subTitle: text,
    });
  }, [handleSetCancellationInfo, notAvailable, text, title]);

  return (
    <div className={`${styles.container} ${notAvailable ? styles.notAvailable : ''}`}>
      <div>
        {!notAvailable ? (
          <CheckMarkIcon className={styles.icon} />
        ) : (
          <InfoIcon className={styles.textDisabled} />
        )}
      </div>
      <div className={styles.contentWrapper}>
        <h3 className={`${styles.title} ${notAvailable ? styles.textDisabled : ''}`}>{title}</h3>
        <p className={styles.text}>{text}</p>
        <FullScreenPanel
          trigger={
            <button className={styles.button}>
              {t('buttons.showMore')}
              <ArrowIcon className={styles.arrowIcon} />
            </button>
          }
        >
          <CancellationPolicyPopup
            cancelIfInsufficientTravelers={cancelIfInsufficientTravelers}
            cancelIfBadWeather={cancelIfBadWeather}
            refundEligibility={refundEligibility}
            cancellationType={cancellationType}
          />
        </FullScreenPanel>
      </div>
    </div>
  );
};
