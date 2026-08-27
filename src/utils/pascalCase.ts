import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

const pascalCase = (str: string): string =>
  startCase(camelCase(str)).replaceAll(' ', '');

export default pascalCase;
