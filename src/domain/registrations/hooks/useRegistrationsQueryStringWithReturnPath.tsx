import { useLocation } from 'react-router-dom';

import { addParamsToRegistrationQueryString } from '../utils';

const useRegistrationsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();

  return addParamsToRegistrationQueryString(search, { returnPath: pathname });
};

export default useRegistrationsQueryStringWithReturnPath;
