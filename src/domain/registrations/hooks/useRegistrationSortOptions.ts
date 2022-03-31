import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { REGISTRATION_SORT_OPTIONS } from '../constants';

const useRegistrationSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(REGISTRATION_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`registrationsPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default useRegistrationSortOptions;
