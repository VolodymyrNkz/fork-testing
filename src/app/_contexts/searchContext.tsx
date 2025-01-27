'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GetProductsBody, Product, ProductSearchResponse } from '@/app/api/productSearch/types';
import { SORTING } from '@/app/[locale]/results/_components/Navigation/mock';
import { FromToFilter, ProductFilters } from '@/app/api/types';
import { FreeTextBody, FreeTextResponse } from '@/app/api/freeTextSearch/type';
import { Tag, TagsResponse } from '@/app/api/getTags/types';
import { Destination, MappedDestinations } from '@/app/api/getDestinations/types';
import { AcceptLanguage, API_ROUTES } from '@/app/_constants/api';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { revalidateLocaleCache } from '@/app/_helpers/revalidateLocale';
import { useRequest } from '@/app/_hooks/useRequest';

export type SortingType = Omit<ReturnType<typeof SORTING>[number], 'label'>;

export type FilterKeys = keyof SearchFilters;

export interface SearchFilters extends ProductFilters {
  language: AcceptLanguage;
}

interface ISearchContext {
  products: Product[];
  hasMore: boolean;
  totalCount: number;
  loading: boolean;
  currentPage: number;
  handleSetFilters: (key: FilterKeys, value: SearchFilters[FilterKeys]) => void;
  filters: Partial<SearchFilters> | null;
  handleSetDurationFilter: (value: FromToFilter) => void;
  handleSetSortingType: (value: SortingType) => void;
  handleSetDateRangeFilter: (value: [string, string]) => void;
  handleSetCostRangeFilter: (value: [number, number]) => void;
  handleClearFilters: () => void;
  handleUpdateCurrentPage: (page: number) => void;
  handleSetDestinationFilter: (value: string) => void;
  setSearchInputValue: (value: string) => void;
  loadingNewChunk: boolean;
  searchedDestination: string;
  tags: Tag[];
  mappedDestinations: MappedDestinations['destinations'];
  destinations: Destination[];
  isFreeText: boolean;
  searchInputValue: string;
  handleSetBulkFilters: (value: ProductFilters) => void;
}

export const defaultFilters = { tags: [21911], confirmationType: 'INSTANT' };
const defaultSort = { sort: 'DEFAULT' };
export const PRODUCTS_PER_PAGE = 25;

const initialContext: ISearchContext = {
  handleSetFilters: () => {},
  products: [],
  hasMore: true,
  totalCount: 0,
  currentPage: 1,
  loading: false,
  loadingNewChunk: false,
  filters: defaultFilters,
  handleSetDurationFilter: () => {},
  handleSetSortingType: () => {},
  handleSetDateRangeFilter: () => {},
  handleClearFilters: () => {},
  handleSetCostRangeFilter: () => {},
  handleUpdateCurrentPage: () => {},
  handleSetDestinationFilter: () => {},
  setSearchInputValue: () => {},
  handleSetBulkFilters: () => {},
  searchedDestination: '',
  tags: [],
  mappedDestinations: {},
  destinations: [],
  isFreeText: false,
  searchInputValue: '',
};

export const SearchContext = createContext<ISearchContext>(initialContext);

export function useSearch() {
  return useContext(SearchContext);
}

