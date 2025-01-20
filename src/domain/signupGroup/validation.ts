import endOfDay from 'date-fns/endOfDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import max from 'date-fns/max';
import startOfDay from 'date-fns/startOfDay';
import subYears from 'date-fns/subYears';
import * as Yup from 'yup';

import { RegistrationFieldsFragment } from '../../generated/graphql';
import { Maybe } from '../../types';
import { featureFlagUtils } from '../../utils/featureFlags';
import {
  createArrayMinErrorMessage,
  createStringMaxErrorMessage,
  getFocusableFieldId,
  isValidPhoneNumber,
  isValidZip,
  scrollToFirstError,
} from '../../utils/validationUtils';
import wait from '../../utils/wait';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH,
  SEND_MESSAGE_FIELDS,
  SEND_MESSAGE_FORM_NAME,
  SIGNUP_TEXT_FIELD_MAX_LENGTH,
} from '../signup/constants';
import {
  CONTACT_PERSON_FIELDS,
  NOTIFICATIONS,
  SIGNUP_FIELDS,
  SIGNUP_FORM_CHECKBOX_GROUP_FIELDS,
  SIGNUP_FORM_COMBOBOX_FIELDS,
  SIGNUP_FORM_SELECT_FIELDS,
  SIGNUP_GROUP_FIELDS,
} from './constants';
import { SignupFormFields } from './types';
import {
  calculateTotalPrice,
  getSignupPriceGroupOptions,
  isDateOfBirthFieldRequired,
  isSignupFieldRequired,
} from './utils';

export const isAboveMinAge = (
  date: Maybe<Date>,
  startTime: Maybe<string>,
  minAge: Maybe<number>
): boolean => {
  const now = new Date();
  const dateToCompare = startTime ? max([new Date(startTime), now]) : now;

  return minAge && date
    ? isBefore(date, subYears(endOfDay(dateToCompare), minAge))
    : true;
};

export const isBelowMaxAge = (
  date: Maybe<Date>,
  startTime: Maybe<string>,
  maxAge: Maybe<number>
): boolean => {
  const now = new Date();
  const dateToCompare = startTime ? max([new Date(startTime), now]) : now;

  return maxAge && date
    ? isAfter(date, subYears(startOfDay(dateToCompare), maxAge + 1))
    : true;
};

const getStringSchema = (
  required: boolean,
  baseSchema?: Yup.StringSchema<string | undefined>
): Yup.StringSchema<string | undefined> => {
  const schema = baseSchema ?? Yup.string();

  return required
    ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    : schema;
};

const getDateSchema = (
  required: boolean,
  baseSchema?: Yup.DateSchema<Date | null | undefined>
): Yup.DateSchema<Date | null | undefined> => {
  /* istanbul ignore next */
  const schema =
    baseSchema ?? Yup.date().nullable().typeError(VALIDATION_MESSAGE_KEYS.DATE);

  return required
    ? schema.required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    : schema;
};

export const getSignupSchema = (registration: RegistrationFieldsFragment) => {
  const { audienceMaxAge, audienceMinAge } = registration;
  const startTime = registration.event?.startTime;

  return Yup.object().shape({
    [SIGNUP_FIELDS.PRICE_GROUP]: getStringSchema(
      featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
        !!registration.registrationPriceGroups?.length
    ),
    [SIGNUP_FIELDS.FIRST_NAME]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.FIRST_NAME),
      Yup.string().max(
        SIGNUP_TEXT_FIELD_MAX_LENGTH[SIGNUP_FIELDS.FIRST_NAME],
        createStringMaxErrorMessage
      )
    ),
    [SIGNUP_FIELDS.LAST_NAME]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.LAST_NAME),
      Yup.string().max(
        SIGNUP_TEXT_FIELD_MAX_LENGTH[SIGNUP_FIELDS.LAST_NAME],
        createStringMaxErrorMessage
      )
    ),
    [SIGNUP_FIELDS.PHONE_NUMBER]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.PHONE_NUMBER),
      Yup.string()
        .test(
          'isValidPhoneNumber',
          VALIDATION_MESSAGE_KEYS.PHONE,
          (value) => !value || isValidPhoneNumber(value)
        )
        .max(
          SIGNUP_TEXT_FIELD_MAX_LENGTH[SIGNUP_FIELDS.PHONE_NUMBER],
          createStringMaxErrorMessage
        )
    ),
    [SIGNUP_FIELDS.STREET_ADDRESS]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.STREET_ADDRESS),
      Yup.string().max(
        SIGNUP_TEXT_FIELD_MAX_LENGTH[SIGNUP_FIELDS.STREET_ADDRESS],
        createStringMaxErrorMessage
      )
    ),
    [SIGNUP_FIELDS.DATE_OF_BIRTH]: getDateSchema(
      isDateOfBirthFieldRequired(registration),
      Yup.date()
        .nullable()
        .typeError(VALIDATION_MESSAGE_KEYS.DATE)
        .test(
          'isAboveMinAge',
          () => ({
            key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
            min: audienceMinAge,
          }),
          (date) => isAboveMinAge(date, startTime, audienceMinAge)
        )
        .test(
          'isBelowMaxAge',
          () => ({
            key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
            max: audienceMaxAge,
          }),
          (date) => isBelowMaxAge(date, startTime, audienceMaxAge)
        )
    ),
    [SIGNUP_FIELDS.ZIPCODE]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.ZIPCODE),
      Yup.string()
        .test(
          'isValidZip',
          VALIDATION_MESSAGE_KEYS.ZIP,
          (value) => !value || isValidZip(value)
        )
        .max(
          SIGNUP_TEXT_FIELD_MAX_LENGTH[SIGNUP_FIELDS.ZIPCODE],
          createStringMaxErrorMessage
        )
    ),
    [SIGNUP_FIELDS.CITY]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.CITY),
      Yup.string().max(
        SIGNUP_TEXT_FIELD_MAX_LENGTH[SIGNUP_FIELDS.CITY],
        createStringMaxErrorMessage
      )
    ),
    [SIGNUP_FIELDS.EXTRA_INFO]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.EXTRA_INFO)
    ),
  });
};

