'use client';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ProductReview, ReviewsBody, ReviewsResponse } from '@/app/api/getReviews/types';
import Skeleton from '@/app/_components/Skeleton';
import { styles } from '@/app/[locale]/product/[id]/components/ProductReviews/Reviews/styles';
import Image from 'next/image';
import { AvatarIcon } from '@/app/_icons/AvatarIcon';
import { formatMMYYY } from '@/app/_helpers/formatDateRange';
import { API_ROUTES, getDefaultHeaders } from '@/app/_constants/api';
import { useImageViewer } from '@/app/_contexts/imageViewerContext';
import { useLocale, useTranslations } from 'next-intl';
import { useRequest } from '@/app/_hooks/useRequest';

interface ReviewsProps {
  productCode: string;
}

export const Reviews: FC<ReviewsProps> = ({ productCode }) => {
  const t = useTranslations();
  const createRequest = useRequest();

  const locale = useLocale();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const { openModalWithReviewsPhotos, reviews: initialReviews } = useImageViewer();

  const firstReviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current?.offsetHeight > 100 && !containerHeight) {
      setContainerHeight(containerRef.current?.offsetHeight);
    }
  }, [containerHeight, reviews]);

  const fetchReviews = useCallback(
    async (page: number, count: number) => {
      try {
        const data = await createRequest<ReviewsResponse, ReviewsBody>({
          endpoint: API_ROUTES.getReviews,
          headers: getDefaultHeaders(),
          body: {
            productCode,
            provider: 'ALL',
            count,
            start: page,
          },
        });

        if (data && data.reviews && data.reviews.length > 0) {
          setReviews((prev) => [...prev, ...data.reviews]);
          setCurrentPage((prev) => prev + count);
          setTotalCount(data.totalReviewsSummary.totalReviews || 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
        setHasMore(false);
      }
    },
    [productCode],
  );

  useEffect(() => {
    if (initialReviews?.reviews?.length) {
      setReviews((prev) => [...prev, ...initialReviews?.reviews?.slice(0, 2)]);
      setCurrentPage((prev) => prev + 2);
      setTotalCount(initialReviews.totalReviewsSummary?.totalReviews || 0);
    }
  }, [initialReviews]);

  const handleSeeMore = async () => {
    await fetchReviews(currentPage, 20);
    setInitialLoad(false);
  };

  const handleFetchNextChunk = () => {
    if (reviews.length < totalCount) {
      fetchReviews(currentPage, 20);
    }
  };

  return (
    <div className={styles.root}>
      <div
        ref={containerRef}
        className={styles.container}
        style={initialLoad ? { overflow: 'hidden' } : { maxHeight: containerHeight || 0 }}
        id="scrollableContainer"
      >
        <InfiniteScroll
          scrollableTarget="scrollableContainer"
          dataLength={reviews.length}
          next={handleFetchNextChunk}
          hasMore={hasMore}
          loader={reviews.length < totalCount && <Skeleton height={100} />}
        >
          {reviews.map((review, index) => (
            <div key={index} className={styles.review} ref={index === 0 ? firstReviewRef : null}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  {review.avatarUrl ? (
                    <Image
                      className={styles.userAvatar}
                      width={40}
                      height={40}
                      src={review.avatarUrl}
                      alt="User avatar"
                    />
                  ) : (
                    <AvatarIcon className={styles.avatarIcon} />
                  )}
                  <div className={styles.aboutReview}>
                    <div className={styles.textBold}>{review.userName || 'User'}</div>
                    <div className={styles.publishedDate}>
                      {formatMMYYY(new Date(review.publishedDate), locale)}
                    </div>
                  </div>
                </div>
                <div className={styles.ratingSection}>
                  <span className={styles.userRating}>{review.rating}</span>
                  <span>/</span>
                  <span>5</span>
                </div>
              </div>
              <div className={styles.photosList}>
                {review.photosInfo !== undefined &&
                  review.photosInfo?.slice(0, 4).map((photos, index) => {
                    const targetWidth = 50;

                    const bestVariant = photos.photoVersions.reduce((best, current) => {
                      return Math.abs(current.width - targetWidth) <
                        Math.abs(best.width - targetWidth)
                        ? current
                        : best;
                    }, photos.photoVersions[0]);

                    const rotationAngle = index % 2 === 0 ? -6 : 3;

                    return (
                      <div
                        onClick={() => {
                          openModalWithReviewsPhotos(review.reviewReference);
                        }}
                        key={index}
                        className={`${styles.photoContainer}`}
                        style={{ transform: `rotate(${rotationAngle}deg)` }}
                      >
                        <Image
                          className={styles.photo}
                          width={50}
                          height={50}
                          src={bestVariant.url}
                          alt="Product Image"
                        />

                        {index === 3 && review.photosInfo && review.photosInfo.length >= 4 && (
                          <div className={styles.overlay}>+{review.photosInfo.length - 3}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className={styles.textBold}>{review.title}</div>
              <div className={styles.reviewText}>{review.text}</div>
            </div>
          ))}
        </InfiniteScroll>
        <div
          className={styles.bottomGradient}
          style={{ position: initialLoad ? 'absolute' : 'sticky' }}
        />
      </div>
      {initialLoad && totalCount > 2 && (
        <div className="mt-4 text-center">
          <button onClick={handleSeeMore} className={styles.button}>
            {t('buttons.seeMoreReviews', {
              reviews:
                totalCount -
                (firstReviewRef.current && firstReviewRef.current.offsetHeight > 260 ? 1 : 2),
            })}
          </button>
        </div>
      )}
    </div>
  );
};
