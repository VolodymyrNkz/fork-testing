import { FC } from 'react';
import { CalendarIcon } from '@/app/_icons/CalendarIcon';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/[locale]/results/_components/Navigation/DateSelect/styles';
import { useTranslations } from 'next-intl';

interface DateSelectProps {
  value?: string;
}

export const DateSelect: FC<DateSelectProps> = ({ value }) => {
  const t = useTranslations('inputs');

  return (
    <div className={styles.root}>
      <CalendarIcon className={styles.calendarIcon} />
      <div className={styles.value}>{value || t('selectDates')}</div>
      <ArrowIcon className={styles.arrowIcon} />
    </div>
  );
};
