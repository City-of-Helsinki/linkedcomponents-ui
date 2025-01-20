/* eslint-disable no-undef */
import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Option, SearchFunction, SearchResult, SelectData } from 'hds-react';
import React, { useEffect } from 'react';
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
import Select, { MultiSelectPropsWithValue } from '../select/Select';

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

export type KeywordSelectorProps = MultiSelectPropsWithValue<string> & {
  handleClose: (selectedOptions: OptionType[]) => void;
};

const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  texts,
  name,
  value,
  handleClose,
  ...rest
}) => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const locale = useLocale();

  const [selectedKeywords, setSelectedKeywords] = React.useState<OptionType[]>(
    []
  );
  const [options, setOptions] = React.useState<OptionType[]>([]);

  const initialOptions = React.useRef<OptionType[]>([]);

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

  const keywordsOptions = React.useMemo(
    () =>
      getValue(
        (keywordsData || previousKeywordsData)?.keywords.data.map((keyword) =>
          getOption({ keyword: keyword as KeywordFieldsFragment, locale })
        ),
        []
      ),
    [keywordsData, locale, previousKeywordsData]
  );

  useEffect(() => {
    setOptions(keywordsOptions);

    if (keywordsData && !initialOptions?.current.length) {
      initialOptions.current = keywordsOptions;
    }
  }, [keywordsOptions, keywordsData]);

  const handleSearch: SearchFunction = React.useCallback(
    async (searchValue: string): Promise<SearchResult> => {
      try {
        const { error, data: newKeywordsData } = await refetch({
          freeText: searchValue,
        });

        if (error) {
          throw error;
        }

        return Promise.resolve({
          options: getValue(
            newKeywordsData?.keywords.data.map((keyword) =>
              getOption({ keyword: keyword as KeywordFieldsFragment, locale })
            ),
            []
          ),
        });
      } catch (error) {
        return Promise.reject(error as ApolloError);
      }
    },
    [refetch, locale]
  );

  const onClose = React.useCallback(
    (
      selectedOptions: Option[],
      _clickedOption: undefined,
      _data: SelectData
    ) => {
      setOptions(initialOptions.current);

      if (handleClose) {
        handleClose(selectedOptions);
      }
    },
    [handleClose]
  );

  React.useEffect(() => {
    const getSelectedKeywordsFromCache = async () => {
      const selectedOptions = await Promise.all(
        value.map(async (atId) => {
          const keyword = await getKeywordQueryResult(
            getValue(parseIdFromAtId(atId), ''),
            apolloClient
          );
          /* istanbul ignore next */
          return keyword ? getOption({ keyword: keyword, locale }) : null;
        })
      );

      setSelectedKeywords(selectedOptions.filter(skipFalsyType));
    };

    getSelectedKeywordsFromCache();
  }, [apolloClient, locale, value]);

  return (
    <Select
      {...rest}
      multiSelect
      onSearch={handleSearch}
      onClose={onClose}
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
