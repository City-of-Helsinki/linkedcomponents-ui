import { ApolloError } from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFields,
  keywordPathBuilder,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  Keyword,
  KeywordFieldsFragment,
  useKeywordQuery,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useInitialSelectorOptions from '../../../hooks/useInitialSelectorOptions';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import Select, { SelectPropsWithValue } from '../select/Select';

const getOption = (
  keyword: KeywordFieldsFragment | Keyword,
  locale: Language
): OptionType => {
  const { id: value, name: label } = getKeywordFields(keyword, locale);

  return { label, value };
};

export type SingleKeywordSelectorProps = SelectPropsWithValue<string>;

const SingleKeywordSelector: React.FC<SingleKeywordSelectorProps> = ({
  texts,
  name,
  value,
  onChange,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const {
    data: keywordsData,
    loading,
    refetch,
  } = useKeywordsQuery({
    variables: {
      createPath: getPathBuilder(keywordsPathBuilder),
      showAllKeywords: true,
      text: '',
    },
  });

  const { data: keywordData } = useKeywordQuery({
    skip: !value,
    variables: {
      id: value,
      createPath: getPathBuilder(keywordPathBuilder),
    },
  });

  // Update initial options when locale changes
  const initialOptions = useInitialSelectorOptions(
    keywordsData?.keywords.data as KeywordFieldsFragment[] | undefined,
    getOption
  );

  const handleSearch: SearchFunction = React.useCallback(
    async (searchValue: string): Promise<SearchResult> => {
      try {
        const { error, data: newkeywordsData } = await refetch({
          text: searchValue,
        });

        if (error) {
          throw error;
        }

        return {
          options: getValue(
            newkeywordsData?.keywords.data.map((keyword) =>
              getOption(keyword as KeywordFieldsFragment, locale)
            ),
            []
          ),
        };
      } catch (error) {
        return Promise.reject(error as ApolloError);
      }
    },
    [refetch, locale]
  );

  const selectedKeyword = React.useMemo(
    () =>
      keywordData?.keyword ? [getOption(keywordData.keyword, locale)] : [],
    [keywordData, locale]
  );

  const memoizedTexts = React.useMemo(
    () => ({
      ...texts,
      clearButtonAriaLabel_one: t('common.combobox.clearKeywords'),
    }),
    [texts, t]
  );

  return (
    <Select
      {...rest}
      multiSelect={false}
      onSearch={handleSearch}
      onChange={onChange}
      id={name}
      isLoading={loading}
      texts={memoizedTexts}
      options={initialOptions}
      value={selectedKeyword}
    />
  );
};

export default SingleKeywordSelector;
