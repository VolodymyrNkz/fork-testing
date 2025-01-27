import { FC } from 'react';
import { getProductInclusions } from '@/app/[locale]/product/[id]/service';
import { styles } from '@/app/[locale]/product/[id]/components/ProductInclusions/styles';
import { CheckIcon } from '@/app/_icons/CheckIcon';
import { CrossIcon } from '@/app/_icons/CrossIcon';
import { getTranslations } from 'next-intl/server';

interface ProductInclusionsProps {
  productCode: string;
}

export const ProductInclusions: FC<ProductInclusionsProps> = async ({ productCode }) => {
  const t = await getTranslations('productPage');
  const { inclusions, exclusions } = await getProductInclusions(productCode);

  return (
    <div>
      <div className={styles.title}>{t('whatIncluded')}</div>
      <div className={styles.listWrapper}>
        {inclusions?.map((inclusion, index) => (
          <div key={index} className={styles.listItem} style={{ wordBreak: 'break-word' }}>
            <CheckIcon className={styles.checkIcon} />
            <div>
              <div className={styles.listItemTitle}>
                {inclusion.title ? inclusion.title : inclusion.description}
              </div>
              <div className={styles.listItemText}>{inclusion.title && inclusion.description}</div>
            </div>
          </div>
        ))}
        {exclusions?.map((exclusion, index) => (
          <div key={index} className={styles.listItem} style={{ wordBreak: 'break-word' }}>
            <CrossIcon className={`${styles.checkIcon} ${styles.disabled}`} />
            <div>
              <div className={`${styles.listItemTitle} ${styles.disabled}`}>
                {exclusion.title ? exclusion.title : exclusion.description}
              </div>
              <div className={`${styles.listItemText} ${styles.disabled}`}>
                {exclusion.title && exclusion.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
