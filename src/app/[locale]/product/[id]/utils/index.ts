import { LocationBulkResponse } from '@/app/_interfaces/product-response.interface';

export const getLocationProviderReferenceLink = (location: LocationBulkResponse) => {
  if (location.provider === 'GOOGLE') {
    return `https://www.google.com/maps/place/?q=place_id:${location.providerReference}`;
  }

  // TODO: handle more providers
  return '';
};

export const getLocationProviderReferenceName = (location: LocationBulkResponse) => {
  if (location.provider === 'GOOGLE') {
    return 'seeOnGoogle';
  }

  // TODO: handle more providers
  return null;
};

export const highlightMatchingText =
  (options: { className?: string }) => (text: string, searchTerm: string) => {
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, `<mark class="${options.className}">$&</mark>`);
  };
