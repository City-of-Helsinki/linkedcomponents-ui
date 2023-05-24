/* eslint-disable @typescript-eslint/no-explicit-any */
import isBefore from 'date-fns/isBefore';
import isFuture from 'date-fns/isFuture';
import isValid from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { FormikErrors, FormikTouched } from 'formik';
import { TFunction } from 'i18next';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  VALIDATION_ERROR_SCROLLER_OPTIONS,
} from '../constants';
import { VALIDATION_MESSAGE_KEYS } from '../domain/app/i18n/constants';
import { Error, Maybe } from '../types';
import formatDate from './formatDate';
import getValue from './getValue';
import setDateTime from './setDateTime';

const createMaxErrorMessage = (
  message: { max: number },
  key: string
): Record<string, unknown> => ({ ...message, key });

export const createNumberMaxErrorMessage = (message: {
  max: number;
}): Record<string, unknown> =>
  createMaxErrorMessage(message, VALIDATION_MESSAGE_KEYS.NUMBER_MAX);

export const createStringMaxErrorMessage = (message: {
  max: number;
}): Record<string, unknown> =>
  createMaxErrorMessage(message, VALIDATION_MESSAGE_KEYS.STRING_MAX);

const createMinErrorMessage = (
  message: { min: number },
  key: string
): Record<string, unknown> => ({
  ...message,
  key,
});

export const createArrayMinErrorMessage = (message: {
  min: number;
}): Record<string, unknown> =>
  createMinErrorMessage(message, VALIDATION_MESSAGE_KEYS.ARRAY_MIN);

export const createNumberMinErrorMessage = (message: {
  min: number;
}): Record<string, unknown> =>
  createMinErrorMessage(message, VALIDATION_MESSAGE_KEYS.NUMBER_MIN);

export const createStringMinErrorMessage = (message: {
  min: number;
}): Record<string, unknown> =>
  createMinErrorMessage(message, VALIDATION_MESSAGE_KEYS.STRING_MIN);

export const createMultiLanguageValidation = (
  languages: string[],
  rule: Yup.StringSchema<Maybe<string>>
) => {
  return Yup.object().shape(
    reduce(languages, (acc, lang) => ({ ...acc, [lang]: rule }), {})
  );
};
export const transformNumber = (
  value: number,
  originalValue: string
): number | null => (String(originalValue).trim() === '' ? null : value);

export const isValidPhoneNumber = (phone: string): boolean =>
  /^\+?\(?\d{1,3}\)? ?-?\d{1,3} ?-?\d{3,5} ?-?\d{4}( ?-?\d{3})?/.test(phone);

export const isValidEmail = (email: string): boolean =>
  /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/i.test(email);

export const isValidDateText = (date?: string): boolean => {
  return date
    ? isValid(parseDate(date, DATE_FORMAT, new Date())) &&
        // Make sure year has 4 digits
        date.split('.')[2].length === 4
    : true;
};

export const isValidTime = (time?: string): boolean =>
  time ? /^(([01]\d)|(2[0-3]))[:.][0-5]\d$/.test(time) : true;

export const isValidUrl = (url?: string): boolean => {
  if (!url) return true;

  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

export const isValidZip = (zip: string): boolean => /^\d{5}$/.test(zip);

export const isAfterStartDateAndTime = (
  values: any[],
  schema: Yup.DateSchema<Maybe<Date>>
): Yup.DateSchema<Maybe<Date>> => {
  const [startDate, startTimeStr, endTimeStr] = values as [
    Date | null,
    string,
    string
  ];

  /* istanbul ignore else */
  if (
    startDate &&
    startTimeStr &&
    isValidTime(startTimeStr) &&
    endTimeStr &&
    isValidTime(endTimeStr)
  ) {
    const startDateWithTime = setDateTime(startDate, startTimeStr);

    return schema.test(
      'isAfterStartDateAndTime',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
        after: formatDate(startDateWithTime, DATETIME_FORMAT),
      }),
      (endDate) => {
        /* istanbul ignore else */
        if (endDate) {
          const endDateWithTime = setDateTime(endDate, endTimeStr);

          return !isBefore(endDateWithTime, startDateWithTime);
        } else {
          return true;
        }
      }
    );
  } else {
    return schema;
  }
};

