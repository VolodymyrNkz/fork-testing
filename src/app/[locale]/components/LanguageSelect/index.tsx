'use client';
import { SelectChip } from '@/app/[locale]/components/SelectChip';
import { EarthIcon } from '@/app/_icons/EarthIcon';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { useState } from 'react';
import { LANGUAGES } from '@/app/_constants/common';
import { useLocale, useTranslations } from 'next-intl';
import { Radio } from '@/app/_components/Radio';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { styles } from '@/app/[locale]/components/LanguageSelect/styles';

export const LanguageSelect = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const switchLanguage = (newLocale: string) => {
    const cleanedPathname = pathname.replace(`/${locale}`, '') || '/';

    const searchParamsString = searchParams.toString();
    const newPath = `/${newLocale}${cleanedPathname}${searchParamsString ? `?${searchParamsString}` : ''}`;

    router.push(newPath);
  };

  return (
    <BottomSheet
      borderBottom
      title={t('common.languages.language')}
      isOpen={isSheetOpen}
      toggle={handleToggle}
      triggerComponent={<SelectChip label={LANGUAGES(t)[locale]} Icon={EarthIcon} />}
    >
      <div className={styles.list}>
        {Object.entries(LANGUAGES(t)).map(([value, key]) => (
          <Radio
            checked={locale === value}
            key={key}
            content={key}
            onChange={() => switchLanguage(value)}
          />
        ))}
      </div>
    </BottomSheet>
  );
};
