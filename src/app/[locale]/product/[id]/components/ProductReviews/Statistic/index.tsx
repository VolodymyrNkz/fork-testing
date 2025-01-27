'use client';
import React, { FC } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { styles } from '@/app/[locale]/product/[id]/components/ProductReviews/Statistic/styles';
import { CheckmarkRibbonIcon } from '@/app/_icons/CheckmarkRibbonIcon';
import { ProductReviewCount } from '@/app/api/productSearch/types';
import { useTranslations } from 'next-intl';

interface StatisticProps {
  totalReviews: number;
  averageRating: string | number;
  combined: ProductReviewCount[];
}

export const Statistic: FC<StatisticProps> = ({ totalReviews, combined, averageRating }) => {
  const t = useTranslations();

  return (
    <div className={styles.root}>
      <div className={styles.headerSection}>
        <div className={styles.circularProgressWrapper}>
          <CircularProgressbar
            value={+averageRating}
            minValue={0}
            maxValue={5}
            circleRatio={0.85}
            styles={buildStyles({
              rotation: 0.575,
              strokeLinecap: 'round',
              trailColor: '#EEF6F6',
              pathColor: '#00665A',
            })}
          />
          <div className={styles.ratingWrapper}>
            <div className={styles.totalRating}>{averageRating}</div>
            <div className={styles.maxRating}>{t('common.ofOne', { value: 5 })}</div>
          </div>
        </div>
        <div className={styles.totalReviews}>{t('common.reviews', { value: totalReviews })}</div>
      </div>
      <div className={styles.starsInfoSection}>
        <div className={styles.starsInfoSection}>
          {combined.reverse().map(({ rating, count }) => {
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={rating} className={styles.item}>
                <div>{t('common.stars', { value: rating })}</div>
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
                </div>
                <div>{count}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.adviceSection}>
        <CheckmarkRibbonIcon className={styles.icon} />
        <div className={styles.adviceText}>{t('productPage.totalReviews')}</div>
      </div>
    </div>
  );
};
