import React from 'react';
import { LocationIcon } from '@/app/_icons/LocationIcon';
import { styles } from './styles';
import { useTranslations } from 'next-intl';

export const EndPoint = ({
  title,
  locationName,
  isSameAsMeetingPoint,
}: {
  title: string;
  locationName: string;
  isSameAsMeetingPoint?: boolean;
}) => {
  const t = useTranslations('productPage');

  return (
    <div className={styles.listItem}>
      <div className={styles.iconWrapper}>
        <LocationIcon />
      </div>
      <div>
        <div className={styles.listItemTitle}>{title}</div>
        <div className={styles.listItemText}>
          {isSameAsMeetingPoint ? t('activityEnds') : locationName || ''}
        </div>
      </div>
    </div>
  );
};
