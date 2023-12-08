/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User } from 'oidc-client-ts';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import CallbackComponent from '../callbackComponent/CallbackComponent';
import { OidcUserState } from '../types';
import userManager from '../userManager';

const OidcCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onSuccess = (user: User) => {
    const path = (user.state as OidcUserState).path;
    if (path) navigate(path);
    else navigate('/', { replace: true });
  };

  const onError = () => {
    // In case used denies the access
    if (new URLSearchParams(location.hash.replace('#', '?')).get('error')) {
      navigate('/', { replace: true });
    }
  };

  return (
    <CallbackComponent
      successCallback={onSuccess}
      errorCallback={onError}
      userManager={userManager}
    />
  );
};

export default OidcCallback;