function isProductResponse(
  response: FreeTextResponse | ProductSearchResponse,
): response is ProductSearchResponse {
  return (response as ProductSearchResponse).totalCount !== undefined;
}

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocale();

  const [searchedDestination, setSearchedDestination] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingNewChunk, setLoadingNewChunk] = useState(false);
  const [filters, setFilters] = useState<Partial<SearchFilters>>(defaultFilters);
  const [sorting, setSorting] = useState<SortingType>(defaultSort);
  const [tags, setTags] = useState<Tag[]>([]);
  const [destinations, setDestinations] = useState<MappedDestinations['destinations']>({});
  const [isFreeText, setIsFreeText] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const { currency } = getUserInfo();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || '');
  const pathname = usePathname();

  const createRequest = useRequest();

  const prevDestination = useRef(searchedDestination);

  useEffect(() => {
    setHasMore(products.length !== totalCount);
  }, [products, totalCount]);

  useEffect(() => {
    const searchTerm = searchParams.get('searchTerm');

    if (searchTerm && !searchedDestination) {
      setSearchedDestination(searchTerm);
    }
  }, [searchParams, searchedDestination]);

  const getProducts = useCallback(
    async (currentPage: number, isFreeText: boolean = false) => {
      setLoading(true);

      if (searchedDestination && pathname.includes('results')) {
        params.set('page', String(currentPage));
        params.set('searchTerm', searchedDestination);
        router.replace(`${pathname}?${params.toString()}`);
      }

      const freeTextBody: FreeTextBody = {
        searchTerm: searchedDestination || '',
        productFiltering: {
          ...filters,
          price: {
            ...(!!filters.lowestPrice && { from: filters.lowestPrice }),
            ...(!!filters.highestPrice && { to: filters.highestPrice }),
          },
        },
        currency,
        searchTypes: [
          {
            searchType: 'PRODUCTS',
            pagination: {
              count: PRODUCTS_PER_PAGE,
              start: currentPage === 1 ? 1 : PRODUCTS_PER_PAGE * (currentPage - 1) + 1,
            },
          },
        ],
        productSorting: sorting,
      };

      const productSearchBody: GetProductsBody = {
        filtering: {
          destination: String(destinations[searchedDestination]?.destinationId),
          ...filters,
        },
        sorting: sorting,
        pagination: {
          count: PRODUCTS_PER_PAGE,
          start: currentPage === 1 ? 1 : PRODUCTS_PER_PAGE * (currentPage - 1) + 1,
        },
        currency,
      };

      const endpoint = isFreeText ? API_ROUTES.freeTextSearch : API_ROUTES.productSearch;
      const body = isFreeText ? freeTextBody : productSearchBody;

      try {
        const response = await createRequest<
          FreeTextResponse | ProductSearchResponse,
          FreeTextBody | GetProductsBody
        >({
          endpoint,
          body,
        });

        if (isProductResponse(response)) {
          setTotalCount(response.totalCount || 0);

          if (response.products.length) {
            setProducts(response?.products);
          }
        } else {
          setTotalCount(response.products.totalCount || 0);

          if (response.products.results) {
            setProducts(response.products.results);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
        setLoadingNewChunk(false);
      }
    },
    [searchedDestination, pathname, filters, currency, sorting, destinations, params, router],
  );

  const handleSetFilters = async (key: FilterKeys, value: SearchFilters[FilterKeys]) => {
    const DEFAULT_TAG = defaultFilters.tags?.[0];

    if (value === null) {
      setFilters((prev) => {
        const updatedFilters = { ...prev };
        delete updatedFilters[key];
        return updatedFilters;
      });
    } else if (key === 'tags') {
      setFilters((prev) => {
        const currentTags = prev?.tags || [];
        const isTagIncluded = currentTags.includes(value as number);

        const updatedTags = isTagIncluded
          ? currentTags.filter((tag) => tag !== value)
          : [DEFAULT_TAG, value as number].slice(0, 2);

        return {
          ...prev,
          tags: updatedTags,
        };
      });
    } else if (['flags'].includes(key)) {
      setFilters((prev) => {
        const currentValues = (prev?.[key as 'flags'] || []) as (string | number)[];
        const newValue = Array.isArray(value) ? value : [value];

        const isValueIncluded = currentValues.some((v) => newValue.includes(v));

        const updatedFlags = isValueIncluded
          ? currentValues.filter((v) => !newValue.includes(v))
          : [...currentValues, ...newValue];

        return { ...prev, [key]: updatedFlags };
      });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSetDurationFilter = async (value: FromToFilter) => {
    setFilters((prev) => {
      const currentRange = prev?.durationInMinutes || ({} as FromToFilter);

      const isSelected =
        currentRange?.from !== undefined &&
        currentRange?.to !== undefined &&
        value.from >= currentRange.from &&
        value.to <= currentRange.to;

      let updatedRange: FromToFilter;

      if (isSelected) {
        updatedRange = removeRange(currentRange, value) as FromToFilter;
      } else {
        updatedRange = mergeRange(currentRange, value);
      }

      return {
        ...prev,
        durationInMinutes: updatedRange,
      };
    });
  };

  function mergeRange(current: FromToFilter, newRange: FromToFilter) {
    const from = current.from !== undefined ? Math.min(current.from, newRange.from) : newRange.from;
    const to =
      current.to !== undefined && newRange.to !== undefined
        ? Math.max(current.to, newRange.to)
        : newRange.to;

    return { from, to };
  }

  function removeRange(current: FromToFilter, newRange: FromToFilter) {
    if (current.from === newRange.from && current.to === newRange.to) {
      return {};
    }

    if (newRange.from === current.from) {
      return { from: newRange.to, to: current.to };
    }

    if (newRange.to === current.to) {
      return { from: current.from, to: newRange.from };
    }

    return current;
  }

  const handleSetSortingType = (value: SortingType) => {
    setSorting(value);
  };

  const handleSetDateRangeFilter = (dateRange: [string, string]) => {
    setFilters((prev) => ({ ...prev, startDate: dateRange[0], endDate: dateRange[1] }));
  };

  const handleSetCostRangeFilter = (constRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, lowestPrice: constRange[0], highestPrice: constRange[1] }));
  };

  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, []);

  const handleSetBulkFilters = (filters: ProductFilters) => {
    setFilters(filters);
  };

  const handleUpdateCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetDestinationFilter = (searchValue: string) => {
    setSearchedDestination(searchValue);
  };

  useEffect(() => {
    revalidateLocaleCache();
  }, [locale]);

  useEffect(() => {
    (async () => {
      const tagsData = createRequest<TagsResponse>({
        endpoint: API_ROUTES.getTags,
        method: 'GET',
      });

      const destinationsData = createRequest<MappedDestinations>({
        endpoint: API_ROUTES.getDestinations,
        method: 'GET',
      });

      const [{ tags }, { destinations }] = await Promise.all([tagsData, destinationsData]);
      setTags(tags);
      setDestinations(destinations);
    })();
  }, []);

  useEffect(() => {
    if (isFreeText) {
      handleClearFilters();
    }
  }, [isFreeText]);

  useEffect(() => {
    if (isMounted) {
      getProducts(currentPage, isFreeText);
    } else {
      setIsMounted(true);
    }
  }, [currentPage]);

  useEffect(() => {
    if (searchedDestination && Object.keys(destinations).length) {
      const searchedTextInDestinations = destinations[searchedDestination]?.name;

      const currentPage = Number(searchParams.get('page')) || 1;

      if (isMounted) {
        setCurrentPage(currentPage);
      } else {
        setIsMounted(true);
      }
      setIsFreeText(!searchedTextInDestinations);
      getProducts(currentPage, !searchedTextInDestinations);
      setLoadingNewChunk(true);
    }
  }, [destinations, searchedDestination, sorting, filters]);

  useEffect(() => {
    if (prevDestination.current && prevDestination.current !== searchedDestination)
      handleClearFilters();
  }, [searchedDestination, handleClearFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <SearchContext.Provider
      value={{
        products,
        hasMore,
        totalCount,
        loading,
        handleSetFilters,
        filters,
        handleSetDurationFilter,
        handleSetSortingType,
        handleSetDateRangeFilter,
        handleClearFilters,
        handleSetCostRangeFilter,
        handleUpdateCurrentPage,
        loadingNewChunk,
        handleSetDestinationFilter,
        searchedDestination,
        tags,
        mappedDestinations: destinations,
        destinations: Object.values(destinations),
        isFreeText,
        searchInputValue,
        setSearchInputValue,
        handleSetBulkFilters,
        currentPage,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
