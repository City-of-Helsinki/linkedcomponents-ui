import { REGISTRATION_FIELDS } from './constants';

export type RegistrationFormFields = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: number | '';
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: string;
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME]: Date | null;
  [REGISTRATION_FIELDS.INSTRUCTIONS]: string;
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: number | '';
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: number | '';
  [REGISTRATION_FIELDS.WAITING_ATTENDEE_CAPACITY]: number | '';
};