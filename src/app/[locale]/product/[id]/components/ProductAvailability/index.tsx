import { FC } from 'react';
import { CancellationBanner } from '@/app/[locale]/product/[id]/components/CancellationBanner';
import { AvailabilityTimeSlots } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityTimeSlots';
import { AvailabilityControls } from '@/app/[locale]/product/[id]/components/ProductAvailability/AvailabilityControls';
import {
  getCancellationStatus,
  getProductAvailabilityInfo,
  getProductDescription,
} from '@/app/[locale]/product/[id]/service';

interface ProductAvailabilityProps {
  productCode: string;
}

export const ProductAvailability: FC<ProductAvailabilityProps> = async ({ productCode }) => {
  const { productOptions, pricingType, maxTravelersPerBooking, ...rest } =
    await getProductAvailabilityInfo(productCode);
  const { title } = await getProductDescription(productCode);
  const { cancellationType, refundEligibility, cancelIfInsufficientTravelers, cancelIfBadWeather } =
    await getCancellationStatus(productCode);

  return (
    <div>
      <AvailabilityControls
        bookingRequirements={{ ...rest, maxTravelersPerBooking }}
        productCode={productCode}
        title={title}
      />
      <CancellationBanner
        refundEligibility={refundEligibility}
        cancellationType={cancellationType}
        cancelIfBadWeather={cancelIfBadWeather}
        cancelIfInsufficientTravelers={cancelIfInsufficientTravelers}
      />
      <AvailabilityTimeSlots
        cancelIfBadWeather={cancelIfBadWeather}
        cancelIfInsufficientTravelers={cancelIfInsufficientTravelers}
        refundEligibility={refundEligibility}
        cancellationType={cancellationType}
        maxTravelersPerBooking={maxTravelersPerBooking}
        pricingType={pricingType}
        productOptions={productOptions}
        productCode={productCode}
      />
    </div>
  );
};
