import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import isGenericServerError from '../../../utils/isGenericServerError';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import { parseServerErrors } from '../../../utils/parseServerErrors';
import pascalCase from '../../../utils/pascalCase';

export const parseKeywordSetServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  return parseServerErrors({
    parseServerError: parseKeywordSetServerError,
    result,
    t,
  });

  // Get error item for an single error.
  function parseKeywordSetServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    return [
      {
        label: parseKeywordSetServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseKeywordSetServerErrorLabel({ key }: { key: string }): string {
    if (isGenericServerError(key)) {
      return '';
    }

    return t(`keywordSet.form.label${pascalCase(key)}`);
  }
};
