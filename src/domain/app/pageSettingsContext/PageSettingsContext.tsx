import React, { createContext, FC, PropsWithChildren, useMemo } from 'react';

import useEventsPageSettings from '../../events/hooks/useEventsPageSettings';
import useOrganizationsPageSettings from '../../organizations/hooks/useOrganizationsPageSettings';
import { PageSettingsContextProps } from '../types';

export const PageSettingsContext = createContext<
  PageSettingsContextProps | undefined
>(undefined);

export const PageSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const events = useEventsPageSettings();
  const organizations = useOrganizationsPageSettings();

  const value = useMemo<PageSettingsContextProps>(() => {
    return { events, organizations };
  }, [events, organizations]);

  return (
    <PageSettingsContext.Provider value={value}>
      {children}
    </PageSettingsContext.Provider>
  );
};
