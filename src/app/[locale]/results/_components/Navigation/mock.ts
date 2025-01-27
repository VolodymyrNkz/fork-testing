export const FILTERS_LANGUAGES = [
  {
    name: 'English',
    value: 'en',
  },
  {
    name: 'Chinese',
    value: 'zh-CN',
  },
  {
    name: 'Dutch',
    value: 'nl',
  },
  {
    name: 'German',
    value: 'de',
  },
  {
    name: 'Italian',
    value: 'it',
  },
  {
    name: 'Japanese',
    value: 'ja',
  },
  {
    name: 'Portuguese',
    value: 'pt',
  },
  {
    name: 'Spanish',
    value: 'es',
  },
];
export const FILTERS_DURATION = (t: any) => [
  {
    name: t('filterPanel.duration.upToOneHour'),
    value: { from: 0, to: 60 },
  },
  {
    name: t('filterPanel.duration.oneToFourHours'),
    value: { from: 60, to: 240 },
  },
  {
    name: t('filterPanel.duration.fourHoursToOneDay'),
    value: { from: 240, to: 1440 },
  },
  {
    name: t('filterPanel.duration.oneToThreeDays'),
    value: { from: 1440, to: 4320 },
  },
  {
    name: t('filterPanel.duration.threePlusDays'),
    value: { from: 4320, to: 10080 },
  },
];

export const FILTERS_SPECIALS = (t: any) => [
  {
    name: t('filterPanel.specials.deals'),
    value: 'SPECIAL_OFFER',
  },
  {
    name: t('filterPanel.specials.free'),
    value: 'FREE_CANCELLATION',
  },
  {
    name: t('filterPanel.specials.sellOut'),
    value: 'LIKELY_TO_SELL_OUT',
  },
];
export const FILTERS_RATING = (t: any) => [
  {
    name: t('filterPanel.rating.five'),
    value: { from: 5, to: 5 },
  },
  {
    name: t('filterPanel.rating.fourAndMore'),
    value: { from: 4, to: 5 },
  },
  {
    name: t('filterPanel.rating.ThreeAndMore'),
    value: { from: 3, to: 5 },
  },
];
export const SORTING = (t: any) => [
  { label: t('filterPanel.sorting.featured'), sort: 'DEFAULT' },
  { label: t('filterPanel.sorting.rating'), sort: 'TRAVELER_RATING', order: 'DESCENDING' },
  { label: t('filterPanel.sorting.priceAsc'), sort: 'PRICE', order: 'ASCENDING' },
  { label: t('filterPanel.sorting.priceDesc'), sort: 'PRICE', order: 'DESCENDING' },
  { label: t('filterPanel.sorting.durationAsc'), sort: 'ITINERARY_DURATION', order: 'ASCENDING' },
  { label: t('filterPanel.sorting.durationDesc'), sort: 'ITINERARY_DURATION', order: 'DESCENDING' },
];

export const FILTERS_CATEGORIES_IDS = [21563, 21575, 11890, 21567, 21482, 21560];

export const mockSearchPlaces = (t: any) => [
  {
    id: 1,
    title: t('paris.title'),
    subtitle: t('paris.subtitle'),
  },
  {
    id: 2,
    title: t('lisbon.title'),
    subtitle: t('lisbon.subtitle'),
  },
  {
    id: 3,
    title: t('barcelona.title'),
    subtitle: t('barcelona.subtitle'),
  },
  {
    id: 4,
    title: t('rome.title'),
    subtitle: t('rome.subtitle'),
  },
  {
    id: 5,
    title: t('madrid.title'),
    subtitle: t('madrid.subtitle'),
  },
  {
    id: 6,
    title: t('florence.title'),
    subtitle: t('florence.subtitle'),
  },
  {
    id: 7,
    title: t('london.title'),
    subtitle: t('london.subtitle'),
  },
  {
    id: 8,
    title: t('vienna.title'),
    subtitle: t('vienna.subtitle'),
  },
  {
    id: 9,
    title: t('porto.title'),
    subtitle: t('porto.subtitle'),
  },
  {
    id: 10,
    title: t('amsterdam.title'),
    subtitle: t('amsterdam.subtitle'),
  },
  {
    id: 11,
    title: t('brussels.title'),
    subtitle: t('brussels.subtitle'),
  },
];
