'use client';
import { CommonButton } from '@/app/_components/CommonButton';
import React from 'react';
import { defaultFilters, useSearch } from '@/app/_contexts/searchContext';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProductFilters } from '@/app/api/types';

export const ButtonSearch = () => {
  const t = useTranslations('buttons');
  const router = useRouter();
  const { searchInputValue, filters, handleSetBulkFilters } = useSearch();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || '');

  const handleClick = () => {
    if (searchInputValue) {
      const startDate = filters?.startDate;
      const endDate = filters?.endDate;
      params.set('page', '1');
      params.set('searchTerm', searchInputValue.split(',')[0]);
      router.push(`${NAVIGATION_ROUTES.results}?${params.toString()}`);
      handleSetBulkFilters({
        ...defaultFilters,
        startDate,
        endDate,
      } as ProductFilters);
    }
  };

  return (
    <CommonButton
      label={t('search')}
      onClick={handleClick}
      disabled={!searchInputValue}
      className="w-full"
    />
  );
};
