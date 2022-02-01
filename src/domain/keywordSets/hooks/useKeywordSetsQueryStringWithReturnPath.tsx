import React from 'react';
import { useLocation } from 'react-router-dom';

import { addParamsToKeywordSetQueryString } from '../utils';

const useKeywordSetsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();
  return React.useMemo(
    () => addParamsToKeywordSetQueryString(search, { returnPath: pathname }),
    [pathname, search]
  );
};

export default useKeywordSetsQueryStringWithReturnPath;
