import { REGISTRATION_FIELDS } from './constants';

export type RegistrationFormFields = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: number | '';
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: string;
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: string;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: string;
  [REGISTRATION_FIELDS.EVENT]: string;
  [REGISTRATION_FIELDS.INSTRUCTIONS]: string;
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: number | '';
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: number | '';
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: number | '';
};

export type RegistrationFields = {
  id: string;
  atId: string;
  createdBy: string;
  currentAttendeeCount: number;
  currentWaitingListCount: number;
  enrolmentEndTime: Date | null;
  enrolmentStartTime: Date | null;
  event: string;
  lastModifiedAt: Date | null;
  maximumAttendeeCapacity: number;
  registrationUrl: string;
  waitingListCapacity: number;
};
