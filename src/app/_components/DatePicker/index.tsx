import './datePickerOverrides.css';
import Calendar from 'react-calendar';
import { FC, useCallback, useEffect, useState } from 'react';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/_components/DatePicker/styles';
import { AvailabilityData } from '@/app/_components/InputDateSelect';
import { checkIsBooked } from '@/app/_helpers/checkIsDateBooked';
import { useFormatter, useLocale } from 'next-intl';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { ONE_DAY } from '@/app/_constants/common';

interface DatePickerProps {
  availabilityData?: AvailabilityData;
  dateRange: [Date, Date | null] | null;
  setDateRange: (date: any) => void;
  mode?: 'single' | 'range';
}

export const DatePicker: FC<DatePickerProps> = ({
  availabilityData,
  dateRange,
  setDateRange,
  mode = 'range',
}) => {
  const format = useFormatter();
  const locale = useLocale();
  const { currency } = getUserInfo();

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    return dateRange?.[0] || new Date();
  });

  const findNearestAvailableDate = useCallback(
    (availabilityData?: AvailabilityData): Date | null => {
      if (!availabilityData) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(today.getFullYear() + 1);

      for (
        let currentDate = today.getTime();
        currentDate <= oneYearLater.getTime();
        currentDate += ONE_DAY
      ) {
        const dateObj = new Date(currentDate);

        if (!checkIsBooked(dateObj, availabilityData)) {
          return dateObj;
        }
      }

      return null;
    },
    [],
  );

  const handleDateChange = (newDate: Date) => {
    setDateRange((prevRange: any[]) => {
      if (mode === 'single') {
        return [newDate, null];
      }
      if (prevRange?.[0] && !prevRange[1]) {
        const [startDate] = prevRange;
        return newDate < startDate ? [newDate, startDate] : [startDate, newDate];
      }
      return [newDate, null];
    });
  };

  const handleMonthChange = (step: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + step);
      return newDate;
    });
  };

  const tileClassName = ({ date }: { date: Date }): string => {
    const isAvailable = checkIsBooked(date, availabilityData);

    const classMap: Record<string, boolean | null | undefined> = {
      'react-calendar__tile--past': isAvailable,
      'react-calendar__tile--disabled': isAvailable,
      'react-calendar__tile--in-range':
        dateRange?.[0] && dateRange?.[1] && dateRange && date > dateRange[0] && date < dateRange[1],
      'react-calendar__tile--first-date':
        dateRange && date.toDateString() === dateRange[0]?.toDateString(),
      'react-calendar__tile--last-date':
        dateRange && date.toDateString() === dateRange[1]?.toDateString(),
    };

    return Object.entries(classMap)
      .filter(([, condition]) => condition)
      .map(([className]) => className)
      .join(' ');
  };

  const tileContent = ({ date }: { date: Date }) => {
    const isAvailable = checkIsBooked(date, availabilityData);

    return !isAvailable && availabilityData?.price ? (
      <div className={styles.price}>
        {format.number(Math.round(availabilityData?.price) || 0, {
          style: 'currency',
          currency,
          maximumFractionDigits: 0,
          currencyDisplay: 'narrowSymbol',
        })}
      </div>
    ) : null;
  };

  useEffect(() => {
    if (dateRange?.[0]) {
      setCurrentDate(dateRange[0]);
    } else {
      const nearestDate = findNearestAvailableDate(availabilityData);
      if (nearestDate) {
        setCurrentDate(nearestDate);
      }
    }
  }, [dateRange, availabilityData, findNearestAvailableDate]);

  const monthYearLabel = `${currentDate.toLocaleString(locale, {
    month: 'long',
  })} ${currentDate.getFullYear()}`;

  const today = new Date();
  const oneYearFromToday = new Date(today);
  oneYearFromToday.setFullYear(today.getFullYear() + 1);

  const isOnTodayOrBefore = currentDate <= today;
  const isBeyondOneYear = currentDate >= oneYearFromToday;

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <button onClick={() => !isOnTodayOrBefore && handleMonthChange(-1)}>
          <ArrowIcon
            className={`${styles.leftArrow} ${styles.arrow} ${isOnTodayOrBefore ? styles.disabled : ''}`}
          />
        </button>
        <span className={styles.monthTitle}>{monthYearLabel}</span>
        <button onClick={() => !isBeyondOneYear && handleMonthChange(1)}>
          <ArrowIcon className={`${styles.arrow} ${isBeyondOneYear ? styles.disabled : ''}`} />
        </button>
      </div>
      <Calendar
        locale={locale}
        onChange={(value) => handleDateChange(value as Date)}
        value={dateRange}
        tileClassName={tileClassName}
        tileContent={tileContent}
        activeStartDate={currentDate}
        view="month"
        showNavigation={false}
      />
    </div>
  );
};
