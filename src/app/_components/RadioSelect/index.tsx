import { styles } from '@/app/_components/RadioSelect/styles';
import { FC, ReactNode, useState } from 'react';

interface RadioSelectItem {
  title: string;
  onClick?: () => void;
  items?: ReactNode;
}

interface RadioSelectProps {
  values: RadioSelectItem[];
  selected?: number;
}

export const RadioSelect: FC<RadioSelectProps> = ({ values, selected = 0 }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(selected);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className={styles.root}>
      {values.map(({ items, title, onClick }, index) => (
        <div
          className={styles.item}
          key={index}
          onClick={() => {
            if (onClick) {
              onClick();
            }
            handleSelect(index);
          }}
        >
          <div
            className={`${styles.radio} ${selectedIndex === index ? styles.radioChecked : ''}`}
          />
          <div className={styles.list}>
            <div className={styles.title}>{title}</div>
            {selectedIndex === index && items}
          </div>
        </div>
      ))}
    </div>
  );
};
