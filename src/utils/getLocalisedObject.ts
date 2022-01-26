import reduce from 'lodash/reduce';

import { ORDERED_LE_DATA_LANGUAGES } from '../constants';
import { LocalisedFieldsFragment, Maybe } from '../generated/graphql';
import { MultiLanguageObject } from '../types';

const getLocalisedObject = (
  obj?: Maybe<LocalisedFieldsFragment>,
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
