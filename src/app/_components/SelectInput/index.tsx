import React, { useState, useEffect, useRef, FC, ReactNode } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/_components/SelectInput/styles';

interface DropdownOption<T> {
  value: T;
  label: ReactNode;
  link?: string;
}

interface DropdownSelectProps<T> {
  options: DropdownOption<T>[];
  onSelect: (value: T, option: any) => void;
  defaultValue?: T;
  renderValue?: (selectedOption: DropdownOption<T>) => ReactNode;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  position?: 'above' | 'below';
  itemClassName?: string;
  listWidth?: string;
}

export const SelectInput: FC<DropdownSelectProps<any>> = ({
  options = [],
  onSelect,
  defaultValue,
  renderValue,
  placeholder,
  invalid,
  position = 'below',
  itemClassName,
  listWidth,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption<any> | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Map<any, HTMLDivElement>>(new Map());
  const hasOne = options.length === 1;

  const handleToggle = () => {
    if (!hasOne) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelectValue = (option: DropdownOption<any>) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option.value, option);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const scrollToSelectedOption = () => {
    if (selectedOption && isOpen) {
      const selectedOptionRef = optionRefs.current.get(selectedOption.value);
      selectedOptionRef?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (hasOne && !selectedOption) {
      handleSelectValue(options[0]);
    }
  }, [options]);

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === defaultValue) || null);
  }, [defaultValue, options]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    scrollToSelectedOption();
  }, [isOpen]);

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        onClick={handleToggle}
        className={styles.input}
        style={invalid ? { borderColor: 'red' } : {}}
      >
        <div className={styles.value}>
          {selectedOption ? (
            renderValue ? (
              renderValue(selectedOption)
            ) : (
              selectedOption.label
            )
          ) : (
            <span>
              {placeholder || 'Select...'}
              {required && <span className={styles.asterisk}> *</span>}
            </span>
          )}
        </div>
        {!hasOne && (
          <div>
            <ArrowIcon
              className={`${isOpen ? styles.iconOpen : styles.iconClosed} ${styles.icon}`}
            />
          </div>
        )}
      </div>
      {isOpen && (
        <div
          className={`${styles.list}`}
          ref={listRef}
          style={{
            width: listWidth,
            top: position === 'above' ? 'auto' : '100%',
            bottom: position === 'above' ? '100%' : 'auto',
          }}
        >
          {options.map((option) => (
            <div
              ref={(el) => {
                if (el) {
                  optionRefs.current.set(option.value, el);
                }
              }}
              className={`${selectedOption?.value === option.value ? styles.selected : ''} ${itemClassName || ''} ${
                styles.item
              }`}
              key={option.value}
              onClick={() => handleSelectValue(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
