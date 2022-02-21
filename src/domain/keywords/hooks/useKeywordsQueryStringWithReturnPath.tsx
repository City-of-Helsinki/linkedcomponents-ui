import { useLocation } from 'react-router-dom';

import { addParamsToKeywordQueryString } from '../utils';

const useKeywordsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();

  return addParamsToKeywordQueryString(search, { returnPath: pathname });
};

export default useKeywordsQueryStringWithReturnPath;
