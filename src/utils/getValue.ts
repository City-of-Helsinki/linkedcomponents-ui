const getValue = <ValueType, TDefault = null>(
  value: ValueType,
  defaultValue: TDefault
): TDefault | NonNullable<ValueType> => {
  return value || defaultValue;
};

export default getValue;
