import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { ORGANIZATION_SORT_OPTIONS } from '../constants';

const useOrganizationSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(ORGANIZATION_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`organizationsPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default useOrganizationSortOptions;
