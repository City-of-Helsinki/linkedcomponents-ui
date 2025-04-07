import './domain/app/i18n/i18nInit';
import 'focus-visible';
import 'hds-core/lib/base.min.css';
import './assets/styles/main.scss';

import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './domain/app/App';
import { beforeSend, beforeSendTransaction } from './domain/app/sentry/utils';

if (import.meta.env.REACT_APP_SENTRY_ENVIRONMENT) {
  Sentry.init({
    beforeSend,
    beforeSendTransaction: beforeSendTransaction,
    dsn: import.meta.env.REACT_APP_SENTRY_DSN,
    environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
    ],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Capture 100% of spans. This is useful for development and debugging.
    // Consider reducing in production or using traceSampler
    tracesSampleRate: 1.0,
    tracePropagationTargets: [
      'http://localhost:8080',
      'https://linkedevents.api.dev.hel.ninja',
    ],
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
