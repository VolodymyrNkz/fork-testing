import React, { useState } from 'react';
import { styles } from './styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { SortingType, useSearch } from '@/app/_contexts/searchContext';

interface DropdownSortOption extends SortingType {
  label: string;
}

interface DropdownSelectProps {
  options: DropdownSortOption[];
  top?: boolean;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({ options }) => {
  const { handleSetSortingType } = useSearch();
  const [selectedOption, setSelectedOption] = useState<string>(options[0].label);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionSelect = ({ label, ...rest }: DropdownSortOption) => {
    handleSetSortingType(rest);
    setSelectedOption(label);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={toggleDropdown}>
        <span className={styles.label}>{selectedOption}</span>
        <ArrowIcon className={isOpen ? styles.arrowOpen : styles.arrow} />
      </button>
      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option.label}
              className={`${styles.option} ${
                selectedOption === option.label ? styles.selectedOption : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
