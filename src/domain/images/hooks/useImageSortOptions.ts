import camelCase from 'lodash/camelCase';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import { IMAGE_SORT_OPTIONS } from '../constants';

const useImageSortOptions = (): OptionType[] => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(
    () =>
      Object.entries(IMAGE_SORT_OPTIONS).map(([key, value]) => ({
        label: t(`imagesPage.sortOptions.${camelCase(key)}`),
        value,
      })),
    [t]
  );

  return sortOptions;
};

export default useImageSortOptions;
