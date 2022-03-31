import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { KEYWORD_SET_SORT_OPTIONS } from '../constants';

const useKeywordSetSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(KEYWORD_SET_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`keywordSetsPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default useKeywordSetSortOptions;
