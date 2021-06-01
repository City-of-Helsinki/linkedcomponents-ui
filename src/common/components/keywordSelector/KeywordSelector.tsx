import { ApolloClient, InMemoryCache, useApolloClient } from '@apollo/client';
import { MultiSelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordQueryResult,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  KeywordFieldsFragment,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import getPathBuilder from '../../../utils/getPathBuilder';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';

const getKeywordFields = (
  keyword: KeywordFieldsFragment,
  locale: Language
) => ({
  id: keyword.atId as string,
  name: getLocalisedString(keyword.name, locale),
});

const getOption = ({
  keyword,
  locale,
}: {
  keyword: KeywordFieldsFragment;
  locale: Language;
}): OptionType => {
  const { id: value, name } = getKeywordFields(keyword, locale);

  return {
    label: name,
    value,
  };
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
  const isMounted = useIsMounted();
  const apolloClient = useApolloClient() as ApolloClient<InMemoryCache>;
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = React.useState('');
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [selectedKeywords, setSelectedKeywords] = React.useState<OptionType[]>(
    []
  );

  const { data: keywordsData } = useKeywordsQuery({
    variables: {
      dataSource: 'yso',
      showAllKeywords: true,
      text: search,
      createPath: getPathBuilder(keywordsPathBuilder),
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      /* istanbul ignore else */
      if (isMounted.current) {
        setSearch(inputValue);
      }
    });

    return items;
  };

  React.useEffect(() => {
    if (keywordsData?.keywords.data) {
      setOptions(
        keywordsData.keywords.data.map((keyword) =>
          getOption({
            keyword: keyword as KeywordFieldsFragment,
            locale,
          })
        )
      );
    }
  }, [keywordsData, locale]);

  React.useEffect(() => {
    const getSelectedKeywordsFromCache = async () => {
      const keywords = await Promise.all(
        value.map(async (id) => {
          const keyword = await getKeywordQueryResult(
            parseIdFromAtId(id) as string,
            apolloClient
          );

          return keyword
            ? getOption({
                keyword: keyword as KeywordFieldsFragment,
                locale,
              })
            : /* istanbul ignore next */ { label: '', value: '' };
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
    <>
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
    </>
  );
};

export default KeywordSelector;
