'use client';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useBooking } from '@/app/_contexts/bookingContext';
import {
  PaxMixItemWithPrice,
  ProductBookableItemPrice,
  ProductBookableItemSchedule,
} from '@/app/api/getProductTimeslots/types';
import {
  CancellationType,
  PricingType,
  ProductOption,
  RefundEligibility,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { TimeSlot } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityTimeSlots/TimeSlot';

export interface StartTime {
  time?: string;
  available: boolean;
}

type GroupedItem = {
  productOptionCode: string;
  startTimes: StartTime[];
  lineItems: PaxMixItemWithPrice[];
  totalPrice: ProductBookableItemPrice;
};

interface AvailabilityTimeSlotsProps {
  productCode: string;
  productOptions?: ProductOption[];
  pricingType: PricingType;
  maxTravelersPerBooking: number;
  cancellationType?: CancellationType;
  refundEligibility?: RefundEligibility[];
  cancelIfBadWeather?: boolean;
  cancelIfInsufficientTravelers?: boolean;
}

export const AvailabilityTimeSlots: FC<AvailabilityTimeSlotsProps> = ({
  productCode,
  productOptions,
  pricingType,
  maxTravelersPerBooking,
  refundEligibility,
  cancellationType,
  cancelIfInsufficientTravelers,
  cancelIfBadWeather,
}) => {
  const { showTimeslots, handleSetTravelTime, bookableItems } = useBooking();
  const [selectedItem, setSelectedItem] = useState(0);

  const groupAndConvertToArray = useCallback(
    (items: ProductBookableItemSchedule[]): GroupedItem[] => {
      const grouped = items.reduce<Record<string, GroupedItem>>((acc, item) => {
        const { productOptionCode, startTime, available, lineItems, totalPrice } = item;

        if (!acc[productOptionCode]) {
          acc[productOptionCode] = {
            productOptionCode,
            startTimes: [],
            lineItems: [],
            totalPrice: {} as ProductBookableItemPrice,
          };
        }

        acc[productOptionCode].startTimes.push({ time: startTime, available });
        acc[productOptionCode].lineItems = lineItems;
        acc[productOptionCode].totalPrice = totalPrice;

        return acc;
      }, {});

      const result = Object.values(grouped);

      result.forEach((group) => {
        group.startTimes.sort((a, b) => {
          const [hoursA, minutesA] = a.time?.split(':').map(Number) || [0, 0];
          const [hoursB, minutesB] = b.time?.split(':').map(Number) || [0, 0];

          if (hoursA === hoursB) {
            return minutesA - minutesB;
          }
          return hoursA - hoursB;
        });
      });

      result.sort((a, b) => {
        const isDisabledA = a.startTimes.every((item) => !item.available);
        const isDisabledB = b.startTimes.every((item) => !item.available);

        return Number(isDisabledA) - Number(isDisabledB);
      });

      return result;
    },
    [],
  );

  const groupedLineItems = useMemo(
    () => groupAndConvertToArray(bookableItems),
    [groupAndConvertToArray, bookableItems],
  );

  useEffect(() => {
    if (bookableItems?.length) {
      const firstAvailableTime =
        groupedLineItems[0]?.startTimes.find(({ available }) => available)?.time || '';
      handleSetTravelTime(firstAvailableTime);
    }
  }, [bookableItems, groupAndConvertToArray, groupedLineItems, handleSetTravelTime]);

  useEffect(() => {
    const firstAvailableTime =
      groupedLineItems[selectedItem]?.startTimes.find(({ available }) => available)?.time || '';
    handleSetTravelTime(firstAvailableTime);
  }, [handleSetTravelTime, selectedItem, groupedLineItems]);

  if (showTimeslots && !bookableItems.every(({ available }) => !available)) {
    return (
      <div id="availabilityTimeSlots">
        {groupedLineItems.map(
          ({ productOptionCode, startTimes, lineItems, totalPrice }, index, self) => {
            const productOption = productOptions?.find(
              (option) => option.productOptionCode === productOptionCode,
            );

            const priceSummary = totalPrice?.price?.recommendedRetailPrice;
            const isDisabled = startTimes.every((item) => !item.available || !item.time);

            return (
              <div key={productOptionCode} onClick={() => !isDisabled && setSelectedItem(index)}>
                <TimeSlot
                  disabled={isDisabled}
                  cancelIfBadWeather={cancelIfBadWeather}
                  cancelIfInsufficientTravelers={cancelIfInsufficientTravelers}
                  refundEligibility={refundEligibility}
                  productOptionCode={productOptionCode}
                  cancellationType={cancellationType}
                  maxTravelersPerBooking={maxTravelersPerBooking}
                  pricingType={pricingType}
                  productCode={productCode}
                  multiple={self.length > 1}
                  selected={selectedItem === index}
                  description={productOption?.description}
                  title={productOption?.title}
                  totalPrice={priceSummary}
                  lineItems={lineItems}
                  startTimes={startTimes}
                />
              </div>
            );
          },
        )}
      </div>
    );
  }

  return undefined;
};
