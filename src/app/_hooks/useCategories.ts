import { FILTERS_CATEGORIES_IDS } from '@/app/[locale]/results/_components/Navigation/mock';
import { Tag } from '@/app/api/getTags/types';
import { useCallback } from 'react';
import { useSearch } from '@/app/_contexts/searchContext';

export const useCategories = () => {
  const { tags } = useSearch();

  const getParentCategories = useCallback(() => {
    return tags.filter(({ tagId }) => FILTERS_CATEGORIES_IDS.includes(tagId));
  }, [tags]);

  const getSubCategories = useCallback(() => {
    return tags.filter(({ parentTagIds }) =>
      parentTagIds?.some((id) => FILTERS_CATEGORIES_IDS.includes(id)),
    );
  }, [tags]);

  const getAllAllowedCategories = () => {
    const mapCategories = (categories: Tag[]) => categories.map(({ tagId }) => tagId);

    return [...mapCategories(getParentCategories()), ...mapCategories(getSubCategories())];
  };

  const getFormattedCategories = useCallback(() => {
    const parentCategories = getParentCategories();
    const subCategories = getSubCategories();

    return parentCategories.map((parentCategory) => ({
      ...parentCategory,
      subCategories: subCategories.filter(({ parentTagIds }) =>
        parentTagIds?.includes(parentCategory.tagId),
      ),
    }));
  }, [getParentCategories, getSubCategories]);

  return {
    getParentCategories,
    getSubCategories,
    getFormattedCategories,
    allAllowedCategories: getAllAllowedCategories(),
  };
};
