import capitalize from 'lodash/capitalize';

import { LanguageFieldsFragment } from '../../generated/graphql';
import { Language, OptionType } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';

export const getLanguageOption = (
  language: LanguageFieldsFragment,
  locale: Language
): OptionType => ({
  label: capitalize(getLocalisedString(language.name, locale)),
  value: language.id as string,
});

export const sortLanguageOptions = (a: OptionType, b: OptionType): number =>
  a.label > b.label ? 1 : -1;
