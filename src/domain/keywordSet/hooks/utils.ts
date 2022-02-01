import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import pascalCase from '../../../utils/pascalCase';

export const parseKeywordSetServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple keyword sets in same request.
  // In that case call parseKeywordSetServerErrors recursively to get all single errors
  if (Array.isArray(result)) {
    return result.reduce(
      (previous: ServerErrorItem[], r) => [
        ...previous,
        ...parseKeywordSetServerErrors({ result: r, t }),
      ],
      []
    );
  }

  return typeof result === 'string'
    ? [{ label: '', message: parseServerErrorMessage({ error: [result], t }) }]
    : Object.entries(result).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseKeywordSetServerError({ error: error as LEServerError, key }),
        ],
        []
      );

  // Get error item for an single error.
  function parseKeywordSetServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    switch (key) {
      case 'detail':
        return [{ label: '', message: parseServerErrorMessage({ error, t }) }];
      default:
        return [
          {
            label: parseKeywordSetServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error, t }),
          },
        ];
    }
  }

  // Get correct field name for an error item
  function parseKeywordSetServerErrorLabel({ key }: { key: string }): string {
    return t(`keywordSet.form.label${pascalCase(key)}`);
  }
};
