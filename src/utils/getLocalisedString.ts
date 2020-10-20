import { SUPPORTED_LANGUAGES } from '../constants';
import { LocalisedObject } from '../generated/graphql';
import { Language } from '../types';

/**
 * Check is the instance that is rendering component client (not SSR)
 */
const getLocalisedString = (
  obj: LocalisedObject | undefined | null = {},
  language: Language
): string => {
  if (obj === null) {
    return '';
  }

  const languages = [
    language,
    ...Object.values(SUPPORTED_LANGUAGES).filter((item) => item !== language),
  ];
  // Find first language which has value
  const locale = languages.find((lng) => obj[lng]);
  // Return value in correct language
  return (locale && obj[locale]) || '';
};

export default getLocalisedString;
