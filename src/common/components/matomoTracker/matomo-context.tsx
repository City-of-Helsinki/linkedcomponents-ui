/* eslint-disable react/forbid-prop-types */
import React, { createContext } from 'react';

export interface MatomoInstance {
  trackPageView: (params: unknown) => void;
}

interface MatomoProviderProps {
  children: React.ReactNode;
  value: MatomoInstance;
}

export const MatomoContext = createContext<MatomoInstance | null>(null);

export const MatomoProvider = ({ children, value }: MatomoProviderProps) => {
  const Context = MatomoContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
