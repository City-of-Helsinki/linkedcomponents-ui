/* eslint-disable no-undef */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { MultiSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { COMBOBOX_DEBOUNCE_TIME_MS } from '../../../constants';
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
import useDebounce from '../../../hooks/useDebounce';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import skipFalsyType from '../../../utils/skipFalsyType';
import Combobox from '../combobox/Combobox';
import ComboboxLoadingSpinner from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';

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

type ValueType = string;

export type KeywordSelectorProps = {
  name: string;
  value: ValueType[];
} & Omit<MultiSelectProps<OptionType>, 'options' | 'value'>;

const KeywordSelector: React.FC<KeywordSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const timer = React.useRef<NodeJS.Timeout>();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = useMountedState('');
  const debouncedSearch = useDebounce(search, COMBOBOX_DEBOUNCE_TIME_MS);

  const [selectedKeywords, setSelectedKeywords] = React.useState<OptionType[]>(
    []
  );

  const {
    data: keywordsData,
    loading,
    previousData: previousKeywordsData,
  } = useKeywordsQuery({
    variables: {
      createPath: getPathBuilder(keywordsPathBuilder),
      dataSource: ['yso', 'helsinki'],
      showAllKeywords: true,
      text: debouncedSearch,
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSearch(inputValue);
    });

    return items;
  };

  const options: OptionType[] = React.useMemo(
    () =>
      (keywordsData || previousKeywordsData)?.keywords.data.map((keyword) =>
        getOption({ keyword: keyword as KeywordFieldsFragment, locale })
      ) ?? [],
    [keywordsData, locale, previousKeywordsData]
  );

  React.useEffect(() => {
    const getSelectedKeywordsFromCache = async () =>
      setSelectedKeywords(
        (
          await Promise.all(
            value.map(async (atId) => {
              const keyword = await getKeywordQueryResult(
                parseIdFromAtId(atId) as string,
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

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ComboboxLoadingSpinner isLoading={loading}>
      <Combobox
        {...rest}
        multiselect={true}
        filter={handleFilter}
        id={name}
        label={label}
        options={options}
        toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
        value={selectedKeywords}
      />
    </ComboboxLoadingSpinner>
  );
};

export default KeywordSelector;
