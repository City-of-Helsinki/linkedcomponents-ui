import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';

export const getSearchQuery = (filters: {
  [key: string]:
    | null
    | undefined
    | boolean
    | number
    | number[]
    | string
    | string[];
}): string => {
  const urlParams = new URLSearchParams();

  forEach(filters, (filter, key) => {
    /* istanbul ignore else */
    if (typeof filter === 'boolean') {
      urlParams.append(key, encodeURIComponent(filter));
    } else if (!isEmpty(filter) || isNumber(filter)) {
      if (Array.isArray(filter)) {
        filter.forEach((item: string | number) => {
          urlParams.append(key, item.toString());
        });
      } /* istanbul ignore else */ else if (!isNil(filter)) {
        urlParams.append(key, filter.toString());
      }
    }
  });

  return urlParams.toString();
};
