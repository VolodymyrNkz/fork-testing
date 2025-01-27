import { FC, ReactNode, useState } from 'react';
import { styles } from '@/app/[locale]/results/_components/Navigation/CheckboxSection/styles';
import { Checkbox } from '@/app/_components/Checkbox';
import { ArrowButton } from '@/app/_components/ArrowButton';
import { FilterKeys, SearchFilters, useSearch } from '@/app/_contexts/searchContext';
import { FromToFilter } from '@/app/api/types';
import { useTranslations } from 'next-intl';

interface ISingleOption {
  name: string;
  value: SearchFilters[FilterKeys];
  helperText?: string;
}

interface CheckboxSectionProps {
  title: string;
  filterKey: FilterKeys;
  icon: ReactNode;
  options: ISingleOption[];
  className?: string;
}

export const CheckboxSection: FC<CheckboxSectionProps> = ({
  title,
  icon,
  className,
  options,
  filterKey,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { filters, handleSetDurationFilter, handleSetFilters, loading } = useSearch();
  const t = useTranslations('buttons');

  const isDurationInMinutes = filterKey === 'durationInMinutes';

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleChange = (value: SearchFilters[FilterKeys]) => {
    if (isDurationInMinutes) {
      handleSetDurationFilter(value as FromToFilter);
    } else {
      handleSetFilters(filterKey, value);
    }
  };

  const checkIsDisabled = (value: FromToFilter) => {
    if (loading) {
      return true;
    }

    if (isDurationInMinutes) {
      const selectedValueFrom = filters?.[filterKey]?.from;
      const selectedValueTo = filters?.[filterKey]?.to;
      const toValue = value?.to;
      const fromValue = value?.from;

      if (selectedValueFrom !== undefined && selectedValueTo !== undefined) {
        return (
          toValue < selectedValueFrom ||
          fromValue > selectedValueTo ||
          (toValue < selectedValueTo && fromValue > selectedValueFrom)
        );
      }
    }
  };

  const isChecked = (value: SearchFilters[FilterKeys]) => {
    if (isDurationInMinutes) {
      const selectedValueFrom = filters?.[filterKey]?.from;
      const selectedValueTo = filters?.[filterKey]?.to;
      const toValue = (value as FromToFilter)?.to;
      const fromValue = (value as FromToFilter)?.from;

      return (
        selectedValueFrom !== undefined &&
        selectedValueTo !== undefined &&
        fromValue >= selectedValueFrom &&
        toValue <= selectedValueTo
      );
    } else if (Array.isArray(filters?.[filterKey])) {
      return (filters?.[filterKey] as string[]).includes(value as string);
    } else {
      return filters?.[filterKey] === value;
    }
  };

  return (
    <div className={className}>
      <div className={styles.titleWrapper}>
        {icon}
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={`${styles.optionsList} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        {options.map(({ name, helperText, value }, index) => {
          return (
            <Checkbox
              checked={isChecked(value)}
              disabled={checkIsDisabled(value as FromToFilter)}
              key={index}
              label={name}
              onChange={() => {
                handleChange(value);
              }}
              helperText={helperText}
            />
          );
        })}
      </div>
      {options.length > 6 && (
        <ArrowButton onClick={toggleExpansion} label={isExpanded ? t('seeLess') : t('seeMore')} />
      )}
    </div>
  );
};
