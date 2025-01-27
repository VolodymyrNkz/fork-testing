import { FC } from 'react';
import { ItineraryItems } from '@/app/api/getSingleProduct/[productCode]/types';
import { styles } from '@/app/[locale]/product/[id]/components/ProductExpectations/DayItem/styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { StepAccordion } from '@/app/_components/StepAccordion';
import { StandardItem } from '@/app/[locale]/product/[id]/components/ProductExpectations/StandardItem';
import { getAttractionName } from '@/app/[locale]/product/[id]/service';
import { useTranslations } from 'next-intl';

interface DayItemProps {
  dayNumber: number;
  title?: string;
  items: ItineraryItems[];
}

export const DayItem: FC<DayItemProps> = ({ dayNumber, items, title }) => {
  const t = useTranslations('common');

  return (
    <details className={`${styles.root} group`}>
      <summary className={styles.summary}>
        <div className={styles.header}>
          <div className={styles.dayNumber}>Day {dayNumber}</div>
          <ArrowIcon className={`${styles.arrowIcon} group-open:-rotate-90`} />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.stops}>{t('stops', { count: items.length })}</div>
      </summary>
      <StepAccordion maxItems={2} withoutContainer>
        {items.map(
          async (
            {
              description,
              pointOfInterestLocation,
              admissionIncluded,
              duration,
              passByWithoutStopping,
            },
            index,
          ) => {
            const attractionTile = pointOfInterestLocation.attractionId
              ? await getAttractionName(pointOfInterestLocation.attractionId)
              : '';

            return (
              <StandardItem
                key={index}
                index={index}
                description={description}
                duration={duration?.fixedDurationInMinutes}
                admissionIncluded={admissionIncluded}
                passByWithoutStopping={passByWithoutStopping}
                title={attractionTile}
              />
            );
          },
        )}
      </StepAccordion>
    </details>
  );
};
