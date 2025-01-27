import { AgeBandType } from '@/app/api/types';
import { OriginalPrice } from '@/app/api/getProductAvailability/[productCode]/types';

export interface ProductBookableItemPrice {
  price: OriginalPrice;
  priceBeforeDiscount: OriginalPrice;
}

export interface ProductBookableItemSchedule {
  productOptionCode: string;
  startTime?: string;
  available: boolean;
  unavailableReason: string;
  lineItems: PaxMixItemWithPrice[];
  totalPrice: ProductBookableItemPrice;
}

export interface AvailabilityScheduleSummary {
  fromPrice: number;
  fromPriceBeforeDiscount?: number;
}

export interface ProductTimeslotsResponse {
  productCode: string;
  bookableItems: ProductBookableItemSchedule[];
  currency: string;
  summary: AvailabilityScheduleSummary;
}

export interface PaxMixItem {
  ageBand: AgeBandType;
  numberOfTravelers: number;
}

export interface PaxMixItemWithPrice extends PaxMixItem {
  subtotalPrice: {
    price: OriginalPrice;
  };
}

export interface ProductTimeslotsBody {
  productCode: string;
  travelDate: string;
  currency: string;
  paxMix: PaxMixItem[];
}
