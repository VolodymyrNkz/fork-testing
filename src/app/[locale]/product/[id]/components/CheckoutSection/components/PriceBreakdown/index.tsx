import { useBooking } from '@/app/_contexts/bookingContext';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/PriceBreakdown/styles';
import { useFormatter, useTranslations } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { formatPrice } from '@/app/_helpers/formatPrice';

export const PriceBreakdown = () => {
  const t = useTranslations('checkout');
  const format = useFormatter();
  const { currency } = getUserInfo();

  const { productBookingData } = useBooking();

  return (
    <div className={styles.root}>
      <div>{t('priceBreakdown')}</div>
      <div className={styles.price}>
        <div>
          {formatPrice({
            price: productBookingData?.totalPrice || 0,
            currency,
            format,
          })}
        </div>
        <ArrowIcon />
      </div>
    </div>
  );
};
