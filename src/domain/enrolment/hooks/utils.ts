import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import pascalCase from '../../../utils/pascalCase';

export const parseEnrolmentServerErrors = ({
  result,
  t,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: LEServerError;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple enrolments in same request.
  // In that case call parseEnrolmentServerErrors recursively to get all single errors
  if (Array.isArray(result)) {
    return result.reduce(
      (previous: ServerErrorItem[], r) => [
        ...previous,
        ...parseEnrolmentServerErrors({ result: r, t }),
      ],
      []
    );
  }

  return typeof result === 'string'
    ? [{ label: '', message: parseServerErrorMessage({ error: [result], t }) }]
    : Object.entries(result).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseEnrolmentServerError({ error: error as LEServerError, key }),
        ],
        []
      );

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
