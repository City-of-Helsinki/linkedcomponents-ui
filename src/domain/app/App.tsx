import 'react-toastify/dist/ReactToastify.css';

import { ApolloProvider } from '@apollo/client';
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager}>
        <ThemeProvider initTheme={theme}>
          <ToastContainer />
          <BrowserRouter>
            <CookieConsentProvider>
              <ApolloProvider client={apolloClient}>
                <AppRoutes />
              </ApolloProvider>
            </CookieConsentProvider>
          </BrowserRouter>
        </ThemeProvider>
      </OidcProvider>
    </Provider>
  );
};

export default App;
