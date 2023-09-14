import { SIGNUP_FIELDS, SIGNUP_GROUP_FIELDS } from './constants';

export type SignupFormFields = {
  [SIGNUP_FIELDS.CITY]: string;
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: Date | null;
  [SIGNUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_FIELDS.FIRST_NAME]: string;
  [SIGNUP_FIELDS.ID]: string | null;
  [SIGNUP_FIELDS.IN_WAITING_LIST]: boolean;
  [SIGNUP_FIELDS.LAST_NAME]: string;
  [SIGNUP_FIELDS.RESPONSIBLE_FOR_GROUP]: boolean;
  [SIGNUP_FIELDS.STREET_ADDRESS]: string;
  [SIGNUP_FIELDS.ZIPCODE]: string;
};

export type SignupGroupFormFields = {
  [SIGNUP_GROUP_FIELDS.EMAIL]: string;
  [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER]: string;
  [SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE]: string;
  [SIGNUP_GROUP_FIELDS.NOTIFICATIONS]: string[];
  [SIGNUP_GROUP_FIELDS.PHONE_NUMBER]: string;
  [SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE]: string;
  [SIGNUP_GROUP_FIELDS.SIGNUPS]: SignupFormFields[];
};