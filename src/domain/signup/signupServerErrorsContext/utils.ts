import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import isGenericServerError from '../../../utils/isGenericServerError';
import parseServerErrorArray from '../../../utils/parseServerErrorArray';
import parseServerErrorLabel from '../../../utils/parseServerErrorLabel';
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
    if (
      key === 'contact_person' &&
      // API returns '{contact_person: ["Tämän kentän arvo ei voi olla "null"."]}' error when
      // trying to set null value for contact_person. Use parseContactPersonServerError only
      // when error type is object
      !(Array.isArray(error) && typeof error[0] === 'string')
    ) {
      return parseContactPersonServerError(error);
    }
    if (key === 'signups') {
      return parseServerErrorArray({
        error,
        parseLabelFn: ({ key }) =>
          parseServerErrorLabel({ key, parseFn: parseSignupServerErrorLabel }),
        t,
      });
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

    return Object.entries(error).reduce(
      (previous: ServerErrorItem[], [key, e]) => [
        ...previous,
        {
          label: parseContactPersonServerErrorLabel({ key }),
          message: parseServerErrorMessage({ error: e as string[], t }),
        },
      ],
      []
    );
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
    if (['contact_person', 'registration'].includes(key)) {
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
        label: parseServerErrorLabel({
          key,
          parseFn: parseSeatsReservationServerErrorLabel,
        }),
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
    if (key === 'seats') {
      return '';
    }

    return key;
  }
};
