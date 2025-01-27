import { getDefaultHeaders, VIATOR_API_URL } from '@/app/_constants/api';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const res = await fetch(`${VIATOR_API_URL}reviews/product`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error);

      return new Response(
        JSON.stringify({ error: 'Error fetching data from Viator api', details: error.message }),
        { status: 500 },
      );
    }
  }
}
