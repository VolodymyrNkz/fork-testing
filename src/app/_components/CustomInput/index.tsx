'use client';
import React, { FC, ChangeEvent, useRef, useState } from 'react';
import { CrossIconRounded } from '@/app/_icons/CrossIconRounded';
import { styles } from '@/app/_components/CustomInput/styles';
import { IconProps } from '@/app/_icons/types';
import { InfoIcon } from '@/app/_icons/InfoIcon';

type HelperTextMode = 'default' | 'warning';

type HelperText = {
  text: string;
  mode?: HelperTextMode;
};

interface CustomInputProps {
  value: string;
  placeholder?: string;
  onChange?: (newValue: string) => void;
  onClick?: () => void;
  readonly?: boolean;
  icon?: FC<IconProps>;
  className?: string;
  required?: boolean;
  invalid?: boolean;
  focused?: boolean;
  name?: string;
  type?: string;
  helperText?: HelperText;
  full?: boolean;
}

export const CustomInput: FC<CustomInputProps> = ({
  value = '',
  placeholder,
  onChange,
  icon: Icon,
  readonly,
  onClick,
  className,
  required,
  invalid,
  focused,
  name,
  type,
  helperText,
  full,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isDate = type === 'date' || type === 'time';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  const handlePlaceholderClick = () => {
    inputRef.current?.focus();
  };

  const hideDate = isDate && !isFocused && !value;

  return (
    <div className={`${full ? styles.full : ''}`}>
      <div
        onClick={onClick}
        className={`${invalid ? styles.invalid : ''} ${
          readonly ? styles.readOnly : ''
        } ${(isFocused && !readonly) || focused ? styles.inputFocused : ''} ${styles.inputContainer}`}
      >
        {Icon && <Icon className={styles.icon} />}
        <div className={styles.wrapper}>
          {(value || (isDate && isFocused)) && (
            <span className={`${styles.placeholderFocused}`}>
              {placeholder}
              {required && <span className={styles.asterisk}> *</span>}
            </span>
          )}
          <input
            ref={inputRef}
            type={type || 'text'}
            name={name}
            value={value}
            onChange={handleInputChange}
            readOnly={readonly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${className || ''} ${styles.input}`}
            style={{ width: 'calc(100% - 20px)', opacity: hideDate ? 0 : 1 }}
          />
          {!isDate ? (
            !value && (
              <span className={`${styles.placeholder}`} onClick={handlePlaceholderClick}>
                {placeholder}
                {required && <span className={styles.asterisk}> *</span>}
              </span>
            )
          ) : !isFocused && !value ? (
            <span className={`${styles.placeholder}`} onClick={handlePlaceholderClick}>
              {placeholder}
              {required && <span className={styles.asterisk}> *</span>}
            </span>
          ) : undefined}
        </div>
        {isFocused && value && !readonly && (
          <button className={styles.clearButton} onMouseDown={handleClear} aria-label="Clear input">
            <CrossIconRounded />
          </button>
        )}
      </div>
      {helperText && (
        <div
          className={`${styles.helperText} ${helperText.mode === 'warning' ? styles.warning : ''}`}
        >
          {helperText.mode === 'warning' && <InfoIcon className={styles.warnIcon} />}
          {helperText.text}
        </div>
      )}
    </div>
  );
};
