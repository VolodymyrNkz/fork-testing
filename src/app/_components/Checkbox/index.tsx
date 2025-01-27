import React from 'react';
import { styles } from '@/app/_components/Checkbox/style';
import { CheckIcon } from '@/app/_icons/CheckIcon';

interface CheckboxProps {
  label: string;
  helperText?: string;
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  helperText,
  checked = false,
  onChange,
  disabled,
}) => {
  const handleChange = () => {
    onChange();
  };

  return (
    <div className={`${styles.root} ${disabled ? styles.disabled : ''}`} onClick={handleChange}>
      <div
        className={`${styles.checkbox} ${checked ? styles.checked : ''} ${disabled ? styles.checkboxDisabled : ''}`}
      >
        {checked && <CheckIcon />}
      </div>
      <div className={styles.labelWrapper}>
        <label className={styles.label}>{label}</label>
        {helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    </div>
  );
};
