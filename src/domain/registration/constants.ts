import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import {
  CommonRegistrationAndEventFields,
  RegistrationFormFields,
} from './types';

export enum REGISTRATION_MANDATORY_FIELDS {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  CITY = 'city',
  PHONE_NUMBER = 'phone_number',
  STREET_ADDRESS = 'street_address',
  ZIPCODE = 'zipcode',
}

export enum REGISTRATION_FIELDS {
  AUDIENCE_MAX_AGE = 'audienceMaxAge',
  AUDIENCE_MIN_AGE = 'audienceMinAge',
  CONFIRMATION_MESSAGE = 'confirmationMessage',
  ENROLMENT_END_TIME_DATE = 'enrolmentEndTimeDate',
  ENROLMENT_END_TIME_TIME = 'enrolmentEndTimeTime',
  ENROLMENT_START_TIME_DATE = 'enrolmentStartTimeDate',
  ENROLMENT_START_TIME_TIME = 'enrolmentStartTimeTime',
  EVENT = 'event',
  INFO_LANGUAGES = 'infoLanguages',
  INSTRUCTIONS = 'instructions',
  MANDATORY_FIELDS = 'mandatoryFields',
  MAXIMUM_ATTENDEE_CAPACITY = 'maximumAttendeeCapacity',
  MAXIMUM_GROUP_SIZE = 'maximumGroupSize',
  MINIMUM_ATTENDEE_CAPACITY = 'minimumAttendeeCapacity',
  REGISTRATION_USER_ACCESSES = 'registrationUserAccesses',
  WAITING_LIST_CAPACITY = 'waitingListCapacity',
}

export enum REGISTRATION_USER_ACCESS_FIELDS {
  EMAIL = 'email',
  ID = 'id',
  LANGUAGE = 'language',
}

export const REGISTRATION_INITIAL_VALUES: RegistrationFormFields = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: '',
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: '',
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: {
    ...EMPTY_MULTI_LANGUAGE_OBJECT,
  },
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: null,
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: '',
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: null,
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: '',
  [REGISTRATION_FIELDS.EVENT]: '',
  [REGISTRATION_FIELDS.INFO_LANGUAGES]: ['fi'],
  [REGISTRATION_FIELDS.INSTRUCTIONS]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [REGISTRATION_FIELDS.MANDATORY_FIELDS]: [
    REGISTRATION_MANDATORY_FIELDS.FIRST_NAME,
    REGISTRATION_MANDATORY_FIELDS.LAST_NAME,
  ],
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
  [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: '',
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
  [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: [],
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: '',
};

export const DEFAULT_COMMON_REGISTRATION_AND_EVENT_FIELD_VALUES: CommonRegistrationAndEventFields =
  {
    audienceMaxAge: REGISTRATION_INITIAL_VALUES.audienceMaxAge,
    audienceMinAge: REGISTRATION_INITIAL_VALUES.audienceMinAge,
    enrolmentEndTimeDate: REGISTRATION_INITIAL_VALUES.enrolmentEndTimeDate,
    enrolmentEndTimeTime: REGISTRATION_INITIAL_VALUES.enrolmentEndTimeTime,
    enrolmentStartTimeDate: REGISTRATION_INITIAL_VALUES.enrolmentStartTimeDate,
    enrolmentStartTimeTime: REGISTRATION_INITIAL_VALUES.enrolmentStartTimeTime,
    maximumAttendeeCapacity:
      REGISTRATION_INITIAL_VALUES.maximumAttendeeCapacity,
    minimumAttendeeCapacity:
      REGISTRATION_INITIAL_VALUES.minimumAttendeeCapacity,
  };

export const REGISTRATION_SELECT_FIELDS = [REGISTRATION_FIELDS.EVENT];

export const REGISTRATION_INCLUDES = ['event', 'keywords', 'location'];

export const TEST_REGISTRATION_ID = 'registration:0';
export const TEST_REGISTRATION_USER_ID = 1;

export enum REGISTRATION_MODALS {
  DELETE = 'delete',
}
