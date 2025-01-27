import {
  ProductImage,
  PaginationOptions,
  ProductFilters,
  ProductSearchFlag,
} from '@/app/api/types';

export interface GetProductsBody {
  filtering: ProductFilters;
  sorting?: {
    sort: string;
    order?: string;
  };
  pagination?: PaginationOptions;
  currency: string;
}

export interface ProductReviewCount {
  rating: number;
  count: number;
}

export interface ProductReviewSource {
  provider: 'VIATOR' | 'TRIPADVISOR';
  reviewCounts: ProductReviewCount[];
  totalCount: number;
  averageRating: number;
}

interface ProductReviews {
  sources: ProductReviewSource[];
  reviewCountTotals: ProductReviewCount[];
  totalReviews: number;
  combinedAverageRating: number;
}

interface ItineraryDuration {
  fixedDurationInMinutes?: number;
  variableDurationFromMinutes?: number;
  variableDurationToMinutes?: number;
  unstructuredDuration?: string;
}

interface ProductSearchPricingSummary {
  fromPriceBeforeDiscount: number;
  fromPrice: number;
  currency: string;
}

interface ProductSearchPricing {
  summary: ProductSearchPricingSummary;
  partnerNetFromPrice?: number;
}

interface TranslationDetails {
  containsMachineTranslatedText: boolean;
  translationSource: 'MACHINE' | 'ORIGINAL' | 'MANUAL';
  translationAttribution?: string;
}

interface Destination {
  ref: string;
  primary: boolean;
}

type Tag = number;

export interface Product {
  productCode: string;
  title: string;
  description: string;
  images: ProductImage[];
  reviews: ProductReviews;
  duration: ItineraryDuration;
  pricing: ProductSearchPricing;
  productUrl: string;
  destinations: Destination[];
  tags: Tag[];
  flags: ProductSearchFlag[];
  confirmationType: 'INSTANT' | 'MANUAL' | 'INSTANT_THEN_MANUAL';
  itineraryType: 'STANDARD' | 'ACTIVITY' | 'MULTI_DAY_TOUR' | 'HOP_ON_HOP_OFF' | 'UNSTRUCTURED';
  translationInfo: TranslationDetails;
}

export interface ProductSearchResponse {
  products: Product[];
  totalCount: number;
}
