/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ApolloProvider } from '@apollo/client';
import { LoginProvider, useApiTokensClient, useOidcClient } from 'hds-react';
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../assets/theme/theme';
import { MatomoContext } from '../../common/components/matomoTracker/matomo-context';
import MatomoTracker from '../../common/components/matomoTracker/MatomoTracker';
import getValue from '../../utils/getValue';
import { loginProviderProps } from '../auth/constants';
import { createApolloClient } from './apollo/apolloClient';
import CookieConsent from './cookieConsent/CookieConsent';
import { useNotificationsContext } from './notificationsContext/hooks/useNotificationsContext';
import { NotificationsProvider } from './notificationsContext/NotificationsContext';
import { PageSettingsProvider } from './pageSettingsContext/PageSettingsContext';
import AppRoutes from './routes/appRoutes/AppRoutes';
import { ThemeProvider } from './theme/Theme';

const RefreshApiTokenOnLoad: React.FC = () => {
  const { getUser } = useOidcClient();
  const { fetch: fetchApiTokens } = useApiTokensClient();
  const isFetchingStarted = useRef(false);

  useEffect(() => {
    // Refresh api tokens when page is loaded if the user is already authenticated.
    // Reason for this is to make sure that expired api token is not used.
    // That might happen if page is refreshed after refreshing access token. In that case
    // api token is not refreshed  and might be expired already.
    // The information about api token expiration time is not stored anywhere.
    const fetchNewApiToken = async () => {
      const user = getUser();
      if (user && !isFetchingStarted.current) {
        isFetchingStarted.current = true;
        fetchApiTokens(user);
      }
    };

    fetchNewApiToken();
  });

  return null;
};

const ApolloWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { addNotification } = useNotificationsContext();

  const apolloClient = useMemo(
    () => createApolloClient({ addNotification }),
    [addNotification]
  );

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

  return (
    <ThemeProvider initTheme={theme}>
      <NotificationsProvider>
        <LoginProvider {...loginProviderProps}>
          <RefreshApiTokenOnLoad />
          <PageSettingsProvider>
            <BrowserRouter>
              {/* @ts-ignore */}
              <MatomoContext.Provider value={matomoTracker}>
                <ApolloWrapper>
                  <CookieConsent />
                  <AppRoutes />
                </ApolloWrapper>
              </MatomoContext.Provider>
            </BrowserRouter>
          </PageSettingsProvider>
        </LoginProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
};

export default App;
