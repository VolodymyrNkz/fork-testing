import { FC } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/OrderSummary/styles';
import { useBooking } from '@/app/_contexts/bookingContext';
import { OrderInfo } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/OrderInfo';
import { useFormatter, useTranslations } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { CancellationStatus } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/CheckoutSection';
import { formatPrice } from '@/app/_helpers/formatPrice';

interface OrderSummaryProps {
  email: string;
  title?: string;
  cancellationStatus: CancellationStatus;
}

export const OrderSummary: FC<OrderSummaryProps> = ({ title, cancellationStatus, email }) => {
  const t = useTranslations('checkout');
  const format = useFormatter();
  const { productBookingData } = useBooking();
  const { currency } = getUserInfo();

  return (
    <div className={styles.root}>
      <OrderInfo
        email={email}
        sectionTitle={t('orderSummary')}
        productTitle={title}
        cancellationStatus={cancellationStatus}
      />
      <div className={styles.totalPriceSection}>
        <div>{t('totalPrice')}</div>
        <div className={styles.price}>
          {formatPrice({
            price: productBookingData?.totalPrice || 0,
            currency,
            format,
          })}
        </div>
      </div>
    </div>
  );
};
