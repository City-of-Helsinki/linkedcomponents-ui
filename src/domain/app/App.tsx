import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../assets/theme/theme';
import apolloClient from './apollo/apolloClient';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './theme/Theme';

const App: React.FC = () => (
  <ThemeProvider initTheme={theme}>
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <AppRoutes />
      </ApolloProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
