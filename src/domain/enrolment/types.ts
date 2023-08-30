import {
  ENROLMENT_FIELDS,
  SEND_MESSAGE_FIELDS,
  SEND_MESSAGE_FORM_NAME,
  SIGNUP_FIELDS,
} from './constants';

export type SignupFields = {
  [SIGNUP_FIELDS.CITY]: string;
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: Date | null;
  [SIGNUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_FIELDS.FIRST_NAME]: string;
  [SIGNUP_FIELDS.IN_WAITING_LIST]: boolean;
  [SIGNUP_FIELDS.LAST_NAME]: string;
  [SIGNUP_FIELDS.STREET_ADDRESS]: string;
  [SIGNUP_FIELDS.ZIPCODE]: string;
};

export type EnrolmentFormFields = {
  [ENROLMENT_FIELDS.EMAIL]: string;
  [ENROLMENT_FIELDS.EXTRA_INFO]: string;
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: string;
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: string;
  [ENROLMENT_FIELDS.NOTIFICATIONS]: string[];
  [ENROLMENT_FIELDS.PHONE_NUMBER]: string;
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: string;
  [ENROLMENT_FIELDS.SIGNUPS]: SignupFields[];
};

export type EnrolmentReservation = {
  expires: number;
  participants: number;
  started: number;
  session: string;
};

export type SendMessageFormFields = {
  [SEND_MESSAGE_FORM_NAME]: {
    [SEND_MESSAGE_FIELDS.BODY]: string;
    [SEND_MESSAGE_FIELDS.SUBJECT]: string;
  };
};
