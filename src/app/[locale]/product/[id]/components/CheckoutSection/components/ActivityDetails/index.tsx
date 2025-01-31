import React, { FC, useCallback, useEffect, useState } from 'react';
import { OrderInfo } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/OrderInfo';
import { styles } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/ActivityDetails/styles';
import { FullScreenPanel } from '@/app/_components/FullScreenPanel';
import { TourOperatorInformation } from '@/app/_components/TourOperatorInformation';
import { useBooking } from '@/app/_contexts/bookingContext';
import { BookingQuestion as BookingQuestionInterface } from '@/app/api/getProductQuestions/types';
import { CustomInput } from '@/app/_components/CustomInput';
import { SelectInput } from '@/app/_components/SelectInput';
import { StartEndPoint, TravelerPickup } from '@/app/api/getSingleProduct/[productCode]/types';
import { RadioSelect } from '@/app/_components/RadioSelect';
import { VALIDATORS } from '@/app/_hooks/useForm';
import { LocationsBulkBody, LocationsBulkResponse } from '@/app/api/locationsBulk/types';
import Link from 'next/link';
import { MapPinIcon } from '@/app/_icons/MapPinIcon';
import Skeleton from '@/app/_components/Skeleton';
import { EarthIcon } from '@/app/_icons/EarthIcon';
import { useTranslations } from 'next-intl';
import { CancellationStatus } from '@/app/[locale]/product/[id]/components/CheckoutSection/components/CheckoutSection';
import { getLocationProviderReferenceLink } from '@/app/[locale]/product/[id]/utils';
import { LocationBulkResponse } from '@/app/_interfaces/product-response.interface';
import { MappedLanguageGuides } from '@/app/[locale]/product/[id]/service';
import { useRequest } from '@/app/_hooks/useRequest';
import { fetchGooglePlaceDetails } from '@/app/_services/fetchGooglePlace';

const QUESTION_PLACEHOLDERS_OVERRIDES = [
  'TRANSFER_AIR_DEPARTURE_AIRLINE',
  'TRANSFER_DEPARTURE_PICKUP',
  'TRANSFER_RAIL_DEPARTURE_LINE',
  'TRANSFER_RAIL_DEPARTURE_STATION',
  'TRANSFER_PORT_CRUISE_SHIP',
  'SPECIAL_REQUIREMENTS',
  'FULL_NAMES_FIRST1',
  'FULL_NAMES_LAST1',
];

const DEPARTURE_MODE_QUESTIONS: Record<DepartureType, string[]> = {
  AIR: [
    'TRANSFER_AIR_DEPARTURE_AIRLINE',
    'TRANSFER_AIR_DEPARTURE_FLIGHT_NO',
    'TRANSFER_DEPARTURE_DATE',
    'TRANSFER_DEPARTURE_TIME',
    'TRANSFER_DEPARTURE_PICKUP',
  ],
  RAIL: [
    'TRANSFER_RAIL_DEPARTURE_LINE',
    'TRANSFER_RAIL_DEPARTURE_STATION',
    'TRANSFER_DEPARTURE_DATE',
    'TRANSFER_DEPARTURE_TIME',
    'TRANSFER_DEPARTURE_PICKUP',
  ],
  SEA: [
    'TRANSFER_PORT_CRUISE_SHIP',
    'TRANSFER_DEPARTURE_DATE',
    'TRANSFER_PORT_DEPARTURE_TIME',
    'TRANSFER_DEPARTURE_PICKUP',
  ],
  OTHER: [],
};

const ARRIVAL_MODE_QUESTIONS: Record<DepartureType, string[]> = {
  AIR: [
    'TRANSFER_AIR_ARRIVAL_AIRLINE',
    'TRANSFER_AIR_ARRIVAL_FLIGHT_NO',
    'TRANSFER_ARRIVAL_TIME',
    'TRANSFER_ARRIVAL_DROP_OFF',
  ],
  RAIL: [
    'TRANSFER_RAIL_ARRIVAL_LINE',
    'TRANSFER_RAIL_ARRIVAL_STATION',
    'TRANSFER_ARRIVAL_TIME',
    'TRANSFER_ARRIVAL_DROP_OFF',
  ],
  SEA: ['TRANSFER_PORT_ARRIVAL_TIME', 'TRANSFER_PORT_CRUISE_SHIP', 'TRANSFER_ARRIVAL_DROP_OFF'],
  OTHER: [],
};

