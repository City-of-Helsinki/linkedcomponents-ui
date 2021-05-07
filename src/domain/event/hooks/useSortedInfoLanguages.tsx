import { useMemo } from 'react';

import {
  EVENT_INFO_LANGUAGES,
  ORDERED_EVENT_INFO_LANGUAGES,
} from '../constants';

const useSortedInfoLanguages = (
  eventInfoLanguages: EVENT_INFO_LANGUAGES[]
): EVENT_INFO_LANGUAGES[] => {
  const sortedEventInfoLanguages = useMemo(
    () =>
      eventInfoLanguages.sort(
        (a, b) =>
          ORDERED_EVENT_INFO_LANGUAGES.indexOf(a) -
          ORDERED_EVENT_INFO_LANGUAGES.indexOf(b)
      ),
    [eventInfoLanguages]
  );
  return sortedEventInfoLanguages;
};

export default useSortedInfoLanguages;
