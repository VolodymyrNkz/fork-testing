import { Accordion } from '@/app/_components/Accordion';
import { FC } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/ProductOverview/styles';
import { getProductOverview } from '@/app/[locale]/product/[id]/service';
import { getTranslations } from 'next-intl/server';

interface ProductOverviewProps {
  productCode: string;
}

export const ProductOverview: FC<ProductOverviewProps> = async ({ productCode }) => {
  const t = await getTranslations('productPage');
  const { overview } = await getProductOverview(productCode);

  return (
    <div>
      <div className={styles.title}>{t('overview')}</div>
      <Accordion noPadding={false}>{overview}</Accordion>
    </div>
  );
};
