import React, { FC, ReactNode } from 'react';
import { styles } from '@/app/_components/Radio/styles';

interface RadioProps {
  content: ReactNode;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Radio: FC<RadioProps> = ({
  content,
  checked = false,
  onChange,
  className,
  disabled,
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange();
    }
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      <div
        className={`${styles.radio} ${className} ${disabled ? styles.disabled : ''} ${checked ? styles.radioChecked : ''}`}
      >
        {checked && <div className={styles.radioInner} />}
      </div>
      <label className={styles.label}>{content}</label>
    </div>
  );
};
