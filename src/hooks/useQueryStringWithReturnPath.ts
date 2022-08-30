import { useLocation } from 'react-router';

import addParamsToQueryString from '../utils/addParamsToQueryString';
import stripLanguageFromPath from '../utils/stripLanguageFromPath';

const useQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();

  return addParamsToQueryString(search, {
    returnPath: stripLanguageFromPath(pathname),
  });
};

export default useQueryStringWithReturnPath;
