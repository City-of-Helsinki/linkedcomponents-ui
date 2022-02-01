import capitalize from 'lodash/capitalize';

import { ROUTES } from '../../constants';
import {
  KeywordFieldsFragment,
  KeywordSetFieldsFragment,
  KeywordSetQueryVariables,
  KeywordSetsQueryVariables,
} from '../../generated/graphql';
import { Language, OptionType, PathBuilderProps } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import queryBuilder from '../../utils/queryBuilder';
import { KeywordSetFields } from './types';

export const keywordSetPathBuilder = ({
  args,
}: PathBuilderProps<KeywordSetQueryVariables>): string => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${id}/${query}`;
};

export const keywordSetsPathBuilder = ({
  args,
}: PathBuilderProps<KeywordSetsQueryVariables>): string => {
  const { include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${query}`;
};

export const getKeywordOption = ({
  keyword,
  locale,
}: {
  keyword?: KeywordFieldsFragment | null;
  locale: Language;
}): OptionType => {
  return {
    label: capitalize(getLocalisedString(keyword?.name, locale)).split(' (')[0],
    value: keyword?.atId ?? '',
  };
};

export const getKeywordSetFields = (
  keyword: KeywordSetFieldsFragment,
  language: Language
): KeywordSetFields => {
  const id = keyword.id ?? '';

  return {
    id,
    keywordSetUrl: `/${language}${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`,
    name: getLocalisedString(keyword.name, language),
    usage: keyword.usage ?? '',
  };
};

export const getKeywordSetItemId = (id: string): string =>
  `keyword-set-item-${id}`;
