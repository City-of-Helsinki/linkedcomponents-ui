// LE returns always error message in a single language, so use i18n to translate

import isGenericServerError from './isGenericServerError';

const parseServerErrorLabel = ({
  key,
  parseFn,
}: {
  key: string;
  parseFn: (props: { key: string }) => string;
}): string => {
  if (isGenericServerError(key)) {
    return '';
  }

  return parseFn({ key });
};

export default parseServerErrorLabel;