interface ActivityDetailsProps {
  email: string;
  title?: string;
  bookingQuestionsIds: string[];
  travelerPickup?: TravelerPickup;
  languageGuides?: MappedLanguageGuides;
  startPoint?: StartEndPoint[];
  cancellationStatus: CancellationStatus;
}

interface StartPointLocation {
  title: string;
  subtitle?: string;
  link?: string;
  ref: string;
}

type DepartureType = 'AIR' | 'RAIL' | 'SEA' | 'OTHER';
type ModeQuestions = Record<DepartureType, string[]>;

export const ActivityDetails: FC<ActivityDetailsProps> = ({
  title,
  bookingQuestionsIds,
  travelerPickup,
  languageGuides,
  startPoint,
  cancellationStatus,
  email,
}) => {
  const t = useTranslations();
  const createRequest = useRequest();

  const [travelerQuestions, setTravelerQuestions] = useState<BookingQuestionInterface[]>([]);
  const [bookingQuestions, setBookingQuestions] = useState<BookingQuestionInterface[]>([]);
  const [departureQuestions, setDepartureQuestions] = useState<BookingQuestionInterface[]>([]);
  const [arrivalQuestions, setArrivalQuestions] = useState<BookingQuestionInterface[]>([]);
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [arrivalMode, setArrivalMode] = useState<DepartureType | ''>('');
  const [departureMode, setDepartureMode] = useState<DepartureType | ''>('');
  const [startPointLocation, setStartPointLocation] = useState<StartPointLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [inferredArrivalMode, setInferredArrivalMode] = useState<DepartureType | ''>('');
  const [inferredDepartureMode, setInferredDepartureMode] = useState<DepartureType | ''>('');
  const [pickupIncluded, setPickupIncluded] = useState<boolean>(false);
  let travelerCount = 0;

  const {
    getProductQuestions,
    productBookingData,
    bookingQuestionsFormHandler,
    getLocations,
    pickupLocationReference,
  } = useBooking();
  const { updateField, formState, isFieldValid, setValidator, removeField } =
    bookingQuestionsFormHandler;

  const getTransferMode = (pickupType: string) => {
    return pickupType === 'AIRPORT'
      ? 'AIR'
      : pickupType === 'PORT'
        ? 'SEA'
        : pickupType === 'RAIL'
          ? 'RAIL'
          : 'OTHER';
  };

  useEffect(() => {
    (async () => {
      if (!travelerPickup?.locations) {
        return;
      }
      const locations =
        travelerPickup.locations.length > 500
          ? travelerPickup.locations.slice(0, 500)
          : travelerPickup.locations;

      try {
        setLocationsLoading(true);
        const data = await getLocations(locations);

        const formattedData = await Promise.all(
          data.locations.map(async (item) => {
            if (item.provider === 'GOOGLE') {
              const googleData = await fetchGooglePlaceDetails(item.providerReference);

              return {
                label: (
                  <div className="text-text">
                    <p className="truncate">{googleData?.displayName.text || ''}</p>
                    <Link
                      className={styles.meetPointLink}
                      target="_blank"
                      href={getLocationProviderReferenceLink(item as LocationBulkResponse)}
                    >
                      {googleData?.formattedAddress}
                    </Link>
                  </div>
                ),
                value: item.reference,
                transferMode: getTransferMode(
                  locations.find((location) => location.location.ref === item.reference)
                    ?.pickupType || 'OTHER',
                ),
              };
            }

            return {
              label: (
                <div className="text-text">
                  <p className="truncate">{item.name}</p>
                  <p className="truncate text-textSecondary">{item?.address?.street}</p>
                </div>
              ),
              value: item.reference,
              transferMode: getTransferMode(
                locations.find((location) => location.location.ref === item.reference)
                  ?.pickupType || 'OTHER',
              ),
            };
          }),
        );

        setPickupLocations(formattedData);
      } catch (e) {
        console.error(e);
      } finally {
        setLocationsLoading(false);
      }
    })();
  }, [getLocations, travelerPickup?.locations]);

  const onPickupPointSelect = useCallback((value: string, option: any) => {
    updateField('PICKUP_POINT', value);
    setArrivalMode(option.transferMode);
  }, []);

  const isMeetAtDeparturePoint =
    travelerPickup?.locations
      ?.map((item) => item.location.ref)
      .includes('MEET_AT_DEPARTURE_POINT') ||
    !productBookingData?.description?.includes('Pickup included');

  const isMeetAtStartPoint = travelerPickup?.pickupOptionType === 'MEET_EVERYONE_AT_START_POINT';

  const getArrivalRadioSelected = () => {
    if (formState['PICKUP_POINT_FREE_TEXT']?.value) {
      return 1;
    }

    if (
      formState['TRANSFER_ARRIVAL_MODE']?.value === 'OTHER' &&
      formState['PICKUP_POINT']?.value === 'OTHER'
    ) {
      return travelerPickup?.allowCustomTravelerPickup ? 2 : 1;
    }

    if (
      formState['TRANSFER_ARRIVAL_MODE']?.value === 'OTHER' &&
      formState['PICKUP_POINT']?.value === 'MEET_AT_DEPARTURE_POINT' &&
      !pickupIncluded
    ) {
      return travelerPickup?.allowCustomTravelerPickup ? 2 : 1;
    }

    if (
      (formState['TRANSFER_ARRIVAL_MODE']?.value === 'OTHER' &&
        !travelerPickup?.allowCustomTravelerPickup &&
        formState['PICKUP_POINT']?.value &&
        formState['PICKUP_POINT']?.value !== 'OTHER') ||
      (formState['TRANSFER_ARRIVAL_MODE']?.value === 'OTHER' &&
        formState['PICKUP_POINT']?.value === 'OTHER' &&
        !travelerPickup?.allowCustomTravelerPickup)
    ) {
      return 1;
    } else {
      return 0;
    }
  };

  const getPlaceholderOverride = (key: string) => {
    return QUESTION_PLACEHOLDERS_OVERRIDES.includes(key)
      ? t(`checkout.questionPlaceholders.${key}`)
      : '';
  };

  const getDepartureRadioSelected = () => {
    return formState['TRANSFER_DEPARTURE_MODE']?.value === 'OTHER' ? 1 : 0;
  };

  const getInputType = (type: string) => {
    return type === 'DATE' ? 'date' : type === 'TIME' ? 'time' : 'text';
  };

  const determineMode = (questions: BookingQuestionInterface[], keys: string[]) => {
    const questionWithModeKey = questions.find((item) =>
      keys.some((key) => item.id.includes(key)),
    )?.id;

    if (questionWithModeKey?.includes('RAIL')) return 'RAIL';
    if (questionWithModeKey?.includes('AIR')) return 'AIR';
    if (questionWithModeKey?.includes('PORT')) return 'SEA';
    return null;
  };

  const handleUpdateInferredMode = useCallback(
    (
      questions: BookingQuestionInterface[],
      bookingQuestions: BookingQuestionInterface[],
      modeKey: string,
      setMode: (mode: DepartureType) => void,
      setInferredMode: (mode: DepartureType) => void,
      keys: string[],
    ) => {
      if (!questions.length) {
        return;
      }

      const withoutMode = bookingQuestions.every((item) => item.id !== modeKey);

      if (withoutMode) {
        const mode = determineMode(questions, keys);
        if (mode) {
          setMode(mode);
          setInferredMode(mode);
        }
      }
    },
    [],
  );

  const updateFormValues = (questions: ModeQuestions, mode: DepartureType) => {
    Object.values(questions)
      .flat(1)
      .filter((item) => {
        if (item === 'TRANSFER_PORT_CRUISE_SHIP' && arrivalMode === 'SEA') {
          return false;
        }

        return !questions[mode].includes(item);
      })
      .forEach((item) => removeField(item));

    questions[mode].forEach((mode) => {
      const validator = mode.includes('DATE') ? VALIDATORS.dateFuture : VALIDATORS.required;
      setValidator(mode, validator);
    });
  };

  useEffect(() => {
    if (pickupLocationReference && pickupLocations.length) {
      const selectedLocation = pickupLocations.find(
        (location) => location.value === pickupLocationReference,
      );

      onPickupPointSelect(selectedLocation.value, selectedLocation);
    }
  }, [onPickupPointSelect, pickupLocationReference, pickupLocations]);

  const onDepartureModeSelect = (mode: DepartureType) => {
    setDepartureMode(mode);
  };

  useEffect(() => {
    if (travelerPickup?.pickupOptionType) {
      const includesPickupInDesc = !!productBookingData?.description?.includes('Pickup included');

      setPickupIncluded(includesPickupInDesc);
    }
  }, [travelerPickup?.pickupOptionType, productBookingData?.description]);

  useEffect(() => {
    if (
      bookingQuestionsIds.includes('FULL_NAMES_FIRST') &&
      bookingQuestionsIds.includes('FULL_NAMES_LAST')
    ) {
      const data = JSON.parse(window.sessionStorage.getItem('userInfo') || '');
      const hasUserName = data?.firstName?.value && data?.lastName?.value;
      const formUserName =
        formState['FULL_NAMES_FIRST1']?.value && formState['FULL_NAMES_LAST1']?.value;

      if (hasUserName && !formUserName) {
        updateField('FULL_NAMES_FIRST1', data.firstName.value);
        updateField('FULL_NAMES_LAST1', data.lastName.value);
      }
    }
  }, [bookingQuestionsIds]);

  useEffect(() => {
    const { perBooking, perTraveler } = getProductQuestions(bookingQuestionsIds);

    setTravelerQuestions(perTraveler);
    setBookingQuestions(perBooking);

    const hasOneDepartureQuestion = perBooking.some((item) => item.id.includes('DEPARTURE'));

    setDepartureQuestions(
      perBooking.filter(
        (item) =>
          item.id.includes('DEPARTURE') ||
          (item.id.includes('TRANSFER_PORT_CRUISE_SHIP') && hasOneDepartureQuestion),
      ),
    );
    setArrivalQuestions(
      perBooking.filter((item) =>
        Object.entries(ARRIVAL_MODE_QUESTIONS)
          .map((item) => item[1])
          .flat(1)
          .includes(item.id),
      ),
    );
  }, [bookingQuestionsIds, getProductQuestions]);

  useEffect(() => {
    const arrivalModeValue = !pickupIncluded
      ? 'OTHER'
      : formState['TRANSFER_ARRIVAL_MODE']?.value || '';
    const departureModeValue = !pickupIncluded
      ? 'OTHER'
      : formState['TRANSFER_DEPARTURE_MODE']?.value || '';

    if (!arrivalMode && travelerPickup?.pickupOptionType !== 'PICKUP_AND_MEET_AT_START_POINT') {
      setArrivalMode(arrivalModeValue as DepartureType);
    }
    if (!departureMode && travelerPickup?.pickupOptionType !== 'PICKUP_AND_MEET_AT_START_POINT') {
      setDepartureMode(departureModeValue as DepartureType);
    }
  }, [formState, departureMode, arrivalMode, pickupIncluded]);

  useEffect(() => {
    if (arrivalMode) {
      updateFormValues(ARRIVAL_MODE_QUESTIONS, arrivalMode);
      updateField('TRANSFER_ARRIVAL_MODE', arrivalMode);
    }
  }, [arrivalMode, pickupIncluded]);

  useEffect(() => {
    if (departureMode) {
      updateFormValues(DEPARTURE_MODE_QUESTIONS, departureMode);
      updateField('TRANSFER_DEPARTURE_MODE', departureMode);
    }
  }, [departureMode, pickupIncluded]);

  useEffect(() => {
    if (
      bookingQuestions.find((item) => item.id === 'PICKUP_POINT') ||
      inferredArrivalMode ||
      (isMeetAtDeparturePoint && !isMeetAtStartPoint)
    ) {
      setValidator('PICKUP_POINT', VALIDATORS.required);
    }
  }, [bookingQuestions, isMeetAtDeparturePoint]);

  useEffect(() => {
    handleUpdateInferredMode(
      arrivalQuestions,
      bookingQuestions,
      'TRANSFER_ARRIVAL_MODE',
      setArrivalMode,
      setInferredArrivalMode,
      ['RAIL', 'AIR', 'PORT'],
    );
  }, [arrivalQuestions, bookingQuestions, handleUpdateInferredMode]);

  useEffect(() => {
    handleUpdateInferredMode(
      departureQuestions,
      bookingQuestions,
      'TRANSFER_DEPARTURE_MODE',
      setDepartureMode,
      setInferredDepartureMode,
      ['RAIL', 'AIR', 'PORT'],
    );
  }, [departureQuestions, bookingQuestions, handleUpdateInferredMode]);

  useEffect(() => {
    if (travelerQuestions.find(({ id }) => id === 'AGEBAND')) {
      let travelerIndex = 1;

      productBookingData?.paxMix.forEach((traveler) => {
        const { ageBand, numberOfTravelers } = traveler;

        for (let i = 0; i < numberOfTravelers; i++) {
          updateField(`AGEBAND${travelerIndex}`, ageBand);
          travelerIndex++;
        }
      });
    }
  }, [travelerQuestions]);

  useEffect(() => {
    const fetchLocations = async () => {
      const startPointsRefs = startPoint?.map((item) => item.location.ref);

      if (!startPointsRefs) return;

      const data = await createRequest<LocationsBulkResponse, LocationsBulkBody>({
        endpoint: 'locationsBulk',
        body: {
          locations: startPointsRefs,
        },
      });

      const locations = await Promise.all(
        data.locations.map(async (location) => {
          if (location.provider === 'GOOGLE') {
            const googleData = await fetchGooglePlaceDetails(location.providerReference);

            return {
              title: googleData?.displayName?.text || '',
              subtitle: googleData?.formattedAddress || '',
              link: getLocationProviderReferenceLink(location as LocationBulkResponse),
              ref: location.reference,
            };
          }

          return {
            title: location.name,
            subtitle: `${location.address?.street}, ${location.address?.country}`,
            link: '',
            ref: location.reference,
          };
        }),
      );

      setStartPointLocation(locations);
    };

    fetchLocations();
  }, [startPoint]);

  useEffect(() => {
    if (languageGuides && !!Object.values(languageGuides).length) {
      bookingQuestionsFormHandler.setValidator('languageGuide', VALIDATORS.required);
    }
  }, [languageGuides]);

  return (
    <div className={styles.root}>
      <OrderInfo productTitle={title} email={email} cancellationStatus={cancellationStatus} />
      <FullScreenPanel
        trigger={
          <div className={styles.operatorDetails}>
            {t.rich('checkout.aboutOperator', {
              b: (chunks) => <b className={styles.textBold}>{chunks}</b>,
            })}
          </div>
        }
      >
        <TourOperatorInformation />
      </FullScreenPanel>
      <div className={styles.bookingQuestions}>
        {travelerQuestions.length
          ? productBookingData?.paxMix.flatMap(({ ageBand, numberOfTravelers }) =>
              Array.from({ length: numberOfTravelers }, () => {
                travelerCount++;
                return (
                  <div key={`${ageBand}-${travelerCount}`}>
                    <div className={styles.questionTitle}>
                      {t('common.person')} {travelerCount} (
                      {t(`common.passengerType.${ageBand.toLowerCase()}`, { count: 1 })})
                    </div>
                    <div className={styles.travelerSection}>
                      {travelerQuestions.map(({ label, id, required, type, units }) => {
                        const isRequired = required === 'MANDATORY';
                        const fieldKey = `${id}${travelerCount}`;

                        if (id === 'AGEBAND') {
                          return;
                        }

                        if (type === 'NUMBER_AND_UNIT') {
                          const options = units.map((unit) => ({ value: unit, label: unit }));

                          return (
                            <div key={fieldKey} className={'flex gap-xs'}>
                              <CustomInput
                                full
                                type="number"
                                key={fieldKey}
                                required={isRequired}
                                invalid={!isFieldValid(fieldKey) && formState[fieldKey].touched}
                                onChange={(value) => updateField(fieldKey, value)}
                                placeholder={t(
                                  `checkout.traveler${label.includes('height') ? 'Height' : 'Weight'}`,
                                )}
                                value={formState[fieldKey]?.value}
                                name={id}
                              />
                              <SelectInput
                                defaultValue={
                                  formState[`${fieldKey}-unit`]?.value || options[0]?.value
                                }
                                required={isRequired}
                                invalid={!isFieldValid(id) && formState[id].touched}
                                options={options}
                                onSelect={(value) => {
                                  updateField(`${fieldKey}-unit`, value);
                                }}
                              />
                            </div>
                          );
                        }

                        return (
                          <CustomInput
                            type={getInputType(type)}
                            key={fieldKey}
                            required={isRequired}
                            invalid={!isFieldValid(fieldKey) && formState[fieldKey].touched}
                            onChange={(value) => updateField(fieldKey, value)}
                            placeholder={getPlaceholderOverride(fieldKey) || label}
                            value={formState[fieldKey]?.value}
                            name={id}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              }),
            )
          : undefined}
        {(travelerPickup?.pickupOptionType === 'MEET_EVERYONE_AT_START_POINT' || !pickupIncluded) &&
        !inferredArrivalMode ? (
          startPointLocation.length === 1 ? (
            <div>
              <div className={styles.questionTitle}>
                {isMeetAtDeparturePoint
                  ? t('productPage.meetingAndPickup')
                  : t('checkout.pickupPoint')}
              </div>
              <div className={styles.meetingPoint}>
                <MapPinIcon color="#020F19" className={styles.mapPinIcon} />
                {startPointLocation?.[0].link ? (
                  <div>
                    <div>{startPointLocation?.[0].title}</div>
                    <Link
                      className={styles.meetPointLink}
                      target="_blank"
                      href={startPointLocation?.[0].link}
                    >
                      {startPointLocation?.[0].subtitle}
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div>{startPointLocation?.[0].title}</div>
                    <div className={styles.meetPointSubtitle}>
                      {startPointLocation?.[0].subtitle}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.questionTitle}>
                {isMeetAtDeparturePoint
                  ? t('productPage.meetingAndPickup')
                  : t('checkout.pickupPoint')}
              </div>
              <RadioSelect
                values={[
                  {
                    title: 'Select a meeting point',
                    onClick: () => {
                      if (formState['PICKUP_POINT']?.value === 'OTHER') {
                        updateField('PICKUP_POINT', undefined);
                      }
                    },
                    items: (
                      <SelectInput
                        defaultValue={formState['PICKUP_POINT']?.value}
                        options={startPointLocation.map((item) => ({
                          label: item.title,
                          value: item.ref,
                          link: item.link,
                        }))}
                        placeholder={formState['PICKUP_POINT']?.value}
                        required={true}
                        invalid={!isFieldValid('PICKUP_POINT') && formState['PICKUP_POINT'].touched}
                        onSelect={(value) => {
                          updateField('PICKUP_POINT', value);
                        }}
                      />
                    ),
                  },
                  ...(travelerPickup?.locations
                    ?.map((item) => item.location.ref)
                    .includes('CONTACT_SUPPLIER_LATER') || isMeetAtDeparturePoint
                    ? [
                        {
                          title: t('checkout.decideLater'),
                          items: undefined,
                          onClick: () => {
                            setArrivalMode('OTHER');
                            updateField('PICKUP_POINT', 'OTHER');
                          },
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          )
        ) : undefined}
        {bookingQuestions.map((item) => {
          if (item.id === 'PICKUP_POINT' && pickupIncluded) {
            return (
              <div key={item.id}>
                <div className={styles.questionTitle}>
                  {isMeetAtDeparturePoint
                    ? t('productPage.meetingAndPickup')
                    : t('checkout.pickupPoint')}
                </div>
                {isMeetAtDeparturePoint && (
                  <div className={styles.questionDesc}>{t('checkout.ownWay')}</div>
                )}
                <RadioSelect
                  selected={getArrivalRadioSelected()}
                  values={[
                    {
                      title: t('checkout.toBePickedUp'),
                      onClick: () => {
                        if (formState[item.id]?.value === 'OTHER') {
                          if (pickupLocations.length === 1) {
                            updateField('PICKUP_POINT', pickupLocations[0].value);
                            updateField('PICKUP_POINT_FREE_TEXT', undefined);
                            setArrivalMode(pickupLocations[0].transferMode);
                          } else {
                            updateField(item.id, undefined);
                          }
                        }
                      },
                      items: (
                        <>
                          {locationsLoading ? (
                            <Skeleton height={40} mb={0} />
                          ) : (
                            <SelectInput
                              invalid={!formState[item.id]?.value && formState[item.id]?.touched}
                              defaultValue={
                                pickupLocations.length === 1
                                  ? pickupLocations[0].value
                                  : formState[item.id]?.value
                              }
                              options={pickupLocations}
                              onSelect={onPickupPointSelect}
                            />
                          )}
                          {arrivalMode &&
                            arrivalQuestions
                              .filter((item) =>
                                ARRIVAL_MODE_QUESTIONS[arrivalMode as DepartureType].includes(
                                  item.id,
                                ),
                              )
                              .map(({ id, label, type }) => (
                                <CustomInput
                                  type={getInputType(type)}
                                  key={id}
                                  placeholder={getPlaceholderOverride(id) || label}
                                  value={formState[id]?.value}
                                  onChange={(value) => updateField(id, value)}
                                  required={true}
                                  invalid={!isFieldValid(id) && formState[id].touched}
                                />
                              ))}
                        </>
                      ),
                    },
                    ...(travelerPickup?.allowCustomTravelerPickup
                      ? [
                          {
                            title: t('checkout.dontSeeLocation'),
                            onClick: () => {
                              setArrivalMode('OTHER');
                              updateField('PICKUP_POINT', undefined);
                              updateField('PICKUP_POINT_FREE_TEXT', 'true');
                            },
                            items: (
                              <CustomInput
                                required
                                invalid={!formState[item.id]?.value && formState[item.id]?.touched}
                                value={formState['PICKUP_POINT']?.value}
                                onChange={(value) => updateField('PICKUP_POINT', value)}
                                placeholder={t('inputs.yourPickupLocation')}
                              />
                            ),
                          },
                        ]
                      : []),
                    ...(isMeetAtDeparturePoint
                      ? [
                          {
                            title: t('checkout.makeOwnWay'),
                            onClick: () => {
                              setArrivalMode('OTHER');
                              updateField(item.id, 'MEET_AT_DEPARTURE_POINT');
                              updateField('PICKUP_POINT_FREE_TEXT', undefined);
                            },
                            items:
                              startPointLocation.length === 1 ? (
                                <div className={styles.meetingPoint}>
                                  <MapPinIcon color="#020F19" />
                                  {startPointLocation?.[0].link ? (
                                    <div>
                                      <div>{startPointLocation?.[0].title}</div>
                                      <Link
                                        className={styles.meetPointLink}
                                        target="_blank"
                                        href={startPointLocation?.[0].link}
                                      >
                                        {startPointLocation?.[0].subtitle}
                                      </Link>
                                    </div>
                                  ) : (
                                    <div>
                                      <div>{startPointLocation?.[0].title}</div>
                                      <div className={styles.meetPointSubtitle}>
                                        {startPointLocation?.[0].subtitle}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <SelectInput
                                  defaultValue={formState['PICKUP_POINT']?.value || ''}
                                  options={startPointLocation.map((item) => ({
                                    label: item.title,
                                    value: item.ref,
                                  }))}
                                  placeholder={item.label}
                                  required={true}
                                  onSelect={(value) => {
                                    updateField(item.id, value);
                                  }}
                                />
                              ),
                          },
                        ]
                      : []),
                    ...(travelerPickup?.locations
                      ?.map((item) => item.location.ref)
                      .includes('CONTACT_SUPPLIER_LATER')
                      ? [
                          {
                            title: t('checkout.decideLater'),
                            items: undefined,
                            onClick: () => {
                              setArrivalMode('OTHER');
                              updateField(item.id, 'OTHER');
                              updateField('PICKUP_POINT_FREE_TEXT', undefined);
                            },
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            );
          }

          if (item.id === 'TRANSFER_DEPARTURE_MODE' && pickupIncluded) {
            const allowedTransferDepartureModes = departureQuestions
              .filter((q) => q.id.startsWith('TRANSFER_'))
              .map((q) => q.id.split('_')[1])
              .map((item) => (item === 'PORT' ? 'SEA' : item));

            const allowedAnswers = item.allowedAnswers.filter((item) =>
              allowedTransferDepartureModes.includes(item),
            );

            const inputOptions = allowedAnswers.map((item) => ({
              value: item,
              label: t(`checkout.departureArrivals.${item}`),
            }));

            return (
              <div key={item.id}>
                <div className={styles.questionTitle}>{t('checkout.departureDetails')}</div>
                <div className={styles.questionDesc}>{t('checkout.provideDepartureDetails')}</div>
                <RadioSelect
                  selected={getDepartureRadioSelected()}
                  values={[
                    {
                      onClick: () => {
                        if (formState[item.id]?.value === 'OTHER') {
                          if (inputOptions.length === 1) {
                            onDepartureModeSelect(inputOptions[0].value as DepartureType);
                          } else {
                            updateField(item.id, undefined);
                          }
                        }
                      },
                      title: t('checkout.myDepartureInfo'),
                      items: (
                        <>
                          {departureMode && inputOptions.length === 1 ? undefined : (
                            <SelectInput
                              invalid={!formState[item.id]?.value && formState[item.id]?.touched}
                              defaultValue={formState[item.id]?.value || ''}
                              options={inputOptions}
                              onSelect={(value) => onDepartureModeSelect(value)}
                            />
                          )}
                          {departureMode &&
                            departureQuestions
                              .filter((item) =>
                                DEPARTURE_MODE_QUESTIONS[departureMode as DepartureType].includes(
                                  item.id,
                                ),
                              )
                              .map(({ id, label, type }) => (
                                <CustomInput
                                  helperText={{
                                    mode: 'default',
                                    text:
                                      id === 'TRANSFER_DEPARTURE_PICKUP'
                                        ? t('checkout.toBePickedUpFrom')
                                        : '',
                                  }}
                                  type={getInputType(type)}
                                  key={id}
                                  invalid={!isFieldValid(id) && formState[id].touched}
                                  placeholder={getPlaceholderOverride(id) || label}
                                  value={formState[id]?.value}
                                  onChange={(value) => updateField(id, value)}
                                  required={true}
                                />
                              ))}
                        </>
                      ),
                    },
                    {
                      title: t('checkout.doesntApplyToMe'),
                      items: undefined,
                      onClick: () => {
                        setDepartureMode('OTHER');
                      },
                    },
                  ]}
                />
              </div>
            );
          }

          if (item.id === 'SPECIAL_REQUIREMENTS') {
            return undefined;
          }
        })}
        {inferredArrivalMode && (
          <div>
            <div className={styles.questionTitle}>{t('productPage.meetingPoint')}</div>
            <RadioSelect
              selected={getArrivalRadioSelected()}
              values={[
                {
                  title: t('checkout.toBePickedUp'),
                  onClick: () => {
                    if (formState['PICKUP_POINT']?.value === 'OTHER') {
                      updateField('PICKUP_POINT', undefined);
                    }
                    setArrivalMode(inferredArrivalMode);
                  },
                  items: (
                    <>
                      <SelectInput
                        defaultValue={formState['PICKUP_POINT']?.value}
                        options={startPointLocation.map((item) => ({
                          label: item.title,
                          value: item.ref,
                          link: item.link,
                        }))}
                        required={true}
                        invalid={!isFieldValid('PICKUP_POINT') && formState['PICKUP_POINT'].touched}
                        onSelect={(value) => {
                          updateField('PICKUP_POINT', value);
                        }}
                      />
                      {arrivalQuestions
                        .filter((item) =>
                          ARRIVAL_MODE_QUESTIONS[arrivalMode as DepartureType].includes(item.id),
                        )
                        .map(({ id, label, type }) => (
                          <CustomInput
                            helperText={{
                              mode: 'default',
                              text:
                                id === 'TRANSFER_DEPARTURE_PICKUP'
                                  ? t('checkout.toBePickedUpFrom')
                                  : '',
                            }}
                            type={getInputType(type)}
                            key={id}
                            invalid={!isFieldValid(id) && formState[id].touched}
                            placeholder={getPlaceholderOverride(id) || label}
                            value={formState[id]?.value}
                            onChange={(value) => updateField(id, value)}
                            required={true}
                          />
                        ))}
                    </>
                  ),
                },
              ]}
            />
          </div>
        )}
        {inferredDepartureMode && (
          <div>
            <div className={styles.questionTitle}>{t('checkout.departureDetails')}</div>
            <RadioSelect
              selected={getDepartureRadioSelected()}
              values={[
                {
                  title: t('checkout.myDepartureInfo'),
                  onClick: () => {
                    setDepartureMode(inferredDepartureMode);
                  },
                  items: (
                    <>
                      {departureQuestions
                        .filter((item) =>
                          DEPARTURE_MODE_QUESTIONS[departureMode as DepartureType].includes(
                            item.id,
                          ),
                        )
                        .map(({ id, label, type }) => (
                          <CustomInput
                            helperText={{
                              mode: 'default',
                              text:
                                id === 'TRANSFER_DEPARTURE_PICKUP'
                                  ? t('checkout.toBePickedUpFrom')
                                  : '',
                            }}
                            type={getInputType(type)}
                            key={id}
                            invalid={!isFieldValid(id) && formState[id].touched}
                            placeholder={getPlaceholderOverride(id) || label}
                            value={formState[id]?.value}
                            onChange={(value) => updateField(id, value)}
                            required={true}
                          />
                        ))}
                    </>
                  ),
                },
              ]}
            />
          </div>
        )}
        {productBookingData?.productOptionCode &&
          languageGuides?.[productBookingData?.productOptionCode] && (
            <div>
              <div className={styles.questionTitle}>{t('checkout.tourLanguage')}</div>
              <SelectInput
                renderValue={(value) => (
                  <div className={styles.languageGuideWrapper}>
                    <EarthIcon className={styles.mapPinIcon} /> {value.label}
                  </div>
                )}
                position={'above'}
                required={true}
                invalid={!isFieldValid('languageGuide') && formState['languageGuide']?.touched}
                options={languageGuides[productBookingData?.productOptionCode].map((item) => ({
                  value: `${item.language}-${item.type}`,
                  label: `${t(`common.languageGuides.${item.language}`)} - ${t(`common.languageGuides.${item.type}`)}`,
                }))}
                defaultValue={formState['languageGuide']?.value || ''}
                placeholder={t('checkout.selectTourLanguage')}
                onSelect={(value) => updateField('languageGuide', value)}
              />
            </div>
          )}
        {bookingQuestions.find(({ id }) => id === 'SPECIAL_REQUIREMENTS') ? (
          <div>
            <div className={styles.questionTitle}>{t('checkout.specialRequirements')}</div>
            <CustomInput
              placeholder={getPlaceholderOverride('SPECIAL_REQUIREMENTS')}
              value={formState['SPECIAL_REQUIREMENTS']?.value || ''}
              onChange={(value) => updateField('SPECIAL_REQUIREMENTS', value)}
            />
          </div>
        ) : undefined}
      </div>
    </div>
  );
};
