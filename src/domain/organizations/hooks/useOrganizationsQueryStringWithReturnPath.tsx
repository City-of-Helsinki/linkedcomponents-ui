import React from 'react';
import { useLocation } from 'react-router-dom';

import { addParamsToOrganizationQueryString } from '../utils';

const useOrganizationsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();
  return React.useMemo(
    () => addParamsToOrganizationQueryString(search, { returnPath: pathname }),
    [pathname, search]
  );
};

export default useOrganizationsQueryStringWithReturnPath;
