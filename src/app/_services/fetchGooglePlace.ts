import { API_ROUTE_PREFIX, API_ROUTES } from '@/app/_constants/api';
import { GooglePlaceResponse } from '@/app/api/googlePlaces/types';

const cacheStorage: Record<string, GooglePlaceResponse | null> = {};

export async function fetchGooglePlaceDetails(
  placeId: string,
): Promise<GooglePlaceResponse | null> {
  if (cacheStorage[placeId]) {
    return cacheStorage[placeId];
  }

  try {
    const response = await fetch(
      `${API_ROUTE_PREFIX}${API_ROUTES.googlePlaces}?placeId=${placeId}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Google place: ${response.status} ${response.statusText}`);
    }

    const data: GooglePlaceResponse = await response.json();
    cacheStorage[placeId] = data;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
