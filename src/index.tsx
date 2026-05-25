import './domain/app/i18n/i18nInit';
import 'hds-core/lib/base.min.css';
import './assets/styles/main.scss';

import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { getEnvValue } from './common/utils/envUtils';
import App from './domain/app/App';
import { beforeSend, beforeSendTransaction } from './domain/app/sentry/utils';

if (getEnvValue('REACT_APP_SENTRY_DSN')) {
  Sentry.init({
    beforeSend,
    beforeSendTransaction: beforeSendTransaction,
    dsn: getEnvValue('REACT_APP_SENTRY_DSN'),
    environment: getEnvValue('REACT_APP_SENTRY_ENVIRONMENT'),
    release: getEnvValue('REACT_APP_SENTRY_RELEASE'),
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
    ],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: parseFloat(
      getEnvValue('REACT_APP_SENTRY_TRACES_SAMPLE_RATE') || '0'
    ),
    tracePropagationTargets: (
      getEnvValue('REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS') || ''
    ).split(','),
    replaysSessionSampleRate: parseFloat(
      getEnvValue('REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE') || '0'
    ),
    replaysOnErrorSampleRate: parseFloat(
      getEnvValue('REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE') || '0'
    ),
  });
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
