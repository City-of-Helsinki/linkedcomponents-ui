/* eslint-disable @typescript-eslint/no-explicit-any */
import keys from 'lodash/keys';

import { ORDERED_LE_DATA_LANGUAGES } from '../constants';

// Enumerate all the property names of an object recursively.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* propertyNames(
  obj: Record<string, unknown>,
  skipFields: Set<string>
): any {
  for (const name of keys(obj)) {
    const val = obj[name];
    if (val instanceof Object && !skipFields.has(name)) {
      yield* propertyNames(val as Record<string, unknown>, skipFields);
    }
    if (val && val !== '') {
      yield name;
    }
  }
}

export const getInfoLanguages = (
  obj: Record<string, unknown>,
  skipFields: Set<string>
): string[] => {
  const languages = new Set(ORDERED_LE_DATA_LANGUAGES);
  const foundLanguages = new Set<string>();

  for (const name of propertyNames(obj, skipFields)) {
    if (foundLanguages.size === languages.size) {
      break;
    }
    if (languages.has(name)) {
      foundLanguages.add(name);
    }
  }
  return Array.from(foundLanguages);
};
