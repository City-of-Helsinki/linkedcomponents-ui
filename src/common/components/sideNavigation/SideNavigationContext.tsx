import React from 'react';

export type SideNavigationContextType = {
  openMainLevels: number[];
  setOpenMainLevels: (mainLevelIndeces: number[]) => void;
};

const SideNavigationContext = React.createContext<SideNavigationContextType>({
  openMainLevels: [],
  setOpenMainLevels: () => undefined,
});

export default SideNavigationContext;
