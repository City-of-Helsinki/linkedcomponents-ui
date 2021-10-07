import React from 'react';
import { useLocation } from 'react-router';

import { addParamsToEventQueryString } from '../utils';

const useEventsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();
  return React.useMemo(
    () => addParamsToEventQueryString(search, { returnPath: pathname }),
    [pathname, search]
  );
};

export default useEventsQueryStringWithReturnPath;
