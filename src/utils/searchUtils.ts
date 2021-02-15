import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';

export const getSearchQuery = (filters: {
  [key: string]: boolean | number | number[] | string | string[];
}) => {
  const query: string[] = [];

  forEach(filters, (filter, key) => {
    /* istanbul ignore else */
    if (!isEmpty(filter) || isNumber(filter) || typeof filter === 'boolean') {
      if (Array.isArray(filter)) {
        const items: Array<string | number> = [];

        filter.forEach((item: string | number) => {
          items.push(encodeURIComponent(item));
        });

        query.push(`${key}=${items.join(',')}`);
      } /* istanbul ignore else */ else if (!isNil(filter)) {
        query.push(`${key}=${encodeURIComponent(filter)}`);
      }
    }
  });

  return query.length ? `?${query.join('&')}` : '';
};
