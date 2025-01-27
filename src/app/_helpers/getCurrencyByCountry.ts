const countryToCurrency: Record<string, string> = {
  australia: 'AUD',
  brazil: 'BRL',
  canada: 'CAD',
  switzerland: 'CHF',
  denmark: 'DKK',
  sweden: 'SEK',
  germany: 'EUR',
  france: 'EUR',
  unitedkingdom: 'GBP',
  hongKong: 'HKD',
  india: 'INR',
  japan: 'JPY',
  norway: 'NOK',
  newZealand: 'NZD',
  singapore: 'SGD',
  taiwan: 'TWD',
  unitedstates: 'USD',
  southAfrica: 'ZAR',
};

export const getCurrencyByCountry = (countryCode: string): string => {
  return countryToCurrency[countryCode.toLowerCase()] || 'EUR';
};
