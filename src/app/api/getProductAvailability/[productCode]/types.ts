import { AgeBandType } from '@/app/api/types';

export interface ProductBookableItemSchedule {
  productOptionCode?: string;
  seasons: BookableItemSeason[];
}

export interface BookableItemSeason {
  startDate: string;
  endDate?: string;
  pricingRecords?: PricingRecord[];
  daysOfWeek?: DayOfWeek[];
  timedEntries?: TimedEntry[];
  unavailableDates?: UnavailableDate[];
  operatingHours?: DayOperatingHours[];
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface PricingRecord {
  pricingDetails: PricingDetails[];
  timedEntries?: TimedEntry[];
}

export interface PricingDetails {
  pricingPackageType: 'PER_PERSON' | 'UNIT';
  minTravelers?: number;
  maxTravelers?: number;
  ageBand?: AgeBandType;
  price: BasicPriceWithSpecial;
}

export interface BasicPriceWithSpecial {
  original: OriginalPrice;
  special?: SpecialPrice;
}

export interface OriginalPrice {
  recommendedRetailPrice: number;
  partnerNetPrice: number;
  bookingFee: number;
  commission?: number;
  partnerTotalPrice: number;
}

export interface SpecialPrice {
  recommendedRetailPrice: number;
  partnerNetPrice: number;
  bookingFee: number;
  commission?: number;
  partnerTotalPrice: number;
  offerStartDate?: string;
  offerEndDate?: string;
  travelStartDate?: string;
  travelEndDate?: string;
}

export interface TimedEntry {
  startTime: string;
  unavailableDates?: UnavailableDate[];
}

export interface UnavailableDate {
  date: string;
  reason: 'NOT_OPERATING' | 'SOLD_OUT';
}

export interface DayOperatingHours {
  dayOfWeek: DayOfWeek;
  operatingHours: OperatingHours[];
}

export interface OperatingHours {
  opensAt: string;
  closesAt: string;
}

export interface AvailabilityScheduleSummary {
  fromPrice: number;
  fromPriceBeforeDiscount?: number;
}

export interface ProductAvailabilityResponse {
  productCode: string;
  bookableItems: ProductBookableItemSchedule[];
  currency: string;
  summary: AvailabilityScheduleSummary;
}
