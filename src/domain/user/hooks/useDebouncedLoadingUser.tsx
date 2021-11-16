import debounce from 'lodash/debounce';
import React from 'react';

import useIsMounted from '../../../hooks/useIsMounted';
import useUser from './useUser';

const LOADING_USER_DEBOUNCE_TIME = 50;

const useDebouncedLoadingUser = (): boolean => {
  const isMounted = useIsMounted();
  const { loading: loadingUser } = useUser();
  const [debouncedLoadingUser, setDebouncedLoadingUser] =
    React.useState(loadingUser);

  const debouncedSetLoading = React.useMemo(
    () =>
      debounce((loading: boolean) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        setDebouncedLoadingUser(loading);
      }, LOADING_USER_DEBOUNCE_TIME),
    [isMounted]
  );

  const handleLoadingUserChange = React.useCallback(
    (loading: boolean) => {
      /* istanbul ignore next */
      debouncedSetLoading(loading);
    },
    [debouncedSetLoading]
  );

  React.useEffect(() => {
    handleLoadingUserChange(loadingUser);
  }, [handleLoadingUserChange, loadingUser]);

  return debouncedLoadingUser;
};

export default useDebouncedLoadingUser;
