import React, { createContext, FC, PropsWithChildren, useMemo } from 'react';

import useEventsPageSettings from '../../events/hooks/useEventsPageSettings';
import { PageSettingsContextProps } from '../types';

export const PageSettingsContext = createContext<
  PageSettingsContextProps | undefined
>(undefined);

export const PageSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const events = useEventsPageSettings();
  const value = useMemo<PageSettingsContextProps>(() => {
    return { events };
  }, [events]);

  return (
    <PageSettingsContext.Provider value={value}>
      {children}
    </PageSettingsContext.Provider>
  );
};
