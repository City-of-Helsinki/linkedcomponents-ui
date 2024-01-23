import { TFunction } from 'i18next';
import isEmpty from 'lodash/isEmpty';

import { LEServerError, ServerErrorItem } from '../types';
import parseServerErrorMessage from './parseServerErrorMessage';

const parseServerErrorArray = ({
  error,
  parseLabelFn,
  t,
}: {
  error: LEServerError;
  parseLabelFn: (props: { key: string }) => string;
  t: TFunction;
}) => {
  if (Array.isArray(error)) {
    const parseErrorObj = (errObj: string | LEServerError): ServerErrorItem[] =>
      Object.entries(errObj).reduce(
        (previous: ServerErrorItem[], [key, e]) => [
          ...previous,
          {
            label: parseLabelFn({ key }),
            message: parseServerErrorMessage({ error: e as string[], t }),
          },
        ],
        []
      );

    return Object.values(error)
      .filter((i) => !isEmpty(i))
      .reduce(
        (previous: ServerErrorItem[], e) => [...previous, ...parseErrorObj(e)],
        []
      );
  } else {
    return [];
  }
};

export default parseServerErrorArray;
