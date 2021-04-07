import './domain/app/i18n/i18nInit';
import 'focus-visible';
import 'hds-core/lib/base.css';
import './assets/styles/main.scss';

import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './domain/app/App';

if (process.env.REACT_APP_SENTRY_ENVIRONMENT) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
