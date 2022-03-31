import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { EVENT_SORT_OPTIONS } from '../constants';

const useEventSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(EVENT_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`eventsPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default useEventSortOptions;
