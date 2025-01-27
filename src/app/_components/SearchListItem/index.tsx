import { FC } from 'react';
import Image from 'next/image';
import { ActivityIcon } from '@/app/_icons/ActivityIcon';
import { MapPinIcon } from '@/app/_icons/MapPinIcon';
import { styles } from '@/app/_components/SearchListItem/styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { LocationIcon } from '@/app/_icons/LocationIcon';
import { useSearch } from '@/app/_contexts/searchContext';

export interface SearchListItemProps {
  title: string;
  subtitle: string;
  type?: SearchItemType;
  imgUrl?: string;
  filled?: boolean;
  tag?: number;
  productCode?: string;
  price?: number;
  priceWithDiscount?: number;
  onClick?: () => void;
}
export type SearchItemType = 'tag' | 'product' | 'destination';

export const SearchListItem: FC<SearchListItemProps> = ({
  title,
  imgUrl,
  type,
  subtitle,
  filled,
  tag,
  onClick,
}) => {
  const { handleSetFilters, handleSetDestinationFilter, handleClearFilters, setSearchInputValue } =
    useSearch();

  const handleSelectSuggestion = () => {
    if (type === 'tag') {
      handleClearFilters();
      handleSetFilters('tags', tag);
      handleSetDestinationFilter(subtitle);
    } else if (type === 'destination') {
      handleSetDestinationFilter(title);
    }

    setSearchInputValue(`${title}, ${subtitle.split('|')[0]}`);

    onClick?.();
  };

  return (
    <div
      className={`${styles.container} ${filled ? styles.filled : ''}`}
      onClick={handleSelectSuggestion}
    >
      {imgUrl ? (
        <Image src={imgUrl} alt="Place photo" width={36} height={36} className={styles.image} />
      ) : (
        <div className={styles.iconContainer}>
          {filled ? (
            <LocationIcon />
          ) : type === 'destination' ? (
            <MapPinIcon />
          ) : (
            <ActivityIcon className="text-primary" />
          )}
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.title}>
          {title} {filled && <ArrowIcon className={styles.arrow} />}
        </div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
};
