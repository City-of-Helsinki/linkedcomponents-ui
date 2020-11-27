import { TFunction } from 'i18next';
import {
  ArrayLocale,
  NumberLocale,
  StringLocale,
  TestMessageParams,
} from 'yup';

import { Error } from '../types';

type ArrayError = Error<ArrayLocale>;
type NumberError = Error<NumberLocale>;
type StringError = Error<StringLocale>;

export const createArrayError = (
  message: Partial<TestMessageParams>,
  key: string
): ArrayError => {
  return {
    ...message,
    key,
  };
};

export const createNumberError = (
  message: Partial<TestMessageParams>,
  key: string
): NumberError => {
  return {
    ...message,
    key,
  };
};

export const createStringError = (
  message: Partial<TestMessageParams>,
  key: string
): StringError => {
  return {
    ...message,
    key,
  };
};

/** Get string error text
 * @param {string} error
 * @param {boolean} touched
 * @param {Function} t
 * @return {string}
 */
export const getErrorText = (
  error: string | Error<StringLocale> | undefined,
  touched: boolean,
  t: TFunction
) => {
  return !!error && touched
    ? typeof error === 'string'
      ? t(error)
      : t(error.key, error)
    : '';
};
