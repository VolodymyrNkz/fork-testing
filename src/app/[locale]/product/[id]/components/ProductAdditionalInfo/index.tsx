import { Accordion } from '@/app/_components/Accordion';
import { FC } from 'react';
import { getProductAdditionalInfo } from '@/app/[locale]/product/[id]/service';
import { styles } from '@/app/[locale]/product/[id]/components/ProductAdditionalInfo/styles';
import { getTranslations } from 'next-intl/server';

interface ProductAdditionalInfoProps {
  productCode: string;
}

export const ProductAdditionalInfo: FC<ProductAdditionalInfoProps> = async ({ productCode }) => {
  const t = await getTranslations('productPage');
  const { additionalInfo } = await getProductAdditionalInfo(productCode);

  return (
    <div>
      <div className={styles.title}>{t('additionalInfo')}</div>
      <Accordion maxItems={4}>
        {additionalInfo.map((point, index) => (
          <div className={styles.listItem} key={index}>
            <div className={styles.dot}>•</div>
            <div className={styles.text}>{point}</div>
          </div>
        ))}
      </Accordion>
    </div>
  );
};
