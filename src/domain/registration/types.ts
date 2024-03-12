import { MultiLanguageObject } from '../../types';
import { EventFields } from '../event/types';
import { PriceGroupOption } from '../priceGroup/types';
import {
  REGISTRATION_FIELDS,
  REGISTRATION_PRICE_GROUP_FIELDS,
  REGISTRATION_USER_ACCESS_FIELDS,
} from './constants';

export type RegistrationPriceGroupFormFields = {
  [REGISTRATION_PRICE_GROUP_FIELDS.ID]: number | null;
  [REGISTRATION_PRICE_GROUP_FIELDS.PRICE]: string;
  [REGISTRATION_PRICE_GROUP_FIELDS.PRICE_GROUP]: string;
  [REGISTRATION_PRICE_GROUP_FIELDS.VAT_PERCENTAGE]: string;
};

export type RegistrationUserAccessFormFields = {
  [REGISTRATION_USER_ACCESS_FIELDS.EMAIL]: string;
  [REGISTRATION_USER_ACCESS_FIELDS.ID]: number | null;
  [REGISTRATION_USER_ACCESS_FIELDS.IS_SUBSTITUTE_USER]: boolean;
  [REGISTRATION_USER_ACCESS_FIELDS.LANGUAGE]: string;
};

export type RegistrationFormFields = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: number | '';
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: MultiLanguageObject;
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: string;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: string;
  [REGISTRATION_FIELDS.EVENT]: string;
  [REGISTRATION_FIELDS.HAS_PRICE]: boolean;
  [REGISTRATION_FIELDS.INFO_LANGUAGES]: string[];
  [REGISTRATION_FIELDS.INSTRUCTIONS]: MultiLanguageObject;
  [REGISTRATION_FIELDS.MANDATORY_FIELDS]: string[];
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: number | '';
  [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: number | '';
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: number | '';
  [REGISTRATION_FIELDS.PRICE_GROUP_OPTIONS]: PriceGroupOption[];
  [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS]: RegistrationPriceGroupFormFields[];
  [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: RegistrationUserAccessFormFields[];
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: number | '';
};
export type CommonRegistrationAndEventFields = Pick<
  RegistrationFormFields,
  | REGISTRATION_FIELDS.AUDIENCE_MAX_AGE
  | REGISTRATION_FIELDS.AUDIENCE_MIN_AGE
  | REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE
  | REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME
  | REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE
  | REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME
  | REGISTRATION_FIELDS.HAS_PRICE
  | REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY
  | REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY
  | REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS
>;

export type RegistrationFields = {
  id: string;
  atId: string;
  createdBy: string;
  currentAttendeeCount: number;
  currentWaitingListCount: number;
  enrolmentEndTime: Date | null;
  enrolmentStartTime: Date | null;
  event: EventFields | null;
  lastModifiedTime: Date | null;
  mandatoryFields: string[];
  maximumAttendeeCapacity: number | null;
  publisher: string | null;
  registrationUrl: string;
  waitingListCapacity: number | null;
};
