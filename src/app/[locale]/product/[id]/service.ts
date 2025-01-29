import {
  ItineraryType,
  LanguageGuides,
  SingleProductResponse,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { API_ROUTE_PREFIX, API_ROUTES, getDefaultHeaders } from '@/app/_constants/api';
import { Guests } from '@/app/_contexts/bookingContext';
import { AGE_BANDS } from '@/app/const';
import { Attraction } from '@/app/api/types';
import { getCookie } from '@/app/_helpers/getCookie';
import { ProductAvailabilityResponse } from '@/app/api/getProductAvailability/[productCode]/types';
import { getCurrencyRates } from '@/app/_hooks/useCurrencyRates';
import { getUserInfo } from '@/app/_helpers/getUserInfo';

export interface MappedLanguageGuides {
  [key: string]: LanguageGuides[];
}

const productCache: Record<string, SingleProductResponse> = {};
const availabilityCache: Record<string, ProductAvailabilityResponse> = {};

export const fetchProductData = async (id: string): Promise<SingleProductResponse> => {
  const locale = getCookie('NEXT_LOCALE');
  const productId = `${id}-${locale}`;

  if (productCache[productId]) {
    return productCache[productId];
  }

  const response = await fetch(`${process.env.VIATOR_API_URL}products/${id}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product data for ID: ${id}`);
  }

  const product = (await response.json()) as SingleProductResponse;
  productCache[productId] = product;
  return product;
};

export const fetchAttractionData = async (id: number): Promise<Attraction> => {
  const response = await fetch(`${process.env.VIATOR_API_URL}attractions/${id}`, {
    method: 'GET',
    headers: getDefaultHeaders(),
  });

  return response.json();
};

export const fetchProductAvailability = async (
  id: string,
): Promise<ProductAvailabilityResponse> => {
  const { currency } = getUserInfo();
  const productId = `${id}-${currency}`;

  if (availabilityCache[productId]) {
    return availabilityCache[productId];
  }

  const url =
    typeof window === 'undefined'
      ? `${process.env.VIATOR_API_URL}availability/schedules/${id}`
      : `${API_ROUTE_PREFIX}${API_ROUTES.getProductAvailability}/${id}`;

  const response = await fetch(url, {
    headers: getDefaultHeaders(),
    method: 'GET',
  });

  const product = (await response.json()) as ProductAvailabilityResponse;
  const currencyRate = await getCurrencyRates(product.currency);

  const productPrice = product.summary.fromPrice;
  const productDiscount = product.summary.fromPriceBeforeDiscount || productPrice;

  const productWithCurrencyRates: ProductAvailabilityResponse = {
    ...product,
    summary: {
      fromPrice: product.summary.fromPrice * currencyRate,
      fromPriceBeforeDiscount: productDiscount * currencyRate,
    },
  };

  availabilityCache[productId] = productWithCurrencyRates;
  return productWithCurrencyRates;
};

