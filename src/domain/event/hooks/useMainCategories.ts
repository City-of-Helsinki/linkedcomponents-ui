import { useMemo } from 'react';

import { EVENT_TYPE } from '../constants';
import useEventFieldOptionsData from './useEventFieldOptionsData';

const useMainCategories = (type: EVENT_TYPE): string[] => {
  const { topicsData } = useEventFieldOptionsData(type);

  const mainCategories: string[] = useMemo(() => {
    // Set main categories to validate that at least one main category is selected
    return (
      topicsData?.keywordSet?.keywords?.map((k) => k?.atId as string) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsData]);

  return mainCategories;
};

export default useMainCategories;