export const isFutureDateAndTime = (
  [timeStr]: string[],
  schema: Yup.DateSchema<Maybe<Date>>
): Yup.DateSchema<Maybe<Date>> => {
  /* istanbul ignore else */
  if (timeStr && isValidTime(timeStr)) {
    return schema.test(
      'isInTheFuture',
      VALIDATION_MESSAGE_KEYS.DATE_FUTURE,
      (date) => {
        /* istanbul ignore else */
        if (date) {
          const dateWithTime = setDateTime(date, timeStr);

          return isFuture(dateWithTime);
        } else {
          return true;
        }
      }
    );
  } else {
    return schema;
  }
};

export const isAfterDate = (
  [startDate]: Array<Date | null>,
  schema: Yup.DateSchema<Maybe<Date>>
): Yup.DateSchema<Maybe<Date>> => {
  if (startDate && isValid(startDate)) {
    return schema.test(
      'isAfterDate',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
        after: formatDate(startDate, DATE_FORMAT),
      }),
      (endDate) => {
        /* istanbul ignore else */
        if (endDate && isValid(endDate)) {
          return isBefore(startDate, endDate);
        } else {
          return true;
        }
      }
    );
  }
  return schema;
};

export const isAfterTime = (
  [startsAt]: string[],
  schema: Yup.StringSchema
): Yup.StringSchema => {
  if (isValidTime(startsAt)) {
    return schema.test(
      'isAfterTime',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.TIME_AFTER,
        after: startsAt.replace(':', '.'),
      }),
      (endsAt) => {
        /* istanbul ignore else */
        if (endsAt && isValidTime(endsAt)) {
          const modifiedStartsAt = startsAt.replace(':', '.');
          const modifiedEndsAt = endsAt.replace(':', '.');

          return isBefore(
            parseDate(modifiedStartsAt, TIME_FORMAT, new Date()),
            parseDate(modifiedEndsAt, TIME_FORMAT, new Date())
          );
        } else {
          return true;
        }
      }
    );
  }
  return schema;
};

/** Get string error text
 * @param {string} error
 * @param {boolean} touched
 * @param {Function} t
 * @return {string}
 */
export const getErrorText = (
  error: string | Error<Record<string, unknown>> | undefined,
  touched: boolean,
  t: TFunction
): string => {
  if (!!error && touched) {
    return typeof error === 'string' ? t(error) : t(error.key, error);
  }

  return '';
};

// This functions sets formik errors and touched values correctly after validation.
// The reason for this is to show all errors after validating the form.
// Errors are shown only for touched fields so set all fields with error touched
export const showFormErrors = ({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<unknown>) => void;
  setTouched: (
    touched: FormikTouched<unknown>,
    shouldValidate?: boolean
  ) => void;
}): void => {
  /* istanbul ignore else */
  if (error.name === 'ValidationError') {
    const newErrors = error.inner.reduce(
      (acc, e: Yup.ValidationError) =>
        set(acc, getValue(e.path, ''), e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc, e: Yup.ValidationError) => set(acc, getValue(e.path, ''), true),
      {}
    );

    setErrors(newErrors);
    setTouched(touchedFields);
  }
};

export const scrollToFirstError = ({
  error,
  getFocusableFieldId,
}: {
  error: Yup.ValidationError;
  getFocusableFieldId?: (path: string) => string;
}): void => {
  forEach(error.inner, (e) => {
    const path = getValue(e.path, '');
    const fieldId = getFocusableFieldId ? getFocusableFieldId(path) : path;
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, VALIDATION_ERROR_SCROLLER_OPTIONS);
      field.focus();

      return false;
    }
  });
};
