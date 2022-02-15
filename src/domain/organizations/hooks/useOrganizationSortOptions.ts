import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { ORGANIZATION_SORT_OPTIONS } from '../constants';

const useOrganizationSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.keys(ORGANIZATION_SORT_OPTIONS).map((key) => ({
        label: t(`organizationsPage.sortOptions.${camelCase(key)}`),
        value: (
          ORGANIZATION_SORT_OPTIONS as Record<string, ORGANIZATION_SORT_OPTIONS>
        )[key],
      })),
    [t]
  );

  return sortOptions;
};

export default useOrganizationSortOptions;
