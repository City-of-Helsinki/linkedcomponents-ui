import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../types';
import parseServerErrorMessage from './parseServerErrorMessage';

export const parseServerErrors = ({
  parseServerError,
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseServerError: (options: {
    error: LEServerError;
    key: string;
  }) => ServerErrorItem[];
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple items in same request.
  // In that case call parseServerErrors recursively to get all single errors
  if (Array.isArray(result)) {
    return result.reduce(
      (previous: ServerErrorItem[], r) => [
        ...previous,
        ...parseServerErrors({ parseServerError, result: r, t }),
      ],
      []
    );
  }

  return typeof result === 'string'
    ? [{ label: '', message: parseServerErrorMessage({ error: [result], t }) }]
    : Object.entries(result).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseServerError({ error: error as LEServerError, key }),
        ],
        []
      );
};
