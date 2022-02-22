import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
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

  // Get error item for an single error.
  function parseRegistrationServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    return [
      {
        label: parseRegistrationServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseRegistrationServerErrorLabel({ key }: { key: string }): string {
    return t(`registration.form.label${pascalCase(key)}`);
  }
};
