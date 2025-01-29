'use client';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AgeBandType, RequestCodeStatus } from '@/app/api/types';
import {
  PaxMixItemWithPrice,
  ProductBookableItemSchedule,
  ProductTimeslotsBody,
  ProductTimeslotsResponse,
} from '@/app/api/getProductTimeslots/types';
import { API_ROUTES, getDefaultHeaders } from '@/app/_constants/api';
import { formatYYYYMMDD } from '@/app/_helpers/formatDateRange';
import {
  CancellationType,
  LanguageGuideType,
  PickupLocation,
  PricingType,
} from '@/app/api/getSingleProduct/[productCode]/types';
import { generateId } from '@/app/_helpers/generateID';
import { ProductHoldBody, ProductHoldResponse } from '@/app/api/holdProduct/types';
import { getUserInfo } from '@/app/_helpers/getUserInfo';
import {
  BookingQuestion,
  BookingQuestionId,
  ProductQuestionsResponse,
} from '@/app/api/getProductQuestions/types';
import { useForm, UseFormReturn, VALIDATORS } from '@/app/_hooks/useForm';
import { LocationsBulkBody, LocationsBulkResponse } from '@/app/api/locationsBulk/types';
import { DEFAULT_COUNTRY_CODE } from '@/app/_constants/common';
import loadPayment from 'payment-module';
import {
  BookingQuestionAnswer,
  BookingStatus,
  ProductBookBody,
  ProductBookResponse,
  RejectionReasonCode,
} from '@/app/api/bookProduct/types';
import { BookingConfirmationModal } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/BookingConfirmationModal';
import { getCountryCallingCode } from 'react-phone-number-input/min';
import { PaymentType } from 'payment-module/dist/types/types';
import Loading from '@/app/[locale]/loading';
import { useModal } from '@/app/_contexts/modalContext';
import { useRequest } from '@/app/_hooks/useRequest';
import { CountryCode } from 'libphonenumber-js';

const SORTED_TRAVELER_QUESTIONS: BookingQuestionId[] = [
  'FULL_NAMES_FIRST',
  'FULL_NAMES_LAST',
  'DATE_OF_BIRTH',
  'PASSPORT_PASSPORT_NO',
  'PASSPORT_NATIONALITY',
  'PASSPORT_EXPIRY',
  'WEIGHT',
  'HEIGHT',
];

const SORTED_BOOKING_QUESTIONS: BookingQuestionId[] = [
  'TRANSFER_AIR_DEPARTURE_AIRLINE',
  'TRANSFER_PORT_CRUISE_SHIP',
  'TRANSFER_RAIL_ARRIVAL_LINE',
  'TRANSFER_RAIL_DEPARTURE_LINE',
  'TRANSFER_AIR_ARRIVAL_AIRLINE',
  'TRANSFER_AIR_DEPARTURE_FLIGHT_NO',
  'TRANSFER_AIR_ARRIVAL_FLIGHT_NO',
  'DISEMBARKATION_TIME',
  'TRANSFER_DEPARTURE_TIME',
  'TRANSFER_PORT_ARRIVAL_TIME',
  'TRANSFER_ARRIVAL_TIME',
  'TRANSFER_PORT_DEPARTURE_TIME',
  'TRANSFER_DEPARTURE_DATE',
  'TRANSFER_RAIL_DEPARTURE_STATION',
  'TRANSFER_RAIL_ARRIVAL_STATION',
  'TRANSFER_DEPARTURE_PICKUP',
];

interface CancellationInfo {
  title: string;
  subTitle: string;
  isAvailable: boolean;
}

export type Guests = {
  [key in AgeBandType]: number;
};

export interface BookingData {
  paxMix: PaxMixItemWithPrice[];
  totalPrice: number;
  pricingType: PricingType;
  productCode: string;
  productOptionCode: string;
  cancellationType?: CancellationType;
  description?: string;
}

interface ProductBookingQuestions {
  perTraveler: BookingQuestion[];
  perBooking: BookingQuestion[];
}

interface BookingStatusData {
  reason?: RejectionReasonCode;
  status: BookingStatus;
  currency?: string;
}

