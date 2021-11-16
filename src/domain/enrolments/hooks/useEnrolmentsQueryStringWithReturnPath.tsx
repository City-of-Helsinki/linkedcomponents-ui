import React from 'react';
import { useLocation } from 'react-router';

import { addParamsToEnrolmentQueryString } from '../utils';

const useEnrolmentsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();
  return React.useMemo(
    () => addParamsToEnrolmentQueryString(search, { returnPath: pathname }),
    [pathname, search]
  );
};

export default useEnrolmentsQueryStringWithReturnPath;
