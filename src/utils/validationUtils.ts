import { TFunction } from 'i18next';
import { TestMessageParams } from 'yup';

import { StringError } from '../types';

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
export const getStringErrorText = (
  error: string | StringError | undefined,
  touched: boolean,
  t: TFunction
) => {
  return !!error && touched
    ? typeof error === 'string'
      ? t(error)
      : t(error.key, error)
    : '';
};
