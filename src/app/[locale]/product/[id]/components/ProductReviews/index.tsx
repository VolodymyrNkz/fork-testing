import { FC } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/ProductReviews/styles';
import { Statistic } from '@/app/[locale]/product/[id]/components/ProductReviews/Statistic';
import { getProductReviewStatistic } from '@/app/[locale]/product/[id]/service';
import { Reviews } from '@/app/[locale]/product/[id]/components/ProductReviews/Reviews';
import { getTranslations } from 'next-intl/server';

interface ProductReviewsProps {
  productCode: string;
}

export const ProductReviews: FC<ProductReviewsProps> = async ({ productCode }) => {
  const t = await getTranslations('productPage');
  const productStatistic = await getProductReviewStatistic(productCode);
  if (!productStatistic.totalReviews) {
    return undefined;
  }

  return (
    <div className={styles.root} id="reviews">
      <div className={styles.title}>{t('reviews')}</div>
      <Statistic {...productStatistic} />
      <Reviews productCode={productCode} />
    </div>
  );
};
