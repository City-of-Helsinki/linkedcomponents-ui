import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { EVENT_SORT_OPTIONS } from '../constants';

const useEventSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.keys(EVENT_SORT_OPTIONS).map((key) => ({
        label: t(`eventsPage.sortOptions.${camelCase(key)}`),
        value: (EVENT_SORT_OPTIONS as Record<string, EVENT_SORT_OPTIONS>)[key],
      })),
    [t]
  );

  return sortOptions;
};

export default useEventSortOptions;
