import 'react-toastify/dist/ReactToastify.css';

import { ApolloProvider } from '@apollo/client';
import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { OidcProvider } from 'redux-oidc';

import theme from '../../assets/theme/theme';
import userManager from '../auth/userManager';
import apolloClient from './apollo/apolloClient';
import { CookieConsentProvider } from './cookieConsent/CookieConsentContext';
import AppRoutes from './routes/AppRoutes';
import { store } from './store/store';
import { ThemeProvider } from './theme/Theme';

const getMatomoUrlPath = (path: string) =>
  `${process.env.REACT_APP_MATOMO_URL_BASE}${path}`;

const instance = createInstance({
  disabled: process.env.REACT_APP_MATOMO_ENABLED !== 'true',
  urlBase: process.env.REACT_APP_MATOMO_URL_BASE as string,
  srcUrl:
    process.env.REACT_APP_MATOMO_SRC_URL &&
    getMatomoUrlPath(process.env.REACT_APP_MATOMO_SRC_URL),
  trackerUrl:
    process.env.REACT_APP_MATOMO_TRACKER_URL &&
    getMatomoUrlPath(process.env.REACT_APP_MATOMO_TRACKER_URL),
  siteId: Number(process.env.REACT_APP_MATOMO_SITE_ID),
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <ThemeProvider initTheme={theme}>
          <ToastContainer hideProgressBar={true} theme="colored" />
          <BrowserRouter>
            <CookieConsentProvider>
              <MatomoProvider value={instance}>
                <ApolloProvider client={apolloClient}>
                  <AppRoutes />
                </ApolloProvider>
              </MatomoProvider>
            </CookieConsentProvider>
          </BrowserRouter>
        </ThemeProvider>
      </OidcProvider>
    </Provider>
  );
};

export default App;
