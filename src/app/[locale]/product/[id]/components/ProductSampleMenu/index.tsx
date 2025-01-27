import { FC } from 'react';
import { getProductSampleMenu } from '@/app/[locale]/product/[id]/service';
import { styles } from '@/app/[locale]/product/[id]/components/ProductSampleMenu/styles';

interface ProductSampleMenuProps {
  productCode: string;
}

export const ProductSampleMenu: FC<ProductSampleMenuProps> = async ({ productCode }) => {
  const { menu } = await getProductSampleMenu(productCode);

  if (!menu) {
    return undefined;
  }

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.title}>Sample Menu</div>
        <div className={styles.listWrapper}>
          {menu.map((item, index) => (
            <div className={styles.listItem} key={index}>
              <div className={styles.listItemTitle}>{item.course.toLocaleLowerCase()}</div>
              <div className={styles.name}>{item.dishName}</div>
              <div>{item.dishDescription}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
