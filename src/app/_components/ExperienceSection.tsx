'use client';
import React, { FC, useRef } from 'react';
import { useSearch } from '@/app/_contexts/searchContext';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { GTM_IDS } from '@/app/_constants/gtm';

const styles = {
  section: 'mb-8',
  sectionTitle: 'text-[18px] text-2xl font-bold text-gray-800',
  sliderContainer: '-me-4',
  slider: 'flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide select-none',
};

interface ExperienceSectionProps {
  title: string;
  id: number;
  children: React.ReactNode;
  tagId?: number;
  destinationName: string;
  rating?: { from: number; to: number };
  flags?: string[];
}

const ExperienceSection: FC<ExperienceSectionProps> = ({
  title,
  children,
  tagId,
  destinationName,
  rating,
  flags,
  id,
}) => {
  const t = useTranslations('buttons');
  const { handleSetFilters, handleSetDestinationFilter } = useSearch();
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    sliderRef.current!.classList.add('cursor-grabbing');
    sliderRef.current!.classList.remove('cursor-grab');
    startX.current = e.pageX - sliderRef.current!.offsetLeft;
    scrollLeft.current = sliderRef.current!.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const slider = sliderRef.current!;
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX.current;
    slider.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    sliderRef.current!.classList.remove('cursor-grabbing');
    sliderRef.current!.classList.add('cursor-grab');

    const slider = sliderRef.current!;
    const cardWidth = 288;
    const scrollPosition = slider.scrollLeft;
    const index = Math.round(scrollPosition / cardWidth);
    slider.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
  };

  const handleSeeAll = () => {
    if (tagId) handleSetFilters('tags', tagId);
    if (flags?.length) handleSetFilters('flags', flags);
    if (rating) handleSetFilters('rating', rating);
    handleSetDestinationFilter(destinationName);
    router.push('/results');
  };

  return (
    <div className={styles.section}>
      <div className={styles.sliderContainer} id={GTM_IDS.shelfId(id)}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p
            id={GTM_IDS.seeAll}
            className="cursor-pointer pr-4 font-bold text-primary transition-colors duration-200 hover:text-gray-500"
            onClick={handleSeeAll}
          >
            {t('seeAll')}
          </p>
        </div>
        <div
          ref={sliderRef}
          className={`${styles.slider} cursor-grab`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
