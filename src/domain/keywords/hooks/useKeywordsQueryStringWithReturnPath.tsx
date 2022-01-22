import React from 'react';
import { useLocation } from 'react-router-dom';

import { addParamsToKeywordQueryString } from '../utils';

const useKeywordsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();
  return React.useMemo(
    () => addParamsToKeywordQueryString(search, { returnPath: pathname }),
    [pathname, search]
  );
};

export default useKeywordsQueryStringWithReturnPath;
