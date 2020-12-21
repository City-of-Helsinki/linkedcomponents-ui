import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';

const dropNilAndEmptyString = (d: object): object => {
  return Object.entries(d).reduce((acc, [k, v]) => {
    if (isNil(v) || v === '') {
      return acc;
    } else if (Array.isArray(v)) {
      return {
        ...acc,
        [k]: v.map((item) =>
          isObject(item) ? dropNilAndEmptyString(item) : item
        ),
      };
    } else {
      return {
        ...acc,
        [k]: isObject(v) ? dropNilAndEmptyString(v) : v,
      };
    }
  }, {});
};

export default dropNilAndEmptyString;
