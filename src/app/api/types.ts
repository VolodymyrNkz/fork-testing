export type AgeBandType = 'ADULT' | 'SENIOR' | 'YOUTH' | 'CHILD' | 'INFANT' | 'TRAVELER';
export enum RequestCodeStatus {
  BAD_REQUEST = 'BAD_REQUEST',
}
export type ProductSearchFlag =
  | 'NEW_ON_VIATOR'
  | 'FREE_CANCELLATION'
  | 'SKIP_THE_LINE'
  | 'PRIVATE_TOUR'
  | 'SPECIAL_OFFER'
  | 'LIKELY_TO_SELL_OUT';

interface ImageVariant {
  height: number;
  width: number;
  url: string;
}

export interface ProductImage {
  imageSource: 'SUPPLIER_PROVIDED' | 'PROFESSIONAL';
  caption: string;
  isCover: boolean;
  variants: ImageVariant[];
}

export interface FromToFilter {
  from: number;
  to: number;
}

export interface PaginationOptions {
  start: number;
  count: number;
}

export interface ProductFilters {
  destination?: string;
  tags?: number[];
  flags?: string[];
  lowestPrice?: number;
  highestPrice?: number;
  startDate?: string;
  endDate?: string;
  includeAutomaticTranslations?: string;
  confirmationType?: string;
  durationInMinutes?: FromToFilter;
  rating?: FromToFilter;
  price?: Partial<FromToFilter>;
}

export interface ReviewPhoto {
  photoVersions: ImageVariant[];
}

export interface ProductReview {
  reviewReference: string;
  language: string;
  avatarUrl?: string;
  publishedDate: string;
  userName?: string;
  rating?: number;
  text: string;
  title: string;
  machineTranslated: boolean;
  provider: 'VIATOR' | 'TRIPADVISOR';
  helpfulVotes: number;
  photosInfo?: ReviewPhoto[];
}

export interface Attraction {
  attractionId: string;
  name: string;
}
