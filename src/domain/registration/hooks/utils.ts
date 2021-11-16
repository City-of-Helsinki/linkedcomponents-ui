import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import pascalCase from '../../../utils/pascalCase';

export const parseRegistrationServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any> | Record<string, any>[] | string;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple registrations in same request.
  // In that case call parseRegistrationServerErrors recursively to get all single errors
  if (Array.isArray(result)) {
    return result.reduce(
      (previous: ServerErrorItem[], r) => [
        ...previous,
        ...parseRegistrationServerErrors({ result: r, t }),
      ],
      []
    );
  }

  return typeof result === 'string'
    ? [{ label: '', message: parseServerErrorMessage({ error: [result], t }) }]
    : Object.entries(result).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseRegistrationServerError({ error, key }),
        ],
        []
      );

  // Get error item for an single error.
  function parseRegistrationServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    switch (key) {
      default:
        return [
          {
            label: parseRegistrationServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error, t }),
          },
        ];
    }
  }

  // Get correct field name for an error item
  function parseRegistrationServerErrorLabel({ key }: { key: string }): string {
    return t(`registration.form.label${pascalCase(key)}`);
  }
};
