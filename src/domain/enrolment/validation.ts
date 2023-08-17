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
  ATTENDEE_FIELDS,
  ENROLMENT_FIELDS,
  ENROLMENT_FORM_SELECT_FIELDS,
  NOTIFICATIONS,
  SEND_MESSAGE_FIELDS,
  SEND_MESSAGE_FORM_NAME,
} from './constants';
import { isDateOfBirthFieldRequired, isEnrolmentFieldRequired } from './utils';

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

export const getAttendeeSchema = (registration: RegistrationFieldsFragment) => {
  const { audienceMaxAge, audienceMinAge } = registration;

  return Yup.object().shape({
    [ATTENDEE_FIELDS.FIRST_NAME]: getStringSchema(
      isEnrolmentFieldRequired(registration, ATTENDEE_FIELDS.FIRST_NAME)
    ),
    [ATTENDEE_FIELDS.LAST_NAME]: getStringSchema(
      isEnrolmentFieldRequired(registration, ATTENDEE_FIELDS.LAST_NAME)
    ),
    [ATTENDEE_FIELDS.STREET_ADDRESS]: getStringSchema(
      isEnrolmentFieldRequired(registration, ATTENDEE_FIELDS.STREET_ADDRESS)
    ),
    [ATTENDEE_FIELDS.DATE_OF_BIRTH]: getDateSchema(
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
    [ATTENDEE_FIELDS.ZIPCODE]: getStringSchema(
      isEnrolmentFieldRequired(registration, ATTENDEE_FIELDS.ZIPCODE)
    ).test(
      'isValidZip',
      VALIDATION_MESSAGE_KEYS.ZIP,
      (value) => !value || isValidZip(value)
    ),
    [ATTENDEE_FIELDS.CITY]: getStringSchema(
      isEnrolmentFieldRequired(registration, ATTENDEE_FIELDS.CITY)
    ),
    [ATTENDEE_FIELDS.EXTRA_INFO]: getStringSchema(
      isEnrolmentFieldRequired(registration, ATTENDEE_FIELDS.EXTRA_INFO)
    ),
  });
};

export const getEnrolmentSchema = (
  registration: RegistrationFieldsFragment
) => {
  return Yup.object().shape({
    [ENROLMENT_FIELDS.ATTENDEES]: Yup.array().of(
      getAttendeeSchema(registration)
    ),
    [ENROLMENT_FIELDS.EMAIL]: Yup.string()
      .email(VALIDATION_MESSAGE_KEYS.EMAIL)
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    [ENROLMENT_FIELDS.PHONE_NUMBER]: getStringSchema(
      isEnrolmentFieldRequired(registration, ENROLMENT_FIELDS.PHONE_NUMBER)
    )
      .test(
        'isValidPhoneNumber',
        VALIDATION_MESSAGE_KEYS.PHONE,
        (value) => !value || isValidPhoneNumber(value)
      )
      .when(
        [ENROLMENT_FIELDS.NOTIFICATIONS],
        ([notifications]: string[][], schema) =>
          notifications.includes(NOTIFICATIONS.SMS)
            ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            : schema
      ),
    [ENROLMENT_FIELDS.NOTIFICATIONS]: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
      .min(1, createArrayMinErrorMessage),
    [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: getStringSchema(
      isEnrolmentFieldRequired(registration, ENROLMENT_FIELDS.MEMBERSHIP_NUMBER)
    ),
    [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [ENROLMENT_FIELDS.EXTRA_INFO]: getStringSchema(
      isEnrolmentFieldRequired(registration, ENROLMENT_FIELDS.EXTRA_INFO)
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
  if (ENROLMENT_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-toggle-button`, fieldType: 'select' };
  } else if (fieldName === ENROLMENT_FIELDS.NOTIFICATIONS) {
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

    if (/^attendees\[\d*\]\./.test(path)) {
      const attendeeIndex = Number(path.match(/(?<=\[)[[\d]{1,4}(?=\])/)?.[0]);
      setOpenAccordion(attendeeIndex);

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
