import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';

export const parseEnrolmentServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseEnrolmentServerError,
    result,
    t,
  });

  // Get error item for an single error.
  function parseEnrolmentServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    switch (key) {
      case 'detail':
      case 'non_field_errors':
        return [{ label: '', message: parseServerErrorMessage({ error, t }) }];
      default:
        return [
          {
            label: parseEnrolmentServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error, t }),
          },
        ];
    }
  }

  // Get correct field name for an error item
  function parseEnrolmentServerErrorLabel({ key }: { key: string }): string {
    return t(`enrolment.form.label${pascalCase(key)}`);
  }
};
