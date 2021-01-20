import React from 'react';

const useWindowSize = (): { heigh?: number; width?: number } => {
  const getSize = React.useCallback(() => {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }, []);

  const [windowSize, setWindowSize] = React.useState(getSize);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

export default useWindowSize;
