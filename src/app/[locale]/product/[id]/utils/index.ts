import { LocationBulkResponse } from '@/app/_interfaces/product-response.interface';
import { fetchGooglePlaceDetails } from '@/app/_services/fetchGooglePlace';

export const getLocationProviderReferenceLink = (location: LocationBulkResponse) => {
  if (location.provider === 'GOOGLE') {
    return `https://www.google.com/maps/search/?api=1&query=mock&query_place_id=${location.providerReference}`;
  }

  // TODO: handle more providers
  return '';
};

export const getLocationProviderReferenceInfo = async (location: LocationBulkResponse) => {
  if (location.provider === 'GOOGLE') {
    try {
      const googleData = await fetchGooglePlaceDetails(location.providerReference);
      return {
        address: googleData?.formattedAddress || '',
        name: googleData?.displayName.text || '',
      };
    } catch (error) {
      console.error('Failed to fetch Google Place details:', error);
    }
  }

  // TODO: handle more providers
  return null;
};

export const highlightMatchingText =
  (options: { className?: string }) => (text: string, searchTerm: string) => {
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, `<mark class="${options.className}">$&</mark>`);
  };
