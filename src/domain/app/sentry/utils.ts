import * as Sentry from '@sentry/browser';
import * as H from 'history';

import { UserFieldsFragment } from '../../../generated/graphql';

const reportError = ({
  data,
  location,
  message,
  user,
}: {
  data?: Record<string, unknown>;
  location: H.Location;
  message: string;
  user?: UserFieldsFragment;
}): string => {
  const reportObject = {
    extra: {
      data: {
        currentUrl: window.location.href,
        location,
        timestamp: new Date(),
        user,
        userAsString: user ? JSON.stringify(user) : '',
        userAgent: navigator.userAgent,
        ...data,
      },
      level: 'error',
    },
  };
  return Sentry.captureException(message, reportObject);
};

export { reportError };
