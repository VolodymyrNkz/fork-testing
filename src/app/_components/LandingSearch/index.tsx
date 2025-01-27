import { InputPlaceSelect } from '@/app/_components/InputPlaceSelect';
import { InputDateSelect } from '@/app/_components/InputDateSelect';
import React from 'react';
import { styles } from '@/app/_components/LandingSearch/style';
import { ButtonSearch } from '@/app/_components/ButtonSearch';
import { IntroductionPopup } from '@/app/_components/IntroductionPopup';
import { useTranslations } from 'next-intl';

export const LandingSearch = () => {
  const t = useTranslations();

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url('/assets/landingCover.png')`,
        backgroundSize: 'contain',
        backgroundPositionY: 0,
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('landingPage.bookAnExperience')}</h2>
          <h3 className={styles.subtitle}>
            {t('landingPage.discover')}
            <br />
            {t('common.andMore')} <IntroductionPopup />
          </h3>
        </div>
        <div className={styles.inputContainer}>
          <InputPlaceSelect />
        </div>
        <div className={styles.inputContainer}>
          <InputDateSelect />
        </div>
        <div className={styles.buttonContainer}>
          <ButtonSearch />
        </div>
      </div>
    </div>
  );
};