interface BookingContext {
  guests: Guests | null;
  travelDate: Date | null;
  sessionExpiresAt: number | null;
  cancellationInfo: CancellationInfo | null;
  payment: PaymentType | null;
  travelTime: string;
  productTitle: string;
  pickupLocationReference: string;
  showTimeslots: boolean;
  shouldOpenCalendar: boolean;
  shouldCloseCheckout: boolean;
  loading: boolean;
  sessionToken: string;
  availabilityChanged: boolean;
  handleSetProductTitle: (title: string) => void;
  handleSetProductTags: (tags: number[]) => void;
  holdLoading: boolean;
  productBookLoading: boolean;
  bookableItems: ProductBookableItemSchedule[];
  bookingQuestionsFormHandler: UseFormReturn<any>;
  paymentFormHandler: UseFormReturn<{
    country: string;
    postalCode: string;
  }>;
  contactDetailsFormHandler: UseFormReturn<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
  }>;
  setPartnerRef: React.Dispatch<React.SetStateAction<string | null>>;
  setShouldOpenCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldCloseCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  productBookingData: BookingData | null;
  handleSetTemporaryGuests: (guests: Guests) => void;
  handleSetPickupLocationReference: (ref: string) => void;
  handleApplyGuests: (guests?: Guests) => boolean | undefined;
  getProductQuestions: (questions: string[]) => ProductBookingQuestions;
  handleShowTimeSlots: () => void;
  handleSubmitPayment: () => void;
  initializePayment: (sessionToken: string) => void;
  getLocations: (locations: PickupLocation[]) => Promise<LocationsBulkResponse>;
  proceedBooking: (bookingData: BookingData, recall?: boolean) => void;
  handleSetCancellationInfo: (cancellationInfo: CancellationInfo) => void;
  handleSetTravelDate: (date: Date) => void;
  handleSetTravelTime: (time: string) => void;
  getProductBookableItems: (
    productCode: string,
  ) => Promise<ProductBookableItemSchedule[] | undefined>;
}

const formHandlerInitValues = {
  formValues: {},
  updateField: () => {},
  setValidator: () => {},
  isFieldValid: () => true,
  isAllFieldsValid: () => true,
  getInvalidFields: () => [],
  touchAllFields: () => {},
  removeField: () => {},
  formState: {},
};

const initialContext: BookingContext = {
  guests: null,
  travelDate: null,
  productBookingData: null,
  cancellationInfo: null,
  payment: null,
  sessionExpiresAt: null,
  travelTime: '',
  productTitle: '',
  pickupLocationReference: '',
  showTimeslots: false,
  loading: false,
  sessionToken: '',
  holdLoading: false,
  productBookLoading: false,
  shouldOpenCalendar: false,
  shouldCloseCheckout: false,
  availabilityChanged: false,
  bookableItems: [],
  setPartnerRef: () => {},
  setShouldOpenCalendar: () => {},
  setShouldCloseCheckout: () => {},
  bookingQuestionsFormHandler: formHandlerInitValues,
  contactDetailsFormHandler: formHandlerInitValues as any,
  paymentFormHandler: formHandlerInitValues as any,
  getProductQuestions: () => ({ perTraveler: [], perBooking: [] }),
  handleSetTemporaryGuests: () => {},
  getLocations: () => Promise.resolve({ locations: [] }),
  handleSetCancellationInfo: () => {},
  handleSubmitPayment: () => {},
  handleSetProductTitle: () => {},
  handleSetProductTags: () => {},
  handleSetPickupLocationReference: () => {},
  handleApplyGuests: () => false,
  handleShowTimeSlots: () => {},
  proceedBooking: () => {},
  initializePayment: () => {},
  handleSetTravelDate: () => {},
  handleSetTravelTime: () => {},
  getProductBookableItems: () => Promise.resolve([]),
};

export const BookingContext = createContext<BookingContext>(initialContext);

export function useBooking() {
  return useContext(BookingContext);
}

