import { useLocation } from 'react-router';

import { addParamsToEventQueryString } from '../utils';

const useEventsQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();

  return addParamsToEventQueryString(search, { returnPath: pathname });
};

export default useEventsQueryStringWithReturnPath;
