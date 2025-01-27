'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import { API_ROUTES, getDefaultHeaders } from '@/app/_constants/api';
import { AvailabilityData } from '@/app/_components/InputDateSelect';
import {
  ProductAvailabilityResponse,
  ProductBookableItemSchedule,
} from '@/app/api/getProductAvailability/[productCode]/types';
import { BottomSheet } from '@/app/_components/BottomSheet';
import { DatePicker } from '@/app/_components/DatePicker';
import { CustomInput } from '@/app/_components/CustomInput';
import { WizardHeader } from '@/app/_components/WizardHeader';
import { CalendarIcon } from '@/app/_icons/CalendarIcon';
import { formatDateRange, formatDateToLongFormat } from '@/app/_helpers/formatDateRange';
import { GuestSelect } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityControls/GuestSelect';
import { CommonButton } from '@/app/_components/CommonButton';
import ArrowIcon from '@/app/_icons/ArrowIcon';
import { styles } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityControls/styles';
import { useSearch } from '@/app/_contexts/searchContext';
import { PersonIcon } from '@/app/_icons/PersonIcon';
import { Guests, useBooking } from '@/app/_contexts/bookingContext';
import { formatGuestsString } from '@/app/[locale]/product/[id]/service';
import { AgeBand, BookingRequirements } from '@/app/api/getSingleProduct/[productCode]/types';
import { useFloating } from '@/app/_hooks/useFloating';
import { scroller } from 'react-scroll';
import { checkIsBooked } from '@/app/_helpers/checkIsDateBooked';
import { useLocale, useTranslations } from 'next-intl';
import { ONE_DAY } from '@/app/_constants/common';
import { useModal } from '@/app/_contexts/modalContext';
import { useRequest } from '@/app/_hooks/useRequest';
import { getCurrencyRate } from '@/app/_hooks/useCurrencyRates';
import { getUserInfo } from '@/app/_helpers/getUserInfo';

export type ProductAvailabilityInfo = BookingRequirements & {
  ageBands?: AgeBand[];
  defaultGuests: Guests;
};

interface AvailabilityControlsProps {
  productCode: string;
  title?: string;
  bookingRequirements: ProductAvailabilityInfo;
}

