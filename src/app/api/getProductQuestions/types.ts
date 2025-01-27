export type BookingQuestionId =
  | 'DATE_OF_BIRTH'
  | 'HEIGHT'
  | 'PASSPORT_EXPIRY'
  | 'PASSPORT_NATIONALITY'
  | 'PASSPORT_PASSPORT_NO'
  | 'PICKUP_POINT'
  | 'TRANSFER_AIR_ARRIVAL_AIRLINE'
  | 'TRANSFER_AIR_ARRIVAL_FLIGHT_NO'
  | 'TRANSFER_AIR_DEPARTURE_AIRLINE'
  | 'TRANSFER_AIR_DEPARTURE_FLIGHT_NO'
  | 'TRANSFER_ARRIVAL_DROP_OFF'
  | 'TRANSFER_ARRIVAL_TIME'
  | 'TRANSFER_DEPARTURE_DATE'
  | 'TRANSFER_DEPARTURE_PICKUP'
  | 'TRANSFER_DEPARTURE_TIME'
  | 'TRANSFER_PORT_ARRIVAL_TIME'
  | 'TRANSFER_PORT_CRUISE_SHIP'
  | 'TRANSFER_PORT_DEPARTURE_TIME'
  | 'TRANSFER_RAIL_ARRIVAL_LINE'
  | 'TRANSFER_RAIL_ARRIVAL_STATION'
  | 'TRANSFER_RAIL_DEPARTURE_LINE'
  | 'TRANSFER_RAIL_DEPARTURE_STATION'
  | 'WEIGHT'
  | 'FULL_NAMES_FIRST'
  | 'FULL_NAMES_LAST'
  | 'DISEMBARKATION_TIME'
  | 'SPECIAL_REQUIREMENTS'
  | 'AGEBAND'
  | 'TRANSFER_ARRIVAL_MODE'
  | 'TRANSFER_DEPARTURE_MODE';

type BookingQuestionType =
  | 'STRING'
  | 'NUMBER_AND_UNIT'
  | 'DATE'
  | 'TIME'
  | 'LOCATION_REF_OR_FREE_TEXT';

type BookingQuestionGroupType = 'PER_TRAVELER' | 'PER_BOOKING';

type BookingQuestionRequiredType = 'MANDATORY' | 'OPTIONAL' | 'CONDITIONAL';

export interface BookingQuestion {
  id: BookingQuestionId;
  type: BookingQuestionType;
  group: BookingQuestionGroupType;
  label: string;
  hint: string;
  units: string[];
  allowedAnswers: string[];
  required: BookingQuestionRequiredType;
  maxLength: number;
}

export interface ProductQuestionsResponse {
  bookingQuestions: BookingQuestion[];
}
