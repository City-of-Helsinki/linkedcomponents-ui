import * as Sentry from '@sentry/browser';
import { User } from 'oidc-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteChildrenProps, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { CallbackComponent } from 'redux-oidc';

import userManager from '../userManager';

interface Error {
  stack?: string;
}

const OidcCallback = (props: RouteChildrenProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const onSuccess = (user: User) => {
    if (user.state.path) props.history.push(user.state.path);
    else props.history.replace('/');
  };

  const onError = (error: Error) => {
    // In case used denies the access
    if (new URLSearchParams(location.hash.replace('#', '?')).get('error')) {
      // TODO: Store url where user clicked log in to session storage and navigate to that url
      props.history.replace('/');
    } else {
      toast(t('authentication.errorMessage'), {
        type: toast.TYPE.ERROR,
      });
      // Make sure that we only send errors to Sentry that are actual
      // programming/system errors, not end users's network errors.
      Sentry.captureException(error);
    }
  };

  return (
    <CallbackComponent
      successCallback={onSuccess}
      errorCallback={onError}
      userManager={userManager}
    >
      <div />
    </CallbackComponent>
  );
};

export default OidcCallback;
