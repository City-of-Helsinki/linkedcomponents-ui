import { useMemo } from 'react';

import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { EVENT_TYPE } from '../constants';
import useEventFieldOptionsData from './useEventFieldOptionsData';

const useMainCategories = (type: EVENT_TYPE): string[] => {
  const { topicsData } = useEventFieldOptionsData(type);

  const mainCategories: string[] = useMemo(() => {
    // Set main categories to validate that at least one main category is selected
    return getValue(
      topicsData?.keywordSet?.keywords
        ?.filter(skipFalsyType)
        .map((k) => k.atId),
      []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsData]);

  return mainCategories;
};

export default useMainCategories;
