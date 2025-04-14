/* eslint-disable no-undef */
import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { SearchFunction, SearchResult } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFields,
  getKeywordQueryResult,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  Keyword,
  KeywordFieldsFragment,
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

  const {
    data: keywordsData,
    loading,
    previousData: previousKeywordsData,
    refetch,
  } = useKeywordsQuery({
    variables: {
      createPath: getPathBuilder(keywordsPathBuilder),
      dataSource: ['yso', 'helsinki'],
      showAllKeywords: true,
      freeText: '',
    },
  });

  const getKeywordsData = React.useCallback(
    () =>
      getValue(
        (keywordsData || previousKeywordsData)?.keywords.data.map((keyword) =>
          getOption({ keyword: keyword as KeywordFieldsFragment, locale })
        ),
        []
      ),
    [keywordsData, locale, previousKeywordsData]
  );

  const options = React.useMemo(() => getKeywordsData(), [getKeywordsData]);

  const handleSearch: SearchFunction = async (
    searchValue: string
  ): Promise<SearchResult> => {
    try {
      const { error } = await refetch({
        freeText: searchValue,
      });

      if (error) {
        throw error;
      }

      return Promise.resolve({ options: getKeywordsData() });
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
