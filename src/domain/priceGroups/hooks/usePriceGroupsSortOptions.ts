import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { PRICE_GROUP_SORT_OPTIONS } from '../constants';

const usePriceGroupsSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(PRICE_GROUP_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`priceGroupsPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default usePriceGroupsSortOptions;
