import { VIATOR_API_URL, getDefaultHeaders } from '@/app/_constants/api';
import { DestinationsResponse, MappedDestinations } from './types';

export async function GET() {
  try {
    const res = await fetch(`${VIATOR_API_URL}destinations`, {
      method: 'GET',
      headers: getDefaultHeaders(),
      next: { tags: ['locale'] },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    const { destinations, totalCount } = (await res.json()) as DestinationsResponse;

    const mappedDestinations = destinations.reduce<MappedDestinations['destinations']>(
      (acc, destination) => ((acc[destination.name] = destination), acc),
      {},
    );

    return new Response(JSON.stringify({ destinations: mappedDestinations, totalCount }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=604800',
        Vary: 'Accept-Language',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error);

      return new Response(
        JSON.stringify({ error: 'Error fetching data from Viator api', details: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  }
}
