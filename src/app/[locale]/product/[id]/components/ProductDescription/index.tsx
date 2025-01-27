import { FC } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/ProductDescription/styles';
import { NavBackButton } from '@/app/_components/NavBackButton';
import { Slider } from '@/app/_components/Slider';
import { ImageGrid } from '@/app/[locale]/product/[id]/components/ProductDescription/ImageGrid';
import { getProductDescription } from '@/app/[locale]/product/[id]/service';
import { DollarIcon } from '@/app/_icons/DollarIcon';
import { Reviews } from '@/app/[locale]/product/[id]/components/ProductDescription/Reviews';
import { getTranslations, getFormatter } from 'next-intl/server';
import { getUserInfo } from '@/app/_helpers/getUserInfo';

interface ProductDescriptionProps {
  productCode: string;
  priceBeforeDiscount?: string;
  price: string;
}

export const ProductDescription: FC<ProductDescriptionProps> = async ({
  productCode,
  price,
  priceBeforeDiscount,
}) => {
  const t = await getTranslations();
  const format = await getFormatter();
  const { currency } = getUserInfo();

  const { photoGroups, title, averageRating, totalReviews, pricingType } =
    await getProductDescription(productCode);

  const withDiscount = !!priceBeforeDiscount && priceBeforeDiscount !== price;

  return (
    <div className={styles.root}>
      <NavBackButton title={t('buttons.experienceDetails')} />
      <div className={styles.title}>{title}</div>
      {totalReviews ? (
        <Reviews totalReviews={totalReviews} averageRating={averageRating} />
      ) : undefined}
      <div className={styles.pricingSection}>
        <DollarIcon />
        <span>{t('common.from')}</span>
        <span className={`${styles.price} ${withDiscount ? styles.oldPrice : ''}`}>
          {format.number(Number(withDiscount ? priceBeforeDiscount : price), {
            style: 'currency',
            currency,
            currencyDisplay: 'narrowSymbol',
          })}
        </span>
        {withDiscount && (
          <span className={styles.discount}>
            {format.number(Number(price), {
              style: 'currency',
              currency,
              currencyDisplay: 'narrowSymbol',
            })}
          </span>
        )}
        <span>{pricingType === 'PER_PERSON' ? t('common.perPerson') : t('common.perGroup')}</span>
      </div>
      <div className="mx-[-21px]">
        <Slider cardWidth={'90%'}>
          {photoGroups.map((group, index) => (
            <ImageGrid
              chunkNumber={index}
              key={index}
              photos={group}
              isFirst={index === 0}
              isLast={photoGroups.length - 1 === index}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};
