import { Product } from '@/app/api/productSearch/types';
import { PaginationOptions, ProductFilters } from '@/app/api/types';
import { SortingType } from '@/app/_contexts/searchContext';

interface SearchTypes {
  searchType: 'PRODUCTS' | 'ATTRACTIONS' | 'DESTINATIONS';
  pagination: PaginationOptions;
}

export interface FreeTextBody {
  searchTerm: string;
  searchTypes: SearchTypes[];
  currency: string;
  productFiltering?: ProductFilters;
  productSorting?: SortingType;
}

interface TranslationInfo {
  containsMachineTranslatedText: boolean;
}

export interface SearchedDestination {
  id: number;
  name: string;
  parentDestinationId: number;
  parentDestinationName: string;
  translationInfo: TranslationInfo;
}

export interface DestinationResponse {
  totalCount: number;
  results?: SearchedDestination[];
}

interface ProductResponse {
  totalCount: number;
  results?: Product[];
}

export interface FreeTextResponse {
  destinations: DestinationResponse;
  products: ProductResponse;
}
