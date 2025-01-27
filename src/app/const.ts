import { AgeBandType } from '@/app/api/types';
import { RejectionReasonCode } from '@/app/api/bookProduct/types';
import { NAVIGATION_ROUTES } from '@/app/_constants/navigationRoutes';

export const FAQ_ITEMS = [
  {
    question: 'questionOne.question',
    answer: `questionOne.answer`,
  },
  {
    question: 'questionTwo.question',
    answer: `questionTwo.answer`,
  },
  {
    question: 'questionThree.question',
    answer: `questionThree.answer`,
  },
  {
    question: 'questionFour.question',
    answer: `questionFour.answer`,
  },
];

export const EXPERIENCE_CATEGORIES = [
  {
    name: 'categories.dining',
    tagId: 11890,
    imgSrc: '/assets/dining-experiences.png',
  },
  {
    name: 'categories.wineBeerSpirits',
    tagId: 21575,
    imgSrc: '/assets/wine-beer-spirits.png',
  },
  {
    name: 'categories.foodTours',
    tagId: 21567,
    imgSrc: '/assets/food-tours.png',
  },
  {
    name: 'categories.foodClasses',
    tagId: 21482,
    imgSrc: '/assets/food-drink-classes.png',
  },
  {
    name: 'categories.desserts',
    tagId: 21563,
    imgSrc: '/assets/desserts-sweets.png',
  },
  {
    name: 'categories.coffee',
    tagId: 21560,
    imgSrc: '/assets/coffee-tea.png',
  },
];

export const DEFAULT_DESTINATION_CITY = 'rome.title';
export const DEFAULT_DESTINATION_COUNTRY = 'rome.subtitle';

export const AGE_BANDS: AgeBandType[] = ['ADULT', 'SENIOR', 'YOUTH', 'CHILD', 'INFANT', 'TRAVELER'];

type RejectAction = {
  buttonText: string;
  redirectPage: string;
};

const rejectActions: Record<string, RejectAction> = {
  exploreOtherExperiences: {
    buttonText: 'Explore other experiences',
    redirectPage: NAVIGATION_ROUTES.home,
  },
  reviewBookingDetails: {
    buttonText: 'Review booking details',
    redirectPage: 'wizardStep=0',
  },
  reviewPickupDetails: {
    buttonText: 'Review pickup details',
    redirectPage: 'wizardStep=1',
  },
  reviewPaymentDetails: {
    buttonText: 'Review payment details',
    redirectPage: 'wizardStep=2',
  },
  tryAgain: {
    buttonText: 'Try again',
    redirectPage: 'wizardStep=2',
  },
};

export const REJECT_REASON_CONFIG: Record<RejectionReasonCode, RejectAction> = {
  BOOKABLE_ITEM_IS_NO_LONGER_AVAILABLE: rejectActions.exploreOtherExperiences,
  WEATHER: rejectActions.exploreOtherExperiences,
  DUPLICATE_BOOKING: rejectActions.exploreOtherExperiences,
  PRODUCT_NO_LONGER_OPERATING: rejectActions.exploreOtherExperiences,
  SIGNIFICANT_GLOBAL_EVENT_FORCE_MAJEURE: rejectActions.exploreOtherExperiences,
  TOUR_WAS_CANCELLED: rejectActions.exploreOtherExperiences,
  ISSUE_WITH_TICKET: rejectActions.reviewBookingDetails,
  ISSUE_WITH_PICKUP: rejectActions.reviewPickupDetails,
  ISSUE_WITH_PAYMENT: rejectActions.reviewPaymentDetails,
  INSUFFICIENT_FUNDS: rejectActions.reviewPaymentDetails,
  INVALID_PAYMENT_DETAILS: rejectActions.reviewPaymentDetails,
  SUSPECTED_FRAUD: rejectActions.reviewPaymentDetails,
  SOFT_DECLINE: rejectActions.reviewPaymentDetails,
  HARD_DECLINE: rejectActions.reviewPaymentDetails,
  THREE_D_SECURE_REQUIRED: rejectActions.tryAgain,
  INTERNAL_ERROR: rejectActions.reviewPaymentDetails,
  PROCESSOR_UNAVAILABLE: rejectActions.reviewPaymentDetails,
  PROCESSOR_ISSUE_WITH_PAYMENT: rejectActions.reviewPaymentDetails,
  TRANSACTION_NOT_ALLOWED: rejectActions.reviewPaymentDetails,
  CARD_INACTIVE: rejectActions.reviewPaymentDetails,
  CARD_RESTRICTED: rejectActions.reviewPaymentDetails,
  OTHER: rejectActions.exploreOtherExperiences,
};
