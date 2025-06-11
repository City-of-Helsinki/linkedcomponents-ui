import { ErrorEvent, TransactionEvent } from '@sentry/core';
import * as Sentry from '@sentry/react';
import * as H from 'history';
import snakeCase from 'lodash/snakeCase';

import { UserFieldsFragment } from '../../../generated/graphql';

// https://github.com/getsentry/sentry-python/blob/8094c9e4462c7af4d73bfe3b6382791f9949e7f0/sentry_sdk/scrubber.py#L14
const DEFAULT_DENYLIST = [
  // stolen from relay
  'password',
  'passwd',
  'secret',
  'api_key',
  'apikey',
  'auth',
  'credentials',
  'mysql_pwd',
  'privatekey',
  'private_key',
  'token',
  'ip_address',
  'session',
  // django
  'csrftoken',
  'sessionid',
  // wsgi
  'remote_addr',
  'x_csrftoken',
  'x_forwarded_for',
  'set_cookie',
  'cookie',
  'authorization',
  'x_api_key',
  'x_forwarded_for',
  'x_real_ip',
  // other common names used in the wild
  'aiohttp_session', // aiohttp
  'connect.sid', // Express
  'csrf_token', // Pyramid
  'csrf', // (this is a cookie name used in accepted answers on stack overflow)
  '_csrf', // Express
  '_csrf_token', // Bottle
  'PHPSESSID', // PHP
  '_session', // Sanic
  'symfony', // Symfony
  'user_session', // Vue
  '_xsrf', // Tornado
  'XSRF-TOKEN', // Angular, Laravel
];

const SENTRY_DENYLIST = [
  ...DEFAULT_DENYLIST,
  'access_code',
  'city',
  'date_of_birth',
  'email',
  'extra_info',
  'first_name',
  'last_name',
  'membership_number',
  'native_language',
  'phone_number',
  'postal_code',
  'service_language',
  'street_address',
  'user_email',
  'user_name',
  'user_phone_number',
  'zipcode',
];

const MAX_CLEAN_DEPTH = 32;

export const cleanSensitiveData = (
  data: unknown,
  visited = new WeakMap<object, unknown>(),
  depth = 0,
  maxDepth = MAX_CLEAN_DEPTH
): unknown => {
  if (depth > maxDepth) {
    return '[MaxDepthExceeded]';
  }

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  // To avoid infinite recursion for circular references
  if (visited.has(data)) {
    return visited.get(data);
  }

  if (Array.isArray(data)) {
    const result: unknown[] = [];
    visited.set(data, result);
    for (const item of data) {
      result.push(cleanSensitiveData(item, visited, depth + 1, maxDepth));
    }
    return result;
  }

  const result: Record<string, unknown> = {};
  visited.set(data, result);

  for (const [key, value] of Object.entries(data)) {
    if (
      SENTRY_DENYLIST.includes(key) ||
      SENTRY_DENYLIST.includes(snakeCase(key))
    ) {
      continue; // omit sensitive key
    }
    result[key] = cleanSensitiveData(value, visited, depth + 1, maxDepth);
  }

  return result;
};

export const beforeSend = (event: ErrorEvent): ErrorEvent =>
  cleanSensitiveData(event) as ErrorEvent;

export const beforeSendTransaction = (
  event: TransactionEvent
): TransactionEvent => cleanSensitiveData(event) as TransactionEvent;

const reportError = ({
  data,
  location,
  message,
  user,
}: {
  data: { error: Record<string, unknown> } & Record<string, unknown>;
  location: H.Location;
  message: string;
  user?: UserFieldsFragment;
}): string => {
  const { error, ...restData } = data;
  const reportObject = {
    extra: {
      data: {
        ...restData,
        currentUrl: window.location.href,
        location,
        timestamp: new Date(),
        user: user?.username,
        userAgent: navigator.userAgent,
        errorAsString: JSON.stringify(error),
      },
      level: 'error',
    },
  };

  return Sentry.captureException(message, reportObject);
};

export { reportError };
