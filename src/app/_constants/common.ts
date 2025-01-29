export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_COUNTRY_CODE = 'US';

export const ONE_DAY = 24 * 60 * 60 * 1000;

export const LANGUAGES = (t: any): Record<string, string> => ({
  en: t('common.languages.en'),
  fr: t('common.languages.fr'),
  it: t('common.languages.it'),
  es: t('common.languages.es'),
});

export const CURRENCIES = {
  EUR: '€ • EUR',
  USD: '$ • USD',
  GBP: '£ • GBP',
  CHF: '₣ • CHF',
  SEK: 'kr • SEK',
};
