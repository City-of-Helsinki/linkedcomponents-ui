import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorArray from '../../../utils/parseServerErrorArray';
import parseServerErrorLabel from '../../../utils/parseServerErrorLabel';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';

export const parseRegistrationServerErrors = ({
  result,
  t,
}: {
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseRegistrationServerError,
    result,
    t,
  });

  function parseRegistrationUserAccessesServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    return t(
      `registration.form.registrationUserAccess.label${pascalCase(key)}`
    );
  }

  // Get error item for an single error.
  function parseRegistrationServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    if (key === 'registration_user_accesses') {
      return parseServerErrorArray({
        error,
        parseLabelFn: ({ key }) =>
          parseServerErrorLabel({
            key,
            parseFn: parseRegistrationUserAccessesServerErrorLabel,
          }),
        t,
      });
    }
    if (key === 'registration_price_groups') {
      return parseRegistrationPriceGroupServerErrors({ error });
    }

    return [
      {
        label: parseServerErrorLabel({
          key,
          parseFn: parseRegistrationServerErrorLabel,
        }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get error items for video fields
  function parseRegistrationPriceGroupServerErrors({
    error,
  }: {
    error: LEServerError;
  }): ServerErrorItem[] {
    return Array.isArray(error)
      ? Object.entries(error[0]).reduce(
          (previous: ServerErrorItem[], [key, e]) => [
            ...previous,
            {
              label: parseServerErrorLabel({
                key,
                parseFn: parseRegistrationPriceGroupServerErrorLabel,
              }),
              message: parseServerErrorMessage({ error: e as string[], t }),
            },
          ],
          []
        )
      : /* istanbul ignore next */ [];
  }

  function parseRegistrationPriceGroupServerErrorLabel({
    key,
  }: {
    key: string;
  }): string {
    return t(
      `registration.form.registrationPriceGroup.label${pascalCase(key)}`
    );
  }

  // Get correct field name for an error item
  function parseRegistrationServerErrorLabel({ key }: { key: string }): string {
    switch (key) {
      case 'enrolment_end_time':
      case 'enrolment_start_time':
        return t(`registration.form.label${pascalCase(key)}Date`);
      default:
        return t(`registration.form.label${pascalCase(key)}`);
    }
  }
};
