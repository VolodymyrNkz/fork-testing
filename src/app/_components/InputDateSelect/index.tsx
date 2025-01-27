'use client';
import { DatePicker } from '@/app/_components/DatePicker';
import React, { FC, useEffect, useState } from 'react';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { CustomInput } from '@/app/_components/CustomInput';
import { CommonButton } from '@/app/_components/CommonButton';
import { formatDateRange, formatYYYYMMDD } from '@/app/_helpers/formatDateRange';
import { useSearch } from '@/app/_contexts/searchContext';
import { CalendarIcon } from '@/app/_icons/CalendarIcon';
import { useLocale, useTranslations } from 'next-intl';

interface DateAvailabilityRange {
  from: string;
  to?: string;
}

export interface AvailabilityData {
  availabilityRanges: DateAvailabilityRange[];
  unavailableDates: string[];
  price: number;
}

interface InputDateSelectProps {
  TriggerComponent?: React.ElementType;
  availabilityData?: AvailabilityData;
}

export const InputDateSelect: FC<InputDateSelectProps> = ({
  TriggerComponent,
  availabilityData,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const title = t('inputs.selectDates');

  const [value, setValue] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date, Date | null] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSetDateRangeFilter, filters } = useSearch();

  const handleToggle = () => {
    setIsModalOpen((prev) => !prev);
    if (!value && dateRange) {
      setDateRange(null);
    }
  };

  const handleResetDateRange = () => {
    setDateRange(null);
  };

  const handleSubmitDates = () => {
    if (dateRange) {
      const [start, end] = dateRange;

      const formattedStart = formatYYYYMMDD(start);
      const formattedEnd = end ? formatYYYYMMDD(end) : formattedStart;

      handleSetDateRangeFilter([formattedStart, formattedEnd]);
      setValue(formatDateRange(dateRange, locale));
    } else {
      handleSetDateRangeFilter(['', '']);
      setValue('');
    }

    handleToggle();
  };

  useEffect(() => {
    if (!!filters?.startDate && !!filters?.endDate) {
      setValue(formatDateRange([new Date(filters?.startDate), new Date(filters?.endDate)], locale));
      setDateRange([new Date(filters?.startDate), new Date(filters?.endDate)]);
    }
  }, [filters?.startDate, filters?.endDate]);

  return (
    <BottomSheet
      toggle={handleToggle}
      isOpen={isModalOpen}
      title={title}
      triggerComponent={
        TriggerComponent ? (
          <TriggerComponent value={value} />
        ) : (
          <CustomInput icon={CalendarIcon} readonly value={value} placeholder={title} />
        )
      }
      footer={
        <>
          <CommonButton label={t('buttons.reset')} filled={false} onClick={handleResetDateRange} />
          <CommonButton label={t('buttons.apply')} onClick={handleSubmitDates} />
        </>
      }
    >
      <DatePicker
        availabilityData={availabilityData}
        setDateRange={setDateRange}
        dateRange={dateRange}
      />
    </BottomSheet>
  );
};
