import { NextRequest, NextResponse } from 'next/server';
import { getDefaultHeaders, VIATOR_API_URL } from '@/app/_constants/api';

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  try {
    const res = await fetch(`${VIATOR_API_URL}exchange-rates`, {
      headers: getDefaultHeaders(),
      body: JSON.stringify(requestBody),
      method: 'POST',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch exchange rates: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 },
    );
  }
}
