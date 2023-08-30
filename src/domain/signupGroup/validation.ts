import endOfDay from 'date-fns/endOfDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import subYears from 'date-fns/subYears';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { RegistrationFieldsFragment } from '../../generated/graphql';
import { Maybe } from '../../types';
import getValue from '../../utils/getValue';
import {
  createArrayMinErrorMessage,
  isValidPhoneNumber,
  isValidZip,
} from '../../utils/validationUtils';
import wait from '../../utils/wait';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  SEND_MESSAGE_FIELDS,
  SEND_MESSAGE_FORM_NAME,
} from '../enrolment/constants';
import {
  NOTIFICATIONS,
  SIGNUP_FIELDS,
  SIGNUP_FORM_SELECT_FIELDS,
  SIGNUP_GROUP_FIELDS,
} from './constants';
import { isDateOfBirthFieldRequired, isSignupFieldRequired } from './utils';

export const isAboveMinAge = (
  date: Maybe<Date>,
  minAge: Maybe<number>
): boolean =>
  minAge && date
    ? isBefore(date, subYears(endOfDay(new Date()), minAge))
    : true;

export const isBelowMaxAge = (
  date: Maybe<Date>,
  maxAge: Maybe<number>
): boolean =>
  maxAge && date
    ? isAfter(date, subYears(startOfDay(new Date()), maxAge + 1))
    : true;

const getStringSchema = (required: boolean) =>
  required
    ? Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    : Yup.string();

const getDateSchema = (required: boolean) =>
  required
    ? Yup.date()
        .nullable()
        .typeError(VALIDATION_MESSAGE_KEYS.DATE)
        .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    : Yup.date().nullable().typeError(VALIDATION_MESSAGE_KEYS.DATE);

export const getSignupSchema = (registration: RegistrationFieldsFragment) => {
  const { audienceMaxAge, audienceMinAge } = registration;

  return Yup.object().shape({
    [SIGNUP_FIELDS.FIRST_NAME]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.FIRST_NAME)
    ),
    [SIGNUP_FIELDS.LAST_NAME]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.LAST_NAME)
    ),
    [SIGNUP_FIELDS.STREET_ADDRESS]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.STREET_ADDRESS)
    ),
    [SIGNUP_FIELDS.DATE_OF_BIRTH]: getDateSchema(
      isDateOfBirthFieldRequired(registration)
    )
      .test(
        'isAboveMinAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
          min: audienceMinAge,
        }),
        (date) => isAboveMinAge(date, audienceMinAge)
      )
      .test(
        'isBelowMaxAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
          max: audienceMaxAge,
        }),
        (date) => isBelowMaxAge(date, audienceMaxAge)
      ),
    [SIGNUP_FIELDS.ZIPCODE]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.ZIPCODE)
    ).test(
      'isValidZip',
      VALIDATION_MESSAGE_KEYS.ZIP,
      (value) => !value || isValidZip(value)
    ),
    [SIGNUP_FIELDS.CITY]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.CITY)
    ),
    [SIGNUP_FIELDS.EXTRA_INFO]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.EXTRA_INFO)
    ),
  });
};

export const getSignupGroupSchema = (
  registration: RegistrationFieldsFragment
) => {
  return Yup.object().shape({
    [SIGNUP_GROUP_FIELDS.SIGNUPS]: Yup.array().of(
      getSignupSchema(registration)
    ),
    [SIGNUP_GROUP_FIELDS.EMAIL]: Yup.string()
      .email(VALIDATION_MESSAGE_KEYS.EMAIL)
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    [SIGNUP_GROUP_FIELDS.PHONE_NUMBER]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_GROUP_FIELDS.PHONE_NUMBER)
    )
      .test(
        'isValidPhoneNumber',
        VALIDATION_MESSAGE_KEYS.PHONE,
        (value) => !value || isValidPhoneNumber(value)
      )
      .when(
        [SIGNUP_GROUP_FIELDS.NOTIFICATIONS],
        ([notifications]: string[][], schema) =>
          notifications.includes(NOTIFICATIONS.SMS)
            ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            : schema
      ),
    [SIGNUP_GROUP_FIELDS.NOTIFICATIONS]: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
      .min(1, createArrayMinErrorMessage),
    [SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER)
    ),
    [SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
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

const getFocusableFieldId = (
  fieldName: string
): {
  fieldId: string;
  fieldType: 'default' | 'checkboxGroup' | 'select';
} => {
  // For the select elements, focus the toggle button
  if (SIGNUP_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-toggle-button`, fieldType: 'select' };
  } else if (fieldName === SIGNUP_GROUP_FIELDS.NOTIFICATIONS) {
    return { fieldId: fieldName, fieldType: 'checkboxGroup' };
  }
  return { fieldId: fieldName, fieldType: 'default' };
};

export const scrollToFirstError = async ({
  error,
  setOpenAccordion,
}: {
  error: Yup.ValidationError;
  setOpenAccordion: (index: number) => void;
}): Promise<void> => {
  for (const e of error.inner) {
    const path = getValue(e.path, '');

    if (/^signups\[\d*\]\./.test(path)) {
      const signupIndex = Number(path.match(/(?<=\[)[[\d]{1,4}(?=\])/)?.[0]);
      setOpenAccordion(signupIndex);

      await wait(100);
    }

    const { fieldId, fieldType } = getFocusableFieldId(path);
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, {
        delay: 0,
        duration: 500,
        offset: -200,
        smooth: true,
      });

      if (fieldType === 'checkboxGroup') {
        const focusable = field.querySelectorAll('input');

        /* istanbul ignore else */
        if (focusable?.[0]) {
          focusable[0].focus();
        }
      } else {
        field.focus();
      }

      break;
    }
  }
};
