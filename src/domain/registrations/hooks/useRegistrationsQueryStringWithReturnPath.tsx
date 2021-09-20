import React from 'react';
import { useLocation } from 'react-router-dom';

import { addParamsToRegistrationQueryString } from '../utils';

const useRegistrationsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();
  return React.useMemo(
    () =>
      addParamsToRegistrationQueryString(search, {
        returnPath: pathname,
      }),
    [pathname, search]
  );
};

export default useRegistrationsQueryStringWithReturnPath;
