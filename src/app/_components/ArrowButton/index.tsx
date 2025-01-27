import { styles } from '@/app/_components/ArrowButton/styles';
import { FC } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
}

export const ArrowButton: FC<ArrowButtonProps> = ({ label, onClick }) => {
  return (
    <button className={styles.root} onClick={onClick}>
      {label} <ArrowIcon className={styles.arrow} />
    </button>
  );
};
