import range from 'lodash/range';
import React from 'react';

import { OptionType } from '../../../types';

const useYearOptions = (): OptionType[] => {
  const options: OptionType[] = React.useMemo(
    () =>
      range(new Date().getFullYear(), 1899).map((year) => ({
        label: year.toString(),
        value: year.toString(),
      })),
    []
  );

  return options;
};

export default useYearOptions;
