import { FC } from 'react';
import { styles } from '@/app/_components/CommonButton/styles';
import { clsx } from 'clsx';

interface CommonButtonProps {
  label: string;
  filled?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  full?: boolean;
}

export const CommonButton: FC<CommonButtonProps> = ({
  label,
  filled = true,
  onClick,
  className,
  disabled,
  full,
}) => {
  return (
    <button
      className={clsx(
        `${styles.root} ${full ? 'w-full' : ''} ${filled ? styles.filled : styles.default} ${disabled ? styles.disabled : ''}`,
        className,
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
