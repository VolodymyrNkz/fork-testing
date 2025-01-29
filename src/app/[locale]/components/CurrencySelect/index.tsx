'use client';
import { SelectChip } from '@/app/[locale]/components/SelectChip';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { useEffect, useRef, useState } from 'react';
import { CURRENCIES, ONE_DAY } from '@/app/_constants/common';
import { useTranslations } from 'next-intl';
import { Radio } from '@/app/_components/Radio';
import { styles } from '@/app/[locale]/components/LanguageSelect/styles';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { useRouter, useSearchParams } from 'next/navigation';
import { DollarIcon } from '@/app/_icons/DollarIcon';

export const CurrencySelect = () => {
  const t = useTranslations();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { currency } = getUserInfo();
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetCurrency = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const switchCurrency = async (value: string) => {
    targetCurrency.current = value;
    setLoading(true);

    document.cookie = `currency=${value}; path=/; max-age=${ONE_DAY}`;

    const params = new URLSearchParams(searchParams.toString());
    params.set('currency', value);

    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    const searchCurrency = searchParams.get('currency');
    if (searchCurrency === currency) {
      setLoading(false);
    }
  }, [currency, searchParams]);

  return (
    <BottomSheet
      borderBottom
      title={t('common.currency')}
      isOpen={isSheetOpen}
      toggle={handleToggle}
      triggerComponent={<SelectChip label={CURRENCIES[currency]} Icon={DollarIcon} />}
    >
      <div className={styles.list}>
        {Object.entries(CURRENCIES).map(([value, key]) => (
          <Radio
            disabled={loading}
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
