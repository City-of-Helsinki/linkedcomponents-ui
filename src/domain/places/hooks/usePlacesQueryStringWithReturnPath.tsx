import { useLocation } from 'react-router-dom';

import { addParamsToPlaceQueryString } from '../utils';

const usePlacesQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();

  return addParamsToPlaceQueryString(search, { returnPath: pathname });
};

export default usePlacesQueryStringWithReturnPath;
