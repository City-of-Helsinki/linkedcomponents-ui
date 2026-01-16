import React from 'react';

type WindowSize = {
  height: number;
  width: number;
};

const getWindowSize = (): WindowSize => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = React.useState(getWindowSize);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

export default useWindowSize;
