import isNumber from 'lodash/isNumber';

const getNumericPayloadValue = (val: string | number | null | undefined) =>
  isNumber(val) ? val : null;

export default getNumericPayloadValue;
