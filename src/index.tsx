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
      // Thrown by browser extensions (e.g. translate, ad blockers) manipulating the DOM, not actionable.
      'Invalid call to runtime.sendMessage',
      "Failed to execute 'insertBefore' on 'Node'",
      'The object can not be found here.',
      'Object Not Found Matching Id',
      // Native postMessage calls from embedded third-party scripts with non-cloneable payloads.
      'The object can not be cloned.',
      // CKEditor's internal renderer occasionally loses track of DOM nodes removed by extensions.
      'view-renderer-filler-was-lost',
      // Stale JS/CSS chunks after a new deployment; user gets a fresh copy on next navigation/reload.
      'Failed to fetch dynamically imported module',
      'error loading dynamically imported module',
      'Importing a module script failed',
      'Unable to preload CSS',
      // Safari rejects failed dynamic import()/image loads with a raw DOM Event instead of an Error.
      'captured as promise rejection',
    ],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: Number.parseFloat(
      getEnvValue('REACT_APP_SENTRY_TRACES_SAMPLE_RATE') || '0'
    ),
    tracePropagationTargets: (
      getEnvValue('REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS') || ''
    ).split(','),
    replaysSessionSampleRate: Number.parseFloat(
      getEnvValue('REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE') || '0'
    ),
    replaysOnErrorSampleRate: Number.parseFloat(
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
