import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

const pascalCase = (str: string) => startCase(camelCase(str)).replace(/ /g, '');

export default pascalCase;
