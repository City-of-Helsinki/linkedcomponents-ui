import { useLocation } from 'react-router-dom';

import { addParamsToImageQueryString } from '../utils';

const useImagesQueryStringWithReturnPath = (): string => {
  const { pathname, search } = useLocation();

  return addParamsToImageQueryString(search, { returnPath: pathname });
};

export default useImagesQueryStringWithReturnPath;
