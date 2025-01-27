'use client';

import { createContext, ReactNode, useContext } from 'react';
import { getCurrencyByCountry } from '@/app/_helpers/getCurrencyByCountry';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_DESTINATION_CITY, DEFAULT_DESTINATION_COUNTRY } from '@/app/const';
import { useTranslations } from 'next-intl';

interface LocationContextType {
  city: string;
  country: string;
  currency: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const t = useTranslations('searchPlaces');

  const country = searchParams.get('country') || t(DEFAULT_DESTINATION_COUNTRY);
  const city = searchParams.get('city') || t(DEFAULT_DESTINATION_CITY);
  const currency = getCurrencyByCountry(country);

  return (
    <LocationContext.Provider value={{ currency, city, country }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
