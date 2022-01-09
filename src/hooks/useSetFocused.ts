import React from 'react';

import useIsComponentFocused from './useIsComponentFocused';

type UseSetFocusedState = {
  focused: boolean;
  isComponentFocused: () => boolean;
  setFocused: (focused: boolean) => void;
};

const useSetFocused = (
  container: React.MutableRefObject<HTMLDivElement | HTMLTableElement | null>
): UseSetFocusedState => {
  const [focused, setFocused] = React.useState(false);
  const isComponentFocused = useIsComponentFocused(container);

  const onDocumentFocusin = () => {
    const isFocused = isComponentFocused();
    /* istanbul ignore next */
    if (isFocused !== focused) {
      setFocused(isFocused);
    }
  };

  React.useEffect(() => {
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  return { focused, isComponentFocused, setFocused };
};

export default useSetFocused;