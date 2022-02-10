import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { KEYWORD_SORT_OPTIONS } from '../constants';

const useKeywordSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.keys(KEYWORD_SORT_OPTIONS).map((key) => ({
        label: t(`keywordsPage.sortOptions.${camelCase(key)}`),
        value: (KEYWORD_SORT_OPTIONS as Record<string, KEYWORD_SORT_OPTIONS>)[
          key
        ],
      })),
    [t]
  );

  return sortOptions;
};

export default useKeywordSortOptions;
