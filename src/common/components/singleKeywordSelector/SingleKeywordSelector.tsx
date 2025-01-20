/* eslint-disable no-undef */
import { ApolloError } from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFields,
  keywordPathBuilder,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  Keyword,
  KeywordFieldsFragment,
  KeywordsQuery,
  useKeywordQuery,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';

const getOption = ({
  keyword,
  locale,
}: {
  keyword: KeywordFieldsFragment | Keyword;
  locale: Language;
}): OptionType => {
  const { id: value, name: label } = getKeywordFields(keyword, locale);

  return { label, value };
};

export type SingleKeywordSelectorProps = SingleComboboxProps<string>;

const SingleKeywordSelector: React.FC<SingleKeywordSelectorProps> = ({
  texts,
  name,
  value,
  ...rest
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const QUERY_VARIABLES = {
    createPath: getPathBuilder(keywordsPathBuilder),
    showAllKeywords: true,
  };

  const {
    data: keywordsData,
    loading,
    refetch,
  } = useKeywordsQuery({
    variables: QUERY_VARIABLES,
  });

  const { data: keywordData } = useKeywordQuery({
    skip: !value,
    variables: {
      id: value,
      createPath: getPathBuilder(keywordPathBuilder),
    },
  });

  const getKeywordsData = useCallback(
    (data: KeywordsQuery | undefined) =>
      getValue(
        data?.keywords.data.map((keyword) =>
          getOption({ keyword: keyword as KeywordFieldsFragment, locale })
        ),
        []
      ),
    [locale]
  );

  const handleSearch: SearchFunction = async (
    searchValue: string
  ): Promise<SearchResult> => {
    try {
      const { data: searchKeywordsData, error } = await refetch({
        ...QUERY_VARIABLES,
        text: searchValue,
      });

      if (error) {
        throw error;
      }

      return { options: getKeywordsData(searchKeywordsData) };
    } catch (error) {
      return Promise.reject(error as ApolloError);
    }
  };

  const options = React.useMemo(
    () => getKeywordsData(keywordsData),
    [getKeywordsData, keywordsData]
  );

  const selectedKeyword = React.useMemo(
    () =>
      keywordData?.keyword
        ? getOption({ keyword: keywordData.keyword, locale })
        : null,
    [keywordData, locale]
  );

  return (
    <Combobox
      {...rest}
      onSearch={handleSearch}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearKeywords'),
      }}
      options={options}
      // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
      // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
      value={selectedKeyword?.value}
    />
  );
};

export default SingleKeywordSelector;
