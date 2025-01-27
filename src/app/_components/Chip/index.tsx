import { styles } from '@/app/_components/Chip/styles';
import { FC, ReactNode } from 'react';
import { CrossIcon } from '@/app/_icons/CrossIcon';

interface ChipProps {
  children?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export const Chip: FC<ChipProps> = ({ children, onClick, selected, className }) => {
  return (
    <div
      className={`${styles.root} ${selected ? styles.selected : ''} ${className || ''}`}
      onClick={onClick}
    >
      <div className={styles.content}>
        {children}
        {selected && <CrossIcon />}
      </div>
    </div>
  );
};
