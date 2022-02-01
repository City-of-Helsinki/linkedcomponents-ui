import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { KEYWORD_SET_USAGE_OPTIONS } from '../constants';

const useKeywordSetUsageOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.keys(KEYWORD_SET_USAGE_OPTIONS).map((key) => ({
        label: t(`keywordSetsPage.usageOptions.${camelCase(key)}`),
        value: (
          KEYWORD_SET_USAGE_OPTIONS as Record<string, KEYWORD_SET_USAGE_OPTIONS>
        )[key],
      })),
    [t]
  );

  return sortOptions;
};

export default useKeywordSetUsageOptions;
