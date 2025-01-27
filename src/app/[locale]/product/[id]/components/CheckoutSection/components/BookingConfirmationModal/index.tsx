'use client';
import React, { FC, useEffect } from 'react';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { CheckIcon } from '@/app/_icons/CheckIcon';
import { CrossOutlinedIcon } from '@/app/_icons/CrossOutlinedIcon';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/BookingConfirmationModal/styles';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { CommonButton } from '@/app/_components/CommonButton';
import { BookingData } from '@/app/_contexts/bookingContext';
import { BookingStatus, RejectionReasonCode } from '@/app/api/bookProduct/types';
import { AGE_BANDS, REJECT_REASON_CONFIG } from '@/app/const';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { formatDateToLongFormat, formatTimeToString } from '@/app/_helpers/formatDateRange';
import { DollarIcon } from '@/app/_icons/DollarIcon';
import { ClockIcon } from '@/app/_icons/ClockIcon';
import { PersonIcon } from '@/app/_icons/PersonIcon';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';
import { GTM_EVENTS } from '@/app/_constants/gtm';
import { useSearch } from '@/app/_contexts/searchContext';
import { FILTERS_CATEGORIES_IDS } from '@/app/[locale]/results/_components/Navigation/mock';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  handleClose: () => void;
  reason?: RejectionReasonCode;
  status?: BookingStatus;
  currency?: string;
  productTags?: number[];
  travelDate?: Date | null;
  travelTime: string;
  productTitle: string;
  productBookingData: BookingData | null;
}

export const BookingConfirmationModal: FC<BookingConfirmationModalProps> = ({
  isOpen,
  reason,
  status,
  handleClose,
  currency,
  productTags,
  travelDate,
  travelTime,
  productBookingData,
  productTitle,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const { tags } = useSearch();

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || '');

  const isConfirmed = status === 'CONFIRMED';
  const buttonText = reason ? REJECT_REASON_CONFIG[reason].buttonText : 'Explore more experiences';

  const title = t.rich(`checkout.bookingConfirmation.${isConfirmed ? 'confirmed' : 'rejected'}`, {
    br: () => <br />,
  });

  const subtitle = isConfirmed ? (
    <div className={styles.subtitle}>
      {t.rich('checkout.bookingConfirmation.confirmedSubtitle', {
        b: (chunks) => <b>{chunks}</b>,
      })}
    </div>
  ) : (
    t.rich(`checkout.bookingConfirmation.rejectionReasons.${reason}`, {
      div: (chunks) => <div className={styles.subtitle}>{chunks}</div>,
      b: (chunks) => <b>{chunks}</b>,
    })
  );

  const handleRedirect = () => {
    const redirect = reason ? REJECT_REASON_CONFIG[reason].redirectPage : NAVIGATION_ROUTES.home;
    handleClose();
    if (!redirect.includes('/')) {
      const [key, value] = redirect.split('=');
      params.set(key, value);
      router.push(`?${params.toString()}`);
    } else {
      router.push(redirect);
    }
  };

  useEffect(() => {
    if (isConfirmed && productTags?.length && tags.length) {
      const allTagIds = new Set<number>();

      tags.forEach((tag) => {
        if (productTags.includes(tag.tagId)) {
          allTagIds.add(tag.tagId);
          tag.parentTagIds?.forEach((parentId: number) => allTagIds.add(parentId));
        }
      });

      const tagNamesString = tags
        .filter((tag) => allTagIds.has(tag.tagId) && FILTERS_CATEGORIES_IDS.includes(tag.tagId))
        .map((tag) => tag.allNamesByLocale['en'])
        .join(', ');

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: GTM_EVENTS.bookingConfirmed,
        category: tagNamesString,
      });
    }
  }, [productTags, isConfirmed, tags]);

  return (
    <FullScreenPanel
      closeButton={false}
      isOpen={isOpen}
      footer={<CommonButton onClick={handleRedirect} full label={buttonText} />}
    >
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <div className={styles.textContainer}>
            {isConfirmed ? (
              <div className={`${styles.iconContainer} ${styles.iconContainerConfirmed}`}>
                <CheckIcon className={styles.icon} />
              </div>
            ) : (
              <div className={`${styles.iconContainer} ${styles.iconContainerRejected}`}>
                <CrossOutlinedIcon className={styles.icon} />
              </div>
            )}
            <div className={styles.title}>{title}</div>
            <div>{subtitle}</div>
          </div>
          {isConfirmed && (
            <>
              <div className={styles.productTitle}>{productTitle}</div>
              <div className={styles.overviewSection}>
                <div className={styles.overviewItem}>
                  <PersonIcon className={styles.icon} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{t('checkout.persons')}</div>
                    {productBookingData?.paxMix
                      .sort((a, b) => AGE_BANDS.indexOf(a.ageBand) - AGE_BANDS.indexOf(b.ageBand))
                      .map(({ numberOfTravelers, ageBand }) => (
                        <div key={ageBand}>
                          {numberOfTravelers}{' '}
                          {t(`common.passengerType.${ageBand.toLowerCase()}`, {
                            count: numberOfTravelers,
                          })}
                        </div>
                      ))}
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <ClockIcon className={styles.icon} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{t('checkout.dateAndTime')}</div>
                    {travelDate
                      ? formatDateToLongFormat(locale, travelDate, {
                          year: undefined,
                          month: 'long',
                        })
                      : ''}
                    , • {formatTimeToString(travelTime, locale)}
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <DollarIcon className={styles.icon} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{t('checkout.totalCost')}</div>
                    {format.number(Number(productBookingData?.totalPrice) || 0, {
                      style: 'currency',
                      currency,
                      currencyDisplay: 'narrowSymbol',
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </FullScreenPanel>
  );
};
