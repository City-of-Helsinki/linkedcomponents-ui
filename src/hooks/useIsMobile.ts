import React from 'react';

import useBreakpoint from './useBreakpoint';

const useIsMobile = (): boolean => {
  const breakpoint = useBreakpoint();
  const isMobile = React.useMemo(
    () => breakpoint === 'xs' || breakpoint === 'sm',
    [breakpoint]
  );

  return isMobile;
};

export default useIsMobile;
