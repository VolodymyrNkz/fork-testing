import { FC } from 'react';
import { StarIcon } from '@/app/_icons/StarIcon';
import { styles } from '@/app/_components/FilledStars/styles';
import { useTranslations } from 'next-intl';

interface FilledStarsProps {
  fill?: number;
}

export const FilledStars: FC<FilledStarsProps> = ({ fill = 5 }) => {
  const t = useTranslations('common');
  const isPartialFill = fill < 5;

  return (
    <div className={styles.root}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} className={index < fill ? styles.filled : styles.gray} />
      ))}
      {isPartialFill && <span>{t('up')}</span>}
    </div>
  );
};
