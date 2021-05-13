import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { TFunction } from 'i18next';
import * as Yup from 'yup';

import { DATE_FORMAT, DATETIME_FORMAT } from '../constants';
import { VALIDATION_MESSAGE_KEYS } from '../domain/app/i18n/constants';
import { Error } from '../types';
import formatDate from './formatDate';

export const createMaxErrorMessage = (
  message: { max: number },
  key: string
): Record<string, unknown> => {
  return {
    ...message,
    key,
  };
};

export const createMinErrorMessage = (
  message: { min: number },
  key: string
): Record<string, unknown> => {
  return {
    ...message,
    key,
  };
};

export const transformNumber = (
  value: number,
  originalValue: string
): number | null => (String(originalValue).trim() === '' ? null : value);

export const isValidTime = (time: string): boolean =>
  /^(([01][0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/.test(time);

export const isAfterStartDate = (
  startDate: Date | null,
  schema: Yup.DateSchema<Date | null | undefined>
): Yup.DateSchema<Date | null | undefined> => {
  if (startDate && isValid(startDate)) {
    return schema.test(
      'isAfterStartDate',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
        after: formatDate(startDate, DATE_FORMAT),
      }),
      (endDate) => {
        return endDate ? isBefore(startDate, endDate) : true;
      }
    );
  }
  return schema;
};

export const isMinStartDate = (
  startDate: Date | null,
  schema: Yup.DateSchema<Date | null | undefined>
): Yup.DateSchema<Date | null | undefined> => {
  if (startDate && isValid(startDate)) {
    return schema.test(
      'isMinStartDate',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_MIN,
        min: formatDate(startDate, DATETIME_FORMAT),
      }),
      (endTime) => {
        return endTime ? isBefore(startDate, endTime) : true;
      }
    );
  }
  return schema;
};

export const isAfterStartTime = (
  startsAt: string,
  schema: Yup.StringSchema
): Yup.StringSchema => {
  if (isValidTime(startsAt)) {
    return schema.test(
      'isAfterStartTime',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.TIME_AFTER,
        after: startsAt,
      }),
      (endsAt) => {
        if (endsAt && isValidTime(endsAt)) {
          const modifiedStartsAt = startsAt.replace(':', '.');
          const modifiedEndsAt = endsAt.replace(':', '.');

          return isBefore(
            parseDate(modifiedStartsAt, 'HH.mm', new Date()),
            parseDate(modifiedEndsAt, 'HH.mm', new Date())
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
