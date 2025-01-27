import {
  PaxMixItem,
  PaxMixItemWithPrice,
  ProductBookableItemPrice,
} from '@/app/api/getProductTimeslots/types';

type FormTypes = 'PARTNER_FORM' | 'VIATOR_FORM';
type Status = 'BOOKABLE' | 'REJECTED';
type AvailabilityStatus = 'HOLD_NOT_PROVIDED' | 'HOLDING';

interface Availability {
  status: AvailabilityStatus;
  validUntil?: string;
}

interface BookingHoldInfo {
  availability: Availability;
  pricing: Availability;
}

interface BookingHoldResponseItem {
  partnerBookingRef: string;
  bookingRef: string;
  status: Status;
  lineItems?: PaxMixItemWithPrice[];
  itemTotalPrice?: ProductBookableItemPrice;
  bookingHoldInfo?: BookingHoldInfo;
  rejectionReasonCode?: string;
}

interface BookingCartHoldRequestItem {
  partnerBookingRef: string;
  productCode: string;
  travelDate: string;
  paxMix: PaxMixItem[];
  productOptionCode?: string;
  startTime?: string;
}

export interface ProductHoldResponse {
  cartRef: string;
  partnerCartRef: string;
  currency: string;
  items: BookingHoldResponseItem[];
  totalHeldPrice: ProductBookableItemPrice;
  paymentDataSubmissionUrl: string;
  paymentSessionToken: string;
  code?: string;
  message?: string;
}

export interface ProductHoldBody {
  partnerCartRef: string;
  currency: string;
  items: BookingCartHoldRequestItem[];
  paymentDataSubmissionMode?: FormTypes;
  hostingUrl: string;
}
