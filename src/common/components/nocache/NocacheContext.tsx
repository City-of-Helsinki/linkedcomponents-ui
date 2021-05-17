// src/count-context.tsx
import * as React from 'react';

import getNocacheTime from '../../../utils/getNocacheTime';

type NocacheContextState = {
  nocache: number;
  updateNocache: () => void;
};

export const nocacheContextDefaultValue: NocacheContextState = {
  nocache: getNocacheTime(),
  updateNocache: /* istanbul ignore next */ () => undefined,
};

const NocacheContext = React.createContext<NocacheContextState>(
  nocacheContextDefaultValue
);

const NocacheContextProvider: React.FC = ({ children }) => {
  const [nocache, updateNocache] = React.useReducer(
    getNocacheTime,
    getNocacheTime()
  );
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { nocache, updateNocache };
  return (
    <NocacheContext.Provider value={value}>{children}</NocacheContext.Provider>
  );
};
const useNocacheContext = (): NocacheContextState => {
  const context = React.useContext(NocacheContext);
  /* istanbul ignore next */
  if (context === undefined) {
    throw new Error(
      'useNocacheContext must be used within a NocacheContextProvider'
    );
  }
  return context;
};
export { NocacheContextProvider, useNocacheContext };
