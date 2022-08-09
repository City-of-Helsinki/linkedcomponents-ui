import endOfDay from 'date-fns/endOfDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import subYears from 'date-fns/subYears';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import parseDateText from '../../utils/parseDateText';
import {
  createArrayMinErrorMessage,
  isValidDate,
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
} from './constants';

export const isAboveMinAge = (
  minAge: string,
  schema: Yup.StringSchema<string | null | undefined>
): Yup.StringSchema<string | null | undefined> => {
  /* istanbul ignore else */
  if (minAge) {
    return schema.test(
      'isAboveMinAge',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
        min: parseInt(minAge),
      }),
      (dateStr) => {
        if (dateStr && isValidDate(dateStr)) {
          const date = parseDateText(dateStr) as Date;

          return isBefore(
            date,
            subYears(endOfDay(new Date()), parseInt(minAge))
          );
        }
        return true;
      }
    );
  } else {
    return schema;
  }
};

export const isBelowMaxAge = (
  maxAge: string,
  schema: Yup.StringSchema<string | null | undefined>
): Yup.StringSchema<string | null | undefined> => {
  /* istanbul ignore else */
  if (maxAge) {
    return schema.test(
      'isBelowMaxAge',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
        max: parseInt(maxAge),
      }),
      (dateStr) => {
        if (dateStr && isValidDate(dateStr)) {
          const date = parseDateText(dateStr) as Date;

          return isAfter(
            date,
            subYears(startOfDay(new Date()), parseInt(maxAge) + 1)
          );
        }
        return true;
      }
    );
  } else {
    return schema;
  }
};

export const attendeeSchema = Yup.object().shape({
  [ATTENDEE_FIELDS.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ATTENDEE_FIELDS.STREET_ADDRESS]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ATTENDEE_FIELDS.DATE_OF_BIRTH]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .test('isValidDate', VALIDATION_MESSAGE_KEYS.DATE, (value) =>
      isValidDate(value)
    )
    .when([ATTENDEE_FIELDS.AUDIENCE_MIN_AGE], isAboveMinAge)
    .when([ATTENDEE_FIELDS.AUDIENCE_MAX_AGE], isBelowMaxAge),
  [ATTENDEE_FIELDS.ZIP]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .test(
      'isValidZip',
      VALIDATION_MESSAGE_KEYS.ZIP,
      (value) => !value || isValidZip(value)
    ),
  [ATTENDEE_FIELDS.CITY]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});

export const enrolmentSchema = Yup.object().shape({
  [ENROLMENT_FIELDS.ATTENDEES]: Yup.array().of(attendeeSchema),
  [ENROLMENT_FIELDS.EMAIL]: Yup.string()
    .email(VALIDATION_MESSAGE_KEYS.EMAIL)
    .when(
      [ENROLMENT_FIELDS.NOTIFICATIONS],
      (notifications: string[], schema) => {
        return notifications.includes(NOTIFICATIONS.EMAIL)
          ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          : schema;
      }
    ),
  [ENROLMENT_FIELDS.PHONE_NUMBER]: Yup.string()
    .test(
      'isValidPhoneNumber',
      VALIDATION_MESSAGE_KEYS.PHONE,
      (value) => !value || isValidPhoneNumber(value)
    )
    .when(
      [ENROLMENT_FIELDS.NOTIFICATIONS],
      (notifications: string[], schema) => {
        return notifications.includes(NOTIFICATIONS.SMS)
          ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          : schema;
      }
    ),
  [ENROLMENT_FIELDS.NOTIFICATIONS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, createArrayMinErrorMessage),
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
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
    const path = e.path ?? /* istanbul ignore next */ '';

    if (/^attendees\[[0-9]*\]\./.test(path)) {
      const attendeeIndex = Number(path.match(/(?<=\[)[[0-9]*(?=\])/)?.[0]);
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
