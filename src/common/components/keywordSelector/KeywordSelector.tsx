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
import useInitialSelectorOptions from '../../../hooks/useInitialSelectorOptions';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import Select, { MultiSelectPropsWithValue } from '../select/Select';

const getOption = (
  keyword: KeywordFieldsFragment | Keyword,
  locale: Language
): OptionType => {
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

  const {
    data: keywordsData,
    loading,
    refetch,
  } = useKeywordsQuery({
    variables: {
      createPath: getPathBuilder(keywordsPathBuilder),
      dataSource: ['yso', 'helsinki'],
      showAllKeywords: true,
      freeText: '',
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
        const { error, data: newKeywordsData } = await refetch({
          freeText: searchValue,
        });

        if (error) {
          throw error;
        }

        return Promise.resolve({
          options: getValue(
            newKeywordsData?.keywords.data.map((keyword) =>
              getOption(keyword as KeywordFieldsFragment, locale)
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

  React.useEffect(() => {
    const getSelectedKeywordsFromCache = async () => {
      const selectedOptions = await Promise.all(
        value.map(async (atId) => {
          const keyword = await getKeywordQueryResult(
            getValue(parseIdFromAtId(atId), ''),
            apolloClient
          );
          /* istanbul ignore next */
          return keyword
            ? getOption(keyword as KeywordFieldsFragment, locale)
            : null;
        })
      );

      setSelectedKeywords(selectedOptions.filter(skipFalsyType));
    };

    getSelectedKeywordsFromCache();
  }, [apolloClient, locale, value]);

  const memoizedTexts = React.useMemo(
    () => ({
      ...texts,
      clearButtonAriaLabel_multiple: t('common.combobox.clearKeywords'),
    }),
    [texts, t]
  );

  return (
    <Select
      {...rest}
      multiSelect
      onSearch={handleSearch}
      onClose={handleClose}
      id={name}
      isLoading={loading}
      texts={memoizedTexts}
      options={initialOptions}
      value={selectedKeywords}
    />
  );
};

export default KeywordSelector;
