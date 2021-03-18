import React from 'react';

export type SideNavigationContextType = {
  isMobileMenuOpen: boolean;
  openMainLevels: number[];
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  setOpenMainLevels: (mainLevelIndeces: number[]) => void;
};

const SideNavigationContext = React.createContext<SideNavigationContextType>({
  isMobileMenuOpen: false,
  openMainLevels: [],
  setIsMobileMenuOpen: () => undefined,
  setOpenMainLevels: () => undefined,
});

export default SideNavigationContext;
