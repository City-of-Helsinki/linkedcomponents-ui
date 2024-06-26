import { OptionType } from '../../types';
import {
  CONTACT_PERSON_FIELDS,
  SIGNUP_FIELDS,
  SIGNUP_GROUP_FIELDS,
} from './constants';

export type ContactPersonFormFields = {
  [CONTACT_PERSON_FIELDS.EMAIL]: string;
  [CONTACT_PERSON_FIELDS.FIRST_NAME]: string;
  [CONTACT_PERSON_FIELDS.ID]: string | null;
  [CONTACT_PERSON_FIELDS.LAST_NAME]: string;
  [CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER]: string;
  [CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE]: string;
  [CONTACT_PERSON_FIELDS.NOTIFICATIONS]: string[];
  [CONTACT_PERSON_FIELDS.PHONE_NUMBER]: string;
  [CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE]: string;
};

export type SignupFormFields = {
  [SIGNUP_FIELDS.CITY]: string;
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: Date | null;
  [SIGNUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_FIELDS.FIRST_NAME]: string;
  [SIGNUP_FIELDS.ID]: string | null;
  [SIGNUP_FIELDS.IN_WAITING_LIST]: boolean;
  [SIGNUP_FIELDS.LAST_NAME]: string;
  [SIGNUP_FIELDS.PHONE_NUMBER]: string;
  [SIGNUP_FIELDS.PRICE_GROUP]: string;
  [SIGNUP_FIELDS.STREET_ADDRESS]: string;
  [SIGNUP_FIELDS.ZIPCODE]: string;
};

export type SignupGroupFormFields = {
  [SIGNUP_GROUP_FIELDS.CONTACT_PERSON]: ContactPersonFormFields;
  [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_GROUP_FIELDS.SIGNUPS]: SignupFormFields[];
};

export type SignupPriceGroupOption = OptionType & { price: number };
