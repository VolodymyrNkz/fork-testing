'use client';
import { Chip } from '@/app/_components/Chip';
import { FilterIcon } from '@/app/_icons/FilterIcon';
import { styles } from '@/app/[locale]/results/_components/Navigation/FiltersRow/styles';
import React, { useEffect, useRef, useState } from 'react';
import { FilterPanel } from '@/app/[locale]/results/_components/Navigation/FilterPanel';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { CommonButton } from '@/app/_components/CommonButton';
import { defaultFilters, SearchFilters, useSearch } from '@/app/_contexts/searchContext';
import { useCategories } from '@/app/_hooks/useCategories';
import Skeleton from '@/app/_components/Skeleton';
import { useLocale, useTranslations } from 'next-intl';

export const FiltersRow = () => {
  const locale = useLocale();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const {
    totalCount,
    handleClearFilters,
    handleSetFilters,
    filters,
    isFreeText,
    handleSetBulkFilters,
  } = useSearch();
  const { getParentCategories } = useCategories();
  const prevFilters = useRef<string>(JSON.stringify(defaultFilters));
  const t = useTranslations();

  const togglePanel = (clearFilters = true) => {
    if (!isPanelOpen) {
      prevFilters.current = JSON.stringify(filters);
    } else {
      const filtersChanged = JSON.stringify(filters) !== prevFilters.current;

      if (filtersChanged && clearFilters) {
        handleSetBulkFilters(JSON.parse(prevFilters.current));
      }
    }
    setIsPanelOpen(!isPanelOpen);
  };

  const categories = getParentCategories();

  const handleCategorySelect = (tagId: number) => {
    handleSetFilters('tags', tagId);
  };

  const updateFiltersIfNeeded = (
    filters: Partial<SearchFilters> | null,
    handleSetBulkFilters: (filters: SearchFilters) => void,
  ) => {
    const currentStartDate = filters?.startDate;
    const currentEndDate = filters?.endDate;
    const previousStartDate = JSON.parse(prevFilters.current).startDate;
    const previousEndDate = JSON.parse(prevFilters.current).endDate;

    if (
      currentStartDate === '' ||
      (previousStartDate === undefined && previousEndDate === undefined)
    ) {
      return;
    }

    if (currentStartDate !== previousStartDate || currentEndDate !== previousEndDate) {
      handleSetBulkFilters({
        ...defaultFilters,
        ...(currentStartDate && { startDate: currentStartDate }),
        ...(currentEndDate && { endDate: currentEndDate }),
      } as any);
    }
  };

  useEffect(() => {
    updateFiltersIfNeeded(filters, handleSetBulkFilters);
  }, [filters?.startDate, filters?.endDate]);

  return (
    <div className={styles.root}>
      <div className={styles.slideRow}>
        <BottomSheet
          title={t('filterPanel.filters')}
          isOpen={isPanelOpen}
          toggle={togglePanel}
          triggerComponent={
            <Chip>
              <FilterIcon />
            </Chip>
          }
          footer={
            <>
              <CommonButton
                onClick={handleClearFilters}
                label={t('buttons.clear')}
                filled={false}
              />
              <CommonButton
                onClick={() => togglePanel(false)}
                label={t('buttons.seeExperiences', { count: totalCount })}
              />
            </>
          }
        >
          <FilterPanel />
        </BottomSheet>
        {!isFreeText &&
          (categories.length
            ? categories
                .sort(
                  (a, b) =>
                    Number(filters?.tags?.includes(b.tagId)) -
                    Number(filters?.tags?.includes(a.tagId)),
                )
                .map(({ tagId, allNamesByLocale }) => (
                  <Chip
                    key={tagId}
                    selected={filters?.tags?.includes(tagId)}
                    onClick={() => handleCategorySelect(tagId)}
                  >
                    {allNamesByLocale[locale]}
                  </Chip>
                ))
            : new Array(3)
                .fill(null)
                .map((_, index) => <Skeleton key={index} height={30} mb={0} />))}
      </div>
    </div>
  );
};
