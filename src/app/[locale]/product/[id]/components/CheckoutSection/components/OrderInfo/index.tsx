import Image from 'next/image';
import { PersonIcon } from '@/app/_icons/PersonIcon';
import { AGE_BANDS } from '@/app/const';
import { CalendarIcon } from '@/app/_icons/CalendarIcon';
import { formatDateToLongFormat, formatTimeToString } from '@/app/_helpers/formatDateRange';
import CheckMarkIcon from '@/app/_icons/CheckMarkIcon';
import { InfoIcon } from '@/app/_icons/InfoIcon';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/OrderInfo/styles';
import { useBooking } from '@/app/_contexts/bookingContext';
import { useImageViewer } from '@/app/_contexts/imageViewerContext';
import { FC } from 'react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { CancellationPolicyPopup } from '@/app/_components/CancellationPolicyPopup';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { CancellationStatus } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/CheckoutSection';
import { EmailIcon } from '@/app/_icons/EmailIcon';

interface OrderInfoProps {
  email: string;
  sectionTitle?: string;
  productTitle?: string;
  cancellationStatus: CancellationStatus;
}

export const OrderInfo: FC<OrderInfoProps> = ({
  sectionTitle,
  productTitle,
  cancellationStatus,
  email,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const { currency } = getUserInfo();
  const {
    cancellationType,
    cancelIfInsufficientTravelers,
    cancelIfBadWeather,
    refundEligibility = [],
  } = cancellationStatus;

  const { travelTime, productBookingData, travelDate, cancellationInfo } = useBooking();
  const { providerPhotos } = useImageViewer();

  return (
    <>
      {sectionTitle && <div className={styles.title}>{sectionTitle}</div>}
      <div className={styles.container}>
        <div className={styles.item}>
          <Image
            className={styles.productImage}
            src={providerPhotos[0]}
            alt="Product thumbnail"
            width={110}
            height={110}
          />
          <div className={styles.productTitle}>{productTitle}</div>
        </div>

        <div className={styles.item}>
          <PersonIcon color={'#495B69'} />
          <div className={styles.itemInfo}>
            <div className={styles.itemTitle}>{t('checkout.persons')}</div>
            {productBookingData?.paxMix
              .sort((a, b) => AGE_BANDS.indexOf(a.ageBand) - AGE_BANDS.indexOf(b.ageBand))
              .map(({ numberOfTravelers, ageBand, subtotalPrice }) => (
                <div className={styles.personInfo} key={ageBand}>
                  {numberOfTravelers}{' '}
                  {t(`common.passengerType.${ageBand.toLowerCase()}`, { count: numberOfTravelers })}
                  {' x '}
                  {format.number(
                    Number(subtotalPrice.price.recommendedRetailPrice / numberOfTravelers) || 0,
                    {
                      style: 'currency',
                      currency,
                      currencyDisplay: 'narrowSymbol',
                    },
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className={styles.item}>
          <CalendarIcon color={'#495B69'} />
          <div className={styles.itemInfo}>
            <div className={styles.itemTitle}>{t('common.date')}</div>
            <div>
              {travelDate
                ? formatDateToLongFormat(locale, travelDate, { year: undefined, month: 'long' })
                : ''}
              , • {formatTimeToString(travelTime, locale)}
            </div>
          </div>
        </div>

        {email && (
          <div className={styles.item}>
            <EmailIcon />
            <div className={styles.itemInfo}>
              <div className={styles.itemTitle}>{t('inputs.email')}</div>
              <div>{email}</div>
            </div>
          </div>
        )}

        <div className={styles.item}>
          {cancellationInfo?.isAvailable ? (
            <CheckMarkIcon className={styles.iconActive} />
          ) : (
            <InfoIcon className={styles.iconDisabled} />
          )}
          <div className={styles.itemInfo}>
            <div className={styles.itemTitle}>{cancellationInfo?.title}</div>
            <div>{cancellationInfo?.subTitle}</div>
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
      </div>
    </>
  );
};
