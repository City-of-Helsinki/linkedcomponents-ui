/* eslint-disable @typescript-eslint/no-explicit-any */
import isBefore from 'date-fns/isBefore';
import isFuture from 'date-fns/isFuture';
import isValid from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { FormikErrors, FormikTouched } from 'formik';
import { TFunction } from 'i18next';
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
import { ALLOWED_SUBSTITUTE_USER_DOMAINS } from '../envVariables';
import { Error, Maybe } from '../types';
import formatDate from './formatDate';
import getValue from './getValue';
import setDateTime from './setDateTime';
import wait from './wait';

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
  /^\+?\(?\d{1,3}\)? ?-?\d{1,3} ?-?\d{3,5} ?-?\d{3,4}( ?-?\d{3})?/.test(phone);

export const isValidDateText = (date?: string): boolean => {
  return date
    ? isValid(parseDate(date, DATE_FORMAT, new Date())) &&
        // Make sure year has 4 digits
        date.split('.')[2].length === 4
    : true;
};

export const isValidTime = (time?: string): boolean =>
  time ? /^(([01]\d)|(2[0-3]))[:.][0-5]\d$/.test(time) : true;

export const isEmailInAllowedDomain = (email?: string): boolean => {
  return email
    ? ALLOWED_SUBSTITUTE_USER_DOMAINS.includes(email.split('@')[1])
    : true;
};

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
    string,
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
export const showFormErrors = <Values = unknown>({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<Values>) => void;
  setTouched: (
    touched: FormikTouched<Values>,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<Values>>;
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

export type ErrorFieldType =
  | 'array'
  | 'default'
  | 'checkboxGroup'
  | 'combobox'
  | 'select'
  | 'textEditor';

type FieldList = Array<string | RegExp>;

type FieldLists = {
  arrayFields: FieldList;
  checkboxGroupFields: FieldList;
  comboboxFields: FieldList;
  selectFields: FieldList;
  textEditorFields: FieldList;
};

export type ErrorFieldAndType = {
  fieldId: string;
  type: ErrorFieldType;
};

const isInFieldList = (fieldList: FieldList, fieldName: string): boolean =>
  Boolean(fieldList.find((field) => new RegExp(field).test(fieldName)));

const fieldMappings: Record<
  keyof FieldLists,
  { suffix: string; type: ErrorFieldType }
> = {
  comboboxFields: { suffix: '-input', type: 'combobox' },
  selectFields: { suffix: '-toggle-button', type: 'select' },
  textEditorFields: { suffix: '-text-editor', type: 'textEditor' },
  checkboxGroupFields: { suffix: '', type: 'checkboxGroup' },
  arrayFields: { suffix: '-error', type: 'array' },
};

export const getFocusableFieldId = (
  fieldName: string,
  fieldLists: FieldLists
): ErrorFieldAndType => {
  for (const [fieldListKey, { suffix, type }] of Object.entries(
    fieldMappings
  )) {
    if (
      isInFieldList(fieldLists[fieldListKey as keyof FieldLists], fieldName)
    ) {
      return { fieldId: `${fieldName}${suffix}`, type };
    }
  }

  return { fieldId: fieldName, type: 'default' };
};

const focusToError = async ({
  field,
  fieldType,
}: {
  field: HTMLElement;
  fieldType: ErrorFieldType;
}) => {
  if (fieldType === 'checkboxGroup') {
    const focusable = field.querySelectorAll('input');

    /* istanbul ignore else */
    if (focusable?.[0]) {
      focusable[0].focus();
    }
  } else if (fieldType === 'textEditor') {
    field.click();
  } else {
    field.focus();
  }
};

export const scrollToFirstError = async ({
  error,
  getFocusableFieldId,
  preFocusFn,
}: {
  error: Yup.ValidationError;
  getFocusableFieldId: (path: string) => ErrorFieldAndType;
  preFocusFn?: (path: string) => Promise<void>;
}): Promise<void> => {
  for (const e of error.inner) {
    const path = getValue(e.path, '');

    await preFocusFn?.(path);

    const { fieldId, type: fieldType } = getFocusableFieldId(path);

    if (fieldType === 'array') {
      await wait(100);
    }
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, VALIDATION_ERROR_SCROLLER_OPTIONS);

      await focusToError({ field, fieldType });
      break;
    }
  }
};
