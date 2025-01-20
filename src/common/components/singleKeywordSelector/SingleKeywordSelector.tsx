/* eslint-disable no-undef */
import { ApolloError } from '@apollo/client';
import { Option, SearchFunction, SearchResult, SelectData } from 'hds-react';
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
  useKeywordQuery,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import Select, { SelectPropsWithValue } from '../select/Select';

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

  const getKeywordsData = useCallback(
    () =>
      getValue(
        (keywordsData || previousKeywordsData)?.keywords.data.map((keyword) =>
          getOption({ keyword: keyword as KeywordFieldsFragment, locale })
        ),
        []
      ),
    [keywordsData, locale, previousKeywordsData]
  );

  const keywordsOptions = React.useMemo(
    () => getKeywordsData(),
    [getKeywordsData]
  );

  React.useEffect(() => {
    setOptions(keywordsOptions);

    if (keywordsData && !initialOptions?.current.length) {
      initialOptions.current = keywordsOptions;
    }
  }, [keywordsOptions, keywordsData]);

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
              getOption({ keyword: keyword as KeywordFieldsFragment, locale })
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

  const handleChange = React.useCallback(
    (selectedOptions: Option[], clickedOption: Option, data: SelectData) => {
      setOptions(initialOptions.current);

      if (onChange) {
        onChange(selectedOptions, clickedOption, data);
      }
    },
    [onChange]
  );

  const selectedKeyword = React.useMemo(
    () =>
      keywordData?.keyword
        ? [getOption({ keyword: keywordData.keyword, locale })]
        : [],
    [keywordData, locale]
  );

  return (
    <Select
      {...rest}
      multiSelect={false}
      onSearch={handleSearch}
      onChange={handleChange}
      id={name}
      isLoading={loading}
      texts={{
        ...texts,
        clearButtonAriaLabel_one: t('common.combobox.clearKeywords'),
      }}
      options={options}
      value={selectedKeyword}
    />
  );
};

export default SingleKeywordSelector;
