import { NextResponse } from 'next/server';
import { ViatorProductResponse } from '@/app/_interfaces/viator-product-response.interface';
import { getDefaultHeaders } from '@/app/_constants/api';

async function fetchExperiencesFromViator(params: unknown): Promise<ViatorProductResponse[]> {
  const res = await fetch(`${process.env.VIATOR_API_URL}products/search`, {
    cache: 'no-store',
    method: 'POST',
    headers: getDefaultHeaders() as HeadersInit,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.products;
}

export async function POST(req: Request) {
  const body = await req.json();

  const results = await Promise.all(
    body.sections.map(async (section: any) => {
      const products: ViatorProductResponse[] = await fetchExperiencesFromViator(
        section.experiencesFilters,
      );

      return { title: section.title, products };
    }),
  );

  return NextResponse.json(results);
}
