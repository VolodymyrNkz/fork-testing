export const GTM_EVENTS = {
  checkoutContact: 'checkout_contact',
  checkoutActivity: 'checkout_activity',
  checkoutPayment: 'checkout_payment',
  bookingConfirmed: 'purchase',
};

export const GTM_IDS = {
  notSupportedEvent: 'not_supported_event',
  shelfId: (id: number) => `shelf_${id}`,
  card: 'card',
  seeAll: 'see_all',
};
