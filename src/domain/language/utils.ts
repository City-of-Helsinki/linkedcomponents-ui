import capitalize from 'lodash/capitalize';
import get from 'lodash/get';

import {
  LanguageFieldsFragment,
  LanguagesQueryVariables,
} from '../../generated/graphql';
import { Language, OptionType, PathBuilderProps } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';

export const getLanguageOption = (
  language: LanguageFieldsFragment,
  locale: Language,
  idKey: 'atId' | 'id' = 'id'
): OptionType => ({
  label: capitalize(getLocalisedString(language.name, locale)),
  value: getValue(language[idKey], ''),
});

export const sortLanguageOptions = (a: OptionType, b: OptionType): number => {
  const languagePriorities = {
    fi: 3,
    sv: 2,
    en: 1,
  };
  const aPriority = get(languagePriorities, a.value, 0);
  const bPriority = get(languagePriorities, b.value, 0);

  if (aPriority !== bPriority) {
    return bPriority - aPriority;
  }
  return a.label > b.label ? 1 : -1;
};

export const languagesPathBuilder = ({
  args,
}: PathBuilderProps<LanguagesQueryVariables>): string => {
  const { serviceLanguage } = args;
  const variableToKeyItems = [
    { key: 'service_language', value: serviceLanguage },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/language/${query}`;
};
