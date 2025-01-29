import { Range as RangeComponent } from 'react-range';
import { FC, useEffect, useState } from 'react';
import { styles } from '@/app/_components/Range/styles';
import { useSearch } from '@/app/_contexts/searchContext';
import { useFormatter } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { formatPrice } from '@/app/_helpers/formatPrice';

interface RangeProps {
  min?: number;
  max?: number;
  className?: string;
}

export const Range: FC<RangeProps> = ({ min = 0, max = 100, className }) => {
  const format = useFormatter();
  const { currency } = getUserInfo();

  const [values, setValues] = useState([min, max]);

  const { handleSetCostRangeFilter, filters } = useSearch();

  const handleFinalChange = (finalValues: number[]) => {
    const [minValue, maxValue] = finalValues;
    handleSetCostRangeFilter([minValue, maxValue]);
  };

  useEffect(() => {
    setValues([filters?.lowestPrice || 0, filters?.highestPrice || 500]);
  }, [filters?.highestPrice, filters?.lowestPrice]);

  return (
    <div className={`${styles.container} ${className}`}>
      <RangeComponent
        step={1}
        min={min}
        max={max}
        values={values}
        onChange={(values) => setValues(values)}
        onFinalChange={handleFinalChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className={styles.track}
            ref={props.ref}
            style={{
              ...props.style,
              position: 'relative',
            }}
          >
            <div
              className={styles.filledTrack}
              style={{
                position: 'absolute',
                left: `${((values[0] - min) / (max - min)) * 100}%`,
                right: `${100 - ((values[1] - min) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div {...props} key={index} className={styles.thumb} style={props.style} ref={props.ref}>
            <div className={styles.tooltip}>
              {formatPrice({
                currency,
                price: values[index],
                format: format,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        )}
      />
    </div>
  );
};
