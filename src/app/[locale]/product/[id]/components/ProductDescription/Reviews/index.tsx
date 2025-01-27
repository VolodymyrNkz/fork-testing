'use client';
import { StarIconOutlined } from '@/app/_icons/StarIconOutlined';
import { FC } from 'react';
import { styles } from '@/app/[locale]/product/[id]/components/ProductDescription/Reviews/styles';
import { scroller } from 'react-scroll';
import { useTranslations } from 'next-intl';

interface ReviewsProps {
  averageRating?: number;
  totalReviews?: number;
}

export const Reviews: FC<ReviewsProps> = ({ averageRating, totalReviews }) => {
  const t = useTranslations('common');
  const handleScroll = () => {
    scroller?.scrollTo('reviews', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -20,
    });
  };

  return (
    <div className={styles.reviewsSection} onClick={handleScroll}>
      <StarIconOutlined />
      <span className={styles.rating}>{averageRating?.toFixed(1)}</span>
      <span className={styles.totalReviews}>({t('reviews', { value: totalReviews })})</span>
    </div>
  );
};
