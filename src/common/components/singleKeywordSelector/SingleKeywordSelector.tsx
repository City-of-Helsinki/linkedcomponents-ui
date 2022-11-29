/* eslint-disable no-undef */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { COMBOBOX_DEBOUNCE_TIME_MS } from '../../../constants';
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
import useDebounce from '../../../hooks/useDebounce';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { Language, OptionType } from '../../../types';
import getPathBuilder from '../../../utils/getPathBuilder';
import Combobox, { SingleComboboxProps } from '../combobox/Combobox';
import ComboboxLoadingSpinner from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';

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

export type SingleKeywordSelectorProps = SingleComboboxProps<string>;

const SingleKeywordSelector: React.FC<SingleKeywordSelectorProps> = ({
  label,
  name,
  value,
  ...rest
}) => {
  const timer = React.useRef<NodeJS.Timeout>();
  const { t } = useTranslation();
  const locale = useLocale();
  const [search, setSearch] = useMountedState('');
  const debouncedSearch = useDebounce(search, COMBOBOX_DEBOUNCE_TIME_MS);

  const {
    data: keywordsData,
    loading,
    previousData: previousKeywordsData,
  } = useKeywordsQuery({
    variables: {
      createPath: getPathBuilder(keywordsPathBuilder),
      showAllKeywords: true,
      text: debouncedSearch,
    },
  });

  const { data: keywordData } = useKeywordQuery({
    skip: !value,
    variables: {
      id: value,
      createPath: getPathBuilder(keywordPathBuilder),
    },
  });

  const handleFilter = (items: OptionType[], inputValue: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch(inputValue));

    return items;
  };

  const options: OptionType[] = React.useMemo(
    () =>
      (keywordsData || previousKeywordsData)?.keywords.data.map((keyword) =>
        getOption({ keyword: keyword as KeywordFieldsFragment, locale })
      ) ?? [],
    [keywordsData, locale, previousKeywordsData]
  );

  const selectedKeyword = React.useMemo(
    () =>
      keywordData?.keyword
        ? getOption({ keyword: keywordData.keyword, locale })
        : null,
    [keywordData, locale]
  );

  React.useEffect(() => {
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ComboboxLoadingSpinner isLoading={loading}>
      <Combobox
        {...rest}
        multiselect={false}
        filter={handleFilter}
        id={name}
        label={label}
        options={options}
        toggleButtonAriaLabel={t('common.combobox.toggleButtonAriaLabel')}
        // Combobox doesn't accept null as value so cast null to undefined. Null is needed to avoid
        // "A component has changed the uncontrolled prop "selectedItem" to be controlled" warning
        value={selectedKeyword as OptionType | undefined}
      />
    </ComboboxLoadingSpinner>
  );
};

export default SingleKeywordSelector;
