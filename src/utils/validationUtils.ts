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
import { Error } from '../types';
import formatDate from './formatDate';
import parseDateText from './parseDateText';
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
  rule: Yup.StringSchema<string | null | undefined>
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
  /^\+?\(?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/.test(
    phone
  );

export const isValidDate = (date?: string): boolean => {
  return date
    ? isValid(parseDate(date, DATE_FORMAT, new Date())) &&
        // Make sure year has 4 digits
        date.split('.')[2].length === 4
    : true;
};

export const isValidTime = (time?: string): boolean =>
  time ? /^(([01][0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/.test(time) : true;

export const isValidZip = (zip: string): boolean => /^[0-9]{5}$/.test(zip);

export const isAfterStartDateAndTime = (
  startDateStr: string,
  startTimeStr: string,
  endTimeStr: string,
  schema: Yup.StringSchema<string | null | undefined>
): Yup.StringSchema<string | null | undefined> => {
  /* istanbul ignore else */
  if (
    startDateStr &&
    isValidDate(startDateStr) &&
    startTimeStr &&
    isValidTime(startTimeStr) &&
    endTimeStr &&
    isValidTime(endTimeStr)
  ) {
    const startDate = parseDateText(startDateStr, startTimeStr) as Date;

    return schema.test(
      'isAfterStartDateAndTime',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
        after: formatDate(startDate, DATETIME_FORMAT),
      }),
      (endDateStr) => {
        // istanbul ignore else
        if (endDateStr && isValidDate(endDateStr)) {
          const endDate = parseDateText(endDateStr, endTimeStr) as Date;

          return !isBefore(endDate, startDate);
        }
        return true;
      }
    );
  } else {
    return schema;
  }
};

export const isAfterStartDateAndTime2 = (
  startDate: Date | null,
  startTimeStr: string,
  endTimeStr: string,
  schema: Yup.DateSchema<Date | null | undefined>
): Yup.DateSchema<Date | null | undefined> => {
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
        // istanbul ignore else

        if (endDate) {
          const endDateWithTime = setDateTime(endDate, endTimeStr);

          return !isBefore(endDateWithTime, startDateWithTime);
        }
        return true;
      }
    );
  } else {
    return schema;
  }
};

export const isFutureDate = (date?: string): boolean => {
  if (date && isValidDate(date)) {
    return isFuture(parseDateText(date) as Date);
  } else {
    return true;
  }
};

export const isAfterDate = (
  startDateStr: string,
  schema: Yup.StringSchema<string | null | undefined>
): Yup.StringSchema<string | null | undefined> => {
  if (startDateStr && isValidDate(startDateStr)) {
    const startDate = parseDateText(startDateStr) as Date;

    return schema.test(
      'isAfterDate',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
        after: formatDate(startDate, DATE_FORMAT),
      }),
      (endDateStr) => {
        // istanbul ignore else
        if (endDateStr && isValidDate(endDateStr)) {
          const endDate = parseDateText(endDateStr) as Date;

          return isBefore(startDate, endDate);
        }
        return true;
      }
    );
  }
  return schema;
};

export const isAfterTime = (
  startsAt: string,
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
        // istanbul ignore else
        if (endsAt && isValidTime(endsAt)) {
          const modifiedStartsAt = startsAt.replace(':', '.');
          const modifiedEndsAt = endsAt.replace(':', '.');

          return isBefore(
            parseDate(modifiedStartsAt, TIME_FORMAT, new Date()),
            parseDate(modifiedEndsAt, TIME_FORMAT, new Date())
          );
        }
        return true;
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
  return !!error && touched
    ? typeof error === 'string'
      ? t(error)
      : t(error.key, error)
    : '';
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
        set(acc, e.path ?? /* istanbul ignore next */ '', e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc, e: Yup.ValidationError) =>
        set(acc, e.path ?? /* istanbul ignore next */ '', true),
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
    const path = e.path as string;
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
