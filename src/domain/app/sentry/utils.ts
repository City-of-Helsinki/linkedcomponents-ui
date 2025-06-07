import { ErrorEvent, TransactionEvent } from '@sentry/core';
import * as Sentry from '@sentry/react';
import * as H from 'history';
import isObject from 'lodash/isObject';
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

export const cleanSensitiveData = (
  data: unknown,
  visited = new Set<unknown>()
): unknown => {
  // To avoid infinite recursion for circular references
  if (visited.has(data)) {
    return data;
  }
  visited.add(data);

  if (Array.isArray(data)) {
    // Clone array and clean each item
    return data.map((item) =>
      isObject(item) || Array.isArray(item)
        ? cleanSensitiveData(item, visited)
        : item
    );
  }

  if (isObject(data)) {
    // Clone object before mutation
    const clone: Record<string, unknown> = { ...data };
    Object.entries(clone).forEach(([key, value]) => {
      if (
        SENTRY_DENYLIST.includes(key) ||
        SENTRY_DENYLIST.includes(snakeCase(key))
      ) {
        delete clone[key];
      } else if (Array.isArray(value) || isObject(value)) {
        clone[key] = cleanSensitiveData(value, visited);
      }
    });
    return clone;
  }

  // Primitive value, return as is
  return data;
};

export const beforeSend = (event: ErrorEvent): ErrorEvent =>
  cleanSensitiveData(
    event as unknown as Record<string, unknown>
  ) as unknown as ErrorEvent;

export const beforeSendTransaction = (
  event: TransactionEvent
): TransactionEvent =>
  cleanSensitiveData(
    event as unknown as Record<string, unknown>
  ) as unknown as TransactionEvent;

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
