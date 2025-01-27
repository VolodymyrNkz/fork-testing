export interface ViatorProductResponse {
  productCode: string;
  title: string;
  description: string;
  images: Array<ViatorProductImage>;
  reviews: ViatorReviewData;
  duration: ViatorDuration;
  confirmationType: string;
  itineraryType: string;
  pricing: ViatorPricing;
  productUrl: string;
  destinations: Array<ViatorDestination>;
  tags: Array<number>;
  flags: Array<string>;
  translationInfo: ViatorTranslationInfo;
}

export interface ViatorProductImage {
  imageSource: string;
  caption: string;
  isCover: boolean;
  variants: Array<ViatorImageVariant>;
}

export interface ViatorImageVariant {
  url: string;
  width: number;
  height: number;
}

export interface ViatorReviewData {
  sources: Array<ViatorReviewSource>;
  totalReviews: number;
  combinedAverageRating: number;
}

interface ViatorReviewSource {
  provider: string;
  totalCount: number;
  averageRating: number;
}

export interface ViatorDuration {
  fixedDurationInMinutes: number;
}

export interface ViatorPricing {
  summary: ViatorPricingSummary;
  currency: string;
}

export interface ViatorPricingSummary {
  fromPrice: number;
  fromPriceBeforeDiscount?: number;
}

export interface ViatorDestination {
  ref: string;
  primary: boolean;
}

export interface ViatorTranslationInfo {
  containsMachineTranslatedText: boolean;
  translationSource: string;
}
