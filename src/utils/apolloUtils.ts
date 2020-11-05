import camelCase from 'lodash/camelCase';
/**
 * Normalize snake case keys to GraphQl compatible format
 * Keys with @-prefix are replaced with at-prefix
 */
export const normalizeKey = (snakecase: string) => {
  const str = snakecase.replace('@', 'at_');
  return camelCase(str);
};
