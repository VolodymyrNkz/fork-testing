import { ProductReviewCount, ProductReviewSource } from '@/app/api/productSearch/types';
import { ImageVariant } from '@/app/api/getSingleProduct/[productCode]/types';

export interface ReviewsBody {
  productCode: string;
  count: number;
  start: number;
  provider: 'VIATOR' | 'TRIPADVISOR' | 'ALL';
}

interface ReviewPhoto {
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
  machineTranslated?: boolean;
  provider: 'VIATOR' | 'TRIPADVISOR';
  photosInfo?: ReviewPhoto[];
}

interface ReviewsSummary {
  totalReviews?: number;
  sources: ProductReviewSource[];
  reviewCountTotals: ProductReviewCount[];
}

export interface ReviewsResponse {
  reviews: ProductReview[];
  totalReviewsSummary: ReviewsSummary;
}
