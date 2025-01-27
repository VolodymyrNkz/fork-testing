'use client';
import { SelectChip } from '@/app/[locale]/components/SelectChip';
import { EarthIcon } from '@/app/_icons/EarthIcon';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { useState } from 'react';
import { CURRENCIES } from '@/app/_constants/common';
import { useTranslations } from 'next-intl';
import { Radio } from '@/app/_components/Radio';
import { styles } from '@/app/[locale]/components/LanguageSelect/styles';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { useRouter } from 'next/navigation';

export const CurrencySelect = () => {
  const t = useTranslations();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { currency } = getUserInfo();
  const router = useRouter();

  const handleToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const switchCurrency = async (value: string) => {
    document.cookie = `currency=${value}; path=/; max-age=31536000`;
    router.refresh();
    console.log(`Currency switched to: ${value}`);
  };

  return (
    <BottomSheet
      borderBottom
      title={t('common.languages.language')}
      isOpen={isSheetOpen}
      toggle={handleToggle}
        // @ts-ignore
      triggerComponent={<SelectChip label={CURRENCIES[currency]} Icon={EarthIcon} />}
    >
      <div className={styles.list}>
        {Object.entries(CURRENCIES).map(([value, key]) => (
          <Radio
            checked={currency === value}
            key={key}
            content={key}
            onChange={() => switchCurrency(value)}
          />
        ))}
      </div>
    </BottomSheet>
  );
};
