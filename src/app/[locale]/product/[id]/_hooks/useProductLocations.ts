'use client';
import { useState, useEffect } from 'react';
import { API_ROUTES, getDefaultHeaders } from '@/app/_constants/api';
import {
  LocationBulkResponse,
  LocationReference,
} from '@/app/_interfaces/product-response.interface';
import {
  SingleProductResponse,
  StartEndPoint,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { useRequest } from '@/app/_hooks/useRequest';

type LocationsResponse = {
  locations: LocationBulkResponse[];
};

type LocationMap = Record<string, LocationBulkResponse>;

const skippedLocationTypes = ['CONTACT_SUPPLIER_LATER', 'MEET_AT_DEPARTURE_POINT'];

export const useProductLocations = (product: SingleProductResponse) => {
  const [locations, setLocations] = useState<LocationMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const createRequest = useRequest();

  const {
    logistics: {
      start,
      end,
      travelerPickup: { pickupOptionType, locations: pickupLocations, additionalInfo },
      redemption: { redemptionType, locations: redemptionLocations },
    },
  } = product;

  const allLocationRefs = [start, end, pickupLocations, redemptionLocations].flatMap(
    (locations) =>
      locations?.flatMap((location) => {
        const ref = 'location' in location ? location.location.ref : location.ref;

        return skippedLocationTypes.includes(ref) ? [] : [ref];
      }) || [],
  );

  const locationMapper = (location: StartEndPoint | LocationReference) => {
    const ref = 'location' in location ? location.location.ref : location.ref;

    return skippedLocationTypes.includes(ref)
      ? []
      : [
          {
            ...('description' in location ? { description: location.description } : {}),
            ...(locations[ref] || { name: ref }),
          },
        ];
  };

  const startLocations = start?.flatMap(locationMapper) || [];
  const endLocations = end?.flatMap(locationMapper) || [];
  const redemptionPoints = redemptionLocations?.flatMap(locationMapper) || [];
  const pickupPoints = pickupLocations?.flatMap(locationMapper) || [];

  useEffect(() => {
    if (!allLocationRefs.length) return;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const { locations } = await createRequest<LocationsResponse, any>({
          endpoint: API_ROUTES.locations,
          headers: getDefaultHeaders(),
          body: { locations: allLocationRefs },
        });

        const locationMap = locations.reduce<LocationMap>((acc, loc) => {
          acc[loc.reference] = loc;
          return acc;
        }, {});

        setLocations(locationMap);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLocationRefs.length]);

  return {
    startLocations,
    endLocations,
    pickupLocations: pickupPoints,
    pickupDetails: additionalInfo,
    redemptionLocations: redemptionPoints,
    pickupOptionType,
    redemptionType,
    loading,
    error,
  };
};

export type LocationPoint = ReturnType<typeof useProductLocations>['startLocations'][0];
