import { useMemo } from 'react';

import {
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
} from '../../../constants';

const useSortedInfoLanguages = (
  eventInfoLanguages: LE_DATA_LANGUAGES[]
): LE_DATA_LANGUAGES[] => {
  const sortedEventInfoLanguages = useMemo(
    () =>
      eventInfoLanguages.sort(
        (a, b) =>
          ORDERED_LE_DATA_LANGUAGES.indexOf(a) -
          ORDERED_LE_DATA_LANGUAGES.indexOf(b)
      ),
    [eventInfoLanguages]
  );
  return sortedEventInfoLanguages;
};

export default useSortedInfoLanguages;
