import './domain/app/i18n/i18nInit';
import 'focus-visible';
import 'hds-core/lib/base.min.css';
import './assets/styles/main.scss';

import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './domain/app/App';
import { beforeSend, beforeSendTransaction } from './domain/app/sentry/utils';

// Handle dynamic import errors (e.g., when chunk files are not found after a deployment)
// This typically happens when a user has a cached index.html that references old chunk files
window.addEventListener('vite:preloadError', (event) => {
  // Reload the page to fetch the fresh index.html with correct chunk references
  window.location.reload();
});

if (import.meta.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    beforeSend,
    beforeSendTransaction: beforeSendTransaction,
    dsn: import.meta.env.REACT_APP_SENTRY_DSN,
    environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
    release: import.meta.env.REACT_APP_SENTRY_RELEASE,
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
    ],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: parseFloat(
      import.meta.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || '0'
    ),
    tracePropagationTargets: (
      import.meta.env.REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS || ''
    ).split(','),
    replaysSessionSampleRate: parseFloat(
      import.meta.env.REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0'
    ),
    replaysOnErrorSampleRate: parseFloat(
      import.meta.env.REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '0'
    ),
  });
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
