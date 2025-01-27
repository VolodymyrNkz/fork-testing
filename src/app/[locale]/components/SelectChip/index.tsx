import { FC } from 'react';
import { styles } from '@/app/[locale]/components/SelectChip/styles';
import { IconProps } from '@/app/_icons/types';

interface SelectChipProps {
  Icon: FC<IconProps>;
  label: string;
}

export const SelectChip: FC<SelectChipProps> = ({ Icon, label }) => {
  return (
    <div className={styles.root}>
      {<Icon className={styles.icon} />}
      <div>{label}</div>
    </div>
  );
};
