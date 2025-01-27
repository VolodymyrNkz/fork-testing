import { AgeBandType } from '@/app/api/types';

type ProductStatus = 'ACTIVE' | 'INACTIVE';
type TicketType = 'MOBILE_ONLY' | 'PAPER';
type TicketsPerBooking = 'ONE_PER_BOOKING' | 'ONE_PER_TRAVELER';
export type PricingType = 'PER_PERSON' | 'UNIT';
type PricingUnitType = 'BIKE' | 'BOAT' | 'GROUP' | 'PACKAGE' | 'ROOM' | 'AIRCRAFT' | 'VEHICLE';
type ImageSourceType = 'SUPPLIER_PROVIDED' | 'PROFESSIONAL';
type RedemptionType =
  | 'NONE'
  | 'ATTRACTION_START_POINT'
  | 'DIFFERENT_LOCATION'
  | 'INDIRECT_DELIVERY';
type PickupOptionType =
  | 'PICKUP_EVERYONE'
  | 'PICKUP_AND_MEET_AT_START_POINT'
  | 'MEET_EVERYONE_AT_START_POINT';
type BookingCutoffType = 'OPENING_TIME' | 'CLOSING_TIME' | 'START_TIME' | 'FIXED_TIME';
type ConfirmationType = 'INSTANT' | 'MANUAL' | 'INSTANT_THEN_MANUAL';
export type ItineraryType =
  | 'STANDARD'
  | 'ACTIVITY'
  | 'MULTI_DAY_TOUR'
  | 'HOP_ON_HOP_OFF'
  | 'UNSTRUCTURED';
type FoodCourseType = 'STARTER' | 'MAIN' | 'DESERT';
export type LanguageGuideType = 'GUIDE' | 'AUDIO' | 'WRITTEN';
export type CancellationType = 'STANDARD' | 'ALL_SALES_FINAL' | 'CUSTOM';
export type Admission = 'YES' | 'NO' | 'NOT_APPLICABLE';

interface TicketInfo {
  ticketTypes: TicketType[];
  ticketTypeDescription?: string;
  ticketsPerBooking: TicketsPerBooking;
  ticketsPerBookingDescription?: string;
}

export interface AgeBand {
  ageBand?: AgeBandType;
  startAge?: number;
  endAge?: number;
  minTravelersPerBooking?: number;
  maxTravelersPerBooking?: number;
}

interface PricingInfo {
  type: PricingType;
  ageBands?: AgeBand[];
  unitType?: PricingUnitType;
}

export interface ImageVariant {
  height: number;
  width: number;
  url: string;
}

interface Image {
  imageSource: ImageSourceType;
  caption?: string;
  isCover: boolean;
  variants: ImageVariant[];
}

interface Logistics {
  start: StartEndPoint[];
  end: StartEndPoint[];
  travelerPickup: TravelerPickup;
  redemption: Redemption;
}

export interface StartEndPoint {
  location: LocationReference;
  description?: string;
}

interface LocationReference {
  ref: string;
}

interface Redemption {
  redemptionType: RedemptionType;
  locations?: LocationReference[];
  specialInstructions?: string;
  travelerPickup?: TravelerPickup;
}

export interface TravelerPickup {
  pickupOptionType: PickupOptionType;
  allowCustomTravelerPickup: boolean;
  locations?: PickupLocation[];
  minutesBeforeDepartureTimeForPickup?: number;
  additionalInfo?: string;
}

export interface PickupLocation {
  location: LocationReference;
  ref: string;
  pickupType?: string;
}

export interface ProductOption {
  productOptionCode: string;
  description?: string;
  title: string;
  languageGuides: LanguageGuides[];
}

interface ProductReviews {
  sources: ProductReviewSource[];
  totalReviews: number;
  combinedAverageRating?: number;
  reviewCountTotals?: ProductReviewCount[];
}

interface ProductReviewSource {
  provider: string;
  reviewCounts: ProductReviewCount[];
}

interface ProductReviewCount {
  rating: number;
  count: number;
}

interface ProductFoodMenu {
  course: FoodCourseType;
  dishName: string;
  dishDescription?: string;
}

interface ProductActivityInfo {
  location: LocationReference;
  description?: string;
}

interface AdditionalInfo {
  type: string;
  description?: string;
}

interface ProductInclusions {
  category: string;
  categoryDescription?: string;
  type?: string;
  typeDescription?: string;
  otherDescription?: string;
  quantity?: string;
  description?: string;
}

interface PointOfInterestLocation {
  location: LocationReference;
  attractionId?: number;
}

interface Duration {
  fixedDurationInMinutes?: number;
  variableDurationFromMinutes?: number;
  variableDurationToMinutes?: number;
  unstructuredDuration?: string;
}

export interface ItineraryItems {
  pointOfInterestLocation: PointOfInterestLocation;
  duration?: Duration;
  passByWithoutStopping: boolean;
  admissionIncluded?: Admission;
  description?: string;
}

interface ProductItineraryDay {
  title?: string;
  dayNumber: number;
  items: ItineraryItems[];
}

interface ProductItinerary {
  itineraryType: ItineraryType;
  skipTheLine: boolean;
  privateTour: boolean;
  maxTravelersInSharedTour?: number;
  unstructuredDescription?: string;
  activityInfo?: ProductActivityInfo;
  itineraryItems?: ItineraryItems[];
  foodMenus: ProductFoodMenu[];
  duration?: Duration;
  days: ProductItineraryDay[];
}

export interface LanguageGuides {
  type: LanguageGuideType;
  language: string;
}

export interface BookingRequirements {
  minTravelersPerBooking: number;
  maxTravelersPerBooking: number;
  requiresAdultForBooking: boolean;
}

export interface SingleProductResponse {
  status: ProductStatus;
  productCode: string;
  language?: string;
  createdAt: string;
  lastUpdatedAt?: string;
  title?: string;
  ticketInfo?: TicketInfo;
  pricingInfo: PricingInfo;
  images?: Image[];
  logistics: Logistics;
  timeZone: string;
  redemption?: Redemption;
  travelerPickup?: TravelerPickup;
  itinerary?: ProductItinerary;
  languageGuides?: LanguageGuides[];
  tags: number[];
  bookingQuestions: string[];
  description: string;
  additionalInfo: AdditionalInfo[];
  inclusions?: ProductInclusions[];
  exclusions?: ProductInclusions[];
  cancellationPolicy?: CancellationPolicy;
  bookingConfirmationSettings?: BookingConfirmationSettings;
  bookingRequirements: BookingRequirements;
  productOptions?: ProductOption[];
  reviews: ProductReviews;
}

export interface RefundEligibility {
  dayRangeMin: number;
  dayRangeMax?: number;
  percentageRefundable: number;
  startTimestamp?: string;
  endTimestamp?: string;
}

interface CancellationPolicy {
  type: CancellationType;
  description?: string;
  cancelIfBadWeather: boolean;
  cancelIfInsufficientTravelers: boolean;
  refundEligibility: RefundEligibility[];
}

interface BookingConfirmationSettings {
  bookingCutoffType: BookingCutoffType;
  bookingCutoffInMinutes?: number;
  confirmationType: ConfirmationType;
}
