import { NextRequest, NextResponse } from 'next/server';
import { getDefaultHeaders } from '@/app/_constants/api';

export async function GET(req: NextRequest, { params }: { params: { productCode: string } }) {
  const { productCode } = params;

  try {
    const res = await fetch(
      `https://api.sandbox.viator.com/partner/availability/schedules/${productCode}`,
      {
        headers: getDefaultHeaders(),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch product: ${res.statusText}` },
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
