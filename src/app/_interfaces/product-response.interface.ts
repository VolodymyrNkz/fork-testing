export interface ProductResponse {
  status: string;
  productCode: string;
  language: string;
  createdAt: string;
  lastUpdatedAt: string;
  title: string;
  ticketInfo: TicketInfo;
  pricingInfo: PricingInfo;
  images: Image[];
  logistics: Logistics;
  timeZone: string;
  description: string;
  inclusions: Inclusion[];
  additionalInfo: AdditionalInfo[];
  cancellationPolicy: CancellationPolicy;
  bookingConfirmationSettings: BookingConfirmationSettings;
  bookingRequirements: BookingRequirements;
  languageGuides: LanguageGuide[];
  bookingQuestions: string[];
  tags: number[];
  destinations: Destination[];
  itinerary: Itinerary;
  productOptions: ProductOption[];
  translationInfo: TranslationInfo;
  supplier: Supplier;
  productUrl: string;
  reviews: Reviews;
}

export interface ProductsResponse {
  products: ProductResponse[];
  title: string;
}

export interface TicketInfo {
  ticketTypes: string[];
  ticketTypeDescription: string;
  ticketsPerBooking: string;
  ticketsPerBookingDescription: string;
}

export interface PricingInfo {
  type: string;
  ageBands: AgeBand[];
}

export interface AgeBand {
  ageBand: string;
  startAge: number;
  endAge: number;
  minTravelersPerBooking: number;
  maxTravelersPerBooking: number;
}

export interface Image {
  imageSource: string;
  caption: string;
  isCover: boolean;
  variants: ImageVariant[];
}

export interface ImageVariant {
  height: number;
  width: number;
  url: string;
}

export interface Logistics {
  start: LocationDetail[];
  end: LocationDetail[];
  redemption: Redemption;
  travelerPickup: TravelerPickup;
}

export interface LocationDetail {
  location: LocationReference;
  description: string;
}

export interface LocationReference {
  ref: string;
  pickupType?: string;
}

export interface Redemption {
  redemptionType: 'NONE' | 'ATTRACTION_START_POINT' | 'DIFFERENT_LOCATION' | 'INDIRECT_DELIVERY';
  locations?: LocationReference[];
  specialInstructions?: string;
  travelerPickup?: TravelerPickup;
}

export interface TravelerPickup {
  pickupOptionType:
    | 'PICKUP_EVERYONE'
    | 'PICKUP_AND_MEET_AT_START_POINT'
    | 'MEET_EVERYONE_AT_START_POINT';
  allowCustomTravelerPickup: boolean;
  locations?: TravelerPickupLocation[];
  minutesBeforeDepartureTimeForPickup?: number;
  additionalInfo?: string;
}

export interface TravelerPickupLocation {
  location: LocationReference;
  pickupType?: 'AIRPORT' | 'HOTEL' | 'PORT' | 'LOCATION' | 'OTHER';
}

export interface Inclusion {
  category: string;
  categoryDescription: string;
  type: string;
  description: string;
}

export interface AdditionalInfo {
  type: string;
  description: string;
}

export interface CancellationPolicy {
  type: string;
  description: string;
  cancelIfBadWeather: boolean;
  cancelIfInsufficientTravelers: boolean;
  refundEligibility: RefundEligibility[];
}

export interface RefundEligibility {
  dayRangeMin: number;
  dayRangeMax?: number;
  percentageRefundable: number;
}

export interface BookingConfirmationSettings {
  bookingCutoffType: string;
  bookingCutoffInMinutes: number;
  confirmationType: string;
}

export interface BookingRequirements {
  minTravelersPerBooking: number;
  maxTravelersPerBooking: number;
  requiresAdultForBooking: boolean;
}

export interface LanguageGuide {
  type: string;
  language: string;
  legacyGuide: string;
}

export interface Destination {
  ref: string;
  primary: boolean;
}

export interface Itinerary {
  itineraryType: string;
  skipTheLine: boolean;
  privateTour: boolean;
  duration: Duration;
  pointsOfInterest: PointOfInterest[];
  activityInfo: ActivityInfo;
  foodMenus: FoodMenu[];
}

export interface Duration {
  fixedDurationInMinutes: number;
}

export interface PointOfInterest {
  ref: string;
}

export interface ActivityInfo {
  location: LocationReference;
  description: string;
}

export interface FoodMenu {
  course: string;
  dishName: string;
  dishDescription: string;
}

export interface ProductOption {
  productOptionCode: string;
  description: string;
  title: string;
  languageGuides: LanguageGuide[];
}

export interface TranslationInfo {
  containsMachineTranslatedText: boolean;
  translationSource: string;
}

export interface Supplier {
  name: string;
  reference: string;
}

export interface Reviews {
  sources: ReviewSource[];
  reviewCountTotals: ReviewCount[];
  totalReviews: number;
  combinedAverageRating: number;
}

export interface ReviewSource {
  provider: string;
  reviewCounts: ReviewCount[];
  totalCount: number;
  averageRating: number;
}

export interface ReviewCount {
  rating: number;
  count: number;
}

export interface Address {
  street: string;
  state?: string;
  administrativeArea?: string;
  postcode: string;
  country: string;
  countryCode: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface LocationBulkResponse {
  provider: string;
  reference: string;
  providerReference: string;
  name?: string;
  address?: Address;
  center?: LatLng;
}
