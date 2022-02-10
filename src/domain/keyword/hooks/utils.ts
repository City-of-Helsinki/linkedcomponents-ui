import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import pascalCase from '../../../utils/pascalCase';

export const parseKeywordServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple keywords in same request.
  // In that case call parseKeywordServerErrors recursively to get all single errors
  if (Array.isArray(result)) {
    return result.reduce(
      (previous: ServerErrorItem[], r) => [
        ...previous,
        ...parseKeywordServerErrors({ result: r, t }),
      ],
      []
    );
  }

  return typeof result === 'string'
    ? [{ label: '', message: parseServerErrorMessage({ error: [result], t }) }]
    : Object.entries(result).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseKeywordServerError({ error: error as LEServerError, key }),
        ],
        []
      );

  // Get error item for an single error.
  function parseKeywordServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    return [
      {
        label: parseKeywordServerErrorLabel({ key }),
        message: parseServerErrorMessage({ error, t }),
      },
    ];
  }

  // Get correct field name for an error item
  function parseKeywordServerErrorLabel({ key }: { key: string }): string {
    return t(`keyword.form.label${pascalCase(key)}`);
  }
};
