import { NextResponse } from 'next/server';
import { GOOGLE_PLACES_API_URL } from '@/app/_constants/api';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const FIELD_MASK = 'id,displayName,formattedAddress';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const placeId = url.searchParams.get('placeId');

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  if (!placeId) {
    return NextResponse.json({ error: 'Invalid or missing placeId' }, { status: 400 });
  }

  try {
    const response = await fetch(`${GOOGLE_PLACES_API_URL}${placeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Google API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Google Place details:', error);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
  }
}
