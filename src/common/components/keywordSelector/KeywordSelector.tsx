import { useApolloClient } from '@apollo/client';
import { MultiSelectProps } from 'hds-react/components/Select';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  getKeywordFromCache,
  keywordsPathBuilder,
} from '../../../domain/keyword/utils';
import {
  KeywordFieldsFragment,
  useKeywordsQuery,
} from '../../../generated/graphql';
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
  let timer: NodeJS.Timeout;
  const isMounted = React.useRef(false);
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
      createPath: getPathBuilder(keywordsPathBuilder),
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    timer = setTimeout(() => {
      if (isMounted.current) {
        setSearch(inputValue);
      }
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

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
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
