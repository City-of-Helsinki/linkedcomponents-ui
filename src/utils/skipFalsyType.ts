import { FalsyType } from '../types';

const skipFalsyType = <ValueType>(
  value: ValueType
): value is Exclude<ValueType, FalsyType> => {
  return Boolean(value);
};

export default skipFalsyType;
