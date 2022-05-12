import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { MultiSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFields,
  getKeywordQueryResult,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  KeywordFieldsFragment,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';

const getOption = ({
  keyword,
  locale,
}: {
  keyword: KeywordFieldsFragment;
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
  const timer = React.useRef<number>();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = useMountedState('');
  const [selectedKeywords, setSelectedKeywords] = React.useState<OptionType[]>(
    []
  );

  const { data: keywordsData, previousData: previousKeywordsData } =
    useKeywordsQuery({
      variables: {
        createPath: getPathBuilder(keywordsPathBuilder),
        dataSource: ['yso', 'helsinki'],
        showAllKeywords: true,
        text: search,
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
    const getSelectedKeywordsFromCache = async () => {
      const keywords = await Promise.all(
        value.map(async (atId) => {
          const keyword = await getKeywordQueryResult(
            parseIdFromAtId(atId) as string,
            apolloClient
          );
          /* istanbul ignore next */
          return keyword
            ? getOption({ keyword: keyword as KeywordFieldsFragment, locale })
            : { label: '', value: '' };
        })
      );
      setSelectedKeywords(keywords);
    };

    getSelectedKeywordsFromCache();
  }, [apolloClient, locale, value]);

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
  );
};

export default KeywordSelector;
