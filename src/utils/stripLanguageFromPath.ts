import { SUPPORTED_LANGUAGES } from '../constants';

const langPathRegExp = new RegExp(
  `/(${Object.values(SUPPORTED_LANGUAGES).join('|')})`
);

const stripLanguageFromPath = (path: string) =>
  path.replace(langPathRegExp, '');

export default stripLanguageFromPath;
