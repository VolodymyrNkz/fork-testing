import { CheckoutBottomSheet } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/CheckoutSection';
import {
  getCancellationStatus,
  getProductBookingQuestions,
  getProductDescription,
} from '@/app/[locale]/product/[id]/service';
import { FC } from 'react';

interface CheckoutSectionWrapperProps {
  productCode: string;
}

export const CheckoutSection: FC<CheckoutSectionWrapperProps> = async ({ productCode }) => {
  const { title, tags } = await getProductDescription(productCode);
  const { bookingQuestions, travelerPickup, languageGuides, startPoint } =
    await getProductBookingQuestions(productCode);
  const cancellationStatus = await getCancellationStatus(productCode);

  return (
    <div>
      <CheckoutBottomSheet
        tags={tags}
        cancellationStatus={cancellationStatus}
        startPoint={startPoint}
        title={title}
        languageGuides={languageGuides}
        travelerPickup={travelerPickup}
        bookingQuestions={bookingQuestions}
      />
    </div>
  );
};
