/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ApolloProvider } from '@apollo/client';
import {
  CookieBanner,
  CookieConsentContextProvider,
  LoginProvider,
} from 'hds-react';
import React, { PropsWithChildren, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../assets/theme/theme';
import { AccessibilityNotificationProvider } from '../../common/components/accessibilityNotificationContext/AccessibilityNotificationContext';
import { MatomoContext } from '../../common/components/matomoTracker/matomo-context';
import MatomoTracker from '../../common/components/matomoTracker/MatomoTracker';
import getValue from '../../utils/getValue';
import { loginProviderProps } from '../auth/constants';
import useAuth from '../auth/hooks/useAuth';
import { createApolloClient } from './apollo/apolloClient';
import useCookieConsentSettings from './hooks/useCookieConsentSettings';
import { useNotificationsContext } from './notificationsContext/hooks/useNotificationsContext';
import { NotificationsProvider } from './notificationsContext/NotificationsContext';
import { PageSettingsProvider } from './pageSettingsContext/PageSettingsContext';
import AppRoutes from './routes/appRoutes/AppRoutes';
import { ThemeProvider } from './theme/Theme';

const ApolloWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { addNotification } = useNotificationsContext();
  const { getApiToken } = useAuth();

  const apolloClient = useMemo(() => {
    return createApolloClient({ addNotification, getApiToken });
  }, [addNotification, getApiToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

const App: React.FC = () => {
  const matomoTracker = useMemo(
    () =>
      new MatomoTracker({
        urlBase: getValue(import.meta.env.REACT_APP_MATOMO_URL_BASE, ''),
        siteId: import.meta.env.REACT_APP_MATOMO_SITE_ID,
        srcUrl: import.meta.env.REACT_APP_MATOMO_SRC_URL,
        enabled: import.meta.env.REACT_APP_MATOMO_ENABLED === 'true',
        configurations: {
          setDoNotTrack: undefined,
        },
      }),
    []
  );

  const cookieConsentProps = useCookieConsentSettings();

  return (
    <ThemeProvider initTheme={theme}>
      <CookieConsentContextProvider {...cookieConsentProps}>
        <AccessibilityNotificationProvider>
          <NotificationsProvider>
            <LoginProvider {...loginProviderProps}>
              <PageSettingsProvider>
                <BrowserRouter>
                  {/* @ts-ignore */}
                  <MatomoContext.Provider value={matomoTracker}>
                    <ApolloWrapper>
                      <CookieBanner />
                      <AppRoutes />
                    </ApolloWrapper>
                  </MatomoContext.Provider>
                </BrowserRouter>
              </PageSettingsProvider>
            </LoginProvider>
          </NotificationsProvider>
        </AccessibilityNotificationProvider>
      </CookieConsentContextProvider>
    </ThemeProvider>
  );
};

export default App;
