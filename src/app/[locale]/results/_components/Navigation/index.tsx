'use client';
import { styles } from '@/app/[locale]/results/_components/Navigation/styles';
import { FiltersRow } from '@/app/[locale]/results/_components/Navigation/FiltersRow';
import { InputPlaceSelect } from '@/app/_components/InputPlaceSelect';
import { InputDateSelect } from '@/app/_components/InputDateSelect';
import { DateSelect } from '@/app/[locale]/results/_components/Navigation/DateSelect';
import { NavBackButton } from '@/app/_components/NavBackButton';
import { useTranslations } from 'next-intl';

export const Navigation = () => {
  const t = useTranslations('common');

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <NavBackButton title={t('searchResult')} />
        <InputPlaceSelect />
        <InputDateSelect TriggerComponent={DateSelect} />
      </div>
      <FiltersRow />
    </div>
  );
};
