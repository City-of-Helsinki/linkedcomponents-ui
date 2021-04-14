import throttle from 'lodash/throttle';
import React from 'react';

import useIsMounted from './useIsMounted';

export const LOADING_SPINNER_THROTTLE_TIME = 300;

const useShowLoadingSpinner = (
  isLoading: boolean,
  throttleTime = LOADING_SPINNER_THROTTLE_TIME
) => {
  const isMounted = useIsMounted();
  const [showLoadingSpinner, setShowLoadingSpinner] = React.useState<boolean>(
    false
  );

  const handleIsLoadingChange = React.useCallback(
    throttle((loading: boolean) => {
      /* istanbul ignore next */
      if (!isMounted.current) return;

      setShowLoadingSpinner(loading);
    }, throttleTime),
    [throttleTime, isMounted]
  );

  React.useEffect(() => {
    handleIsLoadingChange(isLoading);
  }, [handleIsLoadingChange, isLoading]);

  return showLoadingSpinner;
};

export default useShowLoadingSpinner;
