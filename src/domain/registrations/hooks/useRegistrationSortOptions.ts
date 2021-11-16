import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { REGISTRATION_SORT_OPTIONS } from '../constants';

const useRegistrationSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.keys(REGISTRATION_SORT_OPTIONS).map((key) => ({
        label: t(`registrationsPage.sortOptions.${camelCase(key)}`),
        value: (
          REGISTRATION_SORT_OPTIONS as Record<string, REGISTRATION_SORT_OPTIONS>
        )[key],
      })),
    [t]
  );

  return sortOptions;
};

export default useRegistrationSortOptions;
