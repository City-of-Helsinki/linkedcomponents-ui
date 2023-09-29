import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import isGenericServerError from '../../../utils/isGenericServerError';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import pascalCase from '../../../utils/pascalCase';

export const parseFeedbackServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any> | string;
  t: TFunction;
}): ServerErrorItem[] => {
  return Object.entries(result).reduce(
    (previous: ServerErrorItem[], [key, error]) => [
      ...previous,
      ...parseFeedbackServerError({ error, key }),
    ],
    []
  );

  // Get error item for an single error. Also get all errors for nested fields (description,
  // short_description, videos)
  function parseFeedbackServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    return [
      {
        label: parseFeedbackServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseFeedbackServerErrorLabel({ key }: { key: string }): string {
    if (isGenericServerError(key)) {
      return '';
    }

    return t(`helpPage.contactPage.label${pascalCase(key)}`);
  }
};
