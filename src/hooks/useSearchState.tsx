import React from 'react';

function useSearchState<T>(
  initialState: T
): [T & Partial<T>, React.Dispatch<Partial<T>>] {
  return React.useReducer(
    (prevState: T, updatedProperty: Partial<T>) => ({
      ...prevState,
      ...updatedProperty,
    }),
    initialState
  );
}

export default useSearchState;