export const getProductDescription = async (id: string) => {
  const product = await fetchProductData(id);
  const availability = await fetchProductAvailability(id);

  const getBestImageVariant = (
    variants: Array<{ width: number; height: number; url: string }>,
    targetWidth: number,
  ): string => {
    const bestVariant = variants.reduce((best, current) => {
      return Math.abs(current.width - targetWidth) < Math.abs(best.width - targetWidth)
        ? current
        : best;
    }, variants[0]);
    return bestVariant.url;
  };

  const targetWidth = 500;

  const bestImages: string[] =
    product.images
      ?.map((image) => {
        if (!image.variants || image.variants.length === 0) return null;
        return getBestImageVariant(image.variants, targetWidth);
      })
      .filter((url): url is string => Boolean(url))
      .slice(0, 9) ?? [];

  const chunkArray = (array: string[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const photoGroups = chunkArray(bestImages, 3);
  const price = availability.summary.fromPrice;
  const discount = availability.summary.fromPriceBeforeDiscount;

  return {
    photoGroups,
    title: product.title,
    pricingType: product.pricingInfo?.type,
    totalReviews: product.reviews?.totalReviews,
    averageRating: product.reviews?.combinedAverageRating,
    providerPhotos: product.images?.map((image) => getBestImageVariant(image.variants, 700)) || [],
    bookingNotAvailable: product.bookingConfirmationSettings?.confirmationType !== 'INSTANT',
    tags: product.tags,
    price: price,
    discount: discount,
  };
};

export const getProductReviewStatistic = async (id: string) => {
  const product = await fetchProductData(id);
  const productReviews = product.reviews;

  return {
    totalReviews: productReviews?.totalReviews,
    averageRating: productReviews?.combinedAverageRating?.toFixed(1) || 0,
    combined: productReviews?.reviewCountTotals || [],
  };
};

export const getProductInclusions = async (id: string) => {
  const product = await fetchProductData(id);

  const formatItem = (item: any) => {
    const formattedType =
      item.type !== 'OTHER' ? item.type?.replace(/_/g, ' ').toLocaleLowerCase() : '';

    const formattedDescription =
      item.description?.toLowerCase() === formattedType
        ? ''
        : item.description || item.otherDescription;

    return {
      title: formattedType,
      description: formattedDescription,
    };
  };

  return {
    inclusions: product.inclusions?.map(formatItem) || [],
    exclusions: product.exclusions?.map(formatItem) || [],
  };
};

export const getProductOverview = async (id: string) => {
  const product = await fetchProductData(id);

  return {
    overview: product.description,
  };
};

export const getProductAdditionalInfo = async (id: string) => {
  const product = await fetchProductData(id);

  return {
    additionalInfo: product.additionalInfo?.map(({ description }) => description) || [],
  };
};

export const getProductHints = async (id: string) => {
  const product = await fetchProductData(id);

  return {
    ticket: product.ticketInfo?.ticketTypes,
    pickup: product.logistics?.travelerPickup?.pickupOptionType !== 'MEET_EVERYONE_AT_START_POINT',
    duration:
      product.itinerary?.duration?.fixedDurationInMinutes ||
      product.itinerary?.duration?.variableDurationFromMinutes,
    isApprox: !product.itinerary?.duration?.fixedDurationInMinutes,
    languages: [...new Set(product.languageGuides?.map(({ language }) => language))],
  };
};

export const getCancellationStatus = async (id: string) => {
  const product = await fetchProductData(id);
  const cancellationPolicy = product.cancellationPolicy;

  return {
    cancellationType: cancellationPolicy?.type,
    refundEligibility: cancellationPolicy?.refundEligibility,
    cancelIfBadWeather: cancellationPolicy?.cancelIfBadWeather,
    cancelIfInsufficientTravelers: cancellationPolicy?.cancelIfInsufficientTravelers,
  };
};

export const getProductSampleMenu = async (id: string) => {
  const product = await fetchProductData(id);

  return {
    menu: product.itinerary?.itineraryType === 'ACTIVITY' ? product.itinerary.foodMenus : undefined,
  };
};

export const getProductExpectations = async (id: string) => {
  const product = await fetchProductData(id);
  const productItinerary = product.itinerary;

  return {
    itineraryType: productItinerary?.itineraryType as ItineraryType,
    description: productItinerary?.unstructuredDescription,
    itineraryItems: productItinerary?.itineraryItems,
    days: product.itinerary?.days,
  };
};

export const getAttractionName = async (id: number) => {
  const attraction = await fetchAttractionData(id);

  return attraction.name;
};

export const getProductAvailabilityInfo = async (id: string) => {
  const product = await fetchProductData(id);
  const bookingRequirements = product.bookingRequirements;
  const ageBands = product.pricingInfo?.ageBands;
  const productOptions = product.productOptions;
  const pricingType = product.pricingInfo?.type;

  const defaultGuests =
    ageBands?.reduce((acc, { ageBand, minTravelersPerBooking, maxTravelersPerBooking }) => {
      if (maxTravelersPerBooking !== 0) {
        acc[ageBand || 'ADULT'] = minTravelersPerBooking || 0;
      }
      return acc;
    }, {} as Guests) || ({} as Guests);

  const allZero = Object.values(defaultGuests).every((value) => value === 0);

  if (allZero) {
    const targetKey = (['ADULT', 'TRAVELER'].find((key) => key in defaultGuests) ||
      Object.keys(defaultGuests)[0]) as keyof Guests;

    if (targetKey) {
      defaultGuests[targetKey] = 1;
    }
  }

  return {
    ...bookingRequirements,
    ageBands,
    defaultGuests,
    productOptions,
    pricingType,
  };
};

export const formatGuestsString = (guests: Guests, t: any) => {
  return AGE_BANDS.map((ageBand) => {
    const count = guests[ageBand];
    if (count > 0) {
      return `${count} ${t(`common.passengerType.${ageBand.toLowerCase()}`, { count })}`;
    }
    return null;
  })
    .filter(Boolean)
    .join(', ');
};

export const getProductBookingQuestions = async (id: string) => {
  const product = await fetchProductData(id);

  const bookingQuestions = product.bookingQuestions;
  const travelerPickup = product.logistics?.travelerPickup;
  const languageGuides = product.productOptions?.reduce<MappedLanguageGuides>((acc, item) => {
    acc[item.productOptionCode] = item.languageGuides;
    return acc;
  }, {});
  const startPoint = product.logistics?.start;

  return {
    bookingQuestions,
    travelerPickup,
    languageGuides,
    startPoint,
  };
};
