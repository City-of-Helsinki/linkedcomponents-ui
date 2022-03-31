import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { PLACE_SORT_OPTIONS } from '../constants';

const usePlacesSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(PLACE_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`placesPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default usePlacesSortOptions;
