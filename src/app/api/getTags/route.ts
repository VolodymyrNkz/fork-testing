import { VIATOR_API_URL, getDefaultHeaders } from '@/app/_constants/api';

export async function GET() {
  try {
    const res = await fetch(`${VIATOR_API_URL}products/tags`, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=604800',
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
