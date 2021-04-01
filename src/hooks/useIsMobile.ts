import React from 'react';

import useBreakpoint from './useBreakpoint';

const useIsMobile = () => {
  const breakpoint = useBreakpoint();
  const isMobile = React.useMemo(
    () => breakpoint === 'xs' || breakpoint === 'sm',
    [breakpoint]
  );

  return isMobile;
};

export default useIsMobile;
