import * as Sentry from '@sentry/browser';
import * as H from 'history';

import { UserFieldsFragment } from '../../../generated/graphql';

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
        user,
        userAgent: navigator.userAgent,
        errorAsString: JSON.stringify(error),
      },
      level: 'error',
    },
  };

  return Sentry.captureException(message, reportObject);
};

export { reportError };
