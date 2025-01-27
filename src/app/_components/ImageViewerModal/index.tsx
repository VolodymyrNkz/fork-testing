import React, { useEffect, useRef, useState } from 'react';
import { CrossIcon } from '@/app/_icons/CrossIcon';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { AvatarIcon } from '@/app/_icons/AvatarIcon';
import { styles } from '@/app/_components/ImageViewerModal/styles';
import { formatMMYYY } from '@/app/_helpers/formatDateRange';
import Image from 'next/image';
import { ImageViewerPhoto } from '@/app/_contexts/imageViewerContext';
import { useLocale, useTranslations } from 'next-intl';

interface ImageModalProps {
  photos: ImageViewerPhoto[];
  currentIndex: number;
  closeModal: () => void;
  handleChangeImage: (direction: number) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  photos,
  currentIndex,
  closeModal,
  handleChangeImage,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const [isExpanded, setIsExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const review = photos[currentIndex].review;

  const disabledNext = currentIndex + 1 === photos.length;
  const disabledPrev = !currentIndex;

  useEffect(() => {
    setIsExpanded(false);

    if (textRef.current) {
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
      const maxHeight = lineHeight * 2;

      if (textRef.current.scrollHeight > maxHeight) {
        setNeedsClamp(true);
      }
    }
  }, [review?.title]);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const nextImage = () => {
    if (disabledNext) {
      return null;
    }
    handleChangeImage(1);
  };

  const prevImage = () => {
    if (disabledPrev) {
      return;
    }
    handleChangeImage(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          {t('common.of', { first: currentIndex + 1, second: photos.length })}
          <CrossIcon className={styles.crossIcon} onClick={() => closeModal()} />
        </div>
        <div className={styles.navigation}>
          <ArrowIcon
            className={`${styles.arrow} ${disabledPrev ? styles.disabled : ''}`}
            onClick={() => prevImage()}
          />
          <ArrowIcon
            className={`${disabledNext ? styles.disabled : ''}`}
            onClick={() => nextImage()}
          />
        </div>
        <Image
          width={500}
          height={500}
          src={photos[currentIndex].url}
          alt={`Image ${currentIndex + 1}`}
          className={styles.image}
        />
        {review ? (
          <div className={styles.reviewContainer}>
            <div className={styles.reviewHeader}>
              {review.avatarUrl ? (
                <Image src={review.avatarUrl} alt="User avatar" width={24} height={24} />
              ) : (
                <AvatarIcon />
              )}

              <div className={styles.avatarWrapper}>
                <span className={styles.userName}>{review.userName}</span> •{' '}
                <span>{formatMMYYY(new Date(review.publishedDate), locale)}</span>
              </div>
            </div>
            <div className={styles.separator} />
            <div className={styles.reviewTitle}>{review.title}</div>
            <div>
              <div
                ref={textRef}
                className={`${isExpanded || !needsClamp ? '' : 'line-clamp-2'} ${styles.reviewText}`}
              >
                {review.text}
              </div>
              {needsClamp && (
                <button className={styles.toggleButton} onClick={toggleText}>
                  {isExpanded ? t('buttons.readLess') : t('buttons.readMore')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.reviewContainer}>
            <span className={styles.providerName}>{t('common.provider')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
