import { VIATOR_API_URL, getDefaultHeaders } from '@/app/_constants/api';

export async function POST(req: Request) {
  const requestBody = await req.json();

  try {
    const res = await fetch(`${VIATOR_API_URL}bookings/cart/hold`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(requestBody),
    });

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
