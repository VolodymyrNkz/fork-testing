import { FC } from 'react';
import { styles } from '@/app/_components/WizardHeader/styles';
import { IconProps } from '@/app/_icons/types';
import ArrowIcon from '@/app/_icons/ArrowIcon';

interface WizardHeaderProps {
  currentStep: number;
  steps: {
    icon: FC<IconProps>;
    label: string;
  }[];
  stepSelect?: (step: number) => void;
}

export const WizardHeader: FC<WizardHeaderProps> = ({ currentStep = 0, steps, stepSelect }) => {
  return (
    <div className={styles.root}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep > index || currentStep === steps.length - 1;
        const isArrow = currentStep === index;
        const isInside = !isActive && !isArrow && index < steps.length - 1;

        return (
          <div
            onClick={() => (stepSelect ? stepSelect(index) : undefined)}
            key={index}
            className={`${styles.step} ${
              isActive ? styles.activeStep : isArrow ? styles.arrowStep : styles.inactiveStep
            } ${(isActive || isArrow) && index !== 0 ? styles.separator : ''}`}
          >
            <div className={styles.label}>
              <Icon className={styles.icon} color={isActive || isArrow ? 'white' : '#020F19'} />
              <span>{step.label}</span>
              {isInside && <ArrowIcon className={styles.arrowIcon} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
