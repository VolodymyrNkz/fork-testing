'use client';
import React from 'react';
import { useProductLocations } from '@/app/[locale]/product/[id]/_hooks/useProductLocations';
import { SingleProductResponse } from '@/app/api/getSingleProduct/[productCode]/types';
import { styles } from './styles';
import { RedemptionPoints } from '@/app/[locale]/product/[id]/components/ProductMeetingAndPickup/RedemtionPoints';
import { LocationPoint } from '@/app/[locale]/product/[id]/components/ProductMeetingAndPickup/LocationPoint';
import Loading from '@/app/[locale]/loading';
import { useTranslations } from 'next-intl';
import { MapPinIcon } from '@/app/_icons/MapPinIcon';
import { LocationIcon } from '@/app/_icons/LocationIcon';

interface ProductMeetingAndPickupProps {
  product: SingleProductResponse;
}

export const ProductMeetingAndPickup = ({ product }: ProductMeetingAndPickupProps) => {
  const t = useTranslations();

  const {
    startLocations,
    endLocations,
    pickupLocations,
    pickupDetails,
    redemptionLocations,
    pickupOptionType,
    redemptionType,
    loading,
    error,
  } = useProductLocations(product);

  if (loading) {
    return <Loading />;
  }

  // TODO: we need custom error handling in case this case fails
  if (error) {
    return null;
  }

  return (
    <div>
      <div className={styles.title}>{t('productPage.meetingAndPickup')}</div>
      <div className={styles.listWrapper}>
        {!!pickupLocations?.length && (
          <LocationPoint
            title={t('productPage.pickupPoint')}
            locations={pickupLocations}
            icon={<MapPinIcon />}
          >
            {!!pickupDetails && (
              <>
                <h4 className="text-text font-bold">{t('productPage.pickupDetails')}</h4>
                <div className="mb-4 ps-4 text-xs text-textSecondary">{pickupDetails}</div>
                {pickupOptionType === 'PICKUP_AND_MEET_AT_START_POINT' && (
                  <span className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 rounded-lg border bg-white px-3 py-1 uppercase">
                    {t('common.or')}
                  </span>
                )}
              </>
            )}
          </LocationPoint>
        )}
        {!!startLocations?.length && (
          <LocationPoint
            title={t('productPage.meetingPoint')}
            locations={startLocations}
            icon={<MapPinIcon />}
          />
        )}
        {!!endLocations?.length && (
          <LocationPoint
            title={t('productPage.endPoint')}
            locations={endLocations}
            icon={<LocationIcon />}
          />
        )}
      </div>

      {redemptionType === 'DIFFERENT_LOCATION' && redemptionLocations && (
        <div className={styles.listWrapper}>
          <RedemptionPoints title={t('productPage.ticketPoint')} points={redemptionLocations} />
        </div>
      )}
    </div>
  );
};
