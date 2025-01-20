/* eslint-disable no-undef */
import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFields,
  getKeywordQueryResult,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  Keyword,
  KeywordFieldsFragment,
  KeywordsQuery,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import Combobox, { MultiComboboxProps } from '../combobox/Combobox';

const getOption = ({
  keyword,
  locale,
}: {
  keyword: KeywordFieldsFragment | Keyword;
  locale: Language;
}): OptionType => {
  const { atId: value, name: label } = getKeywordFields(keyword, locale);

  return { label, value };
};

export type KeywordSelectorProps = MultiComboboxProps<string>;

const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  texts,
  name,
  value,
  ...rest
}) => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const locale = useLocale();

  const [selectedKeywords, setSelectedKeywords] = React.useState<OptionType[]>(
    []
  );

  const QUERY_VARIABLES = {
    createPath: getPathBuilder(keywordsPathBuilder),
    dataSource: ['yso', 'helsinki'],
    showAllKeywords: true,
  };

  const {
    data: keywordsData,
    loading,
    refetch,
  } = useKeywordsQuery({
    variables: QUERY_VARIABLES,
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

  const options = React.useMemo(
    () => getKeywordsData(keywordsData),
    [getKeywordsData, keywordsData]
  );

  const handleSearch: SearchFunction = async (
    searchValue: string
  ): Promise<SearchResult> => {
    try {
      const { data: searchKeywordsData, error } = await refetch({
        ...QUERY_VARIABLES,
        freeText: searchValue,
      });

      if (error) {
        throw error;
      }

      return { options: getKeywordsData(searchKeywordsData) };
    } catch (error) {
      return Promise.reject(error as ApolloError);
    }
  };

  React.useEffect(() => {
    const getSelectedKeywordsFromCache = async () =>
      setSelectedKeywords(
        (
          await Promise.all(
            value.map(async (atId) => {
              const keyword = await getKeywordQueryResult(
                getValue(parseIdFromAtId(atId), ''),
                apolloClient
              );
              /* istanbul ignore next */
              return keyword ? getOption({ keyword: keyword, locale }) : null;
            })
          )
        ).filter(skipFalsyType)
      );

    getSelectedKeywordsFromCache();
  }, [apolloClient, locale, value]);

  return (
    <Combobox
      {...rest}
      multiSelect
      onSearch={handleSearch}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_multiple: t('common.combobox.clearKeywords'),
      }}
      options={options}
      value={selectedKeywords}
    />
  );
};

export default KeywordSelector;
