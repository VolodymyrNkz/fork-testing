import { getProductHints } from '@/app/[locale]/product/[id]/service';
import { styles } from '@/app/[locale]/product/[id]/components/ProductHints/styles';
import { ClockIcon } from '@/app/_icons/ClockIcon';
import { formatMinutesToTimeString } from '@/app/_helpers/formatDateRange';
import { CarIcon } from '@/app/_icons/CarIcon';
import { ActivityIcon } from '@/app/_icons/ActivityIcon';
import { PlanetIcon } from '@/app/_icons/PlanetIcon';
import { FC } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';

interface ProductHintProps {
  productCode: string;
}

const ticketLabel = {
  MOBILE_ONLY: 'productPage.mobile',
  PAPER: 'productPage.paper',
};

export const ProductHints: FC<ProductHintProps> = async ({ productCode }) => {
  const t = await getTranslations();
  const locale = await getLocale();

  const { ticket, duration, pickup, languages, isApprox } = await getProductHints(productCode);

  return (
    <div className={styles.hintsContainer}>
      {duration && (
        <div className={styles.hint}>
          <ClockIcon className={styles.icon} />
          <div className={styles.hintContent}>
            <div className={styles.hintTitle}>{t('common.duration')}</div>
            <div className={styles.hintText}>
              {formatMinutesToTimeString(t, duration)} {isApprox ? t('common.approx') : ''}
            </div>
          </div>
        </div>
      )}
      {pickup ? (
        <div className={styles.hint}>
          <CarIcon className={styles.icon} />
          <div className={styles.hintContent}>
            <div className={styles.hintTitle}>{t('productPage.pickup')}</div>
            <div className={styles.hintText}>{t('productPage.offered')}</div>
          </div>
        </div>
      ) : undefined}
      {ticket?.length ? (
        <div className={styles.hint}>
          <ActivityIcon className={styles.icon} />
          <div className={styles.hintContent}>
            <div className={styles.hintTitle}>{t('productPage.ticket')}</div>
            <div className={styles.hintText}>
              {ticket.map((name) => t(ticketLabel[name])).join(', ')}
            </div>
          </div>
        </div>
      ) : undefined}
      {languages?.length ? (
        <div className={styles.hint}>
          <PlanetIcon className={styles.icon} />
          <div className={styles.hintContent}>
            <div className={styles.hintTitle}>{t('productPage.languages')}</div>
            <div className={styles.hintText}>
              {languages
                .map((code) => new Intl.DisplayNames([locale], { type: 'language' }).of(code))
                .join(', ')}
            </div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
};
