import { useApolloClient } from '@apollo/client';
import { MultiSelectProps } from 'hds-react/components/Select';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFromCache,
  keywordPathBuilder,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  KeywordFieldsFragment,
  useKeywordQuery,
  useKeywordsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language, OptionType } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import isTestEnv from '../../../utils/isTestEnv';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import Combobox from '../combobox/Combobox';

const getKeywordFields = (
  keyword: KeywordFieldsFragment,
  locale: Language
) => ({
  id: keyword.atId as string,
  name: getLocalisedString(keyword.name, locale),
});

const getOption = (
  keyword: KeywordFieldsFragment,
  locale: Language
): OptionType => {
  const { id: value, name: label } = getKeywordFields(keyword, locale);

  return {
    label,
    value,
  };
};

type KeywordQueryProps = {
  id: string;
};

const KeywordQuery: React.FC<KeywordQueryProps> = ({ id }) => {
  // hook to fetch keyword so KeywordSelector can get keyword from the cache
  useKeywordQuery({
    variables: {
      id,
      createPath: isTestEnv
        ? undefined
        : /* istanbul ignore next */ keywordPathBuilder,
    },
  });

  return null;
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
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = React.useState('');
  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [selectedKeywords, setSelectedKeywords] = React.useState<OptionType[]>(
    []
  );

  const { data: keywordsData } = useKeywordsQuery({
    variables: {
      freeText: search,
      createPath: isTestEnv
        ? undefined
        : /* istanbul ignore next */ keywordsPathBuilder,
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    setTimeout(() => {
      setSearch(inputValue);
    }, 0);

    return items;
  };

  React.useEffect(() => {
    if (keywordsData?.keywords.data) {
      setOptions(
        sortBy(
          keywordsData.keywords.data.map((keyword) =>
            getOption(keyword as KeywordFieldsFragment, locale)
          ),
          ['label']
        )
      );
    }
  }, [keywordsData, locale]);

  React.useEffect(() => {
    const getSelectedKeywordsFromCache = async () => {
      const keywords = await Promise.all(
        value.map(async (id) => {
          const keyword = await getKeywordFromCache(
            parseIdFromAtId(id) as string,
            apolloClient
          );

          return keyword
            ? getOption(keyword as KeywordFieldsFragment, locale)
            : { label: '', value: '' };
        })
      );

      setSelectedKeywords(keywords);
    };

    getSelectedKeywordsFromCache();
  }, [apolloClient, locale, value]);

  return (
    <>
      {value.map((keyword, index) => {
        return (
          // Make sure all selected keywords are fetched to cache
          <KeywordQuery key={index} id={parseIdFromAtId(keyword) as string} />
        );
      })}

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
