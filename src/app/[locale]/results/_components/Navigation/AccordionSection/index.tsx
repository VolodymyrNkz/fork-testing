import React, { useState, FC } from 'react';
import { Tag } from '@/app/api/getTags/types';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { BookIcon } from '@/app/_icons/BookIcon';
import { useSearch } from '@/app/_contexts/searchContext';
import { CrossIcon } from '@/app/_icons/CrossIcon';
import { styles } from '@/app/[locale]/results/_components/Navigation/AccordionSection/styles';
import { useLocale, useTranslations } from 'next-intl';

interface FormattedCategory {
  subCategories: Tag[];
  tagId: number;
  allNamesByLocale: { [p: string]: string };
  parentTagIds?: number[];
}

interface AccordionProps {
  data: FormattedCategory[];
  className?: string;
}

export const AccordionSection: FC<AccordionProps> = ({ data, className }) => {
  const t = useTranslations('filterPanel');
  const locale = useLocale();

  const [openIds, setOpenIds] = useState<number[]>([]);
  const { handleSetFilters, filters } = useSearch();
  const filterKey = 'tags';

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id],
    );
  };

  const handleToggleCategory = (tagId: number) => {
    handleSetFilters(filterKey, tagId);
  };

  return (
    <div className={className}>
      <div className={styles.titleWrapper}>
        {<BookIcon />}
        <h3 className={styles.title}>{t('categories')}</h3>
      </div>
      <div className={styles.accordionContainer}>
        {data.map(({ tagId, allNamesByLocale, subCategories }) => {
          const isOpen = openIds.includes(tagId);

          return (
            <div key={tagId} className={styles.categoryWrapper}>
              <div className={styles.categoryHeader} onClick={() => toggleAccordion(tagId)}>
                {allNamesByLocale[locale]}
                <ArrowIcon
                  className={`${styles.arrowIcon} ${
                    isOpen ? styles.arrowOpen : styles.arrowClosed
                  }`}
                />
              </div>
              <div
                className={`${styles.categoryContent} ${
                  isOpen ? styles.contentOpen : styles.contentClosed
                }`}
              >
                <div className={styles.subCategoryList}>
                  {subCategories?.map(({ tagId, allNamesByLocale }) => {
                    const isActive = filters?.tags?.includes(tagId);

                    return (
                      <div
                        className={`${styles.subCategoryItem} ${
                          isActive ? styles.activeSubCategory : ''
                        }`}
                        onClick={() => handleToggleCategory(tagId)}
                        key={tagId}
                      >
                        {allNamesByLocale[locale]}
                        {isActive && <CrossIcon />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
