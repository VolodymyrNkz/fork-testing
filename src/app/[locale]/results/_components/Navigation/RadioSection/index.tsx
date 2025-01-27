import React, { FC } from 'react';
import { Radio } from '@/app/_components/Radio';
import { FilledStars } from '@/app/_components/FilledStars';
import { styles } from '@/app/[locale]/results/_components/Navigation/RadioSection/styles';
import { useSearch } from '@/app/_contexts/searchContext';
import { FromToFilter } from '@/app/api/types';
import { useTranslations } from 'next-intl';

interface ISingleOption {
  name: string;
  value: FromToFilter;
}

interface RadioSectionProps {
  title: string;
  options: ISingleOption[];
  className?: string;
  filterKey: 'rating';
}

export const RadioSection: FC<RadioSectionProps> = ({ title, className, options, filterKey }) => {
  const { handleSetFilters, filters, loading } = useSearch();
  const t = useTranslations('buttons');

  const handleChange = (value: FromToFilter) => {
    handleSetFilters(filterKey, value);
  };

  return (
    <div className={className}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>
          {title}
          <div className={styles.clear} onClick={() => handleChange({} as FromToFilter)}>
            {filters?.[filterKey]?.from && t('clear')}
          </div>
        </h3>
      </div>
      <div className={styles.optionsList}>
        {options.map(({ value, name }) => (
          <Radio
            disabled={loading}
            className={styles.radioWrapper}
            key={name}
            content={<FilledStars fill={value?.from} />}
            checked={filters?.[filterKey]?.from === value?.from}
            onChange={() => handleChange(value)}
          />
        ))}
      </div>
    </div>
  );
};
