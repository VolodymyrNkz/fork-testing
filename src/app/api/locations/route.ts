import { NextResponse } from 'next/server';
import { getDefaultHeaders, VIATOR_API_URL } from '@/app/_constants/api';
import {
  LocationBulkResponse,
  LocationReference,
} from '@/app/_interfaces/product-response.interface';

const API_URL = `${VIATOR_API_URL}locations/bulk`;

interface CachedLocation {
  data: LocationBulkResponse;
  timestamp: number;
}

const cache = new Map<string, CachedLocation>();
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
const REVALIDATE_TTL = 604800;
const MAX_AGE = 2592000;

async function fetchUncachedLocations(uncachedLocations: LocationReference[]) {
  const locationChunks = uncachedLocations.reduce<LocationReference[][]>(
    (chunks, location, index) => {
      const chunkIndex = Math.floor(index / 500);

      chunks[chunkIndex] ??= [];
      chunks[chunkIndex].push(location);

      return chunks;
    },
    [],
  );

  const locationsData = await Promise.allSettled(
    locationChunks.map(async (chunk) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ locations: chunk }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      return (await response.json()).locations as LocationBulkResponse[];
    }),
  );

  const newLocations = locationsData.flatMap((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(result.reason);
      return [];
    }
  });

  newLocations.forEach((location: LocationBulkResponse) => {
    cache.set(location.reference, {
      data: location,
      timestamp: Date.now(),
    });
  });

  return newLocations;
}

export async function POST(req: Request) {
  try {
    const { locations } = await req.json();

    if (!locations || locations.length === 0) {
      return NextResponse.json({ error: 'No locations provided.' }, { status: 400 });
    }

    const now = Date.now();
    const cachedLocations: LocationBulkResponse[] = [];
    const uncachedLocations: LocationReference[] = [];

    locations.forEach((location: LocationReference) => {
      const cachedLocation: CachedLocation | undefined = cache.get(location.ref);
      if (cachedLocation && now - cachedLocation.timestamp < CACHE_TTL) {
        cachedLocations.push(cachedLocation.data);
      } else {
        uncachedLocations.push(location);
      }
    });

    if (uncachedLocations.length === 0) {
      return NextResponse.json({ locations: cachedLocations }, { status: 200 });
    }

    const newLocations = await fetchUncachedLocations(uncachedLocations);
    const allLocations = [...cachedLocations, ...newLocations];

    return NextResponse.json(
      { locations: allLocations },
      {
        headers: {
          'Cache-Control': `public, max-age=${MAX_AGE}, stale-while-revalidate=${REVALIDATE_TTL}`,
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
