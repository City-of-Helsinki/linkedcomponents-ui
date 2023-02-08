import reduce from 'lodash/reduce';

import { ORDERED_LE_DATA_LANGUAGES } from '../constants';
import { LocalisedFieldsFragment } from '../generated/graphql';
import { Maybe, MultiLanguageObject } from '../types';

const getLocalisedObject = (
  obj: Maybe<LocalisedFieldsFragment>,
  defaultValue = ''
): MultiLanguageObject => {
  return reduce(
    ORDERED_LE_DATA_LANGUAGES,
    (acc, lang) => ({
      ...acc,
      [lang]: (obj && obj[lang]) || defaultValue,
    }),
    {}
  ) as MultiLanguageObject;
};

export default getLocalisedObject;
