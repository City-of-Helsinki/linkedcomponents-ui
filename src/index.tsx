import './domain/app/i18n/i18nInit';
import 'focus-visible';
import 'hds-core/lib/base.min.css';
import './assets/styles/main.scss';

import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './domain/app/App';

if (import.meta.env.VITE_SENTRY_ENVIRONMENT) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
    ],
  });
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