export const getContactPersonSchema = (
  registration: RegistrationFieldsFragment,
  signups: SignupFormFields[]
) => {
  const priceGroupOptions = getSignupPriceGroupOptions(registration, 'fi');
  const paymentRequired = calculateTotalPrice(priceGroupOptions, signups) > 0;

  return Yup.object().shape({
    [CONTACT_PERSON_FIELDS.EMAIL]: getStringSchema(true)
      .email(VALIDATION_MESSAGE_KEYS.EMAIL)
      .max(
        CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH[CONTACT_PERSON_FIELDS.EMAIL],
        createStringMaxErrorMessage
      ),
    [CONTACT_PERSON_FIELDS.PHONE_NUMBER]: getStringSchema(false)
      .test(
        'isValidPhoneNumber',
        VALIDATION_MESSAGE_KEYS.PHONE,
        (value) => !value || isValidPhoneNumber(value)
      )
      .when(
        [CONTACT_PERSON_FIELDS.NOTIFICATIONS],
        ([notifications]: string[][], schema) =>
          notifications.includes(NOTIFICATIONS.SMS)
            ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            : schema
      )
      .max(
        CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH[
          CONTACT_PERSON_FIELDS.PHONE_NUMBER
        ],
        createStringMaxErrorMessage
      ),
    [CONTACT_PERSON_FIELDS.FIRST_NAME]: getStringSchema(paymentRequired).max(
      CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH[CONTACT_PERSON_FIELDS.FIRST_NAME],
      createStringMaxErrorMessage
    ),
    [CONTACT_PERSON_FIELDS.LAST_NAME]: getStringSchema(paymentRequired).max(
      CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH[CONTACT_PERSON_FIELDS.LAST_NAME],
      createStringMaxErrorMessage
    ),
    [CONTACT_PERSON_FIELDS.NOTIFICATIONS]: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
      .min(1, createArrayMinErrorMessage),
    [CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER]: getStringSchema(false).max(
      CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH[
        CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER
      ],
      createStringMaxErrorMessage
    ),
    [CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE]: getStringSchema(false).nullable(),
    [CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE]: getStringSchema(true),
    [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: getStringSchema(false),
  });
};

export const getSignupGroupSchema = (
  registration: RegistrationFieldsFragment,
  validateContactPerson = true
) => {
  return Yup.object().shape({
    [SIGNUP_GROUP_FIELDS.SIGNUPS]: Yup.array().of(
      getSignupSchema(registration)
    ),
    ...(validateContactPerson && {
      [SIGNUP_GROUP_FIELDS.CONTACT_PERSON]: Yup.object().when(
        [SIGNUP_GROUP_FIELDS.SIGNUPS],
        ([signups]: SignupFormFields[][]) =>
          getContactPersonSchema(registration, signups)
      ),
    }),
    [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_GROUP_FIELDS.EXTRA_INFO)
    ),
  });
};

export const sendMessageSchema = Yup.object().shape({
  [SEND_MESSAGE_FORM_NAME]: Yup.object().shape({
    [SEND_MESSAGE_FIELDS.SUBJECT]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [SEND_MESSAGE_FIELDS.BODY]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
  }),
});

const getFocusableSignupGroupFieldId = (fieldName: string) => {
  return getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: SIGNUP_FORM_CHECKBOX_GROUP_FIELDS,
    comboboxFields: SIGNUP_FORM_COMBOBOX_FIELDS,
    selectFields: SIGNUP_FORM_SELECT_FIELDS,
    textEditorFields: [],
  });
};

export const scrollToFirstSignupGroupFormError = async ({
  error,
  setOpenAccordion,
}: {
  error: Yup.ValidationError;
  setOpenAccordion: (index: number) => void;
}): Promise<void> => {
  const preFocusFn = async (path: string) => {
    if (/^signups\[\d*\]\./.test(path)) {
      const signupIndex = Number(path.match(/(?<=\[)[[\d]{1,4}(?=\])/)?.[0]);
      setOpenAccordion(signupIndex);

      await wait(100);
    }
  };

  scrollToFirstError({
    error,
    getFocusableFieldId: getFocusableSignupGroupFieldId,
    preFocusFn,
  });
};
