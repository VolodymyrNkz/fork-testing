'use client';
import { PRODUCTS_PER_PAGE, useSearch } from '@/app/_contexts/searchContext';
import Skeleton from '@/app/_components/Skeleton';
import { styles } from '@/app/[locale]/results/_components/ResultList/styles';
import ExperienceCard from '@/app/_components/ExperienceCard';

import {
  getProductCancellationPolicy,
  getProductDuration,
} from '@/app/_helpers/getProductFormattedInfo';
import { getBestImageVariant } from '@/app/_helpers/getBestImageVariant';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Pagination } from '@/app/[locale]/results/_components/ResultList/Pagination';
import { useEffect } from 'react';

export const ProductList = () => {
  const {
    products,
    totalCount,
    loading,
    handleUpdateCurrentPage,
    currentPage,
    handleClearFilters,
  } = useSearch();
  const t = useTranslations();

  useEffect(() => handleClearFilters, [handleClearFilters]);

  const handlePageChange = (page: number) => {
    handleUpdateCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className={styles.root}>
      {loading ? (
        <>
          <Skeleton height={18} width={100} />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height={350} />
          ))}
        </>
      ) : totalCount ? (
        <>
          <div className={styles.totalCount}>
            {t('results.totalExperiences', { count: totalCount })}
          </div>
          <div className={styles.productList}>
            {products.map((product) => {
              const fromPrice = product.pricing.summary.fromPrice;
              const priceWithDiscount = product.pricing.summary.fromPriceBeforeDiscount;
              const cancellationPolicy = getProductCancellationPolicy(product?.flags);
              return (
                <Link
                  key={product.productCode}
                  href={`${NAVIGATION_ROUTES.product}${product.productCode}?price=${fromPrice}${
                    priceWithDiscount ? `&discount=${priceWithDiscount}` : ''
                  }`}
                >
                  <ExperienceCard
                    full
                    rating={product.reviews?.combinedAverageRating}
                    title={product.title}
                    cancellationPolicy={cancellationPolicy ? t(cancellationPolicy) : ''}
                    duration={getProductDuration(
                      t,
                      product.duration?.fixedDurationInMinutes ||
                        product.duration.variableDurationFromMinutes,
                    )}
                    imageSrc={getBestImageVariant(product.images, 350)}
                    originalPrice={String(priceWithDiscount)}
                    price={String(fromPrice)}
                    reviews={product.reviews?.totalReviews}
                  />
                </Link>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.fallback}>{t('fallbacks.couldNotFind')}</div>
          <div className={styles.fallback}>
            {t.rich('fallbacks.tryResearch', {
              b: (chunks) => <b className={styles.highlighted}>{chunks}</b>,
            })}
          </div>
        </>
      )}
    </div>
  );
};
