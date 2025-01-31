import { DEFAULT_LANGUAGE } from '@/app/_constants/common';
import { getCookie } from '@/app/_helpers/getCookie';

export const VIATOR_API_URL = 'https://api.sandbox.viator.com/partner/';
export const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places/';

export type AcceptLanguage =
  | 'en' // English
  | 'da' // Danish
  | 'nl' // Dutch
  | 'no' // Norwegian
  | 'es' // Spanish
  | 'sv' // Swedish
  | 'fr' // French
  | 'it' // Italian
  | 'de' // German
  | 'pt' // Portuguese
  | 'ja'; // Japanese

interface RequestHeaders {
  [key: string]: string;
  'Content-Type': 'application/json';
  'exp-api-key': string;
  'Accept-Language': AcceptLanguage;
  Accept: 'application/json;version=2.0';
  Vary: string;
}

export const getDefaultHeaders = (): RequestHeaders => {
  const acceptLanguage = getCookie('NEXT_LOCALE') || DEFAULT_LANGUAGE;

  return {
    'Content-Type': 'application/json',
    'exp-api-key': process.env.VIATOR_API_KEY as string,
    'Accept-Language': acceptLanguage as AcceptLanguage,
    Accept: 'application/json;version=2.0',
    Vary: 'Accept-Language',
  };
};

export const API_ROUTE_PREFIX = '/api/';
export const API_ROUTES = {
  getTags: 'getTags',
  getDestinations: 'getDestinations',
  freeTextSearch: 'freeTextSearch',
  productSearch: 'productSearch',
  getSingleProduct: 'getSingleProduct',
  getReviews: 'getReviews',
  locations: 'locations',
  getProductAvailability: 'getProductAvailability',
  getProductTimeslots: 'getProductTimeslots',
  bookProduct: 'bookProduct',
  getBookingStatus: 'getBookingStatus',
  googlePlaces: 'googlePlaces',
};
