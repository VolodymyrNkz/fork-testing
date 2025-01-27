import { FC, useEffect, useState } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityControls/GuestSelect/styles';
import { MinusIcon } from '@/app/_icons/MinusIcon';
import { PlusIcon } from '@/app/_icons/PlusIcon';
import { AGE_BANDS } from '@/app/const';
import { Guests, useBooking } from '@/app/_contexts/bookingContext';
import { AgeBandType } from '@/app/api/types';
import { ProductAvailabilityInfo } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityControls';
import { useTranslations } from 'next-intl';

interface GuestSelectProps {
  bookingRequirements: ProductAvailabilityInfo;
}

export const GuestSelect: FC<GuestSelectProps> = ({ bookingRequirements }) => {
  const t = useTranslations();
  const { maxTravelersPerBooking, ageBands, requiresAdultForBooking, defaultGuests } =
    bookingRequirements;
  const { handleSetTemporaryGuests, guests } = useBooking();
  const [travelersCount, setTravelersCount] = useState<Guests>(guests || defaultGuests);

  const totalTravelers = Object.values(travelersCount).reduce((sum, count) => sum + count, 0);

  const increaseCount = (ageBand: AgeBandType, max: number) => {
    setTravelersCount((prev) => {
      if (totalTravelers < maxTravelersPerBooking && prev[ageBand] < max) {
        return { ...prev, [ageBand]: prev[ageBand] + 1 };
      }
      return prev;
    });
  };

  const decreaseCount = (ageBand: AgeBandType, min: number) => {
    setTravelersCount((prev) => {
      if (prev[ageBand] > min) {
        return { ...prev, [ageBand]: prev[ageBand] - 1 };
      }
      return prev;
    });
  };

  useEffect(() => {
    handleSetTemporaryGuests(travelersCount);
  }, [handleSetTemporaryGuests, travelersCount]);

  return (
    <div>
      <div>{t('productPage.upToTravelers', { maxTravelersPerBooking })}</div>
      <div className={styles.pickerWrapper}>
        {ageBands
          ?.filter((item) => item.maxTravelersPerBooking)
          ?.sort(
            ({ ageBand: firstAgeBand = 'ADULT' }, { ageBand: secondAgeBand = 'ADULT' }) =>
              AGE_BANDS.indexOf(firstAgeBand) - AGE_BANDS.indexOf(secondAgeBand),
          )
          ?.map(
            ({
              ageBand = 'ADULT',
              endAge,
              startAge,
              minTravelersPerBooking = 0,
              maxTravelersPerBooking = 0,
            }) => (
              <div key={ageBand} className={styles.selectItem}>
                <div>
                  <div className={styles.ageBand}>
                    {t(`common.passengerType.${ageBand.toLowerCase()}`, { count: 1 })} (
                    {t('common.age')} {startAge}-{endAge})
                  </div>
                  <div className={styles.travelersTotal}>
                    {t('common.minimum')}: {minTravelersPerBooking}, {t('common.maximum')}:{' '}
                    {maxTravelersPerBooking}
                  </div>
                </div>
                <div className={styles.picker}>
                  <button
                    className={`${styles.pickerButton} ${
                      travelersCount[ageBand] > minTravelersPerBooking
                        ? styles.pickerButtonActive
                        : styles.pickerButtonDisabled
                    }`}
                    onClick={() => decreaseCount(ageBand, minTravelersPerBooking)}
                    disabled={travelersCount[ageBand] <= minTravelersPerBooking}
                  >
                    <MinusIcon />
                  </button>
                  <div className={styles.count}>{travelersCount[ageBand]}</div>
                  <button
                    className={`${styles.pickerButton} ${
                      travelersCount[ageBand] < maxTravelersPerBooking &&
                      totalTravelers < maxTravelersPerBooking
                        ? styles.pickerButtonActive
                        : styles.pickerButtonDisabled
                    }`}
                    onClick={() => increaseCount(ageBand, maxTravelersPerBooking)}
                    disabled={
                      travelersCount[ageBand] >= maxTravelersPerBooking ||
                      totalTravelers >= maxTravelersPerBooking
                    }
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ),
          )}
      </div>
      <div>
        {Object.values(travelersCount).every((count) => !count) && (
          <div className={styles.adultRequired}>{t('fallbacks.onePersonRequired')}</div>
        )}
        {requiresAdultForBooking &&
          !Object.entries(travelersCount).some(
            ([ageBand, count]) => ['ADULT', 'SENIOR'].includes(ageBand) && count > 0,
          ) && <div className={styles.adultRequired}>{t('fallbacks.oneAdultRequired')}</div>}
      </div>
    </div>
  );
};
