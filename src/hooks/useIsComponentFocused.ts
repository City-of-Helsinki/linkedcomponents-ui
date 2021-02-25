import React from 'react';

const useIsComponentFocused = (
  container: React.MutableRefObject<HTMLDivElement | HTMLTableElement | null>
): (() => boolean) => {
  const isComponentFocused = React.useCallback(
    () => Boolean(container.current?.contains(document.activeElement)),
    [container]
  );

  return isComponentFocused;
};

export default useIsComponentFocused;
