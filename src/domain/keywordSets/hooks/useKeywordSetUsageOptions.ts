import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { KEYWORD_SET_USAGE_OPTIONS } from '../constants';

const useKeywordSetUsageOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(KEYWORD_SET_USAGE_OPTIONS).map(([key, value]) => ({
        label: t(`keywordSetsPage.usageOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default useKeywordSetUsageOptions;
