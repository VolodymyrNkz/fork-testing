'use client';
import { FC, useState, useEffect, useRef } from 'react';
import { Admission } from '@/app/api/getSingleProduct/[productCode]/types';
import { styles } from '@/app/[locale]/product/[id]/components/ProductExpectations/StandardItem/styles';
import { formatMinutesToTimeString } from '@/app/_helpers/formatDateRange';
import { useTranslations } from 'next-intl';

interface StandardItemProps {
  passByWithoutStopping: boolean;
  index: number;
  title?: string;
  description?: string;
  duration?: number;
  admissionIncluded?: Admission;
}

export const StandardItem: FC<StandardItemProps> = ({
  passByWithoutStopping,
  admissionIncluded,
  description,
  title,
  duration,
  index,
}) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const el = descriptionRef.current;
      if (el) {
        setIsOverflowing(el.scrollHeight > el.clientHeight);
      }
    };

    checkOverflow();

    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [description]);

  const toggleDescription = () => setIsExpanded(!isExpanded);

  return (
    <div
      data-id={passByWithoutStopping ? 'passBy' : index + 1}
      className={`${styles.standardItem} ${passByWithoutStopping ? styles.standardItemPassBy : ''}`}
    >
      {title && (
        <div
          className={`${passByWithoutStopping ? styles.titlePassBy : ''} ${styles.standardItemTitle}`}
        >
          {title}
          {passByWithoutStopping && (
            <span className={styles.additionalInfo}> ({t('common.passBy')})</span>
          )}
        </div>
      )}
      {description && (
        <div>
          <div
            ref={descriptionRef}
            className={`${passByWithoutStopping ? styles.titlePassBy : ''} ${styles.description} ${isExpanded ? '' : styles.descriptionClamped}`}
          >
            {description}
          </div>
          {isOverflowing && (
            <button onClick={toggleDescription} className={styles.showMoreButton}>
              {isExpanded ? t('buttons.showLess') : t('buttons.showMore')}
            </button>
          )}
        </div>
      )}
      <div className={styles.additionalInfo}>
        {!passByWithoutStopping && (
          <>
            {!!duration && <span>{formatMinutesToTimeString(t, duration)}</span>}
            {title && duration && <span className={styles.dot}> • </span>}
            {title && (
              <span>
                {admissionIncluded === 'YES'
                  ? t('productPage.admissionTicketIncluded')
                  : t('productPage.admissionTicketFree')}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