export const BookingContextProvider = ({
  children,
  bookingNotAvailable,
}: {
  children: ReactNode;
  bookingNotAvailable: boolean;
}) => {
  const { currency } = getUserInfo();

  const [temporaryGuests, setTemporaryGuests] = useState<Guests | null>(null);
  const [guests, setGuests] = useState<Guests | null>(null);
  const [travelDate, setTravelDate] = useState<Date | null>(null);
  const [travelTime, setTravelTime] = useState('');
  const [showTimeslots, setShowTimeslots] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [holdLoading, setHoldLoading] = useState(false);
  const [productBookingData, setProductBookingData] = useState<BookingData | null>(null);
  const [partnerRef, setPartnerRef] = useState<string | null>(null);
  const [cancellationInfo, setCancellationInfo] = useState<CancellationInfo | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [availabilityChanged, setAvailabilityChanged] = useState(false);
  const [bookableItems, setBookableItems] = useState<ProductBookableItemSchedule[]>([]);
  const [shouldOpenCalendar, setShouldOpenCalendar] = useState(false);
  const [allBookingQuestions, setAllBookingQuestions] = useState<BookingQuestion[]>([]);
  const [productBookingQuestions, setProductBookingQuestions] = useState<ProductBookingQuestions>({
    perTraveler: [],
    perBooking: [],
  });
  const [productTitle, setProductTitle] = useState<string>('');
  const [productTags, setProductTags] = useState<number[]>([]);
  const [sessionToken, setSessionToken] = useState('');
  const [cartRef, setCartRef] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string>('');
  const [payment, setPayment] = useState<null | PaymentType>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatusData | null>(null);
  const [productBookLoading, setProductBookLoading] = useState(false);
  const [pickupLocationReference, setPickupLocationReference] = useState<string>('');
  const [shouldCloseCheckout, setShouldCloseCheckout] = useState(false);
  const [lastHeldCurrency, setLastHeldCurrency] = useState<string | null>(null);

  const { openModal } = useModal();

  const createRequest = useRequest();

  const bookingQuestionsFormHandler = useForm<any>({});

  const contactDetailsFormHandler = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: DEFAULT_COUNTRY_CODE as CountryCode,
    },
    'userInfo',
  );

  const paymentFormHandler = useForm({
    country: '',
    postalCode: '',
  });

  const handleSetTemporaryGuests = useCallback((value: Guests) => {
    setTemporaryGuests(value);
  }, []);

  const handleApplyGuests = (value?: Guests) => {
    const guests = value || temporaryGuests;

    if (guests) {
      const isValid = Object.values(guests).some((item) => !!item);
      if (isValid) {
        setGuests(guests);
      }

      return isValid;
    }
  };

  const handleSetTravelDate = useCallback((date: Date) => {
    setTravelDate(date);
  }, []);

  const handleSetTravelTime = useCallback((time: string) => {
    setTravelTime(time);
  }, []);

  const handleShowTimeSlots = () => {
    setShowTimeslots(true);
  };

  const handleSetProductTitle = useCallback((title: string) => {
    setProductTitle(title);
  }, []);

  const handleSetProductTags = useCallback((tags: number[]) => {
    setProductTags(tags);
  }, []);

  const handleSetPickupLocationReference = useCallback((ref: string) => {
    setPickupLocationReference(ref);
  }, []);

  const getProductQuestions = useCallback(
    (questions: string[]) => {
      const productQuestions = allBookingQuestions.filter((item) => questions.includes(item.id));
      const perTraveler = productQuestions
        .filter((q) => q.group === 'PER_TRAVELER')
        .sort((a, b) => {
          const indexA = SORTED_TRAVELER_QUESTIONS.indexOf(a.id);
          const indexB = SORTED_TRAVELER_QUESTIONS.indexOf(b.id);

          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });

      const perBooking = productQuestions
        .filter((q) => q.group === 'PER_BOOKING')
        .sort((a, b) => {
          const indexA = SORTED_BOOKING_QUESTIONS.indexOf(a.id);
          const indexB = SORTED_BOOKING_QUESTIONS.indexOf(b.id);

          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });
      setProductBookingQuestions({ perTraveler, perBooking });

      return { perTraveler, perBooking };
    },
    [allBookingQuestions],
  );

  useEffect(() => {
    const paxMix = productBookingData?.paxMix;

    if (paxMix) {
      let travelerCount = 0;

      paxMix.forEach(({ numberOfTravelers }) => {
        Array.from({ length: numberOfTravelers }).forEach(() => {
          travelerCount++;
          productBookingQuestions.perTraveler.forEach(({ id, required, type }) => {
            if (required === 'MANDATORY') {
              const dynamicKey = `${id}${travelerCount}`;
              const validator =
                type === 'DATE'
                  ? id === 'PASSPORT_EXPIRY'
                    ? VALIDATORS.dateFuture
                    : VALIDATORS.date
                  : VALIDATORS.required;
              bookingQuestionsFormHandler.setValidator(dynamicKey, validator);
            }
          });
        });
      });

      productBookingQuestions.perBooking.forEach(({ id, required }) => {
        if (required === 'MANDATORY') {
          bookingQuestionsFormHandler.setValidator(id, VALIDATORS.required);
        }
      });
    }
  }, [productBookingQuestions, productBookingData, bookingQuestionsFormHandler.setValidator]);

  useEffect(() => {
    contactDetailsFormHandler.setValidator('firstName', VALIDATORS.required);
    contactDetailsFormHandler.setValidator('lastName', VALIDATORS.required);
    contactDetailsFormHandler.setValidator('email', VALIDATORS.email);
    contactDetailsFormHandler.setValidator('phone', VALIDATORS.phone);
  }, [contactDetailsFormHandler.setValidator]);

  useEffect(() => {
    paymentFormHandler.setValidator('country', VALIDATORS.required);
    paymentFormHandler.setValidator('postalCode', VALIDATORS.zipCode);
  }, [paymentFormHandler.setValidator]);

  const getLocations = useCallback(async (locations: PickupLocation[]) => {
    const locationsRef = locations
      ?.filter(({ pickupType }) => pickupType !== 'OTHER')
      .map(({ location }) => location.ref);

    return await createRequest<LocationsBulkResponse, LocationsBulkBody>({
      endpoint: 'locationsBulk',
      body: {
        locations: locationsRef,
      },
    });
  }, []);

  const proceedBooking = async (bookingData: BookingData, recall?: boolean) => {
    setAvailabilityChanged(false);
    if (partnerRef && !recall) {
      setProductBookingData(bookingData);
      return;
    }
    setHoldLoading(true);

    const uniqueId = generateId();
    setPartnerRef(uniqueId);

    const { paxMix, productCode, productOptionCode } = bookingData;
    const paxMixWithoutPrice = paxMix.map(({ ageBand, numberOfTravelers }) => ({
      ageBand,
      numberOfTravelers,
    }));

    if (!travelDate) {
      return;
    }

    const hostUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const body: ProductHoldBody = {
      partnerCartRef: uniqueId,
      currency,
      paymentDataSubmissionMode: 'VIATOR_FORM',
      hostingUrl: hostUrl,
      items: [
        {
          partnerBookingRef: uniqueId,
          productCode,
          productOptionCode,
          startTime: travelTime,
          travelDate: travelDate.toLocaleDateString('en-CA'),
          paxMix: paxMixWithoutPrice,
        },
      ],
    };

    const data = await createRequest<ProductHoldResponse, ProductHoldBody>({
      endpoint: 'holdProduct',
      body,
      headers: getDefaultHeaders(),
    });

    if (
      data.code === RequestCodeStatus.BAD_REQUEST &&
      data.message?.includes('Unable to find availability')
    ) {
      openModal('availabilityChanged', () => setShouldOpenCalendar(true));
      setPartnerRef(null);
      setLoading(false);
      setProductBookingData(bookingData);
      setHoldLoading(false);
      setAvailabilityChanged(true);
      return;
    }

    setSessionToken(data.paymentSessionToken);
    setCartRef(data.cartRef);
    setBookingRef(data.items[0].bookingRef);
    setLastHeldCurrency(data.currency);

    const expiresAt = data?.items?.[0]?.bookingHoldInfo?.pricing?.validUntil;
    if (expiresAt) {
      setSessionExpiresAt(new Date(expiresAt).getTime());
    }

    setHoldLoading(false);
    setProductBookingData(bookingData);
  };

  const getProductBookableItems = useCallback(
    async (productCode: string) => {
      if (
        !travelDate ||
        !guests ||
        !Object.values(guests).some((numberOfTravelers) => numberOfTravelers)
      ) {
        return;
      }

      setLoading(true);

      const paxMix = Object.entries(guests).map(([ageBand, numberOfTravelers]) => ({
        ageBand: ageBand as AgeBandType,
        numberOfTravelers,
      }));

      try {
        const productTimeslotsData = await createRequest<
          ProductTimeslotsResponse,
          ProductTimeslotsBody
        >({
          endpoint: API_ROUTES.getProductTimeslots,
          body: {
            productCode,
            travelDate: formatYYYYMMDD(travelDate),
            currency,
            paxMix,
          },
          headers: getDefaultHeaders(),
        });

        setLoading(false);
        setBookableItems(productTimeslotsData.bookableItems || []);
        return productTimeslotsData.bookableItems || [];
      } catch {
        setLoading(false);
        openModal('availabilityChanged', () => setShouldOpenCalendar(true));
      }
    },
    [currency, guests, travelDate],
  );

  const handleSetCancellationInfo = useCallback((cancellationInfo: CancellationInfo) => {
    setCancellationInfo(cancellationInfo);
  }, []);

  useEffect(() => {
    setPartnerRef(null);
  }, [guests, travelDate]);

  useEffect(() => {
    (async () => {
      const data = await createRequest<ProductQuestionsResponse>({
        endpoint: 'getProductQuestions',
        method: 'GET',
      });

      setAllBookingQuestions(data.bookingQuestions);
    })();
  }, []);

  const initializePayment = useCallback(async (sessionToken: string) => {
    try {
      const paymentInstance = await loadPayment(sessionToken);

      const renderOptions = {
        cardElementContainer: 'card-frame-holder-module',
        styling: {
          variables: {
            fontSize: '0.9rem',
            colorPrimaryText: '#020F19',
          },
        },
      };

      setPayment(paymentInstance);
      paymentInstance.renderCard(renderOptions);
    } catch (error) {
      console.error('Error loading payment library:', error);
    }
  }, []);

  const generateQuestionAnswers = (values: Record<string, string>) => {
    const removeDigits = (str: string) => {
      const removedDigits = str.match(/\d/g)?.join('') || '';
      const cleanedString = str.replace(/\d/g, '');
      return [cleanedString, removedDigits];
    };

    const processedKeys = new Set<string>();

    return Object.entries(values)
      .filter(([key]) => {
        if (key === 'languageGuide') {
          return false;
        }
        if (key.includes('-unit')) {
          const baseKey = key.split('-unit')[0];
          processedKeys.add(baseKey);
        }
        return true;
      })
      .map(([key, answer]) => {
        if (key.includes('-unit')) {
          const [baseKey] = key.split('-unit');
          const [question, travelerNum] = removeDigits(baseKey);

          return {
            question,
            answer: values[`${baseKey}`] || null,
            unit: answer,
            travelerNum: Number(travelerNum),
          };
        } else if (!processedKeys.has(key)) {
          const [question, travelerNum] = removeDigits(key);
          const unitDefault =
            question === 'WEIGHT'
              ? 'kg'
              : question === 'HEIGHT'
                ? 'cm'
                : ['PICKUP_POINT'].includes(question)
                  ? 'LOCATION_REFERENCE'
                  : ['TRANSFER_DEPARTURE_PICKUP', 'TRANSFER_ARRIVAL_DROP_OFF'].includes(question)
                    ? 'FREETEXT'
                    : undefined;

          return {
            question,
            answer,
            ...(unitDefault ? { unit: unitDefault } : {}),
            travelerNum: travelerNum ? Number(travelerNum) : undefined,
          };
        }
      })
      .filter(Boolean);
  };

  const bookProduct = async (body: ProductBookBody) => {
    const data = await createRequest<ProductBookResponse, ProductBookBody>({
      endpoint: 'bookProduct',
      body,
    });

    if (data.items) {
      const isConfirmed = data.items[0].status === 'CONFIRMED';

      if (!isConfirmed && productBookingData) {
        proceedBooking(productBookingData, true);
      }

      setBookingStatus(
        isConfirmed
          ? {
              reason: data.items[0]?.rejectionReasonCode,
              status: data.items[0].status,
              currency: data.currency,
            }
          : {
              reason: data.items[0]?.rejectionReasonCode,
              status: data.items[0].status,
            },
      );
    } else {
      openModal('somethingWentWrong', () => setShouldCloseCheckout(true));
    }
    setProductBookLoading(false);
  };

  const submitSucceeded = useCallback(
    async (msg: { paymentToken: string }) => {
      const body: ProductBookBody = {
        cartRef: cartRef,
        paymentToken: msg.paymentToken,
        bookerInfo: {
          firstName: contactDetailsFormHandler.formValues.firstName,
          lastName: contactDetailsFormHandler.formValues.lastName,
        },
        communication: {
          phone: `+${getCountryCallingCode(contactDetailsFormHandler.formValues.countryCode)}${contactDetailsFormHandler.formValues.phone}`,
          email: contactDetailsFormHandler.formValues.email,
        },
        items: [
          {
            bookingRef,
            ...(bookingQuestionsFormHandler.formValues.languageGuide
              ? {
                  languageGuide: {
                    type: bookingQuestionsFormHandler.formValues.languageGuide.split(
                      '-',
                    )[1] as LanguageGuideType,
                    language: bookingQuestionsFormHandler.formValues.languageGuide.split('-')[0],
                  },
                }
              : {}),
            bookingQuestionAnswers: generateQuestionAnswers(
              bookingQuestionsFormHandler.formValues,
            ) as BookingQuestionAnswer[],
          },
        ],
      };

      bookProduct(body);
    },
    [
      bookingQuestionsFormHandler.formValues,
      bookingRef,
      cartRef,
      contactDetailsFormHandler.formValues.countryCode,
      contactDetailsFormHandler.formValues.email,
      contactDetailsFormHandler.formValues.firstName,
      contactDetailsFormHandler.formValues.lastName,
      contactDetailsFormHandler.formValues.phone,
    ],
  );

  const submitFailed = useCallback(() => {
    setProductBookLoading(false);
  }, []);

  const handleSubmitPayment = useCallback(async () => {
    paymentFormHandler.touchAllFields();

    if (!payment) return;

    const cardMetadata = {
      address: {
        country: paymentFormHandler.formValues.country,
        postalCode: paymentFormHandler.formValues.postalCode,
      },
    };

    try {
      setProductBookLoading(true);
      const resp = await payment.submitForm(cardMetadata);
      submitSucceeded(resp);
    } catch {
      submitFailed();
    }
  }, [payment, submitSucceeded, submitFailed, paymentFormHandler]);

  const handleCloseBookingConfirmation = () => {
    setBookingStatus(null);
  };

  useEffect(() => {
    if (bookingNotAvailable) {
      openModal('notBookable');
    }
  }, [bookingNotAvailable, openModal]);

  useEffect(() => {
    if (!!lastHeldCurrency && !!productBookingData && lastHeldCurrency !== currency) {
      proceedBooking(productBookingData, true);
    }
  }, [productBookingData, lastHeldCurrency, currency]);

  return (
    <BookingContext.Provider
      value={{
        guests,
        handleSetTemporaryGuests,
        handleApplyGuests,
        handleSetTravelDate,
        travelDate,
        getProductBookableItems,
        handleShowTimeSlots,
        showTimeslots,
        handleSetTravelTime,
        travelTime,
        loading,
        proceedBooking,
        productBookingData,
        holdLoading,
        handleSetCancellationInfo,
        cancellationInfo,
        sessionExpiresAt,
        setPartnerRef,
        availabilityChanged,
        getProductQuestions,
        bookingQuestionsFormHandler,
        getLocations,
        bookableItems,
        contactDetailsFormHandler,
        setShouldOpenCalendar,
        shouldOpenCalendar,
        sessionToken,
        initializePayment,
        handleSubmitPayment,
        paymentFormHandler,
        productBookLoading,
        handleSetProductTitle,
        productTitle,
        payment,
        handleSetPickupLocationReference,
        pickupLocationReference,
        setShouldCloseCheckout,
        shouldCloseCheckout,
        handleSetProductTags,
      }}
    >
      {children}
      {bookingStatus?.status && (
        <BookingConfirmationModal
          travelDate={travelDate}
          travelTime={travelTime}
          productTags={productTags}
          productTitle={productTitle}
          productBookingData={productBookingData}
          status={bookingStatus?.status}
          reason={bookingStatus?.reason}
          currency={bookingStatus?.currency}
          isOpen={!!bookingStatus?.status}
          handleClose={handleCloseBookingConfirmation}
        />
      )}
      {productBookLoading && (
        <div className="fixed top-0 z-50 w-full">
          <Loading bg={'white'} opacity="bg-opacity-50" />
        </div>
      )}
    </BookingContext.Provider>
  );
};
