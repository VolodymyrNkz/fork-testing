import { LanguageGuides } from '@/app/api/getSingleProduct/[productCode]/types';
import { BookingQuestionId } from '@/app/api/getProductQuestions/types';
import { PaxMixItemWithPrice, ProductBookableItemPrice } from '@/app/api/getProductTimeslots/types';

export type RejectionReasonCode =
  | 'BOOKABLE_ITEM_IS_NO_LONGER_AVAILABLE'
  | 'WEATHER'
  | 'DUPLICATE_BOOKING'
  | 'PRODUCT_NO_LONGER_OPERATING'
  | 'SIGNIFICANT_GLOBAL_EVENT_FORCE_MAJEURE'
  | 'TOUR_WAS_CANCELLED'
  | 'ISSUE_WITH_TICKET'
  | 'ISSUE_WITH_PICKUP'
  | 'ISSUE_WITH_PAYMENT'
  | 'INSUFFICIENT_FUNDS'
  | 'INVALID_PAYMENT_DETAILS'
  | 'SUSPECTED_FRAUD'
  | 'SOFT_DECLINE'
  | 'HARD_DECLINE'
  | 'THREE_D_SECURE_REQUIRED'
  | 'INTERNAL_ERROR'
  | 'PROCESSOR_UNAVAILABLE'
  | 'PROCESSOR_ISSUE_WITH_PAYMENT'
  | 'TRANSACTION_NOT_ALLOWED'
  | 'CARD_INACTIVE'
  | 'CARD_RESTRICTED'
  | 'OTHER';
export type BookingStatus = 'REJECTED' | 'CONFIRMED' | 'PENDING';

interface BookerInfo {
  firstName: string;
  lastName: string;
}

interface Communication {
  phone: string;
  email: string;
}

export interface BookingQuestionAnswer {
  question: BookingQuestionId;
  answer: string;
  unit?: string;
  travelerNum?: number;
}

interface BookingRequestItem {
  bookingRef: string;
  languageGuide?: LanguageGuides;
  bookingQuestionAnswers: BookingQuestionAnswer[];
}

export interface ProductBookBody {
  cartRef: string;
  bookerInfo: BookerInfo;
  communication: Communication;
  items: BookingRequestItem[];
  paymentToken: string;
}

interface ProductBookItem {
  partnerBookingRef: string;
  bookingRef: string;
}

interface ProductBookItemRejected extends ProductBookItem {
  status: 'REJECTED';
  rejectionReasonCode: RejectionReasonCode;
}
interface ProductBookItemConfirmed extends ProductBookItem {
  status: 'CONFIRMED';
  rejectionReasonCode: RejectionReasonCode;
  lineItems: PaxMixItemWithPrice[];
  itemTotalPrice: ProductBookableItemPrice;
}

export interface ProductBookResponse {
  cartRef: string;
  partnerCartRef: string;
  currency: string;
  items: ProductBookItemConfirmed[] | ProductBookItemRejected[];
  totalConfirmedPrice: ProductBookableItemPrice;
  totalPendingPrice: ProductBookableItemPrice;
}
