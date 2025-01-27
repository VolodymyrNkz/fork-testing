import { styles } from '@/app/[locale]/results/_components/Navigation/FilterPanel/styles';
import { CheckboxSection } from '@/app/[locale]/results/_components/Navigation/CheckboxSection';
import { ClockIcon } from '@/app/_icons/ClockIcon';
import { SpecialsIcon } from '@/app/_icons/SpecialsIcon';
import { Range } from '@/app/_components/Range';
import { RadioSection } from '@/app/[locale]/results/_components/Navigation/RadioSection';
import { DropdownSelect } from '@/app/_components/DropdownSelect';
import {
  FILTERS_RATING,
  SORTING,
  FILTERS_DURATION,
  FILTERS_SPECIALS,
} from '@/app/[locale]/results/_components/Navigation/mock';
import { useCategories } from '@/app/_hooks/useCategories';
import { AccordionSection } from '@/app/[locale]/results/_components/Navigation/AccordionSection';
import { useSearch } from '@/app/_contexts/searchContext';
import { useTranslations } from 'next-intl';

export const FilterPanel = () => {
  const { getFormattedCategories } = useCategories();
  const { isFreeText } = useSearch();
  const t = useTranslations();

  return (
    <div className={`${styles.root}`}>
      <div className={styles.textSection}>
        <h3 className={styles.sectionTitle}>{t('common.sortBy')}</h3>
        <DropdownSelect options={SORTING(t)} />
      </div>
      {/*Removed while we have no backend*/}
      {/*<CheckboxSection*/}
      {/*  filterKey="language"*/}
      {/*  title="Languages"*/}
      {/*  icon={<EarthIcon />}*/}
      {/*  className={styles.filterSection}*/}
      {/*  options={FILTERS_LANGUAGES}*/}
      {/*/>*/}
      <CheckboxSection
        filterKey="durationInMinutes"
        title={t('common.duration')}
        icon={<ClockIcon />}
        className={styles.filterSection}
        options={FILTERS_DURATION(t)}
      />
      <div className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>{t('common.price')}</h3>
        <Range className={styles.rangeWrapper} max={500} />
      </div>
      <RadioSection
        filterKey="rating"
        className={styles.filterSection}
        options={FILTERS_RATING(t)}
        title={t('common.rating')}
      />
      <CheckboxSection
        filterKey="flags"
        title={t('common.specials')}
        icon={<SpecialsIcon />}
        className={styles.filterSection}
        options={FILTERS_SPECIALS(t)}
      />
      {!isFreeText && (
        <AccordionSection className={styles.filterSection} data={getFormattedCategories()} />
      )}
    </div>
  );
};
