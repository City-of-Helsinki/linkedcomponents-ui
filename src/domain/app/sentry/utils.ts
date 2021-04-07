import * as Sentry from '@sentry/browser';
import * as H from 'history';
import GitInfo from 'react-git-info/macro';

import { UserFieldsFragment } from '../../../generated/graphql';

const reportError = ({
  data,
  location,
  message,
  user,
}: {
  data?: Record<string, any>;
  location: H.Location;
  message: string;
  user?: UserFieldsFragment;
}) => {
  const gitInfo = GitInfo();
  const reportObject = {
    extra: {
      data: {
        branch: gitInfo.branch,
        commit: gitInfo.commit,
        currentUrl: window.location.href,
        location,
        tags: gitInfo.tags,
        timestamp: new Date(),
        user,
        userAsString: user ? JSON.stringify(user) : '',
        userAgent: navigator.userAgent,
        ...data,
      },
      level: 'error',
    },
  };
  Sentry.captureException(message, reportObject);
};

export { reportError };
