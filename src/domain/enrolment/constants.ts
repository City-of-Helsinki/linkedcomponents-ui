import { EnrolmentFormFields } from './types';

export enum ENROLMENT_FIELDS {
  CITY = 'city',
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NAME = 'name',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATION_LANGUAGE = 'notificationLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
  STREET_ADDRESS = 'streetAddress',
  YEAR_OF_BIRTH = 'yearOfBirth',
  ZIP = 'zip',
}

export const ENROLMENT_INITIAL_VALUES: EnrolmentFormFields = {
  [ENROLMENT_FIELDS.CITY]: '',
  [ENROLMENT_FIELDS.EMAIL]: '',
  [ENROLMENT_FIELDS.EXTRA_INFO]: '',
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: '',
  [ENROLMENT_FIELDS.NAME]: '',
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: '',
  [ENROLMENT_FIELDS.NOTIFICATION_LANGUAGE]: '',
  [ENROLMENT_FIELDS.NOTIFICATIONS]: [],
  [ENROLMENT_FIELDS.PHONE_NUMBER]: '',
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: '',
  [ENROLMENT_FIELDS.STREET_ADDRESS]: '',
  [ENROLMENT_FIELDS.YEAR_OF_BIRTH]: '',
  [ENROLMENT_FIELDS.ZIP]: '',
};

export enum NOTIFICATIONS {
  EMAIL = 'email',
  PHONE = 'phone',
}

export const ENROLMENT_FORM_SELECT_FIELDS = [
  ENROLMENT_FIELDS.NATIVE_LANGUAGE,
  ENROLMENT_FIELDS.NOTIFICATION_LANGUAGE,
  ENROLMENT_FIELDS.SERVICE_LANGUAGE,
  ENROLMENT_FIELDS.YEAR_OF_BIRTH,
];

export const TEST_ENROLMENT_ID = 'enrolment:0';