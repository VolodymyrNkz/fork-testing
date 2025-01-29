import { FC, useEffect, useRef, useState } from 'react';
import { StartTime } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityTimeSlots';
import { styles } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityTimeSlots/TimeSlot/styles';
import { useBooking } from '@/app/_contexts/bookingContext';
import { PaxMixItemWithPrice } from '@/app/api/getProductTimeslots/types';
import { AGE_BANDS } from '@/app/const';
import { CommonButton } from '@/app/_components/CommonButton';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { parseHTML } from '@/app/_helpers/parseHTML';
import { useFloating } from '@/app/_hooks/useFloating';
import {
  CancellationType,
  PricingType,
  RefundEligibility,
} from '@/app/api/getSingleProduct/[productCode]/types';
import Skeleton from '@/app/_components/Skeleton';
import { CancellationBanner } from '@/app/[locale]/product/[id]/components/CancellationBanner';
import { formatTimeToString } from '@/app/_helpers/formatDateRange';
import { scroller } from 'react-scroll';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { formatPrice } from '@/app/_helpers/formatPrice';

interface TimeSlotProps {
  productCode: string;
  multiple: boolean;
  selected: boolean;
  lineItems: PaxMixItemWithPrice[];
  pricingType: PricingType;
  maxTravelersPerBooking: number;
  disabled: boolean;
  productOptionCode: string;
  title?: string;
  description?: string;
  startTimes?: StartTime[];
  totalPrice?: number;
  cancellationType?: CancellationType;
  refundEligibility?: RefundEligibility[];
  cancelIfBadWeather?: boolean;
  cancelIfInsufficientTravelers?: boolean;
}

export const TimeSlot: FC<TimeSlotProps> = ({
  title,
  description,
  startTimes,
  selected,
  multiple,
  totalPrice,
  lineItems,
  pricingType,
  maxTravelersPerBooking,
  productCode,
  cancellationType,
  refundEligibility,
  cancelIfInsufficientTravelers,
  cancelIfBadWeather,
  productOptionCode,
  disabled,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const { currency } = getUserInfo();

  const {
    travelTime,
    travelDate,
    handleSetTravelTime,
    loading,
    holdLoading,
    proceedBooking,
    productBookingData,
  } = useBooking();
  const { styles: floatingStyles, isVisible, setTargetRef } = useFloating();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  const checkOverflow = () => {
    const element = descriptionRef.current;

    if (element) {
      const isContentOverflowing = element.scrollHeight > element.clientHeight;
      setIsOverflowing(isContentOverflowing);
    }
  };

  const handleProceedBooking = () => {
    if (totalPrice && pricingType) {
      scroller.scrollTo(`timeslot-${productOptionCode}`, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -100,
      });

      proceedBooking(
        {
          paxMix: lineItems,
          productCode,
          totalPrice,
          pricingType,
          cancellationType,
          productOptionCode,
          description: description,
        },
        productOptionCode !== productBookingData?.productOptionCode,
      );
    }
  };

  useEffect(() => {
    if (selected) {
      checkOverflow();
    } else {
      setIsOverflowing(false);
    }
  }, [description, selected]);

  useEffect(() => {
    if (selected) {
      setTargetRef(buttonRef.current);
    }
  }, [selected, setTargetRef]);

  if (loading) {
    return (
      <div className={styles.content}>
        <Skeleton mt={20} mb={20} width="100%" height={20} />
        <Skeleton />
        <Skeleton height={40} mb={0} />
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={`${styles.root} ${styles.disabled}`}>
        <div className={styles.header}>
          {multiple && <div className={`${styles.radioDisabled} ${styles.radio}`}>{selected}</div>}
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`timeslot-${productOptionCode}`}
      className={`${selected ? styles.rootSelected : ''} ${styles.root}`}
    >
      <div className={styles.header}>
        {multiple && (
          <div className={`${selected ? styles.radioSelected : ''} ${styles.radio}`}>
            {selected}
          </div>
        )}
        <div className={styles.title}>{title}</div>
      </div>
      {!selected && <div className={styles.divider} />}
      <div className={styles.content}>
        {description && selected && (
          <>
            <div
              ref={descriptionRef}
              className={`${styles.description} ${isExpanded ? '' : styles.descriptionCollapsed}`}
            >
              {parseHTML(description)}
            </div>
            {isOverflowing && (
              <div onClick={toggleDescription} className={styles.readMoreButton}>
                {isExpanded ? t('buttons.readLess') : t('buttons.readMore')}{' '}
                <ArrowIcon
                  className={`${isExpanded ? '-rotate-90' : 'rotate-90'} ${styles.arrowIcon}`}
                />
              </div>
            )}
          </>
        )}
        {selected && (
          <>
            <div className={styles.timeSlotsWrapper}>
              {startTimes?.map(({ time, available }, index) => (
                <div
                  key={index}
                  onClick={() => available && time && handleSetTravelTime(time)}
                  className={`${!available ? styles.timeSlotUnavailable : ''} ${styles.timeSlot} ${
                    travelTime === time ? styles.timeSlotSelected : ''
                  }`}
                >
                  {formatTimeToString(time || '', locale)}
                </div>
              ))}
            </div>
            <CancellationBanner
              cancelIfBadWeather={cancelIfBadWeather}
              cancelIfInsufficientTravelers={cancelIfInsufficientTravelers}
              travelDate={travelDate}
              travelTime={travelTime}
              cancellationType={cancellationType}
              refundEligibility={refundEligibility}
            />
          </>
        )}
        <div className={styles.priceSection}>
          <div className={styles.guests}>
            {lineItems
              .sort((a, b) => AGE_BANDS.indexOf(a.ageBand) - AGE_BANDS.indexOf(b.ageBand))
              .map(({ numberOfTravelers, ageBand, subtotalPrice }) => (
                <div key={ageBand}>
                  {pricingType === 'UNIT' ? (
                    <>{t('productPage.perGroup', { maxTravelersPerBooking })}</>
                  ) : (
                    <>
                      {numberOfTravelers}{' '}
                      {t(`common.passengerType.${ageBand.toLowerCase()}`, {
                        count: numberOfTravelers,
                      })}{' '}
                      x{' '}
                      {formatPrice({
                        price: subtotalPrice.price.recommendedRetailPrice / numberOfTravelers,
                        currency,
                        format,
                      })}
                    </>
                  )}
                </div>
              ))}
          </div>
          <div className={styles.totalPrice}>
            {formatPrice({
              price: totalPrice || 0,
              currency,
              format,
            })}
          </div>
        </div>
        {selected && (
          <>
            <div ref={buttonRef} className={styles.buttonWrapper}>
              <CommonButton
                disabled={holdLoading}
                onClick={handleProceedBooking}
                full
                label={t('buttons.bookNow')}
              />
            </div>
            <div
              className={`${floatingStyles.floatingWrapper} ${
                isVisible ? floatingStyles.visible : floatingStyles.invisible
              }`}
            >
              <CommonButton
                disabled={holdLoading}
                onClick={handleProceedBooking}
                full
                label={t('buttons.bookNow')}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
