/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ApolloProvider } from '@apollo/client';
import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import React, { PropsWithChildren, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../assets/theme/theme';
import getValue from '../../utils/getValue';
import { AuthProvider } from '../auth/AuthContext';
import userManager from '../auth/userManager';
import { createApolloClient } from './apollo/apolloClient';
import CookieConsent from './cookieConsent/CookieConsent';
import { useNotificationsContext } from './notificationsContext/hooks/useNotificationsContext';
import { NotificationsProvider } from './notificationsContext/NotificationsContext';
import { PageSettingsProvider } from './pageSettingsContext/PageSettingsContext';
import AppRoutes from './routes/appRoutes/AppRoutes';
import { ThemeProvider } from './theme/Theme';

const getMatomoUrlPath = (path: string) =>
  `${process.env.REACT_APP_MATOMO_URL_BASE}${path}`;

const instance = createInstance({
  disabled: process.env.REACT_APP_MATOMO_ENABLED !== 'true',
  urlBase: getValue(process.env.REACT_APP_MATOMO_URL_BASE, ''),
  srcUrl:
    process.env.REACT_APP_MATOMO_SRC_URL &&
    getMatomoUrlPath(process.env.REACT_APP_MATOMO_SRC_URL),
  trackerUrl:
    process.env.REACT_APP_MATOMO_TRACKER_URL &&
    getMatomoUrlPath(process.env.REACT_APP_MATOMO_TRACKER_URL),
  siteId: Number(process.env.REACT_APP_MATOMO_SITE_ID),
});

const ApolloWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { addNotification } = useNotificationsContext();

  const apolloClient = useMemo(
    () => createApolloClient({ addNotification }),
    [addNotification]
  );

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider initTheme={theme}>
      <NotificationsProvider>
        <AuthProvider userManager={userManager}>
          <PageSettingsProvider>
            <BrowserRouter>
              {/* @ts-ignore */}
              <MatomoProvider value={instance}>
                <ApolloWrapper>
                  <CookieConsent />
                  <AppRoutes />
                </ApolloWrapper>
              </MatomoProvider>
            </BrowserRouter>
          </PageSettingsProvider>
        </AuthProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
};

export default App;
