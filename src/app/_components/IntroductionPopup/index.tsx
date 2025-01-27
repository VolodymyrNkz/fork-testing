import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import React from 'react';
import { styles } from '@/app/_components/IntroductionPopup/styles';
import { useTranslations } from 'next-intl';

export const IntroductionPopup = () => {
  const t = useTranslations();

  return (
    <FullScreenPanel trigger={<b>{t('buttons.learnMore')}</b>}>
      <div className={styles.root}>
        <div className={styles.title}>{t('introduction.title')}</div>
        <div className={styles.subtitle}>{t('introduction.subtitleOne')}</div>
        <div>{t('introduction.textOne')}</div>
        <div className={styles.subtitle}>{t('introduction.subtitleTwo')}</div>
        <div>{t('introduction.textTwo')}</div>
      </div>
    </FullScreenPanel>
  );
};
