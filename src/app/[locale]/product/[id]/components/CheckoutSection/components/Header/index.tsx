import { PriceBreakdown } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/PriceBreakdown';
import { WizardHeader } from '@/app/_components/WizardHeader';
import { FC } from 'react';
import { PersonIcon } from '@/app/_icons/PersonIcon';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/Header/styles';
import { useTranslations } from 'next-intl';
import { ChefHatIcon } from '@/app/_icons/ChefHatIcon';
import { PaymentIcon } from '@/app/_icons/PaymentIcon';

interface HeaderProps {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  openSummary: () => void;
}

export const Header: FC<HeaderProps> = ({ currentStep, setCurrentStep, openSummary }) => {
  const t = useTranslations('checkout');

  return (
    <div className={styles.root}>
      <div onClick={openSummary}>
        <PriceBreakdown />
      </div>
      <div className={styles.wizardWrapper}>
        <WizardHeader
          stepSelect={setCurrentStep}
          currentStep={currentStep}
          steps={[
            {
              label: t('contact'),
              icon: PersonIcon,
            },
            {
              label: t('activity'),
              icon: ChefHatIcon,
            },
            {
              label: t('payment'),
              icon: PaymentIcon,
            },
          ]}
        />
      </div>
    </div>
  );
};
