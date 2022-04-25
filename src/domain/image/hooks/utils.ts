import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';

export const parseImageServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseImageServerError,
    result,
    t,
  });

  // Get error item for an single error.
  function parseImageServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    return [
      {
        label: parseImageServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseImageServerErrorLabel({ key }: { key: string }): string {
    return t(`image.form.label${pascalCase(key)}`);
  }
};
