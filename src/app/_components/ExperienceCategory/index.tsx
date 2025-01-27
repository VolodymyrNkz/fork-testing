'use client';
import Image from 'next/image';
import { FC } from 'react';
import { useSearch } from '@/app/_contexts/searchContext';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

interface ExperienceCategoryProps {
  name: string;
  tagId: number;
  destinationName: string;
  imgSrc: string;
}

const ExperienceCategory: FC<ExperienceCategoryProps> = ({
  name,
  tagId,
  destinationName,
  imgSrc,
}) => {
  const t = useTranslations('landingPage');
  const { handleSetFilters, handleSetDestinationFilter } = useSearch();
  const router = useRouter();
  const handleExperienceCategoryNavigation = () => {
    const filterKey = 'tags';
    handleSetFilters(filterKey, tagId);
    handleSetDestinationFilter(destinationName);
    router.push('/results');
  };

  return (
    <div
      className="relative mr-6 w-[288px] flex-shrink-0 snap-start"
      onClick={handleExperienceCategoryNavigation}
    >
      <div className="relative flex w-[288px] flex-col overflow-hidden rounded-lg border border-gray-300 bg-[#020F1966]">
        <div className="relative">
          <Image
            draggable="false"
            width={288}
            height={216}
            src={imgSrc}
            alt={name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-md px-4 py-2 text-lg font-semibold text-white text-shadow-primary">
              {t(name)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCategory;
