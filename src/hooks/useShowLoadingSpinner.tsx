import throttle from 'lodash/throttle';
import React from 'react';

import useIsMounted from './useIsMounted';

const useShowLoadingSpinner = (
  isLoading: boolean,
  throttleTime = 300
): boolean => {
  const isMounted = useIsMounted();
  const [showLoadingSpinner, setShowLoadingSpinner] =
    React.useState<boolean>(false);

  const throttledSetShowLoadingSpinner = React.useMemo(
    () =>
      throttle((loading: boolean) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        setShowLoadingSpinner(loading);
      }, throttleTime),
    [isMounted, throttleTime]
  );

  const handleIsLoadingChange = React.useCallback(
    (loading: boolean) => {
      throttledSetShowLoadingSpinner(loading);
    },
    [throttledSetShowLoadingSpinner]
  );

  React.useEffect(() => {
    handleIsLoadingChange(isLoading);
  }, [handleIsLoadingChange, isLoading]);

  return showLoadingSpinner;
};

export default useShowLoadingSpinner;
