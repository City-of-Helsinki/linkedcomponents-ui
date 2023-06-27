import capitalize from 'lodash/capitalize';

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
  locale: Language
): OptionType => ({
  label: capitalize(getLocalisedString(language.name, locale)),
  value: getValue(language.id, ''),
});

export const sortLanguageOptions = (a: OptionType, b: OptionType): number =>
  a.label > b.label ? 1 : -1;

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