export const AvailabilityControls: FC<AvailabilityControlsProps> = ({
  productCode,
  title,
  bookingRequirements,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const createRequest = useRequest();

  const { currency } = getUserInfo();

  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<[Date, Date | null] | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [buttonLabel, setButtonLabel] = useState<string>(t('buttons.checkAvailability'));

  const lastRequestState = useRef<{ travelDate: Date | null; guests: Guests | null }>({
    travelDate: null,
    guests: null,
  });

  const lastRequestCurrency = useRef<string>(currency);

  const { isVisible, styles: floatingStyles, setTargetRef } = useFloating();
  const {
    handleApplyGuests,
    guests,
    loading,
    handleSetTemporaryGuests,
    handleSetTravelDate,
    handleShowTimeSlots,
    showTimeslots,
    getProductBookableItems,
    bookableItems,
    travelDate,
    shouldOpenCalendar,
    setShouldOpenCalendar,
  } = useBooking();

  const { filters } = useSearch();

  const { openModal } = useModal();

  const handleSelectDate = (date: [Date, Date | null]) => {
    setWizardStep(1);
    setSelectedDate(date);
  };

  const handleToggleWizard = (step?: number, clearGuests?: boolean) => {
    setIsWizardOpen((prev) => !prev);
    setWizardStep(step && selectedDate ? step : 0);
    if (clearGuests) {
      handleSetTemporaryGuests(guests || bookingRequirements.defaultGuests);
    }
  };

  const handleSetCurrentStep = (step: number) => {
    if (selectedDate) {
      setWizardStep(step);
    }
  };

  const handleApply = () => {
    const isValid = handleApplyGuests();
    if (isValid) {
      handleToggleWizard();
      if (bookableItems.length) {
        setButtonLabel(t('buttons.updateSearch'));
      }
    }
  };

  const scrollToTimeslots = () => {
    scroller.scrollTo('availabilityTimeSlots', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -100,
    });
  };

  const handleCheckAvailability = async () => {
    if (!travelDate) {
      scroller.scrollTo('availabilityControls', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -300,
      });
    } else {
      scrollToTimeslots();
      handleShowTimeSlots();
    }

    if (
      lastRequestState.current.travelDate === travelDate &&
      JSON.stringify(lastRequestState.current.guests) === JSON.stringify(guests)
    ) {
      return;
    }

    lastRequestState.current = { travelDate, guests };

    const bookableItems = await getProductBookableItems(productCode);
    scrollToTimeslots();

    if (bookableItems?.every(({ available }) => !available)) {
      openModal('availabilityChanged', () => handleToggleWizard(0));
      return;
    }
  };

  useEffect(() => {
    if (showTimeslots && lastRequestCurrency.current !== currency) {
      getProductBookableItems(productCode);
    }
  }, [currency, productCode, showTimeslots]);

  function getAvailabilityRanges(data: ProductBookableItemSchedule[]) {
    const daysOfWeekMap: Record<string, number> = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    const allDates: string[] = [];

    data.forEach((item) => {
      item.seasons.forEach((season) => {
        const seasonStart = new Date(season.startDate);
        const seasonEnd = season.endDate
          ? new Date(season.endDate)
          : new Date(Date.now() + 384 * ONE_DAY);

        const unavailableDates = new Set(
          (season.pricingRecords || []).flatMap((record) =>
            (record.timedEntries || []).flatMap((entry) =>
              (entry.unavailableDates || []).map((u) => u.date),
            ),
          ),
        );

        const daysOfWeek = new Set(
          (season.pricingRecords || []).flatMap((record: any) => record.daysOfWeek || []),
        );

        const currentDate = new Date(seasonStart);

        while (currentDate <= seasonEnd) {
          const dateString = currentDate.toISOString().split('T')[0];

          if (
            daysOfWeek.has(
              Object.keys(daysOfWeekMap).find(
                (key) => daysOfWeekMap[key] === currentDate.getUTCDay(),
              ),
            ) &&
            !unavailableDates.has(dateString)
          ) {
            allDates.push(dateString);
          }

          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }
      });
    });

    allDates.sort();

    const availabilityRanges: { from: string; to: string }[] = [];
    let rangeStart = allDates[0];
    let previousDate = allDates[0];

    for (let i = 1; i < allDates.length; i++) {
      const currentDate = allDates[i];
      const previousDateObj = new Date(previousDate);
      const currentDateObj = new Date(currentDate);

      if ((currentDateObj.getTime() - previousDateObj.getTime()) / ONE_DAY !== 1) {
        availabilityRanges.push({ from: rangeStart, to: previousDate });
        rangeStart = currentDate;
      }

      previousDate = currentDate;
    }

    availabilityRanges.push({ from: rangeStart, to: previousDate });

    return availabilityRanges;
  }
  const fetchProductAvailability = async (productCode: string) => {
    const data = await createRequest<ProductAvailabilityResponse>({
      endpoint: `${API_ROUTES.getProductAvailability}/${productCode}`,
      headers: getDefaultHeaders(),
      method: 'GET',
    });
    console.log('data', data);

    const currencyRate = await getCurrencyRate(data.currency);

    const unavailableDates = Array.from(
      new Set(
        data.bookableItems.flatMap((bookableItem) =>
          bookableItem.seasons.flatMap(
            (season) =>
              season.pricingRecords?.flatMap(
                (priceRecord) =>
                  priceRecord.timedEntries?.flatMap(
                    (timedEntry) =>
                      timedEntry.unavailableDates?.map((unavailableDate) => unavailableDate.date) ||
                      [],
                  ) || [],
              ) || [],
          ),
        ),
      ),
    );

    return {
      availabilityRanges: getAvailabilityRanges(data.bookableItems),
      unavailableDates,
      price: data.summary.fromPrice * currencyRate,
    };
  };

  useEffect(() => {
    (async () => {
      const availabilityData = await fetchProductAvailability(productCode);
      setAvailabilityData(availabilityData);
    })();
  }, [productCode, currency]);

  useEffect(() => {
    if (filters?.startDate) {
      setSelectedDate([new Date(filters?.startDate), null]);
    }
  }, [filters?.startDate, filters?.endDate]);

  useEffect(() => {
    if (!guests) {
      handleApplyGuests(bookingRequirements.defaultGuests);
    }
  }, [handleApplyGuests, bookingRequirements, guests]);

  useEffect(() => {
    if (selectedDate) {
      handleSetTravelDate(selectedDate[0]);
    }
  }, [selectedDate, handleSetTravelDate]);

  useEffect(() => {
    if (selectedDate) {
      const isBooked = checkIsBooked(selectedDate[0], availabilityData);

      if (isBooked && availabilityData) {
        const { unavailableDates, availabilityRanges } = availabilityData;

        const findClosestAvailableDate = () => {
          const allUnavailableDates = new Set(
            unavailableDates.map((unavailableDate) => new Date(unavailableDate).toDateString()),
          );

          for (const range of availabilityRanges) {
            const currentDate = new Date(range.from);
            const rangeEnd = range.to
              ? new Date(range.to).setHours(23, 59, 59, 999)
              : new Date().setDate(new Date().getDate() + 384);

            while (+currentDate <= +rangeEnd) {
              if (
                !allUnavailableDates.has(currentDate.toDateString()) &&
                +currentDate >= new Date().setHours(0, 0, 0, 0)
              ) {
                return currentDate;
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
          return null;
        };

        const closestAvailableDate = findClosestAvailableDate();

        if (closestAvailableDate) {
          setSelectedDate([closestAvailableDate, null]);
        }
      }
    }
  }, [availabilityData, selectedDate]);

  useEffect(() => {
    if (shouldOpenCalendar) {
      handleToggleWizard(0);
      setShouldOpenCalendar(false);
    }
  }, [shouldOpenCalendar]);

  useEffect(() => {
    setTargetRef(buttonRef.current);
  }, [setTargetRef]);

  // useEffect(() => {
  //   if (!loading && lastRequestCurrency.current !== currency) {
  //     scrollToTimeslots();
  //   }mobitru_ak_HZl5QB0OaTMN7RUuEsGDiB_PBaLubxG6WDcuRXMSIHV0INBSCsUp2vpR1hc8cAYutTenLAJwYX3cDCN7jOy
  // }, [loading]);

  useEffect(() => {
    lastRequestCurrency.current = currency;
  }, [currency]);

  return (
    <>
      <div id="availabilityControls" className={styles.root}>
        <CustomInput
          value={
            selectedDate?.[0]
              ? formatDateToLongFormat(locale, selectedDate?.[0])
              : t('inputs.selectDate')
          }
          onClick={() => handleToggleWizard(0)}
          icon={CalendarIcon}
          readonly
        />
        <CustomInput
          value={guests ? formatGuestsString(guests, t) : ''}
          onClick={() => handleToggleWizard(1)}
          icon={PersonIcon}
          readonly
        />
        <div ref={buttonRef}>
          <CommonButton
            disabled={loading}
            full
            label={buttonLabel}
            onClick={handleCheckAvailability}
          />
        </div>
        {!showTimeslots && (
          <div
            className={`${floatingStyles.floatingWrapper} ${isVisible ? floatingStyles.visible : floatingStyles.invisible}`}
          >
            <CommonButton
              disabled={loading}
              full
              label={buttonLabel}
              onClick={handleCheckAvailability}
            />
          </div>
        )}
      </div>
      <BottomSheet
        fullHeight
        divideHeader
        backButton={
          wizardStep ? (
            <div onClick={() => handleSetCurrentStep(wizardStep - 1)}>
              <ArrowIcon className={styles.icon} />
            </div>
          ) : undefined
        }
        footer={
          wizardStep ? (
            <CommonButton full label={t('buttons.apply')} onClick={handleApply} />
          ) : undefined
        }
        header={
          <WizardHeader
            stepSelect={handleSetCurrentStep}
            steps={[
              {
                label: `${selectedDate ? formatDateRange(selectedDate, locale) : t('common.date')}`,
                icon: CalendarIcon,
              },
              { label: t('productPage.guests'), icon: PersonIcon },
            ]}
            currentStep={wizardStep}
          />
        }
        title={title || ''}
        isOpen={isWizardOpen}
        toggle={() => handleToggleWizard(0, true)}
      >
        {!wizardStep ? (
          <DatePicker
            mode="single"
            setDateRange={handleSelectDate}
            dateRange={selectedDate}
            availabilityData={availabilityData}
          />
        ) : (
          <GuestSelect bookingRequirements={bookingRequirements} />
        )}
      </BottomSheet>
    </>
  );
};
