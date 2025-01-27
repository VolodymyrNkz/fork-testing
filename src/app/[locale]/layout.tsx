import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { SearchContextProvider } from '@/app/_contexts/searchContext';
import { LocationProvider } from '@/app/_hooks/useLocation';
import { Footer } from '@/app/[locale]/components/Footer';
import { GoogleTagManager } from '@next/third-parties/google';
import { ModalProvider } from '@/app/_contexts/modalContext';
import ErrorBoundary from '@/app/_components/ErrorBoundary';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Book an experience',
};

interface LayoutProps {
  searchParams: { city?: string; country?: string; language: string; currency: string };
  params: { locale: string };
  children: React.ReactNode;
}

export default async function RootLayout({ children, params: { locale } }: LayoutProps) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <GoogleTagManager gtmId="GTM-M4MDRXJZ" />
      <body className={montserrat.variable}>
        <NextIntlClientProvider messages={messages}>
          <ModalProvider>
            <ErrorBoundary>
              <LocationProvider>
                <SearchContextProvider>
                  <>
                    {children}
                    <Footer />
                  </>
                </SearchContextProvider>
              </LocationProvider>
            </ErrorBoundary>
          </ModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
