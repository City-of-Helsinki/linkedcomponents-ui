const isGenericServerError = (key: string): boolean =>
  ['detail', 'non_field_errors'].includes(key);

export default isGenericServerError;
