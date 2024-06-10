import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number) => {
  const callbacRef = useRef<() => void>();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      callbacRef.current && callbacRef.current();
    }, delay);
    return () => clearInterval(interval);
  }, [delay]);
};

export default useInterval;
