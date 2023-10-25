import isNumber from 'lodash/isNumber';

const getNumberFieldValue = (value: number | null | undefined): number | '' =>
  isNumber(value) ? value : '';

export default getNumberFieldValue;
