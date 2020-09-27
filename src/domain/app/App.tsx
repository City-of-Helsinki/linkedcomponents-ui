import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../assets/theme/theme';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './theme/Theme';

const App: React.FC = () => (
  <ThemeProvider initTheme={theme}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
