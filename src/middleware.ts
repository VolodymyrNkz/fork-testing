import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { getCurrencyByCountry } from '@/app/_helpers/getCurrencyByCountry';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const response = intlMiddleware(request);
  searchParams.forEach((value, key) => {
    if (key === 'country') {
      response.cookies.set('currency', getCurrencyByCountry(value), { path: '/' });
    }
    response.cookies.set(key, value, { path: '/' });
  });

  return response;
}

export const config = {
  matcher: ['/', '/(fr|en|es|it)/:path*'],
};
