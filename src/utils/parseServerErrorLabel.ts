// LE returns always error message in a single language, so use i18n to translate

import isGenericServerError from './isGenericServerError';

const parseServerErrorLabel = ({
  key,
  nonFieldErrorsLabel,
  parseFn,
}: {
  key: string;
  nonFieldErrorsLabel?: string;
  parseFn: (props: { key: string }) => string;
}): string => {
  if (isGenericServerError(key)) {
    if (nonFieldErrorsLabel) {
      return nonFieldErrorsLabel;
    }
    return '';
  }

  return parseFn({ key });
};

export default parseServerErrorLabel;
