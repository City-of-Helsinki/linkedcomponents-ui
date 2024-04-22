/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ApolloProvider } from '@apollo/client';
import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import { LoginProvider, useApiTokensClient, useOidcClient } from 'hds-react';
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../assets/theme/theme';
import { AccessibilityNotificationProvider } from '../../common/components/accessibilityNotificationContext/AccessibilityNotificationContext';
import getValue from '../../utils/getValue';
import { loginProviderProps } from '../auth/constants';
import { createApolloClient } from './apollo/apolloClient';
import CookieConsent from './cookieConsent/CookieConsent';
import { useNotificationsContext } from './notificationsContext/hooks/useNotificationsContext';
import { NotificationsProvider } from './notificationsContext/NotificationsContext';
import { PageSettingsProvider } from './pageSettingsContext/PageSettingsContext';
import AppRoutes from './routes/appRoutes/AppRoutes';
import { ThemeProvider } from './theme/Theme';

const getMatomoUrlPath = (path: string) =>
  `${import.meta.env.REACT_APP_MATOMO_URL_BASE}${path}`;

const instance = createInstance({
  disabled: import.meta.env.REACT_APP_MATOMO_ENABLED !== 'true',
  urlBase: getValue(import.meta.env.REACT_APP_MATOMO_URL_BASE, ''),
  srcUrl:
    import.meta.env.REACT_APP_MATOMO_SRC_URL &&
    getMatomoUrlPath(import.meta.env.REACT_APP_MATOMO_SRC_URL),
  trackerUrl:
    import.meta.env.REACT_APP_MATOMO_TRACKER_URL &&
    getMatomoUrlPath(import.meta.env.REACT_APP_MATOMO_TRACKER_URL),
  siteId: Number(import.meta.env.REACT_APP_MATOMO_SITE_ID),
});

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
  return (
    <ThemeProvider initTheme={theme}>
      <AccessibilityNotificationProvider>
        <NotificationsProvider>
          <LoginProvider {...loginProviderProps}>
            <RefreshApiTokenOnLoad />
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
          </LoginProvider>
        </NotificationsProvider>
      </AccessibilityNotificationProvider>
    </ThemeProvider>
  );
};

export default App;
