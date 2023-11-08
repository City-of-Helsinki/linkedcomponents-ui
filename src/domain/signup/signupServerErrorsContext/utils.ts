import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import isGenericServerError from '../../../utils/isGenericServerError';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';

export const parseSignupGroupServerErrors = ({
  result,
  t,
}: {
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseSignupGroupServerError,
    result,
    t,
  });

  // Get error item for an single error.
  function parseSignupGroupServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    if (key === 'contact_person') {
      return parseContactPersonServerError(error);
    }
    if (key === 'signups') {
      return parseSignupsServerError(error);
    }

    return [
      {
        label: parseSignupServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get error items for contact person fields
  function parseContactPersonServerError(
    error: LEServerError
  ): ServerErrorItem[] {
    /* istanbul ignore else */
    if (Array.isArray(error)) {
      return Object.entries(error[0]).reduce(
        (previous: ServerErrorItem[], [key, e]) => [
          ...previous,
          {
            label: parseContactPersonServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error: e as string[], t }),
          },
        ],
        []
      );
    } else {
      return [];
    }
  }

  // Get error items for signup fields
  function parseSignupsServerError(error: LEServerError): ServerErrorItem[] {
    /* istanbul ignore else */
    if (Array.isArray(error)) {
      return Object.entries(error[0]).reduce(
        (previous: ServerErrorItem[], [key, e]) => [
          ...previous,
          {
            label: parseSignupServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error: e as string[], t }),
          },
        ],
        []
      );
    } else {
      return [];
    }
  }

  function parseContactPersonServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    if (isGenericServerError(key)) {
      return '';
    }

    return t(`signup.form.contactPerson.label${pascalCase(key)}`);
  }
  // Get correct field name for an error item
  function parseSignupServerErrorLabel({ key }: { key: string }): string {
    if (isGenericServerError(key)) {
      return '';
    }

    if (key === 'registration') {
      return t(`signup.form.label${pascalCase(key)}`);
    }

    return t(`signup.form.signup.label${pascalCase(key)}`);
  }
};

export const parseSeatsReservationServerErrors = ({
  result,
  t,
}: {
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseSeatsReservationServerError,
    result,
    t,
  });

  // Get error item for an single error.
  function parseSeatsReservationServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    return [
      {
        label: parseSeatsReservationServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseSeatsReservationServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    if (isGenericServerError(key) || key === 'seats') {
      return '';
    }

    return key;
  }
};
