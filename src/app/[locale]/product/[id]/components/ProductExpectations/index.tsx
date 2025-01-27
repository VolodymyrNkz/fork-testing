import { FC } from 'react';
import { getAttractionName, getProductExpectations } from '@/app/[locale]/product/[id]/service';
import { styles } from '@/app/[locale]/product/[id]/components/ProductExpectations/styles';
import { Accordion } from '@/app/_components/Accordion';
import { StepAccordion } from '@/app/_components/StepAccordion';
import { StandardItem } from '@/app/[locale]/product/[id]/components/ProductExpectations/StandardItem';
import { DayItem } from '@/app/[locale]/product/[id]/components/ProductExpectations/DayItem';
import { getTranslations } from 'next-intl/server';

interface ProductExpectationsProps {
  productCode: string;
}

export const ProductExpectations: FC<ProductExpectationsProps> = async ({ productCode }) => {
  const t = await getTranslations('productPage');
  const { itineraryType, description, itineraryItems, days } =
    await getProductExpectations(productCode);

  if (['ACTIVITY', 'UNSTRUCTURED'].includes(itineraryType) && description) {
    return (
      <div className={styles.root}>
        <div className={styles.title}>{t('whatToExpect')}</div>
        <Accordion>{description}</Accordion>
      </div>
    );
  }

  if (itineraryType === 'STANDARD') {
    return (
      <div className={styles.root}>
        <div className={styles.title}>{t('whatToExpect')}</div>
        <div
          className={`${itineraryItems?.length === 1 && !description ? styles.containerNoBorder : styles.container}`}
        >
          {description && <Accordion noPadding>{description}</Accordion>}
          {itineraryItems?.length && (
            <StepAccordion withoutContainer={!description} maxItems={2}>
              {itineraryItems.map(
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
                  const attractionTitle = pointOfInterestLocation.attractionId
                    ? await getAttractionName(pointOfInterestLocation.attractionId)
                    : '';

                  return (
                    <StandardItem
                      title={attractionTitle}
                      key={index}
                      index={index}
                      description={description}
                      duration={duration?.fixedDurationInMinutes}
                      admissionIncluded={admissionIncluded}
                      passByWithoutStopping={passByWithoutStopping}
                    />
                  );
                },
              )}
            </StepAccordion>
          )}
        </div>
      </div>
    );
  }

  if (itineraryType === 'MULTI_DAY_TOUR') {
    return (
      <div className={styles.root}>
        <div className={styles.title}>{t('whatToExpect')}</div>
        <div className={styles.container}>
          {description && <Accordion noPadding>{description}</Accordion>}
          {days?.length && days.map((day, index) => <DayItem {...day} key={index} />)}
        </div>
      </div>
    );
  }

  return undefined;
};
