import React from 'react';

import useIsMounted from './useIsMounted';

function useMountedState<S>(
  initialState: S | (() => S)
): [S, (state: S) => void] {
  const isMounted = useIsMounted();
  const [state, setState] = React.useState<S>(initialState);

  const setMountedState = (state: S) => {
    /* istanbul ignore else */
    if (isMounted.current) {
      setState(state);
    }
  };

  return [state, setMountedState];
}

export default useMountedState;
