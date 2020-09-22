import './domain/app/i18n/i18nInit';
import './assets/styles/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './domain/app/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
